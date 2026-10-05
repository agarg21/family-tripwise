import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { hotelEvidence, validateHotelEvidence } from "./hotel-evidence.mjs";
import { qualityReport } from "./page-quality.mjs";

const path = "docs/research/la-jolla-shores-fees-2026-10-05.json";
const audit = JSON.parse(readFileSync(new URL("../" + path, import.meta.url), "utf8"));
const record = () => hotelEvidence().find(r => r.hotel === "La Jolla Shores Hotel");

test("three current official fee statements reconcile parking without inventing a stay quote", () => {
  assert.equal(audit.observations.length, 3);
  assert.deepEqual(audit.observations.map(x => [x.parking_amount, x.parking_unit]), [[55,"day"],[55,"day"],[55,"day"]]);
  assert.deepEqual(audit.observations.map(x => x.resort_fee_amount), [null,50,50]);
  assert.equal(audit.prior_record.parking_conflict, "FAQ45versus accommodations/policy55");
  assert.deepEqual(record().fields.fees, audit.fee_envelope);
  assert.deepEqual(validateHotelEvidence(hotelEvidence()), []);
});

test("fee provenance dates and source union agree while taxes and rate inclusion remain unknown", () => {
  const fee = record().fields.fees;
  assert.equal(fee.state, "known");
  assert.equal(fee.observed_on, "2026-10-05");
  assert.equal(fee.evidence_path, path);
  assert.deepEqual(fee.source_refs.map(x => x.checked_on), ["2026-10-05","2026-10-05","2026-10-05"]);
  assert.deepEqual(fee.source_urls, audit.observations.map(x => x.url));
  assert.equal(fee.value.resort_fee_usd, 50);
  assert.equal(fee.value.resort_fee_unit, "night");
  assert.equal(fee.value.parking_unit, "day");
  for (const key of ["parking_conflict","parking_tax_inclusion","tax_inclusion","room_rate_fee_inclusion","exact_room_party_stay"]) assert.equal(fee.value[key], null);
  assert.equal(fee.value.currency_evidence_class, "EDITORIAL_INTERPRETATION");
  assert.match(fee.limitation, /not a final quote/);
});

test("hypothetical fee components retain parking day assumptions and avoid double-counting prices", () => {
  const proxy = audit.budget_proxy;
  assert.equal(proxy.no_parking_resort_fee_before_tax_usd, 50 * proxy.nights);
  assert.equal(proxy.assumed_parking_before_unknown_tax_usd, 55 * proxy.billable_parking_days_assumed);
  assert.equal(proxy.combined_fee_components_before_tax_usd, 525);
  assert.match(proxy.stay_dates, /Hypothetical/);
  assert.match(proxy.limitation, /double count/);
  assert.match(proxy.limitation, /not a confirmed waiver/);
});

test("fee renewal leaves historical price room review activity and transport evidence unchanged", () => {
  const fields = record().fields;
  assert.equal(fields.price.observed_on, "2026-07-21");
  assert.equal(fields.price.value.display, "$350-$550+");
  assert.equal(fields.price.value.party_basis, "Two adults");
  assert.equal(fields.room.observed_on, "2026-08-17");
  assert.equal(fields.activities.observed_on, "2026-08-17");
  assert.equal(fields.review_signal.observed_on, "2026-07-21");
  assert.equal(fields.review_signal.value.representative, false);
  assert.equal(fields.transport.state, "unknown");
  assert.equal(hotelEvidence().find(r => r.hotel === "Loews Coronado Bay Resort").fields.fees.state, "disputed");
});

test("fresh fee reconciliation removes only its dispute task and ordinary freshness expiry returns it", () => {
  const id = "san-diego-la-jolla-shores-hotel-fees";
  assert.equal(qualityReport(hotelEvidence(), {today:"2026-10-05"}).tasks.some(t => t.id === id), false);
  const due = qualityReport(hotelEvidence(), {today:"2026-10-20"}).tasks.find(t => t.id === id);
  assert.ok(due);
  assert.equal(due.reasons.includes("disputed"), false);
});

test("returned shared envelope mutation cannot alter later evidence calls", () => {
  const first = record();
  first.fields.fees.value.parking_usd = 0;
  first.fields.fees.source_refs[0].checked_on = "2027-01-01";
  assert.deepEqual(record().fields.fees, audit.fee_envelope);
});
