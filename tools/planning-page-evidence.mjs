import { stayPages, itineraryPages, teenPages, activityPages } from "./page-generation/upgrade-page-data.mjs";
import { validDate } from "./hotel-evidence.mjs";
import { ageState, easternDate } from "./evidence-audit.mjs";
import { isDeepStrictEqual } from "node:util";

const MODEL = "tools/page-generation/upgrade-page-data.mjs";
const CITIES = ["san-diego", "las-vegas", "new-york-city", "chicago", "san-antonio"];
const PROFILES = Object.freeze(Object.fromEntries([
  ...CITIES.map(city => [`where-to-stay/${city}-with-kids.html`, "stay"]),
  ...CITIES.map(city => [`family-itinerary/${city}-with-kids.html`, "itinerary"]),
  ...CITIES.map(city => [`things-to-do/${city}-with-teens.html`, "teen"]),
  ["things-to-do/san-diego-with-toddlers.html", "toddler"],
]));
const MODELS = { stay: stayPages, itinerary: itineraryPages, teen: teenPages, toddler: activityPages };
const ACTIVITY_HEADERS = ["Activity", "Best ages", "Time", "Cost", "Area", "Stroller", "Rain", "Nap", "Booking", "Why worth it", "Pair nearby"];
const ROUTE_HEADERS = ["Route", "Best structure", "Best for", "Rest window", "Stroller/drive friction", "Meal/reset notes", "What to skip"];
const text = value => typeof value === "string" && Boolean(value.trim());
const exact = (value, keys) => value && typeof value === "object" && !Array.isArray(value) && Object.keys(value).length === keys.length && keys.every(key => Object.hasOwn(value, key));
const slug = value => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const safeSource = value => {
  try {
    const url = new URL(value);
    const publicQueries = ["https://tickets.nysci.org/Info.aspx?EventID=3", "https://forecast.weather.gov/MapClick.php?lat=29.4241&lon=-98.4936"];
    return url.protocol === "https:" && !url.username && !url.password && !url.port && !url.hash && (!url.search || publicQueries.includes(value));
  } catch { return false; }
};
const dense = value => Array.isArray(value) && Array.from({ length: value.length }, (_, index) => Object.hasOwn(value, index)).every(Boolean);
const tuple = (value, width, check = text) => dense(value) && value.length === width && Array.from(value).every(check);

function normalize(path, type, page) {
  if (!page) throw new Error(`Missing planning model: ${path}`);
  const sections = [];
  function rows(name, values, headers, check = value => tuple(value, headers.length)) {
    if (values === undefined) return;
    if (!dense(values) || values.some(value => !check(value))) throw new Error(`Invalid ${path} ${name} shape`);
    const ids = new Set();
    sections.push({ name, headers: structuredClone(headers), records: values.map(value => {
      const id = `${path.replace(/\.html$/, "")}/${name}/${slug(value[0])}`;
      if (!slug(value[0]) || ids.has(id)) throw new Error(`Duplicate or invalid planning identity: ${id}`);
      ids.add(id);
      return { id, values: structuredClone(value), evidence_class: "EDITORIAL_PLANNING", source_mapping: "unmapped", verified_on: null };
    }) });
  }
  let headers;
  if (type === "stay") headers = page.areaHeaders;
  else if (type === "itinerary") headers = page.rows?.[0]?.length === 2 ? ["Route", "Planning description"] : ROUTE_HEADERS;
  else headers = page.comparisonHeaders || ACTIVITY_HEADERS;
  if (!dense(headers) || !headers.length || headers.some(header => !text(header)) || !page.rows?.length) throw new Error(`Missing comparison structure: ${path}`);
  rows("comparison", page.rows, headers);
  rows("quick", page.quick, ["Choice", "Planning reason", "Constraint"]);
  rows("details", page.details, ["Activity", "Reason", "Fit", "Friction", "Strategy", "Reset", "Booking", "Pair"]);
  rows("booking-checks", page.bookingChecks, ["Check", "Planning guidance"]);
  rows("faqs", page.faqs, ["Question", "Answer"]);
  rows("day-plans", page.dayPlans, ["Plan", "Fit", "Blocks", "Stop rule"], value => tuple(value, 4, () => true) && text(value[0]) && text(value[1]) && text(value[3]) && dense(value[2]) && value[2].length > 0 && value[2].every(block => tuple(block, 2)));
  if (page.pivots !== undefined && (!tuple(page.pivotHeaders, 5))) throw new Error(`Invalid pivot headers: ${path}`);
  rows("pivots", page.pivots, page.pivotHeaders || []);
  rows("official-checks", page.officialChecks, ["Check", "Planning guidance", "Page-level links"], value => tuple(value, 3, () => true) && text(value[0]) && text(value[1]) && dense(value[2]) && value[2].length > 0 && value[2].every(link => tuple(link, 2) && safeSource(link[0])));
  if (page.plans !== undefined) {
    if (!page.plans || typeof page.plans !== "object" || Array.isArray(page.plans) || !Object.keys(page.plans).length) throw new Error(`Invalid planning rules: ${path}`);
    rows("planning-rules", Object.entries(page.plans), ["Rule", "Planning guidance"]);
  }
  if (page.baseHandoff !== undefined) {
    if (!exact(page.baseHandoff, ["title", "note", "choices", "links"]) || !text(page.baseHandoff.title) || !text(page.baseHandoff.note) || !dense(page.baseHandoff.links) || page.baseHandoff.links.some(link => !tuple(link, 2) || !/^\.\.\/[a-z0-9/-]+\.html$/.test(link[1]))) throw new Error(`Invalid base handoff: ${path}`);
    rows("base-handoff", page.baseHandoff.choices, ["Constraint", "Choice", "Planning guidance"]);
  }
  const notes = Object.fromEntries(["areaNote", "comparisonNote", "itineraryNote", "detailsNote", "quickNote", "existingDraftNote"].filter(key => page[key] !== undefined).map(key => {
    if (!text(page[key])) throw new Error(`Invalid planning note: ${path}`);
    return [key, page[key]];
  }));
  if (page.baseHandoff) notes.baseHandoff = page.baseHandoff.note;
  const sources = page.sources || [];
  if (!dense(sources) || sources.some(source => !tuple(source, 2) || !safeSource(source[1]))) throw new Error(`Invalid source inventory: ${path}`);
  const note = page.sourcesIntro ?? null;
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const match = note?.match(/checked ([A-Z][a-z]+) (\d{1,2}), (\d{4})\./);
  if (note !== null && (!text(note) || !match)) throw new Error(`Unrecognized retained source date: ${path}`);
  const date = match ? `${match[3]}-${String(months.indexOf(match[1]) + 1).padStart(2, "0")}-${match[2].padStart(2, "0")}` : null;
  if (date && !validDate(date)) throw new Error(`Invalid retained date: ${path}`);
  return { schema_version: 1, page_url: `https://familytripwise.com/${path}`, type, model_path: MODEL,
    retained_page_source_date: date, date_basis: date ? "page-source-note-not-field-verification" : "unknown-no-page-source-note",
    source_note: note, page_source_inventory: structuredClone(sources), notes, sections };
}

