# QUEUE (work top to bottom; at most 15 items; finished items move to ops/runs as one line)
Format: status · size (S ≤1 run, M 1–2, L 2–3) · owner approval · gate.
Growth-first (OWNER D10–D12): G items first; Q items only for live-site defects and Q17b. Research: docs/research/growth-*-2026-10-28.md.

## D23 Design system restyle (owner 2026-10-30, D23 Approved)
open · L · owner: D23 Approved (batches, all pages) · gate: each batch passes integrity + persona + design review (docs/plan/design-review.md)
Batches 1 (header, tokens, font, review gate) and 2 (page tops: h1 token, padding, lead/byline/photo caps, in-page navs, byline "Researched with AI · sources linked and dated · How we check") released by the owner session. Next: 3) cards/chips/tables (hub savings as cards, deal page saving as hero number, chip rows); 4) rest. P3s: one page-top look (gradient vs flat cream); jump links one teal style; deal byline under chips; London column narrower; photo credit format; Orlando title case; this-week "NYC" label; NYC hotels anecdote undated; London/DC coral focus rings; Escape/outside click to close menu; byline wording (owner D5 question).

## G14 Photo at the top of every page (owner 2026-10-29)
open · M · owner: D4/D17/D20 Approved (batches ok) · gate: none; before G13 step 2
Done through 17b989f. Remaining: 6 older deal pages via G11 v2 (most end Oct 31-Nov 3).
Carry P3s: Orlando hotels caveat-first opening, road photo; "USD" → "$" (Cancun, Orlando, Chicago, Atlantis, deal titles); Cancun duplicate check date; LV band wide; PV legalese; LV/Chicago captions lack place; hazy DC photo; disclaimer-first openings. D23 photo notes: red panda repeated (home + San Diego; SD crop cuts face); Orlando skyline not a family scene; London 2009 Trafalgar; Cancun plane-wing aerial; /deals/ hero is Cancun.

## G13 Page quality: weekly and on demand
open · M · owner: none · gate: none
Step 1 done (7071aa5): tools/site-quality.mjs on every deploy with a ratchet baseline (tools/site-quality-baseline.json). Carry P3s: empty tables; nested sections; --accept. Next: 2) Weekly (first Monday run): 404/410 outbound links, observations >60 days, persona + design review (contact sheet: node tools/design-sheet.mjs) of changed pages + top 3 by impressions; ledger ops/page-reviews.json; fix items, no automatic edits. 3) On demand: OWNER.md "review <page or all>".

## G09w Deal-watch flags (recurring; keep this item open)
open · S · owner: D15 Approved · gate: ops/deal-watch/flags.json has a pending flag (none → skip this item)
One flag (or one operator's batch of flags) per run, before other items; live-site defects still first. For each flag: `changed` → read the official page once unless read <7 days ago (then use the extract) (WebSearch on the operator's domain, then WebFetch), verify what changed, update or add the deal check (deal-checks.json + docs/research/deal-checks-*.md) and today's queue if worth sharing (G09 scoring once built); `blocked`/`unreachable` → do not retry; note it in G05 carry. Then delete the flag from flags.json in the same commit. A flag is a lead. On a flags.json push conflict, merge (never rebase) and keep the watcher's other flags.
Carry P3s: RC "$800 Deal Drop Sale" and SeaWorld "Save Up To 60% On Tickets" leads (read from Nov 4); Margaritaville tax line ambiguous; Oct 31 post "USD 0", FB >350 chars; chained skipped runs; countdown noise flags; robots paths not percent-normalised.

## G11 Deal content v3: spend-vs-save + concise (posting paused, D12)
open · M · owner: D11/D15/D19/D21 Approved · gate: none; do first
v3 FIRST (owner 2026-10-30, AGENTS.md Content Standard): spend-vs-save card at the top of every deal page and post, concise top (validator: ≤30 words), stricter persona gate. Delivered: 7 deal cards incl. LEGOLAND FL and Club Med (page only); D22 (only real deals, ≥5%, are posted/promoted). ogSpendLine: add unit_short + test. D22 P3s: breakEven from the one-day ticket part; hub deadline lost "free 2026 visits"; deal-page cross-links list non-real offers; Cancun hub hero; byline. Next: spend_save for the remaining deal pages, ≤3 per release (needs an observed "without" figure per deal: published regular prices, G12 hotel samples); then make the card required for posting. --refresh current queues. P3s: og/share cards lack spend figures; SeaWorld catch lost "holiday blockouts"; posts near the 420 cap; card/post lost "near San Diego"; $169 box not tied to $676; Pinterest links to /deals/; Busch hub lacks 3-day caveat; LEGOLAND FL hub save line unconditional.

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

