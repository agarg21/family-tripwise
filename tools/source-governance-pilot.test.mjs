import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const report=JSON.parse(readFileSync(new URL('../docs/research/source-governance-pilot-2026-10-14.json',import.meta.url))),watch=JSON.parse(readFileSync(new URL('../ops/evidence-watch.json',import.meta.url)));
test('pure: dated governance evidence accounts for exact pilot sources and current collector identity',()=>{
  assert.equal(report.action_id,'FT-RES-163');assert.equal(report.observed_on,'2026-10-14');assert.equal(report.collector_product_token,'FamilyTripwiseEvidenceAudit');assert.equal(report.sources.length,6);assert.equal(new Set(report.sources.map(s=>s.url)).size,6);assert.equal(report.unique_policy_urls,6);assert.equal(report.tool_url_operations,10);assert.equal(report.underlying_http_request_count,null);
  assert.deepEqual(report.pilot_decisions.map(p=>p.source_url),['https://thedana.com/san-diego-hotel/faq/','https://thedana.com/san-diego-accommodations/','https://garfieldconservatory.org/visit/']);for(const p of report.pilot_decisions){assert.ok(watch.records.some(r=>r.source_urls?.includes(p.source_url)));assert.equal(p.source_language,'en');assert.ok(new URL(p.source_url).protocol==='https:');}
});
test('pure: tool-inaccessible robots is not HTTP404 a matching group or a discovered disallow rule',()=>{
  for(const id of ['dana-robots','garfield-robots']){const s=report.sources.find(s=>s.id===id);assert.equal(s.result,'tool-inaccessible-unknown-http');assert.equal(s.reported_http_status,null);assert.equal(s.native_http_status,null);assert.equal(s.rule_groups,null);assert.equal(s.matched_group,null);assert.equal(s.path_verdict,'UNKNOWN');assert.equal(s.retry_authorized,false);assert.equal(s.excerpt_retained,null);}
  const home=report.sources.find(s=>s.id==='garfield-home-policy-discovery');assert.equal(home.reported_http_status,403);assert.equal(home.native_http_status,null);assert.equal(home.retry_authorized,false);assert.ok(!report.sources.some(s=>s.url==='https://garfieldconservatory.org/visit/'));
});
test('pure: reachable privacy reading is neither automation permission nor a dated retention license',()=>{
  const p=report.sources.find(s=>s.id==='dana-privacy');assert.equal(p.automation_permission,'NOT_ESTABLISHED');assert.equal(p.content_retention_permission,'NOT_ESTABLISHED');assert.equal(p.terms_of_use_reference,true);assert.equal(p.separate_terms_inspected,false);assert.equal(p.published_on,null);assert.deepEqual(p.reader_crawl_labels,['last month','today']);assert.equal(report.legal_permission_assessed,false);
});
test('pure: three live holds retain exact owner gate and conditional next check without generic project stop',()=>{
  for(const p of report.pilot_decisions){assert.equal(p.decision,'HOLD_LIVE_AUTOMATED_PILOT');assert.equal(p.scope_approved,false);assert.equal(p.retry_authorized,false);assert.equal(p.robots_group,'UNKNOWN');assert.equal(p.path_verdict,'UNKNOWN');assert.equal(p.automation_permission,'UNKNOWN');assert.equal(p.source_authorized_retention,'UNKNOWN');for(const key of ['owner','affected_gate','unblock_condition','next_check'])assert.ok(typeof p[key]==='string'&&p[key].length>20);assert.ok(readFileSync(new URL('../'+p.prior_fact_evidence,import.meta.url)).length>0);}
  assert.equal(report.research_disposition.result,'CANDIDATE_IMPLEMENT_NOW');assert.match(report.research_disposition.candidate,/before fetch/);assert.match(report.research_disposition.remaining_live_gate,/remain held/);
});
test('pure: policy research never renews public facts emits live scope or claims actual collector requests',()=>{
  for(const key of ['native_collector_requests','pilot_fact_page_requests','paid_calls','llm_calls'])assert.equal(report[key],0);for(const key of ['raw_policy_bodies_retained','review_bodies_or_identities_retained','source_fact_dates_renewed','weekly_baseline_advanced','machine_approved_processing_scope_created'])assert.equal(report[key],false);assert.equal(report.maintainer_task.steps.length,7);assert.equal(report.maintainer_task.result,'LIVE_POLICY_GATE_RESOLVED_TO_HOLD; actual automated-source permission remains unproven');
});
test('pure: retained policy evidence is public-safe metadata/paraphrase with primary citations not raw archives',()=>{
  const all=JSON.stringify(report);assert.ok(!all.includes('source_text')&&!all.includes('raw_html')&&!all.includes('sk-proj-')&&!all.includes('BEGIN PRIVATE KEY'));for(const s of report.sources){const u=new URL(s.url);assert.equal(u.protocol,'https:');assert.equal(u.username,'');assert.equal(u.password,'');assert.ok(!u.search&&!u.hash);}assert.equal(report.sources.find(s=>s.id==='robots-standard').published_on,'2022-09');assert.equal(report.sources.find(s=>s.id==='dana-home-policy-discovery').policy_url,'https://thedana.com/privacy-policy/');
});
