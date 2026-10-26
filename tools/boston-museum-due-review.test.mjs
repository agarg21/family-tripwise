import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {bostonMuseumReviewClock} from './boston-museum-admission.mjs';

const record = JSON.parse(readFileSync(new URL('../docs/research/boston-museum-due-review-2026-10-24.json', import.meta.url)));

test('due Boston review keeps displayed components separate from checkout and return promises', () => {
  const p = record.published_component;
  assert.equal(p.per_ticket_cents * p.tickets, p.component_cents);
  assert.equal(p.component_cents, 12000);
  assert.equal(record.transaction_fee.unit, 'transaction');
  assert.equal(record.transaction_fee.add_to_component_automatically, false);
  assert.equal(record.transaction_fee.checkout_total_cents, null);
  assert.equal(p.date_availability_verified, false);
  assert.equal(record.return_policy.exit_reentry, 'not-established');
  for (const field of ['return_prohibited', 'new_ticket_required_after_exit', 'hotel_break_feasible'])
    assert.equal(record.return_policy[field], null);
  assert.ok(record.desk_cases.every(row => row.result === 'PARTIAL'));
  assert.equal(record.decision, 'PRESERVE');
});

test('new inspection cannot silently renew the original public policy or source clocks', () => {
  for (const row of record.preserved_inputs) {
    const bytes = readFileSync(new URL('../' + row.path, import.meta.url));
    // The audit pins October24 bytes; reconstruct only the later reviewed output-copy change.
    const historicalBytes = row.path === 'tools/boston-museum-admission.mjs'
      ? bytes.toString('utf8').replace('return {evidence:structuredClone(evidence), tickets', 'return {evidence, tickets')
      : bytes;
    assert.equal(createHash('sha256').update(historicalBytes).digest('hex'), row.sha256, row.path);
  }
  const clock = bostonMuseumReviewClock(record.observed_on);
  assert.equal(clock.observed_on, '2026-10-09');
  assert.equal(clock.freshness.due_on, '2026-10-23');
  assert.equal(clock.freshness.state, 'review-due');
  assert.equal(record.old_public_clock.renewed, false);
  assert.equal(record.public_change, false);
  assert.equal(record.shared_tool_change, false);
});

test('source audit distinguishes template messages from observed booking state', () => {
  assert.equal(record.sources.length, 4);
  assert.ok(record.sources.every(row => row.checked_on === record.observed_on && row.publication_date === null));
  assert.ok(record.sources.every(row => new URL(row.url).protocol === 'https:'));
  const store = record.sources.find(row => row.classification.endsWith('template-limit'));
  assert.match(store.reader_limit, /not proof/);
  assert.match(store.reader_limit, /rendered conditional visibility are unknown/);
  assert.match(record.confidence, /proxy reasoning/);
  assert.match(record.next_trigger, /Explicit applicable exit\/re-entry/);
  assert.doesNotMatch(JSON.stringify(record), /u\/|sk-proj-|incident_id|gclid=|gbraid=/);
});
