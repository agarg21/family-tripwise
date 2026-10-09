import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {validateRoomPack,screenRoomPack} from "./family-room-task.mjs";
import {comparisonHeadings,roomComparisonCsv} from "./family-room-comparison.mjs";
const read=name=>JSON.parse(readFileSync(new URL(`../docs/research/${name}`,import.meta.url),"utf8"));
const pack=read("puerto-vallarta-hilton-room-configurations-2026-10-09.json"),receipt=read("puerto-vallarta-hilton-family-price-gate-2026-10-09.json");
test("Hilton exclusion controls use dated exact official capacity",()=>{
 assert.deepEqual(validateRoomPack(pack),[]);assert.equal(pack.records.length,2);assert.deepEqual(pack.records.map(r=>r.configurations[0].maximum),[4,3]);
 assert.equal(pack.sources["hilton-rooms"].checked_on,"2026-10-09");assert.match(pack.evidence_scope,/Not a whole-property rejection/);
});
test("Five-person task cannot inherit smaller-party prices or suite capacity",()=>{
 const rows=screenRoomPack(pack,pack.scenario,"2026-10-09");assert.equal(rows.length,2);
 for(const r of rows){assert.equal(r.screening,"OUTSIDE_PUBLISHED_LIMIT");assert.equal(r.price.observed_on,null);assert.equal(r.price.rates,undefined);assert.equal(r.price.currency,null);}
 const csv=roomComparisonCsv(pack,pack.scenario,"2026-10-09");assert.equal(csv.trim().split("\n").length,3);assert.ok(csv.includes("OUTSIDE_PUBLISHED_LIMIT"));
 // The shared writer quotes every cell and flattens line breaks.
 const data=csv.trimEnd().split("\n").slice(1).map(line=>[...line.matchAll(/"((?:[^"]|"")*)"(?:,|$)/g)].map(match=>match[1].replaceAll('""','"')));
 assert.ok(data.every(row=>row.length===comparisonHeadings.length&&row[comparisonHeadings.indexOf("Currency")]==="Unknown"&&row[comparisonHeadings.indexOf("Price observed")]===""));
 assert.equal(roomComparisonCsv(pack,pack.scenario,"2026-10-09",[],{capacity:"not-excluded"}).trim().split("\n").length,1);
});
test("Observed UI limit and unperformed quote remain distinct from requested party",()=>{
 assert.deepEqual(receipt.family_task.child_ages,[4,8,12]);assert.equal(receipt.family_task.nights,5);assert.equal(receipt.ui_observation.final_children,2);assert.equal(receipt.ui_observation.third_child_control_disabled,true);
 for(const key of ["requested_party_accepted","individual_ages_entered","requested_stay_entered","quote_flow_opened"])assert.equal(receipt.ui_observation[key],false);
 assert.equal(receipt.price_observation.currency,null);assert.equal(receipt.price_observation.amount,null);assert.deepEqual(receipt.price_observation.rates,[]);assert.match(receipt.ui_observation.limitation,/do not transfer availability/);
});
test("Unpriced currency contract rejects invented observed placeholders",()=>{
 for(const mutate of [p=>p.records[0].price.amount=300,p=>p.records[0].price.observed_on="2026-10-09",p=>p.records[0].price.currency="arbitrary"]){const changed=structuredClone(pack);mutate(changed);assert.ok(validateRoomPack(changed).length);}
});
test("Prior Hyatt source dates and candidate remain unchanged and separate",()=>{
 const old=read("puerto-vallarta-room-configurations-2026-10-03.json");assert.equal(old.checked_on,"2026-10-03");assert.equal(old.records.length,5);assert.equal(old.records[2].configurations[0].maximum,7);assert.equal(old.records[2].price.currency,null);
 assert.match(receipt.next_falsification_trigger,/primary named larger/);assert.match(receipt.decision,/PRESERVE PV publication/);
});
