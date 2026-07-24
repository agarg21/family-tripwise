import assert from "node:assert/strict";
import { cpSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { upgradePriorityPages } from "./upgrade-priority-pages.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const target = "things-to-do/chicago-with-teens.html";

function schemas(html) {
  return [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((match) => JSON.parse(match[1]));
}

function filesUnder(directory, base = directory) {
  return readdirSync(directory).flatMap((name) => {
    const path = join(directory, name);
    return statSync(path).isDirectory() ? filesUnder(path, base) : [relative(base, path)];
  });
}

test("keeps one canonical, indexable eight-choice Chicago teen page", () => {
  const html = readFileSync(join(root, "site", target), "utf8");
  const sitemap = readFileSync(join(root, "site", "sitemap.xml"), "utf8");
  const names = [
    "Chicago Architecture Center river cruise",
    "Griffin Museum of Science and Industry",
    "Art Institute Teen Audio Guide",
    "360 CHICAGO and optional TILT",
    "Wrigley Field tour or selected game",
    "Lakefront Trail, one bounded segment",
    "Flyover at Navy Pier",
    "Second City, one selected show"
  ];

  assert.match(html, /<title>Things to Do in Chicago With Teens: 8 Picks by Trip Style<\/title>/);
  assert.match(html, /<h1>Things to Do in Chicago With Teens: 8 Picks by Trip Style<\/h1>/);
  assert.match(html, /<link rel="canonical" href="https:\/\/familytripwise\.com\/things-to-do\/chicago-with-teens\.html">/);
  assert.doesNotMatch(html, /<meta[^>]+name="robots"[^>]+noindex/i);
  assert.equal((sitemap.match(/https:\/\/familytripwise\.com\/things-to-do\/chicago-with-teens\.html/g) || []).length, 1);
  assert.match(html, /Attraction facts and official sources checked:<\/strong> July 23, 2026/);
  for (const name of names) assert.ok(html.includes(name), `missing ${name}`);
  assert.equal((html.match(/<tbody>[\s\S]*?<\/tbody>/)?.[0].match(/<tr>/g) || []).length, 8);
});

test("uses one compact teen-specific decision flow without the old duplicate shortlist", () => {
  const html = readFileSync(join(root, "site", target), "utf8");

  assert.equal((html.match(/<article class="quick-pick">/g) || []).length, 5);
  assert.equal((html.match(/<article class="detail-card">/g) || []).length, 4);
  assert.match(html, /Four choices that need an exact check/);
  assert.equal((html.match(/<article class="plan-card">/g) || []).length, 4);
  assert.match(html, /Teen reason/);
  assert.match(html, /teen-chosen anchor/i);
  assert.match(html, /class="comparison-scroll teen-comparison"/);
  assert.match(html, /Movement, route choice, skyline photos/);
  assert.doesNotMatch(html, /360 CHICAGO or a bounded Lakefront Trail|Wrigley or one selected Second City/i);
  assert.doesNotMatch(html, /Best overall|Best-fit activities for teens|More independence, fewer little-kid compromises/i);
  assert.doesNotMatch(html, /<td>\${1,3}<\/td>|Generic Navy Pier|Navy Pier by specific reason/);
});

test("aligns visible FAQ, schema, official checks, sources, and cluster routes", () => {
  const html = readFileSync(join(root, "site", target), "utf8");
  const blocks = schemas(html);
  const itemList = blocks.find((block) => block["@type"] === "ItemList");
  const faq = blocks.find((block) => block["@type"] === "FAQPage");

  assert.equal(itemList.itemListElement.length, 8);
  assert.equal(faq.mainEntity.length, 3);
  assert.equal((html.match(/<article class="activity-card faq-card">/g) || []).length, 3);
  const visible = html.slice(0, html.indexOf('<script type="application/ld+json">'));
  for (const question of faq.mainEntity.map((item) => item.name)) {
    assert.ok(visible.includes(`<h3>${question}</h3>`), `FAQ is not visible: ${question}`);
  }

  for (const required of [
    "official TILT minimum is currently 42 inches",
    "Second City generally excludes children under 13",
    "Current film, sensory effects, 40-inch rule and ticket",
    "experienceflyover.com/chicago/plan-your-visit/faqs/",
    "chicago-family-hotels.html",
    "1280px-Millennium_park%2Cchicago.JPG",
    "Behnazkhazai",
    "creativecommons.org/licenses/by-sa/3.0/"
  ]) assert.match(html, new RegExp(required));

  assert.doesNotMatch(html, /Yes, if the plan leans|personally visited|personally verified/i);
});

test("keeps the seven-column comparison readable in the mobile scroller", () => {
  const html = readFileSync(join(root, "site", target), "utf8");
  const css = readFileSync(join(root, "site", "styles.css"), "utf8");
  const table = html.match(/<div class="comparison-scroll teen-comparison">([\s\S]*?)<\/table>/)?.[1] || "";

  assert.equal((table.match(/<th>/g) || []).length, 7);
  assert.equal((table.match(/<tr>/g) || []).length, 9);
  assert.match(css, /\.teen-comparison \.comparison-table \{[\s\S]*?min-width: 820px/);
  assert.match(css, /\.teen-comparison \.comparison-table th:first-child,[\s\S]*?position: sticky/);
  assert.match(css, /\.teen-comparison \.comparison-table td:first-child[\s\S]*?background: var\(--surface\)/);
});

test("priority regeneration is idempotent and changes no unrelated site file", () => {
  const temp = mkdtempSync(join(tmpdir(), "family-tripwise-chicago-teen-"));
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
