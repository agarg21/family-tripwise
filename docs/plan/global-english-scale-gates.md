# Global English Family-Travel Scale Gates

FT-RES-152 / LRN-243. Researched October13,2026 Eastern. This is a proposed operating design, not an implemented automatic refresh service or a mass publishing plan. Evidence, current counts, source dates and demand limitations: [scale audit](../research/global-family-travel-scale-audit-2026-10-13.json).

## North Star

Become the most useful, trustworthy informational resource for family travel worldwide by maintaining decision-quality information and data. Measure whether a parent can answer a specific choice with current constraints, comparisons and uncertainty. City count, generated prose, commits and publishing frequency are not success metrics. "Best" is the ambition, not a current comparative claim.

The user's fresh direction supports global English-first research and conditional expansion after the maintenance foundation is proven. Countries need not have English as an official language: English-speaking travelers also visit elsewhere. Keep four dimensions separate: destination country/city, traveler search market, published language and source language. English-first does not mean US-only demand; the existing paid collector currently fixes US English. Non-US numeric research needs a reviewed market-aware adapter and an authorized batch, not relabeling US data.

No new scheduler, translation rollout, spending expansion or operational-window extension is implied. The October12-15 sprint and November13 cycle cutoff remain. All publication, independent review, human-evidence and security gates still apply. No large city batch is authorized by this research transaction. Scheduled continuation still depends on the local computer, project and app being available; these proposed milestones are not a promise of uninterrupted runtime.

## Existing Foundation

Reuse the repo's Node tooling and single evidence writer. `site-maintenance.mjs` covers all36 current canonical pages, including33 travel pages and3 utilities, offline. `evidence-audit.mjs` inventories/deduplicates allowed sources, limits concurrency and response size, carries denied access forward, discards source bodies and retains hashes/limited extraction candidates. `weekly-evidence-review.mjs` queues changed/due/unknown evidence. Typed room, price, activity and policy adapters already keep source clocks and party/category conditions separate.

This is valuable triage, not claim-complete refresh. Current offline results include54 legacy hotel price-basis gaps,57 due price records,333 activity-card atomic-source gaps and1512 unmapped planning decision fields. Counts overlap contracts and are not counts of false claims. The most recent collected weekly audit is October7, not this offline October13 check. It covered31 pages/455 sources and queued116 changes,93 collection gaps and354 due/unknown fields. Its216 comparable retrieved sources do not establish which changes affected facts; neither changes nor HTTP200 renew evidence.

Current offline inventory is507 source URLs across170 hosts;53 have no retained prior source record. The500-entry collection bound therefore requires coverage-aware batching. An offline report or sample is not a fresh507-source scrape. Source access restrictions remain narrow holds, not permission for browser/origin/proxy recovery.

## Proposed Refresh Pipeline

| Layer | Responsibility | Gate |
| --- | --- | --- |
| Source registry | Stable source/entity/claim IDs, exact permitted URL, source class/language, owner, access/retention policy, refresh interval and affected pages | Source-level robots/terms/license/access review; an allowlist alone is not a permission or robots evaluator |
| Collection | Prefer permitted official APIs/feeds/structured HTML; source-specific adapters for accessible pages; typed PDF handling only after a reviewed adapter | Domain pacing, robots-aware parser, timeout/size/redirect controls, no login/challenge evasion; preserve denied state and attempt dates |
| Checkpointing | Immutable run manifest and per-source attempt events; bounded resumable batches under current request limits | Every inventoried source accounted for as retrieved, held, failed or explicitly deferred; interruption cannot erase or duplicate outcomes |
| Claim extraction | Parse stable structured fields deterministically; use LLM candidates for ambiguous text/change classification | Exact supporting source/section/hash, entity/category/date/conditions and extraction method; schema validation, nulls and contradictions retained |
| Reconciliation | Compare old/new typed claims, join room/party/stay/fees, classify meaningful versus navigation-only changes | Model cannot approve evidence, infer missing ages/prices or select a convenient conflicting source |
| Review and release | Prioritize family-impacting differences, validate the named decision, independent review, exact-path release | Native focused/full QA; site changes add desktop/mobile/keyboard, production marker/SEO/URL invariants; human gates remain separate |

An LLM gets untrusted source text as data, no credentials, shell, network tools, repository write permission or publication authority. Require bounded structured proposals with provenance; instructions inside source text are never instructions to the worker. Self-reported confidence is not validation. Model choice, API use, costs and credential reuse need their own approved implementation scope; no LLM service was deployed in this audit.

Do not persist copied review bodies, reviewer identifiers, travel-party personal data or proprietary page archives in public Git. Use permitted short factual records and hashes; any private processing retention needs an explicit source-aware policy. Keep official facts, OTA observations, estimates, review signals and editorial interpretation distinct. Source-language extraction/translation needs original provenance and a language-quality check; high-stakes claims cannot be casually machine-translated into assurances.

Weekly collection is a detection cadence, not a requirement to rewrite every page weekly. Keep existing price14-day, official-policy30-day and review60-day clocks unless a reviewed source-specific rule changes them. A verified material closure/conflict can trigger earlier intervention; critical volatility may require tighter monitoring within the existing scheduler and authorized runtime. Show historical/unknown fields honestly when no defensible replacement exists. Currency conversion is a dated derived estimate and never renews the native room price.

## Build Order And Scale Gate

