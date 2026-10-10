import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { bostonPack, bostonPackForDate, bostonPlazaEvidence, bostonRooms, bostonPrices, bostonCsv, bostonFamilyHotelPage, bostonBreakfastUpgrade } from "./page-generation/boston-family-hotels-page.mjs";
import { validateRoomPack } from "./family-room-task.mjs";
import { roomComparisonCsv } from "./family-room-comparison.mjs";
const read = path => JSON.parse(readFileSync(new URL(`../${path}`, import.meta.url), "utf8"));

test("exact Plaza Suite overlay renews only its source facts, never a nightly quote", () => {
  const original=read("docs/research/boston-room-configurations-2026-10-01.json");
  assert.deepEqual(validateRoomPack(bostonPack), []);
  assert.equal(bostonPack.checked_on,"2026-10-09");
  for (const record of bostonPack.records.filter(r=>r.id!==bostonPlazaEvidence.record_id))
    assert.deepEqual(record,original.records.find(r=>r.id===record.id));
  for (const [key,source] of Object.entries(original.sources)) assert.deepEqual(bostonPack.sources[key],source);
  const plaza=bostonRooms.find(r=>r.id===bostonPlazaEvidence.record_id);
  assert.equal(plaza.checked_on,"2026-10-09");assert.equal(plaza.kitchen,"published-kitchen");
  assert.equal(plaza.price.amount,null);assert.equal(plaza.price.observed_on,null);assert.equal(plaza.price.status,"not-observed");
  assert.deepEqual(bostonRooms.map(r=>r.checked_on),["2026-10-03","2026-10-01","2026-10-09","2026-10-01"]);
  assert.deepEqual(bostonRooms.slice(0,2).flatMap(r=>r.price.rates.map(p=>p.nightly_average)),[781,372.1,444.84,528.68]);
  assert.equal(bostonBreakfastUpgrade().stay_increment,419.22);
});

test("historical Boston model never consumes future kitchen facts", () => {
  const old=bostonPackForDate("2026-10-08"), current=bostonPackForDate("2026-10-09");
  assert.equal(old.checked_on,"2026-10-03");
  assert.equal(old.records.find(r=>r.id===bostonPlazaEvidence.record_id).kitchen,"not-established");
  assert.equal(old.sources["four-plaza-detail"],undefined);
  assert.equal(current.records.find(r=>r.id===bostonPlazaEvidence.record_id).kitchen,"published-kitchen");
  assert.throws(()=>bostonPackForDate("2026-02-30"));
});

test("page and full export share exact kitchen, price hold and source clocks", () => {
  const html=bostonFamilyHotelPage();
  assert.equal(bostonCsv,roomComparisonCsv(bostonPack,bostonPack.scenario,"2026-10-09",bostonPrices));
  assert.equal(bostonCsv.trim().split("\n").length,7);
  assert.equal(bostonRooms.filter(r=>r.kitchen==="published-kitchen").length,2);
  assert.equal(roomComparisonCsv(bostonPack,bostonPack.scenario,"2026-10-09",bostonPrices,{kitchen:"published"}).trim().split("\n").length,3);
  for (const text of [bostonPlazaEvidence.facts.kitchen_description,bostonPlazaEvidence.budget.limitation,"complete two-bedroom bed list","prices observed October 1 and 3"])
    assert.ok(html.toLowerCase().includes(text.toLowerCase()),text);
  const row=bostonCsv.split("\n").find(line=>line.includes('"Plaza Suite"'));
  for (const text of ["published-kitchen","2026-10-09",bostonPlazaEvidence.source.url,"monthly pricing by phone","configuration/night","Unpriced","2026-11-08","2026-11-13"])
    assert.ok(row.includes(text),text);
  assert.doesNotMatch(row,/"781"|"372.1"|"444.84"|"528.68"/);
});

test("unpriced overlay rejects wrong category, provenance, invented equipment or amount without mutating inputs", () => {
  const original=structuredClone(bostonPlazaEvidence);
  for (const mutate of [
    d=>d.record_id="boston-langham-club-two-bedroom",d=>d.hotel="Four Seasons One Dalton",d=>d.category="Standard room",
    d=>d.source.url="https://www.fourseasons.com/boston/",d=>d.source.checked_on="2026-02-30",d=>d.source.evidence_class="HUMAN_VERIFIED",
    d=>d.facts.appliances_verified=true,d=>d.facts.maximum_adults=5,d=>d.facts.maximum_children=5,
    d=>d.budget.amount=999,d=>d.budget.price_observed_on="2026-10-09",d=>d.budget.currency="GBP",d=>d.budget.unit="person/night",
    d=>d.facts.pricing_basis="nightly-live",d=>d.checks=[]
  ]) {const invalid=structuredClone(original);mutate(invalid);assert.throws(()=>bostonPackForDate("2026-10-09",invalid));}
  bostonPackForDate("2026-10-09");assert.deepEqual(bostonPlazaEvidence,original);
});
