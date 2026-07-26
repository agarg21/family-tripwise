import assert from "node:assert/strict";
import { cpSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { upgradePriorityPages } from "./upgrade-priority-pages.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const target = "where-to-stay/new-york-city-with-kids.html";
const areas = [
  "Upper West Side",
  "Midtown",
  "Downtown / Tribeca",
  "Brooklyn Heights / Downtown Brooklyn",
  "Long Island City",
];

function schemas(html) {
  return [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
    .map((match) => JSON.parse(match[1]));
}

function filesUnder(directory, base = directory) {
  return readdirSync(directory).flatMap((name) => {
    const path = join(directory, name);
    return statSync(path).isDirectory() ? filesUnder(path, base) : [relative(base, path)];
  });
}

test("keeps one canonical, indexable five-area New York City stay page", () => {
  const html = readFileSync(join(root, "site", target), "utf8");
  const sitemap = readFileSync(join(root, "site", "sitemap.xml"), "utf8");

  assert.match(html, /<title>Where to Stay in New York City With Kids: 5 Areas Compared<\/title>/);
  assert.match(html, /<h1>Where to Stay in New York City With Kids: 5 Areas Compared<\/h1>/);
  assert.match(html, /<link rel="canonical" href="https:\/\/familytripwise\.com\/where-to-stay\/new-york-city-with-kids\.html">/);
  assert.doesNotMatch(html, /<meta[^>]+name="robots"[^>]+noindex/i);
  assert.equal((sitemap.match(/https:\/\/familytripwise\.com\/where-to-stay\/new-york-city-with-kids\.html/g) || []).length, 1);
  assert.match(html, /Area and transport sources checked:<\/strong> July 26, 2026/);
  assert.equal((html.match(/<tbody>[\s\S]*?<\/tbody>/)?.[0].match(/<tr>/g) || []).length, 5);
  for (const area of areas) assert.ok(html.includes(area), `missing ${area}`);
});

test("uses one compact area-to-hotel flow without repeated or unsupported sections", () => {
  const html = readFileSync(join(root, "site", target), "utf8");

  assert.equal((html.match(/<article class="quick-pick">/g) || []).length, 5);
  assert.equal((html.match(/<article class="detail-card research-card">/g) || []).length, 3);
  assert.equal((html.match(/<article class="activity-card">/g) || []).length, 4);
  assert.equal((html.match(/<article class="activity-card faq-card">/g) || []).length, 3);
  assert.match(html, /Compare the area before the hotel/);
  assert.match(html, /12 family hotel options/);
  assert.match(html, /\.\/new-york-city-family-hotels\.html/);

  for (const blocked of [
    "Best areas for families",
    "Best areas by family need",
    "How to evaluate family-friendly hotel claims",
    "Research-backed hotel verification notes",
    "Official-source checks before you book",
    "Best overall area",
    "Best default family base",
    "Family verdict",
    "Noise</th>",
    "Stroller</th>",
    "Excellent</span>",
  ]) assert.doesNotMatch(html, new RegExp(blocked, "i"));
});

test("aligns visible FAQ, schema, image attribution, sources, and cluster routes", () => {
  const html = readFileSync(join(root, "site", target), "utf8");
  const blocks = schemas(html);
  const itemList = blocks.find((block) => block["@type"] === "ItemList");
  const faq = blocks.find((block) => block["@type"] === "FAQPage");

  assert.equal(itemList.name, "New York City family stay area options");
  assert.deepEqual(itemList.itemListElement.map((item) => item.name), areas);
  assert.equal(faq.mainEntity.length, 3);
  const visible = html.slice(0, html.indexOf('<script type="application/ld+json">'));
  for (const question of faq.mainEntity.map((item) => item.name)) {
    assert.ok(visible.includes(`<h3>${question}</h3>`), `FAQ is not visible: ${question}`);
  }

  for (const required of [
    "new-york-city-family-hotels.html",
    "new-york-city-with-teens.html",
    "family-itinerary/new-york-city-with-kids.html",
    "www.mta.info/maps/subway-line-maps",
    "www.mta.info/accessibility/stations",
    "www.mta.info/elevator-escalator-status",
    "parks.ny.gov/visit/state-parks/gantry-plaza-state-park",
    "Central_Park_New_York_City_New_York_23_cropped.jpg",
    "Jet Lowe",
  ]) assert.match(html, new RegExp(required));
});

test("priority upgrade regeneration is idempotent and changes no unrelated site file", () => {
  const temp = mkdtempSync(join(tmpdir(), "family-tripwise-nyc-stay-"));
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
