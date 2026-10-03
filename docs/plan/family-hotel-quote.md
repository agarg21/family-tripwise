# Dated Hotel Rate Comparison Export

The offline hotel quote adapter turns a reviewed count-only family booking observation into reusable JSON or CSV, with one row per dated rate plan. It preserves approximate nightly prices alongside the room category, requested ages, persisted counts, stay dates, observed date, currency interpretation, taxes, source links, terms and unresolved fees. It does not collect new prices, reprice another family, or publish a page.

```sh
node tools/family-hotel-quote.mjs docs/research/orlando-cabana-family-price-2026-10-02.json --format csv
node tools/family-hotel-quote.mjs docs/research/orlando-cabana-family-price-2026-10-02.json --date 2026-10-09
node --test tools/family-hotel-quote.test.mjs
```

Output goes to stdout. The adapter never writes the source record, default hotel data, maintenance reports, or public downloads. Separate reviewed integration and release approval are still required before publishing these observations in the existing Orlando comparison.

The command supports repository-relative, absolute, and symlinked file or directory paths, including the macOS `/tmp` alias. Invalid options fail with no exported stdout under each path form. Importing the module only exposes its functions and does not run the command.

## Supported Evidence

Schema 1 accepts the existing [Cabana Bay observation](../research/orlando-cabana-family-price-2026-10-02.json) without a second manually maintained price copy. It deliberately supports one room, a count-only child band of 0-17, interpreted USD without an observed ISO label, nightly amounts plus displayed taxes, and explicitly unknown final terms and extra fees. It rejects unsupported fields, nonplain data, accessors, proxies, hidden fields, sparse arrays, unsafe source parameters, future observations and contradictory party, stay or price arithmetic. Other source shapes need separately reviewed adapters rather than coercion into this schema.

For the November 8-13, 2026 observation, the Special Offer averages $181.20 before displayed tax and $203.85 including displayed tax per suite per night; Flexible Rate averages $258.80 and $291.15 respectively. These are two plans for one stay, not a seasonal range. Currency remains an editorial USD interpretation. The two-adult/four-child result did not verify individual ages, and the displayed stay totals are not complete all-fee checkout or trip budgets. Parking, current resort fees, meal costs, tickets, optional extras, cancellation and deposit terms remain unresolved. A plan called Flexible is not proof of refundable terms.

## Freshness And Sharing

The explicit source recheck date, October 9 for this record, changes the screening status to `source-review-due-not-revalidated` on that date. Screening never renews `observed_on`, verifies availability, or changes the amounts. Before the due date it still says `dated-nonbinding-observation-not-current-quote`.

Each CSV row retains the original task, persisted party, complete plan, currency evidence, room facts, unresolved budget and full receipt as JSON columns, alongside scannable nightly and stay amounts. Formula-like text is escaped for spreadsheet use; unknowns remain unknown rather than zero. Published room counts are only a screening comparison, not final booking acceptance, sleeping assignments, or a family-suitability guarantee. The dated park notice is retained in the receipt without renewing its operational facts.
