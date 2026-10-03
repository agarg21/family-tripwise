# Read-Only Git Release Guard

FT-IMP-055 addresses the October2 FT-RES-083 sequencing mistake: fetch reported incoming history, but the operator continued committing. The resulting one-local/one-remote divergence remains held; this tool does not reconcile it or authorize a merge.

## Procedure

After independent PASS, native QA and exact-path review, fetch origin and inspect incoming changes. Stop on divergence. If behind without divergence, inspect incoming commits and dirty-path overlap before any permitted fast-forward; then repeat relevant QA and refresh pins. Never continue staging/committing merely because fetch itself exited successfully.

Create a temporary manifest outside the repository from the frozen reviewed files, not from changed working content after review. Full Git object IDs pin HEAD and fetched origin/main; SHA256 values pin reviewed file bytes. Include only exact registered paths. Null means a reviewed deletion, not an unreadable file. This tool validates Git/content scope only: the manifest does not prove independent review, action registration, human evidence, authorization or QA. Reconcile those separately. It supports regular files and simple relative ASCII POSIX paths, not symlinks, submodules, redirects, shallow history or merge commits.

Before staging, run from the repository root:

```bash
node tools/release-git-guard.mjs --phase before-stage --manifest /tmp/action-review.json
```

Manifest format:

```json
{
  "schema_version": 1,
  "expected_head": "FULL_HEAD_OBJECT_ID",
  "expected_origin": "FULL_FETCHED_ORIGIN_MAIN_OBJECT_ID",
  "reviewed_files": {
    "tools/example.mjs": "SHA256_OF_FROZEN_REVIEWED_BYTES"
  }
}
```

Only a successful guard result permits exact-path staging. Immediately before commit, run the same manifest with `--phase before-commit`. It requires main equal to fetched origin/main, exact staged scope and matching staged blob hashes. Unrelated unstaged/untracked work is allowed and never altered. Stage changes must be inspected; do not commit if the check exits nonzero. Do not run a later mutation unconditionally in the same orchestration after an unsuccessful result: explicitly inspect `exit_code === 0` before proceeding.

After committing, fetch immediately before push, inspect the complete outgoing range, and build a second temporary manifest with the new HEAD and fetched origin pins:

```json
{
  "schema_version": 1,
  "expected_head": "FULL_NEW_HEAD_OBJECT_ID",
  "expected_origin": "FULL_FETCHED_ORIGIN_MAIN_OBJECT_ID",
  "reviewed_commits": [
    {
      "sha": "FULL_REVIEWED_OUTGOING_COMMIT_OBJECT_ID",
      "reviewed_files": {
        "tools/example.mjs": "SHA256_OF_FROZEN_REVIEWED_BYTES"
      }
    }
  ]
}
```

Run with `--phase before-push`. Every outgoing commit must appear oldest-first with its exact changed paths and resulting reviewed hashes. Deleted paths use null. No omitted commits, extra paths, changed bytes, staged work, behind/diverged branch or stale pin passes. Commit messages, mode-only changes between supported regular-file modes, author metadata and review truth still require complete manual range inspection. If a ref advances, do not simply repin it to obtain a PASS: inspect/reconcile and re-run affected gates first.

## Limits And Current Hold

All Git calls are read-only; there is no fetch, add, commit, push, reset, rebase or merge. Active merge/cherry-pick/revert/rebase/sequencer markers are rejected even when conflicts are resolved. Legacy `info/grafts` and redirected graft state are rejected before any graph check; disabling replacement objects alone does not disable grafts. Local origin/main is not live remote evidence. A successful check is point-in-time, not an atomic lock: another writer can advance after it. A normal push rejection must remain held under repository policy. The guard never retries or rewrites history and cannot prevent an operator from ignoring its exit status.

Current083local commit `028cfc1a46c7477203c15ae84b2ee9a9f82bc0f8` versus incoming GSC-only `6fec783d577f3f02c7b3eddcecac3658ea4b3be4` must be rejected at every phase. Explicit history-reconciliation approval remains the release prerequisite. FT-IMP-055 itself stays local, independently reviewed but uncommitted, while that dependency remains. No public page, nightly-price evidence, observation window or scheduler changes.

Focused tests: `node --test tools/release-git-guard.test.mjs`. Temporary repository writes belong only to test fixtures; the production guard performs no mutation or network access.
