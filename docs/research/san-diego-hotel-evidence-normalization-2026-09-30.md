# San Diego Hotel Evidence Normalization

Action: FT-STD-002 / September30,2026 / retained research, not a current-source refresh

## Result

IMPLEMENT the first legacy mapping. All12hotel records now have source-linked room, price, fee, activity and review envelopes; two have retained transport evidence, ten remain unknown. This is62of72envelopes source-mapped, not62fresh facts or complete booking research. The single price display still comes from the existing generator catalog; no live page, price band, URL or observation window changes.

The source-register importer supports the repository's dated Markdown tables and named-ID lists, validates dates/classes/URLs/duplicates and fails on missing property/source identities. It does not infer facts from arbitrary prose. The property mapping is a reviewed normalization of those packs. If a registered source date advances, the adapter refuses to inherit that date for the old mapped value until reconciliation. Each field exposes source IDs, original dates, URLs and pack paths. Policy rows retain unknown exact rooms, limits, request-only options and named conflicts.

## Provenance Boundaries

| Field | Original eight | Four additions | Limited newer evidence |
|---|---|---|---|
| Room and activity facts | August17 | August17 | None renewed here |
| Prices | July18 | July21 | None; all twelve remain due for research |
| Review samples | July18 | July21 | None; small qualitative signals, not representative or firsthand |
| Fees | August17 | August17 | Bahia/Catamaran/Dana cost policies inspected September27 only |
| Transport | Homewood no-airport-shuttle; Loews Village/beach shuttle, August17 | Unknown | No exact route, timetable reliability or stroller verdict |

Source records: `docs/research/san-diego-family-hotel-evidence-pack.md`, `docs/research/san-diego-activity-hotel-expansion-review.md`, `docs/research/hotel-table-sharing-price-audit-2026-09-27.md`. These packs were reconciled September30; their original observation dates stay intact. No live sources or booking flows were retrieved in this transaction.

## Budget And Conflict Checks

- Every original nightly display remains exact, including LEGOLAND's `Package-priced`. No rate or range endpoint was invented or recomputed.
- Observed public examples and editorially broadened bands are distinct. Party context is recorded where known; exact room category, family/child ages, travel dates and rate-specific tax/fee treatment remain unverified for all12. A structured string field is not a verified quote. These remaining unknowns generate an explicit quality reason even when the old basis can be split into room/party/stay fields.
- Bahia's suite bedding conflict, Loews self-parking50versus47 and La Jolla Shores parking45versus55 remain disputed, not normalized to one confident answer.
- Hyatt Mission Bay parking amount, Manchester destination-charge amount/parking, Loews exact room setup and ten transport fields remain unresolved. Pool/club/connection mentions do not establish exact-child admission, booking acceptance, safety or route practicality.
- Review sources mix verified-stay platforms and public/editorial anecdotes; no sample is treated as representative or as a Family Tripwise firsthand review. Expansion packs document5-12visible excerpts/snippets; the original eight do not establish a consistent precise sample count.

## Deterministic Report

`ops/page-quality/2026-09-30-san-diego.json` is the post-normalization report. The original `ops/page-quality/2026-09-30.json` remains the immutable foundation baseline. Across seven pages/65hotels:62source-mapped fields,56legacy price records still due, three exact-room price gaps, six mapped conflict envelopes and54unstructured price bases. The seven newly structured San Diego price bases are easier to route, not more current or complete. Every San Diego price retains explicit exact-family unknowns. Total386review tasks are metadata/evidence tasks, not386public errors.

The offline all-page source inventory now includes362URLs rather than332because actual legacy price/review references are mapped. Four existing-evidence hosts were added to the explicit collector allowlist: Hotels.com,KAYAK,Tripster,KidTripster. This does not authorize circumventing access denials; no requests were made, and future collection must carry forward prior denied/challenged URLs. A larger source count is inventory coverage, not authority or demand.

## Next Decision

Use the same import/mapping pattern on one remaining city. Price refresh is a separate evidence action: select a comparable room/party/date scenario, preserve historical bands while checking observable current price/fee context, and reconcile only supported values. Weekly full-source repeat/noise validation remains FT-MAINT-009, not completed by this offline mapping. No new page or destination is selected.

Final QA/review: focused20/full267, operator-state0,79public-safe GSC snapshots,localSEO31URLs/zeroerrors/fiveprioradvisories; seven-hotel-page isolated regeneration parity, saved-report byte parity and whitespace pass. Franklin cycle-two independent read-only PASS/noP0-P3; source-reference schema/privacy P2 closed and six exclusions unchanged. Tools/docs-only push remains. Reused September30GSC throughSeptember28 is orientation, not query-cohort/CTR justification.
