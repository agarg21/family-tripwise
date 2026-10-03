import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { screenRoomPack, validateRoomPack } from "./family-room-task.mjs";
import { roomPriceForTask, validateRoomPrices } from "./family-room-price.mjs";
import { roomComparisonCsv, roomComparisonsCsv } from "./family-room-comparison.mjs";

const json = name => JSON.parse(readFileSync(new URL(`../docs/research/${name}`, import.meta.url)));
const pack = json("orlando-cabana-room-configurations-2026-10-03.json");
const prices = json("orlando-cabana-price-observation-2026-10-03.json");
const original = json("orlando-cabana-family-price-2026-10-02.json");
const four = json("orlando-room-configurations-2026-10-03.json");
const id = pack.records[0].id;
const date = "2026-10-03";
const sample = (observations = prices, party = pack.scenario, asOf = date) => roomPriceForTask(observations, pack, id, party, asOf);

test("Count-only prices preserve original category, dates, totals and inferred currency", () => {
  assert.deepEqual(validateRoomPack(pack), []);
  assert.deepEqual(validateRoomPrices(prices, pack), []);
  const p = sample();
  assert.equal(p.status, "dated-count-only-stay-samples");
  assert.equal(p.observed_on, original.observed_on);
  assert.equal(pack.sources.cabana.checked_on, original.observed_on);
  assert.equal(p.booking_category, original.room_category);
  assert.equal(p.amount_from, 203.85);
  assert.equal(p.amount_to, 291.15);
  assert.equal(p.engine_party.adult_from_age, null);
  assert.equal(p.engine_party.child_ages, null);
  assert.equal(p.engine_party.children, 4);
  assert.equal(p.requested_individual_ages_confirmed, false);
  assert.equal(p.currency_evidence_class, "EDITORIAL_INTERPRETATION");
  assert.equal(p.currency_basis, original.currency.basis);
  assert.equal(p.rates.length, original.plans.length);
  for (const [i, rate] of p.rates.entries()) {
    const source = original.plans[i];
    assert.equal(rate.plan, source.name);
    assert.equal(rate.stay_amount, source.displayed_stay_total);
    assert.equal(rate.room_subtotal, source.room_subtotal);
    assert.equal(rate.displayed_taxes, source.displayed_taxes);
    assert.deepEqual(rate.nightly_before_displayed_tax, source.nightly_before_displayed_tax);
    assert.equal(rate.nightly_average, source.derived_average_with_displayed_tax);
  }
});

test("Unknown adult cutoff count schema rejects invented ages, partial bounds and false confirmation", () => {
  for (const mutate of [
    o => o.engine_party.adult_from_age = 18,
    o => o.engine_party.child_age_from = null,
    o => o.engine_party.child_age_to = null,
    o => o.engine_party.child_age_to = 12,
    o => o.engine_party.child_age_from = 5,
    o => o.engine_party.child_age_from = -1,
    o => o.engine_party.child_age_to = 18,
    o => o.engine_party.children = 3,
    o => o.engine_party.children = "4",
    o => o.engine_party.adults = 3,
    o => o.engine_party.child_ages = [4, 8, 12, 15],
    o => o.engine_party.individual_ages_entered = true,
    o => o.engine_party.age_input_mode = "individual-ages",
    o => delete o.engine_party.classification_basis,
    o => o.requested_individual_ages_confirmed = true,
    o => delete o.requested_individual_ages_confirmed,
    o => delete o.currency_basis,
    o => o.currency_evidence_class = "BOOKING_CHECK",
    o => o.schema_version = 2,
    o => o.schema_version = 3,
    o => delete o.rates[0].eligibility,
    o => o.configuration_count = 2,
    o => o.category = "Generic Family Suite"
  ]) {
    const changed = structuredClone(prices);
    mutate(changed[0]);
    assert.ok(validateRoomPrices(changed, pack).length);
    assert.throws(() => sample(changed));
  }
});

