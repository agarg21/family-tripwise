import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { parseNamedSourceList, parseRetainedTable, parsePropertyLedger } from "./legacy-hotel-sources.mjs";
import { remainingCityResearch, normalizeRemainingHotel } from "./page-generation/remaining-hotel-evidence.mjs";
import { hotelEvidence, validateHotelEvidence } from "./hotel-evidence.mjs";
import { createFamilyHotelPages } from "./page-generation/family-hotel-pages.mjs";

const dates = { "las-vegas": "2026-07-22", chicago: "2026-07-23", "new-york-city": "2026-07-25", "san-antonio": "2026-07-26" };
const records = () => hotelEvidence().filter((r) => Object.keys(dates).some((city) => r.id.startsWith(city + "-")));
const find = (hotel) => records().find((r) => r.hotel === hotel);

test("named lists, tables and ledgers reject malformed, duplicate and private evidence", () => {
  const list = "Sources:\n- Hotel: https://example.com/\nEnd:\n";
  assert.deepEqual(parseNamedSourceList(list, "Sources:\n", "End:\n"), { Hotel: ["https://example.com/"] });
  for (const source of [list.replace("https://example.com/", "https://example.com/#token=x"), list.replace("End:", "- Hotel: https://example.com/\nEnd:"), list.replace("Hotel:", "Hotel"), list.replace("End:", "No boundary:")]) assert.throws(() => parseNamedSourceList(source, "Sources:\n", "End:\n"));
  const table = "## Price Evidence\n| Hotel | Basis | Range |\n|---|---|---|\n| Test | Dated | $10-$20 |\n";
  assert.deepEqual(parseRetainedTable(table, "## Price Evidence", 3), { Test: ["Dated", "$10-$20"] });
  for (const source of [table + "| Test | Dated | $10-$20 |\n", table.replace("Dated |", "Dated | extra |"), table.replace("Dated", "")]) assert.throws(() => parseRetainedTable(source, "## Price Evidence", 3));
  const ledger = "## Selected Property Evidence\n\n### Test\n- Official facts: Room\n- Public price basis: Dated\n- Page range: $10-$20\n- Review sample: Small\n";
  assert.equal(parsePropertyLedger(ledger).Test["Review sample"], "Small");
  assert.throws(() => parsePropertyLedger(ledger + "- Page range: $20-$30\n"));
  assert.throws(() => parsePropertyLedger(ledger.replace("- Review sample: Small\n", "")));
});

test("all 44 remaining hotels retain prices and independent July price/review dates", () => {
  const result = records();
  assert.equal(result.length, 44);
  assert.deepEqual(validateHotelEvidence(result), []);
  assert.equal(result.flatMap((r) => Object.values(r.fields)).filter((f) => f.source_refs?.length).length, 178);
  const catalog = createFamilyHotelPages({}).hotelCatalog;
  for (const [city, date] of Object.entries(dates)) for (const hotel of catalog[city]) {
    const r = result.find((row) => row.hotel === hotel.name && row.page_url.includes(`/${city}-`));
    assert.equal(r.fields.price.value.display, hotel.priceRange);
    assert.equal(r.fields.price.observed_on, date);
    assert.equal(r.fields.review_signal.observed_on, date);
    assert.equal(r.fields.room.observed_on, city === "san-antonio" && hotel.name === "Signia by Hilton La Cantera Resort and Spa" ? "2026-09-05" : date);
    assert.equal(r.fields.price.value.amount_from, null);
    assert.equal(r.fields.price.value.amount_to, null);
    assert.equal(r.fields.price.value.structured_basis, false);
    assert.equal(r.fields.price.value.basis_unknowns.length, 4);
    assert.equal(r.fields.price.evidence_class, "EDITORIAL_INTERPRETATION");
    assert.equal(r.fields.room.evidence_class, "EDITORIAL_INTERPRETATION");
    assert.equal(r.fields.room.value.retained_setup, hotel.familySetup);
    assert.equal(r.fields.transport.state, "unknown");
    assert.equal(r.fields.transport.observed_on, null);
    assert.equal(r.fields.review_signal.value.representative, false);
    assert.equal(r.fields.review_signal.value.firsthand, false);
    assert.ok(Object.values(r.fields).flatMap((f) => f.source_urls).every((u) => !u.includes("reddit.com")));
  }
});

