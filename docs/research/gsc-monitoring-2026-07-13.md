# GSC Monitoring Report: 2026-07-13

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

Repo-side issue fixed:

- Before deployment, `https://familytripwise.com/robots.txt` returned 404.
- Added generated `site/robots.txt` with `Sitemap: https://familytripwise.com/sitemap.xml`.
- Deployed setup commit `f7e514c` through GitHub Pages run `29259511918`.

## GSC Private Check

Status: blocked on 2026-07-13.

The available browser session reached the Google sign-in page for Search Console, and no already-authenticated GSC tab was available to claim. No account-level GSC changes were made.

## Last Known Authenticated GSC Status

From the Master / Operator's authenticated browser review on 2026-07-12:

- Performance: 213 impressions, 0 clicks, 0% CTR, average position 60.2.
- Sitemap status: Success.
- Sitemap last read: Jul 8, 2026.
- Discovered pages: 22.
- Discovered videos: 0.
- Page indexing report: processing data.
- HTTPS: 15 HTTPS URLs and 1 `HTTPS not evaluated` URL, last update Jul 11, 2026.
- Manual actions: no issues detected.
- Security issues: no issues detected.

## URL Inspection

Configured URL inspection was not completed on 2026-07-13 because GSC required Google sign-in.

Indexing requested: No.

Indexing was not authorized for this run, and no indexing request was submitted.

## Next Monitoring Action

Sign into Google Search Console for `familytripwise.com` in Chrome, or open an authenticated GSC tab, then ask the GSC Monitoring Agent to inspect `ops/gsc-monitor.json`.

Priority subset if full URL inspection is too slow:

- `https://familytripwise.com/`
- `https://familytripwise.com/where-to-stay/san-diego-with-kids.html`
- `https://familytripwise.com/things-to-do/san-diego-with-kids.html`
- `https://familytripwise.com/things-to-do/new-york-city-with-kids.html`
- `https://familytripwise.com/where-to-stay/san-antonio-with-kids.html`
- `https://familytripwise.com/things-to-do/las-vegas-with-kids.html`
- `https://familytripwise.com/where-to-stay/chicago-with-kids.html`
