import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {mkdtemp,realpath,rm,readdir,readFile,writeFile,symlink,stat} from 'node:fs/promises';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {planSources,collectionSelection,initializeCheckpoint,runCheckpointBatch,checkpointEvidence} from './evidence-batch-pilot.mjs';
import {createProposalCollector} from './source-proposal-collection.mjs';
import {aggregateProposalHandoff,publishProposalHandoff,parseHandoffOptions} from './source-proposal-handoff.mjs';
const config=JSON.parse(readFileSync(new URL('../ops/evidence-watch.json',import.meta.url))),holds=JSON.parse(readFileSync(new URL('../ops/source-access-holds.json',import.meta.url)));
const faq='https://thedana.com/san-diego-hotel/faq/',rooms='https://thedana.com/san-diego-accommodations/';
const hash=v=>createHash('sha256').update(JSON.stringify(v)).digest('hex');
const text='Resort fee is $25 plus tax per night. This is synthetic collection text for packet handoff controls, not an official source observation or booking offer.';
function proposer(c){return [{id:'proposal-1',field_id:'dana-resort-fee-predicate',source_url:c.url,source_text_sha256:c.text_sha256,source_span:{start:0,end:c.text.indexOf('.')+1},value:{amount:25,currency:'USD',currency_basis:'interpretation',unit:'night',tax_basis:'plus-tax',rate_inclusion:null,party_basis:null,stay_dates:null},proposed_context_flags:['unknown']}];}
function setup({roomDenied=false,body=text,propose=proposer}={}) {
  const sources=[rooms,faq].map(url=>{const records=config.records.filter(r=>r.source_urls?.includes(url)&&r.pattern);return {url,pages:[...new Set(records.map(r=>r.page_url))],prior:roomDenied&&url===rooms?{url,pages:[...new Set(records.map(r=>r.page_url))],state:'unavailable-review',http_status:403,last_attempt_at:'2026-10-13T01:00:00.000Z'}:null,checks:records.map(r=>({id:r.id,pattern:r.pattern}))};});
  const plan=planSources({sources,allowedHosts:config.allowed_hosts,observedOn:'2026-10-14',notBefore:'2026-01-01'}),selection=collectionSelection(plan,holds,[faq]);
  const scope={schema_version:1,kind:'operator-reviewed-in-memory-proposal-scope',plan_sha256:plan.plan_sha256,selection_sha256:hash(selection),hold_registry_sha256:selection.hold_registry_sha256,field_registry_sha256:hash(config),reviewed_on:'2026-10-14',permission_basis:'operator-reviewed-not-machine-authorized',sources:[{url:faq,field_ids:['dana-resort-fee-predicate','dana-self-parking-fee-predicate','dana-incidental-hold-predicate'],source_class:'official',access_review:'operator-reviewed',processing:'transient-text-no-body-retention',evidence_path:'docs/research/dana-atomic-watch-2026-10-14.json'}]};
  return {plan,selection,scope,config:structuredClone(config),accessHolds:structuredClone(holds),collect:true,propose,fetcher:async()=>new Response('<p>'+body+'</p>',{status:200,headers:{'content-type':'text/html'}})};
}
async function input(options) {
  const o=setup(options),collector=createProposalCollector(o),index=o.plan.sources.findIndex(s=>s.url===faq),at=new Date().toISOString();
  const source=await collector.executeSource(o.plan.sources[index],{index,plan_sha256:o.plan.plan_sha256,attempted_at:at});
  const entries=o.plan.sources.map((s,i)=>i===index?{index:i,state:'attempt-completed',last_attempt_at:at,source:{...source,pages:s.pages,last_attempt_at:at}}:{index:i,state:s.prior?'held-prior-denial':'deferred-no-attempt',last_attempt_at:s.prior?.last_attempt_at||null,source:s.prior});
  return {...o,evidence:{schema_version:1,kind:'checkpoint-evidence',plan_sha256:o.plan.plan_sha256,entries},packets:collector.reviewPackets()};
}
const selected=i=>i.evidence.entries.find(e=>i.plan.sources[e.index].url===faq);
const row=i=>i.packets[0].review.proposals[0];
const withDir=async fn=>{const dir=await mkdtemp(join(await realpath(tmpdir()),'ft-handoff-'));try{await fn(dir);}finally{await rm(dir,{recursive:true,force:true});}};

