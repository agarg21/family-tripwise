import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {orlandoActivityPage,writeOrlandoActivityPage} from "./page-generation/orlando-activity-page.mjs";
import {activityPath,activities,sources,checkedOn,orlandoActivityMaintenance,seaLifeTicket,admissionTariffs} from "./page-generation/orlando-activity-data.mjs";
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
test("generated Orlando hub is exact, one new canonical and reachable",()=>{
  const html=orlandoActivityPage();assert.equal(read('site/'+activityPath),html);
  assert.equal((html.match(/rel="canonical"/g)||[]).length,1);
  assert.match(html,new RegExp(`https://familytripwise.com/${activityPath}`));
  assert.equal((read('site/sitemap.xml').match(/<loc>/g)||[]).length,45);
  assert.equal(read('site/sitemap.xml').split(`https://familytripwise.com/${activityPath}`).length-1,1);
  assert.ok(read('site/index.html').includes(activityPath));
  const out=new Map();writeOrlandoActivityPage((p,s)=>out.set(p,s));assert.equal(out.size,3);assert.equal(out.get(activityPath),html);
});
test("all seven choices retain exact sources and native detail targets",()=>{
  const html=orlandoActivityPage();assert.equal(activities.length,7);assert.equal(new Set(activities.map(r=>r.id)).size,7);
  for(const r of activities){assert.ok(html.includes(`id="${r.id}"`));assert.ok(html.includes(`href="#${r.id}"`));assert.ok(r.sourceIds.every(s=>sources[s]));for(const s of r.sourceIds)assert.ok(html.includes(sources[s]));}
  assert.equal((html.match(/role="region"/g)||[]).length,3);assert.equal((html.match(/tabindex="0"/g)||[]).length,3);
  assert.doesNotMatch(html,/download|\.csv|<script src=/);
  const external=[...html.matchAll(/<script[^>]*\ssrc="([^"]+)"/g)].map(m=>m[1]);assert.deepEqual(external,["../shared/orlando-admission-form.mjs"]);
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
  const html=orlandoActivityPage();assert.match(html,/temporarily closed/);assert.match(html,/November 18 through January 3 the gardens close at 4 pm/);
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
  const r=orlandoActivityMaintenance('2026-10-13');assert.equal(r.automatic_fact_renewal,false);assert.equal(r.official.length,14);assert.equal(r.unknowns.length,2);
  const rateIds=['oscRates','crayola','mennello','leu','gator'],general=r.official.filter(s=>!rateIds.includes(s.id));
  assert.equal(general.length,9);assert.ok(general.every(s=>s.checked_on===checkedOn&&s.freshness.state==='within-review-interval'));
  assert.ok(r.official.filter(s=>rateIds.includes(s.id)).every(s=>s.checked_on==='2026-10-27'));
  const later=orlandoActivityMaintenance('2026-10-27').official;
  assert.ok(later.filter(s=>!rateIds.includes(s.id)).every(s=>s.freshness.state==='review-due'));
  assert.ok(later.filter(s=>rateIds.includes(s.id)).every(s=>s.freshness.state==='within-review-interval'));
  assert.ok(orlandoActivityMaintenance('2026-10-01').official.every(s=>s.freshness.state==='future-date-review'));
  assert.throws(()=>orlandoActivityMaintenance('bad'));
});
test("rendering is deterministic and does not mutate maintained data",()=>{
  const before=JSON.stringify({activities,sources});assert.equal(orlandoActivityPage(),orlandoActivityPage());assert.equal(JSON.stringify({activities,sources}),before);
});
test("SEA LIFE adult promotion never becomes standalone or dated family admission",()=>{
  const r=seaLifeTicket,html=orlandoActivityPage();
  assert.equal(r.currency,'USD');assert.equal(r.adult_from,29);assert.equal(r.checked_on,'2026-10-13');
  for(const key of ['child_price','selected_visit_date','exact_family_total','tax_fee_inclusion'])assert.equal(r[key],null);
  assert.equal(activities.find(a=>a.id==='sea-life').budget,null);
  assert.match(html,/Family total unknown\. Advertised SEA LIFE \+ Orlando Eye FREE from USD 29\/adult, not standalone admission/);
  assert.match(html,/Child\/date\/tax\/fee basis unconfirmed/);assert.match(html,/do not multiply it into a family total/);
  assert.doesNotMatch(html,/USD 116|USD 194|Eye is (?:open|closed)|guaranteed free/);
  assert.ok(html.includes(r.url));assert.ok(html.includes(r.hours_url));
});
test("Eye notices retain named product conflict and separate promotion freshness",()=>{
  const html=orlandoActivityPage(),r=orlandoActivityMaintenance('2026-10-20');
  assert.match(html,/separate Ultimate Florida Ticket/);assert.match(html,/maintenance notice/);assert.doesNotMatch(html,/October 12\/13/);
  assert.match(html,/inspected on October 13, 2026/);assert.match(html,/does not confirm operation on your chosen date/);assert.match(html,/not a selected-date quote/);
  assert.equal(r.ticket_promotion.freshness.state,'review-due');
  assert.equal(r.official.length,14);assert.ok(r.official.filter(s=>s.checked_on===checkedOn).every(s=>s.freshness.state==='within-review-interval'));
  assert.equal(r.unknowns.find(a=>a.id==='sea-life').exact_family_cost,null);
});

test("Q02b: per-fact dates, Spanish rate source and no-JS pointer",()=>{
  const html=orlandoActivityPage();
  assert.match(html,/Standard admission rates for the five priced outings observed October 27, 2026 on official pages\. Other rules, hours and visit details checked October 13, 2026/);
  assert.match(html,/standard rates observed October 27, 2026\./);assert.doesNotMatch(html,/October 13 published rates|Rules and published rates checked/);
  assert.match(html,/<a href="https:\/\/www\.osc\.org\/es\/visita\/">Science Center admission rates \(official Spanish-language visit page\)<\/a>/);
  for(const id of ["science-center","crayola","mennello","leu","gatorland"])
    assert.match(html,new RegExp(`<article id="${id}">[\\s\\S]*?Admission rates observed 2026-10-27; other published facts inspected 2026-10-13`),id);
  for(const id of ["sea-life","lake-eola"])
    assert.doesNotMatch(html.split(`<article id="${id}">`)[1].split("</article>")[0],/Admission rates observed/,id);
  assert.match(html,/<noscript><p>This calculator needs JavaScript\. Without it, use the <a href="#compare">comparison table above<\/a>/);
  const tariff=admissionTariffs.find(t=>t.id==="science-center");assert.equal(tariff.sourceUrl,"https://www.osc.org/es/visita/");assert.equal(tariff.checkedOn,"2026-10-27");
  const r=orlandoActivityMaintenance("2026-10-28");
  assert.equal(r.official.find(s=>s.id==="oscRates").checked_on,"2026-10-27");assert.equal(r.official.find(s=>s.id==="sea").checked_on,"2026-10-13");
});
