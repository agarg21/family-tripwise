# Family Tripwise SEO Roadmap

Last updated: 2026-07-18

Last re-scored: 2026-07-14
Next re-score due: 2026-07-21

## Ownership

The Family Tripwise SEO Operator creates and maintains this roadmap. It converts the user's growth goals, site strategy, fresh GSC evidence, public health, experiment results, implementation backlog, and authority evidence into a rolling 28-day execution queue.

The user owns portfolio goals and material strategic decisions. User input is required for destination expansion, monetization changes, major risk or trust decisions, large page batches, destructive URL/indexability changes, credentials, outreach, and stop/continue decisions. The independent reviewer validates implementation quality; it does not replace the operator's prioritization responsibility or required human review.

The machine-readable source used by the deterministic operator is `ops/seo-roadmap.json`.

## Current GSC evidence

- Latest snapshot: `ops/gsc-snapshots/2026-07-18.json`.
- Classification on July 18: fresh authenticated read-only Search Console API evidence, collected July 18 with finalized performance data through July 16.
- Completeness is `finalized-conservative`; finalization uses the conservative two-day lag rather than incomplete-data metadata.
- The public-safe snapshot contains normalized aggregate, page, sitemap, and priority URL Inspection rows. It omits credentials, complete raw query exports, and country/device rows.
- Protected query export is configured through an encrypted manual workflow, but no decrypted protected export has been collected into central operator state yet, so this snapshot does not satisfy the separate `FT-EVAL-001` query-evidence requirement.

## Maintenance cadence

- Every run: complete routine monitoring housekeeping, then select at most one substantive ready item. Healthy or unchanged housekeeping may coexist with that item; preserve unrelated work and update only the affected monitoring and selected-item evidence.
- Weekly: review fresh evidence, close stale ideas, re-score the next four weeks, and keep at least two useful non-protected items ready when evidence supports them.
- After a deployment: add a URL-scoped observation window and keep unrelated roadmap lanes open.
- At an observation checkpoint: decide keep, iterate, or stop before editing the protected target again.
- Monthly or after a strategic event: ask the user to confirm destination expansion, monetization, risk, and continuation decisions.

## Current sequence

| Order | Item | Lane | State | Why now |
|---:|---|---|---|---|
| 1 | `FT-AUTH-001` source-worthy asset plan | Authority | Completed | Review cycle 2 passed; Family Reset Atlas brief and scored prospect map are review-clean, while publication and outreach remain gated. |
| 2 | `FT-RES-003` source and license audit | Authority/product evidence | Completed | All 13 anchors have official coverage, but real downloadable records remain blocked by unresolved structured-reuse and human-review gates. |
| 3 | `FT-DEV-003` schema and map-shell prototype | Product | Completed | Review-clean synthetic fixtures validate the data contract and accessible interaction without publishing claims or ingesting real records. |
| 4 | `FT-EVAL-001` stay-checklist evaluation | Measurement | July 27 | Requires fresh GSC evidence after the URL-scoped observation window. |
| 5 | `FT-RES-004` San Diego family-hotel research engine evidence pack | Content/product quality | Completed | A three-property internal pack now separates official facts, booking checks, review/community signals, conflicts, unknowns, and publication gates without editing a protected URL or publishing a hotel page. |

Ready does not mean all items should ship immediately. The operator selects one action per run using impact, confidence, learning value, effort, risk, freshness requirements, and active observation windows.

## Completed this cycle

### FT-RES-002 — priority-page index-worthiness review

- Completed: 2026-07-14.
- Evidence: reused authenticated July 13 UI import, current local page inspection, current public/repository health, active observation windows, and historical opportunity research.
- Result: all eight reviewed pages remain index-worthy. No protected URL was edited.
- Promoted action: `FT-IMP-001` / `IMP-015`, limited to the unprotected Las Vegas where-to-stay page and its generator/test/evidence paths.
- Research artifact: `docs/research/srr-002-priority-page-review.md`.
- Independent review: cycle 2 `PASS`; the cycle 1 Chicago-page scope P2 was corrected and no P0-P3 findings remain.
- QA: roadmap JSON validation, 11 GSC snapshot/privacy tests, native and production SEO QA, and tracked/untracked whitespace checks passed; no `site/**` path changed.

### FT-DEV-002 — San Diego itinerary-pacing prototype

