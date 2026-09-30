import { readFile, writeFile, access, mkdir } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
const ROOT = fileURLToPath(new URL("../", import.meta.url));

export function validateBatch(batch) {
  if (!Number.isFinite(batch.prior_spend_usd) || batch.prior_spend_usd < 0 || batch.cumulative_ceiling_usd !== 5) throw new Error("Invalid authorized research budget");
  if (!Array.isArray(batch.keywords) || !batch.keywords.length || batch.keywords.length > 200 || batch.keywords.some((k) => typeof k !== "string" || !k.trim() || k.length > 120)) throw new Error("Invalid bounded keyword batch");
  if (new Set(batch.keywords).size !== batch.keywords.length) throw new Error("Duplicate keywords");
  if (!Array.isArray(batch.serp_keywords) || batch.serp_keywords.length > 12 || batch.serp_keywords.some((k) => !batch.keywords.includes(k))) throw new Error("Invalid SERP subset");
  // Conservative guard above the documented September17 observed prices; no clickstream/deeper SERPs.
  const reserved = 0.1 + batch.keywords.length * 0.0002 + batch.serp_keywords.length * 0.01;
  if (batch.batch_ceiling_usd !== 0.5 || batch.prior_spend_usd + reserved > batch.cumulative_ceiling_usd || reserved > batch.batch_ceiling_usd) throw new Error("Budget preflight failed");
  return reserved;
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
  validateBatch(batch);
  try { await access(output); throw new Error("Output already exists; do not repeat a potentially billed batch"); } catch (e) { if (e.code !== "ENOENT") throw e; }
  const report = { schema_version: 1, action: "FT-ACC-001", collected_at: new Date().toISOString(), market: "US", location_code: 2840, language_code: "en", budget: { batch_ceiling_usd: 0.5, cumulative_ceiling_usd: batch.cumulative_ceiling_usd, prior_spend_usd: batch.prior_spend_usd }, calls: [], keywords: [], serps: [], limitations: ["Provider estimates, not people or traffic forecasts", "Null metrics are unknown, not zero", "KD zero is not proof of easy ranking", "Monthly history can lag launches; seasonality is not trend proof", "No paid automatic retries; unknown outcomes require reconciliation"] };
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
async function main() {
  const batch = JSON.parse(await readFile(resolve(ROOT, "docs/research/family-expansion-keywords-2026-09-30.json"), "utf8"));
  const reserved = validateBatch(batch);
  if (!process.argv.includes("--execute")) { console.log(JSON.stringify({ keywords: batch.keywords.length, serps: batch.serp_keywords.length, conservative_reserved_usd: reserved, paid_calls: false })); return; }
  const auth = loadAuth(await readFile(resolve(process.env.HOME, ".config/seo-lab/dataforseo.env"), "utf8"));
  const r = await runBatch(batch, resolve(ROOT, "docs/research/family-expansion-2026-09-30.json"), { auth });
  console.log(JSON.stringify({ keywords: r.keywords.length, serps: r.serps.length, cost_usd: r.total_cost_usd }));
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await main();
