# SEO Research & Review Backlog

Last updated: 2026-09-02

Queue note: this file preserves research and review handoffs. It is not a scheduler. Current selection lives in `ops/seo-roadmap.json`; during the authorized August 12-September 12 independent pilot, the Family Tripwise Master heartbeat is the only scheduler and each selected action must be registered there before substantive work.

## Active Usefulness Research

Implementation follow-through: the separately selected `FT-IMP-027` / `IMP-048` action implemented and released the narrowed conditional recovery at commit `ac5a68d94ebcaeed08349d30a67fcdbec0f88fce` through successful Pages run `33680285894`. It checks hard lodging constraints first and links to the itinerary only when multiple areas remain viable and the first two days are unsequenced. Native, responsive, release-marker, production SEO, and target-invariant QA pass; Noether cycle-one `PASS` leaves no P0-P3. The research actions below remain historical and did not themselves authorize a page edit.

### SRR-048: NYC Stay-Area Planning-Order Questions

Status: completed, review-clean and pushed at `12ac8a3`; James cycle-three `PASS` with no remaining P0-P3; research/state only; no page edit selected

Selected: 2026-09-02 by the morning independent Family Tripwise pilot

Test the `FT-RES-026` falsification trigger with five current public family questions: whether the unresolved state recurs when a family has cross-city anchors but no day sequence or base, and whether families with fixed lodging or sequenced days would be interrupted by an unconditional itinerary-first route.

Boundaries:

- Research/state only across the ten registered paths; do not edit `site/**`, page copy, generators, tests, URLs, indexability, sitemap, schema, external accounts, posts, outreach, destinations, or automation.
- Retain only source date/URL, paraphrased planning state, constraints, and answer job. Retain no usernames, copied thread text, personal data, demand or prevalence claim, firsthand claim, or invented user preference.
- Classify each question as unordered anchors/open base, fixed base/unsequenced days, or fixed lodging/sequenced days. Conclude `REJECT`, `RETAIN`, or `NARROW` for unselected `IMP-048`; make no implementation in this action.

Expected artifact:

- `docs/research/new-york-city-stay-area-planning-order-questions-2026-09-02.md`

Candidate result:

- Retain and narrow unselected `IMP-048`. Two questions begin with an open base plus loose or unordered cross-city anchors, but one follow-up says points and free-night economics decide the booking; only the other independently supports the unresolved sequencing state. Three controls already treat lodging as fixed or assumed and have sequenced days.
- The bounded result supports one nearby itinerary route only after checking whether a hard property constraint already decides the base and only when multiple viable bases remain. Preserve the known-days path, both pages, and both URLs; make no implementation in this action.
- Treat the five records as qualitative examples only. They do not establish prevalence, demand, behavior, satisfaction, or user preference.

### SRR-047: NYC Stay-Area Choice Without A Drafted Itinerary

Status: completed, review-clean and pushed at `ba33329` as `FT-RES-026`; Galileo cycle-one `PASS` with no P0-P3; no page edit selected

Selected: 2026-09-01 by the afternoon independent Family Tripwise pilot

Test the morning review's next falsification trigger: whether a first-time family with an unordered set of must-dos, a likely midday reset, and no drafted first-two-day itinerary can still reach a provisional area, runner-up, reversal condition, exact checks, and named-hotel handoff from the live stay-area page.

Boundaries:

- Research/state only across the ten registered paths; do not edit `site/**`, page copy, generators, tests, URLs, indexability, sitemap, schema, external accounts, posts, outreach, destinations, or automation.
- Run the live page through a requested 1280 by 900 desktop size plus exact 390 by 844 and 320 by 800 mobile sizes. Record the actual viewport and treat the result as proxy-reviewed interface evidence, never user testing or satisfaction evidence.
- Compare an unordered-anchor case with a first-two-days-known control. Score `Start`, `Reduce`, `Compare`, `Trace`, `Decide`, `Verify`, and `Recover`; conclude `PRESERVE`, `OBSERVE`, or retain at most one bounded unselected candidate.

Expected artifact:

- `docs/research/new-york-city-stay-area-no-itinerary-task-review-2026-09-01.md`

Current result:

- The unordered-anchor case is `PARTIAL`; it narrows five areas to Upper West Side, Midtown, and Downtown but cannot reach the required two or a stable provisional choice before the family sequences the first two days.
- The first-two-days-known control is `YES` across all seven protocol steps and provisionally chooses Upper West Side over Midtown because the protected return falls on the park/museum day.
- The itinerary sibling route is correct and works, but begins about 5.0 desktop, 7.0 390-mobile, and 8.2 narrow-mobile viewports down. Retain only unselected `IMP-048`, one compact nearby recovery link. Preserve the page and URL now.
- Galileo independently reproduced the task, viewport, containment, and navigation evidence and returned cycle-one `PASS` with no P0-P3.

### SRR-046: NYC Family Stay-Area Live SERP Review

Status: completed, review-clean and pushed at `96c9df9` as `FT-RES-025`; Bernoulli cycle-two `PASS` with no P0-P3; no page edit selected

Selected: 2026-09-01 by the morning independent Family Tripwise pilot

Three US-oriented formulations and representative local/firsthand, OTA, broad-publisher, independent family-guide, hotel-route, resident-family, and real-estate results were inspected. The broader `family neighborhood` boundary query mixes resident and travel intent; those residential results are excluded from visitor inventory conclusions. The bounded travel snapshot does not reveal a named page failure. Preserve the current five-area conditional decision, separate hotel-page role, and URL; promote no implementation candidate. Exact scope is the nine registered research/state paths, with no `site/**`, URL/search-state, external-action, or automation change.

Expected artifact:

- `docs/research/new-york-city-stay-area-live-serp-review-2026-09-01.md`

Review result:

- Cycle one found four P2s covering mixed intent, summary-only source overreach, review-state mirrors, and stale NYC GSC blockers. Cycle two verified all corrections and returned `PASS` with no P0-P3.

### SRR-045: Chicago Family Trip-Length Language Review

Status: completed, review-clean and pushed at `64eddc4` as `FT-RES-024`; Kepler cycle-one `PASS` with no P0-P3; no page edit selected

Selected: 2026-08-31 by the morning independent Family Tripwise pilot

Test whether current family questions treat a numeric Chicago trip length as a sufficient planning input, or instead separate calendar span, nights, arrival/departure windows, usable sightseeing blocks, age/pace, transport, budget, and removal decisions.

Boundaries:

- Inspect three to five current public questions. Retain only source date and URL, a paraphrased decision context, recurring constraints, and the work a useful answer must perform; retain no usernames, copied thread text, personal data, demand claim, or firsthand claim.
- Use the August 30 public-safe GSC snapshot as recent reused orientation only. It has no aligned query cohort and does not select an edit.
- Test whether unselected `IMP-047` should be rejected, retained, or narrowed. Do not edit `site/**`, the Chicago itinerary, generators, tests, URLs, indexability, sitemap, external accounts, posts, outreach, or automation.

Expected artifact:

- `docs/research/chicago-current-family-trip-length-questions-2026-08-31.md`

Candidate result:

- Reject numeric day-count sufficiency within the bounded sample. Three child-family questions and one newer cross-generational pacing control all require calendar span to be translated into usable sightseeing blocks.
- Retain and narrow unselected `IMP-047` to one conditional full-day check inside the existing three-day choice. Keep the soft-arrival shape and route three complete days to one central plus two separate contrast zones.
- Add no section, fourth day, attraction, URL, demand/prevalence claim, or page edit in this action.
- Kepler cycle-one `PASS` independently confirms all four source dates and proportional paraphrases, the privacy/evidence boundaries, exact ten-path/no-site scope, GSC classification, and candidate proportionality with no P0-P3.
- The August 31 afternoon heartbeat subsequently selected the bounded candidate as `FT-IMP-026`; `FT-RES-024` itself remains a research-only action.
- The selected implementation is released and production-verified at `d8f178c` through Pages run `33438625886` and improves the two previously `PARTIAL` three-full-day outputs to `YES` in the independently reproduced rendered-page rerun. Implementation reviewer Kepler cycle two returned `PASS` after one stale-state P2 correction; the live marker, production SEO, and invariants pass. This does not convert the qualitative research into demand or user-validation evidence.

### SRR-044: Chicago Itinerary Full-Day Promise Task Review

Status: completed, review-clean and pushed at `4d42d30` as `FT-RES-023`; Mill cycle-two `PASS` with no P0-P3; no page edit selected

Selected: 2026-08-30 by the morning independent Family Tripwise pilot

Test whether the live Chicago itinerary can directly answer a three-full-sightseeing-day family task, using a two-full-day task as the control, without treating its stated soft-arrival first day as a full day.

Boundaries:

- Research/state only; do not edit `site/**`, the Chicago itinerary, generators, tests, URLs, indexability, sitemap, external accounts, posts, outreach, or automation.
- Use normal links or controls at a requested 1280 by 900 desktop size plus exact 390 by 844 and 320 by 800 mobile sizes; record the actual inner viewport and treat the result as proxy-reviewed interface evidence, never user testing, behavior, satisfaction, rank or CTR evidence.
- Score six outputs: usable full-day count; one zone or anchor per day; protected midday reset; weather or budget swap; one removal rule; and a current verification route.
- Recent reused August 29 GSC selected no edit; the fresh August 30 snapshot arrived before release, validated, and remains orientation only because the public record contains no aligned query cohort. Conclude `PRESERVE` or retain at most one bounded unselected future defect hypothesis.

