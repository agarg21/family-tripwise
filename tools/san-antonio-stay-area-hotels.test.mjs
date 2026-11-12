import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { createFamilyHotelPages } from "./page-generation/family-hotel-pages.mjs";
import { easternDate } from "./page-generation/sitemap.mjs";

// R1 step 1 (OWNER D44): the stay-area page lists each area's hotels with the hotel page's own weekend figure.
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const stay = readFileSync(join(root, "site", "where-to-stay", "san-antonio-with-kids.html"), "utf8");
const hotels = readFileSync(join(root, "site", "where-to-stay", "san-antonio-family-hotels.html"), "utf8");
const sectionOf = (html) => html.match(/<section[^>]+id="san-antonio-area-hotels"[\s\S]*?<\/section>/)?.[0] ?? "";
const section = sectionOf(stay);
const esc = (value) => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
const pages = createFamilyHotelPages({ esc, pageShell: () => "" });
const today = process.env.FT_BUILD_DATE || easternDate();

test("stay-area hotel cards sit after the quick picks and before the area matrix", () => {
  assert.ok(section, "area hotel section present");
  assert.ok(stay.indexOf("Five useful starting points") < stay.indexOf('id="san-antonio-area-hotels"'));
  assert.ok(stay.indexOf('id="san-antonio-area-hotels"') < stay.indexOf("Compare the base before the hotel"));
  assert.equal((section.match(/<article class="quick-pick area-hotel-card/g) || []).length, 5);
});

test("every hotel link resolves to a card on the hotel page and all 12 hotels appear once", () => {
  const ids = [...section.matchAll(/href="\.\/san-antonio-family-hotels\.html#(san-antonio-hotel-\d+)"/g)].map((m) => m[1]);
  assert.equal(ids.length, 12);
  assert.equal(new Set(ids).size, 12);
  for (const id of ids) assert.ok(hotels.includes(`id="${id}"`), id);
});

test("placed hotels match their record's area", () => {
  const catalog = pages.hotelCatalog["san-antonio"];
  const areaWord = { "Downtown / River Walk": "Downtown", "Westover Hills / SeaWorld": "SeaWorld", "La Cantera / Six Flags": "La Cantera" };
  for (const [, area, body] of section.matchAll(/<span>([^<]+)<\/span>\s*([\s\S]*?)<\/article>/g)) {
    for (const [, n] of body.matchAll(/#san-antonio-hotel-(\d+)"/g)) assert.ok(catalog[n - 1].area.includes(areaWord[area]), `${catalog[n - 1].name} in ${area}`);
  }
});

test("prices match the hotel page while live; the expired render shows none and keeps the links", () => {
  if (today < "2027-01-15") {
    for (const [, id, price] of section.matchAll(/#(san-antonio-hotel-\d+)">[^<]+<\/a><b>(≈ \$\d+|\$\d+)/g)) {
      const card = hotels.match(new RegExp(`id="${id}">[\\s\\S]*?<span class="hotel-card-price">([\\s\\S]*?)</span>`))?.[1] ?? "";
      assert.ok(card.includes(price.replace(" ", " ")), `${id} ${price}`);
    }
    assert.match(section, /Family of 4 \(2 adults \+ kids 5 and 8\), Fri–Sun, Jan 22–24, 2027 · ≈ is the average of the Friday and Saturday nights · Google Hotels, seen November 5, 2026 · estimates, not quotes\./);
    assert.match(section, /room type, the number of rooms, or which taxes and fees are included: check the room sleeps 4/);
    assert.match(section, /Wild Oak<\/a><b>≈ \$\d+ <small>sales offers possible<\/small>/);
  } else {
    // From January 15, 2027 this fails until `node tools/generate-pages.mjs` re-renders the page.
    assert.doesNotMatch(section, /Jan 22|\$\d/);
  }
  const expired = sectionOf(pages.sanAntonioStayAreaHotels("2027-01-15"));
  assert.doesNotMatch(expired, /Jan 22|\$\d/);
  assert.equal((expired.match(/#san-antonio-hotel-\d+"/g) || []).length, 12);
});

test("areas without a guide hotel say so instead of implying coverage", () => {
  assert.equal((section.match(/None in our 12-hotel guide yet/g) || []).length, 2);
});
