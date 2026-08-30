# Chicago Family Itinerary Full-Day Task Review

Reviewed: 2026-08-30

Action: `FT-RES-023` / `SRR-044`

Review: Mill cycle-two `PASS`; no P0-P3 remains. Cycle one reproduced the task result but returned `FAIL` for one P2 desktop-viewport evidence overstatement; the limitation was corrected and independently verified.

QA: focused 4/4 and full 181/181 tests; operator state, freshness, local/production SEO, all 48 public GSC snapshots, public preflight, strict JSON, exact scope, privacy, links, and whitespace pass.

Target:

- https://familytripwise.com/family-itinerary/chicago-with-kids.html

Evidence level: `proxy-reviewed`. This is a task walkthrough of the live interface. It is not observation of parents, user testing, behavior-supported evidence, satisfaction evidence, or a search-ranking result.

## Decision

The three-full-sightseeing-day task is `PARTIAL`; the two-full-day control is `YES`.

The two-day route directly supplies a central day and one contrast-zone day. It also protects a reset, provides bad-weather and budget swaps, says what to remove, and routes the reader to current activity, area, hotel, transit, and official attraction checks.

The page's three-day route is explicitly a soft arrival plus two distinct full-day shapes. That is coherent for three calendar days including arrival, but a family with three full sightseeing days must infer a third full-day zone or anchor from the contrast options. The page therefore does not directly complete its usable-full-day count or one-zone-per-day output for that case. The remaining four outputs are complete and no contradiction, unsupported certainty, broken internal handoff, or responsive overflow was found.

Preserve the live page and current URL now. Retain one bounded, unselected future hypothesis: in the existing three-day quick pick and route, distinguish `three calendar days including arrival` from `three full sightseeing days`, and route the latter to a central day plus two separate contrast zones. This is an existing-page wording/decision hypothesis, not a selected implementation, new section, fourth day, or new URL.

## GSC Boundary

No August 30 public-safe snapshot was available at selection, so the task began from the recent reused August 29 API evidence. Before release, mechanical snapshot commit `35e0eb517e5d6a8aa2da36de36d74113c7e0704c` arrived and all 48 public snapshots validated. The fresh August 30 authenticated read-only API snapshot is finalized through August 28 and reports 2,050 property impressions, 4 clicks, aggregate average position 65.62, and 24 of 28 inspected URLs indexed. The Chicago itinerary has 40 impressions at page-average position 47.3, remains indexed, and was last crawled July 31.

The public snapshot has no aligned query cohort. The new day of property/page evidence does not change the task result or select an edit. These data orient the review and preserve the measurement boundary; they do not establish query rank, CTR failure, rewrite eligibility, user behavior, or satisfaction. The literal one-, two-, and three-day planning promise selected this task.

## Family Cases

Both cases use a central stay base, children about 5 and 11, one protected midday hotel return or slow reset, one bad-weather day, and no more than one paid or high-attention anchor per day.

### Case A: three full sightseeing days

The family has three complete days after arrival and before departure. It needs:

1. an explicit usable-full-day count;
2. one zone or main anchor for each day;
3. a protected reset;
4. a weather or budget swap;
5. one removal rule when energy, weather, or an anchor runs long;
6. a route to current activity, transit, lodging, and official verification.

### Case B: two full sightseeing days

The family has two complete days with the same constraints and needs the same six outputs. This is the control because the page explicitly offers a two-day first-trip route.

## Evidence Inventory

| Evidence | Date | Class | Use | Limitation |
|---|---|---|---|---|
| Live Chicago itinerary | Inspected 2026-08-30; visible sources checked 2026-07-23 | Live page/interface evidence | Trip-length promise, routes, pivots, stop rules, cluster and official-source handoffs | Interface evidence does not establish parent preference or completion |
| August 30 GSC snapshot | Collected 2026-08-30; finalized through 2026-08-28 | Fresh authenticated API, public-safe | Index/crawl and pre-release measurement boundary | No aligned query cohort; cannot select content or CTR work |
| Internal cluster links | Checked 2026-08-30 | Live navigation evidence | Activity, teen, area, and named-hotel recovery | Link availability does not prove the destination page answers every downstream decision |
| Official verification links | Visible on page; selected endpoints checked 2026-08-30 | First-party route evidence | Choose Chicago, CTA, parks, and attraction checks | Policies, schedules, service and access remain date-specific |

All five Family Tripwise URLs used by the task returned HTTP 200. The Choose Chicago itinerary returned 200. CTA's alert URL appeared as a normal source link but returned 403 to the scripted HTTP check; no claim is made that automated access proves or disproves its normal browser availability.

## Observable Page Route

The operator's in-app browser reported 1280 by 900 after its explicit desktop override. The independent review environment clamped the same request to 1280 by 720 while reproducing the same element positions. The desktop evidence below is therefore limited to the 1280-pixel width breakpoint, source order, normal navigation, element positions, and zero overflow; no cross-environment 900-pixel-height or desktop viewport-depth claim is retained. Both environments confirmed exact 390 by 844 and 320 by 800 mobile runs. Document width equaled viewport width in every run.