Expected artifact:

- `docs/research/chicago-family-itinerary-full-day-task-review-2026-08-30.md`

Current result:

- The three-full-day case is `PARTIAL`; the two-full-day control is `YES` across all six outputs.
- The current three-day route is coherently a soft arrival plus two full days. A family with three complete sightseeing days must infer its third full-day zone or anchor.
- Reset, weather/budget swap, removal, and verification outputs are complete. The 1280-pixel desktop width and exact 390 by 844 and 320 by 800 mobile runs have zero horizontal overflow. The operator saw a 900-pixel desktop height; Mill's review environment clamped to 720, so no cross-environment desktop-height or depth-ratio claim is retained.
- Preserve the page and URL. Retain only unselected `IMP-047`, a bounded distinction inside the existing three-day quick pick and route; add no day, section, entity, page, or URL.
- Mill cycle one reproduced the result but found one P2 desktop-height evidence overstatement. Cycle two verified the correction and full eleven-path action, then returned `PASS` with no P0-P3.
- Pre-release mechanical snapshot `35e0eb5` is fresh through August 28: 2,050 property impressions, 4 clicks, average position 65.62, 24/28 indexed, and 40 Chicago-itinerary impressions at page-average position 47.3. It changes no conclusion.

### SRR-043: Las Vegas Pool-Versus-Central-Base Cross-Page Task Review

Status: completed and review-clean as `FT-RES-022`; Gauss cycle-two `PASS` with no P0-P3; docs-only action commit `f1dace7d41c13e5767c5dc4894b7b6bc3ae9b339`

Selected: 2026-08-29 by the morning independent Family Tripwise pilot

Test whether the live Las Vegas itinerary, stay-area, family-hotel and activity pages can jointly answer two explicit one-day/four-day pool-versus-central-base cases without an avoidable detour, contradiction or unsupported certainty.

Boundaries:

- Research/state only; do not edit `site/**`, any Las Vegas page or record, generators, tests, URLs, indexability, sitemap, external accounts, posts, outreach, or automation.
- Use normal links or controls at 1280 by 900, 390 by 844 and 320 by 800; treat the result as proxy-reviewed interface evidence, never user testing, behavior, satisfaction, rank or CTR evidence.
- Score six outputs: usable blocks; pool role; base type; true occupancy/room setup; current heat/transport/parking/access/complete-total checks; and one removal decision.
- Fresh August 28 GSC is orientation only because the public snapshot contains no aligned query cohort. Conclude `PRESERVE` or retain at most one bounded unselected future defect hypothesis.

Expected artifact:

- `docs/research/las-vegas-cross-page-base-day-shape-task-review-2026-08-29.md`

Current result:

- The joined task is `PARTIAL`. Case A completes all six outputs; Case B requires an extrapolated four-day block count and an inferred one-base-versus-South-Strip-pool consequence.
- The exact mobile runs have zero horizontal overflow and coherent page ownership. The itinerary-to-base and activity-to-itinerary handoffs are deep, while the hotel-to-activity transition uses global destination navigation because no contextual link exists.
- Preserve all four pages and URLs. Retain one bounded, unselected future hypothesis to place the base consequence and current stay/hotel handoff beside the existing itinerary pool-led pivot. Add no page, hotel, attraction, or generic layer.
- Gauss cycle two closed both P2s covering transition count and stale current-state mirrors, returned `PASS` with no P0-P3, and independently confirmed the task scores, mobile measurements, preserve decision, trust boundaries, exact scope, and native QA.

### SRR-042: Las Vegas Current Parent Base And Day-Shape Review

Status: completed and review-clean as `FT-RES-021`; Meitner cycle-two `PASS` with no P0-P3

Selected: 2026-08-28 by the morning independent Family Tripwise pilot

Test whether four current Las Vegas family questions primarily need more attraction inventory or a joined decision across trip length, fixed anchors, pool value, hotel/base location, honest room occupancy, heat, transport, and budget.

Boundaries:

- Research/state only; do not edit `site/**`, any Las Vegas page or record, generators, tests, URLs, indexability, sitemap, external accounts, posts, outreach, or automation.
- Retain only source date/URL, paraphrased decision context, recurring constraints, and answer work. Retain no usernames, copied thread text, or personal data; do not treat anecdotes as demand.
- Use the fresh August 27 GSC snapshot only as orientation and a measurement boundary; it contains no aligned query cohort, and the all-ages page has no post-August-3 crawl.
- Map the shared decision to existing cluster roles and record `PRESERVE` or one bounded future task hypothesis without selecting an implementation.

Review-clean result:

- `PRESERVE` the four existing page roles and current URL set. The sample asks for a joined base-and-day shape, not a longer attraction list.
- Current pages already own the component decisions: activities handles one anchor/pool/cost; stay areas handles base/first-two-days/complete-stay/reset; hotels handles named property shapes, room setup, occupancy and totals; itinerary handles usable blocks, pivots and stop rules.
- Record one unselected future hypothesis: test two cross-page cases, one short destination-pool-versus-central-base visit and one four-day fixed-anchor visit with a separate pool block. Add no hotel, attraction, page or generic layer from this evidence.
- Artifact: `docs/research/las-vegas-current-parent-base-day-shape-review-2026-08-28.md`.
- Meitner cycle one found three P2s covering reproducible discovery, neutral source labels, and stale ledger dates. Cycle two verified every correction and returned `PASS` with no P0-P3.

### SRR-041: San Diego Lodging Cross-Page Task Review

Status: completed and review-clean as `FT-RES-020`; Pascal cycle-two `PASS` with no P0-P3

Selected: 2026-08-27 by the afternoon independent Family Tripwise pilot

Test whether a family can start on the five-area San Diego guide, choose a broad base, reach the 12-hotel shortlist, use the released one-base-versus-short-LEGOLAND-split rule, reduce the first property comparison, and recover date-specific traffic and total checks without conflicting guidance or an avoidable handoff detour.

Boundaries:

- Research/state only; do not edit `site/**`, either lodging page, generators, tests, URLs, indexability, sitemap, hotel/area records, external accounts, outreach, or automation.
- Treat desktop/mobile walkthroughs as `proxy-reviewed` interface evidence, never user testing, behavior, satisfaction, ranking, or CTR evidence.
- Use the recent reused August 26 GSC snapshot only as a pre-`FT-IMP-024` measurement boundary; it contains no aligned query cohort.
- Record `PRESERVE` or one bounded future defect hypothesis without selecting an implementation.

Review-clean result:

- The task is `PARTIAL`. Page ownership and guidance are coherent, and the hotel page completes the new stay-shape decision once reached.
- On the area page, the first hotel link precedes the five-area quick choice and matrix; the clearer dedicated hotel handoff follows the matrix and four booking checks much later.
- Record one unselected future hypothesis: consolidate the duplicated hotel handoff and place the existing named-hotel transition immediately after the area matrix. No page change is included.
- Artifact: `docs/research/san-diego-lodging-cross-page-task-review-2026-08-27.md`.
- Review: Pascal cycle one found three P2s covering one misattributed GSC row, one proxy-language overreach, and one stale roadmap state. Cycle two verified all three corrections and returned `PASS` with no P0-P3.

### SRR-040: Task-Based Persona Usefulness Review Pilot

Status: completed and review-clean as `FT-RES-017`; Pasteur cycle-two `PASS` with no P0-P3; one bounded unselected implementation candidate promoted

Selected: 2026-08-22 by direct manual user instruction

Create a reusable method for checking whether an existing Family Tripwise page helps evidence-grounded family scenarios complete a real planning task. Pilot the method on `https://familytripwise.com/where-to-stay/san-diego-family-hotels.html` and clearly distinguish a structured proxy review from observation of actual users.

Boundaries:

- Research and state only; do not edit `site/**`, generators, tests, URLs, canonicals, indexability, the sitemap, hotel set, map, or active August 13 performance boundary.
- Derive scenarios from current search intent, recurring parent questions, current ranking pages, the existing San Diego persona hypotheses, and the page's maintained evidence. Do not invent demographic truth or claim that an AI persona behaved like a person.
- Check task answerability, comparison consistency, evidence traceability, uncertainty, scan and repetition burden, and next-step clarity on desktop and mobile.
- Classify results as `proxy-reviewed`, `behavior-supported`, or `user-validated`; this action cannot earn the final label.
- Promote at most one bounded existing-page improvement or record `PRESERVE` / `OBSERVE`.

Expected artifacts:

- `docs/plan/persona-usefulness-review-protocol.md`
- `docs/research/san-diego-family-hotels-persona-task-review-2026-08-22.md`
- `backlog/product-learning-ledger.md`

Result:

- The reusable protocol treats persona reviews as evidence-grounded task walkthroughs, not simulated respondents, and reserves `user-validated` for actual participant or first-party behavioral evidence.
- Five San Diego hotel-selection scenarios can reach defensible decisions and preserve evidence/uncertainty boundaries.
- The first useful mobile decision begins about 1.46 viewports down and the page repeats two trip-style layers before the comparison. Pasteur independently reproduced this structural finding.
- Promoted only `IMP-044`, an unselected candidate to move and consolidate the existing trip-style start. No `site/**`, public page, URL, indexability, performance boundary, external account or automation changed.

## Active Evidence Freshness Research

