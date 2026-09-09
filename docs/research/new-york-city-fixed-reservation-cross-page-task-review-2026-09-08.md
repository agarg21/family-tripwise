# New York City Fixed-Reservation Cross-Page Task Review

Reviewed: 2026-09-08

Action: `FT-RES-036` / `SRR-058` / `LRN-025`

Targets:

- https://familytripwise.com/things-to-do/new-york-city-with-kids.html
- https://familytripwise.com/family-itinerary/new-york-city-with-kids.html

Evidence level: `proxy-reviewed`. This is a reproducible task walkthrough of two live pages using source-grounded planning states. It is not observation of parents, user testing, behavior-supported evidence, satisfaction evidence, or a search-ranking result.

## Decision

The fixed-reservation case is `PARTIAL`; the flexible two-day control is also `PARTIAL`, but for a different reason.

The activity page exposes an early itinerary link, consistent activity fields, a one-anchor stance, harbor alternatives, pairings, and current checks. The itinerary page exposes one-, two-, and three-day starts, zone-led day shapes, arrival/departure guidance, meals/resets, deletion rules, and volatile checks. Together they support a defensible provisional edit of the fixed-reservation draft.

The material failure is at the start of that route. A family arriving with bookings and an existing five-calendar-day draft first sees only blank-slate one-, two-, and three-day starts. No early instruction separates fixed from flexible commitments or converts partial arrival/departure days into usable blocks before applying those templates. The relevant arrival/departure pivot begins 5.9 mobile viewports down at 390 pixels and 6.9 at 320; stop rules begin 7.2 and 8.4 viewports down. Completing the task therefore requires the reader to invent the fixed-versus-flexible editing sequence and carry it through later sections.

Preserve both live pages, roles, inventory, filters, URLs, and search state. Retain one bounded, unselected future hypothesis, `IMP-051`: add one compact existing-draft instruction immediately under the itinerary page's quick-route heading and before the current one-, two-, and three-day cards. It should tell a reader to distinguish fixed from movable commitments, mark usable arrival/departure/full-day blocks, assign one same-zone main job plus a meal/reset, cut flexible stops first, and verify exact terms, entrances, transit, weather, and storage. Add no form, card, filter, attraction, day template, planner, URL, or duplicate late handoff. Any implementation requires a separate selected action.

The flexible control cannot make an unconditional choice between either duplicate ferry payoff or either observation payoff because its retained source summary supplies no deciding preference. The maintained pages expose conditional comparison fields and one documented option for each decision, but the source summary does not establish which payoff the family values. That is an unresolved input and page-role boundary, not evidence that more attraction inventory is required.

## GSC Boundary

Fresh September 8 authenticated read-only API evidence is finalized through September 6. It records 1,824 property impressions, 3 clicks, aggregate average position 64.27, and 24 of 28 inspected URLs indexed. The all-ages activity page is indexed with 35 impressions at page-average position 54.37 and a September 5 crawl. The itinerary remains unknown to Google with no performance row or crawl.

All 57 public snapshots validate. The public snapshot contains no aligned query cohort, so GSC is crawl/orientation evidence only. It does not establish query rank, a CTR problem, usefulness, behavior, demand, or edit eligibility. The explicit task retained by `FT-RES-035`, not aggregate GSC, selected this walkthrough.

## Family Tasks

Both tasks use only source-supported details that change the planning decision. No username, personal identifier, private detail, or copied source passage is retained.

### Task A: fixed reservations and partial travel days

The locally retained predecessor record `NYC-D1`, dated 2026-08-01 and rechecked 2026-09-08, describes a Tuesday-to-Saturday first trip from a Midtown West base with a child nearly seven. It includes partial arrival and departure days at Penn Station, a fixed dinner, a baseball game, an AMNH anchor, a harbor tradeoff, breaks and burnout concerns, and final-day luggage friction. The local record does not retain an exact chronology for those commitments, so this task does not invent one.

Required outputs:

