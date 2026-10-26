import test from 'node:test';
import assert from 'node:assert/strict';
import {bostonMuseumAdmission, bostonMuseumEvidence, bostonMuseumReviewClock} from './boston-museum-admission.mjs';

test('editing returned Boston child ages does not corrupt the source or next request', () => {
  const source = structuredClone(bostonMuseumEvidence);
  const result = bostonMuseumAdmission();
  try {
    result.evidence.scenario.child_ages[0] = 17;
    assert.deepEqual(bostonMuseumEvidence, source);
    assert.equal(result.amount, 120);
    assert.equal(bostonMuseumAdmission().amount, 120);
  } finally {
    Object.assign(bostonMuseumEvidence, source);
  }
});

test('returned Boston nested policy and sources are independent of supplied evidence', () => {
  const supplied = structuredClone(bostonMuseumEvidence);
  const before = structuredClone(supplied);
  const result = bostonMuseumAdmission(supplied);
  result.evidence.admission.standard_admission.amount = 25;
  result.evidence.admission.transaction_fee.amount = 99;
  result.evidence.admission.same_day_reentry = 'permitted';
  result.evidence.sources.push('https://example.com/working-copy');
  assert.deepEqual(supplied, before);
  assert.deepEqual(bostonMuseumAdmission(supplied), bostonMuseumAdmission(before));
});

test('Boston working copies preserve repeated historical and due-clock results', () => {
  for (const date of ['2026-10-08', '2026-10-09', '2026-10-22', '2026-10-23', '2026-10-26']) {
    const supplied = structuredClone(bostonMuseumEvidence);
    const expected = bostonMuseumAdmission(supplied, date);
    const working = bostonMuseumAdmission(supplied, date);
    const clock = bostonMuseumReviewClock(date, supplied);
    working.evidence.scenario.child_ages.push(17);
    assert.deepEqual(bostonMuseumAdmission(supplied, date), expected);
    assert.deepEqual(bostonMuseumReviewClock(date, supplied), clock);
    assert.equal(expected.evidence.checked_on, '2026-10-09');
  }
});
