# Las Vegas Stay-Area Competitor And Section Review

Status: implementation evidence record

Action: `FT-IMP-008` / `SRR-013`

Prepared: 2026-07-22

Target: `https://familytripwise.com/where-to-stay/las-vegas-with-kids.html`

## Decision

Keep the existing URL, but give it one job: help a family choose the kind of Las Vegas base that fits the trip. The separate hotel page now owns named-property comparison, rough nightly ranges, room and amenity facts, recent online-review themes, and maps.

The stay page should compare five useful base types, explain what each changes, and move the reader to hotels, activities, teens, or itinerary planning. It should not repeat hotel profiles, present a universal best area, or bury the answer under repeated verification language.

## Evidence And Freshness

| Evidence | Classification | Freshness | Use | Limit |
|---|---|---:|---|---|
| GSC public-safe snapshot | Fresh authenticated read-only API | Collected July 22; finalized through July 20 | Target has 13 impressions, 0 clicks, and page-level average position 44.69. | Too sparse for a query-rank or performance conclusion; no protected queries are exposed. |
| Semrush exact-query check | Authenticated US estimate reused from `FT-RES-007` | Collected July 22 | `where to stay in Las Vegas with kids` estimated at 20 searches/month. | Directional estimate; hotel and area variants overlap and cannot be summed into unique demand. |
| Public SERPs | Current public search and page inspection | Collected July 22 | Shows blended area and named-hotel results, with the Strip, Downtown, resort-led stays, suite/non-gaming needs, and outlying car-based bases recurring. | Results vary by time and location; not a rank tracker. |
| Ranking pages | Current editorial, OTA, and community pages | Checked July 22 | Identifies strong area-plus-hotel coverage and gaps in fast family decision support. | Family Tripwise cannot copy firsthand stays, local authority, inventory, or a large review corpus. |
| Official transport, attraction, and city pages | First-party or government | Checked July 22 | Supports current route systems and the identity of the main Strip, South Strip, Red Rock, and Downtown anchors. | An area page cannot prove an exact hotel route, walking experience, noise level, pool access, or room condition. |
| Community discussions | Qualitative UGC | Current/recent examples inspected July 22 | Reveals trip shapes around pools, one-night stays, road trips, Red Rock/Valley of Fire, parking, room routine, and older-child activities. | Anecdotes are not demand, verified facts, safety evidence, or reusable firsthand experience. |
| Hotel evidence pack and live hotel page | Repository publication evidence | Checked July 22 | Establishes where named-property facts, rough prices, and review themes belong. | Hotel evidence does not make an area-level route or suitability conclusion universal. |

## Search-Job Boundary

| Search job | Correct page | Why |
|---|---|---|
| Choose Center Strip, South Strip, suite/non-gaming, west-side, or Downtown base | Existing stay-area URL | The decision starts with trip shape and location consequences. |
| Compare named hotels, rooms, pools, rough nightly totals, and review themes | `las-vegas-family-hotels.html` | Current hotel/resort SERPs return named properties and inventory-style results. |
| Decide which activities should drive the base | All-ages and teen activity pages | Activity interest should inform location, not be repeated as hotel content. |
| Sequence the chosen base, anchors, and resets | Family itinerary page | Timing and pacing belong after the base and activities are chosen. |

## SERP And Competitor Review

| Page/type | What it answers well | Weakness or unmet job | Advantage we cannot copy | Family Tripwise opportunity |
|---|---|---|---|---|
| Going, `Where to Stay in Las Vegas: Best Neighborhoods and Hotels for 2026` | Broad current area coverage, trip-type headings, named hotels, prices, and practical context. | Very long; area, hotel, nightlife, budget, romance, and family jobs are interleaved. Some price and property claims age quickly. | Mature editorial brand and broad destination coverage. | Give families one compact base comparison and route volatile hotel facts to the maintained hotel page. |
| TripAdvisor area and hotel results | Large review corpus, current hotel inventory, maps, and named-property coverage. | Readers still have to synthesize which location changes their daily family plan. | Review scale, inventory, and brand authority. | Explain the trip consequences of the base without imitating booking inventory. |
| KAYAK family-hotel guide | Clear named properties, amenity fields, review signals, and booking pathways. | Primarily hotel selection; area implications are secondary and some firm family language exceeds what our evidence can support. | Inventory, ratings, and commercial data. | Keep named-property evidence on our hotel page and make the area page a cleaner first decision. |
| Current community stay questions | Real combinations of child ages, one-night stays, pools, parking, road-trip launches, Red Rock, and central-vs-resort tension. | Answers are anecdotal, inconsistent, and often property-specific. | Current participant experience. | Convert recurring question shapes into five base types and three checks, while labeling community evidence qualitative. |

