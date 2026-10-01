import { activityPages } from "./page-generation/upgrade-page-data.mjs";
import { validDate } from "./hotel-evidence.mjs";

export const ACTIVITY_FIELDS = ["venue", "ticket_cost", "duration", "weather", "access_check", "transport_check"];
export const VEGAS_ACTIVITY_FIELDS = ["venue", "ticket_cost", "duration", "access_check"];
const VEGAS_PAGE = "things-to-do/las-vegas-with-kids.html";
const ROOT_KEYS = ["schema_version", "id", "name", "page_url", "model_path", "source_note", "unknowns", "fields"];
const FIELD_KEYS = ["value", "evidence_class", "date_basis", "retained_on", "source_urls", "limitation"];
const keysMatch = (value, allowed) => value && typeof value === "object" && !Array.isArray(value) && Object.keys(value).length === allowed.length && Object.keys(value).every((key) => allowed.includes(key));
const text = (value) => typeof value === "string" && value.trim().length > 0;
const sourceSafe = (value) => {
  try {
    const url = new URL(value);
    return typeof value === "string" && url.protocol === "https:" && !url.port && !url.username && !url.password && !url.hash && !url.search;
  } catch { return false; }
};

export function activityEvidence(pages = activityPages) {
  return Object.entries(pages).flatMap(([path, page]) => (page.logisticsIndex || []).map((item) => {
    const envelope = (value, classification, limitation) => ({ value, evidence_class: classification, date_basis: "source-model-baseline", retained_on: item.checked,
      source_urls: [item.officialUrl], limitation });
    return { schema_version: 1, id: `${path.slice(0, -5).replaceAll("/", "-")}-${item.name.normalize("NFKD").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`,
      name: item.name, page_url: `https://familytripwise.com/${path}`, model_path: "tools/page-generation/upgrade-page-data.mjs", source_note: item.evidenceNote, unknowns: item.unknowns,
      fields: {
        venue: envelope({ area: item.area, setting: item.setting }, "MIXED_RESEARCH", "Retained official-source context and editorial wording; atomic facts/dates require separate reconciliation."),
        ticket_cost: envelope({ planning_label: item.costEstimate, amount: null, currency: null, unit: null, party_basis: null, visit_basis: null }, "EDITORIAL_ESTIMATE", "Qualitative budget orientation, not a dated exact-family ticket quote or zero total; parking, transport, meals and optional purchases unpriced."),
        duration: envelope(item.timeEstimate, "EDITORIAL_ESTIMATE", "Unmeasured planning estimate; child pace, queues and selected stops remain unknown."),
        weather: envelope(item.weatherRole, "EDITORIAL_ESTIMATE", "Planning interpretation, not verified weather suitability or safety assurance."),
        access_check: envelope(item.currentCheck, "VERIFICATION_PROMPT", "Check required, not confirmation of hours, admission, age/height, closures or accessibility."),
        transport_check: envelope(item.transportPrompt, "VERIFICATION_PROMPT", "Route/parking prompt, not verified current transit, exact stroller practicality or availability.")
      }
    };
  })).map((record) => structuredClone(record));
}

