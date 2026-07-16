# San Diego Family Reset Atlas: Source-Worthy Asset Plan

Action: `FT-AUTH-001`
Prepared: 2026-07-16
State: research brief only; no asset published and no outreach sent

## Decision

Build toward one original asset: a **San Diego Family Reset Atlas**, a source-dated dataset and map that helps a parent find and verify practical reset options around major family trip anchors.

The useful unit is not another attraction recommendation. It is a structured record of what a family can verify before a demanding outing: an indoor fallback, a quiet or sensory support, a caregiver facility, a mobility constraint, a stroller/transit rule, or a nearby public-space reset option. Every record exposes its source, checked date, confidence, and human-review state.

Do not publish the atlas from this brief. It first needs a separate build action, source licensing review, and completed human review for any firm access, route, stroller, sensory, or family-suitability claim.

## Why this can earn citations

The current source ecosystem is useful but fragmented:

- The [City of San Diego park-location dataset](https://data.sandiego.gov/datasets/gis-park-locations/) supplies machine-readable park geometry and is updated weekly, but it does not document the family reset conditions needed for this use case.
- The [San Diego Tourism Authority accessible-travel guide](https://www.sandiego.org/plan-your-trip/visitors-centers-information/disability-accessible-travel-in-san-diego) and its [attraction accessibility overview](https://www.sandiego.org/plan-your-trip/visitors-centers-information/disabled-visitor-resources-for-san-diego-attractions) collect useful accessibility resources, but do not provide a source-dated, filterable cross-attraction reset dataset.
- [MTS riding rules](https://www.sdmts.com/rider-info/how-ride/rules-riding) contain stroller-specific operating constraints that should not be collapsed into a generic “transit friendly” label.
- The [San Diego Zoo accessibility page](https://zoo.sandiegozoo.org/visit/guests-with-disabilities) documents mobility and guest-service details, while [SAN Airport accessibility](https://www.san.org/accessibility/) documents support for travelers with visible and non-visible disabilities. These are venue-specific sources rather than one trip-planning layer.
- Local family publishers already organize attractions, outings, and disability resources. That demonstrates audience relevance, while leaving room for a maintained, transparent data asset they can reference rather than duplicate.

This is a bounded landscape review, not proof that no comparable asset exists. The linkability hypothesis must be tested with real editors and families only after a credible prototype exists and the user authorizes external contact.

## Proposed MVP

### Coverage

Start with the 13 high-use anchors enumerated below across five existing San Diego planning clusters; do not add a new destination or indexable page in this action.

| Cluster | Candidate anchors for verification | Why included |
|---|---|---|
| Balboa Park / Zoo | San Diego Zoo, Fleet Science Center, The Nat, central Prado | Multi-hour outing with venue-specific mobility and sensory documentation |
| Downtown / Waterfront | New Children's Museum, Waterfront Park, SAN Airport arrival/departure | Common arrival and activity sequence with indoor/outdoor transitions |
| La Jolla | Birch Aquarium, La Jolla Shores | Major family anchors with different venue and beach verification needs |
| Mission Bay | Belmont Park, Mission Bay public parks | Outdoor-day reset and public-space verification use case |
| Old Town / Mission Valley | Old Town State Historic Park, one MTS transfer anchor | Transit/stroller rule and itinerary-reset use case |

Anchors are research candidates, not recommendations. Final coverage requires a separate scope review.

### Record schema

Each atlas record should contain:

| Field | Rule |
|---|---|
| `anchor_id`, `name`, `cluster`, coordinates | Stable identifier and location; coordinates must come from an authorized source |
| `reset_type` | Controlled value: indoor fallback, quiet/sensory support, caregiver facility, mobility support, public-space reset, or transport constraint |
| `source_fact` | Short paraphrase of what the source actually establishes; no copied prose |
| `source_owner`, `source_url`, `source_published_or_updated_at` | Preserve provenance and source freshness when exposed |
| `checked_at` | Date Family Tripwise rechecked the source |
| `evidence_class` | Official first party, government open data, authoritative nonprofit, or human field review |
| `confidence` | High only for an explicit current source; otherwise medium, low, or `UNKNOWN` |
| `human_review_status` | `not-required`, `needed`, `in-review`, or `complete` |
| `operational_caveat` | Exact re-verification prompt for hours, availability, route, capacity, or policy |
| `license_or_reuse_note` | Required before redistributing data or derived coordinates |

Do not create a composite “family friendly,” “stroller easy,” “safe,” or sensory-suitability score. Filters should expose sourced attributes and uncertainty, not rank places.

### User-facing form after validation

The eventual asset may provide:

- a filterable map plus downloadable CSV/JSON;
- a source and freshness panel for every record;
- cluster views around the existing San Diego pages;
- a printable reset-plan worksheet;
- a visible corrections and changelog path.

The downloadable, documented dataset and change history are the citation-worthy core. The map is the interface, not the only artifact.

## Evidence and human-review plan

| Evidence question | Minimum source | Human gate |
|---|---|---|
| Does the location or facility exist? | Current official venue page or licensed government dataset | Required if the source is ambiguous |
| Does a venue explicitly offer a stated service? | Current first-party accessibility/guest-services page | Review paraphrase; recheck before release |
| Is a route or transfer practical with a stroller? | MTS rule plus route-specific test | Always required; never infer convenience from ADA accessibility |
| Is a space quiet, low-stimulation, shaded, or suitable for a reset? | Explicit venue statement plus field review | Always required before a firm label |
| Is a restroom a family restroom or does it have a changing station? | Explicit facility source or field verification | Always required before a firm label |
| Are hours, admission, parking, or services available? | Current official operational source | Show checked date and re-verification prompt |
| Can open data be redistributed? | Dataset license and attribution terms | License review before downloadable release |

Human review must record reviewer, review date, method, evidence, and notes. A missing review produces `UNKNOWN`, not an inferred positive.

## Quality and release gates

The asset is not ready for publication or citation outreach until all are true:

1. All 13 enumerated anchor records and at least 30 useful reset/constraint records exist.
2. Every record has a current source, checked date, evidence class, confidence, and license note.
3. Every trust-sensitive field is either human-reviewed or explicitly `UNKNOWN` and non-firm.
4. Two parents independently complete three representative planning tasks without explanation; task success and confusion are recorded.
5. The dataset validates deterministically, the map is keyboard/mobile usable, and no form data is stored.
6. A corrections policy, methodology, changelog, and next-review date are visible.
7. The final release receives independent code/policy review and any required human content review.

Stop or narrow the build if official sourcing cannot support at least 11 of the 13 enumerated anchor records, license terms block a useful downloadable dataset, or user testing shows that the atlas merely duplicates existing lists.

## Prospect scoring method

This map identifies possible future citation audiences; it is not an outreach list and contains no private contact data.

- Audience and topic alignment: 0-3
- Existing resource/editorial format fit: 0-3
- Likelihood that a transparent dataset adds something non-duplicative: 0-3
- Domain trust and local relevance: 0-2
- Total: 0-11; Tier A = 10-11, Tier B = 8-9, Tier C = 6-7

Scores are operator judgments from current public pages, not promises of coverage or links.

## Scored authority prospect map

| Tier | Prospect and public evidence | Audience | Format | Added value | Trust/local | Total | Why it may cite after release |
|---|---|---:|---:|---:|---:|---:|---|
| A | [San Diego Family Magazine](https://www.sandiegofamily.com/) | 3 | 3 | 3 | 2 | 11 | Publishes local outings plus *Flourishing Families* disability resources; a maintained source layer could complement editorial guides |
| A | [San Diego Moms](https://sandiegomoms.com/about-us/) | 3 | 3 | 3 | 2 | 11 | Explicitly connects local families to resources and publishes frequently; atlas filters answer a practical planning gap |
| A | [Autism Society San Diego recreation resources](https://www.autismsocietysandiego.org/resource-categories/recreation) | 3 | 3 | 3 | 2 | 11 | Maintains recreation resources for the local autism community; only reviewed sensory/reset records would be relevant |
| A | [San Diego Tourism Authority accessible travel](https://www.sandiego.org/plan-your-trip/visitors-centers-information/disability-accessible-travel-in-san-diego) | 3 | 3 | 2 | 2 | 10 | Operates a destination accessibility resource; a transparent dataset could extend trip-planning utility if quality and licensing pass |
| B | [Exceptional Family Resource Center](https://efrconline.org/) | 3 | 1 | 3 | 2 | 9 | Helps families navigate disability services and resources; relevance depends on co-reviewed inclusive records rather than tourism claims |
| B | [San Diego Regional Center resources](https://www.sdrc.org/resource) | 3 | 2 | 2 | 2 | 9 | Maintains family support resources; citation fit is narrower and requires demonstrated benefit for its community |
| B | [KidsOutAndAbout San Diego day trips](https://sandiego.kidsoutandabout.com/content/101-family-day-trips-san-diego) | 3 | 3 | 2 | 1 | 9 | Publishes structured local outing guides; the atlas could supply verification-oriented logistics absent from list formats |
| B | [La Jolla Mom family-planning hub](https://lajollamom.com/san-diego/family/) | 3 | 3 | 2 | 1 | 9 | Covers San Diego family logistics and stroller/age planning; a citable dataset may complement first-hand editorial guidance |

Tier reflects prioritization after the asset exists, not permission to contact anyone. Before any future outreach, recheck the prospect page, remove conflicts/competitors with no genuine editorial fit, prepare one individualized citation reason, and obtain explicit user approval to send.

## Source verification log

Checked 2026-07-16:

- City park dataset, MTS rules, Zoo accessibility, SAN accessibility, Balboa Park parking, and all non-tourism prospect pages returned HTTP 200 in public probes.
- The two San Diego Tourism Authority pages were readable in current web research but returned HTTP 403 to command-line probes. Treat automated fetchability as `UNKNOWN`, not as a site defect; recheck manually before build or outreach.
- No message, form, indexing request, partnership request, or external-account change was made.

## Recommended next action

Two independent follow-ups are ready for later operator selection:

1. `FT-RES-003`: audit official-source coverage and reuse/license terms for the 13 enumerated candidate anchors.
2. `FT-DEV-003`: build an unpublished schema/validator and map shell outside `site/`, using synthetic fixtures until source and license review permits real records.

Do not publish the atlas, integrate it into a protected page, or contact prospects until the evidence, licensing, user-test, human-review, and release gates above are satisfied.
