# San Diego Cluster Research Decision Pack

Status: internal research decision pack

Action: `FT-RES-006`

Prepared: 2026-07-20

Scope: San Diego family travel cluster only

Publication state: research-only; no `site/**` edit, no indexing request, no external-account mutation

## Decision

Family Tripwise should treat San Diego as one connected family-planning product cluster, not a set of isolated keyword pages. The cluster should be organized from observed SERP overlap, ranking-page patterns, parent questions, and current page usefulness.

The next bounded implementation should improve the existing all-ages San Diego activities page:

- promoted action: `FT-IMP-002`
- working title: "Upgrade the San Diego things-to-do page into a persona-led cluster router"
- target URL: `https://familytripwise.com/things-to-do/san-diego-with-kids.html`
- target path: `site/things-to-do/san-diego-with-kids.html` plus its generator/test paths
- action type: existing-page improvement, not a new destination or page batch

Rationale: the all-ages activities page is the natural hub for the largest San Diego query family, but Google still reports it as unknown/not indexed in the latest public-safe GSC snapshot. The current page has useful activity rows and age/rain/nap filters, yet the SERP evidence shows parents need a cleaner first decision: "which San Diego plan matches my family constraints?" That hub can route to the already-published stay, hotel, toddler, teen, and itinerary pages without editing the protected San Diego stay page.

## Evidence Classification

| Evidence | Source | Freshness | Use in this pack | Limitations |
|---|---|---:|---|---|
| Local repository state | `main` at `98df3ae` on 2026-07-20 | current at run start | Confirms clean/aligned baseline and current page inventory. | Does not prove production crawl/index state by itself. |
| Latest GSC public-safe snapshot | `ops/gsc-snapshots/2026-07-19.json` and `.md` | collected 2026-07-19; data through 2026-07-17 | Fresh authenticated read-only API evidence within one day; supports page-level impressions, zero clicks, and URL Inspection summary. | Public-safe snapshot omits raw queries, countries, devices, credentials, and complete query exports. |
| Prior GSC public-safe snapshot | `ops/gsc-snapshots/2026-07-18.json` and `.md` | collected 2026-07-18; data through 2026-07-16 | Directional trend check against latest page rows and inspection status. | Not raw query evidence. |
| Central Control Room report | `/Users/apoorvagarg/Documents/SEO Agent/seo-lab/operator/reports/family-tripwise/latest.md` | dated 2026-07-20 | Confirms central scheduler state, active guardrails, latest snapshot status, and protected target. | Reuses prior collected evidence; central runner remains scheduler, this action is manual. |
| Public SERP snapshots | Web search result snapshots collected 2026-07-20 | current directional | Supports observed ranking URL/domain overlap and page-type patterns. | Search tool results are not an authenticated rank tracker; rankings can vary by location, personalization, and time. |
| Ranking-page inspection | Representative pages opened 2026-07-20 | current directional | Supports competitor strengths, weaknesses, and structural opportunities. | We inspected representative pages, not the entire live SERP corpus. |
| Parent/community discussions | Reddit, TripAdvisor/Facebook snippets and forum pages seen 2026-07-20 | qualitative only | Supports parent anxieties, modifiers, and question shapes. | Anecdotes are not demand metrics, official facts, or verified family experience. |
| r/Agentic_SEO process ideas | Reddit pages opened 2026-07-20 | qualitative only | Supports process principle: clusters need SERP/page evidence and human judgment, not automated volume lists alone. | Not travel-market evidence and not a ranking methodology authority. |
| Existing San Diego research | `docs/research/**`, `docs/plan/**`, prototypes | checked 2026-07-20 | Provides hotel evidence engine, stay decision evidence, itinerary pacing prototype, reset-atlas constraints, and prior review gates. | Some artifacts are internal or prototype-only; they do not authorize firm public claims. |
| Semrush / paid keyword tools | not used for fresh claims in this action | unavailable/not required | No current Semrush volume, KD, ranking, or traffic claim is introduced. Historical Semrush-derived notes are treated as stale background only. | Paid keyword data remains optional enrichment, not a blocker. |

## Current GSC and Production Context

Latest public-safe GSC snapshot, collected 2026-07-19 with finalized performance data through 2026-07-17:

| Metric | Latest value | Interpretation |
|---|---:|---|
| 28-day impressions | 601 | Early discovery signal, still no click validation. |
| Clicks | 0 | No page has proven click-through yet. |
| Average position | 60.4 | Broadly weak rankings; page improvements should prioritize intent clarity and indexability health. |
| Sitemap discovered pages | 22 | Latest snapshot predates or has not reconciled the new 23rd hotel URL in sitemap discovery. |
| Priority indexed URLs | 12 of 15 | Improved from 11 of 15 in the prior snapshot. |
| San Diego stay page | 184 impressions, avg position 59.58, indexed | Strongest current Family Tripwise page signal. Protected through 2026-07-27 for the stay-checklist observation window. |
| San Diego activities page | no page-row impressions; URL Inspection says unknown to Google | High-value hub exists but has not been crawled/indexed according to latest inspection. |
| San Diego itinerary page | 12 impressions, avg position 72.75, indexed | Indexed but weak. |
| San Diego toddler page | indexed in latest inspection | Indexing improved since prior not-indexed state. No page-row impression signal yet. |
| San Diego teen page | unknown/not indexed | Needs internal support and clearer role. |
| San Diego hotel page | published after the snapshot's discovered-page count | Do not claim GSC performance yet. Observe for discovery and indexing. |

