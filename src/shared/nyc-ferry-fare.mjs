const plain = value => value && Object.getPrototypeOf(value) === Object.prototype &&
  Reflect.ownKeys(value).every(key => typeof key === "string" && Object.hasOwn(Object.getOwnPropertyDescriptor(value, key), "value"));
const count = (value, max) => Number.isInteger(value) && value >= 1 && value <= max;
const rows = (value, length) => Array.isArray(value) && Object.getPrototypeOf(value) === Array.prototype &&
  value.length === length && Reflect.ownKeys(value).length === length + 1 &&
  Array.from({length}, (_, i) => Object.getOwnPropertyDescriptor(value, i)).every(d => d && Object.hasOwn(d, "value") && plain(d.value));
function stamp(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new TypeError("Use YYYY-MM-DD dates.");
  const date = Date.parse(`${value}T00:00:00Z`);
  if (!Number.isFinite(date) || new Date(date).toISOString().slice(0, 10) !== value) throw new RangeError("Invalid date.");
  return date;
}

export function assessNycFerryFare(record, input, asOf) {
  if (!plain(record) || record.schema_version !== 1 || record.action !== "FT-RES-181" ||
      record.evidence_class !== "OFFICIAL_CURRENT_PRICING_PANEL_WITH_DATED_NOTICE_AND_CONFLICTS" ||
      !plain(record.current_operator_panel) || !plain(record.transfers) || !rows(record.sources, 3) || !rows(record.conflicts, 2))
    throw new TypeError("Use the reviewed current NYC Ferry evidence record.");
  const panel = record.current_operator_panel, transfer = record.transfers;
  const sourceIds = ["operator-panel", "operator-notice", "nyc311"];
  const urls = ["https://www.ferry.nyc/ticketing-info/", "https://static.ferry.nyc/blog/fare-change/", "https://portal.311.nyc.gov/article/?kanumber=KA-02376"];
  if (record.checked_on !== "2026-10-19" || record.recheck_on !== "2026-11-02" ||
      panel.currency !== "USD" || panel.single_ticket_cents !== 500 || panel.ten_trip_pack_cents !== 3000 ||
      panel.unit !== "One standard rider, one-way single ticket" ||
      panel.fare_state !== "CURRENT_OPERATOR_PANEL_OBSERVED_NOT_CHECKOUT" || panel.observed_on !== record.checked_on ||
      panel.body_matches_dated_notice !== true || panel.checkout_observed !== false || panel.tax_fee_inclusion !== null ||
      panel.dated_service_or_boarding_confirmed !== false || typeof panel.currency_basis !== "string" || !panel.currency_basis ||
      transfer.one_way_minutes !== 120 || transfer.round_trip_free_transfer !== false || transfer.fare_is_round_trip !== false ||
      transfer.exact_route_or_connection_assessed !== false ||
      record.sources.some((s, i) => s.id !== sourceIds[i] || s.url !== urls[i] || s.inspected_on !== record.checked_on || s.status !== "body-inspected") ||
      record.sources[0].published_on !== null || record.sources[1].published_on !== "2026-09-28" ||
      record.sources[1].announced_effective_on !== record.checked_on || record.sources[2].published_on !== null ||
      typeof record.sources[2].retrieval_limit !== "string" || !record.sources[2].retrieval_limit ||
      record.conflicts.some((c, i) => c.source_id !== ["operator-panel", "nyc311"][i] ||
        c.single_ticket_cents !== [400, 450][i] || c.ten_trip_pack_cents !== [2750, 2900][i] ||
        typeof c.surface !== "string" || !c.surface || typeof c.treatment !== "string" || !c.treatment))
    throw new TypeError("Ferry tariff, provenance or conflict basis changed; requalification required.");
  const assessed = stamp(asOf), checked = stamp(record.checked_on), recheck = stamp(record.recheck_on);
  if (assessed < checked) throw new RangeError("Assessment cannot predate source inspection.");
  const keys = ["standard_fare_riders", "separately_charged_directions", "visit_date"];
  if (!plain(input) || Reflect.ownKeys(input).length !== keys.length || Reflect.ownKeys(input).some(k => !keys.includes(k)) ||
      !(input.standard_fare_riders === null || count(input.standard_fare_riders, 20)) ||
      !(input.separately_charged_directions === null || count(input.separately_charged_directions, 2)))
    throw new TypeError("Use known standard-fare riders1-20 (or null), charged directions1-2 (or null), and visit_date.");
  const visit = stamp(input.visit_date);
  if (visit < assessed) throw new RangeError("Visit cannot predate assessment.");
  const needsRecheck = assessed >= recheck || visit >= recheck;
  const unknown = input.standard_fare_riders === null || input.separately_charged_directions === null;
  return {
    status: needsRecheck ? "RECHECK_SOURCE" : unknown ? "UNKNOWN_INPUTS" : "CONDITIONAL_STANDARD_SINGLE_FARES",
    evidence_class: "CONDITIONAL_PUBLISHED_FARE_COMPONENT", assessed_on: asOf, inspected_on: record.checked_on,
    recheck_on: record.recheck_on, visit_date: input.visit_date, needs_recheck: needsRecheck,
    currency: panel.currency, currency_basis: panel.currency_basis, unit: "confirmed standard-fare riders/requested charged directions",
    standard_fare_riders: input.standard_fare_riders, separately_charged_directions: input.separately_charged_directions,
    single_ticket_cents: panel.single_ticket_cents,
    fare_component_cents: needsRecheck || unknown ? null : input.standard_fare_riders * input.separately_charged_directions * panel.single_ticket_cents,
    complete_checkout_total_cents: null, tax_fee_inclusion: null, cheapest_pass_total_cents: null,
    checkout_observed: false, future_service_confirmed: false, eligibility_assessed: false, route_stroller_or_safety_assessed: false,
    one_way_transfer_minutes: 120, free_round_trip_transfer: false,
    sources: record.sources.map((s, i) => ({id: s.id, url: s.url, inspected_on: s.inspected_on, published_on: s.published_on,
      announced_effective_on: i === 1 ? s.announced_effective_on : null, retrieval_limit: i === 2 ? s.retrieval_limit : null})),
    conflicts: record.conflicts.map(c => ({source_id: c.source_id, surface: c.surface, single_ticket_cents: c.single_ticket_cents,
      ten_trip_pack_cents: c.ten_trip_pack_cents, treatment: c.treatment})),
    limitation: "Fare components only, not a checkout, complete family cost, cheapest pass, payment or service promise. Rider count must already be known to require standard singles; this tool does not classify ages, heights, concessions or discounts. Exactly44-inch eligibility stays unresolved. One-way transfers do not make the return free. Operator legacy footer and municipal tables conflict with the inspected current main panel. No source-clock renewal or actual route/boarding assessment."
  };
}
