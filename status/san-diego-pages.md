# San Diego Page Status

Last updated: 2026-07-21

Sources:

- Latest public-safe GSC snapshot: `ops/gsc-snapshots/2026-07-20.md`
- San Diego SERP/persona research: `docs/research/san-diego-cluster-research-decision-pack.md`
- Section-level usefulness review: `docs/research/san-diego-section-level-editorial-audit.md`
- Historical Semrush-derived demand notes: `docs/plan/5-city-page-build-brief.md`, `docs/plan/seo-cluster-research-protocol.md`, `docs/research/age-specific-family-travel-demand.md`
- Current roadmap: `ops/seo-roadmap.md`

Note: GSC index/performance status below comes from the July 20 snapshot, with finalized data through July 18. It predates the July 20 `FT-IMP-002` and `FT-IMP-004` releases and therefore does not measure either revision. Production availability and action-specific content checks passed for both releases. Demand estimates are directional monthly US search demand from historical Semrush/research notes, not fresh keyword-tool pulls. Top queries are target/query-universe examples, not protected GSC query exports; protected raw query export has not been collected into repo state yet.

## Release State

- The latest San Diego lodging implementation is `FT-IMP-004`, commit `326501bd32399421c56cbe0f4e4065146166a062`.
- GitHub Pages run `29796506753` succeeded. The production release marker matched the commit, both lodging URLs passed their content invariants, and production SEO QA returned 0 errors and 0 warnings.
- The repository and `origin/main` were clean and aligned at the implementation commit before this documentation reconciliation.
- The repository roadmap has no calendar observation hold after the user's manual override. The latest central Control Room report still carries the superseded July 27 hold and needs central reconciliation; until then, automated dispatch touching the stay URL should treat the ledger mismatch as unresolved rather than schedule work from the date. `FT-EVAL-002` becomes eligible only when both revised lodging URLs have current crawl and protected query evidence.

## Public Pages

| Page | Full URL | Est. search demand/mo | Current GSC rank | Target rank | 2-3 top search queries | Current status | Done | Remaining / blocker | Next action |
|---|---|---:|---|---|---|---|---|---|---|
| Main things-to-do hub | https://familytripwise.com/things-to-do/san-diego-with-kids.html | 4.4K+ known core demand | UNKNOWN: latest inspection said URL unknown; no page-row position | Top 20 first, then Top 10 | `things to do in San Diego with kids`; `best things to do in San Diego with kids`; `San Diego with kids activities` | Live. Latest GSC snapshot said URL unknown/not indexed before the July 20 router deployment. | Added persona router for first-time, toddler/nap/stroller, teen/tween, lodging-led, and rainy/free/budget planners. Added official rainy/free/budget checks and updated freshness date to July 20, 2026. | Needs Google crawl/indexing and performance observation. | Observe indexing/performance unless a technical issue appears. |
| Stay areas / where to stay | https://familytripwise.com/where-to-stay/san-diego-with-kids.html | 360+ known stay-area demand; overlaps hotel demand | Avg position 59.67; 190 impressions | Top 20 | `where to stay in San Diego with kids`; `best area to stay in San Diego with kids`; `where should families stay in San Diego` | Live, indexed, strongest San Diego signal in latest GSC snapshot. | Five clear area choices, a seven-field comparison, interactive family-constraint checklist, four exact-hotel checks, and direct hotel-page routing replace duplicated area and mini-hotel sections. | Needs a fresh Google crawl before the revision can be interpreted. Exact route, stroller, quiet, accessibility, water, and room-selection conclusions remain gated. | Non-blocking `FT-EVAL-002` only after current crawl and protected query evidence exists. |
| Family hotel shortlist | https://familytripwise.com/where-to-stay/san-diego-family-hotels.html | 2.7K+ known hotel/resort/amenity demand | UNKNOWN: page newer than GSC performance window | Top 20 first, then Top 10 | `family friendly hotels in San Diego`; `best family hotels in San Diego`; `San Diego family resorts` | Live. Newer than the GSC performance window, so no performance claim yet. | Keeps eight detailed hotel records, approximate nightly prices, map, room facts, directional themes from sampled online reviews, and sources; trip-style cards and repeated methodology/caveats are compressed. | Needs crawl/indexing and early query evidence. Do not expand candidate count without a concrete gap. | Non-blocking `FT-EVAL-002` should test whether Google distinguishes hotel-list intent from area intent. |
| Toddler activities | https://familytripwise.com/things-to-do/san-diego-with-toddlers.html | 650-850 known toddler-query demand | Indexed, but no page-row position in latest snapshot | Top 10 | `things to do in San Diego with toddlers`; `San Diego with toddlers`; `San Diego toddler activities` | Live and indexed in latest GSC inspection. | Section-level pass preserves the comparison table, parent logistics, day plans, and cluster links while removing duplicate starter blocks and repetitive micro-fields. | Could use more official/current support for indoor, rainy, and free options later. | Observe after release; improve again only if GSC or new evidence identifies a concrete gap. |
| Teen activities | https://familytripwise.com/things-to-do/san-diego-with-teens.html | 700-900 known teen-query demand | UNKNOWN: latest inspection said URL unknown; no page-row position | Top 10 | `things to do in San Diego with teens`; `San Diego with teens`; `things to do with teens in San Diego` | Live. Latest GSC snapshot said URL unknown/not indexed. | Section-level pass preserves the activity table, detailed tradeoffs, and four route applications while reducing repeated formats and restoring the promised one-day plan. | Needs indexing/discovery first. Genuinely teen-specific additions require separate current evidence. | Observe indexing/discovery; research teen-specific additions only when evidence supports another edit. |
| Family itinerary | https://familytripwise.com/family-itinerary/san-diego-with-kids.html | 120+ known itinerary demand | Avg position 72.75; 12 impressions | Top 20 | `San Diego itinerary with kids`; `3 day San Diego itinerary with kids`; `San Diego family itinerary` | Live, indexed. | Section-level pass preserves the route matrix, rest/meal/skip dimensions, pacing rules, and cluster links while removing duplicate base plans and correcting the two-day structure. | Exact drive/transit/walk/wait/nap claims remain verification/human-review gated. | Observe after release; itinerary-pacing prototype remains a later evidence/review candidate. |
| Legacy shim | https://familytripwise.com/san-diego-with-kids.html | N/A | N/A: noindex shim | N/A | N/A | Noindex/follow legacy redirect-style page, outside sitemap. | Kept as compatibility path to the active things-to-do page. | No blocker. | Keep as-is. |
| Legacy shim | https://familytripwise.com/san-diego-things-to-do-with-kids.html | N/A | N/A: noindex shim | N/A | N/A | Noindex/follow legacy redirect-style page, outside sitemap. | Kept as compatibility path to the active things-to-do page. | No blocker. | Keep as-is. |
| Legacy shim | https://familytripwise.com/san-diego-where-to-stay-with-kids.html | N/A | N/A: noindex shim | N/A | N/A | Noindex/follow legacy redirect-style page, outside sitemap. | Kept as compatibility path to the active stay page. | No blocker. | Keep as-is. |

