import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {assessFamilyFoodBudget,foodBudgetFields} from "../src/shared/family-food-budget.mjs";
import {initializeFoodBudget,foodBudgetMessage} from "../src/shared/family-food-budget-form.mjs";
import {pvFoodBudgetBasis,pvFoodBudgetSection,puertoVallartaFamilyResortsPage,pvCsv,writePuertoVallartaFamilyResortsPage} from "./page-generation/puerto-vallarta-family-resorts-page.mjs";
import {pvMealPlanComparison} from "./pv-meal-plan-comparison.mjs";

const read=p=>readFileSync(new URL(`../${p}`,import.meta.url),"utf8");
const config=pvFoodBudgetBasis(),estimate={daily_budget:200,budgeted_days:5};

test("PV food budget derives cents from the guarded same-party stay plans, not renewed prices",()=>{
 assert.deepEqual(config,{increment_cents:149900,maximum_days:6});
 const c=pvMealPlanComparison();assert.equal(c.stay_increment,1499);assert.equal(c.observed_on,"2026-10-09");
 assert.equal(c.review_due,"2026-10-23");assert.equal(c.tax_included,false);assert.equal(c.meal_entitlements,null);
});

test("Blank or partial budget is unknown; explicit zero and cent rounding remain distinct",()=>{
 assert.deepEqual(assessFamilyFoodBudget(config).missing_inputs,foodBudgetFields);
 assert.equal(assessFamilyFoodBudget(config,{daily_budget:200}).alternative_cents,null);
 assert.equal(assessFamilyFoodBudget(config,{...estimate,budgeted_days:null}).comparison,"UNKNOWN");
 assert.equal(assessFamilyFoodBudget(config,{daily_budget:0,budgeted_days:0}).alternative_cents,0);
 assert.equal(assessFamilyFoodBudget(config,{daily_budget:0.29,budgeted_days:3}).alternative_cents,87);
});

test("Whole-family budget compares below/equal/above without predicting meal savings",()=>{
 const below=assessFamilyFoodBudget(config,estimate);assert.equal(below.alternative_cents,100000);
 assert.equal(below.difference_cents,-49900);assert.equal(below.comparison,"below");
 assert.equal(assessFamilyFoodBudget(config,{daily_budget:1499,budgeted_days:1}).comparison,"equal");
 const above=assessFamilyFoodBudget(config,{daily_budget:350,budgeted_days:5});assert.equal(above.difference_cents,25100);
 assert.equal(above.comparison,"above");assert.match(foodBudgetMessage(below),/USD 1000.00.*USD 499.00 below.*USD 1499.00 pre-tax.*Not actual savings/);
 for(let daily=0;daily<=10000;daily+=137)for(let days=0;days<=6;days++)
  assert.equal(assessFamilyFoodBudget(config,{daily_budget:daily/100,budgeted_days:days}).alternative_cents,daily*days);
});

test("Invalid values/config/accessors/extra keys fail before executable coercion",()=>{
 let called=false;const executable={valueOf(){called=true;return 200;}};
 for(const value of [undefined,-1,10001,0.001,1.234,NaN,Infinity,"200",false,executable])
  assert.throws(()=>assessFamilyFoodBudget(config,{...estimate,daily_budget:value}));
 assert.equal(called,false);
 for(const value of [undefined,-1,1.5,7,NaN,Infinity,"5",false])
  assert.throws(()=>assessFamilyFoodBudget(config,{...estimate,budgeted_days:value}));
 for(const value of [null,[],Object.create(estimate),{...estimate,discount:1},{[Symbol("x")]:1},{get daily_budget(){throw Error("no");}}])
  assert.throws(()=>assessFamilyFoodBudget(config,value));
 for(const value of [null,{}, {...config,increment_cents:1.1},{...config,increment_cents:-1},{...config,maximum_days:0},{...config,maximum_days:367},{...config,extra:1}])
  assert.throws(()=>assessFamilyFoodBudget(value,estimate));
 const result=assessFamilyFoodBudget(config,estimate);result.inputs.daily_budget=10;assert.equal(estimate.daily_budget,200);
});

function fixture(basis=config){
 const listeners={},fields=Object.fromEntries(foodBudgetFields.map(k=>[k,{value:""}]));
 const form={hidden:true,elements:{namedItem:k=>fields[k]},addEventListener:(k,f)=>{listeners[k]=f;}};
 const status={textContent:"Unknown"};
 initializeFoodBudget({querySelector:id=>id==="#food-budget-form"?form:id==="#food-budget-status"?status:id==="#food-budget-basis"?{textContent:JSON.stringify(basis)}:null});
 return {form,fields,status,listeners,submit(){let prevented=false;listeners.submit({preventDefault(){prevented=true;}});assert.equal(prevented,true);}};
}

test("Adapter remains local/unknown, calculates, invalidates, rejects, resets and fails closed",()=>{
 const f=fixture();assert.equal(f.form.hidden,false);assert.match(f.status.textContent,/2 of 2 inputs unknown/);
 f.fields.daily_budget.value="200";f.submit();assert.match(f.status.textContent,/1 of 2 inputs unknown/);
 f.fields.budgeted_days.value="5";f.submit();assert.match(f.status.textContent,/USD 1000.00.*499.00 below/);
 f.listeners.input();assert.match(f.status.textContent,/previous calculation no longer applies/);
 f.fields.budgeted_days.value="1.5";f.submit();assert.match(f.status.textContent,/Check whole budgeted days/);
 f.listeners.reset();assert.match(f.status.textContent,/Both hypothetical inputs are unknown/);
 assert.equal(fixture({}).form.hidden,true);initializeFoodBudget({querySelector:()=>null});
 assert.doesNotMatch(read("src/shared/family-food-budget-form.mjs"),/fetch\(|XMLHttpRequest|localStorage|sessionStorage|sendBeacon|https?:/);
});

test("Generated worksheet/source-public copies/CSV share basis with no defaults or term renewal",()=>{
 const page=puertoVallartaFamilyResortsPage(),section=pvFoodBudgetSection();
 assert.equal(read("site/where-to-stay/puerto-vallarta-family-resorts.html"),page);
 assert.equal(read("site/downloads/puerto-vallarta-family-resorts.csv"),pvCsv);
 for(const name of ["family-food-budget.mjs","family-food-budget-form.mjs"])
  assert.equal(read(`src/shared/${name}`),read(`site/shared/${name}`));
 assert.deepEqual(JSON.parse(section.match(/id="food-budget-basis" type="application\/json">(.*?)<\/script>/)[1]),config);
 assert.equal((section.match(/type="number"/g)||[]).length,2);assert.doesNotMatch(section,/value="\d/);
 for(const id of ["food-daily","food-days"])assert.match(section,new RegExp(`for="${id}"`));
 assert.match(section,/aria-live="polite" aria-atomic="true"/);assert.match(section,/form id="food-budget-form" hidden/);
 for(const text of ["not per person","do not establish six paid meal days","No child discounts","prices are not renewed","cancellation still need confirmation"])
  assert.ok(section.includes(text),text);
 const generated=new Map();writePuertoVallartaFamilyResortsPage((p,c)=>generated.set(p,c));
 assert.deepEqual([...generated.keys()],["where-to-stay/puerto-vallarta-family-resorts.html","downloads/puerto-vallarta-family-resorts.csv","shared/family-food-budget.mjs","shared/family-food-budget-form.mjs"]);
});
