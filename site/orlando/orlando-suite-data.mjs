export const checkedOn = "2026-09-24";
export const recheckOn = "2026-10-24";
export const pageUpdatedOn = "2026-09-27";
export const priceRecheckOn = "2026-10-11";
export const sources = {
  disneyRoom: "https://disneyworld.disney.go.com/resorts/art-of-animation-resort/rates-rooms/",
  disneyTransport: "https://disneyworld.disney.go.com/resorts/art-of-animation-resort/amenities/",
  disneyWater: "https://disneyworld.disney.go.com/guest-services/water-park-disney-resort-benefit/",
  cabanaRoom: "https://www.loewshotels.com/cabana-bay-hotel/rooms-showcase/courtyard-family-suite-poolside",
  cabanaHotel: "https://www.loewshotels.com/cabana-bay-hotel",
  universalBenefits: "https://www.loewshotels.com/universal-orlando-resort/exclusive-theme-park-benefits",
  ihgRoom: "https://www.ihg.com/holidayinnresorts/hotels/us/en/orlando/disfs/hoteldetail/rooms",
  ihgBooking: "https://www.ihg.com/holidayinnresorts/hotels/us/en/find-hotels/select-roomrate?qDest=18000%20International%20Drive%20S,%20Orlando,%20FL,%20US&qPt=CASH&qCiD=8&qCoD=13&qCiMy=102026&qCoMy=102026&qAdlt=2&qChld=3&qRms=1&qChAge=..&qRtP=6CBARC&qSlH=DISFS&srb_u=1&qFS=false&qSrt=sBR&qBrs=6c.hi.ex.sb.ul.ic.cp.cw.in.vn.cv.rs.ki.kd.ma.sp.va.sp.re.vx.nd.sx.we.lx.rn.sn.sn.sn.sn.sn.nu.ge.fa&qWch=0&qSmP=0&qRad=30&qRdU=mi&setPMCookies=false&qRCC=CG020&qpMbw=0&qErm=false&qpMn=0&qpMbx=0&qRmFltr=",
  ihgAmenities: "https://www.ihg.com/holidayinnresorts/hotels/us/en/orlando/disfs/hoteldetail/amenities"
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
    transport: "Complimentary Universal shuttle buses are listed. Cross-resort travel to Disney needs separate planning.", transportSource: "cabanaHotel",
    water: "Hotel pools include a lazy river and slide. They are separate from ticketed Volcano Bay, whose seasonal closure starts October 26, 2026; reopening is expected on or before April 1, 2027, not confirmed.", waterSource: "cabanaHotel",
    caution: "Complimentary Universal Express Unlimited is NOT included at Cabana Bay. Early Park Admission needs valid admission and is limited to participating parks, attractions and operating dates.", cautionSource: "universalBenefits",
    parking: 26, parkingSource: "cabanaHotel", resortFee: null,
    costNote: "Published overnight parking: $26 plus tax per vehicle, subject to change. This is not a room or whole-trip quote.",
    next: "Confirm pool operations, your park's early-entry schedule and ticket requirements; do not treat a Volcano Bay view as park access."
  },
  {
    id: "holiday-inn", name: "Holiday Inn Resort Orlando Suites - Waterpark", base: "Off-site Orlando base",
    room: "Two Bedroom Suite (configuration must be selected)", maximum: 6, capacitySource: "ihgBooking", layoutSource: "ihgRoom",
    layout: "IHG lists queen/bunk, king/bunk or queen/two-single layouts at 595 sq ft. Its September 27 booking result lists a six-person maximum for these exact configurations; ages and availability still need confirmation.",
    transport: "Disney shuttle service is listed in the resort-fee inclusions. Exact park stops, timetable and reservations need confirmation; no Universal service is established here.", transportSource: "ihgAmenities",
    water: "The general resort fee lists Surf & Splash access for up to six guests. FlowRider is excluded. Admission count alone does not establish room occupancy or individual ride eligibility.", waterSource: "ihgAmenities",
    caution: "The general IHG amenities page lists a $65 plus tax nightly resort fee; September 27 booking-rate details displayed $54 plus tax. Use the actual rate's fee and inclusions, not one universal amount.", cautionSource: "ihgBooking",
    parking: 31, parkingSource: "ihgAmenities", resortFee: 65,
    costNote: "Parking: $31 plus tax per vehicle per night. Check the actual rate's fee inclusion before adding anything again.",
    priceSample: {
      observedOn: "2026-09-27", stay: "November 8-13, 2026", nights: 5,
      room: "Two Bedroom Suite 1 Queen 1 Bunk Bed", party: "two adults and three children (ages not entered)",
      plan: "non-member Stay Longer And Save", roomSubtotal: 409, resortFees: 270, taxes: 84.90,
      estimatedTotal: 763.90, source: "ihgBooking"
    },
    next: "Confirm your children's ages and the chosen suite's sleeping setup and availability, then rate-plan fee inclusion, height restrictions and shuttle details."
  }
];
