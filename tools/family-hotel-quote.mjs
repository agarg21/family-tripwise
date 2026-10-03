import { readFile } from "node:fs/promises";
import { realpathSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { types } from "node:util";
import { validDate } from "./hotel-evidence.mjs";
import { currentEasternDate } from "./family-room-task.mjs";

const requireValue = (condition, message) => { if (!condition) throw new Error(message); };
const text = value => typeof value === "string" && value.trim().length > 0;
const days = (later, earlier) => (Date.parse(later) - Date.parse(earlier)) / 86400000;
const cents = value => Math.round(value * 100);
const money = value => Number.isFinite(value) && value >= 0 && value <= 10000000 && Math.abs(value * 100 - cents(value)) < 0.000001;
const count = value => Number.isInteger(value) && value > 0 && value <= 30;
const fields = (value, names) => requireValue(value && !Array.isArray(value) && typeof value === "object" && Object.keys(value).length === names.length && names.every(name => Object.hasOwn(value, name)), "Missing or unsupported hotel quote fields");
const texts = (value, names) => requireValue(names.every(name => text(value[name])), "Missing hotel quote context");
const nulls = (value, names) => requireValue(names.every(name => value[name] === null), "Schema1 does not establish these booking conditions or complete fees");

// Validate descriptors before inspecting caller-controlled values or cloning the receipt.
function plainData(value, seen = new Set(), depth = 0, budget = { nodes: 0 }) {
  requireValue(++budget.nodes <= 10000 && depth <= 20, "Oversized hotel quote data");
  if (value === null || typeof value === "boolean" || (typeof value === "number" && Number.isFinite(value))) return;
  if (typeof value === "string") { requireValue(value.length <= 20000, "Oversized hotel quote text"); return; }
  requireValue(typeof value === "object" && !types.isProxy(value) && !seen.has(value), "Nonplain or cyclic hotel quote data");
  const array = Array.isArray(value);
  requireValue(Object.getPrototypeOf(value) === (array ? Array.prototype : Object.prototype), "Nonplain hotel quote data");
  seen.add(value);
  const keys = Reflect.ownKeys(value);
  if (array) {
    const length = Object.getOwnPropertyDescriptor(value, "length").value;
    requireValue(length <= 1000 && keys.length === length + 1 && Array.from({ length }, (_, i) => String(i)).every(key => Object.hasOwn(value, key)), "Sparse or extended hotel quote array");
  }
  for (const key of keys) {
    if (array && key === "length") continue;
    const descriptor = Object.getOwnPropertyDescriptor(value, key);
    requireValue(typeof key === "string" && Object.hasOwn(descriptor, "value") && descriptor.enumerable, "Accessor, symbol or hidden hotel quote data");
    plainData(descriptor.value, seen, depth + 1, budget);
  }
  seen.delete(value);
}

function sourceUrl(value, booking = false) {
  if (typeof value !== "string") return false;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.username || url.password || url.hash) return false;
    if (!booking) return !url.search;
    if (!url.search) return true;
    if (url.hostname !== "reservations.universalorlando.com") return false;
    const keys = new Set();
    for (const [key, val] of url.searchParams) {
      if (keys.has(key)) return false;
      keys.add(key);
      if (["hotelID", "currID", "rcID"].includes(key)) { if (!/^\d+$/.test(val)) return false; }
      else if (key === "lang") { if (!/^[a-z]{2}-[a-z]{2}$/i.test(val)) return false; }
      else if (["voucher", "access"].includes(key)) { if (val !== "") return false; }
      else return false;
    }
    return true;
  } catch { return false; }
}

