# GSC UI Review Notes

Date: July 8, 2026

Source: Google Search Console UI pass in Chrome for `sc-domain:familytripwise.com`

Market: US by default. GSC showed all measured impressions from the United States.

## Executive Summary

Family Tripwise has early impressions for the right family-travel intent, but the sample is still very small. Treat this as a directional signal, not a statistically stable ranking report.

The strongest visible opportunity is to keep improving the New York City things-to-do page, because it is already the top page by impressions and has a meaningful average position for such an early site. A second opportunity is San Antonio hotel intent, where Google is showing the site for commercially valuable family-hotel queries but rankings are still very weak.

## GSC Snapshot

Report settings:

- Search type: Web
- Date range: 3 months
- Last update shown in GSC: about 2.5 hours before review

Summary metrics:

| Metric | Value |
|---|---:|
| Total clicks | 0 |
| Total impressions | 15 |
| Average CTR | 0% |
| Average position | 30.3 |

Daily rows:

| Date | Clicks | Impressions | Average position |
|---|---:|---:|---:|
| July 5, 2026 | 0 | 12 | 18.8 |
| July 6, 2026 | 0 | 3 | 76.7 |
| July 4, 2026 | 0 | 0 | UNKNOWN |

Country and device:

| Dimension | Row | Clicks | Impressions | Average position |
|---|---|---:|---:|---:|
| Country | United States | 0 | 15 | 30.3 |
| Device | Desktop | 0 | 14 | 28.7 |
| Device | Mobile | 0 | 1 | 53.0 |

## Query Rows

| Query | Clicks | Impressions | CTR | Average position | Intent read |
|---|---:|---:|---:|---:|---|
| `family hotels in san antonio` | 0 | 2 | 0% | 88.5 | High commercial hotel intent |
| `nyc with kids` | 0 | 1 | 0% | 39.0 | Medium family destination intent |
| `things to do in nyc with kids` | 0 | 1 | 0% | 53.0 | Medium-high activity planning intent |
| `family friendly hotels san antonio` | 0 | 1 | 0% | 80.0 | High commercial hotel intent |
| `san antonio hotels for families` | 0 | 1 | 0% | 97.0 | High commercial hotel intent |

Interpretation:

- Query data is sparse, but the visible query set matches the repository strategy.
- San Antonio hotel queries are high intent but not yet close to click range.
- New York City activity/destination queries are relevant to the current NYC things-to-do page, but the visible query positions are still weak.

## Page Rows

| Page | Clicks | Impressions | CTR | Average position | Read |
|---|---:|---:|---:|---:|---|
| `https://familytripwise.com/things-to-do/new-york-city-with-kids.html` | 0 | 9 | 0% | 11.8 | Best early page-level signal |
| `https://familytripwise.com/where-to-stay/san-antonio-with-kids.html` | 0 | 5 | 0% | 71.6 | Matches visible high-intent San Antonio hotel queries, but weak |
| `https://familytripwise.com/where-to-stay/las-vegas-with-kids.html` | 0 | 3 | 0% | 2.0 | Interesting, but query not visible |
| `https://familytripwise.com/` | 0 | 2 | 0% | 1.0 | Query not visible; do not over-interpret |
| `https://familytripwise.com/where-to-stay/chicago-with-kids.html` | 0 | 2 | 0% | 1.5 | Interesting, but query not visible |
| `https://familytripwise.com/family-itinerary/chicago-with-kids.html` | 0 | 1 | 0% | 2.0 | Tiny sample |
| `https://familytripwise.com/things-to-do/san-antonio-with-teens.html` | 0 | 1 | 0% | 3.0 | Tiny sample |

Interpretation:

- The NYC things-to-do page is the best current page to keep building because it has the largest visible impression count and an average position near page-one/page-two boundary.
- Some low-position page rows have too few impressions and no visible queries. Treat them as monitoring candidates, not proof of traction.
- Differences between total impressions and visible query/page totals may reflect low-volume row suppression or anonymized query behavior in GSC.

## New York City Page Strategy

The current `things to do in New York City with kids` page appears to serve tourists. That is still the right primary page for the existing search intent, because terms like `things to do in nyc with kids` and `nyc with kids` usually include tourists planning a trip.

However, there is likely a separate local-parent opportunity for families living in or near the greater New York City area. The intent differs:

- Tourist intent: first trip, iconic attractions, neighborhood logistics, transit/stroller friction, weather backups, 2-4 day planning, where to stay nearby.
- Local/nearby parent intent: this weekend, seasonal events, new exhibits, free/low-cost activities, borough-specific options, train-accessible day outings, repeatable weekend planning.

Recommendation:

- Keep improving the existing tourist-oriented NYC page first.
- Add a distinct local/nearby parent concept only if it can stay fresh and useful.
- Do not blend weekend events deeply into the evergreen tourist page; instead, link from the evergreen page to a freshness-oriented page or module.

