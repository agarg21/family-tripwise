# Las Vegas Page Status

Last updated: 2026-07-22

Sources:

- Latest public-safe GSC snapshot: `ops/gsc-snapshots/2026-07-22.md`
- Las Vegas city/cluster research: `docs/research/next-city-prioritization-las-vegas-cluster.md`
- Reusable workflow: `docs/plan/incremental-city-cluster-playbook.md`
- Current roadmap: `ops/seo-roadmap.md`

Demand estimates are directional US monthly search volumes from the logged-in Semrush check collected July 22, 2026. Closely related rows overlap and must not be summed into unique traffic. GSC rank is page-level average position over the latest 28-day window, finalized through July 20; it is not a claim that the page ranks at that position for each example query. Example queries are research targets, not a protected GSC query export.

## Public Pages

| Page | Full URL | Est. search demand/mo | Current GSC rank | Target rank | 2-3 top search queries | Current status | Done | Remaining / blocker | Next action |
|---|---|---:|---|---|---|---|---|---|---|
| Main things-to-do hub | https://familytripwise.com/things-to-do/las-vegas-with-kids.html | 3,600 core exact; 5,880 across four overlapping broad variants | Avg position 56.22; 180 impressions | Top 20 first, then Top 10 | `things to do in Las Vegas with kids`; `things to do with kids in Las Vegas`; `Las Vegas family activities` | Live, indexed, released, and production-verified under `FT-IMP-006`. | Twelve distinct choices, six practical filters, one complete comparison, five trip-shape routes, six high-friction detail notes, visible FAQ, heat/budget checks, and links to teen/stay/itinerary pages. | Current GSC is only the pre-change baseline; no performance conclusion is available yet. | Preserve while Google recrawls; use later GSC as directional evidence rather than manufacturing a cadence action. |
| Teen activities | https://familytripwise.com/things-to-do/las-vegas-with-teens.html | 590 core exact; alternate variants also support the intent | Avg position 11; 2 impressions | Top 10 | `things to do in Las Vegas with teens`; `things to do with teens in Las Vegas`; `Las Vegas with teens` | Live and indexed; the researched replacement is review-clean under `FT-IMP-007`, with exact-path release and production verification pending. | Eight teen-specific choices, five trip-style starts, five high-friction detail cards, four route shapes, mixed-age routing, current official checks, visible FAQ/schema, and a full competitor/persona/section record. | The two-impression GSC baseline is too small for a performance conclusion, and post-change evidence does not exist yet. | Release and production-verify this same URL; do not request indexing. |
| Stay areas / property constraints | https://familytripwise.com/where-to-stay/las-vegas-with-kids.html | 20 for exact area query; overlaps 3,980+ hotel/resort variants | Avg position 44.69; 13 impressions | Top 20 | `where to stay in Las Vegas with kids`; `best area to stay in Las Vegas with kids`; `where should families stay in Las Vegas` | Live, indexed, and already reframed away from unsupported recommendations. | Five area hypotheses, comparison, three property examples, and official booking/route checks. | Page is verbose and defensive, has no rough nightly ranges or recent review themes, and cannot satisfy the much larger named-hotel SERP. | Keep the area/constraint role. Simplify and route to the future hotel page after that page is researched and built. |
| Family itinerary | https://familytripwise.com/family-itinerary/las-vegas-with-kids.html | About 20 across two sampled exact itinerary phrases | Avg position 22.6; 5 impressions | Top 20 | `Las Vegas itinerary with kids`; `Las Vegas family itinerary`; `Las Vegas weekend with kids` | Live and indexed; useful supporting page with low direct demand. | One-, two-, and three-day variants, pacing rules, activity swaps, and sibling-page links. | Needs a later section/evidence pass after activity and lodging decisions settle; exact route/timing implications require current support. | Keep and observe. Review after the all-ages and lodging work, not before. |
| Family hotel comparison | https://familytripwise.com/where-to-stay/las-vegas-family-hotels.html | 1,900 family-friendly hotels; 880 best family hotels; 720 family resorts; 480 kid-friendly hotels | N/A: new URL has no pre-launch GSC row | Top 20 first, then Top 10 | `family friendly hotels in Las Vegas`; `best family hotels in Las Vegas`; `Las Vegas family resorts` | Live, released, and production-verified under `FT-PUB-002` at `bda58e8`; Pages run `29944609529` succeeded. | Ten distinct trip-style options, official property facts, rough total-night ranges, sampled online-review themes/conflicts, direct hotel maps, comparison table, visible FAQ, durable evidence pack, native QA, and independent review. | No post-launch search or crawl evidence exists yet. Price/review evidence is volatile and must be refreshed before materially stale claims are relied on. | Keep the one hotel/resort URL; do not request indexing or create a separate `family resorts` page. |

## Review Coverage

`Cluster reviewed` means current keyword and SERP-overlap evidence establishes the page job. `Persona mapped` means the five Las Vegas research hypotheses were applied at page level. `Section review needed` means every visible block still needs a keep/compress/merge/move/replace/remove decision before implementation.

| Page | Cluster / competition coverage | Persona coverage | Section-level review | Current verdict |
|---|---|---|---|---|
| Main things-to-do hub | Complete at decision-pack and expanded-candidate level; official venue facts plus public SERP/community context classified separately | LV-P1, LV-P3, LV-P4, LV-P5 mapped; LV-P2 routes through pool/stay | Complete: every visible section received a keep/expand/compress/replace treatment in `docs/research/las-vegas-activity-expansion-review.md` | Released; keep the all-ages hub role. |
| Teen activities | Complete: current teen SERPs, representative firsthand/editorial competitors, community context, and official sources are classified in `docs/research/las-vegas-teen-page-review.md` | LV-P4 primary; LV-P1/LV-P3 mixed-family implications applied to choice, pacing, and split-plan support | Complete: every visible section has a keep/compress/replace/remove decision, and every retained candidate has a teen-specific reason | Keep standalone; review-clean implementation awaits release and production verification. |
| Stay areas / property constraints | Hotel, resort, and where-to-stay SERP boundary reviewed | LV-P1, LV-P2, LV-P3, LV-P5 mapped | Existing page was reviewed previously for trust; concise usefulness re-review still needed | Keep distinct area/constraint role and simplify after hotel-page creation. |
| Family itinerary | Itinerary/pacing SERP reviewed directionally | LV-P1, LV-P3, LV-P4, LV-P5 mapped | Needed later | Keep as support; it should consume the final activity/lodging architecture. |
| Family hotels | Hotel/resort SERP plus representative OTA, publisher, official-property, price, and recent-review sources reviewed | LV-P1, LV-P2, LV-P3, LV-P5 mapped | Complete: compact trip-style starts, one comparison, ten evidence-backed cards, FAQ, sources, and independent review | Released; keep as the single named-property hotel/resort page. |

## Cluster Decisions

| Query family | Page decision |
|---|---|
| Broad family activities | Existing all-ages hub. |
| Teens/tweens | Existing standalone teen page. |
| Family-friendly hotels / best family hotels / family resorts | One future named-hotel page. |
| Where to stay / best area | Existing area/property-constraint page. |
| Family itinerary / weekend | Existing itinerary support page. |
| Free/budget | Prominent all-ages module first; standalone page only after further evidence. |
| Toddler / indoor / heat / stroller / waterslides | Filters or modules, not new URLs now. |

## Current Priority

Las Vegas is the current city. `FT-IMP-006` / `IMP-020` and `FT-PUB-002` / `IMP-021` are released and production-verified. `FT-IMP-007` / `IMP-022` is completed and review-clean; the existing teen guide now awaits exact-path release and production verification.
