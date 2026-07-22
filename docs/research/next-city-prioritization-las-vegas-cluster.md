# Next City Prioritization and Las Vegas Cluster Decision Pack

Status: internal research decision pack

Action: `FT-RES-007`

Prepared: 2026-07-22

Scope: choose the next existing pilot city, then define its search cluster, personas, current-page gaps, and one next implementation

Publication state: research-only; no `site/**` edit, indexing request, automation, or external-account mutation

## Decision

Target **Las Vegas next**, one page at a time.

Las Vegas has the strongest combined signal among the four remaining pilot cities:

- 200 page-level GSC impressions across four existing pages in the latest 28-day window, led by 180 impressions for the all-ages activities page.
- Meaningful activity demand plus the deepest commercial lodging family: `family friendly hotels in Las Vegas` (1,900 US searches/month), `best family hotels in Las Vegas` (880), `Las Vegas family resorts` (720), and `kid friendly hotels Las Vegas` (480) in the July 22 Semrush check.
- Distinct, useful family constraints that current ranking pages do not organize consistently: heat, long resort walks, casino/smoke exposure, pool value, room setup, age fit, free options, and realistic resets.
- Four existing indexable pages that can be improved before the site adds a new hotel URL.

The next implementation should improve the existing all-ages Las Vegas activities page after a full candidate and section review. A separate family-hotel page is justified by the hotel-list SERP, but it should follow rather than compete with that first implementation.

## Evidence and Freshness

| Evidence | Source | Freshness | Use | Limit |
|---|---|---:|---|---|
| Repository state | `main` at `31bba30652d76c3d1664193532a9c508a83c6f32` at action start | current 2026-07-22 | Current page inventory, content, roadmap, and review state. | Does not prove current Google crawl state by itself. |
| GSC public-safe snapshot | `ops/gsc-snapshots/2026-07-22.md` | collected 2026-07-22; finalized through 2026-07-20 | Page-level impressions and average position; sitemap and inspection context. | Zero clicks and low impressions make this directional. Snapshot omits protected raw queries, credentials, country, and device rows. |
| Semrush Keyword Overview | Logged-in US bulk analysis of 65 exact phrases | collected 2026-07-22; UI reported July 2026 metrics, generally refreshed within one month | Directional monthly volume and KD comparison across four cities. | Exact phrases overlap and cannot be summed into unique demand or traffic. API units were unavailable, so the authenticated browser UI was used. |
| Public SERPs | Google result snapshots and page inspection | collected 2026-07-22 | Ranking URL/domain overlap, page types, SERP features, and search-job boundaries. | Rankings vary by time, location, and personalization; this is not a rank tracker. |
| Ranking pages | Representative official, publisher, OTA, blog, and community results | checked 2026-07-22 | What current results answer well and where a cleaner decision surface can help. | Representative, not exhaustive; no firsthand experience is inferred. |
| Parent/community pages | Reddit and family-travel discussions surfaced in sampled SERPs | checked 2026-07-22 | Qualitative anxieties and question shapes. | Anecdotes are not demand, official facts, or verified experience. |
| Existing research | `docs/plan/5-city-page-build-brief.md`, `docs/research/age-specific-family-travel-demand.md`, current page artifacts | checked 2026-07-22 | Historical context and normalized city/page roles. | Current Semrush and GSC evidence supersedes stale numerical summaries where they conflict. |

## Cross-City Priority

GSC cluster impressions sum only the listed current canonical pages for that city. Keyword figures are selected exact-query rows from the same July 22 Semrush run. They overlap and are not a unique audience or traffic forecast.

