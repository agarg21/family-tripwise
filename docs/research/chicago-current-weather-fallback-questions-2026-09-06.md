# Chicago Current Family Weather-Fallback Questions

Status: completed and review-clean for `FT-RES-033` / `SRR-055`; Noether cycle-two `PASS`

Prepared: 2026-09-06

Scope: three current visitor-family questions plus one local toddler control; qualitative evidence only

## Candidate Decision

Reject the hypothesis that an `indoor` label is enough to recover a weather-disrupted Chicago family day.

The four-question sample supports a constraint-preserving substitution instead: establish the actual forecast or operating trigger near the visit, keep the child's age or interest and the usable time block, avoid replacing a low-effort outdoor plan with an unexpectedly demanding indoor day, stay near the chosen zone or reset when possible, account for cost and fixed bookings, and expose the next current venue, weather, and transport checks.

The existing all-ages activity and itinerary pages already divide this work coherently. The activity page owns shortlisting by age, time, cost, area, rain role, nap/reset fit, booking and nearby pairing. The itinerary owns the disrupted-day sequence, deletion rule, nearby meal/reset and current checks. Preserve both page roles and URLs. Current-question evidence alone does not establish whether a reader can complete the joined substitution through the live interface.

Retain one unselected spring-weather task plus a winter-interest control for a later separately selected desktop/mobile walkthrough. Make no page edit in this action.

## GSC Boundary

No September 6 snapshot was available at the 05:01 Eastern selection time. The newest evidence is the recent reused September 5 authenticated read-only API snapshot, collected September 5 and finalized through September 3. It reports 1,829 property impressions, 1 click, aggregate average position 65.21, and 24 of 28 inspected URLs indexed.

The Chicago all-ages activity page is indexed with 20 impressions at page-average position 57.65 and an August 31 crawl. The itinerary is indexed with 37 impressions at page-average position 54.11 and an August 31 crawl. The public snapshot has no aligned query cohort. These page averages are current crawl and orientation evidence, not query ranks, a CTR diagnosis, user behavior, satisfaction, or a page-change trigger.

## Method

Collection date: 2026-09-06.

Surface: public web search and publicly readable Reddit pages. No account, voting, messaging, posting, private data, or copied thread text was used.

Discovery queries:

- `site:reddit.com/r/AskChicago family kids Chicago rain itinerary indoor 2026`
- `site:reddit.com/r/AskChicago Chicago with toddler cold weather indoor family 2026`
- `site:reddit.com/r/AskChicago/comments 2026 "rain" "kids" Chicago itinerary`
- `site:reddit.com/r/AskChicago/comments Chicago family forecast rain museum kids`

Screening rule: retain recent family questions that expose a weather-dependent visitor decision or materially constrain the fallback by age, location, time, or already chosen anchors. One local winter-toddler question is retained only as an age-fit control. Exclude adult-only rainy-day questions, generic attraction lists, old discussions, and sources whose visible date or family context cannot be established.

Only source date and URL, paraphrased planning state, decision-changing constraints, and answer work are retained below. Usernames, source-owned prose, and personal details unrelated to the decision are omitted.

