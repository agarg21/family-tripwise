import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { hotelEvidence, validateHotelEvidence } from "./hotel-evidence.mjs";
import { qualityReport } from "./page-quality.mjs";

const path = "docs/research/dana-fee-hold-2026-10-08.json";
const audit = JSON.parse(readFileSync(new URL("../" + path, import.meta.url), "utf8"));
const record = () => hotelEvidence().find(r => r.hotel === "The Dana on Mission Bay");

test("Dana fee envelope reuses the single dated primary record with complete provenance", () => {
  assert.deepEqual(record().fields.fees, audit.fee_envelope);
  assert.deepEqual(validateHotelEvidence(hotelEvidence()), []);
  const f = record().fields.fees;
  assert.equal(f.observed_on, "2026-10-08");
  assert.equal(f.evidence_path, path);
  assert.deepEqual(f.source_urls, [audit.observation.url]);
  assert.equal(f.source_refs[0].checked_on, audit.observation.checked_on);
});

test("payable nightly components retain tax limits and conditional rollaway context", () => {
  const f = record().fields.fees.value;
  assert.equal(f.resort_fee_usd, audit.prior_record.resort_fee_usd);
  assert.equal(f.self_parking_usd, audit.prior_record.self_parking_usd);
  assert.equal(f.resort_fee_unit, "night");
  assert.equal(f.parking_unit, "night");
  assert.match(f.resort_fee_tax, /Plus tax/);
  assert.equal(f.parking_tax_inclusion, null);
  assert.equal(f.rollaway_usd, 10);
  assert.equal(f.rollaway_unit, "night");
  assert.equal(f.rollaway_required, false);
  assert.match(f.rollaway_availability, /Limited.*selected rooms.*not guaranteed/);
  assert.equal(f.rollaway_tax_inclusion, null);
  assert.equal(f.room_rate_fee_inclusion, null);
  assert.equal(f.exact_room_party_stay, null);
  assert.equal(f.currency_evidence_class, "EDITORIAL_INTERPRETATION");
});

test("daily incidentals authorization is separate from payable fees and unknown cash total", () => {
  const a = record().fields.fees.value.incidental_authorization;
  assert.equal(a.amount_usd, 50);
  assert.equal(a.unit, "day");
  assert.equal(a.type, "authorization-hold");
  assert.equal(a.payable_fee, false);
  assert.match(a.basis, /full stay amount plus daily incidentals/);
  for (const key of ["day_count", "release_timing", "exact_room_rate_applicability"]) assert.equal(a[key], null);
});

test("hypothetical partial fee arithmetic never adds authorization or assumes hold days", () => {
  const f = record().fields.fees.value, p = audit.budget_proxy;
  assert.equal(p.resort_component_before_tax_usd, f.resort_fee_usd * p.nights_assumed);
  assert.equal(p.self_parking_component_tax_unknown_usd, f.self_parking_usd * p.charged_parking_nights_assumed);
  assert.equal(p.optional_rollaway_component_tax_unknown_usd, f.rollaway_usd * p.optional_rollaway_nights_assumed);
  assert.equal(p.resort_plus_parking_partial_components_usd, p.resort_component_before_tax_usd + p.self_parking_component_tax_unknown_usd);
  assert.equal(p.with_optional_rollaway_partial_components_usd, p.resort_plus_parking_partial_components_usd + p.optional_rollaway_component_tax_unknown_usd);
  assert.equal(p.authorization_day_count, null);
  assert.equal(p.authorization_component_usd, null);
  assert.equal(p.stay_total_usd, null);
  assert.match(p.limitation, /not a stay quote.*do not add blindly.*excluded, not treated as zero/);
});

test("Dana historical price room review activity and unrelated reconciled fees retain dates", () => {
  const f = record().fields;
  assert.equal(f.price.observed_on, "2026-07-21");
  assert.equal(f.price.value.display, "$250-$400+");
  assert.equal(f.price.value.party_basis, "Two adults");
  assert.match(f.price.value.room_basis, /not a six-person suite quote/);
  assert.equal(f.room.observed_on, "2026-08-17");
  assert.equal(f.activities.observed_on, "2026-08-17");
  assert.equal(f.review_signal.observed_on, "2026-07-21");
  for (const [hotel, file] of [["La Jolla Shores Hotel", "la-jolla-shores-fees-2026-10-05.json"], ["Loews Coronado Bay Resort", "loews-coronado-fees-2026-10-06.json"]]) {
    const expected = JSON.parse(readFileSync(new URL("../docs/research/" + file, import.meta.url), "utf8"));
    assert.deepEqual(hotelEvidence().find(r => r.hotel === hotel).fields.fees, expected.fee_envelope);
  }
});

test("only renewed fees leave their due queue while ordinary14day expiry returns review", () => {
  const id = "san-diego-the-dana-on-mission-bay-fees";
  assert.equal(qualityReport(hotelEvidence(), {today: "2026-10-08"}).tasks.some(t => t.id === id), false);
  assert.ok(qualityReport(hotelEvidence(), {today: "2026-10-08"}).tasks.some(t => t.id === "san-diego-the-dana-on-mission-bay-price"));
  const due = qualityReport(hotelEvidence(), {today: "2026-10-23"}).tasks.find(t => t.id === id);
  assert.ok(due);
  assert.ok(due.reasons.includes("review-due"));
});

test("mutating a returned hold cannot change the validated shared record", () => {
  const first = record();
  first.fields.fees.value.incidental_authorization.payable_fee = true;
  first.fields.fees.value.incidental_authorization.day_count = 5;
  first.fields.fees.source_refs[0].checked_on = "2027-01-01";
  assert.deepEqual(record().fields.fees, audit.fee_envelope);
});
