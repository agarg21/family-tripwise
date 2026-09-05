# San Antonio Page Status

Last updated: 2026-09-05

Sources:

- Current public-safe GSC snapshot: `ops/gsc-snapshots/2026-09-04.md`
- San Antonio decision pack: `docs/research/san-antonio-family-cluster-decision-pack.md`
- Reusable workflow: `docs/plan/incremental-city-cluster-playbook.md`
- Current roadmap: `ops/seo-roadmap.md`

Demand estimates are directional US monthly search volumes from the logged-in Semrush Chrome research collected July 26, 2026. Closely related variants overlap and must not be summed as unique traffic. Decision-baseline GSC position is page-level average position for the 28-day snapshot finalized through July 24, not a query-specific rank.

## September 5 Official-Fact Refresh Overlay

`FT-MAINT-004` / `SRR-053` / `IMP-050` audits all 12 family-hotel records after the July 26 official-fact layer passed its 30-day refresh interval. Current first-party sources preserve all 12 hotel roles. The bounded implementation separates the September 5 fact recheck from unchanged July 26 price/review evidence, exposes JW Marriott's current limit of five River Bluff entry wristbands per room, removes Hyatt Regency Riverwalk's no-longer-published temperature-control qualifier, represents Marriott Rivercenter's first-party indoor-versus-indoor/outdoor pool-label conflict, and replaces redirected La Cantera sources with current Hilton pages.

This is factual freshness maintenance, not a hotel-set, price, review, URL, ranking, or CTR experiment. Recent reused September 4 GSC is finalized through September 2 and has no public aligned query cohort; the page's 3 impressions at page-average position 6.33 remain orientation only. Focused 4/4 and full 162/162 tests plus state, freshness, SEO, snapshot, preflight, generation, strict-JSON, scope, invariant and responsive checks pass. Laplace cycle one found one P2 stale Marriott pool check in the evidence pack; cycle two verified the correction and returned `PASS` with no P0-P3. Release is pending.

## September 4 Learning Overlay

Release evidence: docs-only `FT-RES-031` action commit `b49a533`; no Pages wait applies.

`FT-RES-031` / `SRR-052` applies the morning task model to the live cluster at exact 1280 by 900, 390 by 844 and 320 by 800 viewports. Both the mixed-generation open-base case and fixed River Walk/no-car control can recover all seven planning outputs. The five page roles remain coherent, all tested documents have zero horizontal overflow, mobile comparison tables scroll inside bounded containers, and the control does not require a lodging detour.

The joined journey is `PARTIAL`. The activity guide's itinerary link is nearby, but after choosing a day shape the itinerary's explicit activity and stay links begin 8.9-9.5 mobile viewports down at 390 pixels and 10.4-11.1 at 320 pixels. The stay guide's semantically correct hotel handoff begins 7.0-8.0 mobile viewports down. Preserve all pages and retain only unselected `IMP-049`: after the itinerary day cards, `Need an anchor?` and `Still choosing lodging?` route only decisions that remain open. Focused 22/22 and full 162/162 tests plus state, freshness, local/production SEO, 53-snapshot, browser-route, exact-scope, JSON and whitespace checks pass. Ohm cycle one returned `FAIL` for three P2s and three P3s; cycle two verified all corrections and returned `PASS_WITH_P3` with no P0-P2. One pre-existing scroller-accessibility P3 remains. No page change is selected.

Fresh September 4 API evidence is finalized through September 2: 1,906 property impressions, 2 clicks, aggregate average position 65.48, and 24/28 inspected URLs indexed. All five San Antonio URLs are indexed. Their public rows are 108 impressions at page-average position 89.2 for all-ages activities, no teen performance row, 82 at 61.55 for stay areas, 3 at 6.33 for family hotels, and 21 at 27.9 for the itinerary. No aligned public query cohort exists, so this is crawl and orientation evidence rather than a task, ranking, CTR, or page-change trigger.

`FT-RES-030` / `SRR-051` reviews four public San Antonio family questions dated November 2025-August 2026 as qualitative evidence. The sample combines usable trip blocks, child/older-adult or teen interests, heat/indoor fallback, fixed versus open lodging, room function, and transport. It does not support more attractions, hotels, a modifier page, or a new URL.

