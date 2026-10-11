import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { suites, priceRecheckOn, checkedOn, pageUpdatedOn } from "./page-generation/orlando-suite-data.mjs";
import { orlandoSuitePage } from "./page-generation/orlando-suite-page.mjs";
import { compareStay } from "./page-generation/orlando-suite-model.mjs";
import { hotelEvidence } from "./hotel-evidence.mjs";

const evidence = JSON.parse(readFileSync(new URL("../docs/research/orlando-ihg-rate-plans-2026-10-11.json", import.meta.url)));
test("two public rate plans preserve exact dated count-only basis and displayed arithmetic", () => {
  const hotel = suites[2];
  for (const [i, p] of [hotel.priceSample, hotel.alternatePriceSample].entries()) {
    const source = evidence.plans[i];
    assert.equal(p.plan, source.plan);
    assert.equal(p.observedOn, evidence.observed_on);
    assert.equal(p.room, evidence.room);
    assert.equal(p.stay, "November 8-13, 2026");
    assert.equal(p.nights, 5);
    assert.equal(p.party, "two adults and three children (ages not entered)");
    assert.equal(p.roomSubtotal, source.room_subtotal);
    assert.equal(p.resortFees, source.resort_fees);
    assert.equal(p.taxes, source.taxes);
    assert.equal(p.estimatedTotal, source.estimated_total);
    assert.equal(Math.round((p.roomSubtotal + p.resortFees + p.taxes) * 100), Math.round(p.estimatedTotal * 100));
    assert.equal(Math.round(p.estimatedTotal / p.nights * 100) / 100, source.derived_nightly);
  }
  assert.equal(evidence.party.entered_ages, null);
  assert.equal(evidence.party.status, "COUNT_ONLY_AGE_UNRESOLVED");
  assert.equal(priceRecheckOn, "2026-10-18");
  assert.equal(checkedOn, "2026-09-24");
  assert.equal(pageUpdatedOn, "2026-09-27");
});
test("visible terms retain cancellation deadline, fee inclusion, missing age and deposit conflicts", () => {
  const html = orlandoSuitePage();
  for (const text of ["USD759.40", "USD815.65", "USD405.00", "USD455.00", "USD84.40", "USD90.65", "About USD152", "About USD163", "November 6, 2026", "6:00 PM local hotel time", "non-refundable", "seven days before arrival", "ages 4, 8 and 12", "do not add that fee again", "Parking is extra", "covered guest count is not established", "breakfast coverage is not established"]) assert.ok(html.includes(text), text);
  assert.doesNotMatch(html, /USD763\.90|USD153 per room\/night/);
  assert.equal((html.match(/data-rate-plans="holiday-inn"/g) ?? []).length, 1);
  assert.equal(compareStay().rows[2].resortExtra, null);
  assert.match(compareStay({children:4}).rows[2].capacity, /headcount only/);
  assert.match(html, /applicable charge and entitlement.*remain unresolved/);
});
test("existing normalized catalog uses the same primary observed price, not the historical sample", () => {
  const hotel = hotelEvidence().find(h => h.id === "orlando-holiday-inn");
  assert.equal(hotel.fields.price.value.amount_from, 151.88);
  assert.equal(hotel.fields.price.observed_on, "2026-10-11");
  assert.equal(hotel.fields.price.value.party_basis, suites[2].priceSample.party);
  assert.equal(JSON.parse(hotel.fields.price.value.source_basis).estimatedTotal, 759.40);
});
