// Social posting (QUEUE G04, OWNER D12). Posts the due entries of today's ops/social-queue file,
// platform by platform, only for platforms whose credentials are present. Run by
// .github/workflows/social-post.yml with repository secrets; the operator never handles tokens.
//
// Usage:
//   node tools/social-post.mjs              live: post due entries, receipts committed to main
//   node tools/social-post.mjs --dry-run    simulated platforms, fake credentials, no commits;
//                                           receipts go to --receipts-out (default: a temp dir)
//   options: --now <ISO time>  --receipts-out <dir>
//
// Safety rules (each is tested in tools/social-post.test.mjs):
// - Kill switch: the OWNER.md D12 row must read "— Approved" (re-read from the latest main before
//   every post); "Paused" or any other wording stops all posting.
// - Only today's (America/New_York) queue, and only if tools/social-queue.mjs validateQueue() finds
//   no problem against today's verified records. A missed day is never backfilled.
// - An entry is due from scheduled_at until expires_at; never after expires_at.
// - Never post twice: a receipt (ops/social-receipts/<date>/<entry>--<platform>.json) is claimed
//   on main *before* the post. Any existing receipt, whatever its status, means never again.
// - Per-platform daily caps (DAILY_CAPS), counting every claimed receipt, and at most one post per
//   platform per run so a late run cannot burst.
// - The variant's link target and the card image must answer 200 on familytripwise.com before posting.
// - A platform with a read-only preflight (Pinterest: the board must answer to the token) is checked
//   before the receipt is claimed, so an expired token or wrong board never burns an entry.
// - Links travel outside Threads text (link attachment); text holding a URL is refused.
//   Credentials are sent in headers or POST bodies, never in URLs, and are redacted from any
//   recorded error.
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { easternDate } from "./page-generation/sitemap.mjs";
import { DAILY_CAPS, LIMITS, SITE, queueDir, readQueue, root, validateQueue } from "./social-queue.mjs";

export const RECEIPTS = "ops/social-receipts";
export const GRAPH_VERSION_DEFAULT = "v26.0"; // Graph API v26.0 listed in Meta's changelog (checked 2026-10-28)

// Phase 0 platforms (OWNER D12, revised 2026-10-28: Pinterest in, Bluesky out) and the secrets each
// needs. Others are never posted by this tool yet.
export const PINTEREST_API = "https://api.pinterest.com/v5"; // Pinterest API v5 (docs read 2026-10-28)
export const PINTEREST_ALT_MAX = 500;
export const CREDENTIALS = {
  threads: ["THREADS_USER_ID", "THREADS_TOKEN"],
  facebook: ["META_SYSTEM_USER_TOKEN", "META_PAGE_ID"],
  instagram: ["META_SYSTEM_USER_TOKEN", "META_PAGE_ID", "IG_USER_ID"],
  pinterest: ["PINTEREST_TOKEN", "PINTEREST_BOARD_ID"],
};
export const POSTING_PLATFORMS = Object.keys(CREDENTIALS);

export function killSwitchOpen(ownerText) {
  const row = (ownerText ?? "").split("\n").find((l) => /^- D12\b/.test(l));
  // The status is the word right after the first "— "; the row's own text mentions "Paused".
  return Boolean(row) && /^- D12 [^—]*— Approved\b/.test(row);
}

export function enabledPlatforms(env) {
  return POSTING_PLATFORMS.filter((p) => CREDENTIALS[p].every((k) => (env[k] ?? "").trim() !== ""));
}

export const receiptKey = (date, entryId, platform) => `${RECEIPTS}/${date}/${entryId}--${platform}.json`;

// Picks at most one entry per enabled platform. `claimed(date)` lists receipt file names for that date.
export function planPosts({ queue, now, platforms, claimedNames }) {
  const plan = [];
  const t = now.getTime();
  for (const platform of platforms) {
    const used = claimedNames.filter((n) => n.endsWith(`--${platform}.json`)).length;
    if (used >= DAILY_CAPS[platform]) continue;
    const entry = queue.entries.find((e) =>
      e.platforms?.[platform] &&
      Date.parse(e.scheduled_at) <= t && t < Date.parse(e.expires_at) &&
      !claimedNames.includes(`${e.id}--${platform}.json`));
    if (entry) plan.push({ platform, entry });
  }
  return plan;
}

