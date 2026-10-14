# NWS Weather Source Qualification

FT-RES-165 / LRN-256. Current primary documentation and maintainer proxy, October14,2026. [Evidence and exact next gate](../research/nws-source-qualification-2026-10-14.json) distinguish documented conditions from proposed implementation and unknown native access.

## Decision

Qualify a bounded API-adapter candidate for the existing San Antonio itinerary's near-departure weather check. Do not add a weather page, refresh public facts or launch a forecast service here. This is independent evidence infrastructure, not a replacement for held hotel/attraction sources.

The [API documentation](https://www.weather.gov/documentation/services-web-api), [use policy](https://www.weather.gov/disclaimer/) and [attribution FAQ](https://www.weather.gov/logorequest-faq) support the source decision recorded in the evidence file. Their reader availability is not a native endpoint test or legal assurance. No API forecast, specification, source-owner contact or model request was made.

## Next Transaction

Register a separate exact API scope and review its schema/access/cache rules before a native pilot. Keep the existing HTML governance guard unchanged: do not manufacture a robots200 record or replace a source-policy hold with this API qualification. The adapter must validate coordinates, discovered endpoint binding, timestamps, units, missing values and expiry; a later public display requires its own persona, desktop/mobile/keyboard, native and independent review and production verification.

Reject a weekly-only forecast cache. Use the existing maintenance lane for source/schema health, with separately tested expiry for volatile facts and no new scheduler. No LLM is needed for deterministic structured fields. This candidate does not measure parent preference, query volume, global coverage or two real weekly cycles. Keep broad city growth conditional on the existing [scale gates](global-english-scale-gates.md).

## Stop Rules

No stale all-clear, personal-location collection, unsupported suitability or hazard reinterpretation. An expired, denied, missing or wrong-location response remains unknown. No alternate retrieval surface, repeated unchanged denial, source-owner message or automatic fact-date renewal. Actual API access and exact field schema are still untested, and the old three-source policy holds remain intact.
