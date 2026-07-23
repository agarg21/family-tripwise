# SEO Research & Review Backlog

Last updated: 2026-07-23

## Active

No standalone research task is active. `FT-IMP-010` / `IMP-025` is the sole ready Chicago implementation.

## Recently Done

### SRR-015: Chicago SERP-Overlap Cluster, Persona, And Page Decision Pack

Status: done

Roadmap ID: `FT-RES-008`

Result:

- Built a query-level SERP observation matrix, nine overlap clusters, and five persona hypotheses from current GSC, logged-in Semrush Chrome, public SERPs, ranking pages, and qualitative parent discussions.
- Audited every visible section of all four current Chicago pages.
- Kept area/base intent on the existing stay page and approved one future named-property family-hotel page through the durable hotel evidence workflow.
- Promoted exactly one next implementation: `FT-IMP-010` / `IMP-025` for the existing all-ages activity hub.
- Artifact: `docs/research/chicago-family-cluster-decision-pack.md`.
- Independent reviewer Carson returned `PASS` on cycle 3 with no P0-P3 findings.

### SRR-014: Las Vegas Family-Itinerary Competitor And Section Review

Status: done inside implementation transaction

Completed: 2026-07-23

Roadmap ID: `FT-IMP-009`

Result:

- Compared current destination, firsthand, commercial, generated-itinerary, and qualitative community results without treating anecdotes as demand or verified universal facts.
- Applied LV-P1 through LV-P5 and recorded a keep/compress/replace/remove decision for every visible section.
- Separated activity selection, lodging selection, and itinerary sequencing, then defined three route lengths, five pivots, and four stop rules.
- Artifact: `docs/research/las-vegas-family-itinerary-page-review.md`.

### SRR-013: Las Vegas Stay-Area Competitor And Section Review

Status: done inside implementation transaction

Completed: 2026-07-22

Roadmap ID: `FT-IMP-008`

Result:

- Separated the area/base decision from named-property comparison after inspecting current area, hotel, OTA, and qualitative community results.
- Applied LV-P1/LV-P2/LV-P3/LV-P5 and recorded a keep/compress/replace/remove decision for every visible section.
- Reduced the proposed page to five base types, one comparison, three decisive checks, cluster routing, visible FAQ, and current source boundaries.
- Artifact: `docs/research/las-vegas-stay-area-page-review.md`.

### SRR-012: Las Vegas Teen Page Competitor And Section Review

Status: done inside implementation transaction

Completed: 2026-07-22

Roadmap ID: `FT-IMP-007`

Result:

- Audited every visible section against teen intent, LV-P4, mixed-age planning, repetition, and trust boundaries.
- Compared current teen-specific ranking pages and qualitative community discussions without treating anecdotes as demand or firsthand proof.
- Retained eight choices only where an older-kid reason and current official-check path were clear; removed the generic hotel-pool and unspecified-show primaries.
- Artifact: `docs/research/las-vegas-teen-page-review.md`.

### SRR-011: Las Vegas Family-Hotel Evidence Pack

Status: done

Completed: 2026-07-22

Roadmap ID: `FT-PUB-002`

Evaluate a wider candidate pool and produce the durable official-fact, rough-total-price, sampled-review, contradiction, freshness, and unknown record required for one clean Las Vegas family-hotel comparison. This research is part of the selected publication transaction, not a separate scheduled action.

Result:

- Selected ten properties with distinct pool, suite, kitchen, budget, older-kid, North Strip, and nature-base roles.
- Recorded official facts, broad total-night planning ranges, bounded recent-review themes/conflicts, deferred candidates, freshness, unknowns, page architecture, acceptance criteria, and measurement plan.
- Artifact: `docs/research/las-vegas-family-hotel-evidence-pack.md`.

## Next

### SRR-003: Decide First Tool-Like Feature

Status: pending

Recommendation label: `test`

Compare:

- where-to-stay recommender
- activity age filters
- nap-friendly itinerary builder
- rainy-day planner

Recommend one narrow implementation test.

### SRR-007: Validate San Antonio Family-Hotel Demand And Review Workflow

Status: pending

Recommendation label: `ask user`

