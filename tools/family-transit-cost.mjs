import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { validDate } from "./hotel-evidence.mjs";
import { currentEasternDate } from "./family-room-task.mjs";

const plain = value => value && Object.getPrototypeOf(value) === Object.prototype &&
  Reflect.ownKeys(value).every(key => typeof key === "string" &&
    Object.hasOwn(Object.getOwnPropertyDescriptor(value, key), "value"));
const integer = (value, low, high) => Number.isInteger(value) && value >= low && value <= high;
const periods = ["weekday-day", "weekday-late", "weekend"];
const denseAges = ages => {
  if (!Array.isArray(ages) || Object.getPrototypeOf(ages) !== Array.prototype ||
      Reflect.ownKeys(ages).some(key => key !== "length" && !/^(0|[1-9][0-9]*)$/.test(String(key))) ||
      ages.length > 30) return false;
  for (let i = 0; i < ages.length; i++) {
    const field = Object.getOwnPropertyDescriptor(ages, i);
    if (!field || !Object.hasOwn(field, "value") || !integer(field.value, 0, 17)) return false;
  }
  return true;
};

export function assessFamilyTransit(policy, inputs, asOf = currentEasternDate()) {
  if (!plain(policy) || policy.schema_version !== 1 || policy.currency !== "USD" ||
      !integer(policy.refresh_days, 1, 365) || !integer(policy.free_child_age_lt, 1, 18) ||
      !integer(policy.free_children_per_paying_adult, 1, 10) || !plain(policy.source) ||
      !validDate(policy.source.inspected_on) || !validDate(asOf) || asOf < policy.source.inspected_on ||
      policy.source.evidence_class !== "OFFICIAL_TRANSIT_FARE_FACT" ||
      policy.source.status !== "body-inspected" || typeof policy.source.url !== "string")
    throw new Error("Invalid maintained fare policy or date");
  for (const key of ["published_on", "effective_on"])
    if (policy.source[key] !== null && (!validDate(policy.source[key]) ||
        policy.source[key] > policy.source.inspected_on)) throw new Error("Invalid source date basis");
  const url = new URL(policy.source.url);
  if (url.protocol !== "https:" || url.username || url.password || url.search || url.hash)
    throw new Error("Unsafe fare source URL");
  if (!plain(policy.rail_fare_bands) ||
      Reflect.ownKeys(policy.rail_fare_bands).length !== periods.length ||
      Reflect.ownKeys(policy.rail_fare_bands).some(key => !periods.includes(key))) throw new Error("Invalid rail fare periods");
  for (const period of periods) {
    const band = policy.rail_fare_bands[period];
    if (!plain(band) || !integer(band.minimum_cents, 1, 100000) ||
        !integer(band.maximum_cents, band.minimum_cents, 100000)) throw new Error("Invalid fare band");
  }
  if (!plain(inputs) || Reflect.ownKeys(inputs).some(key =>
      !["adults", "child_ages", "rail_trips", "fare_period", "one_way_fare_cents", "fare_product"].includes(key)) ||
      !integer(inputs.adults, 1, 20) || !denseAges(inputs.child_ages) ||
      !periods.includes(inputs.fare_period) || inputs.fare_product !== "regular-pay-as-you-go" ||
      (inputs.rail_trips !== null && !integer(inputs.rail_trips, 1, 100))) throw new Error("Invalid ordinary family fare inputs");
  const band = policy.rail_fare_bands[inputs.fare_period];
  if (inputs.one_way_fare_cents !== null &&
      !integer(inputs.one_way_fare_cents, band.minimum_cents, band.maximum_cents))
    throw new Error("Hypothetical fare must be explicit null or integer cents within the published band");
  const young = inputs.child_ages.filter(age => age < policy.free_child_age_lt).length;
  const free = Math.min(young, inputs.adults * policy.free_children_per_paying_adult);
  // The maintained body does not establish how excess under-age children are charged.
  const unresolved = young - free;
  const knownRegular = inputs.adults + inputs.child_ages.length - young;
  const paying = unresolved ? null : knownRegular;
  const ageDays = (Date.parse(asOf) - Date.parse(policy.source.inspected_on)) / 86400000;
  const stale = ageDays > policy.refresh_days;
  const computable = !stale && paying !== null && inputs.rail_trips !== null;
  const minimum = computable ? paying * inputs.rail_trips * (inputs.one_way_fare_cents ?? band.minimum_cents) / 100 : null;
  const maximum = computable ? paying * inputs.rail_trips * (inputs.one_way_fare_cents ?? band.maximum_cents) / 100 : null;
  return {
    assessed_on: asOf, inspected_on: policy.source.inspected_on, source_url: policy.source.url,
    evidence_class: "MODEL_DERIVED_CONDITIONAL_FARE_ARITHMETIC",
    source_freshness: stale ? "RECHECK_SOURCE" : "dated-not-revalidated",
    currency: policy.currency, unit: "family/requested separately charged rail trips",
    party: { adults: inputs.adults, child_ages: [...inputs.child_ages] },
    fare_product: inputs.fare_product, fare_period: inputs.fare_period,
    free_children: free, unresolved_child_fares: unresolved,
    known_regular_riders: knownRegular, paying_riders: paying,
    rail_trips: inputs.rail_trips, user_supplied_one_way_fare_cents: inputs.one_way_fare_cents,
    minimum, maximum,
    estimate_status: stale ? "RECHECK_SOURCE" : !computable ? "UNKNOWN_INPUTS" :
      inputs.one_way_fare_cents === null ? "CONDITIONAL_NETWORK_BAND" : "CONDITIONAL_USER_FARE",
    actual_trip_cost: null, actual_route: null, hotel_return_feasible: "UNKNOWN",
    future_service_confirmed: false, stroller_safety_access_assessed: false,
    excluded_costs: ["Payment media acquisition", "Airport/regional/express bus charges", "Meals and hotel costs"],
    next_checks: ["Choose exact stations, travel date/time and payment products",
      "Check dated service and current station-specific fare",
      "Do not assume visiting children qualify for DC student/reduced programs",
      "Validate actual rest journeys, entry waits and any transfer or pass entitlement"],
    limitation: "Regular pay-as-you-go rail arithmetic only. Trips and any selected fare are hypothetical, not route observations. Network bands are not an exact local route quote. No bus/transfer/pass discount is applied; internal rail interchange is not another charged trip. Excess young-child fare and unknown trip counts are not zero. Source date is not policy-effective date or future operation assurance."
  };
}

async function main() {
  const [path, inputJson, date, ...extra] = process.argv.slice(2);
  if (!path || !inputJson || extra.length)
    throw new Error("Usage: node tools/family-transit-cost.mjs evidence.json '{family fare inputs}' [YYYY-MM-DD]");
  const evidence = JSON.parse(await readFile(path, "utf8"));
  process.stdout.write(JSON.stringify(assessFamilyTransit(evidence.policy, JSON.parse(inputJson),
    date ?? currentEasternDate()), null, 2) + "\n");
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url))
  main().catch(error => { console.error(error.message); process.exitCode = 1; });
