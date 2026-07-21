# Implementation Backlog

Last updated: 2026-07-21

## Active

No implementation task is active.

## Selected

No implementation task is selected outside the active review.

## Completed

### IMP-019: Expand San Diego Activity and Hotel Decision Sets

Status: done

Completed: 2026-07-21

Roadmap ID: `FT-IMP-005`

Result:

- Expanded the activity comparison to 12 primary choices while keeping six situation picks and limiting extra logistics cards to the six additions.
- Expanded the hotel comparison to 12 researched properties with four new trip-style gaps, rough nightly ranges, official room/amenity facts, current operational caveats, direct map links, and bounded online-review themes.
- Added a durable candidate-selection and evidence review at `docs/research/san-diego-activity-hotel-expansion-review.md`.
- Kept the stay-area page change to the two dependent 8-to-12 hotel-count references.

Review and QA:

- Independent reviewer Tesla (`019f86e6-7253-78c1-a1b0-5024da393b27`) returned `PASS` on cycle 3 with no P0-P3 findings.
- `node tools/seo-qa.mjs` passed with 0 errors and 0 warnings; all 40 repository tests, JavaScript checks, roadmap JSON, privacy, exact-scope, browser-layout, source-link, and whitespace checks passed.

### IMP-018: Improve Both San Diego Lodging Decision Pages

Status: done

Completed: 2026-07-20

Roadmap ID: `FT-IMP-004`

Result:

- Made the area page the focused answer to where-to-stay/area intent and the hotel page the focused answer to family-hotel-list intent.
- Kept five detailed area choices, the interactive checklist, all eight hotel records, approximate prices, sampled review themes, sources, and the shared map while removing repeated scan and methodology layers.
- Superseded the no-longer-isolated `FT-EVAL-001`; later `FT-EVAL-002` is a non-blocking crawl/query checkpoint after evidence exists.

Review and QA:

- Independent reviewer `019f8284-1234-7c81-aa49-b4d50c95942a` returned `PASS` on cycle 2 with no P0-P3 findings.
- 39/39 repository tests, 14/14 focused tests, SEO QA, desktop/mobile browser checks, JSON, privacy, scope, and whitespace checks passed.

### IMP-017: San Diego Specialist-Page Usefulness Pass

Status: done

Completed: 2026-07-20

Roadmap ID: `FT-IMP-003`

Result:

- Audited every top-level section across all six canonical San Diego pages.
- Removed duplicate starter blocks and repetitive micro-fields from the toddler, teen, and itinerary pages while retaining scan, detail, and application layers.
- Fixed the two-day itinerary, restored the promised teen one-day route, labeled categorical fields as editorial estimates, and removed unrelated hotel-source residue.
- Preserved the stay-page observation window and left the newly observing hotel and all-ages activity pages unchanged.

Review and QA:

- Independent reviewer `019f825a-b52d-79a2-9388-16a8348f6419` returned `PASS` on cycle 2 with no P0-P3 findings.
- Generator/idempotency, 16 focused tests, native/production SEO QA, desktop/mobile browser checks, JSON, scope, privacy, and whitespace checks passed.

### IMP-016: Upgrade San Diego Things-To-Do Into Persona-Led Cluster Router

Status: done

Completed: 2026-07-20

Roadmap ID: `FT-IMP-002`

Source handoff:

- `FT-RES-006: Create the San Diego cluster SERP-overlap and persona decision pack`
- `docs/research/san-diego-cluster-research-decision-pack.md`

Goal:

Improve the existing all-ages San Diego activities page so it becomes the cluster router for first-time, toddler/nap/stroller, teen/tween, lodging-led, and rainy/free/budget planners.

Affected production URL:

- `https://familytripwise.com/things-to-do/san-diego-with-kids.html`

Expected bounded implementation paths:

- `tools/generate-pages.mjs`
- `tools/upgrade-priority-pages.mjs`
- `site/things-to-do/san-diego-with-kids.html`
- `tools/san-diego-cluster-router-page.test.mjs`
- declared operator evidence and roadmap files

Acceptance checks:

