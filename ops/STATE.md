# STATE (operator working state; keep ≤8 KB; overwrite, don't append)

authority: owner-directed cloud scheduled task; hourly from 2026-10-27 10:00 until 2026-12-08 10:00 ET (owner 2026-10-29: hourly through the Black Friday deal window), then every 4 hours; ends 2027-01-15 17:00 America/New_York (extended by owner 2026-10-28)
caps: 1 transaction per run; daily_cap=none (owner 2026-10-27: no daily limit; the run cadence and the 90-minute lock are the only throttle)
today: 2026-11-16 transactions=11
run: {id: 2026-11-17T02:04:24Z, started_at: 2026-11-17T02:04:24Z}
last_public_release: d43da0b7 /ski/jay-peak-conditions.html (G19)
active: none

## Holds (one line each: what, unblock condition)
- Deal watch (G09): watcher commits flags to main hourly; fetch/merge before releasing.
- LEGOLAND CA/FL pass checks: listed to Nov 21; re-read from Nov 21.
- Deer Valley: no daily ticket price (JS-only); Kids Ski Free re-read from Nov 16.
- Great Wolf EBF relisted to Nov 22 (CT page read 11-16; unpriced, page only).
- /deals/ checks end Nov 20 (Sesame Philly, LEGOLAND NY: re-read from Nov 20; deals-pages.test pins 11-14/11-13), Nov 17 (LEGOLAND California hotel package), Nov 20 (SeaWorld Orlando Fun Card: Tickets page read 11-13 showed $104.99 presale, Fun Card page $144.99; 11-16 leads: "Black Friday", day $61.99; re-read both from Nov 20; offers page from Nov 17), Nov 22 (Atlantis; year is our reading), Dec 1 (Beaches Black Friday), Jan 6 (Club Med); SeaWorld SD relisted Nov 15 (re-read from Nov 16 to extend); SeaWorld SA relisted to Nov 22 (read Nov 15; re-read from Nov 22); Sesame SD listed to Nov 15 (banners "endsnov15"; re-read from Nov 22); committed pages must match today's render.
- /this-week/ expires daily: deploy (05:17 UTC) refreshes live; re-render the committed copy (`node tools/this-week.mjs`, commit) on the first run each Eastern day or tests fail. SD kids/teens ticket prices (11-01): re-observe after Dec 1.
- Social posting (G04/G08 Zernio): only Facebook connected. Receipts in ops/social-receipts/ on main: fetch/merge before releasing; failed/stuck "attempting" receipts never retried, report to owner. OWNER D12/D8 rows: parsers read "— Approved" or ": Approved" (3a758543).
- Social queues: committed through Nov 17 (G05; 5 skips need rewording, see queue). A current queue's records change → regenerate queue + cards in the same commit (keeps skips; `node tools/social-queue.mjs <date> [--skip <id> "<reason>"]`).
- Growth-first (D10–D12): G before old Q items, except live defects. D22: only real deals (≥5%) queued/posted/promoted; regenerate queues when a card changes.
- DC itinerary facts re-read 11-06 (clock to Nov 20); NMNH stroller line (Oct 27): drop or re-source.
- Boston itinerary facts re-read 11-07 (due Nov 21); mos.org faq 11-09 (due Nov 23); Aquarium prices, MBTA fares unknown (JS-only; mbta.com robots.txt blocks AI agents, do not fetch).
- SD Christmas page: prices hide Dec 2-5; re-read from Nov 28. Orlando Christmas page: Nutcracker unpriced (re-read from Nov 18); Crayola prices (Oct 27) hide Nov 27 (Gatorland read Nov 15), rest Dec 3-5; re-read from Nov 20; Mickey's party ends Dec 22. SA Christmas page: SeaWorld price hides Dec 2, rest Dec 5; Zoo Lights priced 2120d18e (visit read Nov 11; $ hides Dec 11, Locals Day $ Dec 9); caverns priced d65f26ef ($ hides ~Dec 11; hours/parking not posted, re-read from Nov 18). DC Christmas page: NPS tree page re-read Nov 11 unchanged (no viewing dates; next from Nov 18); edit "winners told Nov 12" after Nov 12; Enchant DC read Nov 11 (no free-kids offer; next from Nov 18); ice! price JS-only on tickets.gaylordnational.com (read Nov 9; FAQ/home re-read due Nov 16).
- NYC Christmas page: prices hide Dec 4 (Bronx Zoo hides Dec 14); re-read from Nov 25. Santaland card from Macy's Oct 22 release only; add dates when an official page is readable. Nostalgia Train card. Grand Central train show: Nov 30 is our window (no end posted); re-read from Nov 28. Macy's and Rockefeller pages unreadable. Chicago page: prices hide Dec 5 (Metra Dec 14); re-read from Nov 26; parade time from tourism board (organizer site still 2025): re-read from Nov 20.
- Holiday parks: re-read prices before Nov 29. Dyker, Secret NYC: from Nov 27.
- SD, NYC, Orlando, London Google listings leave pages 2027-01-08: run generate-pages and commit then (listing/PV tests fail).
- JetBlue bag card: expires Nov 19, read jetblue.com/legal/fees from Nov 12 to re-date and extend through peak dates.
- Cancun, PV: regenerate Dec 18, Dec 25, Jan 15 or byte tests fail (PV example-stay: by Jan 8). bso.org from Nov 18.
- NYC teens: Growler, High Line, MoMI, Tenement, Yankee pregame read 11-09 (High Line hours end Nov 30: re-read from Dec 1); Broadway League, MoMA family, Yankee guide 11-11; broadway.org/shows, NYC Parks July 26. Orlando with kids: official facts read 11-06; re-read from Nov 20.
- SD itinerary: zoo hours to Nov 25; Balboa parking rates end 2026.
- Q19: LV/Chicago/SA Jan 19 prices: regenerate by Jan 12 (guard test); Feb dates have no committed guard.
- NYC, DC, Boston, SD hotels (G18): regenerate by Dec 18, Dec 25, Jan 15; guard tests fail then. Weekly refresh: NYC, Chicago, SD, SA, DC, Boston, Orlando, LV, Cancun done Nov 14 (next from Nov 21; PV done; SD facts re-read Nov 14).
- Six Flags Silver (NJ, TX, IL): offers read Nov 13 (no child price/Pre-K Pass); next from Nov 20; ends Nov 30.
- Busch Fun Card: listed to Nov 15 (read Nov 13, so weekly rule: re-read offers + Fun Card pages from Nov 20, relist then if still on sale); extending moves saver_flag, hub_deadline, test dates. NYC lantern card (Nov 15): re-read for child/date prices from Nov 22; Polar Express (Kingston) card: re-read peak dates/times from Nov 22. Herald carousel: re-read from Nov 22. Orlando Magic Show card (unpriced): re-read show page from Nov 22.
- SA ice! card: re-read the ticket calendar for a price from Nov 16 (JS-only 11-09). SA kids page: Morgan's 'closed for the season' (calendar Nov 15): re-read calendar from Nov 22. SA teens: Holiday in the Park line (to Jan 4, 2027) must drop by Jan 5. Bass Pro Santa (SA card): breakfast Dec 5 and story time lines drop themselves; card ends Dec 24.
- Event markup (open events, read ≤30 days): Boston City listings lose it Nov 28 (re-read from Nov 20); DC Wharf + Mount Vernon Dec 5 (re-read by Dec 4); move tools/holiday-event-markup.test.mjs dates with the re-read.
- Hotel study page: Christmas drops Dec 18, New Year Dec 25; add new G18 receipts to STUDY_CITIES.
- Jay Peak page: prices hide Dec 17 (re-read before).
- Killington page (G19): opening Nov 18 lead flips itself; tubing $ hide Dec 17; day ticket prices unread (persona B usefulness 3).
- Ski status chips: Mount Snow (read Nov 16) to Nov 23, Hunter/Windham to Nov 22: re-read status pages; Mount Snow hours from Nov 21.
- Indexability gate: noindex/404/foreign canonical on a sitemap URL fails deploy unless tools/indexability-approved.json has a row.
- UCRM card (Harlem): listed to Nov 24.

## Scoreboard (refresh on Mondays from the newest ops/gsc-snapshots/*.md and live checks)
| Metric | Baseline 2026-10-27 | Target 2026-11-13 |
|---|---|---|
| 28-day organic clicks / impressions | 8 / 3,202 (Sep 27–Oct 24) | ≥15 clicks good; 17 / 4,420 to Nov 10 (11-12) |
| Sitemap URLs indexed | 31/36 at baseline; 11-12: 77 of 77 priority indexed; sitemap 77 discovered | 36/36 or a reason per URL |
| Live pages with past-due dates or past-stay price samples | 7 (8 from Oct 28); 0 since c21010c (Oct 27) | 0 |
| Verified public releases per week (release.json SHA changes) | 0 since Oct 13; many daily since Nov 2; live 46693249 (11-09) | ≥4 |
| Sitemap URLs with <3 internal inbound links | 0 since b14da12 (Oct 27; min 34) | 0 |
| Pages at avg position ≤20 with ≥20 impressions | 5; 4 in 11-12 snapshot (LV, SA itineraries; SeaWorld SD deal; NYC Christmas) | ≥7 |

## Last run
- 11-17 01:04Z G19 Jay Peak conditions page live d43da0b7 ; reviews pass (persona 3.67, design 4.0).