Assess whether San Antonio hotel-intent queries justify more hotel-focused work before a human-review workflow exists.

Questions:

- Is demand for San Antonio family hotels strong enough to prioritize now beyond the existing where-to-stay page?
- Should the next step be research only, a hotel-verification workflow, or a standalone hotel page brief?
- Can a human reviewer verify hotel, fee, room, crib/rollaway, pool, parking, noise, location, safety, and transit/stroller claims?

Current measured signal:

- GSC UI review on July 8, 2026 showed sparse San Antonio family-hotel queries, but rankings were weak and total GSC data volume was tiny.
- Treat all conclusions as directional until more data is available.

## Done

### SRR-010: Select Next Pilot City And Define The Reusable City Workflow

Status: done

Completed: 2026-07-22

Roadmap ID: `FT-RES-007`

Result:

- Selected Las Vegas using fresh page-level GSC, a logged-in Semrush US comparison, query-level SERP overlap, representative ranking pages, and current-page leverage.
- Created the Las Vegas cluster/persona/page decision pack, reusable incremental city playbook, and full Las Vegas page status table.
- Promoted exactly one next implementation, `FT-IMP-006` / `IMP-020`, without editing `site/**`.
- Independent reviewer Mendel returned `PASS_WITH_P3` after all P2 findings were closed; native and focused QA passed.

### SRR-009: San Diego Cluster SERP-Overlap And Persona Decision Pack

Status: done

Completed: 2026-07-20

Roadmap ID: `FT-RES-006`

Recommendation label: `improve`

Research artifact:

- `docs/research/san-diego-cluster-research-decision-pack.md`

Scope:

- Built the complete San Diego family query universe from observed SERP URL/domain overlap, not keyword-volume lists or semantic intuition alone.
- Inspected representative ranking pages and separated authority/firsthand advantages Family Tripwise cannot copy from structural/usefulness opportunities it can honestly pursue.
- Derived a small research-hypothesis persona set from query modifiers, parent/community questions, and product constraints.
- Audited all canonical/indexable San Diego pages, legacy shims, and relevant unpublished prototypes against the cluster map and personas.
- Promoted exactly one bounded next implementation while respecting the protected San Diego stay-page observation window.

Current result:

- Promoted `FT-IMP-002` / `IMP-016`: upgrade the existing all-ages San Diego things-to-do page into a persona-led cluster router.
- Independent review returned `PASS` with no P0-P3 findings.
- No `site/**`, sitemap, robots, canonical, indexability, external account, indexing request, automation, or deployment changed in the research action.

### SRR-005: San Diego Hotel Page Feasibility Review

Status: done

Completed: 2026-07-18

Recommendation label: `research`

Research artifact:

- `docs/research/san-diego-family-hotel-evidence-pack.md`

Result:

- Built a source-backed internal record for the three candidate properties already named on the San Diego stay page.
- Separated official facts, booking checks, review signals, community signals, conflicts, and unknowns.
- Kept the pack unranked and internal. A standalone hotel page remains blocked pending broader hotel coverage, sourced approximate price bands, consistent review sampling, freshness checks, and human review for trust-sensitive conclusions.
- Added a follow-up page concept queue item: `FT-PLAN-001`, focused on a clean, low-clutter San Diego family-hotel page brief before any live page is built.
- No live page, sitemap, indexability, affiliate, indexing, outreach, or external-account change was made.

### SRR-002: Review Priority Pages For Index-Worthiness

Status: done

Completed: 2026-07-14

Recommendation label: `improve`

Research artifact:

- `docs/research/srr-002-priority-page-review.md`

Result:

- Kept all eight reviewed priority pages indexable based on current usefulness, metadata, internal links, source framing, and structured decision support.
- Classified the latest GSC snapshot as a one-day-old reused authenticated UI import, not fresh API evidence; it informed non-measurement research but did not support a fresh indexing or performance claim.
- Respected both active URL-scoped observation windows and did not edit any reviewed live page.
- Promoted exactly one bounded next implementation: `FT-IMP-001` / `IMP-015`, a trust and decision-support revision of the unprotected Las Vegas where-to-stay page.
- Did not request indexing, add a destination/page, send outreach, or mutate an external account.

