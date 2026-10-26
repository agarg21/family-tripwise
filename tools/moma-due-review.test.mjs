import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {momaBudget, momaReviewClock} from './nyc-moma-budget.mjs';

const record = JSON.parse(readFileSync(new URL('../docs/research/nyc-moma-due-review-2026-10-26.json', import.meta.url)));

test('due MoMA audit preserves conditional teen categories, not a checkout quote', () => {
  const p = record.published_categories;
  assert.equal(p.currency, 'USD');
  assert.equal(p.free_child_max_age, 16);
  assert.deepEqual(record.desk_cases.map(row => row.component_cents), [6000, 9000, 7700]);
  assert.deepEqual(record.desk_cases.map(row => row.component_cents), momaBudget().scenarios.map(row => row.total_cents));
  for (const row of record.desk_cases) {
    const c = row.category_counts;
    assert.equal(c.adult + c.student + c.free_child, row.adults + row.child_ages.length);
    assert.equal(c.adult * p.adult_cents + c.student * p.full_time_student_with_ID_cents + c.free_child * p.child_cents, row.component_cents);
    assert.equal(row.result, 'PARTIAL');
    assert.equal(row.student_eligibility_assumed, c.student > 0);
  }
  assert.equal(record.policy.free_child_ticket_required, true);
  assert.equal(record.policy.student_requires_full_time_ID, true);
  assert.equal(record.policy.same_day_return_with_ticket, true);
  assert.equal(record.policy.ticket_must_be_retained, true);
  for (const field of ['actual_student_ID_accepted', 'selected_date_available', 'checkout_total_cents', 'hotel_break_feasible'])
    assert.equal(record.policy[field], null);
  assert.equal(record.policy.tax_fee_inclusion, 'unknown');
  assert.equal(record.policy.independent_teen_entry, 'not-assessed');
});

test('due audit does not silently renew the original MoMA source or public clock', () => {
  for (const row of record.preserved_inputs) {
    const bytes = readFileSync(new URL('../' + row.path, import.meta.url));
    assert.equal(createHash('sha256').update(bytes).digest('hex'), row.sha256, row.path);
  }
  const clock = momaReviewClock(record.observed_on);
  assert.equal(clock.observed_on, '2026-10-10');
  assert.equal(clock.freshness.due_on, '2026-10-24');
  assert.equal(clock.freshness.state, 'review-due');
  assert.equal(record.old_public_clock.renewed, false);
  assert.equal(record.decision, 'PRESERVE');
  assert.equal(record.public_change, false);
  assert.equal(record.shared_tool_change, false);
});

test('source provenance separates inspected policy from booking and parent observations', () => {
  assert.deepEqual(record.sources.map(row => row.url), ['https://www.moma.org/visit/', 'https://www.moma.org/visit/tips']);
  assert.ok(record.sources.every(row => row.checked_on === record.observed_on && row.publication_date === null));
  assert.ok(record.sources.every(row => row.classification === 'official-published-fact'));
  assert.match(record.method, /not publication dates or rendered ticket observations/);
  assert.match(record.confidence, /proxy reasoning/);
  assert.match(record.next_trigger, /Changed applicable official tariff/);
  assert.doesNotMatch(JSON.stringify(record), /u\/|sk-proj-|incident_id|gclid=|gbraid=/);
});
