// G18 (OWNER D39, docs/plan/hotel-price-samples.md): Las Vegas hotels show a Fri-Sun weekend plus Christmas and New Year.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { readReceipt } from "./page-generation/google-hotel-samples.mjs";
import { weekendPrice } from "./page-generation/weekend-hotel-samples.mjs";
import { easternDate } from "./page-generation/sitemap.mjs";
import { createFamilyHotelPages } from "./page-generation/family-hotel-pages.mjs";

const searches = [..."abcdefgh".split(""), "retry"].flatMap((part) => readReceipt(`dataforseo-g18-lv-${part}-2026-11-05.json`).searches);
const page = readFileSync(new URL("../site/where-to-stay/las-vegas-family-hotels.html", import.meta.url), "utf8");
const pages = createFamilyHotelPages({ esc: (value) => String(value), pageShell: (value) => value });
const html = (today) => pages.lasVegasFamilyHotelPage(today).body;
const weekend = (prefix, title) => weekendPrice(searches, { prefix, title, tags: ["jan22", "jan23"], childAges: [5, 8] });

test("figures come from the receipts; one priced night is never doubled; unpriced hotels say so", () => {
  const excalibur = weekend("lv-excalibur", "Excalibur Hotel & Casino");
  assert.deepEqual([excalibur.fri.nightly, excalibur.sat.nightly, excalibur.average, excalibur.total], [155, 249, 202, 404]);
  const vdara = weekend("lv-vdara", "Vdara Hotel & Spa");
  assert.deepEqual([vdara.fri.nightly, vdara.sat.nightly, vdara.both, vdara.total], [319, null, false, null]);
  const built = html("2026-11-05");
  assert.match(built, /\$319 a night<\/strong> <small>\(Friday only\)/);
  for (const name of ["Four Seasons Hotel Las Vegas", "Tahiti Village", "Hilton Vacation Club Cancun Resort Las Vegas"]) assert.equal(weekend(pages.hotelCatalog["las-vegas"].find((hotel) => hotel.google.title === name).google.prefix, name).any, false, name);
  assert.equal((built.match(/No price shown on Nov 5/g) || []).length, 8, "3 unpriced hotels: table and card, plus 2 holiday notes");
});

test("committed page has no weeknight, leads with the weekend and never says sold out as a fact", () => {
  const today = process.env.FT_BUILD_DATE || easternDate();
  assert.doesNotMatch(page, /Tuesday|Jan 19|January 19|weeknight|Feb 23|February 23/);
  if (today < "2027-01-15") assert.match(page.match(/<section id="las-vegas-budget-glance"[\s\S]*?<\/section>/)[0], /Family of 4, Fri–Sun, Jan 22–24, 2027 \(estimate\)/);
  else assert.doesNotMatch(page, /Jan 22/); // From January 15, 2027 this fails until `node tools/generate-pages.mjs` re-renders the page.
  if (today < "2026-12-18") assert.match(page, /<section id="las-vegas-holiday-prices"/);
  else assert.doesNotMatch(page, /Dec 25–27/);
  if (today >= "2026-12-25") assert.doesNotMatch(page, /Jan 1–3/);
  assert.doesNotMatch(page.replace(/not sold out|does not mean sold out/g, ""), /sold out/i);
});

test("the comparison table is cheapest first, unpriced last", () => {
  const table = html("2026-11-05").match(/<table class="comparison-table hotel-comparison">[\s\S]*?<\/table>/)[0];
  const averages = [...table.matchAll(/<td><strong>(?:≈ )?\$([\d,]+) a night/g)].map((match) => Number(match[1].replace(",", "")));
  assert.equal(averages.length, 7);
  assert.deepEqual(averages, [...averages].sort((a, b) => a - b));
  assert.ok(table.lastIndexOf("a night</strong>") < table.indexOf("No price shown"));
});

test("holiday tables and the weekend leave a week before arrival", () => {
  assert.doesNotMatch(html("2026-12-18"), /Christmas weekend, Dec 25/);
  assert.match(html("2026-12-18"), /New Year's weekend, Jan 1/);
  assert.doesNotMatch(html("2026-12-25"), /las-vegas-holiday-prices"/);
  assert.doesNotMatch(html("2027-01-15"), /Jan 22|\$\d[\d,]* a night<\/strong>/);
});

test("every holiday cell, and every also figure, comes from its own night in the receipts", () => {
  const section = html("2026-11-05").match(/<section id="las-vegas-holiday-prices"[\s\S]*?<\/section>/)[0];
  const tables = section.split("<h3>").slice(1);
  assert.equal(tables.length, 2);
  const nights = [["2026-12-25", "2026-12-26"], ["2027-01-01", "2027-01-02"]];
  const money = (cell) => [...cell.matchAll(/\$([\d,]+)/g)].map((match) => Number(match[1].replace(",", ""))).sort((a, b) => a - b);
  let cells = 0;
  tables.forEach((table, index) => {
    for (const [, name, fri, sat] of table.matchAll(/<tr><td>([^<]+)<\/td><td>([\s\S]*?)<\/td><td>([\s\S]*?)<\/td>/g)) {
      const hotel = pages.hotelCatalog["las-vegas"].find((entry) => entry.shortName === name);
      assert.ok(hotel, name);
      [fri, sat].forEach((cell, night) => {
        const expected = [...new Set(searches.filter((search) => search.check_in === nights[index][night] && search.party.child_ages.join() === "5,8").flatMap((search) => search.results).filter((row) => row.title === hotel.google.title && row.price > 0).map((row) => row.price))].sort((a, b) => a - b);
        assert.deepEqual(money(cell), expected, `${name} ${nights[index][night]}`);
        cells += 1;
      });
    }
  });
  assert.ok(cells >= 14, `${cells} cells`);
});
