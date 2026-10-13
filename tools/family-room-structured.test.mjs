import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdtempSync, readFileSync, rmSync, symlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { roomComparisonCsv, roomComparisonRecords, roomComparisonsCsv, roomComparisonsRecords } from "./family-room-comparison.mjs";
import { screenRoomPack } from "./family-room-task.mjs";

const path = name => fileURLToPath(new URL(`../docs/research/${name}.json`, import.meta.url));
const packPaths = ["london-six-person-comparison-2026-10-02", "london-aldgate-six-person-task-2026-10-02",
  "london-bridge-six-person-task-2026-10-02", "london-connected-six-person-task-2026-10-02",
  "london-canary-family-task-2026-10-02", "london-citadines-six-person-task-2026-10-03"].map(path);
const pricePaths = ["london-marlin-six-person-price-observation-2026-10-02", "london-limehouse-six-person-price-observation-2026-10-02",
  "london-aldgate-six-person-price-2026-10-02", "london-bridge-six-person-price-2026-10-02",
  "london-connected-six-person-price-2026-10-02", "london-canary-family-price-2026-10-02",
  "london-citadines-six-person-price-2026-10-03"].map(path);
const packs = packPaths.map(p => JSON.parse(readFileSync(p)));
const prices = pricePaths.flatMap(p => JSON.parse(readFileSync(p)));
const party = { adults: 2, child_ages: [4, 8, 12, 15], stay: { arrival: "2026-11-08", departure: "2026-11-13" } };
const date = "2026-10-13", cli = fileURLToPath(new URL("./family-room-comparison.mjs", import.meta.url));
const args = [packPaths[0], "--packs", ...packPaths.slice(1), "--date", date, "--adults", "2", "--child-ages", "4,8,12,15",
  "--arrival", party.stay.arrival, "--departure", party.stay.departure, "--prices", ...pricePaths];
const hash = text => createHash("sha256").update(text).digest("hex");
const output = (task = party, asOf = date, observations = prices, filters = {}) => roomComparisonsRecords(packs, task, asOf, observations, filters);

test("structured categories retain the exact existing screening and every nested public price field", () => {
  const result = output();
  assert.equal(result.length, 9);
  assert.equal(result.filter(r => r.price.rates).length, 7);
  assert.equal(result.reduce((n, r) => n + (r.price.rates?.length ?? 1), 0), 15);
  for (const pack of packs) {
    const observations = prices.filter(p => pack.records.some(r => r.id === p.record_id));
    const screened = screenRoomPack(pack, party, date, observations);
    for (const original of screened) {
      const actual = result.find(r => r.id === original.id);
      for (const [key, value] of Object.entries(original)) assert.deepEqual(actual[key], value, `${actual.id}.${key}`);
      assert.deepEqual(actual.configurations, pack.records.find(r => r.id === actual.id).configurations);
      assert.deepEqual(actual.task, party);
      assert.equal(actual.nights, 5);
      assert.ok(actual.research_scope.includes(pack.evidence_scope));
    }
    assert.deepEqual(roomComparisonRecords(pack, party, date, observations), result.filter(r => pack.records.some(p => p.id === r.id)));
  }
  const citadines = result.find(r => r.id === "citadines-trafalgar-two-bedroom");
  assert.deepEqual(citadines.price.rates.map(r => r.nightly_average), [527.2, 585.2]);
  assert.equal(citadines.price.observed_on, "2026-10-03");
  assert.equal(result.find(r => r.hotel.includes("Metropole")).price.status, "not-observed");
});

test("existing default and combined-filter CSV bytes match pre-edit golden outputs", () => {
  assert.equal(hash(roomComparisonsCsv(packs, party, date, prices)), "e169a6a9cbd58539f88dfd34077ddc0be2bdd53f5dc9015f2a7464629e972e0b");
  const filters = { kitchen: "published", capacity: "not-excluded", budget: { currency: "GBP", nightly_limit: 500 }, minimum_dining_seats: 6 };
  assert.equal(hash(roomComparisonsCsv(packs, party, date, prices, filters)), "397c74837c4a701ecdde23d6638eb558459dcebdf8e432416468fdf819487b13");
  const records = output(party, date, prices, filters);
  assert.ok(records.every(r => r.kitchen === "published-kitchen" && r.screening !== "OUTSIDE_PUBLISHED_LIMIT"));
  assert.ok(records.some(r => r.dining_seat_screen.status === "NOT_ESTABLISHED"));
  assert.ok(records.every(r => r.rate_checks.every(checks => checks.some(c => c.includes("Observed nightly budget")))));
});

