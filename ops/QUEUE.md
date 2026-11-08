# QUEUE (work top to bottom; at most 15 items; finished items move to ops/runs as one line)
Format: status · size (S ≤1 run, M 1–2, L 2–3) · owner approval · gate.
Growth-first (OWNER D10–D12): G items first; Q items only for live-site defects and Q17b. Research: docs/research/growth-*-2026-10-28.md.

## G18 Hotel prices: weekend + holiday samples (owner D39, 11-05)
open · M · owner: D39 Approved (all hotel pages) · gate: D8 budget
Protocol docs/plan/hotel-price-samples.md; sweep docs/plan/retros/2026-11-05-hotel-price-scenario.md. D40 cycle done (SHAs in ops/runs). Left: holiday price refresh weekly from Nov 12; LV MGM (4) + Hilton rooms facts still July 22 (labelled older, O50): re-read when reachable; 2-night sums: glance 7dd6c3be, NYC cards 70bab47e; P3s ops/runs 10:04Z.

## G16 Holiday + Black Friday durable pages + trend fast lane (owner D32, 11-03: go all in)
open · L · owner: D32 Approved · gate: none; before G15/D23
Evidence: docs/research/growth-strategy-2026-11-03.md, dataforseo-growth-deal-search-2026-11-03.json (holiday and Black Friday searches peak Nov-Dec, KD mostly 0-5; distinct jobs, no existing URL fits). New URLs, no year in the slug, refreshed in place each season. Order (owner 11-03): 1) Black Friday/Cyber Monday family travel deals, each scored with the spend-vs-save card: first version live ASAP (target Nov 5), then updated as offers drop; 2) trend fast lane (docs/plan/trend-fast-lane.md): the watcher is being built in the owner session on q/G16-trend-watch (do not build it here); once merged, treat ops/trend-watch/flags.json like deal-watch flags: high flags pre-empt all but live defects; same-day verified trend check + fast-lane post (first leads: docs/research/trend-leads-2026-11-03.md); 3) theme-park holiday events (dates, family-of-4 cost, best nights for small kids); 4) city holiday pages NYC, Chicago, San Diego, Orlando, San Antonio, DC (Thanksgiving to New Year: lights, zoo lights, train shows, Santa, parades; free vs paid, family-of-4 cost, ages, stroller, book-ahead; "New this week" trend cards on top); 5) one page per recurring offer (Fun Cards, Great Wolf, LEGOLAND passes). Link from /this-week/ and /deals/. All 3 reviews per release (run the reviewers in parallel). Step 1 live 11-04, trust fixes cb266815; Westgate, Margaritaville unpriced; Busch $89.99 b44ce707; Royalton BF unread (fetch fails); Six Flags b6ee180d, 80b11d92, b9bb41a1; update as offers drop. Step 2: watcher merged; normal flags pending (Enchant DC from Nov 10), one per run after a first check; off-fit flags dropped 11-07; DiwaliSA d1afdee7, Wurstfest 94ca19d3, Walnut Room 64bfb464 (to Nov 21), Diwali NYC museums bc8df530 live; ChiTAG fair terms 7dbb2b2b (expires Nov 8). JetBlue bag prices live 15095b2d (first news item; re-read from Nov 12). Meadowlark, Brack Bash, Mag Mile, Aurora live 11-04 (63a4a2cb); queue posts in G05 (Kids Night Nov 11, Brack Bash Nov 14, NYC Veterans Day Parade Nov 11; re-read the organizer for its time). Step 3: 10 parks live 11-04 (/holidays/; add Disney, Universal price, Knott's, Dollywood when readable; Kings Island/Carowinds pages showed old years; re-read prices before Nov 29; P3s in ops/runs). Step 4: NYC live 11-04. Chicago live 11-04 (fd4ad0ee). San Diego, Orlando, San Antonio, DC (867694d3) live 11-04. DC tree lottery closed cbd5fa75; add viewing dates when NPS posts them (read from Nov 11).

## G17 Reach: internal links + social formats (owner D37, 11-04)
open · M · owner: D37 Approved · gate: none; after G16 Black Friday follow-ups
1) Internal links live 11-04 (179c59ae). 2) Social: holiday-first; carousels; FB link in 1st comment. Reels v4 11-07: spoken opener, Commons shots, Mixkit music, ~8 s; judge by skip/avg watch in ops/social-insights (5+ reels); photos in ops/media/reel-photos.json (holiday shots for Christmas events only, no lit tree before lighting); hold list in ops/media/reels.json. No IG Story link stickers (no API). All 3 reviews.

