import test from "node:test";
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
  assert.equal((later.match(/<strong>No family price found<\/strong>/g) || []).length, 20);
  assert.doesNotMatch(later.slice(0, later.indexOf('id="sources-checked"')), /January 19|Jan 19/);
  const vegasLater = pages.lasVegasFamilyHotelPage("2027-02-16");
  assert.match(vegasLater, /No current family price is shown/);
  assert.doesNotMatch(vegasLater, /\$\d[\d,]* a night<\/strong>/);
});
