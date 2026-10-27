import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {initializeAdmissionBudget,admissionPriceMessage} from "../src/shared/orlando-admission-form.mjs";
import {admissionTariffs,activities,checkedOn,reviewSignals} from "./page-generation/orlando-activity-data.mjs";
import {orlandoAdmissionSection,orlandoActivityPage,writeOrlandoActivityPage} from "./page-generation/orlando-activity-page.mjs";
import {compareOrlandoAdmission} from "./orlando-admission-budget.mjs";
import {calculateAdmissionBudget as calculateServedAdmissionBudget} from "../site/shared/admission-budget.mjs";

test("held served engine matches current valid tasks and rejects substituted party arrays",()=>{
  const task={travelerAges:[30,35,2,13],asOf:"2026-11-03",visitDate:"2026-11-04"};
  assert.deepEqual(calculateServedAdmissionBudget(admissionTariffs,task),compareOrlandoAdmission(task));
  const ages=[30,,13];let called=false;ages[Symbol.iterator]=function*(){called=true;};
  assert.throws(()=>calculateServedAdmissionBudget(admissionTariffs,{...task,travelerAges:ages}));
  assert.equal(called,false);
  const tariffs=structuredClone(admissionTariffs);tariffs[0].bands.find=()=>{called=true;return{label:"substituted",cents:0};};
  assert.throws(()=>calculateServedAdmissionBudget(tariffs,task));assert.equal(called,false);
});

class Element {
  constructor(tag="div") {this.tag=tag;this.children=[];this._text="";this.value="";this.listeners={};this.hidden=false;}
  set textContent(value) {this._text=String(value);this.children=[];}
  get textContent() {return this._text+this.children.map(child=>child.textContent).join(" ");}
  append(...nodes) {this.children.push(...nodes);}
  replaceChildren(...nodes) {this._text="";this.children=nodes;}
  querySelectorAll(tag) {return this.children.flatMap(child=>[...(child.tag===tag?[child]:[]),...child.querySelectorAll(tag)]);}
  addEventListener(type,callback) {this.listeners[type]=callback;}
}

function fixture({tariffs=admissionTariffs,today="2026-10-27",missing=false}={}) {
  const form=new Element("form"),count=new Element("input"),visit=new Element("input"),status=new Element(),results=new Element(),fields=new Element(),basis=new Element();
  count.value="4";form.hidden=true;results.hidden=true;basis.textContent=JSON.stringify(tariffs);
  form.elements={namedItem:name=>name==="traveler_count"?count:name==="visit_date"?visit:null};
  const entries={"#admission-budget-form":form,"#admission-budget-basis":basis,"#admission-budget-status":status,"#admission-results":results,"#admission-age-fields":fields};
  initializeAdmissionBudget({querySelector:id=>missing?null:entries[id],createElement:tag=>new Element(tag)},{today:()=>today});
  return {form,count,visit,status,results,fields,inputs:()=>fields.querySelectorAll("input"),
    ages(values){values.forEach((value,index)=>{this.inputs()[index].value=String(value);});},
    input(target){form.listeners.input({target});},
    submit(){let prevented=false;form.listeners.submit({preventDefault(){prevented=true;}});assert.equal(prevented,true);},
    reset(){let prevented=false;form.listeners.reset({preventDefault(){prevented=true;}});assert.equal(prevented,true);}};
}

test("progressive enhancement starts with blank exact ages and no assumed visit",()=>{
  const f=fixture();assert.equal(f.form.hidden,false);assert.equal(f.inputs().length,4);
  assert.ok(f.inputs().every(input=>input.value===""&&input.type==="number"&&input.required));
  assert.equal(f.visit.value,"");assert.equal(f.visit.min,"2026-10-27");assert.equal(f.results.hidden,true);
  f.inputs().forEach((input,index)=>{assert.equal(input.id,`admission-age-${index}`);assert.equal(f.fields.children[index].htmlFor,input.id);});
});

