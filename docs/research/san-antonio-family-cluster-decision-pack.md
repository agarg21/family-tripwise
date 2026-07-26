# San Antonio Family Cluster Decision Pack

Status: complete and independently review-clean

Action: `FT-RES-010`

Prepared: 2026-07-26

Scope: San Antonio visitor-family cluster only

Publication state: research-only; no `site/**` edit, indexing request, outreach, deployment, or external-account mutation

## Decision

San Antonio should use five core page roles:

1. improve the existing all-ages things-to-do hub;
2. keep the existing teen specialist;
3. keep the existing area/base stay guide;
4. keep the existing family itinerary; and
5. research one future named-property family-hotel comparison.

The first implementation should improve the all-ages page. Exact current Semrush estimates show 5,400 monthly searches for `things to do in san antonio with kids` and 1,600 for the reversed-wording variant. These variants overlap and must not be added together. The existing page has only six primary attractions, then repeats them as filter cards, persona starts, a comparison, 42 detail fields, and five mini-plans. Its fresh GSC row has 11 impressions, zero clicks, and page-level average position 64.36.

One revised page can be materially more useful by offering roughly 12 earned choices, a compact filter/comparison surface, heat and indoor pivots, a real free/budget route, younger-child handling, and deeper notes only for high-friction choices. Current official facts must replace generic or unsupported route, stroller, accessibility, weather, ticket, and family-fit claims.

The named-hotel page should remain separate from the stay-area page:

- the stay page answers **which base best fits the family's first two days and midday reset**;
- the hotel page answers **which named property fits location, room function, approximate total nightly range, pool/resort role, and bounded recent online-review signals**.

Hotel and resort variants share a named-property selection job. Resort, lazy-river, suite, pool, and free-breakfast needs should be fields or filters on one future hotel page, not separate URLs.

Toddler, indoor/rain, free/budget, transport/stroller, and weekend modifiers are real planning needs. They do not all deserve pages. Use modules first. A static current-weekend page remains deferred until the repository has a freshness workflow.

Promoted next action:

- roadmap: `FT-IMP-018`
- implementation backlog: `IMP-036`
- research review: `SRR-028`
- title: "Improve the San Antonio all-ages things-to-do hub"
- target: `https://familytripwise.com/things-to-do/san-antonio-with-kids.html`

## Evidence Classification

| Evidence | Freshness | Classification and use | Limitation |
|---|---:|---|---|
| Repository pages, generator, sitemap, tests, and operator state | checked 2026-07-26 | Current source and operating model. | Does not establish demand or ranking. |
| `ops/gsc-snapshots/2026-07-26.json` and `.md` | collected 2026-07-26; finalized through 2026-07-24 | Fresh authenticated read-only API evidence. | Public-safe page aggregates only; not query ranks. |
| Logged-in Semrush Chrome session | collected 2026-07-26; US database dated July 2026 | Current directional exact volume, KD, intent, variants, and cached SERPs. | Similar variants overlap; unavailable fields are not zero. |
| Semrush Keyword Magic seed | inspected 2026-07-26 | Exposed 347 broad-match variants, 12,740 aggregate volume, and average KD 17. | Contains noise and overlapping phrases; aggregate volume is not unique traffic. |
| Semrush cached Google SERPs | July 2026 snapshots inspected 2026-07-26 | Query-level ranking URLs, result types, recurring domains, and SERP features. | Some snapshots errored; numeric overlap is recorded only for complete comparable samples. |
| Current public search and ranking pages | inspected 2026-07-26 | Current structure, topics, strengths, and source opportunities. | Result order varies; not rank tracking. |
| Public parent/community discussions | inspected 2026-07-26 | Qualitative questions, conflicts, and failure modes only. | Not demand, verified facts, or Family Tripwise firsthand experience. |
| Four current San Antonio pages | audited 2026-07-26 | Every visible section reviewed for job, repetition, persona usefulness, and source support. | Shared July 5 source lists do not support every current claim. |

## Fresh GSC Context

The snapshot is fresh and finalized through July 24. The four San Antonio page rows total 105 impressions and zero clicks. These are early page-level discovery signals, not query-specific ranks or causal evidence.

| Page | Impressions | Clicks | Page-level average position |
|---|---:|---:|---:|
| All-ages things to do | 11 | 0 | 64.36 |
| Teen activities | 3 | 0 | 9.00 |
| Stay areas | 85 | 0 | 80.14 |
| Family itinerary | 6 | 0 | 27.17 |

The teen position is based on only three impressions. It is not evidence that the page has achieved a stable top-10 query rank.

