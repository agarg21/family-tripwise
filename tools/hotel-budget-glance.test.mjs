import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createFamilyHotelPages } from "./page-generation/family-hotel-pages.mjs";

// G14 (owner 2026-10-29): the "$ a night" glance must only restate the dated bands the table shows.
const pages = createFamilyHotelPages({});
const catalog = pages.hotelCatalog;
const decode = (value) => value.replaceAll("&amp;", "&").replaceAll("&#39;", "'").replaceAll("&quot;", '"');

// Q19 (OWNER D26, 2026-11-02): the San Antonio glance restates only Google Hotels family-of-4 samples, above the table.
test("san-antonio glance restates family-of-4 samples only, dated and caveated, above the table", () => {
  const html = readFileSync(new URL("../site/where-to-stay/san-antonio-family-hotels.html", import.meta.url), "utf8");
  const glance = html.match(/<section id="san-antonio-budget-glance"[\s\S]*?<\/section>/)?.[0]?.replaceAll("\u00a0", " ");
  assert.ok(glance, "glance missing");
  assert.ok(html.indexOf('id="san-antonio-budget-glance"') < html.indexOf('<table class="comparison-table hotel-comparison">'));
  assert.ok(html.indexOf('id="san-antonio-budget-glance"') < html.indexOf("<h2"), "glance must sit above the first h2");
  assert.match(glance, /Family of 4, two Tuesdays, Jan 19 and Feb 23, 2027 \(estimate\)/);
  assert.match(glance, /Google Hotels, 2 adults \+ kids 5 and 8, seen Nov 2\./);
  assert.doesNotMatch(glance.slice(0, glance.indexOf("<details>")), /July|Older|planning/);
  assert.match(glance, /<strong>From \$164<\/strong> vacation-club resort outside Downtown \(sales offers possible; room type not shown\) <small>\(Wild Oak, Jan 19; up to \$192\)/);
  assert.match(glance, /<strong>From \$493<\/strong> resorts outside Downtown[^<]*<small>\(La Cantera, Feb 23; group up to \$693; no price shown: JW Marriott\)/);
  // Derived from the records: every hotel in exactly one group, each low and high matches its samples.
  const hotels = catalog["san-antonio"];
  const groups = [...glance.matchAll(/<p><strong>([^<]+):<\/strong> ([^<]+?)\.(?: Highest[^<]*)?<\/p>/g)].map((m) => [decode(m[1]), decode(m[2]).split(", ")]);
  assert.deepEqual(groups.flatMap(([, names]) => names).sort(), hotels.map((hotel) => hotel.name).sort());
  for (const [label, names] of groups) {
    const values = names.flatMap((name) => pages.q18Samples(hotels.find((hotel) => hotel.name === name).google, "2026-11-02").map((sample) => sample.nightly));
    assert.ok(glance.includes(`<strong>From $${Math.min(...values)}</strong> ${label}`), label);
  }
  assert.match(glance, /<strong>From \$183<\/strong> Downtown hotels/);
  assert.match(glance, /<strong>From \$320<\/strong> classic River Walk hotels[^<]*<small>\(Contessa, Jan 19; group up to \$654; no price shown: Omni\)/);
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
