# QUEUE (work top to bottom; at most 15 items; finished items move to ops/runs as one line)
Format: status · size (S ≤1 run, M 1–2, L 2–3) · owner · gate.
R1 first (D44), then G items; Q items only for live-site defects. Research: docs/research/growth-*-2026-10-28.md.

## R1 Review backlog (D44, docs/plan/review-backlog-2026-11.md)
open · M/step · owner: D44/D46 · gate: none
Steps 1-5 done · 6 done c942ebd9 (holiday hotel study; re-render with each G18 holiday refresh) · 7 venue family-of-4 costs: most unpriced venues JS-only/blocked (docs/research/holiday-venue-costs-2026-11-13.md); Stone Zoo, Jingle Jets, Boston Pops still unpriced (Pops next from Nov 25) · 8 done af61eaea (tools/indexability-check.mjs before/after each deploy; approvals in tools/indexability-approved.json). #11 brand pages: 5 done (ops/runs); Great Wolf gated (no observed family-of-4 price); deck: 5 cards/weekday. #12 done (NYC Xmas c9613b3c). #12 (D52): halve 10 pages (order/rules: review-backlog #12). Pages 1-8: owner session (skip); operator pages 9-10 done.

## G19 Resort conditions pages (D47/D48, 11-14: fast)
open · M · owner: D47/D48 · gate: none
docs/plan/resort-conditions-pages.md. Live: 12 East + 12 West (SHAs: ops/runs); Holiday Valley live d511f637 (woods hero; swap for a slope photo if one appears). P2s: dedupe sources; status card cost line (local cam times + status link done 27215b93). Schweitzer held (no winter photo; q/G19-schweitzer). cost_cue(+_basis) live: Wolf Creek, Jay Peak, Timberline, Mt Bachelor, Snowbird; Jackson Hole waits for a youth ticket $. SHAs: ops/runs. Hunter/Windham status 11-22 df534152; VT status 11-23 023bdcbc (footer dates fixed a86d9732; P3: Hunter chipless card, plan line home/childcare/getting-here undated keys, "unless dated" wording plainer); next P3s: NY vs states, footer "Skiing nearby" rename, region field. P3s in ops/runs.

## G18 Hotel prices: weekend + holiday samples (owner D39, 11-05)
open · M · owner: D39 Approved (all hotel pages) · gate: D8 budget
Protocol docs/plan/hotel-price-samples.md; sweep docs/plan/retros/2026-11-05-hotel-price-scenario.md. D40 cycle done. Weekly refresh (SHAs: ops/runs): NYC, Chicago, SD, SA Nov 21; DC, Boston, Orlando Nov 22; LV Nov 22 35f06470 (glance one-night P2 done 02282d8d); Cancun Nov 22 1b7967a6 (study skips hand-typed: re-check each refresh); PV Nov 22 6c8e50dc; next NYC/Chicago/SD/SA from Nov 28; next SA re-price: re-read July 26 review themes/linked pages; persona P2s ops/runs 13:05Z; LV MGM (4) + Hilton rooms facts still July 22 (labelled older, O50): re-read when reachable; 2-night sums live (7dd6c3be, 70bab47e).

