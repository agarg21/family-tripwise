import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { suites, sources, checkedOn, pageUpdatedOn, recheckOn } from "./page-generation/orlando-suite-data.mjs";
import { orlandoSuitePage, orlandoRateComparisonCsv } from "./page-generation/orlando-suite-page.mjs";
import { hotelEvidence, validateHotelEvidence } from "./hotel-evidence.mjs";
import { escapeHtml } from "./page-generation/orlando-suite-model.mjs";

const evidence = JSON.parse(readFileSync(new URL("../docs/research/orlando-cabana-rate-plans-2026-10-11.json", import.meta.url)));
const booking = suites[1].bookingRates;
test("Cabana dated payable nights reconcile to exact count-party room totals", () => {
  assert.equal(booking.room, evidence.room);
  assert.equal(booking.nights, evidence.nights);
  assert.equal(booking.checkedOn, evidence.inspected_on);
  assert.equal(booking.recheckOn, evidence.recheck_on);
  assert.equal(sources[booking.source], evidence.source_url);
  for (const [i, rate] of booking.plans.entries()) {
    const observed = evidence.plans[i];
    assert.deepEqual(rate.nightlyBeforeTax, observed.nightly_before_tax);
    assert.equal(rate.nightlyBeforeTax.reduce((a, b) => a + b, 0), rate.roomSubtotal);
    assert.equal(rate.roomSubtotal + rate.taxes, rate.estimatedTotal);
    assert.equal(rate.estimatedTotal, observed.displayed_total);
    assert.ok(Math.abs(rate.estimatedTotal / booking.nights - observed.derived_nightly) < 1e-8);
  }
});
test("Cabana public and maintained catalog preserve currency, fees, ages and terms", () => {
  const html = orlandoSuitePage();
  assert.match(html, /About USD203 per room\/night/);
  assert.match(html, /About USD289 per room\/night/);
  assert.match(html, /USD1013\.63 displayed for 5 nights/);
  assert.match(html, /USD1446\.75 displayed for 5 nights/);
  for (const text of [booking.party, booking.terms, booking.feeBasis, booking.currencyBasis, booking.limitation]) assert.ok(html.includes(escapeHtml(text)));
  assert.equal(suites[1].resortFee, null);
  assert.equal(suites[1].parkingUnit, null);
  const all = hotelEvidence(), p = all.find(r => r.id === "orlando-cabana-bay").fields.price;
  assert.deepEqual(validateHotelEvidence(all), []);
  assert.equal(p.observed_on, "2026-10-11");
  assert.equal(p.value.amount_from, 202.73);
  assert.equal(p.value.party_basis, booking.party);
  assert.equal(p.value.fee_basis, booking.feeBasis);
  assert.deepEqual(JSON.parse(p.value.source_basis).bookingBasis, booking);
});
test("new Cabana evidence does not contaminate IHG CSV or unrelated clocks", () => {
  const csv = orlandoRateComparisonCsv();
  assert.equal(csv.trimEnd().split("\n").length, 3);
  assert.doesNotMatch(csv, /Cabana|1013\.63|1446\.75/);
  assert.match(csv, /759\.40/);
  assert.match(csv, /815\.65/);
  assert.equal(checkedOn, "2026-09-24");
  assert.equal(pageUpdatedOn, "2026-09-27");
  assert.equal(recheckOn, "2026-10-24");
  assert.equal(suites[1].parkingCheckedOn, "2026-10-11");
  assert.equal(suites[2].waterPolicy.checkedOn, "2026-10-11");
});
