import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { careComparisonCsv, parseCareOptions, screenCareInventory, validateCareInventory } from "./family-care-comparison.mjs";

const packPath = fileURLToPath(new URL("../docs/research/cancun-care-services-2026-10-02.json", import.meta.url));
const cli = fileURLToPath(new URL("./family-care-comparison.mjs", import.meta.url));
const pack = JSON.parse(readFileSync(packPath, "utf8"));
const date = "2026-10-02";
const record = (result, id) => result.records.find(item => item.id === id);
const service = (item, childIndex, id) => item.children[childIndex].services.find(item => item.id === id);

test("current four-property inventory validates without mutation", () => {
  const before = structuredClone(pack);
  assert.equal(validateCareInventory(pack, date), pack);
  const result = screenCareInventory(pack, {}, date);
  assert.equal(result.records.length, 4);
  assert.deepEqual(result.requested.child_ages, [2, 7]);
  assert.equal(result.room_plus_care_total, null);
  assert.equal(result.simultaneous_parent_free_care, "not-established");
  result.records[0].children[0].services[0].sources[0].url = "invalid";
  result.records[0].budget.basis = "invalid";
  assert.deepEqual(pack, before);
});

test("Grand floor overlap retains accompanied access rather than first-match or generic dropoff", () => {
  const grand = record(screenCareInventory(pack, {}, date), "moon-palace-grand-care");
  assert.equal(grand.children[0].services.length, 4);
  assert.equal(service(grand, 0, "mezzanine-accompanied").parent_presence, "required");
  assert.equal(service(grand, 0, "ground-accompanied").age_status, "within-published-band-not-admission");
  assert.equal(service(grand, 1, "mezzanine").age_status, "within-published-band-not-admission");
  assert.equal(service(grand, 1, "mezzanine").parent_presence, "dropoff-admission-not-established");
  assert.equal(service(grand, 1, "ground-accompanied").parent_presence, "required");
  assert.equal(service(grand, 1, "ground").age_status, "below-published-minimum");
});

test("Finest age minimum, training, restaurant hours and session maximum remain independent", () => {
  const finest = record(screenCareInventory(pack, {child_ages:[2, 3, 17], potty_trained:[null, false, true], minutes:91}, date), "finest-playa-mujeres-care");
  assert.equal(service(finest, 0, "mini-accompanied").parent_presence, "required");
  assert.equal(service(finest, 0, "imagine-lounge").age_status, "below-published-minimum");
  assert.equal(service(finest, 1, "imagine-lounge").training_status, "published-training-condition-not-met");
  assert.equal(service(finest, 2, "imagine-lounge").age_status, "minimum-met-upper-limit-not-established");
  assert.equal(service(finest, 2, "imagine-lounge").session_status, "requested-duration-exceeds-published-limit");
  assert.equal(service(finest, 1, "imagine-lounge").hours, "Breakfast07:00-11:00; dinner17:00-22:30");
  const short = record(screenCareInventory(pack, {child_ages:[3], minutes:90}, date), "finest-playa-mujeres-care");
  assert.equal(service(short, 0, "imagine-lounge").training_status, "training-check-needed");
  assert.equal(service(short, 0, "imagine-lounge").session_status, "within-published-limit-not-confirmed-session");
});

test("published inclusion is not a numeric toddler fee or complete budget", () => {
  const result = screenCareInventory(pack, {}, date);
  const ziva = record(result, "hyatt-ziva-cancun-care");
  assert.equal(service(ziva, 0, "kidz").age_status, "below-published-minimum");
  assert.equal(service(ziva, 1, "kidz").cost_status, "published-included-eligible-program");
  assert.equal(service(ziva, 1, "kidz").fee_amount, null);
  assert.equal(service(ziva, 1, "kidz").parent_presence, "supervised-program-parent-policy-not-established");
  const clubmed = record(result, "clubmed-cancun-care");
  assert.equal(service(clubmed, 0, "petit").cost_status, "extra-charge-numeric-fee-unknown");
  for (const item of result.records) assert.equal(item.budget.care_total_amount, null);
});

