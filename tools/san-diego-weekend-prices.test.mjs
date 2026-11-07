// G18 (OWNER D39, docs/plan/hotel-price-samples.md): San Diego hotels show a Fri-Sun weekend plus Christmas and New Year.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { readReceipt } from "./page-generation/google-hotel-samples.mjs";
import { weekendPrice } from "./page-generation/weekend-hotel-samples.mjs";
import { easternDate } from "./page-generation/sitemap.mjs";
import { createFamilyHotelPages } from "./page-generation/family-hotel-pages.mjs";

const searches = "abcdefghij".split("").flatMap((part) => readReceipt(`dataforseo-g18-sd-${part}-2026-11-05.json`).searches);
const kids = [5, 8];
const page = readFileSync(new URL("../site/where-to-stay/san-diego-family-hotels.html", import.meta.url), "utf8");
const csv = readFileSync(new URL("../site/downloads/san-diego-family-hotels.csv", import.meta.url), "utf8");
const pages = createFamilyHotelPages({ esc: (value) => String(value), pageShell: (value) => value });

test("figures come from the receipts; an unpriced hotel is never given a figure", () => {
  const w = weekendPrice(searches, { prefix: "sd-homewood", title: "Homewood Suites by Hilton San Diego Downtown/Bayside", tags: ["jan22", "jan23"], childAges: kids });
  assert.deepEqual([w.fri.nightly, w.sat.nightly, w.average, w.total], [271, 272, 272, 543]);
  assert.equal(weekendPrice(searches, { prefix: "sd-la-jolla-shores", title: "La Jolla Shores Hotel", tags: ["jan22", "jan23"], childAges: kids }).any, false);
  const five = weekendPrice(searches, { prefix: "sd-homewood-five", title: "Homewood Suites by Hilton San Diego Downtown/Bayside", tags: ["jan22", "jan23"], childAges: [4, 8, 12] });
  assert.ok(five.any);
  assert.ok(page.includes(`$${five.fri.nightly}`));
});

test("committed page says no Tuesday, leads with the weekend and never says sold out as a fact", () => {
  const today = process.env.FT_BUILD_DATE || easternDate();
  assert.doesNotMatch(page + csv, /Tuesday|Jan 19|January 19|weeknight|October 31, 2026/);
  if (today < "2027-01-15") {
    const glance = page.match(/<section id="san-diego-budget-glance"[\s\S]*?<\/section>/)[0];
    assert.match(glance, /Family of 4, Fri–Sun, Jan 22–24, 2027 \(estimate\)/);
    assert.match(glance, /no price shown: La Jolla Shores/);
    assert.ok(page.indexOf('id="san-diego-budget-glance"') < page.indexOf('class="licensed-photo hero-photo"'));
  } else {
    // From January 15, 2027 this fails until `node tools/generate-pages.mjs` re-renders the page.
    assert.doesNotMatch(page + csv, /Jan 22/);
  }
  if (today < "2026-12-18") {
    const section = page.match(/<section id="san-diego-holiday-prices"[\s\S]*?<\/section>/)[0];
    assert.match(section, /<td>Homewood<\/td><td>\$276<\/td><td>\$358<\/td><td>Nov 5<\/td>/);
    assert.match(section, /either night: La Jolla Shores\. That does not mean sold out/);
  } else {
    assert.doesNotMatch(page, /Dec 25–27/);
  }
});

test("the comparison table is cheapest first and unpriced last", () => {
  const table = page.match(/<table class="comparison-table hotel-comparison sd-compare">[\s\S]*?<\/table>/)[0];
  assert.deepEqual([...table.matchAll(/href="#san-diego-hotel-(\d+)"/g)].map((match) => Number(match[1])), [6, 11, 1, 5, 3, 7, 8, 2, 4, 12, 10, 9]);
});

test("holiday tables leave a week before arrival", () => {
  const dec18 = pages.sanDiegoFamilyHotelPage("2026-12-18").body;
  assert.doesNotMatch(dec18, /Christmas weekend, Dec 25/);
  assert.match(dec18, /New Year's weekend, Jan 1/);
  const dec25 = pages.sanDiegoFamilyHotelPage("2026-12-25").body;
  assert.doesNotMatch(dec25, /san-diego-holiday-prices"/);
  assert.match(dec25, /\$272/);
  assert.doesNotMatch(pages.sanDiegoFamilyHotelPage("2027-01-15").body + pages.sanDiegoHotelComparisonCsv("2027-01-15"), /Jan 22/);
});