Potential local page concepts:

| Concept | Suggested URL pattern | Notes |
|---|---|---|
| Weekend events for families in NYC | `/things-to-do/nyc-this-weekend-with-kids.html` | Best fit for freshness and automation |
| Greater NYC family day trips | `/things-to-do/nyc-day-trips-with-kids.html` | More evergreen; useful for local/suburban families |
| Free things to do with kids in NYC | `/things-to-do/free-things-to-do-nyc-with-kids.html` | Evergreen plus seasonal refresh |
| Rainy day things to do in NYC with kids | `/things-to-do/rainy-day-nyc-with-kids.html` | Strong product fit; can connect to weather backup planner |

Use `New York City` as the normalized destination name in internal systems. It is acceptable for page titles/meta copy to include `NYC` where search intent uses it.

## Weekend Automation Idea

This is a good candidate for a recurring research/review automation, but the output should be human-reviewable before publishing.

Proposed initial cadence:

- Run weekly on Wednesday or Thursday.
- Plan for the next 2-4 weekends.
- For the current date of July 8, 2026, the next weekends are July 11-12, July 18-19, July 25-26, and August 1-2, 2026.

Suggested workflow:

1. Collect candidate family events and experiences from reliable event sources, venue calendars, museum calendars, park/conservancy calendars, library/cultural calendars, and ticketing/event platforms.
2. Normalize each item into a structured table with date, borough/area, age fit, indoor/outdoor, price band, transit notes, stroller notes, reservation need, rain suitability, and source URL.
3. Flag items that need human review, especially safety, accessibility, pricing, sold-out status, neighborhood logistics, and age suitability.
4. Generate a draft "this weekend with kids" module or markdown handoff.
5. Human reviews and approves before publishing.

Automation guardrails:

- Do not publish automatically until source reliability and human review workflow are proven.
- Do not present event details as personally verified.
- Label freshness, source date, and last checked time.
- Keep event data separate from evergreen attractions data.
- Avoid claims about safety, stroller ease, accessibility, pricing, or transit convenience unless source-backed and human-reviewed.

## Implementation-Ready Handoffs

### Handoff 1: Improve NYC Tourist Page

Recommended next agent: Implementation Agent after SEO Research & Review confirms scope.

Primary file:

- `site/things-to-do/new-york-city-with-kids.html`

Goal:

Improve the existing tourist-oriented NYC page while keeping it evergreen and structured.

Suggested improvements:

- Add a clear "best for first-time visitors" summary near the top.
- Add filters or visible sections by age band, weather, budget, and stroller/transit difficulty.
- Add a "tourist vs local parent" note that explains this page is optimized for trip planning and links to a future weekend/local page when available.
- Strengthen internal links to `where-to-stay/new-york-city-with-kids.html` and `family-itinerary/new-york-city-with-kids.html`.
- Ensure claims that materially affect family decisions are either source-backed, estimated/model-derived, or marked for human review.

Validation:

- Run local link/sitemap/SEO checks if available.
- Confirm the page still loads from the static site.
- Confirm no hotel, safety, stroller, or transit claims are presented as personally verified.

### Handoff 2: Research NYC Local Parent Page

Recommended next agent: SEO Research & Review Agent.

Goal:

Decide whether to create a distinct local/nearby-parent page for New York City family activities.

Questions to answer:

- Is there measurable search demand for `nyc this weekend with kids`, `kids events nyc this weekend`, `things to do with kids nyc this weekend`, and related variants?
- Are SERPs dominated by local event calendars, tourism boards, social platforms, or weak listicles?
- Would a structured, freshness-oriented page be meaningfully better than existing results?
- Should the first local page be weekend events, day trips, free activities, or rainy-day activities?

Output expected:

- Recommendation label: `create`, `test`, `monitor`, or `ask user`.
- If `create` or `test`, produce a page brief and source list.
- Mark all keyword volume, CPC, difficulty, and ranking data as `UNKNOWN` unless measured with a named tool.

### Handoff 3: Plan GSC/API Data Pipeline

Recommended next agent: Master Operator or Implementation Agent.

Goal:

Move from one-off UI review to repeatable GSC monitoring.

Suggested future pipeline:

- Pull GSC data by date, page, query, country, and device.
- Store exports or processed summaries under `docs/research/` or a future data directory.
- Classify queries by destination, page type, age intent, commercial intent, and product opportunity.
- Produce a weekly "what Google is testing" report.

For now, Chrome/UI review is enough because the data volume is tiny.

## Recommended Next Actions

1. Keep building the NYC things-to-do page because it has the best early GSC page-level signal.
2. Ask SEO Research & Review to validate the NYC local-parent/weekend-events opportunity before creating a new page.
3. Improve San Antonio hotel-intent support, but avoid overreacting to the weak ranking until there is more GSC volume.
4. Set up repeatable GSC export/API analysis once impressions are consistently above tiny-sample levels.
