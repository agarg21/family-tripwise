import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { createFamilyHotelPages } from "./page-generation/family-hotel-pages.mjs";

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

test("routes from home, the stay guide, and the activity decision flow", () => {
  const home = readFileSync(join(root, "site", "index.html"), "utf8");
  const stay = readFileSync(join(root, "site", "where-to-stay", "las-vegas-with-kids.html"), "utf8");
  const activity = readFileSync(join(root, "site", "things-to-do", "las-vegas-with-kids.html"), "utf8");

  assert.match(home, /href="\.\/where-to-stay\/las-vegas-family-hotels\.html"/);
  assert.match(stay, /href="\.\/las-vegas-family-hotels\.html"/);
  assert.equal((activity.match(/href="\.\.\/where-to-stay\/las-vegas-family-hotels\.html"/g) || []).length, 1);
});

test("surfaces three source-backed five-plus starts without implying price or availability", () => {
  const html = readFileSync(pagePath, "utf8");
  const snapshot = html.match(/<dl class="snapshot">([\s\S]*?)<\/dl>/)[1];
  const branch = snapshot.match(/<div><dt>Five or more<\/dt><dd>([\s\S]*?)<\/dd><\/div>/)[1];
  assert.equal((snapshot.match(/<dt>/g) || []).length, 4);
  assert.equal((branch.match(/<a /g) || []).length, 3);
  for (const [label, capacity] of [
    ["Grand Chateau two-king two-bedroom villa", "up to eight guests"],
    ["Tahiti Village Royal Tahitian", "up to eight guests"],
    ["Cancun two-bedroom suite", "four to six guests"]
  ]) {
    assert.ok(branch.includes(`${label}</a> (${capacity})`));
    assert.ok(html.includes(`${label} is listed for ${capacity}.`));
  }
  assert.match(branch, /Vdara: two-bedroom luxury suite or two rooms/);
  assert.match(branch, /same-date five-guest totals, not July room ranges/);
  assert.ok(html.indexOf(snapshot) < html.indexOf("Trip-style starts"));
  assert.equal((html.match(/Room capacity checked September 16, 2026/g) || []).length, 4);
  assert.equal((html.match(/>Official room record<\/a>/g) || []).length, 4);
  assert.match(html, /Studios and one-bedroom suites max at four/);
  assert.match(html, /Vdara two-bedroom luxury suite is listed for up to six guests/);
  assert.doesNotMatch(html, /luxury suites is listed/);
  assert.match(html, /two rooms without assuming they connect/);
  assert.match(html, /two-king, two-sofa-bed category has two bathrooms and does not permit cribs or rollaways/);
  assert.match(html, /Four room-capacity records spot-checked:<\/strong> September 16, 2026/);
  assert.match(html, /This does not renew prices or other hotel facts/);
  assert.doesNotMatch(branch, /\$|guaranteed|available for your dates|best for every family/i);
});

test("renders the page from the same hotel room records used in the branch", () => {
  const esc = (value) => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
  const pages = createFamilyHotelPages({ esc, pageShell: ({ body }) => body });
  const rendered = pages.lasVegasFamilyHotelPage();
  assert.ok(readFileSync(pagePath, "utf8").includes(rendered), "generated body differs from the record renderer");
  assert.equal((rendered.match(/<article class="quick-pick">/g) || []).length, 5);
  assert.equal((rendered.match(/<th>/g) || []).length, 6);
  for (const source of [
    "https://vdara.mgmresorts.com/en/hotel.html",
    "https://www.marriott.com/en-us/hotels/lasvg-marriotts-grand-chateau/rooms/",
    "https://tahitivillage.com/booknow/",
    "https://www.hiltongrandvacations.com/en/resorts-and-destinations/las-vegas/cancun-las-vegas-a-hilton-vacation-club"
  ]) assert.ok(rendered.includes(`href="${source}">Official room record</a>`));
});
