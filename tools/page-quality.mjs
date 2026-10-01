import { readFile, writeFile, mkdir, access } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { hotelEvidence, validateHotelEvidence, validDate } from "./hotel-evidence.mjs";
import { ageState, easternDate, requireNewOutput } from "./evidence-audit.mjs";

const ROOT = fileURLToPath(new URL("../", import.meta.url));

export function qualityReport(records, { today = easternDate() } = {}) {
  if (!validDate(today)) throw new Error("Invalid report date");
  const errors = validateHotelEvidence(records);
  if (errors.length) throw new Error(errors.join("\n"));
  const tasks = [];
  const pages = new Map();
  for (const r of records) {
    if (!pages.has(r.page_url)) pages.set(r.page_url, { url: r.page_url, hotels: 0, issues: 0, state: "no-machine-detected-gaps-not-publication-approval" });
    pages.get(r.page_url).hotels++;
    for (const [name, f] of Object.entries(r.fields)) {
      const reasons = [];
      const interval = name === "price" || name === "fees" ? 14 : name === "review_signal" ? 60 : 30;
      const freshness = ageState(f.observed_on, interval, today);
      if (f.state !== "known") reasons.push(f.state);
      if (!f.source_urls.length) reasons.push("source-mapping-needed");
      if (f.date_basis === "model-baseline") reasons.push("individual-claim-date-needed");
      if (freshness.state !== "within-review-interval") reasons.push(freshness.state);
      if (name === "price" && f.value && !f.value.structured_basis) reasons.push("structured-room-party-stay-basis-needed");
      if (name === "price" && f.value?.basis_unknowns?.length) reasons.push("price-basis-unknowns-remain");
      if (!reasons.length) continue;
      tasks.push({ id: `${r.id}-${name}`, hotel: r.hotel, page_url: r.page_url, field: name,
        priority: f.state === "disputed" ? 1 : name === "price" || name === "fees" ? 2 : 3,
        reasons, freshness, evidence_class: f.evidence_class, evidence_path: f.evidence_path, model_path: r.model_path,
        source_urls: f.source_urls, ...(f.source_refs ? { source_refs: f.source_refs } : {}), retained_value: f.value, limitation: f.limitation,
        next_step: f.state === "disputed" ? "Reconcile cited conflict; preserve uncertainty until resolved." : "Inspect the cited record/sources, normalize only supported fields, retain historical prices and explicit unknowns; review before public change." });
      pages.get(r.page_url).issues++;
      pages.get(r.page_url).state = "standardization-or-evidence-review-needed";
    }
  }
  tasks.sort((a, b) => a.priority - b.priority || a.page_url.localeCompare(b.page_url) || a.id.localeCompare(b.id));
  return { schema_version: 1, as_of: today, scope: "hotel-comparison-records-only", automatic_fact_renewal: false, automatic_publication: false,
    summary: { pages: pages.size, hotels: records.length, fields: records.length * 6, review_tasks: tasks.length,
      conflicts: tasks.filter((t) => t.reasons.includes("disputed")).length,
      price_gaps: tasks.filter((t) => t.field === "price" && t.reasons.includes("unknown")).length,
      due_price_records: tasks.filter((t) => t.field === "price" && t.freshness.state === "review-due").length,
      unstructured_price_basis: tasks.filter((t) => t.reasons.includes("structured-room-party-stay-basis-needed")).length,
      source_mapped_fields: records.flatMap((r) => Object.values(r.fields)).filter((f) => f.source_refs?.length).length },
    pages: [...pages.values()], tasks,
    remaining_gates: ["Page-specific distinct user job and current SEO evidence", "Named family task and desktop/mobile proxy walkthrough", "Claim/price reconciliation and evidence-class limits", "Native QA and independent read-only review", "Authorized scope and verified release"],
    limitations: ["Legacy facts are unmapped, not absent or incorrect.", "Shared baseline dates are not per-claim verification.", "No gap or age flag authorizes a rewrite, removal of historical prices, or observation-window reset.", "Activities/itineraries/stay-area pages remain outside this hotel contract; the separate source audit inventories all canonical pages."] };
}

export async function validateCatalogPaths(records, root = ROOT) {
  const sitemap = await readFile(resolve(root, "site/sitemap.xml"), "utf8");
  const urls = new Set([...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]));
  for (const r of records) {
    if (!urls.has(r.page_url)) throw new Error(`Page not in sitemap: ${r.page_url}`);
    for (const path of [r.model_path, ...Object.values(r.fields).flatMap((f) => [f.evidence_path, ...(f.source_refs || []).map((ref) => ref.evidence_path)])]) {
      if (!/^(?:tools|src|docs)\//.test(path) || path.split("/").includes("..")) throw new Error("Unsafe evidence path");
      await access(resolve(root, path));
    }
  }
}

async function main() {
  const args = process.argv.slice(2);
  let today = easternDate(), output;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--date" && args[i + 1]) today = args[++i];
    else if (args[i] === "--output" && args[i + 1]) output = args[++i];
    else throw new Error(`Unknown or incomplete option: ${args[i]}`);
  }
  if (output) await requireNewOutput(resolve(output));
  const records = hotelEvidence();
  await validateCatalogPaths(records);
  const report = qualityReport(records, { today });
  if (output) { const path = resolve(output); await mkdir(dirname(path), { recursive: true }); await writeFile(path, JSON.stringify(report, null, 2) + "\n", { flag: "wx" }); }
  console.log(JSON.stringify({ as_of: today, ...report.summary, output: output ?? null, public_changes: false }, null, 2));
}

if (import.meta.url === pathToFileURL(process.argv[1] || "").href) main().catch((error) => { console.error(error.message); process.exitCode = 1; });
