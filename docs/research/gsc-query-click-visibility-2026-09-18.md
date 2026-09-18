# GSC Query Click Visibility

Recorded September18, 2026 under direct-user queue/clarification action `FT-OPS-006`. This is a reporting explanation, not a daily product-learning unit or a raw export.

## Observed UI

Opened the user's authenticated Family Tripwise Performance report. The selected seven-day Web window displayed **September9-15, 2026**, with no query/page/country/device filter chip. UI said last update five hours ago; no stronger finalization claim is inferred from that label.

- Property cards: five clicks, 442 impressions, 1.1% CTR, average position41.7.
- Queries: increased the visible row limit to250 and counted all149 rendered data rows without retaining their text; their click sum was zero.
- Pages under the same report filters: `/where-to-stay/san-diego-with-kids.html` had three clicks; `/where-to-stay/san-antonio-with-kids.html` had two. These are area pages, not the family-hotel pages.

The UI observation is separate from the reused September17 API snapshot's 28-day window through September15 (six clicks). Different window lengths must not be treated as conflicting totals. No query list, account identifier, country/device data or credentials enter this record. No export or account setting changed; only report display controls were used.

## Interpretation And Limits

Google omits anonymized search terms from query tables while retaining their contribution to unfiltered totals. The query API does not disclose those terms either. Other reporting limits can also omit rows, so we cannot prove an exact privacy-versus-other-omission breakdown. The observed five clicks with zero disclosed query clicks is consistent with withheld query data, not evidence that page clicks are false. The149 rows are below the UI's documented1,000-row ceiling; ordinary visible pagination was checked.

We can identify the two landing pages, but cannot name which hidden phrases generated these five clicks. Do not infer clicked terms from page titles or high-impression zero-click queries. Widening a date range or filtering a page can inspect other available query evidence, but does not promise recovery of these hidden terms. DataForSEO and ordinary analytics cannot be used to reconstruct GSC's withheld search strings; no analytics installation is proposed.

Next verification only if useful: compare disclosed clicked-query coverage over a longer, explicitly dated window or an aligned page filter using the protected read-only workflow. Keep unknown clicks unattributed. Do not repeatedly export or guess hidden queries.

Official reference, published October19, 2022 and checked September18, 2026: [Google Search Central: performance data filtering and limits](https://developers.google.com/search/blog/2022/10/performance-data-deep-dive). The dated UI observation supports the case; the official source supports the reporting mechanism, not the identity of any withheld query.
