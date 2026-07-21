# Family Tripwise SEO Roadmap

Last updated: 2026-07-20

Last re-scored: 2026-07-14
Next re-score due: 2026-07-21

## Ownership

The Family Tripwise SEO Operator creates and maintains this roadmap. It converts the user's growth goals, site strategy, fresh GSC evidence, public health, experiment results, implementation backlog, and authority evidence into a rolling 28-day execution queue.

The user owns portfolio goals and material strategic decisions. User input is required for destination expansion, monetization changes, major risk or trust decisions, large page batches, destructive URL/indexability changes, credentials, outreach, and stop/continue decisions. The independent reviewer validates implementation quality; it does not replace the operator's prioritization responsibility or required human review.

The machine-readable source used by the deterministic operator is `ops/seo-roadmap.json`.

## Current GSC evidence

- Latest snapshot: `ops/gsc-snapshots/2026-07-20.json`.
- Classification on July 20: fresh authenticated read-only Search Console API evidence, collected July 20 with finalized performance data through July 18.
- Completeness is `finalized-conservative`; finalization uses the conservative two-day lag rather than incomplete-data metadata.
- The public-safe snapshot contains normalized aggregate, page, sitemap, and priority URL Inspection rows. It omits credentials, complete raw query exports, and country/device rows.
- Protected query export is configured through an encrypted manual workflow, but no decrypted protected export has been collected into central operator state yet.

## Maintenance cadence

- Every run: complete routine monitoring housekeeping, then select at most one substantive ready item. Healthy or unchanged housekeeping may coexist with that item; preserve unrelated work and update only the affected monitoring and selected-item evidence.
- Weekly: review fresh evidence, close stale ideas, re-score the next four weeks, and keep at least two useful non-protected items ready when evidence supports them.
- After a deployment: record a crawl and measurement checkpoint. Do not automatically protect a new or low-signal URL from high-confidence usefulness, factual, or technical improvements.
- Use a blocking observation window only when an action explicitly requires an isolated experiment and available evidence can support that evaluation.
- Monthly or after a strategic event: ask the user to confirm destination expansion, monetization, risk, and continuation decisions.

## Current sequence

| Order | Item | Lane | State | Why now |
|---:|---|---|---|---|
| 1 | `FT-AUTH-001` source-worthy asset plan | Authority | Completed | Review cycle 2 passed; Family Reset Atlas brief and scored prospect map are review-clean, while publication and outreach remain gated. |
| 2 | `FT-RES-003` source and license audit | Authority/product evidence | Completed | All 13 anchors have official coverage, but real downloadable records remain blocked by unresolved structured-reuse and human-review gates. |
| 3 | `FT-DEV-003` schema and map-shell prototype | Product | Completed | Review-clean synthetic fixtures validate the data contract and accessible interaction without publishing claims or ingesting real records. |
| 4 | `FT-RES-004` San Diego family-hotel research engine evidence pack | Content/product quality | Completed | The review-clean three-property pack separates official facts, booking checks, signals, conflicts, unknowns, and publication gates without publishing a hotel page. |
| 5 | `FT-PLAN-001` clean San Diego family-hotel page brief | Content/product quality | Completed | The review-clean brief widens the candidate set, defines price-band and review-signal standards, and keeps the public page gated. |
| 6 | `FT-RES-005` expanded San Diego family-hotel evidence pack | Content/product quality | Completed | The review-clean expanded pack covers eight hotels with approximate price bands and family-review signals, while the live page remains gated. |
| 7 | `FT-PUB-001` researched San Diego family-hotel page | Content/product quality | Completed | Manual user approval moved the review-clean hotel evidence into one live, source-dated, non-ranky San Diego page. |
| 8 | `FT-RES-006` San Diego SERP-overlap cluster and persona decision pack | Content/product quality | Completed | Manual user instruction selected one San Diego-deepening research transaction that audits the full cluster before the next implementation. |
| 9 | `FT-IMP-002` San Diego things-to-do persona-led cluster router | Content/product quality | Completed | Existing all-ages activity page now routes first-time, toddler/nap/stroller, teen/tween, lodging-led, and rainy/free/budget planners without touching the protected stay page. |
| 10 | `FT-IMP-003` San Diego specialist-page usefulness pass | Content/product quality | Completed | All six pages received a section inventory; toddler, teen, and itinerary pages were compressed without removing their scan, detail, or application layers. |
| 11 | `FT-IMP-004` improve both San Diego lodging pages | Content/product quality | Completed | User explicitly overrode the low-signal observation hold; both pages now have distinct search jobs and review-clean section-level improvements. |
| 12 | `FT-EVAL-001` stay-checklist evaluation | Measurement | Superseded | The July 13 checklist is no longer an isolated experiment after `FT-IMP-004`; do not claim a causal result on July 27. |
| 13 | `FT-EVAL-002` revised lodging crawl/query checkpoint | Measurement | Ready after evidence | Non-blocking; run only after both revised URLs have current crawl and protected query evidence. |

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
- Decision: do not publish or rank a standalone hotel page yet. The next pass should replace exact booking-total requirements with sourced approximate nightly room bands, visible fee/parking evidence, a consistent expanded review sample, pre-release freshness checks, and human review for trust-sensitive conclusions.
- Publication boundary: no `site/**`, protected URL, sitemap, robots, indexability, affiliate CTA, external account, indexing request, outreach, or deployment changed.
- Independent review: cycle 3 `PASS` with zero P0-P3 findings; cycles 1-2 closed booking/source reproducibility and concurrent-diff isolation P2s.
- QA: 15/15 GSC schema/privacy tests, all six public snapshot validations, roadmap JSON, 19 registered source rows, native/production SEO QA, and exact cached/new-file whitespace checks passed.