test("mixed-age task constructs sourced known and unknown results without HTML injection",()=>{
  const f=fixture();f.ages([30,35,2,13]);f.visit.value="2026-11-01";f.submit();
  assert.equal(f.results.hidden,false);assert.match(f.status.textContent,/5 published subtotals; 2 prices unknown/);
  for(const text of ["USD 107.00","USD 92.97","USD 104.97","Age 13: Teen","Rates observed 2026-10-27 on the official site","Tax is additional","not a checkout quote","Price unknown"])
    assert.ok(f.results.textContent.includes(text),text);
  const anchors=f.results.querySelectorAll("a");assert.equal(anchors.length,7);assert.ok(anchors.every(anchor=>anchor.href.startsWith("https://")));
  assert.match(f.results.textContent,/complete|Excluded/);
});

test("edits clear prior totals before another calculation",()=>{
  const f=fixture();f.ages([30,35,3,10]);f.visit.value="2026-11-01";f.submit();assert.match(f.results.textContent,/USD 102.00/);
  f.inputs()[2].value="1";f.input(f.inputs()[2]);
  assert.equal(f.results.hidden,true);assert.equal(f.results.children.length,0);assert.match(f.status.textContent,/previous subtotals no longer apply/);
  f.submit();assert.equal(f.results.hidden,false);assert.match(f.results.textContent,/Under-two/);assert.doesNotMatch(f.results.textContent,/USD 102.00/);
});

test("party resize preserves retained ages but adds unknown new fields, bounded to fourteen",()=>{
  const f=fixture();f.ages([30,35,3,10]);f.count.value="6";f.input(f.count);
  assert.deepEqual(f.inputs().map(input=>input.value),["30","35","3","10","",""]);
  f.visit.value="2026-11-01";f.submit();assert.equal(f.results.hidden,true);
  f.count.value="2";f.input(f.count);assert.deepEqual(f.inputs().map(input=>input.value),["30","35"]);
  f.count.value="14";f.input(f.count);assert.equal(f.inputs().length,14);f.ages(Array(14).fill(30));f.submit();assert.equal(f.results.hidden,false);
  f.count.value="15";f.input(f.count);f.submit();assert.equal(f.results.hidden,true);assert.equal(f.inputs().length,14);
});

test("sequential count keystrokes preserve drafts but only visible travelers are priced",()=>{
  const f=fixture();f.ages([30,35,3,10]);f.visit.value="2026-11-01";
  f.count.value="1";f.input(f.count);f.submit();
  assert.match(f.results.textContent,/USD 29.00/);assert.doesNotMatch(f.results.textContent,/Age 35|Age 3:/);
  f.count.value="14";f.input(f.count);
  assert.deepEqual(f.inputs().slice(0,4).map(input=>input.value),["30","35","3","10"]);
  assert.ok(f.inputs().slice(4).every(input=>input.value===""));
  f.count.value="4";f.input(f.count);f.submit();assert.match(f.results.textContent,/USD 102.00/);
});

test("reset erases hidden traveler drafts as well as visible fields",()=>{
  const f=fixture();f.count.value="6";f.input(f.count);f.ages([30,35,3,10,12,16]);
  f.count.value="1";f.input(f.count);f.reset();
  f.count.value="6";f.input(f.count);assert.ok(f.inputs().every(input=>input.value===""));
});

test("blank, fractional, negative, no-adult and past-date tasks fail without stale rows",()=>{
  for(const ages of [[30,35,"",13],[30,35,"3.5",13],[30,35,-1,13],[3,4,10,13],[30,35,121,13]]) {
    const f=fixture();f.ages(ages);f.visit.value="2026-11-01";f.submit();assert.equal(f.results.hidden,true);assert.match(f.status.textContent,/Comparison unresolved/);
  }
  for(const date of ["","2026-10-26","2026-02-30"]) {
    const f=fixture();f.ages([30,35,2,13]);f.visit.value=date;f.submit();assert.equal(f.results.hidden,true);
  }
});

test("future-visit recheck is explicit and reset clears all values/results",()=>{
  const f=fixture();f.ages([30,35,2,13]);f.visit.value="2026-11-10";f.submit();
  assert.match(f.results.textContent,/Older observation; historical arithmetic only/);assert.match(f.status.textContent,/7 choices rely on an older rate observation/);
  f.reset();assert.equal(f.count.value,"4");assert.equal(f.visit.value,"");assert.ok(f.inputs().every(input=>input.value===""));assert.equal(f.results.hidden,true);assert.equal(f.status.textContent,"No party calculated.");
});

