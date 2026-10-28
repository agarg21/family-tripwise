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
  assert.ok(html.indexOf('id="hotel-comparison"') < html.indexOf('<figure class="licensed-photo">'));
  assert.ok(html.indexOf('<figure class="licensed-photo">') < html.indexOf('id="chicago-hotel-1"'));
  assert.doesNotMatch(html, /Trip-style starts|Hotels covered|Let the room setup and first two days choose the hotel/);
  assert.match(html, /href="\.\/chicago-with-kids.html">Compare Chicago stay areas/);
  assert.match(html, /alt="Millennium Park and the Chicago skyline at dusk\."[^>]+loading="lazy"/);
  assert.match(html, /CC BY-SA 3\.0/);
});

test("every unique hotel field remains and prices show Check live rate with dated older samples", () => {
  for (const hotel of hotels) for (const value of [hotel.name, hotel.category, hotel.area, hotel.priceRange, hotel.familySetup, hotel.priceNote, hotel.reviewSignal, hotel.parentCheck, ...hotel.strengths]) assert.ok(html.includes(esc(value)), value);
  // Q08 (2026-10-27): the editorial bands are gone; each hotel shows Check live rate plus its older sample in the table and card.
  assert.equal((html.match(/Check live rate<br><small>Older 1-night sample: \$[\d,]+ \((?:recorded Jul 23|date label unclear)\)<\/small>/g) || []).length, 20);
  const visible = html.slice(0, html.indexOf('<script type="application/ld+json">'));
  assert.equal((visible.match(/date label unclear/g) || []).length, 4);
  assert.equal((html.match(/id="chicago-price-basis"/g) || []).length, 1);
  assert.ok(html.indexOf("No current family-room rate observed: check the live rate") < html.indexOf("<table"));
  assert.ok(html.indexOf('id="chicago-hotel-answer"') < html.indexOf('id="hotel-comparison"'));
  assert.match(html, /no figure is a family-room price, a Kids Suite price or a current quote/);
  assert.match(html, /Earlier planning ranges are gone because their upper ends were editorial estimates, not observations/);
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
  assert.match(css, /#chicago-hotel-intro h1 \{\s*font-size: 2\.25rem;/);
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
