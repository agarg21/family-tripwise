import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read = name => JSON.parse(readFileSync(new URL(`../docs/research/${name}-2026-10-13.json`, import.meta.url)));
const gate = read('miami-family-five-gate');
const demand = read('miami-family-five-demand');
const followup = JSON.parse(readFileSync(new URL('../docs/research/miami-surfside-fee-conflict-2026-10-14.json', import.meta.url)));
const roomGate = JSON.parse(readFileSync(new URL('../docs/research/miami-surfside-room-gate-2026-10-14.json', import.meta.url)));

test('Miami demand preserves actual samples, estimates and reconciled paid costs', () => {
  assert.deepEqual(demand.keywords.map(x => x.search_volume), [1000, 480]);
  assert.deepEqual(gate.demand.estimates.map(x => x.metrics_updated_at), demand.keywords.map(x => x.metrics_updated_at));
  const [a, b] = demand.serps.map(x => x.organic.map(y => y.url));
  assert.deepEqual(gate.demand.organic_counts, [a.length, b.length]);
  assert.equal(gate.demand.shared_exact_urls, a.filter(x => b.includes(x)).length);
  assert.equal(gate.demand.union_exact_urls, new Set([...a, ...b]).size);
  assert.equal(gate.demand.jaccard, 5 / 13);
  const receipt = gate.demand.paid_receipt;
  assert.equal(receipt.successful_calls, demand.calls.filter(x => x.status === 'success').length);
  assert.equal(receipt.batch_usd, Number(demand.total_cost_usd.toFixed(5)));
  assert.equal(receipt.cumulative_usd, Number((receipt.prior_usd + receipt.batch_usd).toFixed(5)));
  assert.ok(receipt.batch_usd < receipt.batch_ceiling_usd && receipt.cumulative_usd < receipt.cumulative_ceiling_usd);
});

test('Miami candidate fails closed on exact-family acceptance and prices', () => {
  assert.equal(gate.action, 'FT-RES-151');
  assert.equal(gate.decision, 'CANDIDATE');
  assert.equal(gate.public_ready, false);
  assert.deepEqual(gate.family_task.child_ages, [4, 8, 12]);
  assert.equal(gate.family_task.reference_stay.nights, 5);
  assert.equal(gate.existing_owner.miami_owner, null);
  assert.equal(gate.properties[0].official.maximum_occupancy, null);
  for (const p of gate.properties) {
    assert.equal(p.booking_observation.nightly_family_quote, null);
    assert.equal(p.official.class, 'OFFICIAL_PROPERTY_FACT');
    assert.equal(p.booking_observation.class, 'OTA_PROPERTY_TEXT_NOT_SELECTED_QUOTE');
    assert.match(p.booking_observation.excluded_teaser, /Two-adult/);
    assert.ok(p.next_checks.length >= 5);
  }
  assert.match(gate.next_eligible_action.when, /Next actual sprint run/);
  assert.match(gate.next_eligible_action.task, /Nov8-13,2026/);
  assert.match(gate.next_eligible_action.publication_gate, /desktop\/mobile\/keyboard/);
});

test('Miami source signals retain dates and unknowns without identities or ratings', () => {
  for (const p of gate.properties) {
    assert.equal(p.booking_observation.reviews.length, 4);
    for (const r of p.booking_observation.reviews) {
      assert.deepEqual(Object.keys(r), ['posted_on', 'stay_month', 'signal']);
      assert.match(r.posted_on, /^2026-\d{2}-\d{2}$/);
      assert.match(r.stay_month, /^2026-\d{2}$/);
    }
    assert.match(p.booking_observation.review_limits, /not representative or a rating/);
  }
  assert.equal(gate.desk_personas.length, 2);
  assert.ok(gate.desk_personas.every(x => x.steps.length === 7 && x.result.startsWith('PARTIAL:')));
  assert.match(gate.properties[0].booking_observation.fee_resolution, /do not sum/);
  assert.match(gate.properties[1].booking_observation.fee_resolution, /third child/);
  assert.match(gate.validation_limits, /not actual parents/);
});

