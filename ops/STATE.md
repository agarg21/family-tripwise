# STATE (operator working state; keep ≤8 KB; overwrite, don't append)

authority: owner-directed cloud scheduled task; hourly from 2026-10-27 10:00 until 2026-10-30 10:00 ET, then every 4 hours; ends 2027-01-15 17:00 America/New_York (extended by owner 2026-10-28)
caps: 1 transaction per run; daily_cap=none (owner 2026-10-27: no daily limit; the run cadence and the 90-minute lock are the only throttle)
today: 2026-10-29 transactions=1
run: none
last_public_release: 08ff52c (2026-10-29, G05: LEGOLAND California hotel + ticket package deal check)
active: none

## Holds (one line each: what, unblock condition)
- /deals/ checks end Oct 31 (Beaches), Nov 1 (Great Wolf; year is our reading), Nov 2 (Royal Caribbean; NCL Free 2nd Guest, whose 3rd/4th-guest part has no stated end; MSC, whose terms say Nov 5), Nov 3 (Margaritaville at Sea), Nov 17 (LEGOLAND California hotel package), Dec 31 (SeaWorld Fun Card; no purchase deadline stated, re-observe weekly from Nov 4), Jan 6 (Club Med); tools/this-week.mjs re-renders deal pages daily too, and the committed deal pages must match today's render or tests fail.
- /this-week/ items expire daily: the deploy workflow (daily 05:17 UTC) refreshes the live copy, but the committed site/this-week/index.html must be re-rendered (`node tools/this-week.mjs`, commit) on the first run each Eastern day or `node --test` fails the committed-page test. Next item expiry: Nov 4 (DC lottery).
- Social posting (G04, a568c5b): .github/workflows/social-post.yml runs at :40 past the slot hours and posts nothing until the owner adds a platform's secrets (T3). Since G04b (e389a0c) it posts Threads, Facebook, Instagram and Pinterest (Bluesky removed); Pinterest needs PINTEREST_TOKEN (30-day expiry, owner replaces monthly) + PINTEREST_BOARD_ID, added only once the app has Standard access. Once live it commits receipts to ops/social-receipts/ on main several times a day: always fetch and merge before releasing. A failed or stuck "attempting" receipt is never retried; report it to the owner.
- Social queues: ops/social-queue/2026-10-29.json (Beaches, Great Wolf, Royal Caribbean), 2026-10-30.json (DC tree lottery, Disney party, Hyde Park) 2026-10-31.json (Margaritaville, Chicago ZooLights, Bronx Zoo lights) 2026-11-01.json (3 Boston tree events, San Antonio parade, SD December Nights, SeaWorld Fun Card) and 2026-11-02.json (Hogwarts in the Snow, DC ZooLights, Club Med); nothing posts until the owner's secrets exist (T3). While a queue date is today or later, tools/social-queue.test.mjs fails if its records change: regenerate the queue (and cards) in the same commit. Queue Nov 3+ in G05 (Club Med and LEGOLAND are eligible for Nov 3; `node tools/social-queue.mjs 2026-11-03` currently also picks the DC lottery, Disney party and Hyde Park repeats from Oct 30, so decide repeats deliberately; never filler).
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
- 2026-10-29 G05 LEGOLAND check delivered 08ff52c (release.json; https://familytripwise.com/deals/legoland-california-hotel-kids-tickets-39.html, /deals/, a sibling and sitemap byte-identical live): book by Nov 17, 2026 for LEGOLAND Hotel/Castle Hotel stays through Jan 9, 2027; Park Hopper, hot breakfast, early access; advertised from USD 169 per person/night (2 adults + 2 kids 2–12, 1 night, pre-tax), non-refundable, parking extra; partner-hotel terms conflict; family total "check live". Ticket-only kids offer (ends Nov 1) not published; Hotel Xcaret refused plain requests. No Nov 3 queue yet. Reviewer PASS_WITH_P3 (3 fixed, 1 template caption carried).
- 2026-10-28 G05 MSC check delivered a5f7823 (release.json; https://familytripwise.com/deals/msc-cruises-35-off-kids-sail-free.html, /deals/, a sibling deal page and sitemap byte-identical live): up to 35% off for guests 1–2 plus kids 17 and under free as 3rd/4th guests on select sailings, still paying government fees and taxes; deals page says ends Nov 2 (no year), terms say Nov 5, 2026 (listed to Nov 2 with note); port charges and gratuities not stated; family total "check live". Not queued for social (Nov 1 full, ends Nov 2). Hyatt Inclusive Collection kids-stay-free page refused the fetcher (not retried). Reviewer PASS_WITH_P3 (2 fixed, 2 carried).
- 2026-10-28 G05 NCL check delivered 80c0646 (release.json; https://familytripwise.com/deals/norwegian-free-2nd-guest-3rd-4th-free.html, /deals/, sitemap byte-identical live): Free 2nd Guest sale (book Oct 27–Nov 2, 2026, 11:59 pm EST) plus Free at Sea free 3rd/4th guests on select sailings (guests 1–2 at full fare; no ages; taxes for free guests not stated; combining not stated). Not queued for social: its last post day (Nov 1) is full and regenerating Oct 30/31 would churn. Reviewer FAIL→PASS_WITH_P3 (P2 fixed: Nov 2 date scoped via expires_note; 4 P3 fixed; ended banner wording carried).