### SRR-039: San Diego Family-Hotel Source And Price Freshness Audit

Status: completed and review-clean as `FT-RES-016`; Bacon cycle-three `PASS`; one bounded maintenance handoff promoted

Selected: 2026-08-17 by the independent Family Tripwise Master pilot

Audit all 12 hotels currently visible on `https://familytripwise.com/where-to-stay/san-diego-family-hotels.html` because the original eight records checked July 18 reach their explicit August 17 official-fact boundary and every live rough-price observation is older than the 14-day hotel research rule. The four July 21 expansion records remain inside their 30-day official-fact boundary, and the July 21 review signals remain inside their separate 60-day boundary.

Boundaries:

- Research only; do not edit `site/**`, generators, tests, URLs, canonicals, indexability, the sitemap, or the active August 13 crawl observation window.
- Check current official room, pool/water, breakfast/kitchen, fee/parking, and renovation/closure facts that the page exposes for each hotel.
- Refresh only public approximate nightly-price evidence; do not complete a booking, collect personal data, or convert a dynamic example into a guaranteed quote.
- Record direct source, checked date, evidence class, confidence, conflicts, unknowns, and a claim-level confirmed/changed/unsupported decision.
- Recommend `PRESERVE` or promote exactly one bounded future maintenance action. No indexing request, analytics, outreach, external post, account mutation, new destination, or recurring automation.

Expected artifact:

- `docs/research/san-diego-family-hotel-freshness-audit-2026-08-17.md`

Result:

- All 12 live hotel records received a direct official-source pass. The core shortlist and family decision facts remain supported.
- Public price observations remain dynamic, occupancy-mismatched, and mostly late-July rather than reproducible same-day family totals. They can orient but cannot renew the live bands under the 14-day rule.
- La Jolla Shores now officially describes a refreshed heated pool and children's wading pool. Its own pages conflict between $45 and $55 parking, so the conflict must remain visible rather than being silently resolved.
- Promoted exactly one later existing-page maintenance action: `FT-MAINT-003` / `IMP-043`. No `site/**`, page, URL, indexability, map, deployment, indexing, or external account changed in this research transaction.

## Current Ranking Opportunity Research

### SRR-038: San Diego Existing-Page Backlink Gap And Authority Plan

Status: complete and review-clean as `FT-AUTH-004`; Schrodinger cycle-three `PASS`, no P0-P3

Selected: 2026-07-31 by direct manual user instruction

Build a source-linked authority decision pack for the six current canonical San Diego pages. Use current authenticated Semrush evidence where available, inspect the public pages behind meaningful competitor backlinks, separate replicable editorial patterns from spam and authority we cannot honestly copy, and promote exactly one bounded enhancement on an existing URL.

Boundaries:

- Do not create a new page, edit `site/**`, alter the sitemap or indexability, deploy, or request indexing.
- Do not send outreach, submit directories, buy or exchange links, post promotional UGC, collect private contact data, or mutate an external account beyond authenticated read-only research.
- Do not treat Semrush Authority Score, backlinks, or referring-domain counts as Google metrics or ranking guarantees.
- Do not count automated SEO spam, owned properties, generic directories, scraper copies, or irrelevant links as earned authority.
- Record public source URL, linking page/domain, linked competitor/URL where visible, link context, likely follow state when observable, editorial relevance, replicability, proposed Family Tripwise target, citation reason, freshness, and confidence.
- Promote exactly one existing-page enhancement and a separately gated outreach plan, or record that no credible action is ready.

Expected artifact:

- `docs/research/san-diego-existing-page-authority-gap-2026-07-31.md`

Review-clean result:

- Semrush detected zero legitimate Family Tripwise referring domains as of 2026-07-31 among its current 11-domain sample and 13 nofollow links; every sampled source is low-authority SEO spam, while links outside Semrush remain `UNKNOWN`.
- Competitor raw totals substantially overstate clean editorial authority. La Jolla Mom's exact San Diego hotel page has 29 referring domains, 18 at AS 0-10; The Family Voyage's exact San Diego guide has only six referring domains and ten follow links.
- The durable competitor advantage is a smaller layer of real editorial, peer, travel, local, media, industry, and source-quote relationships on top of mature topical domains.
- Selected the existing all-ages San Diego page as the first authority asset because a source-dated attraction-logistics index has a clearer citation use than another commercial hotel-list enhancement.
- Promoted only `FT-AUTH-005` / `IMP-042`, ready pending explicit user approval. It adds no new canonical/indexable HTML page and includes no outreach.
- Prepared a 12-prospect public-page set and a separately gated first wave of at most six prospects; no private contact data was collected and no contact occurred.

### SRR-035: Existing-Page Protected GSC Ranking Opportunity Map

Status: complete and review-clean as `FT-RES-012`

Selected: 2026-07-29

Use the current public-safe GSC page and URL Inspection evidence plus a protected page-query export to classify every canonical/indexable page as indexing-first, insufficient-evidence, query-refinement, CTR/snippet, or authority-led. Score opportunities without exposing complete query rows, promote exactly one bounded existing-page follow-on if evidence supports it, and keep the Orlando publication separately user-gated.

Boundaries:

- Research only; do not edit `site/**`, publish a page, alter the sitemap, request indexing, deploy, or mutate a search account.
- Plaintext page-query rows remain outside the public repository. Commit only aggregated, thresholded, public-safe conclusions.
- Page-level average position is not a query rank. Do not treat tiny impression samples or broad averages as stable opportunities.
- Do not rewrite a page merely because it is old, newly crawled, or below an arbitrary position threshold.
- Distinguish indexing/discovery, query relevance, snippet/CTR, authority, and product-usefulness problems.
- Promote exactly one existing-page action or record that no page is yet eligible.

Result:

- Classified all 28 canonical/indexable pages from fresh page/inspection evidence, protected page-query aggregates, crawl-versus-release state, current role, internal links, and authority evidence.
- The protected export contains 940 impressions: no exported page-query row has a period-average position of 20 or better; 74 impressions are attached to rows averaging positions 21-40 and 866 to rows averaging worse than 40.
- Eight pages are not indexed, and almost every page with query evidence has not been crawled since its latest reviewed release.
- Found transitional hotel/area and activity/itinerary role collisions that should be rechecked after sibling indexing rather than edited immediately.
- Found no CTR candidate and no clean existing-page content-rewrite winner.
- Identified Las Vegas all-ages activities as the strongest aligned page to watch, but not to rewrite before a current crawl.
- Promoted only `FT-AUTH-002` / `SRR-036` to complete the real-record and parent-test evidence for the existing San Diego Reset Atlas; publication and outreach remain gated.
- Artifact: `docs/research/existing-page-ranking-opportunity-map-2026-07-29.md`.
- Review: Mendel cycle one returned `FAIL` for three P2 precision/state findings. After correction, cycle two returned `PASS` with no P0-P3 findings.

### SRR-036: San Diego Family Reset Atlas Real-Record And Parent-Test Evidence

Status: complete and review-clean as `FT-AUTH-002`

Selected: 2026-07-29 by direct manual user instruction

Use the completed `FT-AUTH-001` plan, `FT-RES-003` source/license audit, and `FT-DEV-003` prototype to build a public-safe real-record candidate for the existing San Diego all-ages hub.

Boundaries:

- Preserve the exact 13-anchor scope and build at least 30 useful source-backed candidate records.
- Keep every unsupported route, stroller, sensory, quiet, safety, caregiver-facility, and family-suitability conclusion `UNKNOWN`.
- Prepare three representative planning tasks for independent completion by two parents, but do not simulate the required human evidence.
- Keep the candidate outside `site/**`; do not publish, deploy, request indexing, send outreach, contact a prospect, mutate an external account, or create recurring automation.
- A later publication decision requires complete evidence, human gates, native QA, independent review, and separately authorized release scope.

Candidate result:

- Built 39 source-backed internal records, exactly 3 for each of the 13 audited anchors, from 19 current official first-party or government URLs.
- Preserved source owner, URL, freshness, evidence class, confidence, human-review state, operational caveat, and reuse state on every record.
- Kept all 39 coordinate pairs and all 273 trust-sensitive field states `UNKNOWN`; all records are `internal-research-only`.
- Prepared three representative tasks for separate completion by Parent A and Parent B. No agent result was created or counted as human evidence.
- Kept the product `noindex` and outside `site/**`; no public dataset, site change, deployment, indexing request, outreach, prospect contact, external-account mutation, or recurring automation occurred.
- Artifacts: `docs/research/san-diego-reset-atlas-publication-evidence.md`, refreshed `docs/research/san-diego-reset-atlas-source-license-audit.md`, and `src/prototypes/san-diego-family-reset-atlas/`.
- Review cycle one: Wegener returned `FAIL` with four P2 findings covering one indirect Fleet source, self-attestable human-review and reuse states, unenforced coordinate provenance, and stale cycle text. The correction adds the exact Fleet source, durable field-specific human-review and reuse evidence contracts, coordinate bounds/provenance requirements, adversarial tests, and reconciled state.
- Review cycle two: Wegener returned `FAIL` with two P2 findings and one P3 covering unverified evidence-reference strings, impossible normalized dates, and incomplete singular labels. The correction uses an intentionally empty approved-evidence registry, exact repository-heading references, agent/simulation and placeholder rejection, exact calendar validation, and complete singular labels.
- Final correction QA: 137/137 native tests and 10/10 Atlas tests pass; content freshness and operator-state QA pass; local and production SEO QA report 0 errors and 0 warnings; 19/19 sources return HTTP 200; browser, privacy, duplicate-key, exact-scope, no-production-path, and whitespace checks pass.
- Review cycle three: Wegener returned `PASS` with no P0-P3 findings after independently rejecting all prior bypasses and confirming the complete 15-path scope.
- Final state: complete and review-clean. Publication remains blocked by real parent testing, trust-sensitive human review, structured-reuse clearance, and a separately authorized release action.

