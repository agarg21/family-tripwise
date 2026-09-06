# Chicago Weather-Fallback Cross-Page Task Review

Date: 2026-09-06

Action: `FT-RES-034` / `SRR-056`

Evidence level: `proxy-reviewed`

Scope: live production [Chicago activities](https://familytripwise.com/things-to-do/chicago-with-kids.html) and [Chicago itinerary](https://familytripwise.com/family-itinerary/chicago-with-kids.html); exact 1280 by 900, 390 by 844, and 320 by 800 browser runs

## Decision

`PRESERVE_WITH_P3`. The spring weather-fallback case reaches a defensible provisional plan from the current two-page route. The winter control reaches a conditional indoor branch but cannot select one anchor because its retained source inputs do not state the older children's interest or usable duration. Keep the page roles, 12-choice inventory, single-select filters, comparison, itinerary pivot, URLs, and search state unchanged. Promote no implementation candidate.

The interface does not produce a two-option answer automatically. `Indoor / rain` reduces 12 cards to eight, while `Teen` also leaves eight; selecting an age filter replaces the weather filter rather than intersecting with it. The decisive age, duration, cost, zone, rain, physical-load proxy, booking, and nearby-pairing fields are nevertheless present on the cards and comparison. A reader can reduce the spring case to Art Institute versus Chicago Children's Museum. The winter control exposes several interest-led museum branches, but selecting among them requires an interest and usable time block that the retained case never supplies.

The remaining interface friction is non-blocking P3 evidence. Reduction is manual, evidence-class labels are global rather than repeated on every card, and the full itinerary pivot and dedicated post-shortlist handoff are deep on mobile. The current early itinerary route, normal links, comparison fields, stop rule, nearby meal/reset instruction, volatile-check list, and official source paths complete the spring task and expose the winter control's missing decision inputs. The incomplete control cannot justify another filter, handoff, weather layer, or URL without a reproduced page-level P2 or behavior evidence.

## GSC Boundary

The September 6 public-safe snapshot is fresh authenticated read-only API evidence collected 2026-09-06 and finalized conservatively through 2026-09-04. It reports 1,832 property impressions, 1 click, aggregate average position 65.27, and 24 of 28 inspected URLs indexed.

The activity page is indexed with 14 impressions at page-average position 54.93 and an August 31 crawl. The itinerary is indexed with 36 impressions at page-average position 55.33 and an August 31 crawl. The public record contains no aligned query cohort. These page averages are current crawl and orientation evidence, not query ranks, a CTR diagnosis, behavior, satisfaction, or an edit trigger.

## Retained Cases

### Spring switch

A first-time family with one six-year-old, a Loop or River North base, and a planned Maggie Daley plus Lincoln Park Zoo outdoor day sees a near-visit cold-rain forecast. Required output: at most two indoor candidates compared by age or interest, duration, cost, and zone; one provisional anchor; a nearby meal or reset; the outdoor block to remove; and exact current weather, venue, ticket, transport, entrance or storage, and backup checks.

### Winter-interest control

Two children ages ten and twelve hoped for snow, but current conditions do not support that plan. Required output: one older-child indoor anchor selected by stated interest and usable duration; an explicit physical-load caveat and current checks; and no clothing-specific recommendation from either page.

These are source-grounded task hypotheses from `FT-RES-033`, not fictional families or claims about prevalence.

## QA Inventory

Before interaction, the walkthrough identified these claims and controls:

- early route-planning link, activity filters, activity cards, five starts, comparison, official-source section, and late cluster handoff;
- `All`, `Indoor / rain`, `Elementary`, and `Teen` pressed states plus reset behavior;
- before/after option counts and the fields used to remove candidates;
- itinerary trip-length cards, day routes, weather pivot, stop/reset rules, activity return route, and official CTA/venue links;
- normal-link navigation in both directions;
- initial, filtered, reset, narrow-screen, and horizontally scrolled table states;
- document containment and bounded comparison scrolling at every declared viewport.

## Observable Interface Evidence

### Activity page

| Viewport | Early itinerary link | Filter / first card | Weather start | Comparison | Dedicated itinerary handoff | Document width |
|---|---:|---:|---:|---:|---:|---:|
| 1280 by 900 | 1.8 viewports | 2.2 / 2.3 | 4.0 | 5.1 | 9.3 | 1280 / 1280 |
| 390 by 844 | 2.2 | 2.5 / 2.6 | 7.6 | 9.4 | 17.1 | 390 / 390 |
| 320 by 800, filtered | 2.3 | 2.7 / 2.9 | 6.9 | 9.0 | 18.1 | 320 / 320 |

Positions are page-top distance divided by the exact viewport height, rounded to one decimal. The 320 run records the task's filtered state, so hidden outdoor cards shorten later positions.

`All` shows 12 activity cards. `Indoor / rain` shows the same eight options at all three sizes: Field, Shedd, Griffin MSI, Adler, Chicago Children's Museum, Art Institute, 360 CHICAGO, and Garfield Park Conservatory. `Teen` also shows eight: Field, Griffin MSI, Adler, the architecture cruise, Art Institute, 360 CHICAGO, Garfield, and lakefront/beach time. Activating `Elementary` after `Indoor / rain` replaces the weather state and shows all 12 cards. The controls are single-select, not combinable.

The activity comparison contains one row per card with age, duration, cost, area, stroller, rain, nap, booking, value, and nearby-pairing fields. At 390 pixels its wrapper is 352 pixels wide around a 1,099-pixel table; at 320 it is 282 pixels wide around the same table. The wrapper contains horizontal movement and the document itself never overflows.

### Itinerary page

| Viewport | Trip-length start | Day routes | Weather pivot | Activity return link | Document width |
|---|---:|---:|---:|---:|---:|
| 1280 by 900 | 1.5 viewports | 2.1 | 4.0 | 5.8 | 1280 / 1280 |
| 390 by 844 | 1.7 | 2.7 | 6.0 | 8.7 | 390 / 390 |
| 320 by 800 | 2.0 | 3.1 | 7.1 | 10.2 | 320 / 320 |

The weather row keeps one current indoor anchor and nearby meal, moves the outdoor or skyline block, warns that indoor choices can still involve queues, walking, stimulation, and transfers, and names venue status, forecast, transit alerts, ticket, coat or stroller storage, and backup as current checks. The page's top review-status text also requires exact attraction, hotel entrance, transit or parking, weather, ticket, and accessibility checks.

At 320 pixels the itinerary table wrapper is 282 pixels wide around an 820-pixel table. A browser interaction moved the wrapper from `scrollLeft=0` to `450`, within its measured `538`-pixel maximum, while document width remained 320 pixels. The table content remained contained and legible. The equivalent 390-pixel wrapper is 352 pixels wide around the same 820-pixel table.

Both cross-page links completed normal navigation. One Playwright locator click did not activate the already visible 320-pixel return link after horizontal table interaction; a fresh visible-DOM inspection found the same ordinary anchor and activating that visible anchor navigated correctly. This was not reproduced as a page defect, broken link, overlay, or containment problem.

## Task Results

### Spring switch

| Step | Result | Observable basis |
|---|---|---|
| Start | `YES` | The one-anchor stance and itinerary route precede the filter; the weather filter begins 2.2-2.7 viewports down. |
| Reduce | `PARTIAL` | The filter narrows 12 to eight, not two. The visible card fields allow a manual reduction to Art Institute versus Chicago Children's Museum, but age and weather cannot be combined and the richer comparison is deeper. |
| Compare | `YES` | Both remaining options expose age, duration, cost, zone, stroller/rain/nap role, booking check, reason, and nearby pairing from one visible comparison. |
| Trace | `PARTIAL` | Freshness, research method, estimate labels, and official links are available, but evidence classes and source paths are global or later rather than repeated beside every card field. |
| Decide | `YES` | Art Institute is the provisional central, shorter, lower-child-cost choice for a six-year-old; Chicago Children's Museum remains the hands-on alternative when that interest outweighs Loop proximity. |
| Verify | `YES` | The joined route explicitly names forecast, venue status, ticket or entry window, CTA alerts, entrance/accessibility, storage, and backup checks, with official attraction and CTA source links. |
| Recover | `PARTIAL` | The itinerary supplies the deletion/reset rule and normal links work, but the selected activity is carried manually and the dedicated post-shortlist handoff/pivot is deep on mobile. |

Provisional day: choose Art Institute when central location, 90-minute-to-three-hour scope, and free admission for a child under 14 win. Use Chicago Children's Museum when hands-on play is the stated priority. Drop Lincoln Park Zoo because it is a separate outdoor zone. Keep Maggie Daley only as a short optional finish if the current forecast and park status support it; otherwise drop that outdoor block too. Keep a nearby meal or hotel return as the reset. This is a page-supported planning branch, not a weather, route, access, or suitability guarantee.

### Winter-interest control

| Step | Result | Observable basis |
|---|---|---|
| Start | `YES` | The page asks older children to choose by interest and exposes a `Teen` filter plus an age-led itinerary pivot. |
| Reduce | `PARTIAL` | `Teen` leaves eight cards and does not intersect with `Indoor / rain`; the reader must remove outdoor/weather-dependent choices and apply interest plus duration manually. |
| Compare | `YES` | Indoor museum candidates expose age, time, cost, zone, rain role, booking, and useful physical-load proxies consistently. |
| Trace | `PARTIAL` | The same global evidence/freshness labels and later official links support the choice, without per-field evidence labels. |
| Decide | `PARTIAL` | The retained control supplies neither a stated interest nor a usable duration, so it cannot choose one anchor. Conditionally, Adler fits a space preference and Field fits a natural-history preference, with the visible duration fields available once the family supplies its usable block. |
| Verify | `YES` | The route requires current forecast, venue/show or exhibit status, ticket, CTA alert, storage, and backup checks and avoids implying that indoor means low effort. |
| Recover | `PARTIAL` | The itinerary preserves one anchor and reset and removes the unusable outdoor/snow block, but the all-ages selection must be carried into the later pivot. |

The winter control therefore validates the route's interest/duration prompts, physical-load caveat, recovery rule, and current-check coverage, but it does not independently complete a provisional choice. Clothing specifics remain outside both page roles. The itinerary's storage check is relevant to venue use; it is not clothing guidance.

## Adversarial Checks

- The task does not infer weather from season or from the source questions. The actual forecast remains a near-visit current check.
- An indoor label is not treated as low-walking, low-stimulation, open, ticket-available, or suitable.
- The spring choice does not preserve the original outdoor movement goal perfectly; the provisional answer states that tradeoff instead of claiming an equivalent substitute.
- The winter control does not invent the missing interest or usable duration, turn a hope for snow into an operating-condition claim, or stretch the page into a packing guide.
- Removing the comparison or itinerary pivot would remove decisive fields or the recovery rule. Moving or adding another section is not supported by a material failure.
- A compound filter, new weather card, dedicated rainy-day URL, or duplicate route could reduce some scan effort, but this two-case proxy result does not establish enough benefit to offset another interface layer.

## Severity And Candidate Result

No P0-P2 page defect is reproduced. The three recurring interface `PARTIAL` scores are non-blocking P3 friction:

1. single-select filters leave eight candidates and require manual constraint intersection;
2. evidence-class and source explanations are global rather than local to every card; and
3. the complete cross-page recovery path becomes deep after a reader has scanned the full shortlist or comparison.

The winter control's `Decide: PARTIAL` is a separate input limitation: its source record asks for an interest-and-duration decision without supplying either value. It is retained as a conditional control and is not evidence of a page defect or a completed decision.

Do not promote an implementation candidate. Reopen only if an independent walkthrough cannot produce the two-option shortlist, current checks, or deletion/reset rule; actual user or behavior evidence shows the manual route is materially missed; aligned query evidence establishes a weather-fallback job on one of these URLs; or a current factual, source, navigation, accessibility, rendering, or indexability defect appears.

## Evidence Boundary

- This is a reproducible expert proxy walkthrough, not user testing or proof of preference, success, behavior, satisfaction, conversion, demand, ranking, or CTR.
- The provisional choices are editorial task outputs from visible fields, not firsthand recommendations or firm family-suitability claims.
- No current condition, safety, exact route, travel time, stroller path, venue operation, ticket availability, price, storage policy, or access state was asserted.
- The page source dates remain July 23, 2026. The task checks interface answerability, not a new audit of every attraction fact.
- No public page, URL, title, copy, activity record, filter, schema, sitemap, indexability, indexing request, external account, community queue, destination, or automation changed.

## QA And Independent Review

Operator QA is complete: focused Chicago activity/itinerary tests pass 9/9 and the full native suite passes 162/162. Operator-state and content-freshness QA pass; local and production SEO report 0 errors and 0 warnings; all 55 public GSC snapshots validate; the public preflight returns 200 for the sitemap, robots and all 28 configured URLs. Strict roadmap JSON, 86 unique action IDs, exact ten-path/no-site scope, privacy-pattern and whitespace checks pass. Browser checks above are complete, and the temporary viewport override was reset after the declared runs.

Independent read-only reviewer Herschel (`01a077be-18e2-7d71-a917-3f4974a4e85b`) cycle one returned `FAIL` for one P2 research-record defect: the initial winter result invented a space interest and a two-to-four-hour block, then overstated the control as complete. The result now keeps both inputs unknown, scores winter `Decide` as `PARTIAL`, and narrows every cross-repository completion claim. Cycle two verified that correction and returned `PASS_WITH_P3` with no P0-P2. The three accepted P3s are the single-select filter intersection, global evidence labels, and deep complete recovery route.

Docs-only action commit `2a73091ed9ae3db17322f118d042970428eca495` is pushed to `main`; no Pages wait applies.

## Sources

- [Chicago activities live page](https://familytripwise.com/things-to-do/chicago-with-kids.html), checked 2026-09-06.
- [Chicago itinerary live page](https://familytripwise.com/family-itinerary/chicago-with-kids.html), checked 2026-09-06.
- `docs/research/chicago-current-weather-fallback-questions-2026-09-06.md`, completed 2026-09-06.
- `ops/gsc-snapshots/2026-09-06.md`, collected 2026-09-06 and finalized through 2026-09-04.
- [National Weather Service Chicago](https://www.weather.gov/lot/), current verification path checked in `FT-RES-033` on 2026-09-06; it is not evidence of conditions for either task.
