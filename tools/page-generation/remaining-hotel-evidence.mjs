import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { parseNamedSourceList, parseRetainedTable, parsePropertyLedger } from "../legacy-hotel-sources.mjs";

const root = new URL("../../", import.meta.url);
const read = (path) => readFileSync(new URL(path, root), "utf8");
const dates = { "las-vegas": "2026-07-22", chicago: "2026-07-23", "new-york-city": "2026-07-25", "san-antonio": "2026-07-26" };
const vegasOverlay = "docs/research/las-vegas-five-plus-room-branch-validation-2026-09-16.md";
const poolOverlay = "docs/research/chicago-family-hotel-pool-fact-refresh-2026-09-14.md";
const antonioOverlay = "docs/research/san-antonio-family-hotel-official-fact-refresh-2026-09-05.md";
const noticeOverlay = "docs/research/hotel-notice-release-2026-09-22.md";
const wildOakOverlay = "docs/research/san-antonio-wild-oak-five-person-room-2026-09-30.md";
const sourceFingerprints = {
  "las-vegas": "26575920aed33fc7ce0189021a2c415301bb954b3c9243a65583289252012463",
  chicago: "ca238a0a02293b24fab0d5cfae070830858bcdffc9f7075e1674dfe640533e8e",
  "new-york-city": "daa82bc67a0678c7f4cd938b3aee07193f7b0d2cb9072585bcb467ca0fc0a418",
  "san-antonio": "759ca774ab31c116ce1d2e958b98eb860d710e63a18ce865a949c36c576b051d"
};
function validateSourceIdentity(research) {
  const fingerprint = createHash("sha256").update(JSON.stringify({ official: research.official, publicSources: research.publicSources })).digest("hex");
  if (research.date !== dates[research.city] || research.path !== `docs/research/${research.city}-family-hotel-evidence-pack.md` || fingerprint !== sourceFingerprints[research.city]) throw new Error("Retained source identity/date changed; reconcile mapping before renewal");
}