Implementation-ready handoff created:

- `IMP-015: Reframe Las Vegas Stay Decision Support`

### SRR-008: Post-IMP-013 GSC-Signaled Page Review

Status: done

Completed: 2026-07-11

Recommendation labels: `monitor`, `improve`

Source inputs:

- `AGENTS.md`
- `strategy/current-strategy.md`
- `strategy/content-principles.md`
- `agents/seo-research-review-agent.md`
- `ops/current-cycle.md`
- `backlog/seo-research-review-backlog.md`
- `backlog/implementation-backlog.md`
- `docs/research/gsc-ui-review-2026-07-11.md`
- `progress.md`
- `decisions.md`
- current git status and diff
- changed `IMP-013` site pages and generation scripts

Result:

- Confirmed `IMP-013` improved the GSC-signaled pages without adding unsupported expansion.
- Local QA returned 0 errors and 0 warnings.
- Production QA returned 0 errors and 0 warnings.
- Home/About thin-page warnings are resolved.
- Sitemap remains unchanged at 22 canonical URLs and continues to exclude legacy San Diego shim pages.
- The three San Diego legacy shim pages remain outside the sitemap and include `noindex, follow` plus canonical links to active URLs.
- No new city cluster, standalone hotel page, or `/things-to-do/nyc-this-weekend-with-kids.html` page was created.
- `IMP-012` remains deferred.
- Changed pages include useful parent decision support, internal cluster links, metadata, `ItemList` / `FAQPage` schema where appropriate, source sections, and trust/methodology framing.
- Hotel, stroller, transit, area, and family-suitability guidance is generally framed as research-based planning support requiring verification rather than personally verified recommendation.
- Found one implementation-ready claim-language cleanup: several pages use safety-loaded words such as "safest" where the intended meaning is planning reliability or lowest-friction choice, not source-backed physical safety.

Implementation-ready handoff created:

- `IMP-014: Clean Safety-Loaded Planning Language`

### SRR-006: Validate NYC Local / Weekend Events Concept

Status: done

Completed: 2026-07-08

Recommendation label: `test`

Research artifact:

- `docs/research/srr-006-nyc-local-weekend-events.md`

Scope:

- Decide whether Family Tripwise should test a local/nearby-parent page or product module for NYC, Jersey City, Hoboken, and reachable family activities/weekend events.
- Include user context: the user lives in Jersey City and personally wants free/paid family activities around NYC, Jersey City, Hoboken, and nearby reachable areas.
- Treat Instagram accounts such as JCFamilies and The Hoboken Girl as competitor/source-discovery signals, not scrape targets or durable primary sources.

Result:

- Recommended a hybrid test: SEO landing page plus manually curated weekend planner module, with possible future newsletter path.
- Recommended first URL: `/things-to-do/nyc-this-weekend-with-kids.html`, framed as a planner for NYC, Jersey City, Hoboken, and nearby reachable areas.
- Recommended scope: greater NYC metro families, with Jersey City/Hoboken as first-class filters and logistics context rather than separate first-page silos.
- Keyword volume, CPC, difficulty, traffic, and revenue potential are `UNKNOWN`; no named keyword database was queried.
- Observed source ecosystem includes Mommy Poppins, Time Out Kids, Brooklyn Bridge Parents, NYC Parks, Hudson River Park, Brooklyn Bridge Park, NYPL/BPL, JCFamilies, Jersey City Cultural Affairs, Jersey City Free Public Library, Hoboken Girl/Local Girl, Hoboken Public Library, Hoboken Now, NJ Kids, NJ Mom, Macaroni KID, and Eventbrite.
- Anti Gravity CLI advisory review was run via `agy`; it agreed with a hybrid test, greater NYC/Jersey City/Hoboken scope, NYC weekend URL, and no automatic publishing.

Implementation handoff created, then deferred at user request on 2026-07-09:

- `IMP-012: Build Greater NYC Weekend Family Planner Pilot`

### SRR-004: Post-Implementation QA For Thin-Page Cleanup

Status: done

Completed: 2026-07-08

Recommendation label: `improve`

Scope:

- Confirm `IMP-001` through `IMP-005` and `IMP-009` align with strategy.
- Review whether upgraded pages now deserve indexing.
- Check remaining QA warnings for `site/about.html`, `site/index.html`, and four remaining itinerary pages.
- Review San Diego legacy shim handling.
- Review improved NYC tourist page against the GSC signal and Family Tripwise quality bar.
- Use Anti Gravity CLI as advisory second-opinion reviewer if available.

Result:

- Local QA and production QA both returned 0 errors and 6 warnings.
- `IMP-001` through `IMP-005` and `IMP-009` align with `AGENTS.md`, `strategy/current-strategy.md`, and `strategy/content-principles.md`.
- Upgraded pages deserve continued indexing:
  - `site/family-itinerary/san-diego-with-kids.html`;
  - `site/where-to-stay/chicago-with-kids.html`;
  - `site/where-to-stay/san-antonio-with-kids.html`;
  - four upgraded teen pages;
  - `site/things-to-do/new-york-city-with-kids.html`.
- Remaining itinerary warnings are real content-depth issues. Chicago, Las Vegas, New York City, and San Antonio itinerary pages should be improved using the San Diego itinerary pattern instead of noindexed.
- `site/about.html` and `site/index.html` should remain indexable as trust/navigation pages; monitor them and improve later if a lightweight trust/homepage task is needed.
- The three San Diego legacy shim pages are sufficiently handled for the current static GitHub Pages setup because they are outside the sitemap, include `noindex, follow`, and canonicalize to active URLs.
- The upgraded NYC tourist page adequately responds to the early GSC signal while keeping local/weekend concepts separate.
- Anti Gravity CLI advisory review was run via `agy`; it agreed that the next implementation-ready task should be upgrading the four remaining itinerary pages and did not recommend noindexing About/Home.

Implementation-ready handoff created:

- `IMP-010: Upgrade Remaining Family Itinerary Pages`

### SRR-001: Audit Current Strategy And Live Page Alignment

Status: done

Recommendation label: `test`

Scope:

- Confirm `strategy/current-strategy.md` preserves the existing docs.
- Review current sitemap and live page inventory.
- Identify pages that should be improved before any new pages are added.
- Confirm or revise near-term destination priority.
- Produce implementation-ready tasks for the Implementation Agent.

Read first:

- `strategy/current-strategy.md`
- `strategy/content-principles.md`
- `docs/PROJECT_BRIEF.md`
- `docs/plan/content-strategy.md`
- `site/sitemap.xml`
- current priority pages under `site/`

Expected output:

- updated backlog notes
- implementation-ready tasks in `backlog/implementation-backlog.md`
- current-cycle update

Result, 2026-07-07:

- Strategy is preserved accurately in `strategy/current-strategy.md`.
- Production sitemap matches local `site/sitemap.xml` and all 22 sitemap URLs returned HTTP 200.
- Local technical checks found 0 broken internal links and 0 JSON-LD parse errors.
- Current live pages partially align with strategy:
  - Stronger/index-worthy now: five core `things-to-do/*-with-kids.html` pages, San Diego toddler page, and the upgraded San Diego / Las Vegas / New York City where-to-stay pages.
  - Needs improvement before further expansion: all five itinerary pages, Chicago and San Antonio where-to-stay pages, and thin teen pages.
  - Legacy San Diego root-level HTML files are not in the sitemap and canonicalize to active URLs, but should be converted to explicit redirects or marked `noindex, follow` if redirects are not available.
- Near-term destination focus remains San Diego, Las Vegas, New York City, Chicago, and San Antonio. Do not add more cities until the thin-page cleanup and first-cluster improvements are complete.
- First cluster priority: finish San Diego quality depth before expansion. San Diego already has kids, toddlers, teens, stay, and itinerary coverage; the itinerary page is the weakest San Diego URL.
- Anti Gravity CLI advisory review was run via `agy`; it agreed that thin itinerary, Chicago/San Antonio stay, and thin teen pages are the main quality risk. Its stronger noindex recommendation was treated as advisory; the preferred path is immediate improvement with temporary noindex only if those pages cannot be upgraded in the next implementation cycle.
