# San Antonio Cross-Page Trip-Shape Task Review

Reviewed: 2026-09-04

Action: `FT-RES-031` / `SRR-052`

Review: Ohm (`01a06d6c-4316-74c3-a79c-61a5dfa1de77`) cycle-two `PASS_WITH_P3`; no P0-P2 remain; one pre-existing scroller-accessibility P3 remains. Docs-only action commit: `b49a53384f4fb73fcfef33d5719a35d21e10f3bd`.

Targets:

- https://familytripwise.com/things-to-do/san-antonio-with-kids.html
- https://familytripwise.com/family-itinerary/san-antonio-with-kids.html
- https://familytripwise.com/where-to-stay/san-antonio-with-kids.html
- https://familytripwise.com/where-to-stay/san-antonio-family-hotels.html
- https://familytripwise.com/things-to-do/san-antonio-with-teens.html

Evidence level: `proxy-reviewed`. This is a structured expert walkthrough of live desktop and mobile pages. It is not observation of parents, user testing, behavior-supported evidence, satisfaction evidence, or a search-ranking result.

## Decision

The seven requested planning outputs are recoverable, but the joined journey is `PARTIAL`.

The all-ages guide can reduce the activity set to one paid anchor and one indoor or free fallback. The itinerary supplies a realistic two-day shape, a protected reset, a deletion rule, and condition pivots. The stay guide supports a provisional Downtown base while keeping the Broadway/Brackenridge alternative and exact route open. The hotel page exposes Home2 as the sole occupancy-qualified five-person start in the visible evidence because some public two-queen-and-sofa inventory lists up to six. Embassy Suites is a separated-space comparison whose exact suite beds and registered occupancy remain unknown until booking verification. The stay and itinerary pages support a car-light Downtown hypothesis plus a deliberate car, rideshare, or current VIA check for the non-Downtown day. No contradictory, safety, firsthand, or guaranteed-route claim is needed.

The cross-page handoff is the material friction. Starting from activities, the itinerary route is nearby. After the day shape is chosen, however, the itinerary's activity and stay links begin 5.8-5.9 desktop viewports, 8.9-9.5 viewports at 390 pixels, and 10.4-11.1 viewports at 320 pixels down the page. The stay guide's correct post-area hotel link begins 4.9, 7.0, and 8.0 viewports down. The family can finish the task, but it must carry the settled days and constraints through two deep handoffs. The fixed-base control avoids a lodging detour, yet its activity route is the same deep itinerary handoff.

Preserve all five pages and URLs. Retain one bounded, unselected future hypothesis: immediately after the itinerary's day-plan cards, expose one compact conditional next step. `Need an anchor?` routes to the existing all-ages activity guide only when the anchor remains open. `Still choosing lodging?` routes to the existing stay-area guide only when the base remains open. A family with a chosen anchor or fixed base should continue without reopening that decision. This should reuse existing sibling routes, add no inventory or new page layer, and avoid duplicating the later cluster navigation. It is not selected or implemented in this transaction.

## Family Cases

### Primary: mixed-generation short trip with an open base

A party of five includes two children around ages three and six plus an older adult. It has two full sightseeing days within a two- or three-night stay, no fixed hotel, and no theme park as a required anchor. It needs:

1. one realistic day shape with a protected reset;
2. one paid anchor;
3. one free or indoor heat fallback;
4. one defensible provisional base;
5. one room setup that may legally and functionally hold five, subject to exact booking verification;
6. one transport hypothesis rather than a route guarantee;
7. exact current checks before booking the day and room.

The walkthrough uses GO RIO as the paid Downtown anchor, Witte as the indoor heat alternative, and the itinerary's bounded Downtown plus age-led day. Downtown is provisional because it owns the first-day anchors and exposes one occupancy-qualified party-five room start plus other setup comparisons; the Witte day still requires an exact non-Downtown route. This is a test plan, not a recommendation or a claim that either attraction, base, room, or transport choice fits every family.

### Control: fixed River Walk base and no car

A family with school-age children already has a River Walk hotel and no-car plan. It needs a two-day shape, one paid anchor, one heat fallback, one deletion rule, a current transport check, and no instruction to reopen the settled area or hotel choice.

The control starts on the itinerary. It uses the Downtown day plus one age-led day, follows only the activity route, and treats current VIA or appropriately sized rideshare plus the exact hotel entrance as checks. The optional stay and hotel cards do not force a lodging detour.

