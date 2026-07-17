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

const requiredStrings = [
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

function isIsoDate(value) {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));
}

export function validateAtlasRecord(record) {
  const errors = [];

  for (const field of requiredStrings) {
    if (typeof record[field] !== "string" || record[field].trim() === "") {
      errors.push(`${field} must be a non-empty string`);
    }
  }

  if (!RESET_TYPES.includes(record.reset_type)) errors.push("reset_type is not controlled");
  if (!EVIDENCE_CLASSES.includes(record.evidence_class)) errors.push("evidence_class is not controlled");
  if (!CONFIDENCE_VALUES.includes(record.confidence)) errors.push("confidence is not controlled");
  if (!HUMAN_REVIEW_VALUES.includes(record.human_review_status)) errors.push("human_review_status is not controlled");
  if (!isIsoDate(record.checked_at)) errors.push("checked_at must be an ISO date");

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

  const claimText = [record.source_fact, record.operational_caveat].join(" ");
  for (const pattern of firmClaimPatterns) {
    if (pattern.test(claimText)) errors.push(`firm claim pattern is prohibited: ${pattern.source}`);
  }

  return errors;
}

export function validateAtlas(records) {
  const ids = new Set();
  const errors = [];
  records.forEach((record, index) => {
    for (const error of validateAtlasRecord(record)) errors.push(`${index}:${record.anchor_id || "UNKNOWN"}: ${error}`);
    if (ids.has(record.anchor_id)) errors.push(`${index}:${record.anchor_id}: anchor_id must be unique`);
    ids.add(record.anchor_id);
  });
  return errors;
}

export function filterRecords(records, { query = "", clusters = [], resetTypes = [] } = {}) {
  const normalized = query.trim().toLowerCase();
  return records.filter((record) => {
    const matchesQuery = !normalized || [record.name, record.cluster, record.reset_type].some((value) => value.toLowerCase().includes(normalized));
    const matchesCluster = clusters.length === 0 || clusters.includes(record.cluster);
    const matchesType = resetTypes.length === 0 || resetTypes.includes(record.reset_type);
    return matchesQuery && matchesCluster && matchesType;
  });
}
