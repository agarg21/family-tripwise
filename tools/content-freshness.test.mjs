import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

import { findExpiredOperationalNotices, findPastStaySamples, findReviewDueDates, findYearlessOperationalNotices } from "./content-freshness.mjs";

const now = new Date("2026-07-28T12:00:00Z");

test("explicit single closure starts are not expired end dates", () => {
  for (const wording of ["closure starts", "closure begins on", "construction starts", "renovation begins", "closed starting", "unavailable beginning on"]) {
    const html = `<p>The ${wording} October 26, 2026.</p>`;
    assert.deepEqual(findExpiredOperationalNotices(html, { now: new Date("2026-10-27T12:00:00Z") }), []);
  }
});

test("a start date cannot suppress a later expired reopening deadline", () => {
  const text = "Seasonal closure starts October 26, 2026; reopening is expected on or before April 1, 2027, not confirmed.";
  for (const html of [`<p>${text}</p>`, `<script type="application/json">${JSON.stringify({note: text})}</script>`]) {
    for (const date of ["2026-10-27", "2027-03-31", "2027-04-01"])
      assert.deepEqual(findExpiredOperationalNotices(html, { now: new Date(date + "T12:00:00Z") }), []);
    assert.deepEqual(findExpiredOperationalNotices(html, { now: new Date("2027-04-02T12:00:00Z") }).map(row => row.endDate), ["2027-04-01"]);
  }
});

test("start wording does not hide expired point closures, ranges or same-sentence limits", () => {
  for (const text of [
    "Pool closed October 26, 2026.",
    "Closure starts October 25-26, 2026.",
    "Closure starts October 20, 2026; pool closed through October 26, 2026."
  ]) assert.deepEqual(findExpiredOperationalNotices(`<p>${text}</p>`, { now: new Date("2026-10-27T12:00:00Z") }).map(row => row.endDate), ["2026-10-26"]);
});

test("existing Orlando closure-start passage stays open for review at its future end", () => {
  const html = readFileSync(new URL("../site/where-to-stay/orlando-family-hotels.html", import.meta.url), "utf8");
  assert.deepEqual(findExpiredOperationalNotices(html, { now: new Date("2026-10-27T12:00:00Z") }), []);
  assert.ok(findExpiredOperationalNotices(html, { now: new Date("2027-04-02T12:00:00Z") }).some(row => row.endDate === "2027-04-01"));
});

test("date-leading failed source rechecks are inspection dates, not operating expiries", () => {
  for (const note of ["recheck unavailable", "source recheck failed", "recheck was blocked"]) {
    for (const date of ["2026-10-11T23:59:59Z", "2026-10-12T00:00:00Z", "2027-01-01T12:00:00Z"]) {
      const html = `<p>October 11, 2026 ${note}; these facts have not been renewed.</p>`;
      assert.deepEqual(findExpiredOperationalNotices(html, { now: new Date(date) }), []);
    }
    assert.deepEqual(findYearlessOperationalNotices(`<p>October 11 ${note}; these facts have not been renewed.</p>`), []);
  }
  const dc = readFileSync(new URL("../site/where-to-stay/washington-dc-family-hotels.html", import.meta.url), "utf8");
  assert.deepEqual(findExpiredOperationalNotices(dc, { now: new Date("2026-10-12T00:00:00Z") }), []);
  assert.deepEqual(findYearlessOperationalNotices(dc).map(notice => notice.dateText), ["December 25"]);
});

