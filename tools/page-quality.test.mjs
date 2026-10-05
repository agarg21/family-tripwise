import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { qualityReport, validateCatalogPaths } from "./page-quality.mjs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { hotelEvidence } from "./hotel-evidence.mjs";

async function historicalRecords() {
  const records = hotelEvidence();
  const saved = JSON.parse(await readFile(new URL("../ops/page-quality/2026-09-30-nyc-price-labels.json", import.meta.url), "utf8"));
  const prior = saved.tasks.find(t => t.id === "san-diego-la-jolla-shores-hotel-fees");
  const hotel = records.find(r => r.hotel === "La Jolla Shores Hotel");
  // Replay the historical checkpoint, not October's newly checked fee policy.
  hotel.fields.fees = {value: prior.retained_value, state: "disputed", observed_on: "2026-08-17",
    evidence_class: prior.evidence_class, evidence_path: prior.evidence_path, source_urls: prior.source_urls,
    source_refs: prior.source_refs, date_basis: "field-observation", limitation: prior.limitation};
  return records;
}

test("hotel quality CLI cannot overwrite a retained evidence checkpoint", async () => {
  const retained = new URL("../ops/page-quality/2026-09-30-nyc-price-labels.json", import.meta.url);
  const before = await readFile(retained, "utf8");
  assert.throws(() => execFileSync(process.execPath, [fileURLToPath(new URL("./page-quality.mjs", import.meta.url)), "--date", "2026-10-07", "--output", fileURLToPath(retained)], { stdio: "pipe" }), /already exists/);
  assert.equal(await readFile(retained, "utf8"), before);
});

test("quality report is reproducible, bounded and never renews dates or publishes", async () => {
  const records = await historicalRecords();
  const before = JSON.stringify(records);
  const report = qualityReport(records, { today: "2026-09-30" });
  assert.deepEqual(report, qualityReport(records, { today: "2026-09-30" }));
  assert.equal(JSON.stringify(records), before);
  assert.equal(report.summary.pages, 7);
  assert.equal(report.summary.hotels, 65);
  assert.equal(report.summary.due_price_records, 56);
  assert.equal(report.summary.price_gaps, 3);
  assert.equal(report.summary.conflicts, 13);
  assert.equal(report.summary.source_mapped_fields, 240);
  assert.equal(report.automatic_fact_renewal, false);
  assert.equal(report.automatic_publication, false);
  assert.ok(report.tasks.slice(0, 3).every((t) => t.priority === 1));
  assert.ok(report.pages.every((p) => p.state !== "PASS"));
  await validateCatalogPaths(records);
  const saved = JSON.parse(await readFile(new URL("../ops/page-quality/2026-09-30-nyc-price-labels.json", import.meta.url), "utf8"));
  assert.deepEqual(saved, report);
});

test("NYC wording checkpoint preserves every historical field except twelve price contexts", async () => {
  const saved = JSON.parse(await readFile(new URL("../ops/page-quality/2026-09-30-legacy.json", import.meta.url), "utf8"));
  const current = qualityReport(await historicalRecords(), { today: "2026-09-30" });
  const changed = [];
  for (const task of saved.tasks) {
    const newer = current.tasks.find((item) => item.id === task.id);
    if (task.id.startsWith("new-york-city-") && task.field === "price") {
      assert.notEqual(task.retained_value.fee_basis, newer.retained_value.fee_basis);
      assert.match(newer.retained_value.fee_basis, /sample checked July 25, 2026/);
      changed.push(task.id);
      task.retained_value.fee_basis = newer.retained_value.fee_basis;
    }
  }
  assert.equal(changed.length, 12);
  assert.deepEqual(saved, current);
});

test("review triggers distinguish missing, stale, conflicting and unnormalized evidence", () => {
  const report = qualityReport(hotelEvidence(), { today: "2026-10-12" });
  const sunscape = report.tasks.find((t) => t.id === "cancun-sunscape-family-junior-suite-price");
  assert.equal(sunscape.freshness.state, "review-due");
  assert.ok(sunscape.reasons.includes("structured-room-party-stay-basis-needed"));
  const legacy = report.tasks.find((t) => t.id === "san-diego-bahia-resort-hotel-room");
  assert.ok(legacy.reasons.includes("disputed"));
  assert.equal(legacy.freshness.state, "review-due");
  assert.equal(legacy.freshness.age_days, 56);
  assert.ok(report.tasks.find((t) => t.id === "san-diego-bahia-resort-hotel-price").reasons.includes("price-basis-unknowns-remain"));
  assert.equal(report.tasks.find((t) => t.id === "cancun-ziva-ocean-view-double-price").retained_value, null);
  assert.throws(() => qualityReport(hotelEvidence(), { today: "2026-02-30" }));
});

test("catalog references cannot silently drift outside the sitemap or repository", async () => {
  const records = hotelEvidence().slice(0, 1);
  records[0].page_url = "https://familytripwise.com/where-to-stay/not-published.html";
  await assert.rejects(validateCatalogPaths(records), /sitemap/);
  records[0].page_url = hotelEvidence()[0].page_url;
  records[0].fields.room.evidence_path = "docs/../../secret";
  await assert.rejects(validateCatalogPaths(records), /Unsafe/);
});

test("unexpected envelopes and fragment credentials fail before serializable reporting", () => {
  for (const extra of [null, { state: "known", evidence_class: "NOT_VALIDATED" }]) {
    const records = hotelEvidence(); records[0].fields.unexpected = extra;
    assert.throws(() => qualityReport(records, { today: "2026-09-30" }), /Unexpected fields/);
  }
  const records = hotelEvidence();
  records[0].fields.room.source_urls = ["https://example.com/#access_token=PRIVATE_TEST_VALUE"];
  assert.throws(() => qualityReport(records, { today: "2026-09-30" }), /Unsafe room source/);
});
