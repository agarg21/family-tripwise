# Next City Cluster Selection: Orlando

Status: complete and review-clean

Action: `FT-RES-011`

Prepared: 2026-07-28

Market: United States

Publication state: research only; no `site/**`, sitemap, indexability, deployment, indexing request, external account, outreach, or recurring automation change

## Decision

Select **Orlando** as the next Family Tripwise destination.

Orlando does not have the largest single all-ages activity query in the candidate set. It wins because it has the strongest combination of:

- meaningful all-ages family activity demand;
- a deep commercial hotel, resort, water-park, and lazy-river decision space;
- recurring parent problems around park choice, rest days, heat, rain, naps, mixed ages, transport, room function, and total trip cost;
- fragmented activity results where a compact decision product can be more useful than another long list; and
- enough distinct search jobs to support a coherent cluster without publishing a page for every modifier.

The first page should be one all-ages Orlando decision hub, not a generic attraction inventory. It should help a family choose the right kind of day: major park, non-park/rest day, indoor or heat backup, free or lower-cost option, younger-child day, or mixed-age/teen payoff. It should show useful defaults before filters.

The next commercial page should eventually compare named family hotels and resorts. Hotel, resort, water-park, lazy-river, suite, kitchen, and shuttle needs belong in one evidence-backed comparison initially. The exact family `where to stay` phrasing is currently too small to justify a separate area page before that comparison exists.

The `free things to do in Orlando with kids` family is different. It has 720 estimated monthly searches, KD 17, and a more cost-specific sampled SERP with only three retained exact URL overlaps against either broad activity sample. It is a credible later standalone page, but the all-ages hub should launch first with a genuinely useful free/budget route.

Toddler and teen SERPs are also distinct, but current exact demand is 70 and 40 respectively. Start with visible age routes in the hub. Reconsider separate pages only after the hub is live and fresh query evidence or a deeper keyword pass supports them.

Promoted next action:

- roadmap: `FT-PUB-006`
- implementation backlog: `IMP-041`
- research review: `SRR-034`
- title: "Research and publish the Orlando all-ages family activity hub"
- target: `https://familytripwise.com/things-to-do/orlando-with-kids.html`
- state: ready only after explicit user approval for a new destination publication

## Evidence Classification

| Evidence | Freshness | Classification and use | Limitation |
|---|---:|---|---|
| Repository, sitemap, generator modules, playbooks, and operator state | checked 2026-07-28 | Current source of truth for page inventory, release rules, and implementation constraints. | Does not establish external demand or rankings. |
| `ops/gsc-snapshots/2026-07-28.json` and `.md` | collected 2026-07-28; finalized through 2026-07-26 | Fresh authenticated read-only API evidence for the existing site. | Orlando is unpublished, so GSC cannot compare its demand or rank. |
| Logged-in Semrush Chrome session | collected 2026-07-28; US database, July 2026 | Current directional exact volume, KD, CPC, intent, query variants, and cached Google SERPs. | Estimates are not guaranteed traffic; similar variants overlap. |
| Semrush cached desktop Google SERPs | July 2026 snapshots inspected 2026-07-28 | Retained ranking URLs, result types, recurring domains, and SERP features. | Captured result surfaces include organic, forums, social, property, and SERP modules; counts are sample-specific. |
| Current public search and ranking pages | inspected 2026-07-28 | Current page structure, strengths, gaps, dates, and qualitative competition. | Search order varies and is not rank tracking. |
| Public parent/community discussions | inspected 2026-07-28 | Qualitative constraints, conflicts, and failure modes. | Not demand, verified facts, representative sentiment, or Family Tripwise experience. |

`n/a` below means Semrush did not provide a usable metric. It does not mean zero. Exact keyword rows overlap and must not be added together as unique demand.

## Candidate Screen

The screen compared five plausible US destinations that do not yet have live Family Tripwise pages. GSC existing discovery is `not applicable` for all five.

| Order | City | Strongest exact activity evidence | Commercial lodging evidence | Current SERP and product read | Main execution cost | Decision |
|---:|---|---|---|---|---|---|
| 1 | Orlando | `things to do in orlando with kids`: 3,600, KD 31 | Hotels 1,000/KD 27; resorts 720/KD 37; water-park hotels 1,600/KD 38; lazy-river resorts 1,600/KD 27 | Fragmented broad activity results; unusually deep and overlapping lodging constraints; strong need for park/rest/base decisions. | Highest fact volatility and scope discipline because park rules, hotels, transport, and weather change. | **Select.** Best whole-cluster value. |
| 2 | Miami | All-ages 4,400/KD 28; Miami Beach with kids 210/KD 27 | Hotels 480/KD 32; best hotels 260/KD 19; resorts 210/KD 26; stay 110/KD 16 | Balanced demand and commercial intent, but stronger current family publishers and a city-versus-beach architecture question. | Beach conditions, neighborhood, water, weather, and transport evidence. | Runner-up. Research after Orlando. |
| 3 | Dallas | All-ages 5,400/KD 32 | Hotels 480/KD 19; best hotels 170/KD 19; stay 30 | Weak and fragmented activity SERP, but thinner visitor lodging and planning depth. | Dallas-versus-DFW geographic boundaries and car-dependent recommendations. | Strong activity opportunity, weaker cluster. |
| 4 | Nashville | All-ages 4,400/KD 25; teens 140/KD 16 | Hotels 210/KD 13; best hotels 50/KD 10; stay 70/KD 11 | Social-heavy, weak activity SERP, but shallow family commercial depth. | Age fit, nightlife-versus-family framing, and transport. | Worth revisiting; not next. |
| 5 | Washington, DC | All-ages 1,900/KD 21; teens 260/KD 11 | Hotels 480/KD 18; best hotels 480/KD 30; stay 70/KD 15 | Excellent product fit, but official museums, zoo, and tourism pages dominate much of the informational job. | Timed-entry, federal operations, security, transit, and official-source maintenance. | Useful later; lower immediate opening. |

