import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { cpSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const pagePath = join(root, "site", "where-to-stay", "san-antonio-family-hotels.html");

function schemas(html) {
  return [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((match) => JSON.parse(match[1]));
}

function filesUnder(directory, base = directory) {
  return readdirSync(directory).flatMap((name) => {
    const path = join(directory, name);
    return statSync(path).isDirectory() ? filesUnder(path, base) : [relative(base, path)];
  });
}

test("publishes one canonical 12-hotel San Antonio comparison", () => {
  const html = readFileSync(pagePath, "utf8");
  const sitemap = readFileSync(join(root, "site", "sitemap.xml"), "utf8");
  const names = [
    "Hyatt Regency Hill Country Resort and Villas",
    "JW Marriott San Antonio Hill Country Resort and Spa",
    "Signia by Hilton La Cantera Resort and Spa",
    "Hyatt Vacation Club at Wild Oak Ranch",
    "Embassy Suites by Hilton San Antonio Riverwalk Downtown",
    "Homewood Suites by Hilton San Antonio-Riverwalk/Downtown",
    "Home2 Suites by Hilton San Antonio Riverwalk",
    "Drury Plaza Hotel San Antonio Riverwalk",
    "Hotel Contessa",
    "Hyatt Regency San Antonio Riverwalk",
    "San Antonio Marriott Rivercenter on the River Walk",
    "Omni La Mansion del Rio"
  ];

  assert.match(html, /<title>Top Family Hotels in San Antonio: 12 Options by Trip Style<\/title>/);
  assert.match(html, /<h1>Top Family Hotels in San Antonio: 12 Options by Trip Style<\/h1>/);
  assert.match(html, /<link rel="canonical" href="https:\/\/familytripwise\.com\/where-to-stay\/san-antonio-family-hotels\.html">/);
  assert.doesNotMatch(html, /<meta[^>]+name="robots"[^>]+noindex/i);
  assert.equal((sitemap.match(/https:\/\/familytripwise\.com\/where-to-stay\/san-antonio-family-hotels\.html/g) || []).length, 1);
  for (const name of names) assert.ok(html.includes(name), `missing ${name}`);
  assert.equal((html.match(/<details class="detail-card hotel-card" id="san-antonio-hotel-/g) || []).length, 12);
  assert.equal((html.match(/<summary style="cursor: pointer;">/g) || []).length, 12);
  assert.equal((html.match(/href="#san-antonio-hotel-/g) || []).length, 12);
  assert.equal((html.match(/<h4>Themes in recent online reviews<\/h4>/g) || []).length, 12);
  assert.equal((html.match(/https:\/\/www\.google\.com\/maps\/search\/\?api=1&amp;query=/g) || []).length, 24);
  assert.match(html, /<div class="comparison-scroll teen-comparison">\s*<table class="comparison-table hotel-comparison">/);
  assert.match(html, /Rough total\/night, not a quote/);
  assert.match(html, /Hotel facts, prices, and online-review sources checked:<\/strong> July 26, 2026/);
  assert.match(html, /This is the 118 Soledad Street Riverwalk property/);
  assert.match(html, /This is a vacation-club property/);
  assert.match(html, /pool was under construction/);
  assert.match(html, />SeaWorld San Antonio<\/a>/);
  assert.match(html, /hotel-card-grid" style="grid-template-columns: 1fr;"/);
  assert.match(html, /upper edges are editorial planning ceilings, not observed quotes/);
  assert.match(html, /srcset="[^"]+width=640 640w,[^"]+width=1200 1200w"/);
  assert.match(html, /CC BY-SA 2\.0/);
  assert.doesNotMatch(html, /review[- ]signal/i);
  assert.doesNotMatch(html, /personally stayed|safest|quietest|best overall/i);
  assert.doesNotMatch(html, /Book now|Reserve now|affiliate/i);
});

test("keeps visible FAQ and schema aligned", () => {
  const html = readFileSync(pagePath, "utf8");
  const blocks = schemas(html);
  const itemList = blocks.find((block) => block["@type"] === "ItemList");
  const faq = blocks.find((block) => block["@type"] === "FAQPage");

  assert.equal(itemList.itemListElement.length, 12);
  assert.equal(faq.mainEntity.length, 3);
  assert.equal((html.match(/<article class="activity-card faq-card">/g) || []).length, 3);
  const visible = html.slice(0, html.indexOf('<script type="application/ld+json">'));
  for (const question of faq.mainEntity.map((item) => item.name)) {
    assert.ok(visible.includes(`<h3>${question}</h3>`), `FAQ is not visible: ${question}`);
  }
});

test("routes from home and the existing stay guide without changing the activity page", () => {
  const home = readFileSync(join(root, "site", "index.html"), "utf8");
  const stay = readFileSync(join(root, "site", "where-to-stay", "san-antonio-with-kids.html"), "utf8");
  const activity = readFileSync(join(root, "site", "things-to-do", "san-antonio-with-kids.html"), "utf8");

  assert.match(home, /href="\.\/where-to-stay\/san-antonio-family-hotels\.html"/);
  assert.match(stay, /href="(?:\.\/|\.\.\/where-to-stay\/)san-antonio-family-hotels\.html"/);
  assert.doesNotMatch(activity, /san-antonio-family-hotels\.html/);
});

test("full generation is idempotent and leaves current output unchanged", () => {
  const temp = mkdtempSync(join(tmpdir(), "family-tripwise-san-antonio-hotels-"));
  const siteCopy = join(temp, "site");
  cpSync(join(root, "site"), siteCopy, { recursive: true });
  cpSync(join(root, "tools"), join(temp, "tools"), { recursive: true });

  try {
    const before = new Map(filesUnder(siteCopy).map((path) => [path, readFileSync(join(siteCopy, path))]));
    execFileSync(process.execPath, [join(temp, "tools", "generate-pages.mjs")], { cwd: temp, stdio: "ignore" });
    const afterFirst = new Map(filesUnder(siteCopy).map((path) => [path, readFileSync(join(siteCopy, path))]));
    execFileSync(process.execPath, [join(temp, "tools", "generate-pages.mjs")], { cwd: temp, stdio: "ignore" });
    const afterSecond = new Map(filesUnder(siteCopy).map((path) => [path, readFileSync(join(siteCopy, path))]));

    assert.deepEqual(afterSecond, afterFirst);
    const changed = [...afterFirst]
      .filter(([path, contents]) => !before.get(path)?.equals(contents))
      .map(([path]) => path);
    assert.deepEqual(changed, []);
  } finally {
    rmSync(temp, { recursive: true, force: true });
  }
});
