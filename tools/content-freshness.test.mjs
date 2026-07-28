import assert from "node:assert/strict";
import test from "node:test";

import { findExpiredOperationalNotices } from "./content-freshness.mjs";

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
