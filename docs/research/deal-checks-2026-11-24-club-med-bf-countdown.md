# Deal-watch flag, 2026-11-24 (QUEUE G09w): Club Med Black Friday countdown

Flag: `changed` on club-med-deals (detected 2026-11-23T14:54Z, updated 2026-11-24T02:19Z). The only added line is a countdown, "Ends in: 7 days, 7 hours, 3 minutes and 15 seconds" (watcher extract, ops/deal-watch/state.json). A flag is a lead.

| Source | Observed | Observed value | Change vs previous |
|---|---|---|---|
| https://clubmed.us/o/black-friday?PAYS= (surfaced by WebSearch on clubmed.us, 2026-11-24) | 2026-11-24 ~05:10Z | Not read: fetch tool reported robots.txt unreachable (same outcome as 11-23 "not granted"); no retry, no other clubmed.us page tried | Unknown |
| https://www.clubmed.us/o/best-all-inclusive-vacation-deals (watcher extract) | 2026-11-24 02:19Z | Countdown "Ends in: 7 days, 7 hours..." (implies about Dec 1 UTC; a script countdown, not a stated date); BF banner "up to 50% Off*" (Caribbean, Mexico, Canada, the Alps and more); "Up to $810 Savings*"; "Cancel/modify free 61+ days prior"; standing offer unchanged (book by Jan 4, 2027, travel by July 2, 2027, kids under 4 free, up to $300 pp/week) | Countdown new; rest as 11-17 |

Decision: no public change. The Black Friday sale has no stated end date, qualifying resorts, prices or footnote text we could read, and a countdown is not a published date (evidence integrity). The club-med-all-inclusive-kids-under-4 card stays unpriced, page only (D22/D26). Flag deleted. Re-try clubmed.us once from Dec 1 (sale should have ended; check whether the standing offer changed). No spend.
