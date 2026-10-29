# STATE (operator working state; keep ≤8 KB; overwrite, don't append)

authority: owner-directed cloud scheduled task; hourly from 2026-10-27 10:00 until 2026-10-30 10:00 ET, then every 4 hours; ends 2027-01-15 17:00 America/New_York (extended by owner 2026-10-28)
caps: 1 transaction per run; daily_cap=none (owner 2026-10-27: no daily limit; the run cadence and the 90-minute lock are the only throttle)
today: 2026-10-28 transactions=21
run: {id: 2026-10-29T01:04:40Z, started_at: 2026-10-29T01:04:40Z}
last_public_release: 31d63fb (2026-10-28, G05: DC ZooLights + Hogwarts in the Snow on /this-week/; Nov 2 social queue)
active: none

## Holds (one line each: what, unblock condition)
- /deals/ checks end Oct 31 (Beaches), Nov 1 (Great Wolf; year is our reading), Nov 2 (Royal Caribbean), Nov 3 (Margaritaville at Sea), Dec 31 (SeaWorld Fun Card; no purchase deadline stated, re-observe weekly from Nov 4), Jan 6 (Club Med); tools/this-week.mjs re-renders deal pages daily too, and the committed deal pages must match today's render or tests fail.
- /this-week/ items expire daily: the deploy workflow (daily 05:17 UTC) refreshes the live copy, but the committed site/this-week/index.html must be re-rendered (`node tools/this-week.mjs`, commit) on the first run each Eastern day or `node --test` fails the committed-page test. Next item expiry: Nov 4 (DC lottery).
- Social posting (G04, a568c5b): .github/workflows/social-post.yml runs at :40 past the slot hours and posts nothing until the owner adds a platform's secrets (T3). Since G04b (e389a0c) it posts Threads, Facebook, Instagram and Pinterest (Bluesky removed); Pinterest needs PINTEREST_TOKEN (30-day expiry, owner replaces monthly) + PINTEREST_BOARD_ID, added only once the app has Standard access. Once live it commits receipts to ops/social-receipts/ on main several times a day: always fetch and merge before releasing. A failed or stuck "attempting" receipt is never retried; report it to the owner.
- Social queues: ops/social-queue/2026-10-29.json (Beaches, Great Wolf, Royal Caribbean), 2026-10-30.json (DC tree lottery, Disney party, Hyde Park) 2026-10-31.json (Margaritaville, Chicago ZooLights, Bronx Zoo lights) 2026-11-01.json (3 Boston tree events, San Antonio parade, SD December Nights, SeaWorld Fun Card) and 2026-11-02.json (Hogwarts in the Snow, DC ZooLights, Club Med); nothing posts until the owner's secrets exist (T3). While a queue date is today or later, tools/social-queue.test.mjs fails if its records change: regenerate the queue (and cards) in the same commit. Queue Nov 3+ in G05 (only Club Med and new verified items are eligible for Nov 3; add items first, never filler).
- Growth-first since 2026-10-28 (OWNER D10–D12): work G items before old Q items, except live-site defects and the Q17b deadline. Posting waits for the owner's accounts and GitHub secrets (T3).
- Orlando admission tariffs observed 2026-10-27; re-observe by 2026-11-10 (the form flags them as older for later visit dates).
- GSC: sitemap resubmitted and indexing requested for the 5 unknown URLs on 2026-10-27 (OWNER.md T1). Check their coverage in the next GSC snapshots; no repeat requests.
- Sitemap lastmod for 21 pages unchanged since the 2026-10-15 import is an estimate (visible date or 2026-10-13 bound); it becomes observed the next time each page changes. No action needed.
- DC itinerary official facts observed 2026-10-27 (14-day maintenance clock in tools/site-maintenance.mjs); re-observe before showing them as current after Nov 10. New URL not yet known to Google; no indexing request without an Approved OWNER.md row.
- Boston itinerary official facts observed 2026-10-27 (14-day clock in tools/site-maintenance.mjs); Aquarium prices and MBTA adult fares unknown (ticket site JS-only; mbta.com robots.txt blocks AI agents, do not fetch). New URL not yet known to Google; no indexing request without an Approved OWNER.md row.
- Remote branches q/Q02b…q/Q15b, q/Q02c, q/Q02d, q/Q07, q/Q08, q/Q09, q/Q09b, q/Q09c, q/Q09c-dc, q/Q09c-cancun, q/Q09c-london, q/Q09c-orlando, q/G02, q/G03, q/G04b, q/G05 and q/G07 remain because remote deletion is refused; harmless.
- Owner's Mac checkout is stale after 2026-10-27 (its 20 local files are preserved on branch owner-local-2026-10-27). Never commit from the Mac; the operator works only in cloud clones.

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
- 2026-10-28 G05 night sweep delivered 31d63fb (release.json; /this-week/ and three Nov 2 cards byte-identical live): Smithsonian ZooLights (DC; USD 10, ages 3+, select nights Nov 20–Jan 3, from the Oct 8 official release) and Hogwarts in the Snow (London; Nov 14–Jan 17, prices not on page) added; Nov 2 queue of 3. NPS Veterans Day fee-free day not published (no city section). Reviewer PASS_WITH_P3 (1 fixed, 2 carried).
- 2026-10-28 G05 late sweep delivered 1769b9a (release.json; six new Nov 1 cards byte-identical live): Nov 1 queue (6 entries, within caps); an ended deal check whose date was never a stated deadline now reads "We stopped listing this check after <date>" (SeaWorld after Dec 31); a.m./p.m. before a day or month name no longer splits a sentence; Pinterest 403 README note; growth plan phase 0 without Bluesky. Reviewer PASS_WITH_P3 (2 fixed, 1 accepted: a real new sentence starting with a day/month name after a.m./p.m. would join, no text lost). Remote q/G05 deletion refused.
- 2026-10-28 G05 evening sweep delivered dd9af5b (release.json; new deal page, /deals/ hub, SeaWorld and Great Wolf pages, sitemap and Oct 31 card byte-identical live): Margaritaville at Sea Black Friday Early Access check (book by Nov 3, 2026; USD 0 3rd/4th guest fares with taxes/fees/port for all; no child ages stated); non-deadline dates now read "Listed until" (SeaWorld); Oct 31 queue. Universal 3-Day ticket not published (no deadline/blockouts stated); Disneyland and Kalahari offer pages refused the fetcher. Reviewer PASS_WITH_P3 (1 fixed, 1 carried).
