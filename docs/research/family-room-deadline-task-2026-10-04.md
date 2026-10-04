# Recorded Cancellation Date in the DC Comparison

October 4, 2026. FT-IMP-072 / LRN-152. Offline maintained-record task, not a new booking check, public launch or real-user test.

## Family Decision

Two adults with children aged 4, 8 and 12 compare November 8-13 in DC. The September 30 Residence Inn ONQQ observation retains USD2168.27 per configuration/stay and USD433.65 per configuration/night. Its original terms name October 1 as the hotel-local cancellation calendar date. Price freshness alone does not flag that the October 4 comparison is later.

## Supported Change

The structured date is normalized from the [retained observation](washington-dc-residence-price-observation-2026-09-30.json). Original terms, checked date, exact party/stay, amount, fee and deposit context remain intact. No provider or paid call was made. The adapter reports `AFTER_RECORDED_LOCAL_DATE`; the scope cell adds both dates and a current-term recheck.

Seven rows and 35 columns remain, with all 34 non-scope cells identical. A hypothetical USD350 nightly threshold still gives four observed amounts at/below, two above and one unpriced, not complete affordability. No row is removed or ranked by the relation. Rates without the date retain prior output.

## Limits and Controls

These are calendar dates, not instants. The comparison date is Eastern, the recorded date hotel-local; no timezone conversion, current cancellability, refundability, availability or booking acceptance is established. Before and same date also require recheck. The retained amount is not a current quote or final all-fee total.

Seven focused regressions cover before/same/after, historical prices, changed party/stay, preserved budget/context, hidden or membership observations, malformed/inherited/accessor/nonenumerable fields, zero deadline-getter invocation, primitive malformed-rate error handling and API/CLI parity. [Structured evidence](family-room-deadline-task-2026-10-04.json) separates normalization from current policy evidence.

## Decision and Next Gate

IMPLEMENT the warning and REJECT date-age-only sufficiency. Confidence is high for deterministic date relation and retained-term extraction, unknown for current policy and user/SEO effects. Recheck after supported source changes or a failed boundary/context control, never through an unchanged denial. DC full fees, representative exact-category corpus, actual rest, material information gain, existing-page fit and fresh named launch approval remain separate.
