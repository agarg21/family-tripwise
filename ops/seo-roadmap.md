# Family Tripwise SEO Roadmap

Last updated: 2026-08-29

Last re-scored: 2026-08-27
Next re-score due: 2026-09-03

## Ownership

Through September 12 at 17:00 America/New_York, the permanent Family Tripwise Master / Operator owns twice-daily scheduling and roadmap reprioritization from this repository. It does not consult or update the central SEO Control Room during the pilot.

Each run may select at most one evidence-qualified substantive action. Across each Eastern calendar day, the two runs must complete at least one bounded learning unit; this is a learning obligation, not a page-edit quota. The user owns material strategic and external-action decisions. The independent reviewer validates implementation quality; it does not replace required human evidence or user approval.

`ops/seo-roadmap.json` is the machine-readable project queue and scheduler state. Unchanged monitoring does not satisfy the daily unit. A supported preserve decision or rejected hypothesis counts; a second run may no-op after the unit is complete rather than manufacture an action.

## Current GSC evidence

- Latest snapshot: `ops/gsc-snapshots/2026-08-29.json`.
- Classification on August 29: fresh authenticated read-only Search Console API evidence, collected August 29 with finalized performance data through August 27.
- Completeness is `finalized-conservative`; finalization uses the conservative two-day lag rather than incomplete-data metadata.
- The public-safe snapshot contains normalized aggregate, page, sitemap, and priority URL Inspection rows. It omits credentials, complete raw query exports, and country/device rows.
- Historical protected exports remain outside this repository and are not consulted through the central operator during the independent pilot. Future manually requested encrypted exports decrypt only to `~/.codex/private/family-tripwise/protected-gsc-query-exports/`; complete rows never enter the repository.
- The sitemap was successfully resubmitted on July 27 and still reports 28 discovered pages. Read-only URL Inspection in the August 29 snapshot found 24 indexed and four not indexed. The remaining not-indexed URLs are the San Diego all-ages and teen activity pages, New York City itinerary, and Chicago teen page.
- The finalized 28-day property total is 2,011 impressions, 4 clicks, 0.20% CTR, and aggregate average position 65.67. The public snapshot still has no aligned query cohort. These rolling page/property averages do not identify a CTR problem, ranking failure, or user-facing deficiency.
- URL Inspection records a successful August 25 13:39 UTC crawl of the indexed San Diego family-hotel page after `FT-IMP-023`. This is the last pre-`FT-IMP-024` crawl boundary; ranking or CTR interpretation still requires sufficient finalized aligned query evidence and a later post-change crawl.
- August 13 evening run: public health, snapshot validation, production SEO, freshness and community-queue checks found no new defect, unfinished release, user feedback, or evidence-qualified existing-page action. No substantive action was selected.
- August 14 afternoon run: the fresh snapshot, public health, production SEO, freshness, repository state, and community queue identify no defect or evidence-qualified page change. The new San Diego hotel crawl is a measurement boundary, so no substantive action was selected.
- August 15 monitoring: the fresh snapshot and unchanged URL Inspection state do not alter the August 14 measurement decision. Public health, production SEO, freshness, repository state, and community queue identify no defect or evidence-qualified page change; no substantive action was selected.
- August 16 monitoring: the fresh snapshot adds one complete finalized post-crawl day for the San Diego family-hotel page but no query cohort, indexing change, crawl change, production defect, or user-facing gap. The page remains inside its observation window and no substantive action was selected.
- August 18 afternoon monitoring: fresh API evidence and public health checks add no crawl/indexing change, query cohort, production defect or named family-decision gap. One San Antonio family-hotel impression at page-average position 7 is not an actionable rank signal. No substantive action was selected.
- August 19 afternoon monitoring: fresh API evidence and public health checks again add no crawl/indexing change, query cohort, production defect or named family-decision gap. The weekly re-score changed no item score or status: `FT-PUB-006` remains the sole open roadmap item and stays user-gated under the August depth strategy. No substantive action was selected.
- August 20 afternoon monitoring: fresh API evidence and public health checks add no inspection/crawl change, query cohort, production defect, unfinished release or named family-decision gap. The larger rolling impression totals remain low-visibility page averages rather than an edit instruction. `FT-PUB-006` remains user-gated; no substantive action was selected.
- August 21 afternoon monitoring: fresh API evidence extends the finalized window by one day but adds no inspection/crawl change, query cohort, production defect, unfinished release or named family-decision gap. The rolling page/property averages remain orientation rather than an edit instruction. `FT-PUB-006` remains user-gated; no substantive action was selected.
- August 23 afternoon monitoring: mechanical snapshot commit `8c7b0cd` validates as fresh API evidence finalized through August 21. It adds no inspection/crawl change or public query cohort, and all performance data predates the August 22 hotel-page release. Public health and production checks remain green; `FT-PUB-006` remains user-gated, and no substantive action was selected.
- August 24 operating-model correction: fresh API evidence remains orientation only and selects no page edit. Direct user instruction selects `FT-OPS-004` to require one durable learning unit per Eastern day, with morning learn and afternoon apply/deepen/validate defaults; unchanged monitoring no longer counts.
- The user reopened new-city research on July 28. `FT-RES-011` selected Orlando under the incremental city playbook; its one promoted publication remains user-gated.
- On August 1, the user selected `FT-RES-013` to align the durable strategy around research authority, realistic ranking timelines, and one month of depth across existing cities before destination expansion resumes. No Orlando publication is selected during this cycle.

## Maintenance cadence

- Every Eastern calendar day: complete at least one bounded learning unit from current parent questions, a task-based page walkthrough, live SERP/ranking-page analysis, evidence freshness/conflict work, or a useful community-answer draft. Unchanged monitoring does not count.
- Every independent Master run: select at most one substantive action. The second run may no-op after the daily unit is complete when no additional evidence-qualified action exists.
- Weekly in this repository: review fresh evidence, close stale ideas, and re-score the next four weeks when evidence supports it.
- After a deployment: record commit, workflow, production, crawl, and measurement evidence in durable project state. Do not create a repository commit solely to backfill those fields.
- Use a blocking observation window only when an action explicitly requires an isolated experiment and available evidence can support that evaluation.
- Monthly or after a strategic event: ask the user to confirm destination expansion, monetization, risk, and continuation decisions.

## Current sequence

| Order | Item | Lane | State | Why now |
|---:|---|---|---|---|
| 1 | `FT-AUTH-001` source-worthy asset plan | Authority | Completed | Review cycle 2 passed; Family Reset Atlas brief and scored prospect map are review-clean, while publication and outreach remain gated. |
| 2 | `FT-RES-003` source and license audit | Authority/product evidence | Completed | All 13 anchors have official coverage, but real downloadable records remain blocked by unresolved structured-reuse and human-review gates. |
| 3 | `FT-DEV-003` schema and map-shell prototype | Product | Completed | Review-clean synthetic fixtures validate the data contract and accessible interaction without publishing claims or ingesting real records. |
| 4 | `FT-RES-004` San Diego family-hotel research engine evidence pack | Content/product quality | Completed | The review-clean three-property pack separates official facts, booking checks, signals, conflicts, unknowns, and publication gates without publishing a hotel page. |
| 5 | `FT-PLAN-001` clean San Diego family-hotel page brief | Content/product quality | Completed | The review-clean brief widens the candidate set, defines price-band and review-signal standards, and keeps the public page gated. |
| 6 | `FT-RES-005` expanded San Diego family-hotel evidence pack | Content/product quality | Completed | The review-clean expanded pack covers eight hotels with approximate price bands and family-review signals, while the live page remains gated. |
| 7 | `FT-PUB-001` researched San Diego family-hotel page | Content/product quality | Completed | Manual user approval moved the review-clean hotel evidence into one live, source-dated, non-ranky San Diego page. |
| 8 | `FT-RES-006` San Diego SERP-overlap cluster and persona decision pack | Content/product quality | Completed | Manual user instruction selected one San Diego-deepening research transaction that audits the full cluster before the next implementation. |
| 9 | `FT-IMP-002` San Diego things-to-do persona-led cluster router | Content/product quality | Completed | Existing all-ages activity page now routes first-time, toddler/nap/stroller, teen/tween, lodging-led, and rainy/free/budget planners without touching the protected stay page. |
| 10 | `FT-IMP-003` San Diego specialist-page usefulness pass | Content/product quality | Completed | All six pages received a section inventory; toddler, teen, and itinerary pages were compressed without removing their scan, detail, or application layers. |
| 11 | `FT-IMP-004` improve both San Diego lodging pages | Content/product quality | Completed and released | User explicitly overrode the low-signal observation hold; both pages now have distinct search jobs, review-clean section-level improvements, and verified production output at `326501bd`. |
| 12 | `FT-EVAL-001` stay-checklist evaluation | Measurement | Superseded | The July 13 checklist is no longer an isolated experiment after `FT-IMP-004`; do not claim a causal result on July 27. |
| 13 | `FT-EVAL-002` revised lodging crawl/query checkpoint | Measurement | Completed and review-clean | Fresh protected evidence attributes 156 of 166 exported impressions (94.0%) on the hotel page and 323 of 386 (83.7%) on the area page to hotel/resort wording. Heisenberg cycle two returned `PASS`; promote one bounded role clarification, not a causal ranking verdict. |
| 14 | `FT-IMP-005` expand San Diego activity and hotel decision sets | Content/product quality | Completed and released | Commit `31bba30652d76c3d1664193532a9c508a83c6f32`; Pages run `29876597948` and production verification passed. |
| 15 | `FT-RES-007` select the next pilot city and create the incremental city playbook | Content/product quality | Completed | Las Vegas wins the fresh GSC, keyword, SERP, commercial-intent, and existing-page comparison; research promotes one existing-page improvement. |
| 16 | `FT-IMP-006` improve the Las Vegas all-ages things-to-do hub | Content/product quality | Completed and released | Commit `3f555d65`; Pages run `29930917894` and production verification passed. |
| 17 | `FT-PUB-002` research and publish the Las Vegas family-hotel comparison | Content/product quality | Completed and released | Commit `bda58e8`; Pages run `29944609529` and production verification passed. |
| 18 | `FT-IMP-007` review and improve the Las Vegas teen guide | Content/product quality | Completed and released | Commit `ae917f1`; Pages run `29964564369` and production verification passed. |
| 19 | `FT-IMP-008` simplify the Las Vegas stay-area guide | Content/product quality | Completed and released | Commit `7bc2993`; Pages run `29975754626` and production verification passed. |
| 20 | `FT-IMP-009` review and improve the Las Vegas family itinerary | Content/product quality | Released and production-verified | Commit `48417b0`; Pages run `29994060699`; production verification passed. |
| 21 | `FT-RES-008` Chicago SERP-overlap cluster and persona decision pack | Content/product quality | Completed and review-clean | Query-level overlap, exact Semrush phrases, five personas, every-section audits, hotel/area architecture, and one promoted action passed independent review. |
| 22 | `FT-IMP-010` improve the Chicago all-ages things-to-do hub | Content/product quality | Completed and released | Commit `ad4f318`; Pages run `30058164707`; production verification passed. |
| 23 | `FT-PUB-003` research and publish the Chicago family-hotel comparison | Content/product quality | Completed and released | Commit `833c081`; Pages run `30062024170`; production verification passed. |
| 24 | `FT-IMP-011` simplify the Chicago stay-area guide | Content/product quality | Completed and released | Commit `9d1a90d`; Pages run `30084335602`; production verification passed. |
| 25 | `FT-IMP-012` review and improve the Chicago teen guide | Content/product quality | Completed and released | Commit `7df3952`; Pages run `30087275395`; production verification passed. |
| 26 | `FT-IMP-013` review and improve the Chicago family itinerary | Content/product quality | Completed and released | Commit `f7a2d7f`; Pages run `30090493666`; production verification passed. |
| 27 | `FT-OPS-001` audit and harden the repository operating model | Operating model | Completed | Release narratives reconciled, current operating guidance aligned, and focused state-drift QA added without changing `site/**`. |
| 28 | `FT-RES-009` New York City SERP-overlap cluster and persona decision pack | Content/product quality | Completed | Current GSC, exact logged-in Semrush records, explicit SERP intersections, five personas, and every-section audits define a five-page NYC architecture without changing `site/**`; independent review `PASS`. |
| 29 | `FT-IMP-014` improve the New York City all-ages things-to-do hub | Content/product quality | Released and production-verified | Commit `1437affd20914a7bf3fbdc5ae0097371d3fb96c1`; Pages run `30172548240`; release marker, production invariants, and production SEO QA passed after review `PASS_WITH_P3` with no P0-P2 findings. |
| 30 | `FT-PUB-004` research and publish the New York City family-hotel comparison | Content/product quality | Completed and released | Commit `57d765f`; Pages run `30184040925`; release marker, production invariants, and production SEO QA passed. |
| 31 | `FT-IMP-015` research and publish the New York City teen/tween activity specialist | Content/product quality | Released and production-verified | Commit `77e6cb9322da34ffc13daf84b0851e83773cc382`; Pages run `30198727075`; release marker, production invariants, and production SEO QA passed after review `PASS_WITH_P3` with no P0-P2 findings. |
| 32 | `FT-IMP-016` simplify and improve the New York City stay-area guide | Content/product quality | Released and production-verified | Commit `cd10933489ddf8e6c37780e5c0f20dfa740d60c2`; Pages run `30199465923`; release marker, five quick-pick starts, canonical/indexability, one sitemap entry, production invariants, and production SEO QA passed after Maxwell `PASS` with no P0-P3 findings. |
| 33 | `FT-IMP-017` review and improve the New York City family itinerary | Content/product quality | Released and production-verified | Commit `d0c4a7d`; Pages run `30204670128`; release marker, canonical/indexability, one sitemap entry, action invariants, and production SEO QA passed. |
| 34 | `FT-RES-010` San Antonio SERP-overlap cluster and persona decision pack | Content/product quality | Completed and review-clean | Current GSC, exact Semrush evidence, observed SERP overlap, five personas, and every-section audits define a five-role architecture without changing `site/**`; Goodall returned `PASS`. |
| 35 | `FT-IMP-018` improve the San Antonio all-ages things-to-do hub | Content/product quality | Released and production-verified | Commit `27168d5`; Pages run `30207559125`; release marker, canonical/indexability, one sitemap entry, action invariants, and production SEO QA passed after Pasteur `PASS`. |
| 36 | `FT-PUB-005` research and publish the San Antonio family-hotel comparison | Content/product quality | Released and production-verified | Commit `4617ec82`; Pages run `30226920951`; 12 hotels, 24 maps, release marker, production invariants, and production SEO QA passed. |
| 37 | `FT-IMP-019` simplify and improve the San Antonio stay-area guide | Content/product quality | Released and production-verified | Commit `7f54f23`; Pages run `30234700209`; release marker, production artifact, action invariants, and production SEO QA passed. |
| 38 | `FT-IMP-020` improve the San Antonio teen activity specialist | Content/product quality | Released and production-verified | Commit `e071a60`; Pages run `30236032473`; release marker, production artifact, action invariants, and production SEO QA passed after Franklin `PASS`. |
| 39 | `FT-IMP-021` review and improve the San Antonio family itinerary | Content/product quality | Completed | Existing itinerary is released and production-verified as a compact one-, two-, and three-day sequencing product. |
| 40 | `FT-OPS-002` reconcile operating guidance and harden dated-content freshness | Operating model | Released and production-verified | Commit `f814b27482eff9e22b24d21ae267c4ea36e2a9e0`; Pages run `30359879823`; release marker, production invariant, and production SEO QA passed after two independent final `PASS` verdicts. |
| 41 | `FT-DEV-004` modularize static page generation without output changes | Technical foundation | Completed and review-clean | Compatible entry points now delegate to four explicit modules; 137/137 tests, byte-stable output, isolation proof, and Noether cycle-two `PASS` with no P0-P3 findings. |
| 42 | `FT-RES-011` select and research the next family destination cluster | Content/product quality | Completed and review-clean | Orlando selected from current Semrush, observed SERP overlap, ranking-page usefulness, cluster depth, family constraints, and research cost; Pasteur cycle-two `PASS` with no P0-P3; one user-gated action promoted. |
| 43 | `FT-PUB-006` research and publish the Orlando all-ages family activity hub | Content/product quality | Ready but held for August depth cycle | Research remains valid, but one new destination URL is deferred until the existing-city strategy is reviewed on or after September 1 or the user explicitly overrides it; approval is still required. |
| 44 | `FT-RES-012` build the existing-page protected GSC ranking opportunity map | Content/product quality | Completed and review-clean | No current page rewrite or CTR winner; eight pages are not indexed, current crawls lag releases, no exported page-query row averages position 20 or better, and authority is the dominant next lane. |
| 45 | `FT-AUTH-002` complete San Diego Reset Atlas real-record and parent-test evidence | Authority | Completed and review-clean | 39 internal records cover all 13 anchors; all coordinates and 273 trust states remain `UNKNOWN`; three parent tasks are prepared but not simulated; Wegener cycle-three `PASS`. |
| 46 | `FT-AUTH-004` map San Diego backlink gaps and promote one existing-page authority action | Authority | Completed and review-clean | Semrush detected zero legitimate Family Tripwise referring domains in its current 11-domain sample; links outside Semrush remain unknown, competitor page-level profiles are far smaller and noisier than domain totals imply, and one existing-page enhancement plus public prospect set passed Schrodinger cycle-three review. |
| 47 | `FT-AUTH-005` add a source-dated San Diego family attraction logistics index | Authority | Released and production-verified | Commit `e7c40ff4e770a2c94c6ed298808775c1ac9c9762`; Pages run `30667262994`; exactly 12 activities share one source-dated table/data/download record set and production verification passed. |
| 48 | `FT-RES-013` define the research-authority thesis and August depth cycle | Strategy/authority | Completed and review-clean | Bohr cycle-two `PASS` with no P0-P3; durable strategy now prioritizes existing-city depth, research authority, and evidence-based ranking windows before expansion. |
| 49 | `FT-RES-014` codify an opinionated evidence-led SEO doctrine | Strategy/authority | Completed and review-clean | Russell cycle-two `PASS` with no P0-P3; the binding doctrine rejects page-count authority, keyword-variant factories, low-visibility CTR work, technical busywork, and unsupported practitioner folklore. |
| 50 | `FT-RES-015` diagnose the Las Vegas all-ages ranking opportunity | Content/authority diagnostic | Completed and review-clean | Faraday cycle-two `PASS` with no P0-P3; fresh protected evidence and live SERPs support one broad URL and one consolidation/citation improvement without calling the latest crawl a failed rewrite. |
| 51 | `FT-AUTH-006` replace repeated Las Vegas planning layers with a source-dated family activity cost-and-friction index | Authority/existing-page growth | Released and production-verified | Commit `6bc35d03ba413056cf3b9988bf449ae8972d4a57`; Pages run `30869031713`; release marker, target invariants, and production SEO QA passed after Herschel cycle-two `PASS`. |
| 52 | `FT-IMP-022` clarify San Diego lodging URL ownership | Existing-page role clarity | Released and production-verified | Commit `e5e41ecbd664220f4359140cfd639e4e2b7a186f` was published by run `30930924523`; the red workflow wrapper reflects a post-deploy transient 503 and retry artifact collision, while the release marker, invariants, and fresh production SEO QA pass. |
| 53 | `FT-OPS-003` enable the one-month independent Master autopilot | Operating model | Completed and review-clean | Reuses the Family Tripwise heartbeat for 05:00 and 13:00 Eastern runs through September 12, matching its 09:00 and 17:00 UTC slots; Turing cycle-two `PASS` confirmed the evidence, no-op, release, new-page, and draft-only community gates. |
| 54 | `FT-DEV-005` add a local community-answer review board | Community usefulness workflow | Completed and review-clean | Noether cycle-three `PASS`; strict public-repository queue, loopback/same-origin/token writes, Eastern dates, and approve/revise/reject UI are ready without posting authority. |
| 55 | `FT-COM-001` draft one current NYC family-itinerary answer | Community usefulness | Completed and review-clean | One pending, self-contained NYC itinerary draft passed Hume cycle-two review after source-fidelity, AI-guidance, and dining-evidence corrections; no link or external write. |
| 56 | `FT-MAINT-002` refresh the expired Chicago InterContinental pool notice | Production factual freshness | Released and production-verified | Commit `9bf5e04d51efaaa5f35c97ba60656555603fc422`; Pages run `31685857634`; marker, revised text, page invariants and production SEO QA pass after Locke `PASS_WITH_P3` with no P0-P2. |
| 57 | `FT-RES-016` audit San Diego family-hotel source and price freshness | Existing-page evidence freshness | Completed and review-clean | All 12 records checked. Core facts hold; price support is dynamic/stale, and La Jolla Shores has one resolved pool state plus an unresolved first-party parking conflict. Bacon cycle-three `PASS`; no page change. |
| 58 | `FT-MAINT-003` refresh the existing San Diego family-hotel evidence layer | Production factual freshness | Released and production-verified | Commit `20f88bd6ec995f05beb4e430936fbb1bb5f7a522` was published by successful Pages run `32120676612`; Bacon returned cycle-one `PASS` with no P0-P3, and the live marker, production SEO QA and declared invariants pass. |
| 59 | `FT-RES-017` pilot a task-based persona usefulness review and recursive learning loop | Existing-page user value method | Completed and review-clean | Five task scenarios are answerable; Pasteur independently reproduced one information-order P2 and returned cycle-two `PASS`. Only unselected candidate `IMP-044` is promoted. |
| 60 | `FT-IMP-023` move and consolidate the San Diego hotel trip-style start | Existing-page user value | Released and production-verified | Commit `2dbe30db874553521423bb755ce069bb57a5fb0c`; Pages run `32587720666`; the first card begins at 736px on live 390-by-844 mobile and every declared invariant passes. |
| 61 | `FT-OPS-004` require one bounded Family Tripwise learning unit per day | Operating model | Completed and review-clean | The existing heartbeat and durable policy now enforce a morning learn / afternoon apply-deepen-validate loop; LRN-004 is the first eligible unit, and Kierkegaard cycle-two `PASS` confirmed all anti-churn and page-change gates. |
| 62 | `FT-RES-018` test the Mission Bay base versus LEGOLAND split-stay decision | Recursive daily learning | Completed and review-clean | Poincare cycle-one `PASS` independently reproduces the `PARTIAL` task result and promotes only unselected `IMP-045`; no live page changes. |
| 63 | `FT-RES-019` validate the San Diego stay-shape gap against live SERPs | Recursive daily learning | Completed and review-clean | Linnaeus cycle-two `PASS`; current results retain and narrow unselected `IMP-045` to one hotel-page rule plus the existing area-guide handoff, with no new URL or area-page edit. |
| 64 | `FT-IMP-024` expose the San Diego one-base-versus-LEGOLAND-split rule | Existing-page user value | Released and production-verified | Commit `d30c29c87e62f79840087331be5b9908b358c8e3`; Pages run `33059164697`; the bounded rule, three-start Mission Bay comparison, release marker, production SEO and every declared invariant pass. |
| 65 | `FT-RES-020` test the San Diego lodging cross-page decision handoff | Recursive daily learning | Completed, review-clean and pushed | Commit `9a03f2f6d489cbe3c5c481fefedd826ad0bab584`; Pascal cycle-two `PASS`; no page or URL change. |
| 66 | `FT-RES-021` map current Las Vegas family base-and-day-shape questions to the existing cluster | Recursive daily learning | Completed, review-clean and pushed | Commit `cf40322b643b6363b9c077bc412b245bf7550dd9`; Meitner cycle-two `PASS`; preserve the four core page roles. Its then-unselected cross-page task subsequently ran as `FT-RES-022`; no page, URL or external action occurred in this research transaction. |
| 67 | `FT-RES-022` test the Las Vegas pool-versus-central-base cross-page handoff | Recursive daily learning | Completed, review-clean and pushed | Commit `f1dace7d41c13e5767c5dc4894b7b6bc3ae9b339`; Gauss cycle-two `PASS`; Case A completes six outputs, while Case B is `PARTIAL` on four-day blocks and base consequence. Its then-unselected itinerary handoff was subsequently selected as `FT-IMP-025`. |
| 68 | `FT-IMP-025` expose the Las Vegas pool-to-base consequence | Existing-page user value | Review-clean; release pending | Linnaeus cycle-three `PASS` leaves no P0-P3. One compact itinerary surface makes the conditional base consequence and current lodging links explicit while preserving every page/search invariant and adding no fourth itinerary, entity, or URL. |

