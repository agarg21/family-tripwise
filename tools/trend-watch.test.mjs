import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import {
  parseFeed, parseGdelt, parseDate, normalizeLink, linkHash, analyzeItem, runWatch, validateSources, gdeltSources,
  fitState, fitFlags, serializeState, serializeFlags, upsertTrendFlag, extractEntities, CONFIG, MAX_FILE_BYTES, MAX_TITLE_CHARS, USER_AGENT,
} from "./trend-watch.mjs";

const root = new URL("..", import.meta.url);
const readJson = (p) => JSON.parse(readFileSync(new URL(p, root), "utf8"));

// Fixtures only; tests never touch the network.
const NOW = Date.parse("2026-11-20T15:00:00Z");
const ago = (h) => new Date(NOW - h * 3600_000).toUTCString();
const rss = (items) => `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel>
<title>Fixture News</title><atom:link href="https://news.example/feed/" rel="self"/><link>https://news.example</link>
${items.map((i) => `<item><title>${i.cdata ? `<![CDATA[${i.title}]]>` : i.title}</title>${i.link ? `<link>${i.link}</link>` : ""}${i.guid ? `<guid isPermaLink="true">${i.guid}</guid>` : ""}<pubDate>${i.date}</pubDate><description><![CDATA[<p>${i.desc || ""}</p>]]></description><content:encoded><![CDATA[<p>Long body that is never stored.</p>]]></content:encoded></item>`).join("\n")}
</channel></rss>`;
const atom = (entries) => `<?xml version="1.0" encoding="utf-8"?><feed xmlns="http://www.w3.org/2005/Atom"><title>Fixture Times</title>
${entries.map((e) => `<entry><title type="html">${e.title}</title><link rel="alternate" type="text/html" href="${e.link}"/><link rel="enclosure" href="https://img.example/x.jpg"/><id>${e.link}</id><published>${e.date}</published><summary>${e.desc || ""}</summary></entry>`).join("\n")}
</feed>`;

function fakeWeb(routes) {
  const calls = [];
  const fetchImpl = async (url, opts = {}) => {
    calls.push({ url, ua: opts.headers?.["user-agent"], accept: opts.headers?.accept });
    const r = typeof routes[url] === "function" ? routes[url]() : routes[url];
    if (r instanceof Error) throw r;
    const { status = 200, body = "", headers = {} } = r ?? { status: 404 };
    return { status, headers: { get: (k) => headers[k.toLowerCase()] ?? null }, text: async () => { if (r?.bodyError) throw r.bodyError; return body; }, body: null };
  };
  return { fetchImpl, calls };
}
const clock = () => { let t = NOW; return { now: () => t, sleep: async (ms) => { t += ms; }, advance: (ms) => { t += ms; } }; };
const feed = (over = {}) => ({ id: "nyc-fixture", city: "New York City", outlet: "Fixture News", kind: "local-tv", url: "https://news.example/feed/", checked_on: "2026-11-03", ...over });
const SRC = (feeds, gdelt) => ({ feeds, ...(gdelt ? { gdelt } : {}) });
const FAMILY_ITEM = { title: "New holiday light show opens at Bryant Park for kids this weekend, tickets $15", link: "https://news.example/2026/11/light-show?utm_source=rss", date: ago(2), desc: "A family-friendly display returns Nov. 21 in NYC." };

test("parses RSS 2.0: CDATA, entities, guid fallback, dates; never keeps bodies", () => {
  const xml = rss([
    { title: "Kids &amp; parents: Santa&#8217;s new NYC parade", cdata: true, link: "https://news.example/a", date: "Tue, 17 Nov 2026 10:12:00 -0500", desc: "Free &amp; open" },
    { title: "Guid only item", guid: "https://news.example/b", date: "Wed, 18 Nov 2026 01:00:00 GMT" },
    { title: "No link at all", date: ago(1) },
  ]);
  const f = parseFeed(xml);
  assert.equal(f.kind, "rss");
  assert.equal(f.items.length, 2, "items without an http link are dropped");
  assert.equal(f.items[0].title, "Kids & parents: Santa's new NYC parade".replace("'", "’").replace("’", "'"));
  assert.equal(f.items[0].link, "https://news.example/a");
  assert.equal(f.items[0].published, Date.parse("2026-11-17T15:12:00Z"));
  assert.equal(f.items[0].summary, "Free & open");
  assert.equal(f.items[1].link, "https://news.example/b");
  assert.ok(!JSON.stringify(f).includes("Long body"), "content:encoded is not read");
  assert.equal(parseDate("11/03/2026") != null, true, "US short dates parse");
});

