import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { validDate } from "./hotel-evidence.mjs";
import { currentEasternDate } from "./family-room-task.mjs";

export const restDurationFields = Object.freeze([
  "morning_visit_minutes", "outward_journey_minutes", "room_rest_minutes",
  "return_journey_minutes", "entry_wait_minutes", "afternoon_visit_minutes"
]);

function plain(value) {
  return value && Object.getPrototypeOf(value) === Object.prototype &&
    Reflect.ownKeys(value).every(key => typeof key === "string" &&
      Object.hasOwn(Object.getOwnPropertyDescriptor(value, key), "value"));
}

function clockMinutes(value) {
  if (value === null) return null;
  if (typeof value !== "string" || !/^([01]\d|2[0-3]):[0-5]\d$/.test(value))
    throw new Error("Schedule requires HH:MM or explicit null");
  const [hours, minutes] = value.split(":").map(Number);
  return hours * 60 + minutes;
}

function denseObjects(values) {
  if (!Array.isArray(values) || Object.getPrototypeOf(values) !== Array.prototype ||
      Object.hasOwn(values, Symbol.iterator)) return false;
  for (let i = 0; i < values.length; i++)
    if (!Object.hasOwn(values, i) || !plain(values[i])) return false;
  return true;
}

export function assessMuseumRest(evidence, museumName, durations = {}, asOf = currentEasternDate()) {
  if (!validDate(asOf) || !plain(evidence) || evidence.schema_version !== 1 ||
      !validDate(evidence.inspected_on) || evidence.inspected_on > asOf ||
      !denseObjects(evidence.museum_constraints) || !denseObjects(evidence.sources) ||
      typeof museumName !== "string" || !museumName.trim()) throw new Error("Invalid maintained museum evidence or assessment date");
  if (!plain(durations) || Reflect.ownKeys(durations).some(key => !restDurationFields.includes(key)))
    throw new Error("Provide only named ordinary duration inputs");
  const inputs = Object.fromEntries(restDurationFields.map(key => [key, durations[key] ?? null]));
  for (const key of restDurationFields) {
    if (Object.hasOwn(durations, key) && durations[key] !== null &&
        (typeof durations[key] !== "number" || !Number.isFinite(durations[key]) ||
         durations[key] < 0 || durations[key] > 1440)) throw new Error(`Invalid duration: ${key}`);
  }
  const matches = evidence.museum_constraints.filter(row => row.museum === museumName);
  if (matches.length !== 1) throw new Error("Require one exact maintained museum, not a hotel or approximate name");
  const museum = matches[0];
  const sources = evidence.sources.filter(source => source.id === museum.source_id);
  if (sources.length !== 1) throw new Error("Require one owning source");
  const source = sources[0];
  if (!validDate(source.inspected_on) || source.inspected_on > asOf ||
      source.inspected_on > evidence.inspected_on || typeof source.url !== "string" ||
      !/^https:\/\//.test(source.url) || typeof source.evidence_class !== "string")
    throw new Error("Invalid source provenance");
  const opens = clockMinutes(museum.published_daily_open);
  const closes = clockMinutes(museum.published_daily_close);
  if (opens !== null && closes !== null && closes <= opens) throw new Error("Require a positive same-day published window");
  const supported = source.status === "body-inspected" && source.evidence_class === "OFFICIAL_VISITOR_FACT";
  if (!supported && (opens !== null || closes !== null)) throw new Error("Unavailable source cannot support schedule arithmetic");
  const window = opens === null || closes === null ? null : closes - opens;
  const missing = restDurationFields.filter(key => inputs[key] === null);
  const known = restDurationFields.reduce((sum, key) => sum + (inputs[key] ?? 0), 0);
  const complete = missing.length === 0;
  const total = complete ? known : null;
  const remaining = total !== null && window !== null ? window - total : null;
  const sourceAgeDays = (Date.parse(asOf) - Date.parse(source.inspected_on)) / 86400000;
  return {
    museum: museumName, assessed_on: asOf, inspected_on: source.inspected_on,
    source_url: source.url, source_class: source.evidence_class,
    source_freshness: sourceAgeDays > 30 ? "RECHECK_SOURCE" : "dated-not-revalidated",
    published_window_minutes: window,
    duration_basis: "user-supplied hypothetical minutes; not observed journeys or entry waits",
    durations: inputs, missing_durations: missing,
    known_component_minutes: known, total_required_minutes: total, remaining_window_minutes: remaining,
    time_budget_status: remaining === null ? "UNKNOWN" : remaining < 0 ? "exceeds-published-window" : "within-published-window-only",
    actual_hotel_return_feasibility: "UNKNOWN", hotel_winner: null,
    future_operation_confirmed: false, route_stroller_safety_assessed: false,
    limitation: "MODEL_DERIVED conditional arithmetic only. Published opening window is not usable visit time, dated-stay operation, entry/re-entry entitlement, a validated route, or family suitability. Unknown inputs are not zero; known-component sum is not a complete plan."
  };
}

async function main() {
  const [path, museumName, durationJson, date, ...extra] = process.argv.slice(2);
  if (!path || !museumName || !durationJson || extra.length) throw new Error("Usage: node tools/museum-rest-task.mjs evidence.json 'Exact museum' '{named duration inputs}' [YYYY-MM-DD]");
  const evidence = JSON.parse(await readFile(path, "utf8"));
  const durations = JSON.parse(durationJson);
  process.stdout.write(JSON.stringify(assessMuseumRest(evidence, museumName, durations, date ?? currentEasternDate()), null, 2) + "\n");
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url))
  main().catch(error => { console.error(error.message); process.exitCode = 1; });
