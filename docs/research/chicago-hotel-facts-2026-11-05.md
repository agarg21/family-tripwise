# Chicago family hotels: official facts re-read, 2026-11-05

Scope: the 10 hotels in `chicagoFamilyHotels` (tools/page-generation/family-hotel-pages.mjs): `strengths`, `familySetup`, `category`, `parentCheck`, plus `chicagoHotelSources`.

Method: official hotel or brand pages only, read once per URL on 2026-11-05 through WebFetch, which returns a model-extracted reading of the page text rather than the rendered page. "Not found" therefore means "not in the text we could read", not "the hotel removed it"; Hilton policy, FAQ and room text in particular often did not come through. No logins, forms or retries. Two URLs were not read: the Hilton Chicago rooms page (https://www.hilton.com/en/hotels/chichhh-hilton-chicago/rooms/; the older www3.hilton.com rooms URL only redirects to it, and the redirect was not followed) and the Langham Kids Suite page (https://www.langhamhotels.com/en/the-langham/chicago/stay/the-kids-suite/). Both fetches were refused because a permission request timed out, and neither was retried. Room prices were not checked; fee and parking amounts are as published and exclude any tax not stated.

Status key: same = matches the page; changed = official text differs from the page; not found = not in the text read, neither confirmed nor contradicted; new = not on the page today.

## Embassy Suites by Hilton Chicago Downtown Magnificent Mile

Sources: https://www.hilton.com/en/hotels/chirees-embassy-suites-chicago-downtown-magnificent-mile/ · .../hotel-info/

| Fact | Observed 2026-11-05 | Vs page |
|---|---|---|
| Two-room suites | "spacious two-room suites" (meta description) | same |
| Bedding | Photo captions "King Bedroom", "Double Queen Bedroom" | new (thin) |
| Occupancy | Not stated | not found |
| Children free | "Children 17 years and under stay free in same suite with parent" | same |
| Breakfast | "Free made-to-order breakfast"; hotel-info also says "Type: buffet" | same |
| Evening reception | "Complimentary evening reception" | same |
| Indoor pool | "Indoor pool"; no status or closure notice | same |
| Cribs | "Cribs: Available" | same |
| Connecting rooms | "Confirmed Connecting rooms: Not available" | new |
| Destination charge | "Daily Mandatory Destination Charge includes:" "daily $25.00 food and beverage credit", "$16.00 dry cleaning credit"; amount not stated | same (charge exists); amount not found; inclusions new |
| Parking | Self-parking "$65.00 per day"; "Valet parking: Not available" | new |
| Kitchen | Not stated | not found |
| Elevator notice | Not stated | not found |

## Homewood Suites by Hilton Chicago-Downtown

Sources: https://www.hilton.com/en/hotels/chihwhw-homewood-suites-chicago-downtown/ · .../hotel-info/

| Fact | Observed 2026-11-05 | Vs page |
|---|---|---|
| Kitchen | "full in-suite kitchens" (meta description); "In-Room Kitchen" | same |
| Breakfast | "Free hot breakfast"; "buffet" | same |
| Indoor pool | "Indoor pool"; no status or closure notice | same |
| Connecting rooms | "Confirmed Connecting rooms: Available" | same |
| Michigan Avenue | "steps from Michigan Avenue"; "one block" not stated | changed (wording) |
| Suite types | "all-suite hotel"; caption "King Suite with TV"; one-bedroom not described | same (one-bedroom caution stands) |
| Occupancy | Not stated | not found |
| Cribs | "Cribs: Not available" | new |
| Parking | "Self-parking: Not available"; "Valet parking: $76.00" | new |
| Destination charge | Not stated | not found |

## Residence Inn Chicago Downtown/River North

Sources: https://www.marriott.com/en-us/hotels/chirn-residence-inn-chicago-downtown-river-north/overview/ · .../rooms/ · .../dining/

| Fact | Observed 2026-11-05 | Vs page |
|---|---|---|
| All suites | "All-Suites"; "apartment-style suites" | same |
| Kitchen | "apartment-style suites with full-size kitchens"; "fully equipped kitchen" | same |
| Breakfast | "complimentary hot breakfast"; Mon-Fri 6:30-9:00 AM, Sat-Sun 7:00-10:00 AM. A dining FAQ also says breakfast at Residence Inn Gatehouse is available "for a fee" | same, with an official-page conflict (new) |
| Laundry | "On-Site Laundry" | same |
| Grocery service | "complimentary grocery shopping service" | same |
| Parking | "Self parking is available for $60.00 per day"; "Valet parking is available for $74.00 per day" | same (both exist); amounts new |
| Bedding | Listing reads "King bed, sofa, workdesk, tv & armoire"; sofa bed and bedroom door not stated | not found (caution stands) |
| Occupancy | "Maximum 8 guests per room" (generic, not per suite) | new |
| Destination fee | Not stated | not found |
| Pool | Not stated | not found |
| Cribs, connecting rooms | Not stated | not found |

## Sable at Navy Pier Chicago, Curio Collection by Hilton

Sources: https://sablehotel.com/ · https://www.hilton.com/en/hotels/chipiqq-sable-at-navy-pier-chicago/ · .../hotel-info/

| Fact | Observed 2026-11-05 | Vs page |
|---|---|---|
| Destination charge | "Daily Mandatory Destination Charge includes:" "daily $10 food and beverage credit", "Navy Pier Ferris Wheel and Chicago Childrens Museum tickets"; amount not stated | new (page does not mention a charge) |
| Two-queen rooms | Image label "Two Queen Beds Room" only | same (thin) |
| Sleeps four | "Sleeps four" under suite features; not stated for guest rooms | same for suites; not found for two-queen rooms |
| Views | "Lake and skyline views in every guestroom" | same |
| Mini fridge | "Mini fridge" (guest rooms); "Wet bar area with mini fridge" (suites) | same |
| Cribs | "Cribs: Available" | same |
| Connecting rooms | "Confirmed Connecting rooms: Available" | same |
| Breakfast | "Available for a fee"; a Breakfast Included offer covers "each registered adult and child age 5 and under who share the same room" | same; offer new |
| Parking | "Self-parking: $65.00 per day"; "Valet parking: $76.00"; sablehotel.com: "Valet parking is available overnight with in-and-out privileges" | new amounts |
| Pool | Not stated (no statement either way) | not found |
| Children's Museum | Listed under "Things to do" and in the destination charge | same |

## Swissotel Chicago

Sources: https://www.swissotel.com/hotels/chicago/promotions/family/swissotel-kids-suite/ · .../suites/kid-friendly-suite/ · .../promotions/ · .../explore-hotel/guest-services/ · .../accommodation/compare-rooms/ · https://www.swissotel.com/hotels/chicago/

| Fact | Observed 2026-11-05 | Vs page |
|---|---|---|
| Two-room setup | "a two-room suite: One room for adults and the signature Swissotel Kids Room"; "separate but adjoining room" | same |
| Kids Suite bedding | "One King Bed with Connecting Double Beds" | new |
| Kids Suite contents | "age appropriate toys, books, games and more"; "Kid-sized table and chairs", "Colouring books", "Stuffed animals" | same |
| Movie | "Complimentary in-room movie"; "Complimentary movie theater welcome amenity" | same |
| Breakfast | "Complimentary breakfast for two adults and up to two children at The Palm"; "Breakfast credit does not include alcoholic beverages" | same; venue and exclusion new |
| Offer terms | "Available All Year Round"; "Subject to availability. Restrictions may apply."; "Age of children must be given at time of booking" | same; year-round and ages new |
| Standard double | Classic River View: "Two double beds", "320 sq ft / 30 m²"; occupancy not stated | beds same; "for four" not found |
| Experience fee | Not stated on any of the six pages read | not found, not contradicted |
| Parking | "24-hour valet parking $87/day"; "24-hour self parking $70/day" | new |
| Cribs, connecting rooms | Not stated | not found |

## InterContinental Chicago Magnificent Mile

Sources: https://www.ihg.com/intercontinental/hotels/us/en/chicago/ordha/hoteldetail/amenities/special-activations · .../amenities/pool · .../amenities · .../rooms

| Fact | Observed 2026-11-05 | Vs page |
|---|---|---|
| Project notice | Still posted: "improvements to the pool seating and locker room areas will take place from August 10–September 16"; no year in the notice; no completion statement | same |
| Closures | "The pool will be closed August 11 and September 10, and will be open for the remainder of the project" | same |
| Construction and lockers | "occasional daytime construction and will not have access to the locker rooms during this time" | same |
| Pool movies | "Weekend pool movie nights will be temporarily relocated elsewhere in the hotel" | same |
| Resort Pass in project | Extracted reading of the notice does not mention Resort Pass; Resort Pass section: "Blackout dates apply. Applicable for non-guests of the hotel." | changed or not read: "unavailable Resort Pass purchases" not re-confirmed |
| 2026 date for Sept 10 closure | Amenities page text: closure dates not stated | changed or not read: page's "dates the September 10 closure to 2026" not re-confirmed |
| Pool hours conflict | Pool page "7:00 AM - 10:00 PM"; amenities "5:00 AM - 10:00 PM" | same (conflict remains) |
| Pool description | "junior Olympic-size indoor swimming pool"; "Located on the 14th floor" | same; floor new |
| Heated | Not stated on pool page text | not found |
| Depth, child rules | Not stated | not found |
| Room beds | Classic and Premium: "Beds: 2 Double Beds, or 1 King Bed"; Classic 256-560 sq ft, Premium 313-430 sq ft | same; sizes new |
| Occupancy | Not stated | not found |
| Connecting rooms | "Connecting rooms available", listed under "Available by request" | same |
| Cribs, rollaways | "Crib available", "Crib available with fee"; "Rollaway bed available", "Rollaway bed available with fee" | same; fee wording new |
| Parking | "Daily valet parking fee: 88 USD"; "overnight rate of $88" | new |
| Destination fee | Not stated | not found |
| Breakfast | Not stated | not found |

## Hilton Chicago

Sources: https://www.hilton.com/en/hotels/chichhh-hilton-chicago/amenities/ · https://www.hilton.com/en/hotels/chichhh-hilton-chicago/?1650638388. Rooms page not read (see Method).

| Fact | Observed 2026-11-05 | Vs page |
|---|---|---|
| Location | "Overlooking Grant Park, Lake Michigan, and Museum Campus" | same |
| Indoor pool | "Indoor pool"; "heated indoor lap pool" | same; "heated lap" new |
| Connecting rooms | "Connecting Rooms" listed | same |
| Cribs | "Cribs" listed | same |
| Game room | Not stated | not found |
| Two-double rooms for four | Rooms page not read | not found |
| Family-connection, specialty layouts | Rooms page not read | not found |
| Parking | FAQ and policy headings with no text | not found |
| Destination charge | "Resort Fees" heading with no text | not found |
| Breakfast | Not stated | not found |

## Hotel Zachary Chicago, a Tribute Portfolio Hotel

Sources: https://www.hotelzachary.com/ · https://www.hotelzachary.com/accommodations/ · https://www.hotelzachary.com/faq · https://www.marriott.com/en-us/hotels/chitx-hotel-zachary-chicago-a-tribute-portfolio-hotel/overview/

| Fact | Observed 2026-11-05 | Vs page |
|---|---|---|
| Location | "just across the street from historic Wrigley Field"; Marriott "Located next to Wrigley Field" | same |
| Room types | "Our King and Double Queen rooms"; Marriott "Queen/Queen Guest Room With Ballpark View" | same |
| Views | Suites "panoramic views of Wrigleyville and Wrigley Field"; guest rooms "floor-to-ceiling windows overlooking Wrigleyville" | same |
| Dining | "a world-class restaurant destination" | same (thin) |
| Refrigerator | "Our suites are equipped with mini Smeg refrigerators; however, our standard guest rooms do not have refrigerators." | new (page says check refrigerator status) |
| Pool | "Unfortunately, there is no pool or spa on property." | new |
| Parking | Marriott: self "Daily: $65.00", valet "Daily: $80.00". FAQ: self-parking "first come first serve basis and is not a guaranteed option" | new |
| Occupancy | Marriott "Maximum 8 guests per room" (generic) | new |
| Destination fee | Not stated | not found |
| Breakfast, cribs, connecting rooms | Not stated | not found |

## Four Seasons Hotel Chicago

Sources: https://press.fourseasons.com/chicago/trending-now/reasons-to-stay-in-chicago-with-kids/ (undated) · https://press.fourseasons.com/chicago/hotel-facts/ · https://www.fourseasons.com/chicago/services-and-amenities/family/ · https://www.fourseasons.com/chicago/services-and-amenities/ · https://www.fourseasons.com/chicago/accommodations/

| Fact | Observed 2026-11-05 | Vs page |
|---|---|---|
| Two-double lake-view room occupancy | Lake-View Room: "King or two double beds"; "2 adults, or 2 adults and 1 child". Lake-View Accessible Room, "Two double beds": "3 adults, or 2 adults and 2 children". Lake-View Executive Suite, king or two doubles: "3 adults, or 2 adults and 2 children" | changed: standard Lake-View Room reads as 3 people, not 4 (extracted reading; confirm with hotel) |
| Pool | "44-foot (13.4 metre) pool with waterfall-edge"; "heated 44-foot (13-metre) infinity-edge indoor pool" | same; "heated" new |
| Child dining | Press page: "Little ones under five dine with our compliments"; conditions not stated. Current family page: not listed under "Complimentary Family Amenities"; Adorn "kid-friendly menu" | same on press page only; "stated terms" not found; not on family page (new) |
| Play space | "Kids' Room (Floor 32)"; "Ask our front desk team for a custom key card with daily access"; hours and ages not stated | same; floor and key card new |
| Child amenities | "child-sized robes"; "Welcome amenity in the guest room"; "activity book upon check-in" | same |
| Family programming | "Sammy's Adventure Passport"; "Themed movie nights"; attraction ticket access; schedule not stated | same; details new |
| Larger suites | Lakeshore Terrace Suite and Presidential Suite: "4 adults, or 2 adults and 2 children" | same |
| Cribs | Lake-View Room: "One crib (available in king-bedded rooms)"; suites list one or two | new |
| Connecting rooms | "Some accommodations can also connect with adjoining rooms" | new |
| Parking, mandatory fees | Not stated | not found |

## The Langham, Chicago

Sources: https://www.langhamhotels.com/en/the-langham/chicago/discover/hotel-at-a-glance/ · .../wellness/swimming-pool/ · .../policy/ · .../stay/. Kids Suite page not read (see Method).

| Fact | Observed 2026-11-05 | Vs page |
|---|---|---|
| Kids Suite, overview | "we will be temporarily suspending the operations of the Kid's Suite until further notice" | same (older overview still says suspended) |
| Kids Suite, dedicated page | Not read. "THE KIDS SUITE" remains in the Stay menu, status not stated | not found: "open daily" not re-confirmed |
| Cinema Suite | "111-inch screen", "seating for up to twelve people"; "subject to availability" | same; details new |
| Pool | "Our 67-foot pool"; meta description "74m2 indoor pool"; "Open daily from 6:00 a.m. to 8:00 p.m." | same; hours new |
| Pool child rules | Pool page: "Children must be accompanied by an adult aged 18 or above". Policy page: "A parent or guardian must always accompany minors under the age of 16 when visiting the fitness center or pool." | new, wording differs between official pages |
| Occupancy | Deluxe, Premier, Premier River View: "THREE GUESTS"; Club Executive, Junior Suite, Club One-Bedroom suites: "FOUR GUESTS" | new |
| Room sizes | Deluxe and Premier 516 ft²; Junior Suite 720 ft² | same ("large rooms"); sizes new |
| Child and extra-person policy | "Children 17 and under stay free in the existing bedding of a standard room or suite shared with a paying adult"; "an extra person charge will apply if there are more than 2 adults" outside Club rooms; "Rollaway beds are complimentary" | new |
| Parking | "valet parking at $88.00 per day, including in-out privileges" | new |
| Connecting rooms | Not stated | not found: "by request" not re-confirmed |
| Cribs, destination fee | Not stated | not found |
