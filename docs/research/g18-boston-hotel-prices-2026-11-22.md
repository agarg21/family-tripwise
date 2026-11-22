# G18 Boston family-hotel prices: weekly refresh (2026-11-22)

Owner D39 protocol (docs/plan/hotel-price-samples.md): the same 1-night Google Hotels searches as Nov 5 and Nov 14, re-run via
DataForSEO on 2026-11-22 (requests ops/research-requests/g18-bos-{a,b,c,d,retry}-2026-11-22.json; receipts
docs/research/dataforseo-g18-bos-{a,b,c,d,retry}-2026-11-22.json; 40 searches, USD 0.16). Family of 4 = 2 adults + kids 5 and 8;
family of 5 = 2 adults + kids 4, 8, 12 (normal weekend only). USD per night, unpaid listing under the hotel's exact title; Google
shows no room type, taxes or fees. Estimates, not quotes. Format: Fri , Sat nightly; "-" = no price shown (provider price null or
no exact-title listing; never read as sold out).

| Hotel | Jan 22-23, Nov 14 -> Nov 22 | Dec 25-26, Nov 14 -> Nov 22 | Jan 1-2, Nov 14 -> Nov 22 | Family of 5, Jan 22-23, Nov 14 -> Nov 22 |
|---|---|---|---|---|
| Residence Inn Back Bay/Fenway | 238 , - -> 319 , 279 | 244 , 329 -> - , 329 (Sat from second keyword; Fri no exact-title listing) | 238 , 238 -> 284 , - | - , - -> - , - (also on second keyword) |
| Hilton Boston Park Plaza | 213 , 248 -> 239 , 239 | 248 , 247 -> 248 , 287 | 267 , 267 -> 230 , 230 | 307 , 262 -> - , - |
| Four Seasons Hotel Boston | - , - -> - , - (also on second keyword) | - , - -> - , - | - , - -> - , - | - , - -> - , - |
| The Langham, Boston | 532 , 532 -> 685 , 585 (second keyword Sat 585, same) | 729 , 709 -> 618 , 569 (second keyword Sat 569, same) | 709 , 719 -> 569 , 489 | - , - -> - , - |

Page effects (site/where-to-stay/boston-family-hotels.html): glance band $231-$532 -> $239-$635 a night; Residence Inn now priced on
both weekend nights (≈ $299, $598 for 2), so the "One night priced" list is gone; family of 5 now has no price at any hotel (Park
Plaza ≈ $285 on Nov 14 -> no price shown). Holiday sentence (built from receipts): Christmas costs more than Jan 22-24 at Park Plaza
and less at The Langham; New Year's costs less at both. Residence Inn holiday rows are one night only ($329 Saturday Christmas, $284
Friday New Year). Study page (site/holidays/holiday-hotel-prices-family-of-4.html): Boston Christmas +21% -> +3%, New Year
+25% -> -10% (2 hotels each); overall 30 -> 29 of 48 hotels cost more on Christmas weekend. Room facts (Oct 1-9, 2026) are within 90
days; not re-read. Generator wording fix: later comparison groups read "and less at X" instead of repeating "than Jan 22-24".