## Query Universe

The query universe below is intentionally organized by observed parent problem and likely SERP family. It is not a keyword-volume list.

| Theme | Representative queries | Observed SERP/page-type pattern | Current Family Tripwise page |
|---|---|---|---|
| Stay areas | `where to stay in San Diego with kids`, `best area to stay in San Diego with kids`, `where should families stay in San Diego` | Area guides, hotel guides, Reddit/forum advice, vacation rental/local-guide content. | `where-to-stay/san-diego-with-kids.html` |
| Family hotels | `best family hotels in San Diego`, `family friendly hotels in San Diego`, `best hotels for kids in San Diego`, `kid friendly hotels San Diego` | La Jolla Mom, Reddit, OTAs, TripAdvisor, The Family Voyage, Hotel Guru, hotel-brand pages. | `where-to-stay/san-diego-family-hotels.html` |
| All-ages activities | `things to do in San Diego with kids`, `best things to do in San Diego with kids`, `San Diego with kids activities`, `San Diego family vacation things to do` | Large local-mom guides, family blogs, official tourism pages, TripAdvisor, Reddit. | `things-to-do/san-diego-with-kids.html` |
| Toddlers/babies | `San Diego with toddlers`, `things to do in San Diego with toddlers`, `San Diego with babies`, `2 year old San Diego activities` | La Jolla Mom toddler page, Reddit toddler threads, Baby Can Travel, family blogs, official LEGOLAND toddler page. | `things-to-do/san-diego-with-toddlers.html` |
| Teens/tweens | `San Diego with teens`, `things to do in San Diego with teens`, `San Diego tween activities`, `teenager San Diego itinerary` | La Jolla Mom teen page, Reddit local teen advice, Fora, Go City, field-trip/list pages. | `things-to-do/san-diego-with-teens.html` |
| Itineraries | `San Diego itinerary with kids`, `3 day San Diego itinerary with kids`, `5 day San Diego family itinerary`, `San Diego weekend itinerary with kids` | Family blogs with lived trips, La Jolla Mom multi-day plans, Reddit itinerary critiques, Viator/Go City product-led plans. | `family-itinerary/san-diego-with-kids.html`; unpublished pacing prototype. |
| Rainy day / indoor | `rainy day activities San Diego kids`, `indoor things to do in San Diego with kids`, `San Diego rainy day toddler`, `rainy day San Diego families` | San Diego Family, Museum Council, La Jolla Mom, Hidden San Diego, Reddit parent threads. | partially covered in activities, toddler, teen, itinerary pages. |
| Free/budget | `free things to do in San Diego with kids`, `San Diego kids free October`, `cheap things to do San Diego families`, `free indoor activities San Diego kids` | SanDiego.org, San Diego Museum Council, La Jolla Mom, KidsOutAndAbout, local blogs. | partially covered in activities pages; no dedicated budget module. |
| Local/weekend | `San Diego kids events this weekend`, `family events San Diego this weekend`, `San Diego weekend with kids`, `San Diego staycation kids` | Axios/current events, KidsOutAndAbout, local magazines/blogs, social/forums. | no live current-events page; reset-atlas and weekend concepts remain gated. |
| Transport/stroller/nap friction | `San Diego with stroller`, `San Diego without car with kids`, `Mission Bay stroller kids`, `San Diego nap friendly itinerary` | Mostly embedded in blogs/forums rather than clean dedicated SERPs; official transit/access pages answer only infrastructure facts. | stay-decision prototype, itinerary-pacing prototype, current pages' caveats. |
| Activity anchors | `San Diego Zoo with kids`, `LEGOLAND San Diego toddlers`, `Birch Aquarium toddlers`, `Balboa Park kids`, `La Jolla with kids`, `Coronado with kids` | Official attraction pages, La Jolla Mom, local blogs, TripAdvisor/forums. | distributed across current pages; reset-atlas prototype not release-ready. |

## SERP-Overlap Cluster Map

Collection date: 2026-07-20.

Method: sample representative queries per theme, record recurring URLs/domains and page types, then cluster only where observed ranking domains/pages overlap or where the SERP repeatedly serves the same user job.

Confidence labels:

- `high`: multiple sampled queries share recurring pages/domains and page types.
- `medium`: recurring domains/page types appear, but overlap is partial or blended.
- `low`: evidence is mostly qualitative or sparse.

