import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {execFileSync, spawnSync} from "node:child_process";
import {fileURLToPath} from "node:url";
import {assessNycChildFare, assessFamilyTransit} from "./family-transit-cost.mjs";
import {omnyComparison, omnyEvidence} from "./nyc-omny-budget.mjs";

const path = new URL("../docs/research/nyc-child-height-fare-2026-10-15.json",import.meta.url);
const evidence = JSON.parse(readFileSync(path));
const policy = evidence.policy;
const input = {fare_paying_adults:2, child_heights_inches:[43,50], separately_charged_trips:2,
  travel_together:true, visit_date:"2026-10-20"};
const assess = (patch = {}, record = policy, asOf = "2026-10-15") => assessNycChildFare(record,{...input,...patch},asOf);

test("mixed heights produce conditional uncapped family arithmetic, not age discounts",()=>{
  const row=assess();
  assert.equal(row.free_children_within_published_allowance,1);
  assert.equal(row.paying_riders,3);
  assert.equal(row.family_fare_per_trip_cents,900);
  assert.equal(row.family_total_cents,1800);
  assert.equal(row.status,"CONDITIONAL_UNCAPPED_FARE");
  assert.equal(row.actual_trip_cost,null); assert.equal(row.capped_total_cents,null);
  assert.match(row.unit,/family\/requested separately charged/);
});

test("exact44 conflict is preserved between agreeing lower and higher heights",()=>{
  assert.equal(assess({child_heights_inches:[43.999]}).free_children_within_published_allowance,1);
  const exact=assess({child_heights_inches:[44]});
  assert.deepEqual(exact.child_classifications,["boundary-conflict"]);
  assert.equal(exact.unresolved_child_fares,1);
  assert.equal(exact.paying_riders,null); assert.equal(exact.family_total_cents,null);
  assert.equal(exact.family_fare_per_trip_cents,null);
  assert.equal(exact.boundary_conflict.resolution,"operator-clarification-required");
  const above=assess({child_heights_inches:[44.001]});
  assert.equal(above.free_children_within_published_allowance,0);
  assert.equal(above.family_total_cents,1800);
});

test("unknown heights and excess children do not become free or a complete partial budget",()=>{
  const unknown=assess({child_heights_inches:[null,50]});
  assert.equal(unknown.known_regular_riders,3);
  assert.equal(unknown.family_total_cents,null);
  const excess=assess({fare_paying_adults:1,child_heights_inches:[40,41,42,43]});
  assert.equal(excess.free_children_within_published_allowance,3);
  assert.equal(excess.excess_below_threshold_children,1);
  assert.equal(excess.unresolved_child_fares,1);
  assert.equal(excess.status,"UNRESOLVED_CHILD_FARE");
  assert.equal(excess.family_total_cents,null);
  assert.equal(assess({child_heights_inches:[40,41,42,43]}).family_total_cents,1200);
});

test("unknown trips and source review boundary suppress complete totals",()=>{
  const unknown=assess({separately_charged_trips:null});
  assert.equal(unknown.family_fare_per_trip_cents,900);
  assert.equal(unknown.family_total_cents,null); assert.equal(unknown.status,"UNKNOWN_TRIP_COUNT");
  assert.equal(assess({visit_date:"2026-10-28"}).needs_recheck,false);
  for(const [patch,date] of [[{visit_date:"2026-10-29"},"2026-10-15"],[{visit_date:"2026-10-30"},"2026-10-29"]]) {
    const row=assess(patch,policy,date);
    assert.equal(row.status,"RECHECK_SOURCE");
    assert.equal(row.family_fare_per_trip_cents,null); assert.equal(row.family_total_cents,null);
    assert.equal(row.inspected_on,"2026-10-15");
  }
});

test("malformed, age-only and unaccompanied inputs fail closed",()=>{
  for(const patch of [{fare_paying_adults:0},{fare_paying_adults:11},{fare_paying_adults:1.5},
    {child_heights_inches:[0]},{child_heights_inches:[-1]},{child_heights_inches:[97]},
    {child_heights_inches:["43"]},{child_heights_inches:[Infinity]}, {child_heights_inches:[NaN]},
    {child_heights_inches:Array(2)},{child_heights_inches:[43,,50]},{child_ages:[3,10]},
    {travel_together:false},{separately_charged_trips:undefined},{separately_charged_trips:0},
    {separately_charged_trips:101},{visit_date:"2026-02-30"},{visit_date:"2026-10-14"}])
    assert.throws(()=>assess(patch));
  assert.throws(()=>assess({},policy,"2026-10-14"));
  assert.throws(()=>assess({},policy,"2026-1-15"));
  assert.throws(()=>assess({}, {...policy,recheck_on:policy.inspected_on}));
  assert.throws(()=>assess({visit_date:"2026-01-02"},
    {...policy,inspected_on:"2026-01-01",recheck_on:"2026-01-15"},"2026-01-01"));
});

