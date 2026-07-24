# Repository Operating Model Audit

Date: 2026-07-24

Action: `FT-OPS-001`

Evidence classification: repository inspection at aligned commit `d12d011b7dc8e35d32b88813b7133ead046c8c6d`; fresh authenticated read-only GSC snapshot collected 2026-07-24 with finalized data through 2026-07-22; verified GitHub Pages workflow metadata; current central Control Room report. No private query export, credential, or personal data was inspected or stored.

## Executive Finding

The operating model is fundamentally sound. Research, claim safety, page review, independent review, exact-path release, deployment verification, and public-safe GSC monitoring are unusually well documented for an early static site.

The main autonomy risk is state duplication. A completed release can remain described as pending across the human roadmap, current cycle, city status, and backlogs even when production and the machine-readable commit history are correct. The current generation layer is the main technical scaling risk: it is deterministic and well tested, but two scripts now contain more than 4,300 lines of mixed content, HTML, and replacement logic.

## Audit Scope

- project mission and trust rules;
- strategy, city selection, and page architecture;
- research and persona workflow;
- roadmap, current cycle, backlogs, city status, GSC, and Control Room alignment;
- static generation, tests, deployment, and production verification;
- release closure and ability to continue without routine user intervention.

## Findings

| Priority | Finding | Evidence | Decision |
|---|---|---|---|
| P1 | Release state is duplicated and drifted after Chicago itinerary deployment. | `FT-IMP-013` was live at `f7a2d7f` through Pages run `30090493666`, while five durable narratives still called it pending. | Reconcile all affected records and add automated state QA. |
| P1 | Generation is becoming difficult to extend safely. | `generate-pages.mjs` is 1,968 lines and `upgrade-priority-pages.mjs` is 2,369 lines; destination content, transforms, and writes share the same files. | Queue a separate behavior-preserving modularization before several more city revamps. |
| P2 | Strategy and technical docs still describe the founding plan as current. | Content strategy still said to finish San Diego before expansion; technical plan still described Next.js/Astro as a candidate rather than the deployed static architecture. | Refresh current strategy and architecture; label old launch inventories as historical. |
| P2 | City status files mix frozen implementation baselines with language such as "latest" and "current." | Daily GSC snapshots advance independently from city transactions. | Define city files as durable decision records and label frozen numbers as baselines. |
| P2 | Backlog section names implied active Chicago work after all five core pages were released. | `IMP-026` through `IMP-029` and `SRR-017` through `SRR-020` remained under `Active`. | Reclassify the group as recently completed and record release evidence. |
| P3 | `ops/current-cycle.md` contains useful history but is too verbose for a machine/operator checkpoint. | Current state is repeated across long historical sections. | Keep history for now, but add a concise structured checkpoint and make it the required reconciliation target. |

## What Is Aligned

- The mission in `AGENTS.md`, `ops/operator.json`, and the product brief is consistent.
- The Control Room remains the sole scheduler and dispatch ledger owner; this audit corrected contradictory legacy ownership wording in the repository roadmap.
- Direct manual user work is distinguished from registered Control Room dispatch.
- The city playbook requires keyword validation, observed SERP overlap, ranking-page inspection, persona hypotheses, and every-section review.
- Hotel research preserves official facts, rough source-dated price ranges, bounded online-review themes, conflicts, unknowns, and trust gates.
- Site releases require focused tests, complete native QA, independent read-only review, exact-path staging, deployment verification, and production invariants.
- GSC snapshots are public-safe and omit credentials, complete raw queries, country rows, device rows, and user data.
- Scan cadence does not create substantive work.

## Current Technical State

| Surface | State | Audit conclusion |
|---|---|---|
| Production | Static GitHub Pages site | Keep. It is fast, inspectable, and appropriate for current scale. |
| Pages | 28 tracked HTML files | Manageable, but city growth should use modular page specs. |
| Tests | 18 focused `.test.mjs` files plus SEO QA after this action | Strong regression base; operating-state QA now covers common release drift. |
| Styling | One 997-line shared stylesheet | Acceptable now; require scoped selectors and visual checks for shared changes. |
| Generation | Two primary scripts totaling 4,337 lines | Highest technical-debt item. Refactor separately with byte-stable output. |
| Dependencies | Node standard library only | Keep until a real product need justifies dependencies. |

## Autonomy Contract

The project can continue without routine approval pauses when an action:

1. arrives from the Control Room with a valid lease and immutable contract, or is directly instructed by the user;
2. is recorded with an action ID and exact paths before substantive editing;
3. uses fresh or correctly labeled evidence;
4. respects URL, trust, external-account, and observation gates;
5. receives native QA and an independent reviewer verdict of `PASS` or `PASS_WITH_P3`;
6. is committed and pushed only after exact-path and origin checks;
7. is production-verified when deployable;
8. reconciles machine and narrative state before closing.

The operator must still stop for the explicit user gates in `AGENTS.md`, invalid dispatches, repository divergence, unresolved P0-P2 findings, trust-sensitive unsupported claims, or ambiguous rollback scope.

## Recommended Sequence

1. Complete this reconciliation and state-QA hardening.
2. Run one behavior-preserving generator modularization transaction before several more city revamps.
3. Run the New York City decision pack from fresh GSC, current Semrush/SERP evidence, ranking-page analysis, personas, and a complete page audit.
4. Promote exactly one NYC page improvement or publication from that evidence.
5. Keep San Antonio as the next city candidate unless fresh evidence changes the order.

`FT-EVAL-002` remains evidence-gated. Do not revive the deferred greater-NYC weekend page, request indexing, mutate external accounts, or create recurring automation from this audit.
