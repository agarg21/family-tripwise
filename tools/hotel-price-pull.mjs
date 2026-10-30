// QUEUE G12: dated Google Hotels price observations for a named family party, via DataForSEO
// (business_data/google/hotel_searches/live). Run only by the "DataForSEO research" workflow with the
// DATAFORSEO_AUTH_B64 secret (OWNER D8, widened to hotel price checks by D20); the operator never sees it.
// A receipt is a dated provider observation, never a booking quote: the provider does not state whether
// `price` is per night or for the stay, or which taxes and fees it includes, so receipts say so and pages
// must label any figure built from them "estimate" with party, dates and observation date.
import { readFile, writeFile, access, mkdir } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { cumulativeSpend, RECORDED_SPEND_FLOOR_USD, APPROVED_CUMULATIVE_CEILING_USD } from "./seo-opportunity-pull.mjs";

const ROOT = fileURLToPath(new URL("../", import.meta.url));
export const ENDPOINT = "business_data/google/hotel_searches/live";
export const BATCH_CEILING_USD = 0.5;
// Conservative per-search reserve (provider bills per 18 results; depth is fixed at 18).
export const RESERVE_PER_SEARCH_USD = 0.05;
export const MAX_SEARCHES = 8;
const DATE = /^20[0-9]{2}-[0-9]{2}-[0-9]{2}$/;
const COORD = /^-?[0-9]{1,2}(?:\.[0-9]{1,7})?,-?[0-9]{1,3}(?:\.[0-9]{1,7})?$/;
const LABEL = /^[a-z0-9][a-z0-9-]{0,59}$/;
const LIMITATIONS = Object.freeze([
  "Google Hotels listing prices collected by DataForSEO for the stated party and dates; not booking quotes and not checked on the hotel's own site",
  "The provider does not state whether price is per night or for the whole stay; compare a 1-night and a multi-night search of the same hotel before using it",
  "Taxes, resort fees and other mandatory charges may or may not be included; treat them as unknown",
  "Null prices are unknown, not free; a listing can change within minutes",
  "No paid automatic retries; unknown outcomes require reconciliation",
]);

