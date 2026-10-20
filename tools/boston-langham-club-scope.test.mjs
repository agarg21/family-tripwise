import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>JSON.parse(readFileSync(new URL('../'+p,import.meta.url)));
const r=read('docs/research/boston-langham-club-party-scope-2026-10-20.json');
test('club places are distinct from room capacity and actual allocation',()=>{
  assert.equal(r.category.published_guest_capacity,6);assert.equal(r.club_policy.included_guest_places,2);
  assert.equal(r.club_policy.included_guest_allocation,null);assert.equal(r.club_policy.actual_party_entitlement_confirmed,false);
  assert.deepEqual(r.scenario.child_ages,[4,8,12]);assert.deepEqual(r.scenario.additional_priced_child_ages,[8,12]);
  assert.equal(r.club_policy.adult_from_age,17);assert.equal(r.club_policy.child_age_from,5);assert.equal(r.club_policy.child_age_to,16);
  assert.equal(r.club_policy.under_5_published_charge_cents,0);assert.equal(r.club_policy.tax_excluded,true);
  assert.deepEqual(r.club_policy.low_season,{adult_cents:18000,child_cents:7500});
  assert.deepEqual(r.club_policy.high_season,{adult_cents:21500,child_cents:9000});
  assert.equal(r.club_policy.season_calendar,null);assert.equal(r.category.complete_bed_allocation,null);assert.equal(r.category.suite_price,null);
});
test('conditional add-on components retain tax season and day-count unknowns',()=>{
  for(const c of r.desk_cases.slice(0,2)) {
    for(const season of ['low_season','high_season']) assert.equal(c[season+'_component_cents'],c.selected_access_days*c.additional_children*r.club_policy[season].child_cents);
    assert.equal(c.tax_cents,null);assert.equal(c.actual_total_cents,null);
  }
  assert.equal(r.desk_cases[1].days_are_not_inferred_from_nights,true);assert.equal(r.scenario.automatically_inferred_access_days,null);
  assert.equal(r.desk_cases[2].low_season_component_cents,null);assert.equal(r.desk_cases[2].high_season_component_cents,null);
  assert.match(r.scenario.hypothetical_included_allocation,/not confirmed/);assert.match(r.scenario.hypothetical_under_5_application,/unconfirmed/);
});
test('new source scope does not renew original room price review or public clocks',()=>{
  assert.equal(r.checked_on,'2026-10-20');assert.equal(r.recheck_on,'2026-11-03');
  for(const s of r.sources){assert.equal(s.inspected_on,r.checked_on);assert.equal(s.published_on,null);assert.equal(new URL(s.url).protocol,'https:');}
  const floor=r.sources.find(s=>s.id==='floorplan');assert.equal(floor.status,'empty-extracted-body');assert.equal(floor.http_status,null);assert.equal(floor.layout_verified,false);assert.equal(floor.retry_performed,false);
  const old=read(r.preservation.original_room_pack);assert.equal(old.checked_on,'2026-10-03');assert.equal(old.sources.langham.checked_on,'2026-10-01');
  assert.ok(old.records.find(x=>x.id==='boston-langham-club-two-bedroom').configurations[0].conditions.length);
  for(const k of ['original_pack_renewed','prior_price_or_review_clock_changed','public_change']) assert.equal(r.preservation[k],false);
  assert.equal(r.preservation.contact_booking_paid_calls,0);
});
