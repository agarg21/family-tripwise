# Chicago Family Cluster Decision Pack

Status: internal research decision pack

Action: `FT-RES-008`

Prepared: 2026-07-23

Scope: Chicago family travel cluster only

Publication state: research-only; no `site/**` edit, indexing request, or external-account mutation

## Decision

Chicago should use five core pages with distinct jobs:

1. the existing all-ages things-to-do hub;
2. the existing teen specialist;
3. the existing family itinerary;
4. the existing area/base stay guide; and
5. one future named-property family-hotel comparison.

The hotel page is justified. Logged-in Semrush US data and current SERPs show a meaningful commercial cluster for `family friendly hotels in Chicago`, `best hotels in Chicago for families`, `kid friendly hotels Chicago`, and downtown/pool variants. Those results are hotel lists, OTA/category pages, property pages, and parent discussions, not neighborhood-only guides. The existing `where to stay` page should therefore answer **which area or base**, while the future hotel page answers **which named property**.

Do not add separate URLs now for resorts, pools, suites, toddlers, rainy days, free activities, downtown activities, weekend events, or stroller/no-car questions. Those are filters, modules, or freshness-sensitive jobs until additional SERP overlap proves a distinct page is useful.

The next bounded implementation is:

- promoted action: `FT-IMP-010`
- backlog item: `IMP-025`
- title: "Improve the Chicago all-ages things-to-do hub"
- target: `https://familytripwise.com/things-to-do/chicago-with-kids.html`
- reason: it serves the largest observed acquisition cluster, already has 52 GSC impressions, and currently repeats six activities across cards, situation picks, a table, detailed notes, and mini-itineraries.

The family-hotel page is the approved second cluster implementation, after the all-ages hub. It must use the same durable evidence workflow as the San Diego and Las Vegas hotel pages before publication.

## Evidence Classification

| Evidence | Freshness | Classification and use | Limitations |
|---|---:|---|---|
| Repository and production model | checked 2026-07-23 | Current local operating, page, and generator state. | Does not prove search demand or ranking by itself. |
| `ops/gsc-snapshots/2026-07-23.json` and `.md` | collected 2026-07-23; finalized through 2026-07-21 | Fresh authenticated read-only API evidence. Provides aggregate page rows and selected URL Inspection results. | Public-safe snapshot omits protected raw queries, countries, devices, and credentials. |
| Logged-in Semrush Chrome session | collected 2026-07-23; US database, most rows updated within one month | Current directional volume, KD, intent, related-query, and cached SERP evidence. | Related variants overlap and must not be added as unique demand. Low-volume rows sometimes require refresh. Semrush API was unavailable because the account had zero API units. |
| Public web SERPs | collected 2026-07-23 | Current directional ranking domains, page types, features, and qualitative overlap. | Results vary by time, location, and personalization; not a rank tracker. |
| Representative ranking pages | inspected 2026-07-23 | Structural strengths, gaps, and authority advantages. | Representative sample, not every result or every section on the web. |
| Reddit/community discussions | inspected 2026-07-23 | Qualitative parent questions, constraints, and conflicts only. | Not demand metrics, verified property facts, or Family Tripwise firsthand experience. |
| Four current Chicago pages | audited 2026-07-23 | Every visible section reviewed for usefulness, repetition, intent, personas, and trust. | Several source sections reuse the same generic official links instead of page-specific evidence. |

## Current GSC Context

The July 23 public-safe snapshot is fresh and finalized through July 21. It is early discovery evidence, not a performance verdict.

| Page | Impressions | Clicks | Page-level average position | Inspection context |
|---|---:|---:|---:|---|
| Chicago things to do with kids | 52 | 0 | 58.88 | Indexed in the selected URL Inspection set; last crawl shown as 2026-07-04. |
| Chicago where to stay with kids | 38 | 0 | 60.11 | Indexed in the selected URL Inspection set; last crawl shown as 2026-07-04. |
| Chicago family itinerary | 12 | 0 | 20.75 | Has a performance row; not in the 15-URL inspection subset. |
| Chicago with teens | no row | N/A | N/A | No page-row evidence and not in the 15-URL inspection subset. |

The three visible page rows total 102 impressions and zero clicks. Average position is page-level and must not be presented as the rank for any example query.

## Query Universe and Demand

Semrush values below are directional US monthly estimates collected through the logged-in Chrome session on 2026-07-23. Similar phrases often describe the same searches; no rows are summed into a unique cluster total.

