import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {sourceSignals} from './evidence-audit.mjs';
const config=JSON.parse(readFileSync(new URL('../ops/evidence-watch.json',import.meta.url))),records=config.records.filter(r=>r.id.startsWith('garfield-'));
const checks=records.map(r=>({id:r.id,pattern:r.pattern}));
const fixture='<p>Adults (18 to 64): $10. Children (7 to 17): $5. Seniors (65+): $5. Chicago residents receive free admission. Closed Monday and Tuesday. Garden reservations last 30 minutes.</p>';
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
