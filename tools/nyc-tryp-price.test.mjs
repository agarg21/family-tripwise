import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { trypPrice, trypPriceHtml, validateTrypPrice } from "./page-generation/nyc-tryp-price.mjs";
import { hotelEvidence, validateHotelEvidence } from "./hotel-evidence.mjs";

test("TRYP exact-family amount includes separate fee and tax totals once", () => {
  assert.equal(trypPrice.room_total_cents, 261500);
  assert.equal(trypPrice.displayed_fee_total_cents, 15360);
  assert.equal(trypPrice.displayed_tax_total_cents, 38573);
  assert.equal(trypPrice.displayed_stay_total_cents, 315433);
  assert.equal(trypPrice.displayed_fee_inclusive_nightly_cents * 5, 276860);
  assert.deepEqual(trypPrice.child_ages, [4, 8, 12]);
  assert.equal(trypPrice.individual_child_ages_entered, true);
  assert.match(trypPrice.party_acceptance, /^Unconfirmed/);
});

test("TRYP rejects scenario, basis, arithmetic, fee duplication and source drift", () => {
  for (const changes of [{ room_total_cents: 261501 }, { displayed_fee_total_cents: 0 }, { displayed_stay_total_cents: 330793 }, { displayed_tax_total_cents: 38572 }, { displayed_fee_inclusive_nightly_cents: 52300 }, { category: "TRYP PREMIUM" }, { rate_plan: "Wyndham Rewards Rate" }, { currency: "CAD" }, { unit: "stay" }, { rooms: 2 }, { adults: 1 }, { children: 2 }, { child_ages: [4, 8, 13] }, { individual_child_ages_entered: false }, { arrival: "2026-11-09" }, { departure: "2026-11-14" }, { nights: 6 }, { checked_on: "2026-10-12" }, { published_capacity: 6 }, { sources: [trypPrice.sources[0] + "?sessionId=fixture"] }, { nightly_fee_lines: [{ label: "Resort Fee", cents: 2722 }] }, { nightly_room_cents: [NaN] }, { nightly_tax_lines: [{ date: "2026-11-08", sales_tax_cents: -1 }] }, { party_acceptance: "Confirmed" }]) assert.throws(() => validateTrypPrice({ ...structuredClone(trypPrice), ...changes }));
});

test("TRYP shared scoped overlays preserve all historical clocks and general fee unknowns", () => {
  const records = hotelEvidence();
  assert.deepEqual(validateHotelEvidence(records), []);
  const { fields } = records.find(r => r.hotel === trypPrice.hotel);
  assert.equal(fields.room.observed_on, "2026-07-25");
  assert.equal(fields.price.observed_on, "2026-07-25");
  assert.equal(fields.price.value.display, "$210-$700+");
  assert.equal(fields.price.value.structured_basis, false);
  assert.equal(fields.review_signal.observed_on, "2026-07-25");
  assert.equal(fields.activities.observed_on, "2026-07-25");
  assert.equal(fields.fees.state, "unknown");
  assert.deepEqual(fields.price.value.date_specific_samples, [trypPrice]);
  assert.equal(fields.room.value.overlays.at(-1).observed_on, "2026-10-11");
  assert.equal(records.filter(r => r.fields.price.value?.date_specific_samples?.some(s => s.id === trypPrice.id)).length, 1);
});

test("TRYP public block preserves exact budget basis, fee inclusion and policy limits", () => {
  const html = trypPriceHtml();
  for (const value of ["October 11, 2026", "November 8-13, 2026", "Standard Rate", "one room, five nights", "aged 4, 8 and 12 entered individually", "$3,154.33", "$2,615.00", "$153.60", "$385.73", "$523.00", "$630.87", "$489.00-$619.00", "$553.72", "$27.22", "$3.50", "Do not add them again", "not a current quote", "one bathroom", "not an established cooking setup", "24 hours", "timezone", "not stated", "July standard-room range"]) assert.ok(html.includes(value), value);
  assert.ok(html.includes(`href="${trypPrice.sources[0]}"`));
  assert.doesNotMatch(html, /sessionId=|Book &amp; Pay|Save 20%|savings guaranteed/);
});

test("TRYP generated section is exact and appears only in its own existing card", () => {
  const html = readFileSync(new URL("../site/where-to-stay/new-york-city-family-hotels.html", import.meta.url), "utf8");
  assert.equal((html.match(/id="tryp-family-budget"/g) ?? []).length, 1);
  const card = html.slice(html.indexOf(`<h3>${trypPrice.hotel}</h3>`), html.indexOf("<h3>The Kimberly Hotel</h3>"));
  assert.ok(card.includes(trypPriceHtml()));
  assert.ok(card.includes("July 25, 2026"));
});
