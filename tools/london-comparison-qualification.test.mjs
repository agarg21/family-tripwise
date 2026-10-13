import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import test from "node:test";
import {validateBatch} from "./seo-opportunity-pull.mjs";
import {roomComparisonsRecords} from "./family-room-comparison.mjs";
const read = path => JSON.parse(readFileSync(new URL(`../${path}`,import.meta.url)));
const q = read("docs/research/london-comparison-qualification-2026-10-13.json");
const report = read(q.search.report), manifest = read(q.search.manifest);
const typed = read(q.maintained_output.input_manifest);
const records = roomComparisonsRecords(typed.packs.map(read),typed.scenario,q.checked_on,typed.price_records.flatMap(read));
const norm = value => {const u=new URL(value);return u.hostname.replace(/^www\./,"")+u.pathname.replace(/\/$/,"");};

test("London qualification has bounded reconciled paid receipts, not failed-query retries",()=>{
  assert.equal(validateBatch(manifest),q.search.conservative_reserved_usd);
  assert.equal(manifest.prior_spend_usd,0.29612);
  assert.equal(report.action,q.action);
  assert.equal(report.market,"US"); assert.equal(report.location_code,2840);
  assert.equal(report.language_code,"en"); assert.equal(report.calls.length,4);
  assert.ok(report.calls.every(c=>c.status==="success"&&c.status_code===20000&&Number.isFinite(c.cost_usd)));
  assert.equal(report.total_cost_usd,0.01824);
  assert.equal(Math.round((manifest.prior_spend_usd+report.total_cost_usd)*1e5)/1e5,0.31436);
  assert.deepEqual(report.serps.map(x=>x.keyword),manifest.serp_keywords);
  assert.equal(report.completed_at,"2026-10-13T12:05:26.316Z");
});

test("actual paired US rows and unique overlap do not fabricate six-person materiality",()=>{
  const sets=report.serps.map(s=>new Set(s.organic.map(r=>norm(r.url))));
  for(const row of q.search.overlap){const [a,b]=row.pair;assert.equal([...sets[a]].filter(x=>sets[b].has(x)).length,row.url_intersection);assert.equal(new Set([...sets[a],...sets[b]]).size,row.url_union);}
  for(const row of q.search.queries){const metric=report.keywords.find(x=>x.keyword===row.keyword),serp=report.serps.find(x=>x.keyword===row.keyword);assert.equal(metric.search_volume,row.monthly_estimate);assert.equal(metric.metrics_updated_at,row.metrics_updated_at);assert.equal(serp.organic.length,row.organic_rows);}
  assert.equal(q.search.queries[1].monthly_estimate,null);
  assert.match(q.search.attribution_correction,/not 140|unknown; prior140/);
  assert.match(q.search.materiality,/not summed/);
  assert.equal(q.ownership.separate_urls_rejected.length,4);
});

test("bounded public scope uses three matched categories with original six-person prices",()=>{
  assert.equal(records.length,9);assert.equal(records.filter(r=>r.price.rates?.length).length,7);
  assert.equal(records.reduce((n,r)=>n+(r.price.rates?.length||1),0),15);
  const selected=q.maintained_output.eligible_initial_ids.map(id=>records.find(r=>r.id===id));
  assert.ok(selected.every(Boolean));assert.equal(selected.length,3);
  assert.deepEqual(selected.map(r=>r.price.rates.map(p=>p.nightly_average)),q.maintained_output.initial_price_nightly_equivalents_gbp);
  assert.equal(selected.reduce((n,r)=>n+r.price.rates.length,0),6);
  for(const r of selected){assert.equal(r.price.currency,"GBP");assert.equal(r.price.unit,"configuration/night");assert.equal(r.task.adults,2);assert.deepEqual(r.task.child_ages,[4,8,12,15]);assert.equal(r.price.observed_on,q.maintained_output.record_dates[r.id].price);assert.equal(r.checked_on,q.maintained_output.record_dates[r.id].category);assert.equal(r.price.status,"dated-stay-samples");assert.ok(r.price.fee_basis&&r.price.deposit_basis);}
  const changed={...typed.scenario,child_ages:[4,8,12]};
  const five=roomComparisonsRecords(typed.packs.map(read),changed,q.checked_on,typed.price_records.flatMap(read));
  assert.ok(five.every(r=>!r.price.rates?.length));
});

test("competition and review evidence remain distinct from maintained property claims",()=>{
  assert.equal(q.competitor_body_audit.length,4);
  for(const source of q.competitor_body_audit){assert.equal(source.checked_on,q.checked_on);assert.equal(new URL(source.url).protocol,"https:");assert.ok(source.paraphrase&&source.limit);assert.ok(!Object.hasOwn(source,"verbatim")&&!Object.hasOwn(source,"author"));}
  const reviews=q.maintained_output.reviews.map(read);
  assert.equal(reviews[0].result.six_person_sofa_comfort,null);
  assert.equal(reviews[1].result.six_person_signals,0);
  assert.equal(reviews[1].result.midday_rest_signals,0);
  assert.equal(q.maintained_output.deferred_ids.length,6);
  assert.ok(q.maintained_output.forbidden_claims.includes("A six-person quote is also a five-person quote"));
});

test("URL ownership and maintenance qualify an implementation, not an already released page",()=>{
  assert.equal(q.ownership.canonical_count_at_audit,35);
  assert.equal(q.ownership.london_owner_at_audit,false);
  assert.equal(q.result.publication_eligible_scope,true);
  assert.equal(q.result.public_launch_complete,false);
  assert.match(q.result.next_gate,/Register exact public implementation paths/);
  assert.equal(q.maintenance.price_refresh_days,14);
  assert.equal(q.maintenance.category_refresh_days,30);
  assert.equal(q.maintenance.review_refresh_days,60);
  assert.match(q.maintenance.fallback,/historical/);
  assert.equal(q.gsc.classification,"REUSED");
  assert.match(q.release_scope,/No public consumer/);
});
