import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { suites, sources, checkedOn, pageUpdatedOn, recheckOn } from "./page-generation/orlando-suite-data.mjs";
import { mealPolicy, orlandoSuitePage } from "./page-generation/orlando-suite-page.mjs";
const evidence = JSON.parse(readFileSync(new URL("../docs/research/orlando-ihg-meal-policy-2026-10-11.json", import.meta.url)));
const suite = suites.find(s => s.id === "holiday-inn");

test("IHG meal facts preserve source scope, category and separate freshness", () => {
  const policy = suite.mealPolicy;
  assert.equal(sources[policy.roomSource], evidence.room_source);
  assert.equal(sources[policy.diningSource], evidence.dining_source);
  assert.deepEqual(policy.breakfast, evidence.breakfast);
  assert.equal(policy.checkedOn, evidence.inspected_on);
  assert.equal(policy.recheckOn, evidence.recheck_on);
  assert.equal(suites.filter(s => s.mealPolicy).length, 1);
  assert.deepEqual([checkedOn, pageUpdatedOn, recheckOn], ["2026-09-24", "2026-09-27", "2026-10-24"]);
});

test("Unknown exact kitchen and meal coverage stay unknown rather than zero", () => {
  assert.equal(suite.mealPolicy.kitchenType, null);
  assert.equal(suite.mealPolicy.equipment, null);
  assert.equal(evidence.kitchen_type, null);
  assert.equal(evidence.equipment, null);
  assert.equal(evidence.meal_prices, null);
  assert.equal(evidence.breakfast_covered_guests, null);
  assert.match(suite.mealPolicy.kitchenNote, /does not map.*Two Bedroom Suite/);
  assert.match(suite.mealPolicy.kitchenNote, /three-bedroom kitchen photo is not evidence/);
  assert.match(suite.mealPolicy.limitation, /does not establish meal prices or breakfast coverage for every adult and child/);
  assert.match(suite.mealPolicy.limitation, /Confirm hours for your travel dates/);
  assert.match(suite.mealPolicy.limitation, /No meal-cost savings are calculated/);
  assert.match(suite.mealPolicy.limitation, /does not renew room prices, fees or exact-age acceptance/);
});

test("Static and enhanced comparison retain one escaped, category-specific meal block", () => {
  const html = orlandoSuitePage();
  assert.equal(html, readFileSync(new URL("../site/where-to-stay/orlando-family-hotels.html", import.meta.url), "utf8"));
  assert.equal(readFileSync(new URL("./page-generation/orlando-suite-data.mjs", import.meta.url), "utf8"), readFileSync(new URL("../site/orlando/orlando-suite-data.mjs", import.meta.url), "utf8"));
  assert.equal((html.match(/data-meal-policy=/g) ?? []).length, 1);
  assert.ok(html.includes(mealPolicy(suite)));
  assert.equal(mealPolicy(suites[0]), "");
  assert.equal(mealPolicy(suites[1]), "");
  const hostile = mealPolicy({...suite, id: '"<script>', mealPolicy: {...suite.mealPolicy, kitchenNote: "<script>", breakfast: {venue:'<img onerror="x">', location:"<&", opens:"<", closes:">"}, limitation:"<script>"}});
  assert.ok(!hostile.includes("<script>"));
  assert.ok(hostile.includes("&lt;img onerror=&quot;x&quot;&gt;"));
});
