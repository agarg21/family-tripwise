import { readFileSync } from "node:fs";
import { contributorCredit } from "./contributors.mjs";
import { sanDiegoCurrentFeeNote, sanDiegoCurrentRoomNote } from "./san-diego-hotel-evidence.mjs";
import { googleHotelSample, googleOneNight, liveSample, dropDate, readReceipt, dollars, kidsText, stayRange, shortRangeCompact, shortSeen, seenText, stayEstimate } from "./google-hotel-samples.mjs";
import { weekendPrice, weekendLive } from "./weekend-hotel-samples.mjs";
import { easternDate } from "./sitemap.mjs";

export function createFamilyHotelPages({ esc, pageShell }) {
  const money = (value) => `$${value.toLocaleString("en-US")}`;
  // Q18 (2026-10-31): hotel pages that retired editorial bands show the older observed one-night
  // samples instead. Group figures are the lowest and highest observed sample (never widened).
  const sampleNumbers = (amount) => amount.match(/\d[\d,]*/g).map((value) => Number(value.replace(/,/g, "")));
  const sampleGlance = ({ id, hotels, intro, groups, caveat, basis }) => {
    const assigned = groups.flatMap((group) => group.names);
    const missing = hotels.filter((hotel) => !assigned.includes(hotel.name)).map((hotel) => hotel.name);
    if (missing.length || new Set(assigned).size !== assigned.length) throw new Error(`Sample glance must list every hotel once: ${missing.join(", ")}`);
    const items = groups.map(({ label, names }) => {
      const members = names.map((name) => {
        const hotel = hotels.find((entry) => entry.name === name);
        if (!hotel?.olderSample && !hotel?.glanceNote) throw new Error(`Sample glance hotel lacks an observed sample: ${name}`);
        return hotel;
      });
      // Las Vegas (Q18): a hotel without one exact comparable figure (glanceNote) is left out of the
      // group's figures and named in the small note instead.
      const priced = members.filter((hotel) => !hotel.glanceNote);
      if (!priced.length) throw new Error(`Sample glance group has no exact sample: ${label}`);
      const values = priced.flatMap((hotel) => sampleNumbers(hotel.olderSample.amount));
      const low = Math.min(...values);
      const high = Math.max(...values);
      const notes = members.map((hotel) => hotel.glanceNote ? `${hotel.shortName}: ${hotel.glanceNote}` : hotel.olderSample.glanceBasis ? `${hotel.shortName} ${hotel.olderSample.amount} ${hotel.olderSample.glanceBasis}` : hotel.olderSample.basis !== "total" ? `${hotel.shortName} ${hotel.olderSample.amount} is ${hotel.olderSample.basis}` : null).filter(Boolean);
      const figure = low === high ? money(low) : `${money(low)}–${money(high)}`;
      return { line: `            <li><strong>${figure}</strong> ${esc(label)} (${members.length} ${members.length === 1 ? "hotel" : "hotels"})${notes.length ? ` <small>(${esc(notes.join("; "))})</small>` : ""}</li>`, names: `<strong>${esc(label)}:</strong> ${esc(members.map((hotel) => hotel.name).join(", "))}` };
    });
    return `      <section id="${id}" class="container answer-box hotel-budget-glance" aria-label="Nightly budget at a glance">
          <p><strong>About how much a night?</strong> ${esc(intro)}</p>
          <ul>
${items.map((item) => item.line).join("\n")}
          </ul>
          <p>${esc(caveat)}</p>
          <details><summary>Hotels in each group and how the samples were collected</summary>${items.map((item) => `<p>${item.names}</p>`).join("")}<p>${esc(basis)}</p></details>
      </section>`;
  };
const sanDiegoFamilyHotels = [
  {
    name: "Bahia Resort Hotel",
    shortName: "Bahia",
    google: { prefix: "sd-bahia", title: "Bahia Resort Hotel", acrossSearches: true },
    category: "Mission Bay suite/bay stay",
    area: "Mission Bay",
    priceRange: "Check live rate",
    olderSample: { amount: "$339", source: "Expedia/Travelocity", seen: "2026-07-18", party: "2 adults" },
    strengths: ["Family Suite facts are unusually visible", "Parking carries no separate charge, with one vehicle allowed per room", "Bay/pool/location positives recur in online review patterns"],
    tradeoffs: ["Bedding wording conflicts on the official Family Suite page", "Room age and cleanliness comments are mixed"],
    familySetup: "Official Bay Family Suite page lists 675 sq ft, sofa bed, kitchenette, balcony, two bathrooms, refrigerator, microwave, toaster, and self-parking. The FAQ separately lists a $48 resort fee and says parking carries no charge, with one vehicle allowed per room; verify exact bedding and occupancy before using the suite as the reason to book.",
    priceNote: "Family Suite can price higher than a standard room.",
    reviewSignal: "Family positives around bay, pool, location, and staff; conflicts around room age, cleanliness, and room-to-room variability.",
    parentCheck: "Verify Family Suite availability, exact bedding, room condition, crib/rollaway policy, total price, room location, and current pool/beach operations.",
    mapQuery: "Bahia Resort Hotel San Diego",
    sources: ["BAH-1", "BAH-2", "BAH-P", "BAH-R"]
  },
  {
    name: "San Diego Mission Bay Resort",
    shortName: "Mission Bay Resort",
    google: { prefix: "sd-mission-bay", title: "San Diego Mission Bay Resort", acrossSearches: true },
    category: "Mission Bay pool/wading-pool resort",
    area: "Mission Bay",
    priceRange: "Check live rate",
    olderSample: { amount: "$374", source: "Expedia", seen: "2026-07-18", party: "2 adults" },
    strengths: ["Waterfront pool and shallow wading-pool facts are official", "Beach access and seasonal activities fit a stay-put resort question", "Good contrast against suite/kitchen urban hotels"],
    tradeoffs: ["Parking and resort fee add up quickly", "Online review patterns include crowding, beds, maintenance, and room-location noise conflicts"],
    familySetup: "Official materials list a pool, shallow wading pool, beach access, seasonal activities, a $46 resort fee, $47 self-parking, limited $35 rollaways, and connecting rooms that are not guaranteed; exact family room layout remains room-specific.",
    priceNote: "Room choice and $47 parking can move the total.",
    reviewSignal: "Pool and bay positives, with conflicts around crowding, comfort, maintenance, room condition, and room-location/noise variability.",
    parentCheck: "Verify exact room/floor access, total price with parking, current pool/wading-pool operations, activity calendar, bedding requests, and cancellation terms.",
    mapQuery: "San Diego Mission Bay Resort",
    sources: ["MBR-1", "MBR-2", "MBR-P", "MBR-R"]
  },
  {
    name: "Hyatt Regency Mission Bay Spa and Marina",
    shortName: "Hyatt Mission Bay",
    google: { prefix: "sd-hyatt-mb", title: "Hyatt Regency Mission Bay Spa and Marina", acrossSearches: true },
    category: "Pool/waterslide-first stay",
    area: "Mission Bay",
    priceRange: "Check live rate",
    olderSample: { amount: "$351", source: "Expedia", seen: "2026-07-18", party: null },
    strengths: ["Official pages list lagoon-style pools, three waterslides, hot tub, and separate children's pool area", "Room pages expose minifridge, play-yard, rollaway, and microwave-request details", "Kid enjoyment and waterslides recur in online review patterns"],
    tradeoffs: ["Official parking dollar amount was not found in the inspected pages", "Fee/value, pool temperature/size, and room variability appear in conflicts"],
    familySetup: "Official pages list two-queen options, suites, minifridges, play yards on request, microwaves on request for a fee in many room descriptions, and a $46 resort fee. The inspected official pages do not publish a parking amount.",
    priceNote: "Room and suite choice can move the total.",
    reviewSignal: "Waterslide, pool, location, suite/space, and kid-enjoyment positives; conflicts around fees, parking friction, room/value variability, and immediate-area walkability.",
    parentCheck: "Verify current parking cost, waterslide height/hour rules, exact suite or room bedding, final total, cancellation, and room location relative to pool/elevator/event areas.",
    mapQuery: "Hyatt Regency Mission Bay Spa and Marina",
    sources: ["HY-1", "HY-2", "HY-3", "HY-P", "HY-R"]
  },
  {
    name: "Paradise Point Resort & Spa",
    shortName: "Paradise Point",
    google: { prefix: "sd-paradise", title: "Paradise Point Resort & Spa", acrossSearches: true },
    category: "Stay-put Mission Bay resort",
    area: "Mission Bay",
    priceRange: "Check live rate",
    olderSample: { amount: "$349", source: "Expedia", seen: "2026-07-18", party: null },
    strengths: ["Official amenities describe five heated pools, beach areas, marina, sports courts, miniature golf, and seasonal activities", "Large-property resort shape may help families who want to stay on property", "Multiple-pool and family-orientation positives recur"],
    tradeoffs: ["Large footprint may be helpful or annoying depending on kid age and assigned room", "Price/fee perception and room-condition variability appear in conflicts"],
    familySetup: "Bungalow-style rooms and suites need exact room verification; do not infer family layout from the property style alone. Official amenities list a $46 fee and $49 reserved doorstep parking.",
    priceNote: "Larger rooms and bayfront locations can move higher.",
    reviewSignal: "Family orientation, multiple pools, spacious rooms, beach access, and resort-village positives; conflicts around total price, amenity value, property scale, and room condition.",
    parentCheck: "Verify room location, total with parking, current pool/restaurant/activity operations, room condition, and any active redevelopment, renovation, or property-name change before booking.",
    mapQuery: "Paradise Point Resort San Diego",
    sources: ["PP-1", "PP-P", "PP-R"]
  },
  {
    name: "Catamaran Resort Hotel and Spa",
    shortName: "Catamaran",
    google: { prefix: "sd-catamaran", title: "Catamaran Resort Hotel and Spa", acrossSearches: true },
    category: "Pacific Beach bay/beach walkability",
    area: "Pacific Beach",
    priceRange: "Check live rate",
    olderSample: { amount: "$396", source: "Expedia/Hotels.com", seen: "2026-07-18", party: null },
    strengths: ["Official pages expose studios/suites with kitchenettes and some sofa-bed language", "Bay/beach access and Pacific Beach dining can fit families who want a walkable coastal base", "Location positives recur in online review patterns"],
    tradeoffs: ["Cribs and rollaways are request-only and not guaranteed", "Older/musty-room and small-pool conflicts appear in public signals"],
    familySetup: "Official FAQ lists a $46 resort fee, $47 self-parking, $50 valet, request-only cribs and rollaways, plus kitchenettes with a mini refrigerator, microwave, toaster oven, and requestable kitchen items for some studios/suites; exact sofa-bed and building status need verification.",
    priceNote: "Room view, renovation status, and weekend dates can move the total substantially.",
    reviewSignal: "Bay/beach location, Pacific Beach convenience, pool/arcade, tropical grounds, and family beach practicality positives; conflicts around older rooms, mustiness, pool size, and resort-value expectations.",
    parentCheck: "Verify exact room/building/renovation status, parking, room layout, sofa-bed availability, crib/rollaway handling, pool/beach operations, noise exposure, and final total.",
    mapQuery: "Catamaran Resort Hotel and Spa San Diego",
    sources: ["CAT-1", "CAT-2", "CAT-P", "CAT-R"]
  },
  {
    name: "Homewood Suites San Diego Downtown/Bayside",
    shortName: "Homewood",
    google: { prefix: "sd-homewood", title: "Homewood Suites by Hilton San Diego Downtown/Bayside", acrossSearches: true },
    category: "Suite/kitchen downtown base",
    area: "Downtown / Little Italy",
    priceRange: "Check live rate",
    olderSample: { amount: "$265", source: "Expedia/Hotels.com", seen: "2026-07-18", party: "2 adults" },
    strengths: ["Official Hilton page lists recently renovated all-suite rooms, in-room kitchens, free hot breakfast, connecting rooms, and cribs", "Good contrast for families who need kitchen/breakfast more than resort amenities", "Lower rough range than many resort options"],
    tradeoffs: ["No self-parking and $65 valet create car friction", "Breakfast variety/staffing, parking, noise, and maintenance appear in conflicts"],
    familySetup: "Official Hilton page lists all-suite setup, in-room kitchens, connecting rooms, cribs, outdoor pool, and nearby distance facts; exact suite walls, doors, bedding, and occupancy still need verification.",
    priceNote: "$65 valet matters if you keep a car.",
    reviewSignal: "Suite, breakfast, location, pool/workout area, and family-friendly lobby positives; conflicts around valet cost, breakfast consistency, parking friction, noise, and maintenance.",
    parentCheck: "Verify exact suite layout, occupancy, final total with valet, breakfast hours/menu, pool availability, valet wait/oversize rules, routes to first activities, and room-noise request.",
    mapQuery: "Homewood Suites San Diego Downtown Bayside",
    sources: ["HWS-1", "HWS-P", "HWS-R"]
  },
  {
    name: "LEGOLAND Hotel or Castle Hotel",
    shortName: "LEGOLAND Castle Hotel",
    google: { prefix: "sd-legoland-hotel", title: "LEGOLAND® Castle Hotel", acrossSearches: true, cellNote: "Castle Hotel only. Both LEGOLAND hotels also sell packages, priced differently." },
    category: "LEGOLAND-heavy North County trip",
    area: "Carlsbad / LEGOLAND",
    priceRange: "Check live rate",
    olderSample: null,
    strengths: ["Official pages list themed rooms, kids sleeping area, breakfast, pool, entertainment, and in-room treasure hunt", "Can reduce morning friction when LEGOLAND is the core trip", "Strong child-theme positives appear in online review patterns"],
    tradeoffs: ["Not a clean San Diego city-base for zoo, Mission Bay, Downtown, or La Jolla days", "Package/per-person pricing must not be compared as a plain room rate"],
    familySetup: "Official pages list a separate kids sleeping area in every room, Pack 'N Plays by request, and room capacity by exact room size. Parking is generally not included: current support lists $40 self-parking and $55 overnight valet, with named passholder exceptions.",
    priceNote: "Compare room, tickets, breakfast, and parking as one family total.",
    reviewSignal: "Child-theme, bunk/kids sleeping areas, breakfast convenience, activities, and park proximity positives; conflicts around value, parking cost, food quality, and whether more than one or two nights is worth it.",
    parentCheck: "Compare room-total versus package-per-person total, tickets, parking, exact capacity, breakfast crowding, pool hours, early-access rules, cancellation, and whether North County fits the rest of the itinerary.",
    mapQuery: "LEGOLAND Hotel California Carlsbad",
    sources: ["LEG-1", "LEG-2", "LEG-P", "LEG-R"]
  },
  {
    name: "Loews Coronado Bay Resort",
    shortName: "Loews",
    google: { prefix: "sd-loews", title: "Loews Coronado Bay Resort", acrossSearches: true },
    category: "Coronado bay/splurge option",
    area: "Coronado",
    priceRange: "Check live rate",
    olderSample: { amount: "$360", source: "Expedia", seen: "2026-07-18", party: null },
    strengths: ["Official materials list three heated pools on a waterfront Coronado resort", "No-reservation Village shuttle service can reduce one Coronado transfer", "Pool/service/family amenity positives recur in online review patterns"],
    tradeoffs: ["More isolated from Coronado Village and San Diego attractions than central bases", "Parking/fees and property-condition comments appear in conflicts"],
    familySetup: "Official pages list three heated pools, no-reservation Coronado Village shuttle service, and on-demand beach shuttle service; exact room layout and occupancy remain room-specific.",
    priceNote: "Room view, season, parking, and Coronado logistics can move the total.",
    reviewSignal: "Pool, service, family amenities, toddler/family pool enjoyment, children's pool, crib, laundry, and supervised-activity positives; conflicts around isolation, parking/fees, and property condition.",
    parentCheck: "Verify rate-specific fee inclusion, applicable parking nights and processing charge, final total, shuttle hours, room/suite layout, pool/kids-program status, and driving plan.",
    mapQuery: "Loews Coronado Bay Resort",
    sources: ["LOEWS-1", "LOEWS-P", "LOEWS-R"]
  },
  {
    name: "La Jolla Shores Hotel",
    shortName: "La Jolla Shores",
    google: { prefix: "sd-la-jolla-shores", title: "La Jolla Shores Hotel", acrossSearches: true },
    category: "La Jolla beachfront stay",
    area: "La Jolla Shores",
    priceRange: "Check live rate",
    olderSample: { amount: "$406", source: "Expedia", seen: "2026-07-21", party: "2 adults" },
    strengths: ["Beachfront location creates a distinct La Jolla trip shape", "The official site now lists a refreshed heated pool and children's wading pool", "Beach, location, staff, and refreshed-room positives recur in online review patterns"],
    tradeoffs: ["Parking availability, billed days and tax basis need checking", "Exact kitchen and sofa-bed setups remain room-specific"],
    familySetup: "Official room pages show two-queen rooms plus selected suites with sofa beds, kitchenettes, or a full kitchen. The site now lists a refreshed heated pool and children's wading pool; verify the exact room name because room features are not property-wide.",
    priceNote: "Larger rooms and peak dates can move much higher.",
    reviewSignal: "Beach access, location, staff, and refreshed-room positives recur; fees, noise/value, and room-condition variability appear in conflicts.",
    parentCheck: "Verify current pool operations, exact room kitchen and bedding, parking availability and billed days, rate-specific fee inclusion, final total, and cancellation terms.",
    mapQuery: "La Jolla Shores Hotel",
    sources: ["LJS-OFFICIAL-ROOMS", "LJS-OFFICIAL-FAQ", "LJS-OFFICIAL-POLICY", "LJS-PRICE-EXPEDIA", "LJS-REVIEWS-EXPEDIA", "LJS-REVIEWS-TRIPADVISOR"]
  },
  {
    name: "Hotel del Coronado",
    shortName: "Hotel del",
    google: { prefix: "sd-del", title: "Hotel del Coronado", acrossSearches: true },
    category: "Iconic Coronado beachfront splurge",
    area: "Coronado Beach",
    priceRange: "Check live rate",
    olderSample: { amount: "$619", source: "Expedia", seen: "2026-07-21", party: "2 adults" },
    strengths: ["Official materials expose multiple room neighborhoods and guaranteed connecting-room selection or request", "Cribs, select rollaways, heated pools, beach experiences, and an ages 4-12 kids program are documented", "Beach, setting, history, and resort-experience positives recur"],
    tradeoffs: ["The five room neighborhoods do not offer the same room or pool experience", "Crowding and value are recurring conflicts at a very high total price"],
    familySetup: "Five room neighborhoods offer materially different rooms and access; Shore House villas have one to three bedrooms, living areas, and full kitchens. Official pages list guaranteed connecting selection/request, complimentary cribs, select rollaways, heated pools, an ages 4-12 program, a $50 mandatory charge, and restoration completion in June 2025.",
    priceNote: "Premium dates, views, villas, parking, and larger family layouts can move far higher.",
    reviewSignal: "Beach, setting, history, pools, and the resort experience recur positively; room-neighborhood fit, crowding, service consistency, and value recur as conflicts.",
    parentCheck: "Choose the exact neighborhood and room first, then verify pool access, connecting-room handling, final total with parking, kids-program schedule, and cancellation terms.",
    mapQuery: "Hotel del Coronado",
    sources: ["DEL-OFFICIAL-FAQ", "DEL-OFFICIAL-STAY", "DEL-OFFICIAL-SHORE-HOUSE", "DEL-PRICE-EXPEDIA", "DEL-REVIEWS-EXPEDIA", "DEL-REVIEWS-TRIPADVISOR"]
  },
  {
    name: "The Dana on Mission Bay",
    shortName: "The Dana",
    google: { prefix: "sd-dana", title: "The Dana on Mission Bay", acrossSearches: true },
    category: "Simpler Mission Bay family base",
    area: "Mission Bay",
    priceRange: "Check live rate",
    olderSample: { amount: "$326", source: "Expedia", seen: "2026-07-21", party: "2 adults" },
    strengths: ["Official pages publish two heated pools, exact room capacities, and many suite layouts", "Crib, rollaway, connecting-room, refrigerator, microwave, parking, and resort-fee details are unusually clear", "Location, pools, grounds, and family-activity positives recur"],
    tradeoffs: ["There are no full kitchens", "Room condition, parking walks, and fee/value perception vary"],
    familySetup: "Standard rooms list a four-person maximum; many junior suites and suites list up to six with sofa sleepers. Official pages list free cribs, request-only connecting rooms, refrigerators, microwaves and two heated pools, but no kitchens.",
    priceNote: "Suites and peak weekends can move higher.",
    reviewSignal: "Mission Bay location, pools, grounds, staff, and family activities recur positively; room size or condition, parking distance, and total-value concerns vary.",
    parentCheck: "Verify exact room layout and occupancy, rollaway availability, payable stay total, card authorization and release terms, connecting request, pool/activity schedule, and cancellation.",
    mapQuery: "The Dana on Mission Bay",
    sources: ["DANA-OFFICIAL-FAQ", "DANA-OFFICIAL-ROOMS", "DANA-PRICE-EXPEDIA", "DANA-REVIEWS-EXPEDIA", "DANA-REVIEWS-BOOKING", "DANA-REVIEWS-TRIPADVISOR"]
  },
  {
    name: "Manchester Grand Hyatt San Diego",
    shortName: "Manchester Grand Hyatt",
    google: { prefix: "sd-manchester", title: "Manchester Grand Hyatt San Diego", acrossSearches: true },
    category: "Downtown waterfront full-service stay",
    area: "Downtown / Seaport Village",
    priceRange: "Check live rate",
    olderSample: { amount: "$329", source: "Expedia", seen: "2026-07-21", party: "2 adults" },
    strengths: ["Official room pages publish connecting options and multiple family-suite layouts", "Downtown waterfront position fits Seaport Village and Embarcadero days", "Views, location, and large-hotel convenience recur positively"],
    tradeoffs: ["Only Coastline Pool is operating; the fourth-floor pool is due in December 2026", "A large convention-hotel footprint can change the experience"],
    familySetup: "Official pages list a two-double connecting room, family suites with sleeper sofas or connecting bedrooms, minifridges, play yards on request, and microwaves in many suites. Guestrooms and the third-floor pool are described as refreshed; exact occupancy and connection still depend on room type.",
    priceNote: "Family suites, parking, and high-demand Downtown dates can move higher.",
    reviewSignal: "Bay views, Downtown access, rooms, and hotel scale recur positively; renovation status, pool expectations, club or service consistency, and value recur as conflicts.",
    parentCheck: "Verify exact connecting or suite setup, Coastline Pool access, the December 2026 fourth-floor-pool schedule, destination fee, parking, final total, and cancellation terms.",
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
  ["Hyatt Mission Bay policies", "https://www.hyatt.com/hyatt-regency/en-US/sanis-hyatt-regency-mission-bay-spa-and-marina/policies"],
  ["Paradise Point amenities", "https://paradisepoint.com/resort/beach-resort-amenities/"],
  ["Catamaran Resort FAQ", "https://www.catamaranresort.com/faqs"],
  ["Catamaran rooms", "https://www.catamaranresort.com/rooms/rooms-overview"],
  ["Homewood Suites Downtown/Bayside", "https://www.hilton.com/en/hotels/sanhahw-homewood-suites-san-diego-downtown-bayside/"],
  ["LEGOLAND Hotel", "https://www.legoland.com/california/places-to-stay/legoland-hotel/"],
  ["LEGOLAND hotel parking support", "https://california-support.legoland.com/hc/en-us/articles/360001573591-Is-parking-included-with-my-stay-at-the-LEGOLAND-California-Hotel-or-Castle-Hotel"],
  ["Loews Coronado Bay Resort", "https://www.loewshotels.com/coronado-bay-resort"],
  ["Loews Coronado Bay services and amenities", "https://www.loewshotels.com/coronado-bay-resort/discover/services-amenities"],
  ["Loews Coronado Bay FAQ", "https://www.loewshotels.com/coronado-bay-resort/faqs"],
  ["Loews Coronado Bay shuttle service", "https://www.loewshotels.com/coronado-bay-resort/shuttle-service"],
  ["La Jolla Shores Hotel accommodations", "https://www.ljshoreshotel.com/accommodations/"],
  ["La Jolla Shores Hotel FAQ", "https://www.ljshoreshotel.com/faqs/"],
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


const sanDiegoHomewoodName = "Homewood Suites San Diego Downtown/Bayside";
const sanDiegoToday = process.env.FT_BUILD_DATE || easternDate();

function sanDiegoFamilyHotelPage(today = sanDiegoToday) {
  const hotels = sanDiegoFamilyHotels;
  const homewoodFive = sanDiegoHomewoodFive(today);
  const city = sanDiegoCity;
  const holidayList = city.holidayNames(hotels, today);
  const priced = hotels.map((hotel) => ({ hotel, w: city.setPrice(hotel, "weekend", today) })).filter((row) => row.w?.both).sort((a, b) => a.w.average - b.w.average);
  const liveFour = priced.length > 0;
  const pickPrice = (name) => {
    const hotel = hotels.find((entry) => entry.shortName === name);
    const w = city.setPrice(hotel, "weekend", today);
    return `${name}${w?.any ? ` ${city.figure(w).replace("≈ ", "≈\u00a0")}${w.both ? "" : ` (${city.oneNight(w)})`}` : ""}`;
  };
  const hotelCards = hotels.map((hotel, index) => {
    const feeNote = sanDiegoCurrentFeeNote(hotel.name);
    const roomNote = sanDiegoCurrentRoomNote(hotel.name);
    const w = city.setPrice(hotel, "weekend", today);
    return `          <article class="detail-card hotel-card" id="san-diego-hotel-${index + 1}" style="scroll-margin-top: 80px">
            <p class="eyebrow">${esc(hotel.category)}</p>
            <h3>${esc(hotel.name)}</h3>
            <dl class="hotel-facts">
              <div><dt>Area</dt><dd>${esc(hotel.area)}</dd></div>
              <div><dt>${liveFour ? `Weekend price (family of 4, <span class="nowrap-range">${esc(g18Sets.weekend.label)}</span>)` : "Family price"}</dt><dd>${w?.any ? `${city.weekendHead(w)} <small>${esc(`${city.weekendDetail(w)}. Google Hotels estimate, not a quote${hotel.google.cellNote ? `. ${hotel.google.cellNote}` : ""}`)}</small>` : city.noPrice(hotel, today)} · <a href="#price-basis">Price basis</a>${hotel.name === sanDiegoHomewoodName && homewoodFive ? `<details class="hotel-price-more"><summary>Family of 5 price</summary><small class="hotel-price-sample">${esc(homewoodFive.text)}</small></details>` : ""}</dd></div>
              <div><dt>Map</dt><dd><a href="${googleMapsUrl(hotel.mapQuery)}">Open in Google Maps</a></dd></div>
            </dl>
            <section><h4>Why it made the shortlist</h4><ul>${hotel.strengths.slice(0, 2).map((item) => `<li>${esc(item)}</li>`).join("")}</ul></section>
            <details class="hotel-more"><summary>Room details, fees and what to confirm</summary><p>${esc(hotel.familySetup)}</p>${feeNote ? `<p class="hotel-fee-note">${esc(feeNote.text)} ${feeNote.sourceUrls.map((url, index) => `<a href="${esc(url)}">Fee source ${index + 1}</a>`).join("; ")}</p>` : ""}${roomNote ? `<details class="hotel-room-more"><summary>Exact room facts and what to confirm</summary><p class="hotel-room-note" data-room-policy="homewood-bayside">${esc(roomNote.text)} <a href="${esc(roomNote.sourceUrl)}">Exact-suite source</a>; <a href="${esc(roomNote.policySourceUrl)}">Hotel policy source</a>.</p></details>` : ""}<p>${esc(hotel.priceNote)} ${esc(hotel.parentCheck)}</p></details>
            <details class="hotel-more"><summary>Themes in sampled online reviews</summary><p>${esc(hotel.reviewSignal)}</p></details>
          </article>`;
  }).join("\n");

  const comparisonRows = hotels.map((hotel, index) => ({ hotel, index, w: city.setPrice(hotel, "weekend", today) })).sort((a, b) => (a.w?.any ? a.w.average : Infinity) - (b.w?.any ? b.w.average : Infinity)).map(({ hotel, index }) => `              <tr>
                <td><a href="#san-diego-hotel-${index + 1}">${esc(hotel.name).replaceAll("/", "/<wbr>")}</a><small class="sd-row-area">${esc(hotel.area)}</small></td>
                <td>${city.priceCell(hotel, today)}${hotel.name === sanDiegoHomewoodName && homewoodFive ? `<br><small class="family-listing">Family of 5 (2 adults + 3 kids): ${esc(homewoodFive.line)}; seen ${sanDiegoSeen}</small>` : ""}</td>
                <td>${esc(hotel.category)}</td>
                <td>${esc(hotel.area)}</td>
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
      description: (() => { const w = city.setPrice(hotel, "weekend", today); return `${hotel.category}; ${w?.any ? `Google Hotels listing ${city.figure(w)} per night${w.both ? "" : `, ${city.oneNight(w)}`} for ${q18Party} (${g18Sets.weekend.label}), seen ${sanDiegoSeenLong}; estimate, not a quote${hotel.google.cellNote ? `. ${hotel.google.cellNote}` : ""}` : "no current family-of-4 price shown; check live rate"}`; })()
    }))
  };

  const holidayTables = [city.holidayTable(hotels, "christmas", "Christmas weekend, Dec 25–27, 2026", "Fri Dec 25", "Sat Dec 26", today), city.holidayTable(hotels, "newYear", "New Year's weekend, Jan 1–3, 2027", "Fri Jan 1", "Sat Jan 2", today)].join("");
  const holiday = holidayTables ? `      <section id="san-diego-holiday-prices" class="container page-section" style="scroll-margin-top: 80px">
        <div class="section-heading"><p class="eyebrow">Holiday prices</p><h2>${holidayList.join(" and ")} weekend${holidayList.length > 1 ? "s" : ""}</h2></div>
        <p class="hotel-holiday-note">One night, family of 4 (${esc(q18Party)}). Google Hotels, seen ${sanDiegoSeen}: estimates, not quotes. Prices and rooms change fast; check live.</p>
${holidayTables}        <details class="hotel-more"><summary>Reading these tables</summary><p>Two figures in a cell mean two searches differed. &quot;No price&quot; means none was shown on ${sanDiegoSeen}, not sold out.</p></details>
      </section>
` : "";

  const body = `    <main id="main">
      <section id="san-diego-hotel-intro" class="page-hero hotel-hero">
        <div class="container">
          <p class="eyebrow">San Diego · where to stay with kids</p>
          <h1>San Diego Family Hotels</h1>
          ${contributorCredit()}
          <p>${esc(liveFour ? (holidayList.length ? "12 hotels for a family of 4, with weekend and holiday prices" : "12 hotels for a family of 4, with weekend prices") : "12 hotels for a family of 4")}: pick by kitchen, pool, beach or LEGOLAND.</p>
        </div>
      </section>
${city.glance(hotels, [
    { label: "Downtown hotels", names: ["Homewood Suites San Diego Downtown/Bayside", "Manchester Grand Hyatt San Diego"] },
    { label: "Mission Bay and Pacific Beach resorts", names: ["The Dana on Mission Bay", "Bahia Resort Hotel", "Hyatt Regency Mission Bay Spa and Marina", "San Diego Mission Bay Resort", "Paradise Point Resort & Spa", "Catamaran Resort Hotel and Spa"] },
    { label: "At LEGOLAND, Carlsbad", names: ["LEGOLAND Hotel or Castle Hotel"] },
    { label: "Coronado and La Jolla", names: ["Hotel del Coronado", "Loews Coronado Bay Resort", "La Jolla Shores Hotel"] }
  ], today)}
      <section class="container media-section hero-photo-section">
        <figure class="licensed-photo hero-photo">
          <img src="../images/san-diego-mission-bay.webp" alt="Mission Bay in San Diego viewed from above with bay water, islands, roads, and nearby neighborhoods." loading="eager" fetchpriority="high" decoding="async" width="1280" height="982">
          <figcaption>Photo: Alfred Twu, Wikimedia Commons, CC0. <a href="https://commons.wikimedia.org/wiki/File:21a-san-diego-mission-bay.jpg">License and source</a>. Resized and cropped to fit.</figcaption>
        </figure>
      </section>
      <section id="san-diego-hotel-answer" class="container answer-box price-answer" aria-label="Short answer">
        <p class="pick-heading"><strong>Pick by trip style</strong>${liveFour ? " (family of 4, a night, Jan 22–24)" : ""}</p>
        <ul class="pick-list">
          <li><span class="pick-chip">Kitchen or suite</span> <span>${esc(["Homewood", "Bahia", "Catamaran"].map(pickPrice).join(", "))}</span></li>
          <li><span class="pick-chip">Pools or slides</span> <span>${esc(["The Dana", "Hyatt Mission Bay", "Mission Bay Resort", "Paradise Point"].map(pickPrice).join(", "))}</span></li>
          <li><span class="pick-chip">On the beach</span> <span>${esc(["La Jolla Shores", "Hotel del"].map(pickPrice).join(", "))}</span></li>
          <li><span class="pick-chip">LEGOLAND first</span> <span>${esc(pickPrice("LEGOLAND Castle Hotel"))}</span></li>
        </ul>
        <p class="price-basis"><strong>Main catch:</strong> ${liveFour ? "Google&#39;s price names no room, so suites can cost more. " : ""}Resort fees ($25-$50 a night where published) and parking ($35-$65 where charged) can be extra.</p>
      </section>
      <section class="container trust-panel" aria-label="Review status">
        <p><strong>Hotel facts checked:</strong> August 17, 2026. <strong>Online-review themes sampled:</strong> July 18-21, 2026. ${liveFour ? `<strong>Google family prices seen:</strong> ${sanDiegoSeenLong}.` : "No current family price shown."}</p>
        <p>August checks did not provide consistent family totals, so compare the same room and occupancy plus taxes and parking before booking. <a href="#price-basis">Price basis</a>.</p>
      </section>
      <section id="hotel-comparison" class="band" data-glance-first>
        <div class="container">
          <div class="section-heading">
            <p class="eyebrow">Comparison</p>
            <h2>Quick hotel comparison</h2>
          </div>
          <p class="review-label">${liveFour ? `Cheapest first. Google Hotels prices per night, 2 adults + kids 5 and 8, ${esc(g18Sets.weekend.label)}, seen ${sanDiegoSeen}: estimates, not quotes. &quot;Also&quot; means another search for that night showed a different price.` : "No current family price shown: check the live rate."} <a href="#price-basis">Full price basis</a>.</p>
          <div class="comparison-scroll" role="region" aria-label="San Diego hotel comparison" tabindex="0">
            <table class="comparison-table hotel-comparison sd-compare">
              <thead><tr><th>Hotel</th><th>Weekend price (family of 4)</th><th>Best starting point for</th><th>Area</th><th>Map</th><th>Most important check</th></tr></thead>
              <tbody>
${comparisonRows}
              </tbody>
            </table>
          </div>
          <details id="price-basis" style="scroll-margin-top: 80px"><summary>Full price basis</summary><p>${esc(sanDiegoPriceBasisFor(today))}</p></details>
          <details><summary>Spreadsheet copy</summary><p><a href="../downloads/san-diego-family-hotels.csv" download>Download the twelve-hotel comparison (.csv)</a>. Same prices as this page.</p></details>
        </div>
      </section>
${holiday}      <section class="container page-section rank-ready-section">
        <div class="section-heading">
          <p class="eyebrow">Category picks</p>
          <h2>Pick the closest trip style</h2>
        </div>
        <div class="quick-pick-grid hotel-pick-grid">
          <article class="quick-pick"><span>Mission Bay water time</span><strong>Bahia suite or Hyatt slides</strong><p>Start with Bahia when a family suite and bay downtime matter; start with Hyatt when waterslides are the hotel-day priority. Compare the other Mission Bay properties in the full table only if neither fits.</p></article>
          <article class="quick-pick"><span>Bay plus Pacific Beach</span><strong>Catamaran Resort</strong><p>Compare when bay access and nearby food matter, with careful room-building and nighttime-noise checks.</p></article>
          <article class="quick-pick"><span>Downtown base</span><strong>Homewood or Manchester Grand Hyatt</strong><p>Choose Homewood for suite, kitchen, and breakfast function; Manchester for a large full-service waterfront hotel, after checking renovation and pool status.</p></article>
          <article class="quick-pick"><span>LEGOLAND-heavy trip</span><strong>LEGOLAND Hotel/Castle</strong><p>Use when the park is the anchor; compare package, tickets, and parking as one total.</p></article>
          <article class="quick-pick"><span>Coronado resort trip</span><strong>Hotel del or Loews</strong><p>Choose Hotel del for the iconic beachfront experience or Loews for a more isolated bay resort; price the full stay before deciding.</p></article>
          <article class="quick-pick"><span>La Jolla beach trip</span><strong>La Jolla Shores Hotel</strong><p>Compare for direct beach access and the refreshed pool, then verify the exact room setup, parking availability and billed days.</p></article>
        </div>
        <dl class="snapshot sd-routing">
          <div><dt>One base or split?</dt><dd>Keep one San Diego base when most days are around the city or coast. Compare a short North County split only when LEGOLAND anchors the trip and park-hotel downtime may justify moving rooms. Mission Bay means bay access; Catamaran adds nearby Pacific Beach; La Jolla Shores is the direct ocean-beach option. Verify date-specific drive and traffic plus the same-date room, parking, and package total.</dd></div>
        </dl>
        <p><a class="text-link" href="../where-to-stay/san-diego-with-kids.html">Compare San Diego stay areas first</a></p>
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
        <p>Room, pool, and renovation facts were checked August 17, 2026 and are not renewed here. <span data-room-source-scope>The Homewood card's separate October 11, 2026 exact-suite check covers sleeping spaces and kitchen equipment only; its fees and review sample retain older dates.</span> Fee checks: La Jolla Shores October 5; Loews Coronado October 6; Dana fee and authorization policy October 8, 2026. Cards link official sources. Other fee and parking facts retain earlier checks. Reviews paraphrase a small directional sample, not representative ratings or firsthand stays.</p>
        <ul class="source-list">
${sanDiegoHotelSources.map(([label, href]) => `          <li><a href="${esc(href)}">${esc(label)}</a></li>`).join("\n")}
          <li><a href="https://commons.wikimedia.org/wiki/File:21a-san-diego-mission-bay.jpg">Mission Bay photo license and attribution</a></li>
          <li>Google Hotels listing prices via DataForSEO, seen ${sanDiegoSeenLong}${homewoodFive ? ", including the Homewood family-of-5 listing" : ""}.</li>
          <li>Public Expedia, Hotels.com, KAYAK, Tripadvisor, Booking.com, Hyatt review, Tripster, and KidTripster pages sampled July 18-21, 2026 for online-review context.</li>
        </ul>
      </section>
      <script type="application/ld+json">${JSON.stringify(itemListJson)}</script>
    </main>`;

  return pageShell({
    title: "Top Family Hotels in San Diego: 12 Options by Trip Style",
    description: "Compare 12 San Diego family hotels by trip style, room setup, pools, breakfast or kitchen needs, map location, dated price samples, and sampled online review themes.",
    canonical: "where-to-stay/san-diego-family-hotels.html",
    body
  });
}

const lasVegasRoomCapacityChecked = "September 16, 2026";
const lasVegasFamilyHotels = [
  {
    name: "Mandalay Bay Resort and Casino",
    google: { prefix: "lv-mandalay-bay", title: "Mandalay Bay" },
    category: "Pool-and-attraction resort",
    area: "South Strip",
    priceRange: "Check live rate",
    olderSample: { amount: "$106", basis: "total", source: "Expedia" },
    shortName: "Mandalay Bay",
    strengths: ["The 11-acre beach complex and Shark Reef can make the hotel part of the itinerary", "Official two-queen rooms list space for four"],
    familySetup: "Official materials list 550 sq ft two-queen rooms for up to four, plus an 11-acre beach complex with a wave pool, lazy river, pools, and Shark Reef on site.",
    reviewSignal: "Beach, pool, and room-size positives recur; check-in or service waits, noise, seasonal pool limits, and value when water features are closed appear as conflicts.",
    priceNote: "Weekends, events, and larger rooms can cost far more than the dates shown.",
    parentCheck: "Confirm which pools and water features operate on the exact dates, room occupancy, final total, parking, and the casino-floor path.",
    mapQuery: "Mandalay Bay Resort Las Vegas"
  },
  {
    name: "Four Seasons Hotel Las Vegas",
    google: { prefix: "lv-four-seasons", title: "Four Seasons Hotel Las Vegas" },
    category: "Non-gaming luxury with Mandalay access",
    area: "South Strip",
    priceRange: "Check live rate",
    olderSample: { amount: "$351", basis: "total", source: "Expedia" },
    shortName: "Four Seasons",
    strengths: ["Official family materials describe a non-gaming and non-smoking hotel", "Guests receive private-pool and Mandalay Beach access"],
    familySetup: "The official family page lists a private pool, Mandalay Beach access, cribs or rollaways, childproofing items, children's toiletries, books, and games; exact room occupancy still depends on room type.",
    reviewSignal: "Service, cleanliness, room space, and the calmer setting recur positively; high prices, early or seasonal pool limits, airport noise, and occasional service or condition conflicts also appear.",
    priceNote: "Larger rooms, weekends, dining, and parking can move the stay much higher.",
    parentCheck: "Price the full stay and verify private and Mandalay pool hours, exact bedding, parking, and whether the south-Strip location fits the plan.",
    mapQuery: "Four Seasons Hotel Las Vegas"
  },
  {
    name: "Vdara Hotel & Spa",
    google: { prefix: "lv-vdara", title: "Vdara Hotel & Spa" },
    category: "Central non-gaming kitchenette suite",
    area: "Center Strip / CityCenter",
    priceRange: "Check live rate",
    olderSample: { amount: "$147", basis: "total", source: "Expedia", also: "a high-date private-residence listing showed about $471" },
    shortName: "Vdara",
    strengths: ["Every official Studio is a 582 sq ft suite with a kitchenette", "The property is casino-free and smoke-free while staying close to Aria and Bellagio"],
    familySetup: "The official Studio lists a king bed, pullout queen sofa, kitchenette, dining table, and maximum occupancy of four. Bedding and separation vary by exact suite.",
    roomCapacity: {
      label: "Vdara two-bedroom luxury suite",
      capacity: "up to six guests",
      note: "Studios and one-bedroom suites max at four. For five guests, compare a two-bedroom Penthouse, Loft, or Hospitality Suite, or price two rooms without assuming they connect.",
      source: "https://vdara.mgmresorts.com/en/hotel.html",
      fivePlusStart: false
    },
    reviewSignal: "Room space, non-gaming atmosphere, and access toward Aria and Bellagio recur positively; empty kitchenettes until supplies are requested, small fridges, parking walks, maintenance, and fee clarity recur as conflicts.",
    priceNote: "Compare the hotel's own Studio inventory with private-residence listings, which can price differently.",
    parentCheck: "Confirm the exact suite bedding, kitchen equipment supplied, parking route, pool season, final total, and cancellation terms.",
    mapQuery: "Vdara Hotel and Spa Las Vegas"
  },
  {
    name: "Marriott's Grand Chateau",
    google: { prefix: "lv-grand-chateau", title: "Marriott's Grand Chateau" },
    category: "Multi-bedroom kitchen and laundry base",
    area: "Center Strip / Harmon Avenue",
    priceRange: "Check live rate",
    olderSample: { amount: "$200s", basis: "before tax", source: "public listings", text: "low to mid $200s before tax; about $676 for a high date or larger villa" },
    glanceNote: "low to mid $200s before tax, no exact figure",
    shortName: "Grand Chateau",
    strengths: ["Official one- to three-bedroom villas add kitchens, living space, and in-unit laundry", "The property publishes no resort fee"],
    familySetup: "Official pages list guest rooms plus one-, two-, and three-bedroom villas with kitchens or kitchenettes, living and dining space, and in-unit laundry in villas. Two pools and valet-only parking are also listed.",
    roomCapacity: {
      label: "Grand Chateau two-king two-bedroom villa",
      capacity: "up to eight guests",
      note: "The audited two-king, two-sofa-bed category has two bathrooms and does not permit cribs or rollaways. Verify the exact villa and sleeping surfaces; other layouts differ.",
      source: "https://www.marriott.com/en-us/hotels/lasvg-marriotts-grand-chateau/rooms/",
      fivePlusStart: true
    },
    reviewSignal: "Space, kitchens, laundry, cleanliness, and central location recur positively; small or crowded pools, valet dependence, timeshare contact, noise, and limited food choices recur as conflicts.",
    priceNote: "Villa size is the main comparison point; larger villas and high dates cost more.",
    parentCheck: "Compare the exact villa, bedrooms and baths, housekeeping cadence, valet cost and wait, final total, and cancellation terms.",
    mapQuery: "Marriott's Grand Chateau Las Vegas"
  },
  {
    name: "Tahiti Village Resort",
    google: { prefix: "lv-tahiti-village", title: "Tahiti Village" },
    category: "Off-Strip lazy-river suite",
    area: "South Las Vegas Boulevard",
    priceRange: "Check live rate",
    olderSample: { amount: "$129", basis: "total", source: "Expedia" },
    shortName: "Tahiti Village",
    strengths: ["Official one- and two-bedroom suites publish kitchenette or full-kitchen setups", "The pool, lazy river, arcade, activities, and free parking support a stay-put day"],
    familySetup: "Official pages list a 580 sq ft one-bedroom with kitchenette, a 971 sq ft one-bedroom with full kitchen, and a 1,551 sq ft two-bedroom suite, plus pool, lazy river, arcade, activities, and free parking.",
    roomCapacity: {
      label: "Tahiti Village Royal Tahitian",
      capacity: "up to eight guests",
      note: "This is the two-bedroom suite formed from Moorea and Bora Bora units as one suite. Each one-bedroom category lists four guests; verify the named Royal Tahitian reservation rather than assuming a requested connector.",
      source: "https://tahitivillage.com/booknow/",
      fivePlusStart: true
    },
    reviewSignal: "Room space, kitchens, lazy river, pool, and the away-from-casino setting recur positively; crowding, partial pool closures, elevator or parking walks, service follow-through, room condition, and sales contact recur as conflicts.",
    priceNote: "Larger suites and peak pool dates can cost more.",
    parentCheck: "Verify the exact kitchen, pool and lazy-river operations, crib or Pack 'n Play availability if needed, shuttle schedule, final total, and cancellation terms.",
    mapQuery: "Tahiti Village Resort Las Vegas"
  },
  {
    name: "Hilton Vacation Club Cancun Resort Las Vegas",
    google: { prefix: "lv-cancun-resort", title: "Hilton Vacation Club Cancun Resort Las Vegas" },
    category: "Off-Strip waterslides and family space",
    area: "South Las Vegas Boulevard",
    priceRange: "Check live rate",
    pastStaySample: "$119",
    glanceNote: "no figure shown, its only sample was for a July 27 stay",
    shortName: "Cancun Resort",
    strengths: ["Hilton lists two pools and four waterslides", "Free parking and residence-style layouts can fit a car-based family trip"],
    familySetup: "Hilton lists two pools, four waterslides, free parking, non-smoking rooms, and resort residences. Hilton says cribs and confirmed connecting rooms are unavailable, while Expedia lists free cribs on request. Treat crib availability as unresolved and confirm it directly if needed.",
    roomCapacity: {
      label: "Cancun two-bedroom suite",
      capacity: "four to six guests",
      note: "HGV lists one-bedroom suites for two to four and two-bedroom penthouse suites for six to eight. Check the exact beds, kitchen, occupancy and availability for your dates.",
      source: "https://www.hiltongrandvacations.com/en/resorts-and-destinations/las-vegas/cancun-las-vegas-a-hilton-vacation-club",
      fivePlusStart: true
    },
    reviewSignal: "Family pool and space positives appear in the small sample; resort fee, service consistency, timeshare context, room condition, and distance from main Strip stops remain the main conflicts.",
    priceNote: "Expedia listed a mandatory resort charge of about $39.55 a night (July 22, 2026); confirm the current charge.",
    parentCheck: "Confirm the conflicting crib policy if needed, exact suite and kitchen, slide operations and rules, transport plan, final total, and cancellation terms.",
    mapQuery: "Hilton Vacation Club Cancun Resort Las Vegas"
  },
  {
    name: "Excalibur Hotel & Casino",
    google: { prefix: "lv-excalibur", title: "Excalibur Hotel & Casino" },
    category: "Themed lower-price south Strip base",
    area: "South Strip",
    priceRange: "Check live rate",
    olderSample: { amount: "$58", basis: "total", source: "Expedia" },
    shortName: "Excalibur",
    strengths: ["Newly renovated two-queen rooms officially list space for four", "The castle theme, arcade, and nearby Tournament of Kings can entertain younger children"],
    familySetup: "Official room pages list newly renovated 352 sq ft two-queen rooms for four and larger two-bedroom suites. Current property materials also list arcade or midway entertainment and a pool.",
    reviewSignal: "Low total, castle theme, arcade, and south-Strip access help some families; room condition varies sharply, with smoke, cleanliness, maintenance, queues, and tower or renovation status recurring as conflicts.",
    priceNote: "Renovated rooms, weekends, and event dates can cost much more.",
    parentCheck: "Confirm a renovated room and tower, exact pool season, casino route, final total, parking, and the newest room-condition reviews.",
    mapQuery: "Excalibur Hotel and Casino Las Vegas"
  },
  {
    name: "New York-New York Hotel & Casino",
    google: { prefix: "lv-new-york-new-york", title: "New York-New York Hotel & Casino" },
    category: "Older-kid Strip energy",
    area: "South Strip",
    priceRange: "Check live rate",
    olderSample: { amount: "$79", basis: "total", source: "Expedia" },
    shortName: "New York-New York",
    strengths: ["Official pages list remodeled two-queen rooms", "The Big Apple Coaster, arcade, food, and arena access can suit older kids"],
    familySetup: "Official property pages list remodeled two-queen rooms, the Big Apple Coaster and Arcade, a seasonal pool, and walkways toward neighboring south-Strip resorts.",
    reviewSignal: "Remodeled rooms, food and entertainment density, location, and older-kid energy are positives; casino noise or smoke exposure, coaster fit and cost, pool modesty, queues, and busy public areas are conflicts.",
    priceNote: "Event nights and specific remodeled-room choices can cost more.",
    parentCheck: "Check coaster height and comfort, room tower, pool season, casino path, event-night price, parking, and final total.",
    mapQuery: "New York-New York Hotel and Casino Las Vegas"
  },
  {
    name: "Las Vegas Hilton at Resorts World",
    google: { prefix: "lv-resorts-world-hilton", title: "Las Vegas Hilton at Resorts World" },
    category: "Modern North Strip resort",
    area: "North Strip",
    priceRange: "Check live rate",
    olderSample: { amount: "$134", basis: "including fees, tax not stated", source: "Hilton", glanceBasis: "includes fees; tax not stated", also: "Booking.com showed about $278 plus tax" },
    shortName: "Resorts World Hilton",
    strengths: ["Official Hilton two-queen rooms sleep four", "The resort's large multi-pool complex and food choices support an on-property day"],
    familySetup: "Hilton lists two-queen rooms for four. Resorts World lists a large multi-pool complex; the Athena infinity area is 21+, so families should verify which all-ages pools are operating.",
    reviewSignal: "Modern rooms, cleanliness, pool complex, and on-property food choice recur positively; check-in lines, long internal walks, high food costs, housekeeping inconsistency, and early or seasonal pool closures recur as conflicts.",
    priceNote: "Large offer and date swings were seen; compare the Hilton site and other listings.",
    parentCheck: "Verify which all-ages pools are open, exact Hilton tower and room, internal walking, parking, final total, and cancellation terms.",
    mapQuery: "Las Vegas Hilton at Resorts World"
  },
  {
    name: "Red Rock Casino Resort & Spa",
    google: { prefix: "lv-red-rock", title: "Red Rock Casino Resort and Spa" },
    category: "Summerlin nature and stay-put base",
    area: "Summerlin",
    priceRange: "Check live rate",
    olderSample: { amount: "$219", basis: "total", source: "Expedia" },
    shortName: "Red Rock",
    strengths: ["Bowling, cinema, arcade or Kids Quest, and pool options create non-Strip downtime", "The location can pair with a Red Rock Canyon day"],
    familySetup: "Official pages list a pool for registered guests, bowling, cinema, arcade or Kids Quest, and proximity to Red Rock Canyon. Kids Quest is a separate hourly paid program with current ages and rules to verify.",
    reviewSignal: "Pool, room quality, on-site activities, and the off-Strip setting appear positively; seasonally limited pools, long hotel walks, fees or value, and Strip distance recur as conflicts.",
    priceNote: "Weekends and premium rooms can cost more.",
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

function hotelComparisonCsv(headings, rows) {
  const cell = (value) => {
    const plain = String(value ?? "").replaceAll(/[\r\n\t]+/g, " ");
    const safe = /^\s*[=+\-@]/.test(plain) ? `'${plain}` : plain;
    return `"${safe.replaceAll('"', '""')}"`;
  };
  return [headings, ...rows].map((row) => row.map(cell).join(",")).join("\n") + "\n";
}

function sanDiegoHotelComparisonCsv(today = sanDiegoToday) {
  const page = "https://familytripwise.com/where-to-stay/san-diego-family-hotels.html";
  const homewood = sanDiegoHomewoodFive(today);
  const headings = ["Hotel", "Trip style", "Area", "Weekend price (USD, Google Hotels listing)", "Party", "Weekend priced", "Price seen", "Family-of-5 listing price (Google Hotels; not a quote)", "Price basis and fee limits", "Price context", "Room and family setup", "Most important check", "Map", "Live comparison", "Christmas weekend, Dec 25-27, 2026 (USD, Google Hotels listing)", "New Year's weekend, Jan 1-3, 2027 (USD, Google Hotels listing)"];
  const rows = sanDiegoFamilyHotels.map((hotel) => {
    const w = sanDiegoCity.setPrice(hotel, "weekend", today);
    return [
      hotel.name, hotel.category, hotel.area,
      sanDiegoCity.csvCell(hotel, "weekend", today) || "Check live rate", q18Party, w ? g18Sets.weekend.label : "", w?.any ? "2026-11-05" : "",
      hotel.name === sanDiegoHomewoodName ? (homewood ? homewood.text : "No current family-of-5 price; check live rate.") : "", sanDiegoPriceBasisFor(today),
      hotel.priceNote, hotel.familySetup, hotel.parentCheck,
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hotel.mapQuery)}`, `${page}#hotel-comparison`,
      sanDiegoCity.csvCell(hotel, "christmas", today), sanDiegoCity.csvCell(hotel, "newYear", today)
    ];
  });
  return hotelComparisonCsv(headings, rows);
}

// Q18 (OWNER D25, 2026-11-01): the July samples on Las Vegas and Chicago were for stays that have passed, so they are
// no longer shown. Each hotel now shows Google Hotels one-night listing prices for a family of four (2 adults + kids
// 5 and 8) on future Tuesday nights, pulled through DataForSEO (receipts docs/research/dataforseo-q18-*-2026-11-01.json).
// A figure is used only when exactly one unpaid USD row carries the hotel's exact title (googleOneNight). Each sample
// leaves the page 7 days before its arrival; the committed-page tests fail from then until the pages are regenerated.
// The records keep olderSample/pastStaySample as historical evidence (tools/hotel-evidence.mjs); pages and downloads no longer show them.
const q18Today = process.env.FT_BUILD_DATE || easternDate();
const q18Kids = [5, 8];
const q18Receipts = [...["q18-lv-chicago-hotel-prices-a", "q18-lv-chicago-hotel-prices-b", "q18-lv-chicago-hotel-prices-c", "q18-lv-hotel-prices-d", "q18-lv-hotel-prices-e", "q18-lv-hotel-prices-f"]
  .map((name) => readReceipt(`dataforseo-${name}-2026-11-01.json`)),
  // Q19 (OWNER D26, 2026-11-02): San Antonio, then San Diego and New York City, same party and rule.
  ...["q19-sa-hotel-prices-a", "q19-sa-hotel-prices-b", "q19-sa-hotel-prices-c"]
    .map((name) => readReceipt(`dataforseo-${name}-2026-11-02.json`))];
const q18Night = (label, title) => {
  const receipt = q18Receipts.find((entry) => entry.searches.some((search) => search.label === label));
  return receipt ? googleOneNight(receipt, label, { title, childAges: q18Kids }) : null;
};
// San Diego and New York City (Q19): every exact-title, unpaid USD price this hotel showed for the same night across the city's searches.
const q19CitySearches = ["a", "b", "c"].map((part) => readReceipt(`dataforseo-q19-sd-nyc-hotel-prices-${part}-2026-11-02.json`)).flatMap((receipt) => receipt.searches)
  .filter((search) => search.nights === 1 && search.party.adults === 2 && search.party.child_ages.join() === q18Kids.join());
const q19AcrossSearches = (google, today) => {
  const city = google.prefix.split("-")[0];
  const searches = q19CitySearches.filter((search) => search.label.startsWith(`${city}-`));
  const own = searches.find((search) => search.label === `${google.prefix}-1n`);
  if (!own) return [];
  const seen = new Set();
  return searches.flatMap((search) => {
    const rows = search.results.filter((row) => row.title === google.title);
    if (search.check_in !== own.check_in || rows.length !== 1 || rows[0].is_paid || rows[0].currency !== "USD" || !Number.isInteger(rows[0].price) || rows[0].price <= 0 || seen.has(rows[0].price)) return [];
    seen.add(rows[0].price);
    return [Object.freeze({ nightly: rows[0].price, title: google.title, check_in: search.check_in, check_out: search.check_out, nights: 1, observed_on: new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(search.checked_at.replace(" +00:00", "Z").replace(" ", "T"))), adults: 2, child_ages: [...search.party.child_ages] })];
  }).map((sample) => liveSample(sample, today, 7)).filter(Boolean).sort((a, b) => a.nightly - b.nightly);
};
const q18Samples = (google, today = q18Today) => google?.acrossSearches ? q19AcrossSearches(google, today) : (google ? ["", "-feb02", "-feb23"] : [])
  .map((tag) => liveSample(q18Night(`${google.prefix}${tag}-1n`, google.title), today, 7)).filter(Boolean)
  .sort((a, b) => a.check_in.localeCompare(b.check_in));
