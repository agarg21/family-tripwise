import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { comparisonHeadings, roomComparisonCsv, roomComparisonsCsv } from "./family-room-comparison.mjs";

const read = name => readFileSync(new URL(`../docs/research/${name}`, import.meta.url), "utf8");
const pack = JSON.parse(read("washington-dc-room-configurations-2026-09-30.json"));
const prices = ["embassy", "homewood", "residence"].flatMap(name => JSON.parse(read(`washington-dc-${name}-price-observation-2026-09-30.json`)));
// Same narrow quoted-cell format as the comparison writer's existing tests.
const rows = csv => csv.trimEnd().split("\n").map(line => [...line.matchAll(/"((?:[^"]|"")*)"(?:,|$)/g)].map(match => match[1].replaceAll('""', '"')));
const value = (row, heading) => row[comparisonHeadings.indexOf(heading)];
const checkIndex = comparisonHeadings.indexOf("Next checks");
+test("Embassy policy amounts remain conditional while final budget stays unknown", () => {
  const evidence = JSON.parse(read("dc-embassy-policy-budget-2026-10-03.json"));
  assert.deepEqual(evidence.task.child_ages, [4, 8, 12]);
  assert.equal(evidence.task.car, false); assert.equal(evidence.task.pets, false);
  assert.equal(evidence.policy.early_checkout_fee.amount, 300);
  assert.equal(evidence.policy.late_checkout_fee.amount, 100);
  assert.equal(evidence.policy.optional_valet.unit, null);
  assert.equal(evidence.policy.optional_valet.included_in_no_car_task, false);
  assert.equal(evidence.policy.pet_fee_five_plus_nights.included_in_no_pet_task, false);
  for (const key of ["early_checkout_fee", "late_checkout_fee"]) {
    assert.equal(evidence.policy[key].included_in_unchanged_stay, false);
    assert.equal(evidence.policy[key].front_desk_coordination_required, true);
  }
  for (const key of ["payment_panel_fee_or_hold_amount", "mandatory_stay_fee", "sofa_setup_fee", "incidental_authorization_amount", "authorization_release_timing", "full_stay_total"])
    assert.equal(evidence.policy[key], null);
  assert.equal(evidence.meals.weekday_hours.closes, "10:00");
  assert.equal(evidence.meals.weekend_hours.closes, "10:30");
  assert.equal(evidence.meals.future_operation_confirmed, false);
  assert.equal(evidence.meals.full_dinner_included_established, false);
  assert.equal(evidence.meals.estimated_food_savings, null);
  assert.equal(evidence.preservation.room_and_price_observations_renewed, false);
  assert.equal(evidence.result.city_launch_approved, false); assert.equal(evidence.result.public_change, false);
});

