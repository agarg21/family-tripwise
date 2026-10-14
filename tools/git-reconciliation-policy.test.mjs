import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const operator = JSON.parse(read('ops/operator.json'));
const policy = read('docs/plan/git-reconciliation-policy.md');

test('pure: routine normal merges have direct dated standing authority', () => {
  const value = operator.git_reconciliation;
  assert.equal(value.authorized_on, '2026-10-14');
  assert.equal(value.authority, 'Approve and move on, I think you can handle merge issues yourself');
  assert.equal(value.routine_normal_merges_authorized, true);
  assert.equal(value.repeat_user_approval_required, false);
  assert.match(read('AGENTS.md'), /October14,2026 standing direct-user delegation/);
});

test('pure: standing authority cannot remove preservation and release gates', () => {
  const value = operator.git_reconciliation;
  for (const key of ['independent_review_required', 'native_qa_required', 'dirty_work_preservation_required', 'complete_outgoing_range_review_required']) assert.equal(value[key], true);
  for (const key of ['rebase_authorized', 'force_push_authorized', 'reset_or_discard_authorized', 'scheduler_or_sprint_change_authorized']) assert.equal(value[key], false);
  assert.match(value.conflict_resolution, /ambiguous conflicts/);
  assert.match(policy, /Fetch immediately before normal push/);
  assert.match(policy, /Do not run its failing result and ignore it/);
});

test('pure: fixed operating window and restoration baseline are not restarted', () => {
  const sprint = operator.active_sprint;
  assert.equal(sprint.action_id, 'FT-OPS-014');
  assert.equal(sprint.starts_at, '2026-10-12T21:47:33-04:00');
  assert.equal(sprint.stop_starting_actions_at, '2026-10-15T21:47:33-04:00');
  assert.equal(sprint.restoration.private_saved_fields_baseline, '/tmp/ft-ops014-automation-baseline.toml');
  assert.equal(operator.scheduler.ends_at, '2026-11-13T17:00:00-05:00');
  assert.equal(operator.scheduler.central_control_room_enabled, false);
});

test('pure: reconciliation pins existing reviewed histories without public claim renewal', () => {
  for (const sha of ['fb045fb0b0e64db7adc5d3b6e300e3a680ee3f1e', '028ac488cc03c9ded2161e92d4db0d6b06ada68f', 'b1ab23a3b20b541887e9a9cfd53cee1b1678ae18', '2319da5f478ea810a1c64b8d2dbe6a0080097d65']) assert.ok(policy.includes(sha));
  assert.match(policy, /seven nonowned dirty overlays/);
  assert.match(policy, /no Pages wait or production claim/);
  assert.equal(operator.git_reconciliation.policy, 'docs/plan/git-reconciliation-policy.md');
});
