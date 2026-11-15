import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import test from "node:test";
import { camRead, resortData, resortPage } from "./page-generation/resort-conditions-page.mjs";

// site/resort-live.js redraws the conditions card in the browser from the snowcam feed. It must apply exactly the
// same D47 rules and markup as the build (camRead/readCard/camTable), so run both on the same feed samples.
const live = (() => {
  const ctx = {};
  vm.createContext(ctx);
  vm.runInContext(`${readFileSync("site/resort-live.js", "utf8")}\nthis.L = TripwiseResortLive;`, ctx);
  return ctx.L;
})();

const now = new Date("2026-12-05T15:00:00Z");
const base = {
  publish: true, name: "Okemo", status: "Looks good", label: "Looks good", line: "Fresh snow on the upper mountain.",
  read_at: "2026-12-05T14:40:00Z", cams_used: 3, cams_total: 4, stake_inches: 4.5,
  fields: {
    fresh_snow: { value: "light", conf: 0.8 }, snowmaking: { value: "running", conf: 0.9 },
    visibility: { value: "good", conf: 0.5 }, base_busyness: { value: "quiet", conf: 0.7 },
  },
  cams: [{ name: "Summit", role: "summit", read_at: null, no_read: "fogged in" }],
};
const samples = {
  published: base,
  unpublished: { ...base, publish: false },
  stale: { ...base, read_at: "2026-12-05T12:00:00Z" },
  hidden: { ...base, read_at: "2026-12-05T08:00:00Z" },
  future: { ...base, read_at: "2026-12-05T16:00:00Z" },
  banned: { ...base, line: "Trails look open and safe.", fields: { fresh_snow: { value: "icy patches", conf: 0.9 }, base_busyness: { value: "packed", conf: 0.9 } } },
  lowStake: { ...base, stake_conf: 0.4 },
  closed: { ...base, status: "Closed" },
  oddStatus: { ...base, status: "Epic" },
  protoKeys: { ...base, status: "constructor", fields: { constructor: { value: "x", conf: 0.9 }, toString: { value: "y", conf: 0.9 } } },
  stakeZero: { ...base, stake_conf: undefined, fields: { stake: 0 } },
  camsNotArray: { ...base, cams: "nope" },
  camsWithNull: { ...base, cams: [null, { name: "Summit", read_at: null, no_read: "fogged in" }] },
};
const strip = ({ reason, ...rest }) => rest;
const plain = (v) => JSON.parse(JSON.stringify(v));

test("browser camRead matches the build camRead on every sample", () => {
  for (const [name, f] of Object.entries(samples)) {
    assert.deepEqual(plain(live.camRead(f, now)), strip(camRead(f, now)), name);
  }
  assert.equal(live.camRead(undefined, now).state, "none");
});

test("browser card and cam table match the build markup for a published read", () => {
  const data = resortData();
  for (const slug of Object.keys(data.resorts)) {
    const key = data.resorts[slug].feed_key ?? slug;
    const feed = { resorts: { [key]: { ...base, name: data.resorts[slug].name } } };
    const html = resortPage(slug, data, "2026-12-05", feed, now);
    const liveJson = html.match(/<script type="application\/json" id="resort-live-data">([^<]*)<\/script>/);
    assert.ok(liveJson, `${slug}: live data block`);
    const r = JSON.parse(liveJson[1]);
    assert.equal(r.slug, key);
    const norm = (s) => s.replace(/>\s+</g, "><").trim();
    const boxInner = html.match(/<section id="ski-answer"[^>]*>([\s\S]*?)<\/section>/)[1];
    const read = live.camRead(feed.resorts[key], now);
    assert.equal(norm(live.card(r, read, "2026-12-05")), norm(boxInner), `${slug}: card`);
    const tableHtml = html.match(/<h2 id="cams-title">Cam by cam<\/h2>\s*([\s\S]*?)\s*<\/section>/)[1];
    assert.equal(norm(live.table(r, read)), norm(tableHtml), `${slug}: table`);
  }
});

test("feed cam names and resort keys match the page's (real feed shapes, 11-15)", async () => {
  const { matchCam } = await import("./page-generation/resort-conditions-page.mjs");
  const data = resortData();
  const feedCams = { okemo: ["Snow Stake", "Summit", "Sugar House", "Roundhouse"], "mount-snow": ["Snow Stake", "Summit", "Somerset", "Carinthia", "Main Base Area"], hunter: ["Base Area", "Midstation", "Hunter East", "Summit"], windham: ["Base"] };
  for (const [slug, r] of Object.entries(data.resorts)) {
    const key = r.feed_key ?? slug;
    assert.ok(feedCams[key], `${slug}: feed key ${key}`);
    const cams = feedCams[key].map((name) => ({ name }));
    const matched = r.cams.filter((c) => matchCam(c.name, cams, r.name)).length;
    assert.ok(matched >= Math.min(cams.length, r.cams.length), `${slug}: ${matched} of ${r.cams.length} cams matched`);
  }
  // Before opening day the resort's date leads and the browser card matches the build card.
  const feed = { resorts: { okemo: { ...base, cams: [{ name: "Summit", read_at: "2026-11-20T14:40:00Z", no_read: null }], read_at: "2026-11-20T14:40:00Z" } } };
  const at = new Date("2026-11-20T15:00:00Z");
  const html = resortPage("okemo", data, "2026-11-20", feed, at);
  assert.match(html, /Not open yet[\s\S]*Looks good/);
  assert.match(html, /Summit Cam<\/th><td>[^<]*<\/td><td>9:40am ET/);
  const r = JSON.parse(html.match(/id="resort-live-data">([^<]*)</)[1]);
  const norm = (s) => s.replace(/>\s+</g, "><").trim();
  const read = live.camRead(feed.resorts.okemo, at);
  assert.equal(norm(live.card(r, read, "2026-11-20")), norm(html.match(/<section id="ski-answer"[^>]*>([\s\S]*?)<\/section>/)[1]));
});

test("pages ship the No-read card and load the live script; the feed URL is the spec's", () => {
  const data = resortData();
  for (const slug of Object.keys(data.resorts)) {
    const html = readFileSync(`site/ski/${slug}-conditions.html`, "utf8");
    assert.match(html, /<script src="\.\.\/resort-live\.js" defer><\/script>/, slug);
    assert.match(html, /separate automated accuracy check/, slug);
  }
  assert.ok(readFileSync("docs/plan/resort-conditions-pages.md", "utf8").includes(live.FEED));
});
