import assert from "node:assert/strict";
import {execFileSync} from "node:child_process";
import {existsSync, mkdtempSync, readFileSync, rmSync} from "node:fs";
import {tmpdir} from "node:os";
import {join} from "node:path";
import {fileURLToPath} from "node:url";
import test from "node:test";
import {comparisonHeadings, parseRoomComparisonOptions, roomComparisonCsv, roomComparisonsCsv} from "./family-room-comparison.mjs";

const path = n => fileURLToPath(new URL("../docs/research/" + n, import.meta.url));
const read = n => JSON.parse(readFileSync(path(n)));
const dcPath = path("washington-dc-room-configurations-2026-09-30.json");
const dc = read("washington-dc-room-configurations-2026-09-30.json");
const pricePaths = ["embassy","homewood","residence"].map(n => path("washington-dc-" + n + "-price-observation-2026-09-30.json"));
const prices = pricePaths.flatMap(p => JSON.parse(readFileSync(p)));
const cli = fileURLToPath(new URL("./family-room-comparison.mjs", import.meta.url));
const rows = s => s.trimEnd().split("\n").map(l => [...l.matchAll(/"((?:[^"]|"")*)"(?:,|$)/g)].map(m => m[1].replaceAll('""','"')));
const scope = comparisonHeadings.indexOf("Research scope and limits");
const v = (r, n) => r[comparisonHeadings.indexOf(n)];
const filters = {budget:{currency:"USD",nightly_limit:350}};
const csv = (party=dc.scenario,date="2026-10-03",f=filters) => roomComparisonCsv(dc,party,date,prices,f);
const statuses = s => rows(s).slice(1).map(r => v(r,"Research scope and limits").match(/Observed nightly budget ([A-Z_]+):/)?.[1]);

test("optional observed budget retains seven rows and all 34 non-scope columns", () => {
  const plain = csv(dc.scenario,"2026-10-03",{}), current = csv();
  const a=rows(plain),b=rows(current);assert.equal(b.length,8);assert.deepEqual(a[0],b[0]);
  for(let i=1;i<b.length;i++){assert.deepEqual(a[i].filter((_,j)=>j!==scope),b[i].filter((_,j)=>j!==scope));
    assert.match(b[i][scope],/not final all-fee budget, booking acceptance/);}
  assert.equal(statuses(current).filter(x=>x==="AT_OR_BELOW_OBSERVED_AMOUNT").length,4);
  assert.equal(statuses(current).filter(x=>x==="ABOVE_OBSERVED_AMOUNT").length,2);
  assert.equal(statuses(current).filter(x=>x==="UNKNOWN_UNPRICED").length,1);
  assert.equal(csv(dc.scenario,"2026-10-03",{kitchen:"any",capacity:"any"}),plain);
  assert.equal(roomComparisonsCsv([dc],dc.scenario,"2026-10-03",prices,filters),current);
  assert.equal(roomComparisonsCsv([dc],dc.scenario,"2026-10-03",prices),plain);
});

test("threshold equality and partial fee amounts do not turn into final affordability", () => {
  const at=rows(csv(dc.scenario,"2026-10-03",{budget:{currency:"USD",nightly_limit:334.68}})).slice(1);
  const r=at.find(r=>v(r,"Nightly equivalent")==="334.68");
  assert.match(r[scope],/AT_OR_BELOW_OBSERVED_AMOUNT/);assert.match(r[scope],/price-only dated sample/);
  const below=rows(csv(dc.scenario,"2026-10-03",{budget:{currency:"USD",nightly_limit:334.67}})).slice(1).find(r=>v(r,"Nightly equivalent")==="334.68");
  assert.match(below[scope],/ABOVE_OBSERVED_AMOUNT/);
  assert.equal(statuses(csv(dc.scenario,"2026-10-03",{budget:{currency:"USD",nightly_limit:0.01}})).length,7);
  const b=read("boston-room-configurations-2026-10-01.json"),p=read("boston-fenway-price-observation-2026-10-03.json");
  const fenway=rows(roomComparisonCsv(b,b.scenario,"2026-10-03",p,{budget:{currency:"USD",nightly_limit:800}})).slice(1).find(r=>v(r,"Nightly equivalent")==="781");
  assert.match(fenway[scope],/AT_OR_BELOW_OBSERVED_AMOUNT/);assert.match(v(fenway,"Fee and tax basis"),/unchecked/);
});

test("historical, wrong-currency and changed-party rows stay unresolved and visible", () => {
  assert.deepEqual(statuses(csv(dc.scenario,"2026-10-18")).sort(),[...Array(6).fill("UNKNOWN_HISTORICAL_PRICE"),"UNKNOWN_UNPRICED"].sort());
  assert.deepEqual(statuses(csv(dc.scenario,"2026-10-03",{budget:{currency:"GBP",nightly_limit:350}})).sort(),[...Array(6).fill("UNKNOWN_CURRENCY_MISMATCH"),"UNKNOWN_UNPRICED"].sort());
  assert.ok(statuses(csv({...dc.scenario,child_ages:[4,8,13]})).every(s=>s==="UNKNOWN_UNPRICED"));
  const l=read("london-room-configurations-2026-09-30.json"),lp=["mitre","marlin","montague"].flatMap(n=>read("london-"+n+"-price-observation-2026-09-30.json"));
  const output=roomComparisonCsv(l,l.scenario,"2026-10-03",lp,{budget:{currency:"GBP",nightly_limit:1000}});
  assert.ok(statuses(output).includes("AT_OR_BELOW_OBSERVED_AMOUNT"));assert.doesNotMatch(output,/UNKNOWN_CURRENCY_MISMATCH/);
});