The order is qualitative, not a mathematical forecast. Orlando's advantage is cluster depth, not a claim that its rows can be summed into a larger unique audience.

### Runner-Up SERP Trace

Collection date: 2026-07-28. Market/device: United States desktop. These are representative retained URLs from the same July 2026 Semrush cached result surface used for Orlando. They document the page types and competitive opening behind each non-selection; they are not rank tracking or complete result sets.

| City | Exact sampled queries | Representative retained results and recurring domains | Page types, strengths, and gaps | Why it did not win |
|---|---|---|---|---|
| Miami | `things to do in miami with kids`; `family friendly hotels in miami` | Activities: [Bridges and Balloons](https://bridgesandballoons.com/things-to-do-in-miami-with-kids/), [Family Voyage](https://www.thefamilyvoyage.com/things-to-do-in-miami-with-kids/), [Miami and Beaches](https://www.miamiandbeaches.com/travel-interests/family-fun-guides), and [Visit Florida](https://www.visitflorida.com/travel-ideas/articles/miami-with-kids/). Hotels: [Bridges and Balloons](https://bridgesandballoons.com/cool-places-to-stay-in-miami-beach-with-kids/), [Loews](https://www.loewshotels.com/miami-beach/discover/family-resort), [Marriott](https://www.marriott.com/en-us/destinations/united-states/florida/miami-beach/family-friendly-hotels.mi), [Tripadvisor](https://www.tripadvisor.com/Hotels-g34439-zff4-Miami_Beach_Florida-Hotels.html), and family hotel discussions on Reddit. | Family publishers and official tourism pages supply useful visitor breadth; properties and OTA/review pages supply inventory and reviews. The set mixes Miami and Miami Beach, while family decisions also depend on beach/water conditions, neighborhood, weather, and transport. | Strong runner-up, but the city/Beach architecture and higher source burden need a dedicated pass. Orlando offers more immediately coherent cluster depth. |
| Dallas | `things to do in dallas with kids`; `family friendly hotels in dallas` | Activities: [Visit Dallas](https://www.visitdallas.com/things-to-do/family-fun/), [Young House Love](https://www.younghouselove.com/dallas-texas-family-vacation/), [DFWChild](https://dfwchild.com/calendar/), and [Tripadvisor](https://www.tripadvisor.com/Attractions-g55711-Activities-zft11306-Dallas_Texas.html). Hotels: [Visit Dallas](https://www.visitdallas.com/blog/the-best-family-friendly-hotels-in-dallas/), [Mommy Poppins](https://mommypoppins.com/best-dallas-hotels-kids-families), [Great Wolf Lodge Grapevine](https://www.greatwolf.com/grapevine), [Tripadvisor](https://www.tripadvisor.com/Hotels-g55711-zff4-Dallas_Texas-Hotels.html), and repeated Reddit/AskDFW discussions. | Activity results are fragmented across official lists, older family posts, calendars, attractions, and community answers. Hotel results mix city properties, destination resorts, editorial lists, and OTA/review inventory across Dallas, Grapevine, and the wider DFW area. | The activity opening is attractive, but the visitor lodging/planning cluster is thinner and the Dallas-versus-DFW boundary adds product ambiguity. |
| Nashville | `things to do in nashville with kids`; `family friendly hotels in nashville` | Activities: [Visit Music City](https://www.visitmusiccity.com/nashville-trip-ideas/family-friendly-nashville), [Emily M. Krause](https://www.emilymkrause.com/blog/fun-things-to-do-in-nashville-for-families), [Kids Out and About](https://nashville.kidsoutandabout.com/), and [Camels and Chocolate](https://www.camelsandchocolate.com/nashville-family-travel/), alongside recurring social/community results. Hotels: [Loews Vanderbilt](https://www.loewshotels.com/vanderbilt-hotel/family-resort), [Tripadvisor](https://www.tripadvisor.com/Hotels-g55229-zff4-Nashville_Davidson_County_Tennessee-Hotels.html), [Six Suitcase Travel](https://sixsuitcasetravel.com/nashville-big-family-hotels-sleep-5-6-7-8), and repeated VisitingNashville discussions. | The activity SERP has a real clean-decision opportunity because social, video, local directories, official tourism, and family posts are mixed. Lodging results are shallower and split among properties, OTAs, large-family room lists, area guides, and community advice. | Worth revisiting, especially for activities and teens, but the family commercial cluster is materially smaller than Orlando's. |
| Washington, DC | `things to do in washington dc with kids`; `family friendly hotels in washington dc` | Activities: [Smithsonian Natural History](https://naturalhistory.si.edu/), [National Zoo](https://nationalzoo.si.edu/), [Air and Space Museum](https://airandspace.si.edu/), [Washington.org](https://washington.org/family-friendly), and [Mommy Poppins](https://mommypoppins.com/washington-dc-family/free-activities/free-things-to-do-in-dc-with-kids). Hotels: [Washington.org](https://washington.org/places-to-stay/family-friendly-hotels), [Big Brave Nomad](https://www.bigbravenomad.com/blog/the-best-family-friendly-hotels-in-washington-dc), [Four Seasons](https://www.fourseasons.com/washington/services-and-amenities/family/), and repeated WashingtonDC/Marriott/ChubbyTravel discussions. | Current official museum, zoo, and destination pages answer much of the attraction job with authority and operational freshness we cannot honestly copy. The hotel set mixes official tourism, family editorial, properties, and community advice and still offers comparison opportunities. | Excellent family-product fit, but lower broad activity demand and a stronger official-authority result set make the immediate acquisition opening narrower. |

No runner-up was rejected because one result looked strong or weak. The decision uses the combination of exact demand, recurring result types/domains, distinct family decisions, attainable usefulness gains, cluster depth, and upkeep cost.

## Orlando Query Universe

Exact US monthly estimates below were collected in Semrush on 2026-07-28.

| Theme | Representative exact evidence | Likely job | Page treatment |
|---|---|---|---|
| Broad family activities | `things to do in orlando with kids` 3,600, KD 31; `things to do in orlando florida with kids` 1,000, KD 30; `orlando things to do with kids` 720, KD 23; `what to do in orlando with kids` 390, KD 24 | Choose worthwhile family days across parks and non-park Orlando. | One all-ages hub; first publication. |
| Generic city-with-kids | `orlando with kids` 140, KD 26; Keyword Magic exposed 705 broad variants and 12.8K aggregate volume | Orient a family trip. | Route through the cluster; aggregate includes noise and overlapping phrases and is not unique traffic. |
| Free and budget | `free things to do in orlando with kids` 720, KD 17 | Find a real low-cost or no-ticket day. | Strong hub route now; credible standalone page after the hub. |
| Non-Disney and rest day | exact `non disney things to do in orlando with kids` 10, KD n/a; recurring ranking/community questions | Make one Orlando day that does not require another major park ticket. | Hub route and later free/budget support; no thin `non-Disney` URL. |
| Toddlers and younger children | `orlando with toddlers` 70, KD 16 | Protect naps, exits, heat, height splits, food, and room proximity. | Visible hub route; no standalone page now. |
| Teens and mixed ages | `orlando with teens` 40, KD 5 | Find enough older-child payoff and solve sibling splits. | Visible hub route; no standalone page now. |
| Family hotels | `family friendly hotels in orlando` 1,000, KD 27, transactional, CPC $1.68; Florida wording 480/KD 24; `best family hotels in orlando` 260/KD 25 | Compare named properties for a family trip. | One future hotel/resort comparison. |
| Family resorts | `family friendly resorts in orlando` 720, KD 37, commercial, CPC $1.34 | Choose a property that can carry part of the trip. | Same hotel comparison, with a visible resort route. |
| Water features | `orlando hotels with water parks` 1,600, KD 38, mixed informational/transactional; `orlando resorts with lazy river` 1,600, KD 27 | Select a property by high-value family amenity. | Prominent hotel fields/routes; test standalone intent only after the comparison exists. |
| Stay/base choice | `where to stay in orlando with kids` 10, KD n/a; `best area to stay in orlando for families` 10, KD n/a | Choose Disney, Universal, I-Drive, Lake Buena Vista/Bonnet Creek, or a villa-style base. | Put a compact base chooser in the future hotel page; defer a separate area URL. |
| Family itinerary | `orlando family itinerary` 20, KD n/a; `orlando family vacation itinerary` 20, KD n/a; exact `orlando itinerary with kids` 0 | Sequence park days, rest days, heat, and hotel resets. | Future supporting itinerary, not an acquisition lead. |
| Rain, heat, and indoor backup | recurring official pages, ranking pages, and community questions; focused exact demand not retained | Replace or shorten a day when weather or energy changes. | Hub filters/routes and itinerary pivots. |
| Transport, nap, stroller, parking, and car friction | recurring parent questions; no stable standalone demand claimed | Decide whether a midday return or cross-area day is realistic. | Cross-page decision fields, not indexable filters. |
| Local/weekend/current | local directories and event pages recur in activity results | Find current events. | Defer until a durable freshness workflow exists. |

Disney World and Orlando are related, but Disney-specific intent must remain marked. This pack does not authorize separate Disney park, ticket, hotel, or itinerary URLs. Those searches face a different authority set and require their own overlap and product review.

## Observed SERP Overlap

Collection date: 2026-07-28. Market/device: United States desktop. Counts refer only to retained URLs in the sampled July 2026 Semrush result surfaces.

| Query pair or family | Retained recurring pages/domains | Observed overlap and result type | Features | Decision / confidence |
|---|---|---|---|---|
| `things to do in orlando with kids` vs `orlando things to do with kids` | The Traveling Child, Where's Sharon, Fun 4 Orlando Kids, Crayola Experience, Visit Orlando, My Central Florida Family, and Top Villas | Seven retained exact URLs recur. Both return broad family lists/directories, official destination content, an attraction page, and community/social results. | Top sights/local module, PAA, web, forum/social, video | One all-ages hub; **high**. |
| Broad activities vs `free things to do in orlando with kids` | The Traveling Child, Where's Sharon, and My Central Florida Family recur exactly; Fun 4 Orlando Kids and Visit Orlando recur at domain level on dedicated cost pages | Three retained exact URLs plus domain-only recurrence. The free SERP adds dedicated free/cheap pages, Disney Springs/Skyliner, and local low-cost discussions. | AI mode, PAA, social/forums, official/local free pages | Hub route first; preserve a later standalone free/budget page; **medium-high**. |
| Broad activities vs `orlando with toddlers` | The Traveling Child and Crayola Experience recur exactly; the toddler set adds Peppa Pig, Sesame Street Land, Visit Orlando's toddler guide, Mommy Poppins, Orlando Parenting, and toddler discussions | Two retained exact URLs and a clearly more age-specific page set. Demand is only 70. | Attractions, age guides, forums/social | Hub route now; separate page only after more evidence; **medium-high**. |
| Broad activities vs `orlando with teens` | The Traveling Child recurs exactly; the teen set adds Family Voyage, Visit Orlando's teen guide, Orlando Weekly, Yelp, Mommy Poppins, and teen discussions | One retained exact URL and a distinct older-child result set. Demand is only 40. | Local lists, forums/social, review directory | Hub route now; separate page only after more evidence; **medium-high**. |
| `family friendly hotels in orlando` vs `best family hotels in orlando` | Four Seasons, Reddit family travel, Westgate, Tripadvisor, Hotel Scoop, Orlando Parenting, and Travelocity recur | At least seven meaningful retained URLs recur across property, community, OTA/review, and editorial results. Same named-property decision. | Hotel pack/map, PAA, forums, social/video, OTA lists | One family-hotel comparison; **high**. |
| Family hotels vs `family friendly resorts in orlando` | Four Seasons, Westgate, Reddit family travel, Hotel Scoop, and Marriott recur; resort-specific property and Tripadvisor resort pages enter | Five retained exact URLs recur against the family-hotel set. Resort intent emphasizes water features and staying on-property, but the decision object remains a named property. | Hotel/property modules, PAA, forums/social | One hotel page with a visible resort route; **high**. |
| Stay/base choice vs family hotels | Mini Travellers and current public results frame Disney, Universal, I-Drive, Lake Buena Vista, Kissimmee/villas, driving, kitchens, and family size; hotel SERPs are named-property led | Page types differ, but family-specific area demand is 10 and no complete comparable SERP intersection was retained. | Area guides, hotel lists, property/OTA pages, PAA | Base chooser within hotel page first; numeric overlap `UNKNOWN`; **medium**. |
| Family itinerary and duration variants | Viator, With the Blinks, LEGOLAND, Disney-specific publishers, and community planning threads appear in current search | Mixed city, park, and brand-specific sequencing. No complete comparable cached sets were retained. | Itineraries, tickets, brand pages, forums | One future Orlando-level sequencing product; numeric overlap `UNKNOWN`; **medium**. |

### Retained Broad Activity Samples

Sample A, `things to do in orlando with kids`:

- [The Traveling Child: things to do beyond theme parks](https://thetravelingchild.co/things-to-do-in-orlando-besides-theme-parks/)
- [Where's Sharon: Orlando on a budget](https://www.wheressharon.com/family-trip-usa-caribbean/road-trip-usa/things-to-do-in-orlando-on-a-budget/)
- [Fun 4 Orlando Kids](https://fun4orlandokids.com/)
- [Crayola Experience Orlando](https://www.crayolaexperience.com/orlando)
- [Visit Orlando: visiting with kids](https://www.visitorlando.com/plan/vacation-ideas/visiting-with-kids/)
- [My Central Florida Family](https://mycentralfloridafamily.com/)
- [Top Villas: Orlando with kids](https://www.thetopvillas.com/blog/florida/orlando/52-things-to-do-in-orlando-with-kids/)
- [Tripadvisor family attractions](https://www.tripadvisor.com/Attractions-g34515-Activities-zft11306-Orlando_Florida.html)
- [Reddit: Orlando-area family ideas](https://www.reddit.com/r/florida/comments/1is59z5/things_to_do_in_orlando_area_with_family_that/)
- [Reddit: underrated Orlando places](https://www.reddit.com/r/orlando/comments/1j3fkdv/what_are_your_favorite_underrated_placesthings_to/)

Sample B, `orlando things to do with kids`, repeats the first seven exact URLs above and adds property, local, video, and social results. The seven-URL intersection supports one broad page independently of phrase similarity.

### Retained Free/Cost Sample

The cost-first sample includes:

- [Orlando Parenting: free things to do with kids](https://orlando-parenting.com/free-things-to-do-with-kids/)
- [Fun 4 Orlando Kids: free fun](https://fun4orlandokids.com/Fun-Around-Town/Free-Fun/)
- [Visit Orlando: cheap things to do](https://www.visitorlando.com/blog/post/cheap-things-to-do-orlando/)
- the same Where's Sharon, My Central Florida Family, and The Traveling Child URLs above;
- [Reddit: free and low-cost Orlando ideas](https://www.reddit.com/r/orlando/comments/1i49l25/what_are_some_free_low_cost_things_to_do_during/).

The current free result set is not merely the broad list with the word `free` added. It deserves a future page decision after the hub establishes the cluster.

### Retained Hotel Samples

Shared hotel/best-hotel results include:

- [Orlando Parenting: family hotels with water features](https://orlando-parenting.com/family-orlando-hotels-water-parks/)
- [Reddit family-travel hotel discussion](https://www.reddit.com/r/familytravel/comments/1p3368n/whats_your_goto_family_friendly_hotels_in_orlando/)
- [Hotel Scoop: Orlando family hotels and resorts](https://www.hotel-scoop.com/best-family-friendly-hotels-walt-disney-world-orlando-florida/)
- [Westgate family hotels and resorts](https://www.westgateresorts.com/hotels/family/)
- [Four Seasons Orlando family resort](https://www.fourseasons.com/orlando/family-resort/)
- [Tripadvisor Orlando family hotels](https://www.tripadvisor.com/Hotels-g34515-zff4-Orlando_Florida-Hotels.html)
- [Travelocity Orlando family hotels](https://www.travelocity.com/Orlando-Hotels-Family-Hotel.0-0-d178294-tFamilyHotel.Travel-Guide-Filter-Hotels).

The family-resort sample repeats Four Seasons, Westgate, the family-travel discussion, and Hotel Scoop, while adding Mommy Poppins, Grove Resort, Floridays, a resort-specific Tripadvisor result, and stay-on-property discussions. This supports one comparison with explicit hotel-versus-resort and water-feature routes.

## Representative Ranking-Page Analysis

| Page/domain | What it answers well | Weakness or opportunity | Advantage Family Tripwise cannot copy | Honest Family Tripwise response |
|---|---|---|---|---|
| [Visit Orlando: visiting with kids](https://www.visitorlando.com/plan/vacation-ideas/visiting-with-kids/) and its [toddler guide](https://www.visitorlando.com/blog/post/orlando-activities-for-toddlers/) | Current destination breadth, every-age routing, official attraction context, accommodations, dining, maps, and direct links. | Promotional and effectively infinite choice; a family still has to decide which one or two days fit its park plan, budget, heat tolerance, and hotel base. | Destination access, current inventory, partner relationships, and vacation planners. | Use primary facts while providing a smaller, neutral comparison with deletions and stop rules. |
| [The Traveling Child](https://thetravelingchild.co/things-to-do-in-orlando-besides-theme-parks/) | Firsthand family context, non-theme-park positioning, age/nap questions, duration planning, original photos, and specific daughter experiences. | Long narrative, older details, inconsistent comparison fields, and no compact city-wide decision surface. | Firsthand family visit and original media. | Keep the non-park insight, but date every current fact and normalize age, time, cost, weather, geography, and planning friction. |
| [Sunlight Kids](https://www.sunlightkids.com/orlando-with-kids) | Clean, concise activity cards, age labels, direct Google Maps links, free/stay/day-trip sections, and visible defaults. | Very brief claims and age labels have little visible evidence or uncertainty; the page mixes several jobs and repeats product promotions. | Claimed parent authorship and its own products. | Match the scan quality while adding stronger source traceability, trip-day comparison, and clear park/rest/base logic. |
| [KidPaths Orlando](https://kidpaths.com/orlando) | Large inventory, ratings, age tags, indoor/outdoor, free, rainy-day, stroller labels, and place links. | The long directory still creates high choice cost; broad labels do not explain route, reset, ticket, height, or sibling tradeoffs. | Directory scale and place/review aggregation. | Use a smaller earned set, explain why each option deserves a trip role, and avoid unsupported blanket route or stroller verdicts. |
| [Mommy Poppins: 100 free things](https://mommypoppins.com/25-free-things-to-do-with-kids-in-orlando) | Current 2026 local breadth, free-event knowledge, and a dedicated cost-first job. | One hundred choices mix visitor anchors, local events, and day trips; a short-stay visitor still needs a prioritized route. | Local editorial/event maintenance. | Do not out-list it. Later build a visitor-focused free/budget decision page with current direct checks and a much smaller set. |
| [Visiting Orlando With Kids: family hotels](https://visitingorlandowithkids.com/the-best-hotels-for-families-in-orlando/) | Firsthand stays at seven properties, 22-hotel breadth, rooms, kitchenettes, pools, lazy rivers, kids clubs, and detailed photos. | Extremely long and affiliate-heavy; some perk language is stale, including FastPass+ and old Extra Magic Hours wording. Uniform total-night, transport, and freshness comparison is difficult. | Firsthand stays and original hotel photography. | Future hotel evidence should compare a broad candidate pool with current official facts, broad total-night ranges, bounded recent review signals, and one decisive check per property. |
| [Orlando Parenting: water-park hotels](https://orlando-parenting.com/family-orlando-hotels-water-parks/) | Local/editor stays, 20-property breadth, detailed pool and water-feature observations, photos, and useful younger-versus-older swimmer nuance. | Comparison fields are not uniform, and time-sensitive perks can age; the page still references a March-October 2025 admission offer. | Local parent/editor experience and original property media. | Treat water features as a first-class comparison field while separately checking current access, fees, room function, and review conflicts. |
| [Mini Travellers: where to stay](https://minitravellers.co.uk/where-to-stay-in-orlando-with-kids/) | Strong Disney/Universal/I-Drive/villa framing, family-size and kitchen questions, driving-versus-Uber logic, and firsthand stays. | Long affiliate-led prose, UK-specific driving perspective, and limited compact hotel/base comparison. | Firsthand stays, family travel history, and original photos/video. | Put a small base chooser ahead of a named-property comparison and make park-return/reset logic easy to scan. |
| Tripadvisor and Google's hotel module | Inventory, live-ish prices, maps, ratings, large review volume, and booking comparison. | Popularity and aggregate ratings do not resolve room function, park strategy, resort-as-destination value, or bounded family-specific conflicts cleanly. | Booking inventory, review scale, and transaction data. | Never imitate review volume. Normalize family decision fields and link out for current booking and review checks. |

The opportunity is disciplined quality, not a novelty claim: current source-backed information, clean defaults, low-friction comparison, constraint routing, maps, and bounded uncertainty.

## Persona Hypotheses

These are research hypotheses derived from query modifiers, current result structures, public parent questions, and Family Tripwise product constraints. They are not demographic truth.

| ID | Persona hypothesis | Job to be done | Trip context and evidenced constraints | Anxieties | Decision criteria | Failure mode | Searches/pages |
|---|---|---|---|---|---|---|---|
| `ORL-P1` | First-time park-priority family | Choose which major park days deserve the budget and what to do with the remaining day. | Short or once-in-a-long-time trip; school-age or mixed ages; Disney, Universal, SeaWorld, and non-park options compete. | Paying for the wrong park, missing a signature experience, overfilling every day. | Child interests, height splits, total day commitment, park geography, one rest or weather pivot. | Treating every park as mandatory and exhausting the family by day three. | Broad hub, future itinerary, future hotel comparison. |
| `ORL-P2` | Toddler reset family | Protect naps, meals, heat recovery, early bedtime, and an easy exit without wasting the trip. | Baby through preschool; midday hotel return may or may not be realistic. Parents explicitly debate stroller naps versus hotel breaks and proximity. | Overtired child, long return transit, heat, height splits, sitting in a dark room after bedtime. | Short exit, room separation, fridge/kitchen, pool, transport, low-commitment backup. | Booking a distant base and planning rope-drop-to-fireworks days. | Hub younger-child route, hotel comparison, itinerary. |
| `ORL-P3` | Mixed-age park and sibling-split family | Give a teen or thrill-seeker real payoff while a baby or younger child still has a workable day. | Teen/tween plus younger sibling; indoor, stroller, and different-height needs recur in current discussions. | One child is bored while another cannot ride; too many handoffs or separate tickets. | Shared anchors, explicit split points, indoor backup, ride/height checks, reset location. | A page calls something “all ages” without explaining the split. | Hub mixed-age route, later hotel and itinerary products. |
| `ORL-P4` | Resort-led low-logistics family | Choose a hotel or resort that can carry pool, water-park, room-space, food, and downtime value. | May spend a full day on-property; suites, kitchens, lazy rivers, water parks, and teen onsite payoff recur. | Paying resort prices but still driving everywhere; water feature access not included; room setup fails. | Broad total-night range, included access, room function, park/base fit, current review conflicts, one decisive check. | Selecting by pool photos and discovering fees, access limits, or poor trip geography later. | Future hotel/resort comparison. |
| `ORL-P5` | Budget and non-park family | Build a satisfying free, cheap, or rest day around an expensive park trip. | Free exact demand is substantial; current results mix genuinely free places, shopping districts, promotions, events, and day trips. | “Free” options still require parking or purchases; another expensive ticket day; dated event advice. | True entry/parking cost, currentness, child payoff, geographic pairing, heat/rain plan. | A 100-item list that hides the few realistic visitor choices. | Hub free/budget route; later standalone page. |
| `ORL-P6` | Car-and-base optimizer | Decide where to sleep based on the actual park mix and whether a midday return matters. | Disney, Universal, I-Drive, Lake Buena Vista/Bonnet Creek, and villa-style Kissimmee bases create different transport tradeoffs. | Losing hours to cross-area trips, unreliable shuttle assumptions, parking/ride-share cost, split stays. | First two days, return-to-room plan, car/no-car reality, room function, resort value. | Choosing a generic “central” hotel that is central to nothing in the itinerary. | Future hotel page base chooser; future itinerary. |

Qualitative community evidence includes:

- [a current toddler late-night discussion](https://www.reddit.com/r/WaltDisneyWorld/comments/1v7jzwq/late_nights_with_young_kidstoddlers/) showing that stroller naps, hotel resets, and early endings vary by child;
- [a midday-break discussion](https://www.reddit.com/r/WaltDisneyWorld/comments/1t5rmtw/midday_break_thoughts/) showing that base proximity changes whether a break is useful;
- [a toddler hotel-proximity question](https://www.reddit.com/r/WaltDisneyWorld/comments/1v752x2/disney_with_toddlers/) connecting naps, pool value, and overspending;
- [a mixed teen-and-baby indoor question](https://www.reddit.com/r/orlando/comments/1thofq5/lowkey_indoor_things_to_do_in_orlando_with_a_teen/) showing a real sibling and weather constraint;
- [a resort-as-destination question](https://www.reddit.com/r/familytravel/comments/1v5j7z6/resort_in_florida_that_is_fun_enough_to_not_have/) showing water-feature and teen onsite tradeoffs; and
- [a toddler non-park day-trip question](https://www.reddit.com/r/orlando/comments/1sw7dd1/toddlerfriendly_day_trip_from_disney_area_worth/) connecting nap preservation with geography.

These discussions identify questions and conflicts only. They do not prove demand, current property facts, safety, or a universal family answer.

## Current Page And Prototype Audit

No canonical/indexable Orlando page and no unpublished Orlando prototype exists in `site/**`, `src/**`, `status/**`, or `tools/**` as of 2026-07-28. There is therefore no current Orlando cannibalization or observation window.

The architecture must still avoid future self-competition:

| Planned role | Primary job | Overlap risk | Decision |
|---|---|---|---|
| All-ages activities | Choose the right Orlando family day and route to age, budget, weather, hotel, and itinerary decisions. | Can become a generic city guide or absorb every modifier. | Build first as a compact router/comparison. |
| Family hotels and resorts | Compare named properties by park/base fit, room function, rough total-night range, water/resort role, and bounded review signals. | Can duplicate a separate area guide or split into thin resort/amenity pages. | One future page; include a compact base chooser and amenity routes. |
| Free/budget activities | Choose a genuinely low-cost visitor day. | Can duplicate the all-ages inventory. | Hub route first; later separate only with a smaller cost-first comparison and distinct source upkeep. |
| Family itinerary | Sequence park, rest, weather, and reset days. | Can repeat activity descriptions or become Disney-specific. | Future support page with sequencing only. |
| Toddler and teen advice | Solve age-specific pacing and payoff. | Low exact demand can create thin pages; current result sets are distinct. | Visible hub routes first; reconsider after query evidence. |
| Stay areas | Choose a base. | Only 10 exact family searches. The product job overlaps with hotel/base decisions, while numeric SERP URL overlap remains `UNKNOWN`. | Module in hotel page first; do not publish a separate URL now. |
| Disney-specific planning | Solve park-brand choices. | High authority competition and likely overlap with brand-specific publishers. | Defer to a separate future research action. |

## Prioritized Orlando Page Map

| Priority | Page or module | Stance | Evidence-based reason |
|---:|---|---|---|
| 1 | `things-to-do/orlando-with-kids.html` | **Research and publish one page after approval** | Strong broad demand, seven-URL overlap across word-order variants, fragmented results, and a clear decision-product opportunity. |
| 2 | `where-to-stay/orlando-family-hotels.html` | Research after the hub | Deep commercial hotel/resort/water-feature demand and high observed SERP overlap. |
| 3 | Free/budget activity page | Preserve as likely standalone; recheck after hub | 720/KD 17 and a more cost-specific result set with only three exact overlaps against broad samples. |
| 4 | `family-itinerary/orlando-with-kids.html` | Supporting page later | Clear product need, but exact family demand is only 20 and current results mix city and brand-specific plans. |
| 5 | Stay/base chooser | Module in hotel page | Family-specific area phrases are 10; the decision is essential but does not yet justify another URL. |
| 6 | Toddler and teen routes | Modules in hub | Distinct SERPs, but exact demand is only 70 and 40. |
| 7 | Rain, heat, indoor, rest-day, stroller, nap, transport | Cross-page fields/routes | Useful constraints without retained standalone demand. |
| 8 | Disney-specific pages | Defer | Distinct brand intent and authority set require separate research. |

This is deliberately smaller than the five-page city pattern used elsewhere. The cluster can grow after each page proves a distinct job.

## Promoted Next Action

Roadmap action: `FT-PUB-006`

Implementation backlog: `IMP-041`

Research review: `SRR-034`

Title: Research and publish the Orlando all-ages family activity hub.

Target URL:

- `https://familytripwise.com/things-to-do/orlando-with-kids.html`

State:

- `ready_pending_user_approval`
- `AGENTS.md` requires user approval for a new destination publication.
- This research action does not supply that approval.

Expected maximum transaction scope:

- `docs/research/orlando-activity-page-review.md`
- `tools/page-generation/city-data.mjs`
- `tools/page-generation/upgrade-page-data.mjs`
- `tools/generate-pages.mjs`
- `tools/orlando-activities-page.test.mjs`
- `site/things-to-do/orlando-with-kids.html`
- `site/index.html`
- `site/sitemap.xml`
- `status/orlando-pages.md`
- `backlog/seo-research-review-backlog.md`
- `backlog/implementation-backlog.md`
- `ops/needs-user.md`
- `ops/seo-roadmap.json`
- `ops/seo-roadmap.md`
- `ops/current-cycle.md`
- `ops/operator-review.md`

Acceptance criteria:

1. Refresh representative broad, free/budget, toddler, teen/mixed-age, park-choice, non-park, indoor/heat/rain, and itinerary SERPs before writing.
2. Review at least 25 candidate day or attraction roles across Disney, Universal, SeaWorld/Discovery Cove, LEGOLAND/Peppa Pig, non-park Orlando, indoor/weather backup, nature/day trips, and truly free or low-cost options.
3. Retain only options with distinct family decision value. A likely 12-16 choice set is a hypothesis, not a quota.
4. Give `ORL-P1` through `ORL-P6` a useful visible default before requiring a filter.
5. Use one compact comparison layer; add deeper notes only where park commitment, height splits, geography, weather, transport, or advance booking materially changes the decision.
6. Make “major park,” “rest/non-park day,” “free/lower-cost,” “younger child,” “mixed age/teen,” and “indoor/heat pivot” visible routes without publishing filtered URLs.
7. Treat Walt Disney World, Universal Orlando, SeaWorld, Discovery Cove, LEGOLAND Florida, and Peppa Pig as distinct current official-source checks. Do not turn the page into ride-by-ride advice.
8. Include direct Google Maps links for retained non-park places and useful park/base context without a heavy embedded map.
9. Do not claim firsthand experience, exact route or wait time, stroller/accessibility practicality, safety, water suitability, stable hours/prices, height eligibility, weather suitability, or universal age/family fit without adequate evidence.
10. Add one canonical/indexable URL and one sitemap entry only. Link it from home; do not publish hotel, itinerary, free, stay, toddler, teen, or Disney-specific URLs in the same transaction.
11. Prove target-only and full generation idempotency plus byte-stability for every unrelated public file.
12. Pass focused tests, the full repository suite, operator-state QA, local SEO QA, responsive browser review at 1280/390/320 widths, image/source/link checks, schema/FAQ alignment, privacy and credential scans, duplicate-key-safe roadmap JSON, exact-path review, and `git diff --check`.
13. Obtain an independent read-only reviewer `PASS` or `PASS_WITH_P3` with no P0-P2 before commit/push/deploy.

Production invariant:

- one new canonical/indexable Orlando all-ages activity URL;
- one sitemap entry;
- no sibling Orlando page;
- no external-account mutation, per-URL indexing request, affiliate CTA, outreach, booking action, or recurring automation.

## Measurement Plan

Before release:

- record the publication date and exact release commit;
- verify the canonical, meta description, schema, internal links, one sitemap entry, image dimensions, and mobile/desktop containment;
- verify every volatile attraction or park claim against a current direct source.

After a separately authorized release:

1. Verify the Pages workflow, release marker, production content invariants, and production SEO QA.
2. Wait for current URL Inspection evidence that Google has discovered and crawled the new URL. Do not request indexing.
3. Use public-safe GSC page evidence for indexing, impressions, clicks, and page-level average position.
4. Use the protected query workflow only when query evidence exists; keep raw rows out of the repository.
5. Check whether broad, free/budget, park, toddler, teen/mixed-age, and non-park families are being discovered.
6. Use evidence, not a calendar scan, to decide whether the hotel page, free/budget page, or a hub correction is next.

Initial target:

- first establish relevant discovery and a current crawl;
- then seek top-20 visibility for broad family-activity variants;
- pursue top 10 only after the query family, page fit, and competitive result set are evidenced.

No traffic or revenue forecast is claimed from these overlapping Semrush rows.

## Boundaries And Open Questions

- No Orlando page exists today, so the next publication is a new-destination gate.
- Current GSC cannot answer which unpublished city will rank.
- Semrush estimates are directional and overlapping.
- The free/budget page has enough evidence to preserve, not enough to bypass the hub.
- The hotel page has strong demand but requires a separate candidate/evidence transaction because room function, fees, water-feature access, prices, and review conflicts are volatile.
- No separate stay-area page is justified yet.
- No Disney-specific URL is justified by this Orlando-level pass.
- No page should require users to configure many filters before receiving a useful recommendation.

## Source Register

Repository:

- `AGENTS.md`
- `docs/plan/incremental-city-cluster-playbook.md`
- `docs/plan/seo-cluster-research-protocol.md`
- `docs/plan/content-strategy.md`
- `ops/gsc-snapshots/2026-07-28.md`
- `ops/seo-roadmap.json`

Current ranking and source pages:

- [Visit Orlando: visiting with kids](https://www.visitorlando.com/plan/vacation-ideas/visiting-with-kids/)
- [Visit Orlando: Orlando activities for toddlers](https://www.visitorlando.com/blog/post/orlando-activities-for-toddlers/)
- [Visit Orlando: teen and tween guide](https://www.visitorlando.com/blog/post/orlando-teen-travel-guide/)
- [Visit Orlando: cheap things to do](https://www.visitorlando.com/blog/post/cheap-things-to-do-orlando/)
- [The Traveling Child: Orlando beyond theme parks](https://thetravelingchild.co/things-to-do-in-orlando-besides-theme-parks/)
- [Where's Sharon: Orlando on a budget](https://www.wheressharon.com/family-trip-usa-caribbean/road-trip-usa/things-to-do-in-orlando-on-a-budget/)
- [Sunlight Kids: Orlando with kids](https://www.sunlightkids.com/orlando-with-kids)
- [KidPaths Orlando](https://kidpaths.com/orlando)
- [Mommy Poppins: free Orlando](https://mommypoppins.com/25-free-things-to-do-with-kids-in-orlando)
- [Mini Travellers: where to stay](https://minitravellers.co.uk/where-to-stay-in-orlando-with-kids/)
- [Visiting Orlando With Kids: family hotels](https://visitingorlandowithkids.com/the-best-hotels-for-families-in-orlando/)
- [Orlando Parenting: water-park hotels](https://orlando-parenting.com/family-orlando-hotels-water-parks/)
- [Hotel Scoop: Orlando family hotels](https://www.hotel-scoop.com/best-family-friendly-hotels-walt-disney-world-orlando-florida/)
- [Tripadvisor Orlando family attractions](https://www.tripadvisor.com/Attractions-g34515-Activities-zft11306-Orlando_Florida.html)
- [Tripadvisor Orlando family hotels](https://www.tripadvisor.com/Hotels-g34515-zff4-Orlando_Florida-Hotels.html)

Qualitative community pages are linked in the persona section. They were used only to identify questions and conflicts.

Representative runner-up ranking pages are linked in the candidate trace above. They were used to compare result types, strengths, gaps, and research burden, not to claim stable rankings.
