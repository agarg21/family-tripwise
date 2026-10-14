import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read = name => JSON.parse(readFileSync(new URL(`../docs/research/${name}-2026-10-13.json`, import.meta.url)));
const gate = read('miami-family-five-gate');
const demand = read('miami-family-five-demand');

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
