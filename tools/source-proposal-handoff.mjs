import {readFile,open,lstat,realpath} from 'node:fs/promises';
import {resolve,join,dirname,relative,isAbsolute,sep} from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {validateCheckpointEvidence,checkpointEvidence,validatePlan} from './evidence-batch-pilot.mjs';
import {validateProposalScope} from './source-proposal-collection.mjs';
const ROOT=fileURLToPath(new URL('../',import.meta.url));
const hash=v=>createHash('sha256').update(JSON.stringify(v)).digest('hex');
const exact=(v,keys)=>v&&typeof v==='object'&&!Array.isArray(v)&&Object.keys(v).sort().join()===keys.slice().sort().join();
const hex=v=>typeof v==='string'&&/^[a-f0-9]{64}$/.test(v);
const timestamp=v=>typeof v==='string'&&/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(v)&&Number.isFinite(Date.parse(v))&&new Date(v).toISOString()===v&&Date.parse(v)<=Date.now();
const flags=new Set(['unknown','party-scope','conflicting-values','other-entity','stale-price','unpriced-age','source-instructions']);
const contracts={
  'dana-standard-room-capacity-predicate':['room-capacity','San Diego Hotel Rooms'],
  'dana-junior-suite-capacity-predicate':['room-capacity','Sunset Park View Junior Suite'],
  'dana-resort-fee-predicate':['nightly-fee'],
  'dana-self-parking-fee-predicate':['nightly-fee'],
  'dana-incidental-hold-predicate':['authorization'],
  'garfield-youth-admission-price-predicate':['admission-price']
};
const limitations=[
  'Lexical span support is not semantic validity, current source authenticity or condition completeness.',
  'The trusted snapshot must come from an independently permitted capture; a hash or HTTPS URL does not authenticate that capture.',
  'All source context and proposals remain pending review, including proposals with empty known conditions or positive matches.',
  'Conflict lists compare submitted candidate values only; omitted or unsuggested contradictions are not automatically detected.',
  'No nightly room quote, accepted party, verified policy, fact-date renewal or publication authority is provided.'
];
const requiredPending=r=>r.review_required===true&&r.retry_authorized===false&&r.semantic_verified===false&&r.public_update_authorized===false;
const canonical=v=>JSON.stringify(Object.fromEntries(Object.entries(v).sort(([a],[b])=>a.localeCompare(b))));

function validateValue(v,id) {
  const [kind,category]=contracts[id];
  if(kind==='room-capacity') {
    if(!exact(v,['category','advertised_maximum','bed_variant','accepted_party','stay_dates'])||v.category!==category||!Number.isInteger(v.advertised_maximum)||v.advertised_maximum<1||v.advertised_maximum>1000||v.bed_variant!==null||v.accepted_party!==null||v.stay_dates!==null)throw Error('Invalid saved capacity context');
  } else {
    if(typeof v?.amount!=='number'||!Number.isFinite(v.amount)||v.amount<0||v.amount>1000000||!['USD',null].includes(v.currency)||!['explicit-iso','interpretation','unknown'].includes(v.currency_basis)||(v.currency===null)!==(v.currency_basis==='unknown'))throw Error('Invalid saved currency context');
    if(kind==='nightly-fee') {
      if(!exact(v,['amount','currency','currency_basis','unit','tax_basis','rate_inclusion','party_basis','stay_dates'])||v.unit!=='night'||!['plus-tax','included','unknown'].includes(v.tax_basis)||v.rate_inclusion!==null||v.party_basis!==null||v.stay_dates!==null)throw Error('Invalid saved fee context');
    } else if(kind==='authorization') {
      if(!exact(v,['amount','currency','currency_basis','unit','payable_fee','authorization_days','release_timing','rate_applicability'])||v.unit!=='day'||v.payable_fee!==false||v.authorization_days!==null||v.release_timing!==null||v.rate_applicability!==null)throw Error('Invalid saved authorization context');
    } else if(!exact(v,['amount','currency','currency_basis','unit','min_age','max_age','eligibility','visit_date','checkout_fees'])||v.unit!=='person'||v.min_age!==7||v.max_age!==17||v.eligibility!==null||v.visit_date!==null||v.checkout_fees!==null)throw Error('Invalid saved admission context');
  }
}

