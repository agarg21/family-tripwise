import assert from "node:assert/strict";
import { stripSiteChrome } from "./page-generation/site-chrome.mjs";
import test from "node:test";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { dcPath, dcPack, dcPrices, dcPremiums, dcWithdrawnPriceFiles, dcRooms, dcCsv, dcFamilyHotelPage, writeWashingtonDcFamilyHotelsPage, dcTransitEvidence, dcTransitExamples, dcFamilyRailForm } from "./page-generation/washington-dc-family-hotels-page.mjs";
import {readableComparisonCsv,labelOlderStaySamples,roomComparisonCsv } from "./family-room-comparison.mjs";
import { validateRoomPack } from "./family-room-task.mjs";
import { readableText } from "./page-generation/readable-text.mjs";
const read = path => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("DC exact-owner page and complete CSV match maintained shared records", () => {
  assert.deepEqual(validateRoomPack(dcPack), []);
  assert.deepEqual(dcRooms.map(room => room.id), ["dc-embassy-deluxe-double", "dc-homewood-two-queen", "dc-pendry-two-bedroom"]);
  assert.equal(read(`site/${dcPath}`), dcFamilyHotelPage());
  assert.equal(read("site/downloads/washington-dc-family-hotels.csv"), dcCsv);
  assert.equal(dcCsv, readableComparisonCsv(labelOlderStaySamples(roomComparisonCsv(dcPack, dcPack.scenario, "2026-10-09", dcPrices))));
  assert.equal(dcCsv.trim().split("\n").length, 4); // header + one row per category; the withdrawn per-plan price rows are gone (Q17b)
  assert.doesNotMatch(dcFamilyHotelPage(), /Residence Inn|Hyatt|AggregateRating|"@type":"Offer"/);
  const generated = new Map();
  writeWashingtonDcFamilyHotelsPage((path, value) => generated.set(path,value));
  assert.deepEqual([...generated.keys()], [dcPath,"downloads/washington-dc-family-hotels.csv",
    "shared/rest-time-budget.mjs", "shared/museum-rest-budget.mjs", "shared/family-transit-cost.mjs", "shared/family-rail-budget.mjs"]);
  assert.equal(generated.get(dcPath), dcFamilyHotelPage());
  assert.equal(generated.get("downloads/washington-dc-family-hotels.csv"), dcCsv);
});
test("Q17b: the November 8-13, 2026 Hilton rate samples are withdrawn from page, CSV and schema", () => {
  const html = dcFamilyHotelPage();
  assert.deepEqual(dcPrices, []);
  assert.deepEqual(dcPremiums, []);
  for (const room of dcRooms) assert.equal(room.price.rates, undefined);
  // The archived September 30 observations still exist as research, but none of their amounts reach the public page or download.
  const archived = dcWithdrawnPriceFiles.flatMap(name => JSON.parse(read(`docs/research/${name}`)));
  assert.equal(archived.length, 2);
  for (const record of archived) for (const rate of record.rates) {
    for (const value of [rate.stay_amount, rate.nightly_average].filter(Number.isFinite)) {
      assert.ok(!html.includes(`USD ${value.toFixed(2)}`), String(value));
      assert.ok(!dcCsv.includes(value.toFixed(2)), String(value));
    }
  }
  assert.doesNotMatch(html, /data-plan-premium|dc-rate-table"|Dated booking-check source|Older observation September 30/);
  assert.match(html, /could not re-check, so they were removed October 30/);
  assert.equal((html.match(/could not be re-checked, so it was removed October 30/g) || []).length, 2);
  assert.match(html, /<h2>What to price before booking<\/h2>/);
  assert.doesNotMatch(dcCsv, /"observed"/);
});
test("unknown age, fee, route and unpriced status cannot become a family-budget winner", () => {
  const html = dcFamilyHotelPage();
  for (const phrase of ["child-age band", "individual ages", "No current price", "Not evidence of sold-out", "Budget gap", "incidentals authorization", "entrance-to-room", "not a representative DC", "Premium category"]) assert.ok(html.includes(phrase),phrase);
  assert.match(html, /maximum 5/);
  assert.match(html, /maximum 5, no more than 4 adults/);
  assert.match(html, /Cooking kitchen not established/);
  assert.match(html, /Full kitchen lists stove/);
  assert.doesNotMatch(html, /USD is the retained interpretation/); // no hotel amount is shown any more (Q17b)
  assert.doesNotMatch(dcCsv, /provider-counts-unknown-child-band/); // that basis came only from the withdrawn rate samples (Q17b)
  assert.match(dcCsv, /not-observed/);
});
test("one discoverable canonical DC job, constrained factual schema and licensed place image", () => {
  const html=dcFamilyHotelPage(), url=`https://familytripwise.com/${dcPath}`;
  assert.equal((html.match(/<h1>/g)||[]).length,1);
  assert.ok(html.includes(`<link rel="canonical" href="${url}">`));
  assert.doesNotMatch(html,/noindex|nofollow/);
  const schema=JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/)[1]);
  assert.equal(schema.url,url); assert.equal(schema["@type"],"WebPage");
  assert.equal(schema.dateModified,"2026-10-30");
  assert.equal(read("site/sitemap.xml").split(`<loc>${url}</loc>`).length-1,1);
  assert.equal((read("site/sitemap.xml").match(/<loc>/g)||[]).length,56);
  assert.ok(stripSiteChrome(read("site/index.html")).includes(dcPath));
  assert.match(html,/Johnny Bivera/); assert.match(html,/2005/); assert.match(html,/public domain record/);
});
test("kitchen filter is reversible and retains details/price context without transmitting data", () => {
  const rows=dcRooms.map(room=>({dataset:{kitchen:room.kitchen},hidden:false}));
  const details=dcRooms.map(room=>({dataset:{kitchen:room.kitchen},hidden:false}));
  const toolbar={hidden:true}, status={textContent:""}, checkbox={checked:false,addEventListener(name,fn){this.change=fn;assert.equal(name,"change");}};
  const document={querySelector(selector){return {".dc-toolbar":toolbar,"#kitchen-only":checkbox,"#comparison-status":status}[selector];},querySelectorAll(selector){return selector.startsWith("#comparison")?rows:details;}};
  const client=read("site/washington-dc-comparison.js");
  const window={location:{hash:""},addEventListener(name,fn){assert.equal(name,"hashchange");this.hashchange=fn;}};
  runInNewContext(client,{document,window});
  assert.equal(toolbar.hidden,false); assert.equal(status.textContent,"3 room categories");
  checkbox.checked=true;checkbox.change();
  assert.deepEqual(rows.map(row=>row.hidden),[true,false,true]);
  assert.deepEqual(details.map(row=>row.hidden),[true,false,true]);
  assert.match(status.textContent,/1 room category/);
  checkbox.checked=false;checkbox.change();assert.ok(rows.every(row=>!row.hidden));
  assert.doesNotMatch(client,/fetch\(|XMLHttpRequest|sendBeacon|localStorage|sessionStorage|document.cookie/);
  assert.match(dcFamilyHotelPage(),/class="dc-toolbar" hidden/);
  assert.equal((dcFamilyHotelPage().match(/class="dc-room"/g)||[]).length,3);
});

test("DC public extra-trip examples retain maintained party, source date and shared conditional arithmetic", () => {
  const task = JSON.parse(read("docs/research/dc-public-transit-budget-task-2026-10-09.json"));
  assert.equal(task.fresh_source_inspection, false);
  assert.equal(task.source_inspected_on, dcTransitEvidence.policy.source.inspected_on);
  assert.deepEqual(task.scenario.child_ages, [4,8,12]);
  assert.equal(task.scenario.adults,2);
  assert.equal(task.human_tested,false);
  assert.equal(task.next_review_due,"2026-11-02");
  assert.equal(dcTransitExamples.length,3);
  dcTransitExamples.forEach(({input,result},index) => {
    const expected = task.expected_examples[index];
    assert.equal(input.fare_period,expected.fare_period);
    assert.equal(input.rail_trips,expected.rail_trips);
    assert.equal(result.paying_riders,expected.paying_riders);
    assert.equal(result.free_children,expected.free_children);
    assert.equal(result.minimum,expected.minimum_usd);
    assert.equal(result.maximum,expected.maximum_usd);
    assert.equal(result.actual_trip_cost,null);
    assert.equal(result.hotel_return_feasible,"UNKNOWN");
    assert.equal(result.estimate_status,"CONDITIONAL_NETWORK_BAND");
    assert.equal(result.inspected_on,"2026-10-03");
  });
});

test("public rail budget is no-JS, age-bounded, source-linked and never a hotel-night or November quote", () => {
  const html=dcFamilyHotelPage(), section=html.match(/<section id="rail-budget">([\s\S]*?)<\/section>/)[1];
  assert.equal((section.match(/<tr>/g)||[]).length,4);
  for(const value of ["USD 18.00-USD 54.00","USD 36.00-USD 108.00","USD 18.00-USD 20.00","age 4 is free","four regular-fare riders","not per night or a route quote","not four trains","check current fares before the trip","visit-date fare remain unknown","not establish a workable rest return","Hotel price and property check dates are unchanged"])
    assert.ok(section.includes(value),value);
  assert.ok(section.includes(`href="${dcTransitEvidence.policy.source.url}"`));
  assert.ok(section.includes(`href="${dcTransitEvidence.corroborating_source.url}"`));
  assert.match(section,/tabindex="0" role="region" aria-label="Conditional family rail budget"/);
  assert.ok(section.includes(dcFamilyRailForm()));
  assert.match(dcFamilyRailForm(), /<form id="family-rail-form" hidden/);
  assert.doesNotMatch(section.replace(dcFamilyRailForm(), ""), /hidden/);
  assert.doesNotMatch(section,/current quote|free family travel|per room|all-fee total is|verified nap-friendly/);
  assert.match(html,/href="#rail-budget">Family rail budget/);
});

test("Q09c DC readability: hotel amounts shown once; provenance sits in collapsed How we checked blocks", () => {
  const html = dcFamilyHotelPage();
  const hotelSections = html.match(/<section id="comparison">[\s\S]*?<section id="rail-budget">/)[0];
  const visible = hotelSections.replace(/<script[\s\S]*?<\/script>/g, "").replace(/<details[\s\S]*?<\/details>/g, "").replace(/<[^>]+>/g, " ");
  const counts = {};
  for (const amount of visible.match(/USD \d[\d,]*\.\d\d/g) || []) counts[amount] = (counts[amount] || 0) + 1;
  for (const [amount, count] of Object.entries(counts)) assert.equal(count, 1, amount);
  for (const room of dcRooms.filter(room => room.price.rates)) for (const rate of room.price.rates) {
    assert.equal(counts[`USD ${rate.nightly_average.toFixed(2)}`], 1);
    assert.equal(counts[`USD ${rate.stay_amount.toFixed(2)}`], 1);
  }
  const articles = html.match(/<article id="[^"]+" class="dc-room"[\s\S]*?<\/article>/g);
  assert.equal(articles.length, 3);
  for (const article of articles) {
    assert.equal((article.match(/<details class="how-checked"><summary>How we checked<\/summary>/g) || []).length, 1);
    assert.match(article.match(/<details class="how-checked">[\s\S]*?<\/details>/)[0], /Official category source<\/a> &middot; facts checked \d{4}-\d\d-\d\d\./);
    assert.doesNotMatch(article.replace(/<details[\s\S]*?<\/details>/g, ""), /Official category source|Dated booking-check source|Approx\. nightly/);
  }
  assert.match(html, /<section id="methodology"><h2>How we checked this page<\/h2><p>Research, not firsthand hotel reviews: we have not stayed in these suites/);
  assert.match(html, /washington-dc-comparison\.css\?v=ft-q09c2/);
});
