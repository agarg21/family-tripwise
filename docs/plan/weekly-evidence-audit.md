# Weekly Evidence Audit

Action FT-ACC-001; source date September30,2026. This is collection infrastructure, not a mass rewrite or a new scheduler.

FT-MAINT-009 final gate September30: Bohr cycle-three independent read-only PASS/noP0-P3, focused17/state0/79snapshots/SEO31zeroerrorsfivepriorwarnings and immutability/scope controls independently verified; operator full284 passed. All three reviewP2s closed. The existing operator is weekly-triage-ready, first dueOctober7. Tools/docs push remains; no public update or current-rate verification claimed.

## Implemented

`tools/evidence-audit.mjs` reads all canonical URLs from the generated sitemap, checks their local files/notices, inventories their public source links and fetches only exact HTTPS allowlisted hosts. Four requests maximum globally, one per host, ten-second timeout, three-megabyte cap, bounded redirects revalidated against the allowlist. No login, cookies, browser challenge bypass or recursive crawl. Linked source bodies are discarded; public-safe hashes/statuses and limited structured Offer price candidates remain.

`ops/evidence-watch.json` holds critical legacy field watches. All seven hotel comparisons now share65records/390field envelopes;240legacy envelopes have source links after FT-STD-002/003, with atomic mapping gaps explicit. Cancun/Orlando price and source records reuse existing data modules, avoiding a duplicate manually maintained price database. Each watch retains field, original observation date, interval, source, evidence path and basis. Prices use14days; mapped policy sources30days. Publication dates and successful fetches cannot reset either. All-page source coverage is not complete claim-level freshness coverage;24pages lack this hotel-field contract, including utility pages where it is not applicable.

States: `text-changed-review`, `structured-price-changed-review`, `text-unchanged`, `retrieved-baseline`, `unavailable-review`, `challenge-or-empty-review`, `unsupported-format-review`, `access-denied-carried-forward`, `deferred-limit`. Structured-price changes are hashed separately so script-only Offer price changes are not hidden by unchanged visible text. HTTP401/403 and prior challenge outcomes carry forward with original attempt dates; do not retry unchanged denials. A changed permitted-access condition requires an owner-recorded new source baseline, not a tool switch to bypass access. PDFs and script-only booking results remain research gaps. Hashes include page navigation and dynamic text, so changes may be noise; unchanged text is not proof a claim is accurate.

## First Run

`ops/evidence-audits/2026-09-30.json`:31canonical pages,332distinct sources,211retrieved,110unavailable,8challenge/empty,3unsupported,104seconds. Five dated legacy price sets are due;24pages have no mapped critical-field records yet, including utility pages where a hotel-field registry is not applicable. Three exact hotel-price gaps are explicit: Ziva Ocean View Double, Art of Animation and Cabana Bay. Fifteen structured offers were extracted across four sources; they include attraction/ancillary offers and a Cabana Bay zero placeholder, not fifteen hotel quotes. None updates a public rate.

Immediate second collection of successful Hyatt Wild Oak and Finest room sources returnedHTTP200 and `text-unchanged`. IHG had no successful baseline and was not retried. Native controls validate denial carry-forward, unknown dates, script-insensitive hashes, exact-source model reuse and all31-page inventory. This is a baseline and two-source smoke validation, not a measured reduction against the old manual workflow or stable performance across all sources.

## Weekly Operator Gate

The existing operator reads `ops/operator.json.weekly_evidence_audit`; no extra automation. FT-MAINT-009 implements the full-inventory repeat and deterministic review queue below; independent review is the remaining rollout gate. First weekly due date October7; every7Eastern days thereafter, select this collection as maintenance within the existing action policy. Scan every page, review changed/due/unknown priority fields, and resolve one family problem end-to-end. A severe verified defect may interrupt an observation window; a hash change alone may not.

Save one dated output and compare to the prior output. Do not overwrite baseline evidence. Record coverage, elapsed time, missing/blocked sources, meaningful reviewed deltas and next due date. Unchanged collection alone is not daily learning. Public fact/price edits require original-source reconciliation, native QA, independent review and normal release. Do not spend the whole run writing repeated health reports.

