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
  assert.match(html, /Our webcam read/);
  assert.match(html, /Okemo's own status/);
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

test("status_read dates the resort's own status apart from the other facts (Mount Snow status re-read Nov 23, facts Nov 14)", () => {
  const data = resortData();
  assert.match(visible(resortPage("mount-snow", data, "2026-11-23")), /0 of 19 lifts open and no opening date\s+\(read\sNov\s23\)/);
  const f = { resorts: { "mount-snow": { publish: true, status: "Thin cover", line: "", read_at: "2026-11-30T15:10:00Z", cams_used: 2, cams_total: 5, fields: {}, cams: [] } } };
  assert.match(visible(drawnRead("mount-snow", data, "2026-11-30", f, new Date("2026-11-30T15:30:00Z")).card), /0 of 19 lifts open[^.]*\(read\sNov\s23\)/, "leads within 7 days of its own read");
  const old = { ...f, resorts: { "mount-snow": { ...f.resorts["mount-snow"], read_at: "2026-12-01T15:10:00Z" } } };
  assert.match(visible(drawnRead("mount-snow", data, "2026-12-01", old, new Date("2026-12-01T15:30:00Z")).card), /For open lifts, check Mount Snow's\s+snow report/, "drops after 7 days");
  assert.deepEqual(validateResort({ ...data.resorts["mount-snow"], status_read: "Nov 16" }).filter((x) => x.startsWith("status_read")).length, 1);
});

test("the resort's own status leads with a short dated chip (persona review 11-16)", () => {
  const data = resortData();
  const ms = visible(resortPage("mount-snow", data, "2026-11-23"));
  assert.match(ms, /Mount Snow's own status\s+No lifts open on Nov\s23\s*Mount Snow&#39;s\s+lift and terrain status page\s+showed 0 of 19 lifts/);
  assert.ok(ms.indexOf("own status") < ms.indexOf("Our webcam read"), "status before the cam read");
  assert.doesNotMatch(visible(resortPage("mount-snow", data, "2026-12-01")), /No lifts open/, "the lift count drops 7 days after its read");
  const ok = visible(resortPage("okemo", data, "2026-11-16"));
  assert.match(ok, /Not open yet\s*Opens Sat, Nov 21 at 9 a.m./);
  assert.match(visible(resortPage("okemo", data, "2026-11-21")), /Opening day/);
  assert.doesNotMatch(visible(resortPage("okemo", data, "2026-11-22")), /Not open yet|Opening day/);
  assert.match(visible(resortPage("killington", data, "2026-11-17")), /Passholders only today\s*Opens to everyone Wed, Nov 18/, "no 'Not open yet' on the passholder day");
  assert.match(visible(resortPage("killington", data, "2026-11-16")), /Not open yet/);
  const nr = { resorts: { "mount-snow": { publish: true, status: "No read", line: "no clear view (sun -8 deg below horizon, infrared mode)", read_at: "2026-11-16T22:10:00Z", cams_used: 0, cams_total: 5, fields: {}, cams: [] } } };
  const nrCard = visible(drawnRead("mount-snow", data, "2026-11-16", nr, new Date("2026-11-16T22:30:00Z")).card);
  assert.match(nrCard, /No cam read right now/);
  assert.doesNotMatch(nrCard, /infrared|Read from 0/, "a no-read never shows model wording or a 0-cam read line");
  assert.equal(validateResort({ ...data.resorts.windham, status_lifts_open: -1 }).filter((x) => x.startsWith("status_lifts_open")).length, 1);
  assert.equal(validateResort({ ...data.resorts.windham, status_not_open: "yes" }).filter((x) => x.startsWith("status_not_open")).length, 1);
});

test("Hunter: no opening date, no childcare prices, older lesson read dated, four cams named", () => {
  const html = visible(resortPage("hunter-mountain", resortData(), "2026-11-15"));
  assert.doesNotMatch(html, /Not open yet|Opens |\$\d|too old to show/);
  assert.match(html, /childcare is not available/);
  assert.match(html, /Hunter first-timer lessons\s+\(read Nov 10\)/);
  assert.match(html, /Base Area, Midstation, Hunter East, Summit Cam/);
});

test("source footers never stack two read dates; undated lists keep the plain read date (G19 P3, 11-22)", () => {
  const data = resortData();
  for (const slug of Object.keys(data.resorts)) {
    const html = visible(resortPage(slug, data, "2026-11-22"));
    assert.doesNotMatch(html, /\(read [A-Z][a-z]{2} \d+\)\s*\(read /, `${slug}: stacked read dates`);
  }
  const hunter = visible(resortPage("hunter-mountain", data, "2026-11-22"));
  assert.match(hunter, /Hunter hours of operation\s+\(read Nov 22\)\. Read Nov 15 unless dated\. We haven't skied/);
  assert.match(visible(resortPage("okemo", data, "2026-11-22")), /\(read Nov \d+\)\. We haven't skied Okemo/);
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
  assert.match(visible(drawnRead("hunter-mountain", data, "2026-11-22", { resorts: { hunter: { ...f.resorts.hunter, read_at: "2026-11-22T15:10:00Z" } } }, new Date("2026-11-22T15:30:00Z")).card), /hours page said lifts are closed[^.]*\(read\sNov\s22\)/, "the resort's own dated status leads the card");
  assert.doesNotMatch(visible(drawnRead("hunter-mountain", data, "2026-11-22", f, now).card), /lifts? open on/, "no lift-count chip without a status-page count");
  assert.match(visible(drawnRead("windham", data, "2026-11-22", { resorts: {} }, new Date("2026-11-22T15:30:00Z")).card), /No lifts open on Nov\s22[^]*0 of 12 lifts and 0 of 60 trails open[^.]*\(read\sNov\s22\)/);
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
  assert.match((await run(built, ok(feed({ read_at: "2026-12-19T15:20:00Z", status: "constructor" })))).card, /No cam read right now/, "a status that is not a listed one shows no read");
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

test("Jay Peak: public opening Nov 28 with a passholder day, family-of-4 ticket sum, opening source named, prices hide after 30 days", () => {
  const data = resortData();
  assert.match(visible(resortPage("jay-peak", data, "2026-11-16")), /Not open yet\s*Opens Sat, Nov 28/);
  assert.match(visible(resortPage("jay-peak", data, "2026-11-16")), /Jay Peak's opening weekend post, read/);
  assert.match(visible(resortPage("jay-peak", data, "2026-11-27")), /Passholders only today\s*Opens to everyone Sat, Nov 28/);
  assert.match(visible(resortPage("jay-peak", data, "2026-11-16")), /about \$481 on a weekend, \$399 midweek/);
  assert.doesNotMatch(visible(resortPage("jay-peak", data, "2026-12-17")), /\$\d/);
});

test("Stowe: no posted opening date, so no open/closed chip; childcare and parking priced, no invented ticket prices or NYC drive time", () => {
  const data = resortData();
  const page = visible(resortPage("stowe", data, "2026-11-16"));
  assert.doesNotMatch(page, /Not open yet|Opening day/);
  assert.match(page, /opening dates are still to be determined/);
  assert.match(page, /\$270 to \$285 a day/);
  assert.match(page, /posts no drive time from New York City/);
  assert.doesNotMatch(visible(resortPage("stowe", data, "2026-12-17")), /\$\d/);
});

test("Sugarbush: Lincoln Peak opening Nov 21 conditions permitting; ticket deals priced, no kids' prices or family-of-4 sum invented", () => {
  const data = resortData();
  const page = visible(resortPage("sugarbush", data, "2026-11-17"));
  assert.match(page, /Not open yet/);
  assert.match(page, /conditions permitting/);
  assert.match(page, /\$479 midweek/);
  assert.match(page, /no kids.{0,6} ticket, lesson or childcare prices/i);
  assert.match(page, /posts no drive time from New York City/);
  assert.doesNotMatch(visible(resortPage("sugarbush", data, "2026-12-17")), /\$\d/);
});

test("Stratton: opening postponed from Nov 25 (no new date, read Nov 23); Kids Ski Free Week and childcare priced; no lift ticket prices or family-of-4 sum invented", () => {
  const data = resortData();
  const page = visible(resortPage("stratton", data, "2026-11-23"));
  assert.match(page, /Not open on Nov\s23\s*Stratton&#39;s opening day page \(Nov 20 update\) says opening is postponed from Wed, Nov 25; no new date yet\s+\(read\sNov\s23\)/);
  assert.doesNotMatch(page, /Opens Wed|Opening day|Target opening day/, "no projected date after the resort postponed it");
  assert.doesNotMatch(visible(resortPage("stratton", data, "2026-11-25")), /Opening day|Not open yet/, "no opening-day chip on the old date");
  assert.doesNotMatch(visible(resortPage("stratton", data, "2026-12-01")), /Not open on|postponed/, "the dated status hides 7 days after its read");
  assert.match(page, /17 and under/);
  assert.match(page, /\$209/);
  assert.match(page, /can.{0,6}t sum a family-of-4 day/);
  assert.match(page, /From New York City, Stratton&#39;s route runs via Albany and Manchester, Vermont \(it posts no drive time\)/);
  assert.doesNotMatch(visible(resortPage("stratton", data, "2026-12-17")), /\$\d/);
});

test("Seven Springs: dated 0-of-14 lift status, no opening date invented; lesson ages; parking the only price; no family-of-4 sum", () => {
  const data = resortData();
  const page = visible(resortPage("seven-springs", data, "2026-11-17"));
  assert.match(page, /No lifts open on Nov\s17/);
  assert.match(page, /ages 3 to 6/);
  assert.match(page, /\$30 a day/);
  assert.match(page, /can.{0,6}t sum a family-of-4 day/);
  assert.match(page, /Car: take the Pennsylvania Turnpike[^<]*\(It posts no drive time from New York City\.\)/);
  assert.doesNotMatch(page, /Car: Seven Springs lists no drive time/);
  assert.doesNotMatch(page, /Opens (Sat|Sun|Mon|Tue|Wed|Thu|Fri)/);
  assert.doesNotMatch(visible(resortPage("seven-springs", data, "2026-12-18")), /\$\d/);
});

test("Winter Park: season dates from the hours page, adult-only prices, Kids Ski Free 4-14, Denver getting-there, no NYC lines", () => {
  const data = resortData();
  const html = resortPage("winter-park", data, "2026-11-17");
  const page = visible(html);
  assert.match(page, /Nov 13, 2026 to Apr 18, 2027/);
  assert.match(page, /from \$113/);
  assert.match(page, /ages 4 to 14/);
  assert.match(page, /can.{0,6}t sum a family-of-4 day/);
  assert.match(page, /Getting there from Denver/);
  assert.doesNotMatch(html.split("<main")[1].split("</main>")[0], /skiing-near-new-york-city-with-kids/);
  assert.doesNotMatch(html, /holiday-nudge|related-this-week|More New York City family guides/);
  assert.doesNotMatch(visible(resortPage("winter-park", data, "2026-12-18")), /\$\d/);
});

test("Bogus Basin: opening weekend from its conditions page, lesson prices, no daycare, Boise getting-there, no NYC lines", () => {
  const data = resortData();
  const html = resortPage("bogus-basin", data, "2026-11-17");
  const page = visible(html);
  assert.match(page, /Sat, Nov 21 and Sun, Nov 22/);
  assert.match(page, /\$59 per child/);
  assert.match(page, /do not have daycare/);
  assert.match(page, /can.{0,6}t sum a family-of-4 day/);
  assert.match(page, /Getting there from Boise/);
  assert.doesNotMatch(html.split("<main")[1].split("</main>")[0], /skiing-near-new-york-city-with-kids/);
  assert.doesNotMatch(html, /holiday-nudge|related-this-week|More New York City family guides/);
  assert.doesNotMatch(visible(resortPage("bogus-basin", data, "2026-12-18")), /\$\d/);
});

test("Breckenridge: childcare rates and dates, lesson ages, no ticket prices, Denver getting-there, no NYC lines", () => {
  const data = resortData();
  const html = resortPage("breckenridge", data, "2026-11-17");
  const page = visible(html);
  assert.match(page, /6 months to 4 years/);
  assert.match(page, /\$250 booked ahead/);
  assert.match(page, /can.{0,6}t sum a family-of-4 day/);
  assert.match(page, /Getting there from Denver/);
  assert.match(page, /no opening date or lift count/);
  assert.doesNotMatch(html.split("<main")[1].split("</main>")[0], /skiing-near-new-york-city-with-kids/);
  assert.doesNotMatch(html, /holiday-nudge|related-this-week|More New York City family guides/);
  assert.doesNotMatch(visible(resortPage("breckenridge", data, "2026-12-18")), /\$\d/);
});

test("Park City: season from the hours page, childcare and parking rates, lesson ages, no ticket prices, Salt Lake City getting-there, no NYC lines", () => {
  const data = resortData();
  const html = resortPage("park-city", data, "2026-11-17");
  const page = visible(html);
  assert.match(page, /Not open yet/);
  assert.match(page, /Opens Wed, Nov 25/);
  assert.match(page, /hours page, read.Nov.24/);
  const day = visible(resortPage("park-city", data, "2026-11-25"));
  assert.match(day, /Target opening day/);
  assert.doesNotMatch(day, /cam-read-chip deal-verdict-worth_it|>Opening day</);
  assert.match(page, /6 weeks to 6 years/);
  assert.match(page, /\$238 full day/);
  assert.match(page, /\$29 a car with a reservation/);
  assert.match(page, /can.{0,6}t sum a family-of-4 day/);
  assert.match(page, /Getting there from Salt Lake City/);
  assert.doesNotMatch(html.split("<main")[1].split("</main>")[0], /skiing-near-new-york-city-with-kids/);
  assert.doesNotMatch(html, /holiday-nudge|related-this-week|More New York City family guides/);
  assert.doesNotMatch(visible(resortPage("park-city", data, "2026-12-18")), /\$\d/);
});

test("Vail: open-for-season line from the hours page, no childcare, lesson ages, parking rates only, Denver getting-there, no NYC lines", () => {
  const data = resortData();
  const html = resortPage("vail", data, "2026-11-17");
  const page = visible(html);
  assert.match(page, /Open For The Season!/);
  assert.match(page, /do not currently offer childcare/);
  assert.match(page, /9:30am to 3:30pm/);
  assert.match(page, /up to \$50/);
  assert.match(page, /can.{0,6}t sum a family-of-4 day/);
  assert.match(page, /Getting there from Denver/);
  assert.doesNotMatch(page, /lifts? open on/);
  assert.doesNotMatch(html.split("<main")[1].split("</main>")[0], /skiing-near-new-york-city-with-kids/);
  assert.doesNotMatch(html, /holiday-nudge|related-this-week|More New York City family guides/);
  assert.doesNotMatch(visible(resortPage("vail", data, "2026-12-18")), /\$\d/);
});

test("Keystone: open-for-season line from the hours page, childcare ages, lesson times, no dollar amounts, Denver getting-there, no NYC lines", () => {
  const data = resortData();
  const html = resortPage("keystone", data, "2026-11-17");
  const page = visible(html);
  assert.match(page, /We are open for Winter 26\/27 Season!/);
  assert.match(page, /6 months to 5 years/);
  assert.match(page, /9am to 3pm/);
  assert.match(page, /can.{0,6}t sum a family-of-4 day/);
  assert.match(page, /Getting there from Denver/);
  assert.doesNotMatch(page, /\$\d/);
  assert.doesNotMatch(page, /lifts? open on/);
  assert.doesNotMatch(html.split("<main")[1].split("</main>")[0], /skiing-near-new-york-city-with-kids/);
  assert.doesNotMatch(html, /holiday-nudge|related-this-week|More New York City family guides/);
});

test("Copper Mountain: opening-day line, lesson ages and prices with basis, kids 4 and under free, no family sum, Denver getting-there, no NYC lines", () => {
  const data = resortData();
  const html = resortPage("copper-mountain", data, "2026-11-17");
  const page = visible(html);
  assert.match(page, /Sunday, November 8, 2026/);
  assert.match(page, /ages 3 to 5 and 6 to 17/);
  assert.match(page, /\$364\.65/);
  assert.match(page, /doesn.{0,6}t say .{0,6}per child/);
  assert.match(page, /4 and under ski free/);
  assert.match(page, /can.{0,6}t sum a family-of-4 day/);
  assert.match(page, /Getting there from Denver/);
  assert.doesNotMatch(page, /lifts? open on/);
  assert.doesNotMatch(html.split("<main")[1].split("</main>")[0], /skiing-near-new-york-city-with-kids/);
  assert.doesNotMatch(html, /holiday-nudge|related-this-week|More New York City family guides/);
});

test("Telluride: targeted opening Nov 26, lesson ages and prices with basis, nursery from 2 months, no family sum, airport getting-there, no NYC lines", () => {
  const data = resortData();
  const html = resortPage("telluride", data, "2026-11-17");
  const page = visible(html);
  assert.match(page, /Not open yet/);
  assert.match(page, /Nov 26, 2026/);
  assert.match(page, /Otters ages 3 to 4/);
  assert.match(page, /\$420 regular season/);
  assert.match(page, /don.{0,6}t state a unit \(we assume/);
  assert.match(page, /2 months to 4 years/);
  assert.match(page, /75-minute drive.*1 hour 30 minutes/);
  assert.match(page, /can.{0,6}t sum a family-of-4 day/);
  assert.doesNotMatch(html.split("<main")[1].split("</main>")[0], /skiing-near-new-york-city-with-kids/);
  assert.doesNotMatch(html, /holiday-nudge|related-this-week|More New York City family guides/);
});

test("Crested Butte: opens Nov 25, no childcare, lesson ages, meeting-point and helmet conflicts disclosed, garage rate, no family sum, no NYC lines", () => {
  const data = resortData();
  const html = resortPage("crested-butte", data, "2026-11-17");
  const page = visible(html);
  assert.match(page, /Not open yet/);
  assert.match(page, /Nov 25/);
  assert.match(page, /does not offer childcare services/);
  assert.match(page, /ages 7 to 14/);
  assert.match(page, /Magic Carpets/);
  assert.match(page, /\$30 per vehicle/);
  assert.match(page, /can.{0,6}t sum a family-of-4 day/);
  assert.doesNotMatch(html.split("<main")[1].split("</main>")[0], /skiing-near-new-york-city-with-kids/);
  assert.doesNotMatch(html, /holiday-nudge|related-this-week|More New York City family guides/);
});

test("Snowbird: opens Nov 27 (tentative), group lessons from Dec 12, childcare 6 weeks-12 years, starting-at ticket sums, no NYC lines", () => {
  const data = resortData();
  const html = resortPage("snowbird", data, "2026-11-17");
  const page = visible(html);
  assert.match(page, /Not open yet/);
  assert.match(page, /Nov 27/);
  assert.match(page, /Dec 12, 2026 to Apr 11, 2027/);
  assert.match(page, /6 weeks to 12 years/);
  assert.match(page, /from \$624/);
  assert.match(page, /\$195 \/ \$117/);
  assert.match(page, /6 and under ski free but need a ticket/);
  assert.doesNotMatch(html.split("<main")[1].split("</main>")[0], /skiing-near-new-york-city-with-kids/);
  assert.doesNotMatch(html, /holiday-nudge|related-this-week|More New York City family guides/);
});

test("Alta: opens Nov 25, skiers only, childcare 2 months-12 years, $270 kids' lesson, no ticket sum, no NYC lines", () => {
  const data = resortData();
  const html = resortPage("alta", data, "2026-11-17");
  const page = visible(html);
  assert.match(page, /Not open yet/);
  assert.match(page, /Nov 25/);
  assert.match(page, /Snowboarding is not permitted/);
  assert.match(page, /2 months to 12 years/);
  assert.match(page, /\$270/);
  assert.match(page, /no lift ticket prices/);
  assert.doesNotMatch(page, /family of 4 lift tickets/i);
  assert.doesNotMatch(html.split("<main")[1].split("</main>")[0], /skiing-near-new-york-city-with-kids/);
  assert.doesNotMatch(html, /holiday-nudge|related-this-week|More New York City family guides/);
});

test("Jackson Hole: opens Nov 27, kids 4 and under free, nannies 5-36 months, $275-$449 lessons, kids-free sum only, no NYC lines", () => {
  const data = resortData();
  const html = resortPage("jackson-hole", data, "2026-11-17");
  const page = visible(html);
  assert.match(page, /Not open yet/);
  assert.match(page, /Nov 27/);
  assert.match(page, /Kids 4 and under ski free/);
  assert.match(page, /5 to 36 months/);
  assert.match(page, /\$275-\$449/);
  assert.match(page, /from \$170/);
  assert.match(page, /no youth or teen ticket price/);
  assert.doesNotMatch(html.split("<main")[1].split("</main>")[0], /skiing-near-new-york-city-with-kids/);
  assert.doesNotMatch(html, /holiday-nudge|related-this-week|More New York City family guides/);
});

test("Mt Bachelor: opens Dec 4, kids 5 and under free, childcare 6 weeks-10 years, $279 Mountain Rippers, weekend family sum, no NYC lines", () => {
  const data = resortData();
  const html = resortPage("mt-bachelor", data, "2026-11-17");
  const page = visible(html);
  assert.match(page, /Not open yet/);
  assert.match(page, /Dec 4/);
  assert.match(page, /5 and under ski free/);
  assert.match(page, /6 weeks to 10 years/);
  assert.match(page, /from \$279/);
  assert.match(page, /\$626/);
  assert.match(page, /no childcare session rate/);
  assert.doesNotMatch(html.split("<main")[1].split("</main>")[0], /skiing-near-new-york-city-with-kids/);
  assert.doesNotMatch(html, /holiday-nudge|related-this-week|More New York City family guides/);
});

test("Timberline: no opening date, closed note dated, kids 6 and under free, Kids Club 4-12, peak family sum, no NYC lines", () => {
  const data = resortData();
  const html = resortPage("timberline", data, "2026-11-17");
  const page = visible(html);
  assert.match(page, /closed until there is enough snow/);
  assert.doesNotMatch(page, /Not open yet/);
  assert.match(page, /6 and under ski free/);
  assert.match(page, /Kids Club, ages 4 to 12/);
  assert.match(page, /\$524/);
  assert.match(page, /no childcare/);
  assert.doesNotMatch(html.split("<main")[1].split("</main>")[0], /skiing-near-new-york-city-with-kids/);
  assert.doesNotMatch(html, /holiday-nudge|related-this-week|More New York City family guides/);
});

test("Heavenly: opens Nov 20, childcare 6 weeks-6 years with prices, Ski & Play, free lodge parking, no ticket sum, no NYC lines", () => {
  const data = resortData();
  const html = resortPage("heavenly", data, "2026-11-17");
  const page = visible(html);
  assert.match(page, /Not open yet/);
  assert.match(page, /Opens Fri, Nov 20/);
  assert.match(page, /6 weeks to 6 years/);
  assert.match(page, /\$260/);
  assert.match(page, /\$300, or \$353 with rentals/);
  assert.match(page, /Free every day at Boulder and Stagecoach/);
  assert.match(page, /no lift ticket or lesson prices/);
  assert.doesNotMatch(html.split("<main")[1].split("</main>")[0], /skiing-near-new-york-city-with-kids/);
  assert.doesNotMatch(html, /holiday-nudge|related-this-week|More New York City family guides/);
});

test("Kirkwood: opens Dec 4, no childcare, lessons from 3, Timber Creek meeting spot, no prices, no NYC lines", () => {
  const data = resortData();
  const html = resortPage("kirkwood", data, "2026-11-17");
  const page = visible(html);
  assert.match(page, /Not open yet/);
  assert.match(page, /Opens Fri, Dec 4/);
  assert.match(page, /childcare is not offered/);
  assert.match(page, /Pre-Registration Tent/);
  assert.match(page, /no lift ticket, lesson or parking prices/);
  assert.doesNotMatch(page, /\$\d/);
  assert.doesNotMatch(html.split("<main")[1].split("</main>")[0], /skiing-near-new-york-city-with-kids/);
  assert.doesNotMatch(html, /holiday-nudge|related-this-week|More New York City family guides/);
});

test("Northstar: opens Nov 20, lessons from 3, no visitor day childcare, parking prices, no ticket sum, no NYC lines", () => {
  const data = resortData();
  const html = resortPage("northstar", data, "2026-11-17");
  const page = visible(html);
  assert.match(page, /Opens Fri, Nov 20/);
  assert.match(page, /No day childcare for visitors listed/);
  assert.match(page, /Group Lesson Building/);
  assert.match(page, /\$50/);
  assert.match(page, /no lift ticket or lesson prices/);
  assert.doesNotMatch(page, /\$10,000|\$12,000/);
  assert.doesNotMatch(html.split("<main")[1].split("</main>")[0], /skiing-near-new-york-city-with-kids/);
  assert.doesNotMatch(html, /holiday-nudge|related-this-week|More New York City family guides/);
});

test("Stevens Pass: target opening Dec 4, no childcare, lessons from 3, Daisy meeting area, $20 parking, no ticket sum, no NYC lines", () => {
  const data = resortData();
  const html = resortPage("stevens-pass", data, "2026-11-18");
  const page = visible(html);
  assert.match(page, /Target opening Fri, Dec 4/);
  assert.match(page, /does not offer a daycare service/);
  assert.match(page, /Daisy chairlift side/);
  assert.match(page, /target date that can move with weather/);
  assert.match(html, /blog\.stevenspass\.com\/winter-parking-updates-oct-20-2026/);
  assert.match(page, /\$20/);
  assert.match(page, /no lift ticket or lesson prices/);
  assert.doesNotMatch(html.split("<main")[1].split("</main>")[0], /skiing-near-new-york-city-with-kids/);
  assert.doesNotMatch(html, /holiday-nudge|related-this-week|More New York City family guides/);
});

test("A target opening date gets a neutral chip on the day, never 'Opening day'", () => {
  const data = resortData();
  const html = resortPage("stevens-pass", data, "2026-12-04");
  assert.match(html, /Target opening day/);
  assert.doesNotMatch(html, />Opening day</);
});

test("Wolf Creek: pass road closure note, lessons from 5, no childcare named, family-of-4 ticket sums, no NYC lines", () => {
  const data = resortData();
  const html = resortPage("wolf-creek", data, "2026-11-18");
  const page = visible(html);
  assert.match(page, /was closing Wolf Creek Pass \(US 160\) from Mon, Nov 16/);
  assert.match(page, /Family of 4 lift tickets \(2 adults, 2 kids 6-12\): about \$286 a regular day/);
  assert.match(page, /ages 5-8/);
  assert.match(page, /None named on the Wolf Creek pages we read/);
  assert.match(page, /\$286 \(our sum of posted prices, estimate\)/);
  assert.match(page, /\$334/);
  assert.match(page, /No tax line/);
  assert.doesNotMatch(html.split("<main")[1].split("</main>")[0], /skiing-near-new-york-city-with-kids/);
  assert.doesNotMatch(html, /holiday-nudge|related-this-week|More New York City family guides/);
});

test("Wolf Creek's dated road note drops a week after the read", () => {
  const data = resortData();
  const html = resortPage("wolf-creek", data, "2026-11-25");
  assert.doesNotMatch(visible(html), /closing Wolf Creek Pass \(US 160\)/);
});

test("Deer Valley: countdown opening (neutral target), ski only, childcare from 2 months, 26/27 childcare and lesson prices, no ticket sum, no NYC lines", () => {
  const data = resortData();
  const html = resortPage("deer-valley", data, "2026-11-18");
  const page = visible(html);
  assert.match(page, /Not open yet/);
  assert.match(page, /Sat, Dec 5 \(countdown target\)/);
  assert.match(page, /ski-only resort: no snowboards/);
  assert.match(page, /2 months to 12 years/);
  assert.match(page, /\$405 regular \/ \$450 high \/ \$470 holiday/);
  assert.match(page, /no daily lift ticket price/);
  assert.doesNotMatch(page, /family of 4[^.]*\$\d/i);
  assert.doesNotMatch(html.split("<main")[1].split("</main>")[0], /skiing-near-new-york-city-with-kids/);
  assert.doesNotMatch(html, /holiday-nudge|related-this-week|More New York City family guides/);
});

test("Deer Valley's countdown day gets the neutral target chip, never 'Opening day'", () => {
  const html = resortPage("deer-valley", resortData(), "2026-12-05");
  assert.match(html, /Target opening day/);
  assert.doesNotMatch(html, />Opening day</);
});

test("far ski pages list ski conditions by region, not NYC city guides", async () => {
  const { relatedGuides } = await import("./page-generation/site-chrome.mjs");
  const west = relatedGuides("../", "ski/snowbird-conditions.html");
  assert.match(west, /<h2 id="related-guides-title">More western ski conditions<\/h2>/);
  assert.match(west, /<h2>Eastern ski conditions<\/h2>/);
  assert.doesNotMatch(west, /New York City guides|things-to-do\/new-york-city|where-to-stay\/new-york-city|family-itinerary\//);
  assert.ok(west.indexOf("alta-conditions") < west.indexOf("okemo-conditions"), "own region first");
  assert.ok(west.indexOf("alta-conditions") < west.indexOf("winter-park-conditions"), "own state first");
  assert.match(west, />Skiing near New York City with kids</);
  const pa = relatedGuides("../", "ski/seven-springs-conditions.html");
  assert.match(pa, /More eastern ski conditions<\/h2>/);
  assert.ok(pa.indexOf("okemo-conditions") < pa.indexOf("alta-conditions"));
  assert.match(relatedGuides("../", "ski/okemo-conditions.html"), /More New York City family guides/);
});

test("cam by cam: sits after the planning facts, and an all-dark read is one line, not a table of No read rows", () => {
  const data = resortData();
  const html = resortPage("hunter-mountain", data, "2026-11-15");
  assert.ok(html.indexOf('id="plan-title"') < html.indexOf('id="cams-title"'), "plan before cam by cam");
  assert.ok(html.indexOf('id="backup-title"') < html.indexOf('id="cams-title"'), "backup before cam by cam");
  const dark = { resorts: { hunter: { publish: true, status: "No read", line: "", read_at: "2026-12-19T03:10:00Z", cams_used: 0, cams_total: 4, fields: {},
    cams: [{ name: "Summit", no_read: "dark" }, { name: "Midstation", no_read: "dark" }, { name: "Base Area", no_read: "lift closed" }] } } };
  const t = visible(drawnRead("hunter-mountain", data, "2026-12-19", dark, new Date("2026-12-19T03:30:00Z")).table);
  assert.doesNotMatch(drawnRead("hunter-mountain", data, "2026-12-19", dark, new Date("2026-12-19T03:30:00Z")).table, /<table/);
  assert.match(t, /No cam gave a usable picture at our last check \(10:10pm ET\): dark\./);
  assert.doesNotMatch(t, /lift closed/, "never-list words stay out");
  assert.match(t, /Hunter Mountain&#39;s cams: Base Area, Midstation, Hunter East, Summit Cam|Hunter Mountain's cams: Base Area, Midstation, Hunter East, Summit Cam/);
  const ok = { resorts: { hunter: { ...dark.resorts.hunter, status: "Fair", cams_used: 2, cams: [] } } };
  const t2 = drawnRead("hunter-mountain", data, "2026-12-19", ok, new Date("2026-12-19T03:30:00Z")).table;
  assert.match(t2, /<table/, "a read with cams used keeps the table, even with no per-cam rows");
  assert.doesNotMatch(t2, /No cam gave a usable picture/);
});

test("Holiday Valley: opens Nov 27 (weather permitting), first-screen family-of-4 sum with RFID cards, no NYC drive time invented, prices hide after 30 days", () => {
  const data = resortData();
  const page = visible(resortPage("holiday-valley", data, "2026-11-18"));
  assert.match(page, /Not open yet\s*Opens Fri, Nov 27 \(weather permitting\)/);
  assert.match(page, /Family of 4: about \$450 a weekend or holiday day, \$382 a weekday/);
  assert.match(page, /about \$450 on a weekend or holiday, \$382 on a weekday/);
  assert.match(page, /lists no time from New York City/);
  assert.doesNotMatch(page, /before any tax/);
  assert.doesNotMatch(visible(resortPage("holiday-valley", data, "2026-12-17")), /\$\d/);
});

test("cam read times use the resort's own clock (persona P2): Vail in MT, Heavenly in PT, Okemo stays ET", async () => {
  const { resortZone } = await import("./page-generation/resort-conditions-page.mjs");
  const data = resortData();
  assert.deepEqual(resortZone(data.resorts.vail), { tz: "America/Denver", tz_label: "MT" });
  assert.deepEqual(resortZone(data.resorts.heavenly), { tz: "America/Los_Angeles", tz_label: "PT" });
  assert.deepEqual(resortZone(data.resorts["bogus-basin"]), { tz: "America/Boise", tz_label: "MT" });
  assert.deepEqual(resortZone(data.resorts.okemo), { tz: "America/New_York", tz_label: "ET" });
  const at = "2026-12-19T15:10:00Z";
  const vail = { resorts: { vail: { publish: true, status: "Fair", line: "", read_at: at, cams_used: 1, cams_total: 3, fields: {},
    cams: [{ name: "Vail summit snowgun view", read_at: at, no_read: null }] } } };
  const d = drawnRead("vail", data, "2026-12-19", vail, new Date("2026-12-19T15:37:00Z"));
  assert.match(visible(d.card), /on Sat, Dec 19 at 8:10am MT \(Vail time\)/);
  assert.match(d.table, /Last read \(MT\)/);
  assert.match(d.table, /8:10am/);
  assert.doesNotMatch(d.card + d.table, /\bET\b/);
  // A read after midnight ET but before midnight MT keeps the resort's own day.
  const late = { resorts: { vail: { ...vail.resorts.vail, read_at: "2026-12-20T05:30:00Z", cams_used: 0, status: "No read" } } };
  assert.match(visible(drawnRead("vail", data, "2026-12-20", late, new Date("2026-12-20T05:40:00Z")).table), /\(10:30pm MT\)/);
  // The page script carries the zone, so the visitor's redraw matches the build.
  assert.match(resortPage("vail", data, "2026-11-18"), /&quot;tz&quot;:&quot;America\/Denver&quot;,&quot;tz_label&quot;:&quot;MT&quot;/);
  assert.match(clientScript(), /const localTime = /);
});

test("the resort's own status line always links its live lift report", () => {
  const data = resortData();
  for (const slug of Object.keys(data.resorts)) {
    const card = resortPage(slug, data, "2026-11-18").match(/<section id="ski-answer"[\s\S]*?<\/section>/)[0];
    assert.ok(card.includes(`href="${data.resorts[slug].status_page.replaceAll("&", "&amp;")}"`), slug);
  }
  const v = resortPage("vail", data, "2026-11-18");
  assert.match(v, /check its <a href="[^"]+">terrain and lift status page<\/a>/, "the page the note names is the link");
  assert.doesNotMatch(v, /Live lifts:/, "no second link when the note already names one");
  assert.match(resortPage("okemo", data, "2026-11-18"), /Live lifts: Okemo's <a href="[^"]+snow-and-weather-report[^"]*">snow report<\/a>/);
});

test("a status page that is an hours or ski page is never called a snow report or linked under another page's name (integrity review 11-18)", () => {
  const data = resortData();
  for (const slug of ["deer-valley", "telluride", "copper-mountain"]) {
    const card = resortPage(slug, data, "2026-11-18").match(/<section id="ski-answer"[\s\S]*?<\/section>/)[0];
    assert.doesNotMatch(card, /snow report<\/a>|trail report<\/a>/, slug);
  }
  assert.match(resortPage("copper-mountain", data, "2026-11-18"), /Updates: <a href="[^"]+lift-hours\/">Copper lift hours<\/a>\./);
  assert.match(resortPage("deer-valley", data, "2026-11-18"), /<a href="[^"]+hours-of-operation">Deer Valley hours of operation<\/a>/);
});

test("NYC-set pages keep western conditions pages out of the NYC guide list (persona P3 11-16/17)", async () => {
  const { readFile } = await import("node:fs/promises");
  for (const page of ["site/ski/okemo-conditions.html", "site/where-to-stay/new-york-city-family-hotels.html"]) {
    const html = await readFile(new URL(`../${page}`, import.meta.url), "utf8");
    const nav = html.match(/<nav class="related-guides"[\s\S]*?<\/nav>/)[0];
    const [cityList, eastList = ""] = nav.split("<h2>Eastern ski conditions</h2>");
    assert.match(cityList, /More New York City family guides/);
    assert.match(cityList, /Skiing near New York City with kids/);
    assert.doesNotMatch(cityList, /-conditions\.html/);
    assert.match(eastList, /holiday-valley-conditions\.html/);
    assert.doesNotMatch(nav, /(vail|alta|timberline|heavenly)-conditions\.html/);
  }
});