test("narrow newer overlays retain independent provenance without renewing broader facts", () => {
  const chateau = find("Marriott's Grand Chateau");
  assert.equal(chateau.fields.room.value.overlays[0].observed_on, "2026-09-16");
  assert.equal(chateau.fields.room.value.overlays[0].record.capacity, "up to eight guests");
  const jw = find("JW Marriott San Antonio Hill Country Resort and Spa");
  assert.deepEqual(jw.fields.room.value.overlays.map((o) => o.observed_on), ["2026-09-05", "2026-09-22"]);
  assert.ok(jw.fields.room.source_refs.some((r) => r.urls.some((u) => u.includes("enhancements"))));
  const wild = find("Hyatt Vacation Club at Wild Oak Ranch");
  assert.equal(wild.fields.room.value.overlays.at(-1).observed_on, "2026-09-30");
  assert.ok(wild.fields.room.value.overlays.at(-1).record.includes("maximum8/six adults"));
  const ihg = find("InterContinental Chicago Magnificent Mile");
  assert.deepEqual(ihg.fields.activities.value.overlays.map((o) => o.observed_on), ["2026-09-14", "2026-09-22"]);
  assert.ok(ihg.fields.room.source_refs.some((r) => r.checked_on === "2026-09-22"));
  assert.equal(ihg.fields.room.observed_on, "2026-07-23");
  assert.equal(ihg.fields.price.observed_on, "2026-07-23");
});

test("source conflicts, mixed-source occupancy and unknown fees remain explicit", () => {
  for (const hotel of ["Hilton Vacation Club Cancun Resort Las Vegas", "Embassy Suites by Hilton New York Manhattan Times Square"]) {
    const r = find(hotel); assert.equal(r.fields.room.state, "disputed");
    assert.ok(r.fields.room.source_refs.some((ref) => ref.evidence_class === "BOOKING_CHECK"));
  }
  for (const hotel of ["InterContinental Chicago Magnificent Mile", "The Langham, Chicago", "Home2 Suites by Hilton San Antonio Riverwalk", "San Antonio Marriott Rivercenter on the River Walk"]) assert.equal(find(hotel).fields.activities.state, "disputed");
  for (const hotel of ["Radio City Apartments", "TRYP by Wyndham New York City Times Square / Midtown"]) assert.ok(find(hotel).fields.room.source_refs.some((ref) => ref.id.endsWith("ROOM-INVENTORY") && ref.evidence_class === "BOOKING_CHECK"));
  for (const hotel of ["Marriott's Grand Chateau", "Hotel Beacon"]) {
    assert.equal(find(hotel).fields.fees.value.resort_fee_usd, 0);
    assert.equal(find(hotel).fields.fees.value.parking_usd, null);
  }
  assert.equal(records().filter((r) => r.fields.fees.state === "unknown").length, 42);
  const residence = find("Residence Inn by Marriott New York Manhattan/Central Park");
  assert.equal(residence.fields.room.state, "disputed");
  assert.ok(residence.fields.room.source_refs.some((r) => r.evidence_class === "REVIEW_SIGNAL"));
});

test("bounded review ledgers and price distinctions are retained, not generalized", () => {
  assert.ok(find("Embassy Suites by Hilton Chicago Downtown Magnificent Mile").fields.review_signal.value.sample_bucket.includes("12 verified Expedia entries"));
  assert.ok(find("Residence Inn Chicago Downtown/River North").fields.review_signal.value.family_context.includes("Mixed"));
  assert.ok(find("Hilton Vacation Club Cancun Resort Las Vegas").fields.review_signal.value.sample_bucket.includes("Thin"));
  assert.ok(find("Hyatt Vacation Club at Wild Oak Ranch").fields.price.value.source_basis.includes("before taxes"));
  assert.ok(find("Vdara Hotel & Spa").fields.price.value.source_basis.includes("private-inventory"));
  assert.ok(find("TRYP by Wyndham New York City Times Square / Midtown").fields.price.value.source_basis.includes("verified family review"));
  assert.ok(find("Four Seasons Hotel New York Downtown").fields.price.value.party_basis.includes("Two adults"));
});