// Exact identity and source-register aliases. No fuzzy hotel or source matching.
// Columns: published name, official list label(s), price list label, price-row label.
const identities = {
  "las-vegas": [
    ["Mandalay Bay Resort and Casino", ["Mandalay Bay rooms and property facts"], "Mandalay Bay", "Mandalay Bay"],
    ["Four Seasons Hotel Las Vegas", ["Four Seasons family amenities"], "Four Seasons", "Four Seasons"],
    ["Vdara Hotel & Spa", ["Vdara hotel and Studio suite"], "Vdara", "Vdara"],
    ["Marriott's Grand Chateau", ["Marriott's Grand Chateau overview and rooms"], "Marriott's Grand Chateau", "Marriott's Grand Chateau"],
    ["Tahiti Village Resort", ["Tahiti Village suites and amenities"], "Tahiti Village", "Tahiti Village"],
    ["Hilton Vacation Club Cancun Resort Las Vegas", ["Hilton Vacation Club Cancun Resort"], "Hilton Vacation Club Cancun Resort", "Cancun Resort"],
    ["Excalibur Hotel & Casino", ["Excalibur rooms and current property fact sheet"], "Excalibur", "Excalibur"],
    ["New York-New York Hotel & Casino", ["New York-New York property, amenities, and current fact sheet"], "New York-New York", "New York-New York"],
    ["Las Vegas Hilton at Resorts World", ["Resorts World pools and Hilton rooms"], "Las Vegas Hilton at Resorts World", "Las Vegas Hilton at Resorts World"],
    ["Red Rock Casino Resort & Spa", ["Red Rock family activities, pool, and Kids Quest"], "Red Rock", "Red Rock"]
  ],
  chicago: [
    ["Embassy Suites by Hilton Chicago Downtown Magnificent Mile", ["Embassy Suites Magnificent Mile"], "Embassy Suites", "Embassy Suites Magnificent Mile"],
    ["Homewood Suites by Hilton Chicago-Downtown", ["Homewood Suites Chicago-Downtown"], "Homewood Suites", "Homewood Suites Chicago-Downtown"],
    ["Residence Inn Chicago Downtown/River North", ["Residence Inn River North overview, rooms, and dining"], "Residence Inn", "Residence Inn River North"],
    ["Sable at Navy Pier Chicago, Curio Collection by Hilton", ["Sable property and Hilton policy pages"], "Sable", "Sable at Navy Pier"],
    ["Swissotel Chicago", ["Swissotel Kids Suite offer and room"], "Swissotel", "Swissotel Chicago"],
    ["InterContinental Chicago Magnificent Mile", ["InterContinental rooms, amenities, dedicated pool page, and project notice"], "InterContinental", "InterContinental Magnificent Mile"],
    ["Hilton Chicago", ["Hilton Chicago rooms and amenities"], "Hilton Chicago", "Hilton Chicago"],
    ["Hotel Zachary Chicago, a Tribute Portfolio Hotel", ["Hotel Zachary rooms and current fact sheet"], "Hotel Zachary", "Hotel Zachary"],
    ["Four Seasons Hotel Chicago", ["Four Seasons family article and hotel facts"], "Four Seasons", "Four Seasons Chicago"],
    ["The Langham, Chicago", ["The Langham pool, current Kids Suite, older hotel overview, and child policy"], "The Langham", "The Langham Chicago"]
  ],
  "new-york-city": [
    ["Hotel Beacon", ["Hotel Beacon rooms"], "Hotel Beacon"],
    ["Homewood Suites by Hilton New York/Midtown Manhattan Times Square-South", ["Homewood Suites Midtown Manhattan Times Square-South"], "Homewood Suites"],
    ["Residence Inn by Marriott New York Manhattan/Central Park", ["Residence Inn Manhattan/Central Park overview and rooms"], "Residence Inn Central Park"],
    ["Radio City Apartments", ["Radio City Apartments home and two-bedroom layout"], "Radio City Apartments"],
    ["Embassy Suites by Hilton New York Manhattan Times Square", ["Embassy Suites Manhattan Times Square"], "Embassy Suites"],
    ["TRYP by Wyndham New York City Times Square / Midtown", ["TRYP Times Square/Midtown"], "TRYP"],
    ["The Kimberly Hotel", ["The Kimberly accommodations"], "The Kimberly"],
    ["New York Marriott Marquis", ["New York Marriott Marquis rooms and family connectors"], "New York Marriott Marquis"],
    ["Conrad New York Downtown", ["Conrad New York Downtown overview and suites"], "Conrad New York Downtown"],
    ["Lotte New York Palace", ["Lotte New York Palace suites and FAQ"], "Lotte New York Palace"],
    ["1 Hotel Brooklyn Bridge", ["1 Hotel Brooklyn Bridge rooms, two-bed room, and FAQ"], "1 Hotel Brooklyn Bridge"],
    ["Four Seasons Hotel New York Downtown", ["Four Seasons New York Downtown accommodations"], "Four Seasons New York Downtown"]
  ],
  "san-antonio": [
    ["Hyatt Regency Hill Country Resort and Villas", ["Hyatt Regency Hill Country", "Hyatt Regency Hill Country rooms", "Hyatt Regency Hill Country Big Spring lagoon", "Hyatt Regency Hill Country policies"], "Hyatt Hill Country Expedia", "Hyatt Hill Country Booking.com reviews"],
    ["JW Marriott San Antonio Hill Country Resort and Spa", ["JW Marriott overview", "JW Marriott experiences", "JW Marriott rooms"], "JW Marriott Expedia"],
    ["Signia by Hilton La Cantera Resort and Spa", ["Signia by Hilton La Cantera overview", "Signia by Hilton La Cantera resort amenities", "Signia by Hilton La Cantera things to do", "Signia by Hilton La Cantera location"], "La Cantera Expedia"],
    ["Hyatt Vacation Club at Wild Oak Ranch", ["Wild Oak Ranch overview", "Wild Oak Ranch rooms"], "Wild Oak Ranch Expedia", "Wild Oak Ranch Booking.com reviews"],
    ["Embassy Suites by Hilton San Antonio Riverwalk Downtown", ["Embassy Suites Riverwalk Downtown"], "Embassy Suites Expedia"],
    ["Homewood Suites by Hilton San Antonio-Riverwalk/Downtown", ["Homewood Suites Riverwalk/Downtown"], "Homewood Suites Expedia"],
    ["Home2 Suites by Hilton San Antonio Riverwalk", ["Home2 Suites San Antonio Riverwalk"], "Home2 Suites Expedia price/property page", "Home2 Suites Booking.com reviews"],
    ["Drury Plaza Hotel San Antonio Riverwalk", ["Drury Plaza Riverwalk"], "Drury Plaza Expedia", "Drury Plaza Booking.com reviews"],
    ["Hotel Contessa", ["Hotel Contessa amenities", "Hotel Contessa FAQ"], "Hotel Contessa Expedia", "Hotel Contessa Booking.com reviews"],
    ["Hyatt Regency San Antonio Riverwalk", ["Hyatt Regency Riverwalk", "Hyatt Regency Riverwalk rooms", "Hyatt Regency Riverwalk FAQ"], "Hyatt Regency Riverwalk Expedia price/property page", "Hyatt Regency Riverwalk Booking.com reviews"],
    ["San Antonio Marriott Rivercenter on the River Walk", ["Marriott Rivercenter overview", "Marriott Rivercenter rooms", "Marriott Rivercenter experiences"], "Marriott Rivercenter Expedia"],
    ["Omni La Mansion del Rio", ["Omni La Mansion del Rio", "Omni accommodations", "Omni pool"], "Omni La Mansion Expedia price/property page", "Omni La Mansion Booking.com reviews"]
  ]
};

