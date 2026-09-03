# GSC Impressions Versus Researched Keyword Demand

Action: `FT-RES-028` / `SRR-049`

Prepared: 2026-09-03

Scope: compare current 28-day Search Console exposure with the maintained monthly search-demand estimates for all 26 destination-cluster pages

## Answer

Current impressions are **not yet in line with researched demand in a demand-capture sense**. They are directionally consistent with Google testing several of the intended query families, but rank and indexation dominate the observed distribution:

- The ungrouped property total is 1,937 impressions. The 22 cluster pages with a performance row sum to 1,983 page-grouped impressions; four cluster pages have no row. These totals are not additive because Search Console applies different aggregation and anonymization behavior when dimensions change.
- The protected export disclosed 1,492 impressions for those cluster pages at page-query level. The 491-impression difference from the page-grouped sum cannot be attributed because Search Console omits anonymized queries and may apply other row limits.
- A conservative role-alignment pass attributed 1,123 disclosed impressions to the destination, family/age, and page job. Their impression-weighted average position was about 72.8.
- Only 166 disclosed impressions came from the maintained exact tracked phrases. This is the closest available comparison with exact monthly keyword estimates, and it is far below the researched head demand.
- Four URLs with meaningful researched demand still have no performance row and remain not indexed: Chicago teens, New York City itinerary, San Diego all-ages activities, and San Diego teens.

The data therefore says more about current exposure than about whether the keyword estimates were right. It does not support adding pages, rewriting pages, or diagnosing CTR.

## Evidence Boundary

| Evidence | Freshness | Use | Limit |
|---|---|---|---|
| `ops/gsc-snapshots/2026-09-02.json` and `.md` | API collection 2026-09-02; conservatively finalized through 2026-08-31 | Property totals, page-grouped totals, page-average position, sitemap, and priority URL Inspection | Property and page-grouped totals are not additive; page rows also cannot be divided by one exact-keyword estimate as market share. |
| Protected GSC page-query export | Read-only collection 2026-09-03 for 2026-08-04 through 2026-08-31; GitHub Actions run `33736746095` | Private aggregation of disclosed exact tracked and role-aligned impressions | The 476 complete rows remain outside the repository. Anonymized queries are omitted; no country/device rows were collected. |
| Chicago, Las Vegas, New York City, and San Antonio research packs/status | Authenticated Semrush US estimates collected 2026-07-22 through 2026-07-26 | Directional exact monthly search estimates and overlapping variant sets | Provider estimates are modeled, US-only, and not a traffic forecast. Similar variants overlap and are not summed. |
| San Diego status and historical demand research | Maintained portfolio estimates, with historical provenance rather than a new September refresh | Directional anchor ranges for existing San Diego page roles | The estimates are less current and less uniform than the July city packs; plus signs and ranges must remain explicit. |

Search Console covers all available property impressions, while the demand estimates use the US market. Search volume estimates searches; Search Console counts occasions when a result was shown. A page at average position 60-90 should not be expected to receive an impression for every search. Neither source measures user satisfaction.

## Method

1. Use the highest maintained exact monthly estimate in each overlapping phrase family as a conservative anchor where the dated city packs provide one. Preserve the maintained historical range or plus-marked anchor for San Diego. Do not sum similar variants.
2. Keep explicit ranges and plus signs where the maintained research does not support a point estimate. Treat unavailable values as unavailable, not zero.
3. Aggregate protected rows by page without retaining or publishing row text.
4. Define a role-aligned cohort by requiring the destination, a family or age signal, and the page job. Exclude conflicting jobs such as hotel/resort wording from area cohorts or itinerary wording from activity cohorts.
5. Separately aggregate impressions from the exact tracked phrase set already documented in public page status.
6. Use `aligned impressions / anchor demand` only as a rough exposure diagnostic. It is not impression share, market share, volume validation, or a ranking score.

The private cohort rules are reproducible without exposing row text:

