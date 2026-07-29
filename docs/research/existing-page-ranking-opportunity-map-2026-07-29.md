# Existing-Page Ranking Opportunity Map

Status: complete and review-clean

Action: `FT-RES-012`

Prepared: 2026-07-29

Market: United States

Publication state: research only; no `site/**`, sitemap, canonical, indexability, deployment, indexing request, outreach, external account beyond the approved read-only export workflow, or recurring automation change

## Decision

Do not run another broad content-rewrite pass on an existing page now.

The current problem is not a shortage of headings, comparison tables, or travel prose. The evidence shows:

- 28 canonical/indexable URLs are live and healthy;
- 20 are indexed and eight are not indexed;
- the protected export contains 940 visible page-query impressions across 14 pages;
- no exported page-query row had a period-average position of 20 or better;
- 74 impressions were attached to rows averaging positions 21-40;
- 866 impressions were attached to rows averaging worse than position 40;
- almost every page with query evidence was last crawled before its latest reviewed release; and
- the central authority evidence reports Authority Score 0, three non-meaningful spam referring domains, and zero follow links.

There is therefore no evidence-backed CTR action and no clean query-refinement winner. Editing pages again before Google crawls the versions already released would conflate old and new artifacts without solving the clearest sitewide weakness.

The operating stance should be:

1. Keep new-city expansion narrow. Orlando remains researched but separately user-gated.
2. Let current releases be crawled and indexed; do not request indexing.
3. Use sibling-page discovery to resolve hotel/area and activity/itinerary role collisions.
4. Treat Las Vegas all-ages activities as the strongest aligned page to watch: it has the most protected query evidence, but more than 98% of those impressions are attached to rows averaging worse than position 40 and Google has not crawled the July revision.
5. Move the next ranking investment into source-worthy authority work, not another page rewrite.

Promoted next action:

- roadmap: `FT-AUTH-002`
- research backlog: `SRR-036`
- title: "Complete the real-record and parent-test evidence for the San Diego Family Reset Atlas"
- state: ready for separate selection
- publication: not authorized by this action

The Reset Atlas is selected as the lowest-waste authority path because its source-worthy asset plan, 13-anchor official-source/license audit, and accessible synthetic prototype are already review-clean. The next action should convert that prior work into a real-record, public-safe evidence candidate and parent-test package. It must stop before publication or outreach.

## Evidence Classification

| Evidence | Freshness | Use | Limitation |
|---|---:|---|---|
| `ops/gsc-snapshots/2026-07-28.json` and `.md` | collected 2026-07-28; finalized through 2026-07-26 | Fresh authenticated API evidence for page performance, sitemap state, and URL Inspection. | Page average position is not a query rank. |
| Protected page-query export | collected 2026-07-29; aligned to 2026-06-29 through 2026-07-26 | Fresh authenticated read-only page-query evidence. This document stores only thresholded page/family aggregates. | Complete rows remain outside the repository; anonymized GSC queries mean page totals can exceed exported query totals. |
| Git history for every sitemap HTML artifact | checked 2026-07-29 | Compares the latest committed page version with Google's recorded crawl time. | A later crawl does not prove full reprocessing or a ranking effect. |
| Current internal-link graph | checked 2026-07-29 | Confirms every non-home sitemap page has at least three distinct internal sources; all-ages hubs have broad sitewide support. | Link count does not measure contextual quality or external authority. |
| Central Control Room authority report | dated 2026-07-28 | Current directional Semrush authority/referring-domain evidence. | Authority Score is a third-party metric, not a Google metric. |
| Public preflight | run 2026-07-29 | Confirms sitemap, robots, all 28 URLs, HTTP status, and sitemap membership are healthy. | Does not establish indexing or ranking. |
| Existing city decision packs, persona reviews, candidate reviews, and status tables | current through 2026-07-28 | Establish current page role, quality-review coverage, and release state. | Does not show that Google has crawled the latest artifact. |

The protected export contains 237 complete rows. Those rows are not reproduced here. Query-family conclusions below retain only generic travel intent and page-level aggregates; no country/device rows, credentials, user data, or complete export is stored.

## Classification Method

The map separates five problems:

| Classification | Meaning | Eligible response |
|---|---|---|
| `INDEXING_FIRST` | The canonical page is unknown or discovered but not indexed. | Keep healthy links/sitemap; inspect future crawl evidence; do not call it a ranking problem. |
| `CURRENT_CRAWL_NEEDED` | Google is ranking an older artifact than the latest reviewed release. | Do not rewrite again solely from old query evidence. |
| `ROLE_CHECKPOINT` | An indexed page is receiving intent intended for a newer sibling page. | Wait for the sibling to be indexed/crawled, then compare protected query families. |
| `AUTHORITY_LED` | Query intent is aligned, but nearly all impressions are attached to rows averaging worse than position 40 and no on-page gap is proven. | Invest in a source-worthy asset and earned citations before another prose pass. |
| `INSUFFICIENT_EVIDENCE` | Query rows or impressions are too sparse to distinguish a real opportunity. | Keep and observe; do not infer a stable rank from page averages. |

The rank bands are descriptive, not automatic triggers. A page is not promoted merely because one impression falls in a band.

## Sitewide Findings

### Protected Query Distribution

| Measure | Result |
|---|---:|
| Exported page-query rows | 237 |
| Pages with at least one exported query row | 14 |
| Exported query impressions | 940 |
| Exported clicks | 1 |
| Impressions attached to rows averaging positions 1-10 | 0 |
| Impressions attached to rows averaging positions 11-20 | 0 |
| Impressions attached to rows averaging positions 21-40 | 74 |
| Impressions attached to rows averaging worse than position 40 | 866 |

This rules out a current snippet/CTR sprint. No exported page-query row has a period-average position of 20 or better.

### Crawl Versus Release

Only three current page artifacts have a recorded crawl at or after their latest content commit:

- `https://familytripwise.com/where-to-stay/san-diego-family-hotels.html`
- `https://familytripwise.com/where-to-stay/las-vegas-family-hotels.html`
- `https://familytripwise.com/things-to-do/san-antonio-with-kids.html`

The two hotel pages have no protected query evidence yet. San Antonio all-ages has only ten protected query impressions, all attached to rows averaging worse than position 40. Every other page with meaningful query evidence is being judged through a crawl that predates its latest reviewed release.

### Query-Role Collisions

The protected aggregates reveal three understandable transitional collisions:

- San Diego, Chicago, and San Antonio stay-area pages receive meaningful hotel-list intent while their separate hotel siblings are new or not indexed.
- New York City all-ages activities receives itinerary intent while the itinerary page remains unknown to Google.
- Several family-stay pages receive generic or non-destination-specific family lodging wording in addition to their intended city/base queries.

These are not reasons to merge or rewrite pages now. They are checkpoints to revisit after the sibling URLs are indexed and both sides have current crawl/query evidence.

### Internal And External Authority

The site has no orphaned sitemap page. Existing internal support is adequate for discovery:

- all-ages city hubs receive links from 27 or more distinct sitemap pages;
- stay pages receive five to eight distinct internal sources;
- hotel, itinerary, toddler, and teen pages receive three to six.

The central report's current authority evidence is much weaker: Authority Score 0, three detected referring domains assessed as automated spam, and zero follow links. Internal-link polish may help users and role clarity, but it is not the main missing input.

## Every-Page Opportunity Map

Public page metrics are the 28-day page rows finalized through 2026-07-26. Protected values are thresholded page aggregates for the same period. `No current crawl` means Google's recorded crawl predates the latest committed artifact.

