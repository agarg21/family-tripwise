# San Antonio All-Ages Activity Expansion Review

Action: `FT-IMP-018` / `IMP-036` / `SRR-028`

Status: implementation complete, QA-green, and independently review-clean

Reviewed: 2026-07-26

Target: `https://familytripwise.com/things-to-do/san-antonio-with-kids.html`

## Decision

Replace the current six-choice, repeated page with one calm 13-choice decision
surface. The retained set earns distinct roles across first-visit context,
younger-child play, indoor/heat backup, free/budget planning, nature, inclusive
play, older-child adventure, and theme-park trips. Five persona starts, seven
filters, one complete comparison, six high-friction notes, four current-check
groups, and three visible/schema-aligned FAQs do the work. The five generic
mini-itineraries move to the existing itinerary page.

This is an existing-page improvement. It creates no URL, changes no sibling
page, and does not publish the separately proposed hotel comparison.

## Evidence Classification

| Evidence | Class | Freshness | Allowed use |
|---|---|---|---|
| `ops/gsc-snapshots/2026-07-26.md` | Fresh authenticated read-only GSC API summary | Collected July 26; finalized through July 24 | Baseline discovery only: 11 impressions, 0 clicks, page-level average position 64.36. Not a query rank or causal result. |
| Logged-in Semrush records in `FT-RES-010` | Fresh third-party keyword estimates | Collected July 26 | Directional demand and relative difficulty. The 5,400, 1,600, and 880 exact variants overlap and are not summed. |
| `FT-RES-010` SERP samples | Fresh observed search results | Collected July 26 | Search intent, page type, recurring domains, and URL/domain overlap. |
| Current official venue, park, NPS, and city pages | Primary operational sources | Checked July 26 | Current hours, admission model, official attraction inventory, calendars, and published policies. Recheck for the visit date. |
| Ranking publishers in `FT-RES-010` | Secondary editorial sources | Checked July 26 | Page structure and usefulness comparison, not verification of operating facts. |
| Parent/community discussions in `FT-RES-010` | Qualitative anecdotes | Current enough for hypothesis formation | Heat, pacing, age, hotel-base, and mixed-interest questions only. Not demand or verified experience. |
| Family Tripwise age, time, weather-role, and friction labels | Editorial planning estimates | Dated July 26 | Conditional comparison only; never venue guarantees or personally verified experience. |

## Search And Competitor Carry-Forward

The two core all-ages query variants return broad list pages with substantial
URL and domain overlap. `FT-RES-010` therefore assigns both to this one page.
Representative ranking pages are good at breadth, local framing, or destination
authority, but commonly make families re-read long lists to answer a narrower
question: what fits this child, this heat tolerance, this budget, this amount of
time, and this lodging geography?

Family Tripwise should not imitate local or firsthand authority. It can be
materially more useful by:

- retaining only choices with a distinct planning role;
- normalizing age, time, cost style, area, weather role, friction, and the
  current check that can change the decision;
- making free, younger-child, indoor/heat, older-child, and theme-park routes
  available without separate URLs;
- separating a shortlist from itinerary sequencing;
- linking every material operating claim to a current primary source; and
- exposing uncertainty without defensive or internal-sounding user copy.

## Current Page Baseline

The live generator currently produces:

- six primary filter cards;
- eight universal "best" quick picks;
- a repeated six-row, 11-column table;
- six detail cards with 42 labeled fields;
- five generic mini-plans;
- two FAQs; and
- six shared sources that do not cover every discussed choice.

The six names recur across the filter cards, quick picks, table, detail cards,
and mini-plans. The page has breadth poverty and repetition at the same time.
Categorical stroller, rain, nap, age, and "best" labels are also firmer than the
evidence supports.

## Candidate Ledger

The pool intentionally exceeds the final list. Retention is role-based, not a
quota.

