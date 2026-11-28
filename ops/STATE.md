# STATE (operator working state; keep ≤8 KB; overwrite, don't append)

authority: owner-directed cloud scheduled task; hourly from 2026-10-27 10:00 until 2026-12-08 10:00 ET (owner 2026-10-29: hourly through the Black Friday deal window), then every 4 hours; ends 2027-01-15 17:00 America/New_York (extended by owner 2026-10-28)
caps: 1 transaction per run; daily_cap=none (owner 2026-10-27: no daily limit; the run cadence and the 90-minute lock are the only throttle)
today: 2026-11-28 transactions=6
run: none
last_public_release: eaec8c63 G09w Six Flags Silver Pass BF extended to Nov 30 (release.json 14:5xZ Nov 28)
active: {id: G09w-swo, branch: q/G09w-swo-nov28, next: after 12:00 ET Nov 28 read seaworld.com/orlando/ (home, unread) once; if the Black Friday Fun Card $104.99 still shows, reword "just after midnight ET" to that read time, re-run 3 reviews, release; if gone, drop branch}

## Holds (what, unblock)
- Dated holds and re-reads: ops/HOLDS.md. Each run: `node tools/holds-due.mjs` (prints only what is due today ET).
- Each run: if https://familytripwise.com/release.json sha is newer than last_public_release (owner-session releases skip STATE), record it.
- Atlantis BF: branch q/G09w-atlantis-bf (Dec 8 -> Nov 29, watch 11-27); persona 3.47. Unblock: O53 yes -> merge; else read Nov 30.
- /this-week/: first run each ET day `node tools/this-week.mjs`, commit (deploy refreshes live). SD kids/teens ticket $ (11-01): re-observe after Dec 1.
- Zernio: FB only. Skips: Six Flags GA P2s; LEGOLAND NY unit_short "by Jan 2"; reword Air and Space, Bronx birds; Gaylord ice! (no $). SeaWorld SA queueable (11-22).
- GSC: Nov 30 11:00Z snapshot committed?

## Scoreboard (Mondays: newest ops/gsc-snapshots/*.md + live checks)
| Metric | Baseline 2026-10-27 | Target 2026-11-13 |
|---|---|---|
| 28-day clicks / impr. | 8 / 3,202 | ≥15; 33 / 6,013 to Nov 24 |
| Sitemap URLs indexed | 31/36; 11-12: 77/77 priority | all or a reason |
| Past-due dates/samples | 7; 0 since Oct 27 | 0 |
| URLs <3 inbound links | 0 since Oct 27 | 0 |
| Pages avg pos ≤20, ≥20 impr. | 5; 4 in 11-12 snapshot | ≥7 |

## Last run
- 11-28 14:05Z G09w: Six Flags GE/FT/GA Black Friday Silver Pass extended to Nov 30 (watcher 13:13Z + Daily Tickets reads); 3 checks re-listed, save 19/23/50%; live eaec8c63. GE/FT Daily Tickets still said 11/27 (conflict shown). Macy's trend flag closed (already on NYC page). Left flags: Club Med countdown (noise), Great Wolf BOGO one-day extension, SeaWorld Orlando Cyber Monday (fold into active G09w-swo after 12:00 ET).
