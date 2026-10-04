import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { screenRoomPack, validateRoomPack } from "./family-room-task.mjs";
import { validateRoomPrices } from "./family-room-price.mjs";
import { comparisonHeadings, roomComparisonCsv, roomComparisonsCsv } from "./family-room-comparison.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const packPath = "docs/research/san-diego-homewood-room-task-2026-10-04.json";
const pricePath = "docs/research/san-diego-homewood-price-observation-2026-10-04.json";
const read = path => JSON.parse(readFileSync(new URL(`../${path}`, import.meta.url), "utf8"));
const pack = read(packPath), prices = read(pricePath);
// Writer emits quoted cells without embedded newlines for this bounded fixture.
const rows = csv => csv.trimEnd().split("\n").map(line => [...line.matchAll(/"((?:[^"]|"")*)"(?:,|$)/g)].map(match => match[1].replaceAll('""', '"')));
const cell = (row, heading) => row[comparisonHeadings.indexOf(heading)];

test("San Diego exact standard category retains source and unresolved setup", () => {
  assert.deepEqual(validateRoomPack(pack), []);
  assert.deepEqual(validateRoomPrices(prices, pack), []);
  assert.equal(pack.records.length, 1);
  assert.equal(pack.records[0].category, "1 Bedroom Suite - 2 Queen Beds");
  assert.equal(pack.records[0].configurations[0].maximum, 6);
  assert.equal(pack.records[0].price.amount, null);
  assert.match(pack.records[0].sleeping_setup, /queen-sized sofa bed/);
  assert.match(pack.records[0].checks.join(" "), /five-person chair/);
  const evidence = read("docs/research/san-diego-homewood-budget-task-2026-10-04.json");
  assert.equal(evidence.method.individual_child_ages_confirmed, false);
  assert.equal(evidence.method.paid_calls, 0);
  assert.equal(evidence.preservation.old_range_renewed, false);
  assert.equal(evidence.preservation.public_change, false);
  for (const unknown of Object.values(evidence.unresolved)) assert.equal(unknown, null);
  for (const source of Object.values(pack.sources)) assert.equal(new URL(source.url).search, "");
});

test("two public plans keep exact nightly arithmetic and count-only party basis", () => {
  const [record] = screenRoomPack(pack, pack.scenario, "2026-10-04", prices);
  assert.equal(record.screening, "WITHIN_PUBLISHED_CAPACITY");
  assert.deepEqual(record.price.rates.map(rate => rate.stay_amount), [1355.19, 1647.58]);
  assert.deepEqual(record.price.rates.map(rate => rate.nightly_average), [271.04, 329.52]);
  assert.equal(record.price.age_input_mode, "provider-counts-unknown-child-band");
  assert.equal(record.price.status, "dated-age-unresolved-count-samples");
  assert.equal(record.price.engine_party.child_ages, null);
  assert.equal(record.price.engine_party.child_age_from, null);
  assert.equal(record.price.engine_party.child_age_to, null);
  assert.equal(record.price.engine_party.children, 3);
  assert.equal(record.price.requested_individual_ages_confirmed, false);
  assert.match(record.price.observation_limitation, /no individual4\/8\/12/);
  assert.match(record.price.fee_basis, /Optional valet65USD\/night/);
  assert.match(record.price.deposit_basis, /amount unknown/);
  assert.equal(record.price.rates[1].cancellation_deadline_date_relation, "BEFORE_RECORDED_LOCAL_DATE");
});

