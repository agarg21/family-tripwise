import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {validateRoomPack,screenRoomPack} from './family-room-task.mjs';
import {validateRoomPrices} from './family-room-price.mjs';
import {roomComparisonCsv} from './family-room-comparison.mjs';
const file=n=>new URL('../docs/research/'+n,import.meta.url);
const pack=JSON.parse(readFileSync(file('boston-room-configurations-2026-10-01.json')));
const prices=JSON.parse(readFileSync(file('boston-fenway-price-observation-2026-10-03.json')));
const original=JSON.parse(readFileSync(file('boston-park-plaza-price-observation-2026-10-01.json')));
const audit=JSON.parse(readFileSync(file('boston-fenway-family-task-2026-10-03.json')));
const rows=(party=pack.scenario,date='2026-10-03',samples=prices)=>screenRoomPack(pack,party,date,samples);
const positive='boston-fenway-two-bedroom-tobt',negative='boston-fenway-one-bedroom-onbt';
const find=(list,id)=>list.find(r=>r.id===id);
test('Boston Fenway exact categories retain independent source dates and cooking controls',()=>{
  assert.deepEqual(validateRoomPack(pack),[]);assert.deepEqual(validateRoomPrices(prices,pack),[]);
  assert.equal(pack.records.length,7);assert.equal(pack.sources.park.checked_on,'2026-10-01');assert.equal(pack.sources.copley.checked_on,'2026-10-03');
  assert.equal(find(pack.records,positive).configurations[0].maximum,6);assert.equal(find(pack.records,negative).configurations[0].maximum,4);
  for(const id of [positive,negative])assert.equal(find(pack.records,id).kitchen,'published-kitchen');
  assert.match(find(pack.records,positive).sleeping_setup,/table seats4/);assert.equal(audit.decision.city_launch_approved,false);
});
test('Fenway cooking does not expand exact limits or imply booked allocation',()=>{
  assert.equal(find(rows(),positive).screening,'CONDITIONAL_PUBLISHED_CAPACITY');assert.equal(find(rows(),negative).screening,'OUTSIDE_PUBLISHED_LIMIT');
  assert.equal(find(rows({...pack.scenario,child_ages:[4,8]}),negative).screening,'WITHIN_PUBLISHED_CAPACITY');
  assert.equal(find(rows({...pack.scenario,child_ages:[4,8,12,15]}),positive).screening,'CONDITIONAL_PUBLISHED_CAPACITY');
  assert.equal(find(rows({...pack.scenario,child_ages:[1,4,8,12,15]}),positive).screening,'OUTSIDE_PUBLISHED_LIMIT');
  assert.equal(find(rows({...pack.scenario,child_ages:[0,4,8]}),negative).screening,'OUTSIDE_PUBLISHED_LIMIT');
});
test('Exact-age pre-tax flexible sample retains price, unknown cutoffs and fee limits',()=>{
  const p=find(rows(),positive).price;assert.equal(p.status,'dated-stay-samples');assert.equal(p.amount_from,781);assert.equal(p.amount_to,781);assert.equal(p.rates[0].stay_amount,3905);
  assert.deepEqual(p.engine_party.child_ages,[4,8,12]);assert.equal(p.engine_party.adult_from_age,null);assert.equal(p.age_input_mode,'individual-ages');
  assert.match(p.fee_basis,/unchecked/);assert.match(p.fee_basis,/Mandatoryfee\/tax amounts/);assert.match(p.deposit_basis,/unknown/);
  assert.equal(audit.budget_gate.final_all_fee_stay,null);assert.equal(audit.budget_gate.alternative_sale.included_in_normalized_public_prices,false);assert.equal(p.rates.length,1);
});
test('Fenway price does not migrate across ages or dates and becomes historical',()=>{
  for(const party of [{...pack.scenario,child_ages:[4,8,13]},{...pack.scenario,stay:{arrival:'2026-11-09',departure:'2026-11-14'}}]) assert.equal(find(rows(party),positive).price.status,'not-observed');
  assert.equal(find(rows(pack.scenario,'2026-10-18'),positive).price.status,'historical-dated-stay-samples');
  assert.equal(find(rows(pack.scenario,'2026-11-03'),positive).screening,'RECHECK_SOURCE');
  assert.equal(find(rows(),negative).price.amount,null);
});
test('Schema3 exact-age price rejects inferred classification and category/currency drift',()=>{
  for(const mutate of [p=>p[0].engine_party.adult_from_age=18,p=>p[0].engine_party.child_ages=[4,8,13],p=>p[0].record_id=negative,p=>p[0].currency='GBP']){
    const copy=structuredClone(prices);mutate(copy);assert.ok(validateRoomPrices(copy,pack).length);assert.throws(()=>rows(pack.scenario,'2026-10-03',copy));
  }
});
test('Combined Boston CSV and CLI preserve both dated price bases and partial fee warning',()=>{
  const samples=[...original,...prices],before=JSON.stringify([pack,samples]);
  const csv=roomComparisonCsv(pack,pack.scenario,'2026-10-03',samples);assert.equal(csv.trimEnd().split('\n').length,10);
  assert.match(csv,/"781"/);assert.match(csv,/"3905"/);assert.match(csv,/unchecked/);assert.match(csv,/"528.68"/);assert.doesNotMatch(csv,/"663"|"3319"/);
  assert.equal(find(rows(pack.scenario,'2026-10-03',samples),'boston-park-plaza-deluxe-double').price.observed_on,'2026-10-01');
  const cli=execFileSync(process.execPath,[fileURLToPath(new URL('./family-room-comparison.mjs',import.meta.url)),fileURLToPath(file('boston-room-configurations-2026-10-01.json')),'--date','2026-10-03','--prices',fileURLToPath(file('boston-park-plaza-price-observation-2026-10-01.json')),fileURLToPath(file('boston-fenway-price-observation-2026-10-03.json'))],{encoding:'utf8'});
  assert.equal(cli,csv);assert.equal(JSON.stringify([pack,samples]),before);
});
