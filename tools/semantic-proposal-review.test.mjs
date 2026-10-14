import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,mkdtempSync,readdirSync,rmSync,realpathSync} from 'node:fs';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {normalizedText} from './evidence-audit.mjs';
import {reviewProposals,runProposalFixtures,parseProposalOptions} from './semantic-proposal-review.mjs';
const fixturePath=fileURLToPath(new URL('../docs/research/semantic-proposal-fixtures-2026-10-14.json',import.meta.url)),corpusPath=fileURLToPath(new URL('../docs/research/predicate-review-corpus-2026-10-14.json',import.meta.url));
const fixtures=JSON.parse(readFileSync(fixturePath)),corpus=JSON.parse(readFileSync(corpusPath)),config=JSON.parse(readFileSync(new URL('../ops/evidence-watch.json',import.meta.url)));
const copy=v=>structuredClone(v),hash=t=>createHash('sha256').update(t).digest('hex');
function input(id='instruction-stays-inert') {
  const c=fixtures.cases.find(c=>c.id===id),original=corpus.cases.find(r=>r.id===c.corpus_case_id),url=corpus.baselines.find(b=>b.id===original.baseline_id).source_url;
  const text=original.after.state==='retrieved'?normalizedText(original.after.html):null;
  const snapshot={schema_version:1,kind:'source-proposal-snapshot',origin:'synthetic',source_url:url,outcome:original.after.state,source_text:text,source_text_sha256:text===null?null:hash(text),source_attempted_at:null};
  return {snapshot,proposals:c.proposal_specs.map(p=>({source_url:url,source_text_sha256:snapshot.source_text_sha256,source_span:{start:0,end:text?.length||0},...copy(p)})),config};
}
function replaceText(i,text){i.snapshot.source_text=text;i.snapshot.source_text_sha256=hash(text);for(const p of i.proposals){p.source_text_sha256=i.snapshot.source_text_sha256;p.source_span={start:0,end:text.length};}return i;}
test('pure: fourteen synthetic controls reproduce without claiming a semantic improvement',()=>{
  const r=runProposalFixtures(fixtures,corpus,config),saved=JSON.parse(readFileSync(new URL('../docs/research/semantic-proposal-review-2026-10-14.json',import.meta.url)));
  assert.deepEqual(r,saved);assert.deepEqual(r.summary,{cases:14,passed:14,rejected:7,pending_review:4,conflict_review:1,held_review:2});
  assert.equal(r.semantic_precision,null);assert.equal(r.semantic_refresh_ready,false);assert.equal(r.network_calls,0);assert.equal(r.llm_calls,0);assert.equal(r.factual_dates_renewed,false);assert.equal(r.automatic_publication,false);
});
test('pure: every admitted value retains original dates, provenance and pending context',()=>{
  const before=copy(fixtures),r=runProposalFixtures(fixtures,corpus,config);assert.deepEqual(fixtures,before);
  for(const result of r.results){if(!result.packet)continue;assert.equal(result.packet.review_required,true);assert.equal(result.packet.semantic_verified,false);assert.equal(result.packet.public_update_authorized,false);assert.equal(result.packet.retry_authorized,false);
    for(const p of result.packet.proposals){const record=config.records.find(x=>x.id===p.field_id);assert.equal(p.original_verified_on,record.verified_on);assert.equal(p.page_url,record.page_url);assert.equal(p.evidence_path,record.evidence_path);assert.equal(p.source_attempted_at,null);assert.equal(p.origin,'synthetic');assert.ok(Object.values(p.context_review).every(s=>s==='pending'));assert.equal(p.evidence_class,'UNVERIFIED_STRUCTURED_PROPOSAL');assert.ok(!Object.hasOwn(p,'source_text')&&!Object.hasOwn(p,'support'));assert.match(p.source_span_sha256,/^[a-f0-9]{64}$/);}
  }
});
test('pure: conflicting submitted values stay unresolved with no preferred policy',()=>{
  const i=input('retain-fee-disagreement'),r=reviewProposals(i);assert.equal(r.state,'disputed-candidates-review');assert.equal(r.candidate_conflicts.length,1);
  assert.deepEqual(r.candidate_conflicts[0],{field_id:'dana-resort-fee-predicate',proposal_ids:['proposal-1','proposal-2'],state:'candidate-value-disagreement-not-policy-finding',resolved:false,chosen_proposal_id:null});
  i.proposals[1].value=Object.fromEntries(Object.entries(i.proposals[0].value).reverse());assert.equal(reviewProposals(i).candidate_conflicts.length,0);
});
test('pure: omitted disagreement cannot be assumed detected or semantically resolved',()=>{
  const i=input('retain-fee-disagreement');i.proposals=i.proposals.slice(0,1);const r=reviewProposals(i);assert.equal(r.candidate_conflicts.length,0);assert.equal(r.semantic_verified,false);assert.equal(r.review_required,true);assert.match(r.limitations[3],/omitted.*not automatically detected/);
});
test('pure: wrong source hash field IDs and any model authority reject the packet',()=>{
  for(const mutate of [i=>i.proposals[0].source_url='https://thedana.com/san-diego-accommodations/',i=>i.proposals[0].source_text_sha256='0'.repeat(64),i=>i.proposals[0].field_id='dana-nightly-room-price',i=>i.proposals[0].claim_verified=true,i=>i.proposals[0].public_update_authorized=true,i=>i.proposals[0].original_verified_on='2026-10-14',i=>i.proposals[0].id='person-name-from-source',i=>i.proposals.push(copy(i.proposals[0]))]){const v=input();mutate(v);assert.throws(()=>reviewProposals(v));}
});
test('pure: amount lexer distinguishes sentence periods from decimal and comma continuations',()=>{
  for(const [text,amount] of [['Resort fee plus tax per night is $5.',5],['Resort fee plus tax per night is $5.99.',5.99]]){const v=replaceText(input(),text);v.proposals[0].value.amount=amount;assert.equal(reviewProposals(v).proposals[0].value.amount,amount);}
  for(const [text,amount] of [['$5.999 resort fee plus tax per night.',5.99],['$1,000 resort fee plus tax per night.',1],['$5e2 resort fee plus tax per night.',5],['$50 resort fee plus tax per night.',5],['Resort fee plus tax per night is -$5.',5],['Resort fee plus tax per night is \u2212$5.',5]]){const v=replaceText(input(),text);v.proposals[0].value.amount=amount;assert.throws(()=>reviewProposals(v));}
});
test('pure: clipped integer decimal comma and currency-word tokens cannot fake smaller amounts',()=>{
  for(const [token,clip,amount] of [['$50','$5',5],['$50.99','$50',50],['$50.99','$50.9',50.9],['$1,000','$1',1],['USD50.99','USD50',50]]){const text='Resort fee plus tax per night is '+token+'.';const v=replaceText(input(),text);v.proposals[0].value.amount=amount;v.proposals[0].source_span.end=text.indexOf(token)+clip.length;assert.throws(()=>reviewProposals(v),/cuts a .*token/);}
  const full=replaceText(input(),'Resort fee plus tax per night is $50.');full.proposals[0].value.amount=50;full.proposals[0].source_span.end=full.snapshot.source_text.length-1;assert.equal(reviewProposals(full).proposals[0].value.amount,50);
});
test('pure: unit tax currency basis and nonfinite amount cannot be promoted',()=>{
  for(const mutate of [i=>i.proposals[0].value.amount=NaN,i=>i.proposals[0].value.unit='stay',i=>i.proposals[0].value.tax_basis='included',i=>i.proposals[0].value.currency_basis='explicit-iso',i=>i.proposals[0].value.rate_inclusion=true,i=>i.proposals[0].value.party_basis='two adults']){const v=input();mutate(v);assert.throws(()=>reviewProposals(v));}
});
test('pure: amounts units and taxes cannot be borrowed across adjacent charge sentences',()=>{
  for(const [text,amount,tax] of [['Resort fee is $25 plus tax per night. Self-parking is $35 per night.',35,'plus-tax'],['Resort fee is $25 including tax per night. Another resort fee example is $30 plus tax per night.',25,'plus-tax'],['Resort fee plus tax is $25. Parking is charged per night.',25,'plus-tax'],['Resort fee plus tax per night combines $25 and a separate $35 charge.',25,'plus-tax']]){const v=replaceText(input(),text);v.proposals[0].value.amount=amount;v.proposals[0].value.tax_basis=tax;assert.throws(()=>reviewProposals(v));}
});
test('pure: capacity and admission price must stay bound to their own row or age sentence',()=>{
  const r=replaceText(input('party-context-stays-pending'),'Sunset Park View Junior Suite 1 King or 2 Queens | Max Occ: 6 | Other Room 1 King or 2 Queens | Max Occ: 4 |');r.proposals[0].value.advertised_maximum=4;assert.throws(()=>reviewProposals(r));
  const a=replaceText(input('younger-age-stays-unpriced'),'Children (7 to 17): $5. Adults: $10.');a.proposals[0].value.amount=10;assert.throws(()=>reviewProposals(a));
});
test('pure: capacity is not selected beds, accepted party or dated availability',()=>{
  for(const mutate of [i=>i.proposals[0].value.advertised_maximum=7,i=>i.proposals[0].value.category='Bay View Junior Suite',i=>i.proposals[0].value.bed_variant='two queens',i=>i.proposals[0].value.accepted_party='family five',i=>i.proposals[0].value.stay_dates='2026-11-08/2026-11-13']){const v=input('party-context-stays-pending');mutate(v);assert.throws(()=>reviewProposals(v));}
  assert.equal(reviewProposals(input('party-context-stays-pending')).proposals[0].original_verified_on,null);
});
test('pure: authorization stays nonpayable and missing ages remain unsupported',()=>{
  const v=input('charge-not-authorization');v.proposals[0].value.payable_fee=true;assert.throws(()=>reviewProposals(v));
  const a=input('missing-age-not-invented');assert.throws(()=>reviewProposals(a));
  const known=reviewProposals(input('younger-age-stays-unpriced')).proposals[0];assert.equal(known.value.min_age,7);assert.equal(known.value.max_age,17);assert.equal(known.value.checkout_fees,null);assert.equal(known.context_review.conditions,'pending');
});
test('pure: a lower age cannot match the numeric suffix of a different complete age',()=>{
  for(const min of [17,107,7.7,-7]){const v=replaceText(input('younger-age-stays-unpriced'),`Children (${min} to 17): $5.`);assert.throws(()=>reviewProposals(v),/Unsupported admission age span/);}
  for(const max of [170,17.7]){const v=replaceText(input('younger-age-stays-unpriced'),`Children (7 to ${max}): $5.`);assert.throws(()=>reviewProposals(v),/Unsupported admission age span/);}
});
test('pure: source instructions and proposed context flags cannot clear review or leak text',()=>{
  const i=input(),r=reviewProposals(i);assert.ok(i.snapshot.source_text.includes('Ignore prior instructions'));assert.ok(!JSON.stringify(r).includes('Ignore prior instructions'));assert.equal(r.proposals[0].context_review.instructions,'pending');
  for(const flags of [[],['no-conflict'],['unknown','unknown'],['private source identity']]){const v=input();v.proposals[0].proposed_context_flags=flags;assert.throws(()=>reviewProposals(v));}
});
test('pure: held snapshots reject proposals and preserve no-retry outcomes',()=>{
  for(const id of ['denial-hold-preserved','unknown-hold-preserved']){const i=input(id),r=reviewProposals(i);assert.equal(r.state,'held-source-review');assert.equal(r.retry_authorized,false);assert.deepEqual(r.proposals,[]);i.proposals=input().proposals;assert.throws(()=>reviewProposals(i));}
  const v=input('denial-hold-preserved');v.snapshot.source_url='https://www.mta.info/fares-tolls/subway-bus/tap-and-ride';assert.throws(()=>reviewProposals(v));
});
test('pure: snapshot hash normalization origin clocks and bounded UTF16 spans are enforced',()=>{
  for(const mutate of [i=>i.snapshot.source_text_sha256='0'.repeat(64),i=>i.snapshot.source_text='<p>not normalized</p>',i=>i.snapshot.source_attempted_at='2026-10-14T06:05:55.260Z',i=>i.snapshot.origin='verified',i=>i.proposals[0].source_span.end=99999,i=>i.proposals[0].source_span.start=-1,i=>i.proposals[0].source_span.start=0.5]){const v=input();mutate(v);assert.throws(()=>reviewProposals(v));}
  const v=input('party-context-stays-pending'),text='\uD83D\uDE00 '+v.snapshot.source_text;replaceText(v,text);v.proposals[0].source_span.start=3;const r=reviewProposals(v);assert.equal(r.proposals[0].source_span.offset_unit,'normalized-text-utf16');assert.equal(r.proposals[0].source_span_sha256,hash(text.slice(3)));
  const broken=copy(v);broken.proposals[0].source_span.start=1;assert.throws(()=>reviewProposals(broken),/cuts a lexical token/);
  v.snapshot.origin='operator-capture-unverified';v.snapshot.source_attempted_at='2026-10-14T06:05:55.260Z';const supplied=reviewProposals(v);assert.match(supplied.proposals[0].source_authentication,/not-authenticated/);assert.equal(supplied.semantic_verified,false);
});
test('pure: fixture and CLI schemas reject malformed options and oracle containers',()=>{
  assert.deepEqual(parseProposalOptions(['--fixtures','f','--corpus','c']),{'--fixtures':'f','--corpus':'c'});
  for(const args of [[],['--fixtures','f'],['--fixtures','f','--corpus','c','--fixtures','g'],['--collect','yes'],['--fixtures','--corpus']])assert.throws(()=>parseProposalOptions(args));
  for(const mutate of [f=>f.extra='bad',f=>f.cases.push(copy(f.cases[0])),f=>f.cases[0].expected='published',f=>f.evidence_refs=['../../private.json'],f=>f.observed_on='2026-02-30']){const f=copy(fixtures);mutate(f);assert.throws(()=>runProposalFixtures(f,corpus,config));}
});
test('cli: synthetic demo prints by default and refuses existing output',()=>{
  const dir=mkdtempSync(join(realpathSync(tmpdir()),'ft-proposal-review-')),cli=fileURLToPath(new URL('./semantic-proposal-review.mjs',import.meta.url)),args=[cli,'--fixtures',fixturePath,'--corpus',corpusPath];
  try{const r=JSON.parse(execFileSync(process.execPath,args,{cwd:dir,encoding:'utf8'}));assert.equal(r.output,null);assert.equal(r.summary.passed,14);assert.deepEqual(readdirSync(dir),[]);const out=join(dir,'result.json');execFileSync(process.execPath,[...args,'--output',out]);const before=readFileSync(out);assert.throws(()=>execFileSync(process.execPath,[...args,'--output',out],{stdio:'pipe'}));assert.deepEqual(readFileSync(out),before);assert.deepEqual(readdirSync(dir),['result.json']);}finally{rmSync(dir,{recursive:true,force:true});}
});