- Selected: 2026-07-14 by the deterministic operator as the highest-scoring eligible non-measurement action.
- State: completed and review-clean on 2026-07-14.
- Publication: unpublished under `src/prototypes/san-diego-itinerary-pacing/`, marked `noindex, nofollow`, and absent from `site/` and the sitemap.
- Product result: a deterministic local planner turns age, trip length, reset, weather, transport, pace, stroller, and sensory constraints into day shapes, visible triggered rules, and a verification gate.
- Trust boundary: every output is model-derived and `needs-human-review`; no exact route, timing, access, safety, or suitability conclusion is presented as verified fact.
- QA: syntax checks passed; planner tests passed 5/5 over all 11,520 supported combinations, including both stroller and sensory states; native and production SEO QA returned 0 errors and 0 warnings; desktop and 390px browser flows had no console errors or horizontal overflow.
- Independent review: cycle 2 `PASS`; the combination-coverage P2 was closed and no P0-P3 findings remain.

### FT-IMP-001 — Las Vegas stay verification revision

- Selected: 2026-07-15 by the deterministic operator after healthy monitoring housekeeping did not meet a preemption condition.
- State: completed and review-clean on 2026-07-15.
- Affected URL: `https://familytripwise.com/where-to-stay/las-vegas-with-kids.html` (unprotected).
- Product result: firm best-area, best-fit, smoke/noise, route, pool, and family-suitability verdicts were replaced with neutral hypotheses, explicit `UNKNOWN` states, exact property/room/route/date checks, and human-review questions.
- Release invariant: canonical/indexable/sitemap state remains unchanged; the page visibly includes total-fee, room-assignment, pool-access, smoke/noise-exposure, and route-friction checks and no unreviewed best-area or best-fit verdict as fact.
- QA: focused tests passed 2/2; regeneration is idempotent and changes no unrelated page; native and production SEO QA returned 0 errors and 0 warnings; desktop, 390px, and 320px browser checks found no page overflow or implementation console error.
- Independent review: cycle 1 `PASS`; no P0-P3 findings.

### FT-AUTH-001 — San Diego source-worthy asset plan

- Selected: 2026-07-16 by the deterministic operator after fresh GSC, URL Inspection, public preflight, and repository QA housekeeping remained healthy and non-preempting.
- State: completed and review-clean on 2026-07-16.
- Asset direction: a source-dated San Diego Family Reset Atlas with a filterable map, downloadable dataset, methodology, freshness, confidence, and human-review fields.
- Evidence boundary: official sources establish only their explicit facts; route, stroller, sensory, caregiver-facility, and family-suitability conclusions remain human-gated or `UNKNOWN`.
- Prospect result: eight relevant public domains scored for audience, resource-format fit, non-duplicative value, and local trust. No private contact data was collected and no outreach was sent.
- Promoted follow-ups: `FT-RES-003` for official-source/license coverage and `FT-DEV-003` for an unpublished synthetic-fixture schema/map shell are now completed and review-clean. Both remain outside `site/`.
- Publication boundary: no `site/**`, sitemap, robots, indexability, external account, contributed content, partnership, or live asset changed.
- Independent review: cycle 2 `PASS`; cycle 1's anchor-count P2 was closed by consistently enumerating 13 anchors, requiring all 13 for release readiness, and defining the stop threshold as fewer than 11 of 13 sourced anchors. No P0-P3 findings remain.
- QA: eight prospect scores and the 13-anchor count validated; roadmap JSON, 11 GSC snapshot/privacy tests, four snapshot validations, native and production SEO QA, and tracked/untracked whitespace checks passed.

### FT-RES-003 — San Diego Reset Atlas source and reuse audit

- Selected: 2026-07-16 by the deterministic operator after fresh GSC, URL Inspection, public preflight, and repository QA housekeeping remained healthy and non-preempting.
- State: completed and review-clean on 2026-07-16.
- Coverage result: official first-party or government evidence is available for all 13 enumerated anchors, clearing the 11-of-13 continuation threshold.
- Reuse result: City Open Data may support reusable location geometry for two public-park anchors under its governing terms; structured redistribution of ordinary venue and agency webpage facts remains `UNKNOWN`.
- Trust boundary: route practicality, stroller ease, sensory/quiet suitability, caregiver-facility availability, safety, and material family-fit conclusions remain human-gated. No real record is release-cleared.
- Product decision: `FT-DEV-003` may proceed only as an unpublished synthetic-fixture prototype. Real data ingestion, downloadable publication, and outreach remain blocked.
- Publication boundary: no `site/**`, sitemap, robots, indexability, production URL, external account, or source-owned material changed.
- Independent review: cycle 2 `PASS`; cycle 1's source-fidelity and stale-roadmap-state P2 findings were closed and no P0-P3 findings remain.
- QA: all 26 cited links returned 200; all 13 anchor assertions and the City dataset license/freshness/record claims validated; 11 GSC snapshot/privacy tests, four snapshot validations, native and production SEO QA, roadmap/privacy/allowlist checks, and tracked/untracked whitespace checks passed.

