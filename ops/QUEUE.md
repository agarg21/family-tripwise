# QUEUE (work top to bottom; at most 15 items; finished items move to ops/runs as one line)
Format: status · size (S ≤1 run, M 1–2, L 2–3) · owner approval (ops/OWNER.md id) · gate.
Growth-first from 2026-10-28 (OWNER D10–D12): most runs go to G items; old Q items only for live-site defects and the Q17b deadline. Research: docs/research/growth-{deals-inventory,events-trends-inventory,distribution-landscape}-2026-10-28.md.

## G02 /deals/ hub + first Family Deal Checks
open · M · owner: D11 Approved · gate: none
A Family Deal Check is one page per deal: what the offer really means for a family of 4 (child ages, occupancy, blackout dates, minimum nights, fees, book-by and travel windows) and the family total on named dates only if observed on the official site; otherwise "check live" with the terms check. Every check has expires_on; expired checks leave the hub automatically and their page states "This offer ended <date>" (no redirect/noindex without approval).
Start with 2–3 non-Disney offers from the research (e.g. Royal Caribbean kids promos, Great Wolf Lodge flash sale, Club Med/Beaches sale), verified on official pages.
Acceptance: hub + ≥2 checks live, each terms row sourced and dated; no unobserved totals; Chromium QA; reviewer PASS.

## G03 Social post queue and image cards (no posting)
open · M · owner: D12 Approved · gate: none (G01 done 925b244)
Files: ops/social-queue/YYYY-MM-DD.json (one entry per post: item id, platform variants for Instagram/Facebook/Threads/Bluesky/Pinterest/TikTok/YouTube, link with utm, image path, expires_at), a generator that renders 1080x1350 JPEG cards from verified item data via headless Chromium (no AI images of real places, no reposted promo art), and a validator test (sources present, nothing expired, per-platform length limits, max posts/day per platform from the research).
Acceptance: a day's queue for the current items validates; sample cards render cleanly; reviewer PASS.

## G04 Posting workflow (GitHub Actions, per platform as secrets appear)
open · M · owner: D12 Approved · gate: G03 done
.github/workflows/social-post.yml posts due queue entries with repository secrets, platform by platform, only when that platform's secret exists (Bluesky first: BLUESKY_HANDLE + BLUESKY_APP_PASSWORD; then Meta: META_PAGE_TOKEN/IG_USER_ID/THREADS_TOKEN; Pinterest; TikTok as drafts; YouTube; Kit for the newsletter). Same safety pattern as the DataForSEO workflow: latest main, one receipt per post committed fast-forward only, never post twice, never post an expired entry, per-platform daily caps, a kill switch row in OWNER.md (D12) checked before each post.
Acceptance: dry-run mode tested end to end with a simulated platform; reviewer PASS. Never handle tokens directly.

