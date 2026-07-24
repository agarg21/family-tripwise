# Implementation Backlog

Last updated: 2026-07-23

## Active

### IMP-029: Review And Improve The Chicago Family Itinerary

Status: review-clean; release pending

Selected: 2026-07-23

Roadmap ID: `FT-IMP-013`

Audit the existing itinerary against current family-itinerary SERPs, all five Chicago persona hypotheses, current route-anchor sources, and every visible section. Replace repeated summaries with concrete one-, two-, and three-day plans, useful pivots, and firm stop rules.

Affected production URL:

- `https://familytripwise.com/family-itinerary/chicago-with-kids.html`

Exact maximum transaction scope:

- `docs/research/chicago-family-itinerary-page-review.md`
- `tools/upgrade-priority-pages.mjs`
- `tools/chicago-itinerary-page.test.mjs`
- `site/family-itinerary/chicago-with-kids.html`
- `site/styles.css`
- `status/chicago-pages.md`
- `backlog/seo-research-review-backlog.md`
- `backlog/implementation-backlog.md`
- `ops/seo-roadmap.json`
- `ops/seo-roadmap.md`
- `ops/current-cycle.md`
- `ops/operator-review.md`

Boundaries:

- Preserve the existing URL, canonical, indexability, and sitemap membership.
- Keep activity selection, teen choices, area selection, and named hotel comparison on their released specialist pages.
- Do not claim exact route time, transit ease, stroller practicality, safety, weather, ticket availability, or universal family fit.
- Do not edit another live page, request indexing, mutate an external account, add an affiliate CTA, send outreach, or add recurring automation.
- The shared stylesheet is included only for a reviewer-required, itinerary-scoped sticky first column in the mobile pivot comparison; unrelated selectors must remain unchanged.

Local result:

- Replaced generated nap/weekend starters, eight universal quick picks, a six-row abstract matrix, and six generic pacing cards with three trip-length starts, three concrete day-plan cards, five persona pivots, and four stop rules.
- Added all four released Chicago cluster handoffs, current official route/attraction checks, a sized licensed image, and three visible FAQs aligned with schema.
- Recorded exact query-to-ranking-page and community registers, all five persona applications, every-section treatment, claim boundaries, acceptance criteria, and measurement in `docs/research/chicago-family-itinerary-page-review.md`.
- Focused tests passed 4/4, the full suite passed 78/78, native SEO QA returned 0 errors and 0 warnings, and 1280/390/320 browser checks found no page overflow. The mobile pivot table stays in its scroller with a sticky trip-constraint column, and the 1280 by 960 image loads.
- Independent reviewer Boyle (`019f93dc-ecd8-78c1-988a-51943eca7217`) returned final `PASS` in cycle 2 with no P0-P3 findings after the SERP-overlap classification, mobile table behavior, and target-only regeneration test were corrected.

### IMP-028: Review And Improve The Chicago Teen Guide

Status: done and released

Selected: 2026-07-23

Roadmap ID: `FT-IMP-012`

Research a wider current teen-specific candidate set, audit every visible section, and rebuild the existing URL around choices that earn their place through a distinct older-kid reason.

Affected production URL:

- `https://familytripwise.com/things-to-do/chicago-with-teens.html`

Exact maximum transaction scope:

- `docs/research/chicago-teen-page-review.md`
- `tools/upgrade-priority-pages.mjs`
- `tools/chicago-teen-page.test.mjs`
- `site/things-to-do/chicago-with-teens.html`
- `site/styles.css`
- `status/chicago-pages.md`
- `backlog/seo-research-review-backlog.md`
- `backlog/implementation-backlog.md`
- `ops/seo-roadmap.json`
- `ops/seo-roadmap.md`
- `ops/current-cycle.md`
- `ops/operator-review.md`

Boundaries:

