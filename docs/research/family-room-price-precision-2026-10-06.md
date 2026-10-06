# Family Room Price Precision

October 6, 2026 / FT-IMP-074 / LRN-157. Decision: implement one shared validation correction, not a public-page change or new source check.

The existing validator accepted a synthetic USD 0.001 stay amount using the retained San Diego Homewood inputs, then projected a zero nightly equivalent. The input was never a real hotel quote. Positive finite amounts and safe rounded cents do not establish cent precision. Three of six new tests reproduced the missing rejection before the repair.

Use the same cent-precision contract already required by the nightly-budget filter: reject a stay amount if its rounded-cent reconstruction differs from the original number. Do not repair malformed ingestion by rounding it. Validate all plans before public-plan exclusion, including membership-only controls, across schemas 1-5 and the supported GBP/USD currencies.

Six regression tests cover sub-cent inputs, single/joined budget exports, hidden member plans, valid decimal controls, existing nonpositive/unsafe rejection and immutable real sample context. Positive valid cent amounts retain existing rounded nightly derivation. A hypothetical valid one-cent five-night stay can still round to zero per night; this change does not reject that valid input or claim such hotel availability.

Retained source dates, prices, age gaps, fee limitations and historical warnings are unchanged. The five reused schema fixtures and evidence limits are in the [machine-readable receipt](family-room-price-precision-2026-10-06.json). This is offline proxy validation, not firsthand travel evidence, user testing, a new quote, final all-fee affordability or an SEO result.

The Homewood main source's recorded September 30 access denial was not retried. No alternate route, paid call, provider interaction, public generation, indexing or scheduler change occurred. Public fee labels still need normal preview access and separate reviewed release. Exact-family source, setup and corpus gates remain open.

Reusable lesson: reject unsupported money precision before projection, even when a plan would later be hidden. Recheck if a valid maintained amount/output regresses or another currency/unit is added; do not assume every currency uses cents. Focused/full native QA, a different independent read-only PASS and exact-path verified Git release are required.
