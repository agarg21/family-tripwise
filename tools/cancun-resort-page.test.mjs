import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { cancunPath, cancunResortPage } from "./page-generation/cancun-resort-page.mjs";
import { cancunEvidence } from "../src/prototypes/cancun-resort-comparison/data.mjs";
import { compareCancunFamily } from "../src/prototypes/cancun-resort-comparison/compare.mjs";
import { bookingChecklistText, childFields, esc, renderOverview, renderQuickComparison, renderResults } from "../src/prototypes/cancun-resort-comparison/render.mjs";

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const html = cancunResortPage();
const result = overrides => renderResults(compareCancunFamily({childAges: [3, 7, 12], asOf: cancunEvidence.checkedOn, ...overrides}));

test("quick comparison and portable checklist preserve exact records, conflicts and source dates", () => {
  const quick = renderQuickComparison();
  const checklist = bookingChecklistText();
  assert.equal(read("site/downloads/cancun-booking-checklist.txt"), checklist);
  assert.equal((quick.match(/scope="row"/g) ?? []).length, 6);
  assert.match(quick, /<th scope="col">Resort and exact room<\/th><th scope="col">Approx nightly price and booking checks<\/th><th scope="col">Published capacity and sleeping places<\/th>/);
  assert.equal((quick.match(/data-label="Approx nightly price and booking checks"/g) ?? []).length, 6);
  assert.equal((quick.match(/data-label="Published capacity and sleeping places"/g) ?? []).length, 6);
  for (const record of cancunEvidence.records) {
    assert.ok(checklist.includes(record.hotel));
    assert.ok(checklist.includes(record.room.category));
    assert.ok(checklist.includes(record.room.beds));
    for (const field of ["room", "clubs", "transfers", "extras"]) {
      for (const check of record[field].checks) assert.ok(checklist.includes(check));
      for (const id of record[field].sourceIds) assert.ok(checklist.includes(cancunEvidence.sources[id]));
    }
    if (record.price) {
      assert.ok(quick.includes(esc(record.price.basis)));
      assert.ok(checklist.includes(record.price.basis));
      assert.ok(quick.includes(esc(record.price.fees)));
      assert.ok(checklist.includes(record.price.fees));
      for (const id of record.price.sourceIds) assert.ok(checklist.includes(cancunEvidence.sources[id]));
    }
  }
  assert.equal(cancunEvidence.records.filter(record => record.price).length, 3);
  assert.match(quick, /From USD 843\/night \(official start\)/);
  assert.match(quick, /About USD 1,015\/night for two adults/);
  assert.match(quick, /About USD 1,036\/night \(Fall into Savings\) or USD 1,295\/night \(Standard Rate\)/);
  assert.match(quick, /USD 507\.50 per-person\/night/);
  assert.match(quick, /USD 3,107\.18 total/);
  assert.match(checklist, /USD 3,107\.18 total/);
  assert.match(quick, /two adults and children aged 3 and 7/);
  assert.match(quick, /sanitation fee is payable at the resort and excluded/);
  assert.equal((quick.match(/Exact-room nightly price: not verified/g) ?? []).length, 3);
  for (const output of [quick, checklist]) {
    assert.ok(output.includes(cancunEvidence.checkedOn));
    assert.ok(output.includes(cancunEvidence.recheckOn));
    assert.match(output, /Child limit disputed: 6 versus 2/);
    assert.match(output, /Capacity disputed: 4 versus 5/);
    assert.match(output, /seventh guest, who must be a child/);
  }
  assert.match(html, /id="quick-comparison"/);
  assert.match(html, /cancun-booking-checklist.txt" download/);
  assert.match(read("site/cancun-resorts.css"), /@media print/);
  assert.match(read("site/cancun-resorts.css"), /@media screen and \(max-width: 540px\)/);
});

test("Cancun generated page and public modules match their maintained sources", () => {
  assert.equal(read(`site/${cancunPath}`), html);
  for (const name of ["data", "compare", "render", "client", "share"]) {
    assert.equal(read(`site/cancun/${name}.mjs`), read(`src/prototypes/cancun-resort-comparison/${name}.mjs`));
  }
});

test("one indexable Cancun job has canonical, discovery and factual schema", () => {
  const url = `https://familytripwise.com/${cancunPath}`;
  assert.equal((html.match(/<h1>/g) ?? []).length, 1);
  assert.ok(html.includes(`<link rel="canonical" href="${url}">`));
  const schema = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
  assert.equal(schema["@type"], "WebPage");
  assert.equal(schema.url, url);
  assert.equal(schema.dateModified, cancunEvidence.lastUpdatedOn);
  assert.doesNotMatch(html, /noindex|AggregateRating|"@type":"Offer"/);
  assert.equal(read("site/sitemap.xml").split(`<loc>${url}</loc>`).length - 1, 1);
  assert.ok(read("site/index.html").includes(cancunPath));
  assert.ok(read("ops/gsc-monitor.json").includes(url));
});

test("no-JavaScript surface retains six records, conflicts, costs and source links", () => {
  const overview = renderOverview();
  assert.equal((overview.match(/class="resort-row"/g) ?? []).length, 6);
  assert.equal((html.match(/class="result-card"/g) ?? []).length, 6);
  assert.match(html, /<form id="family-form" hidden>/);
  assert.match(html, /<noscript>/);
  for (const source of Object.values(cancunEvidence.sources)) assert.ok(overview.includes(source.replaceAll("&", "&amp;")));
  assert.match(overview, /Capacity disputed: 4 versus 5/);
  assert.match(overview, /minimum 3 nights/);
  assert.match(overview, /Round-trip CUN/);
  assert.match(overview, /MXN 79/);
  assert.equal((overview.match(/Stay total: unknown/g) ?? []).length, 6);
  assert.match(overview, /Child limit disputed: 6 versus 2/);
  assert.match(html, /href="#grand-family-suite"/);
  assert.match(overview, /Exact club-age rules: unknown/);
  assert.match(overview, /MXN 85.40/);
  assert.match(overview, /Interval International/);
  assert.match(html, /href="#royalton-splash-two-bedroom"/);
  assert.match(html, /href="#ziva-ocean-view-double"/);
  assert.match(result({channel: "direct-suite", nights: 7, newReservation: true}), /Transfer inclusion is unknown/);
  assert.match(html, /We have not stayed at these resorts/);
});

test("rendered outputs retain per-child failures, unknowns and independent transfer conditions", () => {
  const output = result({pottyTrained: [false, true, null], channel: "direct-suite", nights: 3, newReservation: true});
  assert.match(output, /Full toilet-training requirement is not met/);
  assert.match(output, /Confirm full toilet training/);
  assert.match(output, /Room capacity disputed/);
  assert.match(output, /Sleeping layout unresolved/);
  assert.match(output, /Meets the published CUN transfer-offer conditions, not a confirmed transfer/);
  assert.match(result({channel: "third-party"}), /Outside the published direct-booking/);
  assert.match(result({childAges: [2, 3, 12, 13, 17]}), /Parent must stay/);
  assert.match(result({childAges: [2, 3, 12, 13, 17]}), /Your party exceeds/);
  assert.match(result({asOf: cancunEvidence.recheckOn}), /Source refresh due/);
});

test("age inputs are bounded, uniquely labelled and escaped", () => {
  const fields = childFields(2, [{age: '\"><script>alert(1)</script>', training: "yes"}]);
  assert.doesNotMatch(fields, /<script>/);
  assert.match(fields, /&lt;script&gt;/);
  assert.equal((fields.match(/min="0" max="17" step="1" required/g) ?? []).length, 2);
  assert.match(fields, /Child 2 fully toilet-trained/);
  assert.match(fields, /value="yes" selected/);
});

test("client uses local progressive enhancement without data submission or persistence", () => {
  const client = read("src/prototypes/cancun-resort-comparison/client.mjs");
  assert.match(client, /event.preventDefault\(\)/);
  assert.match(client, /output.hidden = true/);
  assert.match(client, /output.focus\(\)/);
  assert.match(client, /form.hidden = false/);
  assert.doesNotMatch(client, /fetch\(|XMLHttpRequest|sendBeacon|localStorage|sessionStorage|document.cookie/);
});
