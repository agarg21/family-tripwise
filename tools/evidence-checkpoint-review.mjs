import {readFile,writeFile,mkdir,lstat} from 'node:fs/promises';
import {resolve,join,dirname,relative,isAbsolute,sep} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {inventory,modelRecords,requireNewOutput,easternDate} from './evidence-audit.mjs';
import {validatePriorAudit} from './site-maintenance.mjs';
import {reviewAudit} from './weekly-evidence-review.mjs';
import {validatePlan,planSources,checkpointEvidence,validateCheckpointEvidence,priorAttemptAt} from './evidence-batch-pilot.mjs';

const ROOT=fileURLToPath(new URL('../',import.meta.url));
const copy=value=>JSON.parse(JSON.stringify(value));
const timestamp=value=>typeof value==='string'&&/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value)&&new Date(value).toISOString()===value;
const changed=new Set(['text-changed-review','structured-price-changed-review']);
const unavailable=new Set(['unavailable-review','challenge-or-empty-review','unsupported-format-review','size-limit-review']);

export function aggregateCheckpoint({plan,evidence,inv,previous,generatedAt,expectedRecords=[],expectedUrls=[]}) {
  validatePlan(plan);validateCheckpointEvidence(plan,evidence);validatePriorAudit(previous,plan.allowed_hosts);
  if(!timestamp(generatedAt)||generatedAt<previous.collected_at||evidence.entries.some(row=>row.last_attempt_at&&row.last_attempt_at>generatedAt))throw Error('Invalid report time or future attempt');
  const old=new Map(previous.sources.map(s=>[s.url,s]));
  for(const s of plan.sources) {
    const prior=old.has(s.url)?{...old.get(s.url),last_attempt_at:priorAttemptAt(old.get(s.url),previous.collected_at)}:null;
    if(JSON.stringify(prior)!==JSON.stringify(s.prior))throw Error('Prior audit does not match checkpoint');
  }
  const scope=inv.sources.map(s=>({url:s.url,pages:[...s.pages].sort()})).sort((a,b)=>a.url<b.url?-1:a.url>b.url?1:0);
  if(JSON.stringify(scope)!==JSON.stringify(plan.sources.map(s=>({url:s.url,pages:s.pages}))))throw Error('Current source inventory differs from checkpoint');
  const records=inv.pages.flatMap(p=>p.records||[]);
  // Validate page/model parity even when partial outcomes cannot enter the old audit schema.
  const covered=plan.sources.map(s=>({url:s.url,pages:s.pages,state:'deferred-limit'}));
  const orientation=reviewAudit({pages:inv.pages,sources:covered,factual_dates_renewed:false,collected_at:generatedAt},{sources:[],collected_at:previous.collected_at},{expectedRecords,expectedUrls});
  const counts={},queue=evidence.entries.map(row=>{
    counts[row.state]=(counts[row.state]||0)+1;
    const s=plan.sources[row.index],mapped=records.filter(r=>r.source_urls?.includes(s.url));
    const classification=row.state==='held-outcome-unknown'?'unknown-outcome-owner-reconciliation-no-retry':row.state==='held-prior-denial'?'prior-access-hold-no-retry':row.state==='deferred-no-attempt'?'deferred-no-new-evidence':changed.has(row.source.state)?'hash-delta-unreconciled-may-be-noise':unavailable.has(row.source.state)?'collection-gap-not-factual-change':'known-source-outcome-not-fact-renewal';
    return {index:row.index,url:s.url,pages:s.pages,state:row.state,outcome_state:row.source?.state||null,last_attempt_at:row.last_attempt_at,mapped_record_ids:mapped.map(r=>r.id),priority:mapped.some(r=>/price|room|fee/.test(r.field))?1:mapped.length?2:3,classification};
  }).sort((a,b)=>a.priority-b.priority||a.index-b.index);
  const ready=!counts['deferred-no-attempt']&&!counts['held-outcome-unknown'];
  let audit=null,review=null;
  if(ready) {
    const sources=evidence.entries.map(row=>row.state==='held-prior-denial'?{...row.source,pages:plan.sources[row.index].pages,state:'access-denied-carried-forward',last_attempt_at:row.last_attempt_at}:row.source);
    audit={schema_version:1,collected_at:generatedAt,mode:'public-source-diff',elapsed_seconds:null,factual_dates_renewed:false,pages:inv.pages,sources,summary:{canonical_pages:inv.pages.length,sources:sources.length,source_states:sources.reduce((a,s)=>(a[s.state]=(a[s.state]||0)+1,a),{}),due_records:records.filter(r=>r.freshness?.state==='review-due').length,unmapped_pages:inv.pages.filter(p=>p.claim_registry==='unmapped-review').length}};
    validatePriorAudit(audit,plan.allowed_hosts);
    review=reviewAudit(audit,previous,{expectedRecords,expectedUrls});
  }
  return copy({schema_version:1,kind:'checkpoint-weekly-review',generated_at:generatedAt,plan_sha256:plan.plan_sha256,factual_dates_renewed:false,automatic_publication:false,standard_audit_ready:ready,summary:{canonical_pages:inv.pages.length,sources:plan.sources.length,all_sources_accounted:true,checkpoint_states:counts,completed_outcomes:counts['attempt-completed']||0,owner_reconciliation_holds:counts['held-outcome-unknown']||0,deferred_sources:counts['deferred-no-attempt']||0,prior_access_holds:counts['held-prior-denial']||0,model_records_checked:expectedRecords.length},source_review_queue:queue,field_review_queue:orientation.field_review_queue,audit,review,limitations:['Full source accounting is not complete collection or verified claim freshness.','Unknown outcomes block standard audit handoff and require owner reconciliation, not a new checkpoint or retry.','Original access holds remain denied with original attempt dates. No changed access is inferred.','Hash deltas, extraction and price candidates are unreconciled; no source body or LLM output is published.','The existing weekly collector and scheduler are unchanged. Real weekly reliability and claim precision are not measured by fake fixtures.']});
}

