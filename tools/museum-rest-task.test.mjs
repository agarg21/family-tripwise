import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { assessMuseumRest, restDurationFields } from "./museum-rest-task.mjs";

const evidence = JSON.parse(readFileSync(new URL("../docs/research/washington-dc-museum-rest-task-2026-10-03.json", import.meta.url)));
const report = JSON.parse(readFileSync(new URL("../docs/research/dc-rest-time-budget-2026-10-03.json", import.meta.url)));
const name = "National Museum of Natural History";
const hypothetical = { morning_visit_minutes: 120, outward_journey_minutes: 30, room_rest_minutes: 90,
  return_journey_minutes: 30, entry_wait_minutes: 30, afternoon_visit_minutes: 120 };
const run = (durations = {}, record = evidence, museum = name, date = "2026-10-03") => assessMuseumRest(record, museum, durations, date);

test("Maintained actual DC task remains unknown, not a zero-minute feasible journey", () => {
  const result = run();
  assert.equal(result.published_window_minutes, 450);
  assert.deepEqual(result.missing_durations, restDurationFields);
  assert.equal(result.known_component_minutes, 0);
  assert.equal(result.total_required_minutes, null);
  assert.equal(result.remaining_window_minutes, null);
  assert.equal(result.time_budget_status, "UNKNOWN");
  assert.equal(result.actual_hotel_return_feasibility, "UNKNOWN");
  assert.equal(result.future_operation_confirmed, false);
  assert.equal(result.hotel_winner, null);
  assert.match(result.limitation, /not zero/);
});

test("Hypothetical arithmetic returns spare time, boundary and shortfall without route assurance", () => {
  assert.equal(run(hypothetical).remaining_window_minutes, 30);
  assert.equal(run({ ...hypothetical, afternoon_visit_minutes: 150 }).remaining_window_minutes, 0);
  const overflow = run({ ...hypothetical, afternoon_visit_minutes: 151 });
  assert.equal(overflow.remaining_window_minutes, -1);
  assert.equal(overflow.time_budget_status, "exceeds-published-window");
  for (const result of [run(hypothetical), overflow]) {
    assert.equal(result.actual_hotel_return_feasibility, "UNKNOWN");
    assert.equal(result.route_stroller_safety_assessed, false);
    assert.match(result.duration_basis, /hypothetical/);
  }
});

test("Partial inputs and missing second-anchor visitor body never yield complete time budgets", () => {
  const partial = run({ room_rest_minutes: 90 });
  assert.equal(partial.known_component_minutes, 90);
  assert.equal(partial.time_budget_status, "UNKNOWN");
  const second = run(hypothetical, evidence, "National Museum of American History");
  assert.equal(second.published_window_minutes, null);
  assert.equal(second.time_budget_status, "UNKNOWN");
  assert.equal(second.total_required_minutes, 420);
  assert.equal(second.source_class, "SOURCE_UNAVAILABLE");
});

test("Source age is retained rather than refreshed, future and malformed schedules fail closed", () => {
  assert.equal(run({}, evidence, name, "2026-11-03").source_freshness, "RECHECK_SOURCE");
  assert.equal(run({}, evidence, name, "2026-11-03").inspected_on, "2026-10-03");
  assert.throws(() => run({}, evidence, name, "2026-10-02"));
  for (const close of ["24:00", "10:00", "09:59", undefined, 1730]) {
    const modified = structuredClone(evidence); modified.museum_constraints[0].published_daily_close = close;
    assert.throws(() => run({}, modified));
  }
  const modified = structuredClone(evidence); modified.sources[0].status = "unavailable";
  assert.throws(() => run({}, modified));
});

test("Invalid, sparse, accessor, unexpected and duplicate inputs are rejected", () => {
  for (const value of [-1, 1441, NaN, Infinity, "30", undefined, {}, false])
    assert.throws(() => run({ room_rest_minutes: value }));
  assert.throws(() => run({ route_safe: true }));
  assert.throws(() => run(Object.create({ room_rest_minutes: 30 })));
  assert.throws(() => run({ get room_rest_minutes() { throw Error("Must not execute"); } }));
  assert.throws(() => run({}, evidence, "Natural History"));
  const duplicate = structuredClone(evidence); duplicate.museum_constraints.push(duplicate.museum_constraints[0]);
  assert.throws(() => run({}, duplicate));
  const sparse = structuredClone(evidence); delete sparse.sources[0];
  assert.throws(() => run({}, sparse));
});

test("Explicit zero and fractional hypotheses are valid while output and old evidence remain isolated", () => {
  const before = JSON.stringify(evidence);
  const inputs = Object.fromEntries(restDurationFields.map(key => [key, 0]));
  inputs.room_rest_minutes = 0.5;
  const result = run(inputs);
  assert.equal(result.total_required_minutes, 0.5);
  assert.equal(result.remaining_window_minutes, 449.5);
  result.durations.room_rest_minutes = 999;
  assert.equal(inputs.room_rest_minutes, 0.5);
  assert.equal(JSON.stringify(evidence), before);
});

test("Recorded task validation and stdout CLI reproduce the exact maintained hypothesis", () => {
  assert.equal(report.actual_task_result.time_budget_status, "UNKNOWN");
  assert.deepEqual(report.actual_task_result, run());
  assert.deepEqual(report.hypothetical_result, run(report.hypothetical_durations));
  const output = execFileSync(process.execPath, [fileURLToPath(new URL("./museum-rest-task.mjs", import.meta.url)),
    fileURLToPath(new URL("../docs/research/washington-dc-museum-rest-task-2026-10-03.json", import.meta.url)),
    name, JSON.stringify(report.hypothetical_durations), "2026-10-03"], { encoding: "utf8", stdio: "pipe" });
  assert.deepEqual(JSON.parse(output), report.hypothetical_result);
  assert.throws(() => execFileSync(process.execPath, [fileURLToPath(new URL("./museum-rest-task.mjs", import.meta.url)),
    fileURLToPath(new URL("../docs/research/washington-dc-museum-rest-task-2026-10-03.json", import.meta.url)),
    name, JSON.stringify(report), "2026-10-03"], { stdio: "pipe" }));
});