| Theme | Representative evidence | Intent | Proposed page treatment |
|---|---|---|---|
| Broad family activities | `things to do in Chicago with kids` 5,400, KD 26; `things to do with kids in Chicago` 1,600, KD 26; `Chicago with kids` 1,000, KD 26; `things to do with kids Chicago` 880, KD 25; `Chicago things to do with kids` 720, KD 23; `what to do in Chicago with kids` 590, KD 30; `fun things to do in Chicago with kids` 390, KD 20 | informational with some commercial comparison | Existing all-ages hub; first implementation. |
| Teen/tween activities | `things to do in Chicago with teens` 720, KD 24; `things to do in Chicago with teenagers` 110, KD 9 | informational | Keep standalone teen page. |
| Toddler/young child | `things to do in Chicago with toddlers` 170, KD 14; `Chicago with toddlers` 50, KD 21; `Chicago with preschoolers` 20 with unrefreshed KD | informational | Strong all-ages module/filter; no standalone URL yet. |
| Free/budget | `free things to do in Chicago with kids` 260, KD 20; `free things to do with kids Chicago` 90, KD 14; `free things to do with kids in Chicago` 70, KD 14; `cheap things to do in Chicago with kids` 30 with unrefreshed KD | informational | Strong all-ages module; reconsider a page only after a dedicated overlap check. |
| Indoor/weather/season | `indoor things to do with kids in Chicago` 40, KD 27; `things to do in Chicago with kids in winter` 30 with unrefreshed KD; `rainy day activities Chicago kids` had no refreshed metrics in the 40-query batch | informational/current conditions | All-ages and itinerary modules, source-dated. |
| Current weekend/today | `things to do in Chicago this weekend with kids` 320, KD 17; `things to do in Chicago with kids this weekend` 210, KD 21; `things to do with kids in Chicago this weekend` 170, KD 23; `what to do in Chicago this weekend with kids` 50, KD 22; `things to do in Chicago today with kids` 110, KD 25; `things to do with kids in Chicago today` 50, KD 24 | freshness-sensitive | Do not build a static evergreen page without a current-content workflow. |
| Stay areas | `where to stay in Chicago with kids` 110, KD 12; `family friendly neighborhoods Chicago` 70, KD 13; `best area to stay in Chicago with kids` 10 with unrefreshed KD | informational/commercial | Existing area/base page. |
| Family hotels | `best hotels in Chicago for families` 320, KD 21; `family friendly hotels in Chicago` 260, KD 20; `kid friendly hotels Chicago` 210, KD 29; `best family hotels in Chicago` 90, KD 19 | commercial/transactional | One future named-property page. |
| Hotel location/features | `family friendly hotels downtown Chicago` 210, KD 23; `Chicago hotels near Shedd Aquarium` 210, KD 26; `Chicago kid-friendly hotels with indoor pool` 260, KD 23; `kid-friendly hotels in Chicago with pools` 70, KD 25 | transactional/commercial | Filters and trip-style rows on the same hotel page, not separate URLs. |
| Itinerary | `Chicago itinerary with kids` 20 with unrefreshed KD; `3 days in Chicago with kids` 20 with unrefreshed KD; `Chicago family itinerary` 0; `Chicago weekend with kids` 0 | informational | Keep support page; improve after the acquisition and hotel pages. |
| Family vacation | `Chicago family vacation` 480, KD 18; `Chicago family travel` 20; `Chicago vacation with kids` 40, KD 15 | informational | All-ages hub plus itinerary routing. |
| Transport/stroller/no car | sampled exact rows had no refreshed volume or returned 0 | informational subproblem | Cross-page decision fields, not new URLs. |
| Local/day trips | `road trips from Chicago with kids` 40, KD 7; `weekend getaways from Chicago with kids` 30 with unrefreshed KD | different outbound/local intent | Exclude from the visitor cluster for now. |

## Query-Level SERP Observation Matrix

This table preserves the sampled query evidence behind the clusters. `Current public` means a live public result set was collected on 2026-07-23. `Semrush cached` means the logged-in July 2026 snapshot was available. A failed cached snapshot is explicitly marked and is not counted as overlap evidence.

