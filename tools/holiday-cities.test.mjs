import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { holidayCitiesData, holidayCityPage, holidayCityPath, validateHolidayCity, openEvents, priceIsFresh } from "./page-generation/holiday-city-page.mjs";
import { easternDate } from "./page-generation/sitemap.mjs";

const data = holidayCitiesData();
const sd = data.cities["san-diego"];
const by = Object.fromEntries(sd.events.map((ev) => [ev.id, ev]));

test("city records validate and family ranges follow their published prices", () => {
  assert.deepEqual(validateHolidayCity(sd), []);
  assert.equal(by.lightscape.cost_low, 2 * 28 + 2 * 18);
  assert.equal(by["north-pole-limited"].cost_low, 2 * 30 + 2 * 15);
  assert.equal(by["holiday-wonderland"].cost_low, 4 * 25);
  assert.equal(by["skating-by-the-sea"].cost_low, 4 * 35);
  assert.equal(by["skating-by-the-sea"].cost_high, 4 * 45);
  assert.equal(by["jungle-bells"].cost_low, 2 * 73 + 2 * 63);
  assert.equal(by["jungle-bells"].cost_high, 2 * 78 + 2 * 68);
  assert.equal(by["seaworld-christmas"].cost_low, Math.round(4 * 51.99));
  assert.equal(by["legoland-bricktacular"].cost_low, 4 * 69);
});

test("the page leads with what is free and the paid range", () => {
  const html = holidayCityPage("san-diego", data, "2026-11-04");
  assert.match(html, /≈ \$90 to \$292/);
  assert.match(html, /<strong>Free:<\/strong>/);
  assert.match(html, /From ≈ \$92/);
  assert.doesNotMatch(html.match(/<main[\s\S]*<\/main>/)[0], /not observed|Skate rental and museum|Chicago/i);
});

test("events drop after their dates", () => {
  const html = holidayCityPage("san-diego", data, "2026-12-06");
  assert.doesNotMatch(html, /id="december-nights"/);
  assert.match(html, /id="parade-of-lights"/);
  assert.equal(openEvents(sd, "2027-03-01").length, 0);
  assert.match(holidayCityPage("san-diego", data, "2027-03-01"), /season's events have ended/);
});

test("an old read hides every dollar figure", () => {
  const today = "2026-12-20";
  assert.equal(priceIsFresh(by.lightscape, today), false);
  const main = holidayCityPage("san-diego", data, today).match(/<main[\s\S]*<\/main>/)[0];
  assert.doesNotMatch(main, /\$\d/);
  assert.match(main, /Check live/);
});

test("headings follow the count off season", () => {
  assert.doesNotMatch(holidayCityPage("san-diego", data, "2027-03-01"), /0.Outings|Family of 4 Cost/);
});

test("the committed page is the city page", () => {
  const committed = readFileSync(new URL(`../site/${holidayCityPath("san-diego")}`, import.meta.url), "utf8");
  assert.ok(committed.includes("Christmas in San Diego With Kids") || committed.includes("Christmas in San&nbsp;Diego With Kids"));
  assert.equal(committed.includes("Lightscape"), easternDate() <= "2027-01-03");
});
