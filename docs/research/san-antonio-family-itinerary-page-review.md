# San Antonio Family-Itinerary Page Review

Status: implementation evidence record for `FT-IMP-021`

Prepared: 2026-07-27

Target: https://familytripwise.com/family-itinerary/san-antonio-with-kids.html

## Decision

Keep one canonical San Antonio family-itinerary URL and rebuild it as a compact sequencing product.

The page should not repeat the activity guide. It should help a family:

1. choose a one-, two-, or three-day shape;
2. give each half day one main job;
3. protect a meal, hotel, shade, or low-pressure reset;
4. change the plan for age, heat, weather, budget, or lodging base; and
5. know what to delete when the day slips.

No new duration, toddler, teen, rainy-day, or budget itinerary URL is justified in this pass.

## Evidence Classification

| Evidence | Collected | Classification | Use and limit |
|---|---|---|---|
| GSC snapshot | 2026-07-26, finalized through 2026-07-24 | Fresh authenticated read-only API evidence | The page has 6 impressions, 0 clicks, and page-level average position 27.17. This is sparse discovery context, not a query-specific rank or causal result. |
| Logged-in Semrush US records from `FT-RES-010` | 2026-07-26 | Current third-party estimate | `san antonio itinerary` displayed 260 searches/month and `san antonio 3 day itinerary` displayed 40; exact family itinerary seeds displayed 0. Variants overlap and are not unique traffic. |
| Public search results and ranking pages | 2026-07-27 | Current representative SERP evidence | Supports the itinerary role, age/duration result types, and structural opportunities. It is not a complete top-10 export or numeric overlap matrix. |
| Official attraction, park, transit, weather, and licensing pages | 2026-07-27 | Current primary evidence | Supports only bounded current checks. Exact hours, tickets, service, route, weather, access, and operating details remain verify-current. |
| Parent/community discussions | 2024-2026 | Qualitative anecdotal evidence | Surfaces heat, transport, age-fit, nap, restaurant, and overpacking concerns. It is not demand, verified experience, or a universal family verdict. |
| Existing Family Tripwise page and cluster research | 2026-07-26 to 2026-07-27 | Current first-party planning evidence | Supports role separation, personas, internal links, and the every-section audit. |

## Query And Result-Type Review

Observed 2026-07-27. URLs are representative results seen for each query, not a complete ordered top 10.

| Query | Intent / result type | Representative observed URLs and domains | Overlap rationale | Confidence |
|---|---|---|---|---|
| `san antonio itinerary with kids` | Family sequencing, usually three days | `visitsanantonio.com/plan-your-trip/itineraries/older-kids/`; `visitsanantonio.com/plan-your-trip/itineraries/young-kids/`; `visitsanantonio.com/blog/post/48-hours-in-san-antonio-family/`; `kidpaths.com/blog/san-antonio-itinerary-3day` | Age-led official itineraries, a two-day destination article, and a newer family publisher all answer the same sequencing job. | High |
| `san antonio family itinerary 3 days` | Fixed three-day family plan | `visitsanantonio.com/plan-your-trip/itineraries/older-kids/`; `visitsanantonio.com/plan-your-trip/itineraries/young-kids/`; `visitsanantonio.com/plan-your-trip/itineraries/teens/`; `visitsanantonio.com/plan-your-trip/itineraries/spring-break-itinerary/`; `kidpaths.com/blog/san-antonio-itinerary-3day` | Repeated destination-domain templates and KidPaths show that three days is a durable format, but age and trip style alter the actual anchors. | High |
| `san antonio 2 day itinerary with kids` | Compressed weekend | `visitsanantonio.com/blog/post/48-hours-in-san-antonio-family/`; `visitsanantonio.com/plan-your-trip/itineraries/older-kids/`; `kidpaths.com/blog/san-antonio-itinerary-3day` | The dedicated 48-hour result confirms a shorter job; broader three-day pages remain relevant but often need deletion guidance. | Medium |
| `san antonio itinerary toddler family` | Younger-child pacing and swaps | `visitsanantonio.com/plan-your-trip/itineraries/young-kids/`; `reddit.com/r/sanantonio/comments/1m1l2k4`; `reddit.com/r/sanantonio/comments/1s7s9jj/beating_the_heat_with_toddlers/`; `reddit.com/r/sanantonio/comments/1czaaad` | The modifier changes pacing and anchors more than the destination role. Community results surface heat, transport, and age-fit questions but do not justify a separate canonical page or prove demand. | Medium |

SERP features observed across the sampled queries include image-heavy destination results, itinerary/day headings, FAQ-style answers, and community discussions. Numeric URL overlap is `UNKNOWN` because no durable complete-result export was captured.

## Representative Ranking-Page Analysis

