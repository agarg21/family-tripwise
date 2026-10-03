import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { screenRoomPack, validateRoomPack } from "./family-room-task.mjs";
import { roomComparisonCsv } from "./family-room-comparison.mjs";

const pack = JSON.parse(readFileSync(new URL("../docs/research/orlando-room-configurations-2026-10-03.json", import.meta.url)));
const audit = JSON.parse(readFileSync(new URL("../docs/research/orlando-four-seasons-room-task-2026-10-03.json", import.meta.url)));
const prices = JSON.parse(readFileSync(new URL("../docs/research/orlando-four-seasons-price-observation-2026-10-03.json", import.meta.url)));
const copy = () => JSON.parse(JSON.stringify(pack));
const date = "2026-10-03";

test("Orlando six-person task excludes every recorded base, not every expanded property option", () => {
  assert.deepEqual(validateRoomPack(pack), []);
  const rooms = screenRoomPack(pack, pack.scenario, date, prices);
  assert.equal(rooms.length, 3);
  assert.ok(rooms.every(room => room.screening === "OUTSIDE_PUBLISHED_LIMIT"));
  assert.ok(rooms.every(room => room.price.status === "not-observed" && room.price.amount === null));
  assert.equal(pack.scenario.child_ages.length, 4);
  assert.equal(audit.expanded_configuration.combined_capacity, null);
  assert.equal(audit.expanded_configuration.exact_party_acceptance, null);
});

test("Adult-only alternatives cannot lend spare places to children", () => {
  const adults = screenRoomPack(pack, { adults: 3, child_ages: [] }, date);
  assert.deepEqual(adults.map(room => room.screening), ["WITHIN_PUBLISHED_CAPACITY", "WITHIN_PUBLISHED_CAPACITY", "OUTSIDE_PUBLISHED_LIMIT"]);
  const withChild = screenRoomPack(pack, { adults: 3, child_ages: [4] }, date);
  assert.ok(withChild.every(room => room.screening === "OUTSIDE_PUBLISHED_LIMIT"));
  const royalChild = screenRoomPack(pack, { adults: 1, child_ages: [4] }, date)[2];
  assert.equal(royalChild.screening, "OUTSIDE_PUBLISHED_LIMIT");
});

test("Two-child alternative screens only the recorded age domain; it is not a booking guarantee", () => {
  const rooms = screenRoomPack(pack, { adults: 2, child_ages: [4, 17] }, date);
  assert.deepEqual(rooms.map(room => room.screening), ["WITHIN_PUBLISHED_CAPACITY", "WITHIN_PUBLISHED_CAPACITY", "OUTSIDE_PUBLISHED_LIMIT"]);
  assert.throws(() => screenRoomPack(pack, { adults: 2, child_ages: [4, 18] }, date), /Invalid party/);
  assert.ok(rooms.every(room => room.limitation.includes("not availability")));
});

test("Explicit zero child limit is valid, but negative/fractional child and zero adult limits fail", () => {
  for (const invalid of [-1, 0.5, "0", undefined]) {
    const changed = copy();
    changed.records[0].configurations[0].max_children = invalid;
    assert.ok(validateRoomPack(changed).some(error => error.includes("invalid capacity")));
  }
  const changed = copy();
  changed.records[0].configurations[0].max_adults = 0;
  assert.ok(validateRoomPack(changed).some(error => error.includes("invalid capacity")));
  const infant = copy();
  infant.records[0].configurations[0].infant_extension = { places: 1, age_lt: 2 };
  infant.records[0].configurations[0].conditions = ["Infant-only extension"];
  assert.ok(validateRoomPack(infant).some(error => error.includes("invalid infant extension")));
});

test("Dated Orlando export preserves requested party/stay, exclusions and unpriced fee basis", () => {
  const csv = roomComparisonCsv(pack, pack.scenario, date, prices);
  assert.equal(csv.trim().split("\n").length, 4);
  assert.equal((csv.match(/OUTSIDE_PUBLISHED_LIMIT/g) ?? []).length, 3);
  assert.equal((csv.match(/not-observed/g) ?? []).length, 3);
  assert.match(csv, /2026-11-08/);
  assert.match(csv, /2026-11-13/);
  assert.match(csv, /4,8,12,15/);
  assert.match(csv, /configuration\/night/);
  assert.match(csv, /Unknown/);
  assert.match(csv, /exclusion-control corpus/);
  assert.equal(roomComparisonCsv(pack, pack.scenario, date, prices, { kitchen: "published" }).trim().split("\n").length, 1);
});

test("Stale source state takes precedence and no empty quote is zero or sold out", () => {
  assert.ok(screenRoomPack(pack, pack.scenario, "2026-11-03", prices).every(room => room.screening === "RECHECK_SOURCE"));
  assert.throws(() => screenRoomPack(pack, pack.scenario, "2026-10-02", prices), /Invalid party/);
  assert.deepEqual(prices, []);
  assert.equal(audit.booking_ui.submitted_search, false);
  assert.equal(audit.booking_ui.exact_party_entered, false);
  assert.equal(audit.booking_ui.requested_stay_entered, false);
  assert.equal(audit.booking_ui.cookie_legal_agreement_accepted, false);
  assert.equal(audit.expanded_configuration.nightly_amount, null);
});
