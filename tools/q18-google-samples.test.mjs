import test from "node:test";
import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
import { createFamilyHotelPages } from "./page-generation/family-hotel-pages.mjs";

// Q18 (OWNER D25, 2026-11-01): Google Hotels family-of-four samples leave the page 7 days before arrival.
const pages = createFamilyHotelPages({ esc: (value) => String(value), pageShell: ({ body }) => body });
const vegas = pages.hotelCatalog["las-vegas"], chicago = pages.hotelCatalog.chicago;

test("every Las Vegas and Chicago sample is a future 1-night stay for 2 adults + kids 5 and 8", () => {
  for (const hotel of [...vegas, ...chicago]) for (const sample of pages.q18Samples(hotel.google, "2026-11-01")) {
    assert.equal(sample.nights, 1);
    assert.deepEqual([sample.adults, sample.child_ages], [2, [5, 8]]);
    assert.ok(sample.check_in > "2026-11-08", `${hotel.name} ${sample.check_in}`);
    assert.equal(sample.observed_on, "2026-10-31");
  }
  assert.equal(chicago.filter((hotel) => pages.q18Samples(hotel.google, "2026-11-01").length).length, 10);
  assert.equal(vegas.filter((hotel) => pages.q18Samples(hotel.google, "2026-11-01").length).length, 10);
});

test("samples drop a week before arrival, and pages fall back to Check live rate", () => {
  const vdara = vegas.find((hotel) => hotel.name === "Vdara Hotel & Spa");
  assert.deepEqual(pages.q18Samples(vdara.google, "2027-01-11").map((sample) => sample.check_in), ["2027-01-19", "2027-02-02", "2027-02-23"]);
  assert.deepEqual(pages.q18Samples(vdara.google, "2027-01-12").map((sample) => sample.check_in), ["2027-02-02", "2027-02-23"]);
  assert.deepEqual(pages.q18Samples(vdara.google, "2027-02-16"), []);
  const later = pages.chicagoFamilyHotelPage("2027-01-12");
  assert.doesNotMatch(later, /Google Hotels, 2 adults \+ kids 5 and 8, 1 night/);
  assert.match(later, /No current family price is shown/);
  assert.equal((later.match(/<strong>No current family price<\/strong>/g) || []).length, 20);
  assert.doesNotMatch(later, /Google showed none/);
  assert.doesNotMatch(later.slice(0, later.indexOf('id="sources-checked"')), /January 19|Jan 19/);
  const vegasLater = pages.lasVegasFamilyHotelPage("2027-02-16");
  assert.match(vegasLater, /No current family price is shown/);
  assert.doesNotMatch(vegasLater, /\$\d[\d,]* a night<\/strong>/);
});

test("San Antonio (Q19): future 1-night family-of-4 samples, exact-title only, and a no-price fallback", () => {
  const hotels = pages.hotelCatalog["san-antonio"];
  for (const hotel of hotels) for (const sample of pages.q18Samples(hotel.google, "2026-11-02")) {
    assert.equal(sample.nights, 1);
    assert.deepEqual([sample.adults, sample.child_ages], [2, [5, 8]]);
    assert.ok(["2027-01-19", "2027-02-23"].includes(sample.check_in));
    assert.equal(sample.observed_on, "2026-11-02");
  }
  const unpriced = hotels.filter((hotel) => !pages.q18Samples(hotel.google, "2026-11-02").length).map((hotel) => hotel.shortName);
  assert.deepEqual(unpriced, ["JW Marriott", "Omni"]);
  const later = pages.sanAntonioFamilyHotelPage("2027-02-16");
  assert.match(later, /No current family price is shown/);
  assert.doesNotMatch(later, /\$\d[\d,]* a night<\/strong>/);
  assert.match(later, /seen November 2, 2026 were for dates/);
  assert.doesNotMatch(later, /Older 1-night|public one-night example|before parking/);
});

