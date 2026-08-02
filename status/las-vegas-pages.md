# Las Vegas Page Status

Last updated: 2026-08-02

Sources:

- Implementation baseline GSC snapshot: `ops/gsc-snapshots/2026-07-23.md`
- Current public-safe GSC snapshot: `ops/gsc-snapshots/2026-08-02.md`
- Current all-ages ranking diagnostic: `docs/research/las-vegas-ranking-diagnostic-2026-08-02.md`
- Las Vegas city/cluster research: `docs/research/next-city-prioritization-las-vegas-cluster.md`
- Reusable workflow: `docs/plan/incremental-city-cluster-playbook.md`
- Current roadmap: `ops/seo-roadmap.md`

Demand estimates are directional US monthly search volumes from the logged-in Semrush check collected July 22, 2026. Closely related rows overlap and must not be summed into unique traffic. Baseline GSC rank is page-level average position over the implementation window finalized through July 21; it is not a claim that the page ranks at that position for each example query. Example queries are research targets, not a protected GSC query export.

## August 2 Monitoring And Diagnostic Overlay

Fresh read-only URL Inspection reports all five Las Vegas pages indexed. Performance finalized through July 31 gives the all-ages hub 464 impressions, zero clicks, and page-average position 60.69. Its latest crawl was July 31, so the current window has zero finalized days after that crawl and cannot evaluate the July revision.

`FT-RES-015` adds a fresh protected export for the all-ages URL: 54 rows account for 456 impressions, of which 410 (89.9%) use direct action/list wording and another 18 (3.9%) use place/visit wording. Complete query rows remain outside the public repository. Three representative live SERPs strongly overlap, so the broad activity phrases belong on this one URL. The page is not in a title/CTR lane. One bounded improvement is promoted for separate selection: replace repeated comparison/detail/route/check layers with a source-dated cost-and-friction index for the same 12 choices.

## Public Pages

| Page | Full URL | Est. search demand/mo | Baseline GSC rank | Target rank | 2-3 top search queries | Current status | Done | Remaining / blocker | Next action |
|---|---|---:|---|---|---|---|---|---|---|
| Main things-to-do hub | https://familytripwise.com/things-to-do/las-vegas-with-kids.html | 3,600 core exact; 5,880 across four overlapping broad variants | Avg position 60.69; 464 impressions; 0 clicks | Top 20 first, then Top 10 | `things to do in Las Vegas with kids`; `things to do in Las Vegas for kids`; `kid friendly activities in Las Vegas` | Live, indexed, latest crawl July 31; `FT-RES-015` ranking diagnostic complete. | Twelve distinct choices, six filters, current official checks, sibling routing, fresh protected-query diagnosis, live three-query SERP overlap, representative ranking-page audit, and every-section/persona review. | Zero finalized performance days follow the latest crawl, so no rewrite-performance conclusion is available. The page repeats decisions across an 11-column table, six details, five routes, three checks and FAQs; family cost/current-check facts remain scattered or generic. | `FT-AUTH-006`: separately select one in-place cost-and-friction index that consolidates old layers; no new URL, list expansion, title test, indexing request, or outreach. |
| Teen activities | https://familytripwise.com/things-to-do/las-vegas-with-teens.html | 590 core exact; alternate variants also support the intent | Avg position 11; 2 impressions | Top 10 | `things to do in Las Vegas with teens`; `things to do with teens in Las Vegas`; `Las Vegas with teens` | Live, released, and production-verified under `FT-IMP-007` at `ae917f1`; Pages run `29964564369` succeeded. | Eight teen-specific choices, five trip-style starts, five high-friction detail cards, four route shapes, mixed-age routing, current official checks, visible FAQ/schema, and a full competitor/persona/section record. | The two-impression GSC baseline is too small for a performance conclusion, and post-change evidence does not exist yet. | Preserve while Google recrawls; do not request indexing. |
| Stay areas / property constraints | https://familytripwise.com/where-to-stay/las-vegas-with-kids.html | 20 for exact area query; overlaps 3,980+ hotel/resort variants | Avg position 44.69; 13 impressions | Top 20 | `where to stay in Las Vegas with kids`; `best area to stay in Las Vegas with kids`; `where should families stay in Las Vegas` | Live, released, and production-verified under `FT-IMP-008` at `7bc2993`; Pages run `29975754626` succeeded. | Five trip-shape starts, one five-row base comparison, three decisive checks, four cluster routes, three visible FAQs/schema, current sources, and full competitor/persona/every-section review. | The 13-impression baseline is too small for a performance conclusion; post-change evidence does not exist yet. | Preserve while Google recrawls; do not request indexing. |
| Family itinerary | https://familytripwise.com/family-itinerary/las-vegas-with-kids.html | About 20 across two sampled exact itinerary phrases | Avg position 22.6; 5 impressions | Top 20 | `Las Vegas itinerary with kids`; `Las Vegas family itinerary`; `Las Vegas weekend with kids` | Live, released, and production-verified under `FT-IMP-009` at `48417b0`; Pages run `29994060699` succeeded. | Three trip-length starts, three day-by-day plans, five persona/trip pivots, four stop rules, four cluster routes, three visible FAQs/schema, current sources, a full competitor/persona/every-section record, 57/57 tests, responsive QA, and independent review. | The five-impression baseline is too small for a performance conclusion; post-change evidence does not exist yet. | Preserve while Google recrawls; do not request indexing. |
| Family hotel comparison | https://familytripwise.com/where-to-stay/las-vegas-family-hotels.html | 1,900 family-friendly hotels; 880 best family hotels; 720 family resorts; 480 kid-friendly hotels | N/A: new URL has no pre-launch GSC row | Top 20 first, then Top 10 | `family friendly hotels in Las Vegas`; `best family hotels in Las Vegas`; `Las Vegas family resorts` | Live, indexed as of July 28, released, and production-verified under `FT-PUB-002` at `bda58e8`; Pages run `29944609529` succeeded. | Ten distinct trip-style options, official property facts, rough total-night ranges, sampled online-review themes/conflicts, direct hotel maps, comparison table, visible FAQ, durable evidence pack, native QA, and independent review. | No performance row exists yet. Price/review evidence is volatile and must be refreshed before materially stale claims are relied on. | Keep the one hotel/resort URL; do not request indexing or create a separate `family resorts` page. |

