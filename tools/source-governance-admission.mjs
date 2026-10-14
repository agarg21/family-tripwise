import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {ageState,permittedUrl,easternDate} from './evidence-audit.mjs';
import {createProposalCollector} from './source-proposal-collection.mjs';
export const COLLECTOR_TOKEN='FamilyTripwiseEvidenceAudit';
const DAY=86400000,hash=v=>createHash('sha256').update(JSON.stringify(v)).digest('hex');
const exact=(v,keys)=>v&&typeof v==='object'&&!Array.isArray(v)&&Object.keys(v).sort().join()===keys.slice().sort().join();
const iso=v=>typeof v==='string'&&/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(v)&&Number.isFinite(Date.parse(v))&&new Date(v).toISOString()===v;
const ref=v=>typeof v==='string'&&/^docs\/research\/[A-Za-z0-9-]+\.(json|md)$/.test(v);

export function validateGovernanceAdmission(governance,sourceUrls,{at=new Date().toISOString()}={}) {
  if(!iso(at)||!exact(governance,['schema_version','kind','evidence_class','observed_on','records'])||governance.schema_version!==1||governance.kind!=='dated-source-governance'||!['OPERATOR_REVIEWED_POLICY_RECORDS','SYNTHETIC_GOVERNANCE_CONTROL'].includes(governance.evidence_class)||!Array.isArray(governance.records)||!governance.records.length||governance.records.length>500||!Array.isArray(sourceUrls)||!sourceUrls.length||new Set(sourceUrls).size!==sourceUrls.length)throw Error('Invalid governance admission schema');
  ageState(null,1,governance.observed_on);if(governance.observed_on>easternDate())throw Error('Future governance observation');
  const rows=new Map(),ids=new Set(),now=Date.parse(at);
  for(const r of governance.records) {
    if(!exact(r,['id','source_url','decision','collector_token','robots','use','expires_at','hold_reason'])||typeof r.id!=='string'||!/^[a-z0-9][a-z0-9-]{0,99}$/.test(r.id)||ids.has(r.id)||typeof r.source_url!=='string'||rows.has(r.source_url)||permittedUrl(r.source_url,[new URL(r.source_url).hostname])!==r.source_url||!['HOLD','APPROVED_LIMITED_TRANSIENT_FACT_CAPTURE'].includes(r.decision)||r.collector_token!==COLLECTOR_TOKEN)throw Error('Invalid governance source identity');
    const b=r.robots,u=r.use;
    if(!exact(b,['status','http_status','matched_group','path_verdict','body_sha256','checked_at'])||!['UNKNOWN','KNOWN_RULES_ALLOWED','KNOWN_RULES_DISALLOW','ACTUAL_HTTP_4XX_REQUIRES_OPERATOR_REVIEW'].includes(b.status)||!(b.http_status===null||Number.isInteger(b.http_status)&&b.http_status>=100&&b.http_status<=599)||!(b.matched_group===null||b.matched_group==='*'||typeof b.matched_group==='string'&&b.matched_group.toLowerCase()===COLLECTOR_TOKEN.toLowerCase())||!['UNKNOWN','ALLOW','DISALLOW'].includes(b.path_verdict)||!(b.body_sha256===null||typeof b.body_sha256==='string'&&/^[a-f0-9]{64}$/.test(b.body_sha256))||!(b.checked_at===null||iso(b.checked_at)))throw Error('Invalid governance robots record');
    if(!exact(u,['automation','retention','reviewed_at','evidence_path'])||!['UNKNOWN','SUPPORTED_LIMITED_FACT_CAPTURE','PROHIBITED'].includes(u.automation)||!['UNKNOWN','TRANSIENT_BODY_FREE_FACTS_ONLY','PROHIBITED'].includes(u.retention)||!(u.reviewed_at===null||iso(u.reviewed_at))||!ref(u.evidence_path)||!(r.expires_at===null||iso(r.expires_at))||![null,'POLICY_ACCESS_AND_USE_UNRESOLVED','SOURCE_PROHIBITS_USE','SOURCE_RULES_DISALLOW'].includes(r.hold_reason))throw Error('Invalid governance use or retention record');
    if(r.decision==='APPROVED_LIMITED_TRANSIENT_FACT_CAPTURE'&&(r.hold_reason!==null||b.status!=='KNOWN_RULES_ALLOWED'||b.http_status!==200||b.path_verdict!=='ALLOW'||b.matched_group===null||b.body_sha256===null||b.checked_at===null||u.automation!=='SUPPORTED_LIMITED_FACT_CAPTURE'||u.retention!=='TRANSIENT_BODY_FREE_FACTS_ONLY'||u.reviewed_at===null||r.expires_at===null))throw Error('Approval cannot infer missing policy evidence');
    if(r.decision==='HOLD'&&r.hold_reason===null)throw Error('Held source requires an explicit unresolved reason');
    rows.set(r.source_url,r);ids.add(r.id);
  }
  const admitted=sourceUrls.map(url=>{
    const r=rows.get(url);if(!r||r.decision!=='APPROVED_LIMITED_TRANSIENT_FACT_CAPTURE')throw Error('Selected source governance is missing or held');
    const robotAt=Date.parse(r.robots.checked_at),useAt=Date.parse(r.use.reviewed_at),expiry=Date.parse(r.expires_at);
    if(robotAt>now||useAt>now||expiry<=now||expiry>Math.min(robotAt,useAt)+DAY||expiry<=Math.max(robotAt,useAt))throw Error('Selected governance is stale future or outside24hour pilot window');
    return {source_url:url,record_id:r.id,collector_token:r.collector_token,matched_group:r.robots.matched_group,path_verdict:r.robots.path_verdict,robots_body_sha256:r.robots.body_sha256,policy_evidence_path:r.use.evidence_path,expires_at:r.expires_at};
  });
  return {schema_version:1,kind:'source-governance-admission',checked_at:at,governance_sha256:hash(governance),evidence_class:governance.evidence_class,admitted_sources:admitted,independent_access_authorization:false,semantic_verified:false,public_update_authorized:false,factual_dates_renewed:false};
}

