# Orlando Count Only Budget Comparison

FT-IMP-066 / LRN-133 / October3,2026. This completes a qualified shared-comparison integration from091, without new booking collection or a public page rewrite. Existing dated evidence is preserved, not renewed. The [category pack](orlando-cabana-room-configurations-2026-10-03.json) and [normalized price sample](orlando-cabana-price-observation-2026-10-03.json) feed the existing room screen and35-column export.

## Family Decision

For two adults and requested ages4/8/12/15, one Poolside Family Suite Exterior Entry, November8-13,2026/five nights, the October2 anonymous result retained two adults/four children in a published0-17child band. Individual ages were not entered or confirmed. USD comes from storefront/dollar interpretation, not an observed ISO label. Source records [091](orlando-cabana-family-price-2026-10-02.json) and [093](orlando-cabana-fee-basis-2026-10-02.json) remain byte-identical.

The two displayed-tax-inclusive nightly equivalents are203.85 and291.15interpretedUSD per suite/night, from displayed stays1019.25/1455.75. They are dated plan samples, not a typical seasonal range or final all-fee total. Special Offer eligibility remains unconfirmed; public denotes anonymous display. Flexible does not establish refundable terms. Resort fees, meals, plan-specific deposits/cancellation and optional extras remain unknown. Current parking frequency is unknown and not multiplied by five; the no-car task does not choose it. Theme-park tickets and actual hotel water operations are separate evidence.

## Implemented Constraint

Schema4 accepts explicit unknown adult cutoff with published child-band counts only when the requested adult count is unchanged, every requested child age falls within the published band, and the child count matches exactly. It never infers18+ adulthood, reclassifies a teen, or stores requested ages as provider-entered ages. Individual-age and known-cutoff schemas retain their original behavior. Missing/partial bounds, missing interpretation basis, count mismatches and false age confirmation fail closed.

The sample matches only its requested party/stay/category; changed ages, adults, dates or category cannot inherit it. Status explicitly says count-only. Original observation date and fee/currency limits remain in outputs after becoming historical. Connected configurations, kitchenette-versus-kitchen and safety/suitability are not inferred.

## Verification And Next Gate

Regression tests cover age-band/count/unknown-cutoff rejection, immutable original amounts/dates, membership exclusion, defensive copies, stale samples and joined comparison basis. The joined task retains three Four Seasons base exclusions plus two Cabana plan rows; it does not rank hotel value or establish a complete water-property corpus. Focused/full native QA and a different read-only PASS are required before exact10path push. No public production change/Pages wait; October22window and eleven held paths remain.

IMPLEMENT qualified shared budget integration; PRESERVE public comparison. Next complete an independent water-property category/room-plus-admission/fee record or current city eligibility gate. Existing public integration still requires its own observation/defect, interface and release gates. No paid call, browser workaround, contact, account, reservation, scheduler or indexing action occurred.
