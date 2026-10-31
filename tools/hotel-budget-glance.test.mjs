import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createFamilyHotelPages } from "./page-generation/family-hotel-pages.mjs";

// G14 (owner 2026-10-29): the "$ a night" glance must only restate the dated bands the table shows.
const catalog = createFamilyHotelPages({}).hotelCatalog;
const decode = (value) => value.replaceAll("&amp;", "&").replaceAll("&#39;", "'").replaceAll("&quot;", '"');

// Q18 (2026-10-31): San Antonio retired its editorial bands; the glance restates only the observed samples.
test("san-antonio sample glance restates observed samples only, dated and caveated, above the table", () => {
  const html = readFileSync(new URL("../site/where-to-stay/san-antonio-family-hotels.html", import.meta.url), "utf8");
  const glance = html.match(/<section id="san-antonio-budget-glance"[\s\S]*?<\/section>/)?.[0];
  assert.ok(glance, "glance missing");
  assert.ok(html.indexOf(glance) < html.indexOf('<table class="comparison-table hotel-comparison">'));
  assert.ok(html.indexOf(glance) < html.indexOf("<h2"), "glance must sit above the first h2");
  assert.match(glance, /Older one-night prices per room \(mostly 2 adults\), seen July 26, 2026:/);
  assert.match(glance, /No current family-room rate observed/);
  assert.match(glance, /Check live rates for your dates, room and kids(&#39;|') ages\./);
  assert.doesNotMatch(glance, /href="#|planning|\+<\/strong>/);
  const hotels = catalog["san-antonio"];
  const items = [...glance.matchAll(/<li><strong>\$([\d,]+)–\$([\d,]+)<\/strong> ([^<(]+) \((\d+) hotels\)(?: <small>[^<]*<\/small>)?<\/li>/g)];
  assert.equal(items.length, (glance.match(/<li>/g) || []).length, "every glance line must parse");
  const groups = new Map([...glance.matchAll(/<p><strong>([^<]+):<\/strong> ([^<]+)<\/p>/g)].map((m) => [decode(m[1]), decode(m[2])]));
  for (const item of items) item[3] = groups.get(decode(item[3]));
  assert.ok(items.every((item, i) => item[3] && item[3].split(", ").length === Number([...glance.matchAll(/\((\d+) hotels\)/g)][i][1])));
  const listed = items.flatMap((item) => item[3].trim().split(", "));
  assert.deepEqual([...listed].sort(), hotels.map((hotel) => hotel.name).sort(), "every hotel appears exactly once");
  for (const [, low, high, names] of items) {
    const values = decode(names).trim().split(", ").flatMap((name) => hotels.find((hotel) => hotel.name === name).olderSample.amount.match(/\d+/g).map(Number));
    assert.equal(Number(low), Math.min(...values));
    assert.equal(Number(high), Math.max(...values));
  }
  assert.match(glance, /<small>\(Wild Oak \$249 is before taxes\)<\/small>/);
});

// Q18 (2026-10-31): Las Vegas retired its editorial bands too. Hotels without one exact comparable
// figure (Grand Chateau "low to mid $200s", Cancun Resort's past-stay sample) are named, not priced.
test("las-vegas sample glance restates observed samples only and names the unpriced hotels", () => {
  const html = readFileSync(new URL("../site/where-to-stay/las-vegas-family-hotels.html", import.meta.url), "utf8");
  const glance = html.match(/<section id="las-vegas-budget-glance"[\s\S]*?<\/section>/)?.[0];
  assert.ok(glance, "glance missing");
  assert.ok(html.indexOf(glance) < html.indexOf('<table class="comparison-table hotel-comparison">'));
  assert.ok(html.indexOf(glance) < html.indexOf("<h2"), "glance must sit above the first h2");
  assert.match(glance, /Older prices per room \(some for 2 adults\), seen July 22, 2026:/);
  assert.match(glance, /No current family-room rate observed/);
  assert.doesNotMatch(glance, /href="#|planning|\+<\/strong>|\$119/);
  const hotels = catalog["las-vegas"];
  const items = [...glance.matchAll(/<li><strong>\$([\d,]+)(?:–\$([\d,]+))?<\/strong> ([^<(]+) \((\d+) hotels?\)(?: <small>\(([^<]*)\)<\/small>)?<\/li>/g)];
  assert.equal(items.length, (glance.match(/<li>/g) || []).length, "every glance line must parse");
  const groups = new Map([...glance.matchAll(/<p><strong>([^<]+):<\/strong> ([^<]+)<\/p>/g)].map((m) => [decode(m[1]), decode(m[2]).split(", ")]));
  const listed = items.flatMap((item) => groups.get(decode(item[3]).trim()));
  assert.deepEqual([...listed].sort(), hotels.map((hotel) => hotel.name).sort(), "every hotel appears exactly once");
  for (const [, low, high, label, count, note] of items) {
    const members = groups.get(decode(label).trim()).map((name) => hotels.find((hotel) => hotel.name === name));
    assert.equal(members.length, Number(count));
    const priced = members.filter((hotel) => !hotel.glanceNote);
    const values = priced.flatMap((hotel) => hotel.olderSample.amount.match(/\d+/g).map(Number));
    assert.equal(Number(low), Math.min(...values));
    assert.equal(Number(high ?? low), Math.max(...values));
    for (const hotel of members.filter((entry) => entry.glanceNote)) assert.ok(decode(note ?? "").includes(`${hotel.shortName}: ${hotel.glanceNote}`));
  }
  assert.match(glance, /Grand Chateau: low to mid \$200s before tax, no exact figure/);
  assert.match(glance, /Cancun Resort: no figure shown, its only sample was for a July 27 stay/);
});
