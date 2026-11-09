#!/usr/bin/env node
// Daily social insights (QUEUE G17, owner 2026-11-07): reads Zernio post analytics
// (GET /v1/analytics, source=late; docs: zernio-php docs/Api/AnalyticsApi.md and
// docs/Model/PostAnalytics.md, read 2026-11-07) for the posts our own receipts list, and writes a
// small public-safe summary per publishing month to ops/social-insights/YYYY-MM.json.
//
// Public-safe: only our own posts' counts and watch metrics. No post text, account ids,
// usernames, thumbnails, audience countries, audience types or impression sources.
// Metrics are absolute values, so each run replaces the previous reading.
//
// Run by .github/workflows/social-insights.yml with the ZERNIO_API_KEY secret. The key is never
// printed or written. `--dry-run` reads a saved API response instead of calling Zernio.

import { readFileSync, readdirSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
export const ZERNIO_API = "https://zernio.com/api/v1";
export const WINDOW_DAYS = 35; // posts older than this keep their last reading
const PAGE_LIMIT = 50;
const MAX_PAGES = 20;

const num = (v) => (typeof v === "number" && Number.isFinite(v) ? v : null);
const round = (v, d = 1) => (v === null ? null : Math.round(v * 10 ** d) / 10 ** d);

// New York calendar date of an ISO timestamp.
export function nyDate(iso) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(iso));
}

// Our posted receipts (ops/social-receipts/<date>/*.json) that went through Zernio.
export function readReceipts(dir = join(ROOT, "ops/social-receipts")) {
  const out = [];
  for (const day of readdirSync(dir).filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d)).sort()) {
    for (const f of readdirSync(join(dir, day)).filter((f) => f.endsWith(".json")).sort()) {
      const r = JSON.parse(readFileSync(join(dir, day, f), "utf8"));
      if (r.status === "posted" && r.via === "zernio" && r.remote_id) out.push(r);
    }
  }
  return out;
}

// Keep only the metrics that help judge a post, in plain units.
export function metricsOf(a = {}, platform = "instagram", media = "reel") {
  const curve = a.retentionCurve && typeof a.retentionCurve === "object" ? a.retentionCurve : {};
  const m = {
    views: num(a.views),
    reach: num(a.reach),
    impressions: num(a.impressions),
    likes: num(a.likes),
    comments: num(a.comments),
    shares: num(a.shares),
    saves: num(a.saves),
    follows: num(a.follows),
    profile_views: num(a.profileViews),
    link_clicks: num(a.websiteClicks),
    avg_watch_s: round(num(a.igReelsAvgWatchTime) === null ? null : a.igReelsAvgWatchTime / 1000),
    skip_rate_pct: round(num(a.reelsSkipRate)),
    video_s: num(a.videoDurationSeconds),
    still_watching_3s: round(num(curve["3"]), 2),
    engagement_rate_pct: round(num(a.engagementRate), 2),
  };
  // Skip rate is an Instagram Reels metric; other platforms report 0, which would read as "nobody skipped".
  if (platform !== "instagram" || media !== "reel") m.skip_rate_pct = null;
  if (media !== "reel") { m.avg_watch_s = null; m.still_watching_3s = null; m.video_s = null; } // image posts have no watch time
  for (const k of Object.keys(m)) if (m[k] === null) delete m[k];
  return m;
}

// The analytics block for one receipt: the platform entry for that platform, else the post total.
function analyticsFor(post, platform) {
  const entry = (post.platforms ?? post.platformAnalytics ?? []).find((p) => p.platform === platform);
  return { analytics: entry?.analytics ?? post.analytics ?? {}, sync: entry?.syncStatus ?? post.syncStatus ?? null, error: entry?.errorCode ?? null };
}

// receipts + API posts → { "YYYY-MM": [rows] }. Receipts with no API match are listed as "not_found".
export function summarize(receipts, apiPosts, today) {
  const byId = new Map();
  for (const p of apiPosts) for (const id of [p._id, p.postId, p.latePostId]) if (id) byId.set(id, p);
  const months = {};
  for (const r of receipts) {
    const post = byId.get(r.remote_id);
    const row = {
      entry_id: r.entry_id,
      item_id: r.item_id,
      platform: r.platform,
      media: r.media ?? "image",
      posted_on: nyDate(r.posted_at),
      url: r.url ?? null,
    };
    if (r.reel_photo) row.reel_photo = r.reel_photo;
    if (r.reel_music) row.reel_music = r.reel_music;
    if (post) {
      const { analytics, sync, error } = analyticsFor(post, r.platform);
      if (post.mediaProductType) row.ig_type = post.mediaProductType;
      row.metrics = metricsOf(analytics, r.platform, row.media);
      if (analytics.lastUpdated) row.metrics_as_of = analytics.lastUpdated;
      if (sync) row.sync = sync;
      if (error) row.error = error;
    } else {
      row.sync = "not_found";
    }
    row.checked_on = today;
    (months[row.posted_on.slice(0, 7)] ??= []).push(row);
  }
  for (const rows of Object.values(months)) rows.sort((a, b) => a.posted_on.localeCompare(b.posted_on) || a.entry_id.localeCompare(b.entry_id) || a.platform.localeCompare(b.platform));
  return months;
}

