import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { beaconSuite, beaconSuiteHtml, validateBeaconSuite } from "./page-generation/nyc-beacon-suite.mjs";
import { radioCityPriceHtml } from "./page-generation/nyc-radio-city-price.mjs";
import { hotelEvidence, validateHotelEvidence } from "./hotel-evidence.mjs";

test("Beacon five-night amount reconciles independently of nightly card and optional bed", () => {
  const r = beaconSuite;
  assert.deepEqual(r.nightly_room_cents, [219400, 219800, 220600, 221200, 223100]);
  assert.equal(r.room_total_cents, 1104100);
  assert.equal(r.displayed_tax_total_cents, 167715);
  assert.equal(r.displayed_stay_total_cents, 1271815);
  assert.notEqual(r.displayed_card_nightly_cents * 5, r.room_total_cents);
  assert.equal(r.optional_rollaway_cents_per_night * 5, 15000);
  assert.equal(r.room_total_cents / 5, 220820);
  assert.equal(r.individual_child_ages_entered, true);
  assert.equal(r.party_acceptance, "unresolved");
});

test("scenario, source, totals and unsupported promotion fail closed", () => {
  for (const changes of [{ room_total_cents: 1104500 }, { displayed_tax_total_cents: 167716 }, { displayed_stay_total_cents: 1286815 }, { currency: "GBP" }, { category: "King Suite" }, { adults: 1 }, { children: 2 }, { child_ages: [4, 8, 13] }, { rooms: 2 }, { nights: 6 }, { checked_on: "2026-10-12" }, { individual_child_ages_entered: false }, { party_acceptance: "confirmed" }, { bed_state: "known" }, { displayed_card_nightly_cents: 220820 }, { optional_rollaway_cents_per_night: 0 }, { sources: ["https://be.synxis.com/?Hotel=33053&Chain=1037&session=secret"] }]) assert.throws(() => validateBeaconSuite({ ...structuredClone(beaconSuite), ...changes }));
  for (const changes of [{ workdays: "daily" }, { start_local: "08:00" }, { end_local: "18:00" }, { end_date: "2026-11-01" }, { affected_floors: [4] }, { november_dates_confirmed: true }, { actual_noise_observed: true }]) assert.throws(() => validateBeaconSuite({ ...structuredClone(beaconSuite), renovation_notice: { ...beaconSuite.renovation_notice, ...changes } }));
});

test("shared scoped overlays retain July dates, broad prices/reviews and unknowns", () => {
  const records = hotelEvidence();
  assert.deepEqual(validateHotelEvidence(records), []);
  const f = records.find(r => r.hotel === "Hotel Beacon").fields;
  for (const key of ["room", "price", "activities", "review_signal"]) assert.equal(f[key].observed_on, "2026-07-25");
  assert.equal(f.price.value.display, "Check live rate");
  assert.equal(f.price.value.older_two_adult_sample, "$331");
  assert.match(f.price.value.source_basis, /Former page band \$330-\$750\+ retired 2026-10-27/);
  assert.equal(f.price.value.structured_basis, false);
  assert.deepEqual(f.price.value.date_specific_samples, [beaconSuite]);
  assert.equal(f.room.state, "disputed");
  assert.equal(f.room.value.overlays.at(-1).record.party_acceptance, "unresolved");
  assert.equal(f.activities.value.overlays.at(-1).record.actual_noise_observed, false);
  assert.equal(f.fees.value.resort_fee_usd, 0);
  assert.equal(f.fees.value.parking_usd, null);
  assert.equal(records.length, 65);
});

test("public markup exposes scope, amount, rest notice and acceptance conflicts", () => {
  const html = beaconSuiteHtml();
  for (const text of ["October 11, 2026", "weekday", "9 a.m. to 5 p.m.", "end date", "actual noise", "November 8-13, 2026", "Regular Rates", "ages 4, 8 and 12 entered individually", "$12,718.15", "$11,041.00", "$1,677.15", "$2,208.20", "$2,543.63", "$2,209.00", "$2,194.00", "$2,231.00", "$30.00", "$150.00", "four double beds", "three children remains unresolved", "Sleeps 4", "not a current quote", "late-charge amount", "scroll-margin-top: 80px"]) assert.ok(html.includes(text), text);
  assert.doesNotMatch(html, /confirmed occupancy|guaranteed quiet|refundable deposit|session=|Select Two|per month|Member ID/i);
  assert.ok(html.includes('href="https://be.synxis.com/?Hotel=33053&amp;Chain=1037"'));
});

test("one named Beacon public card adds sample while RadioCity stays identical", () => {
  const html = readFileSync(new URL("../site/where-to-stay/new-york-city-family-hotels.html", import.meta.url), "utf8");
  assert.ok(html.includes(beaconSuiteHtml()));
  assert.equal((html.match(/id="beacon-suite-budget-rest"/g) ?? []).length, 1);
  const card = html.slice(html.indexOf("<h3>Hotel Beacon</h3>"), html.indexOf("<h3>Homewood Suites"));
  assert.ok(card.includes(beaconSuiteHtml()));
  assert.ok(card.includes("July 25, 2026"));
  assert.ok(html.includes(radioCityPriceHtml()));
});
