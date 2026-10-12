import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";

const read = path => JSON.parse(readFileSync(new URL(`../${path}`, import.meta.url), "utf8"));
const proof = read("docs/plan/release-queue-reconciliation-2026-10-11.json");
const roadmap = read("ops/seo-roadmap.json");
const hash = value => createHash("sha256").update(value).digest("hex");

test("completed release records retain the original receipt and every unowned field", () => {
  assert.equal(proof.records.length, 7);
  assert.equal(new Set(proof.records.map(row => row.id)).size, 7);
  for (const row of proof.records) {
    const item = roadmap.items.find(value => value.id === row.id);
    assert.ok(item, row.id);
    assert.equal(item.status, "completed", row.id);
    assert.equal(item.release_commit, row.release_commit, row.id);
    assert.equal(item.completed_on, row.verified_at, row.id);
    for (const [key, value] of Object.entries(row.expected_changes))
      assert.deepEqual(item[key], value, `${row.id} ${key}`);
    assert.equal(hash(item[row.receipt_field]), row.receipt_sha256, row.id);
    const unchanged = Object.fromEntries(Object.entries(item).filter(([key]) => !Object.hasOwn(row.expected_changes, key)));
    assert.equal(hash(JSON.stringify(unchanged)), row.unchanged_fields_sha256, row.id);
    assert.ok(item[row.receipt_field].includes(row.release_commit), row.id);
    assert.ok(item[row.receipt_field].includes(row.verified_at), row.id);
  }
});

test("public workflow verification stays distinct from research-only remote completion", () => {
  assert.equal(proof.public_workflow_corroboration.length, 4);
  for (const workflow of proof.public_workflow_corroboration) {
    const row = proof.records.find(value => value.id === workflow.id);
    assert.equal(row.evidence_kind, "PUBLIC_PRODUCTION_VERIFIED");
    assert.equal(workflow.head_sha, row.release_commit);
    assert.equal(workflow.status, "completed");
    assert.equal(workflow.conclusion, "success");
    assert.ok(Number.isSafeInteger(workflow.run_id));
  }
  const research = proof.records.filter(row => row.id.startsWith("FT-RES"));
  assert.equal(research.length, 3);
  for (const row of research) {
    assert.equal(row.evidence_kind, "RESEARCH_DATA_REMOTE_VERIFIED_NOT_PUBLIC_DELIVERY");
    assert.equal(roadmap.items.find(value => value.id === row.id).release_state, "completed-remote-verified");
    assert.ok(!proof.public_workflow_corroboration.some(value => value.id === row.id));
  }
});

test("state correction does not claim fact renewal, public delivery or new export demand", () => {
  for (const key of ["daily_learning_claimed", "new_public_delivery", "source_facts_renewed", "new_exports", "scheduler_changed"])
    assert.equal(proof[key], false, key);
  assert.equal(proof.prior_item_count, 321);
  assert.match(proof.remaining_gates, /Completing the historical actions does not resolve London approval/);
  assert.match(proof.remaining_gates, /individual-age acceptance/);
  assert.match(proof.remaining_gates, /denied provider access/);
  assert.match(proof.next_falsification_trigger, /separately registered action/);
  const action = roadmap.items.find(item => item.id === proof.action);
  assert.deepEqual(action.target_urls, []);
  assert.equal(action.target_paths.length, 8);
  assert.ok(action.target_paths.every(path => !path.startsWith("site/") && !path.startsWith("src/")));
});