test("dated Embassy policies travel with the original nightly and party basis", () => {
  const csv = roomComparisonCsv(pack, pack.scenario, "2026-10-03", prices);
  const embassy = rows(csv).slice(1).filter(row => value(row, "Hotel").startsWith("Embassy"));
  assert.deepEqual(embassy.map(row => value(row, "Nightly equivalent")), ["334.68", "408.14"]);
  for (const row of embassy) {
    assert.match(value(row, "Next checks"), /early checkout300USD\/late checkout100USD/);
    assert.match(value(row, "Next checks"), /Mandatory\/sofa fees and incidentals hold remain unknown/);
    assert.match(value(row, "Next checks"), /weekday06:30-10:00\/weekend06:30-10:30/);
    assert.match(value(row, "Next checks"), /official WMATA model/);
    assert.match(value(row, "Next checks"), /not prevalence/);
    assert.equal(value(row, "Category checked"), "2026-09-30");
    assert.equal(value(row, "Price observed"), "2026-09-30");
  }
  assert.equal(roomComparisonsCsv([pack], pack.scenario, "2026-10-03", prices), csv);
  const changed = rows(roomComparisonCsv(pack, {...pack.scenario, child_ages:[4,8,13]}, "2026-10-03", prices)).slice(1).find(row => value(row, "Hotel").startsWith("Embassy"));
  assert.equal(value(changed, "Nightly equivalent"), "");
  assert.match(value(changed, "Next checks"), /not added to unchanged stay/);
});
test("Homewood current selected reports retain category, date and privacy limits", () => {
  const evidence = JSON.parse(read("dc-homewood-current-review-signals-2026-10-03.json"));
  assert.equal(evidence.reports.length, 5);
  assert.equal(evidence.method.qualifying_reports, 5);
  assert.equal(evidence.method.two_queen_label_reports, 2);
  assert.equal(evidence.method.exact_standard_category_reports, 0);
  assert.equal(evidence.method.party_match_reports, 0);
  assert.equal(evidence.method.complete_current_corpus, false);
  assert.equal(evidence.method.independent_authenticity_verified, false);
  assert.equal(evidence.reports.filter(r => r.translated).length, 2);
  for (const r of evidence.reports) {
    assert.ok(r.posted_on >= "2026-04-01" && r.posted_on <= "2026-10-03");
    assert.ok(r.stay_month >= "2026-04" && r.stay_month <= "2026-10");
    assert.equal(r.trip_type, "Family"); assert.equal(r.party_basis, null);
    assert.equal(r.exact_standard_match, false);
    assert.deepEqual(Object.keys(r).sort(), ["id","locator","posted_on","stay_month","category_label","translated","signal","source_id","trip_type","party_basis","exact_standard_match"].sort());
  }
  for (const k of ["prevalence","exact_room_condition","sofa_dimensions","utensil_or_chair_quantity","actual_rest_minutes"]) assert.equal(evidence.interpretation[k], null);
  assert.equal(evidence.interpretation.historical_january2025_noise_utensil_signals_renewed, false);
  assert.equal(evidence.decision.public_change, false);
  assert.equal(evidence.decision.city_launch_approved, false);
  assert.equal(evidence.decision.paid_calls, 0);
  assert.equal(new URL(evidence.sources.trip.url).search, "");
});

test("Homewood current review checks retain single and joined dated budget context", () => {
  const csv = roomComparisonCsv(pack, pack.scenario, "2026-10-03", prices);
  assert.equal(roomComparisonsCsv([pack], pack.scenario, "2026-10-03", prices), csv);
  const homewood = rows(csv).slice(1).filter(r => value(r, "Hotel").startsWith("Homewood"));
  assert.deepEqual(homewood.map(r => value(r, "Nightly equivalent")), ["288.97","316.61","339.97"]);
  for (const r of homewood) {
    assertQuestions(r);
    assert.match(value(r, "Next checks"), /not prevalence or a five-person room verdict/);
    assert.match(value(r, "Next checks"), /not reconciled to standard THWN/);
    assert.equal(value(r, "Category checked"), "2026-09-30");
    assert.equal(value(r, "Price observed"), "2026-09-30");
  }
  const changed = rows(roomComparisonCsv(pack, {...pack.scenario, child_ages:[4,8,13]}, "2026-10-03", prices)).slice(1).find(r => value(r, "Hotel").startsWith("Homewood"));
  assert.equal(value(changed, "Nightly equivalent"), "");
  assert.match(value(changed, "Next checks"), /January2025.*remain historical/);
});

const assertQuestions = row => {
  assert.match(value(row, "Next checks"), /Confirm dining chair, utensil and place-setting quantities/);
  assert.match(value(row, "Next checks"), /does not establish five-person dining/);
  assert.match(value(row, "Next checks"), /Confirm sofa dimensions, deployment clearance/);
};

