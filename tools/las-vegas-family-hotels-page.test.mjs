import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const pagePath = join(root, "site", "where-to-stay", "las-vegas-family-hotels.html");

function schemas(html) {
  return [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((match) => JSON.parse(match[1]));
}

test("publishes one canonical ten-hotel Las Vegas comparison", () => {
  const html = readFileSync(pagePath, "utf8");
  const sitemap = readFileSync(join(root, "site", "sitemap.xml"), "utf8");
  const names = [
    "Mandalay Bay Resort and Casino",
    "Four Seasons Hotel Las Vegas",
    "Vdara Hotel &amp; Spa",
    "Marriott's Grand Chateau",
    "Tahiti Village Resort",
    "Hilton Vacation Club Cancun Resort Las Vegas",
    "Excalibur Hotel &amp; Casino",
    "New York-New York Hotel &amp; Casino",
    "Las Vegas Hilton at Resorts World",
    "Red Rock Casino Resort &amp; Spa"
  ];

  assert.match(html, /<title>Top Family Hotels in Las Vegas: 10 Options by Trip Style<\/title>/);
  assert.match(html, /<h1>Top Family Hotels in Las Vegas: 10 Options by Trip Style<\/h1>/);
  assert.match(html, /<link rel="canonical" href="https:\/\/familytripwise\.com\/where-to-stay\/las-vegas-family-hotels\.html">/);
  assert.doesNotMatch(html, /<meta[^>]+name="robots"[^>]+noindex/i);
  assert.equal((sitemap.match(/https:\/\/familytripwise\.com\/where-to-stay\/las-vegas-family-hotels\.html/g) || []).length, 1);
  for (const name of names) assert.ok(html.includes(name), `missing ${name}`);
  assert.equal((html.match(/<article class="detail-card hotel-card">/g) || []).length, 10);
  assert.equal((html.match(/<h4>Themes in sampled online reviews<\/h4>/g) || []).length, 10);
  assert.equal((html.match(/https:\/\/www\.google\.com\/maps\/search\/\?api=1&amp;query=/g) || []).length, 20);
  assert.match(html, /Rough total\/night, not a quote/);
  assert.match(html, /Hotel facts, prices, and review sources checked:<\/strong> July 22, 2026/);
  assert.match(html, /\$120-\$320\+/);
  assert.match(html, /Hilton says cribs and confirmed connecting rooms are unavailable, while Expedia lists free cribs on request/);
  assert.match(html, /1280px-Bellagio_fountain_show_2010_las_vegas\.JPG/);
  assert.match(html, /width="1280" height="850"/);
  assert.match(html, /Chensiyuan/);
  assert.match(html, /creativecommons\.org\/licenses\/by-sa\/4\.0\//);
  assert.match(html, /No editorial changes; Wikimedia serves this resized preview/);
  assert.doesNotMatch(html, /Special:Redirect\/file\/Bellagio/);
  assert.doesNotMatch(html, /review[- ]signal/i);
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
  const stay = readFileSync(join(root, "site", "where-to-stay", "las-vegas-with-kids.html"), "utf8");
  const activity = readFileSync(join(root, "site", "things-to-do", "las-vegas-with-kids.html"), "utf8");

  assert.match(home, /href="\.\/where-to-stay\/las-vegas-family-hotels\.html"/);
  assert.match(stay, /href="\.\.\/where-to-stay\/las-vegas-family-hotels\.html"/);
  assert.doesNotMatch(activity, /las-vegas-family-hotels\.html/);
});
