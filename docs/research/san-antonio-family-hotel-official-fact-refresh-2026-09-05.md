# San Antonio Family-Hotel Official-Fact Refresh

Status: implementation evidence for `FT-MAINT-004` / `SRR-053` / `IMP-050`

Checked: 2026-09-05

Target: `https://familytripwise.com/where-to-stay/san-antonio-family-hotels.html`

## Question

Do the 12 selected hotel roles and material official-property claims still hold after the 30-day refresh interval, and can the page keep official-fact freshness distinct from its unchanged July 26 price and online-review evidence?

## Hypothesis

Most roles will still hold, but at least one visible claim or first-party source path will need correction because hotel amenities, labels, policies, and site architecture are volatile.

## Evidence Boundary

- Evidence class: current official hotel or brand pages crawled on September 5, 2026.
- The audit checks the visible role, room-function, water/pool, meal, location, and exact-parent-check claims used by the page. It does not verify availability for a traveler's dates or every room category.
- Current fees and operating rules are recorded as volatile checks. July 26 rough total ranges and online-review summaries were not refreshed and keep their original date.
- No hotel was booked or contacted. No firsthand stay, safety, exact route/stroller, quietness, guaranteed operation, or firm family-fit claim is made.
- Recent reused September 4 GSC is finalized through September 2 and has no aligned public query cohort. It is crawl/orientation evidence only and did not select this maintenance action.

## Results

| Property | Current official-source result | Public action |
|---|---|---|
| Hyatt Regency Hill Country Resort and Villas | `CONFIRMED`: current Hyatt pages retain the water park, Big Spring Lagoon, and published two-queen occupancy of two adults plus two children. A current daily resort fee is volatile and remains a final-total check. | Preserve role and wording. |
| JW Marriott San Antonio Hill Country Resort and Spa | `CONFIRMED_WITH_EXACT_CHECK`: current Marriott material retains the nine-acre water experience, 1,100-foot lazy river, slides, and weather-dependent operation. It now explicitly limits River Bluff entry to five wristbands per room. | Keep the role; expose the five-wristband limit as a dated booking check. |
| Signia by Hilton La Cantera Resort and Spa | `CONFIRMED_WITH_REDIRECT`: current Hilton pages retain five pool environments, family slides and areas, nearby Six Flags access, and a complimentary local shuttle subject to availability. The old La Cantera source paths redirect to Hilton. | Preserve the role; replace old source links with current Hilton pages. |
| Hyatt Vacation Club at Wild Oak Ranch | `CONFIRMED`: current Hyatt Vacation Club material retains studios and one- to three-bedroom villas, full kitchens and in-room laundry in the one- to three-bedroom villas, and pool, slide, and lazy-river amenities. The 120-minute presentation applies to the promotional offer inspected, not every stay. | Preserve the role and existing vacation-club offer caveat. |
| Embassy Suites by Hilton San Antonio Riverwalk Downtown | `CONFIRMED`: current Hilton material retains suites, free made-to-order breakfast, complimentary evening reception, and a heated rooftop outdoor pool. | Preserve role and wording. |
| Homewood Suites by Hilton San Antonio-Riverwalk/Downtown | `CONFIRMED`: current Hilton material retains a full in-suite kitchen, free hot breakfast, and outdoor pool. | Preserve role and wording. |
| Home2 Suites by Hilton San Antonio Riverwalk | `CONFIRMED_WITH_ROOM_CHECK`: the current official property is still at 118 Soledad Street and retains suite kitchens, free hot breakfast, and an outdoor pool. Exact occupancy remains room- and date-specific. | Preserve the explicit property distinction and exact-room check. |
| Drury Plaza Hotel San Antonio Riverwalk | `CONFIRMED`: current Drury material retains free hot breakfast, the evening 5:30 Kickback, a heated outdoor rooftop pool, an indoor pool, and microwave/refrigerator room amenities. | Preserve role and wording. |
| Hotel Contessa | `CONFIRMED`: current official material retains the all-suite layout, living and sleeping zones, and rooftop pool maintained at about 85 degrees year-round. Exact sleeping surfaces and registered occupancy still require room-level confirmation. | Preserve role and wording. |
| Hyatt Regency San Antonio Riverwalk | `PARTIAL`: current Hyatt material retains direct River Walk/Alamo positioning and a rooftop pool, but no longer publishes the page's `temperature-controlled` wording. | Remove the unsupported temperature-control qualifier and preserve the rooftop-pool role. |
| San Antonio Marriott Rivercenter on the River Walk | `FIRST_PARTY_CONFLICT`: the current overview lists `Indoor Pool`, labels the swimming amenity `Indoor/Outdoor Pool`, and the current experiences FAQ says the property has one indoor pool. The evidence does not support the page's unqualified plural `indoor and outdoor pools` claim. | State the source conflict and require confirmation of current configuration and access. |
| Omni La Mansion del Rio | `CONFIRMED`: current Omni accommodations retain king or two-double rooms, a heated courtyard pool, and a published four-guest ceiling for the largest named room. | Preserve the location-led role and exact occupancy check. |

