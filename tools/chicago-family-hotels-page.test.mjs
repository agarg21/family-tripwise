import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { cpSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const pagePath = join(root, "site", "where-to-stay", "chicago-family-hotels.html");

function schemas(html) {
  return [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((match) => JSON.parse(match[1]));
}

function filesUnder(directory, base = directory) {
  return readdirSync(directory).flatMap((name) => {
    const path = join(directory, name);
    return statSync(path).isDirectory() ? filesUnder(path, base) : [relative(base, path)];
  });
}

test("publishes one canonical ten-hotel Chicago comparison", () => {
  const html = readFileSync(pagePath, "utf8");
  const sitemap = readFileSync(join(root, "site", "sitemap.xml"), "utf8");
  const names = [
    "Embassy Suites by Hilton Chicago Downtown Magnificent Mile",
    "Homewood Suites by Hilton Chicago-Downtown",
    "Residence Inn Chicago Downtown/River North",
    "Sable at Navy Pier Chicago, Curio Collection by Hilton",
    "Swissotel Chicago",
    "InterContinental Chicago Magnificent Mile",
    "Hilton Chicago",
    "Hotel Zachary Chicago, a Tribute Portfolio Hotel",
    "Four Seasons Hotel Chicago",
    "The Langham, Chicago"
  ];

  assert.match(html, /<title>Top Family Hotels in Chicago: 10 Options by Trip Style<\/title>/);
  assert.match(html, /<h1>Top Family Hotels in Chicago: 10 Options by Trip Style<\/h1>/);
  assert.match(html, /<link rel="canonical" href="https:\/\/familytripwise\.com\/where-to-stay\/chicago-family-hotels\.html">/);
  assert.doesNotMatch(html, /<meta[^>]+name="robots"[^>]+noindex/i);
  assert.equal((sitemap.match(/https:\/\/familytripwise\.com\/where-to-stay\/chicago-family-hotels\.html/g) || []).length, 1);
  for (const name of names) assert.ok(html.includes(name), `missing ${name}`);
  assert.equal((html.match(/<article class="detail-card hotel-card">/g) || []).length, 10);
  assert.equal((html.match(/<h4>Themes in sampled online reviews<\/h4>/g) || []).length, 10);
  assert.equal((html.match(/https:\/\/www\.google\.com\/maps\/search\/\?api=1&amp;query=/g) || []).length, 20);
  assert.match(html, /Rough total\/night, not a quote/);
  assert.match(html, /Hotel facts, prices, and review sources checked:<\/strong> July 23, 2026/);
  assert.match(html, /temporary August 10-12, 2026 pool closure/);
  assert.match(html, /current dedicated Kids Suite page says the play space is open daily, while an older overview still says suspended/);
  assert.match(html, /current public example was about \$308 including taxes and fees/);
  assert.match(html, /1280px-Millennium_park%2Cchicago\.JPG/);
  assert.match(html, /width="1280" height="960"/);
  assert.match(html, /Behnazkhazai/);
  assert.match(html, /creativecommons\.org\/licenses\/by-sa\/3\.0\//);
  assert.doesNotMatch(html, /Special:Redirect\/file\/Millennium/);
  assert.doesNotMatch(html, /review[- ]signal/i);
  assert.doesNotMatch(html, /recur positively|recur as conflicts/i);
  assert.doesNotMatch(html, /no pool or included breakfast/i);
  assert.doesNotMatch(html, /personally stayed|safest|quietest|best overall/i);
});

test("keeps visible FAQ and schema aligned", () => {
  const html = readFileSync(pagePath, "utf8");
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
});

test("routes from home and the existing stay guide without changing the activity page", () => {
  const home = readFileSync(join(root, "site", "index.html"), "utf8");
  const stay = readFileSync(join(root, "site", "where-to-stay", "chicago-with-kids.html"), "utf8");
  const activity = readFileSync(join(root, "site", "things-to-do", "chicago-with-kids.html"), "utf8");

  assert.match(home, /href="\.\/where-to-stay\/chicago-family-hotels\.html"/);
  assert.match(stay, /href="(?:\.\/|\.\.\/where-to-stay\/)chicago-family-hotels\.html"/);
  assert.doesNotMatch(activity, /chicago-family-hotels\.html/);
});

test("full generation is idempotent and leaves unrelated output unchanged", () => {
  const temp = mkdtempSync(join(tmpdir(), "family-tripwise-chicago-hotels-"));
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
