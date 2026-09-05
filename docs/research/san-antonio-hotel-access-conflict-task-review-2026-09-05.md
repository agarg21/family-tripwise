# San Antonio Hotel Access And Conflict Task Review

Status: completed and review-clean; Hilbert cycle-three `PASS_WITH_P3`; research/state only

Checked: 2026-09-05

Action: `FT-RES-032` / `SRR-054`

Target: `https://familytripwise.com/where-to-stay/san-antonio-family-hotels.html`

## Decision Question

Do the September 5 JW Marriott water-access limit and Marriott Rivercenter first-party pool-label conflict change a real family decision, or are they merely accurate facts that do no work on the page?

This is a proxy-reviewed task walkthrough, not user testing. It uses only visible production information and current browser behavior. It does not establish preference, satisfaction, demand, conversion, rank, or CTR.

## Evidence Boundary

- `FT-MAINT-004` / `LRN-020` checked all 12 hotel records against current official property or brand sources on September 5. Price examples and online-review signals remain checked July 26.
- Fresh September 5 authenticated read-only GSC is finalized through September 3: 1,829 property impressions, 1 click, aggregate average position 65.21, and 24/28 inspected URLs indexed. The target is indexed with 3 impressions at page-average position 6.33 and a July 30 last crawl.
- GSC contains zero finalized post-release days and no public aligned query cohort. It is property/indexing orientation only and cannot evaluate this release, traffic, CTR, or ranking.
- The live page was checked at exact 1280 by 900, 390 by 844, and 320 by 800 viewports. No repository-only hotel knowledge was used to complete the tasks.

## Tasks

### A. Family Of Five Resort-Water Choice

Two adults and three children ages 4, 8, and 12 need a two-night resort-led stay. All five need access to the property's water features. The planner must reduce the page to at most two options, compare a large stay-put water complex with a villa kitchen/laundry setup, make a provisional choice, and leave with exact occupancy, access/operation, parking, and final-total checks.

### B. Downtown Indoor-Water Control

A family of four has already chosen Downtown and wants an indoor water backup. It must compare the Marriott Rivercenter route with any supportable alternative, avoid treating Marriott's pool configuration as settled, make a provisional choice, and identify the exact room, pool-operation, parking, and final-total checks.

## Observable Route

| Surface | 1280 x 900 | 390 x 844 | 320 x 800 | Observable role |
|---|---:|---:|---:|---|
| Short-answer heading | 1.6 viewports | 1.8 | 2.0 | Separates resort-led from Downtown-led stays. |
| Trip-style heading | 2.2 | 2.9 | 3.3 | Names the initial hotel sets. Cards are labels, not links. |
| Comparison heading | 3.0 | 4.6 | 5.2 | Supplies role, area, rough total, anchor, and one check per hotel. |
| JW Marriott row | 3.4 | 5.0 | 5.8 | Exposes the five-wristband limit and occupancy check. |
| Wild Oak row | 3.5 | 5.4 | 6.1 | Exposes villa/kitchen/lazy-river role and studio-versus-villa check. |
| Drury row | 3.9 | 5.9 | 6.7 | Does not expose its indoor pool in the comparison row. |
| Marriott Rivercenter row | 4.2 | 6.3 | 7.1 | Says `Indoor pool and Rivercenter access`; its row-level check is occupancy only. |
| JW Marriott card | 4.9 | 7.1 | 7.9 | Supplies scale, some five-person inventory, access limit, operations, parking, and total checks. |
| Wild Oak card | 5.3 | 7.6 | 8.6 | Supplies villa sizes, kitchen/laundry, lazy river, vacation-club context, and exact checks. |
| Drury card | 6.1 | 8.7 | 9.9 | First place that explicitly publishes both indoor and rooftop outdoor pools. |
| Marriott Rivercenter card | 6.7 | 9.5 | 10.8 | First place that exposes the official `Indoor Pool` versus `Indoor/Outdoor Pool` conflict. |
| Source-method heading | 7.9 | 11.6 | 13.2 | Explains evidence classes and links current official sources. |

The full document had zero horizontal overflow at all three viewports. The 820-pixel comparison table stayed inside a 352-pixel or 282-pixel mobile scroller. That scroller is not keyboard-focusable and has no region role or accessible label, matching the pre-existing cross-page P3 already recorded under `FT-RES-031`.

## Walkthrough Results

### Task A

| Step | Result | Depth and evidence |
|---|---|---|
| Start | `YES` | `NEARBY`. The short answer and trip-style starts separate resort-led water time from Downtown stays and name four initial resort shapes. |
| Reduce | `YES` | `DEEP` on mobile. For this stated large-complex-versus-kitchen comparison, Hyatt's visible published setup covers four while JW exposes some five-person inventory; La Cantera serves a different pools/Six Flags role. JW Marriott and Wild Oak remain as the two task-aligned starts. This does not establish that Hyatt or La Cantera is universally unsuitable. |
| Compare | `YES` | `DEEP`. JW Marriott supplies the larger water-complex role, a rough $450-$850+ range, some five-person inventory, and the five-wristband rule. Wild Oak supplies one- to three-bedroom villas, kitchen/laundry, lazy river, a rough $260-$500+ range, and vacation-club context. Both expose occupancy, operation, parking, and total unknowns. |
| Trace | `PARTIAL` | `DIRECT` for freshness and recognizable review/rough-price labels, `DEEP` for the full evidence-class explanation and source links. The `Why compare it` cards attribute official facts but sit inside editorial comparison records, so every class is not immediately separable. |
| Decide | `YES` | `DEEP`. Provisional choice: JW Marriott when the largest stay-put water complex is the priority, subject to one room legally accommodating all five and still issuing five wristbands; Wild Oak when a qualifying villa's kitchen/laundry and lazy river matter more. |
| Verify | `PARTIAL` | `DIRECT` for JW Marriott's occupancy, access-rule, operation, parking, and total checks. Wild Oak's open card supplies occupancy, equipment, water-feature, offer-term, and total checks, but parking and a distinct access-rule check remain only in the earlier general caution. They are not close enough to call this step complete. |
| Recover | `YES` | `DEEP`. If JW Marriott's exact room or access rule fails, the page preserves Wild Oak as a different viable shape rather than inviting an unsupported assumption. If a Wild Oak studio lacks the required setup, the planner is told to verify a qualifying villa. |

