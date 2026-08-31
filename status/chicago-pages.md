# Chicago Page Status

Last updated: 2026-08-31

Sources:

- Implementation baseline GSC snapshot: `ops/gsc-snapshots/2026-07-23.md`
- Current public-safe GSC snapshot: `ops/gsc-snapshots/2026-08-30.md`
- Latest public-safe GSC snapshot: `ops/gsc-snapshots/2026-08-30.md`
- Chicago decision pack: `docs/research/chicago-family-cluster-decision-pack.md`
- Reusable workflow: `docs/plan/incremental-city-cluster-playbook.md`
- Current roadmap: `ops/seo-roadmap.md`

Demand estimates are directional US monthly search volumes from the logged-in Semrush Chrome research collected July 23, 2026. Closely related variants overlap and must not be summed as unique traffic. Baseline GSC rank is page-level average position for the 28-day implementation window finalized through July 21, not a query-specific rank. Use the current dated snapshot for later monitoring rather than silently replacing this baseline.

## July 28 Monitoring Overlay

Fresh read-only URL Inspection reports the all-ages, stay-area, and itinerary pages indexed. The family-hotel page is discovered but not indexed, and the teen page is unknown to Google. Performance finalized through July 26 shows 52 impressions for all-ages, 56 for stay areas, and 14 for the itinerary. These are page-level discovery signals, not query ranks or causal results.

## August 13 Maintenance Overlay

For the August 13 `FT-MAINT-002` run, the newest available authenticated snapshot was collected August 12 and finalized through August 10. It was recent reused evidence for that run, not a page-change trigger. `FT-MAINT-002` corrected the family-hotel page because its ended August 10-12 InterContinental pool closure was still presented as current and failed both content-freshness and production SEO QA. The released correction keeps the same page role, ten hotels, prices, URL, title, canonical, indexability, and sitemap entry.

## August 30 Itinerary Task Overlay

`FT-RES-023` compares a three-full-sightseeing-day case with a two-day control on the live itinerary. The control completes all six outputs. The three-full-day case is `PARTIAL` on usable-day count and one-zone-per-day assignment because the current three-day route is a soft arrival plus two full days. Reset, weather/budget swap, removal, and verification are complete; the 1280-pixel desktop width and exact 390 by 844 and 320 by 800 mobile runs have no overflow. The operator reported a 900-pixel desktop height while Mill's review environment clamped to 720, so no cross-environment desktop-height or depth-ratio claim is retained. Preserve the page and URL. Keep only unselected `IMP-047`, a bounded distinction between three calendar days including arrival and three complete sightseeing days. Mill cycle-two `PASS` leaves no P0-P3. This is proxy-reviewed interface evidence, not user testing, behavior, satisfaction, rank or CTR evidence.

Fresh August 30 GSC arrived before release and is finalized through August 28. The itinerary has 40 impressions at page-average position 47.3, remains indexed and was last crawled July 31. No public aligned query cohort exists, so this evidence does not select an edit or establish a performance result.

## August 31 Current-Question Overlay

`FT-RES-024` tests numeric day-count sufficiency against three child-family questions dated May-June 2025 and one July 2026 cross-generational pacing control. The bounded sample rejects the idea that the day label alone determines itinerary capacity: nights, arrival/departure windows, age/pace, luggage, transport, budget, rest, and a distant transfer change the usable sightseeing blocks. Retain and narrow unselected `IMP-047` to one conditional full-day check inside the existing three-day choice; add no new layer, attraction, day, or URL. This is qualitative community evidence, not demand, user testing, behavior, satisfaction, rank, CTR, or firsthand evidence.

## Pages

