import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { cpSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { createFamilyHotelPages } from "./page-generation/family-hotel-pages.mjs";
import { stripSiteChrome } from "./page-generation/site-chrome.mjs";

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

test("portable Chicago comparison retains the same records, dated samples and caveats", () => {
  const pages = createFamilyHotelPages({ esc: (value) => String(value), pageShell: (value) => value });
  const expected = pages.hotelCatalog.chicago;
  const csv = readFileSync(join(root, "site/downloads/chicago-family-hotels.csv"), "utf8");
  const rows = csv.trimEnd().split("\n").map((line) => [...line.matchAll(/"((?:[^"]|"")*)"(?:,|$)/g)].map((match) => match[1].replaceAll('""', '"')));
  assert.equal(csv, pages.chicagoHotelComparisonCsv());
  assert.equal(rows.length, 11);
  assert.ok(rows.every((row) => row.length === 18));
  assert.deepEqual(rows.slice(1).map((row) => row[0]), expected.map((hotel) => hotel.name));
  for (const [index, row] of rows.slice(1).entries()) {
    const hotel = expected[index];
    assert.deepEqual(row.slice(0, 9), [hotel.name, hotel.category, hotel.area, "Check live rate", hotel.olderSample.amount, "Not recorded (two adults where the source showed a party)", hotel.olderSample.stay ?? "Unclear (example date label not explained)", "Expedia", hotel.olderSample.recorded ?? "2026-07-23 research pack; example date label unclear"]);
    assert.match(row[9], /No current family-room rate has been observed/);
    assert.match(row[9], /recorded in the July 23, 2026 research pack/);
    assert.match(row[9], /did not record the party for each hotel/);
    assert.match(row[9], /observation dates are unclear/);
    assert.match(row[9], /no figure is a family-room price, a Kids Suite price or a current quote/);
    assert.match(row[9], /upper ends were editorial estimates, not observations/);
    assert.deepEqual(row.slice(10, 15), [hotel.priceNote, hotel.familySetup, "2026-07-23", hotel.reviewSignal, hotel.parentCheck]);
    assert.equal(row[15], `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hotel.mapQuery)}`);
    assert.equal(row[16], "https://familytripwise.com/where-to-stay/chicago-family-hotels.html#sources-checked");
    assert.equal(row[17], "https://familytripwise.com/where-to-stay/chicago-family-hotels.html#hotel-comparison");
    assert.ok(row.every((cell) => !/^\s*[=+\-@]/.test(cell)));
  }
  assert.deepEqual(rows.slice(1).map((row) => row[4]), ["$282", "$209", "$268", "$311", "$235", "$305", "$308", "$363", "$630", "$600"]);
  assert.deepEqual(rows.slice(1).filter((row) => row[8].includes("unclear")).map((row) => row[0]), ["Swissotel Chicago", "Hilton Chicago"]);
  assert.match(rows[6][11], /Notice rechecked September 22, 2026/);
  assert.match(rows[6][11], /completion and current access are unconfirmed/);
  assert.match(rows[6][11], /7am-10pm.*5am-10pm/);
  assert.match(rows[5][10], /not a Kids Suite quote/);
  const html = readFileSync(pagePath, "utf8");
  assert.match(html, /href="\.\/chicago-with-kids.html">Compare Chicago stay areas/);
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
  assert.match(html, /<h1>Chicago Family Hotels<\/h1>/);
  assert.match(html, /<link rel="canonical" href="https:\/\/familytripwise\.com\/where-to-stay\/chicago-family-hotels\.html">/);
  assert.doesNotMatch(html, /<meta[^>]+name="robots"[^>]+noindex/i);
  assert.equal((sitemap.match(/https:\/\/familytripwise\.com\/where-to-stay\/chicago-family-hotels\.html/g) || []).length, 1);
  for (const name of names) assert.ok(html.includes(name), `missing ${name}`);
  assert.equal((html.match(/<article class="detail-card hotel-card" id="chicago-hotel-\d+"/g) || []).length, 10);
  assert.equal((html.match(/<h4>Themes in sampled online reviews<\/h4>/g) || []).length, 10);
  assert.equal((html.match(/https:\/\/www\.google\.com\/maps\/search\/\?api=1&amp;query=/g) || []).length, 20);
  assert.match(html, /<th>Nightly price \(USD\/room\)<\/th>/);
  assert.match(html, /The pack used two adults where the source showed a party but did not record the party for each hotel/);
  assert.match(html, /Swissotel's and Hilton Chicago's examples carry July 5 and July 19 date labels that the pack does not explain/);
  assert.ok(html.indexOf("No current family-room rate observed") < html.indexOf("<table class=\"comparison-table hotel-comparison\""));
  for (const range of ["$280-$550+", "$210-$450+", "$270-$500+", "$310-$650+", "$240-$550+", "$300-$600+", "$320-$650+", "$360-$750+", "$630-$1,200+", "$600-$1,200+"]) {
    assert.ok(!html.includes(range), `retired price band still shown ${range}`);
  }
  assert.match(html, /<strong>Rough cost:<\/strong> no current family-room rate observed\. Older one-night samples per room: about \$209 \(Homewood\) to \$630 \(Four Seasons\)/);
  const beforeTable = html.slice(0, html.indexOf("<table"));
  assert.doesNotMatch(beforeTable, /samples recorded July 23/);
  assert.equal((beforeTable.match(/from the July 23, 2026 research pack \(two with unclear date labels\)/g) || []).length, 2);
  assert.match(html, /InterContinental's current access unconfirmed/);
  assert.match(html, /Hotel facts and review sources checked:<\/strong> July 23, 2026; indoor-pool status spot-checked September 14, 2026/);
  assert.match(html, /Notice rechecked September 22, 2026/);
  assert.match(html, /notice omits the year/);
  assert.match(html, /published window has passed, but completion and current access are unconfirmed/);
  assert.match(html, /unavailable Resort Pass purchases, not verified conditions today/);
  assert.match(html, /7am-10pm on the pool page versus 5am-10pm on amenities/);
  assert.doesNotMatch(html, /locker rooms are unavailable|Occasional daytime construction may continue/);
  assert.doesNotMatch(html, /August 10-12 closure|scheduled to reopen after August 12|checked August 13/);
  assert.match(html, /current dedicated Kids Suite page says the play space is open daily, while an older overview still says suspended/);
  assert.match(html, /older sample's room type was not recorded and it is not a specialty-layout quote/);
  assert.match(html, /older sample is a standard room, not a Kids Suite quote/);
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
  assert.match(priceAnswer, /not prices for a family room or Kids Suite and not current quotes/);
  assert.ok(visible.includes(priceAnswer), "price FAQ text matches schema");
  for (const item of itemList.itemListElement) assert.match(item.description, /no current family-room rate observed \(check live rate\); older one-night Expedia sample \$\d+ USD per room from the July 23, 2026 research pack.*, not a family-room quote$/);
});

test("routes from home and the existing stay guide without changing the activity page", () => {
  const home = stripSiteChrome(readFileSync(join(root, "site", "index.html"), "utf8"));
  const stay = stripSiteChrome(readFileSync(join(root, "site", "where-to-stay", "chicago-with-kids.html"), "utf8"));
  const activity = stripSiteChrome(readFileSync(join(root, "site", "things-to-do", "chicago-with-kids.html"), "utf8"));

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
