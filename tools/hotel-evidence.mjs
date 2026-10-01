import { createFamilyHotelPages } from "./page-generation/family-hotel-pages.mjs";
import { cancunEvidence } from "../src/prototypes/cancun-resort-comparison/data.mjs";
import { suites, sources, checkedOn } from "./page-generation/orlando-suite-data.mjs";
import { sanDiegoSources } from "./legacy-hotel-sources.mjs";
import { normalizeSanDiegoHotel } from "./page-generation/san-diego-hotel-evidence.mjs";

export const SCHEMA_VERSION = 1;
export const EVIDENCE_CLASSES = ["OFFICIAL_PROPERTY_FACT", "BOOKING_CHECK", "REVIEW_SIGNAL", "COMMUNITY_SIGNAL", "EDITORIAL_INTERPRETATION", "HUMAN_VERIFIED"];
const STATES = ["known", "unknown", "disputed", "unmapped"];
const FIELDS = ["room", "price", "fees", "transport", "activities", "review_signal"];
const legacyDates = { "san-diego": "2026-07-18", "las-vegas": "2026-07-22", chicago: "2026-07-23", "new-york-city": "2026-07-25", "san-antonio": "2026-07-26" };
const legacyPath = (city) => `docs/research/${city}-family-hotel-evidence-pack.md`;
const pageUrl = (slug) => `https://familytripwise.com/where-to-stay/${slug}.html`;
const unknown = (path) => field(null, "unknown", "EDITORIAL_INTERPRETATION", null, [], path, "Not yet mapped; do not infer absence or zero cost.");

function field(value, state, evidenceClass, observedOn, sourceUrls, evidencePath, limitation, dateBasis = "field-observation") {
  return { value, state, evidence_class: evidenceClass, observed_on: observedOn, source_urls: sourceUrls, evidence_path: evidencePath, date_basis: dateBasis, limitation };
}

function price(value, path, sourceUrls = [], observedOn = null, evidenceClass = "BOOKING_CHECK") {
  return field(value, value ? "known" : "unknown", evidenceClass, observedOn, sourceUrls, path,
    value ? "Dated planning evidence, not live inventory; structured basis gaps require reconciliation." : "Exact-room price research gap; unknown is not free.");
}