Ready does not authorize project work by itself. The Master selects at most one action per run using impact, confidence, learning value, effort, risk, freshness requirements, active observation windows, and expected user value.

### FT-IMP-025 - Expose the Las Vegas pool-to-base consequence

- Selected: 2026-08-29 by the afternoon independent-pilot heartbeat to apply the morning `FT-RES-022` result.
- State: review-clean across the exact eleven implementation/state paths after Linnaeus cycle-three `PASS`; commit, release, and production verification pending.
- Task: add one compact three-choice decision surface immediately after the existing itinerary pivot so fixed central anchors, a South Strip pool-led trip, and the burden of changing hotels lead directly to the current stay-area and named-hotel evidence.
- Evidence boundary: fresh authenticated August 29 GSC is finalized through August 27 and reports 2,011 property impressions, 4 clicks, aggregate position 65.67, 24 of 28 inspected URLs indexed, and 63 itinerary-page impressions at page-average position 33.02. The itinerary remains indexed with a July 31 crawl. No aligned query cohort exists, so GSC is orientation and the pre-change boundary; the independently reproduced `FT-RES-022` task gap selects the edit.
- Invariants: preserve title/H1/description, canonical/indexability/sitemap, three quick picks, three day plans, five pivot rows, four stop rules, four cluster cards, three visible/schema FAQs, sources, image, and three-item `ItemList`. Add no fourth itinerary, entity, URL, score, map, analytics, indexing request, external action, destination, or automation.
- Acceptance: Case B base type improves from `PARTIAL` to `YES` without claiming a fourth-day block count; both lodging links appear directly after the pivot and before stop rules; one-day outputs remain no worse; deterministic generation changes only the target; focused/full QA, desktop/390/320 task checks, independent review, release marker, production SEO, and declared affected-URL invariants pass.
- Review-clean result: Case B base type is now `YES`, its fourth-day block count remains explicitly `PARTIAL`, and Case A remains `YES`. The section order and zero document overflow pass at 1280 by 900, 390 by 844, and 320 by 800. Focused 5/5 and full 181/181 tests plus state, freshness, SEO, 47-snapshot, JSON, scope, whitespace, generation, and public-preflight checks pass. Linnaeus cycles one and two found and closed four P2 state-mirror groups; cycle three returned `PASS` with no P0-P3.

### FT-RES-022 - Test the Las Vegas pool-versus-central-base cross-page handoff

- Selected: 2026-08-29 by the morning independent-pilot heartbeat as today's required task-based learning unit and direct falsification of `FT-RES-021`.
- State: completed, review-clean and recorded at docs-only action commit `f1dace7d41c13e5767c5dc4894b7b6bc3ae9b339`; Gauss cycle-two `PASS` leaves no P0-P3, no public page changed, and no Pages wait applies.
- Task: test one family with one night plus one full day and another with four full days and fixed Center Strip anchors. Determine usable blocks, pool role, base type, true occupancy/room setup, heat/transport/parking/access/complete-total checks, and one thing to remove when the pool or a transfer consumes a block.
- Evidence boundary: fresh authenticated August 28 GSC is finalized through August 26. It confirms all five Las Vegas pages remain indexed but contains no aligned query cohort; page averages and crawl dates are orientation, not a ranking, CTR or page-change trigger.
- Invariants: research/state only; no `site/**`, generator, test, page, hotel/activity record, price, map, title/H1, URL/search state, external action or automation change.
- Acceptance: walk the live itinerary, stay-area, family-hotel and activity route through normal links/controls; score the six outputs `YES`, `PARTIAL` or `NO`; record detours, repetition/conflict, evidence/unknown recovery and overflow; conclude `PRESERVE` or retain at most one bounded unselected future defect hypothesis; pass native QA and independent review. Exact 390 by 844 and 320 by 800 runs completed; the desktop browser clamped the requested 1280 by 900 override to a 1280 by 720 inner viewport, so desktop claims are limited to width breakpoint, source order, navigation and overflow.
- Research result: `PARTIAL`. The one-day case completes all outputs. The four-day case requires block-count extrapolation and does not directly join fixed central anchors to one base versus a South Strip pool-property move. The research transaction preserved the current pages and carried one then-unselected itinerary base-consequence handoff forward; the August 29 afternoon heartbeat subsequently selected it as `FT-IMP-025`.

### FT-RES-021 - Map current Las Vegas family base-and-day-shape questions to the existing cluster

- Selected: 2026-08-28 by the morning independent-pilot heartbeat as today's required current-parent-question learning unit.
- State: completed, review-clean and docs-only pushed at commit `cf40322b643b6363b9c077bc412b245bf7550dd9`; Meitner cycle-two `PASS` leaves no P0-P3; no public page changed and no Pages wait applies.
- Question: do current family questions primarily ask for more Las Vegas attractions, or for a joined decision across trip length, fixed anchors, pool value, hotel/base location, room occupancy, heat, transport and budget?
- Evidence boundary: four public questions dated January-June 2026 are qualitative only. Fresh August 27 authenticated GSC is finalized through August 25 but has no aligned query cohort; the all-ages page has no post-August-3 crawl, so page averages are orientation rather than a ranking or CTR diagnosis.
- Invariants: research/state only; no `site/**`, page, record, URL/search state, community post/draft, external account, outreach or automation change.
- Acceptance: paraphrase four current questions without identities or copied text; derive and map a falsifiable shared decision model to the existing activity, stay-area, hotel and itinerary roles; conclude `PRESERVE` or record one bounded unselected task hypothesis; pass native QA and independent review.
- Review-clean result: `PRESERVE` the four page roles and current URL set. Existing pages own every component of the joined base-and-day-shape decision. The then-unselected one-day/four-day task subsequently ran as `FT-RES-022`, whose bounded handoff was selected as `FT-IMP-025`; `FT-RES-021` itself added no hotel, attraction, generic layer or URL.

### FT-RES-020 - Test the San Diego lodging cross-page decision handoff

- Selected: 2026-08-27 by the afternoon independent-pilot heartbeat to apply and independently validate the morning `FT-IMP-024` result.
- State: completed, review-clean and docs-only pushed at commit `9a03f2f6d489cbe3c5c481fefedd826ad0bab584`; Pascal cycle-two `PASS` leaves no P0-P3; no public page change is authorized and no Pages wait applies.
- Task: start on the five-area San Diego guide, choose a plausible base for a city/coastal trip with a LEGOLAND anchor, reach the 12-hotel shortlist, use the one-base-versus-short-split rule and three early hotel shapes, then identify the date-specific traffic and total-price checks.
- Evidence boundary: no new snapshot arrived during the August 27 afternoon fetch. The recent reused August 26 authenticated API evidence is finalized through August 24 and predates `FT-IMP-024`; it is orientation only and contains no aligned query cohort. The walkthrough is proxy-reviewed interface evidence, not user testing, behavior, satisfaction, rank or CTR evidence.
- Invariants: research/state only; no `site/**`, page, URL, hotel/area record, map, indexability, sitemap, external account, outreach or automation change.
- Acceptance: inspect the live route at desktop, 390 by 844 and 320 by 800 with normal interaction; record answerability, link discoverability, detours, repetition/conflict, evidence traceability, unknown recovery and overflow; conclude `PRESERVE` or record only a bounded future defect hypothesis; pass native QA and independent review.
- Result: `PARTIAL`. The pages have coherent ownership and the hotel page completes the stay-shape decision. The area page's first hotel link precedes the five-area decision, while its dedicated hotel handoff appears after the matrix and four booking checks. Preserve both pages now and record only an unselected future handoff-order hypothesis.
- Review and QA: Pascal cycle one found three P2s covering GSC attribution, proxy wording and a stale roadmap state. Cycle two returned `PASS` with no P0-P3. Tests pass 180/180; operator-state, freshness, local/production SEO, GSC snapshot/preflight, JSON, link, scope, privacy and whitespace checks pass.

### FT-IMP-024 - Expose the San Diego one-base-versus-LEGOLAND-split rule

- Selected: 2026-08-27 by the morning independent-pilot heartbeat after clean origin alignment and ingestion of the August 25-26 mechanical GSC snapshots.
- State: completed, released and production-verified at commit `d30c29c87e62f79840087331be5b9908b358c8e3` through successful Pages run `33059164697`; Dewey cycle-three `PASS` left no P0-P3, and the release marker, production SEO QA and declared invariants pass.
- Trigger: `FT-RES-018` independently reproduced a `PARTIAL` cross-card task, and `FT-RES-019` assigned one compact property-level rule to the hotel page while preserving the area-page handoff. Fresh August 26 API evidence records an August 25 post-release crawl but remains orientation because no public aligned query cohort exists.
- Change: replace `Hotels covered / 12 options` in the existing four-field snapshot with a bounded `One base or split?` comparison, then keep that snapshot after all six routing cards and immediately before its existing area-guide handoff. Reduce the first Mission Bay card from six named starts to Bahia and Hyatt; its separate Catamaran card remains the third starting shape. Add no card, section, hotel, filter, page or exact travel/water claim.
- Invariants: preserve six trip-style cards, four snapshot fields, 12 hotels, prices, evidence, conflicts, sources, map and direct links, area-first handoff, title/H1, canonical/indexability/sitemap and 12-item schema parity; change no area page, external state or automation.
- Measurement: improve all five `FT-RES-018` outputs from `PARTIAL` to `YES`, including no more than three Mission Bay starting shapes; keep S1-S5 no worse; and verify that the rule begins within two viewport heights of the trip-style section start at 390 by 844 and 320 by 800 without page overflow. August 25 is the last pre-change crawl boundary.
- QA/review: focused tests pass 5/5 and the full suite 160/160; operator-state, freshness, local/production-preflight SEO, all 44 snapshots, public preflight, generation, browser, JSON, scope, privacy, invariant and whitespace checks pass. Dewey cycles one and two exposed and closed the task-completion and current-state defects; cycle three returned `PASS` with no P0-P3.

### FT-RES-019 - Validate the San Diego stay-shape gap against live SERPs

- Selected: 2026-08-25 by the morning independent-pilot heartbeat as today's live-SERP/ranking-page learning unit.
- State: completed and review-clean across the exact nine research/handoff/state paths; Linnaeus cycle-two `PASS` with no P0-P3.
- Question: do current results place the Mission Bay-versus-LEGOLAND one-base/split decision on a hotel page, an area page, both through a handoff, or nowhere clearly?
- Evidence boundary: the newest available GSC snapshot is recent reused API evidence from August 24 because the heartbeat arrived before today's collector. It is orientation only and contains no aligned query cohort or post-`FT-IMP-023` crawl.
- Invariants: no `site/**`, page, generator, URL/search state, new destination, external action or automation change.
- Acceptance: record bounded query/URL overlap, representative ranking-page strengths/gaps, and a retain/revise/move/reject decision for unselected `IMP-045`, then pass native QA and independent review.
- Result: retain and revise unselected `IMP-045`. Broad results divide into San Diego and Carlsbad/LEGOLAND hotel inventories, while explicit sequencing questions appear mainly in community discussions. Put one compact property-level rule on the hotel page and preserve its existing handoff to the area guide; do not edit the area page or create a new URL.
- QA and review: 160/160 tests, state/freshness/local/production SEO, 42 snapshots, 66 unique IDs, duplicate-key, seven-link, exact-scope, privacy and whitespace checks pass. Linnaeus cycle one found three P2s in query reproducibility and state freshness; the corrected diff passed cycle two with no findings.

### FT-RES-018 - Test the Mission Bay base versus LEGOLAND split-stay decision

- Selected: 2026-08-24 by the afternoon independent-pilot heartbeat as the apply/deepen step for `LRN-004`.
- State: completed and review-clean; Poincare cycle-one `PASS` with no P0-P3 across the nine registered paths.
- Task: determine whether the live San Diego family-hotel page lets a family choose one Mission Bay base versus a short LEGOLAND split stay, with a short Mission Bay shortlist, bounded LEGOLAND role, and explicit unknowns.
- Evidence boundary: current parent questions are qualitative; the task review is proxy evidence, not user testing. Fresh GSC is orientation only because it contains no complete finalized post-`FT-IMP-023` day and no post-release crawl.
- Invariants: no `site/**`, generator, test, hotel record, URL/search state, external action, destination or automation change.
- Acceptance: inspect desktop and 390-pixel mobile answerability and evidence traceability, promote at most one bounded later improvement or preserve, then pass native QA and independent review.
- Candidate result: `PARTIAL`. The existing records answer hotel-specific questions but do not expose a one-base-versus-split rule; bay/ocean roles require cross-card interpretation. Only unselected `IMP-045` is promoted, replacing one redundant snapshot field rather than adding a layer.
- QA and review: 160/160 tests, state/freshness/local/production SEO, 42 snapshots, 28-URL public preflight, duplicate-key/ID, five-link, exact-scope, privacy and whitespace checks pass. Poincare independently reproduced the measurements, sources, evidence boundaries and proportional handoff, then returned `PASS` with no P0-P3.

