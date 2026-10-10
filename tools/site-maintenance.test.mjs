import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { maintenanceReport, maintenanceOptions, maintenanceCycle, validateCoverage, validatePriorAudit, policyReviewClocks } from "./site-maintenance.mjs";
import { fetchSource } from "./evidence-audit.mjs";

async function policyInputs() {
  return {
    teenAccess: JSON.parse(await readFile(new URL("../docs/research/las-vegas-teen-access-2026-10-09.json", import.meta.url), "utf8")),
    transitEvidence: JSON.parse(await readFile(new URL("../docs/research/dc-family-transit-cost-2026-10-03.json", import.meta.url), "utf8"))
  };
}

test("policy-specific review clocks retain observations and exact due-day boundaries", async () => {
  const inputs = await policyInputs();
  const current = policyReviewClocks({ ...inputs, today: "2026-10-09" });
  assert.deepEqual(current.map(record => record.observed_on), ["2026-10-09", "2026-10-03"]);
  assert.deepEqual(current.map(record => record.freshness.due_on), ["2026-11-08", "2026-11-02"]);
  assert.ok(current.every(record => record.freshness.state === "within-review-interval"));
  for (const [date, states] of [["2026-11-01", [false,false]], ["2026-11-02", [false,true]], ["2026-11-03", [false,true]], ["2026-11-08", [true,true]]])
    assert.deepEqual(policyReviewClocks({ ...inputs, today: date }).map(record => record.freshness.state === "review-due"), states);
});

test("historical policy clocks never promote not-yet-observed evidence", async () => {
  const inputs = await policyInputs();
  const historical = policyReviewClocks({ ...inputs, today: "2026-10-02" });
  assert.ok(historical.every(record => record.evidence_state === "not-yet-observed-at-report-date" && record.freshness.state === "future-date-review" && record.freshness.due_on === null));
  assert.deepEqual(policyReviewClocks({ ...inputs, today: "2026-10-03" }).map(record => record.evidence_state), ["not-yet-observed-at-report-date", "dated-records-available"]);
});

test("invalid policy dates, provenance, intervals and unsafe URLs fail closed without mutation", async () => {
  const inputs = await policyInputs(), original=structuredClone(inputs);
  for (const mutate of [
    data => data.teenAccess.observed_on="2026-02-30",
    data => data.teenAccess.next_review_due="2026-10-09",
    data => data.teenAccess.sources[0].observed_on="2026-10-08",
    data => data.teenAccess.sources=[],
    data => data.teenAccess.evidence_class="HUMAN_VERIFIED",
    data => data.teenAccess.sources[0].url="https://user:password@example.com/",
    data => data.transitEvidence.policy.source.url="https://www.wmata.com/pay.html?token=synthetic",
    data => data.transitEvidence.policy.source.status="blocked-unverified",
    data => data.transitEvidence.policy.refresh_days=0,
    data => data.transitEvidence.policy.source.inspected_on=null
  ]) { const invalid=structuredClone(inputs);mutate(invalid);assert.throws(()=>policyReviewClocks({ ...invalid, today:"2026-10-09" })); }
  assert.throws(()=>policyReviewClocks({ ...inputs, today:"2026-02-30" }));
  policyReviewClocks({ ...inputs, today:"2026-11-09" });
  assert.deepEqual(inputs,original);
});

