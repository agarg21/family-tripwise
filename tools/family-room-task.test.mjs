import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { currentEasternDate, screenRoomPack, validateRoomPack } from "./family-room-task.mjs";
import { comparisonHeadings, roomComparisonCsv } from "./family-room-comparison.mjs";

const pack = JSON.parse(readFileSync(new URL("../docs/research/london-room-configurations-2026-09-30.json", import.meta.url)));
const clone = () => structuredClone(pack);
const row = (rows, id) => rows.find(r => r.id === id);
const historicalScreen = (p, party = p.scenario, date = "2026-09-30") => screenRoomPack(p, party, date);

test("sparse child ages and coercive provenance cannot produce room screening or CSV", () => {
  for (const ages of [new Array(3), [4,,12], [4,undefined,12]]) {
    const party = {...pack.scenario, child_ages:ages};
    assert.throws(() => historicalScreen(pack, party));
    assert.throws(() => roomComparisonCsv(pack, party, "2026-09-30"));
  }
  for (const mutate of [
    p => p.sources[Object.keys(p.sources)[0]].url = [p.sources[Object.keys(p.sources)[0]].url],
    p => p.records[0].source_id = [p.records[0].source_id],
    p => p.records[0].source_id = "toString",
    p => p.records[0].checks = new Array(1),
    p => p.records[0].conflicts = new Array(1),
    p => p.records[0].configurations[0].conditions = new Array(1),
    p => p.records[0].price.missing_basis = new Array(1)
  ]) {
    const altered = clone(); mutate(altered);
    assert.ok(validateRoomPack(altered).length);
    assert.throws(() => historicalScreen(altered));
    assert.throws(() => roomComparisonCsv(altered, altered.scenario, "2026-09-30"));
  }
  assert.doesNotThrow(() => historicalScreen(pack, {...pack.scenario, child_ages:[]}));
});

test("custom iterators cannot hide stored ages or provenance", () => {
  for (const ages of [[undefined,undefined,undefined], new Array(3), [4,8,11]]) {
    ages[Symbol.iterator] = function* () { yield* [4,8,12]; };
    const party = {...pack.scenario,child_ages:ages};
    assert.throws(() => historicalScreen(pack,party));
    assert.throws(() => roomComparisonCsv(pack,party,"2026-09-30"));
  }
  const altered = clone();
  altered.records[0].checks = new Array(1);
  altered.records[0].checks[Symbol.iterator] = function* () {};
  assert.ok(validateRoomPack(altered).length);
  assert.throws(() => historicalScreen(altered));
  const badSource = clone(); badSource.sources[badSource.records[0].source_id].url = [badSource.sources[badSource.records[0].source_id].url];
  assert.ok(validateRoomPack(badSource).length);
  assert.throws(() => historicalScreen(badSource));
  for (const field of ["records","configurations","offer_observations"]) {
    const p = clone(), values = field === "configurations" ? p.records[0].configurations : p[field];
    values[Symbol.iterator] = function* () {};
    assert.ok(validateRoomPack(p).length);
    assert.throws(() => historicalScreen(p));
  }
});

test("Boston portable comparison retains three dated plans and two explicit budget gaps", () => {
  const boston = JSON.parse(readFileSync(new URL("../docs/research/boston-room-configurations-2026-10-01.json", import.meta.url)));
  const samples = JSON.parse(readFileSync(new URL("../docs/research/boston-park-plaza-price-observation-2026-10-01.json", import.meta.url)));
  const before = JSON.stringify([boston, samples]);
  const cells = roomComparisonCsv(boston, boston.scenario, "2026-10-01", samples).trimEnd().split("\n")
    .map(line => [...line.matchAll(/"((?:[^"]|"")*)"(?:,|$)/g)].map(m => m[1].replaceAll('""', '"')));
  assert.deepEqual(cells[0], comparisonHeadings);
  const rows = cells.slice(1);
  const value = (r, h) => r[comparisonHeadings.indexOf(h)];
  assert.equal(rows.length, 5);
  assert.ok(rows.every(r => r.length === 35 && value(r, "Currency") === "USD"));
  const breakfast = rows.find(r => value(r, "Public rate plan") === "Breakfast Included");
  assert.equal(value(breakfast, "Nightly equivalent"), "528.68");
  assert.equal(value(breakfast, "Displayed stay amount"), "2643.42");
  assert.match(value(breakfast, "Meals"), /ages8\/12 not/);
  assert.match(value(breakfast, "Capacity conditions"), /fifth sleeping place/);
  assert.match(value(breakfast, "Fee and tax basis"), /included once/);
  const unpriced = rows.filter(r => value(r, "Public rate plan") === "Unpriced");
  assert.equal(unpriced.length, 2);
  assert.ok(unpriced.every(r => value(r, "Nightly equivalent") === "" && value(r, "Price observed") === ""));
  assert.equal(JSON.stringify([boston, samples]), before);
});

