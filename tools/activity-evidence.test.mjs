import test from "node:test";
import assert from "node:assert/strict";
import { activityPages } from "./page-generation/upgrade-page-data.mjs";
import { activityEvidence, vegasActivityEvidence, validateActivityEvidence } from "./activity-evidence.mjs";

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

test("Vegas adapter retains every original cost, fee, age, source, confidence and date without parsing prices", () => {
  const before = JSON.stringify(activityPages);
  const page = activityPages["things-to-do/las-vegas-with-kids.html"];
  const records = vegasActivityEvidence();
  assert.equal(records.length, 12);
  assert.deepEqual(validateActivityEvidence([...activityEvidence(), ...records]), []);
  for (const [i,r] of records.entries()) {
    const old = page.costFrictionIndex[i], cost = r.fields.ticket_cost.value;
    assert.equal(r.name, old.name);
    assert.equal(r.source_note, old.evidenceClass);
    assert.equal(r.unknowns, old.unknowns);
    assert.deepEqual(r.fields.venue.value, {area:old.zone,setting:old.setting});
    assert.equal(r.fields.duration.value, old.timeEstimate);
    assert.equal(r.fields.access_check.value, old.currentCheck);
    assert.equal(cost.planning_label, old.familyAdmissionEstimate);
    assert.equal(cost.cost_basis, old.costBasis);
    assert.equal(cost.inclusions, old.inclusions);
    assert.equal(cost.exclusions, old.exclusions);
    assert.equal(cost.retained_evidence_class, old.evidenceClass);
    assert.equal(cost.retained_confidence, old.confidence);
    assert.equal(cost.party_basis, page.comparisonNote);
    assert.ok([cost.amount,cost.currency,cost.unit,cost.visit_basis].every(v=>v===null));
    assert.equal(r.fields.ticket_cost.evidence_class, "MIXED_RESEARCH");
    assert.equal(r.fields.weather, undefined);
    assert.equal(r.fields.transport_check, undefined);
    for(const f of Object.values(r.fields)) { assert.equal(f.retained_on, old.checked); assert.deepEqual(f.source_urls,[old.officialUrl]); }
  }
  const neon = records.find(r=>r.name==="Neon Museum");
  assert.match(neon.fields.ticket_cost.value.cost_basis, /age 6/);
  assert.equal(neon.fields.ticket_cost.value.planning_label, "VARIABLE / VERIFY");
  assert.match(records.find(r=>r.name.startsWith("Red Rock")).fields.ticket_cost.value.planning_label, /per vehicle/);
  records[0].fields.ticket_cost.value.exclusions="mutated";
  assert.equal(JSON.stringify(activityPages),before);
  assert.notEqual(vegasActivityEvidence()[0].fields.ticket_cost.value.exclusions,"mutated");
  assert.equal(activityEvidence().length,12);
});

test("Vegas schema refuses fabricated complete cost, unsupported fields, class changes and private sources", () => {
  for(const change of [
    r=>r[0].schema_version=1, r=>r[0].schema_version=3,
    r=>r[0].fields.ticket_cost.value.amount=0, r=>r[0].fields.ticket_cost.value.currency="USD",
    r=>r[0].fields.ticket_cost.value.unit="family/day", r=>r[0].fields.ticket_cost.value.visit_basis="2026-10-07",
    r=>r[0].fields.ticket_cost.value.party_basis=null, r=>delete r[0].fields.ticket_cost.value.exclusions,
    r=>r[0].fields.ticket_cost.value.retained_confidence="", r=>r[0].fields.weather=r[0].fields.duration,
    r=>r[0].fields.ticket_cost.evidence_class="OFFICIAL_PROPERTY_FACT", r=>r[0].fields.venue.retained_on="2026-02-30",
    r=>r[0].fields.duration.source_urls=["https://example.com/?token=secret"], r=>r[0].page_url="https://familytripwise.com/things-to-do/chicago-with-kids.html",
    r=>r.push(structuredClone(r[0]))
  ]) { const records=vegasActivityEvidence();change(records);assert.ok(validateActivityEvidence(records).length); }
  assert.deepEqual(vegasActivityEvidence({}), []);
});
