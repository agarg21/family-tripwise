# QUEUE (work top to bottom; at most 15 items; finished items move to ops/runs as one line)
Format: status · size (S ≤1 run, M 1–2, L 2–3) · owner · gate.
G16 first (owner 11-24: holidays first), then R1, then G items; Q items only for live-site defects. Research: docs/research/growth-*-2026-10-28.md.

## G16 Holiday + Black Friday durable pages + trend fast lane (owner D32, 11-03: go all in)
open · L · owner: D32 Approved · gate: none; before G15/D23
Evidence: docs/research/growth-strategy-2026-11-03.md. New URLs, no year in the slug, refreshed in place each season. Order (owner 11-03): 1) Black Friday/Cyber Monday deals page, spend-vs-save per offer, updated as offers drop; 2) trend fast lane (docs/plan/trend-fast-lane.md): treat ops/trend-watch/flags.json like deal-watch flags: high flags pre-empt all but live defects; same-day verified trend check + fast-lane post; 3) theme-park holiday events (dates, family-of-4 cost, best nights for small kids); 4) city holiday pages NYC, Chicago, SD, Orlando, SA, DC (lights, zoo lights, trains, Santa, parades; free vs paid, family-of-4 cost, ages, stroller, book-ahead; "New this week" on top); 5) one page per recurring offer (Fun Cards, Great Wolf, LEGOLAND passes). 6) Holiday calendar (owner 11-09): docs/plan/holiday-calendar-2026.md; when no higher step is due, take the earliest open row past its watch-from, one item per run, and mark its status there. Link from /this-week/ and /deals/. All 3 reviews per release. Steps 1, 3, 4 live 11-04 (+LV page O51; card SHAs in ops/runs). Step 2: normal flags one per run after a first check. Re-reads Nov 29: Brookfield, Orlando Carol, NYC carousel, Magic Show. Step 3 adds: Disney, Universal, Knott's, Dollywood if readable. NPS tree viewing dates when posted. Fresh items may carry dated `changes`.

## R2 Owner-session sprint: ski, NYE, school breaks (D54/D56; operator skips)
NYC hotels test (title/H1 to query wording + licence-safe photos; NYC only, Chicago/SD controls, 4 weeks; plan 11-26): not started. 4 city ski + NYC tubing live. NYE: unannounced 11-25; recheck 12-08. School breaks: spring-break deals page + CPS breaks (docs/research 11-26).

## R1 Review backlog (D44, docs/plan/review-backlog-2026-11.md)
open · M/step · owner: D44/D46 · gate: none
Steps 1-6, 8, #12 done (ops/runs; 6: re-render with each G18 holiday refresh; 8: tools/indexability-check.mjs, approvals in tools/indexability-approved.json) · 7 venue family-of-4 costs: most JS-only/blocked (docs/research/holiday-venue-costs-2026-11-13.md); Stone Zoo, Jingle Jets, Boston Pops still unpriced (Pops 11-25; Dec 2) · #11 brand pages: 5 done; Great Wolf gated (no observed family-of-4 price); deck: 5 cards/weekday. D53 (after G16): A) one 'what's on now' line on each ended deal page (brand page, else /deals/); B) recurring-deal pages Royal Caribbean, Norwegian, MSC, Great Wolf, ended one-offs fold in (canonical, sitemap); C) re-read July dates on the 8 #12 pages, LV first.

## G19 Resort conditions pages (D47/D48, 11-14: fast)
open · M · owner: D47/D48 · gate: none
D55/D57: code reads each status_page daily (resort-status.json); never re-read by hand. First run each ET day: from that file + hours/opening pages, update status_* for resorts not open yet; drop a resort once open. docs/plan/resort-conditions-pages.md. Live: 12 East + 12 West; Holiday Valley (woods hero; swap if a slope photo appears). P2s: dedupe sources; status card cost line (cam times + status link done 27215b93). Schweitzer held (no winter photo). cost_cue live on 5 resorts; Jackson Hole waits for a youth ticket $. GSC stale alarm done (owner session 11-26, ops-headroom.mjs). P3: plan line home/childcare/getting-here undated keys, plainer "unless dated"; next P3s: Vail new snow/guns 'Can't tell' 5/5 days (Muse 11-27 Q5: cam angle vs read); NY vs states, region field; rest in ops/runs.