test("Boston public plans preserve mandatory fee, meal age limits and conditional sleeping place", () => {
  const packPath = fileURLToPath(new URL("../docs/research/boston-room-configurations-2026-10-01.json", import.meta.url));
  const pricePath = fileURLToPath(new URL("../docs/research/boston-park-plaza-price-observation-2026-10-01.json", import.meta.url));
  const boston = JSON.parse(readFileSync(packPath, "utf8"));
  const samples = JSON.parse(readFileSync(pricePath, "utf8"));
  const before = JSON.stringify([boston, samples]);
  const rows = screenRoomPack(boston, boston.scenario, "2026-10-01", samples);
  const r = row(rows, "boston-park-plaza-deluxe-double");
  assert.deepEqual(JSON.parse(execFileSync(process.execPath, [fileURLToPath(new URL("./family-room-task.mjs", import.meta.url)), packPath, "2026-10-01", pricePath], {encoding:"utf8"})), rows);
  assert.equal(r.screening, "CONDITIONAL_PUBLISHED_CAPACITY");
  assert.match(r.conditions[0], /fifth sleeping place/);
  assert.equal(r.price.age_input_mode, "provider-age-band-counts");
  assert.deepEqual(r.price.rates.map(v => v.nightly_average), [372.10, 444.84, 528.68]);
  assert.equal(r.price.amount, null);
  assert.match(r.price.fee_basis, /included once/);
  assert.match(r.price.rates[2].meals, /ages8\/12 not/);
  assert.match(r.price.rates[1].cancellation, /November5,2026/);
  assert.match(r.price.deposit_basis, /not an additional hotel charge/);
  assert.equal(rows.filter(v => v.price.status === "dated-stay-samples").length, 1);
  assert.equal(row(rows, "boston-four-seasons-plaza").price.amount, null);
  assert.equal(row(rows, "boston-langham-club-two-bedroom").price.amount, null);
  assert.equal(JSON.stringify([boston, samples]), before);
});

test("Boston sample cannot carry across ages, stay, stale dates or membership-only rates", () => {
  const boston = JSON.parse(readFileSync(new URL("../docs/research/boston-room-configurations-2026-10-01.json", import.meta.url)));
  const samples = JSON.parse(readFileSync(new URL("../docs/research/boston-park-plaza-price-observation-2026-10-01.json", import.meta.url)));
  for (const party of [{...boston.scenario, child_ages:[4,8,13]}, {...boston.scenario, stay:{arrival:"2026-11-09",departure:"2026-11-14"}}])
    assert.equal(row(screenRoomPack(boston, party, "2026-10-01", samples), "boston-park-plaza-deluxe-double").price.status, "not-observed");
  assert.equal(row(screenRoomPack(boston, boston.scenario, "2026-10-16", samples), "boston-park-plaza-deluxe-double").price.status, "historical-dated-stay-samples");
  const member = structuredClone(samples);
  member[0].rates.push({plan:"Member starting rate",eligibility:"membership-required",stay_amount:100,meals:"unknown",cancellation:"unknown"});
  assert.equal(row(screenRoomPack(boston, boston.scenario, "2026-10-01", member), "boston-park-plaza-deluxe-double").price.amount_from, 372.10);
});

test("Boston partial capacity corpus is conditional and does not fabricate budget or omitted categories", () => {
  const path = fileURLToPath(new URL("../docs/research/boston-room-configurations-2026-10-01.json", import.meta.url));
  const boston = JSON.parse(readFileSync(path, "utf8"));
  const before = JSON.stringify(boston);
  assert.deepEqual(validateRoomPack(boston), []);
  const rows = screenRoomPack(boston, boston.scenario, "2026-10-01");
  assert.equal(rows.length, 3);
  assert.ok(rows.every(r => r.screening === "CONDITIONAL_PUBLISHED_CAPACITY"));
  assert.ok(rows.every(r => r.price.amount === null && r.price.currency === "USD" && r.kitchen === "not-established"));
  assert.ok(rows.every(r => r.conditions.length > 0 && r.checked_on === "2026-10-01"));
  assert.match(row(rows, "boston-park-plaza-deluxe-double").conditions[0], /fifth sleeping place/);
  assert.match(row(rows, "boston-four-seasons-plaza").conditions[0], /crib/);
  assert.deepEqual(JSON.parse(execFileSync(process.execPath, [fileURLToPath(new URL("./family-room-task.mjs", import.meta.url)), path, "2026-10-01"], {encoding:"utf8"})), rows);
  assert.equal(JSON.stringify(boston), before);
});

