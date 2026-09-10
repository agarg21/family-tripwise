# San Diego Activity-To-Itinerary Overfilled-Draft Task Review

Date: 2026-09-10

Action: `FT-RES-039` / `SRR-061` / `LRN-028`

## Decision

`PRESERVE` both live pages, their roles, inventory, URLs, and search state. Retain one bounded, unselected implementation candidate: `IMP-052`, a compact existing-draft editing instruction near the start of the current San Diego itinerary decision surface.

The live pages contain the components needed to reduce an ambitious family plan: age and weather filters, activity durations and areas, one-anchor guidance, one-zone-per-half-day guidance, rest and stop rules, itinerary variants, explicit skips, current-check prompts, official sources, and working sibling routes. The main task can therefore reach a conditional three-block shape. It cannot complete the editing order directly. A reader must infer how to separate fixed from flexible commitments, convert 2.5 calendar days into usable blocks, reserve meals and hotel time, delete cross-zone additions, and then apply current checks from guidance spread across the two pages.

That reconstruction is a bounded P2 usefulness gap because the retained current-question evidence is existing-plan-led and the failure reproduces at all three viewports. It is not evidence for more activities, a planner, a new page, an exact route, or an immediate page edit. Missing family preferences also keep the final coast/waterfront choice conditional; `IMP-052` must not pretend to solve that input gap.

## Evidence Boundary

- Main task and control come from the privacy-safe, source-dated summaries in `docs/research/san-diego-current-family-activity-planning-questions-2026-09-10.md`.
- The walkthrough used only visible production-page information and normal links on September 10, 2026.
- Exact viewport contexts were 1280 by 900, 390 by 844, and 320 by 800. This is proxy-reviewed interface evidence, not user testing, behavior, satisfaction, conversion, demand, ranking, or CTR evidence.
- No exact drive time, route, stroller verdict, safety assurance, or firm family-fit claim is made. Missing interests, trip dates, arrival time, and weather remain unknown.
- Fresh September 10 GSC is finalized through September 8. The all-ages page has no public performance row and remains unknown to Google with no crawl; the itinerary is indexed with 81 impressions at page-average position 67.68 and an August 29 crawl. No aligned public query cohort exists, so GSC is crawl/orientation evidence only.

## Pages And Tasks

Starting page:

- `https://familytripwise.com/things-to-do/san-diego-with-kids.html`

Normal-link destination:

- `https://familytripwise.com/family-itinerary/san-diego-with-kids.html`

Main case:

- Eight travelers: four adults and four children ages 5.5 through 13.
- 2 to 2.5 days, rental cars, and a Mission Beach base.
- Existing draft combines arrival, Coronado, Point Loma, Cabrillo, Sunset Cliffs, the Zoo, Midway, Seaport Village, and downtown.
- Required output: usable blocks, one main zone or job per block, explicit meals and hotel/pool capacity, a transport assumption, deletions, and trip-date checks.

Younger-child control:

- Children nearly 3 and 5.
- Two Mission Bay nights followed by two nights near LEGOLAND.
- Zoo and LEGOLAND are fixed; one transfer day remains open.
- Required output: protect the transfer and rest load, keep at most one compatible flexible stop, and avoid turning the open block into another full attraction day.

## QA Inventory

Claims and controls checked:

- The activity page exposes an early itinerary route, age filters, visible activity attributes, current-check prompts, and official sources.
- The itinerary route opens through a normal link and provides day-shape comparison, skip guidance, rest rules, verification prompts, and a normal return route.
- The mixed-age task can reduce rather than add, while the younger-child control does not reopen fixed Zoo or LEGOLAND decisions.
- Desktop and mobile layouts have no document-level horizontal overflow; the wide itinerary table remains inside its own horizontal scroller.
- `Teen` filtering and `All` reset work at every viewport.
- Exploratory checks cover the return journey from itinerary to activities and the narrow 320-pixel table/layout boundary.

## Live Surface Measurements

Positions are measured from the top of each document after the page `load` event and confirmation that the licensed hero image is complete. They are divided by the viewport height only to describe interface depth and are not behavior evidence. Earlier pre-image measurements were invalid because neither target image reserves intrinsic space.

| Surface | 1280 by 900 | 390 by 844 | 320 by 800 |
|---|---:|---:|---:|
| Activity-page `Turn these into an itinerary` link | 1,428 px / 1.59 viewports | 1,618 px / 1.92 | 1,716 px / 2.15 |
| Activity-page deeper family-constraint router | 4,442 px / 4.94 | 8,584 px / 10.17 | 9,121 px / 11.40 |
| Itinerary quick-route heading | 1,294 px / 1.44 | 1,066 px / 1.26 | 1,068 px / 1.34 |
| Itinerary comparison heading | 1,774 px / 1.97 | 1,973 px / 2.34 | 2,100 px / 2.63 |
| Itinerary pacing-rules heading | 2,866 px / 3.18 | 3,121 px / 3.70 | 3,301 px / 4.13 |

