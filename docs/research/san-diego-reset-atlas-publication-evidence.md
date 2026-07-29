# San Diego Family Reset Atlas: Candidate Evidence and Parent-Test Protocol

Action: `FT-AUTH-002`

Prepared: 2026-07-29

State: unpublished internal candidate; not publication evidence on its own

## Decision

The repository now contains a source-bounded candidate that is large enough for human product testing:

- 39 original-paraphrase records cover the exact 13 planned anchors, with 3 records per anchor.
- 19 current official first-party or government URLs support the bounded source facts; all 19 returned HTTP 200 during the 2026-07-29 reachability check.
- All 39 records retain source owner, URL, source update date when exposed, checked date, evidence class, confidence, review state, reuse state, operational caveat, and reuse note.
- All 39 coordinate pairs are null and have state `UNKNOWN`.
- All 39 records are `internal-research-only`.
- All 273 trust-sensitive states are `UNKNOWN`: 39 records multiplied by 7 controlled fields.
- Three representative tasks are ready for independent completion by two parents. No agent result counts as either parent result.

This completes the candidate-build portion of `FT-AUTH-002`. It does not clear publication, downloads, map coordinates, outreach, recommendations, or firm family-suitability claims.

## Evidence Classification and Freshness

| Evidence | Classification | Freshness | What it supports | What it does not support |
|---|---|---|---|---|
| Official venue, agency, park, airport, and transit pages | Current public primary evidence | Manually checked 2026-07-29; all 19 cited URLs returned HTTP 200; source-level update date is `UNKNOWN` except the dated Birch Aquarium article | Short, original paraphrases of facts explicitly present on the cited page | Experience quality, current on-site condition, route ease, safety, quiet, stroller ease, or family fit |
| `docs/research/san-diego-reset-atlas-source-license-audit.md` | Durable repository research | Original audit 2026-07-16; candidate boundary refreshed 2026-07-29 | Coverage, attribution, reuse limits, and unresolved rights | Legal advice or structured-redistribution permission |
| `src/prototypes/san-diego-family-reset-atlas/` | Deterministic internal product candidate | Built and validated 2026-07-29 | Schema behavior, source visibility, filtering, unknown-state handling, and usability testing | Public demand, ranking, backlink acquisition, or human usability |
| Parent usability evidence | Required human evidence | `NOT STARTED` | Whether two parents can complete the same planning tasks without false confidence | Any result until two independent parents actually complete the protocol |
| Trust-sensitive human review | Required human evidence | `NOT STARTED` | A future bounded conclusion for a specifically reviewed field | Any current trust-sensitive conclusion; every field remains `UNKNOWN` |

GSC evidence is not used to claim demand or performance for this unpublished candidate. Fresh GSC evidence promoted the authority lane, but this action is product and authority evidence work rather than a ranking experiment.

## Acceptance Ledger

| Gate | Current result | Release consequence |
|---|---|---|
| Exact 13-anchor coverage | `PASS`: 13/13 | Candidate testing may continue. |
| At least 30 useful candidate records | `PASS`: 39 | Candidate testing may continue. |
| Current source, owner, URL, date, evidence, confidence, review, and reuse fields | `PASS`: present on 39/39 records | Sources and uncertainty are inspectable. |
| Trust-sensitive states controlled and non-firm | `PASS`: 273/273 are `UNKNOWN` | No trust-sensitive conclusion may be published from this candidate. |
| Coordinate provenance | `PASS`: 39/39 are null and `UNKNOWN` | The cluster board must not be represented as geography. |
| Structured reuse | `BLOCKED`: 39/39 are `internal-research-only` | No downloadable or public dataset. |
| Approved evidence registry | `BLOCKED`: intentionally empty | No record can move to `human-reviewed`, `cleared-data`, or `verified-source` until a later reviewed action adds an exact `docs/research/*.md#heading` reference. |
| Two parents independently complete the same three tasks | `NOT STARTED` | Publication remains blocked. |
| Human review of any firm route, stroller, sensory, quiet, safety, caregiver-facility, or family-fit claim | `NOT STARTED` | Such claims remain `UNKNOWN`. |
| Public methodology, corrections path, changelog, and review cadence | `NOT STARTED` | A later public artifact must add these before release. |
| Publication, outreach, or indexing authority | `NOT REQUESTED` | No site, sitemap, deployment, indexing, outreach, or account action. |

## Anchor Coverage