test("inherited values, accessors and custom iterators are not executed",()=>{
  let called=false;
  const object={...input};Object.defineProperty(object,"fare_paying_adults",{get(){called=true;return 2;}});
  assert.throws(()=>assessNycChildFare(policy,object,"2026-10-15"));assert.equal(called,false);
  assert.throws(()=>assessNycChildFare(policy,Object.assign(Object.create(input),{fare_paying_adults:2}),"2026-10-15"));
  const values=[43,50];values[Symbol.iterator]=function*(){called=true;yield 1;};
  assert.throws(()=>assess({child_heights_inches:values}));assert.equal(called,false);
  const accessor=[43,50];Object.defineProperty(accessor,0,{get(){called=true;return 1;}});
  assert.throws(()=>assess({child_heights_inches:accessor}));assert.equal(called,false);
});

test("a changed maintained boundary, fare or provenance requires requalification",()=>{
  for(const patch of [{fare_cents:290},{threshold_inches:45},{threshold_conflict:false},
    {free_children_per_paying_adult:4},{kind:"dc"},{currency:"EUR"},
    {visitor_source:{...policy.visitor_source,url:"https://example.com"}},
    {tariff_source:{...policy.tariff_source,height_comparison:"lt"}},
    {tariff_source:{...policy.tariff_source,effective_on:"2026-01-05"}}]) assert.throws(()=>assess({}, {...policy,...patch}));
});

test("results cannot mutate heights, source identity or conflict semantics",()=>{
  const heights=[43,50], row=assess({child_heights_inches:heights});
  row.child_heights_inches[0]=44;row.child_classifications[0]="changed";row.source_urls[0]="changed";
  row.boundary_conflict.resolution="guessed";
  assert.deepEqual(heights,[43,50]);assert.equal(assess().source_urls[0],policy.visitor_source.url);
  assert.equal(assess().boundary_conflict.resolution,"operator-clarification-required");
  assert.equal(assess().future_service_confirmed,false);assert.equal(assess().stroller_or_safety_assessed,false);
});

test("existing offline transit CLI dispatches NYC policy without changing DC behavior",()=>{
  const script=fileURLToPath(new URL("./family-transit-cost.mjs",import.meta.url));
  const args=[script,fileURLToPath(path),JSON.stringify(input),"2026-10-15"];
  assert.deepEqual(JSON.parse(execFileSync(process.execPath,args,{encoding:"utf8"})),assess());
  const failure=spawnSync(process.execPath,[script,fileURLToPath(path),JSON.stringify({...input,child_ages:[3]}),"2026-10-15"],{encoding:"utf8"});
  assert.equal(failure.status,1);assert.equal(failure.stdout,"");
  const dcPath=new URL("../docs/research/dc-family-transit-cost-2026-10-03.json",import.meta.url);
  const dc=JSON.parse(readFileSync(dcPath));
  const task={adults:2,child_ages:[4,8,12],rail_trips:2,fare_period:"weekday-day",one_way_fare_cents:null,fare_product:"regular-pay-as-you-go"};
  const output=JSON.parse(execFileSync(process.execPath,[script,fileURLToPath(dcPath),JSON.stringify(task),"2026-10-03"],{encoding:"utf8"}));
  assert.deepEqual(output,assessFamilyTransit(dc.policy,task,"2026-10-03"));
});

test("dated desk tasks execute while original OMNY/public scope is preserved",()=>{
  for(const row of evidence.tasks){const result=assessNycChildFare(policy,row.input,"2026-10-15");
    assert.equal(result.family_total_cents,row.family_total_cents);assert.equal(result.status,row.status);}
  assert.equal(evidence.public_release,false);
  assert.equal(omnyEvidence.observed_on,"2026-10-10");
  assert.deepEqual(omnyComparison().rows.map(row=>row.slice(1)),[
    ["USD 96.00","USD 96.00","USD 0.00"],["USD 140.00","USD 161.00","USD 21.00"]]);
  assert.equal(evidence.community_question.classification,"COMMUNITY_QUESTION_NOT_POLICY_OR_REVIEW");
  assert.doesNotMatch(evidence.community_question.public_safe_paraphrase,/u\/|medical|username/);
});
