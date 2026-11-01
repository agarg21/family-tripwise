import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createFamilyHotelPages } from "./page-generation/family-hotel-pages.mjs";

const read = p => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
const html = read("site/where-to-stay/chicago-family-hotels.html");
const hotels = createFamilyHotelPages({}).hotelCatalog.chicago;
const esc = value => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");

test("Chicago comparison leads the licensed image and all hotel details", () => {
  assert.match(html, /<h1>Chicago Family Hotels<\/h1>/);
  assert.match(html, /<title>Top Family Hotels in Chicago: 10 Options by Trip Style<\/title>/);
  // G14 (owner 2026-10-29): the credited photo sits at the top, after the h1 and before the comparison.
  assert.ok(html.indexOf('</h1>') < html.indexOf('<figure class="licensed-photo hero-photo">'));
  assert.ok(html.indexOf('<figure class="licensed-photo hero-photo">') < html.indexOf('id="hotel-comparison"'));
  assert.ok(html.indexOf('<figure class="licensed-photo hero-photo">') < html.indexOf('id="chicago-hotel-1"'));
  assert.doesNotMatch(html, /Trip-style starts|Hotels covered|Let the room setup and first two days choose the hotel/);
  assert.match(html, /href="\.\/chicago-with-kids.html">Compare Chicago stay areas/);
  assert.match(html, /alt="Pritzker Pavilion trellis and the Chicago skyline in Millennium Park\."[^>]+loading="eager"/);
  assert.match(html, /CC BY-SA 3\.0/);
});

test("every unique hotel field remains and prices show Google family prices with dates", () => {
  for (const hotel of hotels) for (const value of [hotel.name, hotel.category, hotel.area, hotel.priceRange, hotel.familySetup, hotel.priceNote, hotel.reviewSignal, hotel.parentCheck, ...hotel.strengths]) assert.ok(html.includes(esc(value)), value);
  // Q18 (D25, 2026-11-01): each hotel shows its Google Hotels price for 2 adults + kids 5 and 8 (Jan 19, 2027) in the table and card.
  assert.equal((html.match(/<strong>\$[\d,]+ a night<\/strong><br><small>Google Hotels, 2 adults \+ kids 5 and 8, 1 night: Jan 19 \$[\d,]+, 2027; seen Oct 31\. Not a quote\.<\/small> <small>Check live rate<\/small>/g) || []).length, 20);
  assert.doesNotMatch(html, /date label unclear|Older 1-night sample/);
  assert.equal((html.match(/id="chicago-price-basis"/g) || []).length, 1);
  assert.ok(html.indexOf("Google Hotels prices for 2 adults + 2 kids, one night") < html.indexOf("<table"));
  assert.ok(html.indexOf('id="chicago-hotel-answer"') < html.indexOf('id="hotel-comparison"'));
  assert.match(html, /estimates, not quotes, family-suite or Kids Suite prices/);
  assert.doesNotMatch(html, /Planning USD\/room\/night|planning ranges?(?!s| are gone)|editorial room\/date widening|historical nightly budget|\$382/);
  assert.match(html, /Notice rechecked September 22, 2026/);
  assert.match(html, /published window has passed, but completion and current access are unconfirmed/);
});

test("ten native card links and price-basis links support a no-script scan", () => {
  assert.match(html, /role="region" aria-label="Chicago hotel comparison" tabindex="0"/);
  for (let i=1;i<=10;i++) {
    assert.equal((html.match(new RegExp(`href="#chicago-hotel-${i}"`, "g")) || []).length, 1);
    assert.equal((html.match(new RegExp(`id="chicago-hotel-${i}"`, "g")) || []).length, 1);
  }
  const css = read("site/styles.css");
  assert.match(css, /#chicago-hotel-intro h1 \{\s*font-size: var\(--t-2xl\);/);
  assert.match(css, /#chicago-hotel-intro ~ #hotel-comparison table \{\s*min-width: 1080px;/);
  assert.match(css, /#hotel-comparison\[data-glance-first\] td:first-child \{\s*position: sticky;/);
});

test("existing spreadsheet is secondary and retains byte-identical maintained rows", () => {
  const disclosure = html.match(/<details><summary>Spreadsheet copy<\/summary>[\s\S]*?<\/details>/)[0];
  assert.doesNotMatch(disclosure, /<details[^>]*\bopen/);
  assert.match(disclosure, /href="\.\.\/downloads\/chicago-family-hotels\.csv" download/);
  assert.ok(html.indexOf(disclosure) > html.indexOf('</table>'));
  assert.equal(read("site/downloads/chicago-family-hotels.csv"),createFamilyHotelPages({}).chicagoHotelComparisonCsv());
});
