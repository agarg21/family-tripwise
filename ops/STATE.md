# STATE (operator working state; keep ≤8 KB; overwrite, don't append)

authority: owner-directed cloud scheduled task; hourly from 2026-10-27 10:00 until 2026-12-08 10:00 ET (owner 2026-10-29: hourly through the Black Friday deal window), then every 4 hours; ends 2027-01-15 17:00 America/New_York (extended by owner 2026-10-28)
caps: 1 transaction per run; daily_cap=none (owner 2026-10-27: no daily limit; the run cadence and the 90-minute lock are the only throttle)
today: 2026-11-27 transactions=1
run: {id: 2026-11-27T06:05:07Z, started_at: 2026-11-27T06:05:07Z}
last_public_release: a160221a G09w Busch Tampa Fun Card re-read; Williamsburg unlisted (Nov 27)
active: none

## Holds (one line each: what, unblock)
- LEGOLAND CA pass: BF $139 to Nov 29 (11-21); FL pass BF $99 to Nov 29; re-read both from Nov 28. CA hotel pkg fetch withdrawn 2x.
- /deals/ checks end Nov 27 (Sesame Philly; SWO read 11-26, files say Nov 27: from Nov 28), Dec 1 (Beaches BF), Dec 2 (LEGOLAND NY, stated), Jan 4 (Club Med); SeaWorld SA + Sesame SD to Nov 29 (read 11-22, no end stated; from Nov 29).
- /this-week/ expires daily: deploy (05:17 UTC) refreshes live; first run each ET day: `node tools/this-week.mjs`, commit. SD kids/teens ticket $ (11-01): re-observe after Dec 1.
- Zernio: FB only. Skips: Six Flags GA P2s; LEGOLAND NY unit_short "by Jan 2"; reword Air and Space, Bronx birds; Gaylord ice! (no $). SeaWorld SA queueable (11-22). Records change → regenerate queue + cards together.
- DC itin. facts 11-20 (due Dec 4); NMNH tips/dining, Zoo summer hours, NMAH hours 11-06; NASM pass FAQ unread.
- Boston itin. facts 11-21 (due Dec 5); Aquarium $, MBTA fares unknown (mbta.com robots blocks AI).
- SD December Nights: Getting There PDF from Dec 1.
- SD Christmas page: prices hide Dec 2-5 (SeaWorld Dec 15, Lightscape Dec 26); from Nov 28. Orlando: Nutcracker unpriced (11-25; Dec 2); Choc. Nutcracker fetch failed 11-25; Magic Show $ (Jan 2 page) hides Dec 22, re-read Nov 29; Crayola/Gatorland $ hide Dec 21, rest Dec 3-5; Mickey's party ends Dec 22. SA Christmas page: SeaWorld price hides Dec 2, rest Dec 5; Zoo Lights priced 2120d18e ($ hides Dec 9-11); caverns $ hides ~Dec 11 (hours/parking: from Nov 18). DC: TWB from Nov 27; NPS tree visits read 11-25; lighting text: edit Dec 4; Enchant free-kid nights live (drop Dec 10), ticket $ JS-only; ice! price JS-only.
- NYC Rockefeller: ceremony page 11-25; viewing hours unread. NYC Christmas page: prices hide Dec 4 (Bronx Zoo 11-25: $ Dec 26, train/parking Dec 15; FAQs from Dec 1); Nov 25. Grand Central trains: from Nov 28. Santa selfies: guide re-read 11-26, still no hours (from Dec 3). Pentatonix card drops after Dec 2. Chicago page: ZooLights read 11-20 ($ hide Dec 20); CTA holiday fleet news line drops Nov 28, card Dec 23; Garfield re-read 11-25 (flower-shows page from Dec 2); Lightscape cue 11-25 (tickets page from Dec 2; EBT page 2025-26); prices hide Dec 5 (Metra Dec 14), Nov 26; parade conflict kept (11-25).
- Holiday parks: re-read other $ by Nov 29 (GE $49 read 11-26; next Dec 3). Dyker: from Nov 27.
- JetBlue bag card: read 11-25 (unchanged), expires Dec 16; re-read legal/fees from Dec 9 to extend through Jan 18.
- LV Glittering Lights: $ hides Dec 22 (re-read before); Santa Tram nights undated (conflict).
- Cancun, PV: regen Dec 18, 25, Jan 15 (PV example-stay Jan 8); SD/NYC/Orlando/London listings Jan 8.
- NYC teens: High Line re-read Dec 1; broadway.org, NYC Parks July 26. Orlando kids: facts 11-20 (Disney Springs parking line: re-read or soften); next Dec 4.
- SD itin.: zoo hours (11-25: only Nov 1-25 shown) from Dec 2; Balboa parking to end 2026. SeaWorld SD $ (11-15) on all SD pages.
- Q19: LV/Chicago/SA Jan 19 prices: regenerate by Jan 12. Hotel study: Xmas drops Dec 18, NY Dec 25.
- G18 hotels: regenerate by Dec 18, 25, Jan 15 (guard tests).
- DC ZooLights (read Nov 10): re-read before queueing. Busch Tampa $94.99 re-read 11-27 (file names say Nov 27; from Nov 28); Williamsburg unlisted 11-27 ($119.99 Oct content). NYC lantern: no age $ or end date (11-22; Queens end Nov 26). Polar Express: peak trains/times unstated (11-22; from Nov 29). Herald carousel re-read 11-22 (next from Nov 29).
- SA Briscoe (read 11-22): drops after Dec 6. Alamo scaffolding news line (notice Nov 23) drops Dec 6; re-read the notice from Dec 1.
- SA kids: Morgan's closed through at least Dec 5 (11-22); from Nov 29. SA teens: Holiday in the Park line drops by Jan 5. Bass Pro Santa card ends Dec 24 (self-drops).
- Jay Peak, Stowe: $ hide Dec 17; Stowe opening TBD (11-25; Dec 2). Club Med BF (page timer ends ~Dec 1): retry Dec 1.
- Holiday Valley: chip Nov 27; $ hide Dec 16; hours page 2025-26. Deer Valley: chip Dec 5; ticket $ JS-only; home/hours Dec 1.
- Killington: tubing $ hide Dec 17; day $ unread. Stratton: $ hide Dec 16; opening postponed, no date (11-23; from Nov 30). Seven Springs: no opening day (11-24); chip hides Dec 2, from Dec 1; parking $ hide ~Dec 17.
- Breckenridge: childcare $ hide Dec 17; hours 11-24 (no season dates; status line held). Park City: target Nov 25 (11-24); status pages not granted 11-25; $ hide Dec 17; from Dec 1.
- Vail $ hide Dec 17; due: Vail childcare, Keystone hours, Copper tubing/tickets. Crested Butte: hours 11-24; basecamp due. Snowbird: neutral chip Nov 27; $ hide Dec 17; re-read opening/tickets. Alta: opening re-read 11-24 (neutral chip); tickets unread. Mt Bachelor: opening target:true by Dec 4.
- Jackson Hole: chip Nov 27; parking $ last winter's; Kids on Snow drops Dec 13.
- G19 West Nov 24: Timberline tickets/opening; Heavenly hours (chip Nov 20); Mt Bachelor hours/childcare/tubing $; Telluride /ski/ (chip Nov 26, $ Dec 17); Bogus Basin opening/hours/tubing/bus ($ Dec 17); Winter Park tubing + kids $ (status Nov 24, $ Dec 17); Kirkwood hours/tickets/parking; Northstar hours, tickets (chip Nov 20; parking $ 2026/27); Stevens Pass hours (TBD 11-17; target Dec 4).
- RC Black Friday (up to $900 off, BF page read 11-26, no window): terms re-read Nov 28. Villa del Palmar BF: re-read Nov 28. Atlantis Cyber Sale (11-23, unpriced): ends Dec 8; from Nov 30.
- Epic Universe passes: no price (11-19); re-search Nov 28. Gracie: no 2026 page, Nov 30.
- Ski chips: Mt Snow 11-30, Windham Dec 2. Faneuil Santa Dec 2. Christkindlmarket 11-28. NYC Met tree: Thu hours conflict; stroller unread; from Dec 3.
- Menorah: NYC drops Dec 12 (Manhattan: no organizer page 11-26; from Nov 30); DC Dec 6 tickets unread.
- Boston Frog Pond: no dates/$ (11-22); Nov 29. Domino rink: no $ (11-22); from Nov 29. Fifth Ave car-free Dec 13: no 2026 nyc.gov notice (11-19); from Nov 30.
- No 2026 page: Union Sq, Blue Man Chi, TRU GC (Nov 26). AIC lion wreaths: no 2026 artic.edu page (11-24; Nov 27). SI Mall rink: news only (Nov 29).
- Saks times, Chanukah on Ice: Nov 28. Bloomingdale's windows: page stub 11-26; Dec 3. NYE row 10: SA pages unreadable 11-23; Nov 30.
- BF unpriced: Hersheypark to Nov 30; Fun Spot, Schlitterbahn, Mingei self-drop.
- Goodman Carol no $ (from Nov 30). Boston Pops no $ (Dec 2). Orlando leads: Heritage Square Dec 4, Luminary Dec 16; from Dec 1.
- SA: Hemisfair card no $ (ends Dec 31); Grinch $ hide ~Dec 19. SeaWorld SA Xmas $49.99 (11-22) hides after Nov 29 (sale clock): re-read tickets from Nov 29; SA kids/teens/itin. still $53.99 (Nov 1) to Dec 1: move to the new read or check live.
- Macy's parade Sat Nov 28 (8:30 a.m., 11-26): Nov 27 search streets/subway.
- Universal USF new market (WESH 11-26): unverified; from Dec 1.

## Scoreboard (refresh on Mondays from the newest ops/gsc-snapshots/*.md and live checks)
| Metric | Baseline 2026-10-27 | Target 2026-11-13 |
|---|---|---|
| 28-day clicks / impr. | 8 / 3,202 (Sep 27–Oct 24) | ≥15; 17 / 4,420 to Nov 10 |
| Sitemap URLs indexed | 31/36; 11-12: 77/77 priority | all or a reason |
| Past-due dates/samples | 7; 0 since Oct 27 | 0 |
| URLs <3 inbound links | 0 since Oct 27 | 0 |
| Pages avg pos ≤20, ≥20 impr. | 5; 4 in 11-12 snapshot | ≥7 |

## Last run
- 11-27 05:04Z G09w: Busch Tampa Fun Card re-read (same $94.99, files say Nov 27, May-end flag); Williamsburg $113.99 gone -> unlisted. Live a160221a. Muse 11-27: next run answers.