test("changed dates, source identities, hotel identities and price displays fail closed", () => {
  const city = "new-york-city";
  const path = new URL(`../docs/research/${city}-family-hotel-evidence-pack.md`, import.meta.url);
  const markdown = readFileSync(path, "utf8");
  assert.throws(() => remainingCityResearch(city, markdown.replace("Prepared: 2026-07-25", "Prepared: 2026-09-30")), /date changed/);
  const research = remainingCityResearch(city);
  const hotel = createFamilyHotelPages({}).hotelCatalog[city][0];
  assert.throws(() => normalizeRemainingHotel({ ...hotel, name: "Wrong hotel" }, find(hotel.name).fields, research), /Unmapped/);
  const missing = structuredClone(research); delete missing.official["Hotel Beacon rooms"];
  assert.throws(() => normalizeRemainingHotel(hotel, find(hotel.name).fields, missing), /source identity/);
  const changed = structuredClone(find(hotel.name).fields); changed.price.value.display = "$1-$2";
  assert.throws(() => normalizeRemainingHotel(hotel, changed, research), /price identity/);
});

test("later sources keep actual dates and wrong-property source changes cannot serialize", () => {
  const signia = find("Signia by Hilton La Cantera Resort and Spa");
  assert.ok(signia.fields.room.source_refs.every((ref) => ref.checked_on === "2026-09-05"));
  assert.equal(signia.fields.room.value.retained_baseline_on, "2026-07-26");
  assert.equal(signia.fields.room.date_basis, "model-baseline");
  const ihg = find("InterContinental Chicago Magnificent Mile");
  for (const ref of ihg.fields.room.source_refs) if (ref.urls.some((url) => url.endsWith("/amenities/pool") || url.endsWith("/amenities/special-activations"))) assert.notEqual(ref.checked_on, "2026-07-23");
  const hotel = createFamilyHotelPages({}).hotelCatalog["new-york-city"][0];
  const research = remainingCityResearch("new-york-city");
  research.official["Hotel Beacon rooms"] = ["https://www.kimberlyhotel.com/accommodations/"];
  assert.throws(() => normalizeRemainingHotel(hotel, find(hotel.name).fields, research), /source identity/);
  const alteredPrice = remainingCityResearch("new-york-city");
  alteredPrice.publicSources["Hotel Beacon"] = alteredPrice.publicSources["The Kimberly"];
  assert.throws(() => normalizeRemainingHotel(hotel, find(hotel.name).fields, alteredPrice), /source identity/);
});

test("mixed community and review components remain separately referenced or unmapped", () => {
  const chicago = find("Residence Inn Chicago Downtown/River North").fields.price;
  assert.equal(chicago.state, "unmapped");
  assert.ok(chicago.value.mapping_gaps[0].includes("Community"));
  const tryp = find("TRYP by Wyndham New York City Times Square / Midtown").fields.price;
  assert.deepEqual(tryp.source_refs.map((ref) => ref.evidence_class), ["BOOKING_CHECK", "REVIEW_SIGNAL"]);
  assert.ok(tryp.limitation.includes("review-reported"));
  const fourSeasons = find("Four Seasons Hotel New York Downtown").fields.review_signal;
  assert.equal(fourSeasons.state, "unmapped");
  assert.ok(fourSeasons.value.mapping_gaps[0].includes("Community"));
});

test("prior dated reports remain historical baselines", () => {
  const sd = JSON.parse(readFileSync(new URL("../ops/page-quality/2026-09-30-san-diego.json", import.meta.url)));
  assert.equal(sd.summary.source_mapped_fields, 62);
  assert.equal(sd.summary.conflicts, 6);
  assert.equal(sd.summary.unstructured_price_basis, 54);
});
