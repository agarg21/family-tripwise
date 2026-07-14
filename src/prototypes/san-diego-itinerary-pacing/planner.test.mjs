import assert from "node:assert/strict";
import test from "node:test";

import { buildPacingPlan, normalizePreferences } from "./planner.mjs";

test("normalizes unsupported inputs without trusting arbitrary values", () => {
  assert.deepEqual(normalizePreferences({ age: "unknown", days: "20", reset: "later" }), {
    age: "toddler",
    days: 3,
    reset: "fixed",
    weather: "mixed",
    transport: "rental",
    pace: "balanced",
    stroller: false,
    sensoryBreaks: false,
  });
});

test("fixed-reset plans protect a midday block on every day", () => {
  const plan = buildPacingPlan({ days: 4, reset: "fixed" });
  assert.equal(plan.days.length, 4);
  for (const day of plan.days) {
    assert.match(day.blocks[1].label, /Protected nap or reset/);
    assert.equal(day.reviewStatus, "needs-human-review");
  }
});

test("rain and car-light constraints create bounded fallbacks and route checks", () => {
  const plan = buildPacingPlan({ weather: "rain", transport: "car-light", days: 2 });
  for (const day of plan.days) {
    assert.match(day.blocks[0].label, /indoor/i);
    assert.match(day.blocks[3].reason, /indoor candidate/);
    assert.ok(day.checks.some((check) => /walk\/transit zone/.test(check)));
  }
});

test("gentle pace never promises a second activity", () => {
  const plan = buildPacingPlan({ pace: "gentle", days: 3 });
  for (const day of plan.days) {
    assert.equal(day.blocks[2].label, "No second activity promised");
  }
});

test("all supported combinations stay deterministic, disclosed, and non-prescriptive", () => {
  const ages = ["baby", "toddler", "school-age", "teen", "mixed"];
  const days = [1, 2, 3, 4];
  const resets = ["fixed", "flexible", "quiet", "none"];
  const weather = ["mild", "hot", "rain", "mixed"];
  const transport = ["rental", "rideshare", "car-light"];
  const paces = ["gentle", "balanced", "full"];
  const booleans = [false, true];
  let checked = 0;

  for (const age of ages) {
    for (const dayCount of days) {
      for (const reset of resets) {
        for (const weatherCase of weather) {
          for (const transportCase of transport) {
            for (const pace of paces) {
              for (const stroller of booleans) {
                for (const sensoryBreaks of booleans) {
                  const input = { age, days: dayCount, reset, weather: weatherCase, transport: transportCase, pace, stroller, sensoryBreaks };
                  const first = buildPacingPlan(input);
                  const second = buildPacingPlan(input);
                  const rules = first.triggeredRules.join(" ");
                  assert.deepEqual(first, second);
                  assert.equal(first.days.length, dayCount);
                  assert.equal(first.reviewStatus, "needs-human-review");
                  assert.equal(first.personallyVerified, false);
                  assert.match(first.disclosure, /not a reviewed route/);
                  assert.ok(first.verificationChecks.length >= 6);
                  assert.equal(/Stroller-sensitive rule/.test(rules), stroller);
                  assert.equal(/Sensory-break rule/.test(rules), sensoryBreaks);
                  assert.doesNotMatch(JSON.stringify(first), /\b(safest|guaranteed|personally verified|recommended itinerary)\b/i);
                  checked += 1;
                }
              }
            }
          }
        }
      }
    }
  }

  assert.equal(checked, 11520);
});