test("DC maintained checks and Hilton age correction retain historical price context", () => {
  const before = rows(read("washington-dc-comparison-task-2026-10-03.csv"));
  const after = rows(roomComparisonCsv(pack, pack.scenario, "2026-10-03", prices));
  assert.deepEqual(after[0], before[0]); assert.equal(after.length, 8);
  const hiltonChanges = ["Next checks", "Price status", "Engine party and age basis", "Observation limits", "Research scope and limits"].map(h => comparisonHeadings.indexOf(h));
  for (let i = 1; i < after.length; i++) {
    const current = after[i], prior = before[i];
    if (value(current, "Hotel").startsWith("Embassy")) {
      assert.match(value(current, "Next checks"), /property-level signals, not prevalence/);
      assert.equal(value(current, "Price status"), "dated-age-unresolved-count-samples");
      assert.match(value(current, "Observation limits"), /provider child band unknown/);
      assert.deepEqual(current.filter((_, index) => !hiltonChanges.includes(index)), prior.filter((_, index) => !hiltonChanges.includes(index)));
    } else if (value(current, "Hotel").startsWith("Residence")) {
      const scope = comparisonHeadings.indexOf("Research scope and limits");
      assert.deepEqual(current.filter((_, index) => index !== scope), prior.filter((_, index) => index !== scope));
      assert.equal(current[scope], prior[scope] + "; Cancellation deadline date check AFTER_RECORDED_LOCAL_DATE: recorded hotel-local date 2026-10-01; comparison date 2026-10-03; calendar dates only, no timezone conversion or current cancellability/availability guarantee; recheck current rate terms");
    } else if (!value(current, "Hotel").startsWith("Homewood")) assert.deepEqual(current, prior);
    else {
      assertQuestions(current);
      assert.equal(value(current, "Price status"), "dated-age-unresolved-count-samples");
      assert.match(value(current, "Observation limits"), /provider child band unknown/);
      assert.deepEqual(current.filter((_, index) => !hiltonChanges.includes(index)), prior.filter((_, index) => !hiltonChanges.includes(index)));
    }
  }
  assert.equal(pack.checked_on, "2026-09-30");
  assert.equal(pack.sources.homewood.checked_on, "2026-09-30");
  assert.equal(pack.records.find(record => record.id === "dc-homewood-two-queen").price.amount, null);
});

test("single, joined and kitchen-filter exports retain identical unresolved setup questions", () => {
  const single = roomComparisonCsv(pack, pack.scenario, "2026-10-03", prices);
  assert.equal(roomComparisonsCsv([pack], pack.scenario, "2026-10-03", prices), single);
  const filtered = rows(roomComparisonCsv(pack, pack.scenario, "2026-10-03", prices, { kitchen: "published" })).slice(1);
  assert.equal(filtered.length, 4);
  const homewood = filtered.filter(row => value(row, "Hotel").startsWith("Homewood"));
  assert.equal(homewood.length, 3); homewood.forEach(assertQuestions);
  assert.deepEqual(homewood.map(row => value(row, "Nightly equivalent")), ["288.97", "316.61", "339.97"]);
  assert.match(value(filtered.find(row => value(row, "Hotel").startsWith("Residence")), "Next checks"), /table seats4/);
});

test("setup questions do not renew stale sources or transfer dated prices to another party", () => {
  const stale = rows(roomComparisonCsv(pack, pack.scenario, "2026-10-31", prices)).slice(1).filter(row => value(row, "Hotel").startsWith("Homewood"));
  for (const row of stale) {
    assertQuestions(row); assert.equal(value(row, "Category checked"), "2026-09-30");
    assert.equal(value(row, "Price observed"), "2026-09-30");
    assert.equal(value(row, "Capacity screen"), "RECHECK_SOURCE");
    assert.equal(value(row, "Price status"), "historical-dated-age-unresolved-count-samples");
  }
  const otherParty = { ...pack.scenario, child_ages: [4, 8, 13] };
  const row = rows(roomComparisonCsv(pack, otherParty, "2026-10-03", prices)).slice(1).find(row => value(row, "Hotel").startsWith("Homewood"));
  assertQuestions(row); assert.equal(value(row, "Nightly equivalent"), ""); assert.equal(value(row, "Public rate plan"), "Unpriced");
});

test("Embassy selected review evidence retains dates, category and privacy limits", () => {
  const evidence = JSON.parse(read("dc-embassy-family-review-signals-2026-10-03.json"));
  assert.equal(evidence.method.qualifying_reports, 5);
  assert.equal(evidence.reports.length, 5);
  assert.equal(evidence.method.complete_current_corpus, false);
  assert.equal(evidence.method.exact_deluxe_category_reports, 0);
  assert.equal(evidence.method.party_match_reports, 0);
  assert.equal(evidence.reports.filter(report => report.translated).length, 4);
  for (const report of evidence.reports) {
    assert.equal(report.exact_deluxe_match, false);
    assert.ok(report.posted_on >= "2026-04-01" && report.posted_on <= "2026-10-03");
    assert.ok(report.stay_month >= "2026-04" && report.stay_month <= "2026-10");
    assert.deepEqual(Object.keys(report).sort(), ["id", "source_id", "locator", "posted_on", "stay_month", "trip_type", "category_label", "translated", "party_basis", "signal", "exact_deluxe_match"].sort());
  }
  assert.equal(evidence.interpretation.actual_museum_return_minutes, null);
  assert.equal(evidence.interpretation.prevalence, null);
  assert.equal(evidence.decision.city_launch_approved, false);
  assert.equal(evidence.decision.public_change, false);
  assert.equal(evidence.decision.paid_calls, 0);
  assert.match(evidence.excluded[0].reason, /conflicts/);
});

