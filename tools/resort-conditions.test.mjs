import { test } from "node:test";
import assert from "node:assert/strict";
import { resortData, resortPage, validateResort, camRead, drawnRead, FEED_URL, clientScript } from "./page-generation/resort-conditions-page.mjs";

const visible = (html) => html.replace(/<head>[\s\S]*?<\/head>/, "").replace(/<[^>]+>/g, " ");
const okemo = () => resortData().resorts.okemo;
const now = new Date("2026-12-19T15:37:00Z");
const feed = (over = {}) => ({ resorts: { okemo: { publish: true, name: "Okemo", status: "Looks good", line: "Fresh snow on the summit cam", read_at: "2026-12-19T15:10:00Z", cams_used: 4, cams_total: 4,
  fields: { fresh_snow: { value: "light", conf: 0.8 }, visibility: { value: "low", conf: 0.5 }, base_busyness: { value: "busy", conf: 0.9 } }, stake_inches: 4.5,
  cams: [{ name: "Summit Cam", read_at: "2026-12-19T15:10:00Z", no_read: null }], ...over } } });

test("resort data validates", () => {
  for (const [slug, r] of Object.entries(resortData().resorts)) assert.deepEqual(validateResort(r), [], slug);
});

test("no feed or an unpublished resort shows No read and no condition claims", () => {
  for (const f of [null, feed({ publish: false })]) {
    const html = visible(resortPage("okemo", resortData(), "2026-11-14", f, now));
    assert.match(html, /No cam read from us yet/);
    assert.doesNotMatch(html, /Fresh snow:|Snow stake:|Looks good/);
    assert.match(html, /Opens Sat, Nov 21 at 9 a.m./);
  }
});

test("a published fresh read shows labelled fields, drops low-confidence ones, and keeps its time", () => {
  const page = visible(resortPage("okemo", resortData(), "2026-12-19", feed(), now));
  assert.doesNotMatch(page, /Looks good|Snow stake:/, "the HTML itself never carries a read");
  assert.match(page, /Our latest read shows here with JavaScript on/);
  const d = drawnRead("okemo", resortData(), "2026-12-19", feed(), now);
  const html = visible(d.card + d.table) + page;
  assert.match(html, /Snow looks good on cams/);
  assert.match(html, /Slopes right now: our webcam read/);
  assert.match(html, /Snow stake: 4\.5 in\./);
  assert.match(html, /Fresh snow: light/);
  assert.doesNotMatch(html, /Visibility: low/, "conf under 0.6 is left out");
  assert.match(html, /Read from 4 of 4 Okemo cams on Sat, Dec 19 at 10:10am ET/);
  assert.doesNotMatch(html, /opening day is/, "opening line drops after the date");
  assert.match(html, /Dates now: Dec 17–Dec 20/);
  assert.match(visible(resortPage("okemo", resortData(), "2026-11-14")), /Next dates: Dec 17–Dec 20/);
});

test("every public status in the feed contract gets its own chip (snowcam 4174658: Thin cover, Lifts not moving)", () => {
  const cases = { "Looks good": /Snow looks good on cams/, Fair: /Fair on cams/, Busy: /Base looks busy on cams/,
    "Thin cover": /Thin snow cover on cams/, "Lifts not moving": /Lifts not moving on cams/ };
  for (const [status, chip] of Object.entries(cases)) {
    const f = feed({ status, label: status, fields: { snow_cover: { value: status === "Thin cover" ? "thin" : "good", conf: 0.8 }, lifts_moving: { value: status === "Lifts not moving" ? "not moving" : "moving", conf: 0.8 } } });
    assert.equal(camRead(f.resorts.okemo, now).status, status);
    const card = visible(drawnRead("okemo", resortData(), "2026-12-19", f, now).card);
    assert.match(card, chip, status);
    assert.doesNotMatch(card, /No read\b/, `${status} never falls back to No read`);
  }
  const thin = visible(drawnRead("okemo", resortData(), "2026-12-19", feed({ status: "Thin cover", fields: { snow_cover: { value: "thin", conf: 0.8 }, lifts_moving: { value: "not moving", conf: 0.8 } } }), now).card);
  assert.match(thin, /Snow cover: thin/);
  assert.match(thin, /Lifts: not moving/);
});

test("reads go stale after 90 minutes and hide after 6 hours", () => {
  assert.equal(camRead(feed().resorts.okemo, new Date("2026-12-19T16:50:00Z")).state, "stale");
  assert.equal(camRead(feed().resorts.okemo, new Date("2026-12-19T21:20:00Z")).state, "none");
});

test("childcare prices hide 30 days after the read", () => {
  const r = okemo();
  assert.match(visible(resortPage("okemo", resortData(), r.observed_on)), /\$210 a full day/);
  const stale = new Date(Date.parse(`${r.observed_on}T00:00:00Z`) + 31 * 864e5).toISOString().slice(0, 10);
  assert.doesNotMatch(visible(resortPage("okemo", resortData(), stale)), /\$\d/);
});

