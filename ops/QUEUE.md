# QUEUE (work top to bottom; at most 15 items; finished items move to ops/runs as one line)
Format: status · size (S ≤1 run, M 1–2, L 2–3) · owner approval · gate.
Growth-first (OWNER D10–D12): G items first; Q items only for live-site defects and Q17b. Research: docs/research/growth-*-2026-10-28.md.

## G14 Photo at the top of every page (owner 2026-10-29)
open · M · owner: D4/D17/D20 Approved (batches ok) · gate: none; before G13 step 2
Done through 17b989f. Remaining: 6 older deal pages via G11 v2 (most end Oct 31-Nov 3).
Carry (persona/integrity P3s, older copy): Orlando hotels opens with dated-source caveats, no $ glance, road/parking photo; "USD" → "$" on Cancun/Orlando-with-kids/deal titles; Cancun duplicate check date; LV $60–$300+ band wide; PV "published limit is not a confirmed reservation" legalese; LV/Chicago captions lack place (LV: Bellagio is not a compared hotel); phone comparison tables cut off at right; 4–5-line deal cards at phone width. Batch 3: /deals/ "Closing soonest" lacks what/where/saving; home destinations paragraph jargon; Atlantis "USD 250". Batch 2: glance "free" check should use the cost column; hazy DC photo; Chicago "USD 10"; disclaimer-first things-to-do openings.

## G13 Page quality: weekly and on demand
open · M · owner: none · gate: none
Step 1 done (7071aa5): tools/site-quality.mjs on every deploy with a ratchet baseline (tools/site-quality-baseline.json). Carry P3s: empty tables; nested sections; --accept. Next: 2) Weekly (first Monday run): site-health report: outbound 404/410 links (browser UA, robots honored), observations older than 60 days, persona review (docs/plan/page-quality-rubric.md) of pages changed since last review + top 3 by impressions; ledger ops/page-reviews.json; failing pages get fix items; summary in STATE; no automatic edits. 3) On demand: OWNER.md "review <page or all>" goes next.

## G09w Deal-watch flags (recurring; keep this item open)
open · S · owner: D15 Approved · gate: ops/deal-watch/flags.json has a pending flag (none → skip this item)
One flag (or one operator's batch of flags) per run, before other items; live-site defects still first. For each flag: `changed` → read the official page once unless read <7 days ago (then use the extract) (WebSearch on the operator's domain, then WebFetch), verify what changed, update or add the deal check (deal-checks.json + docs/research/deal-checks-*.md) and today's queue if worth sharing (G09 scoring once built); `blocked`/`unreachable` → do not retry; note it in G05 carry. Then delete the flag from flags.json in the same commit. A flag is a lead. On a flags.json push conflict, merge (never rebase) and keep the watcher's other flags.
Carry P3s: RC "$800 Deal Drop Sale" and SeaWorld "Save Up To 60% On Tickets" leads (read from Nov 4); Margaritaville tax line ambiguous; Oct 31 post "USD 0", FB >350 chars; chained skipped runs; countdown noise flags; robots paths not percent-normalised.

## G11 Deal content v3: spend-vs-save + concise (posting paused, D12)
open · M · owner: D11/D15/D19/D21 Approved · gate: none; do first
v3 FIRST (owner 2026-10-30, AGENTS.md Content Standard): spend-vs-save card at the top of every deal page and post, concise top (validator: ≤30 words), stricter persona gate. Delivered: LEGOLAND CA, Sesame, LEGOLAND NY, SeaWorld, Busch (06fb908); a check with spend_save is not posted while its card cannot be built. LEGOLAND FL (save ≈ $77, 11%) and Club Med (page only) released by the owner session with D22 (only real deals, ≥5%, are posted/promoted). ogSpendLine: add unit_short + test. D22 P3s: breakEven from the one-day ticket part; hub deadline lost "free 2026 visits"; deal-page cross-links list non-real offers; Cancun hub hero; byline. Next: spend_save for the remaining deal pages, ≤3 per release (needs an observed "without" figure per deal: published regular prices, G12 hotel samples); then make the card required for posting. --refresh current queues. P3s: hub savings box intro hardcodes "family of 4, before tax, fees and parking" (build from bases) and shows only the save; hub hero tall at 390 (3rd saver below fold); og/share cards lack the spend figures; SeaWorld catch lost "holiday blockouts" (420 cap); posts 405-421 chars (near the 420 cap); hub line lacks dates; card/post lost "near San Diego"; $169 box not tied to $676; post check date Oct 29 vs page Oct 29-30; Pinterest links to /deals/. Busch: 2027 prices; hub lacks 3-day caveat. LEGOLAND FL: hub save line unconditional.
v2 P3s: "Listed until" chip reads as a sale end; phone verdict/price box below the first screen; Threads posts near 390 chars; drop Nov 1 lines after Nov 1.

