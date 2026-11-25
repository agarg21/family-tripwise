import { test } from "node:test";
import assert from "node:assert/strict";
import { buildHistory, camHistory, resortData, resortPage } from "./page-generation/resort-conditions-page.mjs";

const snap = (at, extra = {}) => ({ resorts: { "mount-snow": { publish: true, cams_used: 3, status: "Thin cover", line: "Mount Snow: thin cover, not snowing.", read_at: at, ...extra } } });

test("history keeps only publishable, readable reads, newest first, deduped", () => {
  const h = buildHistory([
    snap("2026-11-23T21:18:00Z"),
    snap("2026-11-23T21:18:00Z"),
    snap("2026-11-24T21:18:00Z"),
    snap("2026-11-24T22:30:00Z", { status: "No read", cams_used: 0 }),
    snap("2026-11-22T21:18:00Z", { publish: false }),
  ]);
  assert.deepEqual(h["mount-snow"].map((x) => x.read_at), ["2026-11-24T21:18:00Z", "2026-11-23T21:18:00Z"]);
});

test("one row per local day, last 5 days, dated, no 'today' wording, resort name trimmed", () => {
  const r = { ...resortData().resorts["mount-snow"], name: "Mount Snow", tz: "America/New_York" };
  const entries = buildHistory(["2026-11-18", "2026-11-20", "2026-11-21", "2026-11-22", "2026-11-23", "2026-11-24"].flatMap((d) => [snap(`${d}T14:00:00Z`), snap(`${d}T21:00:00Z`)]))["mount-snow"];
  const html = camHistory(r, entries, new Date("2026-11-24T23:00:00Z"));
  const rows = html.match(/<tr><th scope="row">/g) ?? [];
  assert.equal(rows.length, 5);
  assert.match(html, /Tue Nov 24/);
  assert.doesNotMatch(html, /Nov 18|Today/);
  assert.match(html, /4:00pm/);
  assert.match(html, /Not snowing\./);
  assert.doesNotMatch(html, />Mount Snow: /);
  assert.equal(camHistory(r, [], new Date()), "");
});

test("a resort page shows the history table and points the empty card to it", () => {
  const feed = { resorts: { "mount-snow": { publish: true, cams_used: 0, cams_total: 5, status: "No read", read_at: "2026-11-24T22:30:00Z", cams: [] } },
    history: { "mount-snow": [{ read_at: "2026-11-24T21:18:00Z", status: "Thin cover", line: "Mount Snow: thin cover." }] } };
  const html = resortPage("mount-snow", resortData(), "2026-11-24", feed, new Date("2026-11-24T22:40:00Z"));
  assert.match(html, /id="cam-history"/);
  assert.match(html, /history_below/);
  const plain = resortPage("mount-snow", resortData(), "2026-11-24", null, new Date("2026-11-24T22:40:00Z"));
  assert.doesNotMatch(plain, /id="cam-history"/);
});

test("a gap keeps the fixed 5-day heading; Closed and withdrawn reads never show", () => {
  const r = { ...resortData().resorts["mount-snow"], name: "Mount Snow", tz: "America/New_York" };
  const entries = buildHistory([snap("2026-11-24T20:00:00Z"), snap("2026-11-20T20:00:00Z"), snap("2026-11-22T20:00:00Z", { status: "Closed" }),
    snap("2026-11-23T20:00:00Z"), snap("2026-11-23T20:00:00Z", { publish: false }), snap("2026-11-21T20:00:00Z", { cams_used: 0 }), snap("2026-11-21T21:00:00Z", { status: "Snowy" })])["mount-snow"];
  const html = camHistory(r, entries, new Date("2026-11-24T23:00:00Z"));
  assert.match(html, /last 5 days/);
  assert.equal((html.match(/<tr><th scope="row">/g) ?? []).length, 2);
  assert.doesNotMatch(html, /Nov 23|Nov 22|Nov 21|Resort says closed/);
});

test("days follow the resort's own time zone (Mountain time)", () => {
  const r = { ...resortData().resorts["vail"], name: "Vail", tz: "America/Denver" };
  const entries = buildHistory([{ resorts: { vail: { publish: true, cams_used: 2, status: "Fair", line: "Vail Mountain: good cover.", read_at: "2026-11-25T03:00:00Z" } } }]).vail;
  const html = camHistory(r, entries, new Date("2026-11-25T05:17:00Z"));
  assert.match(html, /Tue Nov 24/);
  assert.match(html, /8:00pm/);
  assert.match(html, /Good cover\./);
});

test("the empty card points to the table only when the table is there", () => {
  const base = { resorts: { "mount-snow": { publish: true, cams_used: 0, cams_total: 5, status: "No read", read_at: "2026-11-24T22:30:00Z", cams: [] } } };
  const now = new Date("2026-11-24T22:40:00Z");
  const withHist = resortPage("mount-snow", resortData(), "2026-11-24", { ...base, history: { "mount-snow": [{ read_at: "2026-11-24T21:18:00Z", status: "Thin cover", line: "x" }] } }, now);
  assert.match(withHist, /&quot;history_below&quot;:true/);
  assert.doesNotMatch(resortPage("mount-snow", resortData(), "2026-11-24", base, now), /history_below/);
});
