# Las Vegas Cross-Page Base And Day-Shape Task Review

Reviewed: 2026-08-29

Action: `FT-RES-022` / `SRR-043`

Review: Gauss cycle-two `PASS`; no P0-P3 findings; docs-only action commit `f1dace7d41c13e5767c5dc4894b7b6bc3ae9b339`

Targets:

- https://familytripwise.com/family-itinerary/las-vegas-with-kids.html
- https://familytripwise.com/where-to-stay/las-vegas-with-kids.html
- https://familytripwise.com/where-to-stay/las-vegas-family-hotels.html
- https://familytripwise.com/things-to-do/las-vegas-with-kids.html

Evidence level: `proxy-reviewed`. This is a task walkthrough of the live interface. It is not observation of parents, user testing, behavior-supported evidence, satisfaction evidence, or a search-ranking result.

## Decision

The joined cross-page task is `PARTIAL`.

The one-night plus one-full-day case can complete all six outputs. The itinerary exposes a short trip as named blocks, classifies a pool as a reset or full trip block, and says what to remove. The area page distinguishes a Center Strip first-trip base from a South Strip pool-led base. The hotel page supplies candidate-specific occupancy, bedding, pool, parking, access, and total-price checks. The activity page supplies the pool half-day shape, current unknowns, and official-source recovery.

The four-full-day case cannot complete two outputs directly. The itinerary stops at three days, so the usable-block count must be extrapolated. The cluster also does not state whether a family with fixed central anchors should keep one central base, move to a South Strip pool property, or treat the pool as available only at the exact booked hotel. The pages expose every input and correctly preserve the unknown guest-access boundary, but the family must synthesize the base consequence itself.

Preserve all four pages and the current URL set now. Retain one bounded, unselected future hypothesis: place a compact base-consequence handoff beside the itinerary's existing pool-led pivot so a short or four-day planner can connect `pool is a full block` to `choose one base from the exact booked-property access and fixed anchors`, then reach the existing stay-area and hotel evidence without waiting for the deep cluster section. This is an existing-page hypothesis, not a selected implementation.

## Instrument Boundary

The live route was followed with normal links at 390 by 844 and 320 by 800. Both exact mobile viewport overrides were confirmed from `innerWidth` and `innerHeight` after reload.

The desktop browser accepted a requested 1280 by 900 override but reported a 1280 by 720 inner viewport. Desktop evidence therefore covers the 1280-pixel width breakpoint, visible source order, successful normal navigation, and zero overflow, but no exact 900-pixel viewport ratio is claimed. Mobile positions below come only from confirmed exact viewport dimensions.

Screenshots were not retained. One screenshot attempt closed a temporary test tab; a fresh tab reproduced the DOM, route, dimensions, and zero-overflow checks. This tooling event is not page evidence.

## Family Cases

### Case A: one night plus one full day

A family of four with children about 9 and 15 is deciding between a destination-pool hotel and a central first-trip base. It needs:

1. a usable-block count;
2. pool classification as amenity, half-day, or main day;
3. a base type;
4. true occupancy and room setup;
5. heat, transport, parking, pool-access, and complete-total checks;
6. one thing to remove when the pool or a transfer consumes a block.

### Case B: four full days

A family of four with children about 8 and 9 has fixed Center Strip-area anchors, represented by Treasure Island and Sphere plans, plus interest in a separate South Strip pool block. It needs the same six outputs and must decide whether the pool changes the stay base or only the day shape.

The named anchors are fixed inputs, not claims that Family Tripwise has verified their exact route, ticket, age, or current operating details. The task requires the current pages to preserve those unknowns and direct the family to exact-date checks.

## Evidence Inventory

