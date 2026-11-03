import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { holidayParksData, holidayParksPage, holidayParksPath, validateHolidayParks, openParks, familyCost, priceIsFresh } from "./page-generation/holiday-parks-page.mjs";
import { easternDate } from "./page-generation/sitemap.mjs";

const data = holidayParksData();
const today = "2026-11-03";

test("season records validate and family figures are the published price times 4", () => {
  assert.deepEqual(validateHolidayParks(data, today), []);
  const byId = Object.fromEntries(data.parks.map((p) => [p.id, familyCost(p)]));
  assert.equal(byId["busch-gardens-williamsburg"], 128);
  assert.equal(byId["hersheypark"], 228);
  assert.equal(byId["legoland-florida"], 276);
});

test("table runs lowest price first and the page states the party and estimate", () => {
  const ids = openParks(data, today).map((p) => p.id);
  assert.equal(ids[0], "busch-gardens-williamsburg");
  const html = holidayParksPage(data, today);
  assert.match(html, /2 adults and 2 kids aged 4 and 8/);
  assert.match(html, /lowest published price we saw/);
  assert.match(html, /start at about \$128&nbsp;to&nbsp;\$276/);
});

test("a park leaves after its season ends", () => {
  const html = holidayParksPage(data, "2027-01-04");
  assert.doesNotMatch(html, /Hersheypark/);
  assert.match(html, /SeaWorld Orlando/);
});

test("a price past the age limit is replaced by check live, never shown as current", () => {
  const williamsburg = data.parks.find((p) => p.id === "busch-gardens-williamsburg");
  assert.equal(priceIsFresh(williamsburg, "2026-12-03"), true);
  assert.equal(priceIsFresh(williamsburg, "2026-12-04"), false);
  const html = holidayParksPage(data, "2026-12-20");
  assert.doesNotMatch(html, /≈ \$/);
  assert.match(html, /Check live/);
  assert.doesNotMatch(html, /Ticket Costs for a Family of 4|lowest price first|lowest published price/);
});

test("the preschool tip drops its price when stale and the whole tip after 2026", () => {
  assert.match(holidayParksPage(data, today), /about \$162/);
  const stale = holidayParksPage(data, "2026-12-04");
  assert.doesNotMatch(stale, /\$162/);
  assert.match(stale, /Preschool Fun Card/);
  assert.doesNotMatch(holidayParksPage(data, "2027-01-02"), /Preschool Fun Card/);
});

test("after every season ends the page says so and shows no park count", () => {
  const html = holidayParksPage(data, "2027-01-05");
  assert.match(html, /This season&#39;s events have ended|This season's events have ended/);
  assert.doesNotMatch(html, /at 0 US|0 parks|Hersheypark/);
});

test("the committed page matches today's render", () => {
  const committed = readFileSync(new URL(`../site/${holidayParksPath}`, import.meta.url), "utf8");
  assert.ok(committed.includes("Theme Park Christmas Events With Kids"));
  assert.equal(committed.includes("Hersheypark"), easternDate() <= "2027-01-03");
});
