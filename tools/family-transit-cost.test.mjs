import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { assessFamilyTransit } from "./family-transit-cost.mjs";
const path = new URL("../docs/research/dc-family-transit-cost-2026-10-03.json", import.meta.url);
const evidence = JSON.parse(readFileSync(path));
const inputs = {adults:2,child_ages:[4,8,12],rail_trips:2,fare_period:"weekday-day",one_way_fare_cents:null,fare_product:"regular-pay-as-you-go"};
const assess = (value=inputs,policy=evidence.policy,date="2026-10-03") => assessFamilyTransit(policy,value,date);
test("DC named family has four regular riders and conditional18-54 extra-trip band",()=>{
  const out=assess();assert.equal(out.free_children,1);assert.equal(out.paying_riders,4);
  assert.equal(out.minimum,18);assert.equal(out.maximum,54);assert.equal(out.actual_trip_cost,null);
  assert.equal(out.hotel_return_feasible,"UNKNOWN");assert.equal(out.actual_route,null);
  assert.equal(out.estimate_status,"CONDITIONAL_NETWORK_BAND");assert.equal(out.future_service_confirmed,false);
  assert.equal(assess({...inputs,rail_trips:4}).minimum,36);
  assert.equal(assess({...inputs,rail_trips:4}).maximum,108);
});
test("weekend and late hypotheses retain18-20 band without future service guarantee",()=>{
  for(const fare_period of ["weekend","weekday-late"]) {
    const out=assess({...inputs,fare_period});assert.equal(out.minimum,18);assert.equal(out.maximum,20);
    assert.equal(out.actual_trip_cost,null);assert.equal(out.future_service_confirmed,false);
  }
});
test("age5 boundary and excess young-child fares do not get invented discounts",()=>{
  const five=assess({...inputs,child_ages:[5,8,12]});assert.equal(five.free_children,0);assert.equal(five.paying_riders,5);
  assert.equal(five.minimum,22.5);
  const two=assess({...inputs,adults:1,child_ages:[0,4]});assert.equal(two.free_children,2);assert.equal(two.paying_riders,1);
  const extra=assess({...inputs,adults:1,child_ages:[0,1,4]});assert.equal(extra.unresolved_child_fares,1);
  assert.equal(extra.paying_riders,null);assert.equal(extra.minimum,null);assert.equal(extra.maximum,null);
  assert.equal(extra.estimate_status,"UNKNOWN_INPUTS");
});
test("unknown trip count and stale source cannot become zero or fresh November fare",()=>{
  const unknown=assess({...inputs,rail_trips:null});assert.equal(unknown.minimum,null);assert.equal(unknown.maximum,null);
  assert.equal(unknown.estimate_status,"UNKNOWN_INPUTS");
  assert.equal(assess(inputs,evidence.policy,"2026-11-02").estimate_status,"CONDITIONAL_NETWORK_BAND");
  const stale=assess(inputs,evidence.policy,"2026-11-03");assert.equal(stale.estimate_status,"RECHECK_SOURCE");
  assert.equal(stale.minimum,null);assert.equal(stale.maximum,null);
  assert.throws(()=>assess(inputs,evidence.policy,"2026-10-02"));
});
test("selected fare is integer-cent hypothetical arithmetic, not an observed quote",()=>{
  const out=assess({...inputs,one_way_fare_cents:265});assert.equal(out.minimum,21.2);
  assert.equal(out.maximum,21.2);assert.equal(out.estimate_status,"CONDITIONAL_USER_FARE");
  assert.equal(out.actual_trip_cost,null);assert.match(out.limitation,/hypothetical/);
  for(const value of [undefined,0,224,676,2.25,"225",Infinity,NaN])
    assert.throws(()=>assess({...inputs,one_way_fare_cents:value}));
});
test("malformed or inherited fare/age inputs fail without discounts or iterator substitution",()=>{
  for(const change of [{rail_trips:0},{rail_trips:undefined},{rail_trips:101},{rail_trips:1.5},
    {adults:0},{child_ages:[18]},{child_ages:[null]},{fare_period:"holiday"},{fare_product:"student"},
    {transfer_discount:225},{child_ages:new Array(3)},{child_ages:[4,,12]}])
    assert.throws(()=>assess({...inputs,...change}));
  let called=false;const accessor={...inputs};Object.defineProperty(accessor,"rail_trips",{get(){called=true;return 2;}});
  assert.throws(()=>assess(accessor));assert.equal(called,false);
  const ages=[4,8,12];ages[Symbol.iterator]=function*(){yield* [0,1,2];};
  assert.throws(()=>assess({...inputs,child_ages:ages}));
  assert.throws(()=>assess(Object.assign(Object.create(inputs),{adults:2})));
});
test("maintained source and fare bounds reject unavailable provenance and malformed bands",()=>{
  for(const mutate of [p=>p.source.status="unavailable",p=>p.source.effective_on="2026-11-03",
    p=>p.source.published_on=undefined,p=>p.source.url="http://www.wmata.com/pay.html",
    p=>p.source.url="https://user:secret@www.wmata.com/pay.html",p=>p.source.url+="?token=x",
    p=>p.source.url={},p=>p.currency=null,p=>p.rail_fare_bands.weekend.minimum_cents=0,
    p=>p.rail_fare_bands.weekend.maximum_cents=224,p=>delete p.rail_fare_bands.weekend]) {
    const copy=structuredClone(evidence.policy);mutate(copy);assert.throws(()=>assess(inputs,copy));
  }
});
test("transit CLI matches API with paths containing spaces and invalid inputs exit nonzero",()=>{
  const script=fileURLToPath(new URL("./family-transit-cost.mjs",import.meta.url));
  const args=[script,fileURLToPath(path),JSON.stringify(inputs),"2026-10-03"];
  const stdout=execFileSync(process.execPath,args,{encoding:"utf8"});
  assert.deepEqual(JSON.parse(stdout),assess());
  assert.throws(()=>execFileSync(process.execPath,[...args,"extra"],{stdio:"pipe"}));
  assert.throws(()=>execFileSync(process.execPath,[script,fileURLToPath(path),'{"adults":0}',"2026-10-03"],{stdio:"pipe"}));
});