| Exact sampled query | Evidence available | Recurring pages/domains observed | SERP features / page types observed | Intersection and page decision |
|---|---|---|---|---|
| `things to do in Chicago with kids` | Semrush cached plus current public | Choose Chicago, A Mom Explores, Wisco Explorer, Bridges and Balloons, Reddit AskChicago, Chicago Children's Museum, local/family publishers | sponsored tours, top sights, AI overview, PAA, short videos, long guides, UGC | Core CHI-C1. Broad guides and UGC recur; one all-ages hub should own it. |
| `things to do with kids in Chicago` | current public; same broad Semrush keyword family | Choose Chicago, Time Out, Mommy Poppins/local-family publishers, Reddit, attraction pages | long lists, official destination guide, PAA/UGC | Strong domain/page-type overlap with the prior query; same CHI-C1 URL. |
| `Chicago with kids` | current public; same broad Semrush keyword family | Lonely Planet, family travel publishers, Choose Chicago, Reddit, attraction pages | destination guides, family lists, UGC | Same broad planning job; route family-vacation and itinerary needs from the hub rather than another URL. |
| `free things to do in Chicago with kids` | Semrush cached plus current public | Wisco Explorer, A Mom Explores, Mommy Poppins, Eventbrite, Reddit AskChicago, Facebook groups, TripAdvisor forum | list guides, event inventory, UGC/social results | Partial CHI-C1 overlap plus cost-first/current pages. Build a strong hub module; standalone page remains unproven. |
| `things to do in Chicago with toddlers` | current public; Semrush cached snapshot failed | local Chicago parent publishers, Mommy Poppins-style family pages, broad family guides, Reddit, official attractions | age-specific lists plus broad guides and UGC | Partial broad-page overlap and only 170 exact demand; use CHI-C3 filter/module before another URL. |
| `things to do in Chicago with teens` | current public; Semrush cached snapshot failed | Choose Chicago/local downtown guides, Navy Pier, MyKidList-style publishers, Reddit | teen/tween lists, official attraction pages, UGC | Distinct age-specific result type and 720 exact demand; preserve CHI-C2 specialist URL. |
| `indoor things to do with kids in Chicago` | current public; Semrush row available | local parent publishers, broad family guides, indoor venue pages, Reddit | indoor lists, venue pages, UGC | Reuses broad/parent domains and has 40 exact demand; CHI-C5 module, not a URL now. |
| `things to do in Chicago this weekend with kids` | current public; Semrush row available | Eventbrite/current event inventories, local publishers, social/community pages | dated events, event packs, current UGC | Distinct freshness job but high maintenance; no static evergreen page without a current-content workflow. |
| `where to stay in Chicago with kids` | Semrush cached plus current public | GoSeeLearn, Going, Bridges and Balloons, Reddit AskChicago, TripAdvisor forum, Loews, Swissotel Kids Suite, Travelocity | area guides, UGC, property pages, hotel category pages | Mixed CHI-C6 result set. Existing URL should choose the base and hand named-property comparison to CHI-C7. |
| `best area to stay in Chicago with kids` | current public | Going, neighborhood/stay guides, Expedia-style neighborhood pages, Reddit/forums, hotel-inclusive blogs | neighborhood guides with some named hotels | High overlap with the prior area query and only 10 exact demand; same CHI-C6 URL. |
| `family friendly hotels in Chicago` | current public; Semrush row available, cached snapshot failed | TripAdvisor, Condé Nast Traveler, Time Out, Booking.com, Hotel Guru, Expedia, Reddit, property pages | editorial hotel lists, OTA/category pages, reviews/UGC; Semrush reports eight features but names were not expanded | Named-property CHI-C7 result set differs from area guides; separate hotel comparison justified. |
| `best hotels in Chicago for families` | current public; Semrush row available, cached snapshot failed | Condé Nast Traveler, Time Out, TripAdvisor, Booking.com, Hotel Guru, property pages | editorial shortlists, OTA pages, hotel pages | Strong domain and page-type overlap with `family friendly hotels`; same hotel URL, not a second `best` page. |
| `kid friendly hotels Chicago` | current public; Semrush row available | TripAdvisor/OTA categories, editorial hotel lists, Choose Chicago pool content, Reddit, property pages | hotel lists, pool/amenity pages, UGC | Same named-property job; use filters/fields on CHI-C7. |
| `family friendly hotels downtown Chicago` | Semrush row plus current public hotel results | TripAdvisor/OTA categories, editorial Chicago hotel lists, downtown property pages, Reddit | hotel lists, location-led booking pages, UGC | Reuses the CHI-C7 named-property inventory with a downtown constraint; one hotel page field/filter. |
| `Chicago hotels near Shedd Aquarium` | Semrush row plus current public hotel results | TripAdvisor/OTA hotel pages, downtown/South Loop property pages, stay guides | location-led hotel pages, map/local results, booking pages | Reuses CHI-C7 inventory with an attraction-proximity constraint; include area/activity context without a separate URL. |
| `Chicago kid-friendly hotels with indoor pool` | Semrush row available; current public hotel/pool results | Choose Chicago pool guide, TripAdvisor/OTA hotel pages, property pages | feature-led lists and booking pages | Same hotel inventory with one feature constraint; pool field/filter, not a separate page. |
| `Chicago itinerary with kids` | current public; Semrush row available | family itinerary blogs, Viator, Discovering Anew, Journeys and Jaunts, Enjoy Illinois | day-by-day guides, tour-led plans, downloadable visitor content | CHI-C8 is a sequencing job distinct from activity discovery; keep existing itinerary support page. |