export function validateHotelQuote(quote, asOf = currentEasternDate()) {
  plainData(quote);
  fields(quote, ["schema_version", "action_id", "observed_on", "evidence_class", "collection", "property", "room_category", "room_source_url", "booking_source_url", "task", "persisted_party", "currency", "room_facts_observed", "plans", "unresolved_budget", "park_notice_observed", "use"]);
  requireValue(quote.schema_version === 1 && quote.evidence_class === "BOOKING_CHECK", "Unsupported hotel quote schema or evidence class");
  requireValue(validDate(asOf) && validDate(quote.observed_on) && quote.observed_on <= asOf, "Invalid date or future hotel observation");
  texts(quote, ["action_id", "collection", "property", "room_category", "park_notice_observed"]);
  requireValue(sourceUrl(quote.room_source_url) && sourceUrl(quote.booking_source_url, true), "Unsafe or unsupported public source URL");
  const task = quote.task, party = quote.persisted_party;
  fields(task, ["rooms", "adults", "requested_child_ages", "arrival", "departure", "nights"]);
  requireValue(task.rooms === 1 && count(task.adults) && Array.isArray(task.requested_child_ages) && task.requested_child_ages.length > 0 && task.requested_child_ages.length <= 10 && task.requested_child_ages.every(age => Number.isInteger(age) && age >= 0 && age <= 17), "Invalid original family party");
  requireValue(validDate(task.arrival) && validDate(task.departure) && task.departure > task.arrival && task.nights === days(task.departure, task.arrival) && task.nights <= 31, "Invalid or contradictory original stay");
  fields(party, ["rooms", "adults", "children", "child_band_displayed", "individual_ages_entered", "individual_ages_verified", "basis"]);
  requireValue(party.rooms === task.rooms && party.adults === task.adults && party.children === task.requested_child_ages.length && party.child_band_displayed === "0 - 17 yrs" && party.individual_ages_entered === false && party.individual_ages_verified === null && text(party.basis), "Schema1 requires matching count-only party, not age-confirmed acceptance");
  fields(quote.currency, ["code_interpretation", "displayed_symbol", "explicit_iso_code_observed", "basis"]);
  requireValue(quote.currency.code_interpretation === "USD" && quote.currency.displayed_symbol === "$" && quote.currency.explicit_iso_code_observed === false && text(quote.currency.basis), "Schema1 retains interpreted USD, not an observed ISO code or conversion");
  fields(quote.room_facts_observed, ["maximum_occupancy", "area_sqft", "sleeping_places", "separation", "kitchenette", "basis"]);
  requireValue(count(quote.room_facts_observed.maximum_occupancy) && Number.isFinite(quote.room_facts_observed.area_sqft) && quote.room_facts_observed.area_sqft > 0, "Invalid dated room facts");
  texts(quote.room_facts_observed, ["sleeping_places", "separation", "kitchenette", "basis"]);
  requireValue(Array.isArray(quote.plans) && quote.plans.length > 0 && quote.plans.length <= 10, "Missing or excessive rate plans");
  const names = new Set();
  for (const plan of quote.plans) {
    fields(plan, ["name", "source_url", "unit", "nightly_before_displayed_tax", "average_before_displayed_tax", "room_subtotal", "displayed_taxes", "displayed_stay_total", "derived_average_with_displayed_tax", "inclusions", "offer_restrictions_observed", "minimum_stay", "booking_deadline", "deposit_terms", "cancellation_terms", "eligibility_limit"]);
    texts(plan, ["name", "inclusions", "offer_restrictions_observed", "eligibility_limit"]);
    requireValue(!names.has(plan.name) && sourceUrl(plan.source_url, true) && plan.unit === "per room per night", "Duplicate plan, unsafe source or unsupported unit");
    names.add(plan.name);
    requireValue(Array.isArray(plan.nightly_before_displayed_tax) && plan.nightly_before_displayed_tax.length === task.nights && plan.nightly_before_displayed_tax.every(value => money(value) && value > 0), "Retain one positive nightly rate per original stay night");
    requireValue(["average_before_displayed_tax", "room_subtotal", "displayed_taxes", "displayed_stay_total", "derived_average_with_displayed_tax"].every(key => money(plan[key])), "Invalid rate amounts");
    const subtotal = plan.nightly_before_displayed_tax.reduce((sum, value) => sum + cents(value), 0);
    requireValue(subtotal === cents(plan.room_subtotal) && cents(plan.room_subtotal) + cents(plan.displayed_taxes) === cents(plan.displayed_stay_total) && Math.round(subtotal / task.nights) === cents(plan.average_before_displayed_tax) && Math.round(cents(plan.displayed_stay_total) / task.nights) === cents(plan.derived_average_with_displayed_tax), "Contradictory nightly, tax or stay arithmetic");
    nulls(plan, ["minimum_stay", "booking_deadline", "deposit_terms", "cancellation_terms"]);
  }
  fields(quote.unresolved_budget, ["parking", "resort_fee", "meals", "tickets", "optional_extras", "final_all_fee_total"]);
  texts(quote.unresolved_budget, ["parking", "tickets"]);
  nulls(quote.unresolved_budget, ["resort_fee", "meals", "optional_extras", "final_all_fee_total"]);
  fields(quote.use, ["decision", "result", "source_recheck_due", "next_gate", "release_state", "public_model_changed", "prior_source_dates_renewed", "paid_api_calls"]);
  texts(quote.use, ["result", "next_gate", "release_state"]);
  requireValue(quote.use.decision === "CANDIDATE" && validDate(quote.use.source_recheck_due) && quote.use.source_recheck_due > quote.observed_on && days(quote.use.source_recheck_due, quote.observed_on) <= 14 && quote.use.public_model_changed === false && quote.use.prior_source_dates_renewed === false && quote.use.paid_api_calls === 0, "Invalid source recheck or unsupported publication/renewal state");
  return quote;
}

