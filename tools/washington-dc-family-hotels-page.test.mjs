import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { dcPath, dcPack, dcPrices, dcRooms, dcCsv, dcFamilyHotelPage, writeWashingtonDcFamilyHotelsPage } from "./page-generation/washington-dc-family-hotels-page.mjs";
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
  assert.equal((read("site/sitemap.xml").match(/<loc>/g)||[]).length,32);
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
