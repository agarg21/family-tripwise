import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { cancunEvidence } from "../src/prototypes/cancun-resort-comparison/data.mjs";
import { compareCancunFamily } from "../src/prototypes/cancun-resort-comparison/compare.mjs";
import { renderOverview, renderResults, bookingChecklistText, comparisonCsv } from "../src/prototypes/cancun-resort-comparison/render.mjs";
import { writeCancunResortPage } from "./page-generation/cancun-resort-page.mjs";
import { hotelEvidence, hotelAuditRecords, hotelFieldInterval } from "./hotel-evidence.mjs";
import { qualityReport } from "./page-quality.mjs";
const read = path => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const evidence = JSON.parse(read("docs/research/cancun-ziva-club-age-2026-10-11.json"));
const ziva = cancunEvidence.records.find(r => r.id === "ziva-ocean-view-double");
const compare = (ages, asOf = evidence.checked_on) => compareCancunFamily({childAges:ages,asOf});
const row = result => result.records.find(r => r.id === ziva.id);

test("current Ziva bands retain exact source, independent clock and unknown conditions", () => {
  assert.equal(cancunEvidence.sources.Z4, evidence.source_url);
  assert.equal(ziva.clubs.checkedOn, evidence.checked_on);
  assert.equal(ziva.clubs.recheckOn, evidence.recheck_on);
  assert.deepEqual(ziva.clubs.programs.map(p=>[p.name,p.min,p.max]), evidence.programs.map(p=>[p.name,p.min,p.max]));
  for(const p of ziva.clubs.programs) for(const key of ["parentRequired","registration","pottyRequired"]) assert.equal(p[key],null);
  assert.equal(ziva.price,null);
  assert.equal(cancunEvidence.checkedOn,"2026-09-23"); assert.equal(cancunEvidence.recheckOn,"2026-10-23");
  assert.match(ziva.clubs.checks.join(" "),/with a parent.*not parent-free.*costs extra.*billing unit.*unknown/);
  assert.equal(evidence.babysitting.fee_amount,null);
});
test("two-year-old versus seven-year-old does not promise a simultaneous break", () => {
  const r = row(compare([2,7]));
  assert.deepEqual(r.children.map(c=>c.program),[null,"KidZ Club"]);
  assert.deepEqual(r.children.map(c=>c.status),["no-published-age-match","published-age-match-confirm-admission"]);
  assert.equal(r.room.bookingAcceptance,"unknown"); assert.equal(r.cost.total,null);
  assert.equal(r.transfers.status,"extra-under-standard-terms");
  for(const child of r.children) assert.equal(child.sources[0].checkedOn,"2026-10-11");
  assert.equal(r.room.sources[0].checkedOn,"2026-09-23");
});
test("4-12 and 10-17 overlap survives routing rather than assuming teen13 cutoff", () => {
  for(const [age,primary,others] of [[3,null,[]],[4,"KidZ Club",[]],[9,"KidZ Club",[]],[10,"KidZ Club",["@Moods Lounge and Club"]],[12,"KidZ Club",["@Moods Lounge and Club"]],[13,"@Moods Lounge and Club",[]],[17,"@Moods Lounge and Club",[]]]) {
    const child = row(compare([age])).children[0];
    assert.equal(child.program,primary); assert.deepEqual(child.otherPrograms,others);
  }
  assert.match(renderResults(compare([10,12])),/Also listed for this age: @Moods Lounge and Club; confirm its separate admission rules/);
});
test("scope-specific recheck does not renew other properties or hide unknown admission", () => {
  assert.equal(row(compare([2,7],"2026-10-17")).clubEvidence.needsRecheck,false);
  assert.equal(row(compare([2,7],"2026-10-18")).clubEvidence.needsRecheck,true);
  assert.match(renderResults(compare([2,7],"2026-10-18")),/Club source review due/);
  for(const r of compare([2,7]).records.filter(r=>r.id!==ziva.id)) assert.equal(r.clubEvidence,null);
  const grand = compare([2,7]).records.find(r=>r.id==="grand-family-suite");
  assert.ok(grand.children.every(c=>c.program===null));
});
test("overview, result and checklist expose same scoped rules without inventing care prices", () => {
  for(const text of [renderOverview(),renderResults(compare([2,7])),bookingChecklistText()]) {
    for(const value of ["Club rules checked 2026-10-11; review due 2026-10-18", "costs extra", "parent-free care", evidence.source_url]) assert.ok(text.includes(value),value);
  }
  assert.match(bookingChecklistText(),/4-12 KidZ Club \| 10-17 @Moods Lounge and Club/);
  assert.equal(read("site/downloads/cancun-room-comparison.csv"),comparisonCsv());
});
test("all nine scoped outputs and three changed modules have exact source-public parity", () => {
  const output=new Map(); writeCancunResortPage((p,b)=>output.set(p,b));
  assert.equal(output.size,9); for(const [p,b] of output) assert.equal(read("site/"+p),b,p);
  for(const name of ["data","compare","render"]) assert.equal(read(`site/cancun/${name}.mjs`),read(`src/prototypes/cancun-resort-comparison/${name}.mjs`));
});
test("maintenance uses scoped club dates without rewriting historical source or unrelated envelopes", () => {
  const fields=hotelEvidence().find(r=>r.id===`cancun-${ziva.id}`).fields;
  assert.equal(fields.activities.observed_on,"2026-10-11");
  assert.equal(fields.activities.date_basis,"field-observation");
  assert.equal(fields.room.observed_on,"2026-09-23");
  assert.equal(hotelFieldInterval("activities",fields.activities),7);
  const audit=hotelAuditRecords().find(r=>r.id===`cancun-${ziva.id}-activities`);
  assert.equal(audit.interval_days,7);assert.deepEqual(audit.source_urls,[evidence.source_url]);
  const due=qualityReport(hotelEvidence(),{today:"2026-10-18"}).tasks.find(t=>t.id===`cancun-${ziva.id}-activities`);
  assert.equal(due.freshness.due_on,"2026-10-18");assert.equal(due.freshness.state,"review-due");
  const historical=qualityReport(hotelEvidence(),{today:"2026-10-10"}).tasks.find(t=>t.id===`cancun-${ziva.id}-activities`);
  assert.equal(historical.freshness.state,"future-date-review");
  assert.match(renderOverview(),/Earlier property pages checked 2026-09-23; not a current club-rule verification/);
  for(const date of ["invalid","2026-10-11"]) assert.throws(()=>hotelFieldInterval("activities",{...fields.activities,value:{...fields.activities.value,recheckOn:date}}));
});