const runtimeSecrets = new Set(); // derived tokens (e.g. the Page token), redacted like env secrets
export function sanitize(message, env) {
  let m = String(message ?? "");
  for (const v of runtimeSecrets) m = m.split(v).join("[redacted]");
  for (const k of new Set(Object.values(CREDENTIALS).flat())) if (env[k] && env[k].length >= 4) m = m.split(env[k]).join("[redacted]");
  return m.replace(/(access_token|password|accessJwt|refresh_token)=?["':\s]*[^\s"'&,}]+/gi, "$1=[redacted]").slice(0, 300);
}

// ---------- platform adapters (all HTTP goes through the injected fetch) ----------

async function json(res, what) {
  const body = await res.text();
  let data = null;
  try { data = JSON.parse(body); } catch { /* not JSON */ }
  if (!res.ok) throw new Error(`${what}: HTTP ${res.status} ${(data?.error?.message ?? data?.message ?? body).toString().slice(0, 200)}`);
  return data ?? {};
}
const form = (o) => new URLSearchParams(Object.entries(o).filter(([, v]) => v !== undefined && v !== null));

export const adapters = {
  async threads({ variant, env, fetch, sleep }) {
    const base = `https://graph.threads.net/v1.0/${encodeURIComponent(env.THREADS_USER_ID)}`;
    const headers = { "content-type": "application/x-www-form-urlencoded" };
    const created = await json(await fetch(`${base}/threads`, { method: "POST", headers, body: form({ media_type: "TEXT", text: variant.text, link_attachment: variant.link, access_token: env.THREADS_TOKEN }) }), "threads container");
    await sleep(30000); // Meta recommends ~30 s before publishing a container
    const published = await json(await fetch(`${base}/threads_publish`, { method: "POST", headers, body: form({ creation_id: created.id, access_token: env.THREADS_TOKEN }) }), "threads publish");
    return { remote_id: published.id, url: null };
  },

  async facebook({ variant, env, fetch, graph }) {
    const page = await pageToken({ env, fetch, graph });
    const out = await json(await fetch(`${graph}/${encodeURIComponent(env.META_PAGE_ID)}/feed`, {
      method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" },
      body: form({ message: variant.text, link: variant.link, access_token: page }),
    }), "facebook post");
    return { remote_id: out.id, url: out.id ? `https://www.facebook.com/${out.id}` : null };
  },

  async instagram({ entry, variant, env, fetch, graph, sleep }) {
    const token = await pageToken({ env, fetch, graph });
    const ig = `${graph}/${encodeURIComponent(env.IG_USER_ID)}`;
    const headers = { "content-type": "application/x-www-form-urlencoded" };
    const container = await json(await fetch(`${ig}/media`, { method: "POST", headers, body: form({ image_url: entry.image.url, caption: variant.text, alt_text: entry.image.alt, access_token: token }) }), "instagram container");
    let status = "IN_PROGRESS";
    for (let i = 0; i < 10 && status === "IN_PROGRESS"; i += 1) {
      await sleep(15000);
      const s = await json(await fetch(`${graph}/${encodeURIComponent(container.id)}?fields=status_code`, { headers: { authorization: `Bearer ${token}` } }), "instagram status");
      status = s.status_code ?? "UNKNOWN";
    }
    if (status !== "FINISHED") throw new Error(`instagram container status ${status}; not published`);
    const out = await json(await fetch(`${ig}/media_publish`, { method: "POST", headers, body: form({ creation_id: container.id, access_token: token }) }), "instagram publish");
    return { remote_id: out.id, url: null };
  },

  // Pinterest API v5: POST /v5/pins with the public card JPEG, title, description, link and alt text.
  async pinterest({ entry, variant, env, fetch }) {
    const out = await json(await fetch(`${PINTEREST_API}/pins`, {
      method: "POST", headers: { authorization: `Bearer ${env.PINTEREST_TOKEN}`, "content-type": "application/json" },
      body: JSON.stringify({
        board_id: env.PINTEREST_BOARD_ID, title: variant.title, description: variant.text, link: variant.link,
        alt_text: entry.image.alt, media_source: { source_type: "image_url", url: entry.image.url },
      }),
    }), "pinterest pin");
    if (!out.id) throw new Error("pinterest pin: no id returned");
    return { remote_id: out.id, url: `https://www.pinterest.com/pin/${encodeURIComponent(out.id)}/` };
  },
};

// Read-only checks run before a receipt is claimed. A failure skips the entry (nothing claimed), so
// it can post on a later run once the owner fixes the token or board.
export const preflights = {
  async pinterest({ env, fetch }) {
    const res = await fetch(`${PINTEREST_API}/boards/${encodeURIComponent(env.PINTEREST_BOARD_ID)}`, { headers: { authorization: `Bearer ${env.PINTEREST_TOKEN}` } });
    if (!res.ok) return `pinterest board check answered HTTP ${res.status} (token expired or board id wrong?)`;
    return null;
  },
};

async function pageToken({ env, fetch, graph }) {
  const r = await json(await fetch(`${graph}/${encodeURIComponent(env.META_PAGE_ID)}?fields=access_token`, { headers: { authorization: `Bearer ${env.META_SYSTEM_USER_TOKEN}` } }), "meta page token");
  if (!r.access_token) throw new Error("meta page token: no access_token returned for the Page");
  runtimeSecrets.add(r.access_token);
  return r.access_token;
}

export function checkVariant(platform, entry) {
  const v = entry.platforms[platform];
  const problems = [];
  if (!v?.text || v.text.length > LIMITS[platform].text) problems.push(`${platform} text missing or over limit`);
  if (!v?.link?.startsWith(`${SITE}/`)) problems.push(`${platform} link must point to ${SITE}`);
  if (LIMITS[platform].title && (!v?.title || v.title.length > LIMITS[platform].title)) problems.push(`${platform} title missing or over limit`);
  if (platform === "threads" && /https?:\/\/|familytripwise\.com/i.test(v?.text ?? "")) problems.push(`${platform} text must not carry the link`);
  if ((platform === "instagram" || platform === "pinterest") && !/^https:\/\/familytripwise\.com\/social\/cards\/[a-z0-9-]+\.jpg$/.test(entry.image?.url ?? "")) problems.push(`${platform} needs a public JPEG card URL`);
  if (platform === "pinterest" && (!entry.image?.alt || entry.image.alt.length > PINTEREST_ALT_MAX)) problems.push(`pinterest alt text missing or over ${PINTEREST_ALT_MAX}`);
  return problems;
}

// The page the variant links to (Pinterest links to the evergreen guide, not the dated page).
export const linkTarget = (link) => { const u = new URL(link); return `${u.origin}${u.pathname}`; };

async function siteReady(entry, variant, fetch) {
  for (const [url, type] of [[linkTarget(variant.link), "text/html"], [entry.image.url, "image/jpeg"]]) {
    const res = await fetch(url, { method: "HEAD", redirect: "follow" });
    if (!res.ok || !(res.headers.get("content-type") ?? "").startsWith(type)) return `${url} answered ${res.status} ${res.headers.get("content-type") ?? ""}`;
  }
  return null;
}

// ---------- receipt stores ----------

// Live store: every write is a fast-forward-only commit on main, retried from the latest main.
export class GitStore {
  constructor(dir, { branch = "main", remote = "origin" } = {}) { Object.assign(this, { dir, branch, remote }); }
  git(...args) { return execFileSync("git", args, { cwd: this.dir, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }); }
  fetch() { this.git("fetch", "-q", this.remote, this.branch); }
  ref() { return `${this.remote}/${this.branch}`; }
  ownerText() { this.fetch(); return this.git("show", `${this.ref()}:ops/OWNER.md`); }
  claimedNames(date) {
    this.fetch();
    try { return this.git("ls-tree", "--name-only", `${this.ref()}:${RECEIPTS}/${date}`).split("\n").filter(Boolean); } catch { return []; }
  }
  // mode "claim": refuse if the receipt exists; mode "finish": overwrite the claim with the result.
  write(key, data, mode) {
    for (let attempt = 1; attempt <= 5; attempt += 1) {
      this.fetch();
      let exists = true;
      try { this.git("cat-file", "-e", `${this.ref()}:${key}`); } catch { exists = false; }
      if (mode === "claim" && exists) return false;
      this.git("checkout", "-q", "--detach", this.ref());
      mkdirSync(dirname(join(this.dir, key)), { recursive: true });
      writeFileSync(join(this.dir, key), `${JSON.stringify(data, null, 2)}\n`);
      this.git("add", "--", key);
      this.git("commit", "-q", "-m", `social: ${data.status} ${data.platform} ${data.entry_id}`);
      try { this.git("push", "-q", this.remote, `HEAD:${this.branch}`); return true; } catch { /* main moved; retry */ }
      execFileSync("sleep", [String(attempt * 3)]);
    }
    throw new Error(`could not push receipt ${key}`);
  }
}

// Dry-run store: receipts in a scratch directory; nothing is committed.
export class DirStore {
  constructor(dir, ownerText) { Object.assign(this, { dir, owner: ownerText }); }
  ownerText() { return this.owner; }
  claimedNames(date) { const d = join(this.dir, RECEIPTS, date); return existsSync(d) ? readdirSync(d) : []; }
  write(key, data, mode) {
    const path = join(this.dir, key);
    if (mode === "claim" && existsSync(path)) return false;
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`);
    return true;
  }
}

// ---------- simulated platforms (dry run and tests) ----------

export function simulatedFetch(log = []) {
  let n = 0;
  const reply = (status, body, type = "application/json") => new Response(type === "application/json" ? JSON.stringify(body) : body, { status, headers: { "content-type": type } });
  return async (url, init = {}) => {
    const u = new URL(url);
    const method = init.method ?? "GET";
    const body = init.body instanceof URLSearchParams ? Object.fromEntries(init.body) : typeof init.body === "string" ? JSON.parse(init.body) : init.body;
    log.push({ method, host: u.host, path: u.pathname, search: u.search, headers: init.headers ?? {}, body });
    if (u.searchParams.has("access_token") || u.searchParams.has("password")) return reply(400, { error: { message: "credential in URL" } });
    n += 1;
    if (u.host === "familytripwise.com") return reply(200, "", u.pathname.endsWith(".jpg") ? "image/jpeg" : "text/html; charset=utf-8");
    if (u.host === "graph.threads.net") {
      if (u.pathname.endsWith("/threads")) return body?.media_type === "TEXT" && body.text && body.text.length <= 500 && body.access_token ? reply(200, { id: `simthr${n}` }) : reply(400, { error: { message: "bad threads container" } });
      if (u.pathname.endsWith("/threads_publish")) return reply(200, { id: `simthrpub${n}` });
    }
    if (u.host === "graph.facebook.com") {
      if (u.search === "?fields=access_token") return reply(200, { access_token: "sim-page-token", id: "simpage" });
      if (u.search === "?fields=status_code") return reply(200, { status_code: "FINISHED" });
      if (u.pathname.endsWith("/feed")) return body?.access_token === "sim-page-token" && body.message && body.link ? reply(200, { id: `simpage_${n}` }) : reply(400, { error: { message: "bad page post" } });
      if (u.pathname.endsWith("/media")) return body?.image_url && body.caption && body.access_token ? reply(200, { id: `simcontainer${n}` }) : reply(400, { error: { message: "bad container" } });
      if (u.pathname.endsWith("/media_publish")) return reply(200, { id: `simig${n}` });
    }
    if (u.host === "api.pinterest.com") {
      const auth = (init.headers?.authorization ?? "").startsWith("Bearer dry-run-") || init.headers?.authorization === "Bearer sim-pinterest";
      if (!auth) return reply(401, { code: 2, message: "Authentication failed." });
      if (method === "GET" && /^\/v5\/boards\/[^/]+$/.test(u.pathname)) return reply(200, { id: decodeURIComponent(u.pathname.split("/").pop()), name: "Simulated board" });
      if (method === "POST" && u.pathname === "/v5/pins") {
        const ok = body?.board_id && body.title?.length <= 100 && body.description?.length <= 800 && body.alt_text?.length <= 500 && /^https:\/\//.test(body.link ?? "") && body.media_source?.source_type === "image_url" && /^https:\/\//.test(body.media_source.url ?? "");
        return ok ? reply(201, { id: `simpin${n}`, board_id: body.board_id }) : reply(400, { code: 1, message: "bad pin" });
      }
    }
    return reply(404, { error: { message: `simulated platform has no ${method} ${u.host}${u.pathname}` } });
  };
}
export const SIMULATED_ENV = Object.fromEntries([...new Set(Object.values(CREDENTIALS).flat())].map((k) => [k, `dry-run-${k.toLowerCase()}`]));

// ---------- run ----------

export async function run({ now = new Date(), clock = () => Date.now(), env = process.env, store, fetch = globalThis.fetch, sleep = (ms) => new Promise((r) => setTimeout(r, ms)), readImage = (p) => readFileSync(join(root, p)), loadQueue = (d) => (existsSync(join(queueDir, `${d}.json`)) ? readQueue(d) : null), validate = (q, today) => validateQueue(q, { today }), log = console.log } = {}) {
  const date = easternDate(now);
  const report = { date, posted: [], failed: [], skipped: [] };
  if (!killSwitchOpen(store.ownerText())) { log("OWNER.md D12 is not Approved (kill switch); nothing posted."); return report; }
  const platforms = enabledPlatforms(env);
  if (!platforms.length) { log("No platform credentials configured; nothing posted."); return report; }
  const queue = loadQueue(date);
  if (!queue) { log(`No queue for ${date}; nothing posted.`); return report; }
  const problems = validate(queue, date);
  if (problems.length) { report.failed.push({ reason: "queue invalid", problems }); log(`Queue ${date} is invalid; nothing posted:\n- ${problems.join("\n- ")}`); return report; }
  const graph = `https://graph.facebook.com/${env.META_GRAPH_VERSION || GRAPH_VERSION_DEFAULT}`;
  const plan = planPosts({ queue, now, platforms, claimedNames: store.claimedNames(date) });
  for (const { platform, entry } of plan) {
    const key = receiptKey(date, entry.id, platform);
    const base = { entry_id: entry.id, item_id: entry.item_id, platform, queue_date: date, scheduled_at: entry.scheduled_at, expires_at: entry.expires_at, page: entry.page };
    const bad = checkVariant(platform, entry);
    if (bad.length) { report.skipped.push({ key, reason: bad.join("; ") }); log(`Skip ${key}: ${bad.join("; ")}`); continue; }
    if (!killSwitchOpen(store.ownerText())) { log("Kill switch closed mid-run; stopping."); break; }
    if (clock() >= Date.parse(entry.expires_at)) { report.skipped.push({ key, reason: "expired" }); continue; }
    const notReady = await siteReady(entry, entry.platforms[platform], fetch);
    if (notReady) { report.skipped.push({ key, reason: notReady }); log(`Skip ${key}: ${notReady}`); continue; }
    const pre = preflights[platform] ? await preflights[platform]({ env, fetch }).catch((err) => `preflight error: ${err.message}`) : null;
    if (pre) { const reason = sanitize(pre, env); report.skipped.push({ key, reason }); log(`Skip ${key}: ${reason}`); continue; }
    if (!store.write(key, { ...base, status: "attempting", attempted_at: new Date().toISOString() }, "claim")) { report.skipped.push({ key, reason: "already claimed" }); continue; }
    let out;
    try {
      out = await adapters[platform]({ entry, variant: entry.platforms[platform], env, fetch, graph, sleep, readImage });
    } catch (err) {
      const error = sanitize(err.message, env);
      store.write(key, { ...base, status: "failed", failed_at: new Date().toISOString(), error, note: "Not retried automatically: the post may or may not exist. Check the platform before any manual action." }, "finish");
      report.failed.push({ key, error });
      log(`Failed ${key}: ${error}`);
      continue;
    }
    // If this write throws, the claim stays "attempting" (never reposted) and the run exits non-zero.
    store.write(key, { ...base, status: "posted", posted_at: new Date().toISOString(), remote_id: out.remote_id ?? null, url: out.url ?? null }, "finish");
    report.posted.push({ key, ...out });
    log(`Posted ${key}`);
  }
  return report;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const args = process.argv.slice(2);
  const opt = (name) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : undefined; };
  const now = opt("--now") ? new Date(opt("--now")) : new Date();
  if (Number.isNaN(now.getTime())) { console.error("--now must be an ISO time"); process.exit(2); }
  let report;
  if (args.includes("--dry-run")) {
    const out = opt("--receipts-out") ?? mkdtempSync(join(tmpdir(), "social-dry-run-"));
    const calls = [];
    report = await run({ now, clock: () => now.getTime(), env: SIMULATED_ENV, store: new DirStore(out, readFileSync(join(root, "ops/OWNER.md"), "utf8")), fetch: simulatedFetch(calls), sleep: async () => {} });
    console.log(`Dry run (simulated platforms, ${calls.length} simulated requests); receipts in ${out}`);
  } else {
    report = await run({ now, ...(opt("--now") ? { clock: () => now.getTime() } : {}), store: new GitStore(root) });
  }
  console.log(JSON.stringify({ posted: report.posted.length, failed: report.failed.length, skipped: report.skipped.length }));
  if (report.failed.length) process.exit(1);
}
