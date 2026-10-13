import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const operator = JSON.parse(read('ops/operator.json'));
const sprint = operator.active_sprint;
const prompt = read('ops/autopilot-prompt.md');
const normal = prompt.split('## Normal Cycle Instructions\n\n')[1].trimEnd();

test('fresh sprint retains exact recurring restoration prompt and cutoff', () => {
  const hash = createHash('sha256').update(normal).digest('hex');
  assert.equal(hash, 'bff531f4cfdf5bbf9260403966bcea6482d7717cd1d7a314f69eb620ad97c77f');
  assert.equal(normal.length, 7643);
  assert.equal(sprint.normal_prompt_sha256, hash);
  assert.equal(sprint.restoration.rrule, operator.temporary_continuous_work.restoration.rrule);
  assert.equal(sprint.sprint_rrule, operator.temporary_continuous_work.sprint_rrule);
  assert.equal(operator.scheduler.ends_at, '2026-11-13T17:00:00-05:00');
  assert.equal(sprint.restoration.automation_id, operator.scheduler.automation_id);
  assert.equal(sprint.restoration.target_thread_id, operator.scheduler.thread_id);
  assert.equal(sprint.restoration.notification_policy, 'absent/default, preserve as absent');
  assert.equal(sprint.restoration.private_saved_fields_baseline, '/tmp/ft-ops014-automation-baseline.toml');
});

test('October12 authorization fixes a separate exact72hour window', () => {
  assert.equal(sprint.action_id, 'FT-OPS-014');
  assert.equal(sprint.authorized_on, '2026-10-12');
  const start = Date.parse(sprint.starts_at);
  const end = Date.parse(sprint.stop_starting_actions_at);
  assert.equal(new Date(start).toISOString(), '2026-10-13T01:47:33.000Z');
  assert.equal(new Date(end).toISOString(), '2026-10-16T01:47:33.000Z');
  assert.equal(end - start, 72 * 60 * 60 * 1000);
  assert.ok(end < Date.parse(operator.scheduler.ends_at));
  for (const time of [start - 1, start, end - 1, end, Date.parse(operator.scheduler.ends_at)]) {
    const inWindow = time >= start && time < end && time < Date.parse(operator.scheduler.ends_at);
    assert.equal(inWindow, time === start || time === end - 1);
  }
  assert.ok(prompt.includes('Before the start, do no project work'));
  assert.ok(prompt.includes('At or after 2026-10-16T01:47:33Z'));
  assert.ok(prompt.includes('Explicit early-stop requests'));
});

test('completed012 history is preserved rather than restarted', () => {
  const previous = operator.sprint_history.find(item => item.action_id === 'FT-OPS-012');
  assert.equal(previous.starts_at, '2026-10-09T14:29:58-04:00');
  assert.equal(previous.stop_starting_actions_at, '2026-10-12T14:29:58-04:00');
  assert.equal(previous.scheduler_application_state, 'recurring-restored-and-saved-fields-verified');
  assert.equal(previous.restored_at, '2026-10-12T22:15:03Z');
  assert.equal(previous.normal_prompt_sha256, sprint.normal_prompt_sha256);
  assert.ok(Date.parse(previous.stop_starting_actions_at) < Date.parse(sprint.starts_at));
  assert.equal(operator.temporary_continuous_work.scheduler_application_state, 'recurring-restored-and-saved-fields-verified');
});

test('capacity and dated city delegation preserve all other review and paid gates', () => {
  assert.equal(sprint.maximum_substantive_actions_per_run, 3);
  assert.equal(sprint.new_action_start_budget_minutes, 45);
  assert.equal(sprint.sequential_only, true);
  assert.equal(operator.maximum_substantive_actions_per_run, 1);
  assert.equal(operator.maximum_substantive_actions_per_day, 2);
  assert.equal(sprint.external_spending_expansion, false);
  assert.equal(sprint.new_destination_authority, true);
  assert.match(sprint.new_destination_authority_scope, /Fresh direct October12/);
  assert.match(sprint.new_destination_authority_scope, /during this dated sprint/);
  assert.match(sprint.new_destination_authority_scope, /no approval for batches over3 or destructive/);
  assert.equal(sprint.review_and_security_gates_unchanged, true);
  assert.equal(sprint.guaranteed_continuous_runtime, false);
});

test('quality, intent, proxy and expansion contracts are explicit', () => {
  for (const contract of ['No new downloadable CSV from assumed demand',
    'Reviews are mandatory at two distinct levels', 'sampled online-review themes/conflicts',
    'Persona review is proxy evidence', 'Fix P0-P2', 'desktop/mobile/keyboard',
    'material demand', 'no clean existing-page fit', 'record each chosen city',
    'batches over three pages', 'Outside this dated scope',
    'Do not repeat broad already-completed cluster reports',
    'never an unchanged denied retry', 'different independent read-only reviewer',
    '45 minutes', 'are already delivered', 'all unrelated fields']) {
    assert.ok(prompt.includes(contract), contract);
  }
});

test('same scheduler fails closed at expiry and owns no public changes', () => {
  for (const contract of ['return without project work', 'If unconfirmed, do no project work',
    'at or after it do no project work', 'normal prompt below', 'never create a replacement']) {
    assert.ok(prompt.includes(contract), contract);
  }
  assert.ok(read(sprint.policy).includes('Original notification policy is absent/default'));
  const action = JSON.parse(read('ops/seo-roadmap.json')).items.find(item => item.id === sprint.action_id);
  assert.equal(action.target_paths.length, 8);
  assert.ok(action.target_paths.includes('tools/operator-sprint.test.mjs'));
  assert.deepEqual(action.target_urls, []);
  assert.ok(action.target_paths.every(path => !path.startsWith('site/') && !path.startsWith('src/')));
});
