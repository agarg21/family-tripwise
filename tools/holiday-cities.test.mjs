import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { holidayCitiesData, holidayCityPage, holidayCityPath, validateHolidayCity, openEvents, priceIsFresh } from "./page-generation/holiday-city-page.mjs";
import { easternDate } from "./page-generation/sitemap.mjs";

const data = holidayCitiesData();
const nyc = data.cities["new-york-city"];

test("city records validate and family ranges follow their published prices", () => {
  assert.deepEqual(validateHolidayCity(nyc), []);
  const by = Object.fromEntries(nyc.events.map((ev) => [ev.id, ev]));
  assert.equal(by.lightscape.cost_low, 2 * 29 + 2 * 15);
  assert.equal(by.lightscape.cost_high, 2 * 44 + 2 * 28);
  assert.equal(by["bronx-zoo"].cost_low, Math.round(2 * 29.95 + 2 * 14.95));
  assert.equal(by["bronx-zoo"].cost_high, Math.round(2 * 37.95 + 2 * 22.95));
  assert.equal(by["nybg-train-show"].cost_low, 2 * 35 + 2 * 15);
  assert.equal(by["nybg-train-show"].cost_high, 2 * 39 + 2 * 17);
  assert.equal(by["bryant-park-rink"].cost_low, Math.round(4 * 18.72));
  assert.equal(by["bryant-park-rink"].cost_high, Math.round(4 * 64.48));
});

test("the page leads with what is free and the paid range", () => {
  const html = holidayCityPage("new-york-city", data, "2026-11-04");
  assert.match(html, /Tickets we could price run about \$88 to \$144 for 4/);
  assert.match(html, /Free with your own skates/);
  assert.match(html, /Free, one day only/);
  assert.match(html, /third party/);
  assert.doesNotMatch(html, /not observed/i);
});

test("events and news drop after their dates", () => {
  const html = holidayCityPage("new-york-city", data, "2026-11-17");
  assert.doesNotMatch(html, /id="vessel-lighting"/);
  assert.doesNotMatch(html, /second annual/);
  assert.match(html, /Macy/);
  assert.equal(openEvents(nyc, "2027-03-01").length, 0);
  assert.match(holidayCityPage("new-york-city", data, "2027-03-01"), /season's events have ended/);
});

test("an old read hides every dollar figure", () => {
  const today = "2026-12-20";
  assert.equal(priceIsFresh(nyc.events.find((ev) => ev.id === "lightscape"), today), false);
  const html = holidayCityPage("new-york-city", data, today);
  const main = html.match(/<main[\s\S]*<\/main>/)[0];
  assert.doesNotMatch(main, /\$\d/);
  assert.match(main, /Check live/);
  assert.match(main, /Free with your own skates/);
});

test("passed sessions leave; headings follow the count", () => {
  const dec = holidayCityPage("new-york-city", data, "2026-12-04");
  assert.doesNotMatch(dec, /Sensory Inclusive Night/);
  assert.match(dec, /Dec 18/);
  const jan = holidayCityPage("new-york-city", data, "2027-01-11");
  assert.match(jan, /1 Outing and/);
  assert.match(jan, /Compare the outing,/);
  assert.doesNotMatch(jan, /Sensory needs/);
  const off = holidayCityPage("new-york-city", data, "2027-03-01");
  assert.doesNotMatch(off, /0.Outings|Family of 4 Cost/);
});

test("the committed page is the city page", () => {
  const committed = readFileSync(new URL(`../site/${holidayCityPath("new-york-city")}`, import.meta.url), "utf8");
  assert.ok(committed.includes("Christmas in NYC With Kids"));
  assert.equal(committed.includes("Bronx Zoo Holiday Lights"), easternDate() <= "2027-01-03");
});
