import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { validDate } from "./hotel-evidence.mjs";
import { roomPriceForTask, validateRoomPrices } from "./family-room-price.mjs";

const text = value => typeof value === "string" && value.trim().length > 0;
const positive = value => Number.isInteger(value) && value > 0;
const optionalLimit = value => value === null || positive(value);
const optionalChildLimit = value => value === null || (Number.isInteger(value) && value >= 0);
const denseArray = (value, predicate) => {
  if (!Array.isArray(value) || Object.getPrototypeOf(value) !== Array.prototype || Object.hasOwn(value, Symbol.iterator)) return false;
  for (let index = 0; index < value.length; index++) if (!Object.hasOwn(value, index) || !predicate(value[index])) return false;
  return true;
};
const strings = value => denseArray(value, text);

export function currentEasternDate(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(now);
  const values = Object.fromEntries(parts.map(part => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

export function validateRoomPack(pack) {
  const errors = [];
  const fail = message => errors.push(message);
  if (!pack || pack.schema_version !== 1 || !text(pack.destination) || !validDate(pack.checked_on) ||
      !positive(pack.refresh_days) || !text(pack.evidence_scope)) return ["Invalid pack metadata"];
  if (!pack.sources || typeof pack.sources !== "object" || Array.isArray(pack.sources)) return ["Invalid sources"];
  for (const [id, source] of Object.entries(pack.sources)) {
    if (!source || typeof source !== "object" || Array.isArray(source)) { fail(`${id}: invalid source`); continue; }
    try {
      if (!text(source.url)) throw new Error("Source URL must be a string");
      const url = new URL(source.url);
      if (url.protocol !== "https:" || url.username || url.password || url.search || url.hash) fail(`${id}: unsafe source URL`);
    } catch { fail(`${id}: invalid source URL`); }
    if (!validDate(source.checked_on) || source.checked_on > pack.checked_on ||
        (source.published_on !== null && (!validDate(source.published_on) || source.published_on > source.checked_on)) ||
        source.evidence_class !== "OFFICIAL_PROPERTY_FACT" ||
        source.date_basis !== "source-text-inspected-not-policy-effective") fail(`${id}: invalid source date/class`);
  }
  if (!denseArray(pack.records, r => r && typeof r === "object" && !Array.isArray(r)) || !pack.records.length) return [...errors, "Missing records"];
  const ids = new Set();
  for (const r of pack.records) {
    if (!r || !text(r.id) || ids.has(r.id)) { fail("Invalid/duplicate record ID"); continue; }
    ids.add(r.id);
    if (!text(r.hotel) || !text(r.category) || !text(r.source_id) || !Object.hasOwn(pack.sources, r.source_id) || !text(r.sleeping_setup) ||
        !["published-kitchen", "not-established"].includes(r.kitchen) ||
        !["named-connected-category", "requested-separate-room", "not-applicable"].includes(r.connection) ||
        !strings(r.checks) || !strings(r.conflicts)) fail(`${r.id}: invalid facts/provenance`);
    if (!denseArray(r.configurations, c => c && typeof c === "object" && !Array.isArray(c)) || !r.configurations.length) { fail(`${r.id}: missing configurations`); continue; }
    for (const c of r.configurations) {
      if (!c || !positive(c.maximum) || !optionalLimit(c.max_adults) || !optionalChildLimit(c.max_children) ||
          !strings(c.conditions) || !["OFFICIAL_PROPERTY_FACT", "EDITORIAL_INTERPRETATION"].includes(c.evidence_class) ||
          !text(c.basis)) { fail(`${r.id}: invalid capacity`); continue; }
      if (c.infant_extension !== null && (!positive(c.infant_extension?.places) ||
          !positive(c.infant_extension?.age_lt) || c.max_children === null ||
          c.infant_extension.places > c.max_children || c.conditions.length === 0)) fail(`${r.id}: invalid infant extension`);
    }
    // No price is synthesized from beds, another category, or the detached offer.
    if (!r.price || !["GBP", "USD"].includes(r.price.currency) || r.price.unit !== "configuration/night" ||
        r.price.amount !== null || r.price.observed_on !== null || r.price.status !== "not-observed" ||
        !strings(r.price.missing_basis) || !r.price.missing_basis.length) fail(`${r.id}: unsupported price`);
  }
  if (!denseArray(pack.offer_observations, offer => offer && typeof offer === "object" && !Array.isArray(offer))) fail("Invalid offer observations");
  else for (const offer of pack.offer_observations) {
    if (!offer || !text(offer.source_id) || !Object.hasOwn(pack.sources, offer.source_id) || !Number.isFinite(offer.amount_from) || offer.amount_from <= 0 ||
        !["GBP", "USD"].includes(offer.currency) || offer.unit !== null || offer.party_basis !== null ||
        ![offer.id, offer.room_basis, offer.stay_basis, offer.fee_basis, offer.terms, offer.limitation].every(text)) fail("Invalid separated offer observation");
  }
  return errors;
}

function matchesCapacity(c, party) {
  const children = party.child_ages.length;
  if (party.adults + children > c.maximum || (c.max_adults !== null && party.adults > c.max_adults) ||
      (c.max_children !== null && children > c.max_children)) return false;
  if (c.infant_extension) {
    const regularPlaces = c.max_children - c.infant_extension.places;
    const requiredInfants = Math.max(0, children - regularPlaces);
    if (party.child_ages.filter(age => age < c.infant_extension.age_lt).length < requiredInfants) return false;
  }
  return true;
}

export function screenRoomPack(pack, party = pack.scenario, asOf = currentEasternDate(), prices = []) {
  const errors = validateRoomPack(pack);
  if (errors.length) throw new Error(errors.join("; "));
  const priceErrors = validateRoomPrices(prices, pack);
  if (priceErrors.length) throw new Error(priceErrors.join("; "));
  if (!positive(party?.adults) || !denseArray(party.child_ages, age => Number.isInteger(age) && age >= 0 && age <= 17) ||
      !validDate(asOf) || asOf < pack.checked_on) throw new Error("Invalid party or screening date");
  return pack.records.map(r => {
    const source = pack.sources[r.source_id];
    const age = (Date.parse(asOf) - Date.parse(source.checked_on)) / 86400000;
    const matches = r.configurations.filter(c => matchesCapacity(c, party));
    const selected = matches.find(c => c.conditions.length === 0) ?? matches[0];
    const screening = age > pack.refresh_days ? "RECHECK_SOURCE" : !selected ? "OUTSIDE_PUBLISHED_LIMIT" :
      selected.evidence_class === "EDITORIAL_INTERPRETATION" ? "DERIVED_CONFIGURATION_REQUIRES_CONFIRMATION" :
      selected.conditions.length ? "CONDITIONAL_PUBLISHED_CAPACITY" : "WITHIN_PUBLISHED_CAPACITY";
    return { id: r.id, hotel: r.hotel, category: r.category, screening,
      conditions: screening === "RECHECK_SOURCE" ? ["Recheck source before screening"] : selected?.conditions ?? [],
      sleeping_setup: r.sleeping_setup, kitchen: r.kitchen, connection: r.connection,
      price: roomPriceForTask(prices, pack, r.id, party, asOf) ?? r.price,
      conflicts: r.conflicts, checked_on: source.checked_on, screened_on: asOf, source_url: source.url,
      capacity_evidence_class: selected?.evidence_class ?? null, capacity_basis: selected?.basis ?? null,
      next_checks: [...r.checks, "Confirm child/adult age classification, exact reservation and available setup", `Collect comparable ${r.price.currency} nightly price with party/stay/tax/fee basis`],
      limitation: "Published capacity screen only; not availability, booking acceptance, safety, suitability, route practicality or price ranking." };
  });
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const path = process.argv[2] ?? "docs/research/london-room-configurations-2026-09-30.json";
  try {
    const pack = JSON.parse(readFileSync(path, "utf8"));
    const prices = process.argv.slice(4).flatMap(pricePath => {
      const observations = JSON.parse(readFileSync(pricePath, "utf8"));
      if (!Array.isArray(observations)) throw new Error("Each price file must contain an observation array");
      return observations;
    });
    console.log(JSON.stringify(screenRoomPack(pack, pack.scenario, process.argv[3] ?? currentEasternDate(), prices), null, 2));
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
