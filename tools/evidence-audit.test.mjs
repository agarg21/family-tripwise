import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { ageState, permittedUrl, sourceSignals, fetchSource, compareSource, audit } from "./evidence-audit.mjs";

test("field age is not renewed by successful collection", () => {
  assert.equal(ageState("2026-07-26", 14, "2026-09-30").state, "review-due");
  assert.equal(ageState(null, 14, "2026-09-30").state, "unknown");
  assert.equal(ageState("2026-10-01", 14, "2026-09-30").state, "future-date-review");
  assert.throws(() => ageState("2026-02-30", 14, "2026-09-30"));
  assert.throws(() => ageState("2026-09-30", 0, "2026-09-30"));
  assert.throws(() => ageState(null, 14, "2026-02-30"));
});
test("allowlist rejects credentials, sensitive URLs and unapproved redirects", async () => {
  for (const u of ["http://a.test/", "https://x:a@a.test/", "https://a.test/?token=x", "https://b.test/"]) assert.throws(() => permittedUrl(u, ["a.test"]));
  let calls = 0;
  const r = await fetchSource("https://a.test/", ["a.test"], [], { fetcher: async () => { calls++; return new Response("", { status: 302, headers: { location: "http://127.0.0.1/" } }); } });
  assert.equal(r.state, "unavailable-review"); assert.equal(calls, 1);
});
test("normalized hashes ignore scripts; prices are unverified candidates", () => {
  const html = '<p>Maximum eight guests</p><script type="application/ld+json">{"@type":"Offer","price":"330","priceCurrency":"USD"}</script>';
  const r = sourceSignals(html, [{ id: "capacity", pattern: "eight guests" }]);
  assert.equal(r.fields[0].state, "expected-text-present");
  assert.equal(r.price_candidates[0].price, 330);
  assert.equal(r.price_candidates[0].room_party_dates_fees, "UNVERIFIED");
  assert.equal(compareSource(r, r).state, "text-unchanged");
  assert.equal(compareSource(sourceSignals(html.replace("eight", "four")), r).state, "text-changed-review");
  assert.equal(compareSource(sourceSignals(html.replace('"330"', '"340"')), r).state, "structured-price-changed-review");
  const legacy = { ...r }; delete legacy.price_sha256;
  assert.equal(compareSource(r, legacy).state, "text-unchanged");
});
test("authorization-shaped keys reject before collection and after redirects", async () => {
  const source = "https://be.synxis.com/?Hotel=33053&Chain=1037";
  const keys = ["authorization", "Authorization", "AUTHORIZATION", "authorisation", "author%69zation", "%61uthorization", "auth%6Frisation", "authorization_code", "sourceAuthorization", "authorization[]"];
  for (const key of keys) {
    const url = `${source}&${key}=fixture`;
    assert.throws(() => permittedUrl(url, ["be.synxis.com"]), { message: "Sensitive source parameters are not permitted" });
    let calls = 0;
    const result = await fetchSource(url, ["be.synxis.com"], [], { fetcher: async () => { calls++; throw new Error("Must not fetch sensitive URL"); } });
    assert.equal(calls, 0);
    assert.equal(result.state, "unavailable-review");
    assert.equal(result.error_kind, "fetch-or-policy-error");
  }
  assert.throws(() => permittedUrl(`${source}&safe=1&authorization=&authorization=fixture`, ["be.synxis.com"]), /Sensitive source parameters/);
  for (const location of ["/?authorization=fixture", "https://be.synxis.com/?author%69sation=fixture"]) {
    const requests = [];
    const result = await fetchSource(source, ["be.synxis.com"], [], { fetcher: async url => { requests.push(url); return new Response("", { status: 302, headers: { location } }); } });
    assert.deepEqual(requests, [source]);
    assert.equal(result.state, "unavailable-review");
    assert.equal(result.error_kind, "fetch-or-policy-error");
  }
  assert.equal(permittedUrl(source, ["be.synxis.com"]), source);
  assert.equal(permittedUrl(`${source}&currency=USD&rooms=1#details`, ["be.synxis.com"]), `${source}&currency=USD&rooms=1`);
  for (const key of ["token", "password", "secret", "api_key", "email", "session"]) assert.throws(() => permittedUrl(`${source}&${key}=fixture`, ["be.synxis.com"]));
});
test("Finest's observed public booking source uses one exact host without relaxing URL guards", async () => {
  const config = JSON.parse(await readFile(new URL("../ops/evidence-watch.json", import.meta.url), "utf8"));
  const source = JSON.parse(await readFile(new URL("../docs/research/cancun-finest-family-price-2026-10-11.json", import.meta.url), "utf8"));
  assert.equal(new URL(source.source_url).hostname, "booking.finestresorts.com");
  assert.equal(config.allowed_hosts.filter(h => h === "booking.finestresorts.com").length, 1);
  assert.equal(permittedUrl(source.source_url, config.allowed_hosts), source.source_url);
  for (const url of ["http://booking.finestresorts.com/", "https://booking.finestresorts.com:8443/", "https://user:pass@booking.finestresorts.com/", "https://booking.finestresorts.com/?session=x", "https://unapproved.finestresorts.com/"]) assert.throws(() => permittedUrl(url, config.allowed_hosts));
  let requests = 0;
  const result = await fetchSource(source.source_url, config.allowed_hosts, [], { fetcher: async () => { requests++; return new Response("", { status: 302, headers: { location: "https://unapproved.finestresorts.com/" } }); } });
  assert.equal(requests, 1); assert.equal(result.state, "unavailable-review");
});
test("unavailable and challenges do not become fresh evidence", async () => {
  const config = JSON.parse(await readFile(new URL("../ops/evidence-watch.json", import.meta.url), "utf8"));
  const cabana = JSON.parse(await readFile(new URL("../docs/research/orlando-cabana-rate-plans-2026-10-11.json", import.meta.url), "utf8"));
  assert.equal(new URL(cabana.source_url).hostname, "reservations.universalorlando.com");
  assert.equal(config.allowed_hosts.filter(h => h === "reservations.universalorlando.com").length, 1);
  assert.equal(permittedUrl(cabana.source_url, config.allowed_hosts), cabana.source_url);
  for (const url of ["http://reservations.universalorlando.com/", "https://reservations.universalorlando.com:8443/", "https://user:pass@reservations.universalorlando.com/", "https://reservations.universalorlando.com/?session=x", "https://unapproved.universalorlando.com/"]) assert.throws(() => permittedUrl(url, config.allowed_hosts));
  for (const [response, state] of [[new Response("denied", { status: 403 }), "unavailable-review"], [new Response("Just a moment " + " ".repeat(120), { headers: { "content-type": "text/html" } }), "challenge-or-empty-review"], [new Response("pdf", { headers: { "content-type": "application/pdf" } }), "unsupported-format-review"]]) {
    assert.equal((await fetchSource("https://a.test/", ["a.test"], [], { fetcher: async () => response })).state, state);
  }
});
test("repository inventory covers every canonical page and retains price context", async () => {
  const config = JSON.parse(await readFile(new URL("../ops/evidence-watch.json", import.meta.url), "utf8"));
  const r = await audit(config, { today: "2026-09-30" });
  assert.equal(r.summary.canonical_pages, 50);
  assert.equal(r.factual_dates_renewed, false);
  assert.ok(r.pages.some((p) => p.records.some((x) => x.field === "nightly-price" && x.basis.includes("party"))));
  assert.ok(r.sources.every((s) => s.state === "not-fetched"));
  const denied = await audit(config, { collect: true, limit: 1, today: "2026-09-30", previous: { collected_at: "2026-09-29T12:00:00Z", sources: [{ ...r.sources[0], http_status: 403 }] }, fetcher: async () => { throw new Error("must not retry denial"); } });
  assert.equal(denied.sources[0].state, "access-denied-carried-forward");
  assert.equal(denied.sources[0].last_attempt_at, "2026-09-29T12:00:00Z");
  const prior = { collected_at: "2026-09-29T12:00:00Z", sources: r.sources.map((s) => ({ ...s, state: "unavailable-review", http_status: 403, last_attempt_at: "2026-09-29T12:00:00Z" })) };
  let requests = 0; const fetcher = async () => { requests++; throw new Error("must not retry denial"); };
  const limited = await audit(config, { collect: true, limit: 1, today: "2026-09-30", previous: prior, fetcher });
  const expanded = await audit(config, { collect: true, limit: 500, today: "2026-09-30", previous: limited, fetcher });
  assert.equal(requests, 0); assert.ok(expanded.sources.every((s) => s.state === "access-denied-carried-forward" && s.last_attempt_at === prior.collected_at));
});
