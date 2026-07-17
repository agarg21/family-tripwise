# San Diego Family Reset Atlas: Source and Reuse Audit

Action: `FT-RES-003`

Audited: 2026-07-16

State: research evidence only; no live record, downloadable dataset, outreach, or permission request

## Decision

Official first-party or government evidence is available for all 13 candidate anchors. That clears the coverage threshold for an unpublished schema and interaction prototype, but it does **not** clear a real downloadable atlas dataset for release.

- `13/13` anchors have a current official source that can support bounded factual research.
- `2/13` anchors can use the City of San Diego Open Data park-locations dataset for reusable location geometry under its listed [Open Data Commons Public Domain Dedication and License 1.0](https://opendefinition.org/licenses/odc-pddl/) and the portal terms, subject to record-level verification. The current CSV contains records for La Jolla Shores Beach and Mission Bay Park; the dataset does not clear venue-authored descriptions, maps, photos, or operating claims.
- `11/13` anchors rely only on ordinary official web pages whose structured-redistribution rights are not stated on the cited page. Those facts may be researched and attributed, but real downloadable records remain `UNKNOWN` until a release-specific rights review.
- All route practicality, stroller ease, sensory/quiet suitability, family-facility availability, safety, and material family-fit conclusions remain human-gated. An official accessibility or amenity statement does not establish convenience or suitability for a particular family.

Proceed with `FT-DEV-003` using synthetic fixtures only. Do not ingest the official pages into a downloadable dataset, reproduce maps or source prose, or publish real anchor records from this audit.

## Audit rules

`Official coverage` means a first-party venue, public agency, university, or transit operator page explicitly supports at least one useful bounded fact about the anchor. It does not mean Family Tripwise has verified the experience.

Reuse is classified conservatively:

- `CLEARED-DATA`: the source explicitly permits data use or redistribution, with the governing terms recorded.
- `LIMITED-RESEARCH`: manual factual research, short original paraphrase, citation, owner, URL, and checked date only. It does not authorize copying prose, media, maps, or bulk page content into a public dataset.
- `UNKNOWN`: no source-specific structured-redistribution permission was located. Do not redistribute the source-derived record until reviewed.

Every future real record must retain source owner, canonical source URL, checked date, evidence class, confidence, reuse note, and human-review status. Operational facts must be rechecked at release and on the record's declared review cadence.

## Anchor matrix

| # | Anchor | Official source coverage and freshness | Reuse / attribution decision | Human-review and release gap |
|---:|---|---|---|---|
| 1 | San Diego Zoo | [Guest accessibility](https://zoo.sandiegozoo.org/visit/guests-with-disabilities) explicitly describes accessibility services and terrain considerations. Page checked 2026-07-16; page-level update date `UNKNOWN`. | `LIMITED-RESEARCH`; credit San Diego Zoo Wildlife Alliance and link the checked page. Structured redistribution, page text, images, and maps: `UNKNOWN`. | Human review is required for route steepness, stroller friction, quiet/sensory conditions, service availability, and any family-fit statement. Recheck current services before release. |
| 2 | Fleet Science Center | [Visit](https://www.fleetscience.org/visit-fleet-science-center) and [accessibility](https://www.fleetscience.org/accessibility) pages provide current visitor and accessibility information, including `Accessibility Mornings`, which the source describes as a sensory-friendly experience. Checked 2026-07-16; update dates `UNKNOWN`. | `LIMITED-RESEARCH`; credit Fleet Science Center and cite the exact page. Program details, page text, media, and structured redistribution: `UNKNOWN`. | A scheduled sensory-friendly program is not proof that a specific visit is quiet or low-stimulation. Human review must verify date, capacity, sensory conditions, and family-specific usefulness. |
| 3 | The Nat | [Accessibility](https://www.sdnhm.org/visit/accessibility/) documents venue access features. Checked 2026-07-16; update date `UNKNOWN`. | `LIMITED-RESEARCH`; credit San Diego Natural History Museum and cite the page. Structured reuse and media rights: `UNKNOWN`. | Human review is required for actual routes, elevators, quiet areas, crowding, stroller handling, and sensory or family-suitability claims. |
| 4 | Central Prado / Balboa Park | The City [Balboa Park page](https://www.sandiego.gov/park-and-recreation/parks/regional/balboa) and [facilities page](https://www.sandiego.gov/park-and-recreation/parks/regional/balboa/facilities/facilities) establish official park/facility context. Checked 2026-07-16; page update dates `UNKNOWN`. | `LIMITED-RESEARCH` for webpage facts. City-authored prose, facility maps, PDFs, and images are not cleared by this audit. Attribute the City and link the exact page. | Verify route grade, surface, shade, tram operation, restroom/facility availability, crowding, and reset suitability. Do not infer stroller ease from general accessibility. |
| 5 | New Children's Museum | [Visit](https://thinkplaycreate.org/visit/) and [access programs](https://thinkplaycreate.org/visit/access-programs/) provide first-party operating and access-program information. Checked 2026-07-16; update dates `UNKNOWN`. | `LIMITED-RESEARCH`; credit The New Children's Museum and cite the exact page. Program text, media, floor plans, and structured reuse: `UNKNOWN`. | Human review must verify current program availability, sensory/quiet conditions, caregiver facilities, accessibility routes, and family fit. Missing facts remain `UNKNOWN`. |
| 6 | Waterfront Park | The County [park page](https://www.sdparks.org/content/sdparks/en/park-pages/Waterfront.html) provides official hours, facilities, playground/restroom information, and current closure or repair notices. Checked 2026-07-16; operational content is volatile. | `LIMITED-RESEARCH`; credit County of San Diego Parks and Recreation. Page text, maps, images, and bulk redistribution: `UNKNOWN`. | Recheck on release day and use a short expiry. Human review must verify fountains/closures, restroom and playground condition, shade, crowding, quiet, and suitability. |
| 7 | San Diego International Airport | [Accessibility](https://www.san.org/accessibility/) documents SAN Assist and accessibility services; [services and facilities](https://www.san.org/services-and-facilities/) lists facilities including lactation/nursing locations. Checked 2026-07-16; update dates `UNKNOWN`. | `LIMITED-RESEARCH`; credit San Diego County Regional Airport Authority and cite the exact page. Terminal maps, page text, icons, and structured reuse: `UNKNOWN`. | Verify assistance-request timing, terminal/room access, facility availability, and walking or transfer routes. Do not convert an offered service into an ease or suitability verdict. |
| 8 | Birch Aquarium | [FAQs and rules](https://aquarium.ucsd.edu/plan-your-visit/faqs-and-rules) provides first-party access and KultureCity information. Checked 2026-07-16; update date `UNKNOWN`. | `LIMITED-RESEARCH`; credit Birch Aquarium at Scripps / UC San Diego. Structured reuse, KultureCity marks, media, and page text: `UNKNOWN`. | Human review must verify current program availability, actual sensory conditions, quiet-space access, routes, stroller handling, and family fit. |
| 9 | La Jolla Shores | The City [lifeguard beach page](https://www.sandiego.gov/lifeguards/beaches/shores) exposes official amenity and access indicators. The [park-locations dataset](https://data.sandiego.gov/datasets/gis-park-locations/) was listed as updated 2026-05-01 on a weekly schedule; its current CSV contains a La Jolla Shores Beach record. Checked 2026-07-16. | `CLEARED-DATA` only for applicable park-location fields under the dataset's listed ODC PDDL 1.0, [Open Data FAQ](https://data.sandiego.gov/help/guides/faq/), and [Terms of Use](https://data.sandiego.gov/help/guides/terms/). Preserve dataset/license name, City attribution, source URL, retrieval date, terms URL, and any record-specific terms. Webpage facts remain `LIMITED-RESEARCH`; maps/media are not cleared. | The City terms disclaim accuracy and call for verification/site inspection. Human review must verify amenity condition and availability, beach-wheelchair access, route/surface, shade, crowding, and family suitability. |
| 10 | Belmont Park | [Park information](https://www.belmontpark.com/park-info) and the [official park map page](https://www.belmontpark.com/park-map) provide first-party operating and guest-service context. Checked 2026-07-16; update dates `UNKNOWN`. | `LIMITED-RESEARCH`; credit Belmont Park and cite the exact page. Do not reproduce the map, attraction descriptions, icons, photos, or page text. Structured redistribution: `UNKNOWN`. | Human review must verify accessibility routes, sensory/quiet options, restrooms/caregiver facilities, current operations, stroller handling, and family fit. |
| 11 | Mission Bay public parks | The City [Mission Bay Park page](https://www.sandiego.gov/park-and-recreation/parks/regional/missionbay) and [facilities page](https://www.sandiego.gov/park-and-recreation/parks/regional/missionbay/facilities) establish public-park and facilities context. The current City park-locations CSV contains a Mission Bay Park record. Checked 2026-07-16; the page directs users to current closure information. | `CLEARED-DATA` only for applicable park-location fields under the dataset's listed ODC PDDL 1.0, Open Data FAQ, and Terms of Use, with the same provenance record as row 9. Webpage facts are `LIMITED-RESEARCH`; facility maps/PDFs/media are not cleared. | Select exact parks before building real records. Verify restroom/shower/playground status, closures, parking, surface, shade, crowding, water conditions, and reset suitability at record and release level. |
| 12 | Old Town San Diego State Historic Park | The [official park page](https://www.parks.ca.gov/?page_id=663) exposes a dynamic current-restrictions timestamp. The [official accessible-features page](https://www.parks.ca.gov/AccessibleFeatures/Details/663) describes generally accessible routes, barriers, parking, and restrooms. Both pages were checked 2026-07-16; recheck the dynamic status at release. | `LIMITED-RESEARCH`; credit California State Parks and cite the exact page. PDF guides, maps, images, page prose, and structured redistribution: `UNKNOWN`. | Source details include possible unevenness, slopes, narrow entries, and thresholds; human review must verify current route conditions, entrances, hours, assistance, stroller friction, and family fit. |
| 13 | Old Town Transit Center | The MTS [station page](https://www.sdmts.com/old-town-transit-center) identifies the station and hours; [transit-station parking](https://www.sdmts.com/transit-services/transit-station-parking) identifies served lines and parking; [Rules for Riding](https://www.sdmts.com/rider-info/how-ride/rules-riding) states current stroller/cargo constraints. Checked 2026-07-16; update dates `UNKNOWN`. | `LIMITED-RESEARCH`; credit San Diego Metropolitan Transit System and cite each exact fact source. Schedules, maps, page text, icons, and structured redistribution: `UNKNOWN`. | MTS rules establish constraints, not stroller convenience. Human review must test the exact transfer, platform/elevator route, construction/service status, boarding behavior, timing, and family-specific practicality. |

## Reuse findings

### City of San Diego Open Data

The park-locations dataset page lists ODC PDDL 1.0, provides CSV and GeoJSON downloads, and labels the dataset as updated 2026-05-01 on a weekly cadence. The downloaded CSV checked 2026-07-16 contains exact records for `La Jolla Shores Beach` and `Mission Bay Park`. The Open Data FAQ says portal data is available without usage or redistribution restrictions. The governing Terms of Use apply when data is downloaded or used, preserve any separately stated intellectual-property rights, allow dataset-specific additional terms, disclaim accuracy, and say data should not be relied on without verification or site inspection.

For an eventual release, store the exact dataset file/version or retrieval date, the dataset page and terms URLs, City attribution, any dataset-specific notice, and the transformation used. Do not treat the portal terms as permission to copy material from ordinary City web pages, maps, PDFs, or third-party fields.

### First-party and agency web pages

No cited venue, airport, parks webpage, California State Parks page, or MTS page exposed source-specific permission for bulk structured redistribution in the material reviewed. This audit therefore does not claim that facts are copyrightable or provide legal advice; it simply withholds dataset-release clearance until exact intended fields and governing terms are reviewed.

Manual research may record a short original paraphrase and citation for internal evaluation. Automated scraping, copied descriptions, reproduced maps/media, and downloadable real records remain out of scope.

## Coverage and release implications

| Gate | Result | Consequence |
|---|---|---|
| Official source exists for at least 11 of 13 anchors | `PASS` — 13/13 | Continue the product-learning lane. |
| Reusable real location geometry | `PARTIAL` — City Open Data may cover two public-park anchors | A mixed-source location strategy still needs exact-field and terms review. |
| Structured reuse of venue/agency facts | `UNKNOWN` for 11 anchors and for ordinary webpage facts at the two City anchors | Do not publish a real downloadable dataset. |
| Human review of trust-sensitive fields | `NOT STARTED` | Keep firm access, route, stroller, sensory, safety, caregiver-facility, and family-fit claims out of the live site. |
| Publication / outreach authorization | `NOT REQUESTED` | No publishing, prospect contact, permission request, contributed content, or external-account action. |

## Next bounded action

`FT-DEV-003` may build the unpublished, `noindex` schema/validator and accessible map/filter shell under `src/prototypes/san-diego-family-reset-atlas/` with synthetic fixtures. Synthetic fixtures must be visibly labeled, use no source-derived coordinates or venue claims, store no user input, and keep every real-data/import/publish path disabled.

Before any real-record release, a later action must define the exact intended fields per anchor, complete record-level terms review, capture durable human review for every firm trust-sensitive field, and pass the asset plan's user-testing and release gates.

## Public-safety log

- Research used public official pages only; no credentials, private contacts, raw GSC data, country/device rows, or non-allowlisted Search Console URLs were collected.
- No source prose, map, image, PDF, or venue dataset was copied into the repository.
- No outreach, permission request, indexing request, account mutation, site edit, sitemap change, deployment, or publication occurred.
- Public-network availability is evidence only for this check. A future network failure is `UNKNOWN`, not a verified source or production defect.
