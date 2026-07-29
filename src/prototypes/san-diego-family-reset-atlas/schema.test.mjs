import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { anchorCatalog, atlasRecords } from "./data.mjs";
import { approvedEvidenceReferences } from "./evidence-registry.mjs";
import { filterRecords, TRUST_FIELDS, validateAtlas, validateAtlasRecord } from "./schema.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const repo = join(here, "../../..");
const expectedAnchorIds = anchorCatalog.map((anchor) => anchor.anchor_id);

test("real-record candidate covers the exact 13 anchors with 39 source-backed records", () => {
  assert.deepEqual(validateAtlas(atlasRecords, { expectedAnchorIds, approvedEvidenceReferences }), []);
  assert.deepEqual(approvedEvidenceReferences, []);
  assert.equal(anchorCatalog.length, 13);
  assert.equal(atlasRecords.length, 39);
  assert.equal(new Set(atlasRecords.map((record) => record.record_id)).size, 39);
  assert.equal(new Set(atlasRecords.map((record) => record.anchor_id)).size, 13);
  assert.equal(new Set(atlasRecords.map((record) => record.source_url)).size, 19);
  assert.equal(
    atlasRecords.find((record) => record.record_id === "fleet-accessibility-morning").source_url,
    "https://www.fleetscience.org/events/accessibility-mornings",
  );

  for (const anchorId of expectedAnchorIds) {
    assert.equal(atlasRecords.filter((record) => record.anchor_id === anchorId).length, 3);
  }
});

