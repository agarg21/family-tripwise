# STATE (operator working state; keep ≤8 KB; overwrite, don't append)

authority: owner-directed cloud scheduled task; hourly from 2026-10-27 10:00 until 2026-12-08 10:00 ET (owner 2026-10-29: hourly through the Black Friday deal window), then every 4 hours; ends 2027-01-15 17:00 America/New_York (extended by owner 2026-10-28)
caps: 1 transaction per run; daily_cap=none (owner 2026-10-27: no daily limit; the run cadence and the 90-minute lock are the only throttle)
today: 2026-11-19 transactions=17
run: none
last_public_release: G09w Six Flags Fiesta Texas deal: ends Nov 27, $45-ticket card (2+ visits)
active: none

## Holds (one line each: what, unblock condition)
- DEPLOY: main f6f30e03 (NYC Merchant's House Christmas Carol card) not live: 2 Pages deploys failed at artifact metadata (GitHub-side, 01:23Z, 01:33Z). Next run: dispatch deploy-pages.yml once, confirm release.json, then count it. Card $ hide Dec 21; news line drops Nov 29.
- LEGOLAND CA/FL pass checks: listed to Nov 21; from Nov 21 (CA: price the BF sale tier, from $139 to Nov 29; BF card drops Nov 29; hotel pkg page fetch withdrawn 2x).
- /deals/ checks end Nov 20 (Sesame Philly, LEGOLAND NY; deals-pages.test pins 11-14/11-13; SeaWorld Orlando Fun Card: 11-13 $104.99 presale vs $144.99 page, 11-16 BF day $61.99; re-read all from Nov 20), Nov 22 (Atlantis; year our reading), Dec 1 (Beaches BF), Jan 6 (Club Med); SeaWorld SD (from Nov 16 to extend), SeaWorld SA + Sesame SD from Nov 22.
- /this-week/ expires daily: deploy (05:17 UTC) refreshes live; re-render the committed copy (`node tools/this-week.mjs`, commit) on the first run each Eastern day or tests fail. SD kids/teens ticket $ (11-01): re-observe after Dec 1.
- Zernio: FB only; failed: report, no retry. Social queues: to Nov 20 (G05; 1 entry). Skips (file): Six Flags GA re-read from Nov 20, LEGOLAND CA BF tier; reword Dan Ryan, Air and Space, Bronx birds; re-read United Parks presales from Nov 20/22; LEGOLAND NY unit_short "by Jan 2". Records change → regenerate queue + cards together.
- DC itin. facts 11-06 (clock to Nov 20); NMNH stroller line: drop or re-source.
- Boston itin. facts 11-07 (due Nov 21); mos.org faq 11-09 (due Nov 23); Aquarium $, MBTA fares unknown (mbta.com robots blocks AI agents: don't fetch).
- SD Christmas page: prices hide Dec 2-5; from Nov 28. Orlando Christmas page: Nutcracker unpriced (11-18; from Nov 25); Crayola prices (Oct 27) hide Nov 27, rest Dec 3-5; from Nov 20; Mickey's party ends Dec 22. SA Christmas page: SeaWorld price hides Dec 2, rest Dec 5; Zoo Lights priced 2120d18e (visit read Nov 11; $ hides Dec 11, Locals Day $ Dec 9); caverns $ hides ~Dec 11 (hours/parking: from Nov 18). DC Christmas page: NPS tree still no viewing dates (11-18; from Nov 25); Enchant free-kid nights live (drop Dec 10), ticket $ JS-only; ice! price JS-only.
- NYC Christmas page: Bryant Park Santa start (Dec 14/15) re-read from Nov 26;: prices hide Dec 4 (Bronx Zoo hides Dec 14); from Nov 25. Grand Central train show: Nov 30 is our window (no end posted); from Nov 28. Macy's/Rockefeller unreadable. Brookfield Nutcracker drops after Nov 22; Santa selfies hours: re-read bfplny from Nov 26. Chicago page: CTA holiday fleet news line drops Nov 28, card Dec 23; Garfield + Lightscape tickets from Nov 25; prices hide Dec 5 (Metra Dec 14), from Nov 26; parade: 7:45 vs organizer 8-11 shown as conflict; re-read organizer/Choose Chicago from Nov 25.
- Holiday parks: re-read other $ before Nov 29 (GE $49 live 11-19; GE event page fetch withdrawn, re-read from Nov 26). Dyker: from Nov 27.
- SD/NYC/Orlando/London Google listings leave pages Jan 8: regenerate + commit.
- JetBlue bag card: expires Dec 2; re-read legal/fees from Nov 25 to extend through Jan 18 peak.
- Cancun, PV: regenerate Dec 18, Dec 25, Jan 15 (PV example-stay: by Jan 8). bso.org from Nov 18.
- NYC teens: facts read 11-09/11-11 (High Line: re-read Dec 1); broadway.org, NYC Parks July 26. Orlando with kids: official facts read 11-06; from Nov 20.
- SD itin.: zoo hours to Nov 25; Balboa parking to end 2026.
- Q19: LV/Chicago/SA Jan 19 prices: regenerate by Jan 12 (guard test).
- NYC, DC, Boston, SD hotels (G18): regenerate by Dec 18, Dec 25, Jan 15; guard tests fail then; weekly refresh next from Nov 21.
- Six Flags Silver: GE, GA, FT end Nov 27 (read 11-19; FT banners mixed 11/27-11/30).
- Busch Fun Card: listed to Nov 15; re-read offers + Fun Card pages from Nov 20, relist if on sale (moves saver_flag, hub_deadline, test dates). From Nov 22 re-read: NYC lantern (age/date $; Queens end date from Nov 26), Polar Express Kingston (peak dates), Herald carousel, Orlando Magic Show page (unpriced).
- SA kids page: Morgan's 'closed for the season' (calendar Nov 15): re-read calendar from Nov 22. SA teens: Holiday in the Park line (to Jan 4, 2027) must drop by Jan 5. Bass Pro Santa (SA card): breakfast Dec 5 and story time lines drop themselves; card ends Dec 24.
- Event markup (read ≤30 days): Boston City listings lose it Nov 28 (from Nov 20); DC Wharf + Mount Vernon Dec 5 (re-read by Dec 4); move holiday-event-markup.test dates with it.
- Hotel study: Xmas drops Dec 18, NY Dec 25.
- Jay Peak page: prices hide Dec 17 (re-read before). Stowe: $ hide Dec 17; opening TBD (from Nov 23).
- G19: Schweitzer held (no winter photo). Holiday Valley: chip Nov 27; $ hide Dec 16; re-read tickets/tubing/hours from Nov 23.
- Deer Valley: chip Dec 5; no ticket $ (JS-only); re-read home/hours from Dec 1, tickets from Nov 21. Pops $ from Nov 25.
- Killington: tubing $ hide Dec 17; day ticket $ unread.
- Stratton: $ hide Dec 16; opening Nov 25 projected (from Nov 23). Seven Springs: chip hides Nov 25; re-read hours/status from Nov 20; parking $ hide ~Dec 17.
- Breckenridge: childcare $ hide Dec 17; status hides Nov 24 (re-read home/hours). Park City: opens Nov 20 (chip flips itself); status hides Nov 24, $ Dec 17; re-read home/hours/parking from Nov 24.
- Vail: $ hide Dec 17; childcare line from Nov 24. Keystone: re-read hours (tubing, lifts) from Nov 24. Copper: re-read tubing, tickets from Nov 24.
- Crested Butte: chip flips Nov 25; re-read hours/basecamp from Nov 24. Snowbird: chip flips Nov 27 (tentative); $ hide Dec 17; re-read opening/tickets from Nov 24. Alta: chip flips Nov 25; no ticket $ posted; re-read opening, tickets from Nov 24.
- Jackson Hole: chip Nov 27; parking $ last winter's (from Nov 24); Kids on Snow drops Dec 13.
- G19 West from Nov 24: Timberline tickets/opening; Heavenly hours (chip Nov 20); Mt Bachelor hours, childcare/tubing $; Telluride /ski/ (chip Nov 26, $ Dec 17); Bogus Basin opening/hours/tubing/bus ($ Dec 17); Winter Park tubing + kids $ (status Nov 24, $ Dec 17); Kirkwood hours/tickets/parking; Northstar hours, tickets (chip Nov 20; parking $ 2026/27); Stevens Pass hours (TBD 11-17; target Dec 4); Wolf Creek note hides Nov 25 (from Nov 24).
- Ski chips: Mount Snow 11-23, Hunter/Windham 11-22. UCRM to Nov 24.
- Boston Faneuil Santa page still 2024: from Nov 25.
- Macy's parade: no 2026 NYPD notice (11-18); re-search nyc.gov from Nov 23. NYC menorah card (Brooklyn, Dec 4-11): drops Dec 12; Manhattan menorah times unread. DC National Menorah (Dec 6): ticket availability unread; 2026 performers not posted.
- Fifth Ave car-free Dec 13 (lead): no 2026 nyc.gov notice (11-19); re-search from Nov 30.
- No 2026 page (11-19): Union Sq market, Blue Man Chi, Toys"R"Us GC, GC Fair (from Nov 26). AMNH tree end: from Dec 10.
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
- 11-20 01:04Z G16 NYC A Christmas Carol (Merchant's House) card merged f6f30e03; integrity c1 FAIL (3 P2) -> c2 PASS_WITH_P3, persona 4.0, design 3.86; deploy failed twice (GitHub Pages artifact metadata), not yet live.