test("San Antonio: a no-price claim is checked against every receipt row, accents normalised", () => {
  const norm = (text) => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const rows = ["a", "b", "c"].flatMap((part) => JSON.parse(readFileSync(new URL(`../docs/research/dataforseo-q19-sa-hotel-prices-${part}-2026-11-02.json`, import.meta.url), "utf8")).searches)
    .flatMap((search) => search.results.map((row) => ({ ...row, check_in: search.check_in })));
  const html = pages.sanAntonioFamilyHotelPage("2026-11-02");
  for (const hotel of pages.hotelCatalog["san-antonio"]) {
    if (pages.q18Samples(hotel.google, "2026-11-02").length) continue;
    const priced = rows.filter((row) => norm(row.title) === norm(hotel.google.title) && row.price > 0);
    if (priced.length) assert.ok(hotel.google.conflict, `${hotel.name} has receipt prices but no stated reason`);
  }
  assert.match(html, /Google gave two different prices for this hotel on the same dates/);
  assert.equal((html.match(/Google showed none/g) || []).length, 2, "only JW Marriott: table and card");
  // The stripped price notes keep each hotel's check and leak no July figure.
  assert.doesNotMatch(html, /public one-night example|Public one-night examples|\$\d+ total before parking/);
  for (const hotel of pages.hotelCatalog["san-antonio"]) assert.ok(html.includes(hotel.parentCheck.split(",")[0].replaceAll("'", "&#39;")), hotel.name);
});

test("San Diego (Q19): every same-night price a hotel showed in any city search is on the page; none is hidden", () => {
  const rows = ["a", "b", "c"].flatMap((part) => JSON.parse(readFileSync(new URL(`../docs/research/dataforseo-q19-sd-nyc-hotel-prices-${part}-2026-11-02.json`, import.meta.url), "utf8")).searches)
    .filter((search) => search.label.startsWith("sd-")).flatMap((search) => search.results);
  for (const hotel of pages.hotelCatalog["san-diego"]) {
    const expected = [...new Set(rows.filter((row) => row.title === hotel.google.title && row.price > 0).map((row) => row.price))].sort((a, b) => a - b);
    assert.deepEqual(pages.q18Samples(hotel.google, "2026-11-02").map((sample) => sample.nightly), expected, hotel.name);
    for (const sample of pages.q18Samples(hotel.google, "2026-11-02")) {
      assert.deepEqual([sample.check_in, sample.nights, sample.adults, sample.observed_on], ["2027-01-19", 1, 2, "2026-11-02"]);
      assert.deepEqual(sample.child_ages, [5, 8]);
    }
  }
  assert.deepEqual(pages.hotelCatalog["san-diego"].filter((hotel) => !pages.q18Samples(hotel.google, "2026-11-02").length).map((hotel) => hotel.shortName), ["Loews", "La Jolla Shores"]);
  assert.deepEqual(pages.q18Samples(pages.hotelCatalog["san-diego"][0].google, "2027-01-12"), []);
  const later = pages.sanDiegoFamilyHotelPage("2027-01-15");
  assert.match(later, /No current family price is shown/);
  assert.doesNotMatch(later, /\$\d[\d,]*(–\$\d[\d,]*)? a night<\/strong>/);
  assert.doesNotMatch(later, /\$272/);
});

test("New York City (G18): the page leaves no weekend figure a week before arrival; San Diego keeps its own searches", () => {
  assert.deepEqual(pages.q18Samples(pages.hotelCatalog["san-diego"][0].google, "2026-11-02").map((sample) => sample.nightly), [303, 339, 342]);
  const later = pages.newYorkCityFamilyHotelPage("2027-01-16");
  assert.match(later, /No current family price is shown/);
  assert.doesNotMatch(later, /\$\d[\d,]*(–\$\d[\d,]*)? a night<\/strong>/);
  assert.doesNotMatch(later, /\$718|\$2,559|\$1,427|Jan 22/);
});
test("committed hotel pages and CSVs carry no Jan 19 price from a week before that stay", () => {
  // These pages are not re-rendered daily: from Jan 12, 2027 this fails until `node tools/generate-pages.mjs` is run and committed.
  const today = process.env.FT_BUILD_DATE || new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York" }).format(new Date());
  if (today < "2027-01-12") return;
  for (const city of ["san-diego", "las-vegas", "chicago", "san-antonio", "new-york-city"]) {
    assert.doesNotMatch(readFileSync(new URL(`../site/where-to-stay/${city}-family-hotels.html`, import.meta.url), "utf8"), /on Jan(?:uary)?(?:&nbsp;|\s)19, 2027/, city);
    if (city !== "san-antonio") assert.doesNotMatch(readFileSync(new URL(`../site/downloads/${city}-family-hotels.csv`, import.meta.url), "utf8"), /2027-01-19 to/, city);
  }
});
