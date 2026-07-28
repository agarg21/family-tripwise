export function createFamilyHotelPages({ esc, pageShell }) {
const sanDiegoFamilyHotels = [
  {
    name: "Bahia Resort Hotel",
    category: "Mission Bay suite/bay stay",
    area: "Mission Bay",
    priceRange: "$340-$630+",
    strengths: ["Family Suite facts are unusually visible", "One-vehicle parking is not a separate charge in the inspected FAQ", "Bay/pool/location positives recur in online review patterns"],
    tradeoffs: ["Bedding wording conflicts on the official Family Suite page", "Room age and cleanliness comments are mixed"],
    familySetup: "Official Bay Family Suite page lists 675 sq ft, sofa bed, kitchenette, balcony, two bathrooms, refrigerator, microwave, toaster, and one-vehicle self-parking; verify exact bedding and occupancy before using this as the reason to book.",
    priceNote: "Standard-room public examples; Family Suite can price higher.",
    reviewSignal: "Family positives around bay, pool, location, and staff; conflicts around room age, cleanliness, and room-to-room variability.",
    parentCheck: "Verify Family Suite availability, exact bedding, room condition, crib/rollaway policy, total price, room location, and current pool/beach operations.",
    mapQuery: "Bahia Resort Hotel San Diego",
    sources: ["BAH-1", "BAH-2", "BAH-P", "BAH-R"]
  },
  {
    name: "San Diego Mission Bay Resort",
    category: "Mission Bay pool/wading-pool resort",
    area: "Mission Bay",
    priceRange: "$375-$500+",
    strengths: ["Waterfront pool and shallow wading-pool facts are official", "Beach access and seasonal activities fit a stay-put resort question", "Good contrast against suite/kitchen urban hotels"],
    tradeoffs: ["Parking and resort fee add up quickly", "Online review patterns include crowding, beds, maintenance, and room-location noise conflicts"],
    familySetup: "Official materials list pool, shallow wading pool, beach access, seasonal activities, and rollaways where available subject to fire-code limits; exact family room layout remains room-specific.",
    priceNote: "Public examples before family room choice; parking can move the total.",
    reviewSignal: "Pool and bay positives, with conflicts around crowding, comfort, maintenance, room condition, and room-location/noise variability.",
    parentCheck: "Verify exact room/floor access, total price with parking, current pool/wading-pool operations, activity calendar, bedding requests, and cancellation terms.",
    mapQuery: "San Diego Mission Bay Resort",
    sources: ["MBR-1", "MBR-2", "MBR-P", "MBR-R"]
  },
  {
    name: "Hyatt Regency Mission Bay Spa and Marina",
    category: "Pool/waterslide-first stay",
    area: "Mission Bay",
    priceRange: "$270-$350+",
    strengths: ["Official pages list lagoon-style pools, three waterslides, hot tub, and separate children's pool area", "Room pages expose minifridge, play-yard, rollaway, and microwave-request details", "Kid enjoyment and waterslides recur in online review patterns"],
    tradeoffs: ["Official parking dollar amount was not found in the inspected pages", "Fee/value, pool temperature/size, and room variability appear in conflicts"],
    familySetup: "Official room pages list two-queen options, suites, minifridges, play yards on request, and microwaves on request for a fee in many room descriptions.",
    priceNote: "Public examples; parking amount still needs a fresh direct check.",
    reviewSignal: "Waterslide, pool, location, suite/space, and kid-enjoyment positives; conflicts around fees, parking friction, room/value variability, and immediate-area walkability.",
    parentCheck: "Verify current parking cost, waterslide height/hour rules, exact suite or room bedding, final total, cancellation, and room location relative to pool/elevator/event areas.",
    mapQuery: "Hyatt Regency Mission Bay Spa and Marina",
    sources: ["HY-1", "HY-2", "HY-3", "HY-P", "HY-R"]
  },
  {
    name: "Paradise Point Resort & Spa",
    category: "Stay-put Mission Bay resort",
    area: "Mission Bay",
    priceRange: "$240-$360+",
    strengths: ["Official amenities describe five heated pools, beach areas, marina, sports courts, miniature golf, and seasonal activities", "Large-property resort shape may help families who want to stay on property", "Multiple-pool and family-orientation positives recur"],
    tradeoffs: ["Large footprint may be helpful or annoying depending on kid age and assigned room", "Price/fee perception and room-condition variability appear in conflicts"],
    familySetup: "Bungalow-style rooms and suites need exact room verification; do not infer family layout from the property style alone.",
    priceNote: "Public examples; larger rooms, bayfront location, and parking can move higher.",
    reviewSignal: "Family orientation, multiple pools, spacious rooms, beach access, and resort-village positives; conflicts around total price, amenity value, property scale, and room condition.",
    parentCheck: "Verify room location, total with parking, current pool/restaurant/activity operations, room condition, and any active redevelopment, renovation, or property-name change before booking.",
    mapQuery: "Paradise Point Resort San Diego",
    sources: ["PP-1", "PP-P", "PP-R"]
  },
  {
    name: "Catamaran Resort Hotel and Spa",
    category: "Pacific Beach bay/beach walkability",
    area: "Pacific Beach",
    priceRange: "$395-$740+",
    strengths: ["Official pages expose studios/suites with kitchenettes and some sofa-bed language", "Bay/beach access and Pacific Beach dining can fit families who want a walkable coastal base", "Location positives recur in online review patterns"],
    tradeoffs: ["Cribs and rollaways are request-only and not guaranteed", "Older/musty-room and small-pool conflicts appear in public signals"],
    familySetup: "Official FAQ lists kitchenettes with mini refrigerator, microwave, toaster oven, and requestable kitchen items for some studios/suites; exact sofa-bed and building status need verification.",
    priceNote: "Public examples; room view, renovation status, and weekend dates can move a lot.",
    reviewSignal: "Bay/beach location, Pacific Beach convenience, pool/arcade, tropical grounds, and family beach practicality positives; conflicts around older rooms, mustiness, pool size, and resort-value expectations.",
    parentCheck: "Verify exact room/building/renovation status, parking, room layout, sofa-bed availability, crib/rollaway handling, pool/beach operations, noise exposure, and final total.",
    mapQuery: "Catamaran Resort Hotel and Spa San Diego",
    sources: ["CAT-1", "CAT-2", "CAT-P", "CAT-R"]
  },
  {
    name: "Homewood Suites San Diego Downtown/Bayside",
    category: "Suite/kitchen downtown base",
    area: "Downtown / Little Italy",
    priceRange: "$265-$350+",
    strengths: ["Official Hilton page lists all-suite rooms, in-room kitchens, free hot breakfast, connecting rooms, and cribs", "Good contrast for families who need kitchen/breakfast more than resort amenities", "Lower rough range than many resort options"],
    tradeoffs: ["No self-parking and $65 valet create car friction", "Breakfast variety/staffing, parking, noise, and maintenance appear in conflicts"],
    familySetup: "Official Hilton page lists all-suite setup, in-room kitchens, connecting rooms, cribs, outdoor pool, and nearby distance facts; exact suite walls, doors, bedding, and occupancy still need verification.",
    priceNote: "Public examples; valet cost matters if you keep a car.",
    reviewSignal: "Suite, breakfast, location, pool/workout area, and family-friendly lobby positives; conflicts around valet cost, breakfast consistency, parking friction, noise, and maintenance.",
    parentCheck: "Verify exact suite layout, occupancy, final total with valet, breakfast hours/menu, pool availability, valet wait/oversize rules, routes to first activities, and room-noise request.",
    mapQuery: "Homewood Suites San Diego Downtown Bayside",
    sources: ["HWS-1", "HWS-P", "HWS-R"]
  },
  {
    name: "LEGOLAND Hotel or Castle Hotel",
    category: "LEGOLAND-heavy North County trip",
    area: "Carlsbad / LEGOLAND",
    priceRange: "Package-priced",
    strengths: ["Official pages list themed rooms, kids sleeping area, breakfast, pool, entertainment, and in-room treasure hunt", "Can reduce morning friction when LEGOLAND is the core trip", "Strong child-theme positives appear in online review patterns"],
    tradeoffs: ["Not a clean San Diego city-base for zoo, Mission Bay, Downtown, or La Jolla days", "Package/per-person pricing must not be compared as a plain room rate"],
    familySetup: "Official pages list separate kids sleeping area in every room, Pack 'N Plays by request, and room capacity by exact room size.",
    priceNote: "Compare room, tickets, breakfast, and parking as one family total.",
    reviewSignal: "Child-theme, bunk/kids sleeping areas, breakfast convenience, activities, and park proximity positives; conflicts around value, parking cost, food quality, and whether more than one or two nights is worth it.",
    parentCheck: "Compare room-total versus package-per-person total, tickets, parking, exact capacity, breakfast crowding, pool hours, early-access rules, cancellation, and whether North County fits the rest of the itinerary.",
    mapQuery: "LEGOLAND Hotel California Carlsbad",
    sources: ["LEG-1", "LEG-2", "LEG-P", "LEG-R"]
  },
  {
    name: "Loews Coronado Bay Resort",
    category: "Coronado bay/splurge option",
    area: "Coronado",
    priceRange: "$235-$360+",
    strengths: ["Official materials describe a waterfront Coronado resort with heated pools", "Shuttle by reservation/request can matter for Coronado Village plans", "Pool/service/family amenity positives recur in online review patterns"],
    tradeoffs: ["More isolated from Coronado Village and San Diego attractions than central bases", "Parking/fees and property-condition comments appear in conflicts"],
    familySetup: "Exact room layout, connecting-room, occupancy, and family-package terms are offer/room-specific and require direct verification.",
    priceNote: "Public examples; room view, season, parking, and Coronado logistics can move the total.",
    reviewSignal: "Pool, service, family amenities, toddler/family pool enjoyment, children's pool, crib, laundry, and supervised-activity positives; conflicts around isolation, parking/fees, and property condition.",
    parentCheck: "Verify final total with parking, shuttle hours/reservation process, room/suite layout, pool/kids-program status, driving plan, and whether isolation helps or hurts the family.",
    mapQuery: "Loews Coronado Bay Resort",
    sources: ["LOEWS-1", "LOEWS-P", "LOEWS-R"]
  },
  {
    name: "La Jolla Shores Hotel",
    category: "La Jolla beachfront stay",
    area: "La Jolla Shores",
    priceRange: "$350-$550+",
    strengths: ["Beachfront location creates a distinct La Jolla trip shape", "Official room pages expose suites and limited kitchen or kitchenette setups", "Beach, location, staff, and refreshed-room positives recur in online review patterns"],
    tradeoffs: ["Current pool/deck and construction status can materially change the stay", "Official policy pages have recently conflicted on parking amounts"],
    familySetup: "Official room pages show two-queen rooms plus selected suites with sofa beds, kitchenettes, or a full kitchen; verify the exact room name because those features are not property-wide.",
    priceNote: "Recent OTA examples displayed roughly $400-$450 including taxes and fees for selected one-night dates; larger rooms and peak dates can move much higher.",
    reviewSignal: "Beach access, location, staff, and refreshed-room positives recur; construction, amenity availability, fees, and room-condition variability appear in conflicts.",
    parentCheck: "Verify current pool/deck and construction status, exact room kitchen and bedding, parking, final total, and cancellation terms.",
    mapQuery: "La Jolla Shores Hotel",
    sources: ["LJS-OFFICIAL-ROOMS", "LJS-OFFICIAL-FAQ", "LJS-OFFICIAL-POLICY", "LJS-PRICE-EXPEDIA", "LJS-REVIEWS-EXPEDIA", "LJS-REVIEWS-TRIPADVISOR"]
  },
  {
    name: "Hotel del Coronado",
    category: "Iconic Coronado beachfront splurge",
    area: "Coronado Beach",
    priceRange: "$600-$900+",
    strengths: ["Official materials expose multiple room neighborhoods and guaranteed connecting-room selection or request", "Cribs, select rollaways, heated pools, beach experiences, and an ages 4-12 kids program are documented", "Beach, setting, history, and resort-experience positives recur"],
    tradeoffs: ["The five room neighborhoods do not offer the same room or pool experience", "Crowding and value are recurring conflicts at a very high total price"],
    familySetup: "Standard neighborhoods offer rooms and suites, while Shore House and Beach Village include larger residence-style options; Shore House villas have one to three bedrooms, living areas, and full kitchens. Cribs are complimentary and rollaways fit select room types.",
    priceNote: "A recent OTA example displayed about $619 including taxes and fees for one night; premium dates, views, villas, parking, and larger family layouts can move far higher.",
    reviewSignal: "Beach, setting, history, pools, and the resort experience recur positively; room-neighborhood fit, crowding, service consistency, and value recur as conflicts.",
    parentCheck: "Choose the exact neighborhood and room first, then verify pool access, connecting-room handling, final total with parking, kids-program schedule, and cancellation terms.",
    mapQuery: "Hotel del Coronado",
    sources: ["DEL-OFFICIAL-FAQ", "DEL-OFFICIAL-STAY", "DEL-OFFICIAL-SHORE-HOUSE", "DEL-PRICE-EXPEDIA", "DEL-REVIEWS-EXPEDIA", "DEL-REVIEWS-TRIPADVISOR"]
  },
  {
    name: "The Dana on Mission Bay",
    category: "Simpler Mission Bay family base",
    area: "Mission Bay",
    priceRange: "$250-$400+",
    strengths: ["Official pages publish two heated pools, exact room capacities, and many suite layouts", "Crib, rollaway, connecting-room, refrigerator, microwave, parking, and resort-fee details are unusually clear", "Location, pools, grounds, and family-activity positives recur"],
    tradeoffs: ["There are no full kitchens", "Room condition, parking walks, and fee/value perception vary"],
    familySetup: "Standard rooms list a maximum occupancy of four; many junior suites and suites list up to six with sofa sleepers. All rooms can take a free crib, limited connecting rooms are request-only, and rooms include refrigerators and microwaves rather than kitchens.",
    priceNote: "Recent OTA examples displayed from the mid-$200s to about $325 including taxes and fees for selected one-night dates; suites and peak weekends can move higher.",
    reviewSignal: "Mission Bay location, pools, grounds, staff, and family activities recur positively; room size or condition, parking distance, and total-value concerns vary.",
    parentCheck: "Verify exact room layout and occupancy, final total with parking and resort fee, connecting request if needed, pool/activity schedule, and cancellation terms.",
    mapQuery: "The Dana on Mission Bay",
    sources: ["DANA-OFFICIAL-FAQ", "DANA-OFFICIAL-ROOMS", "DANA-PRICE-EXPEDIA", "DANA-REVIEWS-EXPEDIA", "DANA-REVIEWS-BOOKING", "DANA-REVIEWS-TRIPADVISOR"]
  },
  {
    name: "Manchester Grand Hyatt San Diego",
    category: "Downtown waterfront full-service stay",
    area: "Downtown / Seaport Village",
    priceRange: "$300-$450+",
    strengths: ["Official room pages publish connecting options and multiple family-suite layouts", "Downtown waterfront position fits Seaport Village and Embarcadero days", "Views, location, and large-hotel convenience recur positively"],
    tradeoffs: ["The second rooftop pool is under renovation and the official FAQ says only Coastline Pool is operating", "A large convention-hotel footprint and room renovation status can change the experience"],
    familySetup: "Official pages list a two-double connecting room, family suites with sleeper sofas or connecting bedrooms, minifridges, play yards on request, and microwaves in many suites; exact occupancy and connection still depend on room type.",
    priceNote: "Recent OTA examples displayed about $330-$340 including taxes and fees for one night; family suites, parking, and high-demand Downtown dates can move higher.",
    reviewSignal: "Bay views, Downtown access, rooms, and hotel scale recur positively; renovation status, pool expectations, club or service consistency, and value recur as conflicts.",
    parentCheck: "Verify a renovated room, exact connecting or suite setup, current pool access, destination fee, parking, final total, and cancellation terms.",
    mapQuery: "Manchester Grand Hyatt San Diego",
    sources: ["MGH-OFFICIAL-MAIN", "MGH-OFFICIAL-ROOMS", "MGH-OFFICIAL-FAQ", "MGH-OFFICIAL-RENOVATION", "MGH-PRICE-EXPEDIA", "MGH-REVIEWS-EXPEDIA", "MGH-REVIEWS-BOOKING", "MGH-REVIEWS-TRIPADVISOR"]
  }
];

const sanDiegoHotelSources = [
  ["Bahia Resort Hotel FAQ", "https://www.bahiahotel.com/faqs"],
  ["Bahia Bay Family Suite", "https://www.bahiahotel.com/rooms/bay-family-suite"],
  ["San Diego Mission Bay Resort amenities", "https://www.missionbayresort.com/resort-amenities/"],
  ["San Diego Mission Bay Resort FAQ", "https://www.missionbayresort.com/faq/"],
  ["Hyatt Regency Mission Bay", "https://www.hyatt.com/hyatt-regency/en-US/sanis-hyatt-regency-mission-bay-spa-and-marina"],
  ["Hyatt Mission Bay rooms", "https://www.hyatt.com/hyatt-regency/en-US/sanis-hyatt-regency-mission-bay-spa-and-marina/rooms"],
  ["Paradise Point amenities", "https://paradisepoint.com/resort/beach-resort-amenities/"],
  ["Catamaran Resort FAQ", "https://www.catamaranresort.com/faqs"],
  ["Catamaran rooms", "https://www.catamaranresort.com/rooms/rooms-overview"],
  ["Homewood Suites Downtown/Bayside", "https://www.hilton.com/en/hotels/sanhahw-homewood-suites-san-diego-downtown-bayside/"],
  ["LEGOLAND Hotel", "https://www.legoland.com/california/places-to-stay/legoland-hotel/"],
  ["LEGOLAND hotel parking support", "https://california-support.legoland.com/hc/en-us/articles/360001573591-Is-parking-included-with-my-stay-at-the-LEGOLAND-California-Hotel-or-Castle-Hotel"],
  ["Loews Coronado Bay Resort", "https://www.loewshotels.com/coronado-bay-resort"],
  ["La Jolla Shores Hotel accommodations", "https://www.ljshoreshotel.com/accommodations/"],
  ["La Jolla Shores Hotel resort policies", "https://www.ljshoreshotel.com/resort-policies/"],
  ["La Jolla Shores price and verified-review context", "https://www.expedia.com/La-Jolla-Hotels-La-Jolla-Shores-Hotel.h25973.Hotel-Information"],
  ["La Jolla Shores recent-review context", "https://www.tripadvisor.com/Hotel_Review-g32578-d217262-Reviews-La_Jolla_Shores_Hotel-La_Jolla_San_Diego_California.html"],
  ["Hotel del Coronado FAQ", "https://www.hoteldel.com/faq/"],
  ["Hotel del Coronado rooms", "https://www.hoteldel.com/stay/"],
  ["Hotel del Coronado price and verified-review context", "https://www.expedia.com/Coronado-Hotels-Hotel-Del-Coronado.h7496.Hotel-Information"],
  ["Hotel del Coronado recent-review context", "https://www.tripadvisor.com/Hotel_Review-g32250-d125137-Reviews-Hotel_Del_Coronado-Coronado_California.html"],
  ["The Dana on Mission Bay FAQ", "https://thedana.com/san-diego-hotel/faq/"],
  ["The Dana on Mission Bay rooms", "https://thedana.com/san-diego-accommodations/"],
  ["The Dana price and verified-review context", "https://www.expedia.com/San-Diego-Hotels-The-Dana-On-Mission-Bay.h40953.Hotel-Information"],
  ["The Dana recent-review context", "https://www.booking.com/reviews/us/hotel/the-dana-on-mission-bay.html"],
  ["The Dana additional review context", "https://www.tripadvisor.com/Hotel_Review-g60750-d83646-Reviews-The_Dana_on_Mission_Bay-San_Diego_California.html"],
  ["Manchester Grand Hyatt San Diego", "https://www.hyatt.com/grand-hyatt/en-US/sanrs-manchester-grand-hyatt-san-diego"],
  ["Manchester Grand Hyatt rooms", "https://www.hyatt.com/grand-hyatt/en-US/sanrs-manchester-grand-hyatt-san-diego/rooms"],
  ["Manchester Grand Hyatt FAQ", "https://www.hyatt.com/grand-hyatt/en-US/sanrs-manchester-grand-hyatt-san-diego/faqs"],
  ["Manchester Grand Hyatt renovation status", "https://www.hyatt.com/grand-hyatt/en-US/sanrs-manchester-grand-hyatt-san-diego/renovation"],
  ["Manchester Grand Hyatt price and verified-review context", "https://www.expedia.com/San-Diego-Hotels-Manchester-Grand-Hyatt-San-Diego.h12073.Hotel-Information"],
  ["Manchester Grand Hyatt recent-review context", "https://www.booking.com/reviews/us/hotel/manchester-grand-hyatt-san-diego.html"],
  ["Manchester Grand Hyatt additional review context", "https://www.tripadvisor.com/Hotel_Review-g60750-d80219-Reviews-Manchester_Grand_Hyatt_San_Diego-San_Diego_California.html"]
];

function googleMapsUrl(query) {
  return `https://www.google.com/maps/search/?api=1&amp;query=${encodeURIComponent(query)}`;
}

const sanDiegoMyMapsEmbedUrl = "https://www.google.com/maps/d/embed?mid=19tptDfcCGkrLLpofrO8ponPdeCefQKc&amp;ll=32.823313151707154%2C-117.28066802355525&amp;z=13";
const sanDiegoMyMapsViewUrl = "https://www.google.com/maps/d/viewer?mid=19tptDfcCGkrLLpofrO8ponPdeCefQKc&amp;ll=32.823313151707154%2C-117.28066802355525&amp;z=13";

function sanDiegoFamilyHotelPage() {
  const hotels = sanDiegoFamilyHotels;
  const hotelCards = hotels.map((hotel) => `          <article class="detail-card hotel-card">
            <p class="eyebrow">${esc(hotel.category)}</p>
            <h3>${esc(hotel.name)}</h3>
            <dl class="hotel-facts">
              <div><dt>Area</dt><dd>${esc(hotel.area)}</dd></div>
              <div><dt>Rough nightly range</dt><dd>${esc(hotel.priceRange)}</dd></div>
              <div><dt>Map</dt><dd><a href="${googleMapsUrl(hotel.mapQuery)}">Open in Google Maps</a></dd></div>
            </dl>
            <section><h4>Why it made the shortlist</h4><ul>${hotel.strengths.slice(0, 2).map((item) => `<li>${esc(item)}</li>`).join("")}</ul></section>
            <section><h4>Room and family setup</h4><p>${esc(hotel.familySetup)}</p></section>
            <section><h4>Themes in sampled online reviews</h4><p>${esc(hotel.reviewSignal)}</p></section>
            <section><h4>Price context and key check</h4><p>${esc(hotel.priceNote)} ${esc(hotel.parentCheck)}</p></section>
          </article>`).join("\n");

  const comparisonRows = hotels.map((hotel) => `              <tr>
                <td>${esc(hotel.name)}</td>
                <td>${esc(hotel.category)}</td>
                <td>${esc(hotel.area)}</td>
                <td>${esc(hotel.priceRange)}</td>
                <td><a href="${googleMapsUrl(hotel.mapQuery)}">Map</a></td>
                <td>${esc(hotel.parentCheck.split(".")[0])}.</td>
              </tr>`).join("\n");

  const itemListJson = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "San Diego family hotel options",
    itemListElement: hotels.map((hotel, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: hotel.name,
      description: `${hotel.category}; rough nightly range ${hotel.priceRange}`
    }))
  };

  const faqJson = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is the best family hotel in San Diego?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "There is no single best family hotel for every trip. Compare the room setup, pool/water value, rough nightly range, breakfast or kitchen needs, activity routes, and exact total for your dates before choosing."
        }
      },
      {
        "@type": "Question",
        name: "Should families stay near Mission Bay, Downtown, Coronado, or LEGOLAND?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Mission Bay can fit pool and bay-focused trips, Downtown or Little Italy can fit suite and urban-access trips, Coronado can fit a bay or splurge stay, and LEGOLAND-area hotels fit trips where the park is the main anchor. Exact hotel, route, price, and room checks still matter."
        }
      },
      {
        "@type": "Question",
        name: "Are the price ranges on this page booking quotes?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. They are rough public examples checked July 21, 2026. Families should verify the final all-in total, taxes, parking, breakfast, cancellation terms, and exact room type before booking."
        }
      }
    ]
  };

  const body = `    <main>
      <section class="page-hero hotel-hero">
        <div class="container">
          <p class="eyebrow">San Diego family hotels</p>
          <h1>Top Family Hotels in San Diego: 12 Options by Trip Style</h1>
          <p>Compare 12 San Diego family hotels by pool and beach access, room setup, breakfast or kitchen needs, approximate nightly price, location, and themes from sampled online reviews.</p>
        </div>
      </section>
      <section class="container trust-panel" aria-label="Review status">
        <p><strong>Hotel facts and review sources checked:</strong> July 21, 2026</p>
        <p>Approximate prices are planning ranges. Compare the final total for your dates, room type, occupancy, taxes, and parking before booking.</p>
      </section>
      <section class="container media-section">
        <figure class="licensed-photo">
          <img src="https://commons.wikimedia.org/wiki/Special:Redirect/file/21a-san-diego-mission-bay.jpg" alt="Mission Bay in San Diego viewed from above with bay water, islands, roads, and nearby neighborhoods." loading="eager" decoding="async">
          <figcaption>Photo: Alfred Twu, Wikimedia Commons, CC0. <a href="https://commons.wikimedia.org/wiki/File:21a-san-diego-mission-bay.jpg">License and source</a>.</figcaption>
        </figure>
      </section>
      <section class="band intro-band">
        <div class="container answer-grid">
          <div>
            <p class="eyebrow">Short answer</p>
            <h2>Start with the kind of trip you want</h2>
            <p>For Mission Bay water time, compare the six bay resorts by pool, room setup, and total price. Use La Jolla Shores for a beach-first La Jolla stay, Homewood or Manchester for two different Downtown bases, LEGOLAND hotels for a park-centered trip, and Hotel del or Loews for two very different Coronado stays.</p>
            <p><a class="text-link" href="../where-to-stay/san-diego-with-kids.html">Compare San Diego stay areas first</a></p>
          </div>
          <dl class="snapshot">
            <div><dt>Hotels covered</dt><dd>12 options</dd></div>
            <div><dt>Price format</dt><dd>Rough nightly range, not a quote</dd></div>
            <div><dt>Online reviews</dt><dd>Paraphrased themes from a small public sample</dd></div>
            <div><dt>Location view</dt><dd>Shared cluster map plus direct links for all 12 hotels</dd></div>
          </dl>
        </div>
      </section>
      <section class="container page-section rank-ready-section">
        <div class="section-heading">
          <p class="eyebrow">Category picks</p>
          <h2>Pick the closest trip style</h2>
        </div>
        <div class="quick-pick-grid hotel-pick-grid">
          <article class="quick-pick"><span>Mission Bay water time</span><strong>Six different stay shapes</strong><p>Start with Bahia for a family suite, Mission Bay Resort for a wading pool, Hyatt for waterslides, Paradise Point for scale, Catamaran for Pacific Beach access, or The Dana for clearer room-capacity details.</p></article>
          <article class="quick-pick"><span>Bay plus Pacific Beach</span><strong>Catamaran Resort</strong><p>Compare when bay access and nearby food matter, with careful room-building and nighttime-noise checks.</p></article>
          <article class="quick-pick"><span>Downtown base</span><strong>Homewood or Manchester Grand Hyatt</strong><p>Choose Homewood for suite, kitchen, and breakfast function; Manchester for a large full-service waterfront hotel, after checking renovation and pool status.</p></article>
          <article class="quick-pick"><span>LEGOLAND-heavy trip</span><strong>LEGOLAND Hotel/Castle</strong><p>Use when the park is the anchor; compare package, tickets, and parking as one total.</p></article>
          <article class="quick-pick"><span>Coronado resort trip</span><strong>Hotel del or Loews</strong><p>Choose Hotel del for the iconic beachfront experience or Loews for a more isolated bay resort; price the full stay before deciding.</p></article>
          <article class="quick-pick"><span>La Jolla beach trip</span><strong>La Jolla Shores Hotel</strong><p>Compare for direct beach access, but verify current construction, pool/deck operations, and the exact room setup.</p></article>
        </div>
      </section>
      <section class="band">
        <div class="container">
          <div class="section-heading">
            <p class="eyebrow">Comparison</p>
            <h2>Quick hotel comparison</h2>
          </div>
          <p class="review-label">Approximate nightly prices come from public examples checked July 21, 2026. Use them to set a budget, then compare the final total for the same dates and room setup.</p>
          <div class="comparison-scroll">
            <table class="comparison-table hotel-comparison">
              <thead><tr><th>Hotel</th><th>Best starting point for</th><th>Area</th><th>Approx. nightly price</th><th>Map</th><th>Most important check</th></tr></thead>
              <tbody>
${comparisonRows}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      <section class="container page-section">
        <div class="section-heading">
          <p class="eyebrow">Map check</p>
          <h2>Use the shared Google map to compare clusters</h2>
        </div>
        <div class="google-map-panel">
          <iframe class="google-my-map" title="Family Tripwise San Diego family hotels and kid activity map" src="${sanDiegoMyMapsEmbedUrl}" loading="lazy" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>
        </div>
        <p class="review-label">Use the shared map to understand the main hotel and activity clusters. The four newly added hotels may not yet appear as shared-map pins, so use each table row's direct hotel map link for the complete 12-hotel set.</p>
        <p><a class="text-link" href="${sanDiegoMyMapsViewUrl}">Open the full Google map</a></p>
      </section>
      <section class="container page-section">
        <div class="section-heading">
          <p class="eyebrow">Hotel cards</p>
          <h2>12 options, with the useful checks up front</h2>
        </div>
        <div class="detail-card-grid hotel-card-grid">
${hotelCards}
        </div>
      </section>
      <section class="container page-section source-section">
        <div class="section-heading">
          <p class="eyebrow">Sources checked</p>
          <h2>How the hotel information was checked</h2>
        </div>
        <p>Room and amenity facts come from official hotel pages. Review notes summarize a small directional sample from public travel review and booking sites; the themes are not representative ratings, copied reviews, or firsthand stays. Prices are rough public examples, not live quotes.</p>
        <ul class="source-list">
${sanDiegoHotelSources.map(([label, href]) => `          <li><a href="${esc(href)}">${esc(label)}</a></li>`).join("\n")}
          <li><a href="https://commons.wikimedia.org/wiki/File:21a-san-diego-mission-bay.jpg">Mission Bay photo license and attribution</a></li>
          <li>Public Expedia, Hotels.com, KAYAK, Tripadvisor, Booking.com, Hyatt review, Tripster, and KidTripster pages checked July 21, 2026 for rough nightly-price and online review pattern context.</li>
        </ul>
      </section>
      <script type="application/ld+json">${JSON.stringify(itemListJson)}</script>
      <script type="application/ld+json">${JSON.stringify(faqJson)}</script>
    </main>`;

  return pageShell({
    title: "Top Family Hotels in San Diego: 12 Options by Trip Style",
    description: "Compare 12 San Diego family hotels by trip style, approximate nightly price, room setup, pools, breakfast or kitchen needs, map location, and sampled online review themes.",
    canonical: "where-to-stay/san-diego-family-hotels.html",
    body
  });
}