function validateReview(review,packet,source,owned,config) {
  if(!requiredPending(review)||!Array.isArray(review.proposals)||!Array.isArray(review.candidate_conflicts))throw Error('Saved proposal authority or privacy drift');
  if(review.state==='rejected-proposals-review'||review.state==='source-not-retrieved-review') {
    const keys=['state','proposals','candidate_conflicts','review_required','retry_authorized','semantic_verified','public_update_authorized'];
    if(review.state==='rejected-proposals-review')keys.push('reason_code');
    if(!exact(review,keys)||review.proposals.length||review.candidate_conflicts.length||review.state==='rejected-proposals-review'&&(review.reason_code!=='invalid-or-failed-proposer'||!source.text_sha256)||review.state==='source-not-retrieved-review'&&source.text_sha256)throw Error('Invalid saved failed proposal review');
    return;
  }
  if(!exact(review,['schema_version','kind','origin','source_url','source_attempted_at','state','proposals','candidate_conflicts','review_required','retry_authorized','semantic_verified','public_update_authorized','limitations'])||review.schema_version!==1||review.kind!=='semantic-proposal-review'||review.origin!=='operator-capture-unverified'||review.source_url!==packet.source_url||review.source_attempted_at!==packet.source_attempted_at||!source.text_sha256||review.proposals.length>100||JSON.stringify(review.limitations)!==JSON.stringify(limitations))throw Error('Invalid saved typed review');
  const ids=new Set(),groups=new Map();
  for(const row of review.proposals) {
    const record=config.records.find(r=>r.id===row.field_id);
    if(!exact(row,['id','field_id','field','page_url','source_url','source_text_sha256','source_span','source_span_sha256','source_attempted_at','origin','source_authentication','kind','value','original_verified_on','evidence_path','evidence_class','unverified_context_flags','context_review','review_required','semantic_verified','public_update_authorized'])||typeof row.id!=='string'||!/^proposal-[1-9]\d{0,2}$/.test(row.id)||ids.has(row.id)||!owned.field_ids.includes(row.field_id)||!record||row.field!==record.field||row.page_url!==record.page_url||row.source_url!==packet.source_url||row.source_text_sha256!==packet.source_text_sha256||row.source_attempted_at!==packet.source_attempted_at||row.original_verified_on!==record.verified_on||row.evidence_path!==record.evidence_path||row.origin!=='operator-capture-unverified'||row.source_authentication!=='operator-supplied-not-authenticated-by-this-boundary'||row.evidence_class!=='UNVERIFIED_STRUCTURED_PROPOSAL'||row.kind!==contracts[row.field_id][0]||row.review_required!==true||row.semantic_verified!==false||row.public_update_authorized!==false)throw Error('Saved row differs from provenance or authority');
    const span=row.source_span;
    if(!exact(span,['start','end','offset_unit'])||span.offset_unit!=='normalized-text-utf16'||!Number.isInteger(span.start)||!Number.isInteger(span.end)||span.start<0||span.end<=span.start||span.end>source.text_length||span.end-span.start>1200||!hex(row.source_span_sha256))throw Error('Invalid saved source span');
    if(!exact(row.context_review,['entity','category','party','stay','conditions','freshness','instructions'])||Object.values(row.context_review).some(s=>s!=='pending')||!Array.isArray(row.unverified_context_flags)||!row.unverified_context_flags.length||row.unverified_context_flags.length>7||new Set(row.unverified_context_flags).size!==row.unverified_context_flags.length||row.unverified_context_flags.some(f=>!flags.has(f)))throw Error('Invalid saved context review');
    validateValue(row.value,row.field_id);ids.add(row.id);if(!groups.has(row.field_id))groups.set(row.field_id,[]);groups.get(row.field_id).push(row);
  }
  const conflicts=[...groups].filter(([,rows])=>new Set(rows.map(r=>canonical(r.value))).size>1).map(([field_id,rows])=>({field_id,proposal_ids:rows.map(r=>r.id),state:'candidate-value-disagreement-not-policy-finding',resolved:false,chosen_proposal_id:null}));
  if(JSON.stringify(review.candidate_conflicts)!==JSON.stringify(conflicts)||review.state!==(conflicts.length?'disputed-candidates-review':'unverified-candidates-review'))throw Error('Saved candidate disagreement drift');
}

