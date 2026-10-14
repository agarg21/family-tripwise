# Semantic Proposal Review Boundary

FT-IMP-160 adds a bounded **data and review contract**, not a semantic extractor, actual LLM service or publication pipeline. The current collector/watch/weekly workflow is unchanged. The frozen159 benchmark still fails its hypothetical shortcut gate; this protocol does not change that score or claim improved semantic accuracy.

`reviewProposals({snapshot,proposals,config})` treats the snapshot and reviewed field registry as operator-supplied scope; proposals are untrusted data. A HTTPS URL or matching text hash does not authenticate source capture. Real integration must independently join the permitted capture, outcome, date and hash before passing a snapshot. The current demonstration uses only manually authored synthetic proposals and the frozen159 synthetic bodies.

Pilot contracts cover two named Dana room categories, resort/self-parking charges, incidental authorization and Garfield's established youth admission band. They require exact source/field/hash joins and bounded spans in normalized text. Proposal IDs are numeric `proposal-N`, not free-form source identities. Even empty/held snapshots require ownership by a pilot field. Offsets are JavaScript UTF-16 indices, not UTF-8 byte offsets. Output keeps span/hash provenance without copying the supporting quote or entire body. Capacity must follow the named grouped-bed row. Monetary values, units, role and stated tax/age context must share a sentence with one explicit amount; `Intl.Segmenter` handles sentence boundaries rather than splitting decimal periods. Ambiguous multi-amount sentences need a narrower supported span or remain unresolved. These lexical checks are not validation of meaning, applicability or full-page context.

Accepted parties, selected bed variants, stay dates, rate inclusion, eligibility, authorization days/release and other missing conditions remain null. Every admitted proposal retains the original watch clock and mandatory pending context review. Currency interpretation and proposed context flags remain explicitly unverified. Proposals cannot set verification, date-renewal, publication or retry authority. A captured page instruction is data, not an instruction to the worker.

Different submitted values for one field remain unresolved candidate disagreements, with no chosen proposal. This compares **submitted** values only: a model/parser that omits a conflicting sentence can omit the second proposal. Contradiction detection, entity/party reconciliation, freshness and instruction checks therefore remain pending. No promise that all six159context misses are automatically detected is made.

Held denial/unknown snapshots cannot supply proposals or authorize a retry. Malformed or unsupported proposals reject the whole packet rather than quietly accepting a convenient subset. No current family-room price, verified policy or safety/suitability assurance is emitted.

```sh
node tools/semantic-proposal-review.mjs --fixtures docs/research/semantic-proposal-fixtures-2026-10-14.json --corpus docs/research/predicate-review-corpus-2026-10-14.json
```

The demo CLI defaults to print-only. Optional `--output` exclusively creates a new file. Synthetic fixtures cover conflict retention, unknown party/entity/younger-age context, inert instructions, stale-price promotion, approval/acceptance attempts, mismatched hashes, unsupported amounts/ages, held sources and charge-versus-authorization distinctions. Fixture control success is not semantic precision, live policy validation, parent testing, weekly reliability or SEO proof.

Initial demonstration13of14 was not finalgreen: sentence-ending punctuation after a dollar amount rejected the older known age-band proposal. The amount lexer now distinguishes a sentence period from a decimal continuation; comma/extra-decimal/letter continuations cannot become partial amounts. Initial output is preserved privately at `/tmp/ft160-initial-proposal-control.json`, not a current policy observation. Numeric proposal IDs and explicit pilot snapshot ownership were tightened before final review.

Independent cycle one found a P2: a proposed span could end after `$5` inside the full-source token `$50`. The repaired boundary checks complete-source monetary/word tokens and UTF-16 surrogate pairs before validating the slice. Clipped integer, decimal, comma and currency-token regressions reject the proposal; a whole amount ending before sentence punctuation still works. Mandatory pending review was not accepted as a substitute for this lexical fix. Re-review of the revised candidate is required.

Cycle two passed the monetary fix with one P3: the lower age could match a numeric suffix of17. A leading age boundary and complete-age regression close it before the third and final review cycle. Neither finding changed a public policy or authorized a proposal.

Next register permitted native capture-to-proposal integration, retaining no source body and honoring source-specific access/retention rules. A real model comparator needs explicit service, credential and cost scope first. Full source governance and two actual complete weekly cycles remain gates before broad city scaling; this boundary does not advance public source dates, weekly baseline/due state or the scheduler.