## Current Next-City Research

### SRR-033: Select And Research The Next Family Destination Cluster

Status: complete and review-clean as `FT-RES-011`

Selected: 2026-07-28

Compare the strongest remaining destination candidates using fresh existing-site GSC context, current logged-in Semrush demand/KD/intent evidence, observed SERP URL and domain overlap, representative ranking-page usefulness, family-planning constraints, product fit, and research cost. Select exactly one city, define its non-cannibalizing query clusters and research-hypothesis personas, and promote exactly one bounded next action.

Boundaries:

- Research only; do not edit `site/**`, publish a city page, alter the sitemap, deploy, or request indexing.
- GSC cannot measure demand for an unpublished city; use it only as context for how the current domain is being discovered.
- Do not sum overlapping keyword variants or treat keyword volume as unique traffic.
- Do not infer SERP overlap from semantic similarity; record observed URLs/domains and mark incomplete intersections `UNKNOWN`.
- Community anecdotes are qualitative constraints, not demand or verified family experience.
- A promoted new-destination publication remains user-gated under `AGENTS.md`.

Result:

- Selected Orlando over Miami, Dallas, Nashville, and Washington, DC from current whole-cluster evidence.
- Recorded seven retained exact URL overlaps across the two broad Orlando activity samples.
- Recorded high hotel/best-hotel and hotel/resort overlap; one future hotel comparison should absorb resort and major amenity routes initially.
- Preserved free/budget as a credible later standalone page because it has 720/KD 17 and only three retained exact overlaps against either broad activity sample.
- Kept toddler and teen as visible hub routes for now despite distinct result sets because exact demand is 70 and 40.
- Derived six Orlando persona hypotheses and a restrained page architecture.
- Promoted only `FT-PUB-006` / `IMP-041` / `SRR-034`, pending explicit new-destination approval.
- Artifact: `docs/research/next-city-cluster-selection-2026-07-28.md`.

### SRR-034: Orlando All-Ages Candidate, Persona, Source, And Page Review

Status: ready only after user approval for `FT-PUB-006`

Roadmap ID: `FT-PUB-006`

Before publication, refresh the broad, free/budget, toddler, teen/mixed-age, park-choice, non-park, indoor/weather, and itinerary result sets; review at least 25 candidate day or attraction roles; retain only options with distinct family decision value; and review every planned section against `ORL-P1` through `ORL-P6`.

Boundaries:

- Publish exactly one Orlando URL and add one sitemap entry.
- Do not publish hotel, stay, itinerary, free, toddler, teen, or Disney-specific sibling URLs.
- Give useful visible defaults before filters; do not create indexable filter states.
- Use current direct official sources for every material park, attraction, access, ticket, height, weather, and operating fact.
- Do not imply firsthand experience or unsupported route, stroller/accessibility, safety, water, wait-time, weather, price, or universal family-fit certainty.
- No indexing request, affiliate CTA, external-account mutation, outreach, booking action, or recurring automation.

## Latest Completed San Antonio Cluster Review

### SRR-027: San Antonio SERP-Overlap Cluster, Persona, And Page Decision Pack

Status: complete and review-clean

Selected: 2026-07-26

Roadmap ID: `FT-RES-010`

Build a complete San Antonio family query universe; collect current keyword evidence and observed SERP overlap; inspect representative ranking pages and qualitative parent/community constraints; derive usable persona hypotheses; audit every canonical/indexable San Antonio page and every visible section; define one non-cannibalizing page architecture; and promote exactly one bounded next implementation if evidence supports it.

Boundaries:

- Research only; do not edit `site/**`, publish, deploy, or request indexing.
- Do not treat anecdotes as demand or desk research as firsthand experience.
- Do not sum overlapping keyword variants into unique traffic.
- Do not create a hotel, toddler, weather, budget, or other page merely because a modifier exists.
- No external-account mutation, outreach, affiliate CTA, another city action, or recurring automation.

Result:

- Built a complete San Antonio family query universe from current logged-in Semrush evidence without summing overlapping variants.
- Recorded high-confidence observed overlap for the two core all-ages query sets and the two core family-hotel query sets; marked incomplete free, toddler, itinerary, and stay intersections `UNKNOWN` rather than inventing counts.
- Reviewed representative official, local, firsthand-family, commercial, and community pages while keeping local/firsthand authority separate from usefulness opportunities.
- Derived five research-hypothesis personas: `SA-P1` first-time icon family, `SA-P2` heat-and-reset younger-child family, `SA-P3` theme-park/resort family, `SA-P4` teen/mixed-age family, and `SA-P5` budget/local-style family.
- Audited every visible section of all four canonical/indexable San Antonio pages.
- Kept all four existing page roles, approved one future named-property hotel comparison after an evidence pack, and rejected separate toddler, indoor, resort, pool, duration, and current-weekend URLs for this pass.
- Promoted `FT-IMP-018` / `IMP-036` as the only next implementation: improve the existing all-ages things-to-do hub.
- Artifact: `docs/research/san-antonio-family-cluster-decision-pack.md`.
- Status matrix: `status/san-antonio-pages.md`.
- Full repository tests pass 105/105; operator-state QA and local SEO QA pass with 0 errors and 0 warnings; duplicate-key-safe roadmap JSON, focused SERP/persona/action/source/scope, 35-URL reachability, privacy, exact-path, no-site, and whitespace checks pass.
- Independent reviewer Goodall (`019f9ec6-b438-7d33-9c60-658a5706ac29`) returned `PASS` in cycle 2 with no P0-P3 findings after exact-versus-domain SERP intersections, persona source traceability, direct ranking/community links, and two audit counts were corrected.

## Completed San Antonio Page Review

### SRR-028: San Antonio All-Ages Candidate, Persona, Source, And Every-Section Review

Status: complete, QA-green, and review-clean inside `FT-IMP-018`

Selected: 2026-07-26

Roadmap ID: `FT-IMP-018`

Before implementation, inspect at least 18 candidate activity roles, current direct official sources, representative ranking pages, qualitative parent constraints, all five San Antonio persona hypotheses, and every planned section of the existing all-ages page.

Required coverage:

- Keep roughly 10-14 choices only when each earns a distinct family decision role; do not use a list-length quota.
- Trace `SA-P1` through `SA-P5` to conditional starts, comparison fields, filters, high-friction notes, stop rules, and cluster routes.
- Provide real younger-child, heat/indoor, free/budget, teen/mixed-age, and theme-park routing.
- Replace repeated cards, quick picks, detail fields, and mini-itineraries with one calm scan-first decision flow.
- Use current direct official sources for every material retained fact and leave unresolved route, stroller, accessibility, ticket, weather, price, age-fit, and family-fit claims unknown or explicitly verify-current.
- Preserve the existing URL, canonical, indexability, and sitemap entry; do not edit sibling content or publish another URL.

Result:

- Artifact: `docs/research/san-antonio-activity-expansion-review.md`.
- Reviewed 23 candidates against distinct decision role, `SA-P1` through `SA-P5`, current primary evidence, unresolved checks, and cannibalization risk.
- Retained 13 choices and deferred 10; Hopscotch and art-led options route to the later teen review, while Pearl remains a pairing/base rather than a primary attraction.
- Audited every current section and replaced repetition with one calm scan-first architecture.
- Recorded claim boundaries, source freshness, acceptance, measurement, and the exact one-page release boundary.
- Focused tests pass 5/5 and the full repository suite passes 110/110; operator-state and local SEO QA pass; focused source, persona, candidate, section, scope, privacy, JSON, responsive, and whitespace checks pass.
- Pasteur returned final `PASS` in cycle two with no P0-P3 findings.

## Latest Completed NYC Itinerary Review

### SRR-026: New York City Family-Itinerary SERP, Persona, Source, And Every-Section Review

Status: done and review-clean inside `FT-IMP-017`

Selected: 2026-07-26

Roadmap ID: `FT-IMP-017`

Before implementation, inspect current itinerary SERPs, representative ranking pages, qualitative family questions, NYC-P1 through NYC-P5, current official attraction/transit sources, and every visible section of the existing page.

Required coverage:

- Confirm one-, two-, and three-day variants belong on the existing itinerary URL rather than separate pages.
- Record what representative ranking pages answer well, weakly, or not at all, separating firsthand/local authority from usefulness opportunities.
- Apply all five persona hypotheses to route shape, resets, weather, budget, age mix, stay base, and exact-current-check needs.
- Review every current hero, trust, media, starter, quick-pick, comparison, pacing, cluster-link, source, and schema section for keep/compress/replace/remove.
- Define one calm itinerary architecture, acceptance/measurement, source freshness, claim and privacy boundaries, and independent review.

Result:

- Refreshed current itinerary SERPs and representative family, local-parent, firsthand, commercial, generated, and community pages.
- Confirmed one-, two-, three-, and longer-day variants belong to one sequencing page; numeric URL overlap remains `UNKNOWN` because complete comparable top-10 sets were not retained.
- Applied NYC-P1 through NYC-P5 to geographic route shape, resets, mixed ages, sensory/weather/budget needs, and lodging-led decisions.
- Audited every visible section and recorded keep/compress/replace/remove decisions, source freshness, claim boundaries, architecture, acceptance, and measurement.
- Artifact: `docs/research/new-york-city-family-itinerary-page-review.md`.
- Focused tests pass 4/4 and full repository tests pass 105/105; operator-state, local SEO, target-only generation, responsive, source, privacy, scope, roadmap JSON, and whitespace checks pass.
- Lagrange (`019f9ea5-2520-7540-91c7-ce5a5ce30360`) returned `PASS_WITH_P3` in cycle 1 with no P0-P2 findings. One non-blocking P3 preserves the representative-versus-complete SERP evidence limitation.

## Latest Completed NYC Review

### SRR-025: New York City Stay-Area SERP, Persona, Source, And Every-Section Review

Status: done and review-clean inside `FT-IMP-016`

Selected: 2026-07-26

Roadmap ID: `FT-IMP-016`

Before implementation, inspect current area-intent SERPs, representative ranking pages, qualitative family questions, NYC-P1/P2/P5, current official area/transit sources, and every visible section of the existing page.

Required coverage:

- Confirm the stay-area page remains distinct from the named-property hotel page using observed ranking-page and intent evidence.
- Record what representative ranking pages answer well, weakly, or not at all, separating local/firsthand authority from usefulness opportunities.
- Review every current recommendation, comparison, detail, booking-check, source, FAQ, and cluster-link section for keep/compress/replace/remove.
- Ground retained area roles in route shape, midday reset, child pace, transit/access friction, cost/value, and exact-current-check needs without unsupported universal claims.
- Define one calm five-area architecture, acceptance/measurement, source freshness, privacy boundaries, and independent review.

Result:

- Refreshed three area-intent SERPs and representative ranking pages, preserving local/firsthand authority as a competitor advantage while identifying comparison, sourcing, and choice-friction opportunities.
- Revalidated the area-versus-hotel boundary and the five retained bases.
- Applied NYC-P1 through NYC-P5 to route shape, reset, access, cost/value, and named-property handoff decisions.
- Audited every visible section and recorded keep/compress/replace/remove decisions, source freshness, claim boundaries, architecture, acceptance, measurement, and privacy.
- Artifact: `docs/research/new-york-city-stay-area-review.md`.
- Full repository tests pass 101/101; focused, operator-state, local SEO, responsive, source, privacy, scope, roadmap JSON, and whitespace checks pass.
- Independent reviewer Maxwell (`019f9e13-9dbc-7440-a637-dfa52b6a719f`) returned `PASS` in cycle 2 with no P0-P3 findings.

## Earlier NYC Review

### SRR-024: New York City Teen/Tween Candidate And Page Review

Status: done, released, and production-verified inside `FT-IMP-015`

Selected: 2026-07-26

Roadmap ID: `FT-IMP-015`

Before publication, inspect the distinct teen/tween SERP, representative ranking pages, qualitative family discussions, a broad current candidate set, direct official sources, NYC-P4, mixed-age constraints, and the intended page decision flow.

Required coverage:

- Query and SERP boundary validation against the existing all-ages page.
- Candidate keep/defer decisions with a distinct teen decision role for every retained activity.
- Current official age, height, ticket, access, weather, content, minor/supervision, and operating evidence where material; unresolved fields remain unknown.
- Ranking-page usefulness analysis separating firsthand/local advantages from structure, freshness, comparison, and decision-support opportunities.
- One calm scan-first comparison, bounded high-friction notes, route shapes, mixed-age handling, cluster links, visible/schema-aligned FAQs, acceptance/measurement, privacy, and independent review.

Result:

- Confirmed a distinct teen result family using the existing exact-query/overlap record and fresh July 26 public SERP checks.
- Separated firsthand/local/current-event strengths from comparison, source freshness, choice, and route-support opportunities.
- Reviewed 20 candidate roles, retained 10, and recorded keep/defer rationale, direct primary evidence, unresolved checks, NYC-P4 traceability, claim boundaries, page architecture, acceptance, and measurement.
- Artifact: `docs/research/new-york-city-teen-activity-review.md`.
- Research and implementation are QA-green and review-clean. Curie (`019f9dfa-f5ce-72f3-bad3-63e0fbef84d7`) returned `PASS_WITH_P3` in cycle 2 with no P0-P2 findings.

## Active NYC Hotel Review

### SRR-023: New York City Family-Hotel Evidence Pack

Status: done and review-clean inside `FT-PUB-004`

Selected: 2026-07-25

Roadmap ID: `FT-PUB-004`

Before publication, inspect an 18-25 property candidate pool, representative current hotel-list ranking pages, direct official property sources, public price examples, bounded recent online-review samples, relevant family discussions, NYC-P1/P2/P4/P5, and the intended page decision flow.

Required coverage:

- Candidate keep/defer decisions with a distinct family trip role for every retained property.
- Official room/occupancy, two-bed/suite, kitchen/breakfast, pool, crib/connecting, location, and current operating evidence where found; unresolved fields remain unknown.
- Approximate total nightly planning ranges with a dated method and clear exclusions; no quote or checkout claim.
- Review observation ledger with exact inspected sample size/date span/source-to-theme mapping, family-context disclosure, conflicts, and no copied prose or reviewer identifiers.
- Competitor usefulness analysis separating authority/firsthand advantages from comparison, freshness, and decision-support opportunities.
- One calm comparison architecture, direct Google Maps links, three visible/schema-aligned FAQs, acceptance/measurement, privacy, and independent review.

Result:

- Reviewed 22 candidate properties, retained 12, and documented the role and defer reason for every candidate.
- Recorded current official property facts, broad July 25 total-night planning ranges, bounded online-review observations, conflicts or thin-sample notes, freshness, decisive checks, and unresolved unknowns.
- Separated source-backed room function from requests and guarantees, including the atypical Embassy Suites room layout and occupancy limits at Four Seasons.
- Artifact: `docs/research/new-york-city-family-hotel-evidence-pack.md`.
- Research and implementation are complete and review-clean. Independent reviewer Kepler (`019f9c21-7769-7561-bb6f-170bfc41ab35`) returned `PASS_WITH_P3` in cycle 2 with no P0-P2 findings after the Embassy crib-source and family-context disclosure findings were corrected.

## Latest Completed NYC Cluster Research

### SRR-021: New York City SERP-Overlap Cluster, Persona, And Page Decision Pack

Status: done and review-clean inside `FT-RES-009`

Selected: 2026-07-24

Roadmap ID: `FT-RES-009`

Build the current NYC visitor-family query universe, use observed ranking-page/domain overlap to decide page boundaries, inspect representative ranking pages and qualitative parent discussions, derive evidence-grounded persona hypotheses, and audit every visible section of all three current NYC pages.

Required coverage:

- Fresh public-safe GSC classification and current logged-in Semrush US volume/KD evidence.
- Query-level SERP observations for broad activities, teens, toddlers, free/budget, areas, hotels, and itinerary.
- Explicit hotel-versus-area and teen-versus-all-ages boundaries.
- Every-section keep/compress/replace/remove instructions for the existing activity, stay, and itinerary pages.
- Exactly one promoted implementation, acceptance criteria, measurement, source register, privacy check, and deferred weekend/current-content boundary.

Result:

- Defined nine overlap clusters and five persona hypotheses.
- Kept the three existing URLs, proposed one future named-property hotel page and one future teen/tween page subject to review, and rejected separate toddler, free, indoor, pool, suite, family-of-five, generic family-vacation, and static weekend URLs for this pass.
- Audited every visible section and identified severe repetition on the 2,538-word all-ages page, unsupported generic hotel verification on the stay page, and abstract duplication on the itinerary.
- Promoted `FT-IMP-014` / `IMP-031` for the existing all-ages page.
- Artifact: `docs/research/new-york-city-family-cluster-decision-pack.md`.
- Independent reviewer Einstein (`019f9574-fcbe-7810-a2e2-53c45e216171`) returned final `PASS` in cycle 3 with no P0-P3 findings after exact metric records, explicit SERP intersections, missing cluster page analyses, persona source traces, pending architecture labels, and one stay-area domain intersection were corrected.

### SRR-022: New York City All-Ages Candidate And Every-Section Review

Status: done and review-clean inside `FT-IMP-014`

Selected: 2026-07-24

Roadmap ID: `FT-IMP-014`

Before changing the existing page, inspect a wider current activity candidate set, current all-ages ranking pages, qualitative parent discussions, direct official attraction sources, NYC-P1 through NYC-P5, and every visible section of the current page.

Required coverage:

- Candidate keep/add/remove/defer decisions with a distinct decision role for every retained option.
- Current official facts and volatility checks for tickets, age/height rules, access, weather, operating status, and booking.
- Every-section keep/compress/replace/remove instructions that eliminate the repeated six-choice layers.
- One filterable comparison, strong younger-child/free/weather support, compact high-friction notes, useful sibling-page routes, and visible/schema-aligned FAQs.
- Target-only generation, idempotency, responsive scan behavior, source/privacy/scope checks, and independent review.

Result:

- Reviewed 18 candidates and retained 12 with distinct classic, younger-child, free/outdoor, indoor/weather, mixed-age, neighborhood, and high-friction decision roles.
- Applied NYC-P1 through NYC-P5 to the page, audited every prior visible section, and replaced repeated six-choice layers with one scan-first decision surface.
- Used direct official attraction sources for material ticket, age, access, stroller, weather, operating, and booking checks; kept editorial estimates and unresolved route-specific details explicitly non-guaranteed.
- Artifact: `docs/research/new-york-city-activity-expansion-review.md`.
- Full native tests pass 87/87; focused implementation, operator-state, SEO, responsive, source/privacy/scope, roadmap JSON, and whitespace checks pass locally. The independent review release gate passed.
- Independent reviewer Huygens returned final `PASS_WITH_P3` in cycle 3 with no P0-P2 findings after the media audit/performance and NYSCI teen-routing findings were corrected.

## Latest Completed Chicago Reviews

### SRR-020: Chicago Family-Itinerary Competitor And Every-Section Review

Status: done and review-clean inside `FT-IMP-013`

Selected: 2026-07-23

Roadmap ID: `FT-IMP-013`

Inspect current family-itinerary SERPs, representative ranking pages, qualitative family discussions, official route-anchor sources, all five Chicago persona hypotheses, and every visible section of the current page.

Required coverage:

- Exact ranking-page and community-discussion register with evidence class, date, use, and limitation.
- One-, two-, and three-day execution plans that do not duplicate activity selection or promise exact route performance.
- Pivots for younger-child/nap, teen, rain/winter, budget, and stay-base constraints.
- Explicit deletion and stop rules, all four Chicago cluster handoffs, current official checks, visible/schema-aligned FAQs, and claim boundaries.

Result:

- Recorded exact itinerary queries, representative ranking URLs, community discussion URLs, evidence classes, collection date, uses, and limitations.
- Applied CHI-P1 through CHI-P5 and separated activity, teen, area, hotel, itinerary, and live-route jobs.
- Audited every visible section, removed repeated generated summaries, and implemented concrete one-, two-, and three-day route shapes with deletion rules.
- Preserved exact-route, transit, stroller, safety, weather, ticket, price, timing, firsthand, and universal-fit boundaries.
- Independent reviewer Boyle returned final `PASS` in cycle 2 with no P0-P3 findings.

### SRR-019: Chicago Teen Candidate And Every-Section Review

Status: done and review-clean inside `FT-IMP-012`

Selected: 2026-07-23

Roadmap ID: `FT-IMP-012`

Inspect current teen SERPs, representative ranking pages, qualitative parent/teen discussions, a wider candidate set, official sources, and every visible section of the current page. Apply CHI-P4 directly and route mixed-age, lodging, and sequencing needs without duplicating sibling pages.

Required coverage:

- A distinct older-kid reason for every retained primary choice.
- Current official facts and volatility checks for tickets, age/height rules, weather, transit, events, and access.
- Candidate keep/add/remove/defer decisions and every-section keep/compress/replace/remove instructions.
- One complete comparison, compact high-friction notes, useful route shapes, current checks, visible/schema-aligned FAQs, and cluster routes.

Result:

- Recorded the exact queries, representative ranking URLs, community discussion URLs, evidence classes, collection date, uses, and limitations rather than leaving SERP or UGC conclusions as untraceable summaries.
- Applied CHI-P4 to an 8-choice set with an explicit older-kid reason for every option, while routing mixed-age activity, hotel, stay-area, and itinerary jobs to their proper pages.
- Audited every visible section, removed the repeated generated body, reduced verification repetition, and limited deeper notes to four genuinely high-friction choices.
- Added current direct official product support, including Flyover rider/sensory rules, and preserved all safety, independent-roaming, age-fit, route, price, weather, and firsthand trust boundaries.
- Independent reviewer Peirce returned final `PASS` in cycle 2 with no P0-P3 findings.

### SRR-018: Chicago Stay-Area Competitor And Section Review

Status: done and review-clean inside `FT-IMP-011`

Selected: 2026-07-23

Roadmap ID: `FT-IMP-011`

Audit every visible section of the Chicago stay page against the same-day SERP-overlap/persona decision pack, current official area and transit sources, scan cost, claim support, and the now-released hotel page. Record keep, compress, replace, remove, and route decisions before implementation.

Required coverage:

- CHI-P1, CHI-P2, CHI-P5, and explicit routing for CHI-P4.
- Area/base versus named-property search-job boundary.
- Current official source checks and unsupported-claim removal.
- One concise five-area comparison, three decisive checks, hotel handoff, cluster routes, and visible/schema-aligned FAQs.

Result:

- Audited every visible section and replaced repeated or unsupported area, hotel, stroller, quiet, value, and family-fit shorthand with one conditional five-area decision path.
- Applied CHI-P1, CHI-P2, CHI-P5, and CHI-P4 routing while keeping CHI-P3 on the activity/itinerary route.
- Recorded current Choose Chicago and CTA source boundaries, every-section decisions, claim treatment, acceptance criteria, and measurement in `docs/research/chicago-stay-area-page-review.md`.
- Independent reviewer Meitner returned final `PASS` in cycle 2 with no P0-P3 findings.

### SRR-017: Chicago Family-Hotel Evidence Pack

Status: done and review-clean inside `FT-PUB-003`

Selected: 2026-07-23

Roadmap ID: `FT-PUB-003`

Evaluate a wider current Chicago property pool and produce the durable official-fact, rough-total-price, sampled-family-review, contradiction, freshness, and unknown record required for one clean named-property comparison. The likely 10-12-property shape is a research hypothesis, not a quota.

Required coverage:

- Distinct trip-style utility rather than ordinal `best` claims.
- Official room/suite, pool, breakfast/kitchen, parking, location, and optional crib/rollaway/connecting/laundry facts where available.
- Rough total-night planning ranges from current public examples, labeled approximate and date-stamped.
- Bounded paraphrased recent family-review themes and conflicts, with small/thin sample labels.
- Current SERP and persona fit, deferred candidates, unknowns, source freshness, page architecture, acceptance criteria, and measurement plan.

Result:

- Evaluated 19 current candidates and retained 10 with distinct suite, kitchen, pool, younger-child, museum, Wrigley, or luxury utility; documented every selection, deferral, and unresolved check.
- Recorded 52 direct source URLs across official property facts, current public price examples, sampled review pages, competitors, and qualitative community context.
- Logged exact inspected review counts, visible date spans, family context where exposed, and source-to-theme mapping for all 10 properties while storing no raw reviews, reviewer identifiers, credentials, private booking details, or personal data.
- Reconciled the current Langham Kids Suite page with its stale contradictory overview and corrected Hilton Chicago's low-price evidence to the current tax-inclusive public result.
- Artifact: `docs/research/chicago-family-hotel-evidence-pack.md`.
- Independent reviewer Wegener returned final `PASS` on cycle 3 with no P0-P3 findings.

## Earlier Completed

### SRR-016: Chicago All-Ages Candidate And Every-Section Review

Status: done and review-clean inside `FT-IMP-010`

Selected: 2026-07-23

Roadmap ID: `FT-IMP-010`

Research a wider current Chicago activity candidate pool, inspect current ranking pages and official sources, apply CHI-P1 through CHI-P5, and record a keep/expand/compress/replace/remove decision for every visible section before changing the existing all-ages page. This is part of the implementation transaction, not a separate scheduled action.

Result:

- Audited every visible section and replaced repeated layers with a compact 12-choice decision flow.
- Recorded 18 candidates with keep/add/remove/defer decisions, explicit CHI-P1 through CHI-P5 coverage, competitor usefulness patterns, and a primary-source claim ledger.
- Preserved one all-ages canonical URL and the separate stay, hotel, itinerary, and teen jobs.
- Artifact: `docs/research/chicago-activity-expansion-review.md`.
- Independent reviewer Mendel returned final `PASS` on cycle 3 with no P0-P3 findings.

### SRR-015: Chicago SERP-Overlap Cluster, Persona, And Page Decision Pack

Status: done

Roadmap ID: `FT-RES-008`

Result:

- Built a query-level SERP observation matrix, nine overlap clusters, and five persona hypotheses from current GSC, logged-in Semrush Chrome, public SERPs, ranking pages, and qualitative parent discussions.
- Audited every visible section of all four current Chicago pages.
- Kept area/base intent on the existing stay page and approved one future named-property family-hotel page through the durable hotel evidence workflow.
- Promoted exactly one next implementation: `FT-IMP-010` / `IMP-025` for the existing all-ages activity hub.
- Artifact: `docs/research/chicago-family-cluster-decision-pack.md`.
- Independent reviewer Carson returned `PASS` on cycle 3 with no P0-P3 findings.

### SRR-014: Las Vegas Family-Itinerary Competitor And Section Review

Status: done inside implementation transaction

Completed: 2026-07-23

Roadmap ID: `FT-IMP-009`

Result:

- Compared current destination, firsthand, commercial, generated-itinerary, and qualitative community results without treating anecdotes as demand or verified universal facts.
- Applied LV-P1 through LV-P5 and recorded a keep/compress/replace/remove decision for every visible section.
- Separated activity selection, lodging selection, and itinerary sequencing, then defined three route lengths, five pivots, and four stop rules.
- Artifact: `docs/research/las-vegas-family-itinerary-page-review.md`.

### SRR-013: Las Vegas Stay-Area Competitor And Section Review

Status: done inside implementation transaction