test("different child inputs never repurpose historical room observations as task quotes", () => {
  const result = screenCareInventory(pack, {child_ages:[1, 8, 12]}, date);
  const finest = record(result, "finest-playa-mujeres-care");
  assert.equal(finest.budget.retained_room_observation.amount_from, 843);
  assert.equal(finest.budget.retained_room_observation.observed_on, "2026-09-27");
  assert.equal(finest.budget.exact_task_room_nightly_amount, null);
  assert.equal(finest.budget_applicability, "original-research-scenario-only-not-a-quote");
  assert.match(record(result, "moon-palace-grand-care").budget.basis, /8191total\/displayed1638night/);
  assert.deepEqual(result.research_scenario.child_ages, [2, 7]);
});

test("weekly review status never renews evidence or discards dated price context", () => {
  const current = screenCareInventory(pack, {}, "2026-10-08");
  const due = screenCareInventory(pack, {}, "2026-10-09");
  assert.equal(current.source_age_days, 6);
  assert.equal(due.source_review_status, "weekly-source-review-due-not-revalidated");
  assert.equal(due.source_checked_on, date);
  assert.equal(due.records[0].children[0].services[0].sources[0].checked_on, date);
  assert.equal(due.records[0].budget.retained_room_observation.observed_on, "2026-09-27");
  const mixed = structuredClone(pack);
  mixed.sources.finest.checked_on = "2026-09-23";
  const mixedResult = screenCareInventory(mixed, {}, date);
  assert.equal(mixedResult.oldest_source_checked_on, "2026-09-23");
  assert.equal(mixedResult.source_age_days, 9);
  assert.equal(mixedResult.source_review_status, "weekly-source-review-due-not-revalidated");
  assert.throws(() => screenCareInventory(pack, {}, "2026-10-01"));
  assert.throws(() => screenCareInventory(pack, {}, "2026-02-30"));
});

test("malformed sources, ages, fee claims, booleans and IDs fail closed", () => {
  const changes = [
    p => p.schema_version = 2,
    p => p.injected = "extra",
    p => p.sources.finest.url = "http://example.com",
    p => p.sources.finest.url = "https://user:password@example.com",
    p => p.sources.finest.checked_on = "2026-10-03",
    p => p.sources.finest.published_on = "2026-10-03",
    p => p.records[1].id = p.records[0].id,
    p => p.records[0].services[1].id = p.records[0].services[0].id,
    p => p.records[0].services[0].source_ids = ["missing"],
    p => p.records[0].services[0].max_age = -1,
    p => p.records[0].services[0].min_age = "0",
    p => p.records[0].services[0].parent_presence = "dropoff-guaranteed",
    p => p.records[0].services[0].registration = "true",
    p => p.records[0].services[0].fee_amount = 0,
    p => p.records[0].budget.care_total_amount = 0,
    p => p.records[0].budget.retained_room_observation.observed_on = "2026-10-03",
    p => p.records[0].budget.retained_room_observation.amount_from = NaN,
    p => p.records[0].services[0].session_max_minutes = 0
  ];
  for (const change of changes) { const altered = structuredClone(pack); change(altered); assert.throws(() => validateCareInventory(altered, date)); }
});

test("request bounds reject missing, noninteger and mismatched child inputs", () => {
  for (const request of [{child_ages:null}, {potty_trained:null}, {minutes:null}, {child_ages:[]}, {child_ages:[18]}, {child_ages:[1.5]}, {child_ages:["2"]}, {child_ages:[NaN]}, {potty_trained:[true]}, {potty_trained:[true,"no"]}, {minutes:0}, {minutes:1441}, {minutes:"90"}, {unknown:true}]) assert.throws(() => screenCareInventory(pack, request, date));
});