const lasVegasFamilyHotels = [
  {
    name: "Mandalay Bay Resort and Casino",
    category: "Pool-and-attraction resort",
    area: "South Strip",
    priceRange: "$110-$350+",
    strengths: ["The 11-acre beach complex and Shark Reef can make the hotel part of the itinerary", "Official two-queen rooms list space for four"],
    familySetup: "Official materials list 550 sq ft two-queen rooms for up to four, plus an 11-acre beach complex with a wave pool, lazy river, pools, and Shark Reef on site.",
    reviewSignal: "Beach, pool, and room-size positives recur; check-in or service waits, noise, seasonal pool limits, and value when water features are closed appear as conflicts.",
    priceNote: "Recent public low-date examples started near $110 total, while weekends, events, and larger rooms can move far higher.",
    parentCheck: "Confirm which pools and water features operate on the exact dates, room occupancy, final total, parking, and the casino-floor path.",
    mapQuery: "Mandalay Bay Resort Las Vegas"
  },
  {
    name: "Four Seasons Hotel Las Vegas",
    category: "Non-gaming luxury with Mandalay access",
    area: "South Strip",
    priceRange: "$350-$700+",
    strengths: ["Official family materials describe a non-gaming and non-smoking hotel", "Guests receive private-pool and Mandalay Beach access"],
    familySetup: "The official family page lists a private pool, Mandalay Beach access, cribs or rollaways, childproofing items, children's toiletries, books, and games; exact room occupancy still depends on room type.",
    reviewSignal: "Service, cleanliness, room space, and the calmer setting recur positively; high prices, early or seasonal pool limits, airport noise, and occasional service or condition conflicts also appear.",
    priceNote: "A recent public one-night example was about $351 total; larger rooms, weekends, dining, and parking can move the stay much higher.",
    parentCheck: "Price the full stay and verify private and Mandalay pool hours, exact bedding, parking, and whether the south-Strip location fits the plan.",
    mapQuery: "Four Seasons Hotel Las Vegas"
  },
  {
    name: "Vdara Hotel & Spa",
    category: "Central non-gaming kitchenette suite",
    area: "Center Strip / CityCenter",
    priceRange: "$150-$450+",
    strengths: ["Every official Studio is a 582 sq ft suite with a kitchenette", "The property is casino-free and smoke-free while staying close to Aria and Bellagio"],
    familySetup: "The official Studio lists a king bed, pullout queen sofa, kitchenette, dining table, and maximum occupancy of four. Larger one-bedroom layouts are available, but bedding and separation vary.",
    reviewSignal: "Room space, non-gaming atmosphere, and access toward Aria and Bellagio recur positively; empty kitchenettes until supplies are requested, small fridges, parking walks, maintenance, and fee clarity recur as conflicts.",
    priceNote: "Public examples varied from roughly $150 to more than $450 total depending on date and inventory source.",
    parentCheck: "Confirm the exact suite bedding, kitchen equipment supplied, parking route, pool season, final total, and cancellation terms.",
    mapQuery: "Vdara Hotel and Spa Las Vegas"
  },
  {
    name: "Marriott's Grand Chateau",
    category: "Multi-bedroom kitchen and laundry base",
    area: "Center Strip / Harmon Avenue",
    priceRange: "$200-$700+",
    strengths: ["Official one- to three-bedroom villas add kitchens, living space, and in-unit laundry", "The property publishes no resort fee"],
    familySetup: "Official pages list guest rooms plus one-, two-, and three-bedroom villas with kitchens or kitchenettes, living and dining space, and in-unit laundry in villas. Two pools and valet-only parking are also listed.",
    reviewSignal: "Space, kitchens, laundry, cleanliness, and central location recur positively; small or crowded pools, valet dependence, timeshare contact, noise, and limited food choices recur as conflicts.",
    priceNote: "Public examples ranged from the low $200s to roughly $700 for higher dates or larger units; villa size is the main comparison point.",
    parentCheck: "Compare the exact villa, bedrooms and baths, housekeeping cadence, valet cost and wait, final total, and cancellation terms.",
    mapQuery: "Marriott's Grand Chateau Las Vegas"
  },
  {
    name: "Tahiti Village Resort",
    category: "Off-Strip lazy-river suite",
    area: "South Las Vegas Boulevard",
    priceRange: "$130-$300+",
    strengths: ["Official one- and two-bedroom suites publish kitchenette or full-kitchen setups", "The pool, lazy river, arcade, activities, and free parking support a stay-put day"],
    familySetup: "Official pages list a 580 sq ft one-bedroom with kitchenette, a 971 sq ft one-bedroom with full kitchen, and a 1,551 sq ft two-bedroom suite, plus pool, lazy river, arcade, activities, and free parking.",
    reviewSignal: "Room space, kitchens, lazy river, pool, and the away-from-casino setting recur positively; crowding, partial pool closures, elevator or parking walks, service follow-through, room condition, and sales contact recur as conflicts.",
    priceNote: "A recent public one-night example was about $129 total; larger suites and peak pool dates can move higher.",
    parentCheck: "Verify the exact kitchen, pool and lazy-river operations, crib or Pack 'n Play availability if needed, shuttle schedule, final total, and cancellation terms.",
    mapQuery: "Tahiti Village Resort Las Vegas"
  },
  {
    name: "Hilton Vacation Club Cancun Resort Las Vegas",
    category: "Off-Strip waterslides and family space",
    area: "South Las Vegas Boulevard",
    priceRange: "$120-$320+",
    strengths: ["Hilton lists two pools and four waterslides", "Free parking and residence-style layouts can fit a car-based family trip"],
    familySetup: "Hilton lists two pools, four waterslides, free parking, non-smoking rooms, and resort residences. Hilton says cribs and confirmed connecting rooms are unavailable, while Expedia lists free cribs on request. Treat crib availability as unresolved and confirm it directly if needed.",
    reviewSignal: "Family pool and space positives appear in the small sample; resort fee, service consistency, timeshare context, room condition, and distance from main Strip stops remain the main conflicts.",
    priceNote: "A current public one-night example was about $119 total; dates and larger residences can move higher.",
    parentCheck: "Confirm the conflicting crib policy if needed, exact suite and kitchen, slide operations and rules, transport plan, final total, and cancellation terms.",
    mapQuery: "Hilton Vacation Club Cancun Resort Las Vegas"
  },
  {
    name: "Excalibur Hotel & Casino",
    category: "Themed lower-price south Strip base",
    area: "South Strip",
    priceRange: "$60-$220+",
    strengths: ["Newly renovated two-queen rooms officially list space for four", "The castle theme, arcade, and nearby Tournament of Kings can entertain younger children"],
    familySetup: "Official room pages list newly renovated 352 sq ft two-queen rooms for four and larger two-bedroom suites. Current property materials also list arcade or midway entertainment and a pool.",
    reviewSignal: "Low total, castle theme, arcade, and south-Strip access help some families; room condition varies sharply, with smoke, cleanliness, maintenance, queues, and tower or renovation status recurring as conflicts.",
    priceNote: "A recent public low-date example was about $58 total; renovated rooms, weekends, and event dates can move much higher.",
    parentCheck: "Confirm a renovated room and tower, exact pool season, casino route, final total, parking, and the newest room-condition reviews.",
    mapQuery: "Excalibur Hotel and Casino Las Vegas"
  },
  {
    name: "New York-New York Hotel & Casino",
    category: "Older-kid Strip energy",
    area: "South Strip",
    priceRange: "$80-$300+",
    strengths: ["Official pages list remodeled two-queen rooms", "The Big Apple Coaster, arcade, food, and arena access can suit older kids"],
    familySetup: "Official property pages list remodeled two-queen rooms, the Big Apple Coaster and Arcade, a seasonal pool, and walkways toward neighboring south-Strip resorts.",
    reviewSignal: "Remodeled rooms, food and entertainment density, location, and older-kid energy are positives; casino noise or smoke exposure, coaster fit and cost, pool modesty, queues, and busy public areas are conflicts.",
    priceNote: "A recent public low-date example was about $79 total; event nights and specific remodeled-room choices can move higher.",
    parentCheck: "Check coaster height and comfort, room tower, pool season, casino path, event-night price, parking, and final total.",
    mapQuery: "New York-New York Hotel and Casino Las Vegas"
  },
  {
    name: "Las Vegas Hilton at Resorts World",
    category: "Modern North Strip resort",
    area: "North Strip",
    priceRange: "$150-$350+",
    strengths: ["Official Hilton two-queen rooms sleep four", "The resort's large multi-pool complex and food choices support an on-property day"],
    familySetup: "Hilton lists two-queen rooms for four. Resorts World lists a large multi-pool complex; the Athena infinity area is 21+, so families should verify which all-ages pools are operating.",
    reviewSignal: "Modern rooms, cleanliness, pool complex, and on-property food choice recur positively; check-in lines, long internal walks, high food costs, housekeeping inconsistency, and early or seasonal pool closures recur as conflicts.",
    priceNote: "Recent public examples ranged from about $134 including fees to the high $200s before all tax, with large offer and date swings.",
    parentCheck: "Verify which all-ages pools are open, exact Hilton tower and room, internal walking, parking, final total, and cancellation terms.",
    mapQuery: "Las Vegas Hilton at Resorts World"
  },
  {
    name: "Red Rock Casino Resort & Spa",
    category: "Summerlin nature and stay-put base",
    area: "Summerlin",
    priceRange: "$220-$450+",
    strengths: ["Bowling, cinema, arcade or Kids Quest, and pool options create non-Strip downtime", "The location can pair with a Red Rock Canyon day"],
    familySetup: "Official pages list a pool for registered guests, bowling, cinema, arcade or Kids Quest, and proximity to Red Rock Canyon. Kids Quest is a separate hourly paid program with current ages and rules to verify.",
    reviewSignal: "Pool, room quality, on-site activities, and the off-Strip setting appear positively; seasonally limited pools, long hotel walks, fees or value, and Strip distance recur as conflicts.",
    priceNote: "A recent public one-night example was about $219 total; weekends and premium rooms can move higher.",
    parentCheck: "Confirm pool operations, Kids Quest ages, hours and price, room-to-amenity walking, Red Rock transport, final total, and cancellation terms.",
    mapQuery: "Red Rock Casino Resort and Spa Las Vegas"
  }
];

