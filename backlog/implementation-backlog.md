# Implementation Backlog

Last updated: 2026-07-07

## Active

No implementation task is currently active. The SRR-001 handoff is ready below.

## Ready

### IMP-001: Add Static Site SEO QA Script

Status: ready

Recommendation label: `test`

Priority: P0

Source: SRR-001 audit, 2026-07-07

Implementation scope:

- Add a local validation command that checks:
  - every `site/sitemap.xml` URL maps to a local HTML file;
  - sitemap URLs return 200 in production when network checks are enabled;
  - internal relative links in `site/**/*.html` resolve locally;
  - every JSON-LD block parses as valid JSON;
  - pages below a configurable word-count threshold are flagged when they are included in the sitemap;
  - legacy canonical shim pages outside the sitemap are flagged for redirect/noindex review.
- Add the command to `README.md` or an npm script if a package file is introduced.

Acceptance checks:

- Current internal link problems: 0.
- Current JSON-LD parse problems: 0.
- Script flags the five itinerary pages, Chicago/San Antonio stay pages, and thin teen pages as quality-review candidates rather than silently passing them.

### IMP-002: Upgrade San Diego Itinerary Page Before Expansion

Status: ready

Recommendation label: `improve`

Priority: P0

Source: SRR-001 audit, 2026-07-07

Target file:

- `site/family-itinerary/san-diego-with-kids.html`

Implementation scope:

- Expand from a thin starter page into a decision-support page aligned with the San Diego cluster.
- Add a scannable itinerary table covering 1-day, 2-day, 3-day, toddler-paced, teen-paced, and rainy-day variants.
- Include nap/rest windows, drive/transition assumptions, stroller difficulty, meal/reset notes, and what to skip.
- Link clearly to San Diego things-to-do, toddlers, teens, and where-to-stay pages.
- Add appropriate JSON-LD if the rendered content supports it, such as `ItemList` and `FAQPage`.
- Preserve uncertainty: no personal-experience claims; mark route/pacing guidance as planning guidance unless human reviewed.

Acceptance checks:

- Page includes at least one comparison/decision table.
- Page includes official source/update notes.
- Page remains internally linked from the San Diego activity and stay pages.
- JSON-LD parses if added.

### IMP-003: Upgrade Chicago And San Antonio Where-To-Stay Pages

Status: ready

Recommendation label: `improve`

Priority: P0

Source: SRR-001 audit, 2026-07-07

Target files:

- `site/where-to-stay/chicago-with-kids.html`
- `site/where-to-stay/san-antonio-with-kids.html`

Implementation scope:

- Bring both pages up to the quality bar already used on San Diego, Las Vegas, and New York City stay pages.
- Add quick-pick area decisions, area comparison table, parking/transit/stroller/noise caveats, nearby attraction fit, and family verdict.
- Add hotel-shortlist sections only if claims are sourced and clearly marked for verification; otherwise add a "what to verify before booking" decision section instead of firm hotel recommendations.
- Add source/update notes and schema where content supports it.

Acceptance checks:

- Each page includes a comparison table.
- Each page separates area guidance from hotel recommendation claims.
- Human-review caveats appear near any hotel or area recommendation.
- JSON-LD parses if added.

### IMP-004: Decide Thin Teen Page Treatment

Status: ready

Recommendation label: `test`

Priority: P1

Source: SRR-001 audit, 2026-07-07

Target files:

- `site/things-to-do/chicago-with-teens.html`
- `site/things-to-do/las-vegas-with-teens.html`
- `site/things-to-do/san-diego-with-teens.html`
- `site/things-to-do/san-antonio-with-teens.html`

Implementation scope:

- Upgrade Chicago, Las Vegas, and San Diego teen pages to the stronger San Diego toddler-page pattern: quick picks, comparison table, detailed teen-specific activity notes, itinerary variants, source notes, and schema.
- For San Antonio teens, either upgrade to the same standard or temporarily remove from sitemap and add `noindex, follow` until it can support standalone intent.
- Ensure each upgraded teen page links back to the all-ages destination activity page and relevant itinerary/stay pages.

Acceptance checks:

- No sitemap-listed teen page remains a 350-450 word card-only page.
- San Antonio teen page has an explicit index/noindex decision.
- JSON-LD parses if added.

### IMP-005: Handle Legacy San Diego Canonical Shim Pages

Status: ready

Recommendation label: `noindex`

Priority: P1

Source: SRR-001 audit, 2026-07-07

Target files:

- `site/san-diego-with-kids.html`
- `site/san-diego-things-to-do-with-kids.html`
- `site/san-diego-where-to-stay-with-kids.html`

Implementation scope:

- Prefer explicit 301 redirects if GitHub Pages hosting setup supports them.
- If true redirects are not available, add `noindex, follow` and keep canonical links pointing to the active URLs.
- Keep these files out of `site/sitemap.xml`.

Acceptance checks:

- Legacy pages cannot compete in search with active San Diego URLs.
- Sitemap still lists only canonical active pages.

## Candidate Tasks

These need SEO Research & Review confirmation before implementation:

### IMP-006: Improve Existing Priority Page Internal Links

Status: candidate

Potential scope:

- strengthen links among things-to-do, where-to-stay, itinerary, age-specific, and methodology pages
- avoid adding new city clusters

### IMP-007: Build First Narrow Tool-Like Component

Status: candidate

Potential scope:

- age filter for activities
- area recommender prototype
- rainy-day toggle
- itinerary pacing helper

### IMP-008: Create San Diego Family Hotels Page After Human Review Path

Status: candidate

Potential scope:

- create `best family hotels in San Diego` only after hotel claims have a human-review/source workflow
- keep the current San Diego where-to-stay page as the area decision page
- separate measured property facts from editorial recommendations

## Done

None yet in the three-agent operating system.
