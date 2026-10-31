import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { createFamilyHotelPages } from "./page-generation/family-hotel-pages.mjs";
import { stripSiteChrome } from "./page-generation/site-chrome.mjs";

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
  assert.match(html, /<h1>Las Vegas Family Hotels<\/h1>/);
  assert.match(html, /<link rel="canonical" href="https:\/\/familytripwise\.com\/where-to-stay\/las-vegas-family-hotels\.html">/);
  assert.doesNotMatch(html, /<meta[^>]+name="robots"[^>]+noindex/i);
  assert.equal((sitemap.match(/https:\/\/familytripwise\.com\/where-to-stay\/las-vegas-family-hotels\.html/g) || []).length, 1);
  for (const name of names) assert.ok(html.includes(name), `missing ${name}`);
  assert.equal((html.match(/<article class="detail-card hotel-card"[^>]*>/g) || []).length, 10);
  assert.equal((html.match(/<h4>Themes in sampled online reviews<\/h4>/g) || []).length, 10);
  assert.equal((html.match(/https:\/\/www\.google\.com\/maps\/search\/\?api=1&amp;query=/g) || []).length, 20);
  // Q18 (2026-10-31): the editorial bands are retired; each hotel shows Check live rate plus its observed July 22 sample.
  assert.match(html, /<th>Nightly price \(USD\/room\)<\/th>/);
  assert.match(html, /Some examples were for two adults; the party and exact room are unknown for others/);
  assert.match(html, /Earlier wider ranges are gone because their upper ends were never observed/);
  assert.match(html, /No current family-room rate observed/);
  assert.ok(html.indexOf("No current family-room rate observed") < html.indexOf('<table class="comparison-table hotel-comparison">'));
  assert.equal((html.match(/<dt>Nightly price \(USD\/room\)<\/dt>/g) || []).length, 10);
  assert.equal((html.match(/These older room-rate examples are not a current or five-person suite quote/g) || []).length, 10);
  assert.doesNotMatch(html, /\$\d[\d,]*-\$\d[\d,]*\+|planning band|Planning USD/);
  const expectedSamples = ["about $106 total", "about $351 total", "about $147 total; a high-date private-residence listing showed about $471", "low to mid $200s before tax; about $676 for a high date or larger villa", "about $129 total", null, "about $58 total", "about $79 total", "about $134 including fees, tax not stated; Booking.com showed about $278 plus tax", "about $219 total"];
  const table = html.match(/<table class="comparison-table hotel-comparison">([\s\S]*?)<\/table>/)[1];
  assert.deepEqual([...table.matchAll(/<td>Check live rate<br><small>([^<]+)<\/small><\/td>/g)].map((match) => match[1].replaceAll("&#39;", "'")),
    expectedSamples.map((sample) => sample ? `Older sample: ${sample} (Jul 22)` : "No older figure shown (its sample was for a July 27 stay)"));
  // Every figure shown must be in the July 22 evidence pack's price table.
  const pack = readFileSync(join(root, "docs", "research", "las-vegas-family-hotel-evidence-pack.md"), "utf8");
  const priceTable = pack.slice(pack.indexOf("## Price Evidence"), pack.indexOf("## Candidate Decisions"));
  for (const figure of expectedSamples.filter(Boolean).flatMap((sample) => sample.match(/\$\d+s?/g))) assert.ok(priceTable.includes(`\`${figure}\``), `figure not in pack: ${figure}`);
  assert.doesNotMatch(table, /\$119/, "a sample whose stay date has passed is not shown");
  for (const card of html.matchAll(/<article class="detail-card hotel-card"[^>]*>([\s\S]*?)<\/article>/g)) {
    const priceContext = card[1].match(/<section><h4>Price context and key check<\/h4>([\s\S]*?)<\/section>/)[1];
    assert.match(priceContext, /July 22/);
    assert.doesNotMatch(priceContext, /\b(recent|current) public/i);
  }
  assert.doesNotMatch(html, /rough total nightly price|Rough total\/night/);
  assert.match(html, /Hotel facts, prices, and review sources checked:<\/strong> July 22, 2026/);
  assert.match(html, /Hilton says cribs and confirmed connecting rooms are unavailable, while Expedia lists free cribs on request/);
  assert.match(html, /images\/las-vegas-bellagio-fountains\.webp/);
  assert.match(html, /width="1600" height="1062"/);
  assert.match(html, /Chensiyuan/);
  assert.match(html, /creativecommons\.org\/licenses\/by-sa\/4\.0\//);
  assert.match(html, /CC BY-SA 4\.0<\/a>\. Resized and cropped\.<\/figcaption>/);
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
  const priceAnswer = faq.mainEntity.find((item) => item.name.includes("resort fees and taxes")).acceptedAnswer.text;
  assert.match(priceAnswer, /some used two adults, and every recorded stay date has passed/);
  assert.ok(visible.includes(priceAnswer));
  for (const item of itemList.itemListElement) assert.match(item.description, /no current family-room rate observed \(check live rate\); (older sample .*, seen July 22, 2026|no older figure shown because its only sample was for a past stay); not a current five-person suite quote/);
});

