import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { roomPriceForTask, validateRoomPrices } from "./family-room-price.mjs";

const pack = JSON.parse(readFileSync(new URL("../docs/research/london-room-configurations-2026-09-30.json", import.meta.url)));
const observations = JSON.parse(readFileSync(new URL("../docs/research/london-mitre-price-observation-2026-09-30.json", import.meta.url)));
const marlin = JSON.parse(readFileSync(new URL("../docs/research/london-marlin-price-observation-2026-09-30.json", import.meta.url)));
const dcPack = JSON.parse(readFileSync(new URL("../docs/research/washington-dc-room-configurations-2026-09-30.json", import.meta.url)));
const dcPrices = JSON.parse(readFileSync(new URL("../docs/research/washington-dc-embassy-price-observation-2026-09-30.json", import.meta.url)));
const price = (samples = observations, party = pack.scenario, date = "2026-09-30") => roomPriceForTask(samples, pack, "mitre-family-five", party, date);

const residence = JSON.parse(readFileSync(new URL("../docs/research/washington-dc-residence-price-observation-2026-09-30.json", import.meta.url)));
test("schema3 keeps unpublished cutoffs unknown for an exact individually entered party", () => {
  assert.deepEqual(validateRoomPrices(residence, dcPack), []);
  const p = roomPriceForTask(residence, dcPack, "dc-residence-two-queen-onqq", dcPack.scenario, "2026-09-30");
  assert.equal(p.amount_from, 433.65);
  assert.equal(p.rates[0].stay_amount, 2168.27);
  assert.equal(p.age_input_mode, "individual-ages");
  assert.equal(p.engine_party.adult_from_age, null);
  assert.equal(p.engine_party.classification_basis, "unpublished-cutoffs-exact-individual-party");
  assert.match(p.fee_basis, /no tax-rate\/component or all-fee-completeness inferred/);
  assert.match(p.deposit_basis, /not an additional stay fee/);
  assert.match(p.rates[0].cancellation, /October1,2026/);
});
test("unknown cutoffs cannot accept count-only, partial bounds, reclassification or missing basis", () => {
  for (const mutate of [
    s => s[0].engine_party.age_input_mode = "provider-age-band-counts",
    s => delete s[0].engine_party.classification_basis,
    s => s[0].engine_party.child_age_from = 0,
    s => Object.assign(s[0].engine_party, { adult_from_age: 18, child_age_from: 0, child_age_to: 17 }),
    s => s[0].engine_party.adults = 3,
    s => s[0].engine_party.child_ages = [4, 8, 11],
    s => s[0].engine_party.child_ages = null,
    s => s[0].schema_version = 2,
    s => delete s[0].rates[0].eligibility
  ]) {
    const samples = structuredClone(residence); mutate(samples);
    assert.ok(validateRoomPrices(samples, dcPack).length);
    assert.throws(() => roomPriceForTask(samples, dcPack, "dc-residence-two-queen-onqq", dcPack.scenario, "2026-09-30"));
  }
});
test("schema3 preserves public eligibility, exact task, stale dates and defensive copies", () => {
  const before = JSON.stringify(residence);
  const samples = structuredClone(residence);
  samples[0].rates.push({ ...samples[0].rates[0], plan: "Member-only control", eligibility: "membership-required", stay_amount: 1000 });
  const p = roomPriceForTask(samples, dcPack, "dc-residence-two-queen-onqq", dcPack.scenario, "2026-10-15");
  assert.equal(p.status, "historical-dated-stay-samples");
  assert.equal(p.amount_from, 433.65);
  assert.deepEqual(p.excluded_rate_plans, ["Member-only control"]);
  p.engine_party.child_ages[0] = 1;
  assert.deepEqual(samples[0].engine_party.child_ages, [4, 8, 12]);
  for (const party of [{ adults: 2, child_ages: [4, 8, 13] }, { adults: 3, child_ages: [4, 8] }])
    assert.equal(roomPriceForTask(samples, dcPack, "dc-residence-two-queen-onqq", party, "2026-09-30"), null);
  assert.equal(JSON.stringify(residence), before);
});

