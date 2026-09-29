# Las Vegas family-hotel price-basis correction

Action: FT-IMP-045 / LRN-063. Maintained-evidence audit and existing-page proxy task: September 29, 2026. Existing URL only.

## Family decision

Two adults and children ages 4, 8 and 11 need a five-person suite and want to screen a roughly USD 350-per-night Las Vegas budget across Vdara, Grand Chateau and Tahiti Village. Hypothesis: the existing `Rough total/night` label plus final-price checks already prevents a July low-room example from being read as an exact five-person suite quote. Rejected. The table, ten card price fields, ItemList, hero and meta use total-night language; several card notes still call July 22 examples recent or current. The September 16 room-capacity branch correctly names possible five-person categories, but explicitly does not renew their July prices.

## Source-dated evidence and limits

- `PRICE_BAND_EVIDENCE`: [Las Vegas family-hotel evidence pack](las-vegas-family-hotel-evidence-pack.md), July 22. Ten wide USD bands synthesize public direct, OTA and metasearch examples; they are not observed upper-end quotes. Some examples explicitly used two adults, while party and exact room are not consistently documented across all ten. Grand Chateau's low public example was before tax, Resorts World has a higher example plus tax, and other sources displayed taxes and mandatory fees where stated. Treat inclusions as mixed, not uniform. The Vdara high example included private inventory, not necessarily official hotel stock. Parking, optional purchases and exact suite premiums may be extra. No current quote or five-person price was collected in this audit.
- `ROOM_EVIDENCE`: the September 16 capacity overlay supports named five-plus categories at Grand Chateau, Tahiti Village and Cancun Resort, and a two-bedroom Vdara fallback. It does not establish availability, current price or booking acceptance for the proxy family.
- `EXISTING_PAGE_PROXY`, September 29: the page's ten prices can orient a budget, but its first comparison point obscures the mixed observation basis. A family cannot choose among exact five-person suites or calculate a full stay from those bands. This is a page walkthrough, not user testing.
- `GSC_ORIENTATION`: September 28 public-safe API snapshot finalized through September 26: the Las Vegas hotel page has 129 impressions, zero clicks and page-average position 56.63. September 27 is an overlapping 28-day window. Neither supplies an aligned query cohort or selects a ranking, CTR or title experiment.

## Decision and verification

Implement a narrow trust correction on the current comparison. Preserve all ten USD bands/order and September 16 capacity facts. Identify the bands as July 22 historical per-room/night planning context, with two-adult examples only where recorded, party/room basis unknown for others, mixed tax/mandatory-fee inclusion and no exact five-person suite quote. Carry this through the trust strip, table, cards, FAQ, ItemList, hero and meta; remove current/recent framing from individual July price notes. Do not infer any new price or preferred hotel.

The evidence pack calls for a price recheck on a material hotel-page update. This action only corrects the interpretation of unchanged July bands and does not recommend a booking. Current comparable exact-party/room quotes are absent from this record; the October 11 refresh remains a separate due task. Historical labels and explicit unknowns make this narrow deferral acceptable, but any new price or value recommendation first needs fresh comparable quotes.

Acceptance: the proxy family can retain an approximate nightly budget while recognizing that exact room, five guests, dates, fees and full stay total must be checked. Run focused/full native QA, desktop/mobile proxy at 1280/390/320, independent read-only review and verified Pages release. Preserve 31 canonical URLs, title/H1/canonical/indexability/sitemap, room facts and other public files. Confidence high in source/page mismatch, medium in clarity improvement for the proxy, unknown in real behavior or SEO. Reopen on October 11 price refresh, a changed fee/room rule, a current exact-party quote, or a proxy reader still mistaking an old low-room example for a five-person total.
