import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {normalizedText,permittedUrl,easternDate,ageState} from './evidence-audit.mjs';
import {validateCorpus} from './predicate-review-eval.mjs';

const ROOT=fileURLToPath(new URL('../',import.meta.url));
const exact=(v,keys)=>v&&typeof v==='object'&&!Array.isArray(v)&&Object.keys(v).sort().join()===keys.slice().sort().join();
const sha=v=>createHash('sha256').update(v).digest('hex');
const safeId=v=>typeof v==='string'&&/^[a-z0-9][a-z0-9-]{0,99}$/.test(v);
const flags=new Set(['unknown','party-scope','conflicting-values','other-entity','stale-price','unpriced-age','source-instructions']);
const contracts={
  'dana-standard-room-capacity-predicate':{kind:'room-capacity',category:'San Diego Hotel Rooms'},
  'dana-junior-suite-capacity-predicate':{kind:'room-capacity',category:'Sunset Park View Junior Suite'},
  'dana-resort-fee-predicate':{kind:'nightly-fee',role:'resort-fee'},
  'dana-self-parking-fee-predicate':{kind:'nightly-fee',role:'self-parking'},
  'dana-incidental-hold-predicate':{kind:'authorization'},
  'garfield-youth-admission-price-predicate':{kind:'admission-price'}
};
const canonical=v=>JSON.stringify(Object.fromEntries(Object.entries(v).sort(([a],[b])=>a.localeCompare(b))));
const timestamp=v=>typeof v==='string'&&/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(v)&&Number.isFinite(Date.parse(v))&&new Date(v).toISOString()===v&&Date.parse(v)<=Date.now();
const segmenter=new Intl.Segmenter('en',{granularity:'sentence'});
const amounts=text=>[...text.matchAll(/(?:\$\s*|\bUSD\s*)(\d+(?:\.\d{1,2})?)(?!\d|[.,]\d|[A-Za-z])/gi)].filter(m=>!/[-\u2212]\s*$/.test(text.slice(0,m.index))).map(m=>Number(m[1]));
function requireWholeTokens(text,start,end) {
  const word=c=>/[\p{L}\p{N}_]/u.test(c||'');
  const splitPair=pos=>pos>0&&pos<text.length&&/[\uD800-\uDBFF]/.test(text[pos-1])&&/[\uDC00-\uDFFF]/.test(text[pos]);
  if(splitPair(start)||splitPair(end)||start>0&&word(text[start-1])&&word(text[start])||end<text.length&&word(text[end-1])&&word(text[end]))throw Error('Source span cuts a lexical token');
  // Inspect full-source currency tokens before accepting a shorter supporting slice.
  for(const m of text.matchAll(/(?:[-+\u2212]\s*)?(?:\$\s*|\bUSD\s*)\d(?:[\d.,]*\d)?(?:[eE][+-]?\d+)?/gi)) {
    const a=m.index,b=a+m[0].length;
    if(a<end&&b>start&&(a<start||b>end))throw Error('Source span cuts a monetary token');
  }
}

function validateSnapshot(s,config) {
  if(!exact(s,['schema_version','kind','origin','source_url','outcome','source_text','source_text_sha256','source_attempted_at'])||s.schema_version!==1||s.kind!=='source-proposal-snapshot'||!['synthetic','operator-capture-unverified'].includes(s.origin)||permittedUrl(s.source_url,config.allowed_hosts)!==s.source_url)throw Error('Invalid trusted snapshot scope');
  if(!config.records.some(r=>contracts[r.id]&&Array.isArray(r.source_urls)&&r.source_urls.includes(s.source_url)))throw Error('Snapshot outside pilot field ownership');
  if(s.origin==='synthetic'?s.source_attempted_at!==null:!timestamp(s.source_attempted_at))throw Error('Invalid snapshot attempt clock');
  if(s.outcome==='retrieved') {
    if(typeof s.source_text!=='string'||!s.source_text.length||s.source_text.length>3000000||s.source_text.includes('\0')||normalizedText(s.source_text)!==s.source_text||s.source_text_sha256!==sha(s.source_text))throw Error('Invalid normalized source hash');
  } else if(!['held-denial','held-unknown'].includes(s.outcome)||s.source_text!==null||s.source_text_sha256!==null)throw Error('Invalid held snapshot');
}

