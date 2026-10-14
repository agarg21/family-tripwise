# Reviewed Forecast State Reader

FT-IMP-167 adds a read-only consumer to the [166 forecast pilot](nws-forecast-pilot.md). [Dated evidence](../research/nws-forecast-state-2026-10-14.json) records actual-clock expiry, unchanged private-file hashes/modes, synthetic controls and the narrow browser dependency. No forecast service, public display, new URL, source request or weekly fact renewal is implemented.

## Interface

`reviewedPilotState(reportBytes, { expectedReportSha256, expectedEventSha256, events, at })` is pure. `readReviewedPilotState({ journalDir, expectedReportSha256, expectedEventSha256, at })` loads fixed local files only, defaulting to the actual system clock. Nonblocking, no-follow descriptor opening precedes regular-file, private-mode and size validation, so a named pipe with no writer cannot hang the initial open. A second report read detects report drift during the read. This is a validated snapshot, not a filesystem lock or distributed/power-loss guarantee.

The trusted operator supplies report and every event hash pin through independent review. Matching hashes establish byte integrity relative to those inputs, not source authenticity, independent review authority, a license or a security sandbox. Do not derive new pins from arbitrary files and treat them as reviewed. The reader joins exact point/forecast order, source/grid, review-code hash consistency, request/result chronology and serialized normalized metadata. It rechecks the consumed typed fields, not original source text or the whole OpenAPI contract.

Outputs contain only status and source-clock metadata plus the existing official forecast-check link. They do not expose a period, temperature, rain probability, source summary, raw error, private path or reviewer identity. `period_available` means a candidate existed at the supplied evaluation time, not that it is actual weather, suitable, reviewed for publication or fresh at another time. An explicit historical clock is a diagnostic replay, not a current check. Original166 header-receipt timing remains unchanged and disclosed in its evidence; this reader does not correct it retroactively.

## Holds And Expiry

Before capture, at or after expiry, outside returned periods, or with missing/corrupted/held input, the reader does not offer forecast data. Unknown is not dry or zero. All outputs retain `retry_authorized: false`, `public_publish_authorized: false`, `fact_dates_renewed: false` and `weekly_baseline_advanced: false`. There is no import-time transport, writer, fallback, collector invocation or scheduler. A held or expired status is not permission for another API attempt; collection must satisfy the next separately registered source/review/checkpoint gates.

The actual166 report expired at13:03:12UTC on October14. Its historical availability and actual-now expiry can both be correct. Neither changes the October7 weekly baseline, establishes a public weather service or proves scalable weekly operation.

## Verification

Run `node --test tools/nws-forecast-state.test.mjs`. Six `pure:` controls use in-memory synthetic report bytes; three `filesystem:` controls use disposable private fixtures and no transport. The FIFO regression runs the reader in an isolated child with a two-second timeout, preventing a future blocking-open regression from hanging the full test runner. Independent read-only reviewers may run only `--test-name-pattern='^pure:'`. Full native QA and the actual immutable local-journal check are Master's responsibility. Actual result evidence records no source request or write to the original journal.

The attempted existing-page task remains unvalidated: normal in-app browser creation timed out attaching twice, including one transient retry. No desktop/mobile/keyboard or page-defect result is claimed. Preserve the published itinerary and original source-policy holds; do not change settings, switch browsers/tools/origins or deploy merely to obtain a preview. Revisit only after documented changed successful normal attachment. This dependency does not prevent independent local evidence work.
