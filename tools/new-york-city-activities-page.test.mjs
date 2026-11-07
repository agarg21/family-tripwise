import assert from "node:assert/strict";
import { cpSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { upgradePriorityPages } from "./upgrade-priority-pages.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const target = "things-to-do/new-york-city-with-kids.html";
const activityNames = [
  "Central Park",
  "American Museum of Natural History",
  "Staten Island Ferry",
  "Children's Museum of Manhattan",
  "Top of the Rock",
  "Brooklyn Bridge Park",
  "Intrepid Museum",
  "New York Transit Museum",
  "New York Hall of Science",
  "Bronx Zoo",
  "Statue of Liberty and Ellis Island",
  "High Line",
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

test("publishes one canonical 12-choice New York City activity decision page", () => {
  const html = readFileSync(join(root, "site", target), "utf8");
  const sitemap = readFileSync(join(root, "site", "sitemap.xml"), "utf8");

  assert.match(html, /<title>Things to Do in New York City With Kids: 12 Picks by Age and Trip Style<\/title>/);
  assert.match(html, /<h1>Things to Do in New York City With Kids: 12 Picks by Age and Trip Style<\/h1>/);
  assert.match(html, /Venue facts checked:<\/strong> July 24, 2026/);
  assert.match(html, /<link rel="canonical" href="https:\/\/familytripwise\.com\/things-to-do\/new-york-city-with-kids\.html">/);
  assert.doesNotMatch(html, /<meta[^>]+name="robots"[^>]+noindex/i);
  assert.equal((sitemap.match(/https:\/\/familytripwise\.com\/things-to-do\/new-york-city-with-kids\.html/g) || []).length, 1);
  assert.match(
    html,
    /<img src="\.\.\/images\/bronx-zoo-giraffes-2026\.webp" style="object-position:50% 55%" width="960" height="720" loading="eager" fetchpriority="high" decoding="async" alt="Two giraffes face each other on a grassy field among tall trees at the Bronx Zoo\.">/
  );
  assert.doesNotMatch(html, /<img[^>]+wikimedia\.org/);

  const baseSection = html.slice(html.indexOf('<section class="container page-section">'), html.indexOf("<!-- priority-upgrade:start -->"));
  assert.equal((baseSection.match(/<article class="activity-card" data-tags=/g) || []).length, 12);
  assert.equal((baseSection.match(/<div><dt>/g) || []).length, 48);
  for (const filter of ["all", "toddler", "preschool", "elementary", "teen", "indoor", "budget"]) {
    assert.match(baseSection, new RegExp(`data-filter="${filter}"`));
  }
  assert.equal((baseSection.match(/aria-pressed="true"/g) || []).length, 1);
  assert.equal((baseSection.match(/aria-pressed="false"/g) || []).length, 6);
  assert.match(baseSection, /setAttribute\("aria-pressed"/);
  for (const name of activityNames) assert.ok(html.includes(name), `missing ${name}`);
});

test("keeps the wider page compact, persona-routed, and uncertainty-aware", () => {
  const html = readFileSync(join(root, "site", target), "utf8");
  const upgrade = html.slice(html.indexOf("<!-- priority-upgrade:start -->"), html.indexOf("<!-- priority-upgrade:end -->"));
  const detailSection = upgrade.slice(upgrade.indexOf("Six choices that need an extra check"), upgrade.indexOf("Continue from the shortlist"));

  assert.match(upgrade, /Five useful ways to start/);
  assert.equal((upgrade.match(/<article class="quick-pick">/g) || []).length, 5);
  assert.equal((upgrade.match(/<tbody>[\s\S]*?<\/tbody>/)?.[0].match(/<tr>/g) || []).length, 12);
  assert.equal((detailSection.match(/<article class="detail-card">/g) || []).length, 6);
  assert.equal((upgrade.match(/<article class="plan-card">/g) || []).length, 0);
  assert.match(upgrade, /starting routes, not universal rankings/i);
  assert.match(upgrade, /editorial planning estimates, not venue guarantees/i);
  assert.match(upgrade, /New York City with kids FAQ/);
  assert.equal((html.match(/<article class="activity-card"(?! data-tags)/g) || []).length, 0);

  const mapReady = JSON.parse(html.match(/<script type="application\/json" id="map-ready-activities">([^<]+)<\/script>/)[1]);
  const nysci = mapReady.find((activity) => activity.name === "New York Hall of Science");
  assert.ok(nysci);
  assert.doesNotMatch(nysci.tags.join(" "), /\bteen\b/);

  const olderStartIndex = upgrade.indexOf("<h3>Older kids and teens</h3>");
  const olderStart = upgrade.slice(olderStartIndex, upgrade.indexOf("</article>", olderStartIndex));
  assert.doesNotMatch(olderStart, /NYSCI|New York Hall of Science/);

  for (const blocked of [
    "Best overall",
    "Best stroller-friendly",
    "Keep this page tourist-focused",
    "How claims are handled",
    "For most first-time families",
  ]) {
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
    "AMNH plan your visit",
    "Staten Island Ferry schedule",
    "CMOM plan your visit",
    "Transit Museum know before you visit",
    "Statue of Liberty and Ellis Island planning",
    "Central Park maps",
  ]) {
    assert.match(html, new RegExp(source));
  }
});

test("priority regeneration is idempotent and changes no unrelated site file", () => {
  const temp = mkdtempSync(join(tmpdir(), "family-tripwise-nyc-activities-"));
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

test("decision table leads with family-of-4 cost built only from observed official prices", () => {
  const html = readFileSync(join(root, "site", target), "utf8");
  const section = html.slice(html.indexOf('id="nyc-kids-comparison"'), html.indexOf("</section>", html.indexOf('id="nyc-kids-comparison"')));
  assert.match(section, /<th scope="col">Activity<\/th><th scope="col">Family of 4 cost<\/th>/);
  assert.match(section, /class="comparison-scroll ds-table nyc-kids-ds" tabindex="0"/);
  assert.match(section, /2 adults, kids 4 and 8/);
  for (const figure of ["≈ \\$68 online", "≈ \\$104", "≈ \\$50", "≈ \\$82", "≈ \\$100 through Mar 25, 2027", "≈ \\$86 ferry"]) assert.match(section.replace(/<\/?strong>/g, ""), new RegExp(figure));
  // AMNH and Top of the Rock prices were not readable on 2026-11-02: no invented figure.
  for (const name of ["American Museum of Natural History", "Top of the Rock"]) {
    const start = section.indexOf(`rowheader">${name}<`);
    assert.ok(start > 0, name);
    const row = section.slice(start, section.indexOf("</tr>", start));
    assert.match(row, /check live/);
    assert.doesNotMatch(row, /\$/);
  }
  assert.match(html, /Ticket prices checked:<\/strong> November 2, 2026 \(Intrepid November 1\)/);
  assert.doesNotMatch(section, /<\/strong>; /);
});
