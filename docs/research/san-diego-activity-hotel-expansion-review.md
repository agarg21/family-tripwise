# San Diego Activity and Hotel Expansion Review

Last updated: 2026-07-21

Action: `FT-IMP-005`

## Decision

Expand the all-ages San Diego activity guide from 6 to 12 primary choices and the family-hotel comparison from 8 to 12 researched choices. The additions fill specific decision gaps; they are not a response to a target list length.

- Activities add the major paid/theme-park days, North County and inland day trips, a younger-child Downtown indoor option, a science/rain option, and a Mission Beach ride/teen option.
- Hotels add a La Jolla beachfront base, an iconic Coronado beachfront splurge, a simpler Mission Bay option with unusually clear family-room facts, and a Downtown full-service option.
- The all-ages page should remain a router and comparison surface. It should not repeat 12 long mini-essays across every section.
- The hotel page should expose room setup, current operational caveats, rough planning ranges, review themes, and the one check most likely to change a family's choice.
- The existing shared Google My Map is useful for city shape, but it is not updated in this transaction because external-account mutation is prohibited. Every hotel keeps a direct Google Maps link.

## Evidence classification and freshness

| Evidence | Classification | Collected / checked | Use in this action |
|---|---|---|---|
| `ops/gsc-snapshots/2026-07-21.md` | Fresh authenticated, public-safe GSC API summary; finalized through 2026-07-19 | 2026-07-21 | Context only. It predates these page changes and cannot measure them. |
| Current US Google result pages for broad San Diego family activity and hotel queries | Fresh public SERP evidence | 2026-07-21 | Candidate coverage, page-type expectations, and recurring entities. Not used as demand volume. |
| Official attraction and hotel pages | Primary factual evidence | 2026-07-21 | Current location, room, amenity, operating, accessibility, fee, and closure facts. |
| Expedia, Booking.com, Tripadvisor, Hotels.com, KAYAK snippets/pages | Current public commercial/review evidence | 2026-07-21 | Rough price context and small directional review-theme samples. Not representative ratings or booking quotes. |
| Reddit and other parent/community discussions | Qualitative community evidence | 2026-07-21 | Repeated parent questions and practical concerns only. Not demand, verified experience, or property fact. |
| Existing San Diego cluster/persona and competitor research | Durable repository research | 2026-07-18 to 2026-07-20 | Personas, intent boundaries, and previously inspected ranking-page strengths/gaps. |

## SERP and page-shape check

The broad all-ages results include long lists and large publishers: La Jolla Mom currently presents 50 things to do, Tripadvisor presents 10, Time Out presents 14, and Kids Out and About presents a top-20 list. The recurring attraction set includes the Zoo, SeaWorld, LEGOLAND, Safari Park, Balboa Park museums, beaches/bays, La Jolla, and Downtown family museums. This supports a broader comparison set, but list length alone is not a ranking or usefulness advantage.

The hotel results mix local/advisor lists, family-travel publishers, OTAs, Tripadvisor, and community discussions. Ranking pages commonly cover 10-20 properties. Family Tripwise should not copy their breadth mechanically. Its opportunity is to make the shortlist easier to use by separating trip shapes and publishing concrete room/operations checks that generic lists often blur.

Observed query families included:

- `things to do in San Diego with kids`
- `best things to do in San Diego with kids`
- `San Diego family activities`
- `family friendly hotels in San Diego`
- `best family hotels in San Diego`
- `family resorts San Diego`
- `where to stay in San Diego with kids`

The first three expect an activity list or guide. The next three expect named hotels/resorts. The last can return either areas or hotels, so the two lodging pages need clear roles and strong cross-links.

## Activity candidate review

### Primary set