| Priority | City | Current pages in GSC | 28-day GSC impressions | Selection-driving exact queries | Commercial lodging depth | Decision |
|---:|---|---:|---:|---:|---|---|
| 1 | Las Vegas | 4 | 200 | broad activities 3,600; family-friendly hotels 1,900; best family hotels 880; teens 590 | Strongest: hotel, resort, pool/amenity variants | Work next. Best mix of discovery, demand, commercial intent, and an improvable existing cluster. |
| 2 | Chicago | 3 | 101 | broad activities 5,400; teens 720; family-friendly hotels 260; stay 110 | Modest, but clear stay/hotel intent | Follow with an activities-led pass; strong broad and teen demand. |
| 3 | New York City | 2 | 96 | broad `NYC` activities 3,600; stay 590; teens 590; best family hotels 390 | Stronger than Chicago/San Antonio, especially `where to stay in NYC with kids` | Follow with a lodging-led pass; complexity and competitive authority make it a larger research job. |
| 4 | San Antonio | 4 | 80 | broad activities 5,400; free 480; family resorts 480; family-friendly hotels 170 | Weaker hotel/stay fit despite attractive activity KD | Strong later activity opportunity, but current discovery and commercial depth trail Las Vegas. |

Why Las Vegas wins despite Chicago and San Antonio each having a 5,400-volume broad activity query:

1. Family Tripwise already has materially more Las Vegas discovery.
2. Las Vegas supports both informational activity pages and a separate high-intent hotel decision product.
3. Family constraints are unusually consequential and can create a genuinely better interface than another long list.
4. The work can start with one existing page; it does not require a batch or a new destination.

### Selection-driving keyword rows

The table below preserves the material rows used to compare cities. The complete logged-in run sampled 65 exact phrases, but omitted lower-volume rows are not used to manufacture an additive total. `n/a` means the UI did not return a usable metric.

| Query family | Las Vegas volume / KD | Chicago volume / KD | New York City volume / KD | San Antonio volume / KD |
|---|---:|---:|---:|---:|
| Primary `things to do ... with kids` | 3,600 / 20 | 5,400 / 26 | 3,600 / 24 (`NYC`) | 5,400 / 17 |
| Alternate broad word order | 1,300 / 20 | 1,600 / 26 | 1,300 / 28 | 1,600 / 20 |
| Full-name broad variant | included in primary | included in primary | 480 / 25 | included in primary |
| Family activities | 590 / 27 | lower-volume batch row | lower-volume batch row | 320 / 25 |
| Free things with kids | 390 / 11 | 260 / 20 | 260 / 12 | 480 / 16 |
| Things to do with teens | 590 / 21 | 720 / 24 | 590 / 11 | 140 / 22 |
| Things to do with toddlers | 40 / 4 | 170 / 14 | 110 / 5 | 90 / 11 |
| Where to stay with kids | 20 / n/a | 110 / 12 | 590 / 7 | 0 / n/a |
| Best family hotels | 880 / 30 | 90 / 19 | 390 / 29 plus `NYC` 90 / 9 | 140 / 18 |
| Family-friendly hotels | 1,900 / 24 | 260 / 20 | 210 / 26 | 170 / 20 |
| Family resorts | 720 / 24 | lower-volume batch row | lower-volume batch row | 480 / 51 |
| Family itinerary | 10 / n/a | lower-volume batch row | 90 / 0 | lower-volume batch row |

### Decision score

Scores are 1-5 and higher is more favorable. For `Competition/risk`, a higher score means a more achievable, lower-risk opportunity. The score makes the judgment reproducible; it does not turn estimates into precision.

| City | Search opportunity | Existing discovery | Commercial depth | Product differentiation | Execution leverage | Competition / risk | Total / 30 |
|---|---:|---:|---:|---:|---:|---:|---:|
| Las Vegas | 5 | 5 | 5 | 5 | 5 | 3 | 28 |
| Chicago | 5 | 3 | 3 | 4 | 4 | 3 | 22 |
| New York City | 4 | 3 | 4 | 4 | 4 | 2 | 21 |
| San Antonio | 5 | 2 | 2 | 4 | 4 | 4 | 21 |

New York City ranks ahead of tied San Antonio because its lodging opportunity is materially deeper and more aligned with Family Tripwise's high-intent product. San Antonio remains attractive for a later lower-KD activity pass.

The 15 Las Vegas rows retained in the query universe below sum to 11,060 searches/month. That arithmetic is provided only to describe sampled query coverage; the rows overlap and the sum is not unique demand.

## Las Vegas Query Universe

US monthly volume and KD below are from the July 22, 2026 logged-in Semrush check. `n/a` means the interface did not return a usable metric; it is not zero.

