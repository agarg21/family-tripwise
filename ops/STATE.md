# STATE (operator working state; keep ≤8 KB; overwrite, don't append)

authority: owner-directed cloud scheduled task; hourly from 2026-10-27 10:00 until 2026-12-08 10:00 ET (owner 2026-10-29: hourly through the Black Friday deal window), then every 4 hours; ends 2027-01-15 17:00 America/New_York (extended by owner 2026-10-28)
caps: 1 transaction per run; daily_cap=none (owner 2026-10-27: no daily limit; the run cadence and the 90-minute lock are the only throttle)
today: 2026-11-18 transactions=11
run: {id: 2026-11-18T16:05Z, started_at: 2026-11-18T16:05Z}
last_public_release: 27215b93 ski pages: cam times in resort's own clock + status link (G19)
active: none

## Holds (one line each: what, unblock condition)
- Deal watch (G09): watcher commits flags to main hourly; fetch/merge before releasing.
- LEGOLAND CA/FL pass checks: listed to Nov 21; re-read from Nov 21.
- /deals/ checks end Nov 20 (Sesame Philly, LEGOLAND NY: re-read from Nov 20; deals-pages.test pins 11-14/11-13), Nov 20 (SeaWorld Orlando Fun Card: 11-13 $104.99 presale vs Fun Card page $144.99; 11-16 leads BF, day $61.99; re-read both from Nov 20), Nov 22 (Atlantis; year is our reading), Dec 1 (Beaches Black Friday), Jan 6 (Club Med); SeaWorld SD relisted Nov 15 (re-read from Nov 16 to extend); SeaWorld SA relisted to Nov 22 (read Nov 15; re-read from Nov 22); Sesame SD (ended Nov 15; re-read from Nov 22).
- /this-week/ expires daily: deploy (05:17 UTC) refreshes live; re-render the committed copy (`node tools/this-week.mjs`, commit) on the first run each Eastern day or tests fail. SD kids/teens ticket $ (11-01): re-observe after Dec 1.
- Zernio: FB only; failed/stuck: report, never retry.
- Social queues: through Nov 19 (G05). Skips (see file): reword Dan Ryan, Air and Space, Bronx birds; re-read United Parks presales from Nov 20/22; LEGOLAND NY unit_short "by Jan 2". Records change → regenerate queue + cards in the same commit.
- DC itinerary facts re-read 11-06 (clock to Nov 20); NMNH stroller line (Oct 27): drop or re-source.
- Boston itin. facts 11-07 (due Nov 21); mos.org faq 11-09 (due Nov 23); Aquarium $, MBTA fares unknown (mbta.com robots blocks AI agents: don't fetch).
- SD Christmas page: prices hide Dec 2-5; re-read from Nov 28. Orlando Christmas page: Nutcracker unpriced (re-read from Nov 18); Crayola prices (Oct 27) hide Nov 27 (Gatorland read Nov 15), rest Dec 3-5; re-read from Nov 20; Mickey's party ends Dec 22. SA Christmas page: SeaWorld price hides Dec 2, rest Dec 5; Zoo Lights priced 2120d18e (visit read Nov 11; $ hides Dec 11, Locals Day $ Dec 9); caverns priced d65f26ef ($ hides ~Dec 11; hours/parking not posted, re-read from Nov 18). DC Christmas page: NPS tree still no viewing dates (11-18; re-read from Nov 25); Enchant free-kid nights live (drop Dec 10), ticket $ JS-only; ice! price JS-only.
- NYC Christmas page: prices hide Dec 4 (Bronx Zoo hides Dec 14); re-read from Nov 25. Santaland card from Macy's Oct 22 release only; add dates when an official page is readable. Nostalgia Train card. Grand Central train show: Nov 30 is our window (no end posted); re-read from Nov 28. Macy's and Rockefeller pages unreadable. Chicago page: prices hide Dec 5 (Metra Dec 14); re-read from Nov 26; parade time from tourism board (organizer site still 2025): re-read from Nov 20.
- Holiday parks: re-read prices before Nov 29. Dyker, Secret NYC: from Nov 27.
- SD, NYC, Orlando, London Google listings leave pages 2027-01-08: generate-pages + commit then.
- JetBlue bag card: expires Nov 19; re-read jetblue.com/legal/fees to re-date/extend.
- Cancun, PV: regenerate Dec 18, Dec 25, Jan 15 (PV example-stay: by Jan 8). bso.org from Nov 18.
- NYC teens: facts read 11-09/11-11 (High Line: re-read Dec 1); broadway.org, NYC Parks July 26. Orlando with kids: official facts read 11-06; re-read from Nov 20.
- SD itin.: zoo hours to Nov 25; Balboa parking to end 2026.
- Q19: LV/Chicago/SA Jan 19 prices: regenerate by Jan 12 (guard test).
- NYC, DC, Boston, SD hotels (G18): regenerate by Dec 18, Dec 25, Jan 15; guard tests fail then; weekly refresh next from Nov 21.
- Six Flags Silver (NJ/TX/IL): re-read from Nov 20; ends Nov 30.
- Busch Fun Card: listed to Nov 15 (read Nov 13, so weekly rule: re-read offers + Fun Card pages from Nov 20, relist then if still on sale); extending moves saver_flag, hub_deadline, test dates. NYC lantern card (Nov 15): re-read for child/date prices from Nov 22; Polar Express (Kingston) card: re-read peak dates/times from Nov 22. Herald carousel: re-read from Nov 22. Orlando Magic Show card (unpriced): re-read show page from Nov 22.
- SA ice! card: re-read the ticket calendar for a price from Nov 16 (JS-only 11-09). SA kids page: Morgan's 'closed for the season' (calendar Nov 15): re-read calendar from Nov 22. SA teens: Holiday in the Park line (to Jan 4, 2027) must drop by Jan 5. Bass Pro Santa (SA card): breakfast Dec 5 and story time lines drop themselves; card ends Dec 24.
- Event markup (open events, read ≤30 days): Boston City listings lose it Nov 28 (re-read from Nov 20); DC Wharf + Mount Vernon Dec 5 (re-read by Dec 4); move holiday-event-markup.test dates with it.
- Hotel study page: Christmas drops Dec 18, New Year Dec 25; add new G18 receipts to STUDY_CITIES.
- Jay Peak page: prices hide Dec 17 (re-read before). Stowe: $ hide Dec 17; opening TBD (re-read from Nov 23).
- Held G19: Schweitzer (no winter photo). Holiday Valley: opening chip Nov 27; $ hide Dec 16; re-read tickets/tubing/hours from Nov 23.
- Deer Valley: chip Dec 5; no ticket $ (JS-only); re-read home/hours from Dec 1, tickets from Nov 21. Pops $ from Nov 25.
- Killington: opening Nov 18 flips itself; tubing $ hide Dec 17; day ticket $ unread.
- Stratton: $ hide Dec 16; opening Nov 25 projected (re-read from Nov 23). Seven Springs: chip hides Nov 25; re-read hours/status from Nov 20; parking $ hide ~Dec 17.
- Breckenridge: childcare $ hide Dec 17; status hides Nov 24 (re-read home/hours). Park City: opens Nov 20 (chip flips itself); status hides Nov 24, $ Dec 17; re-read home/hours/parking from Nov 24.
- Vail: $ hide Dec 17; childcare line re-read from Nov 24. Keystone: re-read hours (tubing, lifts) from Nov 24. Copper: re-read tubing, tickets from Nov 24.
- Crested Butte: chip flips Nov 25; re-read hours/basecamp from Nov 24. Snowbird: chip flips Nov 27 (tentative); $ hide Dec 17; re-read opening/tickets from Nov 24. Alta: chip flips Nov 25; no ticket $ posted; re-read opening, tickets from Nov 24.
- Jackson Hole: chip Nov 27; parking $ last winter's (re-read from Nov 24); Kids on Snow drops Dec 13.
- G19 West re-reads from Nov 24: Timberline tickets/opening; Heavenly hours (chip Nov 20); Mt Bachelor hours, childcare/tubing $ (opens Dec 4); Telluride /ski/ (chip Nov 26, $ Dec 17); Bogus Basin opening/hours/tubing/bus ($ Dec 17); Winter Park tubing + kids $ (status Nov 24, $ Dec 17); Kirkwood hours/tickets/parking (opens Dec 4); Northstar hours, tickets (chip Nov 20; parking $ 2026/27); Stevens Pass hours (TBD 11-17; target Dec 4); Wolf Creek note hides Nov 25 (re-read from Nov 24).
- Ski chips: Mount Snow 11-23, Hunter/Windham 11-22. UCRM card to Nov 24.
- Review deck (R1): 5 cards/weekday <08:00 ET.

## Scoreboard (refresh on Mondays from the newest ops/gsc-snapshots/*.md and live checks)
| Metric | Baseline 2026-10-27 | Target 2026-11-13 |
|---|---|---|
| 28-day organic clicks / impressions | 8 / 3,202 (Sep 27–Oct 24) | ≥15 clicks good; 17 / 4,420 to Nov 10 (11-12) |
| Sitemap URLs indexed | 31/36 at baseline; 11-12: 77 of 77 priority indexed | 36/36 or a reason per URL |
| Live pages with past-due dates or past-stay price samples | 7 (8 from Oct 28); 0 since c21010c (Oct 27) | 0 |
| Verified releases/week (release.json) | many daily since Nov 2 | ≥4 |
| Sitemap URLs <3 inbound links | 0 since b14da12 (Oct 27) | 0 |
| Pages at avg position ≤20 with ≥20 impressions | 5; 4 in 11-12 snapshot | ≥7 |

## Last run
- 11-18 15:05Z G09w: LEGOLAND CA package flag: old $39 offer ended Nov 17 (page shows ended); BF tile from $128 pp/night ends Nov 29, basis unread (package fetch withdrawn, FAQ client error); no check yet; flag deleted. No site change.
