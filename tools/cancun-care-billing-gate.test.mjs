import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';

const record = JSON.parse(readFileSync(new URL('../docs/research/cancun-care-billing-gate-2026-10-09.json', import.meta.url)));
const originalBytes = readFileSync(new URL('../docs/research/cancun-family-oasis-price-2026-10-02.json', import.meta.url));
const original = JSON.parse(originalBytes);

test('care audit pins the original quote without renewing its date or tariff', () => {
  assert.equal(createHash('sha256').update(originalBytes).digest('hex'), record.historical_quote.sha256);
  assert.equal(record.historical_quote.observation_on, original.observed_on);
  assert.equal(record.historical_quote.renewed, false);
  assert.equal(record.observed_on, '2026-10-09');
  assert.equal(record.historical_quote.currency_basis, 'Original US storefront interpretation, not displayed ISO');
});

test('room party, stay, category and price context match the historical receipt', () => {
  assert.equal(record.task.adults, original.task.adults);
  assert.deepEqual(record.task.child_ages, original.task.child_ages);
  assert.equal(record.task.arrival, original.task.arrival);
  assert.equal(record.task.departure, original.task.departure);
  assert.equal(record.task.hotel_nights, original.task.nights);
  assert.equal(record.historical_quote.category, original.room.category);
  assert.equal(record.historical_quote.room_count, original.room.room_count);
  assert.equal(record.historical_quote.before_selected_care_per_night, original.price_basis.before_care.derived_package_per_night);
  assert.equal(record.historical_quote.after_selected_care_per_night, original.price_basis.after_selected_care.derived_package_per_night);
  assert.equal(record.historical_quote.selected_care_increment, original.care.petit.selected_amount);
  assert.equal(record.historical_quote.selected_care_displayed_unit, original.care.petit.displayed_unit);
  assert.match(record.historical_quote.inclusions_limits, /180membership inside total,112optional transfer excluded, separate283MXN/);
});

test('expired offers do not supply the selected care billing contract', () => {
  for (const section of ['1 NIGHT FREE', 'Early Booking Rates']) {
    const offer = record.offer_checks.find(item => item.section === section);
    assert.ok(offer.booking_deadline < record.observed_on);
    assert.ok(offer.latest_checkout < record.task.departure);
    assert.equal(offer.task_applicability, 'REJECTED_EXPIRED');
  }
});

test('lead-time arithmetic is not automatic offer eligibility', () => {
  const offer = record.offer_checks.find(item => item.section === 'Last Minute Deals');
  const arrival = Date.parse(record.task.arrival);
  assert.equal((arrival - Date.parse(record.observed_on)) / 86400000, 30);
  assert.equal(offer.task_days_until_arrival, 30);
  assert.equal(offer.departure_within_days, 21);
  assert.equal(new Date(arrival - 21 * 86400000).toISOString().slice(0, 10), record.task_result.conditional_21_day_date);
  assert.equal(offer.other_offer_conditions_confirmed, false);
  assert.equal(offer.task_applicability, 'REJECTED_OUTSIDE_LEAD_TIME');
  assert.match(record.task_result.next_trigger, /not automatic LastMinute qualification/);
});

test('a matching cancellation label does not prove exact offer mapping or care terms', () => {
  const offer = record.offer_checks.find(item => item.section === 'Non Refundable Rates');
  assert.equal(offer.closest_quote_rate_label, true);
  assert.equal(offer.exact_selected_offer_mapping_confirmed, false);
  assert.equal(offer.care_billing_clause_present_in_section, false);
  assert.equal(offer.task_applicability, 'UNKNOWN_SELECTED_OFFER');
});

test('unresolved costs, duration, slots and admission remain null, not zero', () => {
  for (const key of ['temporal_unit_for_296', 'minimum_package', 'billable_care_days', 'prorated_90_minute_cost', 'three_simultaneous_slots_confirmed', 'admission_confirmed', 'sleeping_assignments', 'complete_all_currency_mandatory_total']) {
    assert.equal(record.task_result[key], null, key);
  }
  for (const key of ['numeric_cancun_tariff', 'minimum_care_package', 'billing_days']) assert.equal(record.program_check[key], null);
  assert.equal(record.task_result.public_or_shared_model_changed, false);
  assert.equal(record.task_result.decision, 'PRESERVE_HISTORICAL_QUOTE_PENDING_SELECTED_CARE_TERMS');
});

test('source scope and observation dates are separate from unknown publication dates', () => {
  assert.deepEqual(record.sources.map(item => item.id), ['terms', 'petit']);
  for (const source of record.sources) {
    assert.equal(source.accessed_on, record.observed_on);
    assert.equal(source.publication_date, null);
    assert.equal(source.effective_date, null);
    assert.match(source.url, /^https:\/\/www\.clubmed\.us\/l\//);
  }
});
