# Q18 Google Hotels family prices, Las Vegas and Chicago (2026-11-01)

OWNER D25: drop the past-stay July samples and show fresh future-date family prices. DataForSEO Google Hotels
(`business_data/google/hotel_searches/live`, D20 budget), party 2 adults + kids 5 and 8, one night each.
Las Vegas: Tue Jan 19, Feb 2 and Feb 23, 2027 (more dates because the Jan 19 figures looked high for a January weeknight
and single dates swing). Chicago: Tue Jan 19, 2027. Searches ran 2026-11-01 03:06-03:16 UTC (Oct 31 Eastern).

Rule (tools/page-generation/google-hotel-samples.mjs `googleOneNight`): a figure is used only when exactly one unpaid
USD row carries the hotel's exact title. Google does not show room type, room count or tax/fee inclusion: listing
prices, labelled estimates, never quotes. Each sample leaves the page 7 days before arrival.

Change vs previous: the pages showed July 22 (LV) / July 23 (Chicago) 2026 one-night samples, mostly two adults, for
stays in July-August 2026 (passed). Those are no longer displayed (kept as historical evidence in the records).

Not usable: Tahiti Village Jan 19/Feb 2 (no price; a separate "Tahiti Resort" row not used); Cancun Resort Jan 19/Feb 2
(no matching listing); Mandalay Bay Feb 2, Resorts World Hilton Feb 2, Red Rock Jan 19 (no price).

