# Incremental City Cluster Playbook

Status: operating guide

Prepared: 2026-07-22

Owner: Family Tripwise project operator

## Purpose

Use this process to choose, research, build, review, and measure one city at a time. The goal is not to publish a predetermined page set. It is to discover which family-planning jobs have real search evidence, determine the smallest coherent city product, and improve one page before expanding.

This guide operationalizes the San Diego process and the Las Vegas selection in `docs/research/next-city-prioritization-las-vegas-cluster.md`.

## Principles

1. Treat search research as product input, not a keyword-to-article factory.
2. Select a city from fresh GSC, current keyword evidence, SERP opportunity, commercial value, and existing-product leverage together.
3. Cluster by observed ranking URL/domain overlap and user job. Similar phrases alone do not prove one page.
4. Inspect the pages that rank. Separate advantages we cannot claim from structure, freshness, and usability we can improve.
5. Derive persona hypotheses from observed modifiers and recurring parent questions, then use them to test every section.
6. Improve an existing page before creating a new one unless the SERP clearly demands a different page type.
7. Build one page, or one tightly coupled pair, per implementation transaction. Do not batch a city into thin pages.
8. Make the default view compact. Filters and deeper detail should reduce decision friction, not require users to configure the page before it becomes useful.
9. Keep evidence source-dated, uncertainty proportional, and user-facing language direct rather than defensive.
10. Let fresh crawl/query evidence and product gaps trigger follow-up work. Scan cadence alone does not manufacture tasks.
11. Treat release-state reconciliation as part of the transaction. A page is not durably complete while roadmap, backlog, current-cycle, and city-status records still call it pending.
12. Keep generation deterministic and city changes isolated. When the current tooling makes exact scope difficult to prove, schedule a behavior-preserving technical refactor before adding more content complexity.

## Stage 0: Operating Gate

Before research:

- Read `AGENTS.md`, `ops/operator.json`, both roadmap files, current cycle, needs-user, latest/prior GSC snapshots, current city artifacts, and the latest central Control Room report.
- Confirm whether the action is a registered Control Room dispatch or a direct manual user instruction.
- For a dispatch, validate its lease and immutable contract before touching project state.
- Confirm repository/origin state and preserve unrelated dirty work.
- Record the action and exact research scope before substantive edits.
- Declare whether the transaction is research-only, implementation, measurement, or release reconciliation.

Stop on an invalid dispatch lease, unresolved repository divergence, overlapping dirty work that makes the scope unsafe, or a required human/external permission gate.

## Stage 1: Select One City

Compare only plausible cities, normally existing pilot destinations first.

Collect:

- latest 28-day page-level GSC impressions, clicks, average position, indexing, and sitemap state;
- current monthly keyword estimates and KD from a named source;
- activity, lodging, age, itinerary, budget, weather, and friction variants;
- current page inventory and improvement leverage;
- SERP quality and page-type fit;
- commercial intent and research cost.

Score the decision qualitatively from 1-5 on:

| Factor | Question |
|---|---|
| Search opportunity | Is there meaningful demand across more than one useful family job? |
| Existing discovery | Is Google already testing one or more current pages? |
| Commercial depth | Is there lodging or another decision surface with revenue potential? |
| Product differentiation | Can constraints, current evidence, comparison, or tooling improve the result? |
| Execution leverage | Can an existing page be improved before adding URLs? |
| Competition/risk | Can Family Tripwise be useful without pretending to possess local, firsthand, review-scale, or booking advantages? |

Do not add overlapping keyword rows and present the result as unique traffic. Do not select a city from one headline-volume query alone.

Output: a dated cross-city table, evidence classification, decision, runner-up order, and limitations.

## Stage 2: Build the Query Universe

For the selected city, sample at least these families when evidence exists:

- `things to do in {city} with kids` and word-order variants;
- age: toddler, baby, young kids, tween, teen;
- stay: where to stay, best area, neighborhood;
- hotels: family-friendly, kid-friendly, best family hotels, resorts, suites, pool/waterslide;
- itinerary: one day, weekend, three day, family itinerary;
- weather: rain, indoor, heat, winter;
- value: free, cheap, budget;
- context: local/weekend, first trip, without a car;
- friction: stroller, nap, walking, transit, parking, sensory, mixed ages;
- activity anchors revealed by suggestions, SERPs, GSC, and community questions.

Record the exact query, source, market, collection date, volume/KD when available, and likely user job. `n/a` is unavailable, not zero.

Output: a query-universe table that is broad enough to reveal page boundaries.

## Stage 3: Collect SERP-Overlap Evidence

Sample representative queries from every meaningful family. For each query record:

