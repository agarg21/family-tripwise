# DC Family Transit Budget
The named museum-rest task is two adults with children4,8,12 staying November8-13. Transit cannot be treated as free because museum admission is free. A maintained fare input now supports conditional rail-cost calculations, not an actual hotel-return route or booking decision.

## Policy and Cost
The October3 [WMATA payment page](https://www.wmata.com/pay.html) supports one free child and four regular-fare riders for this task. Own payment methods are required for fare-paying children; visitor eligibility for student/reduced programs is not assumed. Source publication and effective dates are unknown, not October3.

Model-derived network bands for hypothetical separately charged trips:

| Hypothesis | Family rail fare in USD |
|---|---:|
| Two extra rest-return trips, weekday daytime |18-54|
| Four daily trips, weekday daytime |36-108|
| Two extra trips, ordinary weekend |18-20|

These are network-wide bounds, not an exact downtown route quote or November service forecast. Actual trip count, route, fare and hotel-return feasibility remain unknown. Payment media, non-rail charges, meals and lodging are outside the amounts. No pass or transfer discount is applied.

The [official new-rider guide](https://www.wmata.com/ride/guides/new-riders.html) distinguishes internal rail interchange from a new separately charged trip. The calculation does not count changing trains inside the rail system as another fare. Actual exiting/re-entering and any exceptional entitlement still need checking.

## Reuse and Limits
[Structured evidence](dc-family-transit-cost-2026-10-03.json) owns the policy, task and conditional inputs. Run the existing Node workflow:

```sh
node tools/family-transit-cost.mjs docs/research/dc-family-transit-cost-2026-10-03.json '{"adults":2,"child_ages":[4,8,12],"rail_trips":2,"fare_period":"weekday-day","one_way_fare_cents":null,"fare_product":"regular-pay-as-you-go"}' 2026-10-03
```

Eight regressions cover fare/age boundaries, excess young children with unresolved fares, unknown trip count, source expiry, integer-cent hypothetical fares, malformed inputs, provenance and CLI parity. Stale evidence suppresses numeric results after30days; an excess-under-five fare is not invented.

Next: exact hotel, stations/entrances, travel date/time, current fare/service, rest preference and entry waits. The old room-price and museum records are unchanged. Current review/corpus and fresh named DC publication approval remain separate. No route/stroller/safety/fit assurance or new public page.

Action FT-RES-124 / LRN-141. Full/focused native QA and independent read-only PASS are required before exact-path release. No paid call, blocked-source retry or scheduler change.
