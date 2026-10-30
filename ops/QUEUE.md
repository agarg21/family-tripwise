# QUEUE (work top to bottom; at most 15 items; finished items move to ops/runs as one line)
Format: status · size (S ≤1 run, M 1–2, L 2–3) · owner approval · gate.
Growth-first (OWNER D10–D12): G items first; Q items only for live-site defects and Q17b. Research: docs/research/growth-*-2026-10-28.md.

## G14 Photo at the top of every page (owner 2026-10-29)
open · M · owner: D4/D17/D20 Approved (batches ok) · gate: none; before G13 step 2
Done through 17b989f. Remaining: 7 older deal pages via G11 v2.
Carry (persona/integrity P3s, older copy): Orlando hotels opens with dated-source caveats, no $ glance, road/parking photo; "USD" → "$" on Cancun/Orlando-with-kids/deal titles; Cancun duplicate check date; LV $60–$300+ band wide; PV "published limit is not a confirmed reservation" legalese; LV/Chicago captions lack place (LV: Bellagio is not a compared hotel); phone comparison tables cut off at right; 4–5-line deal cards at phone width. Batch 3: /deals/ "Closing soonest" lacks what/where/saving; home destinations paragraph jargon; Atlantis "USD 250". Batch 2: glance "free" check should use the cost column; hazy DC photo; Chicago "USD 10"; disclaimer-first things-to-do openings.

## G13 Page quality: weekly and on demand
open · M · owner: none · gate: none
Step 1 done (7071aa5): tools/site-quality.mjs on every deploy with a ratchet baseline (tools/site-quality-baseline.json). Carry P3s: empty-table check edge cases; nested sections skip outer text; --accept takes the next arg blindly. Next: 2) Weekly (first Monday run): site-health report: outbound 404/410 links (browser UA, robots honored), observations older than 60 days, persona review (docs/plan/page-quality-rubric.md) of pages changed since last review + top 3 by impressions; ledger ops/page-reviews.json; failing pages get fix items; summary in STATE; no automatic edits. 3) On demand: OWNER.md "review <page or all>" goes next.

## G09w Deal-watch flags (recurring; keep this item open)
open · S · owner: D15 Approved · gate: ops/deal-watch/flags.json has a pending flag (none → skip this item)
One flag (or one operator's batch of flags) per run, before other items; live-site defects still first. For each flag: `changed` → read the official page once (WebSearch on the operator's domain, then WebFetch), verify what changed, update or add the deal check (deal-checks.json + docs/research/deal-checks-*.md) and today's queue if worth sharing (G09 scoring once built); `blocked`/`unreachable` → do not retry; note it in G05 carry. Then delete the flag from flags.json in the same commit. A flag is a lead, never a fact. If the push conflicts in flags.json (the hourly watcher updated it), merge (never rebase) and keep the watcher's other flags.
Carry P3s: chained skipped runs; countdown noise flags; robots paths not percent-normalised.