test("Boston does not merge adult-only and child configurations or silently renew old sources", () => {
  const boston = JSON.parse(readFileSync(new URL("../docs/research/boston-room-configurations-2026-10-01.json", import.meta.url)));
  const six = screenRoomPack(boston, {adults:2,child_ages:[4,8,12,16]}, "2026-10-01");
  assert.equal(row(six, "boston-park-plaza-deluxe-double").screening, "OUTSIDE_PUBLISHED_LIMIT");
  assert.equal(row(six, "boston-four-seasons-plaza").screening, "CONDITIONAL_PUBLISHED_CAPACITY");
  assert.equal(row(screenRoomPack(boston, {adults:3,child_ages:[4,8]}, "2026-10-01"), "boston-four-seasons-plaza").screening, "OUTSIDE_PUBLISHED_LIMIT");
  assert.ok(screenRoomPack(boston, {adults:2,child_ages:[1,4,8,12,16]}, "2026-10-01").every(r => r.screening === "OUTSIDE_PUBLISHED_LIMIT"));
  assert.ok(screenRoomPack(boston, boston.scenario, "2026-11-01").every(r => r.screening === "RECHECK_SOURCE" && r.checked_on === "2026-10-01"));
});

test("six current official categories validate with exact price gaps", () => {
  assert.deepEqual(validateRoomPack(pack), []);
  assert.equal(pack.records.length, 6);
  assert.equal(Object.keys(pack.sources).length, 7);
  assert.ok(pack.records.every(r => r.price.amount === null));
});
test("five older-child task separates fixed, conditional and infant-only capacity", () => {
  const rows = historicalScreen(pack);
  assert.equal(row(rows, "mitre-family-five").screening, "WITHIN_PUBLISHED_CAPACITY");
  for (const id of ["marlin-queen-street-two-bedroom", "montague-guvnor", "mandarin-family-room", "kensington-luxury-plus-cosy"])
    assert.equal(row(rows, id).screening, "CONDITIONAL_PUBLISHED_CAPACITY");
  assert.equal(row(rows, "bloomsbury-family-room").screening, "OUTSIDE_PUBLISHED_LIMIT");
});
test("infant extension requires under two and preserves cot request", () => {
  for (const ages of [[1, 4, 8], [8, 1, 4]]) {
    const r = row(historicalScreen(pack, { adults: 2, child_ages: ages }), "bloomsbury-family-room");
    assert.equal(r.screening, "CONDITIONAL_PUBLISHED_CAPACITY");
    assert.deepEqual(r.conditions, ["confirm cot"]);
  }
  assert.equal(row(historicalScreen(pack, { adults: 2, child_ages: [2, 4, 8] }), "bloomsbury-family-room").screening, "OUTSIDE_PUBLISHED_LIMIT");
});
test("four-person base apartment does not require paid extension", () => {
  const r = row(historicalScreen(pack, { adults: 2, child_ages: [4, 8] }), "marlin-queen-street-two-bedroom");
  assert.equal(r.screening, "WITHIN_PUBLISHED_CAPACITY");
  assert.deepEqual(r.conditions, []);
});
test("excess adults/children cannot evade declared limits with infant", () => {
  for (const party of [{ adults: 3, child_ages: [1, 8] }, { adults: 2, child_ages: [1, 1, 4, 8] }])
    assert.equal(row(historicalScreen(pack, party), "bloomsbury-family-room").screening, "OUTSIDE_PUBLISHED_LIMIT");
});
test("detached from-offer and unresolved fee conflict never become a room price", () => {
  const r = row(historicalScreen(pack), "kensington-luxury-plus-cosy");
  assert.equal(pack.offer_observations[0].amount_from, 555);
  assert.equal(r.price.amount, null);
  assert.match(r.conflicts[0], /GBP70/);
  assert.equal(r.connection, "requested-separate-room");
});
test("current Eastern day is default; historical date must be explicit", () => {
  const p = clone();
  p.checked_on = "2000-01-01";
  for (const source of Object.values(p.sources)) source.checked_on = p.checked_on;
  assert.ok(screenRoomPack(p).every(r => r.screening === "RECHECK_SOURCE" && r.screened_on === currentEasternDate()));
  assert.equal(screenRoomPack(p, p.scenario, "2000-01-01")[0].screening, "WITHIN_PUBLISHED_CAPACITY");
  assert.equal(currentEasternDate(new Date("2026-10-01T02:00:00Z")), "2026-09-30");
  assert.equal(currentEasternDate(new Date("2026-01-01T04:00:00Z")), "2025-12-31");
});
test("smaller-party configurations do not inherit fifth-place bed requirements", () => {
  const rows = historicalScreen(pack, { adults: 2, child_ages: [4, 8] });
  for (const id of ["montague-guvnor", "mandarin-family-room"]) {
    const r = row(rows, id);
    assert.equal(r.screening, "DERIVED_CONFIGURATION_REQUIRES_CONFIRMATION");
    assert.equal(r.capacity_evidence_class, "EDITORIAL_INTERPRETATION");
    assert.ok(r.conditions.every(value => !/requested sofa|additional rollaway/.test(value)));
  }
  const r = row(historicalScreen(pack, { adults: 2, child_ages: [8] }), "kensington-luxury-plus-cosy");
  assert.equal(r.screening, "CONDITIONAL_PUBLISHED_CAPACITY");
  assert.match(r.conditions[0], /rollaway.*conflicting/);
});
test("stale sources require recheck and never renew observation dates", () => {
  assert.ok(screenRoomPack(pack, pack.scenario, "2026-10-31").every(r => r.screening === "RECHECK_SOURCE"));
  assert.notEqual(screenRoomPack(pack, pack.scenario, "2026-10-30")[0].screening, "RECHECK_SOURCE");
  assert.ok(screenRoomPack(pack, pack.scenario, "2026-10-31").every(r => r.checked_on === "2026-09-30"));
});
test("duplicate IDs, source/date/URL and unproven prices fail closed", () => {
  for (const mutate of [
    p => p.records[1].id = p.records[0].id,
    p => p.sources.s1.checked_on = "2026-10-01",
    p => p.sources.s1.url += "?token=secret",
    p => p.records[0].source_id = "missing",
    p => p.records[0].price.amount = 555,
    p => p.records[4].configurations[1].infant_extension.age_lt = 0
  ]) { const p = clone(); mutate(p); assert.ok(validateRoomPack(p).length); assert.throws(() => screenRoomPack(p)); }
});
test("invalid party/date inputs are rejected without mutating evidence", () => {
  const before = JSON.stringify(pack);
  for (const party of [{ adults: 0, child_ages: [] }, { adults: 2, child_ages: [-1] }, { adults: 2, child_ages: [1.5] }])
    assert.throws(() => screenRoomPack(pack, party));
  assert.throws(() => screenRoomPack(pack, pack.scenario, "2026-09-29"));
  assert.equal(JSON.stringify(pack), before);
});

