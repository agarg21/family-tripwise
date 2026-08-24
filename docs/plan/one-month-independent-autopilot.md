# One-Month Independent Autopilot

Authorized: 2026-08-12

Cutoff: 2026-09-12 at 17:00 America/New_York

## Mission

Improve the usefulness, trustworthiness, discoverability, and rankings of existing Family Tripwise pages for real family-trip planning. The independent Master thread runs at 05:00 and 13:00 America/New_York during the pilot, corresponding to the heartbeat's 09:00 and 17:00 UTC slots. It does not use or update the central SEO Control Room.

The schedule creates one daily learning obligation, not a publishing quota. Each run may complete at most one substantive action; across the two Eastern-time runs, at least one bounded learning unit must be completed each day.

## Daily Progress Contract

A learning unit is one source-dated, durable result from exactly one lane:

- inspect three to five current parent/community questions and extract the shared family decision, constraints, and unanswered work;
- run one explicit family-planning task against one existing page on desktop/mobile and record answerability, friction, repetition, unsupported certainty, and missing comparison;
- inspect one current query family, its live SERP/result types, and representative ranking pages for information gain Family Tripwise can honestly provide;
- audit one maintained evidence set for stale facts, conflicts, unknowns, or weak provenance;
- draft one concise, non-promotional community answer when current Family Tripwise research genuinely helps.

The unit must record the family decision, hypothesis, evidence class and date, result, confidence, reusable lesson, and next falsification trigger in `backlog/product-learning-ledger.md`. A supported `PRESERVE` decision or rejected hypothesis counts. An unchanged monitoring scan, repeated metric summary, or status-only narrative does not.

Default the 05:00 Eastern run to learning. Default the 13:00 run to applying, deepening, or independently validating the day's result. The second run may no-op when the daily unit is complete and no additional evidence-qualified action exists. Neither run may force a page edit.

## Run Loop

1. Reconcile the clean repository with origin and preserve unrelated dirty work.
2. Validate the newest public-safe GSC snapshot and classify freshness and finalization.
3. Check whether today's learning unit is already complete in the learning ledger and current-cycle state.
4. Check for a verified production, technical, indexability, trust, or factual defect.
5. Resume unfinished review-clean work before selecting something new.
6. Otherwise select one daily learning lane or one evidence-qualified existing-page, evidence-layer, research, or community-draft action.
7. Register action ID, exact paths, evidence, acceptance criteria, measurement plan, and production invariants before substantive edits.
8. Run focused and full native QA and obtain independent read-only review.
9. Release only a review-clean exact-path diff; verify production when public files change.
10. Reconcile durable state and report the learning unit or action, evidence, QA/review, release, blockers, and next evidence gate.

## Selection Standard

An existing page may change only for a named user-facing deficiency supported by current evidence, such as:

- aligned query intent or page-role confusion;
- a live SERP or ranking page revealing missing decision support;
- stale, conflicting, or weak official/review evidence;
- repeated parent questions that the current page handles poorly;
- excessive repetition, scan friction, accessibility, or broken interaction;
- weak internal discovery or contextual routing;
- a concrete citation/usefulness gap in a maintained dataset or tool.

Low clicks, broad impressions, a competitor's length, or the arrival of another heartbeat are not deficiencies.

## New-Page Gate

Do not create a canonical/indexable URL unless all conditions hold:

1. Current representative SERPs show a distinct user job and materially overlapping ranking-page type.
2. Demand is meaningful relative to the current cluster and is not a sum of overlapping variants.
3. No current URL can satisfy the job without confusing its primary role.
4. Family Tripwise can maintain a source-classified evidence layer that creates information gain.
5. The roadmap explicitly makes the URL eligible, and any new-destination or batch approval is satisfied.

When any condition is uncertain, improve, research, consolidate, or observe instead.

## Community Lane

Public forums and Reddit can reveal parent language, edge cases, unresolved questions, and practical decision criteria. They are qualitative evidence, not demand metrics or verified experience.

The autopilot may add a small number of drafts to the validated `backlog/community-answer-drafts.json` queue. `backlog/community-answer-drafts.md` defines its human policy, and `node tools/community-answer-review.mjs` opens the local review board. A useful draft:

- answers the exact question in the first sentence;
- is concise enough for the venue;
- distinguishes sourced facts, interpretation, and unknowns;
- never claims a stay, visit, local identity, parent identity, or firsthand experience;
- avoids promotional phrasing and affiliate intent;
- includes a Family Tripwise link only when the linked page uniquely reduces work for the asker;
- records the thread URL, date, community rule check, sources, and why the answer helps.

Autopilot must not post, vote, message, create accounts, evade moderation, or pose as a human traveler. User review remains required before any external action.

The review board may record `pending`, `approved`, `revise`, or `rejected`. `approved` means the user accepts the wording for possible later use; it is not posting authority. A later external post still requires a fresh explicit instruction.

## Stop Rules

End a run as a monitoring-only no-op only when the current Eastern day's learning unit is already complete, the pilot cutoff has passed, or a specific recorded technical/external blocker prevents evidence collection. Stale GSC, a protected measurement window, or a user-gated external action does not block the other learning lanes. Do not manufacture a page edit when research supports `PRESERVE`.

After the cutoff, perform no project work until the user explicitly reauthorizes it.
