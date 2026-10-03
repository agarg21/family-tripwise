import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { screenRoomPack, validateRoomPack } from "./family-room-task.mjs";
import { roomPriceForTask, validateRoomPrices } from "./family-room-price.mjs";
import { roomComparisonCsv, roomComparisonsCsv } from "./family-room-comparison.mjs";

const json = name => JSON.parse(readFileSync(new URL(`../docs/research/${name}`, import.meta.url)));
const pack = json("orlando-homewood-room-configurations-2026-10-03.json");
const original = json("orlando-homewood-room-task-2026-10-03.json").booking_observation;
const prices = json("orlando-homewood-price-normalized-2026-10-03.json");
const id = pack.records[0].id, date = "2026-10-03";
const sample = (obs = prices, party = pack.scenario, asOf = date) => roomPriceForTask(obs, pack, id, party, asOf);

test("Unknown child-band sample preserves source and all dated budget context", () => {
  assert.deepEqual(validateRoomPack(pack), []);
  assert.deepEqual(validateRoomPrices(prices, pack), []);
  const p = sample();
  assert.equal(p.status, "dated-age-unresolved-count-samples");
  assert.equal(p.amount_from, 190.58);
  assert.equal(p.amount_to, 190.58);
  assert.equal(p.observed_on, original.checked_on);
  assert.equal(p.rates[0].stay_amount, original.displayed_stay_amount);
  assert.equal(p.rates[0].room_subtotal, original.room_subtotal);
  assert.equal(p.rates[0].displayed_taxes, original.displayed_taxes);
  assert.deepEqual(p.rates[0].nightly_before_displayed_tax, original.nightly_room_amounts);
  assert.equal(p.fee_basis, original.fee_basis);
  assert.equal(p.deposit_basis, original.payment);
  assert.equal(p.rates[0].cancellation, original.cancellation);
  assert.equal(p.rates[0].meals, original.meals);
});

test("Unresolved ages remain null and context match is not provider acceptance", () => {
  const p = sample();
  assert.equal(p.engine_party.adult_from_age, 18);
  assert.equal(p.engine_party.child_age_from, null);
  assert.equal(p.engine_party.child_age_to, null);
  assert.equal(p.engine_party.child_ages, null);
  assert.equal(p.requested_individual_ages_confirmed, false);
  assert.equal(p.engine_party.requested_individual_ages_confirmed, false);
  assert.equal(p.party_basis, "requested-task-context-not-provider-age-acceptance");
  assert.match(p.limitation, /Child-age applicability unresolved/);
  assert.match(p.observation_limitation, /not establish child\/infant policy/);
  assert.equal(screenRoomPack(pack, pack.scenario, date, prices)[0].screening, "CONDITIONAL_PUBLISHED_CAPACITY");
});

test("Strict unknown-band schema rejects invented policies, confirmation, counts and downgraded modes", () => {
  for (const mutate of [
    o => o.engine_party.child_age_from = 0,
    o => o.engine_party.child_age_to = 17,
    o => o.engine_party.child_ages = [4, 8, 12, 15],
    o => o.engine_party.individual_ages_entered = true,
    o => o.engine_party.requested_individual_ages_confirmed = true,
    o => o.requested_individual_ages_confirmed = true,
    o => delete o.party_basis,
    o => o.party_basis = "confirmed",
    o => o.engine_party.classification_basis = "confirmed-child-policy",
    o => o.engine_party.adult_from_age = null,
    o => o.engine_party.adult_from_age = 0,
    o => o.engine_party.adult_from_age = 15,
    o => o.engine_party.adult_from_age = 17.5,
    o => o.engine_party.children = 3,
    o => o.engine_party.children = "4",
    o => o.engine_party.adults = 3,
    o => o.engine_party.age_input_mode = "provider-age-band-counts",
    o => o.schema_version = 4,
    o => o.schema_version = 3,
    o => o.schema_version = 2,
    o => o.schema_version = 1,
    o => o.currency_evidence_class = "BOOKING_CHECK",
    o => delete o.currency_basis,
    o => o.configuration_count = 2,
    o => o.category = "Generic Suite"
  ]) {
    const changed = structuredClone(prices); mutate(changed[0]);
    assert.ok(validateRoomPrices(changed, pack).length);
    assert.throws(() => sample(changed));
  }
  const changed = structuredClone(prices);
  changed[0].party.child_ages = []; changed[0].engine_party.children = 0;
  assert.ok(validateRoomPrices(changed, pack).length);
});