function validateValue(value,contract,support) {
  const number=n=>typeof n==='number'&&Number.isFinite(n)&&n>=0&&n<=1000000;
  const amount=()=>{
    if(!number(value.amount)||!['USD',null].includes(value.currency)||!['explicit-iso','interpretation','unknown'].includes(value.currency_basis)||value.currency===null&&value.currency_basis!=='unknown'||value.currency!==null&&value.currency_basis==='unknown')throw Error('Invalid monetary proposal');
    if(!amounts(support).includes(value.amount)||value.currency_basis==='explicit-iso'&&!/\bUSD\b/i.test(support))throw Error('Unsupported monetary span');
  };
  const sameClause=check=>[...segmenter.segment(support)].some(({segment})=>{const a=amounts(segment);return a.length===1&&a[0]===value.amount&&(value.currency_basis!=='explicit-iso'||/\bUSD\b/i.test(segment))&&check(segment);});
  if(contract.kind==='room-capacity') {
    if(!exact(value,['category','advertised_maximum','bed_variant','accepted_party','stay_dates'])||value.category!==contract.category||!Number.isInteger(value.advertised_maximum)||value.advertised_maximum<1||value.advertised_maximum>1000||value.bed_variant!==null||value.accepted_party!==null||value.stay_dates!==null)throw Error('Invalid capacity or inferred booking acceptance');
    const maxima=support.toLowerCase().split(value.category.toLowerCase()).slice(1).map(t=>t.match(/^\s+1 king or 2 queens\s*\|\s*max occ:\s*(\d+)\s*\|/i)).filter(Boolean).map(m=>Number(m[1]));
    if(!maxima.includes(value.advertised_maximum))throw Error('Unsupported category or capacity span');
  } else if(contract.kind==='nightly-fee') {
    if(!exact(value,['amount','currency','currency_basis','unit','tax_basis','rate_inclusion','party_basis','stay_dates'])||value.unit!=='night'||!['plus-tax','included','unknown'].includes(value.tax_basis)||value.rate_inclusion!==null||value.party_basis!==null||value.stay_dates!==null)throw Error('Invalid nightly-fee context');
    amount();
    if(!sameClause(t=>/\bnight(?:ly)?\b/i.test(t)&&(contract.role==='resort-fee'?/resort\s+fee/i:/self-parking/i).test(t)&&(value.tax_basis!=='plus-tax'||/(?:plus|\+)\s*tax/i.test(t))&&(value.tax_basis!=='included'||/(?:including|includes)\s*tax|tax(?:es)?\s+included/i.test(t))))throw Error('Unsupported fee unit role or tax span');
  } else if(contract.kind==='authorization') {
    if(!exact(value,['amount','currency','currency_basis','unit','payable_fee','authorization_days','release_timing','rate_applicability'])||value.unit!=='day'||value.payable_fee!==false||value.authorization_days!==null||value.release_timing!==null||value.rate_applicability!==null)throw Error('Invalid authorization or payable-fee promotion');
    amount();if(!sameClause(t=>/authoriz/i.test(t)&&/\bday\b/i.test(t)&&/incidentals/i.test(t)))throw Error('Unsupported authorization span');
  } else {
    if(!exact(value,['amount','currency','currency_basis','unit','min_age','max_age','eligibility','visit_date','checkout_fees'])||value.unit!=='person'||value.min_age!==7||value.max_age!==17||value.eligibility!==null||value.visit_date!==null||value.checkout_fees!==null)throw Error('Invalid admission age or eligibility proposal');
    amount();if(!sameClause(t=>/(?:child|youth)/i.test(t)&&/(?<![\p{L}\p{N}_.,+\-\u2212])7\s*(?:-|to|\u2013|\u2014)\s*17(?![\p{L}\p{N}_]|[.,]\p{N})/iu.test(t)))throw Error('Unsupported admission age span');
  }
}

