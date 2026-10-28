import { readFile, writeFile, access, mkdir } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { types } from "node:util";
const ROOT = fileURLToPath(new URL("../", import.meta.url));
// Spend recorded in receipts before the GitHub workflow existed; the ledger never reports less.
export const RECORDED_SPEND_FLOOR_USD = 0.3626;
// Owner-approved cumulative DataForSEO budget across all receipts (ops/OWNER.md D8, raised from USD 5 on 2026-10-27).
export const APPROVED_CUMULATIVE_CEILING_USD = 20; // historical manifests carry the earlier USD 5 ceiling, still valid (stricter)

function ownData(object, key) {
  const field = Object.getOwnPropertyDescriptor(object, key);
  if (!field?.enumerable || !("value" in field)) throw new Error("Research manifest requires own enumerable data fields");
  return field.value;
}
function taskStrings(value, limit, required) {
  if (types.isProxy(value) || !Array.isArray(value)) throw new Error("Invalid bounded task list");
  const length = Object.getOwnPropertyDescriptor(value, "length").value;
  if (length > limit || (required && !length)) throw new Error("Invalid bounded task list");
  const strings = [];
  for (let index = 0; index < length; index++) {
    const item = ownData(value, index);
    if (typeof item !== "string" || !item.trim() || item !== item.trim() || item.length > 120) throw new Error("Invalid bounded keyword");
    strings.push(item);
  }
  if (new Set(strings).size !== strings.length) throw new Error("Duplicate research tasks");
  return Object.freeze(strings);
}
function preflight(input) {
  if (!input || typeof input !== "object" || types.isProxy(input) || Array.isArray(input)) throw new Error("Invalid research manifest");
  const hasAction = Object.hasOwn(input, "action");
  const action = hasAction ? ownData(input, "action") : "FT-ACC-001";
  if (typeof action !== "string" || !/^(?:FT-(?:ACC|RES|IMP|OPS)-[0-9]{3}|Q[0-9]{2,3}[a-z]?)$/.test(action)) throw new Error("Invalid research action ID");
  // Copy approved data before any await; callers cannot widen later requests.
  const batch = Object.freeze({
    action,
    action_source: hasAction ? "manifest" : "legacy-default",
    prior_spend_usd: ownData(input, "prior_spend_usd"),
    cumulative_ceiling_usd: ownData(input, "cumulative_ceiling_usd"),
    batch_ceiling_usd: ownData(input, "batch_ceiling_usd"),
    keywords: taskStrings(ownData(input, "keywords"), 200, true),
    serp_keywords: taskStrings(ownData(input, "serp_keywords"), 12, false),
  });
  if (!Number.isFinite(batch.prior_spend_usd) || batch.prior_spend_usd < 0 || ![5, APPROVED_CUMULATIVE_CEILING_USD].includes(batch.cumulative_ceiling_usd)) throw new Error("Invalid authorized research budget");
  if (batch.serp_keywords.some((k) => !batch.keywords.includes(k))) throw new Error("Invalid SERP subset");
  // Conservative guard above the documented September17 observed prices; no clickstream/deeper SERPs.
  const reserved = 0.1 + batch.keywords.length * 0.0002 + batch.serp_keywords.length * 0.01;
  if (batch.batch_ceiling_usd !== 0.5 || batch.prior_spend_usd + reserved > batch.cumulative_ceiling_usd || reserved > batch.batch_ceiling_usd) throw new Error("Budget preflight failed");
  return { batch, reserved };
}
export function validateBatch(batch) {
  return preflight(batch).reserved;
}
export function keywordRows(json, requested) {
  const rows = json.tasks?.[0]?.result?.[0]?.items || [];
  const map = new Map(rows.map((r) => [r.keyword?.toLowerCase(), r]));
  return requested.map((keyword) => {
    const r = map.get(keyword.toLowerCase()); const info = r?.keyword_info || {};
    return { keyword, search_volume: info.search_volume ?? null, keyword_difficulty: r?.keyword_properties?.keyword_difficulty ?? null, cpc: info.cpc ?? null, metrics_updated_at: info.last_updated_time ?? null, monthly_searches: (info.monthly_searches || []).map((m) => ({ year: m.year, month: m.month, search_volume: m.search_volume ?? null })), data_state: r ? "provider-estimate" : "unavailable-not-zero" };
  });
}
export function serpRows(json, keyword) {
  const r = json.tasks?.[0]?.result?.[0] || {};
  return { keyword, checked_at: r.datetime ?? null, result_types: [...new Set((r.items || []).map((i) => i.type))], organic: (r.items || []).filter((i) => i.type === "organic").slice(0, 10).map((i) => ({ rank: i.rank_group, domain: i.domain, url: i.url })) };
}
function loadAuth(raw) {
  const line = raw.split(/\r?\n/).find((s) => /^\s*DATAFORSEO_AUTH_B64\s*=/.test(s));
  const auth = line?.slice(line.indexOf("=") + 1).trim().replace(/^['"]|['"]$/g, "");
  if (!auth || !/^[A-Za-z0-9+/=]+$/.test(auth)) throw new Error("Protected DataForSEO authentication unavailable");
  return auth;
}
export async function runBatch(batch, output, { auth, fetcher = fetch } = {}) {
  batch = preflight(batch).batch;
  try { await access(output); throw new Error("Output already exists; do not repeat a potentially billed batch"); } catch (e) { if (e.code !== "ENOENT") throw e; }
  const report = { schema_version: 1, action: batch.action, action_source: batch.action_source, collected_at: new Date().toISOString(), market: "US", location_code: 2840, language_code: "en", budget: { batch_ceiling_usd: 0.5, cumulative_ceiling_usd: batch.cumulative_ceiling_usd, prior_spend_usd: batch.prior_spend_usd }, calls: [], keywords: [], serps: [], limitations: ["Provider estimates, not people or traffic forecasts", "Null metrics are unknown, not zero", "KD zero is not proof of easy ranking", "Monthly history can lag launches; seasonality is not trend proof", "No paid automatic retries; unknown outcomes require reconciliation"] };
  const save = async () => { await mkdir(dirname(output), { recursive: true }); await writeFile(output, JSON.stringify(report, null, 2) + "\n"); };
  await save();
  async function call(endpoint, payload, label) {
    const spent = report.calls.reduce((sum, c) => sum + (c.cost_usd || 0), 0);
    const reserve = endpoint.startsWith("dataforseo_labs/") ? 0.1 + payload.keywords.length * 0.0002 : 0.01;
    if (spent + reserve > batch.batch_ceiling_usd || batch.prior_spend_usd + spent + reserve > batch.cumulative_ceiling_usd) {
      report.stop_reason = "remaining-budget-headroom"; await save(); throw new Error("Remaining batch or cumulative budget cannot cover the next request");
    }
    const entry = { endpoint, label, status: "outcome-unknown", cost_usd: null };
    report.calls.push(entry); await save();
    let json;
    try {
      const response = await fetcher(`https://api.dataforseo.com/v3/${endpoint}`, { method: "POST", headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/json" }, body: JSON.stringify([payload]), signal: AbortSignal.timeout(60000) });
      if (!response.ok) throw new Error("API HTTP failure");
      json = await response.json();
      entry.status_code = json.tasks?.[0]?.status_code ?? json.status_code;
      entry.cost_usd = json.cost ?? null;
      entry.status = entry.status_code === 20000 ? "success" : "provider-failure";
      await save();
      if (entry.status !== "success" || !Number.isFinite(entry.cost_usd) || entry.cost_usd < 0) throw new Error("API result requires reconciliation");
      const actual = report.calls.reduce((sum, c) => sum + (c.cost_usd || 0), 0);
      if (actual > batch.batch_ceiling_usd || batch.prior_spend_usd + actual > batch.cumulative_ceiling_usd) { report.stop_reason = "reported-budget-exceeded-reconciliation-required"; await save(); throw new Error("Reported batch or cumulative budget exceeded; stopped"); }
      return json;
    } catch { await save(); throw new Error(`Stopped ${label}: see public-safe call status; no automatic paid retry`); }
  }
  const base = { location_code: 2840, language_code: "en" };
  report.keywords = keywordRows(await call("dataforseo_labs/google/keyword_overview/live", { ...base, keywords: batch.keywords, include_clickstream_data: false }, "keyword-overview"), batch.keywords); await save();
  for (const keyword of batch.serp_keywords) { report.serps.push(serpRows(await call("serp/google/organic/live/advanced", { ...base, keyword, depth: 10, device: "desktop", os: "windows" }, keyword), keyword)); await save(); }
  report.total_cost_usd = report.calls.reduce((sum, c) => sum + c.cost_usd, 0);
  report.completed_at = new Date().toISOString(); await save();
  return report;
}
// Cumulative paid spend across every saved receipt in a directory: the highest prior+billed total,
// with any call whose outcome is unknown counted at its conservative reserve (it may have billed).
export async function cumulativeSpend(dir) {
  const { readdir } = await import("node:fs/promises");
  let total = 0;
  for (const name of await readdir(dir)) {
    if (!name.endsWith(".json")) continue;
    let report;
    try { report = JSON.parse(await readFile(resolve(dir, name), "utf8")); } catch { continue; }
    const prior = report?.budget?.prior_spend_usd;
    if (!Number.isFinite(prior) || !Array.isArray(report.calls)) continue;
    const billed = report.calls.reduce((sum, c) => sum + (Number.isFinite(c?.cost_usd) ? c.cost_usd
      : String(c?.endpoint).startsWith("dataforseo_labs/") ? 0.14 : 0.01), 0);
    total = Math.max(total, prior + billed);
  }
  return total;
}
// Request mode (used by the DataForSEO GitHub workflow): a committed request file names the action and
// keywords; budget fields come from code and the receipt ledger, never from the request.
export async function requestBatch(request, researchDir) {
  if (!request || typeof request !== "object" || Array.isArray(request)) throw new Error("Invalid research request");
  for (const key of Object.keys(request)) if (!["action", "keywords", "serp_keywords", "purpose"].includes(key)) throw new Error(`Unexpected request field ${key}`);
  if (request.purpose !== undefined && (typeof request.purpose !== "string" || request.purpose.length > 300)) throw new Error("Request purpose must be a short string");
  return { action: request.action, keywords: request.keywords, serp_keywords: request.serp_keywords ?? [],
    prior_spend_usd: Math.max(await cumulativeSpend(researchDir), RECORDED_SPEND_FLOOR_USD), cumulative_ceiling_usd: APPROVED_CUMULATIVE_CEILING_USD, batch_ceiling_usd: 0.5 };
}
function envAuth() {
  const value = process.env.DATAFORSEO_AUTH_B64?.trim();
  return value ? loadAuth(`DATAFORSEO_AUTH_B64=${value}`) : null;
}
async function main() {
  const at = process.argv.indexOf("--request");
  if (at !== -1) {
    const requestPath = resolve(ROOT, process.argv[at + 1] ?? "");
    const name = requestPath.split("/").pop();
    if (!/^[a-z0-9-]+-20[0-9]{2}-[0-9]{2}-[0-9]{2}\.json$/.test(name)) throw new Error("Request file must be ops/research-requests/<topic>-YYYY-MM-DD.json");
    const researchDir = resolve(ROOT, "docs/research");
    const batch = await requestBatch(JSON.parse(await readFile(requestPath, "utf8")), researchDir);
    const reserved = validateBatch(batch);
    const output = resolve(researchDir, `dataforseo-${name}`);
    if (!process.argv.includes("--execute")) { console.log(JSON.stringify({ request: name, keywords: batch.keywords.length, serps: batch.serp_keywords.length, prior_spend_usd: batch.prior_spend_usd, conservative_reserved_usd: reserved, paid_calls: false })); return; }
    const auth = envAuth();
    if (!auth) throw new Error("DATAFORSEO_AUTH_B64 is not configured");
    const r = await runBatch(batch, output, { auth });
    console.log(JSON.stringify({ request: name, keywords: r.keywords.length, serps: r.serps.length, cost_usd: r.total_cost_usd }));
    return;
  }
  const batch = JSON.parse(await readFile(resolve(ROOT, "docs/research/family-expansion-keywords-2026-09-30.json"), "utf8"));
  batch.prior_spend_usd = Math.max(batch.prior_spend_usd, await cumulativeSpend(resolve(ROOT, "docs/research")), RECORDED_SPEND_FLOOR_USD);
  const reserved = validateBatch(batch);
  if (!process.argv.includes("--execute")) { console.log(JSON.stringify({ keywords: batch.keywords.length, serps: batch.serp_keywords.length, conservative_reserved_usd: reserved, paid_calls: false })); return; }
  const auth = envAuth() ?? loadAuth(await readFile(resolve(process.env.HOME, ".config/seo-lab/dataforseo.env"), "utf8"));
  const r = await runBatch(batch, resolve(ROOT, "docs/research/family-expansion-2026-09-30.json"), { auth });
  console.log(JSON.stringify({ keywords: r.keywords.length, serps: r.serps.length, cost_usd: r.total_cost_usd }));
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await main();
