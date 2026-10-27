# STATE (operator working state; keep ≤8 KB; overwrite, don't append)

authority: owner-directed cloud scheduled task; hourly from 2026-10-27 10:00 until 2026-10-30 10:00 ET, then every 4 hours; ends 2026-11-13 17:00 America/New_York
caps: 1 transaction per run; daily_cap=none (owner 2026-10-27: no daily limit; the run cadence and the 90-minute lock are the only throttle)
today: 2026-10-27 transactions=2
run: {id: 2026-10-27T15:06:34Z, started_at: 2026-10-27T15:06:34Z}
last_public_release: c21010c (2026-10-27, Q02 staleness sweep)
active: none

## Holds (one line each: what, unblock condition)
- Nov 8/9 example stays (7 lodging pages + downloads) pass soon: Q16 must ship by 2026-11-07 or seo-qa/tests go red.
- Orlando admission tariffs observed 2026-10-27; re-observe by 2026-11-10 (the form flags them as older for later visit dates).
- GSC: sitemap resubmitted and indexing requested for the 5 unknown URLs on 2026-10-27 (OWNER.md T1). Check their coverage in the next GSC snapshots; no repeat requests.
- Owner's Mac checkout is stale after 2026-10-27 (its 20 local files are preserved on branch owner-local-2026-10-27). Never commit from the Mac; the operator works only in cloud clones.

## Scoreboard (refresh on Mondays from the newest ops/gsc-snapshots/*.md and live checks)
| Metric | Baseline 2026-10-27 | Target 2026-11-13 |
|---|---|---|
| 28-day organic clicks / impressions | 8 / 3,202 (finalized Sep 27–Oct 24) | report; ≥15 clicks good |
| Sitemap URLs indexed | 31/36; sitemap last read 2026-07-27 | 36/36 or a reason per URL |
| Live pages with past-due dates or past-stay price samples | 7 (8 from Oct 28); 0 since c21010c (Oct 27) | 0 |
| Verified public releases per week (release.json SHA changes) | 0 since Oct 13 (2 on Oct 27: Q01, Q02) | ≥4 |
| Sitemap URLs with <3 internal inbound links | 7 | 0 |
| Pages at avg position ≤20 with ≥20 impressions | 5 | ≥7 |

## Last run
- 2026-10-27 setup session: four independent reviews + judge (summary in ops/runs/2026-10.md); archived Codex-era logs to archive/2026-10/; replaced governance tests with tools/ops-state.test.mjs; created STATE/QUEUE/OWNER; GSC snapshot cadence Mon/Thu.
- 2026-10-27 Q01 delivered: Orlando admission form live at https://familytripwise.com/things-to-do/orlando-with-kids.html (release.json 32f4024; reviewer PASS_WITH_P3 x2; P3 follow-ups folded into Q02).
- 2026-10-27 Q02 delivered c21010c: no forward review/recheck dates on 8 pages + downloads; Cancun past-stay samples labelled; seo-qa guards added. Reviewer FAIL→PASS_WITH_P3 (2 cycles). Remote branch q/Q02 deletion refused; left in place.