test("failed recheck dates cannot hide actual same-sentence operating limits", () => {
  const after = new Date("2026-10-12T12:00:00Z");
  for (const html of [
    "<p>October 11, 2026 rooms unavailable.</p>",
    "<p>Rooms unavailable through October 11, 2026.</p>",
    "<p>Rooms unavailable through October 11, 2026 recheck unavailable.</p>",
    "<p>October 10, 2026 recheck unavailable; the pool closed October 11, 2026.</p>",
    '<script type="application/json">{"note":"October 10, 2026 source recheck failed; pool closed October 11, 2026."}</script>'
  ]) {
    assert.deepEqual(findExpiredOperationalNotices(html, { now: after }).map(notice => notice.endDate), ["2026-10-11"]);
  }
  assert.deepEqual(findYearlessOperationalNotices("<p>October 10 recheck unavailable; pool closed October 11.</p>").map(notice => notice.dateText), ["October 11"]);
  assert.deepEqual(findYearlessOperationalNotices("<p>Rooms unavailable through October 11.</p>").map(notice => notice.dateText), ["October 11"]);
  assert.deepEqual(findYearlessOperationalNotices("<p>Rooms unavailable through October 11 recheck unavailable.</p>").map(notice => notice.dateText), ["October 11"]);
  assert.deepEqual(findExpiredOperationalNotices("<p>October 10, 2026 recheck unavailable; pool closed October 20, 2026.</p>", { now: after }), []);
});

test("flags an expired dated closure", () => {
  const html = "<p>The museum announced a July 21-26, 2026 closure.</p>";
  const notices = findExpiredOperationalNotices(html, { now });

  assert.equal(notices.length, 1);
  assert.equal(notices[0].endDate, "2026-07-26");
});

test("flags abbreviated month names used in compact page fields", () => {
  const html = "<p>Closed Jul 21-26, 2026; check calendar.</p>";
  const notices = findExpiredOperationalNotices(html, { now });

  assert.equal(notices.length, 1);
  assert.equal(notices[0].endDate, "2026-07-26");
});

test("allows a future dated closure", () => {
  const html = "<p>The museum will be closed August 10-12, 2026.</p>";
  assert.deepEqual(findExpiredOperationalNotices(html, { now }), []);
});

test("ignores non-operational source and review dates", () => {
  const html = [
    "<p>Sources checked July 21, 2026. Recheck current construction notices.</p>",
    "<p>Review sample collected July 20-24, 2026.</p>"
  ].join("");

  assert.deepEqual(findExpiredOperationalNotices(html, { now }), []);
});

test("inspects first-party application/json payloads", () => {
  const html = [
    "<p>Check the current calendar.</p>",
    '<script type="application/json">{"note":"Closed July 21-26, 2026"}</script>'
  ].join("");

  assert.equal(findExpiredOperationalNotices(html, { now }).length, 1);
});

test("ignores JSON-LD payloads", () => {
  const html = '<script type="application/ld+json">{"note":"Closed July 21-26, 2026"}</script>';
  assert.deepEqual(findExpiredOperationalNotices(html, { now }), []);
});

test("allows explicitly resolved historical closures", () => {
  const html = "<p>The attraction closed July 21-26, 2025, then reopened.</p>";
  assert.deepEqual(findExpiredOperationalNotices(html, { now }), []);
});

test("reports missing years separately from expiry without assuming a year", () => {
  const html = "<p>Pool construction runs August 10-September 16.</p>";
  const notices = findYearlessOperationalNotices(html);
  assert.equal(notices.length, 1);
  assert.equal(notices[0].dateText, "August 10-September 16");
  assert.equal(notices[0].reason, "missing-year");
  assert.equal("endDate" in notices[0], false);
  assert.deepEqual(findExpiredOperationalNotices(html, { now }), []);
});

test("handles abbreviated, single-day and same-month yearless dates", () => {
  for (const date of ["Sep 10", "September 10-16", "Aug 10–Sep 16"]) {
    assert.equal(findYearlessOperationalNotices(`<p>Closed ${date}.</p>`)[0].dateText, date);
  }
});

test("explicit years do not produce missing-year warnings", () => {
  for (const date of ["September 10, 2026", "Sep 10,2026", "September 10 2026", "August 10-September 16,2026", "July 21-26, 2025"]) {
    assert.deepEqual(findYearlessOperationalNotices(`<p>Closed ${date}.</p>`), []);
  }
});

test("source dates and dates in adjacent blocks do not borrow operational context", () => {
  const html = "<p>Sources checked September 14</p><p>Recheck construction notices.</p><p>Closure source checked on September 15.</p><p>Closure source checked: September 14.</p><p>Family visit July 20.</p>";
  assert.deepEqual(findYearlessOperationalNotices(html), []);
});

