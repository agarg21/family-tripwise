import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { screenRoomPack, validateRoomPack } from "./family-room-task.mjs";
import { validateRoomPrices } from "./family-room-price.mjs";
import { roomComparisonCsv, roomComparisonsCsv } from "./family-room-comparison.mjs";

const json = name => JSON.parse(readFileSync(new URL(`../docs/research/${name}`, import.meta.url)));
const pack = json("orlando-homewood-room-configurations-2026-10-03.json");
const audit = json("orlando-homewood-room-task-2026-10-03.json");
const prices = json("orlando-homewood-price-observation-2026-10-03.json");
const date = "2026-10-03";

test("Homewood exact cooking category has conditional published six-person capacity", () => {
  assert.deepEqual(validateRoomPack(pack), []);
  const room = screenRoomPack(pack, pack.scenario, date, prices)[0];
  assert.equal(room.screening, "CONDITIONAL_PUBLISHED_CAPACITY");
  assert.equal(room.kitchen, "published-kitchen");
  assert.equal(pack.records[0].configurations[0].maximum, 6);
  assert.equal(audit.sources[0].facts.place_settings, 4);
  assert.match(room.next_checks.join(" "), /four place settings/);
  const bigger = { ...pack.scenario, child_ages: [4, 8, 12, 15, 16] };
  assert.equal(screenRoomPack(pack, bigger, date, prices)[0].screening, "OUTSIDE_PUBLISHED_LIMIT");
});

test("Homewood raw family-count budget preserves date, ISO currency, arithmetic and extra-fee limits", () => {
  const q = audit.booking_observation;
  assert.equal(q.category, pack.records[0].category);
  assert.equal(q.nightly_room_amounts.reduce((a, b) => a + b, 0), q.room_subtotal);
  assert.equal(Math.round((q.room_subtotal + q.displayed_taxes) * 100), 95288);
  assert.equal(Math.round(q.displayed_stay_amount * 100 / q.nights) / 100, 190.58);
  assert.equal(q.currency, "USD");
  assert.equal(q.currency_evidence_class, "OBSERVED_ISO_CURRENCY");
  assert.deepEqual(q.requested_party.child_ages, pack.scenario.child_ages);
  assert.equal(q.arrival, pack.scenario.stay.arrival);
  assert.equal(q.departure, pack.scenario.stay.departure);
  assert.equal(q.persisted_party.adults, 2);
  assert.equal(q.persisted_party.children, 4);
  assert.match(q.fee_basis, /additional fees\/charges/);
  assert.match(q.cancellation, /23:59/);
});

test("Unknown child-band count quote is held, never normalized or borrowed from membership rates", () => {
  assert.deepEqual(prices, []);
  assert.deepEqual(validateRoomPrices(prices, pack), []);
  assert.equal(audit.booking_observation.normalized, false);
  assert.equal(audit.booking_observation.status, "HELD_AGE_BASIS");
  assert.equal(audit.booking_observation.persisted_party.child_ages, null);
  assert.equal(audit.booking_observation.persisted_party.child_age_to, null);
  assert.equal(audit.booking_observation.persisted_party.individual_ages_entered, false);
  const p = screenRoomPack(pack, pack.scenario, date, prices)[0].price;
  assert.equal(p.amount, null);
  assert.equal(p.status, "not-observed");
  assert.match(p.missing_basis.join(" "), /190.58/);
  assert.match(p.missing_basis.join(" "), /not an age-qualified numeric comparison/);
});

test("Pool, meal and source dependency do not imply waterpark, safety or booking assurance", () => {
  assert.equal(audit.sources[1].facts.pool, "outdoor");
  assert.equal(audit.sources[1].facts.self_parking.selected, false);
  assert.equal(audit.dependency.attempts, 1);
  assert.equal(audit.dependency.workaround, false);
  assert.match(audit.dependency.next_check, /changed source\/tool state/);
  assert.match(pack.records[0].checks.join(" "), /no waterpark\/lazy-river/);
  assert.match(screenRoomPack(pack, pack.scenario, date)[0].limitation, /not availability/);
});

test("Dated cooking category expires independently of build date and held numeric quote", () => {
  const room = screenRoomPack(pack, pack.scenario, "2026-11-03", prices)[0];
  assert.equal(room.screening, "RECHECK_SOURCE");
  assert.equal(room.checked_on, date);
  assert.equal(room.price.amount, null);
  assert.throws(() => screenRoomPack(pack, pack.scenario, "2026-10-02"));
});

test("Joined and kitchen-filtered exports retain held quote context without priced numeric columns", () => {
  const four = json("orlando-room-configurations-2026-10-03.json");
  const cabana = json("orlando-cabana-room-configurations-2026-10-03.json");
  const cp = json("orlando-cabana-price-observation-2026-10-03.json");
  const csv = roomComparisonsCsv([four, cabana, pack], pack.scenario, date, cp);
  assert.equal(csv.trim().split("\n").length, 7);
  assert.equal((csv.match(/OUTSIDE_PUBLISHED_LIMIT/g) ?? []).length, 3);
  assert.equal((csv.match(/dated-count-only-stay-samples/g) ?? []).length, 2);
  const kitchen = roomComparisonCsv(pack, pack.scenario, date, prices, { kitchen: "published" });
  assert.equal(kitchen.trim().split("\n").length, 2);
  for (const value of ["190.58", "952.88", "2026-11-08", "2026-11-13", "individual ages and child band unknown", "additional charges excluded/unknown", "not-observed", "Unpriced"]) assert.ok(kitchen.includes(value));
  assert.match(kitchen, /"Unpriced","","",""/);
  assert.equal(roomComparisonCsv(cabana, pack.scenario, date, cp, { kitchen: "published" }).trim().split("\n").length, 1);
});
