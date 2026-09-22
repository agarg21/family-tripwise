import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

import { findExpiredOperationalNotices, findYearlessOperationalNotices } from "./content-freshness.mjs";

const now = new Date("2026-07-28T12:00:00Z");

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
