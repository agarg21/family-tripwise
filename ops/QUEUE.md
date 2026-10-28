# QUEUE (work top to bottom; at most 15 items; finished items move to ops/runs as one line)
Format: status · size (S ≤1 run, M 1–2, L 2–3) · owner approval (ops/OWNER.md id) · gate.


## Q17a Re-observe the 4 robots-permitted price samples (Jan 10-15, 2027)
open · S–M · owner: D9 Approved · gate: none; live by 2026-11-07
Access check: docs/research/q17-price-sample-access-2026-10-28.md. Properties: Loews Cabana Bay (Universal IBE, server-rendered; start here), Radio City Apartments (pegsbe, JS: Playwright), Marlin Queen Street and Marlin Limehouse (marlin.com engine untested). Same party/room basis as the Nov 8-13 sample, stay Sun 2027-01-10 to Fri 2027-01-15, one load per URL per run/week; record in a dated docs/research table; replace the Nov amounts on the Orlando, NYC and London pages/CSVs, saying it is a January sample (different season), not a renewal. Any engine that fails or blocks moves to Q17b.

## Q17b Remove Nov 8-13 amounts the operator cannot re-observe
open · M · owner: D9 Approved (O2 pending: owner manual observations) · gate: start on or after 2026-11-03 unless O2 answered; live by 2026-11-07
Arrival Nov 8 is the past-stay point (tools/content-freshness.mjs). 11 properties are robots- or bot-blocked: Hilton Park Plaza + Residence Inn (Boston), Citadines (London), Beacon + TRYP (NYC), Art of Animation + Holiday Inn (Orlando), Garza Blanca Sanctuary (PV), Homewood (SD), Embassy Suites + Homewood (DC). Remove amounts, derived nightly figures, plan premiums, overview ranges and JSON-LD/CSV values; show the budget gap; keep dated non-price facts; update pinned tests honestly. Use owner-supplied official observations instead where O2 provides them.

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
