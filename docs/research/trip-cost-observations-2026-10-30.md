# Trip-cost observations (QUEUE G12), 2026-10-30

| Receipt | Search | Observed | Reading |
|---|---|---|---|
| dataforseo-g12-atlantis-hotel-prices-2026-10-30.json | "Atlantis The Coral" / "Atlantis The Royal", coordinate 25.0849,-77.3226, 2 adults + kids 5 and 8, Jan 11-15 2027 and Jan 11-12 | 2026-10-30 08:19Z, USD 0.012 for 3 searches (USD 0.004 each) | Unusable: the coordinate resolved to listings on Eleuthera (no Atlantis rows matched) and every row had provider price 0, which we read as no price shown (the provider docs do not say; possibly the party or the place); never free. The receipt itself still holds 0: read it as unknown. The tool now stores 0 as null and prefers a country location_code; retry in the -b request. |
| dataforseo-g12-atlantis-hotel-prices-b-2026-10-30.json | "Atlantis Paradise Island", location_code 2044 (The Bahamas), same party, Jan 11-15 and Jan 11-12 2027 | 2026-10-30 08:30Z, USD 0.008 for 2 searches | Location right but Google returns one umbrella entity, "Atlantis Paradise Island Bahamas", with no price for either stay; no tower (Coral) row, so matched_count 0. No figure usable. |

Per-search cost observed: USD 0.004 (depth 18), far below the USD 0.05 reserve.
Per-night vs per-stay basis: still unknown (no priced rows yet). Total G12 spend so far USD 0.020; ledger 0.3826 of USD 20.
Next: test the pipeline on a property Google prices as its own listing (e.g. a US resort such as Great Wolf Lodge or a LEGOLAND hotel) with the family party, plus one 2-adult Atlantis diagnostic; never publish a 2-adult rate as a family price.
If the retry also returns only 0 prices, next try one 2-adult diagnostic search (never published as a family price).
