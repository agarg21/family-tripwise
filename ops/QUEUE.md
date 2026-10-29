# QUEUE (work top to bottom; at most 15 items; finished items move to ops/runs as one line)
Format: status · size (S ≤1 run, M 1–2, L 2–3) · owner approval (ops/OWNER.md id) · gate.
Growth-first from 2026-10-28 (OWNER D10–D12): most runs go to G items; old Q items only for live-site defects and the Q17b deadline. Research: docs/research/growth-{deals-inventory,events-trends-inventory,distribution-landscape}-2026-10-28.md.

## G09w Deal-watch flags (recurring; keep this item open)
open · S · owner: D15 Approved · gate: ops/deal-watch/flags.json has a pending flag (none → skip this item)
One flag (or one operator's batch of flags) per run, before other items; live-site defects still first. For each flag: `changed` → read the official page once (WebSearch on the operator's domain, then WebFetch), verify what changed, update or add the deal check (deal-checks.json + docs/research/deal-checks-*.md) and today's queue if worth sharing (G09 scoring once built); `blocked`/`unreachable` → do not retry; note it in G05 carry. Then delete the flag from flags.json in the same commit. A flag is a lead, never a fact. If the push conflicts in flags.json (the hourly watcher updated it), merge (never rebase) and keep the watcher's other flags.
Carry P3s: a skipped (under-55-min) watch run counts as the previous run, so the next normal run can also skip (detection gap only); countdown/live-price lines may cause noise flags (judge on the first live days); robots.txt paths not percent-normalised (all sources ASCII).

## G10 Link previews for shared pages
open · S · owner: D11 Approved · gate: none (do before more posts go out)
The first Facebook post (2026-10-29) showed a blank document icon: deal and /this-week/ pages have no og:image. Add og:title, og:description, og:image (the item's 1080x1350 card or a 1200x630 typographic variant; no photos), og:url and twitter:card to /deals/*, /deals/ and /this-week/ via the generators; test that every deal page has an og:image that resolves.
Acceptance: Facebook link preview shows the card (check with a fresh post or the Sharing Debugger page read-only); reviewer PASS.

## G08 Post through Zernio
open · S · owner: D14 Approved · gate: ZERNIO_API_KEY secret exists (T3)
Built and on main 16e5ad8 (2026-10-29): tools/social-post.mjs posts all four platforms through Zernio when ZERNIO_API_KEY exists (accounts looked up at run time, Idempotency-Key per receipt, Threads link in first comment, Facebook link in text, Pinterest board from PINTEREST_BOARD_ID or the only public board); dry run against simulated Zernio passes; reviewer PASS_WITH_P3. API facts: docs/research/zernio-api-2026-10-29.md.
Remaining: after the first scheduled run with the key, check each platform's receipt and live post (Facebook link preview, Instagram card crop, Pinterest board, Threads first comment); then remove the direct Meta/Pinterest paths and their secrets from the workflow.
Carry P3s: a `publishing`/`scheduled` Zernio result is recorded `failed` (safe, never retried; could say "in progress"); re-check expiry right after a slow claim; tests for kill switch/expiry/409 on the Zernio route.

## G09 Deal fast lane: first, verified, worth sharing
open · L · owner: D15 Approved · gate: none
Step 1 done 2026-10-29 (8daaacb): .github/workflows/deal-watch.yml + tools/deal-watch.mjs watch 17 official pages (ops/deal-watch/sources.json) hourly at :23; flags go to G09w. No deal-watch run had appeared by 13:40 UTC Oct 29: check the first live runs (baseline status per source, noise). Step 2 done 2026-10-29 (d3f7909): every check needs a validated `score` (validateDealScore; family value only from an observed 2+2 total vs a same-day higher regular price; worth_it needs it; urgency derived by dealUrgency; novelty search with links); only worth_it/only_for are queued (shareable). All 10 current checks are only_for (no observed family math); record docs/research/deal-scores-2026-10-29.md. New checks (G05/G09w) must include a score. Next: steps 3–4. Carry P3: operator-domain novelty check uses the last two host labels (fix before a .co.uk-style operator).
1) Detect: a scheduled GitHub Action (no secrets) checks the tracked official deal pages hourly (robots.txt honored, at most 1 fetch per URL per hour, never bypass blocks), stores a hash and extracted headline per URL under ops/deal-watch/, and on a change commits a flag the next operator run takes before other work. 2) Score each verified deal in its record: family value (savings vs the regular price for 2 adults + 2 kids, from observed prices only), appeal (how many families it fits; brand/destination pull), urgency (book-by, sell-out), novelty (first seen? already covered by major deal sites or news, from a quick search, with links), and a verdict: Worth it / Only for <who> / Skip. Only Worth it and Only-for go to social. 3) Same day: a worthy deal gets an entry in today's queue at the next slot (regenerate today's queue; caps hold). Target: official launch to post within about 4 hours. 4) Content is the product (owner 2026-10-29): verdict first, then the family math (real cost for 2 adults + 2 kids on named dates vs the regular price, only from observed prices), who it is for and not for, the catch (blackouts, ages, fees), and the book-by date; card + post + the deal check page all carry the same verified numbers. Scope: OWNER D16.
Acceptance: watcher live with tests; scoring fields validated in deal-checks.json; one same-day end-to-end dry run; reviewer PASS.