test("public exact-family samples validate and convert stay totals to nightly equivalents", () => {
  assert.deepEqual(validateRoomPrices(observations, pack), []);
  const p = price();
  assert.equal(p.amount_from, 260);
  assert.equal(p.amount_to, 288.8);
  assert.deepEqual(p.rates.map(r => r.stay_amount), [1300, 1444]);
  assert.equal(p.unit, "configuration/night");
  assert.equal(p.amount, null);
  assert.match(p.fee_basis, /not established/);
  assert.equal(p.engine_party.adults, 3);
  assert.equal(p.derivation_class, "EDITORIAL_INTERPRETATION");
});
test("different party, child ages or stay cannot inherit this price", () => {
  for (const party of [{ adults: 2, child_ages: [1, 4, 8] }, { adults: 3, child_ages: [4, 8] },
    { ...pack.scenario, stay: { arrival: "2026-11-09", departure: "2026-11-14" } }])
    assert.equal(price(observations, party), null);
  assert.equal(roomPriceForTask(observations, pack, "bloomsbury-family-room", pack.scenario, "2026-09-30"), null);
});
test("ages are order-independent but provider age classification must reconcile", () => {
  assert.equal(price(observations, { adults: 2, child_ages: [12, 4, 8] }).amount_from, 260);
  const samples = structuredClone(observations);
  samples[0].engine_party.adults = 2;
  assert.match(validateRoomPrices(samples, pack).join(";"), /Engine party/);
  assert.throws(() => price(samples));
});
test("stale samples retain amounts and original date without becoming current quotes", () => {
  const p = price(observations, pack.scenario, "2026-10-15");
  assert.equal(p.status, "historical-dated-stay-samples");
  assert.equal(p.amount_to, 288.8);
  assert.equal(p.observed_on, "2026-09-30");
  assert.equal(price(observations, pack.scenario, "2026-10-14").status, "dated-stay-samples");
  assert.equal(price(observations, pack.scenario, "2026-09-29"), null);
});
test("unsafe/mismatched source, unit, date, counts and negative amounts fail closed", () => {
  for (const mutate of [
    s => s[0].source_url += "?channelKey=not-retained",
    s => s[0].category = "Standard Double",
    s => s[0].nights = 4,
    s => s[0].departure = "invalid",
    s => s[0].configuration_count = 2,
    s => s[0].rates[0].stay_amount = -1,
    s => s[0].party.child_ages = [1, 4, 8],
    s => s.push(structuredClone(s[0]))
  ]) { const s = structuredClone(observations); mutate(s); assert.ok(validateRoomPrices(s, pack).length); assert.throws(() => price(s)); }
});
test("all source records stay immutable and fee unknown is not converted to zero", () => {
  const before = JSON.stringify([pack, observations]);
  price();
  assert.equal(JSON.stringify([pack, observations]), before);
  assert.equal(price().fee_total, undefined);
  assert.equal(pack.records[0].price.amount, null);
  assert.equal(pack.offer_observations[0].amount_from, 555);
});