export function remainingCityResearch(city, markdown = read(`docs/research/${city}-family-hotel-evidence-pack.md`)) {
  const date = dates[city];
  if (!date || !markdown.includes(date)) throw new Error(`Missing retained baseline date: ${city}`);
  const initialLabel = city === "las-vegas" ? "Checked" : city === "chicago" ? "Initial full check" : "Prepared";
  if (!markdown.includes(`${initialLabel}: ${date}\n`)) throw new Error(`Retained baseline date changed: ${city}`);
  const antonio = city === "san-antonio";
  const official = parseNamedSourceList(markdown, antonio ? "### Official property sources\n" : "Official property sources:\n", antonio ? "### Public price and review pages\n" : city === "new-york-city" ? "Public price and review sources:\n" : "Price and review sources:\n");
  const publicSources = parseNamedSourceList(markdown, antonio ? "### Public price and review pages\n" : city === "new-york-city" ? "Public price and review sources:\n" : "Price and review sources:\n", antonio ? "### Cluster and measurement sources\n" : city === "new-york-city" ? "Qualitative context:\n" : city === "chicago" ? "Competitor and qualitative context:\n" : "Competitor/SERP context:\n");
  const ledger = ["new-york-city", "san-antonio"].includes(city) ? parsePropertyLedger(markdown) : null;
  return { city, date, path: `docs/research/${city}-family-hotel-evidence-pack.md`, official, publicSources, ledger,
    prices: ledger ? null : parseRetainedTable(markdown, "## Price Evidence", 3),
    samples: city === "chicago" ? parseRetainedTable(markdown, "## Review Observation Ledger", 4) : null };
}

