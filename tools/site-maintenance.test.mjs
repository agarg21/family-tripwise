import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { maintenanceReport, maintenanceOptions, maintenanceCycle, validateCoverage, validatePriorAudit } from "./site-maintenance.mjs";
import { fetchSource } from "./evidence-audit.mjs";

test("all 34 canonical URLs have one explicit owner without renewing facts", async () => {
  const report = await maintenanceReport({ today: "2026-10-01" });
  assert.equal(report.summary.canonical_pages, 34);
  assert.equal(report.summary.travel_pages, 31);
  assert.equal(report.summary.utility_pages, 3);
  assert.equal(report.summary.unclassified_pages, 0);
  assert.equal(report.summary.hotel_price_basis_gaps, 54);
  assert.equal(report.summary.planning_missing_page_source_notes, 4);
  assert.equal(report.automatic_fact_renewal, false);
  assert.equal(report.automatic_publication, false);
  assert.equal(report.pages.filter(page => page.contract === "itinerary").length, 5);
  assert.equal(report.exact_room_comparisons[0].records.length, 3);
  assert.equal(report.exact_room_comparisons[0].records[0].price_observed_on, "2026-09-30");
  assert.equal(report.exact_room_comparisons[0].records[2].price_observed_on, null);
  assert.equal(report.exact_room_comparisons[1].evidence_state, "not-yet-observed-at-report-date");
  assert.equal(report.exact_room_comparisons[1].records.length, 0);
  let requests = 0;
  const cycle = await maintenanceCycle({ today: "2026-10-01", fetcher: () => { requests++; throw new Error("No network"); } });
  assert.equal(requests, 0); assert.equal(cycle.source_audit, null);
});

test("Boston dated ownership retains price ages and unresolved counts", async () => {
  const report = await maintenanceReport({ today: "2026-10-09" });
  const boston = report.exact_room_comparisons[1];
  assert.equal(boston.records.length, 4);
  assert.equal(boston.evidence_state, "dated-records-available");
  assert.deepEqual(boston.records.slice(0, 2).map(r => r.price_observed_on), ["2026-10-03", "2026-10-01"]);
  assert.equal(boston.records[1].price_status, "dated-age-unresolved-count-samples");
  assert.equal(boston.records[2].price_observed_on, null);
  assert.equal(boston.records[0].price_age.due_on, "2026-10-17");
});

test("unknown, removed, duplicate and multiply-owned canonicals fail closed", () => {
  assert.throws(() => validateCoverage(["a", "b"], { type: ["a"] }));
  assert.throws(() => validateCoverage(["a"], { type: ["a", "b"] }));
  assert.throws(() => validateCoverage(["a", "a"], { type: ["a"] }));
  assert.throws(() => validateCoverage(["a"], { type: ["a"], other: ["a"] }));
});

test("CLI rejects implicit network, invalid/repeated flags and overlapping outputs", () => {
  for (const args of [["--collect"], ["--previous", "old.json"], ["--limit", "0"], ["--date", "2026-02-30"], ["--date", "2026-10-01", "--date", "2026-10-01"], ["--wat"], ["--output"], ["--collect", "--output", "same", "--previous", "old", "--audit-output", "same", "--review-output", "review"]]) assert.throws(() => maintenanceOptions(args));
  assert.equal(maintenanceOptions(["--date", "2026-10-01"]).collect, false);
});

test("bounded source cycle carries denials and does not publish or renew claims", async () => {
  const prior = JSON.parse(await readFile(new URL("../ops/evidence-audits/2026-09-30-repeat.json", import.meta.url), "utf8"));
  const denied = new Set(prior.sources.filter(source => [401, 403].includes(source.http_status) || ["access-denied-carried-forward", "challenge-or-empty-review"].includes(source.state)).map(source => source.url));
  let calls = 0;
  const result = await maintenanceCycle({ today: "2026-10-01", collect: true, previous: prior, limit: 1, fetcher: async url => {
    assert.equal(denied.has(String(url)), false); calls++;
    return new Response("<html><body>Fixture only; no observed travel facts.</body></html>", { status: 200, headers: { "content-type": "text/html" } });
  } });
  assert.ok(calls <= 1);
  assert.equal(result.source_review.summary.canonical_pages, 34);
  assert.equal(result.source_review.summary.carried_denials, denied.size);
  assert.equal(result.source_audit.factual_dates_renewed, false);
  assert.equal(result.source_review.automatic_publication, false);
  await assert.rejects(maintenanceCycle({ collect: true }));
});

