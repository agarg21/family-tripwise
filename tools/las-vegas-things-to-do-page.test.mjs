import assert from "node:assert/strict";
import { cpSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { upgradePriorityPages } from "./upgrade-priority-pages.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const target = "things-to-do/las-vegas-with-kids.html";
const activityNames = [
  "Resort pool / reset block",
  "Bellagio Conservatory and fountains",
  "DISCOVERY Children's Museum",
  "Shark Reef Aquarium",
  "Adventuredome",
  "Springs Preserve",
  "High Roller observation wheel",
  "AREA15 / selected exhibit",
  "Red Rock Canyon Scenic Drive",
  "Pinball Hall of Fame",
  "Tournament of Kings",
  "Neon Museum",
];

function filesUnder(directory, base = directory) {
  return readdirSync(directory).flatMap((name) => {
    const path = join(directory, name);
    return statSync(path).isDirectory() ? filesUnder(path, base) : [relative(base, path)];
  });
}

function schemas(html) {
  return [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
    .map((match) => JSON.parse(match[1]));
}

test("publishes one canonical 12-choice Las Vegas activity decision page", () => {
  const html = readFileSync(join(root, "site", target), "utf8");
  const sitemap = readFileSync(join(root, "site", "sitemap.xml"), "utf8");

  assert.match(html, /<title>Things to Do in Las Vegas With Kids: 12 Picks by Trip Style<\/title>/);
  assert.match(html, /<h1>Things to Do in Las Vegas With Kids: 12 Picks by Trip Style<\/h1>/);
  assert.match(html, /Last updated:<\/strong> July 22, 2026/);
  assert.match(html, /<link rel="canonical" href="https:\/\/familytripwise\.com\/things-to-do\/las-vegas-with-kids\.html">/);
  assert.doesNotMatch(html, /<meta[^>]+name="robots"[^>]+noindex/i);
  assert.equal((sitemap.match(/https:\/\/familytripwise\.com\/things-to-do\/las-vegas-with-kids\.html/g) || []).length, 1);

  const baseSection = html.slice(html.indexOf('<section class="container page-section">'), html.indexOf("<!-- priority-upgrade:start -->"));
  assert.equal((baseSection.match(/<article class="activity-card" data-tags=/g) || []).length, 12);
  assert.equal((baseSection.match(/<div><dt>/g) || []).length, 48);
  for (const filter of ["all", "toddler", "elementary", "teen", "indoor", "budget"]) {
    assert.match(baseSection, new RegExp(`data-filter="${filter}"`));
  }
  assert.match(baseSection, /data-tags="elementary tween teen budget"[\s\S]*?<h3>Red Rock Canyon Scenic Drive<\/h3>/);
  for (const name of activityNames) assert.ok(html.includes(name), `missing ${name}`);
});

test("keeps the long page compact and uncertainty-aware", () => {
  const html = readFileSync(join(root, "site", target), "utf8");
  const upgrade = html.slice(html.indexOf("<!-- priority-upgrade:start -->"), html.indexOf("<!-- priority-upgrade:end -->"));

  assert.match(upgrade, /Five useful ways to start/);
  assert.equal((upgrade.match(/<article class="quick-pick">/g) || []).length, 5);
  assert.equal((upgrade.match(/<tbody>[\s\S]*?<\/tbody>/)?.[0].match(/<tr>/g) || []).length, 12);
  assert.equal((upgrade.match(/<article class="detail-card">/g) || []).length, 6);
  assert.equal((upgrade.match(/<article class="plan-card">/g) || []).length, 5);
  assert.equal((upgrade.match(/<h3>(Where to stay in Las Vegas|Las Vegas family itinerary|Las Vegas with teens)<\/h3>/g) || []).length, 3);
  assert.match(upgrade, /editorial estimates, not venue guarantees/i);
  assert.match(upgrade, /These are starting routes, not universal rankings/i);

  for (const blocked of [
    "Best overall",
    "Best stroller-friendly",
    "Best younger-kid indoor stop",
    "Best for older kids and teens",
    "How claims are handled",
  ]) {
    assert.doesNotMatch(upgrade, new RegExp(blocked, "i"));
  }
});

test("keeps schema and official sources aligned with the 12 choices", () => {
  const html = readFileSync(join(root, "site", target), "utf8");
  const blocks = schemas(html);
  const itemList = blocks.find((block) => block["@type"] === "ItemList");
  const faq = blocks.find((block) => block["@type"] === "FAQPage");

  assert.equal(itemList.itemListElement.length, 12);
  assert.deepEqual(itemList.itemListElement.map((item) => item.name), activityNames);
  assert.equal(faq.mainEntity.length, 3);
  assert.equal((html.match(/<article class="activity-card faq-card">/g) || []).length, 3);
  const visibleHtml = html.slice(0, html.indexOf("<!-- schema:start -->"));
  for (const question of faq.mainEntity.map((item) => item.name)) {
    assert.ok(visibleHtml.includes(`<h3>${question}</h3>`), `FAQ is not visible: ${question}`);
  }
  for (const source of ["Visit Las Vegas family guide", "Adventuredome", "Springs Preserve", "Red Rock Canyon NCA", "Tournament of Kings", "Neon Museum FAQ"]) {
    assert.match(html, new RegExp(source));
  }
});

test("priority upgrade regeneration is idempotent and changes no unrelated site file", () => {
  const temp = mkdtempSync(join(tmpdir(), "family-tripwise-las-vegas-activities-"));
  const copy = join(temp, "site");
  cpSync(join(root, "site"), copy, { recursive: true });

  try {
    const before = new Map(filesUnder(copy).map((path) => [path, readFileSync(join(copy, path))]));
    upgradePriorityPages(copy);
    const afterFirst = new Map(filesUnder(copy).map((path) => [path, readFileSync(join(copy, path))]));
    upgradePriorityPages(copy);
    const afterSecond = new Map(filesUnder(copy).map((path) => [path, readFileSync(join(copy, path))]));

    assert.deepEqual(afterSecond, afterFirst);
    const changed = [...afterFirst].filter(([path, contents]) => !before.get(path)?.equals(contents)).map(([path]) => path);
    assert.deepEqual(changed, []);
  } finally {
    rmSync(temp, { recursive: true, force: true });
  }
});