test("coercive evidence and sparse programmatic arrays fail closed", () => {
  const changes = [
    p => p.sources.finest.url = [p.sources.finest.url],
    p => p.records[0].budget.currency = ["USD"],
    p => p.records[0].budget.retained_room_observation.currency = ["USD"],
    p => p.records[0].budget.retained_room_observation.source_url = [p.records[0].budget.retained_room_observation.source_url],
    p => p.records[0].services[0].source_ids = [["finest"]],
    p => p.records[0].services[0].source_ids = ["finest", ["finest"]],
    p => p.records[0].services[0].source_ids = new Array(1),
    p => p.scenario.child_ages = new Array(2),
    p => p.records[0].missing = new Array(1),
    p => p.research_limits = new Array(1)
  ];
  for (const change of changes) {
    const altered = structuredClone(pack); change(altered);
    assert.throws(() => validateCareInventory(altered, date));
    assert.throws(() => careComparisonCsv(altered, {}, date));
  }
  for (const request of [{child_ages:new Array(2)}, {child_ages:[2,,7]}, {potty_trained:new Array(2)}, {potty_trained:[true,]}]) {
    assert.throws(() => screenCareInventory(pack, request, date));
    assert.throws(() => careComparisonCsv(pack, request, date));
  }
});

test("care screens reject iterator-supplied ages and hidden admission evidence", () => {
  for (const ages of [[undefined,undefined],new Array(2),[2,8]]) {
    ages[Symbol.iterator] = function* () { yield* [2,7]; };
    assert.throws(() => screenCareInventory(pack,{child_ages:ages},date));
    assert.throws(() => careComparisonCsv(pack,{child_ages:ages},date));
  }
  const training = new Array(2); training[Symbol.iterator] = function* () {};
  assert.throws(() => screenCareInventory(pack,{potty_trained:training},date));
  const altered = structuredClone(pack);
  altered.records[0].services[0].source_ids = new Array(1);
  altered.records[0].services[0].source_ids[Symbol.iterator] = function* () { yield "finest"; };
  assert.throws(() => validateCareInventory(altered,date));
  for (const field of ["records","services"]) {
    const p = structuredClone(pack), values = field === "services" ? p.records[0].services : p.records;
    values[Symbol.iterator] = function* () {};
    assert.throws(() => validateCareInventory(p,date));
    assert.throws(() => screenCareInventory(p,{},date));
  }
});

test("CSV retains all 22 property-child-service rows and dated budget/source context", () => {
  const csv = careComparisonCsv(pack, {}, date);
  const lines = csv.trimEnd().split("\n");
  assert.equal(lines.length, 23);
  for (const line of lines) assert.equal((line.match(/"(?:[^"]|"")*"(?=,|$)/g) ?? []).length, 32);
  assert.match(csv, /Parents|parents-dining-elsewhere-described/);
  assert.match(csv, /Breakfast07:00-11:00/);
  assert.match(csv, /published-included-eligible-program/);
  assert.match(csv, /843/);
  assert.match(csv, /2026-09-27/);
  assert.match(csv, /8191total\/displayed1638night/);
  for (const source of Object.values(pack.sources)) assert.ok(csv.includes(source.url));
  const altered = structuredClone(pack); altered.records[0].property = "=1+1\nInjected";
  assert.match(careComparisonCsv(altered, {}, date), /"'=1\+1 Injected"/);
});

test("CLI prints only read-only JSON/CSV and rejects duplicate or unsupported options", () => {
  const parsed = parseCareOptions([packPath, "--date", date, "--child-ages", "3,8", "--potty-trained", "yes,unknown", "--minutes", "45", "--format", "csv"]);
  assert.deepEqual(parsed.request, {child_ages:[3,8],potty_trained:[true,null],minutes:45});
  const output = JSON.parse(execFileSync(process.execPath, [cli, packPath, "--date", date], {encoding:"utf8"}));
  assert.deepEqual(output, screenCareInventory(pack, {}, date));
  assert.equal(execFileSync(process.execPath, [cli, packPath, "--date", date, "--format", "csv"], {encoding:"utf8"}), careComparisonCsv(pack, {}, date));
  for (const args of [["--date",date,"--date",date], ["--output","site/example.csv"], ["--child-ages","2,"], ["--minutes","-1"], ["--format","html"], ["--potty-trained","maybe"], ["--minutes"]]) {
    assert.throws(() => parseCareOptions([packPath, ...args]));
    assert.throws(() => execFileSync(process.execPath, [cli, packPath, ...args], {stdio:"pipe"}));
  }
});
