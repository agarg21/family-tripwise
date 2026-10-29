# QUEUE (work top to bottom; at most 15 items; finished items move to ops/runs as one line)
Format: status · size (S ≤1 run, M 1–2, L 2–3) · owner approval (ops/OWNER.md id) · gate.
Growth-first from 2026-10-28 (OWNER D10–D12): most runs go to G items; old Q items only for live-site defects and the Q17b deadline. Research: docs/research/growth-{deals-inventory,events-trends-inventory,distribution-landscape}-2026-10-28.md.

## G14 Photo at the top of every page (owner 2026-10-29)
open · M · owner: D4/D17 Approved (batches ok) · gate: none; before G13 step 2
Link previews done (c5fa555). Batch 1 (11 lodging pages + Orlando things-to-do) on q/G14 61aeea1, held: integrity PASS_WITH_P3, persona 3.83 (older copy: no $ glance on LV/SA, caveat-heavy intros). Release per O8, or add LV/SA dated $ glance and re-review. Remaining: 36 of 52 pages have no photo above the fold (owner saw London: its only photo is near the bottom). In batches of ≤12 pages per release: add or move a credited, self-hosted hero photo into the hero (Commons, free-license stock or media-kit per D17; tools/images/commons-images.json + self-host workflow). Persona review per batch; baseline gaps close.
Carry P3s: "USD" in deal titles/RC body → "$" in D19 rollout; 4–5-line deal cards at phone width; London/Orlando meta-description jargon.

## G13 Page quality: weekly and on demand
open · M · owner: none · gate: none
Step 1 done (7071aa5): tools/site-quality.mjs on every deploy with a ratchet baseline (tools/site-quality-baseline.json). Carry P3s: empty-table check edge cases; nested sections skip outer text; --accept takes the next arg blindly. Next: 2) Weekly (first Monday run): site-health report: outbound 404/410 links (browser UA, robots honored), observations older than 60 days, persona review (docs/plan/page-quality-rubric.md) of pages changed since last review + top 3 by impressions; ledger ops/page-reviews.json; failing pages get fix items; summary in STATE; no automatic edits. 3) On demand: OWNER.md "review <page or all>" goes next.

## G09w Deal-watch flags (recurring; keep this item open)
open · S · owner: D15 Approved · gate: ops/deal-watch/flags.json has a pending flag (none → skip this item)
One flag (or one operator's batch of flags) per run, before other items; live-site defects still first. For each flag: `changed` → read the official page once (WebSearch on the operator's domain, then WebFetch), verify what changed, update or add the deal check (deal-checks.json + docs/research/deal-checks-*.md) and today's queue if worth sharing (G09 scoring once built); `blocked`/`unreachable` → do not retry; note it in G05 carry. Then delete the flag from flags.json in the same commit. A flag is a lead, never a fact. If the push conflicts in flags.json (the hourly watcher updated it), merge (never rebase) and keep the watcher's other flags.
Carry P3s: a skipped (under-55-min) watch run counts as the previous run, so the next normal run can also skip (detection gap only); countdown/live-price lines may cause noise flags (judge on the first live days); robots.txt paths not percent-normalised (all sources ASCII).

## G11 Deal content v2 + persona review (posting paused, D12)
open · M · owner: D11/D15 Approved; rollout needs O7 · gate: none
Step 1 done 2026-10-29 (b32bd32): Beaches page v2 (validateDealV2; hero photo; og card via tools/deal-og-images.mjs).
Step 2 done 2026-10-29 (1a3c8e8): v2 post text + photo card from validated v2.post; `social-queue.mjs <date> --refresh`. Persona 4.07.
Next: 3) after O7: v2 (page + post block) for the other deal checks, longest-lived first (Club Med, SeaWorld, Atlantis, LEGOLAND), ≤3 pages per release, then --refresh current queues; photos via tools/images/commons-images.json (self-host-images workflow triggers on q/Q11, q/G11 pushes). Carry P3s: related-deal hedges smaller grey; phone photo pushes verdict below first screen; desktop h2s big; validateQueue: cap image.alt at 500; FB text 392 chars (aim ~350); card lacks "older visitor photo" note.

