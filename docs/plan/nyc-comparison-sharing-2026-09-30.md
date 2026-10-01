# NYC Comparison Sharing

Action FT-IMP-049 / learning LRN-072. September 30, 2026. IMPLEMENT the existing twelve-hotel comparison's portable form; no new indexable page, inventory or price research. QA complete; independent review and production verification remain gates until operator state records them.

## Family Task

A parent has narrowed a family-of-five NYC trip to apartment or suite options and wants to send the comparison to another adult. Required outputs: a direct table route, an offline sortable comparison, unchanged approximate nightly prices, and the historical room/party/date/fee limitations traveling with each amount. The task does not need a new destination page, account, quote request or live booking promise.

Before: table/card prices existed with the reviewed FT-IMP-048 basis, but no anchored sharing route or portable NYC table. The user separately identified this type of price/comparison table as useful to share. That is product input from one user, not evidence of broad demand or satisfaction.

After: one ordinary same-page comparison link and one CSV download next to the table. The link resolves locally or in production without preview-to-production navigation. The exported comparison and source-route links are absolute public canonical URLs. Both controls work without JavaScript; no clipboard, tracking, stored family inputs or external submission.

## Shared Output Contract

One generator catalog supplies both page and download, and one NYC price-basis constant supplies table/card/export context. A shared CSV formatter retains the prior Las Vegas output byte-for-byte, escapes quotes, flattens line breaks and guards spreadsheet-formula prefixes. No unrelated data or schema refactor.

CSV: twelve data rows, fourteen columns: hotel, trip style, area, approximate USD per room/night, price observation date, basis/fee limits, property price context, room/family setup, review-source check date, sampled guest themes, most important check, map, source page and live comparison.

All twelve bands/order and room/review facts are unchanged. Price/review checks stay July 25, 2026; no source access or current-rate renewal. Two-adult samples, missing exact category/ages/rate-plan/date-season basis, conditional tax/fee inclusion, separate extras and editorial ceilings remain attached to every row. TRYP's separate guest-reported $654 amount stays an anecdote, not a comparable family quote. The source-page route opens the existing methodology/official-source section, not new claim-level provenance or fresh research.

## Proxy And Native QA

Generated-page proxy, not user testing:

- At 1280x900, clicking the comparison link reaches `#hotel-comparison`; heading top119px. The ordinary download produced an 18,818-byte CSV identical to the generated file.
- At 390x844 and 320x800, the sharing links wrap without overlap; document widths remain390/320px. The 320px comparison heading wraps into two lines, not outside the container. The existing contained table scroll remains1180px inside352/282px.
- The prior correction already validated actual mobile horizontal scrolling and all twelve row/card price contexts. This sharing action preserves them. Temporary viewport override reset.
- Preview CSV HTTP200, `text/csv; charset=utf-8`; actual browser download has twelve records/fourteen columns and stable public source/comparison URLs.
- Focused NYC/Vegas tests12; full native287; stateQA0, staticSEO31canonicals/0errors/fiveprioradvisories, whitespace/generation-idempotence/source-output parity pass. Other site files, existing Vegas CSV, sitemap, title/H1/meta/canonical and catalog values remain unchanged.

Measurement boundary: the task can share or export the maintained comparison with context; no real usage, actual family booking, satisfaction, backlink, rank or CTR result. Reused September30GSC throughSeptember28 is orientation only, overlapping prior; no query cohort or snippet experiment.

Confidence high for same-record parity and reproducible interaction; medium for proxy usefulness; unknown for broader adoption or SEO. Reusable lesson: portable comparisons need dates and limitations per row, not just numbers detached from a webpage note. Next falsification trigger: a source/band changes without export parity, a mobile/CSV consumer loses context, independent review finds an unsupported assertion, or real user evidence favors another format. Extend other city exports only under their own source/basis and acceptance checks.

Production invariants:31canonical URLs, all NYC metadata/indexability/facts/bands, all other public files/windows unchanged; only NYC HTML plus its CSV change. No new price/source date, paid call, account mutation, analytics, indexing, outreach or scheduler. Exact twelve registered paths and six unrelated dirty exclusions are recorded in operator state.