test("malformed, incomplete or duplicate priors fail before any request", async () => {
  const valid = JSON.parse(await readFile(new URL("../ops/evidence-audits/2026-09-30-repeat.json", import.meta.url), "utf8"));
  const cases = [{ sources: [] }, { ...valid, schema_version: 2 }, { ...valid, collected_at: "invalid" }];
  for (const mutate of [p => p.sources.push({ ...p.sources.find(source => source.http_status === 403), state: "text-unchanged", http_status: 200 }), p => p.pages.push(p.pages[0]), p => p.sources[0].last_attempt_at = "2026-02-30T00:00:00.000Z", p => p.sources[0].credentials = "unrecognized", p => delete p.sources[0]]) {
    const prior = structuredClone(valid); mutate(prior); cases.push(prior);
  }
  for (const previous of cases) {
    let calls = 0;
    await assert.rejects(maintenanceCycle({ today: "2026-10-01", collect: true, previous, limit: 1, fetcher: async () => { calls++; return new Response("fixture"); } }));
    assert.equal(calls, 0);
  }
});

test("nested prior candidates reject private data and promoted provenance before requests", async () => {
  const valid = JSON.parse(await readFile(new URL("../ops/evidence-audits/2026-09-30-repeat.json", import.meta.url), "utf8"));
  const candidate = { price: 300, currency: "USD", name: null, room_party_dates_fees: "UNVERIFIED", evidence_class: "STRUCTURED_PRICE_CANDIDATE" };
  const field = { id: "room", state: "expected-text-present", evidence_class: "EXTRACTION_CANDIDATE" };
  for (const mutate of [s => s.price_candidates = [{ ...candidate, credentials: "synthetic" }], s => s.price_candidates = [{ ...candidate, copied_source_body: "synthetic" }], s => s.price_candidates = [{ ...candidate, evidence_class: "HUMAN_VERIFIED" }], s => s.price_candidates = [{ ...candidate, price: "300" }], s => s.price_candidates = [{ ...candidate, room_party_dates_fees: "VERIFIED" }], s => s.price_candidates = new Array(1), s => s.fields = [{ ...field, credentials: "synthetic" }], s => s.fields = [{ ...field, evidence_class: "HUMAN_VERIFIED" }], s => s.fields = new Array(1)]) {
    const previous = structuredClone(valid); mutate(previous.sources[0]); let requests = 0;
    await assert.rejects(maintenanceCycle({ today: "2026-10-01", collect: true, previous, limit: 1, fetcher: () => { requests++; throw new Error("Not permitted"); } }));
    assert.equal(requests, 0);
  }
});

test("native size-limit result round-trips through prior preflight", async () => {
  const prior = JSON.parse(await readFile(new URL("../ops/evidence-audits/2026-09-30-repeat.json", import.meta.url), "utf8"));
  const config = JSON.parse(await readFile(new URL("../ops/evidence-watch.json", import.meta.url), "utf8"));
  const source = prior.sources[0];
  const result = await fetchSource(source.url, config.allowed_hosts, [], { fetcher: async () => new Response("fixture", { status: 200, headers: { "content-type": "text/html", "content-length": "3000001" } }) });
  assert.equal(result.state, "size-limit-review");
  prior.sources[0] = { ...result, pages: source.pages };
  assert.doesNotThrow(() => validatePriorAudit(prior, config.allowed_hosts));
});