test("parses Atom (alternate link, published) and RSS 1.0; rejects HTML", () => {
  const f = parseFeed(atom([{ title: "Lightscape returns to Chicago", link: "https://times.example/lightscape", date: "2026-11-19T09:06:19.895-06:00", desc: "Family &lt;b&gt;tickets&lt;/b&gt;" }]));
  assert.equal(f.kind, "atom");
  assert.deepEqual([f.items[0].title, f.items[0].link, f.items[0].published], ["Lightscape returns to Chicago", "https://times.example/lightscape", Date.parse("2026-11-19T15:06:19.895Z")]);
  assert.equal(f.items[0].summary, "Family tickets");
  const rdf = parseFeed(`<?xml version="1.0"?><rdf:RDF xmlns:rdf="x"><item rdf:about="https://rdf.example/x"><title>RDF item</title><dc:date>2026-11-19T10:00:00Z</dc:date></item></rdf:RDF>`);
  assert.equal(rdf.kind, "rdf");
  assert.equal(rdf.items[0].link, "https://rdf.example/x");
  assert.equal(parseFeed("<!doctype html><html><title>Not a feed</title></html>").kind, null);
});

test("parses GDELT ArtList JSON and reports non-JSON throttle text", () => {
  const g = parseGdelt(JSON.stringify({ articles: [{ url: "https://patch.example/nyc-lights", title: "NYC holiday lights for families", seendate: "20261120T143000Z", domain: "patch.example", language: "English", sourcecountry: "United States" }, { title: "no url" }] }));
  assert.equal(g.ok, true);
  assert.equal(g.items.length, 1);
  assert.equal(g.items[0].published, Date.parse("2026-11-20T14:30:00Z"));
  assert.equal(g.items[0].outlet, "patch.example");
  const bad = parseGdelt("Please limit requests to one every 5 seconds or contact us.");
  assert.equal(bad.ok, false);
  assert.match(bad.reason, /non-JSON/);
  assert.equal(parseGdelt("{}").items.length, 0);
});

test("normalized links drop tracking, www, fragments and trailing slashes", () => {
  assert.equal(normalizeLink("https://www.News.example/a/b/?utm_source=x&id=2&fbclid=y#top"), "news.example/a/b?id=2");
  assert.equal(linkHash("https://news.example/a/"), linkHash("https://www.news.example/a?utm_medium=rss"));
});

test("scoring: fit, novelty, actionable signals and named places", () => {
  const a = analyzeItem({ title: FAMILY_ITEM.title, summary: FAMILY_ITEM.desc, published: NOW - 2 * 3600_000 }, feed(), { now: NOW });
  assert.equal(a.relevant, true);
  assert.equal(a.city, "New York City");
  assert.ok(a.sig.fit.some((s) => s.startsWith("family:")) && a.sig.fit.some((s) => s.startsWith("topic:")));
  assert.ok(a.sig.novelty.includes("new") && a.sig.novelty.includes("published<24h"));
  assert.ok(a.sig.actionable.some((s) => s.startsWith("date:")) && a.sig.actionable.some((s) => s.startsWith("price:")) && a.sig.actionable.includes("place:bryant park"));
  const W = CONFIG.weights;
  assert.equal(a.score, W.city_mention + W.family + W.topic + W.novelty + W.fresh + 3 * W.actionable);
  assert.ok(a.score >= CONFIG.threshold);
  assert.deepEqual(extractEntities("Enchant D.C. comes to Nationals Park and the Holiday Market"), ["enchant", "nationals park"], "generic-only names are ignored");
});

