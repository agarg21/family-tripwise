import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { easternDate } from "./page-generation/sitemap.mjs";
import {
  root, queueFiles, readQueue, validateQueue, buildQueue, sourceRecords, variants, sentences, easternTime,
  DAILY_CAPS, LIMITS, PLATFORMS, MAX_OBSERVATION_AGE_DAYS, unitCap,
} from "./social-queue.mjs";

function jpegSize(path) {
  const b = readFileSync(path);
  assert.equal(b.readUInt16BE(0), 0xffd8, `${path} is not a JPEG`);
  let i = 2;
  while (i < b.length) {
    const marker = b.readUInt16BE(i);
    if (marker >= 0xffc0 && marker <= 0xffc3) return { height: b.readUInt16BE(i + 5), width: b.readUInt16BE(i + 7) };
    i += 2 + b.readUInt16BE(i + 2);
  }
  throw new Error(`${path}: no frame header`);
}

// Frozen fixtures, so routine data refreshes (G05) never break these tests.
const fixtureItem = {
  id: "fixture-lottery", type: "event", city: "Washington, DC",
  title: "Fixture lottery closes November 4",
  when: "Lottery open from October 28 at 10 a.m. ET until Wednesday, November 4, 2026 at 3 p.m. ET. Winners are notified later.",
  cost: "Free to enter.", booking: "Enter online.", family: "Up to five tickets per winner.",
  official_url: "https://www.nps.gov/example", source_label: "Fixture release",
  observed_on: "2026-10-28", starts_on: "2026-10-28", sort_on: "2026-11-04", expires_on: "2026-11-04", third_party: false,
};
const fixtureCheck = {
  id: "fixture-deal", operator: "Fixture Cruises", category: "Cruise", title: "Fixture kids sail free",
  headline: "Kids 12 and under pay no cruise fare, but every guest still pays taxes and fees.",
  family_of_four: "Two kids pay USD 0 cruise fare. Taxes are still charged for all four.",
  terms: [["Book by", "November 2, 2026."]], unclear: [], before_booking: [], family_total: null,
  official_url: "https://www.example.com/terms", source_label: "Fixture terms", observed_on: "2026-10-28", expires_on: "2026-11-02",
};
const [fixtureDeal, fixtureEvent] = sourceRecords({ items: [fixtureItem], checks: [fixtureCheck] });
const record = (over = {}) => ({ ...fixtureEvent, ...over });

test("every committed queue validates; current and future queues match today's verified records", () => {
  const today = easternDate();
  const files = queueFiles();
  assert.ok(files.length >= 1, "at least one queue file is committed");
  for (const name of files) {
    const queue = readQueue(name.replace(".json", ""));
    assert.deepEqual(validateQueue(queue, { today }), [], name);
    for (const entry of queue.entries) {
      const path = join(root, entry.image.path);
      assert.deepEqual(jpegSize(path), { width: 1080, height: 1350 }, entry.image.path);
      assert.ok(statSync(path).size <= 300 * 1024, `${entry.image.path} must be ≤300 KB`);
    }
  }
});

test("queue picks verified, unexpired, freshly observed items, most urgent first, within caps", () => {
  const records = [
    record({ id: "a-expired", expires_on: "2026-10-28", priority_on: "2026-10-28" }),
    record({ id: "a-last-day", expires_on: "2026-10-29", priority_on: "2026-10-29" }),
    record({ id: "b-third-party", third_party: true }),
    record({ id: "c-stale", observed_on: "2026-10-01" }),
    record({ id: "d-later", priority_on: "2026-12-01", expires_on: "2026-12-01" }),
    record({ id: "e-soon", priority_on: "2026-11-02", expires_on: "2026-11-02" }),
    record({ id: "f-posted-yesterday", priority_on: "2026-10-30" }),
    record({ id: "g-third", priority_on: "2026-11-20", expires_on: "2026-11-20" }),
    record({ id: "h-fourth", priority_on: "2026-11-25", expires_on: "2026-11-25" }),
  ];
  const previous = (d) => (d === "2026-10-28" ? { entries: [{ item_id: "f-posted-yesterday" }] } : null);
  const q = buildQueue("2026-10-29", { records, previous });
  assert.deepEqual(q.entries.map((e) => e.item_id), ["e-soon", "g-third", "h-fourth"], "3 units off-season, urgent first");
  assert.equal(unitCap("2026-11-15"), 6);
  assert.deepEqual(q.entries.map((e) => e.scheduled_at), ["2026-10-29T07:30:00-04:00", "2026-10-29T12:30:00-04:00", "2026-10-29T19:30:00-04:00"]);
  assert.equal(q.entries[0].expires_at, "2026-11-02T00:00:00-05:00", "posting stops at 00:00 ET on the last day, with that date's offset");
  assert.deepEqual(Object.keys(q.entries[0].platforms), PLATFORMS);
  assert.deepEqual(Object.keys(q.entries[1].platforms), ["threads", "facebook", "pinterest"], "Instagram, TikTok and YouTube capped at 1/day");
  assert.deepEqual(validateQueue(q, { siteDir: null, records, today: "2026-10-29" }), []);
  const late = buildQueue("2026-11-20", { records: [record({ observed_on: "2026-10-28", expires_on: "2026-12-01" })], previous: () => null });
  assert.equal(late.entries.length, 0, `observations older than ${MAX_OBSERVATION_AGE_DAYS} days are not posted`);
});

