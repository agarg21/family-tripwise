# GSC Monitoring Latest

Last materially updated: 2026-07-28

This file is a lightweight handoff, not an independently maintained GSC data copy. Read the newest normalized dated snapshot for exact current evidence:

- Machine-readable source: `ops/gsc-snapshots/2026-07-28.json`
- Human-readable rendering: `ops/gsc-snapshots/2026-07-28.md`
- Historical manual/UI evidence: `docs/research/gsc-monitoring-2026-07-13.md`
- Monitor config: `ops/gsc-monitor.json`

## Current evidence summary

- Property: `sc-domain:familytripwise.com`.
- Collection mode: authenticated read-only Search Console API.
- Collected: `2026-07-28T12:14:48.721Z`.
- Finalized performance data through: `2026-07-26`.
- Completeness: `finalized-conservative`, based on a conservative two-day lag.
- Performance: 1,033 impressions, 1 click, 0.1% CTR, average position 61.34 over the recorded 28-day period.
- Public preflight: the live sitemap and robots file return 200, robots advertises the sitemap, and the sitemap contains 28 canonical URLs.
- GSC sitemap after refresh: `Success`; 28 discovered pages; last read `2026-07-27T16:21:58.188Z`.
- URL Inspection: 20 of 28 monitored URLs indexed; eight not indexed; zero collector-unknown rows.
- Discovered but currently not indexed: the Chicago, New York City, and San Antonio family-hotel pages plus the New York City teen page.
- Unknown to Google: the San Diego all-ages and teen activity pages, New York City itinerary, and Chicago teen page.
- The San Diego and Las Vegas family-hotel pages are indexed as of the July 28 inspection.
- The existing sitemap was successfully resubmitted on July 27. GSC subsequently reread the sitemap and now reports 28 discovered pages; no per-URL indexing request was made.
- Monitor coverage matches all 28 sitemap URLs, with a regression test preventing future silent drift.
- A protected page-query export for finalized data through July 25 was encrypted in GitHub and decrypted only into central operator state. Named query evidence aligns with the intended family activity, hotel, and stay intents.
- GSC login blocker: none.
- Indexing requested: no.

Routine snapshot/schema/privacy validation, URL Inspection reconciliation, and a healthy public preflight are operator housekeeping. Leave this narrative file unchanged unless interpretation, a blocker, monitored scope, or a material decision changes; dated normalized snapshots are the routine durable evidence.
