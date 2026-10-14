import {readFile, mkdir, open, lstat, readdir, unlink} from 'node:fs/promises';
import {resolve, join, dirname} from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {inventory, modelRecords, permittedUrl} from './evidence-audit.mjs';
import {easternDate, ageState, fetchSource, compareSource} from './evidence-audit.mjs';
import {validatePriorAudit} from './site-maintenance.mjs';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const hash = value => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const denied = source => [401,403].includes(source?.http_status) || ['challenge-or-empty-review','access-denied-carried-forward'].includes(source?.state);
const date = value => { ageState(null,1,value); return value; };
const copy = value => JSON.parse(JSON.stringify(value));
const timestamp = value => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value) && new Date(value).toISOString() === value;
const exact = (value, keys) => value && typeof value === 'object' && !Array.isArray(value) && Object.keys(value).sort().join() === [...keys].sort().join();

export const priorAttemptAt = (source,collectedAt) => source.last_attempt_at || (source.http_status || source.text_sha256 || denied(source) ? collectedAt : null);

export function validateAccessHolds(registry) {
  if(!exact(registry,['schema_version','kind','holds'])||registry.schema_version!==1||registry.kind!=='documented-source-access-holds'||!Array.isArray(registry.holds)||registry.holds.length>1000)throw Error('Invalid documented access registry');
  const urls=new Set();
  for(const hold of registry.holds) {
    if(!exact(hold,['url','observed_on','reason','evidence_path'])||typeof hold.url!=='string'||hold.url.length>8192||urls.has(hold.url))throw Error('Invalid or duplicate documented access hold');
    const u=new URL(hold.url);if(permittedUrl(hold.url,[u.hostname])!==hold.url)throw Error('Unsafe documented access URL');urls.add(hold.url);
    date(hold.observed_on);if(hold.observed_on>easternDate()||!['documented-throttling-hold','documented-blank-ticket-hold','documented-nonretryable-access-hold'].includes(hold.reason))throw Error('Invalid access hold date or class');
    if(typeof hold.evidence_path!=='string'||hold.evidence_path.length>512||!/^docs\/research\/[A-Za-z0-9._/-]+\.(json|md)$/.test(hold.evidence_path)||hold.evidence_path.split('/').some(x=>!x||x==='.'||x==='..'))throw Error('Invalid access evidence reference');
  }
  return registry;
}

export function collectionSelection(plan,registry,selectedUrls) {
  const selection={schema_version:1,kind:'reviewed-source-selection',plan_sha256:plan.plan_sha256,hold_registry_sha256:hash(registry),selected_source_urls:[...selectedUrls].sort()};
  return validateCollectionSelection(plan,selection,registry);
}

export function validateCollectionSelection(plan,selection,registry) {
  validatePlan(plan);validateAccessHolds(registry);
  if(!exact(selection,['schema_version','kind','plan_sha256','hold_registry_sha256','selected_source_urls'])||selection.schema_version!==1||selection.kind!=='reviewed-source-selection'||selection.plan_sha256!==plan.plan_sha256||selection.hold_registry_sha256!==hash(registry)||!Array.isArray(selection.selected_source_urls)||selection.selected_source_urls.length>500||new Set(selection.selected_source_urls).size!==selection.selected_source_urls.length)throw Error('Invalid or changed source selection');
  if(JSON.stringify([...selection.selected_source_urls].sort())!==JSON.stringify(selection.selected_source_urls))throw Error('Source selection must be deterministic');
  const sources=new Map(plan.sources.map(s=>[s.url,s])),holds=new Set(registry.holds.map(h=>h.url));
  for(const url of selection.selected_source_urls) {
    const source=sources.get(url);if(typeof url!=='string'||!source||denied(source.prior)||holds.has(url))throw Error('Unapproved or held source cannot be selected');
  }
  return selection;
}

