# OWNER (decisions and owner-only tasks; keep ≤4 KB)
The operator acts only on rows marked Approved. New questions: yes/no, with a recommendation.

## Decisions (answered 2026-10-27)
- D1 Operating model — Approved: cloud-only scheduled task every 4 hours; hourly until 2026-10-30 10:00 ET; 1 transaction per run and no daily cap (owner 2026-10-27); headless Chromium (Playwright) is the approved rendered-QA tool; no runs on the owner's Mac.
- D2 Repo simplification — Approved: Codex-era logs archived to archive/2026-10/; 5 governance tests replaced by tools/ops-state.test.mjs; AGENTS.md autopilot section shortened; one-page strategy.
- D3 Orlando admission form — Approved: ship directly to main after tariff refresh, QA and independent review. Owner's 20 local files preserved on branch owner-local-2026-10-27.
- D4 Multi-page batches — Approved: (a) staleness wording sweep, (b) shared nav + related links, (c) Coronado ferry link fix, (d) self-hosted hero images, (e) lodging-page readability fix. None may add URLs or change indexability.
- D5 Byline — Rejected change: keep "Miles Rowan" (disclosed AI contributor). The false About claim is still corrected (Q05).
- D6 Breadth — Not frozen: the site keeps growing under AGENTS.md's new-URL rule. New destinations still need a fresh Approved row.
- D7 Source access — Approved: official venue/hotel/operator pages at most once per URL per run and once per week, honoring robots.txt and Crawl-delay; keep dated extracted facts, not raw bodies; never fetch third-party review sites automatically. Garfield/Dana holds closed; Tripadvisor holds rejected.

- D8 Search data (DataForSEO) — Approved by owner 2026-10-27: paid keyword/SERP research via request files in ops/research-requests/ run by GitHub Actions with the DATAFORSEO_AUTH_B64 secret; at most USD 0.50 per batch and USD 20 cumulative across receipts (USD 0.36 used before Oct 27). Raising the cap needs a new owner decision.

## Owner tasks (operator cannot do these)
- T1 (done 2026-10-27, owner-approved, via owner's Chrome): sitemap resubmitted (Google read it immediately: 36 discovered, was 28); indexing requested for all 5 URLs. Original task: In Google Search Console, resubmit https://familytripwise.com/sitemap.xml and Request indexing for: /things-to-do/san-diego-with-kids.html, /things-to-do/san-diego-with-teens.html, /family-itinerary/new-york-city-with-kids.html, /where-to-stay/orlando-family-hotels.html, /where-to-stay/puerto-vallarta-family-resorts.html.

## Open questions
(none)