| Viewport | Trip-length start | Route section | Two-day route | Three-day route | Pivot | Stop rules | Cluster handoff | Overflow |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| 1280-pixel desktop width | 1,382px | 1,910px | 2,130px | 2,757px | 3,505px | 4,434px | 4,943px | 0px |
| 390 by 844 | 1,460px / 1.7 viewports | 2,284px / 2.7 | 3,332px / 3.9 | 4,104px / 4.9 | 4,903px / 5.8 | 6,053px / 7.2 | 7,005px / 8.3 | 0px |
| 320 by 800 | 1,569px / 2.0 viewports | 2,465px / 3.1 | 3,710px / 4.6 | 4,602px / 5.8 | 5,545px / 6.9 | 6,724px / 8.4 | 7,796px / 9.7 | 0px |

Normal navigation from `Open Chicago things to do with kids` reached the live 12-choice activity page and returned successfully. The cluster also exposes the teen, stay-area, and named-hotel links. The source layer exposes Choose Chicago, CTA maps/accessibility/alerts, Field, Shedd, the Art Institute, Maggie Daley Park, Lincoln Park Zoo, Griffin MSI, the Chicago Architecture Center, the Park District, and the Children's Museum.

## Task Matrices

Viewport does not change whether evidence exists, so each output score is stable across desktop and both mobile runs. Position affects effort and is recorded separately above.

### Case A: three full sightseeing days

| Required output | 1280-pixel desktop width | 390 by 844 | 320 by 800 | Observable evidence |
|---|---|---|---|---|
| Usable full-day count | `PARTIAL` | `PARTIAL` | `PARTIAL` | The three-day route is one soft-arrival day plus two full-day shapes; a third full day must be inferred |
| One zone or anchor per day | `PARTIAL` | `PARTIAL` | `PARTIAL` | Central and one contrast day are explicit; another contrast zone can be chosen but is not assigned as Day 3 of three full days |
| Protected reset | `YES` | `YES` | `YES` | The two-day reset rule, younger-child pivot, and stop rules protect a hotel return, slow meal, or unbooked block |
| Weather or budget swap | `YES` | `YES` | `YES` | Pivot rows replace the outdoor/skyline block or use one paid anchor plus public-space time while requiring current checks |
| Removal rule | `YES` | `YES` | `YES` | Remove the next activity when the reset disappears and delete the late or optional block first |
| Current verification route | `YES` | `YES` | `YES` | Cluster links and date-stamped official sources expose activity, lodging, transit, ticket, access, weather, and route checks |

### Case B: two full sightseeing days

| Required output | 1280-pixel desktop width | 390 by 844 | 320 by 800 | Observable evidence |
|---|---|---|---|---|
| Usable full-day count | `YES` | `YES` | `YES` | The two-day route supplies two full days rather than an arrival/departure block |
| One zone or anchor per day | `YES` | `YES` | `YES` | Day 1 is central Chicago; Day 2 is one selected Museum Campus, Lincoln Park, Hyde Park, or teen-led contrast |
| Protected reset | `YES` | `YES` | `YES` | The route explicitly protects one hotel return, slow meal, or unbooked block |
| Weather or budget swap | `YES` | `YES` | `YES` | The same pivot rows apply without adding another zone |
| Removal rule | `YES` | `YES` | `YES` | Remove the Day 2 evening add-on before food or reset; do not stack contrast zones |
| Current verification route | `YES` | `YES` | `YES` | The same cluster and official-source route is available |

## Friction And Trust Checks

- **Buried answer:** The trip-length start begins 1.7 mobile viewports down at 390 and 2.0 at 320. The full route section begins 2.7 and 3.1 viewports down; the three-day plan begins 4.9 and 5.8 viewports down.
- **Unnecessary detour:** None for the core itinerary decision. Current activity and lodging details correctly live on linked pages rather than being repeated here.
- **Repetition or contradiction:** None found. The quick pick, route, pivot, FAQ, and stop rules consistently describe the three-day shape as a soft arrival plus two full days.
- **Unsupported certainty:** None required for completion. The page calls the plans shapes rather than timed route guarantees and requires exact-date route, access, ticket, weather, transit, parking, entrance, and hotel checks.
- **Missing comparison:** The page does not distinguish three calendar days including arrival from three complete sightseeing days.
- **Evidence traceability:** The visible review date, research boundary, cluster pages, and official-source list are available.
- **Unknown recovery:** The page names what must be rechecked and where to continue the activity, area, and hotel decisions.

## Reusable Lesson

An itinerary's day count is a planning input, not just a label. `Three days` can mean three calendar days including arrival or three complete sightseeing days, and those cases produce different usable-block counts. Task reviews should test both meanings before adding attractions or prose. A coherent soft-arrival plan can still be incomplete for the literal full-day case.

## Next Falsification

Reject the future distinction hypothesis if an independent reviewer can produce three full day assignments directly without treating an option list as an assigned day; if current parent/query evidence consistently uses `three days` to include arrival; if a small distinction would displace more useful trip-length evidence; or if real behavior/user evidence shows the current soft-arrival framing is preferred and understood. Any implementation requires a separate selected action, exact wording/source review, task-improvement measurement, and normal release gates.
