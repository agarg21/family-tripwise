# G18 San Diego family-hotel prices: weekly refresh (2026-11-14)

Owner D39 protocol (docs/plan/hotel-price-samples.md): the same 1-night Google Hotels searches as the Nov 5 set, re-run via
DataForSEO on 2026-11-14 (requests ops/research-requests/g18-sd-{a..j}-2026-11-14.json; receipts
docs/research/dataforseo-g18-sd-{a..j}-2026-11-14.json; 74 searches, USD 0.296, 0 failures). Party 2 adults + kids 5 and 8
(Homewood family of 5: kids 4, 8, 12). USD per night, unpaid listing under the hotel's exact title; Google shows no room type,
taxes or fees. Estimates, not quotes. Format per hotel: Fri , Sat nightly from the hotel's own searches; "-" = no price shown.
The pages also show "also" figures from other searches of the same night (cross-search rule).

| Hotel (prefix) | Jan 22-23, Nov 5 -> Nov 14 | Dec 25-26, Nov 5 -> Nov 14 | Jan 1-2, Nov 5 -> Nov 14 |
|---|---|---|---|
| sd-bahia | 344 , 299 -> 297 , 342 | 282 , 300 -> 247 , 303 | 300 , 300 -> 300 , 300 |
| sd-mission-bay | 419 , 419 -> 488 , 419 | 385 , 385 -> 442 , 442 | 465 , 405 -> 465 , 465 |
| sd-hyatt-mb | 349 , 346 -> 399 , 350 | 304 , 470 -> 405 , 426 | 374 , 344 -> 381 , 372 |
| sd-paradise | 466 , 405 -> 405 , 405 | 383 , 411 -> 383 , 411 | 448 , 383 -> 448 , 383 |
| sd-catamaran | 339 , 339 -> 345 , 345 | 301 , 261 -> 303 , 444 | 282 , 282 -> 300 , 294 |
| sd-homewood | 271 , 272 -> 272 , 274 | 276 , 358 -> 286 , 372 | 302 , 229 -> 289 , 202 |
| sd-legoland-hotel | 352 , 378 -> 423 , 439 | 622 , 589 -> 615 , 716 | 468 , 439 -> 484 , 468 |
| sd-loews | 399 , 389 -> 403 , 399 | 380 , 353 -> - , 375 | 382 , 389 -> 384 , 384 |
| sd-del | 656 , 558 -> 571 , 628 | 928 , 783 -> 928 , 935 | 783 , 746 -> 783 , 746 |
| sd-dana | 292 , 254 -> 254 , 292 | 326 , 304 -> 326 , 349 | 284 , 349 -> 326 , 304 |
| sd-manchester | 481 , 415 -> 481 , 481 | 304 , 304 -> 262 , 304 | 454 , 335 -> 450 , 335 |
| sd-la-jolla-shores | - , - -> - , - | - , - -> - , - | - , - -> - , - |

Homewood family of 5 (Jan 22-23): 293 , 254 -> 293 , 296 (≈ $295 a night, 2 nights ≈ $589).

Changes that alter page text: LEGOLAND Castle Hotel weekend ≈ $365 -> ≈ $431 (now the dearest group floor, listed after
Coronado and La Jolla); Mission Bay Resort ≈ $419 -> ≈ $454; Manchester Grand Hyatt ≈ $448 -> ≈ $481; Paradise Point ≈ $436 -> ≈ $405;
Loews shows no Christmas Friday price (Saturday $375). La Jolla Shores still shows no price on any weekend. Holiday study:
San Diego Christmas −7% (11 hotels, "About the same") -> +10% (10 hotels, now "Pricier"), New Year −2% -> +1% (11).
Study names "New York City, Chicago, San Diego Nov 14". Official hotel facts stay as dated on the page ("Hotel facts checked:
August 17, 2026", 89 days on Nov 14: re-read before the next San Diego re-price, D39 90-day rule); review themes July 18-21
stay labelled with their dates.

## Stay-area page sources re-read 2026-11-14 (D39: its "checked July 20, 2026" line was over 90 days)

| Source | Observed 2026-11-14 | Change vs July 20 use |
|---|---|---|
| bahiahotel.com/faqs | Readable: free parking (1 vehicle/room); resort fee $48/day; check-in 4 PM, out 11 AM; cribs not mentioned | Link only on the stay page; no stay-page text depends on it |
| missionbayresort.com/faq/ | Readable: self parking $47/night; amenities fee $46/night + tax; rollaways $35/night + tax; check-in 4 PM, out 11 AM | Link only on the stay page |
| hilton.com Homewood Downtown/Bayside | Readable: free hot breakfast, outdoor pool, in-room kitchen, valet $65 (no self-park), 0.3 mi Waterfront Park | Link only on the stay page |
| sandiegocounty.gov beach and bay | Readable: links sdbeachinfo.com current advisories/closures | Still the beach-status starting point |
| sandiego.gov Mission Valley planning-studies-reports | Readable: 2019 Community Plan Update (approved Sept 10, 2019), map atlas; links parent plan page | Replaces the parent plan link (parent not fetchable this run) |
| sdmts.com maps-and-schedules | Not read (beta.sdmts.com robots-disallowed; www URL fetch not permitted this run) | Removed; starting-point link now MTS Trolley lines and stations (read Nov 9) |

Hotel-page fee figures above are not published by this release (the hotel page keeps its own dated fee notes).