The [National Weather Service Chicago office](https://www.weather.gov/lot/) was checked 2026-09-06 as the maintained forecast, observations, hazard, winter-weather, heat, and beach-hazard path. It supports a near-visit current check; it does not support predicting conditions for the four source trips here.

## Question Records

| Record | Source date and URL | Paraphrased planning state | Decision-changing constraints | Work a useful answer must perform |
|---|---|---|---|---|
| `CHI-W1` | 2026-03-20; [public question](https://www.reddit.com/r/AskChicago/comments/1rzcg4a/midapril_visit_with_a_6yo_is_outdoor_walking/) | A first-time spring-break family wants an outdoor, walking-led trip and asks whether Maggie Daley Park and Lincoln Park Zoo remain realistic if mid-April turns cold, wet, or snowy. | One six-year-old; several miles of walking; outdoor trip goal; Loop or River North base; uncertain shoulder-season conditions; parks in different zones; possible trip-timing decision. | Keep the outdoor branch conditional on a near-visit forecast, name the trigger for switching, preserve one age-fit activity block, choose a nearby indoor alternative and reset, and avoid pretending a seasonal average answers the exact dates. |
| `CHI-W2` | 2026-07-07; [public question](https://www.reddit.com/r/AskChicago/comments/1uq4h2m/any_recommendations_for_visiting_chicago_in_the/) | A family unfamiliar with Chicago winter hopes a January trip will include snow activities and asks for museums plus clothing guidance for two older children. | Ages ten and twelve; snow is a hoped-for anchor rather than a known condition; severe-cold or no-usable-snow branch; indoor interests; winter clothing uncertainty. | Separate the hoped-for snow experience from the forecast-dependent plan, choose an older-child indoor anchor by interest and usable duration, expose forecast/venue/transport checks, and identify clothing guidance as a separate verification job rather than an attraction label. |
| `CHI-W3` | 2025-12-04; [public question](https://www.reddit.com/r/AskChicago/comments/1pe0zrz/parents_with_toddlers_what_do_you_do_with_your/) | A local caregiver seeks repeatable winter indoor options and asks which museums work for a newly mobile one-year-old. | Thirteen-month-old; emerging walking; short attention and exit needs; repeat use or membership economics; indoor requirement. | Show that `indoor` does not establish toddler fit: compare age, movement, duration, exits/reset and cost model. This is a local-use control, not evidence that a visitor page must solve membership planning. |
| `CHI-W4` | 2026-06-08; [public question](https://www.reddit.com/r/AskChicago/comments/1u0ovb9/what_are_your_favorite_kid_friendly_activities/) | Two families with three young children already have two large indoor anchors plus major outdoor stops and ask for additional activities; follow-up planning prioritizes proximity and parking. | Ages one, three, and seven; mixed-age fit; five-day trip; Shedd and Griffin MSI already chosen; parks and zoo already chosen; proximity and parking; risk of duplicating large anchors. | Use as a fallback-control case: preserve mixed-age fit and location, avoid adding another large museum by default, and distinguish a short nearby substitute from a second full-day anchor. |

## Falsification Result

Hypothesis: when weather removes an outdoor block, any option labeled `indoor` is a sufficient substitute.

Result: rejected within this bounded sample.

- `CHI-W1` requires a condition-dependent outdoor/indoor branch while preserving a six-year-old's walking and park-oriented trip goal.
- `CHI-W2` requires separating an uncertain snow experience from the dependable plan and choosing for older-child interest, not merely shelter.
- `CHI-W3` shows that indoor status alone does not answer fit for a newly mobile one-year-old; duration, movement, exits and repeat-use cost change the decision.
- `CHI-W4` shows that existing bookings and route proximity can make another indoor headline attraction a poor recovery even when it fits the weather.

The questions do not establish that every family needs every field, that these patterns are common, or that a specific interface would be preferred.

## Supported Decision Model

| Decision output | Supporting records | Existing owner | Boundary |
|---|---|---|---|
| Current trigger: keep, shorten, move, or replace the outdoor block | `CHI-W1`, `CHI-W2` | Itinerary plus current NWS/venue checks | Seasonal anecdotes do not predict exact conditions. The page should route the current check, not issue a safety or weather assurance. |
| Age and interest preserved in the substitute | All four | All-ages activity page; teen page when older-child specialization is needed | Age bands are editorial planning aids, not guarantees of enjoyment or accessibility. |
| Usable duration and physical load | `CHI-W1`, `CHI-W2`, `CHI-W3`, with fixed-anchor control in `CHI-W4` | Activity comparison plus itinerary stop/reset rules | `Indoor` does not mean short, low-walking, low-crowd, or low-stimulation. The later walkthrough must test whether those distinctions are actually reachable. |
| Zone, nearby pairing, transport and return/reset | `CHI-W1`, `CHI-W4` | Activity comparison plus itinerary | No exact route or travel-time claim is supported. A current transit and exact-entrance check remains necessary. |
| Cost, booking and already committed anchors | `CHI-W3`, `CHI-W4`; partial support in `CHI-W2` | Activity comparison and direct venue checks | Membership economics in the local control are outside the visitor page's primary role. The travel task needs current ticket and reservation checks only. |
| Clothing or specialized winter preparation | `CHI-W2` | Not owned by these two page roles | Do not stretch activity or itinerary copy into unsupported gear advice. A future packing product would require separate evidence and selection. |

## Existing-Page Check

Repository inspection on 2026-09-06 confirms that the existing pages expose the relevant component decisions:

- the all-ages page has 12 choices with age, time, cost, area, stroller, rain, nap, booking, reason, and nearby-pairing fields;
- its weather/budget start asks for one current age-fit anchor and a nearby backup rather than rebuilding the day;
- the rain filter identifies indoor-capable options, while the comparison table carries the additional fields needed to distinguish them;
- the itinerary's `Rain, winter, heat, or low visibility` pivot keeps one current indoor anchor and nearby meal, drops the outdoor or skyline block, and explicitly notes queues, walking, stimulation, and transfers; and
- the itinerary routes exact venue, forecast, transit, ticket, storage, and backup checks rather than implying that indoor means operationally certain.

This is page-role coverage, not a task-completion result. The filter and richer comparison are separate decision layers, and current-question evidence does not show whether a reader can reduce the weather-qualified set to two options, preserve the original trip goal, and carry the choice into a coherent day without reconstruction.

## Candidate Result

`PRESERVE` both current page roles and URLs. Add no rainy-day page, indoor variant, attraction, filter, packing section, or weather claim from this sample.

Retain one unselected task model for a later desktop/mobile walkthrough:

> Spring switch: a first-time family with one six-year-old, a Loop or River North base, and a planned Maggie Daley plus Lincoln Park Zoo outdoor day sees a near-visit cold-rain forecast. Can the existing activity and itinerary pages reduce indoor options to at most two, choose one by age/interest, duration, cost and zone, keep a nearby meal or reset, state which outdoor block is dropped, and name the exact weather, venue and transport checks without inventing conditions?

Use a winter-interest control modeled on `CHI-W2`: two children ages ten and twelve hoped for snow, but current conditions do not support that plan. The route should select an older-child indoor anchor by interest and usable duration, expose physical load and current checks, and leave clothing specifics outside these page roles.

A page change is eligible only if a separately selected walkthrough reproduces a material `PARTIAL` or `NO` under the persona protocol and identifies the smallest proportional fix. The candidate does not pre-authorize another filter, decision layer, URL, or packing product.

## Evidence Boundary

- The four questions are qualitative examples, not a demand sample or representative population.
- `CHI-W3` is a local-use control and cannot establish the visitor job or search intent.
- Community replies were used only to understand the question context; their recommendations, conditions, and anecdotes were not adopted as Family Tripwise facts.
- The NWS link is a current verification path, not evidence about the source trips' actual weather.
- Page-role inspection uses repository output. It is not a live task, user test, behavior measure, satisfaction result, ranking evaluation, or proof that the joined route works.
- Safety, exact weather, route, access, price, hours, tickets, transport, clothing, and operating details remain direct current checks.

## QA And Independent Review

Operator QA is complete: focused Chicago tests passed 9/9; the full native suite passed 162/162; operator-state, content-freshness, local SEO, production SEO, 54-snapshot validation, 28-URL public preflight, strict JSON, exact-scope, source allowlist, privacy-pattern, and whitespace checks passed.

Independent read-only reviewer Noether (`01a07600-d69c-7611-99f1-aa51d5690e5b`) cycle one returned `FAIL` for two P2 record-state defects: stale latest-snapshot/preflight pointers in durable state and this section's obsolete pending-QA sentence. Cycle two verified both corrections, the four source records, GSC reconciliation, page-role mapping, evidence/privacy boundaries, exact nine-path scope, unique action IDs, and green QA; final verdict `PASS` with no P0-P3. No public page or external state changed.

## Confidence And Next Falsification

Confidence: medium that a useful weather fallback must preserve more than indoor status; low for prevalence, demand, user behavior, satisfaction, or the effectiveness of the current cross-page route.

Reusable lesson: model a fallback as a constraint-preserving substitution, not a binary venue tag. Preserve the family goal, child fit, usable block, location/reset and commitments; then verify the current trigger and volatile details.

Falsification triggers:

- an independent walkthrough completes the spring and winter cases directly, with at most two options and no avoidable reconstruction;
- the winter control shows that older-child specialization is necessary before the all-ages route can decide;
- the filter/table split materially blocks reduction or the itinerary route reopens a settled choice;
- a newer question sample is satisfied by a simple indoor list with no meaningful age, time, route, cost, or current-check constraint; or
- actual behavioral or participant evidence contradicts the proxy model.
