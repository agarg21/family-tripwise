# San Diego Page Status

Last updated: 2026-08-04

Sources:

- Implementation baseline GSC snapshot: `ops/gsc-snapshots/2026-07-21.md`
- Current public-safe GSC snapshot: `ops/gsc-snapshots/2026-08-04.md`
- Current lodging query interpretation: `docs/research/san-diego-lodging-query-interpretation-2026-08-04.md`
- San Diego SERP/persona research: `docs/research/san-diego-cluster-research-decision-pack.md`
- Section-level usefulness review: `docs/research/san-diego-section-level-editorial-audit.md`
- Historical Semrush-derived demand notes: `docs/plan/5-city-page-build-brief.md`, `docs/plan/seo-cluster-research-protocol.md`, `docs/research/age-specific-family-travel-demand.md`
- Current roadmap: `ops/seo-roadmap.md`
- Existing-page authority gap: `docs/research/san-diego-existing-page-authority-gap-2026-07-31.md`

Note: The implementation baseline remains the July 21 snapshot. The two lodging rows use the August 4 snapshot finalized through August 2; unrelated page rows retain their prior recorded baseline. Neither window can establish causal impact from a page change. Demand estimates are directional monthly US search demand from historical Semrush/research notes, not fresh keyword-tool pulls. Top queries are target/query-universe examples, not protected GSC query exports; complete protected rows remain outside this public repository.

## August 4 Lodging Interpretation Overlay

Fresh authenticated read-only GSC evidence collected August 4 is finalized through August 2. The family-hotel page remains indexed with a July 28 crawl; the stay-area page remains indexed with a July 31 crawl. Public page rows show 426 impressions and one click at page-average position 62.04 for stay areas and 175 impressions at position 74.11 for hotels.

`FT-EVAL-002` refreshed separate protected exports for both URLs. Of attributable impressions, 83.7% on the stay-area URL use hotel/resort wording, compared with 7.8% area/base wording; 94.0% on the hotel URL use hotel/resort wording. Fifty-four exact normalized queries occur on both pages. The hotel page is semantically clean, but the area page still absorbs much of the hotel query family. Because the 28-day export reaches only two dates beyond the stay-area crawl, this is a query-ownership and current-page-signal diagnosis, not a causal ranking verdict.

## July 31 Authority Overlay

`FT-AUTH-004` finds that Semrush detected zero legitimate referring domains for Family Tripwise as of 2026-07-31 among its current 11-domain sample. It detects 13 nofollow links, but every sampled source is low-authority SEO spam; links outside Semrush remain `UNKNOWN`. La Jolla Mom and The Family Voyage also have noisy profiles: the exact La Jolla Mom San Diego hotel page has 29 referring domains, 18 at Authority Score 0-10, while The Family Voyage's exact San Diego guide has only six referring domains and ten follow links. Their advantage is a smaller layer of credible editorial, travel, local, media, and industry citations on top of mature topical domains, not thousands of clean links to one page.

The user selected `FT-AUTH-005` / `IMP-042` on July 31. Its compact, source-dated 12-attraction logistics index and client-side CSV are released and production-verified at commit `e7c40ff4e770a2c94c6ed298808775c1ac9c9762` through Pages run `30667262994` after Aquinas cycle-two `PASS_WITH_P3`, with no P0-P2. It creates no separate data URL or canonical/indexable HTML page. Outreach remains a separate later user gate.

## Release State

- The latest San Diego lodging implementation is `FT-IMP-004`, commit `326501bd32399421c56cbe0f4e4065146166a062`.
- GitHub Pages run `29796506753` succeeded. The production release marker matched the commit, both lodging URLs passed their content invariants, and production SEO QA returned 0 errors and 0 warnings.
- The latest San Diego activity/hotel expansion is `FT-IMP-005`, commit `31bba30652d76c3d1664193532a9c508a83c6f32`; GitHub Pages run `29876597948` succeeded and production release/content/SEO verification passed.
- The latest San Diego authority enhancement is `FT-AUTH-005`, commit `e7c40ff4e770a2c94c6ed298808775c1ac9c9762`; GitHub Pages run `30667262994` succeeded, release.json matched, the target returned 200, and production invariants plus SEO QA passed.
- The repository roadmap and central Control Room have no calendar observation hold. `FT-EVAL-002` is complete and review-clean and promotes only a bounded stay-area role-clarification action; it does not justify another broad rewrite.

## Public Pages

