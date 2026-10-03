# DC Museum-Rest Time Budget

October 3, 2026. FT-IMP-068 / LRN-136. Shared offline planning calculation, not a public destination launch or actual route assessment.

## Decision

The retained [museum-side audit](washington-dc-museum-rest-task-2026-10-03.json) publishes a 10:00-17:30 Natural History window, but the named two-adult/ages4,8,12 November8-13 no-car task has no hotel, journeys, rest preference or repeated-entry wait. New deterministic task validation rejects feasibility from opening hours alone. Every missing duration stays null; the result stays UNKNOWN. The unavailable American History body supplies no window. No source is reopened or renewed.

The helper accepts six independently supplied hypothetical durations: morning visit, outward journey, room rest, return journey, entry wait and afternoon visit. It subtracts their sum from the dated published window only when all are present. A retained worked hypothesis uses120+30+90+30+30+120=420minutes, leaving30of450. This is invented-for-validation arithmetic, not measured journeys, recommended visit durations or evidence that re-entry is allowed. Changing afternoon time to151 yields a one-minute shortfall;150 exactly reaches the boundary. Neither a nonnegative balance nor a zero balance proves real feasibility, dated operation, family fit or stroller practicality.

```bash
node tools/museum-rest-task.mjs docs/research/washington-dc-museum-rest-task-2026-10-03.json 'National Museum of Natural History' '{}' 2026-10-03
```

Pass a JSON object containing all six named minute fields for a hypothetical complete calculation. CLI prints JSON only and writes no artifact. Partial known-component sum is explicitly not a full plan. Original source date/class/URL and assessment date are separate; after30days the source needs recheck, never silently refreshes. Strict validation rejects malformed/negative/nonfinite durations, accessors, extra keys, ambiguous museum identity, unavailable-body schedule inheritance and future-dated evidence. No hotel winner, budget-price renewal, future-operation, route or safety assurance is produced.

## Remaining Gate

Retain original108 source-availability holds without unchanged retry or tool switching. Obtain supported exact hotel/entrance/journey/date inputs and the family's desired rest, plus authoritative entry rules, before assessing an actual rest plan. DC's maintained corpus, current qualifying reviews, full costs, materiality, no-clean-existing-page-fit and fresh named destination approval remain separate. All old room/price/fee records, public pages, observation windows and eleven held paths are unchanged.

Result IMPLEMENT conditional calculation; PRESERVE unknown actual feasibility. Confidence high in deterministic routing/arithmetic, unknown actual parent satisfaction or SEO. Falsify on unknown-to-zero conversion, loss of hypothetical/source labels, changed official schedule or supported measured same-task inputs. Seven focused regressions, full native QA and different read-only PASS precede exact nine-path shared-tool/docs push.