1. separate hard commitments from flexible stops;
2. distinguish the two partial travel days from the full usable days;
3. keep one zone and one main job per usable block;
4. choose one provisional harbor payoff;
5. place meals or hotel resets around the fixed anchors;
6. name the first flexible deletions; and
7. route the exact ticket, entrance, transit, weather, storage, and luggage checks without asserting current conditions.

### Task B: flexible two-day control

The locally retained predecessor record `NYC-D3`, dated 2026-06-12 and rechecked 2026-09-08, describes a first-time family with exactly two days, a dense Lower Manhattan list, two ferry ideas, multiple observation payoffs, uncertain meals or resets, and substantial walking and out-of-order risk. The local record does not retain the family's composition, starting point, exact attractions, or a deciding preference between duplicate payoffs, so this task does not infer them.

Required outputs:

1. group the two days by zone;
2. reduce the two ferry ideas to one and the multiple observation payoffs to one, but keep both choices conditional when the source supplies no deciding preference;
3. distinguish main jobs from brief look-only stops;
4. protect meal/reset capacity;
5. delete enough flexible stops to preserve one main job per half day; and
6. leave exact transport, ticket, weather, entrance, and operating checks unresolved until current verification.

## Evidence Inventory

| Evidence | Date | Class | Use | Limitation |
|---|---|---|---|---|
| Live NYC all-ages activity page | Inspected 2026-09-08; visible source date 2026-07-24 | Live page and interface evidence | Activity fields, filters, comparison, pairings, itinerary routes, and current checks | Does not observe behavior or validate current venue conditions |
| Live NYC family itinerary page | Inspected 2026-09-08; visible source date 2026-07-26 | Live page and interface evidence | Day starts, zone shapes, pivots, reset/deletion rules, sibling route, and official checks | Templates do not accept or preserve a reader's draft |
| `FT-RES-035` task model | Completed 2026-09-08 from questions dated 2026-03-11 through 2026-08-01 | Qualitative community evidence | Distinguishes existing-draft editing from attraction discovery and retains these two task summaries | Purposive five-question sample; not demand or prevalence; only locally retained details govern this walkthrough |
| Locally retained `NYC-D1` summary | Source dated 2026-08-01; local record completed 2026-09-08 | Qualitative community evidence | Fixed commitments, usable-day capacity, harbor choice, resets, and luggage | One paraphrased planning state; exact chronology and unretained source details are excluded; no generalization or verified outcome |
| Locally retained `NYC-D3` summary | Source dated 2026-06-12; local record completed 2026-09-08 | Qualitative community evidence | Flexible two-day overload, duplicate ferry and observation payoffs, order, meal, and deletion control | One paraphrased planning state; exact attractions and unretained source details are excluded; later outcome is excluded |
| September 8 GSC snapshot | Collected 2026-09-08; finalized through 2026-09-06 | Fresh authenticated API, public-safe | Crawl, index, and measurement boundary | No aligned public query cohort |

## Observable Interface Evidence

All three requested viewport sizes were reproduced. Document width equaled viewport width in every run. Both mobile comparison tables remain inside intentional horizontal scrollers rather than widening the document.

### Activity page

| Viewport | One-anchor stance | Filters | Comparison | Itinerary handoff | Current checks | Document width |
|---|---:|---:|---:|---:|---:|---:|
| 1280 by 900 | 1.6 viewports | 2.1 | 5.0 | 9.1 | 9.7 | 1280 / 1280 |
| 390 by 844 | 1.7 | 2.7 | 9.5 | 17.3 | 18.4 | 390 / 390 |
| 320 by 800 | 2.0 | 3.0 | 11.1 | 20.2 | 21.7 | 320 / 320 |

The activity page shows 12 cards at every size. Selecting `Elementary` also leaves all 12 visible, so it confirms age relevance but does not reduce this task's universe. The comparison consistently exposes age, duration, cost, area, stroller, rain, nap, booking, reason, and nearby-pairing fields. The 390-pixel table is 1,080 pixels wide inside a 354-pixel wrapper with 728 pixels of available horizontal movement. At 320, the same table sits inside a 284-pixel wrapper with 798 pixels of movement. Neither state creates root overflow.

### Itinerary page