## Query Universe And Directional Demand

Values below are US monthly estimates from the authenticated Semrush session on 2026-07-26. Exact variants overlap and must not be summed.

| Theme | Representative exact evidence | Intent | Page treatment |
|---|---|---|---|
| Broad family activities | `things to do in san antonio with kids` 5,400, KD 19; reversed wording 1,600, KD 20; `san antonio things to do with kids` 880, KD 21 | informational | Existing all-ages hub; first implementation. |
| City-with-kids planning | `san antonio with kids` 590, KD 23; `san antonio family vacation` 170, KD 4 | informational | Route through the four core planning pages; no generic duplicate. |
| Free/budget | `free things to do in san antonio with kids` 480, KD 16; `cheap...` 30, KD unavailable | informational | Strong all-ages module first; preserve as a future split candidate only if later SERP/GSC evidence supports it. |
| Indoor/weather | `indoor activities san antonio` 720, KD 18; exact family modifier 10; generic rainy-day 40 with KD unavailable | mixed | All-ages filter and itinerary pivot; no standalone family page now. |
| Toddlers/young children | `things to do in san antonio with toddlers` 90, KD 11; `san antonio with toddlers` 10 | informational | Younger-child route/filter in the all-ages page. |
| Teens/mixed ages | `things to do in san antonio with teens` 140, KD 22; `san antonio with teens` 70, KD 10 | informational | Keep existing teen specialist. |
| Stay areas | `where to stay in san antonio` 590, KD 38; `best area to stay in san antonio` 140, KD 21; family variants 10-20 | informational/commercial | Keep area page; tighten visitor-versus-relocation framing. |
| Family hotels | `family friendly hotels in san antonio` 170, KD 20; `best family hotels in san antonio` 140, KD 18; `kid friendly hotels...` 30 | commercial | One future named-property comparison. |
| Resorts and pools | `san antonio resorts for families` 110, KD 19; `family friendly resorts...` 40, KD 9; `san antonio resort with lazy river` 140, KD 20 | commercial | Fields and trip-style starts on the hotel page. |
| Hotel convenience | `san antonio hotels with free breakfast` 50, KD 22; `hotels with water slides` 20 | commercial | Hotel comparison fields, not separate URLs. |
| Itinerary | `san antonio itinerary` 260, KD 10; `san antonio 3 day itinerary` 40, KD 16; family-specific itinerary phrases 0 | informational | Keep one sequencing page; no duration URLs. |
| Weekend/current | `things to do in san antonio this weekend with kids` 50, KD 22 | freshness-sensitive | Deferred until a current-content workflow exists. |
| Stroller/car/nap friction | exposed in related variants and recurring parent questions; sampled standalone demand unavailable | informational subproblem | Cross-page fields and stop rules. |

`Unavailable` means Semrush did not show a usable metric. The exact family-itinerary seeds displayed zero; this does not erase the broader itinerary job or the page's six GSC impressions.

## Observed SERP Sets And Overlap

Collection date: 2026-07-26. Counts refer only to the visible sampled organic sets, not the entire Google index.

| Exact query pair or family | Observed ranking pages/domains | Overlap and page type | Features | Decision / confidence |
|---|---|---|---|---|
| `things to do in san antonio with kids` vs `things to do with kids in san antonio` | Bridges and Balloons, Visit San Antonio, Big Brave Nomad, Tripadvisor, KidsOutAndAbout, MinneMama, and Family Travel Magazine recur | Six retained exact URLs plus one domain-only recurrence; same broad family-list/guide job | AI overview, top sights/local cards, social/UGC, PAA | One all-ages page; **high**. |
| `family friendly hotels in san antonio` vs `best family hotels in san antonio` | Alamo City Moms, Tripadvisor, Facebook discussions, and Marriott recur; Reddit appears in one set and Family Adventures in the other | Three retained exact URLs plus one domain-only recurrence; same named-property/list job | Hotel pack/map, editorial lists, OTAs, UGC, property pages | One hotel page; **high**. |
| Family hotels vs `san antonio resorts for families` | Tripadvisor and community/property result types recur; JW Marriott and Texas resort pages enter | Domain/page-type overlap, but resort intent emphasizes property amenities and destination-style stays | Hotel/property modules and UGC | One hotel page with resort/lazy-river route; **medium-high**. |
| Broad activities vs free family activities | Visit San Antonio and KidsOutAndAbout recur at domain level; dedicated free/cheap pages enter | Numeric exact-URL overlap is `UNKNOWN`; inventory overlaps but cost-first pages are distinct | Free lists, event inventory, official/local pages | Strong module now; reconsider later; **medium**. |
| Broad activities vs toddlers | Broad and official family pages recur; age-specific official itinerary pages enter | Complete comparable top sets were not retained; numeric overlap is `UNKNOWN` | Family lists, age-specific itineraries, community threads | Younger-child route first; **medium**. |
| Broad activities vs teens | Visit San Antonio teen itinerary and teen-specific local/editorial pages appear | Recommendation logic is more distinct, while complete numeric overlap is `UNKNOWN` | Teen itineraries, local lists, UGC | Keep specialist; **medium-high**. |
| Stay areas vs family hotels | Family stay searches blend neighborhood, relocation, hotel-list, and community results; hotel queries are named-property led | Different decision object: base geography versus property | Hotel packs, area guides, relocation pages, UGC | Separate pages; **medium-high**. |
| Generic itinerary and family duration variants | Visit San Antonio 3-day age itineraries, itinerary hub, 48-hour family guide, and family publishers recur | Sequencing page type; numeric overlap is `UNKNOWN` | Day plans, official itineraries, UGC | One itinerary page; **medium-high**. |

