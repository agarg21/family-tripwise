# SeaWorld Orlando Fun Card flag (deal-watch, 2026-11-12)

Flag: seaworld-orlando-fun-card `changed`, detected 2026-11-12T20:55Z, 0 lines added, 0 removed, headline unchanged.

| Source | Observed 2026-11-12 (watcher state only, no operator fetch) | Change vs previous watcher read |
|---|---|---|
| https://seaworld.com/orlando/tickets/fun-card/ | Same 60 signal lines as before; "Save Up to 40%" moved two places up (above "Black Friday Presale: Save Up to 40%") | Order only. Same line hashes as a set; no wording, price or date change |

Decision: no change to the offer, so nothing public to correct and no fetch (the Fun Card page was read Nov 6; re-read allowed from Nov 13 as already scheduled). Flag deleted. The watcher now stores an order-free `set_hash` and raises no flag when only the order of the same lines moves (tools/deal-watch.mjs; first read after this change just records the new field).