test('Surfside follow-up retains both primary fee/credit observations with unknown applicability', () => {
  assert.equal(followup.action_id, 'FT-RES-169');
  assert.equal(followup.property.id, gate.properties[0].id);
  assert.equal(followup.property.marriott_code, 'miaxb');
  assert.deepEqual(followup.sources.map(s => [s.destination_amenity_fee.amount, s.dining_credit.amount]), [[30, 30], [34, 17]]);
  for (const s of followup.sources) {
    assert.equal(s.checked_on, '2026-10-14');
    assert.equal(s.publisher_effective_date, null);
    assert.equal(s.native_http_status, null);
    assert.match(s.url, /^https:\/\/www\.marriott\.com\/en-us\/hotels\/miaxb-residence-inn-miami-beach-surfside\/(rooms|overview)\/$/);
    assert.equal(s.destination_amenity_fee.currency, 'USD');
    assert.equal(s.destination_amenity_fee.time_unit, 'per night');
    assert.equal(s.destination_amenity_fee.charge_basis, null);
    assert.equal(s.destination_amenity_fee.tax_basis, 'plus tax');
    assert.equal(s.dining_credit.time_unit, 'daily');
    assert.equal(s.dining_credit.charge_basis, null);
    assert.equal(s.dining_credit.rollover_or_cash_value, null);
  }
});

test('Surfside body conflict cannot become a controlling policy or family quote', () => {
  const r = followup.result;
  assert.equal(r.decision, 'REJECT_SEARCH_ONLY_EXPLANATION');
  assert.equal(r.applicability_status, 'HOLD_PRIMARY_CONFLICT_AND_SELECTED_RATE_GAPS');
  for (const field of ['controlling_fee', 'controlling_credit', 'effective_policy_date', 'selected_rate', 'nightly_family_quote']) assert.equal(r[field], null);
  assert.equal(r.public_ready, false);
  assert.equal(followup.property.category, null);
  assert.equal(followup.property.accepted_exact_family, null);
  assert.deepEqual(followup.family_task.child_ages, gate.family_task.child_ages);
  assert.equal(followup.family_task.arrival, gate.family_task.reference_stay.arrival);
  assert.equal(followup.family_task.departure, gate.family_task.reference_stay.departure);
  assert.equal(followup.family_task.nights, gate.family_task.reference_stay.nights);
  assert.ok(r.rules.some(s => /Do not subtract/.test(s)));
  assert.ok(r.rules.some(s => /generic8-guest/.test(s)));
  assert.ok(r.rules.some(s => /Do not add or replace/.test(s)));
  assert.match(r.next_eligible_run, /do not repeat identical bodies/);
});

test('Surfside follow-up separates body review from original OTA and historical clocks', () => {
  assert.equal(followup.prior_record_renewed, false);
  assert.equal(followup.prior_record, 'docs/research/miami-family-five-gate-2026-10-13.json');
  assert.equal(gate.source_access_on_utc, '2026-10-14');
  assert.deepEqual(gate.properties[0].booking_observation.displayed_fees.map(x => x.amount), [37.74, 36.38, 41]);
  assert.equal(gate.properties[0].booking_observation.reviews[0].posted_on, '2026-10-06');
  assert.equal(gate.properties[0].official.maximum_occupancy, null);
  assert.equal(followup.collection.explicit_primary_opens, 2);
  assert.equal(followup.collection.underlying_http_requests, null);
  for (const field of ['native_requests', 'browser_attempts', 'paid_calls', 'llm_calls', 'source_owner_contacts', 'denied_retries', 'alternate_origin_or_tool_fallbacks']) assert.equal(followup.collection[field], 0);
  assert.equal(followup.collection.source_bodies_retained, false);
  assert.equal(followup.gsc.query_cohort_present, false);
  assert.equal(followup.gsc.ctr_action_selected, false);
});

test('Surfside desk tasks remain unresolved cost evidence rather than rendered or parent proof', () => {
  assert.equal(followup.desk_tasks.length, 2);
  for (const task of followup.desk_tasks) {
    assert.equal(task.steps.length, 6);
    assert.match(task.result, /^HOLD_/);
    assert.equal(task.cash_total, null);
    assert.equal(task.net_fee_after_credit, null);
  }
  assert.match(followup.validation_limits, /not rendered desktop\/mobile\/keyboard/);
  assert.match(followup.validation_limits, /Same-publisher pages are not independent corroboration/);
  assert.ok(Object.values(followup.unchanged).every(x => x === true));
});

test('Surfside room lead preserves OTA property and card identity without claiming an official category', () => {
  assert.equal(roomGate.action_id, 'FT-RES-170');
  assert.equal(roomGate.property.id, gate.properties[0].id);
  assert.equal(roomGate.property.ota_hotel_id, '11255332');
  assert.equal(roomGate.source.url, gate.properties[0].booking_observation.url);
  assert.equal(roomGate.source.section, 'Room options');
  assert.equal(roomGate.evidence_class, 'NEWLY_OBSERVED_OTA_ROOM_LISTING_NOT_LIVE_AVAILABILITY');
  assert.equal(roomGate.room_lead.ota_title, 'Suite, 1 Bedroom');
  assert.equal(roomGate.room_lead.bed_setup, '2 Queen Beds and 1 Double Sofa Bed');
  assert.equal(roomGate.room_lead.advertised_sleeps, 5);
  assert.equal(roomGate.room_lead.advertised_bedrooms, 1);
  assert.deepEqual(roomGate.room_lead.advertised_area, {amount: 650, unit: 'sq ft', measured_by_project: false});
  assert.equal(roomGate.property.first_party_category_mapping, null);
  assert.equal(roomGate.room_lead.ota_room_id, null);
  assert.equal(roomGate.room_lead.cross_channel_category_id, null);
});

