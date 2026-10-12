import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { radioCityPrice, radioCityPriceHtml, validateRadioCityPrice } from "./page-generation/nyc-radio-city-price.mjs";
import { hotelEvidence, validateHotelEvidence } from "./hotel-evidence.mjs";

test("dated exact category totals reconcile without folding in the deposit", () => {
  const r = radioCityPrice;
  assert.equal(r.room_total_cents, 367200);
  assert.equal(r.displayed_tax_total_cents, 57914);
  assert.equal(r.displayed_stay_total_cents, 425114);
  assert.equal(r.deposit_cents, 25000);
  assert.deepEqual(r.nightly_room_cents, [62000, 62100, 76300, 85200, 81600]);
  assert.equal(r.individual_child_ages_entered, false);
  assert.deepEqual(r.task_ages, [4, 8, 12]);
});

test("invalid totals, exact-age claims, source-query and changed scenario fail closed", () => {
  for (const changes of [{ room_total_cents: 367201 }, { displayed_tax_total_cents: 57915 }, { displayed_stay_total_cents: 450114 }, { currency: "CAD" }, { category: "Studio" }, { adults: 1 }, { children: 2 }, { rooms: 2 }, { nights: 6 }, { arrival: "2026-11-09" }, { departure: "2026-11-14" }, { checked_on: "2026-10-12" }, { individual_child_ages_entered: true }, { bed_state: "known" }, { deposit_cents: 0 }, { nightly_room_cents: [NaN] }, { sources: ["https://radiocityapartments.book.pegsbe.com?session=secret"] }]) assert.throws(() => validateRadioCityPrice({ ...structuredClone(radioCityPrice), ...changes }));
});

test("shared price/room overlays preserve historical envelope clocks, ranges and reviews", () => {
  const records = hotelEvidence();
  assert.deepEqual(validateHotelEvidence(records), []);
  const { fields } = records.find(r => r.hotel === "Radio City Apartments");
  assert.equal(fields.room.state, "disputed");
  assert.equal(fields.room.observed_on, "2026-07-25");
  assert.equal(fields.price.observed_on, "2026-07-25");
  assert.equal(fields.price.value.display, "$190-$600+");
  assert.equal(fields.price.value.structured_basis, false);
  assert.equal(fields.review_signal.observed_on, "2026-07-25");
  assert.deepEqual(fields.price.value.date_specific_samples, [radioCityPrice]);
  assert.equal(fields.room.value.overlays.at(-1).observed_on, "2026-10-11");
  assert.equal(fields.fees.state, "unknown");
  assert.equal(records.filter(r => r.fields.price.value?.date_specific_samples?.some(s => s.id === radioCityPrice.id)).length, 1);
});

test("visible sample contains full context, averages, conflict and independent source links", () => {
  const html = radioCityPriceHtml();
  assert.ok(html.includes('style="scroll-margin-top: 80px"'));
  for (const value of ["October 11, 2026", "November 8-13, 2026", "Best Available Rate", "two adults and three children", "under-13", "$4,251.14", "$3,672.00", "$579.14", "$734.40", "$850.23", "$620.00", "$852.00", "$250.00", "Individual ages were not entered", "refundability", "charge-versus-hold", "two twins", "two doubles", "not six adults", "not a current quote", "November 6, 2026 at 4:00 PM local hotel time"]) assert.ok(html.includes(value), value);
  for (const url of radioCityPrice.sources) assert.ok(html.includes(`href="${url}"`));
  assert.doesNotMatch(html, /cash rewards|session=|Add to Cart|guaranteed/i);
});

test("generated public sample matches the maintained record only in the NYC RadioCity card", () => {
  const publicHtml = readFileSync(new URL("../site/where-to-stay/new-york-city-family-hotels.html", import.meta.url), "utf8");
  assert.ok(publicHtml.includes(radioCityPriceHtml()));
  assert.equal((publicHtml.match(/id="radio-city-dated-price"/g) ?? []).length, 1);
  const card = publicHtml.slice(publicHtml.indexOf("<h3>Radio City Apartments</h3>"), publicHtml.indexOf("<h3>Embassy Suites", publicHtml.indexOf("<h3>Radio City Apartments</h3>")));
  assert.ok(card.includes(radioCityPriceHtml()));
  assert.ok(card.includes("July 25, 2026"));
});
