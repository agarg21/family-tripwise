#!/usr/bin/env node
// Site page-quality checks (QUEUE G13 step 1; docs/plan/page-quality-rubric.md "Automated checks").
// Read-only: it inspects committed site/ HTML for every sitemap URL and never edits pages.
//
//   node tools/site-quality.mjs                 table of every sitemap page and its failing checks
//   node tools/site-quality.mjs --json          the same as JSON
//   node tools/site-quality.mjs --write-baseline  add new sitemap pages' gaps and drop closed gaps in
//                                                tools/site-quality-baseline.json; refuses while an existing
//                                                page has a regression (fix it, or --accept <page> deliberately)
//
// tools/site-quality.test.mjs (run by every deploy) fails when a page loses a check it passed
// (a regression against the baseline). Known gaps are listed, not hidden: fixing one and
// re-writing the baseline tightens the ratchet.

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export const SITE_DIR = join(ROOT, "site");
export const BASELINE_PATH = join(ROOT, "tools", "site-quality-baseline.json");
export const ORIGIN = "https://familytripwise.com";
export const CHECKS = ["hero", "og", "glance", "no_placeholders", "dated_sources"];

const MONTHS = "January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec";
const DATE_RE = new RegExp(`\\b(?:(?:${MONTHS})\\.? \\d{1,2}(?:, \\d{4})?|\\d{4}-\\d{2}-\\d{2})\\b`);
const FACT_RE = /(?:\$|USD|GBP|MXN|£|€)\s?\d|\b\d{1,2}(?::\d{2})?\s?(?:a\.m\.|p\.m\.|am|pm)\b|\bages? \d|\b\d+(?:\.\d+)?%|\b\d+ (?:minutes?|hours?|miles?|nights?|km)\b|\bunder \d+\b/i;
const PLACEHOLDER_RE = /^\s*(?:not observed|not yet observed|tbd|tba|to be (?:confirmed|determined|announced)|coming soon|placeholder|lorem ipsum|n\/a)\b/i;

