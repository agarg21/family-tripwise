import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { comparisonHeadings, roomComparisonCsv, roomComparisonsCsv } from "./family-room-comparison.mjs";

const read = name => readFileSync(new URL(`../docs/research/${name}`, import.meta.url), "utf8");
const pack = JSON.parse(read("washington-dc-room-configurations-2026-09-30.json"));
const prices = ["embassy", "homewood", "residence"].flatMap(name => JSON.parse(read(`washington-dc-${name}-price-observation-2026-09-30.json`)));
// Same narrow quoted-cell format as the comparison writer's existing tests.
const rows = csv => csv.trimEnd().split("\n").map(line => [...line.matchAll(/"((?:[^"]|"")*)"(?:,|$)/g)].map(match => match[1].replaceAll('""', '"')));
const value = (row, heading) => row[comparisonHeadings.indexOf(heading)];
const checkIndex = comparisonHeadings.indexOf("Next checks");
const assertQuestions = row => {
  assert.match(value(row, "Next checks"), /Confirm dining chair, utensil and place-setting quantities/);
  assert.match(value(row, "Next checks"), /does not establish five-person dining/);
  assert.match(value(row, "Next checks"), /Confirm sofa dimensions, deployment clearance/);
};

test("DC maintained checks change only Homewood questions, not historical output basis", () => {
  const before = rows(read("washington-dc-comparison-task-2026-10-03.csv"));
  const after = rows(roomComparisonCsv(pack, pack.scenario, "2026-10-03", prices));
  assert.deepEqual(after[0], before[0]); assert.equal(after.length, 8);
  for (let i = 1; i < after.length; i++) {
    const current = after[i], prior = before[i];
    if (!value(current, "Hotel").startsWith("Homewood")) assert.deepEqual(current, prior);
    else {
      assertQuestions(current);
      assert.deepEqual(current.filter((_, index) => index !== checkIndex), prior.filter((_, index) => index !== checkIndex));
    }
  }
  assert.equal(pack.checked_on, "2026-09-30");
  assert.equal(pack.sources.homewood.checked_on, "2026-09-30");
  assert.equal(pack.records.find(record => record.id === "dc-homewood-two-queen").price.amount, null);
});

test("single, joined and kitchen-filter exports retain identical unresolved setup questions", () => {
  const single = roomComparisonCsv(pack, pack.scenario, "2026-10-03", prices);
  assert.equal(roomComparisonsCsv([pack], pack.scenario, "2026-10-03", prices), single);
  const filtered = rows(roomComparisonCsv(pack, pack.scenario, "2026-10-03", prices, { kitchen: "published" })).slice(1);
  assert.equal(filtered.length, 4);
  const homewood = filtered.filter(row => value(row, "Hotel").startsWith("Homewood"));
  assert.equal(homewood.length, 3); homewood.forEach(assertQuestions);
  assert.deepEqual(homewood.map(row => value(row, "Nightly equivalent")), ["288.97", "316.61", "339.97"]);
  assert.match(value(filtered.find(row => value(row, "Hotel").startsWith("Residence")), "Next checks"), /table seats4/);
});

test("setup questions do not renew stale sources or transfer dated prices to another party", () => {
  const stale = rows(roomComparisonCsv(pack, pack.scenario, "2026-10-31", prices)).slice(1).filter(row => value(row, "Hotel").startsWith("Homewood"));
  for (const row of stale) {
    assertQuestions(row); assert.equal(value(row, "Category checked"), "2026-09-30");
    assert.equal(value(row, "Price observed"), "2026-09-30");
    assert.equal(value(row, "Capacity screen"), "RECHECK_SOURCE");
    assert.equal(value(row, "Price status"), "historical-dated-stay-samples");
  }
  const otherParty = { ...pack.scenario, child_ages: [4, 8, 13] };
  const row = rows(roomComparisonCsv(pack, otherParty, "2026-10-03", prices)).slice(1).find(row => value(row, "Hotel").startsWith("Homewood"));
  assertQuestions(row); assert.equal(value(row, "Nightly equivalent"), ""); assert.equal(value(row, "Public rate plan"), "Unpriced");
});
