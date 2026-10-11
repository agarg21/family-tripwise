import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { comparisonHeadings, parseRoomComparisonOptions, roomComparisonCsv, roomComparisonsCsv } from "./family-room-comparison.mjs";
import { validateRoomPack } from "./family-room-task.mjs";
import { bostonPack, bostonPrices as publishedBostonPrices } from "./page-generation/boston-family-hotels-page.mjs";

const path = name => fileURLToPath(new URL(`../docs/research/${name}`, import.meta.url));
const read = name => JSON.parse(readFileSync(path(name)));
const dcPath = path("washington-dc-room-configurations-2026-09-30.json");
const dc = read("washington-dc-room-configurations-2026-09-30.json");
const boston = read("boston-room-configurations-2026-10-01.json");
const prices = ["homewood", "residence", "embassy"].flatMap(name => read(`washington-dc-${name}-price-observation-2026-09-30.json`));
const bostonPrices = read("boston-fenway-price-observation-2026-10-03.json");
const rows = csv => csv.trimEnd().split("\n").map(line => [...line.matchAll(/"((?:[^"]|"")*)"(?:,|$)/g)].map(match => match[1].replaceAll('""', '"')));
const v = (row, name) => row[comparisonHeadings.indexOf(name)];
const scope = comparisonHeadings.indexOf("Research scope and limits");
const filters = { kitchen: "published", capacity: "not-excluded", minimum_dining_seats: 5 };
const cli = fileURLToPath(new URL("./family-room-comparison.mjs", import.meta.url));

test("five-person kitchen task excludes dated four-seat tables but not unknown quantities", () => {
  const before = rows(roomComparisonCsv(dc, dc.scenario, "2026-10-10", prices, { kitchen: "published", capacity: "not-excluded" }));
  const current = roomComparisonCsv(dc, dc.scenario, "2026-10-10", prices, filters);
  const after = rows(current);
  assert.equal(before.length, 5); assert.equal(after.length, 4);
  assert.equal(after.some(row => v(row, "Hotel").startsWith("Residence")), false);
  for (const row of after.slice(1)) {
    assert.match(v(row, "Hotel"), /^Homewood/);
    assert.match(row[scope], /Dated dining seating NOT_ESTABLISHED/);
    assert.match(row[scope], /unknown and stale counts retained/);
    assert.match(row[scope], /not current equipment.*booking acceptance/);
    assert.equal(v(row, "Price observed"), "2026-09-30");
  }
  assert.deepEqual(after.slice(1).map(row => v(row, "Nightly equivalent")), ["288.97", "316.61", "339.97"]);
  assert.equal(rows(roomComparisonCsv(boston, boston.scenario, "2026-10-10", bostonPrices, filters)).length, 1);
  assert.equal(roomComparisonsCsv([dc], dc.scenario, "2026-10-10", prices, filters), current);
});

test("default exports are byteexact without seating metadata and inputs remain immutable", () => {
  const before = JSON.stringify([dc, boston, prices, filters]);
  for (const [pack, observations] of [[dc, prices], [boston, bostonPrices]]) {
    const legacy = structuredClone(pack);
    legacy.records.forEach(record => delete record.dining_seats);
    for (const date of ["2026-10-10", "2026-11-05"]) {
      assert.equal(roomComparisonCsv(pack, pack.scenario, date, observations), roomComparisonCsv(legacy, legacy.scenario, date, observations));
      assert.equal(roomComparisonsCsv([pack], pack.scenario, date, observations), roomComparisonCsv(legacy, legacy.scenario, date, observations));
    }
  }
  roomComparisonCsv(dc, dc.scenario, "2026-10-10", prices, filters);
  assert.equal(JSON.stringify([dc, boston, prices, filters]), before);
});

test("current Boston published-pack kitchen evidence remains retained with unknown dining seating", () => {
  const plain = rows(roomComparisonCsv(bostonPack, bostonPack.scenario, "2026-10-10", publishedBostonPrices, { kitchen: "published", capacity: "not-excluded" }));
  const current = rows(roomComparisonCsv(bostonPack, bostonPack.scenario, "2026-10-10", publishedBostonPrices, filters));
  assert.equal(plain.length, 3); assert.equal(current.length, 2);
  assert.match(v(current[1], "Hotel"), /^Four Seasons Hotel Boston$/);
  assert.equal(v(current[1], "Kitchen evidence"), "published-kitchen");
  assert.equal(v(current[1], "Category checked"), "2026-10-09");
  assert.equal(v(current[1], "Public rate plan"), "Unpriced");
  assert.match(current[1][scope], /Dated dining seating NOT_ESTABLISHED/);
  assert.equal(roomComparisonsCsv([bostonPack], bostonPack.scenario, "2026-10-10", publishedBostonPrices, filters), roomComparisonCsv(bostonPack, bostonPack.scenario, "2026-10-10", publishedBostonPrices, filters));
});

