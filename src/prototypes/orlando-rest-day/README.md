# Orlando Rest-Day Constraints

Unpublished FT-RES-054 prototype. Three dated official records support a preliminary comparison of schedule caveats, leaving/returning, advisory visit length, and scoped child-area guidance. It is not a ranking, itinerary, full ticket comparison or public page. No inputs are transmitted or stored.

From the repository root:

```sh
node --input-type=module -e 'import {compareRestDay} from "./src/prototypes/orlando-rest-day/compare.mjs"; console.log(JSON.stringify(compareRestDay({childAges:[3,10],visitDate:"2026-09-30",asOf:"2026-09-26",availableMinutes:120,returnAfterBreak:true}),null,2))'
node --test tools/orlando-rest-day.test.mjs
```

Explicit `asOf` is for reproducible historical checks; normal callers should omit it. `needsRecheck` also covers visits on/after October26 even when evaluated earlier. Sources last inspected September26; publication dates are unknown. Before any public reuse refresh relevant sources, verify date-specific hours and preserve unknown re-entry. Empty weekday closures mean no recorded weekly closure, not guaranteed opening. Duration is a suggestion, not an eligibility filter. KidsTown guidance does not exclude older children from the museum. Price, transport and suitability remain unassessed.

Evidence/decision: `docs/research/orlando-rest-day-task-2026-09-26.md`. No generator imports this model. A public activity surface still needs scope/authority, current evidence, rendered task validation, review and release gates; FT-PUB-006 is not activated.
