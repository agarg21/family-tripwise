# Las Vegas Family-Of-Five Room-Fit Task Review

Reviewed: 2026-09-15

Action: `FT-RES-043` / `SRR-065`

Learning unit: `LRN-032`

Target: https://familytripwise.com/where-to-stay/las-vegas-family-hotels.html

Evidence level: `proxy-reviewed`. This is a source-bounded task walkthrough of the live page plus a current first-party room-category audit. It is not user testing, behavior-supported evidence, satisfaction evidence, a booking quote, or a search-ranking result.

## Decision

The family-of-five task is `PARTIAL` and reproduces one P2 decision defect.

The page can route this family away from ordinary four-person rooms and toward four plausible suite properties. It also supplies rough total-night ranges, non-gaming or away-from-casino context for some options, pool roles, Maps links, current-check prompts, evidence labels, and a source register. It cannot reduce those four properties to two or three occupancy-supported options, name the lowest room category that officially carries five people, or support a provisional booking choice without reconstructing current room records elsewhere.

Current official sources show that a compact answer is maintainable. Tahiti Village's two-bedroom Royal Tahitian accommodates up to eight, and Hilton Grand Vacations lists Cancun's two-bedroom suites for four to six and penthouse suites for six to eight. Marriott's current room modal lists its one-bedroom villa for four and its two-bedroom villa for up to eight; its FAQ lists the three-bedroom villa for up to 12. Vdara's Studios and one-bedroom suites max at four; its two-bedroom luxury suites max at six.

Retain one unselected `IMP-055` candidate: replace the low-information `Hotels covered / 10 options` snapshot field with a compact five-plus-person room branch and align only the four decision-active room facts in the validated evidence layer and cards. Add no comparison column, hotel, card, page, URL, inventory claim, price promise, or casino-path conclusion. A separately selected implementation would name Grand Chateau's two-bedroom villa as a third supported start and tell the family to compare the same-date, same-occupancy final total.

## Family Task

Starting state:

- two adults and three children;
- one officially supported room is preferred;
- a clearly named larger-suite or two-room fallback is acceptable;
- the family wants a mid-range rough total;
- the property should be non-gaming or have a short casino path;
- no child ages, dates, bedding preference, or exact budget are supplied, so those remain unknown.

Required output:

1. reduce ten hotels to at most two or three plausible starts;
2. identify a supported five-person room category or an explicit fallback;
3. compare rough total posture and the lower-gaming setting without inventing an exact price or route;
4. make one defensible provisional choice;
5. name the next booking-time verification step.

Success requires visible page evidence. Bed count, square footage, `suite`, `villa`, or `family` wording cannot substitute for registered occupancy.

## Evidence Inventory

| Evidence | Source date | Class | Use | Limitation |
|---|---|---|---|---|
| Live Family Tripwise target | Facts, prices, and reviews checked 2026-07-22; inspected 2026-09-15 | `LIVE_PAGE_INTERFACE` | Visible route, room facts, prices, evidence labels, source links, and task depth | No behavior, satisfaction, or booking conversion evidence |
| Vdara hotel and room pages | Inspected 2026-09-15 | `CURRENT_OFFICIAL_ROOM_SOURCE` | Named room categories and maximum guests | Availability and total price vary by dates; casino paths were not measured |
| Marriott's Grand Chateau rooms page and FAQ | Inspected 2026-09-15; independently rechecked 2026-09-15 | `CURRENT_OFFICIAL_ROOM_SOURCE` | Named one-, two-, and three-bedroom villa capacities | Availability, bedding use, and final total remain dynamic |
| Tahiti Village current suites page | Inspected 2026-09-15 | `CURRENT_OFFICIAL_ROOM_SOURCE` | Named suite capacities and room relationships | Booking availability and final total remain dynamic |
| Hilton Grand Vacations Cancun resort page | Inspected 2026-09-15 | `CURRENT_OFFICIAL_ROOM_SOURCE` | Named accommodation families and guest ranges | Hilton's initial public rooms rendering omits the details; the current first-party HGV accommodation record supplies them |
| `FT-RES-042` / `LRN-031` | 2026-09-15 | `CURRENT_SERP_AND_PAGE_SYNTHESIS` | Source of the family-of-five falsification task | Bounded result sample; no demand or behavior measure |
| `ops/gsc-snapshots/2026-09-14.*` | Collected 2026-09-14; finalized conservatively through 2026-09-12 | `RECENT_REUSED_AUTHENTICATED_API` | Crawl and visibility boundary | No aligned public query cohort; cannot select this task or a search edit |

## Visible Page Route

The same source order is present at all three tested widths. Images were allowed to settle before measurement.

