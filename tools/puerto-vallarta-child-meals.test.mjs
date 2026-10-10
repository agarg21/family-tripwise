import test from 'node:test';
import assert from 'node:assert/strict';
import {pvMealPolicyEvidence,pvMealPolicy,pvMealPolicyClock} from './pv-meal-policy.mjs';
test('inclusive4-12 generic pricing does not establish selected free meals or amount',()=>{
 const p=pvMealPolicy();assert.deepEqual(p.generic_child_band_ages,[4,8,12]);assert.equal(p.evidence.general_policy.child_price_fraction,0.5);assert.equal(p.evidence.general_policy.adult_price_from_age,13);assert.equal(p.selected_offer_confirmed,false);assert.equal(p.meal_amount,null);assert.equal(p.price_adjustment,null);
 assert.equal(p.evidence.general_policy.all_room_guests_required,true);assert.equal(p.evidence.general_policy.promotion_combination_allowed,false);
});
test('general tax scope and meal days cannot replace selected quote basis or hotel nights',()=>{
 const p=pvMealPolicyEvidence;assert.equal(p.general_policy.tax_and_gratuities_included,true);assert.match(p.selected_offer.tax_basis,/Tax not included/);assert.equal(p.general_policy.starts_arrival_local,'15:00');assert.equal(p.general_policy.ends_departure_local,'12:00');assert.equal(p.separate_meal_plan.minimum_consecutive_days,3);assert.equal(p.scenario.nights,5);assert.equal(p.selected_offer.checkout_total,null);
});
test('generic policy review is historical-safe and dueNovember9 without price renewal',()=>{
 assert.equal(pvMealPolicy(pvMealPolicyEvidence,'2026-10-09').generic_child_band_ages,null);assert.equal(pvMealPolicyClock('2026-10-09').freshness.due_on,null);assert.equal(pvMealPolicyClock('2026-11-08').freshness.state,'within-review-interval');assert.equal(pvMealPolicyClock('2026-11-09').freshness.state,'review-due');assert.equal(pvMealPolicyClock('2026-10-10').freshness.due_on,'2026-11-09');
});
test('changed policy identity, source, age, unit, dates or acceptance fails closed',()=>{
 const saved=structuredClone(pvMealPolicyEvidence);
 for(const mutate of [e=>e.hotel='Garza Cancun',e=>e.source_url+='?token=synthetic',e=>e.observed_on='2026-10-11',e=>e.evidence_class='HUMAN_VERIFIED',e=>e.refresh_days=0,e=>e.general_policy.child_age_to=11,e=>e.general_policy.promotion_combination_allowed=true,e=>e.general_policy.child_price_fraction=0,e=>e.general_policy.tax_and_gratuities_included=false,e=>e.separate_meal_plan.minimum_consecutive_days=5,e=>e.separate_meal_plan.transferable=true,e=>e.selected_offer.confirmed_applicability=true,e=>e.selected_offer.child_meal_amount=0,e=>e.selected_offer.price_adjustment=-10,e=>e.scenario.child_ages=[4,8,13]]){const v=structuredClone(saved);mutate(v);assert.throws(()=>pvMealPolicy(v));}assert.throws(()=>pvMealPolicy(saved,'2026-02-30'));assert.deepEqual(pvMealPolicyEvidence,saved);
});
