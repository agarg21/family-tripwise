# Las Vegas Family-Itinerary Competitor And Section Review

Status: implementation evidence record

Action: `FT-IMP-009` / `SRR-014`

Prepared: 2026-07-23

Target: `https://familytripwise.com/family-itinerary/las-vegas-with-kids.html`

## Decision

Keep the existing URL and make it the cluster's sequencing page. The activity pages choose the anchor, the lodging pages choose the base and property, and this page should turn those decisions into realistic one-, two-, and three-day shapes.

The prior page contained useful advice but repeated its trip-length, age, reset, and rainy-day ideas in a generated starter section, eight quick picks, a six-row matrix, and six pacing cards. Its comparison rows were route summaries rather than day-by-day plans. The revised page should expose one selection layer, one execution layer, one pivot layer, one stop-rule layer, and one set of cluster handoffs.

## Evidence And Freshness

| Evidence | Classification | Freshness | Use | Limit |
|---|---|---:|---|---|
| GSC public-safe snapshot | Reused authenticated read-only API | Collected July 22; finalized through July 20 | Page has 5 impressions, 0 clicks, and page-level average position 22.6. | Too sparse for a query-rank, CTR, or causal performance conclusion; protected queries are not exposed. |
| Semrush itinerary sample | Authenticated US estimate reused from `FT-RES-007` | Collected July 22 | Two sampled exact itinerary phrases total about 20 monthly searches. | Directional only; variants overlap and the page is a cluster-support surface, not a large standalone demand bet. |
| Public SERPs | Current public search | Collected July 23 | Shows itinerary results from the destination publisher, firsthand family blogs, booking platforms, generated itinerary sites, and community trip reports. | Results vary by time and location and are not a rank tracker. |
| Ranking pages | Current editorial, firsthand, commercial, and generated pages | Checked July 23 | Reveals strengths in lived detail, attraction breadth, day sequencing, and bookable inventory. | Family Tripwise cannot copy firsthand experience, destination authority, inventory, or a large review corpus. |
| Official attraction pages | First-party, destination, or government | Checked July 23 | Supports the current existence and operating-check paths for Bellagio, DISCOVERY, Shark Reef, High Roller, AREA15, Red Rock, and Neon Museum. | Does not prove a family-specific route, exact duration, stroller practicality, sensory fit, or suitability. |
| Community trip reports | Qualitative UGC | Current and representative older examples inspected July 23 | Surfaces recurring friction around heat, resort walking, transport, pool days, younger-child pacing, water, and overstuffed plans. | Anecdotes are not demand, verified universal facts, safety evidence, or reusable firsthand experience. |

## Search Job And SERP Boundary

| Search job | Correct page |
|---|---|
| Choose a current activity by age, weather, budget, and friction | All-ages or teen activity page |
| Choose a base or named property | Stay-area or family-hotel page |
| Turn chosen anchors and lodging into one, two, or three days | Existing family-itinerary URL |
| Get exact live inventory, tickets, route timing, or a personally tested schedule | Official/booking source or future human-verified product; not claimed here |

SERPs materially overlap broad `Las Vegas with kids` pages and exact three-day itineraries. That does not justify another URL. The existing page can serve the complete trip-length family while keeping age, pool, heat, nature, and budget as pivots rather than separate pages.

## Representative Ranking-Page Review

| Page/type | What it answers well | Weakness or unmet job | Advantage we cannot copy | Family Tripwise opportunity |
|---|---|---|---|---|
| Visit Las Vegas family guide | Current destination breadth, official attraction links, free and paid ideas | Primarily an attraction roundup despite itinerary framing; promotional tone and weak stop rules | Destination authority and partner ecosystem | Convert a smaller set of choices into explicit day shapes and deletion rules. |
| Family Can Travel, `3 Days in Las Vegas with Kids` | Firsthand family narrative, real pros/cons, exact lived sequence, photos | Long and tied to one family's ages, dates, event, hotel, and preferences | Firsthand trip experience | Offer reusable route logic without presenting desk research as a stay. |
| Viator, `3 Days in Las Vegas for Families` | Clear day headings, broad attractions, bookable options | Commercial inventory interrupts planning; some route advice is broad | Inventory, ratings, and affiliate transaction layer | Keep the schedule independent from ticket sales and expose what to remove. |
| TheNextGuide family itineraries | Clean day sequencing, seasonal framing, meals and downtime | Some stroller, sensory, duration, and family-fit statements are firmer than the visible evidence supports | Large programmatic itinerary inventory | Keep structure while making route and fit claims explicitly property/date/venue dependent. |
| Reddit family trip reports | Current combinations of ages, pools, buses, museums, arcades, car seats, heat, and stopovers | Anecdotal, contradictory, and difficult to generalize | Participant experience and discussion | Turn recurring friction into pivots and checks without treating it as verified guidance. |

## Persona Application

These are the research hypotheses from `FT-RES-007`, not demographic truth.

| Persona | Itinerary job | Implemented response |
|---|---|---|
| LV-P1 First-Time Family Feasibility Planner | Understand what fits in one, two, or three days | Three trip-length starts and three day-by-day route cards lead the page. |
| LV-P2 Resort-and-Pool-Led Family | Treat the hotel as part of the vacation | Pool time is a full block with access, condition, and property checks, not an add-on between tickets. |
| LV-P3 Heat, Stroller, and Younger-Child Planner | Protect a nap/reset and avoid fragile transfers | Younger-child/heat pivot keeps one indoor anchor and explicitly leaves route, stroller, pool, and return details to current checks. |
| LV-P4 Teen/Tween Interest Planner | Give older children a meaningful choice | Teen pivot and cluster route move the family to the independently researched teen shortlist. |
| LV-P5 Budget and Short-Stay Planner | Get one recognizable Vegas moment without ticket stacking | Short/budget pivot keeps one free visual, one chosen spend, and a firm stop rule. |