| Activity | Decision job filled | Main constraint exposed | Evidence basis | Decision |
|---|---|---|---|---|
| San Diego Zoo | Signature all-ages anchor | Hills, heat, and overlong days | Official zoo + existing review | Keep |
| Mission Bay beach morning | Flexible toddler/budget reset | Sand, shade, exact facilities, water status | County/tourism + existing review | Keep |
| Balboa Park museums | Flexible mixed-weather cluster | Museum choice and walking | Official Balboa Park + existing review | Keep |
| Birch Aquarium | Compact La Jolla/younger-child indoor anchor | Timed entry and short duration | Official aquarium + existing review | Keep |
| La Jolla Cove | Older-child coast/sea-life stop | Crowds, stairs, parking, stroller route | Official destination/county + existing review | Keep |
| Coronado ferry and waterfront | Ride-as-activity from Downtown | Ferry timing, wind, return plan | Official ferry + existing review | Keep |
| SeaWorld San Diego | Major city theme-park day | Height split, show schedule, long paid day | Official park info, policies, rides and closure pages | Add |
| LEGOLAND California | Major younger-child North County day | Carlsbad travel, dated hours, height split | Official planning, hours, directions and closure pages | Add |
| San Diego Zoo Safari Park | Major wildlife day distinct from Zoo | Escondido travel, heat, parking, large footprint | Official Safari Park plan page and Zoo FAQ | Add |
| The New Children's Museum + Waterfront Park | Downtown younger-child/rain option | Normally closed Tuesdays; a current notice also announces a July 21-26, 2026 Comic-Con closure; age skew and separate outdoor conditions | Official museum visit page and current notice | Add |
| Fleet Science Center | Balboa Park science/rain option | Museum overlap and ticket value | Official hours/admission and accessibility-hour pages | Add |
| Belmont Park | Mission Beach ride/teen option | Ride-height split, crowds, noise, a-la-carte cost | Official park, ticket and hours pages | Add |

### Secondary, conditional, or deferred candidates

| Candidate | Why it did not become a primary choice now |
|---|---|
| Sesame Place San Diego | Meaningful for younger children but far south and more seasonal/water-park dependent; research separately before displacing a broader-fit primary. |
| USS Midway Museum | Strong Downtown option for school-age history/aviation interest, but narrower family fit than the selected 12. Keep as a nearby alternative. |
| Cabrillo National Monument | Good scenic/history/tide-pool combination, but weather, driving, and tide timing make it a conditional add-on. |
| Old Town San Diego | Useful food/history stop, not a strong enough family anchor to occupy one of the primary comparison rows. |
| Whale watching | High-memory potential but strongly dependent on season, sea conditions, child tolerance, and operator choice. |
| Petco Park / Gallagher Square | Valuable when a game or event fits the dates; not an evergreen equivalent to the selected anchors. |
| Liberty Station | Useful meal/open-space reset; better as a pairing than a primary trip-planning anchor. |
| Torrey Pines | Strong older-child outdoor option but exact trail, heat, parking, and ability requirements need a dedicated route check. |

## Hotel candidate review

### Existing eight

The existing records remain differentiated enough to keep: Bahia (published family suite), San Diego Mission Bay Resort (wading-pool resort), Hyatt Regency Mission Bay (waterslides), Paradise Point (large stay-put resort), Catamaran (Pacific Beach/bay and kitchenette choices), Homewood Suites Bayside (suite/kitchen/breakfast), LEGOLAND hotels (park-centered trip), and Loews Coronado Bay (more isolated Coronado resort).

One current-state flag changes: Paradise Point's current official site remains active, while public planning/reporting describes an approved or potential redevelopment/rebrand. The page should tell families to verify renovation/property-change status without asserting that a rebrand has already happened.

### Additions

| Hotel | Decision gap filled | Official facts that matter | Rough public planning range | Directional online-review themes | Decision |
|---|---|---|---|---|---|
| La Jolla Shores Hotel | Beachfront La Jolla base | Exact suite/kitchen layouts vary; official policy pages have recently conflicted on parking and pool/deck availability | `$350-$550+` | Beach access, location, staff and refreshed rooms recur positively; construction/amenity availability, fees and condition vary | Add, with a prominent operations check |
| Hotel del Coronado | Iconic beachfront Coronado splurge | Multiple room neighborhoods; guaranteed connecting-room filter/request; cribs; select rollaways; Shore House villas have kitchens; kids program ages 4-12 | `$600-$900+` | Beach, setting, history and resort experience recur positively; room-neighborhood fit, crowding and value are recurring conflicts | Add, but do not collapse all neighborhoods into one room promise |
| The Dana on Mission Bay | Simpler Mission Bay price/setup choice | Two heated pools; standard rooms max 4 and many suites max 6; cribs free; limited connecting/rollaway; refrigerators/microwaves but no kitchens; current FAQ lists parking and resort fee | `$250-$400+` | Location, pools, grounds and family activities recur positively; room size/condition, parking walk and fee/value concerns vary | Add |
| Manchester Grand Hyatt San Diego | Downtown full-service and suite option | Two-double connecting room and family suites; play yard requests; suite microwaves; daily destination fee; only Coastline Pool currently operating while the other pool is renovated | `$300-$450+` | Bay/Downtown access, views and scale recur positively; renovation status, pool expectations, room assignment and value recur as conflicts | Add, with renovation check |

