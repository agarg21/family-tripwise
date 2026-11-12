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

test("Orlando: family ranges follow their published prices and stale reads hide dollars", () => {
  const orl = data.cities.orlando;
  const o = Object.fromEntries(orl.events.map((ev) => [ev.id, ev]));
  assert.deepEqual(validateHolidayCity(orl), []);
  assert.equal(o["mickeys-party"].cost_low, 2 * 189 + 2 * 179);
  assert.equal(o["mickeys-party"].cost_high, 2 * 229 + 2 * 219);
  assert.equal(o["dazzling-nights"].cost_low, 2 * 35 + 2 * 33);
  assert.equal(o["seaworld-christmas"].cost_low, Math.round(4 * 59.99));
  assert.equal(o["legoland-bricktacular"].cost_low, 4 * 69);
  assert.equal(o["crayola-christmas"].cost_low, Math.round(4 * 30.99));
  assert.equal(o["gatorland-ho-down"].cost_low, Math.round(2 * 34.99 + 2 * 24.99));
  assert.equal(o["festival-of-trees"].cost_low, 2 * 23 + 2 * 15);
  const html = holidayCityPage("orlando", data, "2026-11-04");
  assert.match(html, /≈ \$76 to \$896/);
  // Festival of Trees (Nov 14-22) leaves after its end; the range falls back to Gatorland.
  assert.match(holidayCityPage("orlando", data, "2026-11-23"), /≈ \$120 to \$896/);
  assert.doesNotMatch(holidayCityPage("orlando", data, "2026-11-23"), /festival-of-trees/);
  assert.match(html, /where-to-stay\/orlando-family-hotels\.html/);
  assert.doesNotMatch(holidayCityPage("orlando", data, "2026-12-20").match(/<main[\s\S]*<\/main>/)[0], /\$\d/);
  assert.doesNotMatch(holidayCityPage("orlando", data, "2026-11-10"), /id="[^"]*san-diego/);
});

test("San Antonio: family ranges follow their published prices and stale reads hide dollars", () => {
  const sa = data.cities["san-antonio"];
  const o = Object.fromEntries(sa.events.map((ev) => [ev.id, ev]));
  assert.deepEqual(validateHolidayCity(sa), []);
  assert.equal(o.illuminate.cost_low, Math.round(2 * (29.99 + 3) + 2 * (26.99 + 3)));
  assert.equal(o["six-flags"].cost_low, 4 * 35);
  assert.equal(o["zoo-lights"].cost_low, 4 * 8);
  assert.equal(o.seaworld.cost_low, Math.round(4 * 53.99));
  const html = holidayCityPage("san-antonio", data, "2026-11-04");
  assert.match(html, /≈ \$32 to \$216/);
  assert.match(html, /No strollers, ice chests or carriers/
  );
  assert.match(html, /3 more below/);
  assert.doesNotMatch(holidayCityPage("san-antonio", data, "2026-12-20").match(/<main[\s\S]*<\/main>/)[0], /\$\d/);
});

test("Washington, DC: family ranges follow their published prices and stale reads hide dollars", () => {
  const dc = data.cities["washington-dc"];
  const o = Object.fromEntries(dc.events.map((ev) => [ev.id, ev]));
  assert.deepEqual(validateHolidayCity(dc), []);
  assert.equal(o.zoolights.cost_low, 4 * 10);
  assert.equal(o["mount-vernon"].cost_low, 2 * 58 + 36);
  assert.equal(o.meadowlark.cost_low, 4 * 19);
  assert.equal(o.meadowlark.cost_high, 4 * 23);
  assert.equal(o.enchant.cost_low, 4 * 28);
  const html = holidayCityPage("washington-dc", data, "2026-11-04");
  assert.match(html, /≈ \$30 to \$152/);
  assert.match(html, /family-itinerary\/washington-dc-with-kids\.html/);
  assert.match(html, /Select nights only/);
  assert.match(html, /≈ \$38 for 4 \(\$46 on Dec 14\)/);
  assert.doesNotMatch(holidayCityPage("washington-dc", data, "2026-12-20").match(/<main[\s\S]*<\/main>/)[0], /\$\d/);
});

test("NYC: published prices, what's free, and passed sessions leave", () => {
  const nyc = data.cities["new-york-city"];
  assert.deepEqual(validateHolidayCity(nyc), []);
  const n = Object.fromEntries(nyc.events.map((ev) => [ev.id, ev]));
  assert.equal(n.lightscape.cost_low, 2 * 29 + 2 * 15);
  assert.equal(n.lightscape.cost_high, 2 * 44 + 2 * 28);
  assert.equal(n["bronx-zoo"].cost_low, Math.round(2 * 29.95 + 2 * 14.95));
  assert.equal(n["bronx-zoo"].cost_high, Math.round(2 * 37.95 + 2 * 22.95));
  assert.equal(n["nybg-train-show"].cost_low, 2 * 35 + 2 * 15);
  assert.equal(n["nybg-train-show"].cost_high, 2 * 39 + 2 * 17);
  assert.equal(n["bryant-park-rink"].cost_low, Math.round(4 * 18.72));
  assert.equal(n["bryant-park-rink"].cost_high, Math.round(4 * 64.48));
  const now = holidayCityPage("new-york-city", data, "2026-11-04");
  assert.match(now, /third party/);
  assert.match(now, /Free with your own skates/);
  assert.doesNotMatch(now, /not observed/i);
  const later = holidayCityPage("new-york-city", data, "2026-11-17");
  assert.doesNotMatch(later, /id="vessel-lighting"/);
  assert.doesNotMatch(holidayCityPage("new-york-city", data, "2026-12-04"), /Sensory Inclusive Night/);
  const stale = holidayCityPage("new-york-city", data, "2026-12-20").match(/<main[\s\S]*<\/main>/)[0];
  assert.doesNotMatch(stale, /\$\d/);
  assert.match(stale, /Free with your own skates/);
  assert.equal(openEvents(nyc, "2027-03-01").length, 0);
});