test('Surfside identically titled room controls cannot donate capacity or bed allocation', () => {
  const controls = roomGate.title_collision_controls;
  assert.equal(controls[0].ota_title, roomGate.room_lead.ota_title);
  assert.equal(controls[0].advertised_sleeps, 4);
  assert.notEqual(controls[0].bed_setup, roomGate.room_lead.bed_setup);
  assert.deepEqual(controls.slice(1).map(x => [x.ota_title, x.bed_setup, x.advertised_sleeps, x.advertised_area_sq_ft]), [
    ['Suite, 1 King Bed', '1 King Bed', 2, 320],
    ['Suite, 1 King Bed', '1 King Bed', 4, 400]
  ]);
  assert.ok(controls.every(x => x.reader_lines.length >= 4));
  assert.ok(roomGate.excluded.some(x => /Accessible room variants/.test(x)));
  assert.ok(roomGate.excluded.some(x => /alternative-hotel prices/.test(x)));
  assert.ok(roomGate.excluded.some(x => /ratings/.test(x)));
});

test('Surfside room discovery leaves exact-family price, kitchen, layout and conflicting fees unresolved', () => {
  assert.deepEqual(roomGate.family_task.child_ages, gate.family_task.child_ages);
  assert.equal(roomGate.family_task.arrival, gate.family_task.reference_stay.arrival);
  assert.equal(roomGate.family_task.departure, gate.family_task.reference_stay.departure);
  for (const key of ['accepted_exact_family', 'selected_rate', 'nightly_family_quote', 'kitchen_equipment_by_category', 'enclosed_sleeping_layout', 'sofa_comfort_or_rest']) assert.equal(roomGate.room_lead[key], null);
  assert.equal(roomGate.result.decision, 'REJECT_NO_NAMED_ROOM_LEAD_HYPOTHESIS');
  assert.equal(roomGate.result.disposition, 'CANDIDATE_SPECIFIC_OTA_ROOM_LEAD');
  assert.equal(roomGate.result.public_ready, false);
  assert.equal(roomGate.result.accepted_exact_family, null);
  assert.equal(roomGate.result.nightly_family_quote, null);
  assert.equal(roomGate.result.controlling_fee_or_credit, followup.result.controlling_fee);
  assert.equal(roomGate.prior_records_renewed, false);
  assert.equal(gate.properties[0].official.maximum_occupancy, null);
  assert.deepEqual(followup.sources.map(s => [s.destination_amenity_fee.amount, s.dining_credit.amount]), [[30, 30], [34, 17]]);
  assert.match(roomGate.result.next_eligible_run, /No calendar-only re-open/);
});

test('Surfside room audit distinguishes reader clocks and desk evidence from live availability or review renewal', () => {
  assert.equal(roomGate.observed_on_eastern, '2026-10-14');
  assert.equal(roomGate.source.reader_crawl_label, 'yesterday');
  assert.equal(roomGate.source.publisher_effective_date, null);
  assert.equal(roomGate.source.native_http_status, null);
  assert.match(roomGate.source.relative_date_control_text, /not the actual proposed stay/);
  assert.equal(roomGate.reader_open_window_utc.exact_retrieval_timestamp, null);
  assert.equal(roomGate.collection.explicit_ota_opens, 1);
  assert.equal(roomGate.collection.underlying_http_requests, null);
  for (const key of ['search_queries', 'native_requests', 'browser_attempts', 'paid_calls', 'llm_calls', 'source_owner_contacts', 'booking_or_account_mutations', 'denied_retries', 'alternate_origin_or_tool_fallbacks']) assert.equal(roomGate.collection[key], 0);
  assert.equal(roomGate.collection.source_bodies_retained, false);
  assert.equal(roomGate.desk_tasks.length, 2);
  assert.ok(roomGate.desk_tasks.every(x => x.steps.length === 6 && x.result.startsWith('PARTIAL_') && x.booking_acceptance_confirmed === false));
  assert.match(roomGate.validation_limits, /not rendered desktop\/mobile\/keyboard/);
  assert.match(roomGate.validation_limits, /original151 review signals and source dates remain distinct/);
  assert.ok(Object.values(roomGate.unchanged).every(x => x === true));
});