## Full Repeat And Review Queue

September30 FT-MAINT-009 source-dated audit: `ops/evidence-audits/2026-09-30-repeat.json` covers31pages/455sources in120seconds. It reuses the immutable332-source baseline;123newly inventoried source links reflect completed mapping, not new destinations or fresh claims. Results:171unchanged,39text changes,9new successful baselines,120unavailable,23challenge/empty,4unsupported and89prior denials carried with original attempt dates.210previously retrieved sources remained comparable; one previously retrieved source now failed. No requests were deferred and no original field dates or public values changed.

The39/210same-day text deltas demonstrate that whole-page hashes cannot decide which hotel facts changed. They may reflect navigation, booking inventory or other noise; this audit did not retain source bodies or reconcile those deltas. The workflow is suitable for weekly triage with manual source reconciliation, not unattended fact renewal. Long-term noise rate, exact-family price collection and complete atomic/non-hotel claim coverage remain unproved.

`tools/weekly-evidence-review.mjs` validates canonical coverage, all390shared model records/date/basis parity, denial carry-forward and deferred evidence before generating a prioritized source queue and due/unknown field queue. Its saved deterministic output is `ops/evidence-audits/2026-09-30-review.json`:39unreconciled source changes,147new/current collection gaps (separate from89carried denials),349due/unknown fields. Counts are review signals, not public errors. Newly successful baselines are not reported as changes. Deferred prior changes do not masquerade as this run's new evidence. Exact-room/price/fee-linked sources sort first; broad paragraph mappings still require subclaim reconciliation.

Weekly run, using new registered paths and the last retained audit as previous:

```sh
node tools/evidence-audit.mjs --collect --limit 500 --date 2026-10-07 --previous ops/evidence-audits/2026-09-30-repeat.json --output ops/evidence-audits/2026-10-07.json
node tools/weekly-evidence-review.mjs --current ops/evidence-audits/2026-10-07.json --previous ops/evidence-audits/2026-09-30-repeat.json --output ops/evidence-audits/2026-10-07-review.json
node tools/page-quality.mjs --date 2026-10-07 --output ops/page-quality/2026-10-07.json
```

Both audit/review tools reject an existing output; never delete evidence to bypass the guard. Register a distinct scoped retry path after an interrupted collection, reconcile retained results, and do not retry unchanged access denials. The review checks every page/model-linked source exists in the audit and exposes both newly deferred and carried-deferred sources in a separate no-new-evidence queue. If the source inventory exceeds500, treat deferred sources explicitly and use a reviewed bounded batching design; do not call a partial scan complete. Inspect one priority family's actual source/field gap and complete its release gates rather than rewriting all pages from this queue.

## Price Collection Contract

Use approximate nightly ranges as a core comparison field. A source-specific adapter must return currency; per-room/per-night unit; exact room and room count; adults/child ages; arrival/departure or stated season; observed timestamp; plan/promo; room subtotal; taxes/mandatory fees and known exclusions; cancellation terms and unknowns. Never derive occupancy from bedding, relabel two-adult rates as family rates, treat0as a free stay, infer unshown taxes or sum fees already included.

For dynamic booking flows, first try permitted public structured data or an official documented endpoint. An LLM may classify/compare candidates but cannot invent missing basis or mark evidence verified. Review a readable public booking result through the normal permitted workflow when the adapter cannot establish the basis. No accounts, reservations, payments, credential reuse on third-party hosts, stealth scraping or paid price service without explicit authority. Keep historical ranges visible with dates until a defensible replacement exists.

Next implementation priorities: reconcile atomic legacy claim dates/mixed components; prioritize due price sets by actual page relevance and decision gaps; add exact-party price adapters for accessible sources with unknown/error fixtures; support PDF notices without retaining copied documents. These are scoped tasks, not prerequisites to city demand research. Keep historical nightly ranges visible with their limitations while researching replacements.