export function hotelQuoteComparison(quote, asOf = currentEasternDate()) {
  validateHotelQuote(quote, asOf);
  return {
    as_of: asOf,
    observation_age_days: days(asOf, quote.observed_on),
    source_recheck_due: quote.use.source_recheck_due,
    review_status: asOf >= quote.use.source_recheck_due ? "source-review-due-not-revalidated" : "dated-nonbinding-observation-not-current-quote",
    applicability: "original-count-only-party-category-stay-only-not-repriced",
    price_basis: "separate-dated-rate-plans-not-seasonal-range-or-complete-budget",
    room_count_status: quote.task.adults + quote.persisted_party.children > quote.room_facts_observed.maximum_occupancy ? "published-count-conflict-not-final-booking-decision" : "within-published-count-not-booking-acceptance",
    receipt: structuredClone(quote)
  };
}

const csvCell = value => {
  const plain = String(value ?? "Unknown");
  return `"${(/^[\s\u0000-\u0020]*[=+\-@]/.test(plain) ? "'" + plain : plain).replaceAll('"', '""')}"`;
};

export function hotelQuoteCsv(quote, asOf = currentEasternDate()) {
  const result = hotelQuoteComparison(quote, asOf), receipt = result.receipt;
  const headers = ["Plan", "Property", "Room category", "Currency interpretation", "Currency evidence JSON", "Unit", "Nightly before displayed tax JSON", "Average before displayed tax", "Average with displayed tax", "Room subtotal", "Displayed taxes", "Displayed stay total", "Observed on", "Screened on", "Source recheck due", "Review status", "Applicability", "Price basis", "Room count status", "Original task JSON", "Persisted party JSON", "Room facts JSON", "Plan context JSON", "Unresolved budget JSON", "Room source", "Booking source", "Plan source", "Full receipt JSON"];
  const rows = receipt.plans.map(plan => [plan.name, receipt.property, receipt.room_category, receipt.currency.code_interpretation, JSON.stringify(receipt.currency), plan.unit, JSON.stringify(plan.nightly_before_displayed_tax), plan.average_before_displayed_tax, plan.derived_average_with_displayed_tax, plan.room_subtotal, plan.displayed_taxes, plan.displayed_stay_total, receipt.observed_on, asOf, result.source_recheck_due, result.review_status, result.applicability, result.price_basis, result.room_count_status, JSON.stringify(receipt.task), JSON.stringify(receipt.persisted_party), JSON.stringify(receipt.room_facts_observed), JSON.stringify(plan), JSON.stringify(receipt.unresolved_budget), receipt.room_source_url, receipt.booking_source_url, plan.source_url, JSON.stringify(receipt)]);
  return [headers, ...rows].map(row => row.map(csvCell).join(",")).join("\n") + "\n";
}

export function parseHotelQuoteOptions(args) {
  plainData(args);
  requireValue(Array.isArray(args) && args.length > 0 && args.every(text) && !args[0].startsWith("--"), "Provide a hotel quote JSON path");
  const options = new Map();
  for (let i = 1; i < args.length; i += 2) {
    requireValue(["--date", "--format"].includes(args[i]) && !options.has(args[i]) && text(args[i + 1]) && !args[i + 1].startsWith("--"), "Unknown, duplicate or incomplete hotel quote option");
    options.set(args[i], args[i + 1]);
  }
  const date = options.get("--date") ?? currentEasternDate(), format = options.get("--format") ?? "json";
  requireValue(validDate(date) && ["json", "csv"].includes(format), "Invalid hotel quote date or format");
  return { path: args[0], date, format };
}

let cliEntry = false;
try {
  cliEntry = Boolean(process.argv[1]) && realpathSync(resolve(process.argv[1])) === realpathSync(fileURLToPath(import.meta.url));
} catch { /* A missing unrelated entry path must not break library imports. */ }

if (cliEntry) {
  try {
    const { path, date, format } = parseHotelQuoteOptions(process.argv.slice(2));
    const quote = JSON.parse(await readFile(path, "utf8"));
    process.stdout.write(format === "csv" ? hotelQuoteCsv(quote, date) : JSON.stringify(hotelQuoteComparison(quote, date), null, 2) + "\n");
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
