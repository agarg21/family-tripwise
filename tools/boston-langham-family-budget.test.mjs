import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {bostonRooms,bostonCsv,bostonFamilyHotelPage} from "./page-generation/boston-family-hotels-page.mjs";
const record=JSON.parse(readFileSync(new URL("../docs/research/boston-langham-family-budget-2026-10-09.json",import.meta.url)));

test("exact entered ages and stay do not establish an unreturned Club suite price",()=>{
  assert.deepEqual(record.scenario.child_ages,[4,8,12]);assert.equal(record.scenario.nights,5);
  assert.equal((Date.parse(record.scenario.departure)-Date.parse(record.scenario.arrival))/86400000,5);
  assert.equal(record.booking_provenance.age_entry_mode,"individual-ages-entered");
  assert.equal(record.booking_provenance.child_max,12);assert.equal(record.booking_provenance.adult_min,13);
  assert.equal(record.target_price.amount,null);assert.equal(record.target_price.stay_total,null);
  assert.equal(record.target_price.observed_on,null);assert.equal(record.hold.sold_out_claim_supported,false);
});
test("different Family/member advertised labels remain excluded controls",()=>{
  const c=record.excluded_price_control;assert.equal(c.same_as_target_category,false);
  assert.equal(c.public_from,756);assert.equal(c.member_from,741);
  assert.equal(c.nightly_average_adopted,null);assert.equal(c.stay_total_adopted,null);
  assert.equal(c.taxes_and_fees,"excluded");assert.equal(record.booking_provenance.rates_opened,false);
  assert.equal(record.booking_provenance.contact_made,false);
});
test("public Club comparison remains unpriced and original observations are not renewed",()=>{
  const room=bostonRooms.find(r=>r.id===record.target.record_id);assert.ok(room);assert.ok(!room.price.rates);
  assert.equal(room.checked_on,"2026-10-01");assert.equal(bostonRooms.length,4);
  assert.ok(!bostonCsv.includes("756.00"));assert.ok(!bostonCsv.includes("741.00"));
  assert.ok(!bostonFamilyHotelPage().includes("USD 756.00"));
  assert.equal(record.preservation.original_price_observations_renewed,false);
});
