export const checkedOn = "2026-09-24";
export const recheckOn = "2026-10-24";
export const pageUpdatedOn = "2026-09-27";
export const priceRecheckOn = "2026-10-18";
export const sources = {
  disneyRoom: "https://disneyworld.disney.go.com/resorts/art-of-animation-resort/rates-rooms/",
  disneyTransport: "https://disneyworld.disney.go.com/resorts/art-of-animation-resort/amenities/",
  disneyWater: "https://disneyworld.disney.go.com/guest-services/water-park-disney-resort-benefit/",
  cabanaRoom: "https://www.loewshotels.com/cabana-bay-hotel/rooms-showcase/courtyard-family-suite-poolside",
  cabanaHotel: "https://www.loewshotels.com/cabana-bay-hotel",
  cabanaBooking: "https://reservations.universalorlando.com/ibe/details.aspx?hotelID=14844&lang=en-us&rmID=75837&voucher=&currID=1&access=",
  universalBenefits: "https://www.loewshotels.com/universal-orlando-resort/exclusive-theme-park-benefits",
  ihgRoom: "https://www.ihg.com/holidayinnresorts/hotels/us/en/orlando/disfs/hoteldetail/rooms",
  ihgDining: "https://www.ihg.com/holidayinnresorts/hotels/us/en/orlando/disfs/hoteldetail/dining",
  ihgBooking: "https://www.ihg.com/holidayinnresorts/hotels/us/en/find-hotels/select-roomrate?qDest=18000%20International%20Drive%20S,%20Orlando,%20FL,%20US&qPt=CASH&qCiD=8&qCoD=13&qCiMy=102026&qCoMy=102026&qAdlt=2&qChld=3&qRms=1&qChAge=..&qRtP=6CBARC&qSlH=DISFS&srb_u=1&qFS=false&qSrt=sBR&qBrs=6c.hi.ex.sb.ul.ic.cp.cw.in.vn.cv.rs.ki.kd.ma.sp.va.sp.re.vx.nd.sx.we.lx.rn.sn.sn.sn.sn.sn.nu.ge.fa&qWch=0&qSmP=0&qRad=30&qRdU=mi&setPMCookies=false&qRCC=CG020&qpMbw=0&qErm=false&qpMn=0&qpMbx=0&qRmFltr=",
  ihgAmenities: "https://www.ihg.com/holidayinnresorts/hotels/us/en/orlando/disfs/hoteldetail/amenities",
  ihgWaterFaq: "https://www.surfandsplashorlandowaterpark.com/faqs/"
};

