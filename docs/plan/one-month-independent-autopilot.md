# One-Month Independent Autopilot

Authorized: 2026-08-12

Cutoff: 2026-09-12 at 17:00 America/New_York

## Mission

Improve the usefulness, trustworthiness, discoverability, and rankings of existing Family Tripwise pages for real family-trip planning. The independent Master thread runs at 05:00 and 13:00 America/New_York during the pilot, corresponding to the heartbeat's 09:00 and 17:00 UTC slots. It does not use or update the central SEO Control Room.

The schedule creates review opportunities, not a publishing quota. Each run may complete one substantive action or a no-op.

## Run Loop

1. Reconcile the clean repository with origin and preserve unrelated dirty work.
2. Validate the newest public-safe GSC snapshot and classify freshness and finalization.
3. Check for a verified production, technical, indexability, trust, or factual defect.
4. Resume unfinished review-clean work before selecting something new.
5. Otherwise choose one evidence-qualified existing-page, evidence-layer, research, or community-draft action.
6. Register action ID, exact paths, evidence, acceptance criteria, measurement plan, and production invariants before substantive edits.
7. Run focused and full native QA and obtain independent read-only review.
8. Release only a review-clean exact-path diff; verify production when public files change.
9. Reconcile durable state and report the action or no-op, evidence, QA/review, release, blockers, and next evidence gate.

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

End a run as a no-op when no bounded action has concrete expected user value, required evidence is stale/unavailable, a protected measurement window is the only reason to edit, or the next step requires user judgment or external mutation.

After the cutoff, perform no project work until the user explicitly reauthorizes it.
