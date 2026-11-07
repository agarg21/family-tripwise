import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createFamilyHotelPages } from "./page-generation/family-hotel-pages.mjs";

// G14 (owner 2026-10-29): the "$ a night" glance must only restate the dated bands the table shows.
const pages = createFamilyHotelPages({});
const catalog = pages.hotelCatalog;
const decode = (value) => value.replaceAll("&amp;", "&").replaceAll("&#39;", "'").replaceAll("&quot;", '"');

// G18 (OWNER D39): the San Antonio glance restates only the family-of-4 weekend, above the table and the first h2.
test("san-antonio glance restates the family-of-4 weekend only, dated and caveated, above the table", () => {
  const html = readFileSync(new URL("../site/where-to-stay/san-antonio-family-hotels.html", import.meta.url), "utf8");
  const glance = html.match(/<section id="san-antonio-budget-glance"[\s\S]*?<\/section>/)?.[0]?.replaceAll("\u00a0", " ");
  assert.ok(glance, "glance missing");
  assert.ok(html.indexOf('id="san-antonio-budget-glance"') < html.indexOf('<table class="comparison-table hotel-comparison">'));
  assert.ok(html.indexOf('id="san-antonio-budget-glance"') < html.indexOf("<h2"), "glance must sit above the first h2");
  assert.match(glance, /Family of 4, Fri–Sun, Jan 22–24, 2027 \(estimate\)/);
  assert.match(glance, /Google Hotels, 2 adults \+ kids 5 and 8, seen Nov 5\./);
  assert.doesNotMatch(glance, /Tuesday|July|Older/);
  assert.match(glance, /\(Wild Oak, 2 nights ≈ \$364, sales offers possible\)/);
  const hotels = catalog["san-antonio"];
  const groups = [...glance.matchAll(/<p><strong>([^<]+):<\/strong> ([^<]+?)\.<\/p>/g)].map((m) => decode(m[2]).split(", "));
  assert.deepEqual(groups.flat().sort(), hotels.map((hotel) => hotel.name).sort());
});

// Q18 (2026-10-31): Las Vegas retired its editorial bands too. Hotels without one exact comparable
// figure (Grand Chateau "low to mid $200s", Cancun Resort's past-stay sample) are named, not priced.
// Chicago and Las Vegas moved to weekend prices (G18): tools/chicago-weekend-prices.test.mjs, tools/las-vegas-weekend-prices.test.mjs.

test("Q18p: Las Vegas Fits line rests on each hotel's own record", () => {
  const html = readFileSync(new URL("../site/where-to-stay/las-vegas-family-hotels.html", import.meta.url), "utf8");
  const box = html.match(/<section id="las-vegas-hotel-answer"[\s\S]*?<\/section>/)?.[0];
  assert.ok(box && html.indexOf(box) < html.indexOf('id="hotel-comparison"'));
  const text = (name) => { const h = catalog["las-vegas"].find((hotel) => hotel.name === name); return [h.familySetup, ...h.strengths].join(" "); };
  assert.match(text("Mandalay Bay Resort and Casino"), /beach complex[\s\S]*Shark Reef/);
  assert.match(text("Vdara Hotel & Spa"), /kitchenette[\s\S]*casino-free/);
  assert.match(text("Marriott's Grand Chateau"), /kitchen/);
  assert.match(text("Tahiti Village Resort"), /lazy river/);
  assert.match(text("Hilton Vacation Club Cancun Resort Las Vegas"), /waterslides/);
  assert.match(text("Four Seasons Hotel Las Vegas"), /non-gaming[\s\S]*Mandalay Beach/);
  assert.match(box, /The catch:<\/strong> taxes, resort fees and parking can sit on top/);
});
