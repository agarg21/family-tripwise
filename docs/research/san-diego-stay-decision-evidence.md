# San Diego stay-decision human-review evidence pack

Action: `FT-RES-001`

Prepared: 2026-07-13

Status: internal research artifact; not human-reviewed; not publication-ready

Prototype: `src/prototypes/san-diego-stay-decision/`

## Decision and scope

This pack inventories every material area-level assumption in the unpublished prototype: five candidate framings and 30 dimension scores. It does not convert those assumptions into recommendations. It separates facts supported by current primary sources from model-derived judgments, unknowns, source conflicts, and questions that require human review.

No live page, sitemap entry, hotel shortlist, safety conclusion, or property recommendation is authorized by this document. All prototype scores remain `model-derived` and `needs-human-review` unless a later human reviewer explicitly changes their status.

## Evidence states

| State | Meaning |
|---|---|
| `CONTEXT-SUPPORTED` | A primary source supports limited factual context, but not the prototype score or family-fit conclusion. |
| `UNKNOWN` | No current authoritative evidence in this review establishes the scored claim at the required area, property, route, date, or family level. |
| `SOURCE-CONFLICT` | A source is internally inconsistent, stale, or otherwise unsuitable for the claim without clarification. |
| `SCORE-CHALLENGE` | Primary-source context creates enough tension with the score or framing that a human must reconsider it before integration. |
| `HUMAN-REVIEW` | A named review question must be answered; source collection alone is insufficient. |

An official source can establish that infrastructure or an amenity exists. It cannot by itself establish that an area is quieter, better value, nap-friendly, stroller-friendly, or the right base for a particular family.

## Executive findings

- All 35 material prototype items are mapped below. None of the 30 numeric scores is promoted to a sourced fact.
- Official sources support limited beach, park, transit-network, accessibility-policy, and area-description context.
- Route time, property noise, total lodging price, room setup, parking charges, and midday-return practicality remain `UNKNOWN` until exact properties, dates, destinations, and travel windows are supplied.
- The `Mission Valley` car-light score of `1/5` is a `SCORE-CHALLENGE`: the City describes the community as tied together by the San Diego Trolley. This does not prove property-level walkability, but it requires reconsideration of an area-wide minimum score.
- The City neighborhood-shuttle page is not usable as evidence for current Downtown/Little Italy service. It says FRED would be discontinued on July 1, 2025 while also displaying service details. Treat current FRED availability as `SOURCE-CONFLICT` until confirmed directly.
- MTS accessibility information does not equal stroller ease. MTS separately requires stroller/cargo placement rules, and bus travel can require removing a child from the stroller. Exact family friction still needs a route test.
- Current beach conditions are dynamic. The County, not a static area profile, is the source for advisories, warnings, and closures at trip time.

## Primary-source register

All sources were checked on 2026-07-13. “Supports” is intentionally narrow.

