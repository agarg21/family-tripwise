import test from 'node:test';
import assert from 'node:assert/strict';
import { summitPolicy, summitPolicyClock, summitPolicyEvidence } from './nyc-summit-policy.mjs';

test('SUMMIT retains source publication clocks and unknown adult/older-teen eligibility', () => {
  const before=structuredClone(summitPolicyEvidence), p=summitPolicy();
  assert.equal(p.evidence.policy.under_age,16);assert.equal(p.evidence.policy.adult_throughout,true);
  assert.equal(p.evidence.policy.adult_minimum_age,null);assert.equal(p.evidence.policy.independent_16_17_entry,'not-established');
  assert.equal(p.evidence.sources[0].updated_on,'2023-06-28');assert.equal(p.evidence.sources[1].updated_on,null);
  assert.equal(p.evidence.family_task.human_tested,false);assert.deepEqual(summitPolicyEvidence,before);
});

test('SUMMIT review boundary and historical state never renew facts', () => {
  assert.equal(summitPolicyClock('2026-11-08').freshness.state,'within-review-interval');
  assert.equal(summitPolicyClock('2026-11-09').freshness.state,'review-due');
  assert.equal(summitPolicyClock('2026-10-10').freshness.due_on,'2026-11-09');
  const historical=summitPolicyClock('2026-10-09');
  assert.equal(historical.evidence_state,'not-yet-observed-at-report-date');
  assert.equal(historical.freshness.state,'future-date-review');assert.equal(historical.freshness.due_on,null);
});

test('SUMMIT changed policy, unsafe provenance and invalid clocks fail closed', () => {
  for(const mutate of [e=>e.policy.under_age=18,e=>e.policy.adult_throughout=false,e=>e.policy.adult_minimum_age=18,e=>e.policy.independent_16_17_entry=true,e=>e.sources[0].url+='?token=synthetic',e=>e.sources=[],e=>e.sources[1].observed_on='2026-10-09',e=>e.sources[0].updated_on='2026-10-10',e=>e.next_review_due='2026-11-10',e=>e.evidence_class='HUMAN_VERIFIED',e=>e.public_copy.faq='']) {
    const invalid=structuredClone(summitPolicyEvidence);mutate(invalid);assert.throws(()=>summitPolicy(invalid));
  }
  assert.throws(()=>summitPolicy(summitPolicyEvidence,'2026-02-30'));
});