const lasVegasHotelSources = [
  ["Mandalay Bay rooms", "https://mandalaybay.mgmresorts.com/en/hotel.html"],
  ["Mandalay Bay property facts", "https://mandalaybay.mgmresorts.com/en/contact-us.html"],
  ["Four Seasons family amenities", "https://www.fourseasons.com/lasvegas/services-and-amenities/family/"],
  ["Vdara hotel", "https://vdara.mgmresorts.com/en.html"],
  ["Vdara Studio suite", "https://vdara.mgmresorts.com/en/hotel/studio-suite.html"],
  ["Marriott's Grand Chateau", "https://www.marriott.com/en-us/hotels/lasvg-marriotts-grand-chateau/overview/"],
  ["Marriott's Grand Chateau rooms", "https://www.marriott.com/en-us/hotels/lasvg-marriotts-grand-chateau/rooms/"],
  ["Tahiti Village suites and amenities", "https://tahitivillage.com/"],
  ["Hilton Vacation Club Cancun Resort", "https://www.hilton.com/en/hotels/lascngv-hilton-vacation-club-cancun-resort-las-vegas/"],
  ["Hilton Cancun Resort hotel information", "https://www.hilton.com/en/hotels/lascngv-hilton-vacation-club-cancun-resort-las-vegas/hotel-info/"],
  ["Excalibur rooms", "https://excalibur.mgmresorts.com/en/hotel.html"],
  ["New York-New York hotel", "https://newyorknewyork.mgmresorts.com/en.html"],
  ["New York-New York amenities", "https://newyorknewyork.mgmresorts.com/en/amenities.html"],
  ["Resorts World pools", "https://www.rwlasvegas.com/pools/"],
  ["Las Vegas Hilton rooms", "https://www.hilton.com/en/hotels/rslvhvh-resorts-world-las-vegas/rooms/las-vegas-hilton/"],
  ["Red Rock family activities", "https://redrockresort.com/see-and-do/activities/"],
  ["Red Rock pool", "https://redrockresort.com/see-and-do/pool/"],
  ["Kids Quest at Red Rock", "https://www.kidsquest.com/location/redrock/"]
];

