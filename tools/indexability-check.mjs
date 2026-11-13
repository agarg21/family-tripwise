// What search engines see: status, robots meta, canonical and robots.txt for every sitemap URL (review #16, QUEUE R1 step 8).
//   node tools/indexability-check.mjs                 local build only (no network): every sitemap URL must be indexable
//   node tools/indexability-check.mjs --against-live  also compare the local build with production BEFORE deploying: a URL that
//                                                     search engines can index today must stay indexable (unless an owner-approved
//                                                     entry in tools/indexability-approved.json covers it)
//   node tools/indexability-check.mjs --verify-live   AFTER deploying: production must serve exactly what was built
// Indexable = HTTP 200, no noindex in a robots/googlebot meta tag, a self-referencing canonical, and not blocked by robots.txt.
// A URL that only leaves the sitemap (ended deals, OWNER D46 #5) is a warning, not an error: it stays live and indexable.
import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const SITE_ORIGIN = "https://familytripwise.com";
const rootDir = fileURLToPath(new URL("../", import.meta.url));

export function sitemapUrls(xml) {
  return [...String(xml).matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
}

function attr(tag, name) {
  const m = tag.match(new RegExp(`(?:^|\\s)${name}\\s*=\\s*(["'])([\\s\\S]*?)\\1`, "i"));
  return m ? m[2].trim() : null;
}

/** robots meta (robots + googlebot, lowercased, joined) and canonical hrefs from an HTML document's <head>. */
export function readHead(html) {
  const head = String(html).split(/<\/head>/i)[0];
  const robots = [];
  const canonicals = [];
  for (const [tag] of head.matchAll(/<meta\b[^>]*>/gi)) {
    const name = (attr(tag, "name") ?? "").toLowerCase();
    if (name === "robots" || name === "googlebot") robots.push((attr(tag, "content") ?? "").toLowerCase());
  }
  for (const [tag] of head.matchAll(/<link\b[^>]*>/gi)) {
    const rel = (attr(tag, "rel") ?? "").toLowerCase().split(/\s+/);
    if (rel.includes("canonical")) canonicals.push(attr(tag, "href") ?? "");
  }
  const robotsText = robots.join(", ");
  return { robots: robotsText, noindex: robotsText.split(/[,\s]+/).some((t) => t === "noindex" || t === "none"), canonicals };
}

/** Google-style robots.txt rules for user-agent * (or googlebot, which wins when present). */
export function parseRobots(text) {
  const groups = [];
  let current = null;
  let lastWasAgent = false;
  for (const raw of String(text ?? "").split(/\r?\n/)) {
    const line = raw.replace(/#.*$/, "").trim();
    const m = line.match(/^([a-z-]+)\s*:\s*(.*)$/i);
    if (!m) continue;
    const key = m[1].toLowerCase();
    const value = m[2].trim();
    if (key === "user-agent") {
      if (!lastWasAgent) groups.push((current = { agents: [], rules: [] }));
      current.agents.push(value.toLowerCase());
      lastWasAgent = true;
      continue;
    }
    lastWasAgent = false;
    if (!current) continue;
    if (key === "allow" || key === "disallow") current.rules.push({ allow: key === "allow", path: value });
  }
  const pick = (agent) => groups.filter((g) => g.agents.includes(agent)).flatMap((g) => g.rules);
  const google = pick("googlebot");
  return google.length ? google : pick("*");
}

function ruleMatches(rulePath, path) {
  if (!rulePath) return false; // "Disallow:" with no path allows everything
  const anchored = rulePath.endsWith("$");
  const body = (anchored ? rulePath.slice(0, -1) : rulePath).split("*").map((s) => s.replace(/[.+?^${}()|[\]\\]/g, "\\$&")).join(".*");
  return new RegExp(`^${body}${anchored ? "$" : ""}`).test(path);
}

/** true when robots.txt blocks crawling the URL's path (longest match wins; Allow wins ties). */
export function robotsBlocks(rules, url) {
  const u = new URL(url);
  const path = `${u.pathname}${u.search}`;
  let best = null;
  for (const rule of rules) {
    if (!ruleMatches(rule.path, path)) continue;
    const len = rule.path.replace(/\$$/, "").length;
    if (!best || len > best.len || (len === best.len && rule.allow)) best = { len, allow: rule.allow };
  }
  return Boolean(best && !best.allow);
}

/** One URL as a search engine sees it. page = {status, html}; rules = parsed robots.txt. */
export function describe(url, page, rules) {
  const head = page.status === 200 ? readHead(page.html) : { robots: "", noindex: false, canonicals: [] };
  const canonical = head.canonicals.length === 1 ? head.canonicals[0] : head.canonicals.length ? `(${head.canonicals.length} canonicals)` : "(none)";
  const blocked = robotsBlocks(rules, url);
  const reasons = [];
  if (page.status !== 200) reasons.push(`status ${page.status}`);
  if (head.noindex) reasons.push(`robots meta "${head.robots}"`);
  if (page.status === 200 && canonical !== url) reasons.push(`canonical ${canonical}`);
  if (blocked) reasons.push("blocked by robots.txt");
  return { url, status: page.status, robots: head.robots, canonical, blocked, indexable: reasons.length === 0, reasons };
}

/** Local file for a site URL (GitHub Pages: "/x/" serves x/index.html). */
export function localPage(siteDir, url) {
  let path = decodeURIComponent(new URL(url).pathname);
  if (path.endsWith("/")) path += "index.html";
  const file = join(siteDir, path.replace(/^\//, ""));
  return existsSync(file) ? { status: 200, html: readFileSync(file, "utf8") } : { status: 404, html: "" };
}

/** Local build: every sitemap URL indexable; robots.txt names the sitemap. */
export function checkLocal(siteDir) {
  const errors = [];
  const robotsTxt = existsSync(join(siteDir, "robots.txt")) ? readFileSync(join(siteDir, "robots.txt"), "utf8") : null;
  if (robotsTxt === null) errors.push("site/robots.txt is missing");
  else if (!/^sitemap:\s*https:\/\/familytripwise\.com\/sitemap\.xml\s*$/im.test(robotsTxt)) errors.push("site/robots.txt does not name https://familytripwise.com/sitemap.xml");
  const rules = parseRobots(robotsTxt ?? "");
  const urls = sitemapUrls(readFileSync(join(siteDir, "sitemap.xml"), "utf8"));
  const records = new Map();
  for (const url of urls) {
    const rec = describe(url, localPage(siteDir, url), rules);
    records.set(url, rec);
    if (!rec.indexable) errors.push(`sitemap URL is not indexable in the build: ${url} (${rec.reasons.join("; ")})`);
  }
  return { errors, urls, rules, robotsTxt: robotsTxt ?? "", records };
}

/** Owner-approved indexability changes: [{url, owner_row: "D<n>", until: "YYYY-MM-DD"}]; expired entries do not count. */
export function approvedUrls(entries, today) {
  const ok = new Set();
  const errors = [];
  for (const e of entries ?? []) {
    if (!e?.url || !/^D\d+/.test(e?.owner_row ?? "") || !/^\d{4}-\d{2}-\d{2}$/.test(e?.until ?? "")) {
      errors.push(`tools/indexability-approved.json entry needs url, owner_row (an OWNER.md D row) and until: ${JSON.stringify(e)}`);
    } else if (e.until >= today) ok.add(e.url);
  }
  return { ok, errors };
}

/**
 * Before a deploy: compare production (live) with the local build. live = {robotsTxt, sitemapXml, pages: Map(url -> {status, html})}.
 * Errors: a URL that production lets search engines index (and lists in its sitemap) would stop being indexable.
 */
export function compareBeforeDeploy(local, live, approved = new Set()) {
  const errors = [];
  const warnings = [];
  const notes = [];
  const liveRules = parseRobots(live.robotsTxt);
  const liveUrls = sitemapUrls(live.sitemapXml);
  const localUrls = new Set(local.urls);
  for (const url of liveUrls) {
    const page = live.pages.get(url);
    if (!page) continue;
    const before = describe(url, page, liveRules);
    const after = local.records.get(url) ?? describe(url, localPage(local.siteDir, url), local.rules);
    if (before.indexable && !after.indexable) {
      const msg = `${url} is indexable live but would not be after this deploy (${after.reasons.join("; ")})`;
      if (approved.has(url)) notes.push(`approved: ${msg}`);
      else errors.push(`${msg}; needs an owner-approved entry in tools/indexability-approved.json`);
    } else if (!localUrls.has(url)) {
      warnings.push(`${url} leaves the sitemap but stays ${after.indexable ? "indexable" : `unindexable (${after.reasons.join("; ")})`}`);
    } else if (!before.indexable && after.indexable) {
      notes.push(`${url} becomes indexable (live: ${before.reasons.join("; ")})`);
    }
  }
  const liveSet = new Set(liveUrls);
  for (const url of local.urls) if (!liveSet.has(url)) notes.push(`${url} joins the sitemap`);
  if (live.robotsTxt.trim() !== local.robotsTxt.trim()) notes.push("robots.txt changes in this deploy");
  return { errors, warnings, notes };
}

/** After a deploy: production must serve what was built (same status, robots meta, canonical; same robots.txt and sitemap). */
export function compareAfterDeploy(local, live) {
  const errors = [];
  if (live.robotsTxt.trim() !== local.robotsTxt.trim()) errors.push("live robots.txt differs from the build");
  const liveUrls = sitemapUrls(live.sitemapXml);
  if (liveUrls.join("\n") !== local.urls.join("\n")) errors.push(`live sitemap lists ${liveUrls.length} URLs, the build ${local.urls.length}`);
  for (const url of local.urls) {
    const page = live.pages.get(url);
    if (!page) { errors.push(`${url} was not fetched`); continue; }
    const got = describe(url, page, local.rules);
    const want = local.records.get(url);
    for (const key of ["status", "robots", "canonical", "blocked"]) {
      if (got[key] !== want[key]) errors.push(`${url} live ${key} ${JSON.stringify(got[key])}, built ${JSON.stringify(want[key])}`);
    }
  }
  return { errors };
}

async function fetchLive(path, bust) {
  const url = new URL(path, SITE_ORIGIN);
  if (bust) url.searchParams.set("v", bust); // GitHub Pages caches ~10 minutes; a query string gets a fresh copy
  const res = await fetch(url, { redirect: "manual", cache: "no-store", headers: { "user-agent": "FamilyTripwiseDeployCheck/1.0" }, signal: AbortSignal.timeout(20_000) });
  return { status: res.status, html: res.status === 200 ? await res.text() : "" };
}

async function liveSnapshot(urls, bust) {
  const robots = await fetchLive("/robots.txt", bust);
  const sitemap = await fetchLive("/sitemap.xml", bust);
  if (robots.status !== 200 || sitemap.status !== 200) throw new Error(`live robots.txt ${robots.status}, sitemap.xml ${sitemap.status}`);
  const all = [...new Set([...(urls ?? []), ...sitemapUrls(sitemap.html)])];
  const pages = new Map();
  for (const url of all) {
    const u = new URL(url);
    pages.set(url, await fetchLive(`${u.pathname}${u.search}`, bust));
  }
  return { robotsTxt: robots.html, sitemapXml: sitemap.html, pages };
}

async function main() {
  const siteDir = resolve(rootDir, "site");
  const local = { ...checkLocal(siteDir), siteDir };
  const errors = [...local.errors];
  const warnings = [];
  const notes = [];
  if (process.argv.includes("--against-live")) {
    const today = new Date().toLocaleDateString("en-CA", { timeZone: "America/New_York" });
    const file = join(rootDir, "tools/indexability-approved.json");
    const approvedFile = existsSync(file) ? JSON.parse(readFileSync(file, "utf8")) : { changes: [] };
    const approved = approvedUrls(approvedFile.changes, today);
    errors.push(...approved.errors);
    try {
      const live = await liveSnapshot([], `pre-${Date.now()}`);
      const result = compareBeforeDeploy(local, live, approved.ok);
      errors.push(...result.errors);
      warnings.push(...result.warnings);
      notes.push(...result.notes);
    } catch (error) {
      // Production unreachable: say so, but do not block a deploy that may be the fix.
      warnings.push(`live comparison skipped: ${error.message}`);
    }
  }
  if (process.argv.includes("--verify-live")) {
    const bust = process.env.GITHUB_SHA ?? String(Date.now());
    let result = { errors: ["not checked"] };
    for (let attempt = 1; attempt <= 4 && result.errors.length; attempt += 1) {
      if (attempt > 1) await new Promise((r) => setTimeout(r, 30_000));
      try {
        result = compareAfterDeploy(local, await liveSnapshot(local.urls, `${bust}-${attempt}`));
      } catch (error) {
        result = { errors: [`live fetch failed: ${error.message}`] };
      }
      if (result.errors.length) console.log(`Attempt ${attempt}: ${result.errors.length} live differences`);
    }
    errors.push(...result.errors);
  }
  console.log("Family Tripwise indexability check");
  console.log(`- Sitemap URLs in the build: ${local.urls.length}`);
  console.log(`Errors: ${errors.length}`);
  errors.forEach((e) => console.log(`  ERROR ${e}`));
  console.log(`Warnings: ${warnings.length}`);
  warnings.forEach((w) => console.log(`  WARN ${w}`));
  notes.forEach((n) => console.log(`  NOTE ${n}`));
  if (errors.length) process.exitCode = 1;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