Concrete intersections:

- Broad activity and free/indoor/toddler queries repeatedly share family publishers, local-parent pages, Reddit, and attraction pages. Their difference is a constraint, so the first treatment is a module/filter on CHI-C1.
- Teen queries return an age-specific result set and have a materially larger exact row than toddler/indoor modifiers, supporting the existing CHI-C2 specialist.
- The two area queries share neighborhood/stay guides and forums, while all three hotel-list queries share OTAs, editorial hotel lists, property pages, and review/UGC pages. That split supports separate CHI-C6 area and CHI-C7 hotel URLs.
- Downtown, pool, and near-attraction hotel variants reuse the CHI-C7 inventory rather than proving separate page families.
- Weekend/today queries surface dated event inventory. Their difference is operational freshness, not a reason to publish stale evergreen copy.

## SERP-Overlap Cluster Map

Collection date: 2026-07-23.

Method: sample representative queries, compare recurring ranking URLs/domains and page types, and cluster only when the observed results serve the same user job. Cached Semrush SERPs supplemented current public results; failed cached snapshots were recorded as unavailable rather than treated as evidence.

| Cluster | Included query shapes | Recurring domains/page types observed | Overlap rationale | Confidence |
|---|---|---|---|---|
| CHI-C1 Broad all-ages discovery | things to do, best things, Chicago with kids, family vacation | Choose Chicago, family publishers/blogs, local parent sites, Reddit, attraction pages; list guides, PAA, AI overview, sights, videos | Broad variants repeatedly return comprehensive family activity guides and community threads. | high |
| CHI-C2 Teen/tween planning | teens, teenagers, tweens | Choose Chicago/local downtown guides, Navy Pier, MyKidList-style publishers, Reddit; age-specific lists | Result set and recommendations differ enough from little-kid pages to preserve a specialist. | high |
| CHI-C3 Younger-child planning | toddlers, preschoolers, baby, nap/stroller | local parent publishers, broad family guides, Reddit, attraction pages | Partial overlap with broad pages; the job is better served as age filters and high-friction notes before another URL. | medium |
| CHI-C4 Free/budget | free, cheap, low-cost | Mommy Poppins/local family pages, broad guides, Reddit/Facebook, event pages | A distinct cost-first need exists, but results still overlap broad guides and current events. | medium-high |
| CHI-C5 Indoor/weather/current | indoor, rainy, winter, weekend, today | local parent/event pages, broad guides, Reddit, official venues | Indoor is evergreen enough for a module; weekend/today requires current inventory and should not be a static page now. | medium |
| CHI-C6 Stay areas/base | where to stay, best area, family neighborhoods | neighborhood guides, Going, Choose Chicago, blogs, Reddit, some hotel/property pages | Searcher is choosing a geography and trip base; hotel results appear but are not the whole result set. | high |
| CHI-C7 Family hotels | family-friendly hotels, best hotels for families, kid-friendly hotels, downtown, pool, suites, near Shedd/Navy Pier | TripAdvisor, Expedia/Booking, Condé Nast Traveler, Time Out, Hotel Guru, Choose Chicago, property pages, Reddit | Named-property lists, booking/category pages, and hotel feature queries dominate. This is not satisfied by an area-only page. | high |
| CHI-C8 Itinerary/sequencing | itinerary, 3 days, weekend trip | family itinerary blogs, tour marketplaces, state/visitor content, Reddit critiques | Searcher wants a sequence and stop rules, not another activity inventory. | medium-high |
| CHI-C9 Transport/friction | no car, downtown, stroller, nap return | embedded in stay, itinerary, community, and attraction pages | Recurring subquestions but no sampled evidence for a clean standalone result family. | medium-low |

## Representative Ranking-Page Analysis

