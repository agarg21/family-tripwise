import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { bostonPack, bostonPackForDate, bostonPlazaEvidence, bostonRooms, bostonPrices, bostonCsv, bostonBaseCsv, bostonFamilyHotelPage, bostonBreakfastUpgrade } from "./page-generation/boston-family-hotels-page.mjs";
import { validateRoomPack } from "./family-room-task.mjs";
import {readableComparisonCsv,labelOlderStaySamples,roomComparisonCsv } from "./family-room-comparison.mjs";
const read = path => JSON.parse(readFileSync(new URL(`../${path}`, import.meta.url), "utf8"));

test("exact Plaza Suite overlay renews only its source facts, never a nightly quote", () => {
  const original=read("docs/research/boston-room-configurations-2026-10-01.json");
  assert.deepEqual(validateRoomPack(bostonPack), []);
  assert.equal(bostonPack.checked_on,"2026-10-09");
  // Q17b: only the three strings that pointed at the withdrawn Nov 8-13 rates are restated; everything else is unchanged.
  const restated=new Set(["Older November 2026 rate withdrawn October 31; full taxes/mandatory fees/deposit unknown","October 3 rate for a November 2026 stay withdrawn October 31 (could not be re-observed); no current exact-party price","Check exact individual ages and public plan for your dates"]);
  for (const record of bostonPack.records.filter(r=>r.id!==bostonPlazaEvidence.record_id)) {
    const before=original.records.find(r=>r.id===record.id);
    const strip=r=>({...r,checks:r.checks.filter(t=>!restated.has(t)&&!/withdrawn|for Nov8-13|separate dated observation|separate October3/.test(t)),price:{...r.price,missing_basis:(r.price.missing_basis??[]).filter(t=>!restated.has(t)&&!/separate October3/.test(t))}});
    assert.deepEqual(strip(record),strip(before));
    assert.equal(record.checks.length,before.checks.length);
  }
  assert.deepEqual(bostonPack.scenario.stay,{arrival:"2027-01-15",departure:"2027-01-20"});
  for (const [key,source] of Object.entries(original.sources)) assert.deepEqual(bostonPack.sources[key],source);
  const plaza=bostonRooms.find(r=>r.id===bostonPlazaEvidence.record_id);
  assert.equal(plaza.checked_on,"2026-10-09");assert.equal(plaza.kitchen,"published-kitchen");
  assert.equal(plaza.price.amount,null);assert.equal(plaza.price.observed_on,null);assert.equal(plaza.price.status,"not-observed");
  assert.deepEqual(bostonRooms.map(r=>r.checked_on),["2026-10-03","2026-10-01","2026-10-09","2026-10-01"]);
  // Q17b (OWNER D9/O2): the Nov 8-13 plan samples are withdrawn from every room; only historical arithmetic remains.
  assert.ok(bostonRooms.every(r=>!r.price.rates));
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
  assert.equal(bostonBaseCsv,readableComparisonCsv(labelOlderStaySamples(roomComparisonCsv(bostonPack,bostonPack.scenario,"2026-10-09",bostonPrices))));
  assert.equal(bostonCsv.trim().split("\n").length,5); // Q17b: one row per room
  assert.equal(bostonRooms.filter(r=>r.kitchen==="published-kitchen").length,2);
  assert.equal(roomComparisonCsv(bostonPack,bostonPack.scenario,"2026-10-09",bostonPrices,{kitchen:"published"}).trim().split("\n").length,3);
  for (const text of [bostonPlazaEvidence.facts.kitchen_description,bostonPlazaEvidence.budget.limitation,"complete two-bedroom bed list","rates were removed October 31"])
    assert.ok(html.toLowerCase().includes(text.toLowerCase()),text);
  const row=bostonCsv.split("\n").find(line=>line.includes('"Plaza Suite"'));
  for (const text of ["published-kitchen","2026-10-09",bostonPlazaEvidence.source.url,"monthly pricing by phone","configuration/night","Unpriced","2027-01-15","2027-01-20"])
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
