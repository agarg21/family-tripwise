# Technical Plan

## MVP Architecture

The first implementation should be simple:

- Static or hybrid-rendered SEO pages.
- Structured destination data.
- Interactive planning widgets.
- AI-assisted summaries behind explicit user actions.

Candidate stack:

- Next.js or Astro for SEO-friendly pages.
- TypeScript.
- Markdown/MDX for early content.
- JSON/YAML for destination data.
- A lightweight database later for saved itineraries and user preferences.

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

### Area

- `id`
- `destination_id`
- `name`
- `best_for`
- `avoid_if`
- `transit_score`
- `stroller_score`
- `budget_band`
- `nearby_attractions`

### Activity

- `id`
- `destination_id`
- `name`
- `age_min`
- `age_max`
- `cost_band`
- `duration_minutes`
- `indoor`
- `stroller_friendly`
- `rainy_day`
- `booking_recommended`
- `lat`
- `lng`

### Hotel

- `id`
- `destination_id`
- `area_id`
- `name`
- `family_fit_score`
- `pool`
- `breakfast`
- `kitchen`
- `suite_options`
- `cribs`
- `noise_risk`
- `review_summary`

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

## Initial Implementation Milestones

1. Create static destination pages from structured data.
2. Add first interactive recommender for `where to stay`.
3. Add activity filtering by kid age, cost, indoor/outdoor, and stroller fit.
4. Add itinerary builder.
5. Add hotel review summarization workflow.

## Open Technical Questions

- CMS vs MDX for the first 100 pages.
- Whether to use a map provider immediately or export Google Maps links first.
- How to source and refresh hotel review data legally and reliably.
- How much of the itinerary builder should be deterministic vs LLM-generated.

