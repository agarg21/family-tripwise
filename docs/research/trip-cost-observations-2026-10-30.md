# Trip-cost observations (QUEUE G12), 2026-10-30

| Receipt | Search | Observed | Reading |
|---|---|---|---|
| dataforseo-g12-atlantis-hotel-prices-2026-10-30.json | "Atlantis The Coral" / "Atlantis The Royal", coordinate 25.0849,-77.3226, 2 adults + kids 5 and 8, Jan 11-15 2027 and Jan 11-12 | 2026-10-30 08:19Z, USD 0.012 for 3 searches (USD 0.004 each) | Unusable: the coordinate resolved to listings on Eleuthera (no Atlantis rows matched) and every row had provider price 0, which we read as no price shown (the provider docs do not say; possibly the party or the place); never free. The receipt itself still holds 0: read it as unknown. The tool now stores 0 as null and prefers a country location_code; retry in the -b request. |
| dataforseo-g12-atlantis-hotel-prices-b-2026-10-30.json | "Atlantis Paradise Island", location_code 2044 (The Bahamas), same party, Jan 11-15 and Jan 11-12 2027 | 2026-10-30 08:30Z, USD 0.008 for 2 searches | Location right but Google returns one umbrella entity, "Atlantis Paradise Island Bahamas", with no price for either stay; no tower (Coral) row, so matched_count 0. No figure usable. |
| dataforseo-g12-family-hotel-prices-2026-10-30.json | LEGOLAND Hotel / LEGOLAND Castle Hotel (Carlsbad CA) and Great Wolf Lodge Pocono Mountains, location_code 2840, 2 adults + kids 5 and 8, 1-night vs 3-night pairs (Dec 4 2026; Jan 15 2027); Atlantis 2-adult diagnostic Jan 11-15 2027 | 2026-10-30 09:08Z, USD 0.028 for 7 searches | Google titles are "LEGOLAND® Hotel California" and "LEGOLAND® Castle Hotel": the ® broke both LEGOLAND matches (matched_count 0), but the rows are in the receipt. LEGOLAND Castle Hotel: USD 423 and 378 in the two 1-night searches seconds apart (Dec 4-5), USD 383 in both 3-night searches (Dec 4-7). LEGOLAND Hotel California: no price in all four. Great Wolf Lodge Pocono Mountains and Atlantis (2 adults): one row each, no price. |

Per-search cost observed: USD 0.004 (depth 18), far below the USD 0.05 reserve.
Per-night vs per-stay basis: still unknown (no priced rows yet). Total G12 spend so far USD 0.020; ledger 0.3826 of USD 20.
Next: test the pipeline on a property Google prices as its own listing (e.g. a US resort such as Great Wolf Lodge or a LEGOLAND hotel) with the family party, plus one 2-adult Atlantis diagnostic; never publish a 2-adult rate as a family price.
If the retry also returns only 0 prices, next try one 2-adult diagnostic search (never published as a family price).

## Step 2 reading (2026-10-30 09:08Z receipt)
- Per night, not per stay (our reading): across ~10 hotels priced in both a 1-night and a 3-night search with the same check-in, the 3-night figure is about the same as the 1-night one (e.g. Castle Hotel 378-423 vs 383; Motel 6 Carlsbad 90-101 vs 87), never about 3x. Taxes and fees still unknown.
- Volatile: the same hotel, party and dates returned USD 423 and 378 within seconds; publish only as a dated "about" estimate, never a quote.
- Resort-direct properties (LEGOLAND Hotel California, Great Wolf Poconos, Atlantis) show no Google price for this party; Castle Hotel does.
- Next (step 3): strip ®/™ before matching in tools/hotel-price-pull.mjs; then a labelled "about $380 a night before tax for 2 adults + 2 kids (Google Hotels, Dec 4-7 2026, observed Oct 30)" line is a candidate for the LEGOLAND deal page, kept apart from LEGOLAND's own package price (which includes tickets and breakfast).

## Step 3 (2026-10-30 13:07Z run): published estimate
- tools/hotel-price-pull.mjs now strips ®, ™ and © before the title match (future receipts match "LEGOLAND® Castle Hotel").
- The LEGOLAND California deal page glance now carries one labelled line (v2.price_sample, validated): "about $383 a night at the LEGOLAND Castle Hotel for 2 adults and 2 kids aged 5 and 8, December 4 to 7, 2026", from the two 3-night searches (383 both), with the two 1-night Dec 4 readings (378, 423), before tax, inclusions not shown, per-night basis our reading. It links this receipt, is never summed into a trip total or a saving, and drops automatically when the stay starts (Dec 4) or the deal ends (Nov 17).
