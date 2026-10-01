import { readFile, writeFile, mkdir, access } from "node:fs/promises";
import { resolve, dirname, sep } from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath, pathToFileURL } from "node:url";
import { findExpiredOperationalNotices, findYearlessOperationalNotices } from "./content-freshness.mjs";
import { hotelAuditRecords } from "./hotel-evidence.mjs";

const ROOT = fileURLToPath(new URL("../", import.meta.url));
const DAY = 86400000;
const hash = (text) => createHash("sha256").update(text).digest("hex");
export const easternDate = () => new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());

export async function requireNewOutput(path) {
  try { await access(path); } catch (error) { if (error.code === "ENOENT") return; throw error; }
  throw new Error("Audit output already exists; preserve evidence and select a new registered path");
}

export function modelRecords() {
  return hotelAuditRecords();
}

export function normalizedText(html) {
  return html.replace(/<(script|style|noscript)\b[^>]*>[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]*>/g, " ").replace(/&(?:nbsp|#160);/g, " ")
    .replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
}

export function ageState(date, interval, today) {
  if (!Number.isInteger(interval) || interval < 1 || !/^\d{4}-\d{2}-\d{2}$/.test(today) || !Number.isFinite(Date.parse(today)) || new Date(Date.parse(today)).toISOString().slice(0, 10) !== today) throw new Error("Invalid review interval or audit date");
  if (!date) return { state: "unknown", age_days: null, due_on: null };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || new Date(`${date}T00:00:00Z`).toISOString().slice(0, 10) !== date) throw new Error(`Invalid evidence date: ${date}`);
  const age = Math.floor((Date.parse(`${today}T00:00:00Z`) - Date.parse(`${date}T00:00:00Z`)) / DAY);
  if (age < 0) return { state: "future-date-review", age_days: age, due_on: null };
  return { state: age >= interval ? "review-due" : "within-review-interval", age_days: age, due_on: new Date(Date.parse(date) + interval * DAY).toISOString().slice(0, 10) };
}

export function permittedUrl(value, hosts) {
  const url = new URL(value);
  if (url.protocol !== "https:" || url.port || url.username || url.password || !hosts.includes(url.hostname)) throw new Error("Source outside explicit HTTPS host allowlist");
  if ([...url.searchParams.keys()].some((key) => /token|password|secret|api.?key|email|session/i.test(key))) throw new Error("Sensitive source parameters are not permitted");
  url.hash = "";
  return url.href;
}

export function sourceSignals(html, checks = []) {
  const text = normalizedText(html);
  const fields = checks.map((check) => ({ id: check.id, state: new RegExp(check.pattern, "i").test(text) ? "expected-text-present" : "expected-text-missing-review", evidence_class: "EXTRACTION_CANDIDATE" }));
  const offers = [];
  for (const match of html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      const visit = (value) => {
        if (!value || typeof value !== "object") return;
        if (value.price != null && value.priceCurrency && /Offer/.test(String(value["@type"]))) {
          const price = Number(value.price);
          if (Number.isFinite(price) && price >= 0) offers.push({ price, currency: String(value.priceCurrency).slice(0, 5), name: typeof value.name === "string" ? value.name.slice(0, 100) : null, room_party_dates_fees: "UNVERIFIED", evidence_class: "STRUCTURED_PRICE_CANDIDATE" });
        }
        for (const child of Object.values(value)) if (typeof child === "object") Array.isArray(child) ? child.forEach(visit) : visit(child);
      };
      visit(JSON.parse(match[1]));
    } catch { /* Malformed structured data remains untrusted. */ }
  }
  const candidates = offers.slice(0, 10);
  return { text_sha256: hash(text), price_sha256: hash(JSON.stringify(candidates)), text_length: text.length, fields, price_candidates: candidates };
}

