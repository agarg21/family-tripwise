// R1 step 3: sitewide Organization + Article JSON-LD (tools/page-generation/site-schema.mjs).
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { ORG_ID, articleHeadline, siteSchema, visibleLastUpdated, withSiteSchema } from "./page-generation/site-schema.mjs";

const siteDir = fileURLToPath(new URL("../site/", import.meta.url));
const files = (dir) => readdirSync(dir).flatMap((n) => { const f = join(dir, n); return statSync(f).isDirectory() ? files(f) : n.endsWith(".html") ? [f] : []; });
const pages = files(siteDir).map((f) => ({ path: relative(siteDir, f).split(sep).join("/"), html: readFileSync(f, "utf8") }));
const tagOf = (html) => [...html.matchAll(/<script type="application\/ld\+json" data-site-schema>([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1]));
const sitemap = readFileSync(join(siteDir, "sitemap.xml"), "utf8");
const lastmods = Object.fromEntries([...sitemap.matchAll(/<loc>https:\/\/familytripwise\.com\/([^<]*)<\/loc><lastmod>([^<]+)<\/lastmod>/g)].map(([, p, d]) => [p === "" || p.endsWith("/") ? `${p}index.html` : p, d]));

test("every sitemap page carries exactly one site schema tag with the organization", () => {
  for (const path of Object.keys(lastmods)) {
    const page = pages.find((p) => p.path === path);
    const tags = tagOf(page.html);
    assert.equal(tags.length, 1, path);
    const org = tags[0]["@graph"][0];
    assert.equal(org["@type"], "Organization", path);
    assert.equal(org["@id"], ORG_ID, path);
    assert.equal(org.name, "Family Tripwise", path);
    assert.ok(page.html.lastIndexOf("data-site-schema") > page.html.lastIndexOf("</main>"), `${path}: tag after <main>`);
  }
});

test("redirect stubs and pages without <main> get no site schema", () => {
  for (const page of pages.filter((p) => !/<main\b/i.test(p.html) || /name="robots"\s+content="[^"]*noindex/i.test(p.html))) {
    assert.equal(tagOf(page.html).length, 0, page.path);
  }
});

test("founder and website appear only on home/about; founder matches the About page", () => {
  const about = pages.find((p) => p.path === "about.html").html;
  assert.match(about, /Apoorva Garg/);
  assert.match(about, /linkedin\.com\/in\/apoorvag20/);
  for (const page of pages) {
    const graph = tagOf(page.html)[0]?.["@graph"] ?? [];
    const full = ["index.html", "about.html"].includes(page.path);
    assert.equal(Boolean(graph[0]?.founder), full && graph.length > 0, page.path);
    assert.equal(graph.some((n) => n["@type"] === "WebSite"), page.path === "index.html", page.path);
  }
});

test("Article only on guide, holiday, ski and single-deal pages; it repeats the page's own title, canonical, image and sitemap lastmod", () => {
  let articles = 0;
  for (const page of pages) {
    const graph = tagOf(page.html)[0]?.["@graph"] ?? [];
    const article = graph.find((n) => n["@type"] === "Article");
    const eligible = /^(things-to-do|where-to-stay|family-itinerary|holidays|ski|deals)\/[a-z0-9-]+\.html$/.test(page.path)
      && !["deals/index.html", "deals/black-friday-family-travel-deals.html"].includes(page.path)
      && !/"@type":\s*"WebPage"/.test(page.html) && graph.length > 0;
    assert.equal(Boolean(article), eligible, page.path);
    if (!article) continue;
    articles += 1;
    const title = page.html.match(/<title>([\s\S]*?)<\/title>/)[1].replaceAll("&amp;", "&").replaceAll("&#39;", "'").replaceAll("&quot;", '"');
    assert.equal(article.headline, articleHeadline(title), page.path);
    assert.ok(title.replace(/ \| Family Tripwise$/, "").startsWith(article.headline.replace(/…$/, "")), page.path);
    assert.ok(article.headline.length <= 110, page.path);
    assert.equal(article.url, page.html.match(/<link rel="canonical" href="([^"]+)"/)[1], page.path);
    assert.equal(article.image, page.html.match(/<meta property="og:image" content="([^"]+)"/)[1], page.path);
    assert.deepEqual(article.author, { "@id": ORG_ID }, page.path);
    assert.deepEqual(article.publisher, { "@id": ORG_ID }, page.path);
    assert.ok(!("datePublished" in article), `${page.path}: no invented publish date`);
    const visible = visibleLastUpdated(page.html);
    if (visible && visible !== lastmods[page.path]) assert.ok(!("dateModified" in article), `${page.path}: visible date differs, no dateModified`);
    else assert.equal(article.dateModified, lastmods[page.path], page.path);
  }
  assert.ok(articles >= 60, `articles: ${articles}`);
});

test("withSiteSchema is idempotent, escapes < and dates only sitemap pages", () => {
  const html = '<html><head><title>A &lt;b&gt; title</title><meta name="description" content="d"><link rel="canonical" href="https://familytripwise.com/ski/x.html"></head><body><main><p>x</p></main></body></html>';
  const ledger = { pages: { "ski/x.html": { lastmod: "2026-11-13" } } };
  const once = withSiteSchema(html, "ski/x.html", { ledger });
  assert.equal(withSiteSchema(once, "ski/x.html", { ledger }), once);
  assert.ok(!/data-site-schema>[^<]*<b>/.test(once));
  assert.equal(tagOf(once)[0]["@graph"][1].headline, "A <b> title");
  assert.equal(tagOf(once)[0]["@graph"][1].dateModified, "2026-11-13");
  assert.ok(!("dateModified" in tagOf(withSiteSchema(html, "ski/x.html", { ledger: { pages: {} } }))[0]["@graph"][1]), "no ledger entry, no date");
  assert.equal(withSiteSchema(html, undefined, { ledger }), once, "path from canonical");
  assert.equal(siteSchema(html, "ski/other.html", { ledger }), null, "foreign canonical");
  assert.equal(articleHeadline("Short title | Family Tripwise"), "Short title");
  const long = articleHeadline(`${"word ".repeat(40)}end`);
  assert.ok(long.length <= 110 && long.endsWith("…") && !long.includes("wor…"), long);
});