The JW Marriott limit is decision-active: five wristbands exactly match the party size but do not prove room occupancy or future access. It therefore changes verification rather than supporting a guarantee.

### Task B

| Step | Result | Depth and evidence |
|---|---|---|
| Start | `YES` | `NEARBY`. The short answer names Marriott Rivercenter when an indoor pool and mall access matter, and the Downtown trip-style start includes it. |
| Reduce | `PARTIAL` | `DEEP`. Marriott is easy to find, but Drury's officially published indoor pool is absent from its quick start and comparison row. Discovering that control requires reaching and opening hotel card 8. |
| Compare | `YES` | `DEEP`. The Marriott row links directly to card 11; one expansion exposes the two official labels, and both labels still support an indoor component. Drury provides a comparable indoor/outdoor-pool option when its card is opened. |
| Trace | `YES` | `DEEP`. Once the Marriott card is opened, the conflicting first-party labels are explicit and separate from review signals and estimates. Drury's indoor/outdoor pool statement is presented as an official fact. |
| Decide | `YES` | `DEEP`. Provisional choice: Drury when confirmed indoor water backup is the binding condition; retain Marriott only if the family values Rivercenter access enough to verify the current configuration before booking. |
| Verify | `YES` | `DIRECT` within the opened cards. Drury requires current pool operations, exact room/suite, parking, food schedule, and total checks. Marriott requires current pool configuration and operation, occupancy, event calendar, parking, and total. |
| Recover | `YES` | `DEEP`. The Marriott row links directly to the conflict-bearing card, and the page supplies Drury as a supportable alternative. The route is not fast, but the task is not blocked and no unsupported conclusion is required. |

The Marriott conflict is disclosed only in the deep card, but both first-party labels still support an indoor component. Its absence from the comparison row is a minor row/detail consistency issue, not evidence that the page drives a wrong indoor-water decision.

## Adversarial Checks

- Removing the conflict from the detail card would convert uncertainty into an unsupported indoor-pool assumption. The detail is necessary.
- Carrying the existing Marriott conflict into the comparison check could improve consistency, but it would not make Drury easier to discover or materially change recovery. The evidence does not justify a standalone implementation.
- Adding Drury's indoor-pool fact or every amenity to the table would increase scan burden. The control does not establish enough user value for that expansion.
- Moving the source list earlier would not fix the consistency issue. The issue is the mismatch between the comparison row and the already-correct detail record.
- No authority claim beyond research-based current official facts is needed.

## Decision

`PRESERVE_WITH_P3`.

Preserve the 12-hotel set, page role, comparison, and refreshed detail cards. Retain no implementation candidate. The Marriott row/detail mismatch is a non-blocking P3 that may be considered only with later evidence-qualified work; changing its check alone would not resolve the control's deep Drury discovery path.

Task A remains `PARTIAL` on `Trace` and `Verify`, but the missing Wild Oak parking/access proximity does not prevent a two-option shortlist or provisional choice. Task B is `PARTIAL` only on `Reduce`; the direct Marriott anchor plus one expansion exposes the conflict, both labels support an indoor component, and the deep Drury path is not independently shown to be a material block. Neither result clears the P2 implementation gate.

## Confidence And Falsification

Confidence is high for current interface order, text, responsive containment, and the row/detail mismatch; medium for the bounded task scores; low for prevalence, behavior, satisfaction, conversion, demand, rank, or CTR.

Reopen a bounded candidate only if Marriott's official pages change materially, recurring current questions or behavior evidence establish indoor-water comparison as a real block, an independent task cannot recover through the direct card route, or aligned query evidence changes the page job.

## Independent Review

Hilbert (`01a07291-2bcc-7372-a64a-38e02504cf07`) reviewed the complete diff and independently reproduced the tasks, geometry, GSC limits, release reconciliation, scope, and QA.

- Cycle one returned `FAIL` for two P2s and one P3: unsupported candidate/severity, incomplete Wild Oak verification, and overstated direct evidence-class tracing.
- Cycle two verified those corrections and returned `PASS_WITH_P3` with no P0-P2. It accepted the Marriott mismatch as a proportional residual P3 and found two record-precision P3s in the full-test count and `decision error` wording.
- Cycle three verified both record corrections and returned `PASS_WITH_P3` with no P0-P2. The only residual is the non-blocking Marriott row/detail consistency P3.

The reviewer changed no file or external state.