export async function executeSelectedSource(source,plan,selection,registry,{fetcher=fetch}={}) {
  plan=validatePlan(copy(plan));selection=copy(selection);registry=copy(registry);validateCollectionSelection(plan,selection,registry);
  const retained=plan.sources.find(s=>s.url===source.url);
  if(!retained||JSON.stringify(retained)!==JSON.stringify(source)||!selection.selected_source_urls.includes(source.url))throw Error('Source execution differs from reviewed selection');
  // One exact-address fetch; even a self-redirect needs separate reconciliation.
  let requested=false;
  const guarded=async(url,options)=>{if(requested||url!==retained.url)throw Error('Redirect requires separate exact-source reconciliation');requested=true;return fetcher(url,options);};
  return compareSource(await fetchSource(retained.url,plan.allowed_hosts,retained.checks,{fetcher:guarded}),retained.prior);
}

function validateSourceScalars(source) {
  if (!source || typeof source!=='object' || Array.isArray(source) || typeof source.url!=='string' || typeof source.state!=='string' || !Array.isArray(source.pages) || source.pages.some(p=>typeof p!=='string')) throw Error('Invalid scalar source identity');
  const boundedText=(key,max,allowEmpty=false)=>{if(Object.hasOwn(source,key)&&(typeof source[key]!=='string'||(!allowEmpty&&!source[key].length)||source[key].length>max||/[\r\n\0]/.test(source[key])))throw Error('Invalid scalar source metadata');};
  boundedText('reason',1000);boundedText('content_type',256,true);boundedText('error_kind',64);boundedText('final_url',8192);
  if(Object.hasOwn(source,'http_status')&&(!Number.isInteger(source.http_status)||source.http_status<100||source.http_status>599))throw Error('Invalid HTTP status');
  if(Object.hasOwn(source,'text_length')&&(!Number.isInteger(source.text_length)||source.text_length<0||source.text_length>3000000))throw Error('Invalid source text length');
  if(Object.hasOwn(source,'collection_deferred')&&typeof source.collection_deferred!=='boolean')throw Error('Invalid deferred flag');
  if(Object.hasOwn(source,'error_kind')&&!['timeout','fetch-or-policy-error'].includes(source.error_kind))throw Error('Invalid error class');
  for(const key of ['text_sha256','price_sha256'])if(Object.hasOwn(source,key)&&(typeof source[key]!=='string'||!/^[a-f0-9]{64}$/.test(source[key])))throw Error('Invalid source hash');
  if(Object.hasOwn(source,'last_attempt_at')&&source.last_attempt_at!==null&&!timestamp(source.last_attempt_at))throw Error('Invalid source attempt date');
}

export function planSources({sources, allowedHosts, observedOn, notBefore, limit = 500}) {
  date(observedOn); date(notBefore);
  if (!Number.isInteger(limit) || limit < 1 || limit > 500 || !Array.isArray(allowedHosts) || !allowedHosts.length || new Set(allowedHosts).size !== allowedHosts.length || !Array.isArray(sources) || !sources.length) throw Error('Invalid bounded source plan');
  for(const source of sources)if(source.prior)validateSourceScalars(source.prior);
  const entries = copy(sources).sort((a,b) => a.url<b.url?-1:a.url>b.url?1:0);
  const urls = new Set();
  for (const source of entries) {
    if (!exact(source,['url','pages','prior','checks']) || permittedUrl(source.url,allowedHosts) !== source.url || urls.has(source.url)) throw Error('Unsafe or duplicate source identity');
    urls.add(source.url);
    if (!Array.isArray(source.pages) || !source.pages.length || new Set(source.pages).size !== source.pages.length || source.pages.some(p => {const u=new URL(p);return u.origin!=='https://familytripwise.com'||u.search||u.hash;})) throw Error('Invalid affected page');
    if (!Array.isArray(source.checks) || new Set(source.checks.map(c=>c?.id)).size!==source.checks.length || source.checks.some(c => !exact(c,['id','pattern']) || typeof c.id!=='string' || typeof c.pattern!=='string' || !c.id || c.pattern.length>1000)) throw Error('Invalid extraction checks');
    for (const c of source.checks) new RegExp(c.pattern,'i');
    if (source.prior && source.prior.url !== source.url) throw Error('Prior source identity mismatch');
    source.pages.sort();
  }
  const body={schema_version:1,kind:'bounded-source-checkpoint-pilot',observed_on:observedOn,collect_not_before:notBefore,limit,allowed_hosts:[...allowedHosts].sort(),sources:entries};
  return {...body,plan_sha256:hash(body)};
}