- Preserve the existing URL, canonical, indexability, and sitemap membership.
- Require a teen-specific reason and current official check for each retained primary choice.
- Do not publish universal age fit, safety, exact-route, transit, weather, price, opening-hour, or independent-wandering claims.
- The shared stylesheet is included only for a scoped mobile comparison treatment required by the first visual review; unrelated selectors must remain unchanged.
- Do not edit another live page, request indexing, mutate an external account, add an affiliate CTA, send outreach, or add recurring automation.

Local result:

- Replaced the duplicated generated shortlist and six generic choices with five singular teen-choice starts, one eight-choice comparison, four high-friction notes, four route shapes, four cluster routes, three current checks, and three visible/schema-aligned FAQs.
- Reduced the comparison from eleven to seven teen-relevant columns and added a scoped 820-pixel table with a sticky activity column so mobile readers can keep the option name in view.
- Recorded exact ranking-page and community-discussion registers, official product sources, evidence limitations, candidate decisions, every-section treatment, persona fit, trust boundaries, acceptance criteria, and measurement in `docs/research/chicago-teen-page-review.md`.
- Focused tests passed 5/5, the full suite passed 74/74, native SEO QA returned 0 errors and 0 warnings, and the browser check confirmed 8 rows, 7 headers, 4 detail cards, the scoped sticky column, no 1280-pixel page overflow, and a 1280 by 960 image.
- Independent reviewer Peirce (`019f93b0-2afb-7af1-a826-8ce8e31c66e6`) returned final `PASS` in cycle 2 with no P0-P3 findings. Secondary visual reviewer Jason closed all P2 findings and returned `PASS_WITH_P3`; privacy/scope reviewer Rawls returned `PASS`.
- Released at commit `7df3952b87557f035780bb4d9a44056b43678004`; GitHub Pages run `30087275395` succeeded and production release/content/SEO verification passed.

### IMP-027: Simplify The Chicago Stay-Area Guide

Status: done and released

Selected: 2026-07-23

Roadmap ID: `FT-IMP-011`

Reduce the existing Chicago stay page to one area/base decision path. Keep five distinct trip-style starts, one concise comparison, three decisive checks, visible FAQs, and a prominent handoff to the released named-hotel comparison.

Affected production URL:

- `https://familytripwise.com/where-to-stay/chicago-with-kids.html`

Exact maximum transaction scope:

- `docs/research/chicago-stay-area-page-review.md`
- `tools/upgrade-priority-pages.mjs`
- `tools/chicago-stay-page.test.mjs`
- `tools/chicago-family-hotels-page.test.mjs`
- `site/where-to-stay/chicago-with-kids.html`
- `status/chicago-pages.md`
- `backlog/seo-research-review-backlog.md`
- `backlog/implementation-backlog.md`
- `ops/seo-roadmap.json`
- `ops/seo-roadmap.md`
- `ops/current-cycle.md`
- `ops/operator-review.md`

Boundaries:

- Preserve the existing URL, canonical, indexability, and sitemap membership.
- Keep area/base intent here and named-property intent on the released hotel page.
- The existing hotel-page regression test may change only to accept the equivalent same-directory route; the hotel page remains unchanged.
- Do not publish safety, exact-route, stroller, quiet, travel-time, price-value, or universal family-fit guarantees.
- Do not edit another live page, request indexing, mutate an external account, add an affiliate CTA, send outreach, or add recurring automation.

Local result:

- Replaced the repeated generated intro/table/cards, eight universal `best` picks, eleven-column matrix, and six stale hotel checks with five conditional starts, one five-row comparison, and three decisive checks.
- Added four cluster routes led by the released ten-hotel comparison, three visible FAQs aligned with schema, and current Choose Chicago and CTA verification sources.
- Focused tests passed 4/4, the full suite passed 69/69, native SEO QA returned 0 errors and 0 warnings, and 1280/390/320 responsive checks passed without page or card overflow.
- Independent reviewer Meitner (`019f9385-11e0-70d3-8013-d4effa21ca00`) returned final `PASS` in cycle 2 with no P0-P3 findings.
- Released at commit `9d1a90d4b39a2477175bdd8597ee79e197db0ab8`; GitHub Pages run `30084335602` succeeded and production verification passed.

