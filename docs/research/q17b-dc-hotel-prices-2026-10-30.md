# Q17b: Washington DC suite prices re-observed (2026-10-30 ET)

Source: Google Hotels listing prices via DataForSEO (`docs/research/dataforseo-q17b-dc-hotel-prices-2026-10-30.json`, checked 2026-10-31 01:28 UTC = 2026-10-30 ET). Party 2 adults + kids 4, 8, 12. Not booking quotes; room type not shown; taxes and fees unknown. Used only when exactly one unpaid row matched and the 1-night control was within 10% (so the figure is per night).

| Hotel | Stay | Observed value (USD, per night) | 1-night control | Change vs previous |
|---|---|---|---|---|
| Embassy Suites Washington DC Convention Center | 2027-01-15 to 2027-01-20 (5 nights) | 222 | 222 | Previous: Sept 30 Hilton public-plan samples for Nov 8-13, 2026, withdrawn Oct 30 (not comparable: different source, dates and room basis) |
| Homewood Suites Washington DC Downtown | 2027-01-15 to 2027-01-20 (5 nights) | 212 | 220 | Same as above |
| Pendry Washington DC The Wharf | 2027-01-15 to 2027-01-20 | no price shown | no price shown | Never priced |

Page use: hotel-level "about $X a night" with basis line; drops automatically on 2027-01-15 (tools/this-week.mjs re-renders the page daily).
