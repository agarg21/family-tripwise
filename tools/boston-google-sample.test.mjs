// G18 (OWNER D39): Boston prices are 1-night Google Hotels searches for a family of 4 on a normal weekend and two holiday
// weekends, plus a family of 5 on the normal weekend. A sample leaves the page 7 days before its first night.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { bostonWeekend, bostonGlanceBand, bostonFamilyHotelPage, bostonCsvFor } from "./page-generation/boston-family-hotels-page.mjs";
import { easternDate } from "./page-generation/sitemap.mjs";

const page = readFileSync(new URL("../site/where-to-stay/boston-family-hotels.html", import.meta.url), "utf8");
const csv = readFileSync(new URL("../site/downloads/boston-family-hotels.csv", import.meta.url), "utf8");
const [fenway, plaza, four, langham] = ["boston-fenway-two-bedroom-tobt", "boston-park-plaza-deluxe-double", "boston-four-seasons-plaza", "boston-langham-club-two-bedroom"];
const at = "2026-11-22";
const nights = (id, set, five) => { const w = bostonWeekend(id, set, at, five); return [w.fri.nightly, w.sat.nightly, w.average, w.total]; };

test("receipt figures: both nights give an average and sum; one night is never multiplied", () => {
  assert.deepEqual(nights(plaza, "weekend"), [239, 239, 239, 478]);
  assert.deepEqual(nights(langham, "weekend"), [685, 585, 635, 1270]);
  assert.deepEqual(bostonWeekend(langham, "weekend", at).sat.also, []); // Nov 22: second keyword matched its own search (585), so nothing extra to show
  assert.deepEqual(nights(fenway, "weekend"), [319, 279, 299, 598]);
  assert.equal(bostonWeekend(four, "weekend", at).any, false);
  assert.deepEqual(nights(plaza, "newYear"), [230, 230, 230, 460]);
  assert.deepEqual(nights(fenway, "newYear"), [284, null, 284, null]);
  assert.deepEqual(nights(langham, "christmas"), [618, 569, 594, 1187]);
  assert.deepEqual(nights(fenway, "christmas"), [null, 329, 329, null]); // Saturday filled by the second-keyword search; one night is never doubled
  assert.equal(bostonWeekend(four, "christmas", at).any, false);
  for (const id of [fenway, plaza, four, langham]) assert.equal(bostonWeekend(id, "weekend", at, true).any, false);
  assert.equal(bostonGlanceBand(at), "$239-$635");
});

test("the first screen names the party, the dates and the listing limit; one-night prices say so", () => {
  const html = bostonFamilyHotelPage(at), top = html.slice(html.indexOf('class="answer-box'), html.indexOf('class="dc-links"'));
  assert.match(top, /About \$239–\$635 a night/);
  assert.match(top, /Family of 4 \(kids 5, 8\) · Fri–Sun, Jan 22–24, 2027/);
  assert.match(top, /Hotel listing, no room named; suites may cost more/);
  assert.match(top, /Residence Inn, Back Bay\/Fenway: ≈ \$299 a night, \$598 for 2 nights\./);
  assert.match(top, /Hilton Boston Park Plaza: ≈ \$239 a night, \$478 for 2 nights\./);
  assert.match(top, /No price shown<\/strong> for either night:<\/p><ul class="dc-quick"><li><strong>Four Seasons Hotel Boston\.<\/strong>/);
  assert.doesNotMatch(top, /One night priced/); // every priced hotel has both weekend nights on Nov 22
  assert.match(html, /<strong>\$329 Saturday only<\/strong><p>Other night: no price shown<\/p>/); // Residence Inn, Christmas
  assert.match(top, /Family of 5 \(kids 4, 8, 12\), same weekend: no price shown\./);
  assert.match(html, /<td><strong>No price shown<\/strong><p>Seen Nov 22<\/p><\/td>/);
  assert.match(html, /Christmas weekend cost more than Jan 22–24 at Park Plaza and less at The Langham; New Year's cost less than Jan 22–24 at Park Plaza and The Langham\./);
  assert.match(top, /Park Plaza's published \$35 a day destination charge \(read Oct 10\) may be extra/);
  assert.match(bostonCsvFor(at), /published \$35 a day destination charge/);
  assert.doesNotMatch(html, /sold out/i);
});

test("samples drop 7 days before each stay: Christmas Dec 18, New Year Dec 25, the weekend Jan 15", () => {
  const dec18 = bostonFamilyHotelPage("2026-12-18");
  assert.doesNotMatch(dec18, /Christmas weekend:|Christmas and New Year prices/);
  assert.match(dec18, /New Year's weekend:/);
  const dec25 = bostonFamilyHotelPage("2026-12-25");
  assert.doesNotMatch(dec25, /id="holiday-prices"|Holiday prices/);
  assert.equal(bostonGlanceBand("2027-01-14"), "$239-$635");
  assert.equal(bostonGlanceBand("2027-01-15"), null);
  const after = bostonFamilyHotelPage("2027-01-15");
  assert.match(after, /Price: not shown/);
  assert.match(after, /No current price/);
  assert.doesNotMatch(after, /\$239|\$635|\$299/);
  assert.doesNotMatch(bostonCsvFor("2027-01-15"), /"239"|2027-01-22 to/);
});

test("committed page and CSV show the sample only before the drop, never the Nov 8-13 or old listing figures", () => {
  const today = process.env.FT_BUILD_DATE || easternDate();
  for (const text of [page, csv]) assert.doesNotMatch(text, /372\.1|444\.84|528\.68|"781"|419\.22|Older observation 2026-10-0|\$311/);
  assert.doesNotMatch(page, /November 8-13, (?:five nights|2026, five nights)|November 8-13 &middot;/);
  assert.doesNotMatch(csv, /flexible observation|Nov ?8-13|2026-11-08|2026-11-13/);
  if (today < "2027-01-15") {
    assert.match(page, /About \$239–\$635 a night/);
    assert.match(csv, /"239","2027-01-22 to 2027-01-24","2026-11-22"/);
  } else {
    assert.doesNotMatch(page, /\$239–/);
    assert.doesNotMatch(csv, /"239"/);
  }
});
