import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { comparisonHeadings, roomComparisonCsv, roomComparisonsCsv } from "./family-room-comparison.mjs";
import { validateRoomPrices } from "./family-room-price.mjs";

const path = name => fileURLToPath(new URL(`../docs/research/${name}`, import.meta.url));
const read = name => JSON.parse(readFileSync(path(name), "utf8"));
const packPath = path("washington-dc-room-configurations-2026-09-30.json");
const pack = read("washington-dc-room-configurations-2026-09-30.json");
const pricePaths = ["embassy", "homewood", "residence"].map(n => path(`washington-dc-${n}-price-observation-2026-09-30.json`));
const prices = pricePaths.flatMap(p => JSON.parse(readFileSync(p, "utf8")));
const hilton = prices.filter(p => p.record_id !== "dc-residence-two-queen-onqq");
const rows = csv => csv.trimEnd().split("\n").map(line => [...line.matchAll(/"((?:[^"]|"")*)"(?:,|$)/g)].map(m => m[1].replaceAll('""', '"')));
const value = (row, heading) => row[comparisonHeadings.indexOf(heading)];
const budget = { budget: { currency: "USD", nightly_limit: 350 } };
const output = (party = pack.scenario, date = "2026-10-05", filters = budget, observations = prices) => roomComparisonCsv(pack, party, date, observations, filters);
const status = row => value(row, "Research scope and limits").match(/Observed nightly budget ([A-Z_]+):/)[1];

test("DC counts retain published adult cutoff without inventing child ages or band", () => {
  assert.deepEqual(validateRoomPrices(prices, pack), []);
  assert.equal(hilton.length, 2);
  for (const p of hilton) {
    assert.equal(p.schema_version, 5); assert.equal(p.checked_on, "2026-09-30");
    assert.equal(p.normalization_action, "FT-IMP-073"); assert.equal(p.normalization_checked_on, "2026-10-05");
    assert.deepEqual(p.party, { adults: 2, child_ages: [4, 8, 12] });
    assert.equal(p.party_basis, "requested-task-context-not-provider-age-acceptance");
    assert.equal(p.requested_individual_ages_confirmed, false);
    assert.deepEqual(p.engine_party, { adults: 2, children: 3, child_ages: null, adult_from_age: 18,
      child_age_from: null, child_age_to: null, age_input_mode: "provider-counts-unknown-child-band",
      individual_ages_entered: false, requested_individual_ages_confirmed: false,
      classification_basis: "published-adult-cutoff-unknown-child-band-counts" });
    assert.equal(p.currency_evidence_class, "EDITORIAL_INTERPRETATION");
    assert.match(p.currency_basis, /not a new provider ISO-currency check/);
    assert.match(p.limitation, /provider child band unknown/);
    assert.doesNotMatch(p.limitation, /consistent with provider age-band/);
  }
});

test("immutable September30 price-context projections retain exact amounts and terms", () => {
  const keys = ["action", "checked_on", "source_url", "source_surface", "evidence_class", "record_id", "category",
    "booking_category", "configuration_basis", "configuration_count", "currency", "unit", "arrival", "departure",
    "nights", "party", "rates", "fee_basis", "deposit_basis"];
  const hashes = ["c34ce24d5b57e26eca85d8447767823e64bfffc6c58859fc1b2607e341011aea",
    "dbb6a81e1ff3b9ea074fa13aa2e55f0d7f22bb8d1aa66bf94fc5800103cb8354"];
  hilton.forEach((p, i) => assert.equal(createHash("sha256").update(JSON.stringify(Object.fromEntries(keys.map(k => [k, p[k]])))).digest("hex"), hashes[i]));
  const data = rows(output()).slice(1);
  assert.equal(data.length, 7); assert.ok(data.every(r => r.length === 35));
  assert.deepEqual(data.map(r => value(r, "Nightly equivalent")), ["334.68", "408.14", "288.97", "316.61", "339.97", "", "433.65"]);
  assert.deepEqual(data.map(r => value(r, "Displayed stay amount")), ["1673.39", "2040.72", "1444.85", "1583.04", "1699.83", "", "2168.27"]);
  const h = data.filter(r => /^(Embassy|Homewood)/.test(value(r, "Hotel")));
  assert.ok(h.every(r => value(r, "Price observed") === "2026-09-30" && value(r, "Currency") === "USD" && value(r, "Price unit") === "configuration/night"));
});