Containment and controls:

| Check | Result |
|---|---|
| Activity document width | Matches 1,280, 390, and 320 pixel viewports; no document overflow |
| Itinerary document width | Matches 1,280, 390, and 320 pixel viewports; no document overflow |
| Itinerary table | 1,158 px wide on desktop; 1,080 px wide inside 352 px and 282 px mobile scrollers with `overflow-x: auto` |
| `Teen` filter | Active state works and leaves Zoo, Balboa Park museums, La Jolla Cove, Coronado waterfront, SeaWorld, Safari Park, and Belmont Park |
| `All` reset | Restores the unfiltered activity state at every viewport |
| Forward route | Activity page opens the correct itinerary URL through the visible normal link |
| Recovery route | Itinerary page opens the correct all-ages activity URL through the visible normal link |

Both licensed hero images load at natural size 3,766 by 2,509 but have no `width` or `height` attributes and no other intrinsic-space reservation in the target markup. Their rendered heights are 520 px, 236 px, and 189 px at the three viewports. This causes the downstream surfaces to shift by those amounts as the image settles. Record this verified technical defect for the next priority-eligible run; do not edit the site inside this research action.

The first activity-to-itinerary route is not deeply buried. The material gap is what happens after arrival: the itinerary starts with blank-slate one-, two-, and three-day shapes. Its useful reduction rules appear later and do not name existing drafts, fixed blocks, partial days, transfer days, or a cut-first order.

## Main Task Result

The page-supported conditional result is:

1. Treat arrival as a partial block and protect the Mission Beach hotel/pool or nearby reset rather than promising Coronado, Point Loma/Cabrillo, and Sunset Cliffs together.
2. Keep the Zoo as the main Balboa Park job, preserve a meal and post-anchor reset, and do not automatically add Midway, Seaport Village, and downtown.
3. Use the remaining full or partial block for one coast/waterfront choice. Which choice wins remains conditional because the retained task state gives no family preference among those payoffs.
4. Keep rental car as the supplied transport mode, but verify parking and the next exact route step rather than asserting a travel time.
5. Cut flexible cross-zone additions before adding another anchor. Verify trip-date tickets, hours, weather, parking, beach/bay status, accessibility, and route conditions at the linked official sources where available.

The current pages support this result, but only after the reviewer manually translates a calendar-day draft into the page's generic patterns. Some named draft stops do not have records or official-source routes on these two pages, so comparison and tracing remain conditional rather than invented.

| Step | Score | Evidence |
|---|---|---|
| `Start` | `PARTIAL` | The activity page states one anchor per day and links to the itinerary, but neither page begins by separating fixed commitments, usable partial blocks, and flexible draft stops. |
| `Reduce` | `PARTIAL` | `What to skip`, one-zone, and stop rules support deletion, but the reader must assemble the cut order from later surfaces. |
| `Compare` | `PARTIAL` | Day variants and visible activity fields compare included choices; several named draft stops are outside the two-page comparison, and no preference selects the final coast/waterfront payoff. |
| `Trace` | `PARTIAL` | Included anchors have official-source routes and clear estimate labels; not every named draft stop is traced on these pages. |
| `Decide` | `PARTIAL` | The pages support a defensible conditional three-block shape but cannot choose the final coast/waterfront branch without inventing a preference. |
| `Verify` | `YES` | The itinerary warning, activity logistics table, and official links identify trip-date checks and unresolved conditions. |
| `Recover` | `PARTIAL` | Forward and return links work, but draft state, fixed blocks, deletions, and unknown preferences are not carried across the transition. |

## Younger-Child Control Result

The control does not justify a larger product. The current evidence supports preserving Zoo and LEGOLAND as separate fixed major-anchor days, treating the open day as a transfer/rest block, and considering no more than one short flexible stop only after exact timing, heat, nap, and route conditions are known. The page cannot select that optional stop because arrival/transfer timing, weather, and family interest are absent; keeping the branch conditional is correct.

