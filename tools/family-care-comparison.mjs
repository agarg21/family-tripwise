import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { validDate } from "./hotel-evidence.mjs";
import { currentEasternDate } from "./family-room-task.mjs";

const presence = new Set(["required", "not-established", "parents-dining-elsewhere-described", "parents-away-described", "supervised-program-parent-policy-not-established", "dropoff-admission-not-established"]);
const costs = new Set(["numeric-service-fee-not-established", "extra-charge-numeric-fee-unknown", "service-inclusion-not-established-from-this-source", "published-included-eligible-program"]);
const text = value => typeof value === "string" && value.trim().length > 0;
const age = value => Number.isInteger(value) && value >= 0 && value <= 17;
const optionalBoolean = value => value === null || typeof value === "boolean";
const denseArray = (value, predicate) => Array.isArray(value) && Array.from(value).every((item, index) => Object.hasOwn(value, index) && predicate(item));
const currency = value => typeof value === "string" && /^[A-Z]{3}$/.test(value);
const requireValue = (condition, message) => { if (!condition) throw new Error(message); };
const keys = (value, required, optional = []) => {
  requireValue(value && typeof value === "object" && !Array.isArray(value), "Expected an evidence object");
  requireValue(required.every(key => Object.hasOwn(value, key)) && Object.keys(value).every(key => [...required, ...optional].includes(key)), "Missing or unsupported evidence fields");
};
const https = value => {
  if (typeof value !== "string") return false;
  try { const url = new URL(value); return url.protocol === "https:" && !url.username && !url.password; }
  catch { return false; }
};
const days = (a, b) => (Date.parse(a) - Date.parse(b)) / 86400000;

export function validateCareInventory(pack, asOf = currentEasternDate()) {
  keys(pack, ["schema_version", "action", "checked_on", "evidence_class", "scope", "scenario", "sources", "records", "research_limits"]);
  requireValue(pack.schema_version === 1 && pack.evidence_class === "OFFICIAL_PROPERTY_FACT", "Unsupported care evidence schema or class");
  requireValue(validDate(asOf) && validDate(pack.checked_on) && pack.checked_on <= asOf, "Invalid screening date or future evidence");
  requireValue(text(pack.action) && text(pack.scope), "Missing action or evidence scope");
  keys(pack.scenario, ["adults", "child_ages", "arrival", "departure", "care_request"]);
  requireValue(Number.isInteger(pack.scenario.adults) && pack.scenario.adults > 0 && denseArray(pack.scenario.child_ages, age) && pack.scenario.child_ages.length > 0, "Invalid research party");
  requireValue(validDate(pack.scenario.arrival) && validDate(pack.scenario.departure) && pack.scenario.departure > pack.scenario.arrival && text(pack.scenario.care_request), "Invalid research stay or care request");
  requireValue(pack.sources && typeof pack.sources === "object" && !Array.isArray(pack.sources) && Object.keys(pack.sources).length > 0, "Missing care sources");
  for (const source of Object.values(pack.sources)) {
    keys(source, ["url", "checked_on", "published_on", "surface", "source_scope"]);
    requireValue(https(source.url) && validDate(source.checked_on) && source.checked_on <= pack.checked_on &&
      (source.published_on === null || (validDate(source.published_on) && source.published_on <= source.checked_on)) && text(source.surface) && text(source.source_scope), "Invalid source URL, date or scope");
  }
  requireValue(Array.isArray(pack.records) && pack.records.length > 0 && new Set(pack.records.map(record => record?.id)).size === pack.records.length, "Missing records or duplicate property IDs");
  for (const record of pack.records) {
    keys(record, ["id", "property", "existing_model_id", "services", "task_result", "budget", "missing", "decision"]);
    requireValue(text(record.id) && text(record.property) && (record.existing_model_id === null || text(record.existing_model_id)) && text(record.task_result) && text(record.decision), "Invalid property record");
    requireValue(Array.isArray(record.services) && record.services.length > 0 && new Set(record.services.map(service => service?.id)).size === record.services.length, "Missing services or duplicate service IDs");
    for (const service of record.services) {
      keys(service, ["id", "name", "source_ids", "min_age", "max_age", "parent_presence", "registration", "potty_training", "session_max_minutes", "hours", "cost_status", "fee_amount", "fee_currency", "fee_unit"]);
      requireValue(text(service.id) && text(service.name) && denseArray(service.source_ids, id => text(id) && Object.hasOwn(pack.sources, id)) && service.source_ids.length > 0 &&
        new Set(service.source_ids).size === service.source_ids.length, "Missing or unknown service source");
      requireValue(age(service.min_age) && (service.max_age === null || (age(service.max_age) && service.max_age >= service.min_age)), "Invalid service age band");
      requireValue(presence.has(service.parent_presence) && optionalBoolean(service.registration) && optionalBoolean(service.potty_training), "Invalid parent or admission evidence");
      requireValue(service.session_max_minutes === null || (Number.isInteger(service.session_max_minutes) && service.session_max_minutes > 0 && service.session_max_minutes <= 1440), "Invalid session limit");
      requireValue((service.hours === null || text(service.hours)) && costs.has(service.cost_status), "Invalid hours or inclusion evidence");
      // This schema has no fee observation basis: priced care needs a reviewed extension.
      requireValue(service.fee_amount === null && service.fee_currency === null && service.fee_unit === null, "Schema 1 cannot establish a numeric care quote");
    }
    keys(record.budget, ["exact_task_room_nightly_amount", "currency", "room_price_status", "care_total_amount", "care_total_status", "basis"], ["retained_room_observation"]);
    requireValue(record.budget.exact_task_room_nightly_amount === null && record.budget.care_total_amount === null && currency(record.budget.currency) && text(record.budget.room_price_status) && text(record.budget.care_total_status) && text(record.budget.basis), "Schema 1 cannot establish a task room-plus-care quote");
    if (record.budget.retained_room_observation !== undefined) {
      const old = record.budget.retained_room_observation;
      keys(old, ["amount_from", "amount_to", "currency", "unit", "category", "observed_on", "source_url", "party_basis", "stay_basis", "fee_basis", "kind", "retrieval_status"]);
      requireValue(Number.isFinite(old.amount_from) && old.amount_from >= 0 && (old.amount_to === null || (Number.isFinite(old.amount_to) && old.amount_to >= old.amount_from)) && currency(old.currency) && validDate(old.observed_on) && old.observed_on <= pack.checked_on && https(old.source_url), "Invalid retained room observation");
      requireValue([old.unit, old.category, old.party_basis, old.stay_basis, old.fee_basis, old.kind, old.retrieval_status].every(text), "Missing retained price basis");
    }
    requireValue(denseArray(record.missing, text), "Invalid unresolved checks");
  }
  requireValue(denseArray(pack.research_limits, text), "Missing research limits");
  return pack;
}

