import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { hotelEvidence, validDate } from "./hotel-evidence.mjs";
import { qualityReport, validateCatalogPaths } from "./page-quality.mjs";
import { activityEvidence, vegasActivityEvidence } from "./activity-evidence.mjs";
import { activityQualityReport, validateActivityPaths } from "./activity-quality.mjs";
import { activityCardEvidence, activityCardQualityReport, validateActivityCardPaths } from "./activity-card-quality.mjs";
import { planningPageEvidence, planningPageQualityReport } from "./planning-page-evidence.mjs";
import { audit, ageState, easternDate, modelRecords, permittedUrl, requireNewOutput } from "./evidence-audit.mjs";
import { reviewAudit } from "./weekly-evidence-review.mjs";
import { dcPath, dcPack, dcPrices } from "./page-generation/washington-dc-family-hotels-page.mjs";
import { screenRoomPack } from "./family-room-task.mjs";

const ROOT = fileURLToPath(new URL("../", import.meta.url));
const UTILITY = ["https://familytripwise.com/", "https://familytripwise.com/about.html", "https://familytripwise.com/contributors/miles-rowan.html"];

export function validateCoverage(urls, groups) {
  if (!Array.isArray(urls) || new Set(urls).size !== urls.length) throw new Error("Invalid or duplicate canonical inventory");
  const owners = new Map();
  for (const [contract, pages] of Object.entries(groups)) for (const url of pages) {
    if (owners.has(url)) throw new Error(`Multiple maintenance owners: ${url}`);
    owners.set(url, contract);
  }
  if (owners.size !== urls.length || urls.some(url => !owners.has(url)) || [...owners.keys()].some(url => !urls.includes(url))) throw new Error("Unclassified or missing canonical page; add a reviewed maintenance contract");
  return urls.map(url => ({ url, contract: owners.get(url), applicability: owners.get(url) === "utility" ? "travel-decision-records-not-applicable" : "decision-records-covered-not-facts-verified" }));
}

export async function maintenanceReport({ root = ROOT, today = easternDate() } = {}) {
  if (!validDate(today)) throw new Error("Invalid maintenance date");
  const hotels = hotelEvidence(), activities = [...activityEvidence(), ...vegasActivityEvidence()], cards = activityCardEvidence(), planning = planningPageEvidence();
  await validateCatalogPaths(hotels, root);
  await validateActivityPaths(activities, root);
  await validateActivityCardPaths(cards, root);
  const sitemap = await readFile(resolve(root, "site/sitemap.xml"), "utf8");
  const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]);
  const groups = { hotel: [...new Set(hotels.map(record => record.page_url))], "activity-logistics": [...new Set(activities.map(record => record.page_url))], "activity-cards": cards.map(page => page.page_url), utility: UTILITY };
  groups["exact-room-comparison"] = [`https://familytripwise.com/${dcPath}`];
  const dc = screenRoomPack(dcPack, dcPack.scenario, today, dcPrices);
  for (const page of planning) (groups[page.type] ||= []).push(page.page_url);
  const pages = validateCoverage(urls, groups);
  for (const page of pages) {
    const url = new URL(page.url);
    if (url.origin !== "https://familytripwise.com" || url.search || url.hash) throw new Error("Unsafe canonical URL");
    await readFile(resolve(root, "site", url.pathname === "/" ? "index.html" : url.pathname.slice(1)), "utf8");
  }
  const reports = { hotel: qualityReport(hotels, { today }), activity: activityQualityReport(activities, { today }), cards: activityCardQualityReport(cards, { today }), planning: planningPageQualityReport(planning, { today }) };
  return { schema_version: 1, as_of: today, mode: "offline-maintenance-coverage", automatic_fact_renewal: false, automatic_publication: false,
    summary: { canonical_pages: pages.length, travel_pages: pages.filter(page => page.contract !== "utility").length, utility_pages: UTILITY.length, unclassified_pages: 0, contract_pages: Object.fromEntries(Object.entries(groups).map(([type, members]) => [type, members.length])),
      hotel_price_basis_gaps: reports.hotel.summary.unstructured_price_basis, hotel_due_price_records: reports.hotel.summary.due_price_records,
      activity_card_atomic_source_gaps: reports.cards.summary.atomic_source_gaps, planning_unmapped_decision_fields: reports.planning.summary.unmapped_decision_fields, planning_missing_page_source_notes: reports.planning.summary.missing_page_source_notes },
    pages, contract_summaries: Object.fromEntries(Object.entries(reports).map(([type, report]) => [type, report.summary])), planning_pages: reports.planning.pages,
    exact_room_comparisons: [{ page_url: `https://familytripwise.com/${dcPath}`, model_path: "tools/page-generation/washington-dc-family-hotels-page.mjs", records: dc.map(room => ({ id: room.id, category: room.category, category_age: ageState(room.checked_on, dcPack.refresh_days, today), price_observed_on: room.price.observed_on, price_age: ageState(room.price.observed_on, 14, today), price_status: room.price.status, next_checks: room.next_checks })), limitation: "Scoped room and dated-price ownership, not all atomic facts verified; unknown child-age/fee/rest claims remain unresolved. No automatic source renewal or publication." }],
    review_priorities: ["Reconcile current source conflicts and expired operational notices before aesthetic edits.", "Retain approximate nightly bands and their basis; research missing/stale room-party-date-fee observations first.", "Use source diffs only to queue named claim checks; never renew observations from hashes or retrieval success.", "Map age, access, weather and reset constraints without promoting them to safety or firsthand assurances."],
    limitations: ["Framework coverage is not atomic fact completeness or a fresh-publication certificate.", "Utility pages have an explicit non-travel classification, not invented destination records.", "The compact report references existing native adapters; run their detailed reports to inspect retained values and tasks.", "No public page, estimate, observation date or URL-specific measurement window is changed by this command.", "Weekly stability requires the next actual weekly run and claim reconciliation, not a same-day fixture or repeat."] };
}