| Page/domain | What it answers well | Gap or weakness | Advantage we cannot honestly copy | Opportunity Family Tripwise can pursue |
|---|---|---|---|---|
| Condé Nast Traveler family hotels | Current editorial shortlist, polished property detail, clear parent-and-child framing. | Luxury/editorial emphasis; limited compact side-by-side decision support. | Established editors, brand authority, access, and possible firsthand/advisor knowledge. | Compare trip styles, room setup, pool role, approximate total-night range, and review conflicts in one calm surface. |
| TripAdvisor / Booking / Expedia | Inventory, review volume, filters, prices, and booking conversion. | Hard to understand which property solves a specific family constraint; commercial clutter. | Live inventory and massive review scale. | Use volatile price/review signals as evidence, not imitate an OTA. |
| Time Out Chicago hotel list | Local editorial voice, concise hotel reasons, useful attraction/neighborhood context. | Some claims remain broad and the comparison is not organized around room/pace/budget constraints. | Local publication authority and editorial history. | Make the user's choice easier through consistent fields and transparent freshness. |
| Choose Chicago hotel-pool guide | Useful feature-specific list from the destination authority. | Last updated in 2021 and focused only on pools; package facts can age. | Official destination relationships and local authority. | Verify current property facts and use pool as one decision field, not the entire definition of family-friendly. |
| Reddit AskChicago hotel threads | Quickly surfaces pool, budget, room-sharing, location, and child-age questions. | Anecdotal, inconsistent, unverified, and hard to compare. | Authentic UGC and community moderation. | Convert recurring constraints into structured fields while labeling anecdotes as review/community signals. |
| Going where-to-stay guide | Current neighborhood framing plus kid-specific Navy Pier guidance and named hotels. | Blends area and property jobs; some route/walk implications need verification. | Editorial destination breadth and established travel audience. | Keep area selection concise and hand named-property work to the hotel page. |
| HotelsVetted where-to-stay | Direct answers, price ranges, transport estimates, safety language. | Overconfident exact safety, walk, time, price, and transit claims without visible evidence. | None Family Tripwise should imitate. | Win on calibrated claims, current sources, and explicit unknowns without defensive copy. |
| Large/local all-ages guides | Breadth, photographs, current attractions, and sometimes firsthand detail. | Often 30-100-item lists with weak prioritization, little pacing, and repeated attraction prose. | Local or firsthand experience where documented. | A smaller, stronger set with age/pace/weather/budget filters, one comparison, and only high-friction deep notes. |
| Reddit family itinerary threads | Reveals real questions about too much in one day, hotels, food, transit, and mixed ages. | Unstructured and one-trip-specific. | Authentic context and feedback loops. | Provide reusable day shapes and stop rules without pretending one itinerary fits everyone. |

## Persona Hypotheses

These are research hypotheses derived from query modifiers, result pages, community questions, and product constraints. They are not demographic truth.

### CHI-P1 First-Time Classic-Sights Family

- Job: choose a manageable first Chicago trip from the famous options.
- Context: 2-4 days; Museum Campus, Millennium/Maggie Daley, river architecture, lakefront, Navy Pier.
- Constraints: mixed or unspecified ages, expensive anchors, geography, weather.
- Anxieties: museum overload, wasting tickets, crisscrossing downtown, missing the one high-payoff stop.
- Criteria: one anchor per day, age fit, indoor backup, nearby pairing, hotel base.
- Failure mode: a 50-item list with no start point.
- Pages: all-ages hub, itinerary, stay.

### CHI-P2 Younger-Child Reset Family

- Job: plan short, forgiving blocks around naps, snacks, bathrooms, stroller handling, and weather.
- Context: toddler/preschool modifiers, zoo/playground/children's museum/aquarium interest, hotel resets.
- Anxieties: long queues, weather exposure, too much walking, no easy exit, pool disappointment.
- Criteria: duration, indoor/outdoor, reset plan, booking friction, room setup, pool.
- Failure mode: universal stroller or age-fit promises and full-day museum stacking.
- Pages: all-ages hub, itinerary, stay, future hotel page.

### CHI-P3 Budget/Weather Family

- Job: keep the trip worthwhile when admissions, parking, winter, rain, or heat constrain the plan.
- Context: free, cheap, indoor, winter, rainy, weekend/today modifiers.
- Anxieties: stale free-day claims, expensive admissions, weather breaking the plan.
- Criteria: free/paid, official current check, indoor backup, flexible duration, transport cost.
- Failure mode: evergreen copy presenting events or free days as permanently current.
- Pages: all-ages hub and itinerary; current-event intent remains out of scope.

### CHI-P4 Teen/Tween City-Experience Family

- Job: make Chicago feel like a real city trip, not a little-kid attraction list.
- Context: architecture, skyline, neighborhoods, food, sports, shopping, museums, mixed-age siblings.
- Anxieties: generic sightseeing, childish choices, no autonomy, too much museum time.
- Criteria: teen-specific reason, movement, choice, food, social/photo payoff, weather alternative.
- Failure mode: renaming the all-ages list without changing the recommendations.
- Pages: teen specialist, itinerary, stay.

### CHI-P5 Lodging-Led Family

