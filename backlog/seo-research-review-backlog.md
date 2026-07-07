# SEO Research & Review Backlog

Last updated: 2026-07-07

## Active

No SEO Research & Review task is active until Implementation completes the SRR-001 handoff or the user requests another research/review cycle.

## Next

### SRR-002: Review Priority Pages For Index-Worthiness

Status: ready

Recommendation label: `improve`

Review pages currently most important to Family Tripwise:

- San Diego things to do with kids
- San Diego where to stay with kids
- Las Vegas things to do with kids
- Las Vegas where to stay with kids
- New York City things to do with kids
- New York City where to stay with kids
- Chicago things to do with kids
- San Antonio things to do with kids

Focus on parent usefulness, originality, trust, internal links, metadata, and whether each page deserves indexing.

### SRR-003: Decide First Tool-Like Feature

Status: pending

Recommendation label: `test`

Compare:

- where-to-stay recommender
- activity age filters
- nap-friendly itinerary builder
- rainy-day planner

Recommend one narrow implementation test.

### SRR-004: Post-Implementation QA For Thin-Page Cleanup

Status: pending

Recommendation label: `test`

Review after Implementation completes the first handoff batch:

- Confirm upgraded San Diego itinerary has itinerary decision table, nap/rain swaps, route assumptions, schema, and source notes.
- Confirm Chicago and San Antonio where-to-stay pages match the upgraded stay-page quality bar.
- Confirm thin teen pages either meet the age-specific activity page quality bar or are temporarily removed from the sitemap with `noindex, follow`.
- Re-run internal link, sitemap, and JSON-LD checks.

### SRR-005: San Diego Hotel Page Feasibility Review

Status: pending

Recommendation label: `ask user`

Evaluate whether to create `best family hotels in San Diego` only after:

- the user confirms a human-review path for hotel recommendations, fees, room policies, pool notes, parking, crib/rollaway notes, and noise/location caveats;
- hotel data can be sourced from official property pages or another auditable source;
- the current San Diego where-to-stay page remains the canonical area decision page.

## Done

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
