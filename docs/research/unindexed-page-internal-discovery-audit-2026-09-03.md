# Unindexed Page Internal-Discovery Audit

Action: `FT-RES-029` / `SRR-050`

Prepared: 2026-09-03

Scope: test whether the four destination-cluster pages that remain unknown to Google have materially weaker internal discovery paths than indexed pages with the same role

## Decision

**PRESERVE.** The current internal-link graph does not identify a defect that justifies adding, moving, or relabeling links.

All four targets are live `200` pages, self-canonical, indexable in their HTML, allowed by the public robots policy, present exactly once in the sitemap, linked from the homepage, and linked contextually from destination siblings. Their matched indexed controls do not expose a consistent comparative deficit:

- Chicago teens has four distinct inbound sources, all indexed. Las Vegas teens also has four; indexed New York City and San Antonio teen controls have only three indexed sources each.
- The New York City itinerary has four distinct inbound sources, all indexed. It ties Chicago, Las Vegas, and San Antonio on total sources, trails San Diego's six-source itinerary, and ties the highest indexed-source count of four.
- San Diego all-ages activities has inbound links from all 27 other sitemap pages, including 24 indexed sources. Every all-ages page has the same 27-source topology. Its apparent 24-versus-23 indexed-source edge is mechanical: an indexed control excludes its own indexed URL, while the unindexed San Diego target does not.
- San Diego teens has four distinct sources, three indexed. That equals or exceeds two indexed teen controls and includes six contextual link instances.

The targets are not uniquely or consistently weaker on internal discovery in this matched snapshot. This does not prove that Google extracted every link, that the pages deserve indexing, or that external authority and content selection are irrelevant. It means another speculative link expansion has no evidenced advantage over the current control patterns.

## Current GSC Boundary

| Evidence | Freshness | What it establishes | Limitation |
|---|---|---|---|
| `ops/gsc-snapshots/2026-09-03.json` and `.md` | Fresh read-only API collection at 2026-09-03 14:35 UTC; performance finalized conservatively through September 1 | Sitemap is `Success` with 28 discovered pages; 24 of 28 inspected URLs are indexed; the same four targets remain not indexed with `URL is unknown to Google` and no crawl time | An unknown URL has no Google fetch, robots, or indexing-state observation. The snapshot has no public aligned query cohort. |
| Local sitemap and all 28 current sitemap HTML files | Parsed September 3 | Current source-target topology, canonical state, noindex state, and sitemap membership | Repository state alone does not prove production parity or Google extraction. |
| Live production sitemap and all 28 live pages | Parsed September 3 | Production link graph matches the local target counts; all targets return `200` and expose the expected self-canonical without `noindex` | A successful fetch by this audit is not a Google crawl or indexability guarantee. |
| Git history for target files and homepage links | Checked September 3 | All four target files existed from the July 4 launch; their homepage links were introduced July 4 or July 11, before Google's August 30 homepage crawl | Commit chronology does not prove that Google rendered or followed a particular link. |

The 28-day property row is 1,991 impressions, 3 clicks, and average position 65.8. Those values are orientation only and do not diagnose the four URLs. No indexing request was made.

## Method

1. Parse `site/sitemap.xml` as XML and use its 28 canonical URLs as the source-page set.
2. Parse each HTML document with a structured HTML parser. Resolve relative links against the source URL, remove fragments, and deduplicate each source-target pair.
3. Count total source pages, source pages currently indexed in the September 3 URL Inspection set, source pages linking from `<main>`, contextual link instances, and homepage presence.
4. Repeat the same parse against production. Require target counts to match local output.
5. Compare targets only with indexed pages that perform the same role: all-ages activities, teen activities, or family itinerary.
6. Check each target's live response, canonical, robots/noindex state, and exact sitemap count. Keep this technical state separate from Google's unknown inspection state.

Global navigation counts as a discovery path but not as contextual endorsement. The contextual columns therefore count `<main>` sources and link instances separately.

## Technical Gate

| Target | Live | Canonical | HTML indexability | Robots | Sitemap | GSC September 3 |
|---|---|---|---|---|---|---|
| Chicago teens | `200` | Self | No `noindex` | Public `Allow: /` | Exactly once | Unknown to Google; no crawl time |
| New York City itinerary | `200` | Self | No `noindex` | Public `Allow: /` | Exactly once | Unknown to Google; no crawl time |
| San Diego all-ages activities | `200` | Self | No `noindex` | Public `Allow: /` | Exactly once | Unknown to Google; no crawl time |
| San Diego teens | `200` | Self | No `noindex` | Public `Allow: /` | Exactly once | Unknown to Google; no crawl time |

The sitemap's last-read timestamp remains July 27, but its current GSC status is successful and its discovered count is 28. That timestamp is a monitoring limitation, not proof that these four entries were omitted, and it does not justify another sitemap submission or per-URL indexing request in this action.

## Matched Link Comparison

`Context sources` are distinct sitemap pages with at least one link from `<main>`. `Context links` counts the link instances from those pages. The indexed-source count uses the fresh September 3 inspection set.

