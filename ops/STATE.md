# STATE (operator working state; keep ≤8 KB; overwrite, don't append)

authority: owner-directed cloud scheduled task; hourly from 2026-10-27 10:00 until 2026-12-08 10:00 ET (owner 2026-10-29: hourly through the Black Friday deal window), then every 4 hours; ends 2027-01-15 17:00 America/New_York (extended by owner 2026-10-28)
caps: 1 transaction per run; daily_cap=none (owner 2026-10-27: no daily limit; the run cadence and the 90-minute lock are the only throttle)
today: 2026-11-14 transactions=7
run: {id: 2026-11-14T13:04:54Z, started_at: 2026-11-14T13:04:54Z}
last_public_release: f66b8ab9 Chicago hotel prices re-observed Nov 14 (hotels, stay, holiday study pages)
active: none

## Holds (one line each: what, unblock condition)
- Deal watch (G09): watcher commits flags to main hourly; fetch/merge before releasing.
- LEGOLAND CA/FL pass checks: listed to Nov 21; re-read from Nov 21. Busch Williamsburg Fun Card listed to Nov 15 (banner file name); re-read from Nov 21.
- Deer Valley: no daily ticket price (tickets pages read Nov 14, store JS-only); Kids Ski Free page re-read from Nov 16.
- /deals/ checks end Nov 20 (Sesame Philly, LEGOLAND NY passes: no end date; re-read from Nov 20; deals-pages.test pins 11-14 (some 11-13)), Nov 17 (LEGOLAND California hotel package), Nov 20 (SeaWorld Orlando Fun Card: Tickets page read 11-13 showed $104.99 presale, Fun Card page $144.99; re-read either from Nov 20; offers page from Nov 17), Nov 22 (Atlantis; year is our reading), Dec 1 (Beaches Black Friday), Jan 6 (Club Med); SeaWorld SD/SA and Sesame SD Black Friday presale dropped Nov 9: re-read from Nov 15 to relist; committed pages must match today's render.
- /this-week/ expires daily: deploy (05:17 UTC) refreshes live; re-render the committed copy (`node tools/this-week.mjs`, commit) on the first run each Eastern day or tests fail. SD kids/teens ticket prices (11-01): re-observe after Dec 1.
- Social posting (G04/G08 Zernio): Only Facebook connected (others logged `not_connected`). Receipts land in ops/social-receipts/ on main: fetch and merge before releasing. A failed or stuck "attempting" receipt is never retried; report it to the owner.
- Social queues: committed through Nov 16 (G05). While a queue date is today or later, tools/social-queue.test.mjs fails if its records change: regenerate the queue (and cards) in the same commit; regeneration keeps stored skips. Text-only: `node tools/social-queue.mjs <date> [--skip <id> "<reason>"]`; regenerating an older date reselects.
- Growth-first (D10–D12): G items before old Q items, except live-site defects and Q17b. D22: only real deals (card saves ≥5%) are queued, posted or promoted; regenerate queues when a card changes.
- DC itinerary facts re-read 11-06 (clock to Nov 20); NMNH stroller line (Oct 27): drop or re-source.
- GitHub stuck runs (11-11): a deploy queued >20 min with 0 jobs gets one new dispatch (cancel returns 409). bso.org prices: from Nov 18.
- Boston itinerary facts re-read 11-07 (due Nov 21); mos.org faq 11-09 (due Nov 23); Aquarium prices, MBTA fares unknown (JS-only; mbta.com robots.txt blocks AI agents, do not fetch).
- SD Christmas page: prices hide Dec 2-5; re-read from Nov 28. Orlando Christmas page: Nutcracker unpriced (re-read from Nov 18); Gatorland, Crayola prices (Oct 27) hide Nov 27, rest Dec 3-5; re-read from Nov 20; Mickey's party ends Dec 22. SA Christmas page: SeaWorld price hides Dec 2, rest Dec 5; Zoo Lights priced 2120d18e (visit read Nov 11; $ hides Dec 11, Locals Day $ Dec 9); caverns priced d65f26ef ($ hides ~Dec 11; hours/parking not posted, re-read from Nov 18). DC Christmas page: NPS tree page re-read Nov 11 unchanged (no viewing dates; next from Nov 18); edit "winners told Nov 12" after Nov 12; Enchant DC read Nov 11 (no free-kids offer; next from Nov 18); ice! price JS-only on tickets.gaylordnational.com (read Nov 9; FAQ/home re-read due Nov 16).
- NYC Christmas page: prices hide Dec 4 (read Nov 3); re-read from Nov 25. Santaland card from Macy's Oct 22 release only (no opening date, hours, photo price); listing window to Dec 24; add dates when an official page is readable. Grand Central train show: Nov 30 is our window (no end posted); re-read from Nov 28. Macy's and Rockefeller pages unreadable. Chicago page: prices hide Dec 5; re-read from Nov 26; parade time from tourism board (organizer site still 2025): re-read from Nov 20.
- Holiday parks page: re-read park prices before Nov 29. Dyker tour, Secret NYC: from Nov 27.
- SD, NYC, Orlando and London Google listings leave their pages 2027-01-08: the *-google-sample/-listing tests (and PV example-stay test) fail from that date until `node tools/generate-pages.mjs` is run and committed.
- JetBlue bag card: expires Nov 19, read jetblue.com/legal/fees from Nov 12 to re-date and extend through peak dates.
- Cancun (ddbe75f4), PV (19cd3291): this-week re-renders drops; regenerate Dec 18, Dec 25, Jan 15 or byte tests fail (PV example-stay test: by Jan 8). Refresh holiday prices from Nov 12.
- NYC teens: Growler, High Line, MoMI, Tenement, Yankee pregame read 11-09 (High Line hours end Nov 30: re-read from Dec 1); Broadway League, MoMA family, Yankee guide 11-11; broadway.org/shows, NYC Parks July 26 (site fetch failures). Orlando with kids: official facts read 11-06; re-read from Nov 20.
- SD itinerary: zoo hours to Nov 25; Balboa parking rates end 2026.
- Q19: LV/Chicago/SA Jan 19 prices: regenerate by Jan 12 (guard test); Feb dates have no committed guard.
- NYC, DC, Boston, SD hotels (G18): regenerate by Dec 18, Dec 25, Jan 15; guard tests fail then. Weekly refresh: NYC, Chicago done Nov 14 (next from Nov 21); SD, SA, DC, Boston, Orlando next, one per run.
- Six Flags Silver (NJ, TX, IL): all offers pages re-read Nov 13, IL pass + tickets pages too (no child price, no Pre-K Pass, footnotes have no text); next re-read from Nov 20; ends Nov 30.
- Disney water park card drops Nov 15; re-read tickets from Nov 15. Air and Space jets gallery: from Nov 16.
- Busch Fun Card: relisted 85a83483 to Nov 15 (file names "endsnov15"; $89.99, Save 40%); re-read offers + Fun Card pages from Nov 15; extending moves saver_flag, hub_deadline, test dates.
- SA ice! card: re-read the ticket calendar for a price from Nov 16 (JS-only 11-09). Bass Pro Santa (SA card): breakfast Dec 5 and story time lines drop themselves; card ends Dec 24.
- Event markup (open events, read ≤30 days): Boston City listings lose it Nov 28 (re-read from Nov 20); DC Wharf + Mount Vernon Dec 5 (re-read by Dec 4); move tools/holiday-event-markup.test.mjs dates with the re-read.
- Hotel study page: Christmas drops Dec 18, New Year Dec 25; add new G18 receipts to STUDY_CITIES.
- Deploy indexability gate: a live sitemap URL turning noindex/foreign canonical/404/robots-blocked fails the deploy unless tools/indexability-approved.json has an OWNER D row; brand-page work (D46) must keep ended deals self-canonical or add an entry.