- Preserve the existing canonical URL, indexability, and sitemap membership.
- Make the page's all-ages role explicit: broad activity hub plus San Diego cluster router, not a duplicate toddler, teen, hotel, or itinerary page.
- Route at least five research-derived personas: first-time family, toddler/nap/stroller family, teen/tween family, lodging-led planner, and rainy/free/budget planner.
- Link clearly to the existing toddler, teen, stay, hotel, and itinerary pages without editing the protected San Diego stay page before the July 27 observation gate.
- Add a compact rainy/free planning surface with official/current-source links where relevant; do not publish stale event or Kids Free claims as current.
- Do not publish unsupported safety, route, stroller, quiet, water-suitability, or firm family-fit claims.
- Do not copy review/forum prose or treat community anecdotes as verified experience.
- Do not create a new page, add a new destination, request indexing, scrape events, or mutate external accounts.
- Focused/native QA and independent review must pass before commit.

Result:

- Added a top-of-page San Diego cluster router for first-time, toddler/nap/stroller, teen/tween, lodging-led, and rainy/free/budget planners.
- Added a compact rainy/free/budget verification surface with official San Diego Tourism Authority, San Diego Museum Council, Birch Aquarium, Balboa Park, and County beach/bay status links.
- Reframed the stroller quick pick as a lower-friction candidate with route verification rather than a firm stroller-friendly claim.
- Updated the San Diego all-ages activity page freshness date to July 20, 2026.
- Preserved canonical, indexability, sitemap membership, and the protected San Diego stay page.

Review and QA:

- Independent reviewer `019f7ff6-3cca-7052-9e6d-869eac450da3` returned `PASS` on review cycle 2 after the stale-date P2 was fixed.
- `node tools/generate-pages.mjs` passed.
- `node --test tools/san-diego-cluster-router-page.test.mjs tools/san-diego-family-hotels-page.test.mjs tools/las-vegas-stay-page.test.mjs` passed 10/10.
- `node tools/seo-qa.mjs` passed with 0 errors and 0 warnings after sequential rerun.
- `jq empty ops/seo-roadmap.json` and `git diff --check` passed.

### IMP-015: Reframe Las Vegas Stay Decision Support

Status: done

Completed: 2026-07-15

Roadmap ID: `FT-IMP-001`

Source handoff:

- `SRR-002: Review Priority Pages For Index-Worthiness`
- `docs/research/srr-002-priority-page-review.md`

Goal:

Turn the existing Las Vegas where-to-stay page into a constraint-led verification guide without publishing unreviewed area, hotel, smoke/noise, route, pool, or family-suitability conclusions as fact.

Affected production URL:

- `https://familytripwise.com/where-to-stay/las-vegas-with-kids.html`

Bounded implementation paths:

- `tools/upgrade-priority-pages.mjs`
- `site/where-to-stay/las-vegas-with-kids.html`
- `tools/las-vegas-stay-page.test.mjs`
- declared operator evidence and roadmap files

Acceptance checks:

- Replace firm `best area` and `best fit` verdicts with neutral candidates, exact verification questions, or explicit unknowns.
- Treat smoke/noise exposure, pool access, room assignment, fees, and route friction as property-, room-, route-, date-, or policy-specific checks.
- Do not rank hotels or imply personally verified family suitability.
- Preserve the canonical, indexability, sitemap membership, and existing URL.
- Add focused tests for blocked firm phrases, trust framing, canonical/indexability stability, and generator idempotence.
- Change no protected URL or unrelated generated page.
- Focused and native QA pass; independent review returns `PASS` or `PASS_WITH_P3` before commit.
- Production passes the predeclared action-specific invariant after deployment.

Implementation result, 2026-07-15:

- Replaced firm area and property-fit verdicts with research hypotheses, exact verification questions, explicit `UNKNOWN` states, and human-review questions.
- Added visible total-fee, room-assignment, pool-access, smoke/noise-exposure, route-friction, and current-policy checks.
- Preserved the existing canonical URL, indexability, and sitemap membership; no other generated page changed.
- Focused tests passed 2/2, native and production SEO QA returned 0 errors and 0 warnings, and desktop plus 390px/320px browser checks found no page overflow or implementation console error.
- Independent review cycle 1 returned `PASS` with no P0-P3 findings; exact-path commit and release are authorized after final staged QA.

## Candidate Tasks

These need SEO Research & Review confirmation before implementation:

### IMP-006: Improve Existing Priority Page Internal Links

Status: candidate

Potential scope:

- strengthen links among things-to-do, where-to-stay, itinerary, age-specific, and methodology pages
- avoid adding new city clusters

### IMP-007: Build First Narrow Tool-Like Component

Status: candidate

Potential scope:

- age filter for activities
- area recommender prototype
- rainy-day toggle
- itinerary pacing helper

### IMP-008: Create San Diego Family Hotels Page After Human Review Path

Status: candidate

Potential scope:

- create `best family hotels in San Diego` only after hotel claims have a human-review/source workflow
- keep the current San Diego where-to-stay page as the area decision page
- separate measured property facts from editorial recommendations

## Deferred

### IMP-012: Build Greater NYC Weekend Family Planner Pilot

Status: deferred

Recommendation label: `test`

Deferred: 2026-07-09 at user request.

Source handoff:

- `SRR-006: Validate NYC Local / Weekend Events Concept`
- `docs/research/srr-006-nyc-local-weekend-events.md`

Goal:

Build a manual, source-backed pilot framework for a greater NYC weekend family planner serving families around New York City, Jersey City, Hoboken, and nearby reachable areas.

Recommended URL:

- `/things-to-do/nyc-this-weekend-with-kids.html`

Important boundaries:

- Do not build an automatic scraper.
- Do not automatically publish event data.
- Do not scrape Instagram private/login-only content.
- Treat Instagram/local social accounts as discovery signals only unless event details are public and source-linked.
- Do not add the page to `site/sitemap.xml` unless it contains enough current, reviewed content to deserve indexing.
- If the page shell is created before reviewed pilot content exists, keep it `noindex, follow` and outside the sitemap.

Primary implementation options:

- Create a static page with a manually reviewed event/activity table.
- Add a small structured data file or embedded data block for manually curated events.
- Add filters or grouped sections for Jersey City/Hoboken, Manhattan/NYC, Brooklyn waterfront, nearby NJ, free/low-cost, rainy-day, age band, and reservation-needed.

Required event fields:

- event/activity name
- date/time
- area
- venue
- age fit
- price band
- indoor/outdoor
- rainy-day suitability
- reservation/ticket need
- transit/logistics note from Jersey City/Hoboken
- stroller note, labeled estimated or human-reviewed
- public source URL
- last-checked date
- review status

Acceptance checks:

- Every published event row has a public source URL and last-checked date.
- Past events are excluded or clearly not published.
- Stroller, transit, safety, and suitability notes are labeled estimated or human-reviewed.
- The page does not imply Family Tripwise personally attended or verified an event unless a human reviewer supplied that note.
- The page includes freshness and human-review guardrails.
- Local QA returns 0 errors.
- If the page is indexable and added to the sitemap, production QA should return 0 errors after deployment.

## Done

### IMP-014: Clean Safety-Loaded Planning Language

Status: done

Completed: 2026-07-11

Implementation notes:

- Reframed safety-loaded planning shorthand in generated source and regenerated HTML.
- Changed "safest" or "safer" uses that meant reliability or lower friction to "most reliable," "lowest-friction," or "more contained."
- Changed the Las Vegas itinerary phrase "hotel as the main safety valve" to "hotel as the main pressure-release valve."
- Preserved true caveats and methodology language around safety advisories, human-review boundaries, and official-source verification.
- Did not add new city clusters, standalone hotel pages, or the deferred NYC weekend planner page.

Validation result:

- `node --check tools/upgrade-priority-pages.mjs`: passed.
- `node --check tools/generate-pages.mjs`: passed.
- `node tools/generate-pages.mjs`: regenerated pages.
- `rg -n "safest|safe|safety" site tools`: remaining matches are safety-advisory, methodology, or verification-caveat contexts.
- `node tools/seo-qa.mjs`: 0 errors, 0 warnings.
- `git diff --check`: clean.
- Sitemap remains 22 canonical URLs.

### IMP-001: Add Static Site SEO QA Script

Status: done

Completed: 2026-07-07

Implementation notes:

- Added `tools/seo-qa.mjs`.
- Added README usage for `node tools/seo-qa.mjs` and `node tools/seo-qa.mjs --production`.
- Checks sitemap URLs against local HTML files, optional production 200 responses, internal relative links, JSON-LD parse validity, sitemap-listed thin-page word count, and legacy San Diego shim pages outside the sitemap.

Validation result:

- `node tools/seo-qa.mjs`: 0 errors, 15 warnings after IMP-002.
- `node tools/seo-qa.mjs --production`: 0 errors, 15 warnings after IMP-002.
- Current internal link problems: 0.
- Current JSON-LD parse problems: 0.

Remaining QA warnings:

- Thin-page/content-depth review: `site/about.html`, `site/index.html`, four remaining itinerary pages, four teen pages, and Chicago/San Antonio where-to-stay pages.
- Legacy shim review: three root-level San Diego shim pages outside the sitemap.

### IMP-002: Upgrade San Diego Itinerary Page Before Expansion