### Retained Core Activity Samples

Sample A, `things to do in san antonio with kids`, July 2026 cached desktop SERP:

- [Bridges and Balloons](https://bridgesandballoons.com/san-antonio-kids-activities/)
- [Visit San Antonio family fun](https://www.visitsanantonio.com/things-to-do/family-fun/)
- [Big Brave Nomad](https://www.bigbravenomad.com/blog/san-antonio-texas-with-kids)
- [KidsOutAndAbout free places](https://sanantonio.kidsoutandabout.com/content/free-places-take-kids-and-around-san-antonio)
- [Tripadvisor family attractions](https://www.tripadvisor.com/Attractions-g60956-Activities-zft11306-San_Antonio_Texas.html)
- Eventbrite free-kids result; exact URL was not retained and is not counted as an exact-URL overlap.
- MinneMama Adventures result; domain retained, exact URL not retained.
- [Family Travel Magazine](https://www.familytravelmagazine.com/things-to-do-in-san-antonio-with-kids/)
- Fun4AlamoKids calendar result; exact URL was not retained and is not counted as an exact-URL overlap.

Sample B, `things to do with kids in san antonio`, July 2026 cached desktop SERP:

- the same exact Bridges and Balloons URL;
- the same exact Visit San Antonio family-fun URL;
- the same exact Big Brave Nomad URL;
- the same exact Tripadvisor family-attractions URL;
- the same exact KidsOutAndAbout free-places URL;
- MinneMama Adventures at the domain level; exact URL not retained;
- the same exact Family Travel Magazine URL.

Intersection: six retained exact URLs, one additional domain-only recurrence, and the same broad editorial/official/review-list page type. No result with an unretained URL is counted as exact overlap.

### Retained Core Hotel Samples

Sample A, `family friendly hotels in san antonio`, July 2026 cached desktop SERP:

- [Alamo City Moms: six kid-friendly hotels](https://alamocitymoms.com/motherhood-parenting/six-kid-friendly-san-antonio-hotels-for-your-next-family-getaway/)
- [Tripadvisor San Antonio family hotels](https://www.tripadvisor.com/Hotels-g60956-zff4-San_Antonio_Texas-Hotels.html)
- Facebook local discussions at the domain level; exact thread URL not retained.
- [Marriott San Antonio family-friendly hotels](https://www.marriott.com/en-us/destinations/united-states/texas/san-antonio/family-friendly-hotels.mi)
- [Reddit kid-friendly hotel discussion](https://www.reddit.com/r/sanantonio/comments/1aygyba/kid_friendly_hotel/)
- Google hotel pack.

Sample B, `best family hotels in san antonio`, July 2026 cached desktop SERP:

- the same exact Alamo City Moms URL;
- the same exact Tripadvisor family-hotels URL;
- Facebook local discussions at the domain level; exact thread URL not retained;
- the same exact Marriott destination URL;
- [Family Adventures Blog: family resorts](https://familyadventuresblog.com/2025/01/15/family-resorts-in-san-antonio-texas/).

Intersection: three retained exact URLs, one additional domain-only recurrence, and the same named-property/list result family. The hotel-pack module is a SERP feature, not an organic URL. The conclusion is high confidence because both the decision object and retained intersections align, not because every result is identical.

## Representative Ranking-Page Analysis

| Page/domain | What it answers well | Weakness or opportunity | Advantage we cannot copy | Family Tripwise response |
|---|---|---|---|---|
| [Bridges and Balloons](https://bridgesandballoons.com/san-antonio-kids-activities/) | Current 19-item inventory, firsthand visit with ages 4 and 6, strong photos, meals, hotel, map, and memorable specifics. | Long narrative, limited consistent comparison fields, and mixes experienced with unvisited options. | Documented family trip and original photography. | Use a smaller current comparison, explicit evidence classes, age/heat/budget routing, and clearer choice reduction. |
| [Visit San Antonio family fun](https://www.visitsanantonio.com/things-to-do/family-fun/) | Broad current local inventory, official attraction links, museums, parks, events, budget ideas, and destination context. | Promotional tone and choice volume; little explicit stop logic or family-constraint comparison. | Destination organization access, local inventory, and event maintenance. | Cite current primary facts while adding calmer family decision support and uncertainty. |
| [Big Brave Nomad](https://www.bigbravenomad.com/blog/san-antonio-texas-with-kids) | Firsthand week-long family context, practical details, free options, restrooms, heat, and family photos. | Published 2023; some universal recommendations and unvisited entries; long prose. | Firsthand family experience and original media. | Date every current claim, separate observed from official, and make comparisons easier to scan. |
| [Tripadvisor family attractions](https://www.tripadvisor.com/Attractions-g60956-Activities-zft11306-San_Antonio_Texas.html) | Very large current review volume, ranking/filter utility, maps, and traveler photos. | Popularity and review volume do not resolve age, pace, heat, reset, and route decisions cleanly. | Review scale and transactional ecosystem. | Summarize bounded decision fields and route to primary sources; do not imitate review volume. |
| [Alamo City Moms: six kid-friendly hotels](https://alamocitymoms.com/motherhood-parenting/six-kid-friendly-san-antonio-hotels-for-your-next-family-getaway/) | Local parent framing and a concise named-property shortlist. | Small hotel set and limited uniform occupancy, total-night, conflict, and freshness comparison. | Local publisher identity and community trust. | Future hotel evidence pack should compare a broader candidate pool with official facts, price ranges, and bounded review observations. |
| [Visit San Antonio young-kids itinerary](https://www.visitsanantonio.com/plan-your-trip/itineraries/young-kids/), [ages 6-12](https://www.visitsanantonio.com/plan-your-trip/itineraries/older-kids/), and [teens](https://www.visitsanantonio.com/plan-your-trip/itineraries/teens/) | Current official trip sequencing by age and duration. | Promotional and generalized; limited hotel-base, stop-rule, and child-energy decisions. | Destination authority and current inventory. | Keep one practical itinerary with explicit deletions, resets, and route choices. |

The strategic opportunity is not to claim local or firsthand authority. It is to use AI-assisted research well: inspect more current sources, normalize fields, expose conflicts and unknowns, reduce choice cost, and keep every decision surface fresh and calm.

## Persona Hypotheses

These are research hypotheses derived from query modifiers, ranking-page structure, public parent questions, and current product constraints. They are not demographic truth.

| ID | Persona hypothesis | Job to be done | Trip context | Child age / pace constraints | Anxieties | Decision criteria | Failure mode | Evidence basis | Pages |
|---|---|---|---|---|---|---|---|---|---|
| `SA-P1` | First-time icon family | Combine San Antonio context with one child-payoff anchor without turning a short trip into transfers. | First visit, usually one to three days, with Alamo/River Walk expectations. | Mixed ages; one meaningful anchor and a protected reset beat a full checklist. | Missing the signature city experience; parking, heat, and cross-city friction. | One coherent zone, child payoff, current entry checks, and an easy deletion. | A downtown marathon followed by a cross-city attraction. | [Visit San Antonio ages 6-12 itinerary](https://www.visitsanantonio.com/plan-your-trip/itineraries/older-kids/); [family vacation discussion](https://www.reddit.com/r/sanantonio/comments/1tt0ljm/recommendations_for_family_vacation_to_san_antonio/); [downtown planning question](https://www.tripadvisor.com/ShowTopic-g60956-i76-k13849103-Downtown_San_Antonio_musts_with_kids-San_Antonio_Texas.html). | All-ages, stay, itinerary. |
| `SA-P2` | Heat-and-reset younger-child family | Keep a toddler or young child regulated through heat, meals, bathroom, splash/indoor time, nap, and an easy exit. | Warm-weather visitor day with a hotel or car reset. | Toddler through early elementary; short sessions, midday reset, stroller/carrier unknowns. | Overheating, overstimulation, missed nap, and an anchor that is hard to leave. | Indoor/shaded option, bathroom/food path, exit flexibility, and short reset distance. | An all-outdoor day or a rigid anchor after the child is done. | [Visit San Antonio young-kids itinerary](https://www.visitsanantonio.com/plan-your-trip/itineraries/young-kids/); [beating the heat with toddlers](https://www.reddit.com/r/sanantonio/comments/1s7s9jj/beating_the_heat_with_toddlers/); [toddler activity question](https://www.reddit.com/r/sanantonio/comments/1t15ht4/ideas_for_a_toddler/). | All-ages, stay, itinerary. |
| `SA-P3` | Theme-park or resort family | Decide whether SeaWorld, Six Flags, a resort pool, or lazy river is the trip anchor and choose a compatible base. | Car-based stay where the property or theme park may be the destination. | Height splits, pool supervision, room occupancy, and downtime across siblings. | Paying for a resort that is poorly located for the actual plan; hidden parking/fee and room-function tradeoffs. | Anchor location, pool/resort role, room function, broad total night, parking, and current operating checks. | Booking downtown while most days are northwest, or treating a theme park as a half-day add-on. | [Reddit kid-friendly hotel](https://www.reddit.com/r/sanantonio/comments/1aygyba/kid_friendly_hotel/); [hotel recommendations for a toddler](https://www.reddit.com/r/sanantonio/comments/1pzog2p/hotel_recs_for_toddler/); [Hyatt Hill Country with a young child](https://www.reddit.com/r/sanantonio/comments/1toqtvc/hyatt_regency_hill_country_and_17_month_old/). | Future hotels, stay, all-ages, itinerary. |
| `SA-P4` | Teen or mixed-age family | Give older kids a real adventure, food, culture, or ride choice while preserving one workable shared day. | Teen trip or mixed siblings/grandparents with different interests. | Higher stamina but different thrill tolerance, supervision needs, and sibling pace. | A younger-child-only day, expensive mismatch, or too many incompatible anchors. | Teen-chosen payoff, explicit sibling split, current height/content checks, and one shared reset. | Incompatible anchors stacked together with no one getting a satisfying choice. | [Visit San Antonio teen itinerary](https://www.visitsanantonio.com/plan-your-trip/itineraries/teens/); [family vacation with two teenagers](https://www.reddit.com/r/sanantonio/comments/1kp2oow/family_vacation_with_two_teenagers_to_san_antonio/); [activities for ages 8-10](https://www.reddit.com/r/sanantonio/comments/1tv6ra8/activity_recommendations_for_kids_810/). | Teen, all-ages, itinerary. |
| `SA-P5` | Budget/local-style family | Build a worthwhile trip from free and low-cost parks, missions, play/splash spaces, libraries, and selected paid anchors. | Cost-conscious visitor or local-style weekend using a car or a compact base. | Flexible pace; free dates and events may be volatile, and long transfers erase savings. | Stale "free" promises, parking/meal costs, weather, and spending the day driving. | Durable free inventory, dated current checks, geographic grouping, and one optional paid anchor. | A "free" plan built from expired offers or long cross-city transfers. | [Visit San Antonio free fun](https://www.visitsanantonio.com/things-to-do/free-fun-in-san-antonio/); [KidsOutAndAbout free places](https://sanantonio.kidsoutandabout.com/content/free-places-take-kids-and-around-san-antonio); [spring-break family discussion](https://www.reddit.com/r/sanantonio/comments/1rg9kia/spring_break_in_san_antonio_what_are_the/). | All-ages, itinerary, stay. |

## Every-Page And Every-Section Audit

### All-ages things to do

URL: `https://familytripwise.com/things-to-do/san-antonio-with-kids.html`

Role: acquisition and activity decision hub.

| Current section | Finding | Decision |
|---|---|---|
| Hero, trust copy, media | Clear intent, but generic July 5 method text and shared River Walk image do not signal the breadth or current evidence. | Replace with concise source/freshness framing and optimized dimensioned media. |
| "Pick one anchor" starter | Good principle; two generic starter plans add little. | Keep the principle, replace starters with persona-led starts. |
| Six filter cards | Useful fields but too few choices; no real filters and repeated later. | Expand from a reviewed candidate pool to about 12 earned choices and make the comparison/filter surface primary. |
| Teen sibling card | Useful route, but it interrupts the main inventory. | Move to cluster routing. |
| Eight family-situation quick picks | Repeats the same six choices and makes universal "best" statements. | Replace with five conditional `SA-P1` to `SA-P5` starts. |
| Six-row decision table | Useful concept; narrow inventory and categorical stroller/rain/nap verdicts are overconfident. | Rebuild one complete comparison with calibrated fields and current checks. |
| Six detailed activity notes | Forty-two fields repeat the cards/table. | Keep deeper notes only for high-friction choices. |
| Five mini-plans | Duplicates the itinerary page and repeats the same anchors. | Remove; route to itinerary and preserve only short stop/pairing logic. |
| Sources | Six shared links omit current sources for several discussed choices, including Six Flags and free/indoor additions. | Build a current primary-source register for every material retained claim. |
| FAQs/schema | Two broad answers are serviceable but overly universal. | Use three visible, source-aligned questions and keep schema exact. |

Persona result: fails `SA-P1` through `SA-P5` mainly through choice poverty, repetition, and unsupported categorical fields, not through lack of prose.

### Teen activities

URL: `https://familytripwise.com/things-to-do/san-antonio-with-teens.html`

Role: distinct older-kid and mixed-age specialist.

| Current section | Finding | Decision |
|---|---|---|
| Hero/trust/media | Clear teen intent, but generic and dated July 5. | Refresh later with teen-specific evidence and current media. |
| Four initial cards | Narrow and repeated in the six-row comparison. | Replace with interest-led starts when reviewed. |
| Eight quick picks | Useful heat and trip-base concerns, but still ranks universal "best" choices. | Compress to conditional teen/mixed-age starts. |
| Six-row comparison | Includes meaningful distinct roles, but categorical fit and source coverage are weak. | Keep one current comparison after broader candidate review. |
| Six detailed notes | Repeats rows and relies on generic family statements. | Retain only high-friction details such as caverns, theme parks, and mixed-age splits. |
| Five route ideas | Useful page-specific job but abstract. | Convert to two or three executable route shapes with stop rules. |
| Cluster links | Correctly routes all-ages, stay, and itinerary. | Keep; add future hotel route when published. |
| Sources and FAQ/schema | Shared six-link source set misses several teen claims; FAQ includes an internal indexability question users do not need. | Replace with current sources and user-facing questions. |

Persona result: useful mainly for `SA-P4`, but it needs a full candidate/source/every-section pass after the all-ages page.

### Stay areas

URL: `https://familytripwise.com/where-to-stay/san-antonio-with-kids.html`

Role: area and base selection, not named hotels.

| Current section | Finding | Decision |
|---|---|---|
| Hero/trust/media | Search job is clear; generic source framing and River Walk image are not enough. | Refresh later. |
| Two starter plans | Correct area-first principle but weak decision support. | Replace with route/base starts. |
| Three generic cards | Hotel shortlist, stroller/transit, and booking filters repeat later checklists. | Remove or route the hotel card to the future comparison. |
| Eight quick picks | Overstates universal "best" areas and repeats the five-row table. | Replace with five conditional starts. |
| Five-area table | Correct inventory, but 11 columns include unsupported noise and stroller labels. | Keep one simpler route/reset/transport comparison. |
| Six hotel-verification cards | Twenty-seven checks are verbose and partly outside the area job. | Compress to only decisive current checks; hand named properties to hotel page. |
| Sources and FAQ/schema | Shared attraction sources do not establish parking, area, transit, or route claims. | Use direct city/transit/area sources and calibrated FAQs. |

Persona result: serves `SA-P1` to `SA-P3`, but the current 85 impressions at average position 80.14 and blended travel/relocation SERP require sharper visitor framing. Keep the URL and improve after the all-ages and hotel evidence work.

### Family itinerary

URL: `https://familytripwise.com/family-itinerary/san-antonio-with-kids.html`

Role: sequencing, resets, and stop rules.

| Current section | Finding | Decision |
|---|---|---|
| Hero/trust/media | Correct intent but generic. | Refresh later. |
| Nap-friendly structure and age adjustment | Useful principles but not an executable plan. | Integrate into concrete day shapes. |
| Condensed weekend and three utility cards | Repeats planning rules without giving real routes. | Replace. |
| Eight quick picks and six-row variant table | Duplicate duration/persona summaries. | Use three trip-length starts and a few useful pivots. |
| Six pacing cards | Abstract and repetitive. | Replace with executable day cards, deletions, and stop rules. |
| Cluster links | Correctly routes all-ages, teen, and stay. | Keep; add hotel route when published. |
| Sources and FAQ/schema | Shared source set is thin for route/transport/weather decisions. | Add current primary checks and user-facing, schema-aligned FAQs. |

Persona result: conceptually serves all five personas but currently makes families translate summaries into a schedule themselves. Improve after the acquisition and hotel jobs.

## Cannibalization And Internal-Link Decisions

| Query family | Owner | Boundary |
|---|---|---|
| General family attractions, free/indoor/young-child filtering | All-ages things-to-do page | Does not own full itineraries or named hotels. |
| Teen/tween interests and mixed-age older-child routes | Teen page | Does not repeat the full all-ages inventory. |
| Neighborhood/base, midday return, car/parking geography | Stay-area page | Does not compare named properties. |
| Named family hotels, resorts, lazy river, room/price/review signals | Future hotel page | Does not rank areas or become a booking engine. |
| One-, two-, and three-day order, pivots, and stop rules | Itinerary page | Does not repeat full activity or hotel inventories. |
| Today/weekend/current events | Deferred | Requires maintained freshness before publication. |

The current four pages link to one another unevenly. The all-ages page routes to the teen page but does not provide a calm full cluster handoff. The stay and itinerary pages lack a hotel destination because none exists. Each future implementation should add only relevant cluster routes and preserve the page's own job.

## Opportunity Matrix

| Opportunity | Demand / discovery | Usefulness gap | Evidence confidence | Decision |
|---|---|---|---|---|
| Improve all-ages hub | Very high exact demand; 11 GSC impressions at avg 64.36 | Six repeated choices; weak free/indoor/heat support | High | **First**: `FT-IMP-018`. |
| Publish family-hotel comparison | 170/140 hotel variants plus 110 resort and 140 lazy-river variants; overlap | No named-property page; current stay page cannot answer property questions | High for page job; evidence pack not built | Research/publish after all-ages. |
| Improve stay areas | 85 GSC impressions at avg 80.14; generic area demand 590 | Verbose, universal defaults, weak area sources | Medium-high | Keep; improve after hotel boundary exists. |
| Improve teen specialist | 140/70 exact variants; 3 GSC impressions at avg 9 | Distinct but narrow/repetitive and under-sourced | Medium-high | Keep; review after hotel/stay or when authorized. |
| Improve itinerary | Generic 260; 6 GSC impressions at avg 27.17 | Abstract and repetitive | Medium-high | Keep; improve after acquisition/hotel/stay. |
| Separate free page | 480 exact family query; partly distinct result family | Could offer real value, but all-ages page is currently too weak to test the boundary | Medium | Module first; reconsider from later overlap/GSC evidence. |
| Separate toddler/indoor/resort/duration pages | Some modifier demand | High cannibalization and maintenance risk | Medium | Do not create now. |

## Promoted Action: FT-IMP-018

Target: `https://familytripwise.com/things-to-do/san-antonio-with-kids.html`

Scope:

- review at least 18 candidate activity roles and retain roughly 10-14 only when each earns a distinct family decision role;
- apply `SA-P1` through `SA-P5`;
- replace repeated quick picks, narrow cards, duplicate detail, and mini-itineraries with one filterable comparison, five conditional starts, bounded high-friction notes, stop rules, and cluster routes;
- provide real free/budget, indoor/heat, younger-child, teen/mixed-age, and theme-park routing;
- use current direct official sources for every material retained claim;
- keep unsupported exact route, stroller, accessibility, safety, weather, price, ticket, timing, age-fit, and universal family-suitability claims out of the page.

Acceptance:

1. The existing URL remains canonical, indexable, and present once in the sitemap.
2. The candidate ledger explains every keep/defer decision and traces retained choices to personas and direct sources.
3. Roughly 10-14 distinct choices appear in one complete comparison; no list-length quota overrides evidence.
4. One scan-first filter layer supports age, indoor/heat, free/budget, teen/mixed-age, and trip-style decisions without duplicating the table in prose.
5. Only high-friction choices receive deeper notes.
6. Mini-itinerary duplication is removed; the page routes to teen, stay, and itinerary roles.
7. Visible FAQs and structured data agree.
8. Target-only generation, focused and full tests, SEO QA, responsive/browser checks, source/privacy/scope checks, and independent reviewer `PASS` or `PASS_WITH_P3` all pass.

Measurement:

- baseline: 11 impressions, zero clicks, page-level average position 64.36 in the July 26 snapshot finalized through July 24;
- record release commit, Pages run, production invariants, and production SEO QA if separately authorized and released;
- observe crawl, page-level impressions, query-family discovery, and later clicks without requesting indexing;
- do not call page-level average position a query rank, sum Semrush variants, or claim the content change caused later movement;
- do not impose an artificial observation hold on useful, separately authorized sibling-page work.

## Source Register

Current search/ranking and qualitative sources inspected July 26:

- [Visit San Antonio family fun](https://www.visitsanantonio.com/things-to-do/family-fun/)
- [Visit San Antonio free family fun](https://www.visitsanantonio.com/things-to-do/free-fun-in-san-antonio/)
- [Visit San Antonio itinerary for young kids](https://www.visitsanantonio.com/plan-your-trip/itineraries/young-kids/)
- [Visit San Antonio itinerary for ages 6-12](https://www.visitsanantonio.com/plan-your-trip/itineraries/older-kids/)
- [Visit San Antonio itinerary for teens](https://www.visitsanantonio.com/plan-your-trip/itineraries/teens/)
- [Bridges and Balloons San Antonio kids activities](https://bridgesandballoons.com/san-antonio-kids-activities/)
- [Big Brave Nomad San Antonio with kids](https://www.bigbravenomad.com/blog/san-antonio-texas-with-kids)
- [Family Travel Magazine San Antonio with kids](https://www.familytravelmagazine.com/things-to-do-in-san-antonio-with-kids/)
- [KidsOutAndAbout free places](https://sanantonio.kidsoutandabout.com/content/free-places-take-kids-and-around-san-antonio)
- [Alamo City Moms: six kid-friendly hotels](https://alamocitymoms.com/motherhood-parenting/six-kid-friendly-san-antonio-hotels-for-your-next-family-getaway/)
- [Tripadvisor family attractions](https://www.tripadvisor.com/Attractions-g60956-Activities-zft11306-San_Antonio_Texas.html)
- [Tripadvisor family hotels](https://www.tripadvisor.com/Hotels-g60956-zff4-San_Antonio_Texas-Hotels.html)
- [Marriott family-friendly hotels](https://www.marriott.com/en-us/destinations/united-states/texas/san-antonio/family-friendly-hotels.mi)
- [Family Adventures Blog family resorts](https://familyadventuresblog.com/2025/01/15/family-resorts-in-san-antonio-texas/)
- [The DoSeum](https://www.thedoseum.org/visit)
- [The Alamo](https://www.thealamo.org/visit)
- [San Antonio Zoo plan-your-visit page](https://sazoo.org/visit/)
- [Natural Bridge Caverns](https://naturalbridgecaverns.com/)
- [GO RIO Cruises](https://www.goriocruises.com/)
- [Hemisfair](https://hemisfair.org/)
- [Morgan's Wonderland](https://morganswonderland.org/)

Qualitative community sources inspected:

- [Recommendations for a family vacation with children ages 4-10](https://www.reddit.com/r/sanantonio/comments/1tt0ljm/recommendations_for_family_vacation_to_san_antonio/)
- [Beating the heat with toddlers](https://www.reddit.com/r/sanantonio/comments/1s7s9jj/beating_the_heat_with_toddlers/)
- [Ideas for a toddler](https://www.reddit.com/r/sanantonio/comments/1t15ht4/ideas_for_a_toddler/)
- [Spring-break family planning](https://www.reddit.com/r/sanantonio/comments/1rg9kia/spring_break_in_san_antonio_what_are_the/)
- [Activities for children ages 8-10](https://www.reddit.com/r/sanantonio/comments/1tv6ra8/activity_recommendations_for_kids_810/)
- [Family vacation with two teenagers](https://www.reddit.com/r/sanantonio/comments/1kp2oow/family_vacation_with_two_teenagers_to_san_antonio/)
- [Kid-friendly hotel](https://www.reddit.com/r/sanantonio/comments/1aygyba/kid_friendly_hotel/)
- [Hotel recommendations for a toddler](https://www.reddit.com/r/sanantonio/comments/1pzog2p/hotel_recs_for_toddler/)
- [Hyatt Hill Country with a young child](https://www.reddit.com/r/sanantonio/comments/1toqtvc/hyatt_regency_hill_country_and_17_month_old/)
- [Downtown planning with kids](https://www.tripadvisor.com/ShowTopic-g60956-i76-k13849103-Downtown_San_Antonio_musts_with_kids-San_Antonio_Texas.html)

These discussions were used only to identify questions about heat, toddlers, mixed ages, multigenerational pace, pools/resorts, stroller/carrier choices, free activities, and current events. No anecdote is treated as demand, verified logistics, or Family Tripwise firsthand experience.
