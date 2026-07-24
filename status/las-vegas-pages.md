# Las Vegas Page Status

Last updated: 2026-07-24

Sources:

- Implementation baseline GSC snapshot: `ops/gsc-snapshots/2026-07-23.md`
- Current public-safe GSC snapshot: `ops/gsc-snapshots/2026-07-24.md`
- Las Vegas city/cluster research: `docs/research/next-city-prioritization-las-vegas-cluster.md`
- Reusable workflow: `docs/plan/incremental-city-cluster-playbook.md`
- Current roadmap: `ops/seo-roadmap.md`

Demand estimates are directional US monthly search volumes from the logged-in Semrush check collected July 22, 2026. Closely related rows overlap and must not be summed into unique traffic. Baseline GSC rank is page-level average position over the implementation window finalized through July 21; it is not a claim that the page ranks at that position for each example query. Example queries are research targets, not a protected GSC query export.

## Public Pages

| Page | Full URL | Est. search demand/mo | Baseline GSC rank | Target rank | 2-3 top search queries | Current status | Done | Remaining / blocker | Next action |
|---|---|---:|---|---|---|---|---|---|---|
| Main things-to-do hub | https://familytripwise.com/things-to-do/las-vegas-with-kids.html | 3,600 core exact; 5,880 across four overlapping broad variants | Avg position 56.53; 192 impressions | Top 20 first, then Top 10 | `things to do in Las Vegas with kids`; `things to do with kids in Las Vegas`; `Las Vegas family activities` | Live, indexed, released, and production-verified under `FT-IMP-006`. | Twelve distinct choices, six practical filters, one complete comparison, five trip-shape routes, six high-friction detail notes, visible FAQ, heat/budget checks, and links to teen/stay/itinerary pages. | Baseline GSC predates the change; no performance conclusion is available yet. | Preserve while Google recrawls; use later GSC as directional evidence rather than manufacturing a cadence action. |
| Teen activities | https://familytripwise.com/things-to-do/las-vegas-with-teens.html | 590 core exact; alternate variants also support the intent | Avg position 11; 2 impressions | Top 10 | `things to do in Las Vegas with teens`; `things to do with teens in Las Vegas`; `Las Vegas with teens` | Live, released, and production-verified under `FT-IMP-007` at `ae917f1`; Pages run `29964564369` succeeded. | Eight teen-specific choices, five trip-style starts, five high-friction detail cards, four route shapes, mixed-age routing, current official checks, visible FAQ/schema, and a full competitor/persona/section record. | The two-impression GSC baseline is too small for a performance conclusion, and post-change evidence does not exist yet. | Preserve while Google recrawls; do not request indexing. |
| Stay areas / property constraints | https://familytripwise.com/where-to-stay/las-vegas-with-kids.html | 20 for exact area query; overlaps 3,980+ hotel/resort variants | Avg position 44.69; 13 impressions | Top 20 | `where to stay in Las Vegas with kids`; `best area to stay in Las Vegas with kids`; `where should families stay in Las Vegas` | Live, released, and production-verified under `FT-IMP-008` at `7bc2993`; Pages run `29975754626` succeeded. | Five trip-shape starts, one five-row base comparison, three decisive checks, four cluster routes, three visible FAQs/schema, current sources, and full competitor/persona/every-section review. | The 13-impression baseline is too small for a performance conclusion; post-change evidence does not exist yet. | Preserve while Google recrawls; do not request indexing. |
| Family itinerary | https://familytripwise.com/family-itinerary/las-vegas-with-kids.html | About 20 across two sampled exact itinerary phrases | Avg position 22.6; 5 impressions | Top 20 | `Las Vegas itinerary with kids`; `Las Vegas family itinerary`; `Las Vegas weekend with kids` | Live, released, and production-verified under `FT-IMP-009` at `48417b0`; Pages run `29994060699` succeeded. | Three trip-length starts, three day-by-day plans, five persona/trip pivots, four stop rules, four cluster routes, three visible FAQs/schema, current sources, a full competitor/persona/every-section record, 57/57 tests, responsive QA, and independent review. | The five-impression baseline is too small for a performance conclusion; post-change evidence does not exist yet. | Preserve while Google recrawls; do not request indexing. |
| Family hotel comparison | https://familytripwise.com/where-to-stay/las-vegas-family-hotels.html | 1,900 family-friendly hotels; 880 best family hotels; 720 family resorts; 480 kid-friendly hotels | N/A: new URL has no pre-launch GSC row | Top 20 first, then Top 10 | `family friendly hotels in Las Vegas`; `best family hotels in Las Vegas`; `Las Vegas family resorts` | Live, released, and production-verified under `FT-PUB-002` at `bda58e8`; Pages run `29944609529` succeeded. | Ten distinct trip-style options, official property facts, rough total-night ranges, sampled online-review themes/conflicts, direct hotel maps, comparison table, visible FAQ, durable evidence pack, native QA, and independent review. | No post-launch search or crawl evidence exists yet. Price/review evidence is volatile and must be refreshed before materially stale claims are relied on. | Keep the one hotel/resort URL; do not request indexing or create a separate `family resorts` page. |

## Review Coverage

`Cluster reviewed` means current keyword and SERP-overlap evidence establishes the page job. `Persona mapped` means the five Las Vegas research hypotheses were applied at page level. `Section review needed` means every visible block still needs a keep/compress/merge/move/replace/remove decision before implementation.

| Page | Cluster / competition coverage | Persona coverage | Section-level review | Current verdict |
|---|---|---|---|---|
| Main things-to-do hub | Complete at decision-pack and expanded-candidate level; official venue facts plus public SERP/community context classified separately | LV-P1, LV-P3, LV-P4, LV-P5 mapped; LV-P2 routes through pool/stay | Complete: every visible section received a keep/expand/compress/replace treatment in `docs/research/las-vegas-activity-expansion-review.md` | Released; keep the all-ages hub role. |
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

Las Vegas is complete at the current five-page core-cluster level. `FT-IMP-006` / `IMP-020`, `FT-PUB-002` / `IMP-021`, `FT-IMP-007` / `IMP-022`, `FT-IMP-008` / `IMP-023`, and `FT-IMP-009` / `IMP-024` are released and production-verified. Preserve the current architecture while Google discovers the revisions; change a page only when current evidence identifies a concrete usefulness, freshness, intent, or technical gap.