test("Chicago: records, top range and dated lines", () => {
  const chi = data.cities.chicago;
  const c = Object.fromEntries(chi.events.map((ev) => [ev.id, ev]));
  assert.deepEqual(validateHolidayCity(chi), []);
  assert.equal(c.zoolights.cost_low, 4 * 7);
  assert.equal(c.zoolights.cost_high, 4 * 12);
  assert.equal(c["winter-wonderfest"].cost_low, 4 * 27);
  assert.equal(c["winter-wonderfest"].cost_high, 4 * 32);
  assert.equal(c["morton-illumination"].cost_low, 4 * 22);
  assert.equal(c["holiday-magic"].cost_low, Math.round(4 * 29.95));
  const now = holidayCityPage("chicago", data, "2026-11-04");
  assert.match(now, /≈ \$28 to \$128/);
  assert.match(now, /Museum admission, check price/);
  assert.match(now, /Free with your own skates/);
  assert.match(now, /free Mondays to Dec 14/);
  assert.doesNotMatch(now, /Nov&nbsp;7 to Dec&nbsp;31/);
  assert.doesNotMatch(now, /not observed|Macy|Rockefeller/i);
  const nov22 = holidayCityPage("chicago", data, "2026-11-22");
  assert.doesNotMatch(nov22, /id="mag-mile-lights"/);
  assert.doesNotMatch(nov22, /id="tree-lighting"/);
  const dec15 = holidayCityPage("chicago", data, "2026-12-15");
  assert.doesNotMatch(dec15, /free Mondays to|Free on reserved|Free Mondays with|Check Dec 1/);
  assert.match(dec15, /Dec 21 and 28 are not free/);
  const dec24 = holidayCityPage("chicago", data, "2026-12-24");
  assert.doesNotMatch(dec24, /Santa through|Dec 19/);
  const stale = holidayCityPage("chicago", data, "2026-12-20").match(/<main[\s\S]*<\/main>/)[0];
  assert.doesNotMatch(stale, /\$\d/);
  assert.match(stale, /Free with your own skates/);
  assert.match(holidayCityPage("chicago", data, "2027-03-01"), /season's events have ended/);
});

test("an event with an unconfirmed end is never listed as over by December", () => {
  const html = readFileSync(new URL("../site/holidays/new-york-city-christmas-with-kids.html", import.meta.url), "utf8");
  const note = html.match(/Coming in December\?<\/strong>([^<]*)</)?.[1] ?? "";
  assert.ok(!note.includes("Grand Central"), note);
});

for (const city of ["orlando", "new-york-city"]) {
  test(`a dated pick (${city} Thanksgiving weekend) shows until its last day, then drops itself`, () => {
    const label = "Thanksgiving weekend, Fri Nov 27 to Sun Nov 29";
    assert.ok(holidayCityPage(city, holidayCitiesData(), "2026-11-10").includes(label));
    assert.ok(holidayCityPage(city, holidayCitiesData(), "2026-11-29").includes(label));
    assert.ok(!holidayCityPage(city, holidayCitiesData(), "2026-11-30").includes(label));
  });
}

test("the NYC Thanksgiving highlight in the answer box drops after Nov 29", () => {
  const text = "free Santa photos Fri Nov 27";
  assert.ok(holidayCityPage("new-york-city", holidayCitiesData(), "2026-11-29").includes(text));
  assert.ok(!holidayCityPage("new-york-city", holidayCitiesData(), "2026-11-30").includes(text));
});

test("Las Vegas: family figures follow published prices; the unpriced forest says check live", () => {
  const lv = data.cities["las-vegas"];
  assert.deepEqual(validateHolidayCity(lv), []);
  const l = Object.fromEntries(lv.events.map((ev) => [ev.id, ev]));
  assert.equal(l["ethel-m-cactus-garden"].cost_low, 4 * 3);
  assert.equal(l["oasis-ice-rink"].cost_low, 4 * 30);
  const main = holidayCityPage("las-vegas", data, "2026-11-10").match(/<main[\s\S]*<\/main>/)[0];
  assert.match(main, /≈ \$12 to \$120/);
  assert.match(main, /id="magical-forest"[\s\S]*?Check live/);
  assert.doesNotMatch(holidayCityPage("las-vegas", data, "2026-12-20").match(/<main[\s\S]*<\/main>/)[0], /\$\d/);
});
