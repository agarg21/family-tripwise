# STATE (operator working state; keep ≤8 KB; overwrite, don't append)

authority: owner-directed cloud scheduled task; hourly from 2026-10-27 10:00 until 2026-12-08 10:00 ET (owner 2026-10-29: hourly through the Black Friday deal window), then every 4 hours; ends 2027-01-15 17:00 America/New_York (extended by owner 2026-10-28)
caps: 1 transaction per run; daily_cap=none (owner 2026-10-27: no daily limit; the run cadence and the 90-minute lock are the only throttle)
today: 2026-11-03 transactions=7
run: {id: 2026-11-03T12:05:01Z, started_at: 2026-11-03T12:05:01Z}
last_public_release: ee2611fa Beaches Black Friday deal check, page only (2026-11-03Z; release.json verified; page live)
active: none (q/G15 and q/D23-4a held for O30, O29; next G13 fix list item 2)

## Holds (one line each: what, unblock condition)
- Deal watch (G09, 8daaacb): .github/workflows/deal-watch.yml commits ops/deal-watch/state.json and flags.json to main when an official deal page changes (hourly at :23); always fetch and merge before releasing; pending flags are G09w work.
- Cadence: trig_016a6JJcR9FqbUGzGbmr9ZXi switches to 4h on 2026-12-08.
- /deals/ checks end Oct 31 (Beaches), Nov 1 (Great Wolf; year is our reading), Nov 2 (Royal Caribbean; NCL Free 2nd Guest, whose 3rd/4th-guest part has no stated end; MSC, whose terms say Nov 5), Nov 8 (Great Wolf November Web Sale), Nov 17 (LEGOLAND California hotel package), Nov 6 (Sesame Place Philadelphia pass: no end date stated, listed one week; re-read the pass page from Nov 6 to extend; LEGOLAND New York 2027 pass, same, listed to Nov 6), Nov 22 (Atlantis Fall Into Paradise; year is our reading), Dec 1 (Beaches Black Friday), Dec 31 (SeaWorld Fun Card; no purchase deadline stated, re-observe weekly from Nov 4; Busch Gardens Tampa Bay Fun Card, same, re-observe from Nov 6; SeaWorld San Diego Fun Card, same, $99.99 may be an October price, re-observe from Nov 8), Nov 8 (SeaWorld San Antonio 2027 Season Pass and Sesame Place San Diego 2027 Silver Pass: no end date, listed one week; re-read their pages from Nov 8 to extend), Jan 6 (Club Med); tools/this-week.mjs re-renders deal pages daily too, and the committed deal pages must match today's render or tests fail.
- /this-week/ items expire daily: the deploy workflow (daily 05:17 UTC) refreshes the live copy, but the committed site/this-week/index.html must be re-rendered (`node tools/this-week.mjs`, commit) on the first run each Eastern day or `node --test` fails the committed-page test. Next item expiry: Nov 4 (DC lottery). SD with kids and teens ticket prices observed 2026-11-01 (LEGOLAND 10-30); re-observe before showing as current after Dec 1.
- Social posting (G04/G08 Zernio): ZERNIO_API_KEY live; only Facebook connected (others logged `not_connected`); posts Threads, Facebook, Instagram, Pinterest (Pinterest needs PINTEREST_TOKEN + PINTEREST_BOARD_ID). Receipts land in ops/social-receipts/ on main: fetch and merge before releasing. A failed or stuck "attempting" receipt is never retried; report it to the owner.
- Social queues: ops/social-queue/2026-10-29.json through 2026-11-07.json are committed (SeaWorld San Antonio not queued; re-read its pass page from Nov 8); nothing posts until the owner's secrets exist (T3). While a queue date is today or later, tools/social-queue.test.mjs fails if its records change: regenerate the queue (and cards) in the same commit; regeneration keeps stored skips. Queue Nov 8+ in G05; Oct 28 event records pass the 14-day observation limit after Nov 11: re-observe them first. To change only post text in existing queues, refresh entry texts in place (regenerating an older date with today's records reselects entries) (`node tools/social-queue.mjs <date> [--skip <id> "<reason>"]`); decide repeats deliberately; never filler.
- Growth-first (D10–D12): G items before old Q items, except live-site defects and Q17b. D22: only real deals (card saves ≥5%) are queued, posted or promoted; regenerate queues when a card changes.
- Orlando admission tariffs observed 2026-10-27; re-observe by 2026-11-10 (the form flags them as older for later visit dates).
- GSC: sitemap resubmitted and indexing requested for the 5 unknown URLs on 2026-10-27 (OWNER.md T1). Check their coverage in the next GSC snapshots; no repeat requests.
- SeaWorld San Diego $99.99 may be stale (re-read from Nov 8).
- Sitemap lastmod of 21 pages unchanged since 10-15 is an estimate; observed once each page changes.
- DC itinerary official facts observed 2026-10-27 (14-day maintenance clock in tools/site-maintenance.mjs); re-observe before showing them as current after Nov 10. New URL not yet known to Google; no indexing request without an Approved OWNER.md row.
- Boston itinerary official facts observed 2026-10-27 (14-day clock in tools/site-maintenance.mjs); Aquarium prices and MBTA adult fares unknown (ticket site JS-only; mbta.com robots.txt blocks AI agents, do not fetch). New URL not yet known to Google; no indexing request without an Approved OWNER.md row.
- Owner's Mac stale since 10-27 (branch owner-local-2026-10-27); cloud clones only.
- SD, NYC, Orlando, Boston and London Google listings (live since 0bb7a64f / 1af5ebd7 / 19cc3b6f / 42e7a8d8) leave their pages 2027-01-08: the *-google-sample/-listing tests (and PV example-stay test) fail from that date until `node tools/generate-pages.mjs` is run and committed.