test("scoring gates: city, family-or-topic fit, age, other cities, Disney marking", () => {
  const an = (title, src = feed(), over = {}) => analyzeItem({ title, summary: "", published: NOW - 3600_000, ...over }, src, { now: NOW });
  assert.equal(an("Council budget hearing scheduled").relevant, false, "no family or topic fit");
  assert.equal(an("Holiday market opens", feed({ require_city_mention: true })).relevant, false, "multi-city source needs a city in the text");
  assert.equal(an("Holiday market opens in Chicago", feed({ require_city_mention: true })).city, "Chicago");
  assert.equal(an("Holiday market opens", feed(), { published: NOW - 80 * 3600_000 }).relevant, false, "older than 72 h");
  assert.equal(an("Holiday market opens", feed()).sig.fit[0], "city:New York City (local outlet)");
  const d = an("Epcot holiday festival returns for families", feed({ city: "Orlando" }));
  assert.equal(d.disney, true);
});

test("each blocker drops an item; crime words in a summary alone do not", () => {
  const an = (title, summary = "", src = feed()) => analyzeItem({ title, summary, published: NOW - 3600_000 }, src, { now: NOW });
  const cases = {
    private_home: ["Homeowner's giant Christmas lights display draws families in Queens", ""],
    crime_tragedy: ["Man killed near holiday market in Brooklyn", ""],
    politics: ["Voters weigh holiday parade funding for kids", ""],
    child_subject: ["8-year-old raises money for holiday toys", ""],
    adult_only: ["Holiday bar crawl returns to Manhattan", ""],
    paywall: ["New holiday lights for kids in NYC (subscriber-only)", ""],
    past_recap: ["Photos: Macy's Thanksgiving Parade recap for families in NYC", ""],
  };
  for (const [name, [title, summary]] of Object.entries(cases)) {
    const r = an(title, summary);
    assert.equal(r.relevant, false, `${name} should block: ${title}`);
    assert.equal(r.blocker, name);
  }
  assert.equal(an("New holiday lights for kids in NYC", "", feed({ paywall: true })).blocker, "paywall", "paywalled sources never flag");
  assert.equal(an("Neighbors complain", "").relevant, false);
  assert.equal(an("Thanksgiving parade returns for families in NYC", "Police will close streets along the route.").relevant, true);
  assert.equal(an("Governors Island holiday festival for kids").relevant, true, "Governors Island is not politics");
  assert.equal(an("Day of the Dead festival for families in NYC").relevant, true);
  assert.equal(an("SantaCon returns to Manhattan this weekend").blocker, "adult_only");
  const dc = analyzeItem({ title: "AC/DC tribute night for families in Chicago", summary: "", published: NOW - 3600_000 }, feed({ city: "Chicago" }), { now: NOW });
  assert.equal(dc.city, "Chicago", "a bare 'dc' is not Washington DC");
});

test("first read is a baseline; new items flag next run; robots.txt uses our own UA group", async () => {
  const c = clock();
  const web = fakeWeb({
    "https://news.example/robots.txt": { status: 200, body: "User-agent: *\nAllow: /\n\nUser-agent: FamilyTripwiseDealWatch\nDisallow: /" },
    "https://news.example/feed/": () => ({ body: rss(items) }),
  });
  let items = [{ title: "Old holiday parade news for families in NYC", link: "https://news.example/old", date: ago(5) }];
  const r1 = await runWatch({ sources: SRC([feed()]), state: {}, flags: {}, fetchImpl: web.fetchImpl, ...c });
  assert.equal(r1.state.sources["nyc-fixture"].status, "ok", "the deal-watch group does not apply to the trend watch");
  assert.equal(r1.newFlags, 0, "baseline run never flags");
  assert.ok(web.calls.every((x) => x.ua === USER_AGENT));
  assert.match(web.calls.find((x) => x.url.endsWith("/feed/")).accept, /rss\+xml/);
  items = [...items, FAMILY_ITEM];
  const r2 = await runWatch({ sources: SRC([feed()]), state: r1.state, flags: r1.flags, fetchImpl: web.fetchImpl, ...c });
  assert.equal(r2.newFlags, 1);
  const f = r2.flags.flags[0];
  assert.equal(f.city, "New York City");
  assert.ok(f.title.length <= MAX_TITLE_CHARS);
  assert.deepEqual(Object.keys(f.signals), ["fit", "novelty", "momentum", "actionable"]);
  assert.equal(f.priority, "normal");
  assert.equal(f.links[0].outlet, "Fixture News");
  assert.ok(f.first_seen && f.score >= CONFIG.threshold);
  const r3 = await runWatch({ sources: SRC([feed()]), state: r2.state, flags: r2.flags, fetchImpl: web.fetchImpl, ...c });
  assert.equal(r3.newFlags, 0, "seen items are not flagged again");
  assert.equal(r3.flags.flags.length, 1);
});