| Anchor | Candidate records | Primary owner or owners | Unresolved release gap |
|---|---:|---|---|
| San Diego Zoo | 3 | San Diego Zoo Wildlife Alliance | Current service availability and every trust-sensitive conclusion require human review. |
| Fleet Science Center | 3 | Fleet Science Center | Program timing and actual sensory conditions require same-day verification and human review. |
| The Nat | 3 | San Diego Natural History Museum | Current equipment, routes, crowding, and suitability remain unverified. |
| Central Prado / Balboa Park | 3 | City of San Diego Parks and Recreation | Tram operation, surfaces, shade, route practicality, and facility condition remain unverified. |
| The New Children's Museum | 3 | The New Children's Museum | Room availability, caregiver facilities, actual sensory conditions, and family fit remain unverified. |
| Waterfront Park | 3 | County of San Diego Parks and Recreation | Fountains, playgrounds, restrooms, closures, and on-site conditions are volatile. |
| San Diego International Airport | 3 | San Diego County Regional Airport Authority | Terminal access, service request requirements, walking routes, and current room availability remain unverified. |
| Birch Aquarium | 3 | Birch Aquarium at Scripps / UC San Diego | Program and equipment availability, actual sensory conditions, routes, and family fit remain unverified. |
| La Jolla Shores | 3 | City of San Diego Lifeguard Services | Equipment, amenity condition, water, surface, crowding, safety, and suitability remain unverified. |
| Belmont Park | 3 | Belmont Park | Current operations, facilities, routes, sensory conditions, and family fit remain unverified. |
| Mission Bay public parks | 3 | City of San Diego Parks and Recreation | An exact park, closures, amenities, surfaces, and on-site conditions must be selected and verified. |
| Old Town San Diego State Historic Park | 3 | California State Parks | Hours, route barriers, entrances, restroom condition, and stroller practicality remain unverified. |
| Old Town Transit Center | 3 | San Diego Metropolitan Transit System | Service status, platform and elevator routes, transfers, and stroller practicality remain unverified. |

## Parent-Test Tasks

The same three tasks must be completed independently by Parent A and Parent B. Use anonymous labels only. Do not collect names, contact information, child diagnoses, exact travel dates, or other sensitive data.

### Task 1: Balboa Park and Zoo Reset Plan

Scenario: You are planning a Zoo and Balboa Park day for a family that may need mobility support and a lower-stimulation break.

Ask the parent to:

1. Find two or three records that could help prepare the day.
2. Open the cited official source for each selected record.
3. Explain what the source establishes and what the atlas still marks `UNKNOWN`.
4. List the checks they would make before relying on the information.

### Task 2: Airport to Downtown Caregiver Plan

Scenario: You arrive through SAN and may visit the waterfront or The New Children's Museum. You need to identify caregiver facilities and a possible reset option without assuming either is available or suitable.

Ask the parent to:

1. Find two or three records spanning the airport and downtown cluster.
2. Open the cited official source for each selected record.
3. Explain what is a source fact versus an unresolved suitability question.
4. List the checks they would make before relying on the information.

### Task 3: Coast, Mission Bay, and Old Town Disruption Plan

Scenario: You are considering La Jolla, Mission Bay, and Old Town with a stroller, but weather or transit disruption may force a change.

Ask the parent to:

1. Find two or three records that could help prepare alternatives or constraints.
2. Open the cited official source for each selected record.
3. Explain why the abstract cluster board is not a geographic distance map.
4. List the route, service, weather, facility, or other checks they would make before relying on the information.

## Parent-Test Method

Run the test separately with each parent:

- Give the participant the prototype and the three task texts without a product walkthrough.
- Do not explain the filters, record cards, source links, confidence labels, or unknown states unless the participant is completely blocked.
- Record task completion, approximate completion time, source-link use, confusion points, false-confidence moments, and words the participant interprets as a recommendation.
- Record observations only. Do not infer a diagnosis, family type, or demographic characteristic.
- Store only anonymous Parent A and Parent B notes in a later public-safe research record.
- An agent may format real notes, but it must not invent, simulate, or stand in for a participant.

The human usability gate passes only if both parents:

- complete all three tasks;
- use at least one official source link in each task;
- correctly distinguish a bounded source fact from an `UNKNOWN` trust-sensitive conclusion;
- understand that the cluster board is not geography;
- do not interpret the candidate as a recommendation or verified family experience; and
- can name the checks they would make before relying on a record.

