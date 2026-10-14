# Governed Pilot Admission

FT-IMP-164 implements the independent candidate from163 as a **new opt-in entrypoint**, `createGovernedProposalCollector`. It wraps161's selected capture collector without changing that low-level primitive, the old audit/weekly CLI or the scheduler. Future actual pilot orchestration must use this governed route and162's immutable handoff; calling a legacy primitive to evade a recorded HOLD is prohibited. This is not project-wide enforcement, a robots parser, a sandbox, independent access authorization or a running weekly service.

The default [pilot registry](../../ops/source-governance-pilot.json) carries exactly163's three HOLD sources. Every matching group/path, use/retention permission and expiry remains unknown/null. There are **zero approved live sources**. Research evidence: [163](../research/source-governance-pilot-2026-10-14.json); controlled implementation evidence: [164](../research/source-governance-admission-2026-10-14.json). No failed policy endpoint or factual source is requested in this implementation.

## Admission Contract

The validator requires a strict, dated operator record for each exact selected source. A limited approved record must identify the current collector token, a known200 robots observation/hash and matching group/path ALLOW, separately supported limited factual use and transient body-free retention, dated reviews and an expiry no later than24hours after the earlier review. This conservative **pilot policy window** is not a general RFC compliance claim, source license or extension of a fact date. Actual4xx/unknown/error cases remain operator review rather than automatic permission. Matching-token comparison is case-insensitive; the function consumes a reviewed verdict and does not parse or evaluate robots text.

Schema keys, source/record identities, group/token, status/hash, dates, use and retention are checked. Held, unknown, prohibited, missing, duplicate, mismatched, future or expired admission fails before collection. All authority inputs are copied at construction. Eligibility is rechecked for each execution and immediately in the delegated transport wrapper. Concurrent governed executions reject so admission evidence cannot cross attempts. Existing exact-address/no-redirect selection, access holds, context validation and per-source no-replay behavior remain161's responsibility and are unchanged.

Approved test records are explicitly `SYNTHETIC_GOVERNANCE_CONTROL`, with fake transport. That class cannot use implicit or explicitly passed default `fetch`. A supplied custom transport or local callback is privileged trusted code, not sandboxed; checking its identity cannot prove that malicious code performs no network I/O. Production must use only operator-reviewed policy records that passed their own evidence/QA/review release. Strings, URLs and hashes cannot independently authenticate a publisher or legal rights, and an LLM/source proposal must never supply these authority inputs.

## Output And Limits

`reviewPackets()` remains161/162-compatible and keeps every claim/context pending with original dates. `governanceProof()` is a separate body-free copy containing registry/selection pins, source records and admission timestamps joined to the checkpoint attempt. `transport_admission_checked` distinguishes a completed transport admission from only earlier eligibility. `http_request_count:null` deliberately does not turn checks into network counts. If a final transport check fails, native collection retains its normal policy/fetch failure outcome; no permission or retry is inferred.

The proof does not authenticate capture, revalidate factual support, renew policies/prices, verify an accepted family booking or authorize publication. The current registry's HOLD cannot be cleared by a positive predicate, readable privacy policy, prior200, user weekly-research request or passage of time. This module adds no source-owner contact, additional scheduler, LLM service, spending or automatic public update.

```sh
node --test tools/source-governance-admission.test.mjs
```

Thirteen focused tests include twelve read-only controls and one disposable fake-checkpoint/162-handoff integration. They exercise real three-source HOLD rejection; synthetic approved token/group/use/retention; missing/unknown/prohibited records; future/expired/overlong windows; unknown/4xx/private/approval keys; fixture/default-transport rejection; original-date/context preservation; per-request expiry; immutable pins/proofs; deny/no-replay; current native token and sequential execution. These are gate correctness and maintainer proxies, not legal permission, live source requests, semantic precision, parent/mobile testing, actual weekly reliability or scale readiness.

Next: qualify an independently eligible permitted/licensed source or resolve the three exact policy gates only after documented changed permitted access and source-use/retention evidence. Register and review a live governance update separately before any actual pilot. No retry through alternate origins/tools, no source-owner contact without fresh explicit authorization, and no old-primitive fallback. Source governance for the rest of the inventory and two actual complete weekly cycles remain separate gates before broad city growth.
