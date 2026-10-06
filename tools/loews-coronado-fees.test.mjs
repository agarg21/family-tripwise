import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { hotelEvidence, validateHotelEvidence } from "./hotel-evidence.mjs";
import { qualityReport } from "./page-quality.mjs";

const path = "docs/research/loews-coronado-fees-2026-10-06.json";
const audit = JSON.parse(readFileSync(new URL("../" + path, import.meta.url), "utf8"));
const record = () => hotelEvidence().find(r => r.hotel === "Loews Coronado Bay Resort");

test("current parking amount has one numeric source, not invented two-source agreement", () => {
  assert.equal(audit.observations.length, 2);
  assert.deepEqual(audit.observations.map(x => x.self_parking_amount), [50, null]);
  assert.deepEqual(audit.observations.map(x => x.valet_amount), [55, null]);
  assert.deepEqual(audit.observations.map(x => x.resort_fee_amount), [42,42]);
  assert.equal(audit.prior_record.self_parking_conflict, "FAQ50versus amenities47");
  assert.deepEqual(record().fields.fees, audit.fee_envelope);
  assert.deepEqual(validateHotelEvidence(hotelEvidence()), []);
});

test("current fee amounts preserve units taxes conditional processing and quote unknowns", () => {
  const f = record().fields.fees;
  assert.equal(f.state, "known");
  assert.equal(f.observed_on, "2026-10-06");
  assert.equal(f.evidence_path, path);
  assert.deepEqual(f.source_urls, audit.observations.map(x => x.url));
  assert.deepEqual(f.source_refs.map(x => x.checked_on), ["2026-10-06", "2026-10-06"]);
  assert.equal(f.value.resort_fee_unit, "room/night");
  assert.equal(f.value.parking_unit, "night");
  assert.equal(f.value.resort_fee_usd, 42);
  assert.equal(f.value.self_parking_usd, 50);
  assert.equal(f.value.valet_usd, 55);
  assert.match(f.value.parking_tax, /Plus tax/);
  assert.equal(f.value.parking_processing_fee_usd, 1.99);
  assert.equal(f.value.parking_processing_fee_unit, "one-time if applicable");
  assert.equal(f.value.parking_processing_fee_required, null);
  assert.equal(f.value.parking_processing_fee_tax_inclusion, null);
  assert.equal(f.value.room_rate_fee_inclusion, null);
  assert.equal(f.value.exact_room_party_stay, null);
  assert.equal(f.value.currency_evidence_class, "EDITORIAL_INTERPRETATION");
});

test("five-night fee proxy keeps self and valet alternatives and conditional processing once", () => {
  const p = audit.budget_proxy;
  assert.equal(p.resort_component_before_tax_usd, 42 * p.room_count * p.nights);
  assert.equal(p.self_parking_component_before_tax_usd, 50 * p.charged_parking_nights_assumed);
  assert.equal(p.valet_component_before_tax_usd, 55 * p.charged_parking_nights_assumed);
  assert.equal(p.self_plus_resort_components_before_tax_usd, 460);
  assert.equal(p.valet_plus_resort_components_before_tax_usd, 485);
  assert.equal(p.self_plus_resort_with_one_processing_component_usd, 460 + 1.99);
  assert.equal(p.valet_plus_resort_with_one_processing_component_usd, 485 + 1.99);
  assert.match(p.limitation, /alternatives, never additive together/);
  assert.match(p.limitation, /assumptions/);
  assert.match(p.limitation, /do not add blindly/);
  assert.match(p.stay_dates, /Hypothetical/);
});

test("historical price room review transport and activities plus La Jolla fees retain their dates", () => {
  const f = record().fields;
  assert.equal(f.price.observed_on, "2026-07-18");
  assert.equal(f.price.value.display, "$235-$360+");
  assert.equal(f.price.value.room_basis, "Lowest visible standard-room example; room/view configuration unknown");
  assert.equal(f.room.state, "unknown");
  assert.equal(f.room.observed_on, "2026-08-17");
  assert.equal(f.activities.observed_on, "2026-08-17");
  assert.equal(f.transport.observed_on, "2026-08-17");
  assert.equal(f.review_signal.observed_on, "2026-07-18");
  assert.equal(f.review_signal.value.representative, false);
  const laJolla = hotelEvidence().find(r => r.hotel === "La Jolla Shores Hotel");
  const laJollaAudit = JSON.parse(readFileSync(new URL("../docs/research/la-jolla-shores-fees-2026-10-05.json", import.meta.url), "utf8"));
  assert.deepEqual(laJolla.fields.fees, laJollaAudit.fee_envelope);
});

test("fresh fee-only reconciliation removes its dispute task then native14day expiry returns review", () => {
  const id = "san-diego-loews-coronado-bay-resort-fees";
  assert.equal(qualityReport(hotelEvidence(), {today:"2026-10-06"}).tasks.some(t => t.id === id), false);
  const due = qualityReport(hotelEvidence(), {today:"2026-10-21"}).tasks.find(t => t.id === id);
  assert.ok(due);
  assert.equal(due.reasons.includes("disputed"), false);
  assert.ok(due.reasons.includes("review-due"));
  assert.match(due.limitation, /not a final family-room quote/);
});

test("mutating returned fee record cannot change later shared evidence calls", () => {
  const first = record();
  first.fields.fees.value.self_parking_usd = 0;
  first.fields.fees.source_refs[0].checked_on = "2027-01-01";
  assert.deepEqual(record().fields.fees, audit.fee_envelope);
});