const q18Short = (iso) => new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
const q18Figure = (samples) => { const values = samples.map((sample) => sample.nightly); const low = Math.min(...values), high = Math.max(...values);
  return low === high ? dollars(low) : `${dollars(low)}–${dollars(high)}`; };
const q18Dates = (samples) => [...new Set(samples.map((sample) => sample.check_in))].map((date) => { const here = samples.filter((sample) => sample.check_in === date).map((sample) => dollars(sample.nightly));
  return `${here.length > 1 ? `${here.slice(0, -1).join(", ")} or ${here.at(-1)}` : here[0]} on ${q18Short(date)}, ${date.slice(0, 4)}${here.length > 1 ? " (differed between searches)" : ""}`; }).join(" · ");
const q18LiveDates = (hotels, today) => [...new Set(hotels.flatMap((hotel) => q18Samples(hotel.google, today).map((sample) => sample.check_in)))].sort();
const q18Long = (iso) => new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", { month: "long", day: "numeric", timeZone: "UTC" });
const q18DateList = (dates) => { const parts = dates.map(q18Long); return `${parts.length > 1 ? `${parts.slice(0, -1).join(", ")} and ${parts.at(-1)}` : parts[0]}, ${dates.at(-1).slice(0, 4)}`; };
const q18MonthSpan = (dates) => { const m = (iso) => new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", { month: "short", timeZone: "UTC" });
  return dates.length === 1 ? `${q18Short(dates[0])}, ${dates[0].slice(0, 4)}` : m(dates[0]) === m(dates.at(-1)) ? `${m(dates[0])} ${dates[0].slice(0, 4)}` : `${m(dates[0])}–${m(dates.at(-1))} ${dates.at(-1).slice(0, 4)}`; };
