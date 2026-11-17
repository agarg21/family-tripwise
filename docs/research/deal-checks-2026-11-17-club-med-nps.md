# Deal-watch flags, 2026-11-17 (QUEUE G09w): Club Med Black Friday banner, NPS pass wording

Both flags were handled from the watcher's own extract of the official page (ops/deal-watch/state.json, 2026-11-17T14:38Z). Club Med was last read by the operator on 2026-11-11 (~16:10Z), under 7 days ago, so the page was not fetched again this run (QUEUE G09w, sources rule). A flag is a lead.

| Source | Observed | Observed value (watcher extract) | Change vs previous |
|---|---|---|---|
| https://www.clubmed.us/o/best-all-inclusive-vacation-deals | 2026-11-17 14:38Z | New banner: "Black Friday's Biggest Savings Start Now"; "Caribbean, Mexico, Canada, the Alps and more destinations with up to 50% Off*" | New vs Nov 11 read |
| same page, existing offer | 2026-11-17 14:38Z | "Save up to 40%*" (Caribbean, Canada, Mexico); "Up to $300 Instant Savings pp/week**"; "Up to $300 in Instant Air Credit**"; "Kids under 4 stay FREE**"; "Book by January 4 , 2027 \| Travel by July 2, 2027" | Unchanged |
| same page, Black Friday terms | 2026-11-17 | No Black Friday book-by date, travel dates, qualifying resorts, prices or footnote text in the extract | Unknown |
| https://www.nps.gov/planyourvisit/fee-free-parks.htm | 2026-11-17 14:38Z | "current Senior Lifetime Pass" now reads "current Senior Lifetime/Access Pass" (pass-exchange sentence) | Wording only; no fee-free date change |

Decisions:
- Club Med: no public change. The Black Friday banner has no dates, terms or prices, and "up to 50%" covers destinations outside our card (the Alps). The club-med-all-inclusive-kids-under-4 card stays as is (unpriced, page only per D21/D22; not promoted). Re-read the offer page once from Nov 18 (7 days after the Nov 11 read) for the Black Friday book-by date, which resorts qualify and any footnote text; then decide whether the card gets a Black Friday row or `black_friday_offer`.
- NPS: no site content uses this sentence (no NPS fee-free card in tools/page-generation); senior/access pass exchange is not a family-trip item. No change.
- Both flags deleted. No spend, no fetch.