function reference(id, evidenceClass, checkedOn, evidencePath, urls) {
  if (!urls.length) throw new Error(`No sources for ${id}`);
  return { id, evidence_class: evidenceClass, checked_on: checkedOn, evidence_path: evidencePath, urls: [...new Set(urls)] };
}
function envelope(value, refs, state = "known", evidenceClass = "EDITORIAL_INTERPRETATION") {
  return { value, state, evidence_class: evidenceClass, observed_on: refs.map((r) => r.checked_on).sort()[0], source_urls: [...new Set(refs.flatMap((r) => r.urls))], source_refs: refs,
    evidence_path: refs[0].evidence_path, date_basis: "field-observation",
    limitation: "Retained researched interpretation; grouped date is the oldest supporting observation, not new verification or a date for every subclaim. Exact room, inventory, operations, route and suitability remain checks." };
}
function overlay(id, path, date, urls) {
  const markdown = read(path);
  if (!markdown.includes(date) && !markdown.includes(date.replaceAll("-", ""))) {
    // Some retained narrative records spell the source date in prose instead.
    const prose = { "2026-09-16": "September 16, 2026", "2026-09-22": "September 22, 2026", "2026-09-30": "September 30, 2026" }[date];
    if (!prose || !markdown.includes(prose)) throw new Error(`Overlay date changed: ${id}`);
  }
  for (const url of urls) if (!markdown.includes(url)) throw new Error(`Overlay source changed: ${id}`);
  return reference(id, "OFFICIAL_PROPERTY_FACT", date, path, urls);
}