| Candidate | Decision | Distinct family role | Persona fit | Decisive current evidence / unresolved check |
|---|---|---|---|---|
| The Alamo | Keep | Concise first-visit city context; free church visit plus optional paid depth | `SA-P1`, `SA-P4`, `SA-P5` | Official visit page says the Church is free and requires a reservation; paid tours and experiences differ. Interest span and exact experience remain family-specific. |
| GO RIO narrated cruise | Keep | Seated 35-minute River Walk orientation | `SA-P1`, `SA-P2`, `SA-P4` | Official pages give a 35-minute tour, three boarding points, weather dependence, and non-time-specific tickets. Boarding, wait, and exact accessibility need remain current checks. |
| The DoSeum | Keep | Strongest younger-child hands-on and indoor anchor | `SA-P2`, `SA-P5` | Official source lists Little Town, Big Outdoors, Calm Corner, current admission, summer hours, and free parking. Crowds, sensory fit, and age ceiling vary. |
| Hemisfair / Yanaguana Garden | Keep | Free Downtown movement and reset stop | `SA-P1`, `SA-P2`, `SA-P5` | Official park source establishes public park access and amenities. Weather, water/play conditions, and notices require a dated check. |
| San Antonio Zoo | Keep | Large animal half/full day near Brackenridge choices | `SA-P1`, `SA-P2`, `SA-P4` | Official source has dynamic tickets, current happenings, free garage parking, food rules, and optional paid experiences. Heat, scale, and add-on value vary. |
| Witte Museum | Keep | Broader indoor Texas nature, science, and culture option | `SA-P1`, `SA-P2`, `SA-P4`, `SA-P5` | Official source has current hours, admission, free parking, access details, special-exhibition surcharges, and a currently closed cafe. Exact exhibition interest varies. |
| Japanese Tea Garden | Keep | Durable, free, short Brackenridge pairing | `SA-P1`, `SA-P2`, `SA-P5` | City source says daily dawn to dusk and wheelchair accessible. Exact garden route, heat, and temporary notices remain checks. |
| San Antonio Missions NHP | Keep | Free history, Junior Ranger, and South Side trip role | `SA-P1`, `SA-P4`, `SA-P5` | NPS says fee-free, Mission San Jose has a visitor center and Junior Ranger materials, and facilities have different hours. Do not promise one uniform four-mission route. |
| San Antonio Botanical Garden | Keep | Nature and outdoor younger-child play, including a designated splash area | `SA-P1`, `SA-P2`, `SA-P5` | Official source has current tickets, seasonal hours, access guidance, Family Adventure Garden, and splash policy. Events and water use are date-specific. |
| Morgan's Wonderland | Keep | Accessibility-led inclusive theme-park choice | `SA-P2`, `SA-P3`, `SA-P4` | Official source describes 25-plus rides/play elements, current calendar, ticket types, water park, and special-needs admission. Exact ride access and calendar remain individual/date checks. |
| Natural Bridge Caverns | Keep | Distinct cave and optional above-ground adventure anchor | `SA-P1`, `SA-P4` | Official source requires choosing among different tours and add-ons with dated tickets. Terrain, duration, mobility, weather effects, and child comfort are tour-specific. |
| Six Flags Fiesta Texas | Keep | Ride-led full day with family and thrill inventory | `SA-P3`, `SA-P4` | Official source has dated hours, rides, closures, policies, and accessibility. Height split, heat, lines, and non-rider value must be checked. |
| SeaWorld San Antonio | Keep | Animal, presentation, family-ride, and thrill-ride full day | `SA-P3`, `SA-P4` | Official source has current park hours, tickets, ride-height and accessibility guidance. Aquatica is a separate ticket decision; schedules vary. |
| Hopscotch San Antonio | Defer to teen review | Compact immersive-art indoor choice | `SA-P4` | Official location page is current, but its strongest distinct job is older-kid/mixed-age indoor interest. The teen specialist can judge it against art, food, and entertainment peers. |
| LEGOLAND Discovery Center San Antonio | Defer | Younger-child chain attraction and indoor backup | `SA-P2` | It overlaps The DoSeum's stronger local younger-child job. Reconsider only if a dedicated indoor comparison needs another earned role. |
| SEA LIFE San Antonio | Defer | Compact indoor animal stop | `SA-P2` | It overlaps the zoo/SeaWorld animal job and LEGOLAND shopping-center route. It does not earn a core slot in a 13-choice first-trip scan. |
| Briscoe Western Art Museum | Defer | Western-art and culture interest | `SA-P1`, `SA-P4` | Potentially useful for a culture-led or teen revision, but weaker broad family payoff than Witte for this page. |
| San Antonio Museum of Art | Defer | Art-led indoor museum | `SA-P4` | Interest-specific and better evaluated in the teen/mixed-age review. It does not replace Witte's broader all-ages role. |
| Tower of the Americas | Defer | Short skyline/viewpoint stop | `SA-P1`, `SA-P4` | Paid short-view role overlaps Downtown context while adding no major constraint solution. Reconsider with better observed user demand. |
| Natural Bridge Wildlife Ranch | Defer | Drive-through wildlife day north of the city | `SA-P2`, `SA-P3` | Separate ticketed property and driving commitment overlaps zoo/SeaWorld animal roles. It can compete in a future animal-day review. |
| Texas Transportation Museum | Defer | Vehicle and train interest | `SA-P2`, `SA-P4` | Narrow but real child interest; limited operating schedule makes it a specialist, not an evergreen core choice. |
| Pearl / Museum Reach | Defer as a primary activity | Meal, stroll, and reset geography | `SA-P1`, `SA-P2`, `SA-P5` | Useful as a pairing and lodging/route decision, but not a standalone attraction equal to the retained anchors. |
| Kiddie Park | Defer as a primary activity | Small younger-child ride add-on | `SA-P2` | Its planning job is subordinate to the zoo/Brackenridge route and needs a dedicated current operating check before prominence. |