| Cluster | Included query shapes | Recurring ranking URLs/domains observed | SERP features/page types | Overlap rationale | Confidence |
|---|---|---|---|---|---|
| SD-C1 Lodging: hotels plus stay areas | family hotels, kid-friendly hotels, where to stay, best area | `lajollamom.com/best-kid-friendly-hotels-san-diego/`, `thefamilyvoyage.com/where-to-stay-in-san-diego-with-kids/`, Reddit `r/asksandiego`, `hotels.com`, `expedia.com`, `tripadvisor.com`, `thehotelguru.com`, official hotel pages | Reddit/forum, expert local guide, OTA directory, advisor hotel list, brand/property pages | Hotel and area queries share hotel pages, local/advisor pages, and forums. Searchers often blend "where" with "which hotel." | high |
| SD-C2 All-ages family activities | things to do, best things to do, San Diego with kids, family vacation | `lajollamom.com/best-things-to-do-in-san-diego-with-kids/`, `emilymkrause.com`, `destinationsanddesserts.com`, `thefamilyvoyage.com/things-to-do-san-diego-with-kids/`, `trolleytours.com`, TripAdvisor, Reddit | long list guides, local authority pages, travel blogs, official/tour pages, forums | Same pages recur for broad activity and family-vacation query shapes. | high |
| SD-C3 Age-specific activity planning | toddlers, babies, teens, tweens | La Jolla Mom toddler and teen pages, Reddit toddler/teen threads, Baby Can Travel, Fora, Go City, SoCal Field Trips | age-specific guides, forum advice, attraction/ticket pages | Toddler and teen SERPs differ in activities but share the need for age-specific filtering, pace, and "what actually works." | high |
| SD-C4 Itinerary and pacing | 3-day, 5-day, weekend, family itinerary | Local Passport Family, La Jolla Mom family vacation, The DIY Playbook, Destinations & Desserts, Fora, Reddit itinerary critique threads, Viator/Go City | lived-trip itineraries, advisor itinerary, product-led activity plans, forum review | Repeated pages bundle activities, lodging, food, transport, and rest. Searcher wants sequencing, not just attractions. | high |
| SD-C5 Rainy day / indoor backup | rainy day, indoor kids, rainy toddler | San Diego Family, San Diego Museum Council, La Jolla Mom rainy-day page, Reddit parent threads, Hidden San Diego, TripAdvisor rainy-day filter | local editorial lists, museum/official pages, forum ideas | Same indoor museums/play places recur across rainy and free/indoor variants. | medium-high |
| SD-C6 Free/budget and Kids Free October | free things, cheap activities, Kids Free October | SanDiego.org Kids Free, San Diego Museum Council Kids Free, La Jolla Mom free/Kids Free pages, KidsOutAndAbout, local blogs, Zoo official Kids Free page | official campaign pages, local list pages, deal guides | Free/budget searches split between evergreen free activities and October-specific deals. They need different freshness handling. | medium-high |
| SD-C7 Local/weekend/staycation | this weekend, events, staycation, overlooked places | Axios current events, KidsOutAndAbout, Reddit local threads, local blogs/magazines, tourism pages | event roundups, community UGC, local publisher calendars | The query job is current discovery. It should not be mixed into static evergreen pages without freshness workflow. | medium |
| SD-C8 Friction layer: stroller, transport, nap, sensory | stroller, no car, car-light, nap-friendly, low-stimulation | Official MTS/access pages, City/County pages, Reddit/forum advice, Family Tripwise prototypes | official infrastructure pages plus qualitative forums | SERPs do not cleanly isolate this theme, but it appears as a repeated subquestion inside activities, stay, and itinerary pages. | medium |

## Representative Ranking-Page Analysis

