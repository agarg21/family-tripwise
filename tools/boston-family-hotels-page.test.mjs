import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {bostonPath,bostonPack,bostonPrices,bostonRooms,bostonCsv,bostonExcluded,bostonFamilyHotelPage,bostonBreakfastUpgrade} from "./page-generation/boston-family-hotels-page.mjs";

test("overview retains each exact public plan beside its own nightly sample",()=>{
 const html=bostonFamilyHotelPage();
 for(const room of bostonRooms){
  const row=html.match(new RegExp(`<tr data-room="${room.id}"[^>]*>(.*?)</tr>`))[1];
  const samples=[...row.matchAll(/<p><strong>USD ([\d.]+)<\/strong><br>([^<]+)<\/p>/g)].map(m=>({amount:Number(m[1]),plan:m[2]}));
  assert.deepEqual(samples,(room.price.rates??[]).map(rate=>({amount:rate.nightly_average,plan:rate.plan})));
  if(!room.price.rates)assert.ok(row.includes("<strong>Unpriced</strong>"));
 }
 assert.doesNotMatch(html,/<strong><p>/);
});

test("rate-plan task is dated proxy evidence and never renews prices or ranks hotels",()=>{
 const task=JSON.parse(read("docs/research/boston-public-rate-plan-task-2026-10-09.json"));
 assert.equal(task.action,"FT-IMP-080");assert.equal(task.evidence_class,"PAGE_ONLY_PROXY_TASK_WITH_REUSED_BOOKING_CHECK");
 assert.deepEqual(task.source_observed_on,bostonRooms.slice(0,2).map(room=>room.price.observed_on));
 assert.equal(task.scenario.sample_ceiling_usd_configuration_night,500);
 const row=bostonFamilyHotelPage().match(/<tr data-room="boston-park-plaza-deluxe-double"[^>]*>(.*?)<\/tr>/)[1];
 assert.match(row,/<strong>USD 372.10<\/strong><br>Non-refundable/);
 assert.match(row,/<strong>USD 444.84<\/strong><br>Flexible Rate/);
 assert.match(row,/<strong>USD 528.68<\/strong><br>Breakfast Included/);
 assert.match(row,/October 1 public-plan samples including displayed tax and destination fee; ages unresolved/);
 assert.doesNotMatch(row,/cheapest|live quote|all-in|fits.*budget/i);
});
import {validateRoomPack} from "./family-room-task.mjs";
import {roomComparisonCsv} from "./family-room-comparison.mjs";
const read=p=>readFileSync(new URL(`../${p}`,import.meta.url),"utf8");
test("Boston exact category and CSV generation share maintained records",()=>{
 assert.deepEqual(validateRoomPack(bostonPack),[]);assert.equal(bostonRooms.length,4);assert.equal(bostonExcluded.length,3);
 assert.equal(read(`site/${bostonPath}`),bostonFamilyHotelPage());assert.equal(read("site/downloads/boston-family-hotels.csv"),bostonCsv);
 assert.equal(bostonCsv,roomComparisonCsv(bostonPack,bostonPack.scenario,"2026-10-09",bostonPrices));assert.equal(bostonCsv.trim().split("\n").length,7);
 assert.deepEqual(bostonExcluded.map(r=>r.configurations[0].maximum),[4,3,4]);
});
test("Boston normalization preserves original amounts and stops count-only age acceptance",()=>{
 const old=JSON.parse(read("docs/research/boston-park-plaza-price-observation-2026-10-01.json"))[0];const normalized=bostonPrices[1];
 for(const key of ["rates","party","category","arrival","departure","checked_on","fee_basis","deposit_basis"])assert.deepEqual(normalized[key],old[key]);
 assert.equal(normalized.schema_version,5);assert.equal(normalized.engine_party.child_age_from,null);assert.equal(normalized.engine_party.child_age_to,null);assert.equal(normalized.engine_party.child_ages,null);assert.equal(normalized.requested_individual_ages_confirmed,false);
 assert.equal(bostonRooms[1].price.status,"dated-age-unresolved-count-samples");assert.equal(bostonRooms[0].price.observed_on,"2026-10-03");assert.equal(bostonRooms[1].price.observed_on,"2026-10-01");
 assert.deepEqual(bostonRooms.slice(0,2).flatMap(r=>r.price.rates.map(p=>p.nightly_average)),[781,372.1,444.84,528.68]);
 for(const r of bostonRooms.slice(0,2)){for(const p of r.price.rates){assert.ok(bostonFamilyHotelPage().includes(`USD ${p.stay_amount.toFixed(2)}`));assert.ok(bostonFamilyHotelPage().includes(p.cancellation));}assert.ok(bostonFamilyHotelPage().includes(r.price.fee_basis));assert.ok(bostonFamilyHotelPage().includes(r.price.deposit_basis));}
});
test("Boston page retains all price, kitchen, bedding, exclusions and trust limits",()=>{
 const html=bostonFamilyHotelPage();for(const text of ["not a city-wide", "Unpriced", "pre-tax", "child-age band", "not One Dalton", "table seats four", "Family Suite", "not exported as candidates", "King Studio", "not a reservation", "not seasonal ranges", "not checked again at launch", "CC BY 2.0", "2019", "no more than 2 adults and 4 children"])assert.ok(html.includes(text),text);
 assert.match(html,/id="kitchen-only"/);assert.match(html,/role="status" aria-live="polite"/);assert.match(html,/tabindex="0" role="region" aria-label="Room comparison"/);assert.match(html,/washington-dc-comparison.js/);assert.doesNotMatch(html,/AggregateRating|"@type":"Offer"|noindex/);
});
test("Boston has one canonical job and maintained discovery without removing previous URLs",()=>{
 const url=`https://familytripwise.com/${bostonPath}`,html=bostonFamilyHotelPage();assert.equal((html.match(/<h1>/g)||[]).length,1);assert.ok(html.includes(`<link rel="canonical" href="${url}">`));assert.equal(read("site/sitemap.xml").split(`<loc>${url}</loc>`).length-1,1);assert.ok(read("site/index.html").includes(bostonPath));assert.ok(read("site/about.html").includes("Boston"));
 const schema=JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/)[1]);assert.equal(schema["@type"],"WebPage");assert.equal(schema.url,url);
});
test("Boston refresh registry uses maintained exact sources and original dates",()=>{
 const watch=JSON.parse(read("ops/evidence-watch.json")).records.filter(r=>r.page_url.endsWith(bostonPath)&&r.id!=="boston-museum-admission-return");
 assert.equal(watch.length,4);assert.deepEqual(watch.map(r=>r.verified_on),["2026-10-01","2026-10-03","2026-10-01","2026-10-09"]);
 const sources=Object.values(bostonPack.sources).map(s=>s.url);
 for(const record of watch)for(const url of record.source_urls)assert.ok(sources.includes(url),url);
 assert.ok(JSON.parse(read("ops/gsc-monitor.json")).urls?.includes(`https://familytripwise.com/${bostonPath}`) || read("ops/gsc-monitor.json").includes(`https://familytripwise.com/${bostonPath}`));
});

