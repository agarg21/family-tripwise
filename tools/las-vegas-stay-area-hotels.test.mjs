import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { createFamilyHotelPages } from "./page-generation/family-hotel-pages.mjs";
import { easternDate } from "./page-generation/sitemap.mjs";

// R1 step 1 (OWNER D44): the Las Vegas stay page lists each base type's hotels with the hotel page's own weekend figure.
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const stay = readFileSync(join(root, "site", "where-to-stay", "las-vegas-with-kids.html"), "utf8");
const hotels = readFileSync(join(root, "site", "where-to-stay", "las-vegas-family-hotels.html"), "utf8");
const sectionOf = (html) => html.match(/<section[^>]+id="las-vegas-area-hotels"[\s\S]*?<\/section>/)?.[0] ?? "";
const section = sectionOf(stay);
const esc = (value) => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
const pages = createFamilyHotelPages({ esc, pageShell: () => "" });
const today = process.env.FT_BUILD_DATE || easternDate();
const cardOf = (id) => hotels.match(new RegExp(`id="${id}"[\\s\\S]*?</summary>`))?.[0] ?? "";

test("Las Vegas area hotel cards sit after the quick picks and before the base matrix", () => {
  assert.ok(section, "area hotel section present");
  assert.ok(stay.indexOf("Five useful starting points") < stay.indexOf('id="las-vegas-area-hotels"'));
  assert.ok(stay.indexOf('id="las-vegas-area-hotels"') < stay.indexOf("Compare the base before the hotel"));
  assert.equal((section.match(/<article class="quick-pick area-hotel-card/g) || []).length, 5);
});

test("every Las Vegas hotel link resolves to a card on the hotel page and all 10 hotels appear once", () => {
  const ids = [...section.matchAll(/href="\.\/las-vegas-family-hotels\.html#(las-vegas-hotel-\d+)"/g)].map((m) => m[1]);
  assert.equal(ids.length, 10);
  assert.equal(new Set(ids).size, 10);
  for (const id of ids) assert.ok(hotels.includes(`id="${id}"`), id);
});

test("placed Las Vegas hotels match their record's area; Resorts World Hilton sits outside", () => {
  const catalog = pages.hotelCatalog["las-vegas"];
  const areaWords = {
    "Center Strip": ["Center Strip / CityCenter"],
    "South Strip": ["South Strip"],
    "Near-Strip suite base": ["South Las Vegas Boulevard", "Harmon Avenue"],
    "West side / Summerlin": ["Summerlin"]
  };
  for (const [, area, body] of section.matchAll(/<span>([^<]+)<\/span>\s*([\s\S]*?)<\/article>/g)) {
    for (const [, n] of body.matchAll(/#las-vegas-hotel-(\d+)"/g)) {
      assert.ok(areaWords[area]?.some((word) => catalog[n - 1].area.includes(word)), `${catalog[n - 1].name} in ${area}`);
    }
  }
  assert.match(section, /Outside these five areas: <a href="\.\/las-vegas-family-hotels\.html#las-vegas-hotel-9">Resorts World Hilton<\/a>[^<]*\(North Strip\)/);
  assert.match(section, /we count it as a suite base for its multi-bedroom villas\./);
  assert.match(section, /Downtown \/ Fremont<\/span>\s*<p>None in our 10-hotel guide yet/);
});

test("Las Vegas prices match the hotel page while live; the expired render shows none and keeps the links", () => {
  if (today < "2027-01-15") {
    const prices = [...section.matchAll(/#(las-vegas-hotel-\d+)">[^<]+<\/a><b>(≈\s\$[\d,]+|\$[\d,]+)/g)];
    assert.equal(prices.length, 6, "six placed hotels carry a price");
    for (const [, id, price] of prices) assert.ok(cardOf(id).includes(`<strong>${price.replace(/\s/, " ")} a night`), `${id} ${price}`);
    for (const n of [2, 5, 6]) {
      assert.match(section, new RegExp(`#las-vegas-hotel-${n}">[^<]+</a><b><small>no price shown</small></b>`));
      assert.ok(cardOf(`las-vegas-hotel-${n}`).includes("No price shown"), `hotel ${n}`);
    }
    assert.match(section, /Center Strip<\/span>\s*<strong class="area-hotel-from">\$[\d,]+<\/strong>\s*<p class="area-hotel-unit">a night, Friday only, family of 4 · 1 hotel in our guide/);
    assert.match(section, /which taxes and resort fees are included/);
    assert.equal((section.match(/resort fees may be extra · room size not checked/g) || []).length, 4);
    assert.match(section, /Family of 4 \(2 adults \+ kids 5 and 8\), Fri–Sun, Jan 22–24, 2027 · ≈ is the average of the Friday and Saturday nights · Google Hotels, seen November 5, 2026 · estimates, not quotes\./);
  } else {
    // From January 15, 2027 this fails until `node tools/generate-pages.mjs` re-renders the page.
    assert.doesNotMatch(section, /Jan 22|\$\d/);
  }
  const expired = sectionOf(pages.lasVegasStayAreaHotels("2027-01-15"));
  assert.doesNotMatch(expired, /Jan 22|\$\d/);
  assert.equal((expired.match(/#las-vegas-hotel-\d+"/g) || []).length, 10);
});

test("the Las Vegas stay page dates its re-read sources and no longer promises total-night ranges", () => {
  assert.match(stay, /Area and transport sources checked:<\/strong> July 22 and November 12, 2026/);
  assert.match(stay, /Fremont Street checked July 22, 2026\. Monorail route, High Roller, Red Rock Canyon and the city curfew guide re-read November 12, 2026/);
  assert.doesNotMatch(stay, /rough total-night ranges|rough nightly total/);
});

// R1 step 1 (LV persona P2, 11-12): the cost sits on the first phone screen, under the page top and above the photo.
test("the Las Vegas stay cost glance sits under the page top and repeats the area cards' head figures", () => {
  const glance = stay.match(/<section id="las-vegas-stay-glance"[\s\S]*?<\/section>/)?.[0] ?? "";
  assert.ok(glance, "glance present");
  assert.ok(stay.indexOf("</h1>") < stay.indexOf('id="las-vegas-stay-glance"'));
  assert.ok(stay.indexOf('id="las-vegas-stay-glance"') < stay.indexOf('class="container media-section"'));
  assert.equal((stay.match(/-stay-glance"/g) || []).length, 1);
  if (today < "2027-01-15") {
    const items = [...glance.matchAll(/<li><strong>([^<]+)<\/strong> ([^<]+) <small>/g)];
    assert.ok(items.length >= 1 && items.length <= 4);
    for (const [, figure, area] of items) {
      const head = section.match(new RegExp(`<span>${area.replace(/[/]/g, "\\/")}</span>\\s*<strong class="area-hotel-from">([^<]+)</strong>`))?.[1];
      assert.equal(figure.replace("From", "from"), head, area);
    }
    assert.match(glance, /Family of 4, Fri–Sun, Jan 22–24, 2027 \(estimate\)/);
    assert.match(glance, /seen November 5, 2026\. ≈ averages Friday and Saturday\. Room type, taxes and resort fees not shown\./);
  }
  const expired = pages.lasVegasStayAreaGlance("2027-01-15");
  assert.doesNotMatch(expired, /Jan 22|\$\d/);
  assert.match(expired, /No current family price is shown/);
});