### IMP-026: Publish The Chicago Family-Hotel Comparison

Status: done and released

Selected: 2026-07-23

Roadmap ID: `FT-PUB-003`

Research and publish one clean Chicago named-property comparison after creating a durable hotel evidence pack in the same transaction. Use current official property facts, rough total-night planning ranges, and bounded recent family-review themes and conflicts. Existing Chicago stay and home pages may receive only the links needed to route readers to the new page.

Affected production URLs:

- `https://familytripwise.com/where-to-stay/chicago-family-hotels.html`
- `https://familytripwise.com/where-to-stay/chicago-with-kids.html`
- `https://familytripwise.com/`

Exact maximum transaction scope:

- `docs/research/chicago-family-hotel-evidence-pack.md`
- `tools/generate-pages.mjs`
- `tools/chicago-family-hotels-page.test.mjs`
- `site/where-to-stay/chicago-family-hotels.html`
- `site/where-to-stay/chicago-with-kids.html`
- `site/index.html`
- `site/sitemap.xml`
- `status/chicago-pages.md`
- `backlog/seo-research-review-backlog.md`
- `backlog/implementation-backlog.md`
- `ops/seo-roadmap.json`
- `ops/seo-roadmap.md`
- `ops/current-cycle.md`
- `ops/operator-review.md`

Boundaries:

- Publish one indexable hotel URL only; do not split out pool, suite, downtown, resort, or near-attraction variants.
- Use trip-style roles rather than an unsupported ordinal ranking.
- Show approximate total nightly planning ranges, not live inventory or a booking transaction.
- Treat crib, rollaway, connecting-room, and kitchen details as optional evidence; unknowns are not automatic exclusions.
- Paraphrase small or thin recent family-review samples and retain conflicts and freshness labels.
- Do not publish safety assurances, exact route or stroller verdicts, price guarantees, personally verified stays, or universal family-fit claims.
- Do not request indexing, add an affiliate CTA, mutate an external account, send outreach, or add recurring automation.

Local result:

- Published one generated comparison with 10 hotels chosen for distinct trip-style jobs, one 10-row comparison, 10 detailed hotel cards, five trip-style starts, direct Google Maps links, and three visible FAQs aligned with schema.
- Added a source-dated trust panel, approximate total-night ranges, official room and amenity facts, small-sample online-review themes and conflicts, and a current InterContinental pool-closure notice.
- Deferred Loews because its official site posts an indoor-pool closure through December 31, and recorded other evaluated but nonselected properties in the evidence pack.
- Linked the new page from the home page and existing Chicago stay-area guide without changing the released Chicago activity page.
- The focused test passed 4/4, the full repository suite passed 65/65, native SEO QA returned 0 errors and 0 warnings, and JavaScript syntax, roadmap JSON, whitespace, privacy, source, map, and scope checks passed.
- Responsive checks at 1280, 390, and 320 pixels found no page-level overflow. The comparison stays inside its horizontal scroller, the image loaded at its declared 1280 by 960 dimensions, and all 10 cards fit their containers.
- Review cycle 1 found three P2 evidence gaps and two P3 gaps. The implementation now reconciles the conflicting Langham Kids Suite pages, logs exact review sample counts/date spans/family context/source mapping, records Hilton's tax-inclusive public low, removes the unsupported Hotel Zachary negative amenity statement, and automates full-generator idempotency and isolation.
- Review cycle 2 found one remaining P2 because supplemental review samples lacked exact counts and date spans. Those fields are now logged for every source and property.
- Independent reviewer Wegener (`019f91eb-1d7f-7861-a9e3-4c0d8c1628b7`) returned final `PASS` on cycle 3 with no P0-P3 findings. The exact paths are eligible for commit, push, deployment, and production verification.
- Released at commit `833c081ca1c436d609b50e36ae94f47cff4c7cbf`; GitHub Pages run `30062024170` succeeded and production verification passed.

