import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const operator = JSON.parse(read('ops/operator.json'));
const sprint = operator.temporary_continuous_work;
const prompt = read('ops/autopilot-prompt.md');
const normal = prompt.split('## Normal Cycle Instructions\n\n')[1].trimEnd();

test('dated sprint retains exact normal restoration baseline and global cutoff', () => {
  assert.equal(createHash('sha256').update(normal).digest('hex'), 'bff531f4cfdf5bbf9260403966bcea6482d7717cd1d7a314f69eb620ad97c77f');
  assert.equal(sprint.normal_prompt_sha256, createHash('sha256').update(normal).digest('hex'));
  assert.equal(sprint.restoration.rrule, 'RRULE:FREQ=DAILY;BYHOUR=5,13;BYMINUTE=0;BYSECOND=0;UNTIL=20261113T220000Z');
  assert.equal(sprint.sprint_rrule, 'RRULE:FREQ=HOURLY;INTERVAL=1;BYMINUTE=0;BYSECOND=0;UNTIL=20261113T220000Z');
  assert.equal(operator.scheduler.ends_at, '2026-11-13T17:00:00-05:00');
  assert.equal(sprint.restoration.automation_id, operator.scheduler.automation_id);
  assert.equal(sprint.restoration.target_thread_id, operator.scheduler.thread_id);
});

test('October3 window and capacity do not extend default scope', () => {
  assert.equal(sprint.active_day, '2026-10-03');
  assert.equal(sprint.authorized_on, '2026-10-03');
  assert.equal(sprint.action_id, 'FT-OPS-011');
  assert.equal(new Date(sprint.stop_starting_actions_at).toISOString(), '2026-10-04T04:00:00.000Z');
  assert.equal(sprint.maximum_substantive_actions_per_run, 3);
  assert.equal(sprint.new_action_start_budget_minutes, 45);
  assert.equal(operator.maximum_substantive_actions_per_run, 1);
  assert.equal(operator.maximum_substantive_actions_per_day, 2);
  assert.equal(sprint.external_spending_expansion, false);
  assert.equal(sprint.new_destination_authority, false);
  assert.equal(sprint.review_and_security_gates_unchanged, true);
  assert.equal(sprint.guaranteed_continuous_runtime, false);
});

test('stored prompt fails closed at expiry and directs bounded expansion gates', () => {
  for (const contract of ['Before October3Eastern, do no project work', 'On or after October4Eastern', 'return without project work', 'If unconfirmed, do no project work', 'at or after it do no project work', 'Washington DC', 'Do not repeat broad already-completed cluster reports', 'fresh new-destination approval', 'Never retry an unchanged denial', 'different independent read-only reviewer', '45 minutes']) {
    assert.ok(prompt.includes(contract), contract);
  }
  assert.ok(read(sprint.policy).includes('Original notification policy is absent/default'));
  const roadmap = JSON.parse(read('ops/seo-roadmap.json'));
  const action = roadmap.items.find(item => item.id === sprint.action_id);
  assert.equal(action.target_paths.length, 8);
  assert.ok(action.target_paths.includes('tools/operator-sprint.test.mjs'));
  assert.deepEqual(action.target_urls, []);
});