export function planningPageEvidence(models = MODELS) {
  return Object.entries(PROFILES).map(([path, type]) => normalize(path, type, models[type]?.[path]));
}

export function validatePlanningPageEvidence(records) {
  if (!dense(records)) return ["Planning records must be a dense array"];
  const expected = planningPageEvidence(), byUrl = new Map(expected.map(page => [page.page_url, page]));
  const seen = new Set(), errors = [];
  for (const page of records) {
    const reference = byUrl.get(page?.page_url);
    if (!reference || seen.has(page.page_url)) { errors.push("Unknown or duplicate planning page"); continue; }
    seen.add(page.page_url);
    // Adapters retain exact decision data; any provenance promotion, truncation or extra data fails closed.
    if (!isDeepStrictEqual(page, reference)) errors.push(`${page.page_url}: retained model/provenance mismatch`);
  }
  if (seen.size !== expected.length) errors.push("Incomplete planning page coverage");
  return errors;
}

export function planningPageQualityReport(records = planningPageEvidence(), { today = easternDate() } = {}) {
  if (!validDate(today)) throw new Error("Invalid planning report date");
  const errors = validatePlanningPageEvidence(records);
  if (errors.length) throw new Error(errors.join("\n"));
  const pages = records.map(page => ({ page_url: page.page_url, type: page.type,
    retained_page_source_date: page.retained_page_source_date, page_note_age: ageState(page.retained_page_source_date, 30, today),
    source_inventory_count: page.page_source_inventory.length,
    decision_records: page.sections.reduce((sum, section) => sum + section.records.length, 0),
    unmapped_decision_fields: page.sections.reduce((sum, section) => sum + section.records.length * section.headers.length, 0),
    sections: page.sections.map(section => ({ name: section.name, records: section.records.length, fields_per_record: section.headers.length })),
    next_step: "Map dated evidence to the named constraint before changing its value; page notes and access/weather/rest labels are not verified routes, suitability or safety." }));
  return { schema_version: 1, as_of: today, automatic_fact_renewal: false, automatic_publication: false,
    summary: { pages: pages.length, decision_records: pages.reduce((sum, page) => sum + page.decision_records, 0),
      unmapped_decision_fields: pages.reduce((sum, page) => sum + page.unmapped_decision_fields, 0),
      missing_page_source_notes: pages.filter(page => page.retained_page_source_date === null).length }, pages,
    limitations: ["Coverage is of maintained decision sections, not atomic sourcing of every prose sentence.", "Tuple cells containing nested blocks count as one decision field; this is not a claim count.", "Every decision field remains editorial and unmapped; retained July source notes are not field verification.", "Older San Diego models retain unknown page dates and empty source inventories; sibling sources are never borrowed."] };
}