export function validatePlan(plan) {
  if (!exact(plan,['schema_version','kind','observed_on','collect_not_before','limit','allowed_hosts','sources','plan_sha256']) || plan.schema_version!==1 || plan.kind!=='bounded-source-checkpoint-pilot') throw Error('Invalid pilot manifest');
  const rebuilt=planSources({sources:plan.sources,allowedHosts:plan.allowed_hosts,observedOn:plan.observed_on,notBefore:plan.collect_not_before,limit:plan.limit});
  if (JSON.stringify(rebuilt)!==JSON.stringify(plan)) throw Error('Changed pilot manifest');
  // Reuse the public-source schema/privacy validation for every retained prior record.
  const prior=plan.sources.map(x=>x.prior).filter(Boolean);
  if (prior.length) validatePriorAudit({schema_version:1,mode:'public-source-diff',factual_dates_renewed:false,collected_at:new Date(Math.max(...prior.map(x=>Date.parse(x.last_attempt_at||`${plan.observed_on}T12:00:00Z`)))).toISOString(),pages:[...new Set(prior.flatMap(x=>x.pages))].map(url=>({url})),sources:prior,summary:{canonical_pages:new Set(prior.flatMap(x=>x.pages)).size,sources:prior.length}},plan.allowed_hosts);
  return plan;
}

export async function currentPlan({root=ROOT,today=easternDate(),notBefore,previous,config,limit=500}) {
  previous=copy(previous);config=copy(config);
  validatePriorAudit(previous,config.allowed_hosts);
  const expanded={...config,records:[...config.records,...(config.include_shared_models?modelRecords():[])]};
  const inv=await inventory(expanded,{root,today});
  const old=new Map(previous.sources.map(x=>[x.url,x]));
  return validatePlan(planSources({allowedHosts:config.allowed_hosts,observedOn:today,notBefore,limit,sources:inv.sources.map(s=>({url:s.url,pages:s.pages,prior:old.has(s.url)?{...old.get(s.url),last_attempt_at:priorAttemptAt(old.get(s.url),previous.collected_at)}:null,checks:expanded.records.filter(r=>r.source_urls?.includes(s.url)&&r.pattern).map(r=>({id:r.id,pattern:r.pattern}))}))}));
}

export function batches(plan) {
  validatePlan(plan);
  return Array.from({length:Math.ceil(plan.sources.length/plan.limit)},(_,index)=>({index,start:index*plan.limit,count:Math.min(plan.limit,plan.sources.length-index*plan.limit)}));
}

const name = index => String(index).padStart(8,'0');
async function regular(path) {const s=await lstat(path);if (!s.isFile()||s.isSymbolicLink()) throw Error('Journal entries must be regular files');return JSON.parse(await readFile(path,'utf8'));}
async function safeDirectory(directory,create=false) {
  const absolute=resolve(directory);
  for(let p=absolute;;p=dirname(p)){try{const s=await lstat(p);if(s.isSymbolicLink()||!s.isDirectory())throw Error('Unsafe checkpoint directory');}catch(e){if(e.code!=='ENOENT')throw e;}if(dirname(p)===p)break;}
  if(create)await mkdir(absolute,{recursive:true});else if(!(await lstat(absolute)).isDirectory())throw Error('Missing checkpoint directory');return absolute;
}
async function writeNew(path,value) {const f=await open(path,'wx',0o600);try{await f.writeFile(JSON.stringify(value)+'\n');await f.sync();}finally{await f.close();}const parent=await open(dirname(path),'r');try{await parent.sync();}finally{await parent.close();}}

export async function initializeCheckpoint(plan,directory) {
  plan=validatePlan(copy(plan));const dir=await safeDirectory(directory,true);
  if ((await readdir(dir)).length) throw Error('Checkpoint directory must be new and empty');
  await writeNew(join(dir,'manifest.json'),plan);
  return dir;
}

