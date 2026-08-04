import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

import { activityPages } from "./page-generation/upgrade-page-data.mjs";
import { attractionCostFrictionCsv } from "./page-generation/upgrade-engine.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const relativePagePath = "things-to-do/las-vegas-with-kids.html";
const html = readFileSync(join(root, "site", relativePagePath), "utf8");
const evidence = readFileSync(join(root, "docs", "research", "las-vegas-attraction-cost-friction-evidence.md"), "utf8");
const page = activityPages[relativePagePath];
const records = page.costFrictionIndex;
const requiredFields = [
  "name",
  "zone",
  "setting",
  "timeEstimate",
  "familyAdmissionEstimate",
  "costBasis",
  "inclusions",
  "exclusions",
  "currentCheck",
  "evidenceClass",
  "confidence",
  "unknowns",
  "checked",
  "officialUrl"
];

function embeddedRecords() {
  const match = html.match(/<script type="application\/json" id="las-vegas-attraction-cost-friction-data">([\s\S]*?)<\/script>/);
  assert.ok(match, "expected one embedded cost-and-friction record source");
  return JSON.parse(match[1]);
}

function schemas() {
  return [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
    .map((match) => JSON.parse(match[1]));
}

test("keeps one complete, source-dated record for each existing Las Vegas choice", () => {
  assert.equal(records.length, 12);
  assert.equal(new Set(records.map(({ name }) => name)).size, 12);

  for (const record of records) {
    for (const field of requiredFields) assert.ok(record[field], `${record.name} is missing ${field}`);
    assert.equal(record.checked, "2026-08-03");
    assert.match(record.officialUrl, /^https:\/\//);
    assert.match(record.evidenceClass, /Official/i);
    assert.match(evidence, new RegExp(record.officialUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});

test("uses the same records for visible rows, ItemList, and client-side CSV", () => {
  assert.deepEqual(embeddedRecords(), records);

  const section = html.match(/<section class="container page-section rank-ready-section" aria-labelledby="las-vegas-attraction-cost-friction-title">([\s\S]*?)<\/section>/)?.[0];
  assert.ok(section, "expected visible cost-and-friction section");
  assert.equal((section.match(/<tr>/g) || []).length, 13);
  assert.equal((section.match(/>Official source<\/a>/g) || []).length, 12);
  assert.match(section, /id="download-las-vegas-attraction-cost-friction"/);
  assert.match(section, /new Blob\(\[csv\]/);
  assert.match(section, /las-vegas-family-attraction-cost-friction-2026-08-03\.csv/);
  assert.doesNotMatch(section, /href="[^"]+\.csv/);

  const itemList = schemas().find((schema) => schema["@type"] === "ItemList");
  assert.equal(itemList.itemListElement.length, 12);
  assert.deepEqual(itemList.itemListElement.map(({ name }) => name), records.map(({ name }) => name));
  for (const record of records) {
    for (const value of [record.name, record.zone, record.setting, record.timeEstimate, record.familyAdmissionEstimate, record.costBasis, record.inclusions, record.exclusions, record.currentCheck, record.evidenceClass, record.confidence, record.unknowns, record.checked, record.officialUrl]) {
      assert.ok(section.includes(value), `${record.name} visible row is missing ${value}`);
    }
  }
});

test("keeps the reference-scenario arithmetic and unresolved prices explicit", () => {
  const byName = Object.fromEntries(records.map((record) => [record.name, record]));
  assert.equal(byName["DISCOVERY Children's Museum"].familyAdmissionEstimate, "$80");
  assert.equal(byName["Shark Reef Aquarium"].familyAdmissionEstimate, "$106-$134");
  assert.equal(byName["Springs Preserve"].familyAdmissionEstimate, "$59.80");
  assert.equal(byName["AREA15 / selected exhibit"].familyAdmissionEstimate, "From $170");
  assert.equal(byName["Red Rock Canyon Scenic Drive"].familyAdmissionEstimate, "$20-$22 per vehicle");
  assert.equal(byName["Tournament of Kings"].familyAdmissionEstimate, "From $297.60 plus tax");
  assert.equal(byName["Neon Museum"].familyAdmissionEstimate, "VARIABLE / VERIFY");
  assert.match(byName["Neon Museum"].currentCheck, /age-6 ticket/i);
  assert.match(byName["Neon Museum"].currentCheck, /unavailable June-August/i);
  assert.match(byName["Neon Museum"].exclusions, /processing fee/i);
  assert.equal(byName["Neon Museum"].officialUrl, "https://neonmuseum.org/whats-on/365-daytime-admission/");

  for (const name of ["Resort pool / reset block", "Adventuredome", "High Roller observation wheel", "Neon Museum"]) {
    assert.equal(byName[name].familyAdmissionEstimate, "VARIABLE / VERIFY");
    assert.match(byName[name].unknowns, /./);
  }
  assert.match(page.comparisonNote, /admission only/i);
  assert.match(page.comparisonNote, /excludes transport, parking, meals/i);
});

test("serializes all durable fields and safely escapes CSV values", () => {
  const csv = attractionCostFrictionCsv(records);
  const lines = csv.split("\r\n");
  assert.equal(lines.length, 13);
  assert.equal(lines[0], '"name","zone","setting","timeEstimate","familyAdmissionEstimate","costBasis","inclusions","exclusions","currentCheck","evidenceClass","confidence","unknowns","checked","officialUrl"');
  assert.ok(html.includes(attractionCostFrictionCsv.toString()), "browser script must embed the tested serializer");

  const quoted = attractionCostFrictionCsv([{ ...records[0], name: 'A "quoted", choice' }]);
  assert.match(quoted, /"A ""quoted"", choice"/);
});

test("removes repeated decision layers and preserves the existing technical contract", () => {
  const sitemap = readFileSync(join(root, "site", "sitemap.xml"), "utf8");
  const canonical = "https://familytripwise.com/things-to-do/las-vegas-with-kids.html";
  const upgrade = html.slice(html.indexOf("<!-- priority-upgrade:start -->"), html.indexOf("<!-- priority-upgrade:end -->"));

  assert.equal((upgrade.match(/<article class="quick-pick">/g) || []).length, 3);
  assert.equal((upgrade.match(/<article class="detail-card">/g) || []).length, 0);
  assert.equal((upgrade.match(/<article class="plan-card">/g) || []).length, 0);
  assert.doesNotMatch(upgrade, /Activity decision table|Six choices that need an extra check|Three checks that change the shortlist/);
  assert.match(upgrade, /href="\.\.\/where-to-stay\/las-vegas-family-hotels\.html"/);
  assert.match(html, new RegExp(`<link rel="canonical" href="${canonical.replaceAll(".", "\\.")}">`));
  assert.doesNotMatch(html, /<meta[^>]+name=["']robots["'][^>]+noindex/i);
  assert.equal((sitemap.match(new RegExp(canonical.replaceAll(".", "\\."), "g")) || []).length, 1);
});
