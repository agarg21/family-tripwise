# New York City Page Status

Last updated: 2026-07-26

Sources:

- Current public-safe GSC snapshot: `ops/gsc-snapshots/2026-07-26.md`
- NYC decision pack: `docs/research/new-york-city-family-cluster-decision-pack.md`
- Reusable workflow: `docs/plan/incremental-city-cluster-playbook.md`
- Current roadmap: `ops/seo-roadmap.md`

Demand estimates are directional US monthly search volumes from the logged-in Semrush Chrome research collected July 24, 2026. Closely related variants overlap and must not be summed as unique traffic. GSC rank is page-level average position for the 28-day snapshot finalized through July 24, not a query-specific rank.

## Pages

| Page | Full URL | Est. search demand/mo | Current GSC rank | Target rank | 2-3 top search queries | Current status | Review coverage | Remaining / blocker | Next action |
|---|---|---:|---|---|---|---|---|---|---|
| Main things-to-do hub | https://familytripwise.com/things-to-do/new-york-city-with-kids.html | Exact measured phrases: 480, 390, and 320/month; variants overlap | Avg position 43.64; 58 impressions | Top 20 first, then Top 10 | `things to do in New York City with kids`; `things to do with kids in New York City`; `fun things to do in New York City with kids` | Indexed; `FT-IMP-014` released and production-verified at commit `1437affd20914a7bf3fbdc5ae0097371d3fb96c1` through Pages run `30172548240`. | Cluster, competition, NYC-P1 through NYC-P5, every prior section, 18 candidates, official claim sources, optimized media, and responsive behavior reviewed under `FT-RES-009` and `SRR-022`; final review `PASS_WITH_P3` with no P0-P2 findings. | No release blocker. Sparse GSC evidence remains directional. | Observe crawl and query-cluster discovery without blocking the next separately authorized NYC page. |
| Family hotel comparison | https://familytripwise.com/where-to-stay/new-york-city-family-hotels.html | Exact measured phrases: 390, 390, and 260/month; variants overlap | N/A: no post-release GSC page row yet | Top 20 first, then Top 10 | `best family hotels in New York City`; `best hotels in NYC for families`; `family friendly hotels New York City` | Released and production-verified at commit `57d765f4fb488b5f8f077a6cddc9023901b3b4bf` through Pages run `30184040925`. | Hotel SERP, competitor types, NYC-P1/P2/P4/P5, page boundary, and evidence requirements reviewed under `FT-RES-009`; `SRR-023` reviewed 22 candidate properties and retained 12 with official facts, broad prices, bounded review observations, conflicts, freshness, and decisive checks. Kepler returned `PASS_WITH_P3` in cycle 2 with no P0-P2 findings. | No release blocker. Post-release GSC evidence is not available yet. | Observe discovery and query fit without starting another action from this reconciliation. |
| Teen/tween activities | https://familytripwise.com/things-to-do/new-york-city-with-teens.html | Exact measured phrases: 590, 480, and 170/month; variants overlap | N/A: no post-release GSC page row yet | Top 20 first, then Top 10 | `things to do in NYC with teens`; `things to do with teens in NYC`; `best things to do with teens in NYC` | Released and production-verified at commit `77e6cb9322da34ffc13daf84b0851e83773cc382` through Pages run `30198727075`. | `SRR-024` reviewed the distinct SERP, representative competitors/community, NYC-P4, 20 candidate roles, current primary sources, claim boundaries, mixed-age support, every planned section, responsive behavior, and acceptance/measurement. Curie returned `PASS_WITH_P3` in cycle 2 with no P0-P2 findings. | No release blocker. One non-blocking P3 notes the generic but licensed/optimized Central Park hero. | Observe discovery and query fit without blocking the next separately authorized NYC page. |
| Stay areas / base | https://familytripwise.com/where-to-stay/new-york-city-with-kids.html | 30 exact kids variant; 70 `with a family` variant | Avg position 50.48; 54 impressions | Top 20 | `where to stay in New York City with kids`; `where to stay in NYC with a family`; `best area to stay in NYC for families` | Released and production-verified at commit `cd10933489ddf8e6c37780e5c0f20dfa740d60c2` through Pages run `30199465923`; the existing URL remains separate from hotels. | `SRR-025` refreshed current SERPs, ranking-page usefulness, all five personas, qualitative parent constraints, current primary sources, every visible section, and the area/hotel boundary. Maxwell returned `PASS` in cycle 2 with no P0-P3 findings. | No release blocker. Full tests pass 101/101; local and production SEO QA report 0 errors/0 warnings; production invariants passed. | Observe crawl and query fit without blocking the active itinerary transaction. |
| Family itinerary | https://familytripwise.com/family-itinerary/new-york-city-with-kids.html | Exact measured phrases: 30 and 10/month; variants overlap | No page row; URL not indexed in the July 26 snapshot | Top 20 if discovery develops | `New York City with kids itinerary`; `New York City itinerary with kids`; `3 days in New York City with kids` | `FT-IMP-017` is review-clean and release-pending on the existing canonical/indexable URL; it remains in the sitemap. | `SRR-026` refreshed current itinerary SERPs, ranking pages, all five personas, qualitative parent constraints, current official sources, and every visible section. Lagrange returned `PASS_WITH_P3` in cycle 1 with no P0-P2 findings. | Exact-path release and production verification remain. Do not request indexing. | Release and production-verify this one page. |

## Cluster Decisions

| Query family | Page decision |
|---|---|
| Broad family activities / NYC with kids | Existing all-ages hub; released and production-verified. |
| Teens/tweens | One standalone specialist; released and production-verified. |
| Toddlers/preschoolers | All-ages route/filter first; no separate URL now. |
| Free/budget | Strong all-ages module first; no separate URL now. |
| Indoor/rain/winter | All-ages and itinerary pivots; no separate URL. |
| Weekend/today events | Deferred until a current-content workflow exists. |
| Where to stay / best area | Existing area/base page; `FT-IMP-016` released and production-verified on the same URL. |
| Best/family-friendly/kid-friendly hotels, suites, family of five, pools | One released named-property hotel page with fields, not variant URLs. |
| Itinerary / 1-3 days | Existing sequencing support page. |
| Subway/stroller/no car/nap | Cross-page decision fields, not standalone URLs. |

## Ordered NYC Work

1. Completed: improve the existing all-ages things-to-do hub.
2. Completed: research and publish one family-hotel comparison.
3. Completed: research and publish one teen/tween specialist.
4. Completed: simplify the existing stay-area guide and route named hotels.
5. Active: simplify the existing itinerary into concrete day plans.

No NYC page is protected by an active observation window. Early GSC evidence is too sparse for causal evaluation, so useful reviewed improvements may proceed one page at a time without artificial waiting.
