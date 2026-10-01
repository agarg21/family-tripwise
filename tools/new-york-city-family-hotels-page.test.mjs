import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { cpSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { createFamilyHotelPages } from "./page-generation/family-hotel-pages.mjs";

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
  assert.match(html, /Historical USD\/room\/night, not a quote/);
  assert.match(html, /Hotel facts, prices, and review sources checked:<\/strong> July 25, 2026/);
  assert.match(html, /Do not assume the classic Embassy Suites two-room layout/);
  assert.match(html, /Hilton lists cribs among the amenities/);
  assert.doesNotMatch(html, /no-crib/i);
  assert.match(html, /not a default family of four/);
  assert.match(html, /most public slices did not expose a reliable family-only count/);
  assert.match(html, /Upper edges are editorial planning ceilings, not observed quotes/);
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
  for (const question of faq.mainEntity) {
    assert.ok(visible.includes(`<h3>${question.name}</h3><p>${question.acceptedAnswer.text}</p>`), `FAQ is not aligned: ${question.name}`);
  }
});

test("preserves all twelve bands while making historical room and party limits adjacent", () => {
  const html = readFileSync(pagePath, "utf8");
  const bands = ["$330-$750+", "$230-$550+", "$230-$550+", "$190-$600+", "$220-$500+", "$210-$700+", "$350-$850+", "$380-$900+", "$470-$1,000+", "$590-$1,500+", "$660-$1,400+", "$900-$1,900+"];
  const table = html.match(/<table class="comparison-table hotel-comparison">([\s\S]*?)<\/table>/)[1];
  const rows = [...table.matchAll(/<tr>\s*<td>([\s\S]*?)<\/tr>/g)];
  assert.equal(rows.length, bands.length);
  rows.forEach((row, index) => assert.ok(row[0].includes(`<td>${bands[index]}</td>`)));
  assert.match(table, /<th>Approx\. USD\/room\/night<\/th>/);
  const cards = [...html.matchAll(/<article class="detail-card hotel-card">([\s\S]*?)<\/article>/g)];
  cards.forEach((card, index) => {
    assert.ok(card[1].includes(`<dd>${bands[index]}</dd>`));
    assert.match(card[1], /sample checked July 25, 2026/);
    assert.match(card[1], /two-adult room samples/);
    assert.match(card[1], /Exact room, child ages, rate plan, and travel-date or season basis are not consistently recorded/);
    assert.match(card[1], /Taxes and mandatory fees were included only where stated/);
    assert.match(card[1], /a second room are separate/);
  });
  assert.equal(cards.length, 12);
  assert.match(cards[5][1], /guest review reported about \$654 on another date; that anecdote is not a comparable family-room quote/);
  assert.doesNotMatch(html, /A recent (?:public|standard-room)|rough total per night|rough planning totals|approximate total nightly price/i);
  for (const item of schemas(html).find((block) => block["@type"] === "ItemList").itemListElement) {
    assert.match(item.description, /historical USD\/room\/night planning range/);
    assert.match(item.description, /July 25, 2026 checks; not an exact family-room quote/);
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

test("portable comparison preserves same records, historical prices and source routes", () => {
  const pages = createFamilyHotelPages({});
  const hotels = pages.hotelCatalog["new-york-city"];
  const html = readFileSync(pagePath, "utf8");
  const csv = readFileSync(join(root, "site/downloads/new-york-city-family-hotels.csv"), "utf8");
  const rows = csv.trimEnd().split("\n").map((line) => [...line.matchAll(/"((?:[^"]|"")*)"(?:,|$)/g)].map((match) => match[1].replaceAll('""', '"')));
  assert.equal(csv, pages.newYorkCityHotelComparisonCsv());
  assert.equal(rows.length, 13);
  assert.ok(rows.every((row) => row.length === 14));
  assert.doesNotMatch(csv, /\r/);
  for (const [index, row] of rows.slice(1).entries()) {
    const hotel = hotels[index];
    assert.deepEqual(row.slice(0, 4), [hotel.name, hotel.category, hotel.area, hotel.priceRange]);
    assert.equal(row[4], "2026-07-25");
    assert.match(row[5], /two-adult room samples/);
    assert.match(row[5], /Exact room, child ages, rate plan, and travel-date or season basis are not consistently recorded/);
    assert.match(row[5], /Taxes and mandatory fees were included only where stated/);
    assert.equal(row[6], hotel.priceNote);
    assert.equal(row[7], hotel.familySetup);
    assert.equal(row[8], "2026-07-25");
    assert.equal(row[9], hotel.reviewSignal);
    assert.equal(row[10], hotel.parentCheck);
    assert.equal(row[11], `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hotel.mapQuery)}`);
    assert.equal(row[12], "https://familytripwise.com/where-to-stay/new-york-city-family-hotels.html#sources-checked");
    assert.equal(row[13], "https://familytripwise.com/where-to-stay/new-york-city-family-hotels.html#hotel-comparison");
    assert.ok(!row.some((cell) => /^\s*[=+\-@]/.test(cell)));
  }
  assert.match(html, /<section id="hotel-comparison" class="band">/);
  assert.match(html, /<section id="sources-checked" class="container page-section source-section">/);
  assert.match(html, /href="\.\.\/downloads\/new-york-city-family-hotels\.csv" download/);
  assert.match(html, /href="#hotel-comparison"/);
});

test("full generation is idempotent and leaves current output unchanged", () => {
  const temp = mkdtempSync(join(tmpdir(), "family-tripwise-nyc-hotels-"));
  const siteCopy = join(temp, "site");
  cpSync(join(root, "site"), siteCopy, { recursive: true });
  cpSync(join(root, "tools"), join(temp, "tools"), { recursive: true });
  cpSync(join(root, "src/prototypes/cancun-resort-comparison"), join(temp, "src/prototypes/cancun-resort-comparison"), { recursive: true });

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
