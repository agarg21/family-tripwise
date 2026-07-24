# Chicago Page Status

Last updated: 2026-07-24

Sources:

- Implementation baseline GSC snapshot: `ops/gsc-snapshots/2026-07-23.md`
- Current public-safe GSC snapshot: `ops/gsc-snapshots/2026-07-24.md`
- Chicago decision pack: `docs/research/chicago-family-cluster-decision-pack.md`
- Reusable workflow: `docs/plan/incremental-city-cluster-playbook.md`
- Current roadmap: `ops/seo-roadmap.md`

Demand estimates are directional US monthly search volumes from the logged-in Semrush Chrome research collected July 23, 2026. Closely related variants overlap and must not be summed as unique traffic. Baseline GSC rank is page-level average position for the 28-day implementation window finalized through July 21, not a query-specific rank. Use the current dated snapshot for later monitoring rather than silently replacing this baseline.

## Pages

| Page | Full URL | Est. search demand/mo | Baseline GSC rank | Target rank | 2-3 top search queries | Current status | Review coverage | Remaining / blocker | Next action |
|---|---|---:|---|---|---|---|---|---|---|
| Main things-to-do hub | https://familytripwise.com/things-to-do/chicago-with-kids.html | 5,400 core exact; many overlapping broad variants | Avg position 58.88; 52 impressions | Top 20 first, then Top 10 | `things to do in Chicago with kids`; `Chicago with kids`; `best things to do in Chicago with kids` | Released and production-verified at `ad4f318`; Pages run `30058164707` succeeded. | Cluster, competition, CHI-P1 through CHI-P5, every visible section, 18 candidates, current official sources, claims, repetition, filter behavior, responsive behavior, and production output reviewed under `FT-RES-008` and `FT-IMP-010`; final independent verdict `PASS`. | No current blocker. | Observe discovery; change only when current evidence identifies a concrete gap. |
| Teen activities | https://familytripwise.com/things-to-do/chicago-with-teens.html | 720 core exact; 110 teenager variant | No page row at implementation | Top 20, then Top 10 | `things to do in Chicago with teens`; `things to do in Chicago with teenagers`; `Chicago with teens` | Released and production-verified at `7df3952`; Pages run `30087275395` succeeded. | Cluster, ranking pages, exact SERP/community register, CHI-P4, all candidates, every visible section, current official sources, claims, repetition, schema, generation, scoped mobile behavior, and production output reviewed under `FT-RES-008` and `SRR-019`; formal independent verdict `PASS`. | No current blocker. | Observe discovery; July 24 first shows 2 impressions at page-level position 11, too little for a conclusion. |
| Stay areas / base | https://familytripwise.com/where-to-stay/chicago-with-kids.html | 110 exact; 70 neighborhood variant | Avg position 60.11; 38 impressions | Top 20 | `where to stay in Chicago with kids`; `best area to stay in Chicago with kids`; `family friendly neighborhoods Chicago` | Released and production-verified at `9d1a90d`; Pages run `30084335602` succeeded. | Cluster, competition, CHI-P1/P2/P5/P4 routing, every visible section, current Choose Chicago/CTA sources, claims, repetition, schema, generation, responsive behavior, and production output reviewed under `FT-RES-008` and `SRR-018`; final independent verdict `PASS`. | No current blocker. | Observe discovery; keep area intent separate from the named-hotel page. |
| Family itinerary | https://familytripwise.com/family-itinerary/chicago-with-kids.html | 20 exact itinerary; 20 three-day variant | Avg position 20.75; 12 impressions | Top 20, then Top 10 if demand appears | `Chicago itinerary with kids`; `3 days in Chicago with kids`; `Chicago family itinerary` | Released and production-verified under `FT-IMP-013` at `f7a2d7f`; Pages run `30090493666` succeeded. | Cluster, competition, exact ranking/community registers, CHI-P1 through CHI-P5, every visible section, current official sources, claims, repetition, schema, generation, and 1280/390/320 output reviewed under `FT-RES-008` and `SRR-020`; final independent verdict `PASS`. | No current blocker. | Observe discovery; do not infer a query rank or causal result from 12 impressions. |
| Family hotel comparison | https://familytripwise.com/where-to-stay/chicago-family-hotels.html | 320 best-hotels variant; 260 family-friendly; 210 kid-friendly; variants overlap | N/A: new URL | Top 20 first, then Top 10 | `best hotels in Chicago for families`; `family friendly hotels in Chicago`; `kid friendly hotels Chicago` | Released and production-verified at `833c081`; Pages run `30062024170` succeeded. | Hotel SERP, competitor, community, persona, page-boundary, 19-property candidate pool, official facts, rough prices, sampled review observations and conflicts, every visible page section, source freshness, responsive behavior, and schema are recorded under `FT-RES-008` and `SRR-017`; final independent verdict `PASS`. | No current blocker. | Observe discovery; use it as the named-property handoff from the stay-area page. |

## Cluster Decisions

| Query family | Page decision |
|---|---|
| Broad family activities / family vacation | Released all-ages hub. |
| Teens/tweens | Existing standalone teen page. |
| Toddlers/preschoolers | All-ages filter/module first. |
| Free/budget | Strong all-ages module first; no separate URL now. |
| Indoor/rain/winter | All-ages and itinerary modules; current official checks. |
| Weekend/today events | No static page until a current-content workflow exists. |
| Where to stay / best area | Existing area/base page. |
| Family-friendly / kid-friendly hotels, downtown, pools, suites, near attractions | One released named-property hotel page; keep the variants together. |
| Itinerary / three days | Existing sequencing support page. |
| Stroller/no car/nap | Cross-page decision fields, not standalone URLs. |

## Ordered Chicago Work

1. All-ages things-to-do hub released and production-verified under `FT-IMP-010`.
2. Family-hotel comparison released and production-verified under `FT-PUB-003`.
3. Stay-area guide released and production-verified under `FT-IMP-011`.
4. Teen specialist released and production-verified under `FT-IMP-012`.
5. Itinerary simplified into concrete day-by-day plans under `FT-IMP-013`; released and production-verified at `f7a2d7f` through Pages run `30090493666`.

All five Chicago core pages are released and have complete cluster/persona/competition/section review coverage. No page is protected by an active Chicago observation window. Early GSC evidence remains too sparse for causal evaluation, so future improvements should be driven by a concrete usefulness, SERP-fit, freshness, or technical gap rather than artificial waiting.