test("unresolved Hilton plans cannot pass any observed budget or combined filter", () => {
  const before = JSON.stringify([pack, prices]);
  for (const nightly_limit of [0.01, 288.97, 334.68, 350, 10000]) {
    const data = rows(output(pack.scenario, "2026-10-05", { budget: { currency: "USD", nightly_limit } })).slice(1);
    assert.deepEqual(data.filter(r => /^(Embassy|Homewood)/.test(value(r, "Hotel"))).map(status), Array(5).fill("UNKNOWN_AGE_BASIS"));
  }
  assert.deepEqual(rows(output()).slice(1).map(status), [...Array(5).fill("UNKNOWN_AGE_BASIS"), "UNKNOWN_UNPRICED", "ABOVE_OBSERVED_AMOUNT"]);
  const filtered = { ...budget, kitchen: "published", capacity: "not-excluded" };
  assert.deepEqual(rows(output(pack.scenario, "2026-10-05", filtered)).slice(1).map(status), [...Array(3).fill("UNKNOWN_AGE_BASIS"), "ABOVE_OBSERVED_AMOUNT"]);
  assert.equal(roomComparisonsCsv([pack], pack.scenario, "2026-10-05", prices, budget), output());
  assert.equal(JSON.stringify([pack, prices]), before);
});

test("changed task, stale samples and member exclusions do not promote eligibility", () => {
  for (const party of [{ ...pack.scenario, child_ages: [4, 8, 13] }, { ...pack.scenario, adults: 3 },
    { ...pack.scenario, stay: { arrival: "2026-11-09", departure: "2026-11-14" } }]) {
    const data = rows(output(party)).slice(1);
    assert.ok(data.every(r => value(r, "Nightly equivalent") === "" && status(r) === "UNKNOWN_UNPRICED"));
  }
  const old = rows(output(pack.scenario, "2026-10-31")).slice(1);
  assert.deepEqual(old.filter(r => /^(Embassy|Homewood)/.test(value(r, "Hotel"))).map(r => value(r, "Price status")), Array(5).fill("historical-dated-age-unresolved-count-samples"));
  assert.equal(old.filter(r => status(r) === "UNKNOWN_HISTORICAL_PRICE").length, 6);
  const members = structuredClone(prices);
  for (const p of members.filter(p => p.schema_version === 5)) for (const r of p.rates) r.eligibility = "membership-required";
  const data = rows(output(pack.scenario, "2026-10-05", budget, members)).slice(1);
  assert.equal(data.length, 4);
  assert.ok(data.filter(r => /^(Embassy|Homewood)/.test(value(r, "Hotel"))).every(r => value(r, "Nightly equivalent") === ""));
});

test("historical checkpoint is not rewritten and retained Hilton cells stay exact", () => {
  const prior = rows(readFileSync(path("washington-dc-comparison-task-2026-10-03.csv"), "utf8"));
  const current = rows(output(pack.scenario, "2026-10-03", {}));
  assert.deepEqual(current[0], prior[0]); assert.equal(current.length, prior.length);
  const allowed = ["Next checks", "Price status", "Engine party and age basis", "Observation limits", "Research scope and limits"].map(h => comparisonHeadings.indexOf(h));
  for (let i = 1; i < current.length; i++) if (/^(Embassy|Homewood)/.test(value(current[i], "Hotel"))) {
    assert.deepEqual(current[i].filter((_, j) => !allowed.includes(j)), prior[i].filter((_, j) => !allowed.includes(j)));
    assert.match(value(current[i], "Observation limits"), /not provider age acceptance/);
    assert.equal(value(current[i], "Price status"), "dated-age-unresolved-count-samples");
  }
});

test("invented band, confirmed ages and downgraded unknown-count schemas fail closed", () => {
  for (const mutate of [p => p.engine_party.child_age_to = 17, p => p.engine_party.child_age_from = 0,
    p => p.engine_party.child_ages = [4, 8, 12], p => p.engine_party.children = 2,
    p => p.requested_individual_ages_confirmed = true, p => p.engine_party.individual_ages_entered = true,
    p => p.schema_version = 2, p => p.party_basis = "accepted", p => p.currency_basis = ""]) {
    const invalid = structuredClone(prices); mutate(invalid[0]);
    assert.ok(validateRoomPrices(invalid, pack).length);
    assert.throws(() => output(pack.scenario, "2026-10-05", budget, invalid));
  }
});

test("October5 stdout CLI matches single and joined API without output writes", () => {
  const cli = fileURLToPath(new URL("./family-room-comparison.mjs", import.meta.url));
  assert.equal(execFileSync(process.execPath, [cli, packPath, "--date", "2026-10-05", "--prices", ...pricePaths,
    "--nightly-budget", "350", "--budget-currency", "USD"], { encoding: "utf8" }), output());
});