### FT-PLAN-001 — Clean San Diego family-hotel page brief

- Selected: 2026-07-18 by direct manual user instruction after FT-RES-004 completed.
- State: completed and review-clean on 2026-07-18.
- Planning result: the brief expands the next San Diego hotel pass from three existing candidates to about eight primary candidates, defines a calm 6-8 card public page shape, keeps category labels non-ordinal, and requires family-review signals without copying review prose.
- User policy update: use sourced approximate nightly room bands instead of requiring exact booking-flow totals for planning; keep taxes, fees, parking, breakfast, cancellation, and final all-in totals as separate booking checks. Crib, rollaway, connecting-room, kitchen, and laundry details are useful when visible but not mandatory for every candidate.
- Publication boundary: no `site/**`, protected URL, sitemap, robots, indexability, affiliate CTA, external account, indexing request, outreach, deployment, or live hotel page changed.
- Independent review: cycle 2 `PASS`; cycle 1 P2 findings for provisional price-band durability, stale exact-booking gate language, and target-path coverage were closed.
- QA: roadmap JSON validation, native SEO QA, and whitespace checks passed.

### FT-RES-005 — Expanded San Diego family-hotel evidence pack

- Selected: 2026-07-18 by direct manual user instruction after FT-PLAN-001 completed.
- State: completed and review-clean on 2026-07-18.
- Research result: the internal evidence pack now covers eight primary candidates: Bahia Resort Hotel, San Diego Mission Bay Resort, Hyatt Regency Mission Bay Spa and Marina, Paradise Point Resort & Spa, Catamaran Resort Hotel and Spa, Homewood Suites San Diego Downtown/Bayside, LEGOLAND Hotel or Castle Hotel, and Loews Coronado Bay Resort.
- User policy application: exact booking-flow totals are not required for this pass. The pack uses sourced approximate room-night bands or `package-dependent`, keeps taxes, resort fees, parking, breakfast, cancellation, and final all-in totals as booking checks, and treats crib, rollaway, connecting-room, kitchen, laundry, microwave, and mini-fridge facts as useful when visible rather than mandatory.
- Trust boundary: review and community signals are paraphrased and conflict-aware. No hotel is ranked, no firm family-suitability, safety, quiet-room, route/stroller, or value claim is made, and the public hotel page remains blocked behind freshness checks and release review.
- Publication boundary: no `site/**`, protected URL, sitemap, robots, indexability, affiliate CTA, external account, indexing request, outreach, deployment, or live hotel page changed.
- Independent review: cycle 2 `PASS`; cycle 1 P2 for community/source reproducibility was closed by downgrading unsourced hotel-specific community notes to question discovery only and aligning review-signal source wording.
- QA: roadmap JSON validation, native SEO QA, production SEO QA, and whitespace checks passed. One transient homepage `503` during the first production QA cleared on focused public checks and retry.

### FT-PUB-001 — Researched San Diego family-hotel page