Completed: 2026-07-22

Roadmap ID: `FT-IMP-008`

Result:

- Separated the area/base decision from named-property comparison after inspecting current area, hotel, OTA, and qualitative community results.
- Applied LV-P1/LV-P2/LV-P3/LV-P5 and recorded a keep/compress/replace/remove decision for every visible section.
- Reduced the proposed page to five base types, one comparison, three decisive checks, cluster routing, visible FAQ, and current source boundaries.
- Artifact: `docs/research/las-vegas-stay-area-page-review.md`.

### SRR-012: Las Vegas Teen Page Competitor And Section Review

Status: done inside implementation transaction

Completed: 2026-07-22

Roadmap ID: `FT-IMP-007`

Result:

- Audited every visible section against teen intent, LV-P4, mixed-age planning, repetition, and trust boundaries.
- Compared current teen-specific ranking pages and qualitative community discussions without treating anecdotes as demand or firsthand proof.
- Retained eight choices only where an older-kid reason and current official-check path were clear; removed the generic hotel-pool and unspecified-show primaries.
- Artifact: `docs/research/las-vegas-teen-page-review.md`.

### SRR-011: Las Vegas Family-Hotel Evidence Pack

Status: done

Completed: 2026-07-22

Roadmap ID: `FT-PUB-002`

Evaluate a wider candidate pool and produce the durable official-fact, rough-total-price, sampled-review, contradiction, freshness, and unknown record required for one clean Las Vegas family-hotel comparison. This research is part of the selected publication transaction, not a separate scheduled action.

Result:

- Selected ten properties with distinct pool, suite, kitchen, budget, older-kid, North Strip, and nature-base roles.
- Recorded official facts, broad total-night planning ranges, bounded recent-review themes/conflicts, deferred candidates, freshness, unknowns, page architecture, acceptance criteria, and measurement plan.
- Artifact: `docs/research/las-vegas-family-hotel-evidence-pack.md`.

## Superseded Launch-Era Tool Decision

### SRR-003: Decide First Tool-Like Feature

Status: superseded by released activity filters plus unpublished stay-decision, itinerary-pacing, and reset-atlas prototypes

Recommendation label: `test`

Compare:

- where-to-stay recommender
- activity age filters
- nap-friendly itinerary builder
- rainy-day planner

The later roadmap produced several bounded tests. Any public integration now requires a newly selected action with current evidence; this old comparison is not an active next step.

### SRR-030: San Antonio Stay-Area SERP, Persona, And Every-Section Review

Status: completed, released, and production-verified inside `FT-IMP-019`

Selected: 2026-07-26

Roadmap ID: `FT-IMP-019`

Refresh the stay-area SERP and representative ranking pages; apply `SA-P1` through `SA-P5`; audit every visible section and material claim; distinguish visitor-area intent from residential-neighborhood and named-hotel intent; and record current direct area, transport, accessibility-map, and family-anchor sources. This review supports one existing-page improvement and no new URL.

Result:

- Recorded current public-result types plus the prior Semrush stay/hotel boundary without inventing missing overlap counts.
- Compared official destination, broad family-guide, hotel-list, and community result types.
- Applied all five persona hypotheses, reviewed nine candidate bases, retained five, and audited every visible section.
- Produced a current 13-source register, calibrated claim boundaries, implementation acceptance criteria, and a measurement plan.
- Raman returned final `PASS` in cycle three with no P0-P3 findings after query-level traceability and stale queue-state corrections.

## Done

### SRR-007: Validate San Antonio Family-Hotel Demand And Review Workflow

Status: superseded and closed

Resolved by:

- `FT-RES-010` established current directional hotel demand and the area-versus-property boundary.
- `SRR-029` built the durable hotel evidence pack.
- `FT-PUB-005` released and production-verified the 12-property hotel comparison.

### SRR-029: San Antonio Family-Hotel Evidence Pack

Status: done, released, and production-verified

Selected: 2026-07-26

Roadmap ID: `FT-PUB-005`

Result:

- Reviewed 22 candidates, retained 12, and documented 10 deferrals.
- Recorded official room/amenity facts, rough total-price anchors, recent public review slices, explicit-family-context limits, property-specific conflicts, freshness, and decisive checks.
- Preserved hotel, resort, pool, lazy-river, suite, kitchen, breakfast, and location variants as one page role rather than manufacturing variant URLs.
- Averroes cycle two returned `PASS` with no P0-P3 after the exact price-source, durable-state, and deferred-candidate traceability findings were closed.
- Released at commit `4617ec82a87ae383eafdf9b01ecdf7f2d424063e` through successful Pages run `30226920951`; production verification passed.

### SRR-010: Select Next Pilot City And Define The Reusable City Workflow

Status: done

Completed: 2026-07-22

Roadmap ID: `FT-RES-007`

Result:

- Selected Las Vegas using fresh page-level GSC, a logged-in Semrush US comparison, query-level SERP overlap, representative ranking pages, and current-page leverage.
- Created the Las Vegas cluster/persona/page decision pack, reusable incremental city playbook, and full Las Vegas page status table.
- Promoted exactly one next implementation, `FT-IMP-006` / `IMP-020`, without editing `site/**`.
- Independent reviewer Mendel returned `PASS_WITH_P3` after all P2 findings were closed; native and focused QA passed.

### SRR-009: San Diego Cluster SERP-Overlap And Persona Decision Pack

Status: done

Completed: 2026-07-20

Roadmap ID: `FT-RES-006`

Recommendation label: `improve`

Research artifact:

- `docs/research/san-diego-cluster-research-decision-pack.md`

Scope:

- Built the complete San Diego family query universe from observed SERP URL/domain overlap, not keyword-volume lists or semantic intuition alone.
- Inspected representative ranking pages and separated authority/firsthand advantages Family Tripwise cannot copy from structural/usefulness opportunities it can honestly pursue.
- Derived a small research-hypothesis persona set from query modifiers, parent/community questions, and product constraints.
- Audited all canonical/indexable San Diego pages, legacy shims, and relevant unpublished prototypes against the cluster map and personas.
- Promoted exactly one bounded next implementation while respecting the protected San Diego stay-page observation window.

Current result:

- Promoted `FT-IMP-002` / `IMP-016`: upgrade the existing all-ages San Diego things-to-do page into a persona-led cluster router.
- Independent review returned `PASS` with no P0-P3 findings.
- No `site/**`, sitemap, robots, canonical, indexability, external account, indexing request, automation, or deployment changed in the research action.

### SRR-005: San Diego Hotel Page Feasibility Review

Status: done

Completed: 2026-07-18

Recommendation label: `research`

Research artifact:

- `docs/research/san-diego-family-hotel-evidence-pack.md`

Result:

- Built a source-backed internal record for the three candidate properties already named on the San Diego stay page.
- Separated official facts, booking checks, review signals, community signals, conflicts, and unknowns.
- Kept the pack unranked and internal. A standalone hotel page remains blocked pending broader hotel coverage, sourced approximate price bands, consistent review sampling, freshness checks, and human review for trust-sensitive conclusions.
- Added a follow-up page concept queue item: `FT-PLAN-001`, focused on a clean, low-clutter San Diego family-hotel page brief before any live page is built.
- No live page, sitemap, indexability, affiliate, indexing, outreach, or external-account change was made.

### SRR-002: Review Priority Pages For Index-Worthiness

Status: done

Completed: 2026-07-14

Recommendation label: `improve`

Research artifact:

- `docs/research/srr-002-priority-page-review.md`

Result:

- Kept all eight reviewed priority pages indexable based on current usefulness, metadata, internal links, source framing, and structured decision support.
- Classified the latest GSC snapshot as a one-day-old reused authenticated UI import, not fresh API evidence; it informed non-measurement research but did not support a fresh indexing or performance claim.
- Respected both active URL-scoped observation windows and did not edit any reviewed live page.
- Promoted exactly one bounded next implementation: `FT-IMP-001` / `IMP-015`, a trust and decision-support revision of the unprotected Las Vegas where-to-stay page.
- Did not request indexing, add a destination/page, send outreach, or mutate an external account.

Implementation-ready handoff created:

- `IMP-015: Reframe Las Vegas Stay Decision Support`

### SRR-008: Post-IMP-013 GSC-Signaled Page Review

Status: done

Completed: 2026-07-11

Recommendation labels: `monitor`, `improve`

Source inputs:

- `AGENTS.md`
- `strategy/current-strategy.md`
- `strategy/content-principles.md`
- `agents/seo-research-review-agent.md`
- `ops/current-cycle.md`
- `backlog/seo-research-review-backlog.md`
- `backlog/implementation-backlog.md`
- `docs/research/gsc-ui-review-2026-07-11.md`
- `progress.md`
- `decisions.md`
- current git status and diff
- changed `IMP-013` site pages and generation scripts

Result:

- Confirmed `IMP-013` improved the GSC-signaled pages without adding unsupported expansion.
- Local QA returned 0 errors and 0 warnings.
- Production QA returned 0 errors and 0 warnings.
- Home/About thin-page warnings are resolved.
- Sitemap remains unchanged at 22 canonical URLs and continues to exclude legacy San Diego shim pages.
- The three San Diego legacy shim pages remain outside the sitemap and include `noindex, follow` plus canonical links to active URLs.
- No new city cluster, standalone hotel page, or `/things-to-do/nyc-this-weekend-with-kids.html` page was created.
- `IMP-012` remains deferred.
- Changed pages include useful parent decision support, internal cluster links, metadata, `ItemList` / `FAQPage` schema where appropriate, source sections, and trust/methodology framing.
- Hotel, stroller, transit, area, and family-suitability guidance is generally framed as research-based planning support requiring verification rather than personally verified recommendation.
- Found one implementation-ready claim-language cleanup: several pages use safety-loaded words such as "safest" where the intended meaning is planning reliability or lowest-friction choice, not source-backed physical safety.