## G18 Hotel prices: weekend + holiday samples (owner D39, 11-05)
open · M · owner: D39 Approved (all hotel pages) · gate: D8 budget
Protocol docs/plan/hotel-price-samples.md; sweep docs/plan/retros/2026-11-05-hotel-price-scenario.md. Weekly refresh (SHAs: ops/runs): NYC, Chicago, SD, SA Nov 21; DC, Boston, Orlando, LV, Cancun (re-check hand-typed study skips), PV Nov 22; next NYC/Chicago/SD/SA from Nov 28; next SA re-price: re-read July 26 review themes/linked pages; LV MGM (4) + Hilton rooms facts still July 22 (labelled older, O50): re-read when reachable.

## G17 Reach: internal links + social formats (owner D37, 11-04)
open · M · owner: D37 Approved · gate: none; after G16 Black Friday follow-ups
1) Internal links live 11-04 (179c59ae). 2) Social: holiday-first; carousels; FB link in 1st comment. Reels v4 11-07 (judge in ops/social-insights); photos in ops/media/reel-photos.json (holiday shots for Christmas events only, no lit tree before lighting); hold list in ops/media/reels.json. All 3 reviews.

## Q21 Review system v2: fix repeat design issues once (owner 11-04)
open · M · owner: D23/D35 · gate: none; after Black Friday, before more G16 pages
Steps 1, 2, 4 live. Persona P2s: NYC/LV glance boxes, itinerary plan box at 1280. Step 3 left: per-city photo sets (D17) so heroes are relevant, never repeated; recheck LV stay file page; done pages in ops/runs. Left: home/SD kids (this-week c54b2093); hubs show top deal photo by design. All 3 reviews.

## D23 Design system restyle (owner 2026-10-30, D23 Approved)
open · L · owner: D23 Approved (batches, all pages) · gate: all 3 reviews per batch (docs/plan/design-review.md)
Released: batches 1-3r, itineraries 4b-4e, Cancun table, Boston, LV itinerary (SHAs: ops/runs). PV table withheld until a suite has an observed family price (persona 2.9; legalese); then add dc-ds.

## G13 Page quality: weekly and on demand
open · M · owner: none · gate: none
3) SD hotels superseded by G18 SD (design 4.0, 11-07). 4) July-August checks: re-read facts by traffic (done pages and SHAs in ops/runs; SD stay hotel FAQs July 20 left; next by traffic). Weekly: site-health.mjs --links --write, persona + design of changed + top 3 pages. On demand: OWNER.md "review <page or all>".

## G09w Deal-watch flags (recurring; keep this item open)
open · S · owner: D15 Approved · gate: ops/deal-watch/flags.json has a pending flag (none → skip this item)
One flag (or one operator's batch of flags) per run, before other items; live-site defects still first. For each flag: `changed` → read the official page once unless read <7 days ago (then use the extract) (WebSearch on the operator's domain, then WebFetch), verify what changed, update or add the deal check (deal-checks.json + docs/research/deal-checks-*.md) and today's queue if worth sharing (G09 scoring once built); `blocked`/`unreachable` → do not retry; note it in G05 carry. Then delete the flag from flags.json in the same commit. A flag is a lead. On a flags.json push conflict, merge (never rebase) and keep the watcher's other flags.
P2: 'Listed until' chip reads as deadline (all no-end-date deals). Re-reads: SeaWorld SA read 11-22 (to Nov 29; next from Nov 29); SeaWorld Orlando read 11-26 (from Nov 28); Busch Tampa read 11-27 (from Nov 28); RC terms read 11-21 (Nov 28: BF amounts/window); NCL terms read 11-26 (BF card to Dec 1; next Dec 3); Margaritaville BF row to Nov 29; early-access ($50/night) due; Club Med BF (from Dec 1); LEGOLAND CA/FL pass BF: re-read Nov 28; Atlantis Cyber Nov 30 (Cove 5 nights?).

