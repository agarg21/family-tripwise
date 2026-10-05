import assert from "node:assert/strict";
import {execFileSync} from "node:child_process";
import {readFileSync} from "node:fs";
import {fileURLToPath} from "node:url";
import test from "node:test";
import {comparisonHeadings, roomComparisonCsv, roomComparisonsCsv} from "./family-room-comparison.mjs";
import {roomPriceForTask, validateRoomPrices} from "./family-room-price.mjs";

const path = n => fileURLToPath(new URL("../docs/research/" + n, import.meta.url));
const read = n => JSON.parse(readFileSync(path(n)));
const packPath = path("washington-dc-room-configurations-2026-09-30.json");
const pack = read("washington-dc-room-configurations-2026-09-30.json");
const pricePaths = ["embassy", "homewood", "residence"].map(n => path("washington-dc-" + n + "-price-observation-2026-09-30.json"));
const prices = pricePaths.flatMap(p => JSON.parse(readFileSync(p)));
const id = "dc-residence-two-queen-onqq";
const field = "cancellation_deadline_local_date";
const observation = p => p.find(o => o.record_id === id);
const rate = p => observation(p).rates[0];
const rows = s => s.trimEnd().split("\n").map(l => [...l.matchAll(/"((?:[^"]|"")*)"(?:,|$)/g)].map(m => m[1].replaceAll('""', '"')));
const scope = comparisonHeadings.indexOf("Research scope and limits");
const cell = (r, name) => r[comparisonHeadings.indexOf(name)];
const result = (date, p = prices, party = pack.scenario) => roomPriceForTask(p, pack, id, party, date);

test("retained exact-family quote exposes date-only warning without renewing price or terms", () => {
  const original = JSON.stringify([pack, prices]);
  const p = result("2026-10-04");
  assert.equal(p.observed_on, "2026-09-30");
  assert.equal(p.rates[0].stay_amount, 2168.27);
  assert.equal(p.rates[0].nightly_average, 433.65);
  assert.equal(p.rates[0].cancellation, rate(prices).cancellation);
  assert.equal(p.rates[0].cancellation_deadline_date_relation, "AFTER_RECORDED_LOCAL_DATE");
  assert.deepEqual(p.party, {adults:2, child_ages:[4,8,12]});
  assert.deepEqual(p.stay, {arrival:"2026-11-08", departure:"2026-11-13", nights:5});
  assert.equal(p.fee_basis, observation(prices).fee_basis);
  assert.equal(p.deposit_basis, observation(prices).deposit_basis);
  assert.equal(JSON.stringify([pack, prices]), original);
});

test("before, same and after dates all require a current terms recheck, never a policy pass", () => {
  for (const [date, relation] of [["2026-09-30", "BEFORE"], ["2026-10-01", "SAME"], ["2026-10-02", "AFTER"]]) {
    assert.equal(result(date).rates[0].cancellation_deadline_date_relation, relation + "_RECORDED_LOCAL_DATE");
    const row = rows(roomComparisonCsv(pack, pack.scenario, date, prices)).find(r => cell(r, "Nightly equivalent") === "433.65");
    assert.match(row[scope], new RegExp(relation + "_RECORDED_LOCAL_DATE"));
    assert.match(row[scope], /calendar dates only, no timezone conversion or current cancellability\/availability guarantee; recheck current rate terms/);
  }
});

test("only annotated scope cell changes; all seven rows and 34 budget-context cells remain", () => {
  const plain = structuredClone(prices); delete rate(plain)[field];
  const a = rows(roomComparisonCsv(pack, pack.scenario, "2026-10-04", plain));
  const b = rows(roomComparisonCsv(pack, pack.scenario, "2026-10-04", prices));
  assert.equal(b.length, 8); assert.equal(b[0].length, 35); assert.deepEqual(a[0], b[0]);
  let changed = 0;
  for (let i = 1; i < b.length; i++) {
    assert.deepEqual(a[i].filter((_, j) => j !== scope), b[i].filter((_, j) => j !== scope));
    if (a[i][scope] !== b[i][scope]) {
      changed++; assert.equal(cell(b[i], "Nightly equivalent"), "433.65");
      assert.ok(b[i][scope].startsWith(a[i][scope] + "; Cancellation deadline date check"));
    }
  }
  assert.equal(changed, 1);
  const without = result("2026-10-04", plain).rates[0];
  assert.equal(Object.hasOwn(without, field), false);
  assert.equal(Object.hasOwn(without, "cancellation_deadline_date_relation"), false);
});