- Selected: 2026-07-18 by direct manual user instruction after FT-RES-005 completed.
- State: completed and review-clean on 2026-07-18.
- Affected URL: `https://familytripwise.com/where-to-stay/san-diego-family-hotels.html`.
- Publication result: one new San Diego page translates the eight-hotel evidence pack into category picks, a compact comparison table, hotel cards, rough planning bands, fee/parking signals, review-signal conflicts, source links, a CC0 Mission Bay visual, and verify-before-booking checks.
- Trust boundary: the page is research-based and source-dated. It does not claim firsthand stays, rank hotels ordinally, add affiliate or booking CTAs, promise final prices, or establish safety, quiet-room, stroller-route, water-suitability, exact room-selection, cancellation, or family-fit conclusions.
- Release invariant: the URL must be canonical, indexable, in the sitemap exactly once, internally linked from the home page and San Diego stay page, and visibly include eight researched candidates plus final all-in total and human-review caveats.
- Independent review: cycle 2 `PASS_WITH_P3`; cycle 1 P2 for unsupported Loews quietness wording was closed. Remaining P3: same-site Loews official pages conflict on self-parking amount (`$47` versus `$50`), while page copy keeps fees verify-before-booking.
- QA: focused page tests and Las Vegas regression tests passed 5/5; roadmap JSON validation passed; native static SEO QA passed with 23 sitemap URLs and 26 HTML files; whitespace checks passed; local HTTP page returned 200; local sitemap includes the new URL; Wikimedia image resolved 200. Production SEO QA is expected to return 404 for the new URL before deployment and must be rerun after deployment.

### FT-RES-006 — San Diego SERP-overlap cluster and persona decision pack

- Selected: 2026-07-20 by direct manual user instruction.
- State: completed and review-clean on 2026-07-20.
- Research artifact: `docs/research/san-diego-cluster-research-decision-pack.md`.
- Evidence: latest public-safe GSC snapshot from July 19 with finalized data through July 17; prior July 18 snapshot; latest central Control Room report; current San Diego site pages and prototypes; current public SERP snapshots; representative ranking-page inspection; qualitative Reddit/forum and r/Agentic_SEO process discussions.
- Research result: the San Diego query universe is clustered by observed SERP URL/domain overlap, not keyword-volume lists alone. The pack defines five research-hypothesis personas, audits every canonical/indexable San Diego page plus legacy shims and relevant unpublished prototypes, separates authority advantages Family Tripwise cannot honestly copy from usefulness opportunities it can pursue, and recommends one bounded next implementation.
- Promoted action: `FT-IMP-002`, an existing-page upgrade to make `https://familytripwise.com/things-to-do/san-diego-with-kids.html` a persona-led cluster router for first-time, toddler/nap/stroller, teen/tween, lodging-led, and rainy/free/budget planners.
- Publication boundary: no `site/**`, sitemap, robots, canonical, indexability, indexing request, external account, outreach, automation, or deployment changed.
- Independent review: `PASS` from read-only reviewer `019f7f5a-007c-7f01-afea-990f6def6484`; no P0-P3 findings.
- QA: roadmap JSON validation, native static SEO QA, production SEO QA, GSC snapshot tests/validation, focused research-artifact consistency, focused roadmap consistency, privacy/credential scan, and whitespace checks passed.

### FT-IMP-002 — San Diego things-to-do persona-led cluster router

- State: completed 2026-07-20.
- Source handoff: `FT-RES-006` and `docs/research/san-diego-cluster-research-decision-pack.md`.
- Affected URL: `https://familytripwise.com/things-to-do/san-diego-with-kids.html`.
- Result: upgraded the existing all-ages San Diego activities page into a cluster router rather than another long generic list.
- Implemented routes: first-time family, toddler/nap/stroller family, teen/tween family, lodging-led planner, and rainy/free/budget planner.
- Preserved boundary: canonical/indexability/sitemap state stayed stable; the protected San Diego stay page was not edited; no new page, destination, indexing request, event scraper, outreach, booking/affiliate CTA, or external account mutation was introduced; safety, route, stroller, quiet, water-suitability, and firm family-fit claims remain gated.
- QA and review: `node tools/generate-pages.mjs`, focused tests 10/10, `node tools/seo-qa.mjs`, `jq empty ops/seo-roadmap.json`, and `git diff --check` passed. Independent reviewer `019f7ff6-3cca-7052-9e6d-869eac450da3` returned `PASS` on review cycle 2 after the freshness-date P2 was fixed.

