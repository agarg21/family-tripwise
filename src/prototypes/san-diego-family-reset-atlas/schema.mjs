export const RESET_TYPES = [
  "indoor fallback",
  "quiet/sensory support",
  "caregiver facility",
  "mobility support",
  "public-space reset",
  "transport constraint",
];

export const EVIDENCE_CLASSES = [
  "official first party",
  "government open data",
  "authoritative nonprofit",
  "human field review",
  "synthetic fixture",
];

export const CONFIDENCE_VALUES = ["high", "medium", "low", "UNKNOWN"];
export const HUMAN_REVIEW_VALUES = ["not-required", "needed", "in-review", "complete"];
export const COORDINATE_STATES = ["verified-source", "UNKNOWN", "withheld-synthetic-fixture"];
export const REUSE_STATES = ["cleared-data", "internal-research-only", "UNKNOWN"];
export const TRUST_FIELDS = [
  "route_practicality",
  "stroller_practicality",
  "sensory_conditions",
  "quiet_conditions",
  "safety",
  "caregiver_facility_suitability",
  "family_suitability",
];
export const TRUST_VALUES = ["UNKNOWN", "human-reviewed"];
export const HUMAN_REVIEWER_TYPES = ["parent-participant", "field-reviewer", "subject-matter-reviewer"];

const requiredStrings = [
  "record_id",
  "anchor_id",
  "name",
  "cluster",
  "reset_type",
  "source_fact",
  "source_owner",
  "checked_at",
  "evidence_class",
  "confidence",
  "human_review_status",
  "operational_caveat",
  "license_or_reuse_note",
  "reuse_status",
];

const firmClaimPatterns = [
  /\bfamily[- ]friendly\b/i,
  /\bstroller[- ]easy\b/i,
  /\bsafest?\b/i,
  /\bquiet space\b/i,
  /\brecommended\b/i,
  /\bbest (?:place|option|fit)\b/i,
  /\baccessible\b/i,
  /\bquiet\b/i,
  /\beasy with (?:a )?strollers?\b/i,
  /\bsuitable for families\b/i,
];

const durableEvidenceReferencePattern = /^docs\/research\/[a-z0-9][a-z0-9-]*\.md#[a-z0-9][a-z0-9-]*$/;
const simulatedEvidencePattern = /\b(?:ai|agent|model|synthetic|simulated|simulation|generated)\b/i;
const placeholderEvidencePattern = /\b(?:example|placeholder|todo|tbd|unknown|test)\b/i;

function isIsoDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value;
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim() !== "";
}

function validateEvidenceReference(value, approvedEvidenceReferences, label, errors) {
  if (!isNonEmptyString(value) || !durableEvidenceReferencePattern.test(value)) {
    errors.push(`${label} must be an exact docs/research Markdown heading reference`);
    return;
  }
  if (!approvedEvidenceReferences.has(value)) {
    errors.push(`${label} is not present in the approved evidence registry`);
  }
}

