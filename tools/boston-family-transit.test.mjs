import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {validateRoomPack,screenRoomPack} from './family-room-task.mjs';
import {roomComparisonCsv,roomComparisonsCsv} from './family-room-comparison.mjs';
const f=n=>new URL('../docs/research/'+n,import.meta.url);
const data=n=>JSON.parse(readFileSync(f(n)));
const e=data('boston-family-transit-budget-2026-10-03.json');
const pack=data('boston-room-configurations-2026-10-01.json');
const prices=[...data('boston-park-plaza-price-observation-2026-10-01.json'),...data('boston-fenway-price-observation-2026-10-03.json')];
const id='boston-fenway-two-bedroom-tobt';
test('Boston declared-party free-age and regular-rider derivation retain current source limits',()=>{
  assert.deepEqual(e.scenario.child_ages,[4,8,12]);assert.equal(e.scenario.adults,2);
  const free=e.scenario.child_ages.filter(x=>x<=e.policy.free_child_age_lte),paid=e.scenario.child_ages.filter(x=>x>e.policy.free_child_age_lte);
  assert.deepEqual(free,e.outputs.free_child_ages);assert.deepEqual(paid,e.outputs.regular_child_ages);
  assert.equal(e.outputs.regular_fare_riders,e.scenario.adults+paid.length);assert.equal(e.outputs.free_children,2);
  assert.equal(e.policy.free_child_age_lte,11);assert.equal(e.policy.group_registration_children_gte,10);
  assert.equal(e.outputs.field_trip_group_threshold_reached,e.scenario.child_ages.length>=10);
  assert.equal(e.policy.free_children_per_paying_adult,null);assert.equal(e.policy.gate_entry_procedure,null);
  assert.equal(e.sources.children.url,'https://mycharlie.mbta.com/reduced/free');assert.equal(e.sources.children.status,'body-inspected');
  for(const s of Object.values(e.sources)){assert.equal(s.inspected_on,'2026-10-03');assert.equal(s.effective_on,null);assert.equal(s.published_on,null);}
});
test('Blocked numeric fare cannot become a free return or route/rest verdict',()=>{
  assert.equal(e.policy.regular_subway_one_way_amount,null);assert.equal(e.policy.regular_subway_fare_source_status,'blocked-unverified');
  assert.equal(e.scenario.requested_separately_charged_subway_trips,2);assert.equal(e.outputs.regular_fare_riders*2,6);
  assert.match(e.outputs.conditional_expression,/unknown F = 6F/);
  for(const k of ['conditional_subway_total','actual_trip_count','actual_stations','actual_service','actual_route','actual_trip_cost','room_plus_transit_all_fee_total'])assert.equal(e.outputs[k],null);
  assert.equal(e.outputs.hotel_return_feasible,'UNKNOWN');
  for(const k of ['future_service_confirmed','stroller_safety_access_assessed','transfer_or_pass_savings_applied','multiple_riders_on_one_contactless_device_confirmed'])assert.equal(e.outputs[k],false);
  assert.equal(e.blocker.failed_tool,'web.run open https://www.mbta.com/fares');assert.match(e.blocker.result,/robots/);
  assert.equal(e.blocker.attempts,1);assert.equal(e.blocker.mirrors_or_alternate_tools_used,false);
  assert.match(e.blocker.unblock_condition,/no unchanged denial retry/);assert.equal(e.decision.paid_calls,0);
  assert.equal(e.decision.public_change,false);assert.equal(e.decision.new_city_approved,false);
});
test('Dated transit check is exported without changing capacity, price basis or source dates',()=>{
  assert.deepEqual(validateRoomPack(pack),[]);assert.equal(pack.records.length,7);
  const r=pack.records.find(x=>x.id===id);assert.match(r.checks.at(-1),/declared4\/8 free,12 outside band/);assert.match(r.checks.at(-1),/Numeric fare\/transfer\/device\/gate\/actualreturn unknown/);
  const old=structuredClone(pack);old.records.find(x=>x.id===id).checks.pop();
  const parse=s=>s.trimEnd().split('\n').map(line=>[...line.matchAll(/"((?:[^"]|"")*)"(?:,|$)/g)].map(m=>m[1].replaceAll('""','"')));
  const csv=roomComparisonCsv(pack,pack.scenario,'2026-10-03',prices),before=parse(roomComparisonCsv(old,old.scenario,'2026-10-03',prices)),after=parse(csv);
  assert.equal(after.length,10);assert.equal(after[0].length,35);const check=after[0].indexOf('Next checks');
  assert.equal(after[0][check],'Next checks');
  for(let row=0;row<after.length;row++)for(let col=0;col<35;col++)if(col!==check)assert.equal(after[row][col],before[row][col]);
  assert.equal(roomComparisonsCsv([pack],pack.scenario,'2026-10-03',prices),csv);
  const task=screenRoomPack(pack,pack.scenario,'2026-10-03',prices).find(x=>x.id===id);
  assert.equal(task.price.amount_from,781);assert.equal(task.price.rates[0].stay_amount,3905);
  assert.match(task.price.fee_basis,/unchecked/);assert.equal(task.screening,'CONDITIONAL_PUBLISHED_CAPACITY');
  assert.equal(pack.sources.park.checked_on,'2026-10-01');assert.equal(e.preservation.price_date_renewed,false);
});
test('CLI includes retained uncertainty and original same-party pre-tax sample',()=>{
  const cli=execFileSync(process.execPath,[fileURLToPath(new URL('./family-room-comparison.mjs',import.meta.url)),fileURLToPath(f('boston-room-configurations-2026-10-01.json')),'--date','2026-10-03','--prices',fileURLToPath(f('boston-park-plaza-price-observation-2026-10-01.json')),fileURLToPath(f('boston-fenway-price-observation-2026-10-03.json'))],{encoding:'utf8'});
  assert.equal(cli,roomComparisonCsv(pack,pack.scenario,'2026-10-03',prices));
  assert.match(cli,/canonical fare-body robots denial/);assert.match(cli,/"781"/);assert.match(cli,/"3905"/);assert.match(cli,/unchecked/);
});
