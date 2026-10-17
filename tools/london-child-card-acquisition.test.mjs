import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const r = JSON.parse(readFileSync(new URL('../docs/research/london-child-card-acquisition-2026-10-17.json', import.meta.url)));

test('same-date card fees are equal components, not a travel or postage total', () => {
  assert.equal(r.checked_on, '2026-10-17');
  assert.equal(r.recheck_on, '2026-10-31');
  assert.equal(r.card_fees.currency, 'GBP');
  assert.equal(r.card_fees.visitor.amount_minor, 1050);
  assert.equal(r.card_fees.ordinary.amount_minor, 1050);
  assert.equal(r.card_fees.visitor.postage_additional, true);
  assert.equal(r.card_fees.visitor.postage_amount_minor, null);
  assert.equal(r.card_fees.complete_family_transport_cost_minor, null);
  assert.equal(r.card_fees.discount_activation_fee_minor, null);
  assert.match(r.decision.result, /^REJECT/);
  assert.equal(r.desk_cases.length, 3);
  for (const c of r.desk_cases.slice(0, 2)) {
    assert.equal(c.new_card_count, 2);
    assert.equal(c.acquisition_component_minor, c.new_card_count * c.fee_each_minor);
    assert.equal(c.acquisition_component_minor, 2100);
  }
  for (const c of r.desk_cases) {
    assert.equal(c.complete_trip_cost_minor, null);
    assert.equal(c.travel_credit_minor, null);
    assert.equal(c.postage_component_minor, null);
    assert.equal(c.discount_eligibility_confirmed, false);
  }
});

test('staff-applied child discount and already-owned cards are never assumed eligible', () => {
  assert.deepEqual(r.scenario.child_ages, [4, 8, 12, 15]);
  assert.equal(r.scenario.dated_service_or_discount_confirmed, false);
  assert.equal(r.child_setup.visitor_discount_age_min, 11);
  assert.equal(r.child_setup.visitor_discount_age_max, 15);
  assert.equal(r.child_setup.maximum_days, 14);
  assert.equal(r.child_setup.child_present_required, true);
  assert.equal(r.child_setup.staff_application_required, true);
  assert.equal(r.child_setup.actual_staff_setup_confirmed, false);
  for (const k of ['ordinary_card_young_visitor_eligibility', 'existing_card_eligibility', 'contactless_discount_eligibility', 'under_11_new_cards_required_for_this_task']) assert.equal(r.child_setup[k], null, k);
  assert.equal(r.child_setup.hotel_adult_age_band_used, false);
  const existing = r.desk_cases[2];
  assert.equal(existing.new_card_count, 0);
  assert.equal(existing.acquisition_component_minor, 0);
  assert.match(existing.assumption, /not evidence of valid reuse or free travel/);
});

test('source dates, one forbidden dependency and non-public scope remain explicit', () => {
  assert.equal(r.sources.length, 3);
  for (const s of r.sources) {
    assert.equal(s.inspected_on, r.checked_on);
    const u = new URL(s.url);
    assert.equal(u.protocol, 'https:');
    assert.ok(u.hostname === 'tfl.gov.uk' || u.hostname === 'support.visitorshop.tfl.gov.uk');
    assert.equal(u.search, '');
  }
  assert.equal(r.sources[2].displayed_updated_on, '2025-12-17');
  assert.equal(r.sources[2].policy_effective_on, null);
  assert.equal(r.failed_dependency.url, 'https://tfl.gov.uk/fares/ways-to-pay/pay-as-you-go');
  assert.equal(r.failed_dependency.attempts, 1);
  assert.equal(r.failed_dependency.retry_performed, false);
  assert.match(r.failed_dependency.result, /403 Forbidden/);
  for (const k of ['existing_081_089_and_room_price_records_renewed', 'route_stroller_safety_or_family_fit_assured', 'public_change', 'actual_parent_or_seo_evidence']) assert.equal(r.preservation[k], false, k);
  assert.equal(r.preservation.purchase_contact_paid_calls, 0);
});
