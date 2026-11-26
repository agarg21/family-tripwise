import test from "node:test";
import assert from "node:assert/strict";
import { parseCounts, textOf, readAll } from "./resort-status.mjs";

test("reads Vail Resorts style counts", () => {
  const html = `<html><head><title>Terrain and Lift Status</title></head><body><div class="terrain-status">
    <div><span class="c">0</span> / <span>34</span></div><p>Lifts Open</p>
    <div><span>13</span>/<span>277</span></div><p>trails Open</p></div></body></html>`;
  assert.deepEqual(parseCounts(textOf(html)), { lifts: [0, 34], trails: [13, 277] });
});

test("reads 'of' phrasings and ignores impossible counts", () => {
  assert.deepEqual(parseCounts("Lifts open: 8 of 21\nRuns open 45/155"), { lifts: [8, 21], trails: [45, 155] });
  assert.deepEqual(parseCounts("12 of 20 lifts open today"), { lifts: [12, 20] });
  assert.deepEqual(parseCounts("Lifts open 30/20"), {});          // open > total
  assert.deepEqual(parseCounts("2026 / 2027 lifts open"), {});     // a season, not a count
  assert.deepEqual(parseCounts("Check the lift status page"), {});
});

test("readAll obeys robots.txt, records the ET date and never invents a count", async () => {
  const pages = {
    "https://a.example/robots.txt": [200, "User-agent: *\nAllow: /"],
    "https://a.example/status": [200, "<p>3 / 10 Lifts Open</p>"],
    "https://b.example/robots.txt": [200, "User-agent: *\nDisallow: /"],
    "https://c.example/robots.txt": [404, ""],
    "https://c.example/status": [200, "<p>Loading…</p>"],
  };
  const fetchImpl = async (url) => {
    const [status, body] = pages[url] ?? [404, ""];
    return new Response(body, { status, headers: { "content-type": "text/html" } });
  };
  let t = Date.parse("2026-11-26T18:31:00Z");
  const out = await readAll({
    resorts: { a: { status_page: "https://a.example/status" }, b: { status_page: "https://b.example/status" }, c: { status_page: "https://c.example/status" } },
    fetchImpl, now: () => (t += 1000), sleep: async () => {},
  });
  assert.deepEqual(out.a.lifts, [3, 10]);
  assert.equal(out.a.read_et.date, "2026-11-26");
  assert.match(out.b.error, /robots/);
  assert.equal(out.c.lifts, undefined);
  assert.equal(out.c.error, undefined);
});
