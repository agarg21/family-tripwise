import test from 'node:test';
import assert from 'node:assert/strict';
import {momaBudget, momaComparison, momaReviewClock, momaEvidence} from './nyc-moma-budget.mjs';

test('editing returned teen ages cannot alter supplied evidence or the next family budget', () => {
  const evidence = structuredClone(momaEvidence), before = structuredClone(evidence);
  const result = momaBudget(evidence);
  result.scenarios[0].child_ages[1] = 17;
  assert.deepEqual(evidence, before);
  assert.deepEqual(result.evidence.scenarios[0].child_ages, [13, 16]);
  assert.deepEqual(momaBudget(evidence).scenarios.map(row => row.total_cents), [6000, 9000, 7700]);
  assert.deepEqual(momaEvidence, before);
});

test('returned policy, prices, sources and unknowns are independent working data', () => {
  const evidence = structuredClone(momaEvidence), before = structuredClone(evidence);
  const result = momaBudget(evidence);
  result.evidence.prices.adult_cents = 0;
  result.evidence.policy.free_child_max_age = 17;
  result.evidence.source_urls[0] = 'https://example.com/display-only';
  result.evidence.unknowns.length = 0;
  result.evidence.scenarios[0].child_ages.push(18);
  assert.deepEqual(evidence, before);
  assert.deepEqual(result.scenarios[0].child_ages, [13, 16]);
  assert.deepEqual(momaBudget(evidence).evidence, before);
  assert.deepEqual(momaComparison(evidence).rows.map(row => row[2]), ['USD 60.00', 'USD 90.00', 'USD 77.00']);
});

test('comparison and review-clock source lists do not alias the supplied record', () => {
  const evidence = structuredClone(momaEvidence), before = structuredClone(evidence);
  const comparison = momaComparison(evidence), clock = momaReviewClock('2026-10-25', evidence);
  comparison.sources.push('https://example.com/display-only');
  clock.source_urls[0] = 'https://example.com/clock-display';
  assert.deepEqual(evidence, before);
  assert.deepEqual(momaComparison(evidence).sources, before.source_urls);
  assert.deepEqual(momaReviewClock('2026-10-25', evidence).source_urls, before.source_urls);
});

test('copies preserve repeat-call values, historical non-use and original review dates', () => {
  for (const date of ['2026-10-09', '2026-10-10', '2026-10-23', '2026-10-24', '2026-10-25']) {
    const evidence = structuredClone(momaEvidence), before = structuredClone(evidence);
    const expected = momaBudget(evidence, date), result = momaBudget(evidence, date);
    assert.equal(JSON.stringify(result), JSON.stringify(expected));
    assert.notEqual(result.evidence, expected.evidence);
    result.evidence.unknowns.push('consumer-only note');
    assert.deepEqual(evidence, before);
    assert.equal(JSON.stringify(momaBudget(evidence, date)), JSON.stringify(expected));
    assert.equal(momaReviewClock(date, evidence).observed_on, '2026-10-10');
    if (date === '2026-10-09') assert.deepEqual(result.scenarios, []);
    else assert.equal(result.freshness.due_on, '2026-10-24');
  }
});
