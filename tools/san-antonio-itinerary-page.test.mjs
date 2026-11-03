import assert from "node:assert/strict";
import { cpSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { upgradePriorityPages } from "./upgrade-priority-pages.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const target = "family-itinerary/san-antonio-with-kids.html";

function schemas(html) {
  return [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((match) => JSON.parse(match[1]));
}

function filesUnder(directory, base = directory) {
  return readdirSync(directory).flatMap((name) => {
    const path = join(directory, name);
    return statSync(path).isDirectory() ? filesUnder(path, base) : [relative(base, path)];
  });
}

test("keeps one canonical, indexable San Antonio family-itinerary page", () => {
  const html = readFileSync(join(root, "site", target), "utf8");
  const sitemap = readFileSync(join(root, "site", "sitemap.xml"), "utf8");

  assert.match(html, /<title>San Antonio Itinerary With Kids: Realistic 1, 2 and 3 Day Plans<\/title>/);
  assert.match(html, /<h1>San Antonio Itinerary With Kids: Realistic 1, 2 and 3 Day Plans<\/h1>/);
  assert.match(html, /<link rel="canonical" href="https:\/\/familytripwise\.com\/family-itinerary\/san-antonio-with-kids\.html">/);
  assert.doesNotMatch(html, /<meta[^>]+name="robots"[^>]+noindex/i);
  assert.equal((sitemap.match(/https:\/\/familytripwise\.com\/family-itinerary\/san-antonio-with-kids\.html/g) || []).length, 1);
  assert.match(html, /Prices checked:<\/strong> November 1, 2026\. <strong>Other sources:<\/strong> July 27, 2026/);
});

test("renders one compact selection, execution, pivot, and stop-rule flow", () => {
  const html = readFileSync(join(root, "site", target), "utf8");

  assert.equal((html.match(/<article class="quick-pick">/g) || []).length, 3);
  assert.equal((html.match(/<article class="detail-card itinerary-plan">/g) || []).length, 3);
  assert.equal((html.match(/<article class="plan-card">/g) || []).length, 4);
  assert.equal((html.match(/<article class="activity-card faq-card">/g) || []).length, 3);
  assert.equal((html.match(/<tbody>[\s\S]*?<\/tbody>/)?.[0].match(/<tr>/g) || []).length, 5);

  for (const required of [
    "One-day first look",
    "Two-day first trip",
    "Three-day balanced trip",
    "Change the plan for age, heat, budget or your hotel",
    "Decide what to drop",
    "Finish the activity and lodging decisions"
  ]) assert.match(html, new RegExp(required));

  for (const blocked of [
    "Nap-friendly structure",
    "Condensed weekend plan",
    "1-day, 2-day, 3-day, toddler, teen, and rainy-day variants",
    "Best 1-day plan",
    "Best toddler pace",
    "safest",
    "stroller-friendly"
  ]) assert.doesNotMatch(html, new RegExp(blocked, "i"));
});

test("aligns schema, visible FAQ, sources, image, and all four cluster routes", () => {
  const html = readFileSync(join(root, "site", target), "utf8");
  const styles = readFileSync(join(root, "site", "styles.css"), "utf8");
  const blocks = schemas(html);
  const itemList = blocks.find((block) => block["@type"] === "ItemList");
  const faq = blocks.find((block) => block["@type"] === "FAQPage");

  assert.equal(itemList.name, "San Antonio family itinerary lengths");
  assert.deepEqual(itemList.itemListElement.map((item) => item.name), [
    "One-day first look",
    "Two-day first trip",
    "Three-day balanced trip"
  ]);
  assert.equal(faq.mainEntity.length, 3);
  const visible = html.slice(0, html.indexOf('<script type="application/ld+json">'));
  for (const question of faq.mainEntity.map((item) => item.name)) {
    assert.ok(visible.includes(`<h3>${question}</h3>`), `FAQ is not visible: ${question}`);
  }

  for (const required of [
    "../things-to-do/san-antonio-with-kids.html",
    "../things-to-do/san-antonio-with-teens.html",
    "../where-to-stay/san-antonio-with-kids.html",
    "../where-to-stay/san-antonio-family-hotels.html",
    "thealamo.org/visit/calendar/alamo-free-timed-entry",
    "goriocruises.com/overview/",
    "viainfo.net/service-alerts/",
    "forecast.weather.gov/MapClick.php",
    "images/san-antonio-river-walk\\.webp",
    "Matt Harriger",
    "creativecommons.org/licenses/by-sa/2.0/"
  ]) assert.match(html, new RegExp(required));

  assert.equal((html.match(/<ul class="source-list">[\s\S]*?<\/ul>/)?.[0].match(/<li>/g) || []).length, 18);
  assert.match(html, /thealamo\.org\/visit\/tours-and-experiences\/alamo-collections-center/);
  assert.match(html, /class="comparison-scroll itinerary-pivot-comparison" tabindex="0" role="region" aria-label="San Antonio itinerary constraint comparison\. Scroll horizontally for all columns\."/);
  assert.equal((html.match(/<td role="rowheader">/g) || []).length, 5);
  assert.equal((html.match(/<th scope="col">/g) || []).length, 5);
  assert.match(styles, /\.itinerary-pivot-comparison \.comparison-table \{/);
  assert.match(styles, /\.itinerary-pivot-comparison \.comparison-table th:first-child,[\s\S]*?position: sticky;/);
});

test("regeneration is idempotent and changes no unrelated site file", () => {
  const temp = mkdtempSync(join(tmpdir(), "family-tripwise-san-antonio-itinerary-"));
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

test("leads with a family-of-4 ticket plan computed from dated official prices", () => {
  const html = readFileSync(join(root, "site", target), "utf8");
  const box = html.match(/<section id="san-antonio-itinerary-answer" class="container answer-box"[\s\S]*?<\/section>/)?.[0] || "";
  assert.ok(html.indexOf('id="san-antonio-itinerary-answer"') < html.indexOf('class="container media-section"'));
  assert.match(box, /2 adults, kids 4 and 8/);
  // Alamo exhibit 2 x 15 + 2 x 11 = 52; DoSeum 4 x 18 = 72; Witte 2 x 17 + 2 x 11 = 56.
  assert.match(box, /1 day ≈ \$52/);
  assert.match(box, /2 days ≈ \$124/);
  assert.match(box, /3 days ≈ \$180/);
  assert.match(box, /closed Tuesdays/i);
  assert.match(box, /Reserve the free Alamo church ticket/);
  assert.match(box, /from ≈ \$156/);
  const facts = html.match(/<section id="san-antonio-itinerary-answer-facts"[\s\S]*?<\/section>/)?.[0] || "";
  assert.equal((facts.match(/<li>/g) || []).length, 5);
  assert.match(facts, /href="https:\/\/www\.thedoseum\.org\/admission"/);
  assert.match(facts, /href="https:\/\/www\.thealamo\.org\/visit\/calendar\/alamo-free-timed-entry"/);
  assert.match(facts, /read November 1, 2026/i);
});