test("offline maintenance surfaces policy due counts while preserving room and price clocks", async () => {
  const current=await maintenanceReport({today:"2026-10-09"});
  assert.equal(current.policy_review_clocks.length,10);
  assert.equal(current.summary.policy_review_clocks,10);
  assert.equal(current.summary.policy_due_records,0);
  assert.equal(current.summary.policy_not_yet_observed,7);
  const future=await maintenanceReport({today:"2026-11-03"});
  assert.equal(future.summary.policy_due_records,4);
  assert.equal(future.policy_review_clocks.find(record=>record.id==="dc-regular-rail-fare").freshness.state,"review-due");
  assert.equal(future.exact_room_comparisons[0].records[0].price_observed_on,"2026-09-30");
  assert.equal(future.automatic_fact_renewal,false);assert.equal(future.automatic_publication,false);
  const historical=await maintenanceReport({today:"2026-10-01"});
  assert.equal(historical.summary.policy_not_yet_observed,10);assert.equal(historical.summary.policy_due_records,0);
  assert.equal(current.policy_review_clocks.find(record=>record.id==="boston-museum-admission-return").freshness.due_on,"2026-10-23");
  assert.equal((await maintenanceReport({today:"2026-10-23"})).summary.policy_due_records,2);
  assert.deepEqual(future.pages,current.pages);
});

test("OMNY own November9 clock keeps historical evidence and prior budgets separate", async () => {
 const report = await maintenanceReport({today:"2026-10-10"}), c = report.policy_review_clocks.find(r=>r.id==="nyc-omny-family-payment");
 assert.equal(c.observed_on,"2026-10-10"); assert.equal(c.freshness.due_on,"2026-11-09");
 assert.equal((await maintenanceReport({today:"2026-10-09"})).policy_review_clocks.find(r=>r.id===c.id).evidence_state,"not-yet-observed-at-report-date");
 assert.equal((await maintenanceReport({today:"2026-11-09"})).policy_review_clocks.find(r=>r.id===c.id).freshness.state,"review-due");
 assert.equal(report.policy_review_clocks.find(r=>r.id==="nyc-ferry-fare-return").freshness.due_on,"2026-10-19");
 assert.equal(report.policy_review_clocks.find(r=>r.id==="nyc-moma-admission-return").freshness.due_on,"2026-10-24");
 assert.equal(report.automatic_fact_renewal,false);
});

test("NYC Ferry October19 clock preserves announced evidence and other source clocks",async()=>{
 const report=await maintenanceReport({today:"2026-10-19"}),c=report.policy_review_clocks.find(r=>r.id==="nyc-ferry-fare-return");
 assert.equal(c.freshness.due_on,"2026-10-19");assert.equal(c.freshness.state,"review-due");assert.equal(c.announced_state,"announced-not-observed");assert.equal((await maintenanceReport({today:"2026-10-09"})).policy_review_clocks.find(r=>r.id===c.id).evidence_state,"not-yet-observed-at-report-date");
 assert.equal(report.policy_review_clocks.find(r=>r.id==="nyc-moma-admission-return").freshness.due_on,"2026-10-24");assert.equal(report.policy_review_clocks.find(r=>r.id==="nyc-summit-under16").freshness.due_on,"2026-11-09");
});

test("MoMA admission/return clock uses its October10 source without promoting future examples or renewing SUMMIT",async()=>{
 const report=await maintenanceReport({today:"2026-10-10"}),policy=report.policy_review_clocks.find(r=>r.id==="nyc-moma-admission-return");
 assert.equal(policy.freshness.due_on,"2026-10-24");
 assert.equal((await maintenanceReport({today:"2026-10-24"})).policy_review_clocks.find(r=>r.id===policy.id).freshness.state,"review-due");
 assert.equal((await maintenanceReport({today:"2026-10-09"})).policy_review_clocks.find(r=>r.id===policy.id).evidence_state,"not-yet-observed-at-report-date");
 assert.equal(report.policy_review_clocks.find(r=>r.id==="nyc-summit-under16").freshness.due_on,"2026-11-09");
 assert.equal(report.exact_room_comparisons[0].records[0].price_observed_on,"2026-09-30");
});