## Evidence Inventory

| Evidence | Date | Class | Use | Limitation |
|---|---|---|---|---|
| [San Antonio all-ages activity guide](https://familytripwise.com/things-to-do/san-antonio-with-kids.html) | Inspected 2026-09-04; visible sources checked 2026-07-26 | Live page/interface evidence | Anchor, heat/free fallback, age, cost, area, friction and early itinerary route | Does not sequence the full trip or choose a hotel |
| [San Antonio itinerary](https://familytripwise.com/family-itinerary/san-antonio-with-kids.html) | Inspected 2026-09-04; visible sources checked 2026-07-27 | Live page/interface evidence | Day shape, reset, deletion, weather/budget/base pivots and sibling links | Planning shapes are not timed routes; sibling links are deep |
| [San Antonio stay-area guide](https://familytripwise.com/where-to-stay/san-antonio-with-kids.html) | Inspected 2026-09-04; visible sources checked 2026-07-26 | Live page/interface evidence | Five base starts, matrix, reset/transport limits, exact checks and hotel handoff | Area guidance does not establish an exact room or travel time |
| [San Antonio family-hotel guide](https://familytripwise.com/where-to-stay/san-antonio-family-hotels.html) | Inspected 2026-09-04; facts/prices/reviews checked 2026-07-26 | Live property/interface evidence | One occupancy-qualified party-five start, other setup comparisons, broad price and current checks | Exact inventory, registered occupancy, price and operations require exact-date verification |
| [San Antonio teen guide](https://familytripwise.com/things-to-do/san-antonio-with-teens.html) | Inspected 2026-09-04; visible sources checked 2026-07-27 | Live page/interface control evidence | Confirms the older-child specialist and all four sibling routes | Not required by either tested case |
| `FT-RES-030` / `LRN-018` | 2026-09-04 | Current-question synthesis | Source of the mixed-generation task and fixed-base control | Four questions do not establish prevalence or demand |
| `ops/gsc-snapshots/2026-09-04.*` | Collected 2026-09-04; finalized through 2026-09-02 | Fresh authenticated API, public-safe | Current index/crawl and measurement boundary | No aligned query cohort; orientation only |

## Observable Route

The primary normal-link route is all-ages activities to itinerary to stay areas to family hotels. The first link is an early contextual action. The second and third transitions use the existing late cluster handoffs. The hotel page's Home2 start supplies the sole occupancy-qualified candidate in visible evidence: some public two-queen-and-sofa inventory lists up to six. Embassy Suites supplies only a door-separated setup comparison because its exact suite beds and occupancy remain unknown. Both require the exact room, beds, registered occupancy, price and current conditions to be checked before booking.

The control route is itinerary to all-ages activities. It does not open either lodging page. The itinerary's base row says to keep first and last blocks near the chosen base, while its activity route allows the family to select the anchor and fallback without changing lodging.

All three exact browser viewports matched the requested `innerWidth` and `innerHeight`. Document-level horizontal overflow was zero on all four primary pages. Comparison tables scroll inside bounded containers at both mobile widths; only the itinerary container has a programmatic region label, while the activity, stay and hotel scrollers are visually bounded but unlabelled. This is a P3 accessibility note, not evidence of document overflow or a second selected candidate. Normal links resolved to the intended live canonical pages.

| Page | Decision surface | 1280 by 900 | 390 by 844 | 320 by 800 |
|---|---|---:|---:|---:|
| Activities | Planning stance | 1.5 viewports | 1.7 | 1.9 |
| Activities | Early itinerary link | 1.7 | 2.4 | 2.7 |
| Itinerary | Day routes | 2.1 | 2.7 | 3.1 |
| Itinerary | Activity link | 5.8 | 8.9 | 10.4 |
| Itinerary | Stay-area link | 5.9 | 9.5 | 11.1 |
| Stay areas | Five base starts | 1.6 | 1.8 | 2.1 |
| Stay areas | Area matrix | 2.4 | 3.1 | 3.7 |
| Stay areas | Post-area hotel link | 4.9 | 7.0 | 8.0 |
| Hotels | Party-five Home2 start | 2.2 | 3.6 | 4.2 |
| Hotels | Home2 comparison row | 3.8 | 5.7 | 6.5 |
| Hotels | Home2 evidence card | 5.8 | 8.4 | 9.6 |

Viewport ratios are the element's document top divided by the confirmed viewport height, rounded to one decimal. They measure information position, not reading time, attention, abandonment, or preference.

## Required Outputs

The evidence available for an output is the same across viewports. Mobile position changes retrieval effort, recorded separately above.

Depth is classified from the task's starting page. `DIRECT` means the output is on that page without a page transition. `NEARBY` means one explicit task-labelled transition begins within three viewports. `DEEP` means the required explicit task-labelled transition begins after five viewports or the output requires two or more page transitions. These are reproducible route labels, not attention or abandonment measures. The primary route uses three page transitions to reach the hotel page, plus one in-page Home2 anchor. The fixed-base control uses one page transition from itinerary to activities and no lodging transition.

### Primary case

| Required output | Result | Transitions | 1280 depth | 390 depth | 320 depth | Answer location and boundary |
|---|---|---:|---|---|---|---|
| Realistic day shape | `YES` | 1 | `NEARBY` | `NEARBY` | `NEARBY` | Itinerary: one Downtown context day plus one age-led anchor day, protected reset and stop rule |
| Paid anchor | `YES` | 0 | `DIRECT` | `DIRECT` | `DIRECT` | Activities: GO RIO is marked paid, Downtown and weather-dependent; exact operation and wait remain open |
| Free or indoor heat fallback | `YES` | 0 | `DIRECT` | `DIRECT` | `DIRECT` | Activities: Witte is a broad indoor option; Hemisfair is free but remains weather-dependent |
| Provisional base | `YES` | 2 | `DEEP` | `DEEP` | `DEEP` | Stay matrix: Downtown is defensible for the first-day anchors and one occupancy-qualified party-five room start; Broadway remains an alternative until exact room and return checks |
| Functional five-person room hypothesis | `YES` | 3 | `DEEP` | `DEEP` | `DEEP` | Hotels: Home2 lists some two-queen-and-sofa inventory up to six. Embassy is only a separated-space comparison until exact suite occupancy is confirmed; exact registered occupancy and beds are mandatory checks |
| Transport hypothesis | `YES` | 2 | `DEEP` | `DEEP` | `DEEP` | Stay/itinerary: car-light Downtown may work, with a deliberate car, rideshare or current VIA check for Witte and every return; no exact route is claimed |
| Exact next checks | `YES` | 3 | `DEEP` | `DEEP` | `DEEP` | Page-visible checks cover weather, operations, tickets, hotel entrance, exact room/beds/occupancy, total, parking, current service and return |

### Fixed-base control

| Required output | Result | Transitions | 1280 depth | 390 depth | 320 depth | Answer location and boundary |
|---|---|---:|---|---|---|---|
| Realistic day shape | `YES` | 0 | `DIRECT` | `DIRECT` | `DIRECT` | Itinerary: Downtown day plus one age-led day and optional finish |
| Paid anchor | `YES` | 1 | `DEEP` | `DEEP` | `DEEP` | Activities: paid options are explicit and reducible to one; the task-labelled itinerary link begins after five viewports at all three sizes |
| Heat fallback | `YES` | 1 | `DEEP` | `DEEP` | `DEEP` | Activities and itinerary: Witte or another current indoor choice replaces the outdoor block |
| Keep settled base | `YES` | 0 | `DIRECT` | `DIRECT` | `DIRECT` | Itinerary treats the chosen base as an input; lodging links remain optional |
| Transport hypothesis | `YES` | 0 | `DIRECT` | `DIRECT` | `DIRECT` | Current VIA or an appropriately sized rideshare is a hypothesis to verify, not a guarantee |
| Deletion rule | `YES` | 0 | `DIRECT` | `DIRECT` | `DIRECT` | Remove the optional finish or add-on before the reset, meal or return |
| Exact next checks | `YES` | 1 | `DEEP` | `DEEP` | `DEEP` | Itinerary provides route/return checks directly; activities supplies the exact venue/weather checks through the late task-labelled link |

## Protocol Matrices

### Primary case

| Step | Result | Evidence |
|---|---|---|
| Start | `YES` | The activity planning stance and early itinerary link appear before the long comparison layer |
| Reduce | `YES` | One paid anchor, one fallback and one two-day shape reduce the activity universe |
| Compare | `YES` | Activity, area and hotel tables expose the decisive fields for the remaining starts |
| Trace | `YES` | Research labels, checked dates, estimates, review-signal boundaries, conflicts and exact unknowns remain distinct |
| Decide | `YES` | A provisional Downtown plus occupancy-qualified Home2 candidate can be stated; Embassy remains only a setup comparison and the Witte-day route stays conditional |
| Verify | `YES` | Current attraction, route, room, occupancy, price and transport checks are explicit |
| Recover | `PARTIAL` | Correct siblings exist, but the itinerary-to-stay and stay-to-hotel transitions are deep and require carrying the settled plan across pages |

### Fixed-base control

| Step | Result | Evidence |
|---|---|---|
| Start | `YES` | Day-length starts immediately distinguish one, two and three days |
| Reduce | `YES` | The two-day route and one-anchor rule prevent cross-city stacking |
| Compare | `YES` | The activity page compares age, time, cost, area, weather role, friction and current check |
| Trace | `YES` | Planning estimates and current official checks are labelled |
| Decide | `YES` | The family can keep the River Walk base and choose one paid anchor plus fallback |
| Verify | `YES` | Current service, entrance, weather, ticket and return checks are explicit |
| Recover | `PARTIAL` | No lodging restart is required, but the itinerary's relevant activity link is 8.9-10.4 mobile viewports down |

## Finding

### P2 hypothesis: the day-plan-to-next-decision handoff is materially buried

The itinerary's main product is the day shape. Once that decision is made, a case with an open anchor needs the activity comparison, and only a case with an open base needs the stay guide. The explicit, task-labelled sibling routes appear only in a four-card cluster section after the route, pivot and stop-rule layers. A generic header destination link also reaches the activity hub, but it does not identify the next planning job. On mobile, the task-labelled links begin 8.9-11.1 viewports down. This does not make the component guidance wrong, but it makes the joined task depend on remembering the settled day shape through avoidable navigation depth.

Smallest future candidate, not selected here:

- add one compact conditional next-step line immediately after the existing day-plan cards;
- use `Need an anchor?` to link to the all-ages activity guide only when that decision remains open;
- use `Still choosing lodging?` to link to the stay-area guide only when that decision remains open;
- let a family with a chosen anchor or fixed base continue without reopening either decision;
- avoid a new card, section, control, inventory item, URL, claim, or duplicate late navigation path;
- preserve all itinerary content, evidence, schema, title, URL and search state.

This is a proxy-review usability hypothesis. It does not prove abandonment, confusion, satisfaction, conversion, ranking benefit, or a preferred design.

## Reusable Lesson

Cross-page task review should score two things separately: whether the evidence can produce the answer and whether the page carrying the current decision exposes the correct next sibling at that point. Complete component pages can still form a partial journey when a conditional handoff is buried after the decision it is meant to continue.

## QA Before Independent Review

- Focused San Antonio page tests pass 22/22; the full repository suite passes 162/162.
- Operator-state and content-freshness QA pass. Local and production SEO report 0 errors and 0 warnings. All 53 public GSC snapshot files validate.
- Exact browser clicks reproduce the primary four-page route, Home2 anchor, and fixed-base itinerary-to-activity control at 1280 by 900, 390 by 844 and 320 by 800. Requested and reported viewport dimensions match; tested documents have zero horizontal overflow.
- Strict roadmap JSON has 82 unique action IDs. The working diff matches the ten registered paths exactly, contains no `site/**` path, and passes whitespace checks.
- Ohm cycle one reproduced the route and QA but returned `FAIL` for three P2 evidence/candidate defects plus three P3 precision issues. Cycle two verified all six corrections and returned `PASS_WITH_P3`: no P0-P2 remain, and one pre-existing P3 remains because the activity, stay and hotel comparison scrollers are bounded but lack the itinerary scroller's keyboard/region labelling.

## Next Falsification

Reject the candidate if an independent reviewer completes both cases without the late handoff, if placing a route after the day cards distracts from the higher-value condition pivot, if the only clean implementation duplicates navigation, or if later behavior/user evidence prefers the current sequence. Any implementation requires a separate selected action, before/after route-position and task checks, full QA, independent review and the normal release gate. Search interpretation remains blocked without a finalized aligned query cohort and current crawl evidence.