function lasVegasFamilyHotelPage() {
  const hotels = lasVegasFamilyHotels;
  const cards = hotels.map((hotel) => `          <article class="detail-card hotel-card">
            <p class="eyebrow">${esc(hotel.category)}</p>
            <h3>${esc(hotel.name)}</h3>
            <dl class="hotel-facts">
              <div><dt>Area</dt><dd>${esc(hotel.area)}</dd></div>
              <div><dt>Rough total/night</dt><dd>${esc(hotel.priceRange)}</dd></div>
              <div><dt>Map</dt><dd><a href="${googleMapsUrl(hotel.mapQuery)}">Open in Google Maps</a></dd></div>
            </dl>
            <section><h4>Why compare it</h4><ul>${hotel.strengths.map((item) => `<li>${esc(item)}</li>`).join("")}</ul></section>
            <section><h4>Room and family setup</h4><p>${esc(hotel.familySetup)}</p></section>
            <section><h4>Themes in sampled online reviews</h4><p>${esc(hotel.reviewSignal)}</p></section>
            <section><h4>Price context and key check</h4><p>${esc(hotel.priceNote)} ${esc(hotel.parentCheck)}</p></section>
          </article>`).join("\n");

  const rows = hotels.map((hotel) => `              <tr>
                <td>${esc(hotel.name)}</td>
                <td>${esc(hotel.category)}</td>
                <td>${esc(hotel.area)}</td>
                <td>${esc(hotel.priceRange)}</td>
                <td><a href="${googleMapsUrl(hotel.mapQuery)}">Map</a></td>
                <td>${esc(hotel.parentCheck.split(".")[0])}.</td>
              </tr>`).join("\n");

  const faqs = [
    ["What is the best family hotel in Las Vegas?", "There is no single best hotel for every family. Mandalay Bay fits a water-resort trip, Vdara and Marriott's Grand Chateau fit different suite needs, Tahiti Village and Cancun Resort fit off-Strip water time, and the other options answer distinct budget, older-kid, luxury, or nature-base needs."],
    ["Should a family stay on or off the Las Vegas Strip?", "Stay on the Strip when the chosen hotel and nearby activities reduce transfers enough to outweigh casino, crowd, and walking friction. Stay off the Strip when a kitchen, parking, waterslides, a quieter reset pattern, or a Red Rock day matters more than immediate resort access."],
    ["Do these nightly ranges include resort fees and taxes?", "The ranges use public total-price examples where the source displayed taxes and mandatory fees, then widen them for date changes. Parking, larger rooms, optional purchases, and some source displays can still sit outside the example, so compare the final total for the same dates and room setup."]
  ];
  const faqJson = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(([name, text]) => ({ "@type": "Question", name, acceptedAnswer: { "@type": "Answer", text } }))
  };
  const itemListJson = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Las Vegas family hotel options",
    itemListElement: hotels.map((hotel, index) => ({ "@type": "ListItem", position: index + 1, name: hotel.name, description: `${hotel.category}; rough total per night ${hotel.priceRange}` }))
  };

  const body = `    <main>
      <section class="page-hero hotel-hero">
        <div class="container">
          <p class="eyebrow">Las Vegas family hotels</p>
          <h1>Top Family Hotels in Las Vegas: 10 Options by Trip Style</h1>
          <p>Compare ten Las Vegas family hotels by room setup, pool value, casino or non-gaming context, approximate total nightly price, location, and themes from sampled online reviews.</p>
        </div>
      </section>
      <section class="container trust-panel" aria-label="Review status">
        <p><strong>Hotel facts, prices, and review sources checked:</strong> July 22, 2026</p>
        <p>Nightly ranges are rough planning totals, not quotes. Compare the final total for your dates, room type, occupancy, parking, and cancellation terms.</p>
      </section>
      <section class="container media-section">
        <figure class="licensed-photo">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Bellagio_fountain_show_2010_las_vegas.JPG/1280px-Bellagio_fountain_show_2010_las_vegas.JPG" alt="The Bellagio fountains and Las Vegas Strip at night." width="1280" height="850" loading="eager" decoding="async">
          <figcaption>Photo: Chensiyuan via <a href="https://commons.wikimedia.org/wiki/File:Bellagio_fountain_show_2010_las_vegas.JPG">Wikimedia Commons</a>, <a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a>. No editorial changes; Wikimedia serves this resized preview.</figcaption>
        </figure>
      </section>
      <section class="band intro-band">
        <div class="container answer-grid">
          <div>
            <p class="eyebrow">Short answer</p>
            <h2>Choose the hotel that removes the biggest family friction</h2>
            <p>Mandalay Bay and Four Seasons share the strongest water-resort setup at different price and atmosphere levels. Vdara and Marriott's Grand Chateau solve two different central-suite needs. Tahiti Village and Cancun Resort trade centrality for kitchens and water time. Use the other four when themed value, older-kid energy, a modern North Strip resort, or a Summerlin base matters more.</p>
            <p><a class="text-link" href="./las-vegas-with-kids.html">Compare Las Vegas stay areas and property constraints</a></p>
          </div>
          <dl class="snapshot">
            <div><dt>Hotels covered</dt><dd>10 options</dd></div>
            <div><dt>Price format</dt><dd>Rough total/night, not a quote</dd></div>
            <div><dt>Online reviews</dt><dd>Paraphrased themes from a small public sample</dd></div>
            <div><dt>Map view</dt><dd>Direct Google Maps link for every hotel</dd></div>
          </dl>
        </div>
      </section>
      <section class="container page-section rank-ready-section">
        <div class="section-heading"><p class="eyebrow">Trip-style starts</p><h2>Pick the closest version of your trip</h2></div>
        <div class="quick-pick-grid hotel-pick-grid">
          <article class="quick-pick"><span>Pool-centered resort</span><strong>Mandalay Bay or Four Seasons</strong><p>Choose Mandalay for the full resort and attraction energy; compare Four Seasons when a non-gaming luxury base and private pool justify the higher total.</p></article>
          <article class="quick-pick"><span>Central suite</span><strong>Vdara or Grand Chateau</strong><p>Choose Vdara for a kitchenette and casino-free tower; choose Grand Chateau when separate bedrooms, a full kitchen, or laundry matters more.</p></article>
          <article class="quick-pick"><span>Off-Strip water time</span><strong>Tahiti Village or Cancun Resort</strong><p>Compare lazy river and suite choices at Tahiti against four waterslides, free parking, and a farther-south base at Cancun Resort.</p></article>
          <article class="quick-pick"><span>Themed or older-kid Strip</span><strong>Excalibur or New York-New York</strong><p>Use Excalibur for lower-price castle and arcade appeal; compare New York-New York for remodeled rooms, coaster energy, and arena access.</p></article>
          <article class="quick-pick"><span>North Strip or nature base</span><strong>Resorts World Hilton or Red Rock</strong><p>Choose Resorts World for a modern multi-pool resort; choose Red Rock when Summerlin, on-site family activities, and a canyon day shape the trip.</p></article>
        </div>
      </section>
      <section class="band">
        <div class="container">
          <div class="section-heading"><p class="eyebrow">Comparison</p><h2>Quick hotel comparison</h2></div>
          <p class="review-label">Ranges synthesize public total-price examples checked July 22, 2026. Compare the final total for the same dates, occupancy, and room setup.</p>
          <div class="comparison-scroll">
            <table class="comparison-table hotel-comparison">
              <thead><tr><th>Hotel</th><th>Best starting point for</th><th>Area</th><th>Rough total/night</th><th>Map</th><th>Most important check</th></tr></thead>
              <tbody>
${rows}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      <section class="container page-section">
        <div class="section-heading"><p class="eyebrow">Hotel cards</p><h2>10 options, with the useful checks up front</h2></div>
        <div class="detail-card-grid hotel-card-grid">
${cards}
        </div>
      </section>
      <section class="container page-section">
        <div class="section-heading"><p class="eyebrow">Common questions</p><h2>Las Vegas family hotel FAQ</h2></div>
        <div class="card-grid">
${faqs.map(([question, answer]) => `          <article class="activity-card faq-card"><h3>${esc(question)}</h3><p>${esc(answer)}</p></article>`).join("\n")}
        </div>
      </section>
      <section class="container page-section source-section">
        <div class="section-heading"><p class="eyebrow">Sources checked</p><h2>How the hotel information was checked</h2></div>
        <p>Room and amenity facts come from official property pages. Online-review notes paraphrase a small directional sample from public booking and review sites; they are not representative ratings or firsthand stays. Price ranges use volatile public examples rather than live booking quotes.</p>
        <ul class="source-list">
${lasVegasHotelSources.map(([label, href]) => `          <li><a href="${esc(href)}">${esc(label)}</a></li>`).join("\n")}
          <li><a href="https://commons.wikimedia.org/wiki/File:Bellagio_fountain_show_2010_las_vegas.JPG">Las Vegas photo source and attribution</a> by Chensiyuan; <a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0 license</a></li>
          <li>Public Expedia, Booking.com, Hotels.com, Tripadvisor, Trip.com, Hilton, and Marriott price or review pages checked July 22, 2026; exact URLs and evidence limits are recorded in the evidence pack.</li>
        </ul>
      </section>
      <script type="application/ld+json">${JSON.stringify(itemListJson)}</script>
      <script type="application/ld+json">${JSON.stringify(faqJson)}</script>
    </main>`;

  return pageShell({
    title: "Top Family Hotels in Las Vegas: 10 Options by Trip Style",
    description: "Compare 10 Las Vegas family hotels by trip style, rough total nightly price, room setup, pools, casino or non-gaming context, location, and sampled online-review themes.",
    canonical: "where-to-stay/las-vegas-family-hotels.html",
    nav: [["./las-vegas-with-kids.html", "Where to stay"], ["../things-to-do/las-vegas-with-kids.html", "Things to do"], ["../family-itinerary/las-vegas-with-kids.html", "Itinerary"]],
    body
  });
}

const chicagoFamilyHotels = [
  {
    name: "Embassy Suites by Hilton Chicago Downtown Magnificent Mile",
    category: "Two-room suite, breakfast, and pool",
    area: "Streeterville",
    priceRange: "$280-$550+",
    strengths: ["Two-room suites can separate sleep from adult downtime", "Made-to-order breakfast and an indoor pool keep two recurring family costs or needs in one place"],
    familySetup: "Hilton lists suites, made-to-order breakfast, an evening reception, indoor pool, cribs, and a daily destination charge. Children 17 and under stay free in the same suite with a parent; exact bedding and occupancy still depend on the suite.",
    reviewSignal: "The inspected sample included positive mentions of suite space, breakfast, pool, and location. It also surfaced elevator disruption, crowding, room condition, towels, and housekeeping.",
    priceNote: "A recent public example was about $282 total; larger suites, weekends, and event dates can move much higher.",
    parentCheck: "Confirm exact suite bedding and occupancy, current elevator and pool status, destination charge, parking, and final total.",
    mapQuery: "Embassy Suites Chicago Downtown Magnificent Mile"
  },
  {
    name: "Homewood Suites by Hilton Chicago-Downtown",
    category: "Kitchen, breakfast, and indoor-pool base",
    area: "River North",
    priceRange: "$210-$450+",
    strengths: ["Full kitchens and hot breakfast reduce meal setup", "An indoor pool and published connecting rooms add flexibility for longer stays"],
    familySetup: "Hilton lists a full kitchen, free hot breakfast, indoor pool, connecting rooms, and a location one block from Michigan Avenue. Confirm a true one-bedroom category when a door between sleep and living space matters.",
    reviewSignal: "The inspected sample included positive mentions of suite space, kitchen, breakfast, location, and the pool. It also surfaced dated condition, city noise, pool availability or crowding, breakfast variation, and valet waits or billing.",
    priceNote: "A recent public one-night example was about $209 total; one-bedroom categories and peak dates can move higher.",
    parentCheck: "Confirm the exact suite layout, pool status, breakfast setup, recent room condition, valet total, and final price.",
    mapQuery: "Homewood Suites by Hilton Chicago Downtown 40 East Grand"
  },
  {
    name: "Residence Inn Chicago Downtown/River North",
    category: "Kitchen and breakfast without a pool requirement",
    area: "River North",
    priceRange: "$270-$500+",
    strengths: ["Every suite has a full-size kitchen and breakfast is included", "On-site laundry and grocery-shopping service can help on a longer trip"],
    familySetup: "Marriott lists all suites, full-size kitchens, complimentary hot breakfast, on-site laundry, grocery-shopping service, and self or valet parking. Bedding, sofa-bed setup, and whether the sleeping area has a door vary by category.",
    reviewSignal: "The inspected sample included positive mentions of kitchens, breakfast, location, staff, and suite usefulness. It also surfaced room-specific city noise, kitchen supplies, the small gym, and summer value.",
    priceNote: "A recent public example was about $268 total, while a stronger-demand summer date was reported near $382.",
    parentCheck: "Confirm bedding, bedroom separation, sofa-bed setup, kitchen equipment, parking, and the final total for the same suite.",
    mapQuery: "Residence Inn Chicago Downtown River North"
  },
  {
    name: "Sable at Navy Pier Chicago, Curio Collection by Hilton",
    category: "Navy Pier-centered younger-child trip",
    area: "Navy Pier / Streeterville",
    priceRange: "$310-$650+",
    strengths: ["The hotel can put Chicago Children's Museum and pier activities at the day's starting point", "Official two-queen rooms and suites sleep four, with lake or skyline views"],
    familySetup: "Official sources list two-queen rooms and suites sleeping four, mini fridges, cribs, confirmed connecting rooms, paid breakfast, and pier parking. The property has no pool.",
    reviewSignal: "The inspected sample included positive mentions of views, room condition, and Navy Pier access. It also surfaced the long pier approach, wayfinding, parking cost, service inconsistency, and elevator disruption.",
    priceNote: "A recent public one-night example was about $311 total; pier events, views, suites, and weekends can move higher.",
    parentCheck: "Decide whether a pier base helps more than it complicates other days, then verify bedding, event calendar, parking, and final total.",
    mapQuery: "Sable at Navy Pier Chicago"
  },
  {
    name: "Swissotel Chicago",
    category: "Purpose-built Kids Suite",
    area: "New Eastside",
    priceRange: "$240-$550+",
    strengths: ["The current Kids Suite offer creates separate adult and child spaces", "The offer includes toys, games, movie night, and breakfast under stated terms"],
    familySetup: "The Kids Suite offer lists a two-room setup with a dedicated children's space and breakfast for two adults and up to two children, subject to availability. Public standard double-room inventory lists two double beds for four.",
    reviewSignal: "The inspected sample included positive mentions of views, river or lake location, room size, and staff. It also surfaced dated finishes, the experience fee, parking access, room assignment or service inconsistency, and offer availability.",
    priceNote: "A recent standard-room example was about $235 total; the Kids Suite offer and mandatory experience fee can move higher.",
    parentCheck: "Confirm the actual Kids Suite, breakfast terms, fee, parking, bedding, and final total rather than assuming a standard room includes the family setup.",
    mapQuery: "Swissotel Chicago"
  },
  {
    name: "InterContinental Chicago Magnificent Mile",
    category: "Historic indoor-pool base",
    area: "Magnificent Mile",
    priceRange: "$300-$600+",
    strengths: ["The heated junior Olympic-size indoor pool is a distinct weather-backup amenity", "Official room inventory includes two-double rooms and requestable connecting rooms or cribs"],
    familySetup: "IHG lists classic and premium rooms with two double beds or one king, connecting rooms and cribs by request, and a heated junior Olympic-size indoor pool. A temporary August 10-12, 2026 pool closure is posted.",
    reviewSignal: "The inspected sample included positive mentions of the pool, location, historic character, and staff. It also surfaced pool crowding or depth, variable rooms, maintenance details, and parking cost.",
    priceNote: "A recent public one-night example was about $305 total; larger rooms, events, and weekends can move higher.",
    parentCheck: "Check the live pool calendar and depth fit, exact two-double room, connecting request, parking, and final total.",
    mapQuery: "InterContinental Chicago Magnificent Mile"
  },
  {
    name: "Hilton Chicago",
    category: "Museum Campus and Grant Park base",
    area: "South Loop",
    priceRange: "$320-$650+",
    strengths: ["Grant Park and Museum Campus can shape the first half of the trip", "Hilton publishes two-double rooms, an indoor pool, game room, and larger family-connection layouts"],
    familySetup: "Hilton lists two-double rooms sleeping four, an indoor pool, connecting rooms, cribs, game room, and larger family-connection or specialty layouts. Standard and specialty options differ sharply in space and total price.",
    reviewSignal: "The inspected sample included positive mentions of Grant Park location, historic public spaces, pool, staff, and larger layouts. It also surfaced housekeeping consistency, dated-room variation, event-scale crowds, and parking cost.",
    priceNote: "A current public example was about $308 including taxes and fees; specialty layouts and convention dates can move far higher.",
    parentCheck: "Compare the standard room with the exact larger layout needed, then verify pool, event calendar, parking, and final total.",
    mapQuery: "Hilton Chicago 720 South Michigan Avenue"
  },
  {
    name: "Hotel Zachary Chicago, a Tribute Portfolio Hotel",
    category: "Wrigleyville and older-kid trip",
    area: "Lakeview / Wrigleyville",
    priceRange: "$360-$750+",
    strengths: ["Direct Wrigley Field positioning makes a Cubs game or concert the trip anchor", "Official inventory includes double-queen and ballpark-view categories"],
    familySetup: "Official pages list king and double-queen rooms directly across from Wrigley Field, with neighborhood dining and ballpark-view categories.",
    reviewSignal: "The inspected sample included positive mentions of Wrigley views, room condition, staff, and event convenience. It also surfaced event pricing, noise, blocked streets or rideshare friction, parking, breakfast cost, and limited cold storage.",
    priceNote: "A recent public one-night example was about $363 total; Cubs games and concerts can invalidate the low end.",
    parentCheck: "Check the Wrigley event calendar first, then bedding, refrigerator status, post-event transport, parking, and final total.",
    mapQuery: "Hotel Zachary Chicago"
  },
  {
    name: "Four Seasons Hotel Chicago",
    category: "Luxury family amenities and pool",
    area: "Gold Coast",
    priceRange: "$630-$1,200+",
    strengths: ["The current family program combines an indoor pool, child amenities, and a play space", "Two-double lake-view rooms publicly sleep four, with larger suite choices available"],
    familySetup: "Current Four Seasons materials list a 44-foot indoor pool, family programming and child amenities, complimentary dining for children under five under stated terms, and two-double lake-view rooms for four.",
    reviewSignal: "The inspected sample included positive mentions of service, pool, child amenities, views, room space, and location. It also surfaced the high total, occasional service mismatch, pool crowding, and room-layout questions.",
    priceNote: "A recent public one-night example was about $630 total; two-double rooms, suites, weekends, dining, and parking can move much higher.",
    parentCheck: "Price the exact room or suite and confirm bedding, pool timing, child-dining terms, parking, and the value of the family amenities.",
    mapQuery: "Four Seasons Hotel Chicago"
  },
  {
    name: "The Langham, Chicago",
    category: "Riverfront luxury with a larger pool",
    area: "Chicago River / River North",
    priceRange: "$600-$1,200+",
    strengths: ["The 67-foot indoor pool and a separate current Kids Suite can support an indoor reset", "Large rooms and a riverfront location can work when one central luxury base is the priority"],
    familySetup: "Langham lists a 67-foot indoor pool and connecting rooms by request. Its current dedicated Kids Suite page says the play space is open daily, while an older overview still says suspended; the Cinema Suite is separate and subject to availability.",
    reviewSignal: "The inspected sample included positive mentions of room size, river location, pool, service, and cleanliness. It also surfaced weekend pool crowding, food and parking cost, and service or climate-control inconsistency.",
    priceNote: "A recent public one-night example was about $600 total; connecting rooms, suites, club access, food, and parking can move much higher.",
    parentCheck: "Confirm the room and connection, pool child rules, current Kids Suite status and access, food plan, parking, and final total.",
    mapQuery: "The Langham Chicago"
  }
];

