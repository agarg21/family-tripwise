# STATE (operator working state; keep ≤8 KB; overwrite, don't append)

authority: owner-directed cloud scheduled task; hourly from 2026-10-27 10:00 until 2026-12-08 10:00 ET (owner 2026-10-29: hourly through the Black Friday deal window), then every 4 hours; ends 2027-01-15 17:00 America/New_York (extended by owner 2026-10-28)
caps: 1 transaction per run; daily_cap=none (owner 2026-10-27: no daily limit; the run cadence and the 90-minute lock are the only throttle)
today: 2026-11-20 transactions=16
run: {id: 2026-11-20T22:05Z, started_at: 2026-11-20T22:05Z}
last_public_release: G13 DC itinerary facts re-read 11-20 (6e00af80, live)
active: none

## Holds (one line each: what, unblock condition)
- LEGOLAND CA/FL pass checks: listed to Nov 21 (FL $112 pass row: confirm it drops Nov 22); from Nov 21 (CA: price BF tier from $139 to Nov 29; hotel pkg fetch withdrawn 2x).
- /deals/ checks end Nov 22 (Atlantis), Nov 27 (Sesame Philly + SeaWorld Orlando, re-read 11-20; banner file names say 11-16 to 11-23), Dec 1 (Beaches BF), Dec 2 (LEGOLAND NY, stated), Jan 4 (Club Med); SeaWorld SA + Sesame SD from Nov 22.
- /this-week/ expires daily: deploy (05:17 UTC) refreshes live; re-render the committed copy (`node tools/this-week.mjs`, commit) on the first run each Eastern day or tests fail. SD kids/teens ticket $ (11-01): re-observe after Dec 1.
- Zernio: FB only; failed: report, no retry. Skips (file): Six Flags GA (Great America P2s), LEGOLAND NY unit_short, LEGOLAND CA BF tier; reword Dan Ryan, Air and Space, Bronx birds; re-read United Parks presales from Nov 20/22; LEGOLAND NY unit_short "by Jan 2". Records change → regenerate queue + cards together.
- DC itin. facts 11-20 (due Dec 4); NMNH tips/dining, Zoo summer hours, NMAH hours still 11-06 (search did not surface them); NASM pass FAQ unread.
- Boston itin. facts 11-07 (due Nov 21); mos.org faq 11-09 (due Nov 23); Aquarium $, MBTA fares unknown (mbta.com robots blocks AI agents: don't fetch).
- SD Christmas page: prices hide Dec 2-5; from Nov 28. Orlando: Nutcracker unpriced (from Nov 25); Crayola/Gatorland $ hide Dec 21, rest Dec 3-5; Mickey's party ends Dec 22. SA Christmas page: SeaWorld price hides Dec 2, rest Dec 5; Zoo Lights priced 2120d18e ($ hides Dec 9-11); caverns $ hides ~Dec 11 (hours/parking: from Nov 18). DC: TWB re-read from Nov 27; NPS tree no viewing dates (from Nov 25); Enchant free-kid nights live (drop Dec 10), ticket $ JS-only; ice! price JS-only.
- NYC Christmas page: Bryant Park Santa start (Dec 14/15) from Nov 26; prices hide Dec 4 (Bronx Zoo hides Dec 14); from Nov 25. Grand Central trains: Nov 30 our window; from Nov 28.  Brookfield Nutcracker drops after Nov 22; Santa selfies hours: re-read bfplny from Nov 26. Chicago page: CTA holiday fleet news line drops Nov 28, card Dec 23; Garfield + Lightscape tickets from Nov 25; prices hide Dec 5 (Metra Dec 14), from Nov 26; parade time conflict shown; re-read from Nov 25.
- Holiday parks: re-read other $ before Nov 29 (GE $49 live 11-19; GE event page fetch withdrawn, re-read from Nov 26). Dyker: from Nov 27.
- SD/NYC/Orlando/London Google listings leave pages Jan 8: regenerate + commit.
- JetBlue bag card: expires Dec 2; re-read legal/fees from Nov 25 to extend through Jan 18 peak.
- Cancun, PV: regenerate Dec 18, Dec 25, Jan 15 (PV example-stay: by Jan 8). bso.org from Nov 18.
- NYC teens: facts read 11-09/11-11 (High Line: re-read Dec 1); broadway.org, NYC Parks July 26. Orlando with kids: official facts read 11-20 (Disney Springs 11-06, stub on 11-20: re-read or soften parking line); next from Dec 4.
- SD itin.: zoo hours to Nov 25; Balboa parking to end 2026.
- Q19: LV/Chicago/SA Jan 19 prices: regenerate by Jan 12 (guard test).
- NYC, DC, Boston, SD hotels (G18): regenerate by Dec 18, Dec 25, Jan 15; guard tests fail then; weekly refresh next from Nov 21.
- Six Flags Silver: GE, GA, FT end Nov 27 (read 11-19; FT banners mixed 11/27-11/30).
- Busch Fun Cards: Tampa ($94.99) + Williamsburg ($113.99) read 11-20, listed to Nov 27; re-read from Nov 27. From Nov 22 re-read: NYC lantern (age/date $; Queens end date from Nov 26), Polar Express Kingston (peak dates), Herald carousel, Orlando Magic Show page (unpriced).
- SA kids page: Morgan's 'closed for the season' (calendar Nov 15): re-read calendar from Nov 22. SA teens: Holiday in the Park line (to Jan 4, 2027) must drop by Jan 5. Bass Pro Santa (SA card): breakfast Dec 5 and story time lines drop themselves; card ends Dec 24.
- Event markup (≤30 days): Boston listings lose it Nov 28; DC Wharf + Mount Vernon Dec 5 (re-read by Dec 4); move holiday-event-markup.test dates.
- Hotel study: Xmas drops Dec 18, NY Dec 25.
- Jay Peak page: prices hide Dec 17 (re-read before). Stowe: $ hide Dec 17; opening TBD (from Nov 23).
- G19: Schweitzer held (no winter photo). Holiday Valley: chip Nov 27; $ hide Dec 16; re-read tickets/tubing/hours from Nov 23.
- Deer Valley: chip Dec 5; no ticket $ (JS-only); re-read home/hours from Dec 1, tickets from Nov 21. Pops $ from Nov 25.
- Killington: tubing $ hide Dec 17; day ticket $ unread.
- Stratton: $ hide Dec 16; opening Nov 25 projected (from Nov 23). Seven Springs: chip hides Nov 25; re-read hours/status from Nov 24 (read 11-17, weekly limit); parking $ hide ~Dec 17.
- Breckenridge: childcare $ hide Dec 17; status hides Nov 24 (re-read home/hours). Park City: opens Nov 20 (chip flips itself); status hides Nov 24, $ Dec 17; re-read home/hours/parking from Nov 24.
- Vail: $ hide Dec 17; childcare line from Nov 24. Keystone: re-read hours (tubing, lifts) from Nov 24. Copper: re-read tubing, tickets from Nov 24.
- Crested Butte: chip flips Nov 25; re-read hours/basecamp from Nov 24. Snowbird: chip flips Nov 27 (tentative); $ hide Dec 17; re-read opening/tickets from Nov 24. Alta: chip flips Nov 25; no ticket $ posted; re-read opening, tickets from Nov 24.
- Jackson Hole: chip Nov 27; parking $ last winter's (from Nov 24); Kids on Snow drops Dec 13.
- G19 West from Nov 24: Timberline tickets/opening; Heavenly hours (chip Nov 20); Mt Bachelor hours, childcare/tubing $; Telluride /ski/ (chip Nov 26, $ Dec 17); Bogus Basin opening/hours/tubing/bus ($ Dec 17); Winter Park tubing + kids $ (status Nov 24, $ Dec 17); Kirkwood hours/tickets/parking; Northstar hours, tickets (chip Nov 20; parking $ 2026/27); Stevens Pass hours (TBD 11-17; target Dec 4); Wolf Creek note hides Nov 25 (from Nov 24).
- Ski chips: Mount Snow 11-23, Hunter/Windham 11-22. Faneuil Santa: from Nov 25.
- Macy's parade: no 2026 NYPD notice (11-18); re-search nyc.gov from Nov 23. Menorah: NYC card drops Dec 12 (Manhattan times unread); DC (Dec 6) tickets unread.
- Fifth Ave car-free Dec 13 (lead): no 2026 nyc.gov notice (11-19); re-search from Nov 30.
- No 2026 page (11-19): Union Sq market, Blue Man Chi, Toys"R"Us GC (from Nov 26). GC Fair: 2026 page now in search (grandcentralterminal.com/event/2026-holiday-fair/), fetch client_error 11-20 (no retry; try another GCT page from Nov 26). AMNH tree end: from Dec 10.
- NYC Chanukah on Ice flag: no organizer page (11-19); re-search from Nov 21.
- SA Nutcracker card (11-18): drops after Dec 13. SA Grinch (Magik, 11-19): showtimes unlisted; 4-Pack scope unknown; $ hide ~Dec 19; drops after Dec 24.

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
- 11-20 21:05Z G13 DC itinerary re-read: Monument closure days now Dec 25 + monthly maintenance (NPS pages conflict on Dec 8), NASM renovation complete, Zoo/NMAH updates; stale Nov 11/26 lines gone. Live 6e00af80.
