import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const json = p => JSON.parse(readFileSync(new URL(`../${p}`, import.meta.url)));
const audit = json('docs/research/global-family-travel-scale-audit-2026-10-13.json');
const report = json(audit.current_offline_report);
const weekly = json(audit.retained_weekly.latest_review);

test('Scale audit reproduces current offline contracts without factual renewal', () => {
  for (const [k,v] of Object.entries(audit.current_offline_summary)) assert.equal(report.summary[k],v,k);
  assert.equal(report.automatic_fact_renewal,false);
  assert.equal(report.automatic_publication,false);
  assert.equal(audit.current_offline_inventory.network_calls,0);
  assert.equal(Object.values(audit.current_offline_inventory.source_states).reduce((a,b)=>a+b,0),507);
  assert.ok(audit.current_offline_inventory.source_urls > audit.current_offline_inventory.collector_limit);
});

test('Weekly deltas are source signals, not measured false positives or updated claims', () => {
  for (const k of ['canonical_pages','sources','comparable_retrieved_sources','changed_sources','carried_denials','collection_gaps','due_or_unknown_fields','elapsed_seconds']) assert.equal(audit.retained_weekly[k],weekly.summary[k],k);
  assert.equal(audit.retained_weekly.latest_collected_at,weekly.collected_at);
  assert.equal(audit.retained_weekly.change_fraction_of_comparable_sources,116/216);
  assert.equal(audit.retained_weekly.meaningful_claim_precision,null);
  assert.equal(audit.retained_weekly.maintainer_minutes,null);
});

test('Proposed LLM and scale thresholds cannot imply implemented authority', () => {
  assert.equal(audit.llm_service_deployed,false);
  assert.equal(audit.scale_acceptance_proposal.implemented,false);
  assert.ok(Object.values(audit.llm_proposal.worker_privileges).every(x=>x===false));
  assert.deepEqual(audit.scale_acceptance_proposal.inventory_fixtures,[507,1001]);
  assert.equal(audit.scale_acceptance_proposal.real_weekly_cycles_to_observe,2);
  assert.equal(audit.public_changes,false);
  assert.equal(audit.automatic_publication,false);
  assert.match(audit.next_action,/denial\/500-bound\/immutable/);
  assert.ok(audit.desk_tasks.every(x=>x.steps.length===7 && x.result.startsWith('PARTIAL:')));
});

test('Broader demand preserves original metric dates and pending new collection', () => {
  const prior=json(audit.broader_query_research.prior_metrics_record);
  for(const r of audit.broader_query_research.prior_metrics) {
    const p=prior.keywords.find(x=>x.keyword===r.query);
    assert.equal(r.average_monthly_us,p.search_volume);
    assert.equal(r.metrics_updated_at,p.metrics_updated_at);
  }
  assert.equal(audit.new_paid_calls,0);
  assert.equal(audit.broader_query_research.new_numeric_demand,null);
  assert.equal(audit.broader_query_research.proposed_bounded_queries.length,30);
  assert.equal(new Set(audit.broader_query_research.proposed_bounded_queries).size,30);
  assert.equal(audit.fresh_task_sources.find(x=>x.id==='amtrak-fare').class,'OFFICIAL_SEARCH_EXCERPT_ONLY');
  assert.ok(audit.fresh_primary_sources.every(x=>new URL(x.url).protocol==='https:'));
});