| Page type | What it answers well | What is weak or missing | Honest opportunity |
|---|---|---|---|
| Visit San Antonio kids 6-12 three-day itinerary | Current destination context, concrete day headings, major sights, food ideas, strong media. | Packs many stops into each day; limited stop rules, hotel-return logic, or mixed-age pivots. | Keep the concrete sequence while making optionality and deletion explicit. |
| Visit San Antonio young-kids itinerary | Clear age framing and useful DoSeum, zoo, garden, and play ideas. | Calls the plan relaxed while still stacking several substantial stops; exact nap and heat exits remain abstract. | Protect one reset and show what gets removed first. |
| Visit San Antonio teen itinerary | Gives older children adventure, food, art, and culture payoffs. | One fixed three-day order cannot solve younger-sibling fit, exact ticket rules, or a family based far from the selected anchor. | Route teen selection to the released specialist, then sequence only one teen-led anchor. |
| Visit San Antonio 48-hour article | Direct weekend framing and familiar attraction shortlist. | Promotional pass/product emphasis and two-to-three-major-stop language can encourage overpacking. | Offer one coherent Downtown day plus one age-led day with a real optional block. |
| KidPaths three-day itinerary | Geographic grouping, meal timing, rough costs, age notes, and recent publication date. | High attraction density, affiliate/pass path, and some firm duration/cost language can age quickly. | Use cleaner decision surfaces, source-dated current checks, and no affiliate pressure. |
| Parent/community discussions | Real questions about toddlers, heat, transport, age fit, restaurants, and whether attractions justify the effort. | Anecdotal, inconsistent, and not a verified route or demand source. | Use concerns to shape pivots and stop rules, never as factual family-fit proof. |

Visit San Antonio has local/destination authority and KidPaths presents publisher research and cost detail. Family Tripwise cannot claim those as firsthand experience. The achievable advantage is a less cluttered decision flow, stronger role separation, explicit uncertainty, and better failure handling.

## Persona Review

These are research hypotheses derived in `FT-RES-010`, not demographic truth.

| Persona | Job to be done | Itinerary need | Failure mode to prevent |
|---|---|---|---|
| `SA-P1` first-time icon family | See the Alamo and River Walk without missing the city's basic story. | One bounded Downtown day, one optional finish, and no cross-city icon chase. | Alamo, cruise, museum, Tower, Pearl, and another paid stop all become mandatory. |
| `SA-P2` heat-and-reset younger-child family | Keep hands-on play and a real nap or hotel reset viable. | A DoSeum/zoo/Witte choice, protected midday reset, short optional evening, and current weather checks. | A nominally family-friendly plan becomes a long exposed day with no easy exit. |
| `SA-P3` theme-park/resort family | Make SeaWorld, Six Flags, Morgan's, or another major anchor worth the trip. | Treat one park or resort day as the day and keep the previous/next block light. | A full-day park is squeezed between Downtown and a late dinner checklist. |
| `SA-P4` teen/mixed-age family | Give the older child one meaningful choice while preserving sibling fit. | Route to the teen specialist, choose one high-payoff anchor, and define a split or deletion when needed. | The teen gets younger-child filler or the younger child is dragged through an unsuitable product. |
| `SA-P5` budget/local-style family | Use free history, parks, districts, or one paid anchor without accidental spend. | Keep one paid choice optional, group free/low-pressure blocks, and count transport, parking, food, and add-ons. | “Free” sightseeing quietly becomes an expensive day of parking, meals, and impulse tickets. |

## Every-Section Audit Of The Existing Page

| Existing section | Useful content | Problem | Action |
|---|---|---|---|
| Hero and trust panel | Correct canonical role and family focus. | Generic starter language, stale update label, and broad methodology copy do not explain the sequencing product. | Replace with a literal 1/2/3-day promise and concise current-source boundary. |
| Hero image | Real destination image with a valid license link. | Missing stable dimensions; attribution can be clearer. | Keep the image, add dimensions/high-priority loading, and align attribution with the license. |
| `Nap-friendly structure` | Names a three-day outline and age adjustment. | Abstract, uses “nap-friendly” too broadly, and does not show decisions or deletions. | Remove. Rebuild as executable trip-length starts and day-plan cards. |
| `Condensed weekend plan` | Recognizes two-day visitors need fewer stops. | Repeats the first two days and leaves the second day too broad. | Remove. Give the two-day route its own day jobs and stop rule. |
| Four generic cards after the weekend plan | Age, base, and weather are relevant. | Duplicate later quick picks, comparison rows, pacing cards, and cluster links. | Remove and absorb into one pivot table plus final cluster handoff. |
| Eight quick picks | Exposes 1/2/3-day, toddler, teen, weather, base, and skip intents. | Too many equal-weight cards increase friction and repeat the comparison below. | Reduce to three trip-length starts. Move constraints into the pivot table. |
| Six-row variant comparison | Contains useful heat, meal, drive, and skip considerations. | Repeats the quick picks and mixes trip lengths with personas and weather in one level. | Replace with five constraint pivots after the route shapes. |
| Six pacing cards | Arrival, Downtown, age, weather, toddler, and teen ideas are directionally useful. | Generic prose repeats prior sections and does not make a concrete choice. | Replace with four concise stop rules. |
| Three cluster cards | Correctly routes activities, teens, and stay areas. | Omits the released hotel comparison and repeats earlier “choose base” messaging. | Use one four-card final handoff including hotels. |
| FAQ/schema | Three relevant questions. | Answers are broad and include an unsupported universal “works best” duration. | Keep three questions, align visible/schema text, and use conditional answers. |
| Sources | None visible beyond image licensing. | Material current claims have no durable page-level source register. | Add current official attraction, route, weather, and licensing sources. |

