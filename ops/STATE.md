# STATE (operator working state; keep ≤8 KB; overwrite, don't append)

authority: owner-directed cloud scheduled task; hourly from 2026-10-27 10:00 until 2026-12-08 10:00 ET (owner 2026-10-29: hourly through the Black Friday deal window), then every 4 hours; ends 2027-01-15 17:00 America/New_York (extended by owner 2026-10-28)
caps: 1 transaction per run; daily_cap=none (owner 2026-10-27: no daily limit; the run cadence and the 90-minute lock are the only throttle)
today: 2026-11-01 transactions=16
run: {id: 2026-11-01T23:04:35Z, started_at: 2026-11-01T23:04:35Z}
last_public_release: d9edfac0 D23 3j Chicago with teens table: design-system table, Cost 2nd column, official Nov 1 prices, family-of-4 estimate in hero and table note (2026-11-01 ~22:50Z; release.json verified; page and styles.css live byte-identical)
active: none (held for owner: q/G09w-margaritaville 01afbf6d Margaritaville listed until Nov 1 (ENDS TONIGHT banner), O19, moot after Nov 3; q/G11-atlantis 056492ce Atlantis card, O17; q/D23-cancun ad5d8ffb Cancun price card + past-stay/expired-offer removal, O18: integrity PASS_WITH_P3, design 4.0 PASS, persona 4/4/4 clarity, avg 3.8; release same day once O18=yes, after re-running tests (PASSED_AS_OF guard fails from Nov 9))

