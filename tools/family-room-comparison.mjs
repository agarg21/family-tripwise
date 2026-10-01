import { readFile, writeFile, mkdir, realpath } from "node:fs/promises";
import { basename, dirname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { validDate } from "./hotel-evidence.mjs";
import { currentEasternDate, screenRoomPack } from "./family-room-task.mjs";

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

export function roomComparisonCsv(pack, party = pack.scenario, asOf = currentEasternDate(), prices = []) {
  const screened = screenRoomPack(pack, party, asOf, prices);
  const stay = party.stay ?? pack.scenario?.stay;
  const nights = (Date.parse(stay?.departure) - Date.parse(stay?.arrival)) / 86400000;
  if (!validDate(stay?.arrival) || !validDate(stay?.departure) || !Number.isInteger(nights) || nights < 1)
    throw new Error("Comparison requires an exact arrival/departure task");
  const rows = screened.flatMap((room, index) => {
    const price = room.price;
    return (price.rates ?? [null]).map(rate => [
      pack.destination, room.hotel, room.category, room.screening, room.conditions.join("; "), JSON.stringify(pack.records[index].configurations),
      room.sleeping_setup, room.kitchen, room.connection, room.checked_on, room.screened_on,
      JSON.stringify({ adults: party.adults, child_ages: party.child_ages }), stay.arrival, stay.departure,
      nights, price.status, price.observed_on, price.currency, price.unit, rate?.plan ?? "Unpriced",
      rate?.stay_amount, rate?.nightly_average, price.booking_category,
      price.engine_party ? JSON.stringify(price.engine_party) : "Not observed",
      price.configuration_basis ?? "Not observed", price.fee_basis ?? "Unknown",
      price.deposit_basis ?? "Unknown", rate?.meals ?? "Unknown", rate?.cancellation ?? "Unknown",
      room.conflicts.join("; "), room.next_checks.join("; "), room.source_url, price.source_url,
      price.observation_limitation ?? price.missing_basis?.join("; ") ?? "Not observed",
      [pack.evidence_scope, room.limitation, price.limitation ?? "No exact-task public price observed"].join("; ")
    ]);
  });
  return [comparisonHeadings, ...rows].map(row => row.map(cell).join(",")).join("\n") + "\n";
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

async function main() {
  const args = process.argv.slice(2);
  const packPath = args.shift();
  if (!packPath || packPath.startsWith("--")) throw new Error("Provide a room configuration JSON path");
  let date = currentEasternDate(), output, dateSet = false, pricesSet = false;
  const pricePaths = [];
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--date" && !dateSet && args[i + 1] && !args[i + 1].startsWith("--")) {
      date = args[++i]; dateSet = true;
    } else if (args[i] === "--output" && !output && args[i + 1] && !args[i + 1].startsWith("--")) {
      output = args[++i];
    } else if (args[i] === "--prices" && !pricesSet && args[i + 1] && !args[i + 1].startsWith("--")) {
      pricesSet = true;
      while (args[i + 1] && !args[i + 1].startsWith("--")) pricePaths.push(args[++i]);
    } else throw new Error(`Unknown, duplicate or incomplete comparison option: ${args[i]}`);
  }
  const pack = JSON.parse(await readFile(packPath, "utf8"));
  const prices = [];
  for (const path of pricePaths) {
    const observations = JSON.parse(await readFile(path, "utf8"));
    if (!Array.isArray(observations)) throw new Error("Each price file must contain an observation array");
    prices.push(...observations);
  }
  const csv = roomComparisonCsv(pack, pack.scenario, date, prices);
  if (output) {
    const path = await researchOutputPath(output);
    await mkdir(dirname(path), { recursive: true });
    await writeFile(await researchOutputPath(path), csv, { flag: "wx" });
    console.log(JSON.stringify({ as_of: date, categories: pack.records.length, output, public_changes: false }));
  } else process.stdout.write(csv);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url))
  main().catch(error => { console.error(error.message); process.exitCode = 1; });
