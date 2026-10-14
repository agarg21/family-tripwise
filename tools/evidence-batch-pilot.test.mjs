import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,rm,writeFile,readFile,readdir,symlink,realpath} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {planSources,validatePlan,batches,initializeCheckpoint,checkpointStatus,runCheckpointBatch as runBatch,collectionSelection,validateCollectionSelection,validateAccessHolds,executeSelectedSource,currentPlan} from './evidence-batch-pilot.mjs';
const emptyHolds={schema_version:1,kind:'documented-source-access-holds',holds:[]};
const selected=p=>p.sources.filter(s=>![401,403].includes(s.prior?.http_status)&&!['challenge-or-empty-review','access-denied-carried-forward'].includes(s.prior?.state)).map(s=>s.url);
const runCheckpointBatch=(p,index,dir,options)=>runBatch(p,index,dir,{selection:collectionSelection(p,emptyHolds,selected(p)),accessHolds:emptyHolds,...options});
const page='https://familytripwise.com/where-to-stay/test.html';
const sources=count=>Array.from({length:count},(_,i)=>({url:`https://example.com/${String(i).padStart(6,'0')}`,pages:[page],prior:null,checks:[]}));
const plan=count=>planSources({sources:sources(count),allowedHosts:['example.com'],observedOn:'2026-01-01',notBefore:'2026-01-01'});
const reply=s=>({url:s.url,state:'retrieved-baseline',http_status:200,text_sha256:'a'.repeat(64),price_sha256:'b'.repeat(64),text_length:150,fields:[],price_candidates:[]});
const withDir=async fn=>{const dir=await mkdtemp(join(await realpath(tmpdir()),'ft-batch-test-'));try{await fn(dir);}finally{await rm(dir,{recursive:true,force:true});}};