- Job: select an area and then a property that fits the family's room, reset, budget, and activity plan.
- Context: family-friendly hotels, downtown, pool, near Shedd/Navy Pier, where-to-stay searches.
- Anxieties: room too small, hidden total cost, wrong base, parking, pool availability, stale amenity claims.
- Criteria: area role, room/suite setup, approximate total nightly range, pool, breakfast/kitchen when evidenced, parking, review themes/conflicts, map context.
- Failure mode: one blended page that never clearly compares either areas or hotels.
- Pages: existing area guide plus future family-hotel page.

## Page and Section Audit

### All-ages things-to-do

URL: `https://familytripwise.com/things-to-do/chicago-with-kids.html`

Role: CHI-C1 hub serving CHI-P1/P2/P3 and routing P4/P5.

| Current section | Verdict | Reason / implementation instruction |
|---|---|---|
| Hero, review status, visual | keep/compress | Keep the clear query match and source date; avoid prominent defensive methodology. |
| "Pick one anchor activity per day" | keep | Strong planning principle and useful first decision. |
| Six activity cards | expand selectively | Candidate pool is too narrow for 5,400-demand intent; research roughly 10-12 distinct choices across museums, free/outdoor, younger child, teen/mixed-age, indoor/weather, and neighborhood/lakefront roles. No quota. |
| Teen cross-link band | merge | Keep routing, but include it in a compact persona/trip-shape starter rather than a standalone interruption. |
| "Best choices by family situation" | replace | Convert to five concise persona/trip-shape starts and remove universal `best` framing. |
| Activity decision table | keep/expand | One complete comparison should be the main scan surface. |
| Detailed notes for all six repeated activities | compress | Retain deep notes only for high-friction choices; do not restate every table row in seven micro-fields. |
| Five mini-itineraries | merge/link | Keep compact use cases; route full sequencing to the itinerary page. |
| Official sources | replace | Use activity-specific current official links, not the same generic five-source residue used across every Chicago page. |

Cannibalization rule: the hub may preview teen, toddler, free, weather, hotel, and itinerary routes, but must not duplicate their full jobs.

### Teen guide

URL: `https://familytripwise.com/things-to-do/chicago-with-teens.html`

Role: CHI-C2 specialist serving CHI-P4.

| Current section | Verdict | Reason / later instruction |
|---|---|---|
| Hero/status/visual | keep/compress | Intent is distinct; trust copy can be quieter. |
| "More independence..." intro | keep | Strong age-specific positioning. |
| Three primary activity cards | expand/rebalance later | Three is too narrow for the 720-volume core query; every added choice needs a teen-specific reason. |
| Trip-style picks | keep/compress | Useful decision layer, but avoid repeating the later table. |
| Decision table | keep | Should become the single complete scan surface. |
| Six seven-field detail blocks | compress | Too verbose and partly duplicates the all-ages page; retain only high-friction teen decisions. |
| Five route ideas | compress | Keep distinct teen/mixed-age routes, not generic mini-itineraries. |
| Cluster links | keep | Important for mixed-age families. |
| Sources | replace | Add teen-specific official/current sources; remove generic reused source residue. |

Verdict: keep standalone; second wave after the all-ages hub and hotel page.

### Family itinerary

URL: `https://familytripwise.com/family-itinerary/chicago-with-kids.html`

Role: CHI-C8 sequencing page serving all personas, especially CHI-P1/P2/P3.

| Current section | Verdict | Reason / later instruction |
|---|---|---|
| Hero/status/visual | keep/compress | Clear query match. |
| "Nap-friendly structure" | merge | Useful rules, but currently abstract. Fold into real day plans. |
| "Condensed weekend plan" | replace | Use concrete day-by-day anchors and stop rules. |
| Three utility cards | merge/link | Keep activity/stay/rain routes in one compact cluster handoff. |
| Plan-match matrix | keep/rework | Useful selector if each choice maps to a complete plan. |
| "1-day, 2-day, 3-day..." variant table | remove/merge | Duplicates the plan selector without enough concrete sequencing. |
| Six pacing cards | replace | Generic prose should become realistic one-, two-, and three-day plans plus age/weather pivots. |
| Sibling-page links | keep | Necessary cluster routing. |
| Sources | replace | Use itinerary-relevant transport, attraction, and current-condition sources. |

Verdict: keep; later apply the proven Las Vegas itinerary simplification pattern.

### Stay areas

URL: `https://familytripwise.com/where-to-stay/chicago-with-kids.html`

Role: CHI-C6 area/base decision page serving CHI-P1/P2/P5.

