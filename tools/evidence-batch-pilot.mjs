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
    if (!Array.isArray(source.checks) || source.checks.some(c => !exact(c,['id','pattern']) || typeof c.id!=='string' || typeof c.pattern!=='string' || !c.id || c.pattern.length>1000)) throw Error('Invalid extraction checks');
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
  return validatePlan(planSources({allowedHosts:config.allowed_hosts,observedOn:today,notBefore,limit,sources:inv.sources.map(s=>({url:s.url,pages:s.pages,prior:old.has(s.url)?{...old.get(s.url),last_attempt_at:old.get(s.url).last_attempt_at||previous.collected_at}:null,checks:expanded.records.filter(r=>r.source_urls?.includes(s.url)&&r.pattern).map(r=>({id:r.id,pattern:r.pattern}))}))}));
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

export async function runCheckpointBatch(plan,index,directory,{collect=false,executeSource=async s=>compareSource(await fetchSource(s.url,plan.allowed_hosts,s.checks),s.prior)}={}) {
  plan=validatePlan(copy(plan));const today=easternDate(),batch=batches(plan)[index];
  if(collect!==true||!Number.isInteger(index)||!batch||today<plan.collect_not_before||typeof executeSource!=='function')throw Error('Explicit eligible bounded collection required');
  const dir=await safeDirectory(directory),lock=await open(join(dir,'writer.lock'),'wx',0o600);
  try {
    await lock.writeFile(plan.plan_sha256+'\n');await lock.sync();
    const status=await checkpointStatus(plan,dir);
    for(const row of status.rows.slice(batch.start,batch.start+batch.count)) {
      if(row.state!=='deferred-no-attempt')continue;
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
  for(let i=0;i<args.length;i++){const k=args[i];if(Object.hasOwn(opts,k)||!['--create','--status','--collect','--checkpoint','--previous','--batch'].includes(k))throw Error('Unknown or duplicate pilot option');if(['--create','--status','--collect'].includes(k))opts[k]=true;else{if(!args[i+1]||args[i+1].startsWith('--'))throw Error('Missing pilot option value');opts[k]=args[++i];}}
  if([opts['--create'],opts['--status'],opts['--collect']].filter(Boolean).length!==1||!opts['--checkpoint'])throw Error('Select one explicit pilot mode and checkpoint');
  const dir=resolve(opts['--checkpoint']);let plan;
  if(opts['--create']) {
    if(!opts['--previous']||opts['--batch'])throw Error('Create requires prior audit only');
    const operator=JSON.parse(await readFile(resolve(ROOT,'ops/operator.json'),'utf8'));
    plan=await currentPlan({previous:JSON.parse(await readFile(resolve(opts['--previous']),'utf8')),config:JSON.parse(await readFile(resolve(ROOT,'ops/evidence-watch.json'),'utf8')),notBefore:operator.weekly_evidence_audit.next_due_on});
    await initializeCheckpoint(plan,dir);console.log(JSON.stringify({source_count:plan.sources.length,batches:batches(plan),collect_not_before:plan.collect_not_before,network_calls:0}));
  } else {
    if(opts['--previous']||(!opts['--collect']&&opts['--batch']))throw Error('Unexpected pilot option');
    plan=validatePlan(await regular(join(dir,'manifest.json')));
    if(opts['--collect']) {
      const config=JSON.parse(await readFile(resolve(ROOT,'ops/evidence-watch.json'),'utf8'));
      const expanded={...config,records:[...config.records,...(config.include_shared_models?modelRecords():[])]};
      const inv=await inventory(expanded,{root:ROOT,today:plan.observed_on}),old=new Map(plan.sources.map(s=>[s.url,s.prior]));
      const rebuilt=planSources({allowedHosts:config.allowed_hosts,observedOn:plan.observed_on,notBefore:plan.collect_not_before,limit:plan.limit,sources:inv.sources.map(s=>({url:s.url,pages:s.pages,prior:old.get(s.url)||null,checks:expanded.records.filter(r=>r.source_urls?.includes(s.url)&&r.pattern).map(r=>({id:r.id,pattern:r.pattern}))}))});
      if(JSON.stringify(rebuilt)!==JSON.stringify(plan))throw Error('Current inventory changed; reconcile before collection');
    }
    const status=opts['--collect']?await runCheckpointBatch(plan,Number(opts['--batch']),dir,{collect:true}):await checkpointStatus(plan,dir);
    console.log(JSON.stringify({...status,rows:undefined}));
  }
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)main().catch(e=>{console.error(e.message);process.exitCode=1;});
