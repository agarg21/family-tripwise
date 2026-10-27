import test from 'node:test';
import assert from 'node:assert/strict';
import {ferryBudget, ferryComparison, ferryEvidence, ferryReviewClock} from './nyc-ferry-budget.mjs';

test('returned Ferry rider edits cannot corrupt the maintained source or next request', () => {
  const original = structuredClone(ferryEvidence);
  const result = ferryBudget();
  try {
    result.evidence.party.standard_fare_riders = 3;
    assert.deepEqual(ferryEvidence, original);
    assert.equal(result.scenarios[0].one_way_party_cents, 1800);
    assert.equal(ferryBudget().scenarios[0].one_way_party_cents, 1800);
  } finally {
    Object.assign(ferryEvidence, structuredClone(original));
  }
});

test('returned Ferry fares, policy and provenance do not alias supplied evidence', () => {
  const supplied = structuredClone(ferryEvidence);
  const expected = structuredClone(supplied);
  const result = ferryBudget(supplied);
  result.evidence.fares[0].single_cents = 600;
  result.evidence.policy.round_trip_free_transfer = true;
  result.evidence.source_urls.push('https://example.com/working');
  result.evidence.source_publication_dates[0] = '2026-10-27';
  assert.deepEqual(supplied, expected);
  assert.deepEqual(ferryBudget(supplied), ferryBudget(expected));
});

test('Ferry comparison and review-clock source lists are independent working copies', () => {
  const supplied = structuredClone(ferryEvidence);
  const expected = structuredClone(supplied);
  const comparison = ferryComparison(supplied);
  const clock = ferryReviewClock('2026-10-27', supplied);
  comparison.sources.push('https://example.com/comparison');
  clock.source_urls[0] = 'https://example.com/clock';
  assert.deepEqual(supplied, expected);
  assert.deepEqual(ferryComparison(supplied), ferryComparison(expected));
  assert.deepEqual(ferryReviewClock('2026-10-27', supplied), ferryReviewClock('2026-10-27', expected));
});

test('Ferry output edits preserve repeated historical and announced-fare states', () => {
  for (const date of ['2026-10-09', '2026-10-10', '2026-10-18', '2026-10-19', '2026-10-27']) {
    const supplied = structuredClone(ferryEvidence);
    const expected = ferryBudget(supplied, date);
    const clock = ferryReviewClock(date, supplied);
    const working = ferryBudget(supplied, date);
    working.evidence.fares[1].state = 'observed';
    assert.deepEqual(ferryBudget(supplied, date), expected);
    assert.deepEqual(ferryReviewClock(date, supplied), clock);
    assert.equal(clock.announced_state, 'announced-not-observed');
    if (date < '2026-10-10') assert.deepEqual(expected.scenarios, []);
    else assert.equal(expected.scenarios[1].state, 'announced');
  }
});
