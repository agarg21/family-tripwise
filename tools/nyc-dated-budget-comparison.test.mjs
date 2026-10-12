import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { datedBudgetRows, datedBudgetComparisonHtml } from "./page-generation/nyc-dated-budget-comparison.mjs";
import { beaconSuite } from "./page-generation/nyc-beacon-suite.mjs";
import { radioCityPrice } from "./page-generation/nyc-radio-city-price.mjs";
import { trypPrice } from "./page-generation/nyc-tryp-price.mjs";

const records = [beaconSuite, radioCityPrice, trypPrice];
test("NYC dated comparison joins only exact reviewed category and common stay basis", () => {
  const rows = datedBudgetRows();
  assert.deepEqual(rows.map(x => x.record), records);
  assert.deepEqual(rows.map(x => x.unit), ["suite/night", "apartment/night", "room/night"]);
  assert.deepEqual(rows.map(x => x.record.displayed_stay_total_cents), [1271815, 425114, 315433]);
  assert.equal(rows[1].record.individual_child_ages_entered, false);
  assert.ok(rows[0].checks.includes("two-child limit conflicts"));
  assert.ok(rows[2].checks.includes("acceptance"));
});

test("NYC dated join rejects category, order, coverage, source or scenario drift", () => {
  for (const bad of [[], records.slice(0,2), [trypPrice, radioCityPrice, beaconSuite], [beaconSuite, radioCityPrice, trypPrice, trypPrice], [{...beaconSuite,currency:"GBP"},radioCityPrice,trypPrice], [beaconSuite,{...radioCityPrice,individual_child_ages_entered:true},trypPrice], [beaconSuite,radioCityPrice,{...trypPrice,arrival:"2026-11-09"}], [beaconSuite,radioCityPrice,{...trypPrice,children:2}], [beaconSuite,radioCityPrice,{...trypPrice,category:"TRYP PREMIUM"}], [beaconSuite,radioCityPrice,{...trypPrice,sources:[trypPrice.sources[0]+"?session=fixture"]}]]) assert.throws(() => datedBudgetRows(bad));
});

test("comparison exposes native nightly units, full display totals and separate-charge limits", () => {
  const before = structuredClone(records);
  const html = datedBudgetComparisonHtml();
  for(const value of ["Checked October 11, 2026", "November 8-13, 2026 (five nights)", "two adults and three children", "$2,208.20", "$2,543.63", "$12,718.15", "$734.40", "$850.23", "$4,251.14", "$523.00", "$630.87", "$3,154.33", "$250.00", "$30.00/night", "$553.72", "do not add them again", "individual ages not entered", "two-child limit conflicts", "selected dates and actual noise unknown", "not current quotes", "Additional-charge completeness", "specific to the named rate", 'tabindex="0"', 'scope="row"', 'scope="col"']) assert.ok(html.includes(value), value);
  assert.equal((html.match(/data-budget-record=/g)||[]).length,3);
  assert.doesNotMatch(html,/download|\.csv|cheapest|savings|confirmed acceptance|guaranteed room/i);
  assert.deepEqual(records,before);
});

test("deposit and optional rollaway are not folded into displayed stay arithmetic", () => {
  const rows=datedBudgetRows();
  assert.equal(rows[0].record.displayed_stay_total_cents,1271815);
  assert.equal(rows[1].record.displayed_stay_total_cents,425114);
  assert.match(rows[0].charges,/not automatically included/);
  assert.match(rows[1].charges,/not in the stay total/);
  assert.match(rows[2].charges,/already includes resort\/city fees/);
});

test("generated NYC comparison precedes the historical table with all three existing detail anchors", () => {
  const html=readFileSync(new URL("../site/where-to-stay/new-york-city-family-hotels.html",import.meta.url),"utf8"),block=datedBudgetComparisonHtml();
  assert.ok(html.includes(block));
  assert.ok(html.indexOf(block)<html.indexOf('<section id="hotel-comparison"'));
  assert.equal((html.match(/id="dated-family-budgets"/g)||[]).length,1);
  for(const row of datedBudgetRows()){
    assert.ok(block.includes(`href="#${row.anchor}"`));
    assert.ok(html.includes(`id="${row.anchor}"`));
  }
});

test("current task record explicitly separates Oct12 proxy from Oct11 source evidence", () => {
  const task=JSON.parse(readFileSync(new URL("../docs/research/nyc-dated-budget-comparison-task-2026-10-12.json",import.meta.url)));
  assert.equal(task.task_checked_on,"2026-10-12");
  assert.equal(task.evidence_class,"PAGE_ONLY_PROXY_TASK_WITH_REUSED_BOOKING_CHECK");
  assert.deepEqual(task.maintained_records.map(x=>x.id),records.map(x=>x.id));
  assert.ok(task.maintained_records.every(x=>x.source_checked_on==="2026-10-11"));
  assert.match(task.confidence,/Actual parent preference.*unknown/);
});

test("new table styling keeps sticky row links readable without a global selector change", () => {
  const css=readFileSync(new URL("../site/styles.css",import.meta.url),"utf8");
  assert.match(css,/#dated-family-budgets tbody th \{\s*background: var\(--surface\);\s*color: var\(--ink\);/);
  assert.match(css,/#dated-family-budgets th:first-child \{\s*width: 156px;\s*min-width: 156px;\s*max-width: 156px;/);
  assert.match(css,/#dated-family-budgets h2 \{\s*font-size: 1\.75rem;/);
});
