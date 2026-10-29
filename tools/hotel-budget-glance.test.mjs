import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createFamilyHotelPages } from "./page-generation/family-hotel-pages.mjs";

// G14 (owner 2026-10-29): the "$ a night" glance must only restate the dated bands the table shows.
const catalog = createFamilyHotelPages({}).hotelCatalog;
const decode = (value) => value.replaceAll("&amp;", "&").replaceAll("&#39;", "'").replaceAll("&quot;", '"');

for (const [slug, observed] of [["las-vegas", "July 22, 2026"], ["san-antonio", "July 26, 2026"]]) {
  test(`${slug} budget glance restates table bands, dated and caveated, above the table`, () => {
    const html = readFileSync(new URL(`../site/where-to-stay/${slug}-family-hotels.html`, import.meta.url), "utf8");
    const glance = html.match(new RegExp(`<section id="${slug}-budget-glance"[\\s\\S]*?</section>`))?.[0];
    assert.ok(glance, "glance missing");
    assert.ok(html.indexOf(glance) < html.indexOf('<table class="comparison-table hotel-comparison">'));
    assert.ok(html.indexOf(glance) < html.indexOf("<h2"), "glance must sit above the first h2");
    assert.ok(glance.includes(`public prices checked ${observed}`));
    assert.match(glance, /not (current five-person suite|family-room) quotes/);
    assert.doesNotMatch(glance, /href="#/, "glance must not add hotel anchor links");
    const bands = new Map(catalog[slug].map((hotel) => [hotel.name, hotel.priceRange]));
    const items = [...glance.matchAll(/<li><strong>\$([\d,]+)–\$([\d,]+)(\+?)<\/strong> [^:]+: ([^<]+)<\/li>/g)];
    assert.ok(items.length >= 3);
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
