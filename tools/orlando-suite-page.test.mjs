import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { compareStay, dateNumber, renderChecks, escapeHtml } from "./page-generation/orlando-suite-model.mjs";
import { checkedOn, recheckOn, suites, sources } from "./page-generation/orlando-suite-data.mjs";
import { orlandoPath, orlandoSuitePage } from "./page-generation/orlando-suite-page.mjs";
const read = path => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("Orlando source/public parity and static example are deterministic", () => {
  assert.equal(read(`site/${orlandoPath}`), orlandoSuitePage());
  for (const name of ["data", "model", "client"]) assert.equal(read(`site/orlando/orlando-suite-${name}.mjs`), read(`tools/page-generation/orlando-suite-${name}.mjs`));
  const html = orlandoSuitePage(), example = compareStay();
  for (const row of example.rows) assert.ok(html.includes(renderChecks(example, row)));
  for (const url of Object.values(sources)) assert.ok(html.includes(url));
  assert.match(html, /<form id="stay-form" hidden>/);
  assert.match(html, /<noscript>/);
  assert.equal((html.match(/class="suite"/g) ?? []).length, 3);
});
test("one discoverable Orlando lodging URL with non-commercial factual schema", () => {
  const url = `https://familytripwise.com/${orlandoPath}`, html = orlandoSuitePage();
  assert.ok(html.includes(`<link rel="canonical" href="${url}">`));
  assert.equal((html.match(/<h1>/g) ?? []).length, 1);
  const schema = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
  assert.equal(schema.dateModified, checkedOn);
  assert.equal(schema.url, url);
  assert.equal(schema["@type"], "WebPage");
  assert.doesNotMatch(html, /noindex|AggregateRating|"@type":"Offer"/);
  assert.equal(read("site/sitemap.xml").split(`<loc>${url}</loc>`).length - 1, 1);
  assert.ok(read("site/index.html").includes(orlandoPath));
  assert.ok(JSON.parse(read("ops/gsc-monitor.json")).urls.includes(url));
});
test("five-person November task keeps capacity unknown distinct from six admissions", () => {
  const result = compareStay();
  assert.equal(result.people, 5); assert.equal(result.nights, 5);
  assert.match(result.rows[0].capacity, /headcount only/);
  assert.match(result.rows[1].dateNote, /overlaps/);
  assert.match(result.rows[2].capacity, /unresolved/);
  assert.equal(result.rows[2].resortExtra, null);
  assert.match(orlandoSuitePage(), /Express Unlimited is NOT included/);
  assert.match(orlandoSuitePage(), /FlowRider is excluded/);
  assert.match(orlandoSuitePage(), /refurbishment notice/);
});
test("headcount boundary never turns unknown occupancy into a match", () => {
  for (let children = 1; children <= 5; children++) {
    const result = compareStay({children});
    assert.match(result.rows[2].capacity, /unresolved/);
    assert.match(result.rows[0].capacity, children === 5 ? /Exceeds/ : /headcount only/);
    assert.match(result.rows[1].capacity, children === 5 ? /Exceeds/ : /headcount only/);
  }
});
test("park warnings include checkout day; fee nights exclude it; reopening is not a promise", () => {
  assert.match(compareStay({arrival:"2026-10-24",departure:"2026-10-25"}).rows[1].dateNote, /outside/);
  assert.match(compareStay({arrival:"2026-10-25",departure:"2026-10-26"}).rows[1].dateNote, /overlaps/);
  assert.match(compareStay({arrival:"2026-10-25",departure:"2026-10-27"}).rows[1].dateNote, /overlaps/);
  assert.match(compareStay({arrival:"2026-10-26",departure:"2026-10-27"}).rows[1].dateNote, /overlaps/);
  assert.match(compareStay({arrival:"2027-03-31",departure:"2027-04-01"}).rows[1].dateNote, /overlaps/);
  assert.match(compareStay({arrival:"2027-04-01",departure:"2027-04-02"}).rows[1].dateNote, /does not confirm/);
  assert.match(compareStay({arrival:"2026-12-31",departure:"2027-01-02"}).rows[0].dateNote, /2026 arrival/);
  assert.match(compareStay({arrival:"2027-07-01",departure:"2027-07-02"}).rows[0].dateNote, /unresolved/);
});
test("published fee components preserve nulls and avoid double counting", () => {
  const result = compareStay({feeIncluded:"no"});
  assert.deepEqual(result.rows.map(x => x.parking), [0,130,155]);
  assert.deepEqual(result.rows.map(x => x.resortExtra), [null,null,325]);
  assert.equal(compareStay({feeIncluded:"yes"}).rows[2].resortExtra, 0);
  assert.deepEqual(compareStay({car:"none"}).rows.map(x=>x.parking), [0,0,0]);
  assert.deepEqual(compareStay({car:"unknown"}).rows.map(x=>x.parking), [null,null,null]);
  assert.match(renderChecks(result,result.rows[2]), /only if the standard/);
  const included = compareStay({feeIncluded:"yes"});
  assert.match(renderChecks(included,included.rows[2]), /fee is not free/);
});
test("invalid dates, reversed ranges, excessive stays and malformed inputs fail", () => {
  for (const value of ["", "2026-02-30", "2026-2-01", "x", null]) assert.throws(()=>dateNumber(value));
  for (const bad of [{arrival:"2026-11-14"},{departure:"2026-11-08"},{departure:"2026-12-10"},{arrival:"2026-09-23"},{children:0},{children:6},{children:2.5},{car:"two"},{feeIncluded:"maybe"},{asOf:"bad"}]) assert.throws(()=>compareStay(bad));
  assert.equal(compareStay({arrival:"2027-12-31",departure:"2028-01-01"}).nights,1);
  assert.equal(compareStay({arrival:"2027-03-07",departure:"2027-03-15"}).nights,8);
});
test("freshness boundary and HTML escaping", () => {
  assert.equal(compareStay({asOf:"2026-10-23"}).stale,false);
  assert.equal(compareStay({asOf:recheckOn}).stale,true);
  assert.equal(escapeHtml('<b a="x">&'), "&lt;b a=&quot;x&quot;&gt;&amp;");
  assert.equal(suites[2].maximum,null);
});
test("client hides stale results and does not submit or persist family inputs", () => {
  const client = read("tools/page-generation/orlando-suite-client.mjs");
  assert.match(client,/event.preventDefault\(\)/);
  assert.match(client,/element.hidden = true/);
  assert.doesNotMatch(client,/results.hidden = true/);
  assert.match(client,/results.focus\(\)/);
  assert.match(client,/form.hidden = false/);
  assert.match(client,/utcToday >= recheckOn/);
  assert.doesNotMatch(client,/fetch\(|XMLHttpRequest|sendBeacon|localStorage|sessionStorage|document.cookie/);
});
