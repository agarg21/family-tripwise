import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {orlandoActivityPage,writeOrlandoActivityPage} from "./page-generation/orlando-activity-page.mjs";
import {activityPath,activities,sources,checkedOn,orlandoActivityMaintenance} from "./page-generation/orlando-activity-data.mjs";
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
test("generated Orlando hub is exact, one new canonical and reachable",()=>{
  const html=orlandoActivityPage();assert.equal(read('site/'+activityPath),html);
  assert.equal((html.match(/rel="canonical"/g)||[]).length,1);
  assert.match(html,new RegExp(`https://familytripwise.com/${activityPath}`));
  assert.equal((read('site/sitemap.xml').match(/<loc>/g)||[]).length,35);
  assert.equal(read('site/sitemap.xml').split(`https://familytripwise.com/${activityPath}`).length-1,1);
  assert.ok(read('site/index.html').includes(activityPath));
  const out=new Map();writeOrlandoActivityPage((p,s)=>out.set(p,s));assert.equal(out.size,1);assert.equal(out.get(activityPath),html);
});
test("all seven choices retain exact sources and native detail targets",()=>{
  const html=orlandoActivityPage();assert.equal(activities.length,7);assert.equal(new Set(activities.map(r=>r.id)).size,7);
  for(const r of activities){assert.ok(html.includes(`id="${r.id}"`));assert.ok(html.includes(`href="#${r.id}"`));assert.ok(r.sourceIds.every(s=>sources[s]));for(const s of r.sourceIds)assert.ok(html.includes(sources[s]));}
  assert.equal((html.match(/role="region"/g)||[]).length,2);assert.equal((html.match(/tabindex="0"/g)||[]).length,2);
  assert.doesNotMatch(html,/download|\.csv|<script src=/);
});
test("admission arithmetic retains ages, units, online versus onsite and tax unknowns",()=>{
  const [osc,c,sea,m,l,g]=activities;
  assert.equal(osc.budget,2*29+2*22);assert.match(osc.age,/13-17/);
  assert.equal(c.budget,4*30.99);assert.match(c.price,/plus tax/);
  assert.equal(m.budget,2*8+3);assert.equal(l.budget,2*15+10);assert.equal(Math.round(g.budget*100),2*3499+2*2499);
  assert.equal(sea.budget,null);assert.equal(activities[6].budget,null);
  assert.match(orlandoActivityPage(),/children 3\/10/);assert.match(orlandoActivityPage(),/Not dated availability or complete day costs/);
});
test("split-day suggestions never become completion or return guarantees",()=>{
  const [osc,c,sea]=activities;assert.equal(osc.returnRule,null);assert.equal(sea.returnRule,null);
  assert.match(c.returnRule,/before exit/);assert.deepEqual(c.duration,[180,240]);assert.deepEqual(sea.duration,[120,180]);
  const html=orlandoActivityPage();assert.match(html,/Shorter than its 3-4 hour suggestion/);assert.match(html,/At the lower end of its 2-3 hour suggestion/);
  assert.match(html,/not automatically practical/);assert.match(html,/normally closes except OCPS breaks/);
});
test("closures and source conflicts remain visible without importing stale holiday or parking facts",()=>{
  const html=orlandoActivityPage();assert.match(html,/temporarily closed/);assert.match(html,/October 17,2026 closes 4 pm/);
  assert.match(html,/old dates/);assert.match(html,/hours differ/);assert.match(html,/old Science Center garage fee/);
  assert.doesNotMatch(html,/November 25|January 1, 2022|garage for a \$5/);
});
test("table precedes six visible persona defaults and independent review signals stay limited",()=>{
  const html=orlandoActivityPage(),routes=html.split('<div class="routes">')[1].split('</div>')[0];assert.equal((routes.match(/<p>/g)||[]).length,6);
  assert.ok(html.indexOf('Compare Non-Park Choices')<html.indexOf('Start With Your Day'));
  for(const id of ['park-day','split-day','science-center','mennello','lake-eola','base-check'])assert.ok(html.includes(`href="#${id}"`));
  assert.match(html,/not Family Tripwise reviews/);assert.match(html,/Positive-selection bias/);assert.match(html,/No comparable review sample/);
});
test("maintenance is dated and fails closed on missing calendar input",()=>{
  const r=orlandoActivityMaintenance('2026-10-13');assert.equal(r.automatic_fact_renewal,false);assert.equal(r.official.length,13);assert.equal(r.unknowns.length,2);
  assert.ok(r.official.every(s=>s.checked_on===checkedOn&&s.freshness.state==='within-review-interval'));
  assert.ok(orlandoActivityMaintenance('2026-10-27').official.every(s=>s.freshness.state==='review-due'));
  assert.ok(orlandoActivityMaintenance('2026-10-01').official.every(s=>s.freshness.state==='future-date-review'));
  assert.throws(()=>orlandoActivityMaintenance('bad'));
});
test("rendering is deterministic and does not mutate maintained data",()=>{
  const before=JSON.stringify({activities,sources});assert.equal(orlandoActivityPage(),orlandoActivityPage());assert.equal(JSON.stringify({activities,sources}),before);
});
