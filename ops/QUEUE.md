# QUEUE (work top to bottom; at most 15 items; finished items move to ops/runs as one line)
Format: status · size (S ≤1 run, M 1–2, L 2–3) · owner · gate.
R1 first (D44), then G items; Q items only for live-site defects. Research: docs/research/growth-*-2026-10-28.md.

## R1 Review backlog (D44, docs/plan/review-backlog-2026-11.md)
open · M/step · owner: D44/D46 · gate: none
Steps 1-5 done (ops/runs 11-13) · 6 done c942ebd9 (/holidays/holiday-hotel-prices-family-of-4.html; re-render with each G18 holiday refresh; pitch is #19, owner) · 7 venue family-of-4 costs: most unpriced venues are JS-only or blocked (11-13 failures: docs/research/holiday-venue-costs-2026-11-13.md); 11-17: Stone Zoo and Jingle Jets still unpriced (fee/terms added); next Boston Pops from Nov 18 · 8 done af61eaea (tools/indexability-check.mjs before/after each deploy; approvals in tools/indexability-approved.json). D46 #11 brand pages (PASS_BRANDS): SeaWorld, Six Flags, Sesame Place, LEGOLAND, Busch done (SHAs in ops/runs); hero_beside on all 5; Great Wolf brand page gated: no observed family-of-4 price; deck: 5 cards/weekday (review-deck.md).

## G19 Resort conditions pages (D47/D48, 11-14: fast)
open · M · owner: D47/D48 · gate: none
docs/plan/resort-conditions-pages.md. Live (SHAs in ops/runs): Okemo, Mount Snow, Hunter, Windham, Killington (day prices unread), Jay Peak, Stowe, Sugarbush, Stratton, Seven Springs, Winter Park (11-17, first West; far pages: nyc_link false, NO_HOLIDAY_NUDGE), Bogus Basin, Breckenridge, Park City (11-17); Holiday Valley held (hero). P2: West pages need own footer group/related heading; cam times in local time. Next: Vail.

## G18 Hotel prices: weekend + holiday samples (owner D39, 11-05)
open · M · owner: D39 Approved (all hotel pages) · gate: D8 budget
Protocol docs/plan/hotel-price-samples.md; sweep docs/plan/retros/2026-11-05-hotel-price-scenario.md. D40 cycle done. Weekly refresh: all ten cities done Nov 14; next NYC/Chicago/SD/SA from Nov 21, the rest from Nov 22 (SD: re-read Aug 17 facts first); persona P2s ops/runs 13:05Z; LV MGM (4) + Hilton rooms facts still July 22 (labelled older, O50): re-read when reachable; 2-night sums live (7dd6c3be, 70bab47e).

## G16 Holiday + Black Friday durable pages + trend fast lane (owner D32, 11-03: go all in)
open · L · owner: D32 Approved · gate: none; before G15/D23
Evidence: docs/research/growth-strategy-2026-11-03.md, dataforseo-growth-deal-search-2026-11-03.json (peak Nov-Dec, KD 0-5; no existing URL fits). New URLs, no year in the slug, refreshed in place each season. Order (owner 11-03): 1) Black Friday/Cyber Monday family travel deals, each scored with the spend-vs-save card: first version live 11-04, then updated as offers drop; 2) trend fast lane (docs/plan/trend-fast-lane.md): treat ops/trend-watch/flags.json like deal-watch flags: high flags pre-empt all but live defects; same-day verified trend check + fast-lane post (first leads: docs/research/trend-leads-2026-11-03.md); 3) theme-park holiday events (dates, family-of-4 cost, best nights for small kids); 4) city holiday pages NYC, Chicago, San Diego, Orlando, San Antonio, DC (Thanksgiving to New Year: lights, zoo lights, train shows, Santa, parades; free vs paid, family-of-4 cost, ages, stroller, book-ahead; "New this week" trend cards on top); 5) one page per recurring offer (Fun Cards, Great Wolf, LEGOLAND passes). 6) Holiday calendar (owner 11-09): docs/plan/holiday-calendar-2026.md; when no higher step is due, take the earliest open row past its watch-from, one item per run, and mark its status there. Link from /this-week/ and /deals/. All 3 reviews per release (in parallel). Step 1 live 11-04; Westgate, Margaritaville unpriced; Busch $89.99 b44ce707; HR Punta Cana 01e9aaa7; Royalton BF unread (fetch fails); Six Flags SHAs in ops/runs. Step 2: normal flags one per run after a first check. Santa cards live 11-10 (Chicago, NYC, SD, Boston; SHAs in ops/runs). SA Zoo Lights 46693249, priced 2120d18e; SA caverns priced d65f26ef, Rock re-read ab02883e (11-11). NYBG re-read from Nov 17. JetBlue bag prices live 15095b2d (re-read from Nov 12). Brookfield 26e798fb (child price: re-read from Nov 22); Step 3: 10 parks live 11-04 (add Disney, Universal, Knott's, Dollywood when readable). Step 4: six city pages live 11-04. LV: branch q/G16-lv-christmas, O51. DC tree lottery closed cbd5fa75; Chicago parade time a1d01860; Universal Orlando card 35816bcc (no day-ticket price); Orlando Carol 3b6195c4 (re-read from Nov 22); add viewing dates when NPS posts them (read from Nov 11).

## G17 Reach: internal links + social formats (owner D37, 11-04)
open · M · owner: D37 Approved · gate: none; after G16 Black Friday follow-ups
1) Internal links live 11-04 (179c59ae). 2) Social: holiday-first; carousels; FB link in 1st comment. Reels v4 11-07; judge by skip/avg watch in ops/social-insights (5+ reels); photos in ops/media/reel-photos.json (holiday shots for Christmas events only, no lit tree before lighting); hold list in ops/media/reels.json. All 3 reviews.

