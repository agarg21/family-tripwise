import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {validateRoomPack,screenRoomPack} from "./family-room-task.mjs";
import {comparisonHeadings,roomComparisonCsv} from "./family-room-comparison.mjs";
const read=name=>JSON.parse(readFileSync(new URL(`../docs/research/${name}`,import.meta.url),"utf8"));
const pack=read("puerto-vallarta-velas-room-configurations-2026-10-09.json"),receipt=read("puerto-vallarta-velas-family-budget-2026-10-09.json");
const screen=ages=>screenRoomPack(pack,{...pack.scenario,child_ages:ages},"2026-10-09");
test("Exact mixed branches and source-specific kitchen facts validate",()=>{
 assert.deepEqual(validateRoomPack(pack),[]);assert.equal(pack.records.length,2);assert.equal(pack.records[0].source_id,"three-bedroom-es");assert.equal(pack.records[0].kitchen,"published-kitchen");
 assert.deepEqual(pack.records[0].configurations.map(c=>[c.maximum,c.max_adults,c.max_children]),[[7,7,0],[8,6,2]]);assert.match(pack.evidence_scope,/not provider age reclassification/);
});
test("Three requested children are not silently counted as adults or infant",()=>{
 assert.deepEqual(screen([4,8,12]).map(r=>r.screening),["OUTSIDE_PUBLISHED_LIMIT","OUTSIDE_PUBLISHED_LIMIT"]);
 assert.deepEqual(screen([8,12]).map(r=>r.screening),["CONDITIONAL_PUBLISHED_CAPACITY","CONDITIONAL_PUBLISHED_CAPACITY"]);
 assert.match(receipt.capacity_interpretation,/not an exact reservation rejection/);
});
test("Free-through-four pricing never moves published infant0-3 boundary",()=>{
 assert.equal(screen([3,8,12])[1].screening,"CONDITIONAL_PUBLISHED_CAPACITY");assert.equal(screen([4,8,12])[1].screening,"OUTSIDE_PUBLISHED_LIMIT");
 assert.equal(pack.records[1].configurations[0].infant_extension.age_lt,4);assert.match(pack.records[1].checks.join(" "),/Age4 is not an infant/);
});
test("Widget count input is not quote, dates, ages or category acceptance",()=>{
 assert.equal(receipt.ui_observation.count_widget_accepts_entry,true);assert.equal(receipt.ui_observation.children,3);
 for(const key of ["individual_ages_entered","requested_stay_entered","category_accepted","booking_engine_opened","quote_flow_submitted","contact_initiated"])assert.equal(receipt.ui_observation[key],false);
 assert.equal(receipt.price_observation.amount,null);assert.equal(receipt.price_observation.currency,null);assert.equal(receipt.price_observation.observed_on,null);assert.deepEqual(receipt.price_observation.rates,[]);
});
test("Same-record CSV carries unknown price and branch limits; stale sources recheck",()=>{
 const csv=roomComparisonCsv(pack,pack.scenario,"2026-10-09");
 // The shared writer quotes every cell and flattens line breaks.
 const rows=csv.trimEnd().split("\n").map(line=>[...line.matchAll(/"((?:[^"]|"")*)"(?:,|$)/g)].map(m=>m[1].replaceAll('""','"')));
 assert.deepEqual(rows[0],comparisonHeadings);assert.equal(rows.length,3);assert.ok(rows.slice(1).every(r=>r.length===comparisonHeadings.length&&r[comparisonHeadings.indexOf("Currency")]==="Unknown"&&r[comparisonHeadings.indexOf("Price observed")]===""));
 assert.equal(roomComparisonCsv(pack,pack.scenario,"2026-10-09",[],{capacity:"not-excluded"}).trim().split("\n").length,1);
 assert.ok(screenRoomPack(pack,pack.scenario,"2026-11-09").every(r=>r.screening==="RECHECK_SOURCE"));
 for(const mutate of [p=>p.records[0].price.amount=500,p=>p.records[1].price.currency="arbitrary"]){let changed=structuredClone(pack);mutate(changed);assert.ok(validateRoomPack(changed).length);}
});