## G11 Deal content v2 + persona review (posting paused, D12)
open · M · owner: D11/D15 Approved; rollout needs O7 · gate: none
Step 1 done 2026-10-29 (b32bd32): Beaches page v2 (validateDealV2; hero photo; og card via tools/deal-og-images.mjs).
Step 2 done 2026-10-29 (1a3c8e8): v2 post text + photo card from validated v2.post; `social-queue.mjs <date> --refresh`. Persona 4.07.
Step 3 Club Med on q/G11-clubmed (c296b1d), held on OWNER O9 (persona 3.87: no family price). Branch P3s: Threads 392 chars; Pinterest title order.
LEGOLAND v2 delivered 1a5bc8d (persona 4.08; P3s: terms caption omits comparison rows; bold Saves heavy on phones). SeaWorld v2 delivered 17b989f (persona 4.00; v2.extra_sources cites comparison pages; P3s: "Listed until" chip unqualified; post date is the terms date; phone first screen lacks price box). Busch Gardens Fun Card delivered 5f6962a (persona 4.20; P3s: no verdict_pill unit test; long Saves/Trip cost lines). Atlantis v2 parked on q/G11 (f2d3b21; integrity PASS_WITH_P3, persona 3.93: no $ savings figure) until O10 or an "Only for <who>" pill (now available: validated v2.verdict_pill, 5f6962a); then merge main, re-test, re-review, release. Next: 3) v2 (page + post block) for the other deal checks, longest-lived first; pick checks with an observed price or clear family value first, since evidence-capped deals fail the persona bar, ≤3 pages per release, then --refresh current queues; photos via tools/images/commons-images.json (self-host-images workflow triggers on q/Q11, q/G11 pushes, or dispatch on q/*). Carry P3s: related-deal hedges grey; phone verdict below first screen; big desktop h2s; cap image.alt 500; card lacks year/"older photo" notes.

## G12 Trip-cost data for the glance test
open · M · owner: D20 Approved · gate: none for hotels (DataForSEO); flights need the SERPAPI_API_KEY secret (owner T3)
Steps 1-2 done 10-30 (935cea8, c8ef869): Google price reads per night and is volatile; LEGOLAND Castle Hotel ~USD 378-423/night for 2+2 (Dec 4-7 2026, taxes unknown); LEGOLAND Hotel, Great Wolf Poconos, Atlantis unpriced; "®" broke matching (docs/research/trip-cost-observations-2026-10-30.md). Next: 3) strip ®/™ in match; labelled "about $X a night before tax" estimate on the LEGOLAND deal page (family party only; drop after Dec 4). P3: drop stale requests; confirm hotel identity.

## G08 Post through Zernio
open · S · owner: D14 Approved · gate: none
Built on main 16e5ad8 (API facts: docs/research/zernio-api-2026-10-29.md). First live post 2026-10-29: Facebook, Beaches (receipt in ops/social-receipts/2026-10-29). Instagram not yet connected in Zernio (owner, later today); Threads/Pinterest not connected (paid seats). 6172a5a: runs log/summarise `not_connected` platforms. Remaining: check the first Instagram post once connected, then remove the direct Meta/Pinterest paths and secrets. Carry P3s: Zernio `publishing`/`scheduled` results are recorded failed (never retried); tests for kill switch/expiry/409 on the Zernio route.

## G09 Deal fast lane: first, verified, worth sharing
open · L · owner: D15/D16 Approved · gate: none
Done 10-29: step 1 watch (8daaacb; 17 pages hourly, flags to G09w) and step 2 scoring (d3f7909; only worth_it/only_for queued; all 10 only_for until observed family cost, G12). Next, step 3: a verified worthy deal gets an entry in today's queue at the next slot (regenerate today's queue; caps hold); target launch-to-post about 4 hours. Content per AGENTS.md Content Standard. Carry P3: novelty check uses the last two host labels (fix before a .co.uk-style operator).
Acceptance: one same-day end-to-end dry run; reviewer PASS.

## G05 Daily fresh sweep (recurring; keep this item open)
open · S per day · owner: D10/D11/D12 Approved · gate: none (G01 done)
First run after 06:00 ET each day: run `node tools/this-week.mjs` and commit if site/this-week changed (the deploy workflow drops expired items from the live copy daily, but the committed page must match today's render or tests fail); check the recurring sources (official pages first; news/deal sites as leads only), add newly verified items, remove expired ones, edit tools/page-generation/fresh-items.json (validated; research table in docs/research/this-week-items-*.md), refresh /this-week/ and /deals/ (tools/page-generation/deal-checks.json; record in docs/research/deal-checks-*.md; three of the four Oct 28 checks end Oct 31–Nov 2, so add new verified checks), and queue the next day's posts (`node tools/social-queue.mjs <date>` then `node tools/social-cards.mjs <date>`; regenerate a current queue whenever its records change): about 5–6 across all platforms Nov–Dec, 2–3 off-season, never filler. Record items added/expired in runs.
Carry P3s: Deal watch: beaches.com/specials (robots.txt 403) and both MSC pages (401) blocked since 10-29; no `retry` unless robots.txt reads fine later. Leads not publishable yet: Rockefeller tree 2026 (official tree page refused the fetcher Oct 29; do not retry unchanged; magazine pages still 2025); Macy's parade (macys.com Access Denied). EPCOT festival page says "Check back soon": re-observe after Nov 5 for admission/extras. Universal Orlando Special 3-Day Ticket: recheck after Nov 4; Disneyland and Kalahari offer pages refuse the fetcher (do not retry unchanged). From G03/G04: prune cards of ended items from site/social/cards (once no current queue references them). NCL check: ended banner says "This offer ended" though only the Free 2nd Guest sale ends Nov 2 (note explains; optional per-check ended label). Aulani offers host robots-disallowed (no retry). MSC robots.txt returns an "Unauthorized" bot page to plain requests (pages read via the fetch tool, as SeaWorld); MSC title/h1 say "sailing free" without the tax caveat (headline carries it). Hyatt Inclusive offers host refuses the fetcher. Terms caption names only the offer page though rows can come from other official pages (P3). Dollywood (dollywood.com) returns Access Denied to plain requests (do not retry unchanged). Disney Cruise special-offers page: watcher got "too many redirects" (10-30); do not retry unchanged. Disney spring 2027 room offer: refetch index after Nov 4. Busch Gardens Free Preschool Card 2027: not open 10-30.

## Q17b Remove Nov 8-13 amounts the operator cannot re-observe
open · M · owner: D9 Approved (O2 answered No: remove) · gate: none; live by 2026-11-07
Arrival Nov 8 is the past-stay point (tools/content-freshness.mjs). All 15 properties are blocked for the operator (Q17a attempt 2026-10-28: Cabana Bay robots-disallowed to the fetcher, Radio City and Marlin Queen Street/Limehouse have no dated rate outside a booking-engine date search): Hilton Park Plaza + Residence Inn (Boston), Citadines (London), Beacon + TRYP (NYC), Art of Animation + Holiday Inn (Orlando), Garza Blanca Sanctuary (PV), Homewood (SD), Embassy Suites + Homewood (DC), plus Cabana Bay (Orlando), Radio City Apartments (NYC), Marlin Queen Street + Marlin Limehouse (London). Remove amounts, derived nightly figures, plan premiums, overview ranges and JSON-LD/CSV values; show the budget gap; keep dated non-price facts; update pinned tests honestly. Use owner-supplied official observations instead where O2 provides them.

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
Acceptance: scoreboard vs baseline, which content and channels to scale, prune list; due on or after 2026-11-12 as a mid-cycle check (authorization now runs to 2027-01-15).

## NOT NOW (do not select; the site itself is not frozen)
- Newsletter (owner skipped, 10-28); Pinterest, YouTube and TikTok posting until their API approvals clear.
- Offline CLIs/"output isolation" work, source-governance pilot, evidence-batch tooling, NWS forecast pilot.
- New micro-calculators that only multiply numbers the parent types in.
- Community drafts, outreach, analytics, monetization (external actions; need owner approval anyway).
- Removing the SD meta-refresh stubs; title/CTR tests; FAQPage schema additions.
- Due-review research that changes nothing public.