export function aggregateProposalHandoff({plan,evidence,selection,accessHolds,config,scope,packets,generatedAt=new Date().toISOString()}) {
  ({plan,evidence,selection,accessHolds,config,scope,packets}=structuredClone({plan,evidence,selection,accessHolds,config,scope,packets}));
  validateCheckpointEvidence(plan,evidence);validateProposalScope(plan,selection,accessHolds,config,scope);
  if(!timestamp(generatedAt)||evidence.entries.some(e=>e.last_attempt_at&&e.last_attempt_at>generatedAt)||!Array.isArray(packets)||packets.length>selection.selected_source_urls.length)throw Error('Invalid proposal handoff snapshot');
  const mapped=new Map(),selected=new Set(selection.selected_source_urls);
  for(const p of packets) {
    const index=plan.sources.findIndex(s=>s.url===p.source_url),row=evidence.entries[index],owned=scope.sources.find(s=>s.url===p.source_url);
    if(!exact(p,['schema_version','kind','plan_sha256','selection_sha256','hold_registry_sha256','processing_scope_sha256','source_url','source_index','source_attempted_at','source_outcome','source_http_status','source_text_sha256','capture_join','capture_authentication','review','factual_dates_renewed','retry_authorized','public_update_authorized'])||p.schema_version!==1||p.kind!=='checkpoint-source-proposal-review'||!selected.has(p.source_url)||mapped.has(p.source_url)||!owned||row?.state!=='attempt-completed'||p.plan_sha256!==plan.plan_sha256||p.selection_sha256!==hash(selection)||p.hold_registry_sha256!==selection.hold_registry_sha256||p.processing_scope_sha256!==hash(scope)||p.source_index!==index||p.source_attempted_at!==row.last_attempt_at||p.source_outcome!==row.source.state||p.source_http_status!==(row.source.http_status??null)||p.source_text_sha256!==(row.source.text_sha256??null)||p.capture_join!==(row.source.text_sha256?'same-in-process-fetch-text':'no-retrieved-text')||p.capture_authentication!=='transport-and-operator-supplied-not-independently-authenticated'||p.factual_dates_renewed!==false||p.retry_authorized!==false||p.public_update_authorized!==false)throw Error('Saved packet differs from checkpoint scope or outcome');
    validateReview(p.review,p,row.source,owned,config);mapped.set(p.source_url,p);
  }
  const queue=evidence.entries.map(row=>{const source=plan.sources[row.index],packet=mapped.get(source.url)||null;return {index:row.index,source_url:source.url,pages:source.pages,selected:selected.has(source.url),checkpoint_state:row.state,source_outcome:row.source?.state||null,source_attempted_at:row.last_attempt_at,state:!selected.has(source.url)?'out-of-proposal-scope':row.state==='attempt-completed'?packet?'packet-present-review':'held-proposal-packet-missing':row.state==='held-outcome-unknown'?'held-source-outcome-unknown':'deferred-no-attempt',retry_authorized:false,public_update_authorized:false,packet};});
  const active=queue.filter(r=>r.selected),missing=active.filter(r=>r.state==='held-proposal-packet-missing').length;
  return {schema_version:1,kind:'checkpoint-proposal-handoff',generated_at:generatedAt,plan_sha256:plan.plan_sha256,selection_sha256:hash(selection),processing_scope_sha256:hash(scope),packets_sha256:hash(packets),checkpoint_evidence_sha256:hash(evidence),selected_packet_accounting_complete:active.every(r=>r.state==='packet-present-review'),standard_audit_handoff_authorized:false,semantic_refresh_ready:false,factual_dates_renewed:false,automatic_publication:false,retry_authorized:false,summary:{sources:queue.length,selected_sources:active.length,provided_packets:mapped.size,missing_completed_packets:missing,selected_deferred:active.filter(r=>r.state==='deferred-no-attempt').length,selected_unknown:active.filter(r=>r.state==='held-source-outcome-unknown').length,out_of_scope_sources:queue.length-active.length,all_sources_accounted:true},source_review_queue:queue,limitations:['Packet accounting is not semantic validity, complete weekly collection, independently authenticated capture or source permission.','Missing completed-source packets are owner review holds; never replay a source or fabricate a proposal to fill them.','Saved spans and hashes cannot independently revalidate lexical support without the discarded source body.','Every present packet still requires context and claim review, including rejected proposals and failed sources.','This immutable report does not extend the checkpoint journal or advance weekly/public fact clocks.']};
}

