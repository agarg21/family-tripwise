# Technical Plan

## Current Architecture

The production site is a dependency-free static site deployed through GitHub Pages:

- generated HTML in `site/`;
- shared styling in `site/styles.css`;
- small progressive-enhancement scripts in `site/`;
- deterministic generation through `tools/generate-pages.mjs` and a compatibility export at `tools/upgrade-priority-pages.mjs`;
- explicit generation modules under `tools/page-generation/` for city data, family-hotel pages, priority-page data, and upgrade logic;
- page-specific regression tests plus repository SEO QA in `tools/`;
- machine-readable operating state in `ops/seo-roadmap.json`.

This architecture is appropriate for the present 28-page site. A framework migration is not justified by current product needs.

## Maintainability Direction

The July 28 modularization reduced the base generator from 2,610 to about 750 lines and made the old upgrader path a compatibility export. Large destination/page specifications still exist, but they now live apart from orchestration and transform logic:

- `city-data.mjs`: base destination and age-page specifications;
- `family-hotel-pages.mjs`: named hotel evidence and page renderers;
- `upgrade-page-data.mjs`: reviewed priority-page specifications;
- `upgrade-engine.mjs`: shared priority-page transforms and file updates.

Keep `node tools/generate-pages.mjs` as the one complete-site command. Preserve byte-for-byte output unless a separately reviewed page change is declared, and keep focused isolation tests proving that restoring one city target cannot mutate unrelated pages.

This refactor does not justify a CMS, database, Next.js, Astro, or TypeScript migration. Future cleanup should extract smaller shared render helpers only when a real city change benefits from it and the same byte-stability gate can be maintained.

## Data Model Draft

### Destination

- `id`
- `name`
- `aliases`
- `country`
- `region`
- `disambiguation_notes`
- `family_summary`
- `best_areas`
- `activities`
- `hotel_criteria`
- `transit_notes`
- `stroller_notes`
- `seasonality`
- `source_refs`
- `reviewed_at`

### Area

- `id`
- `destination_id`
- `name`
- `trip_style_roles`
- `avoid_if`
- `transit_considerations`
- `stroller_evidence_status`
- `budget_band`
- `nearby_attractions`
- `unknowns`
- `source_refs`

### Activity

- `id`
- `destination_id`
- `name`
- `age_min`
- `age_max`
- `cost_band`
- `duration_minutes`
- `indoor`
- `stroller_evidence_status`
- `rainy_day`
- `booking_recommended`
- `lat`
- `lng`
- `official_source`
- `checked_at`

### Hotel

- `id`
- `destination_id`
- `area_id`
- `name`
- `trip_style_roles`
- `pool`
- `breakfast`
- `kitchen`
- `suite_options`
- `cribs`
- `rough_total_nightly_range`
- `review_signal_summary`
- `review_signal_conflicts`
- `unknowns`
- `official_sources`
- `price_checked_at`
- `review_checked_at`

Binary or scored fields should be used only when the evidence genuinely supports them. Route, stroller, quiet, safety, and family-fit judgments should otherwise remain sourced notes, explicit unknowns, or human-review gates rather than false precision.

## SEO Requirements

- Clean, stable URLs.
- Server-rendered content for indexable pages.
- Schema.org where appropriate:
  - `TravelGuide`
  - `FAQPage`
  - `Hotel`
  - `ItemList`
- Internal links by destination, trip type, and age group.
- Canonical aliases for normalized destinations.

## Current Milestones

1. Completed: static multi-city pages, internal links, sitemap, and deployment QA.
2. Completed: activity filtering and a San Diego stay-decision component.
3. Completed: durable research-based family-hotel evidence and comparison workflow in all five current cities.
4. Next technical milestone: modularize the deterministic generation layer without changing public output.
5. Next product milestones remain evidence-triggered: reusable itinerary interaction, weather backup, map export, and lawful refreshable review synthesis.

## Open Technical Questions

- When page count and update frequency justify a CMS or structured content store.
- Whether direct Google Maps links, Google My Maps embeds, or a later map provider best serve each page.
- How to source and refresh hotel review data legally and reliably.
- How much of the itinerary builder should be deterministic vs LLM-generated.
- How to refresh volatile hotel facts without turning scan cadence into manufactured content work.