| Viewport | Trip-length start | Day routes | Arrival/weather/base pivot | Stop rules | Activity link | Document width |
|---|---:|---:|---:|---:|---:|---:|
| 1280 by 900 | 1.6 viewports | 2.2 | 4.0 | 5.0 | 5.8 | 1280 / 1280 |
| 390 by 844 | 1.7 | 2.7 | 5.9 | 7.2 | 8.6 | 390 / 390 |
| 320 by 800 | 2.0 | 3.1 | 6.9 | 8.4 | 10.1 | 320 / 320 |

The early route contains only one-, two-, and three-day blank-slate cards. There is no form or editable planning control and no early `existing draft`, `already booked`, `fixed reservation`, or equivalent instruction. The later page does mention arrival/departure blocks, a second fixed ticket, and a prepaid evening ticket, but it does not assemble those facts into a fixed-first editing sequence.

The 390-pixel itinerary table is 820 pixels wide inside a 354-pixel wrapper with 468 pixels of horizontal movement. At 320 it is inside a 284-pixel wrapper with 538 pixels of movement. The early activity-to-itinerary link navigated normally. The deep itinerary-to-activity anchor did not activate through one locator attempt after automatic scrolling; after bringing the same visible anchor into view, direct visible-DOM activation navigated normally. This was not reproduced as a broken link, overlay, or containment defect.

## Task Results

Viewport does not change whether the decision evidence exists, so the step scores are stable across desktop and both mobile runs. Viewport depth changes reconstruction effort and is recorded separately above.

### Task A: fixed reservations and partial travel days

| Step | Result | Observable basis |
|---|---|---|
| Start | `PARTIAL` | The first useful stance says one anchor per day, but the itinerary start offers only one-, two-, and three-day blank-slate shapes. It does not first sort bookings or usable partial/full-day blocks. |
| Reduce | `PARTIAL` | The source already supplies the main candidates, and the page's stop rules help delete extras. The `Elementary` filter leaves all 12 cards, while fixed-versus-flexible sorting remains manual. |
| Compare | `YES` | The full Statue/Ellis day and shorter Staten Island Ferry option use the same age, time, cost, area, access/weather, booking, value, and pairing fields. |
| Trace | `PARTIAL` | Freshness, research boundary, estimates, official links, and volatile unknowns are visible, but evidence classes and source paths are global or later rather than attached to every planning field. |
| Decide | `PARTIAL` | A conditional, deletion-ready five-calendar-day structure is possible, but the retained source summary supplies no preference between the full Statue/Ellis visit and shorter harbor view, so the harbor choice cannot be completed without inventing one. |
| Verify | `PARTIAL` | AMNH, harbor, MTA, weather, entrance, accessibility, and storage/luggage checks are routed. The fixed dinner and baseball game remain outside the page records and require their own booking or venue checks. |
| Recover | `PARTIAL` | Later arrival/departure, reset, and stop rules allow recovery, but the reader must construct the fixed-first sequence and carry it through sections 5.9-8.4 mobile viewports down. |

Provisional edit, not a route or operating guarantee:

- First confirm which usable block holds each fixed dinner, AMNH anchor, and baseball game, then place those commitments before adding flexible stops; keep a meal or hotel reset around the longer fixed block and cut flexible wandering before cutting that reset.
- Treat each Penn Station travel day as a partial block, not a full sightseeing day. Keep it near the base or station and remove the flexible stop if arrival, check-in, luggage, weather, or return-margin checks do not fit.
- Use either the full Statue/Ellis route when the family values the island visit and current authorized-ferry and access checks fit, or the shorter Staten Island Ferry view when they value a shorter free harbor payoff. Do not stack both; the retained source summary does not decide between them.
- Keep each remaining full block to one same-zone main job and name at least one flexible deletion before compressing food or rest.

### Task B: flexible two-day control

