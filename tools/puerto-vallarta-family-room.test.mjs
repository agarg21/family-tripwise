import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { validateRoomPack, screenRoomPack } from "./family-room-task.mjs";
import { roomComparisonCsv } from "./family-room-comparison.mjs";
import { validateRoomPrices } from "./family-room-price.mjs";
const path = new URL("../docs/research/puerto-vallarta-room-configurations-2026-10-03.json", import.meta.url);
const pack = JSON.parse(readFileSync(path));
const original = JSON.parse(readFileSync(new URL("../docs/research/puerto-vallarta-room-club-feasibility-2026-10-03.json", import.meta.url)));
const screen = party => screenRoomPack(pack, party ?? pack.scenario, "2026-10-03");
test("PV reviewed exact variant maxima and dates remain traceable without source renewal", () => {
  assert.deepEqual(validateRoomPack(pack), []);
  assert.equal(pack.checked_on, original.inspected_on);
  assert.deepEqual(pack.records.map(r => r.configurations[0].maximum), [3,4,7,4,2]);
  assert.deepEqual(pack.records.map(r => r.configurations[0].max_adults), [2,3,4,3,null]);
  assert.equal(pack.records[4].configurations[0].max_children, 0);
  for (const s of Object.values(pack.sources)) assert.ok(original.sources.some(o => o.url === s.url && o.inspected_on === s.checked_on));
  assert.match(pack.records[2].sleeping_setup, /allocation unconfirmed/);
  assert.match(pack.evidence_scope, /not Puerto Vallarta city/);
});
test("PV five and six person task has one conditional capacity candidate, not booked eligibility", () => {
  assert.deepEqual(screen().map(r => r.screening), ["OUTSIDE_PUBLISHED_LIMIT","OUTSIDE_PUBLISHED_LIMIT","CONDITIONAL_PUBLISHED_CAPACITY","OUTSIDE_PUBLISHED_LIMIT","OUTSIDE_PUBLISHED_LIMIT"]);
  const six = screen({...pack.scenario,child_ages:[4,8,12,15]});
  assert.equal(six[2].screening, "CONDITIONAL_PUBLISHED_CAPACITY");
  assert.match(six[2].next_checks.join(" "), /teen band unknown/);
  assert.match(six[3].next_checks.join(" "), /fully potty trained/);
  assert.match(six[3].next_checks.join(" "), /admission unknown/);
});
test("PV category adult and child limits do not imply property wide rejection", () => {
  assert.ok(screen({...pack.scenario,adults:2,child_ages:[1,2,3,4,5,6]}).every(r=>r.screening === "OUTSIDE_PUBLISHED_LIMIT"));
  assert.equal(screen({...pack.scenario,adults:5,child_ages:[]})[2].screening,"OUTSIDE_PUBLISHED_LIMIT");
  assert.equal(screen({...pack.scenario,adults:1,child_ages:[4]})[4].screening,"OUTSIDE_PUBLISHED_LIMIT");
  assert.equal(screen({...pack.scenario,adults:2,child_ages:[]})[4].screening,"CONDITIONAL_PUBLISHED_CAPACITY");
});
test("PV dated evidence rechecks after30days rather than reporting fresh acceptance", () => {
  assert.ok(screenRoomPack(pack,pack.scenario,"2026-11-04").every(r => r.screening === "RECHECK_SOURCE"));
  assert.throws(()=>screenRoomPack(pack,pack.scenario,"2026-10-02"));
});
test("unknown currency is allowed only for explicit strict unpriced placeholders", () => {
  for (const mutate of [p=>delete p.currency,p=>p.currency="MXN",p=>p.currency="",p=>p.amount=399,p=>p.observed_on="2026-10-03",p=>p.status="observed"]) {
    const copy=structuredClone(pack);mutate(copy.records[0].price);
    assert.ok(validateRoomPack(copy).length);assert.throws(()=>screenRoomPack(copy,copy.scenario,"2026-10-03"));
  }
  for(const currency of ["USD","GBP"]) {const copy=structuredClone(pack);copy.records[0].price.currency=currency;assert.deepEqual(validateRoomPack(copy),[]);}
});
test("unknown owning currency cannot wildcard an otherwise valid observed GBP price", () => {
  const london=JSON.parse(readFileSync(new URL("../docs/research/london-room-configurations-2026-09-30.json", import.meta.url)));
  const prices=JSON.parse(readFileSync(new URL("../docs/research/london-mitre-price-observation-2026-09-30.json", import.meta.url)));
  assert.deepEqual(validateRoomPrices(prices,london),[]);
  london.records.find(r=>r.id === "mitre-family-five").price.currency=null;
  assert.deepEqual(validateRoomPack(london),[]);
  assert.ok(validateRoomPrices(prices,london).length);
  assert.throws(()=>screenRoomPack(london,london.scenario,"2026-09-30",prices));
});
test("PV CSV preserves Unknown currency, unpriced amounts and party stay context with CLI parity", () => {
  const csv=roomComparisonCsv(pack,pack.scenario,"2026-10-03");
  assert.equal(csv.trim().split("\n").length,6);
  assert.equal((csv.match(/"Unknown","configuration\/night","Unpriced"/g)??[]).length,5);
  assert.doesNotMatch(csv,/"399"|"206"|null nightly price/);
  assert.match(csv,/2026-11-08/);assert.match(csv,/2026-11-13/);
  assert.match(csv,/ISO currency/);assert.match(csv,/bedding allocation/);
  for(const r of screen()) {assert.equal(r.price.amount,null);assert.equal(r.price.currency,null);assert.equal(r.price.observed_on,null);}
  const cli=execFileSync(process.execPath,[fileURLToPath(new URL("./family-room-comparison.mjs",import.meta.url)),fileURLToPath(path),"--date","2026-10-03"],{encoding:"utf8"});
  assert.equal(cli,csv);
});