| Theme | Representative query | Volume | KD | Likely page job |
|---|---|---:|---:|---|
| Broad activities | `things to do in Las Vegas with kids` | 3,600 | 20 | All-ages activity hub and cluster router. |
| Broad activities | `things to do with kids in Las Vegas` | 1,300 | 20 | Same hub. |
| Broad activities | `Las Vegas family activities` | 590 | 27 | Same hub. |
| Broad activities | `kid friendly things to do in Las Vegas` | 390 | 16 | Same hub. |
| Free/budget | `free things to do in Las Vegas with kids` | 390 | 11 | Strong module now; possible standalone page after current evidence. |
| Toddler | `things to do in Las Vegas with toddlers` | 40 | 4 | Filter/section, not a standalone page yet. |
| Teens | `things to do in Las Vegas with teens` | 590 | 21 | Keep the existing standalone teen page. |
| Itinerary | `Las Vegas itinerary with kids` | 10 | n/a | Keep supporting itinerary page; product utility exceeds direct demand. |
| Itinerary | `Las Vegas family itinerary` | 10 | n/a | Same itinerary page. |
| Stay areas | `where to stay in Las Vegas with kids` | 20 | n/a | Existing area/property-constraint page. |
| Hotels | `family friendly hotels in Las Vegas` | 1,900 | 24 | Separate named-hotel comparison page. |
| Hotels | `best family hotels in Las Vegas` | 880 | 30 | Same named-hotel page. |
| Hotels | `kid friendly hotels Las Vegas` | 480 | 25 | Same named-hotel page. |
| Resorts | `Las Vegas family resorts` | 720 | 24 | Same hotel page; SERP overlaps materially. |
| Hotel feature | `Las Vegas hotels with waterslides` | 140 | 18 | Hotel-page feature/filter, not its own page. |
| Indoor/heat | exact indoor family variants sampled | n/a | n/a | Activity filter/module; do not infer absent demand. |

## SERP-Overlap Clusters

Collection date: 2026-07-22. Clusters are based on recurring ranking domains/pages and page types, not wording similarity alone.

### Query-level observations

| Exact query sampled | Intent | Representative recurring ranking pages/domains observed | Page types / features | Overlap implication |
|---|---|---|---|---|
| `things to do in Las Vegas with kids` | Build a broad family activity shortlist | Visit Las Vegas family guide; TripAdvisor family attractions; Time Out; Conde Nast Traveler; The Traveling Child; La Jolla Mom | Official and editorial lists, family blogs, top sights, PAA, social | Core LV-C1 hub. |
| `things to do with kids in Las Vegas` | Same broad shortlist, alternate wording | Visit Las Vegas; TripAdvisor; Time Out; family blogs; attraction pages | Same result types plus map/top-sight features | Shares LV-C1 rather than needing another page. |
| `free things to do in Las Vegas with kids` | Minimize paid activity cost | Visit Las Vegas budget guide; Expedia; A Tiny Trip; The Vegas Mom; community results | Budget lists, PAA, social/community | Partial LV-C1 overlap but enough distinct results to track LV-C2; module first. |
| `things to do in Las Vegas with teens` | Find older-kid-specific experiences | Earth Trekkers teen guide; Fremont Street Experience teen guide; teen/family city guides | Teen lists, PAA, video/social | Distinct older-kid job supports the current LV-C3 URL. |
| `family friendly hotels in Las Vegas` | Compare named properties for a family stay | TripAdvisor; Booking.com; CN Traveler; KAYAK; VegasVox; family blogs | Hotel pack, OTA lists, map, PAA | Same named-property SERP as best/kid-friendly/resort variants: one LV-C4 page. |
| `best family hotels in Las Vegas` | Choose among named family hotels | TripAdvisor; CN Traveler; KAYAK; Las Vegas Then and Now; Oyster; family blogs | Editorial hotel lists, OTA modules, PAA | Strong LV-C4 overlap. |
| `Las Vegas family resorts` | Find resort-style properties with family amenities | TripAdvisor family resorts; Klook; Booking/OTA pages; publisher lists | Resort/hotel lists, hotel pack, map | Does not justify a separate resort URL because named-property results overlap LV-C4. |
| `where to stay in Las Vegas with kids` | Choose trip base and property/location tradeoffs | Named-hotel lists; local/personal stay guides; OTAs; forum answers | Hotel pack, map, PAA | Blended with LV-C4, but area/base decision remains a distinct page job in LV-C5. |
| `Las Vegas itinerary with kids` | Sequence a realistic family visit | Family itineraries; broad family guides; forum trip critiques | Itinerary lists, PAA, videos | Supporting LV-C6 page; limited direct demand. |

