import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {sourceSignals} from './evidence-audit.mjs';
const config=JSON.parse(readFileSync(new URL('../ops/evidence-watch.json',import.meta.url))),records=config.records.filter(r=>r.id.startsWith('garfield-'));
const checks=records.map(r=>({id:r.id,pattern:r.pattern}));
const reconciliation=JSON.parse(readFileSync(new URL('../docs/research/garfield-resident-predicate-reconciliation-2026-10-14.json',import.meta.url)));
const resident=checks.find(c=>c.id==='garfield-resident-waiver-predicate');
const fixture='<p>Adults (18 to 64): $10. Children (7 to 17): $5. Seniors (65+): $5. '+reconciliation.source.excerpt+'. Closed Monday and Tuesday. Garden reservations last 30 minutes.</p>';
test('pure: six Garfield watches keep exact source, original date, basis and unknown boundaries',()=>{
  assert.equal(records.length,6);assert.equal(new Set(records.map(r=>r.id)).size,6);for(const r of records){assert.equal(r.verified_on,'2026-10-13');assert.deepEqual(r.source_urls,['https://garfieldconservatory.org/visit/']);assert.equal(r.evidence_path,'docs/research/chicago-garfield-admission-2026-10-13.json');assert.ok(r.basis.length>40);}
  assert.ok(records.every(r=>!r.field.includes('under7')&&!r.field.includes('last-entry')));
});
test('pure: synthetic matching text produces candidates not verified policy',()=>{
  const r=sourceSignals(fixture,checks);assert.equal(r.fields.length,6);assert.ok(r.fields.every(f=>f.state==='expected-text-present'&&f.evidence_class==='EXTRACTION_CANDIDATE'));assert.deepEqual(r.price_candidates,[]);
});
test('pure: changed youth band, prices and script-only policy text flag predicate review',()=>{
  for(const changed of [fixture.replace('(7 to 17)','(3 to 6)'),fixture.replace('Children (7 to 17): $5','Children (7 to 17): $7')])assert.equal(sourceSignals(changed,checks).fields.find(f=>f.id==='garfield-youth-admission-price-predicate').state,'expected-text-missing-review');
  assert.ok(sourceSignals('<script>'+fixture+'</script><p>Navigation</p>',checks).fields.every(f=>f.state==='expected-text-missing-review'));
});
test('pure: current bounded source wording reconciles old missing predicate without renewing policy',()=>{
  const r=reconciliation;
  assert.equal(r.source.excerpt.split(/\s+/).length,r.source.excerpt_words);
  assert.ok(r.source.excerpt_words<=25);
  assert.equal(sourceSignals(r.source.excerpt,[{id:resident.id,pattern:r.reconciliation.old_pattern}]).fields[0].state,'expected-text-missing-review');
  assert.equal(resident.pattern,r.reconciliation.new_pattern);
  assert.equal(sourceSignals(r.source.excerpt,[resident]).fields[0].state,'expected-text-present');
  assert.equal(r.reconciliation.claim_verified,false);
  assert.equal(r.source.current_native_text_sha256,null);
  assert.equal(r.reconciliation.original_verified_on,'2026-10-13');
});
test('pure: resident phrase survives case whitespace and inline markup normalization',()=>{
  for(const html of [reconciliation.source.excerpt.toUpperCase(),reconciliation.source.excerpt.replaceAll(' ','\n  '),reconciliation.source.excerpt.replace('City of Chicago','<strong>City of Chicago</strong>')])assert.equal(sourceSignals(html,[resident]).fields[0].state,'expected-text-present');
});
test('pure: outside-city other-city or paid admission never matches the resident-waiver phrase',()=>{
  const s=reconciliation.source.excerpt;
  for(const html of [s.replace('within','outside'),s.replace('Chicago','Evanston'),s.replace('at no charge','at a charge'),s.replace('at no charge','at $10'),s.replace('offer admission','do not offer admission')])assert.equal(sourceSignals(html,[resident]).fields[0].state,'expected-text-missing-review');
});
test('pure: unrelated free parking and legacy invented resident prose require reconciliation',()=>{
  for(const html of ['Chicago residents pay admission. Free parking is available.','Free parking for Chicago residents.','Chicago residents receive free admission.','Guests that reside within the city of Chicago, we kindly offer free parking.'])assert.equal(sourceSignals(html,[resident]).fields[0].state,'expected-text-missing-review');
});
test('pure: script style and noscript only resident wording cannot become a positive candidate',()=>{
  for(const tag of ['script','style','noscript'])assert.equal(sourceSignals(`<${tag}>${reconciliation.source.excerpt}</${tag}><p>Navigation</p>`,[resident]).fields[0].state,'expected-text-missing-review');
});
test('pure: immutable156 missing outcome and public fact clocks remain unreinterpreted',()=>{
  const prior=JSON.parse(readFileSync(new URL('../ops/evidence-audits/2026-10-14-garfield-checkpoint-review.json',import.meta.url)));
  const row=prior.extraction_review_queue.find(r=>r.id===resident.id);
  assert.equal(row.state,'expected-text-missing-review');assert.equal(row.claim_verified,false);
  assert.equal(row.source_text_sha256,reconciliation.source.prior_native_text_sha256);
  assert.equal(row.source_attempted_at,reconciliation.source.prior_native_attempted_at);
  assert.equal(row.original_verified_on,'2026-10-13');
});