test("Different family, stay or category cannot inherit a count-only sample", () => {
  for (const party of [
    { ...pack.scenario, child_ages: [4, 8, 12, 16] },
    { ...pack.scenario, child_ages: [4, 8, 12] },
    { ...pack.scenario, adults: 3 },
    { ...pack.scenario, stay: { arrival: "2026-11-09", departure: "2026-11-14" } }
  ]) assert.equal(sample(prices, party), null);
  assert.equal(roomPriceForTask(prices, pack, "different-category", pack.scenario, date), null);
  assert.equal(sample(prices, { ...pack.scenario, child_ages: [15, 12, 8, 4] }).amount_from, 203.85);
  for (const ages of [[4,,12,15], [4,8,12,undefined], new Array(4)]) {
    const changed = structuredClone(prices);
    changed[0].party.child_ages = ages;
    assert.ok(validateRoomPrices(changed, pack).length);
    assert.throws(() => sample(changed));
  }
});

test("Stale count sample retains dated value, missing costs and original basis", () => {
  const p = sample(prices, pack.scenario, "2026-10-17");
  assert.equal(p.status, "historical-dated-count-only-stay-samples");
  assert.equal(p.observed_on, "2026-10-02");
  assert.equal(p.amount_to, 291.15);
  assert.match(p.fee_basis, /frequency\/inclusion unknown/);
  assert.match(p.fee_basis, /Resort fee, meals and other mandatory extras unknown/);
  assert.match(p.deposit_basis, /not observed/);
  assert.equal(p.fee_total, undefined);
  assert.equal(sample(prices, pack.scenario, "2026-10-01"), null);
});

test("Public-plan exclusion and nested defensive copies preserve original observations", () => {
  const before = JSON.stringify(prices);
  const changed = structuredClone(prices);
  changed[0].rates.push({ ...changed[0].rates[0], plan: "Member-only control", eligibility: "membership-required", stay_amount: 1 });
  const p = sample(changed);
  assert.equal(p.amount_from, 203.85);
  assert.deepEqual(p.excluded_rate_plans, ["Member-only control"]);
  p.engine_party.children = 0;
  p.party.child_ages[0] = 0;
  p.rates[0].nightly_before_displayed_tax[0] = 0;
  assert.equal(changed[0].engine_party.children, 4);
  assert.equal(changed[0].party.child_ages[0], 4);
  assert.equal(changed[0].rates[0].nightly_before_displayed_tax[0], 196);
  assert.equal(JSON.stringify(prices), before);
});

test("Joined Orlando export keeps exclusion controls and both dated price plans", () => {
  const csv = roomComparisonsCsv([four, pack], pack.scenario, date, prices);
  assert.equal(csv.trim().split("\n").length, 6);
  assert.equal((csv.match(/OUTSIDE_PUBLISHED_LIMIT/g) ?? []).length, 3);
  assert.equal((csv.match(/CONDITIONAL_PUBLISHED_CAPACITY/g) ?? []).length, 2);
  assert.equal((csv.match(/dated-count-only-stay-samples/g) ?? []).length, 2);
  for (const value of ["203.85", "291.15", "1019.25", "1455.75", "2026-10-02", "2026-11-08", "2026-11-13", "configuration/night", "editorial interpretation", "not confirmed eligibility"]) assert.ok(csv.includes(value));
  assert.match(csv, /adult_from_age/);
  assert.match(csv, /child_ages/);
  assert.match(csv, /provider-age-band-counts/);
  assert.equal(roomComparisonCsv(pack, pack.scenario, date, prices, { kitchen: "published" }).trim().split("\n").length, 1);
  const screened = screenRoomPack(pack, pack.scenario, date, prices)[0];
  assert.equal(screened.price.amount_from, 203.85);
  assert.equal(screened.checked_on, "2026-10-02");
  assert.equal(screened.kitchen, "not-established");
});