| Page | Index / crawl state | Public page evidence | Protected aggregate | Query-role read | Classification | Next action |
|---|---|---|---|---|---|---|
| [Home](https://familytripwise.com/) | Indexed; no current crawl | 9 impressions; position 31.22 | 2 impressions, both on rows averaging worse than 40 | Brand/navigation, not a destination acquisition page | `INSUFFICIENT_EVIDENCE` | Keep as navigation/trust hub. |
| [About](https://familytripwise.com/about.html) | Indexed; no current crawl | 4 impressions; position 2 | No exported query row | Trust page, not an acquisition target | `INSUFFICIENT_EVIDENCE` | Keep. Do not optimize from four impressions. |
| [San Diego family hotels](https://familytripwise.com/where-to-stay/san-diego-family-hotels.html) | Indexed; current crawl | No page row | No exported query row | Intended hotel-list sibling is newly crawled | `INSUFFICIENT_EVIDENCE` | Observe first query discovery; compare with stay page later under `FT-EVAL-002`. |
| [Las Vegas family hotels](https://familytripwise.com/where-to-stay/las-vegas-family-hotels.html) | Indexed; current crawl | No page row | No exported query row | Intended hotel-list sibling is newly crawled | `INSUFFICIENT_EVIDENCE` | Observe first query discovery. |
| [Chicago family hotels](https://familytripwise.com/where-to-stay/chicago-family-hotels.html) | Discovered; not indexed | No page row | No exported query row | Its stay sibling currently absorbs some hotel intent | `INDEXING_FIRST` | Keep links/sitemap; reassess role split after indexing. |
| [New York City family hotels](https://familytripwise.com/where-to-stay/new-york-city-family-hotels.html) | Discovered; not indexed | No page row | No exported query row | Its stay sibling lacks clean hotel-page support in Google | `INDEXING_FIRST` | Keep links/sitemap; reassess after indexing. |
| [San Antonio family hotels](https://familytripwise.com/where-to-stay/san-antonio-family-hotels.html) | Discovered; not indexed | No page row | No exported query row | Its stay sibling currently receives substantial hotel intent | `INDEXING_FIRST` | Keep links/sitemap; role checkpoint after indexing. |
| [Chicago with kids](https://familytripwise.com/things-to-do/chicago-with-kids.html) | Indexed; no current crawl | 52 impressions; position 58.88 | 49 impressions, all on rows averaging worse than 40 | Broad family-activity intent is aligned | `CURRENT_CRAWL_NEEDED` | Let Google process the reviewed July version; later authority candidate. |
| [Where to stay in Chicago with kids](https://familytripwise.com/where-to-stay/chicago-with-kids.html) | Indexed; no current crawl | 56 impressions; position 64.86 | 46 impressions, all on rows averaging worse than 40 | Area/base plus hotel-list intent | `ROLE_CHECKPOINT` | Wait for current crawl and hotel-page indexing. |
| [Chicago family itinerary](https://familytripwise.com/family-itinerary/chicago-with-kids.html) | Indexed; no current crawl | 14 impressions; position 25 | 3 impressions, all on rows averaging worse than 40 | Too little protected evidence to validate the page average | `INSUFFICIENT_EVIDENCE` | Keep; do not call it a position-25 opportunity. |
| [San Antonio with kids](https://familytripwise.com/things-to-do/san-antonio-with-kids.html) | Indexed; current crawl | 14 impressions; position 72.64 | 10 impressions, all on rows averaging worse than 40 | Broad family-activity intent is aligned | `AUTHORITY_LED` | Keep current content; seek authority rather than another rewrite. |
| [Where to stay in San Antonio with kids](https://familytripwise.com/where-to-stay/san-antonio-with-kids.html) | Indexed; no current crawl | 89 impressions; position 80.28 | 75 impressions, all on rows averaging worse than 40 | Predominantly hotel intent while hotel sibling is unindexed | `ROLE_CHECKPOINT` | Wait for hotel-page indexing and current crawl. |
| [San Antonio family itinerary](https://familytripwise.com/family-itinerary/san-antonio-with-kids.html) | Indexed; no current crawl | 6 impressions; position 27.17 | 2 impressions, both on rows averaging worse than 40 | Too sparse for a query-rank claim | `INSUFFICIENT_EVIDENCE` | Keep and observe. |
| [San Diego with kids](https://familytripwise.com/things-to-do/san-diego-with-kids.html) | Unknown to Google | No page row | No exported query row | No ranking evidence exists | `INDEXING_FIRST` | Keep healthy links/sitemap; support with source-worthy asset work. |
| [Where to stay in San Diego with kids](https://familytripwise.com/where-to-stay/san-diego-with-kids.html) | Indexed; no current crawl | 311 impressions; position 59.91 | 282 impressions: 48 on rows averaging positions 21-40; 234 on rows averaging worse than 40 | Hotel-list intent dominates the old crawl; area intent is also present | `ROLE_CHECKPOINT` | Wait for a current crawl and compare against the newly crawled hotel page under `FT-EVAL-002`. |
| [San Diego family itinerary](https://familytripwise.com/family-itinerary/san-diego-with-kids.html) | Indexed; no current crawl | 15 impressions; position 63.87 | 3 impressions, all on rows averaging worse than 40 | Sparse itinerary evidence | `INSUFFICIENT_EVIDENCE` | Keep and observe. |
| [Las Vegas with kids](https://familytripwise.com/things-to-do/las-vegas-with-kids.html) | Indexed; no current crawl | 344 impressions; position 60.36 | 340 impressions: 6 on rows averaging positions 21-40; 334 on rows averaging worse than 40 | Strongly aligned broad family-activity intent | `AUTHORITY_LED` after current crawl | Strongest existing acquisition page to watch; do not rewrite before Google processes the July release. |
| [Where to stay in Las Vegas with kids](https://familytripwise.com/where-to-stay/las-vegas-with-kids.html) | Indexed; no current crawl | 18 impressions; position 48.39 | 9 impressions: 4 on rows averaging positions 21-40; 5 on rows averaging worse than 40 | Intended family/base intent, but very sparse | `INSUFFICIENT_EVIDENCE` | Keep; wait for current crawl. |
| [Las Vegas family itinerary](https://familytripwise.com/family-itinerary/las-vegas-with-kids.html) | Indexed; no current crawl | 6 impressions; position 25.17 | No exported query row | Page average is not supported by visible query evidence | `INSUFFICIENT_EVIDENCE` | Keep; do not optimize from the average. |
| [New York City with kids](https://familytripwise.com/things-to-do/new-york-city-with-kids.html) | Indexed; no current crawl | 66 impressions; position 44.91 | 53 impressions: 1 on a row averaging positions 21-40; 52 on rows averaging worse than 40 | Broad activity intent plus itinerary spillover | `ROLE_CHECKPOINT` | Wait for current crawl and itinerary indexing. |
| [Where to stay in New York City with kids](https://familytripwise.com/where-to-stay/new-york-city-with-kids.html) | Indexed; no current crawl | 58 impressions; position 50.5 | 54 impressions: 10 on rows averaging positions 21-40; 44 on rows averaging worse than 40 | Family/base intent plus generic lodging noise | `CURRENT_CRAWL_NEEDED` | Keep; reassess after current crawl and hotel-page indexing. |
| [New York City family itinerary](https://familytripwise.com/family-itinerary/new-york-city-with-kids.html) | Unknown to Google | No page row | No exported query row | Its intent spills into the all-ages page | `INDEXING_FIRST` | Keep links/sitemap; reassess activity/itinerary split after indexing. |
| [Chicago with teens](https://familytripwise.com/things-to-do/chicago-with-teens.html) | Unknown to Google | No page row | No exported query row | No ranking evidence exists | `INDEXING_FIRST` | Keep links/sitemap; no content edit. |
| [Las Vegas with teens](https://familytripwise.com/things-to-do/las-vegas-with-teens.html) | Indexed; no current crawl | 3 impressions; position 24 | No exported query row | Page average is too sparse to validate | `INSUFFICIENT_EVIDENCE` | Keep; do not claim a top-30 opportunity. |
| [New York City with teens](https://familytripwise.com/things-to-do/new-york-city-with-teens.html) | Discovered; not indexed | No page row | No exported query row | No ranking evidence exists | `INDEXING_FIRST` | Keep links/sitemap; no content edit. |
| [San Diego with teens](https://familytripwise.com/things-to-do/san-diego-with-teens.html) | Unknown to Google | No page row | No exported query row | No ranking evidence exists | `INDEXING_FIRST` | Keep links/sitemap; no content edit. |
| [San Diego with toddlers](https://familytripwise.com/things-to-do/san-diego-with-toddlers.html) | Indexed; crawl predates latest cleanup | 20 impressions; position 36.85 | 12 impressions: 5 on rows averaging positions 21-40; 7 on rows averaging worse than 40 | Aligned toddler intent, but sparse | `CURRENT_CRAWL_NEEDED` | Keep; reconsider only after current crawl and more query evidence. |
| [San Antonio with teens](https://familytripwise.com/things-to-do/san-antonio-with-teens.html) | Indexed; no current crawl | 4 impressions; position 13.5 | No exported query row | Page average is not a stable row-level opportunity | `INSUFFICIENT_EVIDENCE` | Keep; do not optimize from four impressions. |

## Priority Stack

| Priority | Work | Why now | Stop condition |
|---:|---|---|---|
| 1 | Source-worthy authority asset for existing San Diego cluster | Authority is the clearest sitewide deficit, and the Reset Atlas has completed plan, source/license audit, and prototype foundations. | Stop before publication if real records, trust boundaries, licensing, or parent testing fail the prior release gates. |
| 2 | Natural crawl/indexing observation | Eight pages are not indexed and most query-bearing pages have stale crawls. | Do not create edits or indexing requests from calendar cadence. |
| 3 | `FT-EVAL-002` lodging role checkpoint | San Diego old-crawl stay evidence is dominated by hotel intent; the hotel sibling was crawled only on July 28. | Run only after the stay page has a current crawl and both pages have protected query evidence. |
| 4 | Las Vegas all-ages authority support | It has the strongest aligned protected query set: 340 impressions, but 334 are attached to rows averaging worse than position 40. | Do not rewrite until Google crawls the July release; reassess whether authority, content, or both remain limiting. |
| 5 | Orlando all-ages publication | Research supports the page, but it is expansion rather than ranking acceleration. | Remains separately user-gated. |

## Promoted Next Action

Roadmap action: `FT-AUTH-002`

Research backlog: `SRR-036`

Title: Complete the real-record and parent-test evidence for the San Diego Family Reset Atlas.

State: ready for separate selection; not selected by this research transaction.

Purpose:

- turn the existing review-clean plan, source/license audit, and synthetic prototype into a real-record, public-safe candidate;
- support the existing San Diego all-ages page with original, citable planning data;
- resolve evidence, license, trust, and parent-usability gates before any publication or outreach decision.

Maximum next-action scope:

- `docs/research/san-diego-reset-atlas-publication-evidence.md`
- `docs/research/san-diego-reset-atlas-source-license-audit.md`
- `src/prototypes/san-diego-family-reset-atlas/**`
- `backlog/seo-research-review-backlog.md`
- `ops/needs-user.md`
- `ops/seo-roadmap.json`
- `ops/seo-roadmap.md`
- `ops/current-cycle.md`
- `ops/operator-review.md`

Acceptance:

1. Preserve the exact 13-anchor scope from `FT-AUTH-001` and `FT-RES-003`.
2. Build at least 30 useful reset/constraint candidate records from current official or authorized sources.
3. Store source owner, URL, source freshness when exposed, checked date, evidence class, confidence, human-review state, operational caveat, and license/reuse note for every record.
4. Keep firm route, stroller, sensory, quiet, safety, caregiver-facility, and family-suitability conclusions `UNKNOWN` unless the required human evidence exists.
5. Use no private contact data, copied source prose, account data, or user-entered family data.
6. Validate real-record schema, source coverage, licensing, filters, keyboard/mobile behavior, provenance, freshness, and zero-storage behavior outside `site/**`.
7. Prepare three representative planning tasks for independent completion by two parents, as required by the prior release gate; do not simulate parent evidence with agents.
8. Stop before publication, outreach, partnership contact, indexing request, or external-account mutation.
9. Obtain independent read-only review with no P0-P2 findings.

This action is deliberately evidence/build work, not a promise that the Atlas will earn links. Publication and outreach require later explicit gates.

## Measurement Plan

For crawl/indexing:

- use future finalized public snapshots and protected exports only when evidence changes;
- record whether each of the eight unindexed URLs becomes indexed;
- compare last crawl against the latest page commit;
- do not request indexing or repeatedly resubmit the sitemap.

For ranking:

- rerun the same protected page-query aggregation after current crawls exist;
- look first for sustained aligned page-query rows averaging positions 8-30;
- distinguish activity, itinerary, area, and named-hotel intent;
- do not optimize CTR until a page has meaningful row-level exposure at an average position of 20 or better;
- do not treat a page-level average or one-day movement as a query rank.

For authority:

- publication is not success by itself;
- after a separately approved asset release, track legitimate referring domains, follow links, relevant citations, crawl/discovery, and aligned query movement;
- ignore automated SEO spam and do not count it as earned authority;
- any outreach remains separately prohibited until the user authorizes it.

## Source Register

Repository:

- `AGENTS.md`
- `ops/gsc-snapshots/2026-07-28.json`
- `ops/gsc-snapshots/2026-07-28.md`
- `ops/gsc-monitor.json`
- `docs/research/gsc-monitoring-latest.md`
- `docs/research/san-diego-source-worthy-asset-plan.md`
- `docs/research/san-diego-reset-atlas-source-license-audit.md`
- `docs/plan/seo-cluster-research-protocol.md`
- `status/san-diego-pages.md`
- `status/las-vegas-pages.md`
- `status/chicago-pages.md`
- `status/new-york-city-pages.md`
- `status/san-antonio-pages.md`

Protected evidence:

- page-query export collected 2026-07-29 through GitHub Actions run `30443765836`;
- source public snapshot `2026-07-28.json`;
- finalized period 2026-06-29 through 2026-07-26;
- 237 rows stored only in protected central state with restrictive permissions.

Primary Google guidance:

- [Sitemap overview](https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview)
- [Link best practices](https://developers.google.com/search/docs/crawling-indexing/links-crawlable)
- [People-first content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