The sampled results blend `where to stay` and hotel-list intent, but the user jobs remain separable. The hotel page should satisfy the much larger named-property query family; the area page earns its URL by being a concise precursor.

## Persona Application

These are the existing research hypotheses from `FT-RES-007`, not demographic truth.

| Persona | Stay-page need | Implemented response |
|---|---|---|
| LV-P1 First-Time Family Feasibility Planner | A recognizable first base without a giant hotel list | Center Strip starts first, followed by clear alternatives when another trip shape dominates. |
| LV-P2 Resort-and-Pool-Led Family | Make the hotel part of the vacation | South Strip is framed around a pool-led resort trip, then exact pool and complete-stay checks move to the hotel decision. |
| LV-P3 Heat, Stroller, and Younger-Child Planner | Short resets and realistic transfers | Exact hotel entrance, midday return, resort walk, stroller, and pool details remain property/date checks rather than area guarantees. |
| LV-P5 Budget and Short-Stay Planner | Understand complete cost and time, not headline room price | One complete-stay check includes room total, fees, parking, likely rideshares, and breakfast or kitchen needs. |

LV-P4 primarily uses the teen page, but the stay page links there so one teen-chosen anchor can inform the base.

## Base-Type Decisions

| Base type | Decision | Why it earns space | Boundary |
|---|---|---|---|
| Center Strip | Keep and lead for many first visits | Several classic visual, show, and meal anchors share the broad corridor. | Does not guarantee short walking; exact resort exits and indoor detours matter. |
| South Strip | Keep | Distinct pool/resort-led trip and South Strip activity shape. | Pool quality does not establish access, season, room-to-pool distance, or value. |
| Near-Strip suite base | Replace generic off-Strip row | Captures kitchen, laundry, room separation, and reduced-casino-path priorities that are property-led. | This is a base type, not a geographic promise; exact location and services vary. |
| West side / Summerlin | Keep | Distinct Red Rock and car-based itinerary. | Not presented as a classic walk-out Strip base or a universal calmer/safer choice. |
| Downtown / Fremont | Keep with clear condition | Useful only when Downtown anchors are intentional. | Noise, evening environment, minor rules, and pickup plan remain exact checks. |
| Three named hotel profiles | Remove from area page | The live ten-hotel page now answers the named-property job with stronger evidence. | Internal hotel-page routing replaces duplication. |

## Every-Section Audit

| Current section | Finding | Decision | Implemented replacement |
|---|---|---|---|
| Hero and trust panel | Defensive, check-heavy promise and stale July 15 date. | Replace | Five-base promise, July 22 source date, and one concise evidence boundary. |
| Hero image | Original 4.49 MB redirect and incomplete attribution. | Replace | Wikimedia 1280-pixel derivative, dimensions, creator, CC BY-SA link, and modification disclosure. |
| Generated family-base intro | Repeats sibling links and booking checks before the decision surface. | Remove | Cluster routes appear once after the base comparison. |
| Generated four-row area table | Duplicates the later matrix with weaker labels. | Remove | One five-row, six-column comparison. |
| Generated three-card booking block | Repeats the later six verification cards. | Remove | Three decisive checks only. |
| Eight quick picks | Too many, heavily qualified, and repetitive. | Replace | Five trip-shape starting points aligned with the five base rows. |
| Eleven-column area matrix | High scan cost and repeated `UNKNOWN`/verification language. | Compress | Six columns: start condition, simplification, transport, tradeoff, and next step. |
| Three long hotel profiles | Duplicates the ten-hotel page with weaker and older evidence. | Remove | One direct hotel comparison route. |
| Six booking checks | Repeats fee, route, pool, room, and policy caveats. | Compress | Map first two days, compare complete stay, confirm reset routine. |
| No visible FAQ | FAQ schema was invisible to readers. | Align | Three visible FAQ cards exactly aligned with schema. |
| Generic source list | Mixed hotel and younger-child sources without a clear base decision role. | Replace | Transport, area-anchor, city, image, and license sources. |