## G12 Trip-cost data for the glance test
open · M · owner: D20 Approved · gate: none for hotels (DataForSEO); flights need the SERPAPI_API_KEY secret (owner T3)
Steps 1-3 done 10-30: LEGOLAND deal page shows a validated v2.price_sample "about $383 a night at the LEGOLAND Castle Hotel for 2+2 (kids 5, 8), 3 nights Dec 4-7" (auto-drops at stay start or deal end); title match strips ®/™. Next: 4) LEGOLAND FL done (90f7c7c: Hotel $269 1n/$369 3n Dec 4; Pirate Island none; Beach Retreat $603 1n); others Google prices (Great Wolf/Atlantis showed none); flights need SERPAPI_API_KEY. P3s: How-we-check clause hardcodes "Google Hotels"; say why $169/person package and $383 room differ; shorter phone line; drop stale requests.

## G08 Post through Zernio
open · S · owner: D14 Approved · gate: none
Built 16e5ad8 (docs/research/zernio-api-2026-10-29.md). First live post 2026-10-29: Facebook, Beaches (receipt in ops/social-receipts/2026-10-29). Instagram not yet connected in Zernio (owner, later today); Threads/Pinterest not connected (paid seats). 6172a5a: runs log/summarise `not_connected` platforms. Remaining: check the first Instagram post once connected, then remove the direct Meta/Pinterest paths and secrets. Carry P3s: Zernio `publishing`/`scheduled` results are recorded failed (never retried); tests for kill switch/expiry/409 on the Zernio route.

## G09 Deal fast lane: first, verified, worth sharing
open · L · owner: D15/D16 Approved · gate: none
Done 10-29: step 1 watch (8daaacb; 17 pages hourly, flags to G09w) and step 2 scoring (d3f7909; only worth_it/only_for queued; all 10 only_for until observed family cost, G12). Next, step 3: a verified worthy deal gets an entry in today's queue at the next slot (regenerate today's queue; caps hold); target launch-to-post about 4 hours. Content per AGENTS.md Content Standard. P3: novelty check uses last two host labels.
Acceptance: one same-day end-to-end dry run; reviewer PASS.

## G05 Daily fresh sweep (recurring; keep this item open)
open · S per day · owner: D10/D11/D12 Approved · gate: none (G01 done)
First run after 06:00 ET each day: run `node tools/this-week.mjs` and commit if site/this-week changed; check the recurring sources (official pages first; news/deal sites as leads only), add newly verified items, remove expired ones, edit tools/page-generation/fresh-items.json (validated; research table in docs/research/this-week-items-*.md), refresh /this-week/ and /deals/ (tools/page-generation/deal-checks.json; record in docs/research/deal-checks-*.md; three of the four Oct 28 checks end Oct 31–Nov 2, so add new verified checks), and queue the next day's posts (`node tools/social-queue.mjs <date>` then `node tools/social-cards.mjs <date>`; regenerate a current queue whenever its records change): about 5–6 across all platforms Nov–Dec, 2–3 off-season, never filler. Record items added/expired in runs.
Carry P3s: Deal watch: beaches.com/specials (robots.txt 403) and both MSC pages (401) blocked since 10-29; no `retry` unless robots.txt reads fine later. Leads not publishable yet: Rockefeller tree 2026 (official page refused the fetcher Oct 29; no retry unchanged); Macy's parade (macys.com Access Denied). EPCOT festival page says "Check back soon": re-observe after Nov 5 for admission/extras. Universal Orlando Special 3-Day Ticket: recheck after Nov 4; Disneyland and Kalahari offer pages refuse the fetcher (do not retry unchanged). From G03/G04: prune cards of ended items from site/social/cards (once no current queue references them). NCL check: ended banner says "This offer ended" though only the Free 2nd Guest sale ends Nov 2 (note explains; optional per-check ended label). Aulani offers host robots-disallowed (no retry). MSC robots.txt returns an "Unauthorized" bot page to plain requests (pages read via the fetch tool, as SeaWorld); MSC title/h1 say "sailing free" without the tax caveat (headline carries it). Hyatt Inclusive offers refuse the fetcher. Terms caption names only the offer page though rows can come from other official pages (P3). Dollywood: Access Denied (no retry). Disney Cruise offers page: "too many redirects" (10-30), no retry. Disney spring 2027 room offer: refetch index after Nov 4. Busch Gardens Free Preschool Card 2027: not open 10-30.

