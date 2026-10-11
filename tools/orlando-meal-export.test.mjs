import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { suites, sources } from "./page-generation/orlando-suite-data.mjs";
import { orlandoMealComparisonCsv, orlandoMealCsvPath, orlandoCombinedRateComparisonCsv, writeOrlandoSuitePage } from "./page-generation/orlando-suite-page.mjs";
const parse = csv => csv.trimEnd().split("\n").map(line => [...line.matchAll(/"((?:[^"]|"")*)"(?:,|$)/g)].map(m => m[1].replaceAll('""', '"')));

test("Meal export retains every dated budget cell and scoped same-record meal evidence", () => {
  const [head, ...rows] = parse(orlandoMealComparisonCsv());
  const [priceHead, ...priceRows] = parse(orlandoCombinedRateComparisonCsv());
  assert.equal(head.length, 32);
  assert.equal(rows.length, 4);
  assert.deepEqual(head.slice(0, 22), priceHead);
  rows.forEach((row, i) => {
    assert.equal(row.length, 32);
    assert.deepEqual(row.slice(0, 22), priceRows[i]);
    const record = Object.fromEntries(head.map((name, j) => [name, row[j]]));
    const suite = suites[i < 2 ? 1 : 2], policy = suite.mealPolicy ?? suite.kitchenPolicy;
    assert.equal(record["Meal source checked"], policy.checkedOn);
    assert.equal(record["Meal recheck due"], policy.recheckOn);
    assert.equal(record["Meal limits"], policy.limitation);
    if (i < 2) {
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
  assert.doesNotMatch(orlandoMealComparisonCsv(), /Disney's Art|free breakfast|guaranteed savings/);
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
    assert.equal(row[23], `'${prefix}note, "quoted" next tab`);
    assert.equal(row.length, 32);
  }
  orlandoMealComparisonCsv();
  assert.equal(JSON.stringify(suites), before);
  assert.equal(parse(orlandoMealComparisonCsv([suites[0]])).length, 1);
});