export function normalizeRemainingHotel(hotel, retainedFields, research) {
  validateSourceIdentity(research);
  const { city, date, path, official, publicSources, ledger, prices, samples } = research;
  const row = identities[city]?.find((r) => r[0] === hotel.name);
  if (!row) throw new Error(`Unmapped retained hotel: ${city}/${hotel.name}`);
  const index = identities[city].indexOf(row) + 1;
  const id = `${city.toUpperCase()}-${index}`;
  const pick = (source, name) => { if (!source[name]?.length) throw new Error(`Missing exact retained source: ${city}/${name}`); return source[name]; };
  const officialUrls = row[1].flatMap((name) => pick(official, name));
  const priceUrls = pick(publicSources, row[2]).filter((url) => ["www.expedia.com", "www.hotels.com", "www.booking.com"].includes(new URL(url).hostname) && !new URL(url).pathname.includes("/reviews/"));
  if (city === "las-vegas" && index === 9) priceUrls.push(...officialUrls.filter((url) => new URL(url).hostname === "www.hilton.com"));
  const reviewUrls = pick(publicSources, city === "san-antonio" ? row[3] || row[2] : row[2]).filter((url) => !new URL(url).hostname.includes("reddit.com"));
  const officialRef = reference(`${id}-OFFICIAL`, "OFFICIAL_PROPERTY_FACT", city === "san-antonio" && index === 3 ? "2026-09-05" : date, path,
    city === "chicago" && index === 6 ? officialUrls.filter((url) => !url.endsWith("/amenities/pool") && !url.endsWith("/amenities/special-activations")) : officialUrls);
  const priceRef = reference(`${id}-PRICE`, "BOOKING_CHECK", date, path, priceUrls);
  const reviewRef = reference(`${id}-REVIEW`, "REVIEW_SIGNAL", date, path, reviewUrls);
  const roomRefs = [officialRef], activityRefs = [officialRef, reviewRef];
  const room = { retained_setup: hotel.familySetup, retained_baseline_on: date, checks: hotel.parentCheck, overlays: [] };
  const activities = { retained_strengths: hotel.strengths ?? null, retained_tradeoffs: hotel.tradeoffs ?? null, overlays: [] };
  let roomState = "known", activityState = "known";
  if (city === "chicago" && index === 6) {
    const ref = overlay(`${id}-LATER-POOL-SOURCES`, poolOverlay, "2026-09-14", officialUrls.filter((url) => url.endsWith("/amenities/pool") || url.endsWith("/amenities/special-activations")));
    roomRefs.push(ref); activityRefs.push(ref);
  }
  if (city === "san-antonio") {
    const ref = overlay(`${id}-REFRESH`, antonioOverlay, "2026-09-05", officialUrls.filter((url) => read(antonioOverlay).includes(url)));
    roomRefs.push(ref); activityRefs.push(ref);
    room.overlays.push({ observed_on: ref.checked_on, source_id: ref.id, record: "Visible role/room-function/pool claims rechecked, not every category or original room inventory. Original broader facts retain July provenance." });
    activities.overlays.push({ observed_on: ref.checked_on, source_id: ref.id, record: "Official pool/meal/role refresh; published policies are not observed operations or admission." });
  }
  if (hotel.roomCapacity) {
    const ref = overlay(`${id}-CAPACITY`, vegasOverlay, "2026-09-16", [hotel.roomCapacity.source]);
    roomRefs.push(ref); room.overlays.push({ observed_on: ref.checked_on, source_id: ref.id, record: structuredClone(hotel.roomCapacity) });
  }
  if (city === "chicago" && [1, 2, 6, 7, 9, 10].includes(index)) {
    const poolUrls = { 1: ["https://www.hilton.com/en/hotels/chirees-embassy-suites-chicago-downtown-magnificent-mile/hotel-info/"], 2: ["https://www.hilton.com/en/hotels/chihwhw-homewood-suites-chicago-downtown/hotel-info/"], 6: officialUrls.filter((url) => url.includes("/amenities")), 7: ["https://www.hilton.com/en/hotels/chichhh-hilton-chicago/amenities/"], 9: ["https://press.fourseasons.com/chicago/hotel-facts/"], 10: ["https://www.langhamhotels.com/en/the-langham/chicago/wellness/swimming-pool/"] }[index];
    const ref = overlay(`${id}-POOL`, poolOverlay, "2026-09-14", poolUrls);
    activityRefs.push(ref); activities.overlays.push({ observed_on: ref.checked_on, source_id: ref.id, record: "Official pool listing spot-check only; no room, price, review or actual operating-state renewal." });
  }
  if ((city === "chicago" && index === 6) || (city === "san-antonio" && index === 2)) {
    const noticeUrls = city === "chicago" ? officialUrls.filter((url) => url.includes("/amenities")) : hotel.operationalSources.map((entry) => entry[1]);
    const ref = overlay(`${id}-NOTICE`, noticeOverlay, "2026-09-22", noticeUrls);
    if (city === "chicago") { roomRefs.push(ref); activityRefs.push(ref); activityState = "disputed"; const record = { observed_on: ref.checked_on, source_id: ref.id, record: "Elapsed yearless project schedule; completion/current access unknown; 5am versus 7am published-hours conflict remains." }; room.overlays.push(record); activities.overlays.push(record); }
    else { roomRefs.push(ref); room.overlays.push({ observed_on: ref.checked_on, source_id: ref.id, record: hotel.operationalNotice }); }
  }
  if (city === "san-antonio" && index === 4) {
    const ref = overlay(`${id}-CAPACITY`, wildOakOverlay, "2026-09-30", ["https://www.hyattvacationclub.com/resorts/wild-oak-ranch"]);
    roomRefs.push(ref); room.overlays.push({ observed_on: ref.checked_on, source_id: ref.id, record: "Studio/one-bedroom maximum4; two-bedroom maximum8/six adults. Five-person conditional starting category, not available inventory, water admission or a price." });
  }
  if (city === "las-vegas" && index === 6) { roomState = "disputed"; roomRefs.push(priceRef); }
  if (city === "new-york-city" && [4, 5, 6].includes(index)) {
    roomRefs.push(priceRef);
    if (index === 5) roomState = "disputed";
    if (index === 4 || index === 6) roomRefs.push(reference(`${id}-ROOM-INVENTORY`, "BOOKING_CHECK", date, path, pick(publicSources, index === 4 ? "Radio City Apartments room cross-check" : "TRYP family-room cross-check")));
  }
  if (city === "new-york-city" && index === 3) { roomState = "disputed"; roomRefs.push(reviewRef); }
  if (city === "san-antonio" && index === 7) roomRefs.push(reviewRef);
  if ((city === "chicago" && index === 10) || (city === "san-antonio" && [7, 11].includes(index))) activityState = "disputed";
  const priceBasis = ledger ? ledger[hotel.name]?.["Public price basis"] : prices[row[3]]?.[0];
  const band = ledger ? ledger[hotel.name]?.["Page range"] : prices[row[3]]?.[1];
  if (!priceBasis || !band?.includes(retainedFields.price.value.display)) throw new Error(`Retained price identity/display changed: ${hotel.name}`);
  const sample = ledger ? ledger[hotel.name]?.["Review sample"] : city === "chicago" ? samples[row[3]]?.[0] : [6, 8, 10].includes(index) ? "Thin: roughly2-4visible recent entries/snippets" : "Small: roughly3-10visible recent entries/snippets";
  if (!sample) throw new Error(`Missing retained review sample: ${hotel.name}`);
  const result = { ...retainedFields, room: envelope(room, roomRefs, roomState), activities: envelope(activities, activityRefs, activityState),
    review_signal: envelope({ summary: hotel.reviewSignal, sample_bucket: sample, sampled_on: date, representative: false, firsthand: false, family_context: ledger?.[hotel.name]?.["Family context"] ?? (city === "chicago" ? samples[row[3]][1] : "Family-tagged where visible; no representative family-only sample") }, [reviewRef], "known", "REVIEW_SIGNAL"),
    price: { ...envelope({ ...retainedFields.price.value, room_basis: null, party_basis: city === "new-york-city" ? "Two adults in the public low example; not exact family party" : null, stay_basis: priceBasis,
      fee_basis: `${retainedFields.price.value.fee_basis} Historical examples mix total and pre-tax amounts where recorded; exact rate-specific inclusion unverified.`, source_basis: `${priceBasis} ${band} Editorially widened band; high endpoint not necessarily observed.`, structured_basis: false,
      basis_unknowns: ["Exact selected family room and room count", "Exact family party and child ages", "Comparable arrival/departure dates and rate plan", "Rate-specific tax/mandatory-fee inclusion and full stay total"] }, [priceRef]), limitation: "Historical price displays and observation dates preserved. Public low examples are not prices for the room/card/overlay or exact family. Reconciliation, not collection time, can renew them." }
  };
  if (city === "san-antonio" && index === 3) {
    result.room.date_basis = "model-baseline";
    result.room.limitation += " Current Hilton source URLs were observed September5, not July26. Retained July interpretation is separate; atomic claim dates remain a mapping gap.";
  }
  if (city === "chicago" && index === 3) {
    result.price.state = "unmapped";
    result.price.value.mapping_gaps = ["Community-reported382USD example lacks an independently matched thread/source; not verified booking evidence."];
  }
  if (city === "new-york-city" && index === 6) {
    const priceValue = result.price.value;
    result.price = { ...result.price, ...envelope(priceValue, [priceRef, reviewRef]), limitation: result.price.limitation + " The654USD family amount is review-reported, not an observed comparable booking quote." };
  }
  if (city === "new-york-city" && index === 12) {
    result.review_signal.state = "unmapped";
    result.review_signal.value.mapping_gaps = ["Community lap-pool/spa interpretation is retained context with incomplete independent source mapping; Expedia supports guest-review themes only."];
  }
  if ((city === "las-vegas" && index === 4) || (city === "new-york-city" && index === 1)) result.fees = envelope({ resort_fee_usd: 0, parking_usd: null, tax_inclusion: null, checks: "No resort/facility fee in retained official record; parking and exact-rate total remain unknown." }, [officialRef], "known", "OFFICIAL_PROPERTY_FACT");
  return structuredClone(result);
}
