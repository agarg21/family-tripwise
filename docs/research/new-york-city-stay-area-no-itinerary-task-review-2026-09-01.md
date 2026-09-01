# New York City Stay-Area No-Itinerary Task Review

Reviewed: 2026-09-01

Action: `FT-RES-026` / `SRR-047`

Target:

- https://familytripwise.com/where-to-stay/new-york-city-with-kids.html

Evidence level: `proxy-reviewed`. This is a reproducible task walkthrough of the live interface. It is not observation of parents, user testing, behavior-supported evidence, satisfaction evidence, or a search-ranking result.

## Decision

The no-drafted-itinerary case is `PARTIAL`; the first-two-days-known control is `YES`.

The live page exposes the right area tradeoffs and exact checks. It narrows an unordered Upper West Side, Midtown, and Lower Manhattan anchor set from five areas to three, but it cannot reduce that set to two or support a stable provisional choice until the family sequences the first two days. The page correctly owns area choice rather than itinerary construction. Its recovery route to the itinerary sibling is accurate and works, but it appears after the five-area matrix, three deeper notes, and the first three cluster cards.

Preserve the live page and URL now. Retain one bounded, unselected future hypothesis, `IMP-048`: surface one compact `build the first two days first` route beside the existing five-start decision. Reuse the current itinerary sibling and add no area, hotel, recommender, filter, section, URL, or claim. Any implementation requires a separate selected action.

## GSC Boundary

Fresh September 1 authenticated read-only API evidence is finalized through August 30. It records 1,913 property impressions, 3 clicks, aggregate average position 65.83, and 24 of 28 inspected URLs indexed. The target has 51 impressions at page-average position 44.33, is indexed, and was last crawled August 29.

All 50 public snapshots validate. The public snapshot contains no aligned query cohort, so GSC is orientation and a crawl boundary only. It does not establish a CTR problem, query rank, usefulness failure, user behavior, or edit eligibility. The explicit next falsification trigger from `FT-RES-025`, not the page average, selected this task.

## Family Cases

Both cases use only attributes that change the decision: a first New York City trip, four hotel nights, children around 5 and 10, one likely midday hotel return on the higher-fatigue days, and an unordered must-do set covering Central Park and AMNH, Times Square or Broadway, and a Lower Manhattan or ferry block. The family has not chosen a hotel.

### Case A: anchors known, first two days not sequenced

The family needs:

1. at most two plausible areas;
2. one provisional choice and one runner-up;
3. the decisive tradeoff and the itinerary ordering that could reverse the choice;
4. exact station, entrance, access, room, and complete-price checks; and
5. a route to named hotels after choosing the area.

### Case B: first two days known

This is the control. Day 1 is Central Park and AMNH with a protected midday return. Day 2 is a Midtown and Broadway day. The family needs the same five outputs.

## Evidence Inventory

| Evidence | Date | Class | Use | Limitation |
|---|---|---|---|---|
| Live NYC stay-area page | Inspected 2026-09-01; visible area and transport sources dated 2026-07-26 | Live page and interface evidence | Five starts, area matrix, uncertainty, exact checks, and cluster handoffs | Does not establish preference, satisfaction, behavior, or universal route fit |
| `FT-RES-025` live-SERP review | Collected 2026-09-01 | Current public search-result and ranking-page structure evidence | Page-role boundary and explicit no-itinerary falsification trigger | Not rank tracking, demand, or user evidence |
| September 1 GSC snapshot | Collected 2026-09-01; finalized through 2026-08-30 | Fresh authenticated API, public-safe | Index, crawl, and measurement boundary | No aligned public query cohort |
| July NYC task/persona research | Checked 2026-07-26 | Repository synthesis of current primary and qualitative community evidence | Younger-child reset, first-two-day, exact-access, and area/hotel constraints | Qualitative and research-based; not demographic truth or firsthand experience |
| Live internal routes | Checked 2026-09-01 | Navigation evidence | Named-hotel and itinerary recovery | Link success does not prove the sibling page completes every downstream task |

## Observable Page Route

The requested viewport sizes were reproduced exactly. Document width equaled viewport width in every run. On mobile, the seven-column comparison is a 1,080-pixel table inside an intentional horizontal-scroll container; it does not create document-level overflow.

| Viewport | Five starts | Matrix | Deeper checks | Cluster start | Hotel link | Itinerary link | Document overflow |
|---|---:|---:|---:|---:|---:|---:|---:|
| 1280 by 900 | 1,412px / 1.6 viewports | 2,180px / 2.4 | 3,339px / 3.7 | 3,990px / 4.4 | 4,229px / 4.7 | 4,469px / 5.0 | 0px |
| 390 by 844 | 1,509px / 1.8 viewports | 2,614px / 3.1 | 3,927px / 4.7 | 4,887px / 5.8 | 5,135px / 6.1 | 5,918px / 7.0 | 0px |
| 320 by 800 | 1,622px / 2.0 viewports | 2,974px / 3.7 | 4,336px / 5.4 | 5,491px / 6.9 | 5,764px / 7.2 | 6,524px / 8.2 | 0px |

The visible named-hotel link reached the live 12-property comparison. The visible itinerary link reached the live one-, two-, and three-day itinerary and returned normally. No broken navigation, overlap, or root overflow was found.

## Task Matrices

Viewport does not change whether the decision evidence exists, so the scores are stable across desktop and both mobile runs. Viewport depth and the mobile table interaction affect effort and are recorded separately above.

### Case A: anchors known, first two days not sequenced