test("dedupe: the same link in two feeds and the same title twice count once", async () => {
  const c = clock();
  const same = { ...FAMILY_ITEM };
  const web = fakeWeb({
    "https://news.example/robots.txt": { status: 404 },
    "https://news.example/feed/": { body: rss([same, { ...same, link: "https://www.news.example/2026/11/light-show/" }]) },
    "https://news.example/things-to-do/feed/": { body: rss([same]) },
  });
  const feeds = [feed(), feed({ id: "nyc-fixture-ttd", url: "https://news.example/things-to-do/feed/" })];
  const state = { sources: { "nyc-fixture": { ok_since: "x" }, "nyc-fixture-ttd": { ok_since: "x" } } };
  for (const id of Object.keys(state.sources)) Object.assign(state.sources[id], { source_sig: (await import("./deal-watch.mjs")).sourceSig(feeds.find((f) => f.id === id)), status: "ok" });
  const r = await runWatch({ sources: SRC(feeds), state, flags: {}, fetchImpl: web.fetchImpl, ...c });
  assert.equal(r.newFlags, 1);
  assert.equal(r.flags.flags[0].links.length, 1);
  assert.equal(r.state.recent.length, 1);
});

const okState = async (feeds) => {
  const { sourceSig } = await import("./deal-watch.mjs");
  return { sources: Object.fromEntries(feeds.map((f) => [f.id, { url: f.url, source_sig: sourceSig(f), status: "ok", ok_since: "2026-11-19T00:00Z" }])) };
};

test("momentum: the same story in two outlets merges into one flag; buzz makes it high priority", async () => {
  const c = clock();
  const feeds = [feed(), feed({ id: "nyc-other", outlet: "Other Paper", url: "https://paper.example/rss" })];
  const web = fakeWeb({
    "https://news.example/robots.txt": { status: 404 },
    "https://paper.example/robots.txt": { status: 404 },
    "https://news.example/feed/": { body: rss([FAMILY_ITEM]) },
    "https://paper.example/rss": () => ({ body: rss(paper) }),
  });
  let paper = [];
  const r1 = await runWatch({ sources: SRC(feeds), state: await okState(feeds), flags: {}, fetchImpl: web.fetchImpl, ...c });
  assert.equal(r1.newFlags, 1);
  assert.deepEqual(r1.flags.flags[0].signals.momentum, []);
  c.advance(30 * 60_000);
  paper = [{ title: "Bryant Park light show draws long lines on TikTok as families flock", link: "https://paper.example/bryant-lights", date: ago(0.2) }];
  const r2 = await runWatch({ sources: SRC(feeds), state: r1.state, flags: r1.flags, fetchImpl: web.fetchImpl, ...c });
  assert.equal(r2.newFlags, 0, "a second outlet updates the flag instead of adding one");
  const f = r2.flags.flags[0];
  assert.equal(f.links.length, 2);
  assert.deepEqual(f.links.map((l) => l.outlet).sort(), ["Fixture News", "Other Paper"]);
  assert.ok(f.signals.momentum.includes("outlets:2"));
  assert.ok(f.signals.momentum.some((s) => s.startsWith("buzz:")));
  assert.equal(f.priority, "high");
  assert.equal(r2.raised.flags.length, 1, "the updated flag is re-applied after a merge conflict");
});