## Q17b Remove Nov 8-13 amounts the operator cannot re-observe
open · M · owner: D9 Approved (O2 answered No: remove) · gate: none; live by 2026-11-07
10-31: DC on q/Q17b (persona 3.33, needs a price signal): band from the q17b-dc receipt, cycle 3, release; then the rest (withdrawal copy avoids "Nov 8-13" + price words). Arrival Nov 8 is the past-stay point (tools/content-freshness.mjs). All 15 properties are blocked for the operator (Q17a attempt 2026-10-28: Cabana Bay robots-disallowed to the fetcher, Radio City and Marlin Queen Street/Limehouse have no dated rate outside a booking-engine date search): Hilton Park Plaza + Residence Inn (Boston), Citadines (London), Beacon + TRYP (NYC), Art of Animation + Holiday Inn (Orlando), Garza Blanca Sanctuary (PV), Homewood (SD), Embassy Suites + Homewood (DC), plus Cabana Bay (Orlando), Radio City Apartments (NYC), Marlin Queen Street + Marlin Limehouse (London). Remove amounts, derived nightly figures, plan premiums, overview ranges and JSON-LD/CSV values; show the budget gap; keep dated non-price facts; update pinned tests honestly. Use owner-supplied official observations instead where O2 provides them.

## Q09c Lodging-page readability polish (P3s only)
open · S · owner: D4e Approved · gate: none
Done: Q09a, Q09b, Q09c slices for Boston, DC, PV, Cancun, London, Orlando: each dated amount shown once, provenance collapsed.
Remaining P3s: tall Cancellation/meals rows and rate-table captions cut off at 390 px (Boston, DC); PV next_checks comma runs ("Puerto Vallarta,Jalisco;", "18+,children 4-12,infants") not caught by run-together tests; PV Sanctuary visible block long; Cancun overview pointer wording kind-aware for Sapphire's undated two-adult rate; re-clicking a targeted "How we checked this price" link does not reopen a closed block; five identical Cancun link texts (add hotel name visually hidden); London "GBP"+amount nowrap at 390 px, scope .london-rate under .london-page, test compare e()-escaped plan names. Orlando: nightly-sample column off-screen at 390 (move to 2nd); party text hardcoded; say "not complete checkout totals" in the overview; stay-total captions identical; test gaps.
Acceptance: fixes above; ≤3 public pages per release unless under D4e.

## Q12 Refresh Las Vegas family-hotels (279 impressions, 2 clicks, July prices)
open · L · owner: D7 Approved · gate: none · Acceptance: as Q07 for site/where-to-stay/las-vegas-family-hotels.html.

## Q14 Cycle go/no-go memo
open · S · owner: none · gate: on or after 2026-11-12
Files: ops/OWNER.md.
Acceptance: scoreboard vs baseline, what to scale, prune list (mid-cycle check).

## NOT NOW (do not select; the site itself is not frozen)
- Newsletter (owner skipped, 10-28); Pinterest, YouTube and TikTok posting until their API approvals clear.
- Offline CLIs/"output isolation" work, source-governance pilot, evidence-batch tooling, NWS forecast pilot.
- New micro-calculators that only multiply numbers the parent types in.
- Community drafts, outreach, analytics, monetization (external actions; need owner approval anyway).
- Removing the SD meta-refresh stubs; title/CTR tests; FAQPage schema additions.
- Due-review research that changes nothing public.