## G16 Holiday + Black Friday durable pages + trend fast lane (owner D32, 11-03: go all in)
open · L · owner: D32 Approved · gate: none; before G15/D23
Evidence: docs/research/growth-strategy-2026-11-03.md, dataforseo-growth-deal-search-2026-11-03.json (peak Nov-Dec, KD 0-5; no existing URL fits). New URLs, no year in the slug, refreshed in place each season. Order (owner 11-03): 1) Black Friday/Cyber Monday family travel deals, each scored with the spend-vs-save card: first version live 11-04, then updated as offers drop; 2) trend fast lane (docs/plan/trend-fast-lane.md): treat ops/trend-watch/flags.json like deal-watch flags: high flags pre-empt all but live defects; same-day verified trend check + fast-lane post; 3) theme-park holiday events (dates, family-of-4 cost, best nights for small kids); 4) city holiday pages NYC, Chicago, San Diego, Orlando, San Antonio, DC (Thanksgiving to New Year: lights, zoo lights, train shows, Santa, parades; free vs paid, family-of-4 cost, ages, stroller, book-ahead; "New this week" trend cards on top); 5) one page per recurring offer (Fun Cards, Great Wolf, LEGOLAND passes). 6) Holiday calendar (owner 11-09): docs/plan/holiday-calendar-2026.md; when no higher step is due, take the earliest open row past its watch-from, one item per run, and mark its status there. Link from /this-week/ and /deals/. All 3 reviews per release (in parallel). Step 1 live 11-04 (card SHAs: ops/runs). Step 2: normal flags one per run after a first check. Brookfield Holiday Magic 11-22 (no child $; next Nov 29); Orlando Carol re-read Nov 22. NYC carousel re-read 11-22 (next Nov 29). Orlando Magic Show re-read 11-22 (next Nov 29). Step 3: 10 parks live 11-04 (+Disney, Universal, Knott's, Dollywood if readable). Step 4: six city pages live 11-04; LV page live (O51), Glittering Lights card 11-21. City cards since: SHAs in ops/runs. NPS tree viewing dates when posted. Fresh items may carry dated `changes`.

## G17 Reach: internal links + social formats (owner D37, 11-04)
open · M · owner: D37 Approved · gate: none; after G16 Black Friday follow-ups
1) Internal links live 11-04 (179c59ae). 2) Social: holiday-first; carousels; FB link in 1st comment. Reels v4 11-07 (judge in ops/social-insights); photos in ops/media/reel-photos.json (holiday shots for Christmas events only, no lit tree before lighting); hold list in ops/media/reels.json. All 3 reviews.

## Q21 Review system v2: fix repeat design issues once (owner 11-04)
open · M · owner: D23/D35 · gate: none; after Black Friday, before more G16 pages
Steps 1, 2, 4 live 20b0dd9c. Persona P2s: NYC/LV glance boxes, itinerary plan box at 1280 (ops/runs 11-07 05:04Z). Step 3 left: per-city photo sets (D17) so heroes are relevant, never repeated; 27 unique on 73 pages; recheck LV stay file page; SD stay, DC itinerary, Boston itin., SeaWorld SA deal, chrome pages done (SHAs: ops/runs). Left: home/SD kids (this-week c54b2093); hubs show top deal photo by design. All 3 reviews.

## D23 Design system restyle (owner 2026-10-30, D23 Approved)
open · L · owner: D23 Approved (batches, all pages) · gate: each batch passes integrity + persona + design review (docs/plan/design-review.md)
Released: batches 1-3r and itineraries 4b-4e. Cancun table live 91629553 (11-05); persona follow-ups in ops/runs 13:04Z. Boston restyled 42419976. PV table withheld until a suite has an observed family price (persona 2.9; legalese); then add dc-ds. LV itinerary live 3be93ad6 (11-05).

## G13 Page quality: weekly and on demand
open · M · owner: none · gate: none
Steps 1-2 done (tools/site-health.mjs). Fix list (Flyover, LV teens, NYC hotels done; P2s ops/runs 06:04Z). 3) SD hotels superseded by G18 SD (design 4.0, 11-07). 4) July-August checks: re-read facts by traffic (done: Orlando kids (re-read 11-20 7e26d0ba), DC itin. (re-read 11-20 6e00af80), Boston, LV itin., SA stay+areas, SD stay areas (hotel FAQs July 20 left), Chicago itin./stay/areas/teens, SA kids d6a12d34, SD kids venue facts c0f455c6 (11-15), Boston 79f73b31 (11-21), SA teens 4e2c9267 (11-15), NYC teens 35c5aa0e; SD hotels e1f1f5ed; Chicago Langham Kids Suite a28d28fa; SHAs in ops/runs; next by traffic). Weekly: site-health.mjs --links --write, persona + design of changed + top 3 pages. On demand: OWNER.md "review <page or all>".