test("a handled (deleted) flag returns only when its story escalates to high priority", async () => {
  const c = clock();
  const feeds = [feed(), feed({ id: "nyc-b", outlet: "B", url: "https://b.example/rss" }), feed({ id: "nyc-c", outlet: "C", url: "https://c.example/rss" })];
  let b = [], cc = [];
  const web = fakeWeb({
    "https://news.example/robots.txt": { status: 404 }, "https://b.example/robots.txt": { status: 404 }, "https://c.example/robots.txt": { status: 404 },
    "https://news.example/feed/": { body: rss([FAMILY_ITEM]) },
    "https://b.example/rss": () => ({ body: rss(b) }),
    "https://c.example/rss": () => ({ body: rss(cc) }),
  });
  const r1 = await runWatch({ sources: SRC(feeds), state: await okState(feeds), flags: {}, fetchImpl: web.fetchImpl, ...c });
  assert.equal(r1.newFlags, 1);
  b = [{ title: "Bryant Park light show opens for kids", link: "https://b.example/1", date: ago(0.1) }];
  const r2 = await runWatch({ sources: SRC(feeds), state: r1.state, flags: { flags: [] } /* operator handled it */, fetchImpl: web.fetchImpl, ...c });
  assert.equal(r2.flags.flags.length, 0, "a second outlet alone does not re-raise a handled story");
  cc = [{ title: "Bryant Park light show is sold out as lines wrap the block", link: "https://c.example/1", date: ago(0.05) }];
  const r3 = await runWatch({ sources: SRC(feeds), state: r2.state, flags: r2.flags, fetchImpl: web.fetchImpl, ...c });
  assert.equal(r3.flags.flags.length, 1);
  assert.equal(r3.flags.flags[0].priority, "high");
});

test("robots disallow and denials are recorded once and never retried unchanged; retry bump refetches", async () => {
  const c = clock();
  const feeds = [
    feed({ id: "nyc-robots", url: "https://closed.example/feed/" }),
    feed({ id: "nyc-denied", url: "https://denied.example/feed/" }),
    feed({ id: "nyc-crawl", url: "https://slow.example/feed/" }),
  ];
  const web = fakeWeb({
    "https://closed.example/robots.txt": { status: 200, body: "User-agent: FamilyTripwiseTrendWatch\nDisallow: /feed/" },
    "https://denied.example/robots.txt": { status: 404 },
    "https://denied.example/feed/": { status: 403, body: "Forbidden" },
    "https://slow.example/robots.txt": { status: 200, body: "User-agent: *\nCrawl-delay: 120" },
  });
  const r1 = await runWatch({ sources: SRC(feeds), state: {}, flags: {}, fetchImpl: web.fetchImpl, ...c });
  assert.equal(r1.state.sources["nyc-robots"].status, "robots");
  assert.equal(r1.state.sources["nyc-denied"].status, "denied");
  assert.equal(r1.state.sources["nyc-crawl"].status, "robots", "Crawl-delay over 60 s counts as blocked");
  assert.equal(r1.flags.source_alerts.length, 3);
  assert.ok(r1.flags.source_alerts.every((a) => a.kind === "blocked"));
  assert.ok(!web.calls.some((x) => x.url === "https://closed.example/feed/"), "disallowed feed is never fetched");
  const before = web.calls.length;
  const r2 = await runWatch({ sources: SRC(feeds), state: r1.state, flags: r1.flags, fetchImpl: web.fetchImpl, ...c });
  assert.equal(web.calls.length, before, "no request at all for unchanged denials");
  assert.equal(r2.raised.alerts.length, 0);
  feeds[1].retry = 1;
  await runWatch({ sources: SRC(feeds), state: r2.state, flags: r2.flags, fetchImpl: web.fetchImpl, ...c });
  assert.ok(web.calls.slice(before).some((x) => x.url === "https://denied.example/feed/"), "a retry bump fetches again");
});

