import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
import {sourceSignals,permittedUrl,ageState,easternDate} from './evidence-audit.mjs';

const ROOT=fileURLToPath(new URL('../',import.meta.url));
const labels=new Set(['unchanged','navigation-noise','policy-change','wording-drift','contradiction','wrong-entity','wrong-party','stale-price','missing-age','source-instruction','denied','interrupted']);
const exact=(v,keys)=>v&&typeof v==='object'&&!Array.isArray(v)&&Object.keys(v).sort().join()===keys.slice().sort().join();
const safeId=v=>typeof v==='string'&&/^[a-z0-9][a-z0-9-]{0,99}$/.test(v);
const digest=v=>createHash('sha256').update(JSON.stringify(v)).digest('hex');
const ratio=(n,d)=>d?n/d:null;

export function validateCorpus(input,config) {
  const corpus=structuredClone(input);
  if(!exact(corpus,['schema_version','kind','observed_on','evidence_class','evidence_refs','baselines','cases'])||corpus.schema_version!==1||corpus.kind!=='synthetic-predicate-review-corpus'||corpus.evidence_class!=='SYNTHETIC_NOT_LIVE_POLICY')throw Error('Invalid synthetic corpus schema');
  ageState(null,1,corpus.observed_on);if(corpus.observed_on>easternDate())throw Error('Future corpus date');
  if(!Array.isArray(corpus.evidence_refs)||!corpus.evidence_refs.length||corpus.evidence_refs.length>10||corpus.evidence_refs.some(p=>typeof p!=='string'||!/^docs\/research\/[A-Za-z0-9-]+\.(json|md)$/.test(p)))throw Error('Invalid local evidence reference');
  if(!Array.isArray(config?.records)||!Array.isArray(config.allowed_hosts))throw Error('Missing reviewed watch registry');
  const watched=new Map(config.records.map(r=>[r.id,r]));
  if(watched.size!==config.records.length)throw Error('Duplicate watch ID');
  if(!Array.isArray(corpus.baselines)||!corpus.baselines.length||corpus.baselines.length>32||!Array.isArray(corpus.cases)||!corpus.cases.length||corpus.cases.length>100)throw Error('Invalid corpus bounds');
  const html=v=>typeof v==='string'&&v.length>0&&v.length<=8000&&!/[\0]/.test(v);
  const bases=new Map();
  for(const b of corpus.baselines) {
    if(!exact(b,['id','source_url','check_ids','html'])||!safeId(b.id)||bases.has(b.id)||!html(b.html)||!Array.isArray(b.check_ids)||!b.check_ids.length||b.check_ids.length>20||b.check_ids.some(id=>!safeId(id))||new Set(b.check_ids).size!==b.check_ids.length)throw Error('Invalid or duplicate baseline');
    if(permittedUrl(b.source_url,config.allowed_hosts)!==b.source_url)throw Error('Unsafe source identity');
    for(const id of b.check_ids){const r=watched.get(id);if(!r||!r.source_urls?.includes(b.source_url)||typeof r.pattern!=='string'||!r.pattern.length||r.pattern.length>1000)throw Error('Check differs from approved source scope');new RegExp(r.pattern,'i');}
    bases.set(b.id,b);
  }
  const ids=new Set();
  for(const c of corpus.cases) {
    if(!exact(c,['id','baseline_id','label','critical','review_required','semantic_change','after'])||!safeId(c.id)||ids.has(c.id)||!bases.has(c.baseline_id)||!labels.has(c.label)||typeof c.critical!=='boolean'||typeof c.review_required!=='boolean'||![true,false,null].includes(c.semantic_change)||!exact(c.after,['state','html']))throw Error('Invalid or duplicate labeled case');
    if(c.critical&&!c.review_required||c.semantic_change===true&&!c.review_required)throw Error('Inconsistent review oracle');
    if(c.after.state==='retrieved') {
      if(!html(c.after.html)||['denied','interrupted'].includes(c.label))throw Error('Invalid retrieved fixture');
    } else if(c.after.state==='held-denial'||c.after.state==='held-unknown') {
      if(c.after.html!==null||!c.review_required||c.semantic_change!==null||c.critical||c.label!==(c.after.state==='held-denial'?'denied':'interrupted'))throw Error('Invalid held fixture');
    } else throw Error('Unknown outcome state');
    if(['unchanged','navigation-noise'].includes(c.label)&&(c.review_required||c.critical||c.semantic_change!==false))throw Error('Inconsistent no-change oracle');
    if(!['unchanged','navigation-noise'].includes(c.label)&&!c.review_required)throw Error('Review-required label cannot bypass review');
    if(c.label==='policy-change'&&c.semantic_change!==true||c.label==='wording-drift'&&c.semantic_change!==false)throw Error('Inconsistent semantic oracle label');
    ids.add(c.id);
  }
  return corpus;
}

