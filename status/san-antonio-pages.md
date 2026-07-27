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
| Main things-to-do hub | https://familytripwise.com/things-to-do/san-antonio-with-kids.html | Exact measured phrases: 5,400, 1,600, and 880/month; variants overlap | Avg position 64.36; 11 impressions | Top 20 first, then Top 10 | `things to do in san antonio with kids`; `things to do with kids in san antonio`; `san antonio things to do with kids` | Released and production-verified 13-choice guide at commit `27168d5`; Pages run `30207559125`. | `FT-RES-010` covers SERPs, competitors, personas, and every section. `SRR-028` reviews 23 candidates, retains 13, traces `SA-P1` through `SA-P5`, and records current direct sources and claim boundaries. Pasteur cycle two returned `PASS` with no P0-P3. | No current blocker; observe discovery without claiming causation from sparse early GSC evidence. | Keep; the stay-area guide is the active page improvement. |
| Teen activities | https://familytripwise.com/things-to-do/san-antonio-with-teens.html | Exact measured phrases: 140 and 70/month; variants overlap | Avg position 9.00; 3 impressions | Top 20, then test Top 10 stability | `things to do in san antonio with teens`; `san antonio with teens`; `san antonio with teenagers` | Canonical/indexable existing specialist; no observation protection. | `FT-RES-010` finds a distinct older-kid job and applies `SA-P4`, plus mixed-age needs from `SA-P1`/`SA-P3`; every section is audited. | Three impressions are too sparse to call it a stable top-10 result. Page remains narrow, repetitive, and under-sourced. | Keep; run a dedicated candidate/source/every-section review after the stay-area action. |
| Stay areas / base | https://familytripwise.com/where-to-stay/san-antonio-with-kids.html | Generic exact phrases: 590 and 140/month; family-specific variants 10-20; intents overlap and include relocation noise | Avg position 80.14; 85 impressions | Top 20 | `where to stay in san antonio`; `best area to stay in san antonio`; `where to stay in san antonio with family` | Review-clean `FT-IMP-019` on the existing canonical/indexable URL; exact-path release pending. | `SRR-030` refreshes query-level result types, ranking-page opportunities, all five personas, nine candidate bases, every visible section, material claim boundaries, and 13 current sources. Raman returned final `PASS` in cycle three with no P0-P3. | No content/review blocker. Exact-path commit/push, Pages success, and production verification remain. | Release the five starts, seven-field matrix, three checks, cluster routes, sticky mobile area identity, and hotel handoff. |
| Family itinerary | https://familytripwise.com/family-itinerary/san-antonio-with-kids.html | Generic exact phrase 260/month; 3-day 40/month; exact family itinerary seeds displayed 0 | Avg position 27.17; 6 impressions | Top 20 if discovery develops | `san antonio itinerary`; `san antonio 3 day itinerary`; `san antonio itinerary with kids` | Canonical/indexable existing sequencing page; no observation protection. | `FT-RES-010` reviews duration/age itinerary results, all five personas, and every section. Verdict: keep one duration-flexible itinerary page. | Current page is abstract and repetitive; it needs executable day shapes, deletions, resets, and stronger current sources. | Keep; improve after activity, hotel, and stay decisions are stronger. |
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
3. Active: simplify the existing stay-area guide under `FT-IMP-019` and route named-property decisions to the hotel page.
4. Then: review and improve the existing teen specialist.
5. Then: rebuild the existing itinerary as concrete one-, two-, and three-day sequencing support.

No San Antonio page is protected by an active observation window. Early GSC evidence is too sparse for causal evaluation, so useful separately authorized improvements need not wait for an artificial hold. `FT-IMP-019` is the only active San Antonio transaction.