test("changed party or stay cannot inherit a price, and stale sources retain historical context", () => {
  for (const changed of [{ ...party, adults: 3 }, { ...party, child_ages: [4, 8, 12, 16] },
    { ...party, stay: { arrival: "2026-11-09", departure: "2026-11-14" } }]) {
    assert.ok(output(changed).every(r => !r.price.rates));
  }
  assert.deepEqual(output({ ...party, child_ages: [15, 12, 8, 4] }).map(r => r.price), output().map(r => r.price));
  const historical = output(party, "2026-11-04");
  assert.ok(historical.every(r => r.screening === "RECHECK_SOURCE"));
  assert.ok(historical.filter(r => r.price.rates).every(r => r.price.status.startsWith("historical-")));
  assert.equal(historical.find(r => r.id === "citadines-trafalgar-two-bedroom").price.observed_on, "2026-10-03");
});

test("JSON snapshots are detached and calls never change original pack, price or task objects", () => {
  const before = JSON.stringify([packs, prices, party]), records = output();
  records[0].task.child_ages[0] = 17;
  records[0].configurations[0].maximum = 100;
  records[0].price.rates[0].nightly_average = 0;
  assert.equal(JSON.stringify([packs, prices, party]), before);
  assert.equal(output()[0].task.child_ages[0], 4);
  assert.notEqual(output()[0].price.rates[0].nightly_average, 0);
});

test("all joined ownership and observation gates fail closed before filtering", () => {
  assert.throws(() => roomComparisonsRecords([...packs, packs[0]], party, date, prices), /Duplicate record ownership/);
  const mixed = structuredClone(packs); mixed[1].destination = "Paris France";
  assert.throws(() => roomComparisonsRecords(mixed, party, date, prices), /same destination/);
  const invalid = structuredClone(prices); invalid.at(-1).currency = "USD";
  assert.throws(() => output(party, date, invalid, { kitchen: "published" }), /currency/);
  assert.throws(() => output(party, date, [...prices, { record_id: "unowned" }]), /Unowned/);
  assert.throws(() => roomComparisonsRecords(packs, null, date, prices), /explicit family/);
  assert.throws(() => output(party, date, prices, { capacity: "eligible" }), /filter/);
  assert.throws(() => output(party, "2026-10-02"), /Invalid party or screening date/);
});

test("single-pack structured filters and cancellation checks share the original CSV pipeline", () => {
  const selected = prices.filter(p => packs[0].records.some(r => r.id === p.record_id));
  const filters = { budget: { currency: "GBP", nightly_limit: 400 } };
  const result = roomComparisonRecords(packs[0], party, date, selected, filters);
  assert.equal(result.length, packs[0].records.length);
  assert.ok(result.every(r => r.rate_checks.length === r.price.rates.length));
  assert.ok(result.every(r => r.rate_checks.every(c => c.some(t => t.includes("not final all-fee budget")))));
  assert.ok(roomComparisonCsv(packs[0], party, date, selected, filters).includes(result[0].rate_checks[0][0]));
});

test("JSON CLI is opt-in and equals API; default CSV remains unchanged", () => {
  const result = JSON.parse(execFileSync(process.execPath, [cli, ...args, "--format", "json"], { encoding: "utf8" }));
  assert.deepEqual(result, { schema_version: 1, destination: "London UK", as_of: date, records: output() });
  assert.equal(execFileSync(process.execPath, [cli, ...args], { encoding: "utf8" }), roomComparisonsCsv(packs, party, date, prices));
  assert.equal(execFileSync(process.execPath, [cli, ...args, "--format", "csv"], { encoding: "utf8" }), roomComparisonsCsv(packs, party, date, prices));
});

test("JSON output remains exclusive, research-only and rejects late invalid options before any output", () => {
  const dir = mkdtempSync(join(tmpdir(), "ft-room-json-"));
  try {
    const file = join(dir, "result.json");
    execFileSync(process.execPath, [cli, ...args, "--format", "json", "--output", file], { stdio: "pipe" });
    assert.deepEqual(JSON.parse(readFileSync(file)).records, output());
    assert.throws(() => execFileSync(process.execPath, [cli, ...args, "--format", "json", "--output", file], { stdio: "pipe" }));
    const before = readFileSync(file, "utf8");
    symlinkSync(fileURLToPath(new URL("../site/", import.meta.url)), join(dir, "site"), "dir");
    assert.throws(() => execFileSync(process.execPath, [cli, ...args, "--format", "json", "--output", join(dir, "site", "must-not-write.json")], { stdio: "pipe" }));
    assert.equal(existsSync(join(dir, "site", "must-not-write.json")), false);
    for (const flags of [["--format"], ["--format", "html"], ["--format", "json", "--format", "csv"]]) {
      const dest = join(dir, "missing", "bad.json");
      assert.throws(() => execFileSync(process.execPath, [cli, ...args, ...flags, "--output", dest], { stdio: "pipe" }), e => {
        assert.equal(e.stdout.toString(), ""); return true;
      });
      assert.equal(existsSync(join(dir, "missing")), false);
    }
    assert.equal(readFileSync(file, "utf8"), before);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});
