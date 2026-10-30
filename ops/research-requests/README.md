# DataForSEO research requests

Commit one JSON file here per paid research batch, named `<topic>-YYYY-MM-DD.json`:

```json
{ "action": "Q15", "purpose": "Which existing destination's itinerary query has the most US demand",
  "keywords": ["orlando itinerary with kids", "washington dc itinerary with kids"],
  "serp_keywords": ["orlando itinerary with kids"] }
```

- Up to 200 `keywords` (keyword overview: volume, difficulty, CPC) and up to 12 `serp_keywords` (top-10 Google US organic results; must also be in `keywords`).
- On push to `main`, the "DataForSEO research" workflow runs the batch with the `DATAFORSEO_AUTH_B64` repository secret and commits the receipt to `docs/research/dataforseo-<same file name>`. A request whose receipt already exists is never re-run.
- Budget comes from code and the receipt ledger, not the request: at most USD 0.50 per batch and USD 20 cumulative across all receipts in `docs/research/` (runs only while `ops/OWNER.md` has an Approved D8 row). Raising either needs a new owner decision.
- Results are provider estimates for the US market, not traffic or rankings for this site. Receipts keep metrics, result types and URLs, never raw third-party text.

## Hotel price requests (QUEUE G12, OWNER D20)

A request with `hotel_searches` instead of `keywords` runs `tools/hotel-price-pull.mjs` (DataForSEO Google Hotels, `business_data/google/hotel_searches/live`) under the same ledger and ceilings:

```json
{ "action": "G12", "purpose": "Atlantis trip cost for a family of 4",
  "hotel_searches": [ { "label": "atlantis-coral-4n", "keyword": "Atlantis The Coral", "location_coordinate": "25.0849,-77.3226",
    "check_in": "2027-01-11", "check_out": "2027-01-15", "adults": 2, "children": [5, 8], "match": "Coral" } ] }
```

- Up to 8 searches per file, each reserved at USD 0.05; future check-in, 1–30 nights, at most 4 adults and 4 children (ages 0–17); `match` picks the hotel from the results by title. Give exactly one of `location_code` (Google geo code, e.g. 2044 for The Bahamas; preferred) or `location_coordinate` (a Paradise Island coordinate returned Eleuthera listings on 2026-10-30). A provider price of 0 is stored as null (our reading: no price shown; the docs do not say). Older receipts may still hold 0: read it as unknown.
- The receipt keeps, per search, the party, dates, observation time and each listed hotel's price fields. The provider does not say whether `price` is per night or per stay, or which taxes and fees it includes: pair a 1-night search with a multi-night one before using a figure, and label anything published from it "estimate" with party, dates and observation date.