| Page/domain | Clusters served | What it answers well | Weakness or gap | Advantage we cannot copy | Opportunity Family Tripwise can honestly pursue |
|---|---|---|---|---|---|
| La Jolla Mom kid-friendly hotels | SD-C1 | Broad hotel list, local/advisor credibility, category picks, hotel-specific family amenities, booking monetization. | Dense, advisor/affiliate oriented, luxury-heavy; less transparent about uncertainty than our evidence-pack style. | Local resident, travel-advisor/client-booking experience, hotel perks relationship. | Cleaner comparison by family constraint, visible rough price/fee/route checks, map context, source-dated evidence labels. |
| The Family Voyage where-to-stay | SD-C1 | Friendly area/hotel framing with midrange and suite options. | Less systematic about evidence classes, conflicts, and exact parent checks. | Firsthand/travel-blog voice and affiliate history. | Transparent "area vs hotel vs itinerary" routing and checklists. |
| Reddit family-friendly hotel thread | SD-C1 | Feels authentic, names hotels quickly, surfaces real parent concerns. | Unstructured, unverifiable, may include unsupported or outdated suggestions. | UGC and moderated community trust. | Convert recurring parent questions into organized comparison fields without copying anecdotes. |
| Hotels.com/Expedia/TripAdvisor family hotel pages | SD-C1 | Price snippets, review counts, availability, filters, OTA conversion. | Poor at explaining why a hotel fits a child age, nap, stroller, or activity plan. | Live booking inventory and massive review scale. | Use as volatile price/review-signal evidence, not as the user experience we mimic. |
| La Jolla Mom things to do | SD-C2, SD-C3, SD-C6 | Comprehensive local-mom authority, top attractions, age links, tickets/hotels ecosystem. | Very long and monetized; harder to use as a quick decision router. | Local membership/experience, thousands of itinerary/client interactions, ticket monetization. | Make a tighter hub: "start with your family constraint" and route to toddler, teen, hotel, itinerary, rainy/free modules. |
| A Mom Explores / family blogs | SD-C2, SD-C4 | Relatable lived-trip details and photos. | Often one family's itinerary, less reusable across age/constraints. | Personal trip experience. | Provide reusable decision support without pretending firsthand experience. |
| Local Passport Family 3-day itinerary | SD-C4 | Clear 3-day structure, maps/packing/getting-around sections, specific sequence. | Can be too fixed for toddlers/teens/rain/nap variance. | Lived family itinerary narrative. | Integrate itinerary-pacing prototype concepts into a transparent planning matrix. |
| La Jolla Mom family vacation guide | SD-C2, SD-C4 | 3/5/7-day plans, rest afternoon, hotels/tickets integration. | Hard to beat on authority; broad and commercial. | Advisor/local expertise and monetization engine. | Focus on compact family constraint trees and evidence boundaries. |
| La Jolla Mom toddler/teen guides | SD-C3, SD-C5, SD-C6 | Strong quick picks by age, rainy/free callouts, local specificity. | Still long; Family Tripwise can avoid being another giant list. | Local/family/advisor experience. | Make toddler/teen pages subordinate specialists and route from the all-ages hub by age/pace. |
| San Diego Family rainy-day page | SD-C5 | Local indoor/rain ideas, practical names. | Not integrated with itinerary or lodging constraints. | Local publisher familiarity. | Build a rainy-day decision table tied to age, location, parking, and "how long it saves the day." |
| SanDiego.org / Museum Council Kids Free pages | SD-C6 | Official campaign freshness, deal participation. | Campaign-specific, not a full trip planner. | Official source status. | Link to official deal pages and explain when Kids Free changes trip economics without copying offers. |
| KidsOutAndAbout / local event pages | SD-C7 | Current/local event discovery. | Requires freshness and calendar maintenance. | Existing event inventory/community relationships. | Defer automatic event publishing; possible manual/current module later. |
| r/Agentic_SEO process discussions | operating method | Emphasizes domain knowledge, SERP data, competitor-page inspection, GSC/indexing, cannibalization checks, and not relying on AI-only slop. | Not travel-specific and not authoritative market data. | Community practitioner's lived workflow. | Use as qualitative process validation for this pack: SERP overlap and page inspection before production. |

## Qualitative Parent and Community Signals

These are research hypotheses only:

- Hotel/stay searchers often name specific hotels and ask for tradeoffs rather than abstract "best" answers. Reddit results for family-friendly hotels and area recommendations suggest UGC wins because it exposes real constraints quickly.
- Toddler families repeatedly ask about nap return, stroller reality, short sessions, gentle water, bathrooms, and indoor/rain backups. Community examples mention Zoo, LEGOLAND, Mission Bay, Children's Museum, Birch Aquarium, and playgrounds.
- Teen families need a different activity mix: thrill, food, beach/water, shopping, independence, and fewer little-kid resets.
- Itinerary searchers ask whether a plan is too much. Reddit itinerary critique threads and blog itineraries both center on sequencing, driving, and whether to group Zoo/Balboa, La Jolla/Torrey Pines, Coronado/Cabrillo, or LEGOLAND.
- Rainy/free/budget planners need currentness and official links. The evergreen page can route them, but a static claim about Kids Free offers or museum dates should be source-dated and verified near publication.

## Evidence-Derived Personas

These are research hypotheses derived from query modifiers, ranking pages, parent/community discussions, and current product constraints. They are not demographic truth.

### P1. First-Time San Diego Family Planner

- Job-to-be-done: turn "San Diego with kids" into a realistic first trip without missing the obvious anchors.
- Trip context evidenced: 3-5 days; likely Zoo, beach/bay, La Jolla/Coronado/Balboa, maybe LEGOLAND or SeaWorld.
- Child/pace constraints: mixed ages or unspecified; needs not to overpack the day.
- Anxieties: choosing the wrong area, driving too much, wasting expensive tickets, trying to do too many famous stops.
- Decision criteria: top anchors, realistic day grouping, stay base, rainy backup, budget/ticket checks.
- Failure modes: generic top-50 list, no route grouping, no "skip this if..." guidance.
- Served by searches/pages: SD-C2 all-ages activities, SD-C4 itinerary, SD-C1 stay.

### P2. Toddler/Nap/Stroller Family

