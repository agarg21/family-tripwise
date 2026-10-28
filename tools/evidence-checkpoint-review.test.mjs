import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,writeFile,mkdtemp,rm,realpath,mkdir,symlink,readdir} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {planSources,initializeCheckpoint,runCheckpointBatch as runBatch,checkpointEvidence,validateCheckpointEvidence,currentPlan,priorAttemptAt,collectionSelection} from './evidence-batch-pilot.mjs';
const emptyHolds={schema_version:1,kind:'documented-source-access-holds',holds:[]};
const runCheckpointBatch=(p,index,dir,options)=>runBatch(p,index,dir,{selection:collectionSelection(p,emptyHolds,p.sources.filter(s=>![401,403].includes(s.prior?.http_status)&&!['challenge-or-empty-review','access-denied-carried-forward'].includes(s.prior?.state)).map(s=>s.url)),accessHolds:emptyHolds,...options});
import {aggregateCheckpoint,reviewCheckpoint} from './evidence-checkpoint-review.mjs';
import {modelRecords} from './evidence-audit.mjs';
const page='https://familytripwise.com/where-to-stay/test.html',when='2026-01-01T12:00:00.000Z',now='2026-10-14T03:01:00.000Z';
const clone=x=>JSON.parse(JSON.stringify(x));
function fixture(count=3) {
  const sources=Array.from({length:count},(_,i)=>({url:`https://example.com/${i}`,pages:[page],state:i===0?'unavailable-review':'retrieved-baseline',...(i===0?{http_status:403}:{http_status:200,text_sha256:'a'.repeat(64),price_sha256:'b'.repeat(64),text_length:150,fields:[],price_candidates:[]}),last_attempt_at:when}));
  const records=[{id:'room-fee',page_url:page,field:'room_fee',source_urls:[sources[0].url],verified_on:'2025-12-01',freshness:{state:'review-due',due_on:'2025-12-08'}}];
  const pages=[{url:page,sources:sources.map(s=>s.url),records,claim_registry:'partial-field-coverage'}];
  const previous={schema_version:1,mode:'public-source-diff',collected_at:when,factual_dates_renewed:false,pages,sources,summary:{canonical_pages:1,sources:count}};
  const plan=planSources({sources:sources.map(s=>({url:s.url,pages:s.pages,prior:s,checks:[]})),allowedHosts:['example.com'],observedOn:'2026-01-01',notBefore:'2026-01-01'});
  const evidence={schema_version:1,kind:'checkpoint-evidence',plan_sha256:plan.plan_sha256,entries:sources.map((s,index)=>({index,state:index===0?'held-prior-denial':'deferred-no-attempt',last_attempt_at:when,source:s}))};
  return {plan,evidence,inv:{pages,sources:sources.map(s=>({url:s.url,pages:s.pages}))},previous,generatedAt:now,expectedRecords:records.map(({freshness,...r})=>r),expectedUrls:[page]};
}
const result=s=>({...s,state:'text-changed-review',text_sha256:'c'.repeat(64),last_attempt_at:now});
test('pure: partial review retains all source states, dates, priorities and original field clocks',()=>{
  const f=fixture();f.evidence.entries[1]={index:1,state:'held-outcome-unknown',last_attempt_at:now,source:null};
  const before=JSON.stringify(f),r=aggregateCheckpoint(f);assert.equal(JSON.stringify(f),before);
  assert.equal(r.summary.sources,3);assert.equal(r.standard_audit_ready,false);assert.equal(r.audit,null);assert.equal(r.review,null);
  assert.deepEqual(r.summary.checkpoint_states,{'held-prior-denial':1,'held-outcome-unknown':1,'deferred-no-attempt':1});
  assert.equal(r.source_review_queue[0].priority,1);assert.equal(r.source_review_queue[0].last_attempt_at,when);assert.equal(r.source_review_queue[1].classification,'unknown-outcome-owner-reconciliation-no-retry');assert.equal(r.field_review_queue[0].verified_on,'2025-12-01');assert.equal(r.factual_dates_renewed,false);
});
test('pure: complete compatible audit preserves denials and queues unreconciled changes',()=>{
  const f=fixture();for(const row of f.evidence.entries.slice(1)){row.state='attempt-completed';row.last_attempt_at=now;row.source=result(row.source);}
  const r=aggregateCheckpoint(f);assert.equal(r.standard_audit_ready,true);assert.equal(r.audit.sources[0].state,'access-denied-carried-forward');assert.equal(r.audit.sources[0].last_attempt_at,when);assert.equal(r.review.summary.changed_sources,2);assert.equal(r.review.summary.carried_denials,1);assert.equal(r.review.automatic_fact_renewal,false);assert.equal(r.review.summary.model_records_checked,1);assert.equal(r.audit.pages[0].records[0].verified_on,'2025-12-01');
});
test('pure: missing, mismatched, private or renewed checkpoint outcomes fail closed',()=>{
  for(const mutate of [f=>f.evidence.entries.pop(),f=>f.evidence.entries[1].index=0,f=>f.evidence.entries[0].last_attempt_at=now,f=>f.evidence.entries[1].source.reason={raw_body:'private'},f=>f.evidence.entries[1].state='unavailable-review',f=>f.evidence.extra='private',f=>f.inv.sources.pop(),f=>f.inv.pages[0].records[0].verified_on='2026-10-13',f=>f.previous.sources[1].text_sha256='d'.repeat(64),f=>f.generatedAt=when]) {
    const f=fixture();if(mutate.toString().includes('generatedAt')){f.evidence.entries[1]={index:1,state:'held-outcome-unknown',last_attempt_at:now,source:null};}mutate(f);assert.throws(()=>aggregateCheckpoint(f));
  }
  const f=fixture();f.evidence.entries[1]={index:1,state:'attempt-completed',last_attempt_at:now,source:{...result(f.evidence.entries[1].source),reason:{private:'probe'}}};assert.throws(()=>validateCheckpointEvidence(f.plan,f.evidence));
});
test('pure: null and absent dates on never-attempted priors remain null',()=>{
  for(const state of ['not-fetched','deferred-limit'])for(const absent of [false,true]) {
    const f=fixture();const original={url:f.previous.sources[1].url,pages:[page],state};if(!absent)original.last_attempt_at=null;f.previous.sources[1]=original;
    const sources=f.plan.sources.map(s=>({url:s.url,pages:s.pages,checks:s.checks,prior:{...f.previous.sources.find(p=>p.url===s.url),last_attempt_at:priorAttemptAt(f.previous.sources.find(p=>p.url===s.url),when)}}));
    f.plan=planSources({sources,allowedHosts:['example.com'],observedOn:'2026-01-01',notBefore:'2026-01-01'});
    f.evidence={schema_version:1,kind:'checkpoint-evidence',plan_sha256:f.plan.plan_sha256,entries:f.plan.sources.map((s,index)=>({index,state:index===0?'held-prior-denial':'deferred-no-attempt',last_attempt_at:s.prior.last_attempt_at,source:s.prior}))};
    const r=aggregateCheckpoint(f);assert.equal(r.source_review_queue.find(s=>s.index===1).last_attempt_at,null);assert.equal(r.standard_audit_ready,false);assert.equal(Object.hasOwn(original,'last_attempt_at'),!absent);
  }
  assert.equal(priorAttemptAt({state:'retrieved-baseline',text_sha256:'a'.repeat(64)},when),when);assert.equal(priorAttemptAt({state:'unavailable-review',http_status:403},when),when);assert.equal(priorAttemptAt({state:'unavailable-review'},when),null);
});
test('pure: atomic predicate queue preserves cohort basis and source clocks without hash-delta inference',()=>{
  const f=fixture(),check={id:'adult',pattern:'adult'},record={id:'adult',page_url:page,field:'admission-price-adult',verified_on:'2025-12-01',interval_days:14,basis:'USD10/person ages18-64; checkout unknown',evidence_path:'docs/research/fixture.json',source_urls:[f.plan.sources[1].url]};
  f.inv.pages[0].records.push({...record,freshness:{state:'review-due'}});f.expectedRecords.push(record);
  const ss=clone(f.plan.sources);ss[1].checks=[check];f.plan=planSources({sources:ss,allowedHosts:['example.com'],observedOn:'2026-01-01',notBefore:'2026-01-01'});f.evidence.plan_sha256=f.plan.plan_sha256;
  f.evidence.entries[1]={index:1,state:'attempt-completed',last_attempt_at:now,source:{...result(f.evidence.entries[1].source),state:'text-unchanged',fields:[{id:'adult',state:'expected-text-missing-review',evidence_class:'EXTRACTION_CANDIDATE'}]}};
  const r=aggregateCheckpoint(f);assert.equal(r.summary.extraction_predicates,1);assert.equal(r.summary.missing_extraction_predicates,1);assert.equal(r.extraction_review_queue[0].claim_verified,false);assert.equal(r.extraction_review_queue[0].original_verified_on,'2025-12-01');assert.equal(r.extraction_review_queue[0].source_attempted_at,now);assert.equal(r.extraction_review_queue[0].classification,'predicate-missing-reconcile-source-or-parser');assert.equal(r.extraction_review_queue[0].basis,record.basis);assert.equal(r.standard_audit_ready,false);
  f.evidence.entries[1].source.fields[0].state='expected-text-present';assert.equal(aggregateCheckpoint(f).extraction_review_queue[0].classification,'predicate-present-not-verified');
});
const withDir=async fn=>{const dir=await mkdtemp(join(await realpath(tmpdir()),'ft-checkpoint-review-'));try{await fn(dir);}finally{await rm(dir,{recursive:true,force:true});}};
test('journal: read-only partial export, interrupted hold and complete native review handoff',()=>withDir(async dir=>{
  const f=fixture();await initializeCheckpoint(f.plan,dir);
  const first=await checkpointEvidence(f.plan,dir);assert.equal(aggregateCheckpoint({...f,evidence:first}).standard_audit_ready,false);
  let calls=0;await assert.rejects(()=>runCheckpointBatch(f.plan,0,dir,{collect:true,executeSource:async()=>{calls++;throw Error('interrupted');}}));
  const held=await checkpointEvidence(f.plan,dir);assert.equal(held.entries[1].state,'held-outcome-unknown');
  await runCheckpointBatch(f.plan,0,dir,{collect:true,executeSource:async s=>{calls++;return {...s.prior,url:s.url,state:'text-unchanged'};}});
  const r=aggregateCheckpoint({...f,evidence:await checkpointEvidence(f.plan,dir),generatedAt:new Date().toISOString()});assert.equal(calls,2);assert.equal(r.standard_audit_ready,false);assert.equal(r.summary.owner_reconciliation_holds,1);
}));
test('journal: completed outcomes integrate without source replay or denied date renewal',()=>withDir(async dir=>{
  const f=fixture();await initializeCheckpoint(f.plan,dir);let calls=0;
  await runCheckpointBatch(f.plan,0,dir,{collect:true,executeSource:async s=>{calls++;return {...s.prior,url:s.url,state:'text-changed-review',text_sha256:'c'.repeat(64)};}});
  const r=aggregateCheckpoint({...f,evidence:await checkpointEvidence(f.plan,dir),generatedAt:new Date().toISOString()});assert.equal(calls,2);assert.equal(r.standard_audit_ready,true);assert.equal(r.review.summary.changed_sources,2);assert.equal(r.audit.sources[0].last_attempt_at,when);
  const again=await checkpointEvidence(f.plan,dir);assert.equal(again.entries.length,3);assert.equal(calls,2);
}));
test('journal: active writer and corrupt result export fail closed',()=>withDir(async dir=>{
  const f=fixture();await initializeCheckpoint(f.plan,dir);await writeFile(join(dir,'writer.lock'),'test');await assert.rejects(()=>checkpointEvidence(f.plan,dir),/writer/);
  await rm(join(dir,'writer.lock'));await runCheckpointBatch(f.plan,0,dir,{collect:true,executeSource:async s=>({...s.prior,url:s.url,state:'text-unchanged'})});
  const path=join(dir,'00000001.result.json'),r=JSON.parse(await readFile(path));r.source.reason={raw_body:'private'};await writeFile(path,JSON.stringify(r));await assert.rejects(()=>checkpointEvidence(f.plan,dir));
}));
test('journal: current509 source adapter (dead Coronado ferry-info URL removed, DC itinerary NPS, DISCOVERY tickets and Boston itinerary MBTA sources added 2026-10-27; /this-week/ and /deals/ links excluded, they expire daily) covers all canonical/model records without collection',()=>withDir(async dir=>{
  const config=JSON.parse(await readFile(new URL('../ops/evidence-watch.json',import.meta.url))),previous=JSON.parse(await readFile(new URL('../ops/evidence-audits/2026-10-07.json',import.meta.url)));
  const plan=await currentPlan({today:'2026-10-13',notBefore:'2026-10-14',config,previous});await initializeCheckpoint(plan,dir);
  const r=await reviewCheckpoint({directory:dir,previous,config});assert.equal(r.summary.sources,509);assert.equal(r.summary.canonical_pages,44);assert.equal(r.summary.prior_access_holds,154);assert.equal(r.summary.deferred_sources,355);assert.equal(r.standard_audit_ready,false);assert.equal(r.summary.model_records_checked,modelRecords().length);
  const prior=clone(previous),source=prior.sources.find(s=>s.state==='text-unchanged'),url=source.url;prior.sources[prior.sources.indexOf(source)]={url,pages:source.pages,state:'deferred-limit',last_attempt_at:null};
  const nullable=await currentPlan({today:'2026-10-13',notBefore:'2026-10-14',config,previous:prior});assert.equal(nullable.sources.find(s=>s.url===url).prior.last_attempt_at,null);
  delete prior.sources.find(s=>s.url===url).last_attempt_at;
  const absent=await currentPlan({today:'2026-10-13',notBefore:'2026-10-14',config,previous:prior});assert.equal(absent.sources.find(s=>s.url===url).prior.last_attempt_at,null);
  config.records[0].pattern='changed-probe';await assert.rejects(()=>reviewCheckpoint({directory:dir,previous,config}),/changed/);
}));
test('journal: CLI refuses journal outputs, aliases, duplicates and existing files without writes',()=>withDir(async dir=>{
  const checkpoint=join(dir,'checkpoint');await mkdir(checkpoint);const link=join(dir,'alias');await symlink(checkpoint,link);
  const config=JSON.parse(await readFile(new URL('../ops/evidence-watch.json',import.meta.url))),previous=JSON.parse(await readFile(new URL('../ops/evidence-audits/2026-10-07.json',import.meta.url)));
  const plan=await currentPlan({today:'2026-10-13',notBefore:'2026-10-14',config,previous});await initializeCheckpoint(plan,checkpoint);
  const cli=fileURLToPath(new URL('./evidence-checkpoint-review.mjs',import.meta.url)),prior=fileURLToPath(new URL('../ops/evidence-audits/2026-10-07.json',import.meta.url)),output=join(dir,'review.json');
  const invoke=out=>spawnSync(process.execPath,[cli,'--checkpoint',checkpoint,'--previous',prior,'--output',out],{encoding:'utf8'});
  for(const bad of [join(checkpoint,'review.json'),join(link,'review.json')]){const r=invoke(bad);assert.equal(r.status,1);assert.match(r.stderr,/outside|Unsafe/);}
  assert.deepEqual(await readdir(checkpoint),['manifest.json']);
  const success=invoke(output);assert.equal(success.status,0,success.stderr);assert.equal(JSON.parse(success.stdout).network_calls,0);
  const bytes=await readFile(output);assert.equal(invoke(output).status,1);assert.deepEqual(await readFile(output),bytes);assert.deepEqual(await readdir(checkpoint),['manifest.json']);
  const duplicate=spawnSync(process.execPath,[cli,'--checkpoint',checkpoint,'--checkpoint',checkpoint,'--previous',prior,'--output',join(dir,'other.json')],{encoding:'utf8'});assert.equal(duplicate.status,1);assert.deepEqual((await readdir(dir)).sort(),['alias','checkpoint','review.json']);
}));
