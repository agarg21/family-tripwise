import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {pvPath,pvPack,pvPrices,pvRooms,pvCsv,pvExcluded,pvTaskEvidence,puertoVallartaFamilyResortsPage,pvExampleStay,pvWithdrawnBasis,pvWithdrawnId,pvFiveSearches,pvFiveNights} from "./page-generation/puerto-vallarta-family-resorts-page.mjs";
import {validateRoomPack,screenRoomPack} from "./family-room-task.mjs";
import {readableComparisonCsv,labelOlderStaySamples,roomComparisonCsv,comparisonHeadings} from "./family-room-comparison.mjs";
import {maintenanceReport} from "./site-maintenance.mjs";
import {pvMealPlanComparison} from "./pv-meal-plan-comparison.mjs";
import { readableText } from "./page-generation/readable-text.mjs";
const read=p=>readFileSync(new URL(`../${p}`,import.meta.url),"utf8");
test("Q17b: PV withdraws the Oct 9 Nov 8-13 Sanctuary prices everywhere and says check live rates",()=>{
 const html=puertoVallartaFamilyResortsPage();
 assert.doesNotMatch(html+pvCsv,/876\.4|1176\.2|4382|5881|1499|299\.80|USD \d|November 8-13, 2026|2026-11-08|2026-11-13|October 28|Fall Sale/);
 assert.doesNotMatch(html,/id="meal-plan-increment"|id="food-budget"|food-budget-form/);
 assert.doesNotMatch(html+pvCsv,/No exact-family November|Actual search entered|priced Sanctuary|arithmetic nightly/);
 assert.equal((html.match(/<div id="pv-price-answer"[\s\S]*?<\/div>/)[0].match(/>(Check rates on the official&nbsp;site|Official room page)<\/a>/g)||[]).length,3);
 assert.ok(pvRooms.every(r=>r.price.status==="not-observed"&&r.price.amount===null&&!r.price.rates));
 assert.deepEqual(pvPack.scenario.stay,pvExampleStay);assert.deepEqual(pvExampleStay,{arrival:"2027-01-15",departure:"2027-01-20"});
 const card=puertoVallartaFamilyResortsPage("2026-11-22").match(/<div id="pv-price-answer"[\s\S]*?<\/details><\/div>/)[0];
 for(const text of ["Family of 5 (2 adults + kids 4, 8 and 12)","No 2-night price yet: check live rates","sleeps up to 6","sleeps up to 7","kids club ages 3-12","Nayarit coast, not Puerto Vallarta city","Every other night showed no price; on Oct 31, January 2027 stays showed none","kids 4-12 pay half the adult price","may not apply to sale rates","All three suites list limits of 6 or 7 guests, so a family of 4 is within those limits","November 8-13 only, so we removed them","not a confirmed bed"])assert.ok(card.includes(text),text);
 for(const id of ["pv-garza-panoramic-two-bedroom","pv-garza-sanctuary-two-bedroom","bahia-family"])assert.ok(card.includes(`href="#${id}"`),id);
 assert.ok(pvCsv.includes(pvWithdrawnBasis));assert.equal(pvCsv,read('site/downloads/puerto-vallarta-family-resorts.csv'));
});
test("Q17b: the 'no price' claim matches the October 31 Google Hotels receipts (exact titles, this party, no price)",()=>{
 const rows=["dataforseo-q17b-six-pages-a-2026-10-31.json","dataforseo-q17b-midweek-b-2026-10-31.json"].flatMap(f=>JSON.parse(read(`docs/research/${f}`)).searches.filter(s=>s.label.startsWith("pv-")));
 assert.equal(rows.length,6);
 for(const s of rows){assert.deepEqual(s.party,{adults:2,child_ages:[4,8,12]});assert.match(s.check_in,/^2027-01-/);assert.match(s.checked_at,/^2026-10-31/);
  const exact=s.matched.filter(r=>["Garza Blanca Preserve Resort & Spa Puerto Vallarta","Dreams Bahia Mita Surf & Spa Resort"].includes(r.title));
  assert.equal(exact.length,1,s.label);assert.equal(exact[0].price,null,s.label);}
 assert.ok(rows.some(s=>s.label.startsWith("pv-dreams-bahia-mita")));
});
test("G18: family-of-4 Hilton price, holiday tables, family-of-5 single nights, and samples drop 7 days before arrival",()=>{
 const html=puertoVallartaFamilyResortsPage("2026-11-22"),card=html.match(/<div id="pv-price-answer"[\s\S]*?<\/details><\/div>/)[0];
 for(const t of ["About $1,185 a night","≈ $2,370 for 2 nights (estimate)","seen Nov 22, 2026"," Dreams Vallarta Bay, Dreams Bahia Mita and Garza Blanca showed no price for these nights.","Fri–Sun, Jan 22–24, 2027","2 adults + kids 5 and 8","Not a quote"])assert.ok(card.includes(t),t);
 // Family of 5: Garza priced Fri Jan 22 only (room type not shown): shown as one night, never as a suite price or a 2-night total.
 for(const t of ["No 2-night price yet: check live rates","Seen Nov 22: Garza Blanca, Fri Jan 22 only, ≈ $822 a night (estimate).","Room type not shown, so not a price for these suites.","no suite price found","Garza Blanca, Fri Jan 22: ≈ $822 a night. Every other night showed no price"])assert.ok(card.includes(t),t);
 assert.doesNotMatch(card,/\$1,644/);
 assert.equal(pvFiveNights("2026-11-22").length,1);
 assert.match(html,/only one-night prices so far/);
 const holiday=html.match(/<section id="holiday-prices"[^>]*>[\s\S]*?<\/section>/)[0];
 for(const t of ["$1,369 Friday only","≈ $1,462 a night","Fri $1,462, Sat $1,461: $2,923 for 2 nights","$1,543 Saturday only","No price shown on Nov&nbsp;22","seen Nov 22, 2026"])assert.ok(holiday.includes(t),t);
 assert.ok(pvFiveSearches.length===12&&pvFiveSearches.filter(s=>s.results.some(r=>/^(Garza Blanca Preserve Resort|Dreams Bahia Mita Surf)/.test(r.title)&&r.price!==null)).map(s=>s.label).join()==="pv-garza-jan22-1n");
 const dec=puertoVallartaFamilyResortsPage("2026-12-18");assert.doesNotMatch(dec,/Dec 25–27/);assert.match(dec,/Jan 1–3/);
 const jan=puertoVallartaFamilyResortsPage("2026-12-25");assert.doesNotMatch(jan,/id="holiday-prices"/);assert.match(jan,/About \$1,185/);
 const late=puertoVallartaFamilyResortsPage("2027-01-15");
 assert.doesNotMatch(late,/\$1,185|\$2,370|\$822|one-night prices|Seen Nov 22: Garza/i);assert.match(late,/No current price yet: check live rates/);assert.match(late,/showed no family-of-5 price/);
 assert.doesNotMatch(late,/one resort priced|Hilton's price at the top|family-of-4 Google Hotels samples|What this price covers/);
 assert.equal((holiday.match(/far apart; we can't explain it/g)||[]).length,0,"no holiday pair is far apart on Nov 22");assert.doesNotMatch(holiday,/more than double/);
 assert.match(card,/confirm meals and kids' charges/);assert.match(holiday,/taxes, fees and meals may not be included/);
});
test("Q17b: the PV January 2027 example stay is replaced before it can pass",()=>{
 const today=new Intl.DateTimeFormat("en-CA",{timeZone:"America/New_York"}).format(new Date());
 assert.ok(today<"2027-01-08",`PV example stay ${pvExampleStay.arrival} needs new dates (and any new price search) before arrival; update pvExampleStay and regenerate`);
});
test("PV comparison and full CSV share original maintained category/price joins",()=>{
 assert.deepEqual(validateRoomPack(pvPack),[]);assert.equal(pvRooms.length,3);assert.equal(pvExcluded.length,6);
 assert.equal(read(`site/${pvPath}`),puertoVallartaFamilyResortsPage());assert.equal(read("site/downloads/puerto-vallarta-family-resorts.csv"),pvCsv);
 assert.equal(pvCsv,readableComparisonCsv(labelOlderStaySamples(roomComparisonCsv(pvPack,pvPack.scenario,"2026-10-09",[]))));
 const rows=pvCsv.trimEnd().split("\n").map(line=>[...line.matchAll(/"((?:[^"]|"")*)"(?:,|$)/g)].map(m=>m[1].replaceAll('""','"')));
 assert.equal(rows.length,4);assert.deepEqual(rows[0],comparisonHeadings);assert.ok(rows.every(row=>row.length===35));
 assert.deepEqual(pvRooms.map(r=>r.checked_on),["2026-10-09","2026-10-09","2026-10-03"]);
 assert.ok(pvRooms.every(r=>r.screening==="CONDITIONAL_PUBLISHED_CAPACITY"));
});
test("generic child meal block separates policy, promotion, selected tax and billing units",()=>{
 const html=puertoVallartaFamilyResortsPage(),block=html.match(/<div id="meal-policy-boundaries"[\s\S]*?<\/div>(?=<article id="pv-garza-sanctuary)/)[0];
 for(const text of ["Ages 4-12: half price", "13+: adult price", "Ages 4, 8, 12", "All guests in the same room", "cannot combine with promotions", "no child discount is deducted", "withdrawn October 9 Sanctuary plan prices excluded tax", "ask which basis your written offer uses", "at least 3 consecutive days", "Five hotel nights do not establish billable meal units", "Whether your offer follows this policy", "remain unverified", "check current terms before booking"])assert.ok(block.includes(text),text);
 assert.match(block,/tabindex="0" role="region" aria-label="Generic child meal policy"/);assert.match(block,/scroll-margin-top:128px/);
 assert.doesNotMatch(block,/USD \d|free for all|confirmed meals/);
 const watch=JSON.parse(read('ops/evidence-watch.json')).records.find(r=>r.id==='pv-generic-meal-policy');assert.equal(watch.verified_on,'2026-10-10');assert.equal(watch.interval_days,30);assert.ok(block.includes(watch.source_urls[0]));
});
test("Sanctuary never inherits Panoramic kitchen; the research record keeps the withdrawn Oct 9 samples, unrendered",()=>{
 assert.equal(pvRooms[0].kitchen,"not-established");assert.equal(pvRooms[1].kitchen,"published-kitchen");assert.equal(pvRooms[0].id,pvWithdrawnId);
 assert.deepEqual(pvRooms[0].conflicts,[]);assert.deepEqual(pvRooms[0].price.missing_basis,[pvWithdrawnBasis]);
 assert.equal(pvPrices[0].checked_on,"2026-10-09");
 const later=screenRoomPack(pvPack,{...pvPack.scenario,stay:{arrival:"2026-11-08",departure:"2026-11-13"}},"2026-10-24",pvPrices);assert.match(later[0].price.status,/historical/);
 const html=puertoVallartaFamilyResortsPage();assert.ok(html.includes("our October 9 plan prices for November 8-13 are withdrawn"));
 assert.doesNotMatch(html,/No source renewal of069|No card, payment, BOOK HERE/);
});
test("PV rendered trust, care, base, age and public-plan limits stay explicit",()=>{
 const html=puertoVallartaFamilyResortsPage();for(const text of ["Nayarit coast, not Puerto Vallarta city", "not a city-wide", "No price found; check live rates", "leave 13-17 unclassified", "not final reservation acceptance", "January 2026", "July 29, 2026", "not Family Tripwise verification", "CC BY-SA 4.0", "November 23, 2022", "not observed same-party booking acceptance", "not every room", "potty-training"])assert.ok(html.includes(text),text);
 assert.match(html,/id="kitchen-only"/);assert.match(html,/role="status" aria-live="polite"/);assert.match(html,/tabindex="0" role="region" aria-label="Room comparison"/);
 assert.doesNotMatch(html,/AggregateRating|"@type":"Offer"|noindex/);
 assert.equal(pvPrices[0].checked_on,"2026-10-09");assert.equal(pvTaskEvidence.new_url.qualified,true);
});
test("PV owns one canonical job with discovery and original-source watches",()=>{
 const url=`https://familytripwise.com/${pvPath}`,html=puertoVallartaFamilyResortsPage();assert.equal((html.match(/<h1>/g)||[]).length,1);
 assert.ok(html.includes(`<link rel="canonical" href="${url}">`));assert.equal(read("site/sitemap.xml").split(`<loc>${url}</loc>`).length-1,1);
 assert.ok(read("site/index.html").includes(pvPath));assert.ok(read("site/about.html").includes("Puerto Vallarta"));assert.ok(read("ops/gsc-monitor.json").includes(url));
 const watch=JSON.parse(read("ops/evidence-watch.json")).records.filter(r=>r.page_url===url&&r.id!=="pv-generic-meal-policy");assert.equal(watch.length,4);
 assert.deepEqual(watch.map(r=>r.verified_on),["2026-10-09","2026-10-03","2026-10-09","2026-10-09"]);
 const schema=JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/)[1]);assert.equal(schema["@type"],"WebPage");assert.equal(schema.url,url);
});
test("PV maintenance respects mixed source clocks and unpriced historical controls",async()=>{
 const today=(await maintenanceReport({today:"2026-10-09"})).exact_room_comparisons[2];assert.equal(today.records.length,3);assert.equal(today.records[0].price_age.due_on,null);assert.equal(today.records[0].price_status,"not-observed");assert.equal(today.records[2].category_age.due_on,"2026-11-02");
 const before=(await maintenanceReport({today:"2026-10-01"})).exact_room_comparisons[2];assert.equal(before.records.length,0);
 const mixed=(await maintenanceReport({today:"2026-10-03"})).exact_room_comparisons[2];assert.equal(mixed.records.length,1);assert.equal(mixed.records[0].id,"bahia-family");assert.equal(mixed.records[0].price_observed_on,null);
});

test("Q09c PV readability: dated amounts shown once; provenance sits in collapsed How we checked blocks",()=>{
 const html=puertoVallartaFamilyResortsPage();
 const visible=html.replace(/<script[\s\S]*?<\/script>/g,"").replace(/<details[\s\S]*?<\/details>/g,"").replace(/<div id="pv-price-answer"[\s\S]*?<\/div>/,"").replace(/<section id="holiday-prices"[^>]*>[\s\S]*?<\/section>/,"").replace(/<[^>]+>/g," ");
 assert.doesNotMatch(visible,/USD \d|\$\d/); // G18: dollar samples only in the top answer and the holiday tables
 const articles=html.match(/<article id="[^"]+" class="dc-room"[\s\S]*?<\/article>/g);assert.equal(articles.length,3);
 for(const article of articles){
  assert.equal((article.match(/<details class="how-checked"><summary>How we checked<\/summary>/g)||[]).length,1);
  assert.match(article.match(/<details class="how-checked">[\s\S]*?<\/details>/)[0],/Official category source<\/a> &middot; facts checked \d{4}-\d\d-\d\d\./);
  assert.doesNotMatch(article.replace(/<details[\s\S]*?<\/details>/g,""),/Official category source|Approx\. nightly|Km7\.5/);
 }
 assert.match(html,/<section id="methodology"><h2>How we checked this page<\/h2><p>Research, not firsthand resort reviews: we have not stayed at any of these resorts/);
 assert.match(html,/washington-dc-comparison\.css\?v=ft-d23b/);
});