| Cluster | Queries sampled | Recurring pages/domains and result types | SERP features | Overlap decision | Confidence |
|---|---|---|---|---|---|
| LV-C1 all-ages activities | broad things-to-do, family activities, kid-friendly things | Visit Las Vegas, TripAdvisor, Time Out, Conde Nast Traveler, The Traveling Child, La Jolla Mom, Blogger at Large, family blogs | AI Overview, top sights/local results, PAA, social results | Same long guides, official lists, and attraction pages recur. One all-ages hub should serve these variants. | High |
| LV-C2 free/budget | free things, budget with kids | Visit Las Vegas budget guide, Expedia, A Tiny Trip, The Vegas Mom, local blogs, Reddit/social | PAA, list snippets, social/community | Partial overlap with broad guides, but a more budget-specific result set appears. Start as a prominent hub module; reconsider a page after evidence. | Medium-high |
| LV-C3 teens/tweens | teens, teenagers, older kids | Earth Trekkers, Fremont Street Experience, teen-specific city guides, general family guides | PAA, videos/social | The result set and decision criteria differ enough to preserve the existing teen URL. | High |
| LV-C4 hotel/resort selection | family-friendly hotels, best family hotels, kid-friendly hotels, family resorts | TripAdvisor, Booking.com, CN Traveler, KAYAK, VegasVox, Las Vegas Then and Now, family blogs, Oyster, Klook | hotel pack, OTA modules, PAA, map/local results | These variants repeatedly return named-hotel lists. `Family resorts` overlaps enough that it should not become a second page. | High |
| LV-C5 stay area and trip base | where to stay with kids, best area | Named-hotel lists, local/blog stay guides, OTA results, forum answers | hotel pack, maps, PAA | Blended with hotel SERP, but the user job can remain distinct: choose location/property constraints first, then compare named hotels. | Medium-high |
| LV-C6 itinerary/pacing | family itinerary, itinerary with kids, weekend | family itineraries, broad activity guides, forum trip critiques | PAA, videos | Low direct demand, but pages combine activities, hotel resets, and sequence. Keep as a support page, not a priority acquisition page. | Medium |
| LV-C7 toddler/heat/indoor friction | toddler, indoor, summer heat, stroller | broad guides, attraction pages, museums, community threads | local packs, PAA | Search evidence does not justify several separate URLs. These are filters and decision fields across the hub, stay, and itinerary pages. | Medium |

## Representative Ranking-Page Analysis