export function reviewProposals({snapshot,proposals,config}) {
  snapshot=structuredClone(snapshot);proposals=structuredClone(proposals);
  if(!Array.isArray(config?.records)||!Array.isArray(config.allowed_hosts)||new Set(config.records.map(r=>r.id)).size!==config.records.length)throw Error('Invalid reviewed field registry');
  validateSnapshot(snapshot,config);
  if(!Array.isArray(proposals)||proposals.length>100)throw Error('Invalid proposal batch');
  if(snapshot.outcome!=='retrieved') {
    if(proposals.length)throw Error('Held source cannot supply semantic proposals');
    return {schema_version:1,kind:'semantic-proposal-review',origin:snapshot.origin,source_url:snapshot.source_url,source_attempted_at:snapshot.source_attempted_at,state:'held-source-review',proposals:[],candidate_conflicts:[],review_required:true,retry_authorized:false,semantic_verified:false,public_update_authorized:false};
  }
  const records=new Map(config.records.map(r=>[r.id,r])),ids=new Set();
  const rows=proposals.map(p=>{
    if(!exact(p,['id','field_id','source_url','source_text_sha256','source_span','value','proposed_context_flags'])||typeof p.id!=='string'||!/^proposal-[1-9]\d{0,2}$/.test(p.id)||ids.has(p.id)||!safeId(p.field_id)||p.source_url!==snapshot.source_url||p.source_text_sha256!==snapshot.source_text_sha256||!exact(p.source_span,['start','end']))throw Error('Invalid proposal identity provenance or authority');
    const record=records.get(p.field_id),contract=contracts[p.field_id],{start,end}=p.source_span;
    if(!record||!contract||!record.source_urls?.includes(snapshot.source_url)||!Number.isInteger(start)||!Number.isInteger(end)||start<0||end<=start||end>snapshot.source_text.length||end-start>1200)throw Error('Unapproved field source or span');
    if(!Array.isArray(p.proposed_context_flags)||!p.proposed_context_flags.length||p.proposed_context_flags.length>7||new Set(p.proposed_context_flags).size!==p.proposed_context_flags.length||p.proposed_context_flags.some(f=>!flags.has(f)))throw Error('Invalid unverified context flags');
    requireWholeTokens(snapshot.source_text,start,end);
    const support=snapshot.source_text.slice(start,end);validateValue(p.value,contract,support);ids.add(p.id);
    return {id:p.id,field_id:p.field_id,field:record.field,page_url:record.page_url,source_url:p.source_url,source_text_sha256:p.source_text_sha256,source_span:{start,end,offset_unit:'normalized-text-utf16'},source_span_sha256:sha(support),source_attempted_at:snapshot.source_attempted_at,origin:snapshot.origin,source_authentication:'operator-supplied-not-authenticated-by-this-boundary',kind:contract.kind,value:p.value,original_verified_on:record.verified_on,evidence_path:record.evidence_path,evidence_class:'UNVERIFIED_STRUCTURED_PROPOSAL',unverified_context_flags:p.proposed_context_flags,context_review:{entity:'pending',category:'pending',party:'pending',stay:'pending',conditions:'pending',freshness:'pending',instructions:'pending'},review_required:true,semantic_verified:false,public_update_authorized:false};
  });
  const groups=new Map();for(const row of rows){if(!groups.has(row.field_id))groups.set(row.field_id,[]);groups.get(row.field_id).push(row);}
  const conflicts=[...groups].filter(([,items])=>new Set(items.map(r=>canonical(r.value))).size>1).map(([field_id,items])=>({field_id,proposal_ids:items.map(r=>r.id),state:'candidate-value-disagreement-not-policy-finding',resolved:false,chosen_proposal_id:null}));
  return {schema_version:1,kind:'semantic-proposal-review',origin:snapshot.origin,source_url:snapshot.source_url,source_attempted_at:snapshot.source_attempted_at,state:conflicts.length?'disputed-candidates-review':'unverified-candidates-review',proposals:rows,candidate_conflicts:conflicts,review_required:true,retry_authorized:false,semantic_verified:false,public_update_authorized:false,limitations:['Lexical span support is not semantic validity, current source authenticity or condition completeness.','The trusted snapshot must come from an independently permitted capture; a hash or HTTPS URL does not authenticate that capture.','All source context and proposals remain pending review, including proposals with empty known conditions or positive matches.','Conflict lists compare submitted candidate values only; omitted or unsuggested contradictions are not automatically detected.','No nightly room quote, accepted party, verified policy, fact-date renewal or publication authority is provided.']};
}