Result: 13 retained and 10 deferred. No candidate is kept merely to increase
the number in the headline.

## Persona Trace

| Persona | Page support |
|---|---|
| `SA-P1` first-time icon family | "Alamo plus GO RIO or Hemisfair" start; Downtown, Brackenridge, South Side, and outer-anchor areas; concise Downtown friction note; routes to stay and itinerary pages. |
| `SA-P2` heat/reset younger-child family | Younger and indoor/heat filters; DoSeum, Witte, Hemisfair, zoo, garden, and Morgan's roles; easy-exit language where supportable; no universal nap or stroller score. |
| `SA-P3` theme-park/resort family | Theme-park filter and start; Morgan's, Six Flags, and SeaWorld as distinct choices; exact height/access/ticket/calendar checks; route to the stay page before sequencing. |
| `SA-P4` teen/mixed-age family | Teen/mixed-age filter and start; caverns, missions, Witte, zoo, and the three full-day parks; route to the dedicated teen page for deeper interest work. |
| `SA-P5` budget/local-style family | Free/low-cost filter and start; missions, Hemisfair, Alamo Church, and Japanese Tea Garden; explicit warning that parking, food, paid extras, and geography still count. |

## Every-Section Disposition

| Current section | Decision | Implemented replacement |
|---|---|---|
| Hero and method | Rewrite | Direct 13-choice promise, dated official-source method, calibrated hero copy, and dimensioned licensed image. |
| One-anchor intro | Keep | Preserve the useful one-anchor stance and update the two age starts. |
| Six filter cards | Replace | Thirteen cards with four visible scan fields and seven working filters. |
| Teen sibling band | Move | Remove the interruption and place the teen route with stay and itinerary links. |
| Eight universal quick picks | Replace | Five persona-shaped conditional starts. |
| Six-row 11-column comparison | Replace | One 13-row, eight-field comparison with cost style, weather role, friction, and current check. |
| Six 42-field details | Compress | Six high-friction compact notes only. |
| Five mini-itineraries | Remove | Route sequencing to the existing itinerary page. |
| Sources | Replace | Current primary source for every retained material claim plus the media license. |
| Two FAQs/schema | Replace | Three visible questions with exact FAQ schema parity. |