| Search | Check-in | Checked (UTC) | Matched rows | Receipt |
|---|---|---|---|---|
| lv-mandalay-bay-1n | 2027-01-19 | 2026-11-01 03:06Z | Mandalay Bay: $597 | dataforseo-q18-lv-chicago-hotel-prices-a-2026-11-01.json |
| lv-four-seasons-1n | 2027-01-19 | 2026-11-01 03:06Z | Four Seasons Hotel Las Vegas: $1467 | dataforseo-q18-lv-chicago-hotel-prices-a-2026-11-01.json |
| lv-vdara-1n | 2027-01-19 | 2026-11-01 03:06Z | Vdara Hotel & Spa: $658 | dataforseo-q18-lv-chicago-hotel-prices-a-2026-11-01.json |
| lv-grand-chateau-1n | 2027-01-19 | 2026-11-01 03:06Z | Marriott's Grand Chateau: $793 | dataforseo-q18-lv-chicago-hotel-prices-a-2026-11-01.json |
| lv-tahiti-village-1n | 2027-01-19 | 2026-11-01 03:06Z | Tahiti Village: no price; Tahiti Resort: $330 | dataforseo-q18-lv-chicago-hotel-prices-a-2026-11-01.json |
| lv-cancun-resort-1n | 2027-01-19 | 2026-11-01 03:06Z | no matching listing | dataforseo-q18-lv-chicago-hotel-prices-a-2026-11-01.json |
| lv-excalibur-1n | 2027-01-19 | 2026-11-01 03:06Z | Excalibur Hotel & Casino: $283 | dataforseo-q18-lv-chicago-hotel-prices-a-2026-11-01.json |
| lv-new-york-new-york-1n | 2027-01-19 | 2026-11-01 03:06Z | New York-New York Hotel & Casino: $421 | dataforseo-q18-lv-chicago-hotel-prices-a-2026-11-01.json |
| lv-resorts-world-hilton-1n | 2027-01-19 | 2026-11-01 03:06Z | Las Vegas Hilton at Resorts World: $776 | dataforseo-q18-lv-chicago-hotel-prices-b-2026-11-01.json |
| lv-red-rock-1n | 2027-01-19 | 2026-11-01 03:07Z | Red Rock Casino Resort and Spa: no price; Red ROCKS: no price | dataforseo-q18-lv-chicago-hotel-prices-b-2026-11-01.json |
| chi-embassy-suites-1n | 2027-01-19 | 2026-11-01 03:07Z | Embassy Suites by Hilton Chicago Downtown Magnificent Mile: $247 | dataforseo-q18-lv-chicago-hotel-prices-b-2026-11-01.json |
| chi-homewood-1n | 2027-01-19 | 2026-11-01 03:07Z | Homewood Suites by Hilton Chicago-Downtown: $191 | dataforseo-q18-lv-chicago-hotel-prices-b-2026-11-01.json |
| chi-residence-inn-1n | 2027-01-19 | 2026-11-01 03:07Z | Residence Inn by Marriott Chicago Downtown/River North: $202 | dataforseo-q18-lv-chicago-hotel-prices-b-2026-11-01.json |
| chi-sable-1n | 2027-01-19 | 2026-11-01 03:07Z | Sable at Navy Pier Chicago, Curio Collection by Hilton: $184 | dataforseo-q18-lv-chicago-hotel-prices-b-2026-11-01.json |
| chi-swissotel-1n | 2027-01-19 | 2026-11-01 03:07Z | Swissotel Chicago: $347 | dataforseo-q18-lv-chicago-hotel-prices-b-2026-11-01.json |
| chi-intercontinental-1n | 2027-01-19 | 2026-11-01 03:07Z | InterContinental Chicago Magnificent Mile by IHG: $324 | dataforseo-q18-lv-chicago-hotel-prices-b-2026-11-01.json |
| chi-hilton-1n | 2027-01-19 | 2026-11-01 03:07Z | Hilton Chicago: $194 | dataforseo-q18-lv-chicago-hotel-prices-c-2026-11-01.json |
| chi-zachary-1n | 2027-01-19 | 2026-11-01 03:07Z | Hotel Zachary, Chicago, a Tribute Portfolio Hotel: $232 | dataforseo-q18-lv-chicago-hotel-prices-c-2026-11-01.json |
| chi-four-seasons-1n | 2027-01-19 | 2026-11-01 03:07Z | Four Seasons Hotel Chicago: $1165 | dataforseo-q18-lv-chicago-hotel-prices-c-2026-11-01.json |
| chi-langham-1n | 2027-01-19 | 2026-11-01 03:07Z | The Langham, Chicago: $558 | dataforseo-q18-lv-chicago-hotel-prices-c-2026-11-01.json |
| lv-mandalay-bay-feb02-1n | 2027-02-02 | 2026-11-01 03:10Z | Mandalay Bay: no price | dataforseo-q18-lv-hotel-prices-d-2026-11-01.json |
| lv-four-seasons-feb02-1n | 2027-02-02 | 2026-11-01 03:10Z | Four Seasons Hotel Las Vegas: $3254 | dataforseo-q18-lv-hotel-prices-d-2026-11-01.json |
| lv-vdara-feb02-1n | 2027-02-02 | 2026-11-01 03:10Z | Vdara Hotel & Spa: $657 | dataforseo-q18-lv-hotel-prices-d-2026-11-01.json |
| lv-grand-chateau-feb02-1n | 2027-02-02 | 2026-11-01 03:10Z | Marriott's Grand Chateau: $271 | dataforseo-q18-lv-hotel-prices-d-2026-11-01.json |
| lv-tahiti-village-feb02-1n | 2027-02-02 | 2026-11-01 03:10Z | Tahiti Village: no price; Tahiti Resort: $317 | dataforseo-q18-lv-hotel-prices-d-2026-11-01.json |
| lv-cancun-resort-feb02-1n | 2027-02-02 | 2026-11-01 03:10Z | no matching listing | dataforseo-q18-lv-hotel-prices-d-2026-11-01.json |
| lv-excalibur-feb02-1n | 2027-02-02 | 2026-11-01 03:10Z | Excalibur Hotel & Casino: $180 | dataforseo-q18-lv-hotel-prices-d-2026-11-01.json |
| lv-new-york-new-york-feb02-1n | 2027-02-02 | 2026-11-01 03:10Z | New York-New York Hotel & Casino: $381 | dataforseo-q18-lv-hotel-prices-d-2026-11-01.json |
| lv-resorts-world-hilton-feb02-1n | 2027-02-02 | 2026-11-01 03:10Z | Las Vegas Hilton at Resorts World: no price | dataforseo-q18-lv-hotel-prices-e-2026-11-01.json |
| lv-red-rock-feb02-1n | 2027-02-02 | 2026-11-01 03:10Z | Red Rock Casino Resort and Spa: $951; Red ROCKS: no price | dataforseo-q18-lv-hotel-prices-e-2026-11-01.json |
| lv-mandalay-bay-feb23-1n | 2027-02-23 | 2026-11-01 03:10Z | Mandalay Bay: $345 | dataforseo-q18-lv-hotel-prices-e-2026-11-01.json |
| lv-four-seasons-feb23-1n | 2027-02-23 | 2026-11-01 03:10Z | Four Seasons Hotel Las Vegas: $1182 | dataforseo-q18-lv-hotel-prices-e-2026-11-01.json |
| lv-vdara-feb23-1n | 2027-02-23 | 2026-11-01 03:10Z | Vdara Hotel & Spa: $350 | dataforseo-q18-lv-hotel-prices-e-2026-11-01.json |
| lv-grand-chateau-feb23-1n | 2027-02-23 | 2026-11-01 03:11Z | Marriott's Grand Chateau: $203 | dataforseo-q18-lv-hotel-prices-e-2026-11-01.json |
| lv-tahiti-village-feb23-1n | 2027-02-23 | 2026-11-01 03:11Z | Tahiti Village: $152; Tahiti Resort: $299 | dataforseo-q18-lv-hotel-prices-e-2026-11-01.json |
| lv-cancun-resort-feb23-1n | 2027-02-23 | 2026-11-01 03:11Z | Hilton Vacation Club Cancun Resort Las Vegas: $218 | dataforseo-q18-lv-hotel-prices-e-2026-11-01.json |
| lv-excalibur-feb23-1n | 2027-02-23 | 2026-11-01 03:11Z | Excalibur Hotel & Casino: $138 | dataforseo-q18-lv-hotel-prices-f-2026-11-01.json |
| lv-new-york-new-york-feb23-1n | 2027-02-23 | 2026-11-01 03:11Z | New York-New York Hotel & Casino: $156 | dataforseo-q18-lv-hotel-prices-f-2026-11-01.json |
| lv-resorts-world-hilton-feb23-1n | 2027-02-23 | 2026-11-01 03:11Z | Las Vegas Hilton at Resorts World: $342 | dataforseo-q18-lv-hotel-prices-f-2026-11-01.json |
| lv-red-rock-feb23-1n | 2027-02-23 | 2026-11-01 03:11Z | Red Rock Casino Resort and Spa: $493; Red ROCKS: no price | dataforseo-q18-lv-hotel-prices-f-2026-11-01.json |