function isDate(s) {
  if (typeof s !== "string" || !DATE.test(s)) return false;
  const d = new Date(`${s}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s;
}
const nights = (a, b) => Math.round((Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / 86400000);

function search(raw, today) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) throw new Error("Invalid hotel search");
  for (const key of Object.keys(raw)) if (!["label", "keyword", "location_coordinate", "check_in", "check_out", "adults", "children", "match"].includes(key)) throw new Error(`Unexpected hotel search field ${key}`);
  const { label, keyword, location_coordinate, check_in, check_out, adults, children = [], match } = raw;
  if (typeof label !== "string" || !LABEL.test(label)) throw new Error("Invalid search label");
  if (typeof keyword !== "string" || !keyword.trim() || keyword !== keyword.trim() || keyword.length > 120) throw new Error("Invalid search keyword");
  if (typeof location_coordinate !== "string" || !COORD.test(location_coordinate)) throw new Error("Invalid location coordinate");
  if (!isDate(check_in) || !isDate(check_out)) throw new Error("Invalid stay dates");
  if (check_in < today) throw new Error("Check-in is in the past");
  const n = nights(check_in, check_out);
  if (n < 1 || n > 30) throw new Error("Stay must be 1 to 30 nights");
  if (!Number.isInteger(adults) || adults < 1 || adults > 4) throw new Error("Invalid adults");
  if (!Array.isArray(children) || children.length > 4 || children.some((a) => !Number.isInteger(a) || a < 0 || a > 17)) throw new Error("Invalid child ages");
  if (adults + children.length > 6) throw new Error("Party too large");
  if (typeof match !== "string" || !match.trim() || match.length > 60) throw new Error("Each search needs a short title match");
  return Object.freeze({ label, keyword, location_coordinate, check_in, check_out, nights: n, adults, children: Object.freeze([...children]), match });
}

// Validates a committed request file. Budget fields come from code and the receipt ledger, never the request.
export function validateRequest(request, { today, priorSpend }) {
  if (!request || typeof request !== "object" || Array.isArray(request)) throw new Error("Invalid hotel price request");
  for (const key of Object.keys(request)) if (!["action", "purpose", "hotel_searches"].includes(key)) throw new Error(`Unexpected request field ${key}`);
  if (typeof request.action !== "string" || !/^[GQ][0-9]{2,3}[a-z]?$/.test(request.action)) throw new Error("Invalid action ID");
  if (request.purpose !== undefined && (typeof request.purpose !== "string" || request.purpose.length > 300)) throw new Error("Request purpose must be a short string");
  if (!Array.isArray(request.hotel_searches) || !request.hotel_searches.length || request.hotel_searches.length > MAX_SEARCHES) throw new Error(`Between 1 and ${MAX_SEARCHES} hotel searches`);
  const searches = Object.freeze(request.hotel_searches.map((s) => search(s, today)));
  if (new Set(searches.map((s) => s.label)).size !== searches.length) throw new Error("Duplicate search labels");
  if (!Number.isFinite(priorSpend) || priorSpend < 0) throw new Error("Invalid prior spend");
  const reserved = searches.length * RESERVE_PER_SEARCH_USD;
  if (reserved > BATCH_CEILING_USD || priorSpend + reserved > APPROVED_CUMULATIVE_CEILING_USD) throw new Error("Budget preflight failed");
  return { action: request.action, purpose: request.purpose ?? null, searches, prior_spend_usd: priorSpend, reserved };
}

const num = (v) => (typeof v === "number" && Number.isFinite(v) && v >= 0 ? v : null);
const str = (v, max = 80) => (typeof v === "string" && v.trim() ? v.trim().slice(0, max) : null);
export function hotelRows(json) {
  const result = json?.tasks?.[0]?.result?.[0] || {};
  const rows = (Array.isArray(result.items) ? result.items : []).filter((i) => i?.type === "hotel_search_item").slice(0, 18).map((i) => {
    const p = i.prices || {};
    return { title: str(i.title, 120), stars: num(i.stars), is_paid: i.is_paid === true, price: num(p.price), price_without_discount: num(p.price_without_discount),
      currency: str(p.currency, 3), discount_text: str(p.discount_text), visitors: num(p.visitors), check_in: str(p.check_in, 30), check_out: str(p.check_out, 30) };
  });
  return { checked_at: str(result.datetime, 40), rows };
}

export async function runRequest(req, output, { auth, fetcher = fetch, now = () => new Date() } = {}) {
  try { await access(output); throw new Error("Output already exists; do not repeat a potentially billed batch"); } catch (e) { if (e.code !== "ENOENT") throw e; }
  const report = { schema_version: 1, kind: "hotel-prices", action: req.action, purpose: req.purpose, collected_at: now().toISOString(), provider: "DataForSEO Google Hotels", endpoint: ENDPOINT,
    budget: { batch_ceiling_usd: BATCH_CEILING_USD, cumulative_ceiling_usd: APPROVED_CUMULATIVE_CEILING_USD, prior_spend_usd: req.prior_spend_usd }, calls: [], searches: [], limitations: LIMITATIONS };
  const save = async () => { await mkdir(dirname(output), { recursive: true }); await writeFile(output, JSON.stringify(report, null, 2) + "\n"); };
  await save();
  for (const s of req.searches) {
    const spent = report.calls.reduce((sum, c) => sum + (c.cost_usd ?? RESERVE_PER_SEARCH_USD), 0);
    if (spent + RESERVE_PER_SEARCH_USD > BATCH_CEILING_USD || req.prior_spend_usd + spent + RESERVE_PER_SEARCH_USD > APPROVED_CUMULATIVE_CEILING_USD) {
      report.stop_reason = "remaining-budget-headroom"; await save(); throw new Error("Remaining budget cannot cover the next search");
    }
    const entry = { endpoint: ENDPOINT, label: s.label, status: "outcome-unknown", cost_usd: null };
    report.calls.push(entry); await save();
    const payload = { keyword: s.keyword, location_coordinate: s.location_coordinate, language_code: "en", check_in: s.check_in, check_out: s.check_out,
      currency: "USD", adults: s.adults, children: [...s.children], depth: 18, sort_by: "relevance", tag: s.label };
    try {
      const response = await fetcher(`https://api.dataforseo.com/v3/${ENDPOINT}`, { method: "POST", headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/json" }, body: JSON.stringify([payload]), signal: AbortSignal.timeout(90000) });
      if (!response.ok) throw new Error("API HTTP failure");
      const json = await response.json();
      entry.status_code = json.tasks?.[0]?.status_code ?? json.status_code;
      entry.cost_usd = Number.isFinite(json.cost) && json.cost >= 0 ? json.cost : null;
      entry.status = entry.status_code === 20000 && entry.cost_usd !== null ? "success" : "provider-failure";
      await save();
      if (entry.status !== "success") throw new Error("API result requires reconciliation");
      const actual = report.calls.reduce((sum, c) => sum + (c.cost_usd ?? RESERVE_PER_SEARCH_USD), 0);
      if (actual > BATCH_CEILING_USD || req.prior_spend_usd + actual > APPROVED_CUMULATIVE_CEILING_USD) { report.stop_reason = "reported-budget-exceeded-reconciliation-required"; await save(); throw new Error("Reported budget exceeded"); }
      const { checked_at, rows } = hotelRows(json);
      const m = s.match.toLowerCase();
      report.searches.push({ label: s.label, party: { adults: s.adults, child_ages: [...s.children] }, check_in: s.check_in, check_out: s.check_out, nights: s.nights, keyword: s.keyword,
        location_coordinate: s.location_coordinate, currency_requested: "USD", checked_at, match: s.match, matched: rows.filter((r) => r.title?.toLowerCase().includes(m)), results: rows });
      await save();
    } catch { await save(); throw new Error(`Stopped ${s.label}: see public-safe call status; no automatic paid retry`); }
  }
  report.total_cost_usd = report.calls.reduce((sum, c) => sum + c.cost_usd, 0);
  report.completed_at = now().toISOString(); await save();
  return report;
}

