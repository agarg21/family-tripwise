import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { cpSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { createFamilyHotelPages } from "./page-generation/family-hotel-pages.mjs";
import { stripSiteChrome } from "./page-generation/site-chrome.mjs";
import { easternDate } from "./page-generation/sitemap.mjs";

// Q17b: the Google Hotels family listings leave the committed page on 2027-01-08 (tools/nyc-google-sample.test.mjs).
const listingsLive = (process.env.FT_BUILD_DATE || easternDate()) < "2027-01-08";

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
  assert.match(html, /<h1>New York City Family Hotels<\/h1>/);
  assert.match(html, /<link rel="canonical" href="https:\/\/familytripwise\.com\/where-to-stay\/new-york-city-family-hotels\.html">/);
  assert.doesNotMatch(html, /<meta[^>]+name="robots"[^>]+noindex/i);
  assert.equal((sitemap.match(/https:\/\/familytripwise\.com\/where-to-stay\/new-york-city-family-hotels\.html/g) || []).length, 1);
  for (const name of names) assert.ok(html.includes(name), `missing ${name}`);
  assert.equal((html.match(/<details class="detail-card hotel-card" id="nyc-hotel-\d+"/g) || []).length, 12);
  assert.equal((html.match(/<h4>Themes in sampled online reviews<\/h4>/g) || []).length, 12);
  assert.equal((html.match(/https:\/\/www\.google\.com\/maps\/search\/\?api=1&amp;query=/g) || []).length, 24);
  assert.match(html, /Hotel facts and review sources checked:<\/strong> July 25, 2026/);
  assert.match(html, /Do not assume the classic Embassy Suites two-room layout/);
  assert.match(html, /Hilton lists cribs among the amenities/);
  assert.doesNotMatch(html, /no-crib/i);
  assert.match(html, /not a default family of four/);
  assert.match(html, /most review pages did not expose a reliable family-only count/);
  assert.doesNotMatch(html, /editorial (?:planning )?ceilings?|\$\d[\d,]*-\$\d[\d,]*\+/);
  assert.match(html, /Older samples are no longer shown because their stays have passed/);
  assert.match(html, /src="\.\.\/images\/new-york-city-central-park\.webp"/);
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
  for (const question of faq.mainEntity) {
    assert.ok(visible.includes(`<h3>${question.name}</h3><p>${question.acceptedAnswer.text}</p>`), `FAQ is not aligned: ${question.name}`);
  }
});

test("Q19: shows Google family-of-4 prices with every same-night figure; the July samples are gone", () => {
  const html = readFileSync(pagePath, "utf8");
  // G13: lowest family price first, unpriced hotels last.
  const expected = ["$231", "$247", "$311–$360", "$404", "$473", "$500–$577", "$733", "$2,060", "No family price found", "No family price found", "No family price shown", "No family price found"];
  const table = html.match(/<table class="comparison-table hotel-comparison nyc-compare">([\s\S]*?)<\/table>/)[1];
  const rows = [...table.matchAll(/<tr>\s*<td>([\s\S]*?)<\/tr>/g)];
  assert.equal(rows.length, 12);
  rows.forEach((row, index) => assert.ok(row[0].includes(`<strong>${expected[index]}`), `row ${index}`));
  assert.match(rows[10][0], /Our Jan 19 search did not find this hotel/);
  assert.doesNotMatch(table, /Family of 5|\$247 on Jan 19/);
  assert.match(table, /<th>Nightly price \(family of 4\)<\/th>/);
  assert.match(table, /\$311 or \$360 on Jan 19, 2027 \(differed between searches\)/);
  const cards = [...html.matchAll(/<details class="detail-card hotel-card" id="nyc-hotel-\d+"[^>]*>([\s\S]*?)<\/details>/g)];
  assert.equal(cards.length, 12);
  for (const card of cards) assert.match(card[1], /href="#price-basis"/);
  assert.match(html, /<details id="price-basis"[^>]*><summary>Full price basis<\/summary><p>Prices are Google Hotels listing prices per night for 2 adults \+ kids 5 and 8/);
  assert.match(html, /a second room may be extra/);
  assert.doesNotMatch(html, /second room are separate/);
  // Past-stay and two-adult July figures leave every public surface, JSON-LD included.
  assert.doesNotMatch(html, /Older 2-adult|two-adult|Expedia, checked|\$(?:331|226|227|190|221|205|352|375|593|664|904|654)\b/);
  const blocks = schemas(html);
  const items = blocks.find((block) => block["@type"] === "ItemList").itemListElement;
  assert.match(items[1].description, /Google Hotels listing \$247 per night for 2 adults \+ kids 5 and 8/);
  assert.match(items[0].description, /no current family-of-4 price shown; check live rate/);
  assert.doesNotMatch(JSON.stringify(blocks), /Jul(?:y)? 25, 2026.*price|not a family-room quote/);
});

