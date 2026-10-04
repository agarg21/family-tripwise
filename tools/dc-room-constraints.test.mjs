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
const assertQuestions = row => {
  assert.match(value(row, "Next checks"), /Confirm dining chair, utensil and place-setting quantities/);
  assert.match(value(row, "Next checks"), /does not establish five-person dining/);
  assert.match(value(row, "Next checks"), /Confirm sofa dimensions, deployment clearance/);
};

test("DC maintained checks change only Homewood and Embassy questions, not historical output basis", () => {
  const before = rows(read("washington-dc-comparison-task-2026-10-03.csv"));
  const after = rows(roomComparisonCsv(pack, pack.scenario, "2026-10-03", prices));
  assert.deepEqual(after[0], before[0]); assert.equal(after.length, 8);
  for (let i = 1; i < after.length; i++) {
    const current = after[i], prior = before[i];
    if (value(current, "Hotel").startsWith("Embassy")) {
      assert.match(value(current, "Next checks"), /property-level signals, not prevalence/);
      assert.deepEqual(current.filter((_, index) => index !== checkIndex), prior.filter((_, index) => index !== checkIndex));
    } else if (!value(current, "Hotel").startsWith("Homewood")) assert.deepEqual(current, prior);
    else {
      assertQuestions(current);
      assert.deepEqual(current.filter((_, index) => index !== checkIndex), prior.filter((_, index) => index !== checkIndex));
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
    assert.equal(value(row, "Price status"), "historical-dated-stay-samples");
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
