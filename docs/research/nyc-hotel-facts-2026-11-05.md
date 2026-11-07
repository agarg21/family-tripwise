# NYC family hotels: official facts re-read, 2026-11-05

Scope: the 12 hotels in `newYorkCityFamilyHotels` (tools/page-generation/family-hotel-pages.mjs): `strengths`, `familySetup`, `category`, `parentCheck`, plus `newYorkCityHotelSources`. `nycRoomChecks` (Oct 11) compared only for contradiction.

Method: official hotel or brand pages only, read once per URL on 2026-11-05 through WebFetch, which returns a model-extracted reading of the page text rather than the rendered page. "Not found" therefore means "not in the text we could read", not "the hotel removed it"; Hilton room lists and Marriott FAQ answers in particular did not come through as text. No logins, forms or retries. Blocked URLs were not retried. Prices were not checked.

Status key: same = matches the page; changed = official text differs from the page; not found = not in the text read, neither confirmed nor contradicted; new = not on the page today.

## Hotel Beacon

Sources: https://www.beaconhotel.com/rooms/ · https://www.beaconhotel.com/rooms/two-bedroom-suite/ · https://www.beaconhotel.com/about/

| Fact | Observed 2026-11-05 | Vs page |
|---|---|---|
| Kitchenettes | Studios and suites "come with a fully-equipped kitchenette"; about page: "stoves, refrigerators, and coffee makers" | same |
| Two-double studio | Double Studio: 345 sq ft, "two double beds"; Double Deluxe 320 sq ft, "up to two adults and one child 12 years and under" | same (occupancy differs by category) |
| One-bedroom suites | Queen/King/Double Suite 620-630 sq ft; Double Suite has two doubles plus queen pullout sofa | same |
| Two-bedroom suite | "800-square-foot"; two doubles, king, queen pullout, two marble bathrooms | same |
| Two-bedroom occupancy | "up to eight guests", up to six adults and two children; one rollaway $30/night | new, consistent with Oct 11 room check |
| Fees | "No Facility / Resort Fees" | new |
| Breakfast | No general policy stated; "American Breakfast Package" offer listed | new |
| Pool | Not mentioned | not found |
| Parking | "nearby parking" only; no price | not found |
| Renovation notice (Oct 11 room check) | Not mentioned on rooms or about page | not found, not contradicted |

## Homewood Suites Midtown Manhattan Times Square-South

Sources: https://www.hilton.com/en/hotels/nycmmhw-homewood-suites-new-york-midtown-manhattan-times-square-south-ny/ · .../hotel-info/

| Fact | Observed 2026-11-05 | Vs page |
|---|---|---|
| Breakfast | "Free hot breakfast", buffet | same |
| Kitchen | "In-Room Kitchen"; "full in-suite kitchens" | same |
| Connecting rooms | "Confirmed Connecting rooms: Available" | same |
| Cribs | "Cribs: Available" | same |
| Rooftop terrace | Photo captions "Rooftop Terrace View" only | same (thin) |
| Guest laundry | Not mentioned on either page | not found |
| Room types | "Premium King Suite", "2 Queen Kitchen", "King Studio"; one-bedroom not described | same (studio caution stands) |
| Occupancy | Not stated | not found |
| Parking | Self-parking "$65.00 per day"; no valet | new |
| Mandatory fee | None listed | not found |
| Pool | Not mentioned | not found |

## Residence Inn New York Manhattan/Central Park

Sources: https://www.marriott.com/en-us/hotels/nycpr-residence-inn-new-york-manhattan-central-park/overview/ · .../rooms/ · .../photos/

| Fact | Observed 2026-11-05 | Vs page |
|---|---|---|
| All-suite, kitchenettes | "an all-suite hotel"; "fully equipped kitchenettes"; "appliances, cookware, and utensils" | same |
| Breakfast | "Free Full American and Hot Breakfast" | same |
| Laundry | "On-Site Laundry" | same |
| Views | "sweeping views of the Manhattan skyline" | same |
| Two-double studio exists | Photo captions "Double/Double Studio – Central Park View", "Double-Double Suite" | same |
| Two-double studio sleeps four | No per-room occupancy; generic widget "Maximum 8 guests per room" | not found |
| Stovetop | Photo alt text "Stove-tops" under "Suite Amenities"; not said to be in every room | same (conflict stays open) |
| Parking | Valet only, off-site: "Standard = $65.00, Oversized = $80.00 no in/out" | new |
| Destination fee | None mentioned | not found |
| Pool | Not listed | not found |

## Radio City Apartments

Sources: https://www.radiocityapartments.com/en/apartments-to-rent-new-york-city/two-bedroom-apartment/ · https://www.radiocityapartments.com/en/about-the-hotel/