test('pure: source selection rejects documented holds, denials, changed pins and private metadata',()=>{
  const p=plan(3),holds={schema_version:1,kind:'documented-source-access-holds',holds:[{url:p.sources[1].url,observed_on:'2026-01-01',reason:'documented-throttling-hold',evidence_path:'docs/research/fixture.json'}]},s=collectionSelection(p,holds,[p.sources[0].url]);
  assert.equal(s.selected_source_urls.length,1);assert.throws(()=>collectionSelection(p,holds,[p.sources[1].url]));assert.throws(()=>collectionSelection(p,holds,[p.sources[0].url,p.sources[0].url]));assert.throws(()=>collectionSelection(p,holds,['https://other.test/x']));
  for(const x of [{...s,plan_sha256:'c'.repeat(64)},{...s,hold_registry_sha256:'d'.repeat(64)},{...s,raw_body:'private'}])assert.throws(()=>validateCollectionSelection(p,x,holds));
  for(const x of [{...holds,extra:'private'},{...holds,holds:[{...holds.holds[0],reason:{private:'probe'}}]},{...holds,holds:[{...holds.holds[0],evidence_path:'docs/research/../private.json'}]},{...holds,holds:[{...holds.holds[0],url:'https://example.com/?token=private'}]}])assert.throws(()=>validateAccessHolds(x));
  const ss=sources(1);ss[0].prior={url:ss[0].url,pages:[page],state:'unavailable-review',http_status:403,last_attempt_at:'2026-01-01T12:00:00.000Z'};const deniedPlan=planSources({sources:ss,allowedHosts:['example.com'],observedOn:'2026-01-01',notBefore:'2026-01-01'});assert.throws(()=>collectionSelection(deniedPlan,emptyHolds,[ss[0].url]));
});
test('pure: selections stay sorted, source-bounded and limited to500 entries',()=>{
  const p=plan(1001);assert.throws(()=>collectionSelection(p,emptyHolds,selected(p)));const s=collectionSelection(p,emptyHolds,[p.sources[9].url,p.sources[1].url]);assert.deepEqual(s.selected_source_urls,[p.sources[1].url,p.sources[9].url]);
});
test('pure: default selected-source executor never follows redirects to held or unselected URLs',async()=>{
  const p=plan(3),holds={schema_version:1,kind:'documented-source-access-holds',holds:[{url:p.sources[1].url,observed_on:'2026-01-01',reason:'documented-throttling-hold',evidence_path:'docs/research/fixture.json'}]},selection=collectionSelection(p,holds,[p.sources[0].url]);
  for(const target of [p.sources[0].url,p.sources[1].url,p.sources[2].url,'https://other.test/private']){const calls=[];const result=await executeSelectedSource(p.sources[0],p,selection,holds,{fetcher:async url=>{calls.push(url);return new Response(null,{status:302,headers:{location:target}});}});assert.deepEqual(calls,[p.sources[0].url]);assert.equal(result.state,'unavailable-review');assert.equal(result.error_kind,'fetch-or-policy-error');}
  await assert.rejects(()=>executeSelectedSource(p.sources[2],p,selection,holds,{fetcher:async()=>{throw Error('must not request');}}));
});
test('journal: only explicit selected sources run and registry mutation cannot widen async scope',()=>withDir(async dir=>{
  const p=plan(4);await initializeCheckpoint(p,dir);let calls=0;
  const holds={schema_version:1,kind:'documented-source-access-holds',holds:[{url:p.sources[2].url,observed_on:'2026-01-01',reason:'documented-throttling-hold',evidence_path:'docs/research/fixture.json'}]},selection=collectionSelection(p,holds,[p.sources[0].url]);
  await assert.rejects(()=>runBatch(p,0,dir,{collect:true,executeSource:async()=>{calls++;}}));
  const r=await runBatch(p,0,dir,{collect:true,selection,accessHolds:holds,executeSource:async s=>{calls++;selection.selected_source_urls.push(p.sources[2].url);holds.holds=[];return reply(s);}});assert.equal(calls,1);assert.equal(r.counts['attempt-completed'],1);assert.equal(r.counts['deferred-no-attempt'],3);assert.equal(r.attempts_finished_or_held,false);
  const safe=collectionSelection(p,emptyHolds,[p.sources[0].url]);await runBatch(p,0,dir,{collect:true,selection:safe,accessHolds:emptyHolds,executeSource:async s=>{calls++;return reply(s);}});assert.equal(calls,1);
}));
test('journal: actual CLI rejects missing, changed, held or symlinked selection before fake fetch',()=>withDir(async dir=>{
  const config=JSON.parse(await readFile(new URL('../ops/evidence-watch.json',import.meta.url))),previous=JSON.parse(await readFile(new URL('../ops/evidence-audits/2026-10-07.json',import.meta.url))),registry=JSON.parse(await readFile(new URL('../ops/source-access-holds.json',import.meta.url)));
  const p=await currentPlan({config,previous,notBefore:'2026-01-01'});await initializeCheckpoint(p,dir);
  const output=join(await realpath(tmpdir()),'selection-'+dir.split('/').pop()+'.json'),alias=output+'.link';
  const cli=fileURLToPath(new URL('./evidence-batch-pilot.mjs',import.meta.url)),stub='data:text/javascript,'+encodeURIComponent('globalThis.fetch=async()=>{process.stderr.write("UNEXPECTED_FETCH\\n");throw Error("fake");};');
  const invoke=selectionPath=>spawnSync(process.execPath,['--import',stub,cli,'--collect','--batch','0','--checkpoint',dir,...(selectionPath?['--selection',selectionPath]:[])],{encoding:'utf8'});
  try {
    const no=invoke();assert.equal(no.status,1);assert.match(no.stderr,/explicit reviewed source selection/);assert.ok(!no.stderr.includes('UNEXPECTED_FETCH'));
    const safe=collectionSelection(p,registry,['https://garfieldconservatory.org/visit/']);
    for(const bad of [{...safe,hold_registry_sha256:'c'.repeat(64)},{...safe,selected_source_urls:[registry.holds[0].url]}]){await writeFile(output,JSON.stringify(bad));const r=invoke(output);assert.equal(r.status,1);assert.ok(!r.stderr.includes('UNEXPECTED_FETCH'));}
    await writeFile(output,JSON.stringify(safe));await symlink(output,alias);const r=invoke(alias);assert.equal(r.status,1);assert.match(r.stderr,/regular files/);assert.ok(!r.stderr.includes('UNEXPECTED_FETCH'));assert.deepEqual(await readdir(dir),['manifest.json']);
  } finally {await rm(alias,{force:true});await rm(output,{force:true});}
}));