## Claim Boundaries

- No personally verified visit or local-resident claim.
- No universal "best," safety, quiet, stroller, nap, accessibility, or age-fit
  guarantee.
- No exact drive time, route, wait time, price promise, or weather guarantee.
- "Free" is limited to official admission/public-access facts and does not mean
  parking, meals, transport, or optional experiences are free.
- Morgan's accessibility positioning is attributed to its official park design;
  exact attraction access remains an individual check.
- Cave terrain, ride height, and park access remain tour-, ride-, date-, and
  person-specific.
- Community anecdotes inform persona hypotheses only.

## Acceptance And Measurement

Acceptance:

- exactly 13 retained activity cards and comparison rows;
- five conditional starts and seven useful filters, including a short/flexible
  route that materially narrows the list;
- six compact high-friction notes;
- no mini-itinerary cards;
- all five personas have an explicit route;
- every retained material claim has a current direct source;
- visible FAQs and FAQ schema match;
- ItemList schema matches the 13 retained choices;
- canonical, indexability, sitemap entry, and three cluster links remain intact;
- target-only generation is idempotent and no unrelated site file changes;
- desktop, 390px, and 320px layouts contain all content and the image decodes;
- no credential, raw GSC query export, user data, or external-account mutation;
- native QA and independent review return `PASS` or `PASS_WITH_P3`.

Measurement:

- preserve the July 26 GSC baseline as sparse early discovery evidence;
- do not infer impact from crawl cadence or a short observation period;
- at a later evidence-based evaluation, compare page impressions, clicks, CTR,
  page-level position, and protected query families with equivalent windows;
- inspect whether discovery broadens across all-ages, free/budget,
  indoor/heat, and theme-park modifiers without cannibalizing the teen,
  stay-area, or itinerary roles.

## Primary Source Register

- [The Alamo visit](https://www.thealamo.org/visit)
- [GO RIO visitor information](https://www.goriocruises.com/visitor-information/)
- [GO RIO narrated cruise overview](https://www.goriocruises.com/overview/)
- [The DoSeum plan your visit](https://www.thedoseum.org/plan-your-visit)
- [Hemisfair visit](https://hemisfair.org/visit/)
- [San Antonio Zoo visit](https://sazoo.org/visit/)
- [Witte Museum plan your visit](https://www.wittemuseum.org/plan-your-visit/)
- [City of San Antonio Japanese Tea Garden](https://www.sa.gov/Directory/Departments/Parks/Parks-Facilities/Buildings-Centers/Japanese-Tea-Garden)
- [San Antonio Missions basic information](https://www.nps.gov/saan/planyourvisit/basicinfo.htm)
- [San Antonio Missions directions and facility-hour caution](https://www.nps.gov/saan/planyourvisit/directions.htm)
- [San Antonio Missions Junior Ranger](https://www.nps.gov/saan/learn/kidsyouth/junior-ranger.htm)
- [San Antonio Botanical Garden plan your visit](https://sabgtx.org/plan-your-visit/)
- [Morgan's Wonderland plan your visit](https://morganswonderland.org/plan-your-visit/)
- [Natural Bridge Caverns](https://naturalbridgecaverns.com/)
- [Six Flags Fiesta Texas](https://www.sixflags.com/fiestatexas)
- [SeaWorld San Antonio park information](https://seaworld.com/san-antonio/park-info/)
- [SeaWorld accessibility guidance](https://seaworld.com/san-antonio/help/guest-with-disabilities/)
- [River Walk photo source and license](https://commons.wikimedia.org/wiki/File:The_San_Antonio_River_Walk.jpg)
