# Orlando Rest-Day Task And Constraint Model

FT-RES-054 / LRN-049, September26,2026. Decision: **implement an unpublished three-attraction constraint model now; do not publish a generic all-ages list or activate FT-PUB-006.** Source model, deterministic comparison and tests are in `src/prototypes/orlando-rest-day/` and `tools/orlando-rest-day.test.mjs`. No site, generator or public URL changed.

## Task And Hypothesis

Proxy task, not a real participant: two adults with children3/10, staying near International Drive, choosing an indoor non-park outing on Wednesday September30. They want at most120 minutes inside before leaving for lunch/rest and may return afterward. Required answers: weekday exception, return-entry terms, realistic time caveat, mixed-age scope and next verification. Transport time, total budget and child enjoyment are deliberately unknown; no nap-location or route practicality assurance.

Hypothesis: an indoor/family label and a suggested visit length are enough to choose a split-day backup. Rejected. Published weekday exceptions and return conditions change the preliminary screen. The internal model preserves these independent fields instead of declaring a winner. This is information normalization and executable boundary testing, not proof of satisfaction, novelty across the entire market or SEO potential.

## Live Query And Alternative Check

Two September26 web-search samples: `Orlando with kids non theme park rest day indoor activities`; `Orlando rainy day activities toddlers older kids science center crayola sea life`. Results included editorial attraction/itinerary guides, official destination and attraction blogs, commercial ticket pages, video and community discussions. Recurring SEA LIFE pages address both age and weather modifiers. Search results were qualitative, not a controlled US ranking export: no stable positions, numeric overlap, volume or demand-transfer claim. Broad non-park/weather jobs overlap enough to reject separate modifier URLs at this stage, not to prove a new URL eligible.

Inspected bodies and paths:

- [Orlando Compass non-park guide](https://www.orlandocompass.com/attractions/things-to-do-in-orlando-besides-theme-parks), updated June2026: already distinguishes recovery days, activity clusters and transport tradeoffs. Its broad coverage is not our information gain. Followed its actual links to the two detail pages rather than treating roundup omissions as sitewide gaps.
- [Compass Science Center guide](https://www.orlandocompass.com/attractions/orlando-science-center), updated June2026: gives a3-4hour estimate and recommends weekday mornings, but the inspected body does not expose the official Wednesday exception. Further linked guides were not exhaustively audited; no sitewide absence claim.
- [Compass Crayola guide](https://www.orlandocompass.com/attractions/crayola-experience), updated May2026: advises a continuous visit because return rules vary, whereas the official FAQ explicitly supplies conditional same-day return. Its2-3hour editorial estimate is distinct from the operator's3-4hour suggestion, not an objectively false visit duration. We do not adopt its suitability or crowd assertions.
- [SEA LIFE rainy-day guide](https://www.visitsealife.com/orlando/information/blog/fun-things-to-do-in-orlando-when-it-rains/), dated September1,2026: already offers a location/use-case table and current-operation caveats. An indoor table alone is not novel. This is commercial first-party attraction marketing, not neutral evaluation of every option.

All retrieved September26. The source model adds a compact, testable join of weekday caveat, conditional/unknown return and advisory time; it does not copy lists, rankings, claims of experience or proprietary ratings. Existing Family Tripwise Orlando hotel HTML owns room/park-benefit screening, not this outing decision; its rest-day checklist is not a failed promise to supply attraction planning. Do not force the new model into that protected page.

## Maintained Official Evidence

All links inspected September26; publication dates not established. Record only the fields needed for this task. No booking/checkout, paid API or account access occurred.

| Record and direct sources | Task-relevant evidence and remaining check |
|---|---|
| Science Center: [visit](https://www.osc.org/visit/), [KidsTown](https://www.osc.org/visit/exhibits/kidstown/), [calendar](https://www.osc.org/calendar/) | Normal Wednesday closure has an OCPS-break exception; dated September30 operation is not confirmed. Calendar retrieval exposed September26-27, not the task date. KidsTown targets7-and-under, not an admission ban on older museum visitors. Return-entry and official general visit-duration fields remain unknown. |
| Crayola: [FAQ](https://www.crayolaexperience.com/orlando/plan-your-visit/faqs), [hours](https://www.crayolaexperience.com/orlando/plan-your-visit/hours) | FAQ suggests3-4hours and permits same-day return before closing with a hand stamp. Outside food/drink is restricted; cafe is described as weekends, snack counter separately. Hours page lists daily operation with exceptions. These are published rules, not confirmed September30 operations or a complete visit promise. |
| SEA LIFE: [plan](https://www.visitsealife.com/orlando/plan-your-day/), [FAQ](https://www.visitsealife.com/orlando/plan-your-day/information/faqs/), [hours](https://www.visitsealife.com/orlando/plan-your-day/before-you-visit/opening-hours/) | Plan page suggests2-3hours. FAQ permits remaining until closing, but does not establish leaving/returning; that field is unknown. Food/drink is restricted inside. Date-specific page exposed September26-27 hours, which must not be extended to September30; generic plan-page hours are not used as a dated schedule. |

Source conflicts outside the selected fields remain exclusions, not silent resolutions: SEA LIFE FAQ includes the Orlando Eye in combo/day suggestions while its rainy-day page/navigation calls it closed. No Eye/combo recommendation enters the model. Crayola's differing annual-pass prices are outside this no-price screen. Do not interpret omitted fields as confirmed agreement.

## Implemented Task Result

- Science Center: Wednesday exception check required; return policy unknown. Child3 falls within KidsTown guidance, child10 outside that area's guidance without exclusion from the venue.
- Crayola:120minutes is shorter than its suggested visit, not forbidden; a stamped same-day return is a published conditional option. This supports investigating a split visit, not promising the hotel return journey works.
- SEA LIFE:120minutes reaches the lower published suggestion, not a promise of completion; return after a break remains unresolved. Staying until closing and re-entry are separate permissions.

The model returns every record, no score/filter/winner. All dated operation, total cost and transport values remain unknown. Tests cover Wednesday/Thursday, leaving/continuous visit, time boundaries, age7/8, invalid inputs/calendar dates, evidence/visit freshness and mutation isolation. No rendered UI or desktop/mobile task completion claimed because no interface was built.

## Decision And Next Gate

Internal implementation is complete pending QA/review/commit. Reject a generic activity-list launch. Candidate public scope is a limited source-dated rest-day constraint comparison, not an all-ages Orlando destination hub. The next eligible expansion action is to resolve that public-scope/authority gate and, if authorized, validate a concrete desktop/mobile interface with fresh sources; not another broad demand report. FT-PUB-006 remains publication-gated and no permission is inferred from this prototype. Higher-priority existing-page defects or qualified improvements still take precedence.

Before publication: independently review current query/page-role scope, keep date-specific hours and unknown return policies honest, refresh these sources, validate visible/no-JS defaults and controls, and obtain required approval for the re-scoped public activity work. No fabricated complete prices, exact routes or guaranteed family fit. No external contact is authorized to resolve unknowns.

Confidence high for the inspected rule distinctions and deterministic behavior, medium for proxy usefulness, low for actual demand, preference or superiority. Reusable lesson: weather suitability, opening, stay duration and return permission are different constraints. Refresh source records by October26 and sooner on changed policy; future visits on/after that date also flag a recheck. Falsification: source-policy change, actual date confirmation, a control yielding false certainty, or another comparison already answering the same task with less work.

## Operational Evidence

Final review: Huygens cycle2 PASS, no findings; default-date P3 resolved and independently rechecked. Source/docs commit and push next. Full223/focused8/state0/exact12paths/whitespace pass. No production release required because site/generator unchanged; lower pending checkpoints are historical.

Final QA: focused8/8 and full223/223 pass; operator-state0errors,74snapshots, local/productionSEO0errors/four known Chicago warnings, freshness0expired and public preflight30URLs200. Huygens cycle1 PASS_WITH_P3 independently checked sources and scope; its default-UTC-date edge case is corrected to Orlando time with a midnight regression. Cycle2 and source/docs push pending. Earlier pending language below is chronology, not a new gate. No site delivery or technical blocker.

Fresh newly arrived September25 API GSC, finalized conservatively throughSeptember23:1428impressions/10clicks/50.54position,24of30indexed,74validated snapshots. Prior September24 throughSeptember22:1406/10/50.91, overlapping28days. No query cohorts, CTR diagnosis, growth attribution or Orlando performance inference; Cancun/Orlando remain unknown toGoogle. Public SEO30URLs0errors/four existing Chicago warnings. No unfinished release or known qualified implementation was bypassed; research resolved the task gap and the same transaction implements the internal model. Three prior mechanical completion backfills preserved. Focused/full QA and independent review pending; no public delivery claimed.
