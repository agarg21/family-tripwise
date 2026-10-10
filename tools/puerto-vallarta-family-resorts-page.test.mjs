import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {pvPath,pvPack,pvPrices,pvRooms,pvCsv,pvExcluded,pvTaskEvidence,puertoVallartaFamilyResortsPage} from "./page-generation/puerto-vallarta-family-resorts-page.mjs";
import {validateRoomPack,screenRoomPack} from "./family-room-task.mjs";
import {roomComparisonCsv,comparisonHeadings} from "./family-room-comparison.mjs";
import {maintenanceReport} from "./site-maintenance.mjs";
import {pvMealPlanComparison} from "./pv-meal-plan-comparison.mjs";
const read=p=>readFileSync(new URL(`../${p}`,import.meta.url),"utf8");
test("PV exposes same-record meal-plan increment and preserves unknown cost rights",()=>{
 const html=puertoVallartaFamilyResortsPage(),comparison=pvMealPlanComparison(pvPrices);
 assert.equal(comparison.stay_increment,1499);assert.equal(comparison.nightly_increment,299.8);
 for(const text of ['id="meal-plan-increment"','USD 1499.00 more','USD 299.80 per configuration/night',
   'not a per-person food budget','exclude tax','rounded whole-dollar','conflicts with opened ten-day',
   '35% deposit is payment timing','not an extra fee','age 12 is not under 12','not re-priced','Original price review due October 23'])assert.ok(html.includes(text),text);
 assert.equal((html.match(/id="meal-plan-increment"/g)||[]).length,1);
 for(const rate of pvRooms[0].price.rates)assert.ok(html.includes(`${rate.nightly_average.toFixed(2)} <span>${rate.plan}</span>`));
 assert.equal(pvCsv,read('site/downloads/puerto-vallarta-family-resorts.csv'));
});
test("PV comparison and full CSV share original maintained category/price joins",()=>{
 assert.deepEqual(validateRoomPack(pvPack),[]);assert.equal(pvRooms.length,3);assert.equal(pvExcluded.length,6);
 assert.equal(read(`site/${pvPath}`),puertoVallartaFamilyResortsPage());assert.equal(read("site/downloads/puerto-vallarta-family-resorts.csv"),pvCsv);
 assert.equal(pvCsv,roomComparisonCsv(pvPack,pvPack.scenario,"2026-10-09",pvPrices));
 const rows=pvCsv.trimEnd().split("\n").map(line=>[...line.matchAll(/"((?:[^"]|"")*)"(?:,|$)/g)].map(m=>m[1].replaceAll('""','"')));
 assert.equal(rows.length,5);assert.deepEqual(rows[0],comparisonHeadings);assert.ok(rows.every(row=>row.length===35));
 assert.deepEqual(pvRooms.map(r=>r.checked_on),["2026-10-09","2026-10-09","2026-10-03"]);
 assert.ok(pvRooms.every(r=>r.screening==="CONDITIONAL_PUBLISHED_CAPACITY"));
});
test("Sanctuary price never inherits Panoramic kitchen or prices regional category",()=>{
 assert.equal(pvRooms[0].kitchen,"not-established");assert.equal(pvRooms[1].kitchen,"published-kitchen");
 assert.deepEqual(pvRooms[0].price.rates.map(p=>p.nightly_average),[876.4,1176.2]);
 assert.ok(pvRooms.slice(1).every(r=>r.price.amount===null));assert.equal(pvRooms[0].price.requested_individual_ages_confirmed,true);
 const html=puertoVallartaFamilyResortsPage();for(const rate of pvRooms[0].price.rates){assert.ok(html.includes(`USD ${rate.stay_amount.toFixed(2)}`));assert.ok(html.includes(rate.cancellation));}
 assert.ok(html.includes(pvRooms[0].price.fee_basis));
 assert.ok(html.includes(pvRooms[0].price.deposit_basis.split(" No card,")[0]));
 assert.ok(pvCsv.includes(pvRooms[0].price.deposit_basis));
 assert.doesNotMatch(html,/No source renewal of069|No card, payment, BOOK HERE/);
 const later=screenRoomPack(pvPack,pvPack.scenario,"2026-10-24",pvPrices);assert.match(later[0].price.status,/historical/);
});
test("PV rendered trust, care, base, age and public-plan limits stay explicit",()=>{
 const html=puertoVallartaFamilyResortsPage();for(const text of ["Nayarit coast, not Puerto Vallarta city", "not a city-wide", "Unpriced", "before tax", "ages 13-17 remain unclassified", "up to two children under 12", "not under 12", "not final reservation acceptance", "No child was silently reclassified", "January 2026", "July 29, 2026", "not Family Tripwise verification", "CC BY-SA 4.0", "November 23, 2022", "not observed same-party booking acceptance", "not a typical seasonal range", "not every room", "potty-training"])assert.ok(html.includes(text),text);
 assert.match(html,/id="kitchen-only"/);assert.match(html,/role="status" aria-live="polite"/);assert.match(html,/tabindex="0" role="region" aria-label="Room comparison"/);
 assert.doesNotMatch(html,/AggregateRating|"@type":"Offer"|noindex/);
 assert.equal(pvPrices[0].checked_on,"2026-10-09");assert.equal(pvTaskEvidence.new_url.qualified,true);
});
test("PV owns one canonical job with discovery and original-source watches",()=>{
 const url=`https://familytripwise.com/${pvPath}`,html=puertoVallartaFamilyResortsPage();assert.equal((html.match(/<h1>/g)||[]).length,1);
 assert.ok(html.includes(`<link rel="canonical" href="${url}">`));assert.equal(read("site/sitemap.xml").split(`<loc>${url}</loc>`).length-1,1);
 assert.ok(read("site/index.html").includes(pvPath));assert.ok(read("site/about.html").includes("Puerto Vallarta"));assert.ok(read("ops/gsc-monitor.json").includes(url));
 const watch=JSON.parse(read("ops/evidence-watch.json")).records.filter(r=>r.page_url===url);assert.equal(watch.length,4);
 assert.deepEqual(watch.map(r=>r.verified_on),["2026-10-09","2026-10-03","2026-10-09","2026-10-09"]);
 const schema=JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/)[1]);assert.equal(schema["@type"],"WebPage");assert.equal(schema.url,url);
});
test("PV maintenance respects mixed source clocks and unpriced historical controls",async()=>{
 const today=(await maintenanceReport({today:"2026-10-09"})).exact_room_comparisons[2];assert.equal(today.records.length,3);assert.equal(today.records[0].price_age.due_on,"2026-10-23");assert.equal(today.records[2].category_age.due_on,"2026-11-02");
 const before=(await maintenanceReport({today:"2026-10-01"})).exact_room_comparisons[2];assert.equal(before.records.length,0);
 const mixed=(await maintenanceReport({today:"2026-10-03"})).exact_room_comparisons[2];assert.equal(mixed.records.length,1);assert.equal(mixed.records[0].id,"bahia-family");assert.equal(mixed.records[0].price_observed_on,null);
});
