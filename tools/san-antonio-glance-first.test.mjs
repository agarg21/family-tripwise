import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createFamilyHotelPages } from "./page-generation/family-hotel-pages.mjs";

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const html = read("site/where-to-stay/san-antonio-family-hotels.html");
const hotels = createFamilyHotelPages({}).hotelCatalog["san-antonio"];
const esc = value => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");

test("San Antonio comparison leads retained routing, media and hotel disclosures", () => {
  assert.match(html, /<h1>San Antonio Family Hotels<\/h1>/);
  assert.match(html, /<title>Top Family Hotels in San Antonio: 12 Options by Trip Style<\/title>/);
  assert.ok(html.indexOf('</table>') < html.indexOf("Decide whether the hotel is the attraction"));
  assert.ok(html.indexOf("Pick the closest version of your trip") < html.indexOf('<figure class="licensed-photo">'));
  assert.ok(html.indexOf('<figure class="licensed-photo">') < html.indexOf('id="san-antonio-hotel-1"'));
  assert.equal((html.match(/<article class="quick-pick">/g) || []).length, 6);
  assert.match(html, /san-antonio-river-walk\.webp"[^>]+loading="lazy"/);
  assert.match(html, /CC BY-SA 2\.0/);
  assert.doesNotMatch(html, /downloads\/.*\.csv|Spreadsheet copy/);
});

test("every unique room, water, rest and historical-price limit remains", () => {
  assert.equal(hotels.length, 12);
  for (const hotel of hotels) for (const value of [hotel.name,hotel.category,hotel.area,hotel.priceRange,hotel.familySetup,hotel.priceNote,hotel.reviewSignal,hotel.parentCheck,...hotel.strengths]) assert.ok(html.includes(esc(value)), value);
  assert.match(html, /Official room categories checked September 30, 2026/);
  assert.match(html, /studios and one-bedroom villas sleep up to four/);
  assert.match(html, /two-bedroom villas sleep up to eight total, with a six-adult limit/);
  assert.match(html, /July 26 planning band is not a five-person quote/);
  assert.match(html, /Room-rest notice checked September 22, 2026/);
  assert.match(html, /five entry wristbands per room/);
  assert.match(html, /upper edges are editorial planning ceilings, not observed quotes/);
  assert.match(html, /Official hotel facts rechecked:<\/strong> September 5, 2026/);
});

test("existing native card links and keyboard region keep their stable targets", () => {
  assert.match(html, /role="region" aria-label="San Antonio hotel comparison" tabindex="0"/);
  for (let index=1;index<=12;index++) {
    assert.equal((html.match(new RegExp(`href="#san-antonio-hotel-${index}"`,"g")) || []).length, 1);
    assert.equal((html.match(new RegExp(`id="san-antonio-hotel-${index}"`,"g")) || []).length, 1);
  }
  const css = read("site/styles.css");
  assert.match(css, /#san-antonio-hotel-intro h1 \{\s*font-size: 2\.25rem/);
  assert.match(css, /#san-antonio-hotel-intro ~ section details\.hotel-card \{\s*scroll-margin-top: 80px/);
  assert.match(css, /#hotel-comparison\[data-glance-first\] td:first-child \{\s*position: sticky/);
});