| Page | Full URL | Est. search demand/mo | Current GSC page signal | Target rank | 2-3 top search queries | Current status | Done | Remaining / blocker | Next action |
|---|---|---:|---|---|---|---|---|---|---|
| Main things-to-do hub | https://familytripwise.com/things-to-do/san-diego-with-kids.html | 4.4K+ known core demand | No page row; URL Inspection says unknown to Google on July 31 | Top 20 first, then Top 10 | `things to do in San Diego with kids`; `best things to do in San Diego with kids`; `San Diego with kids activities` | Live; `FT-IMP-005` and the `FT-AUTH-005` authority enhancement are released and production-verified. | Keeps the persona router and 12 choices. One source-dated logistics index replaces the old comparison table; visible rows, embedded JSON, CSV, and schema names share one record source. | Discovery/indexing remains the first search blocker; no technical exclusion was found. Outreach is separately user-gated. | Observe discovery from fresh GSC; do not request indexing or edit the teen page without a verified defect. |
| Stay areas / where to stay | https://familytripwise.com/where-to-stay/san-diego-with-kids.html | 360+ known stay-area demand; overlaps hotel demand | Avg position 62.04; 426 impressions; 1 click | Top 20 | `where to stay in San Diego with kids`; `best area to stay in San Diego with kids`; `where should families stay in San Diego` | Live, indexed, and post-revision crawled July 31. | Five clear area choices, a seven-field comparison, interactive family-constraint checklist, four exact-hotel checks, and direct hotel-page routing replace duplicated area and mini-hotel sections. | Protected evidence shows 83.7% of attributable impressions use hotel/resort wording and only 7.8% area/base wording. The mixed search-facing title remains a concrete role signal to fix; the short post-crawl tail prevents a causal verdict. | `FT-IMP-022`: clarify five-area ownership in the title/H1/description and exact-property handoff without a broad rewrite or CTR claim. |
| Family hotel shortlist | https://familytripwise.com/where-to-stay/san-diego-family-hotels.html | 2.7K+ known hotel/resort/amenity demand | Avg position 74.11; 175 impressions; 0 clicks | Top 20 first, then Top 10 | `family friendly hotels in San Diego`; `best family hotels in San Diego`; `San Diego family resorts` | Live, indexed, and last crawled July 28; the 12-hotel `FT-IMP-005` revision is released and production-verified at `31bba30` through Pages run `29876597948`. | Keeps the original eight and adds La Jolla Shores Hotel, Hotel del Coronado, The Dana on Mission Bay, and Manchester Grand Hyatt for four concrete trip-style gaps. All 12 retain rough ranges, direct map links, official setup facts, current checks, and directional online-review themes. | Protected evidence shows 94.0% hotel/resort query ownership, but 54 normalized queries overlap the area page and internal routing is lighter. The shared My Map has not been externally updated with the four additions. | Keep the hotel page unchanged in `FT-IMP-022`; strengthen its ownership through the area-page handoff. |
| Toddler activities | https://familytripwise.com/things-to-do/san-diego-with-toddlers.html | 650-850 known toddler-query demand | Avg position 37.50; 28 impressions; 0 clicks | Top 10 | `things to do in San Diego with toddlers`; `San Diego with toddlers`; `San Diego toddler activities` | Live and indexed in the July 31 inspection. | Section-level pass preserves the comparison table, parent logistics, day plans, and cluster links while removing duplicate starter blocks and repetitive micro-fields. | Could use more official/current support for indoor, rainy, and free options later. | Observe after release; improve again only if GSC or new evidence identifies a concrete gap. |
| Teen activities | https://familytripwise.com/things-to-do/san-diego-with-teens.html | 700-900 known teen-query demand | No page row; URL Inspection says unknown to Google on July 31 | Top 10 | `things to do in San Diego with teens`; `San Diego with teens`; `things to do with teens in San Diego` | Live; the July 31 GSC inspection reports URL unknown/not indexed. | Section-level pass preserves the activity table, detailed tradeoffs, and four route applications while reducing repeated formats and restoring the promised one-day plan. | Needs indexing/discovery first. Genuinely teen-specific additions require separate current evidence. | Observe indexing/discovery; research teen-specific additions only when evidence supports another edit. |
| Family itinerary | https://familytripwise.com/family-itinerary/san-diego-with-kids.html | 120+ known itinerary demand | Avg position 66.06; 17 impressions; 0 clicks | Top 20 | `San Diego itinerary with kids`; `3 day San Diego itinerary with kids`; `San Diego family itinerary` | Live, indexed, and crawled July 31. | Section-level pass preserves the route matrix, rest/meal/skip dimensions, pacing rules, and cluster links while removing duplicate base plans and correcting the two-day structure. | Exact drive/transit/walk/wait/nap claims remain verification/human-review gated. | Observe after release; itinerary-pacing prototype remains a later evidence/review candidate. |
| Legacy shim | https://familytripwise.com/san-diego-with-kids.html | N/A | N/A: noindex shim | N/A | N/A | Noindex/follow legacy redirect-style page, outside sitemap. | Kept as compatibility path to the active things-to-do page. | No blocker. | Keep as-is. |
| Legacy shim | https://familytripwise.com/san-diego-things-to-do-with-kids.html | N/A | N/A: noindex shim | N/A | N/A | Noindex/follow legacy redirect-style page, outside sitemap. | Kept as compatibility path to the active things-to-do page. | No blocker. | Keep as-is. |
| Legacy shim | https://familytripwise.com/san-diego-where-to-stay-with-kids.html | N/A | N/A: noindex shim | N/A | N/A | Noindex/follow legacy redirect-style page, outside sitemap. | Kept as compatibility path to the active stay page. | No blocker. | Keep as-is. |

