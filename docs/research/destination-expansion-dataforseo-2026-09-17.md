# Destination Expansion: DataForSEO Comparison

Action `FT-RES-046` / `SRR-068` / learning `LRN-036`. Research date: September 17, 2026 America/New_York; API timestamps cross into September 18 UTC. Authority: direct user request to run research now, within the approved cumulative $5 usage cap. No destination publication or account funding is authorized.

## Decision

Prioritize **Orlando and Cancun for the next bounded evidence/product briefs**, not a ten-city rollout. They have the strongest usable lodging demand among the ten proposed destinations, but neither is an easy-ranking finding. London and Washington, DC are second-wave research candidates. Keep Miami and Nashville in contention rather than allowing the new list to erase prior controls. Montreal and Chattanooga lose their earlier first-research-priority status on the available lodging evidence, not because their activity demand is zero.

Do not publish from this screen. Existing `FT-PUB-006` remains pending explicit user approval and refreshed job-specific evidence; hotel demand does not itself validate its previously proposed Orlando all-ages activity hub. No new implementation is promoted. At most these two destination candidates move toward a subsequent publication decision after evidence feasibility is demonstrated.

Machine-readable evidence: [API comparison and request/cost manifest](destination-expansion-dataforseo-2026-09-17.json). Preliminary geographic, source-conflict and maintenance hypotheses remain in [FT-RES-045](destination-expansion-screen-2026-09-17.md).

## Collection And Limitations

