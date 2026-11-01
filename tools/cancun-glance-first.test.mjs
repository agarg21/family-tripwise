import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {cancunResortPage,cancunGrandparentsSection,cancunGrandparentsCsv} from './page-generation/cancun-resort-page.mjs';
import {renderQuickComparison,renderOverview,comparisonCsv,bookingChecklistText,esc,dollars,shownPrice,withdrawnPrice} from '../src/prototypes/cancun-resort-comparison/render.mjs';
import {cancunEvidence} from '../src/prototypes/cancun-resort-comparison/data.mjs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
test('Cancun table precedes complete setup and grandparents case',()=>{
  const h=cancunResortPage();assert.equal(h,read('site/where-to-stay/cancun-family-resorts.html'));
  const intro=h.split('<section class="page-intro">')[1].split('</section>')[0];
  assert.doesNotMatch(intro.replace(/<div id="cancun-price-answer"[\s\S]*?<\/div>/,''),/<ul>|download>/);assert.doesNotMatch(intro,/download>/);assert.match(intro,/September 23, 2026/);
  assert.ok(intro.includes('href="#grandparents-budget"'));assert.ok(intro.includes('href="#child-offer"'));
  assert.ok(h.indexOf(renderQuickComparison())<h.indexOf('id="room-setup"'));assert.ok(h.indexOf('id="room-setup"')<h.indexOf(cancunGrandparentsSection()));
  assert.ok(h.indexOf(cancunGrandparentsSection())<h.indexOf(renderOverview()));
});
test('table, cards and source-backed budgets remain exact shared outputs',()=>{
  const h=cancunResortPage();assert.ok(h.includes(renderQuickComparison()));assert.ok(h.includes(renderOverview()));
  for(const [p,s] of [['cancun-room-comparison.csv',comparisonCsv()],['cancun-grandparents-budget.csv',cancunGrandparentsCsv()],['cancun-booking-checklist.txt',bookingChecklistText()]])assert.equal(read('site/downloads/'+p),s);
  assert.match(h,/two bedrooms do not by themselves guarantee a connecting door/);assert.match(h,/A four-adult, two-child price is not verified/);
});
test('existing exports are closed native secondary disclosures after the tables',()=>{
  const h=cancunResortPage();assert.match(h,/<details id="comparison-downloads"><summary>Save this comparison/);
  assert.match(h,/<details id="grandparents-download"><summary>Save this party&#39;s budget|<details id="grandparents-download"><summary>Save this party's budget/);
  assert.doesNotMatch(h,/<details id="(?:comparison-downloads|grandparents-download)" open/);
  assert.ok(h.indexOf('id="comparison-downloads"')>h.indexOf(renderQuickComparison()));
  assert.equal((h.match(/ download>/g)||[]).length,3);
});
test('native scope keeps all room and section targets and does not change indexability',()=>{
  const h=cancunResortPage();for(const id of ['finest-family-suite','sunscape-family-junior-suite','sapphire-family-junior-suite','royalton-splash-two-bedroom','ziva-ocean-view-double','grand-family-suite','grandparents-budget','quick-comparison','family-check','child-offer','before-booking'])assert.ok(h.includes(`id="${id}"`),id);
  assert.equal((h.match(/rel="canonical"/g)||[]).length,1);assert.doesNotMatch(h,/noindex/);
  const css=read('site/cancun-resorts.css');assert.match(css,/\.cancun-page \.page-intro h1 \{ font-size: var\(--t-2xl\); letter-spacing: 0/);
  // D23 batch 2: the phone size is the fluid token too (no separate 30px rule).
});
test('compact scan keeps party, stay, fee and links to the full-basis disclosure',()=>{
  const h=renderQuickComparison();assert.doesNotMatch(h,/<details/);
  for(const r of cancunEvidence.records.filter(shownPrice))assert.ok(h.includes(`<a href="#${r.id}-price-basis">How we checked this price</a>`),r.id);
  for(const r of cancunEvidence.records.filter(shownPrice)){
    assert.ok(r.price.scan.basis);assert.ok(r.price.scan.fees);
    assert.ok(h.includes(r.price.observedOn));assert.ok(h.includes(esc(dollars(r.price.scan.basis))));
    assert.ok(h.includes(esc(dollars(r.price.scan.fees))));
  }
  // Past-stay samples (Sunscape Oct 27, Grand Oct 18) are withdrawn from the table: no amount, a plain check-live line.
  assert.deepEqual(cancunEvidence.records.filter(withdrawnPrice).map(r=>r.id),['sunscape-family-junior-suite','grand-family-suite']);
  for(const r of cancunEvidence.records.filter(withdrawnPrice))assert.doesNotMatch(h,new RegExp(`${r.id}-price-basis`));
  assert.equal((h.match(/No current price: check live rates\.<\/strong>/g)||[]).length,2);
  for(const s of ['$3,532 displayed total','ages 3/7/12','ages 3/7','September low-season','environmental sanitation excluded','Not a live quote','stay dates that have passed, so we removed it'])assert.ok(h.includes(esc(s)),s);
  for(const s of ['$934','$9,723','$311','$1,945','USD 934','USD 9,723','October 27-30, 2026','October 18-23, 2026'])assert.ok(!h.includes(s),s);
});
test('default print has full original price evidence without opening screen details',()=>{
  const h=renderQuickComparison(),blocks=[...h.matchAll(/<div class="quick-price-print">([\s\S]*?)<\/div>/g)].map(m=>m[1]);
  const priced=cancunEvidence.records.filter(shownPrice);assert.equal(blocks.length,3);
  for(const [i,r]of priced.entries()){assert.doesNotMatch(blocks[i],/<details/);assert.ok(blocks[i].includes(esc(r.price.basis)));assert.ok(blocks[i].includes(esc(r.price.fees)));for(const c of r.room.checks)assert.ok(blocks[i].includes(esc(c)));}
  const css=read('site/cancun-resorts.css');assert.match(css,/\.cancun-page \.quick-price-print \{ display: none; \}/);
  assert.match(css,/@media print \{\s*\.cancun-page \.quick-price-screen \{ display: none; \}\s*\.cancun-page \.quick-price-print \{ display: block; \}/);
});

test('Q09c Cancun readability: each dated amount shown once on screen; full price basis in one collapsed How we checked block per record',()=>{
  const h=cancunResortPage();
  const visible=h.replace(/<div id="cancun-price-answer"[\s\S]*?<\/div>/,'').replace(/<script[\s\S]*?<\/script>/g,'').replace(/<details[\s\S]*?<\/details>/g,'').replace(/<div class="quick-price-print">[\s\S]*?<\/div>/g,'').replace(/<[^>]+>/g,' ');
  // The top answer card repeats the headline amounts by design; below it each dated amount appears once.
  assert.doesNotMatch(visible,/USD \d/);
  const counts={};for(const a of visible.match(/\$\d[\d,]*(?:\.\d+)?/g))counts[a]=(counts[a]||0)+1;
  for(const [a,n] of Object.entries(counts))assert.equal(n,1,a);
  const o=renderOverview();
  for(const r of cancunEvidence.records.filter(shownPrice)){
    const art=o.match(new RegExp(`<article class="resort-row" id="${r.id}">[\\s\\S]*?</article>`))[0];
    const blocks=art.match(/<details class="how-checked" id="[^"]+"><summary>How we checked<\/summary>[\s\S]*?<\/details>/g)||[];
    assert.equal(blocks.length,1,r.id);assert.ok(blocks[0].includes(`id="${r.id}-price-basis"`));
    assert.ok(blocks[0].includes(esc(r.price.basis)));assert.ok(blocks[0].includes(esc(r.price.fees)));assert.ok(blocks[0].includes(r.price.observedOn));
    assert.doesNotMatch(art.replace(/<details[\s\S]*?<\/details>/g,''),/USD \d/);
  }
  assert.match(o,/<article class="resort-row" id="ziva-ocean-view-double">[\s\S]*?Exact-room nightly price: not verified/);
  assert.match(h,/cancun-resorts\.css\?v=ft-d23b/);
  assert.match(read('site/cancun-resorts.css'),/\.cancun-page \.how-checked > summary \{ min-height: 44px;/);
});
