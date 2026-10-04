import { readFile, writeFile, mkdir, realpath } from "node:fs/promises";
import { basename, dirname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { validDate } from "./hotel-evidence.mjs";
import { currentEasternDate, screenRoomPack, validateRoomPack } from "./family-room-task.mjs";

export const comparisonHeadings = Object.freeze([
  "Destination", "Hotel", "Published category", "Capacity screen", "Capacity conditions", "Recorded capacity rules (dated; not revalidated)",
  "Sleeping setup", "Kitchen evidence", "Connection evidence", "Category checked", "Screened on",
  "Actual party", "Arrival", "Departure", "Nights", "Price status", "Price observed", "Currency",
  "Price unit", "Public rate plan", "Displayed stay amount", "Nightly equivalent", "Priced category",
  "Engine party and age basis", "Priced configuration basis", "Fee and tax basis", "Deposit basis",
  "Meals", "Cancellation terms", "Conflicts", "Next checks", "Category source", "Price source",
  "Observation limits", "Research scope and limits"
]);

const cell = value => {
  const plain = String(value ?? "").replaceAll(/[\r\n\t]+/g, " ");
  const safe = /^\s*[=+\-@]/.test(plain) ? `'${plain}` : plain;
  return `"${safe.replaceAll('"', '""')}"`;
};

function comparisonFilters(filters) {
  if (!filters || Object.getPrototypeOf(filters) !== Object.prototype ||
      Reflect.ownKeys(filters).some(key => !["kitchen", "capacity", "budget"].includes(key))) throw new Error("Invalid comparison filters");
  const value = (key, allowed) => {
    const field = Object.getOwnPropertyDescriptor(filters, key);
    const selected = field ? field.value : "any";
    if (field && !Object.hasOwn(field, "value") || !allowed.includes(selected))
      throw new Error(`${key} filter must be ${allowed.join(" or ")}`);
    return selected;
  };
  const field = Object.getOwnPropertyDescriptor(filters, "budget");
  let budget;
  if (field) {
    if (!Object.hasOwn(field, "value") || !field.value || Object.getPrototypeOf(field.value) !== Object.prototype ||
        Reflect.ownKeys(field.value).length !== 2 || Reflect.ownKeys(field.value).some(key => !["currency", "nightly_limit"].includes(key)))
      throw new Error("Invalid observed nightly budget");
    const currency = Object.getOwnPropertyDescriptor(field.value, "currency");
    const limit = Object.getOwnPropertyDescriptor(field.value, "nightly_limit");
    if (!currency || !Object.hasOwn(currency, "value") || !["USD", "GBP"].includes(currency.value) ||
        !limit || !Object.hasOwn(limit, "value") || !Number.isFinite(limit.value) || limit.value <= 0 ||
        !Number.isSafeInteger(Math.round(limit.value * 100)) || Math.round(limit.value * 100) / 100 !== limit.value)
      throw new Error("Budget requires USD or GBP and a positive cent-precision nightly limit");
    budget = { currency: currency.value, nightly_limit: limit.value };
  }
  return { kitchen: value("kitchen", ["any", "published"]), capacity: value("capacity", ["any", "not-excluded"]), ...(budget ? { budget } : {}) };
}

function observedNightlyBudget(price, rate, budget) {
  if (!budget) return [];
  let status;
  if (!rate) status = "UNKNOWN_UNPRICED";
  else if (price.currency !== budget.currency) status = "UNKNOWN_CURRENCY_MISMATCH";
  else if (price.status.startsWith("historical-")) status = "UNKNOWN_HISTORICAL_PRICE";
  else if (price.requested_individual_ages_confirmed === false) status = "UNKNOWN_AGE_BASIS";
  else status = rate.nightly_average <= budget.nightly_limit ? "AT_OR_BELOW_OBSERVED_AMOUNT" : "ABOVE_OBSERVED_AMOUNT";
  return [`Observed nightly budget ${status}: limit ${budget.nightly_limit} ${budget.currency}/configuration/night; price-only dated sample, not final all-fee budget, booking acceptance, future availability or hotel ranking`];
}

function cancellationDateCheck(rate, asOf) {
  if (!rate?.cancellation_deadline_local_date) return [];
  return [`Cancellation deadline date check ${rate.cancellation_deadline_date_relation}: recorded hotel-local date ${rate.cancellation_deadline_local_date}; comparison date ${asOf}; calendar dates only, no timezone conversion or current cancellability/availability guarantee; recheck current rate terms`];
}

function roomComparisonRows(pack, party, asOf, prices, { kitchen, capacity, budget }) {
  const screened = screenRoomPack(pack, party, asOf, prices);
  const stay = party.stay ?? pack.scenario?.stay;
  const nights = (Date.parse(stay?.departure) - Date.parse(stay?.arrival)) / 86400000;
  if (!validDate(stay?.arrival) || !validDate(stay?.departure) || !Number.isInteger(nights) || nights < 1)
    throw new Error("Comparison requires an exact arrival/departure task");
  return screened.flatMap((room, index) => {
    if (kitchen === "published" && room.kitchen !== "published-kitchen") return [];
    if (capacity === "not-excluded" && room.screening === "OUTSIDE_PUBLISHED_LIMIT") return [];
    const price = room.price;
    return (price.rates ?? [null]).map(rate => [
      pack.destination, room.hotel, room.category, room.screening, room.conditions.join("; "), JSON.stringify(pack.records[index].configurations),
      room.sleeping_setup, room.kitchen, room.connection, room.checked_on, room.screened_on,
      JSON.stringify({ adults: party.adults, child_ages: party.child_ages }), stay.arrival, stay.departure,
      nights, price.status, price.observed_on, price.currency ?? "Unknown", price.unit, rate?.plan ?? "Unpriced",
      rate?.stay_amount, rate?.nightly_average, price.booking_category,
      price.engine_party ? JSON.stringify(price.engine_party) : "Not observed",
      price.configuration_basis ?? "Not observed", price.fee_basis ?? "Unknown",
      price.deposit_basis ?? "Unknown", rate?.meals ?? "Unknown", rate?.cancellation ?? "Unknown",
      room.conflicts.join("; "), room.next_checks.join("; "), room.source_url, price.source_url,
      price.observation_limitation ?? price.missing_basis?.join("; ") ?? "Not observed",
      [pack.evidence_scope, room.limitation, price.limitation ?? "No exact-task public price observed",
        ...(kitchen === "published" ? ["Filtered by dated published kitchen evidence; not revalidated availability, equipment or family fit"] : []),
        ...(capacity === "not-excluded" ? ["Filtered only current published-capacity exclusions; conditional, stale and unpriced rows are not booking acceptance or availability"] : []),
        ...observedNightlyBudget(price, rate, budget), ...cancellationDateCheck(rate, asOf)].join("; ")
    ]);
  });
}

const comparisonCsv = rows => [comparisonHeadings, ...rows].map(row => row.map(cell).join(",")).join("\n") + "\n";

export function roomComparisonCsv(pack, party = pack.scenario, asOf = currentEasternDate(), prices = [], filters = {}) {
  return comparisonCsv(roomComparisonRows(pack, party, asOf, prices, comparisonFilters(filters)));
}

export function roomComparisonsCsv(packs, party, asOf = currentEasternDate(), prices = [], filters = {}) {
  const selected = comparisonFilters(filters);
  const dense = values => {
    if (!Array.isArray(values) || Object.getPrototypeOf(values) !== Array.prototype || Object.hasOwn(values, Symbol.iterator)) return false;
    for (let i = 0; i < values.length; i++) if (!Object.hasOwn(values, i)) return false;
    return true;
  };
  if (!dense(packs) || !packs.length || !dense(prices)) throw new Error("Provide ordinary dense pack and price arrays");
  if (!validDate(party?.stay?.arrival) || !validDate(party?.stay?.departure) || party.stay.departure <= party.stay.arrival)
    throw new Error("Joined comparison requires an explicit family and exact arrival/departure task");
  const owners = new Map();
  for (const pack of packs) {
    const errors = validateRoomPack(pack);
    if (errors.length) throw new Error(errors.join("; "));
    if (pack.destination !== packs[0].destination) throw new Error("Joined packs must have the same destination");
    for (const record of pack.records) {
      if (owners.has(record.id)) throw new Error(`Duplicate record ownership: ${record.id}`);
      owners.set(record.id, pack);
    }
  }
  // Partition observations by their owning category, never by order or a similar hotel name.
  const byPack = new Map(packs.map(pack => [pack, []]));
  for (const observation of prices) {
    const owner = owners.get(observation?.record_id);
    if (!owner) throw new Error(`Unowned price observation: ${observation?.record_id ?? "invalid"}`);
    byPack.get(owner).push(observation);
  }
  return comparisonCsv(packs.flatMap(pack => roomComparisonRows(pack, party, asOf, byPack.get(pack), selected)));
}

async function researchOutputPath(output) {
  let parent = dirname(resolve(output));
  const remaining = [basename(resolve(output))];
  // Resolve the nearest existing ancestor before creating any output directories.
  for (;;) {
    try { parent = await realpath(parent); break; }
    catch (error) {
      if (error.code !== "ENOENT" || parent === dirname(parent)) throw error;
      remaining.unshift(basename(parent)); parent = dirname(parent);
    }
  }
  const path = resolve(parent, ...remaining);
  const site = await realpath(fileURLToPath(new URL("../site/", import.meta.url)));
  if (path === site || path.startsWith(site + sep)) throw new Error("Research comparison cannot write into the public site");
  return path;
}

export function parseRoomComparisonOptions(input) {
  const args = [...input];
  const packPath = args.shift();
  if (!packPath || packPath.startsWith("--")) throw new Error("Provide a room configuration JSON path");
  let date = currentEasternDate(), output, dateSet = false, pricesSet = false, packsSet = false, kitchenSet = false, capacitySet = false;
  const filters = {};
  const pricePaths = [], additionalPackPaths = [];
  const taskOptions = new Map();
  const budgetOptions = new Map();
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--date" && !dateSet && args[i + 1] && !args[i + 1].startsWith("--")) {
      date = args[++i]; dateSet = true;
    } else if (args[i] === "--output" && !output && args[i + 1] && !args[i + 1].startsWith("--")) {
      output = args[++i];
    } else if (args[i] === "--prices" && !pricesSet && args[i + 1] && !args[i + 1].startsWith("--")) {
      pricesSet = true;
      while (args[i + 1] && !args[i + 1].startsWith("--")) pricePaths.push(args[++i]);
    } else if (args[i] === "--packs" && !packsSet && args[i + 1] && !args[i + 1].startsWith("--")) {
      packsSet = true;
      while (args[i + 1] && !args[i + 1].startsWith("--")) additionalPackPaths.push(args[++i]);
    } else if (args[i] === "--kitchen" && !kitchenSet && args[i + 1] && !args[i + 1].startsWith("--")) {
      filters.kitchen = args[++i]; kitchenSet = true;
    } else if (args[i] === "--capacity" && !capacitySet && args[i + 1] && !args[i + 1].startsWith("--")) {
      filters.capacity = args[++i]; capacitySet = true;
    } else if (["--nightly-budget", "--budget-currency"].includes(args[i]) &&
        !budgetOptions.has(args[i]) && args[i + 1] && !args[i + 1].startsWith("--")) {
      budgetOptions.set(args[i], args[++i]);
    } else if (["--adults", "--child-ages", "--arrival", "--departure"].includes(args[i]) &&
        !taskOptions.has(args[i]) && args[i + 1] && !args[i + 1].startsWith("--")) {
      taskOptions.set(args[i], args[++i]);
    } else throw new Error(`Unknown, duplicate or incomplete comparison option: ${args[i]}`);
  }
  if (!validDate(date)) throw new Error("Invalid screening date");
  if (budgetOptions.size) {
    const amount = budgetOptions.get("--nightly-budget");
    if (budgetOptions.size !== 2 || !/^(?:0|[1-9]\d*)(?:\.\d{1,2})?$/.test(amount ?? ""))
      throw new Error("Supply nightly budget and budget currency together, using a decimal amount");
    filters.budget = { nightly_limit: Number(amount), currency: budgetOptions.get("--budget-currency") };
  }
  comparisonFilters(filters);
  let task = null;
  if (taskOptions.size) {
    if (taskOptions.size !== 4) throw new Error("Supply adults, child ages, arrival and departure together");
    const integer = value => /^\d+$/.test(value) && Number.isSafeInteger(Number(value));
    const adults = taskOptions.get("--adults");
    const ageText = taskOptions.get("--child-ages");
    const ages = ageText === "none" ? [] : ageText.split(",");
    if (!integer(adults) || Number(adults) < 1 ||
        !ages.every(age => integer(age) && Number(age) <= 17)) throw new Error("Invalid adults or individual child ages (0-17; none for no children)");
    const arrival = taskOptions.get("--arrival"), departure = taskOptions.get("--departure");
    if (!validDate(arrival) || !validDate(departure) || departure <= arrival)
      throw new Error("Invalid exact arrival/departure task");
    task = { adults: Number(adults), child_ages: ages.map(Number), stay: { arrival, departure } };
  }
  if (additionalPackPaths.length && !task) throw new Error("Joined packs require an explicit family/stay task");
  return { packPath, additionalPackPaths, date, output, pricePaths, task, filters };
}