function validateResult(plan,index,result) {
  const s=plan.sources[index];
  validateSourceScalars(result?.source);
  if (!exact(result,['plan_sha256','index','attempted_at','source']) || result.plan_sha256!==plan.plan_sha256 || result.index!==index || !timestamp(result.attempted_at) || result.source?.url!==s.url || JSON.stringify(result.source.pages)!==JSON.stringify(s.pages)) throw Error('Invalid source result');
  if(!['retrieved-baseline','text-unchanged','text-changed-review','structured-price-changed-review','unavailable-review','challenge-or-empty-review','unsupported-format-review','size-limit-review'].includes(result.source.state)||Object.hasOwn(result.source,'collection_deferred'))throw Error('Result must describe an actual attempt outcome');
  const ids=(result.source.fields||[]).map(f=>f.id),expected=s.checks.map(c=>c.id);
  const retrieved=['retrieved-baseline','text-unchanged','text-changed-review','structured-price-changed-review'].includes(result.source.state);
  if(new Set(ids).size!==ids.length||ids.some(id=>!expected.includes(id))||(retrieved?(!result.source.text_sha256||ids.length!==expected.length):(ids.length>0||result.source.text_sha256)))throw Error('Extraction must match planned predicates and known retrieval');
  validatePriorAudit({schema_version:1,mode:'public-source-diff',factual_dates_renewed:false,collected_at:result.attempted_at,pages:s.pages.map(url=>({url})),sources:[result.source],summary:{canonical_pages:s.pages.length,sources:1}},plan.allowed_hosts);
}

export async function checkpointStatus(plan,directory) {
  plan=validatePlan(copy(plan));const dir=await safeDirectory(directory),stored=await regular(join(dir,'manifest.json'));
  if(JSON.stringify(stored)!==JSON.stringify(plan))throw Error('Checkpoint manifest differs; do not replay');
  const filenames=await readdir(dir),allowed=new Set(['manifest.json','writer.lock']);
  const rows=[];
  for(let index=0;index<plan.sources.length;index++) {
    const s=plan.sources[index],startName=name(index)+'.start.json',resultName=name(index)+'.result.json';allowed.add(startName);allowed.add(resultName);
    const started=filenames.includes(startName),finished=filenames.includes(resultName);
    if(finished&&!started)throw Error('Result without immutable attempt');
    let state=denied(s.prior)?'held-prior-denial':'deferred-no-attempt',attemptedAt=s.prior?.last_attempt_at||null;
    if(started) {
      if(denied(s.prior))throw Error('Prior denial was attempted');
      const start=await regular(join(dir,startName));
      if(!exact(start,['plan_sha256','index','url','attempted_at'])||start.plan_sha256!==plan.plan_sha256||start.index!==index||start.url!==s.url||!timestamp(start.attempted_at))throw Error('Invalid immutable attempt');
      state='held-outcome-unknown';attemptedAt=start.attempted_at;
      if(finished){const result=await regular(join(dir,resultName));validateResult(plan,index,result);if(result.attempted_at!==start.attempted_at)throw Error('Attempt/result timestamp mismatch');state='attempt-completed';}
    }
    rows.push({index,url:s.url,state,last_attempt_at:attemptedAt});
  }
  if(filenames.some(x=>!allowed.has(x)))throw Error('Unexpected journal entry');
  const counts=rows.reduce((a,x)=>(a[x.state]=(a[x.state]||0)+1,a),{});
  return {schema_version:1,plan_sha256:plan.plan_sha256,source_count:rows.length,counts,all_sources_accounted:rows.length===plan.sources.length,attempts_finished_or_held:!rows.some(x=>x.state==='deferred-no-attempt'),factual_dates_renewed:false,automatic_publication:false,rows,limitation:'Attempt accounting only, not verified facts or a replacement weekly audit; unknown outcomes require owner reconciliation, never automatic retry.'};
}

