import assert from "node:assert/strict";
import test from "node:test";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { CHECKS, auditSite, baselineFrom, checkPage, closedGaps, localFile, mergeBaseline, readBaseline, regressions, sitemapPages } from "./site-quality.mjs";

// A tiny fake site so the unit checks never depend on today's committed pages.
const site = mkdtempSync(join(tmpdir(), "site-quality-"));
mkdirSync(join(site, "images"), { recursive: true });
mkdirSync(join(site, "deals"), { recursive: true });
writeFileSync(join(site, "images", "photo.webp"), "x");

const credit = `<figcaption>Photo: A. Author, Wikimedia Commons, CC BY 2.0. <a href="https://commons.wikimedia.org/wiki/File:X.jpg">License and source</a>.</figcaption>`;
function page({ head = "", hero = `<figure><img src="images/photo.webp" alt="A beach.">${credit}</figure>`, lead = "<p>Where to go with kids in San Diego: the short answer for a family of four, with the one decision that changes the plan most.</p>", body = "" } = {}) {
  const og = head || `<meta property="og:title" content="T"><meta property="og:description" content="D"><meta property="og:image" content="https://familytripwise.com/images/photo.webp"><meta property="og:url" content="https://familytripwise.com/x.html">`;
  return `<html><head>${og}</head><body><main><section class="page-hero"><h1>San Diego with kids</h1>${lead}${hero}</section>${body}</main></body></html>`;
}
const failing = (html, path = "x.html") => CHECKS.filter(c => !checkPage(html, path, site)[c].pass);

test("a complete page passes every check", () => {
  const body = `<section><h2>Zoo</h2><p>Kids under 12 pay $69, checked October 27, 2026 on the <a href="https://zoo.example/tickets">official page</a>.</p></section>`;
  assert.deepEqual(failing(page({ body })), []);
});

test("hero must be self-hosted, present, described and credited, above the first section heading", () => {
  assert.match(checkPage(page({ hero: `<figure><img src="https://upload.wikimedia.org/x.jpg" alt="A">${credit}</figure>` }), "x.html", site).hero.issues[0], /not self-hosted/);
  assert.match(checkPage(page({ hero: `<figure><img src="images/missing.webp" alt="A">${credit}</figure>` }), "x.html", site).hero.issues[0], /missing/);
  assert.match(checkPage(page({ hero: `<figure><img src="images/photo.webp" alt="">${credit}</figure>` }), "x.html", site).hero.issues[0], /alt/);
  assert.match(checkPage(page({ hero: `<figure><img src="images/photo.webp" alt="A"><figcaption>A beach.</figcaption></figure>` }), "x.html", site).hero.issues[0], /credit/);
  const below = page({ hero: "", body: `<section><h2>More</h2><figure><img src="images/photo.webp" alt="A">${credit}</figure></section>` });
  assert.match(checkPage(below, "x.html", site).hero.issues[0], /not above/);
  assert.match(checkPage(page({ hero: "" }), "x.html", site).hero.issues[0], /no photo/);
});

test("og tags must all exist and og:image must be a file we serve", () => {
  assert.ok(failing(page({ head: "<title>x</title>" })).includes("og"));
  const remote = `<meta property="og:title" content="T"><meta property="og:description" content="D"><meta property="og:image" content="https://cdn.example/x.jpg"><meta property="og:url" content="u">`;
  assert.match(checkPage(page({ head: remote }), "x.html", site).og.issues.join(), /not on familytripwise/);
  const missing = remote.replace("https://cdn.example/x.jpg", "https://familytripwise.com/images/none.webp");
  assert.match(checkPage(page({ head: missing }), "x.html", site).og.issues.join(), /does not resolve/);
});

test("glance needs an answer above the fold; deal pages also need a $ figure there", () => {
  assert.ok(failing(page({ lead: "<p>Short.</p>" })).includes("glance"));
  assert.ok(failing(page(), "deals/some-deal.html").includes("glance"));
  assert.ok(!failing(page({ lead: "<p>Royal Caribbean cruise from Miami: about $2,400 for a family of 4 for 4 nights, saving about $600 against the regular fare.</p>" }), "deals/some-deal.html").includes("glance"));
  assert.ok(!failing(page(), "deals/index.html").includes("glance"));
});

test("placeholder values and empty tables fail; sentences that mention 'not observed' do not", () => {
  assert.ok(failing(page({ body: "<section><table><tr><th>Total</th><td>Not observed. Check live.</td></tr></table></section>" })).includes("no_placeholders"));
  assert.ok(failing(page({ body: "<section><p>TBD</p></section>" })).includes("no_placeholders"));
  assert.ok(failing(page({ body: "<section><table><thead><tr><th>A</th></tr></thead><tbody></tbody></table></section>" })).includes("no_placeholders"));
  assert.ok(!failing(page({ body: "<section><p>We have not observed comparable quotes.</p><table><tr><td>$5</td></tr></table></section>" })).includes("no_placeholders"));
});

