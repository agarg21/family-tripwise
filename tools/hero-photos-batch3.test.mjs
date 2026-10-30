// G14 batch 3 (2026-10-30): home, about, contributor, privacy, terms, /this-week/ and /deals/ show a credited, self-hosted
// banner photo before their first section heading, keep their Family Tripwise link-preview card, and never share a photo.
import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { sitePageHeroes } from "./page-generation/hero-photos.mjs";

const site = new URL("../site/", import.meta.url).pathname;

test("each site page shows its banner before the first h2, self-hosted and credited", () => {
  for (const [path] of Object.entries(sitePageHeroes)) {
    const html = readFileSync(join(site, path), "utf8");
    const main = html.slice(html.indexOf("<main"));
    const fig = main.indexOf('<figure class="licensed-photo hero-photo">');
    assert.ok(fig > 0 && fig < main.indexOf("<h2"), `${path}: banner before first h2`);
    assert.ok(main.indexOf("<h1") < fig, `${path}: banner after the h1`);
    assert.equal((html.match(/class="licensed-photo hero-photo"/g) || []).length, 1, path);
    const figure = main.slice(fig, main.indexOf("</figure>", fig));
    const src = figure.match(/src="([^"]+)"/)[1];
    assert.ok(!/^https?:/.test(src), `${path}: self-hosted`);
    assert.ok(existsSync(join(dirname(join(site, path)), src)), `${path}: ${src} exists`);
    assert.match(figure, /alt="[^"]{20,}"/, path);
    assert.match(figure, /<figcaption>[^<]*Photo[\s\S]*<a href="https:\/\/commons\.wikimedia\.org\/wiki\/File:/, path);
    assert.match(figure, /CC0|CC BY|public domain/, path);
    assert.doesNotMatch(html, /og:image" content="[^"]*\/og\/photos\//, `${path}: keeps its section card`);
  }
});

test("no photo is repeated across the batch 3 pages", () => {
  const keys = Object.values(sitePageHeroes);
  assert.equal(new Set(keys).size, keys.length);
});

test("home page links the deals and this-week hubs at the top and drops internal SEO notes", () => {
  const html = readFileSync(join(site, "index.html"), "utf8");
  const hero = html.slice(html.indexOf('<section class="page-hero">'), html.indexOf("</section>"));
  assert.match(hero, /href="\.\/deals\/"/);
  assert.match(hero, /href="\.\/this-week\/"/);
  assert.doesNotMatch(html, /GSC|SEO research|routing hub|Expansion rule/);
});