test("sofa-category public rates carry VAT, deposits and count-only age-input basis", () => {
  assert.deepEqual(validateRoomPrices(marlin, pack), []);
  const p = roomPriceForTask(marlin, pack, "marlin-queen-street-two-bedroom", pack.scenario, "2026-09-30");
  assert.equal(p.amount_from, 396.18);
  assert.equal(p.amount_to, 440.2);
  assert.match(p.booking_category, /1 Sofa Bed/);
  assert.equal(p.age_input_mode, "provider-age-band-counts");
  assert.equal(p.engine_party.adults, 2);
  assert.match(p.fee_basis, /366.83GBP/);
  assert.match(p.deposit_basis, /not established/);
  assert.equal(p.rates.length, 2);
  assert.match(p.observation_limitation, /individual4\/8\/12ages were not entered/);
  assert.equal(price().age_input_mode, "not-recorded");
  assert.equal(price().deposit_basis, "not-established");
});
test("membership-required plans cannot lower a public comparison", () => {
  const samples = structuredClone(marlin);
  samples[0].rates.unshift({ ...samples[0].rates[0], plan: "Member Non-Refundable", eligibility: "membership-required", stay_amount: 1870.85 });
  const p = roomPriceForTask(samples, pack, samples[0].record_id, pack.scenario, "2026-09-30");
  assert.equal(p.amount_from, 396.18);
  assert.deepEqual(p.excluded_rate_plans, ["Member Non-Refundable"]);
  samples[0].rates = samples[0].rates.filter(r => r.eligibility === "membership-required");
  assert.equal(roomPriceForTask(samples, pack, samples[0].record_id, pack.scenario, "2026-09-30"), null);
});
test("schema2 fails closed on missing eligibility, configuration, deposit or age-input basis", () => {
  for (const mutate of [
    s => delete s[0].booking_category,
    s => delete s[0].configuration_basis,
    s => delete s[0].deposit_basis,
    s => s[0].engine_party.age_input_mode = "exact-age-confirmed",
    s => delete s[0].rates[0].eligibility,
    s => s[0].rates[0].eligibility = "unverified-savings",
    s => s[0].engine_party.adult_from_age = 12
  ]) {
    const s = structuredClone(marlin); mutate(s);
    assert.ok(validateRoomPrices(s, pack).length);
    assert.throws(() => roomPriceForTask(s, pack, s[0].record_id, pack.scenario, "2026-09-30"));
  }
});
test("matched separate observations do not enrich other parties or mutate through returned basis", () => {
  const samples = [...structuredClone(observations), ...structuredClone(marlin)];
  const before = JSON.stringify(samples);
  const p = roomPriceForTask(samples, pack, marlin[0].record_id, pack.scenario, "2026-09-30");
  p.party.child_ages[0] = 17;
  p.engine_party.child_ages[0] = 17;
  assert.equal(JSON.stringify(samples), before);
  assert.equal(roomPriceForTask(samples, pack, marlin[0].record_id, { adults: 2, child_ages: [4, 8, 13] }, "2026-09-30"), null);
  assert.equal(roomPriceForTask(samples, pack, marlin[0].record_id, pack.scenario, "2026-09-29"), null);
  assert.equal(roomPriceForTask(samples, pack, marlin[0].record_id, pack.scenario, "2026-10-15").status, "historical-dated-stay-samples");
});

test("USD public stay totals retain taxes, membership exclusions and count-band age limits", () => {
  assert.deepEqual(validateRoomPrices(dcPrices, dcPack), []);
  const p = roomPriceForTask(dcPrices, dcPack, dcPrices[0].record_id, dcPack.scenario, "2026-09-30");
  assert.equal(p.currency, "USD");
  assert.deepEqual(p.rates.map(r => r.stay_amount), [1673.39, 2040.72]);
  assert.equal(p.amount_from, 334.68);
  assert.equal(p.amount_to, 408.14);
  assert.equal(p.age_input_mode, "provider-age-band-counts");
  assert.match(p.observation_limitation, /individual4\/8\/12ages were not entered/);
  assert.match(p.fee_basis, /Member card283USD discarded/);
  assert.match(p.fee_basis, /additional stay charges/);
  assert.match(p.deposit_basis, /unknown hold amount, not an added stay fee/);
  assert.equal(roomPriceForTask(dcPrices, dcPack, "dc-homewood-two-queen", dcPack.scenario, "2026-09-30"), null);
  assert.equal(roomPriceForTask(dcPrices, dcPack, dcPrices[0].record_id,
    { ...dcPack.scenario, child_ages: [4, 8, 13] }, "2026-09-30"), null);
});

test("currency cannot be relabeled, implicitly converted or mixed into a record", () => {
  for (const [samples, sourcePack, currency] of [[dcPrices, dcPack, "GBP"], [dcPrices, dcPack, "EUR"], [observations, pack, "USD"]]) {
    const s = structuredClone(samples);
    s[0].currency = currency;
    assert.match(validateRoomPrices(s, sourcePack).join(";"), /currency/);
    assert.throws(() => roomPriceForTask(s, sourcePack, s[0].record_id, sourcePack.scenario, "2026-09-30"));
  }
  assert.equal(price().currency, "GBP");
  assert.equal(price().amount_from, 260);
});
