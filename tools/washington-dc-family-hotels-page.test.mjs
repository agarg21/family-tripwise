import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { dcPath, dcPack, dcPrices, dcRooms, dcCsv, dcFamilyHotelPage, writeWashingtonDcFamilyHotelsPage, dcTransitEvidence, dcTransitExamples } from "./page-generation/washington-dc-family-hotels-page.mjs";
import { roomComparisonCsv } from "./family-room-comparison.mjs";
import { validateRoomPack } from "./family-room-task.mjs";
const read = path => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("DC exact-owner page and complete CSV match maintained shared records", () => {
  assert.deepEqual(validateRoomPack(dcPack), []);
  assert.deepEqual(dcRooms.map(room => room.id), ["dc-embassy-deluxe-double", "dc-homewood-two-queen", "dc-pendry-two-bedroom"]);
  assert.equal(read(`site/${dcPath}`), dcFamilyHotelPage());
  assert.equal(read("site/downloads/washington-dc-family-hotels.csv"), dcCsv);
  assert.equal(dcCsv, roomComparisonCsv(dcPack, dcPack.scenario, "2026-10-09", dcPrices));
  assert.equal(dcCsv.trim().split("\n").length, 7);
  assert.doesNotMatch(dcFamilyHotelPage(), /Residence Inn|Hyatt|AggregateRating|"@type":"Offer"/);
  const generated = new Map();
  writeWashingtonDcFamilyHotelsPage((path, value) => generated.set(path,value));
  assert.deepEqual([...generated.keys()], [dcPath,"downloads/washington-dc-family-hotels.csv"]);
  assert.equal(generated.get(dcPath), dcFamilyHotelPage());
  assert.equal(generated.get("downloads/washington-dc-family-hotels.csv"), dcCsv);
});
test("all five public plans retain correct nightly and stay arithmetic and payment terms", () => {
  assert.deepEqual(dcRooms.slice(0,2).flatMap(room => room.price.rates.map(rate => rate.nightly_average)), [334.68,408.14,288.97,316.61,339.97]);
  for (const room of dcRooms.slice(0,2)) {
    assert.equal(room.price.requested_individual_ages_confirmed, false);
    assert.equal(room.price.observed_on, "2026-09-30");
    for (const rate of room.price.rates) {
      assert.equal(rate.nightly_average, Math.round(rate.stay_amount/5*100)/100);
      assert.ok(dcFamilyHotelPage().includes(`USD ${rate.stay_amount.toFixed(2)}`));
      assert.ok(dcFamilyHotelPage().includes(rate.cancellation));
    }
    assert.ok(dcFamilyHotelPage().includes(room.price.fee_basis));
    assert.ok(dcFamilyHotelPage().includes(room.price.deposit_basis));
  }
});
test("DC overview names every dated public plan rather than hiding the middle rate in a band", () => {
  const task=JSON.parse(read("docs/research/dc-public-rate-plan-task-2026-10-10.json"));
  assert.equal(task.human_tested,false); assert.equal(task.fresh_source_inspection,false);
  assert.equal(task.source_observed_on,"2026-09-30"); assert.equal(task.age_provenance_corrected_on,"2026-10-05");
  assert.deepEqual(task.scenario.child_ages,[4,8,12]); assert.equal(task.scenario.nights,5);
  const overview=dcFamilyHotelPage().match(/<section id="comparison">([\s\S]*?)<\/section>/)[1];
  for(const expected of task.expected_overview) {
    const room=dcRooms.find(room=>room.id===expected.record_id);
    assert.deepEqual(room.price.rates.map(rate=>({name:rate.plan,nightly_usd:rate.nightly_average})),expected.plans);
    const row=overview.split(`<tr data-room="${room.id}"`)[1].split("</tr>")[0];
    for(const rate of room.price.rates) assert.ok(row.includes(`USD ${rate.nightly_average.toFixed(2)} ${rate.plan}`));
    assert.ok(row.includes("September 30 sample")); assert.ok(row.includes("Unconfirmed child-age basis"));
  }
  assert.equal((overview.match(/<tr data-room=/g)||[]).length,3);
  assert.equal((overview.match(/<strong>Unpriced<\/strong>/g)||[]).length,1);
  assert.doesNotMatch(overview,/USD 334\.68-USD 408\.14|USD 288\.97-USD 339\.97|USD 350|guaranteed cancellation|cheapest/);
});
test("DC premium cells retain original terms and exact stay-total arithmetic", () => {
  const html = dcFamilyHotelPage();
  assert.equal((html.match(/<th scope="col" data-plan-premium>/g) || []).length, 2);
  assert.equal((html.match(/<td data-plan-premium>/g) || []).length, 5);
  assert.equal((html.match(/<table class="dc-rate-table">/g) || []).length, 2);
  assert.match(read("site/washington-dc-comparison.css"), /\.dc-page \.dc-rate-table \{ min-width: 1000px; \}/);
  assert.match(read("site/washington-dc-comparison.css"), /\.dc-page \.dc-rate-table th:last-child \{ width: 280px; \}/);
  assert.equal((html.match(/<td data-plan-premium>Baseline<\/td>/g) || []).length, 2);
  for (const value of ["USD 367.33", "USD 73.47", "USD 138.19", "USD 27.64", "USD 254.98", "USD 51.00", "before rounding", "do not buy or guarantee current cancellation rights", "price review remains due October 14"])
    assert.ok(html.includes(value), value);
  assert.doesNotMatch(html, /USD 73\.46|guaranteed refund|current refundable quote/);
});
test("unknown age, fee, route and unpriced status cannot become a family-budget winner", () => {
  const html = dcFamilyHotelPage();
  for (const phrase of ["child-age band", "individual ages", "not a new price", "Unpriced", "Not evidence of sold-out", "not typical seasonal", "incidentals authorization", "entrance-to-room", "not a representative DC", "Premium category"]) assert.ok(html.includes(phrase),phrase);
  assert.match(html, /maximum 5/);
  assert.match(html, /maximum 5, no more than 4 adults/);
  assert.match(html, /Cooking kitchen not established/);
  assert.match(html, /Full kitchen lists stove/);
  assert.match(html, /USD is the retained interpretation/);
  assert.match(dcCsv, /provider-counts-unknown-child-band/);
  assert.match(dcCsv, /not-observed/);
});
test("one discoverable canonical DC job, constrained factual schema and licensed place image", () => {
  const html=dcFamilyHotelPage(), url=`https://familytripwise.com/${dcPath}`;
  assert.equal((html.match(/<h1>/g)||[]).length,1);
  assert.ok(html.includes(`<link rel="canonical" href="${url}">`));
  assert.doesNotMatch(html,/noindex|nofollow/);
  const schema=JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/)[1]);
  assert.equal(schema.url,url); assert.equal(schema["@type"],"WebPage");
  assert.equal(schema.dateModified,"2026-10-09");
  assert.equal(read("site/sitemap.xml").split(`<loc>${url}</loc>`).length-1,1);
  assert.equal((read("site/sitemap.xml").match(/<loc>/g)||[]).length,34);
  assert.ok(read("site/index.html").includes(dcPath));
  assert.match(html,/Johnny Bivera/); assert.match(html,/2005/); assert.match(html,/public-domain record/);
});
test("kitchen filter is reversible and retains details/price context without transmitting data", () => {
  const rows=dcRooms.map(room=>({dataset:{kitchen:room.kitchen},hidden:false}));
  const details=dcRooms.map(room=>({dataset:{kitchen:room.kitchen},hidden:false}));
  const toolbar={hidden:true}, status={textContent:""}, checkbox={checked:false,addEventListener(name,fn){this.change=fn;assert.equal(name,"change");}};
  const document={querySelector(selector){return {".dc-toolbar":toolbar,"#kitchen-only":checkbox,"#comparison-status":status}[selector];},querySelectorAll(selector){return selector.startsWith("#comparison")?rows:details;}};
  const client=read("site/washington-dc-comparison.js");
  runInNewContext(client,{document});
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
  for(const value of ["USD 18.00-USD 54.00","USD 36.00-USD 108.00","USD 18.00-USD 20.00","age 4 is free","four regular-fare riders","not per night or a route quote","not four trains","review due November 2","visit-date fare remain unknown","not establish a workable rest return","Hotel price and property check dates are unchanged"])
    assert.ok(section.includes(value),value);
  assert.ok(section.includes(`href="${dcTransitEvidence.policy.source.url}"`));
  assert.ok(section.includes(`href="${dcTransitEvidence.corroborating_source.url}"`));
  assert.match(section,/tabindex="0" role="region" aria-label="Conditional family rail budget"/);
  assert.doesNotMatch(section,/hidden|current quote|free family travel|per room|all-fee total is|verified nap-friendly/);
  assert.match(html,/href="#rail-budget">Family rail budget/);
});
