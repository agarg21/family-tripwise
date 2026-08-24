# San Diego Mission Bay Versus LEGOLAND Stay-Shape Review

Reviewed: 2026-08-24

Action: `FT-RES-018`

Target: https://familytripwise.com/where-to-stay/san-diego-family-hotels.html

Evidence level: `proxy-reviewed`. This is a source-grounded expert task walkthrough. No parent was recruited or observed, and the result does not establish preference, satisfaction, booking behavior, demand, or conversion.

## Decision

The page is strong at hotel facts but only `PARTIAL` at the cross-hotel stay-shape decision raised by current parent questions. A reader can find Mission Bay candidates, a clearly bounded LEGOLAND hotel role, room and occupancy checks, rough price context, parking, review conflicts, direct Maps links, and the shared cluster map. The page does not answer whether to keep one Mission Bay base or accept a hotel move for a short North County split. It also does not give one concise bay-versus-ocean interpretation; those roles are distributed across several trip-style and property records.

This is not a reason to add hotels, a page, a filter, or another long comparison. Promote one later copy-only candidate, `IMP-045`: use the existing four-field comparison snapshot and existing Mission Bay/LEGOLAND trip-style copy to expose one bounded base-versus-split rule and one bay-versus-ocean distinction. Replace the redundant `Hotels covered / 12 options` snapshot field instead of adding a fifth field or a new card layer.

Do not implement `IMP-045` in this transaction. `FT-IMP-023` was released on August 22, and the latest GSC window contains no complete finalized post-release day or post-release crawl. The task finding can justify a later usefulness change, but it cannot be presented as a ranking diagnosis or measured page result.

## Evidence Inventory

