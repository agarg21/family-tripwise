import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { contentHash, easternDate, mainContent, readLedger, sitePathForUrl, sitemapXml, updateLedger } from "./page-generation/sitemap.mjs";

const siteDir = new URL("../site/", import.meta.url).pathname;
const sitemap = readFileSync(join(siteDir, "sitemap.xml"), "utf8");
const rows = [...sitemap.matchAll(/<url><loc>([^<]+)<\/loc>(?:<lastmod>([^<]*)<\/lastmod>)?<\/url>/g)];

test("every sitemap URL carries a lastmod from the content-hash ledger", () => {
  assert.equal(rows.length, (sitemap.match(/<loc>/g) || []).length);
  const ledger = readLedger();
  for (const [, url, lastmod] of rows) {
    const path = sitePathForUrl(url);
    assert.match(lastmod ?? "", /^20\d\d-\d\d-\d\d$/, url);
    assert.equal(lastmod, ledger.pages[path].lastmod, url);
    assert.ok(lastmod <= easternDate(), `${url} lastmod is in the future`);
    assert.equal(ledger.pages[path].sha256, contentHash(readFileSync(join(siteDir, path), "utf8")), `${path} changed without regenerating the sitemap (run node tools/generate-pages.mjs)`);
  }
  assert.deepEqual(Object.keys(ledger.pages).sort(), rows.map(([, url]) => sitePathForUrl(url)).sort());
});

test("ledger keeps lastmod for unchanged bytes and moves it only on a content change", () => {
  const ledger = readLedger();
  const urls = rows.map(([, url]) => url);
  const same = updateLedger(ledger, siteDir, urls, "2099-01-01");
  assert.deepEqual(same.pages, ledger.pages);
  const changed = updateLedger({ pages: { ...ledger.pages, "about.html": { sha256: "0", lastmod: "2026-01-01" } } }, siteDir, urls, "2026-10-28");
  assert.equal(changed.pages["about.html"].lastmod, "2026-10-28");
  assert.equal(changed.pages["index.html"].lastmod, ledger.pages["index.html"].lastmod);
  assert.equal(sitemapXml(urls, ledger), sitemap);
});

test("lastmod hashes only the page's <main> content, not the shared chrome", () => {
  const page = '<head><title>A</title></head><a class="skip-link" href="#main">Skip</a><header>h1</header><main id="main"><h1>Body</h1></main><footer>f1</footer>';
  const chromeChanged = page.replace("h1</header>", "h2</header>").replace("f1", "f2").replace("<title>A", "<title>B").replace('id="main"', 'id="main" class="x"');
  assert.equal(mainContent(page), "<h1>Body</h1>");
  assert.equal(contentHash(chromeChanged), contentHash(page));
  assert.notEqual(contentHash(page.replace("Body", "Body 2")), contentHash(page));
  assert.equal(mainContent("<p>no main</p>"), "<p>no main</p>");
});

test("Orlando hotel and activity guides link to each other", () => {
  const hotels = readFileSync(join(siteDir, "where-to-stay/orlando-family-hotels.html"), "utf8");
  const activities = readFileSync(join(siteDir, "things-to-do/orlando-with-kids.html"), "utf8");
  assert.ok(hotels.includes('href="../things-to-do/orlando-with-kids.html"'));
  assert.ok(activities.includes('href="../where-to-stay/orlando-family-hotels.html"'));
});

test("no page links to the retired Coronado ferry-info URL", () => {
  const walk = (dir) => readdirSync(dir).flatMap((name) => statSync(join(dir, name)).isDirectory() ? walk(join(dir, name)) : [join(dir, name)]);
  for (const file of walk(siteDir).filter((f) => f.endsWith(".html"))) {
    assert.doesNotMatch(readFileSync(file, "utf8"), /coronadoferrylanding\.com\/ferry-info/, file);
  }
});