| Page/domain | What it does well | Weakness or unmet job | Advantage we cannot copy | Family Tripwise opportunity |
|---|---|---|---|---|
| Visit Las Vegas: `https://www.visitlasvegas.com/experience/post/things-to-do-in-las-vegas-with-kids/` | Current, comprehensive official guide with 31 activities. | Promotional; weak on tradeoffs and family-specific routing. | Destination authority and direct industry access. | Compare fewer meaningful choices by age, time, heat, walking, cost, and reset friction. |
| TripAdvisor family attractions and hotels | Huge review corpus, rankings, filters, prices, inventory. | Users still have to synthesize what fits their trip. | Review scale, brand authority, and booking inventory. | Summarize bounded review themes beside official facts and clear uncertainty. |
| Time Out: `https://www.timeout.com/las-vegas/things-to-do/things-to-do-with-kids-in-las-vegas` | Strong editorial curation and concise list format. | Limited family logistics and no integrated stay/pacing decision. | Local editorial brand and contributor experience. | Turn choices into practical family day shapes rather than a generic list. |
| Conde Nast Traveler family activity/hotel guides | Strong editorial selection, polished presentation, recognizable authority. | Small curated sets may omit budget, younger-child, and practical friction. | Editorial reputation and contributor access. | Broader trip-style coverage with transparent source dates and comparison fields. |
| La Jolla Mom Las Vegas guide | Very broad list and family/advisor framing. | Length makes fast comparison harder; commercial pathways dominate. | Advisor/local-style experience and audience authority. | Cleaner default recommendations by constraint without claiming firsthand experience. |
| The Traveling Child / family blogs | Parent voice, concrete trip stories, useful photos and examples. | One family's experience can be hard to generalize; currentness varies. | Firsthand travel narrative. | Build reusable decision support from official facts and clearly labeled research. |
| Earth Trekkers teen guide: `https://www.earthtrekkers.com/15-things-to-do-in-las-vegas-with-teenagers/` | Firsthand trip with teens and clear ranking by teen experience. | Less useful for mixed ages and current operational comparison. | Genuine firsthand family trip. | Preserve our teen page but differentiate on logistics, current checks, and mixed-family routing. |
| CN Traveler / KAYAK / VegasVox hotel lists | Named properties, clear editorial shortlist, some amenity context. | Inconsistent price/fee/pool/room/review evidence and limited trip-style comparison. | Brand authority or booking data. | A clean hotel decision table with rough total nightly ranges, official setup facts, bounded recent online-review themes, and map context. |
| Booking.com / TripAdvisor hotel SERPs | Current availability, prices, ratings, and filters. | Little explanation of heat, resort walking, casino exposure, room setup, and realistic family routines. | Inventory and review volume. | Explain the trip consequences of property choices without imitating an OTA. |
| Las Vegas Then and Now | Current local/personal hotel perspective and practical alternatives. | Less systematic evidence handling and comparison. | Personal/local familiarity. | More consistent sourcing, freshness, uncertainty, and scan structure. |

## What Can Be Better

Family Tripwise does not need a novel thesis on every page. The product edge can be disciplined execution:

- current official facts plus source and checked date;
- rough total nightly price ranges where supportable, not fee trivia in isolation;
- concise themes from recent online reviews, with conflicts and sample limits;
- age, heat, walking, smoke/casino exposure, pool, room setup, reset, and budget fields where evidence supports them;
- one compact comparison layer, then only the detail needed to choose;
- map links and cluster routing;
- explicit unknowns only where they affect a decision, without defensive boilerplate.

We cannot honestly copy a local publisher's residence, an advisor's client experience, a family's firsthand trip, an OTA's inventory, or a review platform's scale.

## Qualitative Community Themes

Community pages are used only to identify question shapes and possible decision fields. Individual comments are not verified facts, demand evidence, or reusable review prose.

| Community source | Bounded themes observed | Research use |
|---|---|---|
| `https://www.reddit.com/r/vegas/comments/1qs4nse/visiting_family_with_kids/` | Parents ask for age-fit activities, restaurants, day trips, and off-Strip options for children ages 5 and 8. | Grounds LV-P1's need for a short, age-aware plan rather than an undifferentiated Strip list. |
| `https://www.reddit.com/r/LasVegas/comments/1sdb481/las_vegas_with_kids_trip_report/` | A recent family trip report organizes choices around child ages, cost surprises, favorites, and whether the Strip environment fits the family. | Grounds comparison fields for age, cost context, and trip environment; anecdotal selections are not adopted as facts. |
| `https://www.reddit.com/r/vegas/comments/1qaxhs6/visiting_vegas_with_teen_bad_knees_hotel/` | A teen trip question combines mobility, hotel size, transport, event routes, food, and budget. | Grounds walking/route friction and the need to connect teen, stay, and activity decisions. |
| `https://www.reddit.com/r/vegas/comments/148fw89` | Hotel questions focus on pool features, non-casino properties, suites, balconies, location, and whether to visit an amenity rather than stay there. | Grounds LV-P2 criteria and the need to verify current property/room/pool facts. |
| `https://www.reddit.com/r/vegas/comments/13m74f0` | Families debate using the hotel as a trip anchor and compare room space, pools, on-property activities, location, and condition. | Supports a trip-style hotel comparison rather than a universal ranking. |
| `https://www.reddit.com/r/vegas/comments/1ajrsgz` | Toddler planning discussions separate researched ideas from personally tried ones and focus on age, cost, and off-Strip family infrastructure. | Grounds LV-P3 and reinforces explicit evidence classes. |

