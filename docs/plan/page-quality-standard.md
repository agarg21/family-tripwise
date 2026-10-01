# Page Building And Maintenance Standard

October1 FT-STD-005 extends the optional activity audit to LasVegas retained cost-friction records: run `node tools/activity-quality.mjs --include-vegas` within the same weekly operator. Two mapped pages/24attractions/120envelopes, four activity-page gaps and24explicit Vegas weather/transport gaps; this is partial field coverage, not current fact/price verification. All retained August3admission strings/age/product/fee exclusions and original confidence survive, numeric exact-visit amounts stay unknown. Original default SanDiego/historical reports remain reproducible. Current contract and proxy audit: `docs/plan/activity-evidence-standard.md`.

Updated: 2026-09-30 / FT-STD-001

September30 FT-STD-002: first legacy pilot complete for San Diego's12hotels,62of72envelopes source-linked; ten transport fields remain unknown. Original observation dates and price displays retained, narrow fee overlays isolated, explicit price-basis unknowns still trigger review. Current mapping/report/remaining research: `docs/research/san-diego-hotel-evidence-normalization-2026-09-30.md`. This does not make all72envelopes complete or fresh. Other four legacy cities still need mapping.

September30 FT-STD-003: the remaining44legacy hotels now have exact property-source aliases for retained setup, activities, prices and reviews; two fee facts additionally mapped. All five legacy comparisons total240source-linked envelopes; conservative grouped dates and independently dated overlays remain explicit. Individual subclaim dates,42remaining fee fields/44transport fields in this batch and all historical exact-party price gaps are not completed facts. Evidence/report: `docs/research/legacy-hotel-evidence-normalization-2026-09-30.md`, `ops/page-quality/2026-09-30-legacy.json`. The earlier San Diego-only checkpoint above is history.

## One Delivery Pipeline

Use the existing generator and maintained evidence, not a separate prose pipeline:

1. Define one family decision, intended query family, existing/new URL fit, and named task with required outputs. New URLs still need current SERP overlap, demand, maintainability and authorized scope.
2. Collect source-dated records before drafting. Separate official facts, booking observations, review/community signals, editorial estimates and human experience. Retain conflicts and unknowns.
3. Validate the record contract and inspect its quality queue. Resolve the fields needed for the task. A preliminary screen may keep explicit unknowns, but cannot make firm suitability or booking assurances.
4. Build with the existing page-type generator. One maintained value feeds comparison, cards, downloads and structured data; do not retype prices into multiple outputs.
5. Walk through the named task on desktop/mobile: answerability, room/age/price basis, evidence traceability, accessibility, controls and layout. This is proxy QA, not user testing.
6. Run focused/full tests, operator-state, public-safe snapshot and SEO QA; obtain independent read-only PASS/PASS_WITH_P3 and complete the authorized verified release.
7. Refresh from field changes and due dates. Retrieval or an unchanged hash never renews factual dates. Preserve observation windows except for verified defects.

## Implemented Hotel Contract

`tools/hotel-evidence.mjs` provides schema version1 and adapters for seven live hotel comparisons: 65 hotel/category records and 390 field envelopes. It reads the legacy generator catalog and Cancun/Orlando source models, not a second manually maintained price database. Catalog copies do not mutate generator arrays.

Each record has an adapter ID, hotel, canonical URL, model path and mapping coverage. Initial fields: room, price, fees, transport, activities and review signal. Every field carries value, known/unknown/disputed/unmapped state, evidence class, observation date, source URLs, repository evidence path, date basis and limits. Shared model dates are labeled `model-baseline`, not individual claim verification. `unmapped` means existing evidence needs normalization, not that it is absent or wrong.

Unknown field names are rejected under this schema version. Source URLs must be HTTPS without embedded credentials, sensitive query keys or fragments; use a clean public source URL and describe any section reference in the evidence record. Adapters return defensive copies, not mutable references to maintained source objects.

Prices retain currency, room/night unit, amount or original display band, kind, room/party/stay basis, fees and original source context. Missing basis stays null. Legacy editorial bands retain exact displays and compilation dates. Cancun prose basis remains unchanged and is flagged for structured mapping; two-adult starting samples are not relabeled family prices. Orlando's dated stay total produces a labeled derived nightly equivalent, not a typical range. Child ages remain unknown where not originally entered. Adapters do not replace existing public renderers or change public claims.

New evidence must use the same envelope with individual claim dates and explicit sources. Structure room/party/stay fields with exact ages or stated unknowns; claiming complete structured basis requires all three. Missing fees are not zero. Firm claims remain subject to the separate human evidence gate. Schema validity is not evidence sufficiency or publishing authority.

## Reusable Checks

```bash
node tools/page-quality.mjs
node tools/page-quality.mjs --date 2026-09-30 --output ops/page-quality/2026-09-30-san-diego.json
node tools/evidence-audit.mjs
node --test tools/hotel-evidence.test.mjs tools/page-quality.test.mjs tools/evidence-audit.test.mjs
```

The offline command validates schema, dates, prices, source URLs, sitemap membership and evidence paths, then groups review tasks by field/page. Invalid records fail; gaps create a queue, never a false PASS or automatic edit. Conflicts precede budget fields and other mapping work. No browser, paid API or LLM call is needed. The source audit consumes the same hotel adapter alongside its explicit registry; collection stays allowlisted, bounded and denial-preserving.

Initial September30 result: seven pages/65 records, 56 historical legacy price records due, three exact-room price gaps, 61 price records needing structured basis, three mapped conflicts (two Cancun room capacities and Orlando resort fee). Most fields have mapping/provenance gaps. Queue counts are not counts of wrong public facts.

## Weekly Operator Loop

Use the existing operator, not another scheduler. At the seven-day due gate, run offline quality and bounded source comparison against the previous baseline, then select the highest-priority evidence-qualified change. Inspect changed/due sources and affected records plus noise controls. Scraped/JSON-LD prices remain extraction candidates until room, party, dates and fees match. Denied sources remain narrow dependencies; do not bypass restrictions. Review reconciled changes before public updates; save source date, old/new supported values, conflict outcome and next check.

FT-MAINT-009 completed the same-day full-source repeat/control validation at cb894275bd6901f411f1ea3484df78e36677c764. The existing operator's next seven-day check is October7; same-day stability is not a measured long-term noise rate or complete claim mapping. Retain baseline/repeat artifacts and review changed sources, never renew facts from retrieval.

FT-STD-004 adds a separate activity-logistics pilot:12SanDiego entries/72envelopes retain source-model dates and distinguish mixed venue context, qualitative ticket cost, editorial duration/weather and unconfirmed access/transport prompts. Five other activityPages entries remain unmapped. Run tools/activity-quality.mjs alongside hotel quality within the existing weekly operator; no extra scheduler. Both quality report CLIs now reject existing output paths and create new files exclusively, preserving historical artifacts. See docs/plan/activity-evidence-standard.md. No public/model/claim/date change or full non-hotel coverage is implied.

## Next Migrations

All five legacy comparisons have retained source mappings; normalize atomic claim dates and resolve explicitly unknown fee/transport fields when required by a named task. Exact-family prices remain research gaps. Structure Cancun price basis in its source model and adapt public table/export together in a separate reviewed action. Research the three missing exact-room prices through permitted comparable observations; retain historical ranges meanwhile.

Stay-area and itinerary pages still require separate domain contracts for base/transport tradeoffs and day duration/rest/route/weather alternatives. The SanDiego activity pilot maps only its maintained logisticsIndex; other attraction and age-routing records remain migration gaps. The source audit inventories all31canonical pages, not all non-hotel claims.
