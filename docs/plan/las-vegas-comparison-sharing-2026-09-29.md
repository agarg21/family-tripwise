# Las Vegas Hotel Comparison Sharing

FT-IMP-046, September 29, 2026. Decision: make the existing ten-hotel comparison portable through a stable table link and a generated CSV. This does not create a canonical page, add hotels, refresh rates, or claim an SEO outcome.

## Family Task And Evidence

A family comparing a central suite, a pool-led resort and a lower-cost base should be able to send the table to another planner or open it offline without losing the price basis, main booking check, or room-capacity uncertainty. The user identified the hotel/price table as a useful sharing asset and specifically asked that approximate nightly price remain. The existing Las Vegas table already contains ten dated planning bands and September 16 room-capacity checks for four named rooms; its direct link and export were missing. `docs/research/las-vegas-price-basis-2026-09-29.md` is the price-boundary record. This is a proxy task, not observed user behavior.

The CSV is generated from the same ten hotel records as the page. It carries the unchanged hotel order, area and trip style, approximate USD per-room/night band, July 22 observation date, mixed-party/room/tax/fee caveat, price context, main booking check, map route, and table permalink. Four independently spot-checked room rows retain the September 16 date, named room, published capacity and official source; the other six explicitly remain unverified for room capacity. The bands are historical budget orientation, not current quotes for a five-person suite or full stay. CSV cells are quoted and guarded against spreadsheet-formula interpretation. A static download link works without JavaScript.

## Acceptance And Measurement

Accept when the 31 canonical URL inventory, Las Vegas title/H1/canonical/indexability, ten names/order/bands and four capacity records remain unchanged; the table anchor and ten-row CSV work at desktop and mobile widths; native focused/full, state, snapshot and SEO QA pass; a separate read-only reviewer returns PASS or PASS_WITH_P3; and the exact reviewed release is verified in production. Measure proxy answerability and download/anchor integrity only. No analytics, ranking, click, sharing or satisfaction inference is available.

## Discovery And New-Page Decision

The September 29 public preflight found the live sitemap, robots declaration, and all 31 configured URLs reachable and represented. The September 3 matched internal-discovery audit rejected a linking-defect hypothesis for four older GSC-unknown URLs. The latest September 28 public-safe GSC snapshot is a reused API read, finalized through September 26; it is orientation, not a reason to request indexing or alter page titles.

The conditional new-page part of the user's request is **not yet eligible**. September 26 Orlando rest-day research demonstrates an internally useful three-attraction rule model, but explicitly rejects a generic all-ages launch. The September 29 live result sample still overlaps broad non-park, rainy-day and indoor list jobs. It does not establish material distinct demand or a complete, maintainable family decision, and date-specific operations, total price and transport remain open. Keep the prototype unpublished. Next gate: current US query/page-role overlap plus source refresh and an end-to-end desktop/mobile family task for a narrowly scoped rest-day comparison. Publish zero new URLs until that gate passes; the user's instruction to do the conditional work does not turn an unqualified page into a useful one.

## QA And Review

Focused Las Vegas tests 6/6; full native 260/260; operator-state zero errors; 77 public-safe GSC snapshots valid; local SEO 31 canonical URLs, zero errors and five prior advisories. Python CSV parsing returned a header and ten 14-column rows. The preview CSV returned HTTP 200 with `text/csv`; proxy browser checks at 1280, 390 and 320 pixels found no document overflow, and the narrow table retained contained horizontal scrolling. Dirac (`01a0ec94-0976-7a43-80f6-c69094c8508d`) returned cycle-one independent read-only PASS with no P0-P3 findings. The reviewer independently ran full260, focused8 including discovery, state, local/production SEO, CSV parsing, sitemap count and diff check; desktop/mobile and preview MIME were reviewed as operator-reported checks. Production release remains pending at this checkpoint.
