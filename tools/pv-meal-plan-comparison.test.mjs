import test from "node:test";
import assert from "node:assert/strict";
import {pvMealPlanComparison,pvMealEvidence,pvMealTask} from "./pv-meal-plan-comparison.mjs";

test("PV comparison subtracts exact public stay totals before nightly rounding",()=>{
  const result=pvMealPlanComparison();
  assert.equal(result.room_only.stay_amount,4382);assert.equal(result.all_inclusive.stay_amount,5881);
  assert.equal(result.stay_increment,1499);assert.equal(result.nightly_increment,299.8);
  assert.deepEqual(result.party,{adults:2,child_ages:[4,8,12]});assert.equal(result.nights,5);
  assert.equal(result.category,"Sanctuary Two Bedroom Suite");assert.equal(result.currency,"USD");
  assert.equal(result.unit,"configuration/stay");assert.equal(result.nightly_unit,"configuration/night");
  assert.equal(result.tax_included,false);assert.equal(result.full_cost,null);assert.equal(result.savings,null);
  assert.equal(result.meal_entitlements,null);assert.equal(result.cancellation_consistent,false);
  assert.equal(result.room_only.eligibility,"public");assert.equal(result.all_inclusive.eligibility,"public");
});
test("PV source and comparison clocks do not renew prices or invent historical evidence",()=>{
  assert.equal(pvMealPlanComparison(pvMealEvidence,"2026-10-08"),null);
  assert.equal(pvMealPlanComparison().observed_on,"2026-10-09");assert.equal(pvMealTask.review_due,"2026-10-23");
  assert.equal(pvMealPlanComparison(pvMealEvidence,"2026-10-24").historical,true);
  assert.throws(()=>pvMealPlanComparison(pvMealEvidence,"bad"),/review required/);
});
test("Changed category, party, dates, units, membership, price and policy fail closed",()=>{
  for(const mutate of [r=>r[0].category="Panoramic",r=>r[0].party.child_ages[2]=13,r=>r[0].currency="MXN",
    r=>r[0].unit="person/night",r=>r[0].arrival="2026-11-09",r=>r[0].rates[0].eligibility="membership-required",
    r=>r[0].rates[1].stay_amount=6000,r=>r[0].fee_basis="tax included",r=>r[0].rates[1].meals="all five free",
    r=>r[0].deposit_basis="extra35percentfee",r=>r[0].rates[1].cancellation="guaranteed refundable"]){
    const records=structuredClone(pvMealEvidence);mutate(records);assert.throws(()=>pvMealPlanComparison(records),/review required/);
  }
});