## Current Official Sources

- Hyatt Regency Hill Country [overview](https://www.hyatt.com/hyatt-regency/en-US/sanhc-hyatt-regency-hill-country-resort-and-villas) and [rooms](https://www.hyatt.com/hyatt-regency/en-US/sanhc-hyatt-regency-hill-country-resort-and-villas/rooms)
- JW Marriott [overview](https://www.marriott.com/en-us/hotels/satjw-jw-marriott-san-antonio-hill-country-resort-and-spa/overview/) and [experiences](https://www.marriott.com/en-us/hotels/satjw-jw-marriott-san-antonio-hill-country-resort-and-spa/experiences/)
- Signia La Cantera [resort](https://www.hilton.com/en/hotels/satcnsa-signia-la-cantera-resort-and-spa/resort/) and [things to do](https://www.hilton.com/en/hotels/satcnsa-signia-la-cantera-resort-and-spa/things-to-do/)
- Wild Oak Ranch [resort](https://www.hyattvacationclub.com/resorts/wild-oak-ranch) and [promotional-offer terms](https://www.hyattvacationclub.com/vacation-offers)
- Embassy Suites Riverwalk Downtown [official page](https://www.hilton.com/en/hotels/sateses-embassy-suites-san-antonio-riverwalk-downtown/)
- Homewood Suites Riverwalk/Downtown [official page](https://www.hilton.com/en/hotels/satdnhw-homewood-suites-san-antonio-riverwalk-downtown/)
- Home2 Suites Riverwalk [official page](https://www.hilton.com/en/hotels/satrlht-home2-suites-san-antonio-riverwalk/)
- Drury Plaza Riverwalk [official page](https://www.druryhotels.com/locations/san-antonio-tx/drury-plaza-hotel-san-antonio-riverwalk)
- Hotel Contessa [overview](https://www.thehotelcontessa.com/) and [amenities](https://www.thehotelcontessa.com/stay/amenities/)
- Hyatt Regency Riverwalk [official page](https://www.hyatt.com/hyatt-regency/en-US/satrs-hyatt-regency-san-antonio-riverwalk)
- Marriott Rivercenter [overview](https://www.marriott.com/en-us/hotels/satrc-san-antonio-marriott-rivercenter-on-the-river-walk/overview/) and [experiences](https://www.marriott.com/en-us/hotels/satrc-san-antonio-marriott-rivercenter-on-the-river-walk/experiences/)
- Omni La Mansion [overview](https://www.omnihotels.com/hotels/san-antonio-la-mansion-del-rio) and [accommodations](https://www.omnihotels.com/hotels/san-antonio-la-mansion-del-rio/accommodations)

## Decision

`UPDATE_BOUNDED`. The 12-property set and all 12 decision roles remain useful. Correct the two unsupported or conflicting pool claims, expose JW Marriott's five-wristband rule, replace redirected La Cantera sources, and split the visible official-fact date from the unchanged price/review date. Do not add hotels, price claims, review prose, or URLs.

## Measurement

This is factual freshness maintenance, not a ranking experiment. Release verification must preserve the existing URL, title, H1, canonical, indexability, sitemap entry, 12 cards, 24 Maps links, three visible/schema FAQs, and 12-item ItemList. Reopen the evidence before October 5, 2026, or sooner if an official closure, rebrand, policy change, source conflict, user report, or material page update arrives.
