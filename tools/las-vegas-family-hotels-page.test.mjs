import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { createFamilyHotelPages } from "./page-generation/family-hotel-pages.mjs";
import { stripSiteChrome } from "./page-generation/site-chrome.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const pagePath = join(root, "site", "where-to-stay", "las-vegas-family-hotels.html");

// The Jan 22 weekend leaves the page Jan 15, 2027 (a week before arrival); holiday tables leave Dec 18 and Dec 25.
const buildDay = process.env.FT_BUILD_DATE || new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York" }).format(new Date());
const weekendLive = buildDay < "2027-01-15";

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
  assert.equal((html.match(/<details class="detail-card hotel-card"[^>]*>/g) || []).length, 10);
  assert.equal((html.match(/<h4>Themes in online reviews sampled July 2026<\/h4>/g) || []).length, 10);
  assert.equal((html.match(/https:\/\/www\.google\.com\/maps\/search\/\?api=1&amp;query=/g) || []).length, 20);
  // G18 (D39): a Fri-Sun weekend for 2 adults + kids 5 and 8; figures tested in tools/las-vegas-weekend-prices.test.mjs.
  assert.match(html, /<th>Weekend price \(family of 4\)<\/th>/);
  if (weekendLive) assert.match(html, /Google Hotels listing prices per night for 2 adults \+ kids 5 and 8/);
  if (weekendLive) assert.ok(html.indexOf("Cheapest first where both nights were priced") < html.indexOf('<table class="comparison-table hotel-comparison">'));
  assert.equal((html.match(/<dt>Weekend price \(family of 4\)<\/dt>/g) || []).length, 10);
  assert.equal((html.match(/Google prices are listing prices for 2 adults and 2 kids, not a quote or a five-person suite price/g) || []).length, 10);
  assert.doesNotMatch(html, /\$\d[\d,]*-\$\d[\d,]*\+|planning band|Planning USD|Older sample\b|\(Jul 22\)|\$106\b|\$119\b/);
  for (const card of html.matchAll(/<details class="detail-card hotel-card"[^>]*>([\s\S]*?)<\/details>/g)) {
    const priceContext = card[1].match(/<section><h4>Price context and key check<\/h4>([\s\S]*?)<\/section>/)[1];
    assert.doesNotMatch(priceContext, /\b(recent|current) public|July 22 public/i);
  }
  assert.doesNotMatch(html, /rough total nightly price|Rough total\/night/);
  if (weekendLive) assert.match(html, /Google family prices seen:<\/strong> November 5, 2026/);
  assert.match(html, /Older:<\/strong> Mandalay Bay, Vdara, Excalibur, New York-New York and the Hilton room page, from July 22, 2026/);
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
  if (weekendLive) assert.match(priceAnswer, /Google Hotels listing prices per night for 2 adults and kids 5 and 8, Fri–Sun, Jan 22–24, 2027, seen November 5, 2026/);
  assert.ok(visible.includes(priceAnswer));
  for (const item of itemList.itemListElement) assert.match(item.description, /(; Google Hotels listing (≈ )?\$[\d,]+ per night(, (Friday|Saturday) only)? for 2 adults \+ kids 5 and 8 \(Fri–Sun, Jan 22–24, 2027\), seen November 5, 2026; estimate, not a quote|no current family-of-4 price shown; check live rate)$/);
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
  assert.equal((rendered.match(/<th>/g) || []).length, 6 + 4 * (buildDay < "2026-12-18" ? 2 : buildDay < "2026-12-25" ? 1 : 0)); // comparison + each live holiday table
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
  assert.equal(rows[0].length, 17);
  assert.ok(rows.every((row) => row.length === 17));
  assert.equal(rows.slice(1).filter((row) => row[10] === "September 16, 2026").length, 4);
  for (const row of rows.slice(1)) {
    if (weekendLive) assert.match(row[3], /^((≈ )?\$[\d,]+ per night|No price shown on Nov 5)/);
    assert.equal(row[6], "2 adults + kids 5 and 8");
    assert.equal(row[7], "November 5, 2026");
    if (weekendLive) assert.match(row[8], /these are estimates, not quotes or family-suite prices/);
    assert.equal(row[16], "https://familytripwise.com/where-to-stay/las-vegas-family-hotels.html#hotel-comparison");
    assert.ok(html.includes(esc(row[0])));
  }
  assert.match(html, /<section id="hotel-comparison" class="band" data-glance-first>/);
  assert.match(html, /href="\.\.\/downloads\/las-vegas-family-hotels\.csv" download/);
  assert.match(html, /href="https:\/\/familytripwise\.com\/where-to-stay\/las-vegas-family-hotels\.html#hotel-comparison"/);
});