const q18LiveLink = (hotel) => `<a href="https://www.google.com/travel/search?q=${encodeURIComponent(hotel.mapQuery)}">Check live rate</a>`;
const q18Party = `2 adults + ${kidsText(q18Kids)}`;
const q18Seen = (samples) => seenText(samples[0]);
// Price cell: the figure first, then the dates it came from, then Check live rate.
const q18PriceCell = (hotel, today = q18Today, compact = false) => {
  const samples = q18Samples(hotel.google, today);
  if (!samples.length) {
    // Never say Google showed nothing when it did: a conflict is named, and expired samples are not "none".
    if (hotel.google?.conflict) return `<strong>No family price shown</strong><br><small>${esc(hotel.google.conflict)}</small> ${q18LiveLink(hotel)}`;
    if (q18Samples(hotel.google, "0000-00-00").length) return `<strong>No current family price</strong><br><small>Our Google prices for this hotel were for dates now too close or past.</small> ${q18LiveLink(hotel)}`;
    return `<strong>No family price found</strong><br><small>Google showed none for 2 adults + 2 kids on our dates.</small> ${q18LiveLink(hotel)}`;
  }
  if (compact) return `<strong>${esc(q18Figure(samples))} a night</strong><br><small>${esc(`${q18Dates(samples)}.${hotel.google.cellNote ? ` ${hotel.google.cellNote}` : ""}`)}</small> ${q18LiveLink(hotel)}`;
  return `<strong>${esc(q18Figure(samples))} a night</strong><br><small>${esc(`Google Hotels, family of 4, 1 weeknight: ${q18Dates(samples)}. Seen ${q18Short(samples[0].observed_on)}; not a quote.${hotel.google.cellNote ? ` ${hotel.google.cellNote}` : ""}`)}</small> ${q18LiveLink(hotel)}`;
};
// Table rows on pages whose line above the table carries the full basis: figure, date-by-date prices, live link.
const q18DateYears = (dates) => [...new Set(dates.map((iso) => iso.slice(0, 4)))].join(" and ");
const q18Observed = (hotels, today) => hotels.flatMap((hotel) => q18Samples(hotel.google, today)).map((sample) => sample.observed_on).sort().at(-1);
const q18CompactPriceCell = (hotel, today = q18Today) => {
  const samples = q18Samples(hotel.google, today);
  if (!samples.length) return q18PriceCell(hotel, today);
  return `<strong>${esc(q18Figure(samples))} a night</strong><br><small>${esc(samples.map((sample) => `${q18Short(sample.check_in)}: ${dollars(sample.nightly)}`).join(" · ")).replaceAll(": $", ":&nbsp;$").replace(/([A-Z][a-z]{2}) (\d)/g, "$1&nbsp;$2")}</small><br>${q18LiveLink(hotel)}`;
};
const q18CsvCells = (hotel, today = q18Today) => {
  const samples = q18Samples(hotel.google, today);
  return samples.length
    ? [`${q18Figure(samples)} per night (Google Hotels listing; room type, taxes and fees not shown)${hotel.google.cellNote ? `. ${hotel.google.cellNote}` : ""}`, q18Party, samples.map((sample) => `${sample.check_in} to ${sample.check_out}: ${dollars(sample.nightly)}`).join("; "), samples[0].observed_on]
    : [hotel.google?.csvNote || "Check live rate (no Google listing price for this party and these dates)", q18Party, "", ""];
};
// Glance: one line per group, sorted by its lowest figure, naming the hotel behind that figure.
const q18Glance = ({ id, hotels, groups, caveat, basis, today = q18Today, namedDates = false }) => {
  const assigned = groups.flatMap((group) => group.names);
  const missing = hotels.filter((hotel) => !assigned.includes(hotel.name)).map((hotel) => hotel.name);
  if (missing.length || new Set(assigned).size !== assigned.length) throw new Error(`Q18 glance must list every hotel once: ${missing.join(", ")}`);
  const lines = groups.map(({ label, names }) => {
    const members = names.map((name) => hotels.find((hotel) => hotel.name === name));
    const priced = members.flatMap((hotel) => q18Samples(hotel.google, today).map((sample) => ({ hotel, sample })));
    if (!priced.length) return null;
    const low = priced.reduce((a, b) => (b.sample.nightly < a.sample.nightly ? b : a));
    const top = priced.reduce((a, b) => (b.sample.nightly > a.sample.nightly ? b : a));
    const high = top.sample.nightly;
    const unpriced = members.filter((hotel) => !q18Samples(hotel.google, today).length).map((hotel) => hotel.shortName);
    return { low: low.sample.nightly, lowDate: low.sample.check_in, seen: low.sample.observed_on, names: `<strong>${esc(label)}:</strong> ${esc(members.map((hotel) => hotel.name).join(", "))}`,
      render: (lowDate, highDate) => ({ line: `            <li><strong>From ${esc(dollars(low.sample.nightly))}</strong> ${esc(label)} <small>(${esc(low.hotel.shortName)}${low.hotel.glanceLowNote ? `, ${esc(low.hotel.glanceLowNote)}` : ""}${lowDate ? `, ${esc(q18Short(low.sample.check_in))}` : ""}${high > low.sample.nightly ? `; ${top.hotel === low.hotel ? "up to" : top.hotel.glanceHighName ? `${esc(top.hotel.glanceHighName)} up to` : "group up to"} ${esc(dollars(high))}` : ""}${unpriced.length ? `; no price shown: ${esc(unpriced.join(", "))}` : ""})</small></li>`,
      highest: high > low.sample.nightly ? ` Highest: ${dollars(high)}, ${top.hotel.shortName}${highDate ? `, ${q18Short(top.sample.check_in)}` : ""}.` : "" }) };
  }).filter(Boolean).sort((a, b) => a.low - b.low);
  // One sampled date: no per-line dates. Every lowest on one date: the header says so once.
  const sampleDates = q18LiveDates(hotels, today);
  const sameLow = sampleDates.length > 1 && new Set(lines.map((entry) => entry.lowDate)).size === 1;
  for (const entry of lines) Object.assign(entry, entry.render(sampleDates.length > 1 && !sameLow, sampleDates.length > 1));
  if (!lines.length) return `      <section id="${id}" class="container answer-box hotel-budget-glance" aria-label="Nightly budget at a glance">
          <p><strong>About how much a night?</strong> No current family price is shown. Check live rates for your dates, room and kids' ages.</p>
      </section>`;
  // (no dates: the fallback above)
  const dates = q18LiveDates(hotels, today);
  return `      <section id="${id}" class="container answer-box hotel-budget-glance q18-glance" aria-label="Nightly budget at a glance">
          <p><strong>About how much a night?</strong> Family of 4, ${esc(namedDates ? `${dates.length > 1 ? "two Tuesdays" : "one Tuesday"}, ${dates.map(q18Short).join(" and ")}, ${dates.at(-1).slice(0, 4)}` : `${dates.length > 1 ? "weeknights" : "a weeknight"} ${q18MonthSpan(dates)}`)} (estimate${sameLow ? `; lowest ${q18Short(lines[0].lowDate)}` : ""}):</p>
          <ul>
${lines.map((entry) => entry.line).join("\n")}
          </ul>
          <p class="q18-basis">${esc(`Google Hotels, 2 adults + ${kidsText(q18Kids)}, seen ${q18Short(lines[0].seen)}. ${caveat}`)} <a href="#hotel-comparison">Check live rates for your dates</a>.</p>
          <details><summary>Hotels in each group and how prices were checked</summary>${lines.map((entry) => `<p>${entry.names}.${esc(entry.highest)}</p>`).join("")}<p>${esc(basis)}</p></details>
      </section>`;
};