export function screenCareInventory(pack, request = {}, asOf = currentEasternDate()) {
  validateCareInventory(pack, asOf);
  keys(request, [], ["child_ages", "potty_trained", "minutes"]);
  const ages = Object.hasOwn(request, "child_ages") ? request.child_ages : pack.scenario.child_ages;
  const minutes = Object.hasOwn(request, "minutes") ? request.minutes : 90;
  requireValue(denseArray(ages, age) && ages.length > 0 && ages.length <= 10, "Use one to ten child ages from 0 to 17");
  const training = Object.hasOwn(request, "potty_trained") ? request.potty_trained : ages.map(() => null);
  requireValue(denseArray(training, optionalBoolean) && training.length === ages.length, "Provide true, false or null training for every child");
  requireValue(Number.isInteger(minutes) && minutes > 0 && minutes <= 1440, "Use a requested duration from 1 to 1440 minutes");
  const oldestSourceDate = Object.values(pack.sources).map(source => source.checked_on).sort()[0];
  return {
    as_of: asOf, source_checked_on: pack.checked_on,
    oldest_source_checked_on: oldestSourceDate,
    source_age_days: days(asOf, oldestSourceDate),
    source_review_status: days(asOf, oldestSourceDate) >= 7 ? "weekly-source-review-due-not-revalidated" : "dated-evidence-not-a-current-booking-confirmation",
    requested: { child_ages: [...ages], potty_trained: [...training], minutes },
    research_scenario: structuredClone(pack.scenario),
    scope: pack.scope, research_limits: [...pack.research_limits],
    booking_acceptance: "unknown", simultaneous_parent_free_care: "not-established", room_plus_care_total: null,
    records: pack.records.map(record => ({
      id: record.id, property: record.property, existing_model_id: record.existing_model_id,
      budget: structuredClone(record.budget), budget_applicability: "original-research-scenario-only-not-a-quote",
      missing: [...record.missing],
      children: ages.map((childAge, index) => ({
        child_index: index + 1, age: childAge,
        // Keep every service: overlapping floor rules cannot use first-match routing.
        services: record.services.map(service => ({
          ...structuredClone(service),
          age_status: childAge < service.min_age ? "below-published-minimum" :
            service.max_age === null ? "minimum-met-upper-limit-not-established" :
            childAge > service.max_age ? "above-published-maximum" : "within-published-band-not-admission",
          training_status: service.potty_training === null ? "requirement-not-established" : service.potty_training === false ? "no-published-training-requirement" :
            training[index] === null ? "training-check-needed" : training[index] ? "published-training-condition-met" : "published-training-condition-not-met",
          session_status: service.session_max_minutes === null ? "session-limit-not-established" : minutes > service.session_max_minutes ? "requested-duration-exceeds-published-limit" : "within-published-limit-not-confirmed-session",
          sources: service.source_ids.map(id => ({ id, ...structuredClone(pack.sources[id]) }))
        }))
      }))
    }))
  };
}