## G09w Deal-watch flags (recurring; keep this item open)
open · S · owner: D15 Approved · gate: ops/deal-watch/flags.json has a pending flag (none → skip this item)
One flag (or one operator's batch of flags) per run, before other items; live-site defects still first. For each flag: `changed` → read the official page once unless read <7 days ago (then use the extract) (WebSearch on the operator's domain, then WebFetch), verify what changed, update or add the deal check (deal-checks.json + docs/research/deal-checks-*.md) and today's queue if worth sharing (G09 scoring once built); `blocked`/`unreachable` → do not retry; note it in G05 carry. Then delete the flag from flags.json in the same commit. A flag is a lead. On a flags.json push conflict, merge (never rebase) and keep the watcher's other flags.
P2: 'Listed until' chip reads as deadline (all no-end-date deals). Re-reads: SeaWorld SA read 11-22 (to Nov 29; next from Nov 29); SeaWorld Orlando from Nov 23; Busch Tampa + Williamsburg Nov 27; RC terms read 11-21 (next Nov 28); NCL terms from Nov 26 (BF 50% off, no fare/book-by); Margaritaville BF sale re-read 11-21 (row to Nov 29); early-access page from Nov 22 ($50/night, no unit); Club Med BF terms; LEGOLAND CA/FL pass BF: re-read Nov 28.

## G11 Deal content v3: spend-vs-save + concise (posting resumed 10-31, D12)
open · M · owner: D11/D15/D19/D21 Approved · gate: none; do first
v3 FIRST (owner 2026-10-30, AGENTS.md Content Standard): spend-vs-save card at the top of every deal page and post, concise top (validator: ≤30 words), stricter persona gate. Delivered: 7 deal cards incl. LEGOLAND FL and Club Med (page only); D22 (only real deals, ≥5%, are posted/promoted). P3s and SHAs in ops/runs. Next: spend_save for the remaining deal pages, ≤3 per release (needs an observed "without" figure per deal); then make the card required for posting. --refresh current queues.

## G12 Trip-cost data for the glance test
open · M · owner: D20 Approved · gate: none for hotels (DataForSEO); flights need the SERPAPI_API_KEY secret (owner T3)
Steps 1-3 done 10-30. 4) LEGOLAND FL done; Great Wolf/Atlantis no Google prices; flights need SERPAPI_API_KEY.

## G08 Post through Zernio
open · S · owner: D14 Approved · gate: none
Left: drop Meta/Pinterest paths.

## G09 Deal fast lane: first, verified, worth sharing
open · S · owner: D15/D16 Approved · gate: use only when a deal is verified on its official page today
Fast lane : `node tools/social-queue.mjs <today> --fast <check-id>` puts a deal observed today into today's queue at the next slot (≥20 min out). Run it on a fresh main just before release. Caps hold, one deal a day (a pending deal gives way only to an equal or better one), and posted entries are locked. In the same commit, regenerate every later queue it reports and render the cards (`node tools/social-cards.mjs <date>`). Left: a real same-day use. Late fast deals: Threads/Pinterest only (O20).

## G05 Daily fresh sweep (recurring; keep this item open)
open · S per day · owner: D10/D11/D12 Approved · gate: none (G01 done)
First run after 06:00 ET each day: run `node tools/this-week.mjs` and commit if site/this-week changed; check the recurring sources (official pages first; news/deal sites as leads only), add newly verified items, remove expired ones, edit tools/page-generation/fresh-items.json (research: docs/research/this-week-items-*.md), refresh /this-week/ and /deals/ (tools/page-generation/deal-checks.json; record in docs/research/deal-checks-*.md; add new verified checks), and queue the next day's posts (`node tools/social-queue.mjs <date>`, `node tools/social-cards.mjs <date>`, then `node tools/social-reels.mjs <date>` and commit its .mp4/.jpg with the queue; regenerate a current queue whenever its records change): about 5–6 across all platforms Nov–Dec, 2–3 off-season, never filler.
Queued to Nov 24 (skips in file; no reels, D46); Nov 25+ next (SeaWorld Orlando waits for Nov 23 re-read; ZooLights DC re-read first). Beaches page only; Velas lead Nov 9. Blocked (no unchanged retry): margaritavilleatsea.com BF (robots 403), beaches.com/specials, MSC pages, Rockefeller tree, macys.com, Disneyland, Kalahari, Aulani, Hyatt Inclusive, Dollywood, Disney Cruise. Hersheypark 2027 prices: re-read (unpublished Nov 8).

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
