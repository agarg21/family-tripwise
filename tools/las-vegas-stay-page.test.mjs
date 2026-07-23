import assert from "node:assert/strict";
import { cpSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { upgradePriorityPages } from "./upgrade-priority-pages.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const target = "where-to-stay/las-vegas-with-kids.html";

function schemas(html) {
  return [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((match) => JSON.parse(match[1]));
}

function filesUnder(directory, base = directory) {
  return readdirSync(directory).flatMap((name) => {
    const path = join(directory, name);
    return statSync(path).isDirectory() ? filesUnder(path, base) : [relative(base, path)];
  });
}

test("keeps one canonical, indexable five-base Las Vegas stay page", () => {
  const html = readFileSync(join(root, "site", target), "utf8");
  const sitemap = readFileSync(join(root, "site", "sitemap.xml"), "utf8");

  assert.match(html, /<title>Where to Stay in Las Vegas With Kids: 5 Base Types Compared<\/title>/);
  assert.match(html, /<h1>Where to Stay in Las Vegas With Kids: 5 Base Types Compared<\/h1>/);
  assert.match(html, /<link rel="canonical" href="https:\/\/familytripwise\.com\/where-to-stay\/las-vegas-with-kids\.html">/);
  assert.doesNotMatch(html, /<meta[^>]+name="robots"[^>]+noindex/i);
  assert.equal((sitemap.match(/https:\/\/familytripwise\.com\/where-to-stay\/las-vegas-with-kids\.html/g) || []).length, 1);
  assert.match(html, /Area and transport sources checked:<\/strong> July 22, 2026/);
  assert.equal((html.match(/<tbody>[\s\S]*?<\/tbody>/)?.[0].match(/<tr>/g) || []).length, 5);

  for (const required of ["Center Strip", "South Strip", "Near-Strip suite base", "West side / Summerlin", "Downtown / Fremont"]) {
    assert.match(html, new RegExp(required));
  }
});

test("uses one compact area-to-hotel decision flow without duplicate hotel profiles", () => {
  const html = readFileSync(join(root, "site", target), "utf8");

  assert.equal((html.match(/<article class="quick-pick">/g) || []).length, 5);
  assert.equal((html.match(/<article class="detail-card research-card">/g) || []).length, 3);
  assert.equal((html.match(/<article class="activity-card faq-card">/g) || []).length, 3);
  assert.match(html, /Compare the base before the hotel/);
  assert.match(html, /10 family hotel options/);
  assert.match(html, /las-vegas-family-hotels\.html/);

  for (const blocked of [
    "Stay candidates to investigate",
    "Area hypotheses by family need",
    "Research-backed hotel verification notes",
    "Official-source checks before you book",
    "<h3>Mandalay Bay</h3>",
    "<h3>Vdara Hotel &amp; Spa</h3>",
    "<h3>Hilton Grand Vacations Club Paradise Las Vegas</h3>",
    "Total-fee check",
    "Room-assignment check",
    "Best overall area",
    "Best family compromise",
    "South Strip is often the best compromise"
  ]) {
    assert.doesNotMatch(html, new RegExp(blocked, "i"));
  }
});

test("aligns visible FAQ, schema, image attribution, sources, and cluster routes", () => {
  const html = readFileSync(join(root, "site", target), "utf8");
  const blocks = schemas(html);
  const itemList = blocks.find((block) => block["@type"] === "ItemList");
  const faq = blocks.find((block) => block["@type"] === "FAQPage");

  assert.equal(itemList.name, "Las Vegas family stay base options");
  assert.equal(itemList.itemListElement.length, 5);
  assert.equal(faq.mainEntity.length, 3);
  const visible = html.slice(0, html.indexOf('<script type="application/ld+json">'));
  for (const question of faq.mainEntity.map((item) => item.name)) {
    assert.ok(visible.includes(`<h3>${question}</h3>`), `FAQ is not visible: ${question}`);
  }

  for (const required of [
    "las-vegas-family-hotels.html",
    "las-vegas-with-teens.html",
    "family-itinerary/las-vegas-with-kids.html",
    "www.lvmonorail.com/route-map/",
    "www.rtcsnv.com/ways-to-travel/transit/",
    "1280px-Bellagio_fountain_show_2010_las_vegas.JPG",
    "Chensiyuan",
    "creativecommons.org/licenses/by-sa/4.0/"
  ]) assert.match(html, new RegExp(required));
});

test("regeneration is idempotent and changes no unrelated site file", () => {
  const temp = mkdtempSync(join(tmpdir(), "family-tripwise-las-vegas-"));
  const copy = join(temp, "site");
  cpSync(join(root, "site"), copy, { recursive: true });

  try {
    const before = new Map(filesUnder(copy).map((path) => [path, readFileSync(join(copy, path))]));
    upgradePriorityPages(copy);
    const afterFirst = new Map(filesUnder(copy).map((path) => [path, readFileSync(join(copy, path))]));
    upgradePriorityPages(copy);
    const afterSecond = new Map(filesUnder(copy).map((path) => [path, readFileSync(join(copy, path))]));

    assert.deepEqual(afterSecond, afterFirst);
    const changed = [...afterFirst].filter(([path, contents]) => !before.get(path)?.equals(contents)).map(([path]) => path);
    assert.deepEqual(changed, []);
  } finally {
    rmSync(temp, { recursive: true, force: true });
  }
});
