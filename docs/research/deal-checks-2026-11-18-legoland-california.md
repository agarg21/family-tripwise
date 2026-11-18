# Deal-watch flag, 2026-11-18 (QUEUE G09w): LEGOLAND California Hotel + Ticket Package page

Flag: watcher extract of the package page, 2026-11-18T14:14Z. The package page was last read by the operator on 2026-11-05 (>7 days), so one read was due. A flag is a lead.

| Source | Observed | Observed value | Change vs previous |
|---|---|---|---|
| https://www.legoland.com/california/places-to-stay/vacation-packages/hotel-plus-ticket-package/ | 2026-11-18 (watcher extract only) | "Black Friday Package"; "Black Friday Passholder Hotel Rates"; "Save up to 50% on Tickets, Passes & Hotel!"; "kid-themed hotels starting at just $144 per person, pe…" (truncated) | "Book Early & Save Package", "Kids Tickets from $39 per day", "Book by November 17, 2026 and stay through January 9, 2027" removed |
| same URL, operator fetch | 2026-11-18 ~15:10Z | Not read: the fetch permission request was withdrawn (no answer in an unattended run). Not a site denial; may be tried once on a later run | n/a |
| https://california-support.legoland.com/hc/en-us/articles/4411345618193 (Black Friday FAQ) | 2026-11-18 ~15:10Z | Not read: site returned a client error. Do not retry unchanged | n/a |
| https://www.legoland.com/california/deals/ | 2026-11-18 ~15:10Z | "Save up to 50% on Hotel + Ticket Packages", "Starting From $128 Per Person/Night", "Offer ends November 29, 2026". Party, child ages, tax, stay dates, inclusions, fees and refund terms not stated. Also listed (not labelled Black Friday): "The Ultimate Holiday Sleepover!" from $144 per person/night; "Build Your Own Vacation" from $99 per person/night. No "$39", "Kids Tickets" or "November 17" text remains | New vs Nov 5 package read |

Decisions:
- The old check legoland-california-hotel-kids-tickets-39 already ended (expires_on 2026-11-17); the live page shows "ended November 17, 2026" and it is off /deals/. No change needed.
- No new deal check yet: the Black Friday package's party basis, tax, stay dates, inclusions and fees are not observed (only the deals-page tile), so no spend-vs-save card can be built (D21/D22) and the terms would be guesses. Next: read the package page once (from Nov 19) for the "$128/$144 per person per night" basis (earlier pricing was for 2 adults + 2 children 2-12, 1 night, before tax), stay window and terms; then add a check with a card only if a "without" figure exists (Castle Hotel sample $383, Nov 5, is older than a week: re-observe). Offer ends Nov 29.
- Flag deleted. No spend.
