import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync, symlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { comparisonHeadings, parseRoomComparisonOptions, roomComparisonCsv } from "./family-room-comparison.mjs";

const path = name => fileURLToPath(new URL(`../docs/research/${name}`, import.meta.url));
const dcPath = path("washington-dc-room-configurations-2026-09-30.json");
const dc = JSON.parse(readFileSync(dcPath));
const pricePaths = ["embassy", "homewood", "residence"].map(name => path(`washington-dc-${name}-price-observation-2026-09-30.json`));
const prices = pricePaths.flatMap(p => JSON.parse(readFileSync(p)));
const london = JSON.parse(readFileSync(path("london-room-configurations-2026-09-30.json")));
const londonPaths = ["mitre", "marlin", "montague"].map(name => path(`london-${name}-price-observation-2026-09-30.json`));
const londonPrices = londonPaths.flatMap(p => JSON.parse(readFileSync(p)));
const cli = fileURLToPath(new URL("./family-room-comparison.mjs", import.meta.url));
// The writer quotes every cell and flattens line breaks; this is its narrow test format.
const rows = csv => csv.trimEnd().split("\n").map(line => [...line.matchAll(/"((?:[^"]|"")*)"(?:,|$)/g)].map(match => match[1].replaceAll('""', '"')));
const value = (row, heading) => row[comparisonHeadings.indexOf(heading)];
const output = (pack = dc, observations = prices, date = "2026-09-30", party = pack.scenario) => roomComparisonCsv(pack, party, date, observations);

const taskArgs = party => ["--adults", String(party.adults), "--child-ages", party.child_ages.join(",") || "none",
  "--arrival", party.stay.arrival, "--departure", party.stay.departure];

test("explicit CLI tasks screen family six, an infant extension and changed stays without evidence edits", () => {
  const before = JSON.stringify([london, londonPrices]);
  for (const party of [
    { adults: 2, child_ages: [4, 8, 12, 15], stay: london.scenario.stay },
    { adults: 2, child_ages: [1, 4, 8], stay: london.scenario.stay },
    { adults: 2, child_ages: [4, 8, 12], stay: { arrival: "2026-11-09", departure: "2026-11-14" } }
  ]) {
    const csv = execFileSync(process.execPath, [cli, path("london-room-configurations-2026-09-30.json"),
      "--date", "2026-10-02", ...taskArgs(party), "--prices", ...londonPaths], { encoding: "utf8" });
    assert.equal(csv, output(london, londonPrices, "2026-10-02", party));
    const data = rows(csv).slice(1);
    assert.equal(data.length, 6);
    assert.ok(data.every(row => value(row, "Nightly equivalent") === "" && value(row, "Public rate plan") === "Unpriced"));
    const marlin = data.find(row => value(row, "Hotel").startsWith("Marlin"));
    assert.equal(value(marlin, "Capacity screen"), "CONDITIONAL_PUBLISHED_CAPACITY");
    assert.match(value(marlin, "Capacity conditions"), /paid double sofa/);
    const bloomsbury = data.find(row => value(row, "Hotel").includes("Bloomsbury"));
    assert.equal(value(bloomsbury, "Capacity screen"), party.child_ages.includes(1) ? "CONDITIONAL_PUBLISHED_CAPACITY" : "OUTSIDE_PUBLISHED_LIMIT");
    assert.ok(data.every(row => value(row, "Category checked") === "2026-09-30"));
  }
  assert.equal(JSON.stringify([london, londonPrices]), before);
});

test("matching explicit task retains nightly estimates, reordered ages match, adults-only stays unpriced", () => {
  for (const child_ages of [[4, 8, 12], [12, 4, 8], []]) {
    const party = { adults: 2, child_ages, stay: dc.scenario.stay };
    const csv = execFileSync(process.execPath, [cli, dcPath, "--date", "2026-10-02", ...taskArgs(party), "--prices", ...pricePaths], { encoding: "utf8" });
    assert.equal(csv, output(dc, prices, "2026-10-02", party));
    const data = rows(csv).slice(1);
    assert.equal(data.filter(row => value(row, "Nightly equivalent") !== "").length, child_ages.length ? 6 : 0);
    if (child_ages.length) assert.ok(data.some(row => value(row, "Nightly equivalent") === "288.97"));
  }
});