test("optional separate price inputs enrich only the exact task without renewing category evidence", () => {
  const samples = JSON.parse(readFileSync(new URL("../docs/research/london-mitre-price-observation-2026-09-30.json", import.meta.url)));
  const rows = screenRoomPack(pack, pack.scenario, "2026-09-30", samples);
  assert.equal(row(rows, "mitre-family-five").price.amount_from, 260);
  assert.equal(rows.filter(r => r.price.status === "dated-stay-samples").length, 1);
  assert.ok(rows.every(r => r.checked_on === "2026-09-30"));
  assert.equal(pack.records[0].price.status, "not-observed");
  assert.equal(screenRoomPack(pack, pack.scenario, "2026-09-30")[0].price.status, "not-observed");
});

const pricePaths = ["mitre", "marlin", "montague"].map(name =>
  fileURLToPath(new URL(`../docs/research/london-${name}-price-observation-2026-09-30.json`, import.meta.url)));
const sampleArrays = pricePaths.map(path => JSON.parse(readFileSync(path, "utf8")));
const taskCli = fileURLToPath(new URL("./family-room-task.mjs", import.meta.url));
const packPath = fileURLToPath(new URL("../docs/research/london-room-configurations-2026-09-30.json", import.meta.url));
const dcPath = fileURLToPath(new URL("../docs/research/washington-dc-room-configurations-2026-09-30.json", import.meta.url));
const dcPricePath = fileURLToPath(new URL("../docs/research/washington-dc-embassy-price-observation-2026-09-30.json", import.meta.url));