// Q18 (2026-10-31, D25 2026-11-01): Las Vegas retired its editorial bands (upper ends never observed) and then its July 22
// samples (their stays had passed). Each hotel shows Google Hotels one-night prices for 2 adults + kids 5 and 8.
const q18BasisFor = (hotels, today, { taxes, extras, notPrices, seen = "October 31, 2026" }) => {
  const dates = q18LiveDates(hotels, today);
  if (!dates.length) return `No current family price is shown: the Google Hotels prices for ${q18Party} seen ${seen} were for dates that are now less than a week away or past. Check live rates for your dates, room and kids' ages. ${extras}`;
  return `Prices are Google Hotels listing prices per night for ${q18Party}, one night on Tuesday ${q18DateList(dates)}, seen ${seen}. Google does not show the room type, the number of rooms, or which ${taxes} are included, so these are estimates, not quotes${notPrices}. Weekends and events can cost more, and prices swung widely by date: check live rates for your own dates. Older July 2026 samples are no longer shown because their stays have passed. ${extras}`;
};
const lasVegasPriceBasisFor = (today = q18Today) => q18BasisFor(lasVegasFamilyHotels, today, { taxes: "taxes and resort fees", notPrices: " or family-suite prices", extras: "Parking, resort charges, food, a suite or a second room may be extra." });

function lasVegasHotelComparisonCsv(today = q18Today) {
  const headings = ["Hotel", "Trip style", "Area", "Nightly price (USD, Google Hotels listing)", "Party", "Nights priced (check-in to check-out: price)", "Price seen", "Price basis and fee limits", "Price context", "Room capacity spot-checked", "Named room", "Published capacity", "Official room source", "Most important check", "Map", "Live comparison"];
  const rows = lasVegasFamilyHotels.map((hotel) => [
    hotel.name, hotel.category, hotel.area, ...q18CsvCells(hotel, today),
    lasVegasPriceBasisFor(today),
    hotel.priceNote, hotel.roomCapacity ? lasVegasRoomCapacityChecked : "Not individually spot-checked",
    hotel.roomCapacity?.label ?? "", hotel.roomCapacity?.capacity ?? "", hotel.roomCapacity?.source ?? "",
    hotel.parentCheck, `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hotel.mapQuery)}`,
    "https://familytripwise.com/where-to-stay/las-vegas-family-hotels.html#hotel-comparison"
  ]);
  return hotelComparisonCsv(headings, rows);
}

function lasVegasFamilyHotelPage(today = q18Today) {
  const hotels = lasVegasFamilyHotels;
  const lasVegasPriceCell = (hotel) => q18PriceCell(hotel, today);
  const lasVegasPriceBasis = lasVegasPriceBasisFor(today);
  const liveDates = q18LiveDates(hotels, today);
  const hotelId = index => `las-vegas-hotel-${index + 1}`;
  const cards = hotels.map((hotel, index) => `          <article class="detail-card hotel-card" id="${hotelId(index)}">
            <p class="eyebrow">${esc(hotel.category)}</p>
            <h3>${esc(hotel.name)}</h3>
            <dl class="hotel-facts">
              <div><dt>Area</dt><dd>${esc(hotel.area)}</dd></div>
              <div><dt>Nightly price (family of 4)</dt><dd>${lasVegasPriceCell(hotel)} <a href="#las-vegas-price-basis">Price basis</a></dd></div>
              <div><dt>Map</dt><dd><a href="${googleMapsUrl(hotel.mapQuery)}">Open in Google Maps</a></dd></div>
            </dl>
            <section><h4>Why compare it</h4><ul>${hotel.strengths.map((item) => `<li>${esc(item)}</li>`).join("")}</ul></section>
            <section><h4>Room and family setup</h4><p>${esc(hotel.familySetup)}</p>${hotel.roomCapacity ? `<p><strong>Room capacity checked ${esc(lasVegasRoomCapacityChecked)}:</strong> ${esc(hotel.roomCapacity.label)} is listed for ${esc(hotel.roomCapacity.capacity)}. ${esc(hotel.roomCapacity.note)} <a href="${esc(hotel.roomCapacity.source)}">Official room record</a>.</p>` : ""}</section>
            <section><h4>Themes in sampled online reviews</h4><p>${esc(hotel.reviewSignal)}</p></section>
            <section><h4>Price context and key check</h4><p>${esc(hotel.priceNote)} ${esc(hotel.parentCheck)}</p><p>Google prices are listing prices for 2 adults and 2 kids, not a quote or a five-person suite price.</p></section>
          </article>`).join("\n");

  const rows = hotels.map((hotel, index) => `              <tr>
                <td><a href="#${hotelId(index)}">${esc(hotel.name).replaceAll("/", "/<wbr>")}</a></td>
                <td>${lasVegasPriceCell(hotel)}</td>
                <td>${esc(hotel.category)}</td>
                <td>${esc(hotel.area)}</td>
                <td><a href="${googleMapsUrl(hotel.mapQuery)}">Map</a></td>
                <td>${esc(hotel.parentCheck.split(".")[0])}.</td>
              </tr>`).join("\n");

  const faqs = [
    ["What is the best family hotel in Las Vegas?", "There is no single best hotel for every family. Mandalay Bay fits a water-resort trip, Vdara and Marriott's Grand Chateau fit different suite needs, Tahiti Village and Cancun Resort fit off-Strip water time, and the other options answer distinct budget, older-kid, luxury, or nature-base needs."],
    ["Should a family stay on or off the Las Vegas Strip?", "Stay on the Strip when the chosen hotel and nearby activities reduce transfers enough to outweigh casino, crowd, and walking friction. Stay off the Strip when a kitchen, parking, waterslides, a quieter reset pattern, or a Red Rock day matters more than immediate resort access."],
    ["Do these nightly prices include resort fees and taxes?", liveDates.length ? `Not necessarily. The figures are Google Hotels listing prices per night for 2 adults and kids 5 and 8 on Tuesday ${q18DateList(liveDates)}, seen October 31, 2026. Google does not show the room type or which taxes and resort fees are included, so treat them as estimates. Parking and optional purchases can be extra. Compare the exact room, party, dates, fees and full stay total before booking.` : "No current family price is shown on this page. Las Vegas rates can add resort fees and taxes on top of the room price, and parking can be extra. Compare the exact room, party, dates, fees and full stay total before booking."]
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
    itemListElement: hotels.map((hotel, index) => ({ "@type": "ListItem", position: index + 1, name: hotel.name, description: (() => { const samples = q18Samples(hotel.google, today); return `${hotel.category}; ${samples.length ? `Google Hotels listing ${q18Figure(samples)} per night for ${q18Party} (${q18Dates(samples)}), seen ${q18Seen(samples)}; estimate, not a quote` : "no Google listing price for a family of four on our dates; check live rate"}`; })() }))
  };

  const body = `    <main id="main">
      <section id="las-vegas-hotel-intro" class="page-hero hotel-hero">
        <div class="container">
          <p class="eyebrow">Las Vegas family hotels</p>
          <h1>Las Vegas Family Hotels</h1>
          ${contributorCredit()}
          <p>Ten Las Vegas hotels that work for families, compared by room setup, pools, casino exposure, area and nightly price. <a href="#las-vegas-room-fit">Party of 5 or more? Rooms that fit</a>.</p>
        </div>
      </section>
      <section class="container media-section hero-photo-section">
        <figure class="licensed-photo hero-photo">
          <img src="../images/las-vegas-bellagio-fountains.webp" style="object-position:50% 80%" alt="The Bellagio fountains and Las Vegas Strip at night." width="1600" height="1062" loading="eager" fetchpriority="high" decoding="async">
          <figcaption>Photo: Chensiyuan via <a href="https://commons.wikimedia.org/wiki/File:Bellagio_fountain_show_2010_las_vegas.JPG">Wikimedia Commons</a>, <a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a>. Resized and cropped.</figcaption>
        </figure>
      </section>
${q18Glance({
  id: "las-vegas-budget-glance",
  hotels,
  today,
  groups: [
    { label: "themed lower-price Strip hotels", names: ["Excalibur Hotel & Casino", "New York-New York Hotel & Casino"] },
    { label: "off-Strip pools, slides and lazy rivers", names: ["Tahiti Village Resort", "Hilton Vacation Club Cancun Resort Las Vegas", "Red Rock Casino Resort & Spa"] },
    { label: "Strip pools, suites and kitchens", names: ["Mandalay Bay Resort and Casino", "Vdara Hotel & Spa", "Marriott's Grand Chateau", "Las Vegas Hilton at Resorts World"] },
    { label: "non-gaming luxury", names: ["Four Seasons Hotel Las Vegas"] }
  ],
  caveat: "Room type, taxes and resort fees not shown; prices swing a lot by date.",
  basis: lasVegasPriceBasis
})}
      <section id="las-vegas-hotel-answer" class="container answer-box" aria-label="Short answer">
        <p><strong>Fits:</strong> a beach pool complex and Shark Reef (Mandalay Bay); kitchenette or full-kitchen suites (Vdara, Marriott's Grand Chateau); a lazy river or waterslides off the Strip (Tahiti Village, Cancun Resort); no casino in the hotel (Vdara; Four Seasons, which shares Mandalay Beach).</p>
        <p><strong>Main catch:</strong> Google does not show the room type, taxes, resort fees or parking, which can sit on top of these prices, so compare the full stay total before booking.</p>
      </section>
      <section class="container trust-panel" aria-label="Review status">
        <p><strong>Hotel facts and review sources checked:</strong> July 22, 2026; ${liveDates.length ? "<strong>Google family prices seen:</strong> October 31, 2026" : "no current family price shown"}<br><strong>Four room-capacity records spot-checked:</strong> ${esc(lasVegasRoomCapacityChecked)}. This does not renew prices or other hotel facts.</p>
      </section>
      <section id="hotel-comparison" class="band" data-glance-first>
        <div class="container">
          <div class="section-heading"><p class="eyebrow">Comparison</p><h2>Quick hotel comparison</h2></div>
          <p>${liveDates.length ? "Google Hotels prices for a family of 4 (2 adults + 2 kids), not quotes." : "No current family price shown: check live rates."} <a href="#las-vegas-price-basis">Price basis</a>. Scroll sideways on a phone.</p>
          <div class="comparison-scroll" role="region" aria-label="Las Vegas hotel comparison" tabindex="0">
            <table class="comparison-table hotel-comparison">
              <thead><tr><th>Hotel</th><th>Nightly price (family of 4)</th><th>Best starting point for</th><th>Area</th><th>Map</th><th>Most important check</th></tr></thead>
              <tbody>
${rows}
              </tbody>
            </table>
          </div>
          <details><summary>Spreadsheet copy</summary><p><a href="https://familytripwise.com/where-to-stay/las-vegas-family-hotels.html#hotel-comparison">Direct link to this comparison</a> or <a href="../downloads/las-vegas-family-hotels.csv" download>download the ten-hotel comparison (.csv)</a>. The download keeps each hotel's Google prices, dates, party and price limits.</p></details>
          <details id="las-vegas-price-basis" style="scroll-margin-top: 80px"><summary>Price basis: Google listing prices, not quotes</summary><p>${esc(lasVegasPriceBasis)}</p></details>
        </div>
      </section>
      <section class="band intro-band">
        <div class="container answer-grid">
          <div>
            <p class="eyebrow">Short answer</p>
            <h2>Choose the hotel that removes the biggest family friction</h2>
            <p>Mandalay Bay and Four Seasons share the strongest water-resort setup at different price and atmosphere levels. Vdara and Marriott's Grand Chateau solve two different central-suite needs. Tahiti Village and Cancun Resort trade centrality for kitchens and water time. Use the other four when themed value, older-kid energy, a modern North Strip resort, or a Summerlin base matters more.</p>
            <p><a class="text-link" href="./las-vegas-with-kids.html">Compare Las Vegas stay areas and property constraints</a></p>
          </div>
          <dl class="snapshot" id="las-vegas-room-fit">
            <div><dt>Five or more</dt><dd>${hotels.filter((hotel) => hotel.roomCapacity?.fivePlusStart).map((hotel) => `<a href="${esc(hotel.roomCapacity.source)}">${esc(hotel.roomCapacity.label)}</a> (${esc(hotel.roomCapacity.capacity)})`).join("; ")}. Vdara: two-bedroom luxury suite or two rooms. Compare same-date five-guest totals, not older July room samples.</dd></div>
            <div><dt>Price format</dt><dd>Google Hotels prices for 2 adults + 2 kids on dated nights; five-person suite total unverified</dd></div>
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
        <p>Room and amenity facts come from official property pages. Online-review notes paraphrase a small directional sample from public booking and review sites; they are not representative ratings or firsthand stays. ${liveDates.length ? "Nightly prices are Google Hotels listing prices for a family of 4 on dated nights, not booking quotes; each one comes off this page a week before its date." : "No current family price is shown: the Google Hotels prices seen October 31, 2026 were for dates now less than a week away or past."}</p>
        <ul class="source-list">
${lasVegasHotelSources.map(([label, href]) => `          <li><a href="${esc(href)}">${esc(label)}</a></li>`).join("\n")}
          <li><a href="https://commons.wikimedia.org/wiki/File:Bellagio_fountain_show_2010_las_vegas.JPG">Las Vegas photo source and attribution</a> by Chensiyuan; <a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0 license</a></li>
          <li>Public Expedia, Booking.com, Hotels.com, Tripadvisor, Trip.com, Hilton, and Marriott price or review pages checked July 22, 2026; exact URLs and evidence limits are recorded in the evidence pack.</li>
          <li>Google Hotels listing prices for 2 adults and kids 5 and 8, ${liveDates.length ? `Tuesday ${liveDates.length > 1 ? "nights" : "night"} ${esc(q18DateList(liveDates))}` : "January and February 2027 dates no longer shown"}, seen October 31, 2026 via DataForSEO (receipts docs/research/dataforseo-q18-lv-chicago-hotel-prices-a/b-2026-11-01.json and dataforseo-q18-lv-hotel-prices-d/e/f-2026-11-01.json in github.com/agarg21/family-tripwise).</li>
        </ul>
      </section>
      <script type="application/ld+json">${JSON.stringify(itemListJson)}</script>
      <script type="application/ld+json">${JSON.stringify(faqJson)}</script>
    </main>`;

  return pageShell({
    title: "Top Family Hotels in Las Vegas: 10 Options by Trip Style",
    description: "Compare 10 Las Vegas family hotels by trip style, nightly price for a family of 4, room setup, pools, casino or non-gaming context, location, and sampled online-review themes.",
    canonical: "where-to-stay/las-vegas-family-hotels.html",
    nav: [["./las-vegas-with-kids.html", "Where to stay"], ["../things-to-do/las-vegas-with-kids.html", "Things to do"], ["../family-itinerary/las-vegas-with-kids.html", "Itinerary"]],
    body
  });
}

// G18 (OWNER D39): weekend and holiday price rendering shared by city hotel pages (docs/plan/hotel-price-samples.md).
const g18Sets = {
  weekend: { tags: ["jan22", "jan23"], label: "Fri–Sun, Jan 22–24, 2027" },
  christmas: { tags: ["dec25", "dec26"], label: "Christmas weekend, Fri Dec 25 – Sun Dec 27, 2026" },
  newYear: { tags: ["jan01", "jan02"], label: "New Year's weekend, Fri Jan 1 – Sun Jan 3, 2027" }
};
const weekendCity = ({ key, searches, seen, seenLong }) => {
  const setPrice = (hotel, set, today = q18Today) => {
    const weekend = weekendPrice(searches, { prefix: hotel.google.prefix, title: hotel.google.title, tags: g18Sets[set].tags, childAges: q18Kids });
    return weekendLive(weekend, today) ? weekend : null;
  };
  const figure = (w) => (w.both ? `≈ ${dollars(w.average)}` : dollars(w.average));
  const oneNight = (w) => (w.fri.nightly !== null ? "Friday only" : "Saturday only");
  const also = (w) => [["Fri", w.fri], ["Sat", w.sat]].filter(([, night]) => night.also.length).map(([day, night]) => `${day} also ${night.also.map(dollars).join(", ")} in another search`).join("; ");
  const weekendDetail = (w) => [w.both ? `Fri ${dollars(w.fri.nightly)}, Sat ${dollars(w.sat.nightly)} · 2 nights ≈ ${dollars(w.total)}` : `${w.fri.nightly !== null ? "Saturday" : "Friday"}: no price shown`, also(w)].filter(Boolean).join(". ");
  const noPrice = (hotel, today) => {
    if (!weekendLive(weekendPrice(searches, { prefix: hotel.google.prefix, title: hotel.google.title, tags: g18Sets.weekend.tags, childAges: q18Kids }), today)) return `<strong>No current family price</strong><br><small>Our weekend prices are now too close or past.</small> ${q18LiveLink(hotel)}`;
    return `<strong>No price shown on ${seen}</strong><br><small>${esc(hotel.google.conflict || "Google listed this hotel with no price for Jan 22-23.")}</small> ${q18LiveLink(hotel)}`;
  };
  const weekendHead = (w) => `<strong>${esc(figure(w))} a night</strong>${w.both ? "" : ` <small>(${esc(oneNight(w))})</small>`}`;
  const priceCell = (hotel, today) => {
    const w = setPrice(hotel, "weekend", today);
    if (!w?.any) return noPrice(hotel, today);
    return `${weekendHead(w)}<br><small>${esc(`${weekendDetail(w)}.${hotel.google.cellNote ? ` ${hotel.google.cellNote}` : ""}`)}</small> ${q18LiveLink(hotel)}`;
  };
  const csvCell = (hotel, set, today) => {
    const w = setPrice(hotel, set, today);
    if (!w) return "";
    if (!w.any) return `No price shown on ${seen}`;
    return `${figure(w)} per night${w.both ? "" : `, ${oneNight(w)}`} (${weekendDetail(w)})`;
  };
  const holidayNight = (night) => (night.nightly === null ? `<span class="hotel-no-price">No price</span>` : `${dollars(night.nightly)}${night.also.length ? `<small> (also ${night.also.map(dollars).join(", ")})</small>` : ""}`);
  const holidayTable = (hotels, set, heading, friLabel, satLabel, today) => {
    const rows = hotels.map((hotel) => ({ hotel, w: setPrice(hotel, set, today) }));
    if (!rows.every((row) => row.w)) return "";
    const priced = rows.filter((row) => row.w.any).sort((a, b) => a.w.low - b.w.low);
    const none = rows.filter((row) => !row.w.any).map((row) => row.hotel.shortName);
    return `          <h3>${esc(heading)}</h3>
            <div class="comparison-scroll" role="region" aria-label="${esc(heading)}" tabindex="0">
              <table class="comparison-table hotel-holiday-table">
                <thead><tr><th>Hotel</th><th>${esc(friLabel)}</th><th>${esc(satLabel)}</th><th>Seen</th></tr></thead>
                <tbody>
  ${priced.map(({ hotel, w }) => `                <tr><td>${esc(hotel.shortName)}</td><td>${holidayNight(w.fri)}</td><td>${holidayNight(w.sat)}</td><td>${seen}</td></tr>`).join("\n")}
                </tbody>
              </table>
            </div>
  ${none.length ? `          <p class="hotel-holiday-note">No price shown on ${seen} for either night: ${esc(none.join(", "))}. That does not mean sold out.</p>\n` : ""}`;
  };
  const holidayNames = (hotels, today) => [["christmas", "Christmas"], ["newYear", "New Year"]].filter(([set]) => hotels.every((hotel) => setPrice(hotel, set, today))).map(([, name]) => name);
  const glance = (hotels, groups, today) => {
    const holidayList = holidayNames(hotels, today);
    const lines = groups.map(({ label, names }) => {
      const members = names.map((name) => hotels.find((hotel) => hotel.name === name)).map((hotel) => ({ hotel, w: setPrice(hotel, "weekend", today) }));
      const priced = members.filter((member) => member.w?.any).sort((a, b) => a.w.average - b.w.average);
      if (!priced.length) return null;
      const [low, top] = [priced[0], priced.at(-1)];
      const unpriced = members.filter((member) => !member.w?.any).map((member) => member.hotel.shortName);
      const parts = [`${low.hotel.shortName}${low.hotel.glanceLowNote ? `, ${low.hotel.glanceLowNote}` : ""}${low.w.both ? "" : `, ${oneNight(low.w)}`}`];
      if (top !== low) parts.push(`${top.hotel.glanceHighName ? `${top.hotel.glanceHighName} up to` : "group up to"} ${dollars(top.w.average)}${top.w.both ? "" : `, ${oneNight(top.w)}`}`);
      if (unpriced.length) parts.push(`no price shown: ${unpriced.join(", ")}`);
      return { low: low.w.average, approx: low.w.both ? "≈ " : "", label, parts, names: members.map((member) => member.hotel.name) };
    }).filter(Boolean).sort((a, b) => a.low - b.low);
    if (!lines.length) return `      <section id="${key}-budget-glance" class="container answer-box hotel-budget-glance" aria-label="Nightly budget at a glance">
            <p><strong>About how much a night?</strong> No current family price is shown. Check live rates for your dates, room and kids' ages.</p>
        </section>`;
    return `      <section id="${key}-budget-glance" class="container answer-box hotel-budget-glance q18-glance" aria-label="Nightly budget at a glance">
            <p><strong>About how much a night?</strong> Family of 4, ${esc(g18Sets.weekend.label)} (estimate):</p>
            <ul>
  ${lines.map((entry) => `            <li><strong>From ${esc(entry.approx)}${esc(dollars(entry.low))}</strong> ${esc(entry.label)} <small>(${esc(entry.parts.join("; "))})</small></li>`).join("\n")}
            </ul>
            <p class="q18-basis">${esc(`Google Hotels, ${q18Party}, seen ${seen}. Room type, taxes and fees not shown.`)} ${holidayList.length ? `<a href="#${key}-holiday-prices">${holidayList.join(" and ")} prices</a> · ` : ""}<a href="#hotel-comparison">Check live rates for your dates</a>.</p>
            <details><summary>Hotels in each group and how prices were checked</summary>${lines.map((entry) => `<p><strong>${esc(entry.label)}:</strong> ${esc(entry.names.join(", "))}.</p>`).join("")}<p>Full method under Full price basis, below the table.</p></details>
        </section>`;
  };
  return { setPrice, figure, oneNight, weekendDetail, noPrice, weekendHead, priceCell, csvCell, holidayTable, holidayNames, glance };
};

