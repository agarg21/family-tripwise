# Implementation Backlog

Last updated: 2026-07-08

## Active

No implementation task is currently active. IMP-001 through IMP-005 and IMP-009 are complete.

## Ready

### IMP-010: Upgrade Remaining Family Itinerary Pages

Status: ready

Recommendation label: `improve`

Source handoff:

- `SRR-004: Post-Implementation QA For Thin-Page Cleanup`

Primary files:

- `site/family-itinerary/chicago-with-kids.html`
- `site/family-itinerary/las-vegas-with-kids.html`
- `site/family-itinerary/new-york-city-with-kids.html`
- `site/family-itinerary/san-antonio-with-kids.html`
- `tools/upgrade-priority-pages.mjs` if these pages are generated or upgraded through the shared script

Goal:

Bring the four remaining itinerary pages up to the same index-worthy pattern as `site/family-itinerary/san-diego-with-kids.html`.

Required improvements:

- Add destination-specific quick route decisions.
- Add a comparison table for 1-day, 2-day, 3-day, toddler-paced, teen-paced, and rainy-day variants where relevant.
- Add nap/rest assumptions, meal/reset notes, stroller/transit or drive-time friction, and clear skip guidance.
- Strengthen cluster links to the destination's activity and where-to-stay pages.
- Preserve uncertainty with "planning guidance only" language and reminders to verify hours, tickets, weather, route conditions, safety advisories, transit/stroller access, parking, and child energy.
- Add or preserve valid `ItemList` and `FAQPage` JSON-LD where the content supports it.

Acceptance checks:

- `node tools/seo-qa.mjs` returns 0 errors and no thin-page warnings for the four upgraded itinerary pages.
- `node tools/seo-qa.mjs --production` returns 0 errors after deployment, or implementation clearly notes that production has not deployed yet.
- Internal links and JSON-LD continue to pass QA.
- No hotel, safety, transit, stroller, or route claim is presented as personally verified experience.

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

### IMP-011: Improve Home And About Trust Pages

Status: candidate

Potential scope:

- lightly expand `site/index.html` as a navigational product/home page without turning it into a generic marketing page
- expand `site/about.html` with clearer editorial methodology, source policy, update discipline, human-review boundaries, and what is model-derived vs verified
- keep both pages indexable unless a later SEO Research & Review pass finds a stronger reason to noindex

Why candidate, not ready:

- The pages are thin by word count, but they are trust/navigation pages rather than destination SEO targets.
- The remaining itinerary warnings are a higher priority because they target explicit `{destination} itinerary with kids` search intent.

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

### IMP-004: Decide Thin Teen Page Treatment

Status: done

Completed: 2026-07-07

Implementation notes:

- Upgraded `site/things-to-do/chicago-with-teens.html`, `site/things-to-do/las-vegas-with-teens.html`, `site/things-to-do/san-diego-with-teens.html`, and `site/things-to-do/san-antonio-with-teens.html` through `tools/upgrade-priority-pages.mjs`.
- Added teen quick picks, comparison tables, detailed teen-specific activity notes, itinerary variants, internal cluster links, and `ItemList` / `FAQPage` JSON-LD.
- Kept San Antonio teens indexed after upgrading it to standalone teen intent; the page now includes an explicit index decision.
- Preserved uncertainty with planning-guidance caveats and reminders to verify hours, ticketing, age/height rules, weather, transit, sibling stroller needs, and safety advisories.

Validation result:

- `node tools/seo-qa.mjs`: 0 errors, 9 warnings.
- `node tools/seo-qa.mjs --production`: 0 errors, 9 warnings.
- Teen pages are no longer flagged as thin-page warnings.

Acceptance checks:

- No sitemap-listed teen page remains a 350-450 word card-only page.
- San Antonio teen page has an explicit keep-indexed decision.
- JSON-LD parses through `tools/seo-qa.mjs`.

### IMP-005: Handle Legacy San Diego Canonical Shim Pages

Status: done

Completed: 2026-07-08

Implementation notes:

- Updated `tools/generate-pages.mjs` so the three legacy San Diego shim pages include `<meta name="robots" content="noindex, follow">`.
- Kept canonical links pointing to the active San Diego URLs.
- Kept the shim files out of `site/sitemap.xml`.
- Updated `tools/seo-qa.mjs` so legacy San Diego shims are no longer warned once `noindex` is present.

Validation result:

- `node tools/seo-qa.mjs`: 0 errors, 6 warnings.
- `node tools/seo-qa.mjs --production`: 0 errors, 6 warnings.
- Legacy San Diego shim warnings are resolved.

Acceptance checks:

- Legacy pages are marked `noindex, follow` and canonicalize to active San Diego URLs.
- Sitemap still lists only canonical active pages.

### IMP-009: Improve NYC Tourist Things-To-Do Page From Early GSC Signal

Status: done

Completed: 2026-07-08

Implementation notes:

- Upgraded `site/things-to-do/new-york-city-with-kids.html` through `tools/upgrade-priority-pages.mjs`.
- Added a near-top "First-time visitors" decision section.
- Added a tourist-trip scan matrix by age band, weather, budget, and stroller/transit friction.
- Added a tourist-vs-local-parent note that keeps the page focused on evergreen trip planning and defers local/weekend concepts.
- Strengthened internal links to the NYC where-to-stay and family-itinerary pages.
- Preserved caveats around stroller, transit, safety, and route planning as guidance requiring verification.

Validation result:

- `node tools/seo-qa.mjs`: 0 errors, 6 warnings.
- `node tools/seo-qa.mjs --production`: 0 errors, 6 warnings.
- JSON-LD parses through `tools/seo-qa.mjs`.

Acceptance checks:

- Page remains focused on evergreen tourist trip planning.
- Page includes visible decision support for first-time visitors.
- Page has stronger internal links to NYC stay and itinerary pages.
- Material stroller/transit/safety guidance is framed as planning guidance requiring verification.