export function runProposalFixtures(fixtures,corpus,config) {
  if(!exact(fixtures,['schema_version','kind','observed_on','evidence_refs','cases'])||fixtures.schema_version!==1||fixtures.kind!=='synthetic-semantic-proposal-fixtures'||!Array.isArray(fixtures.cases)||!fixtures.cases.length||fixtures.cases.length>100)throw Error('Invalid proposal fixtures');
  ageState(null,1,fixtures.observed_on);if(fixtures.observed_on>easternDate())throw Error('Future fixture date');
  if(!Array.isArray(fixtures.evidence_refs)||!fixtures.evidence_refs.length||fixtures.evidence_refs.some(p=>typeof p!=='string'||!/^docs\/research\/[A-Za-z0-9-]+\.json$/.test(p)))throw Error('Invalid fixture evidence references');
  corpus=validateCorpus(corpus,config);const bases=new Map(corpus.baselines.map(b=>[b.id,b])),ids=new Set();
  const results=fixtures.cases.map(c=>{
    if(!exact(c,['id','corpus_case_id','proposal_specs','expected'])||!safeId(c.id)||ids.has(c.id)||!Array.isArray(c.proposal_specs)||!['pending-review','conflict-review','held-review','reject'].includes(c.expected))throw Error('Invalid fixture case');
    ids.add(c.id);const original=corpus.cases.find(x=>x.id===c.corpus_case_id);if(!original)throw Error('Unknown frozen corpus case');
    const text=original.after.state==='retrieved'?normalizedText(original.after.html):null,source_url=bases.get(original.baseline_id).source_url;
    const snapshot={schema_version:1,kind:'source-proposal-snapshot',origin:'synthetic',source_url,outcome:original.after.state,source_text:text,source_text_sha256:text===null?null:sha(text),source_attempted_at:null};
    const proposals=c.proposal_specs.map(spec=>({source_url,source_text_sha256:snapshot.source_text_sha256,source_span:{start:0,end:text?.length||0},...spec}));
    let packet=null,rejected=false;try{packet=reviewProposals({snapshot,proposals,config});}catch{rejected=true;}
    const actual=rejected?'reject':packet.state==='held-source-review'?'held-review':packet.candidate_conflicts.length?'conflict-review':'pending-review';
    return {id:c.id,corpus_case_id:c.corpus_case_id,expected:c.expected,actual,passed:actual===c.expected,packet};
  });
  return {schema_version:1,kind:'synthetic-semantic-proposal-control-check',observed_on:fixtures.observed_on,evidence_class:'SYNTHETIC_NOT_LIVE_EXTRACTION',fixtures_sha256:sha(JSON.stringify(fixtures)),corpus_sha256:sha(JSON.stringify(corpus)),summary:{cases:results.length,passed:results.filter(r=>r.passed).length,rejected:results.filter(r=>r.actual==='reject').length,pending_review:results.filter(r=>r.actual==='pending-review').length,conflict_review:results.filter(r=>r.actual==='conflict-review').length,held_review:results.filter(r=>r.actual==='held-review').length},results,semantic_precision:null,semantic_refresh_ready:false,factual_dates_renewed:false,automatic_publication:false,network_calls:0,llm_calls:0,limitations:['Synthetic manually authored proposals exercise data/provenance/authority controls, not a semantic extractor or improved159detector.','All admitted values and context flags remain unverified; accepted syntax is not a validated fact or source policy change.','No native capture or model integration is implemented; real source governance, source context reconciliation and two complete weekly cycles remain separate.']};
}

export function parseProposalOptions(args) {
  const o={};for(let i=0;i<args.length;i++){const k=args[i];if(!['--fixtures','--corpus','--output'].includes(k)||Object.hasOwn(o,k)||!args[i+1]||args[i+1].startsWith('--'))throw Error('Invalid or duplicate proposal option');o[k]=args[++i];}if(!o['--fixtures']||!o['--corpus'])throw Error('Explicit synthetic fixtures and frozen corpus required');return o;
}
async function main() {
  const o=parseProposalOptions(process.argv.slice(2)),load=async p=>{const b=await readFile(resolve(p));if(b.length>2000000)throw Error('Fixture size limit');return JSON.parse(b);};
  const f=await load(o['--fixtures']),c=await load(o['--corpus']),config=JSON.parse(await readFile(resolve(ROOT,'ops/evidence-watch.json'),'utf8')),r=runProposalFixtures(f,c,config);
  for(const p of f.evidence_refs)await readFile(resolve(ROOT,p));
  if(o['--output'])await writeFile(resolve(o['--output']),JSON.stringify(r,null,2)+'\n',{flag:'wx'});
  console.log(JSON.stringify({summary:r.summary,semantic_refresh_ready:false,network_calls:0,llm_calls:0,output:o['--output']||null}));
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)main().catch(e=>{console.error(e.message);process.exitCode=1;});
