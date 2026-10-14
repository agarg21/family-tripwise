# Checkpoint Weekly Review Adapter

FT-IMP-154 connects the bounded [checkpoint pilot](evidence-batch-pilot.md) to the existing weekly review semantics. It makes no source requests, changes no public facts and does not replace the scheduled collector or authorize another run.

## Operator Task

Register the exact checkpoint, matching previous audit and new output path under the existing action/review gates. Finish eligible batches only through the pilot's explicit collection mode and actual Eastern due-date gate. Do not recover missing outcomes by relabeling a run, creating another directory or deleting a stale lock. Current source permissions, active sprint/global cutoff and unchanged-denial controls remain operator responsibilities.

```sh
node tools/evidence-checkpoint-review.mjs --checkpoint /absolute/registered/checkpoint --previous ops/evidence-audits/2026-10-07.json --output /absolute/registered/new-review.json
```

The output must be new and outside the immutable checkpoint, with real non-symlink parents; use a canonical absolute path, not an alias such as macOS `/tmp`. The CLI checks current source identities, affected pages, extraction checks and allowed hosts against its saved plan. It rejects a mismatched prior audit, active/stale writer, malformed or private metadata, unexpected entries, symlinks, lost dates and changed manifest. The journal is read, not modified. Snapshot checks assume the operator's sole-writer boundary; they are not a concurrent distributed transaction or proof of filesystem power-loss reliability.

## Partial Versus Complete

Every manifest entry appears exactly once in `source_review_queue`, ordered by existing field priority. Price, room and fee records take priority1, other mapped fields2, unmapped sources3. The queue keeps affected pages, field IDs, original/new attempt time and both checkpoint status and source outcome status. Field review dates remain original; a report's `generated_at` is not a fact observation.

| Checkpoint State | Weekly Meaning | Standard Audit Handoff |
| --- | --- | --- |
| `deferred-no-attempt` | No new evidence; retain any old source outcome/date | Blocks |
| `held-outcome-unknown` | Request started but no valid result; owner reconciliation, no automatic retry | Blocks |
| `held-prior-denial` | Existing401/403/challenge hold; original attempt retained, no request | Allowed as carried denial |
| `attempt-completed` | Known retrieval, hash delta or collection failure, not a verified claim | Allowed as actual outcome |

Partial packets have `standard_audit_ready:false`, `audit:null` and `review:null`. They still expose all source and due-field tasks, so an interruption cannot disappear into an ordinary retryable failure. A complete packet contains compatible `public-source-diff` audit and existing `reviewAudit` output only when no deferred or unknown entries remain. Current canonical and shared-model coverage are checked for both partial and complete packets; retained prior denials missing from a complete current inventory fail the existing reconciliation gate.

`standard_audit_ready:true` means schema-compatible source outcomes, not successful retrieval of every source, reconciled facts, fresh prices or release readiness. Known failures stay collection gaps; hash/structured-price changes remain unreconciled candidates. Audit `elapsed_seconds:null` explicitly leaves whole-batch wall time unmeasured. No schema extension hides unknown outcomes inside `unavailable-review`.

The packet is not itself an approved next-run baseline. After complete collection, inspect its nested audit/review, resolve changed claims and any source-removal hold, run native QA and independent review, then register exact maintained weekly snapshot/operator paths before replacing the existing baseline reference. Do not use the old collector to repeat this same checkpoint's unknown attempts. The existing `site-maintenance.mjs` default and scheduler are deliberately unchanged.

## Proof And Next Gate

Nine new pure/journal tests plus the thirteen pilot tests cover partial field routing, complete compatible change queues, exact identities/date/privacy/model guards, null/missing never-attempted dates, interruption/no replay, writer/corruption rejection, actual507-source offline coverage and CLI no-overwrite/no-journal-output/no-alias guards. Four new `pure:` tests are read-only; journal tests use disposable canonical temporary directories and fake responses. Current inventory is36canonical pages,507sources,154prior holds and353unattempted. No live collection or LLM service was used.

Independent review found the pilot's unconditional prior-audit timestamp fallback incorrectly populated never-attempted prior dates. Planning and aggregation now use the same native actual-attempt-aware fallback: explicit dates remain original; only a retained HTTP status, body hash or denied state supports a legacy audit-time fallback. `not-fetched`/`deferred-limit` without attempted evidence retain null for null or missing dates. This fixes software metadata, not source observation renewal; the current October7 baseline already has explicit attempt dates, so its507-source plan is unchanged.

Next eligible actual weekly run: register exact durable checkpoint/audit/review/maintenance/operator outputs and reconcile permissions before collection; use bounded batches, preserve holds and review the complete source packet. Separately implement one exact hotel room/fee and one attraction-admission claim-delta pilot, then measure two actual weekly cycles before broad city growth. Broader paid-query scope remains pending; Miami exact-family prices remain a separate destination qualification. Neither blocks this adapter. Process fixtures do not establish weekly reliability, claim precision, parent preference or SEO lift.
