# Q19 Google Hotels family prices, San Antonio, San Diego, New York City (2026-11-02)

OWNER D26 (O16, D25 rule): drop past-stay July samples. DataForSEO Google Hotels (`business_data/google/hotel_searches/live`, D20 budget), 2 adults + kids 5 and 8, one night. Same rule as Q18 (`googleOneNight`): exact title, one unpaid USD row. Listing prices, estimates, not quotes; room type, room count and taxes/fees not shown. Each sample leaves the page 7 days before arrival. Searches ran 2026-11-02 05:06-05:09 UTC (Nov 2 Eastern, just after midnight). Total cost USD 0.192.

Change vs previous: July 26 samples (mostly two adults; stay dates unrecorded) no longer shown; kept as historical evidence in the records.

## San Antonio (live on the page)
| Hotel | Jan 19, 2027 | Feb 23, 2027 | July 26 sample (previous) |
|---|---|---|---|
| Hyatt Regency Hill Country | $693 | $693 | $437 |
| JW Marriott Hill Country | no matching listing | no matching listing | $505 |
| La Cantera (Signia) | $586 | $493 | $315 |
| Wild Oak Ranch | $164 | $192 | $249 before taxes |
| Embassy Suites Riverwalk | $302 | $252 | $165 |
| Homewood Riverwalk | $218 | $209 | $156 |
| Home2 Riverwalk | $197 | $183 | $143 |
| Drury Plaza Riverwalk | $203 | $273 | $151 |
| Hotel Contessa | $320 | $356 | $192 |
| Hyatt Regency Riverwalk | $383 | $367 | $202 |
| Marriott Rivercenter | no price | $654 | $281 |
| Omni La Mansion del Rio | conflict, not shown: $254 own search, $307 in the Hill Country search | conflict, not shown: $275 / $333 | $188-$191 |

Receipts: dataforseo-q19-sa-hotel-prices-{a,b,c}-2026-11-02.json.

## San Diego (live on the page, all exact-title prices across the city's Jan 19 searches)
A hotel often showed different prices for the same night and party in searches minutes apart (usually about 15%; reason unknown, taxes shown is a guess, not a fact). The page shows the range and every figure, a stricter reading than one figure per hotel.
| Hotel | Prices seen, Jan 19, 2027 | July sample (previous, no longer shown) |
|---|---|---|
| Bahia | $303, $339, $342 | $339 |
| San Diego Mission Bay Resort | $425, $488 (none in its own search) | $374 |
| Hyatt Regency Mission Bay | $340, $391 | $351 |
| Paradise Point | $485, $558 | $349 |
| Catamaran | $398, $445, $518 | $396 |
| Homewood Downtown/Bayside | $229 | $265 |
| LEGOLAND Castle Hotel (LEGOLAND Hotel: no price) | $338 | none |
| Loews Coronado Bay | none | $360 |
| La Jolla Shores | none | $406 |
| Hotel del Coronado | $629 | $619 |
| The Dana | $259, $298 | $326 |
| Manchester Grand Hyatt | $552 | $329 |

## New York City (receipts in; page not changed yet) and San Diego own-search figures

Jan 19, 2027 only. Receipts: dataforseo-q19-sd-nyc-hotel-prices-{a,b,c}-2026-11-02.json.
SD: Bahia $303; Mission Bay no price; Hyatt Mission Bay $340; Paradise Point $558; Catamaran $445; Homewood Downtown/Bayside $229; LEGOLAND Hotel no price, Castle $338; Loews no price; La Jolla Shores no price; del Coronado $629; The Dana $259; Manchester $552.
NYC: Beacon no price; Homewood Midtown $247; Residence Inn Central Park $404; Radio City Apartments $231; Embassy Suites no price; TRYP no listing; Kimberly no price; Marquis $360; Conrad $473; Palace $577; 1 Hotel $733; Four Seasons Downtown $2,060.

Omni: the receipt title is accented ("Omni La Mansión del Rio"), so the substring match missed it. Its same-date prices differ between two searches, so the page shows no figure and says why.
