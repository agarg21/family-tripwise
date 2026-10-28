import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { currentChecks, dealCheckPage, dealPagePath, dealsHubPage, readDealChecks, validateDealChecks } from "./page-generation/deals-pages.mjs";
import { easternDate } from "./page-generation/sitemap.mjs";

const site = new URL("../site/", import.meta.url);
const checks = readDealChecks();
const today = easternDate();

const base = {
  id: "x-deal", operator: "Operator", category: "Cruise", title: "A deal", headline: "Kids free on select dates.",
  family_of_four: "Two adults pay; two kids do not.", source_label: "Official offer page",
  terms: [["Book by", "November 2, 2026."], ["Travel window", "Through 2027."], ["Child ages", "12 and under."], ["Still charged", "Taxes."], ["Minimum nights", "3 nights."]],
  unclear: ["Blackout dates are not listed."], before_booking: ["Price the trip with and without the kids."],
  family_total: null, official_url: "https://example.org/deal", observed_on: "2026-10-28", expires_on: "2026-11-02"
};
const check = (patch, t = "2026-10-28") => validateDealChecks([{ ...base, ...patch }], { today: t });

test("every deal check validates: official https source, dated, book-by, travel and child-age rows", () => {
  assert.deepEqual(validateDealChecks(checks, { today }), []);
  assert.ok(checks.length >= 2, "G02 acceptance: at least 2 checks");
  for (const c of checks) assert.equal(c.family_total, null, `${c.id}: no family total was observed (docs/research/deal-checks-2026-10-28.md)`);
});

test("the validator rejects missing family terms, bad dates, unobserved totals and carried-forward years", () => {
  assert.deepEqual(check({}), []);
  assert.ok(check({ terms: base.terms.filter(([l]) => l !== "Child ages") }).some((p) => /Child ages/.test(p)));
  assert.ok(check({ terms: base.terms.filter(([l]) => l !== "Book by") }).some((p) => /Book by/.test(p)));
  assert.ok(check({ expires_on: "2026-02-30" }).some((p) => /expires_on must be a real/.test(p)));
  assert.ok(check({ expires_on: "2026-10-01" }).some((p) => /before observed_on/.test(p)));
  assert.ok(check({ observed_on: "2026-10-29" }).some((p) => /future/.test(p)));
  assert.ok(check({ official_url: "http://example.org" }).some((p) => /https/.test(p)));
  assert.ok(check({ headline: "Kids free through 2025." }).some((p) => /mentions 2025/.test(p)));
  assert.ok(check({ family_total: { amount: "about $2,000" } }).some((p) => /family_total/.test(p)), "a total needs amount, party, dates, inclusions and observation date");
  const total = { amount: "USD 2,410.00", party: "2 adults and 2 children ages 6 and 9", stay_from: "2026-11-10", stay_to: "2026-11-14", includes: "cruise fare plus taxes, fees and port expenses", observed_on: "2026-10-28" };
  assert.deepEqual(check({ family_total: total }), []);
  assert.ok(check({ family_total: total }, "2026-11-11").some((p) => /stay dates have started or passed/.test(p)));
  assert.ok(validateDealChecks([base, base], { today: "2026-10-28" }).some((p) => /duplicate/.test(p)));
});