## Scoreboard (refresh on Mondays from the newest ops/gsc-snapshots/*.md and live checks)
| Metric | Baseline 2026-10-27 | Target 2026-11-13 |
|---|---|---|
| 28-day organic clicks / impressions | 8 / 3,202 (Sep 27–Oct 24) | ≥15 clicks good; 16 / 4,146 to Nov 7 (11-09) |
| Sitemap URLs indexed | 31/36 at baseline; 11-09: 72 of 74 priority URLs indexed, 0 unknown; sitemap 73 discovered, read 2026-11-07 | 36/36 or a reason per URL |
| Live pages with past-due dates or past-stay price samples | 7 (8 from Oct 28); 0 since c21010c (Oct 27) | 0 |
| Verified public releases per week (release.json SHA changes) | 0 since Oct 13; many daily since Nov 2; live 46693249 (11-09) | ≥4 |
| Sitemap URLs with <3 internal inbound links | 0 since b14da12 (Oct 27; min 34) | 0 |
| Pages at avg position ≤20 with ≥20 impressions | 5; 7 in 11-09 snapshot (LV, SA, Chicago, Boston itineraries; SA teens; SeaWorld SD deal; SD Christmas) | ≥7 |

## Last run
- 11-14 12:05Z G18: Chicago weekly price refresh (66 searches, $0.26); all 10 hotels now priced (Langham ≈ $571); study Chicago Christmas −16% -> −9%. Reviews passed; live f66b8ab9.