test("single, joined, filtered and CLI exports retain exact rates and limits", () => {
  const csv = roomComparisonCsv(pack, pack.scenario, "2026-10-04", prices);
  assert.equal(roomComparisonsCsv([pack], pack.scenario, "2026-10-04", prices), csv);
  const outputRows = rows(csv).slice(1);
  const filtered = rows(roomComparisonCsv(pack, pack.scenario, "2026-10-04", prices, {kitchen:"published", capacity:"not-excluded"})).slice(1);
  const scope = comparisonHeadings.indexOf("Research scope and limits");
  assert.deepEqual(filtered.map(row => row.filter((_, i) => i !== scope)), outputRows.map(row => row.filter((_, i) => i !== scope)));
  for (const row of filtered) assert.match(row[scope], /Filtered by dated published kitchen evidence.*Filtered only current published-capacity exclusions/);
  assert.deepEqual(outputRows.map(row => cell(row, "Nightly equivalent")), ["271.04", "329.52"]);
  for (const row of outputRows) {
    assert.equal(cell(row, "Category checked"), "2026-10-04");
    assert.equal(cell(row, "Price observed"), "2026-10-04");
    assert.match(cell(row, "Next checks"), /mandatory\/sofa fees/);
    assert.match(cell(row, "Next checks"), /no individual4\/8\/12/);
  }
  const dc = read("docs/research/washington-dc-room-configurations-2026-09-30.json");
  assert.throws(() => roomComparisonsCsv([dc, pack], pack.scenario, "2026-10-04", prices), /same destination/);
  const control = structuredClone(pack);
  control.records[0].id = "synthetic-unpriced-control";
  control.records[0].hotel = "Synthetic unpriced control";
  const joined = rows(roomComparisonsCsv([control, pack], pack.scenario, "2026-10-04", prices)).slice(1).filter(row => cell(row, "Hotel") === pack.records[0].hotel);
  assert.deepEqual(joined, outputRows);
  const cli = spawnSync(process.execPath, ["tools/family-room-comparison.mjs",packPath,"--date","2026-10-04","--prices",pricePath], {cwd:root,encoding:"utf8"});
  assert.equal(cli.status, 0, cli.stderr); assert.equal(cli.stdout, csv);
});

test("changed ages or stay cannot inherit the observed family price", () => {
  for (const party of [{...pack.scenario,child_ages:[4,8,13]}, {...pack.scenario,stay:{arrival:"2026-11-09",departure:"2026-11-14"}}]) {
    const output = rows(roomComparisonCsv(pack, party, "2026-10-04", prices)).slice(1);
    assert.equal(output.length, 1);
    assert.equal(cell(output[0], "Nightly equivalent"), "");
    assert.equal(cell(output[0], "Public rate plan"), "Unpriced");
    assert.match(cell(output[0], "Next checks"), /actual family-paced nap-return/);
  }
  const [outside] = screenRoomPack(pack, {...pack.scenario,child_ages:[1,4,8,12,15]}, "2026-10-04", prices);
  assert.equal(outside.screening, "OUTSIDE_PUBLISHED_LIMIT");
});

test("stale source and expired date remain warnings without renewing observations", () => {
  const [stale] = screenRoomPack(pack, pack.scenario, "2026-11-08", prices);
  assert.equal(stale.screening, "RECHECK_SOURCE");
  assert.equal(stale.checked_on, "2026-10-04");
  assert.equal(stale.price.status, "historical-dated-age-unresolved-count-samples");
  assert.equal(stale.price.observed_on, "2026-10-04");
  assert.equal(stale.price.rates[1].cancellation_deadline_date_relation, "AFTER_RECORDED_LOCAL_DATE");
  assert.deepEqual(stale.price.rates.map(rate => rate.nightly_average), [271.04,329.52]);
});

test("optional observed budget annotation is not a final affordability verdict", () => {
  const output = rows(roomComparisonCsv(pack, pack.scenario, "2026-10-04", prices, {budget:{nightly_limit:300,currency:"USD"}})).slice(1);
  for (const row of output) assert.match(cell(row, "Research scope and limits"), /UNKNOWN_AGE_BASIS/);
  assert.deepEqual(output.map(row => cell(row, "Nightly equivalent")), ["271.04","329.52"]);
});

test("unknown child band cannot be promoted or silently reclassified", () => {
  for (const mutate of [o => o.schema_version = 2, o => o.engine_party.child_ages = [4,8,12], o => o.engine_party.child_age_to = 17, o => o.engine_party.children = 2, o => o.requested_individual_ages_confirmed = true]) {
    const bad = structuredClone(prices); mutate(bad[0]);
    assert.ok(validateRoomPrices(bad, pack).length > 0);
    assert.throws(() => roomComparisonCsv(pack, pack.scenario, "2026-10-04", bad));
  }
});