| Step | Result | Observable evidence |
|---|---|---|
| Start | `PARTIAL` | The hero and five starts correctly say the first two days choose the base, but they do not expose a nearby route for a family that has not sequenced those days |
| Reduce | `PARTIAL` | The five starts reduce the page to Upper West Side, Midtown, and Downtown / Tribeca; the family cannot reach the required two without deciding which anchors lead the first two days |
| Compare | `YES` | All three candidates use the same matrix fields for simplification, reset, friction, anchors, and exact checks |
| Trace | `YES` | The page dates its area and transport research, labels area guidance as planning support, separates volatile unknowns, and links direct official checks; it uses no online-review or estimate claim in this area decision |
| Decide | `PARTIAL` | Upper West Side can be chosen only if the park and museum block leads the first two days; Midtown can replace it if the short classic-sight and Broadway route leads. The current inputs do not select which condition is true |
| Verify | `YES` | Exact hotel entrance, station, line, accessibility, live elevator, room exposure, room setup, route, and complete-price checks are visible |
| Recover | `PARTIAL` | The itinerary sibling directly performs the missing sequencing job and its link works, but the route appears after the matrix, deeper checks, hotel card, and both activity cards |

The page exposes a correct conditional choice but does not complete the required provisional choice without inventing the missing day order. Lower Manhattan remains a third plausible base until the upstream itinerary decision is made.

### Case B: first two days known

| Step | Result | Observable evidence |
|---|---|---|
| Start | `YES` | The first two quick starts immediately identify Upper West Side and Midtown |
| Reduce | `YES` | The matrix reduces the choice to Upper West Side plus Midtown; Downtown, Brooklyn, and Long Island City do not match the fixed first-two-day anchors |
| Compare | `YES` | Reset reality and main friction are comparable across the two remaining areas |
| Trace | `YES` | The same source date, planning-support label, exact unknowns, and official checks remain visible |
| Decide | `YES` | Upper West Side is the defensible provisional choice because the protected return is on the Central Park and AMNH day; Midtown is the runner-up |
| Verify | `YES` | The page names the exact entrance, route, accessibility, live service, room, and price checks that can reverse the area-level choice |
| Recover | `YES` | The named-hotel route follows the area comparison and reached the live 12-property page |

The provisional choice reverses if the first two days become Midtown-led, if the protected return moves to the Midtown day, or if the exact hotel entrance, room, access, and complete-price evidence favors Midtown.

## Friction And Trust Checks

- **Buried answer:** The conditional five-start decision begins 1.6 desktop viewports, 1.8 viewports at 390, and 2.0 viewports at 320. The itinerary recovery route begins about 5.0, 7.0, and 8.2 viewports down.
- **Unnecessary detour:** Case A must pass through the area matrix and most of the cluster before reaching the upstream itinerary job. Case B has no unnecessary cross-page detour for area choice.
- **Repetition or contradiction:** None found. Hero, starts, matrix, deeper checks, FAQ, and itinerary card consistently treat the first two days as the input that chooses the base.
- **Unsupported certainty:** None needed to complete the control. The page keeps area guidance conditional and requires exact current checks.
- **Missing comparison:** No area field is missing. The missing input is the order of the family's own anchors.
- **Evidence traceability:** The review date, planning-support boundary, direct MTA checks, area sources, and named-hotel evidence route are visible.
- **Unknown recovery:** Exact hotel and access unknowns are handled well. The no-itinerary recovery path is accurate but late.
- **Adversarial removal check:** Adding another area, hotel, score, or generic planning section would not repair Case A. One nearby route to the existing itinerary sibling is the smallest plausible change.

## Reusable Lesson

A decision surface that depends on an upstream input needs a nearby recovery route for readers who do not have that input yet. When the area rule is `choose from the first two days`, a family with unordered anchors does not need more area inventory; it needs to sequence the days before comparing bases. Route to that sibling job before asking the reader to reconcile the full matrix.

## Next Falsification

Reject `IMP-048` if an independent reviewer can reduce Case A to two areas and state a defensible provisional choice without inventing day order; if moving or duplicating the itinerary route obscures the more common first-two-days-known task; if current questions show the unordered-anchor state is not recurring; or if real behavior evidence shows the existing late route is found and used without material reconstruction. Any implementation requires a separate selected action, exact placement and wording review, pre/post task scoring, and the normal release gates.

## Privacy And Scope

This artifact contains no credentials, tokens, protected query rows, complete raw GSC export, usernames, personal data, copied source prose, or claimed firsthand experience. The action is limited to ten registered research/state paths. It changes no `site/**`, page, generator, test, URL, canonical, indexability, sitemap, schema, analytics, indexing request, external account, post, outreach, destination, or automation.

## Independent Review

Galileo (`01a05df6-6287-7613-9019-d325b985a804`) returned cycle-one `PASS` with no P0-P3. The independent read-only review confirmed the unordered case's `PARTIAL` score, the control's seven `YES` results, proportional unselected `IMP-048`, fresh GSC classification, evidence/privacy boundaries, exact ten-path/no-site scope, state mirrors, and green QA. It independently reproduced all three viewport sizes, contained mobile-table scrolling, zero document overflow, and successful named-hotel and itinerary navigation. Its 1-3px rendering differences do not change the rounded viewport-depth conclusions.

## QA

- Focused NYC stay-page tests pass 4/4.
- Full repository tests pass 162/162.
- Operator-state and content-freshness QA pass.
- Local SEO QA reports 0 errors and 0 warnings.
- Production SEO QA passed with 0 errors and 0 warnings after one clearly transient Las Vegas hotel-page `503` was retried once; the public preflight then returned 200 for all 28 configured URLs.
- All 50 public GSC snapshots validate; the September 1 snapshot is schema/privacy clean.
- Strict roadmap JSON contains 76 unique action IDs.
- Exact ten-path/no-site scope, credential/privacy scan, normal target/hotel/itinerary navigation, responsive containment, and `git diff --check` pass.
