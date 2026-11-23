# STATE (operator working state; keep ≤8 KB; overwrite, don't append)

authority: owner-directed cloud scheduled task; hourly from 2026-10-27 10:00 until 2026-12-08 10:00 ET (owner 2026-10-29: hourly through the Black Friday deal window), then every 4 hours; ends 2027-01-15 17:00 America/New_York (extended by owner 2026-10-28)
caps: 1 transaction per run; daily_cap=none (owner 2026-10-27: no daily limit; the run cadence and the 90-minute lock are the only throttle)
today: 2026-11-22 transactions=22
run: none
last_public_release: 42c3a695 G16 NYC parade Good-to-know plainer
active: none

## Holds (one line each: what, unblock condition)
- LEGOLAND CA pass: BF $139 to Nov 29 (11-21); FL pass BF $99 to Nov 29 (11-21, end date from BF page 11-20); re-read both from Nov 28. CA hotel pkg fetch withdrawn 2x.
- /deals/ checks end Nov 26 (Carnival BF card, unpriced), Nov 27 (Sesame Philly + SeaWorld Orlando, re-read 11-20; banner file names say 11-16 to 11-23), Dec 1 (Beaches BF), Dec 2 (LEGOLAND NY, stated), Jan 4 (Club Med); SeaWorld SA + Sesame SD to Nov 29 (read 11-22, no end stated; re-read from Nov 29).
- /this-week/ expires daily: deploy (05:17 UTC) refreshes live; re-render the committed copy (`node tools/this-week.mjs`, commit) on the first run each Eastern day or tests fail. SD kids/teens ticket $ (11-01): re-observe after Dec 1.
- Zernio: FB only. Skips: Six Flags GA (Great America P2s), LEGOLAND NY unit_short; reword Dan Ryan, Air and Space, Bronx birds; SeaWorld SA re-read 11-22 (queueable); Gaylord ice! (no $, read Nov 9); LEGOLAND NY unit_short "by Jan 2". Records change → regenerate queue + cards together.
- DC itin. facts 11-20 (due Dec 4); NMNH tips/dining, Zoo summer hours, NMAH hours 11-06; NASM pass FAQ unread.
- Boston itin. facts re-read 11-21 (due Dec 5); Aquarium $, MBTA fares unknown (mbta.com robots blocks AI: don't fetch).
- SD Christmas page: prices hide Dec 2-5; from Nov 28. Orlando: Nutcracker unpriced (Nov 25); Magic Show $ (Jan 2 page) hides Dec 22, re-read Nov 29; Crayola/Gatorland $ hide Dec 21, rest Dec 3-5; Mickey's party ends Dec 22. SA Christmas page: SeaWorld price hides Dec 2, rest Dec 5; Zoo Lights priced 2120d18e ($ hides Dec 9-11); caverns $ hides ~Dec 11 (hours/parking: from Nov 18). DC: TWB re-read from Nov 27; NPS tree no viewing dates (Nov 25); Enchant free-kid nights live (drop Dec 10), ticket $ JS-only; ice! price JS-only.
- NYC Christmas page: Bryant Park Santa start (Dec 14/15) Nov 26; prices hide Dec 4 (Bronx Zoo hides Dec 14); Nov 25. Grand Central trains: Nov 30 our window; from Nov 28. Santa selfies hours: re-read bfplny Nov 26. Chicago page: ZooLights read 11-20 ($ hide Dec 20; /this-week/ item self-rewords Nov 24: confirm); CTA holiday fleet news line drops Nov 28, card Dec 23; Garfield + Lightscape tickets Nov 25; prices hide Dec 5 (Metra Dec 14), Nov 26; parade time conflict shown; re-read Nov 25.
- Holiday parks: re-read other $ before Nov 29 (GE $49 live 11-19; GE event page fetch withdrawn, re-read Nov 26). Dyker: from Nov 27.
- SD/NYC/Orlando/London Google listings leave Jan 8: regenerate.
- JetBlue bag card: expires Dec 2; re-read legal/fees Nov 25 to extend through Jan 18 peak.
- LV Glittering Lights: $ hides Dec 22 (re-read before); Santa Tram nights undated (conflict).
- Cancun, PV: regenerate Dec 18, 25, Jan 15 (PV example-stay by Jan 8).
- NYC teens: High Line re-read Dec 1; broadway.org, NYC Parks July 26. Orlando with kids: official facts read 11-20 (Disney Springs 11-06, stub on 11-20: re-read or soften parking line); next from Dec 4.
- SD itin.: zoo hours to Nov 25; Balboa parking to end 2026.
- Q19: LV/Chicago/SA Jan 19 prices: regenerate by Jan 12. Hotel study: Xmas drops Dec 18, NY Dec 25.
- G18 hotels: regenerate by Dec 18, 25, Jan 15 (guard tests); NYC/Chi/SD/SA Nov 21; others Nov 22.
- Six Flags Silver: GE, GA, FT end Nov 27 (read 11-19).
- DC ZooLights read Nov 10: re-read before queueing after Nov 24. Busch Fun Cards: Tampa ($94.99) + Williamsburg ($113.99) read 11-20, listed to Nov 27; re-read from Nov 27. NYC lantern: no age $ or end date (11-22; Queens end Nov 26). Polar Express: peak trains/times still unstated (11-22; from Nov 29). Herald carousel re-read 11-22 (next from Nov 29).
- SA Briscoe (read 11-22): drops after Dec 6.
- SA kids: Morgan's closed through at least Dec 5 (11-22); re-read from Nov 29. SA teens: Holiday in the Park line drops by Jan 5. Bass Pro Santa card lines drop themselves; ends Dec 24.
- Event markup: Boston drops Nov 28; DC Wharf + Mt Vernon Dec 5 (re-read by Dec 4).
- Jay Peak page: prices hide Dec 17 (re-read before). Stowe: $ hide Dec 17; opening TBD (Nov 23).
- G19: Schweitzer held (no winter photo). Holiday Valley: chip Nov 27; $ hide Dec 16; re-read tickets/tubing/hours Nov 23.
- Deer Valley: chip Dec 5; ticket $ JS-only (try now); home/hours Dec 1. Pops: no $ (11-22); Nov 29.
- Killington: tubing $ hide Dec 17; day ticket $ unread.
- Stratton: $ hide Dec 16; opening Nov 25 projected (Nov 23). Seven Springs: chip hides Nov 25; re-read hours/status Nov 24 (read 11-17, weekly limit); parking $ hide ~Dec 17.
- Breckenridge: childcare $ hide Dec 17; status hides Nov 24 (re-read home/hours). Park City: opens Nov 20 (chip flips itself); status hides Nov 24, $ Dec 17; re-read home/hours/parking Nov 24.
- Vail: $ hide Dec 17; childcare line Nov 24. Keystone: re-read hours (tubing, lifts) Nov 24. Copper: re-read tubing, tickets Nov 24.
- Crested Butte: chip flips Nov 25; re-read hours/basecamp Nov 24. Snowbird: chip flips Nov 27 (tentative); $ hide Dec 17; re-read opening/tickets Nov 24. Alta: chip flips Nov 25; no ticket $ posted; re-read opening, tickets Nov 24.
- Jackson Hole: chip Nov 27; parking $ last winter's (Nov 24); Kids on Snow drops Dec 13.
- G19 West Nov 24: Timberline tickets/opening; Heavenly hours (chip Nov 20); Mt Bachelor hours, childcare/tubing $; Telluride /ski/ (chip Nov 26, $ Dec 17); Bogus Basin opening/hours/tubing/bus ($ Dec 17); Winter Park tubing + kids $ (status Nov 24, $ Dec 17); Kirkwood hours/tickets/parking; Northstar hours, tickets (chip Nov 20; parking $ 2026/27); Stevens Pass hours (TBD 11-17; target Dec 4); Wolf Creek note hides Nov 25 (Nov 24).
- Villa del Palmar BF: re-read Nov 28 (meta Nov 23-29).
- Epic Universe passes: no price/sale date (11-19 post); re-search from Nov 28.
- Ski chips: Mount Snow 11-23, Windham 11-29 (Hunter: status/event pages blocked, hours page 11-22). Faneuil Santa: Nov 25. Christkindlmarket: hours/stroller unread; re-search from Nov 28; heads-up drops Nov 25.
- Macy's parade: DOT advisory 11-22 (no streets/times); spots unnamed; Bloomingdale's: no 2026 release (11-22). Menorah: NYC drops Dec 12 (Manhattan times unread); DC Dec 6 tickets unread.
- Boston Frog Pond skating: /ice-skating/ client_error 11-22 (no retry); general-info has no dates/$; re-search from Nov 29.
- Domino rink: no $ (11-22); from Nov 29. Fifth Ave car-free Dec 13: no 2026 nyc.gov notice (11-19); from Nov 30.
- No 2026 page (11-19): Union Sq, Blue Man Chi, Toys"R"Us GC (Nov 26). AMNH Dec 10.
- Saks show: times/end Nov 24. Disney kids dining (to Nov 30): en_CA client_error 11-21. Chanukah on Ice: zeffy error; Nov 28.
- SA Nutcracker card (11-18): drops after Dec 13. SA Grinch (Magik, 11-19): $ hide ~Dec 19; drops after Dec 24.

## Scoreboard (refresh on Mondays from the newest ops/gsc-snapshots/*.md and live checks)
| Metric | Baseline 2026-10-27 | Target 2026-11-13 |
|---|---|---|
| 28-day clicks / impr. | 8 / 3,202 (Sep 27–Oct 24) | ≥15; 17 / 4,420 to Nov 10 |
| Sitemap URLs indexed | 31/36 at baseline; 11-12: 77/77 priority | 36/36 or a reason per URL |
| Pages with past-due dates/samples | 7; 0 since Oct 27 | 0 |
| Verified releases/week (release.json) | many daily since Nov 2 | ≥4 |
| Sitemap URLs <3 inbound links | 0 since b14da12 (Oct 27) | 0 |
| Pages avg pos ≤20, ≥20 impr. | 5; 4 in 11-12 snapshot | ≥7 |

## Last run
- 11-23 02:04Z G16 parade card Good-to-know plainer (Manhattan; police decide closures). Frog Pond skating lead: /ice-skating/ client_error, no card. Reviews: integrity P3, persona 3.92, design 4.0. Live 42c3a695.
