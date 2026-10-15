import { pathToFileURL } from "node:url";
import { resolve } from "node:path";
import { admissionTariffs } from "./page-generation/orlando-activity-data.mjs";
import { calculateAdmissionBudget } from "../src/shared/admission-budget.mjs";

export function compareOrlandoAdmission(input) {
  return calculateAdmissionBudget(admissionTariffs, input);
}

export function admissionCliArguments(args) {
  const values = {};
  const names = { "--ages": "ages", "--as-of": "asOf", "--visit-date": "visitDate" };
  for (let index = 0; index < args.length; index += 2) {
    const key = Object.hasOwn(names,args[index]) ? names[args[index]] : null, value = args[index + 1];
    if (!key || Object.hasOwn(values, key) || typeof value !== "string" || value.startsWith("--")) throw new TypeError("Use --ages AGE,AGE --as-of YYYY-MM-DD --visit-date YYYY-MM-DD.");
    values[key] = value;
  }
  if (typeof values.ages !== "string" || !/^\d+(,\d+)*$/.test(values.ages)) throw new TypeError("Provide comma-separated exact ages without empty entries.");
  return { travelerAges: values.ages.split(",").map(Number), asOf: values.asOf, visitDate: values.visitDate };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    process.stdout.write(JSON.stringify(compareOrlandoAdmission(admissionCliArguments(process.argv.slice(2))), null, 2) + "\n");
  } catch {
    process.stderr.write("Admission comparison failed. Use --ages AGE,AGE --as-of YYYY-MM-DD --visit-date YYYY-MM-DD; one to fourteen ages including an adult. No files or network requests are made.\n");
    process.exitCode = 1;
  }
}