## Q21 Review system v2: fix repeat design issues once (owner 11-04)
open · M · owner: D23/D35 · gate: none; after Black Friday, before more G16 pages
Steps 1, 2, 4 live 20b0dd9c. Persona P2s: NYC/LV glance boxes, itinerary plan box at 1280 (ops/runs 11-07 05:04Z). Step 3 left: per-city photo sets (D17) so heroes are relevant, never repeated; 27 unique on 73 pages; recheck LV stay file page; SD stay, DC itinerary, Boston itin., SeaWorld SA deal, chrome pages done (SHAs in ops/runs). Left: home/SD kids (this-week c54b2093); hubs show top deal photo by design. All 3 reviews.

## D23 Design system restyle (owner 2026-10-30, D23 Approved)
open · L · owner: D23 Approved (batches, all pages) · gate: each batch passes integrity + persona + design review (docs/plan/design-review.md)
Released: batches 1-3r and itineraries 4b-4e. Cancun table live 91629553 (11-05); persona follow-ups in ops/runs 13:04Z. Boston restyled 42419976. PV table withheld until a suite has an observed family price (persona 2.9; legalese); then add dc-ds. LV itinerary live 3be93ad6 (11-05).

## G13 Page quality: weekly and on demand
open · M · owner: none · gate: none
Steps 1-2 done (tools/site-health.mjs, ops/page-reviews.json, ops/site-health/). Fix list (Flyover, LV teens, NYC hotels done; P2s ops/runs 06:04Z). 3) SD hotels superseded by G18 SD (design 4.0, 11-07). 4) July-August checks: re-read facts by traffic (done: Orlando kids, DC, Boston, LV itin., SA stay+areas, SD stay areas (hotel FAQs July 20 left), Chicago itin./stay/areas/teens, SA kids d6a12d34, SD kids venue facts c0f455c6 (11-15), SA teens 4e2c9267 (11-15), NYC teens 35c5aa0e; SD hotels e1f1f5ed; Chicago Langham Kids Suite a28d28fa; SHAs in ops/runs; next by traffic). Carry P3s: empty tables; nested sections. Weekly: site-health.mjs --links --write, persona + design of changed + top 3 pages. On demand: OWNER.md "review <page or all>".

## G09w Deal-watch flags (recurring; keep this item open)
open · S · owner: D15 Approved · gate: ops/deal-watch/flags.json has a pending flag (none → skip this item)
One flag (or one operator's batch of flags) per run, before other items; live-site defects still first. For each flag: `changed` → read the official page once unless read <7 days ago (then use the extract) (WebSearch on the operator's domain, then WebFetch), verify what changed, update or add the deal check (deal-checks.json + docs/research/deal-checks-*.md) and today's queue if worth sharing (G09 scoring once built); `blocked`/`unreachable` → do not retry; note it in G05 carry. Then delete the flag from flags.json in the same commit. A flag is a lead. On a flags.json push conflict, merge (never rebase) and keep the watcher's other flags.
Great Wolf EBF to Nov 22 (read 11-16). Re-reads: Six Flags, SeaWorld Orlando Nov 20; Margaritaville Nov 21-22 (11-16 flag "$50/night", no unit: check then); Royal Caribbean BF terms Nov 17; NCL, Club Med Nov 18.

