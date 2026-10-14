import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {sourceSignals} from './evidence-audit.mjs';
const config=JSON.parse(readFileSync(new URL('../ops/evidence-watch.json',import.meta.url)));
const records=config.records.filter(r=>r.id.startsWith('dana-'));
const record=id=>records.find(r=>r.id===`dana-${id}-predicate`);
const state=(id,html)=>sourceSignals(html,[{id:record(id).id,pattern:record(id).pattern}]).fields[0].state;
const present='expected-text-present',missing='expected-text-missing-review';
const rooms='<h3>San Diego Hotel Rooms</h3><p>1 King or 2 Queens | Max Occ: 4 | 300 SQ FT</p><h3>Sunset Park View Junior Suite</h3><p>1 King or 2 Queens | Max Occ: 6 | 450 SQ FT</p>';
const equipment='<p>No we do not provide rooms with kitchens; our inventory includes refrigerators, and microwaves.</p>';
const resort='<p>$25 plus tax per night resort fee.</p>';
const parking='<p>Self-parking costs $35 per night.</p>';
const hold='<p>Your card is authorized for a stay and $50 per day for incidentals.</p>';
test('pure: six Dana watches keep source scope and original field clocks, not room quote dates',()=>{
  assert.equal(records.length,6);assert.equal(new Set(records.map(r=>r.id)).size,6);
  for(const r of records){assert.equal(r.page_url,'https://familytripwise.com/where-to-stay/san-diego-family-hotels.html');assert.equal(r.source_urls.length,1);assert.ok(r.basis.length>100);assert.equal(r.interval_days,30);}
  for(const id of ['standard-room-capacity','junior-suite-capacity']){assert.equal(record(id).verified_on,null);assert.deepEqual(record(id).source_urls,['https://thedana.com/san-diego-accommodations/']);}
  assert.equal(record('meal-equipment').verified_on,'2026-08-17');
  for(const id of ['resort-fee','self-parking-fee','incidental-hold'])assert.equal(record(id).verified_on,'2026-10-08');
  assert.ok(records.every(r=>!r.field.includes('nightly-price')));
});
test('pure: room titles bind capacity to that displayed category, not the next category',()=>{
  assert.equal(state('standard-room-capacity',rooms),present);assert.equal(state('junior-suite-capacity',rooms),present);
  assert.equal(state('standard-room-capacity',rooms.replace('Max Occ: 4','Max Occ: 3')),missing);
  assert.equal(state('junior-suite-capacity',rooms.replace('Max Occ: 6','Max Occ: 4')),missing);
  assert.equal(state('junior-suite-capacity',rooms.replace('Sunset Park View Junior Suite','Bay View Junior Suite')),missing);
  assert.equal(state('standard-room-capacity','San Diego Hotel Rooms Max Occ: 3 Other Room 1 King or 2 Queens | Max Occ: 4 |'),missing);
});
test('pure: kitchen absence plus both meal appliances required, never wet-bar equals kitchen',()=>{
  assert.equal(state('meal-equipment',equipment),present);
  for(const h of [equipment.replace('No we do not','Yes we do'),equipment.replace('microwaves','wet-bars'),equipment.replace('refrigerators','coffee makers'),'All rooms have kitchens, refrigerators, and microwaves.'])assert.equal(state('meal-equipment',h),missing);
});
test('pure: resort amount nightly unit tax and named fee cannot borrow other costs',()=>{
  assert.equal(state('resort-fee',resort),present);
  for(const h of [resort.replace('$25','$30'),resort.replace('night','day'),resort.replace('plus tax','including tax'),resort.replace('resort fee','pet fee'),'<p>$25 per night parking. Resort fee is $40.</p>'])assert.equal(state('resort-fee',h),missing);
});
test('pure: optional parking must retain self-parking amount and nightly unit',()=>{
  assert.equal(state('self-parking-fee',parking),present);
  for(const h of [parking.replace('$35','$40'),parking.replace('night','stay'),parking.replace('Self-parking','Valet parking')])assert.equal(state('self-parking-fee',h),missing);
});
test('pure: incidental authorization is separate from a payable fee and nightly cost',()=>{
  assert.equal(state('incidental-hold',hold),present);
  for(const h of [hold.replace('authorized','charged'),hold.replace('$50','$75'),hold.replace('day','night'),hold.replace('incidentals','parking')])assert.equal(state('incidental-hold',h),missing);
});
test('pure: all positive predicates remain unverified candidates and script-only facts are missing',()=>{
  const html=rooms+equipment+resort+parking+hold,checks=records.map(r=>({id:r.id,pattern:r.pattern}));
  const r=sourceSignals(html,checks);assert.equal(r.fields.length,6);assert.ok(r.fields.every(f=>f.state===present&&f.evidence_class==='EXTRACTION_CANDIDATE'));assert.deepEqual(r.price_candidates,[]);
  for(const tag of ['script','style','noscript'])assert.ok(sourceSignals(`<${tag}>${html}</${tag}><p>Navigation</p>`,checks).fields.every(f=>f.state===missing));
});
test('pure: registered actual baseline keeps full accounting partial and exact field provenance',()=>{
  const packet=JSON.parse(readFileSync(new URL('../ops/evidence-audits/2026-10-14-dana-checkpoint-review.json',import.meta.url)));
  const selection=JSON.parse(readFileSync(new URL('../ops/evidence-collections/2026-10-14-dana-selection.json',import.meta.url)));
  assert.equal(packet.summary.sources,507);assert.equal(packet.summary.completed_outcomes,2);assert.equal(packet.summary.prior_access_holds,154);assert.equal(packet.summary.deferred_sources,351);
  assert.equal(packet.summary.extraction_predicates,6);assert.equal(packet.summary.missing_extraction_predicates,0);
  assert.equal(packet.standard_audit_ready,false);assert.equal(packet.audit,null);assert.equal(packet.review,null);assert.equal(packet.factual_dates_renewed,false);assert.equal(packet.automatic_publication,false);
  assert.equal(packet.plan_sha256,selection.plan_sha256);assert.equal(selection.selected_source_urls.length,2);
  assert.deepEqual(packet.extraction_review_queue.map(r=>r.id),records.map(r=>r.id));
  for(const r of packet.extraction_review_queue){const original=records.find(x=>x.id===r.id);assert.equal(r.state,present);assert.equal(r.claim_verified,false);assert.equal(r.original_verified_on,original.verified_on);assert.equal(r.basis,original.basis);assert.equal(r.evidence_path,original.evidence_path);assert.equal(r.source_url,original.source_urls[0]);assert.match(r.source_text_sha256,/^[a-f0-9]{64}$/);assert.ok(r.source_attempted_at.startsWith('2026-10-14T'));}
});
