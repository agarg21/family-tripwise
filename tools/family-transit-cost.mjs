import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { assessFamilyTransit as assessSharedFamilyTransit } from "../src/shared/family-transit-cost.mjs";
import { currentEasternDate } from "./family-room-task.mjs";

export function assessFamilyTransit(policy, inputs, asOf = currentEasternDate()) {
  return assessSharedFamilyTransit(policy, inputs, asOf);
}
async function main() {
  const [path, inputJson, date, ...extra] = process.argv.slice(2);
  if (!path || !inputJson || extra.length)
    throw new Error("Usage: node tools/family-transit-cost.mjs evidence.json '{family fare inputs}' [YYYY-MM-DD]");
  const evidence = JSON.parse(await readFile(path, "utf8"));
  process.stdout.write(JSON.stringify(assessFamilyTransit(evidence.policy, JSON.parse(inputJson),
    date ?? currentEasternDate()), null, 2) + "\n");
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url))
  main().catch(error => { console.error(error.message); process.exitCode = 1; });
