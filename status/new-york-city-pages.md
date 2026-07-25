# New York City Page Status

Last updated: 2026-07-25

Sources:

- Current public-safe GSC snapshot: `ops/gsc-snapshots/2026-07-25.md`
- NYC decision pack: `docs/research/new-york-city-family-cluster-decision-pack.md`
- Reusable workflow: `docs/plan/incremental-city-cluster-playbook.md`
- Current roadmap: `ops/seo-roadmap.md`

Demand estimates are directional US monthly search volumes from the logged-in Semrush Chrome research collected July 24, 2026. Closely related variants overlap and must not be summed as unique traffic. GSC rank is page-level average position for the 28-day snapshot finalized through July 23, not a query-specific rank.

## Pages

| Page | Full URL | Est. search demand/mo | Current GSC rank | Target rank | 2-3 top search queries | Current status | Review coverage | Remaining / blocker | Next action |
|---|---|---:|---|---|---|---|---|---|---|
| Main things-to-do hub | https://familytripwise.com/things-to-do/new-york-city-with-kids.html | Exact measured phrases: 480, 390, and 320/month; variants overlap | Avg position 43.32; 56 impressions | Top 20 first, then Top 10 | `things to do in New York City with kids`; `things to do with kids in New York City`; `fun things to do in New York City with kids` | Indexed; `FT-IMP-014` is implemented, QA-green, and review-clean; release pending. | Cluster, competition, NYC-P1 through NYC-P5, every prior section, 18 candidates, official claim sources, optimized media, and responsive behavior reviewed under `FT-RES-009` and `SRR-022`. | Commit, deployment, and production verification remain. | Finish the `FT-IMP-014` release gate. |
| Family hotel comparison | https://familytripwise.com/where-to-stay/new-york-city-family-hotels.html | Exact measured phrases: 390, 390, and 260/month; variants overlap | N/A: proposed URL | Top 20 first, then Top 10 | `best family hotels in New York City`; `best hotels in NYC for families`; `family friendly hotels New York City` | Proposed by review-clean `FT-RES-009`; not built. | Hotel SERP, competitor types, NYC-P5, page boundary, and evidence requirements reviewed under `FT-RES-009`. | Needs a durable candidate, official-fact, rough-total-price, sampled-family-review/conflict, freshness, and unknown record before publication. | Second NYC implementation after the all-ages page. |
| Teen/tween activities | https://familytripwise.com/things-to-do/new-york-city-with-teens.html | Exact measured phrases: 590, 480, and 170/month; variants overlap | N/A: proposed URL | Top 20 first, then Top 10 | `things to do in NYC with teens`; `things to do with teens in NYC`; `best things to do with teens in NYC` | Proposed by review-clean `FT-RES-009`; not built. | Distinct SERP, current competitors/community, NYC-P4, page boundary, and acceptance needs reviewed under `FT-RES-009`. | Needs a teen-specific candidate/source/every-section design review. No more than one new indexable page per transaction. | Third NYC implementation. |
| Stay areas / base | https://familytripwise.com/where-to-stay/new-york-city-with-kids.html | 30 exact kids variant; 70 `with a family` variant | Avg position 49.73; 49 impressions | Top 20 | `where to stay in New York City with kids`; `where to stay in NYC with a family`; `best area to stay in NYC for families` | Indexed; keep separate from hotels. | Cluster, competition, NYC-P1/P2/P5, and every visible section reviewed under `FT-RES-009`. | Needs current area/transit sources and simplification. Current page includes 27 generic hotel-verification fields and unsupported universal defaults. | Fourth NYC implementation, after hotel and teen pages exist for routing. |
| Family itinerary | https://familytripwise.com/family-itinerary/new-york-city-with-kids.html | Exact measured phrases: 30 and 10/month; variants overlap | No page row; URL unknown to Google | Top 20 if discovery develops | `New York City with kids itinerary`; `New York City itinerary with kids`; `3 days in New York City with kids` | Live and in sitemap, but not indexed in the July 24 inspection. | Cluster, competition/community, all five personas, and every visible section reviewed under `FT-RES-009`. | Needs concrete day plans, stop rules, specialist routing, and current route-anchor sources. Do not request indexing. | Fifth NYC implementation. |

## Cluster Decisions

| Query family | Page decision |
|---|---|
| Broad family activities / NYC with kids | Existing all-ages hub; first implementation. |
| Teens/tweens | One future standalone specialist. |
| Toddlers/preschoolers | All-ages route/filter first; no separate URL now. |
| Free/budget | Strong all-ages module first; no separate URL now. |
| Indoor/rain/winter | All-ages and itinerary pivots; no separate URL. |
| Weekend/today events | Deferred until a current-content workflow exists. |
| Where to stay / best area | Existing area/base page. |
| Best/family-friendly/kid-friendly hotels, suites, family of five, pools | One future named-property hotel page with fields, not variant URLs. |
| Itinerary / 1-3 days | Existing sequencing support page. |
| Subway/stroller/no car/nap | Cross-page decision fields, not standalone URLs. |

## Ordered NYC Work

1. Improve the existing all-ages things-to-do hub.
2. Research and publish one family-hotel comparison.
3. Research and publish one teen/tween specialist.
4. Simplify the existing stay-area guide and route named hotels.
5. Simplify the existing itinerary into concrete day plans.

No NYC page is protected by an active observation window. Early GSC evidence is too sparse for causal evaluation, so useful reviewed improvements may proceed one page at a time without artificial waiting.