test("three DC dated public observations retain unknown cutoffs and category baseline dates", () => {
  const dc = JSON.parse(readFileSync(dcPath, "utf8"));
  const paths = [dcPricePath, ...["homewood", "residence"].map(name => fileURLToPath(new URL(`../docs/research/washington-dc-${name}-price-observation-2026-09-30.json`, import.meta.url)))];
  const samples = paths.flatMap(path => JSON.parse(readFileSync(path, "utf8")));
  const before = JSON.stringify([dc, samples]);
  const rows = screenRoomPack(dc, dc.scenario, "2026-09-30", samples);
  assert.deepEqual(JSON.parse(execFileSync(process.execPath, [taskCli, dcPath, "2026-09-30", ...paths], { encoding: "utf8" })), rows);
  assert.equal(rows.filter(r => r.price.status === "dated-stay-samples").length, 3);
  const r = row(rows, "dc-residence-two-queen-onqq");
  assert.equal(r.checked_on, "2026-09-25");
  assert.equal(r.price.observed_on, "2026-09-30");
  assert.equal(r.price.amount_from, 433.65);
  assert.equal(r.price.engine_party.adult_from_age, null);
  assert.equal(row(rows, "dc-pendry-two-bedroom").price.amount, null);
  assert.equal(JSON.stringify([dc, samples]), before);
});

test("three dated samples preserve configuration conditions, payment basis and unpriced gaps", () => {
  const before = JSON.stringify([pack, sampleArrays]);
  const rows = screenRoomPack(pack, pack.scenario, "2026-09-30", sampleArrays.flat());
  assert.equal(rows.filter(r => r.price.status === "dated-stay-samples").length, 3);
  const m = row(rows, "montague-guvnor");
  assert.equal(m.price.amount_from, 1520);
  assert.equal(m.price.amount_to, 1580);
  assert.deepEqual(m.price.rates.map(r => r.stay_amount), [7600, 7900]);
  assert.equal(m.price.age_input_mode, "individual-ages");
  assert.equal(m.screening, "CONDITIONAL_PUBLISHED_CAPACITY");
  assert.match(m.conditions[0], /sofa/);
  assert.match(m.price.deposit_basis, /not an extra15%fee/);
  assert.match(m.price.observation_limitation, /does not|do not confirm/);
  assert.equal(row(rows, "bloomsbury-family-room").screening, "OUTSIDE_PUBLISHED_LIMIT");
  assert.equal(row(rows, "mandarin-family-room").price.amount, null);
  assert.equal(JSON.stringify([pack, sampleArrays]), before);
});
test("multi-file CLI has exact API parity and retains single-file compatibility", () => {
  const run = paths => JSON.parse(execFileSync(process.execPath, [taskCli, packPath, "2026-09-30", ...paths], { encoding: "utf8" }));
  assert.deepEqual(run(pricePaths), screenRoomPack(pack, pack.scenario, "2026-09-30", sampleArrays.flat()));
  assert.deepEqual(run(pricePaths.slice(0, 1)), screenRoomPack(pack, pack.scenario, "2026-09-30", sampleArrays[0]));
  assert.deepEqual(run([]), screenRoomPack(pack, pack.scenario, "2026-09-30"));
});
test("multi-file CLI rejects duplicate and non-array inputs rather than ignoring a file", () => {
  for (const inputs of [[...pricePaths, pricePaths[0]], [packPath], [pricePaths[0], packPath]]) {
    assert.throws(() => execFileSync(process.execPath, [taskCli, packPath, "2026-09-30", ...inputs],
      { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }));
  }
});

