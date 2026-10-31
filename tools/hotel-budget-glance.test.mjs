import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createFamilyHotelPages } from "./page-generation/family-hotel-pages.mjs";

// G14 (owner 2026-10-29): the "$ a night" glance must only restate the dated bands the table shows.
const catalog = createFamilyHotelPages({}).hotelCatalog;
const decode = (value) => value.replaceAll("&amp;", "&").replaceAll("&#39;", "'").replaceAll("&quot;", '"');

for (const [slug, observed] of [["las-vegas", "July 22, 2026"]]) {
  test(`${slug} budget glance restates table bands, dated and caveated, above the table`, () => {
    const html = readFileSync(new URL(`../site/where-to-stay/${slug}-family-hotels.html`, import.meta.url), "utf8");
    const glance = html.match(new RegExp(`<section id="${slug}-budget-glance"[\\s\\S]*?</section>`))?.[0];
    assert.ok(glance, "glance missing");
    assert.ok(html.indexOf(glance) < html.indexOf('<table class="comparison-table hotel-comparison">'));
    assert.ok(html.indexOf(glance) < html.indexOf("<h2"), "glance must sit above the first h2");
    assert.ok(glance.includes(`planning ranges built from public prices checked ${observed}`));
    assert.match(glance, /not (current five-person suite|family-room) quotes/);
    assert.doesNotMatch(glance, /href="#/, "glance must not add hotel anchor links");
    const bands = new Map(catalog[slug].map((hotel) => [hotel.name, hotel.priceRange]));
    const items = [...glance.matchAll(/<li><strong>\$([\d,]+)–\$([\d,]+)(\+?)<\/strong> [^:]+: ([^<]+)<\/li>/g)];
    assert.ok(items.length >= 3);
    assert.equal(items.length, (glance.match(/<li>/g) || []).length, "every glance line must parse");
    const listed = items.flatMap((item) => decode(item[4]).split(", "));
    assert.deepEqual([...listed].sort(), [...bands.keys()].sort(), "every hotel appears exactly once");
    for (const [, low, high, plus, names] of items) {
      const ranges = decode(names).split(", ").map((name) => {
        assert.ok(bands.has(name), `unknown hotel ${name}`);
        const [, a, b, p] = /^\$([\d,]+)-\$([\d,]+)(\+?)$/.exec(bands.get(name));
        return { low: Number(a.replace(/,/g, "")), high: Number(b.replace(/,/g, "")), plus: p === "+" };
      });
      assert.equal(Number(low.replace(/,/g, "")), Math.min(...ranges.map((r) => r.low)));
      assert.equal(Number(high.replace(/,/g, "")), Math.max(...ranges.map((r) => r.high)));
      assert.equal(plus === "+", ranges.some((r) => r.plus && r.high === Number(high.replace(/,/g, ""))));
    }
  });
}

// Q18 (2026-10-31): San Antonio retired its editorial bands; the glance restates only the observed samples.
test("san-antonio sample glance restates observed samples only, dated and caveated, above the table", () => {
  const html = readFileSync(new URL("../site/where-to-stay/san-antonio-family-hotels.html", import.meta.url), "utf8");
  const glance = html.match(/<section id="san-antonio-budget-glance"[\s\S]*?<\/section>/)?.[0];
  assert.ok(glance, "glance missing");
  assert.ok(html.indexOf(glance) < html.indexOf('<table class="comparison-table hotel-comparison">'));
  assert.ok(html.indexOf(glance) < html.indexOf("<h2"), "glance must sit above the first h2");
  assert.match(glance, /Older one-night prices per room \(mostly 2 adults\), seen July 26, 2026:/);
  assert.match(glance, /No current family-room rate observed/);
  assert.match(glance, /Check live rates for your dates, room and kids(&#39;|') ages\./);
  assert.doesNotMatch(glance, /href="#|planning|\+<\/strong>/);
  const hotels = catalog["san-antonio"];
  const items = [...glance.matchAll(/<li><strong>\$([\d,]+)–\$([\d,]+)<\/strong> ([^<(]+) \((\d+) hotels\)(?: <small>[^<]*<\/small>)?<\/li>/g)];
  assert.equal(items.length, (glance.match(/<li>/g) || []).length, "every glance line must parse");
  const groups = new Map([...glance.matchAll(/<p><strong>([^<]+):<\/strong> ([^<]+)<\/p>/g)].map((m) => [decode(m[1]), decode(m[2])]));
  for (const item of items) item[3] = groups.get(decode(item[3]));
  assert.ok(items.every((item, i) => item[3] && item[3].split(", ").length === Number([...glance.matchAll(/\((\d+) hotels\)/g)][i][1])));
  const listed = items.flatMap((item) => item[3].trim().split(", "));
  assert.deepEqual([...listed].sort(), hotels.map((hotel) => hotel.name).sort(), "every hotel appears exactly once");
  for (const [, low, high, names] of items) {
    const values = decode(names).trim().split(", ").flatMap((name) => hotels.find((hotel) => hotel.name === name).olderSample.amount.match(/\d+/g).map(Number));
    assert.equal(Number(low), Math.min(...values));
    assert.equal(Number(high), Math.max(...values));
  }
  assert.match(glance, /<small>\(Wild Oak \$249 is before taxes\)<\/small>/);
});
