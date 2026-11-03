#!/usr/bin/env node
// Weekly site-health report (QUEUE G13 step 2; docs/plan/page-quality-rubric.md).
// Read-only for site/: lists dated observations older than 60 days and dead (404/410) outbound links,
// and writes ops/site-health/<date>.md. It never edits a page; findings become QUEUE items.
//
//   node tools/site-health.mjs                  staleness only, printed
//   node tools/site-health.mjs --links --write  also checks outbound links (robots.txt honored, Crawl-delay
//                                               honored, no retries) and writes the dated report; refuses to
//                                               re-check links within 7 days of the last run (OWNER D7).

import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { fetchSource } from "./deal-watch.mjs";
import { SITE_DIR, sitemapPages, stripTags } from "./site-quality.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const REPORT_DIR = join(ROOT, "ops", "site-health");
export const STALE_DAYS = 60;
export const FETCH_TIMEOUT_MS = 20000;
export const LINK_INTERVAL_DAYS = 7;
// Not checked: generated map/search links, licence and credit pages, hosts whose robots.txt or owner notes
// say not to fetch (ops/STATE.md, QUEUE G05), and anything in ops/source-access-holds.json.
export const SKIP_HOSTS = /(^|\.)(google\.com|wikimedia\.org|wikipedia\.org|creativecommons\.org|flickr\.com|unsplash\.com|pexels\.com|mbta\.com|tripadvisor\.com|beaches\.com|msccruises\.com|msccruisesusa\.com|rockefellercenter\.com|macys\.com|disneyland\.disney\.go\.com|kalahariresorts\.com|hyattinclusivecollection\.com|dollywood\.com|disneycruise\.disney\.go\.com)$/i;

const MONTHS = ["january","february","march","april","may","june","july","august","september","october","november","december"];
const LONG_DATE = /\b(January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)\.? (\d{1,2}), (20\d{2})\b|\b(20\d{2})-(\d{2})-(\d{2})\b/g;
const OBSERVED_CUE = /\b(checked|observed|read|reviewed|verified|as of|sampled|re-?read|updated|seen)\b[^.;]{0,50}$/i;

function dateValue(m) {
  if (m[4]) return `${m[4]}-${m[5]}-${m[6]}`;
  const idx = MONTHS.findIndex((n) => n.startsWith(m[1].toLowerCase().slice(0, 3)));
  return `${m[3]}-${String(idx + 1).padStart(2, "0")}-${String(m[2]).padStart(2, "0")}`;
}

// Visible text only, so JSON-LD, comments and attributes are not reported as page claims.
export function visibleText(html) {
  const main = html.replace(/<(script|style|noscript)\b[\s\S]*?<\/\1>/gi, " ").replace(/<!--[\s\S]*?-->/g, " ");
  return stripTags(main).replace(/\s+/g, " ");
}

export function staleObservations(html, today, days = STALE_DAYS) {
  const text = visibleText(html);
  const cutoff = new Date(Date.parse(`${today}T00:00:00Z`) - days * 86400000).toISOString().slice(0, 10);
  const found = [];
  for (const m of text.matchAll(LONG_DATE)) {
    const value = dateValue(m);
    if (value >= cutoff) continue;
    const before = text.slice(Math.max(0, m.index - 70), m.index);
    if (!OBSERVED_CUE.test(before)) continue;
    found.push({ date: value, context: text.slice(Math.max(0, m.index - 60), m.index + m[0].length).trim() });
  }
  return found.sort((a, b) => a.date.localeCompare(b.date));
}

export function outboundLinks(html) {
  const out = new Set();
  for (const m of html.matchAll(/<a\b[^>]*\bhref="(https:\/\/[^"]+)"/gi)) {
    const url = m[1].replace(/&amp;/g, "&").replace(/#.*$/, "");
    let host;
    try { host = new URL(url).hostname; } catch { continue; }
    if (host === "familytripwise.com" || SKIP_HOSTS.test(host)) continue;
    out.add(url);
  }
  return [...out];
}

// URLs read in the last 7 days (dated research files and the deal watch) are not fetched again this week.
export function recentlyReadUrls(today, root = ROOT) {
  const dir = join(root, "docs", "research");
  const cutoff = new Date(Date.parse(`${today}T00:00:00Z`) - LINK_INTERVAL_DAYS * 86400000).toISOString().slice(0, 10);
  let text = "";
  for (const name of readdirSync(dir)) {
    const m = name.match(/(20\d{2}-\d{2}-\d{2})/);
    if (m && m[1] >= cutoff) text += readFileSync(join(dir, name), "utf8");
  }
  const sources = join(root, "ops", "deal-watch", "sources.json");
  if (existsSync(sources)) text += readFileSync(sources, "utf8");
  const holds = join(root, "ops", "source-access-holds.json");
  if (existsSync(holds)) text += readFileSync(holds, "utf8");
  return (url) => text.includes(url);
}

