# GSC UI Review Notes

Date: July 11, 2026

Source: Google Search Console UI pass in Chrome for `sc-domain:familytripwise.com`

Report settings:

- Search type: Web
- Date range: 3 months
- Last update shown in GSC: about 3.5 hours before review

## Executive Summary

Google is now testing Family Tripwise more broadly than the July 8 snapshot, but the site is still pre-click and early-stage. Impressions grew from 15 in the July 8 review to 162 in this pass. Average position is still weak overall, so the right response is targeted page improvement, not new page expansion.

The strongest current signal is San Diego family lodging intent. The second strongest useful signal remains New York City things-to-do intent. Several where-to-stay pages are getting impressions, which supports strengthening family lodging decision support, hotel verification checklists, and internal links, while avoiding unverified hotel recommendations.

## GSC Snapshot

| Metric | Value |
|---|---:|
| Total clicks | 0 |
| Total impressions | 162 |
| Average CTR | 0% |
| Average position | 60.6 |

Daily rows visible in GSC:

| Date | Clicks | Impressions |
|---|---:|---:|
| July 9, 2026 | 0 | 62 |
| July 8, 2026 | 0 | 64 |
| July 7, 2026 | 0 | 21 |
| July 6, 2026 | 0 | 3 |
| July 5, 2026 | 0 | 12 |
| July 4, 2026 | 0 | 0 |

Country and device:

| Dimension | Row | Clicks | Impressions |
|---|---|---:|---:|
| Country | United States | 0 | 160 |
| Country | Argentina | 0 | 1 |
| Country | Canada | 0 | 1 |
| Device | Desktop | 0 | 125 |
| Device | Mobile | 0 | 37 |

## Top Query Rows

| Query | Clicks | Impressions | CTR | Average position |
|---|---:|---:|---:|---:|
| `family friendly hotels in san diego` | 0 | 7 | 0% | 76.9 |
| `things to do in nyc with kids` | 0 | 6 | 0% | 52.2 |
| `best place to stay in new york city with family` | 0 | 5 | 0% | 40.8 |
| `things to do in chicago with kids` | 0 | 5 | 0% | 54.6 |
| `kid friendly hotels in san diego` | 0 | 5 | 0% | 79.0 |
| `things to do with kids in new york city` | 0 | 4 | 0% | 50.0 |
| `where to stay in chicago with family` | 0 | 4 | 0% | 60.2 |
| `family hotels in san diego` | 0 | 4 | 0% | 66.0 |
| `what to do with kids in vegas` | 0 | 4 | 0% | 66.0 |
| `best family hotel san diego` | 0 | 3 | 0% | 38.3 |

Interpretation:

- San Diego lodging and hotel-adjacent queries are the strongest visible commercial signal.
- New York City activity and stay queries remain relevant.
- Chicago and Las Vegas are getting early activity/stay impressions, but not enough to justify expansion beyond improving current pages and links.
- Clicks are not expected at these average positions.

## Top Page Rows

| Page | Clicks | Impressions | CTR | Average position |
|---|---:|---:|---:|---:|
| `https://familytripwise.com/where-to-stay/san-diego-with-kids.html` | 0 | 59 | 0% | 61.9 |
| `https://familytripwise.com/things-to-do/new-york-city-with-kids.html` | 0 | 25 | 0% | 37.2 |
| `https://familytripwise.com/where-to-stay/san-antonio-with-kids.html` | 0 | 22 | 0% | 83.9 |
| `https://familytripwise.com/things-to-do/las-vegas-with-kids.html` | 0 | 15 | 0% | 61.2 |
| `https://familytripwise.com/where-to-stay/chicago-with-kids.html` | 0 | 14 | 0% | 60.3 |
| `https://familytripwise.com/where-to-stay/new-york-city-with-kids.html` | 0 | 13 | 0% | 58.1 |
| `https://familytripwise.com/things-to-do/chicago-with-kids.html` | 0 | 9 | 0% | 67.3 |
| `https://familytripwise.com/where-to-stay/las-vegas-with-kids.html` | 0 | 5 | 0% | 28.2 |
| `https://familytripwise.com/` | 0 | 2 | 0% | 1.0 |
| `https://familytripwise.com/family-itinerary/chicago-with-kids.html` | 0 | 2 | 0% | 5.0 |

Interpretation:

- `where-to-stay/san-diego-with-kids.html` should be the next page to improve because GSC is already testing it for hotel/family-stay intent.
- `things-to-do/new-york-city-with-kids.html` remains worth improving because it has the best activity-page signal.
- `where-to-stay/new-york-city-with-kids.html` should better match `best place to stay in new york city with family` wording and decision flow.
- `where-to-stay/chicago-with-kids.html` and `things-to-do/las-vegas-with-kids.html` deserve internal-link and scanability improvements, but not full new clusters.

## Indexing And Health

Sitemaps:

| Sitemap | Submitted | Last read | Status | Discovered pages |
|---|---|---|---|---:|
| `https://familytripwise.com/sitemap.xml` | July 5, 2026 | July 8, 2026 | Success | 22 |

Page indexing:

- GSC still showed: `Processing data, please check again in a day or so`.
- No stable indexed/not-indexed breakdown was available in the UI.

HTTPS:

- Last update: July 9, 2026.
- HTTPS URLs: 15.
- Non-HTTPS URLs: 1.
- Issue shown: `HTTPS not evaluated`, validation `Not Started`, pages `1`.
- The HTTPS examples drilldown showed 15 HTTPS pages and did not expose the not-evaluated URL in this pass.

Core Web Vitals:

- Not enough usage data for mobile or desktop.

Manual actions:

- No issues detected.

Security issues:

- No issues detected.

## Recommended Implementation Response

Recommendation label: `improve`

Create one implementation task focused on GSC-signaled pages and internal links:

- Strengthen San Diego where-to-stay page for family hotel/stay intent without creating a standalone hotel page or making unverified hotel recommendations.
- Strengthen New York City things-to-do and where-to-stay pages for the visible NYC activity/stay queries.
- Add internal links between matching things-to-do, where-to-stay, itinerary, toddler/teen, and methodology/about pages where relevant.
- Improve Home and About enough to reduce thin trust/navigation risk, while keeping them functional and not turning them into generic marketing pages.
- Keep `IMP-012` deferred; do not create the NYC weekend planner page in this cycle.

## Recommended Review Response

After implementation, SEO Research & Review should verify:

- local and production QA are still 0 errors;
- Home/About warnings are resolved or explicitly accepted;
- changed pages preserve human-review caveats for hotel, safety, transit, stroller, and area claims;
- internal links support pages that are already receiving GSC impressions;
- no new cities or unsupported hotel pages were added;
- sitemap remains canonical and does not include deferred/legacy/shim pages.
