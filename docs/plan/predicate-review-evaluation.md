# Predicate Review Evaluation

FT-IMP-159 evaluates a **hypothetical missing-predicate shortcut**: skip review when expected text still matches. This is not current production routing. Existing checkpoint queues retain every positive and missing candidate, and all remain unverified. This tool never changes that behavior.

The bounded [synthetic corpus](../research/predicate-review-corpus-2026-10-14.json) is grounded in the October14 Garfield/Dana pilots, not copied source archives or a random sample of real policies. Human labels specify whether a fabricated example needs review. They are not proof that any actual hotel or venue changed its policy. The cases stress amounts, units, taxes, room titles, capacity, appliances, ages, contradictory retained text, party/entity context, old prices, source instructions and held outcomes.

```sh
node tools/predicate-review-eval.mjs --corpus docs/research/predicate-review-corpus-2026-10-14.json
```

The default CLI prints a summary and writes nothing. Optional `--output` uses exclusive creation and refuses existing files. Input is bounded JSON, never executable JavaScript or an instruction channel. The reviewed local watch registry provides patterns; every selected check must belong to the exact approved source. Evidence references stay local and must exist. No fetch, LLM, retry, publishing or date-renewal capability is provided.

Retrieved-case confusion matrices compare missing-predicate triage with whole-text-hash triage. Held denials and unknown attempts are separate holds, excluded from retrieved precision/recall; neither authorizes retry. Each result retains synthetic before/after hashes but never returns HTML. Those hashes are fixture identity, not real-source evidence hashes.

The experimental fixture target is100% seeded critical review recall and95% review precision. This is **review triage**, not the separately proposed semantic claim-change precision threshold. Semantic claim precision is always null and semantic refresh readiness remains false, even if a fixture detector passes. Report every critical miss rather than altering labels or mistaking native test success for detector adequacy.

An unchanged expected clause can coexist with a conflicting notice, another entity's description, a different accepted party, a stale price or a malicious instruction. A changed clause may instead be harmless wording drift. Source-bound extraction, conditions, conflicts and human reconciliation remain separate from lexical presence and body hashes.

The result informs the next bounded semantic-candidate/contradiction design. It does not qualify broad city growth, complete claim coverage, two actual weekly cycles, current booking prices, family suitability, parent preference or SEO lift. Public pages, models, CSV, source dates, access holds, the current collector and scheduler remain unchanged. No new LLM service or credential/spending authority is inferred.
