# GSC Monitoring Report: 2026-07-13

> Historical evidence: this report preserves the authenticated manual/UI inspection performed on July 13. It is not the current GSC handoff. The current normalized source is `ops/gsc-snapshots/2026-07-15.json`, collected through the read-only API on July 15 with finalized data through July 13.

## Site

- Site: Family Tripwise
- Domain property: `sc-domain:familytripwise.com`
- Canonical domain: `familytripwise.com`
- Sitemap: `https://familytripwise.com/sitemap.xml`
- Robots: `https://familytripwise.com/robots.txt`
- Config: `ops/gsc-monitor.json`
- GSC Monitoring Agent thread: `019f5bf2-811b-7132-800d-74b0920052ec`

## Public Preflight

Command:

```bash
python3 ~/.codex/skills/gsc-monitor/scripts/public_gsc_preflight.py --config ops/gsc-monitor.json
```

Result after deployment:

- Sitemap status: 200.
- Sitemap content type: `application/xml`.
- Sitemap parsed URLs: 22.
- Robots status: 200.
- Robots advertises sitemap: yes.
- All configured monitored URLs returned 200.
- All configured monitored URLs appeared in the sitemap.

Repo-side issue fixed before this monitoring run:

- Before deployment, `https://familytripwise.com/robots.txt` returned 404.
- Setup added generated `site/robots.txt` with `Sitemap: https://familytripwise.com/sitemap.xml`.
- Setup commit `f7e514c` deployed through GitHub Pages run `29259511918`.

## Historical GSC Sitemap Status

Checked manually in the authenticated Google Search Console UI for `sc-domain:familytripwise.com` on July 13.

| Sitemap | Type | Submitted | Last read | Status | Discovered pages | Discovered videos |
|---|---|---|---|---|---:|---:|
| `https://familytripwise.com/sitemap.xml` | Sitemap | Jul 5, 2026 | Jul 8, 2026 | Success | 22 | 0 |

## Historical URL Inspection

Indexing requests were not authorized and were not submitted.

This manual UI inspection was limited to seven priority URLs. It does not represent the current 15-URL inspection set.

| URL | GSC status | Page indexing | Last crawl | Discovery / sitemap detail | Fetch / canonical notes | Indexing requested |
|---|---|---|---|---|---|---|
| `https://familytripwise.com/` | URL is on Google | Page is indexed | Jul 12, 2026, 3:36:10 PM | No referring sitemaps detected; referring pages included HTTP/WWW variants of the canonical domain | Fetched successfully by Googlebot smartphone; Google-selected canonical is inspected URL | No |
| `https://familytripwise.com/where-to-stay/san-diego-with-kids.html` | URL is on Google | Page is indexed | Jul 4, 2026, 6:04:54 PM | No referring sitemaps detected; referring pages included the canonical homepage and an HTTP domain variant | Fetched successfully by Googlebot smartphone; Google-selected canonical is inspected URL | No |
| `https://familytripwise.com/things-to-do/san-diego-with-kids.html` | URL is not on Google | Page is not indexed: URL is unknown to Google | Not shown | Not shown | Not shown | No |
| `https://familytripwise.com/things-to-do/new-york-city-with-kids.html` | URL is on Google | Page is indexed | Jul 4, 2026, 6:02:18 PM | No referring sitemaps detected; referring page is `https://familytripwise.com/` | Fetched successfully by Googlebot smartphone; Google-selected canonical is inspected URL | No |
| `https://familytripwise.com/where-to-stay/san-antonio-with-kids.html` | URL is on Google | Page is indexed | Jul 4, 2026, 5:35:30 PM | No referring sitemaps detected; referring page is `https://familytripwise.com/` | Fetched successfully by Googlebot smartphone; Google-selected canonical is inspected URL | No |
| `https://familytripwise.com/things-to-do/las-vegas-with-kids.html` | URL is on Google | Page is indexed | Jul 4, 2026, 5:41:12 PM | No referring sitemaps detected; referring page is `https://familytripwise.com/` | Fetched successfully by Googlebot smartphone; Google-selected canonical is inspected URL | No |
| `https://familytripwise.com/where-to-stay/chicago-with-kids.html` | URL is on Google | Page is indexed | Jul 4, 2026, 5:49:19 PM | No referring sitemaps detected; referring page is `https://familytripwise.com/` | Fetched successfully by Googlebot smartphone; Google-selected canonical is inspected URL | No |

## Interpretation

- These statements describe the July 13 UI evidence only.
- Public crawlability is healthy for the monitored set.
- GSC sitemap processing is healthy at the sitemap level: `Success`, 22 discovered pages, 0 videos.
- Six of seven inspected priority URLs are indexed.
- `things-to-do/san-diego-with-kids.html` is the priority gap: it is live, in the sitemap, and returns 200, but URL Inspection says `URL is unknown to Google`.
- URL Inspection did not show referring sitemap attribution for inspected indexed URLs, even though the submitted sitemap itself is successful and the URLs are present in the sitemap. Monitor this; it may update as GSC reconciles sitemap and URL Inspection data.

## Current-state reconciliation

The later authenticated read-only API snapshot collected July 15 supersedes this report for current status:

- Collection mode: `search-console-api-readonly`.
- Collected: `2026-07-15T11:49:36.800Z`.
- Finalized performance data through: `2026-07-13`.
- Completeness: `finalized-conservative`, using a conservative two-day lag.
- Priority URL Inspection: 11 of 15 indexed and four not indexed; none are unknown to the collector.
- Not indexed: San Diego things-to-do for kids, toddlers, and teens, plus the New York City family itinerary.
- GSC login blocker: none; the authenticated API collector is working.
- Indexing requested: no.

## Blockers

No current blocker.

No indexing request was made. Indexing remains a separately gated action.

## Historical next action

At the time of the July 13 UI check, the next action was to rerun public preflight and reconcile the priority URLs. That reconciliation was completed by the July 15 API snapshot.

For current monitoring, read the newest dated snapshot under `ops/gsc-snapshots/` and run public preflight as routine housekeeping:

```bash
python3 ~/.codex/skills/gsc-monitor/scripts/public_gsc_preflight.py --config ops/gsc-monitor.json
```

Do not request indexing unless a later user authorization explicitly permits that action.