- Cancun price card (dffcec9f) uses Nov 9-12 samples: before Nov 9 withdraw them (bump PASSED_AS_OF in src/prototypes/cancun-resort-comparison/render.mjs only after removing; tools/cancun-price-card.test.mjs fails from Nov 9) and regenerate; the grandparents Nov 9-12 table too.

- Orlando with kids: re-read 5 rate pages from Nov 3, before Nov 10; Oct 13 facts too.
- SD itinerary: zoo hours listed to Nov 25 (re-read after); Balboa parking rates end 2026 (re-read Jan 1).
- Q19: SA, SD, NYC live; July samples gone. SD/LV/Chicago/SA/NYC Jan 19 prices: regenerate by Jan 12 (guard test); NYC family-of-5 listings by Jan 8; Feb dates have no committed guard.

## Scoreboard (refresh on Mondays from the newest ops/gsc-snapshots/*.md and live checks)
| Metric | Baseline 2026-10-27 | Target 2026-11-13 |
|---|---|---|
| 28-day organic clicks / impressions | 8 / 3,202 (finalized Sep 27–Oct 24); 8 / 3,410 in the 10-29 snapshot, newest | report; ≥15 clicks good |
| Sitemap URLs indexed | 31/36 (37 in sitemap from Oct 27); sitemap last read 2026-07-27 | 36/36 or a reason per URL |
| Live pages with past-due dates or past-stay price samples | 7 (8 from Oct 28); 0 since c21010c (Oct 27) | 0 |
| Verified public releases per week (release.json SHA changes) | 0 since Oct 13; 2026-11-02 alone: 8 delivered | ≥4 |
| Sitemap URLs with <3 internal inbound links | 0 since b14da12 (Oct 27; min 34; tools/site-chrome.test.mjs) | 0 |
| Pages at avg position ≤20 with ≥20 impressions | 5 | ≥7 |

## Last run
- 2026-11-03 11:05Z G05 Beaches Black Friday page released ee2611fa: book Nov 3-Dec 1, no family price so no posts. Persona 3.67 (D26 O17 bar), design 4.0, integrity PASS_WITH_P3.
- 2026-11-03 10:05Z Chicago teens released 75747beb: Flyover time 25-30 min (was unsourced 60-90), FAQ link moved, 40-inch rule re-read. Persona 3.67, design 4.0, integrity PASS_WITH_P3.
- 2026-11-03 09:05Z G13 step 2: first weekly report (no page changed). 26 pages show July-August checks; Flyover FAQ answered 404; LV teens and NYC hotels under the guide bar. Integrity PASS_WITH_P3.
- 2026-11-03 08:05Z SD with kids zoo card released c0a7b05c: stroller Moderate (steep grades), bus tour not assumed. Persona 4.2, design 4.0, integrity PASS_WITH_P3.
- 2026-11-03 07:05Z D23 4e San Diego itinerary released 9a5798bb: family-of-4 tickets ≈ $292 to $422; Mission Bay photo. Persona 3.8 (D28 bar), design 4.0, integrity PASS_WITH_P3; small final edits not re-reviewed. Desktop day figures in a row on 4 itineraries.