## G05 Daily fresh sweep (recurring; keep this item open)
open · S per day · owner: D10/D11/D12 Approved · gate: none (G01 done)
First run after 06:00 ET each day: run `node tools/this-week.mjs` and commit if site/this-week changed (the deploy workflow drops expired items from the live copy daily, but the committed page must match today's render or tests fail); check the recurring sources (official pages first; news/deal sites as leads only), add newly verified items, remove expired ones, edit tools/page-generation/fresh-items.json (validated; research table in docs/research/this-week-items-*.md), refresh /this-week/ and /deals/ (tools/page-generation/deal-checks.json; record in docs/research/deal-checks-*.md; three of the four Oct 28 checks end Oct 31–Nov 2, so add new verified checks), and queue the next day's posts (`node tools/social-queue.mjs <date>` then `node tools/social-cards.mjs <date>`; regenerate a current queue whenever its records change): about 5–6 across all platforms Nov–Dec, 2–3 off-season, never filler. Record items added/expired in runs.
Carry P3s: Leads not publishable yet: Rockefeller tree 2026 (official tree page refused the fetcher Oct 29; do not retry unchanged; magazine pages still 2025); Macy's parade (macys.com Access Denied). EPCOT festival page says "Check back soon": re-observe after Nov 5 for admission/extras. Universal Orlando Special 3-Day Ticket (official page states no deadline or blockouts; recheck after Nov 4); Disneyland and Kalahari offer pages refuse the fetcher (do not retry unchanged). From G03/G04: prune cards of ended items from site/social/cards (once no current queue references them). NCL check: ended banner says "This offer ended" though only the Free 2nd Guest sale ends Nov 2 (note explains; optional per-check ended label). Aulani offers host prodc.www.disneyaulani.com is robots-disallowed (do not retry). NCL /promo/upgrades is stale ("ends August 2"). MSC robots.txt returns an "Unauthorized" bot page to plain requests (pages read via the fetch tool, as SeaWorld); MSC title/h1 say "sailing free" without the tax caveat (headline carries it). Hyatt Inclusive Collection offers host refuses the fetcher (do not retry unchanged). Deal-check table caption says "the <operator> offer page" even when terms come from several official pages (template P3). Deal page meta descriptions are cut at 300 characters mid-phrase (tools/page-generation/deals-pages.mjs; cut at a clause boundary + ellipsis). Dollywood (dollywood.com) returns Access Denied to plain requests (do not retry unchanged). Disney spring 2027 room offer not yet checked (detail page not found by search; index read Oct 28, refetch after Nov 4). Social queue: the "stay by <date>" deadline match would also drop the Book-by line if a travel deadline equalled expires_on (none today); validateQueue does not check that a skipped item_id exists. NAME_ABBREV in sentences() would glue a real sentence ending in a single capital or "Dr." (none in records today); queue test's long-form check line does not compare the date to observed_on.

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
Acceptance: scoreboard vs baseline, which content and channels to scale, prune list; due on or after 2026-11-12 as a mid-cycle check (authorization now runs to 2027-01-15).

## NOT NOW (do not select; the site itself is not frozen)
- Newsletter (owner skipped it for now, 2026-10-28); Pinterest, YouTube and TikTok posting until their API approvals clear.
- Offline CLIs and "output isolation" work (Ferry, OMNY, MoMA, Lake Eola, child-height fares), source-governance pilot, evidence-batch tooling, NWS forecast pilot.
- New micro-calculators that only multiply numbers the parent types in.
- Community drafts, outreach, analytics, monetization (external actions; need owner approval anyway).
- Removing the SD meta-refresh stubs; title/CTR tests; FAQPage schema additions.
- Due-review research that changes nothing public.