Implementation-ready handoff created:

- `IMP-014: Clean Safety-Loaded Planning Language`

### SRR-006: Validate NYC Local / Weekend Events Concept

Status: done

Completed: 2026-07-08

Recommendation label: `test`

Research artifact:

- `docs/research/srr-006-nyc-local-weekend-events.md`

Scope:

- Decide whether Family Tripwise should test a local/nearby-parent page or product module for NYC, Jersey City, Hoboken, and reachable family activities/weekend events.
- Include user context: the user lives in Jersey City and personally wants free/paid family activities around NYC, Jersey City, Hoboken, and nearby reachable areas.
- Treat Instagram accounts such as JCFamilies and The Hoboken Girl as competitor/source-discovery signals, not scrape targets or durable primary sources.

Result:

- Recommended a hybrid test: SEO landing page plus manually curated weekend planner module, with possible future newsletter path.
- Recommended first URL: `/things-to-do/nyc-this-weekend-with-kids.html`, framed as a planner for NYC, Jersey City, Hoboken, and nearby reachable areas.
- Recommended scope: greater NYC metro families, with Jersey City/Hoboken as first-class filters and logistics context rather than separate first-page silos.
- Keyword volume, CPC, difficulty, traffic, and revenue potential are `UNKNOWN`; no named keyword database was queried.
- Observed source ecosystem includes Mommy Poppins, Time Out Kids, Brooklyn Bridge Parents, NYC Parks, Hudson River Park, Brooklyn Bridge Park, NYPL/BPL, JCFamilies, Jersey City Cultural Affairs, Jersey City Free Public Library, Hoboken Girl/Local Girl, Hoboken Public Library, Hoboken Now, NJ Kids, NJ Mom, Macaroni KID, and Eventbrite.
- Anti Gravity CLI advisory review was run via `agy`; it agreed with a hybrid test, greater NYC/Jersey City/Hoboken scope, NYC weekend URL, and no automatic publishing.

Implementation handoff created, then deferred at user request on 2026-07-09:

- `IMP-012: Build Greater NYC Weekend Family Planner Pilot`

### SRR-004: Post-Implementation QA For Thin-Page Cleanup

Status: done

Completed: 2026-07-08

Recommendation label: `improve`

Scope:

- Confirm `IMP-001` through `IMP-005` and `IMP-009` align with strategy.
- Review whether upgraded pages now deserve indexing.
- Check remaining QA warnings for `site/about.html`, `site/index.html`, and four remaining itinerary pages.
- Review San Diego legacy shim handling.
- Review improved NYC tourist page against the GSC signal and Family Tripwise quality bar.
- Use Anti Gravity CLI as advisory second-opinion reviewer if available.

Result:

- Local QA and production QA both returned 0 errors and 6 warnings.
- `IMP-001` through `IMP-005` and `IMP-009` align with `AGENTS.md`, `strategy/current-strategy.md`, and `strategy/content-principles.md`.
- Upgraded pages deserve continued indexing:
  - `site/family-itinerary/san-diego-with-kids.html`;
  - `site/where-to-stay/chicago-with-kids.html`;
  - `site/where-to-stay/san-antonio-with-kids.html`;
  - four upgraded teen pages;
  - `site/things-to-do/new-york-city-with-kids.html`.
- Remaining itinerary warnings are real content-depth issues. Chicago, Las Vegas, New York City, and San Antonio itinerary pages should be improved using the San Diego itinerary pattern instead of noindexed.
- `site/about.html` and `site/index.html` should remain indexable as trust/navigation pages; monitor them and improve later if a lightweight trust/homepage task is needed.
- The three San Diego legacy shim pages are sufficiently handled for the current static GitHub Pages setup because they are outside the sitemap, include `noindex, follow`, and canonicalize to active URLs.
- The upgraded NYC tourist page adequately responds to the early GSC signal while keeping local/weekend concepts separate.
- Anti Gravity CLI advisory review was run via `agy`; it agreed that the next implementation-ready task should be upgrading the four remaining itinerary pages and did not recommend noindexing About/Home.

Implementation-ready handoff created:

- `IMP-010: Upgrade Remaining Family Itinerary Pages`

### SRR-001: Audit Current Strategy And Live Page Alignment

Status: done

Recommendation label: `test`

Scope:

- Confirm `strategy/current-strategy.md` preserves the existing docs.
- Review current sitemap and live page inventory.
- Identify pages that should be improved before any new pages are added.
- Confirm or revise near-term destination priority.
- Produce implementation-ready tasks for the Implementation Agent.

Read first:

- `strategy/current-strategy.md`
- `strategy/content-principles.md`
- `docs/PROJECT_BRIEF.md`
- `docs/plan/content-strategy.md`
- `site/sitemap.xml`
- current priority pages under `site/`

Expected output:

- updated backlog notes
- implementation-ready tasks in `backlog/implementation-backlog.md`
- current-cycle update

Result, 2026-07-07:

- Strategy is preserved accurately in `strategy/current-strategy.md`.
- Production sitemap matches local `site/sitemap.xml` and all 22 sitemap URLs returned HTTP 200.
- Local technical checks found 0 broken internal links and 0 JSON-LD parse errors.
- Current live pages partially align with strategy:
  - Stronger/index-worthy now: five core `things-to-do/*-with-kids.html` pages, San Diego toddler page, and the upgraded San Diego / Las Vegas / New York City where-to-stay pages.
  - Needs improvement before further expansion: all five itinerary pages, Chicago and San Antonio where-to-stay pages, and thin teen pages.
  - Legacy San Diego root-level HTML files are not in the sitemap and canonicalize to active URLs, but should be converted to explicit redirects or marked `noindex, follow` if redirects are not available.
- Near-term destination focus remains San Diego, Las Vegas, New York City, Chicago, and San Antonio. Do not add more cities until the thin-page cleanup and first-cluster improvements are complete.
- First cluster priority: finish San Diego quality depth before expansion. San Diego already has kids, toddlers, teens, stay, and itinerary coverage; the itinerary page is the weakest San Diego URL.
- Anti Gravity CLI advisory review was run via `agy`; it agreed that thin itinerary, Chicago/San Antonio stay, and thin teen pages are the main quality risk. Its stronger noindex recommendation was treated as advisory; the preferred path is immediate improvement with temporary noindex only if those pages cannot be upgraded in the next implementation cycle.

### SRR-031: San Antonio Teen SERP, Persona, Candidate, And Every-Section Review

Status: complete and independently review-clean inside `FT-IMP-020`

Selected: 2026-07-27

Roadmap ID: `FT-IMP-020`

Refresh the teen query result types and representative ranking pages; apply the San Antonio persona hypotheses with `SA-P4` primary and mixed-age needs from `SA-P1`/`SA-P3`; review candidate roles, every visible section, current primary sources, and material claim boundaries. The review supports one existing-page improvement and no new URL.

Result:

- Recorded four query-level result patterns and five representative competitor types without inventing complete top-10 overlap counts or ranks.
- Applied the primary teen persona and mixed-age needs, reviewed 18 candidate roles, retained 10, and audited every visible section.
- Recorded 22 current official/licensing sources, material claim boundaries, acceptance criteria, and non-causal measurement limits.
- Cycle-one review required query-to-URL traceability and direct support for the GO RIO duration and Six Flags chaperone check; both evidence corrections are complete. Franklin returned `PASS` in cycle two with no P0-P3 findings.

### SRR-032: San Antonio Family-Itinerary SERP, Persona, Source, And Every-Section Review

Status: complete and independently review-clean inside `FT-IMP-021`

Selected: 2026-07-27

Roadmap ID: `FT-IMP-021`

Before implementation, inspect current itinerary result types and representative ranking pages, qualitative family constraints, `SA-P1` through `SA-P5`, current official attraction/transport/weather sources, and every visible section of the existing page.

The review must decide what to keep, delete, combine, or rebuild; distinguish structural opportunities from firsthand/local authority we cannot claim; and bound route, time, transport, stroller, accessibility, safety, weather, ticket, price, and family-fit assertions.

Result:

- Mapped four current itinerary queries to representative exact URLs/domains and result types without inventing complete top-10 counts or ranks.
- Compared six ranking/community page types, preserving their concrete attraction and local-authority strengths while targeting overpacking, deletion, reset, and constraint gaps.
- Applied `SA-P1` through `SA-P5` and audited every visible section of the existing page.
- Recorded 17 current official/licensing sources, material claim boundaries, acceptance criteria, and non-causal measurement limits.
- Cycle-one P2 corrections add literal URLs/domains for every sampled query and direct Collections Center support.
- Einstein returned final `PASS_WITH_P3` in cycle three with no P0-P2 findings.
- The reviewed implementation released and passed production verification at commit `90ed019ea83b1ed242b0e545d3efc9b5215db40f` through Pages run `30237864556`.
- Artifact: `docs/research/san-antonio-family-itinerary-page-review.md`.