## Completed

### IMP-025: Improve The Chicago All-Ages Things-To-Do Hub

Status: done and released

Selected: 2026-07-23

Completed: 2026-07-23

Roadmap ID: `FT-IMP-010`

Improve the existing Chicago all-ages activity page after a wider current candidate review and every-section audit. Replace repeated cards, picks, tables, details, and mini-itineraries with one complete comparison, concise persona/trip-shape routes, and deep notes only for high-friction choices.

Affected production URL:

- `https://familytripwise.com/things-to-do/chicago-with-kids.html`

Exact maximum transaction scope:

- `docs/research/chicago-activity-expansion-review.md`
- `tools/upgrade-priority-pages.mjs`
- `tools/chicago-activity-page.test.mjs`
- `site/things-to-do/chicago-with-kids.html`
- `status/chicago-pages.md`
- `backlog/seo-research-review-backlog.md`
- `backlog/implementation-backlog.md`
- `ops/seo-roadmap.json`
- `ops/seo-roadmap.md`
- `ops/current-cycle.md`
- `ops/operator-review.md`

Local result:

- Expanded the compact activity filter and comparison from six generic choices to 12 distinct family decisions.
- Replaced eight universal "best" cards and the standalone teen band with one five-card CHI-P1 through CHI-P5 routing layer, then removed the repeated mini-itinerary layer.
- Replaced generic Navy Pier treatment with Chicago Children's Museum as a specific younger-child reason to visit.
- Added current official-source checks, three visible FAQs aligned with schema, and a durable every-section/candidate/persona review.
- After cycle 1 fixes, focused tests passed 4/4, the full suite passed 61/61, native SEO QA returned 0 errors and 0 warnings, and JavaScript/roadmap JSON/whitespace checks passed.
- Responsive checks at 1280, 390, and 320 pixels found no page-level overflow or console errors; the comparison table stayed inside its horizontal scroller. The budget filter hid seven nonmatching choices, kept all 15 support cards and all three FAQs visible, and exposed one correct `aria-pressed` state.
- Review cycle 1 found filter scope, duplicate routing, persona-traceability, candidate-count, accessibility, and generator-isolation issues. The implementation now keeps all non-filter support visible, exposes `aria-pressed`, removes the second route layer, traces CHI-P1 through CHI-P5, records 18 candidates, and proves regeneration changes only the stale target page.
- Review cycle 2 returned `PASS_WITH_P3` with no P0-P2. Its two polish notes were fixed: the activity trust panel no longer mentions hotel evidence, and the duplicate QA bullet was removed.
- Independent reviewer Mendel (`019f9112-265b-7742-9175-974f86f4811e`) returned final `PASS` on cycle 3 with no P0-P3 findings. The exact paths are eligible for commit, push, deployment, and production verification.
- Released and production-verified at commit `ad4f31801a3721b84a8f017bcda718f42ac7e731`; GitHub Pages run `30058164707` succeeded.

### IMP-024: Improve The Las Vegas Family Itinerary

Status: done and released

Selected: 2026-07-23

Roadmap ID: `FT-IMP-009`

Review and improve the existing Las Vegas family-itinerary page so it turns the completed activity and lodging decisions into realistic one-, two-, and three-day plans. Apply current itinerary SERPs, LV-P1 through LV-P5, every-section, evidence, repetition, and trust review before implementation.

Affected production URL:

- `https://familytripwise.com/family-itinerary/las-vegas-with-kids.html`

Boundaries:

- Preserve the existing URL, canonical, indexability, and sitemap membership.
- Use the live all-ages, teen, stay-area, and family-hotel pages as planning dependencies without editing them.
- Do not publish exact travel-time, route, stroller, safety, sensory, pool-access, opening-hour, ticket, or personally verified claims.
- Do not create another URL, request indexing, mutate an external account, or add automation.
- Complete focused/native/responsive QA and independent review before exact-path release.

Local result:

