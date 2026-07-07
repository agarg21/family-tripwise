# Implementation Backlog

Last updated: 2026-07-07

## Active

No implementation task is currently active. IMP-001, IMP-002, and IMP-003 are complete.

## Ready

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

### IMP-001: Add Static Site SEO QA Script

Status: done

Completed: 2026-07-07

Implementation notes:

- Added `tools/seo-qa.mjs`.
- Added README usage for `node tools/seo-qa.mjs` and `node tools/seo-qa.mjs --production`.
- Checks sitemap URLs against local HTML files, optional production 200 responses, internal relative links, JSON-LD parse validity, sitemap-listed thin-page word count, and legacy San Diego shim pages outside the sitemap.

Validation result:

- `node tools/seo-qa.mjs`: 0 errors, 15 warnings after IMP-002.
- `node tools/seo-qa.mjs --production`: 0 errors, 15 warnings after IMP-002.
- Current internal link problems: 0.
- Current JSON-LD parse problems: 0.

Remaining QA warnings:

- Thin-page/content-depth review: `site/about.html`, `site/index.html`, four remaining itinerary pages, four teen pages, and Chicago/San Antonio where-to-stay pages.
- Legacy shim review: three root-level San Diego shim pages outside the sitemap.

### IMP-002: Upgrade San Diego Itinerary Page Before Expansion

Status: done

Completed: 2026-07-07

Implementation notes:

- Upgraded `site/family-itinerary/san-diego-with-kids.html` through `tools/upgrade-priority-pages.mjs` so the page survives regeneration.
- Added quick route decisions, a comparison table for 1-day, 2-day, 3-day, toddler-paced, teen-paced, and rainy-day variants, pacing cards, San Diego cluster links, and `ItemList` / `FAQPage` JSON-LD.
- Preserved uncertainty by labeling route details as planning guidance and telling users to verify drive times, parking, stroller routes, attraction hours, weather, and child energy needs.

Acceptance checks:

- Page includes a comparison/decision table.
- Page retains official source/update notes.
- Page remains linked from San Diego activity and stay pages.
- JSON-LD parses through `tools/seo-qa.mjs`.

### IMP-003: Upgrade Chicago And San Antonio Where-To-Stay Pages

Status: done

Completed: 2026-07-07

Implementation notes:

- Upgraded `site/where-to-stay/chicago-with-kids.html` and `site/where-to-stay/san-antonio-with-kids.html` through `tools/upgrade-priority-pages.mjs`.
- Added quick-pick area decisions, area comparison matrices, parking/transit/stroller/noise caveats, nearby attraction fit, family verdicts, and `ItemList` / `FAQPage` JSON-LD.
- Used "what to verify before booking" sections instead of firm hotel recommendations because a human-reviewed hotel workflow is not yet available.
- Added area-guidance caveats near the comparison matrices and hotel-claim caveats near the verification sections.

Validation result:

- `node tools/seo-qa.mjs`: 0 errors, 13 warnings.
- `node tools/seo-qa.mjs --production`: 0 errors, 13 warnings.
- Chicago and San Antonio where-to-stay pages are no longer flagged as thin-page warnings.

Acceptance checks:

- Each page includes a comparison table.
- Each page separates area guidance from hotel recommendation claims.
- Human-review caveats appear near area guidance and hotel-verification sections.
- JSON-LD parses through `tools/seo-qa.mjs`.