| Step | Result | Observable basis |
|---|---|---|
| Start | `YES` | The two-day start directly separates one Uptown/Midtown day from one Downtown/harbor day and warns against repeated city crossings. |
| Reduce | `PARTIAL` | The day shape and stop rules can remove duplicate ferry and observation payoffs plus flexible zones, but the reduction is manual and the early route does not operate on the supplied list. |
| Compare | `PARTIAL` | The pages support a Staten Island Ferry branch, a Brooklyn waterfront route, and one documented observation option, but they do not compare every option represented in the retained duplicate-payoff summary. |
| Trace | `PARTIAL` | The same global evidence/freshness labels and later official links apply. Options outside the maintained records cannot be traced from these pages. |
| Decide | `PARTIAL` | The route can reduce each duplicate-payoff category to one only after the family states its intended harbor and observation payoff. The retained source summary supplies no deciding preference, so neither choice may be invented. |
| Verify | `PARTIAL` | Current MTA, ferry, weather, ticket, entrance, and backup checks are visible for documented options. Any option outside the maintained records requires its own current operator or venue source. |
| Recover | `YES` | Once the family states its payoff preferences, the two-day shape, meal/reset rule, one-main-job rule, and evening deletion rule let it remove duplicate payoffs and optional zones without reopening the selected day shape. |

Provisional control, not a route or operating guarantee: use one day for the Lower Manhattan and harbor cluster, choose one ferry only after deciding the intended payoff and usable time, and remove the second ferry plus optional out-of-order zones before squeezing meals. Use the other day for the remaining same-zone main jobs and keep exactly one observation payoff only after deciding the preferred view, total price, ticket time, and current conditions. The retained source summary does not select among those criteria, so both branches remain conditional. Verify exact transit and operator or venue conditions separately.

## Severity And Candidate Result

One P2 is reproduced for Task A: the itinerary page's core sequencing job has no nearby path for a source-supported family arriving with fixed bookings, partial travel days, and an existing draft. The correct component rules exist, but the reader must reconstruct their order across a blank-slate start and later pivots. Mobile depth makes that material without turning page length itself into the defect.

Retain unselected `IMP-051`, limited to one short paragraph directly under `Pick the trip length before the attractions` and before the current cards. It must:

- distinguish fixed from movable or refundable commitments;
- mark usable arrival, departure, and full-day blocks;
- place one same-zone main job and meal/reset around each fixed block;
- cut flexible stops before compressing the reset or moving a truly fixed commitment; and
- route exact booking terms, entrance, transit, weather, storage, and backup checks.

Do not add a fourth card, input, planner, filter, itinerary length, attraction, comparison record, route time, URL, or claim. Preserve the existing flexible one-, two-, and three-day starts. The future implementation succeeds only if Task A `Start` and `Recover` become `YES` while Task B `Start` remains `YES`, the new instruction stays before the cards at all three viewports, and all current page/search invariants hold.

Task B's unresolved ferry and observation choices are not a second candidate. Its retained source summary supplies no deciding preference, and not every represented option is in the maintained inventory. Conditional branches are more trustworthy than selecting from absent evidence.

Task A's unresolved harbor choice is likewise a source-input boundary, not a second page candidate. `IMP-051` targets only the reproduced early ordering and recovery defect; it does not promise to manufacture a family preference.

## Adversarial Checks

- The result does not use the `Elementary` filter's broad output as proof that the page needs another filter; the fixed-reservation task begins with a supplied draft, not an attraction-discovery universe.
- The result does not use the later `NYC-D3` trip report as evidence that the draft was realistic for other families or that 30,000-step days are suitable.
- The provisional plans do not assert current weather, ticket inventory, ferry service, elevator operation, luggage storage, exact route time, stroller practicality, safety, restaurant quality, or attraction suitability.
- The candidate changes the ordering instruction, not the activity inventory. More attractions, day templates, or prose would not repair fixed-versus-flexible sorting.
- Removing the current one-, two-, and three-day starts would harm the flexible control. The candidate remains one optional instruction immediately before them.
- The finding is falsified if an independent walkthrough completes Task A's first sort and recovery without inventing an editing sequence, or if the compact instruction obscures the flexible control.

## Reusable Lesson

Trip length and usable planning capacity are different inputs. When a family already has reservations, the first operation is not choosing a generic day count; it is separating fixed from movable commitments and partial from full blocks. A compact ordering rule can bridge an existing draft into reusable day shapes without building a new planner or adding inventory.

