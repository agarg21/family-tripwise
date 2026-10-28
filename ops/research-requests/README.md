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
