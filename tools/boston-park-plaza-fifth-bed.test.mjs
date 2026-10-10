import test from 'node:test';
import assert from 'node:assert/strict';
import {parkPlazaPolicy,parkPlazaFitnessPolicy,parkPlazaPolicyClock} from './boston-park-plaza-policy.mjs';

test('published maximum is not a fifth sleeping place or priced rollaway',()=>{
  const {bedding,fee}=parkPlazaPolicy;
  assert.equal(bedding.published_maximum,5);assert.equal(bedding.published_double_beds,2);
  assert.equal(bedding.fifth_sleeping_place,'not-established');assert.equal(bedding.rollaway_availability,'not-established');assert.equal(bedding.rollaway_charge,null);
  assert.match(bedding.limitation,/Omission is not a no-rollaway policy/);assert.equal(fee.current_checkout_total,null);
});
test('gym benefit is18plus and cannot waive mandatory fees or create child access',()=>{
  const p=parkPlazaFitnessPolicy();assert.deepEqual(p.excluded_child_ages,[4,8,12]);
  assert.equal(p.evidence.fitness.first_visit_waiver_required,true);assert.equal(p.evidence.fee.displayed_daily_amount,35);
  assert.equal(p.evidence.fee.credit_deducted,false);assert.equal(p.evidence.fee.fee_waiver_assumed,false);
});
test('source clock preserves future-date exclusion and exact review boundary',()=>{
  assert.equal(parkPlazaFitnessPolicy(parkPlazaPolicy,'2026-10-09').excluded_child_ages,null);
  const past=parkPlazaPolicyClock('2026-10-09');assert.equal(past.evidence_state,'not-yet-observed-at-report-date');assert.equal(past.freshness.due_on,null);
  assert.equal(parkPlazaPolicyClock('2026-11-08').freshness.state,'within-review-interval');
  assert.equal(parkPlazaPolicyClock('2026-11-09').freshness.state,'review-due');assert.equal(parkPlazaPolicyClock('2026-10-10').freshness.due_on,'2026-11-09');
});
test('changed identity, source, age, waiver, fee, party and bed basis fail closed without mutation',()=>{
  const saved=structuredClone(parkPlazaPolicy);
  for(const mutate of [r=>r.category='Garden Terrace',r=>r.checked_on='2026-10-11',r=>r.sources[1].url+='?token=synthetic',r=>r.sources[0].observed_on='2026-10-09',r=>r.evidence_class='HUMAN_VERIFIED',r=>r.refresh_days=0,r=>r.fitness.minimum_guest_age=16,r=>r.fitness.first_visit_waiver_required=false,r=>r.fee.displayed_daily_amount=40,r=>r.fee.currency='GBP',r=>r.fee.unit='person',r=>r.fee.fee_waiver_assumed=true,r=>r.fee.current_checkout_total=2224.2,r=>r.scenario.child_ages=[4,8,18],r=>r.bedding.rollaway_charge=0]){const invalid=structuredClone(saved);mutate(invalid);assert.throws(()=>parkPlazaFitnessPolicy(invalid));}
  assert.throws(()=>parkPlazaFitnessPolicy(saved,'2026-02-30'));assert.deepEqual(parkPlazaPolicy,saved);
});
