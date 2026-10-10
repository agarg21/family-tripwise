import test from 'node:test';
import assert from 'node:assert/strict';
import {momaBudget,momaComparison,momaReviewClock,momaEvidence} from './nyc-moma-budget.mjs';

test('MoMA age boundary and conditional full-time-ID category produce exact admission-only totals',()=>{
 const before=structuredClone(momaEvidence),budget=momaBudget();
 assert.deepEqual(budget.scenarios.map(s=>s.total_cents),[6000,9000,7700]);
 assert.deepEqual(momaComparison().rows.map(r=>r[2]),['USD 60.00','USD 90.00','USD 77.00']);
 assert.equal(budget.scenarios[1].older_teen_student_ID,false);assert.equal(budget.scenarios[2].older_teen_student_ID,true);
 assert.equal(budget.evidence.policy.free_child_ticket_required,true);assert.equal(budget.evidence.policy.same_day_return_with_ticket,true);
 assert.deepEqual(momaEvidence,before);
});

test('MoMA source clock preserves historical non-use and exact due-day boundary',()=>{
 assert.equal(momaReviewClock('2026-10-23').freshness.state,'within-review-interval');
 assert.equal(momaReviewClock('2026-10-24').freshness.state,'review-due');
 assert.equal(momaReviewClock('2026-10-10').freshness.due_on,'2026-10-24');
 const historical=momaBudget(momaEvidence,'2026-10-09');assert.deepEqual(historical.scenarios,[]);
 assert.equal(historical.evidence_state,'not-yet-observed-at-report-date');assert.equal(historical.freshness.due_on,null);
 assert.match(momaComparison().note,/not checkout totals/);assert.match(momaComparison().return_note,/retain your ticket/);
});

test('MoMA changed price/age/ID/source/party/policy provenance fails closed without a manufactured quote',()=>{
 for(const mutate of [e=>e.prices.adult_cents=3100,e=>e.prices.student_cents=0,e=>e.policy.free_child_max_age=17,e=>e.policy.student_requires_full_time_ID=false,e=>e.policy.free_child_ticket_required=false,e=>e.policy.same_day_return_with_ticket=false,e=>e.scenarios[1].child_ages=[13,16],e=>e.source_urls[0]+='?token=synthetic',e=>e.observed_on='2026-10-11',e=>e.published_on='2026-10-10',e=>e.refresh_days=30,e=>e.currency='EUR',e=>e.source_status='blocked-unverified']) {
  const invalid=structuredClone(momaEvidence);mutate(invalid);assert.throws(()=>momaBudget(invalid));
 }
 assert.throws(()=>momaBudget(momaEvidence,'2026-02-30'));
});
