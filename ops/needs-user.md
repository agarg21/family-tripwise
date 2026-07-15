# Needs User

Last updated: 2026-07-15

No hard blockers.

The authenticated read-only GSC API collector is working, so there is no GSC-login blocker. The July 15 snapshot inspected 15 priority URLs: 11 are indexed and four are not indexed. No indexing request was made, and indexing remains separately gated rather than a current blocker.

## Useful Decisions Soon

| Status | Question | Why it matters |
|---|---|---|
| optional | Can a human reviewer verify hotel, area, safety, transit, and stroller claims? | Required before stronger lodging/area recommendations can be stated as reviewed. |
| optional | Should protected query analysis be configured when `FT-EVAL-001` becomes due? | The current public snapshot is fresh, but protected query evidence remains a separate measurement requirement. |
| optional | Should Semrush or DataForSEO budget be used in a future research cycle? | Paid data remains optional and requires an explicit budget decision. |

## Escalation Rules

Agents should add questions here when:

- a decision affects business direction
- a claim needs human verification
- paid tools or account changes are needed
- DNS, hosting, billing, or domain changes are needed
- legal, safety, or trust-sensitive claims cannot be handled from sources alone