Status: done

Completed: 2026-07-07

Implementation notes:

- Upgraded `site/family-itinerary/san-diego-with-kids.html` through `tools/upgrade-priority-pages.mjs` so the page survives regeneration.
- Added quick route decisions, a comparison table for 1-day, 2-day, 3-day, toddler-paced, teen-paced, and rainy-day variants, pacing cards, San Diego cluster links, and `ItemList` / `FAQPage` JSON-LD.
- Preserved uncertainty by labeling route details as planning guidance and telling users to verify drive times, parking, stroller routes, attraction hours, weather, and child energy needs.

Acceptance checks:

- Page includes a comparison/decision table.
- Page retains official source/update notes.
- Page remains linked from San Diego activity and stay pages.
- JSON-LD parses through `tools/seo-qa.mjs`.

### IMP-003: Upgrade Chicago And San Antonio Where-To-Stay Pages

Status: done

Completed: 2026-07-07

Implementation notes:

- Upgraded `site/where-to-stay/chicago-with-kids.html` and `site/where-to-stay/san-antonio-with-kids.html` through `tools/upgrade-priority-pages.mjs`.
- Added quick-pick area decisions, area comparison matrices, parking/transit/stroller/noise caveats, nearby attraction fit, family verdicts, and `ItemList` / `FAQPage` JSON-LD.
- Used "what to verify before booking" sections instead of firm hotel recommendations because a human-reviewed hotel workflow is not yet available.
- Added area-guidance caveats near the comparison matrices and hotel-claim caveats near the verification sections.

Validation result:

- `node tools/seo-qa.mjs`: 0 errors, 13 warnings.
- `node tools/seo-qa.mjs --production`: 0 errors, 13 warnings.
- Chicago and San Antonio where-to-stay pages are no longer flagged as thin-page warnings.

Acceptance checks:

- Each page includes a comparison table.
- Each page separates area guidance from hotel recommendation claims.
- Human-review caveats appear near area guidance and hotel-verification sections.
- JSON-LD parses through `tools/seo-qa.mjs`.

### IMP-004: Decide Thin Teen Page Treatment

Status: done

Completed: 2026-07-07

Implementation notes:

- Upgraded `site/things-to-do/chicago-with-teens.html`, `site/things-to-do/las-vegas-with-teens.html`, `site/things-to-do/san-diego-with-teens.html`, and `site/things-to-do/san-antonio-with-teens.html` through `tools/upgrade-priority-pages.mjs`.
- Added teen quick picks, comparison tables, detailed teen-specific activity notes, itinerary variants, internal cluster links, and `ItemList` / `FAQPage` JSON-LD.
- Kept San Antonio teens indexed after upgrading it to standalone teen intent; the page now includes an explicit index decision.
- Preserved uncertainty with planning-guidance caveats and reminders to verify hours, ticketing, age/height rules, weather, transit, sibling stroller needs, and safety advisories.

Validation result:

- `node tools/seo-qa.mjs`: 0 errors, 9 warnings.
- `node tools/seo-qa.mjs --production`: 0 errors, 9 warnings.
- Teen pages are no longer flagged as thin-page warnings.

Acceptance checks:

- No sitemap-listed teen page remains a 350-450 word card-only page.
- San Antonio teen page has an explicit keep-indexed decision.
- JSON-LD parses through `tools/seo-qa.mjs`.

### IMP-005: Handle Legacy San Diego Canonical Shim Pages

Status: done

Completed: 2026-07-08

Implementation notes:

- Updated `tools/generate-pages.mjs` so the three legacy San Diego shim pages include `<meta name="robots" content="noindex, follow">`.
- Kept canonical links pointing to the active San Diego URLs.
- Kept the shim files out of `site/sitemap.xml`.
- Updated `tools/seo-qa.mjs` so legacy San Diego shims are no longer warned once `noindex` is present.

Validation result:

- `node tools/seo-qa.mjs`: 0 errors, 6 warnings.
- `node tools/seo-qa.mjs --production`: 0 errors, 6 warnings.
- Legacy San Diego shim warnings are resolved.

Acceptance checks:

- Legacy pages are marked `noindex, follow` and canonicalize to active San Diego URLs.
- Sitemap still lists only canonical active pages.

### IMP-009: Improve NYC Tourist Things-To-Do Page From Early GSC Signal

Status: done

Completed: 2026-07-08

Implementation notes:

- Upgraded `site/things-to-do/new-york-city-with-kids.html` through `tools/upgrade-priority-pages.mjs`.
- Added a near-top "First-time visitors" decision section.
- Added a tourist-trip scan matrix by age band, weather, budget, and stroller/transit friction.
- Added a tourist-vs-local-parent note that keeps the page focused on evergreen trip planning and defers local/weekend concepts.
- Strengthened internal links to the NYC where-to-stay and family-itinerary pages.
- Preserved caveats around stroller, transit, safety, and route planning as guidance requiring verification.

Validation result:

- `node tools/seo-qa.mjs`: 0 errors, 6 warnings.
- `node tools/seo-qa.mjs --production`: 0 errors, 6 warnings.
- JSON-LD parses through `tools/seo-qa.mjs`.

Acceptance checks:

- Page remains focused on evergreen tourist trip planning.
- Page includes visible decision support for first-time visitors.
- Page has stronger internal links to NYC stay and itinerary pages.
- Material stroller/transit/safety guidance is framed as planning guidance requiring verification.

### IMP-010: Upgrade Remaining Family Itinerary Pages

Status: done

Completed: 2026-07-08

Source handoff:

- `SRR-004: Post-Implementation QA For Thin-Page Cleanup`

Implementation notes:

- Upgraded `site/family-itinerary/chicago-with-kids.html`, `site/family-itinerary/las-vegas-with-kids.html`, `site/family-itinerary/new-york-city-with-kids.html`, and `site/family-itinerary/san-antonio-with-kids.html` through `tools/upgrade-priority-pages.mjs`.
- Added destination-specific quick route decisions, 1-day/2-day/3-day/toddler/teen/rainy-day comparison tables, pacing rules, meal/reset notes, stroller/transit or drive-time friction, and skip guidance.
- Strengthened cluster links from each itinerary page to the relevant things-to-do and where-to-stay pages, plus teen pages where they exist.
- Preserved uncertainty with planning-guidance caveats requiring verification of hours, tickets, weather, route conditions, safety advisories, transit/stroller access, parking, drive or transfer times, and child energy.
- Added valid `ItemList` and `FAQPage` JSON-LD for the upgraded itinerary pages.

Validation result:

- `node tools/seo-qa.mjs`: 0 errors, 2 warnings.
- The four upgraded itinerary pages are no longer flagged as thin-page warnings.
- `node tools/seo-qa.mjs --production`: 0 errors, 2 warnings; production URL checks passed, while content deployment may still depend on the next commit/deploy.

Acceptance checks:

- No thin-page warnings remain for the four upgraded itinerary pages.
- Internal links and JSON-LD continue to pass QA.
- Hotel, safety, transit, stroller, and route guidance remains framed as planning guidance requiring verification rather than personally verified experience.

### IMP-013: Improve GSC-Signaled Priority Pages And Trust Pages

Status: done

Completed: 2026-07-11

Source handoff:

- `docs/research/gsc-ui-review-2026-07-11.md`

Implementation notes:

- Improved `site/where-to-stay/san-diego-with-kids.html` through `tools/upgrade-priority-pages.mjs` for family hotel/stay intent without creating a standalone hotel page.
- Added San Diego hotel decision support and official-source booking checks covering room setup, pool, breakfast/food, kitchen/laundry, crib/rollaway, parking/resort fees, noise, location, and property-source verification.
- Improved `site/things-to-do/new-york-city-with-kids.html`, `site/where-to-stay/new-york-city-with-kids.html`, `site/where-to-stay/chicago-with-kids.html`, and `site/things-to-do/las-vegas-with-kids.html` with stronger cluster links and query-aligned decision support where appropriate.
- Improved `site/index.html` through `tools/generate-pages.mjs` as a practical navigation hub for the current five destination clusters.
- Improved `site/about.html` through `tools/generate-pages.mjs` with editorial methodology, source policy, human-review boundaries, model-derived-vs-reviewed framing, and hotel/route claim caveats.
- Kept `IMP-012` deferred; no NYC weekend page, standalone hotel page, or new destination cluster was created.

Validation result:

- `node tools/seo-qa.mjs`: 0 errors, 0 warnings.
- `node tools/seo-qa.mjs --production`: 0 errors, 0 warnings.
- Home/About thin-page warnings are resolved.

Acceptance checks:

- Internal links and JSON-LD continue to pass QA.
- No new city pages, standalone hotel pages, or NYC weekend pages were added.
- Changed pages keep hotel, safety, transit, stroller, area, and family-suitability claims framed as planning guidance requiring verification unless human-reviewed.
