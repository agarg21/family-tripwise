# San Diego family hotels: official facts re-read, 2026-11-14

Scope: the 12 hotels on /where-to-stay/san-diego-family-hotels.html (`sanDiegoFamilyHotels` in
tools/page-generation/family-hotel-pages.mjs), whose visible "Hotel facts checked" date was
August 17, 2026 (89 days; D39 asks for a re-read before the next re-price, due from Nov 21).

Method: official hotel or brand pages only, each read once on 2026-11-14 through WebFetch (a
model-extracted reading of the page text, not the rendered page). "Not found" means "not in the text
we could read", not "the hotel removed it". hyatt.com home and renovation pages for both Hyatts
returned robots_disallowed (not retried); their FAQ and policies pages were readable.

Status key: same / changed / not found / new / unread.

| Hotel | Source read 2026-11-14 | Observed | Vs page (Aug 17 facts) |
|---|---|---|---|
| Bahia | bahiahotel.com/faqs | "$48" daily resort fee; "does not charge for parking"; "one vehicle per guest room" | same |
| Bahia | bahiahotel.com/rooms/bay-family-suite | "675 Square Feet"; headline "3 Queen Beds, Plus a Full-Sized Sofa Bed"; body: main suite "two queen beds, a pull-out sofa", connecting room "one queen bed"; refrigerator, microwave, toaster; "two bathrooms, each with tubs"; balcony; "Self Parking for 1 Vehicle"; max occupancy not stated | changed: headline and body now agree (3 queens + sofa bed); the page's "bedding wording conflicts" line is retired |
| Mission Bay Resort | missionbayresort.com/resort-amenities/ | waterfront pool 7am-10pm; "shallow wading pool"; under-3s and not potty trained must use the children's pool; beach; Bayside Creative Corner daily crafts; "$46 USD resort charge per night, plus tax"; parking "$47 USD per vehicle" | same; kids crafts program new |
| Mission Bay Resort | missionbayresort.com/faq/ | rollaways "$35/night + tax", limited, fire code; connecting rooms "cannot guarantee"; occupancy "limited to 6 registered individuals per room"; "$46.00" fee plus tax; self parking "$47.00 per night" | same |
| Hyatt Regency Mission Bay | hyatt.com .../faqs | "multiple outdoor pools, including waterslides and hot tubs", "open year-round, weather permitting"; "A daily resort fee applies"; microwaves on request; rollaways not permitted in standard Queen rooms; slide count, children's pool, parking amount not stated | pools/slides same (count not found); home page unread (robots) |
| Hyatt Regency Mission Bay | hyatt.com .../policies | "A daily resort fee of $46.00 (subject to change)"; parking amounts not stated | same |
| Paradise Point | paradisepoint.com/resort/beach-resort-amenities/ | "five heated pools"; one mile of beach; marina; courts; 18-hole mini golf; "$46 per room, per night" amenities fee | same |
| Paradise Point | paradisepoint.com/hotel-frequently-asked-questions/ | "five heated swimming pools open from 6AM-10PM, including one adult's only pool"; parking "$49 ... per night for doorstep parking"; pack and plays complimentary, not reservable; air mattress $20 (not in double-queen rooms); "some connecting rooms"; "4 Adults per standard guestroom" | same; pack and plays, connecting rooms new |
| Catamaran | catamaranresort.com/faqs | "$46" resort fee; self-parking "$47* per day", valet "$50* per day"; cribs and rollaways on request, "cannot be guaranteed"; kitchenettes: mini refrigerator and microwave, more items by request; notice "Starting November 9, 2026 we're renovating our kitchen", restaurant "modified hours" and "limited menu", no end date | same; toaster oven not found; kitchen-renovation notice new |
| Homewood Downtown/Bayside | hilton.com .../hotel-info/ | "full in-suite kitchens"; "Free hot breakfast"; outdoor pool; connecting rooms available; cribs available; self-parking not available; valet "$65.00"; "Recently renovated" | same |
| LEGOLAND Hotel | legoland.com/california/places-to-stay/legoland-hotel/ | "Separate sleeping area for kids in every room"; hot breakfast buffet; pool "heated to 80 degrees Fahrenheit year-round"; nightly shows; treasure hunt chest; Pack 'N Plays by request; "capacity is determined by the size of the room"; early park access | same; heated 80°F and early access new |
| LEGOLAND Hotel | california-support.legoland.com parking article | not included unless passholder; self-parking $40, overnight valet $55, per night or day; Elite/Platinum free self-parking | same |
| Loews Coronado Bay | loewshotels.com .../faqs | "daily resort fee of $45 per night plus tax"; self-parking "$50 per night, plus tax"; valet "$55 per night, plus tax"; "3 heated pools"; shuttle "No reservations are necessary"; banner "guaranteed connecting rooms" (promotion) | changed: resort fee $42 (Oct 6) -> $45; parking same |
| Loews Coronado Bay | loewshotels.com .../discover/services-amenities | "Two family pools and a hot tub", "One adult pool and a hot tub"; Village shuttle and beach shuttle complimentary; "$45 plus tax per room"; no parking amounts | resort fee changed to $45; pools same (3) |
| La Jolla Shores | ljshoreshotel.com/accommodations/ | "Access to the heated pool and hot tub"; "Daily self-parking is $55"; "Resort Fee of $50 (plus taxes) per night"; room features not described in the text read | parking same ($55); "refreshed" pool and children's wading pool not found |
| La Jolla Shores | ljshoreshotel.com/faqs/ | "daily parking fee of $55"; "Parking is limited and subject to availability" | changed: FAQ now $55 (Aug 17: $45 vs $55 conflict); conflict resolved |
| Hotel del Coronado | hoteldel.com/faq/ | five neighborhoods; "guaranteed connecting rooms"; complimentary cribs; rollaways in select room types for a charge; pools "heated year-round to approximately 80–85°F"; Ocean Explorers ages 4–12; "$50 mandatory charge per room, per night"; restoration completed June 2025; parking rates not stated | same |
| The Dana | thedana.com/san-diego-hotel/faq/ | two heated pools; parking $35/night, no valet; $25 resort fee plus tax; free cribs; limited rollaways $10/night; limited connecting rooms by request; refrigerators and microwaves; no kitchens | same |
| Manchester Grand Hyatt | hyatt.com .../faqs | "Coastline Pool & Lounge is the hotel's only operational pool"; "the second rooftop pool is temporarily closed for renovation"; no reopening date; "A daily destination fee applies" (no amount) | changed: the "due in December 2026" date is no longer stated; renovation page unread (robots) |

Not re-read this run (older dates stay labelled): Hyatt Mission Bay and Manchester Grand Hyatt room
pages and home pages (robots), Catamaran rooms overview, Hotel del stay/Shore House pages, Dana rooms
page, La Jolla Shores room-level kitchen and sofa-bed details, review themes (July 18-21).

Additions from the same reads (review cycle 1): Paradise Point FAQ says "the Resort Amenities Fee ($46 per
room, per night) is included in the guestroom rate"; Mission Bay Resort FAQ says "Kids have Bayside
Creative Corner, the resort's daily activities program of crafts, games and creative projects". Dana
FAQ fees ($25 resort, $35 parking, $10 rollaway) match the Oct 8 record; its card-authorization policy
was not re-read.
