import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createFamilyHotelPages } from "./page-generation/family-hotel-pages.mjs";
import { datedBudgetComparisonHtml } from "./page-generation/nyc-dated-budget-comparison.mjs";
import { beaconSuiteHtml } from "./page-generation/nyc-beacon-suite.mjs";
import { radioCityPriceHtml } from "./page-generation/nyc-radio-city-price.mjs";
import { trypPriceHtml } from "./page-generation/nyc-tryp-price.mjs";

const read = p => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
const html = read("site/where-to-stay/new-york-city-family-hotels.html");
const hotels = createFamilyHotelPages({}).hotelCatalog["new-york-city"];

test("comparisons precede the photo and detailed cards without repeated starter layers", () => {
  assert.match(html, /<h1>New York City Family Hotels<\/h1>/);
  assert.ok(html.indexOf('id="hotel-comparison"') < html.indexOf('id="dated-family-budgets"'));
  assert.ok(html.indexOf('id="dated-family-budgets"') < html.indexOf('<figure class="licensed-photo">'));
  assert.ok(html.indexOf('<figure class="licensed-photo">') < html.indexOf('id="nyc-hotel-1"'));
  assert.doesNotMatch(html, /Trip-style starts|Hotels covered|Choose the room function before the hotel brand/);
  assert.match(html, /href="\.\/new-york-city-with-kids.html">Compare stay areas/);
  assert.match(html, /alt="Central Park and the New York City skyline\."[^>]+loading="lazy"/);
});

test("full historical basis occurs once and every price card retains dated caution and direct access", () => {
  assert.equal((html.match(/Historical USD\/room\/night planning ranges from July 25, 2026 checks/g) || []).length, 1);
  const cards = [...html.matchAll(/<article class="detail-card hotel-card"[^>]*>([\s\S]*?)<\/article>/g)];
  assert.equal(cards.length, 12);
  for (const c of cards) {
    assert.match(c[1], /Two-adult samples checked July 25, 2026; taxes, fees and exact basis vary/);
    assert.match(c[1], /not a quote for your family/);
    assert.match(c[1], /href="#historical-price-basis"/);
  }
  for (const hotel of hotels) for (const value of [hotel.name, hotel.category, hotel.area, hotel.priceRange, hotel.priceNote, hotel.familySetup, hotel.reviewSignal, hotel.parentCheck, ...hotel.strengths]) assert.ok(html.includes(value.replaceAll("&", "&amp;").replaceAll('"', "&quot;")), value);
});

test("native scroll region and twelve distinct card destinations need no script", () => {
  assert.match(html, /role="region" aria-label="NYC twelve-hotel comparison" tabindex="0"/);
  for (let i = 1; i <= 12; i++) {
    assert.equal((html.match(new RegExp(`href="#nyc-hotel-${i}"`, "g")) || []).length, 1);
    assert.equal((html.match(new RegExp(`id="nyc-hotel-${i}"`, "g")) || []).length, 1);
  }
  const css = read("site/styles.css");
  assert.match(css, /#hotel-comparison\[data-glance-first\] td:first-child \{\s*position: sticky;/);
  assert.match(css, /#nyc-hotel-intro h1 \{\s*font-size: 2\.25rem;/);
});

test("existing CSV is secondary, with historical scope explicit and no new export", () => {
  const disclosure = html.match(/<details><summary>Spreadsheet copy<\/summary>[\s\S]*?<\/details>/)[0];
  assert.doesNotMatch(disclosure, /<details[^>]*\bopen/);
  assert.match(disclosure, /href="\.\.\/downloads\/new-york-city-family-hotels.csv" download/);
  assert.match(disclosure, /separate October room-budget samples are not included/);
  assert.ok(html.indexOf(disclosure) > html.indexOf('</table>'));
  assert.equal(read("site/downloads/new-york-city-family-hotels.csv"), createFamilyHotelPages({}).newYorkCityHotelComparisonCsv());
});

test("three qualified dated-budget blocks stay byte-identical and visible", () => {
  for (const block of [datedBudgetComparisonHtml(), beaconSuiteHtml(), radioCityPriceHtml(), trypPriceHtml()]) assert.ok(html.includes(block));
  assert.match(html, /two-child limit conflicts/);
  assert.match(html, /individual ages not entered/);
  assert.match(html, /do not add them again/);
});