export function stripTags(html) {
  return html
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
    .replace(/<template\b[\s\S]*?<\/template>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;|&#160;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#36;|&dollar;/g, "$")
    .replace(/\s+/g, " ")
    .trim();
}

function attr(tag, name) {
  const m = tag.match(new RegExp(`\\s${name}\\s*=\\s*("([^"]*)"|'([^']*)')`, "i"));
  return m ? (m[2] ?? m[3] ?? "") : null;
}

function metaProperty(html, prop) {
  for (const tag of html.match(/<meta\b[^>]*>/gi) || []) {
    if ((attr(tag, "property") || "").toLowerCase() === prop) return attr(tag, "content");
  }
  return null;
}

/** Region shown first: the page hero plus everything in <main> before its first <h2>. */
export function aboveFold(html) {
  const main = html.match(/<main\b[^>]*>([\s\S]*)<\/main>/i)?.[1] ?? html.match(/<body\b[^>]*>([\s\S]*)<\/body>/i)?.[1] ?? html;
  const h2 = main.search(/<h2\b/i);
  const lead = h2 === -1 ? main : main.slice(0, h2);
  const hero = html.match(/<section\b[^>]*class="[^"]*\bpage-hero\b[^"]*"[^>]*>[\s\S]*?<\/section>/i)?.[0] ?? "";
  return lead.includes(hero) ? lead : hero + lead;
}

/** Resolve a site-relative or same-origin URL to a file under site/, or null for remote URLs. */
export function localFile(src, pagePath, siteDir = SITE_DIR) {
  if (!src) return null;
  let path = src.split(/[?#]/)[0];
  if (path === ORIGIN || path.startsWith(`${ORIGIN}/`)) path = path.slice(ORIGIN.length) || "/";
  else if (/^(?:[a-z]+:)?\/\//i.test(path) || /^data:/i.test(path)) return null;
  const file = path.startsWith("/") ? join(siteDir, path) : join(dirname(join(siteDir, pagePath)), path);
  const norm = normalize(file);
  const root = normalize(siteDir).replace(/\/$/, "");
  if (norm !== root && !norm.startsWith(`${root}/`)) return null;
  return norm.endsWith("/") ? join(norm, "index.html") : norm;
}

function checkHero(html, pagePath, siteDir) {
  const issues = [];
  const fold = aboveFold(html);
  const figures = fold.match(/<figure\b[\s\S]*?<\/figure>/gi) || [];
  let ok = false;
  for (const fig of figures) {
    const img = fig.match(/<img\b[^>]*>/i)?.[0];
    if (!img) continue;
    const src = attr(img, "src");
    const file = localFile(src, pagePath, siteDir);
    const alt = (attr(img, "alt") || "").trim();
    const caption = stripTags(fig.match(/<figcaption\b[\s\S]*?<\/figcaption>/i)?.[0] ?? "");
    const credited = /photo|courtesy|©|credit/i.test(caption) && (/\bCC\b|licen[cs]e|public domain|media kit|courtesy|©/i.test(caption)) && /<figcaption\b[\s\S]*?<a\b[^>]*href=/i.test(fig);
    if (!file) { issues.push(`hero image is not self-hosted (${src})`); continue; }
    if (!existsSync(file)) { issues.push(`hero image file missing (${src})`); continue; }
    if (!alt) { issues.push(`hero image has no alt text (${src})`); continue; }
    if (!credited) { issues.push(`hero image has no author/licence/source credit (${src})`); continue; }
    ok = true;
    break;
  }
  if (!ok && issues.length === 0) {
    const anyImg = /<img\b/i.test(html.match(/<main\b[\s\S]*<\/main>/i)?.[0] ?? "");
    issues.push(anyImg ? "photo exists but not above the first section heading" : "no photo on the page");
  }
  return { pass: ok, issues: ok ? [] : issues };
}

function checkOg(html, pagePath, siteDir) {
  const issues = [];
  for (const prop of ["og:title", "og:description", "og:image", "og:url"]) {
    if (!(metaProperty(html, prop) || "").trim()) issues.push(`missing ${prop}`);
  }
  const image = metaProperty(html, "og:image");
  if (image) {
    const file = localFile(image, pagePath, siteDir);
    if (!file) issues.push(`og:image is not on familytripwise.com (${image})`);
    else if (!existsSync(file)) issues.push(`og:image does not resolve (${image})`);
  }
  return { pass: issues.length === 0, issues };
}

function checkGlance(html, pagePath) {
  const fold = aboveFold(html);
  const h1 = stripTags(fold.match(/<h1\b[\s\S]*?<\/h1>/i)?.[0] ?? "");
  const rest = stripTags(fold.replace(/<h1\b[\s\S]*?<\/h1>/i, " ").replace(/<figure\b[\s\S]*?<\/figure>/gi, " ").replace(/<nav\b[\s\S]*?<\/nav>/gi, " "));
  const issues = [];
  if (!h1) issues.push("no h1 above the first section heading");
  if (rest.length < 80) issues.push(`only ${rest.length} characters of answer text above the first section heading`);
  if (/^deals\/(?!index\.html$)/.test(pagePath) && !/\$\s?\d/.test(rest)) issues.push("deal page shows no $ cost or savings above the first section heading");
  return { pass: issues.length === 0, issues };
}

function checkPlaceholders(html) {
  const issues = [];
  const body = (html.match(/<body\b[\s\S]*<\/body>/i)?.[0] ?? html).replace(/<script\b[\s\S]*?<\/script>/gi, " ").replace(/<template\b[\s\S]*?<\/template>/gi, " ");
  // Value text right after a block opening, allowing inline wrappers (<td><em>TBD</em></td>).
  const blocks = body.match(/<(td|th|dd|p|li|span|strong|div)\b[^>]*>(?:\s*<(?:em|b|i|strong|span|a)\b[^>]*>)*([^<]{0,120})/gi) || [];
  for (const block of blocks) {
    const text = stripTags(block.replace(/^<[^>]+>/, ""));
    if (PLACEHOLDER_RE.test(text)) issues.push(`placeholder text: "${text.slice(0, 60)}"`);
  }
  for (const table of body.match(/<table\b[\s\S]*?<\/table>/gi) || []) {
    if (!/<td\b[^>]*>\s*[^<\s]/i.test(table.replace(/<td\b[^>]*>\s*<(?!\/td)/gi, "<td>x<"))) issues.push("empty table");
  }
  return { pass: issues.length === 0, issues: [...new Set(issues)] };
}

function checkDatedSources(html) {
  const main = html.match(/<main\b[\s\S]*<\/main>/i)?.[0] ?? "";
  const sections = main.match(/<section\b[\s\S]*?<\/section>/gi) || [];
  const issues = [];
  for (const section of sections) {
    const external = (section.match(/<a\b[^>]*href="https?:\/\/[^"]+"/gi) || []).filter(a => !a.includes("familytripwise.com") && !/commons\.wikimedia\.org|creativecommons\.org|flickr\.com/i.test(a));
    if (external.length === 0) continue;
    const text = stripTags(section);
    // A fact block states a checkable specific (price, time, age, percentage, duration);
    // a section that only points parents to an official page to verify is not one.
    if (!FACT_RE.test(text)) continue;
    if (!DATE_RE.test(text)) {
      const heading = stripTags(section.match(/<h[1-3]\b[\s\S]*?<\/h[1-3]>/i)?.[0] ?? "") || "untitled section";
      issues.push(`sources without a date in "${heading.slice(0, 50)}"`);
    }
  }
  return { pass: issues.length === 0, issues };
}

export function checkPage(html, pagePath, siteDir = SITE_DIR) {
  return {
    hero: checkHero(html, pagePath, siteDir),
    og: checkOg(html, pagePath, siteDir),
    glance: checkGlance(html, pagePath),
    no_placeholders: checkPlaceholders(html),
    dated_sources: checkDatedSources(html),
  };
}

export function sitemapPages(siteDir = SITE_DIR) {
  const xml = readFileSync(join(siteDir, "sitemap.xml"), "utf8");
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => {
    let p = m[1].trim().replace(ORIGIN, "").replace(/^\//, "");
    if (p === "" || p.endsWith("/")) p += "index.html";
    return p;
  });
}

export function auditSite(siteDir = SITE_DIR) {
  return sitemapPages(siteDir).map(page => {
    const file = join(siteDir, page);
    if (!existsSync(file)) return { page, missing: true, failing: [...CHECKS], results: {} };
    const results = checkPage(readFileSync(file, "utf8"), page, siteDir);
    return { page, failing: CHECKS.filter(c => !results[c].pass), results };
  });
}

export function readBaseline(path = BASELINE_PATH) {
  return existsSync(path) ? JSON.parse(readFileSync(path, "utf8")) : { pages: {} };
}

/** Pages that now fail a check the baseline says they passed (or that are new and failing). */
export function regressions(report, baseline) {
  const out = [];
  for (const row of report) {
    const known = baseline.pages[row.page];
    const allowed = new Set(known ?? []);
    for (const check of row.failing) {
      if (!allowed.has(check)) out.push({ page: row.page, check, issues: row.results[check]?.issues ?? ["page missing"], new_page: !known });
    }
  }
  return out;
}

/** Known gaps a page has since closed (the baseline can be tightened). */
export function closedGaps(report, baseline) {
  const out = [];
  for (const row of report) for (const check of baseline.pages[row.page] ?? []) if (!row.failing.includes(check)) out.push({ page: row.page, check });
  return out;
}

/**
 * Ratchet-safe baseline update: keeps every existing page's gaps (minus the ones it has closed),
 * adds pages the baseline does not list yet, and drops pages no longer in the sitemap. An existing
 * page's regression is only recorded when that page is named in `accept`.
 */
export function mergeBaseline(report, baseline, date, accept = []) {
  const reg = regressions(report, baseline).filter(r => !r.new_page && !accept.includes(r.page));
  if (reg.length) return { refused: reg };
  const pages = {};
  for (const row of report) {
    const known = baseline.pages[row.page];
    pages[row.page] = !known || accept.includes(row.page) ? row.failing : known.filter(c => row.failing.includes(c));
  }
  return { baseline: { ...baselineFrom([], date), pages } };
}

export function baselineFrom(report, date) {
  return {
    note: "Known page-quality gaps (tools/site-quality.mjs). Tests fail on any check a page passed before and on a new page not listed here. node tools/site-quality.mjs --write-baseline adds new pages and drops closed gaps; it refuses while an existing page has a regression.",
    recorded_on: date,
    pages: Object.fromEntries(report.map(r => [r.page, r.failing])),
  };
}

function main(argv) {
  const report = auditSite();
  if (argv.includes("--write-baseline")) {
    const date = new Date().toLocaleDateString("en-CA", { timeZone: "America/New_York" });
    const accept = argv.flatMap((a, i) => (a === "--accept" && argv[i + 1] ? [argv[i + 1]] : []));
    const result = mergeBaseline(report, readBaseline(), date, accept);
    if (result.refused) {
      console.error("refused: these existing pages lost a check; fix them, or pass --accept <page> for a deliberate change:");
      for (const r of result.refused) console.error(`  ${r.page} ${r.check}: ${r.issues.join("; ")}`);
      process.exitCode = 1;
      return;
    }
    writeFileSync(BASELINE_PATH, `${JSON.stringify(result.baseline, null, 2)}\n`);
    console.log(`baseline written: ${report.filter(r => r.failing.length).length} of ${report.length} pages have known gaps`);
    return;
  }
  if (argv.includes("--json")) { console.log(JSON.stringify(report, null, 2)); return; }
  const totals = Object.fromEntries(CHECKS.map(c => [c, report.filter(r => !r.failing.includes(c)).length]));
  console.log(`page-quality: ${report.length} sitemap pages; passing per check: ${CHECKS.map(c => `${c} ${totals[c]}/${report.length}`).join(", ")}`);
  for (const row of report) {
    if (!row.failing.length) { console.log(`PASS ${row.page}`); continue; }
    console.log(`GAP  ${row.page}: ${row.failing.map(c => `${c} (${(row.results[c]?.issues ?? ["missing"]).slice(0, 2).join("; ")})`).join(" | ")}`);
  }
  const reg = regressions(report, readBaseline());
  if (reg.length) {
    console.log(`\n${reg.length} regression(s) against tools/site-quality-baseline.json:`);
    for (const r of reg) console.log(`  ${r.page} ${r.check}: ${r.issues.join("; ")}`);
    process.exitCode = 1;
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main(process.argv.slice(2));
