import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {bostonMuseumAdmission,bostonMuseumEvidence,bostonMuseumReviewClock} from './boston-museum-admission.mjs';
const task = JSON.parse(readFileSync(new URL('../docs/research/boston-public-admission-budget-task-2026-10-09.json',import.meta.url)));

test('five standard tickets give a component, never fee-inclusive checkout or hotel nights',()=>{
  const result=bostonMuseumAdmission();
  assert.equal(result.tickets,5);assert.equal(result.amount,120);assert.equal(result.transaction_fee,4);
  assert.equal(result.checkout_total,null);assert.equal(result.evidence.admission.new_ticket_required_after_exit,null);
  assert.equal(result.freshness.due_on,'2026-10-23');
});
test('changed policy, dates, fee units, party or return assurances require requalification without mutation',()=>{
  const original=structuredClone(bostonMuseumEvidence);
  for(const mutate of [r=>r.checked_on='2026-10-10',r=>r.admission.standard_admission.amount=25,r=>r.admission.transaction_fee.unit='person',r=>r.admission.transaction_fee.basis='plus tax per person',r=>r.admission.tax_inclusion='included',r=>r.admission.same_day_reentry='permitted',r=>r.admission.new_ticket_required_after_exit=false,r=>r.admission.validity='all-day',r=>r.sources.push('https://example.com/?token=synthetic'),r=>r.scenario.child_ages=[4,8,13],r=>r.hours.exact_future_date_verified=true,r=>r.admission.discounts='automatic discount']){
    const invalid=structuredClone(original);mutate(invalid);assert.throws(()=>bostonMuseumAdmission(invalid));
  }
  assert.throws(()=>bostonMuseumAdmission(original,'2026-02-30'));
  for(const mutate of [t=>t.refresh_days=30,t=>t.scenario.child_ages=[4,8,13],t=>t.admission_component.amount=124,t=>t.admission_component.checkout_total=124,t=>t.admission_component.includes_transaction_fee_assumed=true]){
    const invalid=structuredClone(task);mutate(invalid);assert.throws(()=>bostonMuseumAdmission(original,'2026-10-09',invalid));
  }
  assert.deepEqual(bostonMuseumEvidence,original);
});
test('review due boundary and historical report do not promote future policy',()=>{
  assert.equal(bostonMuseumReviewClock('2026-10-22').freshness.state,'within-review-interval');
  assert.equal(bostonMuseumReviewClock('2026-10-23').freshness.state,'review-due');
  assert.equal(bostonMuseumReviewClock('2026-10-08').freshness.state,'future-date-review');
  assert.equal(bostonMuseumReviewClock('2026-10-08').freshness.due_on,null);
  assert.equal(bostonMuseumReviewClock('2026-10-08').evidence_state,'not-yet-observed-at-report-date');
});
