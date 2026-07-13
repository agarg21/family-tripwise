# Codex Instructions

## Project

This repository is for building a family travel planning site and AI product. The product should help parents plan realistic trips with children, including where to stay, what to do, family hotel selection, stroller/transit difficulty, nap-friendly itineraries, weather backup plans, and family-specific review summaries.

## Operating Principles

- Treat SEO research as product input, not as a request to generate thin content.
- Prioritize helpful, structured, human-reviewable pages over generic AI-written travel prose.
- Use the US search market as the default unless a task explicitly says otherwise.
- Keep destination normalization consistent:
  - NYC, New York, and New York City map to `New York City`.
  - Oahu, Honolulu, and Waikiki are related but should remain separate when search intent differs.
  - Disney World and Orlando can be grouped, but Disney-specific terms must be marked.
  - London UK and London Ontario must be disambiguated.
  - Paris France and Paris TX must be disambiguated.
- Prefer interactive tools, tables, maps, filters, and decision flows over long static copy.
- Human review is required for hotel recommendations, area recommendations, safety notes, transit/stroller advice, and any claims that could materially affect a family trip.

## SEO Rules

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
- Do not present AI output as personally verified experience unless a human has reviewed or supplied the experience.
- Label estimated or model-derived scores clearly.

## Repository Conventions

- Keep research in `docs/research/`.
- Keep execution and product planning in `docs/plan/`.
- Keep source code in `src/` once implementation starts.
- Keep content templates in `docs/plan/content-strategy.md` until a CMS or content model exists.
- When adding app code, include a simple local setup path in `README.md`.

## Portfolio Operator Pilot

- Family Tripwise is enrolled in the central SEO Portfolio Operator at `/Users/apoorvagarg/Documents/SEO Agent/seo-lab/operator/`.
- The central runner may make path-scoped code changes directly in the local `main` checkout during the supervised pilot.
- This repository remains the source of truth for site code, strategy, trust rules, and human-review requirements.
- The operator owns cross-run evidence, observation windows, experiment selection, and portfolio reporting.
- Do not change a URL protected by an active observation window unless a technical defect requires it. Unrelated development may proceed.
- Preserve pre-existing dirty files, inspect the diff before and after changes, and do not push or deploy without explicit authorization.
- Implement an approved operator experiment in this repository or an isolated worktree, then run the native QA commands before deployment.
- Every operator implementation must be reviewed by an independent reviewer subagent in the same run and recorded in `ops/operator-review.md` before it is considered complete.
- The implementation operator must address P0-P2 findings and request re-review, for at most three review cycles. It may commit only after `PASS` or `PASS_WITH_P3`, green QA, and exact-path staging.
- Commits are authorized on the local `main` checkout after review consensus. Push, deployment, publishing, indexing requests, outreach, and external-account mutation remain prohibited.
