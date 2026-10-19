import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {ferryEvidence, ferryBudget, ferryReviewClock} from './nyc-ferry-budget.mjs';

const r = JSON.parse(readFileSync(new URL('../docs/research/nyc-ferry-effective-fare-2026-10-19.json', import.meta.url)));

test('effective-date review requires a new body observation and preserves legacy conflicts', () => {
  assert.equal(r.checked_on, '2026-10-19');
  assert.equal(r.recheck_on, '2026-11-02');
  assert.equal(r.current_operator_panel.single_ticket_cents, 500);
  assert.equal(r.current_operator_panel.ten_trip_pack_cents, 3000);
  assert.equal(r.current_operator_panel.fare_state, 'CURRENT_OPERATOR_PANEL_OBSERVED_NOT_CHECKOUT');
  assert.equal(r.current_operator_panel.body_matches_dated_notice, true);
  assert.equal(r.current_operator_panel.checkout_observed, false);
  assert.equal(r.current_operator_panel.tax_fee_inclusion, null);
  assert.equal(r.current_operator_panel.dated_service_or_boarding_confirmed, false);
  assert.deepEqual(r.conflicts.map(c => [c.single_ticket_cents, c.ten_trip_pack_cents]), [[400, 2750], [450, 2900]]);
  assert.match(r.conflicts[1].treatment, /not current-table corroboration/);
  assert.equal(r.sources[1].published_on, '2026-09-28');
  assert.equal(r.sources[1].announced_effective_on, r.checked_on);
  assert.equal(r.sources[2].published_on, null);
  assert.match(r.sources[2].retrieval_limit, /offline\/read-only banner/);
});

test('standard family single tickets price each direction, never an unknown eligible party', () => {
  assert.equal(r.scenario.standard_fare_riders, 4);
  assert.deepEqual(r.scenario.teen_ages, [13, 17]);
  assert.equal(r.scenario.all_riders_over_44_inches, true);
  assert.equal(r.scenario.discounts_assumed, false);
  assert.equal(r.transfers.one_way_minutes, 120);
  assert.equal(r.transfers.round_trip_free_transfer, false);
  assert.equal(r.transfers.fare_is_round_trip, false);
  for (const c of r.desk_cases.slice(0, 2)) {
    assert.equal(c.fare_component_cents, c.standard_riders * c.separately_charged_directions * r.current_operator_panel.single_ticket_cents);
    assert.equal(c.complete_checkout_total_cents, null);
  }
  assert.deepEqual(r.desk_cases.map(c => c.fare_component_cents), [2000, 4000, null]);
  assert.equal(r.desk_cases[2].standard_riders, null);
});

test('old public consumer and original clock are not renewed by new research', () => {
  assert.equal(ferryEvidence.observed_on, '2026-10-10');
  assert.equal(ferryEvidence.refresh_days, 9);
  assert.equal(ferryBudget(ferryEvidence, '2026-10-19').scenarios[1].state, 'announced');
  assert.equal(ferryReviewClock('2026-10-19').announced_state, 'announced-not-observed');
  for (const k of ['original_record_renewed', 'original_renderer_or_page_clock_changed', 'public_change', 'real_parent_or_seo_evidence']) assert.equal(r.preservation[k], false, k);
  assert.equal(r.preservation.purchases_contacts_paid_calls, 0);
  for (const s of r.sources) {
    assert.equal(s.inspected_on, r.checked_on);
    const u = new URL(s.url);
    assert.equal(u.protocol, 'https:');
    assert.equal(u.username, '');
    assert.equal(u.password, '');
    assert.ok(['www.ferry.nyc', 'static.ferry.nyc', 'portal.311.nyc.gov'].includes(u.hostname));
  }
});
