import test from 'node:test';
import assert from 'node:assert/strict';
import { spygamesPolicy, spygamesPolicyClock, spygamesPolicyEvidence } from './nyc-spygames-policy.mjs';

test('SPYGAMES accompaniment stays product-specific with unknown adult qualification',()=>{
  const original=structuredClone(spygamesPolicyEvidence),p=spygamesPolicy().evidence.policy;
  assert.equal(p.under_age,16);assert.equal(p.adult_accompaniment,true);assert.equal(p.product,'SPYGAMES');
  assert.equal(p.adult_throughout,null);assert.equal(p.adult_minimum_age,null);assert.equal(p.independent_16_17_entry,'not-established');assert.equal(p.spyscape_museum_supervision,'not-established');
  assert.equal(spygamesPolicyEvidence.family_task.human_tested,false);assert.deepEqual(spygamesPolicyEvidence,original);
});
test('SPYGAMES review boundary and historical report never renew facts',()=>{
  assert.equal(spygamesPolicyClock('2026-11-08').freshness.state,'within-review-interval');
  assert.equal(spygamesPolicyClock('2026-11-09').freshness.state,'review-due');
  assert.equal(spygamesPolicyClock('2026-10-10').freshness.due_on,'2026-11-09');
  assert.equal(spygamesPolicyClock('2026-10-09').evidence_state,'not-yet-observed-at-report-date');
  assert.equal(spygamesPolicyClock('2026-10-09').freshness.state,'future-date-review');
});
test('SPYGAMES policy/provenance changes fail closed rather than widening permission',()=>{
  for(const mutate of [e=>e.policy.product='SPYSCAPE',e=>e.policy.under_age=18,e=>e.policy.adult_accompaniment=false,e=>e.policy.adult_throughout=true,e=>e.policy.adult_minimum_age=18,e=>e.policy.independent_16_17_entry=true,e=>e.policy.spyscape_museum_supervision=true,e=>e.sources[0].url+='?token=synthetic',e=>e.sources=[],e=>e.sources[1].observed_on='2026-10-09',e=>e.sources[0].updated_on='2026-10-10',e=>e.next_review_due='2026-11-10',e=>e.public_copy.faq='']){
    const invalid=structuredClone(spygamesPolicyEvidence);mutate(invalid);assert.throws(()=>spygamesPolicy(invalid));
  }
  assert.throws(()=>spygamesPolicy(spygamesPolicyEvidence,'2026-02-30'));
});
