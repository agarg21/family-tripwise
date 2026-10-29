import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  robotsVerdict, extractSignal, diffSignal, denialReason, runWatch, validateSources, sourceSig, lineHash,
  storedSignal, MAX_STORED_SIGNAL_CHARS, MAX_ERRORS, USER_AGENT,
} from "./deal-watch.mjs";

const root = new URL("..", import.meta.url);
const readJson = (p) => JSON.parse(readFileSync(new URL(p, root), "utf8"));

// Fixture pages only; tests never touch the network.
const page = (h1, lines = []) => `<!doctype html><html><head><title>${h1} | Fixture Resorts</title>
<meta name="description" content="Family offers"><script>var x = "50% off in a script";</script></head>
<body><nav>Menu</nav><h1>${h1}</h1>${lines.map((l) => `<p>${l}</p>`).join("")}<footer>© 2026 Fixture. All rights reserved.</footer></body></html>`;

function fakeWeb(routes) {
  const calls = [];
  const fetchImpl = async (url, opts = {}) => {
    calls.push({ url, ua: opts.headers?.["user-agent"] });
    const r = routes[url];
    if (r instanceof Error) throw r;
    const { status = 200, body = "", headers = {} } = r ?? { status: 404 };
    return { status, headers: { get: (k) => headers[k.toLowerCase()] ?? null }, text: async () => body, body: null };
  };
  return { fetchImpl, calls };
}
const SRC = (over = {}) => ({ sources: [{ id: "fixture-deals", operator: "Fixture", kind: "offer-index", url: "https://deals.example/offers", ...over }] });
const clock = () => { let t = Date.parse("2026-10-29T13:00:00Z"); return { now: () => t, sleep: async (ms) => { t += ms; } }; };

test("robots.txt: specific group, longest match, Allow tie, wildcards, Crawl-delay", () => {
  const txt = "User-agent: *\nDisallow: /private\nCrawl-delay: 5\n\nUser-agent: OtherBot\nDisallow: /";
  assert.equal(robotsVerdict(txt, "https://x.example/private/deal").allowed, false);
  assert.equal(robotsVerdict(txt, "https://x.example/deals").allowed, true);
  assert.equal(robotsVerdict(txt, "https://x.example/deals").crawlDelay, 5);
  const named = "User-agent: *\nAllow: /\n\nUser-agent: FamilyTripwiseDealWatch\nDisallow: /deals";
  assert.equal(robotsVerdict(named, "https://x.example/deals/a").allowed, false, "our own group wins over *");
  const wild = "User-agent: *\nDisallow: /*?country=\nAllow: /offers$\nDisallow: /offers";
  assert.equal(robotsVerdict(wild, "https://x.example/terms?country=USA").allowed, false);
  assert.equal(robotsVerdict(wild, "https://x.example/offers").allowed, true);
  assert.equal(robotsVerdict(wild, "https://x.example/offers/kids").allowed, false);
  assert.equal(robotsVerdict("User-agent: *\nDisallow:", "https://x.example/a").allowed, true, "empty Disallow allows");
  assert.equal(robotsVerdict("", "https://x.example/a").allowed, true);
});

test("signal keeps offer lines from the page, not scripts or boilerplate", () => {
  const s = extractSignal(page("Fall Flash Sale", ["Save up to 40% on suites", "Kids stay free through Feb 14", "Our lodges are fun", "Book by November 1, 2026"]));
  assert.equal(s.headline, "Fall Flash Sale");
  assert.deepEqual(s.signal, ["Save up to 40% on suites", "Kids stay free through Feb 14", "Book by November 1, 2026"]);
  assert.ok(!s.signal.some((l) => /script|rights reserved|Menu/.test(l)));
  assert.equal(extractSignal(page("Fall Flash Sale", ["Save up to 40% on suites"])).hash, extractSignal(page("Fall Flash Sale", ["Save up to 40% on suites"])).hash);
  assert.notEqual(s.hash, extractSignal(page("Fall Flash Sale", ["Save up to 45% on suites"])).hash);
  assert.equal(extractSignal(page("A &amp; B", ["Kids eat free &ndash; ages 5&#8211;11"])).signal[0], "Kids eat free – ages 5–11");
});

