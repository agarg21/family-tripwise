# QUEUE (work top to bottom; at most 15 items; finished items move to ops/runs as one line)
Format: status · size (S ≤1 run, M 1–2, L 2–3) · owner approval (ops/OWNER.md id) · gate.


## Q09c Lodging-page readability fix (remaining slice)
open · M · owner: D4e Approved · gate: none
Done: Q09a (25d73a7) spacing on six pages; Q09b (228eaac) hotel CSVs spaced; Q09c-Boston (cb5745a), Q09c-DC (1bdac05) and Q09c-PV (4e357c1) dated hotel amounts shown once, per-property and page "How we checked" blocks (details.how-checked, CSS in washington-dc-comparison.css?v=ft-q09c2; page h2 sits outside the details), dining CSV spaced.
Remaining: same pattern for Cancun, London, Orlando hotels (one page per run; reuse details.how-checked). P3s to fold in: tall Cancellation/meals rows and rate-table captions cut off inside the scroll region at 390 px (Boston, DC; PV fixed with a colgroup); PV next_checks comma runs ("Puerto Vallarta,Jalisco;", "18+,children 4-12,infants") not caught by run-together tests; PV Sanctuary visible block still long (caution + 8 checks).
Acceptance: each price appears once in the visible HTML; provenance in a collapsed "How we checked" block; summary per property ≤4 lines; run-together tests stay at 0.

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