export function hotelEvidence() {
  const records = [];
  const { hotelCatalog } = createFamilyHotelPages({});
  for (const [city, hotels] of Object.entries(hotelCatalog)) {
    const registry = city === "san-diego" ? sanDiegoSources() : null;
    hotels.forEach((hotel) => {
      const path = legacyPath(city);
      const unmapped = (value, evidenceClass = "EDITORIAL_INTERPRETATION") => field(value ?? null, "unmapped", evidenceClass, null, [], path, "Existing published interpretation retained; individual facts/dates/source IDs need mapping.", "unmapped");
      const record = { schema_version: SCHEMA_VERSION, id: `${city}-${hotel.name.normalize("NFKD").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`, hotel: hotel.name,
        page_url: pageUrl(`${city}-family-hotels`), model_path: "tools/page-generation/family-hotel-pages.mjs", coverage: "legacy-partial",
        fields: {
          room: unmapped({ category: hotel.category, setup: hotel.familySetup ?? null, checks: hotel.parentCheck }),
          price: price({ kind: "legacy-planning-band", display: hotel.priceRange, currency: "USD", unit: "room/night", amount_from: null, amount_to: null,
            room_basis: null, party_basis: null, stay_basis: null, fee_basis: hotel.priceNote ?? "Tax/fee inclusion varies; exact basis needs mapping.",
            source_basis: "Historical public examples and editorial planning band, not an exact family-room quote.", structured_basis: false }, path, [], legacyDates[city], "EDITORIAL_INTERPRETATION"),
          fees: unknown(path), transport: unknown(path), activities: unmapped({ strengths: hotel.strengths ?? null, tradeoffs: hotel.tradeoffs ?? null }),
          review_signal: unmapped(hotel.reviewSignal, "REVIEW_SIGNAL")
        }
      };
      if (registry) {
        record.fields = normalizeSanDiegoHotel(hotel, record.fields.price, registry);
        record.model_path = "tools/page-generation/san-diego-hotel-evidence.mjs";
      }
      records.push(record);
    });
  }
  const path = "src/prototypes/cancun-resort-comparison/data.mjs";
  for (const hotel of cancunEvidence.records) {
    const urls = (ids = []) => ids.map((id) => cancunEvidence.sources[id]);
    const official = (value, state = "known") => field(value, state, "OFFICIAL_PROPERTY_FACT", cancunEvidence.checkedOn, urls(value.sourceIds), path,
      "Conservative shared model check date; individual claim dates are not yet normalized.", "model-baseline");
    const p = hotel.price;
    records.push({ schema_version: SCHEMA_VERSION, id: `cancun-${hotel.id}`, hotel: hotel.hotel, page_url: pageUrl("cancun-family-resorts"), model_path: path, coverage: "shared-model-partial",
      fields: {
        room: official(hotel.room, hotel.room.capacityStatus === "disputed" ? "disputed" : "known"),
        price: price(p ? { kind: p.kind, currency: "USD", unit: "room/night", amount_from: p.usdFrom, amount_to: p.usdTo,
          display: null, room_basis: hotel.room.category, party_basis: null, stay_basis: null, fee_basis: p.fees,
          source_basis: p.basis, structured_basis: false } : null, path, urls(p?.sourceIds), p?.observedOn ?? null,
          p?.kind === "official-starting" ? "OFFICIAL_PROPERTY_FACT" : p?.kind === "derived-two-adult-starting" ? "EDITORIAL_INTERPRETATION" : "BOOKING_CHECK"),
        fees: official(hotel.extras), transport: official(hotel.transfers, hotel.transfers.rule === "unknown" ? "unknown" : "known"),
        activities: official(hotel.clubs, hotel.clubs.programs.length ? "known" : "unknown"), review_signal: unknown(path)
      }
    });
  }
  const orlandoPath = "tools/page-generation/orlando-suite-data.mjs";
  for (const hotel of suites) {
    const fact = (value, ids, observedOn = checkedOn) => field(value, "known", "OFFICIAL_PROPERTY_FACT", observedOn, ids.filter(Boolean).map((id) => sources[id]), orlandoPath,
      "Model-baseline source check; exact party acceptance/operations remain unverified.", "model-baseline");
    const p = hotel.priceSample;
    records.push({ schema_version: SCHEMA_VERSION, id: `orlando-${hotel.id}`, hotel: hotel.name, page_url: pageUrl("orlando-family-hotels"), model_path: orlandoPath, coverage: "shared-model-partial",
      fields: {
        room: fact({ category: hotel.room, maximum: hotel.maximum, layout: hotel.layout, checks: hotel.next }, [hotel.capacitySource, hotel.layoutSource], hotel.id === "holiday-inn" ? "2026-09-27" : checkedOn),
        price: price(p ? { kind: "derived-dated-stay-total", currency: "USD", unit: "room/night", amount_from: Math.round(p.estimatedTotal / p.nights * 100) / 100, amount_to: null, display: null,
          room_basis: p.room, party_basis: p.party, stay_basis: p.stay, fee_basis: "Estimated total includes listed resort fees and taxes; parking and other purchases separate.",
          source_basis: JSON.stringify(p), structured_basis: true } : null, orlandoPath, p ? [sources[p.source]] : [], p?.observedOn ?? null),
        fees: { ...fact({ parking: hotel.parking, resort_fee: hotel.resortFee, cost_note: hotel.costNote, caution: hotel.caution }, [hotel.parkingSource, hotel.cautionSource]), state: hotel.id === "holiday-inn" ? "disputed" : "known" },
        transport: fact(hotel.transport, [hotel.transportSource]), activities: fact(hotel.water, [hotel.waterSource]), review_signal: unknown(orlandoPath)
      }
    });
  }
  return structuredClone(records);
}

export function validDate(value) {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value;
}

