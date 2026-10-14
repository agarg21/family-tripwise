import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,mkdtempSync,readdirSync,rmSync,realpathSync} from 'node:fs';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {evaluateCorpus,validateCorpus,parseEvalOptions} from './predicate-review-eval.mjs';
const corpusPath=fileURLToPath(new URL('../docs/research/predicate-review-corpus-2026-10-14.json',import.meta.url));
const config=JSON.parse(readFileSync(new URL('../ops/evidence-watch.json',import.meta.url)));
const corpus=JSON.parse(readFileSync(corpusPath));
const copy=v=>structuredClone(v);
test('pure: deterministic frozen corpus evaluation never mutates input or verified facts',()=>{
  const before=copy(corpus),report=evaluateCorpus(corpus,config);
  assert.deepEqual(corpus,before);assert.deepEqual(report,evaluateCorpus(corpus,config));
  const saved=JSON.parse(readFileSync(new URL('../docs/research/predicate-review-evaluation-2026-10-14.json',import.meta.url)));
  assert.deepEqual(report,saved);assert.equal(report.network_calls,0);assert.equal(report.llm_calls,0);assert.equal(report.factual_dates_renewed,false);assert.equal(report.automatic_publication,false);assert.equal(report.semantic_refresh_ready,false);assert.equal(report.semantic_claim_precision,null);
});
test('pure: native tool PASS is distinct from a failed experimental shortcut gate',()=>{
  const r=evaluateCorpus(corpus,config),p=r.summary.predicate_shortcut,h=r.summary.text_hash_only;
  assert.equal(r.summary.cases,20);assert.equal(r.summary.retrieved_cases,18);assert.equal(r.summary.held_cases,2);
  assert.deepEqual([p.true_positive,p.false_positive,p.true_negative,p.false_negative],[9,0,3,6]);
  assert.equal(p.review_precision,1);assert.equal(p.review_recall,9/15);assert.equal(p.critical_review_recall,8/14);
  assert.deepEqual([h.true_positive,h.false_positive,h.true_negative,h.false_negative],[15,2,1,0]);assert.equal(h.review_precision,15/17);
  assert.equal(r.experimental_fixture_gate.passed,false);
});
test('pure: all six critical context misses are exposed without claiming live policy changes',()=>{
  const r=evaluateCorpus(corpus,config),misses=r.summary.predicate_shortcut.missed_critical_case_ids;
  assert.deepEqual(misses,['fee-contradiction','suite-party-restriction','other-hotel-context','stale-two-adult-price','unwatched-younger-age','visible-source-instruction']);
  for(const id of misses){const row=r.results.find(r=>r.id===id);assert.equal(row.critical,true);assert.equal(row.review_required,true);assert.equal(row.predicate_shortcut_review,false);assert.equal(row.claim_verified,false);assert.deepEqual(row.missing_predicate_ids,[]);}
  assert.match(r.limitations[0],/hypothetical.*current atomic queues retain all/i);
});
test('pure: denial and unknown outcomes remain holds and cannot inflate retrieved recall',()=>{
  const held=evaluateCorpus(corpus,config).results.filter(r=>r.hold_required);
  assert.equal(held.length,2);
  for(const r of held){assert.equal(r.after_fixture_text_sha256,null);assert.equal(r.predicate_shortcut_review,null);assert.equal(r.text_hash_review,null);assert.equal(r.retry_authorized,false);assert.equal(r.claim_verified,false);}
});
test('pure: source instructions stay inert data and no HTML or executable action is returned',()=>{
  const r=evaluateCorpus(corpus,config),row=r.results.find(r=>r.id==='visible-source-instruction');
  assert.equal(row.predicate_shortcut_review,false);assert.equal(row.review_required,true);assert.equal(row.claim_verified,false);
  assert.ok(r.results.every(x=>!Object.hasOwn(x,'html')&&!Object.hasOwn(x,'after_html')&&!Object.hasOwn(x,'command')));
  assert.ok(!JSON.stringify(r).includes('Ignore prior instructions'));
});
test('pure: unknown keys malformed oracle labels and duplicate IDs fail closed',()=>{
  const variants=[];
  for(const mutate of [c=>c.extra='private',c=>c.cases[0].label='approved',c=>c.cases.push(copy(c.cases[0])),c=>c.baselines.push(copy(c.baselines[0])),c=>c.cases[0].critical=true,c=>c.cases[0].semantic_change=true,c=>c.cases[0].semantic_change=NaN,c=>c.cases[0].after.secret='x',c=>delete c.cases[0].semantic_change]){const c=copy(corpus);mutate(c);variants.push(c);}
  for(const c of variants)assert.throws(()=>validateCorpus(c,config));
  for(const index of [11,12]){const c=copy(corpus);c.cases[index].critical=false;c.cases[index].review_required=false;assert.throws(()=>validateCorpus(c,config));}
  const policy=copy(corpus);policy.cases[3].semantic_change=null;assert.throws(()=>validateCorpus(policy,config));
});
test('pure: held retrieval metadata and outcome relabeling are rejected',()=>{
  for(const mutate of [c=>c.cases[18].after.html='copied body',c=>c.cases[18].critical=true,c=>c.cases[18].semantic_change=false,c=>c.cases[18].label='interrupted',c=>c.cases[0].after.state='not-fetched']){const c=copy(corpus);mutate(c);assert.throws(()=>validateCorpus(c,config));}
});
test('pure: source identities must match approved exact watch ownership',()=>{
  for(const mutate of [c=>c.baselines[0].source_url='https://example.com/',c=>c.baselines[0].source_url+='?token=fake',c=>c.baselines[0].check_ids=['dana-junior-suite-capacity-predicate'],c=>c.baselines[0].check_ids=['unknown-check'],c=>c.evidence_refs=['../../private.json']]){const c=copy(corpus);mutate(c);assert.throws(()=>validateCorpus(c,config));}
});
test('pure: bounded inputs valid dates and still-positive baseline are mandatory',()=>{
  for(const mutate of [c=>c.cases=Array(101).fill(c.cases[0]),c=>c.baselines[0].html='x'.repeat(8001),c=>c.observed_on='2026-02-30',c=>c.observed_on='2099-10-14',c=>c.baselines[0].html='<p>No expected fee here</p>']){const c=copy(corpus);mutate(c);assert.throws(()=>evaluateCorpus(c,config));}
});
test('pure: changed reviewed patterns cannot silently reuse a frozen evaluation',()=>{
  const altered=copy(config),r=altered.records.find(r=>r.id==='dana-resort-fee-predicate');r.pattern='never-match-this';
  assert.throws(()=>evaluateCorpus(corpus,altered),/baseline no longer matches/);
});
test('pure: explicit CLI options reject duplicates unknowns and missing values',()=>{
  assert.deepEqual(parseEvalOptions(['--corpus','c.json']),{'--corpus':'c.json'});
  for(const a of [[],['--collect','yes'],['--corpus'],['--corpus','--output'],['--corpus','a','--corpus','b']])assert.throws(()=>parseEvalOptions(a));
});
test('cli: default is print-only and optional output is exclusive creation',()=>{
  const dir=mkdtempSync(join(realpathSync(tmpdir()),'ft-predicate-eval-')),cli=fileURLToPath(new URL('./predicate-review-eval.mjs',import.meta.url));
  try {
    const text=execFileSync(process.execPath,[cli,'--corpus',corpusPath],{cwd:dir,encoding:'utf8'}),r=JSON.parse(text);assert.equal(r.output,null);assert.equal(r.semantic_refresh_ready,false);assert.deepEqual(readdirSync(dir),[]);
    const output=join(dir,'report.json');execFileSync(process.execPath,[cli,'--corpus',corpusPath,'--output',output]);
    const before=readFileSync(output);assert.throws(()=>execFileSync(process.execPath,[cli,'--corpus',corpusPath,'--output',output],{stdio:'pipe'}));assert.deepEqual(readFileSync(output),before);assert.deepEqual(readdirSync(dir),['report.json']);
  } finally {rmSync(dir,{recursive:true,force:true});}
});