export function classifyLink(result) {
  // A block page can answer with any status, so a denial is checked before 404/410.
  if (result.kind === "denied") return "denied";
  if (result.kind === "robots") return "robots";
  if (result.status === 404 || result.status === 410) return "dead";
  if (result.kind === "ok") return "ok";
  return "error";
}

async function checkLinks(urls) {
  const byHost = new Map();
  for (const url of urls) {
    const host = new URL(url).host;
    if (!byHost.has(host)) byHost.set(host, []);
    byHost.get(host).push(url);
  }
  const results = new Map();
  const fetchImpl = (u, opts) => fetch(u, { ...opts, signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) });
  const hosts = [...byHost.values()];
  const worker = async () => {
    for (let list = hosts.pop(); list; list = hosts.pop()) {
      const robotsCache = new Map();
      const lastFetchAt = new Map();
      for (const url of list) {
        // A timeout while reading a body rejects; it counts as one error for this URL and is not retried.
        const r = await fetchSource(url, { fetchImpl, robotsCache, lastFetchAt, sleep: (ms) => new Promise((ok) => setTimeout(ok, ms)), now: Date.now })
          .catch((err) => ({ kind: "error", reason: `read failed (${err?.name || "error"})` }));
        results.set(url, { state: classifyLink(r), status: r.status ?? null, reason: r.reason ?? null });
      }
    }
  };
  await Promise.all(Array.from({ length: 12 }, worker));
  return results;
}

const LINK_MARKER = join(REPORT_DIR, "links-last-run.json");

// The marker is written before any fetch, so a crash or a run without --write still counts as this week's check.
export function linksAllowed(last, today) {
  return !last || Date.parse(today) - Date.parse(last) >= LINK_INTERVAL_DAYS * 86400000;
}

export function renderReport({ today, stale, links, skippedRecent = 0 }) {
  const lines = [`# Site health ${today}`, "", `Dated observations older than ${STALE_DAYS} days (visible text only; heuristic, a page may also state them as older dated observations on purpose).`, ""];
  if (!stale.length) lines.push("None.");
  else {
    lines.push("| Page | Old dates | Oldest | Example |", "|---|---:|---|---|");
    for (const s of stale) lines.push(`| ${s.page} | ${s.items.length} | ${s.items[0].date} | ${s.items[0].context.replace(/\|/g, "/")} |`);
  }
  if (links) {
    const dead = links.filter((l) => l.state === "dead");
    const count = (state) => links.filter((l) => l.state === state).length;
    lines.push("", `Outbound links: ${links.length} checked; ok ${count("ok")}, dead ${dead.length}, refused or denied ${count("denied")}, robots ${count("robots")}, other errors ${count("error")}. Refused, robots and error results are not evidence a link is broken and are not retried. Not checked: ${skippedRecent} URLs read in the last 7 days, and map, licence and no-fetch hosts (SKIP_HOSTS in tools/site-health.mjs).`, "");
    if (dead.length) {
      lines.push("| Dead link | Status | Pages |", "|---|---:|---|");
      for (const d of dead) lines.push(`| ${d.url} | ${d.status} | ${d.pages.join(", ")} |`);
    } else lines.push("No 404 or 410 links.");
  }
  return `${lines.join("\n")}\n`;
}

async function main() {
  const args = process.argv.slice(2);
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York" }).format(new Date());
  const pages = sitemapPages();
  const stale = [];
  const linkPages = new Map();
  for (const page of pages) {
    const html = readFileSync(join(SITE_DIR, page), "utf8");
    const items = staleObservations(html, today);
    if (items.length) stale.push({ page, items });
    for (const url of outboundLinks(html)) {
      if (!linkPages.has(url)) linkPages.set(url, []);
      linkPages.get(url).push(page);
    }
  }
  stale.sort((a, b) => b.items.length - a.items.length);
  let links = null;
  let skippedRecent = 0;
  if (args.includes("--links")) {
    const last = existsSync(LINK_MARKER) ? JSON.parse(readFileSync(LINK_MARKER, "utf8")).last_run : null;
    if (!linksAllowed(last, today)) throw new Error(`links were checked on ${last}; wait a week (OWNER D7)`);
    writeFileSync(LINK_MARKER, `${JSON.stringify({ last_run: today })}\n`);
    const recent = recentlyReadUrls(today);
    const urls = [...linkPages.keys()].filter((u) => !recent(u));
    skippedRecent = linkPages.size - urls.length;
    const results = await checkLinks(urls);
    links = urls.map((url) => ({ url, pages: linkPages.get(url), ...results.get(url) }));
  }
  const report = renderReport({ today, stale, links, skippedRecent });
  if (args.includes("--write")) writeFileSync(join(REPORT_DIR, `${today}.md`), report);
  else process.stdout.write(report);
  if (links) process.stdout.write(`${links.length} links: ${JSON.stringify(links.reduce((a, l) => ({ ...a, [l.state]: (a[l.state] || 0) + 1 }), {}))}\n`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main().catch((err) => { console.error(err?.message || err); process.exit(1); });
}
