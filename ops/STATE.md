# STATE (operator working state; keep ≤8 KB; overwrite, don't append)

authority: owner-directed cloud scheduled task; hourly from 2026-10-27 10:00 until 2026-12-08 10:00 ET (owner 2026-10-29: hourly through the Black Friday deal window), then every 4 hours; ends 2027-01-15 17:00 America/New_York (extended by owner 2026-10-28)
caps: 1 transaction per run; daily_cap=none (owner 2026-10-27: no daily limit; the run cadence and the 90-minute lock are the only throttle)
today: 2026-11-17 transactions=17
run: {id: 2026-11-17T23:04:39Z, started_at: 2026-11-17T23:04:39Z}
last_public_release: f5b1d1f5 /this-week/ + Nov 18 social queue (G05)
active: none

## Holds (one line each: what, unblock condition)
- Deal watch (G09): watcher commits flags to main hourly; fetch/merge before releasing.
- LEGOLAND CA/FL pass checks: listed to Nov 21; re-read from Nov 21.
- Deer Valley: no ticket $ (JS-only); Kids Ski Free re-read due.
- /deals/ checks end Nov 20 (Sesame Philly, LEGOLAND NY: re-read from Nov 20; deals-pages.test pins 11-14/11-13), Nov 17 (LEGOLAND California hotel package), Nov 20 (SeaWorld Orlando Fun Card: 11-13 $104.99 presale vs Fun Card page $144.99; 11-16 leads BF, day $61.99; re-read both from Nov 20), Nov 22 (Atlantis; year is our reading), Dec 1 (Beaches Black Friday), Jan 6 (Club Med); SeaWorld SD relisted Nov 15 (re-read from Nov 16 to extend); SeaWorld SA relisted to Nov 22 (read Nov 15; re-read from Nov 22); Sesame SD (ended Nov 15; re-read from Nov 22); committed pages must match today's render.
- /this-week/ expires daily: deploy (05:17 UTC) refreshes live; re-render the committed copy (`node tools/this-week.mjs`, commit) on the first run each Eastern day or tests fail. SD kids/teens ticket $ (11-01): re-observe after Dec 1.
- Zernio: FB only; failed/stuck: report, never retry.
- Social queues: committed through Nov 18 (G05; 3 skips left: Dan Ryan, Air and Space, Bronx birds). Current queue's records change → regenerate queue + cards in the same commit (`node tools/social-queue.mjs <date>`).
- DC itinerary facts re-read 11-06 (clock to Nov 20); NMNH stroller line (Oct 27): drop or re-source.
- Boston itinerary facts re-read 11-07 (due Nov 21); mos.org faq 11-09 (due Nov 23); Aquarium prices, MBTA fares unknown (JS-only; mbta.com robots.txt blocks AI agents, do not fetch).
- SD Christmas page: prices hide Dec 2-5; re-read from Nov 28. Orlando Christmas page: Nutcracker unpriced (re-read from Nov 18); Crayola prices (Oct 27) hide Nov 27 (Gatorland read Nov 15), rest Dec 3-5; re-read from Nov 20; Mickey's party ends Dec 22. SA Christmas page: SeaWorld price hides Dec 2, rest Dec 5; Zoo Lights priced 2120d18e (visit read Nov 11; $ hides Dec 11, Locals Day $ Dec 9); caverns priced d65f26ef ($ hides ~Dec 11; hours/parking not posted, re-read from Nov 18). DC Christmas page: NPS tree (no viewing dates) and Enchant (no free-kids offer) re-read from Nov 18; check "winners told Nov 12" wording; ice! price JS-only (FAQ/home re-read due).
- NYC Christmas page: prices hide Dec 4 (Bronx Zoo hides Dec 14); re-read from Nov 25. Santaland card from Macy's Oct 22 release only; add dates when an official page is readable. Nostalgia Train card. Grand Central train show: Nov 30 is our window (no end posted); re-read from Nov 28. Macy's and Rockefeller pages unreadable. Chicago page: prices hide Dec 5 (Metra Dec 14); re-read from Nov 26; parade time from tourism board (organizer site still 2025): re-read from Nov 20.
- Holiday parks: re-read prices before Nov 29. Dyker, Secret NYC: from Nov 27.
- SD, NYC, Orlando, London Google listings leave pages 2027-01-08: run generate-pages and commit then (listing/PV tests fail).
- JetBlue bag card: expires Nov 19, read jetblue.com/legal/fees from Nov 12 to re-date and extend through peak dates.
- Cancun, PV: regenerate Dec 18, Dec 25, Jan 15 or byte tests fail (PV example-stay: by Jan 8). bso.org from Nov 18.
- NYC teens: Growler, High Line, MoMI, Tenement, Yankee pregame read 11-09 (High Line: re-read Dec 1); Broadway League, MoMA, Yankee 11-11; broadway.org, NYC Parks July 26. Orlando with kids: official facts read 11-06; re-read from Nov 20.
- SD itin.: zoo hours to Nov 25; Balboa parking to end 2026.
- Q19: LV/Chicago/SA Jan 19 prices: regenerate by Jan 12 (guard test).
- NYC, DC, Boston, SD hotels (G18): regenerate by Dec 18, Dec 25, Jan 15; guard tests fail then; weekly refresh next from Nov 21.
- Six Flags Silver (NJ, TX, IL): read Nov 13; next from Nov 20; ends Nov 30.
- Busch Fun Card: listed to Nov 15 (read Nov 13, so weekly rule: re-read offers + Fun Card pages from Nov 20, relist then if still on sale); extending moves saver_flag, hub_deadline, test dates. NYC lantern card (Nov 15): re-read for child/date prices from Nov 22; Polar Express (Kingston) card: re-read peak dates/times from Nov 22. Herald carousel: re-read from Nov 22. Orlando Magic Show card (unpriced): re-read show page from Nov 22.
- SA ice! card: re-read the ticket calendar for a price from Nov 16 (JS-only 11-09). SA kids page: Morgan's 'closed for the season' (calendar Nov 15): re-read calendar from Nov 22. SA teens: Holiday in the Park line (to Jan 4, 2027) must drop by Jan 5. Bass Pro Santa (SA card): breakfast Dec 5 and story time lines drop themselves; card ends Dec 24.
- Event markup (open events, read ≤30 days): Boston City listings lose it Nov 28 (re-read from Nov 20); DC Wharf + Mount Vernon Dec 5 (re-read by Dec 4); move holiday-event-markup.test dates with it.
- Hotel study page: Christmas drops Dec 18, New Year Dec 25; add new G18 receipts to STUDY_CITIES.
- Jay Peak page: prices hide Dec 17 (re-read before). Stowe: $ hide Dec 17; opening TBD (re-read from Nov 23).
- Holiday Valley (G19, branch q/G19-holiday-valley): held until a Commons photo fits 200 KB; merge main then.
- Killington (G19): opening Nov 18 flips itself; tubing $ hide Dec 17; day ticket $ unread.
- Stratton (G19): $ hide Dec 16; opening Nov 25 projected (re-read from Nov 23). Seven Springs: chip hides Nov 25; re-read hours/status from Nov 20; parking $ hide ~Dec 17.
- Breckenridge (G19): childcare $ hide Dec 17; status hides Nov 24 (re-read home/hours). Park City (G19): opens Nov 20 (chip flips itself); status hides Nov 24, $ Dec 17; re-read home/hours/parking from Nov 24.
- Vail (G19): $ hide Dec 17; childcare line re-read from Nov 24. Keystone: re-read hours (tubing, lifts) from Nov 24. Copper: re-read tubing, tickets from Nov 24.
- Crested Butte (G19): chip flips Nov 25; re-read hours/basecamp from Nov 24. Snowbird: chip flips Nov 27 (tentative); $ hide Dec 17; re-read opening/tickets from Nov 24. Alta: chip flips Nov 25; no ticket $ posted; re-read opening, tickets from Nov 24.
- Jackson Hole (G19): chip Nov 27; parking $ last winter's (re-read from Nov 24); Kids on Snow lines drop after Dec 13.
- Mt Bachelor (G19): opens Dec 4; hours, childcare/tubing $ unposted: re-read from Nov 24.
- Telluride (G19): chip Nov 26; re-read /ski/ from Nov 24; $ hide Dec 17.
- Bogus Basin (G19): $ hide Dec 17; re-read opening, hours, tubing, bus from Nov 24.
- Winter Park (G19): status hides Nov 24, $ Dec 17; re-read tubing + kids prices from Nov 24.
- Ski chips: Mount Snow 11-23, Hunter/Windham 11-22. UCRM card: to Nov 24.
- Review deck (R1): 5 cards/weekday before 08:00 ET; next Nov 18; no repeat in 14 days.

## Scoreboard (refresh on Mondays from the newest ops/gsc-snapshots/*.md and live checks)
| Metric | Baseline 2026-10-27 | Target 2026-11-13 |
|---|---|---|
| 28-day organic clicks / impressions | 8 / 3,202 (Sep 27–Oct 24) | ≥15 clicks good; 17 / 4,420 to Nov 10 (11-12) |
| Sitemap URLs indexed | 31/36 at baseline; 11-12: 77 of 77 priority indexed | 36/36 or a reason per URL |
| Live pages with past-due dates or past-stay price samples | 7 (8 from Oct 28); 0 since c21010c (Oct 27) | 0 |
| Verified releases/week (release.json) | many daily since Nov 2 | ≥4 |
| Sitemap URLs with <3 internal inbound links | 0 since b14da12 (Oct 27; min 34) | 0 |
| Pages at avg position ≤20 with ≥20 impressions | 5; 4 in 11-12 snapshot | ≥7 |

## Last run
- 11-17 22:05Z G05 Nov 18 queue live f5b1d1f5; integrity c2 P3, persona 3.68, design 3.71 (D34).
