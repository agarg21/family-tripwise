# QUEUE (work top to bottom; at most 15 items; finished items move to ops/runs as one line)
Format: status · size (S ≤1 run, M 1–2, L 2–3) · owner approval (ops/OWNER.md id) · gate.

## Q01 Ship the Orlando admission form with refreshed tariffs
in progress (setup session 2026-10-27) · M · owner: D3 Approved · gate: none
Files: site/shared/{admission-budget,orlando-admission-form}.mjs, src/shared/orlando-admission-form.mjs, site/things-to-do/orlando-with-kids.html, tools/page-generation/orlando-activity-page.mjs, its 3 tests.
Acceptance: the 7 tariff sources re-observed (unconfirmed ones render "unknown"); static table and form share one dated basis; Chromium 1280/390/320 + keyboard + no-JS pass; reviewer PASS; release.json equals the merge SHA.

## Q02 Staleness sweep: no public due dates, no past-stay price samples
open · M · owner: D4a Approved · gate: none
Problem: 7 live pages show overdue "review due/recheck" dates (Cancun, Orlando hotels, Boston, DC, PV, London, SD hotels); Orlando activities joins them on Oct 28. Cancun Moon Palace sample is for Oct 18–23.
Files: those pages' generators in tools/page-generation/*, plus tools/seo-qa.mjs.
Acceptance: "Observed <date>; check live rates before booking" replaces every forward due/recheck date. Samples whose stay dates have passed are removed or labelled "older observation; dates passed". seo-qa errors on a forward-looking due date or a past-stay sample. Live check of all 8 URLs.

## Q03 Discovery fixes: sitemap lastmod, Orlando cross-link, dead Coronado link
open · S · owner: D4c Approved · gate: none
Files: tools/generate-pages.mjs (sitemap), Orlando hotels generator, the 5 SD pages citing coronadoferrylanding.com/ferry-info/ (404).
Acceptance: every <loc> has <lastmod> equal to its real last content change. where-to-stay/orlando-family-hotels.html links to things-to-do/orlando-with-kids.html and back. The Coronado link returns 200 or is replaced/removed.

## Q04 Shared nav and "Related guides" on every guide
open · M · owner: D4b Approved · gate: none
Problem: three different navs; Boston/DC/PV/London have 1 inbound link each, Cancun/Orlando hotels 2, Orlando activities 1.
Files: shared header/footer in tools/page-generation/* and tools/generate-pages.mjs, all guide pages.
Acceptance: one header on every guide (all destinations reachable). Every sitemap URL has ≥3 internal inbound links (scripted count). Each city's hotel list links to its itinerary and stay-area pages.

## Q05 About page truth fix (byline stays Miles Rowan per D5)
open · S · owner: none (1 page) · gate: none
Files: site/about.html (or its generator).
Acceptance: About no longer claims "human-verified experience"; it states plainly that guides are AI-assisted research from dated official sources and are not based on firsthand visits; Last-updated matches the latest change.

## Q06 Refresh NYC family-hotels (534 impressions, July "editorial ceilings")
open · L · owner: D7 Approved · gate: none
Files: site/where-to-stay/new-york-city-family-hotels.html, its data and generator.
Acceptance: no unobserved price bands. Each hotel shows a dated future-stay observation for 2 adults + 2 kids from an official source, or "check live rate". A ≤3-line answer box at the top (fits whom / rough cost / main catch). ≤3 pages touched.

## Q15 Next new page: itinerary for an existing destination that lacks one
open · M · owner: none if existing destination (new destination needs approval) · gate: Q02–Q04 done
Why: itinerary pages are the only page type earning clicks (LV 8.1, SA 9.5, CHI 13.8 avg position). Orlando, Washington DC, Boston and Cancun have lodging pages but no itinerary.
Acceptance: live SERP check shows a distinct itinerary job with demand; pick the strongest candidate; build it with dated official facts (hours, closures), nap/rest blocks, no unverified stroller/route claims; linked from that city's hotel and things-to-do pages; in sitemap; Chromium QA; reviewer PASS. If no candidate qualifies, record why and the next candidate.

## Q07 Refresh San Diego family-hotels (496 impressions, Aug 17 prices)
open · L · owner: D7 Approved · gate: none · Acceptance: as Q06 for site/where-to-stay/san-diego-family-hotels.html.

## Q08 Refresh Chicago family-hotels (346 impressions, "editorial room/date widening")
open · L · owner: D7 Approved · gate: none · Acceptance: as Q06 for site/where-to-stay/chicago-family-hotels.html.

## Q10 Las Vegas and San Antonio itinerary usefulness pass (avg positions 8.1 and 9.5)
open · M · owner: none · gate: Q04 done
Files: site/family-itinerary/las-vegas-with-kids.html, site/family-itinerary/san-antonio-with-kids.html, their generator.
Acceptance: one named deficiency fixed per page (e.g. top answer box; day-shape table with nap/rest blocks and dated hours). No unverified stroller/route claims. ≤3 pages.

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
open · L · owner: D7 Approved · gate: none · Acceptance: as Q06 for site/where-to-stay/las-vegas-family-hotels.html.

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
