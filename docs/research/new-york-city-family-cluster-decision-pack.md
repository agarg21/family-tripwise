# New York City Family Cluster Decision Pack

Status: complete and independently review-clean

Action: `FT-RES-009`

Prepared: 2026-07-24

Scope: New York City visitor-family cluster only

Publication state: research-only; no `site/**` edit, indexing request, outreach, deployment, or external-account mutation

## Decision

New York City should use five core pages with distinct jobs:

1. improve the existing all-ages things-to-do hub;
2. create one future named-property family-hotel comparison;
3. create one future teen/tween specialist;
4. simplify the existing area/base stay guide; and
5. simplify the existing family itinerary.

The existing all-ages page is the first implementation. It has the strongest current combination of an existing indexed URL, early GSC discovery, meaningful demand, a weak and feature-heavy SERP, and a clear usefulness defect: six activities are repeated across starter cards, persona picks, a table, 42 detail fields, mini-itineraries, and another six-card filter inventory.

The hotel page and stay-area page should remain separate:

- the stay page answers **which neighborhood or base fits the route**;
- the hotel page answers **which named property fits room occupancy, approximate total nightly cost, location, kitchen/breakfast, pool, and review-signal constraints**.

The teen result set is distinct enough to justify a specialist page. The toddler, free, indoor, stroller, no-car, rainy-day, and family-of-five themes should first be handled as filters or decision modules inside the relevant core page. No static weekend/today page should be revived; that intent still requires a freshness workflow and remains explicitly deferred.

The next bounded implementation is:

- promoted action: `FT-IMP-014`
- backlog item: `IMP-031`
- title: "Improve the New York City all-ages things-to-do hub"
- target: `https://familytripwise.com/things-to-do/new-york-city-with-kids.html`

## Evidence Classification

| Evidence | Freshness | Classification and use | Limitation |
|---|---:|---|---|
| Repository and production model | checked 2026-07-24 | Current source, generated pages, sitemap, tests, strategy, and operator state. | Does not establish demand or rank. |
| `ops/gsc-snapshots/2026-07-24.json` and `.md` | collected 2026-07-24; finalized through 2026-07-22 | Fresh authenticated read-only API evidence. | Public-safe aggregate/page/inspection evidence only; no protected raw-query evidence. |
| Logged-in Semrush Chrome session | collected 2026-07-24; US database dated July 2026 | Current directional volume, KD, intent, related variants, and cached Google SERPs. | Similar variants overlap; totals are not unique demand. Some low-volume rows have no KD. |
| Semrush cached Google SERPs | July 2026 snapshots inspected 2026-07-24 | Query-level ranking URLs, page types, and SERP features. | Cached result sets may differ from live results; one stay snapshot returned an error and was not treated as overlap evidence. |
| Current public web results and ranking pages | inspected 2026-07-24 | Structural strengths, weaknesses, current topics, and source opportunities. | Result order varies; this is not rank tracking. |
| Reddit and other public parent/community discussions | inspected 2026-07-24 | Qualitative constraints, disagreements, and failure modes only. | Not demand, verified facts, or Family Tripwise firsthand experience. |
| Three current NYC pages | audited 2026-07-24 | Every visible section reviewed for search job, repetition, scan cost, persona usefulness, and trust. | Existing source lists are generic and do not support every current claim. |

## Current GSC Context

The July 24 snapshot is fresh and finalized through July 22. It is early discovery evidence, not a performance verdict or a query-specific rank.

| Page | Impressions | Clicks | Page-level average position | Inspection |
|---|---:|---:|---:|---|
| Things to do with kids | 55 | 0 | 43.98 | Submitted and indexed; last crawl 2026-07-04. |
| Where to stay with kids | 47 | 0 | 50.06 | Submitted and indexed; last crawl 2026-07-04. |
| Family itinerary | no page row | N/A | N/A | URL unknown to Google; no crawl recorded. |

The two visible rows total 102 impressions and zero clicks. The page-level averages cannot be presented as ranks for the example queries in this document.

## Query Universe And Directional Demand

Semrush values are directional US monthly estimates collected in the logged-in Chrome session on 2026-07-24. Closely related variants overlap and must not be summed as unique traffic.

| Theme | Representative current evidence | Intent | Page treatment |
|---|---|---|---|
| Broad family activities | `things to do in New York City with kids` 480, KD 25; `things to do with kids in New York City` 390, KD 22; `fun things to do in New York City with kids` 320, KD 21 | informational/commercial | Existing all-ages hub; first implementation. |
| Broad city-with-kids planning | `New York City with kids` 390, KD 15 | informational | Route through the all-ages hub, stay, and itinerary; do not create a generic duplicate URL. |
| Teen/tween activities | `things to do in NYC with teens` 590, KD 11; `things to do with teens in NYC` 480, KD 10; `best things to do with teens in NYC` 170, KD 13 | informational | Future standalone specialist; result set is distinct from the all-ages SERP. |
| Toddler/preschool | `things to do in NYC with toddlers` 110, KD 5; `things to do with toddlers in NYC` 50, KD 6 | commercial/informational | Strong younger-child route/filter in the all-ages page; no new URL now. |
| Free/budget | `free things to do in NYC with kids` 260, KD 12; `free things to do with kids in NYC` 70, KD 21 | informational | Strong all-ages module and itinerary pivot; reconsider a URL only after dedicated overlap evidence. |
| Indoor/weather | `indoor things to do in NYC with kids` 10, KD unavailable | unavailable | Weather fallback module; no standalone page. |
| Family vacation | `New York City family vacation` 50, KD 6; related variants drift toward package-booking intent | mixed informational/commercial | Route to the existing cluster; do not create a generic family-vacation page. |
| Stay areas | `where to stay in New York City with kids` 30, KD unavailable; `where to stay in NYC with a family` 70, KD 15; `best area to stay in NYC for families` 20, KD unavailable | informational/commercial | Existing area/base page. |
| Family hotels | `best family hotels in New York City` 390, KD 29; `best hotels in NYC for families` 390, KD 20; `family friendly hotels New York City` 260, KD 24 | commercial/transactional | One future named-property comparison. |
| Hotel room/occupancy constraints | `family suites in New York City` 50, KD 21; `NYC hotels for family of 5` 10, KD unavailable; the pool seed returned no usable seed metric | transactional/commercial | Fields and trip-style starts on the same hotel page, not separate URLs. |
| Family itinerary | `New York City with kids itinerary` 30, KD unavailable; `New York City itinerary with kids` 10, KD unavailable | informational | Keep existing sequencing page; improve after acquisition and commercial pages. |
| Weekend/today/local events | broad seed exposes weekend/today variants and live result inventory | freshness-sensitive | Keep deferred. Do not publish a static evergreen page without a current-content workflow. |
| Stroller, subway, nap, no car | recurring parent questions and page modifiers, but no sampled standalone result family | informational subproblem | Cross-page decision fields and stop rules. |