test('pure: all sources accounted but complete selected packet accounting is not weekly or semantic readiness',async()=>{
  const i=await input(),before=JSON.stringify(i),r=aggregateProposalHandoff(i);assert.equal(JSON.stringify(i),before);assert.equal(r.selected_packet_accounting_complete,true);assert.deepEqual(r.summary,{sources:2,selected_sources:1,provided_packets:1,missing_completed_packets:0,selected_deferred:0,selected_unknown:0,out_of_scope_sources:1,all_sources_accounted:true});assert.equal(r.standard_audit_handoff_authorized,false);assert.equal(r.semantic_refresh_ready,false);assert.equal(r.factual_dates_renewed,false);assert.equal(r.automatic_publication,false);assert.equal(r.retry_authorized,false);assert.ok(!JSON.stringify(r).includes(text));assert.equal(r.source_review_queue[1].packet.review.proposals[0].original_verified_on,'2026-10-08');
});
test('pure: lost memory packet for known completed source remains a nonretryable coverage hold',async()=>{
  const i=await input(),known=structuredClone(selected(i));i.packets=[];const r=aggregateProposalHandoff(i);assert.equal(r.selected_packet_accounting_complete,false);assert.equal(r.summary.missing_completed_packets,1);assert.equal(r.source_review_queue[1].state,'held-proposal-packet-missing');assert.equal(r.source_review_queue[1].packet,null);assert.equal(r.source_review_queue[1].retry_authorized,false);assert.deepEqual(selected(i),known);
});
test('pure: unknown outcome and never-attempted states stay distinct with no invented packet or retry',async()=>{
  for(const state of ['held-outcome-unknown','deferred-no-attempt']){const i=await input();i.packets=[];const r=selected(i);r.state=state;r.source=null;if(state==='deferred-no-attempt')r.last_attempt_at=null;const report=aggregateProposalHandoff(i);assert.equal(report.selected_packet_accounting_complete,false);assert.equal(report.source_review_queue[1].state,state==='held-outcome-unknown'?'held-source-outcome-unknown':'deferred-no-attempt');assert.equal(report.source_review_queue[1].retry_authorized,false);}
});
test('pure: unselected prior-denial state and original clock are preserved rather than retried',async()=>{
  const i=await input({roomDenied:true}),r=aggregateProposalHandoff(i);assert.equal(r.source_review_queue[0].checkpoint_state,'held-prior-denial');assert.equal(r.source_review_queue[0].source_attempted_at,'2026-10-13T01:00:00.000Z');assert.equal(r.source_review_queue[0].state,'out-of-proposal-scope');assert.equal(r.source_review_queue[0].retry_authorized,false);
});
test('pure: scope outcome hash time status index and duplicate packet drift reject without source changes',async()=>{
  for(const mutate of [i=>i.packets[0].plan_sha256='0'.repeat(64),i=>i.packets[0].selection_sha256='0'.repeat(64),i=>i.packets[0].processing_scope_sha256='0'.repeat(64),i=>i.packets[0].source_text_sha256='0'.repeat(64),i=>i.packets[0].source_attempted_at='2026-10-13T01:00:00.000Z',i=>i.packets[0].source_outcome='text-unchanged',i=>i.packets[0].source_http_status=201,i=>i.packets[0].source_index=0,i=>i.packets[0].source_url=rooms,i=>i.packets.push(structuredClone(i.packets[0])),i=>i.scope.field_registry_sha256='0'.repeat(64)]){const i=await input();mutate(i);assert.throws(()=>aggregateProposalHandoff(i));}
});
test('pure: copied private text unknown keys and source or row authority cannot enter handoff',async()=>{
  for(const mutate of [i=>i.packets[0].raw_body='private',i=>i.packets[0].review.error='private',i=>row(i).support='private',i=>row(i).value.private='identity',i=>i.packets[0].review.limitations[0]='copied source text',i=>i.packets[0].public_update_authorized=true,i=>row(i).semantic_verified=true,i=>row(i).context_review.conditions='approved',i=>row(i).unverified_context_flags=['copied identity']]){const i=await input();mutate(i);assert.throws(()=>aggregateProposalHandoff(i));}
});
test('pure: original dates source spans typed values category and null family context are preserved',async()=>{
  for(const mutate of [i=>row(i).original_verified_on='2026-10-14',i=>row(i).source_span.end=99999,i=>row(i).source_span.offset_unit='utf8',i=>row(i).source_span_sha256='fake',i=>row(i).value.amount=NaN,i=>row(i).value.amount=-1,i=>row(i).value.party_basis='family five',i=>row(i).value.stay_dates='November',i=>row(i).value.currency='EUR',i=>row(i).id='private-name',i=>row(i).field='changed',i=>row(i).evidence_path='private.json']){const i=await input();mutate(i);assert.throws(()=>aggregateProposalHandoff(i));}
});
test('pure: saved disagreements remain unresolved and cannot be silently dropped or chosen',async()=>{
  const body='Resort fee is $25 plus tax per night. Updated resort fee is $30 plus tax per night. '+text;
  const i=await input({body,propose:c=>{const p=proposer(c),q=structuredClone(p[0]);q.id='proposal-2';q.value.amount=30;q.source_span={start:c.text.indexOf('Updated'),end:c.text.indexOf('.',c.text.indexOf('Updated'))+1};return [...p,q];}});const r=aggregateProposalHandoff(i),conflict=r.source_review_queue[1].packet.review.candidate_conflicts[0];assert.equal(conflict.resolved,false);assert.equal(conflict.chosen_proposal_id,null);i.packets[0].review.candidate_conflicts=[];assert.throws(()=>aggregateProposalHandoff(i));
});
test('pure: rejected proposal and failed source packets remain accounted review work not facts',async()=>{
  const i=await input({propose:()=>{throw Error('private');}}),r=aggregateProposalHandoff(i);assert.equal(r.selected_packet_accounting_complete,true);assert.equal(r.source_review_queue[1].packet.review.state,'rejected-proposals-review');assert.equal(r.semantic_refresh_ready,false);
  const o=setup(),c=createProposalCollector({...o,fetcher:async()=>new Response('denied',{status:403})}),index=1,at=new Date().toISOString(),source=await c.executeSource(o.plan.sources[index],{index,plan_sha256:o.plan.plan_sha256,attempted_at:at});i.packets=c.reviewPackets();i.evidence.entries[1]={index,state:'attempt-completed',last_attempt_at:at,source:{...source,pages:o.plan.sources[index].pages,last_attempt_at:at}};const failed=aggregateProposalHandoff(i);assert.equal(failed.selected_packet_accounting_complete,true);assert.equal(failed.source_review_queue[1].packet.review.state,'source-not-retrieved-review');assert.equal(failed.retry_authorized,false);
});
test('pure: malformed checkpoint future report and packet for unknown result cannot be reconstructed',async()=>{
  for(const mutate of [i=>i.generatedAt='2099-01-01T00:00:00.000Z',i=>i.evidence.entries.pop(),i=>{selected(i).state='held-outcome-unknown';selected(i).source=null;},i=>{selected(i).source.text_length=10;},i=>i.packets[0].review.retry_authorized=true]){const i=await input();mutate(i);assert.throws(()=>aggregateProposalHandoff(i));}
});
test('pure: CLI options require explicit distinct paths and no collection or retry mode exists',()=>{
  assert.deepEqual(parseHandoffOptions(['--checkpoint','a','--selection','b','--scope','c','--packets','d','--output','e']),{'--checkpoint':'a','--selection':'b','--scope':'c','--packets':'d','--output':'e'});
  for(const args of [[],['--checkpoint','x'],['--collect','x'],['--checkpoint','x','--checkpoint','y'],['--checkpoint','--scope']])assert.throws(()=>parseHandoffOptions(args));
});
test('journal: immutable handoff persists packets outside unchanged journal with0600 and no overwrite',()=>withDir(async dir=>{
  const o=setup(),checkpoint=join(dir,'checkpoint');await initializeCheckpoint(o.plan,checkpoint);const c=createProposalCollector(o);await runCheckpointBatch(o.plan,0,checkpoint,{collect:true,selection:o.selection,accessHolds:holds,executeSource:c.executeSource});const before=await checkpointEvidence(o.plan,checkpoint),files=await readdir(checkpoint),output=join(dir,'handoff.json');
  const r=await publishProposalHandoff({directory:checkpoint,...o,packets:c.reviewPackets(),output});assert.equal(r.selected_packet_accounting_complete,true);assert.deepEqual(JSON.parse(await readFile(output,'utf8')),r);assert.equal((await stat(output)).mode&0o777,0o600);await assert.rejects(()=>publishProposalHandoff({directory:checkpoint,...o,packets:c.reviewPackets(),output}),/EEXIST/);assert.deepEqual(await checkpointEvidence(o.plan,checkpoint),before);assert.deepEqual(await readdir(checkpoint),files);
  const missing=await publishProposalHandoff({directory:checkpoint,...o,packets:[],output:join(dir,'missing.json')});assert.equal(missing.summary.missing_completed_packets,1);assert.equal(missing.selected_packet_accounting_complete,false);assert.deepEqual(await checkpointEvidence(o.plan,checkpoint),before);
}));
test('journal: malformed packet inside-checkpoint alias symlink or active writer cannot publish',()=>withDir(async dir=>{
  const o=setup(),checkpoint=join(dir,'checkpoint');await initializeCheckpoint(o.plan,checkpoint);const c=createProposalCollector(o);await runCheckpointBatch(o.plan,0,checkpoint,{collect:true,selection:o.selection,accessHolds:holds,executeSource:c.executeSource});const packets=c.reviewPackets(),call=(output,extra={})=>publishProposalHandoff({directory:checkpoint,...o,packets,output,...extra});
  await assert.rejects(()=>call(join(checkpoint,'report.json')),/outside/);await assert.rejects(()=>call(join(dir,'relative.json'),{directory:'checkpoint'}),/canonical/);const alias=join(dir,'alias');await symlink(dir,alias);await assert.rejects(()=>call(join(alias,'report.json')),/canonical/);const existing=join(dir,'existing.json');await writeFile(existing,'keep');const link=join(dir,'report-link.json');await symlink(existing,link);await assert.rejects(()=>call(link));assert.equal(await readFile(existing,'utf8'),'keep');const bad=structuredClone(packets);bad[0].review.raw_body='private';await assert.rejects(()=>call(join(dir,'bad.json'),{packets:bad}));assert.ok(!(await readdir(dir)).includes('bad.json'));
  await writeFile(join(checkpoint,'writer.lock'),'hold');await assert.rejects(()=>call(join(dir,'locked.json')),/writer/);assert.ok(!(await readdir(dir)).includes('locked.json'));
}));
test('journal: explicit CLI writes a bounded body-free report and rejects a second publication',()=>withDir(async dir=>{
  const o=setup(),checkpoint=join(dir,'checkpoint');await initializeCheckpoint(o.plan,checkpoint);const c=createProposalCollector(o);await runCheckpointBatch(o.plan,0,checkpoint,{collect:true,selection:o.selection,accessHolds:holds,executeSource:c.executeSource});
  for(const [name,data] of [['selection',o.selection],['scope',o.scope],['packets',c.reviewPackets()]])await writeFile(join(dir,name+'.json'),JSON.stringify(data));
  const args=[fileURLToPath(new URL('./source-proposal-handoff.mjs',import.meta.url)),'--checkpoint',checkpoint,'--selection',join(dir,'selection.json'),'--scope',join(dir,'scope.json'),'--packets',join(dir,'packets.json'),'--output',join(dir,'handoff.json')],r=JSON.parse(execFileSync(process.execPath,args,{encoding:'utf8'}));assert.equal(r.network_calls,0);assert.equal(r.selected_packet_accounting_complete,true);assert.equal(r.semantic_refresh_ready,false);const before=await readFile(join(dir,'handoff.json'));assert.throws(()=>execFileSync(process.execPath,args,{stdio:'pipe'}));assert.deepEqual(await readFile(join(dir,'handoff.json')),before);
}));