| Field | Requirement |
|---|---|
| Collection date | Exact date. |
| Query and market | Exact phrase and US default unless explicitly changed. |
| Search intent | The decision the searcher is trying to make. |
| Ranking pages/domains | Representative recurring URLs and domains. |
| Page type | Guide, list, hotel list, area guide, itinerary, official page, OTA, forum, video, map/local result. |
| SERP features | PAA, local/map, hotel pack, top sights, video, social, AI summary, forums. |
| Overlap rationale | Why queries belong together or need separate pages. |
| Confidence | High, medium, or low with a short reason. |

Cluster when multiple sampled queries share recurring pages/domains and the same user job. Split when the ranking page type or required decision materially changes, even if the words are similar.

Examples:

- Hotel, resort, and kid-friendly hotel queries can share one named-property page when the same lists rank.
- `Where to stay` can remain an area/constraint page when searchers need a base decision, even if some hotel-list pages also rank.
- Toddler, indoor, or free variants can begin as filters/modules when SERPs are blended and demand is modest.
- Current-events queries require a freshness workflow; do not fold them casually into evergreen pages.

Output: a source-dated SERP-overlap cluster map.

## Stage 4: Inspect Ranking Pages

Open a representative set for each meaningful cluster:

- official tourism or attraction source;
- local or specialist publisher;
- family travel publisher/blog;
- OTA/review platform for lodging;
- community result when it ranks;
- smaller page that ranks despite weaker apparent authority.

For each, document:

- what questions it answers well;
- what is difficult to compare or decide;
- what is stale, generic, repetitive, or weakly evidenced;
- what authority, firsthand experience, inventory, or review scale we cannot copy;
- what structural, research, freshness, map, filter, or decision-support opportunity we can honestly pursue.

The working differentiation is disciplined quality: current source-backed information, clean comparison, family-constraint routing, compact detail, useful maps, and bounded review synthesis. It does not require a contrived novelty claim.

Output: a ranking-page analysis table and a concise opportunity statement.

## Stage 5: Derive Persona Hypotheses

Use query modifiers, recurring parent/community questions, ranking-page gaps, and product constraints. Do not invent demographics.

For each persona hypothesis document:

- job-to-be-done;
- trip context;
- evidenced child-age or pace constraints;
- anxieties;
- decision criteria;
- failure mode;
- queries and pages that serve it.

Keep the set small enough to use, normally four to six. Personas are review lenses, not separate pages by default.

Output: reusable persona cards or a persona table.

## Stage 6: Audit Every Relevant Page

Audit every canonical/indexable page for the city and every relevant unpublished prototype.

Page-level fields:

- full production URL or repo path;
- search intent and cluster role;
- GSC state and directional demand;
- personas served;
- current strengths;
- missing decision support;
- evidence/trust gaps;
- internal-link gaps;
- overlap/cannibalization risk;
- verdict: keep, expand, consolidate, observe, or retire;
- next eligible action and blocker.

Then perform a section-level usefulness review for any page considered for implementation. Examine every visible block, including hero, intros, cards, tables, filters, detail sections, routes, FAQs, trust language, and sources.

For each section decide:

- keep;
- compress;
- merge;
- move;
- replace;
- remove.

Review for user value, verbosity, within-page repetition, search intent, persona usefulness, current evidence, unsupported firmness, scan cost, and promised-versus-delivered content. Cross-page overlap is acceptable when each page has a distinct job; repeated content within one page needs a reason.

Output: a full city status table and implementation-ready editorial audit.

## Stage 7: Decide the Page Architecture

Assign one primary job to each URL. Typical roles are:

- all-ages activity hub and router;
- age specialist only when the SERP/demand is distinct;
- named family-hotel comparison;
- stay-area/property-constraint guide;
- itinerary/pacing tool;
- weather/budget module or page only when evidence supports a separate result set.

Prefer filters and modules for meaningful constraints with little evidence of standalone intent. A query modifier is not automatically a page.

Before proposing a new URL, state:

1. Which observed SERPs demand a different page type?
2. Which current page cannot satisfy the job without becoming confusing?
3. Which existing URL might cannibalize it?
4. Can the page receive useful internal links from the city cluster?
5. Can the evidence and update workflow keep it genuinely useful?

Output: prioritized city page map with keep/build/improve/observe decisions.

## Stage 8: Promote One Implementation

Promote exactly one bounded next action unless the user explicitly authorizes a larger batch.

Default order:

1. strongest existing hub or decision page;
2. distinct existing specialist page;
3. one newly justified high-intent page;
4. supporting stay/itinerary cleanup after dependencies settle;
5. later modules/pages only when evidence warrants them.

Define:

- one primary target URL;
- exact or bounded paths;
- research/evidence work required before writing;
- every-section review requirement;
- persona and competitor acceptance criteria;
- trust and human-review boundaries;
- internal-link behavior;
- native, focused, visual, privacy, and reviewer QA;
- release invariant;
- measurement plan.