function confusion(rows,key) {
  let tp=0,fp=0,tn=0,fn=0;
  for(const r of rows){if(r.review_required){if(r[key])tp++;else fn++;}else if(r[key])fp++;else tn++;}
  const critical=rows.filter(r=>r.critical),caught=critical.filter(r=>r[key]);
  return {true_positive:tp,false_positive:fp,true_negative:tn,false_negative:fn,review_precision:ratio(tp,tp+fp),review_recall:ratio(tp,tp+fn),critical_cases:critical.length,critical_detected:caught.length,critical_review_recall:ratio(caught.length,critical.length),missed_critical_case_ids:critical.filter(r=>!r[key]).map(r=>r.id)};
}

export function evaluateCorpus(input,config) {
  const corpus=validateCorpus(input,config),watched=new Map(config.records.map(r=>[r.id,r]));
  const bases=new Map(corpus.baselines.map(b=>{
    const checks=b.check_ids.map(id=>({id,pattern:watched.get(id).pattern})),signals=sourceSignals(b.html,checks);
    if(signals.fields.some(f=>f.state!=='expected-text-present'))throw Error('Synthetic baseline no longer matches reviewed predicates');
    return [b.id,{...b,checks,signals}];
  }));
  const results=corpus.cases.map(c=>{
    const b=bases.get(c.baseline_id),held=c.after.state!=='retrieved';
    const after=held?null:sourceSignals(c.after.html,b.checks),missing=after?.fields.filter(f=>f.state==='expected-text-missing-review').map(f=>f.id)||[];
    return {id:c.id,label:c.label,source_url:b.source_url,critical:c.critical,review_required:c.review_required,semantic_change_oracle:c.semantic_change,outcome:c.after.state,before_fixture_text_sha256:b.signals.text_sha256,after_fixture_text_sha256:after?.text_sha256||null,predicate_shortcut_review:held?null:missing.length>0,text_hash_review:held?null:after.text_sha256!==b.signals.text_sha256,missing_predicate_ids:missing,hold_required:held,retry_authorized:false,claim_verified:false};
  });
  const retrieved=results.filter(r=>r.outcome==='retrieved'),predicate=confusion(retrieved,'predicate_shortcut_review'),textHash=confusion(retrieved,'text_hash_review');
  const scope=corpus.baselines.map(b=>({id:b.id,source_url:b.source_url,checks:b.check_ids.map(id=>({id,pattern:watched.get(id).pattern}))}));
  const triagePass=predicate.critical_review_recall===1&&predicate.review_precision!==null&&predicate.review_precision>=0.95;
  return {schema_version:1,kind:'synthetic-predicate-review-evaluation',observed_on:corpus.observed_on,evidence_class:corpus.evidence_class,corpus_sha256:digest(corpus),reviewed_predicate_scope_sha256:digest(scope),evidence_refs:corpus.evidence_refs,summary:{cases:results.length,retrieved_cases:retrieved.length,held_cases:results.length-retrieved.length,predicate_shortcut:predicate,text_hash_only:textHash},experimental_fixture_gate:{critical_review_recall_target:1,review_precision_target:0.95,passed:triagePass},semantic_claim_precision:null,semantic_refresh_ready:false,factual_dates_renewed:false,automatic_publication:false,network_calls:0,llm_calls:0,results,limitations:['This tests a hypothetical missing-predicate shortcut, not current collector routing: current atomic queues retain all positive and missing candidates for review.','Human labels describe synthetic review need, not live policy changes or representative accuracy; retrieved precision/recall exclude held outcomes.','A matched clause may coexist with contradictory, wrong-entity, wrong-party, stale or instructional text. Missing text may be parser drift rather than a policy change.','Whole-text hash changes may be navigation noise; a hash does not normalize claims. No detector here emits verified semantic claims.','Fixture success is not two actual weekly cycles, source governance, current quote, family eligibility, parent preference or SEO proof.']};
}

export function parseEvalOptions(args) {
  const opts={};
  for(let i=0;i<args.length;i++){const k=args[i];if(!['--corpus','--output'].includes(k)||Object.hasOwn(opts,k)||!args[i+1]||args[i+1].startsWith('--'))throw Error('Invalid or duplicate evaluation option');opts[k]=args[++i];}
  if(!opts['--corpus'])throw Error('Explicit synthetic corpus required');
  return opts;
}

async function main() {
  const opts=parseEvalOptions(process.argv.slice(2)),raw=await readFile(resolve(opts['--corpus']));if(raw.length>2000000)throw Error('Corpus size limit');
  const config=JSON.parse(await readFile(resolve(ROOT,'ops/evidence-watch.json'),'utf8')),corpus=JSON.parse(raw),report=evaluateCorpus(corpus,config);
  for(const p of corpus.evidence_refs)await readFile(resolve(ROOT,p));
  if(opts['--output'])await writeFile(resolve(opts['--output']),JSON.stringify(report,null,2)+'\n',{flag:'wx'});
  console.log(JSON.stringify({summary:report.summary,experimental_fixture_gate:report.experimental_fixture_gate,semantic_refresh_ready:false,network_calls:0,llm_calls:0,output:opts['--output']||null}));
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)main().catch(e=>{console.error(e.message);process.exitCode=1;});
