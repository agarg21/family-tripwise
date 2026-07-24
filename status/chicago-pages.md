# Chicago Page Status

Last updated: 2026-07-23

Sources:

- Latest public-safe GSC snapshot: `ops/gsc-snapshots/2026-07-23.md`
- Chicago decision pack: `docs/research/chicago-family-cluster-decision-pack.md`
- Reusable workflow: `docs/plan/incremental-city-cluster-playbook.md`
- Current roadmap: `ops/seo-roadmap.md`

Demand estimates are directional US monthly search volumes from the logged-in Semrush Chrome research collected July 23, 2026. Closely related variants overlap and must not be summed as unique traffic. GSC rank is page-level average position for the latest 28-day window finalized through July 21, not a query-specific rank.

## Pages

| Page | Full URL | Est. search demand/mo | Current GSC rank | Target rank | 2-3 top search queries | Current status | Review coverage | Remaining / blocker | Next action |
|---|---|---:|---|---|---|---|---|---|---|
| Main things-to-do hub | https://familytripwise.com/things-to-do/chicago-with-kids.html | 5,400 core exact; many overlapping broad variants | Avg position 58.88; 52 impressions | Top 20 first, then Top 10 | `things to do in Chicago with kids`; `Chicago with kids`; `best things to do in Chicago with kids` | Review-clean and eligible for release. The production page remains the narrower prior version until deployment. | Cluster, competition, CHI-P1 through CHI-P5, every visible section, 18 candidates, current official sources, claims, repetition, filter behavior, and responsive behavior reviewed under `FT-RES-008` and `FT-IMP-010`; final independent verdict `PASS`. | Commit/push, Pages success, and production verification remain. | Release `FT-IMP-010`; then start the approved family-hotel evidence transaction. |
| Teen activities | https://familytripwise.com/things-to-do/chicago-with-teens.html | 720 core exact; 110 teenager variant | No page row in latest snapshot | Top 20, then Top 10 | `things to do in Chicago with teens`; `things to do in Chicago with teenagers`; `Chicago with teens` | Live; distinct intent, but only three primary cards and substantial repetition. | Cluster, competition, CHI-P4, and every visible section reviewed under `FT-RES-008`. | Needs a wider teen-specific candidate review and page-specific sources. | Keep standalone; improve after all-ages and hotel work. |
| Stay areas / base | https://familytripwise.com/where-to-stay/chicago-with-kids.html | 110 exact; 70 neighborhood variant | Avg position 60.11; 38 impressions | Top 20 | `where to stay in Chicago with kids`; `best area to stay in Chicago with kids`; `family friendly neighborhoods Chicago` | Live, indexed; correct area-first role but verbose and partially blended with hotel checks. | Cluster, competition, CHI-P1/P2/P5, and every visible section reviewed under `FT-RES-008`. | Simplify after the named-hotel page exists; current sources do not support area/transit claims well. | Keep as areas only; later route named-property decisions to hotel page. |
| Family itinerary | https://familytripwise.com/family-itinerary/chicago-with-kids.html | 20 exact itinerary; 20 three-day variant | Avg position 20.75; 12 impressions | Top 20, then Top 10 if demand appears | `Chicago itinerary with kids`; `3 days in Chicago with kids`; `Chicago family itinerary` | Live; promising position on tiny sample, but abstract and repetitive. | Cluster, competition, all five personas, and every visible section reviewed under `FT-RES-008`. | Needs concrete day-by-day plans and stop rules; no protected query evidence. | Keep; later reuse the Las Vegas itinerary simplification pattern. |
| Family hotel comparison | https://familytripwise.com/where-to-stay/chicago-family-hotels.html | 320 best-hotels variant; 260 family-friendly; 210 kid-friendly; variants overlap | N/A: proposed URL | Top 20 first, then Top 10 | `best hotels in Chicago for families`; `family friendly hotels in Chicago`; `kid friendly hotels Chicago` | Approved cluster page, not yet built. | Hotel SERP, competitor, community, persona, and page-boundary decision complete under `FT-RES-008`. | Requires a durable hotel evidence pack with official facts, rough total-night ranges, and recent family-review themes/conflicts. | Second Chicago implementation after `FT-IMP-010`; publish one hotel URL only. |

## Cluster Decisions

| Query family | Page decision |
|---|---|
| Broad family activities / family vacation | Existing all-ages hub; next implementation. |
| Teens/tweens | Existing standalone teen page. |
| Toddlers/preschoolers | All-ages filter/module first. |
| Free/budget | Strong all-ages module first; no separate URL now. |
| Indoor/rain/winter | All-ages and itinerary modules; current official checks. |
| Weekend/today events | No static page until a current-content workflow exists. |
| Where to stay / best area | Existing area/base page. |
| Family-friendly / kid-friendly hotels, downtown, pools, suites, near attractions | One future named-property hotel page. |
| Itinerary / three days | Existing sequencing support page. |
| Stroller/no car/nap | Cross-page decision fields, not standalone URLs. |

## Ordered Chicago Work

1. Finish review and release of the all-ages things-to-do hub under `FT-IMP-010`.
2. Research and publish one family-hotel comparison through the hotel evidence engine.
3. Simplify the area/base stay page and add the hotel handoff.
4. Improve the teen specialist.
5. Simplify the itinerary into concrete day-by-day plans.

No page is protected by an active Chicago observation window. Early GSC evidence remains too sparse for causal evaluation, so improvements should be driven by current usefulness, SERP fit, and trust rather than artificial waiting.