test("validation rejects a price in a field that never hides", () => {
  const r = structuredClone(okemo());
  r.plan[0].text = "Lessons $99";
  assert.ok(validateResort(r).some((x) => /holds a price/.test(x)));
});

test("feed words on the D47 never-list never reach the page", () => {
  const f = feed({ line: "Groomed and safe today", fields: { lifts_moving: { value: "open", conf: 0.9 }, snow_cover: { value: "icy", conf: 0.9 }, fresh_snow: { value: "light", conf: 0.9 } }, stake_conf: 0.4 });
  const card = visible(drawnRead("okemo", resortData(), "2026-12-19", f, now).card);
  assert.doesNotMatch(card, /Groomed|safe|Lifts: open|icy|Snow stake/);
  assert.match(card, /Fresh snow: light/);
});

test("Mount Snow: no opening date claimed, childcare prices dated, five cams named", () => {
  const html = visible(resortPage("mount-snow", resortData(), "2026-11-15"));
  assert.doesNotMatch(html, /Not open yet|Opens /);
  assert.match(html, /\$199 a full day/);
  assert.match(html, /Snow Stake, Mount Snow Summit, Mount Snow Somerset, Carinthia Cam, Mount Snow Main Base Area/);
  assert.doesNotMatch(visible(resortPage("mount-snow", resortData(), "2026-12-15")), /\$\d/);
});