export function validateCheckpointEvidence(plan,evidence) {
  validatePlan(plan);
  if(!exact(evidence,['schema_version','kind','plan_sha256','entries'])||evidence.schema_version!==1||evidence.kind!=='checkpoint-evidence'||evidence.plan_sha256!==plan.plan_sha256||!Array.isArray(evidence.entries)||evidence.entries.length!==plan.sources.length)throw Error('Invalid complete checkpoint evidence');
  for(let index=0;index<plan.sources.length;index++) {
    const row=evidence.entries[index],s=plan.sources[index];
    if(!exact(row,['index','state','last_attempt_at','source'])||row.index!==index)throw Error('Invalid checkpoint evidence identity');
    if(row.last_attempt_at!==null&&!timestamp(row.last_attempt_at))throw Error('Invalid checkpoint evidence date');
    if(['attempt-completed','held-outcome-unknown'].includes(row.state)&&s.prior?.last_attempt_at&&row.last_attempt_at<s.prior.last_attempt_at)throw Error('Attempt predates retained evidence');
    if(row.state==='attempt-completed') {
      if(denied(s.prior)||row.source?.last_attempt_at!==row.last_attempt_at)throw Error('Lost attempt date or retried denial');
      validateResult(plan,index,{plan_sha256:plan.plan_sha256,index,attempted_at:row.last_attempt_at,source:row.source});
    } else if(row.state==='held-outcome-unknown') {
      if(denied(s.prior)||row.source!==null||!timestamp(row.last_attempt_at))throw Error('Unknown outcome must remain a hold');
    } else if(['held-prior-denial','deferred-no-attempt'].includes(row.state)) {
      if((row.state==='held-prior-denial')!==denied(s.prior)||JSON.stringify(row.source)!==JSON.stringify(s.prior)||row.last_attempt_at!==(s.prior?.last_attempt_at||null))throw Error('Prior evidence or original date drift');
    } else throw Error('Unknown checkpoint evidence state');
  }
  return evidence;
}

export async function checkpointEvidence(plan,directory) {
  plan=validatePlan(copy(plan));const dir=await safeDirectory(directory);
  const noWriter=async()=>{if((await readdir(dir)).includes('writer.lock'))throw Error('Active or stale writer requires owner reconciliation before export');};
  await noWriter();const before=await checkpointStatus(plan,dir),entries=[];
  for(const row of before.rows) {
    const source=row.state==='attempt-completed'?(await regular(join(dir,name(row.index)+'.result.json'))).source:row.state==='held-outcome-unknown'?null:plan.sources[row.index].prior;
    entries.push({index:row.index,state:row.state,last_attempt_at:row.last_attempt_at,source});
  }
  const evidence=validateCheckpointEvidence(plan,{schema_version:1,kind:'checkpoint-evidence',plan_sha256:plan.plan_sha256,entries});
  await noWriter();const after=await checkpointStatus(plan,dir);
  if(JSON.stringify(before)!==JSON.stringify(after))throw Error('Checkpoint changed during export');
  return evidence;
}

export async function runCheckpointBatch(plan,index,directory,{collect=false,selection=null,accessHolds=null,executeSource=null}={}) {
  plan=validatePlan(copy(plan));const today=easternDate(),batch=batches(plan)[index];
  if(collect!==true||!Number.isInteger(index)||!batch||today<plan.collect_not_before||(executeSource!==null&&typeof executeSource!=='function'))throw Error('Explicit eligible bounded collection required');
  accessHolds=validateAccessHolds(copy(accessHolds));selection=validateCollectionSelection(plan,copy(selection),accessHolds);const selected=new Set(selection.selected_source_urls);
  executeSource ||= s=>executeSelectedSource(s,plan,selection,accessHolds);
  const dir=await safeDirectory(directory),lock=await open(join(dir,'writer.lock'),'wx',0o600);
  try {
    await lock.writeFile(plan.plan_sha256+'\n');await lock.sync();
    const status=await checkpointStatus(plan,dir);
    for(const row of status.rows.slice(batch.start,batch.start+batch.count)) {
      if(row.state!=='deferred-no-attempt'||!selected.has(row.url))continue;
      const source=plan.sources[row.index],attemptedAt=new Date().toISOString();
      // An immutable attempt precedes the request; a missing result becomes a hold.
      await writeNew(join(dir,name(row.index)+'.start.json'),{plan_sha256:plan.plan_sha256,index:row.index,url:source.url,attempted_at:attemptedAt});
      const response=await executeSource(copy(source));
      if(response?.url!==source.url)throw Error('Returned source identity mismatch');
      const result={plan_sha256:plan.plan_sha256,index:row.index,attempted_at:attemptedAt,source:{...response,url:source.url,pages:source.pages,last_attempt_at:attemptedAt}};
      validateResult(plan,row.index,result);
      await writeNew(join(dir,name(row.index)+'.result.json'),result);
    }
    return await checkpointStatus(plan,dir);
  } finally {await lock.close();await unlink(join(dir,'writer.lock'));}
}

