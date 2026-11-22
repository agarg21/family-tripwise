# G18 Las Vegas family-hotel prices: weekly refresh (2026-11-22)

Owner D39 protocol (docs/plan/hotel-price-samples.md): the same 1-night Google Hotels searches as the Nov 14 set, re-run via
DataForSEO on 2026-11-22 (requests ops/research-requests/g18-lv-{a..h,retry}-2026-11-22.json; receipts
docs/research/dataforseo-g18-lv-{a..h,retry}-2026-11-22.json; 68 searches, USD 0.272, 0 failures). Family of 4 = 2 adults +
kids 5 and 8. USD per night, unpaid listing under the hotel's exact title, own search (retry keyword where one exists; the page
shows other searches' figures as "also"). Google shows no room type, taxes, resort fees or parking. Estimates, not quotes.
Format: Fri / Sat nightly; "none" = no price shown (provider price null; never read as sold out).

| Hotel | Jan 22 / 23, 2027, Nov 14 -> Nov 22 | Dec 25 / 26, 2026, Nov 14 -> Nov 22 | Jan 1 / 2, 2027, Nov 14 -> Nov 22 |
|---|---|---|---|
| Mandalay Bay | 222 / 457 -> 222 / 457 | 196 / 308 -> 196 / 310 | 394 / 185 -> 362 / 185 |
| Four Seasons Hotel Las Vegas | 3,571 / none -> 3,571 / none | 1,093 / 4,059 -> 3,900 / none | 4,705 / 1,273 -> none / 4,201 |
| Vdara Hotel & Spa | 335 / 615 -> none / 514 (retry 583) | 313 / 378 -> 335 / none | none / 346 -> none / none |
| Marriott's Grand Chateau | none / none -> none / 543 | none / 285 -> 251 / 251 | none / 319 -> 362 / 362 |
| Tahiti Village | none / none -> none / none | none / none -> none / none | none / none -> none / none |
| Hilton Vacation Club Cancun Resort Las Vegas | none / none -> none / none | 165 / 413 -> 132 / none | none / none -> none / none |
| Excalibur Hotel & Casino | 189 / 237 -> 189 / 254 | 138 / 205 -> 138 / 205 | 313 / 162 -> 294 / 143 |
| New York-New York Hotel & Casino | 288 / none -> 288 / none | 224 / 268 -> 224 / 303 | 354 / 201 -> 401 / 201 |
| Las Vegas Hilton at Resorts World | 406 / 534 -> 406 / 581 | 271 / 375 -> 271 / 331 | 713 / 338 -> 1,006 / 298 |
| Red Rock Casino Resort and Spa | 392 / 443 -> 379 / 443 | 416 / 444 -> 443 / 479 | 563 / 321 -> 608 / 341 |

Page effects (site/where-to-stay/las-vegas-family-hotels.html, las-vegas-with-kids.html): glance "From" Excalibur ≈ $213 ->
≈ $222 (2 nights ≈ $443); Strip group Mandalay Bay ≈ $340 unchanged (both-night group up to $475 -> $494, Resorts World);
Vdara now Saturday only ($514; Nov 14 both nights ≈ $475); Grand Chateau Saturday only $543 (Nov 14: none); Red Rock ≈ $418 ->
≈ $411. Unpriced weekend: Tahiti Village, Cancun Resort. Stay page: Near-Strip card now "from $543 a night, Saturday only"
(generator: a one-night "from" figure now names its night on multi-hotel area cards too, as on one-hotel cards).
Study page: Las Vegas Christmas −26% (5 hotels) -> −24% (4; Vdara left out: its Jan 22 and Dec 26 nights showed no price), New Year
+9% -> +7% (4 hotels, 2 cost more); overall 28 of 46. Resorts World New Year Fri $1,006 vs Sat $298 is a large gap (shown as
two separate cells on the hotel page, with its "a big jump between nights may be a different room" note; not excluded, as on
Nov 14 for the $713 / $338 pair). Official hotel facts (read Nov 5, 2026; MGM and Hilton room lines July 22, labelled older)
are not re-read in this run.