- 280 distinct operator-authored phrases: 15 common formulations for each of 18 destinations, plus 10 relevant resort/amenity/geographic aliases. This is a bounded seed-and-modifier screen, not provider-discovered exhaustive keyword expansion. It includes ten candidates, Miami/Dallas/Nashville historical controls, and all five existing cities. No new destinations were added to the site.
- All requests use US market `2840`, English `en`. Volume/CPC come from one Google Ads live request; organic difficulty comes from the separate DataForSEO Labs overview. CPC is USD advertising cost, not affiliate revenue or expected earnings. Google Ads competition is not organic KD. No global, Canadian, UK or Mexican search-market totals are mixed in.
- Labs returned records for 186/280 phrases, numeric volume for 84, and numeric organic KD for 83. Google Ads live returned numeric volume for 91/280. The other 189 volume values remain UNKNOWN, not zero. Of 83 numeric KD values, 64 are zero; we retain them faithfully but do not equate them with attainable rankings. KD is not compared numerically to historical Semrush KD.
- A decisive coverage problem: many explicit kid/toddler/itinerary/area phrases have missing volume, including every `things to do in {destination} with kids` seed. DataForSEO documents restrictions affecting kid-related terms. This is consistent with the observed pattern, not a verified cause for each missing row. Null-volume Labs records can contain all-zero historical arrays; do not use those arrays to infer no searches or a demand collapse. [Provider explanation, displayed update 01.12.2021, rechecked September 17](https://dataforseo.com/help-center/no-search-volume-data-for-some-keywords).
- Fresh API retrieval is not fresh measurement of every metric. Retained Labs update fields range June 11-September 17, 2026. Google Ads monthly history covers September 2025-August 2026 where available; no separate Ads metric-update timestamp is supplied. We preserve both endpoint records rather than silently overwriting one. Both derive volume from Google Ads, so agreement is not independent corroboration. [Keyword overview documentation](https://docs.dataforseo.com/v3/dataforseo_labs/google/keyword_overview/live/).
- Keyword volumes are rounded provider estimates and can group close variants. Never add these columns, aliases or query families into unique searchers or a traffic forecast. An apparent increase from July Semrush, such as Orlando hotels 1,000 then versus 6,600 now, is not established growth: vendor, collection window, grouping and seasonality differ.
- Twelve live Google result sets use US national location, English, desktop/Windows, depth 10. They returned 8-10 organic URLs per query alongside other result types. This is one device/location/time sample, not a universal top ten or personalized result. Stored rank_group is organic order; rank_absolute includes intervening features. We retain URLs/domains/ranks/types, not copied page text, thread content or user identities. [SERP endpoint documentation](https://docs.dataforseo.com/v3/serp/google/organic/live/advanced/).

## Comparable Lodging Demand

Each volume is estimated average **monthly US searches for the exact submitted phrase**, subject to close-variant grouping. Column A is `family friendly hotels in {destination}`; B is `best family hotels in {destination}`. KD and CPC refer to A only. These are query-level estimates, not whole-destination demand or achievable site impressions.

| Proposed destination | A volume | B volume | A organic KD | A CPC USD | Research disposition |
|---|---:|---:|---:|---:|---|
| Orlando | 6,600 | 590 | 1 | 2.86 | First domestic evidence brief; test amenity/party/park constraints, not a generic hotel list |
| Cancun | 480 | 480 | 0 | 4.39 | First international evidence brief; resort phrases below better match its lodging job |
| London, UK | 720 | 1,000 | 0 | 5.45 | Second wave; larger-party rooms already have strong family-publisher coverage |
| Washington, DC | 720 | 720 | 0 | 2.77 | Second wave; official and hotel pages already cover many family amenities |
| Boston | 590 | 480 | 0 | 2.77 | Retain; controlled SERP pair and property feasibility not yet inspected |
| St Louis | 320 | 140 | 0 | 1.98 | Retain lower priority; exclude medical/residential intent before expansion |
| Montreal | 170 | 140 | 0 | 2.71 | Defer behind stronger measured lodging opportunities; do not assume easy competition |
| Lisbon | 140 | 140 | 0 | 3.22 | Defer; room/access evidence burden and smaller measured US lodging signal |
| Puerto Vallarta | 110 | 110 | 8 | 2.68 | Retain resort-focused alternative; broader resort geography unresolved |
| Chattanooga | 20 | UNKNOWN | UNKNOWN | 1.37 | Defer lodging-led launch; activities remain quantitatively unresolved |

London's base phrases are unqualified `london`. Both inspected result sets predominantly identify UK destinations/properties; no Ontario-targeted organic URL was identified. That does not partition the volume by intended city. The explicit `family friendly hotels in london uk` alias also returns 720 and must not be added to its unqualified counterpart.

| Additional exact phrase | Monthly US estimate | Organic KD | CPC USD | Interpretation |
|---|---:|---:|---:|---|
| orlando hotels with water parks | 8,100 | 45 | 3.53 | Stronger amenity-specific signal, materially higher reported KD |
| orlando hotels with lazy river | 3,600 | 0 | 2.96 | Related amenity need; separate URL not established |
| best all inclusive family resorts in cancun | 3,600 | 1 | 3.68 | Best international commercial signal in this bounded screen |
| best family resorts in cancun | 2,400 | 4 | 3.55 | Overlapping resort decision, not additive unique demand |
| cancun family resorts | 1,900 | 16 | 3.07 | Same broad family-resort category, not a third proposed page |
| puerto vallarta family resorts | 480 | 9 | 2.54 | Smaller resort-led alternative to Cancun |
| london hotels for families of 5 | 170 | 0 | 4.16 | Specific room-fit demand, but existing specialist coverage is substantial |

Seasonality matters: Orlando A has June and July 2026 estimates of 22,200 each, August 5,400 and January 1,900. Its 6,600 headline should not be treated as steady monthly demand; these spikes also merit independent corroboration before forecasting. Cancun's all-inclusive phrase peaks at 5,400 in January versus 2,900 in August. London B ranges from 720 in August to 1,600 in January in this twelve-month sample. No multi-year growth claim follows.

### Same-Provider Controls

| Control destination | A volume | B volume | A KD | A CPC USD |
|---|---:|---:|---:|---:|
| Miami, historical runner-up | 1,000 | 480 | 0 | 3.35 |
| Dallas, historical runner-up | 480 | 210 | 0 | 4.24 |
| Nashville, historical runner-up | 720 | 170 | 0 | 2.45 |
| San Diego, existing | 2,900 | 1,000 | 6 | 2.44 |
| San Antonio, existing | 880 | 170 | 0 | 2.94 |
| Chicago, existing | 1,300 | 590 | 0 | 2.31 |
| Las Vegas, existing | 9,900 | 1,900 | 0 | 2.58 |
| New York City, existing | 1,300 | 1,900 | 0 | 2.66 |

These controls reject two shortcuts: international destinations are not automatically bigger opportunities, and smaller cities are not automatically easier. Existing Las Vegas and San Diego already have substantial measured lodging demand. San Antonio's current visibility does not prove that ten additional cities will rank similarly. September 17 GSC is reused same-day finalized API orientation (1,566 impressions/six clicks/property position 56.04, finalized through September 15, 24/28 indexed); no aligned query cohort supports a causal expansion claim. Existing pages and their observation windows remain untouched.

## Live Result Overlap

Exact URL set intersection, no parameter or domain collapsing. Jaccard is intersection divided by union; organic counts vary because depth includes result features. The JSON includes the complete returned sets and timestamps, around September 18 00:31-00:33 UTC (September 17 Eastern).

| Query pair | Organic counts | Shared exact URLs | Jaccard | Result/intent interpretation |
|---|---:|---:|---:|---|
| Cancun best family resorts / best all-inclusive family resorts | 9 / 8 | 2 | 13.3% | Resort brands, community, Tripadvisor and US News; AI answers, hotel pack and video. Broad result-category overlap but limited exact URLs; do not infer either two URLs or proven consolidation from this one pair |
| Orlando family-friendly hotels / best family hotels | 8 / 9 | 2 | 13.3% | Hotel/OTA inventory, family publishers and amenity lists; hotel pack on both. International Drive and Disney/non-Disney scope changes require a tighter follow-up job test |
| London family-friendly hotels / best family hotels | 9 / 9 | 6 | 50.0% | Strong overlapping UK hotel/large-party job; Conde Nast, family writers, brands, community and hotel pack |
| DC family-friendly hotels / best family hotels | 10 / 10 | 7 | 53.8% | Strong common property-selection job; official DMO, brands, community, booking sites and hotel pack |
| Montreal family-friendly hotels / best family hotels | 9 / 9 | 7 | 63.6% | Strong common hotel/base job; family publishers, hotel brands and OTAs, with hotel pack |
| Chattanooga things to do with kids / with kids | 9 / 9 | 6 | 50.0% | Activity/weekend planning, official tourism, firsthand family publishers and community; missing Ads volume is not missing SERP intent |

Recurring domains include Reddit, Tripadvisor and Marriott across multiple cities, plus destination-specific official/firsthand sources. These are meaningful competitive constraints despite KD values near zero. Hotel packs and AI answers can absorb attention; this screen does not estimate organic click share. No link-profile audit was purchased, so domain authority or a numeric ranking probability is not claimed.

## Representative Page Inspections

All pages below were directly text-inspected September 17 Eastern. This is desk research, not user testing, rendered mobile QA, endorsement or firsthand travel. No linked booking flow was completed. Ages/amenities mentioned by publishers were not promoted to verified property facts.

| Source and visible date | Existing advantage | Candidate information gain and limit |
|---|---|---|
| [Family Travel Magazine Orlando](https://www.familytravelmagazine.com/kid-friendly-hotels-in-orlando/), August 13, 2025 | Discloses stays and hosted visits; compares park/airport contexts and amenity highlights with price handoffs | We cannot duplicate the claimed stays. Test source-dated room-party fit and complete stay costs against fixed park/rest-day constraints, not more hotel descriptions |
| [Orlando Parenting water features](https://orlando-parenting.com/family-orlando-hotels-water-parks/), displayed March 2/3, 2025 | Already distinguishes water features, admission and nearby-versus-on-property attractions; some firsthand photos/context | A 2025 seasonal admission offer is still visible. This is a dated-claim refresh opportunity, not proof the current offer is false; verify current official inclusions before using it |
| [Finest Playa Mujeres family page](https://www.finestresorts.com/cancun/finest-playa-mujeres/finest-for-families/), update UNKNOWN | First-party property identity, family-suite positioning and links to suites, map, transfers and fact sheet; ranks in both sampled Cancun queries | Cross-property eligibility and inclusion checks still require linked details and exact party/date checks. Playa Mujeres labeling demonstrates why Cancun marketing geography cannot be treated as one neighborhood |
| [London larger-party guide](https://jessicalynnwrites.com/2024/10/where-to-stay-in-london-with-a-family/), URL October 2024; current update UNKNOWN | Early shortlist, geographic sections, bedding/kitchen fields, distinguishes some stays from research and warns about connecting-room uncertainty | Family-of-five coverage already exists. Any improvement must verify exact current occupancy/booking conditions and reduce comparison work; do not claim an uncovered room-size niche |
| [Washington.org family hotels](https://washington.org/places-to-stay/family-friendly-hotels), update UNKNOWN | Official destination inventory with hotel links, neighborhood context, kitchen/pool/family provisions | Source-current party capacity, selected museum anchors and comparable totals are a hypothesis; the official page's neighborhood or walkability statements are not our verification |
| [The Family Voyage Montreal](https://www.thefamilyvoyage.com/best-montreal-hotels-for-families/), May 28, 2025 | Firsthand trip context, neighborhood-to-lodging routing and apartment alternatives; first organic result in both sampled queries | A generic area/hotel list is not novel. Lower measured US lodging demand does not remove this competitor advantage |

Mommy Poppins' Cancun result was identified in the API but direct retrieval failed once. Its page was not inspected; no content-quality judgment is inferred. The earlier FamTravelClub versus Hyatt Sunscape occupancy conflict remains unresolved prior evidence, not freshly reverified in this action. No private forums, sign-ins, comments, identities or outreach were accessed.

## Next Evidence-Eligible Work

1. Orlando: one three-property feasibility brief for a family of five with fixed park days and a hotel/rest day. Require room occupancy by child age, actual water-feature admission/inclusions, current mandatory fees, and geographic/park-boundary clarity. Compare task completion with the two inspected publisher pages. Repeat a tighter pair of SERPs for that job before proposing a canonical URL. Current evidence does not justify splitting water-park/lazy-river/hotel variants.
2. Cancun: one three-resort feasibility brief for mixed-age children and a five-person party. Require source-dated exact room fit, club age rules, inclusion/transfer terms, total-cost unknowns and explicit Hotel Zone/Playa Mujeres/wider-region labels. Resolve or visibly retain the existing room-capacity conflict. Do not promise sea conditions, safety, personal experience or a firm booking recommendation. Repeat focused family-room/inclusion SERPs before URL selection.

These are research suggestions, not queued automatic launches. Defer a ten-city rollout until at least one brief demonstrates maintainable information gain, passes independent review and receives the required publication approval. Missing activity volumes need a different explicitly assessed data source or later qualified evidence; no Semrush renewal or extra paid product is necessary just to finish this screen.

## Learning, QA And Release

`LRN-036` hypothesis: this DataForSEO batch can fully replace prior keyword research and low KD can identify easy expansion wins. Result: reject. It supports a lodging-led shortlist but systematically misses many child-worded queries; live SERPs expose substantial competition even when reported KD is zero. Confidence high for returned counts/overlap, medium for the research priority, low for true demand totals, attainable ranks or user satisfaction. Reusable lesson: measure provider coverage and inspect live result composition before applying an opportunity score. Falsify when independently sourced same-market activity estimates and task-specific evidence change the order, or a repeated live SERP contradicts the retained job/competitive pattern.

API spending is **$0.14832**: Labs overview $0.03432, Ads live volume $0.09, twelve SERPs at $0.002 each. All fourteen calls succeeded; no retries, pending-cost reservations, top-ups, subscriptions or optional paid add-ons. Cost is summed from these response receipts, not inferred from the shared account balance. Credentials remained outside the repository and were never printed or included in request manifests.

Full native tests: 167/167 passed. Focused data/privacy/state checks and independent read-only review follow before the exact ten-path docs-only commit. No site changes or Pages release are involved.

Final review: Newton `01a0b1f3-02a3-7850-8289-3b55ffd2d31f` returned cycle-one **PASS**, no P0-P3. Independently reproduced coverage, all table/seasonal values, shared URLs/Jaccard, cost arithmetic, source checks, scope and privacy. Focused validation, operator-state and whitespace were independently run. Full167/167,66snapshot,freshness0 and localSEO0errors/warnings passed in the operator run; reviewer did not repeat those or authenticate billing. Costs/provenance are checked against retained response records, not an independent account audit. Ten exact paths and103unique roadmap IDs pass, no site changes. Earlier review-pending labels are chronology; exact-path docs-only push remains.
