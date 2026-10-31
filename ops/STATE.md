# STATE (operator working state; keep ≤8 KB; overwrite, don't append)

authority: owner-directed cloud scheduled task; hourly from 2026-10-27 10:00 until 2026-12-08 10:00 ET (owner 2026-10-29: hourly through the Black Friday deal window), then every 4 hours; ends 2027-01-15 17:00 America/New_York (extended by owner 2026-10-28)
caps: 1 transaction per run; daily_cap=none (owner 2026-10-27: no daily limit; the run cadence and the 90-minute lock are the only throttle)
today: 2026-10-31 transactions=4
run: {id: 2026-10-31T13:04:41Z, started_at: 2026-10-31T13:04:41Z}
last_public_release: 19cc3b6f Q17b Orlando family hotels price card (2026-10-31 ~07:00 ET; release.json verified; no Nov 8-13 amounts, $177-$527 range live)
active: {id: Q17b, branch: none (held for OWNER O13, all integrity+design PASS, persona clarity ≥4 but avg <4: Boston q/Q17b-boston 3.73, London q/Q17b-london 3.93, PV q/Q17b-pv 5bb787e3 3.2), next: if O13 = yes merge main into each, re-test, release (PV before Nov 7); if no, owner decides how to meet Nov 7}

## Holds (one line each: what, unblock condition)
- Deal watch (G09, 8daaacb): .github/workflows/deal-watch.yml commits ops/deal-watch/state.json and flags.json to main when an official deal page changes (hourly at :23); always fetch and merge before releasing; pending flags are G09w work.
- Cadence: trig_016a6JJcR9FqbUGzGbmr9ZXi switches to 4h on 2026-12-08 (ignore older 4h reminders).
- /deals/ checks end Oct 31 (Beaches), Nov 1 (Great Wolf; year is our reading), Nov 2 (Royal Caribbean; NCL Free 2nd Guest, whose 3rd/4th-guest part has no stated end; MSC, whose terms say Nov 5), Nov 3 (Margaritaville at Sea), Nov 17 (LEGOLAND California hotel package), Nov 6 (Sesame Place Philadelphia pass: no end date stated, listed one week; re-read the pass page from Nov 6 to extend; LEGOLAND New York 2027 pass, same, listed to Nov 6), Nov 22 (Atlantis Fall Into Paradise; year is our reading), Dec 31 (SeaWorld Fun Card; no purchase deadline stated, re-observe weekly from Nov 4; Busch Gardens Tampa Bay Fun Card, same, re-observe from Nov 6), Jan 6 (Club Med); tools/this-week.mjs re-renders deal pages daily too, and the committed deal pages must match today's render or tests fail.
- /this-week/ items expire daily: the deploy workflow (daily 05:17 UTC) refreshes the live copy, but the committed site/this-week/index.html must be re-rendered (`node tools/this-week.mjs`, commit) on the first run each Eastern day or `node --test` fails the committed-page test. Next item expiry: Nov 4 (DC lottery).
- Social posting (G04, a568c5b; Zernio route G08, 16e5ad8): ZERNIO_API_KEY is live; first post Facebook 2026-10-29 14:05 UTC (Beaches). Only Facebook is connected in Zernio; runs now log and summarise `not_connected` platforms (6172a5a). Since G04b (e389a0c) it posts Threads, Facebook, Instagram and Pinterest (Bluesky removed); Pinterest needs PINTEREST_TOKEN (30-day expiry, owner replaces monthly) + PINTEREST_BOARD_ID, added only once the app has Standard access. It commits receipts to ops/social-receipts/ on main: fetch and merge before releasing. A failed or stuck "attempting" receipt is never retried; report it to the owner.
- Social queues: ops/social-queue/2026-10-29.json through 2026-11-04.json are committed (Nov 4: first posts for NYBG, Universal, EPCOT; Hyde Park, Chicago ZooLights, Bronx Zoo repeats skipped with stored reasons); nothing posts until the owner's secrets exist (T3). While a queue date is today or later, tools/social-queue.test.mjs fails if its records change: regenerate the queue (and cards) in the same commit; regeneration keeps stored skips. Queue Nov 5+ in G05. To change only post text in existing queues, refresh entry texts in place (regenerating an older date with today's records reselects entries) (`node tools/social-queue.mjs <date> [--skip <id> "<reason>"]`); decide repeats deliberately; never filler.
- Growth-first (D10–D12): G items before old Q items, except live-site defects and Q17b. D22: only real deals (card saves ≥5%) are queued, posted or promoted; regenerate queues when a card changes.
- Orlando admission tariffs observed 2026-10-27; re-observe by 2026-11-10 (the form flags them as older for later visit dates).
- GSC: sitemap resubmitted and indexing requested for the 5 unknown URLs on 2026-10-27 (OWNER.md T1). Check their coverage in the next GSC snapshots; no repeat requests.
- Sitemap lastmod of 21 pages unchanged since 10-15 is an estimate; observed once each page changes.
- DC itinerary official facts observed 2026-10-27 (14-day maintenance clock in tools/site-maintenance.mjs); re-observe before showing them as current after Nov 10. New URL not yet known to Google; no indexing request without an Approved OWNER.md row.
- Boston itinerary official facts observed 2026-10-27 (14-day clock in tools/site-maintenance.mjs); Aquarium prices and MBTA adult fares unknown (ticket site JS-only; mbta.com robots.txt blocks AI agents, do not fetch). New URL not yet known to Google; no indexing request without an Approved OWNER.md row.
- Remote branches q/Q02b…q/Q15b, q/Q02c, q/Q02d, q/Q07, q/Q08, q/Q09, q/Q09b, q/Q09c, q/Q09c-dc, q/Q09c-cancun, q/Q09c-london, q/Q09c-orlando, q/G02, q/G03, q/G04b, q/G05, q/G05-uo, q/G05-epcot, q/G05-nybg, q/G07, q/Q11 and q/G11, q/G13-og, q/G14, q/G12 (deletion refused) remain because remote deletion is refused; harmless.
- Owner's Mac stale since 10-27 (branch owner-local-2026-10-27); cloud clones only.

