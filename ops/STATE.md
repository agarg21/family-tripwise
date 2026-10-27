# STATE (operator working state; keep ≤8 KB; overwrite, don't append)

authority: owner-directed cloud scheduled task; hourly from 2026-10-27 10:00 until 2026-10-30 10:00 ET, then every 4 hours; ends 2026-11-13 17:00 America/New_York
caps: 1 transaction per run; daily_cap=none (owner 2026-10-27: no daily limit; the run cadence and the 90-minute lock are the only throttle)
today: 2026-10-27 transactions=9
run: {id: 2026-10-27T22:04:40Z, started_at: 2026-10-27T22:04:40Z}
last_public_release: e2c408e (2026-10-27, Q06 NYC family hotels: Check live rate, answer box)
active: none

## Holds (one line each: what, unblock condition)
- Orlando admission tariffs observed 2026-10-27; re-observe by 2026-11-10 (the form flags them as older for later visit dates).
- GSC: sitemap resubmitted and indexing requested for the 5 unknown URLs on 2026-10-27 (OWNER.md T1). Check their coverage in the next GSC snapshots; no repeat requests.
- Sitemap lastmod for 21 pages unchanged since the 2026-10-15 import is an estimate (visible date or 2026-10-13 bound); it becomes observed the next time each page changes. No action needed.
- Owner's Mac checkout is stale after 2026-10-27 (its 20 local files are preserved on branch owner-local-2026-10-27). Never commit from the Mac; the operator works only in cloud clones.

## Scoreboard (refresh on Mondays from the newest ops/gsc-snapshots/*.md and live checks)
| Metric | Baseline 2026-10-27 | Target 2026-11-13 |
|---|---|---|
| 28-day organic clicks / impressions | 8 / 3,202 (finalized Sep 27–Oct 24) | report; ≥15 clicks good |
| Sitemap URLs indexed | 31/36; sitemap last read 2026-07-27 | 36/36 or a reason per URL |
| Live pages with past-due dates or past-stay price samples | 7 (8 from Oct 28); 0 since c21010c (Oct 27) | 0 |
| Verified public releases per week (release.json SHA changes) | 0 since Oct 13 (9 on Oct 27: Q01, Q02, Q16, Q02b, Q03, Q04, Q04b, Q05, Q06) | ≥4 |
| Sitemap URLs with <3 internal inbound links | 0 since b14da12 (Oct 27; min 34; tools/site-chrome.test.mjs) | 0 |
| Pages at avg position ≤20 with ≥20 impressions | 5 | ≥7 |

## Last run
- 2026-10-27 Q02b delivered 481658a (release.json + Orlando page + 5 CSVs verified live): Orlando per-fact dates (rates Oct 27, other facts Oct 13), Science Center rate source = official Spanish page, no-JS pointer, stale Eye hours removed; ISO-dated Boston/DC/PV/Cancun-grandparents CSV samples labelled older observations; Cancun CSV "Stay-date status". Reviewer PASS_WITH_P3 x2; P3s queued as Q02c. Remote q/Q02b deletion refused.
- 2026-10-27 Q03 delivered 03f9de1 (release.json, sitemap and 6 pages verified live): every sitemap URL has a content-hash-ledger <lastmod>; Orlando hotels page links to activities; dead Coronado ferry-info link (404) replaced by Flagship operator page on 5 SD pages. Reviewer FAIL(P2 seed)→PASS_WITH_P3. Remote q/Q03 deletion refused.
- 2026-10-27 Q04 delivered b14da12 (release.json + all 36 sitemap pages verified live): one shared header (11 destinations), per-page related guides and an all-guides footer from one registry (tools/page-generation/site-chrome.mjs); min inbound links 34. Reviewer PASS_WITH_P3; aria-current P3 fixed, rest queued as Q04b. Remote q/Q04 deletion refused.
- 2026-10-27 Q04b delivered 15e6d36 (release.json + 34 changed pages + CSS verified live): one skip link to <main id="main"> on all 36 header pages; related-guides align with each layout and keep their size/indent; sitemap lastmod hashes only <main> (ledger migrated, no lastmod moved). Reviewer PASS_WITH_P3; P3s folded into Q02c. Remote q/Q04b, q/Q04b-r deletion refused.
- 2026-10-27 Q05 delivered 39a1262 (release.json, /about.html and / verified live): About and home say guides are AI-assisted research from dated official sources, not firsthand visits; human-verified/human-reviewed claims removed; Last updated Oct 27; tests pin it. Reviewer PASS_WITH_P3 x2 (P3s fixed). Remote q/Q05 deletion refused.
- 2026-10-27 Q06 delivered e2c408e (release.json, NYC hotels page, CSV and CSS verified live): 12 unobserved bands removed; each hotel shows Check live rate + its older Jul 25 two-adult sample; 3-line answer box; FAQ/ItemList/CSV/evidence model agree. No new prices: official booking engines are JS-only. Reviewer PASS_WITH_P3 (1 fixed, 3 to Q02c). Remote q/Q06 deletion refused.