| Evidence | Date | Class | Use | Limitation |
|---|---|---|---|---|
| Live production page at desktop and 390-by-844 mobile | 2026-08-24 | Direct interface evidence | Section order, visible labels, route length, comparison fields and source traceability | Shows the interface, not actual behavior |
| `ops/gsc-snapshots/2026-08-24.*` | Collected 2026-08-24; finalized through 2026-08-22 | Fresh authenticated API, public-safe | Confirms indexability context and current measurement boundary | Page averages only; no aligned query cohort or post-release crawl |
| [Family vacation stay](https://www.reddit.com/r/asksandiego/comments/1quvhqr/family_vacation_stay/), [hotel recommendations with ages 2 and 4](https://www.reddit.com/r/asksandiego/comments/1rabi54/hotel_recommendations_1_week_with_wife_2_boys/), [family-friendly hotel for five](https://www.reddit.com/r/asksandiego/comments/1rjc3kh/family_friendly_hotel/), and [Sunset Cliffs versus Mission Bay with a toddler](https://www.reddit.com/r/asksandiego/comments/1ud77ec/is_sunset_cliffs_a_good_area_to_stay_for_a_family/) | Published 2026-02-03 through 2026-06-23; checked 2026-08-24 | Qualitative community evidence | Reveals combinations of downtime, water access, food, capacity, parking and attraction-location questions | Anecdotal and self-selected; no copied text, identity, prevalence or verified experience |
| `docs/research/san-diego-family-hotel-evidence-pack.md` | Official facts refreshed 2026-08-17; review samples 2026-07-18 to 2026-07-21 | Maintained internal evidence synthesis | Room, pool, kitchen, parking, location, conflict and unknown fields | Rough July prices remain orientation; review samples are directional |
| `docs/research/san-diego-family-hotels-persona-task-review-2026-08-22.md` | 2026-08-22 | Prior proxy review | Defines task method and confirms the trip-style surface now starts inside the first mobile viewport | Did not test the cross-card one-base-versus-split decision |

## Explicit Family Task

Scenario: a first-time family plans a San Diego trip with one LEGOLAND day and several city/coastal days. They want hotel downtime, need a room that actually fits their party, care about parking and the rough room-night total, and are unsure whether to keep one Mission Bay base or move for a short North County stay. Child ages and trip length are deliberately unspecified because the decision rule should expose which missing details change the answer rather than invent a representative family.

Required outputs:

1. A clear rule for when to compare one Mission Bay base and when to compare a short LEGOLAND split.
2. No more than three Mission Bay starting shapes, with the constraint that distinguishes them.
3. A bounded LEGOLAND hotel role that does not imply it is the default San Diego base.
4. A concise distinction among Mission Bay/bay access, bay-plus-Pacific-Beach access, and direct ocean-beach roles without asserting water safety or suitability.
5. The exact unknowns to verify: room capacity and bedding, total with parking and fees, date-specific drive/traffic, park package terms, and current water/operating conditions where relevant.

## Walkthrough

### Desktop

- The trip-style heading begins around 777 pixels. Mission Bay and LEGOLAND starts appear in the same first trip-style row, so both candidate roles are discoverable without scanning hotel details.
- `Mission Bay water time` names six different hotel shapes. This is useful inventory but does not reduce the scenario to three starts or say when a city base should beat a room move.
- `LEGOLAND-heavy trip` correctly says to use the hotel when the park is the anchor and to compare package, tickets and parking as one total. The detailed record adds the separate kids sleeping area, capacity, parking, breakfast, activity and value conflicts.
- The comparison table begins around 2,454 pixels, the shared map around 4,108 pixels, detailed records around 5,124 pixels, and the LEGOLAND detailed record around 8,048 pixels. A user seeking a cross-property stay sequence must combine several separated layers.
- No page text explicitly says `one base` or `split stay`, and no stable distance or drive-time cue is present. That omission is safer than inventing a drive promise, but it leaves the decision unfinished.

### Mobile, 390 by 844

- The trip-style heading begins at 671 pixels and the first card at 736 pixels, preserving the `FT-IMP-023` improvement with no horizontal page overflow.
- The Mission Bay card occupies about 213 pixels and the LEGOLAND card begins around 1,344 pixels. Both roles are available early, but the reader still has to infer the relationship between them.
- The hotel comparison begins around 3,078 pixels, the map around 4,691 pixels, and detailed hotel records around 5,540 pixels in an approximately 23,410-pixel document. The missing issue is not that the first choice is buried; it is that the existing early cards do not express a cross-card decision rule.
- The mobile page exposes no literal `one base` or `split stay` language and no exact distance/time claim. The latter should remain date-specific and verify-before-deciding rather than becoming a fixed promise.

## Output Matrix

| Required output | Result | What the page currently provides | Missing work |
|---|---|---|---|
| One base versus split rule | `NO` | Separate Mission Bay and LEGOLAND trip-style starts | A concise relationship between the two starts |
| Up to three Mission Bay starts | `PARTIAL` | Six named shapes plus normalized table/details | A scenario-specific reduction requires manual scanning |
| Bounded LEGOLAND role | `YES` | Park-anchor language, package/parking checks, North County label and review conflict over stay length/value | Preserve; do not broaden into a universal recommendation |
| Bay versus ocean distinction | `PARTIAL` | Mission Bay, bay-plus-Pacific-Beach and direct beach roles are named across cards | One concise interpretation without water-safety or suitability claims |
| Verification and uncertainty | `YES` | Capacity, bedding, parking, fee, package, condition and cancellation checks are unusually explicit | Add only date-specific drive/traffic to the decision handoff |

Overall result: `PARTIAL`. The page contains the evidence needed to research the decision but does not synthesize the relationship among the relevant stay shapes.

## Finding

### P2: Cross-Card Stay Sequencing Is Left To The Reader

The current page optimizes each hotel record independently. The current parent-question bundle is about the trip shape: whether a park-proximity night is worth the cost and friction of changing hotels when most days are elsewhere. A reader can reconstruct that decision, but the page does not do the synthesis it is meant to add over raw hotel pages and forum answers.

Smallest later change:

- keep the six-card trip-style grid, four-field comparison snapshot, 12-row table, map, 12 hotel records and every evidence boundary;
- replace the redundant `Hotels covered / 12 options` snapshot field with `One base or split?` and a compact editorial comparison that treats Mission Bay as the one-base candidate when the city/coastal itinerary dominates, and a short North County split as a comparison when LEGOLAND anchors the trip and the family values park-hotel downtime enough to accept a room move;
- amend the existing Mission Bay/LEGOLAND handoff, or the existing location-view field, to distinguish bay, bay-plus-Pacific-Beach and direct ocean-beach roles without claiming water safety, calmness, stroller practicality or exact travel time;
- require the reader to verify date-specific drive/traffic, room capacity, package terms and all-in total before deciding.

The wording must remain an editorial planning framework, not a prediction that one shape is best for a family.

## Why Not Edit Now

- `FT-IMP-023` is only two days old and has no complete finalized post-release GSC day or post-release crawl. This does not block a verified material defect, but it raises the evidence bar for another immediate change.
- The current task failure is proxy-reviewed and grounded in four qualitative question sources; it is not user-tested or a demand estimate.
- The later candidate should first be independently reproduced and then selected as a separate action with exact copy, generator/test scope and before/after task checks.

## Promoted Candidate

Promote `IMP-045`, unselected: **Expose the San Diego one-base-versus-LEGOLAND-split rule without adding a page layer.**

Acceptance for a later implementation:

- the first two mobile viewports expose one bounded base-versus-split comparison without adding a fifth snapshot tile, seventh trip-style card, new filter, hotel, page or long prose section;
- the low-information `Hotels covered / 12 options` field is replaced rather than expanding the snapshot grid;
- the Mission Bay and LEGOLAND roles, bay/ocean distinction and required unknowns are clear without exact drive, water-suitability, safety, quiet, route or family-fit claims;
- the six trip-style cards, 12 hotels, table, map, details, prices, review conflicts, sources, title, H1, URL, canonical, indexability, sitemap and `ItemList` parity remain;
- this exact task improves from `PARTIAL` to `YES` and scenarios S1-S5 remain no worse on desktop, 390-pixel and 320-pixel checks;
- GSC remains observation only until a later crawl and aligned finalized query cohort exist.

## Reusable Lesson

For hotel pages, compare stay shapes across properties, not only properties within a list. A maintained evidence layer creates more user value when it turns location, downtime, room setup and transfer friction into one bounded planning rule. Do this by replacing low-information interface text before adding another card or prose section.

## Falsification Triggers

- An independent reviewer can complete the one-base-versus-split decision from the current first two mobile viewports without inference or unrelated scanning.
- Current SERP/query evidence shows the bundled decision belongs cleanly on the area page rather than the hotel page.
- A later behavior-supported or real-user test shows the extra rule increases confusion or reduces trust.
- Current official route or hotel evidence cannot support even a bounded, verify-before-deciding framework without implying exact travel or family suitability.