test("status_read dates the resort's own status apart from the other facts (Mount Snow status read Nov 16, facts Nov 14)", () => {
  const data = resortData();
  assert.match(visible(resortPage("mount-snow", data, "2026-11-16")), /0 of 19 lifts open and no opening date\s+\(read Nov 16\)/);
  const f = { resorts: { "mount-snow": { publish: true, status: "Thin cover", line: "", read_at: "2026-11-23T15:10:00Z", cams_used: 2, cams_total: 5, fields: {}, cams: [] } } };
  assert.match(visible(drawnRead("mount-snow", data, "2026-11-23", f, new Date("2026-11-23T15:30:00Z")).card), /0 of 19 lifts open[^.]*\(read\sNov 16\)/, "leads within 7 days of its own read");
  const old = { ...f, resorts: { "mount-snow": { ...f.resorts["mount-snow"], read_at: "2026-11-24T15:10:00Z" } } };
  assert.match(visible(drawnRead("mount-snow", data, "2026-11-24", old, new Date("2026-11-24T15:30:00Z")).card), /For open lifts, check Mount Snow's\s+snow report/, "drops after 7 days");
  assert.deepEqual(validateResort({ ...data.resorts["mount-snow"], status_read: "Nov 16" }).filter((x) => x.startsWith("status_read")).length, 1);
});

test("Hunter: no opening date, no childcare prices, older lesson read dated, four cams named", () => {
  const html = visible(resortPage("hunter-mountain", resortData(), "2026-11-15"));
  assert.doesNotMatch(html, /Not open yet|Opens |\$\d|too old to show/);
  assert.match(html, /childcare is not available/);
  assert.match(html, /Hunter first-timer lessons\s+\(read Nov 10\)/);
  assert.match(html, /Base Area, Midstation, Hunter East, Summit Cam/);
});

test("Windham: public tickets, under-7 and tubing prices dated, no opening date or adult price, two cams named", () => {
  const html = visible(resortPage("windham", resortData(), "2026-11-15"));
  assert.doesNotMatch(html, /Not open yet|Opens |too old to show/);
  assert.match(html, /Kids&#39; ticket and tubing prices on Windham Mountain's pages, read Nov 15/);
  assert.match(html, /\$45 a ticket/);
  assert.match(html, /\$55 a ticket \(one rider\) for a 2-hour session/);
  assert.match(html, /open to the public/);
  assert.match(html, /Base Area, West Peak Summit/);
  assert.doesNotMatch(visible(resortPage("windham", resortData(), "2026-12-16")), /\$\d/);
});

test("feed wiring: feed keys and cam names map to our resorts (hunter-mountain reads the feed's hunter entry)", async () => {
  const { feedEntry } = await import("./page-generation/resort-conditions-page.mjs");
  const data = resortData();
  assert.equal(data.resorts["hunter-mountain"].feed_key, "hunter");
  const f = { resorts: { hunter: { publish: true, status: "Fair", line: "", read_at: "2026-12-19T15:10:00Z", cams_used: 1, cams_total: 4, fields: {},
    cams: [{ name: "Summit", read_at: "2026-12-19T15:10:00Z", no_read: null }, { name: "Midstation", read_at: null, no_read: "feed frozen" }] } } };
  assert.ok(feedEntry("hunter-mountain", data.resorts["hunter-mountain"], f));
  const dh = drawnRead("hunter-mountain", data, "2026-12-19", f, now);
  const html = visible(dh.card + dh.table);
  assert.match(html, /Summit Cam\s+\S[^]*?10:10am/);
  assert.match(html, /No read: feed frozen/);
  const dw = drawnRead("windham", data, "2026-12-19", { resorts: { windham: { ...f.resorts.hunter, cams: [{ name: "Base", read_at: "2026-12-19T15:10:00Z", no_read: null }, { name: "West Peak Summit", no_read: "lift closed" }] } } }, now);
  const w = visible(dw.table);
  assert.match(w, /West Peak Summit\s[^]*?No read\s/);
  assert.doesNotMatch(w, /lift closed/, "never-list words in no_read are dropped");
  assert.match(visible(drawnRead("hunter-mountain", data, "2026-11-16", { resorts: { hunter: { ...f.resorts.hunter, read_at: "2026-11-16T15:10:00Z" } } }, new Date("2026-11-16T15:30:00Z")).card).replace(/^/, ""), /0 lifts open[^.]*\(read\sNov 1\d\)/, "the resort's own dated status leads the card");
  assert.match(visible(drawnRead("hunter-mountain", data, "2026-11-16", { resorts: { hunter: { ...f.resorts.hunter, read_at: "2026-11-16T15:10:00Z" } } }, new Date("2026-11-16T15:30:00Z")).card), /Fair on cams/);
  assert.match(visible(dh.card), /For open lifts, check Hunter Mountain's\s+snow report/, "a status read over 7 days old does not lead");
});

test("page script: committed copy matches the generator, requests only the feed, and re-ages the deploy-time read", async () => {
  const { readFileSync } = await import("node:fs");
  const vm = await import("node:vm");
  const { clientScript } = await import("./page-generation/resort-conditions-page.mjs");
  const client = readFileSync(new URL("../site/ski/cam-read.js", import.meta.url), "utf8");
  assert.equal(client, clientScript());
  assert.doesNotMatch(client, /XMLHttpRequest|sendBeacon|localStorage|sessionStorage|document\.cookie/);
  assert.deepEqual([...client.matchAll(/https?:\/\/[^"'\s`]+/g)].map((m) => m[0]), [FEED_URL], "the only request is the snowcam feed (O53)");
  assert.equal([...client.matchAll(/\bfetch\(/g)].length, 1);
  for (const slug of Object.keys(resortData().resorts)) {
    const committed = readFileSync(new URL(`../site/ski/${slug}-conditions.html`, import.meta.url), "utf8");
    assert.match(committed, /<script src="\.\.\/ski\/cam-read\.js" defer><\/script>/);
    assert.doesNotMatch(committed, /&quot;entry&quot;/, `${slug}: committed pages carry no feed read`);
  }
  const unescape = (v) => v.replaceAll("&quot;", '"').replaceAll("&#39;", "'").replaceAll("&lt;", "<").replaceAll("&gt;", ">").replaceAll("&amp;", "&");
  const run = (page, at) => {
    const config = unescape(page.match(/data-cam-read="([^"]+)"/)[1]);
    const card = { outerHTML: "unchanged" }; const table = { innerHTML: "unchanged" };
    const T = at.getTime();
    vm.runInNewContext(clientScript(), { document: { querySelector: () => ({ dataset: { camRead: config } }), getElementById: (id) => (id === "ski-answer" ? card : table) },
      Date: class extends Date { constructor(...a) { super(...(a.length ? a : [T])); } static now() { return T; } }, JSON, Set, Map, Number, String, Object });
    return { card: card.outerHTML, table: table.innerHTML };
  };
  const built = resortPage("okemo", resortData(), "2026-12-19", feed(), now);
  const same = run(built, now);
  const drawn = drawnRead("okemo", resortData(), "2026-12-19", feed(), now);
  assert.equal(same.card, drawn.card, "same clock: the build's card");
  assert.equal(same.table, drawn.table);
  assert.match(run(built, new Date("2026-12-19T16:50:00Z")).card, /Older read[\s\S]*more than 90 minutes ago/);
  assert.match(run(built, new Date("2026-12-19T21:20:00Z")).card, /No cam read from us yet\. No recent read: the last one is more than 6 hours old\./);
  assert.equal(run(resortPage("okemo", resortData(), "2026-12-19", feed({ publish: false }), now), now).card, "unchanged", "no read, nothing to redraw");
});

test("page script: fetches the feed once on open (no cookies, no referrer), draws a newer read, keeps the read on failure (O53)", async () => {
  const vm = await import("node:vm");
  const unescape = (v) => v.replaceAll("&quot;", '"').replaceAll("&#39;", "'").replaceAll("&lt;", "<").replaceAll("&gt;", ">").replaceAll("&amp;", "&");
  const T = now.getTime();
  const run = async (page, respond) => {
    const config = unescape(page.match(/data-cam-read="([^"]+)"/)[1]);
    const card = { outerHTML: "unchanged" }; const table = { innerHTML: "unchanged" };
    const calls = [];
    const fetch = async (url, opts) => { calls.push([url, opts]); return respond(); };
    vm.runInNewContext(clientScript(), { document: { hidden: false, querySelector: () => ({ dataset: { camRead: config } }), getElementById: (id) => (id === "ski-answer" ? card : table) },
      fetch, Date: class extends Date { constructor(...a) { super(...(a.length ? a : [T])); } static now() { return T; } }, JSON, Set, Map, Number, String, Object, Error });
    await new Promise((res) => setImmediate(res));
    await new Promise((res) => setImmediate(res));
    return { card: card.outerHTML, calls };
  };
  const ok = (body) => () => ({ ok: true, text: async () => JSON.stringify(body) });
  const plain = resortPage("okemo", resortData(), "2026-12-19", null, now);
  const fresh = await run(plain, ok(feed()));
  assert.equal(fresh.calls.length, 1);
  assert.equal(fresh.calls[0][0], FEED_URL);
  assert.equal(fresh.calls[0][1].credentials, "omit");
  assert.equal(fresh.calls[0][1].referrerPolicy, "no-referrer");
  assert.equal(fresh.card, drawnRead("okemo", resortData(), "2026-12-19", feed(), now).card, "a page built with no read draws the fetched one");
  assert.equal((await run(plain, () => { throw new Error("offline"); })).card, "unchanged", "fetch failure, no read: static card stays");
  assert.equal((await run(plain, () => ({ ok: true, text: async () => "not json" }))).card, "unchanged");
  const built = resortPage("okemo", resortData(), "2026-12-19", feed(), now);
  const drawn = drawnRead("okemo", resortData(), "2026-12-19", feed(), now).card;
  assert.equal((await run(built, () => ({ ok: false, status: 503 }))).card, drawn, "fetch failure keeps the deploy-time read");
  assert.equal((await run(built, ok(feed({ read_at: "2026-12-19T14:00:00Z", status: "Busy" })))).card, drawn, "an older fetched read is ignored");
  assert.match((await run(built, ok(feed({ publish: false })))).card, /No cam read from us yet/, "an unpublished resort in the newer feed hides the read");
  // No new fetch result: the minute timer re-ages the read past 6 hours (integrity review 11-16).
  {
    const config = unescape(built.match(/data-cam-read="([^"]+)"/)[1]);
    const card = { outerHTML: "unchanged" }; const table = { innerHTML: "unchanged" };
    let t = T; const timers = [];
    vm.runInNewContext(clientScript(), { document: { hidden: false, querySelector: () => ({ dataset: { camRead: config } }), getElementById: (id) => (id === "ski-answer" ? card : table) },
      fetch: async () => { throw new Error("offline"); }, setInterval: (fn, ms) => timers.push([fn, ms]),
      Date: class extends Date { constructor(...a) { super(...(a.length ? a : [t])); } static now() { return t; } }, JSON, Set, Map, Number, String, Object, Error });
    await new Promise((res) => setImmediate(res));
    assert.equal(card.outerHTML, drawn);
    const minute = timers.find(([, ms]) => ms === 60000);
    assert.ok(minute, "a minute re-age timer");
    t = new Date("2026-12-19T21:20:00Z").getTime(); minute[0]();
    assert.match(card.outerHTML, /No recent read: the last one is more than 6 hours old/);
  }
  assert.match((await run(built, ok(feed({ read_at: "2026-12-19T15:20:00Z", status: "constructor" })))).card, /No read/, "a status that is not a listed one shows No read");
  const hunterPage = resortPage("hunter-mountain", resortData(), "2026-12-19", null, now);
  const h = await run(hunterPage, ok({ resorts: { hunter: { ...feed().resorts.okemo, name: "Hunter" } } }));
  assert.match(h.card, /Snow looks good on cams/, "the feed key maps (hunter-mountain -> hunter)");
});

test("Killington: opening day lead, kids 6 and under free, tubing prices dated, priced lines hide after 30 days", () => {
  const html = visible(resortPage("killington", resortData(), "2026-11-16"));
  assert.match(html, /Opens Wed, Nov 18 \(passholders Tue, Nov 17\)/);
  assert.match(html, /\$25 \(peak dates \$29/);
  assert.match(html, /about \$117 with 6% tax \(our sum\)/);
  assert.match(html, /Ages 4 to 6|ages 4 to 6/);
  assert.doesNotMatch(visible(resortPage("killington", resortData(), "2026-11-19")), /Not open yet/);
  assert.doesNotMatch(visible(resortPage("killington", resortData(), "2026-12-17")), /\$\d/);
});