// Merge with a month file already on disk: a post outside this run's window keeps its last reading.
export function mergeMonth(existing, fresh) {
  const key = (r) => `${r.entry_id}|${r.platform}`;
  const rows = new Map((existing?.posts ?? []).map((r) => [key(r), r]));
  for (const r of fresh) {
    const old = rows.get(key(r));
    // Never overwrite a real reading with an empty one (post past the API window, a failed sync, no access).
    const has = (x) => Boolean(x?.metrics && Object.keys(x.metrics).length);
    if (old && has(old) && !has(r)) continue;
    rows.set(key(r), r);
  }
  return [...rows.values()].sort((a, b) => a.posted_on.localeCompare(b.posted_on) || a.entry_id.localeCompare(b.entry_id) || a.platform.localeCompare(b.platform));
}

async function fetchAll(key, fromDate) {
  const posts = [];
  let access = null;
  for (let page = 1; page <= MAX_PAGES; page++) {
    const q = new URLSearchParams({ source: "late", fromDate, limit: String(PAGE_LIMIT), page: String(page) });
    const res = await fetch(`${ZERNIO_API}/analytics?${q}`, { headers: { authorization: `Bearer ${key}` } });
    const text = await res.text();
    if (!res.ok) {
      let code = "";
      try { code = JSON.parse(text).code ?? JSON.parse(text).error ?? ""; } catch {}
      throw new Error(`Zernio analytics HTTP ${res.status} ${String(code).slice(0, 80)}`);
    }
    const body = JSON.parse(text);
    if (typeof body.hasAnalyticsAccess === "boolean") access = body.hasAnalyticsAccess;
    posts.push(...(body.posts ?? []));
    const pages = body.pagination?.pages ?? 1;
    if (page >= pages || (body.posts ?? []).length < PAGE_LIMIT) break;
    await new Promise((r) => setTimeout(r, 1500)); // analytics has a stricter per-second limit
  }
  return { posts, access };
}

async function main(argv) {
  const dry = argv.includes("--dry-run");
  const outDir = argv.includes("--out") ? argv[argv.indexOf("--out") + 1] : join(ROOT, "ops/social-insights");
  const today = nyDate(new Date().toISOString());
  const from = new Date(Date.now() - WINDOW_DAYS * 864e5).toISOString().slice(0, 10);
  const receipts = readReceipts().filter((r) => nyDate(r.posted_at) >= from);
  let posts, access;
  if (dry) {
    const file = argv[argv.indexOf("--dry-run") + 1];
    ({ posts = [], hasAnalyticsAccess: access = null } = file && existsSync(file) ? JSON.parse(readFileSync(file, "utf8")) : {});
  } else {
    const key = process.env.ZERNIO_API_KEY;
    if (!key) { console.log("::notice::No ZERNIO_API_KEY; nothing read."); return 0; }
    ({ posts, access } = await fetchAll(key, from));
  }
  if (access === false) { console.log("::warning::Zernio reports no analytics access for this account; nothing written."); return 0; }
  const months = summarize(receipts, posts, today);
  mkdirSync(outDir, { recursive: true });
  let matched = 0;
  for (const [month, rows] of Object.entries(months)) {
    const file = join(outDir, `${month}.json`);
    const existing = existsSync(file) ? JSON.parse(readFileSync(file, "utf8")) : null;
    const merged = mergeMonth(existing, rows);
    matched += rows.filter((r) => r.metrics).length;
    const doc = {
      note: "Our own posts' numbers from Zernio analytics (QUEUE G17). Public-safe summary: counts and watch metrics only. avg_watch_s is Reels only; skip_rate_pct is Instagram Reels only, Meta's estimate of views that left in the first 3 seconds; still_watching_3s is Facebook's share of plays still watching at 3 s. See README.md.",
      month,
      analytics_access: access,
      checked_on: today,
      posts: merged,
    };
    writeFileSync(file, JSON.stringify(doc, null, 2) + "\n");
  }
  console.log(`Insights: ${receipts.length} receipts in window, ${posts.length} Zernio posts read, ${matched} matched; analytics access: ${access}.`);
  return 0;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main(process.argv.slice(2)).then((c) => process.exit(c), (e) => { console.error(e.message); process.exit(1); });
}
