# Exact Family Room Research Export

FT-IMP-051, September 30, 2026. This is a reusable offline research/review surface, not a public destination page, verified browser download or publishing approval.

## Single Maintained Input

`tools/family-room-comparison.mjs` calls the existing validated room-capacity and exact-task price adapters. It does not retype prices, fetch hotel pages, run a paid API, renew source dates, convert currencies, sort by price or rank hotels. Original pack/sample files remain immutable. One row is emitted for each public rate plan; an unpriced category remains one row with empty numeric price cells and explicit unknowns, never zero. Membership-required prices and detached starting offers do not enter the comparison.

Each row retains the destination/category, capacity screen and conditions, sleeping setup, kitchen/connection context, category and price observation dates separately, screening date, actual adults/individual child ages, exact arrival/departure/night count, currency/per-configuration-night unit, plan, displayed stay amount and derived nightly equivalent. Provider party/age-input/cutoff basis, priced configuration, fee/tax, deposit, meals, cancellation, conflicts, next checks, clean source URLs and uncertainty limits travel with the numbers. A prepaid stay amount is not added again as an extra fee. Requested beds/connections and historical samples remain labeled. Capacity, budget and booking acceptance are separate questions.

## Reuse

October3 FT-IMP-062 joins multiple maintained packs for **one explicit family and stay** using `--packs` after the first pack path. All packs must name the same destination and every record ID must have exactly one owner; duplicate/overlapping packs fail rather than silently choosing a newer category or transferring a price. Every supplied observation must belong to a selected record and pass its original category/source/currency/party/rate validator before any output or directory creation. Different pack scenarios never supply implicit joined tasks. API: `roomComparisonsCsv(packs, party, asOf, prices)`; existing single-pack API/CSV bytes remain compatible.

The joined CSV has one header and the unchanged, ordered per-pack rows. It does not rank hotels, merge source dates, convert currencies or normalize unlike fee/cancellation terms into a final total. Category and price dates/conditions remain independent; an unpriced record stays visible. Source IDs can repeat across packs because provenance stays within the owning pack, while record IDs cannot. All existing exclusive-write/public-site/symlink protections remain.

Reproducible eight-category, thirteen-row task (eleven public-plan rows, two unpriced categories):

```bash
node tools/family-room-comparison.mjs docs/research/london-six-person-comparison-2026-10-02.json --packs docs/research/london-aldgate-six-person-task-2026-10-02.json docs/research/london-bridge-six-person-task-2026-10-02.json docs/research/london-connected-six-person-task-2026-10-02.json docs/research/london-canary-family-task-2026-10-02.json --date 2026-10-03 --adults 2 --child-ages 4,8,12,15 --arrival 2026-11-08 --departure 2026-11-13 --prices docs/research/london-marlin-six-person-price-observation-2026-10-02.json docs/research/london-limehouse-six-person-price-observation-2026-10-02.json docs/research/london-aldgate-six-person-price-2026-10-02.json docs/research/london-bridge-six-person-price-2026-10-02.json docs/research/london-connected-six-person-price-2026-10-02.json docs/research/london-canary-family-price-2026-10-02.json --output /tmp/family-tripwise-london-joined-2026-10-03.csv
```

Use a fresh output path for another run. This command is an offline research export, not a public London comparison/download or complete corpus qualification. Named task, limitations and next gates: `docs/research/family-room-joined-task-2026-10-03.md`. To maintain it, refresh the owning records/observations through the existing evidence workflow, not the assembled CSV or its screening date. No added scheduler, automatic scraping or date renewal.

October2 FT-IMP-052 adds an explicit task override without changing the evidence pack. Supply all four controls together: `--adults`, `--child-ages` (comma-separated individual ages0-17, or `none`), `--arrival` and `--departure`. Without them, the original pack scenario remains the default. Partial/duplicate controls, invalid dates, noninteger adults/ages and ages above17 fail before output. Age order does not affect matching; repeated ages represent different children, not duplicates to remove. Adults must be a positive safe integer. This changes the research task only, not an observed booking party or source date.

```bash
node tools/family-room-comparison.mjs docs/research/london-room-configurations-2026-09-30.json --date 2026-10-02 --adults 2 --child-ages 4,8,12,15 --arrival 2026-11-08 --departure 2026-11-13 --prices docs/research/london-mitre-price-observation-2026-09-30.json docs/research/london-marlin-price-observation-2026-09-30.json docs/research/london-montague-price-observation-2026-09-30.json --output /tmp/family-tripwise-london-six-2026-10-02.csv
```

The six-person task retains six capacity/gap rows but cannot inherit the five-person observations. Approximate nightly values remain available for a matching party and stay, with their original currency/unit/plan/age-input/tax/fee/deposit/date context. A changed task produces blank numeric price cells rather than zero or an extrapolated per-person amount. Saved checkpoint summaries include the requested party and stay. No new price collection, public URL or destination approval is implied. Current qualification and next gates: `docs/research/family-room-party-controls-2026-10-02.md`.

```bash
node tools/family-room-comparison.mjs docs/research/washington-dc-room-configurations-2026-09-30.json --date 2026-09-30 --prices docs/research/washington-dc-embassy-price-observation-2026-09-30.json docs/research/washington-dc-homewood-price-observation-2026-09-30.json docs/research/washington-dc-residence-price-observation-2026-09-30.json --output /tmp/family-tripwise-dc-2026-09-30.csv
node tools/family-room-comparison.mjs docs/research/london-room-configurations-2026-09-30.json --date 2026-09-30 --prices docs/research/london-mitre-price-observation-2026-09-30.json docs/research/london-marlin-price-observation-2026-09-30.json docs/research/london-montague-price-observation-2026-09-30.json --output /tmp/family-tripwise-london-2026-09-30.csv
node --test tools/family-room-comparison.test.mjs tools/family-room-task.test.mjs tools/family-room-price.test.mjs
```

Use a new output path for every retained checkpoint. Existing files are never overwritten; the public `site/` directory is rejected. Without `--output`, CSV goes to stdout. Default date is the current Eastern date; an explicit historical date is retrospective screening, not new verification. Invalid/duplicate observations, mismatched currencies or incomplete stay tasks fail closed. Duplicate/incomplete/unknown CLI options fail. No source or historical report is changed.

All cells are quoted, internal quotes doubled, and line breaks/tabs flattened. Leading spreadsheet formula characters are neutralized using the existing hotel-download convention. Output protection resolves the nearest existing filesystem ancestor before creating directories and rechecks the destination before exclusive writing, rejecting aliases into the public site as well as direct paths. All original capacity configurations and conditions remain in a separate dated/not-revalidated column, even when the current screen requires a source recheck; historical infant/paid-bed/connection rules are not silently lost or represented as current confirmation. The export is intentionally a detailed audit table; it is not a polished public mobile comparison UI or a complete stay total. Public integration still requires supported task coverage, exact scope approval, desktop/mobile/download QA and verified release.

September30 test task: DC yields six public-plan rows across three priced categories plus one unpriced Pendry row; London yields six public-plan rows across three priced categories plus three unpriced rows. Mixed tax/fee/cancellation/bed bases are visible rather than presented as apples-to-apples best-value rankings. Narrow Pendry no-quote result: `docs/research/washington-dc-pendry-budget-gap-2026-09-30.md`. The original full-corpus/review/rest/SERP/publication gates and Chicago preview hold remain.
