import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { isRealDeal, REAL_DEAL_MIN_PCT, currentChecks, dealUrgency, dealCheckPage, dealPagePath, dealsHubPage, priceSampleLine, readDealChecks, spendSave, validateDealChecks } from "./page-generation/deals-pages.mjs";
import { easternDate } from "./page-generation/sitemap.mjs";

const site = new URL("../site/", import.meta.url);
const checks = readDealChecks();
const today = easternDate();

const base = {
  id: "x-deal", operator: "Operator", category: "Cruise", title: "A deal", headline: "Kids free on select dates.",
  family_of_four: "Two adults pay; two kids do not.", source_label: "Official offer page",
  terms: [["Book by", "November 2, 2026."], ["Travel window", "Through 2027."], ["Child ages", "12 and under."], ["Still charged", "Taxes."], ["Minimum nights", "3 nights."]],
  unclear: ["Blackout dates are not listed."], before_booking: ["Price the trip with and without the kids."],
  family_total: null, official_url: "https://example.org/deal", observed_on: "2026-10-28", expires_on: "2026-11-02",
  score: {
    scored_on: "2026-10-28",
    family_value: { level: "unknown", basis: "No family total for named dates was observed." },
    appeal: { level: "broad", fits: "Families with kids 12 and under." },
    novelty: { level: "none_found", checked_on: "2026-10-28", links: [] },
    verdict: "only_for", who: "Families with kids 12 and under on 3+ night sailings.", why: "Kids pay no fare but taxes still apply."
  }
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
    const html = dealCheckPage(checks, c, "2026-10-30");
    if (c.v2) {
      // v2 (G11): no "Not observed" section; the unknown trip cost is one line saying what to check.
      assert.doesNotMatch(html, /Not observed/i, `${c.id} v2 has no placeholder`);
      if (c.v2.spend_save) assert.match(html, /class="spend-save[^"]*"[^>]*>.*Without the deal/s, `${c.id} v3 shows the spend-vs-save card`);
      else assert.match(html, /Trip cost: we have no (?:checked|complete trip) price for a family of 4/);
      assert.match(html, /We have not booked this offer/);
    } else {
      assert.match(html, /Not observed\. Check live\./, `${c.id} shows check live`);
      assert.match(html, /We have not booked these offers/);
    }
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
  const noted = { ...base, id: "z-deal", expires_on: "2026-12-31", deadline_stated: false, expires_note: "no purchase deadline is stated; this is our reading" };
  const list = [base, noted];
  const hub = dealsHubPage(list, "2026-10-28");
  // D22: unpriced offers are not in "Closing soonest"; they sit in the collapsed "Not priced" list.
  assert.doesNotMatch(hub.split('aria-labelledby="deals-other-title"')[0], /z-deal/);
  assert.match(hub.split('aria-labelledby="deals-other-title"')[1], /id="z-deal"/);
  assert.doesNotMatch(hub, /book by December 31, 2026/);
  assert.match(dealCheckPage(list, base, "2026-10-28"), /z-deal\.html">A deal<\/a> <span class="fresh-upcoming-meta">\(listed until December 31, 2026; no purchase deadline/);
});

