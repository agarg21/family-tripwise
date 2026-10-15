const plain = value => value && Object.getPrototypeOf(value) === Object.prototype &&
  Reflect.ownKeys(value).every(key => typeof key === "string" && Object.hasOwn(Object.getOwnPropertyDescriptor(value, key), "value"));
const integer = (value, min, max) => Number.isInteger(value) && value >= min && value <= max;
function stamp(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new TypeError("Use YYYY-MM-DD dates.");
  const date = Date.parse(`${value}T00:00:00Z`);
  if (!Number.isFinite(date) || new Date(date).toISOString().slice(0, 10) !== value) throw new RangeError("Invalid date.");
  return date;
}
function heights(values) {
  if (!Array.isArray(values) || Object.getPrototypeOf(values) !== Array.prototype || values.length > 20 ||
      Reflect.ownKeys(values).some(key => key !== "length" && !/^(0|[1-9][0-9]*)$/.test(String(key)))) return false;
  for (let i = 0; i < values.length; i++) {
    const field = Object.getOwnPropertyDescriptor(values, i);
    if (!field || !Object.hasOwn(field, "value") || !(field.value === null ||
        typeof field.value === "number" && Number.isFinite(field.value) && field.value > 0 && field.value <= 96)) return false;
  }
  return true;
}

export function assessNycChildFare(policy, input, asOf) {
  if (!plain(policy) || policy.schema_version !== 1 || policy.kind !== "nyc-child-height" ||
      policy.currency !== "USD" || policy.fare_cents !== 300 || policy.threshold_inches !== 44 ||
      policy.free_children_per_paying_adult !== 3 || policy.threshold_conflict !== true ||
      !plain(policy.visitor_source) || !plain(policy.tariff_source) ||
      policy.visitor_source.url !== "https://www.mta.info/fares-tolls/subway-bus" || policy.visitor_source.height_comparison !== "lt" ||
      policy.tariff_source.url !== "https://www.mta.info/document/195636" || policy.tariff_source.height_comparison !== "lte" ||
      policy.tariff_source.effective_on !== "2026-01-04") throw new TypeError("NYC fare conflict basis changed; requalification required.");
  const checked = stamp(policy.inspected_on), recheck = stamp(policy.recheck_on), assessed = stamp(asOf);
  if (recheck <= checked || assessed < checked || stamp(policy.tariff_source.effective_on) > checked)
    throw new RangeError("Invalid source review window.");
  const keys = ["fare_paying_adults", "child_heights_inches", "separately_charged_trips", "travel_together", "visit_date"];
  if (!plain(input) || Reflect.ownKeys(input).length !== keys.length || Reflect.ownKeys(input).some(key => !keys.includes(key)) ||
      !integer(input.fare_paying_adults, 1, 10) || !heights(input.child_heights_inches) || input.travel_together !== true ||
      !(input.separately_charged_trips === null || integer(input.separately_charged_trips, 1, 100)))
    throw new TypeError("Use explicit paying-adult count, child heights (or null), chargeable trips (or null), date and traveling-together assumption.");
  const visit = stamp(input.visit_date);
  if (visit < assessed) throw new RangeError("Visit cannot predate assessment.");
  const classes = input.child_heights_inches.map(height => height === null ? "height-unknown" :
    height === policy.threshold_inches ? "boundary-conflict" : height < policy.threshold_inches ? "below-both-thresholds" : "above-both-thresholds");
  const below = classes.filter(value => value === "below-both-thresholds").length;
  const free = Math.min(below, input.fare_paying_adults * policy.free_children_per_paying_adult);
  const excess = below - free;
  const unresolved = excess + classes.filter(value => value === "height-unknown" || value === "boundary-conflict").length;
  const regular = input.fare_paying_adults + classes.filter(value => value === "above-both-thresholds").length;
  const needsRecheck = assessed >= recheck || visit >= recheck;
  const perTrip = needsRecheck || unresolved ? null : regular * policy.fare_cents;
  const total = perTrip === null || input.separately_charged_trips === null ? null : perTrip * input.separately_charged_trips;
  return {
    evidence_class: "CONDITIONAL_PUBLISHED_FARE_ARITHMETIC", assessed_on: asOf, inspected_on: policy.inspected_on,
    recheck_on: policy.recheck_on, visit_date: input.visit_date, needs_recheck: needsRecheck,
    currency: policy.currency, unit: "family/requested separately charged subway-or-local-bus trips",
    fare_paying_adults: input.fare_paying_adults, child_heights_inches: [...input.child_heights_inches], child_classifications: classes,
    free_children_within_published_allowance: free, excess_below_threshold_children: excess,
    unresolved_child_fares: unresolved, known_regular_riders: regular, paying_riders: unresolved ? null : regular,
    separately_charged_trips: input.separately_charged_trips, family_fare_per_trip_cents: perTrip, family_total_cents: total,
    status: needsRecheck ? "RECHECK_SOURCE" : unresolved ? "UNRESOLVED_CHILD_FARE" :
      input.separately_charged_trips === null ? "UNKNOWN_TRIP_COUNT" : "CONDITIONAL_UNCAPPED_FARE",
    boundary_conflict: {inches:44, visitor_rule:"under 44", tariff_definition:"44 and under", resolution:"operator-clarification-required"},
    source_urls: [policy.visitor_source.url, policy.tariff_source.url],
    actual_trip_cost: null, capped_total_cents: null, future_service_confirmed: false, stroller_or_safety_assessed: false,
    exclusions: ["Fare caps, passes and transfer entitlement", "Payment-media purchase and setup", "Express bus, airport, ferry and commuter-rail fares", "Student, reduced-fare and other eligibility programs"],
    limitation: "Standard uncapped fare arithmetic under an explicit accompanied-together assumption, not a checkout, actual route, cheapest fare, payment or future-service promise. Age is not substituted for height. Exactly44in and excess-child charges stay unresolved; no guessed precedence or child-specific allocation. Separately charged journeys are not vehicle changes or every tap."
  };
}