### FT-OPS-004 - Require one bounded Family Tripwise learning unit per day

- Selected: 2026-08-24 by direct user instruction after repeated monitoring-only heartbeats.
- State: completed and review-clean; Kierkegaard cycle-two `PASS` with no P0-P3. Policy, operator configuration, learning ledger, roadmap/current-cycle mirrors and the existing heartbeat prompt are the only changed surfaces.
- Daily contract: complete at least one source-dated unit from current parent questions, one task-based existing-page walkthrough, one live SERP/ranking-page analysis, one evidence freshness/conflict audit, or one useful community-answer draft. Monitoring and narrative restatement do not count.
- Run pairing: the 05:00 Eastern run defaults to learning; the 13:00 run applies, deepens, or independently validates that result. A supported preserve decision or rejected hypothesis counts, and no page edit is required.
- No-op rule: monitoring-only no-op is allowed only after the day's unit is complete, after the pilot cutoff, or when a recorded technical/external blocker prevents evidence collection.
- Invariants: retain the same automation ID, thread, 05:00/13:00 Eastern schedule and September 12 cutoff; retain at most one substantive action per run and all page, evidence, review, release, new-page and external-action gates.
- Measurement: use `backlog/product-learning-ledger.md` to count daily units by lane, hypotheses confirmed/rejected, page gaps found/fixed, preserve decisions, community drafts and refreshed material facts. Raw edit count is not success.
- First unit: `LRN-004` synthesizes four current San Diego family-lodging discussions into one stay-shape hypothesis and preserves the current hotel page pending a later one-base-versus-LEGOLAND-split task walkthrough. It is qualitative evidence, not demand or user validation.
- Review and QA: Kierkegaard cycle one found four P2s and one P3; all were corrected. Cycle two returned `PASS` with no P0-P3. Full tests pass 160/160; state, freshness, local/production SEO, 42 snapshots, public preflight, JSON/IDs, automation identity/schedule/cutoff, privacy, exact-scope and whitespace checks pass.

### FT-IMP-023 - Move and consolidate the San Diego hotel trip-style start

- Selected: 2026-08-22 by the 17:00 UTC independent-pilot heartbeat after clean origin reconciliation.
- State: completed, released and production-verified at commit `2dbe30db874553521423bb755ce069bb57a5fb0c` through successful Pages run `32587720666`; Godel cycle-two `PASS` with no P0-P3.
- Trigger: `FT-RES-017` and Pasteur independently reproduced one `proxy-reviewed` P2: the first useful route begins about 1.46 mobile viewports down and duplicates a broad trip-summary layer.
- Target: `https://familytripwise.com/where-to-stay/san-diego-family-hotels.html`.
- Exact scope: generator, focused page test, generated page, implementation/learning/status records and five operator mirrors. No other page, data record, style, URL or external state may change.
- Acceptance: place the existing six-card trip-style surface immediately after the hero and inside the first 844 pixels at 390 pixels wide; remove the duplicate broad summary; preserve all 12 hotels, evidence, prices, map, detail and search invariants; keep scenarios S1-S5 answerable.
- Measurement: compare task-surface position and answerability, not rankings or CTR. August 13 remains historical, but release interrupts unchanged-page interpretation; wait for a later crawl and aligned finalized query evidence before any search conclusion.
- Result before review: at 390 by 844 the trip-style heading begins at 671px and its first card at 736px, with no horizontal overflow. The broad summary is absent, and scenarios S1-S5 retain their prior outputs and evidence boundaries.
- QA: focused tests pass 5/5 and full tests pass 160/160. State, freshness, local and production-preflight SEO, 40 snapshots, deterministic generation, 1280/390/320 rendering, exact-scope, privacy, content/search invariants and whitespace checks pass.
- Review: Godel cycle one found two P2s covering the unbalanced desktop evidence grid and removed area-first link. Both were fixed; cycle two independently confirmed the corrected layout, restored link, all invariants and green QA, then returned `PASS` with no P0-P3.
- Production: `release.json` reports the exact commit/run. Production SEO returns 0 errors and 0 warnings; the live page is 200, canonical and indexable with six trip-style cards, 12 hotel cards, 24 direct Maps links, one map, one area-first link, one 12-item ItemList and no duplicate summary. Live 390-by-844 rendering reproduces 671px/736px with no horizontal overflow.

### FT-RES-017 - Pilot a task-based persona usefulness review and recursive learning loop

- Selected: 2026-08-22 by direct manual user instruction after clean fast-forward of the mechanical August 22 GSC snapshot.
- State: completed and review-clean; Pasteur cycle-two `PASS` with no P0-P3. Research, strategy and state only; no public page changed.
- Target: `https://familytripwise.com/where-to-stay/san-diego-family-hotels.html`.
- Method: convert evidence-derived persona labels into explicit planning tasks with required outputs, then inspect whether the live desktop and mobile page lets each scenario choose a useful short list, compare consistent criteria, trace evidence and uncertainty, and reach a next verification step.
- Evidence boundary: fresh public-safe GSC is orientation only; current SERPs, representative ranking pages, current parent questions, live-page structure and authoritative user-research guidance support hypotheses. An AI task walkthrough is `proxy-reviewed`, never user-tested or user-validated.
- Exact scope: one protocol, one pilot review, one learning ledger, strategy/research/optional implementation handoffs, San Diego status and five operator mirrors. No `site/**`, release, indexing, external action, destination or automation change.
- Result: all five scenarios reach a defensible decision. The first useful route begins about 1.46 mobile viewports down and overlaps with a second trip-style layer; only `IMP-044` is promoted as an unselected reorder/consolidation candidate.
- QA/review: 159/159 tests, state/freshness/local and production SEO, 40 snapshots, JSON/IDs, source/scenario/action, exact-scope/privacy/no-site and whitespace checks pass. Pasteur cycle one found one P2 and two P3 evidence/state issues; all were corrected, and cycle two returned `PASS` with no P0-P3.

### FT-RES-016 - Audit San Diego family-hotel source and price freshness

- Selected: 2026-08-17 by the morning independent-pilot heartbeat after clean repository/origin reconciliation.
- State: completed and review-clean; research-only, with the protected San Diego family-hotel page unchanged. Bacon cycle-three `PASS` found no P0-P3.
- Evidence trigger: the original eight-record hotel evidence pack was checked July 18 and set August 17 as its official-fact refresh boundary. The four July 21 expansion records remain inside their 30-day official-fact window, but every visible rough-price observation exceeds the 14-day rule.
- GSC boundary: the August 16 authenticated API snapshot is recent reused evidence finalized through August 14. The indexed hotel page has 661 impressions, zero clicks and page-average position 70.25, with only one complete finalized day after its August 13 crawl. This does not create a CTR, rewrite, or ranking conclusion.
- Exact scope: one new 12-hotel freshness audit, research and optional implementation backlog handoffs, roadmap/current-cycle/review mirrors, and San Diego status. No `site/**`, generator, test, workflow, or external-account path is allowed.
- Acceptance: classify current official facts, volatile price visibility, conflicts and unknowns for all 12 hotels; preserve the page or promote exactly one bounded future maintenance action; pass native QA and independent review.
- Measurement: evidence coverage and material discrepancy detection only. Preserve the active crawl/observation boundary unless a separately selected action fixes a verified material defect.
- Result: all 12 official-source records remain viable. Public price examples are dynamic, generally two-adult and mostly late-July, so they do not renew the visible 14-day ranges. La Jolla Shores now officially describes a refreshed heated pool and children's wading pool, while first-party pages still disagree between $45 and $55 parking. `FT-MAINT-003` / `IMP-043` is the only promoted follow-up and remains unselected.
- QA/review: 159/159 tests; state, freshness, local/production SEO, 34 public snapshots, duplicate-key/ID, 12+12 row/source coverage, privacy, exact-scope and whitespace checks pass. Bacon's first two cycles found six P2s, all corrected; cycle three returned `PASS` with no P0-P3.

### FT-MAINT-003 - Refresh the existing San Diego family-hotel evidence layer

- Selected: 2026-08-17 by the 17:00 UTC independent-pilot heartbeat after clean fast-forward of the mechanical August 17 GSC snapshot.
- State: completed, released and production-verified at commit `20f88bd6ec995f05beb4e430936fbb1bb5f7a522` through successful Pages run `32120676612`; Bacon returned cycle-one `PASS` with no P0-P3.
- Target: the existing San Diego family-hotel URL only.
- Product boundary: keep exactly 12 hotels, the page role and architecture, title/H1, URL/canonical/indexability/sitemap, map, trip-style routing and non-promotional posture.
- Evidence work: refresh the original eight durable records in the family-hotel evidence pack and the four expansion records, then refresh all visible official checked dates and public rough-price orientation; publish La Jolla Shores' refreshed pool state and retain the first-party parking conflict; keep Manchester's current December 2026 pool schedule and all material caveats current.
- GSC boundary: fresh August 17 API evidence is finalized through August 15: 1,897 property impressions, 6 clicks, aggregate position 64.01, 24/28 indexed, and 676 impressions at page-average position 70.33 for the hotel page. Only two complete finalized days follow the August 13 16:43 UTC crawl, so this remains factual/evidence maintenance rather than a ranking or CTR experiment.
- Implementation result: all 12 official records and visible dates are refreshed; La Jolla Shores and Loews conflicts are explicit; the July price ranges remain clearly older orientation because August checks were not comparable family totals; all product and search invariants are preserved.
- Release gate: focused/full QA, deterministic generation, source/privacy/scope/responsive checks and Bacon's independent `PASS` all completed before release. The live marker reports the exact commit/run, production SEO QA returns 0 errors and 0 warnings, and every declared page invariant passes.

### FT-MAINT-002 - Refresh the expired Chicago InterContinental pool notice

- Selected: 2026-08-13 by the 09:00 UTC independent-pilot heartbeat after clean repository/origin reconciliation.
- State: completed, released and production-verified at commit `9bf5e04d51efaaa5f35c97ba60656555603fc422` through successful Pages run `31685857634`; Locke returned `PASS_WITH_P3` with no P0-P2.
- Evidence: IHG's current amenities/project notice says the pool was scheduled to reopen after August 12 while seating and locker-room work continues through September 16, with occasional daytime construction, unavailable locker rooms, and relocated weekend pool movies. Separate official IHG pages conflict on exact pool hours, so no exact-hours claim will be published.
- GSC boundary: the newest available August 12 authenticated API snapshot is reused recent evidence finalized through August 10, not newly collected evidence. Its aggregate performance and indexing data do not justify this edit.
- Exact scope: the Chicago hotel evidence pack, family-hotel generator and focused test, generated Chicago family-hotel HTML, Chicago status, and the five operator-state mirrors named in JSON.
- Invariants: same URL, title, H1, canonical, indexability, sitemap entry, ten hotels, 20 Google Maps links, price ranges, and unrelated content; no new URL, indexing request, external write, destination expansion, or automation change.
- Measurement: close the production freshness defect and verify zero freshness/SEO errors plus exact production invariants; this is not a ranking or CTR experiment.
- QA/review: focused tests pass 4/4 and the full suite passes 179/179; state, freshness, local SEO, deterministic generation, 1280/390/320 rendering, duplicate-key/ID, exact-scope, credential and whitespace checks pass. Locke confirmed source/claim safety, usefulness, FAQ/schema parity and invariants; the two P3s cover mechanically reconciled phase wording and optional future clock-time regression hardening.
- Production: `release.json` reports the exact commit and run; the old closure wording is absent, both scheduled-reopening checks are present, ten hotel cards, 20 Maps links, canonical/indexability and one sitemap entry are preserved, and production SEO QA reports 0 errors and 0 warnings.

### FT-COM-001 - Draft one current NYC family-itinerary answer

- Selected: 2026-08-12 by the first scheduled independent-pilot heartbeat after fresh GSC and repository health checks found no defect, unfinished release, or eligible page edit.
- State: completed and review-clean after Hume cycle-two `PASS` with no P0-P3 findings; the draft remains pending user review and was not posted.
- Source: one current r/visitingnyc itinerary-check question about a Tuesday-through-Saturday family trip with an early-elementary-age child. Retain only the paraphrased decision context, source URL, and evidence; no username or copied thread text.
- User value: preserve both chosen birthday admissions without adding a third block, protect the planned reset, and distinguish a harbor view from the advance-ticket and stair requirements of entering the Statue of Liberty crown.
- Link boundary: omit the Family Tripwise link. The answer can stand alone, and the visible community rules interface does not establish permission for self-promotional linking.
- Scope: one pending JSON-queue draft plus five durable state mirrors. No `site/**`, public page, external post, vote, message, account action, indexing request, outreach, new destination, or automation change.
- Measurement: user approve/revise/reject clarity in the localhost board; no volume, posting, vote, link, traffic, or ranking target.
- QA and review: 159/159 full tests and 10/10 focused tests pass with strict queue, state, freshness, local/production SEO, duplicate-key/ID, source, scope, privacy, no-site/no-workflow and whitespace checks. Hume's three cycle-one P2s were fixed; cycle two returned `PASS` with no P0-P3 findings.

### FT-DEV-005 - Add a local community-answer review board

- Selected: 2026-08-12 by explicit user instruction.
- State: completed and review-clean after Noether cycle-three `PASS` with no P0-P3 findings; local tooling only, so this is push-only with no Pages wait.
- Product: a dependency-free localhost review board backed by a validated JSON queue. It should show the source question, concise draft, evidence and freshness, permit answer edits and notes, and record `approved`, `revise`, or `rejected` decisions for later autopilot runs.
- Safety boundary: approval means wording accepted for a possible later posting action. It never posts, votes, messages, creates an account, or authorizes the autopilot to perform an external write.
- Evidence: fresh August 12 GSC is available but does not select or justify this user-directed workflow action.
- Scope: 12 repository paths covering policy, queue data, local tooling/tests, and durable state. No `site/**`, public URL, sitemap, indexability, deployment, external-account mutation, or recurring automation creation.
- QA and review: 159/159 full tests and 10/10 focused tests pass with state, freshness, local/production SEO, 30 snapshots, queue/JSON/link/privacy/scope/no-site/responsive/live-host/whitespace checks. Review cycles closed rebinding, public-data, chronology and Eastern-date findings; cycle three returned `PASS`.

### FT-OPS-003 - Enable the one-month independent Master autopilot

- Selected: 2026-08-12 by explicit user instruction.
- State: completed and review-clean after Turing cycle-two `PASS` with no P0-P3 findings; this operating-model action is push-only and changes no public page.
- Schedule: the existing paused `family-tripwise-operator-pilot` heartbeat is active on the permanent Master thread at 09:00 and 17:00 UTC, which is 05:00 and 13:00 America/New_York during the pilot, through the September 12 cutoff.
- Mission: improve existing pages, shared evidence products, discovery, trust, and real-user decision support. Run cadence is not a publishing quota and may produce a no-op.
- Evidence: fresh August 12 GSC finalized through August 10 shows 1,732 impressions, 6 clicks, aggregate position 63.9, 28 discovered pages, and 24 of 28 inspected URLs indexed. It supports monitoring and restraint, not an aggregate CTR diagnosis.
- New-page gate: current SERP-supported distinct job, material demand, no clean existing-URL fit, maintainable information gain, explicit roadmap eligibility, and required user approval.
- Community boundary: current public questions may inform research and source-linked drafts in the validated `backlog/community-answer-drafts.json` queue, with policy in `backlog/community-answer-drafts.md`; no autonomous posting, voting, messaging, account creation, impersonation, or promotional linking.
- Scope: operating model, runbook, queue, and state QA only. No `site/**`, sitemap, indexability, deployment, analytics, indexing request, outreach, external-account mutation, new URL, or second recurring automation.
- QA and review: 149/149 tests, focused operator-state tests 7/7, state/freshness/local and production SEO/snapshot/JSON/link/privacy/scope/whitespace QA pass. The cycle-one release-state-prefix P2 was fixed with an explicit allowlist and negative regression test; Turing cycle two returned `PASS`.

### FT-RES-015 - Diagnose the Las Vegas all-ages ranking opportunity

- Selected: 2026-08-02 by direct manual user instruction.
- State: completed and review-clean after Faraday cycle-two `PASS` with no P0-P3 findings; research only.
- Target: `https://familytripwise.com/things-to-do/las-vegas-with-kids.html`.
- Evidence: fresh August 2 public-safe GSC finalized through July 31; successful protected export run `30746285285` with 54 rows and 456 attributable impressions retained outside the public repository; three current live SERPs; seven representative ranking pages; every current section; prior Las Vegas personas; internal links; and the current authority sample.
- Result: 410 protected impressions (89.9%) use direct action/list wording and another 18 (3.9%) use place/visit wording; three representative SERPs strongly overlap. Keep one broad activity URL. The current page repeats the same 12 choices through an 11-column table, six details, five routes and three separate checks while leaving realistic family admission and current-check facts scattered or generic.
- Timing boundary: the July 31 crawl has zero finalized performance days after it. Do not call the July revision a ranking failure and do not run a title/CTR test at page-average position 60.69.
- Promoted action: `FT-AUTH-006`, subsequently selected by direct user instruction on August 3. Replace repeated layers with one source-dated cost-and-friction index for exactly the same 12 choices; add the existing family-hotel sibling to contextual routing.
- Boundary: no `site/**`, page edit, new URL, publication, indexing request, outreach, external-account mutation, deployment, destination expansion, or recurring automation.

### FT-AUTH-006 - Add the Las Vegas family activity cost-and-friction index