test("Exact context and stay matching prevents unrelated family sample inheritance", () => {
  for (const party of [
    { ...pack.scenario, child_ages: [4, 8, 12, 16] },
    { ...pack.scenario, child_ages: [4, 8, 12] },
    { ...pack.scenario, adults: 3 },
    { ...pack.scenario, stay: { arrival: "2026-11-09", departure: "2026-11-14" } }
  ]) assert.equal(sample(prices, party), null);
  assert.equal(sample(prices, { ...pack.scenario, child_ages: [15, 12, 8, 4] }).amount_from, 190.58);
  assert.equal(roomPriceForTask(prices, pack, "other", pack.scenario, date), null);
  for (const ages of [[4,,12,15], [4,8,12,undefined], new Array(4)]) {
    const changed = structuredClone(prices); changed[0].party.child_ages = ages;
    assert.ok(validateRoomPrices(changed, pack).length);
  }
});

test("History and source freshness never become renewed price or capacity acceptance", () => {
  assert.equal(sample(prices, pack.scenario, "2026-10-18").status, "historical-dated-age-unresolved-count-samples");
  assert.equal(sample(prices, pack.scenario, "2026-10-02"), null);
  assert.equal(screenRoomPack(pack, pack.scenario, "2026-11-03", prices)[0].screening, "RECHECK_SOURCE");
  assert.equal(sample(prices, pack.scenario, "2026-11-03").observed_on, date);
});

test("Membership exclusions and defensive copies preserve original age-unknown observation", () => {
  const before = JSON.stringify(prices), changed = structuredClone(prices);
  changed[0].rates.push({ ...changed[0].rates[0], plan: "Membership control", eligibility: "membership-required", stay_amount: 1 });
  const p = sample(changed);
  assert.equal(p.amount_from, 190.58);
  assert.deepEqual(p.excluded_rate_plans, ["Membership control"]);
  p.engine_party.children = 0; p.rates[0].nightly_before_displayed_tax[0] = 0;
  assert.equal(changed[0].engine_party.children, 4);
  assert.equal(changed[0].rates[0].nightly_before_displayed_tax[0], 216);
  assert.equal(JSON.stringify(prices), before);
});

test("Joined and kitchen-filtered export keeps cost adjacent to unresolved-age basis", () => {
  const four = json("orlando-room-configurations-2026-10-03.json"), cabana = json("orlando-cabana-room-configurations-2026-10-03.json");
  const cp = json("orlando-cabana-price-observation-2026-10-03.json");
  const csv = roomComparisonsCsv([four, cabana, pack], pack.scenario, date, [...cp, ...prices]);
  assert.equal(csv.trim().split("\n").length, 7);
  assert.equal((csv.match(/dated-age-unresolved-count-samples/g) ?? []).length, 1);
  assert.equal((csv.match(/dated-count-only-stay-samples/g) ?? []).length, 2);
  const filtered = roomComparisonCsv(pack, pack.scenario, date, prices, { kitchen: "published" });
  for (const value of ["190.58", "952.88", "USD", "2026-11-08", "2026-11-13", "provider-counts-unknown-child-band", "child_age_to", "null", "requested_individual_ages_confirmed", "false", "not provider-age acceptance", "additional fees/charges"]) assert.ok(filtered.includes(value));
});
