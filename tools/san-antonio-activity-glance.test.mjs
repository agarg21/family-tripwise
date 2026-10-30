import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync} from 'node:fs';
import {activityPages} from './page-generation/upgrade-page-data.mjs';
const read=p=>readFileSync(new URL(`../${p}`,import.meta.url),'utf8');
const html=read('site/things-to-do/san-antonio-with-kids.html');
const page=activityPages['things-to-do/san-antonio-with-kids.html'];
const esc=v=>String(v).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
test('San Antonio top photo banner, then comparison before the filter cards',()=>{
  const at=html.indexOf('id="sa-activity-comparison"');assert.ok(at>0);
  const banner=html.indexOf('<figure class="licensed-photo hero-photo">');assert.ok(html.indexOf('<h1>')<banner&&banner<at);assert.equal((html.match(/<figure /g)||[]).length,1);
  assert.ok(at<html.indexOf('data-tags='));assert.ok(at<html.indexOf('Five useful ways to start'));
  assert.equal((html.match(/Activity decision table<\/h2>/g)||[]).length,1);
  assert.match(html,/<h1>Things to Do in San Antonio With Kids: 13 Picks by Trip Style<\/h1>/);
  assert.match(html,/July 26, 2026/);assert.match(html,/Photo: Matt Harriger via <a href="https:\/\/commons.wikimedia.org\/wiki\/File:The_San_Antonio_River_Walk.jpg">Wikimedia Commons<\/a>, <a href="https:\/\/creativecommons.org\/licenses\/by-sa\/2.0\/">CC BY-SA 2.0<\/a>/);
});
test('Every original activity, estimate, filter and detail remains in the source-dated page',()=>{
  for(const row of page.rows)for(const v of row)assert.ok(html.includes(esc(v)),v);
  for(const c of page.activityCards)for(const k of ['name','summary','age','time','cost','area'])assert.ok(html.includes(esc(c[k])),c[k]);
  for(const [value,label]of page.activityFilters){assert.ok(html.includes(`data-filter="${value}"`));assert.ok(html.includes(esc(label)));}
  assert.equal((html.match(/<article class="activity-card" data-tags=/g)||[]).length,13);
  assert.equal((html.match(/<article class="quick-pick">/g)||[]).length,5);
  const details=html.match(/id="sa-activity-notes"[\s\S]*?\n      <\/section>/)[0];
  assert.equal((details.match(/<article class="detail-card">/g)||[]).length,6);
  assert.ok(html.includes(esc(page.comparisonNote)));
  assert.doesNotMatch(html,/downloads\/.*\.csv/);
});
test('Native section links and table preserve keyboard access and row identities',()=>{
  for(const id of ['sa-activity-comparison','sa-activity-filters','sa-activity-notes']){
    assert.equal((html.match(new RegExp(`href="#${id}"`,'g'))||[]).length,1);
    assert.equal((html.match(new RegExp(`id="${id}"`,'g'))||[]).length,1);
  }
  assert.match(html,/tabindex="0" role="region" aria-label="San Antonio activity comparison"/);
  const table=html.match(/id="sa-activity-comparison"[\s\S]*?<\/table>/)[0];
  assert.equal((table.match(/scope="col"/g)||[]).length,8);
  assert.equal((table.match(/role="rowheader"/g)||[]).length,13);
  const css=read('site/styles.css');assert.match(css,/\.sa-activity-glance h1 \{ font-size: 36px/);
  assert.match(css,/#sa-activity-comparison \.comparison-table :is\(th,td\):first-child \{ width: 180px; position: sticky; left: 0; background: var\(--surface\)/);
});
