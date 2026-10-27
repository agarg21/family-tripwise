# STATE (operator working state; keep ≤8 KB; overwrite, don't append)

authority: owner-directed cloud scheduled task; hourly from 2026-10-27 10:00 until 2026-10-30 10:00 ET, then every 4 hours; ends 2026-11-13 17:00 America/New_York
caps: 1 transaction per run; daily_cap=none (owner 2026-10-27: no daily limit; the run cadence and the 90-minute lock are the only throttle)
today: 2026-10-27 transactions=6
run: none
last_public_release: b14da12 (2026-10-27, Q04 shared header, related guides, all-guides footer)
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
| Verified public releases per week (release.json SHA changes) | 0 since Oct 13 (6 on Oct 27: Q01, Q02, Q16, Q02b, Q03, Q04) | ≥4 |
| Sitemap URLs with <3 internal inbound links | 0 since b14da12 (Oct 27; min 34; tools/site-chrome.test.mjs) | 0 |
| Pages at avg position ≤20 with ≥20 impressions | 5 | ≥7 |

## Last run
- 2026-10-27 setup session: four independent reviews + judge (summary in ops/runs/2026-10.md); archived Codex-era logs to archive/2026-10/; replaced governance tests with tools/ops-state.test.mjs; created STATE/QUEUE/OWNER; GSC snapshot cadence Mon/Thu.
- 2026-10-27 Q01 delivered: Orlando admission form live at https://familytripwise.com/things-to-do/orlando-with-kids.html (release.json 32f4024; reviewer PASS_WITH_P3 x2; P3 follow-ups folded into Q02).
- 2026-10-27 Q02 delivered c21010c: no forward review/recheck dates on 8 pages + downloads; Cancun past-stay samples labelled; seo-qa guards added. Reviewer FAIL→PASS_WITH_P3 (2 cycles). Remote branch q/Q02 deletion refused; left in place.
- 2026-10-27 Q16 delivered 2dca9b4 (release.json + 7 pages/2 downloads verified): Nov 8-13/Nov 9-12 samples carry date-independent "older observation" labels from generators; Cancun no longer reads the build date; tests + seo-qa clean at now=Nov 14. PV forward review-by sentence removed. Reviewer PASS_WITH_P3 x2; P3s folded into Q02b.
- 2026-10-27 Q02b delivered 481658a (release.json + Orlando page + 5 CSVs verified live): Orlando per-fact dates (rates Oct 27, other facts Oct 13), Science Center rate source = official Spanish page, no-JS pointer, stale Eye hours removed; ISO-dated Boston/DC/PV/Cancun-grandparents CSV samples labelled older observations; Cancun CSV "Stay-date status". Reviewer PASS_WITH_P3 x2; P3s queued as Q02c. Remote q/Q02b deletion refused.
- 2026-10-27 Q03 delivered 03f9de1 (release.json, sitemap and 6 pages verified live): every sitemap URL has a content-hash-ledger <lastmod>; Orlando hotels page links to activities; dead Coronado ferry-info link (404) replaced by Flagship operator page on 5 SD pages. Reviewer FAIL(P2 seed)→PASS_WITH_P3. Remote q/Q03 deletion refused.
- 2026-10-27 Q04 delivered b14da12 (release.json + all 36 sitemap pages verified live): one shared header (11 destinations), per-page related guides and an all-guides footer from one registry (tools/page-generation/site-chrome.mjs); min inbound links 34. Reviewer PASS_WITH_P3; aria-current P3 fixed, rest queued as Q04b. Remote q/Q04 deletion refused.
