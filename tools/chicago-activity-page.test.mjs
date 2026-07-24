import assert from "node:assert/strict";
import { cpSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { upgradePriorityPages } from "./upgrade-priority-pages.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const target = "things-to-do/chicago-with-kids.html";
const activityNames = [
  "Field Museum",
  "Shedd Aquarium",
  "Griffin Museum of Science and Industry",
  "Adler Planetarium",
  "Lincoln Park Zoo",
  "Millennium Park and Maggie Daley Park",
  "Chicago Architecture Center river cruise",
  "Chicago Children's Museum",
  "Art Institute of Chicago",
  "360 CHICAGO",
  "Garfield Park Conservatory",
  "Chicago lakefront and beach time",
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

test("publishes one canonical 12-choice Chicago activity decision page", () => {
  const html = readFileSync(join(root, "site", target), "utf8");
  const sitemap = readFileSync(join(root, "site", "sitemap.xml"), "utf8");

  assert.match(html, /<title>Things to Do in Chicago With Kids: 12 Picks by Age and Trip Style<\/title>/);
  assert.match(html, /<h1>Things to Do in Chicago With Kids: 12 Picks by Age and Trip Style<\/h1>/);
  assert.match(html, /Last updated:<\/strong> July 23, 2026/);
  assert.match(html, /<link rel="canonical" href="https:\/\/familytripwise\.com\/things-to-do\/chicago-with-kids\.html">/);
  assert.doesNotMatch(html, /<meta[^>]+name="robots"[^>]+noindex/i);
  assert.equal((sitemap.match(/https:\/\/familytripwise\.com\/things-to-do\/chicago-with-kids\.html/g) || []).length, 1);

  const baseSection = html.slice(html.indexOf('<section class="container page-section">'), html.indexOf("<!-- priority-upgrade:start -->"));
  assert.equal((baseSection.match(/<article class="activity-card" data-tags=/g) || []).length, 12);
  assert.equal((baseSection.match(/<div><dt>/g) || []).length, 48);
  for (const filter of ["all", "toddler", "elementary", "teen", "indoor", "budget"]) {
    assert.match(baseSection, new RegExp(`data-filter="${filter}"`));
  }
  assert.equal((baseSection.match(/aria-pressed="true"/g) || []).length, 1);
  assert.equal((baseSection.match(/aria-pressed="false"/g) || []).length, 5);
  assert.match(baseSection, /setAttribute\("aria-pressed"/);
  for (const name of activityNames) assert.ok(html.includes(name), `missing ${name}`);
});

test("keeps the widened page compact, persona-routed, and current-source aware", () => {
  const html = readFileSync(join(root, "site", target), "utf8");
  const upgrade = html.slice(html.indexOf("<!-- priority-upgrade:start -->"), html.indexOf("<!-- priority-upgrade:end -->"));
  const detailSection = upgrade.slice(upgrade.indexOf("Six choices that need an extra check"), upgrade.indexOf("Move from the shortlist"));

  assert.match(upgrade, /Five useful ways to start/);
  assert.equal((upgrade.match(/<article class="quick-pick">/g) || []).length, 5);
  assert.equal((upgrade.match(/<tbody>[\s\S]*?<\/tbody>/)?.[0].match(/<tr>/g) || []).length, 12);
  assert.equal((detailSection.match(/<article class="detail-card">/g) || []).length, 6);
  assert.equal((upgrade.match(/<article class="plan-card">/g) || []).length, 0);
  assert.equal((upgrade.match(/<h3>(Where to stay in Chicago|Chicago family itinerary|Chicago with teens)<\/h3>/g) || []).length, 3);
  assert.match(upgrade, /starting routes, not universal rankings/i);
  assert.match(upgrade, /editorial planning estimates, not venue guarantees/i);
  assert.match(upgrade, /Chicago with kids FAQ/);
  assert.equal((html.match(/<article class="activity-card"(?! data-tags)/g) || []).length, 0);

  for (const blocked of ["Best overall", "Best stroller-friendly", "Las Vegas with kids FAQ", "<h3>Navy Pier</h3>"]) {
    assert.doesNotMatch(upgrade, new RegExp(blocked, "i"));
  }
});

test("aligns schema, visible FAQs, and official sources with the 12 choices", () => {
  const html = readFileSync(join(root, "site", target), "utf8");
  const blocks = schemas(html);
  const itemList = blocks.find((block) => block["@type"] === "ItemList");
  const faq = blocks.find((block) => block["@type"] === "FAQPage");

  assert.deepEqual(itemList.itemListElement.map((item) => item.name), activityNames);
  assert.equal(faq.mainEntity.length, 3);
  assert.equal((html.match(/<article class="detail-card faq-card">/g) || []).length, 3);
  const visibleHtml = html.slice(0, html.indexOf("<!-- schema:start -->"));
  for (const question of faq.mainEntity.map((item) => item.name)) {
    assert.ok(visibleHtml.includes(`<h3>${question}</h3>`), `FAQ is not visible: ${question}`);
  }
  for (const source of [
    "Field Museum with kids",
    "Shedd Aquarium plan a visit",
    "Lincoln Park Zoo visit",
    "Art Institute family resources",
    "Chicago Park District beaches",
  ]) {
    assert.match(html, new RegExp(source));
  }
});

test("priority upgrade regeneration is idempotent and changes no unrelated site file", () => {
  const temp = mkdtempSync(join(tmpdir(), "family-tripwise-chicago-activities-"));
  const copy = join(temp, "site");
  cpSync(join(root, "site"), copy, { recursive: true });

  try {
    const targetPath = join(copy, target);
    const stale = readFileSync(targetPath, "utf8")
      .replace(/<!-- priority-upgrade:start -->[\s\S]*?<!-- priority-upgrade:end -->\n?/, "")
      .replace(/<!-- schema:start -->[\s\S]*?<!-- schema:end -->\n?/g, "");
    writeFileSync(targetPath, stale);
    const before = new Map(filesUnder(copy).map((path) => [path, readFileSync(join(copy, path))]));
    upgradePriorityPages(copy);
    const afterFirst = new Map(filesUnder(copy).map((path) => [path, readFileSync(join(copy, path))]));
    upgradePriorityPages(copy);
    const afterSecond = new Map(filesUnder(copy).map((path) => [path, readFileSync(join(copy, path))]));

    assert.deepEqual(afterSecond, afterFirst);
    const changed = [...afterFirst].filter(([path, contents]) => !before.get(path)?.equals(contents)).map(([path]) => path);
    assert.deepEqual(changed, [target]);
  } finally {
    rmSync(temp, { recursive: true, force: true });
  }
});
