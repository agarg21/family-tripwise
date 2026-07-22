# Las Vegas Activity Expansion and Section Review

Status: implementation evidence

Action: `FT-IMP-006`

Prepared: 2026-07-22

Target: `https://familytripwise.com/things-to-do/las-vegas-with-kids.html`

## Decision

Expand the existing Las Vegas all-ages hub from six to 12 distinct planning choices, while reducing repetition:

- keep the filterable cards, but make each card compact;
- use one 12-row comparison table as the complete scan layer;
- retain detailed notes only for six choices whose heat, height, sensory, reservation, resort, or show constraints materially change the day;
- replace universal `best` language with five trip-shape starting routes;
- add compact heat/indoor, free/budget, and reservation checks;
- preserve direct routing to the teen, stay, and itinerary pages.

The 12 choices are not a quota. Each survived because it fills a different family planning job and has current source support.

## Evidence Classification

| Evidence | Freshness | Use | Limit |
|---|---:|---|---|
| GSC public-safe snapshot `ops/gsc-snapshots/2026-07-22.md` | collected 2026-07-22; finalized through 2026-07-20 | Baseline: target page has 180 impressions, 0 clicks, average position 56.22. | Page-level only; no query-specific or causal claim. |
| Semrush query evidence in `docs/research/next-city-prioritization-las-vegas-cluster.md` | collected 2026-07-22 | Confirms broad, free/budget, and age-specific search jobs. | Estimates overlap and are not traffic forecasts. |
| Current public SERPs and ranking pages | checked 2026-07-22 | Shows broad list pages, official tourism, family publishers, and specialist pages; supports a wider but more usable comparison. | Directional and location/time dependent. |
| Official attraction/operator sources | checked 2026-07-22 | Current attraction type, admission model, reservations, height/age rules, weather exposure, and operational checks. | Hours, prices, exhibits, rides, and policies remain volatile. |
| Public community discussions | checked 2026-07-22 | Qualitative question shapes: pool-led trips, walking/heat, age fit, cost, and off-Strip alternatives. | Anecdotes are not verified facts, representative reviews, or demand metrics. |
| Existing page and generator | current at action start | Every-section usefulness and repetition audit. | Local content does not prove user satisfaction. |

## Wider Candidate Review

Cost, age, time, stroller, rain/heat, nap, and value labels proposed for the page are Family Tripwise editorial estimates. Official sources support venue facts and current checks, not universal family fit.

| Candidate | Family planning job | Current source evidence | Main decision friction | Decision |
|---|---|---|---|---|
| Resort pool / reset block | Resort-led trip and midday recovery | Mandalay Bay publishes its current Beach amenity and FAQ; other properties vary. | Seasonal access, room/property eligibility, shade, closures, height/rule differences, and total hotel cost. | **Keep**, but call it a property-specific trip block rather than an attraction recommendation. |
| Bellagio Conservatory and fountains | Free, iconic, short first-trip stop | Bellagio publishes fountain information; Visit Las Vegas lists the fountains and Conservatory as free family sights. | Display transitions, show changes, crowds, weather, and long resort approaches. | **Keep** as the clearest free icon. |
| DISCOVERY Children's Museum | Younger-child indoor anchor | Official FAQ publishes a three-floor interactive museum, current hours/admission, and parking details. | Skews younger; schedule and admission change. | **Keep** for toddler through early-elementary and heat/rain backup. |
| Shark Reef Aquarium | Contained indoor animal stop on South Strip | Mandalay Bay publishes timed entry and current aquarium/VR details. | Ticket cost, route through a large resort, timed entry, and optional experience age rules. | **Add**; distinct from the children's museum and pool. |
| Adventuredome | Indoor rides and height-split day | Circus Circus publishes a five-acre indoor amusement park, current rides, height rules, and hours. | Noise, stimulation, height splits, ride closures, cost, and casino/resort route. | **Add**; fills indoor theme-park/ride intent. |
| Springs Preserve | Local history, desert ecology, gardens, and younger-child space | Official site publishes museums, trails, an eight-acre botanical garden, train, playground, and family programs. | Mixed indoor/outdoor exposure, exhibit/event changes, and off-Strip transport. | **Add**; strongest non-casino local-learning option. |
| High Roller | Contained skyline view | Caesars terms describe an approximately 30-minute enclosed ride, child supervision, stroller restrictions, and no cabin restroom. | Price, enclosed heights, stroller handling, boarding, and no restroom in cabin. | **Keep**, with route and stroller checks rather than `easy` claims. |
| AREA15 / selected exhibit | Immersive older-kid choice | AREA15 publishes its current entertainment district and experiences; exact exhibit rules vary. | Sensory intensity, exhibit-by-exhibit age rules, ticket stacking, and cost. | **Keep**, but require selection of an exact experience. |
| Red Rock Canyon Scenic Drive | Desert half-day and Strip break | BLM publishes current conditions and timed-entry requirement for Scenic Drive from Oct. 1-May 31, 8 a.m.-5 p.m. | Heat, weather, driving, limited services, trail fit, and seasonal reservation. | **Keep** as the outdoor/nature anchor. |
| Pinball Hall of Fame | Flexible low-cost/pay-per-play stop | Travel Nevada describes the South Strip collection and coin-operated games. | Machine availability and experience quality vary; community reports conflict. | **Add** as a budget/flexible candidate, not a firm family recommendation. |
| Tournament of Kings | Recognizable all-ages Vegas show plus meal | Excalibur publishes current dates, all-ages admission, meal information, and warnings for horses, dust, pyrotechnics, strobe, smoke, and fog. | Full ticket cost, fixed time, meal/diet needs, sensory/respiratory effects, and late arrival. | **Add** as the representative family show. |
| Neon Museum | Vegas-history and evening visual stop | Official FAQ describes the outdoor Boneyard and weather/heat cancellation or modification conditions. | Outdoor heat/wind, timed ticket, history interest, and Downtown route. | **Add** for older elementary through teens; not a universal younger-child choice. |
| Sphere Experience | Large-scale visual show | Current operator pages publish show-specific age and sensory rules. | Expensive, show-specific, highly sensory, and operationally volatile. | **Defer**; a future show comparison can evaluate it against other productions. |
| Hoover Dam | Major day trip | Bureau of Reclamation sources support visitor/tour context. | Drive, security/tour availability, heat, and a different itinerary job. | **Defer** to itinerary/day-trip research. |
| Downtown Container Park | Free/low-cost playground and food context | Current venue information exists, but age/event/evening policies are volatile. | Downtown environment, event schedule, heat, and time-specific age rules. | **Do not use as a primary card**; optional pairing only after exact-day checks. |
| Las Vegas Natural History Museum | Indoor museum alternative | Current museum information supports exhibits and admission. | Overlaps younger-child museum/local-history jobs already covered more distinctly. | **Defer**; not enough incremental decision value for this page. |
| Mob Museum / Atomic Museum | History specialist for older children | Current official visitor information exists. | Content maturity, age fit, and overlap with the dedicated teen job. | **Defer** to teen-page review. |
| Ethel M garden/factory stop | Henderson-area short stop | Current operator information exists. | Small stop, transport, tour availability, and seasonal garden conditions. | **Defer**; useful as an itinerary pairing, not one of the primary 12. |

