import test from "node:test";
import assert from "node:assert/strict";
import { validateBatch, keywordRows, serpRows, runBatch } from "./seo-opportunity-pull.mjs";
import { mkdtemp, readFile, rm } from "node:fs/promises";
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