test("glance leads with labelled family-of-4 prices; family of 5 stays separate", { skip: !listingsLive && "Google listings left the page on 2027-01-08" }, () => {
  const html = readFileSync(pagePath, "utf8");
  const glance = html.match(/<section id="nyc-budget-glance"[^>]*>([\s\S]*?)<\/section>/)[1];
  assert.match(glance, /Family of 4, one Tuesday, Jan 19, 2027 \(estimate\)/);
  assert.match(glance, /<strong>\$231–\$360<\/strong> Midtown and Times Square <small>Radio City lowest, apartment type not shown; next Homewood \$247<\/small>/);
  assert.match(glance, /<strong>\$404<\/strong> Central Park and Upper West Side <small>Residence Inn; only price found<\/small>/);
  assert.match(glance, /<strong>\$473–\$733<\/strong> Downtown and Brooklyn <small>Conrad lowest; plus Four Seasons \$2,060, may be a larger room or two rooms<\/small>/);
  assert.match(glance, /<strong>\$500–\$577<\/strong> Midtown East <small>Lotte Palace; prices differed between searches<\/small>/);
  assert.match(glance, /No price found: Embassy Suites, TRYP, Beacon, Kimberly\./);
  assert.doesNotMatch(html, /12 hotels for a family of 4 or 5|evidence pack/);
  assert.match(html, /Good first look:<\/strong> Homewood Suites, <strong>about \$247 a night<\/strong> for a family of 4 \(estimate\)/);
  assert.match(html, /Cribs listed: Homewood, Conrad, Four Seasons; on request: Marriott Marquis/);
  assert.match(html, /some guests describe a lap pool, not water play/);
  assert.match(html, /5 people on Fri Jan 15 against 4 on Jan 19/);
  assert.match(html, /Google does not say whether this is a named family suite/);
  assert.doesNotMatch(html.match(/id="nyc-hotel-1"[\s\S]*?<\/summary>/)[0], /a night/);
  // G13: the family-of-4 cost comes before the photo so it stays on the first phone screen.
  assert.ok(html.indexOf('id="nyc-budget-glance"') < html.indexOf('<figure class="licensed-photo hero-photo">'));
  const box = html.match(/<section id="nyc-hotel-answer"[^>]*>([\s\S]*?)<\/section>/)[1];
  assert.match(box, /<details class="price-more"><summary>Family of 5\? Prices for 3 hotels<\/summary>/);
  // One-night listings are shown as one night only, never multiplied into a stay; only Beacon (control-checked) gets a stay estimate.
  assert.match(box, /<span class="pick-chip">\$305-\$401\/night<\/span> <span><a href="#nyc-hotel-6">TRYP Times Square<\/a> · 1 night \(Mon Jan 18 \/ Fri Jan 15\)<\/span>/);
  assert.match(box, /<span class="pick-chip">\$798\/night<\/span> <span><a href="#nyc-hotel-4">Radio City Apartments<\/a> · 1 night \(Fri Jan 15\)<\/span>/);
  assert.match(box, /<span class="pick-chip">\$1,160\/night<\/span> <span><a href="#nyc-hotel-1">Hotel Beacon<\/a> · 5 nights, Jan 15-20, 2027 ≈ \$5,800 total \(estimate\)<\/span>/);
  assert.doesNotMatch(html, /\$1,525|\$2,005|\$3,990/);
  assert.match(box, /2 adults \+ kids 4, 8 and 12 · Google Hotels, seen Oct 31 · room type not shown · not a quote · taxes may be extra · 3 kids not confirmed by hotels\./);
  assert.match(box, /Homewood \$247, Radio City \$231, Residence Inn \$404, Beacon \(Radio City: apartment type not shown\)<\/span>/);
  assert.match(box, /Four Seasons Downtown \$2,060 \(may be a larger room or two rooms\); some guests describe a lap pool, not water play<\/span>/);
  assert.match(box, /<strong>Main catch:<\/strong> beds and how many people a room allows differ by exact room/);
  for (const p of box.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/g)) assert.ok(p[1].replace(/<[^>]+>|·/g, "").trim().split(/\s+/).length <= 30, p[1]);
  assert.ok(html.indexOf('id="nyc-budget-glance"') < html.indexOf('id="hotel-comparison"'));
  assert.ok(html.indexOf('id="nyc-hotel-answer"') < html.indexOf('id="hotel-comparison"'));
});