### FT-IMP-003 — San Diego specialist-page usefulness pass

- Selected: 2026-07-20 by direct manual user instruction after the user clarified that cross-page overlap is acceptable but every page section should provide useful detail.
- State: completed and review-clean on 2026-07-20.
- Audit result: every top-level section or repeated section family across the six canonical San Diego pages now has a keep, compress, merge, move/link, remove, or verify verdict in `docs/research/san-diego-section-level-editorial-audit.md`.
- Product result: the toddler, teen, and itinerary pages retain a concise selector, structured comparison/detail, and route/application layer while duplicate starter blocks, repetitive micro-fields, defective route structure, and unrelated hotel-source residue are removed.
- Trust result: categorical age, duration, stroller, rain, nap, booking, and value fields are labeled as Family Tripwise editorial estimates rather than venue guarantees; the County beach/bay source is included for current water-condition checks.
- Scope boundary: the protected stay page and newly observing hotel/all-ages pages were audited but not edited. Canonical, indexability, sitemap, robots, new-page, external-account, outreach, and indexing-request state did not change.
- QA: generator/idempotency passed; 16 focused tests passed; native and production SEO QA returned 0 errors and 0 warnings; desktop/mobile browser checks passed; JSON, scope, privacy, and whitespace checks passed.
- Independent review: cycle 2 `PASS` with no P0-P3 findings after closing all three cycle-1 P2 findings and both P3 observations.

### FT-IMP-004 — Improve both San Diego lodging decision pages

- Selected: 2026-07-20 by direct manual user instruction after the user chose immediate page usefulness over preserving the low-signal stay-page observation window.
- State: completed and review-clean.
- Affected URLs: `https://familytripwise.com/where-to-stay/san-diego-with-kids.html` and `https://familytripwise.com/where-to-stay/san-diego-family-hotels.html`.
- Area-page result: removes the duplicate base area table and parallel three-hotel profiles; retains five area choices, a seven-field comparison, interactive constraint checklist, four exact-hotel checks, and direct routing to the eight-hotel guide.
- Hotel-page result: retains all eight detailed property records, approximate nightly prices, map, room facts, directional themes from sampled reviews, and sources; compresses eight repetitive category cards to five trip styles and merges repeated methodology/caveats.
- Measurement consequence: `FT-EVAL-001` is superseded. `FT-EVAL-002` is a non-blocking crawl/query-interpretation checkpoint, not a short-window ranking verdict.
- Boundary: no URL, destination, sitemap, robots, canonical, indexability, indexing request, outreach, booking CTA, affiliate change, or external-account mutation.
- QA and review: 39/39 repository tests, 14/14 focused lodging/regression tests, native and production-preflight SEO QA, desktop/mobile browser checks, JSON, privacy, scope, and whitespace checks passed. Independent reviewer `019f8284-1234-7c81-aa49-b4d50c95942a` returned `PASS` on cycle 2 with no P0-P3 findings.

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

## San Diego Hotel Page Hypothesis

The target experience should borrow Reddit's useful constraint-and-tradeoff feel, but present it as a clean decision page: category-led picks, compact hotel cards, a quiet comparison table, activity-distance bands, current price/fee checks where available, and expandable evidence notes. The page should avoid clutter, generic ranked-list prose, and unsupported `best` claims.

The first standalone hotel page should not stop at the three hotels already named on the current stay page. `FT-RES-005` now evaluates eight primary candidates; a future live page should publish only the 6-8 strongest evidence-backed cards. Use sourced approximate nightly room bands rather than exact booking totals unless a stable booking screen is already available. Crib, rollaway, connecting-room, and kitchen details should be captured when visible, but missing optional details become `verify before booking` notes rather than automatic blockers. Recent family-relevant review signals are a core input and must remain paraphrased, bounded, and conflict-aware.

## Expansion Policy

Go deeper in San Diego before expanding the five pilot cities. The operator should finish the San Diego research/page pattern first: hotel evidence engine, clean hotel page brief, stay-page measurement, and any necessary quality upgrades. Once the San Diego pattern is strong enough to reuse, expand it across the pilot cities as a repeatable system.

## Data boundary

This repository is public. Committed GSC snapshots are normalized decision summaries: aggregate performance, page-level metrics for public URLs, sitemap status, and URL Inspection status. Credentials and complete raw query exports must never be committed. Deeper private query analysis remains in the central operator's protected state.
