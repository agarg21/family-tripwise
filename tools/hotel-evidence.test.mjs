import test from "node:test";
import assert from "node:assert/strict";
import { cpSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { hotelEvidence, validateHotelEvidence, hotelAuditRecords } from "./hotel-evidence.mjs";
import { createFamilyHotelPages } from "./page-generation/family-hotel-pages.mjs";
import { cancunEvidence } from "../src/prototypes/cancun-resort-comparison/data.mjs";
import { suites } from "./page-generation/orlando-suite-data.mjs";

test("seven comparisons share 65 validated records without replacing source values", () => {
  const records = hotelEvidence();
  assert.deepEqual(validateHotelEvidence(records), []);
  assert.equal(records.length, 65);
  assert.equal(new Set(records.map((r) => r.page_url)).size, 7);
  const legacy = createFamilyHotelPages({}).hotelCatalog;
  for (const [city, hotels] of Object.entries(legacy)) for (let i = 0; i < hotels.length; i++) {
    const p = records.find((r) => r.hotel === hotels[i].name && r.page_url.includes(`/${city}-family-hotels`)).fields.price;
    assert.equal(p.value.display, hotels[i].priceRange);
    if (!["san-diego", "new-york-city"].includes(city)) assert.equal(p.value.party_basis, null);
    assert.equal(p.evidence_class, "EDITORIAL_INTERPRETATION");
  }
  for (const hotel of cancunEvidence.records) {
    const r = records.find((r) => r.id === `cancun-${hotel.id}`);
    assert.deepEqual(r.fields.room.value, hotel.room);
    assert.equal(r.fields.price.value?.amount_from ?? null, hotel.price?.usdFrom ?? null);
    assert.equal(r.fields.price.value?.amount_to ?? null, hotel.price?.usdTo ?? null);
    assert.equal(r.fields.price.observed_on, hotel.price?.observedOn ?? null);
    assert.equal(r.fields.price.value?.source_basis ?? null, hotel.price?.basis ?? null);
  }
  const sample = suites.find((r) => r.id === "holiday-inn").priceSample;
  const ihg = records.find((r) => r.id === "orlando-holiday-inn");
  assert.equal(ihg.fields.price.value.amount_from, Math.round(sample.estimatedTotal / sample.nights * 100) / 100);
  assert.equal(ihg.fields.fees.state, "disputed");
  assert.equal(ihg.fields.price.value.party_basis, sample.party);
  assert.equal(hotelAuditRecords().length, 390);
});

test("schema rejects corrupt classifications, dates, prices and private source URLs", () => {
  const mutate = (callback) => { const r = structuredClone(hotelEvidence().find((r) => r.id === "orlando-holiday-inn")); callback(r); assert.ok(validateHotelEvidence([r]).length); };
  mutate((r) => { r.schema_version = 9; });
  mutate((r) => { r.fields.price.observed_on = "2026-02-30"; });
  mutate((r) => { r.fields.price.evidence_class = "LIVE_QUOTE"; });
  mutate((r) => { r.fields.price.value.amount_from = 0; });
  mutate((r) => { r.fields.price.value.amount_to = 1; });
  mutate((r) => { r.fields.price.value.party_basis = null; });
  mutate((r) => { r.fields.room.source_urls = ["https://a.test/?api_key=secret"]; });
  mutate((r) => { r.fields.room.source_urls = ["https://user:secret@a.test/"]; });
  mutate((r) => { r.fields.room.source_urls = ["https://a.test/#access_token=PRIVATE_TEST_VALUE"]; });
  mutate((r) => { r.fields.room.source_urls = ["https://a.test/#%61%63%63%65%73%73%5f%74%6f%6b%65%6e=x"]; });
  mutate((r) => { r.fields.unexpected = null; });
  mutate((r) => { r.fields.unexpected = { state: "known", evidence_class: "NOT_VALIDATED" }; });
  mutate((r) => { delete r.fields.fees; });
  assert.ok(validateHotelEvidence([hotelEvidence()[0], hotelEvidence()[0]]).length);
});

test("adapter and report consumers cannot mutate maintained models through shared references", () => {
  const original = JSON.stringify(cancunEvidence);
  const records = hotelEvidence();
  const r = records.find((item) => item.id === "cancun-finest-family-suite");
  r.fields.room.value.maximum = 99;
  r.fields.activities.value.programs[0].min = 99;
  r.fields.fees.value.checks.push("synthetic mutation");
  assert.equal(JSON.stringify(cancunEvidence), original);
  assert.equal(hotelEvidence().find((item) => item.id === r.id).fields.room.value.maximum, 5);
});

test("catalog reads and regeneration do not change published hotel comparisons", () => {
  const root = fileURLToPath(new URL("../", import.meta.url));
  const temp = mkdtempSync(join(tmpdir(), "ft-hotel-standard-"));
  try {
    for (const folder of ["site", "tools", "src"]) cpSync(join(root, folder), join(temp, folder), { recursive: true });
    const paths = [...new Set(hotelEvidence().map((r) => new URL(r.page_url).pathname.slice(1)))];
    const original = paths.map((p) => readFileSync(join(temp, "site", p)));
    execFileSync(process.execPath, [join(temp, "tools/generate-pages.mjs")], { cwd: temp, stdio: "pipe" });
    paths.forEach((p, i) => assert.deepEqual(readFileSync(join(temp, "site", p)), original[i], p));
  } finally { rmSync(temp, { recursive: true, force: true }); }
});
