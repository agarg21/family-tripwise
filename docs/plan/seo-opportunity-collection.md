# Budgeted Search Collection

FT-IMP-057 tightens the existing `tools/seo-opportunity-pull.mjs` preflight. It adds no provider, endpoint, budget, retry, automation or publication authority. The CLI still uses the explicitly dated manifest/output in its existing main function; every new research batch needs a registered scope and the applicable paid-research authority.

`validateBatch(batch)` remains a no-charge numeric reservation check. `runBatch(batch, output, { auth, fetcher })` validates and snapshots the required budget fields and both task lists synchronously, before output checks or other asynchronous work. Caller changes afterward cannot add tasks, change keywords or raise ceilings. The copy and task arrays are frozen; the caller's object is not modified.

Required fields must be own enumerable data properties, not inherited values or getters. Proxied manifests and task arrays are rejected without evaluating their traps. Task lists must be dense arrays of nonempty trimmed strings of at most120characters, with no duplicate tasks; their own data-property length is pinned once. Keywords require1-200entries; the SERP subset allows0-12entries and every phrase must belong to the keyword list. This guards exact duplicate strings, not semantic variants, case folding or broad equivalence; cluster ownership still needs explicit research.

The cumulative authorized ceiling remains exactlyUSD5, batch ceilingUSD0.50, with a finite nonnegative reconciled prior spend and conservative reservation before calls. No code change grants fresh spending permission. Invalid manifests cause no output receipt or fetch. The collector still refuses an existing output and persists each request's outcome before considering another; a failure stops without automatic retry. Reconcile unknown billed outcomes rather than deleting/replaying the output.

Reports retain public-safe provider estimates, dates, result types/ranked URLs and call costs/statuses, not authentication or raw response bodies. Nulls remain unknown and partial reports remain partial. This guard validates request scope, not provider freshness, source authenticity, complete demand, overlap, family suitability or ranking potential. Protected local authentication and all manual evidence/review/release gates remain unchanged.

Regression command:

```bash
node --test tools/seo-opportunity-pull.test.mjs
```

Local fake-fetch tests reproduce duplicate/sparse rejection, no-output/no-fetch behavior, getters rejected without evaluation, immutable task/budget scope across asynchronous caller mutation, and existing partial failure/cost/output controls. They perform no real API calls. Full native QA and a different independent read-only review remain required; current history divergence holds release separately.