The current five pages own the component decisions, but page-role coverage does not prove the joined journey works. Preserve all five pages and retain only one unselected later cross-page task: a two- or three-night mixed-generation party of five must reach a realistic day shape, one paid anchor, one free or indoor backup, a provisional base, a viable room setup, a transport hypothesis, and exact next checks through normal links. A fixed River Walk/no-car state is the control. No page change is selected by this research.

Recent reused September 3 API evidence is finalized through September 1. All five San Antonio URLs are indexed. The public rows are 105 impressions at page-average position 89.24 for all-ages activities, 1 at 43.0 for teens, 80 at 67.17 for stay areas, 3 at 6.33 for family hotels, and 21 at 27.62 for the itinerary. The snapshot has no aligned public query cohort, so these values are orientation rather than rank, CTR, demand, or page-change evidence.

Focused San Antonio tests pass 22/22 and the full suite passes 162/162. State, freshness, local/production SEO, all 52 public snapshots, strict JSON, exact scope, source/privacy, and whitespace checks pass. Independent reviewer `01a06bac-0529-7de3-abcb-bca4477cabb2` verified the four dates, page-role mapping, GSC limits, and proportional preserve decision. Cycle one found one P3 roadmap-summary precision issue; cycle two confirmed the fix but returned `FAIL` for a premature verdict record. Cycle three verified the chronology correction and returned `PASS` with no P0-P3.

## July 28 Monitoring Overlay

Fresh read-only URL Inspection reports the all-ages, teen, stay-area, and itinerary pages indexed; the family-hotel URL is discovered but not indexed. Performance finalized through July 26 shows page rows for all four indexed planning pages, led by 89 impressions for stay areas. These are page-level discovery signals, not query ranks or causal results.

## Pages

| Page | Full URL | Est. search demand/mo | Decision-baseline GSC position | Target rank | 2-3 top search queries | Current status | Latest persona / competition review | Remaining / blocker | Next action |
|---|---|---|---|---|---|---|---|---|---|
| Main things-to-do hub | https://familytripwise.com/things-to-do/san-antonio-with-kids.html | Exact measured phrases: 5,400, 1,600, and 880/month; variants overlap | Avg position 64.36; 11 impressions | Top 20 first, then Top 10 | `things to do in san antonio with kids`; `things to do with kids in san antonio`; `san antonio things to do with kids` | Released and production-verified 13-choice guide at commit `27168d5`; Pages run `30207559125`. | `FT-RES-010` covers SERPs, competitors, personas, and every section. `SRR-028` reviews 23 candidates, retains 13, traces `SA-P1` through `SA-P5`, and records current direct sources and claim boundaries. Pasteur cycle two returned `PASS` with no P0-P3. | No current blocker; observe discovery without claiming causation from sparse early GSC evidence. | Keep and measure natural discovery. |
| Teen activities | https://familytripwise.com/things-to-do/san-antonio-with-teens.html | Exact measured phrases: 140 and 70/month; variants overlap | Avg position 9.00; 3 impressions | Top 20, then test Top 10 stability | `things to do in san antonio with teens`; `san antonio with teens`; `san antonio with teenagers` | Released and production-verified at commit `e071a60`; Pages run `30236032473`. | `SRR-031` maps query-level result types to representative URLs, covers primary teen and mixed-age personas, reviews 18 candidates and every visible section, and records claim boundaries plus 22 current sources. Franklin returned cycle-two `PASS` with no P0-P3 findings. | Three impressions are too sparse to call it a stable top-10 result; observe discovery without claiming causation. | Keep the compact 10-choice specialist. |
| Stay areas / base | https://familytripwise.com/where-to-stay/san-antonio-with-kids.html | Generic exact phrases: 590 and 140/month; family-specific variants 10-20; intents overlap and include relocation noise | Avg position 80.14; 85 impressions | Top 20 | `where to stay in san antonio`; `best area to stay in san antonio`; `where to stay in san antonio with family` | Released and production-verified at commit `7f54f23`; Pages run `30234700209`. | `SRR-030` refreshes query-level result types, ranking-page opportunities, all five personas, nine candidate bases, every visible section, material claim boundaries, and 13 current sources. Raman returned final `PASS` in cycle three with no P0-P3. | No current blocker; observe discovery without treating sparse early evidence as causal. | Keep; route named-property decisions to the released hotel guide. |
| Family itinerary | https://familytripwise.com/family-itinerary/san-antonio-with-kids.html | Generic exact phrase 260/month; 3-day 40/month; exact family itinerary seeds displayed 0 | Avg position 27.17; 6 impressions | Top 20 if discovery develops | `san antonio itinerary`; `san antonio 3 day itinerary`; `san antonio itinerary with kids` | Released and production-verified at commit `90ed019`; Pages run `30237864556`. | `SRR-032` maps four current result types to exact representative URLs, compares six ranking/community page types, applies all five personas, audits every section, and records claim boundaries plus 17 current sources. Einstein returned final `PASS_WITH_P3` with no P0-P2 findings. | Six impressions are too sparse for a stable query-rank conclusion; observe discovery without claiming causation. | Keep the compact sequencing product. |
| Family hotel comparison | https://familytripwise.com/where-to-stay/san-antonio-family-hotels.html | Exact measured phrases: 170, 140, and 110/month; resort/lazy-river variants add distinct wording but overlap | N/A in July 26 snapshot because URL was not yet published | Top 20 first, then Top 10 | `family friendly hotels in san antonio`; `best family hotels in san antonio`; `san antonio resorts for families` | Released and production-verified at commit `4617ec82`; Pages run `30226920951`. | Twenty-two candidates reviewed, 12 retained; official facts, rough totals, exact price sources, recent online-review samples, conflicts, and 10 deferrals are durable. Averroes `PASS`; Dirac `PASS_WITH_P3`; no P0-P2. | No current blocker; await future crawl/discovery evidence without calling the pre-publication GSC row a rank. | Keep one page for hotel/resort/lazy-river/pool/room variants and route area decisions from the stay guide. |

