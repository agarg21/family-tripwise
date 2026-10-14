# Bounded NWS Forecast Pilot

FT-IMP-166 implements the separately selected candidate from [165 qualification](nws-source-qualification.md). [Dated evidence](../research/nws-forecast-pilot-2026-10-14.json) records schema research, synthetic controls, the native pilot status and untested limits. This is an opt-in evidence tool, not a running weather service, public integration, weekly collector or global-ready system.

## Scope And Authority

The only point is the existing San Antonio forecast link's public downtown coordinate: `https://api.weather.gov/points/29.4241,-98.4936`. No visitor coordinates or saved trip dates are collected. Require returned San Antonio/TX, EWX, America/Chicago, matching point geometry, bounded reported relative distance and the exact grid-derived forecast URL. A future changed grid/location/unsupported schema remains a hold, not an assumed equivalent.

Current [NWS API documentation](https://www.weather.gov/documentation/services-web-api) and [native OpenAPI](https://api.weather.gov/openapi.json) support JSON field inspection. API-specific source conditions are not fabricated HTML robots approval. Original Dana/Garfield holds, old tools, watch and governance registry stay unchanged. Published [reuse conditions](https://www.weather.gov/disclaimer/) and [attribution](https://www.weather.gov/logorequest-faq) remain applicable; this is no legal assurance or NOAA/NWS endorsement.

## Use

Import `parsePoint`, `parseForecast`, `cacheExpiry`, `forecastAt`, `requestJson` or `collectNwsPilot` from `tools/nws-forecast-pilot.mjs`. No import triggers a request; no default workflow or scheduler invokes this module. An actual collection requires an action registration, current source conditions, native QA and a different independent preliminary PASS. `collectNwsPilot` consumes the trusted Master's review record and a new private journal directory; a supplied review hash is not independent authentication or a security sandbox.

The one registered native pilot may request the exact point once, then its validated exact forecast once. Identifying User-Agent, GeoJSON, manual redirects, ten-second timeout, 300KB streaming bound and sanitized failure classes are fixed. A redirect, denial, unsupported type or invalid normalization stops without retry or alternative origin. Start/result files use exclusive creation and private modes. Existing directory, missing result, held result or interrupted attempt is not replay permission: do not choose a new directory to recover it. Future runs need separately reviewed state/permission and integration with the existing checkpoint process. File writes are process-level evidence, not fsync/power-loss or distributed-atomicity guarantees.

Only selected normalized facts and bounded summaries are retained privately; complete response bodies are discarded. Public evidence records keep status/times/headers/hash/counts, not full forecasts. Fake transport tests are labeled synthetic and never establish native access.

## Freshness And Unknowns

Separate generated, source-update, period validity, retrieval and expiry. Support the inspected temperature integer/unit and QuantitativeValue variants, probability units and nulls. Missing precipitation stays unknown, never dry. Unexpected variants, invalid dates, overlapping/noncontiguous periods, stale update, mismatched grid or missing cache validity hold the record.

The cache calculation uses Date, Age and response delay, explicit max-age, earlier Expires and a conservative six-hour source-update cap. This is a private pilot subset of [RFC9111](https://www.rfc-editor.org/rfc/rfc9111.html), not a general HTTP cache: no conditional refresh, heuristic expiry, shared cache or stale serving. The six-hour cap is our conservative operator choice, not an NWS guarantee or update schedule. `forecastAt` refuses pre-capture, expired and out-of-period queries. A returned prediction is not actual weather, a venue-opening check, a stroller/route verdict or a safety/suitability promise. No advisory feed or all-clear engine is implemented.

## Verification And Next Gate

Run `node --test tools/nws-forecast-pilot.test.mjs`; independent reviewers may run only `--test-name-pattern='^pure:'` for nine pure controls (eight parser/transport controls and one offline real-metadata check). Two `journal:` controls use disposable fake transports and private temporary fixtures; full native QA is Master's responsibility.

After preliminary review, the bounded native pilot is evidence for final independent review, not publication authority. A public display still needs a named useful family task, desktop/mobile/keyboard QA, source attribution, independent review and release-marker/production SEO verification. Two actual weekly maintenance cycles and broader numeric query research remain separate. No new weather URL, CSV, LLM call or automatic fact renewal is selected.

The October14 native pilot used the cycle-one reviewed frozen code: one point200 mapped to EWX126,54 and one forecast200 normalized14 periods. Forecast expiry was13:03:12UTC at capture, not a standing current-weather promise. The original private journal stays immutable. Final code rejects the reviewer's P3 empty time designator and measures successful retrieval after body consumption; pure regression tests cover both without another native request. The original pilot's header-receipt retrieval timestamp is retained as captured, not retroactively corrected or presented as the new end-of-body behavior. No public facts or weekly dates were renewed.