export function validatePriorAudit(previous, allowedHosts) {
  const timestamp = value => typeof value === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value) && Number.isFinite(Date.parse(value)) && new Date(value).toISOString() === value;
  const dense = value => Array.isArray(value) && Array.from({ length: value.length }, (_, index) => Object.hasOwn(value, index)).every(Boolean);
  if (previous?.schema_version !== 1 || previous.mode !== "public-source-diff" || previous.factual_dates_renewed !== false || !timestamp(previous.collected_at) || !dense(previous.pages) || !previous.pages.length || !dense(previous.sources) || !previous.sources.length || previous.summary?.canonical_pages !== previous.pages.length || previous.summary?.sources !== previous.sources.length) throw new Error("Invalid or incomplete prior source audit");
  const pageUrls = previous.pages.map(page => page?.url);
  if (pageUrls.some(url => { try { const parsed = new URL(url); return parsed.origin !== "https://familytripwise.com" || parsed.search || parsed.hash; } catch { return true; } })) throw new Error("Invalid prior canonical identity");
  const states = new Set(["text-changed-review", "structured-price-changed-review", "text-unchanged", "retrieved-baseline", "unavailable-review", "challenge-or-empty-review", "unsupported-format-review", "size-limit-review", "access-denied-carried-forward", "deferred-limit", "not-fetched"]);
  const sourceKeys = new Set(["url", "pages", "final_url", "state", "http_status", "text_sha256", "price_sha256", "text_length", "fields", "price_candidates", "last_attempt_at", "reason", "content_type", "error_kind", "collection_deferred"]);
  for (const source of previous.sources) {
    if (!source || Object.keys(source).some(key => !sourceKeys.has(key)) || !states.has(source.state) || !dense(source.pages) || !source.pages.length || new Set(source.pages).size !== source.pages.length || source.pages.some(url => !pageUrls.includes(url))) throw new Error("Invalid prior source record");
    permittedUrl(source.url, allowedHosts);
    if (source.final_url) permittedUrl(source.final_url, allowedHosts);
    if (source.last_attempt_at !== undefined && source.last_attempt_at !== null && (!timestamp(source.last_attempt_at) || Date.parse(source.last_attempt_at) > Date.parse(previous.collected_at))) throw new Error("Invalid prior attempt timestamp");
    for (const key of ["text_sha256", "price_sha256"]) if (source[key] !== undefined && !/^[a-f0-9]{64}$/.test(source[key])) throw new Error("Invalid prior source hash");
    const exactKeys = (value, keys) => value && !Array.isArray(value) && typeof value === "object" && Object.keys(value).length === keys.length && keys.every(key => Object.hasOwn(value, key));
    if (Object.hasOwn(source, "fields") && (!dense(source.fields) || source.fields.some(field => !exactKeys(field, ["id", "state", "evidence_class"]) || typeof field.id !== "string" || !field.id.length || !["expected-text-present", "expected-text-missing-review"].includes(field.state) || field.evidence_class !== "EXTRACTION_CANDIDATE"))) throw new Error("Invalid prior extraction fields");
    if (Object.hasOwn(source, "price_candidates") && (!dense(source.price_candidates) || source.price_candidates.length > 10 || source.price_candidates.some(candidate => !exactKeys(candidate, ["price", "currency", "name", "room_party_dates_fees", "evidence_class"]) || typeof candidate.price !== "number" || !Number.isFinite(candidate.price) || candidate.price < 0 || typeof candidate.currency !== "string" || !candidate.currency.length || candidate.currency.length > 5 || !(candidate.name === null || (typeof candidate.name === "string" && candidate.name.length <= 100)) || candidate.room_party_dates_fees !== "UNVERIFIED" || candidate.evidence_class !== "STRUCTURED_PRICE_CANDIDATE"))) throw new Error("Invalid prior structured price candidates");
  }
  // Reuse identity and required-source checks before any collection can occur.
  reviewAudit(previous, { sources: [], collected_at: previous.collected_at }, { expectedUrls: pageUrls });
}