## Claim And Trust Register

| Public treatment | Evidence boundary |
|---|---|
| Center Strip is a useful first check when central Strip anchors dominate. | Editorial routing from the stated itinerary, not a universal best-area claim. |
| South Strip can suit a pool-led resort trip. | Exact pool access, season, room route, and price remain property/date checks. |
| A suite/non-gaming priority can outweigh area. | Exact kitchen, laundry, casino path, and transport remain hotel-specific. |
| West-side/Summerlin is a car-based Red Rock choice. | No exact drive-time or route claim is published. |
| Downtown works when Downtown anchors are intentional. | No safety, quiet, universal family-fit, or independent-wandering claim is published. |
| Exact walking, stroller, smoke/noise, room, pool, and price details vary. | These are explicit property/date/route boundaries, not defensive evidence-status labels repeated in every row. |

## Implemented Page Shape

1. One hero and concise source/date boundary.
2. Five trip-shape starting points.
3. One five-row base comparison.
4. Three checks that settle the base decision.
5. Four cluster routes, led by the ten-hotel comparison.
6. Three visible FAQ cards aligned with schema.
7. One current source list.

## Acceptance And Measurement

- Existing canonical URL stays indexable and appears once in the sitemap.
- Exactly five quick starts and five base rows render.
- Exactly three decision checks, four cluster routes, and three visible FAQs render.
- The generated duplicate intro/table/cards, three hotel profiles, six old verification checks, and defensive `UNKNOWN` matrix are absent.
- Named-property prices, room facts, and online-review themes remain on the hotel page.
- Visible FAQ and `FAQPage` schema contain the same three questions.
- ItemList schema contains the same five base types and a base-specific name.
- The all-ages, teen, hotel, and itinerary pages are linked without changing them.
- Full generation is deterministic; focused/native/responsive/privacy/source/scope QA and independent review pass.
- Baseline GSC remains 13 impressions, 0 clicks, average position 44.69 through July 20. Observe future crawl, impressions, query mix through protected analysis when available, and top-20 discovery without treating the baseline as causal.

## Sources

Search and competitor context:

- https://www.going.com/guides/where-to-stay-in-las-vegas
- https://www.tripadvisor.com/Articles-lnhADOReOZR4-Best_area_to_stay_las_vegas.html
- https://www.kayak.com/news/best-family-friendly-hotels-in-las-vegas/
- https://www.reddit.com/r/vegas/comments/148fw89
- https://www.reddit.com/r/Travelwithkids/comments/1t0d1ia/where_to_stay_in_vegas_not_actually_doing_vegas/
- https://www.reddit.com/r/familytravel/comments/1tlzarb/vegas_for_one_night_with_kids/
- https://www.reddit.com/r/vegas/comments/1tvrmwr/family_vacation/

Official and first-party checks:

- https://www.lvmonorail.com/route-map/
- https://www.rtcsnv.com/ways-to-travel/transit/
- https://mandalaybay.mgmresorts.com/en/amenities/beach.html
- https://bellagio.mgmresorts.com/en/entertainment/fountains-of-bellagio.html
- https://www.caesars.com/linq/things-to-do/attractions/high-roller
- https://www.blm.gov/programs/national-conservation-lands/nevada/red-rock-canyon
- https://vegasexperience.com/
- https://www.lasvegasnevada.gov/News/Blog/Detail/curfew-guide-for-families-what-teens-parents-need-to-know-this-summer
- https://commons.wikimedia.org/wiki/File:Bellagio_fountain_show_2010_las_vegas.JPG
- https://creativecommons.org/licenses/by-sa/4.0/

Repository evidence:

- `docs/research/next-city-prioritization-las-vegas-cluster.md`
- `docs/research/las-vegas-family-hotel-evidence-pack.md`
- `status/las-vegas-pages.md`
- `ops/gsc-snapshots/2026-07-22.md`
