import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {bostonPath,bostonPack,bostonPrices,bostonRooms,bostonCsv,bostonExcluded,bostonFamilyHotelPage} from "./page-generation/boston-family-hotels-page.mjs";
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
 const watch=JSON.parse(read("ops/evidence-watch.json")).records.filter(r=>r.page_url.endsWith(bostonPath));
 assert.equal(watch.length,3);assert.deepEqual(watch.map(r=>r.verified_on),["2026-10-01","2026-10-03","2026-10-01"]);
 const sources=Object.values(bostonPack.sources).map(s=>s.url);
 for(const record of watch)for(const url of record.source_urls)assert.ok(sources.includes(url),url);
 assert.ok(JSON.parse(read("ops/gsc-monitor.json")).urls?.includes(`https://familytripwise.com/${bostonPath}`) || read("ops/gsc-monitor.json").includes(`https://familytripwise.com/${bostonPath}`));
});
