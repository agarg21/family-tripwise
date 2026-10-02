import test from "node:test";
import assert from "node:assert/strict";
import { stayPages, itineraryPages, teenPages, activityPages } from "./page-generation/upgrade-page-data.mjs";
import { planningPageEvidence, validatePlanningPageEvidence, planningPageQualityReport } from "./planning-page-evidence.mjs";

test("sixteen remaining models preserve exact comparisons, nested days and unknown dates", () => {
  const records = planningPageEvidence();
  assert.equal(records.length, 16);
  assert.deepEqual(validatePlanningPageEvidence(records), []);
  for (const page of records) {
    const model = ({ stay: stayPages, itinerary: itineraryPages, teen: teenPages, toddler: activityPages })[page.type][page.page_url.replace("https://familytripwise.com/", "")];
    assert.deepEqual(page.sections.find(section => section.name === "comparison").records.map(record => record.values), model.rows);
    if (model.dayPlans) assert.deepEqual(page.sections.find(section => section.name === "day-plans").records.map(record => record.values), model.dayPlans);
    for (const section of page.sections) for (const record of section.records) {
      assert.equal(record.source_mapping, "unmapped"); assert.equal(record.verified_on, null);
    }
  }
  const report = planningPageQualityReport(records, { today: "2026-10-01" });
  assert.equal(report.summary.missing_page_source_notes, 4);
  assert.equal(report.automatic_fact_renewal, false);
  assert.throws(() => planningPageQualityReport(records, { today: "2026-02-30" }));
});

test("copies cannot mutate native models; schema/provenance loss or promotion fails closed", () => {
  const original = planningPageEvidence();
  for (const mutate of [r => r.pop(), r => r.push(r[0]), r => r[0].private_data = "unexpected", r => r[0].sections[0].records.pop(), r => r[0].sections[0].records[0].verified_on = "2026-10-01", r => r[0].sections[0].records[0].values[0] = "changed"]) {
    const copy = structuredClone(original); mutate(copy); assert.ok(validatePlanningPageEvidence(copy).length);
    assert.deepEqual(planningPageEvidence(), original);
  }
});

test("adapters reject malformed nested blocks, tuple widths, sources and identity collisions", () => {
  for (const mutate of [m => m.stay["where-to-stay/san-diego-with-kids.html"].rows[0].pop(), m => m.itinerary["family-itinerary/chicago-with-kids.html"].dayPlans[0][2][0].push("extra"), m => m.stay["where-to-stay/las-vegas-with-kids.html"].sources[0][1] = "https://user:secret@example.com/", m => m.teen["things-to-do/chicago-with-teens.html"].rows.push(m.teen["things-to-do/chicago-with-teens.html"].rows[0])]) {
    const models = structuredClone({ stay: stayPages, itinerary: itineraryPages, teen: teenPages, toddler: activityPages });
    mutate(models); assert.throws(() => planningPageEvidence(models));
  }
});

test("missing indexed cells and undefined unknown keys cannot create false coverage", () => {
  for (const mutate of [m => delete m.stay["where-to-stay/san-diego-with-kids.html"].rows[0][1], m => delete m.itinerary["family-itinerary/chicago-with-kids.html"].dayPlans[0][2][0][1], m => delete m.stay["where-to-stay/san-diego-with-kids.html"].rows[1], m => delete m.teen["things-to-do/chicago-with-teens.html"].officialChecks[0][2][0]]) {
    const models = structuredClone({ stay: stayPages, itinerary: itineraryPages, teen: teenPages, toddler: activityPages });
    mutate(models); assert.throws(() => planningPageEvidence(models));
  }
  for (const mutate of [r => r[0].unexpected = undefined, r => r[0].sections[0].records[0].unexpected = undefined, r => delete r[1]]) {
    const records = planningPageEvidence(); mutate(records); assert.ok(validatePlanningPageEvidence(records).length);
  }
});
