# QUEUE (work top to bottom; at most 15 items; finished items move to ops/runs as one line)
Format: status · size (S ≤1 run, M 1–2, L 2–3) · owner approval · gate.
Growth-first (OWNER D10–D12): G items first; Q items only for live-site defects and Q17b. Research: docs/research/growth-*-2026-10-28.md.

## G16 Holiday + Black Friday durable pages + trend fast lane (owner D32, 11-03: go all in)
open · L · owner: D32 Approved · gate: none; before G15/D23
Evidence: docs/research/growth-strategy-2026-11-03.md, dataforseo-growth-deal-search-2026-11-03.json (holiday and Black Friday searches peak Nov-Dec, KD mostly 0-5; distinct jobs, no existing URL fits). New URLs, no year in the slug, refreshed in place each season. Order (owner 11-03): 1) Black Friday/Cyber Monday family travel deals, each scored with the spend-vs-save card: first version live ASAP (target Nov 5), then updated as offers drop; 2) trend fast lane (docs/plan/trend-fast-lane.md): the watcher is being built in the owner session on q/G16-trend-watch (do not build it here); once merged, treat ops/trend-watch/flags.json like deal-watch flags: high flags pre-empt all but live defects; same-day verified trend check + fast-lane post (first leads: docs/research/trend-leads-2026-11-03.md); 3) theme-park holiday events (dates, family-of-4 cost, best nights for small kids); 4) city holiday pages NYC, Chicago, San Diego, Orlando, San Antonio, DC (Thanksgiving to New Year: lights, zoo lights, train shows, Santa, parades; free vs paid, family-of-4 cost, ages, stroller, book-ahead; "New this week" trend cards on top); 5) one page per recurring offer (Fun Cards, Great Wolf, LEGOLAND passes). Link from /this-week/ and /deals/. All 3 reviews per release (run the reviewers in parallel). Step 1 on q/G16-black-friday 573bbaf7, D33 cycle spent (persona 3.53, design 3.57, integrity 1 P2; fixed, unreviewed), held for O34. Step 2: watcher merged; 17 normal flags pending (first: Enchant DC 2,500 free kids' tickets; Macy's balloons; Vessel lighting; Virginia $19 light trail), one per run after a first check. Step 3 first page live 11-03 (/holidays/, 8 parks; add Disney, Universal, Knott's, Dollywood when readable; re-read prices before Nov 29; P3s in ops/runs). Next: step 4 city pages under /holidays/.

## D23 Design system restyle (owner 2026-10-30, D23 Approved)
open · L · owner: D23 Approved (batches, all pages) · gate: each batch passes integrity + persona + design review (docs/plan/design-review.md)
Released: batches 1-3r and itineraries 4b-4e (SHAs and P3s in ops/runs/2026-11.md). Open: Cancun P3s (Nov 9 sample expiry, STATE hold; JSON-LD dateModified 09-27; card $1,177 rounded unlabeled), then the Cancun table restyle (CSS draft in git history of q/D23-b3e first commit). Boston and PV tables withheld until each has an observed family price (persona Boston 3.3, PV 2.9; PV legalese); then restyle them (add dc-ds). Next: LV itinerary q/D23-4a held for O29 (engine and CSS now on main via Chicago: expect a merge; needs the new h2/spacing and plan-swaps rules; reuse answerBox.plan).

## G14 Photo at the top of every page (owner 2026-10-29)
open · M · owner: D4/D17/D20 Approved (batches ok) · gate: none; before G13 step 2
Done through 17b989f. Remaining: 6 older deal pages via G11 v2 (most end Oct 31-Nov 3).
Carry P3s and D23 photo notes: moved to ops/runs/2026-11.md (11-03 owner session line).

## G13 Page quality: weekly and on demand
open · M · owner: none · gate: none
Steps 1-2 done (tools/site-health.mjs, ops/page-reviews.json, first report ops/site-health/2026-11-03.md; next weekly links from 11-10). Fix list (1, Flyover, done 75747beb): 2) Under the guide bar: LV teens built on q/G13-lv-teens, held for O31 (on yes: integrity confirm, merge, release); NYC hotels built on q/G13-nyc-hotels, held for O32 (on yes: persona + design, merge, release). 3) SD hotels passes persona (3.53), design 3.14: plain price lines, spacing. 4) 26 pages show July-August checks: re-read facts by traffic. Carry P3s: empty tables; nested sections; --accept. Weekly: node tools/site-health.mjs --links --write, persona + design of changed pages + top 3; fix items, no automatic edits. On demand: OWNER.md "review <page or all>".

## G09w Deal-watch flags (recurring; keep this item open)
open · S · owner: D15 Approved · gate: ops/deal-watch/flags.json has a pending flag (none → skip this item)
SeaWorld $104.99 + Club Med Jan 4 released 5fef15ce (11-03). One flag (or one operator's batch of flags) per run, before other items; live-site defects still first. For each flag: `changed` → read the official page once unless read <7 days ago (then use the extract) (WebSearch on the operator's domain, then WebFetch), verify what changed, update or add the deal check (deal-checks.json + docs/research/deal-checks-*.md) and today's queue if worth sharing (G09 scoring once built); `blocked`/`unreachable` → do not retry; note it in G05 carry. Then delete the flag from flags.json in the same commit. A flag is a lead. On a flags.json push conflict, merge (never rebase) and keep the watcher's other flags.
11-02 flags cleared with no change; Margaritaville re-read from Nov 6 as a possible new sale ("$2,000 instant savings" banner). Margaritaville released cd6cb6d6, Great Wolf November Web Sale cd925431 (11-02; P3s ops/runs). NCL "50% Off All Cruises" (no window, terms or fare readable 11-03; read terms from Nov 10). Royal Caribbean: "$750 Savings" + Kids Sail Free still on terms after the Nov 2 close, /cruise-deals shows no book-by or family fare (11-03); read terms from Nov 10. Carry P3s: SeaWorld "Save Up To 60% On Tickets" leads (read from Nov 4; SeaWorld "Final Frenzy $54.99" banner gone 11-01); Margaritaville next read from Nov 6; Margaritaville tax line ambiguous; Oct 31 post "USD 0", FB >350 chars; chained skipped runs; countdown noise flags; robots paths not percent-normalised.

