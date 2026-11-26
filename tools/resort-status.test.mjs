import test from "node:test";
import assert from "node:assert/strict";
import { parseCounts, textOf, readAll } from "./resort-status.mjs";

test("reads Vail Resorts style counts", () => {
  const html = `<html><head><title>Terrain and Lift Status</title></head><body><div class="terrain-status">
    <div><span class="c">0</span> / <span>34</span></div><p>Lifts Open</p>
    <div><span>13</span>/<span>277</span></div><p>trails Open</p></div></body></html>`;
  const c = parseCounts(textOf(html)); delete c.evidence;
  assert.deepEqual(c, { lifts: [0, 34], trails: [13, 277] });
});

const strip2 = (c) => { delete c.evidence; return c; };
test("layouts from the 11-26 dry runs", () => {
  // Vail Resorts: number above the label, then "See Lifts"
  assert.deepEqual(strip2(parseCounts("7\n/ 44\nLifts Open\nSee Lifts\n6\n/ 349\ntrails Open\nSee Trails")), { lifts: [7, 44], trails: [6, 349] });
  // Windham: label above the number; the trails number must not be read as the lift count
  assert.deepEqual(strip2(parseCounts("28°F\nTrails Open\n0/60\nLifts Open\n0/12\nTemperature")), { lifts: [0, 12], trails: [0, 60] });
  // Jay Peak: "Open Trails" / "Open Lifts" above the numbers
  assert.deepEqual(strip2(parseCounts("Base Depth\nOpen Trails\n0 / 82\nOpen Lifts\n0 / 9\nTerrain Parks\n0 / 3")), { lifts: [0, 9], trails: [0, 82] });
  // Killington: "Scheduled Lifts" is not an open count; terrain parks are not trails
  assert.deepEqual(strip2(parseCounts("Scheduled Lifts\n2/19\nOpen Trails\n3/155\nOpen Terrain Parks\n1/7")), { trails: [3, 155] });
  // Holiday Valley: one-line lifts; trails counted per difficulty, so no single trail total
  assert.deepEqual(strip2(parseCounts("Lifts\n0 of 13 OPEN LIFTS\nEasiest\n0 of 24 OPEN TRAILS\nMore Difficult\n0 of 14 OPEN TRAILS")), { lifts: [0, 13] });
  // Wolf Creek: a count with no total; Stevens Pass: 0 / 0
  assert.deepEqual(parseCounts("Lifts Open\n10\nPick of the Hill"), {});
  assert.deepEqual(parseCounts("0\n/ 0\nLifts Open\nSee Lifts"), {});
});

test("reads 'of' phrasings and ignores impossible counts", () => {
  const strip = (c) => { delete c.evidence; return c; };
  assert.deepEqual(strip(parseCounts("Lifts open: 8 of 21\nRuns open 45/155")), { lifts: [8, 21], trails: [45, 155] });
  assert.deepEqual(strip(parseCounts("12 of 20 lifts open today")), { lifts: [12, 20] });
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
