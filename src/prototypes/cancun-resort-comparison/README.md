# Cancun Resort Comparison: Build One

Executable, source-backed comparison model; no public page or user interface yet. Supports two adults and one to five children. This is a constraint screen, not a recommendation score or booking engine.

Run from the repository root:

```sh
node --input-type=module -e 'import {compareCancunFamily} from "./src/prototypes/cancun-resort-comparison/compare.mjs"; console.log(JSON.stringify(compareCancunFamily({childAges:[3,7,12],channel:"direct-suite",nights:5,newReservation:true}),null,2))'
node --test tools/cancun-resort-comparison.test.mjs
```

`data.mjs` is the single maintained source for the next comparison surface. Every result includes direct evidence links. Sources retrieved September22,2026; original publication dates unknown. Refresh before public launch, on policy changes and by October22. `needsRecheck` marks the maintenance boundary; callers must display it, not treat stale evidence as current confirmation.

No ages are converted into hotel child-rate classifications. A published maximum is not exact-party acceptance. Unmatched club ages do not imply there are no activities. Transfer eligibility describes one published offer, not a confirmed reservation. No complete prices, user information, online-review claims, scores or booking details are stored. False/null condition fields distinguish absent recorded requirements from confirmed exemptions; all admissions still need checking.

Next: build one mobile/desktop comparison surface from this model, including unresolved conditions, source links, evidence dates and an immediate two-adult/mixed-age default. Complete bounded booking/fee and family-review evidence where available, label remaining unknowns, and independently test the surface before considering one indexable Cancun page. See `docs/plan/cancun-expansion-build.md`.