- State: released and production-verified at commit `6bc35d03ba413056cf3b9988bf449ae8972d4a57` through successful Pages run `30869031713` after Herschel cycle-two `PASS` with no P0-P3 findings.
- Target: the existing `https://familytripwise.com/things-to-do/las-vegas-with-kids.html` only.
- Product boundary: use exactly the current 12 choices. One validated embedded record set should power a compact visible index, ItemList data and optional client-side CSV with no separate public data URL.
- Decision fields: direct official source; a named two-adult/two-child admission-only estimate or `VARIABLE / VERIFY`; explicit exclusions; planning time; setting; Las Vegas zone; exact current-check friction; checked date; evidence class; confidence; unresolved unknowns.
- Consolidation rule: replace the old wide table, six detail cards, five route cards and three repeated checks. Keep filters, at most three starts, FAQ and cluster routes; add the existing named family-hotel route. Do not append another comparison layer or inflate the list.
- Measurement: preserve the August 2 public/protected baseline, verify product and technical invariants at release, and wait for a later crawl plus finalized post-release query evidence before interpreting movement. Do not create an observation task from calendar cadence.
- QA: 147/147 tests; operator-state QA; local and production-preflight SEO QA at 0 errors and 0 warnings; responsive desktop/mobile behavior; official-source boundaries; exact record alignment; duplicate-key JSON; privacy; exact scope; and whitespace checks pass.
- Boundary: unchanged title, H1, URL, canonical, indexability and sitemap count; no new URL, indexing request, outreach, paid placement, external-account mutation, destination expansion, or recurring automation.

### FT-EVAL-002 - Check San Diego lodging crawl and query interpretation

- State: completed and review-clean after Heisenberg cycle-two `PASS` with no P0-P3 findings.
- Targets: the existing San Diego stay-area and family-hotel URLs only.
- Evidence gate: a fresh public-safe snapshot, current URL Inspection for both pages, and protected page/query evidence aligned through a finalized date that includes the July 31 stay-area crawl.
- Question: is Google distinguishing area/neighborhood intent from named-hotel/resort intent, or is one URL receiving materially mixed queries that expose a page-role problem?
- Result: 323 of 386 attributable exported stay-area impressions (83.7%) use hotel/resort wording versus 30 (7.8%) area/base wording; 156 of 166 attributable hotel-page impressions (94.0%) use hotel/resort wording. Fifty-four normalized queries occur on both URLs. The current area-page title explicitly promises `Family Hotels`, while the hotel page itself has clean ownership.
- Decision: promote `FT-IMP-022` as one bounded role clarification. Do not call this a causal cannibalization result because the 28-day window contains only two dates beyond the July 31 stay-area crawl.
- QA: 147/147 tests; operator state, content freshness, local/production SEO, 23 public snapshots, protected aggregate reproduction, internal-link counts, duplicate-key JSON, local references, exact eight-path scope, no-site-diff, privacy and whitespace checks pass.
- Boundary: research/state only; no `site/**`, page edit, new URL, title test, indexing request, outreach, external-account mutation, destination expansion, or recurring automation.

### FT-IMP-022 - Clarify San Diego lodging URL ownership

- State: released and production-verified at commit `e5e41ecbd664220f4359140cfd639e4e2b7a186f` through run `30930924523` after Lovelace cycle-two `PASS` with no P0-P3 findings. The run wrapper is red because an unrelated transient 503 failed post-deploy verification and the one allowed retry hit a duplicate artifact; the live release marker, target invariants, and fresh production SEO QA pass.
- Target: the existing San Diego stay-area URL; the family-hotel URL remains the unchanged named-property destination.
- Product change: focus the stay-area title, H1 and description on choosing five bases; reframe exact-property checks as a second-step handoff; add one descriptive link to the 12-hotel page at that handoff.
- Result: the title and H1 now say `5 Areas Compared`; the description, hero and ItemList name reinforce the area decision; the booking heading makes the sequence explicit; and the next section links to the separate 12-hotel comparison. Non-visible FAQ schema was removed instead of adding another page section.
- Preserve: all five area comparisons, the family-constraint tool, useful booking checks, both canonical/indexable URLs and both sitemap entries.
- QA: 147/147 tests; operator-state, content-freshness, local and production-preflight SEO QA; 23 public snapshots; generator idempotence; focused role/invariant tests; unchanged hotel page; responsive desktop/mobile layout; comparison-tool behavior; duplicate-key JSON; exact ten-path scope; privacy and whitespace checks pass.
- Measurement: preserve the August 4 public/protected baseline and re-evaluate only after a later crawl and sufficient finalized post-crawl evidence. No ranking promise or calendar dispatch.
- Boundary: no hotel-page rewrite, hotel-profile duplication, merge, redirect, canonical change, noindex, new URL, indexing request, outreach, external-account mutation, destination expansion, or recurring automation.

### FT-RES-014 - Codify an opinionated evidence-led SEO doctrine

- Selected: 2026-08-01 by direct manual user instruction.
- State: completed and review-clean after Russell cycle-two `PASS` with no P0-P3 findings; research and strategy only.
- Scope: inspect current top/month and travel-relevant `r/Agentic_SEO` and `r/juststart` posts; credibility-rate claims; validate against official Google guidance and current project evidence; codify explicit publish, edit, CTR, authority, AI-use, and stop rules.
- Result: `strategy/seo-doctrine.md` is the binding decision doctrine, supported by a ten-case credibility-rated practitioner review and six current official Google sources. Practitioner cases remain qualitative and non-causal.
- Boundary: no `site/**`, page publication, new destination, indexing request, outreach, external-account mutation, deployment, or recurring automation.

### FT-AUTH-004 - Map San Diego backlink gaps and promote one existing-page authority action

- Selected: 2026-07-31 by direct manual user instruction.
- State: complete and review-clean; Schrodinger cycle-three `PASS`, no P0-P3.
- Scope: inspect current authenticated Semrush backlink evidence and public linking pages for La Jolla Mom, The Family Voyage, and representative independent San Diego competitors; distinguish meaningful editorial links, owned/commercial links, syndication, spam, and non-replicable authority.
- Existing-page boundary: select one current San Diego URL and one citation-worthy enhancement that can live on that URL. Do not create a new page or edit `site/**` in this research transaction.
- Prospect boundary: retain only relevant public organizations/pages with a specific citation rationale. Do not collect private contact data or send outreach.
- Measurement boundary: track legitimate relevant referring domains, follow links, referral visits, discovery/crawl changes, and aligned protected-query movement without promising rankings or treating third-party authority scores as Google metrics.
- Evidence classification: the July 28 GSC snapshot is a three-day-old authenticated API snapshot, reused only as directional context. Current Semrush and public-page evidence must be source-dated separately.
- Identifier note: `FT-AUTH-003` belonged only to an abandoned, uncommitted Atlas usefulness attempt and is intentionally not reused.
- Publication boundary: no live-page change, new URL, sitemap/indexability change, deployment, indexing request, outreach, prospect contact, paid link, directory submission, external-account mutation beyond read-only research, or recurring automation.
- Review-clean result: all 11 Semrush-detected Family Tripwise referring domains are low-authority nofollow SEO spam; links outside Semrush remain unknown. La Jolla Mom's exact hotel page has 29 referring domains, 18 at AS 0-10; The Family Voyage's exact San Diego guide has six referring domains and ten follow links. The durable competitor edge is a small relevant editorial/peer/media/industry layer on mature topical domains.
- Promoted action: `FT-AUTH-005` / `IMP-042`, ready only after explicit user approval. The selected existing URL is the all-ages San Diego activity hub because a maintained source-dated logistics index has a clearer citation use than another commercial hotel-list enhancement.

### FT-RES-013 - Define the research-authority thesis and August depth cycle

- Selected: 2026-08-01 by direct manual user instruction.
- State: completed and review-clean on 2026-08-01; Bohr cycle-two `PASS` with no P0-P3.
- Scope: reconcile the canonical strategy and reusable plans around maintained online evidence, information gain, fast constraint routing, realistic ranking timelines, and an August existing-city depth cycle.
- Evidence: fresh July 31 GSC baseline; current official Google guidance; first-party Ahrefs and Semrush datasets; current/recent `r/Agentic_SEO` and `r/juststart` case histories used qualitatively with explicit credibility limits.
- City stance: San Diego is primary; Las Vegas and Chicago are secondary existing-page candidates; New York City and San Antonio remain maintain-and-observe; Orlando publication is held during the August cycle.
- Boundary: no `site/**`, new URL, indexing request, outreach, prospect contact, external-account mutation, deployment, or recurring automation.
- QA: 142/142 tests; operator-state, freshness, local and production SEO QA; duplicate-key JSON, exact 15-path scope, Markdown links, source/privacy, no-site, and whitespace checks pass.

### FT-AUTH-005 - Add a source-dated San Diego family attraction logistics index

- State: released and production-verified on 2026-07-31; Aquinas cycle-two `PASS_WITH_P3`, no P0-P2.
- Release: commit `e7c40ff4e770a2c94c6ed298808775c1ac9c9762`; successful Pages run `30667262994`; release marker, target 200 response, action invariants, and production SEO QA passed.
- Target: `https://familytripwise.com/things-to-do/san-diego-with-kids.html`.
- Scope: use exactly the 12 current activity choices to generate one current official-source-backed logistics record set, one compact responsive table, and one client-side CSV or JSON download from the embedded page data, with no separate data URL.
- Usefulness boundary: consolidate overlapping comparison material rather than stacking another long section. Keep estimates, confidence, freshness, and unknowns visible.
- Trust boundary: do not infer safety, exact stroller/route practicality, sensory suitability, exact wait/drive/walk time, universal family fit, or firsthand experience.
- URL boundary: do not add another canonical/indexable HTML page, filtered URL, destination, or sitemap entry.
- Release gate result: focused/full/state/SEO/source/privacy/responsive/idempotency QA, independent review, exact-path commit, deployment, and production invariants passed.
- Outreach gate: implementation contains no outreach. After production verification, a named first wave of at most six prospects requires a second explicit user approval before contact.
- Indexing audit: fresh July 31 GSC reports the all-ages and teen URLs unknown to Google, while public preflight and repository checks show 200 responses, self-canonicals, indexable markup, sitemap inclusion, and internal links. Audit both for a concrete technical defect; do not request indexing or edit the teen page speculatively.
- Audit result: no technical exclusion or rendering defect was found. The all-ages page keeps its canonical/indexable state and the teen page remains unchanged; discovery and authority remain the evidence-backed limitation.
- Cycle-one remediation: the mobile table now keeps `Choice` visible while horizontally scrolled; setting is consistently labeled as an estimate in evidence, visible content, and schema; the shared CSV serializer is executed in native tests; console reporting is narrowed to implementation-origin errors.
- Re-review QA: focused tests 10/10 and full tests 142/142 pass; operator-state, duplicate-key-safe roadmap JSON, local SEO, responsive/sticky-column layout, embedded-data parity, schema, source/privacy/exact-scope, idempotency, and whitespace checks pass.
- Remaining P3: the native visible-row assertion is not perfectly isolated from embedded JSON, although independent browser parity verified every visible row exactly. This is accepted non-blocking test debt under the release policy.

### FT-RES-012 - Build the existing-page protected GSC ranking opportunity map

- Selected: 2026-07-29 by direct manual user instruction.
- State: completed and review-clean.
- Scope: use the latest public-safe GSC snapshot, URL Inspection, protected page-query evidence, internal-link support, current page roles, and authority evidence to classify every existing canonical/indexable page.
- Privacy boundary: complete query rows remain outside this public repository; only aggregated, thresholded, public-safe conclusions may be committed.
- Decision boundary: separate indexing-first, insufficient-evidence, query-refinement, CTR/snippet, authority-led, and keep/observe cases. Page-level average position is not a query rank.
- Publication boundary: research only; no `site/**`, sitemap, indexing request, deploy, external-account change beyond the approved read-only export workflow, outreach, or recurring automation.
- Success: promote exactly one bounded existing-page follow-on if the evidence supports one; otherwise record that no page is eligible.

- Result: all 28 pages classified. The protected export contains 940 impressions: no exported page-query row has a period-average position of 20 or better; 74 impressions are attached to rows averaging positions 21-40 and 866 to rows averaging worse than 40. No CTR or clean page-rewrite action is eligible.
- Crawl result: eight URLs are not indexed, and almost every page with query evidence was last crawled before its current reviewed release.
- Role result: hotel intent currently lands on several stay-area pages while newer hotel siblings are unindexed or newly crawled; NYC itinerary intent spills into all-ages while the itinerary is unknown.
- Authority result: current central evidence reports Authority Score 0, three spam referring domains, and zero follow links.
- Promoted action at `FT-RES-012` completion: `FT-AUTH-002` / `SRR-036`; it was later selected by direct user instruction. No publication or outreach authority is implied.
- QA/review: full repository tests pass 137/137; GSC tests pass 16/16; Atlas tests pass 5/5; operator-state, content-freshness, duplicate-key-safe JSON, local and production SEO QA, privacy, exact-scope, no-site, and whitespace checks pass. Mendel returned `FAIL` for three P2 precision/state findings in cycle one; after correction, cycle two returned `PASS` with no P0-P3 findings.

### FT-AUTH-002 - Complete San Diego Reset Atlas real-record and parent-test evidence

- Selected: 2026-07-29 by direct manual user instruction.
- State: completed and review-clean on 2026-07-29.
- Basis: `FT-AUTH-001`, `FT-RES-003`, and `FT-DEV-003` already provide a review-clean asset plan, 13-anchor source/license audit, and accessible synthetic prototype.
- Scope: build at least 30 real source-backed candidate records for the exact 13 anchors, preserve provenance/freshness/confidence/human-review/license fields, and prepare three representative planning tasks for independent completion by two parents.
- Trust boundary: unsupported route, stroller, sensory, quiet, safety, caregiver-facility, and family-suitability conclusions remain `UNKNOWN`.
- Publication boundary: keep outside `site/**`; no deploy, indexing request, outreach, prospect contact, external-account mutation, or recurring automation.
- Stop rule: do not promote publication unless source coverage, licensing, trust boundaries, deterministic validation, accessibility, and real parent usability gates pass.
- Candidate result: 39 original-paraphrase records provide exactly 3 records for each of the 13 anchors and cite 19 current official first-party or government URLs.
- State result: all 39 coordinate pairs are null and `UNKNOWN`; all 273 trust-sensitive states are `UNKNOWN`; all 39 records are `internal-research-only`.
- Human gate: three representative planning tasks are ready for separate completion by Parent A and Parent B. No agent test result exists or counts as parent evidence.
- Release result: no `site/**`, sitemap, deployment, indexing, outreach, account, public download, or recurring-automation change.
- Evidence: `docs/research/san-diego-reset-atlas-publication-evidence.md`, refreshed source/reuse audit, and the `noindex` prototype.
- Review cycle one: Wegener returned `FAIL` with four P2 findings. Corrections add the exact Fleet Accessibility Mornings source, field-specific durable human-review evidence, structured-reuse evidence, coordinate bounds and provenance enforcement, adversarial tests, and current-state reconciliation.
- Review cycle two: Wegener returned `FAIL` with two P2 findings and one P3. Final corrections add an intentionally empty approved-evidence registry, exact repository-heading reference checks, agent/simulation and placeholder rejection, exact calendar validation, and complete singular labels.
- Final correction QA: 137/137 native tests and 10/10 Atlas tests pass; content freshness and operator-state QA pass; local and production SEO QA report 0 errors and 0 warnings; 19/19 sources return HTTP 200; browser checks at 1440/390/320, privacy, duplicate-key, exact-scope, no-production-path, and whitespace checks pass.
- Review cycle three: Wegener (`019fadac-19df-7ec1-ad4f-6028526cefe0`) returned `PASS` with no P0-P3 findings across the complete 15-path diff.

### FT-RES-011 - Select and research the next family destination cluster

- Selected: 2026-07-28 by direct manual user instruction after `FT-DEV-004`.
- State: completed and review-clean.
- Scope: compare the strongest remaining US-market destination candidates, select one from current evidence, then define its query clusters, representative ranking-page gaps, research-hypothesis personas, page architecture, and exactly one next action.
- Evidence boundary: July 28 GSC is fresh context for existing-site discovery but cannot measure an unpublished city. Current logged-in Semrush and observed public SERPs provide demand and overlap evidence.
- Publication boundary: research only; no `site/**`, destination publication, sitemap/indexing change, external-account mutation, outreach, or recurring automation.
- Result: selected Orlando over Miami, Dallas, Nashville, and Washington, DC. Broad activity wording variants share seven retained exact URLs; family hotel/best-hotel and hotel/resort sets also overlap strongly. Free/budget has 720/KD 17 and a more distinct cost-first result set, while toddler and teen exact demand is 70 and 40.
- Architecture: build one all-ages decision hub first; research one combined hotel/resort comparison next; preserve free/budget as a credible later page; defer a separate stay-area page and Disney-specific URLs.
- Promoted action: `FT-PUB-006` / `IMP-041` / `SRR-034`, ready only after explicit user approval.
- Review: Pasteur cycle one returned `FAIL` for two P2 traceability/state findings and one P3 overlap-wording finding. After correction, cycle two returned `PASS` with no P0-P3 findings.

### FT-PUB-006 - Research and publish the Orlando all-ages family activity hub

- State: ready pending explicit user approval; not selected.
- Target: `https://familytripwise.com/things-to-do/orlando-with-kids.html`.
- Product: one compact park/non-park day decision hub with useful visible defaults for six persona hypotheses, plus free/budget, younger-child, mixed-age/teen, and indoor/heat routes.
- Research gate: refresh current result sets, ranking pages, direct sources, at least 25 candidate roles, and every planned section before writing.
- Publication boundary: exactly one canonical/indexable Orlando URL and one sitemap entry; no hotel, stay, itinerary, free, toddler, teen, or Disney-specific sibling page.
- Trust boundary: no unsupported firsthand, exact route/wait, stroller/accessibility, safety, water, stable price/hour, height eligibility, weather, or universal family-fit claim.
- External boundary: no indexing request, affiliate CTA, booking action, account mutation, outreach, or recurring automation.

### FT-DEV-004 - Modularize static page generation without output changes

- Selected: 2026-07-28 by direct manual user instruction.
- State: completed and review-clean after Noether cycle-two `PASS`.
- Scope: split city data, family-hotel page specifications, priority-page data, and upgrade logic into explicit modules while keeping `tools/generate-pages.mjs` and `tools/upgrade-priority-pages.mjs` compatible.
- Boundary: no intentional `site/**` change and no city research or content implementation in this transaction.
- Acceptance: byte-identical full generation, idempotence, focused target isolation, full native QA, and independent read-only review.
- Result: all 38 tracked public files remain byte-identical; focused tests pass 2/2, the full suite passes 137/137, and native state/freshness/SEO QA is green.
- Review: Noether found one stale city-pause sentence in cycle 1; after correction, cycle 2 returned `PASS` with no P0-P3 findings.
- Product follow-on: the separately registered `FT-RES-011` used current evidence after this refactor and selected Orlando.

