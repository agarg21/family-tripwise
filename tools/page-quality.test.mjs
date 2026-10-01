import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { qualityReport, validateCatalogPaths } from "./page-quality.mjs";
import { hotelEvidence } from "./hotel-evidence.mjs";

test("quality report is reproducible, bounded and never renews dates or publishes", async () => {
  const records = hotelEvidence();
  const before = JSON.stringify(records);
  const report = qualityReport(records, { today: "2026-09-30" });
  assert.deepEqual(report, qualityReport(records, { today: "2026-09-30" }));
  assert.equal(JSON.stringify(records), before);
  assert.equal(report.summary.pages, 7);
  assert.equal(report.summary.hotels, 65);
  assert.equal(report.summary.due_price_records, 56);
  assert.equal(report.summary.price_gaps, 3);
  assert.equal(report.summary.conflicts, 6);
  assert.equal(report.summary.source_mapped_fields, 62);
  assert.equal(report.automatic_fact_renewal, false);
  assert.equal(report.automatic_publication, false);
  assert.ok(report.tasks.slice(0, 3).every((t) => t.priority === 1));
  assert.ok(report.pages.every((p) => p.state !== "PASS"));
  await validateCatalogPaths(records);
  const saved = JSON.parse(await readFile(new URL("../ops/page-quality/2026-09-30-san-diego.json", import.meta.url), "utf8"));
  assert.deepEqual(saved, report);
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