## Next Falsification

Reject `IMP-051` if an independent reviewer can complete Task A's fixed/flexible sort, usable-block normalization, and deletion recovery from the current early route without inventing the sequence; if the proposed paragraph merely restates later rules without improving `Start` and `Recover`; if it delays or confuses Task B's current two-day start; if behavior/user evidence shows the existing route is found and used without material reconstruction; or if aligned query evidence establishes a different page job. Any implementation requires a separate roadmap selection, exact wording/placement, before/after task scoring, native QA, independent review, and the normal release gate.

## Privacy And Scope

This artifact contains no credentials, tokens, protected query rows, complete raw GSC export, usernames, personal data, copied source prose, or claimed firsthand experience. The action is limited to ten registered research/state paths. It changes no `site/**`, page, generator, test, URL, canonical, indexability, sitemap, schema, analytics, indexing request, external account, post, outreach, destination, or automation.

## Independent Review

Raman (`01a08221-4b19-79f3-a09a-294ee3e07bbb`) cycle one returned `FAIL` with two P2 research-record findings. First, the task descriptions and provisional branches included decision-critical source details not retained in the local `FT-RES-035` record, preventing an offline source-fidelity check. Those details are removed; the walkthrough now uses only the locally auditable `NYC-D1` and `NYC-D3` summaries and leaves duplicate-payoff choices conditional where no preference is retained. Second, this artifact and roadmap said QA was pending after the complete green QA had already run. The completed results are now recorded below. Cycle two returned `FAIL` with one P2 consistency finding: Task A still scored `Decide` as `YES` despite its unresolved harbor preference, and one provisional sentence implied an unretained chronology. `Decide` is now `PARTIAL`, and the sentence first requires confirmation of the actual booked blocks. Cycle three confirmed those substantive corrections but returned `FAIL` because the machine-readable action still recorded one review cycle while the prose recorded two and cycle three was pending. The current action now records all three completed cycles. On 2026-09-08, the user explicitly authorized one additional independent read-only review and instructed the operator to commit after a clean result. Kepler (`01a08568-8011-7a71-89a5-7d14325f850b`) cycle four returned `PASS` with no P0-P3 after reconciling the complete diff, source facts, scores, P2 classification, `IMP-051` scope, GSC and privacy limits, exact ten-path/no-site scope, QA, review chronology, and restored historical state. Neither reviewer edited files or external state.

## QA

- Focused New York City activity and itinerary tests pass 8/8; the full native suite passes 162/162.
- Operator-state and content-freshness QA pass with zero expired records.
- Local and production SEO QA return 0 errors and 0 warnings; production preflight covers all 28 URLs.
- All 57 public GSC snapshots validate, and the GSC snapshot test suite passes 12/12.
- `ops/seo-roadmap.json` parses with 88 unique action IDs. The exact ten-path/no-`site/**` scope, privacy patterns, and whitespace checks pass.
- Kepler independently reran the focused 8/8 and full 162/162 tests, operator-state, content-freshness, local SEO, 57-snapshot validation, and GSC 12/12 checks; all passed.

## Sources

- [NYC all-ages activity page](https://familytripwise.com/things-to-do/new-york-city-with-kids.html), checked 2026-09-08.
- [NYC family itinerary page](https://familytripwise.com/family-itinerary/new-york-city-with-kids.html), checked 2026-09-08.
- [Fixed-reservation family question](https://www.reddit.com/r/visitingnyc/comments/1vcck6j/nyc_itinerary_with_soon_to_be_7_year_old/), dated 2026-08-01 and rechecked 2026-09-08.
- [Flexible two-day family question](https://www.reddit.com/r/visitingnyc/comments/1u3zv8c/is_this_a_realistic_itinerary/), dated 2026-06-12 and rechecked 2026-09-08.
- `docs/research/new-york-city-current-family-day-planning-questions-2026-09-07.md`, completed 2026-09-08.
- `ops/gsc-snapshots/2026-09-08.md`, collected 2026-09-08 and finalized through 2026-09-06.
