# San Diego Page Status

Last updated: 2026-07-20

Sources:

- Latest public-safe GSC snapshot: `ops/gsc-snapshots/2026-07-20.md`
- San Diego SERP/persona research: `docs/research/san-diego-cluster-research-decision-pack.md`
- Current roadmap: `ops/seo-roadmap.md`

Note: GSC index/performance status below comes from the July 20 snapshot, collected before the July 20 `FT-IMP-002` deployment. Production page availability was verified after deployment.

## Public Pages

| Page | Full URL | Current status | Done | Remaining / blocker | Next action |
|---|---|---|---|---|---|
| Main things-to-do hub | https://familytripwise.com/things-to-do/san-diego-with-kids.html | Live. Latest GSC snapshot said URL unknown/not indexed before the July 20 router deployment. | Added persona router for first-time, toddler/nap/stroller, teen/tween, lodging-led, and rainy/free/budget planners. Added official rainy/free/budget checks and updated freshness date to July 20, 2026. | Needs Google crawl/indexing and performance observation. | Observe indexing/performance unless a technical issue appears. |
| Stay areas / where to stay | https://familytripwise.com/where-to-stay/san-diego-with-kids.html | Live, indexed, strongest San Diego signal in latest GSC snapshot: 190 impressions. | Earlier stay-decision and hotel-check improvements are live. | Protected observation window blocks normal edits until July 27, 2026. Exact route, stroller, quiet, value, and room-selection claims remain human-review gated. | `FT-EVAL-001` on or after July 27, 2026 with fresh GSC/protected query evidence. |
| Family hotel shortlist | https://familytripwise.com/where-to-stay/san-diego-family-hotels.html | Live. Newer than the GSC performance window, so no performance claim yet. | Published researched 8-hotel comparison with rough nightly ranges, Google map, review-pattern wording, and verification checks. | Needs crawl/indexing and early performance observation. Avoid expanding into area intent too much. | Observe. Later consider resort section or refinements only with evidence. |
| Toddler activities | https://familytripwise.com/things-to-do/san-diego-with-toddlers.html | Live and indexed in latest GSC inspection. | Existing toddler specialist page. Now receives stronger routing from the main hub. | Could use more official/current support for indoor, rainy, and free options later. | Improve only after hub routing settles or GSC shows toddler-specific signal. |
| Teen activities | https://familytripwise.com/things-to-do/san-diego-with-teens.html | Live. Latest GSC snapshot said URL unknown/not indexed. | Existing teen specialist page. Now receives stronger routing from the main hub. | Needs indexing/discovery first. Teen fit language should stay research-based, not personally verified. | Observe indexing/discovery, then improve if signal appears. |
| Family itinerary | https://familytripwise.com/family-itinerary/san-diego-with-kids.html | Live, indexed, 12 impressions in latest GSC snapshot. | Existing 1-day, 2-day, 3-day, toddler, teen, and rainy-day itinerary guidance. | Exact drive/transit/walk/wait/nap claims remain verification/human-review gated. | Later candidate: integrate itinerary-pacing prototype after page-routing work and claim-safety review. |
| Legacy shim | https://familytripwise.com/san-diego-with-kids.html | Noindex/follow legacy redirect-style page, outside sitemap. | Kept as compatibility path to the active things-to-do page. | No blocker. | Keep as-is. |
| Legacy shim | https://familytripwise.com/san-diego-things-to-do-with-kids.html | Noindex/follow legacy redirect-style page, outside sitemap. | Kept as compatibility path to the active things-to-do page. | No blocker. | Keep as-is. |
| Legacy shim | https://familytripwise.com/san-diego-where-to-stay-with-kids.html | Noindex/follow legacy redirect-style page, outside sitemap. | Kept as compatibility path to the active stay page. | No blocker. | Keep as-is. |

## Unpublished San Diego Prototypes

| Prototype | Repo path | Current status | Done | Remaining / blocker | Next action |
|---|---|---|---|---|---|
| Stay decision prototype | `src/prototypes/san-diego-stay-decision/` | Unpublished. | Audited in San Diego research pack. | Blocked by stay-page observation window until July 27, 2026, plus human-review gates for area-fit scores and trust-sensitive claims. | Reconsider after `FT-EVAL-001`. |
| Itinerary pacing prototype | `src/prototypes/san-diego-itinerary-pacing/` | Unpublished. | Audited in San Diego research pack. | Needs reviewed integration; cannot publish exact time, route, stroller, or nap practicality claims without stronger evidence/review. | Good later candidate after hub routing and stay-page evaluation. |
| Family reset atlas prototype | `src/prototypes/san-diego-family-reset-atlas/` | Unpublished. | Audited in San Diego research pack. | Blocked by real-record evidence, structured-reuse permissions, route/access/sensory claim safety, and publication review. | Keep unpublished until evidence and reuse gates are solved. |

## Current Priority

The next substantive queued San Diego action is `FT-EVAL-001`, due on or after 2026-07-27. It should evaluate the protected San Diego stay page using fresh GSC evidence and protected query data before deciding whether to edit the stay page, hotel page, or itinerary page next.