### FT-OPS-002 - Reconcile operating guidance and harden dated-content freshness

- Selected: 2026-07-28 by direct manual user instruction after a read-only repository audit.
- State: released and production-verified at commit `f814b27482eff9e22b24d21ae267c4ea36e2a9e0` through Pages run `30359879823`.
- Evidence: fresh authenticated read-only GSC snapshot collected July 28 with finalized performance through July 26; used only for current status overlays.
- Scope: align current ownership and archive labels, reconcile the five city-status monitoring overlays and stale backlog labels, remove the expired July 21-26 San Diego museum-closure notice, and make native SEO QA reject expired operational notices.
- Boundary: one existing public page may change only to remove the expired notice and update its visible page date. No new URL, destination research, sitemap/indexing change, external-account mutation, outreach, or recurring automation.
- QA/review: focused tests 12/12, full suite 135/135, 16 public snapshots valid, content-freshness/operator-state/local and production SEO QA green, exact-scope/privacy/JSON/link/generation checks green; both final independent verdicts are `PASS` with no P0-P3 findings.
- Separate technical action: `IMP-030` / `FT-DEV-004` is completed and review-clean.

### FT-IMP-017 - Review and improve the New York City family itinerary

- Selected: 2026-07-26 by direct manual user instruction to continue to the final NYC page.
- State: released and production-verified on 2026-07-26 at commit `d0c4a7dc565dea809d4d2b12caa4033b40cafe22`; GitHub Pages run `30204670128` succeeded.
- Target: `https://familytripwise.com/family-itinerary/new-york-city-with-kids.html`.
- Demand and evidence: logged-in Semrush exact variants collected July 24 show 30 and 10 searches/month and overlap. The fresh July 26 GSC snapshot, finalized through July 24, has no itinerary performance row; URL Inspection says the page is not indexed.
- Product requirement: inspect current itinerary SERPs and representative ranking pages, apply NYC-P1 through NYC-P5, and audit every visible section. Replace repeated summaries with concrete one-, two-, and three-day plans, useful pivots, stop rules, and routes to all four released NYC cluster pages.
- Local result: three trip-length starts, three executable day-plan cards, five persona/constraint pivots, four stop rules, four cluster routes, three visible/schema-aligned FAQs, current official checks, and an optimized dimensioned public-domain image.
- QA: focused tests 4/4 and full repository tests 105/105 pass; operator-state QA and local SEO QA pass with 0 errors and 0 warnings; target-only generation and 1280/390/320 responsive checks pass.
- Review: Lagrange (`019f9ea5-2520-7540-91c7-ce5a5ce30360`) returned `PASS_WITH_P3` in cycle 1 with no P0-P2 findings. The P3 records representative rather than complete duration-query SERP evidence; numeric overlap remains `UNKNOWN`.
- Release: the release marker matched the commit/run; the canonical/indexable page retained three starts, three day plans, five pivots, four stop rules, four cluster routes, three visible/schema-aligned FAQs, and one sitemap entry; production SEO QA returned 0 errors and 0 warnings.
- Maximum scope: one durable itinerary review, the existing shared page upgrader, one focused test, the existing itinerary HTML, NYC status, both backlogs, and operator records.
- Boundary: preserve URL/canonical/indexability/sitemap; do not edit sibling pages, request indexing, create a URL, add an affiliate CTA, mutate an external account, send outreach, start San Antonio, or add recurring automation.

### FT-RES-010 - Create the San Antonio cluster SERP-overlap and persona decision pack

- Selected: 2026-07-26 by direct manual user instruction to proceed to San Antonio.
- State: complete and review-clean; exact-path research-only push remains in this transaction.
- Scope: inspect all four existing canonical/indexable San Antonio pages, current keyword families, observed SERP overlap, representative ranking pages, qualitative parent/community constraints, persona hypotheses, every visible section, page boundaries, and internal-link gaps.
- GSC: fresh authenticated read-only API evidence collected July 26 and finalized through July 24. The four page rows total 105 impressions and 0 clicks; this is sparse page-level discovery context, not query rank or causal evidence.
- Result: five core page roles, five persona hypotheses, every-section audits for all four current pages, high-confidence all-ages and hotel overlap decisions, calibrated unknown overlap elsewhere, one future hotel-page role, and no separate toddler, indoor, resort, pool, duration, or static-weekend URL.
- Promoted action: `FT-IMP-018` / `IMP-036`, improve the existing all-ages page first.
- QA: 105/105 tests, operator-state QA, SEO QA at 0 errors/0 warnings, duplicate-key-safe roadmap JSON, focused consistency/source/scope checks, and whitespace checks pass.
- Review: Goodall (`019f9ec6-b438-7d33-9c60-658a5706ac29`) returned `PASS` in cycle 2 with no P0-P3 findings after closing the SERP-intersection, persona-traceability, source-link, and audit-count findings.
- Maximum paths: the San Antonio research pack and status file, NYC status release reconciliation, both backlogs, and four operator-state files.
- Boundary: research only. Do not edit `site/**`, publish a page, request indexing, mutate an external account, send outreach, start a San Antonio implementation, add a destination, or create recurring automation.
- Artifacts: `docs/research/san-antonio-family-cluster-decision-pack.md` and `status/san-antonio-pages.md`.
- Release gate: native/focused research consistency, links/source/privacy/scope checks, roadmap JSON, independent reviewer `PASS` or `PASS_WITH_P3`, then exact-path push-only commit.

### FT-IMP-018 - Improve the San Antonio all-ages things-to-do hub

- Selected: 2026-07-26 by direct manual user instruction.
- State: released and production-verified on 2026-07-26 at commit `27168d5d7ec472ba8f08b9e7d56e79607da03b2e`; GitHub Pages run `30207559125` succeeded.
- Target: `https://familytripwise.com/things-to-do/san-antonio-with-kids.html`.
- Demand: exact measured phrases show 5,400 searches/month at KD 19, 1,600 at KD 20, and 880 at KD 21. Variants overlap and are not summed.
- Baseline: 11 impressions, 0 clicks, and page-level average position 64.36 in the fresh July 26 GSC snapshot.
- Product requirement: review at least 18 candidate roles; retain roughly 10-14 earned choices; apply `SA-P1` through `SA-P5`; replace repeated six-choice layers with five conditional starts, one filterable comparison, useful younger-child/heat/indoor/free/budget/teen/theme-park routing, bounded high-friction notes, current official checks, and cluster routes.
- Local result: 23 candidates reviewed, 13 retained choices, seven filters, five conditional starts, one eight-field comparison, six compact high-friction notes, four official-check groups, three cluster routes, three visible/schema-aligned FAQs, current sources, and a dimensioned licensed image. The duplicate mini-itinerary layer is removed.
- QA: focused tests pass 5/5 and full repository tests pass 110/110; operator-state and local SEO QA pass; target-only generation, 1280/390/320 responsive containment, sticky first-column behavior, useful filter counts, image decode, 16/16 source reachability, schema/FAQ, duplicate-key-safe roadmap JSON, privacy/scope, and whitespace checks pass.
- Review: Pasteur (`019f9eeb-de35-7261-839b-43bd97d42174`) cycle one returned `FAIL` for two P2 findings: mobile row identity and missing direct 35-minute/Junior Ranger sources. Both P2s and the two P3 wording/filter findings were corrected; cycle two returned `PASS` with no P0-P3 findings.
- Release: `https://familytripwise.com/release.json` reported the exact commit/run; the canonical/indexable 13-choice page, seven filters, sticky comparison, FAQ/schema alignment, image, cluster links, and direct-source corrections were verified in production; production SEO QA returned 0 errors and 0 warnings.
- Boundary: one existing URL only. No sibling-page content edit, sitemap change, new URL, indexing request, external-account mutation, affiliate CTA, outreach, hotel publication, or recurring automation.
- Release gate: durable candidate/every-section/source review, focused/native/responsive/source/privacy/scope QA, target-only generation, and independent reviewer `PASS` or `PASS_WITH_P3`.

### FT-PUB-005 - Research and publish the San Antonio family-hotel comparison

- Selected: 2026-07-26 by direct manual user instruction after the all-ages release.
- State: released and production-verified on 2026-07-27 at commit `4617ec82a87ae383eafdf9b01ecdf7f2d424063e`; GitHub Pages run `30226920951` succeeded.
- Target: `https://familytripwise.com/where-to-stay/san-antonio-family-hotels.html`.
- Demand: exact measured phrases show 170, 140, and 110 searches/month. Resort, pool, and lazy-river variants overlap and must not be summed as unique traffic.
- Baseline: the proposed URL has no GSC row because it does not exist; the existing San Antonio stay page has 85 impressions at page-level average position 80.14 in the fresh July 26 snapshot.
- Product requirement: review at least 18 candidate properties and retain roughly 10-12 earned choices with current official facts, broad total-night planning ranges, sampled recent online-review themes/conflicts, freshness, direct maps, decisive parent checks, and `SA-P2` through `SA-P4` routing.
- Local result: 22 candidates reviewed, 12 retained, six trip-style starts, one sticky mobile comparison with profile jumps, 12 expandable property profiles, 24 clearly named hotel/family-anchor map links, three visible/schema-aligned FAQs, and routes from home and the existing stay-area guide. The activity, teen, and itinerary pages remain unchanged.
- Review: cycle one found four P2 findings covering mobile profile density, the 821px card/fact layout, stale lower `current-cycle.md` instructions, and three missing exact price-source URLs. The correction pass added expandable one-column profiles, explicit table jumps and map labels, shorter comparison checks, reconciled state, exact price URLs, and compact source records for all 10 deferrals. In cycle two, Averroes (`019fa0c8-ae15-7003-9f6e-a55c08018e44`) returned `PASS` with no P0-P3, while Dirac (`019fa0c8-e315-79c0-885a-a540adbec672`) returned `PASS_WITH_P3` with no P0-P2. Residual P3s: mobile table headers do not remain visible through the long table, and desktop/tablet profile jumps can sit beneath the sticky site header.
- QA before review: focused tests pass 4/4; full repository tests pass 114/114; operator-state and local SEO QA pass with 0 errors and 0 warnings; duplicate-key-safe roadmap JSON, idempotent generation, 1280/390/320 responsive containment, sticky mobile row identity, image decode, privacy, scope, and whitespace checks pass. Brand source probes returned successful pages or expected bot-limited 403/429 responses, with no unresolved source-not-found result.
- Release: `https://familytripwise.com/release.json` reported the exact commit/run; the canonical/indexable 12-property page, 24 maps, visible/schema FAQs, home/stay routes, and one sitemap entry passed action-specific production checks; production SEO QA returned 0 errors and 0 warnings.
- Boundary: one new indexable URL; home and the existing stay guide may receive only the links needed to route to it. Do not edit activity, teen, or itinerary pages; create variant hotel URLs; request indexing; add an affiliate CTA; mutate an external account; send outreach; or create recurring automation.
- Release gate: durable candidate/official-fact/price/review/conflict evidence, focused/native/responsive/source/privacy/scope QA, idempotent generation, and independent reviewer `PASS` or `PASS_WITH_P3`.

### FT-IMP-019 - Simplify and improve the San Antonio stay-area guide

- Selected: 2026-07-26 by direct manual user instruction after the hotel comparison released.
- State: completed, released, and production-verified at commit `7f54f230a859d61a41d0eb9a60781f037d88947f` through Pages run `30234700209`.
- Target: `https://familytripwise.com/where-to-stay/san-antonio-with-kids.html`.
- Demand: generic exact phrases show 590 and 140 searches/month; family-specific variants show 10-20. Variants overlap and generic results include residential-neighborhood intent.
- Baseline: 85 impressions, 0 clicks, and page-level average position 80.14 in the fresh July 26 GSC snapshot.
- Product requirement: keep one five-base visitor guide, replace universal “best” language and duplicate sections with five conditional starts, one route/reset/transport matrix, three decisive checks, current direct sources, visible/schema-aligned FAQs, and a clear route to the 12-hotel comparison.
- Local result: five conditional starts; one five-row/seven-field comparison with sticky mobile row identity; three decisive checks; four cluster routes; three visible/schema-aligned FAQs; current area, VIA, River Walk access, attraction, and photo sources; and a direct handoff to the released 12-hotel page. The airport default is deferred and SeaWorld is separated from La Cantera/Six Flags.
- Release result: `release.json` matched the commit/run, the production page matched the committed artifact exactly, action-specific invariants passed, and production SEO QA returned 0 errors and 0 warnings.

### FT-IMP-020 - Improve the San Antonio teen activity specialist

- Selected: 2026-07-27 by direct manual user instruction to finish the San Antonio cluster without waiting for check-ins.
- State: released and production-verified on 2026-07-27 at commit `e071a60c66729b61137113a96ade116969fe3532`; GitHub Pages run `30236032473` succeeded.
- Target: `https://familytripwise.com/things-to-do/san-antonio-with-teens.html`.
- Demand: exact Semrush phrases show 140 searches/month for `things to do in san antonio with teens` and 70 for `san antonio with teens`; variants overlap.
- Baseline: 3 impressions, 0 clicks, and page-level average position 9.00 in the fresh July 26 GSC snapshot. This is too sparse to call a stable top-10 result.
- Product requirement: keep one teen specialist, replace repetitive generic lists with 10 distinct teen-weighted choices, five interest-led starts, one decision table, selective high-friction detail, bounded routes, current official checks, and clear mixed-age and cluster handoffs.
- Local result: five teen-led starts; one 10-row/seven-field comparison with sticky mobile activity identity; five selective high-friction details; three bounded routes; four current-check groups; four cluster routes; three visible/schema-aligned FAQs; 22 current official/licensing sources; and a dimensioned licensed image.
- QA: focused tests pass 5/5, full repository tests pass 123/123, local SEO QA returns 0 errors and 0 warnings, 21 source URLs return 200 directly while Pearl's exact official page is current in search after one local timeout, and responsive checks pass at 1280/821/390/320 pixels.
- Review: Franklin (`019fa1ad-674c-79d2-9d58-66b918f78f32`) returned `FAIL` in cycle one for three P2 findings covering query-to-URL traceability, direct GO RIO/Six Flags source support, and stale/copy-pasted state mirrors. All three were corrected. Cycle two returned `PASS` with no P0-P3 findings.
- Release result: `release.json` matched the commit/run, production matched the committed artifact exactly, action-specific invariants passed, and production SEO QA returned 0 errors and 0 warnings.
- Boundary: one existing URL only. No sibling page or sitemap edit, new URL, indexing request, external-account mutation, outreach, or recurring automation.
- Release gate: durable SERP/ranking-page/persona/every-section/source review, focused/native/responsive/source/privacy/scope QA, target-only idempotent generation, and independent reviewer `PASS` or `PASS_WITH_P3`.

### FT-IMP-021 - Review and improve the San Antonio family itinerary

- Selected: 2026-07-27 under the user's direct manual instruction to finish the San Antonio cluster without waiting for check-ins.
- State: completed, released, and production-verified.
- Target: `https://familytripwise.com/family-itinerary/san-antonio-with-kids.html`.
- Demand: the generic exact itinerary phrase is estimated at 260 searches/month and the 3-day phrase at 40; exact family itinerary seeds displayed 0. These overlapping estimates are directional, not unique traffic.
- Baseline: 6 impressions, 0 clicks, and page-level average position 27.17 in the fresh July 26 GSC snapshot. This is too sparse for a query-rank or causal conclusion.
- Product requirement: use executable one-, two-, and three-day route shapes, age/heat/weather/base pivots, explicit deletion rules, current checks, and handoffs to all four released San Antonio planning roles without repeating the activity inventory.
- Local result: three trip-length starts; three executable day-plan cards; five constraint pivots; four stop rules; four cluster routes; three visible/schema-aligned FAQs; 17 current official/licensing sources; and a dimensioned licensed image.
- Review: Einstein (`019fa1c7-1bb6-7e71-8d60-2195fc698e63`) completed three cycles. Cycle one found four P2 traceability/state/accessibility/source issues; cycle two found one deeper stale-state P2; all P2s were corrected. Final verdict is `PASS_WITH_P3` with no P0-P2 findings.
- Post-correction QA: focused tests pass 4/4 and the full repository suite passes 127/127; operator-state and local SEO QA pass with 0 errors and 0 warnings; all 17 source URLs return 200; keyboard scrolling, responsive/table/image checks, duplicate-key-safe JSON, idempotent generation, privacy, exact scope, and whitespace checks pass.
- Release: commit `90ed019ea83b1ed242b0e545d3efc9b5215db40f` deployed successfully through Pages run `30237864556`; release marker, exact production artifact, action invariants, and production SEO QA passed.
- Boundary: one existing URL only. No sibling page or sitemap edit, new URL, indexing request, external-account mutation, outreach, or recurring automation.

### FT-RES-009 - New York City SERP-overlap cluster and persona decision pack

- Selected: 2026-07-24 by direct manual user instruction to begin NYC pages.
- State: completed and review-clean; independent reviewer Einstein returned `PASS` in cycle 3 with no P0-P3 findings.
- Scope: current NYC query universe, logged-in Semrush US demand/KD, observed ranking-page overlap, representative competitor/community analysis, five persona hypotheses, every-section audit of all three current NYC pages, five-page architecture, and one promoted implementation.
- GSC: fresh July 24 API evidence finalized through July 22. Things to do has 55 impressions at page-level average position 43.98; stay has 47 at 50.06; itinerary has no page row and URL Inspection says unknown to Google. These are not query ranks or causal evidence.
- Architecture: keep the three existing pages; add one future named-property family-hotel comparison and one future teen/tween specialist. Toddler, free, indoor, pool, suite, family-of-five, stroller, and no-car constraints remain modules/fields first. Weekend/today remains deferred.
- Boundary: no `site/**`, sitemap, publication, indexing request, external-account mutation, affiliate CTA, outreach, deployment, or recurring automation.
- Promoted action: `FT-IMP-014` / `IMP-031`, improve the existing all-ages page first.
- Artifacts: `docs/research/new-york-city-family-cluster-decision-pack.md` and `status/new-york-city-pages.md`.
- Release gate: native/focused research consistency, links/source/privacy/scope checks, roadmap JSON, independent reviewer `PASS` or `PASS_WITH_P3`, then exact-path push-only commit.

