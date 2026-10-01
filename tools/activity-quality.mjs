import { readFile, writeFile, mkdir, access } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { activityEvidence, validateActivityEvidence } from "./activity-evidence.mjs";
import { activityPages } from "./page-generation/upgrade-page-data.mjs";
import { ageState, easternDate, requireNewOutput } from "./evidence-audit.mjs";
import { validDate } from "./hotel-evidence.mjs";

const ROOT = fileURLToPath(new URL("../", import.meta.url));

export function activityQualityReport(records, { today = easternDate(), expectedPages = Object.keys(activityPages).map((path) => `https://familytripwise.com/${path}`) } = {}) {
  if (!validDate(today)) throw new Error("Invalid activity report date");
  const errors = validateActivityEvidence(records);
  if (errors.length) throw new Error(errors.join("\n"));
  const pages = [...new Set(records.map((record) => record.page_url))].sort();
  if (new Set(expectedPages).size !== expectedPages.length || pages.some((page) => !expectedPages.includes(page))) throw new Error("Activity page coverage mismatch");
  const tasks = records.flatMap((record) => Object.entries(record.fields).map(([name, field]) => {
    const freshness = ageState(field.retained_on, name === "ticket_cost" ? 14 : 30, today);
    const reasons = name === "ticket_cost" ? ["exact-family-ticket-basis-unknown"] : name.endsWith("_check") ? ["verification-prompt-not-confirmed-fact"] : name === "venue" ? ["mixed-claim-provenance-needs-split"] : ["editorial-estimate-not-measured"];
    if (freshness.state === "future-date-review") reasons.push("future-model-date-review");
    else if (freshness.state === "review-due" && !["duration", "weather"].includes(name)) reasons.push("retained-source-model-review-due");
    return { id: `${record.id}-${name}`, name: record.name, page_url: record.page_url, field: name,
      priority: name === "ticket_cost" ? 1 : name.endsWith("_check") || name === "venue" ? 2 : 3,
      reasons, freshness, retained_on: field.retained_on, evidence_class: field.evidence_class, source_urls: [...field.source_urls], retained_value: structuredClone(field.value), limitation: field.limitation,
      next_step: name === "ticket_cost" ? "Choose exact visit date, ages, ticket plan and fees before quoting; preserve qualitative orientation meanwhile." : "Reconcile only the named family-task requirement from current sources; retain estimates/prompts and unknowns, no automatic public change." };
  })).sort((a, b) => a.priority - b.priority || a.id.localeCompare(b.id));
  return { schema_version: 1, as_of: today, scope: "activity-logistics-pilot-only", automatic_fact_renewal: false, automatic_publication: false,
    summary: { mapped_pages: pages.length, attractions: records.length, fields: tasks.length, unpriced_exact_visit_budgets: records.length, unmapped_activity_pages: expectedPages.length - pages.length },
    mapped_pages: pages, unmapped_pages: expectedPages.filter((page) => !pages.includes(page)).sort(), tasks,
    limitations: ["Retained source-model dates are not individual official-fact verification dates.", "Qualitative cost and duration/weather estimates remain interpretations; unknown numeric budget is not zero.", "Access/transport prompts do not establish current routes, stroller practicality, availability or safety.", "Only logisticsIndex entries are mapped; other activity pages, age routing, stay areas and itineraries remain separate contracts.", "Retrieval/hash success never renews these dates; native validity is not publishing authority."] };
}

export async function validateActivityPaths(records, root = ROOT) {
  const sitemap = await readFile(resolve(root, "site/sitemap.xml"), "utf8");
  const pages = new Set([...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]));
  for (const record of records) {
    if (!pages.has(record.page_url)) throw new Error("Activity page absent from sitemap");
    if (record.model_path !== "tools/page-generation/upgrade-page-data.mjs") throw new Error("Unsafe activity model path");
    await access(resolve(root, record.model_path));
  }
}

async function main() {
  const args = process.argv.slice(2);
  let today = easternDate(), output;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--date" && args[i + 1] && !args[i + 1].startsWith("--")) today = args[++i];
    else if (args[i] === "--output" && args[i + 1] && !args[i + 1].startsWith("--") && !output) output = args[++i];
    else throw new Error(`Unknown or incomplete activity option: ${args[i]}`);
  }
  if (output) await requireNewOutput(resolve(output));
  const records = activityEvidence();
  await validateActivityPaths(records);
  const report = activityQualityReport(records, { today });
  if (output) { const path = resolve(output); await mkdir(dirname(path), { recursive: true }); await writeFile(path, JSON.stringify(report, null, 2) + "\n", { flag: "wx" }); }
  console.log(JSON.stringify({ as_of: today, ...report.summary, output: output ?? null, public_changes: false }, null, 2));
}
if (import.meta.url === pathToFileURL(process.argv[1] || "").href) main().catch((error) => { console.error(error.message); process.exitCode = 1; });
