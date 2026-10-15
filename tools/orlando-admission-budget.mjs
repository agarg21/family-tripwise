import { pathToFileURL } from "node:url";
import { resolve } from "node:path";
import { admissionTariffs, lakeEolaSwanBoatRental } from "./page-generation/orlando-activity-data.mjs";
import { calculateAdmissionBudget } from "../src/shared/admission-budget.mjs";
import { calculateLakeEolaRental } from "../src/shared/lake-eola-rental.mjs";

export function compareOrlandoAdmission(input) {
  const result = calculateAdmissionBudget(admissionTariffs, input);
  if (Object.hasOwn(input, "boatLoads")) {
    result.optionalRental = calculateLakeEolaRental(lakeEolaSwanBoatRental, {
      partySize: input.travelerAges.length, boatLoads: input.boatLoads, asOf: input.asOf, visitDate: input.visitDate
    });
  }
  return result;
}

export function admissionCliArguments(args) {
  const values = {};
  const names = { "--ages": "ages", "--as-of": "asOf", "--visit-date": "visitDate", "--boat-loads": "boatLoads" };
  for (let index = 0; index < args.length; index += 2) {
    const key = Object.hasOwn(names,args[index]) ? names[args[index]] : null, value = args[index + 1];
    if (!key || Object.hasOwn(values, key) || typeof value !== "string" || value.startsWith("--")) throw new TypeError("Use --ages AGE,AGE --as-of YYYY-MM-DD --visit-date YYYY-MM-DD [--boat-loads PEOPLE,PEOPLE].");
    values[key] = value;
  }
  if (typeof values.ages !== "string" || !/^\d+(,\d+)*$/.test(values.ages)) throw new TypeError("Provide comma-separated exact ages without empty entries.");
  const input = { travelerAges: values.ages.split(",").map(Number), asOf: values.asOf, visitDate: values.visitDate };
  if (Object.hasOwn(values, "boatLoads")) {
    if (!/^\d+(,\d+)*$/.test(values.boatLoads)) throw new TypeError("Provide comma-separated boat passenger counts.");
    input.boatLoads = values.boatLoads.split(",").map(Number);
  }
  return input;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    process.stdout.write(JSON.stringify(compareOrlandoAdmission(admissionCliArguments(process.argv.slice(2))), null, 2) + "\n");
  } catch {
    process.stderr.write("Admission comparison failed. Use --ages AGE,AGE --as-of YYYY-MM-DD --visit-date YYYY-MM-DD [--boat-loads PEOPLE,PEOPLE]; one to fourteen ages including an adult. Boat loads must cover the whole party, one to five people each, without establishing supervision or weight eligibility. No files or network requests are made.\n");
    process.exitCode = 1;
  }
}