export function validateAtlasRecord(record, { approvedEvidenceReferences = [] } = {}) {
  const errors = [];
  const approvedReferences = new Set(approvedEvidenceReferences);

  for (const field of requiredStrings) {
    if (typeof record[field] !== "string" || record[field].trim() === "") {
      errors.push(`${field} must be a non-empty string`);
    }
  }

  if (!RESET_TYPES.includes(record.reset_type)) errors.push("reset_type is not controlled");
  if (!EVIDENCE_CLASSES.includes(record.evidence_class)) errors.push("evidence_class is not controlled");
  if (!CONFIDENCE_VALUES.includes(record.confidence)) errors.push("confidence is not controlled");
  if (!HUMAN_REVIEW_VALUES.includes(record.human_review_status)) errors.push("human_review_status is not controlled");
  if (!REUSE_STATES.includes(record.reuse_status)) errors.push("reuse_status is not controlled");
  if (!isIsoDate(record.checked_at)) errors.push("checked_at must be an ISO date");
  if (typeof record.synthetic !== "boolean") errors.push("synthetic must be a boolean");

  if (!Object.hasOwn(record, "source_published_or_updated_at")) {
    errors.push("source_published_or_updated_at must be present");
  } else if (record.source_published_or_updated_at !== null && !isIsoDate(record.source_published_or_updated_at)) {
    errors.push("source_published_or_updated_at must be null or an ISO date");
  }

  if (!record.coordinates || !Object.hasOwn(record.coordinates, "lat") || !Object.hasOwn(record.coordinates, "lng")) {
    errors.push("coordinates must expose lat and lng states");
  } else {
    const values = [record.coordinates.lat, record.coordinates.lng];
    if (!values.every((value) => value === null || Number.isFinite(value))) {
      errors.push("coordinates must be finite numbers or null");
    }
    if (!Object.hasOwn(record.coordinates, "status") || !COORDINATE_STATES.includes(record.coordinates.status)) {
      errors.push("coordinates.status must be a controlled state");
    } else if (record.coordinates.status === "verified-source") {
      if (!values.every(Number.isFinite)) {
        errors.push("verified-source coordinates require finite lat and lng");
      } else if (record.coordinates.lat < -90 || record.coordinates.lat > 90 || record.coordinates.lng < -180 || record.coordinates.lng > 180) {
        errors.push("verified-source coordinates must use valid latitude and longitude bounds");
      }
      if (!isNonEmptyString(record.coordinates.source_url) || !record.coordinates.source_url.startsWith("https://")) {
        errors.push("verified-source coordinates require an HTTPS source_url");
      }
      if (!isIsoDate(record.coordinates.checked_at)) errors.push("verified-source coordinates require an ISO checked_at date");
      if (!REUSE_STATES.includes(record.coordinates.reuse_status)) {
        errors.push("verified-source coordinates require a controlled reuse_status");
      }
      if (!isNonEmptyString(record.coordinates.license_or_reuse_note)) {
        errors.push("verified-source coordinates require a license_or_reuse_note");
      }
      validateEvidenceReference(
        record.coordinates.evidence_reference,
        approvedReferences,
        "coordinates.evidence_reference",
        errors,
      );
    } else {
      if (!values.every((value) => value === null)) {
        errors.push(`${record.coordinates.status} coordinates require null lat and lng`);
      }
      for (const field of ["source_url", "checked_at", "reuse_status", "license_or_reuse_note", "evidence_reference"]) {
        if (!Object.hasOwn(record.coordinates, field) || record.coordinates[field] !== null) {
          errors.push(`${record.coordinates.status} coordinates require null ${field}`);
        }
      }
    }
  }

  if (!record.map_position || !Number.isFinite(record.map_position.x) || !Number.isFinite(record.map_position.y)) {
    errors.push("map_position must contain finite x and y values");
  } else if ([record.map_position.x, record.map_position.y].some((value) => value < 5 || value > 95)) {
    errors.push("map_position must stay inside the illustrative shell");
  }

  if (record.synthetic !== true) {
    if (typeof record.source_url !== "string" || !record.source_url.startsWith("https://")) {
      errors.push("non-synthetic records require an HTTPS source_url");
    }
    if (record.coordinates?.status === "withheld-synthetic-fixture") {
      errors.push("real records cannot use synthetic coordinate state");
    }
  } else {
    if (record.source_url !== null) errors.push("synthetic fixtures must not imply a real source_url");
    if (record.coordinates?.lat !== null || record.coordinates?.lng !== null) {
      errors.push("synthetic fixtures must not contain real coordinates");
    }
    if (record.coordinates?.status !== "withheld-synthetic-fixture") {
      errors.push("synthetic fixture coordinate status must be withheld-synthetic-fixture");
    }
    if (record.confidence !== "UNKNOWN") errors.push("synthetic fixture confidence must be UNKNOWN");
    if (record.human_review_status !== "needed") errors.push("synthetic fixtures must remain human-review needed");
  }

  if (!record.trust_states || typeof record.trust_states !== "object") {
    errors.push("trust_states must be present");
  } else {
    const reviewedFields = [];
    for (const field of TRUST_FIELDS) {
      if (!Object.hasOwn(record.trust_states, field) || !TRUST_VALUES.includes(record.trust_states[field])) {
        errors.push(`trust_states.${field} must be controlled`);
      } else if (record.trust_states[field] === "human-reviewed" && record.human_review_status !== "complete") {
        errors.push(`trust_states.${field} requires completed human review`);
      } else if (record.trust_states[field] === "human-reviewed") {
        reviewedFields.push(field);
      }
    }

    if (reviewedFields.length > 0) {
      const evidence = record.human_review_evidence;
      if (!evidence || typeof evidence !== "object") {
        errors.push("human-reviewed trust states require human_review_evidence");
      } else {
        if (!HUMAN_REVIEWER_TYPES.includes(evidence.reviewer_type)) {
          errors.push("human_review_evidence.reviewer_type must be controlled");
        }
        if (!isIsoDate(evidence.reviewed_at)) errors.push("human_review_evidence.reviewed_at must be an ISO date");
        validateEvidenceReference(
          evidence.evidence_reference,
          approvedReferences,
          "human_review_evidence.evidence_reference",
          errors,
        );
        if (!evidence.field_notes || typeof evidence.field_notes !== "object") {
          errors.push("human_review_evidence.field_notes must be present");
        } else {
          for (const field of reviewedFields) {
            if (!isNonEmptyString(evidence.field_notes[field])) {
              errors.push(`human_review_evidence.field_notes.${field} must support the reviewed state`);
            } else if (simulatedEvidencePattern.test(evidence.field_notes[field])) {
              errors.push(`human_review_evidence.field_notes.${field} cannot use agent or simulated evidence`);
            }
          }
        }
      }
    } else if (!Object.hasOwn(record, "human_review_evidence") || record.human_review_evidence !== null) {
      errors.push("records without human-reviewed trust states require null human_review_evidence");
    }
  }

  if (!Object.hasOwn(record, "reuse_evidence")) {
    errors.push("reuse_evidence must be present");
  } else if (record.reuse_status === "cleared-data") {
    const evidence = record.reuse_evidence;
    if (!evidence || typeof evidence !== "object") {
      errors.push("cleared-data records require reuse_evidence");
    } else {
      if (!isNonEmptyString(evidence.source_url) || !evidence.source_url.startsWith("https://")) {
        errors.push("reuse_evidence.source_url must be HTTPS");
      }
      if (!isNonEmptyString(evidence.terms_url) || !evidence.terms_url.startsWith("https://")) {
        errors.push("reuse_evidence.terms_url must be HTTPS");
      }
      for (const field of ["license_name", "attribution", "evidence_reference"]) {
        if (!isNonEmptyString(evidence[field])) errors.push(`reuse_evidence.${field} must be a non-empty string`);
      }
      if (!isIsoDate(evidence.checked_at)) errors.push("reuse_evidence.checked_at must be an ISO date");
      validateEvidenceReference(evidence.evidence_reference, approvedReferences, "reuse_evidence.evidence_reference", errors);
      if (placeholderEvidencePattern.test(Object.values(evidence).join(" "))) {
        errors.push("reuse_evidence cannot use placeholder clearance metadata");
      }
    }
  } else if (record.reuse_evidence !== null) {
    errors.push("non-cleared records require null reuse_evidence");
  }

  const claimText = [record.source_fact, record.operational_caveat].join(" ");
  for (const pattern of firmClaimPatterns) {
    if (pattern.test(claimText)) errors.push(`firm claim pattern is prohibited: ${pattern.source}`);
  }

  return errors;
}