| Surface | 1280 by 900 | 390 by 844 | 320 by 800 |
|---|---:|---:|---:|
| Trip-style starts | 1,956px / 2.17 viewports | 2,426px / 2.87 | 2,582px / 3.23 |
| Quick comparison heading | 2,758px / 3.06 | 3,631px / 4.30 | 4,004px / 5.01 |
| Detailed-card heading | 4,119px / 4.58 | 4,950px / 5.86 | 5,375px / 6.72 |
| Vdara card | 5,173px / 5.75 | 7,571px / 8.97 | 8,379px / 10.47 |
| Grand Chateau card | 5,173px / 5.75 | 8,834px / 10.47 | 9,804px / 12.26 |
| Tahiti Village card | 6,108px / 6.79 | 10,097px / 11.96 | 11,259px / 14.07 |
| Cancun Resort card | 6,108px / 6.79 | 11,384px / 13.49 | 12,781px / 15.98 |

Document widths equal the requested viewport widths with no page-level horizontal overflow. The 1,180-pixel comparison table fits desktop and is contained in its existing horizontal scroller on mobile: 352 visible pixels at 390 and 282 at 320. The measured document heights are 10,380px, 20,223px, and 22,943px respectively.

Depth does not create the defect by itself. The problem is that reaching all four detail cards still does not expose a comparable five-person occupancy field or one-room fallback.

## Page-Only Task Score

The scores are stable across viewports; mobile depth changes effort, not whether the evidence exists.

| Step | Result | Observable page evidence |
|---|---|---|
| Start | `PARTIAL` | Five trip-style pairs give useful central-suite and off-Strip-water starts, but family size is not an input or visible early rule. |
| Reduce | `PARTIAL` | The page can discard ordinary four-person choices and leaves Vdara, Grand Chateau, Tahiti Village, and Cancun as plausible suite paths. It cannot reduce those four to at most three occupancy-supported choices. |
| Compare | `PARTIAL` | Rough total, area, suite shape, kitchen, laundry, water feature, and some lower-gaming context are present. Registered occupancy and room separation are not comparable across the remaining properties. |
| Trace | `YES` | Official facts, online-review themes, estimates, conflicts, checked date, method, and the source register are distinguished. |
| Decide | `NO` | No remaining candidate has a visible page-supported five-person room category, so a provisional booking choice would infer capacity. |
| Verify | `PARTIAL` | Every candidate has a nearby exact-room/final-total check and the page has official source links, but it does not name the five-plus room category to verify. |
| Recover | `PARTIAL` | The family is told to check the exact room, but not whether to move to a named larger suite, compare two rooms, or drop the property when capacity fails. |

## Current Official Room Audit

### Vdara Hotel & Spa

- Current official Studio and one-bedroom categories list maximum occupancy four.
- Current official two-bedroom Penthouse, Loft, and Hospitality Suite categories list maximum occupancy six.
- The visible Family Tripwise card correctly states that the Studio maxes at four, but `larger one-bedroom layouts are available` does not give a family of five a valid next room; the current one-bedroom categories also max at four.
- Decision boundary: Vdara is a two-bedroom luxury-suite or two-room comparison for this family, not a standard Studio or one-bedroom start. The page's `$150-$450+` rough range cannot be treated as a family-of-five two-bedroom quote.

### Marriott's Grand Chateau

- The current official page lists guest rooms and one-, two-, and three-bedroom villas, with full kitchens and washer/dryers in select villas.
- The rendered room modal lists the one-bedroom villa for a maximum of four and the two-bedroom villa for a maximum of eight. The current FAQ lists the three-bedroom villa for a maximum of 12.
- Decision boundary: the two-bedroom villa is the minimum named occupancy-supported five-person path in this audit. Verify bedding use, bedrooms, baths, availability, complete total, and valet plan for the same dates.

### Tahiti Village Resort

- The current official page lists Moorea and Bora Bora one-bedroom suites for four guests each.
- It lists the 1,551-square-foot two-bedroom Royal Tahitian, formed from connected Moorea and Bora Bora units, for up to eight guests.
- Decision boundary: the Royal Tahitian is a supported one-reservation five-person room path. Its exact availability and final total still require a date-specific check.

### Cancun Las Vegas, A Hilton Vacation Club

- The current first-party HGV record lists one-bedroom suites for two to four guests.
- It lists two-bedroom suites for four to six guests and two-bedroom penthouse suites for six to eight guests.
- Decision boundary: the two-bedroom suite is a supported five-person room path; the penthouse is a larger fallback. Exact inventory, bedding use, total, and transport remain booking-time checks.

## Defect And Candidate

Severity: `P2`.

Failed scenario and steps: a five-person family is materially blocked at `Reduce`, `Compare`, `Decide`, and `Recover`. The page's core hotel-selection role includes occupancy and exact-room checks, so this is not outside the URL's role. The source audit rejects the alternative explanation that current official capacity is too inconsistent to maintain.

Unselected `IMP-055`, if a later action selects it:

- replace `Hotels covered / 10 options` in the existing four-field snapshot with one compact `Five or more` branch;
- make Tahiti Village's Royal Tahitian, Cancun's two-bedroom suite, and Grand Chateau's two-bedroom villa the three occupancy-supported starts;
- state that Vdara Studios and one-bedroom suites max at four and require a two-bedroom luxury suite or two rooms for this task;
- align these four room facts in the validated evidence layer and existing detail cards, with one checked-date boundary;
- tell the family to compare the final total for the same dates and five-person occupancy rather than treat the broad page ranges as quotes.

