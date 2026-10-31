# STATE (operator working state; keep ≤8 KB; overwrite, don't append)

authority: owner-directed cloud scheduled task; hourly from 2026-10-27 10:00 until 2026-12-08 10:00 ET (owner 2026-10-29: hourly through the Black Friday deal window), then every 4 hours; ends 2027-01-15 17:00 America/New_York (extended by owner 2026-10-28)
caps: 1 transaction per run; daily_cap=none (owner 2026-10-27: no daily limit; the run cadence and the 90-minute lock are the only throttle)
today: 2026-10-30 transactions=16
run: {id: owner-session-2026-10-31T02:06:03Z, started_at: 2026-10-31T02:06:03Z, note: owner session releasing O11/O12 + D22}
last_public_release: 06fb908 (2026-10-30 ET, G11 v3 Busch Gardens Fun Card spend-vs-save + hub "not really cheaper" rule; live in release.json); last main code change 06fb908 (hubSpend)
active: {id: Q17b, branch: q/Q17b (c1ed904), next: read docs/research/dataforseo-q17b-dc-hotel-prices-2026-10-30.json; if priced (pair 5n/1n), add a dated labelled Jan 15-20 2027 band for 2+3; kitchen/price line in table col 1; persona cycle 3 (was 3.33); then other 6 pages} (held: q/G11-legofl-ss O11; q/G11-clubmed O12)

## Holds (one line each: what, unblock condition)
- Deal watch (G09, 8daaacb): .github/workflows/deal-watch.yml commits ops/deal-watch/state.json and flags.json to main when an official deal page changes (hourly at :23); always fetch and merge before releasing; pending flags are G09w work.
- Cadence: ignore the Oct 30 4h-switch reminder (trig_01Ccfq2FQJBy7UbQGESFpLF8; superseded 10-29); trig_016a6JJcR9FqbUGzGbmr9ZXi switches on 2026-12-08.
- /deals/ checks end Oct 31 (Beaches), Nov 1 (Great Wolf; year is our reading), Nov 2 (Royal Caribbean; NCL Free 2nd Guest, whose 3rd/4th-guest part has no stated end; MSC, whose terms say Nov 5), Nov 3 (Margaritaville at Sea), Nov 17 (LEGOLAND California hotel package), Nov 6 (Sesame Place Philadelphia pass: no end date stated, listed one week; re-read the pass page from Nov 6 to extend; LEGOLAND New York 2027 pass, same, listed to Nov 6), Nov 22 (Atlantis Fall Into Paradise; year is our reading), Dec 31 (SeaWorld Fun Card; no purchase deadline stated, re-observe weekly from Nov 4; Busch Gardens Tampa Bay Fun Card, same, re-observe from Nov 6), Jan 6 (Club Med); tools/this-week.mjs re-renders deal pages daily too, and the committed deal pages must match today's render or tests fail.
- /this-week/ items expire daily: the deploy workflow (daily 05:17 UTC) refreshes the live copy, but the committed site/this-week/index.html must be re-rendered (`node tools/this-week.mjs`, commit) on the first run each Eastern day or `node --test` fails the committed-page test. Next item expiry: Nov 4 (DC lottery).
- Social posting (G04, a568c5b; Zernio route G08, 16e5ad8): ZERNIO_API_KEY is live; first post Facebook 2026-10-29 14:05 UTC (Beaches). Only Facebook is connected in Zernio; runs now log and summarise `not_connected` platforms (6172a5a). Since G04b (e389a0c) it posts Threads, Facebook, Instagram and Pinterest (Bluesky removed); Pinterest needs PINTEREST_TOKEN (30-day expiry, owner replaces monthly) + PINTEREST_BOARD_ID, added only once the app has Standard access. Once live it commits receipts to ops/social-receipts/ on main several times a day: always fetch and merge before releasing. A failed or stuck "attempting" receipt is never retried; report it to the owner.
- Social queues: ops/social-queue/2026-10-29.json through 2026-11-04.json are committed (Nov 4: first posts for NYBG, Universal, EPCOT; Hyde Park, Chicago ZooLights, Bronx Zoo repeats skipped with stored reasons); nothing posts until the owner's secrets exist (T3). While a queue date is today or later, tools/social-queue.test.mjs fails if its records change: regenerate the queue (and cards) in the same commit; regeneration keeps stored skips. Queue Nov 5+ in G05. To change only post text in existing queues, refresh entry texts in place (regenerating an older date with today's records reselects entries) (`node tools/social-queue.mjs <date> [--skip <id> "<reason>"]`); decide repeats deliberately; never filler.
- Growth-first since 2026-10-28 (OWNER D10–D12): work G items before old Q items, except live-site defects and the Q17b deadline. Posting waits for the owner's accounts and GitHub secrets (T3).
- Orlando admission tariffs observed 2026-10-27; re-observe by 2026-11-10 (the form flags them as older for later visit dates).
- GSC: sitemap resubmitted and indexing requested for the 5 unknown URLs on 2026-10-27 (OWNER.md T1). Check their coverage in the next GSC snapshots; no repeat requests.
- Sitemap lastmod for 21 pages unchanged since the 2026-10-15 import is an estimate (visible date or 2026-10-13 bound); it becomes observed the next time each page changes. No action needed.
- DC itinerary official facts observed 2026-10-27 (14-day maintenance clock in tools/site-maintenance.mjs); re-observe before showing them as current after Nov 10. New URL not yet known to Google; no indexing request without an Approved OWNER.md row.
- Boston itinerary official facts observed 2026-10-27 (14-day clock in tools/site-maintenance.mjs); Aquarium prices and MBTA adult fares unknown (ticket site JS-only; mbta.com robots.txt blocks AI agents, do not fetch). New URL not yet known to Google; no indexing request without an Approved OWNER.md row.
- Remote branches q/Q02b…q/Q15b, q/Q02c, q/Q02d, q/Q07, q/Q08, q/Q09, q/Q09b, q/Q09c, q/Q09c-dc, q/Q09c-cancun, q/Q09c-london, q/Q09c-orlando, q/G02, q/G03, q/G04b, q/G05, q/G05-uo, q/G05-epcot, q/G05-nybg, q/G07, q/Q11 and q/G11, q/G13-og, q/G14, q/G12 (deletion refused) remain because remote deletion is refused; harmless.
- Club Med v2 on q/G11-clubmed (da64f07): merged with main, v2.spend_missing card, Nov 2 post skipped; push to main refused by a permission check (persona 3.5). On O12 Yes: fetch, merge origin/main if moved, re-render, re-test, push.
- Owner's Mac checkout stale since 10-27 (files on branch owner-local-2026-10-27); cloud clones only.

