# New York City Page Status

Last updated: 2026-09-02

Sources:

- Current public-safe GSC snapshot: `ops/gsc-snapshots/2026-09-02.md`
- NYC decision pack: `docs/research/new-york-city-family-cluster-decision-pack.md`
- Reusable workflow: `docs/plan/incremental-city-cluster-playbook.md`
- Current roadmap: `ops/seo-roadmap.md`

Demand estimates are directional US monthly search volumes from the logged-in Semrush Chrome research collected July 24, 2026. Closely related variants overlap and must not be summed as unique traffic. Decision-baseline GSC position is page-level average position for the 28-day snapshot finalized through July 24, not a query-specific rank.

## July 28 Monitoring Overlay

Fresh read-only URL Inspection reports the all-ages and stay-area pages indexed. The family-hotel and teen pages are discovered but not indexed; the itinerary remains unknown to Google. Performance finalized through July 26 shows 66 impressions for all-ages and 58 for stay areas. These are page-level discovery signals, not query ranks or causal results.

## September 1 Research Overlay

Fresh September 1 API evidence is finalized through August 30. The stay-area page has 51 impressions at page-average position 44.33, is indexed, and was last crawled August 29; the public snapshot has no aligned query cohort, so it remains orientation rather than an edit trigger. `FT-RES-025` / `SRR-046` inspected three live US-oriented family stay-area formulations and representative result pages. The result is `PRESERVE`: the current page directly handles the tested first-two-day, reset, friction, exact-access-check and named-hotel-handoff task. Bernoulli cycle-two `PASS` leaves no P0-P3. Afternoon `FT-RES-026` / `SRR-047` deepens that result: the unordered-anchor case is `PARTIAL`, the first-two-days-known control is `YES`, and the correct itinerary recovery route works but is late. Galileo cycle-one `PASS` leaves no P0-P3. Preserve the page and retain only unselected `IMP-048`; no page edit, new area inventory, URL or search-state change is selected.

## September 2 Research Overlay

Completed, review-clean `FT-RES-027` / `SRR-048` current-question research has James cycle-three `PASS` with no remaining P0-P3. Five public family questions dated January-June 2026 split into two initial planning states: two begin with an open base plus loose or unordered cross-city anchors, but points and free-night economics decide one booking; only the other independently supports the unresolved sequencing state. Three already treat lodging as fixed or assumed and have sequenced days. Retain and narrow unselected `IMP-048` to a nearby itinerary route only after a hard property-constraint check and only when multiple viable bases remain; do not make it a prerequisite for the known-days path. This is qualitative evidence, not demand, prevalence, behavior, satisfaction, or user testing. Both pages and URLs remain unchanged.

Afternoon `FT-IMP-027` separately selects and locally implements that narrowed handoff. One optional paragraph immediately after the five starts checks points, free nights, room setup, and complete stay price first; only a still-unresolved multiple-area case with unsequenced first days is routed to the existing itinerary. The unordered case's recovery score improves from `PARTIAL` and late to `YES` and nearby, while the known-days control remains seven `YES` results. Focused 4/4 and full 162/162 tests plus state, freshness, local/pre-release production SEO, 51-snapshot, 28-URL preflight, generation-scope, navigation and responsive checks pass. Noether cycle-one `PASS` leaves no P0-P3; release remains pending. Fresh September 2 API evidence is finalized through August 31; the stay page has 53 impressions at page-average position 43.89 and no public aligned query cohort, so GSC is orientation only.

## Pages

