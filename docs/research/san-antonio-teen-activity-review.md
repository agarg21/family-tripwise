# San Antonio Teen Activity Review

Status: implementation evidence record for `FT-IMP-020`

Prepared: 2026-07-27

Target: https://familytripwise.com/things-to-do/san-antonio-with-teens.html

## Decision

Keep one standalone San Antonio teen specialist and rebuild the existing URL as a compact 10-choice decision page.

The page should let the older child choose one meaningful anchor, then compare actual planning consequences: time, cost class, area, flexibility, mixed-age fit, and the exact current rule that can change the answer. It should not compete with 25-35 item local lists on raw inventory or repeat the all-ages guide.

Selected roles:

1. Natural Bridge Caverns, exact tour;
2. Six Flags Fiesta Texas;
3. Andretti Indoor Karting & Games;
4. SeaWorld San Antonio;
5. Alamo church and Ralston Family Collections Center;
6. Mission San Jose or one selected mission;
7. Hopscotch San Antonio;
8. GO RIO narrated cruise;
9. Pearl and Museum Reach, one teen-chosen stop; and
10. Southtown and Blue Star, one selected gallery or food stop.

## Evidence Classification

| Evidence | Freshness | Use | Limitation |
|---|---:|---|---|
| Repository page, generator, sitemap, tests, and operator state | checked 2026-07-27 | Current source and operating model. | Does not establish demand or ranking. |
| `ops/gsc-snapshots/2026-07-26.json` and `.md` | collected 2026-07-26; finalized through 2026-07-24 | Fresh authenticated read-only API baseline. | Public-safe page aggregate only; not query rank. |
| Logged-in Semrush evidence in `FT-RES-010` | collected 2026-07-26; US database dated July 2026 | Current directional exact volume and KD. | Similar variants overlap. |
| Current public search results | checked 2026-07-27 | Query-level result types and representative ranking pages. | Result order varies; not rank tracking or a complete retained top 10. |
| Current official attraction and destination sources | checked 2026-07-27 | Product, age, height, waiver, ticket, hours, weather, and policy facts. | Must be reopened near the visit. |
| Parent/community discussions | checked 2026-07-27 | Qualitative interest, agency, and failure-mode discovery. | Anecdotal; not demand, verified experience, or policy evidence. |

## Demand And GSC Baseline

- `things to do in san antonio with teens`: 140 US searches/month, KD 22.
- `san antonio with teens`: 70 US searches/month, KD 10.
- Variants overlap and must not be summed as unique demand.
- Fresh GSC page row: 3 impressions, 0 clicks, page-level average position 9.00.
- Three impressions are too sparse to call this a stable top-10 query rank.

Target: preserve a useful Top 20 role first, then test whether Top 10 visibility becomes stable after enough query and impression evidence exists.

## Current Query-Level Result Review

Collection date: 2026-07-27. These are representative observed results, not a complete ordered Google result export. Numeric URL overlap is therefore `UNKNOWN`.