test("does not suppress operational dates following a source check", () => {
  const html = "<p>Project checked September 14, says construction runs August 10-September 16.</p>";
  assert.deepEqual(findYearlessOperationalNotices(html).map((x) => x.dateText), ["August 10-September 16"]);
});

test("keeps first-party JSON coverage while excluding styles, scripts and JSON-LD", () => {
  const html = '<script type="application/json">{"note":"Closed Sep 10"}</script><script type="application/ld+json">{"note":"Closed Sep 11"}</script><script>Closed Sep 12</script><style>Closed Sep 13</style>';
  assert.deepEqual(findYearlessOperationalNotices(html).map((x) => x.dateText), ["Sep 10"]);
});

test("JSON metadata and unrelated records cannot borrow operational context", () => {
  const records = [
    { note: "Pool closed Sep 10", checked: "September 14" },
    { note: "Construction underway" },
    { note: "Family visit September 14" },
    { checkedAt: "Closure source September 15" }
  ];
  const html = `<script type="application/json">${JSON.stringify(records)}</script>`;
  assert.deepEqual(findYearlessOperationalNotices(html).map((x) => x.dateText), ["Sep 10"]);
});

test("malformed JSON is not treated as one trustworthy operational passage", () => {
  const html = '<script type="application/json">{"note":"Closed Sep 10",bad}</script><p>Closed Sep 11.</p>';
  assert.deepEqual(findYearlessOperationalNotices(html).map((x) => x.dateText), ["Sep 11"]);
});

test("September 22 Chicago passage exposes yearless coverage without asserting expiry", () => {
  const html = "<p>Its project notice, checked September 14, says improvements run August 10-September 16, the pool closed August 11 and September 10, and it is open during the remainder of the project.</p>";
  assert.ok(findYearlessOperationalNotices(html).some((x) => x.dateText === "August 10-September 16"));
  assert.ok(findYearlessOperationalNotices(html).some((x) => x.dateText === "September 10"));
  assert.deepEqual(findExpiredOperationalNotices(html, { now: new Date("2026-09-22T12:00:00Z") }), []);
});

test("CLI visibly separates expiry failures from missing-year coverage", () => {
  const result = spawnSync(process.execPath, [fileURLToPath(new URL("./content-freshness.mjs", import.meta.url))], { encoding: "utf8" });
  assert.equal(result.error, undefined);
  const output = result.stdout;
  assert.match(output, /Content freshness QA:/);
  assert.match(output, /Coverage review: \d+ yearless operational date\(s\); expiry UNKNOWN, no year inferred/);
  const expired = Number(output.match(/Content freshness QA: (\d+)/)[1]);
  assert.equal(result.status, expired ? 1 : 0);
  const chicago = readFileSync(new URL("../site/where-to-stay/chicago-family-hotels.html", import.meta.url), "utf8");
  const expected = findYearlessOperationalNotices(chicago).length;
  assert.equal((output.match(/WARN site\/where-to-stay\/chicago-family-hotels.html missing year/g) ?? []).length, expected);
});

test("missing-year findings remain independent of the current calendar year", () => {
  const html = "<p>Pool closed through December 31.</p>";
  assert.equal(findYearlessOperationalNotices(html).length, 1);
  for (const year of [2025, 2026, 2027]) {
    assert.deepEqual(findExpiredOperationalNotices(html, { now: new Date(`${year}-01-01T12:00:00Z`) }), []);
  }
});

test("deduplicates identical passages without losing distinct date references", () => {
  const html = "<p>Closed August 11 and September 10.</p>";
  assert.deepEqual(findYearlessOperationalNotices(html + html).map((x) => x.dateText), ["August 11", "September 10"]);
});

