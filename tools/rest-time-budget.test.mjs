import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { assessRestTimeBudget, restDurationFields } from "../src/shared/rest-time-budget.mjs";
import { assessMuseumRest } from "./museum-rest-task.mjs";
import { restBudgetMessage } from "../src/shared/museum-rest-budget.mjs";

const example = { morning_visit_minutes: 120, outward_journey_minutes: 30, room_rest_minutes: 90,
  return_journey_minutes: 30, entry_wait_minutes: 30, afternoon_visit_minutes: 120 };

test("Unknown window and partial inputs do not become a zero-time complete plan", () => {
  const empty = assessRestTimeBudget(null);
  assert.deepEqual(empty.missing_durations, restDurationFields);
  assert.equal(empty.total_required_minutes, null);
  assert.equal(empty.remaining_window_minutes, null);
  const partial = assessRestTimeBudget(450, { room_rest_minutes: 90 });
  assert.equal(partial.known_component_minutes, 90);
  assert.equal(partial.total_required_minutes, null);
  assert.equal(partial.time_budget_status, "UNKNOWN");
  assert.equal(assessRestTimeBudget(null, example).remaining_window_minutes, null);
});

test("Shared arithmetic covers spare time, exact boundary, shortfall, explicit zero and fractions", () => {
  assert.equal(assessRestTimeBudget(450, example).remaining_window_minutes, 30);
  assert.equal(assessRestTimeBudget(420, example).remaining_window_minutes, 0);
  assert.equal(assessRestTimeBudget(419, example).remaining_window_minutes, -1);
  assert.equal(assessRestTimeBudget(419, example).time_budget_status, "exceeds-published-window");
  const zero = Object.fromEntries(restDurationFields.map(key => [key, 0]));
  assert.equal(assessRestTimeBudget(1, zero).remaining_window_minutes, 1);
  assert.equal(assessRestTimeBudget(1, { ...zero, room_rest_minutes: 0.5 }).remaining_window_minutes, 0.5);
  const decimals = { ...zero, morning_visit_minutes: 1.1, room_rest_minutes: 2.2 };
  const boundary = assessRestTimeBudget(3.3, decimals);
  assert.equal(boundary.remaining_window_minutes, 0);
  assert.equal(boundary.time_budget_status, "within-published-window-only");
  assert.match(restBudgetMessage(boundary), /^No spare minutes\. 3\.3 planned minutes\./);
  assert.match(restBudgetMessage(assessRestTimeBudget(3.4, decimals)), /^0\.1 minutes remaining\./);
  assert.equal(assessRestTimeBudget(3.299999, decimals).time_budget_status, "exceeds-published-window");
});

test("Invalid windows, unexpected keys, prototypes and accessors fail closed without execution", () => {
  for (const window of [undefined, 0, -1, 1441, NaN, Infinity, "450", false])
    assert.throws(() => assessRestTimeBudget(window, example));
  for (const value of [undefined, -1, 1441, NaN, Infinity, "30", {}, false])
    assert.throws(() => assessRestTimeBudget(450, { room_rest_minutes: value }));
  for (const invalid of [null, [], Object.create({ room_rest_minutes: 30 }), { extra: 1 },
    { [Symbol("input")]: 1 }, { get room_rest_minutes() { throw Error("must not read"); } }])
    assert.throws(() => assessRestTimeBudget(450, invalid));
  const result = assessRestTimeBudget(450, example);
  result.durations.room_rest_minutes = 1;
  assert.equal(example.room_rest_minutes, 90);
});

test("Node evidence wrapper shares the budget and replays historical source truth unchanged", () => {
  const evidence = JSON.parse(readFileSync(new URL("../docs/research/washington-dc-museum-rest-task-2026-10-03.json", import.meta.url)));
  const recorded = JSON.parse(readFileSync(new URL("../docs/research/dc-rest-time-budget-2026-10-03.json", import.meta.url)));
  const actual = assessMuseumRest(evidence, "National Museum of Natural History", example, "2026-10-03");
  assert.deepEqual(actual, recorded.hypothetical_result);
  for (const [key, value] of Object.entries(assessRestTimeBudget(450, example))) assert.deepEqual(actual[key], value);
  assert.equal(actual.actual_hotel_return_feasibility, "UNKNOWN");
  assert.equal(actual.future_operation_confirmed, false);
  assert.equal(actual.route_stroller_safety_assessed, false);
  const future = assessMuseumRest(evidence, actual.museum, example, "2026-11-03");
  assert.equal(future.source_freshness, "RECHECK_SOURCE");
  assert.equal(future.inspected_on, "2026-10-03");
});