Any repeated misunderstanding, false confidence, inability to recover from filtering, or treatment of the board as a distance map is a product finding to fix before publication consideration.

## Recheck and Release Rules

- Recheck all source pages no later than 2026-08-12 before human testing or any release decision.
- Recheck operationally volatile sources on the day of a test or release decision, especially Waterfront Park, SAN facilities, Old Town State Park, and MTS service or station information.
- Keep missing source update dates as `UNKNOWN`; a checked date is not a publication date.
- Reject impossible calendar dates rather than relying on date-parser normalization.
- Treat the HTTP 200 check as reachability only, not proof that a fact remains current or that a service will be available.
- Preserve original paraphrases and direct source links. Do not copy source prose, maps, photos, icons, or downloadable files.
- Do not add coordinates until exact source and reuse rights are recorded. If only some anchors have cleared geometry, do not imply that the resulting view is complete.
- A public version needs a visible methodology, corrections path, changelog, next-review date, and human-review record.
- Any recommendation or firm trust-sensitive conclusion requires field-specific human evidence. Unsupported fields remain `UNKNOWN`.

## Source Register

All sources below were used as bounded factual inputs and checked 2026-07-29:

1. San Diego Zoo Wildlife Alliance: [Guest accessibility](https://zoo.sandiegozoo.org/visit/guests-with-disabilities)
2. Fleet Science Center: [Accessibility](https://www.fleetscience.org/accessibility)
3. Fleet Science Center: [Accessibility Mornings](https://www.fleetscience.org/events/accessibility-mornings)
4. San Diego Natural History Museum: [Accessibility](https://www.sdnhm.org/visit/accessibility/)
5. City of San Diego Parks and Recreation: [Balboa Park](https://www.sandiego.gov/park-and-recreation/parks/regional/balboa)
6. The New Children's Museum: [Accessibility](https://thinkplaycreate.org/visit/accessibility/)
7. County of San Diego Parks and Recreation: [Waterfront Park](https://www.sdparks.org/content/sdparks/en/park-pages/Waterfront.html)
8. San Diego County Regional Airport Authority: [Accessibility](https://www.san.org/accessibility/)
9. San Diego County Regional Airport Authority: [Services and facilities](https://www.san.org/services-and-facilities/)
10. Birch Aquarium at Scripps: [KultureCity certification](https://aquarium.ucsd.edu/newsroom/birch-aquarium-kulturecity-certified)
11. Birch Aquarium at Scripps: [FAQs and rules](https://aquarium.ucsd.edu/plan-your-visit/faqs-and-rules)
12. City of San Diego Lifeguard Services: [Beach regulations and amenities](https://www.sandiego.gov/lifeguards/safety/bchreg)
13. Belmont Park: [Park map](https://www.belmontpark.com/park-map)
14. City of San Diego Parks and Recreation: [Mission Bay Park](https://www.sandiego.gov/park-and-recreation/parks/regional/missionbay)
15. California State Parks: [Old Town San Diego State Historic Park](https://www.parks.ca.gov/?page_id=663)
16. California State Parks Accessibility Division: [Old Town accessible features](https://www.parks.ca.gov/AccessibleFeatures/Details/663)
17. San Diego Metropolitan Transit System: [Old Town Transit Center](https://www.sdmts.com/old-town-transit-center)
18. San Diego Metropolitan Transit System: [Transit station parking](https://www.sdmts.com/transit-services/transit-station-parking)
19. San Diego Metropolitan Transit System: [Rules for riding](https://www.sdmts.com/rider-info/how-ride/rules-riding)

## Current Blockers

1. Parent A and Parent B have not completed the three tasks.
2. No trust-sensitive field has completed human review.
3. Structured redistribution rights for the 39 source-derived records remain unresolved.
4. The candidate has no verified coordinates or complete geographic layer.
5. The approved evidence registry is empty; no human-review, clearance, or verified-coordinate reference is approved.
6. A public methodology, corrections path, changelog, and review cadence have not been implemented.
7. Publication, indexing, outreach, and external-account actions are outside this action and remain unauthorized.

## Change Log

- 2026-07-29: Built the 39-record internal candidate, preserved all trust-sensitive and coordinate states as `UNKNOWN`, documented 19 official sources, and prepared the three-task, two-parent protocol. No human test, publication, outreach, or external-account action occurred.
