import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { execFileSync, spawnSync } from "node:child_process";
import { calculateAdmissionBudget } from "../src/shared/admission-budget.mjs";
import { compareOrlandoAdmission, admissionCliArguments } from "./orlando-admission-budget.mjs";
import { activities, admissionTariffs, checkedOn, seaLifeTicket } from "./page-generation/orlando-activity-data.mjs";
import { orlandoActivityPage } from "./page-generation/orlando-activity-page.mjs";

const task = { travelerAges:[30,35,2,13], asOf:"2026-10-15", visitDate:"2026-10-20" };
const byId = result => Object.fromEntries(result.records.map(record => [record.id,record]));

test("legacy family examples equal all maintained numeric page budgets", () => {
  const rows = byId(compareOrlandoAdmission({...task,travelerAges:[30,35,3,10]}));
  for (const row of activities) assert.equal(rows[row.id].publishedAdmissionSubtotalCents, row.budget === null ? null : Math.round(row.budget*100), row.id);
  assert.equal(checkedOn,"2026-10-13");
  assert.equal(seaLifeTicket.checked_on,"2026-10-13");
});

test("two adults with ages two and thirteen cross distinct ticket boundaries", () => {
  const rows = byId(compareOrlandoAdmission(task));
  assert.deepEqual(["science-center","crayola","mennello","leu","gatorland"].map(id=>rows[id].publishedAdmissionSubtotalCents),[10700,9297,1900,4000,10497]);
  assert.deepEqual(rows["science-center"].guests.map(g=>g.ticket),["Standard adult","Standard adult","Youth","Teen"]);
  assert.equal(rows.gatorland.guests[3].cents,3499);
  assert.equal(rows.crayola.guests[2].cents,0);
});

test("an infant's unmapped rate holds the whole Science Center subtotal", () => {
  const row = byId(compareOrlandoAdmission({...task,travelerAges:[30,35,1,13]}))["science-center"];
  assert.equal(row.publishedAdmissionSubtotalCents,null);
  assert.deepEqual(row.missingAges,[1]);
  assert.equal(row.status,"price-unknown");
  assert.match(row.unknownReason,/Under-two/);
});

test("unknown package and park costs never become zero or a multiplied adult floor", () => {
  const rows = byId(compareOrlandoAdmission(task));
  for (const id of ["sea-life","lake-eola"]) {
    assert.equal(rows[id].publishedAdmissionSubtotalCents,null);
    assert.equal(rows[id].status,"price-unknown");
    assert.ok(rows[id].guests.every(g=>g.cents===null));
  }
  assert.match(rows["sea-life"].unknownReason,/package/);
});

test("all child boundaries retain exact cents and explicit free bands", () => {
  for (const age of [0,1,2,3,4,5,6,12,13,17,18]) {
    const rows = byId(compareOrlandoAdmission({...task,travelerAges:[30,age]}));
    assert.equal(rows.crayola.guests[1].cents,age<3?0:3099);
    assert.equal(rows.mennello.guests[1].cents,age<6?0:age<18?300:800);
    assert.equal(rows.leu.guests[1].cents,age<4?0:age<18?1000:1500);
    assert.equal(rows.gatorland.guests[1].cents,age<3?0:age<13?2499:3499);
    assert.equal(rows["science-center"].guests[1].cents,age<2?null:age<13?2200:age<18?2700:2900);
  }
});