## G11 Deal content v3: spend-vs-save + concise (posting resumed 10-31, D12)
open · M · owner: D11/D15/D19/D21 Approved · gate: none; do first
v3 FIRST (owner 2026-10-30, AGENTS.md Content Standard): spend-vs-save card at the top of every deal page and post, concise top (validator: ≤30 words), stricter persona gate. Delivered: 7 deal cards incl. LEGOLAND FL and Club Med (page only); D22 (only real deals, ≥5%, are posted/promoted). P3 lists moved to ops/runs/2026-11.md (11-03 owner session). Atlantis card released d12ac83a (11-02; P3s ops/runs 03:05Z). SeaWorld SD, SA, Sesame SD released 11-01 (P3s ops/runs). Next: spend_save for the remaining deal pages, ≤3 per release (needs an observed "without" figure per deal); then make the card required for posting. --refresh current queues.

## G12 Trip-cost data for the glance test
open · M · owner: D20 Approved · gate: none for hotels (DataForSEO); flights need the SERPAPI_API_KEY secret (owner T3)
Steps 1-3 done 10-30. 4) LEGOLAND FL done; others Google prices (Great Wolf/Atlantis none); flights need SERPAPI_API_KEY.

## G08 Post through Zernio
open · S · owner: D14 Approved · gate: none
Left: drop Meta/Pinterest paths.

## G09 Deal fast lane: first, verified, worth sharing
open · S · owner: D15/D16 Approved · gate: use only when a deal is verified on its official page today
Fast lane : `node tools/social-queue.mjs <today> --fast <check-id>` puts a deal observed today into today's queue at the next slot (≥20 min out). Caps hold, one deal a day (a pending deal gives way only to an equal or better one), and posted entries are locked. Run it on a fresh main just before release. In the same commit, regenerate every later queue it reports and render the cards (`node tools/social-cards.mjs <date>`). Left: a real same-day use. Late fast deals reach only Threads/Pinterest (FB cap spent by 10:00, O20).

## G05 Daily fresh sweep (recurring; keep this item open)
open · S per day · owner: D10/D11/D12 Approved · gate: none (G01 done)
First run after 06:00 ET each day: run `node tools/this-week.mjs` and commit if site/this-week changed; check the recurring sources (official pages first; news/deal sites as leads only), add newly verified items, remove expired ones, edit tools/page-generation/fresh-items.json (research: docs/research/this-week-items-*.md), refresh /this-week/ and /deals/ (tools/page-generation/deal-checks.json; record in docs/research/deal-checks-*.md; add new verified checks), and queue the next day's posts (`node tools/social-queue.mjs <date>`, `node tools/social-cards.mjs <date>`, then `node tools/social-reels.mjs <date>` and commit its .mp4/.jpg with the queue; regenerate a current queue whenever its records change): about 5–6 across all platforms Nov–Dec, 2–3 off-season, never filler.
Queued to Nov 17 (skips to reword: Orlando Festival of Trees, Chicago Dan Ryan "inbound", Bronx Lights $42.95 wording, birds two sources, Air and Space, Grand Central, Meadowlark); Nov 18+ next. Beaches page only; Velas lead Nov 9. Blocked (no unchanged retry): margaritavilleatsea.com BF (robots 403), beaches.com/specials, MSC pages, Rockefeller tree, macys.com, Disneyland, Kalahari, Aulani, Hyatt Inclusive, Dollywood, Disney Cruise. Hersheypark 2027 prices: re-read (unpublished Nov 8).

## Q12 Refresh Las Vegas family-hotels (279 impressions, 2 clicks, July prices)
open · L · owner: D7 Approved · gate: none · Acceptance: as Q07 for site/where-to-stay/las-vegas-family-hotels.html.

## NOT NOW (do not select; the site itself is not frozen)
- Newsletter (owner 11-03: too early), analytics (revisit when G16 pages launch), press pitches (after G16 pages), Pinterest (later), YouTube, TikTok.
- Q09c lodging readability P3s (paused 11-03 for G16; P3 list in git history before 2026-10-31 13:00Z).
- Offline CLIs/"output isolation" work, source-governance pilot, evidence-batch tooling, NWS forecast pilot.
- New micro-calculators that only multiply numbers the parent types in.
- Community drafts, outreach, analytics, monetization (external actions; need owner approval anyway).
- Removing the SD meta-refresh stubs; CTR/title tests (≤60-char titles: R1); FAQPage schema additions.
- Due-review research that changes nothing public.
