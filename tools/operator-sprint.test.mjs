import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const operator = JSON.parse(read('ops/operator.json'));
const sprint = operator.active_sprint;
const prompt = read('ops/autopilot-prompt.md');
const normal = prompt.split('## Normal Cycle Instructions\n\n')[1].trimEnd();

test('72-hour sprint keeps exact recurring restoration prompt and cutoff', () => {
  const hash = createHash('sha256').update(normal).digest('hex');
  assert.equal(hash, 'bff531f4cfdf5bbf9260403966bcea6482d7717cd1d7a314f69eb620ad97c77f');
  assert.equal(sprint.normal_prompt_sha256, hash);
  assert.equal(sprint.restoration.rrule, operator.temporary_continuous_work.restoration.rrule);
  assert.equal(sprint.sprint_rrule, operator.temporary_continuous_work.sprint_rrule);
  assert.equal(operator.scheduler.ends_at, '2026-11-13T17:00:00-05:00');
  assert.equal(sprint.restoration.automation_id, operator.scheduler.automation_id);
  assert.equal(sprint.restoration.target_thread_id, operator.scheduler.thread_id);
  assert.equal(sprint.restoration.notification_policy, 'absent/default, preserve as absent');
});

test('explicit cross-midnight window has no early start or expiry extension', () => {
  assert.equal(sprint.action_id, 'FT-OPS-012');
  assert.equal(sprint.authorized_on, '2026-10-09');
  const start = Date.parse(sprint.starts_at);
  const end = Date.parse(sprint.stop_starting_actions_at);
  assert.equal(new Date(start).toISOString(), '2026-10-09T18:29:58.000Z');
  assert.equal(new Date(end).toISOString(), '2026-10-12T18:29:58.000Z');
  assert.equal(end - start, 72 * 60 * 60 * 1000);
  assert.ok(end < Date.parse(operator.scheduler.ends_at));
  for (const time of [start - 1, start, end - 1, end, Date.parse(operator.scheduler.ends_at)]) {
    const inWindow = time >= start && time < end && time < Date.parse(operator.scheduler.ends_at);
    assert.equal(inWindow, time === start || time === end - 1);
  }
  assert.ok(prompt.includes('Before the start, do no project work'));
  assert.ok(prompt.includes('At or after 2026-10-12T18:29:58Z'));
  assert.ok(prompt.includes('Explicit early-stop requests'));
});

test('sprint capacity does not change recurring, paid, security or city authority', () => {
  assert.equal(sprint.maximum_substantive_actions_per_run, 3);
  assert.equal(sprint.new_action_start_budget_minutes, 45);
  assert.equal(sprint.sequential_only, true);
  assert.equal(operator.maximum_substantive_actions_per_run, 1);
  assert.equal(operator.maximum_substantive_actions_per_day, 2);
  assert.equal(sprint.external_spending_expansion, false);
  assert.equal(sprint.new_destination_authority, false);
  assert.equal(sprint.review_and_security_gates_unchanged, true);
  assert.equal(sprint.guaranteed_continuous_runtime, false);
  assert.equal(operator.temporary_continuous_work.scheduler_application_state, 'recurring-restored-and-saved-fields-verified');
});

test('saved override fails closed and prioritizes real delivery over reports', () => {
  for (const contract of ['return without project work', 'If unconfirmed, do no project work',
    'at or after it do no project work', 'Washington DC', 'Do not repeat broad already-completed cluster reports',
    'fresh new-destination approval', 'never an unchanged denied retry', 'different independent read-only reviewer',
    '45 minutes', 'FT-IMP-075', 'FT-IMP-050', 'normal prompt below', 'all unrelated fields']) {
    assert.ok(prompt.includes(contract), contract);
  }
  assert.ok(read(sprint.policy).includes('Original notification policy is absent/default'));
  const action = JSON.parse(read('ops/seo-roadmap.json')).items.find(item => item.id === sprint.action_id);
  assert.equal(action.target_paths.length, 8);
  assert.ok(action.target_paths.includes('tools/operator-sprint.test.mjs'));
  assert.deepEqual(action.target_urls, []);
});