| Page | Full URL | Est. search demand/mo | Decision-baseline GSC position | Target rank | 2-3 top search queries | Current status | Review coverage | Remaining / blocker | Next action |
|---|---|---:|---|---|---|---|---|---|---|
| Main things-to-do hub | https://familytripwise.com/things-to-do/new-york-city-with-kids.html | Exact measured phrases: 480, 390, and 320/month; variants overlap | Avg position 43.64; 58 impressions | Top 20 first, then Top 10 | `things to do in New York City with kids`; `things to do with kids in New York City`; `fun things to do in New York City with kids` | Indexed; `FT-IMP-014` released and production-verified at commit `1437affd20914a7bf3fbdc5ae0097371d3fb96c1` through Pages run `30172548240`. | Cluster, competition, NYC-P1 through NYC-P5, every prior section, 18 candidates, official claim sources, optimized media, and responsive behavior reviewed under `FT-RES-009` and `SRR-022`; final review `PASS_WITH_P3` with no P0-P2 findings. | No release blocker. Sparse GSC evidence remains directional. | Observe crawl and query-cluster discovery without blocking the next separately authorized NYC page. |
| Family hotel comparison | https://familytripwise.com/where-to-stay/new-york-city-family-hotels.html | Exact measured phrases: 390, 390, and 260/month; variants overlap | July baseline N/A; September 1 snapshot: 24 impressions, page-average position 35.63 | Top 20 first, then Top 10 | `best family hotels in New York City`; `best hotels in NYC for families`; `family friendly hotels New York City` | Released and production-verified at commit `57d765f4fb488b5f8f077a6cddc9023901b3b4bf` through Pages run `30184040925`; indexed in the September 1 snapshot. | Hotel SERP, competitor types, NYC-P1/P2/P4/P5, page boundary, and evidence requirements reviewed under `FT-RES-009`; `SRR-023` reviewed 22 candidate properties and retained 12 with official facts, broad prices, bounded review observations, conflicts, freshness, and decisive checks. Kepler returned `PASS_WITH_P3` in cycle 2 with no P0-P2 findings. | No release blocker. Current page-level GSC is orientation only and has no public aligned query cohort. | Observe discovery and query fit without starting another action from this reconciliation. |
| Teen/tween activities | https://familytripwise.com/things-to-do/new-york-city-with-teens.html | Exact measured phrases: 590, 480, and 170/month; variants overlap | July baseline N/A; September 1 snapshot: 32 impressions, page-average position 74.31 | Top 20 first, then Top 10 | `things to do in NYC with teens`; `things to do with teens in NYC`; `best things to do with teens in NYC` | Released and production-verified at commit `77e6cb9322da34ffc13daf84b0851e83773cc382` through Pages run `30198727075`; indexed in the September 1 snapshot. | `SRR-024` reviewed the distinct SERP, representative competitors/community, NYC-P4, 20 candidate roles, current primary sources, claim boundaries, mixed-age support, every planned section, responsive behavior, and acceptance/measurement. Curie returned `PASS_WITH_P3` in cycle 2 with no P0-P2 findings. | No release blocker. One non-blocking P3 notes the generic but licensed/optimized Central Park hero; current page-level GSC is orientation only. | Observe discovery and query fit without blocking the next separately authorized NYC page. |
| Stay areas / base | https://familytripwise.com/where-to-stay/new-york-city-with-kids.html | 30 exact kids variant; 70 `with a family` variant | September 2: avg position 43.89; 53 impressions | Top 20 | `where to stay in New York City with kids`; `where to stay in NYC with a family`; `best area to stay in NYC for families` | Existing release remains live. `FT-IMP-027` locally adds one optional itinerary recovery after hard constraints are checked; Noether cycle-one `PASS`; release pending. | `SRR-025` plus `FT-RES-026` and `FT-RES-027` cover live SERP role, unordered-versus-known-days tasks, current questions, trust boundaries, exact placement, and responsive behavior. | No active observation window or technical blocker. The current page-level GSC row has no aligned public query cohort and does not select the edit. | Complete the standard release gate for `FT-IMP-027`. |
| Family itinerary | https://familytripwise.com/family-itinerary/new-york-city-with-kids.html | Exact measured phrases: 30 and 10/month; variants overlap | No page row; URL not indexed in the July 26 snapshot | Top 20 if discovery develops | `New York City with kids itinerary`; `New York City itinerary with kids`; `3 days in New York City with kids` | Released and production-verified at commit `d0c4a7dc565dea809d4d2b12caa4033b40cafe22` through Pages run `30204670128`. | `SRR-026` refreshed current itinerary SERPs, ranking pages, all five personas, qualitative parent constraints, current official sources, and every visible section. Lagrange returned `PASS_WITH_P3` in cycle 1 with no P0-P2 findings. | No release blocker. The page remains absent from the latest GSC row and must be observed without an indexing request. | Observe discovery and query fit. |

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
5. Completed: simplify the existing itinerary into concrete day plans.

No NYC page is protected by an active observation window. Early GSC evidence is too sparse for causal evaluation, so useful reviewed improvements may proceed one page at a time without artificial waiting.