test("age-unresolved count samples keep numbers but cannot pass the budget screen", () => {
  const p=read("orlando-homewood-room-configurations-2026-10-03.json"),s=read("orlando-homewood-price-normalized-2026-10-03.json");
  const current=roomComparisonCsv(p,p.scenario,"2026-10-03",s,{budget:{currency:"USD",nightly_limit:300}});
  assert.deepEqual(statuses(current),["UNKNOWN_AGE_BASIS"]);assert.equal(v(rows(current)[1],"Nightly equivalent"),"190.58");
  assert.match(v(rows(current)[1],"Observation limits"),/neither entered nor confirmed/);
  const pv=read("puerto-vallarta-room-configurations-2026-10-03.json");
  const unpriced=roomComparisonCsv(pv,pv.scenario,"2026-10-03",[],filters);
  assert.ok(statuses(unpriced).every(x=>x==="UNKNOWN_UNPRICED"));
  assert.ok(rows(unpriced).slice(1).every(r=>v(r,"Currency")==="Unknown"));
});

test("budget coexists with filters, validates hidden prices and leaves inputs immutable", () => {
  const before=JSON.stringify([dc,prices,filters]),f={...filters,kitchen:"published",capacity:"not-excluded"};
  const current=csv(dc.scenario,"2026-10-03",f);assert.equal(rows(current).length,5);
  assert.ok(statuses(current).every(x=>["AT_OR_BELOW_OBSERVED_AMOUNT","ABOVE_OBSERVED_AMOUNT"].includes(x)));
  const bad=structuredClone(prices);bad[0].currency="GBP";
  assert.throws(()=>roomComparisonCsv(dc,dc.scenario,"2026-10-03",bad,f),/currency/);
  assert.throws(()=>roomComparisonsCsv([dc],dc.scenario,"2026-10-03",bad,f),/currency/);
  assert.equal(JSON.stringify([dc,prices,filters]),before);
});

test("malformed API budgets and getters fail closed without invocation", () => {
  const getter={};Object.defineProperty(getter,"budget",{get(){throw Error("Getter invoked");}});
  const nested={currency:"USD"};Object.defineProperty(nested,"nightly_limit",{get(){throw Error("Getter invoked");},enumerable:true});
  const invalid=[getter,{budget:nested},{budget:null},{budget:undefined},{budget:Object.create({currency:"USD",nightly_limit:350})},{budget:{currency:"USD",nightly_limit:350,extra:1}},{budget:{currency:"USD",nightly_limit:350,[Symbol("x")]:1}}];
  for(const currency of ["usd","EUR","",null])invalid.push({budget:{currency,nightly_limit:350}});
  for(const nightly_limit of [0,-1,NaN,Infinity,"350",0.001,Number.MAX_SAFE_INTEGER])invalid.push({budget:{currency:"USD",nightly_limit}});
  for(const f of invalid){assert.throws(()=>roomComparisonCsv(dc,dc.scenario,"2026-10-03",prices,f),/budget|Budget/);assert.throws(()=>roomComparisonsCsv([dc],dc.scenario,"2026-10-03",prices,f),/budget|Budget/);}
  assert.equal(parseRoomComparisonOptions([dcPath]).filters.budget,undefined);
});

test("paired CLI budget controls match API and reject invalid controls before writing", () => {
  const args=[dcPath,"--date","2026-10-03","--prices",...pricePaths];
  assert.equal(execFileSync(process.execPath,[cli,...args,"--nightly-budget","350","--budget-currency","USD"],{encoding:"utf8"}),csv());
  assert.equal(execFileSync(process.execPath,[cli,...args,"--budget-currency","USD","--nightly-budget","350.00"],{encoding:"utf8"}),csv());
  const root=mkdtempSync(join(tmpdir(),"ft-budget-"));
  try{
    for(const flags of [["--nightly-budget","350"],["--budget-currency","USD"],["--nightly-budget","3e2","--budget-currency","USD"],["--nightly-budget","350","--budget-currency","USD","--nightly-budget","400"],["--nightly-budget","0","--budget-currency","USD"],["--nightly-budget","350.001","--budget-currency","USD"],["--nightly-budget","350","--budget-currency","EUR"],["--nightly-budget","350","--budget-currency","USD","--budget-currency","GBP"]]){
      const output=join(root,"missing","export.csv");assert.throws(()=>execFileSync(process.execPath,[cli,...args,...flags,"--output",output],{stdio:"pipe"}));assert.equal(existsSync(join(root,"missing")),false);
    }
  }finally{rmSync(root,{recursive:true,force:true});}
});

test("saved budget checkpoint retains original guard semantics and input counts", () => {
  const root=mkdtempSync(join(tmpdir(),"ft-budget-save-"));
  try{
    const output=join(root,"export.csv"),args=[dcPath,"--date","2026-10-03","--prices",...pricePaths,"--nightly-budget","350","--budget-currency","USD","--output",output];
    const summary=JSON.parse(execFileSync(process.execPath,[cli,...args],{encoding:"utf8"}));
    assert.equal(summary.categories,4);assert.equal(summary.categories_are_input_count,true);assert.deepEqual(summary.filters.budget,filters.budget);
    assert.equal(readFileSync(output,"utf8"),csv());assert.throws(()=>execFileSync(process.execPath,[cli,...args],{stdio:"pipe"}));assert.equal(readFileSync(output,"utf8"),csv());
    const site=fileURLToPath(new URL("../site/budget-forbidden.csv",import.meta.url));
    assert.throws(()=>execFileSync(process.execPath,[cli,...args.slice(0,-2),"--output",site],{stdio:"pipe"}));assert.equal(existsSync(site),false);
  }finally{rmSync(root,{recursive:true,force:true});}
});
