import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { cancunPath, cancunResortPage } from "./page-generation/cancun-resort-page.mjs";
import { cancunEvidence } from "../src/prototypes/cancun-resort-comparison/data.mjs";
import { compareCancunFamily } from "../src/prototypes/cancun-resort-comparison/compare.mjs";
import { childFields, renderOverview, renderResults } from "../src/prototypes/cancun-resort-comparison/render.mjs";

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const html = cancunResortPage();
const result = overrides => renderResults(compareCancunFamily({childAges: [3, 7, 12], asOf: cancunEvidence.checkedOn, ...overrides}));

test("Cancun generated page and public modules match their maintained sources", () => {
  assert.equal(read(`site/${cancunPath}`), html);
  for (const name of ["data", "compare", "render", "client"]) {
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
  assert.equal(schema.dateModified, cancunEvidence.checkedOn);
  assert.doesNotMatch(html, /noindex|AggregateRating|"@type":"Offer"/);
  assert.equal(read("site/sitemap.xml").split(`<loc>${url}</loc>`).length - 1, 1);
  assert.ok(read("site/index.html").includes(cancunPath));
  assert.ok(read("ops/gsc-monitor.json").includes(url));
});

test("no-JavaScript surface retains three records, conflicts, costs and source links", () => {
  const overview = renderOverview();
  assert.equal((overview.match(/class="resort-row"/g) ?? []).length, 3);
  assert.equal((html.match(/class="result-card"/g) ?? []).length, 3);
  assert.match(html, /<form id="family-form" hidden>/);
  assert.match(html, /<noscript>/);
  for (const source of Object.values(cancunEvidence.sources)) assert.ok(overview.includes(source));
  assert.match(overview, /Capacity disputed: 4 versus 5/);
  assert.match(overview, /minimum 3 nights/);
  assert.match(overview, /Round-trip CUN/);
  assert.match(overview, /MXN 79/);
  assert.equal((overview.match(/Stay total: unknown/g) ?? []).length, 3);
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