const chicagoHotelSources = [
  ["Embassy Suites Magnificent Mile", "https://www.hilton.com/en/hotels/chirees-embassy-suites-chicago-downtown-magnificent-mile/"],
  ["Homewood Suites Chicago-Downtown", "https://www.hilton.com/en/hotels/chihwhw-homewood-suites-chicago-downtown/"],
  ["Residence Inn River North overview", "https://www.marriott.com/en-us/hotels/chirn-residence-inn-chicago-downtown-river-north/overview/"],
  ["Residence Inn River North rooms", "https://www.marriott.com/en-us/hotels/chirn-residence-inn-chicago-downtown-river-north/rooms/"],
  ["Residence Inn River North dining", "https://www.marriott.com/en-us/hotels/chirn-residence-inn-chicago-downtown-river-north/dining/"],
  ["Sable at Navy Pier", "https://sablehotel.com/"],
  ["Sable hotel information", "https://www.hilton.com/en-gb/hotels/chipiqq-sable-at-navy-pier-chicago/hotel-info/"],
  ["Swissotel Kids Suite offer", "https://www.swissotel.com/hotels/chicago/promotions/family/swissotel-kids-suite/"],
  ["Swissotel Kids Suite room", "https://www.swissotel.com/hotels/chicago/suites/kid-friendly-suite/"],
  ["InterContinental rooms", "https://www.ihg.com/intercontinental/hotels/us/en/chicago/ordha/hoteldetail/rooms"],
  ["InterContinental amenities and pool", "https://www.ihg.com/intercontinental/hotels/us/en/chicago/ordha/hoteldetail/amenities"],
  ["Hilton Chicago rooms", "https://www.hilton.com/en/hotels/chichhh-hilton-chicago/rooms/"],
  ["Hilton Chicago amenities", "https://www.hilton.com/en/hotels/chichhh-hilton-chicago/amenities/"],
  ["Hotel Zachary rooms", "https://www.hotelzachary.com/accommodations/"],
  ["Four Seasons family guide", "https://press.fourseasons.com/chicago/trending-now/reasons-to-stay-in-chicago-with-kids/"],
  ["Four Seasons hotel facts", "https://press.fourseasons.com/chicago/hotel-facts/"],
  ["The Langham pool", "https://www.langhamhotels.com/en/the-langham/chicago/wellness/swimming-pool/"],
  ["The Langham current Kids Suite", "https://www.langhamhotels.com/en/the-langham/chicago/stay/the-kids-suite/"],
  ["The Langham hotel overview", "https://www.langhamhotels.com/en/the-langham/chicago/discover/hotel-at-a-glance/"],
  ["The Langham child policy", "https://www.langhamhotels.com/en/the-langham/chicago/policy/"]
];

function chicagoFamilyHotelPage() {
  const hotels = chicagoFamilyHotels;
  const cards = hotels.map((hotel) => `          <article class="detail-card hotel-card">
            <p class="eyebrow">${esc(hotel.category)}</p>
            <h3>${esc(hotel.name)}</h3>
            <dl class="hotel-facts">
              <div><dt>Area</dt><dd>${esc(hotel.area)}</dd></div>
              <div><dt>Rough total/night</dt><dd>${esc(hotel.priceRange)}</dd></div>
              <div><dt>Map</dt><dd><a href="${googleMapsUrl(hotel.mapQuery)}">Open in Google Maps</a></dd></div>
            </dl>
            <section><h4>Why compare it</h4><ul>${hotel.strengths.map((item) => `<li>${esc(item)}</li>`).join("")}</ul></section>
            <section><h4>Room and family setup</h4><p>${esc(hotel.familySetup)}</p></section>
            <section><h4>Themes in sampled online reviews</h4><p>${esc(hotel.reviewSignal)}</p></section>
            <section><h4>Price context and key check</h4><p>${esc(hotel.priceNote)} ${esc(hotel.parentCheck)}</p></section>
          </article>`).join("\n");

  const rows = hotels.map((hotel) => `              <tr>
                <td>${esc(hotel.name)}</td>
                <td>${esc(hotel.category)}</td>
                <td>${esc(hotel.area)}</td>
                <td>${esc(hotel.priceRange)}</td>
                <td><a href="${googleMapsUrl(hotel.mapQuery)}">Map</a></td>
                <td>${esc(hotel.parentCheck.split(".")[0])}.</td>
              </tr>`).join("\n");

  const faqs = [
    ["What is the best family hotel in Chicago?", "There is no single best hotel for every family. Embassy Suites and Homewood solve different suite needs, Sable puts Navy Pier at the door, Swissotel has a purpose-built Kids Suite, InterContinental and Hilton Chicago answer different pool and location jobs, Hotel Zachary fits a Wrigley trip, and Four Seasons or Langham serve different luxury priorities."],
    ["Which Chicago family hotels have an indoor pool?", "Embassy Suites Magnificent Mile, Homewood Suites Chicago-Downtown, InterContinental Magnificent Mile, Hilton Chicago, Four Seasons, and The Langham list indoor pools. Pool hours, closures, depth, crowding, and child rules can change; InterContinental currently posts an August 10-12, 2026 closure."],
    ["Do these Chicago hotel ranges include taxes and fees?", "The ranges start from public examples that displayed taxes and mandatory fees where stated, then widen for date and room changes. Parking, food, larger rooms, and optional purchases remain outside the range, so compare the final total for the same dates and setup."]
  ];
  const faqJson = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(([name, text]) => ({ "@type": "Question", name, acceptedAnswer: { "@type": "Answer", text } }))
  };
  const itemListJson = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Chicago family hotel options",
    itemListElement: hotels.map((hotel, index) => ({ "@type": "ListItem", position: index + 1, name: hotel.name, description: `${hotel.category}; rough total per night ${hotel.priceRange}` }))
  };

  const body = `    <main>
      <section class="page-hero hotel-hero">
        <div class="container">
          <p class="eyebrow">Chicago family hotels</p>
          <h1>Top Family Hotels in Chicago: 10 Options by Trip Style</h1>
          <p>Compare ten Chicago family hotels by room setup, breakfast or kitchen utility, indoor pool, location, approximate total nightly price, and themes from sampled online reviews.</p>
        </div>
      </section>
      <section class="container trust-panel" aria-label="Review status">
        <p><strong>Hotel facts, prices, and review sources checked:</strong> July 23, 2026</p>
        <p>Nightly ranges are rough planning totals, not quotes. Compare the final total for your dates, room type, occupancy, parking, and cancellation terms.</p>
      </section>
      <section class="container media-section">
        <figure class="licensed-photo">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Millennium_park%2Cchicago.JPG/1280px-Millennium_park%2Cchicago.JPG" alt="Millennium Park and the Chicago skyline at dusk." width="1280" height="960" loading="eager" decoding="async">
          <figcaption>Photo: Behnazkhazai via <a href="https://commons.wikimedia.org/wiki/File:Millennium_park,chicago.JPG">Wikimedia Commons</a>, <a href="https://creativecommons.org/licenses/by-sa/3.0/">CC BY-SA 3.0</a>. No editorial changes; Wikimedia serves this resized preview.</figcaption>
        </figure>
      </section>
      <section class="band intro-band">
        <div class="container answer-grid">
          <div>
            <p class="eyebrow">Short answer</p>
            <h2>Let the room setup and first two days choose the hotel</h2>
            <p>Start with Embassy Suites, Homewood, or Residence Inn when sleep separation, breakfast, or a kitchen drives the stay. Use Sable for a Navy Pier-centered trip, Swissotel for its specific Kids Suite, InterContinental for the historic pool, Hilton Chicago for Museum Campus, and Hotel Zachary for Wrigleyville. Four Seasons and Langham are the two luxury comparisons.</p>
            <p><a class="text-link" href="./chicago-with-kids.html">Compare Chicago stay areas before choosing a property</a></p>
          </div>
          <dl class="snapshot">
            <div><dt>Hotels covered</dt><dd>10 distinct options</dd></div>
            <div><dt>Price format</dt><dd>Rough total/night, not a quote</dd></div>
            <div><dt>Online reviews</dt><dd>Paraphrased themes from a small public sample</dd></div>
            <div><dt>Map view</dt><dd>Direct Google Maps link for every hotel</dd></div>
          </dl>
        </div>
      </section>
      <section class="container page-section rank-ready-section">
        <div class="section-heading"><p class="eyebrow">Trip-style starts</p><h2>Pick the closest version of your trip</h2></div>
        <div class="quick-pick-grid hotel-pick-grid">
          <article class="quick-pick"><span>Suite plus breakfast</span><strong>Embassy Suites or Homewood</strong><p>Choose Embassy for a two-room suite and made-to-order breakfast; choose Homewood when a full kitchen matters more.</p></article>
          <article class="quick-pick"><span>Kitchen without pool</span><strong>Residence Inn River North</strong><p>Use it for full kitchens, breakfast, and on-site laundry when pool time is not part of the plan.</p></article>
          <article class="quick-pick"><span>Young-child or kids-room trip</span><strong>Sable or Swissotel</strong><p>Choose Sable to start on Navy Pier; choose Swissotel only when the specific two-room Kids Suite is available and worth the total.</p></article>
          <article class="quick-pick"><span>Pool plus location</span><strong>InterContinental or Hilton Chicago</strong><p>Choose InterContinental for Magnificent Mile and its historic pool; choose Hilton Chicago for Grant Park and Museum Campus.</p></article>
          <article class="quick-pick"><span>Wrigley or luxury</span><strong>Hotel Zachary, Four Seasons, or Langham</strong><p>Use Zachary for an older-kid ballpark trip; compare Four Seasons and Langham on exact room, pool, play space, service, and full price.</p></article>
        </div>
      </section>
      <section class="band">
        <div class="container">
          <div class="section-heading"><p class="eyebrow">Comparison</p><h2>Quick hotel comparison</h2></div>
          <p class="review-label">Ranges synthesize public price examples checked July 23, 2026. Parking is separate. Compare the final total for the same dates, occupancy, and room setup.</p>
          <div class="comparison-scroll">
            <table class="comparison-table hotel-comparison">
              <thead><tr><th>Hotel</th><th>Best starting point for</th><th>Area</th><th>Rough total/night</th><th>Map</th><th>Most important check</th></tr></thead>
              <tbody>
${rows}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      <section class="container page-section">
        <div class="section-heading"><p class="eyebrow">Hotel cards</p><h2>10 options, with the useful checks up front</h2></div>
        <div class="detail-card-grid hotel-card-grid">
${cards}
        </div>
      </section>
      <section class="container page-section">
        <div class="section-heading"><p class="eyebrow">Common questions</p><h2>Chicago family hotel FAQ</h2></div>
        <div class="card-grid">
${faqs.map(([question, answer]) => `          <article class="activity-card faq-card"><h3>${esc(question)}</h3><p>${esc(answer)}</p></article>`).join("\n")}
        </div>
      </section>
      <section class="container page-section source-section">
        <div class="section-heading"><p class="eyebrow">Sources checked</p><h2>How the hotel information was checked</h2></div>
        <p>Room and amenity facts come from official property pages. Online-review notes paraphrase a small directional sample from public booking and review sites; they are not representative ratings or firsthand stays. Price ranges use volatile public examples rather than live booking quotes.</p>
        <ul class="source-list">
${chicagoHotelSources.map(([label, href]) => `          <li><a href="${esc(href)}">${esc(label)}</a></li>`).join("\n")}
          <li><a href="https://commons.wikimedia.org/wiki/File:Millennium_park,chicago.JPG">Chicago photo source and attribution</a> by Behnazkhazai; <a href="https://creativecommons.org/licenses/by-sa/3.0/">CC BY-SA 3.0 license</a></li>
          <li>Public Expedia, Booking.com, Tripadvisor, Hotels.com, KAYAK, Hilton, Marriott, IHG, Swissotel, Four Seasons, and Langham price or review pages checked July 23, 2026; exact URLs and evidence limits are recorded in the evidence pack.</li>
        </ul>
      </section>
      <script type="application/ld+json">${JSON.stringify(itemListJson)}</script>
      <script type="application/ld+json">${JSON.stringify(faqJson)}</script>
    </main>`;

  return pageShell({
    title: "Top Family Hotels in Chicago: 10 Options by Trip Style",
    description: "Compare 10 Chicago family hotels by trip style, rough total nightly price, room setup, breakfast or kitchens, indoor pools, location, and sampled online-review themes.",
    canonical: "where-to-stay/chicago-family-hotels.html",
    nav: [["./chicago-with-kids.html", "Where to stay"], ["../things-to-do/chicago-with-kids.html", "Things to do"], ["../family-itinerary/chicago-with-kids.html", "Itinerary"]],
    body
  });
}