test("diff reports exact added lines and counts removals beyond the stored excerpt", () => {
  const before = { signal: ["Save 40%", "Kids free"], line_hashes: ["Save 40%", "Kids free", "Book by Nov 1"].map(lineHash) };
  const d = diffSignal(before, ["Save 50%", "Kids free"]);
  assert.deepEqual(d.added, ["Save 50%"]);
  assert.deepEqual(d.removed, ["Save 40%"]);
  assert.equal(d.removed_count, 2);
  const long = Array.from({ length: 60 }, (_, i) => `Offer ${i} `.padEnd(200, "x"));
  assert.ok(storedSignal(long).join("").length <= MAX_STORED_SIGNAL_CHARS);
});

test("denials: HTTP 403/429 and bot pages are blocks; a normal page is not", () => {
  assert.equal(denialReason(403, ""), "HTTP 403");
  assert.equal(denialReason(429, ""), "HTTP 429");
  assert.equal(denialReason(200, "<html><title>Access Denied</title></html>"), "bot or block page");
  assert.equal(denialReason(200, "<html><body>Please complete the captcha</body></html>"), "bot or block page");
  assert.equal(denialReason(200, page("Deals", ["Save 20%"])), null);
});

test("first run records a baseline without flags; a change raises one flag; unchanged makes no flag", async () => {
  const c = clock();
  const web = { "https://deals.example/robots.txt": { body: "User-agent: *\nAllow: /" }, "https://deals.example/offers": { body: page("Deals", ["Save 20% on stays"]) } };
  const w1 = fakeWeb(web);
  const r1 = await runWatch({ sources: SRC(), fetchImpl: w1.fetchImpl, ...c });
  assert.equal(r1.flags.flags.length, 0);
  assert.equal(r1.state.sources["fixture-deals"].status, "ok");
  assert.ok(w1.calls.every((x) => x.ua === USER_AGENT));
  assert.equal(w1.calls.filter((x) => x.url.endsWith("/offers")).length, 1, "one page fetch per run");

  const r2 = await runWatch({ sources: SRC(), state: r1.state, flags: r1.flags, fetchImpl: fakeWeb(web).fetchImpl, ...c });
  assert.equal(r2.changed, 0);
  assert.deepEqual(r2.state, r1.state, "unchanged page leaves state byte-identical (no commit)");

  web["https://deals.example/offers"] = { body: page("Black Friday", ["Save 35% on stays", "Kids sail free"]) };
  const r3 = await runWatch({ sources: SRC(), state: r2.state, flags: r2.flags, fetchImpl: fakeWeb(web).fetchImpl, ...c });
  assert.equal(r3.changed, 1);
  const [f] = r3.flags.flags;
  assert.equal(f.kind, "changed");
  assert.equal(f.previous_headline, "Deals");
  assert.equal(f.headline, "Black Friday");
  assert.deepEqual(f.added, ["Save 35% on stays", "Kids sail free"]);
  assert.deepEqual(f.removed, ["Save 20% on stays"]);
});

test("robots disallow, unreadable robots and denials are flagged once and never retried unchanged", async () => {
  for (const [label, web] of [
    ["disallow", { "https://deals.example/robots.txt": { body: "User-agent: *\nDisallow: /offers" } }],
    ["robots 401", { "https://deals.example/robots.txt": { status: 401, body: "Unauthorized" } }],
    ["robots html", { "https://deals.example/robots.txt": { body: "<html>bot check</html>" } }],
    ["crawl-delay", { "https://deals.example/robots.txt": { body: "User-agent: *\nCrawl-delay: 600" } }],
    ["403", { "https://deals.example/robots.txt": { status: 404 }, "https://deals.example/offers": { status: 403, body: "no" } }],
  ]) {
    const w = fakeWeb(web);
    const r1 = await runWatch({ sources: SRC(), fetchImpl: w.fetchImpl, ...clock() });
    assert.equal(r1.flags.flags.length, 1, label);
    assert.equal(r1.flags.flags[0].kind, "blocked", label);
    if (label !== "403") assert.ok(!w.calls.some((x) => x.url.endsWith("/offers")), `${label}: page never fetched`);
    const w2 = fakeWeb(web);
    const r2 = await runWatch({ sources: SRC(), state: r1.state, flags: { flags: [] }, fetchImpl: w2.fetchImpl, ...clock() });
    assert.equal(w2.calls.length, 0, `${label}: no request on the next run`);
    assert.equal(r2.flags.flags.length, 0, `${label}: not flagged twice`);
    const w3 = fakeWeb(web);
    await runWatch({ sources: SRC({ retry: 1 }), state: r1.state, fetchImpl: w3.fetchImpl, ...clock() });
    assert.ok(w3.calls.length > 0, `${label}: raising retry allows one new attempt`);
  }
});

