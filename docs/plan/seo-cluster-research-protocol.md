# SEO Cluster Research And Page-Decision Protocol

State: reusable operating protocol

Last updated: 2026-07-20

Use this protocol before creating or materially changing destination pages. The goal is to decide page architecture from observed demand, SERP behavior, current site coverage, and family-specific usefulness, not from keyword phrasing alone.

## Differentiation Thesis

Family Tripwise should not try to copy local publishers, Reddit, OTAs, or Tripadvisor. Their advantages are different: local authority, UGC trust, booking inventory, review volume, and affiliate relationships.

The Family Tripwise edge should be AI-assisted research and product UX:

- synthesize high-quality current information from official sources, hotel pages, public reviews, forums, maps, and GSC evidence;
- keep source dates, uncertainty, conflicts, and booking-time checks visible internally and appropriately simple on public pages;
- turn scattered parent questions into clean decision surfaces;
- route users by trip constraints without forcing them through a heavy filter workflow;
- identify where existing ranking pages are weaker for user experience, especially when they are long listicles, unstructured forums, static tourism pages, or booking/review databases that do not explain family fit.

The point is not to have a novelty gimmick on every page. The point is to be more useful for a parent making a trip decision.

## Inputs

Required:

- Current repository operating model: `AGENTS.md`, `ops/seo-roadmap.json`, `ops/seo-roadmap.md`, `ops/current-cycle.md`, and relevant backlog entries.
- Current destination pages and unpublished prototypes.
- Latest public-safe GSC snapshot, with freshness classification.
- Existing named keyword research in `docs/research/`.
- SERP inspection for representative queries.

Optional but preferred:

- Semrush, DataForSEO, or Google Ads Keyword Planner volume/KD/CPC data.
- Protected GSC query export, only through the protected workflow.
- Parent/community discussions as qualitative input only.

Do not invent volume, KD, CPC, rankings, clicks, revenue, or persona evidence. If a tool is unavailable, mark the metric `UNKNOWN` and proceed only from evidence that exists.

## Workflow

1. Define the query universe.

   Include the destination's major family-planning jobs:

   - things to do with kids;
   - where to stay with kids;
   - best family hotels, kid-friendly hotels, family-friendly hotels, family resorts;
   - best areas and neighborhood/base decisions;
   - child-age queries: toddlers, teens, babies, tweens where visible;
   - itinerary and trip length;
   - rainy day, indoor, free, budget, weekend/current;
   - transport, stroller, car-light, nap/reset, sensory/accessibility friction;
   - activity anchors such as zoo, aquarium, beaches, theme parks, parks, museums.

2. Expand and validate keywords.

   Use the best available named tool:

   - Semrush API reports when units are available.
   - Semrush Chrome UI fallback when API units are exhausted and the user is logged in.
   - DataForSEO or Keyword Planner when explicitly authorized.

   For each seed, collect:

   - keyword;
   - US monthly volume;
   - KD;
   - CPC;
   - intent;
   - source/tool;
   - collection date.

   Use Keyword Magic or equivalent expansion for seeds before relying on single-keyword checks. Record `n/a` separately from `0`; do not treat unavailable metrics as zero demand.

3. Cluster by SERP overlap.

   A cluster exists when representative queries share ranking URLs, ranking domains, SERP features, and page types. Do not cluster terms only because they sound similar.

   Record:

   - query;
   - collection date;
   - recurring ranking pages/domains;
   - SERP/page type;
   - overlap rationale;
   - confidence.

4. Inspect ranking pages.

   For each meaningful cluster, inspect representative ranking pages and separate:

   - what they answer well;
   - what they miss;
   - authority or firsthand advantages Family Tripwise cannot honestly copy;
   - structural or product opportunities Family Tripwise can pursue.

   SERP analysis is required before major page improvements, not only before new pages. Existing-page upgrades should answer: what page type is Google rewarding, what user job do the winners satisfy, where do they rely on authority or inventory we cannot copy, and where can Family Tripwise create a better user experience through clearer comparison, freshness, routing, maps, checklists, or evidence synthesis?

5. Derive research-hypothesis personas.

   Personas should come from query modifiers, SERP patterns, parent/community questions, GSC evidence, and product constraints. Label them as research hypotheses, not demographic truth.

   For each persona, record:

   - job-to-be-done;
   - trip context;
   - child-age and pace constraints, when evidenced;
   - anxieties;
   - decision criteria;
   - failure modes;
   - searches/pages served.

   Use personas as a review tool before implementation. For each page under review, check whether the page gives every relevant persona a fast default answer before asking for interaction. Filters and toggles are useful only when they reduce decision effort. If a user must configure too many options before getting value, simplify the page into visible routes, short comparison tables, and sensible defaults.

6. Audit current pages and prototypes.

   For every canonical/indexable destination page and relevant unpublished prototype, record:

   - search intent;
   - current role;
   - GSC/index state;
   - persona fit;
   - overlap/cannibalization risk;
   - missing decision support;
   - trust/evidence gaps;
   - internal-link gaps;
   - keep, expand, consolidate, observe, or defer recommendation.

   Existing-page audits should include a persona-based usefulness review:

   - Does the page answer the highest-intent persona in the first screen or first decision surface?
   - Does it support secondary personas without cluttering the page?
   - Does it show a useful default path before filters?
   - Does it avoid unsupported certainty about safety, stroller practicality, quietness, water suitability, exact routes, or hotel fit?
   - Does it expose better decision support than ranking competitors that lack booking inventory, large review databases, or local firsthand authority?