1. **Implement a coverage/checkpoint pilot next.** Reuse the current collector, preserve its500 bound and denial rules, and register exact new paths before coding. Add pure fixtures for507 and1001 inventory entries, deterministic batching, interruption/resume, no duplicate attempts, newly added sources, held denials and a changed manifest. A complete run must account for every source without claiming every source was accessible. Do not remove limits or create another scheduler.
2. **Pilot claim deltas before broad LLM extraction.** One existing hotel room/fee job plus one existing attraction admission job. Map the decisive fields to stable source sections; keep published values/clocks unchanged until separately reviewed. Label a small permitted/synthetic gold corpus with no-change, real policy change, navigation noise, contradictory policy, missing age, wrong room/party, stale price, denial, interrupted fetch and source prompt injection. Evaluate deterministic extraction first; the LLM is an optional bounded comparator, not the source of truth.
3. **Demonstrate weekly operation.** Use the next real existing weekly gate, not a same-day repeat as reliability proof. Proposed expansion acceptance:100% run-manifest accounting,100% provenance for a new page's decisive published fields, zero unreviewed mutations/date renewals, zero leaked private data, all seeded critical changes caught, and at least95% precision on the explicitly labeled pilot claim-change set. These are proposed thresholds, not observed performance or population-wide accuracy. Inspect all false negatives and retain the evaluation sample limits.
4. **Clear maintenance capacity before large growth.** Observe two real weekly cycles after the pilot. Report meaningful changes resolved, unresolved critical due work, maintainer minutes per task/page, fetch/LLM cost, failure/denial/deferred rates and review turnaround. The unresolved critical queue must not grow because of new cities. If it does, pause large expansion and fix the bottleneck; independent small qualified work may still proceed.
5. **Expand one evidence-qualified cluster at a time.** Select destinations by English traveler demand, distinct current SERP job, evidence accessibility, maintainability and expected decision value, not country coverage quotas. Each candidate needs complete source ownership, room/age/fee/budget context, accessible comparisons and release gates. Miami is the current concrete test case; its exact-family budget/acceptance work remains next eligible destination qualification, not a launch here.

A framework change is not required simply because scale is desired. Scrapy's existing robots, cache and throttling components illustrate mature options, but a Python crawler migration is not selected. Reuse the existing Node patterns and adopt proven parsers/components only where they solve a measured missing capability.

## Broader Search Research

Two lanes share the same maintained data: destination decisions and cross-destination family constraints. Before adding URLs, test paired same-market queries, result type/ownership, material demand, current-page fit and maintainable information gain. Do not transfer hotel volume to activity pages or add close variants together.

| Cluster | Decision worth qualifying | Current numeric evidence |
| --- | --- | --- |
| Budget/deals | Compare an exact family's room, fees, meals and offer eligibility | Historical US September estimates: deals5400; all-inclusive deals2900; not total cluster sizes |
| Family size/rooms | Exact sleeping places, confirmed connections, kitchen and same-party budget | Historical family-of6 resort phrase140; other specific variants remain unknown |
| Flying/airline logistics | Stroller gate-versus-counter rules, extra-item fees and family conditions by operating carrier | Fresh numeric demand pending; source-specific policy conflict observed, not a publishable universal rule |
| Packing | Age/trip/season/laundry and actually permitted baggage constraints | Fresh numeric demand pending; generators and worked packing tables already exist |
| Rail/car-free | Family fare conditions plus arrival/base costs, without an unsupported route verdict | Fresh numeric demand pending; prior WATCH is not qualification |
| Pace/weather | Rest/meal/indoor alternatives with age, opening and fee context | Fresh numeric demand pending; generic itinerary prose is not an unmet job |
| Care/teen activities | Service-specific age, parent-present/session rules and room-plus-care budget | Specific demand unknown; existing care evidence gaps remain |
| Cruises/groups | Exact ship/sailing/cabin or group-room conditions and mandatory costs | Historical cruises2027 phrase590; multigenerational vacations110; not transferred to broad cruise queries |

Reject a generic packing list or user-input-only budget calculator as differentiated value: inspected publishers already offer those formats. Test a specific maintained airline/room/fee/laundry handoff instead. Health, safety, immigration and accessibility topics may have demand but carry separate high-stakes/human evidence requirements; do not make them a fast autonomous expansion lane.

Fresh paid breadth research awaits the user's response to the narrower existing-cap question. No broad paid call, new budget or subscription is inferred. Once approved, register an exact keyword/SERP manifest; keepUS first because that is the existing validated adapter, then add explicitly researched traveler markets with separate metrics. Nulls, measurement dates and histories remain visible. Country, region, city and airport entities stay disambiguated; no language-country duplicate pages or speculative hreflang setup. Later translated editions need real language variants and reviewed localization, not translated boilerplate.

## Primary Guidance

Google distinguishes [language and regional targeting](https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites) and prohibits [scaled low-value content](https://developers.google.com/search/docs/essentials/spam-policies); scale itself is not the product benefit. [RFC9309](https://www.rfc-editor.org/rfc/rfc9309.html) specifies robots rules but does not grant access authorization. Scrapy documents [robots/cache middleware](https://docs.scrapy.org/en/latest/topics/downloader-middleware.html) and [error-aware throttling](https://docs.scrapy.org/en/latest/topics/autothrottle.html). [OWASP's prompt-injection guidance](https://genai.owasp.org/llmrisk/llm01-prompt-injection/) supports isolating untrusted external content and limiting model privileges. Accessed October13 Eastern; documentation publication dates are unknown unless displayed. These support the proposed guardrails, not a claim that our implementation already has them.
