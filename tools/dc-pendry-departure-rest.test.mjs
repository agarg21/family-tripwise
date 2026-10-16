import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const data = JSON.parse(readFileSync(new URL('../docs/research/dc-pendry-departure-rest-2026-10-16.json', import.meta.url)));

test('primary checkout policy has its own dates and never renews a family-room quote', () => {
  assert.equal(data.checked_on, '2026-10-16');
  assert.equal(data.recheck_on, '2026-10-30');
  assert.equal(data.source.inspected_on, data.checked_on);
  assert.equal(data.source.url, 'https://www.pendry.com/washington-dc/faqs/');
  assert.equal(data.source.published_on, null);
  assert.equal(data.source.effective_on, null);
  assert.equal(data.source.booking_flow_used, false);
  assert.equal(data.policy.standard_check_in, '16:00');
  assert.equal(data.policy.standard_check_out, '11:00');
  assert.deepEqual(data.scenario.child_ages, [4, 8, 12]);
  assert.equal(data.scenario.configuration_count, 1);
  assert.equal(data.scenario.date_specific_policy_verified, false);
  for (const key of ['public_change', 'room_price_observation', 'existing_price_dates_renewed', 'review_signal_or_firsthand_claim', 'journey_stroller_safety_assessed', 'human_preference_or_seo_proof']) assert.equal(data.scope[key], false, key);
});

test('whole-hour component preserves tax, permission and fee-unit uncertainty', () => {
  const p = data.policy.late_check_out, c = data.desk_cases[0];
  assert.equal(p.fee_per_additional_hour_minor, 5000);
  assert.equal(p.currency, 'USD');
  assert.match(p.currency_basis, /Editorial interpretation/);
  assert.match(p.unit, /room-count scaling not established/);
  assert.equal(p.availability_required, true);
  assert.equal(p.tax_included, false);
  assert.equal(p.tax_rate, null);
  assert.equal(p.reservation_specific_acceptance, null);
  assert.equal(c.requested_local_time, '14:00');
  assert.equal(c.whole_hours, 3);
  assert.equal(c.conditional_fee_component_minor, c.whole_hours * p.fee_per_additional_hour_minor);
  assert.match(c.assumption, /Hypothetical approval/);
});

test('partial-hour and after-threshold cases never invent rounding or a nightly amount', () => {
  const p = data.policy.late_check_out;
  assert.equal(p.partial_hour_rounding, null);
  assert.equal(p.after_local_time, '16:00');
  assert.equal(p.after_threshold_charge, 'Additional night fee');
  assert.equal(p.additional_night_amount_minor, null);
  assert.equal(p.hourly_fee_stacking_with_extra_night, null);
  assert.equal(data.desk_cases.length, 4);
  for (const c of data.desk_cases) {
    assert.equal(c.actual_room_access_confirmed, null);
    assert.equal(c.complete_incremental_cost_minor, null);
  }
  for (const c of data.desk_cases.slice(1)) assert.equal(c.conditional_fee_component_minor, null);
  assert.match(data.policy.waiting_fallback, /not a private room/);
  assert.match(data.policy.early_check_in, /only if available/);
  assert.equal(data.scope.contacts_bookings_paid_calls, 0);
});