## Cluster Decisions

| Query family | Page decision |
|---|---|
| Broad family activities / San Antonio with kids | Released 13-choice all-ages hub; keep as the cluster acquisition and activity decision page. |
| Teens/tweens and mixed-age older-child choices | Keep one standalone specialist. |
| Toddlers/young children | All-ages route/filter first; no separate URL now. |
| Free/budget | Strong all-ages module first; preserve as a future split candidate only if later evidence supports it. |
| Indoor/rain/heat | All-ages filters and itinerary pivots; no separate URL. |
| Weekend/today events | Deferred until a current-content workflow exists. |
| Where to stay / best area | Existing area/base page; keep separate from named hotels. |
| Best/family-friendly/kid-friendly hotels and resorts | Released 12-property hotel comparison; keep named-property intent separate from stay areas. |
| Lazy river, pool, water slide, free breakfast, suites | Hotel comparison fields and trip-style starts, not separate URLs. |
| Itinerary / 1-3 days | Existing sequencing page; no duration URLs. |
| Stroller/car/nap/parking | Cross-page decision fields and exact-current checks. |

## Ordered San Antonio Work

1. Completed: release and production-verify the review-clean `FT-IMP-018` all-ages hub.
2. Completed: release and production-verify `FT-PUB-005` at commit `4617ec82` through Pages run `30226920951`.
3. Completed: simplify and release the existing stay-area guide under `FT-IMP-019`.
4. Completed: improve and release the existing teen specialist under `FT-IMP-020` at commit `e071a60` through Pages run `30236032473`.
5. Completed: improve and release the existing itinerary as concrete one-, two-, and three-day sequencing support under `FT-IMP-021` at commit `90ed019` through Pages run `30237864556`.

All five planned San Antonio pages are released and production-verified. No San Antonio page is protected by an active observation window, and no San Antonio implementation is currently active. Early GSC evidence is too sparse for causal evaluation; the next step is natural crawl and discovery observation, not a manufactured cadence action.
