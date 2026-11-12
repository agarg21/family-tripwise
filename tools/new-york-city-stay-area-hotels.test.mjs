import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { createFamilyHotelPages } from "./page-generation/family-hotel-pages.mjs";
import { easternDate } from "./page-generation/sitemap.mjs";

// R1 step 1 (OWNER D44): the New York City stay-area page lists each area's hotels with the hotel page's own weekend figure.
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const stay = readFileSync(join(root, "site", "where-to-stay", "new-york-city-with-kids.html"), "utf8");
const hotels = readFileSync(join(root, "site", "where-to-stay", "new-york-city-family-hotels.html"), "utf8");
const sectionOf = (html) => html.match(/<section[^>]+id="new-york-city-area-hotels"[\s\S]*?<\/section>/)?.[0] ?? "";
const section = sectionOf(stay);
const esc = (value) => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
const pages = createFamilyHotelPages({ esc, pageShell: () => "" });
const today = process.env.FT_BUILD_DATE || easternDate();
const cardOf = (id) => hotels.match(new RegExp(`id="${id}"[\\s\\S]*?</summary>`))?.[0] ?? "";

test("NYC area hotel cards sit after the quick picks and before the area matrix", () => {
  assert.ok(section, "area hotel section present");
  assert.ok(stay.indexOf("Five useful starting points") < stay.indexOf('id="new-york-city-area-hotels"'));
  assert.ok(stay.indexOf('id="new-york-city-area-hotels"') < stay.indexOf("Compare the area before the hotel"));
  assert.equal((section.match(/<article class="quick-pick area-hotel-card/g) || []).length, 5);
});

test("every NYC hotel link resolves to a card on the hotel page and all 12 hotels appear once", () => {
  const ids = [...section.matchAll(/href="\.\/new-york-city-family-hotels\.html#(nyc-hotel-\d+)"/g)].map((m) => m[1]);
  assert.equal(ids.length, 12);
  assert.equal(new Set(ids).size, 12);
  for (const id of ids) assert.ok(hotels.includes(`id="${id}"`), id);
});

test("placed NYC hotels match their record's area", () => {
  const catalog = pages.hotelCatalog["new-york-city"];
  const areaWords = {
    "Upper West Side": ["Upper West Side"],
    Midtown: ["Midtown", "Times Square", "Rockefeller", "Bryant Park", "Central Park South"],
    "Downtown / Tribeca": ["Tribeca", "Battery Park City", "Lower Manhattan"],
    "Brooklyn Heights / Downtown Brooklyn": ["Brooklyn Heights", "DUMBO"]
  };
  for (const [, area, body] of section.matchAll(/<span>([^<]+)<\/span>\s*([\s\S]*?)<\/article>/g)) {
    for (const [, n] of body.matchAll(/#nyc-hotel-(\d+)"/g)) {
      assert.ok(areaWords[area]?.some((word) => catalog[n - 1].area.includes(word)), `${catalog[n - 1].name} in ${area}`);
    }
  }
  assert.doesNotMatch(section, /Outside these/);
});

test("NYC prices match the hotel page while live; the expired render shows none and keeps the links", () => {
  if (today < "2027-01-15") {
    const prices = [...section.matchAll(/#(nyc-hotel-\d+)">[^<]+<\/a><b>(≈\s\$[\d,]+|\$[\d,]+)/g)];
    assert.ok(prices.length >= 8, "most placed hotels carry a price");
    for (const [, id, price] of prices) assert.ok(cardOf(id).includes(`<strong>${price.replace(/\s/, " ")} a night`), `${id} ${price}`);
    for (const n of [5, 6, 7]) {
      assert.match(section, new RegExp(`#nyc-hotel-${n}">[^<]+</a><b><small>no price shown</small></b>`));
      assert.ok(cardOf(`nyc-hotel-${n}`).includes("No price shown"));
    }
    assert.match(section, /Four Seasons Downtown<\/a><b>\$[\d,]+ <small>Friday only<\/small> <small>may be a larger room or two rooms<\/small>/);
    // One-hotel areas show that hotel's figure without "from" (oneHotel, persona P2 11-12).
    assert.match(section, /Upper West Side<\/span>\s*<strong class="area-hotel-from">≈\s\$[\d,]+<\/strong>\s*<p class="area-hotel-unit">a night, family of 4 · 1 hotel in our guide · room size not checked/);
    assert.doesNotMatch(section, /area-hotel-from">from [^<]+<\/strong>\s*<p class="area-hotel-unit">[^<]*1 hotel in our guide/);
    assert.match(section, /Family of 4 \(2 adults \+ kids 5 and 8\), Fri–Sun, Jan 22–24, 2027 · ≈ is the average of the Friday and Saturday nights · Google Hotels, seen November 5, 2026 · estimates, not quotes\./);
  } else {
    // From January 15, 2027 this fails until `node tools/generate-pages.mjs` re-renders the page.
    assert.doesNotMatch(section, /Jan 22|\$\d/);
  }
  const expired = sectionOf(pages.newYorkCityStayAreaHotels("2027-01-15"));
  assert.doesNotMatch(expired, /Jan 22|\$\d/);
  assert.equal((expired.match(/#nyc-hotel-\d+"/g) || []).length, 12);
});

test("Long Island City has no guide hotel and says so", () => {
  assert.equal((section.match(/None in our 12-hotel guide yet/g) || []).length, 1);
  assert.match(section, /Long Island City<\/span>\s*<p>None in our 12-hotel guide yet/);
});

// R1 step 1 (11-12): the LV cost glance on this stay page, under the page top and above the photo; named unpriced areas.
test("the new-york-city stay cost glance sits under the page top and repeats the area cards' head figures", () => {
  const glance = stay.match(/<section id="new-york-city-stay-glance"[\s\S]*?<\/section>/)?.[0] ?? "";
  assert.ok(glance, "glance present");
  assert.ok(stay.indexOf("</h1>") < stay.indexOf('id="new-york-city-stay-glance"'));
  assert.ok(stay.indexOf('id="new-york-city-stay-glance"') < stay.indexOf('class="container media-section"'));
  assert.ok(stay.indexOf('class="container media-section"') < stay.indexOf('class="container trust-panel"'), "photo before the review note");
  assert.equal((stay.match(/-stay-glance"/g) || []).length, 1);
  if (today < "2027-01-15") {
    const items = [...glance.matchAll(/<li><strong>([^<]+)<\/strong> ([^<]+) <small>/g)];
    assert.ok(items.length >= 1 && items.length <= 4);
    for (const [, figure, area] of items) {
      const head = section.match(new RegExp(`<span>${area.replace(/[/]/g, "\\/")}</span>\\s*<strong class="area-hotel-from">([^<]+)</strong>`))?.[1];
      assert.equal(figure.replace("From", "from"), head, area);
    }
    assert.match(glance, /Family of 4, Fri–Sun, Jan 22–24, 2027 \(estimate; taxes and fees may be extra\)/);
    assert.match(glance, /seen November 5, 2026; ≈ is the Fri–Sat average; room type not shown\./);
    assert.match(glance, /<p class="q18-basis">Long Island City: none in our guide yet\. Google Hotels/);
  }
  const expired = pages.newYorkCityStayAreaGlance("2027-01-15");
  assert.doesNotMatch(expired, /Jan 22|\$\d/);
  assert.match(expired, /No current family price is shown/);
});
