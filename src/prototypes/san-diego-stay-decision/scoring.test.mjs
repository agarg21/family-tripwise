import test from "node:test";
import assert from "node:assert/strict";

import { AREA_PROFILES } from "./data.mjs";
import { buildWeights, propertyChecks, scoreAreas } from "./scoring.mjs";

const defaults = {
  age: "toddler",
  transport: "rental",
  pace: "balanced",
  priority: "attractionBalance",
  napReset: true,
  kitchenLaundry: false,
  stroller: true,
};

test("scores every area in descending order within the documented index range", () => {
  const results = scoreAreas(AREA_PROFILES, defaults);
  assert.equal(results.length, AREA_PROFILES.length);
  assert.ok(results.every((item) => item.fitIndex >= 0 && item.fitIndex <= 100));
  assert.deepEqual([...results].sort((a, b) => b.fitIndex - a.fitIndex).map((item) => item.id), results.map((item) => item.id));
});

test("top priority receives the largest explicit weight increase", () => {
  const weights = buildWeights({ ...defaults, priority: "beach" });
  assert.ok(weights.beach > weights.value);
  assert.ok(weights.beach > weights.quiet);
});

test("unreviewed and unsourced assumptions keep confidence low", () => {
  const results = scoreAreas(AREA_PROFILES, defaults);
  assert.ok(results.every((item) => item.evidence.confidence === "low"));
  assert.ok(results.every((item) => item.evidence.reviewedCount === 0));
  assert.ok(results.every((item) => item.evidence.sourcedCount === 0));
});

test("family constraints add the corresponding property checks", () => {
  const checks = propertyChecks({ ...defaults, kitchenLaundry: true });
  assert.ok(checks.some((item) => item.includes("kitchen")));
  assert.ok(checks.some((item) => item.includes("stroller")));
  assert.ok(checks.some((item) => item.includes("midday")));
});
