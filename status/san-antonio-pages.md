# San Antonio Page Status

Last updated: 2026-07-26

Sources:

- Current public-safe GSC snapshot: `ops/gsc-snapshots/2026-07-26.md`
- San Antonio decision pack: `docs/research/san-antonio-family-cluster-decision-pack.md`
- Reusable workflow: `docs/plan/incremental-city-cluster-playbook.md`
- Current roadmap: `ops/seo-roadmap.md`

Demand estimates are directional US monthly search volumes from the logged-in Semrush Chrome research collected July 26, 2026. Closely related variants overlap and must not be summed as unique traffic. GSC rank is page-level average position for the 28-day snapshot finalized through July 24, not a query-specific rank.

## Pages

| Page | Full URL | Est. search demand/mo | Current GSC rank | Target rank | 2-3 top search queries | Current status | Latest persona / competition review | Remaining / blocker | Next action |
|---|---|---|---|---|---|---|---|---|---|
| Main things-to-do hub | https://familytripwise.com/things-to-do/san-antonio-with-kids.html | Exact measured phrases: 5,400, 1,600, and 880/month; variants overlap | Avg position 64.36; 11 impressions | Top 20 first, then Top 10 | `things to do in san antonio with kids`; `things to do with kids in san antonio`; `san antonio things to do with kids` | Released and production-verified 13-choice guide at commit `27168d5`; Pages run `30207559125`. | `FT-RES-010` covers SERPs, competitors, personas, and every section. `SRR-028` reviews 23 candidates, retains 13, traces `SA-P1` through `SA-P5`, and records current direct sources and claim boundaries. Pasteur cycle two returned `PASS` with no P0-P3. | No current blocker; observe discovery without claiming causation from sparse early GSC evidence. | Keep; hotel publication is the next active page. |
| Teen activities | https://familytripwise.com/things-to-do/san-antonio-with-teens.html | Exact measured phrases: 140 and 70/month; variants overlap | Avg position 9.00; 3 impressions | Top 20, then test Top 10 stability | `things to do in san antonio with teens`; `san antonio with teens`; `san antonio with teenagers` | Canonical/indexable existing specialist; no observation protection. | `FT-RES-010` finds a distinct older-kid job and applies `SA-P4`, plus mixed-age needs from `SA-P1`/`SA-P3`; every section is audited. | Three impressions are too sparse to call it a stable top-10 result. Page remains narrow, repetitive, and under-sourced. | Keep; run a dedicated candidate/source/every-section review after the promoted all-ages work. |
| Stay areas / base | https://familytripwise.com/where-to-stay/san-antonio-with-kids.html | Generic exact phrases: 590 and 140/month; family-specific variants 10-20; intents overlap and include relocation noise | Avg position 80.14; 85 impressions | Top 20 | `where to stay in san antonio`; `best area to stay in san antonio`; `where to stay in san antonio with family` | Canonical/indexable existing area page; no observation protection. | `FT-RES-010` reviews area/hotel SERP boundaries, `SA-P1` through `SA-P3`, and every section. Verdict: keep the five-area job separate from named hotels. | Needs sharper visitor framing, current area/transit sources, fewer universal defaults, and a route to a future hotel page. | Keep; improve after named-hotel research defines the handoff. |
| Family itinerary | https://familytripwise.com/family-itinerary/san-antonio-with-kids.html | Generic exact phrase 260/month; 3-day 40/month; exact family itinerary seeds displayed 0 | Avg position 27.17; 6 impressions | Top 20 if discovery develops | `san antonio itinerary`; `san antonio 3 day itinerary`; `san antonio itinerary with kids` | Canonical/indexable existing sequencing page; no observation protection. | `FT-RES-010` reviews duration/age itinerary results, all five personas, and every section. Verdict: keep one duration-flexible itinerary page. | Current page is abstract and repetitive; it needs executable day shapes, deletions, resets, and stronger current sources. | Keep; improve after activity, hotel, and stay decisions are stronger. |
| Family hotel comparison | Review-clean, release pending: https://familytripwise.com/where-to-stay/san-antonio-family-hotels.html | Exact measured phrases: 170, 140, and 110/month; resort/lazy-river variants add distinct wording but overlap | N/A: URL does not exist in production yet | Top 20 first, then Top 10 | `family friendly hotels in san antonio`; `best family hotels in san antonio`; `san antonio resorts for families` | `FT-PUB-005` is locally complete: 22 candidates reviewed, 12 retained, six trip-style starts, one sticky comparison, 12 expandable profiles, 24 map links, and three FAQs. | Durable evidence records official facts, rough total-night ranges, exact price sources, recent online-review samples, family-context limits, conflicts, exact Home2 identity, Wild Oak vacation-club context, and sourced checks for 10 deferrals. Averroes returned `PASS`; Dirac returned `PASS_WITH_P3`, with no P0-P2. | Final QA, commit/push, Pages deployment, and production verification remain. | Release the exact review-clean paths; keep all hotel/resort variants on this one page. |

## Cluster Decisions

| Query family | Page decision |
|---|---|
| Broad family activities / San Antonio with kids | Existing all-ages hub; improve first. |
| Teens/tweens and mixed-age older-child choices | Keep one standalone specialist. |
| Toddlers/young children | All-ages route/filter first; no separate URL now. |
| Free/budget | Strong all-ages module first; preserve as a future split candidate only if later evidence supports it. |
| Indoor/rain/heat | All-ages filters and itinerary pivots; no separate URL. |
| Weekend/today events | Deferred until a current-content workflow exists. |
| Where to stay / best area | Existing area/base page; keep separate from named hotels. |
| Best/family-friendly/kid-friendly hotels and resorts | One future named-property page after an evidence pack. |
| Lazy river, pool, water slide, free breakfast, suites | Hotel comparison fields and trip-style starts, not separate URLs. |
| Itinerary / 1-3 days | Existing sequencing page; no duration URLs. |
| Stroller/car/nap/parking | Cross-page decision fields and exact-current checks. |

## Ordered San Antonio Work

1. Completed: release and production-verify the review-clean `FT-IMP-018` all-ages hub.
2. Active: complete independent review and release verification for the locally built `FT-PUB-005` family-hotel comparison.
3. Then: simplify the existing stay-area guide and route named-property decisions to the hotel page.
4. Then: review and improve the existing teen specialist.
5. Then: rebuild the existing itinerary as concrete one-, two-, and three-day sequencing support.

No San Antonio page is protected by an active observation window. Early GSC evidence is too sparse for causal evaluation, so useful separately authorized improvements need not wait for an artificial hold. `FT-PUB-005` is the only active San Antonio transaction.
