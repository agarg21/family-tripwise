import { sanDiegoSources, SAN_DIEGO_ADDITIONS, SAN_DIEGO_FEES } from "../legacy-hotel-sources.mjs";
import { readFileSync } from "node:fs";

const currentLaJollaFees = JSON.parse(readFileSync(new URL("../../docs/research/la-jolla-shores-fees-2026-10-05.json", import.meta.url), "utf8")).fee_envelope;
const currentLoewsFees = JSON.parse(readFileSync(new URL("../../docs/research/loews-coronado-fees-2026-10-06.json", import.meta.url), "utf8")).fee_envelope;

const rules = {
  "Bahia Resort Hotel": {
    room: ["BAH-2", { category: "Bay Family Suite", size_sq_ft: 675, kitchenette: true, bathrooms: 2, bedding: "Sofa bed; headline says two queens plus a double, body calls the connecting bed a queen", maximum: null }, "disputed"],
    fees: ["BAH-1", { resort_fee_usd: 48, parking_usd: 0, parking_limit: "One vehicle per room", tax_inclusion: null }, "known", "2026-09-27"],
    activities: ["BAH-1,BAH-2", "Pool/bay setting; breakfast depends on rate; current operations and water suitability unknown"],
    price: ["BAH-P", "Standard-room public examples; exact OTA room category unknown, not a Bay Family Suite quote", "Two adults for one-night OTA examples; Tripadvisor range party unknown", "One-night examples; exact travel dates unknown", "OTA examples around339-347included taxes/fees; Tripadvisor297-627before tax; planning band has mixed inclusion"],
    review: "BAH-R"
  },
  "San Diego Mission Bay Resort": {
    room: ["MBR-2", { category: null, maximum: "Up to six subject to exact room", rollaway: "Limited, fire-code dependent; $35 plus tax", connecting: "Not guaranteed" }],
    fees: ["MBR-1,MBR-2", { resort_fee_usd: 46, resort_fee_tax: "Plus tax", parking_usd: 47 }],
    activities: ["MBR-1", "Pool, shallow wading pool, beach access and seasonal activities; current calendar/child rules unknown"],
    price: ["MBR-P", "Lowest visible standard-room example; exact category unknown", "Two adults", "One night within next30days where exposed; exact date unknown", "Around374OTAexample includes taxes/fees; parking and exact family-room total unverified"], review: "MBR-R"
  },
  "Hyatt Regency Mission Bay Spa and Marina": {
    room: ["HY-2", { category: "Two-queen rooms and suites listed, no selected category", maximum: null, refrigerator: true, play_yard: "On request", microwave: "On request for fee where listed" }],
    fees: ["HY-3", { resort_fee_usd: 46, parking_usd: null, unknowns: ["Official parking amount not found", "Tax/rate inclusion unknown"] }],
    activities: ["HY-1", "Lagoon pools, three waterslides, hot tub and children's pool area; height/hours and exact child suitability unknown"],
    price: ["HY-P", "Public standard-room examples; exact category unknown", null, "July18visibility; exact stay dates unknown", "Expedia around351including taxes/fees; KAYAK270-311with fees; official parking amount unknown"], review: "HY-R"
  },
  "Paradise Point Resort & Spa": {
    room: ["PP-1", { category: "Bungalow-style rooms/suites; exact family layout unknown", maximum: null }],
    fees: ["PP-1", { resort_fee_usd: 46, inclusion: "Amenities fee described as included in guestroom rate", parking_usd: 49, parking_basis: "Reserved doorstep parking", tax_inclusion: null }],
    activities: ["PP-1", "Five heated pools, beach areas, marina, recreation and seasonal activities; current operations/redevelopment status unknown"],
    price: ["PP-P", "Standard-room public examples; larger/bayfront room prices unknown", null, "July18visibility; exact stay dates unknown", "Expedia349-358including taxes/fees; KAYAK240-360with fees; parking separate"], review: "PP-R"
  },
  "Catamaran Resort Hotel and Spa": {
    room: ["CAT-1,CAT-2", { category: "Studios/suites with room-specific sofa beds/kitchenettes", maximum: "Up to six subject to room", crib_rollaway: "Request-only, not guaranteed", kitchen: "Mini refrigerator, microwave, toaster oven and requestable equipment where listed" }],
    fees: ["CAT-1", { resort_fee_usd: 46, self_parking_usd: 47, valet_usd: 50, parking_basis: "Alternatives, not additive", tax_inclusion: null }, "known", "2026-09-27"],
    activities: ["CAT-1,CAT-2", "Bay/beach location; current pool operations and housekeeping terms unknown"],
    price: ["CAT-P", "Standard-room examples/ranges; exact studio or suite not priced", null, "July18visibility; exact stay dates unknown", "Expedia/Hotels.com396-405including taxes/fees; Tripadvisor259-740before tax; displayed planning band mixes bases"], review: "CAT-R"
  },
  "Homewood Suites San Diego Downtown/Bayside": {
    room: ["HWS-1", { category: "All-suite, exact layout/bedding/occupancy unknown", kitchen: true, connecting: "Listed, guarantee unknown", crib: "Listed" }],
    fees: ["HWS-1", { self_parking: "Not available", valet_usd: 65, valet_basis: "In/out privileges", resort_fee_usd: null, tax_inclusion: null }],
    activities: ["HWS-1", "Free hot breakfast and outdoor pool listed; current hours/menu/pool operations unknown"],
    transport: ["HWS-1", "No airport shuttle listed; exact car-light/stroller routes and valet wait unknown"],
    price: ["HWS-P", "Lowest visible room example; exact suite configuration unknown", "Two adults", "One night; exact stay date unknown", "Around265including taxes/fees;65valet separate; selected suite and full family total unverified"], review: "HWS-R"
  },
  "LEGOLAND Hotel or Castle Hotel": {
    room: ["LEG-1", { category: "Two separate properties grouped for trip-style screen", maximum: "By exact room size, no universal capacity", kids_sleeping_area: true, pack_n_play: "By request" }],
    fees: ["LEG-2", { self_parking_usd: 40, valet_usd: 55, parking_basis: "Most reservations exclude parking; named exceptions require checking", tax_inclusion: null }],
    activities: ["LEG-1", "Hot breakfast, heated pool, theming, entertainment and treasure hunt listed; park/ticket/early-access terms unknown"],
    price: ["LEG-P", null, null, null, "Package/per-person starting language, not comparable per-room total; tickets/breakfast/parking need rate-specific comparison"], review: "LEG-R"
  },
  "Loews Coronado Bay Resort": {
    room: ["LOEWS-1", { category: null, maximum: null, unknowns: ["Exact family layout", "Connecting-room terms", "Selected-room occupancy"] }, "unknown"],
    fees: ["LOEWS-1", { resort_fee_usd: 42, resort_fee_tax: "Plus tax", self_parking_usd: null, self_parking_conflict: "FAQ50versus amenities47", valet_usd: 55 }, "disputed"],
    activities: ["LOEWS-1", "Three heated pools listed; kids-program operations and pool/water suitability unknown"],
    transport: ["LOEWS-1", "Complimentary Village shuttle without reservation and on-demand beach shuttle listed; hours/reliability/exact routes unknown"],
    price: ["LOEWS-P", "Lowest visible standard-room example; room/view configuration unknown", null, "July18visibility; exact stay dates unknown", "Expedia around360including taxes/fees; KAYAK235-303with fees; resort-fee and parking inclusion require checking"], review: "LOEWS-R"
  },
  "La Jolla Shores Hotel": {
    room: ["LJS-OFFICIAL-ROOMS", { category: "Two-queen rooms and selected suites", kitchen: "Room-specific kitchenette/full kitchen", maximum: null }],
    fees: ["LJS-OFFICIAL-FAQ,LJS-OFFICIAL-POLICY,LJS-OFFICIAL-ROOMS", { resort_fee_usd: 50, parking_usd: null, parking_conflict: "FAQ45versus accommodations/policy55", tax_inclusion: null }, "disputed"],
    activities: ["LJS-OFFICIAL-ROOMS,LJS-OFFICIAL-FAQ", "Refreshed heated outdoor pool and children's wading pool listed; current operations unknown"],
    price: ["LJS-PRICE-EXPEDIA", "Lowest visible standard-room example; exact kitchen/suite configuration unknown", "Two adults", "One night within next30days; exact stay date unknown", "406-447Expediaexamples include taxes/fees; broadened350-550+planning band not observed endpoints; parking separate"], review: "LJS-REVIEWS-EXPEDIA,LJS-REVIEWS-TRIPADVISOR"
  },
  "Hotel del Coronado": {
    room: ["DEL-OFFICIAL-FAQ,DEL-OFFICIAL-STAY,DEL-OFFICIAL-SHORE-HOUSE", { category: "Five different room neighborhoods; selected category unknown", kitchen: "Shore House villas, not every room", connecting: "Booking selection/request described; do not generalize to all units", crib_rollaway: "Cribs and selected rollaways", maximum: null }],
    fees: ["DEL-OFFICIAL-FAQ", { mandatory_charge_usd: 50, parking_usd: null, tax_inclusion: null }],
    activities: ["DEL-OFFICIAL-FAQ,DEL-OFFICIAL-STAY", "Heated pools and Ocean Explorers ages4-12listed; exact neighborhood access/schedule/conditions unknown"],
    price: ["DEL-PRICE-EXPEDIA", "Lowest visible standard-room example, not a Shore House villa or connecting pair quote", "Two adults", "One night within next30days; exact date unknown", "Around619including taxes/fees; widened600-900+planning band not observed endpoints; parking/inclusions require checking"], review: "DEL-REVIEWS-EXPEDIA,DEL-REVIEWS-TRIPADVISOR"
  },
  "The Dana on Mission Bay": {
    room: ["DANA-OFFICIAL-FAQ,DANA-OFFICIAL-ROOMS", { category: "Exact category must be selected", standard_room_maximum: 4, many_suite_maximum: 6, kitchen: "Refrigerator/microwave, no full kitchen", crib: "Free", rollaway: "Limited/request-based10USD", connecting: "Request-only, not guaranteed" }],
    fees: ["DANA-OFFICIAL-FAQ", { resort_fee_usd: 25, resort_fee_tax: "Plus tax", self_parking_usd: 35, parking_basis: "Per night, no valet" }, "known", "2026-09-27"],
    activities: ["DANA-OFFICIAL-FAQ,DANA-OFFICIAL-ROOMS", "Two heated pools listed; current activity calendar unknown"],
    price: ["DANA-PRICE-EXPEDIA", "Lowest visible standard-room example, not a six-person suite quote", "Two adults", "One night within next30days; exact date unknown", "Around326including taxes/fees plus other mid200examples;250-400+is a broadened planning band; parking/full family total unverified"], review: "DANA-REVIEWS-EXPEDIA,DANA-REVIEWS-BOOKING,DANA-REVIEWS-TRIPADVISOR"
  },
  "Manchester Grand Hyatt San Diego": {
    room: ["MGH-OFFICIAL-ROOMS,MGH-OFFICIAL-FAQ", { category: "Two-double connecting options/family suites; exact selection unknown", maximum: null, play_yard: "By request", refrigerator: true, microwave: "Specified suites", connecting: "Exact availability/guarantee unknown" }],
    fees: ["MGH-OFFICIAL-FAQ", { destination_charge: "Listed, amount not established in retained record", parking_usd: null, tax_inclusion: null }],
    activities: ["MGH-OFFICIAL-MAIN,MGH-OFFICIAL-RENOVATION", "August17record says only Coastline Pool operating; fourth-floor pool dueDecember2026not guaranteed; current status unknown"],
    price: ["MGH-PRICE-EXPEDIA", "Lowest visible standard-room example, not a family suite/connecting quote", "Two adults", "One night within next30days; exact date unknown", "329-340examples including taxes/fees;300-450+broadened planning band; mandatory charge/parking inclusion unverified"], review: "MGH-REVIEWS-EXPEDIA,MGH-REVIEWS-BOOKING,MGH-REVIEWS-TRIPADVISOR"
  }
};

