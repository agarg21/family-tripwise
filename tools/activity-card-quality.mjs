import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { activityPages } from "./page-generation/upgrade-page-data.mjs";
import { ageState, easternDate, requireNewOutput } from "./evidence-audit.mjs";
import { validDate } from "./hotel-evidence.mjs";

const ROOT = fileURLToPath(new URL("../", import.meta.url));
const MODEL = "tools/page-generation/upgrade-page-data.mjs";
const PROFILES = Object.freeze({
  "things-to-do/san-antonio-with-kids.html": ["2026-07-26", "July 26, 2026"],
  "things-to-do/chicago-with-kids.html": ["2026-07-23", "July 23, 2026"],
  "things-to-do/new-york-city-with-kids.html": ["2026-07-24", "July 24, 2026"],
});
const FIELDS = Object.freeze(["tags", "age", "time", "cost", "area", "stroller", "rain", "nap", "summary"]);
const CARD_KEYS = ["name", ...FIELDS];
const PAGE_KEYS = ["schema_version", "page_url", "model_path", "retained_page_source_date", "date_basis", "source_note", "comparison_note", "page_source_inventory", "field_evidence_class", "field_source_mapping", "verified_on", "cards"];
const text = value => typeof value === "string" && Boolean(value.trim());
const keysMatch = (value, keys) => value && typeof value === "object" && !Array.isArray(value) && Object.keys(value).length === keys.length && keys.every(key => Object.hasOwn(value, key));
const sourceSafe = value => {
  try {
    const u = new URL(value);
    const publicTicketQuery = value === "https://tickets.nysci.org/Info.aspx?EventID=3";
    return typeof value === "string" && u.protocol === "https:" && !u.port && !u.username && !u.password && (!u.search || publicTicketQuery) && !u.hash;
  } catch { return false; }
};

export function activityCardEvidence(pages = activityPages) {
  const records = Object.entries(PROFILES).map(([path, [date, label]]) => {
    const page = pages[path];
    if (!page?.sourcesIntro?.includes(`checked ${label}.`)) throw new Error(`Retained page source-note drift: ${path}`);
    return { schema_version: 1, page_url: `https://familytripwise.com/${path}`, model_path: MODEL,
      retained_page_source_date: date, date_basis: "page-source-note-not-field-verification",
      source_note: page.sourcesIntro, comparison_note: page.comparisonNote,
      page_source_inventory: structuredClone(page.sources), field_evidence_class: "EDITORIAL_PLANNING",
      field_source_mapping: "unmapped", verified_on: null, cards: structuredClone(page.activityCards) };
  });
  const errors = validateActivityCardEvidence(records);
  if (errors.length) throw new Error(errors.join("\n"));
  return records;
}

export function validateActivityCardEvidence(records) {
  if (!Array.isArray(records)) return ["Page records must be an array"];
  const errors = [], seenPages = new Set();
  for (const page of records) {
    const fail = message => errors.push(`${page?.page_url ?? "page"}: ${message}`);
    if (!keysMatch(page, PAGE_KEYS)) { fail("Unexpected or missing page keys"); continue; }
    const path = Object.keys(PROFILES).find(path => page.page_url === `https://familytripwise.com/${path}`);
    if (!path || seenPages.has(path)) { fail("Unknown or duplicate page"); continue; }
    seenPages.add(path);
    if (page.schema_version !== 1 || page.model_path !== MODEL || page.date_basis !== "page-source-note-not-field-verification" || page.field_evidence_class !== "EDITORIAL_PLANNING" || page.field_source_mapping !== "unmapped" || page.verified_on !== null) fail("Invalid editorial provenance boundary");
    if (!validDate(page.retained_page_source_date) || page.retained_page_source_date !== PROFILES[path][0] || !text(page.source_note) || !page.source_note.includes(`checked ${PROFILES[path][1]}.`) || !text(page.comparison_note)) fail("Invalid retained page date/note");
    if (!Array.isArray(page.page_source_inventory) || !page.page_source_inventory.length || page.page_source_inventory.some(source => !Array.isArray(source) || source.length !== 2 || !text(source[0]) || !sourceSafe(source[1])) || new Set(page.page_source_inventory?.map(source => source?.[1])).size !== page.page_source_inventory?.length) fail("Invalid public page source inventory");
    if (!Array.isArray(page.cards) || !page.cards.length) { fail("Missing cards"); continue; }
    const names = new Set();
    for (const card of page.cards) {
      if (!keysMatch(card, CARD_KEYS)) { fail("Unexpected or missing card keys"); continue; }
      if (!text(card.name) || names.has(card.name)) fail("Invalid or duplicate card name");
      names.add(card.name);
      if (FIELDS.filter(field => field !== "tags").some(field => !text(card[field])) || !Array.isArray(card.tags) || !card.tags.length || card.tags.some(tag => typeof tag !== "string" || !/^[a-z][a-z0-9-]*$/.test(tag)) || new Set(card.tags).size !== card.tags.length) fail("Invalid card values/tags");
    }
  }
  if (seenPages.size !== Object.keys(PROFILES).length) errors.push("Incomplete editorial-card page coverage");
  return errors;
}