test("validator refuses expired, over-limit, over-cap and changed entries", () => {
  const records = [fixtureDeal, fixtureEvent, record({ id: "fixture-third", priority_on: "2026-11-10", expires_on: "2026-11-10" })];
  const today = "2026-10-29";
  const base = buildQueue(today, { records, previous: () => null });
  const clone = () => JSON.parse(JSON.stringify(base));
  const has = (q, re) => validateQueue(q, { records, today, siteDir: null }).some((p) => re.test(p));
  assert.deepEqual(validateQueue(base, { records, today, siteDir: null }), []);
  let q = clone(); q.entries[0].expires_at = "2026-10-29T23:59:00-04:00";
  assert.ok(has(q, /expires_at must be 00:00 ET on a day after the queue date/));
  q = clone(); q.entries[0].platforms.threads.text = "x".repeat(LIMITS.threads.text + 1);
  assert.ok(has(q, /threads text missing or over 500/));
  q = clone(); q.entries[0].platforms.bluesky = { text: "x", link: "https://familytripwise.com/deals/" };
  assert.ok(has(q, /unknown platform bluesky/), "Bluesky is no longer a queue platform (OWNER D12 revised)");
  q = clone(); q.entries[1].platforms.instagram = q.entries[0].platforms.instagram;
  assert.ok(has(q, /instagram has 2 posts, cap 1/));
  q = clone(); q.entries[0].platforms.threads.text += " Kids stay free.";
  assert.ok(has(q, /threads text differs from the record/), "edited text is caught");
  q = clone(); q.entries[0].source.observed_on = "2026-10-01";
  assert.ok(has(q, /observation 2026-10-01/));
  q = clone(); q.entries[0].item_id = "no-such-record";
  assert.ok(has(q, /source record no longer exists/));
  assert.ok(Object.values(DAILY_CAPS).every((n) => n >= 1));
});