async function main() {
  const { packPath, additionalPackPaths, date, output, pricePaths, task, filters } = parseRoomComparisonOptions(process.argv.slice(2));
  const pack = JSON.parse(await readFile(packPath, "utf8"));
  const packs = [pack];
  for (const path of additionalPackPaths) packs.push(JSON.parse(await readFile(path, "utf8")));
  const prices = [];
  for (const path of pricePaths) {
    const observations = JSON.parse(await readFile(path, "utf8"));
    if (!Array.isArray(observations)) throw new Error("Each price file must contain an observation array");
    prices.push(...observations);
  }
  const party = task ?? pack.scenario;
  const csv = packs.length === 1 ? roomComparisonCsv(pack, party, date, prices, filters) : roomComparisonsCsv(packs, party, date, prices, filters);
  if (output) {
    const path = await researchOutputPath(output);
    await mkdir(dirname(path), { recursive: true });
    await writeFile(await researchOutputPath(path), csv, { flag: "wx" });
    console.log(JSON.stringify({ as_of: date, categories: packs.reduce((total, p) => total + p.records.length, 0), packs: packs.length, output, public_changes: false,
      ...(filters.kitchen === "published" || filters.capacity === "not-excluded" || filters.budget ? { filters, categories_are_input_count: true } : {}),
      task: { adults: party.adults, child_ages: party.child_ages, stay: party.stay } }));
  } else process.stdout.write(csv);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url))
  main().catch(error => { console.error(error.message); process.exitCode = 1; });
