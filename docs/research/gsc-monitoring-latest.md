# GSC Monitoring Latest

Last materially updated: 2026-07-27

This file is a lightweight handoff, not an independently maintained GSC data copy. Read the newest normalized dated snapshot for exact current evidence:

- Machine-readable source: `ops/gsc-snapshots/2026-07-27.json`
- Human-readable rendering: `ops/gsc-snapshots/2026-07-27.md`
- Historical manual/UI evidence: `docs/research/gsc-monitoring-2026-07-13.md`
- Monitor config: `ops/gsc-monitor.json`

## Current evidence summary

- Property: `sc-domain:familytripwise.com`.
- Collection mode: authenticated read-only Search Console API.
- Collected: `2026-07-27T13:22:22.689Z`.
- Finalized performance data through: `2026-07-25`.
- Completeness: `finalized-conservative`, based on a conservative two-day lag.
- Performance: 982 impressions, 1 click, 0.1% CTR, average position 61.22 over the recorded 28-day period.
- Public preflight: the live sitemap and robots file return 200, robots advertises the sitemap, and the sitemap contains 28 canonical URLs.
- GSC sitemap before refresh: `Success`; 22 discovered pages; last read `2026-07-08T08:39:19.199Z`.
- Priority URL Inspection: 12 of the prior 15 monitored URLs indexed; three not indexed; zero collector-unknown rows.
- Not indexed in the API set: San Diego things-to-do for kids and teens, plus the New York City family itinerary.
- Direct GSC inspection on July 27 found all five family-hotel pages unknown to Google with no referring sitemap detected.
- The existing sitemap was successfully resubmitted on July 27. GSC accepted it and will process it asynchronously; no per-URL indexing request was made.
- Monitor coverage now matches all 28 sitemap URLs, with a regression test preventing future silent drift.
- A protected page-query export for finalized data through July 25 was encrypted in GitHub and decrypted only into central operator state. Named query evidence aligns with the intended family activity, hotel, and stay intents.
- GSC login blocker: none.
- Indexing requested: no.

Routine snapshot/schema/privacy validation, URL Inspection reconciliation, and a healthy public preflight are operator housekeeping. Leave this narrative file unchanged unless interpretation, a blocker, monitored scope, or a material decision changes; dated normalized snapshots are the routine durable evidence.