- Job-to-be-done: find easy exits, short sessions, nap-compatible days, and low-friction places.
- Trip context evidenced: toddlers/babies, 2-year-old and 3-year-old forum questions, Mission Bay, Zoo bus tour, Birch Aquarium, New Children's Museum, Waterfront Park, LEGOLAND Duplo.
- Child/pace constraints: short attention spans, stroller/cargo, naps, bathrooms, snack/meal access, lower tolerance for parking/line surprises.
- Anxieties: meltdown, rain, too much walking, stroller barriers, unsafe or unsuitable water, inability to return for nap.
- Decision criteria: duration, stroller ease, indoor/rain, bathroom/reset, gentle water/playground, hotel pool.
- Failure modes: teen/adult activity lists, exact route claims without evidence, unsupported "stroller-friendly" claims.
- Served by searches/pages: SD-C3 toddlers, SD-C5 rainy/indoor, SD-C8 friction, current toddler page, itinerary-pacing prototype.

### P3. Teen/Tween Family

- Job-to-be-done: keep older kids engaged without making the trip feel like a little-kid checklist.
- Trip context evidenced: teen/tween queries and Reddit/local suggestions around Belmont Park, La Jolla Shores, Torrey Pines, iFLY, food, UTC/Convoy, escape rooms, watersports.
- Child/pace constraints: less nap dependence; more interest in choice, autonomy, scenery, food, thrill, and social energy.
- Anxieties: boring itinerary, too much kiddie content, poor rainy-day fallback, long drives for low payoff.
- Decision criteria: thrill/outdoor/food/rainy buckets, teen choice, transit/car practicality, cost.
- Failure modes: toddler-forward hub with no clear older-kid path.
- Served by searches/pages: SD-C3 teens, SD-C4 itinerary, current teen page.

### P4. Lodging-Led Planner

- Job-to-be-done: choose a base or hotel that matches the family's actual trip shape before booking.
- Trip context evidenced: stay/hotel SERPs; Reddit hotel and area advice; strong GSC impressions on San Diego stay page.
- Child/pace constraints: room setup, pool, breakfast/kitchen, parking, fees, noise, crib/rollaway, connecting rooms, car-light possibility.
- Anxieties: resort fees, wrong area, no nap reset, room too small, water/pool disappointment, expensive parking, unsupported "best hotel" claims.
- Decision criteria: area role, hotel category, rough nightly range, map/activity anchors, exact booking checks.
- Failure modes: ranked hotel list with no constraints, unsupported safety/quiet/stroller claims.
- Served by searches/pages: SD-C1 stay and hotels, stay-decision prototype, hotel evidence pack.

### P5. Weather/Budget/Local-Weekend Planner

- Job-to-be-done: salvage a rainy/hot/low-budget/current weekend plan without spending hours checking event sites.
- Trip context evidenced: rainy-day, indoor, free, Kids Free October, local weekend/staycation searches; official campaign pages and local event publishers.
- Child/pace constraints: varies by age; currentness matters more than static evergreen recommendations.
- Anxieties: closed offers, stale dates, expensive admissions, rain ruining outdoor plan, locals needing something this weekend.
- Decision criteria: free vs paid, indoor vs outdoor, official current offer, age fit, reservation needed, location.
- Failure modes: stale event lists, copied offer text, automatic event publishing without review.
- Served by searches/pages: SD-C5 rainy/indoor, SD-C6 free/budget, SD-C7 local/weekend, reset-atlas future asset.

## Existing San Diego Page and Prototype Audit

### Canonical/indexable public pages

