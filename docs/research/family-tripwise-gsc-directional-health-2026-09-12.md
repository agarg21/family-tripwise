# Family Tripwise GSC Directional Health

Action: `FT-RES-041` / `SRR-063`

Prepared: 2026-09-12

Decision: `CONTINUE_WITHOUT_SEARCH_EDIT`

## Answer

Family Tripwise is directionally healthy in production and discovery, but it is not yet showing a sustained organic-growth breakout.

- The public site, robots file, and 28-URL sitemap all return `200`; the sitemap parses cleanly and advertises every current canonical URL.
- Google still reports 24 of 28 inspected URLs indexed. That coverage has been stable since early August, while four URLs remain unknown to Google.
- The latest finalized 28-day window has 1,739 property impressions, 3 clicks, and aggregate average position 63.46. Compared with the September 3 snapshot, impressions are down 12.7%, clicks are unchanged, and aggregate position is 2.34 places better.
- Visibility is moving between pages rather than rising uniformly. San Diego family-hotel impressions cooled, while Chicago family hotels and several stay-area pages improved. The strongest position readings still have too few impressions to treat as stable rank.
- The pattern is consistent with Google continuing to sample many Family Tripwise pages and query matches at low positions. Search Console does not expose a discrete testing or sandbox state, so this is an inference, not knowledge of Google's internal process.

The current evidence supports preserving the site and measurement boundaries. It does not support a title test, broad rewrite, new URL, indexing request, or claim that Google has validated or rejected page quality.

## Evidence And Freshness

| Evidence | Freshness | Use | Limit |
|---|---|---|---|
| `ops/gsc-snapshots/2026-09-11.json` and `.md` | Read-only API collection 2026-09-11; conservatively finalized through 2026-09-09 | Latest 28-day property/page performance, sitemap state, and 28-URL Inspection state | No public query rows; property and page-grouped totals are not additive; average position combines different queries and result surfaces. |
| Public GSC preflight | Run 2026-09-12 | Live sitemap, robots, and all 28 declared URL responses | Confirms public accessibility, not index inclusion or rank. |
| Five public-safe GSC checkpoints | Finalized through 2026-08-10, 2026-08-18, 2026-08-25, 2026-09-01, and 2026-09-09 | Directional rolling-window comparison | The 28-day windows overlap heavily; changes are not independent experiments. |
| `docs/research/gsc-impressions-vs-researched-demand-2026-09-03.md` | Protected query aggregation through 2026-08-31 | Role-aligned and exact tracked-query demand comparison | The private rows are not republished; anonymized queries are omitted; demand estimates are modeled US monthly searches, not expected impressions. |

## Rolling Direction

Page-grouped totals below are shown only as a separate diagnostic. They must not be added to or substituted for the property total.

| Snapshot | Finalized through | Property impressions | Clicks | Aggregate position | Indexed | Cluster pages with a row | Cluster page-grouped impressions |
|---|---|---:|---:|---:|---:|---:|---:|
| 2026-08-12 | 2026-08-10 | 1,732 | 6 | 63.90 | 24/28 | 21 | 1,790 |
| 2026-08-20 | 2026-08-18 | 2,144 | 5 | 65.45 | 24/28 | 22 | 2,225 |
| 2026-08-27 | 2026-08-25 | 2,173 | 5 | 66.21 | 24/28 | 22 | 2,265 |
| 2026-09-03 | 2026-09-01 | 1,991 | 3 | 65.80 | 24/28 | 22 | 2,034 |
| 2026-09-11 | 2026-09-09 | 1,739 | 3 | 63.46 | 24/28 | 21 | 1,782 |

The late-August peak did not continue. The current property total is 20.0% below the August 27 snapshot and nearly flat with August 12, while aggregate position is 2.75 places better than August 27 and 0.44 places better than August 12. This is mixed movement, not a monotonic gain or collapse.

The drop from 22 to 21 cluster pages with a performance row is the disappearance of a one-impression San Antonio teen row from the rolling window, not a newly reported indexation loss.

## Page Movement

The September 3 and September 11 windows overlap, so these are changing exposure mixes rather than before/after causal estimates.

| Page | Sep 3 impressions / position | Sep 11 impressions / position | Bounded reading |
|---|---:|---:|---|
| San Diego family hotels | 977 / 70.24 | 710 / 69.79 | The largest visibility surface cooled by 27.3%, but rank was roughly flat and the latest window includes one click. This looks more like changing low-rank exposure than a broad demotion. |
| Chicago family hotels | 85 / 69.42 | 130 / 64.20 | Impressions rose 52.9% and position improved 5.22 places; still far from strong rank. |
| San Diego stay areas | 119 / 55.56 | 129 / 51.71 | Small impression and position improvement, with one latest-window click. |
| San Antonio stay areas | 80 / 67.17 | 87 / 53.23 | Position improved on a modest sample, with one latest-window click. |
| New York City stay areas | 56 / 42.70 | 45 / 38.29 | Better average position but fewer impressions. |
| Chicago activities | 25 / 60.28 | 8 / 12.63 | The apparent rank jump rests on eight impressions and is not stable evidence. |
| Las Vegas stay areas | 8 / 43.75 | 7 / 17.29 | The apparent rank jump rests on seven impressions and is not stable evidence. |

