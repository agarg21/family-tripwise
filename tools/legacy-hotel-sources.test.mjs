import test from "node:test";
import assert from "node:assert/strict";
import { parseSourceTable, parseAddedSourceList, sanDiegoSources, SAN_DIEGO_FEES } from "./legacy-hotel-sources.mjs";
import { normalizeSanDiegoHotel } from "./page-generation/san-diego-hotel-evidence.mjs";
import { hotelEvidence, validateHotelEvidence } from "./hotel-evidence.mjs";
import { readFileSync } from "node:fs";

test("retained registry formats preserve classes/dates and shared URL aliases", () => {
  const sources = sanDiegoSources();
  assert.equal(sources["BAH-2"].checked_on, "2026-08-17");
  assert.equal(sources["BAH-P"].checked_on, "2026-07-18");
  assert.equal(sources["BAH-R"].evidence_class, "REVIEW_SIGNAL");
  assert.equal(sources["DANA-PRICE-EXPEDIA"].checked_on, "2026-07-21");
  assert.equal(sources["DANA-REVIEWS-EXPEDIA"].evidence_class, "REVIEW_SIGNAL");
  assert.deepEqual(sources["DANA-PRICE-EXPEDIA"].urls, sources["DANA-REVIEWS-EXPEDIA"].urls);
  assert.equal(sources["COM-1"].urls.length, 0);
});

test("malformed, duplicate, undated or private registers fail closed", () => {
  const row = "| A-1 | `official fact` | https://a.test/ | 2026-08-17 | Room |";
  const wrap = (s) => `## Source Register\n${s}`;
  for (const content of [row + "\n" + row, row.replace("2026-08-17", "2026-02-30"), row.replace("official fact", "live quote"), row.replace("https://a.test/", "https://a.test/#access_token=x"), row + "bad|cells|"]) assert.throws(() => parseSourceTable(wrap(content), "docs/research/test.md"));
  assert.throws(() => parseSourceTable("No register", "docs/research/test.md"));
  const list = "### Added hotel sources\n- `A-PRICE-EXAMPLE` / `A-REVIEWS-EXAMPLE` - https://a.test/";
  const refs = parseAddedSourceList(list, "docs/research/test.md", { price: "2026-07-21", review: "2026-07-21" });
  assert.equal(Object.keys(refs).length, 2);
  assert.throws(() => parseAddedSourceList(list + "\n- `A-PRICE-EXAMPLE` - https://a.test/", "docs/research/test.md", { price: "2026-07-21", review: "2026-07-21" }));
});

test("twelve hotels gain 62 source-linked fields without renewing the price/room research", () => {
  const records = hotelEvidence().filter((r) => r.id.startsWith("san-diego-"));
  assert.equal(records.length, 12);
  assert.deepEqual(validateHotelEvidence(records), []);
  assert.equal(records.flatMap((r) => Object.values(r.fields)).filter((f) => f.source_refs?.length).length, 62);
  records.forEach((r, i) => {
    assert.equal(r.fields.room.observed_on, "2026-08-17");
    assert.equal(r.fields.activities.observed_on, "2026-08-17");
    assert.equal(r.fields.price.observed_on, i < 8 ? "2026-07-18" : "2026-07-21");
    assert.equal(r.fields.review_signal.observed_on, i < 8 ? "2026-07-18" : "2026-07-21");
    assert.equal(r.fields.review_signal.value.representative, false);
    assert.equal(r.fields.price.evidence_class, "EDITORIAL_INTERPRETATION");
    assert.equal(r.fields.price.value.basis_unknowns.length, 4);
    assert.equal(r.fields.price.value.amount_from, null);
  });
});

