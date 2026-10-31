import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { comparisonHeadings, labelOlderStaySamples, readableComparisonCsv, roomComparisonCsv } from "./family-room-comparison.mjs";
import { bostonPack, bostonPrices, bostonCsv, bostonDiningCsv, bostonDiningScreenedOn, bostonDiningSection, bostonFamilyHotelPage, writeBostonFamilyHotelsPage } from "./page-generation/boston-family-hotels-page.mjs";

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const rows = csv => csv.trimEnd().split("\n").map(line => [...line.matchAll(/"((?:[^"]|"")*)"(?:,|$)/g)].map(match => match[1].replaceAll('""', '"')));
const v = (row, name) => row[comparisonHeadings.indexOf(name)];

test("Boston dining preset shares current validated records and retains only unresolved unpriced Plaza", () => {
  assert.equal(bostonDiningScreenedOn, "2026-10-10");
  assert.equal(bostonDiningCsv, readableComparisonCsv(labelOlderStaySamples(roomComparisonCsv(bostonPack, bostonPack.scenario, bostonDiningScreenedOn, bostonPrices, { kitchen: "published", capacity: "not-excluded", minimum_dining_seats: 5 }))));
  const data = rows(bostonDiningCsv); assert.deepEqual(data[0], comparisonHeadings); assert.equal(data.length, 2);
  assert.equal(v(data[1], "Hotel"), "Four Seasons Hotel Boston"); assert.equal(v(data[1], "Published category"), "Plaza Suite");
  assert.equal(v(data[1], "Category checked"), "2026-10-09"); assert.equal(v(data[1], "Screened on"), "2026-10-10");
  assert.equal(v(data[1], "Public rate plan"), "Unpriced"); assert.equal(v(data[1], "Nightly equivalent"), "");
  assert.equal(v(data[1], "Actual party"), JSON.stringify({ adults: 2, child_ages: [4, 8, 12] }));
  assert.equal(v(data[1], "Arrival"), "2026-11-08"); assert.equal(v(data[1], "Departure"), "2026-11-13");
  assert.match(v(data[1], "Research scope and limits"), /NOT_ESTABLISHED.*requested minimum 5/);
  assert.match(v(data[1], "Research scope and limits"), /unknown and stale counts retained/);
  assert.match(v(data[1], "Observation limits"), /monthly|call-to-book/);
  assert.equal(read("site/downloads/boston-cooking-dining-five.csv"), bostonDiningCsv);
});

test("additive public section distinguishes recorded tables, unknowns and original evidence dates", () => {
  const section = bostonDiningSection(), page = bostonFamilyHotelPage();
  for (const text of ["four table seats", "a fifth place remains unknown", "no established dining-seat count", "Neither record confirms a five-place table", "recorded 2026-10-03", "checked 2026-10-09", "not a new hotel inspection", "not a verified meal-fit shortlist", "not from the complete room comparison", "Original room and fee dates are unchanged", "high-chair availability"]) assert.ok(section.includes(text), text);
  assert.match(section, /id="dining-five"/); assert.match(section, /scroll-margin-top:128px/);
  assert.match(section, /tabindex="0" role="region" aria-label="Cooking and dining places"/);
  assert.match(section, /href="\.\.\/downloads\/boston-cooking-dining-five.csv" download/);
  assert.equal((page.match(/FT-IMP-095 dining start/g) ?? []).length, 1);
  assert.doesNotMatch(section, /USD \d|guaranteed|best hotel|confirmed fit/i);
  const schema = JSON.parse(page.match(/<script type="application\/ld\+json">(.*?)<\/script>/)[1]);
  assert.equal(schema.dateModified, "2026-10-31"); // Q17b price withdrawal
  assert.equal(read("site/where-to-stay/boston-family-hotels.html"), page);
});

test("Boston-only writer retains dining and complete comparisons with additive shared modules and unchanged indexable inventory", () => {
  const output = new Map(); writeBostonFamilyHotelsPage((path, bytes) => output.set(path, bytes));
  assert.deepEqual([...output.keys()], ["where-to-stay/boston-family-hotels.html", "downloads/boston-family-hotels.csv", "downloads/boston-cooking-dining-five.csv", "shared/breakfast-upgrade-budget.mjs", "shared/breakfast-upgrade-form.mjs"]);
  for (const name of ["breakfast-upgrade-budget.mjs", "breakfast-upgrade-form.mjs"])
    assert.equal(output.get(`shared/${name}`), read(`src/shared/${name}`));
  assert.equal(output.get("downloads/boston-family-hotels.csv"), bostonCsv);
  assert.equal(read("site/downloads/boston-family-hotels.csv"), bostonCsv);
  assert.equal(rows(bostonCsv).length, 5); // Q17b: header + one row per room (dated plan rows withdrawn)
  assert.equal((read("site/sitemap.xml").match(/<loc>/g) ?? []).length, 56);
  assert.doesNotMatch(read("site/sitemap.xml"), /boston-cooking-dining-five/);
});