## Page Product

### Three trip-length starts

1. **One day:** one bounded Downtown signature block, one protected reset, one easy finish.
2. **Two days:** Downtown context plus one age-led anchor day.
3. **Three days:** Downtown, age-led anchor, and one flexible contrast day.

### Three executable route shapes

- A one-day first look with an Alamo/GO RIO choice, same-zone reset, and optional Hemisfair or hotel finish.
- A two-day first trip with one Downtown day and one selected younger-child, animal/museum, adventure, or theme-park day.
- A three-day balanced trip that adds a mission/Pearl/local-style contrast, a resort reset, or another age-led choice without turning every option into a requirement.

### Five constraint pivots

- younger child, nap, sensory, stroller, or short-session need;
- teen or mixed ages;
- heat, storm, poor air, or outdoor-operation change;
- budget/local-style trip; and
- arrival, departure, transport, or lodging-base constraint.

### Four stop rules

- one main job per half day;
- protect the midday reset or heat exit;
- choose only one distant full-day anchor; and
- decide the deletion and return rule before leaving.

## Claim Boundaries

- Time, pace, cost class, geographic grouping, reset value, and family-use labels are editorial planning estimates.
- The page must not promise an exact walk, drive, VIA trip, stroller route, step-free path, accessibility condition, safety condition, queue, weather outcome, ticket, price, operating hour, or child reaction.
- Free admission does not imply a no-cost day; transport, parking, meals, optional exhibits, and purchases may still cost money.
- “One zone” means a planning grouping, not a guaranteed walkable or effortless route.
- Community comments shape questions only and do not support firm venue or route claims.
- No wording may imply a Family Tripwise stay, visit, booking, or personally verified experience.

## Official Sources Checked

Checked 2026-07-27:

- https://www.thealamo.org/visit/calendar/alamo-free-timed-entry
- https://www.thealamo.org/visit/tours-and-experiences/alamo-collections-center
- https://www.goriocruises.com/overview/
- https://www.goriocruises.com/visitor-information/
- https://hemisfair.org/visit/
- https://www.thedoseum.org/plan-your-visit
- https://sazoo.org/visit/
- https://www.wittemuseum.org/plan-your-visit/
- https://www.nps.gov/saan/planyourvisit/basicinfo.htm
- https://naturalbridgecaverns.com/
- https://www.sixflags.com/fiestatexas/plan-your-visit/park-hours
- https://seaworld.com/san-antonio/park-info/
- https://www.viainfo.net/trip-planning/
- https://www.viainfo.net/service-alerts/
- https://forecast.weather.gov/MapClick.php?lat=29.4241&lon=-98.4936
- https://commons.wikimedia.org/wiki/File:The_San_Antonio_River_Walk.jpg
- https://creativecommons.org/licenses/by-sa/2.0/

## Acceptance Criteria

- Preserve one canonical/indexable URL and one sitemap entry.
- Render exactly three trip-length starts, three executable day plans, five constraint pivots, four stop rules, four cluster routes, and three visible/schema-aligned FAQs.
- Link the released all-ages, teen, stay-area, and family-hotel roles.
- Remove the old starter/weekend/quick-pick/comparison/pacing repetition.
- Add a current 17-source register and dimensioned licensed image.
- Keep all route, time, transport, access, weather, ticket, price, and family-fit claims bounded.
- Pass target-only/full generation idempotency, focused/full tests, local and production SEO QA, responsive/table containment, source, privacy, exact-scope, JSON, and whitespace checks.
- Receive independent read-only `PASS` or `PASS_WITH_P3` with no P0-P2 before release.

## Measurement

Use future finalized GSC page-level and protected query evidence only after Google has had time to crawl the released artifact. Watch:

- discovery for itinerary, one-day, two-day, three-day, family, toddler, teen, heat/rain, and trip-length query families;
- impressions, clicks, CTR, and page-level average position without treating the early six-impression baseline as stable;
- indexability, canonical selection, sitemap presence, and internal-link health; and
- whether query overlap suggests one itinerary role remains appropriate.

No ranking, traffic, indexing, or revenue change should be attributed causally to this page from a tiny sample or short window.
