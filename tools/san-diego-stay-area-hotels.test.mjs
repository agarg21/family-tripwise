import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { createFamilyHotelPages } from "./page-generation/family-hotel-pages.mjs";
import { easternDate } from "./page-generation/sitemap.mjs";

// R1 step 1 (OWNER D44): the San Diego stay-area page lists each area's hotels with the hotel page's own weekend figure.
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const stay = readFileSync(join(root, "site", "where-to-stay", "san-diego-with-kids.html"), "utf8");
const hotels = readFileSync(join(root, "site", "where-to-stay", "san-diego-family-hotels.html"), "utf8");
const sectionOf = (html) => html.match(/<section[^>]+id="san-diego-area-hotels"[\s\S]*?<\/section>/)?.[0] ?? "";
const section = sectionOf(stay);
const esc = (value) => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
const pages = createFamilyHotelPages({ esc, pageShell: () => "" });
const today = process.env.FT_BUILD_DATE || easternDate();
const cardOf = (id) => hotels.match(new RegExp(`id="${id}"[\\s\\S]*?</article>`))?.[0] ?? "";

test("San Diego area hotel cards sit after the quick picks and before the area matrix", () => {
  assert.ok(section, "area hotel section present");
  assert.ok(stay.indexOf("Five areas, matched to different family trips") < stay.indexOf('id="san-diego-area-hotels"'));
  assert.ok(stay.indexOf('id="san-diego-area-hotels"') < stay.indexOf("Compare the five bases side by side"));
  assert.equal((section.match(/<article class="quick-pick area-hotel-card/g) || []).length, 5);
});

test("every San Diego hotel link resolves to a card on the hotel page and all 12 hotels appear once", () => {
  const ids = [...section.matchAll(/href="\.\/san-diego-family-hotels\.html#(san-diego-hotel-\d+)"/g)].map((m) => m[1]);
  assert.equal(ids.length, 12);
  assert.equal(new Set(ids).size, 12);
  for (const id of ids) assert.ok(hotels.includes(`id="${id}"`), id);
});

test("placed San Diego hotels match their record's area; Pacific Beach and Carlsbad stay outside", () => {
  const catalog = pages.hotelCatalog["san-diego"];
  const areaWord = { "Mission Bay": "Mission Bay", "La Jolla": "La Jolla", "Downtown / Little Italy": "Downtown", Coronado: "Coronado" };
  for (const [, area, body] of section.matchAll(/<span>([^<]+)<\/span>\s*([\s\S]*?)<\/article>/g)) {
    for (const [, n] of body.matchAll(/#san-diego-hotel-(\d+)"/g)) assert.ok(catalog[n - 1].area.includes(areaWord[area]), `${catalog[n - 1].name} in ${area}`);
  }
  assert.match(section, /Outside these five areas: <a [^>]+>Catamaran<\/a>[^<]*\(Pacific Beach\) · <a [^>]+>LEGOLAND Castle Hotel<\/a>[^<]*Castle Hotel room only \(Carlsbad \/ LEGOLAND\)/);
});

test("San Diego prices match the hotel page while live; the expired render shows none and keeps the links", () => {
  if (today < "2027-01-15") {
    const prices = [...section.matchAll(/#(san-diego-hotel-\d+)">[^<]+<\/a><b>(≈\s\$\d+|\$\d+)/g)];
    assert.ok(prices.length >= 8, "most placed hotels carry a price");
    for (const [, id, price] of prices) assert.ok(cardOf(id).includes(`<strong>${price.replace(/\s/, " ")} a night</strong>`), `${id} ${price}`);
    // An area with no priced hotel says "No price shown" once, in the head, with a next step (P3 11-12).
    assert.match(section, /La Jolla<\/span>\s*<strong class="area-hotel-from area-hotel-none">No price shown<\/strong>\s*<p class="area-hotel-unit">Google listed no price for our sample weekend \(not sold out\) · check live rates for your dates<\/p>/);
    assert.match(section, /La Jolla Shores<\/a><\/li>/);
    assert.ok(cardOf("san-diego-hotel-9").includes("No price shown"));
    assert.match(section, /Family of 4 \(2 adults \+ kids 5 and 8\), Fri–Sun, Jan 22–24, 2027 · ≈ is the average of the Friday and Saturday nights · Google Hotels, seen November 5, 2026 · estimates, not quotes\./);
  } else {
    // From January 15, 2027 this fails until `node tools/generate-pages.mjs` re-renders the page.
    assert.doesNotMatch(section, /Jan 22|\$\d/);
  }
  const expired = sectionOf(pages.sanDiegoStayAreaHotels("2027-01-15"));
  assert.doesNotMatch(expired, /Jan 22|\$\d/);
  assert.equal((expired.match(/#san-diego-hotel-\d+"/g) || []).length, 12);
});

test("the San Diego area without a guide hotel says so", () => {
  assert.equal((section.match(/None in our 12-hotel guide yet/g) || []).length, 1);
  assert.match(section, /Mission Valley \/ Hotel Circle<\/span>\s*<p>None in our 12-hotel guide yet/);
});

// R1 step 1 (11-12): the LV cost glance on this stay page, under the page top and above the photo; named unpriced areas.
test("the san-diego stay cost glance sits under the page top and repeats the area cards' head figures", () => {
  const glance = stay.match(/<section id="san-diego-stay-glance"[\s\S]*?<\/section>/)?.[0] ?? "";
  assert.ok(glance, "glance present");
  assert.ok(stay.indexOf("</h1>") < stay.indexOf('id="san-diego-stay-glance"'));
  assert.ok(stay.indexOf('id="san-diego-stay-glance"') < stay.indexOf('class="container media-section"'));
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
    assert.match(glance, /<p class="q18-basis">La Jolla: no price for this weekend\. Mission Valley \/ Hotel Circle: none in our guide yet\. Google Hotels/);
  }
  const expired = pages.sanDiegoStayAreaGlance("2027-01-15");
  assert.doesNotMatch(expired, /Jan 22|\$\d/);
  assert.match(expired, /No current family price is shown/);
});
