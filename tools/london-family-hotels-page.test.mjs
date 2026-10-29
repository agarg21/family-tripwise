import assert from "node:assert/strict";
import { stripSiteChrome } from "./page-generation/site-chrome.mjs";
import {readFileSync} from "node:fs";
import test from "node:test";
import {londonFamilyHotelPage,londonRooms,londonMaintenance,londonParty,londonPath,londonPhoto,londonCategorySource,writeLondonFamilyHotelsPage} from "./page-generation/london-family-hotels-page.mjs";
const read=p=>readFileSync(new URL(`../${p}`,import.meta.url),"utf8");
test("London page owns exactly three dated source-backed apartment configurations",()=>{
  const rows=londonRooms();assert.equal(rows.length,3);
  assert.deepEqual(rows.map(r=>r.price.rates.map(x=>x.nightly_average)),[[406.98,452.2],[308.7,343],[527.2,585.2]]);
  assert.deepEqual(rows.map(r=>r.checked_on),["2026-09-30","2026-10-02","2026-10-03"]);
  assert.deepEqual(rows.map(r=>r.price.observed_on),["2026-10-02","2026-10-02","2026-10-03"]);
  assert.ok(rows.every(r=>r.price.currency==="GBP"&&r.price.unit==="configuration/night"&&r.price.fee_basis&&r.price.deposit_basis));
});
test("London prices cannot transfer to another party or stay; old observations downgrade",()=>{
  for(const party of [{...londonParty,child_ages:[4,8,12]},{...londonParty,stay:{arrival:"2026-11-09",departure:"2026-11-14"}}])assert.ok(londonRooms("2026-10-13",party).every(r=>!r.price.rates?.length));
  const old=londonRooms("2026-11-04");assert.ok(old.every(r=>r.price.status.startsWith("historical-")&&r.screening==="RECHECK_SOURCE"));
  const detached=londonRooms();detached[0].price.rates[0].nightly_average=0;assert.equal(londonRooms()[0].price.rates[0].nightly_average,406.98);
});
test("native page keeps full family, fees, source and selected-review limitations",()=>{
  const h=londonFamilyHotelPage();assert.equal((h.match(/data-room=/g)||[]).length,3);assert.equal((h.match(/<details class="how-checked">/g)||[]).length,4);assert.equal((h.match(/<details>/g)||[]).length,0);
  for(const t of ["2 adults + children aged 4, 8, 12 and 15","November 8-13, 2026","not current quotes","not a typical seasonal price range","five-person prices","exact-age acceptance remains unconfirmed","Individual ages were entered","Not a complete checkout total","duplex","not representative","stay fee","not refreshed during page assembly","Member-only plans are excluded"])assert.ok(h.includes(t),t);
  assert.equal((h.match(/<h1>/g)||[]).length,1);assert.ok(!h.includes("downloads/"));assert.equal((h.match(/<script /g)||[]).length,1);
  assert.ok(h.includes("Not established by this report: six occupants"));assert.ok(h.includes("Reported category: One Bedroom Apartment"));
  assert.ok(londonCategorySource(londonRooms()[2]).endsWith("/2-bedroom-apartment"));
  for(const r of londonRooms()){assert.ok(h.includes(r.source_url.replaceAll("&","&amp;")));assert.ok(h.includes(`href="#${r.id.replace("marlin-","").replace("-two-bedroom","")}"`));}
});
test("London writer emits only one canonical page, not another CSV or runtime",()=>{
  const output=new Map();writeLondonFamilyHotelsPage((p,b)=>output.set(p,b));assert.deepEqual([...output.keys()],[londonPath]);assert.equal(output.get(londonPath),londonFamilyHotelPage());
  const h=output.get(londonPath);assert.ok(h.includes(`href="https://familytripwise.com/${londonPath}"`));
  assert.equal((read("site/sitemap.xml").match(new RegExp(londonPath,"g"))||[]).length,1);
  assert.ok(stripSiteChrome(read("site/index.html")).includes(londonPath));assert.ok(read("site/about.html").includes("London adds"));assert.ok(read("ops/gsc-monitor.json").includes(londonPath));
});
test("dated maintenance and licensed orientation image do not renew sources",()=>{
  assert.equal(londonMaintenance("2026-10-12").records.length,0);assert.equal(londonMaintenance("2026-10-13").records.length,3);
  assert.equal(londonMaintenance("2026-10-13").records[0].price_age.due_on,"2026-10-16");assert.equal(londonMaintenance("2026-10-13").records[2].category_age.due_on,"2026-11-02");
  assert.equal(londonPhoto.taken_on,"2009-06-19");assert.equal(londonPhoto.author,"DAVID ILIFF");assert.equal(londonPhoto.license,"https://creativecommons.org/licenses/by-sa/3.0/");
  const h=londonFamilyHotelPage();for(const t of ["June 19, 2009","resized and cropped to fit","not a current hotel, room or route image","check live rates before booking"])assert.ok(h.includes(t),t);
  const css=read("site/styles.css");assert.ok(css.includes(".london-page tbody th { background: #fff; }"));assert.ok(css.includes(".london-scroll { max-width: 100%; overflow-x: auto; }"));assert.ok(css.includes("position: sticky; left: 0"));assert.ok(!css.includes(".london-page h1 { font-size: 3vw"));
});
test("each dated GBP amount appears once on screen; provenance sits in collapsed How we checked blocks",()=>{
  const h=stripSiteChrome(londonFamilyHotelPage());
  const visible=h.replace(/<details class="how-checked">[\s\S]*?<\/details>/g,"");
  const count=(text,needle)=>text.split(needle).length-1;
  for(const r of londonRooms())for(const p of r.price.rates){
    for(const amount of [p.nightly_average,p.stay_amount]){const m=`GBP ${Number(amount).toFixed(2)}`;assert.equal(count(visible,m),1,m);}
  }
  for(const r of londonRooms()){
    const block=h.match(new RegExp(`<section id="${r.id.replace("marlin-","").replace("-two-bedroom","")}"[\\s\\S]*?</section>`))[0];
    const how=block.match(/<details class="how-checked">([\s\S]*?)<\/details>/)[1];
    assert.ok(how.includes("Official category source")&&how.includes("Dated booking-check source")&&how.includes("Taxes and extras")&&how.includes("Payment and holds"));
    assert.ok(block.includes('href="#comparison"'));
    const row=h.match(new RegExp(`<tr data-room="${r.id}">[\\s\\S]*?</tr>`))[0];
    for(const p of r.price.rates)assert.ok(row.includes(`${p.plan}: <strong>GBP ${Number(p.nightly_average).toFixed(2)}</strong>`),p.plan);
  }
  assert.match(h,/<h2>How we checked this page<\/h2><p>Research, not firsthand apartment reviews/);
});