| Query | Representative observed URLs / domains | Result pattern | Boundary / confidence |
|---|---|---|---|
| `things to do in San Antonio with teens` | [Visit San Antonio teen itinerary](https://www.visitsanantonio.com/plan-your-trip/itineraries/teens/); [SanAntonioThingsToDo 35-item guide](https://www.sanantoniothingstodo.com/things-to-do-in-san-antonio-for-teens/); [The San Antonio Things 25-item guide](https://thesanantoniothings.com/things-to-do-with-teens-in-san-antonio/); [Go City guide](https://gocity.com/en/san-antonio/things-to-do/things-to-do-with-teens) | Official itinerary, large local lists, commercial attraction guide | Distinct teen recommendation job; high confidence. |
| `San Antonio with teenagers things to do` | [Visit San Antonio teen itinerary](https://www.visitsanantonio.com/plan-your-trip/itineraries/teens/); [The San Antonio Things](https://thesanantoniothings.com/things-to-do-with-teens-in-san-antonio/); [Reddit teen-interest discussion](https://www.reddit.com/r/sanantonio/comments/16itb7u/any_recommendations_where_i_can_take_my_teenage/) | Teen itinerary, local-parent list, and community choice discussion | Same specialist role; medium-high confidence. |
| `San Antonio teen activities family` | [Visit San Antonio teen itinerary](https://www.visitsanantonio.com/plan-your-trip/itineraries/teens/); [Visit San Antonio family page](https://www.visitsanantonio.com/things-to-do/family-fun/); [City youth programs](https://www.sa.gov/Directory/Departments/Parks/Programs-Classes/Youth-Programs) | Visitor itinerary and family inventory mixed with local youth-program intent | Keep tourist framing explicit; medium confidence. |
| `San Antonio things to do with tweens` | [Visit San Antonio ages 6-12 itinerary](https://www.visitsanantonio.com/plan-your-trip/itineraries/older-kids/); [Visit San Antonio teen itinerary](https://www.visitsanantonio.com/plan-your-trip/itineraries/teens/); [Go City guide](https://gocity.com/en/san-antonio/things-to-do/things-to-do-with-teens) | Older-child itinerary and broad teen/family guide overlap | Route mixed-age families between the all-ages and teen pages; medium confidence. |

Representative pages:

- https://www.visitsanantonio.com/plan-your-trip/itineraries/teens/
- https://www.sanantoniothingstodo.com/things-to-do-in-san-antonio-for-teens/
- https://thesanantoniothings.com/things-to-do-with-teens-in-san-antonio/
- https://gocity.com/en/san-antonio/things-to-do/things-to-do-with-teens
- https://www.visitsanantonio.com/plan-your-trip/itineraries/older-kids/

## Ranking-Page Usefulness

| Result type | What it does well | Gap Family Tripwise can address |
|---|---|---|
| Visit San Antonio teen itinerary | Current destination context, coherent three-day sequence, Southtown/Pearl coverage, strong photography. | Itinerary format makes direct option comparison harder and can imply a fixed three-day answer. |
| The San Antonio Things | Firsthand local-parent voice, unusual local choices, food and event breadth. | Twenty-five choices create scanning friction; affiliate content and local-year-round activities mix with visitor anchors. Firsthand authority cannot be copied. |
| SanAntonioThingsToDo | Current 2026 framing and broad category navigation. | Thirty-five choices prioritize inventory over decisive rules and route fit. |
| Go City | Clear attraction inventory and commercial availability. | Pass-led selection and generic “teen-approved” language provide limited independent decision support. |
| Reddit/community discussions | Strong reminder to ask what the teen likes; candid local interests and disagreements. | Anecdotal, inconsistent, and unsuitable for ticket, age, route, access, or safety claims. |

Family Tripwise can be substantially more useful with one comparison surface, interest-led starts, exact official checks, selective depth, mixed-age routing, and explicit uncertainty. It should not claim local or firsthand authority.

## Persona Application

Primary: `SA-P4`, tween/teen-led family. Secondary: mixed-age needs from `SA-P1` and `SA-P3`.

| Job to be done | Constraint observed | Page response |
|---|---|---|
| Give the older child a real choice | A little-kid checklist and generic sightseeing marathon can fail. | Five interest-led starts and one teen-selected anchor. |
| Find a distinctly teen-weighted payoff | Adventure, rides, competition, art/photos, food, history with a mission, and lower-pressure urban time recur. | Ten choices cover different roles rather than small variations of one park or museum. |
| Keep a mixed-age group workable | Height, physical demands, effects, price, duration, and younger-child interest may differ. | Every high-friction option gets an exact fit check and the page routes to the all-ages guide. |
| Avoid an expensive mismatch | Tour type, park scope, waiver, height, chaperone, and adult-only hours can change the usable product. | Put the decisive current check in the comparison and link primary sources. |
| Manage heat and distance | Parks and caves are distant full or half days; outdoor city routes can degrade in heat. | Use bounded route shapes and avoid stacking distant premium anchors. |
| Allow agency without safety overreach | Families disagree about teen independence. | Do not recommend unsupervised roaming; check venue rules and use family-set supervision boundaries. |

## Candidate Review

| Candidate | Decision | Reason |
|---|---|---|
| Natural Bridge Caverns, exact tour | Keep | Distinct adventure/geology role; exact tour, age, physical fit, clothing, waiver, and refund terms matter. |
| Six Flags Fiesta Texas | Keep | Strong coaster/full-day role; height, calendar, closures, weather, ticket, and chaperone checks matter. |
| Andretti Indoor Karting & Games | Keep | Indoor competitive role with multiple products; exact height, license, waiver, clothing, and price rules matter. |
| SeaWorld San Antonio | Keep | Different mix of rides, animals, and optional Aquatica; park scope and policies matter. |
| Alamo church and Collections Center | Keep | Concrete artifact/history role; free church reservation and paid exhibit are different products. |
| Mission San Jose or one selected mission | Keep | Free World Heritage/history role; supports one bounded site rather than a five-mission checklist. |
| Hopscotch San Antonio | Keep | Compact indoor immersive-art/photo role; advance and adult-only-hour rules matter. |
| GO RIO narrated cruise | Keep | Seated city-orientation role with current 35-minute official duration. |
| Pearl and Museum Reach | Keep | Food/photo/reset role with high flexibility; exact event and return still matter. |
| Southtown and Blue Star | Keep | Self-directed art/neighborhood role that differs from a ticketed attraction. |
| San Antonio Zoo | Defer here | Useful all-ages and mixed-age anchor, but not distinct enough for the top teen set without animal interest. |
| The DoSeum | Defer here | Strong younger-child role; route mixed-age families through the all-ages page. |
| San Antonio Museum of Art | Defer here | Viable art alternative, but Hopscotch supplies a clearer teen-led immersive role and Pearl covers Museum Reach. |
| Briscoe Western Art Museum | Defer here | Potential history/art fit, but the Alamo/Missions pair provides a more destination-defining first specialist set. |
| Spurs game, concert, festival, or rodeo | Defer as evergreen choice | Strong when the date and interest align, but inventory is seasonal and event-specific. |
| Shopping at La Cantera | Defer | Preference-specific and easy to pair with Six Flags or Andretti without promoting as a core attraction. |
| Escape room, arcade, Topgolf, bowling | Defer | Operator-specific inventory or duplicate role; Andretti provides a current multi-choice indoor comparison. |
| River tubing | Defer | Seasonal, outside-city, operator, water-condition, transport, and safety judgments exceed this evergreen scope. |

## Every-Section Audit

| Existing section | Verdict | Reason / replacement |
|---|---|---|
| Hero and generic subtitle | Rewrite | State the 10-choice job and teen-led selection model. |
| Review/method panel | Rewrite | Date current sources and label editorial estimates. |
| Image | Keep with corrections | Preserve licensed River Walk photo; add stable dimensions, resized URL, fetch priority, and complete attribution. |
| “More independence” intro | Remove | Generic promise and unsupported implication; replace with five interest-led starts. |
| Six-item “Best-fit” section | Remove | Repeats later comparison/detail content. |
| Eight quick picks | Replace | Universal “best” labels and planning-risk cards mix choices with advice. Use five true starts. |
| Six-row 11-field table | Replace | Too narrow in inventory yet dense in generic fields. Use 10 rows and seven decisive fields. |
| Six long detail cards | Compress | Keep five only where the product or rule can materially change the answer. |
| Five mini plans | Replace | Repetitive. Use three bounded route shapes with one anchor. |
| Cluster handoff | Expand | Route to all-ages, hotel, stay-area, and itinerary roles. |
| Two FAQs | Replace | Remove the user-facing indexing rationale; answer choice, mixed-age, and supervision questions. |
| Source register | Replace | Use current primary sources for all selected choices and current policies. |
| ItemList / FAQ schema | Align | Ten selected items and three visible questions must match the page. |

## Claim Boundaries

Supported as source-dated facts:

- Natural Bridge Adventure Tour minimum age, physical-demand, waiver, minor-accompaniment, clothing, and booking terms on the checked official page;
- Andretti race height/license, waiver, clothing, and pay-by-activity rules;
- Hopscotch advance ticket, typical duration, and adult-only-hour boundaries;
- GO RIO's current narrated-cruise duration;
- Alamo church versus paid Collections Center product distinction;
- NPS free admission, site/program-hour variation, heat, and possible high-water closure;
- SeaWorld ticket-scope, ride-rule, weather, and chaperone-policy distinctions; and
- Six Flags ride-specific rules and current calendar/closure checks.

Do not publish:

- personally visited or personally verified claims;
- universal “best,” “teen-approved,” safety, accessibility, sensory, route, or independent-roaming assurances;
- a fixed final ticket price or guaranteed availability;
- copied review language or representative review score;
- a firm age/family-fit claim derived only from editorial intuition; or
- a claim that every shop, gallery, event, ride, cruise, or program is open on the trip date.

## Page Architecture

1. Direct answer and five teen-led starts.
2. One 10-row comparison with teen reason, time/cost, area/format, flexibility, decisive check, and nearby pairing.
3. Five deeper notes only for high-friction products.
4. Three bounded route shapes.
5. Four cluster routes.
6. Four current-check groups, three visible FAQs, aligned schema, and a dated source register.

## Acceptance And Measurement

- Preserve one canonical/indexable URL and one sitemap entry.
- Exactly 10 distinct choices, five quick starts, five selective details, and three bounded routes.
- Visible teen-choice, mixed-age, heat/weather, time, cost class, location, flexibility, and decisive-check support.
- Official links cover every selected role; editorial estimates are labeled.
- No unsupported safety, firsthand, independent-roaming, accessibility, or universal-fit claim.
- Route to all-ages, hotel, stay-area, and itinerary pages without editing them.
- Focused generation/idempotency tests and all native QA pass.
- Independent reviewer returns `PASS` or `PASS_WITH_P3` with no P0-P2.
- After release, verify canonical/indexability, 10 rows, internal routes, source links, one sitemap entry, FAQ/schema parity, responsive containment, sticky mobile row identity, release marker, and production SEO QA.
- Observe discovery, impressions, query fit, and page-level average position. Do not request indexing or treat early movement as causal proof.

## Source Register

Official sources checked 2026-07-27:

- https://naturalbridgecaverns.com/adventure-tour/
- https://www.sixflags.com/fiestatexas/frequently-asked-questions
- https://www.sixflags.com/fiestatexas/accessibility
- https://www.sixflags.com/fiestatexas/code-of-conduct
- https://www.sixflags.com/fiestatexas/plan-your-visit/park-hours
- https://andrettikarting.com/sanantonio/pricing
- https://andrettikarting.com/sanantonio/faq
- https://seaworld.com/san-antonio/faq/
- https://seaworld.com/san-antonio/help/inclement-weather-policy/
- https://www.thealamo.org/visit/calendar/alamo-free-timed-entry
- https://www.thealamo.org/visit/tours-and-experiences/alamo-collections-center
- https://www.nps.gov/saan/planyourvisit/basicinfo.htm
- https://www.nps.gov/saan/planyourvisit/directions.htm
- https://www.letshopscotch.com/faq/
- https://letshopscotch.com/locations/san-antonio
- https://www.goriocruises.com/visitor-information/
- https://www.goriocruises.com/faq/
- https://www.goriocruises.com/overview/
- https://events.atpearl.com/series/farmers-market/
- https://www.visitsanantonio.com/plan-your-trip/itineraries/teens/
- https://commons.wikimedia.org/wiki/File:The_San_Antonio_River_Walk.jpg
- https://creativecommons.org/licenses/by-sa/2.0/

Qualitative competitor/community inputs checked 2026-07-27:

- https://www.sanantoniothingstodo.com/things-to-do-in-san-antonio-for-teens/
- https://thesanantoniothings.com/things-to-do-with-teens-in-san-antonio/
- https://gocity.com/en/san-antonio/things-to-do/things-to-do-with-teens
- https://www.reddit.com/r/sanantonio/comments/16itb7u/any_recommendations_where_i_can_take_my_teenage/