| Page | Full URL | Est. search demand/mo | Baseline GSC rank | Target rank | 2-3 top search queries | Current status | Review coverage | Remaining / blocker | Next action |
|---|---|---:|---|---|---|---|---|---|---|
| Main things-to-do hub | https://familytripwise.com/things-to-do/chicago-with-kids.html | 5,400 core exact; many overlapping broad variants | Avg position 58.88; 52 impressions | Top 20 first, then Top 10 | `things to do in Chicago with kids`; `Chicago with kids`; `best things to do in Chicago with kids` | Released and production-verified at `ad4f318`; Pages run `30058164707` succeeded. | Cluster, competition, CHI-P1 through CHI-P5, every visible section, 18 candidates, current official sources, claims, repetition, filter behavior, responsive behavior, and production output reviewed under `FT-RES-008` and `FT-IMP-010`; final independent verdict `PASS`. | No current blocker. | Observe discovery; change only when current evidence identifies a concrete gap. |
| Teen activities | https://familytripwise.com/things-to-do/chicago-with-teens.html | 720 core exact; 110 teenager variant | No page row at implementation | Top 20, then Top 10 | `things to do in Chicago with teens`; `things to do in Chicago with teenagers`; `Chicago with teens` | Released and production-verified at `7df3952`; Pages run `30087275395` succeeded. | Cluster, ranking pages, exact SERP/community register, CHI-P4, all candidates, every visible section, current official sources, claims, repetition, schema, generation, scoped mobile behavior, and production output reviewed under `FT-RES-008` and `SRR-019`; formal independent verdict `PASS`. | No current blocker. | Observe discovery; July 24 first shows 2 impressions at page-level position 11, too little for a conclusion. |
| Stay areas / base | https://familytripwise.com/where-to-stay/chicago-with-kids.html | 110 exact; 70 neighborhood variant | Avg position 60.11; 38 impressions | Top 20 | `where to stay in Chicago with kids`; `best area to stay in Chicago with kids`; `family friendly neighborhoods Chicago` | Released and production-verified at `9d1a90d`; Pages run `30084335602` succeeded. | Cluster, competition, CHI-P1/P2/P5/P4 routing, every visible section, current Choose Chicago/CTA sources, claims, repetition, schema, generation, responsive behavior, and production output reviewed under `FT-RES-008` and `SRR-018`; final independent verdict `PASS`. | No current blocker. | Observe discovery; keep area intent separate from the named-hotel page. |
| Family itinerary | https://familytripwise.com/family-itinerary/chicago-with-kids.html | 20 exact itinerary; 20 three-day variant | Avg position 20.75; 12 impressions | Top 20, then Top 10 if demand appears | `Chicago itinerary with kids`; `3 days in Chicago with kids`; `Chicago family itinerary` | Released and production-verified under `FT-IMP-013` at `f7a2d7f`; Pages run `30090493666` succeeded. August 30 GSC: 40 impressions, page-average position 47.3, indexed, last crawled July 31. | Prior full review; `FT-RES-023` proxy task; `FT-RES-024` four-question trip-capacity synthesis; Kepler cycle-one `PASS`. | Three-full-day case is `PARTIAL`; current questions support usable-block normalization, but no aligned query cohort or behavior evidence exists. | Preserve. Keep narrowed `IMP-047` unselected; any page action requires separate selection and review. |
| Family hotel comparison | https://familytripwise.com/where-to-stay/chicago-family-hotels.html | 320 best-hotels variant; 260 family-friendly; 210 kid-friendly; variants overlap | N/A: new URL | Top 20 first, then Top 10 | `best hotels in Chicago for families`; `family friendly hotels in Chicago`; `kid friendly hotels Chicago` | Targeted `FT-MAINT-002` factual refresh released and production-verified at `9bf5e04`; Pages run `31685857634` succeeded. | Hotel SERP, competitor, community, persona, page-boundary, 19-property candidate pool, official facts, rough prices, sampled review observations and conflicts, every visible page section, source freshness, responsive behavior, and schema are recorded under `FT-RES-008` and `SRR-017`; the InterContinental pool project was rechecked from current IHG notices August 13, and Locke returned `PASS_WITH_P3` with no P0-P2. | No current blocker. | Resume observation; refresh only when current operational evidence or user-value evidence identifies another concrete gap. |

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
