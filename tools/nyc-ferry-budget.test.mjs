import test from 'node:test';
import assert from 'node:assert/strict';
import {ferryEvidence,ferryBudget,ferryComparison,ferryReviewClock} from './nyc-ferry-budget.mjs';
test('NYC Ferry observed and announced standard four-rider single budgets retain exact cents and evidence states',()=>{
 const before=structuredClone(ferryEvidence),s=ferryBudget().scenarios;
 assert.deepEqual(s.map(r=>[r.single_cents,r.one_way_party_cents,r.return_party_cents]),[[450,1800,3600],[500,2000,4000]]);
 assert.deepEqual(s.map(r=>r.state),['observed','announced']);assert.equal(ferryEvidence.policy.round_trip_free_transfer,false);assert.deepEqual(ferryEvidence,before);
 const c=ferryComparison();assert.match(c.note,/all over 44 inches/);assert.match(c.note,/not checkout totals or the cheapest/);assert.match(c.rule,/not a return trip/);assert.match(c.rule,/No student or other discount/);assert.match(c.rule,/not an observed future checkout/);assert.match(c.conflict,/older USD 4.00/);
});
test('NYC Ferry effective-day clock never promotes announced evidence or exposes unobserved historical budgets',()=>{
 for(const today of ['2026-10-18','2026-10-19','2026-11-01']){const c=ferryReviewClock(today);assert.equal(c.freshness.due_on,'2026-10-19');assert.equal(c.announced_state,'announced-not-observed');assert.equal(ferryBudget(undefined,today).scenarios[1].state,'announced');}
 assert.equal(ferryReviewClock('2026-10-18').freshness.state,'within-review-interval');assert.equal(ferryReviewClock('2026-10-19').freshness.state,'review-due');assert.deepEqual(ferryBudget(undefined,'2026-10-09').scenarios,[]);assert.equal(ferryReviewClock('2026-10-09').evidence_state,'not-yet-observed-at-report-date');
});
test('NYC Ferry changed fare/date/source/party/transfer and provenance fail closed',()=>{
 for(const change of [e=>e.fares[0].single_cents=400,e=>e.fares[1].state='observed',e=>e.fares[1].effective_on='2026-10-18',e=>e.party.standard_fare_riders=3,e=>e.party.discounts_assumed=true,e=>e.party.all_riders_over_44_inches=false,e=>e.policy.round_trip_free_transfer=true,e=>e.policy.one_way_transfer_minutes=60,e=>e.source_urls[1]='https://example.com/',e=>e.source_publication_dates[1]=null,e=>e.observed_on='2026-10-11',e=>e.refresh_days=14,e=>e.currency='CAD',e=>e.source_status='unavailable',e=>e.conflict.legacy_single_cents=450]){const e=structuredClone(ferryEvidence);change(e);assert.throws(()=>ferryBudget(e),/requalification/);}
 assert.throws(()=>ferryReviewClock('invalid'));
});