export async function reviewCheckpoint({directory,previous,config,root=ROOT,generatedAt=new Date().toISOString()}) {
  previous=copy(previous);config=copy(config);
  const plan=validatePlan(JSON.parse(await readFile(join(resolve(directory),'manifest.json'),'utf8')));
  const expanded={...config,records:[...config.records,...(config.include_shared_models?modelRecords():[])]};
  const inv=await inventory(expanded,{root,today:easternDate()}),old=new Map(plan.sources.map(s=>[s.url,s.prior]));
  const rebuilt=planSources({allowedHosts:config.allowed_hosts,observedOn:plan.observed_on,notBefore:plan.collect_not_before,limit:plan.limit,sources:inv.sources.map(s=>({url:s.url,pages:s.pages,prior:old.get(s.url)||null,checks:expanded.records.filter(r=>r.source_urls?.includes(s.url)&&r.pattern).map(r=>({id:r.id,pattern:r.pattern}))}))});
  if(JSON.stringify(rebuilt)!==JSON.stringify(plan))throw Error('Current inventory/checks/allowlist changed; reconcile checkpoint');
  const evidence=await checkpointEvidence(plan,directory);
  return aggregateCheckpoint({plan,evidence,inv,previous,generatedAt,expectedRecords:config.include_shared_models?modelRecords():[],expectedUrls:inv.pages.map(p=>p.url)});
}

async function main() {
  const args=process.argv.slice(2),opts={};
  for(let i=0;i<args.length;i+=2){const k=args[i],v=args[i+1];if(!['--checkpoint','--previous','--output'].includes(k)||Object.hasOwn(opts,k)||!v||v.startsWith('--'))throw Error('Require distinct --checkpoint --previous --output values');opts[k]=v;}
  if(Object.keys(opts).length!==3)throw Error('Require checkpoint, matching prior audit and new output');
  const output=resolve(opts['--output']),inside=relative(resolve(opts['--checkpoint']),output);
  if(inside===''||(!inside.startsWith('..'+sep)&&inside!=='..'&&!isAbsolute(inside)))throw Error('Review output must be outside immutable checkpoint');
  for(let p=dirname(output);;p=dirname(p)) {
    try{const s=await lstat(p);if(s.isSymbolicLink()||!s.isDirectory())throw Error('Unsafe review output parent');}catch(e){if(e.code!=='ENOENT')throw e;}
    if(dirname(p)===p)break;
  }
  await requireNewOutput(output);
  const report=await reviewCheckpoint({directory:opts['--checkpoint'],previous:JSON.parse(await readFile(resolve(opts['--previous']),'utf8')),config:JSON.parse(await readFile(resolve(ROOT,'ops/evidence-watch.json'),'utf8'))});
  await mkdir(dirname(output),{recursive:true});await writeFile(output,JSON.stringify(report,null,2)+'\n',{flag:'wx',mode:0o600});
  console.log(JSON.stringify({...report.summary,standard_audit_ready:report.standard_audit_ready,network_calls:0,output}));
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)main().catch(e=>{console.error(e.message);process.exitCode=1;});