const csvCell = value => {
  const plain = String(value ?? "").replaceAll(/[\r\n\t]+/g, " ");
  return `"${(/^\s*[=+\-@]/.test(plain) ? "'" + plain : plain).replaceAll('"', '""')}"`;
};

export function careComparisonCsv(pack, request = {}, asOf = currentEasternDate()) {
  const result = screenCareInventory(pack, request, asOf);
  const headings = ["Property", "Child", "Age", "Service", "Published minimum age", "Published maximum age", "Age screen", "Parent presence evidence", "Training evidence", "Training screen", "Registration evidence", "Published hours", "Requested minutes", "Published session maximum minutes", "Session screen", "Inclusion evidence", "Numeric fee", "Fee currency", "Fee unit", "Source checked", "Screened on", "Source review status", "Source URLs", "Source scope", "Exact task room nightly amount", "Room price currency", "Care total", "Budget basis", "Retained room observation", "Original research task", "Next checks", "Research limits"];
  const rows = result.records.flatMap(record => record.children.flatMap(child => child.services.map(service => [
    record.property, child.child_index, child.age, service.name, service.min_age, service.max_age ?? "Unknown", service.age_status,
    service.parent_presence, service.potty_training === null ? "Unknown" : service.potty_training, service.training_status,
    service.registration === null ? "Unknown" : service.registration, service.hours ?? "Unknown", result.requested.minutes,
    service.session_max_minutes ?? "Unknown", service.session_status, service.cost_status, "Unknown", "Unknown", "Unknown",
    service.sources.map(source => source.checked_on).join(" | "), result.as_of, result.source_review_status,
    service.sources.map(source => source.url).join(" | "), service.sources.map(source => source.source_scope).join(" | "),
    "Unknown", record.budget.currency, "Unknown", record.budget.basis,
    record.budget.retained_room_observation ? JSON.stringify(record.budget.retained_room_observation) : "No structured retained observation; see budget basis",
    JSON.stringify(result.research_scenario), record.missing.join(" | "), [result.scope, ...result.research_limits].join(" | ")
  ])));
  return [headings, ...rows].map(row => row.map(csvCell).join(",")).join("\n") + "\n";
}

export function parseCareOptions(input) {
  const args = [...input], packPath = args.shift(), options = new Map();
  requireValue(text(packPath) && !packPath.startsWith("--"), "Provide a care inventory JSON path");
  for (let i = 0; i < args.length; i += 2) {
    requireValue(["--date", "--format", "--child-ages", "--potty-trained", "--minutes"].includes(args[i]) && !options.has(args[i]) && text(args[i + 1]) && !args[i + 1].startsWith("--"), "Unknown, duplicate or incomplete care option");
    options.set(args[i], args[i + 1]);
  }
  const date = options.get("--date") ?? currentEasternDate(), format = options.get("--format") ?? "json", request = {};
  requireValue(validDate(date) && ["json", "csv"].includes(format), "Invalid screening date or format");
  if (options.has("--child-ages")) {
    const ages = options.get("--child-ages").split(",");
    requireValue(ages.length <= 10 && ages.every(value => /^\d+$/.test(value) && age(Number(value))), "Invalid individual child ages");
    request.child_ages = ages.map(Number);
  }
  if (options.has("--potty-trained")) {
    const statuses = options.get("--potty-trained").split(",");
    requireValue(statuses.every(value => ["yes", "no", "unknown"].includes(value)), "Invalid training status");
    request.potty_trained = statuses.map(value => value === "unknown" ? null : value === "yes");
  }
  if (options.has("--minutes")) {
    const value = options.get("--minutes");
    requireValue(/^\d+$/.test(value) && Number.isInteger(Number(value)) && Number(value) > 0 && Number(value) <= 1440, "Invalid requested duration");
    request.minutes = Number(value);
  }
  return { packPath, date, format, request };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const { packPath, date, format, request } = parseCareOptions(process.argv.slice(2));
    const pack = JSON.parse(await readFile(packPath, "utf8"));
    process.stdout.write(format === "csv" ? careComparisonCsv(pack, request, date) : JSON.stringify(screenCareInventory(pack, request, date), null, 2) + "\n");
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