test("museum admission component is source-dated, keyboard-readable and never a checkout or reentry promise",()=>{
 const html=bostonFamilyHotelPage(),section=html.match(/<div id="museum-budget" class="dc-room">([\s\S]*?)<\/div>\n<p>Two selected/)[1];
 for(const text of ["USD 24.00","USD 120.00 admission component","USD 4.00 per transaction","Not a final checkout total","do not add it again","Tax inclusion is unknown","TJX $1 Sunday Afternoon","does not establish exit and re-entry","cannot be applied after purchase","inspected October 9","Review due October 23","not checked again"]){assert.ok(section.includes(text),text);}
 assert.match(section,/tabindex="0" role="region" aria-label="Museum admission budget"/);
 assert.match(section,/cg=TT&amp;c=TT/);assert.doesNotMatch(section,/USD 124|"@type":"Offer"|guaranteed|per night/);
 const watch=JSON.parse(read("ops/evidence-watch.json")).records.find(r=>r.id==="boston-museum-admission-return");
 assert.equal(watch.verified_on,"2026-10-09");assert.equal(watch.interval_days,14);
 assert.equal(watch.evidence_path,"docs/research/boston-museum-return-policy-2026-10-09.json");
 assert.ok(watch.source_urls.every(url=>section.includes(url.replaceAll('&','&amp;'))));
});

test("Boston breakfast premium uses stay-total cents, not rounded nightly subtraction",()=>{
 const b=bostonBreakfastUpgrade();assert.equal(b.stay_increment,419.22);assert.equal(b.nightly_equivalent,83.84);
 assert.notEqual(b.stay_increment,(528.68-444.84)*5);
 assert.equal(b.observation.checked_on,"2026-10-01");assert.equal(b.observation.requested_individual_ages_confirmed,false);
 assert.equal(b.included_adults,2);assert.deepEqual(b.included_child_ages,[4]);assert.deepEqual(b.uncovered_child_ages,[8,12]);
 assert.deepEqual(b.plans.map(p=>p.plan),["Flexible Rate","Breakfast Included"]);
 assert.equal(b.plans[0].cancellation,b.plans[1].cancellation);
});
test("breakfast join rejects wrong source, party, dates, member, duplicate and cancellation basis without mutation",()=>{
 const saved=structuredClone(bostonPrices);
 for(const mutate of [p=>p[1].checked_on="2026-10-09",p=>p[1].party.child_ages=[4,8,13],p=>p[1].arrival="2026-11-09",p=>p[1].currency="GBP",p=>p[1].rates[2].eligibility="member",p=>p[1].rates.push({...p[1].rates[2]}),p=>p[1].rates[2].cancellation="Different",p=>p.push({...p[1]}),p=>p[1].rates[2].meals="Breakfast for registered adults only",p=>p[1].rates[1].meals="Breakfast included for everyone",p=>{p[1].rates[1].cancellation=p[1].rates[2].cancellation="Free cancellation November1";},p=>p[1].fee_basis="Taxes and destination fee excluded",p=>p[1].deposit_basis="Nonrefundable payment in advance",p=>p[1].engine_party.individual_ages_entered=true]){
  const invalid=structuredClone(bostonPrices);mutate(invalid);assert.throws(()=>bostonBreakfastUpgrade(invalid));
 }
 bostonBreakfastUpgrade();assert.deepEqual(bostonPrices,saved);
});
test("public meal comparison preserves count-only uncertainty, partial fees and original clocks",()=>{
 const html=bostonFamilyHotelPage();for(const text of ["USD 419.22", "USD 83.84", "Not breakfast for all five", "Ages 8 and 12 outside", "not individual age acceptance", "already included once", "not a value winner", "not re-priced", "due October 15", "no number of breakfasts"]){assert.ok(html.toLowerCase().includes(text.toLowerCase()),text);}
 assert.match(html,/id="breakfast-upgrade" data-room="boston-park-plaza-deluxe-double" data-kitchen="not-established" class="dc-room"/);
 assert.match(html,/tabindex="0" role="region" aria-label="Park Plaza breakfast upgrade"/);
 assert.equal(bostonCsv,roomComparisonCsv(bostonPack,bostonPack.scenario,"2026-10-09",bostonPrices));
});
