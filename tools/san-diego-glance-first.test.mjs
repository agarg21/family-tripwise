import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createFamilyHotelPages } from "./page-generation/family-hotel-pages.mjs";
import { sanDiegoCurrentFeeNote, sanDiegoCurrentRoomNote } from "./page-generation/san-diego-hotel-evidence.mjs";

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const html = read("site/where-to-stay/san-diego-family-hotels.html");
const hotels = createFamilyHotelPages({}).hotelCatalog["san-diego"];
const esc = value => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");

test("San Diego exposes the table before complete trip-routing guidance and licensed image", () => {
  assert.match(html, /<h1>San Diego Family Hotels<\/h1>/);
  assert.match(html, /<title>Top Family Hotels in San Diego: 12 Options by Trip Style<\/title>/);
  assert.ok(html.indexOf('aria-label="Review status"') < html.indexOf('id="hotel-comparison"'));
  assert.ok(html.indexOf("</table>") < html.indexOf("Pick the closest trip style"));
  assert.ok(html.indexOf("One base or split?") < html.indexOf('<figure class="licensed-photo">'));
  assert.equal((html.match(/<article class="quick-pick">/g) || []).length, 6);
  assert.match(html, /Compare a short North County split only when LEGOLAND anchors the trip/);
  assert.match(html, /21a-san-diego-mission-bay\.jpg"[^>]+loading="lazy"/);
  assert.match(html, /Photo: Alfred Twu, Wikimedia Commons, CC0/);
  assert.match(html, /href="\.\.\/downloads\/san-diego-family-hotels\.csv" download/);
  assert.ok(html.indexOf("Spreadsheet copy") < html.indexOf("Pick the closest trip style"));
});

test("all twelve unique cards, current fee and room overlays retain their exact text", () => {
  assert.equal(hotels.length, 12);
  for (const hotel of hotels) {
    for (const value of [hotel.name, hotel.category, hotel.area, hotel.priceRange, hotel.familySetup, hotel.priceNote, hotel.reviewSignal, hotel.parentCheck, ...hotel.strengths.slice(0,2)]) assert.ok(html.includes(esc(value)), value);
    for (const note of [sanDiegoCurrentFeeNote(hotel.name), sanDiegoCurrentRoomNote(hotel.name)].filter(Boolean)) assert.ok(html.includes(esc(note.text)), note.text);
  }
  assert.match(html, /Hotel facts checked:<\/strong> August 17, 2026/);
  assert.match(html, /Online-review themes sampled:<\/strong> July 18-21, 2026/);
  assert.match(html, /No current family-room rate observed: check the live rate/);
  assert.match(html, /Nightly price \(USD\/room\)/);
  assert.doesNotMatch(html, /planning ranges|Planning USD\/room\/night|Rough nightly range/);
  assert.match(html, /August checks did not provide consistent family totals/);
  assert.ok(html.indexOf("August checks did not provide consistent family totals") < html.indexOf("<table"));
});

test("native hotel anchors and keyboard comparison region do not need a script", () => {
  assert.match(html, /role="region" aria-label="San Diego hotel comparison" tabindex="0"/);
  for (let index=1; index<=12; index++) {
    assert.equal((html.match(new RegExp(`href="#san-diego-hotel-${index}"`, "g")) || []).length, 1);
    assert.equal((html.match(new RegExp(`id="san-diego-hotel-${index}"`, "g")) || []).length, 1);
  }
  const css = read("site/styles.css");
  assert.match(css, /#san-diego-hotel-intro h1 \{\s*font-size: 2\.25rem;/);
  assert.match(css, /#san-diego-hotel-intro ~ #hotel-comparison table \{\s*min-width: 1080px;/);
  assert.match(css, /#hotel-comparison\[data-glance-first\] td:first-child \{\s*position: sticky;/);
});
