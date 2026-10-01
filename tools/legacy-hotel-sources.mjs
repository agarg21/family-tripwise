import { readFileSync } from "node:fs";

const classes = { "official fact": "OFFICIAL_PROPERTY_FACT", "price-band evidence": "BOOKING_CHECK", "review-signal-derived": "REVIEW_SIGNAL", "community-signal-derived": "COMMUNITY_SIGNAL" };
function date(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || !Number.isFinite(Date.parse(value)) || new Date(value).toISOString().slice(0, 10) !== value) throw new Error(`Invalid retained source date: ${value}`);
  return value;
}
function urls(text) {
  return [...new Set([...text.matchAll(/https:\/\/[^\s,|`]+/g)].map((m) => {
    const u = new URL(m[0]);
    if (u.username || u.password || u.hash || [...u.searchParams.keys()].some((key) => /token|password|secret|api.?key|email|session/i.test(key))) throw new Error("Unsafe retained source URL");
    return u.href;
  }))];
}

// These importers support the repository's two explicit source-register formats,
// not arbitrary Markdown claims or inferred source dates.
export function parseSourceTable(markdown, evidencePath) {
  const section = markdown.split("## Source Register\n")[1];
  if (!section) throw new Error("Missing source table");
  const result = {};
  for (const line of section.split("\n")) {
    if (line.startsWith("| ID |")) continue;
    if (!/^\| [A-Z][A-Z0-9-]* \|/.test(line)) continue;
    const cells = line.split("|").slice(1, -1).map((cell) => cell.trim());
    if (cells.length !== 5) throw new Error("Unsupported source table row");
    const [id, label, source, checked, supports] = cells;
    const evidenceClass = classes[label.replaceAll("`", "")];
    if (!evidenceClass || result[id]) throw new Error(`Invalid/duplicate source ID: ${id}`);
    result[id] = { id, evidence_class: evidenceClass, checked_on: date(checked), urls: urls(source), evidence_path: evidencePath, supports };
  }
  if (!Object.keys(result).length) throw new Error("Empty source register");
  return result;
}

export function parseAddedSourceList(markdown, evidencePath, dates) {
  const section = markdown.split("### Added hotel sources\n")[1]?.split("\n## ")[0];
  if (!section) throw new Error("Missing added hotel source list");
  const result = {};
  for (const line of section.split("\n")) {
    if (!line.startsWith("- `")) continue;
    const ids = [...line.matchAll(/`([A-Z][A-Z0-9-]+)`/g)].map((m) => m[1]);
    const sourceUrls = urls(line);
    if (!ids.length || !sourceUrls.length) throw new Error("Invalid added source row");
    for (const id of ids) {
      const type = id.includes("-OFFICIAL-") ? "official" : id.includes("-PRICE-") ? "price" : id.includes("-REVIEWS-") ? "review" : null;
      if (!type || result[id]) throw new Error(`Invalid/duplicate added source: ${id}`);
      result[id] = { id, evidence_class: type === "official" ? "OFFICIAL_PROPERTY_FACT" : type === "price" ? "BOOKING_CHECK" : "REVIEW_SIGNAL", checked_on: date(dates[type]), urls: sourceUrls, evidence_path: evidencePath, supports: "See property-specific record in this evidence pack" };
    }
  }
  return result;
}

export const SAN_DIEGO_PACK = "docs/research/san-diego-family-hotel-evidence-pack.md";
export const SAN_DIEGO_ADDITIONS = "docs/research/san-diego-activity-hotel-expansion-review.md";
export const SAN_DIEGO_FEES = "docs/research/hotel-table-sharing-price-audit-2026-09-27.md";
export function sanDiegoSources() {
  const root = new URL("../", import.meta.url);
  const base = parseSourceTable(readFileSync(new URL(SAN_DIEGO_PACK, root), "utf8"), SAN_DIEGO_PACK);
  const additions = parseAddedSourceList(readFileSync(new URL(SAN_DIEGO_ADDITIONS, root), "utf8"), SAN_DIEGO_ADDITIONS,
    { official: "2026-08-17", price: "2026-07-21", review: "2026-07-21" });
  for (const id of Object.keys(additions)) if (base[id]) throw new Error(`Duplicate cross-pack source: ${id}`);
  return { ...base, ...additions };
}
