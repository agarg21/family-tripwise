import assert from "node:assert/strict";
import { cpSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { upgradePriorityPages } from "./upgrade-priority-pages.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const target = "things-to-do/san-antonio-with-kids.html";
const activityNames = [
  "The Alamo",
  "GO RIO narrated cruise",
  "The DoSeum",
  "Hemisfair and Yanaguana Garden",
  "San Antonio Zoo",
  "Witte Museum",
  "Japanese Tea Garden",
  "San Antonio Missions",
  "San Antonio Botanical Garden",
  "Morgan's Wonderland",
  "Natural Bridge Caverns",
  "Six Flags Fiesta Texas",
  "SeaWorld San Antonio",
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

test("publishes one canonical 13-choice San Antonio activity decision page", () => {
  const html = readFileSync(join(root, "site", target), "utf8");
  const sitemap = readFileSync(join(root, "site", "sitemap.xml"), "utf8");

  assert.match(html, /<title>Things to Do in San Antonio With Kids: 13 Picks by Trip Style<\/title>/);
  assert.match(html, /<h1>Things to Do in San Antonio With Kids: 13 Picks by Trip Style<\/h1>/);
  assert.match(html, /Last updated:<\/strong> July 26, 2026/);
  assert.match(html, /<link rel="canonical" href="https:\/\/familytripwise\.com\/things-to-do\/san-antonio-with-kids\.html">/);
  assert.doesNotMatch(html, /<meta[^>]+name="robots"[^>]+noindex/i);
  assert.equal((sitemap.match(/https:\/\/familytripwise\.com\/things-to-do\/san-antonio-with-kids\.html/g) || []).length, 1);
  assert.match(html, /The%20San%20Antonio%20River%20Walk\.jpg\?width=1200/);
  assert.match(html, /width="1280" height="960" loading="eager" decoding="async" fetchpriority="high"/);

  const baseSection = html.slice(html.indexOf('<section class="container page-section">'), html.indexOf("<!-- priority-upgrade:start -->"));
  assert.equal((baseSection.match(/<article class="activity-card" data-tags=/g) || []).length, 13);
  assert.equal((baseSection.match(/<div><dt>/g) || []).length, 52);
  for (const filter of ["all", "younger", "short", "teen", "indoor", "budget", "theme-park"]) {
    assert.match(baseSection, new RegExp(`data-filter="${filter}"`));
  }
  assert.equal((baseSection.match(/aria-pressed="true"/g) || []).length, 1);
  assert.equal((baseSection.match(/aria-pressed="false"/g) || []).length, 6);
  for (const name of activityNames) assert.ok(html.includes(name), `missing ${name}`);
});

test("keeps the wider page compact, persona-routed, and uncertainty-aware", () => {
  const html = readFileSync(join(root, "site", target), "utf8");
  const upgrade = html.slice(html.indexOf("<!-- priority-upgrade:start -->"), html.indexOf("<!-- priority-upgrade:end -->"));
  const detailSection = upgrade.slice(upgrade.indexOf("Six choices that need an extra check"), upgrade.indexOf("Move from the shortlist"));

  assert.match(upgrade, /Five useful ways to start/);
  assert.equal((upgrade.match(/<article class="quick-pick">/g) || []).length, 5);
  assert.equal((upgrade.match(/<tbody>[\s\S]*?<\/tbody>/)?.[0].match(/<tr>/g) || []).length, 13);
  assert.equal((detailSection.match(/<article class="detail-card">/g) || []).length, 6);
  assert.equal((upgrade.match(/<article class="plan-card">/g) || []).length, 0);
  assert.equal((upgrade.match(/<h3>(Where to stay in San Antonio|San Antonio family itinerary|San Antonio with teens)<\/h3>/g) || []).length, 3);
  assert.match(upgrade, /conditional starts, not universal rankings/i);
  assert.match(upgrade, /editorial planning estimates, not venue guarantees/i);
  assert.match(upgrade, /San Antonio with kids FAQ/);
  assert.equal((html.match(/<article class="activity-card"(?! data-tags)/g) || []).length, 0);
  assert.doesNotMatch(upgrade, /<h4>Pair nearby<\/h4><p><\/p>/);
  assert.doesNotMatch(upgrade, />undefined</);

  for (const blocked of ["Best overall", "Best stroller-friendly", "Mini itineraries", "personally stayed"]) {
    assert.doesNotMatch(upgrade, new RegExp(blocked, "i"));
  }
});

test("aligns comparison, schema, FAQs, and official sources with the 13 choices", () => {
  const html = readFileSync(join(root, "site", target), "utf8");
  const styles = readFileSync(join(root, "site", "styles.css"), "utf8");
  const blocks = schemas(html);
  const itemList = blocks.find((block) => block["@type"] === "ItemList");
  const faq = blocks.find((block) => block["@type"] === "FAQPage");

  assert.deepEqual(itemList.itemListElement.map((item) => item.name), activityNames);
  assert.equal(faq.mainEntity.length, 3);
  assert.equal((html.match(/<article class="detail-card faq-card">/g) || []).length, 3);
  assert.match(html, /<th>Activity<\/th><th>Best role<\/th><th>Time block<\/th><th>Cost<\/th><th>Area<\/th><th>Heat \/ rain role<\/th><th>Main friction<\/th><th>Check now<\/th>/);
  assert.match(html, /<div class="comparison-scroll teen-comparison">/);
  assert.match(styles, /\.teen-comparison \.comparison-table th:first-child,[\s\S]*?position: sticky/);
  const visibleHtml = html.slice(0, html.indexOf("<!-- schema:start -->"));
  for (const question of faq.mainEntity.map((item) => item.name)) {
    assert.ok(visibleHtml.includes(`<h3>${question}</h3>`), `FAQ is not visible: ${question}`);
  }
  for (const source of [
    "The Alamo visit",
    "GO RIO visitor information",
    "GO RIO narrated cruise overview",
    "The DoSeum plan your visit",
    "Witte Museum plan your visit",
    "San Antonio Missions basic information",
    "San Antonio Missions Junior Ranger",
    "Morgan's Wonderland plan your visit",
    "SeaWorld San Antonio park information",
  ]) {
    assert.ok(html.includes(source), `missing source label: ${source}`);
  }
  assert.match(html, /href="https:\/\/www\.goriocruises\.com\/overview\/">GO RIO narrated cruise overview<\/a>/);
  assert.match(html, /href="https:\/\/www\.nps\.gov\/saan\/learn\/kidsyouth\/junior-ranger\.htm">San Antonio Missions Junior Ranger<\/a>/);
});

test("filters materially narrow the 13-choice list", () => {
  const html = readFileSync(join(root, "site", target), "utf8");
  const activities = JSON.parse(html.match(/<script type="application\/json" id="map-ready-activities">([^<]+)<\/script>/)[1]);
  const expectedCounts = {
    younger: 6,
    short: 4,
    teen: 5,
    indoor: 2,
    budget: 4,
    "theme-park": 3,
  };

  assert.equal(activities.length, 13);
  for (const [filter, expected] of Object.entries(expectedCounts)) {
    assert.equal(activities.filter((activity) => activity.tags.includes(filter)).length, expected, filter);
  }
  assert.doesNotMatch(html, /qualifying guests free/);
  assert.match(html, /Paid; guests with special needs free/);
});

test("priority regeneration is idempotent and changes no unrelated site file", () => {
  const temp = mkdtempSync(join(tmpdir(), "family-tripwise-san-antonio-activities-"));
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
