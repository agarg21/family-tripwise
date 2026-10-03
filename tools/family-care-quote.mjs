import { readFile } from "node:fs/promises";
import { realpathSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { types } from "node:util";
import { validDate } from "./hotel-evidence.mjs";
import { currentEasternDate } from "./family-room-task.mjs";

const requireValue = (condition, message) => { if (!condition) throw new Error(message); };
const text = value => typeof value === "string" && value.trim().length > 0;
const age = value => Number.isInteger(value) && value >= 0 && value <= 17;
const money = value => Number.isFinite(value) && value >= 0 && Number.isSafeInteger(Math.round(value * 100)) && Math.abs(value * 100 - Math.round(value * 100)) < 0.000001;
const currency = value => typeof value === "string" && /^[A-Z]{3}$/.test(value);
const days = (later, earlier) => (Date.parse(later) - Date.parse(earlier)) / 86400000;
const dense = (value, predicate) => {
  if (!Array.isArray(value) || Object.getPrototypeOf(value) !== Array.prototype || Reflect.ownKeys(value).length !== value.length + 1) return false;
  for (let i = 0; i < value.length; i++) {
    const descriptor = Object.getOwnPropertyDescriptor(value, String(i));
    if (!descriptor || !Object.hasOwn(descriptor, "value") || !descriptor.enumerable || !predicate(descriptor.value)) return false;
  }
  return true;
};
const fields = (value, names) => {
  requireValue(value && typeof value === "object" && Object.getPrototypeOf(value) === Object.prototype &&
    Reflect.ownKeys(value).length === names.length && names.every(name => Object.hasOwn(value, name) &&
      Object.hasOwn(Object.getOwnPropertyDescriptor(value, name), "value") &&
      Object.getOwnPropertyDescriptor(value, name).enumerable), "Missing, nonplain or unsupported quote fields");
};
const texts = (value, names) => requireValue(names.every(name => text(value[name])), "Missing quote context");
const nulls = (value, names) => requireValue(names.every(name => value[name] === null), "Schema1 cannot establish admission, billing or complete tax liability");
const sourceUrl = value => {
  if (typeof value !== "string") return false;
  try { const url = new URL(value); return url.protocol === "https:" && !url.username && !url.password && !url.search && !url.hash; }
  catch { return false; }
};
const equalMoney = (left, right) => Math.round(left * 100) === Math.round(right * 100);

export function validateCareQuote(quote, asOf = currentEasternDate()) {
  fields(quote, ["schema_version", "action_id", "observed_on", "evidence_class", "source", "task", "room", "price_basis", "care", "rejected_observation", "decision", "next_gate", "preservation"]);
  requireValue(quote.schema_version === 1 && quote.evidence_class === "BOOKING_CHECK", "Unsupported quote schema or evidence class");
  requireValue(validDate(asOf) && validDate(quote.observed_on) && quote.observed_on <= asOf, "Invalid date or future quote observation");
  texts(quote, ["action_id", "decision", "next_gate", "preservation"]);
  fields(quote.source, ["property_url", "booking_url", "method", "publication_date", "privacy"]);
  requireValue(sourceUrl(quote.source.property_url) && sourceUrl(quote.source.booking_url), "Use public HTTPS source URLs without credentials or session parameters");
  texts(quote.source, ["method", "privacy"]);
  requireValue(quote.source.publication_date === null || (validDate(quote.source.publication_date) && quote.source.publication_date <= quote.observed_on), "Invalid source publication date");
  const task = quote.task;
  fields(task, ["adults", "child_ages", "arrival", "departure", "nights", "requested_care_breaks", "minutes_per_break", "simultaneous_daytime_care_required", "flights_selected", "transfer_selected", "party_confirmation", "age_input_method"]);
  requireValue(Number.isInteger(task.adults) && task.adults > 0 && task.adults <= 10 && dense(task.child_ages, age) && task.child_ages.length > 0 && task.child_ages.length <= 10, "Invalid original quote party");
  requireValue(validDate(task.arrival) && validDate(task.departure) && task.departure > task.arrival && Number.isInteger(task.nights) && task.nights === days(task.departure, task.arrival), "Invalid stay or contradictory nights");
  requireValue(Number.isInteger(task.requested_care_breaks) && task.requested_care_breaks > 0 && Number.isInteger(task.minutes_per_break) && task.minutes_per_break > 0 && task.minutes_per_break <= 1440 && typeof task.simultaneous_daytime_care_required === "boolean" && task.flights_selected === false && task.transfer_selected === false, "Invalid care request or unsupported transport-inclusive quote");
  texts(task, ["party_confirmation", "age_input_method"]);
  fields(quote.room, ["property", "category", "room_count", "room_count_basis", "area_sq_ft", "balcony", "baby_bed", "sleeping_assignment", "final_party_acceptance"]);
  texts(quote.room, ["property", "category", "room_count_basis", "balcony", "baby_bed"]);
  requireValue(Number.isInteger(quote.room.room_count) && quote.room.room_count > 0 && quote.room.room_count <= 10 && Number.isFinite(quote.room.area_sq_ft) && quote.room.area_sq_ft > 0, "Invalid selected room");
  nulls(quote.room, ["sleeping_assignment", "final_party_acceptance"]);
  const price = quote.price_basis;
  fields(price, ["displayed_currency_symbol", "currency", "currency_evidence", "unit", "rate_terms", "membership_fee_displayed", "membership_fee_treatment", "tax_fee_statement", "included_services", "before_care", "after_selected_care", "external_levy", "complete_all_currency_mandatory_total", "optional_roundtrip_transfer_displayed", "transfer_treatment"]);
  texts(price, ["displayed_currency_symbol", "currency_evidence", "unit", "rate_terms", "membership_fee_treatment", "tax_fee_statement", "transfer_treatment"]);
  requireValue(currency(price.currency) && money(price.membership_fee_displayed) && money(price.optional_roundtrip_transfer_displayed) && dense(price.included_services, text) && price.included_services.length > 0, "Invalid price currency, amounts or inclusions");
  nulls(price, ["complete_all_currency_mandatory_total"]);
  fields(price.before_care, ["initial_strikethrough_total", "displayed_discounts", "stay_total", "derived_package_per_night"]);
  fields(price.after_selected_care, ["stay_total", "derived_package_per_night", "additional_care_selection", "receipt_selection"]);
  for (const plan of [price.before_care, price.after_selected_care]) {
    requireValue(money(plan.stay_total) && money(plan.derived_package_per_night) && equalMoney(plan.stay_total / task.nights, plan.derived_package_per_night), "Contradictory nightly package equivalent");
  }
  requireValue(money(price.before_care.initial_strikethrough_total) && dense(price.before_care.displayed_discounts, money) && price.before_care.displayed_discounts.length > 0 && equalMoney(price.before_care.initial_strikethrough_total - price.before_care.displayed_discounts.reduce((sum, amount) => sum + amount, 0), price.before_care.stay_total), "Contradictory displayed discounts");
  requireValue(money(price.after_selected_care.additional_care_selection) && equalMoney(price.after_selected_care.stay_total - price.before_care.stay_total, price.after_selected_care.additional_care_selection) && text(price.after_selected_care.receipt_selection), "Contradictory selected-care delta");
  fields(price.external_levy, ["provider_label", "currency", "amount_per_person_displayed", "payment_channel_displayed", "applicable_person_count", "age_exemptions", "total", "interpretation"]);
  texts(price.external_levy, ["provider_label", "payment_channel_displayed", "interpretation"]);
  requireValue(currency(price.external_levy.currency) && money(price.external_levy.amount_per_person_displayed), "Invalid external levy basis");
  nulls(price.external_levy, ["applicable_person_count", "age_exemptions", "total"]);
  requireValue(dense(quote.care, item => item && typeof item === "object") && quote.care.length === task.child_ages.length, "Retain one selected care entry per original child");
  let addonCents = 0;
  for (let i = 0; i < quote.care.length; i++) {
    const care = quote.care[i];
    const common = ["service", "displayed_ages", "task_child_age", "included", "indicative_daytime_hours", "indicative_evening_hours", "closure_displayed", "three_breaks_confirmed"];
    const paid = Object.hasOwn(care, "selected_addon_amount");
    fields(care, [...common, ...(paid ? ["selected_addon_amount", "displayed_price_unit", "temporal_billing_unit", "billable_days", "minimum_package", "prorated_90_minute_price", "availability", "training_admission_terms", "parent_presence_terms"] : ["additional_selected_charge", "charge_basis"])]);
    requireValue(dense(care.displayed_ages, age) && care.displayed_ages.length === 2 && care.displayed_ages[1] >= care.displayed_ages[0] && care.task_child_age === task.child_ages[i] && care.task_child_age >= care.displayed_ages[0] && care.task_child_age <= care.displayed_ages[1], "Contradictory original child or care age band");
    texts(care, ["service", "indicative_daytime_hours", "indicative_evening_hours", "closure_displayed"]);
    nulls(care, ["three_breaks_confirmed"]);
    if (paid) {
      requireValue(care.included === false && money(care.selected_addon_amount), "Invalid extra-care charge");
      texts(care, ["displayed_price_unit", "availability"]);
      nulls(care, ["temporal_billing_unit", "billable_days", "minimum_package", "prorated_90_minute_price", "training_admission_terms", "parent_presence_terms"]);
      addonCents += Math.round(care.selected_addon_amount * 100);
    } else {
      requireValue(care.included === true && care.additional_selected_charge === 0 && text(care.charge_basis), "Invalid included selection basis");
    }
  }
  requireValue(addonCents === Math.round(price.after_selected_care.additional_care_selection * 100), "Care entries do not match selected quote delta");
  fields(quote.rejected_observation, ["adult_only_total", "reason"]);
  requireValue(money(quote.rejected_observation.adult_only_total) && text(quote.rejected_observation.reason), "Invalid excluded observation");
  return quote;
}

export function careQuoteRoomCheck(quote, evidence, asOf = currentEasternDate()) {
  validateCareQuote(quote, asOf);
  if (evidence === null) return { status: "not-checked-no-room-rule", booking_acceptance: "unconfirmed", evidence: null };
  requireValue(!types.isProxy(evidence), "Proxied room evidence is unsupported");
  fields(evidence, ["schema_version", "evidence_class", "property", "category", "property_url", "source_record", "observed_on", "published_on", "published_max_guests", "baby_bed", "age_count_exception", "sleeping_assignment", "booking_acceptance"]);
  requireValue(evidence.schema_version === 1 && evidence.evidence_class === "OFFICIAL_PROPERTY_FACT", "Unsupported room evidence schema or class");
  texts(evidence, ["property", "category", "baby_bed"]);
  requireValue(evidence.property === quote.room.property && evidence.category === quote.room.category && sourceUrl(evidence.property_url) && evidence.property_url === quote.source.property_url, "Room evidence must match original property, category and source");
  requireValue(quote.room.room_count === 1, "Per-category guest maxima cannot screen multiple-room quotes");
  requireValue(typeof evidence.source_record === "string" && /^docs\/research\/[a-z0-9-]+\.(json|md)$/.test(evidence.source_record), "Use a public repository research reference");
  requireValue(validDate(evidence.observed_on) && evidence.observed_on <= asOf && (evidence.published_on === null || (validDate(evidence.published_on) && evidence.published_on <= evidence.observed_on)), "Invalid or future room evidence date");
  requireValue(Number.isInteger(evidence.published_max_guests) && evidence.published_max_guests > 0 && evidence.published_max_guests <= 30, "Invalid published guest maximum");
  nulls(evidence, ["age_count_exception", "sleeping_assignment", "booking_acceptance"]);
  const partyCount = quote.task.adults + quote.task.child_ages.length;
  const ageDays = days(asOf, evidence.observed_on);
  return {
    status: partyCount > evidence.published_max_guests ? "source-count-conflict-needs-age-category-resolution" : "within-published-count-not-booking-confirmation",
    booking_acceptance: "unconfirmed",
    party_count: partyCount,
    published_max_guests: evidence.published_max_guests,
    age_count_exception: "unknown-not-applied",
    observation_age_days: ageDays,
    review_status: ageDays >= 7 ? "weekly-room-rule-review-due-not-revalidated" : "dated-room-rule-not-current-confirmation",
    evidence: structuredClone(evidence)
  };
}

export function careQuoteComparison(quote, asOf = currentEasternDate(), roomEvidence = null) {
  validateCareQuote(quote, asOf);
  const ageDays = days(asOf, quote.observed_on);
  return {
    as_of: asOf,
    observation_age_days: ageDays,
    review_status: ageDays >= 7 ? "weekly-source-review-due-not-revalidated" : "dated-nonbinding-quote-not-current-confirmation",
    applicability: "original-party-category-stay-only-not-repriced",
    receipt: structuredClone(quote),
    room_capacity_check: careQuoteRoomCheck(quote, roomEvidence, asOf)
  };
}

const csvCell = value => {
  const plain = String(value ?? "Unknown").replaceAll(/[\r\n\t]+/g, " ");
  return `"${(/^\s*[=+\-@]/.test(plain) ? "'" + plain : plain).replaceAll('"', '""')}"`;
};

export function careQuoteCsv(quote, asOf = currentEasternDate(), roomEvidence = null) {
  const result = careQuoteComparison(quote, asOf, roomEvidence);
  const headings = ["Configuration", "Property", "Room category", "Currency", "Currency evidence", "Stay total", "Package per night", "Unit", "Observed on", "Screened on", "Review status", "Applicability", "Original task JSON", "Room evidence JSON", "Complete price basis JSON", "Care evidence JSON", "Source JSON", "Room count status", "Room capacity check JSON", "Full receipt JSON"];
  const rows = [
    ["Before optional care", quote.price_basis.before_care],
    ["After selected optional care", quote.price_basis.after_selected_care]
  ].map(([label, plan]) => [label, quote.room.property, quote.room.category, quote.price_basis.currency, quote.price_basis.currency_evidence, plan.stay_total, plan.derived_package_per_night, quote.price_basis.unit, quote.observed_on, asOf, result.review_status, result.applicability, JSON.stringify(quote.task), JSON.stringify(quote.room), JSON.stringify(quote.price_basis), JSON.stringify(quote.care), JSON.stringify(quote.source), result.room_capacity_check.status, JSON.stringify(result.room_capacity_check), JSON.stringify(result.receipt)]);
  return [headings, ...rows].map(row => row.map(csvCell).join(",")).join("\n") + "\n";
}

export function parseCareQuoteOptions(input) {
  requireValue(dense(input, text), "Invalid quote options");
  const [path, ...args] = input;
  requireValue(text(path) && !path.startsWith("--"), "Provide a quote JSON path");
  const options = new Map();
  for (let i = 0; i < args.length; i += 2) {
    requireValue(["--date", "--format", "--room-evidence"].includes(args[i]) && !options.has(args[i]) && text(args[i + 1]) && !args[i + 1].startsWith("--"), "Unknown, duplicate or incomplete quote option");
    options.set(args[i], args[i + 1]);
  }
  const date = options.get("--date") ?? currentEasternDate(), format = options.get("--format") ?? "json";
  requireValue(validDate(date) && ["json", "csv"].includes(format), "Invalid quote date or format");
  return { path, date, format, ...(options.has("--room-evidence") ? { roomEvidencePath: options.get("--room-evidence") } : {}) };
}

let cliEntry = false;
try {
  cliEntry = Boolean(process.argv[1]) && realpathSync(resolve(process.argv[1])) === realpathSync(fileURLToPath(import.meta.url));
} catch { /* A missing unrelated entry path must not break library imports. */ }

if (cliEntry) {
  try {
    const { path, date, format, roomEvidencePath } = parseCareQuoteOptions(process.argv.slice(2));
    const quote = JSON.parse(await readFile(path, "utf8"));
    const roomEvidence = roomEvidencePath ? JSON.parse(await readFile(roomEvidencePath, "utf8")) : null;
    process.stdout.write(format === "csv" ? careQuoteCsv(quote, date, roomEvidence) : JSON.stringify(careQuoteComparison(quote, date, roomEvidence), null, 2) + "\n");
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
