import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {assessNycFerryFare} from './family-transit-cost.mjs';
const path = new URL('../docs/research/nyc-ferry-effective-fare-2026-10-19.json', import.meta.url);
const record = JSON.parse(readFileSync(path));
const input = {standard_fare_riders:4, separately_charged_directions:2, visit_date:'2026-10-20'};
const assess = (i=input, r=record, date='2026-10-19') => assessNycFerryFare(r, i, date);

test('current ferry singles price each direction without becoming checkout or pass totals', () => {
  const out=assess();
  assert.equal(out.fare_component_cents,4000);
  assert.equal(assess({...input,separately_charged_directions:1}).fare_component_cents,2000);
  assert.equal(out.currency,'USD'); assert.match(out.unit,/standard-fare/);
  assert.equal(out.status,'CONDITIONAL_STANDARD_SINGLE_FARES');
  for(const key of ['complete_checkout_total_cents','tax_fee_inclusion','cheapest_pass_total_cents']) assert.equal(out[key],null);
  for(const key of ['checkout_observed','future_service_confirmed','eligibility_assessed','route_stroller_or_safety_assessed','free_round_trip_transfer']) assert.equal(out[key],false);
  assert.equal(out.one_way_transfer_minutes,120);
  assert.match(out.limitation,/Exactly44-inch/); assert.match(out.limitation,/does not classify/);
});
test('unknown standard eligibility count or direction count withholds the component', () => {
  for(const change of [{standard_fare_riders:null},{separately_charged_directions:null},{standard_fare_riders:null,separately_charged_directions:null}]) {
    const out=assess({...input,...change}); assert.equal(out.fare_component_cents,null); assert.equal(out.status,'UNKNOWN_INPUTS');
  }
});
test('assessment and visit windows never renew or promote dated source evidence', () => {
  assert.equal(assess({...input,visit_date:'2026-11-01'}).fare_component_cents,4000);
  for(const [visit,date] of [['2026-11-02','2026-10-19'],['2026-11-02','2026-11-02'],['2026-11-03','2026-11-03']]) {
    const out=assess({...input,visit_date:visit},record,date);assert.equal(out.status,'RECHECK_SOURCE');assert.equal(out.fare_component_cents,null);
    assert.equal(out.inspected_on,'2026-10-19');assert.equal(out.recheck_on,'2026-11-02');
  }
  assert.throws(()=>assess(input,record,'2026-10-18'));
  assert.throws(()=>assess({...input,visit_date:'2026-10-18'}));
  for(const date of ['2026-02-30','2026-10-19T00:00:00Z',null]) assert.throws(()=>assess(input,record,date));
});
test('current panel, notice and conflicting old prices retain distinct provenance', () => {
  const out=assess();
  assert.deepEqual(out.conflicts.map(c=>[c.single_ticket_cents,c.ten_trip_pack_cents]),[[400,2750],[450,2900]]);
  assert.equal(out.sources[1].published_on,'2026-09-28');assert.equal(out.sources[1].announced_effective_on,'2026-10-19');
  assert.equal(out.sources[2].published_on,null);assert.match(out.sources[2].retrieval_limit,/offline\/read-only/);
  assert.ok(out.sources.every(s=>s.inspected_on==='2026-10-19'));
});
test('invalid inputs cannot silently become free riders, round trips or discounted fares', () => {
  for(const change of [{standard_fare_riders:0},{standard_fare_riders:21},{standard_fare_riders:'4'},{standard_fare_riders:NaN},
    {standard_fare_riders:1.5},{standard_fare_riders:undefined},{separately_charged_directions:0},{separately_charged_directions:3},
    {separately_charged_directions:'2'},{separately_charged_directions:undefined},{child_ages:[4]},{discount:true}]) assert.throws(()=>assess({...input,...change}));
  assert.throws(()=>assess(Object.assign(Object.create(input),{standard_fare_riders:4})));
  let called=false;const accessor={...input};Object.defineProperty(accessor,'standard_fare_riders',{get(){called=true;return 4;}});
  assert.throws(()=>assess(accessor));assert.equal(called,false);
});
test('changed fare, conflicts, source scope and transfer basis require requalification', () => {
  for(const mutate of [r=>r.current_operator_panel.single_ticket_cents=450,r=>r.current_operator_panel.checkout_observed=true,
    r=>r.transfers.round_trip_free_transfer=true,r=>r.transfers.one_way_minutes=180,r=>r.sources[0].status='unavailable',
    r=>r.sources[0].url+='?token=x',r=>r.sources[0].inspected_on='2026-10-20',r=>r.sources[1].published_on=null,
    r=>r.sources[1].announced_effective_on='2026-10-20',r=>r.conflicts.pop(),r=>r.conflicts[1].single_ticket_cents=500,
    r=>r.recheck_on='2026-12-02',r=>r.checked_on='2026-10-20',r=>r.sources=new Array(3)]) {
    const copy=structuredClone(record);mutate(copy);assert.throws(()=>assess(input,copy));
  }
});
test('returned source and conflict rows cannot mutate canonical records or later results', () => {
  const before=JSON.stringify(record),out=assess();out.sources[0].url='https://example.com';out.conflicts[0].single_ticket_cents=0;
  out.conflicts.length=0;assert.equal(JSON.stringify(record),before);assert.equal(assess().conflicts.length,2);
  assert.equal(assess().sources[0].url,record.sources[0].url);
});
test('existing transit CLI consumes reviewed ferry record and rejects extra arguments', () => {
  const script=fileURLToPath(new URL('./family-transit-cost.mjs',import.meta.url));
  const args=[script,fileURLToPath(path),JSON.stringify(input),'2026-10-19'];
  assert.deepEqual(JSON.parse(execFileSync(process.execPath,args,{encoding:'utf8'})),assess());
  assert.throws(()=>execFileSync(process.execPath,[...args,'extra'],{stdio:'pipe'}));
});