const sanAntonioFamilyHotels = [
  {
    name: "Hyatt Regency Hill Country Resort and Villas",
    category: "Full resort and water-play trip",
    area: "West San Antonio / SeaWorld",
    priceRange: "$360-$700+",
    strengths: ["The official resort pages publish a water park, pools, and the Big Spring lagoon", "Published two-queen rooms accommodate two adults and two children"],
    familySetup: "This is a resort-led stay near SeaWorld, not a convenient base for walking the River Walk. The exact room, water-feature operating schedule, and daily drive plan still matter.",
    reviewSignal: "A recent public sample with strong family context often praised the pools, lazy river, activities, grounds, and service. It also surfaced limited midday food, crowded kid-heavy periods, no in-room microwave in some rooms, and a sand-rinse complaint.",
    priceNote: "A public one-night example was about $437 total; room category and high-demand resort dates can move higher.",
    parentCheck: "Confirm the exact room occupancy, current water-feature schedule, food hours, parking, and final total.",
    mapQuery: "Hyatt Regency Hill Country Resort and Villas",
    anchorQuery: "SeaWorld San Antonio"
  },
  {
    name: "JW Marriott San Antonio Hill Country Resort and Spa",
    category: "Largest water-complex resort comparison",
    area: "North San Antonio / TPC Parkway",
    priceRange: "$450-$850+",
    strengths: ["Marriott publishes a nine-acre water experience with a lazy river and slides", "Some public two-queen inventory accommodates five, but the exact room controls"],
    familySetup: "The resort can fill a large share of the trip by itself. It is far from Downtown, and current wristband, slide, pool, room-occupancy, and parking rules need a dated check.",
    reviewSignal: "A recent public sample often praised the water features, family activities, service, and food. Isolated reports flagged paid parking, a temporarily unavailable slide, and one bathroom-maintenance problem.",
    priceNote: "A public one-night example was about $505 total; family occupancy, weekends, and resort demand can push the total higher.",
    parentCheck: "Confirm exact occupancy, water-feature operations and wristband rules, parking, and final total.",
    mapQuery: "JW Marriott San Antonio Hill Country Resort and Spa",
    anchorQuery: "Natural Bridge Caverns"
  },
  {
    name: "Signia by Hilton La Cantera Resort and Spa",
    category: "Pools near Six Flags",
    area: "La Cantera / Northwest",
    priceRange: "$280-$600+",
    strengths: ["The property publishes five pools, including a family pool and slide", "The location is the clearest resort start for a Six Flags-led trip"],
    familySetup: "Rooms, suites, and villas differ substantially. Treat this as a pools-and-Six-Flags comparison, not a claim that every room or pool setup works for every family.",
    reviewSignal: "Recent public reviews often praised the grounds, views, pools, rooms, staff, and local shuttle. Two current reports raised pool-service or towel-availability problems, while explicit family labeling was thin.",
    priceNote: "A public one-night example was about $315 total; larger layouts and popular weekends can move higher.",
    parentCheck: "Confirm the exact room, family-pool and slide status, shuttle details, parking, and final total.",
    mapQuery: "Signia by Hilton La Cantera Resort and Spa",
    anchorQuery: "Six Flags Fiesta Texas"
  },
  {
    name: "Hyatt Vacation Club at Wild Oak Ranch",
    category: "Villa, kitchen, and lazy-river stay",
    area: "West San Antonio / SeaWorld",
    priceRange: "$260-$500+",
    strengths: ["Official inventory includes studios and one- to three-bedroom villas", "Villas publish kitchens and in-room laundry; the resort publishes pools, slides, and a lazy river"],
    familySetup: "This is a vacation-club property, and some promotional offers may involve a sales presentation. Studios and villas do not have the same kitchen, laundry, beds, or occupancy.",
    reviewSignal: "A recent family-heavy public sample often praised villa space, kitchens, pools, the lazy river, activities, and grounds. It also surfaced early restaurant closing, sales-presentation offers, firm beds, and cashless snack-purchase friction.",
    priceNote: "A public example started near $249 before taxes; the displayed range widens that into a rough planning total.",
    parentCheck: "Confirm studio versus villa, occupancy, kitchen and laundry equipment, current water features, any offer terms, and final total.",
    mapQuery: "Hyatt Vacation Club at Wild Oak Ranch",
    anchorQuery: "SeaWorld San Antonio"
  },
  {
    name: "Embassy Suites by Hilton San Antonio Riverwalk Downtown",
    category: "Two-room suite and breakfast Downtown",
    area: "Downtown / River Walk",
    priceRange: "$150-$320+",
    strengths: ["Hilton publishes two-room suites and free made-to-order breakfast", "An outdoor rooftop pool and evening reception add useful hotel-reset options"],
    familySetup: "Choose the exact suite rather than assuming every listing has the same beds or occupancy. The hotel is central, while valet parking can materially change a car-based trip.",
    reviewSignal: "A recent public sample often praised the room space, breakfast, location, and staff. It also surfaced high valet cost and occasional maintenance or service variation.",
    priceNote: "A public one-night example was about $165 total before parking; larger suites and event dates can move higher.",
    parentCheck: "Confirm exact suite beds and occupancy, breakfast timing, pool status, parking, and final total.",
    mapQuery: "Embassy Suites San Antonio Riverwalk Downtown",
    anchorQuery: "The Alamo San Antonio"
  },
  {
    name: "Homewood Suites by Hilton San Antonio-Riverwalk/Downtown",
    category: "Downtown kitchen and breakfast",
    area: "Downtown / River Walk",
    priceRange: "$145-$300+",
    strengths: ["Hilton publishes full in-suite kitchens and free hot breakfast", "The hotel offers an outdoor pool in a central River Walk location"],
    familySetup: "Studio and one-bedroom layouts solve different sleep needs. Confirm the actual door separation, beds, occupancy, kitchen equipment, and parking before treating the brand name as enough.",
    reviewSignal: "Recent public reviews often praised spacious suites, kitchens, breakfast, location, and staff. They also surfaced expensive parking, dated details, repair concerns, and isolated room-odor or cleanliness problems.",
    priceNote: "A public one-night example was about $156 total before parking; larger suites and event dates can move higher.",
    parentCheck: "Confirm studio versus one-bedroom layout, beds, kitchen equipment, pool status, parking, and final total.",
    mapQuery: "Homewood Suites San Antonio Riverwalk Downtown",
    anchorQuery: "Hemisfair San Antonio"
  },
  {
    name: "Home2 Suites by Hilton San Antonio Riverwalk",
    category: "Studio kitchen for a larger family",
    area: "Downtown / 118 Soledad Street",
    priceRange: "$135-$280+",
    strengths: ["Hilton publishes in-suite kitchens and free breakfast", "Some public two-queen-and-sofa inventory lists occupancy up to six"],
    familySetup: "This is the 118 Soledad Street Riverwalk property, not the separate Home2 Suites Downtown location. Most rooms are studios, and exact beds, occupancy, and bathroom privacy need checking.",
    reviewSignal: "A recent family-heavy public sample often praised spacious studios, kitchenette utility, location, and staff. It also surfaced basic breakfast, expensive valet parking, barn-door bathroom privacy, and a May report that the pool was under construction.",
    priceNote: "A public one-night example was about $143 total before parking; exact room and demand can move higher.",
    parentCheck: "Confirm the 118 Soledad property, exact beds and occupancy, bathroom setup, current pool operation, parking, and final total.",
    mapQuery: "Home2 Suites by Hilton San Antonio Riverwalk 118 Soledad",
    anchorQuery: "The Alamo San Antonio"
  },
  {
    name: "Drury Plaza Hotel San Antonio Riverwalk",
    category: "Included-food value Downtown",
    area: "Downtown / River Walk",
    priceRange: "$145-$300+",
    strengths: ["Drury publishes free hot breakfast and its evening 5:30 Kickback", "The property has rooftop outdoor and indoor pools plus in-room microwaves and refrigerators"],
    familySetup: "The included food can reduce meal friction, but busy breakfast, elevator, and pool periods may matter. Compare a standard room with the all-suite tower before paying.",
    reviewSignal: "A recent public sample often praised breakfast, the evening food, location, value, staff, and pools. It also surfaced slow or crowded elevators, buffet lines, pool-towel shortages, and valet cost.",
    priceNote: "A public one-night example was about $151 total before parking; suite categories and event dates can move higher.",
    parentCheck: "Confirm the exact room or suite, current food schedule, pool operations, parking, and final total.",
    mapQuery: "Drury Plaza Hotel San Antonio Riverwalk",
    anchorQuery: "Hemisfair San Antonio"
  },
  {
    name: "Hotel Contessa",
    category: "All-suite River Walk reset",
    area: "Downtown / River Walk",
    priceRange: "$180-$380+",
    strengths: ["The property publishes an all-suite layout with separate living space", "A heated rooftop pool adds a contained Downtown reset"],
    familySetup: "A suite label does not guarantee enough beds for the family. Confirm the sofa-bed or other sleeping surface, registered occupancy, and whether the living zone provides the separation needed.",
    reviewSignal: "A recent public sample often praised suite space, location, staff, and the rooftop pool. It also surfaced third-guest bedding not being prepared, no microwave, worn decor, and high parking or total price.",
    priceNote: "A public one-night example was about $192 total before parking; room category and strong-demand dates can move higher.",
    parentCheck: "Confirm exact bedding and occupancy, living-room separation, microwave need, pool status, parking, and final total.",
    mapQuery: "Hotel Contessa San Antonio",
    anchorQuery: "The Alamo San Antonio"
  },
  {
    name: "Hyatt Regency San Antonio Riverwalk",
    category: "Classic first-visit location",
    area: "Downtown / Alamo and River Walk",
    priceRange: "$180-$380+",
    strengths: ["The hotel directly connects the Alamo and River Walk planning zones", "Hyatt publishes a rooftop temperature-controlled pool"],
    familySetup: "This is a location-led option rather than a suite, kitchen, or included-breakfast solution. Check the exact two-queen room, bathroom size, event calendar, and room placement.",
    reviewSignal: "Recent public reviews often praised location, access, cleanliness, and staff. They also surfaced parking cost, Fiesta or hallway noise, smaller bathrooms, elevators, and weaker value for standard rooms.",
    priceNote: "A public one-night example was about $202 total before parking; events and room categories can move higher.",
    parentCheck: "Confirm exact beds and occupancy, current pool status, event noise, room placement, parking, and final total.",
    mapQuery: "Hyatt Regency San Antonio Riverwalk",
    anchorQuery: "The Alamo San Antonio"
  },
  {
    name: "San Antonio Marriott Rivercenter on the River Walk",
    category: "Indoor pool and Rivercenter access",
    area: "Downtown / Rivercenter",
    priceRange: "$230-$450+",
    strengths: ["Marriott publishes indoor and outdoor pools", "Direct Rivercenter access can simplify meals, weather pivots, and a first-visit route"],
    familySetup: "Published two-queen rooms accommodate four, while some larger suites differ. Convention volume, current pool operation, and expensive parking can matter as much as the map location.",
    reviewSignal: "A recent mostly general-traveler sample often praised the location, mall access, cleanliness, staff, and pool. It also surfaced high parking and total cost plus a busier convention-hotel feel.",
    priceNote: "A public one-night example was about $281 total before parking; suites, conventions, and event dates can move higher.",
    parentCheck: "Confirm exact room occupancy, current indoor and outdoor pool operation, event calendar, parking, and final total.",
    mapQuery: "San Antonio Marriott Rivercenter on the River Walk",
    anchorQuery: "LEGOLAND Discovery Center San Antonio"
  },
  {
    name: "Omni La Mansion del Rio",
    category: "Historic central River Walk stay",
    area: "Downtown / River Walk",
    priceRange: "$180-$380+",
    strengths: ["The property publishes rooms with two double beds and a heated courtyard pool", "The central location fits a compact classic-sights trip"],
    familySetup: "This is a historic, location-led hotel rather than a large-family or kitchen solution. The courtyard pool is useful for a short reset, not a resort water day.",
    reviewSignal: "A recent public sample with meaningful family context often praised the location, courtyard, pool, and staff. It also surfaced a small or shallow pool, limited pool-bar hours, valet or garage friction, and warm halls or elevators.",
    priceNote: "Public one-night examples were about $188-$191 total before parking; room and event dates can move higher.",
    parentCheck: "Confirm exact beds and occupancy, room placement, current pool operation, parking access, and final total.",
    mapQuery: "Omni La Mansion del Rio",
    anchorQuery: "The Alamo San Antonio"
  }
];

const sanAntonioHotelSources = [
  ["Hyatt Regency Hill Country overview", "https://www.hyatt.com/hyatt-regency/en-US/sanhc-hyatt-regency-hill-country-resort-and-villas"],
  ["Hyatt Regency Hill Country rooms", "https://www.hyatt.com/hyatt-regency/en-US/sanhc-hyatt-regency-hill-country-resort-and-villas/rooms"],
  ["Hyatt Regency Hill Country Big Spring lagoon", "https://www.hyatt.com/hyatt-regency/en-US/sanhc-hyatt-regency-hill-country-resort-and-villas/big-spring-lagoon"],
  ["JW Marriott San Antonio overview", "https://www.marriott.com/en-us/hotels/satjw-jw-marriott-san-antonio-hill-country-resort-and-spa/overview/"],
  ["JW Marriott San Antonio experiences", "https://www.marriott.com/en-us/hotels/satjw-jw-marriott-san-antonio-hill-country-resort-and-spa/experiences/"],
  ["Signia by Hilton La Cantera rooms", "https://www.lacanteraresort.com/accommodations/rooms/"],
  ["Signia by Hilton La Cantera pool policies", "https://www.lacanteraresort.com/resort/policies/"],
  ["Hyatt Vacation Club at Wild Oak Ranch", "https://www.hyattvacationclub.com/resorts/wild-oak-ranch"],
  ["Hyatt Vacation Club at Wild Oak Ranch rooms", "https://www.hyatt.com/en-US/hotel/texas/hyatt-vacation-club-at-wild-oak-ranch/sansh/rooms"],
  ["Embassy Suites San Antonio Riverwalk Downtown", "https://www.hilton.com/en/hotels/sateses-embassy-suites-san-antonio-riverwalk-downtown/"],
  ["Homewood Suites San Antonio-Riverwalk/Downtown", "https://www.hilton.com/en/hotels/satdnhw-homewood-suites-san-antonio-riverwalk-downtown/"],
  ["Home2 Suites San Antonio Riverwalk", "https://www.hilton.com/en/hotels/satrlht-home2-suites-san-antonio-riverwalk/"],
  ["Drury Plaza Hotel San Antonio Riverwalk", "https://www.druryhotels.com/locations/san-antonio-tx/drury-plaza-hotel-san-antonio-riverwalk"],
  ["Hotel Contessa amenities", "https://www.thehotelcontessa.com/stay/amenities/"],
  ["Hotel Contessa FAQ", "https://www.thehotelcontessa.com/our-story/faq/"],
  ["Hyatt Regency San Antonio Riverwalk", "https://www.hyatt.com/hyatt-regency/en-US/satrs-hyatt-regency-san-antonio-riverwalk"],
  ["San Antonio Marriott Rivercenter overview", "https://www.marriott.com/en-us/hotels/satrc-san-antonio-marriott-rivercenter-on-the-river-walk/overview/"],
  ["San Antonio Marriott Rivercenter experiences", "https://www.marriott.com/en-us/hotels/satrc-san-antonio-marriott-rivercenter-on-the-river-walk/experiences/"],
  ["Omni La Mansion del Rio", "https://www.omnihotels.com/hotels/san-antonio-la-mansion-del-rio"],
  ["Omni La Mansion del Rio pool", "https://www.omnihotels.com/hotels/san-antonio-la-mansion-del-rio/wellness/pool"]
];