### FT-IMP-014 - Improve the New York City all-ages things-to-do hub

- State: released and production-verified on 2026-07-25 at commit `1437affd20914a7bf3fbdc5ae0097371d3fb96c1`; GitHub Pages run `30172548240` succeeded.
- Target: `https://familytripwise.com/things-to-do/new-york-city-with-kids.html`.
- Demand: exact measured phrases show 480 searches/month at KD 25, 390 at KD 22, and 320 at KD 21. Related variants overlap and are not summed as unique traffic.
- Baseline: 55 impressions, 0 clicks, page-level average position 43.98 in the July 24 snapshot.
- Product requirement: replace repeated six-choice layers with one filterable scan surface, roughly 10-14 earned options, five conditional trip starts, strong younger-child/free/weather support, and deep notes only for high-friction choices.
- Local result: 12 distinct choices, five conditional trip starts, one complete comparison table, six high-friction notes, four official checks, and three visible/schema-aligned FAQs; no sibling page, stylesheet, sitemap, or URL changed.
- QA: native tests 87/87, operator-state QA, SEO QA 0/0, target-only regeneration, responsive browser checks at 1280px/390px/320px, filter behavior, source/privacy/scope, roadmap JSON, and whitespace checks pass.
- Review: Huygens returned final `PASS_WITH_P3` in cycle 3 with no P0-P2 findings after the media-performance and NYSCI teen-routing P2s were closed. One non-blocking P3 remains for an older-start test selector.
- Release: `https://familytripwise.com/release.json` reported the exact commit; the canonical/indexable 12-choice page, six filters, comparison, FAQ/schema alignment, optimized image, cluster links, and NYSCI tag correction were verified in production; production SEO QA returned 0 errors and 0 warnings.
- Boundary: preserve URL/canonical/indexability/sitemap; do not duplicate future teen, hotel, stay, or itinerary jobs; do not create a URL or request indexing.
- Release gate: page-specific candidate/every-section/source review, focused/native/responsive/source/privacy/scope QA, target-only idempotent generation, and independent reviewer `PASS` or `PASS_WITH_P3`.

### FT-PUB-004 - Research and publish the New York City family-hotel comparison

- Selected: 2026-07-25 by direct manual user instruction.
- State: completed, released, and production-verified.
- Target: `https://familytripwise.com/where-to-stay/new-york-city-family-hotels.html`.
- Demand: exact measured phrases show 390 searches/month at KD 29, 390 at KD 20, and 260 at KD 24. Related variants overlap and are not summed as unique traffic.
- Product requirement: one clean named-property comparison built from an 18-25 candidate pool, official facts, broad total-night ranges, bounded recent online-review observations/conflicts, direct map links, and trip-style routing.
- Local result: 22 candidates reviewed, 12 retained, six trip-style starts, one complete comparison, 12 property cards, direct map links, three visible/schema-aligned FAQs, and internal routes from home and the existing stay-area guide.
- QA: full repository tests pass 91/91; operator-state QA passes; SEO QA reports 0 errors and 0 warnings; focused, responsive, image, source, privacy, scope, roadmap JSON, activity-page non-change, and whitespace checks pass.
- Review: Kepler (`019f9c21-7769-7561-bb6f-170bfc41ab35`) returned `PASS_WITH_P3` in cycle 2 with no P0-P2 findings. One non-blocking P3 remains for high-density mobile selection of the 1200px image candidate.
- Release: commit `57d765f4fb488b5f8f077a6cddc9023901b3b4bf`; Pages run `30184040925`; release marker matched; the canonical/indexable NYC hotel page, 12 hotel cards, 24 Google Maps links, and one sitemap entry passed production verification; production SEO QA reported 0 errors and 0 warnings.
- Boundary: one new URL only; the existing stay page retains area/base intent. No booking transaction, indexing request, affiliate CTA, external-account mutation, outreach, or recurring automation.
- Release gate: durable evidence pack, focused/native/responsive/source/privacy/scope QA, target-only generation, and independent reviewer `PASS` or `PASS_WITH_P3`.

### FT-IMP-015 - Research and publish the New York City teen/tween activity specialist

- Selected: 2026-07-26 by direct manual user instruction.
- State: released and production-verified on 2026-07-26 at commit `77e6cb9322da34ffc13daf84b0851e83773cc382`; GitHub Pages run `30198727075` succeeded.
- Target: `https://familytripwise.com/things-to-do/new-york-city-with-teens.html`.
- Demand: exact measured phrases show 590, 480, and 170 searches/month at KD 11, 10, and 13. Related variants overlap and are not summed as unique traffic.
- Product requirement: one calm teen-choice page built from a broad candidate set, current official facts, distinct teen reasons, one complete comparison, bounded high-friction notes, route shapes, mixed-age handling, cluster links, and visible/schema-aligned FAQs.
- Local result: 20 candidate roles reviewed, 10 retained, five teen-led starts, one 10-row comparison, five high-friction notes, three bounded route shapes, four current-check groups, four cluster routes, and three visible/schema-aligned FAQs. Home and the all-ages page route to the specialist.
- QA: focused tests 6/6 and full repository tests 97/97 pass; operator-state QA and local SEO QA pass with 0 errors and 0 warnings; desktop/mobile rendering, horizontal containment, target-only regeneration, schema, source/privacy/scope, duplicate-key-safe roadmap JSON, and whitespace checks pass.
- Review: Curie (`019f9dfa-f5ce-72f3-bad3-63e0fbef84d7`) returned `PASS_WITH_P3` in cycle 2. The P2 empty compact-detail pairing defect is fixed and regression-tested; no P0-P2 remains. One non-blocking P3 remains for the generic but licensed, optimized, and responsive Central Park hero.
- Boundary: one new URL only; the existing all-ages page retains mixed-age inventory. No indexing request, affiliate CTA, external-account mutation, outreach, another publication, or recurring automation.
- Release: the release marker matched; the canonical/indexable page retained 10 choices and its expected internal routes, one sitemap entry remained, and production SEO QA reported 0 errors and 0 warnings.

### FT-IMP-016 - Simplify and improve the New York City stay-area guide

- Selected: 2026-07-26 by direct manual user instruction to continue to the next NYC page.
- State: released and production-verified on 2026-07-26 at commit `cd10933489ddf8e6c37780e5c0f20dfa740d60c2`; GitHub Pages run `30199465923` succeeded.
- Target: `https://familytripwise.com/where-to-stay/new-york-city-with-kids.html`.
- Evidence: the fresh July 25 GSC snapshot, finalized through July 23, records 49 impressions at page-level average position 49.73. This is directional discovery evidence, not a query rank or causal result.
- Product requirement: preserve five distinct area/base choices, route by the family's first two days and midday-reset needs, remove universal defaults and the repeated 27-field hotel-verification inventory, and hand named-property decisions to the separate family-hotel page.
- Local result: five conditional starts, one five-row comparison, three high-friction notes, four cluster routes, and three visible/schema-aligned FAQs.
- QA: focused tests 4/4 and full repository tests 101/101 pass; operator-state QA and local SEO QA pass with 0 errors and 0 warnings; target-only regeneration, 1280/390/320 responsive rendering, image decode, containment, source/privacy/scope, roadmap JSON, and whitespace checks pass.
- Review: independent reviewer Maxwell (`019f9e13-9dbc-7440-a637-dfa52b6a719f`) returned `PASS` in cycle 2 with no P0-P3 findings after the stale NYC release-state table was reconciled.
- Release: the release marker matched the commit/run; the canonical/indexable page retained five quick-pick starts, one sitemap entry, and all expected cluster routes; action-specific production invariants and production SEO QA at 0 errors/0 warnings passed.
- Boundary: one existing URL only. No new URL, sitemap edit, indexing request, affiliate CTA, external-account mutation, outreach, another page implementation, or recurring automation.
- Release gate: current SERP/ranking-page/persona/source/every-section review, focused/native/responsive/source/privacy/scope QA, target-only generation, and independent reviewer `PASS` or `PASS_WITH_P3`.

### FT-OPS-001 - Audit and harden the repository operating model

- Selected: 2026-07-24 by direct manual user instruction.
- State: completed and review-clean on 2026-07-24; documentation and QA hardening only.
- Evidence: aligned repository at `d12d011`, fresh July 24 GSC finalized through July 22, verified Chicago itinerary release commit `f7a2d7f`, successful Pages run `30090493666`, and the current central Control Room report.
- Scope: reconcile Chicago and stale prior-city status narratives; align roadmap, current cycle, backlogs, and needs-user; refresh README, content strategy, technical plan, and city playbook; add a durable operating audit and focused state QA.
- Boundary: no `site/**`, sitemap, deployment workflow, external account, indexing request, outreach, recurring automation, or hidden city implementation.
- Technical decision: keep the static architecture; queue the 5,711-line generator/upgrader modularization as a separate behavior-preserving action before several more city revamps.
- QA: 83/83 repository tests, 5/5 focused state tests, operator-state QA, native SEO QA 0/0, roadmap JSON, local links, privacy, exact-path, no-site/no-workflow, and whitespace checks passed.
- Review: independent reviewer Popper (`019f94ac-a664-7813-83af-367c71446ed3`) returned final `PASS` in cycle 2 with no P0-P3 findings.

### FT-RES-008 - Chicago SERP-overlap cluster and persona decision pack

- Selected: 2026-07-23 by direct manual user instruction after the Las Vegas cluster was completed.
- State: completed and review-clean on 2026-07-23.
- Scope: research current Chicago query families and observed ranking-page overlap; inspect representative ranking pages and qualitative parent discussions; derive Chicago-specific persona hypotheses; audit all four existing Chicago pages; decide whether family-hotel list intent deserves a separate named-property page; and promote exactly one bounded implementation.
- Evidence: the fresh July 23 authenticated GSC snapshot is finalized through July 21; three Chicago page rows have 102 impressions total, while the teen page has no page row. This is discovery context only.
- Boundary: no `site/**` edit, publication, indexing request, external-account mutation, affiliate CTA, outreach, or recurring automation.
- Release gate: durable research/status/roadmap records, native/focused evidence and consistency checks, and independent reviewer `PASS` or `PASS_WITH_P3` before exact-path push.
- Research result: nine overlap clusters, five persona hypotheses, every-section decisions for all four current Chicago pages, and a clear architecture in which the existing stay page owns areas while one future hotel page owns named properties.
- Hotel decision: approve one future `chicago-family-hotels.html` comparison after a durable evidence pack; do not create separate resort, pool, suite, downtown, or near-attraction URLs.
- Promoted action: `FT-IMP-010` / `IMP-025`, improve the existing all-ages things-to-do page first because it has the largest observed demand, 52 early GSC impressions, and substantial repeated content.
- Artifacts: `docs/research/chicago-family-cluster-decision-pack.md` and `status/chicago-pages.md`.
- Review: Carson (`019f8e60-ca8b-73c2-b344-43a0e93c606e`) returned `PASS` on cycle 3 after both P2 traceability gaps and all P3 notes were closed; no P0-P3 remains.
- QA: 57/57 tests, native SEO QA 0/0, roadmap JSON, focused page/persona/cluster/action/source/privacy/scope checks, and whitespace checks passed.

### FT-IMP-010 - Improve the Chicago all-ages things-to-do hub

- Selected: 2026-07-23 by direct manual user instruction.
- State: completed, released, and production-verified at commit `ad4f31801a3721b84a8f017bcda718f42ac7e731`; GitHub Pages run `30058164707` succeeded.
- Target: `https://familytripwise.com/things-to-do/chicago-with-kids.html`.
- Baseline: 52 impressions, 0 clicks, and page-level average position 58.88 in the fresh July 23 authenticated snapshot. This is not a query-specific rank.
- Product requirement: research a wider candidate pool, apply CHI-P1 through CHI-P5, preserve one complete comparison, keep deep notes only for high-friction choices, and add compact free/budget plus indoor/weather support.
- Boundary: preserve URL/canonical/indexability/sitemap; do not edit the teen, stay, itinerary, or future hotel page and do not create another URL.
- Exact maximum scope: one durable review, `tools/upgrade-priority-pages.mjs`, one focused test, the existing all-ages HTML, Chicago status, and operator/backlog records.
- Release gate: durable candidate/every-section review, focused/native/responsive/source/privacy/scope QA, and independent reviewer `PASS` or `PASS_WITH_P3`.
- Local result: the filter and comparison cover 12 distinct choices; one five-card CHI-P1 through CHI-P5 routing layer replaces universal rankings and the standalone teen band; only six high-friction choices receive deep notes; the duplicate mini-itinerary layer is removed; three cluster links, three visible/schema-aligned FAQs, and current official sources complete the decision flow.
- Review cycle 1: Mendel (`019f9112-265b-7742-9175-974f86f4811e`) returned `FAIL` with three P2 and three P3 findings. All were addressed by scoping filterable cards, adding `aria-pressed`, removing duplicate routes, explicitly tracing CHI-P1 through CHI-P5, correcting 19 to 18 candidates, and strengthening the isolation test.
- Review cycle 2: Mendel returned `PASS_WITH_P3` with no P0-P2. The activity trust-panel reference to hotel evidence and a duplicate backlog QA line were the only P3 notes; both were fixed for final cycle 3 confirmation.
- Review cycle 3: Mendel returned final `PASS`; no P0-P3 findings remain.
- QA after cycle 1 fixes: focused tests 4/4, full tests 61/61, native SEO QA 0 errors/0 warnings, JavaScript and roadmap JSON validation, responsive checks at 1280/390/320, filter/support/FAQ behavior, privacy/scope checks, and `git diff --check` passed.

### FT-PUB-003 - Research and publish the Chicago family-hotel comparison

- Selected: 2026-07-23 by direct manual user instruction to continue Chicago pages iteratively without approval pauses.
- State: completed, released, and production-verified at commit `833c081ca1c436d609b50e36ae94f47cff4c7cbf`; GitHub Pages run `30062024170` succeeded.
- Target: `https://familytripwise.com/where-to-stay/chicago-family-hotels.html`, with link-only routing changes allowed on the existing Chicago stay page and home page.
- Demand basis: directional logged-in Semrush US estimates collected July 23 are 320 for `best hotels in Chicago for families`, 260 for `family friendly hotels in Chicago`, and 210 for `kid friendly hotels Chicago`; variants overlap and must not be summed.
- GSC: the proposed URL does not exist in the fresh July 23 snapshot, so there is no page row or performance claim.
- Product requirement: about 10-12 evidence-backed properties by distinct trip style, one compact comparison, approximate total nightly ranges, current official facts, bounded recent family-review themes and conflicts, direct maps, visible freshness, and useful unknowns.
- Boundary: one new indexable hotel URL only; no separate pool, suite, downtown, resort, or near-attraction URL; no booking transaction, affiliate CTA, indexing request, external-account mutation, outreach, custom-map change, or recurring automation.
- Exact maximum scope: hotel evidence pack, generator, one focused test, the new hotel HTML, link-only stay/home edits, sitemap, Chicago status, and operator/backlog records.
- Release gate: focused/native/responsive/source/privacy/scope QA and an independent reviewer `PASS` or `PASS_WITH_P3` before exact-path commit and deployment.
- Local result: 10 trip-style hotel options, one compact comparison, 10 evidence-backed detail cards, five quick starts, direct maps, rough total-night ranges, sampled online-review observations and conflicts, and three visible FAQs. Focused tests passed 4/4, the repository suite passed 65/65, native SEO QA returned 0 errors and 0 warnings, and 1280/390/320 responsive checks passed.
- Review: Wegener (`019f91eb-1d7f-7861-a9e3-4c0d8c1628b7`) returned final `PASS` on cycle 3 with no P0-P3 findings after Langham, review-ledger, Hilton-price, Hotel Zachary, and generator-isolation fixes.

### FT-IMP-011 - Simplify the Chicago stay-area guide

- Selected: 2026-07-23 under the user's standing direct manual instruction to complete Chicago pages iteratively without approval pauses.
- State: completed, released, and production-verified at commit `9d1a90d4b39a2477175bdd8597ee79e197db0ab8`; GitHub Pages run `30084335602` succeeded.
- Target: `https://familytripwise.com/where-to-stay/chicago-with-kids.html`.
- Evidence: fresh July 23 GSC is finalized through July 21; the page has 38 impressions, 0 clicks, and page-level average position 60.11. This early sample cannot support a query-rank or causal claim.
- Product requirement: audit every visible section against the same-day Chicago SERP/persona decision pack and current official sources; retain five useful area/base starts, one compact comparison, three decisive checks, visible FAQs, and a clear handoff to the released named-hotel page.
- Boundary: preserve the URL, canonical, indexability, and sitemap; do not edit the hotel page or another live page, create a URL, request indexing, mutate an external account, add an affiliate CTA, send outreach, or add recurring automation.
- Exact maximum scope: one durable stay-area review, the shared page upgrader, one focused stay test, the existing hotel test for an equivalent-route assertion only, the existing stay HTML, Chicago status, and operator/backlog records.
- Scope note: the existing hotel-page regression test is included only to accept the equivalent same-directory `./chicago-family-hotels.html` route emitted by this page; the hotel page remains unchanged.
- Release gate: focused/native/responsive/source/privacy/scope QA and a different independent reviewer `PASS` or `PASS_WITH_P3` before exact-path commit and deployment.
- Local result: five conditional trip-style starts, one five-row area comparison, three decisive checks, four cluster routes led by the released hotel page, three visible/schema-aligned FAQs, and current Choose Chicago and CTA sources. The repeated generated intro/table/cards, eight universal `best` picks, eleven-column matrix, and six stale hotel checks are gone.
- Operator QA: focused tests 4/4, full suite 69/69, native SEO QA 0 errors/0 warnings, JavaScript and roadmap JSON validation, generation isolation/idempotency, whitespace, and responsive checks at 1280/390/320 passed.
- Review: Meitner (`019f9385-11e0-70d3-8013-d4effa21ca00`) returned final `PASS` in cycle 2 with no P0-P3 findings after the stale operator state, Streeterville source specificity, and nightly-price wording were corrected.

### FT-IMP-013 - Review and improve the Chicago family itinerary

