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
    Z1: "https://www.hyatt.com/ziva/en-US/canif-hyatt-ziva-cancun/rooms/2VWD",
    Z2: "https://www.hyatt.com/ziva/en-US/canif-hyatt-ziva-cancun/faqs",
    Z3: "https://www.hyatt.com/ziva/en-US/canif-hyatt-ziva-cancun"
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
        kind: "official-starting", usdFrom: 843, usdTo: null,
        basis: "Family Suite starting rate; guest mix and travel dates not stated by the property.",
        fees: "Tax and fee inclusion not stated.", observedOn: "2026-09-27", sourceIds: ["F1"]
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
        kind: "dated-single-plan-sample", usdFrom: 330, usdTo: null,
        basis: "October 27-30, 2026; one Family Junior Suite, two adults and children aged 3 and 7, three nights. Non-member Book Early, Save More + Kids Stay Free (12 & under): USD 990 displayed total. One dated plan, not a typical range or guaranteed future price.",
        fees: "Booking display says taxes and fees included. The property's FAQ separately lists a MXN 79 per-room/night environmental tax; whether this particular displayed total includes it is unconfirmed.",
        observedOn: "2026-09-27", sourceIds: ["S5", "S4"]
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
        layoutStatus: "published", sourceIds: ["R1", "R3"],
        checks: ["The current suites page lists up to six children; the official Spanish factsheet lists two for the matching category. Both list eight guests total. Obtain exact-party confirmation; do not add adult and child limits together.", "This is the Sunset View category, not the similarly named Diamond Club category. Confirm bed allocation and the sofa bed for your party."]
      },
      price: {
        kind: "dated-rate-plan-sample", usdFrom: 1035.73, usdTo: 1295.28,
        basis: "November 9-12, 2026; two adults and children aged 3 and 7, one suite, three nights. Fall into Savings: Flexible Stay (USD 3,107.18 total); Standard Rate (USD 3,885.85 total). These are rate-plan examples, not a seasonal range.",
        fees: "Booking display says taxes and fees included, but the separate MXN 85.40 per-room/night sanitation fee is payable at the resort and excluded.",
        observedOn: "2026-09-27", sourceIds: ["R4"]
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
        sourceIds: ["Z2", "Z3"], programs: [],
        checks: ["Current exact club-age and admission rules were not established from the inspected official pages. Ask about each child; unknown does not mean no club or activities."]
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
        kind: "dated-single-plan-sample", usdFrom: 1638, usdTo: null,
        basis: "October 18-23, 2026; one Grand Family Suite, two adults, one child aged 4-17 and one infant aged 0-3, five nights. Set both child age bands in the booking selector; the link may reopen with only the infant. Automatically applied RETURN5 promo; All Inclusive Best Flexible Rate showed USD 8,191 total and USD 1,638 average per room/night. Exact child ages were not entered; one dated plan, not a typical rate or a family-of-five quote.",
        fees: "Booking display says taxes and fees included; any separately payable local levy is unconfirmed. Free cancellation until four days before arrival, then a one-night penalty; full card charge 72 hours before arrival. Recheck terms and exact-party eligibility.",
        observedOn: "2026-09-27", sourceIds: ["G4", "G1"]
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
