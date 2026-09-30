# Weekly Evidence Audit

Action FT-ACC-001; source date September30,2026. This is collection infrastructure, not a mass rewrite or a new scheduler.

## Implemented

`tools/evidence-audit.mjs` reads all canonical URLs from the generated sitemap, checks their local files/notices, inventories their public source links and fetches only exact HTTPS allowlisted hosts. Four requests maximum globally, one per host, ten-second timeout, three-megabyte cap, bounded redirects revalidated against the allowlist. No login, cookies, browser challenge bypass or recursive crawl. Linked source bodies are discarded; public-safe hashes/statuses and limited structured Offer price candidates remain.

`ops/evidence-watch.json` holds critical legacy field watches. Cancun/Orlando price and source records are adapted from their existing data modules, avoiding a duplicate manually maintained price database. Each record retains field, original observation date, interval, source, evidence path and basis. Prices use14days; mapped policy sources30days. Publication dates and successful fetches cannot reset either. More legacy policy/review fields still need mapping; all-page source coverage is not complete claim-level freshness coverage.

States: `text-changed-review`, `structured-price-changed-review`, `text-unchanged`, `retrieved-baseline`, `unavailable-review`, `challenge-or-empty-review`, `unsupported-format-review`, `access-denied-carried-forward`, `deferred-limit`. Structured-price changes are hashed separately so script-only Offer price changes are not hidden by unchanged visible text. HTTP401/403 and prior challenge outcomes carry forward with original attempt dates; do not retry unchanged denials. A changed permitted-access condition requires an owner-recorded new source baseline, not a tool switch to bypass access. PDFs and script-only booking results remain research gaps. Hashes include page navigation and dynamic text, so changes may be noise; unchanged text is not proof a claim is accurate.

## First Run

`ops/evidence-audits/2026-09-30.json`:31canonical pages,332distinct sources,211retrieved,110unavailable,8challenge/empty,3unsupported,104seconds. Five dated legacy price sets are due;24pages have no mapped critical-field records yet, including utility pages where a hotel-field registry is not applicable. Three exact hotel-price gaps are explicit: Ziva Ocean View Double, Art of Animation and Cabana Bay. Fifteen structured offers were extracted across four sources; they include attraction/ancillary offers and a Cabana Bay zero placeholder, not fifteen hotel quotes. None updates a public rate.

Immediate second collection of successful Hyatt Wild Oak and Finest room sources returnedHTTP200 and `text-unchanged`. IHG had no successful baseline and was not retried. Native controls validate denial carry-forward, unknown dates, script-insensitive hashes, exact-source model reuse and all31-page inventory. This is a baseline and two-source smoke validation, not a measured reduction against the old manual workflow or stable performance across all sources.

## Weekly Operator Gate

The existing operator reads `ops/operator.json.weekly_evidence_audit`; no extra automation. Start with baseline-ready state. Next eligible run checks the baseline output/model parity and source-noise handling, then marks the collector stable only after read-only review. First weekly due date October7; every7Eastern days thereafter, select this collection as maintenance within the existing action policy. Scan every page, review changed/due/unknown priority fields, and resolve one family problem end-to-end. A severe verified defect may interrupt an observation window; a hash change alone may not.

Save one dated output and compare to the prior output. Do not overwrite baseline evidence. Record coverage, elapsed time, missing/blocked sources, meaningful reviewed deltas and next due date. Unchanged collection alone is not daily learning. Public fact/price edits require original-source reconciliation, native QA, independent review and normal release. Do not spend the whole run writing repeated health reports.

## Price Collection Contract

Use approximate nightly ranges as a core comparison field. A source-specific adapter must return currency; per-room/per-night unit; exact room and room count; adults/child ages; arrival/departure or stated season; observed timestamp; plan/promo; room subtotal; taxes/mandatory fees and known exclusions; cancellation terms and unknowns. Never derive occupancy from bedding, relabel two-adult rates as family rates, treat0as a free stay, infer unshown taxes or sum fees already included.

For dynamic booking flows, first try permitted public structured data or an official documented endpoint. An LLM may classify/compare candidates but cannot invent missing basis or mark evidence verified. Review a readable public booking result through the normal permitted workflow when the adapter cannot establish the basis. No accounts, reservations, payments, credential reuse on third-party hosts, stealth scraping or paid price service without explicit authority. Keep historical ranges visible with dates until a defensible replacement exists.

Next implementation priorities: normalize five legacy hotel packs into field records; prioritize due price sets by actual page relevance and decision gaps; add exact-party price adapters for accessible sources with unknown/error fixtures; support PDF notices without retaining copied documents. These are scoped tasks, not prerequisites to city demand research.
