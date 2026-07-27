import assert from "node:assert/strict";
import { cpSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { upgradePriorityPages } from "./upgrade-priority-pages.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const target = "things-to-do/san-antonio-with-teens.html";

function schemas(html) {
  return [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((match) => JSON.parse(match[1]));
}

function filesUnder(directory, base = directory) {
  return readdirSync(directory).flatMap((name) => {
    const path = join(directory, name);
    return statSync(path).isDirectory() ? filesUnder(path, base) : [relative(base, path)];
  });
}

test("keeps one canonical, indexable ten-choice San Antonio teen page", () => {
  const html = readFileSync(join(root, "site", target), "utf8");
  const sitemap = readFileSync(join(root, "site", "sitemap.xml"), "utf8");
  const names = [
    "Natural Bridge Caverns, exact tour",
    "Six Flags Fiesta Texas",
    "Andretti Indoor Karting & Games",
    "SeaWorld San Antonio",
    "Alamo church and Ralston Family Collections Center",
    "Mission San Jose or one selected mission",
    "Hopscotch San Antonio",
    "GO RIO narrated cruise",
    "Pearl and Museum Reach, one teen-chosen stop",
    "Southtown and Blue Star, one selected gallery or food stop"
  ];

  assert.match(html, /<title>Things to Do in San Antonio With Teens: 10 Picks by Trip Style<\/title>/);
  assert.match(html, /<h1>Things to Do in San Antonio With Teens: 10 Picks by Trip Style<\/h1>/);
  assert.match(html, /<link rel="canonical" href="https:\/\/familytripwise\.com\/things-to-do\/san-antonio-with-teens\.html">/);
  assert.doesNotMatch(html, /<meta[^>]+name="robots"[^>]+noindex/i);
  assert.equal((sitemap.match(/https:\/\/familytripwise\.com\/things-to-do\/san-antonio-with-teens\.html/g) || []).length, 1);
  assert.match(html, /Attraction facts and official sources checked:<\/strong> July 27, 2026/);
  for (const name of names) assert.ok(html.includes(name), `missing ${name}`);
  assert.equal((html.match(/<tbody>[\s\S]*?<\/tbody>/)?.[0].match(/<tr>/g) || []).length, 10);
});

test("uses one compact teen decision flow", () => {
  const html = readFileSync(join(root, "site", target), "utf8");

  assert.equal((html.match(/<article class="quick-pick">/g) || []).length, 5);
  assert.equal((html.match(/<article class="detail-card">/g) || []).length, 5);
  assert.equal((html.match(/<article class="plan-card">/g) || []).length, 3);
  assert.match(html, /Five choices that need an exact decision/);
  assert.match(html, /Teen reason/);
  assert.match(html, /Let the older child choose one anchor/);
  assert.match(html, /mixed-age/i);
  assert.match(html, /class="comparison-scroll teen-comparison"/);
  assert.doesNotMatch(html, /Best overall|Best-fit activities for teens|More independence, fewer little-kid compromises|Should the San Antonio with teens page stay indexed/i);
  assert.doesNotMatch(html, /<p>undefined<\/p>|personally visited|personally verified|safe neighborhood/i);
});

test("aligns FAQ, schema, current checks, sources, and cluster routes", () => {
  const html = readFileSync(join(root, "site", target), "utf8");
  const blocks = schemas(html);
  const itemList = blocks.find((block) => block["@type"] === "ItemList");
  const faq = blocks.find((block) => block["@type"] === "FAQPage");

  assert.equal(itemList.itemListElement.length, 10);
  assert.equal(faq.mainEntity.length, 3);
  assert.equal((html.match(/<article class="activity-card faq-card">/g) || []).length, 3);
  const visible = html.slice(0, html.indexOf('<script type="application/ld+json">'));
  for (const question of faq.mainEntity.map((item) => item.name)) {
    assert.ok(visible.includes(`<h3>${question}</h3>`), `FAQ is not visible: ${question}`);
  }

  for (const required of [
    "minimum age of eight",
    "54-inch minimum",
    "active chaperone policy",
    "naturalbridgecaverns.com/adventure-tour/",
    "sixflags.com/fiestatexas/code-of-conduct",
    "andrettikarting.com/sanantonio/pricing",
    "goriocruises.com/visitor-information/",
    "goriocruises.com/overview/",
    "san-antonio-family-hotels.html",
    "san-antonio-with-kids.html",
    "family-itinerary/san-antonio-with-kids.html",
    "The_San_Antonio_River_Walk.jpg"
  ]) assert.match(html, new RegExp(required));
});

test("keeps the seven-column comparison readable in the mobile scroller", () => {
  const html = readFileSync(join(root, "site", target), "utf8");
  const css = readFileSync(join(root, "site", "styles.css"), "utf8");
  const table = html.match(/<div class="comparison-scroll teen-comparison">([\s\S]*?)<\/table>/)?.[1] || "";

  assert.equal((table.match(/<th>/g) || []).length, 7);
  assert.equal((table.match(/<tr>/g) || []).length, 11);
  assert.match(css, /\.teen-comparison \.comparison-table \{[\s\S]*?min-width: 820px/);
  assert.match(css, /\.teen-comparison \.comparison-table th:first-child,[\s\S]*?position: sticky/);
});

test("priority regeneration is idempotent and changes no unrelated site file", () => {
  const temp = mkdtempSync(join(tmpdir(), "family-tripwise-sa-teen-"));
  const copy = join(temp, "site");
  cpSync(join(root, "site"), copy, { recursive: true });

  try {
    const before = new Map(filesUnder(copy).map((path) => [path, readFileSync(join(copy, path))]));
    upgradePriorityPages(copy);
    const after = new Map(filesUnder(copy).map((path) => [path, readFileSync(join(copy, path))]));
    assert.deepEqual(after, before);
  } finally {
    rmSync(temp, { recursive: true, force: true });
  }
});