## Review Coverage

"Persona mapped" means the page was checked against the five San Diego research personas and its search job. "Section audited" means every visible content block was also reviewed for usefulness, verbosity, within-page repetition, evidence, and whether it should stay, compress, merge, move, or be removed.

| Page | Persona coverage | Competition coverage | Section-level editorial review | Latest verdict |
|---|---|---|---|---|
| Main things-to-do hub | P1-P5 mapped | Broad activities SERP and representative ranking pages reviewed; wider candidate pool refreshed 2026-07-21 | Complete; 12-choice expansion review-clean | Preserve the router, compare 12 primary choices, and keep extra prose limited to additions with materially different planning friction. |
| Stay areas / where to stay | P1, P2, P4 mapped | Detailed lodging SERP and competitor review complete | Complete and implemented under `FT-IMP-004` | Area decision role is clearer; duplicated area and named-hotel sections are removed while detail and the interactive checklist remain. |
| Family hotel shortlist | P1, P4 mapped | Detailed competitor/OTA/forum review plus wider candidate and current-source refresh complete 2026-07-21 | Complete; 12-hotel expansion review-clean | Keep the 12 only because each serves a distinct trip shape; retain current construction/renovation and room-neighborhood checks. |
| Toddler activities | P2, P5 mapped | Age-specific SERP and representative competitors reviewed | Complete; implemented under `FT-IMP-003` | Table, parent logistics, and day plans remain; duplicate starter and repetitive micro-fields are removed. |
| Teen activities | P3, P5 mapped | Age-specific SERP and representative competitors reviewed | Complete; implemented under `FT-IMP-003` | Tradeoffs and four route applications remain. Research genuinely teen-specific additions separately. |
| Family itinerary | P1, P2, P3, P5 mapped | Itinerary SERP and representative ranking pages reviewed | Complete; implemented under `FT-IMP-003` | Route matrix and stop rules remain; duplicate base plans are removed and the two-day structure is corrected. |
| Legacy shims | N/A | N/A | N/A | Keep noindex/follow and outside the sitemap. |

## Unpublished San Diego Prototypes

| Prototype | Repo path | Current status | Done | Remaining / blocker | Next action |
|---|---|---|---|---|---|
| Stay decision prototype | `src/prototypes/san-diego-stay-decision/` | Unpublished. | Audited in San Diego research pack. | Area-fit scores and trust-sensitive claims remain human-review gated; the old calendar observation block is removed. | Reconsider only if it adds a concrete capability beyond the live checklist. |
| Itinerary pacing prototype | `src/prototypes/san-diego-itinerary-pacing/` | Unpublished. | Audited in San Diego research pack. | Needs reviewed integration; cannot publish exact time, route, stroller, or nap practicality claims without stronger evidence/review. | Good later candidate after hub routing and stay-page evaluation. |
| Family reset atlas prototype | `src/prototypes/san-diego-family-reset-atlas/` | Unpublished; paused/closed by the user after `FT-AUTH-002` completed 39 internal candidate records across 13 anchors. | The 39 records, source register, and 13 anchors are durable, but the prototype remains outside `site/**`. | None for the current queue because the direction is closed. If explicitly revived, coordinates, trust-sensitive human review, structured-reuse permissions, and parent-usability gates remain. | Do not schedule or manufacture follow-up unless the user explicitly revives the direction. |

## Current Priority

`FT-IMP-005` is released and production-verified at `31bba30` through Pages run `29876597948`. `FT-EVAL-001` remains superseded. `FT-AUTH-005` / `IMP-042` is released and production-verified at `e7c40ff` through Pages run `30667262994`. `FT-EVAL-002` now supplies the public-safe area-versus-hotel interpretation baseline and promotes only `FT-IMP-022`. Do not infer a July rewrite result, merge the URLs, or manufacture another action from cadence.