- Replaced duplicate generated and upgraded itinerary layers with three trip-length starts, three day-by-day route cards, five persona/trip pivots, four stop rules, four cluster routes, and three visible FAQs.
- Routed activity, teen, base, and named-hotel decisions to the completed sibling pages without changing them.
- Replaced stale hotel-source residue and the original image redirect with current itinerary sources and a fully attributed 1280-pixel derivative.
- Added deterministic focused tests and the durable research record at `docs/research/las-vegas-family-itinerary-page-review.md`.
- Full deterministic generation, 57/57 repository tests, 4/4 focused tests, native SEO QA, responsive checks at 1280/390/320, JSON/JavaScript/whitespace/privacy/scope checks, and source classification passed.
- Independent reviewer Ohm (`019f8e37-8452-7d00-8c74-62198bfc4c93`) returned `PASS_WITH_P3` with no P0-P2; the stale QA-status P3 was reconciled mechanically during verdict logging.
- Released and production-verified at commit `48417b0aedb17375e4474711302574e11da53494`; GitHub Pages run `29994060699` succeeded.

### IMP-023: Simplify The Las Vegas Stay-Area Guide

Status: done and released

Selected: 2026-07-22

Roadmap ID: `FT-IMP-008`

Review and simplify the existing Las Vegas stay-area page so it answers the trip-base decision without duplicating the live named-hotel comparison. Apply current SERP, LV-P1/LV-P2/LV-P3/LV-P5 persona, every-section, and trust review before implementation.

Affected production URL:

- `https://familytripwise.com/where-to-stay/las-vegas-with-kids.html`

Boundaries:

- Preserve the existing URL, canonical, indexability, and sitemap membership.
- Keep named-property prices, room facts, and review themes on the hotel comparison page.
- Do not publish a universal best area, safety assurance, exact route or stroller verdict, or personally verified stay claim.
- Do not edit another live page, request indexing, mutate an external account, or add automation.
- Complete focused/native/responsive QA and independent review before exact-path release.

Local result:

- Replaced the verbose, duplicated area and hotel flow with five trip-shape starts, one five-row base comparison, three decision checks, four cluster routes, three visible FAQs, and one current source list.
- Removed the weaker named-hotel profiles; the ten-hotel page now owns property prices, room facts, and sampled online-review themes.
- Added deterministic focused tests and the durable research record at `docs/research/las-vegas-stay-area-page-review.md`.
- Full generation, 53/53 repository tests, 4/4 focused tests, native SEO QA, responsive checks at 1280/390/320, JSON/JavaScript/whitespace/privacy/scope checks, and source classification passed.
- Independent reviewer Carson (`019f8ce4-2aa3-7da3-a3c8-07fe9fcfa14d`) returned `PASS_WITH_P3` with no P0-P2; both stale-status P3 notes were reconciled during mechanical verdict logging. Exact-path release is authorized.
- Released and production-verified at commit `7bc29933add65357ca2d83c39790614193d7165d`; GitHub Pages run `29975754626` succeeded.

### IMP-022: Improve The Las Vegas Teen Guide

Status: done

Completed: 2026-07-22

Roadmap ID: `FT-IMP-007`

Result:

- Replaced the duplicated generic teen flow with five interest-led starts, one eight-choice comparison, five high-friction detail cards, four route shapes, four cluster routes, three current-check cards, and three visible FAQs.
- Required an older-kid reason for every retained choice, removed hotel pool and generic show as primaries, and preserved mixed-age routing without changing another live page.
- Added a durable competitor, persona, candidate, claim, and every-section record at `docs/research/las-vegas-teen-page-review.md`.
- Full generation, 51/51 repository tests, 4/4 focused tests, native SEO QA, JavaScript/JSON/whitespace/privacy/scope/source checks, and 1280/390/320 responsive checks passed.
- Independent reviewer Dewey (`019f8bee-4a96-7660-a2fd-ce864e9979da`) returned `PASS_WITH_P3`; both stale-documentation P3 notes were reconciled during verdict logging. Exact-path release is authorized.