function sanAntonioFamilyHotelPage() {
  const hotels = sanAntonioFamilyHotels;
  const hotelId = (index) => `san-antonio-hotel-${index + 1}`;
  const cards = hotels.map((hotel, index) => `          <details class="detail-card hotel-card" id="${hotelId(index)}">
            <summary style="cursor: pointer;">
              <span class="eyebrow" style="display: block;">${esc(hotel.category)}</span>
              <strong style="display: block; margin-top: 6px; font-size: 1.25rem;">${esc(hotel.name)}</strong>
              <span style="display: block; margin-top: 6px;">${esc(hotel.area)}; ${esc(hotel.priceRange)} rough total/night</span>
            </summary>
            <dl class="hotel-facts">
              <div><dt>Area</dt><dd>${esc(hotel.area)}</dd></div>
              <div><dt>Rough total/night</dt><dd>${esc(hotel.priceRange)}</dd></div>
              <div><dt>Maps</dt><dd><a href="${googleMapsUrl(hotel.mapQuery)}">Hotel map</a> · <a href="${googleMapsUrl(hotel.anchorQuery)}">${esc(hotel.anchorQuery)}</a></dd></div>
            </dl>
            <section><h4>Why compare it</h4><ul>${hotel.strengths.map((item) => `<li>${esc(item)}</li>`).join("")}</ul></section>
            <section><h4>Room and family setup</h4><p>${esc(hotel.familySetup)}</p></section>
            <section><h4>Themes in recent online reviews</h4><p>${esc(hotel.reviewSignal)}</p></section>
            <section><h4>Price context and key check</h4><p>${esc(hotel.priceNote)} ${esc(hotel.parentCheck)}</p></section>
          </details>`).join("\n");

  const rows = hotels.map((hotel, index) => `              <tr>
                <td><a href="#${hotelId(index)}">${esc(hotel.name)}</a></td>
                <td>${esc(hotel.category)}</td>
                <td>${esc(hotel.area)}</td>
                <td>${esc(hotel.priceRange)}</td>
                <td>${esc(hotel.anchorQuery)}</td>
                <td>${esc(hotel.parentCheck.split(",")[0])}.</td>
              </tr>`).join("\n");

  const faqs = [
    ["Which San Antonio family hotels have a lazy river?", "Hyatt Regency Hill Country, JW Marriott San Antonio Hill Country, and Hyatt Vacation Club at Wild Oak Ranch publish lazy-river or substantial water-complex features. Signia by Hilton La Cantera publishes five pools and a family slide instead. Confirm current operating schedules and access rules for the exact dates."],
    ["Should a family stay on the River Walk or at a San Antonio resort?", "Choose a River Walk hotel when the Alamo, boat ride, Hemisfair, and compact Downtown days lead the trip. Choose a west or north resort when pools, SeaWorld, Six Flags, or a stay-put day matter more than repeated Downtown access. Map the first two days before deciding."],
    ["Which San Antonio hotels include breakfast or a kitchen?", "Embassy Suites includes made-to-order breakfast and a two-room suite. Homewood and Home2 publish kitchens plus breakfast. Drury includes breakfast and an evening food service. Wild Oak villas publish full kitchens, while its studios differ. Confirm the exact room and current food schedule."]
  ];
  const faqJson = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(([name, text]) => ({ "@type": "Question", name, acceptedAnswer: { "@type": "Answer", text } }))
  };
  const itemListJson = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "San Antonio family hotel options",
    itemListElement: hotels.map((hotel, index) => ({ "@type": "ListItem", position: index + 1, name: hotel.name, description: `${hotel.category}; rough total per night ${hotel.priceRange}` }))
  };

  const body = `    <main>
      <section class="page-hero hotel-hero">
        <div class="container">
          <p class="eyebrow">San Antonio family hotels</p>
          <h1>Top Family Hotels in San Antonio: 12 Options by Trip Style</h1>
          <p>Compare twelve San Antonio family hotels and resorts by water features, room function, breakfast or kitchen utility, location, approximate total nightly price, and themes from recent online reviews.</p>
        </div>
      </section>
      <section class="container trust-panel" aria-label="Information freshness">
        <p><strong>Hotel facts, prices, and online-review sources checked:</strong> July 26, 2026</p>
        <p>Nightly ranges are rough planning totals, not quotes. Compare the final total for your dates, room type, occupancy, parking, current pool operations, and cancellation terms.</p>
      </section>
      <section class="container media-section">
        <figure class="licensed-photo">
          <img src="https://commons.wikimedia.org/wiki/Special:Redirect/file/The%20San%20Antonio%20River%20Walk.jpg?width=1200" srcset="https://commons.wikimedia.org/wiki/Special:Redirect/file/The%20San%20Antonio%20River%20Walk.jpg?width=640 640w, https://commons.wikimedia.org/wiki/Special:Redirect/file/The%20San%20Antonio%20River%20Walk.jpg?width=1200 1200w" sizes="(max-width: 700px) calc(100vw - 36px), 1160px" alt="The San Antonio River Walk with paths and restaurants along the water." width="1280" height="960" loading="eager" decoding="async" fetchpriority="high">
          <figcaption>Photo: Matt Harriger via <a href="https://commons.wikimedia.org/wiki/File:The_San_Antonio_River_Walk.jpg">Wikimedia Commons</a>, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC BY-SA 2.0</a>.</figcaption>
        </figure>
      </section>
      <section class="band intro-band">
        <div class="container answer-grid">
          <div>
            <p class="eyebrow">Short answer</p>
            <h2>Decide whether the hotel is the attraction</h2>
            <p>Start with Hyatt Hill Country, JW Marriott, La Cantera, or Wild Oak when water time should fill a major trip block. Use Embassy Suites for a two-room suite and breakfast Downtown; Homewood or Home2 for kitchen utility; Drury for included food; Contessa for an all-suite River Walk reset; Hyatt Regency or Omni for a classic central stay; and Marriott Rivercenter when an indoor pool and mall access matter.</p>
            <p><a class="text-link" href="./san-antonio-with-kids.html">Compare San Antonio stay areas before choosing a property</a></p>
          </div>
          <dl class="snapshot">
            <div><dt>Hotels covered</dt><dd>12 distinct options</dd></div>
            <div><dt>Price format</dt><dd>Rough total/night, not a quote</dd></div>
            <div><dt>Online reviews</dt><dd>Paraphrased themes from a small recent public sample</dd></div>
            <div><dt>Map view</dt><dd>Hotel and nearby family-anchor links</dd></div>
          </dl>
        </div>
      </section>
      <section class="container page-section rank-ready-section">
        <div class="section-heading"><p class="eyebrow">Trip-style starts</p><h2>Pick the closest version of your trip</h2></div>
        <div class="quick-pick-grid hotel-pick-grid">
          <article class="quick-pick"><span>Water-resort vacation</span><strong>Hyatt Hill Country, JW Marriott, or La Cantera</strong><p>Compare the current water features, room occupancy, distance from the rest of the itinerary, parking, and full price.</p></article>
          <article class="quick-pick"><span>Villa, kitchen, and lazy river</span><strong>Wild Oak Ranch</strong><p>Choose the exact studio or villa and understand the vacation-club context before treating it as a normal resort booking.</p></article>
          <article class="quick-pick"><span>Two rooms plus breakfast</span><strong>Embassy Suites</strong><p>Start here when Downtown access, a door between sleep zones, and made-to-order breakfast solve the main family constraints.</p></article>
          <article class="quick-pick"><span>Kitchen or larger-family studio</span><strong>Homewood or Home2</strong><p>Choose Homewood for clearer one-bedroom options; compare Home2 when a two-queen studio for up to six is the target setup.</p></article>
          <article class="quick-pick"><span>Included-food value</span><strong>Drury Plaza</strong><p>Breakfast and evening food can reduce trip friction; count elevator crowds, parking, and the exact room against that value.</p></article>
          <article class="quick-pick"><span>Classic Downtown trip</span><strong>Contessa, Hyatt Regency, Marriott Rivercenter, or Omni</strong><p>Compare suite space, indoor-pool access, River Walk location, event noise, and parking rather than treating central hotels as interchangeable.</p></article>
        </div>
      </section>
      <section class="band">
        <div class="container">
          <div class="section-heading"><p class="eyebrow">Comparison</p><h2>Quick hotel comparison</h2></div>
          <p class="review-label">Ranges start with public price examples checked July 26, 2026; upper edges are editorial planning ceilings, not observed quotes. Parking and optional purchases are separate. Compare the final total for the same dates, occupancy, and room setup.</p>
          <div class="comparison-scroll teen-comparison">
            <table class="comparison-table hotel-comparison">
              <thead><tr><th>Hotel</th><th>Best starting point for</th><th>Area</th><th>Rough total/night</th><th>Nearby family anchor</th><th>Most important check</th></tr></thead>
              <tbody>
${rows}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      <section class="container page-section">
        <div class="section-heading"><p class="eyebrow">Hotel cards</p><h2>12 options, with the useful checks up front</h2></div>
        <div class="detail-card-grid hotel-card-grid" style="grid-template-columns: 1fr;">
${cards}
        </div>
      </section>
      <section class="container page-section">
        <div class="section-heading"><p class="eyebrow">Common questions</p><h2>San Antonio family hotel FAQ</h2></div>
        <div class="card-grid">
${faqs.map(([question, answer]) => `          <article class="activity-card faq-card"><h3>${esc(question)}</h3><p>${esc(answer)}</p></article>`).join("\n")}
        </div>
      </section>
      <section class="container page-section source-section">
        <div class="section-heading"><p class="eyebrow">Sources checked</p><h2>How the hotel information was checked</h2></div>
        <p>Room and amenity facts come from official property pages. Online-review notes paraphrase a small directional sample from public booking and review pages. Family labeling was strong for some properties and thin for others, so the notes identify recurring themes and conflicts rather than claiming parent consensus. Price ranges use volatile public examples rather than live booking quotes.</p>
        <ul class="source-list">
${sanAntonioHotelSources.map(([label, href]) => `          <li><a href="${esc(href)}">${esc(label)}</a></li>`).join("\n")}
          <li><a href="https://commons.wikimedia.org/wiki/File:The_San_Antonio_River_Walk.jpg">San Antonio photo source</a> by Matt Harriger; <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC BY-SA 2.0 license</a>.</li>
          <li>Public Expedia and Booking.com price or review pages checked July 26, 2026; exact URLs, candidate decisions, sample freshness, conflicts, and evidence limits are recorded in the evidence pack.</li>
        </ul>
      </section>
      <script type="application/ld+json">${JSON.stringify(itemListJson)}</script>
      <script type="application/ld+json">${JSON.stringify(faqJson)}</script>
    </main>`;

  return pageShell({
    title: "Top Family Hotels in San Antonio: 12 Options by Trip Style",
    description: "Compare 12 San Antonio family hotels and resorts by trip style, rough total nightly price, pools and lazy rivers, room setup, breakfast or kitchens, and recent online-review themes.",
    canonical: "where-to-stay/san-antonio-family-hotels.html",
    nav: [["./san-antonio-with-kids.html", "Where to stay"], ["../things-to-do/san-antonio-with-kids.html", "Things to do"], ["../family-itinerary/san-antonio-with-kids.html", "Itinerary"]],
    body
  });
}

const newYorkCityFamilyHotels = [
  {
    name: "Hotel Beacon",
    category: "Upper West Side kitchen and larger layouts",
    area: "Upper West Side",
    priceRange: "$330-$750+",
    strengths: ["Every published studio and suite has a fully equipped kitchenette", "One- and two-bedroom layouts create clearer options for sleep separation and larger families"],
    familySetup: "Official inventory includes two-double studios, one-bedroom suites, and an 800-square-foot two-bedroom suite. Occupancy differs by category, so choose the named layout rather than assuming every room works for the same family.",
    reviewSignal: "The inspected sample favored the Upper West Side location, staff, kitchen usefulness, room size, and park or transit access. It also surfaced dated bathrooms or kitchenettes, occasional maintenance issues, and weaker value on expensive dates.",
    priceNote: "A recent public standard-room example was about $331 total; one- and two-bedroom suites can move much higher.",
    parentCheck: "Confirm the exact suite, registered occupancy, sofa-bed use, kitchen equipment, recent condition, and final total.",
    mapQuery: "Hotel Beacon New York"
  },
  {
    name: "Homewood Suites by Hilton New York/Midtown Manhattan Times Square-South",
    category: "Kitchen and breakfast near Penn Station",
    area: "Midtown South",
    priceRange: "$230-$550+",
    strengths: ["In-suite kitchens and free hot breakfast reduce two recurring family logistics", "Hilton publishes connecting rooms, cribs, guest laundry, and a rooftop terrace"],
    familySetup: "Many rooms are studios rather than true one-bedroom suites. Confirm beds, registered occupancy, and whether a door between sleep and living space matters for the trip.",
    reviewSignal: "The inspected sample favored breakfast, staff, kitchen supplies, cleanliness, location, and practical room setup. Breakfast quality varied, and exact room size or separation still mattered.",
    priceNote: "A recent public one-night example was about $226 total; two-queen, one-bedroom, and peak-date inventory can move higher.",
    parentCheck: "Confirm studio versus one-bedroom layout, beds, occupancy, breakfast setup, kitchen equipment, and final total.",
    mapQuery: "Homewood Suites Midtown Manhattan Times Square South"
  },
  {
    name: "Residence Inn by Marriott New York Manhattan/Central Park",
    category: "Two doubles, kitchenette, and breakfast",
    area: "Central Park South / Columbus Circle",
    priceRange: "$230-$550+",
    strengths: ["Public inventory includes compact two-double studios sleeping four", "Kitchenettes, free hot breakfast, on-site laundry, and high-floor views can simplify a short or longer stay"],
    familySetup: "Marriott lists all suites and kitchenettes with appliances, cookware, and utensils. Current public reviews conflict with generic kitchenette wording about whether every room has a stovetop, so verify the exact equipment.",
    reviewSignal: "The inspected sample favored views, breakfast, location, staff, and cleanliness. Small rooms and inconsistent kitchen equipment were the main conflicts.",
    priceNote: "A recent public one-night example was about $227 total; two-double, view, and strong-demand dates can move higher.",
    parentCheck: "Confirm exact beds and occupancy, room size, actual kitchenette equipment, breakfast timing, and final total.",
    mapQuery: "Residence Inn New York Manhattan Central Park"
  },
  {
    name: "Radio City Apartments",
    category: "Practical apartment for five-plus people",
    area: "Rockefeller Center / Times Square",
    priceRange: "$190-$600+",
    strengths: ["The published two-bedroom has one queen, two twins, a sofa bed, and a kitchenette", "Official capacity is five guests plus one child age 12 or under"],
    familySetup: "The two-bedroom is about 470 square feet with a dining area and daily housekeeping. It is an older practical apartment-hotel product, not a full-service resort.",
    reviewSignal: "The inspected sample favored location, kitchenette, staff, practicality, and value. Dated condition and room-level cleanliness variation were the main conflicts.",
    priceNote: "A recent public studio example was about $190 total; the two-bedroom family layout can be much higher.",
    parentCheck: "Confirm two-bedroom availability and occupancy, bed setup, kitchen equipment, elevator or room placement, and final total.",
    mapQuery: "Radio City Apartments New York"
  },
  {
    name: "Embassy Suites by Hilton New York Manhattan Times Square",
    category: "Breakfast start for a family of three",
    area: "Bryant Park / Herald Square",
    priceRange: "$220-$500+",
    strengths: ["Breakfast and an evening reception are included", "King-plus-sofa-bed studios can work for a compact family-of-three setup"],
    familySetup: "Do not assume the classic Embassy Suites two-room layout: current inventory is dominated by king rooms and king-plus-sofa-bed studios around 277-320 square feet. Hilton lists cribs among the amenities, while Expedia's public policy says cribs and rollaways are unavailable; treat the crib as a request that needs direct confirmation.",
    reviewSignal: "The inspected sample favored breakfast, evening snacks, location, staff, and some quiet-room experiences. Compact rooms, firm beds, the non-suite layout, parking confusion, and a mandatory nightly charge appeared as conflicts.",
    priceNote: "A recent public one-night example was about $221 total; views, terraces, sofa-bed categories, and event dates can move higher.",
    parentCheck: "Confirm exact room layout and occupancy, sofa bed, the crib-source conflict and rollaway policy, mandatory charge, and final total.",
    mapQuery: "Embassy Suites New York Manhattan Times Square"
  },
  {
    name: "TRYP by Wyndham New York City Times Square / Midtown",
    category: "One-room family layout for five to eight",
    area: "Penn Station / Midtown West",
    priceRange: "$210-$700+",
    strengths: ["Wyndham publishes family rooms with bunk beds", "Current public inventory exposes a premium family room with two large double beds, a bunk bed, and a sofa bed"],
    familySetup: "The family room is the reason to compare this property; a standard room is not equivalent. Current public inventory listed capacity up to eight, but the registered occupancy and every sleeping surface still need confirmation.",
    reviewSignal: "The inspected sample favored family-room capacity, room size, Penn Station access, and value. It also surfaced inconsistent cleanliness, shower control, sofa-bed comfort, breakfast, rooftop availability, and room condition.",
    priceNote: "A recent standard-room example was about $205 total, while a verified family review reported about $654 on another date.",
    parentCheck: "Confirm the exact family room and occupancy, every sleeping surface, current rooftop status, bathroom condition, and final total.",
    mapQuery: "TRYP by Wyndham New York City Times Square Midtown"
  },
  {
    name: "The Kimberly Hotel",
    category: "Spacious Midtown East one-bedroom suite",
    area: "Midtown East",
    priceRange: "$350-$850+",
    strengths: ["Most one- and two-bedroom suites are 500-600 square feet with separate living and dining areas", "Kitchenettes and private balconies are published for most suites"],
    familySetup: "Two-bedroom suites add a sofa bed and two bathrooms. Confirm the exact suite because kitchenette, balcony, bed count, and privacy differ by category.",
    reviewSignal: "The inspected sample favored suite space, kitchenettes, balconies, staff, cleanliness, and Midtown East location. It contained few negative reports, so exact view, balcony, layout, and price remain more important unknowns than a broad negative theme.",
    priceNote: "A recent public standard-room example was about $352 total; one- and two-bedroom suites can move substantially higher.",
    parentCheck: "Confirm the exact suite plan, sofa bed, balcony, kitchenette, registered occupancy, and final total.",
    mapQuery: "The Kimberly Hotel New York"
  },
  {
    name: "New York Marriott Marquis",
    category: "Times Square convenience and family connectors",
    area: "Times Square",
    priceRange: "$380-$900+",
    strengths: ["Two-double rooms put Broadway and Times Square at the door", "Published Family Connector layouts combine a king room, a two-double room, and a sofa bed"],
    familySetup: "The connector is a different and much more expensive product from a standard room. Cribs are requestable; rollaways are not available, and two double beds may feel small for older children.",
    reviewSignal: "The inspected sample favored location, room cleanliness and space, staff, and theater convenience. Smaller double beds, breakfast cost, the mandatory destination charge, and very high parking cost were conflicts.",
    priceNote: "A recent public standard-room example was about $375 total; connectors, views, events, and peak weekends can move higher.",
    parentCheck: "Confirm exact two-double or connector layout, occupancy, destination charge, breakfast plan, and final total.",
    mapQuery: "New York Marriott Marquis"
  },
  {
    name: "Conrad New York Downtown",
    category: "Separate living and sleeping space Downtown",
    area: "Battery Park City / Lower Manhattan",
    priceRange: "$470-$1,000+",
    strengths: ["The all-suite hotel publishes separate living and sleeping areas starting around 430 square feet", "Two-double suites sleep four, with connecting rooms and cribs also listed"],
    familySetup: "A Downtown base can simplify Battery Park, Oculus, ferry, and Lower Manhattan days while adding travel to a Midtown-heavy itinerary.",
    reviewSignal: "The inspected sample favored room space, separate living areas, service, cleanliness, and the calmer Downtown base. Distance from Midtown-heavy plans and the high total were the main decision conflicts.",
    priceNote: "A recent public one-night example was about $473 total; two-double, view, luxury, and connecting inventory can move higher.",
    parentCheck: "Confirm two-double versus king-and-sofa layout, pocket-door separation, occupancy, daily route, and final total.",
    mapQuery: "Conrad New York Downtown"
  },
  {
    name: "Lotte New York Palace",
    category: "Large family-suite splurge",
    area: "Midtown East / Rockefeller Center",
    priceRange: "$590-$1,500+",
    strengths: ["The 765-square-foot Palace Family Suite publishes capacity up to six", "A two-double family-suite version adds one king, two doubles, a sleeper sofa, and two bathrooms for up to eight"],
    familySetup: "The named family suite is a premium category. Standard connecting rooms are request and availability dependent and should not be treated as the same product.",
    reviewSignal: "The inspected sample favored central location, staff, comfort, views, and public spaces. One busy-period report noted short staffing and long front-desk lines; exact category and price dominate the decision.",
    priceNote: "A recent public standard-room example was about $593 total; family suites and Towers inventory can be far higher.",
    parentCheck: "Confirm named family suite versus request-only connection, bed count, occupancy, two bathrooms, charges, and final total.",
    mapQuery: "Lotte New York Palace"
  },
  {
    name: "1 Hotel Brooklyn Bridge",
    category: "Brooklyn and DUMBO base with two beds",
    area: "DUMBO / Brooklyn Heights",
    priceRange: "$660-$1,400+",
    strengths: ["The published Dumbo 2 Beds room is about 325 square feet with two double beds for four", "Connecting suite options and a seasonal outdoor pool add different premium setups"],
    familySetup: "This is a Brooklyn-first location, not the easiest base for a Midtown-heavy first trip. Pool season, child access, and the exact two-bed or connecting category require a current check.",
    reviewSignal: "The inspected sample favored DUMBO location, views, design, staff, and room comfort. Thin walls or noise, dark rooms, technology issues, crowded rooftop service, condition variation, and high price were conflicts.",
    priceNote: "A recent public one-night example was about $664 total; connecting layouts and strong-demand dates can move higher.",
    parentCheck: "Confirm two-double versus connecting layout, pool season and child access, Manhattan route, room brightness or noise, and final total.",
    mapQuery: "1 Hotel Brooklyn Bridge"
  },
  {
    name: "Four Seasons Hotel New York Downtown",
    category: "Indoor-pool luxury base",
    area: "Tribeca / World Trade Center",
    priceRange: "$900-$1,900+",
    strengths: ["The hotel publishes an indoor pool and rooms with two double beds plus one crib", "Downtown location can pair the Oculus, One World, Battery Park, and Brooklyn Bridge"],
    familySetup: "The common two-double configuration is published for two adults and one child or one adult and two children, not a default family of four. Optional rollaways are not available.",
    reviewSignal: "The recent sample favored service, cleanliness, Downtown location, room comfort, and pool. It was mostly positive and too thin for a broad consensus; current qualitative discussion also frames the pool as a lap-pool and spa environment rather than a water-play resort.",
    priceNote: "A recent public one-night example was about $904 total; suites, two rooms, dining, and peak dates can move higher.",
    parentCheck: "Confirm occupancy for the exact room, crib request, no-rollaway rule, child pool hours and fit, and final total.",
    mapQuery: "Four Seasons Hotel New York Downtown"
  }
];