// Null means not established by the cited evidence, never a zero charge or a match.
export const suites = [
  {
    id: "art-of-animation", name: "Disney's Art of Animation Resort", base: "Walt Disney World",
    room: "Finding Nemo Family Suite", maximum: 6, capacitySource: "disneyRoom",
    layout: "Queen bed, double sofa bed and double pull-down bed; two bathrooms and a kitchenette. Disney publishes a maximum of six adults.",
    transport: "Skyliner connections serve EPCOT and Hollywood Studios. Disney buses serve other resort destinations; this is not a Universal shuttle.", transportSource: "disneyTransport",
    water: "The check-in-day water-park benefit has ended for 2026. Summer 2027 is announced, but exact eligible dates are not yet published.", waterSource: "disneyWater",
    caution: "The official room page displays a refurbishment notice. Exact work areas, dates and impact on this suite remain unverified.",
    parking: 0, parkingSource: "disneyTransport", resortFee: null,
    costNote: "Overnight self-parking is complimentary. Other charges and the room total are not established here.",
    next: "Confirm the suite for every child's travel age, refurbishment impact and transport for your actual park days."
  },
  {
    id: "cabana-bay", name: "Universal Cabana Bay Beach Resort", base: "Universal Orlando",
    room: "Poolside Family Suite - Exterior Entry", maximum: 6, capacitySource: "cabanaRoom",
    layout: "Two queen beds and a sofa bed; sliding privacy partition and kitchenette. Published maximum: six people.",
    kitchenPolicy: {
      checkedOn: "2026-10-11", recheckOn: "2026-10-18", source: "cabanaRoom",
      equipment: ["Mini refrigerator", "Microwave", "Small sink"],
      planningNote: "Research-based meal planning: the listed microwave supports planning around reheating, not an assumption of a full cooking kitchen.",
      limitation: "Stovetop or oven availability, cookware, freezer capacity and dining space for your party are not established here. Confirm what your meals need before choosing this suite; no meal-cost savings are calculated or guaranteed. This equipment check does not renew room prices, occupancy acceptance or other property facts."
    },
    transport: "Complimentary Universal shuttle buses are listed. Cross-resort travel to Disney needs separate planning.", transportSource: "cabanaHotel",
    water: "Hotel pools include a lazy river and slide. They are separate from ticketed Volcano Bay, whose seasonal closure starts October 26, 2026; reopening is expected on or before April 1, 2027, not confirmed.", waterSource: "cabanaHotel",
    caution: "Complimentary Universal Express Unlimited is NOT included at Cabana Bay. Early Park Admission needs valid admission and is limited to participating parks, attractions and operating dates.", cautionSource: "universalBenefits",
    parking: 26, parkingSource: "cabanaHotel", resortFee: null,
    parkingUnit: null, parkingCheckedOn: "2026-10-11", parkingRecheckOn: "2026-10-18",
    costNote: "Overnight guest self-parking: $26 plus tax per vehicle, subject to change. The inspected wording does not establish billing frequency, tax amount or inclusion in your rate; no stay subtotal is calculated. Amount interpreted as USD from the US property context, not a displayed ISO label. Parking wording observed October 11, 2026; check current terms before booking. Other property facts and room prices are not renewed.",
    bookingRates: {
      checkedOn: "2026-10-11", recheckOn: "2026-10-18", source: "cabanaBooking",
      room: "Poolside Family Suite Exterior Entry", party: "two adults and three children (0-17 band counts; individual ages not entered)",
      stay: "November 8-13, 2026", nights: 5,
      currency: "USD", currencyBasis: "USD is interpreted from the US Orlando storefront and dollar display; no ISO currency label was observed.",
      plans: [
        { plan: "Special Offer", nightlyBeforeTax: [194, 175, 144, 172, 216], roomSubtotal: 901, taxes: 112.63, estimatedTotal: 1013.63, restrictions: "Not combinable with other offers or discounts. Other eligibility conditions were not established." },
        { plan: "Flexible Rate", nightlyBeforeTax: [277, 250, 206, 245, 308], roomSubtotal: 1286, taxes: 160.75, estimatedTotal: 1446.75, restrictions: "Displayed anonymously for this party. The description refers to a double-occupancy base rate; individual child pricing was not established." }
      ],
      terms: "Both plans require a refundable deposit equal to one night's stay at booking. Cancel by 6:00 PM local hotel time at least five days before arrival to avoid a one-night cancellation penalty. Confirm the applicable deadline and deposit amount before paying.",
      feeBasis: "Displayed room subtotal and taxes only. Resort fee and other mandatory extras were not established; parking, meals, tickets and transfers are not priced. Not an all-fee or full-trip total.",
      limitation: "Dated party-count observations, not typical ranges, live quotes or confirmed acceptance of individual ages 4, 8 and 12. Changing the comparison inputs does not update these prices. Accessible room categories are separate; these rates do not establish their availability."
    },
    next: "Confirm pool operations, your park's early-entry schedule and ticket requirements; do not treat a Volcano Bay view as park access."
  },
  {
    id: "holiday-inn", name: "Holiday Inn Resort Orlando Suites - Waterpark", base: "Off-site Orlando base",
    room: "Two Bedroom Suite (configuration must be selected)", maximum: 6, capacitySource: "ihgBooking", layoutSource: "ihgRoom",
    mealPolicy: {
      checkedOn: "2026-10-11", recheckOn: "2026-10-18", roomSource: "ihgRoom", diningSource: "ihgDining",
      kitchenType: null, equipment: null,
      kitchenNote: "The room page describes kitchenettes or full kitchens across suites, but does not map a kitchen type or appliance list to this Two Bedroom Suite. Confirm the selected configuration; a three-bedroom kitchen photo is not evidence for this room.",
      breakfast: { venue: "Lakeside Cafe", location: "Marketplace", opens: "6:30 AM", closes: "10:30 AM" },
      limitation: "The dining listing does not establish meal prices or breakfast coverage for every adult and child. Confirm hours for your travel dates and each guest's entitlement under the selected rate. No meal-cost savings are calculated; this check does not renew room prices, fees or exact-age acceptance."
    },
    layout: "IHG lists queen/bunk, king/bunk or queen/two-single layouts at 595 sq ft. Its September 27 booking result lists a six-person maximum for these exact configurations; ages and availability still need confirmation.",
    transport: "Disney shuttle service is listed in the resort-fee inclusions. Exact park stops, timetable and reservations need confirmation; no Universal service is established here.", transportSource: "ihgAmenities",
    water: "The general resort fee lists Surf & Splash access for up to six guests. FlowRider is excluded. Admission count alone does not establish room occupancy or individual ride eligibility.", waterSource: "ihgAmenities",
    waterPolicy: {
      checkedOn: "2026-10-11", recheckOn: "2026-10-18", source: "ihgWaterFaq",
      rides: [
        { name: "Duel Drop Racers", minimumInches: 42 },
        { name: "Surf Spin body slide", minimumInches: 40 },
        { name: "FlowRider bodyboarding", minimumInches: 42 },
        { name: "FlowRider stand-up surfing", minimumInches: 52 }
      ],
      costConflict: "Official cost conflict: IHG says FlowRider is not included in the resort fee and reservations are required; the waterpark FAQ calls a standard 30-minute session with a pro instructor complimentary. The applicable charge and entitlement for your stay remain unresolved; do not budget zero or assume a session is included.",
      limitation: "These are published minimum heights, not complete ride rules or confirmed admission. Do not infer height from age. Confirm other restrictions, reservations and operations for your dates. Room prices, resort fees and other property facts are not renewed by this policy check."
    },
    caution: "The general IHG amenities page lists a $65 plus tax nightly resort fee; September 27 booking-rate details displayed $54 plus tax. Use the actual rate's fee and inclusions, not one universal amount.", cautionSource: "ihgBooking",
    parking: 31, parkingSource: "ihgAmenities", resortFee: 65,
    costNote: "Parking: $31 plus tax per vehicle per night. Check the actual rate's fee inclusion before adding anything again.",
    priceSample: {
      observedOn: "2026-10-11", stay: "November 8-13, 2026", nights: 5,
      room: "2 Bedroom Suite 1 Queen 1 Bunk Bed", party: "two adults and three children (ages not entered)",
      plan: "non-member Stay Longer And Save", roomSubtotal: 405, resortFees: 270, taxes: 84.40,
      estimatedTotal: 759.40, source: "ihgBooking",
      terms: "Breakfast is listed, but covered guest count is not established. Four-night minimum; book at least four days ahead. First-night deposit is non-refundable; cancellation or no-show costs the first night per room, with possible taxes. Early checkout or fewer nights may increase the room rate."
    },
    alternatePriceSample: {
      observedOn: "2026-10-11", stay: "November 8-13, 2026", nights: 5,
      room: "2 Bedroom Suite 1 Queen 1 Bunk Bed", party: "two adults and three children (ages not entered)",
      plan: "non-member Best Flexible Rate", roomSubtotal: 455, resortFees: 270, taxes: 90.65,
      estimatedTotal: 815.65, source: "ihgBooking",
      terms: "Cancel before 6:00 PM local hotel time on November 6, 2026 for no cancellation charge. Later cancellation or no-show costs the first night per room, with possible taxes. A first-night deposit is required; breakfast coverage is not established for this plan."
    },
    priceTerms: {
      checkedOn: "2026-10-11", recheckOn: "2026-10-18",
      limitation: "Both samples include the displayed USD54 per-night resort fee and taxes; do not add that fee again. Parking is extra at USD31 plus tax per vehicle per night in these rate details. They are age-unverified headcount results, not typical ranges, live quotes, confirmed acceptance of ages 4, 8 and 12, or complete trip budgets.",
      depositConflict: "Deposit timing conflict in both plans: Deposit Rules say the first-night deposit is due at booking, while Security Deposit text says seven days before arrival. Confirm payment timing before booking."
    },
    next: "Confirm your children's ages and the chosen suite's sleeping setup and availability, then rate-plan fee inclusion, height restrictions and shuttle details."
  }
];