## G12 Trip-cost data for the glance test
open · M · owner: D20 Approved · gate: none for hotels (DataForSEO); flights need the SERPAPI_API_KEY secret (owner T3)
Research done 2026-10-29: docs/research/trip-cost-sources-2026-10-29.md (flights: SerpApi Google Flights; hotels: DataForSEO Google Hotels; cruises/parks: official fares). Build a price-request workflow (secrets only in Actions, dated receipts) and the "about $X normally, about $Y with the deal" line (estimate; party, ages, dates, NYC gateway, observed date). Check the unknowns listed there first.

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
Carry P3s: Deal watch: beaches.com/specials (robots.txt 403) and both MSC pages (401) blocked since 10-29; no `retry` unless robots.txt reads fine later. Leads not publishable yet: Rockefeller tree 2026 (official tree page refused the fetcher Oct 29; do not retry unchanged; magazine pages still 2025); Macy's parade (macys.com Access Denied). EPCOT festival page says "Check back soon": re-observe after Nov 5 for admission/extras. Universal Orlando Special 3-Day Ticket (official page states no deadline or blockouts; recheck after Nov 4); Disneyland and Kalahari offer pages refuse the fetcher (do not retry unchanged). From G03/G04: prune cards of ended items from site/social/cards (once no current queue references them). NCL check: ended banner says "This offer ended" though only the Free 2nd Guest sale ends Nov 2 (note explains; optional per-check ended label). Aulani offers host prodc.www.disneyaulani.com is robots-disallowed (do not retry). NCL /promo/upgrades is stale ("ends August 2"). MSC robots.txt returns an "Unauthorized" bot page to plain requests (pages read via the fetch tool, as SeaWorld); MSC title/h1 say "sailing free" without the tax caveat (headline carries it). Hyatt Inclusive Collection offers host refuses the fetcher (do not retry unchanged). Deal-check table caption says "the <operator> offer page" even when terms come from several official pages (template P3). Dollywood (dollywood.com) returns Access Denied to plain requests (do not retry unchanged). Disney spring 2027 room offer not yet checked (detail page not found by search; index read Oct 28, refetch after Nov 4).

## Q17b Remove Nov 8-13 amounts the operator cannot re-observe
open · M · owner: D9 Approved (O2 answered No: remove) · gate: none; live by 2026-11-07
Arrival Nov 8 is the past-stay point (tools/content-freshness.mjs). All 15 properties are blocked for the operator (Q17a attempt 2026-10-28: Cabana Bay robots-disallowed to the fetcher, Radio City and Marlin Queen Street/Limehouse have no dated rate outside a booking-engine date search): Hilton Park Plaza + Residence Inn (Boston), Citadines (London), Beacon + TRYP (NYC), Art of Animation + Holiday Inn (Orlando), Garza Blanca Sanctuary (PV), Homewood (SD), Embassy Suites + Homewood (DC), plus Cabana Bay (Orlando), Radio City Apartments (NYC), Marlin Queen Street + Marlin Limehouse (London). Remove amounts, derived nightly figures, plan premiums, overview ranges and JSON-LD/CSV values; show the budget gap; keep dated non-price facts; update pinned tests honestly. Use owner-supplied official observations instead where O2 provides them.

## Q09c Lodging-page readability polish (P3s only)
open · S · owner: D4e Approved · gate: none
Done: Q09a, Q09b, Q09c slices for Boston, DC, PV, Cancun, London, Orlando: each dated amount shown once, provenance collapsed.
Remaining P3s: tall Cancellation/meals rows and rate-table captions cut off at 390 px (Boston, DC); PV next_checks comma runs ("Puerto Vallarta,Jalisco;", "18+,children 4-12,infants") not caught by run-together tests; PV Sanctuary visible block long; Cancun overview pointer wording kind-aware for Sapphire's undated two-adult rate; re-clicking a targeted "How we checked this price" link does not reopen a closed block; five identical Cancun link texts (add hotel name visually hidden); London "GBP"+amount nowrap at 390 px, scope .london-rate under .london-page, test compare e()-escaped plan names. Orlando: nightly-sample column is 4th of a 600px table (off-screen at 390; move to 2nd); sample-basis party text hardcoded (build from records); say "not complete checkout totals" visibly in the overview; "+ resort fees" cell has no amount pointer; stay-total captions identical (add hotel name); test gaps (shared USD270 line, plan terms in table, shared IHG source).
Acceptance: fixes above; ≤3 public pages per release unless under D4e.

## Q12 Refresh Las Vegas family-hotels (279 impressions, 2 clicks, July prices)
open · L · owner: D7 Approved · gate: none · Acceptance: as Q07 for site/where-to-stay/las-vegas-family-hotels.html.

## Q14 Cycle go/no-go memo
open · S · owner: none · gate: on or after 2026-11-12
Files: ops/OWNER.md.
Acceptance: scoreboard vs baseline, which content and channels to scale, prune list; due on or after 2026-11-12 as a mid-cycle check (authorization now runs to 2027-01-15).

## NOT NOW (do not select; the site itself is not frozen)
- Newsletter (owner skipped it for now, 2026-10-28); Pinterest, YouTube and TikTok posting until their API approvals clear.
- Offline CLIs and "output isolation" work (Ferry, OMNY, MoMA, Lake Eola, child-height fares), source-governance pilot, evidence-batch tooling, NWS forecast pilot.
- New micro-calculators that only multiply numbers the parent types in.
- Community drafts, outreach, analytics, monetization (external actions; need owner approval anyway).
- Removing the SD meta-refresh stubs; title/CTR tests; FAQPage schema additions.
- Due-review research that changes nothing public.