test("source recheck dates are not operational end dates after the check day", () => {
  const nextDay = new Date("2026-09-23T05:00:00Z");
  const html = "<p>Notice rechecked September 22, 2026: the pool closure schedule is still uncertain.</p>";
  assert.deepEqual(findExpiredOperationalNotices(html, { now: nextDay }), []);
  assert.deepEqual(findYearlessOperationalNotices("<p>Closure notice rechecked September 22.</p>"), []);
  const withExpiry = "<p>Notice rechecked September 22, 2026: pool closed through September 20, 2026.</p>";
  assert.deepEqual(findExpiredOperationalNotices(withExpiry, { now: nextDay }).map(n => n.endDate), ["2026-09-20"]);
  const chicago = readFileSync(new URL("../site/where-to-stay/chicago-family-hotels.html", import.meta.url), "utf8");
  assert.deepEqual(findExpiredOperationalNotices(chicago, { now: nextDay }), []);
  assert.equal(findYearlessOperationalNotices(chicago).length, 4);
});

test("forward review or recheck dates are flagged; observation wording passes", () => {
  for (const text of ["<p>Price checked 2026-10-11; review due 2026-10-18.</p>", "<p>Next source review due October 23, 2026.</p>",
    "<p>Policy checked 2026-10-11; recheck 2026-10-18.</p>", "<p>Parking wording checked October 11; recheck October 18.</p>",
    "<p>Price research is next due October 16.</p>", "<p>Next price review: 2026-11-01.</p>", "<p>Review scheduled for November 3.</p>", "<p>Review prices by October 23, Bahia room facts by November 2.</p>", "<p>Review booking prices by Nov 1.</p>", "<p>Recheck the deposit amount before November 4.</p>", "<p>Sources can change before the next review date.</p>", '"Price checked","Recheck due"'])
    assert.ok(findReviewDueDates(text).length > 0, text);
  for (const text of ["<p>Price observed 2026-10-11; check live rates before booking.</p>", "<p>Notice rechecked September 22, 2026.</p>",
    "<p>October 11, 2026 recheck unavailable; these facts have not been renewed.</p>", "<p>Recheck venue and weather before leaving.</p>",
    "<p>Payment due by November 1, 2026.</p>", "<p>Balance due 2026-11-01.</p>",
    "<p>Review cancellation terms by November 1, 2026.</p>", "<p>Review the booking deadline before Nov 5.</p>", "<p>Recheck deposit rules before 2026-11-02.</p>", "<p>Review your reservation before Nov 3.</p>", "<p>Review payment terms by November 6.</p>", "<p>Review cancellation policy by November 1, 2026.</p>", "<p>Review the cancellation window before Nov 3.</p>"])
    assert.deepEqual(findReviewDueDates(text), [], text);
});

test("past-stay price samples need an older-observation label in the same block", () => {
  const now = new Date("2026-10-27T12:00:00Z");
  assert.equal(findPastStaySamples("<p>October 18-23, 2026, five nights; USD 9,723 displayed total.</p>", { now }).length, 1);
  assert.equal(findPastStaySamples("<p>October 27-30, 2026, three nights; USD 934.</p>", { now }).length, 1);
  assert.deepEqual(findPastStaySamples("<p>Older observation; dates passed. October 18-23, 2026, five nights.</p>", { now }), []);
  assert.deepEqual(findPastStaySamples("<p>November 8-13, 2026, five nights, no car.</p>", { now }), []);
  assert.deepEqual(findPastStaySamples("<p>Online-review themes sampled: July 18-21, 2026.</p>", { now }), []);
  const orlando = "<p>Observed 2026-10-11 for November 8-13, 2026, Poolside Family Suite Exterior Entry, two adults and three children (ages not entered): Special Offer, a long plan name and terms text that pushes the unit well past eighty characters, for 5 nights.</p>";
  assert.equal(findPastStaySamples(orlando, { now: new Date("2026-11-08T12:00:00Z") }).length, 1);
  assert.deepEqual(findPastStaySamples(orlando, { now }), []);
  const far = `<p>Online-review themes sampled October 18-23, 2026. ${"Unrelated planning notes about naps, routes and weather. ".repeat(6)}Parking USD 40 per night.</p>`;
  assert.deepEqual(findPastStaySamples(far, { now }), []);
  assert.equal(findPastStaySamples("<p>Room sampled October 18-23, 2026 at USD 300 per night.</p>", { now }).length, 1);
});