- Selected: 2026-07-23 under the user's standing direct manual instruction to complete Chicago pages iteratively without approval pauses.
- State: completed, released, and production-verified on 2026-07-24 at commit `f7a2d7f936bf286ab25776e058eefc72ea7569f8`; GitHub Pages run `30090493666` succeeded.
- Target: `https://familytripwise.com/family-itinerary/chicago-with-kids.html`.
- Demand and evidence: directional logged-in Semrush US estimates collected July 23 are 20 for `Chicago itinerary with kids` and 20 for `3 days in Chicago with kids`; variants overlap. The fresh July 23 GSC snapshot has 12 impressions, 0 clicks, and page-level average position 20.75, which is too small for a query-rank or causal conclusion.
- Product requirement: inspect current itinerary SERPs and representative ranking pages, apply CHI-P1 through CHI-P5, and audit every visible section. Build genuinely usable one-, two-, and three-day execution plans with age/weather/budget/base pivots and explicit stop rules rather than repeating the activity list.
- Boundary: preserve the URL, canonical, indexability, and sitemap; released sibling Chicago pages are planning dependencies but remain unchanged.
- Exact maximum scope: one durable itinerary review, the existing shared page upgrader, one focused test, the existing itinerary HTML, one itinerary-scoped shared-stylesheet treatment required by review, Chicago status, and operator/backlog records.
- Release gate: focused/native/responsive/source/privacy/scope QA and a different independent reviewer `PASS` or `PASS_WITH_P3` before exact-path commit and deployment.
- Local result: three trip-length starts, three concrete day plans, five persona pivots, four stop rules, four cluster handoffs, current sources, and visible/schema-aligned FAQs. Focused tests pass 4/4, the full suite passes 78/78, native SEO QA is 0/0, and 1280/390/320 browser checks pass without page overflow; the mobile pivot table keeps its first column visible while scrolling.
- Review: Boyle (`019f93dc-ecd8-78c1-988a-51943eca7217`) returned final `PASS` in cycle 2 with no P0-P3 findings.
- Production: the workflow head and release marker matched `f7a2d7f`; the itinerary invariant and production SEO QA passed.

### FT-IMP-012 - Review and improve the Chicago teen guide

- Selected: 2026-07-23 under the user's standing direct manual instruction to complete Chicago pages iteratively without approval pauses.
- State: completed, released, and production-verified on 2026-07-23 at commit `7df3952b87557f035780bb4d9a44056b43678004`; GitHub Pages run `30087275395` succeeded.
- Target: `https://familytripwise.com/things-to-do/chicago-with-teens.html`.
- Demand and evidence: directional logged-in Semrush US estimates collected July 23 are 720 for `things to do in Chicago with teens` and 110 for `things to do in Chicago with teenagers`; variants overlap. The fresh July 23 GSC snapshot has no page row, so impressions, clicks, and position are N/A.
- Product requirement: inspect a wider teen-specific candidate set and current ranking pages, apply CHI-P4 plus mixed-age routes, and audit every visible section. Keep only choices with a distinct older-kid reason, current official checks, one complete comparison, compact high-friction notes, and useful route shapes.
- Boundary: preserve the URL, canonical, indexability, and sitemap; do not edit another live page, create a URL, request indexing, mutate an external account, add an affiliate CTA, send outreach, or add recurring automation.
- Exact maximum scope: one durable teen review, the shared page upgrader, one focused test, the existing teen HTML, one scoped shared-stylesheet mobile comparison treatment required by visual review, Chicago status, and operator/backlog records.
- Release gate: focused/native/responsive/source/privacy/scope QA and a different independent reviewer `PASS` or `PASS_WITH_P3` before exact-path commit and deployment.
- Local result: five singular teen-choice starts, one seven-column/eight-row comparison with a scoped sticky mobile activity column, four high-friction notes, four route shapes, four cluster routes, three current checks, and three visible/schema-aligned FAQs. Exact ranking and community evidence registers plus direct official product sources are recorded in the durable review.
- QA: focused tests 5/5, full suite 74/74, native SEO QA 0 errors/0 warnings, roadmap JSON, generation isolation, whitespace, source/privacy/scope, and browser checks passed.
- Review: Peirce (`019f93b0-2afb-7af1-a826-8ce8e31c66e6`) returned final `PASS` in cycle 2 with no P0-P3 findings.

### FT-IMP-009 - Review and improve the Las Vegas family itinerary

- Selected: 2026-07-23 under the user's standing manual instruction to continue Las Vegas work without approval pauses.
- State: completed, released, and production-verified on 2026-07-23 at commit `48417b0aedb17375e4474711302574e11da53494`; GitHub Pages run `29994060699` succeeded.
- Target: `https://familytripwise.com/family-itinerary/las-vegas-with-kids.html`.
- Evidence: the July 22 authenticated API snapshot is one day old, unchanged, and finalized through July 20; the page has 5 impressions at average position 22.6. That sample is too small for a query-rank or performance conclusion.
- Product requirement: inspect current itinerary SERPs and representative ranking pages, apply LV-P1 through LV-P5, and audit every visible section. Build genuinely usable one-, two-, and three-day plans with age/heat pivots and stop rules rather than repeating the activity list.
- Boundary: preserve the URL, canonical, indexability, and sitemap; sibling Las Vegas pages are planning dependencies but remain unchanged.
- Release gate: durable review artifact, focused/native/responsive/source/scope QA, and independent reviewer `PASS` or `PASS_WITH_P3` before exact-path commit and deployment.
- Local result: three trip-length starts, three detailed day-by-day plans, five persona/trip pivots, four stop rules, four cluster handoffs, three visible FAQs aligned with schema, one current source list, and no duplicate generated starter sections. The durable review is `docs/research/las-vegas-family-itinerary-page-review.md`.

### FT-IMP-008 - Simplify the Las Vegas stay-area guide

- Selected: 2026-07-22 under the user's standing manual instruction to continue Las Vegas work without approval pauses.
- State: completed, released, and production-verified on 2026-07-22 at commit `7bc29933add65357ca2d83c39790614193d7165d`; GitHub Pages run `29975754626` succeeded.
- Target: `https://familytripwise.com/where-to-stay/las-vegas-with-kids.html`.
- Evidence: fresh July 22 page-level GSC has 13 impressions at average position 44.69; the July 22 Semrush check estimates only 20 monthly searches for the exact area query, while named hotel/resort variants are much larger and already route to the separate hotel comparison. The GSC sample is too small for a performance conclusion.
- Product requirement: audit every section against current area/base SERPs, LV-P1/LV-P2/LV-P3/LV-P5, hotel-page overlap, scan cost, and trust boundaries. Keep one concise area/base decision path and route named-property work to the hotel page.
- Boundary: preserve the URL, canonical, indexability, and sitemap; do not edit another live page or create a new URL.
- Exact scope note: the existing hotel-page regression test is included only to accept the equivalent same-directory `./las-vegas-family-hotels.html` route emitted by this page; the hotel page itself remains unchanged.
- Release gate: durable review artifact, focused/native/responsive/source/scope QA, and independent reviewer `PASS` or `PASS_WITH_P3` before exact-path commit and deployment.
- Local result: five trip-style starts, one five-row base comparison, three decisive checks, four cluster routes, three visible FAQs aligned with schema, one current source list, and no duplicated named-hotel profiles. The durable review is `docs/research/las-vegas-stay-area-page-review.md`.
- Review and QA: Carson (`019f8ce4-2aa3-7da3-a3c8-07fe9fcfa14d`) returned `PASS_WITH_P3` with no P0-P2. Deterministic generation, 53/53 repository tests, 4/4 focused tests, native SEO QA 0/0, JavaScript/JSON/whitespace/privacy/scope/source checks, and 1280/390/320 responsive checks passed. Both stale-status P3 notes were reconciled during verdict logging.

### FT-IMP-007 - Review and improve the Las Vegas teen guide

- Selected: 2026-07-22 under the user's standing manual instruction to continue Las Vegas work without approval pauses.
- State: completed, released, and production-verified on 2026-07-22 at commit `ae917f1435b8c8f14e496fe4a6c774e20a460d37`; GitHub Pages run `29964564369` succeeded.
- Target: `https://familytripwise.com/things-to-do/las-vegas-with-teens.html`.
- Evidence: fresh July 22 page-level GSC has two impressions at average position 11; Semrush estimates 590 US monthly searches for the core exact query; current SERPs preserve a distinct teen/tween result set. The GSC sample is too small for a performance conclusion.
- Product requirement: audit every section and candidate against LV-P4, current ranking pages, official sources, all-ages overlap, mixed-age needs, scan cost, and trust boundaries. Every retained choice needs an older-kid-specific reason.
- Boundary: preserve the URL, canonical, indexability, and sitemap; do not edit another live page or create a new URL.
- Release gate: durable review artifact, focused/native/responsive/source/scope QA, and independent reviewer `PASS` or `PASS_WITH_P3` before exact-path commit and deployment.
- Local result: five interest-led starts, one eight-choice comparison, five high-friction detail cards, four route shapes, four cluster routes, three current-check cards, and three visible FAQs. The durable review is `docs/research/las-vegas-teen-page-review.md`.
- Review and QA: Dewey (`019f8bee-4a96-7660-a2fd-ce864e9979da`) returned `PASS_WITH_P3` with no P0-P2. Full generation, 51 repository tests, focused tests, native SEO QA, JavaScript/JSON/whitespace/privacy/scope/source checks, and 1280/390/320 responsive checks passed. Both stale-documentation P3 notes were reconciled during verdict logging.

### FT-PUB-002 - Research and publish the Las Vegas family-hotel comparison

- Selected: 2026-07-22 by direct manual user instruction.
- State: completed, released, and production-verified on 2026-07-22 at commit `bda58e8d2384b3935e10e92b367a2ffd9ab76a72`; GitHub Pages run `29944609529` succeeded.
- New URL: `https://familytripwise.com/where-to-stay/las-vegas-family-hotels.html`.
- Evidence requirement: evaluate a wider candidate pool; retain only properties with distinct trip-style value, current official room/amenity facts, a source-dated rough total nightly range, bounded recent family-review themes and conflicts, current operational caveats, and explicit unknowns.
- Product requirement: one compact default comparison plus concise property notes; do not create separate family-resort, pool, suite, or waterslide URLs.
- Dependent scope: the existing Las Vegas stay guide and home page may change only enough to route to the new comparison. The newly released activity page is excluded.
- Trust boundary: no personally stayed claim, universal ranking, safety assurance, exact route/stroller verdict, room-selection guarantee, smoke/noise conclusion, pool-access guarantee, or stable-price promise.
- Release result: focused/native QA, exact generator output, responsive browser checks, source/privacy/scope checks, and independent reviewer `PASS` passed before the exact-path release; production invariants and production SEO QA passed after deployment.
- Local result: ten trip-style hotel options, one compact comparison, rough total-night ranges, official facts, sampled online-review themes/conflicts, direct maps, visible FAQ/schema, and dependent routing from the stay guide and home page.
- Review and QA: Prism (`019f8ae7-5f67-71c3-a1ed-8edd6cae20f3`) returned `PASS` on cycle 2 after both P2 findings were closed. Full regeneration, 47 tests, focused tests, native SEO QA, responsive checks, privacy/scope/source checks, roadmap JSON, JavaScript syntax, and whitespace checks passed.

### FT-RES-007 - Next pilot city and incremental city playbook

- Selected: 2026-07-22 by direct manual user instruction.
- State: completed 2026-07-22; research and planning only.
- Evidence: fresh July 22 authenticated GSC API snapshot through July 20, a July 22 logged-in Semrush US bulk comparison after API units were unavailable, current public SERPs, representative ranking pages, existing site pages, and current operator state.
- Decision: Las Vegas is next. It has the strongest combined existing GSC discovery, broad activity opportunity, commercial hotel depth, and existing-page leverage. Chicago, New York City, and San Antonio follow in that provisional order.
- Deliverables: `docs/research/next-city-prioritization-las-vegas-cluster.md`, `docs/plan/incremental-city-cluster-playbook.md`, `status/las-vegas-pages.md`, and exactly one promoted implementation.
- Review: independent reviewer Mendel returned `PASS_WITH_P3` after all P2 findings were closed. The residual P3 is a non-blocking stale `review second` phrase in one teen audit row; it does not affect the architecture, status table, or sole promoted action.
- Boundary: no `site/**`, new URL, sitemap, robots, canonical, indexability, indexing request, external-account mutation, outreach, automation, or deployment change.

### FT-IMP-006 - Improve the Las Vegas all-ages things-to-do hub

- State: completed, released, and production-verified on 2026-07-22 at commit `3f555d65b9e6b9c86f47c176ed2d6f3c529789a8`; GitHub Pages run `29930917894` succeeded.
- Source handoff: `FT-RES-007` and `docs/research/next-city-prioritization-las-vegas-cluster.md`.
- Target: `https://familytripwise.com/things-to-do/las-vegas-with-kids.html`.
- Scope: widen the candidate research, then review every current section against five persona hypotheses, current ranking pages, evidence quality, repetition, scan cost, and trust boundaries. Keep only choices with distinct planning value; there is no list-length quota.
- Product requirement: preserve the all-ages hub and its teen/stay/itinerary routes, add compact free/budget and heat/indoor decision support, and avoid creating a new URL in this action.
- Local result: 12 compact filterable choices, one 12-row comparison, five trip-shape routes, six high-friction detail cards, three current-check cards, three cluster routes, and activity-specific official sources. The candidate and every-section decision record is `docs/research/las-vegas-activity-expansion-review.md`.
- Review and QA: Popper (`019f8a48-2b5a-7fe1-b6a7-290771ee03b8`) returned `PASS_WITH_P3` on cycle 2 after both P2 findings were closed. Generator/unrelated-output stability, 44 tests, native SEO QA, responsive browser checks, privacy/scope, source-link classification, roadmap JSON, and whitespace checks passed.
- Residual P3: derive the optional visible FAQ heading from page data if another city later enables it; this does not affect the Las Vegas output.

### FT-IMP-005 — Expand San Diego activity and hotel decision sets

- Selected: 2026-07-21 by direct manual user instruction.
- State: completed, released, and production-verified on 2026-07-21 at commit `31bba30652d76c3d1664193532a9c508a83c6f32`; GitHub Pages run `29876597948` succeeded.
- Main URLs: `https://familytripwise.com/things-to-do/san-diego-with-kids.html` and `https://familytripwise.com/where-to-stay/san-diego-family-hotels.html`.
- Target: evaluate wider candidate pools, then publish 12 distinct primary activities and 12 evidence-backed hotels only when each earns inclusion through a different age, weather, budget, geography, or trip-style decision.
- Dependent stay-page scope: update only the two hard-coded hotel-count link labels; do not reopen its area guidance.
- Evidence: fresh July 21 authenticated API snapshot through July 19 is context only; use current SERPs, official attraction/property sources, current public price examples, and bounded recent family-review/community signals for candidate selection.
- Boundary: no new URL, destination, indexing request, outreach, affiliate CTA, external-account mutation, personally verified claim, or unsupported safety/route/family-fit conclusion.
- Local result: 12 primary activity rows, six concise extra-planning cards for the additions, 12 hotel records, six hotel trip-style picks, and a durable candidate/evidence review. Native SEO QA returned 0 errors and 0 warnings; all 40 repository tests and `git diff --check` passed.
- Review: Tesla (`019f86e6-7253-78c1-a1b0-5024da393b27`) returned `PASS` on cycle 3 with no P0-P3 findings after every earlier finding was closed.

## Completed this cycle

### FT-RES-002 — priority-page index-worthiness review

- Completed: 2026-07-14.
- Evidence: reused authenticated July 13 UI import, current local page inspection, current public/repository health, active observation windows, and historical opportunity research.
- Result: all eight reviewed pages remain index-worthy. No protected URL was edited.
- Promoted action: `FT-IMP-001` / `IMP-015`, limited to the unprotected Las Vegas where-to-stay page and its generator/test/evidence paths.
- Research artifact: `docs/research/srr-002-priority-page-review.md`.
- Independent review: cycle 2 `PASS`; the cycle 1 Chicago-page scope P2 was corrected and no P0-P3 findings remain.
- QA: roadmap JSON validation, 11 GSC snapshot/privacy tests, native and production SEO QA, and tracked/untracked whitespace checks passed; no `site/**` path changed.

### FT-DEV-002 — San Diego itinerary-pacing prototype

- Selected: 2026-07-14 by the deterministic operator as the highest-scoring eligible non-measurement action.
- State: completed and review-clean on 2026-07-14.
- Publication: unpublished under `src/prototypes/san-diego-itinerary-pacing/`, marked `noindex, nofollow`, and absent from `site/` and the sitemap.
- Product result: a deterministic local planner turns age, trip length, reset, weather, transport, pace, stroller, and sensory constraints into day shapes, visible triggered rules, and a verification gate.
- Trust boundary: every output is model-derived and `needs-human-review`; no exact route, timing, access, safety, or suitability conclusion is presented as verified fact.
- QA: syntax checks passed; planner tests passed 5/5 over all 11,520 supported combinations, including both stroller and sensory states; native and production SEO QA returned 0 errors and 0 warnings; desktop and 390px browser flows had no console errors or horizontal overflow.
- Independent review: cycle 2 `PASS`; the combination-coverage P2 was closed and no P0-P3 findings remain.

### FT-IMP-001 — Las Vegas stay verification revision

- Selected: 2026-07-15 by the deterministic operator after healthy monitoring housekeeping did not meet a preemption condition.
- State: completed and review-clean on 2026-07-15.
- Affected URL: `https://familytripwise.com/where-to-stay/las-vegas-with-kids.html` (unprotected).
- Product result: firm best-area, best-fit, smoke/noise, route, pool, and family-suitability verdicts were replaced with neutral hypotheses, explicit `UNKNOWN` states, exact property/room/route/date checks, and human-review questions.
- Release invariant: canonical/indexable/sitemap state remains unchanged; the page visibly includes total-fee, room-assignment, pool-access, smoke/noise-exposure, and route-friction checks and no unreviewed best-area or best-fit verdict as fact.
- QA: focused tests passed 2/2; regeneration is idempotent and changes no unrelated page; native and production SEO QA returned 0 errors and 0 warnings; desktop, 390px, and 320px browser checks found no page overflow or implementation console error.
- Independent review: cycle 1 `PASS`; no P0-P3 findings.

### FT-AUTH-001 — San Diego source-worthy asset plan