test("DC partial corpus and public price screen retain exact categories, original dates and currency", () => {
  const dc = JSON.parse(readFileSync(dcPath, "utf8"));
  const prices = JSON.parse(readFileSync(dcPricePath, "utf8"));
  const before = JSON.stringify([dc, prices]);
  assert.deepEqual(validateRoomPack(dc), []);
  assert.equal(dc.records.length, 4);
  const rows = screenRoomPack(dc, dc.scenario, "2026-09-30", prices);
  assert.deepEqual(JSON.parse(execFileSync(process.execPath, [taskCli, dcPath, "2026-09-30", dcPricePath], { encoding: "utf8" })), rows);
  assert.equal(rows.filter(r => r.price.status === "dated-stay-samples").length, 1);
  assert.equal(row(rows, "dc-embassy-deluxe-double").price.amount_from, 334.68);
  assert.equal(row(rows, "dc-homewood-two-queen").kitchen, "published-kitchen");
  assert.match(row(rows, "dc-homewood-two-queen").conflicts[0], /Premium.*sleeps4/);
  assert.equal(row(rows, "dc-pendry-two-bedroom").screening, "CONDITIONAL_PUBLISHED_CAPACITY");
  assert.equal(row(rows, "dc-residence-two-queen-onqq").checked_on, "2026-09-25");
  assert.ok(rows.every(r => r.next_checks.at(-1).includes("USD")));
  assert.equal(row(rows, "dc-homewood-two-queen").price.amount, null);
  assert.equal(JSON.stringify([dc, prices]), before);
  assert.equal(row(screenRoomPack(dc, { adults: 5, child_ages: [] }, "2026-09-30"), "dc-pendry-two-bedroom").screening, "OUTSIDE_PUBLISHED_LIMIT");
  assert.equal(row(screenRoomPack(dc, dc.scenario, "2026-10-26"), "dc-residence-two-queen-onqq").screening, "RECHECK_SOURCE");
});

test("USD expected currency is supported without admitting arbitrary currencies or prices", () => {
  const dc = JSON.parse(readFileSync(dcPath, "utf8"));
  for (const mutate of [p => p.records[0].price.currency = "EUR", p => p.records[0].price.amount = 334.68]) {
    const p = structuredClone(dc); mutate(p);
    assert.ok(validateRoomPack(p).length);
    assert.throws(() => screenRoomPack(p, p.scenario, "2026-09-30"));
  }
  assert.ok(historicalScreen(pack).every(r => r.next_checks.at(-1).includes("GBP")));
});

test("two DC public samples retain plan-specific cancellation, tax and exact-task limits", () => {
  const dc = JSON.parse(readFileSync(dcPath, "utf8"));
  const homewoodPath = fileURLToPath(new URL("../docs/research/washington-dc-homewood-price-observation-2026-09-30.json", import.meta.url));
  const samples = [dcPricePath, homewoodPath].flatMap(path => JSON.parse(readFileSync(path, "utf8")));
  const before = JSON.stringify([dc, samples]);
  const rows = screenRoomPack(dc, dc.scenario, "2026-09-30", samples);
  assert.deepEqual(JSON.parse(execFileSync(process.execPath, [taskCli, dcPath, "2026-09-30", dcPricePath, homewoodPath], { encoding: "utf8" })), rows);
  assert.equal(rows.filter(r => r.price.status === "dated-stay-samples").length, 2);
  const homewood = row(rows, "dc-homewood-two-queen");
  assert.equal(homewood.price.amount_from, 288.97);
  assert.equal(homewood.price.amount_to, 339.97);
  assert.deepEqual(homewood.price.rates.map(r => r.nightly_average), [288.97, 316.61, 339.97]);
  assert.match(homewood.price.rates[1].cancellation, /November1,2026/);
  assert.match(homewood.price.rates[2].cancellation, /November5,2026/);
  assert.match(row(rows, "dc-embassy-deluxe-double").price.rates[1].cancellation, /November7,2026/);
  assert.match(homewood.price.fee_basis, /225USDmember-only.*discarded/);
  assert.match(homewood.price.deposit_basis, /not an added stay fee/);
  assert.equal(homewood.price.age_input_mode, "provider-age-band-counts");
  assert.equal(row(rows, "dc-residence-two-queen-onqq").price.amount, null);
  for (const changed of [{ ...dc.scenario, child_ages: [4, 8, 13] }, { ...dc.scenario, stay: { arrival: "2026-11-09", departure: "2026-11-14" } }])
    assert.equal(row(screenRoomPack(dc, changed, "2026-09-30", samples), "dc-homewood-two-queen").price.status, "not-observed");
  assert.equal(row(screenRoomPack(dc, dc.scenario, "2026-10-15", samples), "dc-homewood-two-queen").price.status, "historical-dated-stay-samples");
  assert.equal(JSON.stringify([dc, samples]), before);
});
