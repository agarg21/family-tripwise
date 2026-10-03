import test from "node:test";
import assert from "node:assert/strict";
import { validateBatch, keywordRows, serpRows, runBatch } from "./seo-opportunity-pull.mjs";
import { mkdtemp, readFile, rm, access } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
const batch = { keywords: ["family hotels london"], serp_keywords: ["family hotels london"], batch_ceiling_usd: 0.5, prior_spend_usd: 0.14832, cumulative_ceiling_usd: 5 };
test("research bounds, budget and SERP subset are explicit", () => {
  assert.ok(validateBatch(batch) < 0.5);
  assert.throws(() => validateBatch({ ...batch, keywords: Array(201).fill("a") }));
  assert.throws(() => validateBatch({ ...batch, prior_spend_usd: 5 }));
  assert.throws(() => validateBatch({ ...batch, serp_keywords: ["unapproved"] }));
  assert.throws(() => validateBatch({ ...batch, prior_spend_usd: "unknown" }));
});
test("paid partial failures are persisted once and cannot be replayed accidentally", async () => {
  const dir = await mkdtemp(join(tmpdir(), "tripwise-research-test-")); const path = join(dir, "report.json"); let calls = 0;
  try {
    const fetcher = async () => { calls++; return new Response(JSON.stringify({ cost: 0.002, tasks: [{ status_code: calls === 1 ? 20000 : 40101, result: [{ items: [] }] }] }), { headers: { "content-type": "application/json" } }); };
    await assert.rejects(runBatch(batch, path, { auth: "protected", fetcher }), /no automatic paid retry/);
    assert.equal(calls, 2);
    const content = await readFile(path, "utf8"); const report = JSON.parse(content);
    assert.equal(report.calls[1].status, "provider-failure"); assert.equal(report.calls[1].cost_usd, 0.002); assert.ok(!content.includes("protected"));
    await assert.rejects(runBatch(batch, path, { auth: "protected", fetcher }), /already exists/); assert.equal(calls, 2);
  } finally { await rm(dir, { recursive: true, force: true }); }
});
test("actual billed cost stops cumulative overspend before another request", async () => {
  const dir = await mkdtemp(join(tmpdir(), "tripwise-budget-test-")); let calls = 0;
  try {
    const path = join(dir, "report.json");
    await assert.rejects(runBatch({ ...batch, prior_spend_usd: 4.88 }, path, { auth: "protected", fetcher: async () => { calls++; return new Response(JSON.stringify({ cost: 0.125, tasks: [{ status_code: 20000, result: [{ items: [] }] }] })); } }), /no automatic paid retry/);
    assert.equal(calls, 1); assert.equal(JSON.parse(await readFile(path, "utf8")).stop_reason, "reported-budget-exceeded-reconciliation-required");
  } finally { await rm(dir, { recursive: true, force: true }); }
});
test("remaining cumulative headroom is reserved before each paid request", async () => {
  const dir = await mkdtemp(join(tmpdir(), "tripwise-headroom-test-")); let calls = 0;
  try {
    const path = join(dir, "report.json");
    await assert.rejects(runBatch({ ...batch, prior_spend_usd: 4.88 }, path, { auth: "protected", fetcher: async () => { calls++; return new Response(JSON.stringify({ cost: 0.115, tasks: [{ status_code: 20000, result: [{ items: [] }] }] })); } }), /cannot cover/);
    assert.equal(calls, 1); assert.equal(JSON.parse(await readFile(path, "utf8")).stop_reason, "remaining-budget-headroom");
  } finally { await rm(dir, { recursive: true, force: true }); }
});
test("unknown is not zero; retained metrics exclude raw payloads", () => {
  const r = keywordRows({ tasks: [{ result: [{ items: [{ keyword: "known", keyword_info: { search_volume: 0, last_updated_time: "2026-09-01" }, keyword_properties: { keyword_difficulty: 0 }, secret: "excluded" }] }] }] }, ["known", "unknown"]);
  assert.equal(r[0].search_volume, 0); assert.equal(r[1].search_volume, null); assert.equal(r[0].secret, undefined);
});
test("SERP retains result shape and URLs, not third-party text", () => {
  const r = serpRows({ tasks: [{ result: [{ items: [{ type: "organic", url: "https://example.com/", domain: "example.com", rank_group: 1, description: "copied text" }, { type: "people_also_ask" }] }] }] }, "test");
  assert.equal(r.organic[0].rank, 1); assert.equal(r.organic[0].description, undefined); assert.equal(r.result_types.length, 2);
});

