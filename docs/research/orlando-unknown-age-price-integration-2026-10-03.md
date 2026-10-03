# Orlando Age Unresolved Price Integration

October3 maintained shared-budget improvement. Original Homewood quote is preserved in `orlando-homewood-room-task-2026-10-03.json`; this integration does not collect, renew or replace any provider evidence.

## Decision

A dated family-count cost remains useful even when the provider did not confirm individual ages. Schema5 separates that limited observation from schemas1-4. It requires an observed adult cutoff, explicit null child bounds/provider ages, matching counts, false individual-age confirmation, requested-task-only basis and currency provenance. It does not derive a complementary child band, reclassify children or promise booking acceptance.

The new `dated-age-unresolved-count-samples` status flows through the capacity screen and comparison export. Exact requested task context/date/category matching prevents borrowing the sample for another family. Ages at or above the published adult cutoff are rejected as contradictory, not repriced. Fourteen-day historical status and thirty-day capacity refresh remain unchanged. Schemas1-4 retain their previous behavior.

## Preserved Budget

| Room and plan | Original observation | Party and stay | Amount and scope |
| --- | --- | --- | --- |
| Homewood Theme Parks two-queen one-bedroom / public Flexible | October3,2026; USD visibly selected | One suite;2adults4kids counts; requested4/8/12/15 not entered; Nov8-13,five nights |847room+105.88displayed taxes=952.88stay;190.58derived per suite/night; breakfast; additional charges excluded/unknown |

Adult18+ is observed; child/infant policy is unknown. Cancellation, guarantee/hold, fee uncertainty and original nightly values remain verbatim structured input. Public means anonymous non-Honors display, not a guaranteed current quote or eligibility/fit assurance. No cheapest/best-value winner or apples-to-apples age-qualified ranking against Cabana. Capacity remains conditional, outdoor pool is not a waterpark, four place settings remain a six-person dining check.

## Reproduce

```sh
node tools/family-room-comparison.mjs docs/research/orlando-homewood-room-configurations-2026-10-03.json --date 2026-10-03 --prices docs/research/orlando-homewood-price-normalized-2026-10-03.json --kitchen published
```

Joining FourSeasons/Cabana/Homewood preserves six rows: three base exclusions, two original Cabana plan rows, one explicitly age-unresolved Homewood cost. The normalized file is separate; original120 held-price array/audit and historical091/093/119 stay unchanged.

Seven new offline regressions cover strict unknown-band contract, mismatch/downgrade/dense-array rejection, context/age limits, immutable arithmetic/fees/terms, history, membership exclusions and joined exports. These are proxy engineering checks, not real-user testing or live-provider/SEO proof.

IMPLEMENT shared data/tool budget preservation. Remaining gates are provider child-age acceptance, full-fee/meal/transport decision, maintained water-property corpus/current reviews/materiality and existing-page fit. Preserve public October22 window and all eleven held paths. No provider/browser/paid/scheduler/newcity/public mutation; focused/full nativeQA and different read-onlyPASS precede exact9path release.