### IMP-021: Publish The Las Vegas Family-Hotel Comparison

Status: done

Completed: 2026-07-22

Roadmap ID: `FT-PUB-002`

Build one new named-property comparison only after the same transaction creates a durable, reviewable hotel evidence pack. Existing Las Vegas stay and home pages may receive internal links; no other live page is in scope.

Result:

- Created a ten-hotel comparison organized by trip style rather than ordinal rank.
- Added rough total-night ranges, official room/amenity facts, sampled online-review themes/conflicts, direct maps, a compact comparison, and visible FAQ.
- Added only the approved dependent links from the existing Las Vegas stay page and home page.
- Durable evidence: `docs/research/las-vegas-family-hotel-evidence-pack.md`.
- Independent reviewer Prism returned `PASS` on cycle 2 after both P2 findings were closed; native, focused, responsive, privacy, source, and scope QA passed.
- State: released and production-verified at commit `bda58e8d2384b3935e10e92b367a2ffd9ab76a72`; GitHub Pages run `29944609529` succeeded.

### IMP-020: Improve The Las Vegas All-Ages Things-To-Do Hub

Status: done

Completed: 2026-07-22

Roadmap ID: `FT-IMP-006`

Source handoff:

- `FT-RES-007: Select the next pilot city and create the incremental city-cluster playbook`
- `docs/research/next-city-prioritization-las-vegas-cluster.md`

Goal:

Improve the existing all-ages Las Vegas activity page after a wider candidate review and an every-section usefulness audit. Make it a compact decision hub for first-time, resort-led, younger-child/heat, teen/mixed-age, and budget/short-stay families.

Affected production URL:

- `https://familytripwise.com/things-to-do/las-vegas-with-kids.html`

Acceptance checks:

- Research a wider current candidate pool across Strip icons, Downtown, indoor/heat backup, free/budget, pool/resort, nature, museum, show, and age-specific needs.
- Select only activities with distinct planning value; a likely 10-12 set is a hypothesis, not a quota.
- Review every visible section for usefulness, repetition, persona coverage, unsupported firmness, source freshness, and keep/compress/merge/move/replace/remove treatment.
- Preserve the all-ages role and clear links to the teen, stay, and itinerary pages.
- Add compact free/budget and heat/indoor planning support without creating another URL.
- Use one comparison layer and only decision-relevant detail; do not repeat each activity in several long formats.
- Do not publish unsupported safety, smoke/noise, stroller-route, sensory, pool-access, price, or firm family-fit claims.
- Preserve canonical, indexability, sitemap membership, and unrelated generated output.
- Focused tests, full native QA, responsive browser checks, privacy/scope validation, and independent review must pass before commit.

Not in this action:

- the separately justified Las Vegas family-hotel page;
- edits to teen, stay, or itinerary URLs;
- a free, toddler, indoor, waterslide, or resort-specific URL;
- indexing requests, outreach, external-account mutations, or recurring automation.

Result:

- Expanded the existing hub from six to 12 distinct activity choices without creating another URL.
- Reduced the primary cards from eight fields to four, retained one 12-row comparison, and limited deeper notes to six high-friction choices.
- Replaced eight universal `best` picks with five trip-shape starting routes and added compact heat/indoor, free/budget, and current-condition checks.
- Added visible FAQ content aligned with FAQ schema and preserved the teen, stay, and itinerary routes.
- Added the durable wider-candidate and every-section record at `docs/research/las-vegas-activity-expansion-review.md`.

Review and QA:

- Independent reviewer Popper (`019f8a48-2b5a-7fe1-b6a7-290771ee03b8`) returned `PASS_WITH_P3` on cycle 2 after both P2 findings were closed.
- All 44 repository tests, focused tests, JavaScript checks, native SEO QA, roadmap JSON, privacy, exact-scope, responsive browser, source-link, and whitespace checks passed. The remaining P3 is only a future-reuse suggestion for the optional FAQ heading.

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
