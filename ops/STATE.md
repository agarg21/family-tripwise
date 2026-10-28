# STATE (operator working state; keep ≤8 KB; overwrite, don't append)

authority: owner-directed cloud scheduled task; hourly from 2026-10-27 10:00 until 2026-10-30 10:00 ET, then every 4 hours; ends 2026-11-13 17:00 America/New_York
caps: 1 transaction per run; daily_cap=none (owner 2026-10-27: no daily limit; the run cadence and the 90-minute lock are the only throttle)
today: 2026-10-28 transactions=1
run: {id: 2026-10-28T05:04:24Z, started_at: 2026-10-28T05:04:24Z}
last_public_release: dfe0a04 (2026-10-28, Q02d small follow-ups)
active: none

## Holds (one line each: what, unblock condition)
- Orlando admission tariffs observed 2026-10-27; re-observe by 2026-11-10 (the form flags them as older for later visit dates).
- GSC: sitemap resubmitted and indexing requested for the 5 unknown URLs on 2026-10-27 (OWNER.md T1). Check their coverage in the next GSC snapshots; no repeat requests.
- Sitemap lastmod for 21 pages unchanged since the 2026-10-15 import is an estimate (visible date or 2026-10-13 bound); it becomes observed the next time each page changes. No action needed.
- DC itinerary official facts observed 2026-10-27 (14-day maintenance clock in tools/site-maintenance.mjs); re-observe before showing them as current after Nov 10. New URL not yet known to Google; no indexing request without an Approved OWNER.md row.
- Boston itinerary official facts observed 2026-10-27 (14-day clock in tools/site-maintenance.mjs); Aquarium prices and MBTA adult fares unknown (ticket site JS-only; mbta.com robots.txt blocks AI agents, do not fetch). New URL not yet known to Google; no indexing request without an Approved OWNER.md row.
- Remote branches q/Q02b…q/Q15b, q/Q02c, q/Q02d, q/Q07 and q/Q08 remain because remote deletion is refused; harmless.
- Owner's Mac checkout is stale after 2026-10-27 (its 20 local files are preserved on branch owner-local-2026-10-27). Never commit from the Mac; the operator works only in cloud clones.

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
- 2026-10-28 Q02d delivered dfe0a04 (release.json, LV and Boston itineraries, Chicago activities verified live): LV Cost line drops repeated ticket rule; Boston Day 2 older-children wording matches; review-date detector excuses a booking word only as first word after review/recheck; CSV stay-date parser reads day-first dates and throws on unparseable cells; Chicago date-line "·" aria-hidden. Reviewer PASS_WITH_P3 (2 optional regex P3s, not taken: fail-safe/pre-existing).
- 2026-10-27 Q02c delivered 8d42000 (release.json, Chicago and Orlando activities, NYC hotels page + CSV, cancun-resorts.css verified live): review-date detector flags "Review booking prices by …" again; CSV stay checker reads Check-in/Stay dates columns; Leu note and Chicago date line match their real check dates; NYC CSV sample column, shorter Fits; Cancun uses shared skip link. Reviewer PASS_WITH_P3 (1 fixed, rest to Q02d).
- 2026-10-27 Q06 delivered e2c408e (release.json, NYC hotels page, CSV and CSS verified live): 12 unobserved bands removed; each hotel shows Check live rate + its older Jul 25 two-adult sample; 3-line answer box; FAQ/ItemList/CSV/evidence model agree. No new prices: official booking engines are JS-only. Reviewer PASS_WITH_P3 (1 fixed, 3 to Q02c). Remote q/Q06 deletion refused.
- 2026-10-27 Q15 delivered ab7d177 (release.json, new /family-itinerary/washington-dc-with-kids.html, DC hotels link, sitemap and shared footer verified live): 3-day DC plan built on official Natural History, Air and Space, American History, Zoo, Monument and WMATA facts read Oct 27; answer box; venue cards with source + date; maintenance contract. Reviewer FAIL(2 P2)→PASS_WITH_P3 (fixed). Remote q/Q15 deletion refused.
- 2026-10-27 Q07 delivered 530633c (release.json, SD hotels page and new CSV verified live): 11 unobserved bands removed; each hotel shows Check live rate + its older Jul 18/21 one-night sample (party shown or "not recorded"); LEGOLAND package-priced; Homewood official Oct 4 family-suite sample (Nov 8-13) published with unknowns (decision note docs/research/san-diego-hotel-price-display-2026-10-27.md); 3-line answer box; CSV/JSON-LD/evidence model agree. No new fetches. Reviewer FAIL(P2)→PASS_WITH_P3. Remote q/Q07 deletion refused.
- 2026-10-27 Q08 delivered da8b118 (release.json, Chicago hotels page and CSV verified live): 10 unobserved bands removed; each hotel shows Check live rate + its older Jul 23 research-pack Expedia sample (Swissotel/Hilton 'date label unclear'); 3-line answer box; CSV adds party and passed stay-date columns; evidence model, FAQ, ItemList agree. No family-party price exists; no new fetches. Reviewer FAIL(2 P2)→PASS_WITH_P3 (P3 to Q02c). Remote q/Q08 deletion refused.
- 2026-10-27 Q10 delivered 93d9aad (release.json + both itinerary pages verified live): LV and SA itineraries lead with a 3-line answer box and dated official facts (DISCOVERY; DoSeum + Alamo) checked Oct 27. Shark Reef fetch not permitted; not retried. Reviewer PASS_WITH_P3 x2; last P3 folded into Q02c.