test("a block page or non-feed body is not parsed; three errors park the source", async () => {
  const c = clock();
  const web = fakeWeb({
    "https://news.example/robots.txt": { status: 404 },
    "https://news.example/feed/": { status: 200, body: "<html><title>Attention Required! | Cloudflare</title><body>captcha</body></html>" },
    "https://flaky.example/robots.txt": { status: 404 },
    "https://flaky.example/feed/": { status: 503, body: "busy" },
  });
  const feeds = [feed(), feed({ id: "nyc-flaky", url: "https://flaky.example/feed/" })];
  let st = {}, fl = {};
  for (let i = 0; i < 4; i++) { const r = await runWatch({ sources: SRC(feeds), state: st, flags: fl, fetchImpl: web.fetchImpl, ...c }); st = r.state; fl = r.flags; }
  assert.equal(st.sources["nyc-fixture"].status, "denied");
  assert.equal(st.sources["nyc-flaky"].status, "error");
  assert.equal(st.sources["nyc-flaky"].errors, 3);
  assert.equal(web.calls.filter((x) => x.url === "https://flaky.example/feed/").length, 3, "parked after 3 errors");
  assert.ok(fl.source_alerts.some((a) => a.source_id === "nyc-flaky" && a.kind === "unreachable"));
});

test("block pages served with HTTP 200 (Incapsula, PerimeterX, 'pardon our interruption') are denials, never retried (review P2)", async () => {
  for (const body of ["<html><body>Request unsuccessful. Incapsula incident ID: 123</body></html>", "<html><title>Pardon Our Interruption</title></html>", '<div id="px-captcha"></div>']) {
    const c = clock();
    const web = fakeWeb({ "https://news.example/robots.txt": { status: 404 }, "https://news.example/feed/": { status: 200, body } });
    const r1 = await runWatch({ sources: SRC([feed()]), state: {}, flags: {}, fetchImpl: web.fetchImpl, ...c });
    assert.equal(r1.state.sources["nyc-fixture"].status, "denied", body);
    const before = web.calls.length;
    await runWatch({ sources: SRC([feed()]), state: r1.state, flags: r1.flags, fetchImpl: web.fetchImpl, ...c });
    assert.equal(web.calls.length, before, "an unchanged denial is never retried");
  }
});

test("GDELT: one spaced query per city; its articles feed the gdelt momentum signal", async () => {
  const c = clock();
  const gdelt = { enabled: true, endpoint: "https://api.gdelt.example/api/v2/doc/doc", timespan: "24h", maxrecords: 75, min_interval_s: 10, queries: { "New York City": '"New York City" (holiday OR lights) (kids OR family)', Chicago: '"Chicago" (holiday) (kids)' } };
  const src = SRC([feed()], gdelt);
  const [nyc, chi] = gdeltSources(src);
  assert.match(nyc.url, /mode=ArtList&format=json&timespan=24h&maxrecords=75&sort=DateDesc/);
  const times = [];
  const arts = (n) => JSON.stringify({ articles: Array.from({ length: n }, (_, i) => ({ url: `https://outlet${i}.example/story`, title: `Bryant Park light show for kids opens in New York City ${i}`, seendate: "20261120T140000Z", domain: `outlet${i}.example` })) });
  const web = fakeWeb({
    "https://news.example/robots.txt": { status: 404 },
    "https://news.example/feed/": { body: rss([FAMILY_ITEM]) },
    "https://api.gdelt.example/robots.txt": { status: 404 },
    [nyc.url]: () => { times.push(c.now()); return { body: arts(2) }; },
    [chi.url]: () => { times.push(c.now()); return { body: "Please limit requests to one every 5 seconds" }; },
  });
  const r = await runWatch({ sources: src, state: await okState([feed(), nyc, chi]), flags: {}, fetchImpl: web.fetchImpl, ...c });
  assert.ok(times[1] - times[0] >= 10_000, "GDELT requests are at least min_interval_s apart");
  assert.equal(r.state.sources["gdelt-chicago"].status, "error", "throttle text is an error, not a denial");
  const f = r.flags.flags.find((x) => x.links.some((l) => l.url === FAMILY_ITEM.link));
  assert.ok(f.signals.momentum.includes("gdelt:2"));
  assert.ok(!f.signals.momentum.some((m) => m.startsWith("outlets:")), "GDELT domains count once, under gdelt, not again as outlets (review P3)");
  assert.notEqual(f.priority, "high", "two GDELT hits alone (possibly wire copy) do not make a flag high priority");
  const off = SRC([feed()], { ...gdelt, enabled: false });
  assert.equal(gdeltSources(off).length, 0, "GDELT can be switched off");
});