export function validateHotelEvidence(records) {
  const errors = [];
  if (!Array.isArray(records)) return ["Records must be an array"];
  const ids = new Set();
  for (const r of records) {
    const fail = (message) => errors.push(`${r?.id ?? "record"}: ${message}`);
    if (!r || r.schema_version !== SCHEMA_VERSION) { fail("Unsupported schema version"); continue; }
    if (typeof r.id !== "string" || !r.id || ids.has(r.id)) fail("Invalid/duplicate ID"); ids.add(r.id);
    if (typeof r.hotel !== "string" || !r.hotel.trim()) fail("Missing hotel");
    if (!/^https:\/\/familytripwise\.com\/where-to-stay\/[a-z0-9-]+\.html$/.test(r.page_url)) fail("Invalid canonical page");
    if (!r.model_path || !["legacy-partial", "shared-model-partial", "field-mapped"].includes(r.coverage)) fail("Invalid model/coverage");
    if (!r.fields || typeof r.fields !== "object" || Array.isArray(r.fields)) { fail("Invalid fields object"); continue; }
    if (Object.keys(r.fields).some((name) => !FIELDS.includes(name))) fail("Unexpected fields");
    for (const name of FIELDS) {
      const f = r.fields?.[name];
      if (!f) { fail(`Missing ${name}`); continue; }
      if (!STATES.includes(f.state) || !EVIDENCE_CLASSES.includes(f.evidence_class)) fail(`Invalid ${name} classification`);
      if (f.observed_on !== null && !validDate(f.observed_on)) fail(`Invalid ${name} date`);
      if (!f.evidence_path || !f.limitation || !["field-observation", "model-baseline", "unmapped"].includes(f.date_basis)) fail(`Missing ${name} provenance/limits`);
      if (!Array.isArray(f.source_urls)) { fail(`Invalid ${name} sources`); continue; }
      for (const value of f.source_urls) {
        try { const url = new URL(value); if (typeof value !== "string" || url.protocol !== "https:" || url.username || url.password || url.hash || [...url.searchParams.keys()].some((key) => /token|password|secret|api.?key|email|session/i.test(key))) fail(`Unsafe ${name} source`); } catch { fail(`Invalid ${name} source`); }
      }
      if (f.source_refs !== undefined) {
        if (!Array.isArray(f.source_refs) || !f.source_refs.length) fail(`Invalid ${name} source references`);
        else for (const ref of f.source_refs) {
          if (!ref || typeof ref !== "object" || Array.isArray(ref) || Object.keys(ref).some((key) => !["id", "checked_on", "evidence_class", "evidence_path", "urls"].includes(key))) { fail(`Invalid ${name} source reference schema`); continue; }
          if (typeof ref.id !== "string" || !/^[A-Z][A-Z0-9-]+$/.test(ref.id) || !validDate(ref.checked_on) || !EVIDENCE_CLASSES.includes(ref.evidence_class)
            || typeof ref.evidence_path !== "string" || !/^(?:docs|src|tools)\/[a-zA-Z0-9/._-]+$/.test(ref.evidence_path) || ref.evidence_path.split("/").includes("..")
            || !Array.isArray(ref.urls) || !ref.urls.length || ref.urls.some((url) => typeof url !== "string" || !f.source_urls.includes(url))) fail(`Invalid ${name} source reference`);
        }
        if (Array.isArray(f.source_refs) && f.source_refs.length && f.source_refs.every((ref) => validDate(ref?.checked_on))) {
          if (f.observed_on !== f.source_refs.map((ref) => ref.checked_on).sort()[0]) fail(`Mismatched ${name} field/source date`);
          const referenced = [...new Set(f.source_refs.flatMap((ref) => Array.isArray(ref?.urls) ? ref.urls : []))].sort();
          if (JSON.stringify(referenced) !== JSON.stringify([...new Set(f.source_urls)].sort())) fail(`Incomplete ${name} source references`);
        }
      }
      if (["known", "disputed"].includes(f.state) && f.value == null) fail(`Missing ${name} value`);
      if (name !== "price" || !f.value) continue;
      const p = f.value;
      for (const key of ["kind", "currency", "unit", "fee_basis", "source_basis"]) if (typeof p[key] !== "string" || !p[key].trim()) fail(`Missing price ${key}`);
      if (!/^[A-Z]{3}$/.test(p.currency) || p.unit !== "room/night") fail("Invalid price currency/unit");
      for (const key of ["amount_from", "amount_to"]) if (p[key] !== null && (!Number.isFinite(p[key]) || p[key] <= 0)) fail(`Invalid price ${key}`);
      if (p.amount_to !== null && (p.amount_from === null || p.amount_to < p.amount_from)) fail("Invalid price range");
      if (p.amount_from === null && (typeof p.display !== "string" || !p.display.trim())) fail("Price missing amount/display");
      if (typeof p.structured_basis !== "boolean") fail("Missing structured-basis status");
      for (const key of ["room_basis", "party_basis", "stay_basis"]) if (p[key] !== null && (typeof p[key] !== "string" || !p[key].trim())) fail(`Invalid price ${key}`);
      if (p.structured_basis && [p.room_basis, p.party_basis, p.stay_basis].some((v) => !v)) fail("Incomplete structured price basis");
      if (p.basis_unknowns !== undefined && (!Array.isArray(p.basis_unknowns) || p.basis_unknowns.some((value) => typeof value !== "string" || !value.trim()))) fail("Invalid price basis unknowns");
    }
  }
  return errors;
}

export function hotelAuditRecords() {
  const records = hotelEvidence();
  const errors = validateHotelEvidence(records);
  if (errors.length) throw new Error(errors.join("\n"));
  return records.flatMap((r) => Object.entries(r.fields).map(([name, f]) => ({ id: `${r.id}-${name}`, page_url: r.page_url,
    field: name === "price" ? "nightly-price" : name, verified_on: f.observed_on, interval_days: name === "price" || name === "fees" ? 14 : name === "review_signal" ? 60 : 30,
    basis: `${f.limitation} Record-specific room/party/date/fees: ${JSON.stringify(f.value)}`, source_urls: f.source_urls, evidence_path: f.evidence_path,
    evidence_class: f.evidence_class, mapping_state: f.state, date_basis: f.date_basis, ...(f.source_refs ? { source_refs: f.source_refs } : {}) })));
}
