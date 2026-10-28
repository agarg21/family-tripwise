import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {activityPages} from './page-generation/upgrade-page-data.mjs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8'),h=read('site/things-to-do/chicago-with-kids.html'),p=activityPages['things-to-do/chicago-with-kids.html'],esc=v=>String(v).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
test('Chicago comparison precedes photo and cards with all original fields',()=>{
 const at=h.indexOf('id="chi-activity-comparison"');assert.ok(at>0&&at<h.indexOf('<figure class="licensed-photo">')&&at<h.indexOf('data-tags='));for(const r of p.rows)for(const v of r)assert.ok(h.includes(esc(v)),v);assert.deepEqual(p.frontComparisonOrder,[0,1,2,3,4,5,6,7,9,10,8]);const table=h.match(/id="chi-activity-comparison"[\s\S]*?<\/table>/)[0];assert.equal((table.match(/role="rowheader"/g)||[]).length,12);assert.equal((table.match(/scope="col"/g)||[]).length,11);assert.match(table,/<th scope="col">Booking<\/th><\/tr>/);assert.equal((h.match(/Activity decision table<\/h2>/g)||[]).length,1);
});
test('Chicago four native routes keep source clocks, Garfield and all advice',()=>{
 for(const id of ['chi-activity-comparison','chi-activity-filters','chi-activity-notes']){assert.equal((h.match(new RegExp(`id="${id}"`,'g'))||[]).length,1);assert.equal((h.match(new RegExp(`href="#${id}"`,'g'))||[]).length,1);}assert.match(h,/<a href="#garfield-admission">Admission checks<\/a>/);assert.match(h,/Garfield Park admission checked:<\/strong> October 13, 2026 · <strong>Other attraction sources checked:<\/strong> July 23, 2026/);assert.match(h,/Admission checked 2026-10-13/);assert.match(h,/\+ unpriced<br>age 3/);assert.equal((h.match(/<article class="activity-card" data-tags=/g)||[]).length,12);assert.equal((h.match(/<article class="quick-pick">/g)||[]).length,5);assert.doesNotMatch(h,/downloads\/.*\.csv/);assert.match(h,/tabindex="0" role="region" aria-label="Chicago activity comparison"/);
});
test('Chicago scoped styles keep readable identity and booking checks',()=>{
 const css=read('site/styles.css');assert.match(css,/\.chi-activity-glance h1 \{ font-size: 36px/);assert.match(css,/#chi-activity-comparison \.comparison-table \{ min-width: 1740px; table-layout: fixed/);assert.match(css,/#chi-activity-comparison \.comparison-table :is\(th,td\):first-child \{ width: 180px; position: sticky/);assert.match(css,/#chi-activity-comparison \.comparison-table :is\(th,td\):last-child \{ width: 150px/);assert.match(css,/#chi-activity-comparison \.comparison-table :is\(th,td\):first-child \{ width: 130px/);
});
