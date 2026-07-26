import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { cpSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const pagePath = join(root, "site", "where-to-stay", "new-york-city-family-hotels.html");

function schemas(html) {
  return [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((match) => JSON.parse(match[1]));
}

function filesUnder(directory, base = directory) {
  return readdirSync(directory).flatMap((name) => {
    const path = join(directory, name);
    return statSync(path).isDirectory() ? filesUnder(path, base) : [relative(base, path)];
  });
}

test("publishes one canonical 12-hotel New York City comparison", () => {
  const html = readFileSync(pagePath, "utf8");
  const sitemap = readFileSync(join(root, "site", "sitemap.xml"), "utf8");
  const names = [
    "Hotel Beacon",
    "Homewood Suites by Hilton New York/Midtown Manhattan Times Square-South",
    "Residence Inn by Marriott New York Manhattan/Central Park",
    "Radio City Apartments",
    "Embassy Suites by Hilton New York Manhattan Times Square",
    "TRYP by Wyndham New York City Times Square / Midtown",
    "The Kimberly Hotel",
    "New York Marriott Marquis",
    "Conrad New York Downtown",
    "Lotte New York Palace",
    "1 Hotel Brooklyn Bridge",
    "Four Seasons Hotel New York Downtown"
  ];

  assert.match(html, /<title>Top Family Hotels in New York City: 12 Options by Trip Style<\/title>/);
  assert.match(html, /<h1>Top Family Hotels in New York City: 12 Options by Trip Style<\/h1>/);
  assert.match(html, /<link rel="canonical" href="https:\/\/familytripwise\.com\/where-to-stay\/new-york-city-family-hotels\.html">/);
  assert.doesNotMatch(html, /<meta[^>]+name="robots"[^>]+noindex/i);
  assert.equal((sitemap.match(/https:\/\/familytripwise\.com\/where-to-stay\/new-york-city-family-hotels\.html/g) || []).length, 1);
  for (const name of names) assert.ok(html.includes(name), `missing ${name}`);
  assert.equal((html.match(/<article class="detail-card hotel-card">/g) || []).length, 12);
  assert.equal((html.match(/<h4>Themes in sampled online reviews<\/h4>/g) || []).length, 12);
  assert.equal((html.match(/https:\/\/www\.google\.com\/maps\/search\/\?api=1&amp;query=/g) || []).length, 24);
  assert.match(html, /Rough total\/night, not a quote/);
  assert.match(html, /Hotel facts, prices, and review sources checked:<\/strong> July 25, 2026/);
  assert.match(html, /Do not assume the classic Embassy Suites two-room layout/);
  assert.match(html, /Hilton lists cribs among the amenities/);
  assert.doesNotMatch(html, /no-crib/i);
  assert.match(html, /not a default family of four/);
  assert.match(html, /most public slices did not expose a reliable family-only count/);
  assert.match(html, /upper edges are editorial planning ceilings, not observed quotes/);
  assert.match(html, /srcset="[^"]+width=640 640w,[^"]+width=1200 1200w"/);
  assert.match(html, /public domain via/);
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
  const stay = readFileSync(join(root, "site", "where-to-stay", "new-york-city-with-kids.html"), "utf8");
  const activity = readFileSync(join(root, "site", "things-to-do", "new-york-city-with-kids.html"), "utf8");

  assert.match(home, /href="\.\/where-to-stay\/new-york-city-family-hotels\.html"/);
  assert.match(stay, /href="(?:\.\/|\.\.\/where-to-stay\/)new-york-city-family-hotels\.html"/);
  assert.doesNotMatch(activity, /new-york-city-family-hotels\.html/);
});

test("full generation is idempotent and leaves current output unchanged", () => {
  const temp = mkdtempSync(join(tmpdir(), "family-tripwise-nyc-hotels-"));
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