export function validateActivityEvidence(records) {
  const errors = [];
  if (!Array.isArray(records)) return ["Activity records must be an array"];
  const ids = new Set();
  for (const record of records) {
    const fail = (message) => errors.push(`${record?.id || "record"}: ${message}`);
    if (!keysMatch(record, ROOT_KEYS) || ![1, 2].includes(record.schema_version)) { fail("Invalid activity schema"); continue; }
    if (!text(record.id) || !/^[a-z0-9-]+$/.test(record.id) || ids.has(record.id)) fail("Invalid/duplicate activity ID");
    ids.add(record.id);
    if (![record.name, record.source_note, record.unknowns].every(text)) fail("Missing activity context");
    if (!/^https:\/\/familytripwise\.com\/things-to-do\/[a-z0-9-]+\.html$/.test(record.page_url) || record.model_path !== "tools/page-generation/upgrade-page-data.mjs") fail("Invalid activity page/model");
    const vegas = record.schema_version === 2;
    if (vegas && record.page_url !== `https://familytripwise.com/${VEGAS_PAGE}`) fail("Unsupported schema2 activity page");
    if (!keysMatch(record.fields, vegas ? VEGAS_ACTIVITY_FIELDS : ACTIVITY_FIELDS)) { fail("Invalid activity fields"); continue; }
    for (const [name, field] of Object.entries(record.fields)) {
      const classification = name === "venue" || vegas && name === "ticket_cost" ? "MIXED_RESEARCH" : name.endsWith("_check") ? "VERIFICATION_PROMPT" : "EDITORIAL_ESTIMATE";
      if (!keysMatch(field, FIELD_KEYS) || field.evidence_class !== classification || field.date_basis !== "source-model-baseline"
        || !validDate(field.retained_on) || !Array.isArray(field.source_urls) || field.source_urls.length !== 1 || !field.source_urls.every(sourceSafe) || !text(field.limitation)) { fail(`Invalid ${name} provenance`); continue; }
      if (name === "venue") {
        if (!keysMatch(field.value, ["area", "setting"]) || !Object.values(field.value).every(text)) fail("Invalid venue context");
      } else if (name === "ticket_cost") {
        const costKeys = ["planning_label", "amount", "currency", "unit", "party_basis", "visit_basis"];
        const retainedKeys = ["cost_basis", "inclusions", "exclusions", "retained_evidence_class", "retained_confidence"];
        if (!keysMatch(field.value, vegas ? [...costKeys, ...retainedKeys] : costKeys) || !text(field.value.planning_label) ||
          ["amount", "currency", "unit", "visit_basis"].some(key => field.value[key] !== null) ||
          (vegas ? !text(field.value.party_basis) || retainedKeys.some(key => !text(field.value[key])) : field.value.party_basis !== null)) fail("Pilot cost must retain unknown quote basis");
      } else if (!text(field.value)) fail(`Missing ${name} value`);
    }
  }
  return errors;
}

export function vegasActivityEvidence(pages = activityPages) {
  const page = pages[VEGAS_PAGE];
  if (!page) return [];
  return (page.costFrictionIndex || []).map(item => {
    const envelope = (value, evidence_class, limitation) => ({value, evidence_class, date_basis:"source-model-baseline", retained_on:item.checked, source_urls:[item.officialUrl], limitation});
    return {schema_version:2, id:`las-vegas-cost-${item.name.normalize("NFKD").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")}`,
      name:item.name, page_url:`https://familytripwise.com/${VEGAS_PAGE}`, model_path:"tools/page-generation/upgrade-page-data.mjs", source_note:item.evidenceClass, unknowns:item.unknowns,
      fields:{
        venue:envelope({area:item.zone,setting:item.setting},"MIXED_RESEARCH","Retained mixed venue/source context, not an atomic current official fact or verified route."),
        ticket_cost:envelope({planning_label:item.familyAdmissionEstimate,amount:null,currency:null,unit:null,party_basis:page.comparisonNote,visit_basis:null,
          cost_basis:item.costBasis,inclusions:item.inclusions,exclusions:item.exclusions,retained_evidence_class:item.evidenceClass,retained_confidence:item.confidence},"MIXED_RESEARCH",
          "Retained historical admission label and original confidence, not a current exact-date quote or complete family-day cost. Starting prices, per-vehicle amounts, age-gap subtotals and unknowns must not be parsed into comparable totals."),
        duration:envelope(item.timeEstimate,"EDITORIAL_ESTIMATE","Original unmeasured time estimate; queues, child pace and selected stops remain unknown."),
        access_check:envelope(item.currentCheck,"VERIFICATION_PROMPT","Retained check prompt, not confirmation of current hours, season, price, age/height, accessibility, weather or safety.")
      }};
  }).map(record => structuredClone(record));
}
