# STATE (operator working state; keep ≤8 KB; overwrite, don't append)

authority: owner-directed cloud scheduled task; hourly from 2026-10-27 10:00 until 2026-10-30 10:00 ET, then every 4 hours; ends 2027-01-15 17:00 America/New_York (extended by owner 2026-10-28)
caps: 1 transaction per run; daily_cap=none (owner 2026-10-27: no daily limit; the run cadence and the 90-minute lock are the only throttle)
today: 2026-10-28 transactions=14
run: none
last_public_release: 9e7f1f1 (2026-10-28, G03 social queue + first 3 cards)
active: none

## Holds (one line each: what, unblock condition)
- /deals/ checks end Oct 31 (Beaches), Nov 1 (Great Wolf; year is our reading), Nov 2 (Royal Caribbean), Jan 6 (Club Med); tools/this-week.mjs re-renders deal pages daily too, and the committed deal pages must match today's render or tests fail.
- /this-week/ items expire daily: the deploy workflow (daily 05:17 UTC) refreshes the live copy, but the committed site/this-week/index.html must be re-rendered (`node tools/this-week.mjs`, commit) on the first run each Eastern day or `node --test` fails the committed-page test. Next item expiry: Nov 4 (DC lottery).
- Social queue: ops/social-queue/2026-10-29.json (Beaches, Great Wolf, Royal Caribbean) is the only queue; nothing posts until G04 and the owner's secrets (T3). While a queue date is today or later, tools/social-queue.test.mjs fails if its records change: regenerate the queue (and cards) in the same commit. Queue Oct 30+ in G05.
- Growth-first since 2026-10-28 (OWNER D10–D12): work G items before old Q items, except live-site defects and the Q17b deadline. Posting waits for the owner's accounts and GitHub secrets (T3).
- Orlando admission tariffs observed 2026-10-27; re-observe by 2026-11-10 (the form flags them as older for later visit dates).
- GSC: sitemap resubmitted and indexing requested for the 5 unknown URLs on 2026-10-27 (OWNER.md T1). Check their coverage in the next GSC snapshots; no repeat requests.
- Sitemap lastmod for 21 pages unchanged since the 2026-10-15 import is an estimate (visible date or 2026-10-13 bound); it becomes observed the next time each page changes. No action needed.
- DC itinerary official facts observed 2026-10-27 (14-day maintenance clock in tools/site-maintenance.mjs); re-observe before showing them as current after Nov 10. New URL not yet known to Google; no indexing request without an Approved OWNER.md row.
- Boston itinerary official facts observed 2026-10-27 (14-day clock in tools/site-maintenance.mjs); Aquarium prices and MBTA adult fares unknown (ticket site JS-only; mbta.com robots.txt blocks AI agents, do not fetch). New URL not yet known to Google; no indexing request without an Approved OWNER.md row.
- Remote branches q/Q02b…q/Q15b, q/Q02c, q/Q02d, q/Q07, q/Q08, q/Q09, q/Q09b, q/Q09c, q/Q09c-dc, q/Q09c-cancun, q/Q09c-london, q/Q09c-orlando, q/G02 and q/G03 remain because remote deletion is refused; harmless.
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
- 2026-10-28 G03 delivered 9e7f1f1 (release.json; 3 card JPEGs byte-identical live at /social/cards/): social queue generator (every paragraph copied from verified records, deal headlines always kept, 3 units/day off-season and 6 Nov–Dec, per-platform caps, posting stops 00:00 ET on the last day), typographic 1080x1350 cards rendered in Chromium, validator test; first queue for Oct 29. Reviewer FAIL (3 P2: a.m. sentence cuts, last-day deadlines, live-data test fixtures) → PASS_WITH_P3. No posting.
- 2026-10-28 G02 delivered 2d152bb (release.json; /deals/ hub, 4 check pages, sitemap, styles and a sample guide byte-identical live): Family Deal Checks for Royal Caribbean Kids Sail Free/3rd-4th guests, Great Wolf Fall Flash Sale, Beaches First Passport credit, Club Med kids-under-4 offer; terms read on official pages Oct 28, no family totals (none observed), ended checks leave the hub and say "This offer ended"; "Deals" header link on every page. Reviewer FAIL (4 P2 wording vs record) → PASS_WITH_P3.
- 2026-10-28 G01 delivered 925b244 (release.json; /this-week/, styles.css, sitemap and a sample guide byte-identical live): new /this-week/ page with 10 officially checked holiday items in 7 cities (DC, Orlando, London, Chicago, NYC, Boston x3, San Antonio, San Diego), each with check date, official link and expiry; "This week" header link and a per-city link on every guide; daily deploy-workflow refresh drops expired items. Reviewer FAIL(P2 unrecorded Hyde Park/Disney details, fixed in the record)→PASS_WITH_P3.
- 2026-10-28 Q17a research decision (no site change): Cabana Bay booking engine robots-disallowed to the fetcher (a direct request was refused as bot-check circumvention, not retried); Radio City and Marlin show no dated rate without a booking-engine date search. Q17a closed; all 15 Nov 8-13 amounts go to Q17b; O2 updated.
- 2026-10-28 Q17 research decision (no site change): official booking engines checked via robots.txt only. Hilton, Marriott, Disney, Wyndham, SynXis, ASR and Garza Blanca disallow booking paths; IHG is bot-protected. Only Cabana Bay, Radio City Apartments and two Marlin apartments can be re-observed (Q17a, stay Jan 10-15, 2027); the other 11 amounts come off by Nov 7 unless the owner supplies observations (Q17b, O2). Deadline corrected to arrival Nov 8.
- 2026-10-28 Q09c-Orlando delivered ccf65d8 (release.json; Orlando hotels page, orlando-suites.css and model byte-identical live): nightly samples labelled by plan in the overview table; five-night totals in per-suite tables (IHG shared USD270.00 resort-fee line once); source, deposit, tax/fee, currency and limits moved word for word into collapsed "How we checked <hotel>" blocks. Reviewer PASS_WITH_P3 (6 P3s queued in Q09c).
- 2026-10-28 Q09c-London delivered 1e03f62 (release.json; London apartments page and styles.css byte-identical live): each dated GBP amount shown once (nightly samples, now labelled by plan, in the comparison table; five-night totals in per-apartment plan tables); source, party, tax/fee and payment basis moved word for word into collapsed "How we checked <apartment>" blocks and a page block; missing period after capacity conditions fixed. Reviewer FAIL(P2 unlabelled plan rates)→PASS_WITH_P3 (3 P3s queued in Q09c).
