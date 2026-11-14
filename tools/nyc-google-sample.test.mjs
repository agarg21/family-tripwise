// G18 (OWNER D39): family of 5 now sits on the same normal weekend as the family of 4 (Jan 22-24, 2027), not the MLK weekend.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { readReceipt } from "./page-generation/google-hotel-samples.mjs";
import { nightPrice, weekendPrice, weekendLive } from "./page-generation/weekend-hotel-samples.mjs";
import { easternDate } from "./page-generation/sitemap.mjs";
import { createFamilyHotelPages } from "./page-generation/family-hotel-pages.mjs";

const searches = "abcdefghij".split("").flatMap((part) => readReceipt(`dataforseo-g18-nyc-${part}-2026-11-14.json`).searches);
const kids5 = [4, 8, 12], kids4 = [5, 8], tags = ["jan22", "jan23"];
const tryp = "TRYP by Wyndham New York City Times Square South";
const page = readFileSync(new URL("../site/where-to-stay/new-york-city-family-hotels.html", import.meta.url), "utf8");
const csv = readFileSync(new URL("../site/downloads/new-york-city-family-hotels.csv", import.meta.url), "utf8");

test("weekend figures are two 1-night searches: average and sum only when both nights are priced", () => {
  const beacon = weekendPrice(searches, { prefix: "nyc-beacon", title: "Hotel Beacon", tags, childAges: kids4 });
  assert.deepEqual([beacon.fri.nightly, beacon.sat.nightly, beacon.average, beacon.total, beacon.both], [591, 632, 612, 1223, true]);
  const kimberly = weekendPrice(searches, { prefix: "nyc-kimberly", title: "The Kimberly Hotel", tags, childAges: kids4 });
  assert.deepEqual([kimberly.fri.nightly, kimberly.sat.nightly, kimberly.both, kimberly.total], [null, 693, false, null]);
  const marquis = weekendPrice(searches, { prefix: "nyc-marquis", title: "New York Marriott Marquis", tags: ["dec25", "dec26"], childAges: kids4 });
  assert.deepEqual([marquis.fri.nightly, marquis.fri.also], [926, [804]]);
  const palace = nightPrice(searches, { prefix: "nyc-palace", title: "Lotte New York Palace", tag: "jan22", childAges: kids4 });
  assert.equal(palace.nightly, 589);
  assert.equal(palace.observed_on, "2026-11-14");
  // Family-of-4 and family-of-5 searches never lend figures to each other.
  assert.equal(weekendPrice(searches, { prefix: "nyc5-tryp", title: tryp, tags, childAges: kids5 }).sat.nightly, 413);
  assert.equal(weekendPrice(searches, { prefix: "nyc-tryp", title: tryp, tags, childAges: kids4 }).sat.nightly, 329);
  assert.equal(weekendPrice(searches, { prefix: "nyc-embassy", title: "Embassy Suites by Hilton New York Manhattan Times Square", tags, childAges: kids4 }).any, false);
  assert.throws(() => weekendPrice(searches, { prefix: "nyc-none", title: tryp, tags, childAges: kids4 }));
  assert.equal(weekendLive(beacon, "2027-01-14"), true);
  assert.equal(weekendLive(beacon, "2027-01-15"), false);
});

test("committed page and CSV carry the Jan 22-24 family of 5, never the MLK samples, and drop a week before arrival", () => {
  const today = process.env.FT_BUILD_DATE || easternDate();
  for (const text of [page, csv]) assert.doesNotMatch(text, /November 8-13|Jan 15|Jan 18|Jan 19|January 15|\$1,160|\$305|\$798/);
  if (today < "2027-01-15") {
    assert.match(page, /≈ \$1,234\/night<\/span> <span><a href="#nyc-hotel-1">Hotel Beacon<\/a> · Fri \$1,236, Sat \$1,232 · 2 nights ≈ \$2,468/);
    assert.match(csv, /Family-of-5 listing price \(Google Hotels; not a quote\)/);
    assert.match(csv, /family of 5 \(2 adults and kids 4, 8 and 12\), Fri–Sun, Jan 22–24, 2027: ≈ \$615 a night/);
  } else {
    // From January 15, 2027 this fails until `node tools/generate-pages.mjs` re-renders the page.
    for (const text of [page, csv]) assert.doesNotMatch(text, /\$1,234|\$2,468|Jan 22/);
  }
});

test("holiday tables say no price, never sold out, and leave 7 days before arrival", () => {
  const today = process.env.FT_BUILD_DATE || easternDate();
  if (today < "2026-12-18") {
    const section = page.match(/<section id="nyc-holiday-prices"[\s\S]*?<\/section>/)[0];
    assert.match(section, /Christmas weekend, Dec 25–27, 2026/);
    assert.match(section, /<td>Residence Inn<\/td><td>\$608<\/td><td><span class="hotel-no-price">No price<\/span><\/td><td>Nov 14<\/td>/);
    assert.match(section, /Prices and rooms change fast; check live\./);
    assert.match(section, /That does not mean sold out\./);
    assert.doesNotMatch(section.replaceAll("does not mean sold out", "").replaceAll("not sold out", ""), /sold out/i);
  } else {
    // From December 18, 2026 this fails until the page is regenerated; the New Year table follows on December 25.
    assert.doesNotMatch(page, /Fri Dec 25/);
    if (today >= "2026-12-25") assert.doesNotMatch(page, /Fri Jan 1/);
  }
});

test("holiday wording follows the tables that are still live; every receipt figure is on the page", () => {
  const pages = createFamilyHotelPages({ esc: (value) => String(value), pageShell: ({ body }) => body });
  const dec18 = pages.newYorkCityFamilyHotelPage("2026-12-18");
  assert.match(dec18, /<h2>New Year weekend<\/h2>/);
  assert.doesNotMatch(dec18, /Fri Dec 25|Christmas weekend|Christmas and New Year|Christmas prices/);
  const dec25 = pages.newYorkCityFamilyHotelPage("2026-12-25");
  assert.doesNotMatch(dec25, /nyc-holiday-prices|holiday prices|cost more at most|Fri Jan 1/);
  assert.match(dec25, /with weekend prices/);
  const jan15 = pages.newYorkCityFamilyHotelPage("2027-01-15");
  assert.doesNotMatch(jan15, /with weekend prices|holiday prices|Jan 22/);
  for (const [day, gone] of [["2026-12-18", /Christmas weekend price[^\n]*\$/], ["2027-01-15", /\$1,234/]]) assert.doesNotMatch(pages.newYorkCityHotelComparisonCsv(day).split("\n").slice(1).join("\n").replace(/^/, ""), day === "2027-01-15" ? gone : /\$5,077/);
  const today = process.env.FT_BUILD_DATE || easternDate();
  if (today < "2026-12-18") for (const hotel of pages.hotelCatalog["new-york-city"]) for (const tag of ["jan22", "jan23", "dec25", "dec26", "jan01", "jan02"]) {
    const night = nightPrice(searches, { prefix: hotel.google.prefix, title: hotel.google.title, tag, childAges: kids4 });
    for (const value of [night.nightly, ...night.also]) if (value !== null) assert.ok(page.includes(`$${value.toLocaleString("en-US")}`), `${hotel.shortName} ${tag} ${value}`);
  }
});