- Hotel pages with Nov 8-13 samples (DC, SD, NYC, Orlando fixed; Boston, London, PV held on branches for O13) show November 8-13, 2026 price samples; past-stay from arrival Nov 8, so the fix must be live by 2026-11-07 (Q17b removes the rest).

- SD Homewood, NYC and Orlando Google listings (live since 0bb7a64f / 1af5ebd7 / 19cc3b6f) leave their pages 2027-01-08: tools/san-diego-google-sample.test.mjs and nyc-google-sample.test.mjs and orlando-google-sample.test.mjs fail from that date until `node tools/generate-pages.mjs` is run and committed.

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
- 2026-10-31 12:04-13:00Z: G05 Gaylord ice! items (Orlando, DC) + Nov 5 queue held on q/G05-1031 (f3fc5b2f): integrity PASS, design 4.43 PASS, persona 3.4→3.6→3.8 FAIL (clarity ≥4; visual/shareability set by shared event card/post templates). Next: G05e template fix, then release.
- 2026-10-31 11:04-11:50Z: Q17b PV built, held on q/Q17b-pv (5bb787e3): Oct 9 Nov 8-13 Sanctuary prices, meal-plan increment and food-budget tool withdrawn (page, CSV); card "No current price yet: check live rates" (3 suites by kitchen/meal plan/kids club, official links; Google Hotels no price Jan 2027). Integrity PASS; design 4.0 PASS; persona 3.07 → 3.2 → 3.2 FAIL (clarity 4 each). O13.
- 2026-10-31 10:05-11:05Z scheduled run: Q17b Orlando delivered 19cc3b6f (verified): Oct 11 Nov 8-13 Cabana Bay/IHG samples withdrawn (page, 3 CSVs, evidence); card "About $177-$527 a night" from 1-night Google listings (HI Suites $177 Mon/$199 Fri, Cabana Bay…