// G18 (OWNER D39): San Diego uses the shared renderer. Family of 5 stays a separate party on the same weekend, Homewood only.
const sanDiegoSeen = "Nov 5";
const sanDiegoSeenLong = "November 5, 2026";
const sanDiegoSearches = "abcdefghij".split("").flatMap((part) => readReceipt(`dataforseo-g18-sd-${part}-2026-11-05.json`).searches);
const sanDiegoCity = weekendCity({ key: "san-diego", searches: sanDiegoSearches, seen: sanDiegoSeen, seenLong: sanDiegoSeenLong });
const sanDiegoFiveKids = [4, 8, 12];
function sanDiegoHomewoodFive(today = q18Today) {
  const weekend = weekendPrice(sanDiegoSearches, { prefix: "sd-homewood-five", title: "Homewood Suites by Hilton San Diego Downtown/Bayside", tags: g18Sets.weekend.tags, childAges: sanDiegoFiveKids });
  if (!weekend.any || !weekendLive(weekend, today)) return null;
  const line = `${sanDiegoCity.figure(weekend)} a night (${sanDiegoCity.weekendDetail(weekend)})`;
  return { weekend, line,
    text: `Google Hotels, family of 5 (2 adults and ${kidsText(sanDiegoFiveKids)}), ${g18Sets.weekend.label}: ${line}, seen ${sanDiegoSeenLong}. Room type and number of rooms not shown; taxes, valet and other fees may be extra. Not a quote; the hotel has not confirmed 3 kids in this room.` };
}
const sanDiegoPriceBasisFor = (today = q18Today) => {
  const live = sanDiegoFamilyHotels.some((hotel) => sanDiegoCity.setPrice(hotel, "weekend", today)?.any);
  const four = live
    ? `Prices are Google Hotels listing prices per night for ${q18Party}, seen ${sanDiegoSeenLong}. Each weekend is two 1-night searches, Friday and Saturday, so each figure is one night: we show the average a night and the 2-night sum, labelled estimate. Where a search showed only one of the two nights we say so and do not add them up. The same hotel sometimes showed different prices in separate searches moments apart, and we do not know why, so those figures are shown too. Google does not show the room type, the number of rooms, or which taxes and fees are included, so these are estimates, not quotes. LEGOLAND figures are the Castle Hotel room price, not a hotel-and-tickets package.`
    : `No current family price is shown: the Google Hotels prices for ${q18Party} seen ${sanDiegoSeenLong} were for a weekend that is now less than a week away or past. Check live rates for your dates, room and kids' ages.`;
  const five = sanDiegoHomewoodFive(today) ? ` The Homewood family-of-5 price is a separate Google Hotels search (2 adults and ${kidsText(sanDiegoFiveKids)}) for the same weekend.` : "";
  return `${four}${five} "No price shown" means Google listed no price on the day we looked; it does not mean sold out. Resort fees, parking, food and a second room may be extra. Older samples are no longer shown because their stays have passed or they did not match a normal family weekend.`;
};

const chicagoFamilyHotels = [
  {
    name: "Embassy Suites by Hilton Chicago Downtown Magnificent Mile",
    google: { prefix: "chi-embassy-suites", title: "Embassy Suites by Hilton Chicago Downtown Magnificent Mile" },
    category: "Two-room suite, breakfast, and pool",
    area: "Streeterville",
    priceRange: "Check live rate",
    olderSample: { amount: "$282", source: "Expedia", recorded: "2026-07-23", stay: "2026-08-11" },
    shortName: "Embassy Suites",
    strengths: ["Two-room suites can separate sleep from adult downtime", "Made-to-order breakfast and an indoor pool keep two recurring family costs or needs in one place"],
    familySetup: "Hilton lists suites, made-to-order breakfast, an evening reception, indoor pool, cribs, and a daily destination charge. Children 17 and under stay free in the same suite with a parent; exact bedding and occupancy still depend on the suite.",
    reviewSignal: "The inspected sample included positive mentions of suite space, breakfast, pool, and location. It also surfaced elevator disruption, crowding, room condition, towels, and housekeeping.",
    priceNote: "Larger suites, weekends, and event dates can price well above the Google price.",
    parentCheck: "Confirm exact suite bedding and occupancy, current elevator and pool status, destination charge, parking, and final total.",
    mapQuery: "Embassy Suites Chicago Downtown Magnificent Mile"
  },
  {
    name: "Homewood Suites by Hilton Chicago-Downtown",
    google: { prefix: "chi-homewood", title: "Homewood Suites by Hilton Chicago-Downtown" },
    category: "Kitchen, breakfast, and indoor-pool base",
    area: "River North",
    priceRange: "Check live rate",
    olderSample: { amount: "$209", source: "Expedia", recorded: "2026-07-23", stay: "2026-08-16" },
    shortName: "Homewood",
    strengths: ["Full kitchens and hot breakfast reduce meal setup", "An indoor pool and published connecting rooms add flexibility for longer stays"],
    familySetup: "Hilton lists a full kitchen, free hot breakfast, indoor pool, connecting rooms, and a location one block from Michigan Avenue. Confirm a true one-bedroom category when a door between sleep and living space matters.",
    reviewSignal: "The inspected sample included positive mentions of suite space, kitchen, breakfast, location, and the pool. It also surfaced dated condition, city noise, pool availability or crowding, breakfast variation, and valet waits or billing.",
    priceNote: "One-bedroom categories and peak dates can price above the Google price.",
    parentCheck: "Confirm the exact suite layout, pool status, breakfast setup, recent room condition, valet total, and final price.",
    mapQuery: "Homewood Suites by Hilton Chicago Downtown 40 East Grand"
  },
  {
    name: "Residence Inn Chicago Downtown/River North",
    google: { prefix: "chi-residence-inn", title: "Residence Inn by Marriott Chicago Downtown/River North" },
    category: "Kitchen and breakfast without a pool requirement",
    area: "River North",
    priceRange: "Check live rate",
    olderSample: { amount: "$268", source: "Expedia", recorded: "2026-07-23", stay: "2026-08-16" },
    shortName: "Residence Inn",
    strengths: ["Every suite has a full-size kitchen and breakfast is included", "On-site laundry and grocery-shopping service can help on a longer trip"],
    familySetup: "Marriott lists all suites, full-size kitchens, complimentary hot breakfast, on-site laundry, grocery-shopping service, and self or valet parking. Bedding, sofa-bed setup, and whether the sleeping area has a door vary by category.",
    reviewSignal: "The inspected sample included positive mentions of kitchens, breakfast, location, staff, and suite usefulness. It also surfaced room-specific city noise, kitchen supplies, the small gym, and summer value.",
    priceNote: "Exact suite, events, and summer weekends can price above the Google price.",
    parentCheck: "Confirm bedding, bedroom separation, sofa-bed setup, kitchen equipment, parking, and the final total for the same suite.",
    mapQuery: "Residence Inn Chicago Downtown River North"
  },
  {
    name: "Sable at Navy Pier Chicago, Curio Collection by Hilton",
    google: { prefix: "chi-sable", title: "Sable at Navy Pier Chicago, Curio Collection by Hilton" },
    category: "Navy Pier-centered younger-child trip",
    area: "Navy Pier / Streeterville",
    priceRange: "Check live rate",
    olderSample: { amount: "$311", source: "Expedia", recorded: "2026-07-23", stay: "2026-08-17" },
    shortName: "Sable",
    strengths: ["The hotel can put Chicago Children's Museum and pier activities at the day's starting point", "Official two-queen rooms and suites sleep four, with lake or skyline views"],
    familySetup: "Official sources list two-queen rooms and suites sleeping four, mini fridges, cribs, confirmed connecting rooms, paid breakfast, and pier parking. The property has no pool.",
    reviewSignal: "The inspected sample included positive mentions of views, room condition, and Navy Pier access. It also surfaced the long pier approach, wayfinding, parking cost, service inconsistency, and elevator disruption.",
    priceNote: "Pier events, views, suites, and weekends can price above the Google price.",
    parentCheck: "Decide whether a pier base helps more than it complicates other days, then verify bedding, event calendar, parking, and final total.",
    mapQuery: "Sable at Navy Pier Chicago"
  },
  {
    name: "Swissotel Chicago",
    google: { prefix: "chi-swissotel", title: "Swissotel Chicago" },
    category: "Purpose-built Kids Suite",
    area: "New Eastside",
    priceRange: "Check live rate",
    olderSample: { amount: "$235", source: "Expedia", recorded: null, stay: null },
    shortName: "Swissotel",
    strengths: ["The current Kids Suite offer creates separate adult and child spaces", "The offer includes toys, games, movie night, and breakfast under stated terms"],
    familySetup: "The Kids Suite offer lists a two-room setup with a dedicated children's space and breakfast for two adults and up to two children, subject to availability. Public standard double-room inventory lists two double beds for four.",
    reviewSignal: "The inspected sample included positive mentions of views, river or lake location, room size, and staff. It also surfaced dated finishes, the experience fee, parking access, room assignment or service inconsistency, and offer availability.",
    priceNote: "The Google price is not a Kids Suite quote; the Kids Suite offer and mandatory experience fee can price higher.",
    parentCheck: "Confirm the actual Kids Suite, breakfast terms, fee, parking, bedding, and final total rather than assuming a standard room includes the family setup.",
    mapQuery: "Swissotel Chicago"
  },
  {
    name: "InterContinental Chicago Magnificent Mile",
    google: { prefix: "chi-intercontinental", title: "InterContinental Chicago Magnificent Mile by IHG" },
    category: "Historic indoor-pool base",
    area: "Magnificent Mile",
    priceRange: "Check live rate",
    olderSample: { amount: "$305", source: "Expedia", recorded: "2026-07-23", stay: "2026-08-09" },
    shortName: "InterContinental",
    strengths: ["The heated junior Olympic-size indoor pool is a distinct weather-backup amenity", "Official room inventory includes two-double rooms and requestable connecting rooms or cribs"],
    familySetup: "IHG lists classic and premium rooms with two double beds or one king, connecting rooms and cribs by request, and a heated junior Olympic-size indoor pool. Notice rechecked September 22, 2026: IHG still publishes an August 10-September 16 project schedule, with August 11 and September 10 closures; the notice omits the year, while its amenities page dates the September 10 closure to 2026. The published window has passed, but completion and current access are unconfirmed. The notice describes project-period daytime construction, unavailable locker rooms, relocated pool movies and unavailable Resort Pass purchases, not verified conditions today. Published hours also conflict: 7am-10pm on the pool page versus 5am-10pm on amenities. Confirm current hours, changing facilities and guest or day-pass access for your visit.",
    reviewSignal: "The inspected sample included positive mentions of the pool, location, historic character, and staff. It also surfaced pool crowding or depth, variable rooms, maintenance details, and parking cost.",
    priceNote: "Larger rooms, events, and weekends can price above the Google price.",
    parentCheck: "Recheck current pool access and project conditions, depth fit, exact two-double room, connecting request, parking, and final total.",
    mapQuery: "InterContinental Chicago Magnificent Mile"
  },
  {
    name: "Hilton Chicago",
    google: { prefix: "chi-hilton", title: "Hilton Chicago" },
    category: "Museum Campus and Grant Park base",
    area: "South Loop",
    priceRange: "Check live rate",
    olderSample: { amount: "$308", source: "Expedia", recorded: null, stay: null },
    shortName: "Hilton Chicago",
    strengths: ["Grant Park and Museum Campus can shape the first half of the trip", "Hilton publishes two-double rooms, an indoor pool, game room, and larger family-connection layouts"],
    familySetup: "Hilton lists two-double rooms sleeping four, an indoor pool, connecting rooms, cribs, game room, and larger family-connection or specialty layouts. Standard and specialty options differ sharply in space and total price.",
    reviewSignal: "The inspected sample included positive mentions of Grant Park location, historic public spaces, pool, staff, and larger layouts. It also surfaced housekeeping consistency, dated-room variation, event-scale crowds, and parking cost.",
    priceNote: "The Google price is not a specialty-layout quote; specialty layouts and convention dates can price far higher.",
    parentCheck: "Compare the standard room with the exact larger layout needed, then verify pool, event calendar, parking, and final total.",
    mapQuery: "Hilton Chicago 720 South Michigan Avenue"
  },
  {
    name: "Hotel Zachary Chicago, a Tribute Portfolio Hotel",
    google: { prefix: "chi-zachary", title: "Hotel Zachary, Chicago, a Tribute Portfolio Hotel" },
    category: "Wrigleyville and older-kid trip",
    area: "Lakeview / Wrigleyville",
    priceRange: "Check live rate",
    olderSample: { amount: "$363", source: "Expedia", recorded: "2026-07-23", stay: "2026-08-10" },
    shortName: "Hotel Zachary",
    strengths: ["Direct Wrigley Field positioning makes a Cubs game or concert the trip anchor", "Official inventory includes double-queen and ballpark-view categories"],
    familySetup: "Official pages list king and double-queen rooms directly across from Wrigley Field, with neighborhood dining and ballpark-view categories.",
    reviewSignal: "The inspected sample included positive mentions of Wrigley views, room condition, staff, and event convenience. It also surfaced event pricing, noise, blocked streets or rideshare friction, parking, breakfast cost, and limited cold storage.",
    priceNote: "Cubs games and concerts can price far above the Google price.",
    parentCheck: "Check the Wrigley event calendar first, then bedding, refrigerator status, post-event transport, parking, and final total.",
    mapQuery: "Hotel Zachary Chicago"
  },
  {
    name: "Four Seasons Hotel Chicago",
    google: { prefix: "chi-four-seasons", title: "Four Seasons Hotel Chicago" },
    category: "Luxury family amenities and pool",
    area: "Gold Coast",
    priceRange: "Check live rate",
    olderSample: { amount: "$630", source: "Expedia", recorded: "2026-07-23", stay: "2026-08-09" },
    shortName: "Four Seasons",
    strengths: ["The current family program combines an indoor pool, child amenities, and a play space", "Two-double lake-view rooms publicly sleep four, with larger suite choices available"],
    familySetup: "Current Four Seasons materials list a 44-foot indoor pool, family programming and child amenities, complimentary dining for children under five under stated terms, and two-double lake-view rooms for four.",
    reviewSignal: "The inspected sample included positive mentions of service, pool, child amenities, views, room space, and location. It also surfaced the high total, occasional service mismatch, pool crowding, and room-layout questions.",
    priceNote: "Two-double rooms, suites, weekends, dining, and parking can push the total well above the Google price.",
    parentCheck: "Price the exact room or suite and confirm bedding, pool timing, child-dining terms, parking, and the value of the family amenities.",
    mapQuery: "Four Seasons Hotel Chicago"
  },
  {
    name: "The Langham, Chicago",
    google: { prefix: "chi-langham", title: "The Langham, Chicago" },
    category: "Riverfront luxury with a larger pool",
    area: "Chicago River / River North",
    priceRange: "Check live rate",
    olderSample: { amount: "$600", source: "Expedia", recorded: "2026-07-23", stay: "2026-08-09" },
    shortName: "Langham",
    strengths: ["The 67-foot indoor pool and a separate current Kids Suite can support an indoor reset", "Large rooms and a riverfront location can work when one central luxury base is the priority"],
    familySetup: "Langham lists a 67-foot indoor pool and connecting rooms by request. Its current dedicated Kids Suite page says the play space is open daily, while an older overview still says suspended; the Cinema Suite is separate and subject to availability.",
    reviewSignal: "The inspected sample included positive mentions of room size, river location, pool, service, and cleanliness. It also surfaced weekend pool crowding, food and parking cost, and service or climate-control inconsistency.",
    priceNote: "Connecting rooms, suites, club access, food, and parking can push the total well above the Google price.",
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
  ["InterContinental pool page", "https://www.ihg.com/intercontinental/hotels/us/en/chicago/ordha/hoteldetail/amenities/pool"],
  ["InterContinental project notice", "https://www.ihg.com/intercontinental/hotels/us/en/chicago/ordha/hoteldetail/amenities/special-activations"],
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

// Q18 (OWNER D25, 2026-11-01): the July 23 samples (August 2026 stays, passed) are no longer shown.
const chicagoPriceBasisFor = (today = q18Today) => q18BasisFor(chicagoFamilyHotels, today, { taxes: "taxes and fees", notPrices: " or prices for a family suite or the Kids Suite", extras: "Parking, Embassy Suites' destination charge, Swissotel's experience fee, food and a second room may be extra." });

function chicagoHotelComparisonCsv(today = q18Today) {
  const page = "https://familytripwise.com/where-to-stay/chicago-family-hotels.html";
  const headings = ["Hotel", "Trip style", "Area", "Nightly price (USD, Google Hotels listing)", "Party", "Night priced (check-in to check-out: price)", "Price seen", "Price basis and fee limits", "Price context", "Room and family setup", "Review sources checked", "Sampled guest themes", "Most important check", "Map", "Source page", "Live comparison"];
  const rows = chicagoFamilyHotels.map((hotel) => [
    hotel.name, hotel.category, hotel.area, ...q18CsvCells(hotel, today), chicagoPriceBasisFor(today),
    hotel.priceNote, hotel.familySetup, "2026-07-23", hotel.reviewSignal, hotel.parentCheck,
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hotel.mapQuery)}`,
    `${page}#sources-checked`, `${page}#hotel-comparison`
  ]);
  return hotelComparisonCsv(headings, rows);
}

function chicagoFamilyHotelPage(today = q18Today) {
  const hotels = chicagoFamilyHotels;
  const chicagoPriceCell = (hotel) => q18PriceCell(hotel, today);
  const chicagoPriceBasis = chicagoPriceBasisFor(today);
  const liveDates = q18LiveDates(hotels, today);
  const cards = hotels.map((hotel, index) => `          <article class="detail-card hotel-card" id="chicago-hotel-${index + 1}" style="scroll-margin-top: 80px">
            <p class="eyebrow">${esc(hotel.category)}</p>
            <h3>${esc(hotel.name)}</h3>
            <dl class="hotel-facts">
              <div><dt>Area</dt><dd>${esc(hotel.area)}</dd></div>
              <div><dt>Nightly price (family of 4)</dt><dd>${chicagoPriceCell(hotel)} <a href="#chicago-price-basis">Price basis</a></dd></div>
              <div><dt>Map</dt><dd><a href="${googleMapsUrl(hotel.mapQuery)}">Open in Google Maps</a></dd></div>
            </dl>
            <section><h4>Why compare it</h4><ul>${hotel.strengths.map((item) => `<li>${esc(item)}</li>`).join("")}</ul></section>
            <section><h4>Room and family setup</h4><p>${esc(hotel.familySetup)}</p></section>
            <section><h4>Themes in sampled online reviews</h4><p>${esc(hotel.reviewSignal)}</p></section>
            <section><h4>Price context and key check</h4><p>${esc(hotel.priceNote)} ${esc(hotel.parentCheck)}</p></section>
          </article>`).join("\n");

  const rows = hotels.map((hotel, index) => `              <tr>
                <td><a href="#chicago-hotel-${index + 1}">${esc(hotel.name).replaceAll("/", "/<wbr>")}</a></td>
                <td>${chicagoPriceCell(hotel)}</td>
                <td>${esc(hotel.category)}</td>
                <td>${esc(hotel.area)}</td>
                <td><a href="${googleMapsUrl(hotel.mapQuery)}">Map</a></td>
                <td>${esc(hotel.parentCheck.split(".")[0])}.</td>
              </tr>`).join("\n");

  const faqs = [
    ["What is the best family hotel in Chicago?", "There is no single best hotel for every family. Embassy Suites and Homewood solve different suite needs, Sable puts Navy Pier at the door, Swissotel has a purpose-built Kids Suite, InterContinental and Hilton Chicago answer different pool and location jobs, Hotel Zachary fits a Wrigley trip, and Four Seasons or Langham serve different luxury priorities."],
    ["Which Chicago family hotels have an indoor pool?", "Embassy Suites Magnificent Mile, Homewood Suites Chicago-Downtown, InterContinental Magnificent Mile, Hilton Chicago, Four Seasons, and The Langham list indoor pools. Pool hours, closures, depth, crowding, and child rules can change. InterContinental's notice, rechecked September 22, 2026, still shows an elapsed August 10-September 16 project schedule without a year; a separate dated closure listing supplies the 2026 context. Its completion, changing facilities, current hours and pass availability remain unconfirmed. Check directly before relying on it as a pool day."],
    ["Do these Chicago hotel prices include taxes and fees?", liveDates.length ? `Not necessarily. The figures are Google Hotels listing prices per night for 2 adults and kids 5 and 8 on Tuesday ${q18DateList(liveDates)}, seen October 31, 2026. Google does not show the room type or which taxes and fees are included, so treat them as estimates, not prices for a family suite or Kids Suite. Parking, destination or experience fees, food and a second room may be extra. Price your exact dates, ages, room and full stay total before deciding.` : "No current family price is shown on this page. Parking, destination or experience fees, food and a second room may be extra. Price your exact dates, ages, room and full stay total before deciding."]
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
    itemListElement: hotels.map((hotel, index) => ({ "@type": "ListItem", position: index + 1, name: hotel.name, description: (() => { const samples = q18Samples(hotel.google, today); return `${hotel.category}; ${samples.length ? `Google Hotels listing ${q18Figure(samples)} per night for ${q18Party} (${q18Dates(samples)}), seen ${q18Seen(samples)}; estimate, not a quote` : "no Google listing price for a family of four on our date; check live rate"}`; })() }))
  };

  const body = `    <main id="main">
      <section id="chicago-hotel-intro" class="page-hero hotel-hero">
        <div class="container">
          <p class="eyebrow">Chicago family hotels</p>
          <h1>Chicago Family Hotels</h1>
          ${contributorCredit()}
          <p>Ten Chicago hotels for families, compared by room setup, kitchens, pools, area and nightly price for a family of 4.</p>
        </div>
      </section>
      <section class="container media-section hero-photo-section">
        <figure class="licensed-photo hero-photo">
          <img src="../images/chicago-millennium-park.webp" alt="Pritzker Pavilion trellis and the Chicago skyline in Millennium Park." width="1600" height="1200" loading="eager" fetchpriority="high" decoding="async">
          <figcaption>Photo: Behnazkhazai via <a href="https://commons.wikimedia.org/wiki/File:Millennium_park,chicago.JPG">Wikimedia Commons</a>, <a href="https://creativecommons.org/licenses/by-sa/3.0/">CC BY-SA 3.0</a>. Resized and cropped.</figcaption>
        </figure>
      </section>
${q18Glance({
  id: "chicago-budget-glance",
  hotels,
  today,
  groups: [
    { label: "kitchens and breakfast suites", names: ["Embassy Suites by Hilton Chicago Downtown Magnificent Mile", "Homewood Suites by Hilton Chicago-Downtown", "Residence Inn Chicago Downtown/River North"] },
    { label: "Navy Pier, Wrigley and the Kids Suite", names: ["Sable at Navy Pier Chicago, Curio Collection by Hilton", "Hotel Zachary Chicago, a Tribute Portfolio Hotel", "Swissotel Chicago"] },
    { label: "big downtown hotels with indoor pools", names: ["InterContinental Chicago Magnificent Mile", "Hilton Chicago"] },
    { label: "luxury with pools", names: ["Four Seasons Hotel Chicago", "The Langham, Chicago"] }
  ],
  caveat: "Room type, taxes and fees not shown; weekends and events can cost more.",
  basis: chicagoPriceBasis
})}
      <section class="container trust-panel" aria-label="Review status">
        <p><strong>Hotel facts and review sources checked:</strong> July 23, 2026; indoor-pool status spot-checked September 14, 2026</p>
        <p>${liveDates.length ? "Prices are Google Hotels listing prices for a family of 4, seen October 31, 2026, not quotes." : "No current family price shown."} <a href="#chicago-price-basis">Price basis and exclusions</a>.</p>
      </section>
      <section id="chicago-hotel-answer" class="container answer-box" aria-label="Short answer">
        <p><strong>Fits:</strong> kitchens (Homewood, Residence Inn); two-room suites with breakfast (Embassy Suites); a separate kids' room (Swissotel Kids Suite); listed indoor pools (Embassy Suites, Homewood, Hilton Chicago, Four Seasons, Langham; InterContinental's current access unconfirmed); Navy Pier (Sable); a Cubs game (Hotel Zachary).</p>
        <p><strong>Main catch:</strong> Google does not show the room type: suites, the Kids Suite and two-double rooms can cost more, and parking, Embassy Suites' destination charge and Swissotel's experience fee can sit on top, so confirm beds for your party and price it live.</p>
      </section>
      <section class="band" id="hotel-comparison" data-glance-first>
        <div class="container">
          <div class="section-heading"><p class="eyebrow">Comparison</p><h2>Quick hotel comparison</h2></div>
          <p><a href="./chicago-with-kids.html">Compare Chicago stay areas</a></p>
          <p>${liveDates.length ? "Google Hotels prices for a family of 4 (2 adults + 2 kids), one weeknight, not quotes; parking is separate." : "No current family price shown: check live rates."} <a href="#chicago-price-basis">Full price basis</a>.</p>
          <div class="comparison-scroll" role="region" aria-label="Chicago hotel comparison" tabindex="0">
            <table class="comparison-table hotel-comparison">
              <thead><tr><th>Hotel</th><th>Nightly price (family of 4)</th><th>Best starting point for</th><th>Area</th><th>Map</th><th>Most important check</th></tr></thead>
              <tbody>
${rows}
              </tbody>
            </table>
          </div>
          <p id="chicago-price-basis" class="review-label" style="scroll-margin-top: 80px"><strong>Price basis:</strong> ${esc(chicagoPriceBasis)}</p>
          <details><summary>Spreadsheet copy</summary><p><a href="../downloads/chicago-family-hotels.csv" download>Download the ten-hotel comparison (.csv)</a>. Same Google prices, dates, party and price limits as this page.</p></details>
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
      <section class="container page-section source-section" id="sources-checked">
        <div class="section-heading"><p class="eyebrow">Sources checked</p><h2>How the hotel information was checked</h2></div>
        <p>Room and amenity facts come from official property pages. Online-review notes paraphrase a small directional sample from public booking and review sites; they are not representative ratings or firsthand stays. ${liveDates.length ? "Nightly prices are Google Hotels listing prices for a family of 4 on dated nights, not booking quotes; each one comes off this page a week before its date." : "No current family price is shown: the Google Hotels prices seen October 31, 2026 were for dates now less than a week away or past."}</p>
        <ul class="source-list">
${chicagoHotelSources.map(([label, href]) => `          <li><a href="${esc(href)}">${esc(label)}</a></li>`).join("\n")}
          <li><a href="https://commons.wikimedia.org/wiki/File:Millennium_park,chicago.JPG">Chicago photo source and attribution</a> by Behnazkhazai; <a href="https://creativecommons.org/licenses/by-sa/3.0/">CC BY-SA 3.0 license</a></li>
          <li>Public Expedia, Booking.com, Tripadvisor, Hotels.com, KAYAK, Hilton, Marriott, IHG, Swissotel, Four Seasons, and Langham price or review pages checked July 23, 2026; exact URLs and evidence limits are recorded in the evidence pack.</li>
          <li>Google Hotels listing prices for 2 adults and kids 5 and 8, ${liveDates.length ? `Tuesday ${liveDates.length > 1 ? "nights" : "night"} ${esc(q18DateList(liveDates))}` : "January 2027 dates no longer shown"}, seen October 31, 2026 via DataForSEO (receipts docs/research/dataforseo-q18-lv-chicago-hotel-prices-b/c-2026-11-01.json in github.com/agarg21/family-tripwise).</li>
        </ul>
      </section>
      <script type="application/ld+json">${JSON.stringify(itemListJson)}</script>
      <script type="application/ld+json">${JSON.stringify(faqJson)}</script>
    </main>`;

  return pageShell({
    title: "Top Family Hotels in Chicago: 10 Options by Trip Style",
    description: "Compare 10 Chicago family hotels by trip style, room setup, breakfast or kitchens, indoor pools, location, nightly price for a family of 4, and sampled online-review themes.",
    canonical: "where-to-stay/chicago-family-hotels.html",
    nav: [["./chicago-with-kids.html", "Where to stay"], ["../things-to-do/chicago-with-kids.html", "Things to do"], ["../family-itinerary/chicago-with-kids.html", "Itinerary"]],
    body
  });
}