test("ended checks leave the hub; their page says the offer ended and drops the booking checklist", () => {
  const other = { ...base, id: "y-deal", expires_on: "2026-12-05" };
  const list = [base, other];
  assert.deepEqual(currentChecks(list, "2026-11-02").map((c) => c.id), ["x-deal", "y-deal"]);
  assert.deepEqual(currentChecks(list, "2026-11-03").map((c) => c.id), ["y-deal"]);
  const hub = dealsHubPage(list, "2026-11-03");
  assert.ok(!hub.includes('id="x-deal"'));
  assert.ok(hub.includes('id="y-deal"'));
  const ended = dealCheckPage(list, base, "2026-11-03");
  assert.match(ended, /This offer ended November 2, 2026\./);
  assert.doesNotMatch(ended, /Before you book, check/);
  assert.match(ended, /y-deal\.html">A deal<\/a> <span class="fresh-upcoming-meta">\(book by December 5, 2026\)/);
  assert.match(dealCheckPage(list, other, "2026-11-03"), /x-deal\.html">A deal<\/a> <span class="fresh-upcoming-meta">\(ended November 2, 2026\)/);
  assert.match(dealCheckPage(list, base, "2026-11-02"), /Book by November 2, 2026<\/strong>/);
  assert.match(dealsHubPage(list, "2026-12-06"), /No verified family deals are open right now/);
});

test("committed deal pages match today's render (refreshed daily by tools/this-week.mjs)", () => {
  const hub = readFileSync(new URL("deals/index.html", site), "utf8");
  assert.equal(hub, dealsHubPage(checks, today), "run node tools/generate-pages.mjs or node tools/this-week.mjs");
  for (const c of checks) {
    const html = readFileSync(new URL(dealPagePath(c), site), "utf8");
    assert.equal(html, dealCheckPage(checks, c, today), `${c.id} is stale`);
    assert.ok(html.includes(c.official_url.replaceAll("&", "&amp;")), `${c.id} links its official page`);
    assert.match(html, /Official page, checked [A-Z][a-z]+ \d{1,2}, 20\d\d: <a href="https:\/\//);
    assert.match(html, /<link rel="canonical" href="https:\/\/familytripwise\.com\/deals\/[a-z0-9-]+\.html">/);
  }
});

test("no deal page shows an unobserved family total, a build date or a firsthand claim", () => {
  for (const c of checks) {
    const html = dealCheckPage(checks, c, "2026-10-28");
    assert.match(html, /Not observed\. Check live\./, `${c.id} shows check live`);
    assert.match(html, /We have not booked these offers/);
    assert.doesNotMatch(html, /Updated|updated on|we stayed|we sailed/i);
  }
});

test("a deadline that is our reading carries its note on the hub and both status lines", () => {
  const noted = { ...base, expires_note: "the offer page gives no year for this date; 2026 is our reading" };
  assert.match(dealsHubPage([noted], "2026-10-28"), /Book by:<\/strong> November 2, 2026 \(the offer page gives no year/);
  assert.match(dealCheckPage([noted], noted, "2026-10-28"), /Book by November 2, 2026<\/strong> \(the offer page gives no year/);
  assert.match(dealCheckPage([noted], noted, "2026-11-03"), /This offer ended November 2, 2026 \(the offer page gives no year[^)]*\)\./);
  assert.ok(check({ expires_note: "x" }).some((p) => /expires_note/.test(p)));
  const gw = checks.find((c) => c.id === "great-wolf-lodge-fall-flash-sale");
  assert.ok(gw?.expires_note, "Great Wolf's page gives no year for November 1");
});

test("the Deals header link is current only on deal pages", () => {
  const guide = readFileSync(new URL("where-to-stay/boston-family-hotels.html", site), "utf8");
  assert.match(guide, /<a class="header-this-week header-deals" href="\.\.\/deals\/">Deals<\/a>/);
  assert.match(readFileSync(new URL("deals/index.html", site), "utf8"), /href="\.\.\/deals\/" aria-current="page">Deals/);
  assert.match(readFileSync(new URL(dealPagePath(checks[0]), site), "utf8"), /href="\.\.\/deals\/" aria-current="true">Deals/);
});

test("G02b: terms table keeps table semantics when stacked; status line does not repeat 'per the official page' after a date note", () => {
  const page = dealCheckPage([base], base, "2026-10-28");
  assert.match(page, /<table class="deal-terms" role="table">/);
  assert.match(page, /<tr role="row"><th scope="row" role="rowheader">Book by<\/th><td role="cell">November 2, 2026\.<\/td><\/tr>/);
  assert.match(page, /, per the official page checked October 28, 2026\.<\/p>/);
  const noted = { ...base, expires_note: "the page gives no year for this date" };
  const notedPage = dealCheckPage([noted], noted, "2026-10-28");
  assert.match(notedPage, /<strong>Book by November 2, 2026<\/strong> \(the page gives no year for this date\); official page checked October 28, 2026\.<\/p>/);
  assert.doesNotMatch(notedPage, /\), per the official page/);
});

test("SeaWorld Fun Card check keeps the record's per-person basis, unclear prices and no family total", () => {
  const sw = checks.find((c) => c.id === "seaworld-orlando-2027-fun-card");
  assert.ok(sw, "added 2026-10-28 (docs/research/deal-checks-2026-10-28.md)");
  assert.equal(sw.official_url, "https://seaworld.com/orlando/tickets/fun-card/");
  assert.equal(sw.family_total, null);
  assert.match(sw.family_of_four, /no separate child price/);
  assert.ok(sw.unclear.some((u) => /USD 151\.99/.test(u)), "the second price figure stays flagged as unclear");
  assert.ok(sw.terms.some(([l, v]) => l === "Not included" && /Parking/.test(v)));
});

test("short deal lists keep the date note, so a date that is not a stated deadline never reads as 'book by'", () => {
  const noted = { ...base, id: "z-deal", expires_on: "2026-12-31", expires_note: "no purchase deadline is stated; this is our reading" };
  const list = [base, noted];
  const hub = dealsHubPage(list, "2026-10-28");
  assert.match(hub, /z-deal">Operator<\/a> <span class="fresh-upcoming-meta">\(listed until December 31, 2026; no purchase deadline is stated; this is our reading\)/);
  assert.doesNotMatch(hub, /book by December 31, 2026/);
  assert.match(dealCheckPage(list, base, "2026-10-28"), /z-deal\.html">A deal<\/a> <span class="fresh-upcoming-meta">\(listed until December 31, 2026; no purchase deadline/);
});
