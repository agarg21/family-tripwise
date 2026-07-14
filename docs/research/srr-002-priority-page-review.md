# SRR-002: Priority Page Index-Worthiness Review

Review date: 2026-07-14

Recommendation label: `improve`

## Decision

Keep all eight reviewed priority pages indexable. Promote exactly one next implementation: `FT-IMP-001` / `IMP-015`, a bounded trust and decision-support revision of `site/where-to-stay/las-vegas-with-kids.html` through its generator source.

The promoted implementation does not touch an active observation-window URL. It should remove or reframe firm area, hotel-fit, smoke, route, and family-suitability conclusions that do not have durable completed-human-review evidence, while preserving useful official-source checks and the page's canonical/indexable state.

## Evidence freshness

- Latest public-safe snapshot: `ops/gsc-snapshots/2026-07-13.json`.
- Classification: **reused authenticated UI import**, collected 2026-07-13 with performance data through 2026-07-12.
- Age at review: one day.
- Completeness: directional; page rows and per-URL inspection rows are absent from the normalized snapshot rather than inferred.
- Fresh API status: **not fresh API evidence**. The GSC workflow has no configured service-account secret, so it safely skipped collection instead of creating a synthetic snapshot.
- Use in this review: suitable as directional context for non-measurement research. It is not used to claim a fresh ranking, traffic, indexing, or experiment outcome.
- Fresh current checks: the 2026-07-14 deterministic operator reported healthy public checks, 22 parsed sitemap URLs, and healthy repository QA.

The older authenticated July 11 page rows are used only as a reused directional comparison. They reported five impressions and average position 28.2 for the Las Vegas stay page. No change or causal conclusion is inferred from that small sample.

## Boundaries and method

The review covered the eight pages named by SRR-002. It checked:

- sitemap/canonical/indexability state;
- visible depth and decision structure;
- internal and official-source links;
- metadata and structured data;
- trust framing and verification language;
- active URL-scoped observation windows;
- reused GSC and historical keyword-opportunity evidence.

Visible-word counts are deterministic local HTML measurements of the `<main>` content after removing markup. Link counts are local-page counts, not quality scores.

Active observation windows protect the San Diego stay page through July 27 and the listed July 11 targets through July 25. Research inspection is allowed; those URLs were not edited.

## Page decisions

| Priority page | Local evidence | Search/observation evidence | Index decision | Next action |
|---|---|---|---|---|
| San Diego things to do | 1,617 visible words; 12 internal links; 9 external sources; decision table and schema | Public-safe snapshot still carries the reused `URL unknown` result; read-only recheck due July 15; URL is not protected | Keep indexed | Monitor discovery first. Do not use the reused result as a fresh indexing conclusion or change the page before the due check merely to provoke crawling. |
| San Diego where to stay | 2,041 words; interactive checklist; 15 internal links; 12 external sources; explicit `UNKNOWN` and verification framing | Strongest known commercial signal; `FT-EXP-001` observing through July 27 | Keep indexed | Observe; no target churn. |
| Las Vegas things to do | 1,408 words; 15 internal links; 8 external sources; decision table and schema | Reused July 11 page row: 15 impressions, position 61.2; protected through July 25 | Keep indexed | Observe; no target churn. |
| Las Vegas where to stay | 1,039 words; 10 internal links; 8 external sources; decision table and schema | Reused July 11 page row: 5 impressions, position 28.2; not protected | Keep indexed; improve | **Promote `FT-IMP-001` / `IMP-015`.** It is the clearest unprotected combination of early relevance, shallow decision support, and trust-policy debt. |
| New York City things to do | 2,038 words; 21 internal links; 8 external sources; two decision tables and schema | Reused July 11 page row: 25 impressions, position 37.2; protected through July 25 | Keep indexed | Observe; no target churn. |
| New York City where to stay | 1,445 words; 13 internal links; 8 external sources; decision table and schema | Reused July 11 page row: 13 impressions, position 58.1; protected through July 25 | Keep indexed | Observe; later trust-language review should follow the San Diego stay standard. |
| Chicago things to do | 1,274 words; 11 internal links; 7 external sources; decision table and schema | Reused July 11 page row: 9 impressions, position 67.3; not protected | Keep indexed | Retain as a later activity trust-language candidate. It has firm age/stroller/family-fit shorthand, but the weaker relevance position and lower-consequence activity-selection context do not outrank the Las Vegas stay page's booking-impact trust debt. |
| San Antonio things to do | 1,322 words; 11 internal links; 7 external sources; decision table and schema | Historical keyword research shows attractive activity demand; no current page row is available in the public-safe snapshot; not protected | Keep indexed | Retain as a later content/product candidate; current evidence does not outrank the Las Vegas stay page's combined relevance and trust gap. |

## Promoted implementation: FT-IMP-001 / IMP-015

Title: Reframe the Las Vegas stay page as a constraint-led verification guide.

Affected production URL:

- `https://familytripwise.com/where-to-stay/las-vegas-with-kids.html`

Bounded implementation paths:

- `tools/upgrade-priority-pages.mjs`
- `site/where-to-stay/las-vegas-with-kids.html`
- `tools/las-vegas-stay-page.test.mjs`
- the declared operator evidence and roadmap files

Required deliverable:

1. Replace firm `best area`, `best fit`, route, smoke/noise, pool, and family-suitability conclusions with neutral candidates, exact property/room/route/date checks, or explicit unknowns.
2. Preserve useful official-source context, but do not convert area attributes into a hotel recommendation.
3. Add a focused regression test covering blocked firm phrases, canonical/indexability stability, source/verification framing, and generator idempotence.
4. Keep the sitemap, canonical URL, URL count, and all other pages unchanged.

Predeclared production invariant:

> The affected URL returns the pushed release marker and remains canonical/indexable, contains exact booking checks for total fees, room assignment, pool access, smoke/noise exposure, and route friction, and contains no unreviewed `best area` or `best fit` verdict presented as fact.

Success signal:

- The page offers clearer family decision support without firm human-gated claims, focused/native QA passes, independent review returns `PASS` or `PASS_WITH_P3`, and the resulting deployment passes the predeclared invariant.

## Why the other candidates were not promoted

- The San Diego activity URL has a due read-only discovery check on July 15. Its reused unknown status is a monitoring gap, not evidence that its current 1,617-word page is unworthy of indexing.
- Protected URLs may have additional trust-language debt, but observation policy blocks non-defect edits during their windows.
- Chicago activities is also unprotected and contains firm age, stroller, and family-fit shorthand. It was not promoted because its reused page signal is weaker (9 impressions at position 67.3), its 1,274-word page is deeper, and an activity-choice error is generally less consequential than an area/hotel booking verdict. The Las Vegas stay page has the stronger known position (28.2), the shallowest reviewed decision support (1,039 words), and explicit firm `best area` / `best fit` statements in a human-gated commercial context.
- San Antonio activity demand is promising, but the current public-safe snapshot has no page row and no urgent technical/trust defect was established.
- A new destination, standalone hotel page, or more indexable pages would violate current sequencing or require user/human-review gates.

## Sources used

- `ops/gsc-snapshots/2026-07-13.json`
- `docs/research/gsc-ui-review-2026-07-11.md`
- `docs/research/gsc-monitoring-2026-07-13.md`
- `docs/research/semrush-family-travel-opportunity.md`
- `ops/seo-roadmap.json`
- `strategy/current-strategy.md`
- `strategy/content-principles.md`
- the eight reviewed local HTML pages and `site/sitemap.xml`

No indexing request, outreach, partnership action, new page, protected-URL edit, or external-account mutation was performed.