| URL/path | Current role | GSC/index state | Persona fit | Cannibalization/overlap risk | Missing decision support | Trust/evidence gaps | Internal-link gaps | Recommendation |
|---|---|---|---|---|---|---|---|---|
| `site/where-to-stay/san-diego-with-kids.html` | Area/stay decision page with hotel checks and stay tool. | Indexed; 184 impressions; protected through 2026-07-27. | P1, P2, P4. | Overlaps hotel page on hotel intent, but can remain the area/base page if hotel page owns property comparison. | Could eventually expose clearer routing: "areas first vs hotels first vs itinerary first." | Exact route, stroller, quiet, value, room-selection claims remain human-gated. | Already links to hotel, activities, itinerary, toddler, teen. | Keep and observe. Do not edit before eligible date unless technical defect. Schedule protected-page refinements only after FT-EVAL-001. |
| `site/where-to-stay/san-diego-family-hotels.html` | Standalone researched hotel shortlist. | New after latest GSC snapshot; no GSC performance claim yet. | P4, P1. | Could cannibalize stay page if it starts answering area query too broadly. Current title/page role is hotel-specific. | Could add a compact "also compare if..." watchlist later, but not before initial discovery/observation. | Hotel evidence labels are correct; firm safety/quiet/stroller/value still gated. | Links to stay and itinerary; receives homepage/stay links. | Keep and observe for crawl/indexing. No immediate content expansion. |
| `site/things-to-do/san-diego-with-kids.html` | All-ages activity hub with filters, activities, map-ready data, links to stay/itinerary/toddler/teen. | URL Inspection says unknown/not indexed; no page-row impressions in latest snapshot. | P1, P2, P3, P5. | Should own all-ages activity intent; needs to route age-specific pages instead of duplicating them. | Needs a clearer persona-led entry matrix: first-time, toddler, teen, rainy/free, hotel-led, route-led. Needs stronger "start here" cluster navigation. | Stroller/rain/nap labels are model/editorial; should remain checks, not guarantees. Some source list includes hotels where activity page may not need them. | Should link more deliberately to hotel page, toddler/teen pages, itinerary, and official rainy/free sources. | Promote `FT-IMP-002`: existing-page hub upgrade. |
| `site/things-to-do/san-diego-with-toddlers.html` | Toddler specialist. | Indexed in latest inspection; no page-row impression signal yet. | P2, P5. | Could overlap all-ages page; avoid repeating all-ages list by focusing on nap/stroller/short-session decisions. | Needs more official current support for indoor/rain/free options if expanded later. | "Good for toddlers" is a family-fit judgment; keep as planning hypothesis unless source-supported. | Links to stay/itinerary/all-ages. | Keep; improve only after hub routing or if GSC shows toddler-specific signal. |
| `site/things-to-do/san-diego-with-teens.html` | Teen specialist. | Unknown/not indexed in latest inspection. | P3, P5. | Should not compete with all-ages page; should own teen/tween intent. | Needs stronger inbound routing from all-ages and itinerary pages; likely not enough discovery support. | Teen fun fit is research/model-derived, not verified local teen experience. | Receives all-ages/itinerary/stay links but could benefit from hub context. | Keep; support via `FT-IMP-002` rather than direct edit first. |
| `site/family-itinerary/san-diego-with-kids.html` | 1/2/3-day route and pacing guide. | Indexed; 12 impressions; weak average position. | P1, P2, P3, P5. | Overlaps activities page but should own sequencing, not attraction discovery. | Should eventually integrate concepts from unpublished itinerary-pacing prototype: age/nap/weather/transport day-shape selector. | Exact drive/transit/walk/wait/nap claims must stay as checks unless human-reviewed. | Links to activity/stay/toddler/teen; does not yet benefit from a stronger hub decision tree. | Keep. Later product integration candidate after hub upgrade or protected-page eval. |

### Legacy San Diego shims

| Path | Current role | State | Recommendation |
|---|---|---|---|
| `site/san-diego-with-kids.html` | legacy shim to all-ages activities page | `noindex, follow`, canonical to active URL, outside sitemap | Keep as-is. |
| `site/san-diego-things-to-do-with-kids.html` | legacy shim to all-ages activities page | `noindex, follow`, canonical to active URL, outside sitemap | Keep as-is. |
| `site/san-diego-where-to-stay-with-kids.html` | legacy shim to stay page | `noindex, follow`, canonical to active URL, outside sitemap | Keep as-is. |

### Relevant unpublished prototypes

| Prototype | Current role | Persona fit | Release blockers | Recommendation |
|---|---|---|---|---|
| `src/prototypes/san-diego-stay-decision/` | Area/stay recommender prototype. | P4, P1, P2. | Human review required for all area-fit scores and trust-sensitive claims; target stay page protected through 2026-07-27. | Keep unpublished. Consider after FT-EVAL-001 and human-review gate. |
| `src/prototypes/san-diego-itinerary-pacing/` | Age/nap/weather/transport day-shape prototype. | P1, P2, P3, P5. | Needs reviewed integration action; cannot assert exact times/routes. | Strong later product candidate; could inform `FT-IMP-002` language without moving prototype into `site/**`. |
| `src/prototypes/san-diego-family-reset-atlas/` | Synthetic reset/quiet/access map-shell. | P2, P5. | Real-record ingestion, reuse, route/access/sensory claims, downloads, and publication remain blocked. | Keep unpublished. Do not promote before real evidence/reuse gate. |

## Opportunity Matrix

Scores: 5 high, 1 low.

| Opportunity | Cluster/personas | Impact | Confidence | Learning | Effort | Risk | Observation compatibility | Decision |
|---|---|---:|---:|---:|---:|---:|---|---|
| Upgrade all-ages San Diego activities page into persona-led cluster router | SD-C2/C3/C4/C5/C6; P1-P5 | 5 | 4 | 5 | 3 | 1 | Does not require editing protected stay page | Promote as `FT-IMP-002`. |
| Evaluate and then refine protected San Diego stay page | SD-C1; P4 | 5 | 4 | 5 | 2 | 2 | Blocked until 2026-07-27 and requires protected query analysis | Keep as `FT-EVAL-001` due on/after 2026-07-27. |
| Expand hotel page with "also compare if..." watchlist | SD-C1; P4 | 4 | 3 | 4 | 2 | 2 | New page should be observed first | Defer until hotel page is discovered/indexed or GSC/search evidence suggests missing hotels block usefulness. |
| Integrate itinerary-pacing prototype into live itinerary page | SD-C4/SD-C8; P1-P3/P5 | 4 | 4 | 5 | 4 | 2 | Allowed later, but should follow hub routing so integration has clear entry points | Candidate after `FT-IMP-002`. |
| Build live rainy/free San Diego module or page | SD-C5/SD-C6; P5 | 4 | 3 | 4 | 4 | 3 | Requires freshness model for Kids Free/current offers | Defer; may be a manual module, not automatic scraper. |
| Publish Family Reset Atlas | SD-C8/P2/P5 | 4 | 2 | 5 | 5 | 3 | Blocked by real-record/reuse/human-review gates | Do not promote now. |
| Add a local/weekend events page | SD-C7/P5 | 3 | 2 | 4 | 5 | 3 | Currentness burden high; user previously deferred NYC weekend pattern | Do not promote for San Diego now. |