Ranges are deliberately broad and rounded. They use recent public examples as budget orientation, not a rate quote. A family should compare the final total for its dates, occupancy, room type, parking, taxes, and cancellation terms.

### Durable evidence records for the four additions

These are research records, not representative ratings or firsthand stays. The shared price scenario is one night for two adults, using the lowest visible standard-room example found within the next 30 days. It is only a consistency device: it does not establish family-room availability, a bookable future price, or the final total for a different party. The broader page ranges intentionally allow for date and room variation.

Review sampling is a small directional scan: 5-12 visible recent excerpts or snippets per hotel across the named public booking/review sources. Review prose is paraphrased, reviewer identifiers are not stored, and anecdotes are not converted into property facts. Official-property facts carry `HIGH` source confidence; observed price examples carry `MEDIUM` confidence; review-derived themes carry `LOW` confidence. Page claims are labeled in substance as `official fact`, `price-band evidence`, `online-review pattern`, or `research-based recommendation`.

#### La Jolla Shores Hotel

- **Family use case:** a family prioritizing direct beach access and a La Jolla base over central access to the wider city.
- **Official facts checked:** room and suite layouts vary; some published layouts include kitchen features. The accommodation, FAQ, and resort-policy pages do not support treating every room as equivalent.
- **Price evidence:** Expedia displayed public examples of about `$406-$447` including taxes and fees on 2026-07-21 for dates within the next 30 days. The page uses the wider `$350-$550+` planning range.
- **Online-review sample:** Expedia and Tripadvisor; visible review dates ranged approximately February-July 2026; sample-size bucket `small (5-12 visible excerpts/snippets)`.
- **Repeated positives:** beach access, location, staff, and refreshed-room comments.
- **Repeated concerns or conflicts:** construction or amenity availability, room condition, fees, noise/value, and the difference between refreshed and dated inventory. Official pages also showed conflicting parking figures and require a current pool/deck operations check.
- **Confidence and claim boundary:** official room/policy facts `HIGH`; displayed price examples `MEDIUM`; review patterns `LOW`. Do not promise a kitchen, quiet room, specific view, completed work, or a final price without exact-room/date confirmation.
- **Freshness:** checked 2026-07-21; recheck price examples by 2026-08-04, official operations/policies by 2026-08-04, and review themes by 2026-09-19.
- **Parent check:** confirm the exact room layout, pool/deck and construction status, parking charge, and final total for the travel dates.
- **Sources:** `LJS-OFFICIAL-ROOMS`, `LJS-OFFICIAL-FAQ`, `LJS-OFFICIAL-POLICY`, `LJS-PRICE-EXPEDIA`, `LJS-REVIEWS-EXPEDIA`, `LJS-REVIEWS-TRIPADVISOR`.

#### Hotel del Coronado

- **Family use case:** an iconic beachfront resort stay where the property experience is a major part of the trip and the budget can absorb a premium.
- **Official facts checked:** the resort has materially different room neighborhoods; the booking flow advertises a guaranteed connecting-room option; cribs and select rollaways are described in official FAQs; Shore House villas publish kitchens; Ocean Explorers is described for ages 4-12.
- **Price evidence:** Expedia displayed a public example around `$619` including taxes and fees on 2026-07-21 for a date within the next 30 days. The page uses the wider `$600-$900+` planning range.
- **Online-review sample:** Expedia and Tripadvisor; visible review dates ranged approximately March-July 2026; sample-size bucket `small (5-12 visible excerpts/snippets)`.
- **Repeated positives:** beach setting, historic character, resort experience, and a stay-put trip shape.
- **Repeated concerns or conflicts:** room-neighborhood fit, crowding, service consistency, room condition, and value. A hotel-level recommendation cannot promise the same experience across every building or room category.
- **Confidence and claim boundary:** official room/program facts `HIGH`; displayed price example `MEDIUM`; review patterns `LOW`. Do not imply that every room connects, every unit has a kitchen, or every neighborhood has the same access and condition.
- **Freshness:** checked 2026-07-21; recheck price examples by 2026-08-04, official facts by 2026-08-20, and review themes by 2026-09-19.
- **Parent check:** select the exact neighborhood and room type, verify connecting-room or kitchen needs, and compare the final total including current mandatory charges and parking.
- **Sources:** `DEL-OFFICIAL-FAQ`, `DEL-OFFICIAL-STAY`, `DEL-OFFICIAL-SHORE-HOUSE`, `DEL-PRICE-EXPEDIA`, `DEL-REVIEWS-EXPEDIA`, `DEL-REVIEWS-TRIPADVISOR`.