test("a listing date that is not a stated deadline reads 'Listed until' on the hub card, status line and social text; a stated deadline with a year note keeps 'book by'", async () => {
  const listed = { ...base, id: "z-deal", expires_on: "2026-12-31", deadline_stated: false, expires_note: "no purchase deadline is stated; this is our reading" };
  const yearNote = { ...base, id: "y-deal", expires_note: "the offer page gives no year for this date; 2026 is our reading" };
  const list = [base, listed, yearNote];
  const hub = dealsHubPage(list, "2026-10-28");
  // Hub cards (persona review 2026-10-30): no stated deadline reads plainly, without our listing date.
  assert.match(hub, /<strong>Deadline:<\/strong> none posted on the official page \(checked [A-Z][a-z]+ \d+, 2026\); it could end any time\./);
  assert.doesNotMatch(hub, /<strong>(Book by|Listed until):<\/strong> December 31, 2026/);
  const page = dealCheckPage(list, listed, "2026-10-28");
  assert.match(page, /<p class="deal-status"><strong>Listed until December 31, 2026<\/strong>/);
  assert.match(dealCheckPage(list, base, "2026-10-28"), /y-deal\.html">A deal<\/a> <span class="fresh-upcoming-meta">\(book by November 2, 2026; the offer page gives no year/);
  assert.ok(validateDealChecks([{ ...base, deadline_stated: false }], { today: "2026-10-28" }).some((p) => /needs an expires_note/.test(p)));
  assert.ok(validateDealChecks([{ ...base, deadline_stated: "no" }], { today: "2026-10-28" }).some((p) => /deadline_stated must be/.test(p)));
  const sw = checks.find((c) => c.id === "seaworld-orlando-2027-fun-card");
  assert.equal(sw.deadline_stated, false, "SeaWorld states no purchase deadline");
});

test("an ended check whose date was never a stated deadline says we stopped listing it, not that the offer ended", () => {
  const listed = { ...base, id: "z-deal", expires_on: "2026-12-31", deadline_stated: false, expires_note: "no purchase deadline is stated; this is our reading" };
  const list = [base, listed];
  const page = dealCheckPage(list, listed, "2027-01-01");
  assert.match(page, /<strong>We stopped listing this check after December 31, 2026 \(no purchase deadline is stated; this is our reading\)\.<\/strong>/);
  assert.doesNotMatch(page, /This offer ended/);
  assert.match(dealCheckPage(list, base, "2027-01-01"), /z-deal\.html">A deal<\/a> <span class="fresh-upcoming-meta">\(no longer listed after December 31, 2026\)/);
  assert.match(dealCheckPage(list, base, "2027-01-01"), /This offer ended November 2, 2026\./, "a stated deadline still reads 'This offer ended'");
});

test("Margaritaville at Sea check keeps the record: 2026 booking window, fees on USD 0 fares, no child ages, no family total", () => {
  const m = checks.find((c) => c.id === "margaritaville-at-sea-black-friday-early-access");
  assert.ok(m, "added 2026-10-28 evening (docs/research/deal-checks-2026-10-28.md)");
  assert.equal(m.expires_on, "2026-11-03");
  assert.equal(m.deadline_stated, undefined);
  assert.equal(m.family_total, null);
  assert.ok(m.terms.some(([l, v]) => l === "Book by" && /October 14 to November 3, 2026/.test(v)));
  assert.ok(m.terms.some(([l, v]) => l === "Child ages" && /No child age terms are stated/.test(v)));
  assert.match(m.family_of_four, /Taxes, fees and port expenses are still charged for all four guests/);
  assert.ok(m.unclear.some((u) => /how the 65% off and the free 3rd and 4th guest fares combine/i.test(u)));
});

test("Norwegian check keeps the record: Nov 2, 2026 deadline, full-fare condition for free 3rd and 4th guests, no child ages, combining unclear, no family total", () => {
  const n = checks.find((c) => c.id === "norwegian-free-2nd-guest-3rd-4th-free");
  assert.ok(n, "added 2026-10-28 night (docs/research/deal-checks-2026-10-28.md)");
  assert.equal(n.expires_on, "2026-11-02");
  assert.equal(n.deadline_stated, undefined);
  assert.equal(n.family_total, null);
  assert.equal(n.official_url, "https://www.ncl.com/cruise-deals/promotion-terms");
  assert.ok(n.terms.some(([l, v]) => l === "Book by" && /November 2, 2026/.test(v) && /October 27, 2026/.test(v)));
  assert.ok(n.terms.some(([l, v]) => l === "3rd and 4th guests" && /guests 1 and 2 paying full fare/.test(v)));
  assert.ok(n.terms.some(([l, v]) => l === "Child ages" && /No child age terms are stated/.test(v)));
  assert.ok(n.terms.some(([l, v]) => l === "Taxes and fees" && /Free 3rd and 4th guests: not stated/.test(v)));
  assert.ok(n.unclear.some((u) => /free 2nd guest still counts as guests 1 and 2 paying full fare/.test(u)));
  assert.doesNotMatch(n.headline + n.family_of_four, /kids sail free|kids are free/i);
});

test("Norwegian check's November 2 date is scoped to the Free 2nd Guest sale, so expiry never says the 3rd and 4th guest offer ended", () => {
  const n = checks.find((c) => c.id === "norwegian-free-2nd-guest-3rd-4th-free");
  assert.match(n.expires_note, /Free 2nd Guest booking deadline; the free 3rd and 4th guest offer has no stated end date/);
  const page = dealCheckPage(checks, n, "2026-11-03");
  assert.match(page, /free 3rd and 4th guest offer has no stated end date/);
});

test("MSC check keeps the record: Nov 2 deals-page date vs Nov 5, 2026 terms date, kids 17 and under as 3rd/4th guests pay government fees and taxes, discount on guests 1 and 2 only, no family total", () => {
  const m = checks.find((c) => c.id === "msc-cruises-35-off-kids-sail-free");
  assert.ok(m, "added 2026-10-28 late night (docs/research/deal-checks-2026-10-28.md)");
  assert.equal(m.expires_on, "2026-11-02");
  assert.match(m.expires_note, /November 5, 2026/);
  assert.equal(m.family_total, null);
  assert.equal(m.official_url, "https://www.msccruisesusa.com/cruise-deals/promo-terms-and-conditions");
  assert.ok(m.terms.some(([l, v]) => l === "Book by" && /November 2/.test(v) && /November 5, 2026/.test(v)));
  assert.ok(m.terms.some(([l, v]) => l === "Child ages" && /17 and under/.test(v) && /must still pay government fees and taxes/.test(v)));
  assert.ok(m.terms.some(([l, v]) => l === "Discount" && /first and second passengers only/.test(v)));
  assert.ok(m.unclear.some((u) => /Port charges and onboard service charges/.test(u)));
  assert.match(m.headline, /kids still pay government fees and taxes/);
});

test("LEGOLAND California check keeps the record: book by Nov 17, 2026 for stays through Jan 9, 2027, advertised from-price with its family-of-four, 1-night, pre-tax basis, non-refundable, partner-hotel conflict, no family total", () => {
  const l = checks.find((c) => c.id === "legoland-california-hotel-kids-tickets-39");
  assert.ok(l, "added 2026-10-29 (docs/research/deal-checks-2026-10-29.md)");
  assert.equal(l.observed_on, "2026-10-29");
  assert.equal(l.expires_on, "2026-11-17");
  assert.equal(l.family_total, null);
  assert.equal(l.official_url, "https://www.legoland.com/california/places-to-stay/vacation-packages/hotel-plus-ticket-package/");
  assert.ok(l.terms.some(([k, v]) => k === "Book by" && /November 17, 2026/.test(v) && /January 9, 2027/.test(v)));
  assert.ok(l.terms.some(([k, v]) => k === "Headline" && /USD 169 per person per night/.test(v) && /2 adults and 2 children ages 2 to 12 for 1 night/.test(v) && /tax not included/.test(v)));
  assert.ok(l.terms.some(([k, v]) => k === "Cancellation" && /non-refundable/.test(v)));
  assert.ok(l.unclear.some((u) => /Partner hotels conflict/.test(u)));
  assert.match(l.family_of_four, /not a quote for your dates/);
});

test("Atlantis Fall Into Paradise check keeps the record: book by Nov 22 (year is our reading), travel by Jan 31, 2027, 4-night minimum, blackouts with the Dec 15/16 conflict, breakfast for two only, fees and 12+ gratuities, no family total", () => {
  const a = checks.find((c) => c.id === "atlantis-bahamas-fall-into-paradise");
  assert.ok(a, "added 2026-10-29 (docs/research/deal-checks-2026-10-29.md)");
  assert.equal(a.observed_on, "2026-10-29");
  assert.equal(a.expires_on, "2026-11-22");
  assert.match(a.expires_note, /no year/);
  assert.equal(a.family_total, null);
  assert.equal(a.official_url, "https://www.atlantisbahamas.com/fall-into-paradise-offer");
  assert.ok(a.terms.some(([k, v]) => k === "Book by" && /no year is given/.test(v) && /January 31, 2027/.test(v)));
  assert.ok(a.terms.some(([k, v]) => k === "Minimum nights" && /^4 nights/.test(v)));
  assert.ok(a.terms.some(([k, v]) => k === "Blackout dates" && /November 21 to 27, 2026/.test(v) && /December 15/.test(v) && /December 16/.test(v)));
  assert.ok(a.terms.some(([k, v]) => k === "Still charged" && /21%/.test(v) && /USD 77\.00/.test(v) && /12 and older/.test(v)));
  assert.match(a.family_of_four, /covers two people only/);
  assert.match(a.family_of_four, /maximum/);
});

const score = (patch, extra = {}, t = "2026-10-28") => check({ score: { ...base.score, ...patch }, ...extra }, t);

test("G09 step 2: every check carries a validated score; family value is rated only from observed prices", () => {
  for (const c of checks) assert.ok(["worth_it", "only_for", "skip"].includes(c.score.verdict), c.id);
  assert.ok(check({ score: undefined }).some((p) => /score is required/.test(p)));
  assert.ok(score({ verdict: "worth_it", who: undefined }).some((p) => /worth_it needs an observed family_value/.test(p)), "no observed family math, no Worth it");
  assert.ok(score({ family_value: { level: "high", basis: "Looks like a great saving." } }).some((p) => /rated family_value needs an observed family_total/.test(p)));
  const total = { amount: "USD 2,410.00", party: "2 adults and 2 children ages 6 and 9", stay_from: "2026-11-10", stay_to: "2026-11-14", includes: "cruise fare plus taxes, fees and port expenses", observed_on: "2026-10-28" };
  const rated = { level: "high", basis: "Sale total vs the regular total for the same cabin and dates.", compare: { amount: "USD 3,900.00", observed_on: "2026-10-28", basis: "Regular fare, same party, cabin and dates." } };
  assert.deepEqual(score({ family_value: rated, verdict: "worth_it", who: undefined }, { family_total: total }), []);
  const withCompare = (compare, extra = {}) => score({ family_value: { ...rated, compare: { ...rated.compare, ...compare } }, verdict: "worth_it", who: undefined, ...extra }, { family_total: total });
  assert.ok(withCompare({ amount: "EUR 3,900.00" }).some((p) => /same currency|family_total currency/.test(p)));
  assert.ok(withCompare({ amount: "USD 2,410.00" }).some((p) => /a saving/.test(p)));
  assert.ok(withCompare({ observed_on: "2026-10-27" }).some((p) => /same day/.test(p)));
  assert.ok(score({ family_value: rated, verdict: "worth_it", who: undefined }, { family_total: { ...total, party: "2 adults" } }).some((p) => /2 adults and 2 children/.test(p)));
  assert.ok(score({ family_value: rated, verdict: "worth_it", who: undefined }, { family_total: {} }).some((p) => /rated family_value needs/.test(p)), "a malformed total is reported, not thrown");
  assert.ok(score({ family_value: { ...rated, compare: undefined } }, { family_total: total }).some((p) => /rated family_value needs/.test(p)), "total without a regular price");
  assert.ok(withCompare({}, { family_value: { ...rated, level: "low" } }).some((p) => /worth_it needs an observed family_value of medium or high/.test(p)));
  assert.ok(score({ novelty: { level: "agency_listed", checked_on: "2026-10-28", links: "not a list" } }).some((p) => /novelty needs level/.test(p)), "reported, not thrown");
  assert.ok(score({ who: undefined }).some((p) => /only_for needs who/.test(p)));
  assert.ok(score({ verdict: "skip" }).some((p) => /who is only for only_for/.test(p)));
  assert.ok(score({ verdict: "great" }).some((p) => /verdict must be one of/.test(p)));
  assert.ok(score({ scored_on: "2026-10-27" }).some((p) => /scored_on/.test(p)), "scored before the observation");
  assert.ok(score({ novelty: { level: "news_covered", checked_on: "2026-10-28", links: [] } }).some((p) => /needs at least one link/.test(p)));
  assert.ok(score({ novelty: { level: "none_found", checked_on: "2026-10-28", links: [{ label: "Some news coverage", url: "https://news.example.com/a" }] } }).some((p) => /none_found cannot list/.test(p)));
  assert.ok(score({ novelty: { level: "news_covered", checked_on: "2026-10-28", links: [{ label: "The operator's own page", url: "https://www.example.org/deal" }] } }).some((p) => /not the operator's own site/.test(p)));
  assert.ok(score({ appeal: { level: "huge", fits: "Everyone everywhere." } }).some((p) => /appeal needs level/.test(p)));
});

test("G09 step 2: urgency is derived from the deadline on the day, never stored", () => {
  for (const c of checks) assert.equal(c.score.urgency, undefined, c.id);
  const d = (expires_on, extra = {}) => dealUrgency({ ...base, expires_on, ...extra }, "2026-10-29");
  assert.equal(d("2026-10-29"), "high", "expiry day itself");
  assert.equal(d("2026-11-01"), "high");
  assert.equal(d("2026-11-08"), "medium");
  assert.equal(d("2026-11-30"), "low");
  assert.equal(d("2026-10-28"), "low", "ended");
  assert.equal(d("2026-10-30", { deadline_stated: false }), "low", "a listing date is not a deadline");
});

test("G11 v2: a comparison price's source page is listed in the sources", () => {
  const s = checks.find((c) => c.id === "seaworld-orlando-2027-fun-card");
  const html = dealCheckPage(checks, s, "2026-10-30");
  const sources = html.slice(html.indexOf('id="deal-sources-title"'));
  assert.ok(sources.includes("https://seaworld.com/pricing-guide-to-seaworld/"), "the pricing guide behind the day-ticket comparison is cited");
  assert.match(sources, /checked October 30, 2026/);
});

test("G11 v2 deal page: parent-first order, $ not USD, verdict and money above the first heading, sources last, og tags", () => {
  const b = checks.find((c) => c.id === "beaches-first-passport-credit");
  assert.ok(b?.v2, "Beaches is the v2 pilot (docs/plan/deal-content-v2.md rollout step 1)");
  const html = dealCheckPage(checks, b, "2026-10-30");
  const main = html.slice(html.indexOf("<main"), html.indexOf("</main>"));
  const order = ['class="eyebrow deal-context"', "<h1>", 'class="deal-chips"', "<strong>Our verdict:</strong> A credit for resort extras", '<p class="deal-money"><strong>Saves: up to $270', "<p>Trip cost:", 'id="deal-get-title"', 'id="deal-compare-title"', 'id="deal-catch-title"', 'id="deal-how-title"', 'id="deal-todo-title"', 'id="deal-proscons-title"', 'id="deal-terms-title"', 'id="deal-others-title"', 'id="deal-sources-title"'];
  let at = -1;
  for (const marker of order) {
    const i = main.indexOf(marker);
    assert.ok(i > at, `${marker} out of order`);
    at = i;
  }
  const fold = main.slice(0, main.indexOf("<h2"));
  assert.match(fold, /\$135/);
  assert.match(fold, /Beaches Resorts: all-inclusive family resorts in Negril, Jamaica and in Turks &amp; Caicos/);
  const own = main.replace(/<nav class="container page-section deal-others"[\s\S]*?<\/nav>/, "").replace(/<table[\s\S]*?<\/table>/, "");
  assert.doesNotMatch(own, /\bUSD\b/, "USD appears only inside the quoted terms table (other checks' v1 titles aside)");
  assert.match(html, /<meta property="og:image" content="https:\/\/familytripwise\.com\/images\/og\/deals\/beaches-first-passport-credit\.png">/);
  assert.match(html, /<meta property="og:url" content="https:\/\/familytripwise\.com\/deals\/beaches-first-passport-credit\.html">/);
  assert.match(html, /<meta name="twitter:card" content="summary_large_image">/);
  assert.ok(existsSync(new URL(b.v2.og_image, site)), "run node tools/deal-og-images.mjs");
  assert.match(main, /kids and family vacations page<\/a>, checked October 29, 2026/);
  const ended = dealCheckPage(checks, b, "2026-11-01");
  assert.match(ended, /This offer ended October 31, 2026\./);
  assert.doesNotMatch(ended, /How to get it/);
  assert.doesNotMatch(ended, /Our verdict|Best for:|Not for:|Trip cost:|<li>Book by/, "an ended page drops the live verdict, fit lines, cost line and book-by chip");
  assert.match(ended, /While it ran: up to \$270/);
  assert.equal((ended.match(/This offer ended October 31, 2026/g) || []).length, 3, "once in the hero status, plus meta and og descriptions");
  assert.doesNotMatch(ended, /<li>Travel by November 6, 2026<\/li>/, "stored chips read as live, so an ended page drops them");
  assert.match(ended, /<meta name="description" content="[^"]*This offer ended October 31, 2026\.">/);
  assert.match(html, /<li>Travel by November 6, 2026<\/li>/);
  assert.doesNotMatch(own, /within the next week|offset/);
  assert.match(dealsHubPage(checks, "2026-10-30"), /Beaches: \$135 resort credit per child 5 and under/);
});

test("G11 v2 validator refuses USD, placeholders, a missing cost line, an unobserved total and undated sources", () => {
  const b = checks.find((c) => c.id === "beaches-first-passport-credit");
  const v = (patch) => validateDealChecks([{ ...b, v2: { ...b.v2, ...patch } }], { today: "2026-10-29" });
  assert.deepEqual(v({}), []);
  assert.ok(v({ headline: "A USD 135 credit, $135" }).some((p) => /not "USD"/.test(p)));
  assert.ok(v({ cost: "Trip cost: Not observed." }).some((p) => /placeholder/.test(p)));
  assert.ok(v({ cost: "About $3,000 for the week." }).some((p) => /Trip cost/.test(p)));
  assert.ok(v({ saves: "Saves: a family total of $2,000 for the week." }).some((p) => /cannot state one/.test(p)));
  assert.ok(v({ context_source: { label: "Beaches kids page", url: "https://www.beaches.com/vacations/kids/" } }).some((p) => /context_source/.test(p)));
  assert.ok(v({ things_to_do: { ...b.v2.things_to_do, source: { ...b.v2.things_to_do.source, observed_on: "2026-11-30" } } }).some((p) => /future/.test(p)));
  assert.ok(v({ family: "A family of four." }).some((p) => /2 adults and 2 kids/.test(p)));
  assert.ok(v({ catch: [] }).some((p) => /catch/.test(p)));
  assert.ok(v({ cost: "Trip cost: about $3,000 for 5 nights for a family of 4." }).some((p) => /cost line cannot state a \$ amount/.test(p)));
  assert.ok(v({ saves: "Saves: $900 off the room." }).some((p) => /\$900 is not a figure the observed terms state/.test(p)));
  assert.ok(v({ big_number: "$500" }).some((p) => /\$500 is not a figure/.test(p)));
  assert.ok(v({ chips: ["Kids eat free worth $1,000"] }).some((p) => /\$1,000 is not a figure/.test(p)));
  assert.ok(v({ hero_image: { ...b.v2.hero_image, slug: "no-such-photo" } }).some((p) => /hero_image.slug must be a self-hosted photo/.test(p)));
  assert.ok(v({ hero_image: { ...b.v2.hero_image, caption: "" } }).some((p) => /hero_image needs alt and caption/.test(p)));
  assert.ok(v({ extra_sources: [{ label: "Pricing page", url: "https://www.beaches.com/x/", covers: "prices" }] }).some((p) => /extra_sources/.test(p)), "extra sources need a date");
  assert.deepEqual(v({ extra_sources: [{ label: "Pricing page", url: "https://www.beaches.com/x/", observed_on: "2026-10-29", covers: "prices used for comparison" }] }), []);
  // G11 step 2: post lines
  const post = (patch) => v({ post: { ...b.v2.post, ...patch } });
  assert.ok(v({ post: undefined }).some((p) => /post \(title, hook, verdict, catch\) is required/.test(p)));
  assert.ok(post({ hook: "Beaches gives a resort credit to young kids with passports." }).some((p) => /post.hook must state the key \$ number/.test(p)));
  assert.ok(post({ hook: "Beaches gives a $500 resort credit per child with a passport." }).some((p) => /\$500 is not a figure the observed terms state/.test(p)), "post $ figures are tied to the terms");
  assert.ok(post({ verdict: "Worth it for every family with a young child and a passport." }).some((p) => /post.verdict must start "Only for "/.test(p)));
  assert.ok(post({ catch: "Only 5+ paid nights and travel by November 6, 2026." }).some((p) => /post.catch starts "The catch: "/.test(p)));
  assert.ok(post({ hook: "Beaches gives a USD 135 credit per child 5 or under with a new passport." }).some((p) => /use "\$", not "USD"/.test(p)));
  assert.ok(post({ catch: `The catch: ${"x".repeat(140)}` }).some((p) => /at most 140 characters/.test(p)));
  assert.ok(post({ title: "Beaches resort credit for kids with a new passport" }).some((p) => /post.title/.test(p)));
  assert.ok(post({ title: "Beaches: $135 credit per kid, book by October 3" }).some((p) => /post date "October 3" is not a date/.test(p)), "a date that is only a prefix of a term date is refused");
  assert.ok(post({ catch: "The catch: travel by November 9, 5+ paid nights, full room price." }).some((p) => /post date "November 9" is not a date/.test(p)), "post dates are tied to the terms");
  assert.ok(post({ catch: "The catch: travel by November 6, 4+ paid nights, full room price." }).some((p) => /night count "4\+ paid nights"/.test(p)), "night counts are tied to the terms");
  assert.ok(post({ hook: `${b.v2.post.hook} ${"y".repeat(20)}`, verdict: `${b.v2.post.verdict} ${"z".repeat(40)}` }).some((p) => /keep them under 340/.test(p)));
  assert.ok(v({ og_image: "images/og/deals/other-deal.png" }).some((p) => /og_image must be images\/og\/deals\/beaches-first-passport-credit\.png/.test(p)));
});

test("G11: v2 date_note_short shortens the year note on the hero chip and post only, and is validated", () => {
  const a = checks.find((c) => c.id === "atlantis-bahamas-fall-into-paradise");
  assert.equal(a.v2.date_note_short, "year is our reading");
  const bad = validateDealChecks([{ ...a, v2: { ...a.v2, date_note_short: "2026" } }], { today: "2026-10-30" });
  assert.ok(bad.some((p) => /date_note_short/.test(p)));
  const noNote = validateDealChecks([{ ...a, expires_note: undefined }], { today: "2026-10-30" });
  assert.ok(noNote.some((p) => /date_note_short/.test(p)));
  assert.ok(!validateDealChecks([a], { today: "2026-10-30" }).some((p) => /date_note_short/.test(p)));
});

test("G12 price sample: LEGOLAND shows a labelled Castle Hotel estimate for a named family party, only while the stay is ahead", () => {
  const l = checks.find((c) => c.id === "legoland-california-hotel-kids-tickets-39");
  const ps = l.v2.price_sample;
  // docs/research/dataforseo-g12-family-hotel-prices-2026-10-30.json: 3-night Dec 4-7 searches 383 (twice); 1-night Dec 4-5 searches 378 and 423.
  assert.deepEqual([ps.amount, ps.low, ps.high, ps.stay_from, ps.stay_to, ps.observed_on], [383, 378, 423, "2026-12-04", "2026-12-07", "2026-10-30"]);
  assert.equal(ps.party, "2 adults and 2 kids aged 5 and 8");
  assert.match(l.v2.family, /aged 5 and 8/, "the example family matches the sampled party");
  const line = priceSampleLine(l.v2, "2026-11-10");
  assert.match(line, /estimate, not a quote/);
  assert.match(line, /about \$383 a night at the LEGOLAND Castle Hotel for 2 adults and 2 kids aged 5 and 8, 3 nights, December 4 to 7, 2026/);
  assert.match(line, /checked October 30, 2026/);
  assert.match(line, /does not say whether taxes, fees, park tickets or breakfast are included/);
  assert.doesNotMatch(line, /before tax/i, "the receipt does not say whether tax is included");
  assert.doesNotMatch(line, /\btotal\b|\bsav/i, "a price sample is never a total or a saving");
  assert.equal(priceSampleLine(l.v2, "2026-12-04"), "", "dropped once the sampled stay starts");
  assert.match(dealCheckPage(checks, l, "2026-11-10"), /deal-price-sample/);
  assert.doesNotMatch(dealCheckPage(checks, l, "2026-11-18"), /deal-price-sample|dataforseo-g12|Google Hotels reading/, "an ended deal shows no glance price and no price-sample source");
  assert.match(dealCheckPage(checks, l, "2026-11-10"), /dated Google Hotels reading, not a price checked on the official site/);
});

test("G12 price sample validation rejects a missing party, a $ caveat, a stay that starts before the observation, and an out-of-range amount", () => {
  const l = checks.find((c) => c.id === "legoland-california-hotel-kids-tickets-39");
  const bad = (patch) => validateDealChecks([{ ...l, v2: { ...l.v2, price_sample: { ...l.v2.price_sample, ...patch } } }], { today: "2026-10-30" }).some((p) => /price_sample/.test(p));
  assert.ok(!bad({}));
  assert.ok(bad({ party: "2 adults" }));
  assert.ok(bad({ caveat: "Before tax, so about $450 in total with fees." }));
  assert.ok(bad({ stay_from: "2026-10-29" }));
  assert.ok(bad({ amount: 500 }));
  assert.ok(bad({ observed_on: "2026-10-31" }));
  assert.ok(bad({ range_note: "Other searches showed $999 in total." }));
  assert.ok(bad({ range_note: "One-night searches showed a range." }));
  assert.ok(bad({ party: "2 adults and 2 kids aged 3 and 6" }), "party ages must match v2.family");
});

test("v3 spend-vs-save: LEGOLAND California card is a labelled sum of observed figures and says plainly it is not cheaper", () => {
  const l = checks.find((c) => c.id === "legoland-california-hotel-kids-tickets-39");
  const r = spendSave(l, "2026-11-10");
  // docs/plan/deal-content-v2.md v3 worked example: $383 Castle Hotel (Google Hotels, Dec 4-7) + 4 x $69 online 1-day tickets
  // = $659 without; 4 x $169 package starting price = $676 with.
  assert.deepEqual([r.ok, r.without, r.with, r.save, r.save_pct], [true, 659, 676, -17, -3]);
  assert.equal(r.line, "Without the deal ≈ $659 · With the deal ≈ $676 · You save nothing: it costs ≈ $17 (3%) more");
  assert.equal(r.post, "Family of 4, 1 night + 1 park day (Dec hotel price), estimate: without the deal ≈ $659 · with it ≈ $676 · you save nothing (≈ $17 more).");
  assert.equal(r.basis, "Hotel price for December 4 to 7, 2026; prices checked October 29 to 30, 2026. Package price before tax; parking not counted.");
  const html = dealCheckPage(checks, l, "2026-11-10");
  const top = html.slice(0, html.indexOf("<details"));
  assert.match(top, /Estimate for 2 adults and 2 kids aged 5 and 8, one night and one park day/);
  assert.match(top, /Without the deal<\/dt><dd>≈ \$659<\/dd>.*With the deal<\/dt><dd>≈ \$676<\/dd>.*You save<\/dt><dd>nothing/s);
  assert.match(top, /Not a discount/);
  assert.ok(top.indexOf("spend-save") < top.indexOf("deal-chips"), "the card sits right under the headline");
  assert.match(html, /How we got these numbers/);
  assert.match(html, /\$69 × 4 = \$276/);
  assert.match(html, /\$169 × 4 = \$676/);
  assert.match(html, /california-support\.legoland\.com[^"]*"[^>]*>[^<]+<\/a>, checked October 30, 2026/, "every part keeps its dated source");
  // Concise top: no paragraph above the first details over about 30 words.
  for (const m of top.matchAll(/<p[^>]*>(.*?)<\/p>/gs)) {
    const text = m[1].replace(/<[^>]+>/g, " ").trim();
    assert.ok(text.split(/\s+/).length <= 32, `long paragraph above the details: ${text.slice(0, 60)}`);
  }
  assert.match(dealsHubPage(checks, "2026-11-10"), /<dt>Without the deal<\/dt><dd>≈ \$659<\/dd><\/div><div><dt>With the deal<\/dt><dd>≈ \$676<\/dd>/);
});

test("v3 spend-vs-save: a saving under 5% says plainly on the hub that it is not really cheaper", () => {
  const b = checks.find((c) => c.id === "busch-gardens-tampa-2027-fun-card");
  const ss = b.v2.spend_save;
  // One 3-day trip: 4 x $135 Three-Day, Three Park tickets against 4 x $129.99 Fun Cards saves about $20 (4%).
  const small = { ...b, v2: { ...b.v2, spend_save: { ...ss, verdict_line: "For one 3-day trip the Fun Card is not really cheaper than the $135 Three-Day, Three Park ticket.", without: { ...ss.without, parts: ss.without.parts.slice(0, 1) } } } };
  const r = spendSave(small, "2026-11-10");
  assert.deepEqual([r.ok, r.without, r.with, r.save, r.save_pct], [true, 540, 520, 20, 4]);
  assert.match(dealsHubPage([small], "2026-11-10"), /<dd>≈ \$20 <small>\(4%\)<\/small><\/dd>.*class="hub-ss-flag">Not really cheaper\./s);
  const full = spendSave(b, "2026-11-10");
  assert.deepEqual([full.without, full.with, full.save, full.save_pct], [788, 520, 268, 34]);
  assert.doesNotMatch(dealsHubPage([b], "2026-11-10"), /hub-ss-flag/);
});

test("v3 spend-vs-save: the card says what is missing once the hotel price sample's stay starts, and the deal is not posted", () => {
  const l = checks.find((c) => c.id === "legoland-california-hotel-kids-tickets-39");
  const late = { ...l, expires_on: "2026-12-20" };
  const r = spendSave(late, "2026-12-04");
  assert.equal(r.ok, false);
  assert.match(r.missing, /cannot price the trip without the deal right now/);
  const html = dealCheckPage([late], late, "2026-12-04");
  assert.match(html, /spend-save-missing/);
  assert.doesNotMatch(html, /≈ \$659/);
  assert.equal(spendSave(l, "2026-11-18").ok, false, "an ended deal has no card");
});

test("v3 spend-vs-save validation: only observed figures, matching party, plain not-cheaper wording, short top lines", () => {
  const l = checks.find((c) => c.id === "legoland-california-hotel-kids-tickets-39");
  const ss = l.v2.spend_save;
  const bad = (patch, score) => validateDealChecks([{ ...l, ...(score ? { score: { ...l.score, ...score } } : {}), v2: { ...l.v2, spend_save: { ...ss, ...patch } } }], { today: "2026-10-30" }).filter((p) => /spend_save/.test(p));
  assert.deepEqual(bad({}), []);
  const part = (side, p) => ({ [side]: { ...ss[side], parts: [{ ...ss[side].parts[0], ...p }, ...ss[side].parts.slice(1)] } });
  assert.ok(bad(part("with", { unit_amount: 150 })).length, "an unstated figure is refused");
  assert.ok(bad(part("without", { unit_amount: 400 })).length, "a price-sample part must use the sampled amount");
  assert.ok(bad(part("with", { qty: 2.5 })).length);
  assert.ok(bad(part("with", { source: undefined })).length, "terms parts need a dated source");
  assert.ok(bad(part("with", { what: "Package price, about $500 a night" })).length);
  assert.ok(bad({ party: "2 adults and 2 kids aged 3 and 6" }).length, "party must match the example family");
  assert.ok(bad({ verdict_line: "A great way to see LEGOLAND with breakfast included." }).length, "a deal that saves under 5% must say it is not a discount");
  assert.ok(bad({ note: "Prices from the pages listed." }).length, "the note must say it is a rough estimate");
  assert.ok(bad({}, { why: "word ".repeat(31).trim() + "." }).length, "the verdict stays under about 30 words");
});

test("v3 spend-vs-save: trust lines say the figures are estimates, and the price-sample part names its stay dates", () => {
  const l = checks.find((c) => c.id === "legoland-california-hotel-kids-tickets-39");
  const html = dealCheckPage(checks, l, "2026-11-10");
  assert.match(html, /estimates we added up from the dated prices/);
  assert.doesNotMatch(html, /We show a trip price only when we saw one/);
  assert.match(dealsHubPage(checks, "2026-11-10"), /is an estimate we added up from dated published prices/);
  const ss = l.v2.spend_save;
  const p0 = ss.without.parts[0];
  const v = validateDealChecks([{ ...l, v2: { ...l.v2, spend_save: { ...ss, without: { ...ss.without, parts: [{ ...p0, what: "LEGOLAND Castle Hotel for this family, a night (Google Hotels)" }, ...ss.without.parts.slice(1)] } } } }], { today: "2026-10-30" });
  assert.ok(v.some((p) => /sampled stay dates/.test(p)));
  assert.ok(validateDealChecks([{ ...l, v2: { ...l.v2, spend_save: { ...ss, basis: "Before tax, about $50 more." } } }], { today: "2026-10-30" }).some((p) => /basis/.test(p)));
});

test("v3 spend_missing: the card says which price is missing, and the deal is never in the savings box or posted", async () => {
  const c = checks.find((x) => x.id === "club-med-all-inclusive-kids-under-4");
  assert.ok(c?.v2?.spend_missing, "Club Med has no observed family price, so it carries spend_missing");
  const r = spendSave(c, "2026-11-10");
  assert.equal(r.ok, false);
  assert.match(r.missing, /No estimate/);
  const html = dealCheckPage(checks, c, "2026-11-10");
  assert.match(html, /class="spend-save spend-save-missing"[^>]*>\s*<p class="ss-title">Trip cost for 2 adults and 2 kids aged 2 and 3, 4 nights, without flights<\/p><p>No estimate/);
  assert.doesNotMatch(html, /Without the deal ≈/);
  assert.doesNotMatch(dealsHubPage(checks, "2026-11-10").split("Biggest savings")[1]?.split("</section>")[0] ?? "", /Club Med/);
  const { shareable } = await import("./social-queue.mjs");
  assert.equal(shareable({ kind: "deal", verdict: "only_for", spend_missing: Boolean(c.v2.spend_missing) && !r.ok }), false);
  const bad = (patch) => validateDealChecks([{ ...c, v2: { ...c.v2, spend_missing: { ...c.v2.spend_missing, ...patch } } }], { today: "2026-10-30" }).filter((p) => /spend_missing/.test(p));
  assert.deepEqual(bad({}), []);
  assert.ok(bad({ party: "2 adults and 2 kids aged 5 and 8" }).length, "party ages must match v2.family");
  assert.ok(bad({ text: "Price it on clubmed.us for $999 a week." }).length, "unobserved $ figure or no missing statement");
  assert.ok(bad({ text: "Price it yourself. ".repeat(12) }).length, "at most 30 words");
  assert.ok(validateDealChecks([{ ...c, v2: { ...c.v2, spend_save: {} } }], { today: "2026-10-30" }).some((p) => /not both/.test(p)));
});

test("owner D22: only a real deal (priced, saves at least 5%) is promoted on /deals/ or posted", async () => {
  const today = "2026-11-10";
  const lca = checks.find((x) => x.id === "legoland-california-hotel-kids-tickets-39");
  const busch = checks.find((x) => x.id === "busch-gardens-tampa-2027-fun-card");
  const club = checks.find((x) => x.id === "club-med-all-inclusive-kids-under-4");
  assert.equal(REAL_DEAL_MIN_PCT, 5);
  assert.ok(spendSave(lca, today).save_pct < 5, "LEGOLAND California costs about the same with the package");
  assert.equal(isRealDeal(lca, today), false);
  assert.ok(spendSave(busch, today).save_pct >= 5);
  assert.equal(isRealDeal(busch, today), true);
  assert.equal(isRealDeal(club, today), false, "an unpriced deal is not a real deal");
  const hub = dealsHubPage(checks, today);
  const [top, others] = hub.split('aria-labelledby="deals-other-title"');
  assert.match(top, new RegExp(`id="${busch.id}"`));
  for (const c of [lca, club]) {
    assert.doesNotMatch(top, new RegExp(c.id), `${c.id} is not promoted above the other-offers section`);
    assert.match(others, new RegExp(`id="${c.id}"`), `${c.id} keeps a collapsed listing`);
  }
  const { shareable, sourceRecords } = await import("./social-queue.mjs");
  const rec = (id) => sourceRecords({ items: [], checks }).find((r) => r.id === id);
  assert.equal(rec(lca.id).real_deal, isRealDeal(lca), "the post record carries the D22 flag");
  assert.equal(shareable({ kind: "deal", verdict: "only_for", spend_missing: false, real_deal: false }), false);
  assert.equal(shareable({ kind: "deal", verdict: "only_for", spend_missing: false, real_deal: true }), true);
  assert.equal(shareable({ kind: "deal", verdict: "only_for", spend_missing: false }), false, "a record without the flag is never posted");
});

test("D22 boundary: the 5% test uses the unrounded saving; nothing real gives a fallback message", () => {
  const b = checks.find((x) => x.id === "busch-gardens-tampa-2027-fun-card");
  const ss = b.v2.spend_save;
  const today = "2026-11-10";
  const full = spendSave(b, today);
  // Scale the "with" side so the saving is 4.7% (shows as 5%) and then exactly 5%.
  const withSave = (pct) => {
    const target = Math.round(full.without * (1 - pct));
    const parts = ss.with.parts.map((p, i) => (i === 0 ? { ...p, unit_amount: Math.round((target / p.qty) * 100) / 100 } : p));
    return { ...b, v2: { ...b.v2, spend_save: { ...ss, with: { ...ss.with, parts } } } };
  };
  const near = withSave(0.047);
  const r = spendSave(near, today);
  assert.ok(r.ok, "the scaled fixture still builds a card");
  assert.ok(r.save / r.without < 0.05 && r.save_pct === 5, "4.7% rounds to 5% on the card");
  assert.equal(isRealDeal(near, today), false, "but a 4.7% saving is not a real deal");
  assert.equal(isRealDeal(withSave(0.06), today), true, "6% is a real deal");
  assert.equal(isRealDeal({ ...b, score: { ...b.score, verdict: "skip" } }, today), false, "a deal scored skip is never promoted");
  const lca = checks.find((x) => x.id === "legoland-california-hotel-kids-tickets-39");
  const hub = dealsHubPage([lca], today);
  assert.match(hub, /No offer we checked saves a family at least 5% right now/);
  assert.doesNotMatch(hub, /deals-savers/);
});

test("D22 hub: the main list is in the same order as the Biggest savings box (largest saving first)", () => {
  const hub = dealsHubPage(checks, "2026-10-30");
  const box = [...hub.split('class="container answer-box deals-savers"')[1].split("</section>")[0].matchAll(/href="#([^"]+)"/g)].map((m) => m[1]);
  const list = [...hub.split('aria-labelledby="deals-open-title"')[1].split("</section>")[0].matchAll(/<article class="detail-card deal-card" id="([^"]+)"/g)].map((m) => m[1]);
  assert.ok(box.length >= 1);
  assert.deepEqual(list.slice(0, box.length), box);
  const saves = list.map((id) => spendSave(checks.find((c) => c.id === id), "2026-10-30").save);
  assert.deepEqual(saves, [...saves].sort((a, b) => b - a));
});