test("missing or invalid evidence and pre-evidence clocks keep form hidden",()=>{
  assert.equal(fixture({tariffs:[]}).form.hidden,true);assert.equal(fixture({today:"2026-10-26"}).form.hidden,true);
  initializeAdmissionBudget({querySelector:()=>null});assert.equal(fixture({missing:true}).form.hidden,true);
});

test("source text is assigned as text, while unsafe source links fail closed",()=>{
  const tariffs=structuredClone(admissionTariffs);tariffs[0].name="<img src=x onerror=bad()>";
  const f=fixture({tariffs});f.ages([30,35,2,13]);f.visit.value="2026-11-01";f.submit();
  assert.ok(f.results.textContent.includes(tariffs[0].name));assert.equal(f.results.querySelectorAll("img").length,0);
  tariffs[0].sourceUrl="javascript:bad()";assert.equal(fixture({tariffs}).form.hidden,true);
});

test("result messages keep unknown and historical rate arithmetic distinct",()=>{
  const result=compareOrlandoAdmission({travelerAges:[30,35,1,13],asOf:"2026-10-27",visitDate:"2026-11-10"});
  assert.match(admissionPriceMessage(result.records[0]),/^Price unknown/);assert.match(admissionPriceMessage(result.records[1]),/historical arithmetic only/);
});

test("generated form preserves native baseline, safe data and private local-only behavior",()=>{
  const section=orlandoAdmissionSection(),html=orlandoActivityPage();
  assert.match(section,/form id="admission-budget-form"[^>]* hidden/);assert.match(section,/aria-live="polite" aria-atomic="true"/);
  assert.deepEqual(JSON.parse(section.match(/id="admission-budget-basis" type="application\/json">(.*?)<\/script>/)[1]),admissionTariffs);
  assert.ok(html.indexOf("Compare Non-Park Choices")<html.indexOf("Your Party's Admission Budget"));
  assert.match(html,/\.admission-budget \[hidden\]\{display:none!important\}/);
  assert.equal(activities.length,7);assert.equal(checkedOn,"2026-10-13");assert.equal(reviewSignals.length,2);
  for(const text of ["Not dated availability or complete day costs","Research-based, not firsthand","not Family Tripwise reviews"])assert.ok(html.includes(text));
  const source=readFileSync("src/shared/orlando-admission-form.mjs","utf8");
  assert.doesNotMatch(source,/innerHTML|fetch\(|XMLHttpRequest|localStorage|sessionStorage|sendBeacon/);
  assert.match(source,/textContent/);assert.match(source,/event\.preventDefault\(\)/);
  const out=new Map();writeOrlandoActivityPage((path,body)=>out.set(path,body));
  assert.deepEqual([...out.keys()],["things-to-do/orlando-with-kids.html","shared/admission-budget.mjs","shared/orlando-admission-form.mjs"]);
  for(const name of ["admission-budget.mjs","orlando-admission-form.mjs"]) {
    assert.equal(out.get(`shared/${name}`),readFileSync(`src/shared/${name}`,"utf8"));
    assert.equal(readFileSync(`site/shared/${name}`,"utf8"),out.get(`shared/${name}`));
  }
});

test("Q02b: unpriced outings say no standalone rate was established, priced ones cite the observation",()=>{
  const f=fixture();f.ages([30,35,3,10]);f.visit.value="2026-11-01";f.submit();
  const rows=f.results.querySelectorAll("tr").slice(1),text=name=>rows.find(row=>row.children[0].textContent===name).textContent;
  for(const name of ["SEA LIFE Orlando","Lake Eola Park"]){
    assert.match(text(name),/Official source inspected 2026-10-13; no standalone rate was established\./,name);
    assert.doesNotMatch(text(name),/Rates observed/,name);
  }
  assert.match(text("Crayola Experience"),/Rates observed 2026-10-27 on the official site; check the current price before buying\./);
  assert.doesNotMatch(text("Crayola Experience"),/no standalone rate/);
});