async function main() {
  const args=process.argv.slice(2),opts={};
  for(let i=0;i<args.length;i++){const k=args[i];if(Object.hasOwn(opts,k)||!['--create','--status','--collect','--checkpoint','--previous','--batch','--selection'].includes(k))throw Error('Unknown or duplicate pilot option');if(['--create','--status','--collect'].includes(k))opts[k]=true;else{if(!args[i+1]||args[i+1].startsWith('--'))throw Error('Missing pilot option value');opts[k]=args[++i];}}
  if([opts['--create'],opts['--status'],opts['--collect']].filter(Boolean).length!==1||!opts['--checkpoint'])throw Error('Select one explicit pilot mode and checkpoint');
  const dir=resolve(opts['--checkpoint']);let plan;
  if(opts['--create']) {
    if(!opts['--previous']||opts['--batch']||opts['--selection'])throw Error('Create requires prior audit only');
    const operator=JSON.parse(await readFile(resolve(ROOT,'ops/operator.json'),'utf8'));
    plan=await currentPlan({previous:JSON.parse(await readFile(resolve(opts['--previous']),'utf8')),config:JSON.parse(await readFile(resolve(ROOT,'ops/evidence-watch.json'),'utf8')),notBefore:operator.weekly_evidence_audit.next_due_on});
    await initializeCheckpoint(plan,dir);console.log(JSON.stringify({source_count:plan.sources.length,batches:batches(plan),collect_not_before:plan.collect_not_before,network_calls:0}));
  } else {
    if(opts['--previous']||(!opts['--collect']&&(opts['--batch']||opts['--selection'])))throw Error('Unexpected pilot option');
    plan=validatePlan(await regular(join(dir,'manifest.json')));
    if(opts['--collect']) {
      const config=JSON.parse(await readFile(resolve(ROOT,'ops/evidence-watch.json'),'utf8'));
      const expanded={...config,records:[...config.records,...(config.include_shared_models?modelRecords():[])]};
      const inv=await inventory(expanded,{root:ROOT,today:plan.observed_on}),old=new Map(plan.sources.map(s=>[s.url,s.prior]));
      const rebuilt=planSources({allowedHosts:config.allowed_hosts,observedOn:plan.observed_on,notBefore:plan.collect_not_before,limit:plan.limit,sources:inv.sources.map(s=>({url:s.url,pages:s.pages,prior:old.get(s.url)||null,checks:expanded.records.filter(r=>r.source_urls?.includes(s.url)&&r.pattern).map(r=>({id:r.id,pattern:r.pattern}))}))});
      if(JSON.stringify(rebuilt)!==JSON.stringify(plan))throw Error('Current inventory changed; reconcile before collection');
    }
    let selection,accessHolds;
    if(opts['--collect']) {
      if(!opts['--selection'])throw Error('Collection requires explicit reviewed source selection');
      await safeDirectory(resolve(ROOT,'ops'));accessHolds=validateAccessHolds(await regular(resolve(ROOT,'ops/source-access-holds.json')));
      for(const hold of accessHolds.holds)await readFile(resolve(ROOT,hold.evidence_path));
      await safeDirectory(dirname(resolve(opts['--selection'])));selection=validateCollectionSelection(plan,await regular(resolve(opts['--selection'])),accessHolds);
    }
    const status=opts['--collect']?await runCheckpointBatch(plan,Number(opts['--batch']),dir,{collect:true,selection,accessHolds}):await checkpointStatus(plan,dir);
    console.log(JSON.stringify({...status,rows:undefined}));
  }
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)main().catch(e=>{console.error(e.message);process.exitCode=1;});