test("a sourced fact block needs a date; a pointer-only section does not", () => {
  const undated = `<section><h2>Tickets</h2><p>Kids under 12 pay $69 on the <a href="https://zoo.example/t">official page</a>.</p></section>`;
  assert.ok(failing(page({ body: undated })).includes("dated_sources"));
  for (const date of ["October 27, 2026", "Oct 27", "2026-10-27"])
    assert.ok(!failing(page({ body: undated.replace("official page</a>.", `official page</a>, checked ${date}.`) })).includes("dated_sources"));
  const pointer = `<section><h2>Before you go</h2><p>Check the <a href="https://zoo.example/hours">official hours page</a>.</p></section>`;
  assert.ok(!failing(page({ body: pointer })).includes("dated_sources"));
  const creditOnly = `<section><h2>Photo</h2><p>Kids 5 minutes away. <a href="https://commons.wikimedia.org/wiki/File:X.jpg">Source</a>.</p></section>`;
  assert.ok(!failing(page({ body: creditOnly })).includes("dated_sources"));
});

test("regressions catch a lost check and a new failing page; known gaps are not regressions", () => {
  const report = [{ page: "a.html", failing: ["og"], results: { og: { issues: ["missing og:title"] } } }, { page: "b.html", failing: ["hero"], results: { hero: { issues: ["no photo"] } } }];
  assert.deepEqual(regressions(report, { pages: { "a.html": ["og"], "b.html": [] } }).map(r => [r.page, r.check, r.new_page]), [["b.html", "hero", false]]);
  assert.deepEqual(regressions(report, { pages: { "a.html": ["og"] } }).map(r => [r.page, r.new_page]), [["b.html", true]]);
  assert.deepEqual(closedGaps(report, { pages: { "a.html": ["og", "hero"] } }), [{ page: "a.html", check: "hero" }]);
  assert.deepEqual(baselineFrom(report, "2026-10-29").pages, { "a.html": ["og"], "b.html": ["hero"] });
});

test("baseline update adds new pages and closed gaps but refuses an existing page's regression", () => {
  const report = [
    { page: "old.html", failing: ["hero"], results: { hero: { issues: ["no photo"] } } },
    { page: "fixed.html", failing: [], results: {} },
    { page: "new.html", failing: ["og", "glance"], results: { og: { issues: ["x"] }, glance: { issues: ["y"] } } },
  ];
  const baseline = { pages: { "old.html": [], "fixed.html": ["og"], "gone.html": ["hero"] } };
  const refused = mergeBaseline(report, baseline, "2026-10-29");
  assert.deepEqual(refused.refused.map(r => [r.page, r.check]), [["old.html", "hero"]]);
  const ok = mergeBaseline(report, baseline, "2026-10-29", ["old.html"]);
  assert.deepEqual(ok.baseline.pages, { "old.html": ["hero"], "fixed.html": [], "new.html": ["og", "glance"] });
  const tightened = mergeBaseline(report.slice(1), { pages: { "fixed.html": ["og"] } }, "2026-10-29");
  assert.deepEqual(tightened.baseline.pages, { "fixed.html": [], "new.html": ["og", "glance"] });
});

test("placeholder check sees inline-wrapped values; same-origin look-alikes are remote", () => {
  for (const cell of ["<em>TBD</em>", "<b>Not observed</b>", '<a href="#x">TBA</a>'])
    assert.ok(failing(page({ body: `<section><table><tr><td>${cell}</td></tr></table></section>` })).includes("no_placeholders"), cell);
  assert.equal(localFile("https://familytripwise.com.evil/images/photo.webp", "x.html", site), null);
  assert.equal(localFile("../site-x/photo.webp", "x.html", site), null);
  assert.ok(localFile("https://familytripwise.com/images/photo.webp", "x.html", site));
});

test("committed site: no page loses a quality check it had (tools/site-quality-baseline.json)", (t) => {
  const report = auditSite();
  const baseline = readBaseline();
  assert.ok(report.length >= 40, "sitemap pages were read");
  const pages = new Set(sitemapPages());
  for (const [p, checks] of Object.entries(baseline.pages)) {
    // A page can leave the sitemap on its own (an ended deal); that only leaves a stale line.
    if (!pages.has(p)) t.diagnostic(`baseline lists ${p}, which is no longer in the sitemap`);
    for (const c of checks) assert.ok(CHECKS.includes(c), `${p}: unknown check ${c}`);
  }
  const reg = regressions(report, baseline);
  assert.deepEqual(reg.map(r => `${r.page} ${r.check}: ${r.issues.join("; ")}`), [], "page-quality regression: fix the page; a new page's gaps are recorded with node tools/site-quality.mjs --write-baseline (it refuses existing-page regressions unless --accept <page>)");
  const closed = closedGaps(report, baseline);
  if (closed.length) t.diagnostic(`closed gaps (tighten the baseline): ${closed.map(c => `${c.page} ${c.check}`).join(", ")}`);
});
