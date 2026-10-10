import assert from "node:assert/strict";
import test from "node:test";
import { dcPrices } from "./page-generation/washington-dc-family-hotels-page.mjs";
import { dcPlanPremiums, dcPremiumTask } from "./dc-plan-premium.mjs";

test("DC plan premiums subtract same-category exact stay cents before rounding", () => {
  const rows = dcPlanPremiums(dcPrices);
  assert.equal(rows.length, 5);
  for (const expected of dcPremiumTask.expected) {
    const row = rows.find(row => row.record_id === expected.record_id && row.plan === expected.plan);
    assert.equal(row.stay_increment, expected.stay_increment);
    assert.equal(row.nightly_increment, expected.nightly_increment);
  }
  assert.deepEqual(rows.filter(row => row.plan === "Non-refundable").map(row => row.stay_increment), [0, 0]);
  assert.equal(rows[1].nightly_increment, 73.47);
  assert.notEqual(rows[1].nightly_increment, Math.round((408.14 - 334.68) * 100) / 100);
});
test("DC premiums retain dates, terms, units and unknown booking rights", () => {
  for (const row of dcPlanPremiums(dcPrices)) {
    assert.equal(row.currency, "USD"); assert.equal(row.unit, "configuration/stay");
    assert.equal(row.nights, 5); assert.equal(row.arrival, "2026-11-08"); assert.equal(row.departure, "2026-11-13");
    assert.equal(row.observed_on, "2026-09-30"); assert.equal(row.review_due, "2026-10-14");
    assert.equal(row.current_refund_right, null); assert.equal(row.full_cost, null); assert.equal(row.individual_ages_confirmed, false);
    assert.equal(row.cancellation, dcPrices.find(r => r.record_id === row.record_id).rates.find(r => r.plan === row.plan).cancellation);
  }
  assert.ok(dcPlanPremiums(dcPrices, "2026-10-14").every(row => !row.historical));
  assert.ok(dcPlanPremiums(dcPrices, "2026-10-15").every(row => row.historical));
  assert.deepEqual(dcPlanPremiums(dcPrices, "2026-09-29"), []);
});
test("DC premium source drift and invalid dates fail closed without input mutation", () => {
  const original = structuredClone(dcPrices);
  dcPlanPremiums(dcPrices); assert.deepEqual(dcPrices, original);
  for (const mutate of [r => r[0].rates[0].stay_amount++, r => r[1].nights++, r => r[1].engine_party.children++, r => r[1].rates[1].eligibility = "member"]) {
    const changed = structuredClone(dcPrices); mutate(changed); assert.throws(() => dcPlanPremiums(changed), /review required/);
  }
  assert.throws(() => dcPlanPremiums(dcPrices, "2026-02-30"), /review required/);
});
