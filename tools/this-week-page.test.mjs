import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { upcomingItems, currentItems, readFreshItems, thisWeekPage, validateFreshItems, citySlug } from "./page-generation/this-week-page.mjs";
import { destinations } from "./page-generation/site-chrome.mjs";
import { easternDate } from "./page-generation/sitemap.mjs";

const site = new URL("../site/", import.meta.url);
const items = readFreshItems();
const today = easternDate();
const committed = readFileSync(new URL("this-week/index.html", site), "utf8");

const base = {
  id: "x-item", type: "event", city: "Boston", title: "A title", when: "Monday, November 30, 2026", cost: "Free.",
  booking: "No tickets.", family: "Family note.", official_url: "https://example.org/x", source_label: "Official page",
  observed_on: "2026-10-28", starts_on: "2026-11-30", sort_on: "2026-11-30", expires_on: "2026-11-30", third_party: false
};

test("every fresh item validates: sourced, dated, a site city, no earlier-year dates", () => {
  assert.deepEqual(validateFreshItems(items, { today }), []);
  assert.ok(items.length >= 10, "G01 acceptance: at least 10 items");
  assert.ok(new Set(items.map((i) => i.city)).size >= 5, "G01 acceptance: at least 5 cities");
  for (const item of items) assert.match(item.official_url, /^https:\/\//);
});

test("the validator rejects carried-forward years, unknown cities, bad dates and unlabelled third-party items", () => {
  const check = (patch) => validateFreshItems([{ ...base, ...patch }], { today: "2026-10-28" });
  assert.deepEqual(check({}), []);
  assert.ok(check({ when: "Monday, December 1, 2025" }).some((p) => /mentions 2025/.test(p)));
  assert.ok(check({ city: "Paris" }).some((p) => /city/.test(p)));
  assert.ok(check({ expires_on: "2026-02-30" }).some((p) => /expires_on must be a real/.test(p)));
  assert.ok(check({ expires_on: "2026-10-01" }).some((p) => /before observed_on/.test(p)));
  assert.ok(check({ observed_on: "2026-10-29" }).some((p) => /future/.test(p)));
  assert.ok(check({ third_party: true }).some((p) => /third_party_note/.test(p)));
  assert.ok(check({ official_url: "http://example.org" }).some((p) => /https/.test(p)));
  assert.deepEqual(check({ credit: { label: "Local news", url: "https://example.org/story" } }), []);
  assert.ok(check({ credit: { label: "Local news", url: "http://example.org" } }).some((p) => /credit/.test(p)));
  assert.ok(validateFreshItems([base, base], { today: "2026-10-28" }).some((p) => /duplicate/.test(p)));
});

test("expired items are never rendered; an item shows through its last day", () => {
  const list = [base, { ...base, id: "y-item", expires_on: "2026-12-05", sort_on: "2026-12-04", starts_on: "2026-12-04" }];
  assert.deepEqual(currentItems(list, "2026-11-30").map((i) => i.id), ["x-item", "y-item"]);
  assert.deepEqual(currentItems(list, "2026-12-01").map((i) => i.id), ["y-item"]);
  const html = thisWeekPage(list, "2026-12-01");
  assert.ok(!html.includes('id="x-item"'));
  assert.ok(html.includes('id="y-item"'));
  assert.ok(thisWeekPage(list, "2026-12-06").includes("No verified dated items right now."));
});

test("the committed page matches today's render (refreshed daily by tools/this-week.mjs)", () => {
  assert.equal(committed, thisWeekPage(items, today), "run node tools/generate-pages.mjs or node tools/this-week.mjs");
  for (const item of currentItems(items, today)) {
    assert.ok(committed.includes(`id="${item.id}"`), item.id);
    assert.ok(committed.includes(item.official_url.replaceAll("&", "&amp;")), `${item.id} official link`);
  }
  for (const item of items.filter((i) => i.expires_on < today)) assert.ok(!committed.includes(`id="${item.id}"`), `${item.id} expired`);
});

// Render as of the newest observation: an item observed later would be "in the future" for an older date.
const latestObservation = items.map((i) => i.observed_on).sort().at(-1);

test("every card shows its check date and official link; family notes are labelled as ours", () => {
  const html = thisWeekPage(items, latestObservation);
  const cards = html.match(/<article class="detail-card fresh-item"[\s\S]*?<\/article>/g) || [];
  assert.equal(cards.length, items.filter((i) => i.expires_on >= latestObservation).length);
  for (const card of cards) {
    const isThirdParty = items.find((i) => card.includes(`id="${i.id}"`))?.third_party;
    assert.match(card, isThirdParty ? /Not yet confirmed officially:[\s\S]*Third-party report, read [A-Z][a-z]+ \d{1,2}, 20\d\d: <a href="https:\/\// : /Official pages?, checked [A-Z][a-z]+ \d{1,2}, 20\d\d: <a href="https:\/\//);
    assert.match(card, /<dt>Family note<\/dt>/);
    const credit = items.find((i) => card.includes(`id="${i.id}"`))?.credit;
    if (credit) assert.ok(card.includes(`First reported by <a href="${credit.url}">`), "credited outlet is linked outside the official label");
  }
  assert.match(html, /Family notes are our planning suggestions, not firsthand experience/);
  assert.match(html, /<link rel="canonical" href="https:\/\/familytripwise.com\/this-week\/">/);
  assert.doesNotMatch(html, /Updated|updated on/i, "no build date: content changes only when items change");
});

test("every destination has a section anchor, and every guide's related block links to it", () => {
  const html = thisWeekPage(items, latestObservation);
  for (const d of destinations) {
    assert.ok(html.includes(`id="${citySlug(d.name)}"`), d.name);
    const guide = readFileSync(new URL(d.guides[0][0], site), "utf8");
    assert.ok(guide.includes(`href="../this-week/#${citySlug(d.name)}"`), `${d.guides[0][0]} links its this-week section`);
    assert.ok(guide.includes('<a class="header-this-week" href="../this-week/">This week</a>'), `${d.guides[0][0]} header link`);
  }
});

test("the Pages deploy workflow refreshes the page daily before validating", () => {
  const workflow = readFileSync(new URL("../.github/workflows/deploy-pages.yml", import.meta.url), "utf8");
  assert.match(workflow, /schedule:\s*\n(?:\s*#.*\n)?\s*- cron: "17 5 \* \* \*"/);
  const refresh = workflow.indexOf("node tools/this-week.mjs");
  assert.ok(refresh > 0 && refresh < workflow.indexOf("node tools/seo-qa.mjs"), "refresh runs before the tests");
  // Only the operator-notes checks leave the deploy, and they still run on every ops push.
  const excluded = [...workflow.matchAll(/grep -v '([^']+)'/g)].map((m) => m[1]);
  assert.deepEqual(excluded, ["^tools/ops-state\\.test\\.mjs$"]);
  assert.equal(workflow.split("grep -v").length - 1, 1, "one exclusion only");
  const hygiene = readFileSync(new URL("../.github/workflows/ops-hygiene.yml", import.meta.url), "utf8");
  assert.match(hygiene, /- "ops\/\*\*"/);
  assert.match(hygiene, /node --test --test-reporter=dot tools\/ops-state\.test\.mjs/);
});

test("optional post lines are checked: known fields, 3-110 characters, $ not USD", () => {
  const ok = { ...base, post: { when: "Monday, Nov 30.", cost: "Free.", catch: "No tickets needed." } };
  assert.deepEqual(validateFreshItems([ok], { today: "2026-10-31" }).filter((p) => /post/.test(p)), []);
  const bad = (post) => validateFreshItems([{ ...base, post }], { today: "2026-10-31" }).some((p) => /post/.test(p));
  assert.ok(bad({ when: "Monday.", cost: "USD 10 a person.", catch: "Book ahead." }));
  assert.ok(bad({ when: "Monday.", cost: "Free." }));
  assert.ok(bad({ when: "Monday.", cost: "Free.", catch: "x".repeat(111) }));
  assert.ok(bad({ when: "Monday.", cost: "Free.", catch: "Book.", extra: "nope" }));
  assert.ok(bad("short"));
  assert.ok(bad({ when: "Monday.", cost: "Tickets $15.", catch: "Book." }), "amount not in the cost record");
  const priced = { ...base, cost: "USD 10 per person.", post: { when: "Monday.", cost: "$10 each (family of 4 about $40, est.).", catch: "Book.", chip: "Kids love it." } };
  assert.deepEqual(validateFreshItems([priced], { today: "2026-10-31" }).filter((p) => /post/.test(p)), []);
});

test("card tops stay short (≤30 words per line, no USD); the full verified record sits in a details block", () => {
  const html = thisWeekPage(items, latestObservation);
  const cards = html.match(/<article class="detail-card fresh-item"[\s\S]*?<\/article>/g) || [];
  assert.ok(cards.length > 0);
  for (const card of cards) {
    const [top, rest] = card.split('<details class="fresh-more">');
    assert.ok(rest, "each card has a details block");
    for (const m of top.matchAll(/<dd>([\s\S]*?)<\/dd>/g)) assert.ok(m[1].split(/\s+/).length <= 30, `long card line: ${m[1]}`);
    for (const dt of ["When", "Cost", "Booking", "Family note"]) assert.match(rest, new RegExp(`<dt>${dt}</dt>`));
    assert.doesNotMatch(card, /\bUSD\b/);
  }
});

test("Coming up first never leads with a past date: running items say Through and come after dated ones", () => {
  const a = { ...base, id: "a-past", sort_on: "2026-11-01", starts_on: "2026-11-01", expires_on: "2026-12-20" };
  const b = { ...base, id: "b-next", sort_on: "2026-11-21", starts_on: "2026-11-21", expires_on: "2026-11-21" };
  assert.deepEqual(upcomingItems([a, b], "2026-11-12").map((i) => i.id), ["b-next", "a-past"]);
  const answer = thisWeekPage([a, b], "2026-11-12").match(/id="this-week-answer"[\s\S]*?<\/ul>/)[0];
  assert.match(answer, /Through December 20/);
  assert.doesNotMatch(answer, /November 1 ·/);
});
