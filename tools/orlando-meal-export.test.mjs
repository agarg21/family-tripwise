import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { suites, sources } from "./page-generation/orlando-suite-data.mjs";
import { orlandoMealComparisonCsv, orlandoMealCsvPath, writeOrlandoSuitePage } from "./page-generation/orlando-suite-page.mjs";
const parse = csv => csv.trimEnd().split("\n").map(line => [...line.matchAll(/"((?:[^"]|"")*)"(?:,|$)/g)].map(m => m[1].replaceAll('""', '"')));

// Q17b: the withdrawn October 11 rate columns left this export; it keeps the scoped kitchen and breakfast evidence only.
test("Meal export keeps scoped same-record meal evidence without any withdrawn rate cells", () => {
  const [head, ...rows] = parse(orlandoMealComparisonCsv());
  assert.equal(head.length, 12);
  assert.equal(rows.length, 2);
  rows.forEach((row, i) => {
    assert.equal(row.length, 12);
    const record = Object.fromEntries(head.map((name, j) => [name, row[j]]));
    const suite = suites[i + 1], policy = suite.mealPolicy ?? suite.kitchenPolicy;
    assert.equal(record.Property, suite.name);
    assert.equal(record["Exact room"], suite.room);
    assert.equal(record["Meal source checked"], policy.checkedOn);
    assert.equal(record["Meal limits"], policy.limitation);
    if (i === 0) {
      assert.equal(record["Published equipment"], policy.equipment.join("; "));
      assert.equal(record["Kitchen planning scope"], policy.planningNote);
      assert.equal(record["Equipment or room-scope source"], sources[policy.source]);
      assert.match(record["Breakfast venue"], /^Unknown/);
      assert.equal(record["Breakfast source"], "Not established in this equipment record");
    } else {
      assert.equal(record["Published equipment"], "Unknown for this exact room");
      assert.equal(record["Kitchen planning scope"], policy.kitchenNote);
      assert.equal(record["Breakfast venue"], policy.breakfast.venue);
      assert.equal(record["Breakfast location"], policy.breakfast.location);
      assert.equal(record["Published breakfast hours"], `${policy.breakfast.opens}-${policy.breakfast.closes}`);
      assert.equal(record["Equipment or room-scope source"], sources[policy.roomSource]);
      assert.equal(record["Breakfast source"], sources[policy.diningSource]);
    }
  });
  assert.doesNotMatch(orlandoMealComparisonCsv(), /Disney's Art|free breakfast|guaranteed savings|November 8-13|1013\.63|759\.40|815\.65|1446\.75/);
});

test("Native meal export is deterministic and leaves both old rate downloads intact", () => {
  const out = new Map();
  writeOrlandoSuitePage((path, value) => out.set(path, value));
  assert.equal(out.get(orlandoMealCsvPath), orlandoMealComparisonCsv());
  assert.equal(readFileSync(new URL(`../site/${orlandoMealCsvPath}`, import.meta.url), "utf8"), orlandoMealComparisonCsv());
  assert.equal(out.get("downloads/orlando-dated-rates.csv"), readFileSync(new URL("../site/downloads/orlando-dated-rates.csv", import.meta.url), "utf8"));
  assert.equal(out.get("downloads/orlando-ihg-dated-rates.csv"), readFileSync(new URL("../site/downloads/orlando-ihg-dated-rates.csv", import.meta.url), "utf8"));
  assert.equal((out.get("where-to-stay/orlando-family-hotels.html").match(/data-meal-download/g) ?? []).length, 1);
  assert.match(out.get("where-to-stay/orlando-family-hotels.html"), /href="\.\.\/downloads\/orlando-meal-planning.csv" download/);
});

test("CSV protects new meal cells and never mutates shared records", () => {
  const before = JSON.stringify(suites);
  for (const prefix of ["=", "+", "-", "@", "  ="]) {
    const copy = structuredClone(suites[2]);
    copy.mealPolicy.kitchenNote = `${prefix}note, "quoted"\nnext\ttab`;
    const [, row] = parse(orlandoMealComparisonCsv([copy]));
    assert.equal(row[3], `'${prefix}note, "quoted" next tab`);
    assert.equal(row.length, 12);
  }
  orlandoMealComparisonCsv();
  assert.equal(JSON.stringify(suites), before);
  assert.equal(parse(orlandoMealComparisonCsv([suites[0]])).length, 1);
});