## G05 Daily fresh sweep (recurring; keep this item open)
open · S per day · owner: D10/D11/D12 Approved · gate: none (G01 done)
First run after 06:00 ET each day: run `node tools/this-week.mjs` and commit if site/this-week changed (the deploy workflow drops expired items from the live copy daily, but the committed page must match today's render or tests fail); check the recurring sources (official pages first; news/deal sites as leads only), add newly verified items, remove expired ones, edit tools/page-generation/fresh-items.json (validated; research table in docs/research/this-week-items-*.md), refresh /this-week/ and /deals/, and queue that day's posts: about 5–6 across all platforms Nov–Dec, 2–3 off-season, never filler. Record items added/expired in runs.

## G06 Weekly newsletter draft
open · S · owner: D12 Approved · gate: none (G01 done)
Each Thursday, write that week's issue (top family deals checked, events by city, one useful planning tip) to ops/newsletter/YYYY-MM-DD.md from verified items only; sending happens via G04 once the Kit secret exists.

## G07 Privacy and Terms pages
open · S · owner: O3 pending · gate: O3 Approved
Required by the Meta, TikTok and Pinterest developer apps the owner is creating.



## Q17b Remove Nov 8-13 amounts the operator cannot re-observe
open · M · owner: D9 Approved (O2 pending: owner manual observations) · gate: start on or after 2026-11-03 unless O2 answered; live by 2026-11-07
Arrival Nov 8 is the past-stay point (tools/content-freshness.mjs). All 15 properties are blocked for the operator (Q17a attempt 2026-10-28: Cabana Bay robots-disallowed to the fetcher, Radio City and Marlin Queen Street/Limehouse have no dated rate outside a booking-engine date search): Hilton Park Plaza + Residence Inn (Boston), Citadines (London), Beacon + TRYP (NYC), Art of Animation + Holiday Inn (Orlando), Garza Blanca Sanctuary (PV), Homewood (SD), Embassy Suites + Homewood (DC), plus Cabana Bay (Orlando), Radio City Apartments (NYC), Marlin Queen Street + Marlin Limehouse (London). Remove amounts, derived nightly figures, plan premiums, overview ranges and JSON-LD/CSV values; show the budget gap; keep dated non-price facts; update pinned tests honestly. Use owner-supplied official observations instead where O2 provides them.

## Q09c Lodging-page readability polish (P3s only)
open · S · owner: D4e Approved · gate: none
Done: Q09a (25d73a7), Q09b (228eaac), Q09c slices Boston (cb5745a), DC (1bdac05), PV (4e357c1), Cancun (575d512), London (1e03f62), Orlando (ccf65d8): each dated hotel amount shown once, provenance in collapsed details.how-checked blocks.
Remaining P3s: tall Cancellation/meals rows and rate-table captions cut off at 390 px (Boston, DC); PV next_checks comma runs ("Puerto Vallarta,Jalisco;", "18+,children 4-12,infants") not caught by run-together tests; PV Sanctuary visible block long; Cancun overview pointer wording kind-aware for Sapphire's undated two-adult rate; re-clicking a targeted "How we checked this price" link does not reopen a closed block; five identical Cancun link texts (add hotel name visually hidden); London "GBP"+amount nowrap at 390 px, scope .london-rate under .london-page, test compare e()-escaped plan names. Orlando: nightly-sample column is 4th of a 600px table (off-screen at 390; move to 2nd); sample-basis party text hardcoded (build from records); say "not complete checkout totals" visibly in the overview; "+ resort fees" cell has no amount pointer; stay-total captions identical (add hotel name); test gaps (shared USD270 line, plan terms in table, shared IHG source).
Acceptance: fixes above; ≤3 public pages per release unless under D4e.

## Q11 Self-host resized hero images
open · S · owner: D4d Approved · gate: none
Files: the 9 pages using commons.wikimedia.org Special:Redirect originals, plus site/images/.
Acceptance: each hero ≤200 KB WebP served from familytripwise.com, attribution/licence caption kept, fetchpriority="high", no layout shift at 390 px.

## Q12 Refresh Las Vegas family-hotels (279 impressions, 2 clicks, July prices)
open · L · owner: D7 Approved · gate: none · Acceptance: as Q07 for site/where-to-stay/las-vegas-family-hotels.html.

## Q13 Weekly link and freshness report (report only)
open · S · owner: none · gate: none
Files: tools/link-check.mjs (+ test).
Acceptance: Monday runs list outbound URLs returning 404/410 (browser UA, honoring robots) and observations older than 60 days; summary goes into STATE holds; no automatic page edits.

## Q14 Cycle go/no-go memo
open · S · owner: none · gate: on or after 2026-11-12
Files: ops/OWNER.md.
Acceptance: scoreboard vs baseline, which page type to scale, prune list, renew/pause recommendation for after 2026-11-13 17:00 ET.

## NOT NOW (do not select; the site itself is not frozen)
- Offline CLIs and "output isolation" work (Ferry, OMNY, MoMA, Lake Eola, child-height fares), source-governance pilot, evidence-batch tooling, NWS forecast pilot.
- New micro-calculators that only multiply numbers the parent types in.
- Community drafts, outreach, analytics, monetization (external actions; need owner approval anyway).
- Removing the SD meta-refresh stubs; title/CTR tests; FAQPage schema additions.
- Due-review research that changes nothing public.