test("every record keeps source, reuse, coordinate, and trust boundaries explicit", () => {
  for (const record of atlasRecords) {
    assert.equal(record.synthetic, false);
    assert.match(record.source_url, /^https:\/\//);
    assert.equal(record.checked_at, "2026-07-29");
    assert.equal(record.reuse_status, "internal-research-only");
    assert.match(record.license_or_reuse_note, /unpublished internal candidate/i);
    assert.deepEqual(record.coordinates, {
      lat: null,
      lng: null,
      status: "UNKNOWN",
      source_url: null,
      checked_at: null,
      reuse_status: null,
      license_or_reuse_note: null,
      evidence_reference: null,
    });
    assert.equal(record.human_review_status, "needed");
    assert.equal(record.human_review_evidence, null);
    assert.equal(record.reuse_evidence, null);
    for (const field of TRUST_FIELDS) assert.equal(record.trust_states[field], "UNKNOWN");
  }
});

test("schema allows shared anchors but rejects duplicate record IDs and missing coverage", () => {
  const duplicate = [...atlasRecords, structuredClone(atlasRecords[0])];
  const duplicateErrors = validateAtlas(duplicate, { expectedAnchorIds }).join("\n");
  assert.match(duplicateErrors, /record_id must be unique/);
  assert.doesNotMatch(duplicateErrors, /anchor_id must be unique/);

  const withoutAirport = atlasRecords.filter((record) => record.anchor_id !== "san-diego-airport");
  assert.match(validateAtlas(withoutAirport, { expectedAnchorIds }).join("\n"), /missing expected anchor: san-diego-airport/);
});

test("schema rejects unsupported firm claims and incomplete trust states", () => {
  const unsafe = structuredClone(atlasRecords[0]);
  unsafe.source_fact = "This is the safest, quiet, stroller-easy option and is suitable for families.";
  unsafe.operational_caveat = "This is family-friendly, safe, quiet, and stroller-easy.";
  delete unsafe.trust_states.safety;
  const errors = validateAtlasRecord(unsafe).join("\n");
  assert.match(errors, /firm claim pattern is prohibited/);
  assert.match(errors, /trust_states.safety must be controlled/);
});

test("schema requires evidence for verified coordinates and completed review for firm trust states", () => {
  const invalid = structuredClone(atlasRecords[0]);
  invalid.coordinates = {
    lat: 999,
    lng: 999,
    status: "verified-source",
    source_url: null,
    checked_at: null,
    reuse_status: null,
    license_or_reuse_note: null,
    evidence_reference: null,
  };
  invalid.human_review_status = "complete";
  invalid.trust_states.route_practicality = "human-reviewed";
  const errors = validateAtlasRecord(invalid).join("\n");
  assert.match(errors, /valid latitude and longitude bounds/);
  assert.match(errors, /verified-source coordinates require an HTTPS source_url/);
  assert.match(errors, /verified-source coordinates require an ISO checked_at date/);
  assert.match(errors, /verified-source coordinates require a controlled reuse_status/);
  assert.match(errors, /verified-source coordinates require a license_or_reuse_note/);
  assert.match(errors, /human-reviewed trust states require human_review_evidence/);
});

test("schema rejects unapproved or simulated evidence for a completed human review", () => {
  const reviewed = structuredClone(atlasRecords[0]);
  reviewed.human_review_status = "complete";
  reviewed.trust_states.route_practicality = "human-reviewed";
  reviewed.human_review_evidence = {
    reviewer_type: "field-reviewer",
    reviewed_at: "2026-07-29",
    evidence_reference: "x",
    field_notes: { route_practicality: "AI simulated this route." },
  };
  const errors = validateAtlasRecord(reviewed, { approvedEvidenceReferences }).join("\n");
  assert.match(errors, /exact docs\/research Markdown heading reference/);
  assert.match(errors, /cannot use agent or simulated evidence/);

  reviewed.human_review_evidence.evidence_reference = "docs/research/unapproved-human-review.md#route-review";
  reviewed.human_review_evidence.field_notes.route_practicality = "The reviewer recorded route observations.";
  assert.match(
    validateAtlasRecord(reviewed, { approvedEvidenceReferences }).join("\n"),
    /not present in the approved evidence registry/,
  );
});

test("schema rejects unapproved or placeholder clearance evidence", () => {
  const cleared = structuredClone(atlasRecords[0]);
  cleared.reuse_status = "cleared-data";
  assert.match(validateAtlasRecord(cleared).join("\n"), /cleared-data records require reuse_evidence/);

  cleared.reuse_evidence = {
    source_url: "https://example.gov/data",
    terms_url: "https://example.gov/terms",
    license_name: "Example open-data license",
    checked_at: "2026-07-29",
    attribution: "Example public agency",
    evidence_reference: "docs/research/unapproved-license-audit.md#clearance",
  };
  const errors = validateAtlasRecord(cleared, { approvedEvidenceReferences }).join("\n");
  assert.match(errors, /not present in the approved evidence registry/);
  assert.match(errors, /cannot use placeholder clearance metadata/);
});

test("schema rejects impossible dates across review, reuse, and coordinate evidence", () => {
  const evidenceReference = "docs/research/future-reviewed-evidence.md#record";
  const approved = [evidenceReference];

  const reviewed = structuredClone(atlasRecords[0]);
  reviewed.human_review_status = "complete";
  reviewed.trust_states.route_practicality = "human-reviewed";
  reviewed.human_review_evidence = {
    reviewer_type: "field-reviewer",
    reviewed_at: "2026-02-30",
    evidence_reference: evidenceReference,
    field_notes: { route_practicality: "The reviewer recorded route observations." },
  };
  assert.match(validateAtlasRecord(reviewed, { approvedEvidenceReferences: approved }).join("\n"), /reviewed_at must be an ISO date/);

  const cleared = structuredClone(atlasRecords[0]);
  cleared.reuse_status = "cleared-data";
  cleared.reuse_evidence = {
    source_url: "https://data.sandiego.gov/datasets/gis-park-locations/",
    terms_url: "https://data.sandiego.gov/help/guides/terms/",
    license_name: "ODC PDDL 1.0",
    checked_at: "2026-02-30",
    attribution: "City of San Diego",
    evidence_reference: evidenceReference,
  };
  assert.match(validateAtlasRecord(cleared, { approvedEvidenceReferences: approved }).join("\n"), /checked_at must be an ISO date/);

  const located = structuredClone(atlasRecords[0]);
  located.coordinates = {
    lat: 32.7157,
    lng: -117.1611,
    status: "verified-source",
    source_url: "https://data.sandiego.gov/datasets/gis-park-locations/",
    checked_at: "2026-02-30",
    reuse_status: "cleared-data",
    license_or_reuse_note: "City open-data geometry with recorded terms.",
    evidence_reference: evidenceReference,
  };
  assert.match(validateAtlasRecord(located, { approvedEvidenceReferences: approved }).join("\n"), /require an ISO checked_at date/);
});

test("filtering combines query, source, cluster, and controlled reset type", () => {
  assert.equal(filterRecords(atlasRecords, { query: "stroller" }).length >= 1, true);
  assert.equal(filterRecords(atlasRecords, { query: "Airport Authority" }).length, 3);
  assert.equal(filterRecords(atlasRecords, { clusters: ["La Jolla"] }).length, 6);
  assert.equal(filterRecords(atlasRecords, { resetTypes: ["caregiver facility"] }).length >= 5, true);
  assert.equal(filterRecords(atlasRecords, { query: "airport", clusters: ["Mission Bay"] }).length, 0);
});

test("candidate is noindex, zero-storage, and absent from production publishing surfaces", () => {
  const html = readFileSync(join(here, "index.html"), "utf8");
  const app = readFileSync(join(here, "app.mjs"), "utf8");
  const sitemap = readFileSync(join(repo, "site/sitemap.xml"), "utf8");
  const siteFiles = ["index.html", "app.js", "sitemap.xml"].map((path) => readFileSync(join(repo, "site", path), "utf8")).join("\n");
  assert.match(html, /<meta name="robots" content="noindex, nofollow">/);
  assert.match(html, /FT-AUTH-002/);
  assert.doesNotMatch(app, /localStorage|sessionStorage|fetch\(|XMLHttpRequest|URLSearchParams/);
  assert.doesNotMatch(sitemap, /family-reset-atlas/i);
  assert.doesNotMatch(siteFiles, /san-diego-family-reset-atlas/i);
});
