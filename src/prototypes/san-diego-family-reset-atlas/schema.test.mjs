import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { syntheticAtlasRecords } from "./data.mjs";
import { filterRecords, validateAtlas, validateAtlasRecord } from "./schema.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const repo = join(here, "../../..");

test("all synthetic fixtures satisfy the schema and conservative evidence boundary", () => {
  assert.deepEqual(validateAtlas(syntheticAtlasRecords), []);
  assert.equal(syntheticAtlasRecords.length, 6);
  assert.equal(new Set(syntheticAtlasRecords.map((record) => record.anchor_id)).size, syntheticAtlasRecords.length);
  for (const record of syntheticAtlasRecords) {
    assert.equal(record.synthetic, true);
    assert.equal(record.source_url, null);
    assert.deepEqual([record.coordinates.lat, record.coordinates.lng], [null, null]);
    assert.equal(record.confidence, "UNKNOWN");
    assert.equal(record.human_review_status, "needed");
  }
});

test("schema rejects a synthetic fixture that implies real coordinates or a firm claim", () => {
  const unsafe = structuredClone(syntheticAtlasRecords[0]);
  unsafe.coordinates.lat = 32.7;
  unsafe.source_fact = "This route is accessible, quiet, easy with strollers, and suitable for families.";
  const errors = validateAtlasRecord(unsafe).join("\n");
  assert.match(errors, /must not contain real coordinates/);
  assert.match(errors, /firm claim pattern is prohibited/);
});

test("schema requires freshness and controlled coordinate-state fields", () => {
  const missing = structuredClone(syntheticAtlasRecords[0]);
  delete missing.source_published_or_updated_at;
  delete missing.coordinates.status;
  const missingErrors = validateAtlasRecord(missing).join("\n");
  assert.match(missingErrors, /source_published_or_updated_at must be present/);
  assert.match(missingErrors, /coordinates.status must be a controlled state/);

  const invalid = structuredClone(syntheticAtlasRecords[0]);
  invalid.source_published_or_updated_at = "recently";
  invalid.coordinates.status = "probably-correct";
  const invalidErrors = validateAtlasRecord(invalid).join("\n");
  assert.match(invalidErrors, /must be null or an ISO date/);
  assert.match(invalidErrors, /coordinates.status must be a controlled state/);
  assert.match(invalidErrors, /synthetic fixture coordinate status must be withheld-synthetic-fixture/);
});

test("filtering combines query, cluster, and controlled reset type", () => {
  assert.equal(filterRecords(syntheticAtlasRecords, { query: "transport" }).length, 1);
  assert.equal(filterRecords(syntheticAtlasRecords, { clusters: ["Balboa Park / Zoo"] }).length, 2);
  assert.equal(filterRecords(syntheticAtlasRecords, { resetTypes: ["public-space reset"] }).length, 1);
  assert.equal(filterRecords(syntheticAtlasRecords, { query: "synthetic", clusters: ["La Jolla"], resetTypes: ["mobility support"] }).length, 1);
  assert.equal(filterRecords(syntheticAtlasRecords, { query: "airport", clusters: ["Mission Bay"] }).length, 0);
});

test("prototype is noindex and absent from production publishing surfaces", () => {
  const html = readFileSync(join(here, "index.html"), "utf8");
  const sitemap = readFileSync(join(repo, "site/sitemap.xml"), "utf8");
  const siteFiles = ["index.html", "app.js", "sitemap.xml"].map((path) => readFileSync(join(repo, "site", path), "utf8")).join("\n");
  assert.match(html, /<meta name="robots" content="noindex, nofollow">/);
  assert.doesNotMatch(sitemap, /family-reset-atlas/i);
  assert.doesNotMatch(siteFiles, /san-diego-family-reset-atlas/i);
});
