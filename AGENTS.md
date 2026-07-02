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

