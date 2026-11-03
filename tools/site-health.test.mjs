import test from "node:test";
import assert from "node:assert/strict";
import { classifyLink, linksAllowed, outboundLinks, renderReport, staleObservations, visibleText } from "./site-health.mjs";

test("reports only observation dates older than the limit", () => {
  const html = "<p>Prices checked: November 1, 2026. Venue facts checked: July 31, 2026.</p><p>Founded July 4, 2001.</p>";
  const found = staleObservations(html, "2026-11-03");
  assert.deepEqual(found.map((f) => f.date), ["2026-07-31"]);
});

test("ignores scripts and attributes", () => {
  const html = '<script>{"checked":"July 1, 2026"}</script><a title="checked July 1, 2026">x</a>';
  assert.doesNotMatch(visibleText(html), /July/);
  assert.deepEqual(staleObservations(html, "2026-11-03"), []);
});

test("outbound links skip the site, map links and no-fetch hosts and drop fragments", () => {
  const html = '<a href="https://www.nps.gov/a#b">a</a><a href="https://familytripwise.com/x">b</a><a href="https://www.google.com/maps">c</a><a href="https://www.mbta.com/fares">d</a>';
  assert.deepEqual(outboundLinks(html), ["https://www.nps.gov/a"]);
});

test("only 404 and 410 count as dead", () => {
  assert.equal(classifyLink({ kind: "error", status: 404 }), "dead");
  assert.equal(classifyLink({ kind: "error", status: 410 }), "dead");
  assert.equal(classifyLink({ kind: "denied", status: 403 }), "denied");
  assert.equal(classifyLink({ kind: "robots" }), "robots");
  assert.equal(classifyLink({ kind: "error", status: 500 }), "error");
  assert.equal(classifyLink({ kind: "ok", status: 200 }), "ok");
});

test("report states that refusals are not broken links", () => {
  const md = renderReport({ today: "2026-11-03", stale: [], links: [{ url: "https://a.example/x", state: "dead", status: 404, pages: ["p.html"] }, { url: "https://b.example/", state: "denied", pages: ["p.html"] }] });
  assert.match(md, /dead 1/);
  assert.match(md, /a\.example\/x \| 404 \| p\.html/);
  assert.match(md, /not evidence a link is broken/);
});

test("a block page answering 404 is a denial, not a dead link", () => {
  assert.equal(classifyLink({ kind: "denied", status: 404 }), "denied");
});

test("links are checked at most once a week", () => {
  assert.equal(linksAllowed(null, "2026-11-03"), true);
  assert.equal(linksAllowed("2026-11-03", "2026-11-09"), false);
  assert.equal(linksAllowed("2026-11-03", "2026-11-10"), true);
});

test("report counts URLs skipped as recently read", () => {
  const md = renderReport({ today: "2026-11-03", stale: [], links: [], skippedRecent: 7 });
  assert.match(md, /Not checked: 7 URLs/);
});
