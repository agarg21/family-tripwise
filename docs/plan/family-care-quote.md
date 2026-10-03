# Dated Room And Care Quote Export

FT-IMP-061 canonicalizes CLI entry identity so file/directory symlinks and relative aliases produce the same exports and invalid-option failures as the documented path. Library imports remain quiet when argv has no entry, an unrelated entry or a nonexistent path. Regression tests include optional room evidence and byte-preservation of both inputs. No quote, price, capacity, CSV or aging semantics change.

FT-IMP-058 adds an optional, separately dated official category-count check from the reviewed087source conflict. It does not alter the084receipt or its prices. Use:

```bash
node tools/family-care-quote.mjs docs/research/cancun-room-care-quote-2026-10-02.json --room-evidence docs/research/cancun-superior-room-capacity-2026-10-02.json --format csv
```

The room rule must match the original property name, category and property URL; this adapter supports one selected room only. All adults and children count in the screen: no baby-bed/discount age exception is inferred. Exceeding the published count is an unresolved source conflict, not definitive ineligibility. Within-count is not booking acceptance or a supported bedding setup. No rule yields explicitly unchecked status. JSON and both CSV rows retain the cloned complete rule, its independent dates/weekly due status and booking-acceptance unknown alongside unchanged full quote/price/care/fee context. An old conflict remains visible but marked due, not renewed or cleared. Source-record links and supplied facts require independent evidence review; format validation cannot authenticate them or prove source completeness.

FT-IMP-056 consumes the separately reviewed FT-RES-084 BOOKING_CHECK receipt. It does not change the version1 unknown-fee inventory or claim a new source observation, public page, complete budget or booking acceptance. A selected optional-care quote is distinct from established billable duration and care admission.

```bash
node tools/family-care-quote.mjs docs/research/cancun-room-care-quote-2026-10-02.json --date 2026-10-02
node tools/family-care-quote.mjs docs/research/cancun-room-care-quote-2026-10-02.json --date 2026-10-02 --format csv
```

JSON includes a cloned complete receipt plus observation age, review status and original-task-only applicability. CSV has before/after selected-care configurations with directly scannable stay and derived package/night amounts. It also retains complete JSON context for original party/date/request, room, sources, care and tax/cancellation/unit basis, including all unknowns and rejected adult-only observation. CSV is a research export, not a public comparison design. Currency interpretation remains explicit. Membership is not added again, the separate peso levy is not converted or multiplied, and care is not prorated.

Validation checks exact fields, real dates/nights/child mappings, cents, discounted totals, nightly equivalents, selected-care delta and service sum. Unknown temporal billing/minimum/admission/slot/full-tax fields must remain null in this schema; a later supported extension needs its own evidence/review. It accepts no flights/transfer-inclusive receipt or changed-party request. A format validator can reject contradictions, not authenticate a provider quote or substantiate arbitrary supplied prose; source and judgment review remain necessary.

The date defaults to the actual Eastern date. At seven days observation age, weekly source review is due; the original observation and travel dates are never renewed. There is no network, booking, general inventory join, output-write or publish operation. `--date`, `--format json|csv` and optional `--room-evidence` are supported. stdout is the output; invalid input returns nonzero. CSV text cells neutralize spreadsheet formula prefixes. Existing policy inventory remains useful for broader age screens, but its numeric unknowns are not overwritten by a quote for a different task.

Focused regressions cover arithmetic, nulls, original party, strict options, clone/no-mutation, full receipt CSV parity, malformed dates/objects/arrays/URLs, future observations, unsupported assurances and weekly aging. Full native QA and a different independent read-only PASS gate review cleanliness. Current Git divergence holds commit/push; no production delivery is claimed.
