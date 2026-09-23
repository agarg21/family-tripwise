# Cancun Resort Comparison: Build One

September23 FT-IMP-030: six categories,19 references; ten original sources checked this morning and additional references inspected with partial/unknown fields explicit. Royalton child limits and Sunscape capacity stay disputed. Ziva/Moon Palace club rules and Royalton/Moon Palace transfers remain unknown. See `docs/research/cancun-breadth-2026-09-23.md`; original ten-source account below describes the first build.

Executable, source-backed comparison model and progressively enhanced comparison interface. Supports two adults and one to five children. This is a constraint screen, not a recommendation score or booking engine. FT-PUB-007 builds `site/where-to-stay/cancun-family-resorts.html`; verified release status lives in `status/cancun-pages.md`.

Run from the repository root:

```sh
node --input-type=module -e 'import {compareCancunFamily} from "./src/prototypes/cancun-resort-comparison/compare.mjs"; console.log(JSON.stringify(compareCancunFamily({childAges:[3,7,12],channel:"direct-suite",nights:5,newReservation:true}),null,2))'
node --test tools/cancun-resort-comparison.test.mjs
```

`data.mjs` is the single maintained source for the comparison surface. Every result includes direct evidence links. All ten official sources rechecked September23,2026; original publication dates unknown. Refresh on policy changes and by October23. `needsRecheck` marks the maintenance boundary and is displayed by the interface, not treated as current confirmation. `render.mjs` supplies static and interactive views; the generator copies all four modules unchanged to `site/cancun/`. The client stores and submits no family inputs.

No ages are converted into hotel child-rate classifications. A published maximum is not exact-party acceptance. Unmatched club ages do not imply there are no activities. Transfer eligibility describes one published offer, not a confirmed reservation. No complete prices, user information, online-review claims, scores or booking details are stored. False/null condition fields distinguish absent recorded requirements from confirmed exemptions; all admissions still need checking.

Validate with `node --test tools/cancun-resort-*.test.mjs`, then generate pages and use the README's site-only preview workflow. Restart the preview after regeneration. Default ages3/7/12 and all source-linked policy rows remain useful without JavaScript; interactive changes hide stale results until submission. See `docs/research/cancun-launch-2026-09-23.md` for task evidence, pricing/review limits and release invariants.