async function readJson(path) {
  if(!isAbsolute(path)||resolve(path)!==path||(await realpath(path))!==path)throw Error('Use canonical absolute input paths');
  const s=await lstat(path);if(!s.isFile()||s.isSymbolicLink()||s.size>2000000)throw Error('Require bounded regular JSON input');
  const bytes=await readFile(path);if(bytes.length>2000000)throw Error('JSON input grew beyond bound');
  try{return JSON.parse(bytes.toString('utf8'));}catch{throw Error('Invalid bounded JSON input');}
}

export async function publishProposalHandoff({directory,selection,accessHolds,config,scope,packets,output}) {
  ({selection,accessHolds,config,scope,packets}=structuredClone({selection,accessHolds,config,scope,packets}));
  if(!isAbsolute(directory)||resolve(directory)!==directory||(await realpath(directory))!==directory||!isAbsolute(output)||resolve(output)!==output||(await realpath(dirname(output)))!==dirname(output))throw Error('Use canonical absolute checkpoint and output paths');
  const inside=relative(directory,output);if(inside===''||inside==='..'||!inside.startsWith('..'+sep)&&!isAbsolute(inside))throw Error('Output must be outside checkpoint');
  const parent=await lstat(dirname(output));if(!parent.isDirectory()||parent.isSymbolicLink())throw Error('Unsafe output parent');
  const plan=validatePlan(await readJson(join(directory,'manifest.json'))),evidence=await checkpointEvidence(plan,directory);
  const report=aggregateProposalHandoff({plan,evidence,selection,accessHolds,config,scope,packets});
  const file=await open(output,'wx',0o600);try{await file.writeFile(JSON.stringify(report,null,2)+'\n');await file.sync();}finally{await file.close();}
  return report;
}

export function parseHandoffOptions(args) {
  const o={};for(let i=0;i<args.length;i+=2){const k=args[i],v=args[i+1];if(!['--checkpoint','--selection','--scope','--packets','--output'].includes(k)||Object.hasOwn(o,k)||!v||v.startsWith('--'))throw Error('Require five distinct proposal handoff paths');o[k]=v;}if(Object.keys(o).length!==5)throw Error('Explicit checkpoint selection scope packets and new output required');return o;
}
async function main() {
  const o=parseHandoffOptions(process.argv.slice(2));
  const report=await publishProposalHandoff({directory:o['--checkpoint'],selection:await readJson(o['--selection']),scope:await readJson(o['--scope']),packets:await readJson(o['--packets']),config:await readJson(resolve(ROOT,'ops/evidence-watch.json')),accessHolds:await readJson(resolve(ROOT,'ops/source-access-holds.json')),output:o['--output']});
  console.log(JSON.stringify({...report.summary,selected_packet_accounting_complete:report.selected_packet_accounting_complete,semantic_refresh_ready:false,network_calls:0,output:o['--output']}));
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)main().catch(e=>{console.error(e.message);process.exitCode=1;});
