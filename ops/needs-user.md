# Needs User

Last updated: 2026-07-28

No hard blockers.

`FT-OPS-002` is released and production-verified. `FT-DEV-004` is completed and review-clean; no user decision is required.

The authenticated read-only GSC API collector and protected-query workflow are configured, so there is no GSC-login or query-export setup blocker. The July 28 snapshot inspected all 28 sitemap URLs: 20 are indexed and eight are not indexed.

The user reopened research for additional cities on July 28, to resume after `FT-DEV-004` as a separate one-city-at-a-time research transaction. `FT-EVAL-002` remains ineligible until both revised lodging URLs have current crawl and protected query evidence.

The live sitemap contains 28 canonical URLs and was successfully resubmitted in GSC on July 27. GSC still reports 28 discovered pages; URL Inspection now shows the San Diego and Las Vegas family-hotel pages indexed, while the Chicago, New York City, and San Antonio hotel pages are discovered but not indexed. No per-URL indexing request was made.

## Useful Decisions Soon

| Status | Question | Why it matters |
|---|---|---|
| optional | Can a human reviewer verify hotel, area, safety, transit, and stroller claims? | Required before stronger lodging/area recommendations can be stated as reviewed. |
| optional | Should Semrush or DataForSEO budget be used in a future research cycle? | Paid data remains optional and requires an explicit budget decision. |
| resolved | When should destination expansion resume? | The user reopened it for after `FT-DEV-004`; the next city still must be selected from fresh evidence. |

## Escalation Rules

Agents should add questions here when:

- a decision affects business direction
- a claim needs human verification
- paid tools or account changes are needed
- DNS, hosting, billing, or domain changes are needed
- legal, safety, or trust-sensitive claims cannot be handled from sources alone
