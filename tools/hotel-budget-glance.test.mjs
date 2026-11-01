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
// Q18 (D25, 2026-11-01): the Las Vegas glance restates only Google Hotels family-of-four prices from the receipts.
test("las-vegas glance restates only receipt prices, sorted, naming the lowest hotel", () => {
  const html = readFileSync(new URL("../site/where-to-stay/las-vegas-family-hotels.html", import.meta.url), "utf8");
  const glance = html.match(/<section id="las-vegas-budget-glance"[\s\S]*?<\/section>/)?.[0];
  assert.ok(glance, "glance missing");
  assert.ok(html.indexOf(glance) < html.indexOf('<table class="comparison-table hotel-comparison">'));
  assert.ok(html.indexOf(glance) < html.indexOf("<h2"), "glance must sit above the first h2");
  assert.match(glance, /<strong>About how much a night\?<\/strong> Family of 4, weeknights Jan–Feb 2027 \(estimate; lowest Feb 23\):[\s\S]*Google Hotels, 2 adults \+ kids 5 and 8, seen Oct 31\./);
  assert.doesNotMatch(glance.slice(0, glance.indexOf("<details>")), /July|Older|planning|\+<\/strong>/);
  // Independent reading of the receipts: exact title, one unpaid USD row, positive integer price.
  const receipts = ["q18-lv-chicago-hotel-prices-a", "q18-lv-chicago-hotel-prices-b", "q18-lv-hotel-prices-d", "q18-lv-hotel-prices-e", "q18-lv-hotel-prices-f"]
    .map((name) => JSON.parse(readFileSync(new URL(`../docs/research/dataforseo-${name}-2026-11-01.json`, import.meta.url), "utf8")));
  const hotels = catalog["las-vegas"];
  const pricesOf = (hotel) => receipts.flatMap((receipt) => receipt.searches).filter((search) => search.label.startsWith(`${hotel.google.prefix}-`))
    .flatMap((search) => { const rows = search.matched.filter((row) => row.title === hotel.google.title); return rows.length === 1 && !rows[0].is_paid && rows[0].currency === "USD" && rows[0].price > 0 ? [rows[0].price] : []; });
  const items = [...glance.matchAll(/<li><strong>From \$([\d,]+)<\/strong> ([^<]+?) <small>\(([^;)]+)(?:; (?:group )?up to \$([\d,]+))?\)<\/small><\/li>/g)];
  assert.equal(items.length, (glance.match(/<li>/g) || []).length, "every glance line must parse");
  assert.equal(items.length, 4);
  const groups = new Map([...glance.matchAll(/<p><strong>([^<]+):<\/strong> ([^<]+?)\.(?: Highest: [^<]+)?<\/p>/g)].map((m) => [decode(m[1]), decode(m[2]).split(", ")]));
  assert.deepEqual([...groups.values()].flat().sort(), hotels.map((hotel) => hotel.name).sort(), "every hotel appears exactly once");
  const num = (value) => Number(value.replace(/,/g, ""));
  for (const [, low, label, lowName, high] of items) {
    const lowValue = low;
    const members = groups.get(decode(label)).map((name) => hotels.find((hotel) => hotel.name === name));
    const values = members.flatMap(pricesOf);
    assert.equal(num(low), Math.min(...values));
    assert.equal(num(high ?? low), Math.max(...values));
    assert.equal(num(lowValue), Math.min(...values));
    assert.ok(members.some((hotel) => hotel.shortName === decode(lowName) && pricesOf(hotel).includes(num(lowValue))));
  }
  const lows = items.map((item) => num(item[1]));
  assert.deepEqual(lows, [...lows].sort((a, b) => a - b), "lines sorted by lowest figure");
});

test("Q18p: LV and Chicago glances link live rates, hedge weekend claims and avoid double colons", () => {
  for (const page of ["las-vegas", "chicago"]) {
    const html = readFileSync(new URL(`../site/where-to-stay/${page}-family-hotels.html`, import.meta.url), "utf8");
    const glance = html.match(new RegExp(`<section id="${page}-budget-glance"[\\s\\S]*?</section>`))?.[0];
    assert.ok(glance, `${page} glance missing`);
    assert.match(glance, /<p class="q18-basis">[^<]*<a href="#hotel-comparison">Check live rates for your dates<\/a>\.<\/p>/);
    assert.doesNotMatch(html, /often (cost more|add resort)|events cost more|Price samples are older/);
    assert.doesNotMatch(html, /\d{4}: \$\d/, "date then colon then price reads as a double colon");
    assert.match(glance, /Highest: \$[\d,]+, [^<]+\.<\/p>/, "the group maximum names its own hotel in the details");
    assert.match(html, /Nightly prices are Google Hotels listing prices for a family of 4 on dated nights, not booking quotes; each one comes off this page a week before its date\./);
  }
});

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
  assert.match(box, /Main catch:<\/strong> Google does not show the room type, taxes, resort fees or parking/);
});