#### The Dana on Mission Bay

- **Family use case:** a more moderate Mission Bay base for families that want pools and practical room-capacity information without a large stay-put-resort footprint.
- **Official facts checked:** two heated pools; standard-room capacity commonly up to four and many suites up to six; free cribs; limited connecting rooms and rollaways; refrigerators and microwaves but no published full kitchens; current FAQ publishes parking and resort-fee information.
- **Price evidence:** Expedia displayed a public example around `$326` including taxes and fees on 2026-07-21 for a date within the next 30 days, with other visible examples in the mid-$200s. The page uses the wider `$250-$400+` planning range.
- **Online-review sample:** Expedia, Booking.com, and Tripadvisor; visible review dates ranged approximately May-July 2026; sample-size bucket `small (5-12 visible excerpts/snippets)`.
- **Repeated positives:** Mission Bay location, pools, grounds, and family activities.
- **Repeated concerns or conflicts:** room size or condition, parking walk, and whether fees feel worthwhile for the selected room.
- **Confidence and claim boundary:** official capacity/amenity facts `HIGH`; displayed price examples `MEDIUM`; review patterns `LOW`. Do not promise connecting rooms, rollaways, a kitchen, or a particular room condition.
- **Freshness:** checked 2026-07-21; recheck price examples by 2026-08-04, official facts by 2026-08-20, and review themes by 2026-09-19.
- **Parent check:** confirm occupancy for the exact room, any connecting/rollaway request, pool availability, parking, and the final total.
- **Sources:** `DANA-OFFICIAL-FAQ`, `DANA-OFFICIAL-ROOMS`, `DANA-PRICE-EXPEDIA`, `DANA-REVIEWS-EXPEDIA`, `DANA-REVIEWS-BOOKING`, `DANA-REVIEWS-TRIPADVISOR`.

#### Manchester Grand Hyatt San Diego

- **Family use case:** a full-service Downtown base for families choosing bayfront access, larger-hotel amenities, or a published connecting/suite setup.
- **Official facts checked:** published two-double connecting and family-suite options; play yards by request; microwaves in specified suites; a daily destination charge; the current FAQ says only Coastline Pool is operating, while the renovation page provides the broader schedule for the other rooftop pool.
- **Price evidence:** Expedia displayed public examples around `$329-$340` including taxes and fees on 2026-07-21 for a date within the next 30 days. The page uses the wider `$300-$450+` planning range.
- **Online-review sample:** Expedia, Booking.com, and Tripadvisor; visible review dates ranged approximately January-July 2026; sample-size bucket `small (5-12 visible excerpts/snippets)`.
- **Repeated positives:** Downtown/bay location, views, room scale, and access to waterfront activities.
- **Repeated concerns or conflicts:** renovation disruption, pool expectations, room assignment, service consistency, and value after current charges.
- **Confidence and claim boundary:** official room/renovation facts `HIGH`; displayed price examples `MEDIUM`; review patterns `LOW`. Do not describe two pools as currently available or promise a connecting room, play yard, view, or renovation completion date.
- **Freshness:** checked 2026-07-21; recheck price examples and renovation/pool status by 2026-08-04, other official facts by 2026-08-20, and review themes by 2026-09-19.
- **Parent check:** verify the exact room setup, connecting request, active pool, renovation impacts, destination charge, parking, and final total.
- **Sources:** `MGH-OFFICIAL-MAIN`, `MGH-OFFICIAL-ROOMS`, `MGH-OFFICIAL-FAQ`, `MGH-OFFICIAL-RENOVATION`, `MGH-PRICE-EXPEDIA`, `MGH-REVIEWS-EXPEDIA`, `MGH-REVIEWS-BOOKING`, `MGH-REVIEWS-TRIPADVISOR`.