The three latest clicks are distributed across San Diego family hotels, San Diego stay areas, and San Antonio stay areas. Three clicks are too few to infer satisfaction, conversion, or page quality.

## Indexing And Crawl State

The stable 24/28 state is the clearest healthy signal, but the remaining four are a real discovery limitation:

- San Diego all-ages activities: unknown to Google; no crawl time.
- San Diego teen activities: unknown to Google; no crawl time.
- New York City family itinerary: unknown to Google; no crawl time.
- Chicago teen activities: unknown to Google; no crawl time.

Most indexed priority pages show successful crawls from late August through September 6. The September 12 public preflight also returns `200` for all four unknown URLs and confirms that they are in the sitemap. Prior `FT-RES-029` research found no unique internal-link deficit, so the current record does not justify another page edit or an indexing request.

## Is Google Still Testing The Site?

In ordinary language, **probably yes**: 21 of 26 destination-cluster pages have a current performance row, many pages are being crawled, and impressions are spread across low-position page/query matches. That is consistent with broad discovery and sampling.

In a strict diagnostic sense, **unknown**: Google does not label a website as being in a temporary test, and GSC cannot reveal whether an impression came from an explicit quality test, normal ranking computation, personalization, freshness, location, or another result-system choice. There is no defensible fixed countdown or sandbox conclusion in this data.

The useful operational reading is that Google has enough access to evaluate most of the portfolio, but the site has not yet earned stable top-20 visibility. Current ranking, not researched demand exhaustion or CTR, remains the dominant limit.

## Relation To Researched Demand

The September 3 protected aggregation remains the best aligned comparison. Through August 31 it found:

- 1,123 conservatively role-aligned disclosed impressions at impression-weighted average position about 72.8;
- 166 disclosed impressions from the maintained exact tracked phrases;
- four meaningful-demand pages with no performance row and no index inclusion.

The latest page-grouped window does not overturn that result. Current impressions remain far below the researched head-query opportunity in a demand-capture sense. The exact keyword estimates remain plausible directional inputs, but GSC is still mostly measuring low-position exposure. Neither the property total nor a page total can be divided by overlapping monthly keyword estimates to produce impression share.

## YouTube Follow-Up

User decision on 2026-09-12: `DEFER_LOW_PRIORITY_MONITOR`.

Keep the completed `FT-RES-040` impersonation finding in the research backlog, remove it from current needs-user state, and submit no report. Revisit only if the channel becomes materially more prominent for ordinary branded searches, adds copied protectable expression or site assets, produces evidence of actual user confusion, or the user explicitly raises its priority.

## Decision And Next Trigger

`CONTINUE_WITHOUT_SEARCH_EDIT`.

The direction is mildly positive on technical health and several page-level positions, neutral on index coverage, and negative on recent rolling impressions. Overall confidence is medium because the windows overlap and query-level evidence is older than the latest page totals.

Reassess when one of these occurs:

- one of the four unknown URLs becomes indexed and develops a disclosed aligned cohort;
- a stable finalized aligned cohort moves materially into positions 21-40 or better;
- a page reaches at least 100 finalized aligned impressions at average position 20 or better, making the doctrine's CTR review eligible;
- a fresh protected query export shows a material change in role alignment;
- a like-for-like US demand refresh materially changes the opportunity anchors.

## QA And Review

- Full native tests pass `164/164`.
- Operator-state and content-freshness checks pass.
- Local and production SEO report zero errors and warnings.
- All 60 public GSC snapshots validate; the September 12 public preflight returns `200` for robots, the parsed sitemap, and all 28 declared URLs.
- Strict roadmap JSON has 94 unique action IDs; exact seven-path/no-site scope, privacy, credential-pattern, newline, and whitespace checks pass.
- Independent read-only reviewer Noether (`01a09570-10d0-7af1-accd-879037526ab8`) checked the complete diff, snapshot arithmetic and dates, technical/rank/demand boundaries, testing inference, four unknown URLs, source paths, YouTube deferral, scope, and QA evidence. Cycle one surfaced a reversed 0.44-place comparison and one nonexistent source filename; both were corrected. Cycle two returned `PASS` with no P0-P3. The reviewer changed no file or external state.

## Sources

- `ops/gsc-snapshots/2026-08-12.json`
- `ops/gsc-snapshots/2026-08-20.json`
- `ops/gsc-snapshots/2026-08-27.json`
- `ops/gsc-snapshots/2026-09-03.json`
- `ops/gsc-snapshots/2026-09-11.json`
- `ops/gsc-snapshots/2026-09-11.md`
- `docs/research/gsc-impressions-vs-researched-demand-2026-09-03.md`
- `docs/research/unindexed-page-internal-discovery-audit-2026-09-03.md`
- `ops/gsc-monitor.json`
