// Published rules, not live inventory, pricing or personally verified stays.
export const cancunEvidence = {
  schemaVersion: 1,
  checkedOn: "2026-09-23",
  recheckOn: "2026-10-23",
  publicationStatus: "publication-candidate",
  sources: {
    F1: "https://www.finestresorts.com/cancun/finest-playa-mujeres/rooms/family-suite/",
    F2: "https://www.finestresorts.com/cancun/finest-playa-mujeres/finest-for-kids/",
    F3: "https://www.finestresorts.com/cancun/finest-playa-mujeres/frequently-asked-questions/",
    S1: "https://www.hyattinclusivecollection.com/en/resorts-hotels/sunscape/mexico/cancun-resort-spa/accommodations/rooms-suites/",
    S2: "https://www.resortsbyhyatt.com/sunscape/sunscape-cancun/cancun-all-inclusive-family-suites",
    S3: "https://www.resortsbyhyatt.com/sunscape/sunscape-cancun/all-inclusive-hotel-cancun-activities",
    S4: "https://www.resortsbyhyatt.com/sunscape/sunscape-cancun/frequently-asked-questions",
    D1: "https://www.hyattinclusivecollection.com/en/resorts-hotels/dreams/mexico/sapphire-resort-spa/accommodations/club-level/",
    D2: "https://www.hyattinclusivecollection.com/en/resorts-hotels/dreams/mexico/sapphire-resort-spa/activities/",
    D3: "https://www.hyattinclusivecollection.com/en/resorts-hotels/dreams/mexico/sapphire-resort-spa/"
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
    }
  ]
};
