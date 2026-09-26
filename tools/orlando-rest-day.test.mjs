import test from "node:test";
import assert from "node:assert/strict";
import { compareRestDay } from "../src/prototypes/orlando-rest-day/compare.mjs";
import { restDayEvidence } from "../src/prototypes/orlando-rest-day/data.mjs";

const task = { childAges: [3, 10], visitDate: "2026-09-30", asOf: "2026-09-26", availableMinutes: 120, returnAfterBreak: true };

test("Wednesday split-day screen retains exception and return unknowns", () => {
  const { records } = compareRestDay(task);
  assert.equal(records[0].schedule.status, "normally-closed-check-exception");
  assert.equal(records[0].reentry.status, "return-policy-unknown");
  assert.equal(records[1].reentry.status, "published-conditional-return");
  assert.match(records[1].reentry.condition, /hand stamp/);
  assert.equal(records[2].reentry.status, "return-policy-unknown");
  for (const record of records) {
    assert.equal(record.currentOperation, "unknown");
    assert.equal(record.totalCost, null);
    assert.equal(record.transportTime, null);
  }
});

test("no normal closure does not mean confirmed opening", () => {
  for (const record of compareRestDay({ ...task, visitDate: "2026-10-01" }).records) assert.equal(record.schedule.status, "dated-hours-unverified");
  for (const record of compareRestDay({ ...task, returnAfterBreak: false }).records) assert.equal(record.reentry.status, "not-required-for-this-task");
});

test("duration boundaries are suggestions, never exclusions", () => {
  for (const minutes of [1, 119, 120, 179, 180, 240, 720]) {
    const records = compareRestDay({ ...task, availableMinutes: minutes }).records;
    assert.equal(records.length, 3);
    assert.equal(records[0].duration.status, "suggested-duration-unknown");
    assert.equal(records[1].duration.status, minutes < 180 ? "shorter-than-published-suggestion" : "not-below-published-suggestion");
    assert.equal(records[2].duration.status, minutes < 120 ? "shorter-than-published-suggestion" : "not-below-published-suggestion");
  }
});

test("child-area age guidance is scoped, not a venue admission rule", () => {
  const records = compareRestDay({ ...task, childAges: [0, 7, 8, 17] }).records;
  assert.deepEqual(records[0].children.map(c => c.status), ["within-area-guidance", "within-area-guidance", "outside-area-guidance-not-venue-exclusion", "outside-area-guidance-not-venue-exclusion"]);
  assert.ok(records.slice(1).every(r => r.children.every(c => c.status === "age-guidance-not-assessed")));
});

test("freshness covers both assessment and future visit boundary", () => {
  assert.equal(compareRestDay({ ...task, visitDate: "2026-10-25" }).needsRecheck, false);
  assert.equal(compareRestDay({ ...task, visitDate: "2026-10-26" }).needsRecheck, true);
  assert.equal(compareRestDay({ ...task, visitDate: "2026-10-27", asOf: "2026-10-26" }).needsRecheck, true);
});

test("default assessment date follows Orlando across UTC midnight", t => {
  t.mock.timers.enable({ apis: ["Date"], now: new Date("2026-09-27T01:00:00Z") });
  assert.doesNotThrow(() => compareRestDay({ ...task, asOf: undefined, visitDate: "2026-09-26" }));
  t.mock.timers.setTime(new Date("2026-09-27T04:00:00Z").getTime());
  assert.throws(() => compareRestDay({ ...task, asOf: undefined, visitDate: "2026-09-26" }));
});

test("malformed dates, past visits and unsupported inputs reject", () => {
  for (const patch of [{ visitDate: "2026-02-30" }, { visitDate: "2026-9-30" }, { asOf: "2026-09-25" }, { visitDate: "2026-09-25" }, { childAges: [] }, { childAges: [18] }, { childAges: [-1] }, { childAges: [3.5] }, { childAges: Array(6).fill(3) }, { availableMinutes: 0 }, { availableMinutes: 721 }, { availableMinutes: "120" }, { returnAfterBreak: null }]) assert.throws(() => compareRestDay({ ...task, ...patch }));
  assert.throws(() => compareRestDay(null));
  assert.throws(() => compareRestDay({ ...task, childAges: Array(2) }));
});

test("source references resolve and result mutation cannot alter evidence", () => {
  const result = compareRestDay(task);
  for (const record of result.records) {
    for (const field of [record.schedule, record.reentry, record.duration, record.meal, ...record.children]) {
      for (const source of field.sources) {
        assert.equal(source.url, restDayEvidence.sources[source.id]);
        assert.match(source.url, /^https:\/\//);
        assert.equal(source.checkedOn, "2026-09-26");
      }
    }
  }
  result.records[1].duration.suggestedMinutes[0] = 1;
  result.records[0].schedule.sources[0].url = "changed";
  assert.deepEqual(compareRestDay(task).records[1].duration.suggestedMinutes, [180, 240]);
  assert.equal(compareRestDay(task).records[0].schedule.sources[0].url, restDayEvidence.sources.O1);
});
