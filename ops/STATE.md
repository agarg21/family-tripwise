# STATE (operator working state; keep ≤8 KB; overwrite, don't append)

authority: owner-directed cloud scheduled task; hourly from 2026-10-27 10:00 until 2026-12-08 10:00 ET (owner 2026-10-29: hourly through the Black Friday deal window), then every 4 hours; ends 2027-01-15 17:00 America/New_York (extended by owner 2026-10-28)
caps: 1 transaction per run; daily_cap=none (owner 2026-10-27: no daily limit; the run cadence and the 90-minute lock are the only throttle)
today: 2026-11-24 transactions=9
run: {id: 2026-11-24T20:05Z, started_at: 2026-11-24T20:05Z}
last_public_release: 74732d96 BF page: Hersheypark 2027 season-pass sale card (read Nov 24)
active: none

## Holds (one line each: what, unblock condition)
- LEGOLAND CA pass: BF $139 to Nov 29 (11-21); FL pass BF $99 to Nov 29; re-read both from Nov 28. CA hotel pkg fetch withdrawn 2x.
- /deals/ checks end Nov 26 (Carnival BF card, unpriced), Nov 27 (Sesame Philly + SeaWorld Orlando, re-read 11-20), Dec 1 (Beaches BF), Dec 2 (LEGOLAND NY, stated), Jan 4 (Club Med); SeaWorld SA + Sesame SD to Nov 29 (read 11-22, no end stated; re-read from Nov 29).
- /this-week/ expires daily: deploy (05:17 UTC) refreshes live; first run each ET day: `node tools/this-week.mjs`, commit. SD kids/teens ticket $ (11-01): re-observe after Dec 1.
- Zernio: FB only. Skips: Six Flags GA P2s; LEGOLAND NY unit_short "by Jan 2"; reword Air and Space, Bronx birds; Gaylord ice! (no $). SeaWorld SA queueable (11-22). Records change → regenerate queue + cards together.
- DC itin. facts 11-20 (due Dec 4); NMNH tips/dining, Zoo summer hours, NMAH hours 11-06; NASM pass FAQ unread.
- Boston itin. facts 11-21 (due Dec 5); Aquarium $, MBTA fares unknown (mbta.com robots blocks AI).
- SD December Nights: Getting There PDF from Dec 1.
- SD Christmas page: prices hide Dec 2-5 (SeaWorld Dec 15, Nov 15 price); from Nov 28. Orlando: Nutcracker unpriced (Nov 25); Magic Show $ (Jan 2 page) hides Dec 22, re-read Nov 29; Crayola/Gatorland $ hide Dec 21, rest Dec 3-5; Mickey's party ends Dec 22. SA Christmas page: SeaWorld price hides Dec 2, rest Dec 5; Zoo Lights priced 2120d18e ($ hides Dec 9-11); caverns $ hides ~Dec 11 (hours/parking: from Nov 18). DC: TWB re-read from Nov 27; NPS tree no viewing dates (Nov 25); Enchant free-kid nights live (drop Dec 10), ticket $ JS-only; ice! price JS-only.
- NYC Christmas page: Bryant Park Santa start (Dec 14/15) Nov 26; prices hide Dec 4 (Bronx Zoo hides Dec 14); Nov 25. Grand Central trains: from Nov 28. Santa selfies hours: re-read bfplny Nov 26. Chicago page: ZooLights read 11-20 ($ hide Dec 20; self-reword confirmed 11-24); CTA holiday fleet news line drops Nov 28, card Dec 23; Garfield + Lightscape tickets Nov 25; prices hide Dec 5 (Metra Dec 14), Nov 26; parade time conflict shown; re-read Nov 25.
- Holiday parks: re-read other $ before Nov 29 (GE $49 live 11-19; GE event page fetch withdrawn, re-read Nov 26). Dyker: from Nov 27.
- JetBlue bag card: expires Dec 2; re-read legal/fees Nov 25 to extend through Jan 18 peak.
- LV Glittering Lights: $ hides Dec 22 (re-read before); Santa Tram nights undated (conflict).
- Cancun, PV: regenerate Dec 18, 25, Jan 15 (PV example-stay by Jan 8); SD/NYC/Orlando/London listings Jan 8.
- NYC teens: High Line re-read Dec 1; broadway.org, NYC Parks July 26. Orlando kids: facts 11-20 (Disney Springs parking line: re-read or soften); next Dec 4.
- SD itin.: zoo hours to Nov 25; Balboa parking to end 2026. SeaWorld SD $ (11-15) on all SD pages.
- Q19: LV/Chicago/SA Jan 19 prices: regenerate by Jan 12. Hotel study: Xmas drops Dec 18, NY Dec 25.
- G18 hotels: regenerate by Dec 18, 25, Jan 15 (guard tests); NYC/Chi/SD/SA Nov 21; others Nov 22.
- Six Flags Silver: GE/GA/FT end Nov 27.
- DC ZooLights read Nov 10: re-read before queueing after Nov 24. Busch Fun Cards: Tampa ($94.99) + Williamsburg ($113.99) read 11-20, listed to Nov 27; re-read from Nov 27. NYC lantern: no age $ or end date (11-22; Queens end Nov 26). Polar Express: peak trains/times still unstated (11-22; from Nov 29). Herald carousel re-read 11-22 (next from Nov 29).
- SA Briscoe (read 11-22): drops after Dec 6.
- SA kids: Morgan's closed through at least Dec 5 (11-22); re-read from Nov 29. SA teens: Holiday in the Park line drops by Jan 5. Bass Pro Santa card lines drop themselves; ends Dec 24.
- Event markup: Boston drops Nov 28; DC Dec 5.
- Jay Peak: $ hide Dec 17. Stowe: $ hide Dec 17; opening TBD (hours fetch not granted 11-23; from Nov 24). Club Med BF: retry Dec 1.
- Schweitzer held (no photo). Holiday Valley: chip Nov 27; $ hide Dec 16; hours page 2025-26.
- Deer Valley: chip Dec 5; ticket $ JS-only (try now); home/hours Dec 1. Pops: no $ (11-22); Nov 29.
- Killington: tubing $ hide Dec 17; day ticket $ unread.
- Stratton: $ hide Dec 16; opening postponed, no date (11-23; re-read from Nov 30). Seven Springs: status re-read 11-24 unchanged (0/14, no opening day); chip hides Dec 2, re-read from Dec 1; parking $ hide ~Dec 17.
- Breckenridge: childcare $ hide Dec 17; hours read 11-24 (no season dates; status line held: needs short lead). Park City: opens Nov 25 (read 11-24); $ hide Dec 17; re-read home/parking.
- Vail: $ hide Dec 17; childcare line Nov 24. Keystone: re-read hours (tubing, lifts) Nov 24. Copper: re-read tubing, tickets Nov 24.
- Crested Butte: hours re-read 11-24 (Nov 25 unchanged); basecamp from Nov 24. Snowbird: neutral chip Nov 27; $ hide Dec 17; re-read opening/tickets. Alta: opening re-read 11-24 (neutral chip); tickets unread. Mt Bachelor: opening target:true by Dec 4.
- Jackson Hole: chip Nov 27; parking $ last winter's (Nov 24); Kids on Snow drops Dec 13.
- G19 West Nov 24: Timberline tickets/opening; Heavenly hours (chip Nov 20); Mt Bachelor hours, childcare/tubing $; Telluride /ski/ (chip Nov 26, $ Dec 17); Bogus Basin opening/hours/tubing/bus ($ Dec 17); Winter Park tubing + kids $ (status Nov 24, $ Dec 17); Kirkwood hours/tickets/parking; Northstar hours, tickets (chip Nov 20; parking $ 2026/27); Stevens Pass hours (TBD 11-17; target Dec 4); Wolf Creek note hides Nov 25 (re-read from Nov 25).
- Villa del Palmar BF: re-read Nov 28 (meta Nov 23-29). Atlantis Cyber Sale (read 11-23, page only, unpriced): ends Dec 8; re-read from Nov 30.
- Epic Universe passes: no price (11-19); re-search Nov 28.
- Metra extra Holiday Train (Dec 20, search only): metra.com client_error 11-23/24, no retry.
- Ski chips: Mt Snow 11-30, Windham 11-29. Faneuil Santa Nov 25. Christkindlmarket Nov 28.
- Macy's parade + subway lines drop after Nov 26. Menorah: NYC drops Dec 12 (Manhattan: no 2026 organizer schedule found 11-23; re-search Nov 26); DC Dec 6 tickets unread.
- Boston Frog Pond: /ice-skating/ client_error 11-22; no dates/$; re-search Nov 29.
- Domino rink: no $ (11-22); from Nov 29. Fifth Ave car-free Dec 13: no 2026 nyc.gov notice (11-19); from Nov 30.
- No 2026 page: Union Sq, Blue Man Chi, TRU GC (Nov 26). AIC lion wreaths: no 2026 artic.edu page (Nov 26). SI Mall rink: news only (Nov 29).
- Saks show: no official times/end (11-24); PRN release from Nov 28. Disney dining (to Nov 30): en_CA client_error 11-21. Chanukah on Ice: zeffy error; Nov 28.
- NYE row 10: SA pages unreadable 11-23; Nov 30 (Hemisfair Kids Countdown Dec 31 on SA card, 11-24).
- /this-week/ Mingei (drops Dec 7).
- Hersheypark BF card (11-24): lists to Nov 30; re-read from Dec 1.
- Goodman Carol (11-23): no $; re-read from Nov 30 (prices, access dates).
- SA Hemisfair card (11-24): no $; kid lines drop themselves; ends Dec 31. SA Nutcracker drops after Dec 13. SA Grinch: $ hide ~Dec 19; drops Dec 24.

## Scoreboard (refresh on Mondays from the newest ops/gsc-snapshots/*.md and live checks)
| Metric | Baseline 2026-10-27 | Target 2026-11-13 |
|---|---|---|
| 28-day clicks / impr. | 8 / 3,202 (Sep 27–Oct 24) | ≥15; 17 / 4,420 to Nov 10 |
| Sitemap URLs indexed | 31/36; 11-12: 77/77 priority | all or a reason |
| Past-due dates/samples | 7; 0 since Oct 27 | 0 |
| URLs <3 inbound links | 0 since Oct 27 | 0 |
| Pages avg pos ≤20, ≥20 impr. | 5; 4 in 11-12 snapshot | ≥7 |

## Last run
- 11-24 19:05Z G16 BF page: Hersheypark 2027 pass sale card (save ~$244 for 4 at shown prices), live 74732d96. Merged owner image commit 251ab9d4 (fixed red test).
