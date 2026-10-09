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
test("unavailable and challenges do not become fresh evidence", async () => {
  for (const [response, state] of [[new Response("denied", { status: 403 }), "unavailable-review"], [new Response("Just a moment " + " ".repeat(120), { headers: { "content-type": "text/html" } }), "challenge-or-empty-review"], [new Response("pdf", { headers: { "content-type": "application/pdf" } }), "unsupported-format-review"]]) {
    assert.equal((await fetchSource("https://a.test/", ["a.test"], [], { fetcher: async () => response })).state, state);
  }
});
test("repository inventory covers every canonical page and retains price context", async () => {
  const config = JSON.parse(await readFile(new URL("../ops/evidence-watch.json", import.meta.url), "utf8"));
  const r = await audit(config, { today: "2026-09-30" });
  assert.equal(r.summary.canonical_pages, 32);
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