test("SUMMIT policy clock is scoped to the teen page without renewing general source or hotel dates",async()=>{
 const report=await maintenanceReport({today:"2026-10-10"}),policy=report.policy_review_clocks.find(r=>r.id==="nyc-summit-under16");
 assert.equal(policy.observed_on,"2026-10-10");assert.equal(policy.freshness.due_on,"2026-11-09");
 assert.equal((await maintenanceReport({today:"2026-10-09"})).policy_review_clocks.find(r=>r.id===policy.id).evidence_state,"not-yet-observed-at-report-date");
 assert.equal((await maintenanceReport({today:"2026-11-09"})).policy_review_clocks.find(r=>r.id===policy.id).freshness.state,"review-due");
 assert.equal(report.exact_room_comparisons[0].records[0].price_observed_on,"2026-09-30");
 assert.equal(report.automatic_fact_renewal,false);assert.equal(report.automatic_publication,false);
});

test("SPYGAMES policy has its own review clock without renewing prior attraction facts",async()=>{
 const report=await maintenanceReport({today:"2026-10-10"}),p=report.policy_review_clocks.find(r=>r.id==="nyc-spygames-under16");
 assert.equal(p.observed_on,"2026-10-10");assert.equal(p.freshness.due_on,"2026-11-09");
 assert.equal((await maintenanceReport({today:"2026-10-09"})).policy_review_clocks.find(r=>r.id===p.id).evidence_state,"not-yet-observed-at-report-date");
 assert.equal((await maintenanceReport({today:"2026-11-09"})).policy_review_clocks.find(r=>r.id===p.id).freshness.state,"review-due");
 assert.equal(report.policy_review_clocks.find(r=>r.id==="nyc-ferry-fare-return").freshness.due_on,"2026-10-19");
 assert.equal(report.policy_review_clocks.find(r=>r.id==="nyc-moma-admission-return").freshness.due_on,"2026-10-24");
 assert.equal(report.automatic_fact_renewal,false);
});

test("PV generic meal policy has its own clock without re-pricing selected plans",async()=>{
 const report=await maintenanceReport({today:"2026-10-10"}),p=report.policy_review_clocks.find(r=>r.id==="pv-generic-meal-policy");assert.equal(p.observed_on,"2026-10-10");assert.equal(p.freshness.due_on,"2026-11-09");assert.equal((await maintenanceReport({today:"2026-10-09"})).policy_review_clocks.find(r=>r.id===p.id).evidence_state,"not-yet-observed-at-report-date");assert.equal(report.exact_room_comparisons[2].records[0].price_observed_on,"2026-10-09");assert.equal(report.exact_room_comparisons[2].records[0].price_age.due_on,"2026-10-23");
});

test("Park Plaza gym/fee policy clock does not renew original room or price evidence",async()=>{
  const current=await maintenanceReport({today:"2026-10-10"});
  const policy=current.policy_review_clocks.find(record=>record.id==="boston-park-plaza-gym-fee");
  assert.equal(policy.observed_on,"2026-10-10");assert.equal(policy.freshness.due_on,"2026-11-09");
  assert.equal(current.summary.policy_not_yet_observed,0);
  assert.equal((await maintenanceReport({today:"2026-11-09"})).policy_review_clocks.find(record=>record.id===policy.id).freshness.state,"review-due");
  assert.equal(current.exact_room_comparisons[1].records[1].price_observed_on,"2026-10-01");
  assert.equal(current.exact_room_comparisons[1].records[1].category_age.due_on,"2026-10-31");
  assert.equal(current.exact_room_comparisons[1].records[1].price_age.due_on,"2026-10-15");
});

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

test("Boston exact Plaza source clock does not renew other categories or historical reports", async () => {
  const current=(await maintenanceReport({today:"2026-10-09"})).exact_room_comparisons[1];
  const prior=(await maintenanceReport({today:"2026-10-08"})).exact_room_comparisons[1];
  assert.equal(prior.records.length,4);
  assert.equal(prior.records[2].category_age.age_days,7);
  assert.equal(prior.records[2].category_age.due_on,"2026-10-31");
  assert.equal(current.records[2].category_age.age_days,0);
  assert.equal(current.records[2].category_age.due_on,"2026-11-08");
  assert.equal(current.records[2].price_observed_on,null);
  for (const index of [0,1,3]) assert.equal(current.records[index].category_age.due_on,prior.records[index].category_age.due_on);
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
