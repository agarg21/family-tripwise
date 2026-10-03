# Orlando Cooking-Suite Task

FT-RES-120 | checked October3,2026 | maintained record/tool input, not public launch.

## Result

Homewood Theme Parks at6940WestwoodBlvd has an exact **2 Queen Beds 1 Bedroom Suite** that publishes capacity6 and a cooking stove. Separate sleep space is documented, but only four place settings are listed. Six-person capacity is conditional on actual age classification, sleeping allocation and reservation. These are research-based official facts, not firsthand experience. [Room source](https://www.hilton.com/en/hotels/orlwwhw-homewood-suites-orlando-theme-parks/rooms/).

The [hotel-info source](https://www.hilton.com/en/hotels/orlwwhw-homewood-suites-orlando-theme-parks/hotel-info/) publishes an outdoor pool and included breakfast, not a waterpark/lazy river or November operation guarantee. No airport shuttle, cribs or childcare is listed. Self-parking27USD/day has unknown tax inclusion; this no-car task does not select parking. Nap return and meal/grocery/transport costs remain untested.

## Dated Budget

| Exact category / plan | Party and stay basis | October3 displayed USD | Scope |
| --- | --- | --- | --- |
| Two-queen one-bedroom / anonymous Flexible Rate | One room;2adults4kids count-only; Nov8-13,2026,five nights; requested ages4/8/12/15 not entered |847 room +105.88 taxes =952.88 stay;190.58 derived per room/night | Breakfast; extra charges excluded/unknown; not a seasonal range or final all-fee quote |

Official [rate-detail UI](https://www.hilton.com/en/book/reservation/rates/) showed nightly room values216/170/152/159/150, USD selected, and free cancellation before23:59 local November7. Credit-card guarantee/incidental hold and early-departure repricing apply. No rate selected or reservation/contact/account action. Member/default from prices discarded.

**Age gate remains:** counts persist but no child band or individual-age input was observed. Adult18+ label does not establish every child policy. The useful limited budget remains in the audit/table and exported missing-basis context; normalized price file is intentionally empty, not zero/sold out. Schemas1-4 cannot preserve this exact unknown basis without invention. No cheapest/best-value winner.

## Maintained Output

Record: `orlando-homewood-room-configurations-2026-10-03.json`; audit: `orlando-homewood-room-task-2026-10-03.json`; six focused regression tests cover capacity/kitchen, quote arithmetic, age hold, freshness and joined export.

```sh
node tools/family-room-comparison.mjs docs/research/orlando-homewood-room-configurations-2026-10-03.json --date 2026-10-03 --kitchen published
```

Joined with existing FourSeasons exclusions and Cabana dated plans yields six rows: three exclusions, two Cabana plan rows, one conditional Homewood cooking-category row with held-price context. Original facts/quotes remain dated and unchanged; this is not six qualified water properties or real-user testing.

## Dependency And Next Gate

Floridays official suite read failed once: `web__run.open https://floridaysresortorlando.com/orlando-suites.htm` returned unavailable URL. No retry or alternate tool/domain recovery. Official source/tool owner must change availability or supply authorized evidence before another check. Independently selected Hilton property is not a workaround.

IMPLEMENT shared cooking-category controls/CANDIDATE age-qualified normalization/PRESERVE public until named gate. Next eligible run: resolve explicit age basis or a conservative reviewed unknown-count schema, then same-party/stay full-cost/transport task and maintained water corpus/materiality. Current review signals and public October22 observation gates remain. No public/newcity/paid/indexing/scheduler changes;11heldpaths retained. Full/focused nativeQA and different read-only PASS required before exact-path docs/record release.
