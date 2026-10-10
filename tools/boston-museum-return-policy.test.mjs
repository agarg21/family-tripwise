import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const record = JSON.parse(readFileSync(new URL('../docs/research/boston-museum-return-policy-2026-10-09.json', import.meta.url)));

test('all-day stay does not establish exit and same-day re-entry', () => {
  assert.equal(record.admission.validity, 'all-day-except-TJX-one-dollar-Sunday-afternoon');
  assert.equal(record.admission.same_day_reentry, 'not-established');
  assert.equal(record.admission.new_ticket_required_after_exit, null);
  assert.equal(record.public_change, false);
  assert.match(record.result, /^PRESERVE/);
});

test('published admission and fee retain separate units and incomplete quote basis', () => {
  const {standard_admission: price, transaction_fee: fee} = record.admission;
  assert.deepEqual([price.amount, price.currency, price.unit], [24, 'USD', 'person age one or older']);
  assert.deepEqual([fee.amount, fee.unit], [4, 'transaction']);
  assert.match(price.currency_basis, /editorial interpretation/);
  assert.match(fee.basis, /do not add it twice/);
  assert.equal(price.observed_on, record.checked_on);
  assert.equal(price.date_availability_verified, false);
  assert.equal(price.stay_date, null);
  assert.equal(record.admission.checkout_total, null);
  assert.equal(record.admission.tax_inclusion, 'unknown');
});

test('policy sources are dated, tracking-free and not future schedule assurance', () => {
  assert.equal(record.checked_on, '2026-10-09');
  assert.deepEqual(record.scenario.child_ages, [4, 8, 12]);
  assert.equal(record.hours.exact_future_date_verified, false);
  assert.match(record.hours.limitations, /not used as a 2026 calendar/);
  assert.equal(record.sources.length, 4);
  for (const source of record.sources) {
    const url = new URL(source);
    assert.ok(['bostonchildrensmuseum.org', 'estore.bostonchildrensmuseum.org'].includes(url.hostname));
    assert.equal(url.protocol, 'https:');
    assert.equal(url.searchParams.has('_gl'), false);
  }
  assert.match(record.next_gate, /Explicit current official exit\/re-entry rule/);
});
