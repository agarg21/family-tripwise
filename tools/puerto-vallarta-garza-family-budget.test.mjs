import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {validateRoomPack,screenRoomPack} from "./family-room-task.mjs";
import {validateRoomPrices,roomPriceForTask} from "./family-room-price.mjs";
import {comparisonHeadings,roomComparisonCsv} from "./family-room-comparison.mjs";
const read=name=>JSON.parse(readFileSync(new URL(`../docs/research/${name}`,import.meta.url),"utf8"));
const pack=read("puerto-vallarta-garza-room-configurations-2026-10-09.json");
const prices=read("puerto-vallarta-garza-family-budget-2026-10-09.json");
test("Exact categories validate without kitchen or price inheritance",()=>{
 assert.deepEqual(validateRoomPack(pack),[]);assert.deepEqual(validateRoomPrices(prices,pack),[]);
 assert.equal(pack.records[0].kitchen,"not-established");assert.equal(pack.records[1].kitchen,"published-kitchen");
 const result=screenRoomPack(pack,pack.scenario,"2026-10-09",prices);
 assert.ok(result.every(r=>r.screening==="CONDITIONAL_PUBLISHED_CAPACITY"));
 assert.equal(result[0].price.amount_from,876.4);assert.equal(result[0].price.amount_to,1176.2);
 assert.equal(result[1].price.status,"not-observed");assert.equal(result[1].price.amount,null);
});
test("Public plan equivalents exclude membership and preserve fee conflicts",()=>{
 const p=roomPriceForTask(prices,pack,pack.records[0].id,pack.scenario,"2026-10-09");
 assert.deepEqual(p.rates.map(r=>r.nightly_average),[876.4,1176.2]);assert.equal(p.excluded_rate_plans.length,2);
 assert.equal(p.engine_party.adult_from_age,18);assert.equal(p.engine_party.child_age_to,12);
 assert.equal(p.requested_individual_ages_confirmed,true);assert.equal(p.currency_evidence_class,"OBSERVED_ISO_CURRENCY");
 assert.match(p.fee_basis,/Tax not included/);assert.match(p.deposit_basis,/35percent/);
 assert.match(p.rates[0].cancellation,/Exact cutoff\/timezone unresolved/);
 assert.equal(Object.hasOwn(p.rates[0],"cancellation_deadline_local_date"),false);
});
test("Schema6 requires a genuine partial band, exact inputs and observed currency",()=>{
 for(const mutate of [o=>o.engine_party.child_age_to=17,o=>o.engine_party.adult_from_age=null,o=>o.engine_party.age_input_mode="provider-age-band-counts",o=>o.engine_party.uncovered_ages_policy="guess",o=>o.currency_basis="",o=>o.currency_evidence_class="EDITORIAL_INTERPRETATION",o=>o.engine_party.child_ages=[4,8]]){
  const changed=structuredClone(prices);mutate(changed[0]);assert.ok(validateRoomPrices(changed,pack).length);
 }
});
test("Uncovered teen or infant ages cannot be silently reclassified",()=>{
 for(const age of [3,13,17]){const changed=structuredClone(prices);changed[0].party.child_ages=[age,8,12];changed[0].engine_party.child_ages=[age,8,12];assert.ok(validateRoomPrices(changed,pack).some(e=>e.includes("uncovered ages")));}
 assert.equal(roomPriceForTask(prices,pack,pack.records[0].id,{...pack.scenario,child_ages:[4,8,13]},"2026-10-09"),null);
});
test("Exact party, stay and category joins fail closed",()=>{
 assert.equal(roomPriceForTask(prices,pack,pack.records[1].id,pack.scenario,"2026-10-09"),null);
 assert.equal(roomPriceForTask(prices,pack,pack.records[0].id,{...pack.scenario,stay:{arrival:"2026-11-09",departure:"2026-11-14"}},"2026-10-09"),null);
 const wrong=structuredClone(prices);wrong[0].category=pack.records[1].category;assert.ok(validateRoomPrices(wrong,pack).length);
 const member=structuredClone(prices);member[0].rates=member[0].rates.filter(r=>r.eligibility==="membership-required");
 assert.equal(roomPriceForTask(member,pack,pack.records[0].id,pack.scenario,"2026-10-09"),null);
});
test("CSV carries two public plans and unpriced kitchen category with dates",()=>{
 const csv=roomComparisonCsv(pack,pack.scenario,"2026-10-09",prices);
 const rows=csv.trimEnd().split("\n").map(line=>[...line.matchAll(/"((?:[^"]|"")*)"(?:,|$)/g)].map(m=>m[1].replaceAll('""','"')));
 assert.deepEqual(rows[0],comparisonHeadings);assert.equal(rows.length,4);assert.ok(rows.every(r=>r.length===comparisonHeadings.length));
 assert.equal(rows[1][comparisonHeadings.indexOf("Currency")],"USD");assert.equal(rows[1][comparisonHeadings.indexOf("Price observed")],"2026-10-09");
 assert.ok(rows.slice(1).every(r=>!r[comparisonHeadings.indexOf("Public rate plan")].includes("Tafer Rewards")));assert.match(csv,/Tax not included/);assert.match(csv,/Sanctuary Two Bedroom Suite/);assert.match(csv,/Two Bedroom Panoramic Suite/);
 const basis=JSON.parse(rows[1][comparisonHeadings.indexOf("Engine party and age basis")]);assert.equal(basis.adult_from_age,18);assert.equal(basis.child_age_to,12);assert.equal(basis.uncovered_ages_policy,"not-established-no-reclassification");
});
test("Historical price and source clocks remain independent",()=>{
 assert.match(roomPriceForTask(prices,pack,pack.records[0].id,pack.scenario,"2026-10-24").status,/^historical-/);
 assert.equal(roomPriceForTask(prices,pack,pack.records[0].id,pack.scenario,"2026-10-08"),null);
 assert.ok(screenRoomPack(pack,pack.scenario,"2026-11-09",prices).every(r=>r.screening==="RECHECK_SOURCE"));
 assert.equal(prices[0].checked_on,"2026-10-09");assert.equal(pack.checked_on,"2026-10-09");
});
test("Observed-budget CSV distinguishes exact-age public plans without booking assurances",()=>{
 const filters={budget:{currency:"USD",nightly_limit:1000}};
 const csv=roomComparisonCsv(pack,pack.scenario,"2026-10-09",prices,filters);
 const rows=csv.trimEnd().split("\n").slice(1);
 assert.match(rows[0],/AT_OR_BELOW_OBSERVED_AMOUNT/);assert.match(rows[1],/ABOVE_OBSERVED_AMOUNT/);assert.match(rows[2],/UNKNOWN_UNPRICED/);
 assert.ok(rows.every(r=>r.includes("not final all-fee budget, booking acceptance")));assert.equal(csv.includes("UNKNOWN_AGE_BASIS"),false);
 const historical=roomComparisonCsv(pack,pack.scenario,"2026-10-24",prices,filters);assert.match(historical,/UNKNOWN_HISTORICAL_PRICE/);assert.equal(historical.includes("AT_OR_BELOW_OBSERVED_AMOUNT"),false);
});