test("narrow September fee checks and unresolved bedding/parking conflicts stay separate", () => {
  const records = hotelEvidence().filter((r) => r.id.startsWith("san-diego-"));
  const find = (hotel) => records.find((r) => r.hotel === hotel);
  for (const hotel of ["Bahia Resort Hotel", "Catamaran Resort Hotel and Spa"]) {
    const r = find(hotel);
    assert.equal(r.fields.fees.observed_on, "2026-09-27");
    assert.equal(r.fields.fees.evidence_path, SAN_DIEGO_FEES);
    assert.equal(r.fields.room.observed_on, "2026-08-17");
    assert.notEqual(r.fields.price.observed_on, "2026-09-27");
  }
  assert.equal(find("Bahia Resort Hotel").fields.room.state, "disputed");
  const dana = find("The Dana on Mission Bay");
  assert.equal(dana.fields.fees.observed_on, "2026-10-08");
  assert.equal(dana.fields.fees.evidence_path, "docs/research/dana-fee-hold-2026-10-08.json");
  assert.equal(dana.fields.fees.value.incidental_authorization.payable_fee, false);
  assert.equal(dana.fields.room.observed_on, "2026-08-17");
  assert.equal(dana.fields.price.observed_on, "2026-07-21");
  assert.equal(find("Loews Coronado Bay Resort").fields.fees.state, "known");
  assert.equal(find("Loews Coronado Bay Resort").fields.fees.observed_on, "2026-10-06");
  assert.equal(find("Loews Coronado Bay Resort").fields.fees.value.self_parking_usd, 50);
  assert.equal(find("La Jolla Shores Hotel").fields.fees.state, "known");
  assert.equal(find("La Jolla Shores Hotel").fields.fees.observed_on, "2026-10-05");
  assert.equal(find("La Jolla Shores Hotel").fields.fees.value.parking_usd, 55);
  assert.equal(find("Hyatt Regency Mission Bay Spa and Marina").fields.fees.value.parking_usd, null);
  assert.equal(find("LEGOLAND Hotel or Castle Hotel").fields.price.value.display, "Package-priced");
  assert.equal(find("LEGOLAND Hotel or Castle Hotel").fields.price.value.structured_basis, false);
});

test("source reference drift and incomplete provenance fail contract validation", () => {
  const source = hotelEvidence().find((r) => r.id === "san-diego-bahia-resort-hotel");
  for (const mutate of [(r) => { r.fields.room.source_refs[0].checked_on = "2026-02-30"; }, (r) => { r.fields.room.observed_on = "2026-09-30"; }, (r) => { r.fields.room.source_urls.push("https://a.test/"); }, (r) => { r.fields.room.source_refs[0].urls = ["https://a.test/#token=x"]; }]) {
    const r = structuredClone(source); mutate(r); assert.ok(validateHotelEvidence([r]).length);
  }
  assert.throws(() => normalizeSanDiegoHotel({ name: "New unknown hotel" }, source.fields.price), /Unmapped/);
  const registry = sanDiegoSources();
  registry["BAH-2"].checked_on = "2026-09-30";
  assert.throws(() => normalizeSanDiegoHotel({ name: "Bahia Resort Hotel" }, source.fields.price, registry), /reconcile mapping before renewal/);
});

test("historical quality baseline remains intact after normalization", () => {
  const original = JSON.parse(readFileSync(new URL("../ops/page-quality/2026-09-30.json", import.meta.url)));
  assert.equal(original.summary.conflicts, 3);
  assert.equal(original.summary.unstructured_price_basis, 61);
  assert.equal(original.summary.source_mapped_fields, undefined);
});

test("reference schema rejects undeclared credential metadata and non-string IDs before reporting", async () => {
  const { qualityReport } = await import("./page-quality.mjs");
  const base = hotelEvidence().find((r) => r.id === "san-diego-bahia-resort-hotel");
  for (const mutate of [
    (ref) => { ref.source_urls = ["https://example.com/#access_token=PRIVATE_TEST_VALUE"]; },
    (ref) => { ref.id = { secret: "PRIVATE_TEST_VALUE" }; },
    (ref) => { ref.urls = [{ url: ref.urls[0] }]; },
    (ref) => { ref.evidence_path = { secret: "PRIVATE_TEST_VALUE" }; },
    (ref) => { ref.evidence_path = "docs/../secret"; },
    (ref) => { ref.checked_on = 20260930; }
  ]) {
    const record = structuredClone(base); mutate(record.fields.room.source_refs[0]);
    assert.ok(validateHotelEvidence([record]).length);
    assert.throws(() => qualityReport([record], { today: "2026-09-30" }), /Invalid room source reference/);
  }
});
