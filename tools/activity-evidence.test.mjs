import test from "node:test";
import assert from "node:assert/strict";
import { activityPages } from "./page-generation/upgrade-page-data.mjs";
import { activityEvidence, validateActivityEvidence } from "./activity-evidence.mjs";

test("twelve retained logistics records preserve every value, source and model date", () => {
  const before = JSON.stringify(activityPages);
  const records = activityEvidence();
  const original = activityPages["things-to-do/san-diego-with-kids.html"].logisticsIndex;
  assert.equal(records.length, 12);
  assert.deepEqual(validateActivityEvidence(records), []);
  for (const [index, record] of records.entries()) {
    const item = original[index];
    assert.equal(record.name, item.name);
    assert.equal(record.source_note, item.evidenceNote);
    assert.equal(record.unknowns, item.unknowns);
    assert.deepEqual(record.fields.venue.value, { area: item.area, setting: item.setting });
    assert.equal(record.fields.ticket_cost.value.planning_label, item.costEstimate);
    assert.equal(record.fields.ticket_cost.value.amount, null);
    assert.equal(record.fields.duration.value, item.timeEstimate);
    assert.equal(record.fields.weather.value, item.weatherRole);
    assert.equal(record.fields.access_check.value, item.currentCheck);
    assert.equal(record.fields.transport_check.value, item.transportPrompt);
    for (const field of Object.values(record.fields)) {
      assert.equal(field.retained_on, item.checked);
      assert.equal(field.date_basis, "source-model-baseline");
      assert.deepEqual(field.source_urls, [item.officialUrl]);
      assert.notEqual(field.evidence_class, "OFFICIAL_PROPERTY_FACT");
    }
  }
  records[0].fields.venue.value.area = "mutated";
  records[0].fields.ticket_cost.value.planning_label = "mutated";
  assert.equal(JSON.stringify(activityPages), before);
  assert.equal(activityEvidence()[0].fields.venue.value.area, original[0].area);
});

test("strict field and source schemas reject unknown properties, identity drift and private URL parameters", () => {
  const mutations = [
    (r) => { r[0].private_notes = "not accepted"; },
    (r) => { r[0].fields.extra = null; },
    (r) => { r[0].fields.venue.secret = "not accepted"; },
    (r) => { r[0].fields.venue.value.hidden = "not accepted"; },
    (r) => { r[0].fields.ticket_cost.value.amount = 0; },
    (r) => { r[0].fields.ticket_cost.value.party_basis = "2 adults"; },
    (r) => { r[0].fields.duration.evidence_class = "OFFICIAL_PROPERTY_FACT"; },
    (r) => { r[0].fields.weather.retained_on = "2026-02-30"; },
    (r) => { r[0].page_url = "https://other.example/attraction"; },
    (r) => { r[0].model_path = "../secret"; },
    (r) => { r.push(structuredClone(r[0])); }
  ];
  for (const change of mutations) { const records = activityEvidence(); change(records); assert.ok(validateActivityEvidence(records).length); }
  for (const url of ["https://example.com/?session=private", "https://example.com/#token=private", "https://name:password@example.com/", "http://example.com/", "https://example.com:8443/", "invalid"]) {
    const records = activityEvidence(); records[0].fields.venue.source_urls = [url];
    assert.ok(validateActivityEvidence(records).some((message) => message.includes("provenance")));
  }
  assert.ok(validateActivityEvidence(null).length);
});

test("only maintained logistics entries are mapped, never generic copied city placeholders", () => {
  assert.deepEqual(activityEvidence({ "things-to-do/other.html": {} }), []);
  const changed = structuredClone(activityPages);
  changed["things-to-do/san-diego-with-kids.html"].logisticsIndex[0].unknowns = "Different unresolved task";
  assert.equal(activityEvidence(changed)[0].unknowns, "Different unresolved task");
  assert.notEqual(activityEvidence()[0].unknowns, "Different unresolved task");
});
