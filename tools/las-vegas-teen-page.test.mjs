import assert from "node:assert/strict";
import { cpSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { upgradePriorityPages } from "./upgrade-priority-pages.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const target = "things-to-do/las-vegas-with-teens.html";
const access = JSON.parse(readFileSync(join(root, "docs/research/las-vegas-teen-access-2026-10-09.json"), "utf8"));

function schemas(html) {
  return [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((match) => JSON.parse(match[1]));
}

function filesUnder(directory, base = directory) {
  return readdirSync(directory).flatMap((name) => {
    const path = join(directory, name);
    return statSync(path).isDirectory() ? filesUnder(path, base) : [relative(base, path)];
  });
}

test("keeps one canonical, indexable eight-choice teen page", () => {
  const html = readFileSync(join(root, "site", target), "utf8");
  const sitemap = readFileSync(join(root, "site", "sitemap.xml"), "utf8");
  const names = [
    "AREA15 / one exact experience",
    "Red Rock Canyon Scenic Drive",
    "Big Apple Coaster and Arcade",
    "High Roller observation wheel",
    "Pinball Hall of Fame",
    "Neon Museum",
    "Bellagio Conservatory and fountains",
    "Sphere film experience or selected event"
  ];

  assert.match(html, /<title>Things to Do in Las Vegas With Teens: 8 Picks by Trip Style<\/title>/);
  assert.match(html, /<h1>Things to Do in Las Vegas With Teens: 8 Picks by Trip Style<\/h1>/);
  assert.match(html, /<link rel="canonical" href="https:\/\/familytripwise\.com\/things-to-do\/las-vegas-with-teens\.html">/);
  assert.doesNotMatch(html, /<meta[^>]+name="robots"[^>]+noindex/i);
  assert.equal((sitemap.match(/https:\/\/familytripwise\.com\/things-to-do\/las-vegas-with-teens\.html/g) || []).length, 1);
  assert.match(html, /Attraction facts and official sources checked:<\/strong> July 22, 2026/);
  for (const name of names) assert.ok(html.includes(name), `missing ${name}`);
  assert.equal((html.match(/<tbody>[\s\S]*?<\/tbody>/)?.[0].match(/<tr>/g) || []).length, 8);
});

test("uses one compact teen-specific decision flow without the old duplicate shortlist", () => {
  const html = readFileSync(join(root, "site", target), "utf8");

  assert.equal((html.match(/<article class="quick-pick">/g) || []).length, 5);
  assert.equal((html.match(/<article class="detail-card">/g) || []).length, 5);
  assert.equal((html.match(/<article class="plan-card">/g) || []).length, 4);
  assert.match(html, /Why it earns teen space/);
  assert.match(html, /let the teen choose the trip's anchor/i);
  assert.doesNotMatch(html, /Hotel pool day|Age-appropriate show|Best overall|Best-fit activities for teens/i);
  assert.doesNotMatch(html, /<h4>Pair nearby<\/h4><p><\/p>/);
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
    "Big Apple Coaster requires a current 54-inch minimum",
    "City youth-curfew guide",
    "las-vegas-family-hotels.html",
    "1280px-Bellagio_fountain_show_2010_las_vegas.JPG",
    "Chensiyuan",
    "creativecommons.org/licenses/by-sa/4.0/"
  ]) assert.match(html, new RegExp(required));

  assert.doesNotMatch(html, /Hilton Grand Vacations Club Paradise|Mandalay Bay FAQ|Discovery Children&#39;s Museum/);
});

test("priority regeneration is idempotent and changes no unrelated site file", () => {
  const temp = mkdtempSync(join(tmpdir(), "family-tripwise-las-vegas-teen-"));
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

test("maintains source-dated district policy without inferred event or evening eligibility", () => {
  assert.equal(access.observed_on, "2026-10-09");
  assert.equal(access.evidence_class, "OFFICIAL_VENUE_POLICY");
  assert.equal(access.sources.length, 2);
  assert.ok(access.sources.every(source => source.observed_on === access.observed_on && source.published_on === null));
  assert.equal(access.family_task.human_tested, false);
  assert.match(access.family_task.result, /Neither teen qualifies for an unaccompanied visit/);
  assert.ok(access.unknowns.some(value => value.includes("No numeric evening cutoff")));
  assert.equal(access.next_review_due, "2026-11-08");
});

test("visible comparison, access check and FAQ schema use the same maintained policy copy", () => {
  const html = readFileSync(join(root, "site", target), "utf8");
  for (const copy of Object.values(access.public_copy)) assert.ok(html.includes(copy), copy);
  for (const source of access.sources) assert.ok(html.includes(`href="${source.url}"`));
  const faq = schemas(html).find(block => block["@type"] === "FAQPage");
  assert.equal(faq.mainEntity.find(item => item.name === "Can teenagers explore Las Vegas on their own?").acceptedAnswer.text, access.public_copy.faq);
  assert.match(html, /Other attraction and city sources checked July 22, 2026/);
  assert.match(html, /AREA15 adult-accompaniment policy separately checked October 9, 2026/);
  assert.doesNotMatch(html, /21\+ after|21 or older after|after 9\s*(?:pm|p\.m\.)|all attraction.*checked October 9/i);
});