| Evidence | Date | Class | Use | Limitation |
|---|---|---|---|---|
| Live Las Vegas itinerary | Inspected 2026-08-29; visible sources checked 2026-07-23 | Live page/interface evidence | Trip blocks, pool pivot, removal and stop rules, cluster handoffs | Covers one to three days, not an explicit four-day case |
| Live Las Vegas stay-area guide | Inspected 2026-08-29; visible sources checked 2026-07-22 | Live page/interface evidence | Center versus South Strip base, first-two-days map, complete-stay and reset checks | Area guidance cannot establish exact hotel access or route |
| Live Las Vegas family-hotel guide | Inspected 2026-08-29; visible facts/prices/reviews checked 2026-07-22 | Live property/interface evidence | Named pool/central starts, occupancy, bedding, price, parking and access checks | Dynamic prices and exact room/pool operations require recheck |
| Live Las Vegas activity guide | Inspected 2026-08-29; visible official sources checked 2026-08-03 | Live activity/interface evidence | Pool half-day shape, age fields, evidence/unknown recovery and costs | Reference-family costs do not equal this family's checkout total |
| `FT-RES-021` current-question synthesis | 2026-08-28 | Qualitative community synthesis | Source of the falsifiable joined decision | Four questions do not establish prevalence or demand |
| `ops/gsc-snapshots/2026-08-28.*` | Collected 2026-08-28; finalized through 2026-08-26 | Fresh authenticated API, public-safe | Index/crawl and measurement boundary | No aligned query cohort; cannot select content or CTR work |

## Observable Route

The normal route was itinerary to stay area to family hotels to activities. The first two transitions use explicit contextual links. The hotel page has no contextual activity or itinerary link, so the third transition uses the global `Las Vegas` destination link. No broken link, conflicting page ownership, or horizontal overflow was found.

### Itinerary

The page exposes one-, two-, and three-day starts, named blocks, a pool-led pivot, stop rules, and all four cluster links. The base and activity handoffs come only in the cluster section after every route, pivot, and stop-rule layer.

| Confirmed viewport | Trip-length start | One-day route | Pool/constraint pivot | Cluster start | Activity link | Stay-base link | Overflow |
|---|---:|---:|---:|---:|---:|---:|---:|
| 390 by 844 | 1,436px / 1.7 viewports | 2,412px / 2.9 | 4,683px / 5.5 | 6,406px / 7.6 | 6,630px / 7.9 | 7,152px / 8.5 | 0px |
| 320 by 800 | 1,544px / 1.9 viewports | 2,645px / 3.3 | 5,324px / 6.7 | 7,195px / 9.0 | 7,444px / 9.3 | 7,990px / 10.0 | 0px |

### Stay-area guide

The five quick starts and matrix make Center Strip versus South Strip explicit. The named-hotel handoff follows the matrix and the three exact booking checks, so it is semantically ordered even though it is five to six mobile viewports down.

| Confirmed viewport | Quick starts | Area matrix | Booking checks | Cluster start | Hotel link | Overflow |
|---|---:|---:|---:|---:|---:|---:|
| 390 by 844 | 1,436px / 1.7 viewports | 2,517px / 3.0 | 3,542px / 4.2 | 4,380px / 5.2 | 4,604px / 5.5 | 0px |
| 320 by 800 | 1,545px / 1.9 viewports | 2,751px / 3.4 | 3,824px / 4.8 | 4,762px / 6.0 | 5,011px / 6.3 | 0px |

### Family-hotel guide

The page starts with a short answer, returns to the area guide, offers five trip-style pairs, then supplies the comparison and detailed room/evidence cards. Mandalay Bay publishes two queens for four; Vdara publishes a king plus queen sofa with maximum occupancy four. Other candidates correctly require exact room-type verification.

| Confirmed viewport | Short answer | Area return | Trip-style starts | Comparison | First detailed hotel | Overflow |
|---|---:|---:|---:|---:|---:|---:|
| 390 by 844 | 1,457px / 1.7 viewports | 1,793px / 2.1 | 2,426px / 2.9 | 3,631px / 4.3 | 5,099px / 6.0 | 0px |
| 320 by 800 | 1,541px / 1.9 viewports | 1,925px / 2.4 | 2,582px / 3.2 | 4,004px / 5.0 | 5,524px / 6.9 | 0px |

### Activity guide

The planning stance, early stay-base link, filters, and pool/reset card appear early. The detailed cost/evidence layer is much later. The itinerary return is in the cluster section after the cost table. The filters are single-mode aids; mixed-age families can use `All` and inspect the visible age-fit fields rather than infer that one age filter represents both children.