test("paid task manifests reject duplicate, sparse and non-data entries", () => {
  assert.throws(() => validateBatch({ ...batch, serp_keywords: [...batch.serp_keywords, ...batch.serp_keywords] }));
  assert.throws(() => validateBatch({ ...batch, keywords: new Array(1), serp_keywords: [] }));
  assert.throws(() => validateBatch({ ...batch, serp_keywords: new Array(1) }));
  assert.throws(() => validateBatch({ ...batch, keywords: [" family hotels london "] }));
  let reads = 0;
  const accessor = ["family hotels london"];
  Object.defineProperty(accessor, "0", { get() { reads++; return "family hotels london"; }, enumerable: true });
  assert.throws(() => validateBatch({ ...batch, keywords: accessor }));
  const hidden = ["family hotels london"];
  Object.defineProperty(hidden, "0", { value: "family hotels london", enumerable: false });
  assert.throws(() => validateBatch({ ...batch, serp_keywords: hidden }));
  const budgetGetter = { ...batch };
  Object.defineProperty(budgetGetter, "prior_spend_usd", { get() { reads++; return 0; }, enumerable: true });
  assert.throws(() => validateBatch(budgetGetter));
  assert.throws(() => validateBatch(Object.create(batch)));
  assert.equal(reads, 0);
});

test("invalid scope causes no receipt or fetch side effect", async () => {
  const dir = await mkdtemp(join(tmpdir(), "tripwise-scope-reject-"));
  let calls = 0;
  try {
    const output = join(dir, "report.json");
    for (const invalid of [{ ...batch, serp_keywords: [...batch.serp_keywords, ...batch.serp_keywords] }, { ...batch, keywords: new Array(1), serp_keywords: [] }]) {
      await assert.rejects(runBatch(invalid, output, { auth: "test-only", fetcher: async () => { calls++; throw new Error("must not fetch"); } }));
      await assert.rejects(access(output), { code: "ENOENT" });
    }
    assert.equal(calls, 0);
  } finally { await rm(dir, { recursive: true, force: true }); }
});

test("async caller mutation cannot widen approved task or budget scope", async () => {
  const dir = await mkdtemp(join(tmpdir(), "tripwise-scope-pin-"));
  const mutable = { ...batch, keywords: [...batch.keywords], serp_keywords: [...batch.serp_keywords] };
  const requests = [];
  try {
    const report = await runBatch(mutable, join(dir, "report.json"), { auth: "test-only", fetcher: async (url, options) => {
      const payload = JSON.parse(options.body)[0];
      requests.push({ url, payload });
      if (requests.length === 1) {
        mutable.keywords.push("unapproved");
        mutable.serp_keywords.push("unapproved", "family hotels london");
        mutable.serp_keywords[0] = "changed";
        mutable.prior_spend_usd = 99;
        mutable.cumulative_ceiling_usd = 100;
        mutable.batch_ceiling_usd = 100;
      }
      return new Response(JSON.stringify({ cost: 0.002, tasks: [{ status_code: 20000, result: [{ items: [] }] }] }));
    } });
    assert.equal(requests.length, 2);
    assert.deepEqual(requests[0].payload.keywords, batch.keywords);
    assert.equal(requests[1].payload.keyword, batch.serp_keywords[0]);
    assert.deepEqual(report.budget, { batch_ceiling_usd: 0.5, cumulative_ceiling_usd: 5, prior_spend_usd: batch.prior_spend_usd });
    assert.deepEqual(report.keywords.map((row) => row.keyword), batch.keywords);
    assert.deepEqual(report.serps.map((row) => row.keyword), batch.serp_keywords);
    assert.equal(report.total_cost_usd, 0.004);
    assert.equal(mutable.keywords.length, 2);
  } finally { await rm(dir, { recursive: true, force: true }); }
});

test("proxied manifest and task lengths are rejected before traps or side effects", async () => {
  const dir = await mkdtemp(join(tmpdir(), "tripwise-proxy-scope-"));
  let traps = 0, calls = 0;
  const keywords = Array.from({ length: 201 }, (_, index) => `term ${index}`);
  const serps = keywords.slice(0, 13);
  const proxy = (value) => new Proxy(value, {
    get(target, key, receiver) { traps++; return key === "length" ? 1 : Reflect.get(target, key, receiver); },
    getOwnPropertyDescriptor(target, key) { traps++; return Reflect.getOwnPropertyDescriptor(target, key); },
  });
  try {
    const output = join(dir, "report.json");
    const invalid = [proxy(batch), { ...batch, keywords: proxy(keywords), serp_keywords: [] }, { ...batch, keywords: keywords.slice(0, 13), serp_keywords: proxy(serps) }];
    for (const value of invalid) {
      assert.throws(() => validateBatch(value));
      await assert.rejects(runBatch(value, output, { auth: "test-only", fetcher: async () => { calls++; throw new Error("must not fetch"); } }));
      await assert.rejects(access(output), { code: "ENOENT" });
    }
    assert.equal(traps, 0);
    assert.equal(calls, 0);
  } finally { await rm(dir, { recursive: true, force: true }); }
});