test("sources, product, fee context and unresolved whole-day cost stay with every result", () => {
  const result = compareOrlandoAdmission(task);
  for (const row of result.records) {
    assert.match(row.sourceUrl,/^https:\/\//);
    assert.equal(row.currency,"USD");
    assert.ok(row.channel && row.product && row.taxAndFeeStatus && row.exclusions.length);
    assert.equal(row.completeDayCostCents,null);
    assert.equal(row.selectedDateAvailability,"unknown");
    assert.equal(row.admissionAcceptance,"unknown");
  }
  assert.match(byId(result).crayola.taxAndFeeStatus,/Tax is additional/);
  assert.match(result.scope,/not a checkout quote/);
});

test("standard rate is not silently replaced by a conditional senior concession", () => {
  const rows = byId(compareOrlandoAdmission({...task,travelerAges:[65,13]}));
  assert.equal(rows.crayola.guests[0].cents,3099);
  assert.equal(rows["science-center"].guests[0].cents,2900);
  assert.ok(rows.crayola.exclusions.some(text=>text.includes("Senior")));
});

test("freshness boundary is separate from arithmetic and never implies dated availability", () => {
  const fresh = byId(compareOrlandoAdmission({...task,visitDate:"2026-10-28"}));
  const stale = byId(compareOrlandoAdmission({...task,visitDate:"2026-10-29"}));
  assert.equal(fresh.crayola.status,"published-subtotal-not-quote");
  assert.equal(stale.crayola.status,"historical-subtotal-needs-recheck");
  assert.equal(stale.crayola.publishedAdmissionSubtotalCents,9297);
  assert.equal(stale.crayola.needsRecheck,true);
  assert.throws(()=>compareOrlandoAdmission({...task,asOf:"2026-10-14"}));
});

test("malformed, sparse and out-of-scope party/date inputs fail", () => {
  for (const ages of [[],[3,10],[30,-1],[30,2.5],[30,"3"],[121],Array(3),Array(15).fill(30)])
    assert.throws(()=>compareOrlandoAdmission({...task,travelerAges:ages}));
  for (const patch of [{asOf:"2026-02-30"},{visitDate:"2026-10-14"},{visitDate:"2026-1-20"},{asOf:null}])
    assert.throws(()=>compareOrlandoAdmission({...task,...patch}));
});

test("overlaps, missing rates and unsafe money cannot produce a subtotal", () => {
  for (const change of [t=>t.bands.push({...t.bands[0]}),t=>t.bands[0].cents=22.2,t=>t.bands[0].cents=-1,t=>t.bands[0].cents=Number.MAX_SAFE_INTEGER,t=>delete t.bands[0],t=>t.sourceUrl="http://example.com"]) {
    const tariffs = structuredClone(admissionTariffs); change(tariffs[0]);
    assert.throws(()=>calculateAdmissionBudget(tariffs,task));
  }
  assert.throws(()=>calculateAdmissionBudget([admissionTariffs[0],admissionTariffs[0]],task));
});

test("result changes cannot mutate maintained rates, party or exclusions", () => {
  const input = structuredClone(task), result = compareOrlandoAdmission(input);
  result.travelerAges[0]=1;result.records[0].guests[0].cents=1;result.records[0].exclusions.push("changed");
  assert.deepEqual(input,task);
  assert.equal(compareOrlandoAdmission(task).records[0].guests[0].cents,2900);
  assert.equal(compareOrlandoAdmission(task).records[0].exclusions.length,3);
});

test("offline CLI is reproducible and rejects duplicate, empty or unknown arguments", () => {
  const args=["--ages","30,35,2,13","--as-of","2026-10-15","--visit-date","2026-10-20"];
  assert.deepEqual(admissionCliArguments(args),task);
  const output=JSON.parse(execFileSync(process.execPath,["tools/orlando-admission-budget.mjs",...args],{encoding:"utf8"}));
  assert.deepEqual(output,compareOrlandoAdmission(task));
  for (const bad of [[...args,"--ages","30"],["--ages","30,,3"],[...args,"--output","anything"],[]]) {
    assert.throws(()=>compareOrlandoAdmission(admissionCliArguments(bad)));
    const failure=spawnSync(process.execPath,["tools/orlando-admission-budget.mjs",...bad],{encoding:"utf8"});
    assert.equal(failure.status,1);assert.equal(failure.stdout,"");
  }
});

test("existing generated activity HTML is byte-identical", () => {
  assert.equal(orlandoActivityPage(),readFileSync("site/things-to-do/orlando-with-kids.html","utf8"));
});