test("Embassy review questions survive single and joined CSV without renewing old facts", () => {
  const single = roomComparisonCsv(pack, pack.scenario, "2026-10-03", prices);
  assert.equal(roomComparisonsCsv([pack], pack.scenario, "2026-10-03", prices), single);
  const embassy = rows(single).slice(1).filter(row => value(row, "Hotel").startsWith("Embassy"));
  assert.equal(embassy.length, 2);
  for (const row of embassy) {
    assert.match(value(row, "Next checks"), /not reconciled to this Deluxe Double/);
    assert.equal(value(row, "Category checked"), "2026-09-30");
    assert.equal(value(row, "Price observed"), "2026-09-30");
  }
  const changed = rows(roomComparisonCsv(pack, {...pack.scenario, child_ages: [4, 8, 13]}, "2026-10-03", prices)).slice(1).find(row => value(row, "Hotel").startsWith("Embassy"));
  assert.equal(value(changed, "Nightly equivalent"), "");
  assert.match(value(changed, "Next checks"), /not prevalence/);
});

test("named Embassy model preserves independently requested legs and rest unknowns", () => {
  const evidence = JSON.parse(read("dc-embassy-museum-return-task-2026-10-03.json"));
  assert.equal(evidence.planner_inputs.travel_date, "2026-11-10");
  assert.deepEqual(evidence.legs.map(leg => leg.departure), ["13:00", "15:00"]);
  assert.deepEqual(evidence.legs.map(leg => leg.mode), ["walking-only", "walking-only"]);
  assert.equal(evidence.model_summary.reverse_independently_requested, true);
  assert.equal(evidence.legs.reduce((sum, leg) => sum + leg.displayed_duration_minutes, 0), 36);
  assert.equal(evidence.model_summary.combined_stated_minutes, 36);
  assert.equal(evidence.legs.reduce((sum, leg) => sum + leg.displayed_clock_difference_minutes, 0), 34);
  assert.equal(evidence.model_summary.combined_clock_difference_minutes, 34);
  for (const leg of evidence.legs) assert.equal(leg.fare_amount, null);
  for (const field of ["room_rest_minutes", "desired_rest_minutes", "entry_wait_minutes", "child_pace_minutes", "door_to_room_minutes", "complete_day_budget", "hotel_winner"])
    assert.equal(evidence.model_summary[field], null);
  assert.equal(evidence.model_summary.actual_hotel_return_feasibility, "UNKNOWN");
  assert.equal(evidence.model_summary.route_stroller_safety_assessed, false);
  assert.equal(evidence.model_summary.future_operation_confirmed, false);
  assert.equal(evidence.decision.city_launch_approved, false);
  assert.equal(evidence.decision.public_change, false);
  assert.equal(evidence.planner_inputs.user_location_shared, false);
  assert.doesNotMatch(JSON.stringify(evidence), /searchOriginLat|activeItinerary|searchDestinationLat|access_token|refresh_token/i);
});

test("shared Embassy checks expose model limits without changing dated budget values", () => {
  const csv = roomComparisonCsv(pack, pack.scenario, "2026-10-03", prices);
  const embassy = rows(csv).slice(1).filter(row => value(row, "Hotel").startsWith("Embassy"));
  for (const row of embassy) {
    assert.match(value(row, "Next checks"), /official WMATA model/);
    assert.match(value(row, "Next checks"), /not child-paced, stroller-tested or door-to-room/);
    assert.match(value(row, "Next checks"), /queue\/rest unknown/);
    assert.match(value(row, "Next checks"), /property-level signals, not prevalence/);
    assert.equal(value(row, "Category checked"), "2026-09-30");
    assert.equal(value(row, "Price observed"), "2026-09-30");
  }
  assert.equal(roomComparisonsCsv([pack], pack.scenario, "2026-10-03", prices), csv);
});
