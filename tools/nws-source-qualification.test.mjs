import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const report=JSON.parse(readFileSync(new URL('../docs/research/nws-source-qualification-2026-10-14.json',import.meta.url)));
test('pure: current primary documentation has explicit provenance without native access inference',()=>{
  assert.equal(report.action_id,'FT-RES-165');assert.equal(report.learning_id,'LRN-256');assert.equal(report.observed_on,'2026-10-14');
  assert.deepEqual(report.sources.map(s=>s.url),['https://www.weather.gov/documentation/services-web-api','https://www.weather.gov/disclaimer/','https://www.weather.gov/logorequest-faq']);
  for(const s of report.sources){assert.equal(s.checked_on,report.observed_on);assert.equal(s.native_http_status,null);assert.equal(s.document_published_on,null);assert.equal(s.result,'reader-available');}
  assert.equal(report.collection.explicit_document_opens,3);assert.equal(report.collection.underlying_http_requests,null);
});
test('pure: candidate does not claim live integration source permission for HTML or worldwide coverage',()=>{
  const v=report.scope_verdict;assert.equal(v.decision,'CANDIDATE_EXPLICIT_API_ADAPTER');
  for(const k of ['legal_assurance','native_endpoint_access_tested','robots_rules_inspected','old_html_governance_registry_approved'])assert.equal(v[k],false);
  assert.equal(v.html_scrape_permission,'NOT_ASSESSED');assert.match(v.coverage,/No non-US or universal coverage claim/);
  for(const k of ['owner','remaining_gate','next_eligible_run','stop_condition'])assert.ok(v[k].length>30);
});
test('pure: existing page owns weather decision with no public change selected',()=>{
  assert.equal(report.existing_fit.public_change_selected,false);
  const html=readFileSync(new URL('../'+report.existing_fit.page,import.meta.url),'utf8');
  assert.match(html,/forecast\.weather\.gov\/MapClick\.php/);assert.match(html,/weather/i);
});
test('pure: proposed schema remains unconfirmed and freshness is not weekly renewal',()=>{
  const p=report.proposed_adapter_contract;assert.equal(p.status,'DESIGN_NOT_IMPLEMENTED_OR_SCHEMA_CONFIRMED');
  assert.match(p.field_names,/not asserted NWS JSON property names/);assert.match(p.refresh,/weekly storage alone is rejected/i);
  assert.match(p.nulls,/unknown, not dry/);assert.match(p.authority,/predictions, not actual conditions/);assert.match(p.authority,/all-clear/);
  assert.equal(report.maintainer_task.proxy_only,true);assert.equal(report.maintainer_task.steps.length,7);
});
test('pure: no forecasts models paid work outreach or retained source bodies',()=>{
  for(const k of ['native_collector_requests','forecast_requests','api_specification_requests','llm_calls','paid_calls','source_owner_contacts'])assert.equal(report.collection[k],0);
  assert.equal(report.collection.bodies_or_personal_data_retained,false);assert.ok(Object.values(report.unchanged).every(x=>x===true));
  const text=JSON.stringify(report);for(const forbidden of ['raw_html','source_text','sk-proj-','BEGIN PRIVATE KEY'])assert.ok(!text.includes(forbidden));
  assert.ok(report.sources.every(s=>{const u=new URL(s.url);return u.protocol==='https:'&&!u.username&&!u.password&&!u.search&&!u.hash;}));
});