### Exact Keyword Evidence Register

Every row below is a Semrush US monthly estimate from the July 2026 database, inspected in the authenticated Chrome session on 2026-07-24. `Unavailable` means the field was not shown for that exact phrase; it is not zero. Related phrases are intentionally not summed.

| Exact phrase | Volume | KD | CPC | Intent |
|---|---:|---:|---:|---|
| `things to do in New York City with kids` | 480 | 25 | $0.00 | informational + commercial |
| `things to do with kids in New York City` | 390 | 22 | unavailable | unavailable |
| `fun things to do in New York City with kids` | 320 | 21 | unavailable | unavailable |
| `New York City with kids` | 390 | 15 | $0.00 | informational |
| `things to do in NYC with teens` | 590 | 11 | $0.55 | informational |
| `things to do with teens in NYC` | 480 | 10 | unavailable | unavailable |
| `best things to do with teens in NYC` | 170 | 13 | unavailable | unavailable |
| `things to do in NYC with toddlers` | 110 | 5 | $0.00 | commercial |
| `things to do with toddlers in NYC` | 50 | 6 | unavailable | unavailable |
| `free things to do in NYC with kids` | 260 | 12 | $0.00 | informational |
| `free things to do with kids in NYC` | 70 | 21 | unavailable | unavailable |
| `indoor things to do in NYC with kids` | 10 | unavailable | $0.00 | unavailable |
| `New York City family vacation` | 50 | 6 | $1.26 | informational |
| `where to stay in New York City with kids` | 30 | unavailable | $0.00 | unavailable |
| `where to stay in NYC with family` | 20 | unavailable | $1.33 | unavailable |
| `where to stay in NYC with a family` | 70 | 15 | unavailable | unavailable |
| `best area to stay in NYC for families` | 20 | unavailable | $0.00 | unavailable |
| `best family hotels in New York City` | 390 | 29 | $1.75 | commercial |
| `family friendly hotels New York City` | 260 | 24 | $1.50 | commercial |
| `best hotels in NYC for families` | 390 | 20 | $1.75 | commercial |
| `family suites in New York City` | 50 | 21 | $1.87 | transactional |
| `NYC hotels for family of 5` | 10 | unavailable | $1.68 | unavailable |
| `New York City itinerary with kids` | 10 | unavailable | $0.00 | unavailable |
| `New York City with kids itinerary` | 30 | unavailable | unavailable | unavailable |

## Query-Level SERP Observations

Collection date: 2026-07-24.

| Exact query | Evidence | Recurring ranking pages/domains | Features/page types | Page decision |
|---|---|---|---|---|
| `things to do in New York City with kids` | Semrush July 2026 cached Google SERP plus current public results | The Travel Expert, Global Munchkins, Growing Up NYC, Time Out, NewYork.com, family publishers, social/UGC | top-sights pack, AI overview, PAA, social discussions, broad list guides, official activity inventory | Core NYC-C1 all-ages page. SERP is crowded with features but organic quality is uneven. |
| `things to do in NYC with teens` | Semrush cached Google SERP plus current public results | y Travel Blog, The Gomes Guide/Substack, Full Suitcase, FamiliesGo!, Recipe Girl, Reddit, Fora | teen-specific editorial guides, UGC, itinerary pages; no broad all-ages page in the observed leading set | Distinct NYC-C2 specialist page. |
| `things to do in NYC with toddlers` | current public results plus Semrush metrics | Time Out toddler guide, Visit Manhattan, local/official family resources, Reddit | age-specific lists, local/official resources, UGC | Partial specialist result set. The exact seed is 110 searches/month; build a strong NYC-C1 younger-child route before considering a URL. |
| `free things to do in NYC with kids` | current public results plus Semrush metrics | NYC government/PDI resources, Time Out, Kido Map, current-event inventory | evergreen lists, official low-cost resources, live event pages | Cost-first need is real, but overlaps the all-ages inventory and live events. Use a module first. |
| `best family hotels in New York City` | Semrush cached Google SERP plus current public results | Condé Nast Traveler, Reddit, The Better Beyond, property pages, Booking.com, Expedia, Marriott | AI overview, hotel pack/map, editorial lists, UGC, OTA/category pages, property pages | Distinct NYC-C6 named-property page. |
| `where to stay in New York City with kids` | current public results; Semrush cached snapshot unavailable | Plan Family Escapes, family stay guides, neighborhood guides, forums/UGC, hotel-inclusive blogs | area guides mixed with named hotels | NYC-C5 area/base page; hand property selection to NYC-C6. |
| `New York City itinerary with kids` / `3 days in New York City with kids` | current public results and Semrush metrics | KidPaths, Alex Jessica Mills, family itinerary publishers, Reddit itinerary critiques | day-by-day plans, family blogs, UGC critiques | Existing NYC-C7 sequencing page. Low demand does not justify deletion, but the current unknown-to-Google state and abstract repetition make it lower priority. |

