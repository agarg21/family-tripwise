// G18 (OWNER D39, docs/plan/hotel-price-samples.md): San Antonio hotels show a Fri-Sun weekend plus Christmas and New Year.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { readReceipt } from "./page-generation/google-hotel-samples.mjs";
import { weekendPrice } from "./page-generation/weekend-hotel-samples.mjs";
import { easternDate } from "./page-generation/sitemap.mjs";
import { createFamilyHotelPages } from "./page-generation/family-hotel-pages.mjs";

const searches = [..."abcdefghi".split(""), "retry", "retry2"].flatMap((part) => readReceipt(`dataforseo-g18-sa-${part}-2026-11-05.json`).searches);
const page = readFileSync(new URL("../site/where-to-stay/san-antonio-family-hotels.html", import.meta.url), "utf8");
const pages = createFamilyHotelPages({ esc: (value) => String(value), pageShell: (value) => value });
const html = (today) => pages.sanAntonioFamilyHotelPage(today).body;
const weekend = (prefix, title) => weekendPrice(searches, { prefix, title, tags: ["jan22", "jan23"], childAges: [5, 8] });

test("figures come from the receipts; one priced night is never doubled", () => {
  const embassy = weekend("sa-embassy", "Embassy Suites by Hilton San Antonio Riverwalk Downtown");
  assert.deepEqual([embassy.fri.nightly, embassy.sat.nightly, embassy.average, embassy.total], [221, 230, 226, 451]);
  const rivercenter = weekend("sa-rivercenter", "San Antonio Marriott Rivercenter on the River Walk");
  assert.deepEqual([rivercenter.fri.nightly, rivercenter.sat.nightly, rivercenter.both, rivercenter.total], [361, null, false, null]);
  assert.match(page, /\$361 a night<\/strong> <small>\(Friday only\)/);
  for (const hotel of pages.hotelCatalog["san-antonio"]) assert.ok(weekend(hotel.google.prefix, hotel.google.title).any, hotel.name);
});

test("committed page says no Tuesday, leads with the weekend and never says sold out as a fact", () => {
  const today = process.env.FT_BUILD_DATE || easternDate();
  assert.doesNotMatch(page, /Tuesday|Jan 19|January 19|weeknight|Feb 23|February 23/);
  if (today < "2027-01-15") {
    const glance = page.match(/<section id="san-antonio-budget-glance"[\s\S]*?<\/section>/)[0];
    assert.match(glance, /Family of 4, Fri–Sun, Jan 22–24, 2027 \(estimate\)/);
  } else {
    // From January 15, 2027 this fails until `node tools/generate-pages.mjs` re-renders the page.
    assert.doesNotMatch(page, /Jan 22/);
  }
  if (today < "2026-12-18") assert.match(page, /<section id="san-antonio-holiday-prices"/);
  else assert.doesNotMatch(page, /Dec 25–27/);
  if (today >= "2026-12-25") assert.doesNotMatch(page, /Jan 1–3/);
  assert.doesNotMatch(page.replace(/not sold out|does not mean sold out|not mean sold out/g, ""), /sold out/i);
});

test("the comparison table is cheapest first", () => {
  const table = page.match(/<table class="comparison-table hotel-comparison">[\s\S]*?<\/table>/)[0];
  const averages = [...table.matchAll(/<td><strong>(?:≈ )?\$([\d,]+) a night/g)].map((match) => Number(match[1].replace(",", "")));
  assert.equal(averages.length, 12);
  assert.deepEqual(averages, [...averages].sort((a, b) => a - b));
});

test("holiday tables and the weekend leave a week before arrival", () => {
  assert.doesNotMatch(html("2026-12-18"), /Christmas weekend, Dec 25/);
  assert.match(html("2026-12-18"), /New Year's weekend, Jan 1/);
  assert.doesNotMatch(html("2026-12-25"), /san-antonio-holiday-prices"/);
  assert.match(html("2026-12-25"), /\$226/);
  assert.doesNotMatch(html("2027-01-15"), /Jan 22|\$\d[\d,]* a night<\/strong>|public one-night example|\$\d+ total before parking/);
});

test("every holiday cell, and every also figure, comes from its own night in the receipts", () => {
  // A fixed build date, so this keeps working after the tables leave the live page.
  const norm = (text) => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const section = html("2026-11-05").match(/<section id="san-antonio-holiday-prices"[\s\S]*?<\/section>/)[0];
  const tables = section.split("<h3>").slice(1);
  assert.equal(tables.length, 2);
  const nights = [["2026-12-25", "2026-12-26"], ["2027-01-01", "2027-01-02"]];
  const money = (cell) => [...cell.matchAll(/\$([\d,]+)/g)].map((match) => Number(match[1].replace(",", ""))).sort((a, b) => a - b);
  let cells = 0;
  tables.forEach((table, index) => {
    for (const [, name, fri, sat] of table.matchAll(/<tr><td>([^<]+)<\/td><td>([\s\S]*?)<\/td><td>([\s\S]*?)<\/td>/g)) {
      const hotel = pages.hotelCatalog["san-antonio"].find((entry) => entry.shortName === name);
      assert.ok(hotel, name);
      [fri, sat].forEach((cell, night) => {
        const expected = [...new Set(searches.filter((search) => search.check_in === nights[index][night]).flatMap((search) => search.results).filter((row) => norm(row.title) === norm(hotel.google.title) && row.price > 0).map((row) => row.price))].sort((a, b) => a - b);
        assert.deepEqual(money(cell), expected, `${name} ${nights[index][night]}`);
        cells += 1;
      });
    }
  });
  assert.ok(cells >= 40, `${cells} cells`);
});
