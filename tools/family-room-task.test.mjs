import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { currentEasternDate, screenRoomPack, validateRoomPack } from "./family-room-task.mjs";

const pack = JSON.parse(readFileSync(new URL("../docs/research/london-room-configurations-2026-09-30.json", import.meta.url)));
const clone = () => structuredClone(pack);
const row = (rows, id) => rows.find(r => r.id === id);
const historicalScreen = (p, party = p.scenario, date = "2026-09-30") => screenRoomPack(p, party, date);

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
