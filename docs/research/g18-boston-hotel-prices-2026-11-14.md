# G18 Boston family-hotel prices: weekly refresh (2026-11-14)

Owner D39 protocol (docs/plan/hotel-price-samples.md): the same 1-night Google Hotels searches as the Nov 5 set, re-run via
DataForSEO on 2026-11-14 (requests ops/research-requests/g18-bos-{a,b,c,d,retry}-2026-11-14.json; receipts
docs/research/dataforseo-g18-bos-{a,b,c,d,retry}-2026-11-14.json; 40 searches, USD 0.16, all calls status 20000). Family of 4 =
2 adults + kids 5 and 8; family of 5 = 2 adults + kids 4, 8, 12 (normal weekend only). USD per night, unpaid listing under the
hotel's exact title; Google shows no room type, taxes or fees. Estimates, not quotes. Format: Fri , Sat nightly; "-" = no price
shown (provider price null; never read as sold out).

| Hotel | Jan 22-23, Nov 5 -> Nov 14 | Dec 25-26, Nov 5 -> Nov 14 | Jan 1-2, Nov 5 -> Nov 14 | Family of 5, Jan 22-23, Nov 5 -> Nov 14 |
|---|---|---|---|---|
| Residence Inn Back Bay/Fenway | 238 , - -> 238 , - | 284 , - -> 244 , 329 (second keyword also 329) | 204 , 238 -> 238 , 238 | - , - -> - , - |
| Hilton Boston Park Plaza | 248 , 248 -> 213 , 248 | 248 , 248 -> 248 , 247 | 267 , 230 -> 267 , 267 | 307 , 262 -> 307 , 262 |
| Four Seasons Hotel Boston | 1685 , - -> - , - | - , - -> - , - | - , - -> - , - | - , - -> - , - |
| The Langham, Boston | 629 , 620 -> 532 , 532 (second keyword Sat 620, kept as `also`) | 626 , - -> 729 , 709 (second keyword Sat 609, kept as `also`, not shown on the page) | 718 , 718 -> 709 , 719 | - , - -> - , - |

Page effects (site/where-to-stay/boston-family-hotels.html): glance band $248-$625 -> $231-$532 a night; Four Seasons now has no
price for any night searched (moved from "One night priced" to a new "No price shown for either night" list); Residence Inn and
The Langham priced both Christmas nights; holiday comparison sentence now built from the receipts (Nov 14: Christmas and New
Year's both cost more than Jan 22-24 at Park Plaza and The Langham). Study page (site/holidays/holiday-hotel-prices-family-of-4.html):
Boston Christmas 0% (1 hotel) -> +21% (2 hotels), New Year +8% -> +25% (2 hotels). Nov 5 receipts stay in docs/research. Room
facts (Oct 1-9, 2026) are within 90 days; not re-read.