Do not edit an actively protected URL unless a technical defect or explicit user override permits it. Do not create more than three indexable pages or a new destination without user approval.

## Stage 9: Implement and Review

Implementation sequence:

1. Re-read the action contract and current state.
2. Refresh volatile facts and inspect a wider candidate pool; list length is not a quota.
3. Update source/generator paths first when pages are generated.
4. Keep claims proportional to evidence and route trust-sensitive unknowns correctly.
5. Regenerate and prove unrelated outputs are stable.
6. Run focused tests, full repository tests, native SEO QA, responsive browser checks, link/source checks, privacy checks, JSON validation, and `git diff --check` as applicable.
7. Invoke a different independent read-only reviewer on the complete diff.
8. Fix P0-P2 findings and re-review for at most three cycles. Proceed only on `PASS` or `PASS_WITH_P3`.
9. Stage exact paths, inspect every unpushed commit/path, fetch origin, require no divergence, commit, and push only reviewed work.
10. For deployable changes, monitor the native Pages workflow and verify the release marker plus action-specific production invariants.

## Stage 10: Close The Release

After a successful deployment:

- verify the workflow head SHA and release marker;
- run production SEO QA and the predeclared content/behavior invariant;
- return the commit, Pages run, production results, and reviewed range in the structured handback;
- let the Control Room record post-release evidence centrally and reconcile scheduler state;
- do not amend or create a repository commit solely to backfill commit, workflow, deployment, or production fields.

Before the release commit, repository narratives may correctly say `review-clean; release pending`. A later repository reconciliation is allowed only when it is part of another authorized transaction or is itself explicitly dispatched or directly requested by the user, as with `FT-OPS-001`. Run `node tools/operator-state-qa.mjs` whenever such a reconciliation records release evidence.

Output: one verified central handback and no repository-only backfill commit.

## Stage 11: Measure and Continue

Measurement begins with state, not a calendar reminder:

- confirm production release;
- wait for a current Google crawl of the changed URL;
- inspect public-safe GSC page evidence;
- use protected query evidence only through the approved private workflow;
- compare discovered query families with the intended role;
- record indexing, impressions, position, clicks/CTR when nonzero, and internal-link/crawl observations;
- avoid causal claims from tiny or short-window data.

Continue when one of these is true:

- current evidence identifies a concrete content, intent, or crawl gap;
- the next page is already justified by the city decision pack;
- a technical or trust defect preempts normal order;
- the user explicitly changes priority.

Do not generate an edit merely because a weekly scan ran or a nominal observation date arrived.

## Technical Maintainability Gate

Before starting a city implementation, confirm that:

- the page can be generated or upgraded without editing unrelated city specifications;
- an isolation test can prove the exact output set;
- shared CSS changes are narrowly named and visually checked;
- the generator remains idempotent;
- content evidence is not embedded in a way that prevents source-date refresh.

If those conditions cannot be shown, promote a behavior-preserving tooling task first. Do not hide a broad generator refactor inside a content transaction.

## Required Durable Artifacts

Each city should eventually have:

1. a dated cluster research/decision pack in `docs/research/`;
2. a page-level status table in `status/` with full URLs;
3. implementation-ready section audits for pages being changed;
4. source/evidence records for hotel or other volatile claims;
5. roadmap and backlog state linked by action ID;
6. independent review evidence in `ops/operator-review.md`;
7. production and measurement evidence after release.

## City Status Table Template

| Page | Full URL | Est. demand/mo | Current GSC rank | Target rank | Top query families | Persona review | Competition review | Section review | Current status | Remaining / blocker | Next action |
|---|---|---:|---|---|---|---|---|---|---|---|---|
| All-ages hub | `https://familytripwise.com/...` | source-dated estimate | page-level only | Top 20, then Top 10 where plausible | 2-3 examples | complete/needed | complete/needed | complete/needed | live/draft | concrete gap | one bounded action |

Notes:

- `Current GSC rank` is the page-level average position unless protected query data supports a query-specific statement.
- Query examples are targets unless explicitly labeled as protected GSC observations.
- Demand estimates identify the source, market, collection date, and overlap limitation.
- `UNKNOWN` is preferable to fabricated precision.

## Reusable Review Stack

Every substantive city page should receive:

- search-intent and SERP-overlap review;
- representative ranking-page review;
- persona usefulness review;
- every-section editorial review;
- evidence, freshness, and claim-safety review;
- within-page repetition and scan-friction review;
- internal-link and cannibalization review;
- technical SEO and structured-data review;
- mobile/desktop visual and interaction review;
- independent final read-only review.

Hotel pages additionally follow the durable hotel evidence protocol: official property facts, rough current price ranges, bounded recent online-review themes and conflicts, freshness, useful optional room details, unresolved unknowns, direct map context, and human review for claims the research cannot independently support.