test("task parser rejects partial, duplicate, malformed ages/adults and invalid dates before output", () => {
  const base = taskArgs(dc.scenario);
  const bad = [base.slice(0, 2), [...base, "--adults", "2"], ["--child-ages", "none"],
    ...["0", "-2", "2.5", "2x", "9007199254740992"].map(adults => ["--adults", adults, ...base.slice(2)]),
    ...["18", "-1", "1.5", "4,,8", ",4", "4,", "4 8", "4,x", ""].map(ages => [...base.slice(0, 2), "--child-ages", ages, ...base.slice(4)]),
    [...base.slice(0, 4), "--arrival", "2026-02-30", "--departure", "2026-11-13"],
    [...base.slice(0, 4), "--arrival", "2026-11-13", "--departure", "2026-11-13"],
    [...base.slice(0, 4), "--arrival", "2026-11-14", "--departure", "2026-11-13"]];
  const dir = mkdtempSync(join(tmpdir(), "ft-room-task-invalid-"));
  try {
    const destination = join(dir, "uncreated", "task.csv");
    for (const options of bad) {
      assert.throws(() => parseRoomComparisonOptions([dcPath, ...options]));
      assert.throws(() => execFileSync(process.execPath, [cli, dcPath, "--date", "2026-10-02", "--output", destination, ...options], { stdio: "pipe" }));
      assert.equal(existsSync(join(dir, "uncreated")), false);
    }
    const input = [dcPath, "--date", "2026-10-02", ...base];
    const original = [...input];
    assert.deepEqual(parseRoomComparisonOptions(input).task, { adults: 2, child_ages: [4, 8, 12], stay: dc.scenario.stay });
    assert.deepEqual(input, original);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test("explicit output checkpoint records the requested family and stay", () => {
  const dir = mkdtempSync(join(tmpdir(), "ft-room-task-summary-"));
  try {
    const party = { adults: 2, child_ages: [4, 8, 12, 15], stay: dc.scenario.stay };
    const destination = join(dir, "six.csv");
    const summary = JSON.parse(execFileSync(process.execPath, [cli, dcPath, "--date", "2026-10-02", ...taskArgs(party), "--prices", ...pricePaths, "--output", destination], { encoding: "utf8" }));
    assert.deepEqual(summary.task, party);
    assert.equal(summary.public_changes, false);
    const data = rows(readFileSync(destination, "utf8")).slice(1);
    assert.equal(data.length, 4);
    assert.ok(data.every(row => value(row, "Nightly equivalent") === ""));
    assert.equal(value(data.find(row => value(row, "Hotel").startsWith("Residence")), "Capacity screen"), "WITHIN_PUBLISHED_CAPACITY");
    assert.equal(value(data.find(row => value(row, "Hotel").startsWith("Homewood")), "Capacity screen"), "OUTSIDE_PUBLISHED_LIMIT");
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test("same-task CSV has one public-plan row, exact budget context and explicit unpriced category", () => {
  const before = JSON.stringify([dc, prices]);
  const [header, ...data] = rows(output());
  assert.deepEqual(header, comparisonHeadings);
  assert.equal(data.length, 7);
  assert.ok(data.every(r => r.length === comparisonHeadings.length));
  const homewood = data.find(r => value(r, "Hotel").startsWith("Homewood") && value(r, "Public rate plan") === "Non-refundable");
  assert.equal(value(homewood, "Displayed stay amount"), "1444.85");
  assert.equal(value(homewood, "Nightly equivalent"), "288.97");
  assert.equal(value(homewood, "Currency"), "USD");
  assert.equal(value(homewood, "Price unit"), "configuration/night");
  assert.equal(value(homewood, "Actual party"), '{"adults":2,"child_ages":[4,8,12]}');
  assert.equal(value(homewood, "Arrival"), "2026-11-08");
  assert.equal(value(homewood, "Departure"), "2026-11-13");
  assert.equal(value(homewood, "Nights"), "5");
  assert.match(value(homewood, "Engine party and age basis"), /provider-age-band-counts/);
  assert.match(value(homewood, "Fee and tax basis"), /15\.95/);
  const pendry = data.find(r => value(r, "Hotel").startsWith("Pendry"));
  assert.equal(value(pendry, "Public rate plan"), "Unpriced");
  assert.equal(value(pendry, "Displayed stay amount"), "");
  assert.equal(value(pendry, "Nightly equivalent"), "");
  assert.equal(value(pendry, "Price observed"), "");
  assert.equal(value(pendry, "Fee and tax basis"), "Unknown");
  assert.match(value(pendry, "Capacity conditions"), /sofa/);
  assert.equal(JSON.stringify([dc, prices]), before);
});

test("independent category and price dates, null cutoffs and full prepayment survive export", () => {
  const residence = rows(output()).slice(1).find(r => value(r, "Hotel").startsWith("Residence"));
  assert.equal(value(residence, "Category checked"), "2026-09-25");
  assert.equal(value(residence, "Price observed"), "2026-09-30");
  assert.equal(value(residence, "Nightly equivalent"), "433.65");
  assert.match(value(residence, "Engine party and age basis"), /"adult_from_age":null/);
  assert.match(value(residence, "Deposit basis"), /not an additional stay fee/);
  assert.match(value(residence, "Cancellation terms"), /October1,2026/);
  assert.match(value(residence, "Fee and tax basis"), /no tax-rate\/component/);
  assert.match(value(residence, "Research scope and limits"), /not a typical seasonal range/);
});

test("London keeps GBP, requested beds and conflicts; no sorting, conversion or offer inheritance", () => {
  const data = rows(output(london, londonPrices)).slice(1);
  assert.equal(data.length, 9);
  assert.ok(data.every(r => value(r, "Currency") === "GBP"));
  assert.equal(value(data[0], "Hotel"), london.records[0].hotel);
  const montague = data.find(r => value(r, "Hotel").includes("Montague"));
  assert.match(value(montague, "Capacity conditions"), /sofa/);
  assert.match(value(montague, "Deposit basis"), /15%/);
  const kensington = data.find(r => value(r, "Hotel").includes("Kensington"));
  assert.equal(value(kensington, "Nightly equivalent"), "");
  assert.match(value(kensington, "Conflicts"), /GBP70/);
  assert.ok(!data.some(r => value(r, "Nightly equivalent") === "555"));
});

test("historical observations and wrong-task gaps remain distinct, member amounts excluded", () => {
  assert.ok(rows(output(dc, prices, "2026-10-31")).slice(1).every(r => value(r, "Capacity screen") === "RECHECK_SOURCE"));
  const old = rows(output(dc, prices, "2026-10-15")).slice(1);
  assert.equal(old.filter(r => value(r, "Price status") === "historical-dated-stay-samples").length, 6);
  const other = rows(output(dc, prices, "2026-09-30", { adults: 2, child_ages: [4, 8, 13], stay: dc.scenario.stay })).slice(1);
  assert.equal(other.length, 4);
  assert.ok(other.every(r => value(r, "Public rate plan") === "Unpriced"));
  const changed = structuredClone(prices);
  changed[0].rates.push({ ...changed[0].rates[0], plan: "Private member control", eligibility: "membership-required", stay_amount: 1 });
  assert.ok(!output(dc, changed).includes("Private member control"));
  const onlyMembers = structuredClone(prices);
  for (const rate of onlyMembers[0].rates) rate.eligibility = "membership-required";
  const embassy = rows(output(dc, onlyMembers)).slice(1).find(r => value(r, "Hotel").startsWith("Embassy"));
  assert.equal(value(embassy, "Public rate plan"), "Unpriced");
  assert.equal(value(embassy, "Nightly equivalent"), "");
});

test("stale exports retain all dated original bed, infant and connection rules without revalidating them", () => {
  const data = rows(output(london, londonPrices, "2026-10-31")).slice(1);
  for (const record of london.records) {
    const matches = data.filter(r => value(r, "Hotel") === record.hotel);
    assert.ok(matches.length);
    for (const r of matches) {
      assert.equal(value(r, "Capacity screen"), "RECHECK_SOURCE");
      assert.equal(value(r, "Capacity conditions"), "Recheck source before screening");
      assert.deepEqual(JSON.parse(value(r, "Recorded capacity rules (dated; not revalidated)")), record.configurations);
      assert.equal(value(r, "Category checked"), london.sources[record.source_id].checked_on);
    }
  }
});

test("quoted cells preserve commas and quotes while neutralizing spreadsheet formula prefixes", () => {
  const changed = structuredClone(dc);
  for (const [i, prefix] of ["=", "+", "-", "@"].entries()) changed.records[i].hotel = `\t${prefix}DANGEROUS,\"text\"\ncontinued`;
  const data = rows(output(changed)).slice(1);
  assert.ok(data.every(r => r.length === comparisonHeadings.length));
  assert.ok(data.every(r => /^'\s*[=+\-@]/.test(value(r, "Hotel"))));
  assert.ok(data.every(r => value(r, "Hotel").includes(',"text" continued')));
});

test("invalid packs, prices, dates, duplicate samples and incomplete stay tasks fail closed", () => {
  assert.throws(() => output(null));
  assert.throws(() => output(dc, [...prices, prices[0]]), /Duplicate/);
  assert.throws(() => output(dc, prices, "2026-09-29"), /Invalid party/);
  assert.throws(() => output(dc, prices, "2026-09-30", { adults: 2, child_ages: [4, 8, 12], stay: { arrival: "2026-11-13", departure: "2026-11-08" } }), /exact arrival/);
  const bad = structuredClone(prices); bad[0].currency = "GBP";
  assert.throws(() => output(dc, bad), /currency/);
});

test("CLI equals API, accepts separate samples, saves exclusively and does not overwrite evidence", () => {
  assert.equal(execFileSync(process.execPath, [cli, dcPath, "--date", "2026-09-30", "--prices", ...pricePaths], { encoding: "utf8" }), output());
  const dir = mkdtempSync(join(tmpdir(), "ft-room-comparison-"));
  try {
    const out = join(dir, "nested", "dc.csv");
    const args = [cli, dcPath, "--prices", ...pricePaths, "--output", out, "--date", "2026-09-30"];
    const summary = JSON.parse(execFileSync(process.execPath, args, { encoding: "utf8" }));
    assert.equal(summary.public_changes, false);
    assert.equal(summary.categories, 4);
    assert.equal(readFileSync(out, "utf8"), output());
    assert.throws(() => execFileSync(process.execPath, args, { stdio: "pipe" }), /EEXIST/);
    assert.equal(readFileSync(out, "utf8"), output());
    const before = readFileSync(dcPath);
    assert.throws(() => execFileSync(process.execPath, [cli, dcPath, "--date", "2026-09-30", "--output", dcPath], { stdio: "pipe" }), /EEXIST/);
    assert.deepEqual(readFileSync(dcPath), before);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test("CLI rejects incomplete, duplicate and unknown options and non-array price files", () => {
  for (const tail of [["--prices"], ["--date"], ["--output"], ["--other"], ["--date", "2026-09-30", "--date", "2026-09-30"], ["--prices", pricePaths[0], "--prices", pricePaths[1]], ["--prices", dcPath]])
    assert.throws(() => execFileSync(process.execPath, [cli, dcPath, ...tail], { stdio: "pipe" }));
  assert.throws(() => execFileSync(process.execPath, [cli], { stdio: "pipe" }));
  const publicPath = fileURLToPath(new URL("../site/downloads/research-not-public.csv", import.meta.url));
  assert.throws(() => execFileSync(process.execPath, [cli, dcPath, "--date", "2026-09-30", "--output", publicPath], { stdio: "pipe" }), /cannot write into the public site/);
});

test("public-site symlink aliases and nonexistent subfolders cannot bypass research-only output", () => {
  const dir = mkdtempSync(join(tmpdir(), "ft-room-alias-"));
  try {
    const alias = join(dir, "public-alias");
    const site = fileURLToPath(new URL("../site/", import.meta.url));
    symlinkSync(site, alias, "dir");
    for (const output of [join(alias, "downloads", "never-publish-research.csv"), join(alias, "uncreated-research", "nested", "research.csv")]) {
      assert.throws(() => execFileSync(process.execPath, [cli, dcPath, "--date", "2026-09-30", "--output", output], { stdio: "pipe" }), /cannot write into the public site/);
      assert.equal(existsSync(output), false);
    }
    assert.equal(existsSync(join(site, "uncreated-research")), false);
    const privateAlias = join(dir, "private-alias");
    symlinkSync(dir, privateAlias, "dir");
    const out = join(privateAlias, "private.csv");
    execFileSync(process.execPath, [cli, dcPath, "--date", "2026-09-30", "--output", out], { stdio: "pipe" });
    assert.equal(readFileSync(out, "utf8"), output(dc, []));
  } finally { rmSync(dir, { recursive: true, force: true }); }
});