## Selected Comparison Set

| Choice | Primary role | Main personas | Why it earns a row |
|---|---|---|---|
| Resort pool / reset block | Resort-led pacing | LV-P1, LV-P2, LV-P3 | In Las Vegas the lodging amenity can consume a meaningful family half-day; the page must explain its property-specific nature. |
| Bellagio Conservatory and fountains | Free first-trip icon | LV-P1, LV-P3, LV-P5 | High-recognition, short, and free, with meaningful route/crowd caveats. |
| DISCOVERY Children's Museum | Younger-child indoor | LV-P1, LV-P3 | True child-centered heat/rain backup away from resort entertainment. |
| Shark Reef Aquarium | Indoor animal stop | LV-P1, LV-P2, LV-P3 | Contained South Strip alternative with timed entry and broad age potential. |
| Adventuredome | Indoor rides | LV-P1, LV-P3, LV-P4 | Distinct theme-park job and height-split decision. |
| Springs Preserve | Local nature/history | LV-P1, LV-P3, LV-P5 | Balances museums, gardens, playground, and Las Vegas context outside the Strip. |
| High Roller | Skyline | LV-P1, LV-P4 | Contained signature view with clear time, stroller, height/enclosure, and restroom tradeoffs. |
| AREA15 / selected exhibit | Immersive older-kid | LV-P1, LV-P4 | Search/ranking pages repeatedly surface it; exact exhibit selection is the useful decision. |
| Red Rock Canyon | Nature half-day | LV-P1, LV-P4 | Distinct outdoor day shape with an official seasonal reservation rule. |
| Pinball Hall of Fame | Budget/flexible | LV-P1, LV-P4, LV-P5 | Adds a pay-as-you-go, easy-to-shorten option while preserving community conflicts as uncertainty. |
| Tournament of Kings | Family show | LV-P1, LV-P2, LV-P4 | Gives the page one concrete show with current all-ages and sensory/meal evidence. |
| Neon Museum | Vegas history/night | LV-P1, LV-P4, LV-P5 | Adds a short history-led option with outdoor weather constraints. |

## Every-Section Audit

