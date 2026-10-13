import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {teenPages} from './page-generation/upgrade-page-data.mjs';
const read=p=>readFileSync(new URL(`../${p}`,import.meta.url),'utf8'),html=read('site/things-to-do/san-antonio-with-teens.html'),page=teenPages['things-to-do/san-antonio-with-teens.html'];
const esc=v=>String(v).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
test('Teen comparison leads the original photo and quick picks without renewing facts',()=>{
  const at=html.indexOf('id="sa-activity-comparison"');assert.ok(at>0&&at<html.indexOf('<figure class="licensed-photo">')&&at<html.indexOf('id="sa-activity-quick-picks"'));
  assert.equal((html.match(/Teen activity decision table<\/h2>/g)||[]).length,1);
  assert.match(html,/<h1>Things to Do in San Antonio With Teens: 10 Picks by Trip Style<\/h1>/);
  assert.match(html,/Attraction facts and official sources checked:<\/strong> July 27, 2026/);
  assert.match(html,/Matt Harriger via/);assert.doesNotMatch(html,/downloads\/.*\.csv/);
  assert.equal((html.match(/<article class="quick-pick">/g)||[]).length,5);
  assert.equal((html.match(/<article class="detail-card">/g)||[]).length,5);
  assert.equal((html.match(/<article class="plan-card">/g)||[]).length,3);
});
test('All seven original fields remain aligned, with the decisive check displayed last',()=>{
  const order=[0,1,2,3,4,6,5];
  const headers=order.map(i=>`<th scope="col">${esc(page.comparisonHeaders[i])}</th>`).join('');assert.ok(html.includes(headers));
  for(const row of page.rows){const cells=order.map((i,j)=>`<td${j===0?' role="rowheader"':''}>${esc(row[i])}</td>`).join('');assert.ok(html.includes(`<tr>${cells}</tr>`),row[0]);}
  assert.equal((html.match(/role="rowheader"/g)||[]).length,10);assert.ok(html.includes(esc(page.comparisonNote)));
});
test('Comparison, quick-pick and detail links use native reachable targets',()=>{
  for(const id of ['sa-activity-comparison','sa-activity-quick-picks','sa-activity-notes']){assert.equal((html.match(new RegExp(`href="#${id}"`,'g'))||[]).length,1);assert.equal((html.match(new RegExp(`id="${id}"`,'g'))||[]).length,1);}
  assert.match(html,/tabindex="0" role="region" aria-label="San Antonio teen activity comparison"/);
  assert.match(html,/class="sa-activity-glance sa-teen-glance"/);assert.match(html,/child-ticket cutoff/);assert.match(html,/does not make independent-roaming or safety assurances/);
  assert.match(read('site/styles.css'),/\.sa-teen-glance #sa-activity-comparison \.comparison-table \{ min-width: 1160px; \}/);
});