| Page role | Required signals | Exclusions or assignment note |
|---|---|---|
| All-ages activities | Destination plus kid, child, family/families, or supported younger-child wording | Exclude hotel/resort, stay/area/neighborhood, itinerary, teen, and tween jobs. Broad `destination with kids` wording belongs here under the current page architecture. |
| Teen/tween specialist | Destination plus teen or tween wording | Keep separate from the all-ages cohort. |
| Toddler specialist | Destination plus toddler, baby, or preschool wording | Used only for the existing San Diego toddler URL. |
| Stay areas | Destination plus a family/age signal and a where-to-stay, place-to-stay, area, neighborhood, or base signal | Exclude hotel and resort wording. |
| Family hotels | Destination plus a family/age signal and a hotel or resort signal | Property-only and generic lodging rows without a family/age signal remain outside the strict cohort. |
| Family itinerary | Destination plus a family/age signal and an itinerary, numbered-day, or weekend signal | Generic itinerary rows without a family/age signal remain outside the strict cohort. |

Las Vegas accepts Las Vegas or Vegas as the destination signal; New York City accepts New York or NYC. The exact tracked set is the public 2-3-query target set in each destination status file.

## Page Comparison

`No row` means the current public snapshot has no performance row; priority URL Inspection classifies those same four pages as not indexed. Ratios use role-aligned impressions, not page totals.

| City / page role | Monthly demand anchor | Page impressions | Page avg. position | Role-aligned impressions | Aligned / anchor | Exact tracked impressions | Reading |
|---|---:|---:|---:|---:|---:|---:|---|
| Chicago activities | 5,400 | 27 | 64.26 | 23 | 0.4% | 15 | Intended head family is present, but exposure is very small. |
| Chicago teens | 720 | No row | N/A | 0 | 0% | 0 | Discovery/indexing blocks any demand comparison. |
| Chicago stay areas | 110 | 32 | 43.25 | 18 | 16.4% | 6 | Family area intent is present; low rank still limits exposure. |
| Chicago itinerary | 20 | 36 | 53.14 | 3 | 15.0% | 1 | Page total exceeds the anchor, but most disclosed impressions are outside the strict family-itinerary cohort. |
| Chicago family hotels | 320 | 59 | 70.61 | 32 | 10.0% | 0 | Some aligned long-tail testing; no disclosed exact tracked phrase. |
| Las Vegas activities | 3,600 | 81 | 61.78 | 76 | 2.1% | 12 | Strong intent alignment but very limited head-demand exposure. |
| Las Vegas teens | 590 | 3 | 56.67 | 0 | 0% | 0 | Too little disclosed aligned evidence to compare. |
| Las Vegas stay areas | 20 | 6 | 56.33 | 2 | 10.0% | 0 | Two disclosed role-aligned impressions remain too little for a demand conclusion. |
| Las Vegas itinerary | About 20 | 60 | 39.40 | 2 | 10.0% | 0 | The apparent page-total surplus is broad-query exposure, not proof that volume was understated. |
| Las Vegas family hotels | 1,900 | 71 | 65.94 | 3 | 0.2% | 0 | Current page impressions are mostly outside the strict family-hotel cohort. |
| New York City activities | 480 | 51 | 59.33 | 24 | 5.0% | 4 | Intended family-activity exposure exists but remains low-position. |
| New York City teens | 590 | 33 | 74.94 | 13 | 2.2% | 3 | Query family is present; visibility is very weak. |
| New York City stay areas | 70 | 53 | 43.89 | 17 | 24.3% | 1 | One of the stronger relative tests, still well outside a capture or CTR conclusion. |
| New York City itinerary | 30 | No row | N/A | 0 | 0% | 0 | Discovery/indexing blocks any demand comparison. |
| New York City family hotels | 390 | 25 | 37.36 | 11 | 2.8% | 0 | Strict family-hotel exposure exists, but no maintained exact tracked phrase is disclosed. |
| San Antonio activities | 5,400 | 100 | 87.65 | 98 | 1.8% | 30 | Strong role alignment at extremely weak visibility. |
| San Antonio teens | 140 | 1 | 43.00 | 0 | 0% | 0 | One page impression is not a useful demand test. |
| San Antonio stay areas | 10-20 family-specific | 76 | 68.42 | 1 | 5-10% | 0 | Generic area exposure inflates the page total; only one disclosed impression matched the family-area role. |
| San Antonio itinerary | 0 family-specific; 260 generic | 18 | 30.33 | 0 | N/A | 0 | The maintained family-specific estimate and generic itinerary job are not a clean denominator. |
| San Antonio family hotels | 170 | 3 | 6.33 | 0 | 0% | 0 | A three-impression page average is not evidence of stable high rank or demand capture. |
| San Diego activities | 4,400+ | No row | N/A | 0 | 0% | 0 | The highest-demand activity page remains blocked by discovery/indexing. |
| San Diego toddlers | 650-850 | 88 | 56.69 | 40 | 4.7-6.2% | 8 | Intended age-specific testing exists; visibility remains weak. |
| San Diego teens | 700-900 | No row | N/A | 0 | 0% | 0 | Discovery/indexing blocks any demand comparison. |
| San Diego stay areas | 360+ | 125 | 56.78 | 56 | At most 15.6% | 9 | Family area intent is present, but part of the page total is broader lodging exposure. |
| San Diego itinerary | 120+ | 69 | 66.23 | 9 | At most 7.5% | 3 | Intended query testing exists at low visibility. |
| San Diego family hotels | 2,700+ | 966 | 70.50 | 695 | At most 25.7% | 74 | Strongest confirming case for demand and broad long-tail testing; position still prevents a capture conclusion. |