| Fact | Observed 2026-11-05 | Vs page |
|---|---|---|
| Beds | "One bedroom with a Queen Bed and another bedroom with 2 Twin Beds"; sofa bed in living area | same |
| Capacity | "up to 5 guests plus one child 12 years or under" | same |
| Size | "approximately 470 square feet" | same |
| Kitchenette | "Refrigerator, Microwave, Stove, Pots and Pans; Kitchenware/Utensils; Coffee/Tea Maker" | same |
| Dining, housekeeping | "Dining area"; "Daily housekeeping" | same |
| Breakfast, fees, deposit, parking, elevator | Not mentioned on either page | not found |

## Embassy Suites New York Manhattan Times Square

Sources: https://www.hilton.com/en/hotels/nycmies-embassy-suites-new-york-manhattan-times-square/ · .../rooms/ (no room list in text) · .../hotel-info/

| Fact | Observed 2026-11-05 | Vs page |
|---|---|---|
| Breakfast | "Free made-to-order breakfast" | same |
| Evening reception | "Complimentary evening reception" | same |
| Studios | "spacious studio suites"; caption "1 King Bed Studio" | same |
| King-plus-sofa-bed studios, 277-320 sq ft | Rooms page text held no room types, sizes or sofa beds | not found |
| Cribs (Hilton side of the conflict) | "Cribs: Available" | same; Expedia side not checked (third party) |
| Connecting rooms | Listed as amenity | new |
| Mandatory charge | "Daily Mandatory Destination Charge" includes internet, "daily $30 food and beverage credit", "daily $15 self-parking credit"; amount not stated | same (exists); amount not found |
| Parking | Self and valet "Not available"; "Preferential hotel rate at iPark 59 W 36th Street" | new |
| Rollaway | Not mentioned | not found |
| Pool | Not mentioned | not found |

## TRYP by Wyndham New York City Times Square / Midtown

Sources: https://www.wyndhamhotels.com/tryp/new-york-city-new-york/tryp-new-york-city-times-square-south-midtown/overview · https://www.wyndhamhotels.com/tryp/about-us/rooms (describes an Istanbul family room, not this hotel)

| Fact | Observed 2026-11-05 | Vs page |
|---|---|---|
| Family rooms | "family rooms feature bunk beds" | same |
| Capacity | "Accommodating up to eight guests, select premium rooms feature a living room, refrigerator, and two bathrooms" | same on eight; not tied to the family room by name |
| Two large doubles, bunk, sofa bed | Not in the text read; bunk beds are the only bed type | not found |
| Bathrooms | "two bathrooms" for select premium rooms vs Oct 11 check "one bathroom" for TRYP FAMILY | unresolved, may be different rooms |
| Breakfast | "an impressive buffet breakfast" 7-10 a.m.; included or not not stated | new |
| Rooftop | "rooftop terrace with stunning city views" | same (exists; current status still a check) |
| Fees, parking, pool | Not mentioned | not found |

Page-internal: `strengths` says "two large double beds"; `nycRoomChecks` (Oct 11) says "two queens". Official text read today does not settle it.

## The Kimberly Hotel

Sources: https://www.kimberlyhotel.com/accommodations/ · .../accommodations/luxury-one-bedroom-suite-with-two-double-beds · .../accommodations/luxury-one-bedroom-suite-with-king-bed · https://www.kimberlyhotel.com/amenities · https://www.kimberlyhotel.com/our-hotel/amenities · https://www.kimberlyhotel.com/faq

| Fact | Observed 2026-11-05 | Vs page |
|---|---|---|
| Kitchenette | Word not used on King suite page or amenities; "A wet bar with mini-refrigerator, coffee maker, microwave, and many with toasters". Two-double suite same equipment; FAQ "microwave and mini-refrigerator" | changed |
| Suite size | One-bedroom pages: "between 550 and 600 square feet"; two-bedroom size not stated; "500-600" not found | changed (one-bedroom); two-bedroom not found |
| Balconies | "All but 10 of our 154 suites feature private balconies" | same |
| Living and dining | "A separate living room ... and a dining area" | same |
| Two-bedroom suite | King, queen or two doubles, two full marble bathrooms, pull-out sofa, living room, dining area | same |
| Two-double one-bedroom | Two doubles, sofa sleeper, one bathroom, "Ideal for families or groups" | new |
| Occupancy | Not stated | not found |
| Cribs | "at no additional charge, subject to availability" | new |
| Children | "Children 17 and under do not pay additional fees" | new |
| Parking | Valet "$60 for 24 hours for cars and $70 for minivans/SUVs" | new |
| Facility fee, breakfast, pool | Not mentioned; only a $10 per-package fee from Oct 1, 2026 | not found |

## New York Marriott Marquis

Sources: https://www.marriott.com/en-us/hotels/nycmq-new-york-marriott-marquis/rooms/ · .../rooms/premium-accommodations/ · .../overview/?PTNR=VANITY · .../photos/

