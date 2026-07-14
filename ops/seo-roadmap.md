# Family Tripwise SEO Roadmap

Last updated: 2026-07-14

Last re-scored: 2026-07-14
Next re-score due: 2026-07-21

## Ownership

The Family Tripwise SEO Operator creates and maintains this roadmap. It converts the user's growth goals, site strategy, fresh GSC evidence, public health, experiment results, implementation backlog, and authority evidence into a rolling 28-day execution queue.

The user owns portfolio goals and material strategic decisions. User input is required for destination expansion, monetization changes, major risk or trust decisions, large page batches, destructive URL/indexability changes, credentials, outreach, and stop/continue decisions. The independent reviewer validates implementation quality; it does not replace the operator's prioritization responsibility or required human review.

The machine-readable source used by the deterministic operator is `ops/seo-roadmap.json`.

## Maintenance cadence

- Every run: select at most one ready item, preserve unrelated work, and update only that item's status and evidence.
- Weekly: review fresh evidence, close stale ideas, re-score the next four weeks, and keep at least two useful non-protected items ready when evidence supports them.
- After a deployment: add a URL-scoped observation window and keep unrelated roadmap lanes open.
- At an observation checkpoint: decide keep, iterate, or stop before editing the protected target again.
- Monthly or after a strategic event: ask the user to confirm destination expansion, monetization, risk, and continuation decisions.

## Current sequence

| Order | Item | Lane | State | Why now |
|---:|---|---|---|---|
| 1 | `FT-RES-002` priority-page review | Content/product quality | Ready | The old research backlog is ready but was never promoted into the deterministic queue. This should identify exactly one next live improvement without touching a protected URL. |
| 2 | `FT-DEV-002` itinerary pacing prototype | Product | Ready | It advances the differentiated-tool thesis outside the live site while observation continues. |
| 3 | `FT-AUTH-001` source-worthy asset plan | Authority | Ready | Authority is effectively zero; asset and prospect research can proceed without outreach. |
| 4 | `FT-EVAL-001` stay-checklist evaluation | Measurement | July 27 | Requires fresh GSC evidence after the URL-scoped observation window. |

Ready does not mean all items should ship immediately. The operator selects one action per run using impact, confidence, learning value, effort, risk, freshness requirements, and active observation windows.

## Daily evidence loop

1. Read the newest dated snapshot under `ops/gsc-snapshots/` and state its collection mode and age.
2. Run current public and repository health checks.
3. Complete a due indexing check before choosing unrelated measurement work.
4. Select the highest-value eligible roadmap item; do not invent work when the queue or evidence does not support it.
5. Implement, independently review, commit, push, and verify within the standing policy.
6. Record evidence and update the selected roadmap item.

## Data boundary

This repository is public. Committed GSC snapshots are normalized decision summaries: aggregate performance, page-level metrics for public URLs, sitemap status, and URL Inspection status. Credentials and complete raw query exports must never be committed. Deeper private query analysis remains in the central operator's protected state.