test("routes from home, the stay guide, and the activity decision flow", () => {
  const home = stripSiteChrome(readFileSync(join(root, "site", "index.html"), "utf8"));
  const stay = stripSiteChrome(readFileSync(join(root, "site", "where-to-stay", "las-vegas-with-kids.html"), "utf8"));
  const activity = stripSiteChrome(readFileSync(join(root, "site", "things-to-do", "las-vegas-with-kids.html"), "utf8"));

  assert.match(home, /href="\.\/where-to-stay\/las-vegas-family-hotels\.html"/);
  assert.match(stay, /href="\.\/las-vegas-family-hotels\.html"/);
  assert.equal((activity.match(/href="\.\.\/where-to-stay\/las-vegas-family-hotels\.html"/g) || []).length, 1);
});

test("surfaces three source-backed five-plus starts without implying price or availability", () => {
  const html = readFileSync(pagePath, "utf8");
  const snapshot = html.match(/<dl class="snapshot"[^>]*>([\s\S]*?)<\/dl>/)[1];
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
  assert.match(branch, /same-date five-guest totals, not older July room samples/);
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

test("exports the same ten hotels with dated price and capacity limits", () => {
  const esc = (value) => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
  const pages = createFamilyHotelPages({ esc, pageShell: ({ body }) => body });
  const html = readFileSync(pagePath, "utf8");
  const csv = readFileSync(join(root, "site", "downloads", "las-vegas-family-hotels.csv"), "utf8");
  const rows = csv.trimEnd().split("\n").map((line) => [...line.matchAll(/"((?:[^"]|"")*)"(?:,|$)/g)].map((match) => match[1].replaceAll('""', '"')));

  assert.equal(csv, pages.lasVegasHotelComparisonCsv());
  assert.equal(rows.length, 11);
  assert.equal(rows[0].length, 15);
  assert.ok(rows.every((row) => row.length === 15));
  assert.ok(rows.slice(1).every((row) => row[3] === "Check live rate"));
  assert.equal(rows.slice(1).filter((row) => row[8] === "September 16, 2026").length, 4);
  for (const row of rows.slice(1)) {
    assert.ok(row[4] && html.includes(esc(row[4]).replaceAll("'", "&#39;")) || html.includes(esc(row[4])), `CSV sample not on page: ${row[4]}`);
    assert.equal(row[5], "2026-07-22");
    assert.match(row[6], /Some examples were for two adults; the party and exact room are unknown for others/);
    assert.match(row[6], /no figure is a current quote or a family-room price/);
    assert.equal(row[14], "https://familytripwise.com/where-to-stay/las-vegas-family-hotels.html#hotel-comparison");
    assert.ok(html.includes(esc(row[0])));
  }
  assert.match(html, /<section id="hotel-comparison" class="band" data-glance-first>/);
  assert.match(html, /href="\.\.\/downloads\/las-vegas-family-hotels\.csv" download/);
  assert.match(html, /href="https:\/\/familytripwise\.com\/where-to-stay\/las-vegas-family-hotels\.html#hotel-comparison"/);
});