test('pure: 507 and1001 sources have complete deterministic bounded coverage',()=>{
  for(const count of [507,1001]){const p=plan(count),bs=batches(p);assert.deepEqual(bs.map(x=>x.count),count===507?[500,7]:[500,500,1]);assert.equal(bs.reduce((n,x)=>n+x.count,0),count);assert.deepEqual(p,planSources({sources:[...sources(count)].reverse(),allowedHosts:['example.com'],observedOn:'2026-01-01',notBefore:'2026-01-01'}));}
});
test('pure: duplicate unsafe altered and unbounded plans fail closed',()=>{
  const p=plan(1);assert.throws(()=>validatePlan({...p,limit:501}));assert.throws(()=>validatePlan({...p,collect_not_before:'2030-01-01'}));
  for(const s of [[...sources(1),...sources(1)],[{...sources(1)[0],url:'https://example.com/?token=secret'}],[{...sources(1)[0],url:'https://other.test/x'}]])assert.throws(()=>planSources({sources:s,allowedHosts:['example.com'],observedOn:'2026-01-01',notBefore:'2026-01-01'}));
});
test('pure: retained priors reject nested private payloads in scalar metadata',()=>{
  for(const key of ['reason','content_type','http_status','text_length','collection_deferred','error_kind','text_sha256','last_attempt_at']) {
    const ss=sources(1);ss[0].prior={url:ss[0].url,pages:[page],state:'unavailable-review',[key]:{raw_body:'private-probe',authorization:'private-probe'}};
    assert.throws(()=>planSources({sources:ss,allowedHosts:['example.com'],observedOn:'2026-01-01',notBefore:'2026-01-01'}),key);
  }
});
test('journal: multiple batches resume without replaying completed requests',()=>withDir(async dir=>{
  const p=planSources({sources:sources(5),allowedHosts:['example.com'],observedOn:'2026-01-01',notBefore:'2026-01-01',limit:2});await initializeCheckpoint(p,dir);let calls=0;
  const options={collect:true,executeSource:async s=>{calls++;return reply(s);}};
  const first=await runCheckpointBatch(p,0,dir,options);assert.equal(first.counts['attempt-completed'],2);assert.equal(first.counts['deferred-no-attempt'],3);
  await runCheckpointBatch(p,0,dir,options);assert.equal(calls,2);
  await runCheckpointBatch(p,1,dir,options);const final=await runCheckpointBatch(p,2,dir,options);assert.equal(calls,5);assert.equal(final.attempts_finished_or_held,true);assert.equal(final.all_sources_accounted,true);assert.equal(final.factual_dates_renewed,false);
}));
test('journal: thrown request remains unknown and is not automatically retried',()=>withDir(async dir=>{
  const p=plan(2);await initializeCheckpoint(p,dir);let calls=0;
  await assert.rejects(()=>runCheckpointBatch(p,0,dir,{collect:true,executeSource:async()=>{calls++;throw Error('interruption');}}));
  const before=await checkpointStatus(p,dir);assert.equal(before.counts['held-outcome-unknown'],1);assert.equal(before.counts['deferred-no-attempt'],1);
  const after=await runCheckpointBatch(p,0,dir,{collect:true,executeSource:async s=>{calls++;return reply(s);}});assert.equal(calls,2);assert.equal(after.counts['held-outcome-unknown'],1);assert.equal(after.counts['attempt-completed'],1);
}));
test('journal: prior denials preserve original attempt dates and make zero requests',()=>withDir(async dir=>{
  const ss=sources(3);for(const [i,state]of ['unavailable-review','challenge-or-empty-review','access-denied-carried-forward'].entries())ss[i].prior={url:ss[i].url,pages:[page],state,http_status:i===0?403:200,last_attempt_at:'2026-01-01T01:00:00.000Z'};
  const p=planSources({sources:ss,allowedHosts:['example.com'],observedOn:'2026-01-02',notBefore:'2026-01-02'});await initializeCheckpoint(p,dir);
  const status=await runCheckpointBatch(p,0,dir,{collect:true,executeSource:async()=>{throw Error('must not request');}});assert.equal(status.counts['held-prior-denial'],3);assert.ok(status.rows.every(x=>x.last_attempt_at==='2026-01-01T01:00:00.000Z'));
}));
test('journal: collection requires explicit opt-in eligible date and valid batch',()=>withDir(async dir=>{
  const p=plan(1);await initializeCheckpoint(p,dir);let calls=0;const executeSource=async s=>{calls++;return reply(s);};
  await assert.rejects(()=>runCheckpointBatch(p,0,dir,{executeSource}));await assert.rejects(()=>runCheckpointBatch(p,9,dir,{collect:true,executeSource}));
  const future=planSources({sources:sources(1),allowedHosts:['example.com'],observedOn:'2026-01-01',notBefore:'2099-01-01'});
  await assert.rejects(()=>runCheckpointBatch(future,0,dir,{collect:true,today:'2099-01-01',executeSource}));assert.equal(calls,0);
}));
test('journal: exclusive lock and changed manifest block requests',()=>withDir(async dir=>{
  const p=plan(1);await initializeCheckpoint(p,dir);await writeFile(join(dir,'writer.lock'),'held');
  await assert.rejects(()=>runCheckpointBatch(p,0,dir,{collect:true,executeSource:async()=>{throw Error('must not request');}}));await rm(join(dir,'writer.lock'));
  const other=plan(2);await assert.rejects(()=>runCheckpointBatch(other,0,dir,{collect:true,executeSource:async()=>{throw Error('must not request');}}));
  assert.deepEqual(JSON.parse(await readFile(join(dir,'manifest.json'),'utf8')),p);
}));
test('journal: wrong identities private metadata and corrupt entries remain held',()=>withDir(async dir=>{
  const p=plan(2);await initializeCheckpoint(p,dir);
  await assert.rejects(()=>runCheckpointBatch(p,0,dir,{collect:true,executeSource:async s=>({...reply(s),url:'https://example.com/wrong'})}));
  await assert.rejects(()=>runCheckpointBatch(p,0,dir,{collect:true,executeSource:async s=>({...reply(s),raw_body:'private'})}));
  assert.equal((await checkpointStatus(p,dir)).counts['held-outcome-unknown'],2);
  await writeFile(join(dir,'00000000.start.json'),'broken');await assert.rejects(()=>checkpointStatus(p,dir));
}));
test('journal: symlink entries and directories are rejected',()=>withDir(async dir=>{
  const p=plan(1);const child=join(dir,'child');await initializeCheckpoint(p,child);
  await symlink(join(child,'manifest.json'),join(child,'00000000.start.json'));await assert.rejects(()=>checkpointStatus(p,child));
  await symlink(child,join(dir,'linked'));await assert.rejects(()=>checkpointStatus(p,join(dir,'linked')));
}));
test('journal: asynchronous caller changes cannot widen the validated request scope',()=>withDir(async dir=>{
  const p=plan(1),original=JSON.parse(JSON.stringify(p));await initializeCheckpoint(p,dir);let calls=0;
  const pending=runCheckpointBatch(p,0,dir,{collect:true,executeSource:async s=>{calls++;assert.equal(s.url,original.sources[0].url);return reply(s);}});
  p.sources[0].url='https://other.test/unsafe';p.sources.push(sources(2)[1]);
  assert.equal((await pending).source_count,1);assert.equal(calls,1);assert.equal((await checkpointStatus(original,dir)).counts['attempt-completed'],1);
}));
test('journal: nested private result metadata is held and never persisted',()=>withDir(async dir=>{
  const p=plan(3);await initializeCheckpoint(p,dir);
  for(const key of ['reason','content_type','http_status'])await assert.rejects(()=>runCheckpointBatch(p,0,dir,{collect:true,executeSource:async s=>({...reply(s),[key]:{raw_body:'private-probe',authorization:'private-probe'}})}));
  assert.equal((await checkpointStatus(p,dir)).counts['held-outcome-unknown'],3);
  for(const file of await readdir(dir))assert.doesNotMatch(await readFile(join(dir,file),'utf8'),/private-probe/);
}));
test('journal: a missing content-type header remains a known unsupported response',()=>withDir(async dir=>{
  const p=plan(1);await initializeCheckpoint(p,dir);
  const status=await runCheckpointBatch(p,0,dir,{collect:true,executeSource:async s=>({url:s.url,state:'unsupported-format-review',http_status:200,content_type:''})});
  assert.equal(status.counts['attempt-completed'],1);assert.equal(status.counts['held-outcome-unknown'],undefined);
}));
