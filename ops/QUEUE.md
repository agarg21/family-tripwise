# QUEUE (work top to bottom; at most 15 items; finished items move to ops/runs as one line)
Format: status · size (S ≤1 run, M 1–2, L 2–3) · owner approval (ops/OWNER.md id) · gate.

## Q08 Refresh Chicago family-hotels (346 impressions, "editorial room/date widening")
open · L · owner: D7 Approved · gate: none · Acceptance: as Q07 (delivered 530633c for SD; show any official family sample with its unknowns) for site/where-to-stay/chicago-family-hotels.html.

## Q10 Las Vegas and San Antonio itinerary usefulness pass (avg positions 8.1 and 9.5)
open · M · owner: none · gate: none (Q04 done)
Files: site/family-itinerary/las-vegas-with-kids.html, site/family-itinerary/san-antonio-with-kids.html, their generator.
Acceptance: one named deficiency fixed per page (e.g. top answer box; day-shape table with nap/rest blocks and dated hours). No unverified stroller/route claims. ≤3 pages.

## Q15b Next itinerary page: Boston with kids
open · M · owner: none (existing destination) · gate: none
Why: Q15 delivered the DC itinerary (ab7d177). Boston was the runner-up: on 2026-10-27 "boston itinerary with kids" returned dedicated family itinerary pages (mommypoppins, Fora, twisttravelmag, viewboston). Orlando's SERP is split between theme-park and non-park plans; Cancun is resort-stay intent.
Acceptance: re-run the SERP check with a second query; build with dated official facts (hours, passes, closures), rest blocks, no unverified stroller/route claims; follow the DC pattern (tools/page-generation/washington-dc-itinerary-page.mjs: venue cards with source + date, maintenance contract, inventory pins); linked from the Boston hotels page; sitemap; Chromium QA; reviewer PASS.

## Q02c Freshness-checker follow-ups (Q02b review P3s)
open · S · owner: none (tools + 1 page) · gate: none
Acceptance: the "review … by <date>" detector excludes booking words only when they directly precede by/before or are followed by terms/deadline/rules ("Review booking prices by Nov 1" is flagged again); the Leu source note on the Orlando page reconciles with its October 27 hours line; the CSV stay-sample checker also covers "Check-in"/ISO "Stay dates" columns; Chicago activities' visible "Last updated: July 23, 2026" reconciles with its 2026-10-13 admission check (Q03 review P3); Boston, London, DC and NYC-teen "home routes" tests strip the shared chrome from index.html; drop the duplicate Cancun .skip-link CSS (Q04b review P3s); NYC CSV gets its own "Older two-adult sample" column, tools/hotel-evidence.mjs default source_basis matches the check-live-rate kind, and the NYC answer-box "Fits" line is shortened for phones (Q06 review P3s).

## Q09 Lodging-page readability fix
open · M · owner: D4e Approved · gate: Q02 done
Problem: run-together text ("base1760USD", "remain72hours"), price blocks repeated 3 times, provenance strings in body copy.
Files: generators for Boston, DC, Cancun, PV, London, Orlando hotels.
Acceptance: a regex test finds 0 run-together number/word tokens in visible text. Each price appears once in the HTML. Provenance moves into a collapsed "How we checked" block. Summary per property ≤4 lines.

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
