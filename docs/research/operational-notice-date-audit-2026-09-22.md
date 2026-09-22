# Operational Date Coverage Audit

FT-DEV-006 / LRN-042. Evidence inspected September 22, 2026. Tooling implementation, not a public-page correction or real-user test.

## Family Decision And Test

A family choosing a Chicago hotel for an indoor-pool weather backup needs to distinguish dated restrictions, scheduled works and unknown current access. Hypothesis: a zero-result expiry check is adequate evidence that the maintained operational notices have usable date coverage. Rejected by a new source-to-checker reproduction, not by unchanged health monitoring.

At baseline8913d6e, `findExpiredOperationalNotices` returns `[]` for the complete Chicago hotel HTML with an explicit September22 test clock. The card and FAQ contain month/day-only restrictions. The implementation recognizes explicit-year dates, so these are outside its expiry coverage; the absence of findings cannot establish current operations or date completeness.

## Maintained Evidence

Official pages retrieved September22; publication/update dates UNKNOWN:

- [IHG dedicated pool notice](https://www.ihg.com/intercontinental/hotels/us/en/chicago/ordha/hoteldetail/amenities/pool): its August-to-September project interval and two closure dates omit the year. A separate pass restriction refers to the same project. This supports a missing-year control, not a finding that works ended, continued or the pool reopened.
- [Loews services](https://www.loewshotels.com/chicago-downtown/discover/services-amenities): its repair-closure endpoint is December31 without a year. This is a future-looking month/day control: do not automatically assign this calendar year or infer a January reopening. The existing public page's explicitly dated exclusion is not refreshed by this audit.
- Repository evidence: `site/where-to-stay/chicago-family-hotels.html`, current InterContinental card and visible FAQ; `tools/content-freshness.mjs` explicit-year-only matcher. These are page-text/code observations, not rendered desktop/mobile task results. The prior September20 audit remains authoritative for wider hours/access conflicts.

Evidence classes: official published wording, source-date uncertainty, maintained HTML and deterministic code reproduction. No booking, exact-trip acceptance, safety or firsthand experience claim.

## Implemented Decision

Add `findYearlessOperationalNotices` and expose its results in both `node tools/content-freshness.mjs` and `node tools/seo-qa.mjs`. It reports month/day operational references with `missing-year`, the date text and context. It never returns an inferred expiry date. Existing explicit-year expiry errors and nonzero exit behavior remain unchanged; unresolved coverage is a separate warning, not proof of expiry and not automatic permission to publish a disputed notice.

Current corpus: five date references across the Chicago card and FAQ, not five distinct hotels or five proven expired notices. Source-check dates are excluded, identical passages deduplicated, and neighboring HTML blocks cannot supply operational context to an unrelated date. Script/style/JSON-LD exclusions remain; first-party application/json remains inspected. The two pending page corrections keep their existing preview and review gates.

Regression coverage includes the September22 captured Chicago passage, cross-month and abbreviated ranges, single days, explicit years, source dates, adjacent-block controls, embedded data, duplicate passages, calendar-year independence and CLI output/exit behavior. The CLI test derives current-page expectations rather than requiring the public defect to remain forever. The first CLI test attempt exposed an encoded-space path bug in the test itself; it was corrected using fileURLToPath before review.

This is a bounded English month/day heuristic, not complete temporal reasoning or a general HTML parser. It does not infer years from copyright, checked dates or nearby unrelated text, establish current operations, parse every seasonal/numeric/relative-date form, or resolve the existing expiry matcher's other limitations. First-party JSON is parsed into separate string fields; source-check metadata cannot lend a date to another record. Malformed JSON is excluded from the new yearless pass rather than guessed; JSON validity remains a separate concern, and this does not change the legacy expiry pass. Warnings require source review; adding a guessed year merely to silence them is not a valid fix.

## Measurement And Release Boundary

Success is visible uncertainty and tested classification without changing site content. Confidence is high for the reproduced gap and current fixture behavior, medium for broader English-copy coverage, and low for real-user or ranking effects. Reusable lesson: report unassessed evidence separately from passed evidence. Falsify or narrow this rule if operationally irrelevant dates produce noise, explicit-year dates produce missing-year warnings, or a supported notice form remains silent. Master owns follow-up; recheck whenever notice templates change or a warning is investigated.

No site/**, generator, workflow, URL, public source-date, observation-window or browser-security changes. Tool-only push does not trigger Pages under the current workflow path filter; this is a QA capability release, not a production content improvement. No alternative preview, indexing, analytics, paid calls, outreach or account mutation.

Newly arrived September21 public-safe API data is conservatively finalized throughSeptember19:1514impressions,10clicks,52.41aggregate position; prior1483/9/53.10 is an overlapping28-day window. All28 inspection records unchanged,24indexed;70 snapshots validate. No aligned public query cohort or causal SEO claim selects this action.
