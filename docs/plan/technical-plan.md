# Technical Plan

## Current Architecture

The production site is a dependency-free static site deployed through GitHub Pages:

- generated HTML in `site/`;
- shared styling in `site/styles.css`;
- small progressive-enhancement scripts in `site/`;
- deterministic generation and page upgrades in `tools/generate-pages.mjs` and `tools/upgrade-priority-pages.mjs`;
- page-specific regression tests plus repository SEO QA in `tools/`;
- machine-readable operating state in `ops/seo-roadmap.json`.

This architecture is appropriate for the present 28-page site. A framework migration is not justified by current product needs.

## Maintainability Direction

The generation layer now carries material scaling debt: the base generator and page upgrader together exceed 4,300 lines, mix destination content with HTML transforms, and rely on exact-string or regular-expression replacement. That remains deterministic and well tested, but it makes parallel city work and future autonomous edits harder to reason about.

Before several more city revamps, perform a behavior-preserving modularization:

1. Extract shared escaping, schema, block replacement, source-list, and file-write helpers.
2. Move destination and page specifications into city/page-type modules.
3. Keep one explicit command that regenerates the complete site deterministically.
4. Preserve byte-for-byte output during the refactor unless a separately reviewed page change is declared.
5. Keep focused isolation tests proving a city change cannot mutate unrelated pages.

Do not combine this refactor with a city content rewrite. Do not adopt a CMS, database, Next.js, Astro, or TypeScript solely to make the repository look more conventional.

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
3. Completed: durable research-based family-hotel evidence and comparison workflow in three cities.
4. Next technical milestone: modularize the deterministic generation layer without changing public output.
5. Next product milestones remain evidence-triggered: reusable itinerary interaction, weather backup, map export, and lawful refreshable review synthesis.

## Open Technical Questions

- When page count and update frequency justify a CMS or structured content store.
- Whether direct Google Maps links, Google My Maps embeds, or a later map provider best serve each page.
- How to source and refresh hotel review data legally and reliably.
- How much of the itinerary builder should be deterministic vs LLM-generated.
- How to refresh volatile hotel facts without turning scan cadence into manufactured content work.