## Q21 Review system v2: fix repeat design issues once (owner 11-04)
open · M · owner: D23/D35 · gate: none; after Black Friday, before more G16 pages
Steps 1, 2, 4 live 20b0dd9c (11-07, D40 cycle). Persona P2 follow-ups: hotel glance boxes (NYC, LV) and itinerary plan box at 1280 read cramped with an empty right half; consider full-width list boxes with capped paragraphs (ops/runs 11-07 05:04Z). Step 3 left: per-city photo sets (D17) so heroes are relevant, never repeated; 27 unique on 73 pages; done through 5601ee03 (SD hotels: Hotel del); recheck LV stay file page; next: SD itinerary or SeaWorld SD deal (Mission Bay ×3; toddlers keeps it), SD stay/kids (zoo ×3). All 3 reviews.

## D23 Design system restyle (owner 2026-10-30, D23 Approved)
open · L · owner: D23 Approved (batches, all pages) · gate: each batch passes integrity + persona + design review (docs/plan/design-review.md)
Released: batches 1-3r and itineraries 4b-4e (SHAs and P3s in ops/runs/2026-11.md). Cancun table live 91629553 (11-05); persona follow-ups in ops/runs 13:04Z. Boston restyled 42419976. PV table withheld until a suite has an observed family price (persona 2.9; legalese); then add dc-ds. LV itinerary live 3be93ad6 (11-05).

## G14 Photo at the top of every page (owner 2026-10-29)
open · M · owner: D4/D17/D20 Approved (batches ok) · gate: none; before G13 step 2
Done through 17b989f. Remaining: 6 older deal pages via G11 v2 (most end Oct 31-Nov 3).

## G13 Page quality: weekly and on demand
open · M · owner: none · gate: none
Steps 1-2 done (tools/site-health.mjs, ops/page-reviews.json, first report ops/site-health/2026-11-03.md; next weekly links from 11-10). Fix list (Flyover, LV teens done): 2) NYC hotels done 6e6cb645 (11-07); P2s ops/runs 06:04Z. 3) SD hotels superseded by G18 SD (design 4.0, 11-07). 4) 26 pages show July-August checks: re-read facts by traffic (Orlando kids, DC done 11-06; Boston 8eec217e 11-07, MoS FAQ left; LV itinerary 5bf3c2ed, SA where-to-stay 3ffbbdba 11-07 (Downtown/Pearl/Northwest/Cultural Corridor area pages timed out, read from Nov 8); next: Chicago itinerary). Carry P3s: empty tables; nested sections; --accept. Weekly: node tools/site-health.mjs --links --write, persona + design of changed pages + top 3; fix items, no automatic edits. On demand: OWNER.md "review <page or all>".

## G09w Deal-watch flags (recurring; keep this item open)
open · S · owner: D15 Approved · gate: ops/deal-watch/flags.json has a pending flag (none → skip this item)
One flag (or one operator's batch of flags) per run, before other items; live-site defects still first. For each flag: `changed` → read the official page once unless read <7 days ago (then use the extract) (WebSearch on the operator's domain, then WebFetch), verify what changed, update or add the deal check (deal-checks.json + docs/research/deal-checks-*.md) and today's queue if worth sharing (G09 scoring once built); `blocked`/`unreachable` → do not retry; note it in G05 carry. Then delete the flag from flags.json in the same commit. A flag is a lead. On a flags.json push conflict, merge (never rebase) and keep the watcher's other flags.
Flags wait: Deer Valley from Nov 9, Royal Caribbean Nov 10. Margaritaville banner flag cleared 11-08 (no change). SeaWorld Orlando Fun Card extended to Nov 13 (9960bfc1); re-read its Fun Card page from Nov 13. Re-reads due: Margaritaville /current-offers/black-friday-sale by Nov 13; NCL "50% Off" from Nov 10; SeaWorld "Save Up To 60%" lead.

## G11 Deal content v3: spend-vs-save + concise (posting resumed 10-31, D12)
open · M · owner: D11/D15/D19/D21 Approved · gate: none; do first
v3 FIRST (owner 2026-10-30, AGENTS.md Content Standard): spend-vs-save card at the top of every deal page and post, concise top (validator: ≤30 words), stricter persona gate. Delivered: 7 deal cards incl. LEGOLAND FL and Club Med (page only); D22 (only real deals, ≥5%, are posted/promoted). P3 lists moved to ops/runs/2026-11.md (11-03 owner session). Atlantis card released d12ac83a (11-02; P3s ops/runs 03:05Z). SeaWorld SD, SA, Sesame SD released 11-01 (P3s ops/runs). Next: spend_save for the remaining deal pages, ≤3 per release (needs an observed "without" figure per deal: published regular prices, G12 hotel samples); then make the card required for posting. --refresh current queues.