const sanAntonioFamilyHotels = [
  {
    name: "Hyatt Regency Hill Country Resort and Villas",
    google: { prefix: "sa-hyatt-hill-country", title: "Hyatt Regency Hill Country Resort and Villas" },
    category: "Full resort and water-play trip",
    area: "West San Antonio / SeaWorld",
    priceRange: "Check live rate",
    shortName: "Hyatt Hill Country",
    olderSample: { amount: "$437", basis: "total", source: "Expedia" },
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
    google: { prefix: "sa-jw-marriott", title: "JW Marriott San Antonio Hill Country Resort & Spa" },
    category: "Largest water-complex resort comparison",
    area: "North San Antonio / TPC Parkway",
    priceRange: "Check live rate",
    shortName: "JW Marriott",
    olderSample: { amount: "$505", basis: "total", source: "Expedia" },
    strengths: ["Marriott publishes a nine-acre water experience with a lazy river and slides", "Some public two-queen inventory accommodates five, but the exact room controls"],
    familySetup: "The resort can fill a large share of the trip by itself. It is far from Downtown, and current wristband, slide, pool, room-occupancy, and parking rules need a dated check.",
    reviewSignal: "A recent public sample often praised the water features, family activities, service, and food. Isolated reports flagged paid parking, a temporarily unavailable slide, and one bathroom-maintenance problem.",
    priceNote: "A public one-night example was about $505 total; family occupancy, weekends, and resort demand can push the total higher.",
    parentCheck: "The current River Bluff limit is five entry wristbands per room. Confirm exact occupancy, any rule change, water-feature operations, parking, and final total.",
    operationalNotice: "Room-rest notice checked September 22, 2026: Marriott lists guestroom and exterior work from summer 2026 through spring 2027, with possible daytime noise and temporary balcony restrictions. Its enhancement FAQ gives work hours of 9am-5pm and an earlier, early-2027 estimate for guestroom completion. These describe different scopes, not a guaranteed finish date. Before booking a nap-dependent stay, confirm work near the exact room and dates; this does not establish disruption in every room or closure of the water complex.",
    operationalSources: [["Marriott room notice", "https://www.marriott.com/en-us/hotels/satjw-jw-marriott-san-antonio-hill-country-resort-and-spa/rooms/"], ["Enhancement FAQ", "https://www.marriott.com/en-us/hotels/satjw-jw-marriott-san-antonio-hill-country-resort-and-spa/overview/enhancements/"]],
    mapQuery: "JW Marriott San Antonio Hill Country Resort and Spa",
    anchorQuery: "Natural Bridge Caverns"
  },
  {
    name: "Signia by Hilton La Cantera Resort and Spa",
    google: { prefix: "sa-signia", title: "La Cantera Resort & Spa, A Signia Hilton Resort" },
    category: "Pools near Six Flags",
    area: "La Cantera / Northwest",
    priceRange: "Check live rate",
    shortName: "La Cantera",
    olderSample: { amount: "$315", basis: "total", source: "Expedia" },
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
    google: { prefix: "sa-wild-oak", title: "Hyatt Vacation Club at Wild Oak Ranch", priceFlag: "room type not shown; sales offers may apply" },
    category: "Vacation-club resort with a lazy river",
    area: "West San Antonio / SeaWorld",
    priceRange: "Check live rate",
    shortName: "Wild Oak",
    olderSample: { amount: "$249", basis: "before taxes", source: "Expedia" },
    strengths: ["Official inventory includes studios and one- to three-bedroom villas", "Villas publish kitchens and in-room laundry; the resort publishes pools, slides, and a lazy river"],
    familySetup: "This is a vacation-club property, and some promotional offers may involve a sales presentation. Official room categories checked September 30, 2026: studios and one-bedroom villas sleep up to four; two-bedroom villas sleep up to eight total, with a six-adult limit. For five guests, a two-bedroom villa is the smallest published category to check, not a guarantee of availability, water access, or price. Confirm the assigned kitchen, laundry, and beds.",
    roomSource: ["Official Wild Oak room categories", "https://www.hyattvacationclub.com/resorts/wild-oak-ranch"],
    reviewSignal: "A recent family-heavy public sample often praised villa space, kitchens, pools, the lazy river, activities, and grounds. It also surfaced early restaurant closing, sales-presentation offers, firm beds, and cashless snack-purchase friction.",
    priceNote: "A public one-night example was about $249 before taxes; taxes, a villa or busy dates may add to it.",
    parentCheck: "For five guests, check the two-bedroom villa first. Confirm exact party and ages, bedding, availability, kitchen and laundry equipment, current water access, offer terms, and final stay total; the July 26 sample is not a five-person quote.",
    comparisonCheck: "Check the studio or villa, rate, and water access",
    mapQuery: "Hyatt Vacation Club at Wild Oak Ranch",
    anchorQuery: "SeaWorld San Antonio"
  },
  {
    name: "Embassy Suites by Hilton San Antonio Riverwalk Downtown",
    google: { prefix: "sa-embassy", title: "Embassy Suites by Hilton San Antonio Riverwalk Downtown" },
    category: "Two-room suite and breakfast Downtown",
    area: "Downtown / River Walk",
    priceRange: "Check live rate",
    shortName: "Embassy Suites",
    olderSample: { amount: "$165", basis: "total", source: "Expedia" },
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
    google: { prefix: "sa-homewood", title: "Homewood Suites by Hilton San Antonio-Riverwalk/Downtown" },
    category: "Downtown kitchen and breakfast",
    area: "Downtown / River Walk",
    priceRange: "Check live rate",
    shortName: "Homewood",
    olderSample: { amount: "$156", basis: "total", source: "Expedia" },
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
    google: { prefix: "sa-home2", title: "Home2 Suites by Hilton San Antonio Riverwalk" },
    category: "Studio kitchen for a larger family",
    area: "Downtown / 118 Soledad Street",
    priceRange: "Check live rate",
    shortName: "Home2",
    olderSample: { amount: "$143", basis: "total", source: "public listing" },
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
    google: { prefix: "sa-drury", title: "Drury Plaza Hotel San Antonio Riverwalk" },
    category: "Included-food value Downtown",
    area: "Downtown / River Walk",
    priceRange: "Check live rate",
    shortName: "Drury",
    olderSample: { amount: "$151", basis: "total", source: "Expedia" },
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
    google: { prefix: "sa-contessa", title: "Hotel Contessa" },
    category: "All-suite River Walk stay",
    area: "Downtown / River Walk",
    priceRange: "Check live rate",
    shortName: "Contessa",
    olderSample: { amount: "$192", basis: "total", source: "Expedia" },
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
    google: { prefix: "sa-hyatt-riverwalk", title: "Hyatt Regency San Antonio Riverwalk" },
    category: "Classic first-visit location",
    area: "Downtown / Alamo and River Walk",
    priceRange: "Check live rate",
    shortName: "Hyatt Regency Riverwalk",
    olderSample: { amount: "$202", basis: "total", source: "Expedia" },
    strengths: ["The hotel directly connects the Alamo and River Walk planning zones", "Hyatt publishes a rooftop pool"],
    familySetup: "This is a location-led option rather than a suite, kitchen, or included-breakfast solution. Check the exact two-queen room, bathroom size, event calendar, and room placement.",
    reviewSignal: "Recent public reviews often praised location, access, cleanliness, and staff. They also surfaced parking cost, Fiesta or hallway noise, smaller bathrooms, elevators, and weaker value for standard rooms.",
    priceNote: "A public one-night example was about $202 total before parking; events and room categories can move higher.",
    parentCheck: "Confirm exact beds and occupancy, current pool status, event noise, room placement, parking, and final total.",
    mapQuery: "Hyatt Regency San Antonio Riverwalk",
    anchorQuery: "The Alamo San Antonio"
  },
  {
    name: "San Antonio Marriott Rivercenter on the River Walk",
    google: { prefix: "sa-rivercenter", title: "San Antonio Marriott Rivercenter on the River Walk" },
    category: "Indoor pool and Rivercenter access",
    area: "Downtown / Rivercenter",
    priceRange: "Check live rate",
    shortName: "Marriott Rivercenter",
    olderSample: { amount: "$281", basis: "total", source: "Expedia" },
    strengths: ["Marriott lists an indoor pool but also labels the amenity Indoor/Outdoor Pool; confirm the current configuration", "Direct Rivercenter access can simplify meals, weather pivots, and a first-visit route"],
    familySetup: "Published two-queen rooms accommodate four, while some larger suites differ. Convention volume, current pool operation, and expensive parking can matter as much as the map location.",
    reviewSignal: "A recent mostly general-traveler sample often praised the location, mall access, cleanliness, staff, and pool. It also surfaced high parking and total cost plus a busier convention-hotel feel.",
    priceNote: "A public one-night example was about $281 total before parking; suites, conventions, and event dates can move higher.",
    parentCheck: "Confirm exact room occupancy, current pool configuration and operation, event calendar, parking, and final total.",
    mapQuery: "San Antonio Marriott Rivercenter on the River Walk",
    anchorQuery: "LEGOLAND Discovery Center San Antonio"
  },
  {
    name: "Omni La Mansion del Rio",
    google: { prefix: "sa-la-mansion", title: "Omni La Mansion del Rio", conflict: "Google gave two different prices for this hotel on the same dates, so we show neither." },
    category: "Historic central River Walk stay",
    area: "Downtown / River Walk",
    priceRange: "Check live rate",
    shortName: "Omni",
    olderSample: { amount: "$188-$191", basis: "total", source: "Expedia" },
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
  ["Signia by Hilton La Cantera resort amenities", "https://www.hilton.com/en/hotels/satcnsa-signia-la-cantera-resort-and-spa/resort/"],
  ["Signia by Hilton La Cantera things to do", "https://www.hilton.com/en/hotels/satcnsa-signia-la-cantera-resort-and-spa/things-to-do/"],
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

const sanAntonioPriceBasisFor = (today = q18Today) => q18BasisFor(sanAntonioFamilyHotels, today, { taxes: "taxes and fees", notPrices: " or family-suite prices", seen: "November 2, 2026", extras: "Parking, resort fees, food, a suite or a second room may be extra." });

function sanAntonioFamilyHotelPage(today = q18Today) {
  const hotels = sanAntonioFamilyHotels;
  const sanAntonioPriceCell = (hotel) => q18PriceCell(hotel, today);
  const sanAntonioPriceBasis = sanAntonioPriceBasisFor(today);
  const liveDates = q18LiveDates(hotels, today);
  // The records keep the July wording as historical evidence (tools/hotel-evidence.mjs); pages show it without the sample.
  const priceHint = (hotel) => hotel.priceNote.replace(/^(?:A public one-night example was|Public one-night examples were) about \$[\d$-]+ [a-z ]+?; (.)/, (_, first) => first.toUpperCase()).replace("Taxes, a villa or busy dates may add to it.", "Taxes, a larger villa or busy dates can cost more.");
  const parentHint = (hotel) => hotel.parentCheck.replace("the July 26 sample is not a five-person quote", "the Google price is for 2 adults and 2 kids, not a five-person quote");
  const summaryPrice = (hotel) => { const samples = q18Samples(hotel.google, today); return samples.length ? `<strong>${esc(q18Figure(samples))} a night</strong> <small>${esc(`family of 4, ${samples.map((sample) => q18Short(sample.check_in)).join(" and ")}${samples.length === 1 ? " only" : ""}, Google Hotels estimate, not a quote${hotel.google.priceFlag ? `; ${hotel.google.priceFlag}` : ""}`)}</small>` : (() => { const expired = !hotel.google?.conflict && q18Samples(hotel.google, "0000-00-00").length > 0; return `<strong class="no-price">No ${expired ? "current " : ""}family price ${hotel.google?.conflict ? "shown" : expired ? "" : "found"}</strong> <small>${hotel.google?.conflict ? "Google's prices conflicted; check the live rate" : expired ? "our dates are now too close or past; check the live rate" : "no Google price on our dates; check the live rate"}</small>`.replace(" </strong>", "</strong>"); })(); };
  const hotelId = (index) => `san-antonio-hotel-${index + 1}`;
  const lowestPrice = (hotel) => { const samples = q18Samples(hotel.google, today); return samples.length ? Math.min(...samples.map((sample) => sample.nightly)) : Infinity; };
  const byPrice = hotels.map((hotel, index) => ({ hotel, index })).sort((a, b) => lowestPrice(a.hotel) - lowestPrice(b.hotel));
  const cards = byPrice.map(({ hotel, index }) => `          <details class="detail-card hotel-card" id="${hotelId(index)}">
            <summary style="cursor: pointer;">
              <span class="eyebrow" style="display: block;">${esc(hotel.category)}</span>
              <strong class="hotel-card-title">${esc(hotel.name)}</strong>
              <span style="display: block; margin-top: 6px;">${esc(hotel.area)}</span>
              <span class="hotel-card-price">${summaryPrice(hotel)}</span>
            </summary>
            <dl class="hotel-facts">
              <div><dt>Area</dt><dd>${esc(hotel.area)}</dd></div>
              <div><dt>Nightly price (family of 4)</dt><dd>${sanAntonioPriceCell(hotel)} <a href="#san-antonio-price-basis">Price basis</a></dd></div>
              <div><dt>Maps</dt><dd><a href="${googleMapsUrl(hotel.mapQuery)}">Hotel map</a> · <a href="${googleMapsUrl(hotel.anchorQuery)}">${esc(hotel.anchorQuery)}</a></dd></div>
            </dl>
            <section><h4>Why compare it</h4><ul>${hotel.strengths.map((item) => `<li>${esc(item)}</li>`).join("")}</ul></section>
            <section><h4>Room and family setup</h4><p>${esc(hotel.familySetup)}${hotel.roomSource ? ` <a href="${esc(hotel.roomSource[1])}">${esc(hotel.roomSource[0])}</a>.` : ""}</p></section>${hotel.operationalNotice ? `
            <p><strong>Before planning room rest:</strong> ${esc(hotel.operationalNotice)} ${hotel.operationalSources.map(([label, url]) => `<a href="${esc(url)}">${esc(label)}</a>`).join("; ")}.</p>` : ""}
            <section><h4>Themes in recent online reviews</h4><p>${esc(hotel.reviewSignal)}</p></section>
            <section><h4>Price context and key check</h4><p>${esc(priceHint(hotel))} ${esc(parentHint(hotel))}</p></section>
          </details>`).join("\n");

  // Table order: lowest observed family price first, unpriced hotels last; card anchors keep their record order.
  const rows = byPrice.map(({ hotel, index }) => `              <tr>
                <td><a href="#${hotelId(index)}">${esc(hotel.name).replaceAll("/", "/<wbr>")}</a></td>
                <td>${q18CompactPriceCell(hotel, today)}</td>
                <td>${esc(hotel.category)}</td>
                <td>${esc(hotel.area)}</td>
                <td>${esc(hotel.anchorQuery)}</td>
                <td>${esc(hotel.comparisonCheck || hotel.parentCheck.split(",")[0])}.</td>
              </tr>`).join("\n");

  const faqs = [
    ["Which San Antonio family hotels have a lazy river?", "Hyatt Regency Hill Country, JW Marriott San Antonio Hill Country, and Hyatt Vacation Club at Wild Oak Ranch publish lazy-river or substantial water-complex features. Signia by Hilton La Cantera publishes five pools and a family slide instead. Confirm current operating schedules and access rules for the exact dates."],
    ["Should a family stay on the River Walk or at a San Antonio resort?", "Choose a River Walk hotel when the Alamo, boat ride, Hemisfair, and compact Downtown days lead the trip. Choose a west or north resort when pools, SeaWorld, Six Flags, or a stay-put day matter more than repeated Downtown access. Map the first two days before deciding."],
    ["Which San Antonio hotels include breakfast or a kitchen?", "Embassy Suites includes made-to-order breakfast and a two-room suite. Homewood and Home2 publish kitchens plus breakfast. Drury includes breakfast and an evening food service. Wild Oak villas publish full kitchens, while its studios differ. Confirm the exact room and current food schedule."],
    ["Are these San Antonio hotel prices family-room quotes?", liveDates.length ? `No. The figures are Google Hotels listing prices per night for 2 adults and kids 5 and 8 on Tuesday ${q18DateList(liveDates)}, seen November 2, 2026. Google does not show the room type or which taxes and fees are included, so treat them as estimates. Parking is usually extra. Compare the exact room, party, dates, fees and full stay total before booking.` : "No. No current family price is shown, so check live rates for your dates, room and kids' ages, and compare the full stay total before booking."]
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
    itemListElement: hotels.map((hotel, index) => ({ "@type": "ListItem", position: index + 1, name: hotel.name, description: (() => { const samples = q18Samples(hotel.google, today); return `${hotel.category}; ${samples.length ? `Google Hotels listing ${q18Figure(samples)} per night for ${q18Party} (${q18Dates(samples)}), seen ${q18Seen(samples)}; estimate, not a quote` : "no current family price shown; check live rate"}`; })() }))
  };

  const body = `    <main id="main">
      <section id="san-antonio-hotel-intro" class="page-hero hotel-hero">
        <div class="container">
          <p class="eyebrow">San Antonio, Texas · family hotels</p>
          <h1>San Antonio Family Hotels</h1>
          ${contributorCredit()}
          <p>Downtown, start with Embassy Suites; for a water trip, Hyatt Hill Country. Twelve hotels compared by rooms, pools, area and price.</p>
        </div>
      </section>
      <section class="container media-section hero-photo-section">
        <figure class="licensed-photo hero-photo">
          <img src="../images/san-antonio-river-walk.webp" alt="The San Antonio River Walk with paths and restaurants along the water." width="1280" height="960" loading="eager" fetchpriority="high" decoding="async">
          <figcaption>Photo: Matt Harriger via <a href="https://commons.wikimedia.org/wiki/File:The_San_Antonio_River_Walk.jpg">Wikimedia Commons</a>, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC BY-SA 2.0</a>. Resized and cropped to fit.</figcaption>
        </figure>
      </section>
${q18Glance({
  id: "san-antonio-budget-glance",
  hotels,
  groups: [
    { label: "Downtown hotels with free breakfast, some with kitchens", names: ["Embassy Suites by Hilton San Antonio Riverwalk Downtown", "Homewood Suites by Hilton San Antonio-Riverwalk/Downtown", "Home2 Suites by Hilton San Antonio Riverwalk", "Drury Plaza Hotel San Antonio Riverwalk"] },
    { label: "classic River Walk hotels", names: ["Hyatt Regency San Antonio Riverwalk", "Omni La Mansion del Rio", "Hotel Contessa", "San Antonio Marriott Rivercenter on the River Walk"] },
    { label: "vacation-club resort outside Downtown (sales offers possible; room type not shown)", names: ["Hyatt Vacation Club at Wild Oak Ranch"] },
    { label: "resorts outside Downtown with pools, slides or water parks", names: ["Signia by Hilton La Cantera Resort and Spa", "Hyatt Regency Hill Country Resort and Villas", "JW Marriott San Antonio Hill Country Resort and Spa"] }
  ],
  caveat: "Room type, taxes and fees not shown. Parking, resort fees and weekends can cost more.",
  basis: sanAntonioPriceBasis,
  today,
  namedDates: true
})}
      <section id="san-antonio-hotel-answer" class="container answer-box" aria-label="Short answer">
        <p><strong>Downtown, start with:</strong> Embassy Suites (two rooms, breakfast). Also Homewood or Home2 (kitchen), Drury (included food), Contessa (all suites), Hyatt Regency or Omni (classic), Marriott Rivercenter (pool).</p>
        <p><strong>Water is the trip:</strong> Hyatt Hill Country, JW Marriott, La Cantera or Wild Oak. Winter visit: confirm which pools and slides are open before paying for a water resort.</p>
        <p><a class="text-link" href="./san-antonio-with-kids.html">Compare San Antonio stay areas before choosing a property</a></p>
      </section>
      <section class="container trust-panel" aria-label="Information freshness">
        <p><strong>Official hotel facts rechecked:</strong> September 5, 2026. <strong>Online-review sources checked:</strong> July 26, 2026. ${liveDates.length ? "<strong>Google family prices seen:</strong> November 2, 2026." : "No current family price shown."}</p>
      </section>
      <section id="hotel-comparison" class="band" data-glance-first>
        <div class="container">
          <div class="section-heading"><p class="eyebrow">Comparison</p><h2>Quick hotel comparison</h2></div>
          <p class="sa-table-basis">${liveDates.length ? `Google Hotels, one weeknight on each date in ${q18DateYears(liveDates)}, 2 adults + kids 5 and 8, seen ${q18Short(q18Observed(hotels, today))}. Estimates, not quotes.` : "No current family price shown: check live rates."} <a href="#san-antonio-price-basis">Price basis</a>. <span class="sa-swipe">Swipe the table for more.</span></p>
          <div class="comparison-scroll teen-comparison" role="region" aria-label="San Antonio hotel comparison" tabindex="0">
            <table class="comparison-table hotel-comparison">
              <thead><tr><th>Hotel</th><th>Nightly price (family of 4)</th><th>Best starting point for</th><th>Area</th><th>Nearby family anchor</th><th>Most important check</th></tr></thead>
              <tbody>
${rows}
              </tbody>
            </table>
          </div>
          <details id="san-antonio-price-basis" style="scroll-margin-top: 80px"><summary>Price basis: Google listing prices, not quotes</summary><p>${esc(sanAntonioPriceBasis)}</p></details>
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
      <section class="container page-section">
        <div class="section-heading"><p class="eyebrow">Hotel cards</p><h2>12 options: open a hotel for rooms, reviews and checks</h2></div>
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
        <p>Room and amenity facts come from official property pages. Online-review notes paraphrase a small directional sample from public booking and review pages. Family labeling was strong for some properties and thin for others, so the notes identify recurring themes and conflicts rather than claiming parent consensus. Prices are Google Hotels listing prices through DataForSEO, not live booking quotes.</p>
        <ul class="source-list">
${sanAntonioHotelSources.map(([label, href]) => `          <li><a href="${esc(href)}">${esc(label)}</a></li>`).join("\n")}
          <li><a href="https://commons.wikimedia.org/wiki/File:The_San_Antonio_River_Walk.jpg">San Antonio photo source</a> by Matt Harriger; <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC BY-SA 2.0 license</a>.</li>
          <li>Public Expedia and Booking.com review pages checked July 26, 2026; exact URLs, candidate decisions, sample freshness, conflicts and limits are kept in our research records.</li>
        </ul>
      </section>
      <script type="application/ld+json">${JSON.stringify(itemListJson)}</script>
      <script type="application/ld+json">${JSON.stringify(faqJson)}</script>
    </main>`;

  return pageShell({
    title: "Top Family Hotels in San Antonio: 12 Options by Trip Style",
    description: "Compare 12 San Antonio family hotels and resorts by trip style, nightly price for a family of 4, pools and lazy rivers, room setup, breakfast or kitchens, and recent online-review themes.",
    canonical: "where-to-stay/san-antonio-family-hotels.html",
    nav: [["./san-antonio-with-kids.html", "Where to stay"], ["../things-to-do/san-antonio-with-kids.html", "Things to do"], ["../family-itinerary/san-antonio-with-kids.html", "Itinerary"]],
    body
  });
}

const newYorkCityFamilyHotels = [
  {
    name: "Hotel Beacon",
    shortName: "Beacon",
    google: { prefix: "nyc-beacon", title: "Hotel Beacon", acrossSearches: true },
    priceAsk: "one- and two-bedroom suites",
    category: "Upper West Side kitchen and larger layouts",
    area: "Upper West Side",
    priceRange: "Check live rate",
    twoAdultSample: "$331",
    strengths: ["Every published studio and suite has a fully equipped kitchenette", "One- and two-bedroom layouts create clearer options for sleep separation and larger families"],
    familySetup: "Official inventory includes two-double studios, one-bedroom suites, and an 800-square-foot two-bedroom suite. Occupancy differs by category, so choose the named layout rather than assuming every room works for the same family. The hotel says it charges no facility or resort fees.",
    reviewSignal: "The inspected sample favored the Upper West Side location, staff, kitchen usefulness, room size, and park or transit access. It also surfaced dated bathrooms or kitchenettes, occasional maintenance issues, and weaker value on expensive dates.",
    priceNote: "A standard-room sample checked July 25, 2026 showed about $331 for one room and one night; one- and two-bedroom suites were not priced on the same basis.",
    parentCheck: "Confirm the exact suite, registered occupancy, sofa-bed use, kitchen equipment, recent condition, and final total.",
    mapQuery: "Hotel Beacon New York"
  },
  {
    name: "Homewood Suites by Hilton New York/Midtown Manhattan Times Square-South",
    shortName: "Homewood",
    google: { prefix: "nyc-homewood", title: "Homewood Suites by Hilton New York/Midtown Manhattan Times Square-South, NY", acrossSearches: true },
    priceAsk: "two-queen and one-bedroom rooms",
    category: "Kitchen and breakfast near Penn Station",
    area: "Midtown South",
    priceRange: "Check live rate",
    twoAdultSample: "$226",
    strengths: ["In-suite kitchens and free hot breakfast reduce two recurring family logistics", "Hilton lists connecting rooms and cribs"],
    familySetup: "Many rooms are studios rather than true one-bedroom suites. Confirm beds, registered occupancy, and whether a door between sleep and living space matters for the trip.",
    reviewSignal: "The inspected sample favored breakfast, staff, kitchen supplies, cleanliness, location, and practical room setup. Breakfast quality varied, and exact room size or separation still mattered.",
    priceNote: "A sample checked July 25, 2026 showed about $226 for one room and one night; two-queen and one-bedroom categories were not priced on the same basis.",
    parentCheck: "Confirm studio versus one-bedroom layout, beds, occupancy, breakfast setup, kitchen equipment, and final total.",
    mapQuery: "Homewood Suites Midtown Manhattan Times Square South"
  },
  {
    name: "Residence Inn by Marriott New York Manhattan/Central Park",
    shortName: "Residence Inn",
    google: { prefix: "nyc-residence-cp", title: "Residence Inn by Marriott New York Manhattan/Central Park", acrossSearches: true },
    priceAsk: "two-double and view rooms",
    category: "Two doubles, kitchenette, and breakfast",
    area: "Central Park South / Columbus Circle",
    priceRange: "Check live rate",
    twoAdultSample: "$227",
    strengths: ["Marriott shows two-double studios; it does not state how many each sleeps, so confirm for your party", "Kitchenettes, free hot breakfast, on-site laundry, and skyline views can simplify a short or longer stay"],
    familySetup: "Marriott lists all suites and kitchenettes with appliances, cookware, and utensils. July reviews conflict with generic kitchenette wording about whether every room has a stovetop, so verify the exact equipment.",
    reviewSignal: "The inspected sample favored views, breakfast, location, staff, and cleanliness. Small rooms and inconsistent kitchen equipment were the main conflicts.",
    priceNote: "A sample checked July 25, 2026 showed about $227 for one room and one night; two-double and view categories were not priced on the same basis.",
    parentCheck: "Confirm exact beds and occupancy, room size, actual kitchenette equipment, breakfast timing, and final total.",
    mapQuery: "Residence Inn New York Manhattan Central Park"
  },
  {
    name: "Radio City Apartments",
    shortName: "Radio City",
    glanceLowNote: "apartment type not shown",
    google: { prefix: "nyc-radio-city", title: "Radio City Apartments", acrossSearches: true, cellNote: "Apartment type not shown, so this may not be the two-bedroom." },
    priceAsk: "the two-bedroom family layout",
    category: "Practical apartment for five-plus people",
    area: "Rockefeller Center / Times Square",
    priceRange: "Check live rate",
    twoAdultSample: "$190",
    strengths: ["The published two-bedroom has one queen, two twins, a sofa bed, and a kitchenette", "Official capacity is five guests plus one child age 12 or under"],
    familySetup: "The two-bedroom is about 470 square feet with a dining area and daily housekeeping. It is an older practical apartment-hotel product, not a full-service resort.",
    reviewSignal: "The inspected sample favored location, kitchenette, staff, practicality, and value. Dated condition and room-level cleanliness variation were the main conflicts.",
    priceNote: "A studio sample checked July 25, 2026 showed about $190 for one room and one night; the two-bedroom family layout was not priced on the same basis.",
    parentCheck: "Confirm two-bedroom availability and occupancy, bed setup, kitchen equipment, elevator or room placement, and final total.",
    mapQuery: "Radio City Apartments New York"
  },
  {
    name: "Embassy Suites by Hilton New York Manhattan Times Square",
    shortName: "Embassy Suites",
    google: { prefix: "nyc-embassy", title: "Embassy Suites by Hilton New York Manhattan Times Square", acrossSearches: true },
    priceAsk: "view, terrace and sofa-bed rooms",
    category: "Breakfast start for a family of three",
    area: "Bryant Park / Herald Square",
    priceRange: "Check live rate",
    twoAdultSample: "$221",
    strengths: ["Breakfast and an evening reception are included", "King-plus-sofa-bed studios can work for a compact family-of-three setup"],
    familySetup: "Do not assume the classic Embassy Suites two-room layout: the July 25 inventory was dominated by king rooms and king-plus-sofa-bed studios around 277-320 square feet. Hilton lists cribs among the amenities, while Expedia's public policy says cribs and rollaways are unavailable; treat the crib as a request that needs direct confirmation.",
    reviewSignal: "The inspected sample favored breakfast, evening snacks, location, staff, and some quiet-room experiences. Compact rooms, firm beds, the non-suite layout, parking confusion, and a mandatory nightly charge appeared as conflicts.",
    priceNote: "A sample checked July 25, 2026 showed about $221 for one room and one night; view, terrace, and sofa-bed categories were not priced on the same basis.",
    parentCheck: "Confirm exact room layout and occupancy, sofa bed, the crib-source conflict and rollaway policy, mandatory charge, and final total.",
    mapQuery: "Embassy Suites New York Manhattan Times Square"
  },
  {
    name: "TRYP by Wyndham New York City Times Square / Midtown",
    shortName: "TRYP",
    google: { prefix: "nyc-tryp", title: "TRYP by Wyndham New York City Times Square South", acrossSearches: true, conflict: "Our family-of-4 searches for Jan 22-23 did not find this hotel.", csvNote: "Check live rate (our family-of-4 searches for Jan 22-23 did not find this hotel)" },
    priceAsk: "the TRYP FAMILY room",
    category: "One-room family layout for five to eight",
    area: "Penn Station / Midtown West",
    priceRange: "Check live rate",
    twoAdultSample: "$205",
    strengths: ["Wyndham publishes family rooms with bunk beds", "In July, a premium family room was listed with two large beds, a bunk bed, and a sofa bed (July said doubles, the Oct 11 check said queens; confirm)"],
    familySetup: "The family room is the reason to compare this property; a standard room is not equivalent. In July, inventory listed capacity up to eight, but the registered occupancy and every sleeping surface still need confirmation.",
    reviewSignal: "The inspected sample favored family-room capacity, room size, Penn Station access, and value. It also surfaced inconsistent cleanliness, shower control, sofa-bed comfort, breakfast, rooftop availability, and room condition.",
    priceNote: "A standard-room sample checked July 25, 2026 showed about $205 for one room and one night. A sampled guest review reported about $654 on another date; that anecdote is not a comparable family-room quote.",
    parentCheck: "Confirm the exact family room and occupancy, every sleeping surface, current rooftop status, bathroom condition, and final total.",
    mapQuery: "TRYP by Wyndham New York City Times Square Midtown"
  },
  {
    name: "The Kimberly Hotel",
    shortName: "Kimberly",
    google: { prefix: "nyc-kimberly", title: "The Kimberly Hotel", acrossSearches: true },
    priceAsk: "one- and two-bedroom suites",
    category: "Spacious Midtown East one-bedroom suite",
    area: "Midtown East",
    priceRange: "Check live rate",
    twoAdultSample: "$352",
    strengths: ["One-bedroom suites are 550-600 square feet with separate living and dining areas", "Suites have a wet bar with mini-refrigerator, coffee maker and microwave; all but 10 of the 154 suites have a balcony"],
    familySetup: "Two-bedroom suites add a sofa bed and two bathrooms. Confirm the exact suite because wet bar, balcony, bed count, and privacy differ by category.",
    reviewSignal: "The inspected sample favored suite space, kitchenettes, balconies, staff, cleanliness, and Midtown East location. It contained few negative reports, so exact view, balcony, layout, and price remain more important unknowns than a broad negative theme.",
    priceNote: "A standard-room sample checked July 25, 2026 showed about $352 for one room and one night; one- and two-bedroom suites were not priced on the same basis.",
    parentCheck: "Confirm the exact suite plan, sofa bed, balcony, wet bar equipment, registered occupancy, and final total.",
    mapQuery: "The Kimberly Hotel New York"
  },
  {
    name: "New York Marriott Marquis",
    shortName: "Marquis",
    google: { prefix: "nyc-marquis", title: "New York Marriott Marquis", acrossSearches: true },
    priceAsk: "family connecting rooms and view rooms",
    category: "Times Square convenience and family connectors",
    area: "Times Square",
    priceRange: "Check live rate",
    twoAdultSample: "$375",
    strengths: ["Two-double rooms put Broadway and Times Square at the door", "Published Family Connector layouts combine a king room, a two-double room, and a sofa bed"],
    familySetup: "The connector is a different product, priced separately from a standard room. Cribs are requestable; rollaways are not available, and two double beds may feel small for older children.",
    reviewSignal: "The inspected sample favored location, room cleanliness and space, staff, and theater convenience. Smaller double beds, breakfast cost, the mandatory destination charge, and very high parking cost were conflicts.",
    priceNote: "A standard-room sample checked July 25, 2026 showed about $375 for one room and one night; family connectors and view categories were not priced on the same basis.",
    parentCheck: "Confirm exact two-double or connector layout, occupancy, destination charge, breakfast plan, and final total.",
    mapQuery: "New York Marriott Marquis"
  },
  {
    name: "Conrad New York Downtown",
    shortName: "Conrad",
    google: { prefix: "nyc-conrad", title: "Conrad New York Downtown", acrossSearches: true },
    priceAsk: "two-double, view and connecting rooms",
    category: "Separate living and sleeping space Downtown",
    area: "Battery Park City / Lower Manhattan",
    priceRange: "Check live rate",
    twoAdultSample: "$473",
    strengths: ["The all-suite hotel publishes separate living and sleeping areas starting around 430 square feet", "Two-double suites sleep four, with connecting rooms and cribs also listed"],
    familySetup: "A Downtown base can simplify Battery Park, Oculus, ferry, and Lower Manhattan days while adding travel to a Midtown-heavy itinerary.",
    reviewSignal: "The inspected sample favored room space, separate living areas, service, cleanliness, and the calmer Downtown base. Distance from Midtown-heavy plans and the high total were the main decision conflicts.",
    priceNote: "A sample checked July 25, 2026 showed about $473 for one room and one night; two-double, view, and connecting categories were not priced on the same basis.",
    parentCheck: "Confirm two-double versus king-and-sofa layout, the door between rooms, occupancy, daily route, and final total.",
    mapQuery: "Conrad New York Downtown"
  },
  {
    name: "Lotte New York Palace",
    shortName: "Lotte Palace",
    google: { prefix: "nyc-palace", title: "Lotte New York Palace", acrossSearches: true },
    priceAsk: "named family suites and Towers rooms",
    category: "Large family-suite splurge",
    area: "Midtown East / Rockefeller Center",
    priceRange: "Check live rate",
    twoAdultSample: "$593",
    strengths: ["The 765-square-foot Palace Family Suite publishes capacity up to six", "A two-double family-suite version adds one king, two doubles, a sleeper sofa, and two bathrooms for up to eight"],
    familySetup: "The named family suite is a premium category. Standard connecting rooms are request and availability dependent and should not be treated as the same product.",
    reviewSignal: "The inspected sample favored central location, staff, comfort, views, and public spaces. One busy-period report noted short staffing and long front-desk lines; exact category and price dominate the decision.",
    priceNote: "A standard-room sample checked July 25, 2026 showed about $593 for one room and one night; named family suites and Towers categories were not priced on the same basis.",
    parentCheck: "Confirm named family suite versus request-only connection, bed count, occupancy, two bathrooms, charges, and final total.",
    mapQuery: "Lotte New York Palace"
  },
  {
    name: "1 Hotel Brooklyn Bridge",
    shortName: "1 Hotel",
    google: { prefix: "nyc-1hotel", title: "1 Hotel Brooklyn Bridge", acrossSearches: true },
    priceAsk: "connecting rooms",
    category: "Brooklyn and DUMBO base with two beds",
    area: "DUMBO / Brooklyn Heights",
    priceRange: "Check live rate",
    twoAdultSample: "$664",
    strengths: ["The published Dumbo 2 Beds room has two double beds and sleeps four", "Connecting suite options and a seasonal outdoor pool add different premium setups"],
    familySetup: "This is a Brooklyn-first location, not the easiest base for a Midtown-heavy first trip. Pool season and the exact two-bed or connecting category require a current check.",
    reviewSignal: "The inspected sample favored DUMBO location, views, design, staff, and room comfort. Thin walls or noise, dark rooms, technology issues, crowded rooftop service, condition variation, and high price were conflicts.",
    priceNote: "A sample checked July 25, 2026 showed about $664 for one room and one night; connecting layouts were not priced on the same basis.",
    parentCheck: "The hotel lists a $49 amenity fee per room a night, plus tax. The rooftop pool is seasonal and open to all ages. Confirm two-double versus connecting layout, pool season, Manhattan route, room brightness or noise, and final total.",
    mapQuery: "1 Hotel Brooklyn Bridge"
  },
  {
    name: "Four Seasons Hotel New York Downtown",
    shortName: "Four Seasons Downtown",
    glanceHighName: "Four Seasons",
    google: { prefix: "nyc-four-seasons", title: "Four Seasons Hotel New York Downtown", acrossSearches: true, cellNote: "The published two-double room takes 3 people, so this may be a larger room or two rooms; Google does not say." },
    priceAsk: "suites and a second room",
    category: "Indoor-pool luxury base",
    area: "Tribeca / World Trade Center",
    priceRange: "Check live rate",
    twoAdultSample: "$904",
    strengths: ["The hotel publishes an indoor pool and rooms with two double beds plus one crib", "Downtown location can pair the Oculus, One World, Battery Park, and Brooklyn Bridge"],
    familySetup: "The common two-double configuration is published for two adults and one child or one adult and two children, not a default family of four. Optional rollaways are not available.",
    reviewSignal: "The recent sample favored service, cleanliness, Downtown location, room comfort, and pool. It was mostly positive and too thin for a broad consensus; current qualitative discussion also frames the pool as a lap-pool and spa environment rather than a water-play resort.",
    priceNote: "A sample checked July 25, 2026 showed about $904 for one room and one night; suites and a second room were not priced on the same basis.",
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
  ["1 Hotel Brooklyn Bridge policies", "https://www.1hotels.com/brooklyn-bridge/policies"],
  ["Four Seasons New York Downtown accommodations", "https://www.fourseasons.com/newyorkdowntown/accommodations/"]
];

// Q17b (OWNER D9/O2): the October 11, 2026 five-person samples for November 8-13, 2026 (Hotel Beacon, Radio City
// Apartments, TRYP) were withdrawn on 2026-10-31 because their stay could not be re-observed before it passed. The
// records stay in docs/research. G18 (OWNER D39): the page now shows a Fri-Sun weekend plus Christmas and New Year weekends
// from two 1-night searches per weekend (tools/page-generation/weekend-hotel-samples.mjs).
const nycToday = process.env.FT_BUILD_DATE || easternDate();
const nycKids = [4, 8, 12];
const nycBeaconName = "Hotel Beacon";
const nycTrypName = "TRYP by Wyndham New York City Times Square / Midtown";
const nycRadioName = "Radio City Apartments";
const nycTrypGoogleTitle = "TRYP by Wyndham New York City Times Square South";
const nycSearches = "abcdefghij".split("").flatMap((part) => readReceipt(`dataforseo-g18-nyc-${part}-2026-11-05.json`).searches);
const nycSeen = "Nov 5";
const nycSeenLong = "November 5, 2026";
const nycCity = weekendCity({ key: "nyc", searches: nycSearches, seen: nycSeen, seenLong: nycSeenLong });
const nycSets = g18Sets;
const { setPrice: nycSet, figure: nycFigure, oneNight: nycOneNight, weekendDetail: nycWeekendDetail, noPrice: nycNoPrice, weekendHead: nycWeekendHead, priceCell: nycPriceCell, csvCell: nycCsvCell, holidayTable: nycHolidayTable, holidayNames: nycHolidayNames, glance: nycGlance } = nycCity;
const nycFive = [nycBeaconName, nycTrypName, nycRadioName];
const nycFiveGoogle = { [nycBeaconName]: { prefix: "nyc5-beacon", title: "Hotel Beacon", short: "Hotel Beacon" }, [nycTrypName]: { prefix: "nyc5-tryp", title: nycTrypGoogleTitle, short: "TRYP Times Square" }, [nycRadioName]: { prefix: "nyc5-radio-city", title: "Radio City Apartments", short: "Radio City Apartments" } };
// Family of 5 sits on the same weekend; it leaves the page a week before arrival with the family-of-4 figures.
function nycListings(today = nycToday) {
  const rows = nycFive.map((name) => { const google = nycFiveGoogle[name]; return { name, ...google, weekend: weekendPrice(nycSearches, { prefix: google.prefix, title: google.title, tags: nycSets.weekend.tags, childAges: nycKids }) }; });
  if (!rows.every((row) => row.weekend.any && weekendLive(row.weekend, today))) return null;
  const line = (w) => (w.both ? `${nycFigure(w)} a night (${nycWeekendDetail(w)})` : `${dollars(w.average)}, ${nycOneNight(w)} (${nycWeekendDetail(w)})`);
  return { rows, line, party: `2 adults and ${kidsText(nycKids)}`,
    text: Object.fromEntries(rows.map((row) => [row.name, `Google Hotels, family of 5 (2 adults and ${kidsText(nycKids)}), ${nycSets.weekend.label}: ${line(row.weekend)}, seen ${nycSeenLong}. Room type not shown; not a quote; hotels have not confirmed 3 kids in this room.`])),
    cell: Object.fromEntries(rows.map((row) => [row.name, `${line(row.weekend)}; seen ${nycSeen}`])) };
}

const nycRoomChecks = {
  [nycBeaconName]: ["Beds: the official two-bedroom suite page lists two doubles, a king, a queen sofa bed and two bathrooms; the booking label said four double beds.", "Kids: capacity wording allows up to two children, so confirm a party with three.", "Renovation: weekday work 9 a.m. to 5 p.m. was announced with no end date or floors; ask about your dates."],
  [nycRadioName]: ["Beds: the official page lists one queen, two twins and a sofa bed; the booking engine listed a queen, two doubles and a sofa bed.", "Capacity: five guests plus one child 12 or under.", "Deposit: a separate deposit is due at check-in; refundability not stated."],
  [nycTrypName]: ["Room: the TRYP FAMILY room lists two queens, a sofa bed, a bunk bed and one bathroom; published capacity eight.", "Kitchen: a mini refrigerator and coffee maker are listed; no cooking equipment is listed.", "Fees: on October 11 the official booking price included the resort fee and City Hotel Fee; Google listings may not, so check current fees."]
};

// Q19 (OWNER D26, 2026-11-02): the July 25 two-adult samples are gone from the page and CSV; records keep them as history.
// Each hotel shows Google Hotels prices for a family of 4 on the sampled weekends. The family-of-5 listings stay as a second, separate party.
const newYorkCityPriceBasisFor = (today = nycToday) => {
  const l = nycListings(today);
  const live = newYorkCityFamilyHotels.some((hotel) => nycSet(hotel, "weekend", today)?.any);
  const four = live
    ? `Prices are Google Hotels listing prices per night for ${q18Party}, seen ${nycSeenLong}. Each weekend is two 1-night searches, Friday and Saturday, so each figure is one night: we show the average a night and the 2-night sum, labelled estimate. Where a search showed only one of the two nights we say so and do not add them up. The same hotel sometimes showed different prices in separate searches moments apart, and we do not know why, so those figures are shown too. Google does not show the room type, the number of rooms, or which taxes and fees are included, so these are estimates, not quotes. We have no booking quote for any of these twelve hotels.`
    : `No current family-of-4 price is shown: the Google Hotels prices for ${q18Party} seen ${nycSeenLong} were for a weekend that is now less than a week away or past. Check live rates for your dates, room and kids' ages.`;
  const five = l ? ` The family-of-5 prices are separate Google Hotels searches (${l.party}) for the same weekend.` : "";
  return `${four}${five} "No price shown" means Google listed no price on the day we looked; it does not mean sold out. Parking, food, extras and a second room may be extra. Older samples are no longer shown because their stays have passed or they did not match a normal family weekend.`;
};
const nycFamily5Cell = (hotel, listing) => (listing?.cell[hotel.name] ? `<br><small class="family-listing">Family of 5 (2 adults + 3 kids): ${esc(listing.cell[hotel.name])}</small>` : "");
const nycPickPrice = (name, today) => {
  const hotel = newYorkCityFamilyHotels.find((entry) => entry.shortName === name);
  const w = nycSet(hotel, "weekend", today);
  return `${name}${w?.any ? ` ${nycFigure(w)}${w.both ? "" : ` (${nycOneNight(w)})`}` : ""}`;
};
const nycFactsRead = {
  "Embassy Suites by Hilton New York Manhattan Times Square": "Breakfast, reception, cribs and the mandatory charge re-read Nov 5, 2026; room layouts last read July 25, 2026.",
  [nycTrypName]: "Hotel overview re-read Nov 5, 2026; family-room details last read July 25 and October 11, 2026.",
  "New York Marriott Marquis": "Connecting and two-double rooms re-read Nov 5, 2026; crib, rollaway and charge details last read July 25, 2026."
};
const nycFactsLine = (hotel) => nycFactsRead[hotel.name] || "Official hotel pages re-read Nov 5, 2026.";
const nycPriceContext = (hotel, today) => `${nycSet(hotel, "weekend", today)?.any ? "Google's price does not name a room, so price" : "Price"} ${hotel.priceAsk} for your dates.`;

function newYorkCityHotelComparisonCsv(today = nycToday) {
  const page = "https://familytripwise.com/where-to-stay/new-york-city-family-hotels.html";
  const listing = nycListings(today);
  const listed = [nycBeaconName, nycTrypName, nycRadioName];
  const headings = ["Hotel", "Trip style", "Area", "Weekend price, Jan 22-24, 2027 (USD, Google Hotels listing)", "Party", "Weekend priced", "Price seen", "Family-of-5 listing price (Google Hotels; not a quote)", "Price basis and fee limits", "Price context", "Room and family setup", "Review sources checked", "Sampled guest themes", "Most important check", "Map", "Source page", "Live comparison", "Christmas weekend price, Dec 25-27, 2026 (Google Hotels; family of 4)", "New Year's weekend price, Jan 1-3, 2027 (Google Hotels; family of 4)", "Official facts read"];
  const rows = newYorkCityFamilyHotels.map((hotel) => [
    hotel.name, hotel.category, hotel.area,
    nycCsvCell(hotel, "weekend", today) || hotel.google?.csvNote || "Check live rate", q18Party, nycSet(hotel, "weekend", today) ? nycSets.weekend.label : "", nycSet(hotel, "weekend", today)?.any ? "2026-11-05" : "",
    listed.includes(hotel.name) ? (listing?.text[hotel.name] || "No current family-of-5 price; check live rate.") : "",
    newYorkCityPriceBasisFor(today), nycPriceContext(hotel, today), hotel.familySetup, "2026-07-25", hotel.reviewSignal, hotel.parentCheck,
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hotel.mapQuery)}`,
    `${page}#sources-checked`, `${page}#hotel-comparison`,
    nycCsvCell(hotel, "christmas", today), nycCsvCell(hotel, "newYear", today), nycFactsLine(hotel)
  ]);
  return hotelComparisonCsv(headings, rows);
}

function newYorkCityFamilyHotelPage(today = nycToday) {
  const hotels = newYorkCityFamilyHotels;
  const listing = nycListings(today);
  const priceBasis = newYorkCityPriceBasisFor(today);
  const anchor = (name) => `#nyc-hotel-${hotels.findIndex((hotel) => hotel.name === name) + 1}`;
  const cards = hotels.map((hotel, index) => `          <article class="detail-card hotel-card" id="nyc-hotel-${index + 1}" style="scroll-margin-top: 80px">
            <p class="eyebrow">${esc(hotel.category)}</p>
            <h3>${esc(hotel.name)}</h3>
            <dl class="hotel-facts">
              <div><dt>Area</dt><dd>${esc(hotel.area)}</dd></div>
              <div><dt>Weekend price</dt><dd>${(() => { const w = nycSet(hotel, "weekend", today); return w?.any ? `${nycWeekendHead(w)} <small>${esc(`family of 4, ${nycSets.weekend.label}. ${nycWeekendDetail(w)}. Google Hotels estimate, not a quote${hotel.google.cellNote ? `. ${hotel.google.cellNote}` : ""}`)}</small>` : nycNoPrice(hotel, today); })()}${nycFamily5Cell(hotel, listing)}</dd></div>
              <div><dt>Map</dt><dd><a href="${googleMapsUrl(hotel.mapQuery)}">Open in Google Maps</a></dd></div>
            </dl>
            <section><h4>Why compare it</h4><ul>${hotel.strengths.map((item) => `<li>${esc(item)}</li>`).join("")}</ul></section>
            <section><h4>Room and family setup</h4><p>${esc(hotel.familySetup)}</p><p class="hotel-facts-date">${esc(nycFactsLine(hotel))}</p>${nycRoomChecks[hotel.name] ? `<p class="hotel-room-note">Room check, October 11, 2026 (older):</p><ul>${nycRoomChecks[hotel.name].map((item) => `<li>${esc(item)}</li>`).join("")}</ul>` : ""}</section>
            <details class="hotel-more"><summary>Themes in sampled online reviews</summary><p>${esc(hotel.reviewSignal)}</p></details>
            <section><h4>Price context and key check</h4><p>${esc(nycPriceContext(hotel, today))} ${esc(hotel.parentCheck)}</p>${listing?.text[hotel.name] ? `<p class="hotel-price-sample">${esc(listing.text[hotel.name])}</p>` : ""}<p><a href="#price-basis">Price basis and exclusions</a>.</p></section>
          </article>`).join("\n");

  const rows = hotels.map((hotel, index) => `              <tr>
                <td><a href="#nyc-hotel-${index + 1}">${esc(hotel.name).replaceAll("/", "/<wbr>")}</a></td>
                <td>${nycPriceCell(hotel, today)}</td>
                <td>${esc(hotel.category)}</td>
                <td>${esc(hotel.area)}</td>
                <td><a href="${googleMapsUrl(hotel.mapQuery)}">Map</a></td>
                <td>${esc(hotel.parentCheck.split(".")[0])}.</td>
              </tr>`).join("\n");

  const holidayNames = nycHolidayNames(hotels, today);
  const priced = hotels.map((hotel) => ({ hotel, w: nycSet(hotel, "weekend", today) })).filter((row) => row.w?.both).sort((a, b) => a.w.average - b.w.average);
  const liveFour = priced.length > 0;
  const costAnswer = liveFour
    ? `For a family of 4 (${q18Party}), a normal weekend, ${nycSets.weekend.label}, showed about ${dollars(priced[0].w.average)} a night (${priced[0].hotel.shortName}) to ${dollars(priced.at(-1).w.average)} a night (${priced.at(-1).hotel.shortName}) on Google Hotels, seen ${nycSeenLong}. Four Seasons Downtown showed only Friday, at ${dollars(nycSet(hotels.find((hotel) => hotel.shortName === "Four Seasons Downtown"), "weekend", today).average)}. Room type, taxes and fees were not shown, so these are estimates, not quotes. ${holidayNames.length ? `${holidayNames.join(" and ")} weekend${holidayNames.length > 1 ? "s" : ""} cost${holidayNames.length > 1 ? "" : "s"} more at most of these hotels. ` : ""}Parking, food and a second room may be extra.`
    : "No current family price is shown, so check the live rate for your exact room, party and dates. Parking, food, extras and a second room may be extra.";
  const faqs = [
    ["What is the best family hotel in New York City?", "There is no single best hotel for every family. Hotel Beacon, Homewood, Residence Inn, and Radio City Apartments solve different kitchen or occupancy needs. Embassy Suites adds breakfast, TRYP has a specific large-family room, Marriott Marquis puts Broadway at the door, Conrad creates separate Downtown living space, and Four Seasons is the indoor-pool luxury comparison."],
    ["Which New York City hotels on this list work for a family of five?", "Radio City Apartments publishes a two-bedroom layout for five guests plus one child age 12 or under. TRYP publishes a larger family room, while Lotte publishes named family suites for six or eight. Hotel Beacon also has larger suites. Confirm the exact category and registered occupancy before paying."],
    ["How much do these New York City family hotels cost?", costAnswer]
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
    itemListElement: hotels.map((hotel, index) => ({ "@type": "ListItem", position: index + 1, name: hotel.name, description: (() => { const w = nycSet(hotel, "weekend", today); return `${hotel.category}; ${w?.any ? `Google Hotels listing ${nycFigure(w)} per night${w.both ? "" : `, ${nycOneNight(w)}`} for ${q18Party} (${nycSets.weekend.label}), seen ${nycSeenLong}; estimate, not a quote${hotel.google.cellNote ? `. ${hotel.google.cellNote}` : ""}` : "no current family-of-4 price shown; check live rate"}${listing?.cell[hotel.name] ? `; family of 5: ${listing.cell[hotel.name]}` : ""}`; })() }))
  };

  const family5 = listing
    ? `        <details class="price-more"><summary>Family of 5? Prices for 3 hotels</summary>
        <ul class="pick-list price-rows">
${[...listing.rows].sort((x, y) => x.weekend.average - y.weekend.average).map((row) => `          <li><span class="pick-chip">${esc(nycFigure(row.weekend))}/night</span> <span><a href="${anchor(row.name)}">${esc(row.short)}</a> · ${esc(row.weekend.both ? nycWeekendDetail(row.weekend) : `${nycOneNight(row.weekend)}; ${nycWeekendDetail(row.weekend)}`)}</span></li>`).join("\n")}
        </ul>
        <p class="price-basis">2 adults + ${esc(kidsText(nycKids))} · Fri–Sun, Jan 22–24, 2027 · Google Hotels, seen ${esc(nycSeen)} · room type not shown · not a quote · 3 kids not confirmed.</p></details>
`
    : "";

  const holidayTables = [nycHolidayTable(hotels, "christmas", "Christmas weekend, Dec 25–27, 2026", "Fri Dec 25", "Sat Dec 26", today), nycHolidayTable(hotels, "newYear", "New Year's weekend, Jan 1–3, 2027", "Fri Jan 1", "Sat Jan 2", today)].join("");
  const holiday = holidayTables ? `      <section id="nyc-holiday-prices" class="container page-section" style="scroll-margin-top: 80px">
        <div class="section-heading"><p class="eyebrow">Holiday prices</p><h2>${holidayNames.join(" and ")} weekend${holidayNames.length > 1 ? "s" : ""}</h2></div>
        <p class="hotel-holiday-note">One night, family of 4 (${esc(q18Party)}). Google Hotels, seen ${nycSeen}: estimates, not quotes. Prices and rooms change fast; check live. Two figures in a cell mean two searches differed. &quot;No price&quot; means none was shown on ${nycSeen}, not sold out.</p>
${holidayTables}      </section>
` : "";
  const body = `    <main id="main">
      <section id="nyc-hotel-intro" class="page-hero hotel-hero">
        <div class="container">
          <p class="eyebrow">New York City family hotels</p>
          <h1>New York City Family Hotels</h1>
          ${contributorCredit()}
          <p>${esc(liveFour ? (holidayNames.length ? "12 hotels for a family of 4, with weekend and holiday prices" : "12 hotels for a family of 4, with weekend prices") : "12 hotels for a family of 4")}: pick by kitchen, breakfast or pool.</p>
        </div>
      </section>
${nycGlance(hotels, [
    { label: "Midtown and Times Square", names: ["Homewood Suites by Hilton New York/Midtown Manhattan Times Square-South", "Radio City Apartments", "New York Marriott Marquis", "Embassy Suites by Hilton New York Manhattan Times Square", "TRYP by Wyndham New York City Times Square / Midtown"] },
    { label: "Central Park and Upper West Side", names: ["Residence Inn by Marriott New York Manhattan/Central Park", "Hotel Beacon"] },
    { label: "Downtown and Brooklyn", names: ["Conrad New York Downtown", "1 Hotel Brooklyn Bridge", "Four Seasons Hotel New York Downtown"] },
    { label: "Midtown East", names: ["Lotte New York Palace", "The Kimberly Hotel"] }
  ], today)}
      <section class="container media-section hero-photo-section">
        <figure class="licensed-photo hero-photo">
          <img src="../images/new-york-city-central-park.webp" alt="A cast-iron bridge among trees in Central Park, New York City." width="1280" height="894" loading="eager" fetchpriority="high" decoding="async">
          <figcaption>Photo: Jet Lowe / National Park Service, public domain via <a href="https://commons.wikimedia.org/wiki/File:Central_Park_New_York_City_New_York_23_cropped.jpg">Wikimedia Commons</a>. Resized and cropped to fit.</figcaption>
        </figure>
      </section>
      <section id="nyc-hotel-answer" class="container answer-box price-answer" aria-label="Short answer">
        <p class="pick-heading"><strong>Pick by trip style</strong>${liveFour ? " (family of 4, a night, Jan 22–24)" : ""}</p>
        <ul class="pick-list">
          <li><span class="pick-chip">Kitchen</span> <span>${esc(["Radio City", "Homewood", "Residence Inn", "Beacon"].map((name) => nycPickPrice(name, today)).join(", "))}${nycSet(hotels.find((hotel) => hotel.shortName === "Radio City"), "weekend", today)?.any ? " (Radio City: apartment type not shown)" : ""}</span></li>
          <li><span class="pick-chip">Breakfast</span> <span>${esc(["Homewood", "Residence Inn"].map((name) => nycPickPrice(name, today)).join(", "))}; Embassy Suites for a family of 3</span></li>
          <li><span class="pick-chip">Indoor pool</span> <span>${esc(nycPickPrice("Four Seasons Downtown", today))}${nycSet(hotels.find((hotel) => hotel.shortName === "Four Seasons Downtown"), "weekend", today)?.any ? " (may be a larger room or two rooms)" : ""}</span></li>
          <li><span class="pick-chip">5+ in one unit</span> <span>Radio City, TRYP family room, Beacon or Lotte suites${listing ? ": see Family of 5 below" : ""}</span></li>
        </ul>
        <p class="price-basis"><strong>Main catch:</strong> beds and registered occupancy differ by exact room; confirm your party in writing before paying.</p>
${family5}      </section>
      <section class="container trust-panel" aria-label="Review status">
        <p><strong>Official hotel pages re-read:</strong> November 5, 2026 (parts of Embassy Suites, TRYP and Marriott Marquis are older; see their cards). <strong>Review themes:</strong> July 25, 2026. ${liveFour ? "<strong>Google family prices seen:</strong> November 5, 2026." : "No current family price shown."}</p>
        <p>No booking quotes, so compare the same room and occupancy plus taxes and parking before booking. <a href="#price-basis">Price basis</a>.</p>
      </section>
      <section id="hotel-comparison" class="band" data-glance-first>
        <div class="container">
          <div class="section-heading"><p class="eyebrow">Comparison</p><h2>Quick hotel comparison</h2></div>
          <p class="review-label">${liveFour ? `Google Hotels prices per night, 2 adults + kids 5 and 8, Fri–Sun, Jan 22–24, 2027, seen ${nycSeen}: estimates, not quotes.` : "No current family price shown: check the live rate."} Compare the final total for the same dates, occupancy, and room setup. <a href="#price-basis">Full price basis</a> · <a href="./new-york-city-with-kids.html">Compare stay areas</a>.</p>
          <div class="comparison-scroll" role="region" aria-label="NYC twelve-hotel comparison" tabindex="0">
            <table class="comparison-table hotel-comparison nyc-compare">
              <thead><tr><th>Hotel</th><th>Weekend price (family of 4)</th><th>Best starting point for</th><th>Area</th><th>Map</th><th>Most important check</th></tr></thead>
              <tbody>
${rows}
              </tbody>
            </table>
          </div>
          <details id="price-basis" style="scroll-margin-top: 80px"><summary>Full price basis</summary><p>${esc(priceBasis)}</p></details>
          <details><summary>Spreadsheet copy</summary><p><a href="../downloads/new-york-city-family-hotels.csv" download>Download the twelve-hotel comparison (.csv)</a>. Same prices as this page.</p></details>
        </div>
      </section>
${holiday}      <section class="container page-section">
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
      <section id="sources-checked" class="container page-section source-section">
        <div class="section-heading"><p class="eyebrow">Sources checked</p><h2>How the hotel information was checked</h2></div>
        <p>Room and amenity facts come from official property pages, re-read November 5, 2026 except where a card says otherwise; three room checks were made on official booking sources on October 11, 2026. Online-review notes paraphrase a small directional sample from public booking and review pages; most public slices did not expose a reliable family-only count, so treat the themes as general guest signals rather than parent consensus. Prices are Google Hotels family listings, not live quotes.</p>
        <ul class="source-list">
${newYorkCityHotelSources.map(([label, href]) => `          <li><a href="${esc(href)}">${esc(label)}</a></li>`).join("\n")}
          <li><a href="https://commons.wikimedia.org/wiki/File:Central_Park_New_York_City_New_York_23_cropped.jpg">New York City photo source</a>, Jet Lowe / National Park Service, public domain.</li>
          <li>Public Expedia and Booking.com review pages checked July 25, 2026; exact URLs, sample freshness, conflicts, and evidence limits are recorded in the evidence pack.</li>
          <li>Google Hotels listing prices via DataForSEO, seen ${nycSeenLong}, including the family-of-5 listings.</li>
        </ul>
      </section>
      <script type="application/ld+json">${JSON.stringify(itemListJson)}</script>
      <script type="application/ld+json">${JSON.stringify(faqJson)}</script>
    </main>`;

  return pageShell({
    title: "Top Family Hotels in New York City: 12 Options by Trip Style",
    description: "Compare 12 New York City family hotels by trip style, room layout, occupancy, kitchens or breakfast, dated price samples, and sampled review themes.",
    canonical: "where-to-stay/new-york-city-family-hotels.html",
    nav: [["./new-york-city-with-kids.html", "Where to stay"], ["../things-to-do/new-york-city-with-kids.html", "Things to do"], ["../family-itinerary/new-york-city-with-kids.html", "Itinerary"]],
    body
  });
}

  return Object.freeze({
    hotelCatalog: structuredClone({
      "san-diego": sanDiegoFamilyHotels,
      "las-vegas": lasVegasFamilyHotels,
      "chicago": chicagoFamilyHotels,
      "new-york-city": newYorkCityFamilyHotels,
      "san-antonio": sanAntonioFamilyHotels
    }),
    sanDiegoFamilyHotelPage,
    sanDiegoHotelComparisonCsv,
    lasVegasFamilyHotelPage,
    lasVegasHotelComparisonCsv,
    chicagoFamilyHotelPage,
    chicagoHotelComparisonCsv,
    newYorkCityFamilyHotelPage,
    newYorkCityHotelComparisonCsv,
    sanAntonioFamilyHotelPage,
    q18Samples
  });
}