Observed intersections:

- The all-ages and teen result sets have little leading-URL overlap and different recommendation logic. Teen demand is not just a modifier on a little-kid list.
- The area result set is organized around neighborhoods and trip bases; the hotel result set is organized around properties, prices, room setup, review volume, and booking features.
- Free and toddler results partially overlap broad family publishers and activity inventories, so those constraints should first be strong routes within the all-ages page.
- Itinerary results solve order, geography, and pacing. They should not repeat a full activity inventory.

### Sampled SERP Sets And Intersections

These are observed leading organic sets, not rank tracking. Semrush sets are cached July 2026 Google SERPs inspected on 2026-07-24; current-public sets were collected on 2026-07-24. Exact URL overlap, domain overlap, and page-type overlap are reported separately.

#### NYC-C1 All-Ages Discovery

Sample A, `things to do in New York City with kids`:

- [The Travel Expert](https://thetravelexpert.ie/travel-expert-article/top-things-to-do-in-new-york-with-kids/)
- [Global Munchkins](https://globalmunchkins.com/destinations/travel-within-the-states/ultimate-guide-new-york-kids/)
- [Mommy Poppins](https://www.instagram.com/mommypoppins/?hl=en)
- [Austin Travels](https://austintravels.com/trips/nyc-with-kids/)
- [Growing Up NYC](https://growingupnyc.cityofnewyork.us/activity/)
- [Alex Jessica Mills](https://alexjessicamills.com/free-things-to-do-in-new-york-city-with-kids/)
- [Take the Family](https://www.takethefamily.com/features/guide-new-york-city-budget-kids)
- [I Love NY](https://www.iloveny.com/things-to-do/amusements/)

Sample B, `things to do with kids in New York City`:

- [Rockefeller Center](https://www.rockefellercenter.com/magazine/events/things-to-do-in-nyc-with-kids)
- [Time Out](https://www.timeout.com/new-york-kids/things-to-do/101-things-to-do-with-kids-in-nyc)
- [Wanderlog](https://wanderlog.com/list/geoCategory/139597/best-things-to-do-with-kids-in-new-york-city)
- [KidPaths](https://kidpaths.com/new-york-city)
- [Oyster](https://www.oyster.com/articles/things-to-do-with-kids-in-nyc/)
- [Cubbie](https://www.cubbieapp.com/blog/things-to-do-with-kids-nyc/)
- [TravelMag](https://www.travelmag.com/articles/things-to-do-with-kids-nyc/)
- [Things To Do With Kids Near Me](https://thingstodowithkidsnear.me/blog/25-best-things-to-do-with-kids-in-new-york-city)

Intersection: zero exact URLs and zero exact domains in these sampled leading sets. Broad editorial lists, official/local inventories, attraction-led guides, and itinerary/list products recur. This is strong page-type overlap but weak URL/domain overlap, so NYC-C1 confidence is **medium-high**, not high.

#### NYC-C2 Teen/Tween Planning

Sample A, `things to do in NYC with teens`:

- [y Travel Blog](https://www.ytravelblog.com/things-to-do-in-nyc-with-teens/)
- [The Gomes Guide](https://thegomesguide.substack.com/p/new-york-city-with-teens-real-tips)
- [Full Suitcase](https://fullsuitcase.com/new-york-city-with-teenagers/)
- [FamiliesGo!](https://www.familiesgotravel.com/2011/08/nyc-teens-top-things-to-do/)
- [Recipe Girl](https://www.recipegirl.com/things-to-do-in-new-york-city-with-teenage-boys/)
- [Reddit Manhattan](https://www.reddit.com/r/manhattan/comments/1f48zko/nontouristy_things_to_do_with_teens_during_a/)
- [Fora](https://www.foratravel.com/guides/M67J8J/a-5-day-itinerary-to-nyc-with-teenagers-jennifer-mcguire)
- [Life's Short Travel Well](https://lifesshorttravelwell.com/trips/new-york-city/taking-your-teen-to-new-york-city/)

Sample B, `things to do with teens in NYC`:

- [Visit Manhattan](https://visitmanhattan.nyc/tripplanner/weekends/best-things-to-do-in-new-york-city-with-teens-april-2026)
- [Reddit ThingsToDoWithKids](https://www.reddit.com/r/ThingsToDoWithKids/comments/1sfunvf/taking_your_teenager_to_new_york_city_give_them_a/)
- [Reddit visitingNYC: teen independence](https://www.reddit.com/r/visitingnyc/comments/1r88s9k/what_to_let_teens_do_while_parents_have_a_date/)
- [Reddit visitingNYC: family trip report](https://www.reddit.com/r/visitingnyc/comments/1uq5flj/trip_report_family_with_2_teens_times_square/)
- [Reddit visitingNYC: teens/preteen itinerary](https://www.reddit.com/r/visitingnyc/comments/1taeo9b/early_summer_trip_with_teenspreteen_itinerary/)
- [Reddit visitingNYC: teens visiting](https://www.reddit.com/r/visitingnyc/comments/1txxeu4/teens_visiting_me/)

Intersection: no exact URL overlap; Reddit recurs at the domain level. Teen-specific editorial, itinerary, and community pages recur, while the observed all-ages leaders do not. The specialist boundary is **medium-high** confidence because result type and recommendation logic are distinct even though exact leading URLs vary.

#### NYC-C5 Stay Areas

Sample A, `where to stay in New York City with kids`:

- [Plan Family Escapes](https://planfamilyescapes.com/where-to-stay-in-new-york-city-with-kids-best-areas-and-hotels-for-every-budget)
- [Dolly Dowsie: best areas](https://www.dollydowsie.com/2026/05/03/best-areas-to-stay-in-new-york-with-kids-pros-cons-of-each-neighborhood/)
- [Dolly Dowsie: hotels and neighborhoods](https://www.dollydowsie.com/2025/05/24/where-to-stay-in-new-york-with-kids-family-friendly-hotels-and-neighbourhoods/)
- [WhereverFamily](https://whereverfamily.com/the-best-nyc-neighborhoods-to-book-and-not-to-book-a-family-stay/)
- [Reddit ChubbyTravel](https://www.reddit.com/r/chubbytravel/comments/1seg7c3/where_to_stay_in_nyc_with_4_yo/)

Sample B, `where to stay in NYC with a family`:

- [CatchWMW](https://catchwmw.com/2026/03/23/where-to-stay-in-new-york-city-with-family/)
- [Travel and Time](https://travelandtime.com/guides/where-to-stay-in-new-york)
- [Route Verdict](https://www.routeverdict.com/articles/where-to-stay-in-new-york-city-2026)
- [Reddit visitingNYC accommodations megathread](https://www.reddit.com/r/visitingnyc/comments/1o571g0/accommodations_megathread/)

Intersection: zero exact URLs and one shared domain, `reddit.com`. Neighborhood/base guides and accommodation UGC recur, but the broader family query admits generic area guides. The area-page boundary is **medium-high** confidence; it should answer geography and route shape, not claim that all variants have identical SERPs.

#### NYC-C6 Family Hotels

Sample A, `best family hotels in New York City`:

- [Condé Nast Traveler](https://www.cntraveler.com/gallery/family-friendly-new-york-city-hotels)
- [Reddit ChubbyTravel](https://www.reddit.com/r/chubbytravel/comments/1es6m17/nyc_hotel_with_kids/)
- [The Better Beyond](https://thebetterbeyond.com/best-nyc-hotels-for-families/)
- [The Knickerbocker](https://www.theknickerbocker.com/about/amenities/kid-friendly/)
- [Hard Rock Hotel New York](https://hotel.hardrock.com/new-york/hotel-suites-for-families.aspx)
- [Booking.com](https://www.booking.com/family/city/us/new-york.html)
- [Expedia](https://www.expedia.com/Manhattan-New-York-Hotels-Family-Hotel.0-n129440-0-tFamilyHotel.Travel-Guide-Filter-Hotels)
- [Luxe Recess](https://luxerecess.com/category/best-luxury-hotels-for-families/new-york/)
- [Marriott](https://www.marriott.com/en-us/destinations/united-states/new-york/new-york-city/family-friendly-hotels.mi)

Sample B, `family friendly hotels in New York City`:

- [Condé Nast Traveler](https://www.cntraveler.com/gallery/family-friendly-new-york-city-hotels)
- [Time Out](https://www.timeout.com/newyork/hotels/best-family-hotels-in-nyc)
- [Travel Stay Maps](https://www.travelstaymaps.com/destinations/usa/best-hotels-new-york-city-families/)
- [Tripadvisor](https://www.tripadvisor.com/Hotels-g60763-zff4-New_York_City_New_York-Hotels.html)
- [Kayak](https://www.kayak.com/news/best-family-friendly-hotels-in-new-york/)
- [Time Out Kids hotels](https://www.timeout.com/new-york-kids/hotels)

Intersection: Condé Nast Traveler is an exact shared URL; editorial hotel lists recur alongside OTAs, category pages, property pages, and UGC. This is a stable named-property commercial result family and supports **high** confidence in a separate hotel page.

## SERP-Overlap Cluster Map

| Cluster | Query shapes | Observed page types | Rationale | Confidence |
|---|---|---|---|---|
| NYC-C1 Broad all-ages discovery | things to do, fun things, NYC with kids, family visit | broad guides, official inventories, top-sights packs, UGC | Same discovery job across general variants; sampled exact URL/domain overlap was low while page-type overlap was strong. | medium-high |
| NYC-C2 Teen/tween planning | teens, teenagers, unique, non-touristy | teen-specific guides, firsthand family posts, UGC, itineraries | Distinct recommendations and result types from NYC-C1; sampled exact URL overlap varied. | medium-high |
| NYC-C3 Younger-child planning | toddlers, preschool, baby, stroller, nap | age-specific lists, local resources, broad guides, UGC | Real constraint, but only one dedicated result family was sampled and broad-page overlap remains unresolved. | medium |
| NYC-C4 Free/budget/weather | free, cheap, indoor, rainy, winter | broad guides, official low-cost resources, event pages, venue pages | Free has a usable result family; indoor exact demand is small and no separate indoor result family was inspected. | medium-low |
| NYC-C5 Stay areas/base | where to stay, best area, Manhattan vs Brooklyn/Queens | neighborhood guides, family blogs, forums, hotel-inclusive stay guides | Searcher is choosing geography and day shape; exact sampled overlap was low but page-type overlap recurred. | medium-high |
| NYC-C6 Family hotels | best/family-friendly/kid-friendly hotels, suites, family of five, pool | editorial hotel lists, hotel pack, OTAs, property pages, UGC | Named-property comparison is a separate commercial job. | high |
| NYC-C7 Itinerary/sequencing | itinerary, 1/2/3 days, weekend trip | day-by-day guides, route plans, itinerary critiques | Searcher wants order and stop rules, not another list. | high |
| NYC-C8 Current events | today, this weekend, holiday/current calendar | event inventories, social/community, local publishers | Requires continuous freshness; static page would decay. | high |
| NYC-C9 Transport/friction | subway, stroller, no car, nap return, airport arrival | embedded across stay, itinerary, official transit, and community pages | Cross-page problem; no standalone result family established. | medium |

## Representative Ranking-Page Analysis

| Page/domain | What it does well | Weakness/opportunity | Advantage we cannot claim | Family Tripwise response |
|---|---|---|---|---|
| [Time Out NYC family activities](https://www.timeout.com/new-york-kids/things-to-do/101-things-to-do-with-kids-in-nyc) | Very broad local inventory, current attraction detail, neighborhood and price labels. | Long list creates choice cost; limited trip-shape routing and pacing. | Local editorial brand, photography, ongoing city coverage. | Use a smaller evidence-backed set, one complete comparison, family constraints, and explicit stop rules. |
| [NewYork.com family guide](https://www.newyork.com/articles/post/32-top-things-to-do-new-york-city-with-kids/) | Broad category coverage and concise scanning. | Many entries are one-line assertions; little age, booking, duration, or route decision support. | Destination-domain authority and commercial inventory. | Provide consistent decision fields and current official checks. |
| [Sunlight Kids NYC guide](https://www.sunlightkids.com/new-york-city-with-kids) | Strong free/toddler sections, maps, blunt recommendations. | Several universal age, stroller, noise, route, and booking claims are overconfident or thinly sourced. | Claimed parent voice and product ecosystem. | Keep useful constraint routing while calibrating claims and showing source dates. |
| [TravelNewYork family guide](https://travelnewyork.com/guide/things-to-do-nyc-with-kids/) | Compact age grouping and free options. | Very narrow inventory, generic age buckets, and commercial trip-planner handoff. | Current destination/ticket ecosystem. | Beat it on breadth without becoming a 50-item catalog. |
| [Time Out toddlers in NYC](https://www.timeout.com/new-york-kids/things-to-do/the-best-things-to-do-with-toddlers-in-nyc) | Age-specific local inventory and practical parent framing. | Long list and some broad age-fit assumptions; local-resident and visitor jobs are mixed. | Ongoing local editorial coverage and firsthand city familiarity. | Use toddler needs as explicit fields and routes inside the all-ages page before creating another URL. |
| [Visit Manhattan with toddlers](https://visitmanhattan.nyc/tripplanner/for-families/manhattan-with-toddlers) | Visitor-oriented younger-child framing and compact trip planning. | Manhattan-only scope and limited evidence for universal stroller or pace conclusions. | Destination expertise and current local product coverage. | Add source-dated younger-child choices without firm stroller or all-family fit claims. |
| [NYC free or low-cost family activities](https://www.nyc.gov/site/childcare/for-families/free-or-low-cost-activities-for-families.page) | Official resource routing and a genuine cost-first job. | Many links are current-program or event resources rather than a durable visitor comparison. | Government source ownership and current program access. | Separate evergreen free choices from volatile free dates and event inventory. |
| [Time Out free things with kids](https://www.timeout.com/new-york-kids/things-to-do/free-things-to-do-with-kids-in-new-york) | Broad local free inventory with useful current context. | Choice overload and time-sensitive details can age quickly. | Ongoing local editorial maintenance. | Put a bounded free/budget route in the hub and date every volatile rule. |
| [Full Suitcase NYC with teenagers](https://fullsuitcase.com/new-york-city-with-teenagers/) | Firsthand family framing, teen-specific reasons, location grouping, extensive practical detail. | Very long, affiliate-heavy, and sometimes makes broad universal recommendations. | Documented family trip and repeat personal experience. | Offer a calmer scan-first comparison, teen-choice logic, and explicit unknowns. |
| [Condé Nast Traveler family hotels](https://www.cntraveler.com/gallery/family-friendly-new-york-city-hotels) | Current journalist-visited shortlist, polished property narratives, strong editorial trust. | Narrative and luxury skew; limited compact occupancy/total-price/constraint comparison. | Journalist property visits, brand authority, access. | Compare room utility, family-of-five fit, approximate total night, review conflicts, and trip style without claiming a stay. |
| [Oyster family hotels](https://www.oyster.com/new-york-city/hotels/roundups/best-kid-friendly-hotels-in-new-york-city/) | Concrete room-capacity and amenity detail. | Some properties and facts may be stale; little visible freshness context. | Historical hotel review operation and property access. | Use current official facts plus source-dated review signals and unknowns. |
| [Plan Family Escapes stay guide](https://planfamilyescapes.com/where-to-stay-in-new-york-city-with-kids-best-areas-and-hotels-for-every-budget) | Clear Manhattan/Brooklyn/Queens framing and budget/location tradeoff. | Blends area and property jobs; universal walking/ease claims and affiliate hotel inserts increase noise. | Claimed family experience and affiliate inventory. | Keep the area page short and conditional; route hotels to the separate comparison. |
| [KidPaths three-day itinerary](https://kidpaths.com/blog/new-york-city-itinerary-3day) | Concrete day structure and geographic grouping. | Some exact route, time, and cost assumptions need live verification; activity selection can dominate sequencing. | Product-specific itinerary tooling and route presentation. | Build fewer executable day shapes with explicit deletion and verification rules. |
| [Alex Jessica Mills four-day itinerary](https://alexjessicamills.com/perfect-4-days-in-new-york-with-kids-itinerary/) | Firsthand-style narrative and a complete multi-day sequence. | Long personal chronology is hard to adapt across ages, bases, and energy levels. | Claimed family trip experience and original photography. | Offer concise one-, two-, and three-day structures plus persona and weather pivots. |
| Reddit / visitingNYC / AskNYC threads | Expose real mixed-age, walking, food, budget, hotel-room, and itinerary failures. | Anecdotal, inconsistent, unverified, and hard to compare. | Authentic UGC and community correction. | Convert recurring questions into fields and stop rules; never use anecdotes as facts or demand. |

## Persona Hypotheses

These are research hypotheses from query modifiers, ranking-page patterns, community questions, and product constraints. They are not demographic truth.

### NYC-P1 First-Time Classic-Sights Family

- Job: choose a manageable first NYC trip from iconic options.
- Context: 2-5 days; Central Park, AMNH, skyline, Broadway, ferry, Times Square, Brooklyn.
- Anxieties: expensive tickets, too much walking, crossing town repeatedly, missing the one high-payoff stop.
- Criteria: one anchor per half-day, age fit, nearby pairing, price level, weather backup, realistic stop rule.
- Failure mode: a 50-item list with no starting point.
- Pages: all-ages hub, itinerary, stay, hotel.
- Evidence basis: broad `New York City with kids` and all-ages query families; current broad-list SERPs; [first-time family community question](https://www.reddit.com/r/visitingnyc/comments/1u96bm9/first_time_in_nyc_with_an_8yearold_looking_for/); and itinerary critiques that repeatedly expose overstuffed plans.

### NYC-P2 Younger-Child Reset Family

- Job: plan short blocks around naps, bathrooms, meals, stroller handling, and hotel resets.
- Context: toddler/preschool modifiers, playgrounds, children's museums, ferries, short museum routes.
- Anxieties: inaccessible subway route, long lines, nowhere to reset, overstimulation, late meals.
- Criteria: duration, indoor/outdoor, reset option, booking friction, stroller caveat, room setup.
- Failure mode: universal stroller-friendly claims or all-day attraction stacking.
- Pages: all-ages hub, itinerary, stay, hotel.
- Evidence basis: exact toddler/preschool query modifiers; Time Out and Visit Manhattan toddler result pages; [four-year-old lodging discussion](https://www.reddit.com/r/chubbytravel/comments/1seg7c3/where_to_stay_in_nyc_with_4_yo/); and recurring nap, stroller, bathroom, and reset questions in family itinerary discussions.

### NYC-P3 Budget/Weather Family

- Job: preserve the trip when admissions, rain, heat, cold, or crowding constrain the plan.
- Context: free, cheap, indoor, rainy, winter, flexible-day queries.
- Anxieties: stale free-day claims, weather-dependent tickets, too many paid anchors.
- Criteria: free versus paid, source date, indoor swap, flexible duration, cancellation/check-before-going.
- Failure mode: presenting a current event or free-day rule as evergreen.
- Pages: all-ages hub and itinerary.
- Evidence basis: exact free and indoor query modifiers; NYC government and Time Out free-resource pages; live event inventories; and the risk that time-limited free dates or weather rules are repeated as evergreen facts.

### NYC-P4 Teen/Tween City-Experience Family

- Job: make NYC feel like a real city experience rather than a little-kid attraction list.
- Context: food, shopping, Broadway, sports, photo payoff, neighborhoods, skyline, mixed-age siblings.
- Anxieties: childish picks, passive museum stacking, no autonomy or choice, expensive low-payoff attractions.
- Criteria: teen-specific reason, choice, movement, social/photo or cultural payoff, evening option, budget alternative.
- Failure mode: renaming the all-ages page while keeping the same six picks.
- Pages: future teen specialist, itinerary, stay.
- Evidence basis: three measured teen query variants; teen-only editorial SERPs; [mixed teen/preteen itinerary discussion](https://www.reddit.com/r/visitingnyc/comments/1taeo9b/early_summer_trip_with_teenspreteen_itinerary/); and [two-teen family trip report](https://www.reddit.com/r/visitingnyc/comments/1uq5flj/trip_report_family_with_2_teens_times_square/).

### NYC-P5 Lodging/Occupancy-Led Family

- Job: choose a base and then a room that actually fits the family.
- Context: family-friendly hotels, family of five, suites, two beds, kitchen, breakfast, pool, Midtown versus outer borough.
- Anxieties: occupancy mismatch, tiny room, hidden taxes/fees, wrong base, noisy/crowded setting, stale amenity claim.
- Criteria: allowed occupancy, room layout, approximate total nightly range, area role, kitchen/breakfast, pool, sampled review conflicts.
- Failure mode: a blended stay page that compares neither areas nor properties well.
- Pages: stay-area guide plus future hotel comparison.
- Evidence basis: measured area, hotel, suite, and family-of-five query modifiers; distinct area-versus-property result families; [family hotel discussion](https://www.reddit.com/r/chubbytravel/comments/1es6m17/nyc_hotel_with_kids/); and [four-year-old base discussion](https://www.reddit.com/r/chubbytravel/comments/1seg7c3/where_to_stay_in_nyc_with_4_yo/).

## Every-Page And Every-Section Audit

### All-Ages Things To Do

URL: `https://familytripwise.com/things-to-do/new-york-city-with-kids.html`

Current size: about 2,538 words in 455 source lines.

Role: NYC-C1 acquisition hub serving NYC-P1/P2/P3 and routing NYC-P4/P5.

| Current section | Decision | Instruction |
|---|---|---|
| Hero and trust panel | keep/compress | Keep exact intent and freshness; reduce defensive methodology prominence. |
| Central Park image | replace or retain only if it supports the final set | A single generic park image undersells the range; choose a licensed NYC family-decision visual during implementation. |
| "Pick one anchor activity per day" | keep | Strong first principle; make it the entry to trip-shape choices. |
| Six "best first trip" cards | replace | Too narrow and universally ranked. Research about 12 distinct choices across classic, younger-child, teen/mixed-age, free/outdoor, indoor, and neighborhood roles. |
| Scan table | keep/rebuild | Make one complete comparison the primary decision surface. |
| Cluster-routing cards including internal methodology copy | compress | Route stay, hotel, teen, and itinerary jobs; remove internal editorial language such as "keep this page tourist-focused." |
| "Best choices by family situation" | replace | Use five conditional persona/trip starts rather than another repeated ranking layer. |
| Activity decision table | merge | There should be one complete table, not two scan systems. |
| 42-field detailed notes for six activities | compress | Keep deep notes only for genuinely high-friction choices. |
| Five mini-itineraries | remove/route | Sequencing belongs on the itinerary page; retain only compact pairings. |
| "Connect ... methodology" band | remove/replace | User-facing methodology routing interrupts the task. Keep useful cluster links. |
| Second six-card activity inventory/filter | merge | This duplicates the same six activities again. One filterable comparison/inventory should own the list. |
| Generic source list and FAQ schema | replace | Use current activity-specific sources; remove unsupported universal `best` and stroller answers. |

Verdict: highest-priority improvement. The current page is useful in fragments but visibly repetitive and too narrow for the result set.

### Stay Areas / Base

URL: `https://familytripwise.com/where-to-stay/new-york-city-with-kids.html`

Current size: about 1,929 words in 324 source lines.

Role: NYC-C5 area/base decision page serving NYC-P1/P2/P5 and routing NYC-P4.

| Current section | Decision | Instruction |
|---|---|---|
| Hero/trust/image | keep/compress | Preserve area intent; use quieter trust copy. |
| "Start with the area" | keep | Correct architecture. |
| Five area cards | keep/research | Re-evaluate Upper West Side, Midtown, Downtown/Tribeca, Brooklyn, and Long Island City against current sources and trip styles. |
| Generic family-hotel/stroller/booking cards | remove/merge | Hotel checklist is not a property comparison; generic stroller claims add little. |
| "Best areas by family need" | merge | Duplicates the area list. Convert to five conditional starts. |
| Stay tradeoff table | keep/rebuild | One concise comparison should be the main scan surface. |
| Hotel-claim evaluation cards | compress | Keep only decisive room/base checks and route to the hotel page. |
| 27-field generic hotel-verification notes | remove | Repeats unsourced area stereotypes and belongs in the future named-property evidence workflow. |
| Three official-source checks | compress | Keep useful booking/transit/noise checks without repeating caveats. |
| Cluster/methodology band | replace | Add hotel and teen handoffs; remove methodology as a primary task card. |
| Sources/FAQ schema | replace | Current activity sources do not support area, transit, room, or noise conclusions; remove universal Upper West Side default. |

Verdict: keep as a distinct low-demand support page, but simplify after the hotel and teen work.

### Family Itinerary

URL: `https://familytripwise.com/family-itinerary/new-york-city-with-kids.html`

Current size: about 1,648 words in 232 source lines.

Role: NYC-C7 sequencing support page serving all personas.

| Current section | Decision | Instruction |
|---|---|---|
| Hero/trust/image | keep/compress | Clear intent; quieter status treatment. |
| "Nap-friendly structure" | merge | Fold the rules into concrete day plans. |
| "Condensed weekend plan" | replace | Use actual geographic day shapes and explicit deletion rules. |
| Three utility cards | compress | Route to activity, stay, hotel, and teen pages in one compact handoff. |
| Six-plan selector/matrix | keep/rebuild | A trip-length/persona selector is useful if every choice maps to a complete plan. |
| "1-day, 2-day, 3-day..." table | remove/merge | Duplicates the selector without executing the trips. |
| Six generic pacing cards | replace | Build one-, two-, and three-day plans plus younger-child, teen, rain, budget, and base pivots. |
| Swap-activities band | keep/expand | Route all specialist jobs without repeating their inventories. |
| Sources/FAQ schema | replace | Current generic activity sources do not prove routing; remove one-size-fits-all day-count answers. |

Verdict: keep. The URL is currently unknown to Google, but no indexing request is allowed. Improve usefulness and internal routing later, then observe normal discovery.

### Proposed Family-Hotel Comparison

Proposed URL: `https://familytripwise.com/where-to-stay/new-york-city-family-hotels.html`

Role: NYC-C6 commercial comparison serving NYC-P5 and supporting NYC-P1/P2/P4.

Required evidence before publication:

- a current 18-25 property candidate pool, not a fixed list-length quota;
- official room/occupancy/suite, kitchen/breakfast, pool, location, and optional crib/connecting details where found;
- approximate **total nightly** planning ranges from public examples, source-dated and non-guaranteed;
- bounded recent online-review observations with visible family context where available, plus conflicts and thin-sample labels;
- explicit family-of-five, two-bed/suite, younger-child, teen, budget, Midtown, park/museum, Downtown/Brooklyn, and pool roles;
- direct Google Maps links and attraction/base context;
- no booking transaction, copied review prose, reviewer identifiers, ordinal universal ranking, or personally stayed claim.

### Proposed Teen/Tween Specialist

Proposed URL: `https://familytripwise.com/things-to-do/new-york-city-with-teens.html`

Role: NYC-C2 specialist serving NYC-P4.

Requirements:

- every candidate needs a distinct older-kid reason;
- include city-feeling choices such as food/neighborhoods, Broadway/live events, sports, skyline, shopping/design, and interactive culture rather than only museums;
- one complete comparison, compact high-friction notes, and realistic mixed-age route shapes;
- preserve safety, independent-roaming, exact-route, event, ticket, weather, and age/height uncertainty;
- do not duplicate the all-ages inventory or publish live weekend listings.

## Prioritized Opportunity Matrix

| Priority | Page/action | Impact | Confidence | Effort | Reason |
|---:|---|---:|---:|---:|---|
| 1 | Improve existing all-ages page | high | high | medium-high | Indexed with 55 impressions; exact measured phrases include 480, 390, and 320 searches/month; current page has severe repetition and narrow inventory. |
| 2 | Research and publish family-hotel comparison | high | high | high | Three exact commercial phrases measure 390, 390, and 260 searches/month; the sampled named-property result family is distinct and stable. |
| 3 | Research and publish teen specialist | high | high | high | Three exact teen phrases measure 590, 480, and 170 searches/month; teen-specific result types and persona job are distinct. |
| 4 | Simplify stay-area guide | medium | high | medium | Existing indexed support page with 47 impressions, but low exact demand and substantial generic repetition. |
| 5 | Simplify itinerary | medium-low | high | medium | Low search demand and not indexed, but useful cluster/product support when concrete. |
| 6 | Add free/toddler modules inside the hub | included in priority 1 | high | included | Meaningful constraints, but no separate URL yet. |
| 7 | Build weekend/today planner | deferred | high on freshness risk | very high | Requires a durable current-content workflow; user previously deferred it. |

## Promoted Action: FT-IMP-014

Target: `https://familytripwise.com/things-to-do/new-york-city-with-kids.html`

Acceptance criteria:

1. Preserve the current canonical URL, indexability, and sitemap membership.
2. Research a wider current candidate pool and record keep/add/remove/defer decisions.
3. Apply NYC-P1 through NYC-P5, with P4/P5 routed to specialist pages rather than duplicated.
4. Replace repeated six-item layers with one filterable inventory/comparison of roughly 10-14 earned choices; the range is a research hypothesis, not a quota.
5. Keep deep notes only for high-friction choices.
6. Include strong younger-child, free/budget, indoor/weather, and mixed-age routes.
7. Remove internal editorial/methodology narration from the primary task flow.
8. Use current direct official sources for material ticket, age, access, operating, and volatility claims.
9. Align visible FAQs and schema; remove unsupported universal `best` and stroller answers.
10. Prove target-only generation, idempotency, source safety, privacy, responsive scan behavior, and no sibling-page mutation.

Measurement plan:

- baseline: 55 impressions, 0 clicks, page-level average position 43.98 in the July 24 snapshot finalized through July 22;
- monitor page discovery, impressions, clicks, CTR, and page-level average position in later public-safe snapshots;
- use protected query evidence only when available and never infer query rank from page-level average position;
- inspect crawl/index state through normal monitoring; do not request indexing;
- evaluate usefulness/technical defects immediately, but do not manufacture a causal observation deadline from sparse launch data.

## Source Register

Current demand/SERP tools:

- Logged-in Semrush US Keyword Overview, Keyword Magic Tool, and cached Google SERPs collected 2026-07-24.
- `ops/gsc-snapshots/2026-07-24.json`
- `ops/gsc-snapshots/2026-07-24.md`

Representative ranking/current pages:

- https://www.timeout.com/new-york-kids/things-to-do/101-things-to-do-with-kids-in-nyc
- https://www.newyork.com/articles/post/32-top-things-to-do-new-york-city-with-kids/
- https://www.sunlightkids.com/new-york-city-with-kids
- https://travelnewyork.com/guide/things-to-do-nyc-with-kids/
- https://fullsuitcase.com/new-york-city-with-teenagers/
- https://www.cntraveler.com/gallery/family-friendly-new-york-city-hotels
- https://www.oyster.com/new-york-city/hotels/roundups/best-kid-friendly-hotels-in-new-york-city/
- https://planfamilyescapes.com/where-to-stay-in-new-york-city-with-kids-best-areas-and-hotels-for-every-budget
- https://www.nyc.gov/site/childcare/for-families/free-or-low-cost-activities-for-families.page
- https://earlychildhoodny.org/ifcc/resourceguide.php
- https://www.timeout.com/new-york-kids/things-to-do/the-best-things-to-do-with-toddlers-in-nyc
- https://visitmanhattan.nyc/tripplanner/for-families/manhattan-with-toddlers
- https://www.timeout.com/new-york-kids/things-to-do/free-things-to-do-with-kids-in-new-york
- https://kidpaths.com/blog/new-york-city-itinerary-3day
- https://alexjessicamills.com/perfect-4-days-in-new-york-with-kids-itinerary/

Qualitative community examples:

- https://www.reddit.com/r/visitingnyc/comments/1sqel98/nyc_trip_report_5_days_with_6yearold_kids/
- https://www.reddit.com/r/visitingnyc/comments/1taeo9b/early_summer_trip_with_teenspreteen_itinerary/
- https://www.reddit.com/r/visitingnyc/comments/1txxeu4/teens_visiting_me/
- https://www.reddit.com/r/visitingnyc/comments/1uq5flj/trip_report_family_with_2_teens_times_square/
- https://www.reddit.com/r/visitingnyc/comments/1u96bm9/first_time_in_nyc_with_an_8yearold_looking_for/
- https://www.reddit.com/r/chubbytravel/comments/1seg7c3/where_to_stay_in_nyc_with_4_yo/

Community material supports question discovery and contradiction awareness only. It does not support demand, hotel facts, route guarantees, safety, or Family Tripwise experience claims.
