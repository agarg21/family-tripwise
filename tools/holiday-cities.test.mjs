import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { holidayCitiesData, holidayCityPage, holidayCityPath, validateHolidayCity, openEvents, priceIsFresh } from "./page-generation/holiday-city-page.mjs";
import { easternDate } from "./page-generation/sitemap.mjs";

const data = holidayCitiesData();
const chi = data.cities.chicago;
const by = Object.fromEntries(chi.events.map((ev) => [ev.id, ev]));

test("city records validate and family ranges follow their published prices", () => {
  assert.deepEqual(validateHolidayCity(chi), []);
  assert.equal(by.zoolights.cost_low, 4 * 7);
  assert.equal(by.zoolights.cost_high, 4 * 12);
  assert.equal(by["winter-wonderfest"].cost_low, 4 * 27);
  assert.equal(by["winter-wonderfest"].cost_high, 4 * 32);
  assert.equal(by["morton-illumination"].cost_low, 4 * 22);
  assert.equal(by["holiday-magic"].cost_low, Math.round(4 * 29.95));
});

test("the page leads with what is free and the paid range", () => {
  const html = holidayCityPage("chicago", data, "2026-11-04");
  assert.match(html, /≈ \$28 to \$128/);
  assert.match(html, /Museum admission, check price/);
  assert.doesNotMatch(html, /Nov&nbsp;7 to Dec&nbsp;31/);
  assert.match(html, /Free with your own skates/);
  assert.match(html, /<strong>Free:<\/strong>/);
  assert.match(html, /free on 4 Mondays/);
  assert.doesNotMatch(html, /not observed|Macy|Rockefeller/i);
});

test("events drop after their dates", () => {
  const html = holidayCityPage("chicago", data, "2026-11-22");
  assert.doesNotMatch(html, /id="mag-mile-lights"/);
  assert.doesNotMatch(html, /id="tree-lighting"/);
  assert.match(html, /id="zoolights"/);
  assert.equal(openEvents(chi, "2027-03-01").length, 0);
  assert.match(holidayCityPage("chicago", data, "2027-03-01"), /season's events have ended/);
});

test("an old read hides every dollar figure", () => {
  const today = "2026-12-20";
  assert.equal(priceIsFresh(by.zoolights, today), false);
  const main = holidayCityPage("chicago", data, today).match(/<main[\s\S]*<\/main>/)[0];
  assert.doesNotMatch(main, /\$\d/);
  assert.match(main, /Check live/);
  assert.match(main, /Free with your own skates/);
});

test("passed sessions leave; headings follow the count", () => {
  const dec = holidayCityPage("chicago", data, "2026-12-04");
  assert.doesNotMatch(holidayCityPage("chicago", data, "2026-12-04"), /Sensory/);
  const jan = holidayCityPage("chicago", data, "2027-01-01");
  assert.doesNotMatch(jan, /Free on 4 Mondays|Santa nightly|Santa is included/);
  assert.match(jan, /Cold or wet day/);
  const off = holidayCityPage("chicago", data, "2027-03-01");
  assert.doesNotMatch(off, /0.Outings|Family of 4 Cost/);
});

test("the committed page is the city page", () => {
  const committed = readFileSync(new URL(`../site/${holidayCityPath("chicago")}`, import.meta.url), "utf8");
  assert.ok(committed.includes("Christmas in Chicago With Kids"));
  assert.equal(committed.includes("ZooLights"), easternDate() <= "2027-01-03");
});