export function validateAtlas(records, { expectedAnchorIds = [], approvedEvidenceReferences = [] } = {}) {
  const recordIds = new Set();
  const anchorIds = new Set();
  const errors = [];
  records.forEach((record, index) => {
    for (const error of validateAtlasRecord(record, { approvedEvidenceReferences })) {
      errors.push(`${index}:${record.anchor_id || "UNKNOWN"}: ${error}`);
    }
    if (recordIds.has(record.record_id)) errors.push(`${index}:${record.record_id}: record_id must be unique`);
    recordIds.add(record.record_id);
    anchorIds.add(record.anchor_id);
  });
  for (const anchorId of expectedAnchorIds) {
    if (!anchorIds.has(anchorId)) errors.push(`missing expected anchor: ${anchorId}`);
  }
  for (const anchorId of anchorIds) {
    if (expectedAnchorIds.length > 0 && !expectedAnchorIds.includes(anchorId)) errors.push(`unexpected anchor: ${anchorId}`);
  }
  return errors;
}

export function filterRecords(records, { query = "", clusters = [], resetTypes = [] } = {}) {
  const normalized = query.trim().toLowerCase();
  return records.filter((record) => {
    const matchesQuery =
      !normalized ||
      [record.name, record.cluster, record.reset_type, record.source_fact, record.source_owner].some((value) =>
        value.toLowerCase().includes(normalized),
      );
    const matchesCluster = clusters.length === 0 || clusters.includes(record.cluster);
    const matchesType = resetTypes.length === 0 || resetTypes.includes(record.reset_type);
    return matchesQuery && matchesCluster && matchesType;
  });
}
