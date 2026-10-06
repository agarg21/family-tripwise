import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { roomPriceForTask, validateRoomPrices } from "./family-room-price.mjs";
import { roomComparisonCsv, roomComparisonsCsv } from "./family-room-comparison.mjs";

const read = name => JSON.parse(readFileSync(new URL(`../docs/research/${name}.json`, import.meta.url)));
const fixtures = [
  ["london-room-configurations-2026-09-30", "london-mitre-price-observation-2026-09-30"],
  ["london-room-configurations-2026-09-30", "london-marlin-price-observation-2026-09-30"],
  ["washington-dc-room-configurations-2026-09-30", "washington-dc-residence-price-observation-2026-09-30"],
  ["orlando-cabana-room-configurations-2026-10-03", "orlando-cabana-price-observation-2026-10-03"],
  ["san-diego-homewood-room-task-2026-10-04", "san-diego-homewood-price-observation-2026-10-04"]
].map(([pack, prices]) => ({pack:read(pack), prices:read(prices)}));
const asOf = "2026-10-06";
const price = (pack, prices) => roomPriceForTask(prices, pack, prices[0].record_id, pack.scenario, asOf);

test("all supported price schemas reject fractions of a currency cent", () => {
  assert.deepEqual(fixtures.map(({prices}) => prices[0].schema_version), [1,2,3,4,5]);
  for (const {pack, prices} of fixtures) {
    assert.deepEqual(validateRoomPrices(prices, pack), []);
    for (const amount of [0.001, 0.004, 0.005, 1.001, 1.005, 1355.191]) {
      const bad = structuredClone(prices);
      bad[0].rates[0].stay_amount = amount;
      assert.ok(validateRoomPrices(bad, pack).some(error => /rate plan/.test(error)));
      assert.throws(() => price(pack, bad), /rate plan/);
    }
  }
});

test("malformed public samples cannot become zero or rounded CSV budget answers", () => {
  const {pack, prices} = fixtures[0];
  for (const amount of [0.001, 1300.001]) {
    const bad = structuredClone(prices);
    bad[0].rates[0].stay_amount = amount;
    const options = {budget:{currency:"GBP", nightly_limit:300}};
    assert.throws(() => roomComparisonCsv(pack, pack.scenario, asOf, bad, options), /rate plan/);
    assert.throws(() => roomComparisonsCsv([pack], pack.scenario, asOf, bad, options), /rate plan/);
  }
});

test("excluded member plans still require valid money before projection or filters", () => {
  const {pack, prices} = fixtures[1];
  const bad = structuredClone(prices);
  bad[0].rates.push({...bad[0].rates[0], plan:"Synthetic invalid member control", eligibility:"membership-required", stay_amount:1.005});
  assert.throws(() => price(pack, bad), /rate plan/);
  assert.throws(() => roomComparisonCsv(pack, pack.scenario, asOf, bad, {kitchen:"published",capacity:"not-excluded"}), /rate plan/);
});

test("valid cent amounts retain the existing rounded nightly derivation", () => {
  const {pack, prices} = fixtures[0];
  for (const amount of [0.01, 0.1, 0.29, 1.01, 1.11, 1355.19, 99999999.99]) {
    const samples = structuredClone(prices);
    samples[0].rates[0].stay_amount = amount;
    assert.deepEqual(validateRoomPrices(samples, pack), []);
    const result = price(pack, samples);
    assert.equal(result.rates[0].stay_amount, amount);
    assert.equal(result.rates[0].nightly_average, Math.round(amount * 100 / samples[0].nights) / 100);
  }
  // A valid one-cent stay may round below one cent per night; it is not malformed input.
  const samples = structuredClone(prices);
  samples[0].rates[0].stay_amount = 0.01;
  assert.equal(price(pack, samples).rates[0].nightly_average, 0);
});

test("nonpositive nonnumeric and unsafe amounts continue to fail closed", () => {
  const {pack, prices} = fixtures[0];
  for (const amount of [0, -1, NaN, Infinity, "1300", null, Number.MAX_SAFE_INTEGER]) {
    const bad = structuredClone(prices);
    bad[0].rates[0].stay_amount = amount;
    assert.ok(validateRoomPrices(bad, pack).length);
    assert.throws(() => price(pack, bad), /rate plan/);
  }
});

test("real samples retain amounts dates age limits and immutable single/joined output", () => {
  for (const {pack, prices} of fixtures) {
    const before = JSON.stringify([pack, prices]);
    const result = price(pack, prices);
    const publicPlans = prices[0].rates.filter(rate => prices[0].schema_version === 1 || rate.eligibility === "public");
    assert.deepEqual(result.rates.map(rate => rate.stay_amount), publicPlans.map(rate => rate.stay_amount));
    assert.equal(result.observed_on, prices[0].checked_on);
    assert.deepEqual(result.engine_party, prices[0].engine_party);
    assert.equal(result.fee_basis, prices[0].fee_basis);
    assert.equal(roomComparisonCsv(pack, pack.scenario, asOf, prices), roomComparisonsCsv([pack], pack.scenario, asOf, prices));
    assert.equal(JSON.stringify([pack, prices]), before);
  }
});
