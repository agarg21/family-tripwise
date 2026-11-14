import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { createFamilyHotelPages } from "./page-generation/family-hotel-pages.mjs";
import { easternDate } from "./page-generation/sitemap.mjs";

// R1 step 1 (OWNER D44): the Chicago stay-area page lists each area's hotels with the hotel page's own weekend figure.
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const stay = readFileSync(join(root, "site", "where-to-stay", "chicago-with-kids.html"), "utf8");
const hotels = readFileSync(join(root, "site", "where-to-stay", "chicago-family-hotels.html"), "utf8");
const sectionOf = (html) => html.match(/<section[^>]+id="chicago-area-hotels"[\s\S]*?<\/section>/)?.[0] ?? "";
const section = sectionOf(stay);
const esc = (value) => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
const pages = createFamilyHotelPages({ esc, pageShell: () => "" });
const today = process.env.FT_BUILD_DATE || easternDate();
const cardOf = (id) => hotels.match(new RegExp(`id="${id}"[\\s\\S]*?</summary>`))?.[0] ?? "";

test("Chicago area hotel cards sit after the quick picks and before the area matrix", () => {
  assert.ok(section, "area hotel section present");
  assert.ok(stay.indexOf("Five useful starting points") < stay.indexOf('id="chicago-area-hotels"'));
  assert.ok(stay.indexOf('id="chicago-area-hotels"') < stay.indexOf("Compare the area before the hotel"));
  assert.equal((section.match(/<article class="quick-pick area-hotel-card/g) || []).length, 5);
});

test("every Chicago hotel link resolves to a card on the hotel page and all 10 hotels appear once", () => {
  const ids = [...section.matchAll(/href="\.\/chicago-family-hotels\.html#(chicago-hotel-\d+)"/g)].map((m) => m[1]);
  assert.equal(ids.length, 10);
  assert.equal(new Set(ids).size, 10);
  for (const id of ids) assert.ok(hotels.includes(`id="${id}"`), id);
});

test("placed Chicago hotels match their record's area; Zachary and Four Seasons sit outside", () => {
  const catalog = pages.hotelCatalog.chicago;
  const areaWords = {
    "River North / Streeterville": ["River North", "Streeterville", "Magnificent Mile"],
    "Loop / Millennium Park": ["New Eastside", "Loop"],
    "South Loop / Museum Campus": ["South Loop"]
  };
  for (const [, area, body] of section.matchAll(/<span>([^<]+)<\/span>\s*([\s\S]*?)<\/article>/g)) {
    for (const [, n] of body.matchAll(/#chicago-hotel-(\d+)"/g)) {
      assert.ok(areaWords[area]?.some((word) => catalog[n - 1].area.includes(word)), `${catalog[n - 1].name} in ${area}`);
    }
  }
  assert.match(section, /Outside these five areas: <a href="\.\/chicago-family-hotels\.html#chicago-hotel-8">Hotel Zachary<\/a>[^·]*\(Lakeview \/ Wrigleyville\) · <a href="\.\/chicago-family-hotels\.html#chicago-hotel-9">Four Seasons<\/a>[^<]*\(Gold Coast\)/);
});

test("Chicago prices match the hotel page while live; the expired render shows none and keeps the links", () => {
  if (today < "2027-01-15") {
    const prices = [...section.matchAll(/#(chicago-hotel-\d+)">[^<]+<\/a><b>(≈\s\$[\d,]+|\$[\d,]+)/g)];
    assert.equal(prices.length, 8, "all eight placed hotels carry a price (Langham priced again Nov 14)");
    for (const [, id, price] of prices) assert.ok(cardOf(id).includes(`<strong>${price.replace(/\s/, " ")} a night`), `${id} ${price}`);
    assert.match(section, /#chicago-hotel-10">Langham<\/a><b>≈\s\$571<\/b>/);
    assert.match(section, /Four Seasons<\/a> ≈\s\$1,522 \(Gold Coast\)/);
    assert.ok(cardOf("chicago-hotel-9").includes("<strong>≈ $1,522 a night"));
    assert.match(section, /Family of 4 \(2 adults \+ kids 5 and 8\), Fri–Sun, Jan 22–24, 2027 · ≈ is the average of the Friday and Saturday nights · Google Hotels, seen November 14, 2026 · estimates, not quotes\./);
  } else {
    // From January 15, 2027 this fails until `node tools/generate-pages.mjs` re-renders the page.
    assert.doesNotMatch(section, /Jan 22|\$\d/);
  }
  const expired = sectionOf(pages.chicagoStayAreaHotels("2027-01-15"));
  assert.doesNotMatch(expired, /Jan 22|\$\d/);
  assert.equal((expired.match(/#chicago-hotel-\d+"/g) || []).length, 10);
});

test("Lincoln Park and West Loop have no guide hotel and say so", () => {
  assert.equal((section.match(/None in our 10-hotel guide yet/g) || []).length, 2);
  assert.match(section, /Lincoln Park<\/span>\s*<p>None in our 10-hotel guide yet/);
  assert.match(section, /West Loop<\/span>\s*<p>None in our 10-hotel guide yet/);
});

test("one-hotel Chicago areas show that hotel's figure without 'from'", () => {
  if (today >= "2027-01-15") return;
  assert.match(section, /Loop \/ Millennium Park<\/span>\s*<strong class="area-hotel-from">≈\s\$[\d,]+<\/strong>\s*<p class="area-hotel-unit">a night, family of 4 · 1 hotel in our guide · room size not checked/);
  assert.match(section, /River North \/ Streeterville<\/span>\s*<strong class="area-hotel-from">from ≈\s\$/);
});

// R1 step 1 (11-12): the shared stay cost glance under the page top, above the photo; figures repeat the area cards' heads.
test("the Chicago stay cost glance sits under the page top and repeats the area cards' head figures", () => {
  const glance = stay.match(/<section id="chicago-stay-glance"[\s\S]*?<\/section>/)?.[0] ?? "";
  assert.ok(glance, "glance present");
  assert.ok(stay.indexOf("</h1>") < stay.indexOf('id="chicago-stay-glance"'));
  assert.ok(stay.indexOf('id="chicago-stay-glance"') < stay.indexOf('class="container media-section"'));
  assert.ok(stay.indexOf('class="container media-section"') < stay.indexOf('class="container trust-panel"'), "photo before the review note");
  assert.equal((stay.match(/-stay-glance"/g) || []).length, 1);
  if (today < "2027-01-15") {
    const items = [...glance.matchAll(/<li><strong>([^<]+)<\/strong> ([^<]+) <small>/g)];
    assert.equal(items.length, 3);
    for (const [, figure, area] of items) {
      const head = section.match(new RegExp(`<span>${area.replace(/[/]/g, "\\/")}</span>\\s*<strong class="area-hotel-from">([^<]+)</strong>`))?.[1];
      assert.equal(figure.replace("From", "from"), head, area);
    }
    assert.match(glance, /Family of 4 \(2 adults \+ kids 5 and 8\), Fri–Sun, Jan 22–24, 2027 \(estimate for all 4 guests; taxes, parking and some destination charges may be extra\)/);
    assert.match(glance, /<p class="q18-basis">Google Hotels, seen November 14, 2026; ≈ is the Fri–Sat average\. Google does not show room size or how many rooms: confirm it sleeps 4\. <a/);
    assert.doesNotMatch(glance, /room type not shown|price for 4 guests/);
    assert.match(glance, />All\u00a010\u00a0hotels</);
    assert.match(glance, /<p class="q18-basis">Lincoln Park, West Loop: none in our guide yet\.<\/p>/);
  }
  const expired = pages.chicagoStayAreaGlance("2027-01-15");
  assert.doesNotMatch(expired, /Jan 22|\$\d/);
  assert.match(expired, /No current family price is shown/);
});