test("size caps: state and flags are pruned under 40 KB, oldest first", () => {
  const state = { note: "n", sources: {}, seen: {}, recent: [] };
  for (let i = 0; i < 2000; i++) state.seen[`l${String(i).padStart(12, "0")}`] = `2026-11-${String(10 + (i % 15)).padStart(2, "0")}T00Z`;
  for (let i = 0; i < 300; i++) state.recent.push({ k: String(i), c: "Chicago", o: "x.example", n: "X", u: `https://x.example/${"a".repeat(100)}/${i}`, h: "t".repeat(120), t: new Date(NOW - i * 60_000).toISOString(), s: 7 });
  const s = fitState(state);
  assert.ok(Buffer.byteLength(serializeState(s)) <= MAX_FILE_BYTES);
  assert.ok(s.recent.length > 0 && s.recent[0].k === "0", "newest recent items are kept");
  assert.ok(Object.values(s.seen).every((e) => e >= "2026-11-1"), "oldest seen keys go first");
  assert.ok(Object.keys(s.seen).length > 0);
  const flags = { note: "n", flags: [], source_alerts: [] };
  for (let i = 0; i < 200; i++) flags.flags.push({ id: `t-${i}`, city: "Chicago", title: "x".repeat(160), links: [{ outlet: "X", url: `https://x.example/${i}`, published: null }], first_seen: new Date(NOW - (200 - i) * 60_000).toISOString(), signals: { fit: [], novelty: [], momentum: [], actionable: [] }, matched_terms: [], score: 8, priority: i === 0 ? "high" : "normal" });
  const f = fitFlags(flags);
  assert.ok(Buffer.byteLength(serializeFlags(f)) <= MAX_FILE_BYTES);
  assert.ok(f.flags.some((x) => x.id === "t-0"), "high-priority flags outlive older normal ones");
  assert.ok(!f.flags.some((x) => x.id === "t-1"), "the oldest normal flags go first");
});

test("upsert merges links and signals without duplicates", () => {
  const list = [{ id: "t-1", links: [{ url: "a" }], signals: { fit: ["x"], novelty: [], momentum: [], actionable: [] }, matched_terms: ["lights"], score: 7, priority: "normal", first_seen: "z" }];
  upsertTrendFlag(list, { id: "t-1", links: [{ url: "a" }, { url: "b" }], signals: { fit: ["x", "y"], novelty: [], momentum: ["outlets:2", "buzz:viral"], actionable: [] }, matched_terms: ["lights", "viral"], score: 11, priority: "high", first_seen: "z", updated_at: "u" });
  assert.equal(list.length, 1);
  assert.deepEqual(list[0].links.map((l) => l.url), ["a", "b"]);
  assert.deepEqual(list[0].signals.fit, ["x", "y"]);
  assert.equal(list[0].priority, "high");
  assert.equal(list[0].score, 11);
});

test("checked-in sources.json is valid: 3+ news feeds per city, no venue pages, GDELT polite", () => {
  const doc = readJson("ops/trend-watch/sources.json");
  assert.deepEqual(validateSources(doc), []);
  for (const city of Object.keys(CONFIG.cities)) assert.ok(doc.feeds.filter((f) => f.city === city).length >= 3, `${city} needs at least 3 feeds`);
  assert.ok(doc.feeds.every((f) => !/official|venue|operator/i.test(f.kind)));
  assert.ok(doc.gdelt.min_interval_s >= 5);
  assert.equal(Object.keys(doc.gdelt.queries).length <= Object.keys(CONFIG.cities).length, true, "at most one GDELT query per city");
  for (const name of ["state.json", "flags.json"]) {
    const p = new URL(`ops/trend-watch/${name}`, root);
    if (existsSync(p)) assert.ok(readFileSync(p).length <= MAX_FILE_BYTES, `${name} over 40 KB`);
  }
});

