import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {validateBatch} from './seo-opportunity-pull.mjs';
const read=p=>JSON.parse(readFileSync(new URL('../'+p,import.meta.url))),q=read('docs/research/connecting-room-task-gate-2026-10-13.json'),m=read(q.search.manifest),r=read(q.search.report);
test('Connecting audit keeps paid failure, missing metrics and full charged cost',()=>{
 assert.equal(Math.round(validateBatch(m)*1e5)/1e5,q.search.conservative_reserved_usd);assert.deepEqual(m.keywords,['connecting rooms vs adjoining rooms','guaranteed connecting hotel rooms']);assert.equal(r.market,'US');assert.equal(r.language_code,'en');assert.equal(r.calls.length,3);assert.deepEqual(r.calls.map(x=>x.status),['success','success','provider-failure']);assert.equal(r.calls[2].status_code,40101);assert.equal(r.calls[2].cost_usd,0.002);assert.equal(r.calls.reduce((s,c)=>s+c.cost_usd,0),q.search.known_charged_batch_usd);assert.equal(Math.round((m.prior_spend_usd+q.search.known_charged_batch_usd)*1e5)/1e5,q.search.known_charged_cumulative_usd);assert.deepEqual(r.keywords.map(x=>x.search_volume),[null,null]);assert.equal(Object.hasOwn(r,'completed_at'),false);
});
test('One US SERP cannot establish paired ownership or demand',()=>{
 assert.equal(r.serps.length,1);assert.equal(r.serps[0].organic.length,9);assert.equal(q.search.paired_overlap_available,false);assert.equal(q.search.normalized_url_intersection,null);assert.equal(q.search.normalized_url_union,null);assert.equal(q.ownership.material_demand_established,false);assert.equal(q.ownership.two_query_job_established,false);assert.equal(q.ownership.new_url_qualified,false);
});
test('Supplier terms and actual physical connections are independent',()=>{
 assert.deepEqual(q.sources.map(x=>x.id),['hilton-faq','hilton-help','andaz-physical-link','bcd-glossary']);assert.ok(q.sources.every(x=>x.accessed_on===q.checked_on&&x.publication_date===null&&new URL(x.url).protocol==='https:'));assert.match(q.sources[1].limits,/24.*18/);assert.match(q.sources[2].observations,/shared vestibule/);assert.equal(q.decision_fields.length,6);assert.equal(q.hypothesis_result.startsWith('REJECT'),true);assert.equal(q.review_signals.property_fit_judgment,false);
});
test('Blocked bodies and query failure are not retried or borrowed into public records',()=>{
 assert.equal(q.access_failures.length,2);assert.ok(q.access_failures.every(x=>x.retried===false&&x.owner&&x.unblock&&x.next_check));assert.equal(q.result.public_delivered,false);assert.equal(q.result.publication_eligible,false);assert.equal(q.proxies.length,2);for(const p of q.proxies){for(const k of ['start','reduce','compare','trace','decide','verify','recover'])assert.ok(['YES','PARTIAL'].includes(p[k]));assert.match(p.remaining,/Evidence-only/);}assert.equal(q.gsc.classification,'REUSED');assert.match(q.result.next_trigger,/Not another heartbeat/);
});