export function loadPilotGovernance() {
  return JSON.parse(readFileSync(new URL('../ops/source-governance-pilot.json',import.meta.url),'utf8'));
}

export function createGovernedProposalCollector({governance=loadPilotGovernance(),...options}) {
  governance=structuredClone(governance);
  const selected=structuredClone(options.selection?.selected_source_urls),selectionHash=hash(options.selection),initial=validateGovernanceAdmission(governance,selected);
  if(governance.evidence_class==='SYNTHETIC_GOVERNANCE_CONTROL'&&(!options.fetcher||options.fetcher===globalThis.fetch))throw Error('Synthetic governance cannot use default live transport');
  const transport=options.fetcher||globalThis.fetch,checks=[];
  let active=false,transportAdmission=null;
  const core=createProposalCollector({...options,fetcher:(...args)=>{
    transportAdmission=validateGovernanceAdmission(governance,selected);
    return transport(...args);
  }});
  return {
    executeSource:async(source,context)=>{
      if(active)throw Error('Governed pilot execution must be sequential');
      active=true;transportAdmission=null;
      try {
        source=structuredClone(source);context=structuredClone(context);
        const admission=validateGovernanceAdmission(governance,selected),outcome=await core.executeSource(source,context),checked=transportAdmission||admission;
        checks.push({source_url:source.url,checkpoint_attempted_at:context.attempted_at,admission_checked_at:checked.checked_at,transport_admission_checked:transportAdmission!==null,governance_sha256:checked.governance_sha256});
        return outcome;
      } finally {active=false;}
    },
    reviewPackets:core.reviewPackets,
    governanceProof:()=>structuredClone({...initial,selection_sha256:selectionHash,admission_checks:checks,http_request_count:null,limitations:['Trusted operator records and custom transport are not independently authenticated or sandboxed.','Admission checks are not HTTP counts or verification of source claims.','Only this opt-in entrypoint enforces the gate; legacy low-level/default workflows are unchanged and must not be used to evade a hold.']})
  };
}