- Selected: 2026-07-16 by the deterministic operator after fresh GSC, URL Inspection, public preflight, and repository QA housekeeping remained healthy and non-preempting.
- State: completed and review-clean on 2026-07-16.
- Asset direction: a source-dated San Diego Family Reset Atlas with a filterable map, downloadable dataset, methodology, freshness, confidence, and human-review fields.
- Evidence boundary: official sources establish only their explicit facts; route, stroller, sensory, caregiver-facility, and family-suitability conclusions remain human-gated or `UNKNOWN`.
- Prospect result: eight relevant public domains scored for audience, resource-format fit, non-duplicative value, and local trust. No private contact data was collected and no outreach was sent.
- Promoted follow-ups: `FT-RES-003` for official-source/license coverage and `FT-DEV-003` for an unpublished synthetic-fixture schema/map shell are now completed and review-clean. Both remain outside `site/`.
- Publication boundary: no `site/**`, sitemap, robots, indexability, external account, contributed content, partnership, or live asset changed.
- Independent review: cycle 2 `PASS`; cycle 1's anchor-count P2 was closed by consistently enumerating 13 anchors, requiring all 13 for release readiness, and defining the stop threshold as fewer than 11 of 13 sourced anchors. No P0-P3 findings remain.
- QA: eight prospect scores and the 13-anchor count validated; roadmap JSON, 11 GSC snapshot/privacy tests, four snapshot validations, native and production SEO QA, and tracked/untracked whitespace checks passed.

### FT-RES-003 — San Diego Reset Atlas source and reuse audit

- Selected: 2026-07-16 by the deterministic operator after fresh GSC, URL Inspection, public preflight, and repository QA housekeeping remained healthy and non-preempting.
- State: completed and review-clean on 2026-07-16.
- Coverage result: official first-party or government evidence is available for all 13 enumerated anchors, clearing the 11-of-13 continuation threshold.
- Reuse result: City Open Data may support reusable location geometry for two public-park anchors under its governing terms; structured redistribution of ordinary venue and agency webpage facts remains `UNKNOWN`.
- Trust boundary: route practicality, stroller ease, sensory/quiet suitability, caregiver-facility availability, safety, and material family-fit conclusions remain human-gated. No real record is release-cleared.
- Product decision: `FT-DEV-003` may proceed only as an unpublished synthetic-fixture prototype. Real data ingestion, downloadable publication, and outreach remain blocked.
- Publication boundary: no `site/**`, sitemap, robots, indexability, production URL, external account, or source-owned material changed.
- Independent review: cycle 2 `PASS`; cycle 1's source-fidelity and stale-roadmap-state P2 findings were closed and no P0-P3 findings remain.
- QA: all 26 cited links returned 200; all 13 anchor assertions and the City dataset license/freshness/record claims validated; 11 GSC snapshot/privacy tests, four snapshot validations, native and production SEO QA, roadmap/privacy/allowlist checks, and tracked/untracked whitespace checks passed.

### FT-DEV-003 — unpublished Family Reset Atlas prototype

- Selected: 2026-07-17 after the Control Room scan identified Family Tripwise as the due sensor and its deterministic selector chose the only ready eligible item.
- State: completed and review-clean on 2026-07-17.
- Evidence: reused authenticated read-only API snapshot collected July 16 with finalized performance data through July 14; one day old and within the configured freshness SLA. Monitoring remained healthy and non-preempting.
- Product result: an unpublished schema validator and accessible filter/map-shell prototype uses six synthetic fixtures to expose provenance, freshness, reuse, confidence, human-review, operational-caveat, null-coordinate, and uncertainty fields.
- Trust and data boundary: fixtures have `UNKNOWN` confidence and `needed` human-review status; marker positions are illustrative interface coordinates, not geography. No real source record, coordinate, route, access, sensory, stroller, safety, family-suitability claim, user input, or stored filter state is present.
- Publication boundary: the prototype remains under `src/prototypes/san-diego-family-reset-atlas/`, carries `noindex, nofollow`, and is absent from `site/` and the sitemap. Real-record ingestion, downloads, publication, and outreach remain blocked.
- QA: schema and interaction tests passed 5/5, including freshness, coordinate-state, and firm-claim rejection; syntax checks passed; native and production SEO QA returned 0 errors and 0 warnings; desktop, 390px, and 320px browser checks covered every control and passed without implementation console errors, horizontal overflow, or sticky-panel obstruction.
- Independent review: cycle 2 `PASS`; cycle 1's sticky-control, schema-contract, and firm-claim enforcement P2 findings were closed, with no P0-P3 findings remaining.

### FT-RES-004 — San Diego family-hotel evidence pack

- Selected: 2026-07-18 by the deterministic operator after fresh GSC, URL Inspection, public preflight, and repository QA housekeeping remained healthy and non-preempting.
- State: completed and review-clean on 2026-07-18.
- GSC evidence: fresh authenticated read-only API snapshot collected July 18 with finalized data through July 16; completeness `finalized-conservative` using the two-day-lag basis. Protected query evidence remains unavailable but is not required for this research action.
- Research result: a three-property internal pack covers the candidates already named on the San Diego stay page and separates official facts, attempted booking checks, review signals, community signals, conflicts, unknowns, claim labels, and exact parent checks.
- Decision: do not publish or rank a standalone hotel page yet. The next pass should replace exact booking-total requirements with sourced approximate nightly room bands, visible fee/parking evidence, a consistent expanded review sample, pre-release freshness checks, and human review for trust-sensitive conclusions.
- Publication boundary: no `site/**`, protected URL, sitemap, robots, indexability, affiliate CTA, external account, indexing request, outreach, or deployment changed.
- Independent review: cycle 3 `PASS` with zero P0-P3 findings; cycles 1-2 closed booking/source reproducibility and concurrent-diff isolation P2s.
- QA: 15/15 GSC schema/privacy tests, all six public snapshot validations, roadmap JSON, 19 registered source rows, native/production SEO QA, and exact cached/new-file whitespace checks passed.

### FT-PLAN-001 — Clean San Diego family-hotel page brief

- Selected: 2026-07-18 by direct manual user instruction after FT-RES-004 completed.
- State: completed and review-clean on 2026-07-18.
- Planning result: the brief expands the next San Diego hotel pass from three existing candidates to about eight primary candidates, defines a calm 6-8 card public page shape, keeps category labels non-ordinal, and requires family-review signals without copying review prose.
- User policy update: use sourced approximate nightly room bands instead of requiring exact booking-flow totals for planning; keep taxes, fees, parking, breakfast, cancellation, and final all-in totals as separate booking checks. Crib, rollaway, connecting-room, kitchen, and laundry details are useful when visible but not mandatory for every candidate.
- Publication boundary: no `site/**`, protected URL, sitemap, robots, indexability, affiliate CTA, external account, indexing request, outreach, deployment, or live hotel page changed.
- Independent review: cycle 2 `PASS`; cycle 1 P2 findings for provisional price-band durability, stale exact-booking gate language, and target-path coverage were closed.
- QA: roadmap JSON validation, native SEO QA, and whitespace checks passed.

### FT-RES-005 — Expanded San Diego family-hotel evidence pack

- Selected: 2026-07-18 by direct manual user instruction after FT-PLAN-001 completed.
- State: completed and review-clean on 2026-07-18.
- Research result: the internal evidence pack now covers eight primary candidates: Bahia Resort Hotel, San Diego Mission Bay Resort, Hyatt Regency Mission Bay Spa and Marina, Paradise Point Resort & Spa, Catamaran Resort Hotel and Spa, Homewood Suites San Diego Downtown/Bayside, LEGOLAND Hotel or Castle Hotel, and Loews Coronado Bay Resort.
- User policy application: exact booking-flow totals are not required for this pass. The pack uses sourced approximate room-night bands or `package-dependent`, keeps taxes, resort fees, parking, breakfast, cancellation, and final all-in totals as booking checks, and treats crib, rollaway, connecting-room, kitchen, laundry, microwave, and mini-fridge facts as useful when visible rather than mandatory.
- Trust boundary: review and community signals are paraphrased and conflict-aware. No hotel is ranked, no firm family-suitability, safety, quiet-room, route/stroller, or value claim is made, and the public hotel page remains blocked behind freshness checks and release review.
- Publication boundary: no `site/**`, protected URL, sitemap, robots, indexability, affiliate CTA, external account, indexing request, outreach, deployment, or live hotel page changed.
- Independent review: cycle 2 `PASS`; cycle 1 P2 for community/source reproducibility was closed by downgrading unsourced hotel-specific community notes to question discovery only and aligning review-signal source wording.
- QA: roadmap JSON validation, native SEO QA, production SEO QA, and whitespace checks passed. One transient homepage `503` during the first production QA cleared on focused public checks and retry.

### FT-PUB-001 — Researched San Diego family-hotel page

- Selected: 2026-07-18 by direct manual user instruction after FT-RES-005 completed.
- State: completed and review-clean on 2026-07-18.
- Affected URL: `https://familytripwise.com/where-to-stay/san-diego-family-hotels.html`.
- Publication result: one new San Diego page translates the eight-hotel evidence pack into category picks, a compact comparison table, hotel cards, rough planning bands, fee/parking signals, review-signal conflicts, source links, a CC0 Mission Bay visual, and verify-before-booking checks.
- Trust boundary: the page is research-based and source-dated. It does not claim firsthand stays, rank hotels ordinally, add affiliate or booking CTAs, promise final prices, or establish safety, quiet-room, stroller-route, water-suitability, exact room-selection, cancellation, or family-fit conclusions.
- Release invariant: the URL must be canonical, indexable, in the sitemap exactly once, internally linked from the home page and San Diego stay page, and visibly include eight researched candidates plus final all-in total and human-review caveats.
- Independent review: cycle 2 `PASS_WITH_P3`; cycle 1 P2 for unsupported Loews quietness wording was closed. Remaining P3: same-site Loews official pages conflict on self-parking amount (`$47` versus `$50`), while page copy keeps fees verify-before-booking.
- QA: focused page tests and Las Vegas regression tests passed 5/5; roadmap JSON validation passed; native static SEO QA passed with 23 sitemap URLs and 26 HTML files; whitespace checks passed; local HTTP page returned 200; local sitemap includes the new URL; Wikimedia image resolved 200. Production SEO QA is expected to return 404 for the new URL before deployment and must be rerun after deployment.

### FT-RES-006 — San Diego SERP-overlap cluster and persona decision pack

- Selected: 2026-07-20 by direct manual user instruction.
- State: completed and review-clean on 2026-07-20.
- Research artifact: `docs/research/san-diego-cluster-research-decision-pack.md`.
- Evidence: latest public-safe GSC snapshot from July 19 with finalized data through July 17; prior July 18 snapshot; latest central Control Room report; current San Diego site pages and prototypes; current public SERP snapshots; representative ranking-page inspection; qualitative Reddit/forum and r/Agentic_SEO process discussions.
- Research result: the San Diego query universe is clustered by observed SERP URL/domain overlap, not keyword-volume lists alone. The pack defines five research-hypothesis personas, audits every canonical/indexable San Diego page plus legacy shims and relevant unpublished prototypes, separates authority advantages Family Tripwise cannot honestly copy from usefulness opportunities it can pursue, and recommends one bounded next implementation.
- Promoted action: `FT-IMP-002`, an existing-page upgrade to make `https://familytripwise.com/things-to-do/san-diego-with-kids.html` a persona-led cluster router for first-time, toddler/nap/stroller, teen/tween, lodging-led, and rainy/free/budget planners.
- Publication boundary: no `site/**`, sitemap, robots, canonical, indexability, indexing request, external account, outreach, automation, or deployment changed.
- Independent review: `PASS` from read-only reviewer `019f7f5a-007c-7f01-afea-990f6def6484`; no P0-P3 findings.
- QA: roadmap JSON validation, native static SEO QA, production SEO QA, GSC snapshot tests/validation, focused research-artifact consistency, focused roadmap consistency, privacy/credential scan, and whitespace checks passed.

### FT-IMP-002 — San Diego things-to-do persona-led cluster router

- State: completed 2026-07-20.
- Source handoff: `FT-RES-006` and `docs/research/san-diego-cluster-research-decision-pack.md`.
- Affected URL: `https://familytripwise.com/things-to-do/san-diego-with-kids.html`.
- Result: upgraded the existing all-ages San Diego activities page into a cluster router rather than another long generic list.
- Implemented routes: first-time family, toddler/nap/stroller family, teen/tween family, lodging-led planner, and rainy/free/budget planner.
- Preserved boundary: canonical/indexability/sitemap state stayed stable; the protected San Diego stay page was not edited; no new page, destination, indexing request, event scraper, outreach, booking/affiliate CTA, or external account mutation was introduced; safety, route, stroller, quiet, water-suitability, and firm family-fit claims remain gated.
- QA and review: `node tools/generate-pages.mjs`, focused tests 10/10, `node tools/seo-qa.mjs`, `jq empty ops/seo-roadmap.json`, and `git diff --check` passed. Independent reviewer `019f7ff6-3cca-7052-9e6d-869eac450da3` returned `PASS` on review cycle 2 after the freshness-date P2 was fixed.

### FT-IMP-003 — San Diego specialist-page usefulness pass

- Selected: 2026-07-20 by direct manual user instruction after the user clarified that cross-page overlap is acceptable but every page section should provide useful detail.
- State: completed and review-clean on 2026-07-20.
- Audit result: every top-level section or repeated section family across the six canonical San Diego pages now has a keep, compress, merge, move/link, remove, or verify verdict in `docs/research/san-diego-section-level-editorial-audit.md`.
- Product result: the toddler, teen, and itinerary pages retain a concise selector, structured comparison/detail, and route/application layer while duplicate starter blocks, repetitive micro-fields, defective route structure, and unrelated hotel-source residue are removed.
- Trust result: categorical age, duration, stroller, rain, nap, booking, and value fields are labeled as Family Tripwise editorial estimates rather than venue guarantees; the County beach/bay source is included for current water-condition checks.
- Scope boundary: the protected stay page and newly observing hotel/all-ages pages were audited but not edited. Canonical, indexability, sitemap, robots, new-page, external-account, outreach, and indexing-request state did not change.
- QA: generator/idempotency passed; 16 focused tests passed; native and production SEO QA returned 0 errors and 0 warnings; desktop/mobile browser checks passed; JSON, scope, privacy, and whitespace checks passed.
- Independent review: cycle 2 `PASS` with no P0-P3 findings after closing all three cycle-1 P2 findings and both P3 observations.

### FT-IMP-004 — Improve both San Diego lodging decision pages

- Selected: 2026-07-20 by direct manual user instruction after the user chose immediate page usefulness over preserving the low-signal stay-page observation window.
- State: completed, released, and production-verified at commit `326501bd32399421c56cbe0f4e4065146166a062`; GitHub Pages run `29796506753` succeeded.
- Affected URLs: `https://familytripwise.com/where-to-stay/san-diego-with-kids.html` and `https://familytripwise.com/where-to-stay/san-diego-family-hotels.html`.
- Area-page result: removes the duplicate base area table and parallel three-hotel profiles; retains five area choices, a seven-field comparison, interactive constraint checklist, four exact-hotel checks, and direct routing to the eight-hotel guide.
- Hotel-page result: retains all eight detailed property records, approximate nightly prices, map, room facts, directional themes from sampled reviews, and sources; compresses eight repetitive category cards to five trip styles and merges repeated methodology/caveats.
- Measurement consequence: `FT-EVAL-001` is superseded. `FT-EVAL-002` crossed its crawl/query evidence gate on August 4 and remains a query-ownership checkpoint, not a short-window ranking verdict.
- Boundary: no URL, destination, sitemap, robots, canonical, indexability, indexing request, outreach, booking CTA, affiliate change, or external-account mutation.
- QA and review: 39/39 repository tests, 14/14 focused lodging/regression tests, native and production-preflight SEO QA, desktop/mobile browser checks, JSON, privacy, scope, and whitespace checks passed. Independent reviewer `019f8284-1234-7c81-aa49-b4d50c95942a` returned `PASS` on cycle 2 with no P0-P3 findings.
- Production verification: the release marker matched the implementation commit; both affected URLs passed the predeclared content invariants, canonical/indexability/sitemap checks, and production SEO QA with 0 errors and 0 warnings.

## Daily evidence loop

1. Read the newest dated snapshot under `ops/gsc-snapshots/` and state its collection mode and age.
2. Run current public and repository health checks.
3. Complete due routine monitoring as housekeeping. Preempt substantive work only for a verified technical or production defect, a safety or trust blocker, a due substantive experiment decision, or a check explicitly marked to preempt.
4. Select at most one bounded action from direct user authority plus repository evidence; record its action ID, exact paths, evidence, acceptance criteria, measurement plan, and production invariants before editing.
5. Implement, independently review, commit, push, and verify within the standing policy.
6. Return a concise handback to the user and leave the next action evidence-gated.

## Hotel Research Policy

Hotel pages no longer require firsthand human review for every research-based claim. They do require the documented hotel research engine in `docs/plan/hotel-research-engine.md`: official property facts, current booking checks, review/community-signal summaries, contradictions, freshness, uncertainty labels, and clear separation between research-based guidance and personally verified experience.

Human review remains required for firsthand stay claims, safety assurances, exact route/stroller practicality verdicts, room-selection advice that materially affects booking, and any firm family-suitability conclusion that the research record cannot support.

## San Diego Hotel Page Hypothesis

The target experience should borrow Reddit's useful constraint-and-tradeoff feel, but present it as a clean decision page: category-led picks, compact hotel cards, a quiet comparison table, activity-distance bands, current price/fee checks where available, and expandable evidence notes. The page should avoid clutter, generic ranked-list prose, and unsupported `best` claims.

The first standalone hotel page should not stop at the three hotels already named on the current stay page. `FT-RES-005` now evaluates eight primary candidates; a future live page should publish only the 6-8 strongest evidence-backed cards. Use sourced approximate nightly room bands rather than exact booking totals unless a stable booking screen is already available. Crib, rollaway, connecting-room, and kitchen details should be captured when visible, but missing optional details become `verify before booking` notes rather than automatic blockers. Recent family-relevant review signals are a core input and must remain paraphrased, bounded, and conflict-aware.

## Expansion Policy

San Diego established the first deep pattern; Las Vegas, Chicago, New York City, and San Antonio validated transfer. Orlando research remains held. Any future URL needs the current distinct-job, demand, existing-URL-fit, maintainable-information-gain, roadmap-eligibility, and user-approval gates in `AGENTS.md`.

## Data boundary

This repository is public. Committed GSC snapshots are normalized decision summaries: aggregate performance, page-level metrics for public URLs, sitemap status, and URL Inspection status. Credentials and complete raw query exports must never be committed. Independent-pilot query exports remain encrypted in GitHub and decrypt only to the Family Tripwise private directory documented in `docs/plan/protected-gsc-query-export.md`.
