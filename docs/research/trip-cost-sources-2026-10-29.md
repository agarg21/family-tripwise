# Trip-cost data sources (QUEUE G12, researched 2026-10-29 in the owner session)

Goal (owner, 2026-10-29): every deal page says what the trip normally costs a family of 4 for 3–4 days from a US gateway (default NYC) and what it costs with the deal. Constraint (AGENTS.md): only observed, dated prices; no automating booking engines; no invented totals.

## What a total needs
| Trip type | Components | Source that fits |
|---|---|---|
| Resort / hotel / water-park lodge (Beaches, Great Wolf, Atlantis, LEGOLAND hotel) | flights for 4 + room for named dates and ages | flights API + hotel price API (named dates, 2 adults + child ages) |
| Theme park (Disney, Universal, SeaWorld) | flights + hotel + tickets | APIs above + the park's published ticket prices (official pages) |
| Cruise (Royal Caribbean, NCL, MSC, Margaritaville) | cruise fare for 4 + flights to the port (or none from NYC ports) | cruise line's published fares on official pages; flights API when the port is not NYC |

## Options checked
| Source | What it gives | Cost | Fit |
|---|---|---|---|
| SerpApi Google Flights (`engine=google_flights`) | named dates, `adults`/`children`/`infants`, USD; `price_insights` with lowest price, typical range and price history | Free 250 searches/mo; Starter $25/mo for 1,000; Developer $75/mo for 5,000 | Best flight source. Typical-range data also answers "is this a good time to book?" |
| DataForSEO Google Hotels (`business_data/google/hotel_searches`) | named check-in/out, adults + `children` ages (up to 4 people), `price`, `price_without_discount`, `discount_text` ("23% less than usual") | Pay per task, billed per 18 results; existing account and GitHub secret (OWNER D8) | Best hotel source: we already have the account and secret-safe workflow; "price without discount" helps the savings line |
| SerpApi Google Hotels | same Google Hotels data | shares the SerpApi quota | Fallback if DataForSEO results are thin |
| DataForSEO Google Flights | only the "from €47" SERP feature, no passengers/dates | — | Not usable for family fares |
| Amadeus Self-Service | flight offers | Self-service portal being shut down (keys disabled July 17) | Out |
| Duffel | flight offers for booking | $3 per order; searches charged above a 1500:1 search-to-book ratio | Built for booking, not price research; out |
| Travelpayouts / Aviasales Data API | cached fares from users' searches (2–7 days old) | free with a Travelpayouts partner account (affiliate) | Possible cheap "typical fare" signal later, and a monetization path; not named-date quotes |
| Booking engines (resort/airline sites) | exact quotes | — | Not allowed to automate (robots, forms) |

## Recommendation
1. Flights: SerpApi Google Flights. The owner signs up with hello@familytripwise.com on the free plan (250 searches/mo) and adds `SERPAPI_API_KEY` as a GitHub secret. Upgrade to $25/mo only if 250 runs out (needs an Approved row).
2. Hotels: DataForSEO Google Hotels through the existing request-file workflow (`ops/research-requests/`), within the existing USD 20 cap (needs D8 widened from SEO research to price checks).
3. Cruises and park tickets: the operator keeps reading official published fares.
4. A GitHub workflow runs the price requests with the secrets (the operator never sees keys) and commits dated receipts; deal pages build the "about $X normally, about $Y with the deal" line from those receipts, labelled "estimate", with party (2 adults + 2 kids, ages), dates, gateway (NYC) and observation date.

## Unknowns to check when building
- Whether SerpApi's Google Flights `price` is the total for all passengers or per person (docs at serpapi.com/google-flights-api).
- Whether DataForSEO's hotel `price` is per night or for the stay, and its per-task USD cost.
- Child ages: Google Hotels takes ages; Google Flights takes counts (children 2–11, infants).

Sources: serpapi.com/pricing.md; serpapi.com/blog/how-to-scrape-google-flights.md; dataforseo.com/help-center/how-to-collect-prices-from-google-hotel-search; dataforseo.com/serp-feature/google-flights; phocuswire.com (Amadeus self-service shutdown); apis.io (Duffel pricing, unverified profile); support.travelpayouts.com (Data API access). All read 2026-10-29.
