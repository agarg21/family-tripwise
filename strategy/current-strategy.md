# Family Tripwise Current Strategy

Last updated: 2026-07-07

This is the canonical operating strategy for Family Tripwise. It consolidates the current project direction without replacing the underlying source docs in `docs/`.

## Source Docs

Read these before changing strategy:

- `AGENTS.md`
- `docs/PROJECT_BRIEF.md`
- `docs/plan/product-ai-plan.md`
- `docs/plan/content-strategy.md`
- `docs/plan/90-day-execution-plan.md`
- `docs/research/semrush-family-travel-opportunity.md`
- `docs/research/age-specific-family-travel-demand.md`

## Project Thesis

Family Tripwise is a consumer family travel planning site and AI product. It helps parents and caregivers make realistic trip decisions with children by combining destination-specific SEO pages with practical planning tools.

The site should not feel like a generic AI travel blog. It should answer parent-specific planning questions that ordinary travel listicles handle poorly:

- Where should we stay with kids?
- What should we do with kids this age?
- Which hotel or area is actually family-friendly?
- Can this itinerary work without exhausting everyone?
- What should we avoid?
- What is the backup plan if naps, weather, transit, crowds, or walking go sideways?

## Audience

Primary users are parents and caregivers planning trips with:

- babies
- toddlers
- school-age kids
- tweens
- teens
- mixed-age sibling groups

The user is usually trying to resolve practical constraints:

- nap schedules
- stroller access
- car seats
- transit complexity
- room size
- pool, breakfast, kitchen, laundry, crib, or rollaway needs
- rainy-day backups
- budget
- walking tolerance
- overstimulation
- multi-child age gaps

## SEO Wedge

The initial search opportunity is destination-specific family travel queries where intent is clear and existing SERPs are often fragmented or generic.

Highest-intent pages:

- `where to stay in {destination} with kids`
- `best family hotels in {destination}`
- `best area to stay in {destination} with kids`

Medium-high intent pages:

- `things to do in {destination} with kids`
- `{destination} itinerary with kids`

Medium intent pages:

- `{destination} family vacation`
- `kid-friendly {destination}`
- `{destination} with toddlers`
- `{destination} with teens`

Default search market: United States unless a task explicitly says otherwise.

## Product Wedge

Family Tripwise should compete with static blogs by adding decision support and tools:

- where-to-stay recommender
- family hotel shortlist and review summarizer
- things-to-do list with age filters
- nap-friendly itinerary builder
- rainy-day backup planner
- stroller/transit difficulty scoring
- map export
- packing list by season and child age

Static blogs answer: "Here are things we did."

Family Tripwise should answer: "Given your children, budget, trip length, mobility needs, lodging style, and weather risk, here is the plan that is most likely to work."

## Initial Destination Clusters

The first destination cluster set is:

1. San Diego
2. Las Vegas
3. New York City
4. Orlando / Disney World
5. Chicago
6. Miami
7. San Antonio
8. Washington DC
9. Paris, France
10. London, UK

Destination normalization rules:

- NYC, New York, and New York City map to `New York City`.
- Oahu, Honolulu, and Waikiki are related but should remain separate when search intent differs.
- Disney World and Orlando can be grouped, but Disney-specific terms must be marked.
- London UK and London Ontario must be disambiguated.
- Paris France and Paris TX must be disambiguated.

## First 30 Page Roadmap

The current first-30 roadmap from `docs/plan/content-strategy.md` is:

| Priority | Page |
|---:|---|
| 1 | Things to do in San Diego with kids |
| 2 | Where to stay in San Diego with kids |
| 3 | Best family hotels in San Diego |
| 4 | San Diego family itinerary |
| 5 | Things to do in Las Vegas with kids |
| 6 | Best family hotels in Las Vegas |
| 7 | Where to stay in Las Vegas with kids |
| 8 | Things to do in New York City with kids |
| 9 | Where to stay in New York City with kids |
| 10 | Best family hotels in New York City |
| 11 | New York City itinerary with kids |
| 12 | Things to do in Orlando with kids |
| 13 | Best family hotels in Orlando |
| 14 | Disney World with toddlers |
| 15 | Disney World family itinerary |
| 16 | Things to do in Chicago with kids |
| 17 | Where to stay in Chicago with kids |
| 18 | Chicago itinerary with kids |
| 19 | Things to do in Miami with kids |
| 20 | Best family hotels in Miami |
| 21 | Where to stay in Miami with kids |
| 22 | Things to do in San Antonio with kids |
| 23 | Best family hotels in San Antonio |
| 24 | Things to do in Washington DC with kids |
| 25 | Where to stay in Washington DC with kids |
| 26 | Washington DC itinerary with kids |
| 27 | Where to stay in Paris with kids |
| 28 | Best family hotels in Paris |
| 29 | Where to stay in London with kids |
| 30 | Best family hotels in London |

Do not treat this as permission to mass-generate pages. Each page still needs a useful, index-worthy reason to exist.

## Current Site Status

The site is a static GitHub Pages site deployed from `site/`.

Current configured domain:

- `familytripwise.com`

Current page families include:

- `things-to-do/`
- `where-to-stay/`
- `family-itinerary/`
- an About/methodology page
- legacy redirect-style San Diego HTML pages

GitHub Pages and GSC are already configured. Do not redo infrastructure unless a check shows drift.

## Quality Bar

Every indexable page should justify itself through family-specific usefulness, not just keyword targeting.

Each page should include, where relevant:

- search-intent-matched intro
- quick decision section
- comparison table
- age suitability
- time needed
- cost band
- stroller/transit difficulty
- nap-friendliness
- rainy-day suitability
- parent-specific caveats
- booking/timing notes
- nearby pairings
- internal links to related pages
- schema where useful
- source or update signals where appropriate

Pages should help a parent make real trip-planning decisions without opening five other tabs.

## Human-Review Requirements

Human review is required for:

- hotel recommendations
- area recommendations
- safety notes
- transit/stroller advice
- claims that could materially affect a family trip

Agents may draft, structure, compare, and flag claims, but must not present AI output as personally verified experience.

Separate:

- measured data
- tool estimates
- human-reviewed claims
- assumptions
- opinions
- model-derived scores

Mark unavailable keyword volume, CPC, difficulty, traffic, backlinks, revenue, or ranking data as `UNKNOWN`.

## 90-Day Goals

Days 1-30:

- brand/domain decision
- repository and documentation
- content model
- first 10 pages
- first version of where-to-stay recommender
- basic activity data structure

Days 31-60:

- expand Orlando / Disney World, Chicago, Miami, and San Antonio clusters
- add activity filters
- build first itinerary builder prototype
- build first hotel comparison table

Days 61-90:

- expand Washington DC, Paris, and London clusters
- add rainy-day planner
- add map export
- create review summarization workflow
- create editorial QA checklist

Directional traffic targets for a new domain:

| Timeframe | Monthly organic sessions |
|---|---:|
| 3 months | 500-2,000 |
| 6 months | 5,000-15,000 |
| 12 months | 25,000-75,000 |

Treat these as directional assumptions, not measured forecasts.

## Risks

Main risks:

- publishing thin AI travel content
- over-scaling before page quality is high
- inaccurate hotel, safety, transit, or stroller advice
- stale attraction, transit, and hotel data
- insufficient trust signals
- adding pages that do not deserve indexing
- inventing metrics or confidence

Mitigations:

- keep human review in the loop
- start with fewer destinations and deeper utility
- store source dates where possible
- label inferred scores clearly
- improve existing pages before creating more pages
- use tools, tables, and decision flows to add original value

## Current Operating Priority

Use the three-agent operating system:

1. Master / Operator maintains strategy, baton, decisions, and sequencing.
2. SEO Research & Review audits strategy, pages, opportunities, and ranking realism.
3. Implementation changes the site/product only when work is implementation-ready.

The immediate next priority is to have SEO Research & Review audit the current strategy, current live pages, and first destination cluster priority before additional implementation.