test("retained rows preserve every non-scope column and separate budget unknowns", () => {
  const plain = rows(roomComparisonCsv(dc, dc.scenario, "2026-10-10", prices));
  const current = rows(roomComparisonCsv(dc, dc.scenario, "2026-10-10", prices, { ...filters, budget: { currency: "USD", nightly_limit: 350 } }));
  for (const row of current.slice(1)) {
    const prior = plain.find(candidate => v(candidate, "Published category") === v(row, "Published category") && v(candidate, "Public rate plan") === v(row, "Public rate plan"));
    assert.deepEqual(row.filter((_, index) => index !== scope), prior.filter((_, index) => index !== scope));
    assert.match(row[scope], /UNKNOWN_AGE_BASIS/);
  }
});

test("count equality, unknown and stale evidence stay distinct without automatic renewal", () => {
  const atFour = rows(roomComparisonCsv(dc, dc.scenario, "2026-10-10", prices, { minimum_dining_seats: 4 }));
  const residence = atFour.find(row => v(row, "Hotel").startsWith("Residence"));
  assert.match(residence[scope], /AT_LEAST_REQUESTED_PUBLISHED_SEATS/);
  assert.match(residence[scope], /4 recorded seats; checked 2026-09-25/);
  assert.equal(rows(roomComparisonCsv(dc, dc.scenario, "2026-10-25", prices, filters)).some(row => v(row, "Hotel").startsWith("Residence")), false);
  const stale = rows(roomComparisonCsv(dc, dc.scenario, "2026-10-26", prices, filters)).find(row => v(row, "Hotel").startsWith("Residence"));
  assert.match(stale[scope], /Dated dining seating RECHECK_SOURCE/);
  assert.equal(v(stale, "Category checked"), "2026-09-25");
  assert.equal(v(stale, "Price observed"), "2026-09-30");
  const renewed = structuredClone(dc); renewed.checked_on = "2026-10-20"; renewed.sources.residence.checked_on = "2026-10-20";
  const row = rows(roomComparisonCsv(renewed, renewed.scenario, "2026-10-26", prices, filters)).find(row => v(row, "Hotel").startsWith("Residence"));
  assert.match(row[scope], /RECHECK_SOURCE.*checked 2026-09-25/);
});

test("changing to six people never transfers the prior five-person price or table rule", () => {
  const party = { ...boston.scenario, child_ages: [4, 8, 12, 15] };
  const current = rows(roomComparisonCsv(boston, party, "2026-10-10", bostonPrices, { capacity: "not-excluded", minimum_dining_seats: 6 }));
  assert.equal(current.length, 3);
  assert.ok(current.slice(1).every(row => v(row, "Public rate plan") === "Unpriced" && v(row, "Nightly equivalent") === ""));
  assert.ok(current.slice(1).every(row => /NOT_ESTABLISHED/.test(row[scope])));
  assert.ok(current.slice(1).every(row => /CONDITIONAL_PUBLISHED_CAPACITY/.test(v(row, "Capacity screen"))));
});

test("invalid seating facts fail closed even when other filters hide the category", () => {
  const original = structuredClone(dc.records.at(-1).dining_seats);
  const bad = [null, { ...original, count: -1 }, { ...original, count: 4.5 }, { ...original, count: Number.MAX_SAFE_INTEGER + 1 },
    { ...original, checked_on: "2026-09-26" }, { ...original, evidence_class: "EDITORIAL_INTERPRETATION" }, { ...original, basis: "" }, { ...original, extra: 1 }];
  const getter = { ...original }; Object.defineProperty(getter, "count", { get() { throw Error("Getter invoked"); }, enumerable: true }); bad.push(getter);
  for (const seating of bad) {
    const fixture = structuredClone(dc); fixture.records.at(-1).dining_seats = seating;
    assert.ok(validateRoomPack(fixture).some(error => /dining seating/.test(error)));
    assert.throws(() => roomComparisonCsv(fixture, fixture.scenario, "2026-10-10", prices, filters), /dining seating/);
    assert.throws(() => roomComparisonsCsv([fixture], fixture.scenario, "2026-10-10", prices, filters), /dining seating/);
  }
  for (const inherited of [false, true]) {
    const fixture = structuredClone(dc), record = fixture.records.at(-1);
    delete record.dining_seats;
    const owner = inherited ? Object.getPrototypeOf(Object.setPrototypeOf(record, {})) : record;
    Object.defineProperty(owner, "dining_seats", { get() { throw Error("Getter invoked"); }, enumerable: true });
    assert.ok(validateRoomPack(fixture).some(error => /dining seating/.test(error)));
    assert.throws(() => roomComparisonCsv(fixture, fixture.scenario, "2026-10-10", prices, filters), /dining seating/);
  }
});