| Step | Score | Evidence |
|---|---|---|
| `Start` | `PARTIAL` | Zoo and LEGOLAND are visible, but the itinerary has no early fixed-anchor or transfer-day start. |
| `Reduce` | `YES` | One-anchor and big-ticket-day rules prevent adding a second major attraction and keep the open day light. |
| `Compare` | `PARTIAL` | Activity duration, age, weather, and area fields expose plausible short-stop branches, but missing transfer inputs prevent a final choice. |
| `Trace` | `PARTIAL` | Zoo, LEGOLAND, Mission Bay, and several alternatives have official checks; the exact transfer-day branch remains unknown. |
| `Decide` | `PARTIAL` | The correct decision is a light transfer/rest block with an optional conditional stop, not a named final stop. |
| `Verify` | `YES` | The pages clearly require dated hours, tickets, closures, height rules, weather, parking, and exact route checks. |
| `Recover` | `PARTIAL` | Toddler and all-ages routes exist and normal links work, but fixed anchors and the open transfer block are not carried into a single editing order. |

## Reproduced Gap

Severity: bounded `P2` usefulness gap.

The pages have the right roles and enough evidence to avoid a false or overloaded answer. They lack one early instruction for a reader who already has a draft. The interface therefore asks the reader to reverse-engineer this order:

1. Lock hotels, reservations, transport, and non-negotiable anchors.
2. Mark arrival, departure, transfer, partial, and full usable blocks.
3. Reserve meal, rest, hotel, pool, and recovery capacity.
4. Place one main zone or job in each remaining block.
5. Cut flexible cross-zone additions first.
6. Verify volatile facts and keep unsupported preference branches conditional.

This is a task-order gap, not an inventory gap. The candidate must not add Point Loma, Cabrillo, Sunset Cliffs, Midway, Seaport Village, downtown stops, route times, or a recommendation the evidence cannot support.

## Unselected Candidate

`IMP-052`: add one compact `Already have a draft?` instruction immediately under the itinerary's existing `Choose the San Diego plan that matches your family` heading and before its current quick-route cards.

Candidate content boundary:

- Separate fixed from flexible or refundable commitments.
- Convert calendar days into usable arrival, transfer, partial, and full blocks.
- Lock the stay base and transport input, then reserve meals and hotel/rest capacity.
- Assign one main zone or job per block and cut flexible cross-zone stops first.
- Recheck trip-date hours, tickets, weather, parking, accessibility, route conditions, and backups.
- Keep the current one-, two-, and three-day starts unchanged for readers building from scratch.

Do not add a card, form, planner, filter, itinerary, attraction, route time, source claim, schema entity, or URL. A later implementation must be separately selected, reviewed, and released.

Future success requires the main task's `Start`, `Reduce`, and `Recover` to improve from `PARTIAL` to `YES` without claiming to resolve the missing preference, while the younger-child control still protects its fixed anchors and does not gain a required detour. The instruction must remain before the current cards at all three viewports with no new overflow or search-surface change.

## Confidence And Falsification

Confidence is high for visible text, surface order, measured positions, link behavior, filter behavior, and containment; medium for the bounded task scores and P2 classification; low for prevalence, user behavior, satisfaction, conversion, demand, ranking, CTR, or the value of the proposed wording.

Reusable lesson: an existing-plan journey needs an editing order before generic day templates. Fixed commitments and usable capacity come first; deletion and verification come before more inventory.

Falsify or revise `IMP-052` when:

- an independent reviewer completes both cases directly without reconstructing the editing order;
- the proposed instruction merely repeats nearby visible guidance or harms the build-from-scratch path;
- a complete task input still cannot reach a defensible conditional decision after the instruction;
- real user or behavior evidence supports the current order;
- aligned query evidence establishes a different page job; or
- a verified factual, technical, accessibility, rendering, or indexability defect takes priority.

## QA And Review

- Focused San Diego tests pass `10/10`; the full native suite passes `162/162`.
- Operator-state and content-freshness checks pass. Local and production SEO report zero errors and zero warnings. All 59 public GSC snapshots validate.
- Roadmap JSON parses with 91 unique action IDs and the exact ten registered paths. Exact-scope/no-site, privacy-pattern, browser, whitespace, and unsupported-task-input checks pass.
- Rawls (`01a08c56-e133-7830-aa91-5ebb2322ec10`) cycle one returned `FAIL` for the pre-image measurements and unsupported task details. After correction, cycle two independently reproduced the settled-image positions, source-bounded inputs, all 14 scores, proportional `IMP-052`, separate technical follow-up, GSC limits, state, scope, and QA and returned `PASS` with no P0-P3. The reviewer changed no file or external state.

## Invariants

This action changes no public page, generator, test, data record, activity, itinerary, title, H1, description, URL, canonical, indexability, sitemap, schema, analytics, indexing request, outreach, external post/account, destination, community queue, or automation. `IMP-052` is unselected and is not implementation authority.