### Reviewed but not promoted

| Candidate | Reason not promoted now |
|---|---|
| Park Hyatt Aviara / Omni La Costa / Seabird / Mission Pacific | Strong North County resort choices, but they broaden the page toward a separate county/resort intent and can be materially expensive. |
| Pendry / Marriott Marquis / InterContinental / Hilton Bayfront | Plausible Downtown competitors, but Manchester and Homewood create clearer full-service versus suite/kitchen choices in a 12-hotel set. |
| Coronado Island Marriott | Valid Coronado alternative, but Hotel del and Loews currently expose more distinct beachfront versus isolated-bay trip shapes. |
| La Jolla Beach & Tennis Club | Potentially strong family fit, but access/booking structure and exact room evidence need a separate verification pass. |
| Budget chains around Hotel Circle | Could serve a genuine budget cluster, but a useful recommendation requires a separate value/condition/parking review rather than adding a token low-price name. |

## Page design decisions

### Activities

- Keep six quick picks, each solving a distinct family situation.
- Compare all 12 primary choices in one table.
- Use compact detail cards instead of repeating seven prose fields for every attraction.
- Make geographic outliers explicit: LEGOLAND is in Carlsbad and Safari Park is in Escondido.
- Keep exact route, stroller, water, safety, and sensory conclusions as verify-for-your-date/route decisions.

### Hotels

- Keep trip-style picks above the table, then all 12 in one comparison.
- Preserve concrete room and family setup facts; optional crib/rollaway details are included when official sources publish them, not treated as mandatory fields.
- State current renovation or operational uncertainty where it can change the stay.
- Keep online-review evidence named as a small directional sample from public booking/review sites.
- Do not publish ordinal rankings or a universal winner.

## Source register

### Added activity sources

- SeaWorld San Diego park information: https://seaworld.com/san-diego/park-info/
- SeaWorld policies: https://seaworld.com/san-diego/park-info/park-policies/
- SeaWorld ride/attraction schedule: https://seaworld.com/san-diego/park-info/ride-attraction-schedule/
- LEGOLAND California planning: https://www.legoland.com/california/plan-your-visit/
- LEGOLAND hours: https://www.legoland.com/california/plan-your-visit/planning-tools/opening-hours/
- LEGOLAND directions/parking: https://www.legoland.com/california/plan-your-visit/planning-tools/directions/
- Safari Park planning: https://sandiegozoo.org/app/p/
- The New Children's Museum visit information: https://thinkplaycreate.org/visit/
- The New Children's Museum current notices: https://thinkplaycreate.org/
- Fleet Science Center hours/admission: https://www.fleetscience.org/hours-admission
- Belmont Park: https://www.belmontpark.com/

### Added hotel sources

