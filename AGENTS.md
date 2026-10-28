# Agent Instructions

## Project

This repository is for building a family travel planning site and AI product. The product should help parents plan realistic trips with children, including where to stay, what to do, family hotel selection, stroller/transit difficulty, nap-friendly itineraries, weather backup plans, and family-specific review summaries.

## Operating Principles

- Treat SEO research as product input, not as a request to generate thin content.
- Prioritize helpful, structured, human-reviewable pages over generic AI-written travel prose.
- Build research authority rather than implying local or firsthand authority the project does not have. Family Tripwise's durable advantage is a maintained evidence layer that turns current official facts, online-review signals, community questions, maps, prices, policies, conflicts, and unknowns into faster family decisions.
- AI should improve evidence collection, normalization, comparison, refresh, and constraint routing. AI-generated prose or a summary of other pages is not by itself original value.
- Use the US search market as the default unless a task explicitly says otherwise.
- Keep destination normalization consistent:
  - NYC, New York, and New York City map to `New York City`.
  - Oahu, Honolulu, and Waikiki are related but should remain separate when search intent differs.
  - Disney World and Orlando can be grouped, but Disney-specific terms must be marked.
  - London UK and London Ontario must be disambiguated.
  - Paris France and Paris TX must be disambiguated.
- Prefer interactive tools, tables, maps, filters, and decision flows over long static copy.
- Hotel, area, transit/stroller, and family-fit guidance may be published from a documented high-quality research workflow when claims are clearly labeled as research-based, source-backed, date-stamped, and uncertainty-aware.
- Human review is still required before publishing any personally verified experience, safety assurance, exact route/stroller practicality verdict, or firm family-suitability claim that the research record cannot independently support.

## SEO Rules

- Treat `strategy/seo-doctrine.md` as the current decision doctrine. Depart from it only when fresh project evidence, current SERP evidence, or explicit user direction supports the exception.
- Do not use page count, publishing frequency, exact-match variants, competitor inventory, or calendar cadence as authority strategies. Every new URL needs a distinct SERP-supported user job and maintainable information gain.
- Do not diagnose a CTR problem from aggregate page/property data while aligned query cohorts average worse than position 20. Normal title/snippet experiments require a coherent relevant query family, at least 100 finalized 28-day impressions, current crawl state, and live-SERP evidence.
- Start with destination clusters where query volume, commercial intent, and SERP weakness overlap.
- Highest-intent pages:
  - `where to stay in {destination} with kids`
  - `best family hotels in {destination}`
  - `best area to stay in {destination} with kids`
- Medium-high intent pages:
  - `things to do in {destination} with kids`
  - `{destination} itinerary with kids`
- Medium intent pages:
  - `{destination} family vacation`
  - `kid-friendly {destination}`
  - `{destination} with toddlers`
  - `{destination} with teens`

## Product Rules

- Every destination cluster should eventually support:
  - Where-to-stay recommender
  - Family hotel shortlist
  - Things-to-do list with age filters
  - Nap-friendly itinerary builder
  - Rainy-day backup planner
  - Map export
  - Packing list by season and child age
- Do not present AI output or desk research as personally verified experience unless a human has reviewed or supplied the experience.
- Label estimated, model-derived, review-signal-derived, and research-based scores clearly.
- Keep official facts, booking observations, online-review signals, community hypotheses, estimates, editorial interpretation, and human-verified experience distinct. Do not call online-review synthesis a Family Tripwise review.
- Prefer one validated record source for visible page comparisons, downloads, structured data, and agent answers so public outputs cannot silently disagree.
- Hotel shortlists must keep a durable evidence record covering official property facts, current booking/fee checks, review-signal themes, conflicting reports, freshness, and unresolved unknowns.
- Approximate nightly prices are a core family-budget comparison field. Preserve useful source-backed planning ranges rather than removing them merely because live quotes or complete stay totals are unavailable. Show currency, per-room/per-night (or other) unit, room and party basis, stay-date/season basis, observation date and known tax/fee inclusions or exclusions; label missing basis explicitly. Keep this context in shared tables/downloads. Never invent ranges, present stale observations as current quotes, or use an unrelated two-adult rate as a family-room price. Missing or stale bands are a prioritized research gap, not permission to omit budget research indefinitely; follow `docs/plan/hotel-research-engine.md`.

