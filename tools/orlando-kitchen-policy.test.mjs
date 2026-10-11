import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { suites, sources, checkedOn, pageUpdatedOn, recheckOn } from "./page-generation/orlando-suite-data.mjs";
import { kitchenPolicy, orlandoSuitePage } from "./page-generation/orlando-suite-page.mjs";
const evidence = JSON.parse(readFileSync(new URL("../docs/research/orlando-cabana-kitchen-policy-2026-10-11.json", import.meta.url)));
const suite = suites.find(s => s.id === "cabana-bay");

test("Cabana equipment is exact-category official evidence with a scoped clock", () => {
  assert.deepEqual(suite.kitchenPolicy.equipment, evidence.equipment);
  assert.equal(sources[suite.kitchenPolicy.source], evidence.source);
  assert.equal(suite.kitchenPolicy.checkedOn, evidence.inspected_on);
  assert.equal(suite.kitchenPolicy.recheckOn, evidence.recheck_on);
  assert.equal(suites.filter(s => s.kitchenPolicy).length, 1);
  assert.deepEqual([checkedOn, pageUpdatedOn, recheckOn], ["2026-09-24", "2026-09-27", "2026-10-24"]);
});

test("Reheating interpretation never establishes full cooking or meal savings", () => {
  assert.match(suite.kitchenPolicy.planningNote, /Research-based.*reheating.*not an assumption of a full cooking kitchen/);
  assert.match(suite.kitchenPolicy.limitation, /Stovetop or oven availability, cookware, freezer capacity and dining space/);
  assert.match(suite.kitchenPolicy.limitation, /not established/);
  assert.match(suite.kitchenPolicy.limitation, /no meal-cost savings are calculated or guaranteed/);
  assert.match(suite.kitchenPolicy.limitation, /does not renew room prices, occupancy acceptance/);
});

test("Static and enhanced records preserve scoped source, escaping and absence", () => {
  const html = orlandoSuitePage();
  assert.equal(html, readFileSync(new URL("../site/where-to-stay/orlando-family-hotels.html", import.meta.url), "utf8"));
  assert.equal(readFileSync(new URL("./page-generation/orlando-suite-data.mjs", import.meta.url), "utf8"), readFileSync(new URL("../site/orlando/orlando-suite-data.mjs", import.meta.url), "utf8"));
  assert.equal((html.match(/data-kitchen-policy=/g) ?? []).length, 1);
  assert.ok(html.includes(kitchenPolicy(suite)));
  assert.equal(kitchenPolicy(suites[0]), "");
  assert.equal(kitchenPolicy(suites[2]), "");
  const hostile = kitchenPolicy({...suite, id: '"<script>', kitchenPolicy: {...suite.kitchenPolicy, equipment: ['<img onerror="x">'], planningNote: "<script>", limitation: "<&"}});
  assert.ok(!hostile.includes("<script>"));
  assert.ok(hostile.includes("&lt;img onerror=&quot;x&quot;&gt;"));
});