## G12 Trip-cost data for the glance test
open · M · owner: D20 Approved · gate: none for hotels (DataForSEO); flights need the SERPAPI_API_KEY secret (owner T3)
Steps 1-3 done 10-30: LEGOLAND deal page shows a validated v2.price_sample "about $383 a night at the LEGOLAND Castle Hotel for 2+2 (kids 5, 8), 3 nights Dec 4-7" (auto-drops at stay start or deal end). Next: 4) LEGOLAND FL done (90f7c7c: Hotel $269 1n/$369 3n Dec 4; Pirate Island none; Beach Retreat $603 1n); others Google prices (Great Wolf/Atlantis showed none); flights need SERPAPI_API_KEY.

## G08 Post through Zernio
open · S · owner: D14 Approved · gate: none
Built 16e5ad8; FB and IG post via Zernio. Left: drop direct Meta/Pinterest paths + secrets.

## G09 Deal fast lane: first, verified, worth sharing
open · S · owner: D15/D16 Approved · gate: use only when a deal is verified on its official page today
Fast lane (11-01): `node tools/social-queue.mjs <today> --fast <check-id>` puts a deal observed today into today's queue at the next slot (≥20 min out). Caps hold, one deal a day (a pending deal gives way only to an equal or better one), and posted entries are locked. Run it on a fresh main just before release. In the same commit, regenerate every later queue it reports and render the cards (`node tools/social-cards.mjs <date>`). Left: a real same-day use. Reach: Facebook (cap 2) is usually spent by 10:00, so after that a fast deal reaches only Threads/Pinterest (not connected); see O20.

## G05 Daily fresh sweep (recurring; keep this item open)
open · S per day · owner: D10/D11/D12 Approved · gate: none (G01 done)
First run after 06:00 ET each day: run `node tools/this-week.mjs` and commit if site/this-week changed; check the recurring sources (official pages first; news/deal sites as leads only), add newly verified items, remove expired ones, edit tools/page-generation/fresh-items.json (research: docs/research/this-week-items-*.md), refresh /this-week/ and /deals/ (tools/page-generation/deal-checks.json; record in docs/research/deal-checks-*.md; three of the four Oct 28 checks end Oct 31–Nov 2, so add new verified checks), and queue the next day's posts (`node tools/social-queue.mjs <date>`, `node tools/social-cards.mjs <date>`, then `node tools/social-reels.mjs <date>` and commit its .mp4/.jpg with the queue; regenerate a current queue whenever its records change): about 5–6 across all platforms Nov–Dec, 2–3 off-season, never filler.
11-06 sweep 1e75ac9a (Disney kids dining unpriced, list to Nov 30). Queued to Nov 12 (b2331051); Nov 13+ next, add Great Adventure, Great America Silver. Beaches page only; Velas lead Nov 9. Blocked/refusing (no retry unchanged): beaches.com/specials, MSC pages, Rockefeller tree, macys.com, Disneyland, Kalahari, Aulani, Hyatt Inclusive, Dollywood, Disney Cruise. Re-observe: Hersheypark 2027 passes from Nov 8.

## Q12 Refresh Las Vegas family-hotels (279 impressions, 2 clicks, July prices)
open · L · owner: D7 Approved · gate: none · Acceptance: as Q07 for site/where-to-stay/las-vegas-family-hotels.html.

## Q14 Cycle go/no-go memo
open · S · owner: none · gate: on or after 2026-11-12
Files: ops/OWNER.md.
Acceptance: scoreboard vs baseline, what to scale, prune list (mid-cycle check).

## NOT NOW (do not select; the site itself is not frozen)
- Newsletter (owner 11-03: too early), analytics (revisit when G16 pages launch), press pitches (after G16 pages), Pinterest (later), YouTube, TikTok.
- Q09c lodging readability P3s (paused 11-03 for G16; P3 list in git history before 2026-10-31 13:00Z).
- Offline CLIs/"output isolation" work, source-governance pilot, evidence-batch tooling, NWS forecast pilot.
- New micro-calculators that only multiply numbers the parent types in.
- Community drafts, outreach, analytics, monetization (external actions; need owner approval anyway).
- Removing the SD meta-refresh stubs; title/CTR tests; FAQPage schema additions.
- Due-review research that changes nothing public.