## Every-Section Audit

| Prior section | Finding | Decision | Implemented replacement |
|---|---|---|---|
| Hero and trust panel | Generic promise, July 5 date, long methodology wording | Replace | Literal trip-length headline, July 23 source date, concise route boundary |
| Hero image | Loaded original redirect without dimensions or complete attribution | Replace | 1280-pixel derivative, dimensions, creator, license link, and modification disclosure |
| Generated three-day starter | Duplicated later quick/table/plan content | Remove | Three detailed route cards |
| Generated two-day starter | Duplicated route summary without meaningful variants | Remove | Two-day card with a contrast-day choice and deletion rule |
| Generated three-link block | Duplicated later cluster links and omitted hotel comparison | Remove | Four current cluster handoffs |
| Eight quick picks | Repeated trip length, age, weather, stay, and skip decisions | Compress | Three trip-length starts |
| Six-row itinerary matrix | Useful scan, but abstract and not executable | Replace | Three route cards with blocks and stop rules |
| Six pacing cards | Repeated route and persona content | Compress | Four general stop rules |
| No visible FAQ | FAQ schema was invisible to readers | Align | Three visible FAQs matching schema |
| Hotel-heavy source list | Vdara and Hilton sources did not support the itinerary job | Replace | Current attraction, route-anchor, image, and license sources |

## Claim And Trust Register

| Public treatment | Evidence boundary |
|---|---|
| Two days is a clear first-trip structure | Editorial planning recommendation, not a demand or universal-fit claim |
| Bellagio is a useful central visual option | Official current attraction pages; schedule and seasonal display must be rechecked |
| DISCOVERY, Red Rock, AREA15, Shark Reef, and High Roller can serve different anchors | Current official source paths establish the attractions; exact age, sensory, route, duration, ticket, and family fit remain checks |
| Pool time can be a full block | Product logic only; exact access, season, shade, route, rules, and value remain property/date specific |
| One main job per half day and a stop rule improve planning | Editorial product guidance, not a personally tested itinerary claim |

No public text claims personal experience, safety, exact drive or walking time, exact stroller practicality, quiet, smoke exposure, sensory suitability, pool access, stable pricing, or guaranteed minor access.

## Implemented Page Shape

1. One concise hero and source/date boundary.
2. Three trip-length starts.
3. Three day-by-day route cards with explicit stop rules.
4. Five pivots for younger children/heat, teens, pool trips, nature/road trips, and budget/short visits.
5. Four general stop rules.
6. Four cluster handoffs.
7. Three visible FAQs aligned with schema.
8. One current official-source list.

## Acceptance And Measurement

- Existing canonical URL stays indexable and appears once in the sitemap.
- Exactly three quick starts and three visible day-plan cards render.
- Exactly five pivot rows, four stop-rule cards, four cluster routes, and three visible FAQs render.
- The generated starter itinerary, condensed weekend section, old eight-pick layer, six-row abstract matrix, and unrelated hotel-source residue are absent.
- `ItemList` schema contains the same three trip lengths and a route-specific name.
- Visible FAQ and `FAQPage` schema contain the same three questions.
- Full generation is deterministic and changes no unrelated site file.
- Focused/native/responsive/privacy/source/scope QA and independent review pass.
- Baseline remains 5 impressions, 0 clicks, and average position 22.6 through July 20. Future evidence may show discovery or query-mix changes, but the sample cannot support a causal claim.

## Sources

Ranking and qualitative context:

- https://www.visitlasvegas.com/experience/post/fun-and-exciting-things-to-do-in-las-vegas-for-kids/
- https://www.familycantravel.com/las-vegas-with-kids/
- https://www.viator.com/blog/Las-Vegas/d684/3-Days-in-Las-Vegas-for-Families/i95935
- https://www.thenextguide.com/itineraries/las-vegas/family-friendly-3-day-las-vegas-spring-practical-and-caring-plan
- https://www.reddit.com/r/vegas/comments/11euar6
- https://www.reddit.com/r/LasVegas/comments/1sdb481/las_vegas_with_kids_trip_report/
- https://www.reddit.com/r/vegas/comments/16v0y1e/my_experience_visiting_with_a_toddler/
- https://www.reddit.com/r/vegas/comments/1dwdnx9

Official and first-party checks:

- https://www.visitlasvegas.com/experience/post/things-to-do-in-las-vegas-with-kids/
- https://bellagio.mgmresorts.com/en/entertainment/fountains-of-bellagio.html
- https://bellagio.mgmresorts.com/en/entertainment/conservatory-botanical-garden.html
- https://discoverykidslv.org/about/faq/
- https://mandalaybay.mgmresorts.com/en/entertainment/shark-reef-aquarium.html
- https://www.caesars.com/linq/things-to-do/attractions/high-roller
- https://www.area15.com/visit-us
- https://www.blm.gov/programs/national-conservation-lands/nevada/red-rock-canyon
- https://neonmuseum.org/faqs/
- https://commons.wikimedia.org/wiki/File:Bellagio_fountain_show_2010_las_vegas.JPG
- https://creativecommons.org/licenses/by-sa/4.0/

Repository evidence:

- `docs/research/next-city-prioritization-las-vegas-cluster.md`
- `docs/research/las-vegas-activity-expansion-review.md`
- `docs/research/las-vegas-teen-page-review.md`
- `docs/research/las-vegas-stay-area-page-review.md`
- `status/las-vegas-pages.md`
- `ops/gsc-snapshots/2026-07-22.md`
