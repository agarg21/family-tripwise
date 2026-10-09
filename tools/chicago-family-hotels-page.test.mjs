import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { cpSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { createFamilyHotelPages } from "./page-generation/family-hotel-pages.mjs";

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

test("portable Chicago comparison retains the same records, budgets and caveats", () => {
  const pages = createFamilyHotelPages({ esc: (value) => String(value), pageShell: (value) => value });
  const expected = pages.hotelCatalog.chicago;
  const csv = readFileSync(join(root, "site/downloads/chicago-family-hotels.csv"), "utf8");
  const rows = csv.trimEnd().split("\n").map((line) => [...line.matchAll(/"((?:[^"]|"")*)"(?:,|$)/g)].map((match) => match[1].replaceAll('""', '"')));
  assert.equal(csv, pages.chicagoHotelComparisonCsv());
  assert.equal(rows.length, 11);
  assert.ok(rows.every((row) => row.length === 14));
  assert.deepEqual(rows.slice(1).map((row) => row[0]), expected.map((hotel) => hotel.name));
  for (const [index, row] of rows.slice(1).entries()) {
    const hotel = expected[index];
    assert.deepEqual(row.slice(0, 5), [hotel.name, hotel.category, hotel.area, hotel.priceRange, "2026-07-23"]);
    assert.match(row[5], /two-adult public examples/);
    assert.match(row[5], /summer-2026 stay examples/);
    assert.match(row[5], /exact room and stay-date details incomplete/);
    assert.match(row[5], /two example date labels ambiguous/);
    assert.match(row[5], /tax and mandatory-fee inclusion varies; parking separate/);
    assert.match(row[5], /not a family-room or Kids Suite quote/);
    assert.deepEqual(row.slice(6, 11), [hotel.priceNote, hotel.familySetup, "2026-07-23", hotel.reviewSignal, hotel.parentCheck]);
    assert.equal(row[11], `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hotel.mapQuery)}`);
    assert.equal(row[12], "https://familytripwise.com/where-to-stay/chicago-family-hotels.html#sources-checked");
    assert.equal(row[13], "https://familytripwise.com/where-to-stay/chicago-family-hotels.html#hotel-comparison");
    assert.ok(row.every((cell) => !/^\s*[=+\-@]/.test(cell)));
  }
  assert.match(rows[6][7], /Notice rechecked September 22, 2026/);
  assert.match(rows[6][7], /completion and current access are unconfirmed/);
  assert.match(rows[6][7], /7am-10pm.*5am-10pm/);
  assert.match(rows[5][6], /not a Kids Suite quote/);
  const html = readFileSync(pagePath, "utf8");
  assert.match(html, /href="#hotel-comparison">Jump to the hotel comparison/);
  assert.match(html, /class="band" id="hotel-comparison"/);
  assert.match(html, /href="\.\.\/downloads\/chicago-family-hotels\.csv" download/);
  assert.match(html, /source-section" id="sources-checked"/);
  assert.match(html, /class="comparison-scroll" role="region" aria-label="Chicago hotel comparison" tabindex="0"/);
});

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
  assert.match(html, /Planning USD\/room\/night/);
  assert.match(html, /two adults where party size was shown/);
  assert.match(html, /not family-room quotes/);
  assert.match(html, /tax and mandatory-fee inclusion varies by example/i);
  assert.match(html, /Two example date labels in that pack are ambiguous/);
  assert.ok(html.indexOf("not family-room quotes") < html.indexOf("<table class=\"comparison-table hotel-comparison\""));
  for (const range of ["$280-$550+", "$210-$450+", "$270-$500+", "$310-$650+", "$240-$550+", "$300-$600+", "$320-$650+", "$360-$750+", "$630-$1,200+", "$600-$1,200+"]) {
    assert.ok(html.includes(range), `missing price band ${range}`);
  }
  assert.match(html, /Hotel facts, prices, and review sources checked:<\/strong> July 23, 2026; indoor-pool status spot-checked September 14, 2026/);
  assert.match(html, /Notice rechecked September 22, 2026/);
  assert.match(html, /notice omits the year/);
  assert.match(html, /published window has passed, but completion and current access are unconfirmed/);
  assert.match(html, /unavailable Resort Pass purchases, not verified conditions today/);
  assert.match(html, /7am-10pm on the pool page versus 5am-10pm on amenities/);
  assert.doesNotMatch(html, /locker rooms are unavailable|Occasional daytime construction may continue/);
  assert.doesNotMatch(html, /August 10-12 closure|scheduled to reopen after August 12|checked August 13/);
  assert.match(html, /current dedicated Kids Suite page says the play space is open daily, while an older overview still says suspended/);
  assert.match(html, /planning range includes standard-room evidence, not a specialty-layout quote/);
  assert.match(html, /planning range starts from standard-room evidence, not a Kids Suite quote/);
  assert.doesNotMatch(html, /current public example was about \$308|recent standard-room example was about \$235/);
  assert.doesNotMatch(html, /approximate total nightly price|rough total nightly price/);
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
  const poolAnswer = faq.mainEntity.find((item) => item.name.includes("indoor pool")).acceptedAnswer.text;
  assert.match(poolAnswer, /completion, changing facilities, current hours and pass availability remain unconfirmed/);
  assert.ok(visible.includes(poolAnswer), "pool FAQ text matches schema");
  const priceAnswer = faq.mainEntity.find((item) => item.name.includes("taxes and fees")).acceptedAnswer.text;
  assert.match(priceAnswer, /not quotes for a family room or Kids Suite/);
  assert.ok(visible.includes(priceAnswer), "price FAQ text matches schema");
  for (const item of itemList.itemListElement) assert.match(item.description, /USD per-room\/night planning range .* from July 23 research pack, not a family-room quote/);
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
  cpSync(join(root, "docs/research"), join(temp, "docs/research"), { recursive: true });
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