export async function maintenanceCycle({ root = ROOT, today = easternDate(), collect = false, previous = null, limit = 500, fetcher = fetch } = {}) {
  if (!Number.isInteger(limit) || limit < 1 || limit > 500) throw new Error("Source limit must be 1-500");
  let config;
  if (collect) {
    config = JSON.parse(await readFile(resolve(root, "ops/evidence-watch.json"), "utf8"));
    validatePriorAudit(previous, config.allowed_hosts);
  }
  const report = await maintenanceReport({ root, today });
  if (!collect) return { report, source_audit: null, source_review: null };
  const current = await audit(config, { root, today, collect, previous, limit, fetcher });
  const review = reviewAudit(current, previous, { expectedRecords: modelRecords(), expectedUrls: report.pages.map(page => page.url) });
  return { report, source_audit: current, source_review: review };
}

export function maintenanceOptions(args) {
  const options = { today: easternDate(), collect: false, limit: 500 };
  const names = { "--date": "today", "--output": "output", "--previous": "previousPath", "--audit-output": "auditOutput", "--review-output": "reviewOutput", "--limit": "limit" };
  const seen = new Set();
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (seen.has(arg)) throw new Error(`Duplicate maintenance option: ${arg}`);
    seen.add(arg);
    if (arg === "--collect") options.collect = true;
    else if (names[arg] && args[i + 1] && !args[i + 1].startsWith("--")) options[names[arg]] = args[++i];
    else throw new Error(`Unknown or incomplete maintenance option: ${arg}`);
  }
  options.limit = Number(options.limit);
  if (!validDate(options.today) || !Number.isInteger(options.limit) || options.limit < 1 || options.limit > 500) throw new Error("Invalid maintenance date/limit");
  if (options.collect && (!options.output || !options.previousPath || !options.auditOutput || !options.reviewOutput)) throw new Error("Collection requires new report/audit/review outputs and --previous");
  if (!options.collect && (options.previousPath || options.auditOutput || options.reviewOutput || seen.has("--limit"))) throw new Error("Source options require explicit --collect");
  const outputs = [options.output, options.auditOutput, options.reviewOutput].filter(Boolean).map(path => resolve(path));
  if (new Set(outputs).size !== outputs.length || (options.previousPath && outputs.includes(resolve(options.previousPath)))) throw new Error("Output paths must be distinct and cannot replace the prior audit");
  return options;
}

async function main() {
  const options = maintenanceOptions(process.argv.slice(2));
  for (const path of [options.output, options.auditOutput, options.reviewOutput].filter(Boolean)) await requireNewOutput(resolve(path));
  const previous = options.previousPath ? JSON.parse(await readFile(options.previousPath, "utf8")) : null;
  const results = await maintenanceCycle({ ...options, previous });
  for (const [path, value] of [[options.output, results.report], [options.auditOutput, results.source_audit], [options.reviewOutput, results.source_review]]) if (path) {
    await mkdir(dirname(resolve(path)), { recursive: true });
    await writeFile(resolve(path), JSON.stringify(value, null, 2) + "\n", { flag: "wx" });
  }
  console.log(JSON.stringify({ ...results.report.summary, source_review: results.source_review?.summary || null, public_changes: false, output: options.output || null }, null, 2));
}
if (import.meta.url === pathToFileURL(process.argv[1] || "").href) main().catch(error => { console.error(error.message); process.exitCode = 1; });