## Promoted Next Implementation: FT-IMP-002

Title: Upgrade the San Diego things-to-do page into a persona-led cluster router

Intent: improve an existing unprotected San Diego page so it more clearly serves broad "things to do in San Diego with kids" intent while routing specialized visitors to toddler, teen, stay, hotel, itinerary, rainy/free, and official-source checks.

Expected paths:

- `tools/generate-pages.mjs`
- `site/things-to-do/san-diego-with-kids.html`
- a focused test file under `tools/`, name to be chosen during implementation
- `backlog/implementation-backlog.md`
- `ops/operator-review.md`
- `ops/seo-roadmap.json`
- `ops/seo-roadmap.md`

Do not include:

- `site/where-to-stay/san-diego-with-kids.html` before the 2026-07-27 observation gate
- new destination pages
- new indexable page batch
- indexing requests
- external-account actions
- automatic event scraping

Acceptance criteria:

1. The page keeps the same canonical URL and indexability.
2. The page makes the all-ages role explicit: broad activity hub plus cluster router, not a toddler/teen/hotel duplicate.
3. Above or near the first decision surface, the page routes at least five research personas:
   - first-time family
   - toddler/nap/stroller family
   - teen/tween family
   - lodging-led planner
   - rainy/free/budget planner
4. The page links clearly to the existing toddler, teen, itinerary, stay, and hotel pages without editing the protected stay page.
5. The page adds a compact rainy/free planning surface using official/current-source links where needed, but does not publish stale event or Kids Free claims as current without source dates.
6. It avoids unsupported firm safety, stroller, route, quiet, water-suitability, and family-fit claims.
7. It does not copy review/forum prose or present community anecdotes as verified experience.
8. Focused tests verify persona routing, canonical/indexability stability, absence of blocked trust claims, and no accidental protected-page edit.
9. Native QA, production QA if required by policy, whitespace checks, and independent read-only review pass.

Measurement plan:

- Baseline from latest public-safe GSC snapshot before implementation:
  - all-ages activities page URL Inspection: unknown/not indexed
  - page-row impressions: no row in latest snapshot
  - cluster-level context: San Diego stay page 184 impressions; itinerary page 12 impressions
- Post-release checks:
  - page remains 200, canonical, indexable, in sitemap, internally linked.
  - no new sitemap/canonical/indexability regression.
  - page includes persona router and links to five relevant San Diego pages.
- Observation window:
  - 14 days for crawl/index discovery.
  - 28 days for early page-level impressions.
- Success signals:
  - URL Inspection changes from unknown/not indexed to indexed or crawled/indexing-allowed, without requesting indexing.
  - The all-ages page appears in GSC page rows or gains impressions for activity-related San Diego queries through protected query workflow when available.
  - No cannibalization evidence that the all-ages page displaces toddler/teen/hotel pages for their specialized intents.
- Stop/iterate conditions:
  - If still unknown after 14 days and public technical checks remain healthy, inspect internal links/sitemap discovery before content expansion.
  - If impressions appear but average position remains weak, compare query modifiers and either tighten the router or promote a narrower itinerary/rainy module.

## Source Register