| Fact | Observed 2026-11-05 | Vs page |
|---|---|---|
| Two-double rooms | Captions "Double/Double Guest Room", "Double/Double Superior Times Square View"; rooms page also has a "Two Queen Bed Room" caption | same; queen caption unresolved |
| Family Connector | King bedroom, two-double bedroom, sofa bed, two washrooms, lounge; "Layout may vary" | same |
| Other connectors | Family Double Suite Connector (two bedrooms each two doubles); Family King Suite Connector | new |
| Occupancy | No connector occupancy; generic widget "Maximum 8 guests per room" | not found |
| Cribs | Not in the text read | not found |
| Rollaways "not available" | FAQ question present, answer not in text | not found |
| Destination charge | Not mentioned | not found |
| Parking | "Daily: $150.00"; also "Cars $90, SUVs $100, oversized $125, oversized+ $150" (page inconsistent) | new |
| Breakfast | M Club only; lounge complimentary for top elite tiers | same (breakfast is a cost) |

## Conrad New York Downtown

Sources: https://www.hilton.com/en/hotels/nyccici-conrad-new-york-downtown/suites/ · https://www.hilton.com/en/hotels/nyccici-conrad-new-york-downtown/ · .../amenities/

| Fact | Observed 2026-11-05 | Vs page |
|---|---|---|
| All-suite | "463 all-suite" | same |
| Separate areas, size | "separate living and sleeping areas"; from "430 sq. ft." | same |
| Two-double suites | "2 Doubles, sleeps 4" | same |
| Connecting rooms, cribs | Listed as amenities | same |
| King plus sofa | Sleeps 3 or 4 by category | same |
| Pocket door | Not mentioned | not found |
| 2 Bedroom Family Suite | Sleeps 7 | new |
| Breakfast | Package only: "continental breakfast ... each registered adult" | new |
| Parking | Charged per 24 hours; no rate | not found |
| Fees, pool | Not mentioned | not found |

## Lotte New York Palace

Sources: https://www.lottenypalace.com/suites · https://www.lottenypalace.com/faq

| Fact | Observed 2026-11-05 | Vs page |
|---|---|---|
| Palace Family Suite | 765 sq ft, two kings, sleeper sofa, two bathrooms, up to six | same |
| Family Suite Two Doubles | 765 sq ft, one king, two doubles, sleeper sofa, two bathrooms, up to eight | same |
| Connecting rooms | "based upon availability ... in the superior room category"; guaranteed in two-bedroom or specialty suites | same |
| Rollaway | "$75 per night (excluding taxes)"; not in rooms that already have two beds | new |
| Children | "Children under 12 stay free" sharing with parents | new |
| Pool | "does not have a swimming pool or whirlpool" | new |
| Parking | SP+ garage: "Up to 24 Hours $ 90.00", no in and out | new |
| Breakfast | Three paid dining options; not said to be included | new |
| Cribs, facility fee | Not mentioned | not found |

## 1 Hotel Brooklyn Bridge

Sources: https://www.1hotels.com/brooklyn-bridge/sleep · https://www.1hotels.com/llms-html/brooklyn-bridge (first 100,000 characters only) · https://www.1hotels.com/brooklyn-bridge/policies · https://www.1hotels.com/brooklyn-bridge/hotel-rooms/neighboring-skyline-suite-2-bed. Not re-read: https://www.1hotels.com/brooklyn-bridge/sleep/dumbo-2-beds (fetch permission not granted; not retried).

| Fact | Observed 2026-11-05 | Vs page |
|---|---|---|
| Dumbo 2 Beds | 2 double, sleeps 4 | same |
| Dumbo 2 Beds size, about 325 sq ft | "Average Size:" shows no figure; room page not read | not found |
| Connecting options | "ideal for families or groups of 4-6"; Neighboring Skyline Suite & 2 Bed, 1 king and 2 doubles, about 899 sq ft, up to 6 | same |
| Pool | "Rooftop Pool (seasonal, all ages welcome ...)" | same; child access now answered |
| Amenity fee | "A daily $49 amenity fee per room, exclusive of tax" | new, not on page |
| Deposit | $250 daily incidentals hold; 1-night deposit on Pay Later suites | new |
| Breakfast | "not included in the standard room rate" | new |
| Cribs | "a traditional crib is available" | new |
| Parking | Public, valet, garage; no rates | not found |

## Four Seasons Hotel New York Downtown

Sources: https://www.fourseasons.com/newyorkdowntown/accommodations/ · .../accommodations/guest-rooms/manhattan-room/ · https://www.fourseasons.com/newyorkdowntown/ · https://press.fourseasons.com/newyorkdowntown/hotel-facts/

| Fact | Observed 2026-11-05 | Vs page |
|---|---|---|
| Indoor pool | "75 ft. / 23 m. indoor 3-lane lap pool", depth 4 ft | same |
| Two doubles plus crib | Manhattan Room 425 sq ft, "One king bed or two double beds", one crib | same |
| Two-double occupancy | "2 adults and 1 child, or 1 adult and 2 children" | same |
| Rollaways | "does not have optional rollaway beds available" | same |
| Two-bedroom suites | Greenwich, Trinity: 1,275 sq ft, 2 kings | new |
| Breakfast | "Bed and Breakfast" offer; standard rate not stated | not found |
| Parking, fees | Not mentioned | not found |