| Confirmed viewport | Planning stance | Stay-base link | Filters | Pool card | Trip starts | Cost/evidence table | Itinerary link | Overflow |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| 390 by 844 | 963px / 1.1 viewports | 1,566px / 1.9 | 1,744px / 2.1 | 2,032px / 2.4 | 6,648px / 7.9 | 7,505px / 8.9 | 11,693px / 13.9 | 0px |
| 320 by 800 | 1,076px / 1.3 viewports | 1,727px / 2.2 | 1,905px / 2.4 | 2,221px / 2.8 | 7,205px / 9.0 | 8,187px / 10.2 | 12,501px / 15.6 | 0px |

## Task Matrices

Viewport does not change whether evidence exists, so the output score is stable across the 1280-width desktop check and both exact mobile runs. Mobile position affects effort, recorded separately above.

### Case A

| Required output | 1280-width desktop | 390 by 844 | 320 by 800 | Observable evidence |
|---|---|---|---|---|
| Usable blocks | `YES` | `YES` | `YES` | One-day route names first, middle/reset, and last blocks plus a stop rule |
| Pool role | `YES` | `YES` | `YES` | Itinerary distinguishes reset from full block; activity card says half day and property-specific |
| Base type | `YES` | `YES` | `YES` | Center Strip for first-trip central anchors; South Strip when pool/resort is a major anchor |
| Occupancy and room setup | `YES` | `YES` | `YES` | Named candidates include explicit four-person Mandalay and Vdara setups plus exact-room verification |
| Current checks | `YES` | `YES` | `YES` | Exact entrance, heat/weather, transport, parking, guest access, same-occupancy total and unknowns are exposed |
| Removal decision | `YES` | `YES` | `YES` | Remove a sightseeing block or second resort loop when pool/reset consumes the block |

### Case B

| Required output | 1280-width desktop | 390 by 844 | 320 by 800 | Observable evidence |
|---|---|---|---|---|
| Usable blocks | `PARTIAL` | `PARTIAL` | `PARTIAL` | One-main-job-per-half-day is clear, but the page has no explicit four-day extension or count |
| Pool role | `YES` | `YES` | `YES` | Pool is a full block; property access, season and exact operations remain verification items |
| Base type | `PARTIAL` | `PARTIAL` | `PARTIAL` | Center and South Strip tradeoffs are clear, but no rule joins fixed central anchors to one base versus a pool-property move |
| Occupancy and room setup | `YES` | `YES` | `YES` | Named candidates expose known room shapes, occupancy where supported, and exact-room unknowns |
| Current checks | `YES` | `YES` | `YES` | The cluster preserves exact route, transfer, parking, pool eligibility, room and complete-total checks |
| Removal decision | `YES` | `YES` | `YES` | Remove one sightseeing block rather than squeezing pool or transfer between tickets |

## Friction And Trust Checks

- **Buried answer:** The itinerary-to-base handoff is 8.5 mobile viewports down at 390 and 10.0 at 320. The activity-to-itinerary return is 13.9 and 15.6 viewports down.
- **Unnecessary detour:** The hotel-to-activity transition has no contextual link and uses the global destination navigation. This is a route cost, not a broken path.
- **Repetition or contradiction:** None found. Itinerary, area, hotel, and activity ownership is consistent.
- **Unsupported certainty:** None required for task completion. Pages label estimates, rough totals, sampled review themes, guest-access unknowns, and exact-date checks.
- **Missing comparison:** The four-day case lacks one explicit base consequence tying fixed central anchors to a separate South Strip pool block.
- **Evidence traceability:** Activity and hotel decisions expose official-source links, checked dates, confidence or evidence class, conflicts, and unknowns where relevant.
- **Unknown recovery:** The cluster tells the family to verify exact hotel entrance, pool eligibility/operation, room type/occupancy, parking, transport, weather, ticket rules, and complete totals.

## Reusable Lesson

A cluster can own every fact and still leave a real family decision partially unfinished. Cross-page QA should test the consequence that connects pages: `this pool consumes a block and may change the base`, not merely whether separate pages mention pools, areas, rooms, and costs. The smallest useful improvement is often a contextual decision handoff near the triggering rule, not more entities or another URL.

## Next Falsification

Reject the future handoff hypothesis if an independent reviewer can complete Case B directly without extrapolating a fourth day or inventing a one-base/split rule; if current community or query evidence shifts toward standalone attraction discovery; if a contextual handoff would displace more important itinerary evidence; or if later behavior/user evidence shows the deep cluster route is preferred. Any implementation requires a separately selected action, exact wording/source review, task improvement measurement, and normal release gates.