| Current section | Usefulness finding | Treatment | Implementation requirement |
|---|---|---|---|
| Hero | Search intent is clear, but the intro does not preview the broader decision product. | **Replace** | Keep the literal query in H1 and add `12 picks by trip style`; describe one anchor plus reset pacing. |
| Trust panel | Useful but stale at July 5 and generic. | **Replace** | Date July 22; identify official sources and editorial-estimate fields without defensive prose. |
| Licensed image | Relevant Bellagio visual and valid attribution. | **Keep** | No image change. |
| Planning stance and snapshot | One-anchor rule is useful; `Best toddler/teen` and `Best areas` labels are too firm. | **Compress/reword** | Use younger-child and older-kid starting points, compare-stay-base language, and current expanded examples. |
| Filter bar and six full cards | Filters are useful, but eight facts per card make the first scan long. Six choices leave major jobs uncovered. | **Expand and compress** | Six filters, 12 compact cards, four facts per card, non-age filter tags hidden from the age display. |
| Quick picks | Eight `Best` cards repeat the filter cards and universalize preferences. | **Replace** | Five trip-shape starting routes corresponding to LV-P1-LV-P5. |
| Comparison table | Strong scan surface, but only six rows and several firm/easy labels. | **Expand** | 12 rows; explicit editorial-estimate note; use conditional/mixed route labels. |
| Detailed notes | Seven subsections for every choice repeat cards/table and create most of the verbosity. | **Compress** | Six compact detail cards only for choices with the largest planning consequences. |
| Mini itineraries | Helpful application layer but overlaps the dedicated itinerary page. | **Compress** | Five short route shapes; link out for full itinerary. |
| Cluster links | Correct destinations, but methodology card is redundant with trust panel/About/footer. | **Compress** | Keep stay, itinerary, and teen links only. |
| Sources | Too hotel-heavy for an activity page and missing sources for new choices. | **Replace** | Activity-specific source register for all 12 choices; retain photo attribution. |
| ItemList schema | Correct type but covers only six choices. | **Expand** | Exactly 12 items matching the comparison set. |
| FAQ schema | Relevant but generic and only two questions. | **Improve** | Feasibility, free choices, and indoor/heat backup, all with bounded language. |

## Claim and UX Boundaries

- `Lower-friction`, age, duration, cost, stroller, rain/heat, nap, booking, and value fields are editorial estimates, visibly labeled.
- Do not call a route stroller-friendly, a venue safe, a sensory environment suitable, or an attraction universally best.
- Do not infer current pool access from a hotel booking; tell users to check the exact property, date, and room/guest terms.
- Do not copy community or review prose. Pinball community conflicts support uncertainty only.
- Show and attraction hours, prices, rides, exhibits, timed entry, height/age rules, weather conditions, and closures are rechecked near the visit.
- The default page must remain useful without filters; filters shorten the 12-choice set.

## Source Register

Checked 2026-07-22:

- Visit Las Vegas family guide: `https://www.visitlasvegas.com/experience/post/things-to-do-in-las-vegas-with-kids/`
- Mandalay Bay Beach: `https://mandalaybay.mgmresorts.com/en/amenities/beach.html`
- Fountains of Bellagio: `https://bellagio.mgmresorts.com/en/entertainment/fountains-of-bellagio.html`
- Bellagio Conservatory: `https://bellagio.mgmresorts.com/en/entertainment/conservatory-botanical-garden.html`
- DISCOVERY Children's Museum FAQ: `https://discoverykidslv.org/about/faq/`
- Shark Reef Aquarium: `https://mandalaybay.mgmresorts.com/en/entertainment/shark-reef-aquarium.html`
- Adventuredome: `https://www.circuscircus.com/attractions/adventuredome/`
- Springs Preserve: `https://www.springspreserve.org/`
- High Roller terms: `https://www.caesars.com/content/dam/lnq/Property/High-Roller/lnq-Property-High-Roller-T-and-C.pdf`
- AREA15: `https://www.area15.com/`
- Red Rock Canyon BLM: `https://www.blm.gov/programs/national-conservation-lands/nevada/red-rock-canyon`
- Pinball Hall of Fame, Travel Nevada: `https://travelnevada.com/museums/pinball-hall-of-fame/`
- Tournament of Kings: `https://excalibur.mgmresorts.com/en/entertainment/tournament-of-kings.html`
- Neon Museum FAQ: `https://neonmuseum.org/faqs/`
- Community trip report used qualitatively: `https://www.reddit.com/r/LasVegas/comments/1sdb481/las_vegas_with_kids_trip_report/`
- Community family question used qualitatively: `https://www.reddit.com/r/vegas/comments/1qs4nse/visiting_family_with_kids/`
- Community hotel/pool question used qualitatively: `https://www.reddit.com/r/vegas/comments/148fw89`
- Community Pinball discussion used only to preserve conflict/uncertainty: `https://www.reddit.com/r/pinball/comments/1dg5jwz`

## Release Acceptance

- Exactly one live URL changes.
- The canonical, indexability, sitemap membership, photo license, and sibling pages remain intact.
- The page exposes 12 filterable choices, 12 comparison rows, five trip-shape routes, no more than six compact detail cards, and the three required cluster links.
- All official source links are visible and current at review time or failures are recorded as network-unknown rather than silently removed.
- Focused tests, generator/idempotency checks, all repository tests, SEO QA, responsive browser/layout checks, privacy/scope validation, and independent review pass before commit.