async function main() {
  const at = process.argv.indexOf("--request");
  if (at === -1) throw new Error("Usage: node tools/hotel-price-pull.mjs --request ops/research-requests/<topic>-YYYY-MM-DD.json [--execute]");
  const requestPath = resolve(ROOT, process.argv[at + 1] ?? "");
  const name = requestPath.split("/").pop();
  if (!/^[a-z0-9-]+-20[0-9]{2}-[0-9]{2}-[0-9]{2}\.json$/.test(name)) throw new Error("Request file must be ops/research-requests/<topic>-YYYY-MM-DD.json");
  const researchDir = resolve(ROOT, "docs/research");
  const priorSpend = Math.max(await cumulativeSpend(researchDir), RECORDED_SPEND_FLOOR_USD);
  const req = validateRequest(JSON.parse(await readFile(requestPath, "utf8")), { today: new Date().toISOString().slice(0, 10), priorSpend });
  const output = resolve(researchDir, `dataforseo-${name}`);
  if (!process.argv.includes("--execute")) { console.log(JSON.stringify({ request: name, searches: req.searches.length, prior_spend_usd: priorSpend, conservative_reserved_usd: req.reserved, paid_calls: false })); return; }
  const auth = process.env.DATAFORSEO_AUTH_B64?.trim();
  if (!auth || !/^[A-Za-z0-9+/=]+$/.test(auth)) throw new Error("DATAFORSEO_AUTH_B64 is not configured");
  const r = await runRequest(req, output, { auth });
  console.log(JSON.stringify({ request: name, searches: r.searches.length, cost_usd: r.total_cost_usd }));
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await main();