export function activityCardQualityReport(records = activityCardEvidence(), { today = easternDate() } = {}) {
  if (!validDate(today)) throw new Error("Invalid card report date");
  const errors = validateActivityCardEvidence(records);
  if (errors.length) throw new Error(errors.join("\n"));
  const tasks = records.flatMap(page => page.cards.flatMap((card, cardIndex) => FIELDS.map(field => ({
    id: `${page.page_url.split("/").pop().replace(".html", "")}-${cardIndex}-${field}`,
    page_url: page.page_url, name: card.name, field,
    priority: field === "cost" ? 1 : ["age", "stroller", "rain", "nap"].includes(field) ? 2 : 3,
    reasons: ["editorial-planning-not-venue-guarantee", "atomic-source-and-verification-date-unmapped", ...(field === "cost" ? ["exact-visit-price-party-date-fees-unknown"] : [])],
    retained_value: structuredClone(card[field]), verified_on: null,
    page_note_age: ageState(page.retained_page_source_date, 30, today),
    next_step: field === "cost" ? "Check exact visit date, child ages, ticket product and mandatory fees; preserve the retained cost label meanwhile." : "Map current evidence for this named constraint before changing the public value; do not infer suitability from tags or access/weather/rest labels.",
  })))).sort((a, b) => a.priority - b.priority || a.id.localeCompare(b.id));
  return { schema_version: 1, as_of: today, scope: "retained-editorial-activity-cards-only", automatic_fact_renewal: false, automatic_publication: false,
    summary: { retained_pages: records.length, attractions: records.reduce((sum, page) => sum + page.cards.length, 0), fields: tasks.length, atomic_source_gaps: tasks.length, unpriced_exact_visit_budgets: tasks.filter(task => task.field === "cost").length },
    pages: structuredClone(records), tasks,
    other_activity_models: Object.keys(activityPages).filter(path => !Object.hasOwn(PROFILES, path)).map(path => `https://familytripwise.com/${path}`).sort(),
    limitations: ["Page-level source lists and July checked notes do not prove any card field or renew official facts.", "Cost labels, including Free, are not current numeric admission quotes or zero full-day spend.", "All age, stroller, rain, rest and tag values remain editorial planning, not verified suitability, routes or safety.", "Use alongside the separate SanDiego logistics and Vegas cost-friction reports; this report does not merge their field coverage or map the toddler/stay/itinerary domains.", "Native validity, retrieval success and report dates are not source verification or publication authority."] };
}

export async function validateActivityCardPaths(records, root = ROOT) {
  const errors = validateActivityCardEvidence(records);
  if (errors.length) throw new Error(errors.join("\n"));
  const sitemap = await readFile(resolve(root, "site/sitemap.xml"), "utf8");
  const urls = new Set([...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]));
  for (const page of records) if (!urls.has(page.page_url)) throw new Error("Card page absent from sitemap");
  await readFile(resolve(root, MODEL), "utf8");
}

async function main() {
  const args = process.argv.slice(2); let today = easternDate(), output, dateSeen = false;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--date" && !dateSeen && args[i + 1] && !args[i + 1].startsWith("--")) { today = args[++i]; dateSeen = true; }
    else if (args[i] === "--output" && !output && args[i + 1] && !args[i + 1].startsWith("--")) output = args[++i];
    else throw new Error(`Unknown, duplicate or incomplete card option: ${args[i]}`);
  }
  const records = activityCardEvidence(), report = activityCardQualityReport(records, { today });
  await validateActivityCardPaths(records);
  if (output) { const path = resolve(output); await requireNewOutput(path); await mkdir(dirname(path), { recursive: true }); await writeFile(path, JSON.stringify(report, null, 2) + "\n", { flag: "wx" }); }
  console.log(JSON.stringify({ as_of: today, ...report.summary, output: output ?? null, public_changes: false }, null, 2));
}
if (import.meta.url === pathToFileURL(process.argv[1] || "").href) main().catch(error => { console.error(error.message); process.exitCode = 1; });
