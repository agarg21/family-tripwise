import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { suites, sources, checkedOn, pageUpdatedOn, priceRecheckOn, recheckOn } from "./page-generation/orlando-suite-data.mjs";
import { orlandoSuitePage } from "./page-generation/orlando-suite-page.mjs";
import { compareStay } from "./page-generation/orlando-suite-model.mjs";
const evidence = JSON.parse(readFileSync(new URL("../docs/research/orlando-ihg-water-policy-2026-10-11.json", import.meta.url)));
const policy = suites.find(s => s.id === "holiday-inn").waterPolicy;

test("Four ride-specific numeric minimums retain distinct official policy source and dates", () => {
  assert.deepEqual(Object.fromEntries(policy.rides.map(r => [r.name, r.minimumInches])), evidence.ride_minimums_inches);
  assert.equal(sources[policy.source], evidence.sources[2].url);
  assert.equal(policy.checkedOn, evidence.inspected_on);
  assert.equal(policy.recheckOn, evidence.recheck_on);
  assert.equal(suites.filter(s => s.waterPolicy).length, 1);
});

test("Conflicting session labels never become zero price or confirmed included entitlement", () => {
  assert.equal(evidence.flowrider.ihg_resort_fee_inclusion, false);
  assert.equal(evidence.flowrider.faq_charge_label, "complimentary");
  assert.equal(evidence.flowrider.applicable_charge, null);
  assert.equal(evidence.flowrider.resolved_cost_policy, null);
  assert.match(policy.costConflict, /30-minute/);
  assert.match(policy.costConflict, /do not budget zero/);
  assert.match(policy.costConflict, /reservations are required/);
  assert.match(policy.limitation, /Do not infer height from age/);
  assert.match(policy.limitation, /not complete ride rules or confirmed admission/);
});

test("Static and enhanced page use the same policy and preserve fee arithmetic", () => {
  const html = orlandoSuitePage();
  assert.equal(html, readFileSync(new URL("../site/where-to-stay/orlando-family-hotels.html", import.meta.url), "utf8"));
  assert.equal(readFileSync(new URL("./page-generation/orlando-suite-data.mjs", import.meta.url), "utf8"), readFileSync(new URL("../site/orlando/orlando-suite-data.mjs", import.meta.url), "utf8"));
  assert.equal((html.match(/data-water-policy=/g) ?? []).length, 1);
  for (const ride of policy.rides) assert.ok(html.includes(`${ride.name}: published minimum ${ride.minimumInches} inches.`));
  assert.match(html, /Official cost conflict/);
  assert.match(html, /Policy observed 2026-10-11; check current terms before booking/);
  assert.deepEqual([checkedOn, pageUpdatedOn, recheckOn], ["2026-09-24", "2026-09-27", "2026-10-24"]);
  assert.equal(priceRecheckOn, "2026-10-18");
  assert.equal(suites[2].priceSample, undefined); // Q17b: October 11 sample withdrawn
  assert.doesNotMatch(html, /About USD152 per room\/night/);
  assert.deepEqual(compareStay({feeIncluded:"no"}).rows.map(r => [r.parking,r.resortExtra]), [[0,null],[null,null],[155,325]]);
});