## Holds (one line each: what, unblock condition)
- Deal watch (G09, 8daaacb): .github/workflows/deal-watch.yml commits ops/deal-watch/state.json and flags.json to main when an official deal page changes (hourly at :23); always fetch and merge before releasing; pending flags are G09w work.
- Cadence: trig_016a6JJcR9FqbUGzGbmr9ZXi switches to 4h on 2026-12-08.
- /deals/ checks end Oct 31 (Beaches), Nov 1 (Great Wolf; year is our reading), Nov 2 (Royal Caribbean; NCL Free 2nd Guest, whose 3rd/4th-guest part has no stated end; MSC, whose terms say Nov 5), Nov 3 (Margaritaville at Sea), Nov 17 (LEGOLAND California hotel package), Nov 6 (Sesame Place Philadelphia pass: no end date stated, listed one week; re-read the pass page from Nov 6 to extend; LEGOLAND New York 2027 pass, same, listed to Nov 6), Nov 22 (Atlantis Fall Into Paradise; year is our reading), Dec 31 (SeaWorld Fun Card; no purchase deadline stated, re-observe weekly from Nov 4; Busch Gardens Tampa Bay Fun Card, same, re-observe from Nov 6; SeaWorld San Diego Fun Card, same, $99.99 may be an October price, re-observe from Nov 8), Nov 8 (SeaWorld San Antonio 2027 Season Pass and Sesame Place San Diego 2027 Silver Pass: no end date, listed one week; re-read their pages from Nov 8 to extend), Jan 6 (Club Med); tools/this-week.mjs re-renders deal pages daily too, and the committed deal pages must match today's render or tests fail.
- /this-week/ items expire daily: the deploy workflow (daily 05:17 UTC) refreshes the live copy, but the committed site/this-week/index.html must be re-rendered (`node tools/this-week.mjs`, commit) on the first run each Eastern day or `node --test` fails the committed-page test. Next item expiry: Nov 4 (DC lottery).
- Social posting (G04/G08 Zernio): ZERNIO_API_KEY live; only Facebook connected (others logged `not_connected`); posts Threads, Facebook, Instagram, Pinterest (Pinterest needs PINTEREST_TOKEN + PINTEREST_BOARD_ID). Receipts land in ops/social-receipts/ on main: fetch and merge before releasing. A failed or stuck "attempting" receipt is never retried; report it to the owner.
- Social queues: ops/social-queue/2026-10-29.json through 2026-11-07.json are committed (Nov 6/7: one deal each, all event repeats skipped with stored reasons; SeaWorld San Antonio not queued yet, listed to Nov 8 so needs its pass page re-read from Nov 8); nothing posts until the owner's secrets exist (T3). While a queue date is today or later, tools/social-queue.test.mjs fails if its records change: regenerate the queue (and cards) in the same commit; regeneration keeps stored skips. Queue Nov 8+ in G05; Oct 28 event records pass the 14-day observation limit after Nov 11: re-observe them first. To change only post text in existing queues, refresh entry texts in place (regenerating an older date with today's records reselects entries) (`node tools/social-queue.mjs <date> [--skip <id> "<reason>"]`); decide repeats deliberately; never filler.
- Growth-first (D10–D12): G items before old Q items, except live-site defects and Q17b. D22: only real deals (card saves ≥5%) are queued, posted or promoted; regenerate queues when a card changes.
- Orlando admission tariffs observed 2026-10-27; re-observe by 2026-11-10 (the form flags them as older for later visit dates).
- GSC: sitemap resubmitted and indexing requested for the 5 unknown URLs on 2026-10-27 (OWNER.md T1). Check their coverage in the next GSC snapshots; no repeat requests.
- Sitemap lastmod of 21 pages unchanged since 10-15 is an estimate; observed once each page changes.
- DC itinerary official facts observed 2026-10-27 (14-day maintenance clock in tools/site-maintenance.mjs); re-observe before showing them as current after Nov 10. New URL not yet known to Google; no indexing request without an Approved OWNER.md row.
- Boston itinerary official facts observed 2026-10-27 (14-day clock in tools/site-maintenance.mjs); Aquarium prices and MBTA adult fares unknown (ticket site JS-only; mbta.com robots.txt blocks AI agents, do not fetch). New URL not yet known to Google; no indexing request without an Approved OWNER.md row.
- Remote q/* branches remain (deletion refused); harmless.
- Owner's Mac stale since 10-27 (branch owner-local-2026-10-27); cloud clones only.
- SD, NYC, Orlando, Boston and London Google listings (live since 0bb7a64f / 1af5ebd7 / 19cc3b6f / 42e7a8d8) leave their pages 2027-01-08: the *-google-sample/-listing tests (and PV example-stay test) fail from that date until `node tools/generate-pages.mjs` is run and committed.

## Scoreboard (refresh on Mondays from the newest ops/gsc-snapshots/*.md and live checks)
| Metric | Baseline 2026-10-27 | Target 2026-11-13 |
|---|---|---|
| 28-day organic clicks / impressions | 8 / 3,202 (finalized Sep 27–Oct 24) | report; ≥15 clicks good |
| Sitemap URLs indexed | 31/36 (37 in sitemap from Oct 27); sitemap last read 2026-07-27 | 36/36 or a reason per URL |
| Live pages with past-due dates or past-stay price samples | 7 (8 from Oct 28); 0 since c21010c (Oct 27) | 0 |
| Verified public releases per week (release.json SHA changes) | 0 since Oct 13 (12 on Oct 27: Q01, Q02, Q16, Q02b, Q03, Q04, Q04b, Q05, Q06, Q15, Q07, Q08) | ≥4 |
| Sitemap URLs with <3 internal inbound links | 0 since b14da12 (Oct 27; min 34; tools/site-chrome.test.mjs) | 0 |
| Pages at avg position ≤20 with ≥20 impressions | 5 | ≥7 |

## Last run
- 2026-11-01 22:04Z D23 3j delivered d9edfac0: Chicago with teens table restyled, Cost 2nd; official Nov 1 prices (Art Institute $32/$26 ages 14-17, 360 CHICAGO from $27 tax incl., CAC cruise from $57 to Nov 22); Griffin MSI/Wrigley/Flyover/Second City check live. Hero: family of 4 (2 adults, 2 teens 14-17) ≈ $116 / from ≈ $108 / from ≈ $228. Integrity FAIL(P2 hero basis) → PASS_WITH_P3; design 4.0 → 3.86 → 4.0 PASS; persona 3.93 → 4.2 → 4.2 PASS.
- 2026-11-01 21:05Z D23 3i delivered 55c11634: SA with teens table restyled, Cost 2nd; official Nov 1 prices (Six Flags from $49 + fee/taxes, Alamo exhibit $15/$11, SeaWorld from $53.99 reused); NBC/Hopscotch/GO RIO show no official price (check live). Family of 4 (2 adults, 2 teens 13-17) estimate in hero, glance (3-day ≈ $276) and table note. Integrity FAIL(P2 wording) → PASS_WITH_P3; design 4.14 → 4.29 → 4.43 PASS; persona 3.73 → 3.87 → 4.07 PASS.
- 2026-11-01 20:06Z D23 3h delivered 6116a177: LV with teens table restyled; Cost now 2nd column with Omega Mart from $45 a ticket and Neon Museum $25 adult / $12.50 ages 7-17 (official, read Nov 1); family of 4 (2 adults, 2 teens) ≈ $75 / from ≈ $180 in the glance box. Integrity PASS_WITH_P3; design 3.86 → 4.0 → 4.0 PASS; persona 3.53 → 3.93 → 4.0 PASS.