const newYorkCityHotelSources = [
  ["Hotel Beacon rooms", "https://www.beaconhotel.com/rooms/"],
  ["Homewood Suites Midtown Manhattan Times Square-South", "https://www.hilton.com/en/hotels/nycmmhw-homewood-suites-new-york-midtown-manhattan-times-square-south-ny/"],
  ["Residence Inn Manhattan/Central Park overview", "https://www.marriott.com/en-us/hotels/nycpr-residence-inn-new-york-manhattan-central-park/overview/"],
  ["Residence Inn Manhattan/Central Park rooms", "https://www.marriott.com/en-us/hotels/nycpr-residence-inn-new-york-manhattan-central-park/rooms/"],
  ["Radio City Apartments two-bedroom layout", "https://www.radiocityapartments.com/en/apartments-to-rent-new-york-city/two-bedroom-apartment/"],
  ["Embassy Suites Manhattan Times Square", "https://www.hilton.com/en/hotels/nycmies-embassy-suites-new-york-manhattan-times-square/"],
  ["TRYP Times Square / Midtown", "https://www.wyndhamhotels.com/tryp/new-york-city-new-york/tryp-new-york-city-times-square-south-midtown/overview"],
  ["The Kimberly accommodations", "https://www.kimberlyhotel.com/accommodations/"],
  ["New York Marriott Marquis rooms", "https://www.marriott.com/en-us/hotels/nycmq-new-york-marriott-marquis/rooms/"],
  ["New York Marriott Marquis family connectors", "https://www.marriott.com/en-us/hotels/nycmq-new-york-marriott-marquis/rooms/premium-accommodations/"],
  ["Conrad New York Downtown suites", "https://www.hilton.com/en/hotels/nyccici-conrad-new-york-downtown/suites/"],
  ["Lotte New York Palace suites", "https://www.lottenypalace.com/suites"],
  ["Lotte New York Palace FAQ", "https://www.lottenypalace.com/faq"],
  ["1 Hotel Brooklyn Bridge rooms", "https://www.1hotels.com/brooklyn-bridge/sleep"],
  ["1 Hotel Brooklyn Bridge two-bed room", "https://www.1hotels.com/brooklyn-bridge/sleep/dumbo-2-beds"],
  ["Four Seasons New York Downtown accommodations", "https://www.fourseasons.com/newyorkdowntown/accommodations/"]
];

function newYorkCityFamilyHotelPage() {
  const hotels = newYorkCityFamilyHotels;
  const cards = hotels.map((hotel) => `          <article class="detail-card hotel-card">
            <p class="eyebrow">${esc(hotel.category)}</p>
            <h3>${esc(hotel.name)}</h3>
            <dl class="hotel-facts">
              <div><dt>Area</dt><dd>${esc(hotel.area)}</dd></div>
              <div><dt>Rough total/night</dt><dd>${esc(hotel.priceRange)}</dd></div>
              <div><dt>Map</dt><dd><a href="${googleMapsUrl(hotel.mapQuery)}">Open in Google Maps</a></dd></div>
            </dl>
            <section><h4>Why compare it</h4><ul>${hotel.strengths.map((item) => `<li>${esc(item)}</li>`).join("")}</ul></section>
            <section><h4>Room and family setup</h4><p>${esc(hotel.familySetup)}</p></section>
            <section><h4>Themes in sampled online reviews</h4><p>${esc(hotel.reviewSignal)}</p></section>
            <section><h4>Price context and key check</h4><p>${esc(hotel.priceNote)} ${esc(hotel.parentCheck)}</p></section>
          </article>`).join("\n");

  const rows = hotels.map((hotel) => `              <tr>
                <td>${esc(hotel.name)}</td>
                <td>${esc(hotel.category)}</td>
                <td>${esc(hotel.area)}</td>
                <td>${esc(hotel.priceRange)}</td>
                <td><a href="${googleMapsUrl(hotel.mapQuery)}">Map</a></td>
                <td>${esc(hotel.parentCheck.split(".")[0])}.</td>
              </tr>`).join("\n");

  const faqs = [
    ["What is the best family hotel in New York City?", "There is no single best hotel for every family. Hotel Beacon, Homewood, Residence Inn, and Radio City Apartments solve different kitchen or occupancy needs. Embassy Suites adds breakfast, TRYP has a specific large-family room, Marriott Marquis puts Broadway at the door, Conrad creates separate Downtown living space, and Four Seasons is the indoor-pool luxury comparison."],
    ["Which New York City hotels on this list work for a family of five?", "Radio City Apartments publishes a two-bedroom layout for five guests plus one child age 12 or under. TRYP publishes a larger family room, while Lotte publishes named family suites for six or eight. Hotel Beacon also has larger suites. Confirm the exact category and registered occupancy before paying."],
    ["Do these New York City hotel ranges include taxes and fees?", "The ranges start from public examples that displayed taxes and mandatory fees where stated, then widen for family room and date changes. Parking, food, optional purchases, and a second room remain outside the range, so compare the final total for the same dates and setup."]
  ];
  const faqJson = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(([name, text]) => ({ "@type": "Question", name, acceptedAnswer: { "@type": "Answer", text } }))
  };
  const itemListJson = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "New York City family hotel options",
    itemListElement: hotels.map((hotel, index) => ({ "@type": "ListItem", position: index + 1, name: hotel.name, description: `${hotel.category}; rough total per night ${hotel.priceRange}` }))
  };

  const body = `    <main>
      <section class="page-hero hotel-hero">
        <div class="container">
          <p class="eyebrow">New York City family hotels</p>
          <h1>Top Family Hotels in New York City: 12 Options by Trip Style</h1>
          <p>Compare twelve New York City family hotels by room layout, published occupancy, kitchen or breakfast utility, location, approximate total nightly price, and themes from sampled online reviews.</p>
        </div>
      </section>
      <section class="container trust-panel" aria-label="Review status">
        <p><strong>Hotel facts, prices, and review sources checked:</strong> July 25, 2026</p>
        <p>Nightly ranges are rough planning totals, not quotes. Compare the final total for your dates, room type, occupancy, parking, and cancellation terms.</p>
      </section>
      <section class="container media-section">
        <figure class="licensed-photo">
          <img src="https://commons.wikimedia.org/wiki/Special:Redirect/file/Central%20Park%20New%20York%20City%20New%20York%2023%20cropped.jpg?width=1200" srcset="https://commons.wikimedia.org/wiki/Special:Redirect/file/Central%20Park%20New%20York%20City%20New%20York%2023%20cropped.jpg?width=640 640w, https://commons.wikimedia.org/wiki/Special:Redirect/file/Central%20Park%20New%20York%20City%20New%20York%2023%20cropped.jpg?width=1200 1200w" sizes="(max-width: 700px) calc(100vw - 36px), 1160px" alt="Central Park and the New York City skyline." width="1280" height="894" loading="eager" decoding="async" fetchpriority="high">
          <figcaption>Photo: Jet Lowe / National Park Service, public domain via <a href="https://commons.wikimedia.org/wiki/File:Central_Park_New_York_City_New_York_23_cropped.jpg">Wikimedia Commons</a>.</figcaption>
        </figure>
      </section>
      <section class="band intro-band">
        <div class="container answer-grid">
          <div>
            <p class="eyebrow">Short answer</p>
            <h2>Choose the room function before the hotel brand</h2>
            <p>Start with Hotel Beacon, Homewood, Residence Inn, or Radio City Apartments when kitchen or breakfast utility leads. Use TRYP, Lotte, or a Hotel Beacon apartment when five-plus-person occupancy is the constraint. Compare Marriott Marquis for Broadway, Conrad for separate Downtown space, 1 Hotel for a Brooklyn-first trip, and Four Seasons only when the indoor pool and luxury service justify its price and occupancy limits.</p>
            <p><a class="text-link" href="./new-york-city-with-kids.html">Compare New York City stay areas before choosing a property</a></p>
          </div>
          <dl class="snapshot">
            <div><dt>Hotels covered</dt><dd>12 distinct options</dd></div>
            <div><dt>Price format</dt><dd>Rough total/night, not a quote</dd></div>
            <div><dt>Online reviews</dt><dd>Paraphrased themes from a small public sample</dd></div>
            <div><dt>Map view</dt><dd>Direct Google Maps link for every hotel</dd></div>
          </dl>
        </div>
      </section>
      <section class="container page-section rank-ready-section">
        <div class="section-heading"><p class="eyebrow">Trip-style starts</p><h2>Pick the closest version of your trip</h2></div>
        <div class="quick-pick-grid hotel-pick-grid">
          <article class="quick-pick"><span>Upper West Side kitchen</span><strong>Hotel Beacon</strong><p>Start here when Central Park and AMNH matter and a real kitchenette or larger suite is more useful than included breakfast.</p></article>
          <article class="quick-pick"><span>Lower-cost kitchen or breakfast</span><strong>Homewood, Residence Inn, or Radio City</strong><p>Compare exact room size, beds, kitchen equipment, breakfast, and route; the lowest standard-room price does not represent every family layout.</p></article>
          <article class="quick-pick"><span>Five or more people</span><strong>Radio City, TRYP, Hotel Beacon, or Lotte</strong><p>Use only the named large-family category and its published occupancy. Do not infer capacity from a hotel-wide family label.</p></article>
          <article class="quick-pick"><span>Times Square and Broadway</span><strong>Embassy Suites or Marriott Marquis</strong><p>Choose Embassy for breakfast in a compact king-and-sofa setup; choose Marriott for two doubles or a paid family connector at the center of the theater district.</p></article>
          <article class="quick-pick"><span>More space Downtown</span><strong>Conrad New York Downtown</strong><p>Separate living and sleeping areas can justify the location when Lower Manhattan anchors the plan; count the extra Midtown trips first.</p></article>
          <article class="quick-pick"><span>Brooklyn or pool splurge</span><strong>1 Hotel Brooklyn Bridge or Four Seasons Downtown</strong><p>Choose 1 Hotel for a DUMBO-first premium base; compare Four Seasons only for its indoor pool, published occupancy, and no-rollaway limits.</p></article>
        </div>
      </section>
      <section class="band">
        <div class="container">
          <div class="section-heading"><p class="eyebrow">Comparison</p><h2>Quick hotel comparison</h2></div>
          <p class="review-label">Ranges start with public total-price examples checked July 25, 2026; upper edges are editorial planning ceilings, not observed quotes. Parking and optional purchases are separate. Compare the final total for the same dates, occupancy, and room setup.</p>
          <div class="comparison-scroll">
            <table class="comparison-table hotel-comparison">
              <thead><tr><th>Hotel</th><th>Best starting point for</th><th>Area</th><th>Rough total/night</th><th>Map</th><th>Most important check</th></tr></thead>
              <tbody>
${rows}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      <section class="container page-section">
        <div class="section-heading"><p class="eyebrow">Hotel cards</p><h2>12 options, with the useful checks up front</h2></div>
        <div class="detail-card-grid hotel-card-grid">
${cards}
        </div>
      </section>
      <section class="container page-section">
        <div class="section-heading"><p class="eyebrow">Common questions</p><h2>New York City family hotel FAQ</h2></div>
        <div class="card-grid">
${faqs.map(([question, answer]) => `          <article class="activity-card faq-card"><h3>${esc(question)}</h3><p>${esc(answer)}</p></article>`).join("\n")}
        </div>
      </section>
      <section class="container page-section source-section">
        <div class="section-heading"><p class="eyebrow">Sources checked</p><h2>How the hotel information was checked</h2></div>
        <p>Room and amenity facts come from official property pages. Online-review notes paraphrase a small directional sample from public booking and review pages; most public slices did not expose a reliable family-only count, so treat the themes as general guest signals rather than parent consensus. Price ranges use volatile public examples rather than live booking quotes.</p>
        <ul class="source-list">
${newYorkCityHotelSources.map(([label, href]) => `          <li><a href="${esc(href)}">${esc(label)}</a></li>`).join("\n")}
          <li><a href="https://commons.wikimedia.org/wiki/File:Central_Park_New_York_City_New_York_23_cropped.jpg">New York City photo source</a>, Jet Lowe / National Park Service, public domain.</li>
          <li>Public Expedia and Booking.com price or review pages checked July 25, 2026; exact URLs, sample freshness, conflicts, and evidence limits are recorded in the evidence pack.</li>
        </ul>
      </section>
      <script type="application/ld+json">${JSON.stringify(itemListJson)}</script>
      <script type="application/ld+json">${JSON.stringify(faqJson)}</script>
    </main>`;

  return pageShell({
    title: "Top Family Hotels in New York City: 12 Options by Trip Style",
    description: "Compare 12 New York City family hotels by trip style, rough total nightly price, room layout, occupancy, kitchens or breakfast, location, and sampled online-review themes.",
    canonical: "where-to-stay/new-york-city-family-hotels.html",
    nav: [["./new-york-city-with-kids.html", "Where to stay"], ["../things-to-do/new-york-city-with-kids.html", "Things to do"], ["../family-itinerary/new-york-city-with-kids.html", "Itinerary"]],
    body
  });
}

  return Object.freeze({
    sanDiegoFamilyHotelPage,
    lasVegasFamilyHotelPage,
    chicagoFamilyHotelPage,
    newYorkCityFamilyHotelPage,
    sanAntonioFamilyHotelPage
  });
}
