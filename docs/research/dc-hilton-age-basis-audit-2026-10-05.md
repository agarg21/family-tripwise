# DC Hilton Child-Age Provenance Audit

October 5, 2026. FT-IMP-073 / LRN-154. Maintained-evidence audit and offline proxy task validation, not new booking collection, real-user testing or public city approval. [Structured evidence](dc-hilton-age-basis-audit-2026-10-05.json).

## Decision

IMPLEMENT a narrow provenance correction in the two September30 DC Hilton price inputs. Their retained source limitations say two adults/three children, adult18+, and no individual4/8/12 age input or confirmation. The prior schema2 metadata nevertheless inferred child0-17 and entered individual ages. An adult cutoff alone does not establish a child band. The October4 FT-RES-133 independent P2 finding exposed the same failure; its existing schema5 repair supplies the correct representation, not new evidence about DC policy.

Provider child bounds and individual ages are now null; requested ages remain task context and the child count remains three. No adapter changed, source date renewed, provider denial retried or paid call made. USD is retained from the original observation/tax arithmetic with editorial provenance, not claimed as a fresh ISO-currency check.

## Retained Budget Evidence

One accommodation, two adults and requested children4/8/12, November8-13five nights. Source observations September30; comparison October5. Amounts are displayed tax/government-inclusive estimates, excluding unresolved additional stay/service/sofa charges and incidentals. No-car/no-pet optional charges are not added. Original deposit, meal and plan-specific cancellation strings remain exact. These are dated public plans, not seasonal ranges or final all-fee totals.

| Category / Plan | Stay USD | USD per configuration/night |
| --- | ---: | ---: |
| Embassy Deluxe Two Room Suite with 2 Double Beds / Non-refundable | 1673.39 | 334.68 |
| Embassy same category / Flexible Rate | 2040.72 | 408.14 |
| Homewood 2 Queen Beds 1 Bedroom Suite Nonsmoking / Non-refundable | 1444.85 | 288.97 |
| Homewood same category / Semi-Flex | 1583.04 | 316.61 |
| Homewood same category / Flexible Rate | 1699.83 | 339.97 |

Primary provenance: [Embassy rooms](https://www.hilton.com/en/hotels/wascces-embassy-suites-washington-dc-convention-center/rooms/) and [Homewood rooms](https://www.hilton.com/en/hotels/washwhw-homewood-suites-washington-dc-downtown/rooms/), inspected September30 in original FT-RES-070/071 observations. Neither was accessed this run. Source UI remains operator-attributed historical evidence.

The hypothetical350USD/night task retains seven rows and35columns: five Hilton `UNKNOWN_AGE_BASIS`, one Residence `ABOVE_OBSERVED_AMOUNT` (unchanged2168.27stay/433.65night), and one unpriced Pendry. Kitchen filtering retains three unresolved Homewood plans and Residence. No Hilton price disappears or qualifies under a larger budget. Capacity screening is not provider age acceptance. Changed ages/stay inherit no numeric samples; historical dates and member exclusions remain explicit.

## Validation And Next Gate

Seven new regressions cover exact metadata, immutable19-field price-context hashes, all public-plan amounts, budget/filter boundaries, changed/stale/member controls, historical CSV non-provenance cells, invalid schema promotion and stdout CLI/API parity. The immutable October3 checkpoint is not rewritten; its earlier budget qualifications are historical and superseded. Full native QA and independent read-only PASS remain required before release.

Confidence is high for retained-record extraction, arithmetic and deterministic routing, unknown for provider age applicability, complete stay cost, usable setup, actual rest, users and SEO effect. Lesson: count-only searches can retain useful prices without publishing an inferred age-eligibility pass. Falsify on supported exact-party/category/stay age evidence, failed routing or lost context; freshness expiry requires source recheck, not date renewal.

Next eligible normal run: continue a named unblocked evidence gate after this release. DC remains a candidate: child-age applicability, full fees/setup, representative exact-category corpus, actual nap-return/rest, materiality/no-existing-page fit and fresh named publication approval remain. Chicago and other provider holds stay narrow and unchanged. No public-site deployment or Pages claim is part of this shared-record/docs release.