7. Decide page architecture.

   Use this rule:

   - Standalone page: meaningful volume, distinct SERP, distinct user job, and enough evidence/content depth to satisfy the intent.
   - Existing-page expansion: meaningful volume but shared SERP or shared user job with an existing page.
   - Section/module: useful constraint with modest or uncertain volume.
   - Filter/helper text: low, unavailable, or long-tail volume where user value is real but page intent is not distinct.
   - Defer: currentness burden, trust risk, or evidence gap is too high.

   Avoid indexable filtered URLs until GSC or keyword evidence proves a stable search intent.

8. Select exactly one next implementation.

   Prefer improving an existing page or product surface unless evidence clearly justifies a new page. Respect active observation windows. Define acceptance criteria and a measurement plan before implementation.

## Page-Decision Rubric

| Signal | Standalone page | Section/module | Filter/helper | Defer |
|---|---|---|---|---|
| Volume | Usually 250+/month, or lower if commercial/high-value | 50-250/month | Low or unknown | Unknown and weak usefulness |
| SERP | Distinct recurring pages/domains | Same SERP as parent page | Not a clear SERP | Current/news-like SERP without workflow |
| User job | Different decision | Sub-decision | Refinement | Not yet clear |
| Evidence depth | Enough sources and examples | Enough for brief guidance | Simple labels/checks | Missing or trust-sensitive |
| Trust risk | Manageable with labels | Manageable with caveats | Low | High without human review |

Commercial lodging terms can justify work at lower volume than informational activity terms because revenue intent is higher.

## Current San Diego Stance

Evidence basis:

- Prior named Semrush research in `docs/research/semrush-family-travel-opportunity.md` and `docs/research/age-specific-family-travel-demand.md`.
- `FT-RES-006` SERP-overlap and page-audit pack in `docs/research/san-diego-cluster-research-decision-pack.md`.
- Logged-in Semrush Chrome UI checks on 2026-07-20 after the Semrush API connector returned zero API units.

Current page architecture:

| Priority | Page/action | Stance |
|---:|---|---|
| 1 | Upgrade `things-to-do/san-diego-with-kids.html` | Next ready implementation. Keep it as the broad activity hub and add a lightweight persona/cluster router, not a heavy filter tool. |
| 2 | Keep `where-to-stay/san-diego-with-kids.html` | Area/base decision page. Observe the protected stay page through its active window before material edits. |
| 3 | Keep and later refine `where-to-stay/san-diego-family-hotels.html` | Hotel page should target family-friendly hotels, best family hotels, kid-friendly hotels, family resorts, beach/near-anchor variants, and amenity checks. |
| 4 | Add a prominent resort section to the hotel page later | Semrush Chrome UI found `san diego family resorts` at 1.0K volume and a 197-keyword Keyword Magic cluster. Do not create a separate resort page until SERP-overlap review confirms separation from the hotel page. |
| 5 | Add a waterslide/pool amenity section or filter to the hotel page later | Semrush Chrome UI found `san diego hotels with waterslides` at 720 volume plus close variants. This is too large to ignore, but should start as a visible section/filter. |
| 6 | Keep toddler and teen pages | San Diego has enough age-specific volume for standalone toddler and teen activity pages; support them through the activity hub. |
| 7 | Keep itinerary page | Lower direct volume, but high product value. Improve after the activity hub or protected stay evaluation. |
| 8 | Rainy/free/weekend/current | Use sections first. `free things to do in san diego with kids` has visible volume; rainy/indoor exact checks were weak in the quick pass and need alternate phrase validation before a standalone page. |

San Diego terms from the 2026-07-20 Semrush Chrome pass:

| Query | Volume | KD | Page treatment |
|---|---:|---:|---|
| `things to do in san diego with kids` | 4.4K | 17 | Activity hub |
| `things to do with kids in san diego` | 1.3K | 13 | Activity hub |
| `family friendly hotels in san diego` | 1.0K | 16 | Hotel page |
| `san diego family resorts` | 1.0K | 24 | Hotel page resort section; possible later page after SERP review |
| `best family hotels in san diego` | 720 | 12 | Hotel page |
| `san diego hotels with waterslides` | 720 | 22 | Hotel page amenity section/filter |
| `san diego resorts for families` | 590 | 17 | Hotel page resort section |
| `things to do in san diego with teens` | 590 | 17 | Teen page plus activity hub routing |
| `resorts in san diego for families` | 390 | 37 | Hotel page resort section |
| `fun things to do in san diego with kids` | 390 | 12 | Activity hub |
| `where to stay in san diego with kids` | 320 | 9 | Stay page |
| `best family resorts in san diego` | 320 | 16 | Hotel page resort section |
| `family resorts san diego` | 320 | 9 | Hotel page resort section |
| `hotels with waterslides in san diego` | 320 | 25 | Hotel page amenity section/filter |
| `things to do in san diego with toddlers` | 260 | 17 | Toddler page plus activity hub routing |
| `free things to do in san diego with kids` | 170 | 10 | Activity hub section |
| `best area to stay in san diego with family` | 140 | 2 | Stay page section |
| `san diego itinerary with kids` | 90 | 11 | Itinerary page |

This stance should be rechecked after GSC observation windows produce query evidence, especially for the San Diego stay page, hotel page, and activity hub.

## Required Output For Future City Research

Every city cluster research pass should produce:

- query universe;
- keyword validation table with source/tool/date;
- SERP-overlap cluster map;
- ranking-page analysis;
- persona hypotheses;
- current page/prototype audit;
- page architecture recommendation;
- exactly one promoted next implementation;
- acceptance criteria;
- measurement plan;
- unresolved evidence gaps.
