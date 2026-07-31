import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import assert from "node:assert/strict";

import { activityPages } from "./page-generation/upgrade-page-data.mjs";
import { attractionLogisticsCsv } from "./page-generation/upgrade-engine.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const relativePagePath = "things-to-do/san-diego-with-kids.html";
const pagePath = join(root, "site", relativePagePath);
const teenPagePath = join(root, "site", "things-to-do", "san-diego-with-teens.html");
const evidencePath = join(root, "docs", "research", "san-diego-attraction-logistics-evidence.md");
const html = readFileSync(pagePath, "utf8");
const teenHtml = readFileSync(teenPagePath, "utf8");
const evidence = readFileSync(evidencePath, "utf8");
const styles = readFileSync(join(root, "site", "styles.css"), "utf8");
const records = activityPages[relativePagePath].logisticsIndex;
const requiredFields = [
  "name",
  "area",
  "setting",
  "timeEstimate",
  "costEstimate",
  "currentCheck",
  "weatherRole",
  "transportPrompt",
  "evidenceNote",
  "unknowns",
  "checked",
  "officialUrl"
];

function embeddedLogisticsData() {
  const match = html.match(/<script type="application\/json" id="san-diego-attraction-logistics-data">([\s\S]*?)<\/script>/);
  assert.ok(match, "expected embedded logistics data");
  return JSON.parse(match[1]);
}

test("keeps one complete, source-dated record for each of the 12 existing choices", () => {
  assert.equal(records.length, 12);
  assert.equal(new Set(records.map(({ name }) => name)).size, 12);

  for (const record of records) {
    for (const field of requiredFields) {
      assert.ok(record[field], `${record.name} is missing ${field}`);
    }
    assert.equal(record.checked, "2026-07-31");
    assert.match(record.officialUrl, /^https:\/\//);
    assert.match(record.evidenceNote, /Official/);
    assert.match(evidence, new RegExp(record.officialUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});

test("renders the visible index and download from the same embedded records", () => {
  assert.deepEqual(embeddedLogisticsData(), records);

  const section = html.match(/<section class="container page-section rank-ready-section" aria-labelledby="san-diego-logistics-index-title">([\s\S]*?)<\/section>/)?.[0];
  assert.ok(section, "expected logistics index section");
  assert.equal((section.match(/<tr>/g) || []).length, 13);
  assert.equal((section.match(/>Official source<\/a>/g) || []).length, 12);
  assert.match(section, /Official-source facts are high-confidence/);
  assert.match(section, /Setting, time, cost, weather role, and transport prompts are medium-confidence/);
  assert.match(section, /medium-confidence Family Tripwise planning estimates/);
  assert.match(section, /id="download-san-diego-attraction-logistics"/);
  assert.match(section, /new Blob\(\[csv\]/);
  assert.match(section, /URL\.createObjectURL/);
  assert.match(section, /san-diego-family-attraction-logistics-2026-07-31\.csv/);
  assert.match(section, /URL\.revokeObjectURL/);
  assert.doesNotMatch(section, /href="[^"]+\.csv/);

  for (const record of records) {
    for (const value of [record.name, record.area, record.setting, record.timeEstimate, record.costEstimate, record.currentCheck, record.weatherRole, record.transportPrompt, record.unknowns, record.checked, record.officialUrl]) {
      assert.ok(section.includes(value), `${record.name} visible row is missing ${value}`);
    }
  }

  assert.match(section, /comparison-scroll logistics-comparison/);
  assert.match(styles, /\.logistics-comparison \.comparison-table th:first-child\s*\{[^}]*position: sticky;[^}]*left: 0;/s);
  assert.match(styles, /\.logistics-comparison \.comparison-table thead th:first-child\s*\{[^}]*z-index: 2;/s);
});

test("uses the logistics records for ItemList schema and removes the old comparison layer", () => {
  const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
    .map((match) => JSON.parse(match[1]));
  const itemList = schemas.find((schema) => schema["@type"] === "ItemList");

  assert.ok(itemList, "expected ItemList schema");
  assert.equal(itemList.itemListElement.length, 12);
  assert.deepEqual(itemList.itemListElement.map(({ name }) => name), records.map(({ name }) => name));
  assert.deepEqual(
    itemList.itemListElement.map(({ description }) => description),
    records.map((record) => `Estimated setting: ${record.setting}; estimated time: ${record.timeEstimate}; estimated cost: ${record.costEstimate}. Current check: ${record.currentCheck}.`)
  );
  assert.doesNotMatch(html, /<h2>Activity decision table<\/h2>/);
  assert.doesNotMatch(html, /The comparison table covers all 12 choices/);
  assert.match(html, /The logistics index covers all 12 choices/);
});

test("executes the same CSV serializer embedded in the browser and escapes quotes and commas", () => {
  const csv = attractionLogisticsCsv(records);
  const lines = csv.split("\r\n");

  assert.equal(lines.length, 13);
  assert.equal(lines[0], '"name","area","setting","timeEstimate","costEstimate","currentCheck","weatherRole","transportPrompt","evidenceNote","unknowns","checked","officialUrl"');
  assert.ok(html.includes(attractionLogisticsCsv.toString()), "browser script must embed the tested serializer");

  const quoted = attractionLogisticsCsv([{ ...records[0], name: 'A "quoted", choice' }]);
  assert.equal(quoted.split("\r\n").length, 2);
  assert.match(quoted, /"A ""quoted"", choice"/);
  assert.match(quoted, /"Compare paid parking with Route 7 or 215 from your base\."/);
});

test("preserves all-ages and teen technical indexability without requesting indexing", () => {
  const sitemap = readFileSync(join(root, "site", "sitemap.xml"), "utf8");
  const robots = readFileSync(join(root, "site", "robots.txt"), "utf8");

  for (const [pageHtml, canonical] of [
    [html, "https://familytripwise.com/things-to-do/san-diego-with-kids.html"],
    [teenHtml, "https://familytripwise.com/things-to-do/san-diego-with-teens.html"]
  ]) {
    assert.match(pageHtml, new RegExp(`<link rel="canonical" href="${canonical.replaceAll(".", "\\.")}">`));
    assert.doesNotMatch(pageHtml, /<meta[^>]+name=["']robots["'][^>]+noindex/i);
    assert.equal((sitemap.match(new RegExp(canonical.replaceAll(".", "\\."), "g")) || []).length, 1);
  }

  assert.doesNotMatch(robots, /Disallow:\s*\/things-to-do\//i);
  assert.match(evidence, /there is no verified technical indexing defect to repair/i);
  assert.match(evidence, /The teen page remains unchanged/);
  assert.doesNotMatch(evidence, /request indexing in GSC/i);
});