## Persona Hypotheses

These are research hypotheses derived from query modifiers, recurring parent questions, ranking-page structure, and the current product. They are not demographic truth.

### LV-P1 First-Time Family Feasibility Planner

- Job: decide whether Las Vegas can work for a family and assemble a short, recognizable trip.
- Context: first visit, two to four days, mixed priorities.
- Constraints: heat, long resort walks, casino-floor exposure, meal and reset timing.
- Anxieties: choosing adult-oriented stops, underestimating distance, overloading evenings.
- Criteria: one daily anchor, short visual stops, hotel reset, clear avoid/verify notes.
- Failure mode: a giant list that still leaves the day unplanned.
- Pages: all-ages hub, stay page, itinerary.

### LV-P2 Resort-and-Pool-Led Family

- Job: choose a hotel that is also a major part of the trip.
- Context: summer, weekend, or fly-and-flop trip.
- Constraints: pool season/hours/access, room setup, total nightly price, food, walking.
- Anxieties: paying for an amenity that is closed, restricted, crowded, or far from the room.
- Criteria: rough total range, official pool/room facts, current caveats, map context, recent review themes.
- Failure mode: a `best hotels` list with no trip-style consequences.
- Pages: future family-hotel page, stay page, all-ages hub.

### LV-P3 Heat, Stroller, and Younger-Child Planner

- Job: build short indoor/outdoor blocks with reliable resets.
- Context: baby through early elementary, naps or limited walking.
- Constraints: outdoor exposure, elevators/detours, stroller handling, bathrooms, sensory load.
- Anxieties: assuming adjacent Strip properties are easy to walk between.
- Criteria: contained stops, indoor backup, session length, route verification, hotel proximity.
- Failure mode: generic `kid friendly` labels with no logistics.
- Pages: all-ages hub filters/modules, stay page, itinerary; no toddler URL yet.

### LV-P4 Teen/Tween Experience Planner

- Job: find activities that feel distinctive and not designed for small children.
- Context: older kids, sometimes mixed-age siblings.
- Constraints: sensory tolerance, show age rules, later timing, food interests, younger sibling compromise.
- Anxieties: a page relabeling toddler/family staples as teen activities.
- Criteria: teen-specific reasons to choose, honest tradeoffs, mixed-age alternatives, practical route.
- Failure mode: duplicated all-ages content with `teen` inserted.
- Pages: teen guide, all-ages hub, itinerary.

### LV-P5 Budget and Short-Stay Planner

- Job: combine a few free or low-cost icons with one paid anchor.
- Context: road trip, one to two nights, convention add-on, or cost-sensitive family.
- Constraints: parking, resort pricing, ticket cost, time, heat.
- Anxieties: `free` activities that require expensive parking, long detours, or purchases.
- Criteria: real trip cost context, location, duration, current official link, easy combinations.
- Failure mode: an unstructured free list with stale details.
- Pages: all-ages hub free module first; possible free page later.

## Complete Current-Page Audit