| Role / page | GSC indexed | Distinct sources | Indexed sources | Context sources | Context links | Homepage |
|---|---:|---:|---:|---:|---:|---:|
| **Chicago teens** | No | 4 | 4 | 4 | 4 | Yes |
| Las Vegas teens | Yes | 4 | 4 | 4 | 5 | Yes |
| New York City teens | Yes | 4 | 3 | 4 | 4 | Yes |
| **San Diego teens** | No | 4 | 3 | 4 | 6 | Yes |
| San Antonio teens | Yes | 3 | 3 | 3 | 3 | No |
| **New York City itinerary** | No | 4 | 4 | 4 | 6 | Yes |
| Chicago itinerary | Yes | 4 | 3 | 4 | 5 | Yes |
| Las Vegas itinerary | Yes | 4 | 4 | 4 | 4 | Yes |
| San Antonio itinerary | Yes | 4 | 4 | 4 | 5 | Yes |
| San Diego itinerary | Yes | 6 | 4 | 6 | 9 | Yes |
| **San Diego all-ages activities** | No | 27 | 24 | 5 | 6 | Yes |
| Chicago all-ages activities | Yes | 27 | 23 | 5 | 5 | Yes |
| Las Vegas all-ages activities | Yes | 27 | 23 | 5 | 6 | Yes |
| New York City all-ages activities | Yes | 27 | 23 | 5 | 6 | Yes |
| San Antonio all-ages activities | Yes | 27 | 23 | 4 | 4 | Yes |

Local and production counts match for all four targets.

## Target Path Quality

| Target | Current discovery paths |
|---|---|
| Chicago teens | Homepage `Open Chicago teen guide`; contextual `Open Chicago with teens` links from the indexed Chicago all-ages, stay-area, and itinerary pages. |
| New York City itinerary | Homepage `Itinerary`; contextual links from the indexed all-ages, stay-area, and teen pages, including `Turn these into an itinerary`, `sequence the first two days`, and explicit itinerary labels. |
| San Diego all-ages activities | Sitewide `San Diego` navigation from every other sitemap page plus contextual links from home, stay area, itinerary, toddler, and teen pages. |
| San Diego teens | Homepage `Open San Diego teen guide`; contextual teen labels from all-ages, stay-area, and itinerary pages. The all-ages source is also unknown to Google, but the other three sources are indexed. |

The indexed homepage was last crawled August 30. The relevant homepage links have existed in Git since July 4 for the New York City itinerary and San Diego all-ages page, and since July 11 for both teen links. This strengthens the conclusion that the current graph is not newly added or uniquely shallow, while still not proving link extraction.

## Interpretation

### Hypothesis result

Rejected: the targets are not uniquely or consistently weaker across source count, indexed-source count, homepage presence, or contextual links. The New York City itinerary trails one indexed control on total/contextual sources but ties three on total sources and ties the best indexed-source count.

### What remains unknown

- Why Google has no inspection record for these four URLs.
- Whether Google extracted or weighted each current link.
- Whether external authority, crawl scheduling, quality selection, duplication, or another unobserved factor explains the difference.
- Whether any content or link change would cause indexation.

The evidence cannot choose among those causes. In particular, `URL is unknown to Google` should not be translated into a content-quality verdict.

## Action Boundary

No implementation candidate is promoted. Preserve the current links, page roles, URLs, sitemap, canonicals, and indexability. Do not request indexing.

Reopen discovery work only if one of these falsification triggers occurs:

- a target gains a crawl or index state, allowing before/after comparison without claiming causality;
- a live or generated link-graph regression removes the homepage route, drops a target below its matched role controls, or breaks a contextual destination path;
- sitemap status fails or discovered-page count falls below 28;
- a later current technical audit identifies an actual fetch, canonical, robots, response, or rendering defect.

If the four URLs remain unknown while those checks stay healthy, authority and Google selection remain the better research lanes than adding more internal links or prose.

## QA And Independent Review

Focused structured parsing reproduces the four target tuples in local and production output. Full repository tests pass 162/162; operator-state, content-freshness, local and production SEO, all 52 public GSC snapshots, the 28-URL public preflight, strict roadmap JSON with 80 unique action IDs, exact eleven-path/no-site scope, privacy, and whitespace checks pass.

Independent read-only reviewer Dewey (`01a068e8-828c-7473-a8ed-3aa7eb0c6265`) returned cycle-one `FAIL` for one P2 universal-control overstatement. The correction records the stronger San Diego itinerary control and the mechanical self-exclusion effect in the all-ages indexed-source count. Cycle two independently verified the correction and returned `PASS` with no P0-P3. The reviewer changed no file or external state.

## Sources

- `ops/gsc-snapshots/2026-09-03.json`
- `ops/gsc-snapshots/2026-09-03.md`
- `site/sitemap.xml`
- `site/robots.txt`
- the 28 sitemap HTML files under `site/`
- `docs/research/gsc-impressions-vs-researched-demand-2026-09-03.md`
- `docs/research/existing-page-ranking-opportunity-map-2026-07-29.md`
- `docs/research/san-diego-cluster-research-decision-pack.md`
- `status/chicago-pages.md`
- `status/new-york-city-pages.md`
- `status/san-diego-pages.md`
