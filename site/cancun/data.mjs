// Published rules and dated price observations, not live inventory or personally verified stays.
export const cancunEvidence = {
  schemaVersion: 1,
  checkedOn: "2026-09-23",
  recheckOn: "2026-10-23",
  lastUpdatedOn: "2026-09-27",
  priceRecheckOn: "2026-10-11",
  publicationStatus: "publication-candidate",
  sources: {
    F1: "https://www.finestresorts.com/cancun/finest-playa-mujeres/rooms/family-suite/",
    F2: "https://www.finestresorts.com/cancun/finest-playa-mujeres/finest-for-kids/",
    F3: "https://www.finestresorts.com/cancun/finest-playa-mujeres/frequently-asked-questions/",
    F4: "https://booking.finestresorts.com/en/bookcore/availability/finestplaya/2026-11-09/2026-11-12/2;3;7;12/?rrc=1&adults=2&children-ages=3%2C7%2C12&ninos=3&occupancies=%255B%257B%2522adults%2522%253A%25202%252C%2520%2522children%2522%253A%25203%252C%2520%2522ages%2522%253A%2520%25223%253B7%253B12%2522%257D%255D&occp=1",
    S1: "https://www.hyattinclusivecollection.com/en/resorts-hotels/sunscape/mexico/cancun-resort-spa/accommodations/rooms-suites/",
    S2: "https://www.resortsbyhyatt.com/sunscape/sunscape-cancun/cancun-all-inclusive-family-suites",
    S3: "https://www.resortsbyhyatt.com/sunscape/sunscape-cancun/all-inclusive-hotel-cancun-activities",
    S4: "https://www.resortsbyhyatt.com/sunscape/sunscape-cancun/frequently-asked-questions",
    S5: "https://secure.resortsbyhyatt.com/?adult=2&arrive=2026-10-27&chain=17001&child=2&childages=3%7C7&config=PlayaWebsite&currency=USD&depart=2026-10-30&hotel=95607&level=hotel&locale=en-US&productcurrency=USD&rate=BARWEB%2CWEBRCK&rooms=1&theme=PlayaWebsite",
    D1: "https://www.hyattinclusivecollection.com/en/resorts-hotels/dreams/mexico/sapphire-resort-spa/accommodations/club-level/",
    D2: "https://www.hyattinclusivecollection.com/en/resorts-hotels/dreams/mexico/sapphire-resort-spa/activities/",
    D3: "https://www.hyattinclusivecollection.com/en/resorts-hotels/dreams/mexico/sapphire-resort-spa/",
    D4: "https://www.sunscaperesorts.com/en/resorts-hotels/dreams/mexico/sapphire-resort-spa/accommodations/club-level/",
    R1: "https://www.royaltonresorts.com/resorts/splash-riviera-cancun/suites",
    R2: "https://www.royaltonresorts.com/resorts/splash-riviera-cancun",
    R3: "https://marriott.cdn.tambourine.com/royalton-resorts/media/rsplashcun_factsheet_spanish-67d1f4b2a8644.pdf",
    R4: "https://book.royaltonresorts.com/?adult=2&arrive=2026-11-09&chain=26025&child=2&childages=3%7C7&currency=USD&depart=2026-11-12&hotel=38092&level=hotel&locale=en-US&productcurrency=USD&room=LXUU2&rooms=1",
    G1: "https://thegrand.moonpalace.com/accommodations/grand-family-suite",
    G2: "https://thegrand.moonpalace.com/things-to-do/playroom",
    G3: "https://thegrand.moonpalace.com/",
    G4: "https://bookingsthegrandpr.moonpalace.com/rooms?&skd-total-rooms=1&adult_room1=2&child_room1_age0=1&skd-checkin=2026-10-18&skd-checkout=2026-10-23&skd-language-code=en&promocode=RETURN5&",
    G5: "https://bookingsthegrandpr.moonpalace.com/rooms?&skd-total-rooms=1&adult_room1=2&child_room1_age0=1&skd-checkin=2026-10-18&skd-checkout=2026-10-23&skd-language-code=en&",
    Z1: "https://www.hyatt.com/ziva/en-US/canif-hyatt-ziva-cancun/rooms/2VWD",
    Z2: "https://www.hyatt.com/ziva/en-US/canif-hyatt-ziva-cancun/faqs",
    Z3: "https://www.hyatt.com/ziva/en-US/canif-hyatt-ziva-cancun",
    Z4: "https://www.resortsbyhyatt.com/ziva/ziva-cancun/all-inclusive-resort-activities"
  },
  records: [
    {
      id: "finest-family-suite",
      hotel: "Finest Playa Mujeres",
      area: "Playa Mujeres, north of Cancun",
      room: {
        category: "Family Suite", maximum: 5, capacityStatus: "published",
        beds: "King, sofa bed and two singles; separate children's bedroom",
        layoutStatus: "published", sourceIds: ["F1"],
        checks: ["Published combinations include two adults and three children; exact-age rate classification and dated availability are unverified."]
      },
      price: {
        kind: "dated-single-plan-sample", usdFrom: 1177, usdTo: null,
        basis: "November 9-12, 2026; one Family Suite, two adults and children aged 3, 7 and 12, three nights. Public non-member Reserve Now And Pay Later / All Inclusive: USD 3,532 displayed total and USD 1,177 rounded per room/night; the displayed nightly figures do not sum exactly to the total. The locked rewards USD 3,426 total is excluded. One dated plan, not confirmed booking acceptance, a typical range, child-offer savings or guaranteed future price.",
        fees: "Booking display says all fees and taxes included; optional extras and any separately payable local levy are not itemized. Plan card says free transfer with a three-night minimum; confirm arrangements and your booking terms. Conditions say no cancellation fee 24 hours or more before arrival, but a whole-stay penalty 24 hours or less; the exact boundary overlaps, so confirm the cutoff and timezone. Unused stay is not refunded. Full charge is stated 30 days before arrival, with a separate check-in rule for bookings within four days; payment timing for this 29-days-before-arrival observation is unresolved.",
        observedOn: "2026-10-11", recheckOn: "2026-10-18", sourceIds: ["F4"]
      },
      clubs: {
        sourceIds: ["F2", "F3"],
        programs: [
          { name: "Mini Club accompanied access", min: 0, max: 2, parentRequired: true, registration: false, pottyRequired: false },
          { name: "Mini Club", min: 3, max: 6, parentRequired: false, registration: true, pottyRequired: false },
          { name: "Maxi Club", min: 7, max: 11, parentRequired: false, registration: true, pottyRequired: false }
        ],
        checks: ["Teen lounge is mentioned without an exact age band; do not infer admission for age 12.", "Imagine Lounge is separate mealtime care: toilet-trained ages 3+, registration, maximum 90 minutes. Its rules are not generalized to Mini/Maxi Club.", "Actual admission, capacity and current programme must be confirmed; absence of a recorded condition is not a waiver."]
      },
      transfers: { rule: "direct-offer", sourceIds: ["F3"], minimumNights: 3, airport: "CUN", checks: ["Offer covers new direct suite-only bookings; third-party and flight-package bookings are excluded from this offer. Confirm arrangements and your booking terms."] },
      extras: { sourceIds: ["F3"], checks: ["Motorized water sports and some extra experiences are outside the standard inclusions; a complete stay total is unknown."] }
    },
    {
      id: "sunscape-family-junior-suite",
      hotel: "Sunscape Cancun Resort & Spa",
      area: "Cancun Hotel Zone",
      room: {
        category: "Family Junior Suite", maximum: null, capacityStatus: "disputed",
        beds: "King, bunk bed and trundle",
        layoutStatus: "published", sourceIds: ["S1", "S2"],
        checks: ["One official page lists four guests; another lists two adults and three children. Retain both publications until exact-party acceptance is confirmed."]
      },
      price: {
        kind: "dated-single-plan-sample", usdFrom: 311, usdTo: null,
        basis: "October 27-30, 2026; one Family Junior Suite, King, Bunk and Trundle Bed, two adults and children aged 3 and 7, three nights. Non-member Sun-Kissed Savings + Kids Stay Free (12 & under): USD 934 displayed total and USD 311 rounded per room/night; the displayed nightly figures do not sum exactly to the total. Child-offer eligibility conflicts: general promotion stays start October 1, 2026, but the narrower child-benefit clause starts April 1, 2027. Do not infer kids-free eligibility or savings for this October stay; confirm the applicable terms. One dated plan, not confirmed booking acceptance, a typical range or guaranteed future price.",
        fees: "Booking display says taxes and fees included. The property's September 27 FAQ observation separately lists a MXN 79 per-room/night environmental tax; whether this particular displayed total includes it is unconfirmed. Cancellation summary says free up to 14 days before arrival, but detailed terms say free 15 days prior and 100% penalty 14-0 days; confirm the boundary. Full charge is stated 30 days before arrival, but payment timing for a booking already inside that window is unknown.",
        observedOn: "2026-10-11", recheckOn: "2026-10-18", sourceIds: ["S5", "S4"]
      },
      clubs: {
        sourceIds: ["S3"],
        programs: [
          { name: "Explorer's Club", min: 4, max: 12, parentRequired: false, registration: null, pottyRequired: null },
          { name: "Core Zone", min: 13, max: 17, parentRequired: false, registration: null, pottyRequired: null }
        ],
        checks: ["Age 3 is below the published Explorer's Club band, not proof that all resort activities exclude three-year-olds. Confirm admission conditions and actual operations."]
      },
      transfers: { rule: "extra", sourceIds: ["S4"], checks: ["Standard inclusions exclude airport transfers; packages may differ. Transport cost is unknown."] },
      extras: { sourceIds: ["S4"], checks: ["The FAQ lists an environmental tax of MXN 79 per room/night and room-service delivery charges despite general inclusion language; verify dated fee applicability. Nanny services are extra."] }
    },
    {
      id: "sapphire-family-junior-suite",
      hotel: "Dreams Sapphire Resort & Spa",
      area: "Riviera Cancun, not Cancun Hotel Zone",
      room: {
        category: "Preferred Club Family Junior Suite Tropical View", maximum: 6, capacityStatus: "published",
        beds: "Official category lists king or two doubles; fifth sleeping place and connected layout unresolved",
        layoutStatus: "unknown", sourceIds: ["D1", "D3"],
        checks: ["Published maximum is six guests, up to four adults. Confirm the exact booked unit, connection guarantee, sleeping places, child pricing and availability."]
      },
      price: {
        kind: "derived-two-adult-starting", usdFrom: 1015, usdTo: null,
        basis: "Two-adult room-night equivalent of the property's USD 507.50 per-person/night September low-season starting sample for this exact Preferred Club category; exact dates and child rates not stated.",
        fees: "Tax and fee inclusion not stated.", observedOn: "2026-09-27", sourceIds: ["D4"]
      },
      clubs: {
        sourceIds: ["D2"],
        programs: [
          { name: "Explorer's Club", min: 3, max: 12, parentRequired: false, registration: null, pottyRequired: true },
          { name: "Core Zone", min: 13, max: 17, parentRequired: false, registration: null, pottyRequired: null }
        ],
        checks: ["Explorer's Club requires full toilet training. Hours vary seasonally; programming and admission remain subject to confirmation. Separate childcare costs extra."]
      },
      transfers: { rule: "extra", sourceIds: ["D3"], checks: ["The resort assigns transport costs to guests; a package-specific inclusion must be checked separately."] },
      extras: { sourceIds: ["D2", "D3"], checks: ["Separate childcare and some activities cost extra; no complete room/fee/transfer quote has been observed."] }
    },
    {
      id: "royalton-splash-two-bedroom",
      hotel: "Royalton Splash Riviera Cancun",
      area: "Riviera Cancun, not Cancun Hotel Zone",
      room: {
        category: "Luxury Two Bedroom Junior Suite", maximum: 8, capacityStatus: "disputed",
        capacityConflict: "Child limit disputed: 6 versus 2; total maximum 8",
        beds: "Two bedrooms; two kings or one king and two queens. The description also mentions a sofa bed.",
        layoutStatus: "published", sourceIds: ["R1", "R3", "R4"],
        checks: ["The current suites page lists up to six children; the official Spanish factsheet lists two for the matching category. Both list eight guests total. Obtain exact-party confirmation; do not add adult and child limits together.", "The September 23 room record describes the non-Diamond Sunset View category. On October 11 the same LXUU2 booking code is titled Two Bedroom Luxury Junior Suite, describes mangrove views, and gives different bed descriptions. The earlier view and bedding are not reconfirmed; ask which exact unit and sleeping places your rate supplies."]
      },
      price: {
        kind: "dated-rate-plan-sample", usdFrom: 997.70, usdTo: 1247.75,
        basis: "November 9-12, 2026; two adults and children aged 3 and 7, one suite, three nights. Booking code LXUU2 is now titled Two Bedroom Luxury Junior Suite; its mangrove-view and bed descriptions differ from the older room record, so category continuity and sleeping layout need confirmation. Fall into Savings: Flexible Stay (USD 997.70 per room/night; USD 2,993.10 total); Standard Rate (USD 1,247.75 per room/night; USD 3,743.25 total). These are public dated rate-plan examples, not a seasonal range, child-offer savings or confirmed booking acceptance.",
        fees: "Booking display says taxes and fees included, but environmental sanitation is payable at the resort and excluded; the current notice gives no numeric amount. The September 27 price record used MXN 85.40 per-room/night from the earlier suites source; that amount is not refreshed and fees may change. Flexible total includes USD 559.68 room taxes/fees; Standard's modal does not separately itemize them. Both inspected plans say full charge two days before arrival, full refund outside 48 hours, a first-night penalty and no modifications within 48 hours, and a two-night no-show penalty. Confirm exact deadlines, room and final charges.",
        observedOn: "2026-10-11", recheckOn: "2026-10-18", sourceIds: ["R4"]
      },
      clubs: {
        sourceIds: ["R2"],
        programs: [{ name: "Kids Club", min: 4, max: 12, parentRequired: false, registration: null, pottyRequired: null }],
        checks: ["A teen club is mentioned, but its exact age band was not established by this source. Confirm registration, toilet-training conditions, hours and admission."]
      },
      transfers: { rule: "unknown", sourceIds: ["R2"], checks: ["Transfer inclusion was not established from the inspected resort page. Obtain the terms for your specific booking; do not assume a free transfer."] },
      extras: { sourceIds: ["R1", "R2"], checks: ["The suites page lists MXN 85.40 per room or suite/night for environmental sanitation, outside the quoted price and subject to change. Confirm the levy for this two-bedroom booking.", "Trampoline park, bowling and laser tag carry extra charges; complete stay cost is unknown."] }
    },
    {
      id: "ziva-ocean-view-double",
      hotel: "Hyatt Ziva Cancun",
      area: "Cancun Hotel Zone",
      room: {
        category: "Ocean View Double", maximum: 4, capacityStatus: "published",
        beds: "Exact bed configuration needs confirmation; the room page warns that pictures may differ.",
        layoutStatus: "unknown", sourceIds: ["Z1"],
        checks: ["Four guests total, including up to three children; not four adults plus three children. Confirm your exact ages and sleeping places. A rollaway request does not increase the maximum."]
      },
      price: null,
      clubs: {
        sourceIds: ["Z4"], checkedOn: "2026-10-11", recheckOn: "2026-10-18",
        priorSourceIds: ["Z2", "Z3"], priorCheckedOn: "2026-09-23",
        programs: [
          { name: "KidZ Club", min: 4, max: 12, parentRequired: null, registration: null, pottyRequired: null },
          { name: "@Moods Lounge and Club", min: 10, max: 17, parentRequired: null, registration: null, pottyRequired: null }
        ],
        checks: ["Both programs are listed as included; ages 10-12 overlap. Published age matches do not confirm admission, registration, training requirements, current hours or capacity.", "Younger-child family time with a parent is described separately; its exact age cutoff and access conditions are not established. It is not parent-free care.", "The KidZ disclosure says babysitting should be requested through Concierge upon arrival and costs extra. The retained older FAQ says advance arrangements; confirm the timing rather than assuming arrival is sufficient. Numeric fee, billing unit, minimum, toddler acceptance and availability remain unknown; included clubs do not make private care free."]
      },
      transfers: { rule: "extra", sourceIds: ["Z2"], checks: ["The FAQ excludes airport transport from standard inclusions; the resort offers it at additional cost. Confirm any package exception."] },
      extras: { sourceIds: ["Z2"], checks: ["Babysitting costs extra and needs advance arrangements. The FAQ's Interval International package section lists MXN 79 per room/night environmental tax; confirm whether that amount applies to your rate.", "Spa services and rented beach cabanas are extra. Complete stay cost remains unknown."] }
    },
    {
      id: "grand-family-suite",
      hotel: "Moon Palace The Grand Cancun",
      area: "Cancun area",
      room: {
        category: "Grand Family Suite", maximum: 7, capacityStatus: "published",
        beds: "Two connecting rooms: one king and two doubles; a rollaway for the seventh guest, who must be a child.",
        layoutStatus: "published", sourceIds: ["G1"],
        checks: ["The named category publishes seven guests. Confirm your exact ages, rate classification, rollaway arrangement and availability; this does not confirm a booking."]
      },
      price: {
        kind: "dated-single-plan-sample", usdFrom: 1945, usdTo: null,
        basis: "October 18-23, 2026; one Grand Family Suite, two adults, one child aged 4-17 and one infant aged 0-3, five nights. Set both child age bands in the booking selector; the link may reopen with only the infant. No entered promo code after removing RETURN5; All Inclusive Best Flexible Rate showed USD 9,723 total and USD 1,945 average per room/night (rounded display). The kids-and-teens-free benefit was still displayed: this is not a non-offer rate or proof of savings. Exact child ages were not entered; the remembered-search summary still said two people despite the four-person age-band controls. One dated plan, not confirmed party acceptance, a typical rate or a family-of-five quote.",
        fees: "Booking display says taxes and fees included; any separately payable local levy is unconfirmed. Free cancellation until four days before arrival, then a one-night penalty; full card charge 72 hours before arrival. Recheck terms and exact-party eligibility.",
        observedOn: "2026-10-11", recheckOn: "2026-10-18", sourceIds: ["G5", "G1"]
      },
      clubs: {
        sourceIds: ["G2"], programs: [],
        checks: ["The official Playroom page was only partially readable during this check. Confirm floor-specific age rules, adult accompaniment and current admission; no drop-off age match is inferred."]
      },
      transfers: { rule: "unknown", sourceIds: ["G3"], checks: ["Transfer inclusion and eligibility were not established from the inspected page. Check the exact booking offer, airport route and arrangements."] },
      extras: { sourceIds: ["G3"], checks: ["The dated sample includes displayed taxes and fees, but separately payable local levies and paid extras were not established. Request an itemized quote for your own party and dates rather than treating all-inclusive wording as a complete cost guarantee."] }
    }
  ]
};
