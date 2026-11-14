// G18 (OWNER D39, docs/plan/hotel-price-samples.md): Chicago hotels show a Fri-Sun weekend plus Christmas and New Year.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { readReceipt } from "./page-generation/google-hotel-samples.mjs";
import { weekendPrice } from "./page-generation/weekend-hotel-samples.mjs";
import { easternDate } from "./page-generation/sitemap.mjs";
import { createFamilyHotelPages } from "./page-generation/family-hotel-pages.mjs";

const searches = "abcdefghi".split("").flatMap((part) => readReceipt(`dataforseo-g18-chicago-${part}-2026-11-14.json`).searches);
const kids = [5, 8];
const page = readFileSync(new URL("../site/where-to-stay/chicago-family-hotels.html", import.meta.url), "utf8");
const csv = readFileSync(new URL("../site/downloads/chicago-family-hotels.csv", import.meta.url), "utf8");
const pages = createFamilyHotelPages({ esc: (value) => String(value), pageShell: (value) => value });

test("figures come from the receipts; one priced night is never averaged", () => {
  const w = weekendPrice(searches, { prefix: "chi-embassy-suites", title: "Embassy Suites by Hilton Chicago Downtown Magnificent Mile", tags: ["jan22", "jan23"], childAges: kids });
  assert.deepEqual([w.fri.nightly, w.sat.nightly, w.average, w.total], [268, 398, 333, 666]);
  // Nov 14: every hotel priced both nights of the normal weekend; Hotel Zachary's New Year weekend shows Saturday only.
  const zach = weekendPrice(searches, { prefix: "chi-zachary", title: "Hotel Zachary, Chicago, a Tribute Portfolio Hotel", tags: ["jan01", "jan02"], childAges: kids });
  assert.deepEqual([zach.fri.nightly, zach.sat.nightly, zach.both, zach.total], [null, 353, false, null]);
  const langham = weekendPrice(searches, { prefix: "chi-langham", title: "The Langham, Chicago", tags: ["jan22", "jan23"], childAges: kids });
  assert.deepEqual([langham.fri.nightly, langham.sat.nightly, langham.average, langham.total], [609, 533, 571, 1142]);
});

test("committed page says no Tuesday, leads with the weekend and never says sold out as a fact", () => {
  const today = process.env.FT_BUILD_DATE || easternDate();
  assert.doesNotMatch(page + csv, /Tuesday|Jan 19|January 19|weeknight|October 31, 2026/);
  if (today < "2027-01-15") {
    const glance = page.match(/<section id="chicago-budget-glance"[\s\S]*?<\/section>/)[0];
    assert.match(glance, /Family of 4, Fri–Sun, Jan 22–24, 2027 \(estimate\)/);
    assert.doesNotMatch(glance, /Friday only|no price shown/); // all ten priced both nights on Nov 14
    assert.ok(page.indexOf('id="chicago-budget-glance"') < page.indexOf('class="licensed-photo hero-photo"'));
  } else {
    // From January 15, 2027 this fails until `node tools/generate-pages.mjs` re-renders the page.
    assert.doesNotMatch(page + csv, /Jan 22/);
  }
  if (today < "2026-12-18") {
    const section = page.match(/<section id="chicago-holiday-prices"[\s\S]*?<\/section>/)[0];
    assert.match(section, /<td>Hilton Chicago<\/td><td>\$261<\/td><td>\$261<\/td><td>Nov 14<\/td>/);
    assert.match(section, /<td>Homewood<\/td><td>\$229<\/td><td>\$254<\/td><td>Nov 14<\/td>/);
    assert.match(section, /either night: Hotel Zachary\. That does not mean sold out/);
  } else {
    assert.doesNotMatch(page, /Dec 25–27/);
  }
});

test("all ten CSV weekend prices match the receipts, and the table is cheapest first", () => {
  const rows = csv.trimEnd().split("\n").slice(1).map((line) => [...line.matchAll(/"((?:[^"]|"")*)"(?:,|$)/g)].map((match) => match[1])[3].split(" per night")[0]);
  assert.deepEqual(rows, ["≈ $333", "≈ $232", "≈ $237", "≈ $533", "≈ $553", "≈ $478", "≈ $312", "≈ $357", "≈ $1,522", "≈ $571"]);
  const table = page.match(/<table class="comparison-table hotel-comparison">[\s\S]*?<\/table>/)[0];
  assert.deepEqual([...table.matchAll(/href="#chicago-hotel-(\d+)"/g)].map((match) => Number(match[1])), [2, 3, 7, 1, 8, 6, 4, 5, 10, 9]);
});

test("holiday tables leave a week before arrival", () => {
  const dec18 = pages.chicagoFamilyHotelPage("2026-12-18").body;
  assert.doesNotMatch(dec18, /Christmas weekend, Dec 25/);
  assert.match(dec18, /New Year's weekend, Jan 1/);
  const dec25 = pages.chicagoFamilyHotelPage("2026-12-25").body;
  assert.doesNotMatch(dec25, /chicago-holiday-prices/);
  assert.match(dec25, /\$232/);
  assert.doesNotMatch(pages.chicagoFamilyHotelPage("2027-01-15").body + pages.chicagoHotelComparisonCsv("2027-01-15"), /Jan 22/);
});

test("re-read corrections stay on the page", () => {
  assert.match(page, /Lake-View Room for 2 adults, or 2 adults and 1 child/);
  assert.match(page, /Deluxe and Premier rooms for three guests/);
  assert.match(page, /daily mandatory destination charge \(amount not stated\) includes a \$10 food and drink credit/);
  assert.match(page, /cribs as not available/);
});