export async function fetchSource(url, hosts, checks, { fetcher = fetch, timeout = 10000 } = {}) {
  try {
    let current = permittedUrl(url, hosts);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
    try {
      let response;
      for (let redirects = 0; redirects <= 4; redirects++) {
        response = await fetcher(current, { redirect: "manual", signal: controller.signal, headers: { "User-Agent": "FamilyTripwiseEvidenceAudit/1.0 (+https://familytripwise.com/about.html)" } });
        if (response.status >= 300 && response.status < 400) {
          const location = response.headers.get("location");
          await response.body?.cancel();
          if (!location) throw new Error("Redirect without location");
          current = permittedUrl(new URL(location, current).href, hosts);
          if (redirects === 4) throw new Error("Redirect limit");
          continue;
        }
        break;
      }
      const contentType = response.headers.get("content-type") || "";
      if (!response.ok) { await response.body?.cancel(); return { url, state: "unavailable-review", http_status: response.status }; }
      if (!/text\/html|application\/xhtml\+xml/i.test(contentType)) { await response.body?.cancel(); return { url, state: "unsupported-format-review", http_status: response.status, content_type: contentType }; }
      if (Number(response.headers.get("content-length")) > 3_000_000) { await response.body?.cancel(); return { url, state: "size-limit-review", http_status: response.status }; }
      const reader = response.body.getReader();
      const chunks = [];
      let size = 0;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        size += value.length;
        if (size > 3_000_000) { await reader.cancel(); return { url, state: "size-limit-review", http_status: response.status }; }
        chunks.push(value);
      }
      const html = Buffer.concat(chunks).toString("utf8");
      const signals = sourceSignals(html, checks);
      if (signals.text_length < 100 || /(?:captcha|access denied|verify you are human|just a moment)/i.test(signals.text_length < 3000 ? normalizedText(html) : "")) return { url, state: "challenge-or-empty-review", http_status: response.status };
      return { url, final_url: current, state: "retrieved-baseline", http_status: response.status, ...signals };
    } finally { clearTimeout(timer); }
  } catch (error) {
    return { url, state: "unavailable-review", error_kind: error.name === "AbortError" ? "timeout" : "fetch-or-policy-error" };
  }
}

export function compareSource(current, previous) {
  if (!current.text_sha256) return current;
  if (previous?.text_sha256 && (current.price_sha256 || hash(JSON.stringify(current.price_candidates || []))) !== (previous.price_sha256 || hash(JSON.stringify(previous.price_candidates || [])))) return { ...current, state: "structured-price-changed-review" };
  return { ...current, state: previous?.text_sha256 ? (previous.text_sha256 === current.text_sha256 ? "text-unchanged" : "text-changed-review") : "retrieved-baseline" };
}

export async function inventory(config, { root = ROOT, today = easternDate() } = {}) {
  if (!Array.isArray(config.allowed_hosts) || !Array.isArray(config.records)) throw new Error("Invalid audit registry");
  const sitemap = await readFile(resolve(root, "site/sitemap.xml"), "utf8");
  const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
  const pages = [];
  const sources = new Map();
  for (const url of urls) {
    const parsed = new URL(url);
    if (parsed.origin !== "https://familytripwise.com") throw new Error("Unexpected sitemap origin");
    const path = resolve(root, "site", decodeURIComponent(parsed.pathname === "/" ? "index.html" : parsed.pathname.slice(1)));
    if (!path.startsWith(resolve(root, "site") + sep)) throw new Error("Unsafe sitemap path");
    const html = await readFile(path, "utf8");
    const links = [...html.matchAll(/\bhref=["'](https:\/\/[^"']+)["']/g)].map((m) => m[1].replace(/&amp;/g, "&"));
    const approved = new Set();
    const excluded = new Set();
    for (const link of links) {
      try {
        const source = permittedUrl(link, config.allowed_hosts);
        if (new URL(source).hostname === "familytripwise.com") continue;
        approved.add(source);
        if (!sources.has(source)) sources.set(source, { url: source, pages: [] });
        if (!sources.get(source).pages.includes(url)) sources.get(source).pages.push(url);
      } catch { try { excluded.add(new URL(link).hostname); } catch { excluded.add("invalid-link"); } }
    }
    const records = (config.records || []).filter((r) => r.page_url === url).map((r) => ({ ...r, freshness: ageState(r.verified_on, r.interval_days, today) }));
    pages.push({ url, local_sha256: hash(html), source_count: approved.size, sources: [...approved], excluded_source_hosts: [...excluded], records, claim_registry: records.length ? "partial-field-coverage" : "unmapped-review", expired_notices: findExpiredOperationalNotices(html, { now: new Date(`${today}T12:00:00Z`) }), yearless_notice_count: findYearlessOperationalNotices(html).length });
  }
  for (const record of config.records || []) {
    if (!urls.includes(record.page_url)) throw new Error(`Registry page absent from sitemap: ${record.id}`);
    for (const url of record.source_urls || []) {
      const source = permittedUrl(url, config.allowed_hosts);
      if (!sources.has(source)) sources.set(source, { url: source, pages: [] });
      if (!sources.get(source).pages.includes(record.page_url)) sources.get(source).pages.push(record.page_url);
    }
  }
  return { pages, sources: [...sources.values()] };
}

