import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const root = new URL('../', import.meta.url);
const read = path => readFileSync(new URL(path, root));
const record = JSON.parse(read('docs/research/cancun-family-oasis-bedding-2026-10-10.json'));

test('bedding audit retains the exact historical family and room task', () => {
  assert.equal(record.action_id, 'FT-RES-146');
  assert.deepEqual(record.task.child_ages, [2, 7]);
  assert.equal(record.task.adults, 2);
  assert.equal(record.task.category, 'Family Oasis, Deluxe Room - Oceanfront');
  assert.equal(record.task.rooms, 1);
  assert.equal(record.task.check_in, '2026-11-08');
  assert.equal(record.task.check_out, '2026-11-13');
  assert.equal(record.task.nights, 5);
});

test('four-person count screen uses the published minimum and maximum', () => {
  const [minimum, maximum] = record.category_facts.published_occupancy_range;
  assert.deepEqual([minimum, maximum], [3, 5]);
  const count = record.task.adults + record.task.child_ages.length;
  assert.equal(record.screen.all_person_count, count);
  assert.equal(record.screen.within_published_count_range, count >= minimum && count <= maximum);
});

test('on-demand equipment never fills sleeping or acceptance unknowns', () => {
  assert.equal(record.category_facts.baby_bed_basis, 'on-demand');
  for (const field of ['adult_bed_types', 'child_bed_types', 'bed_counts', 'child_sleeping_assignments', 'baby_bed_confirmed']) {
    assert.equal(record.category_facts[field], null, field);
  }
  for (const field of ['age_acceptance_established', 'bedding_established', 'stay_availability_established', 'booking_acceptance_established']) {
    assert.equal(record.screen[field], false, field);
  }
  assert.equal(record.result.decision, 'PRESERVE');
  assert.equal(record.result.hypothesis_supported, false);
  assert.equal(record.result.public_change_qualified, false);
});

test('ambiguous publication label does not become the inspection or effective date', () => {
  assert.equal(record.source.publication_label, '10/02/2026');
  assert.equal(record.source.publication_date_iso, null);
  assert.equal(record.source.inspected_on, '2026-10-10');
  assert.equal(record.source.pdf_page_one_based, 6);
  assert.deepEqual(record.source.printed_page_numbers, [10, 11]);
  assert.equal(record.source.evidence_class, 'OFFICIAL_PROPERTY_FACT');
});

test('audit preserves the historical quote bytes and dates', () => {
  const digest = createHash('sha256').update(read(record.prior_evidence.quote)).digest('hex');
  assert.equal(digest, record.prior_evidence.quote_sha256);
  assert.equal(record.prior_evidence.renewed, false);
});