test("routes from home and the existing stay guide without changing the activity page", () => {
  const home = stripSiteChrome(readFileSync(join(root, "site", "index.html"), "utf8"));
  const stay = stripSiteChrome(readFileSync(join(root, "site", "where-to-stay", "new-york-city-with-kids.html"), "utf8"));
  const activity = stripSiteChrome(readFileSync(join(root, "site", "things-to-do", "new-york-city-with-kids.html"), "utf8"));

  assert.match(home, /href="\.\/where-to-stay\/new-york-city-family-hotels\.html"/);
  assert.match(stay, /href="(?:\.\/|\.\.\/where-to-stay\/)new-york-city-family-hotels\.html"/);
  assert.doesNotMatch(activity, /new-york-city-family-hotels\.html/);
});

test("portable comparison preserves same records, current prices and source routes", () => {
  const pages = createFamilyHotelPages({});
  const hotels = pages.hotelCatalog["new-york-city"];
  const html = readFileSync(pagePath, "utf8");
  const csv = readFileSync(join(root, "site/downloads/new-york-city-family-hotels.csv"), "utf8");
  const rows = csv.trimEnd().split("\n").map((line) => [...line.matchAll(/"((?:[^"]|"")*)"(?:,|$)/g)].map((match) => match[1].replaceAll('""', '"')));
  assert.equal(csv, pages.newYorkCityHotelComparisonCsv());
  assert.equal(rows.length, 13);
  assert.ok(rows.every((row) => row.length === 17));
  assert.doesNotMatch(csv, /\r/);
  assert.doesNotMatch(csv, /two-adult|Expedia, checked|2026-07-25 to|\$(?:331|226|227|190|221|205|352|375|593|664|904|654)\b/);
  for (const [index, row] of rows.slice(1).entries()) {
    const hotel = hotels[index];
    assert.deepEqual(row.slice(0, 3), [hotel.name, hotel.category, hotel.area]);
    assert.equal(rows[0][3], "Nightly price (USD, Google Hotels listing)");
    assert.equal(row[4], "2 adults + kids 5 and 8");
    assert.doesNotMatch(row.join(" "), /November 8|2,544|631/);
    assert.match(row[8], /Google Hotels listing prices per night/);
    assert.ok(row[9].includes(hotel.priceAsk));
    assert.equal(row[10], hotel.familySetup);
    assert.equal(row[11], "2026-07-25");
    assert.equal(row[12], hotel.reviewSignal);
    assert.equal(row[13], hotel.parentCheck);
    assert.equal(row[14], `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hotel.mapQuery)}`);
    assert.equal(row[15], "https://familytripwise.com/where-to-stay/new-york-city-family-hotels.html#sources-checked");
    assert.equal(row[16], "https://familytripwise.com/where-to-stay/new-york-city-family-hotels.html#hotel-comparison");
    if (["Hotel Beacon", "Radio City Apartments", "TRYP by Wyndham New York City Times Square / Midtown"].includes(hotel.name)) assert.ok(row[7].length > 0);
    else assert.equal(row[7], "");
    if (listingsLive && hotel.name === "Hotel Beacon") assert.match(row[7], /^Google Hotels listed Hotel Beacon at about \$1,160 a night for 2 adults and kids 4, 8 and 12, January 15 to 20, 2027/);
    assert.ok(!row.some((cell) => /^\s*[=+\-@]/.test(cell)));
  }
  assert.match(html, /<section id="hotel-comparison" class="band" data-glance-first>/);
  assert.match(html, /<section id="sources-checked" class="container page-section source-section">/);
  assert.match(html, /href="\.\.\/downloads\/new-york-city-family-hotels\.csv" download/);
  assert.match(html, /<details><summary>Spreadsheet copy<\/summary>/);
});

test("full generation is idempotent and leaves current output unchanged", () => {
  const temp = mkdtempSync(join(tmpdir(), "family-tripwise-nyc-hotels-"));
  const siteCopy = join(temp, "site");
  cpSync(join(root, "site"), siteCopy, { recursive: true });
  cpSync(join(root, "tools"), join(temp, "tools"), { recursive: true });
  cpSync(join(root, "docs/research"), join(temp, "docs/research"), { recursive: true });
  cpSync(join(root, "src/prototypes/cancun-resort-comparison"), join(temp, "src/prototypes/cancun-resort-comparison"), { recursive: true });
  cpSync(join(root, "src/shared"), join(temp, "src/shared"), { recursive: true });

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