| ID | Class | Source | Checked | Supports |
|---|---|---|---|---|
| GSC-0719 | fresh GSC/API public-safe summary | `ops/gsc-snapshots/2026-07-19.json` and `.md` | 2026-07-20 | Latest public page/inspection evidence. |
| GSC-0718 | prior GSC/API public-safe summary | `ops/gsc-snapshots/2026-07-18.json` and `.md` | 2026-07-20 | Prior comparison. |
| CTRL-0720 | central operator report | `/Users/apoorvagarg/Documents/SEO Agent/seo-lab/operator/reports/family-tripwise/latest.md` | 2026-07-20 | Scheduler state, protected target, guardrails. |
| SERP-HOTEL-1 | public SERP snapshot | search for `best family hotels in San Diego` and related variants | 2026-07-20 | Hotel/stay cluster overlap. |
| SERP-ACT-1 | public SERP snapshot | search for `things to do in San Diego with kids` and related variants | 2026-07-20 | All-ages activity cluster. |
| SERP-AGE-1 | public SERP snapshot | toddler and teen San Diego activity searches | 2026-07-20 | Age-specific cluster. |
| SERP-RAIN-1 | public SERP snapshot | rainy/free/Kids Free searches | 2026-07-20 | Rainy/free cluster. |
| SERP-ITIN-1 | public SERP snapshot | itinerary/weekend San Diego family searches | 2026-07-20 | Itinerary cluster. |
| LJM-HOTEL | ranking-page inspection | https://lajollamom.com/best-kid-friendly-hotels-san-diego/ | 2026-07-20 | Competitor hotel strengths and authority. |
| LJM-ACT | ranking-page inspection | https://lajollamom.com/best-things-to-do-in-san-diego-with-kids/ | 2026-07-20 | All-ages activity authority and routing pattern. |
| LJM-TOD | ranking-page inspection | https://lajollamom.com/things-to-do-in-san-diego-with-toddlers/ | 2026-07-20 | Toddler query/persona evidence. |
| LJM-TEEN | ranking-page inspection | https://lajollamom.com/things-to-do-in-san-diego-with-teens/ | 2026-07-20 | Teen query/persona evidence. |
| LJM-FAMVAC | ranking-page inspection | https://lajollamom.com/san-diego-family-vacation/ | 2026-07-20 | Multi-day itinerary and rest-afternoon pattern. |
| TFV-STAY | ranking-page inspection | https://www.thefamilyvoyage.com/where-to-stay-in-san-diego-with-kids/ | 2026-07-20 | Stay/hotel SERP competitor pattern. |
| LPF-ITIN | ranking-page inspection | https://www.localpassportfamily.com/2022/06/the-best-3-day-san-diego-itinerary-with-kids.html | 2026-07-20 | Itinerary page structure and lived-trip advantages. |
| SDF-RAIN | ranking-page inspection | https://www.sandiegofamily.com/things-to-do/out-about/rainy-day-activities-kids-san-diego | 2026-07-20 | Rainy-day local publisher pattern. |
| RED-HOTEL | community signal | https://www.reddit.com/r/asksandiego/comments/1rjc3kh/family_friendly_hotel/ | 2026-07-20 | Hotel/stay parent question shape only. |
| RED-3YO | community signal | https://www.reddit.com/r/asksandiego/comments/1grmeht/3_days_in_san_diego_with_3_year_olds/ | 2026-07-20 | Itinerary/stay parent question shape only. |
| RED-AGENTIC-1 | process signal | https://www.reddit.com/r/Agentic_SEO/comments/1uxxdp5/honest_case_study_agentic_content_at_volume_on_a/ | 2026-07-20 | Qualitative support for manual cluster/competitor research. |
| RED-AGENTIC-2 | process signal | https://www.reddit.com/r/Agentic_SEO/comments/1ncz7iz/how_do_you_make_sure_aigenerated_seo_content_is_actually_reliable/ | 2026-07-20 | Qualitative support for fact-checking/deep research. |
| RED-AGENTIC-3 | process signal | https://www.reddit.com/r/Agentic_SEO/comments/1ux0s46/what_seo_should_i_check_before_launching_a_new/ | 2026-07-20 | Qualitative support for GSC/indexing and cannibalization checks. |
| FTW-STAY | site audit | `site/where-to-stay/san-diego-with-kids.html` | 2026-07-20 | Current role, links, protected page state. |
| FTW-HOTEL | site audit | `site/where-to-stay/san-diego-family-hotels.html` | 2026-07-20 | Current hotel page role. |
| FTW-ACT | site audit | `site/things-to-do/san-diego-with-kids.html` | 2026-07-20 | Current activity hub role and gap. |
| FTW-TOD | site audit | `site/things-to-do/san-diego-with-toddlers.html` | 2026-07-20 | Current toddler specialist role. |
| FTW-TEEN | site audit | `site/things-to-do/san-diego-with-teens.html` | 2026-07-20 | Current teen specialist role. |
| FTW-ITIN | site audit | `site/family-itinerary/san-diego-with-kids.html` | 2026-07-20 | Current itinerary page role. |
| FTW-PROT-STAY | prototype audit | `src/prototypes/san-diego-stay-decision/README.md` | 2026-07-20 | Stay recommender boundaries. |
| FTW-PROT-ITIN | prototype audit | `src/prototypes/san-diego-itinerary-pacing/README.md` | 2026-07-20 | Itinerary pacing boundaries. |
| FTW-PROT-RESET | prototype audit | `src/prototypes/san-diego-family-reset-atlas/README.md` | 2026-07-20 | Reset atlas boundaries. |

## Research Conclusions

1. The San Diego cluster has enough evidence to go deeper before expanding cities, but the next move should strengthen cluster routing rather than add another standalone page.
2. Hotel and stay intent are real and commercially valuable, but the stay page is protected and the hotel page is too new for GSC measurement. Observe them before expansion.
3. The all-ages activities page is the best next existing-page improvement because it can route every persona and support indexing/discovery for toddler, teen, itinerary, stay, and hotel pages without touching the protected stay page.
4. La Jolla Mom's moat is local/advisor/firsthand authority and monetization integration. Family Tripwise should not copy that posture. Our differentiator should be clean decision surfaces, explicit uncertainty, source-dated facts, and parent constraint routing.
5. Reddit/community pages rank because they expose real constraints and named options quickly. Family Tripwise can borrow that usefulness pattern without borrowing unsourced anecdotes as facts.
6. The strongest product opportunity remains itinerary/stay/friction tooling, but live integration should follow evidence and observation gates.