## Repository Conventions

- Keep research in `docs/research/`.
- Keep execution and product planning in `docs/plan/`.
- Operator state lives in three small files: `ops/STATE.md` (working state, ≤8 KB), `ops/QUEUE.md` (ordered work, ≤15 items) and `ops/OWNER.md` (owner decisions and owner-only tasks). Run notes go in `ops/runs/YYYY-MM.md`. Codex-era logs are frozen in `archive/2026-10/`; grep them only when a queue item needs a past decision, never edit them.
- Keep dated, public-safe GSC decision summaries in `ops/gsc-snapshots/`. Never commit GSC credentials, tokens, complete raw query exports, country/device rows, or user data.
- Keep source code in `src/` once implementation starts.
- Keep content templates in `docs/plan/content-strategy.md` until a CMS or content model exists.
- When adding app code, include a simple local setup path in `README.md`.

## Operator Cycle (from 2026-10-27)

- Scheduler: one owner-created cloud scheduled task (hourly 2026-10-27 to 2026-10-30 10:00 ET, then every 4 hours), until 2026-11-13 17:00 America/New_York. It is the only scheduler and the only writer; it claims a run lock in `ops/STATE.md` before any work. No runs on the owner's Mac. Do not create or change scheduled tasks or restart any Codex automation. After the cutoff, do no project work until the owner reauthorizes it.
- Caps: at most one transaction per run; no daily limit unless `ops/STATE.md` `caps:` sets a `daily_cap` (owner removed it on 2026-10-27). A transaction is one family problem taken through evidence, implementation, tests, rendered QA, independent review and verified release. Never manufacture work to fill a run; no-op runs exit without committing.
- Selection: work `ops/QUEUE.md` top to bottom, live-site defects first. Do not pick anything on its NOT NOW list. A narrow blocker blocks only its item.
- Approvals (`ops/OWNER.md` Approved row required): new destinations, URL removals or redirects, noindex or other indexability changes, edits touching more than three public pages (except the batches approved there), and all external actions (indexing requests, sitemap submission, analytics, outreach, posting, accounts, link placement or purchase, spending).
- New URLs for existing destinations need current SERP evidence of a distinct user job, material demand, a maintainable evidence layer and no clean fit in an existing URL; record the check in the queue item.
- Evidence integrity (unchanged): never invent prices, fees, availability, room/age acceptance, safety, stroller or route practicality, or firsthand experience. Keep official facts, booking observations, estimates and review signals labelled. Prices keep currency, unit, party/room/stay basis, observation date and known exclusions. A date passing or a wording change never renews a fact. Never publish a forward-looking "review due/recheck by" date, a price sample whose stay dates have passed, or a price band that was not observed.
- Search data: paid DataForSEO research runs only while `ops/OWNER.md` has an Approved D8 row. Then, for keyword demand or live Google SERPs, commit a request file to `ops/research-requests/` (see its README); the "DataForSEO research" GitHub workflow runs it with a repository secret and commits the receipt to `docs/research/dataforseo-*.json`, which a later run reads. Never handle the DataForSEO credential directly. Free WebSearch remains fine for quick SERP checks.
- Sources: fetch official venue, hotel and operator pages at most once per URL per run and once per week, honoring robots.txt and Crawl-delay; keep dated extracted facts, not raw bodies. Never fetch third-party review sites automatically, bypass logins, blocks or CAPTCHAs, or retry an unchanged denial.
- QA and review: `node --test tools/*.test.mjs` and `node tools/seo-qa.mjs` must pass. Site changes also need headless Chromium (Playwright) checks at 1280, 390 and 320 px (no horizontal overflow, no console errors, keyboard order, no-JS fallback). A separate read-only reviewer must return PASS or PASS_WITH_P3; fix P0–P2, at most three cycles.
- Release: fast-forward pushes to `main` only after QA and review. For site changes, delivery means `https://familytripwise.com/release.json` shows the merged SHA and each changed URL shows the change. Never force-push, rebase, reset, rewrite history or discard anyone's work.
- The repository is public: never commit credentials, personal data, raw GSC query exports, or country/device rows. GSC page averages orient; they do not prove a CTR problem, and measurement gates do not apply below 100 clicks per 28 days (`strategy/seo-doctrine.md` §6a).
