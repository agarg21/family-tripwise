import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('finish-first operator preserves learning and release safeguards', () => {
  const operator = JSON.parse(read('ops/operator.json'));
  assert.equal(operator.daily_learning.minimum_units_per_day, 1);
  assert.equal(operator.maximum_substantive_actions_per_run, 1);
  assert.equal(operator.delivery_loop.integrated_learning_counts, true);
  assert.equal(operator.delivery_loop.prefer_qualified_delivery_over_exploration, true);
  assert.equal(operator.delivery_loop.blocked_item_stops_project, false);
  assert.equal(operator.delivery_loop.shipping_quota, false);
  assert.equal(operator.delivery_loop.security_or_qa_bypass_allowed, false);
  assert.equal(operator.delivery_loop.unchanged_blocker_escalation_runs, 2);
  assert.deepEqual(operator.delivery_loop.action_includes,
    ['evidence', 'implementation', 'qa', 'independent-review', 'commit', 'verified-release']);
});

test('stored scheduler prompt includes delivery and safety contracts', () => {
  const operator = JSON.parse(read('ops/operator.json'));
  const prompt = read(operator.delivery_loop.prompt_path);
  for (const required of [
    'One substantive action includes', 'Second daily run: deliver',
    'different independent read-only reviewer', 'focused and full native QA',
    'PASS or PASS_WITH_P3', 'Never bypass security denials',
    'New destinations', 'fresh user approval', 'November 13, 2026 at 17:00 America/New_York',
    'Do not create or modify another recurring automation'
  ]) assert.ok(prompt.includes(required), `Missing contract: ${required}`);
  assert.ok(read('AGENTS.md').includes('finish-first loop'));
  assert.ok(read('strategy/current-strategy.md').includes('finish-first loop'));
  assert.notEqual(operator.daily_learning.afternoon_default, 'apply-deepen-or-validate');
});