test("transient errors retry up to the limit, then flag unreachable and stop", async () => {
  const web = { "https://deals.example/robots.txt": { status: 503 } };
  let state, flags = { flags: [] };
  for (let i = 1; i <= MAX_ERRORS; i++) {
    const r = await runWatch({ sources: SRC(), state, flags, fetchImpl: fakeWeb(web).fetchImpl, ...clock() });
    state = r.state; flags = r.flags;
    assert.equal(state.sources["fixture-deals"].errors, i);
    assert.equal(flags.flags.length, i === MAX_ERRORS ? 1 : 0);
  }
  assert.equal(flags.flags[0].kind, "unreachable");
  const w = fakeWeb(web);
  await runWatch({ sources: SRC(), state, flags, fetchImpl: w.fetchImpl, ...clock() });
  assert.equal(w.calls.length, 0);
});

test("redirects are followed with robots checked on the new host; Crawl-delay is honored per host", async () => {
  const c = clock();
  const web = {
    "https://deals.example/robots.txt": { body: "User-agent: *\nCrawl-delay: 10" },
    "https://deals.example/offers": { status: 301, headers: { location: "https://www.deals.example/offers" } },
    "https://www.deals.example/robots.txt": { body: "User-agent: *\nDisallow: /offers" },
    "https://deals.example/terms": { body: page("Terms", ["Book by Nov 2"]) },
  };
  const r = await runWatch({ sources: { sources: [SRC().sources[0], { id: "fixture-terms", operator: "Fixture", kind: "offer-terms", url: "https://deals.example/terms" }] }, fetchImpl: fakeWeb(web).fetchImpl, ...c });
  assert.equal(r.state.sources["fixture-deals"].status, "robots");
  assert.equal(r.state.sources["fixture-terms"].status, "ok");
  assert.ok(c.now() - Date.parse("2026-10-29T13:00:00Z") >= 10_000, "waited the Crawl-delay before the second same-host fetch");
});

test("pending flags merge per source and keep the first detection time", async () => {
  const c = clock();
  const web = { "https://deals.example/robots.txt": { status: 404 }, "https://deals.example/offers": { body: page("A", ["Save 10%"]) } };
  let r = await runWatch({ sources: SRC(), fetchImpl: fakeWeb(web).fetchImpl, ...c });
  web["https://deals.example/offers"].body = page("B", ["Save 20%"]);
  r = await runWatch({ sources: SRC(), state: r.state, flags: r.flags, fetchImpl: fakeWeb(web).fetchImpl, ...c });
  const first = r.flags.flags[0].detected_at;
  await c.sleep(3_600_000);
  web["https://deals.example/offers"].body = page("C", ["Save 30%"]);
  r = await runWatch({ sources: SRC(), state: r.state, flags: r.flags, fetchImpl: fakeWeb(web).fetchImpl, ...c });
  assert.equal(r.flags.flags.length, 1);
  assert.equal(r.flags.flags[0].detected_at, first);
  assert.equal(r.flags.flags[0].previous_headline, "A");
  assert.equal(r.flags.flags[0].headline, "C");
  assert.deepEqual(r.flags.flags[0].added, ["Save 20%", "Save 30%"]);
});

test("committed sources are valid official pages and link to existing deal checks", () => {
  const sources = readJson("ops/deal-watch/sources.json");
  assert.deepEqual(validateSources(sources), []);
  const checks = new Set(readJson("tools/page-generation/deal-checks.json").checks.map((c) => c.id));
  const urls = new Set();
  for (const s of sources.sources) {
    if (s.check_id) assert.ok(checks.has(s.check_id), `${s.id}: unknown check_id ${s.check_id}`);
    assert.ok(!urls.has(s.url), `${s.url} listed twice`);
    urls.add(s.url);
    assert.doesNotMatch(s.url, /slickdeals|thepointsguy|cruisefever|travelmarketreport|disneyland\.disney\.go\.com\/offers|disneyaulani|dollywood|kalahari|hyatt/i, `${s.id}: not a watchable official page`);
  }
  assert.ok(sourceSig(sources.sources[0]) !== sourceSig({ ...sources.sources[0], retry: 1 }));
});

test("committed state and flags (when present) stay small and hold no raw bodies", () => {
  for (const name of ["state.json", "flags.json"]) {
    let text;
    try { text = readFileSync(new URL(`ops/deal-watch/${name}`, root), "utf8"); } catch { continue; }
    assert.ok(text.length <= 50 * 1024, `${name} exceeds 50 KB`);
    assert.doesNotMatch(text, /<html|<script|<body/i, `${name} holds markup`);
    JSON.parse(text);
  }
});