| Current page | Search intent and role | What works | Missing decision support / trust gap | Overlap and links | Verdict |
|---|---|---|---|---|---|
| `https://familytripwise.com/things-to-do/las-vegas-with-kids.html` | Broad all-ages activity hub and cluster router. | Six choices, comparison table, quick situations, day-plan examples, links to teen/stay/itinerary. | Six choices are narrow beside current SERPs; hotel pool is not a named attraction; detail repeats similar fields; free, Downtown, animal/theme-park, show, and broader indoor coverage are thin; some `best` wording is firmer than the research posture. | Correctly links to all three sibling pages. Should keep age/friction routing and avoid duplicating teen detail. | **Improve first.** Run a full candidate and every-section review; broaden only with distinct, current, supported choices and compress repetition. |
| `https://familytripwise.com/things-to-do/las-vegas-with-teens.html` | Teen/tween specialist. | Dedicated URL matches 590-volume exact demand; GSC average position 11 on two impressions; teen-style cards, table, routes, and sibling links. | Six-choice set overlaps heavily with broad page; needs a test that every retained item has a teen-specific reason; some firm `best fit` language and generic logistics need review; current firsthand competitor is strong. | Keep standalone. It should receive candidates from the broad hub only when genuinely teen-specific. | **Keep, then review second.** Do section-level persona/competitor review after the hub; do not merge based on tiny GSC data. |
| `https://familytripwise.com/where-to-stay/las-vegas-with-kids.html` | Choose a base and property constraints, not a ranked hotel list. | Recently reframed around verification; five area hypotheses, comparison, three property examples, official checks. | Nearly 2,000 words and very defensive; only three named hotels; room/fee/pool checks repeat; no rough nightly ranges or recent online-review themes; title demand is small relative to hotel queries. | Hotel SERP overlaps, but the user job should remain area/constraint selection. Needs a future link to a dedicated hotel page. | **Keep and simplify later.** Preserve area role, reduce repeated verification prose, then route to the future hotel comparison. |
| `https://familytripwise.com/family-itinerary/las-vegas-with-kids.html` | Sequence a one-, two-, or three-day family trip. | Useful variants, stop rules, and links to activities, teen, and stay pages. | Direct demand is only about 20 across two sampled exact phrases; some plan claims need current source/route checks; repeated variants could be more compact and more tightly tied to the expanded hub. | Supporting page, not the primary acquisition target. | **Keep and observe.** Review after hub/stay changes so it consumes the final activity and lodging architecture. |

No unpublished Las Vegas prototype was found that changes the page decision.

## Page Architecture

| Priority | Page | Action | Reason |
|---:|---|---|---|
| 1 | Existing all-ages activities | Improve | Strongest GSC discovery and broad demand; natural router for all personas. |
| 2 | New family hotels | Research, then build one page | Hotel/resort variants share a named-list SERP and substantial commercial demand; no current page directly answers that named-property job. |
| 3 | Existing teen activities | Improve | Distinct 590-volume query and early position signal; keep observing while the hub is improved, then ensure every retained choice is genuinely teen-specific. |
| 4 | Existing stay page | Simplify and route | Keep area/property-constraint job; remove excess defensive repetition and link to hotel page. |
| 5 | Existing itinerary | Review after dependencies | Useful support surface, but low direct demand. |
| 6 | Free/budget | Module now; page only after evidence | 390/KD 11 is promising, but the broad hub should prove the content model first. |
| 7 | Toddler, indoor/heat, waterslides | Filters/modules | Current evidence does not justify separate URLs. |

Do not create separate `family resorts` and `family hotels` pages. Their sampled SERPs materially overlap.

## Promoted Next Implementation

Roadmap action: `FT-IMP-006`

Backlog action: `IMP-020`

Title: Improve the Las Vegas all-ages things-to-do hub after full candidate and section review.

Affected production URL:

- `https://familytripwise.com/things-to-do/las-vegas-with-kids.html`

Acceptance criteria:

1. Research a wider candidate pool across Strip icons, Downtown, indoor/heat backup, free/budget, pool/resort, nature, museum, show, and age-specific needs using current official sources and representative ranking pages.
2. Select only choices with distinct family planning value; no list-length quota. A likely 10-12 comparison set is a hypothesis, not an acceptance requirement.
3. Audit every current visible section for usefulness, repetition, persona coverage, unsupported firmness, source freshness, and whether it should keep, compress, merge, move, or be removed.
4. Preserve the all-ages hub role and clear routes to teen, stay, and itinerary pages.
5. Add compact first decisions for LV-P1 through LV-P5, including a useful free/budget and heat/indoor surface without creating another URL.
6. Use one scan layer and only decision-relevant detail. Do not repeat the same activity in several long formats.
7. Label editorial estimates, research-based conclusions, review signals, and unknowns accurately without defensive boilerplate.
8. Do not publish unsupported safety, smoke/noise, stroller-route, sensory, pool-access, room, price, or firm family-fit claims.
9. Preserve canonical URL, indexability, sitemap membership, and sibling-page behavior.
10. Pass generator/idempotency checks, focused content/trust tests, native SEO QA, responsive browser review, privacy checks, and independent read-only review before release.

