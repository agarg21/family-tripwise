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

Initial result before deployment:

- Sitemap returned 200 and parsed 22 URLs.
- All configured monitored URLs returned 200.
- All configured monitored URLs appeared in the sitemap.
- Production `robots.txt` returned 404 before deployment.
- Repo fix added generated `site/robots.txt` with `Sitemap: https://familytripwise.com/sitemap.xml`.

## GSC Status

Pending first dedicated GSC Monitoring Agent run after `robots.txt` deployment.

Record on the next run:

- sitemap status
- last read date
- discovered pages
- discovered videos
- URL Inspection status for configured URLs
- whether indexing was requested

## Next Monitoring Action

Deploy `site/robots.txt`, rerun public preflight, then have the GSC Monitoring Agent perform the initial GSC check and update this report.