test("historical prices remain historical and changed family or stay inherits no deadline", () => {
  const historical = result("2026-10-18");
  assert.equal(historical.status, "historical-dated-stay-samples");
  assert.equal(historical.rates[0].nightly_average, 433.65);
  assert.equal(historical.rates[0].cancellation_deadline_date_relation, "AFTER_RECORDED_LOCAL_DATE");
  for (const party of [{...pack.scenario, child_ages:[4,8,13]}, {...pack.scenario, stay:{arrival:"2026-11-09", departure:"2026-11-14"}}]) {
    assert.equal(result("2026-10-04", prices, party), null);
    assert.doesNotMatch(roomComparisonCsv(pack, party, "2026-10-04", prices), /Cancellation deadline date check/);
  }
});

test("malformed, inherited, accessor and hidden deadlines fail without invoking a getter", () => {
  const invalid = [null, undefined, "", "2026-02-29", "2026-13-01", "2026-10-01T23:59:00", 20261001];
  for (const value of invalid) {
    const p = structuredClone(prices); rate(p)[field] = value;
    assert.ok(validateRoomPrices(p, pack).some(e => /Cancellation deadline/.test(e)));
    assert.throws(() => roomComparisonCsv(pack, pack.scenario, "2026-10-04", p, {kitchen:"published"}), /Cancellation deadline/);
    assert.throws(() => roomComparisonsCsv([pack], pack.scenario, "2026-10-04", p), /Cancellation deadline/);
  }
  let invoked = 0;
  for (const mode of ["inherited", "getter", "nonenumerable", "membership"]) {
    const p = structuredClone(prices); const r = rate(p); delete r[field];
    if (mode === "inherited") Object.setPrototypeOf(r, {[field]:"2026-10-01"});
    else if (mode === "nonenumerable") Object.defineProperty(r, field, {value:"2026-10-01"});
    else Object.defineProperty(r, field, {enumerable:true, get(){invoked++; throw Error("Getter invoked");}});
    if (mode === "membership") r.eligibility = "membership-required";
    assert.throws(() => roomComparisonCsv(pack, pack.scenario, "2026-10-04", p, {capacity:"not-excluded"}), /Cancellation deadline/);
    assert.throws(() => roomComparisonsCsv([pack], pack.scenario, "2026-10-04", p), /Cancellation deadline/);
  }
  assert.equal(invoked, 0);
  const hidden = structuredClone(prices);
  hidden[0].rates[0][field] = "bad";
  assert.throws(() => roomComparisonCsv(pack, pack.scenario, "2026-10-04", hidden, {kitchen:"published"}), /Cancellation deadline/);
});

test("primitive malformed rates retain validator errors rather than throwing a type error", () => {
  for (const invalid of ["bad", 1, true, null, undefined]) {
    const p = structuredClone(prices); observation(p).rates = [invalid];
    assert.ok(validateRoomPrices(p, pack).some(e => /Invalid\/duplicate rate plan/.test(e)));
    assert.throws(() => roomComparisonCsv(pack, pack.scenario, "2026-10-04", p), /Invalid\/duplicate rate plan/);
  }
});

test("single and joined CLI/API exports agree and budget retains five age gaps, one above and one unpriced", () => {
  const filters = {budget:{currency:"USD", nightly_limit:350}};
  const csv = roomComparisonCsv(pack, pack.scenario, "2026-10-04", prices, filters);
  assert.equal(roomComparisonsCsv([pack], pack.scenario, "2026-10-04", prices, filters), csv);
  const cli = fileURLToPath(new URL("./family-room-comparison.mjs", import.meta.url));
  assert.equal(execFileSync(process.execPath, [cli, packPath, "--date", "2026-10-04", "--prices", ...pricePaths,
    "--nightly-budget", "350", "--budget-currency", "USD"], {encoding:"utf8"}), csv);
  const statuses = rows(csv).slice(1).map(r => r[scope].match(/Observed nightly budget ([A-Z_]+):/)[1]);
  assert.equal(statuses.filter(s => s === "UNKNOWN_AGE_BASIS").length, 5);
  assert.equal(statuses.filter(s => s === "ABOVE_OBSERVED_AMOUNT").length, 1);
  assert.equal(statuses.filter(s => s === "UNKNOWN_UNPRICED").length, 1);
});