## Review Coverage

`Cluster reviewed` means current keyword and SERP-overlap evidence establishes the page job. `Persona mapped` means the five Las Vegas research hypotheses were applied at page level. `Section review needed` means every visible block still needs a keep/compress/merge/move/replace/remove decision before implementation.

| Page | Cluster / competition coverage | Persona coverage | Section-level review | Current verdict |
|---|---|---|---|---|
| Main things-to-do hub | Complete and refreshed by `FT-RES-015`: protected query composition, three-query live SERP overlap, seven ranking pages, SERP features, authority and citation reason are classified | LV-P1 through LV-P5 applied to every current decision layer | Complete: hero, filters, starts, 11-column table, six details, five routes, cluster links, three checks, FAQ and sources each have keep/compress/merge/replace/remove decisions in `docs/research/las-vegas-ranking-diagnostic-2026-08-02.md` | Keep the all-ages hub role. Promote `FT-AUTH-006` to consolidate repetition into one source-dated 12-choice cost-and-friction index. Do not evaluate rank until finalized evidence follows the latest crawl. |
| Teen activities | Complete: current teen SERPs, representative firsthand/editorial competitors, community context, and official sources are classified in `docs/research/las-vegas-teen-page-review.md` | LV-P4 primary; LV-P1/LV-P3 mixed-family implications applied to choice, pacing, and split-plan support | Complete: every visible section has a keep/compress/replace/remove decision, and every retained candidate has a teen-specific reason | Keep standalone; released and production-verified under `FT-IMP-007`. |
| Stay areas / property constraints | Complete: current area, hotel, OTA, and qualitative community results classified in `docs/research/las-vegas-stay-area-page-review.md` | LV-P1, LV-P2, LV-P3, LV-P5 applied to the base decision; LV-P4 routes through the teen page | Complete: every visible section has a keep/compress/replace/remove decision and named-hotel duplication was removed | Keep distinct, concise area/base role; released and production-verified under `FT-IMP-008`. |
| Family itinerary | Complete: current destination, firsthand, commercial, generated, and qualitative community results classified in `docs/research/las-vegas-family-itinerary-page-review.md` | LV-P1 through LV-P5 applied to trip length, anchor choice, reset, heat, pool, teen, nature, and budget pivots | Complete: every visible section has a keep/compress/replace/remove decision and the repeated abstract route layers were replaced | Keep as the cluster sequencing page; released and production-verified under `FT-IMP-009`. |
| Family hotels | Hotel/resort SERP plus representative OTA, publisher, official-property, price, and recent-review sources reviewed | LV-P1, LV-P2, LV-P3, LV-P5 mapped | Complete: compact trip-style starts, one comparison, ten evidence-backed cards, FAQ, sources, and independent review | Released; keep as the single named-property hotel/resort page. |

## Cluster Decisions

| Query family | Page decision |
|---|---|
| Broad family activities | Existing all-ages hub. |
| Teens/tweens | Existing standalone teen page. |
| Family-friendly hotels / best family hotels / family resorts | One live named-hotel page. |
| Where to stay / best area | Existing area/property-constraint page. |
| Family itinerary / weekend | Existing itinerary support page. |
| Free/budget | Prominent all-ages module first; standalone page only after further evidence. |
| Toddler / indoor / heat / stroller / waterslides | Filters or modules, not new URLs now. |

## Current Decision

Las Vegas remains complete at the current five-page core-cluster level. `FT-RES-015` confirms that the broad all-ages activity variants belong on one existing URL and identifies one concrete usefulness/citation gap without declaring the July revision a ranking failure. `FT-AUTH-006` is ready for separate selection: replace repeated layers on the existing all-ages page with one source-dated cost-and-friction index for its same 12 choices. Preserve the other four page roles; create no modifier page and do not manufacture an observation action from cadence.
