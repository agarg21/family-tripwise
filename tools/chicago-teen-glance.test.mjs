import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {teenPages} from './page-generation/upgrade-page-data.mjs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8'),h=read('site/things-to-do/chicago-with-teens.html'),p=teenPages['things-to-do/chicago-with-teens.html'],esc=v=>String(v).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
test('Chicago teen top photo banner, then comparison before picks while original sources remain dated',()=>{
 const at=h.indexOf('id="chi-activity-comparison"');assert.ok(at>0&&h.indexOf('<h1>')<h.indexOf('<figure class="licensed-photo hero-photo">')&&h.indexOf('<figure class="licensed-photo hero-photo">')<at&&(h.match(/<figure /g)||[]).length===1&&at<h.indexOf('Five ways to let the teen shape the trip'));assert.match(h,/Attraction facts and official sources checked:<\/strong> July 23, 2026/);assert.match(h,/images\/chicago-millennium-park\.webp/);assert.match(h,/creativecommons.org\/licenses\/by-sa\/3.0\//);assert.equal((h.match(/Teen activity decision table<\/h2>/g)||[]).length,1);
});
test('All eight seven-field rows and advice persist with decisive check last',()=>{
 for(const r of p.rows)for(const v of r)assert.ok(h.includes(esc(v)),v);const table=h.match(/id="chi-activity-comparison"[\s\S]*?<\/table>/)[0];assert.equal((table.match(/role="rowheader"/g)||[]).length,8);assert.equal((table.match(/scope="col"/g)||[]).length,7);assert.match(table,/<th scope="col">Pair nearby<\/th><th scope="col">Check before choosing<\/th><\/tr>/);assert.deepEqual(p.comparisonHeaders,['Activity','Teen reason','Time / cost','Area / format','Flexibility','Check before choosing','Pair nearby']);assert.equal((h.match(/<article class="quick-pick">/g)||[]).length,5);assert.equal((h.match(/<article class="detail-card">/g)||[]).length,4);assert.equal((h.match(/<article class="plan-card">/g)||[]).length,4);assert.doesNotMatch(h,/downloads\/.*\.csv/);
});
test('Chicago teen native links target its own reachable sections and scoped width',()=>{
 for(const id of ['chi-activity-comparison','chi-activity-quick-picks','chi-activity-notes']){assert.equal((h.match(new RegExp(`id="${id}"`,'g'))||[]).length,1);assert.equal((h.match(new RegExp(`href="#${id}"`,'g'))||[]).length,1);}assert.doesNotMatch(h,/sa-activity-(comparison|quick-picks|notes)/);assert.match(h,/tabindex="0" role="region" aria-label="Chicago teen activity comparison"/);assert.match(h,/class="chi-activity-glance chi-teen-glance"/);assert.match(read('site/styles.css'),/\.chi-teen-glance #chi-activity-comparison \.comparison-table \{ min-width: 1160px/);
});
