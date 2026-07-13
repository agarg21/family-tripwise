# GSC Monitoring Latest

Last updated: 2026-07-13

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

Latest result after deployment:

- Sitemap returned 200 and parsed 22 URLs.
- All configured monitored URLs returned 200.
- All configured monitored URLs appeared in the sitemap.
- Robots returned 200.
- Robots advertises `Sitemap: https://familytripwise.com/sitemap.xml`.

## GSC Status

Initial private GSC check on 2026-07-13 was blocked by Google sign-in in the available browser session.

Last known GSC status from the Master / Operator's authenticated browser review on 2026-07-12:

- Performance report showed 213 impressions, 0 clicks, 0% CTR, and average position 60.2.
- Sitemap status: Success.
- Sitemap last read: Jul 8, 2026.
- Discovered pages: 22.
- Discovered videos: 0.
- Page indexing report: still processing data.
- HTTPS report: 15 HTTPS URLs and 1 `HTTPS not evaluated` URL, last update Jul 11, 2026.
- Manual actions: no issues detected.
- Security issues: no issues detected.

URL Inspection status for configured URLs:

- Not checked on 2026-07-13 because GSC required Google sign-in.
- Indexing requested: No. Indexing was not authorized for this run.

## Next Monitoring Action

Open or sign into Google Search Console for `sc-domain:familytripwise.com` in Chrome, then have the GSC Monitoring Agent inspect the configured URL set in `ops/gsc-monitor.json`. If full inspection is slow or rate-limited, inspect the priority subset first:

- `https://familytripwise.com/`
- `https://familytripwise.com/where-to-stay/san-diego-with-kids.html`
- `https://familytripwise.com/things-to-do/san-diego-with-kids.html`
- `https://familytripwise.com/things-to-do/new-york-city-with-kids.html`
- `https://familytripwise.com/where-to-stay/san-antonio-with-kids.html`
- `https://familytripwise.com/things-to-do/las-vegas-with-kids.html`
- `https://familytripwise.com/where-to-stay/chicago-with-kids.html`