export function normalizeSanDiegoHotel(hotel, retainedPrice, registry = sanDiegoSources()) {
  const rule = rules[hotel.name];
  if (!rule) throw new Error(`Unmapped San Diego identity: ${hotel.name}`);
  function source(id, evidenceClass) {
    const ref = registry[id];
    if (!ref?.urls.length) throw new Error(`Missing retained source: ${id}`);
    if (ref.evidence_class !== evidenceClass) throw new Error(`Source class mismatch: ${id}`);
    const expectedDate = evidenceClass === "OFFICIAL_PROPERTY_FACT" ? "2026-08-17" : ref.evidence_path === SAN_DIEGO_ADDITIONS ? "2026-07-21" : "2026-07-18";
    if (ref.checked_on !== expectedDate) throw new Error(`Retained source date changed; reconcile mapping before renewal: ${id}`);
    return ref;
  }
  function envelope(spec, evidenceClass = "OFFICIAL_PROPERTY_FACT") {
    const [names, value, state = "known", overrideDate] = spec;
    const refs = names.split(",").map((id) => {
      const ref = source(id, evidenceClass);
      return { id, evidence_class: ref.evidence_class, checked_on: overrideDate ?? ref.checked_on, evidence_path: overrideDate ? SAN_DIEGO_FEES : ref.evidence_path, urls: ref.urls };
    });
    return { value, state, evidence_class: evidenceClass, observed_on: refs.map((r) => r.checked_on).sort()[0],
      source_urls: [...new Set(refs.flatMap((r) => r.urls))], source_refs: refs,
      evidence_path: overrideDate ? SAN_DIEGO_FEES : refs[0].evidence_path, date_basis: "field-observation",
      limitation: "Normalized retained research, not a new source check. Partial room/policy facts and unknowns do not establish exact-party booking, safety or suitability." };
  }
  const [priceIds, room, party, stay, fees] = rule.price;
  const priceSources = priceIds.split(",").map((id) => source(id, "BOOKING_CHECK"));
  const path = priceSources[0].evidence_path;
  const reviewIds = rule.review.split(",");
  const reviewDate = reviewIds.map((id) => registry[id]?.checked_on).sort()[0];
  const fields = {
    room: envelope(rule.room), fees: envelope(rule.fees), activities: envelope(rule.activities),
    price: { ...retainedPrice, observed_on: priceSources.map((s) => s.checked_on).sort()[0], evidence_path: path,
      source_urls: [...new Set(priceSources.flatMap((s) => s.urls))],
      source_refs: priceSources.map((s) => ({ id: s.id, evidence_class: s.evidence_class, checked_on: s.checked_on, evidence_path: s.evidence_path, urls: s.urls })),
      value: { ...retainedPrice.value, room_basis: room, party_basis: party, stay_basis: stay, fee_basis: fees,
        source_basis: "Historical public examples plus editorially broadened planning band; not a family-room quote. Exact child ages/room/date/rate remain unverified.", structured_basis: Boolean(room && party && stay),
        basis_unknowns: ["Exact selected room category", "Exact family party and child ages", "Exact travel dates", "Rate-specific tax/fee inclusion"] },
      limitation: "Original displayed price retained. This mapping does not renew it, establish observed band endpoints, or price the hotel card's family-room category." },
    review_signal: envelope([rule.review, { summary: hotel.reviewSignal, sample_bucket: path === SAN_DIEGO_ADDITIONS ? "Small:5-12visible excerpts/snippets" : "Small directional sample; count not consistently established", sampled_on: reviewDate, representative: false, firsthand: false }, "known"], "REVIEW_SIGNAL"),
    transport: rule.transport ? envelope(rule.transport) : { value: null, state: "unknown", evidence_class: "EDITORIAL_INTERPRETATION", observed_on: null,
      source_urls: [], evidence_path: path, date_basis: "field-observation", limitation: "Transport not established in retained property research; no route/stroller assurance." }
  };
  if (hotel.name === "La Jolla Shores Hotel") fields.fees = currentLaJollaFees;
  if (hotel.name === "Loews Coronado Bay Resort") fields.fees = currentLoewsFees;
  return structuredClone(fields);
}