| ID | Primary source | Supports | Does not establish |
|---|---|---|---|
| `S01` | [City of San Diego — Mission Bay Park](https://www.sandiego.gov/park-and-recreation/parks/regional/missionbay) | Mission Bay has shoreline, sandy beach areas, designated swimming areas, bike/walking paths, playgrounds, restrooms, showers, and designated lifeguard areas. | Access from a particular hotel, quietness, value, or midday-return time. |
| `S02` | [City of San Diego — Mission Bay facilities map](https://www.sandiego.gov/park-and-recreation/parks/regional/missionbay/facilities) | Named public park and beach facilities exist around Mission Bay. | Which lodging has practical access to a suitable family beach. |
| `S03` | [City of San Diego — San Diego beaches](https://www.sandiego.gov/lifeguards/beaches) | Official beach inventory and lifeguard-station context. | Current water quality, route time, or family suitability. |
| `S04` | [City of Coronado — Coronado Beach](https://www.coronado.ca.us/244/Coronado-Beach) | Public beach amenities, adjacent on-street parking, restrooms/showers, playground context, disabled-access parking, and beach-access infrastructure. | Property-to-beach convenience, crowding, room noise, or area value. |
| `S05` | [City of Coronado — Beach Wheelchair Program](https://www.coronado.ca.us/246/Beach-Wheelchair-Program) | A beach wheelchair, ramp, and walkway are available at Central Beach under stated conditions. | Stroller ease across Coronado or from a particular property. |
| `S06` | [City of San Diego — La Jolla Shores](https://www.sandiego.gov/lifeguards/beaches/shores) | La Jolla Shores is a sandy beach with lifeguard, accessibility, beach-wheelchair, parking, restroom, shower, playground, and public-transportation amenities listed. | Exact slopes, crossings, crowding, property access, or area-wide stroller ease. |
| `S07` | [City of San Diego — Kellogg Park](https://www.sandiego.gov/park-and-recreation/parks/regional/shoreline/kelloggpark) | A grassy park and playground sit at La Jolla Shores; the City warns that the parking lot fills quickly on summer weekends. | Hotel access, off-peak parking, quietness, or total family friction. |
| `S08` | [City of San Diego — Downtown](https://www.sandiego.gov/citycouncil/cd3/communities/downtown) | Little Italy is one of Downtown's eight neighborhoods; Downtown is described as a center of business, arts, and entertainment. | A family activity-balance score, quietness, or property-level walkability. |
| `S09` | [MTS — Maps and schedules](https://www.sdmts.com/getting-around/maps-and-schedules) | Current official bus/trolley maps, schedules, stops, alerts, and trip-planning entry points. | A fixed area score or a reliable future trip time without dates and endpoints. |
| `S10` | [MTS — Trolley](https://www.sdmts.com/transit-services/trolley) | The trolley connects Downtown with East County, UC San Diego, South Bay, and the border; station and line data are available. | Door-to-door convenience, stroller effort, or service reliability for an exact itinerary. |
| `S11` | [MTS — Accessibility](https://www.sdmts.com/rider-info/accessibility) | Buses and trolleys have accessible systems, including ramps/lifts for mobility devices. | That sidewalks, crossings, elevators, or property routes are stroller-friendly. |
| `S12` | [MTS — Rules for riding](https://www.sdmts.com/rider-info/how-ride/rules-riding) | Current cart/stroller placement and priority-area rules; stroller use creates operational constraints on transit. | Whether a particular family will find a trip easy or acceptable. |
| `S13` | [City of San Diego — Mission Valley Community Plan](https://www.sandiego.gov/planning/community-plans/mission-valley) | Mission Valley is near the geographic center of the city and is described as a regional center tied together by the trolley. | Property-level walkability, beach access, quietness, or attraction travel times. |
| `S14` | [San Diego Regional 511 overview](https://511sd.com/About511/511Overview) | SANDAG-led 511 provides current traffic conditions, incidents, driving times, and transit information. | A reusable route-time claim without specified origin, destination, date, and time window. |
| `S15` | [County of San Diego — Beach and Bay Program](https://www.sandiegocounty.gov/content/sdc/deh/lwqd/beachandbay.html) | Dynamic advisories, warnings, closures, and water-quality monitoring. | A permanent beach-quality or family-suitability conclusion. |
| `S16` | [City of San Diego — TOT/TMD](https://www.sandiego.gov/treasurer/taxesfees/tot) | Lodging bills can include transient occupancy tax and a separately shown TMD assessment when applicable. | A property's full stay price, parking/resort/destination fees, cancellation terms, or value. |
| `S17` | [MTS — Route 901](https://www.sdmts.com/getting-around/departures-and-schedules/schedules/901/Downtown/2026-03-31/1) | MTS publishes Route 901 schedule data between the south-bay/Coronado corridor and Downtown. | Current trip frequency for future dates, property access, or a Coronado car-light score. |
| `S18` | [MTS — Route 904](https://www.sdmts.com/getting-around/departures-and-schedules/schedules/904/common) | MTS exposes a Coronado shuttle schedule entry point. | Current operating days/times or usefulness for a specific family until a dated schedule is selected. |
| `S19` | [City of San Diego — Neighborhood shuttles](https://www.sandiego.gov/transportation/programs/shuttles) | Historical Downtown/Little Italy FRED service information. | Current service: the page also says FRED would be discontinued July 1, 2025, so it is a `SOURCE-CONFLICT`. |

## Named human-review questions

| Question ID | Owner role | Required question and evidence |
|---|---|---|
| `Q-FRAMING` | Editorial trust reviewer | Does the area framing accurately describe a planning hypothesis without implying a recommendation or lived experience? Revise or remove unsupported family-fit language. |
| `Q-BEACH` | Area/logistics reviewer | For each candidate property and intended beach, what is the actual door-to-usable-beach route, including crossings, slopes, surfaces, parking, seasonal restrictions, and current County water status? |
| `Q-ROUTE` | Area/logistics reviewer | Using the family's real activity list, dates, dayparts, and transport mode, what do current MTS/511 routes show for each transfer? Capture endpoints and checked time. |
| `Q-CAR-LIGHT` | Transit reviewer | From each candidate property, can the family reach meals and priority activities without a car at acceptable frequency and transfer count? Do not infer this from area name alone. |
| `Q-STROLLER` | Accessibility/stroller reviewer | Walk the exact property-to-stop/activity route or review current first-party accessibility details. Record sidewalks, crossings, grades, elevator dependencies/outages, and MTS stroller rules. |
| `Q-NOISE` | Lodging reviewer | For the exact property and room category, what do current official property disclosures, construction/event notices, and a human review of room-location risks establish? Area-level regulation is not evidence of quietness. |
| `Q-VALUE` | Lodging/pricing reviewer | For fixed travel dates and occupancy, what is the directly bookable total including room configuration, taxes, TMD if passed through, parking, resort/destination fees, cancellation terms, and required extras? |
| `Q-NAP` | Family-itinerary reviewer | Does a midday return work after adding real route time, parking/waiting, loading a child/stroller, elevator time, and the family's nap window? |
| `Q-MV-CAR-LIGHT` | Transit + editorial reviewer | Should Mission Valley remain `1/5` for car-light potential given the City's trolley-connected description? Test specific properties and routes before keeping, revising, or removing the score. |
| `Q-FRESHNESS` | Final human reviewer | Were all dynamic sources rechecked close enough to the travel/publication date? Recheck MTS schedules/alerts, 511, beach status, property prices/policies, and construction/events. |

## Candidate-framing review

| Candidate framing | Evidence state | Determination | Required review |
|---|---|---|---|
| Mission Bay: “beach-and-reset” and “contained daily rhythm” | `CONTEXT-SUPPORTED` + `HUMAN-REVIEW` | `S01-S02` support extensive shoreline and park amenities. They do not establish an easy reset rhythm from any lodging property. | `Q-FRAMING`, `Q-BEACH`, `Q-NAP` |
| Coronado: “beach-first” and suitable for a slower itinerary | `CONTEXT-SUPPORTED` + `HUMAN-REVIEW` | `S04-S05` support public beach/access amenities. “Slower itinerary” is a model judgment dependent on the family's off-island plans. | `Q-FRAMING`, `Q-ROUTE`, `Q-NAP` |
| La Jolla: coastal scenery and “local wandering” | `CONTEXT-SUPPORTED` + `HUMAN-REVIEW` | `S06-S07` support a beach, park, and playground. They do not establish easy wandering from an unknown property or across La Jolla's varied terrain. | `Q-FRAMING`, `Q-STROLLER`, `Q-CAR-LIGHT` |
| Downtown / Little Italy: car-light and dining-access hypothesis | `CONTEXT-SUPPORTED` + `SOURCE-CONFLICT` + `HUMAN-REVIEW` | `S08-S12` support Downtown context and transit infrastructure. `S19` cannot establish current FRED service because its own page conflicts. Dining access and family fit remain property-specific. | `Q-FRAMING`, `Q-CAR-LIGHT`, `Q-STROLLER`, `Q-FRESHNESS` |
| Mission Valley: driving-oriented central base | `CONTEXT-SUPPORTED` + `SCORE-CHALLENGE` | `S13` supports centrality but also says the community is tied together by the trolley. The driving-oriented framing may be true for some properties, not the whole area. | `Q-FRAMING`, `Q-MV-CAR-LIGHT`, `Q-ROUTE` |

## Dimension-by-dimension evidence matrix

The prototype score is reproduced only for traceability. It is not endorsed.

### Mission Bay

| Assumption | Score | Evidence state | Source determination | Required review |
|---|---:|---|---|---|
| Beach-time fit | 5 | `CONTEXT-SUPPORTED` + `HUMAN-REVIEW` | `S01-S03` establish substantial shoreline, sandy beaches, swimming areas, and facilities. They do not validate `5/5` or property-to-beach access. | `Q-BEACH`, `Q-FRESHNESS` |
| Activity balance | 4 | `UNKNOWN` | No sourced activity list, origins, dates, or route windows exist. Area amenities do not establish balance across the family's itinerary. | `Q-ROUTE` |
| Car-light potential | 2 | `UNKNOWN` | `S09-S12` provide regional transit/policy context only. No candidate property or exact stop/sidewalk route exists. | `Q-CAR-LIGHT`, `Q-STROLLER` |
| Quieter reset potential | 4 | `UNKNOWN` | No property, room location, event calendar, construction check, or dated noise evidence exists. | `Q-NOISE` |
| Value flexibility | 2 | `UNKNOWN` | No travel dates, room setup, bookable total, parking, or property fees exist. `S16` only shows why tax/assessment line items must be checked. | `Q-VALUE` |
| Midday reset fit | 5 | `UNKNOWN` | No exact activity-to-property route or nap window exists. Beach proximity alone does not validate a return from other activity clusters. | `Q-NAP`, `Q-ROUTE` |

### Coronado

| Assumption | Score | Evidence state | Source determination | Required review |
|---|---:|---|---|---|
| Beach-time fit | 5 | `CONTEXT-SUPPORTED` + `HUMAN-REVIEW` | `S04-S05` establish public beach amenities and specific accessibility infrastructure. They do not validate exact lodging access, seasonal conditions, or `5/5`. | `Q-BEACH`, `Q-FRESHNESS` |
| Activity balance | 2 | `UNKNOWN` | Off-island activity mix and travel windows are unspecified. Route 901/904 existence does not validate a low balance score. | `Q-ROUTE` |
| Car-light potential | 3 | `CONTEXT-SUPPORTED` + `HUMAN-REVIEW` | `S04`, `S17`, and `S18` establish beach access context and transit schedule entry points. No property-to-meal/beach route or future dated frequency has been tested. | `Q-CAR-LIGHT`, `Q-STROLLER`, `Q-FRESHNESS` |
| Quieter reset potential | 4 | `UNKNOWN` | A public “no disturbing noise” rule is not evidence of room quietness. Property, event, traffic, and room-location data are absent. | `Q-NOISE` |
| Value flexibility | 1 | `UNKNOWN` | No comparable total prices, room configurations, dates, or fees exist. | `Q-VALUE` |
| Midday reset fit | 4 | `UNKNOWN` | The family's planned days and exact base are unknown; no midday transfer test exists. | `Q-NAP`, `Q-ROUTE` |

### La Jolla

| Assumption | Score | Evidence state | Source determination | Required review |
|---|---:|---|---|---|
| Beach-time fit | 5 | `CONTEXT-SUPPORTED` + `HUMAN-REVIEW` | `S06-S07` establish La Jolla Shores beach, park/playground, amenities, and summer-weekend parking pressure. They do not establish exact access or `5/5`. | `Q-BEACH`, `Q-FRESHNESS` |
| Activity balance | 3 | `UNKNOWN` | No chosen attractions, exact La Jolla property, date, or transfer windows exist. | `Q-ROUTE` |
| Car-light potential | 3 | `CONTEXT-SUPPORTED` + `HUMAN-REVIEW` | `S06` lists public transportation as an amenity and `S09-S12` provide network/policy context. Exact slopes, crossings, sidewalks, distance, and frequency remain unverified. | `Q-CAR-LIGHT`, `Q-STROLLER` |
| Quieter reset potential | 4 | `UNKNOWN` | No block, property, room, construction, traffic, or event evidence exists. | `Q-NOISE` |
| Value flexibility | 1 | `UNKNOWN` | No room configuration, dates, total price, parking, or property fees exist. | `Q-VALUE` |
| Midday reset fit | 3 | `UNKNOWN` | No priority-activity endpoints, route snapshot, or family nap window exists. | `Q-NAP`, `Q-ROUTE` |

### Downtown / Little Italy

| Assumption | Score | Evidence state | Source determination | Required review |
|---|---:|---|---|---|
| Beach-time fit | 1 | `UNKNOWN` | `S08` identifies Little Italy as Downtown and `S03` identifies official beaches, but no preferred beach, property, route, or travel window establishes `1/5`. | `Q-BEACH`, `Q-ROUTE` |
| Activity balance | 4 | `CONTEXT-SUPPORTED` + `HUMAN-REVIEW` | `S08` supports a concentration of business, arts, and entertainment; `S09-S10` support transit infrastructure. The family's actual activity mix and family fit remain unknown. | `Q-ROUTE`, `Q-FRAMING` |
| Car-light potential | 5 | `CONTEXT-SUPPORTED` + `SOURCE-CONFLICT` + `HUMAN-REVIEW` | `S09-S12` support substantial transit context. `S19` must not be used as current FRED proof. No exact property, frequency, transfer, elevator, sidewalk, or crossing test validates `5/5`. | `Q-CAR-LIGHT`, `Q-STROLLER`, `Q-FRESHNESS` |
| Quieter reset potential | 2 | `UNKNOWN` | No property or room-location evidence exists for street, nightlife, airport, event, or construction noise. | `Q-NOISE` |
| Value flexibility | 3 | `UNKNOWN` | Parking need, room size/setup, travel dates, total price, and property charges are absent. | `Q-VALUE` |
| Midday reset fit | 3 | `UNKNOWN` | No selected activity clusters or property return route exists. | `Q-NAP`, `Q-ROUTE` |

### Mission Valley

| Assumption | Score | Evidence state | Source determination | Required review |
|---|---:|---|---|---|
| Beach-time fit | 1 | `UNKNOWN` | Central location in `S13` does not establish beach drive time, parking, or `1/5`; preferred beach and travel window are unknown. | `Q-BEACH`, `Q-ROUTE` |
| Activity balance | 5 | `CONTEXT-SUPPORTED` + `HUMAN-REVIEW` | `S13` supports centrality and regional land uses. It does not validate the family's attraction list, route times, or `5/5`. | `Q-ROUTE` |
| Car-light potential | 1 | `SCORE-CHALLENGE` + `HUMAN-REVIEW` | `S13` says Mission Valley is tied together by the trolley, while the prototype assigns the minimum car-light score. Property-level access may still be poor, but an area-wide `1/5` is not supported. | `Q-MV-CAR-LIGHT`, `Q-CAR-LIGHT`, `Q-STROLLER` |
| Quieter reset potential | 3 | `UNKNOWN` | No property, freeway exposure, room orientation, construction, or corridor-noise evidence exists. | `Q-NOISE` |
| Value flexibility | 4 | `UNKNOWN` | No comparable bookable totals, dates, room configurations, parking charges, or fees exist. | `Q-VALUE` |
| Midday reset fit | 4 | `UNKNOWN` | Centrality does not prove a workable midday drive or transit return. No activity endpoints or nap window exist. | `Q-NAP`, `Q-ROUTE` |

## Human-review worksheet

For each framing and score, the assigned human reviewer must record:

| Field | Required entry |
|---|---|
| Decision | `keep`, `revise`, `remove`, or `keep-model-derived-with-disclosure` |
| Final wording or score | Exact approved language/value, or `N/A` if removed |
| Evidence | Direct source URL(s), exact property/route/date context, or `UNKNOWN` |
| Source checked | Date and time zone |
| Reviewer | Name and role |
| Reviewed on | Date |
| Notes | Why the evidence is sufficient, what remains uncertain, and required user-facing disclosure |

## Integration gate

The prototype must remain unpublished and disconnected from `site/` until all of the following are true:

1. A human reviewer has decided `keep`, `revise`, or `remove` for all five candidate framings and 30 scores.
2. `Q-MV-CAR-LIGHT` is resolved; the current `1/5` cannot silently survive integration.
3. Any Downtown car-light claim excludes FRED unless current service is independently confirmed from a non-conflicting authoritative source.
4. Beach, transit, route, stroller, water-status, lodging-price, fee, and noise evidence has the required property/date context and freshness.
5. `UNKNOWN` claims are removed, explicitly preserved as model-derived with human-approved disclosure, or converted into user-supplied inputs—not presented as verified facts.
6. No output implies personal experience, safety verification, hotel recommendation, or guaranteed family suitability.
7. Fresh GSC evidence and the active target-level observation policy permit integration with the protected San Diego where-to-stay page.

## Result for `FT-RES-001`

The evidence-pack success signal is met at the research-artifact level: every material prototype assumption is mapped to current primary-source context, `UNKNOWN`, `SOURCE-CONFLICT`, `SCORE-CHALLENGE`, and/or a named human-review question. This result does not satisfy the human-review or live-integration gates by itself.