| Current section | Verdict | Reason / later instruction |
|---|---|---|
| Hero/status/visual | keep/compress | Keep area intent explicit. |
| "Start with the area..." | keep | Correct architecture. |
| "Best areas for families" | keep/reframe | Preserve area comparison, but avoid universal `best` and unsupported safety/quiet claims. |
| Generic hotel/stroller/filter cards | remove/merge | The hotel card is not a shortlist and stroller wording is too generic. Route to named hotels and retain only decisive base checks. |
| "Best areas by family need" | merge | Duplicates the main area list; convert to trip-shape starts. |
| Stay tradeoff table | keep | One complete area comparison should remain. |
| Six verification cards | compress | Keep room, parking, transit, noise/event, meal/reset, and pool checks in 2-3 compact decision groups. |
| Cluster links | keep/expand later | Add the named-hotel page when published. |
| Sources | replace | Current sources are generic attraction links and do not support area/transit assertions. |

Verdict: keep as area/base page. Do not add named hotel profiles to it.

### Proposed family-hotel comparison

Proposed URL: `https://familytripwise.com/where-to-stay/chicago-family-hotels.html`

Role: CHI-C7 named-property comparison serving CHI-P5 and CHI-P1/P2.

Required shape:

- about 10-12 evidence-backed properties, selected for distinct trip-style value rather than an ordinal ranking;
- one compact comparison;
- approximate total nightly ranges, clearly source-dated and non-guaranteed;
- official room/suite, pool, breakfast/kitchen, parking, and location facts when available;
- crib, rollaway, connecting-room, and laundry facts when found, not mandatory for inclusion;
- bounded, paraphrased recent online-review themes from families plus conflicting signals;
- direct map links and area/activity context without exact walking-time guarantees;
- visible freshness and uncertainty that reads naturally, not defensively;
- no separate resorts, pools, suites, downtown, or near-Shedd page.

Publication blocker: a Chicago hotel evidence pack, focused tests, current price/review checks, native/responsive QA, and independent review. No personally stayed, safety, quiet-room, exact-route, room-selection, stable-price, or universal family-fit claim.

## Opportunity Matrix

Scores: 5 high, 1 low.

| Opportunity | Impact | Confidence | Learning | Effort | Risk | Decision |
|---|---:|---:|---:|---:|---:|---|
| Improve all-ages hub with wider candidate/every-section review | 5 | 5 | 5 | 4 | 2 | Promote `FT-IMP-010` / `IMP-025`. |
| Research and publish one Chicago family-hotel page | 5 | 5 | 5 | 5 | 3 | Approved second implementation; durable evidence pack required. |
| Simplify area/base page after hotel page exists | 4 | 5 | 4 | 3 | 2 | Third; route named hotels away from it. |
| Improve teen specialist | 4 | 4 | 4 | 4 | 2 | Keep and improve after acquisition/hotel work. |
| Simplify itinerary into real day-by-day plans | 3 | 4 | 4 | 4 | 2 | Keep; later reuse Las Vegas pattern. |
| Add free/budget standalone URL | 3 | 3 | 3 | 3 | 2 | Module first; no URL now. |
| Add toddler or indoor URL | 2 | 3 | 3 | 3 | 2 | Filters/modules first. |
| Add weekend/today page | 3 | 3 | 4 | 5 | 4 | Defer until a current-content workflow exists. |

## Promoted Next Implementation

### FT-IMP-010 / IMP-025: Improve the Chicago all-ages things-to-do hub

Target:

- `https://familytripwise.com/things-to-do/chicago-with-kids.html`

Expected implementation scope:

- one durable Chicago activity candidate/section review under `docs/research/`;
- the existing generator path that owns the Chicago output;
- one focused test file;
- the existing Chicago all-ages HTML;
- Chicago status and operator state paths.

Acceptance criteria:

1. Preserve the existing URL, canonical, indexability, and sitemap membership.
2. Research a wider current candidate pool, then retain only activities with distinct age, weather, budget, pace, or geographic planning value.
3. Replace six repeated activity layers with one complete comparison and deep notes only for high-friction choices.
4. Provide concise routes for CHI-P1 through CHI-P5 without duplicating the teen, stay, hotel, or itinerary jobs.
5. Add useful free/budget and indoor/weather support, with current official checks where facts change.
6. Replace generic reused source residue with current activity-specific sources.
7. Do not publish unsupported safety, exact-route, stroller, sensory, age-fit, price, opening-hour, or personally verified claims.
8. Focused tests, deterministic generation, native SEO QA, responsive QA, privacy/scope checks, and independent review pass.

Measurement plan:

- Baseline: 52 impressions, 0 clicks, page-level average position 58.88 over the latest 28-day window finalized through 2026-07-21.
- Technical success: unchanged canonical/indexability/sitemap state, production 200, current internal routes, and no SEO QA regression.
- Product success: one clear comparison, materially less repeated prose, wider decision coverage, and explicit sibling-page boundaries.
- Search observation: use later naturally available GSC snapshots for crawl and page-row movement; do not request indexing or create a cadence-only action.
- Early target: consistent top-20 visibility for the broad cluster, then top 10. Do not infer query-specific rank from page-level GSC position.

