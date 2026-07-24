import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { checkOperatorState } from "./operator-state-qa.mjs";

const releaseCommit = "1234567890abcdef1234567890abcdef12345678";

function fixture({
  stale = false,
  badMetadata = false,
  adjacentPending = false,
  reorderedReleases = false
} = {}) {
  const root = mkdtempSync(join(tmpdir(), "family-tripwise-operator-state-"));
  mkdirSync(join(root, "ops/gsc-snapshots"), { recursive: true });
  mkdirSync(join(root, "status"), { recursive: true });
  mkdirSync(join(root, "backlog"), { recursive: true });

  writeFileSync(join(root, "ops/gsc-snapshots/2026-07-24.json"), "{}");
  writeFileSync(join(root, "ops/gsc-snapshots/2026-07-24.md"), "# Snapshot\n");
  writeFileSync(
    join(root, "ops/seo-roadmap.json"),
    JSON.stringify({
      last_updated: "2026-07-24",
      last_rescored_on: "2026-07-22",
      next_rescore_due: "2026-07-29",
      items: [
        {
          id: "FT-IMP-001",
          status: "completed",
          release_state: "released-and-production-verified",
          release_commit: releaseCommit,
          pages_run: 123,
          released_at: "2026-07-24T12:00:00Z",
          target_paths: ["status/city.md", "backlog/implementation.md"]
        },
        ...(reorderedReleases
          ? [
              {
                id: "FT-IMP-000",
                status: "completed",
                release_state: "released-and-production-verified",
                release_commit: "abcdef1234567890abcdef1234567890abcdef12",
                pages_run: 122,
                released_at: "2026-07-23T12:00:00Z",
                target_paths: []
              }
            ]
          : [])
      ]
    })
  );
  writeFileSync(
    join(root, "ops/seo-roadmap.md"),
    [
      "# Roadmap",
      "Last updated: 2026-07-24",
      `Last re-scored: ${badMetadata ? "2026-07-20" : "2026-07-22"}`,
      "Next re-score due: 2026-07-29",
      "Latest snapshot: `ops/gsc-snapshots/2026-07-24.json`.",
      `| FT-IMP-001 | ${stale ? "release pending" : "released"} |`,
      adjacentPending ? "| FT-IMP-002 | release pending |" : ""
    ].join("\n")
  );
  writeFileSync(
    join(root, "ops/current-cycle.md"),
    [
      "# Cycle",
      "Evidence: `ops/gsc-snapshots/2026-07-24.md`",
      `Latest release: FT-IMP-001 at ${releaseCommit}; Pages run 123.`,
      stale ? "FT-IMP-001 awaiting release" : "FT-IMP-001 completed"
    ].join("\n")
  );
  writeFileSync(join(root, "status/city.md"), `FT-IMP-001 ${stale ? "awaiting commit" : "released"}`);
  writeFileSync(
    join(root, "backlog/implementation.md"),
    `FT-IMP-001 ${stale ? "review-clean-release-pending" : "done"}`
  );
  return root;
}

test("accepts aligned release and snapshot state", () => {
  assert.deepEqual(checkOperatorState(fixture()), []);
});

test("detects stale pending-release narratives", () => {
  const errors = checkOperatorState(fixture({ stale: true }));
  assert.ok(errors.some((error) => error.includes("pending-release language")));
});

test("detects roadmap metadata drift", () => {
  const errors = checkOperatorState(fixture({ badMetadata: true }));
  assert.ok(errors.some((error) => error.includes("Last re-scored mismatch")));
});

test("does not attribute an adjacent action's pending state to the latest release", () => {
  assert.deepEqual(checkOperatorState(fixture({ adjacentPending: true })), []);
});

test("selects the newest recorded release by timestamp rather than array order", () => {
  assert.deepEqual(checkOperatorState(fixture({ reorderedReleases: true })), []);
});
