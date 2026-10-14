import {createHash} from 'node:crypto';
import {easternDate,ageState} from './evidence-audit.mjs';
import {validatePlan,validateCollectionSelection,executeSelectedSource} from './evidence-batch-pilot.mjs';
import {reviewProposals} from './semantic-proposal-review.mjs';

const hash=v=>createHash('sha256').update(JSON.stringify(v)).digest('hex');
const exact=(v,keys)=>v&&typeof v==='object'&&!Array.isArray(v)&&Object.keys(v).sort().join()===keys.slice().sort().join();
const fields=new Set(['dana-standard-room-capacity-predicate','dana-junior-suite-capacity-predicate','dana-resort-fee-predicate','dana-self-parking-fee-predicate','dana-incidental-hold-predicate','garfield-youth-admission-price-predicate']);
const timestamp=v=>typeof v==='string'&&/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(v)&&Number.isFinite(Date.parse(v))&&new Date(v).toISOString()===v&&Date.parse(v)<=Date.now();

export function validateProposalScope(plan,selection,holds,config,scope) {
  validatePlan(plan);validateCollectionSelection(plan,selection,holds);
  if(!Array.isArray(config?.records)||!Array.isArray(config.allowed_hosts)||new Set(config.records.map(r=>r.id)).size!==config.records.length||JSON.stringify([...config.allowed_hosts].sort())!==JSON.stringify(plan.allowed_hosts))throw Error('Changed proposal field registry');
  if(!exact(scope,['schema_version','kind','plan_sha256','selection_sha256','hold_registry_sha256','field_registry_sha256','reviewed_on','permission_basis','sources'])||scope.schema_version!==1||scope.kind!=='operator-reviewed-in-memory-proposal-scope'||scope.plan_sha256!==plan.plan_sha256||scope.selection_sha256!==hash(selection)||scope.hold_registry_sha256!==selection.hold_registry_sha256||scope.field_registry_sha256!==hash(config)||scope.permission_basis!=='operator-reviewed-not-machine-authorized'||!Array.isArray(scope.sources))throw Error('Invalid proposal processing scope');
  ageState(null,1,scope.reviewed_on);if(scope.reviewed_on>easternDate())throw Error('Future processing scope');
  if(JSON.stringify(scope.sources.map(s=>s?.url))!==JSON.stringify(selection.selected_source_urls)||!scope.sources.length)throw Error('Proposal scope differs from selected sources');
  for(const s of scope.sources) {
    if(!exact(s,['url','field_ids','source_class','access_review','processing','evidence_path'])||s.source_class!=='official'||s.access_review!=='operator-reviewed'||s.processing!=='transient-text-no-body-retention'||typeof s.evidence_path!=='string'||!/^docs\/research\/[a-zA-Z0-9-]+\.(json|md)$/.test(s.evidence_path)||!Array.isArray(s.field_ids)||!s.field_ids.length||new Set(s.field_ids).size!==s.field_ids.length)throw Error('Invalid source-specific processing scope');
    const source=plan.sources.find(x=>x.url===s.url);
    for(const id of s.field_ids) {
      const record=config.records.find(r=>r.id===id);
      if(!fields.has(id)||!record||!record.source_urls?.includes(s.url)||!source.pages.includes(record.page_url)||!source.checks.some(c=>c.id===id&&c.pattern===record.pattern))throw Error('Proposal field differs from source plan');
    }
  }
  return scope;
}

export function createProposalCollector({plan,selection,accessHolds,config,scope,collect=false,propose,fetcher=fetch}) {
  plan=structuredClone(plan);selection=structuredClone(selection);accessHolds=structuredClone(accessHolds);config=structuredClone(config);scope=structuredClone(scope);
  validateProposalScope(plan,selection,accessHolds,config,scope);
  if(collect!==true||easternDate()<plan.collect_not_before||typeof propose!=='function'||propose.constructor?.name==='AsyncFunction'||typeof fetcher!=='function')throw Error('Explicit eligible collection and trusted synchronous proposer required');
  const seen=new Set(),packets=new Map(),scopeHash=hash(scope);
  const executeSource=async(source,context)=>{
    source=structuredClone(source);context=structuredClone(context);
    const index=plan.sources.findIndex(s=>s.url===source?.url),retained=plan.sources[index],owned=scope.sources.find(s=>s.url===source?.url);
    if(!owned||JSON.stringify(source)!==JSON.stringify(retained)||!exact(context,['plan_sha256','index','attempted_at'])||context.plan_sha256!==plan.plan_sha256||context.index!==index||!timestamp(context.attempted_at)||seen.has(source.url))throw Error('Unknown changed or replayed checkpoint attempt');
    seen.add(source.url);
    let review=null,capturedHash=null;
    const outcome=await executeSelectedSource(source,plan,selection,accessHolds,{fetcher,onCapture:capture=>{
      capturedHash=capture.text_sha256;
      try {
        if(capture.url!==source.url||capture.final_url!==source.url)throw Error('Capture source mismatch');
        const suggestions=propose(Object.freeze({...capture,attempted_at:context.attempted_at}));
        if(suggestions&&typeof suggestions.then==='function'){Promise.resolve(suggestions).catch(()=>{});throw Error('Asynchronous proposer not permitted');}
        if(!Array.isArray(suggestions)||suggestions.some(p=>!owned.field_ids.includes(p?.field_id)))throw Error('Unscoped proposal');
        review=reviewProposals({snapshot:{schema_version:1,kind:'source-proposal-snapshot',origin:'operator-capture-unverified',source_url:capture.url,outcome:'retrieved',source_text:capture.text,source_text_sha256:capture.text_sha256,source_attempted_at:context.attempted_at},proposals:suggestions,config});
      } catch {
        review={state:'rejected-proposals-review',proposals:[],candidate_conflicts:[],reason_code:'invalid-or-failed-proposer',review_required:true,retry_authorized:false,semantic_verified:false,public_update_authorized:false};
      }
    }});
    if(capturedHash!==null&&capturedHash!==outcome.text_sha256)throw Error('Capture outcome join mismatch');
    const packet={schema_version:1,kind:'checkpoint-source-proposal-review',plan_sha256:plan.plan_sha256,selection_sha256:hash(selection),hold_registry_sha256:selection.hold_registry_sha256,processing_scope_sha256:scopeHash,source_url:source.url,source_index:index,source_attempted_at:context.attempted_at,source_outcome:outcome.state,source_http_status:outcome.http_status??null,source_text_sha256:outcome.text_sha256??null,capture_join:capturedHash===null?'no-retrieved-text':'same-in-process-fetch-text',capture_authentication:'transport-and-operator-supplied-not-independently-authenticated',review:review??{state:'source-not-retrieved-review',proposals:[],candidate_conflicts:[],review_required:true,retry_authorized:false,semantic_verified:false,public_update_authorized:false},factual_dates_renewed:false,retry_authorized:false,public_update_authorized:false};
    packets.set(source.url,packet);
    return outcome;
  };
  return {executeSource,reviewPackets:()=>structuredClone([...packets.values()])};
}