Do not add a new card, section, comparison column, filter, hotel, page, URL, schema entity, fixed price, casino route, connecting-room promise, or suitability conclusion. Do not imply that a named room is bookable for the family's dates.

Future success requires `Start` and `Reduce` to reach `YES`, `Decide` to support a provisional three-option branch without a capacity inference, and `Recover` to state the exact larger-suite or two-room path. The branch should appear in the existing snapshot before the trip-style cards at all three viewports, preserve the current table scroller and zero page overflow, and leave every other hotel and page/search invariant unchanged.

## Reusable Lesson

For hotel comparisons, `suite`, bed count, and square footage are not capacity fields. A family-size branch should first separate officially supported registered occupancy from plausible room shape, then carry price and availability as same-date verification rather than blending base-room ranges with larger-suite needs. Three supported starts plus an explicit Vdara fallback can be more useful than a new table column across incomplete records.

## Next Falsification

Reject `IMP-055` if an independent reviewer completes the page-only task to two or three occupancy-supported choices without external reconstruction; a current official source removes or conflicts with the Grand Chateau, Tahiti, or Cancun capacities; the compact branch cannot fit the existing snapshot without displacing more important price/evidence information; a later aligned query or behavior signal assigns the job elsewhere; or actual user research shows a different room-fit decision is more consequential.

## GSC Boundary

No September 15 public-safe GSC snapshot was available at selection. The recent reused September 14 authenticated read-only snapshot is finalized conservatively through September 12:

- property: 1,764 impressions, 5 clicks, 0.28% CTR, aggregate average position 60.30;
- target: 117 impressions, 0 clicks, aggregate page-average position 60.20;
- target index state: submitted and indexed;
- latest recorded target crawl: September 4, 2026;
- inspected URLs: 24 of 28 indexed.

The public snapshot has no aligned query cohort. These overlapping aggregates are crawl/orientation evidence only. They do not select this task, diagnose CTR, explain Google, establish demand, or support a title, snippet, URL, indexability, or ranking action.

## Source Register

Inspected September 15, 2026:

- https://familytripwise.com/where-to-stay/las-vegas-family-hotels.html
- https://vdara.mgmresorts.com/en/hotel.html
- https://vdara.mgmresorts.com/en/hotel/two-bedroom-hospitality-suite.html
- https://www.marriott.com/en-us/hotels/lasvg-marriotts-grand-chateau/rooms/
- https://tahitivillage.com/booknow/
- https://www.hiltongrandvacations.com/en/resorts-and-destinations/las-vegas/cancun-las-vegas-a-hilton-vacation-club
- `docs/research/las-vegas-family-hotel-live-serp-review-2026-09-15.md`
- `docs/research/las-vegas-family-hotel-evidence-pack.md`
- `ops/gsc-snapshots/2026-09-14.json`

## QA And Review

Pre-review native QA is green:

- full native tests pass 164 of 164;
- operator-state and content-freshness checks pass;
- local and production SEO QA report zero errors and zero warnings;
- all 63 public GSC snapshot files validate;
- public preflight returns `200` for robots, the parsed 28-URL sitemap, and all 28 configured URLs;
- strict roadmap JSON has 98 unique action IDs and no duplicate key;
- the working tree is confined to the registered nine paths with no `site/**` or evidence-pack change;
- Vdara and Marriott block or fail the direct command-line client while their current official content was inspected through current indexed/rendered first-party pages; Tahiti Village and Hilton Grand Vacations return `200` directly;
- privacy, credential-pattern, and whitespace checks pass;
- exact settled-image browser measurements at 1280 by 900, 390 by 844, and 320 by 800 show no document overflow and contained mobile table scrolling.

Independent reviewer `01a0a53a-990b-7530-9824-f573cafee935` cycle one returned `FAIL` for one P2: the record missed Marriott's current rendered room modal, which names the two-bedroom villa at maximum occupancy eight, and therefore incorrectly left Grand Chateau as an exact-villa unknown. The official audit and all state mirrors now name the supported two-bedroom path and the candidate has three supported starts. Cycle two verified the correction, task-score boundary, all nine mirrors, exact scope, and green QA, then returned `PASS` with no P0-P3. No public page, evidence pack, URL/search state, indexing, analytics, external action, destination, community queue, or automation changed in this research transaction.

## Stop Rules

- Do not infer occupancy from beds, room size, suite/villa labels, or a booking control that is not bound to the named room.
- Do not present a broad rough range as the five-person room's price.
- Do not infer a short casino path or a quiet setting from a map or missing casino amenity.
- Do not publish the unselected candidate without a separate roadmap selection, validated evidence update, task improvement check, native QA, independent review, and normal release verification.
- Do not request indexing, install analytics, contact a property or publisher, post externally, create a destination or URL, or mutate an account or automation under this action.