## G05e Event post/card template (blocks q/G05-1031)
open · S · owner: D11/D12 Approved · gate: none; release before Nov 5
Built on q/G05e (8d61be86; includes q/G05-1031 Gaylord items + Nov 5 queue): ~260-360-char event posts (title, When, Cost, catch, "Checked on <host> on <date>"), teal-band event cards with Tip row and Good-to-know chip, post lines in fresh-items `post` (validated; $ amounts must be in the cost record except labelled "(family of N … est.)"), Oct 31-Nov 5 queues/cards refreshed. Persona 3.47→3.93→4.0 PASS; design 3.6→4.0→4.0 PASS; integrity P3→P3→FAIL (P2 Very Merry cost lacked per-ticket/before-tax basis; fixed in 8d61be86, not yet re-reviewed). Next: one integrity confirm of 8d61be86 (and quick persona/design glance), merge main, re-test, release. P3s (runs 10-31): estimate not recomputed by validator; Gaylord titles; photo band later; /this-week/ first screen, lead, "USD".

## G05 Daily fresh sweep (recurring; keep this item open)
open · S per day · owner: D10/D11/D12 Approved · gate: none (G01 done)
First run after 06:00 ET each day: run `node tools/this-week.mjs` and commit if site/this-week changed; check the recurring sources (official pages first; news/deal sites as leads only), add newly verified items, remove expired ones, edit tools/page-generation/fresh-items.json (validated; research table in docs/research/this-week-items-*.md), refresh /this-week/ and /deals/ (tools/page-generation/deal-checks.json; record in docs/research/deal-checks-*.md; three of the four Oct 28 checks end Oct 31–Nov 2, so add new verified checks), and queue the next day's posts (`node tools/social-queue.mjs <date>` then `node tools/social-cards.mjs <date>`; regenerate a current queue whenever its records change): about 5–6 across all platforms Nov–Dec, 2–3 off-season, never filler. Record items added/expired in runs.
Carry P3s: Deal watch: beaches.com/specials (robots.txt 403) and both MSC pages (401) blocked since 10-29; no `retry` unless robots.txt reads fine later. Leads not publishable yet: Rockefeller tree 2026 (official page refused the fetcher Oct 29; no retry unchanged); Macy's parade (macys.com Access Denied). EPCOT festival page says "Check back soon": re-observe after Nov 5 for admission/extras. Universal Orlando Special 3-Day Ticket: recheck after Nov 4; Disneyland and Kalahari offer pages refuse the fetcher (do not retry unchanged). From G03/G04: prune cards of ended items from site/social/cards (once no current queue references them). NCL check: ended banner says "This offer ended" though only the Free 2nd Guest sale ends Nov 2 (note explains; optional per-check ended label). Aulani offers host robots-disallowed (no retry). MSC robots.txt returns an "Unauthorized" bot page to plain requests (pages read via the fetch tool, as SeaWorld); MSC title/h1 say "sailing free" without the tax caveat (headline carries it). Hyatt Inclusive refuses the fetcher. Terms caption names only the offer page though rows can come from other official pages (P3). Dollywood denied (no retry). Disney Cruise offers: redirect loop (10-30), no retry. Disney spring 2027 room offer: refetch index after Nov 4. Busch Preschool Card 2027 not open 10-30.

## Q17b Remove Nov 8-13 amounts the operator cannot re-observe
open · M · owner: D9 Approved (O2 answered No: remove) · gate: none; live by 2026-11-07
Held for O13 (all else pass): Boston q/Q17b-boston (c3c474d7, persona 3.73), London q/Q17b-london (persona 3.93; drop 2027-01-08 test-guarded); release if O13 yes (merge main, re-test). 1-night figures for NYC/Orlando: docs/research/q17b-midweek-hotel-prices-2026-10-31.md (PV none). Delivered 10-31: DC, SD, NYC, Orlando (listings drop 2027-01-08, test-guarded). PV held on q/Q17b-pv (5bb787e3, persona 3.2) for O13. PV P3s: example stay test fails 2027-01-08; CSV "USD" unpriced; dead pvFoodBudget code/assets; card CSS; dense body. Orlando P3s: see runs 10-31. NYC P3: unused #dated-family-budgets CSS. P3s: findPastStaySamples "January 15 to 20, 2027" form; SD "Most important check" cells; eyebrow repeats h1; "Pick by trip style" heading; card two-column ≥960px.

## Q09c Lodging-page readability polish (P3s only)
open · S · owner: D4e Approved · gate: none
Done: Q09a, Q09b, Q09c slices for Boston, DC, PV, Cancun, London, Orlando: each dated amount shown once, provenance collapsed.
Remaining P3s (full list in git history of this file before 2026-10-31 13:00Z): Boston/DC tall rows and captions cut at 390 px; PV next_checks comma runs; PV Sanctuary block long; Cancun Sapphire pointer wording and five identical link texts; London GBP nowrap/.london-rate scope; Orlando nightly column off-screen at 390, hardcoded party text, identical captions.
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