## G11 Deal content v3: spend-vs-save + concise (posting resumed 10-31, D12)
open · M · owner: D11/D15/D19/D21 Approved · gate: none; do first
v3 (AGENTS.md Content Standard): spend-vs-save card at the top of every deal page and post, concise top (validator: ≤30 words), stricter persona gate. Delivered: 7 deal cards; D22 (≥5% only posted/promoted). Next: spend_save for the remaining deal pages, ≤3 per release (needs an observed "without" figure per deal); then make the card required for posting. --refresh current queues.

## G12 Trip-cost data for the glance test
open · M · owner: D20 Approved · gate: none for hotels (DataForSEO); flights need the SERPAPI_API_KEY secret (owner T3)
Steps 1-4 done (LEGOLAND FL); Great Wolf/Atlantis no Google prices; flights need SERPAPI_API_KEY.

## G08 Post through Zernio
open · S · owner: D14 Approved · gate: none
Left: drop Meta/Pinterest paths.

## G09 Deal fast lane: first, verified, worth sharing
open · S · owner: D15/D16 Approved · gate: use only when a deal is verified on its official page today
Fast lane: `node tools/social-queue.mjs <today> --fast <check-id>` puts a deal observed today into today's queue at the next slot (≥20 min out). Run on a fresh main just before release. Caps hold, one deal a day (a pending deal gives way only to an equal or better one), and posted entries are locked. In the same commit, regenerate every later queue it reports and render the cards (`node tools/social-cards.mjs <date>`). Left: a real same-day use. Late fast deals: Threads/Pinterest only (O20).

## G05 Daily fresh sweep (recurring; keep this item open)
open · S per day · owner: D10/D11/D12 Approved · gate: none (G01 done)
First run after 06:00 ET each day: run `node tools/this-week.mjs` and commit if site/this-week changed; check the recurring sources (official pages first; news/deal sites as leads only), add newly verified items, remove expired ones, edit tools/page-generation/fresh-items.json (research: docs/research/this-week-items-*.md), refresh /this-week/ and /deals/ (tools/page-generation/deal-checks.json; record in docs/research/deal-checks-*.md; add new verified checks), and queue the next day's posts (`node tools/social-queue.mjs <date>`, `node tools/social-cards.mjs <date>`, then `node tools/social-reels.mjs <date>` and commit its .mp4/.jpg with the queue; regenerate a current queue whenever its records change): about 5–6 across all platforms Nov–Dec, 2–3 off-season, never filler.
Queued to Nov 25 (skips in file; no reels, D46); Nov 26+ next (SeaWorld Orlando waits for Nov 23 re-read; ZooLights DC re-read first). Beaches page only; Velas lead Nov 9. Blocked (no unchanged retry): margaritavilleatsea BF, beaches.com/specials, MSC, Rockefeller tree, macys.com, Disneyland, Kalahari, Aulani, Hyatt Inclusive, Dollywood, Disney Cruise. Hersheypark 2027 prices: re-read (unpublished Nov 8).

## NOT NOW (do not select; the site itself is not frozen)
- Newsletter (owner 11-03: too early), analytics (revisit when G16 pages launch), press pitches (after G16 pages), Pinterest (later), YouTube, TikTok.
- Q09c lodging readability P3s (paused 11-03 for G16; P3 list in git history before 2026-10-31 13:00Z).
- Offline CLIs/"output isolation" work, source-governance pilot, evidence-batch tooling, NWS forecast pilot.
- New micro-calculators that only multiply numbers the parent types in.
- Community drafts, outreach, analytics, monetization (external actions; need owner approval anyway).
- Removing the SD meta-refresh stubs; CTR/title tests (≤60-char titles: R1); FAQPage schema additions.
- Due-review research that changes nothing public.