## G11 Deal content v3: spend-vs-save + concise (posting resumed 10-31, D12)
open · M · owner: D11/D15/D19/D21 Approved · gate: none; do first
v3 FIRST (owner 2026-10-30, AGENTS.md Content Standard): spend-vs-save card at the top of every deal page and post, concise top (validator: ≤30 words), stricter persona gate. Delivered: 7 deal cards incl. LEGOLAND FL and Club Med (page only); D22 (only real deals, ≥5%, are posted/promoted). P3 lists moved to ops/runs/2026-11.md (11-03 owner session). Atlantis card released d12ac83a (11-02; P3s ops/runs 03:05Z). SeaWorld SD (d92cba55), San Antonio (193fc230) and Sesame Place San Diego (a666da4c, no photo yet) released 11-01; P3s: ops/runs/2026-11.md 13:06Z, 14:05Z, 16:05Z. Next: spend_save for the remaining deal pages, ≤3 per release (needs an observed "without" figure per deal: published regular prices, G12 hotel samples); then make the card required for posting. --refresh current queues.

## G12 Trip-cost data for the glance test
open · M · owner: D20 Approved · gate: none for hotels (DataForSEO); flights need the SERPAPI_API_KEY secret (owner T3)
Steps 1-3 done 10-30: LEGOLAND deal page shows a validated v2.price_sample "about $383 a night at the LEGOLAND Castle Hotel for 2+2 (kids 5, 8), 3 nights Dec 4-7" (auto-drops at stay start or deal end); title match strips ®/™. Next: 4) LEGOLAND FL done (90f7c7c: Hotel $269 1n/$369 3n Dec 4; Pirate Island none; Beach Retreat $603 1n); others Google prices (Great Wolf/Atlantis showed none); flights need SERPAPI_API_KEY. P3s: How-we-check clause hardcodes "Google Hotels"; say why $169/person package and $383 room differ; shorter phone line; drop stale requests.

## G08 Post through Zernio
open · S · owner: D14 Approved · gate: none
Built 16e5ad8; Facebook and Instagram post through Zernio (IG status polling added 11-02). Remaining: remove the direct Meta/Pinterest paths and secrets. Carry P3s: tests for kill switch/expiry/409 on the Zernio route.

## G09 Deal fast lane: first, verified, worth sharing
open · S · owner: D15/D16 Approved · gate: use only when a deal is verified on its official page today
Done: step 1 watch (8daaacb), step 2 scoring (d3f7909), step 3 fast lane (11-01): `node tools/social-queue.mjs <today> --fast <check-id>` puts a deal observed today into today's queue at the next slot (≥20 min out). Caps hold, one deal a day (a pending deal gives way only to an equal or better one), and posted entries are locked. Run it on a fresh main just before release. In the same commit, regenerate every later queue it reports and render the cards (`node tools/social-cards.mjs <date>`). Left: a real same-day use. Reach: Facebook (cap 2) is usually spent by 10:00, so after that a fast deal reaches only Threads/Pinterest (not connected); see O20. P3: novelty check uses last two host labels.

## G05 Daily fresh sweep (recurring; keep this item open)
open · S per day · owner: D10/D11/D12 Approved · gate: none (G01 done)
First run after 06:00 ET each day: run `node tools/this-week.mjs` and commit if site/this-week changed; check the recurring sources (official pages first; news/deal sites as leads only), add newly verified items, remove expired ones, edit tools/page-generation/fresh-items.json (validated; research table in docs/research/this-week-items-*.md), refresh /this-week/ and /deals/ (tools/page-generation/deal-checks.json; record in docs/research/deal-checks-*.md; three of the four Oct 28 checks end Oct 31–Nov 2, so add new verified checks), and queue the next day's posts (`node tools/social-queue.mjs <date>` then `node tools/social-cards.mjs <date>`; regenerate a current queue whenever its records change): about 5–6 across all platforms Nov–Dec, 2–3 off-season, never filler. Record items added/expired in runs.
Beaches Black Friday released ee2611fa (11-03; page only; price it if a family rate can be observed, Velas sale opens Nov 17). Carry P3s: G05e (10-31) list in ops/runs/2026-10.md. Blocked/refusing (no retry unchanged): beaches.com/specials, MSC pages, Rockefeller tree, macys.com, Disneyland, Kalahari, Aulani, Hyatt Inclusive, Dollywood, Disney Cruise. Re-observe: EPCOT festival after Nov 5; Universal Special 3-Day after Nov 4; Disney spring 2027 after Nov 4; Hersheypark 2027 passes from Nov 8. Prune cards of ended items. NCL ended-banner wording; MSC title tax caveat. Older P3s: git history before 11-01 18:00Z.

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