## Review Coverage

"Persona mapped" means the page was checked against the five San Diego research personas and its search job. "Section audited" means every visible content block was also reviewed for usefulness, verbosity, within-page repetition, evidence, and whether it should stay, compress, merge, move, or be removed.

| Page | Persona coverage | Competition coverage | Section-level editorial review | Latest verdict |
|---|---|---|---|---|
| Main things-to-do hub | P1-P5 mapped | Broad activities SERP and representative ranking pages reviewed | Complete on 2026-07-20 | Keep current router during observation; later compress duplicate age promos and repeated recommendation layers. |
| Stay areas / where to stay | P1, P2, P4 mapped | Detailed lodging SERP and competitor review complete | Complete and implemented under `FT-IMP-004` | Area decision role is clearer; duplicated area and named-hotel sections are removed while detail and the interactive checklist remain. |
| Family hotel shortlist | P1, P4 mapped | Detailed La Jolla Mom, Family Voyage, OTA, forum, and area/hotel intent review complete | Complete and implemented under `FT-IMP-004` | All eight property records remain; repeated category/method layers are compressed and review provenance is clearer. |
| Toddler activities | P2, P5 mapped | Age-specific SERP and representative competitors reviewed | Complete; implemented under `FT-IMP-003` | Table, parent logistics, and day plans remain; duplicate starter and repetitive micro-fields are removed. |
| Teen activities | P3, P5 mapped | Age-specific SERP and representative competitors reviewed | Complete; implemented under `FT-IMP-003` | Tradeoffs and four route applications remain. Research genuinely teen-specific additions separately. |
| Family itinerary | P1, P2, P3, P5 mapped | Itinerary SERP and representative ranking pages reviewed | Complete; implemented under `FT-IMP-003` | Route matrix and stop rules remain; duplicate base plans are removed and the two-day structure is corrected. |
| Legacy shims | N/A | N/A | N/A | Keep noindex/follow and outside the sitemap. |

## Unpublished San Diego Prototypes

| Prototype | Repo path | Current status | Done | Remaining / blocker | Next action |
|---|---|---|---|---|---|
| Stay decision prototype | `src/prototypes/san-diego-stay-decision/` | Unpublished. | Audited in San Diego research pack. | Area-fit scores and trust-sensitive claims remain human-review gated; the old calendar observation block is removed. | Reconsider only if it adds a concrete capability beyond the live checklist. |
| Itinerary pacing prototype | `src/prototypes/san-diego-itinerary-pacing/` | Unpublished. | Audited in San Diego research pack. | Needs reviewed integration; cannot publish exact time, route, stroller, or nap practicality claims without stronger evidence/review. | Good later candidate after hub routing and stay-page evaluation. |
| Family reset atlas prototype | `src/prototypes/san-diego-family-reset-atlas/` | Unpublished. | Audited in San Diego research pack. | Blocked by real-record evidence, structured-reuse permissions, route/access/sensory claim safety, and publication review. | Keep unpublished until evidence and reuse gates are solved. |

## Current Priority

`FT-EVAL-001` is superseded because the July 13 stay-checklist change is no longer isolated after the user-directed lodging revision. The next lodging measurement item is non-blocking `FT-EVAL-002`: run it only after Google has current crawl and protected query evidence for both revised URLs, and use it to assess area-vs-hotel query interpretation rather than claim short-window ranking causality.
