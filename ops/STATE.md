# STATE (operator working state; keep ≤8 KB; overwrite, don't append)

authority: owner-directed cloud scheduled task; hourly from 2026-10-27 10:00 until 2026-12-08 10:00 ET (owner 2026-10-29: hourly through the Black Friday deal window), then every 4 hours; ends 2027-01-15 17:00 America/New_York (extended by owner 2026-10-28)
caps: 1 transaction per run; daily_cap=none (owner 2026-10-27: no daily limit; the run cadence and the 90-minute lock are the only throttle)
today: 2026-11-07 transactions=15
run: {id: 2026-11-07T20:04:01Z, started_at: 2026-11-07T20:04:01Z}
last_public_release: 747cf656 NYC itinerary + stay-areas heroes (Staten Island Ferry + Statue of Liberty; Lower Manhattan from Brooklyn Bridge Park; verified live 11-07 ~19:5xZ)
active: none. Remote q/* branches left (delete refused): never merge q/G16-trend-items, -mag-mile, -aurora-lights; q/Q21-nyc is merged.

## Holds (one line each: what, unblock condition)
- Deal watch (G09, 8daaacb): .github/workflows/deal-watch.yml commits ops/deal-watch/state.json and flags.json to main when an official deal page changes (hourly at :23); always fetch and merge before releasing; pending flags are G09w work.
- /deals/ checks end Oct 31 (Beaches), Nov 1 (Great Wolf; year is our reading), Nov 2 (Royal Caribbean; NCL Free 2nd Guest, whose 3rd/4th-guest part has no stated end; MSC, whose terms say Nov 5), Nov 8 (Great Wolf November Web Sale), Nov 17 (LEGOLAND California hotel package), Nov 13 (Sesame Place Philadelphia and LEGOLAND New York passes: no end date, listed one week; re-read from Nov 13 to extend), Nov 22 (Atlantis Fall Into Paradise; year is our reading), Dec 1 (Beaches Black Friday), Dec 31 (SeaWorld Fun Card; no purchase deadline stated, re-observe weekly from Nov 4; SeaWorld San Diego Fun Card, same, $99.99 may be an October price, re-observe from Nov 8), Nov 8 (SeaWorld San Antonio 2027 Season Pass and Sesame Place San Diego 2027 Silver Pass: no end date, listed one week; re-read their pages from Nov 8 to extend), Jan 6 (Club Med); committed deal pages must match today's render or tests fail.
- /this-week/ items expire daily: the deploy workflow (daily 05:17 UTC) refreshes the live copy, but the committed site/this-week/index.html must be re-rendered (`node tools/this-week.mjs`, commit) on the first run each Eastern day or `node --test` fails the committed-page test. DC lottery dropped 11-04. SD with kids and teens ticket prices observed 2026-11-01 (LEGOLAND 10-30); re-observe before showing as current after Dec 1.
- Social posting (G04/G08 Zernio): ZERNIO_API_KEY live; only Facebook connected (others logged `not_connected`); posts Threads, Facebook, Instagram, Pinterest (Pinterest needs PINTEREST_TOKEN + PINTEREST_BOARD_ID). Receipts land in ops/social-receipts/ on main: fetch and merge before releasing. A failed or stuck "attempting" receipt is never retried; report it to the owner.
- Social queues: ops/social-queue/2026-10-29.json through 2026-11-11.json are committed (SeaWorld San Antonio not queued; re-read its pass page from Nov 8); nothing posts until the owner's secrets exist (T3). While a queue date is today or later, tools/social-queue.test.mjs fails if its records change: regenerate the queue (and cards) in the same commit; regeneration keeps stored skips. Queue Nov 13+ in G05; Nov 8 and Nov 10 have no reel (hook does not fit; image posts); Oct 28 event records pass the 14-day observation limit after Nov 11: re-observe them first. Text-only changes: refresh entries in place (`node tools/social-queue.mjs <date> [--skip <id> "<reason>"]`); regenerating an older date reselects entries.
- Growth-first (D10–D12): G items before old Q items, except live-site defects and Q17b. D22: only real deals (card saves ≥5%) are queued, posted or promoted; regenerate queues when a card changes.
- GSC: sitemap resubmitted and indexing requested for the 5 unknown URLs on 2026-10-27 (OWNER.md T1). Check their coverage in the next GSC snapshots; no repeat requests.
- DC itinerary facts re-read 11-06 (clock to Nov 20); NMNH storage/stroller line dated Oct 27: drop or re-source from Nov 10.
- Boston itinerary official facts re-read 2026-11-07 (14-day clock, per-URL); mos.org/visit/faq still Oct 27 (fetch permission timed out, not a denial): re-read it from tomorrow, due Nov 10; Aquarium prices and MBTA adult fares unknown (ticket site JS-only; mbta.com robots.txt blocks AI agents, do not fetch). New URL not yet known to Google; no indexing request without an Approved OWNER.md row.
- SD Christmas page: prices hide Dec 2-5; re-read from Nov 28. Orlando Christmas page: Gatorland, Crayola prices (Oct 27) hide Nov 27, rest Dec 3-5; re-read from Nov 20; Mickey's party ends Dec 22. SA Christmas page: SeaWorld price hides Dec 2, rest Dec 5; re-read zoo, caverns prices from Nov 11. DC Christmas page: re-read NPS tree page from Nov 11 for viewing dates, confirm lottery close, edit "winners told Nov 12" after Nov 12; Enchant from Nov 10; ice! price unread.
- NYC Christmas page: prices hide Dec 4 (read Nov 3); re-read from Nov 25. Grand Central train show: Nov 30 is our window (no end posted); re-read from Nov 28. Macy's and Rockefeller pages unreadable. Chicago page: prices hide Dec 5 (read Nov 4); re-read from Nov 26.
- Holiday parks page: re-read park prices before Nov 29. Dyker tour, Secret NYC: from Nov 27.
- SD, NYC, Orlando and London Google listings leave their pages 2027-01-08: the *-google-sample/-listing tests (and PV example-stay test) fail from that date until `node tools/generate-pages.mjs` is run and committed.
- JetBlue bag card: expires Nov 19, read jetblue.com/legal/fees from Nov 12 to re-date and extend through peak dates. Veterans Day card: route ends about 50th (UCLA) vs 45th (amNY); organizer read due Nov 11, day of parade.
- Cancun (ddbe75f4), PV (19cd3291): this-week re-renders drops; regenerate Dec 18, Dec 25, Jan 15 or byte tests fail (PV example-stay test: by Jan 8). Refresh holiday prices from Nov 12.
- Orlando with kids: all official facts read 11-06; re-read from Nov 20 (form flags later visits). Review excerpts (Oct 13) lapse Nov 12: re-read or drop.
- SD itinerary: zoo hours to Nov 25 (re-read after); Balboa parking rates end 2026.
- Q19: LV/Chicago/SA Jan 19 prices: regenerate by Jan 12 (guard test); Feb dates have no committed guard.
- G18 receipts 11-05: rebuild if O48 waits past Nov 12.
- NYC, DC, Boston, SD hotels (G18): regenerate by Dec 18, Dec 25, Jan 15; guard tests fail then. Refresh holiday prices weekly (next from Nov 12).
- Six Flags Silver (NJ, Fiesta Texas, Great America): footnotes unread, re-read from Nov 13; ends Nov 30. Check Pre-K Pass (ages 3-5) for NJ, TX.
- Busch Fun Card: lists to Nov 8 (file name only); re-read limited-time-offers from Nov 13; Nov 7 queue: --refresh only (regenerate drops it). Extending it: validator forces saver_flag, hub_deadline edit.

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
- 2026-11-07 19:06Z Q21 step 3: NYC itinerary hero now Staten Island Ferry passing the Statue of Liberty (InSapphoWeTrust, May 2012, CC BY-SA 2.0, labelled older); stay-areas hero Lower Manhattan from Brooklyn Bridge Park (Arribas91, July 2014, CC BY-SA 3.0). Central Park now only on NYC hotels; Millennium Park only on Chicago hotels (+ /terms). Integrity PASS_WITH_P3, persona 4.25/3.75 (D28), design 4.0. Live 747cf656.