test("workflow: every 30 minutes at quiet minutes, gap guard, no secrets, never force-pushes", () => {
  const wf = readFileSync(new URL(".github/workflows/trend-watch.yml", root), "utf8");
  assert.match(wf, /cron: "11,41 \* \* \* \*"/);
  assert.match(wf, /workflow_dispatch/);
  assert.match(wf, /push:\s*\n\s*branches: \[main\]\s*\n\s*paths: \["ops\/STATE\.md"\]/, "backup trigger: the operator's STATE pushes");
  assert.match(wf, /watch:\n\s*if: "github\.event_name != 'push' \|\| startsWith\(github\.event\.head_commit\.message, 'ops: claim run'\)"/, "only the hourly claim commit runs it (quoted: valid YAML)");
  assert.match(wf, /-lt 1500/);
  assert.match(wf, /"Watch feeds and GDELT" and \.conclusion == "success"/, "only runs that actually watched reset the gap clock (review P1)");
  assert.ok(!/\$\{\{\s*secrets\./.test(wf), "no secrets");
  const code = wf.split("\n").filter((l) => !/^\s*#/.test(l)).join("\n").replace(/--no-rebase/g, "");
  assert.ok(!/--force|push -f|\brebase\b|reset --hard/.test(code), "never force-push, rebase or reset");
});

test("a timeout while the body downloads is an error that parks the source, never a crash (review P2)", async () => {
  const c = clock();
  const err = Object.assign(new Error("The operation was aborted due to timeout"), { name: "TimeoutError" });
  const web = fakeWeb({ "https://news.example/robots.txt": { status: 404 }, "https://news.example/feed/": { status: 200, bodyError: err } });
  let st = {}, fl = {};
  for (let i = 0; i < 4; i++) { const r = await runWatch({ sources: SRC([feed()]), state: st, flags: fl, fetchImpl: web.fetchImpl, ...c }); st = r.state; fl = r.flags; }
  assert.equal(st.sources["nyc-fixture"].status, "error");
  assert.equal(st.sources["nyc-fixture"].errors, 3);
  assert.equal(web.calls.filter((x) => x.url === "https://news.example/feed/").length, 3, "parked after 3 body timeouts");
});

test("GDELT per_run rotates one city per 30-minute run and leaves the others' state untouched", async () => {
  const c = clock();
  const gdelt = { enabled: true, per_run: 1, endpoint: "https://api.gdelt.example/api/v2/doc/doc", timespan: "24h", maxrecords: 75, min_interval_s: 10, queries: { "New York City": '"New York City" (holiday)', Chicago: '"Chicago" (holiday)', "San Diego": '"San Diego" (holiday)' } };
  const src = SRC([feed()], gdelt);
  const g = gdeltSources(src);
  const routes = { "https://news.example/robots.txt": { status: 404 }, "https://news.example/feed/": { body: rss([]) }, "https://api.gdelt.example/robots.txt": { status: 404 } };
  for (const s of g) routes[s.url] = { body: JSON.stringify({ articles: [] }) };
  const web = fakeWeb(routes);
  const prevState = { sources: { [g[2].id]: { status: "error", errors: 1, source_sig: "kept" } } };
  const r = await runWatch({ sources: src, state: prevState, flags: {}, fetchImpl: web.fetchImpl, ...c });
  const gCalls = web.calls.filter((x) => x.url.includes("api/v2/doc"));
  assert.equal(gCalls.length, 1, "one GDELT query per run");
  const queried = g.find((s) => s.url === gCalls[0].url).id;
  for (const s of g) if (s.id !== queried && prevState.sources[s.id]) assert.deepEqual(r.state.sources[s.id], prevState.sources[s.id], "skipped cities keep their state");
  c.advance(30 * 60_000);
  const web2 = fakeWeb(routes);
  await runWatch({ sources: src, state: r.state, flags: r.flags, fetchImpl: web2.fetchImpl, ...c });
  const next = web2.calls.filter((x) => x.url.includes("api/v2/doc"));
  assert.equal(next.length, 1);
  assert.notEqual(next[0].url, gCalls[0].url, "the next slot queries the next city");
});
