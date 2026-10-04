# Observed Nightly Budget Screen

The shared research export now accepts an explicit currency and nightly limit while retaining every selected room and plan. The screen compares dated observed amounts only. It does not establish final affordability, fees, booking acceptance or hotel quality.

## Task Result

A hypothetical USD350 per configuration/night threshold for two adults and children4/8/12, November8-13, screened October3, marks four DC public-plan amounts at or below the threshold, two above and one unpriced. This is a proxy task, not a customer budget or usability study. [Structured validation](family-room-budget-screen-2026-10-03.json) links the unchanged September30 category and price observations and records the derived rows. Different tax, cancellation, deposit and age-input bases still travel with each amount.

Only the research-scope cell gains an explicit status and qualification. All34 other columns and default35-column output remain unchanged. Historical, unpriced, mismatched-currency and unresolved-age samples remain unresolved rather than affordable. Orlando's count-only USD190.58 observation remains visible but cannot pass an age-qualified budget screen. No conversions, hotel sorting, new quotes or source renewal occur.

## Use And Gates

Supply both `--nightly-budget 350 --budget-currency USD`; API uses `{ budget: { currency: "USD", nightly_limit: 350 } }` as the existing fifth options argument. GBP is supported without conversion. Limits must be positive cent-precision numbers; duplicate, partial or malformed controls fail before writing. Current kitchen/capacity views, full-input validation and research-only exclusive-output guards remain.

[Usage](../plan/family-room-comparison-export.md) has a reproducible command. Eight focused regressions pass; full native QA and a different read-only review gate the exact ten-path release. Original evidence and eleven held files remain intact. Full DC fees/hold, reconciled representative reviews, actual room-rest task, materiality/no existing-page fit and fresh named launch approval remain separate. This implementation saves repeated threshold arithmetic; it does not qualify a city launch. No paid/provider/account/contact/public/scheduler mutation.