export async function audit(config, { collect = false, previous = null, today, root = ROOT, limit = 250, fetcher = fetch } = {}) {
  config = { ...config, records: [...config.records, ...(config.include_shared_models ? modelRecords() : [])] };
  const started = Date.now();
  const inv = await inventory(config, { root, today });
  const prior = new Map((previous?.sources || []).map((s) => [s.url, s]));
  const results = new Array(inv.sources.length);
  let next = 0;
  // One request per host at a time, with four requests globally.
  const hostLocks = new Map();
  async function worker() {
    while (next < inv.sources.length) {
      const i = next++;
      const source = inv.sources[i];
      const old = prior.get(source.url);
      if (old && ([401, 403].includes(old.http_status) || old.state === "challenge-or-empty-review" || old.state === "access-denied-carried-forward")) {
        results[i] = { ...source, state: "access-denied-carried-forward", http_status: old.http_status, last_attempt_at: old.last_attempt_at || previous.collected_at, reason: "No unchanged denial retry; owner must resolve permitted access before a new baseline" };
        continue;
      }
      if (!collect || i >= limit) { results[i] = old ? { ...old, ...source, collection_deferred: true, last_attempt_at: old.last_attempt_at || (old.http_status || old.text_sha256 ? previous.collected_at : null) } : { ...source, state: collect ? "deferred-limit" : "not-fetched" }; continue; }
      const host = new URL(source.url).hostname;
      const before = hostLocks.get(host) || Promise.resolve();
      let unlock;
      hostLocks.set(host, new Promise((done) => { unlock = done; }));
      await before;
      try {
        const checks = config.records.filter((r) => r.source_urls?.includes(source.url) && r.pattern).map((r) => ({ id: r.id, pattern: r.pattern }));
        results[i] = { ...source, ...compareSource(await fetchSource(source.url, config.allowed_hosts, checks, { fetcher }), old), last_attempt_at: new Date().toISOString() };
      } finally { unlock(); }
    }
  }
  await Promise.all(Array.from({ length: 4 }, worker));
  return { schema_version: 1, collected_at: new Date().toISOString(), mode: collect ? "public-source-diff" : "local-inventory", elapsed_seconds: Math.round((Date.now() - started) / 1000), factual_dates_renewed: false, pages: inv.pages, sources: results, summary: { canonical_pages: inv.pages.length, sources: results.length, source_states: results.reduce((a, s) => { a[s.state] = (a[s.state] || 0) + 1; return a; }, {}), due_records: inv.pages.flatMap((p) => p.records).filter((r) => r.freshness.state === "review-due").length, unmapped_pages: inv.pages.filter((p) => p.claim_registry === "unmapped-review").length } };
}

async function main() {
  const args = process.argv.slice(2);
  const value = (name, fallback) => args.includes(name) ? args[args.indexOf(name) + 1] : fallback;
  const config = JSON.parse(await readFile(resolve(ROOT, "ops/evidence-watch.json"), "utf8"));
  const previous = value("--previous", null);
  const limit = Number(value("--limit", 250));
  if (!Number.isInteger(limit) || limit < 1 || limit > 500) throw new Error("--limit must be 1-500");
  const output = value("--output", null);
  if (output) await requireNewOutput(resolve(output));
  const result = await audit(config, { collect: args.includes("--collect"), previous: previous ? JSON.parse(await readFile(previous, "utf8")) : null, today: value("--date", easternDate()), limit });
  if (output) { await mkdir(dirname(resolve(output)), { recursive: true }); await writeFile(output, JSON.stringify(result, null, 2) + "\n", { flag: "wx" }); }
  console.log(JSON.stringify({ ...result.summary, elapsed_seconds: result.elapsed_seconds, output }, null, 2));
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await main();