### FT-DEV-003 — unpublished Family Reset Atlas prototype

- Selected: 2026-07-17 after the Control Room scan identified Family Tripwise as the due sensor and its deterministic selector chose the only ready eligible item.
- State: completed and review-clean on 2026-07-17.
- Evidence: reused authenticated read-only API snapshot collected July 16 with finalized performance data through July 14; one day old and within the configured freshness SLA. Monitoring remained healthy and non-preempting.
- Product result: an unpublished schema validator and accessible filter/map-shell prototype uses six synthetic fixtures to expose provenance, freshness, reuse, confidence, human-review, operational-caveat, null-coordinate, and uncertainty fields.
- Trust and data boundary: fixtures have `UNKNOWN` confidence and `needed` human-review status; marker positions are illustrative interface coordinates, not geography. No real source record, coordinate, route, access, sensory, stroller, safety, family-suitability claim, user input, or stored filter state is present.
- Publication boundary: the prototype remains under `src/prototypes/san-diego-family-reset-atlas/`, carries `noindex, nofollow`, and is absent from `site/` and the sitemap. Real-record ingestion, downloads, publication, and outreach remain blocked.
- QA: schema and interaction tests passed 5/5, including freshness, coordinate-state, and firm-claim rejection; syntax checks passed; native and production SEO QA returned 0 errors and 0 warnings; desktop, 390px, and 320px browser checks covered every control and passed without implementation console errors, horizontal overflow, or sticky-panel obstruction.
- Independent review: cycle 2 `PASS`; cycle 1's sticky-control, schema-contract, and firm-claim enforcement P2 findings were closed, with no P0-P3 findings remaining.

### FT-RES-004 — San Diego family-hotel evidence pack

- Selected: 2026-07-18 by the deterministic operator after fresh GSC, URL Inspection, public preflight, and repository QA housekeeping remained healthy and non-preempting.
- State: completed and review-clean on 2026-07-18.
- GSC evidence: fresh authenticated read-only API snapshot collected July 18 with finalized data through July 16; completeness `finalized-conservative` using the two-day-lag basis. Protected query evidence remains unavailable but is not required for this research action.
- Research result: a three-property internal pack covers the candidates already named on the San Diego stay page and separates official facts, attempted booking checks, review signals, community signals, conflicts, unknowns, claim labels, and exact parent checks.
- Decision: do not publish or rank a standalone hotel page yet. Room-level availability/occupancy/total/cancellation evidence, a consistent expanded review sample, pre-release freshness checks, and human review for trust-sensitive conclusions remain gates.
- Publication boundary: no `site/**`, protected URL, sitemap, robots, indexability, affiliate CTA, external account, indexing request, outreach, or deployment changed.
- Independent review: cycle 3 `PASS` with zero P0-P3 findings; cycles 1-2 closed booking/source reproducibility and concurrent-diff isolation P2s.
- QA: 15/15 GSC schema/privacy tests, all six public snapshot validations, roadmap JSON, 19 registered source rows, native/production SEO QA, and exact cached/new-file whitespace checks passed.

## Daily evidence loop

1. Read the newest dated snapshot under `ops/gsc-snapshots/` and state its collection mode and age.
2. Run current public and repository health checks.
3. Complete due routine monitoring as housekeeping. Preempt substantive work only for a verified technical or production defect, a safety or trust blocker, a due substantive experiment decision, or a check explicitly marked to preempt.
4. Select the highest-value eligible roadmap item; do not invent work when the queue or evidence does not support it.
5. Implement, independently review, commit, push, and verify within the standing policy.
6. Record evidence and update the selected roadmap item.

## Hotel Research Policy

Hotel pages no longer require firsthand human review for every research-based claim. They do require the documented hotel research engine in `docs/plan/hotel-research-engine.md`: official property facts, current booking checks, review/community-signal summaries, contradictions, freshness, uncertainty labels, and clear separation between research-based guidance and personally verified experience.

Human review remains required for firsthand stay claims, safety assurances, exact route/stroller practicality verdicts, room-selection advice that materially affects booking, and any firm family-suitability conclusion that the research record cannot support.

## Data boundary

This repository is public. Committed GSC snapshots are normalized decision summaries: aggregate performance, page-level metrics for public URLs, sitemap status, and URL Inspection status. Credentials and complete raw query exports must never be committed. Deeper private query analysis remains in the central operator's protected state.
