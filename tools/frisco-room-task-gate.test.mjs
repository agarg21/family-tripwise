import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';
import {validateBatch} from './seo-opportunity-pull.mjs';
const read=p=>JSON.parse(readFileSync(new URL(`../${p}`,import.meta.url)));
const q=read('docs/research/frisco-room-task-gate-2026-10-13.json');
const m=read(q.search.manifest),r=read(q.search.report);
test('Frisco search preserves bounded paid scope and missing materiality',()=>{
  assert.equal(validateBatch(m),q.search.conservative_reserved_usd);
  assert.deepEqual(m.keywords,['universal kids resort hotel rooms','universal kids resort family suite']);
  assert.equal(r.calls.length,3);assert.ok(r.calls.every(c=>c.status==='success'&&c.status_code===20000&&Number.isFinite(c.cost_usd)));
  assert.equal(r.total_cost_usd,q.search.batch_cost_usd);
  assert.equal(Math.round((m.prior_spend_usd+r.total_cost_usd)*1e5)/1e5,q.search.cumulative_usd);
  assert.deepEqual(r.keywords.map(x=>x.search_volume),q.search.monthly_estimates);
  assert.deepEqual(q.search.monthly_estimates,[null,null]);assert.ok(r.keywords.every(x=>x.metrics_updated_at===null));
  assert.equal(r.market,'US');assert.equal(r.location_code,2840);assert.equal(r.language_code,'en');
});
test('Actual US overlap is not inferred separate-URL eligibility',()=>{
  const norm=v=>{const u=new URL(v);return u.hostname.replace(/^www\./,'')+u.pathname.replace(/\/$/,'');};
  const [a,b]=r.serps.map(s=>new Set(s.organic.map(x=>norm(x.url))));
  assert.equal([...a].filter(x=>b.has(x)).length,q.search.normalized_url_intersection);
  assert.equal(new Set([...a,...b]).size,q.search.normalized_url_union);
  assert.deepEqual(r.serps.map(s=>s.organic.length),q.search.organic_rows);
  assert.equal(q.ownership.new_url_qualified,false);assert.equal(q.ownership.split_room_and_suite_urls_qualified,false);
});
test('Published category capacities stay separate from exact-party acceptance and price',()=>{
  assert.deepEqual(q.room_categories.map(x=>x.published_max_guests),[5,5,5,6]);
  assert.deepEqual(q.room_categories.map(x=>x.area_sqft),[288,314,424,486]);
  assert.ok(q.room_categories.every(x=>x.source_ids.includes('faq')&&x.source_ids.includes('hotel')));
  assert.equal(q.room_categories[3].private_bedroom,true);
  assert.equal(q.cost_basis.nightly_room_price,null);assert.equal(q.cost_basis.price_observation_date,null);
  assert.equal(q.cost_basis.park_ticket_price,null);assert.equal(q.cost_basis.all_currency_mandatory_total,null);
  assert.equal(q.cost_basis.incidental_hold_is_charge,false);assert.equal(q.cost_basis.published_pid_fee_percent,2);
});
test('Park-only eligibility does not turn hotel or partial-day package into full admission',()=>{
  assert.equal(q.park_basis.hotel_only_includes_admission,false);
  assert.equal(q.park_basis.task_people_requiring_admission,q.task.adults+q.task.child_ages.length);
  assert.equal(q.park_basis.one_point_five_day_equivalent_to_two_full_days,false);
  assert.equal(q.park_basis.package_only_one_point_five_day.first_day_from,'14:00');
  assert.equal(q.park_basis.exact_november_dates_open,null);assert.equal(q.park_basis.actual_entrance_to_room_return_minutes,null);
  assert.equal(q.review_signals.sampled,0);assert.equal(q.review_signals.family_fit_or_rest_established,false);
});
test('Research watch retains source-date, access failure and publication limits',()=>{
  assert.ok(q.sources.every(x=>x.accessed_on===q.checked_on&&new URL(x.url).protocol==='https:'));
  assert.equal(q.sources.find(x=>x.id==='opening').publication_date,'2026-07-02');
  assert.ok(q.access_failures.every(x=>x.retried===false&&x.unblock&&x.owner));
  assert.equal(q.result.publication_eligible,false);assert.equal(q.result.public_delivered,false);
  assert.equal(q.gsc.classification,'REUSED');assert.match(q.result.next_trigger,/not another heartbeat/);
});