test("API and CLI reject invalid dining constraints without executing getters or creating output", () => {
  for (const minimum_dining_seats of [0, -1, 2.5, NaN, Infinity, "5", null, undefined, Number.MAX_SAFE_INTEGER + 1])
    assert.throws(() => roomComparisonCsv(dc, dc.scenario, "2026-10-10", prices, { minimum_dining_seats }), /Minimum dining seats/);
  const getter = {}; Object.defineProperty(getter, "minimum_dining_seats", { get() { throw Error("Getter invoked"); } });
  assert.throws(() => roomComparisonCsv(dc, dc.scenario, "2026-10-10", prices, getter), /Minimum dining seats/);
  const root = mkdtempSync(join(tmpdir(), "ft-dining-"));
  try {
    for (const flags of [["--minimum-dining-seats"], ["--minimum-dining-seats", "0"], ["--minimum-dining-seats", "5.0"], ["--minimum-dining-seats", "5e0"], ["--minimum-dining-seats", "9007199254740992"], ["--minimum-dining-seats", "5", "--minimum-dining-seats", "6"]]) {
      const output = join(root, "missing", "result.csv");
      assert.throws(() => execFileSync(process.execPath, [cli, dcPath, ...flags, "--output", output], { stdio: "pipe" }));
      assert.equal(existsSync(join(root, "missing")), false);
    }
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test("CLI parity and saved summary retain input counts and overwrite guard", () => {
  const args = [dcPath, "--date", "2026-10-10", "--prices", ...["homewood", "residence", "embassy"].map(name => path(`washington-dc-${name}-price-observation-2026-09-30.json`)), "--kitchen", "published", "--capacity", "not-excluded", "--minimum-dining-seats", "5"];
  const expected = roomComparisonCsv(dc, dc.scenario, "2026-10-10", prices, filters);
  assert.equal(execFileSync(process.execPath, [cli, ...args], { encoding: "utf8" }), expected);
  assert.equal(parseRoomComparisonOptions([dcPath, "--minimum-dining-seats", "5"]).filters.minimum_dining_seats, 5);
  const root = mkdtempSync(join(tmpdir(), "ft-dining-save-"));
  try {
    const output = join(root, "result.csv");
    const summary = JSON.parse(execFileSync(process.execPath, [cli, ...args, "--output", output], { encoding: "utf8" }));
    assert.equal(summary.categories, 4); assert.equal(summary.categories_are_input_count, true);
    assert.equal(summary.filters.minimum_dining_seats, 5); assert.equal(summary.public_changes, false);
    assert.equal(readFileSync(output, "utf8"), expected);
    assert.throws(() => execFileSync(process.execPath, [cli, ...args, "--output", output], { stdio: "pipe" }));
    assert.equal(readFileSync(output, "utf8"), expected);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test("recorded dining counts are dated exact-category transcriptions, not capacity or equipment", () => {
  assert.deepEqual(dc.records.filter(record => record.dining_seats).map(record => [record.id, record.dining_seats.count, record.dining_seats.checked_on]), [["dc-residence-two-queen-onqq", 4, "2026-09-25"]]);
  assert.deepEqual(boston.records.filter(record => record.dining_seats).map(record => [record.id, record.dining_seats.count, record.dining_seats.checked_on]), [["boston-fenway-two-bedroom-tobt", 4, "2026-10-03"], ["boston-fenway-one-bedroom-onbt", 2, "2026-10-03"]]);
  assert.deepEqual(validateRoomPack(dc), []); assert.deepEqual(validateRoomPack(boston), []);
});