- Seven hotel pages show November 8-13, 2026 price samples; past-stay from arrival Nov 8, so the fix must be live by 2026-11-07 (Q17a found all 4 candidate engines blocked too; Q17b removes all 15 unless OWNER O2 supplies observations; start Nov 3).

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
- 2026-10-31 01:05Z Q17b started (deadline Nov 7): DC page withdraws the Nov 8-13 Hilton samples (page, CSV, JSON-LD, plan premiums), decision-first quick-pick + "What to price" checklist; index/DC itinerary link wording. Integrity FAIL (3 P2 stale copy) → PASS_WITH_P3; persona 2.7 → 3.33 FAIL (no price signal). Not released; DataForSEO request for DC Jan 15-20 2027 prices committed.
- 2026-10-31 00:04Z G11 Club Med v2 release prepared, NOT delivered: merged main, added v2.spend_missing (card says no family price seen; never posted, never in savings box), dropped Club Med from Nov 2 queue. Integrity FAIL→PASS_WITH_P3; persona 3.3→3.5→3.5 (no family price). Push to main refused by a permission check; OWNER O12.
- 2026-10-30 23:04Z G11 v3 LEGOLAND Florida card built, NOT released: G12 Google Hotels LEGOLAND Hotel FL $269 (Dec 4, 2+2) + 4 × $114 2-day ticket ≈ $725 vs 4 × $162 package ≈ $648, save ≈ $77 (11%) only with 2 park days and the starting price; og card now carries the spend line. Integrity PASS_WITH_P3; persona 3.6 → 3.8 → 3.93 FAIL (A share 3). Branch pushed; OWNER O11.
