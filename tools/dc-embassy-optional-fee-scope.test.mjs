import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>JSON.parse(readFileSync(new URL('../'+p,import.meta.url)));
const r=read('docs/research/dc-embassy-optional-fee-scope-2026-10-21.json');
test('optional headlines and tiered pet charges do not become mandatory room charges',()=>{
  assert.equal(r.currency,'USD');assert.equal(r.parking.valet_headline_cents,7500);assert.equal(r.parking.valet_unit_in_inspected_body,null);
  assert.equal(r.parking.valet_stay_component_cents,null);assert.equal(r.pets.headline_cents,7500);
  assert.equal(r.pets.one_to_four_night_stay_cents,7500);assert.equal(r.pets.five_or_more_night_stay_cents,12500);
  assert.equal(r.pets.maximum_pets,2);assert.deepEqual(r.pets.published_types,['dog','cat']);
  assert.equal(r.pets.exact_pet_acceptance_confirmed,false);assert.equal(r.pets.tax_basis,null);
  assert.equal(r.mandatory_stay_charges.absence_from_policy_summary_means_zero,false);
  for(const k of ['sofa_fee_cents','other_mandatory_fees_cents','incidentals_hold_cents'])assert.equal(r.mandatory_stay_charges[k],null);
});
test('named baseline and optional branches preserve unknown totals and billing units',()=>{
  assert.equal(r.scenario.baseline_car_selected,false);assert.equal(r.scenario.baseline_pet_selected,false);
  assert.equal(r.desk_cases[0].optional_selected_component_cents,0);assert.equal(r.desk_cases[0].mandatory_charges_cents,null);
  assert.equal(r.desk_cases[1].selected_nights,5);assert.equal(r.desk_cases[1].published_pet_component_cents,r.pets.five_or_more_night_stay_cents);
  assert.notEqual(r.desk_cases[1].published_pet_component_cents,5*r.pets.headline_cents);
  assert.equal(r.desk_cases[1].acceptance_confirmed,false);assert.equal(r.desk_cases[2].stay_component_cents,null);
  for(const c of r.desk_cases)assert.equal(c.complete_stay_total_cents,null);
});
test('new hotel-info observation does not renew old quote or party acceptance',()=>{
  assert.equal(r.checked_on,'2026-10-21');assert.equal(r.recheck_on,'2026-11-04');assert.equal(r.source.inspected_on,r.checked_on);
  assert.equal(r.source.published_on,null);assert.equal(r.source.checkout_observed,false);assert.equal(new URL(r.source.url).protocol,'https:');
  const old=read(r.preservation.original_price_record)[0];assert.equal(old.checked_on,'2026-09-30');assert.equal(old.nights,5);
  assert.equal(old.requested_individual_ages_confirmed,false);assert.deepEqual(old.rates.map(x=>x.stay_amount),[1673.39,2040.72]);
  assert.equal(r.preservation.original_quote_or_clock_renewed,false);assert.equal(r.preservation.public_change,false);assert.equal(r.preservation.booking_contact_paid_calls,0);
});