- `LJS-OFFICIAL-ROOMS` — La Jolla Shores Hotel accommodations: https://www.ljshoreshotel.com/accommodations/
- `LJS-OFFICIAL-FAQ` — La Jolla Shores Hotel FAQ: https://www.ljshoreshotel.com/faqs/
- `LJS-OFFICIAL-POLICY` — La Jolla Shores Hotel resort policies: https://www.ljshoreshotel.com/resort-policies/
- `LJS-PRICE-EXPEDIA` / `LJS-REVIEWS-EXPEDIA` — La Jolla Shores Hotel public Expedia page: https://www.expedia.com/La-Jolla-Hotels-La-Jolla-Shores-Hotel.h25973.Hotel-Information
- `LJS-REVIEWS-TRIPADVISOR` — La Jolla Shores Hotel public Tripadvisor page: https://www.tripadvisor.com/Hotel_Review-g32578-d217262-Reviews-La_Jolla_Shores_Hotel-La_Jolla_San_Diego_California.html
- `DEL-OFFICIAL-FAQ` — Hotel del Coronado FAQ: https://www.hoteldel.com/faq/
- `DEL-OFFICIAL-STAY` — Hotel del Coronado rooms/neighborhoods: https://www.hoteldel.com/stay/
- `DEL-OFFICIAL-SHORE-HOUSE` — Shore House rooms: https://www.hilton.com/en-gb/hotels/sanrhol-shore-house-at-the-del/rooms/
- `DEL-PRICE-EXPEDIA` / `DEL-REVIEWS-EXPEDIA` — Hotel del Coronado public Expedia page: https://www.expedia.com/Coronado-Hotels-Hotel-Del-Coronado.h7496.Hotel-Information
- `DEL-REVIEWS-TRIPADVISOR` — Hotel del Coronado public Tripadvisor page: https://www.tripadvisor.com/Hotel_Review-g32250-d125137-Reviews-Hotel_Del_Coronado-Coronado_California.html
- `DANA-OFFICIAL-FAQ` — The Dana FAQ: https://thedana.com/san-diego-hotel/faq/
- `DANA-OFFICIAL-ROOMS` — The Dana accommodations: https://thedana.com/san-diego-accommodations/
- `DANA-PRICE-EXPEDIA` / `DANA-REVIEWS-EXPEDIA` — The Dana public Expedia page: https://www.expedia.com/San-Diego-Hotels-The-Dana-On-Mission-Bay.h40953.Hotel-Information
- `DANA-REVIEWS-BOOKING` — The Dana public Booking.com review page: https://www.booking.com/reviews/us/hotel/the-dana-on-mission-bay.html
- `DANA-REVIEWS-TRIPADVISOR` — The Dana public Tripadvisor page: https://www.tripadvisor.com/Hotel_Review-g60750-d83646-Reviews-The_Dana_on_Mission_Bay-San_Diego_California.html
- `MGH-OFFICIAL-MAIN` — Manchester Grand Hyatt main page: https://www.hyatt.com/grand-hyatt/en-US/sanrs-manchester-grand-hyatt-san-diego
- `MGH-OFFICIAL-ROOMS` — Manchester Grand Hyatt rooms: https://www.hyatt.com/grand-hyatt/en-US/sanrs-manchester-grand-hyatt-san-diego/rooms
- `MGH-OFFICIAL-FAQ` — Manchester Grand Hyatt FAQ: https://www.hyatt.com/grand-hyatt/en-US/sanrs-manchester-grand-hyatt-san-diego/faqs
- `MGH-OFFICIAL-RENOVATION` — Manchester Grand Hyatt renovation status: https://www.hyatt.com/grand-hyatt/en-US/sanrs-manchester-grand-hyatt-san-diego/renovation
- `MGH-PRICE-EXPEDIA` / `MGH-REVIEWS-EXPEDIA` — Manchester Grand Hyatt public Expedia page: https://www.expedia.com/San-Diego-Hotels-Manchester-Grand-Hyatt-San-Diego.h12073.Hotel-Information
- `MGH-REVIEWS-BOOKING` — Manchester Grand Hyatt public Booking.com review page: https://www.booking.com/reviews/us/hotel/manchester-grand-hyatt-san-diego.html
- `MGH-REVIEWS-TRIPADVISOR` — Manchester Grand Hyatt public Tripadvisor page: https://www.tripadvisor.com/Hotel_Review-g60750-d80219-Reviews-Manchester_Grand_Hyatt_San_Diego-San_Diego_California.html

Source IDs in the evidence records map directly to the property URLs above by property and source type. Price and review pages are volatile public evidence checked on the stated date; official pages are primary property evidence. No copied review text, private data, authenticated account data, or raw query export is stored here.

Other public Hotels.com, KAYAK, and relevant community pages were checked on 2026-07-21 for rough corroboration and qualitative context only.

## Acceptance criteria

- Activity page presents exactly 12 primary choices, six distinct quick picks, compact logistics notes, official added sources, and clear North County/inland geography.
- Hotel page presents exactly 12 named choices, rough dollar ranges for the four additions, direct map links, official facts, current caveats, and directional online-review themes.
- Stay-area page changes only the two dependent hotel-count labels.
- Canonicals, indexability, sitemap membership, schema item count, internal links, and generated-source parity remain correct.
- The pages do not claim firsthand experience, safety certainty, representative review ratings, live rates, or universal rankings.

## Measurement plan

This release needs a fresh crawl before performance interpretation. After Google has current crawl evidence, compare page-level impressions, query-family mix, and average position for the all-ages activity URL and family-hotel URL. The first question is whether each URL earns impressions for its intended query family, not whether a short-window rank change proves causality. Do not request indexing from this transaction.