## Measurement Plan

- Baseline: July 22 GSC snapshot, 180 impressions and average position 56.22 for the target page; zero clicks means no CTR conclusion.
- Release verification: production release marker, canonical, indexability, sitemap membership, required content invariants, mobile/desktop layout, and native production SEO QA.
- Crawl checkpoint: wait for evidence that Google has crawled the revised page before interpreting post-change search data.
- Query checkpoint: use protected query evidence when available to determine whether broad, free/budget, teen, or activity-anchor families are being discovered. Keep raw exports out of the public repo.
- Outcome: look for broader relevant query coverage, improved page-level impressions/position over a sufficiently current window, and useful internal routing. Do not attribute short-window movement causally or schedule edits from cadence alone.

## Source Register

- GSC snapshot: `ops/gsc-snapshots/2026-07-22.md`
- Existing build brief: `docs/plan/5-city-page-build-brief.md`
- Age-specific research: `docs/research/age-specific-family-travel-demand.md`
- Visit Las Vegas family activities: `https://www.visitlasvegas.com/experience/post/things-to-do-in-las-vegas-with-kids/`
- Visit Las Vegas budget families: `https://www.visitlasvegas.com/experience/post/las-vegas-on-a-budget-with-kids-affordable-and-entertaining-activities-for-families/`
- TripAdvisor family attractions: `https://www.tripadvisor.com/Attractions-g45963-Activities-zft11306-Las_Vegas_Nevada.html`
- Time Out family activities: `https://www.timeout.com/las-vegas/things-to-do/things-to-do-with-kids-in-las-vegas`
- Conde Nast Traveler family activities: `https://www.cntraveler.com/story/family-guide-things-to-do-in-las-vegas-with-kids`
- La Jolla Mom Las Vegas guide: `https://lajollamom.com/las-vegas-with-kids/`
- Earth Trekkers teen guide: `https://www.earthtrekkers.com/15-things-to-do-in-las-vegas-with-teenagers/`
- Tripadvisor family hotels: `https://www.tripadvisor.com/Hotels-g45963-zff4-Las_Vegas_Nevada-Hotels.html`
- Tripadvisor family resorts: `https://www.tripadvisor.com/HotelsList-Las_Vegas-Family-Resorts-zfp184924.html`
- Conde Nast Traveler family hotels: `https://www.cntraveler.com/gallery/family-friendly-hotels-in-las-vegas`
- KAYAK family hotels: `https://www.kayak.com/news/best-family-friendly-hotels-in-las-vegas/`
- Booking.com family hotels: `https://www.booking.com/family/city/us/las-vegas.en-gb.html`
- Las Vegas Then and Now hotel guide: `https://lasvegasthenandnow.com/where-to-stay-in-vegas-with-kids-besides-circus-circus/`
- Reddit family with kids question: `https://www.reddit.com/r/vegas/comments/1qs4nse/visiting_family_with_kids/`
- Reddit recent family trip report: `https://www.reddit.com/r/LasVegas/comments/1sdb481/las_vegas_with_kids_trip_report/`
- Reddit teen/mobility planning question: `https://www.reddit.com/r/vegas/comments/1qaxhs6/visiting_vegas_with_teen_bad_knees_hotel/`
- Reddit hotel-with-kids question: `https://www.reddit.com/r/vegas/comments/148fw89`
- Reddit resort-led family trip question: `https://www.reddit.com/r/vegas/comments/13m74f0`
- Reddit toddler research guide: `https://www.reddit.com/r/vegas/comments/1ajrsgz`

## Boundaries

- No site page, new URL, destination, sitemap, robots, canonical, indexability, or deployment changed in `FT-RES-007`.
- No indexing request, outreach, scraped review text, booking mutation, external-account change, or recurring automation was performed.
- Semrush metrics are source-dated estimates, not guaranteed demand. GSC evidence is public-safe and page-level only.
- Personas are hypotheses. Ranking-page advantages based on firsthand or local experience are not attributed to Family Tripwise.