test("post text is copied from the record: every paragraph is a title, record field, check line or tag", () => {
  for (const r of [fixtureDeal, fixtureEvent, ...sourceRecords()]) {
    const fields = [r.title, ...r.full, ...r.short, ...r.extra].join("\n");
    for (const [platform, v] of Object.entries(variants(r, "id"))) {
      for (const para of v.text.split("\n\n")) {
        const ok = fields.includes(para)
          || para === `Checked on the official page ${para.slice(29).split(":")[0]}: ${r.source_label}.`
          || /^Details and the official link: familytripwise\.com\/(deals|this-week)$/.test(para)
          || /^(#\w+ ?)+$/.test(para);
        assert.ok(ok, `${r.id} ${platform}: "${para}" is not from the record`);
      }
      assert.ok(v.text.length <= LIMITS[platform].text, `${r.id} ${platform} over limit`);
      if (r.kind === "deal") assert.ok(platform === "pinterest" || v.text.includes(r.title), `${r.id} ${platform} keeps the title`);
      if (r.kind === "deal") assert.ok(v.text.includes(r.short[0]), `${r.id} ${platform} keeps the deal headline and its caveats`);
    }
  }
});

test("sentence split keeps time zones with their times and never loses text", () => {
  assert.deepEqual(sentences("Open at 10 a.m. ET until 3 p.m. ET. Winners told later."), ["Open at 10 a.m. ET until 3 p.m. ET.", "Winners told later."]);
  assert.deepEqual(sentences("Tuesday, 11 a.m. to noon, Boston Common. The tree arrives at about 11 a.m."), ["Tuesday, 11 a.m. to noon, Boston Common.", "The tree arrives at about 11 a.m."]);
  assert.deepEqual(sentences("Arrive at 1 p.m. to see animals. Then lights at 4 p.m. Doors close at 9 p.m. PT."), ["Arrive at 1 p.m. to see animals.", "Then lights at 4 p.m.", "Doors close at 9 p.m. PT."]);
  assert.deepEqual(sentences("Open until 10 a.m. Saturday, November 7. Then it closes."), ["Open until 10 a.m. Saturday, November 7.", "Then it closes."], "a day name after a.m. continues the sentence");
  assert.deepEqual(sentences("Doors at 6 p.m. December 3 only. Bring a coat."), ["Doors at 6 p.m. December 3 only.", "Bring a coat."], "a month name after p.m. continues the sentence");
  const lottery = buildQueue("2026-11-04", { records: [fixtureEvent], previous: () => null });
  assert.equal(lottery.entries.length, 0, "no post on the day a 3 p.m. deadline closes");
  for (const r of sourceRecords()) for (const f of r.full) assert.equal(sentences(f).join(" "), f);
  assert.equal(easternTime("2026-11-01", "07:30"), "2026-11-01T07:30:00-05:00");
  assert.equal(easternTime("2026-11-01", "00:00"), "2026-11-01T00:00:00-04:00", "midnight before the 02:00 fall-back is still EDT");
  assert.equal(easternTime("2027-03-14", "00:00"), "2027-03-14T00:00:00-05:00", "midnight before the 02:00 spring-forward is still EST");
  assert.equal(easternTime("2026-10-31", "07:30"), "2026-10-31T07:30:00-04:00");
});

test("a deal headline that already states its booking deadline is not followed by the same deadline", () => {
  const stated = { ...fixtureCheck, id: "fixture-stated", headline: "Up to USD 270 credit; book by November 2 and travel by November 6, 2026." };
  const near = { ...fixtureCheck, id: "fixture-near", expires_on: "2026-11-02", headline: "Book by November 20 for a later sailing." };
  const noted = { ...fixtureCheck, id: "fixture-noted", expires_note: "the page gives no year", headline: "Book by November 2 for a room discount." };
  const listed = { ...fixtureCheck, id: "fixture-listed", deadline_stated: false, headline: "Book by November 2 for a room discount." };
  const [s, n, o, l, plain] = sourceRecords({ items: [], checks: [stated, near, noted, listed, fixtureCheck] });
  for (const [platform, v] of Object.entries(variants(s, "id"))) {
    assert.equal((v.text.match(/book by November 2\b/gi) ?? []).length, 1, `${platform}: deadline once`);
  }
  assert.deepEqual(s.full, [stated.headline, stated.family_of_four]);
  assert.equal(n.full.at(-1), "Book by November 2, 2026.", "a different date in the headline keeps the deadline line");
  assert.equal(o.full.at(-1), "Book by November 2, 2026 (the page gives no year).", "a deadline note is never dropped");
  assert.equal(l.full.at(-1), "Listed until November 2, 2026.", "a listing date is not a booking deadline");
  assert.equal(plain.full.at(-1), "Book by November 2, 2026.");
  const [otherYear] = sourceRecords({ items: [], checks: [{ ...fixtureCheck, headline: "Book by November 2, 2027 for a later sailing." }] });
  assert.equal(otherYear.full.at(-1), "Book by November 2, 2026.", "a headline date in another year keeps the deadline line");
  const [sameYear] = sourceRecords({ items: [], checks: [{ ...fixtureCheck, headline: "Book by November 2, 2026 for a cabin." }] });
  assert.deepEqual(sameYear.full, ["Book by November 2, 2026 for a cabin.", fixtureCheck.family_of_four]);
  const [stayBy, travelBy] = sourceRecords({ items: [], checks: [
    { ...fixtureCheck, headline: "Book a hotel stay by November 2, 2026 for stays through January 9, 2027." },
    { ...fixtureCheck, headline: "Kids sail free; travel by November 2, 2026." },
  ] });
  assert.deepEqual(stayBy.full, ["Book a hotel stay by November 2, 2026 for stays through January 9, 2027.", fixtureCheck.family_of_four], "\"stay by <deadline>\" already states it (LEGOLAND)");
  assert.equal(travelBy.full.at(-1), "Book by November 2, 2026.", "a travel-by date is not a booking deadline");
  assert.deepEqual(s.lines, plain.lines.map(([k, v]) => [k, k === "For a family" ? stated.headline : v]), "the card keeps its Book by row");
});

test("an operator skip leaves an item out of that day, is stored with its reason and is checked", () => {
  const records = [fixtureDeal, fixtureEvent, record({ id: "fixture-third", priority_on: "2026-11-10", expires_on: "2026-11-10" })];
  const today = "2026-10-29";
  const skip = [{ item_id: "fixture-lottery", reason: "Posted two days ago; nothing new to say." }];
  const q = buildQueue(today, { records, previous: () => null, skip });
  assert.deepEqual(q.entries.map((e) => e.item_id), ["fixture-deal", "fixture-third"]);
  assert.deepEqual(q.skipped, skip);
  assert.deepEqual(q.entries.map((e) => e.scheduled_at), ["2026-10-29T07:30:00-04:00", "2026-10-29T12:30:00-04:00"], "remaining entries take the first slots");
  assert.deepEqual(validateQueue(q, { records, today, siteDir: null }), []);
  assert.equal(buildQueue(today, { records, previous: () => null }).skipped, undefined, "no skipped key without skips");
  assert.throws(() => buildQueue(today, { records, previous: () => null, skip: [{ item_id: "fixture-lottery", reason: " " }] }), /reason/);
  const both = JSON.parse(JSON.stringify(q));
  both.skipped.push({ item_id: "fixture-deal", reason: "x" });
  assert.ok(validateQueue(both, { records, today, siteDir: null }).some((p) => /listed as skipped but also queued/.test(p)));
  const blank = JSON.parse(JSON.stringify(q));
  blank.skipped[0].reason = "";
  assert.ok(validateQueue(blank, { records, today, siteDir: null }).some((p) => /needs item_id and a reason/.test(p)));
});