## Interpretation

### What aligns

- San Diego family hotels are both a high-demand researched role and the dominant current exposure surface: 695 role-aligned disclosed impressions and 74 exact tracked impressions. This confirms that Google is testing the intended commercial family-hotel family. It does not mean the page captured 25.7% of searches.
- The high-demand Chicago, Las Vegas, and San Antonio activity pages all receive intended family-activity impressions. Their aligned counts are only 23, 76, and 98 against anchors of 5,400, 3,600, and 5,400, consistent with their weak positions rather than with exhausted demand.
- New York City stay areas, Chicago stay areas, San Diego toddlers, and San Diego itinerary show coherent role-aligned discovery even though their current positions remain weak.

### What does not align yet

- Four pages cannot express their researched demand because they are not indexed. This is a discovery state, not evidence that demand was overestimated or that more content is needed.
- Several hotel and area pages have page totals much larger than their strict aligned cohorts. Current page-level exposure is partly generic, property-led, or otherwise outside the maintained family-role definition.
- Low-volume itinerary and area anchors sometimes have fewer estimated monthly searches than total page impressions. Search Console can count repeated impressions across many broad variants, while the keyword estimate describes one modeled exact phrase. The surplus is a denominator mismatch, not proof that the estimate was wrong.
- Relative demand is not yet producing relative traffic. The property has only three clicks, so no page has enough outcome evidence to validate commercial or user value from search behavior.

## Decision

**PRESERVE and observe.** Do not change a page, title, URL, indexability rule, or content set from this comparison.

The researched keyword families still look plausible as directional opportunity inputs, but current Search Console data mainly measures low-position testing. The exact tracked phrases are far below their monthly estimates, and the role-aligned cohort averages about position 72.8. No title/CTR candidate meets the doctrine's requirement for at least 100 finalized aligned impressions at average position 20 or better. San Diego family hotels has enough aligned impressions but not the position; the isolated San Antonio hotel average has neither a coherent aligned cohort nor enough impressions.

## Next Falsification Trigger

Repeat this comparison only when at least one of these changes:

- one of the four not-indexed pages becomes indexed and develops a disclosed role-aligned cohort;
- an indexed page's stable finalized role-aligned cohort moves materially into positions 21-40 or better;
- a like-for-like US keyword refresh materially changes a page-role anchor;
- a page reaches the doctrine's CTR gate of at least 100 finalized aligned impressions at average position 20 or better.

A later comparison should use the same page roles and private aggregation rules. It should not treat rank-dependent GSC impressions as a replacement for search-volume research or vice versa.

## Sources

- `ops/gsc-snapshots/2026-09-02.json`
- `ops/gsc-snapshots/2026-09-02.md`
- `docs/plan/protected-gsc-query-export.md`
- `docs/research/next-city-prioritization-las-vegas-cluster.md`
- `docs/research/chicago-family-cluster-decision-pack.md`
- `docs/research/new-york-city-family-cluster-decision-pack.md`
- `docs/research/san-antonio-family-cluster-decision-pack.md`
- `status/san-diego-pages.md`
- `status/chicago-pages.md`
- `status/las-vegas-pages.md`
- `status/new-york-city-pages.md`
- `status/san-antonio-pages.md`
- `strategy/seo-doctrine.md`