## Ordered Cluster Sequence

1. `FT-IMP-010`: improve the all-ages hub.
2. Research and publish one evidence-backed Chicago family-hotel comparison.
3. Simplify the existing area/base page and add the hotel handoff.
4. Review/improve the teen specialist.
5. Simplify the itinerary into concrete day-by-day plans.

Each step is a separate bounded transaction with its own QA and independent review. New URL creation remains one page at a time.

## Source Register

| ID | Class | Source | Checked | Supports |
|---|---|---|---|---|
| GSC-0723 | fresh authenticated public-safe API evidence | `ops/gsc-snapshots/2026-07-23.json` and `.md` | 2026-07-23 | Page impressions, clicks, positions, selected URL Inspection. |
| SEM-BULK | logged-in paid-tool evidence | Semrush Keyword Overview, US, 40-query batch | 2026-07-23 | Core demand/KD/intent rows. |
| SEM-MAGIC-ACT | logged-in paid-tool evidence | Semrush Keyword Magic for `chicago with kids` | 2026-07-23 | Broad, free, weekend, indoor, stay, and hotel-pool variants. |
| SEM-MAGIC-HOTEL | logged-in paid-tool evidence | Semrush Keyword Magic for `family friendly hotels chicago` | 2026-07-23 | Hotel, downtown, pool, and location variants. |
| SEM-SERP-ACT | cached paid-tool SERP | `things to do in chicago with kids`, Semrush July 2026 snapshot | 2026-07-23 | Broad result domains and SERP features. |
| SEM-SERP-FREE | cached paid-tool SERP | `free things to do in chicago with kids` | 2026-07-23 | Free/budget result pattern. |
| SEM-SERP-STAY | cached paid-tool SERP | `where to stay in chicago with kids` | 2026-07-23 | Mixed area/property result pattern. |
| CNT-HOTEL | ranking page | https://www.cntraveler.com/gallery/headed-to-chicago-with-kids-the-best-family-friendly-hotels-that-adults-will-love-too | 2026-07-23 | Current editorial hotel list. |
| TA-HOTEL | OTA/review page | https://www.tripadvisor.com/Hotels-g35805-zff4-Chicago_Illinois-Hotels.html | 2026-07-23 | Inventory/review page type. |
| TIMEOUT-HOTEL | local editorial | https://www.timeout.com/chicago/hotels/the-best-family-friendly-hotels-in-chicago | 2026-07-23 | Local hotel-list structure and methodology. |
| CHOOSE-POOL | official destination editorial | https://www.choosechicago.com/blog/hotels/chicagos-top-5-kid-friendly-hotel-pools/ | 2026-07-23 | Pool-led hotel need and freshness risk. |
| GOING-STAY | ranking page | https://www.going.com/guides/where-to-stay-in-chicago | 2026-07-23 | Area plus hotel blended result. |
| HV-STAY | weak ranking-page example | https://hotelsvetted.com/where-to-stay/chicago-with-kids/ | 2026-07-23 | Unsupported firmness opportunity. |
| MKW-ACT | family publisher | https://www.mkewithkids.com/post/chicago-family-attractions/ | 2026-07-23 | Broad list depth and scan-cost pattern. |
| LP-ACT | travel publisher | https://www.lonelyplanet.com/articles/chicago-with-kids | 2026-07-23 | Age/context detail and authority. |
| RED-HOTEL | qualitative community | https://www.reddit.com/r/AskChicago/comments/1rv0g8t/looking_for_kid_friendly_hotel_recommendations/ | 2026-07-23 | Pool/budget/property question shape. |
| RED-TRIP | qualitative community | https://www.reddit.com/r/AskChicago/comments/1kx7y9d/planning_a_kidfriendly_trip_to_chicago_next_month/ | 2026-07-23 | First-trip sequencing and cost questions. |
| FTW-ACT | site audit | `site/things-to-do/chicago-with-kids.html` | 2026-07-23 | Current all-ages sections and repetition. |
| FTW-TEEN | site audit | `site/things-to-do/chicago-with-teens.html` | 2026-07-23 | Current teen sections and gaps. |
| FTW-ITIN | site audit | `site/family-itinerary/chicago-with-kids.html` | 2026-07-23 | Current itinerary layers and gaps. |
| FTW-STAY | site audit | `site/where-to-stay/chicago-with-kids.html` | 2026-07-23 | Current area/property role and gaps. |
