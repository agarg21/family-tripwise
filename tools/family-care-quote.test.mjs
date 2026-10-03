import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync, mkdtempSync, mkdirSync, symlinkSync, realpathSync, rmSync } from "node:fs";
import { execFileSync, spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { careQuoteComparison, careQuoteCsv, careQuoteRoomCheck, parseCareQuoteOptions, validateCareQuote } from "./family-care-quote.mjs";

const path = fileURLToPath(new URL("../docs/research/cancun-room-care-quote-2026-10-02.json", import.meta.url));
const cli = fileURLToPath(new URL("./family-care-quote.mjs", import.meta.url));
const quote = JSON.parse(readFileSync(path, "utf8"));
const date = "2026-10-02";
const mutated = change => { const copy = structuredClone(quote); change(copy); return copy; };
const roomPath = fileURLToPath(new URL("../docs/research/cancun-superior-room-capacity-2026-10-02.json", import.meta.url));
const roomRule = JSON.parse(readFileSync(roomPath, "utf8"));

// Decode the emitted research CSV so nested context must survive escaping, not just a text match.
function csvRows(input) {
  const rows = [], row = [];
  let cell = "", quoted = false;
  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    if (char === '"') {
      if (quoted && input[i + 1] === '"') { cell += '"'; i++; }
      else quoted = !quoted;
    } else if (char === "," && !quoted) { row.push(cell); cell = ""; }
    else if (char === "\n" && !quoted) { row.push(cell); rows.push([...row]); row.length = 0; cell = ""; }
    else cell += char;
  }
  assert.equal(quoted, false);
  return rows;
}

test("dated quote validates, clones without mutation and preserves exact price context", () => {
  const before = structuredClone(quote);
  assert.equal(validateCareQuote(quote, date), quote);
  const result = careQuoteComparison(quote, date);
  assert.deepEqual(result.receipt, quote);
  result.receipt.task.child_ages[0] = 9;
  result.receipt.price_basis.before_care.stay_total = 1;
  assert.deepEqual(quote, before);
  assert.equal(result.applicability, "original-party-category-stay-only-not-repriced");
  assert.equal(result.observation_age_days, 0);
});

test("weekly aging never revalidates or renews the observed price", () => {
  assert.equal(careQuoteComparison(quote, "2026-10-08").observation_age_days, 6);
  const result = careQuoteComparison(quote, "2026-10-09");
  assert.equal(result.observation_age_days, 7);
  assert.equal(result.review_status, "weekly-source-review-due-not-revalidated");
  assert.equal(result.receipt.observed_on, date);
  assert.equal(result.receipt.price_basis.after_selected_care.stay_total, 2934.91);
});

test("CSV has two price configurations and lossless full receipt, fee, care, source and party context", () => {
  const [headers, before, after] = csvRows(careQuoteCsv(quote, date));
  assert.equal(before.length, headers.length);
  assert.equal(after.length, headers.length);
  const field = (row, name) => row[headers.indexOf(name)];
  assert.equal(field(before, "Stay total"), "2638.91");
  assert.equal(field(after, "Stay total"), "2934.91");
  assert.equal(field(before, "Package per night"), "527.78");
  assert.equal(field(after, "Package per night"), "586.98");
  for (const row of [before, after]) {
    assert.deepEqual(JSON.parse(field(row, "Full receipt JSON")), quote);
    assert.deepEqual(JSON.parse(field(row, "Complete price basis JSON")), quote.price_basis);
    assert.deepEqual(JSON.parse(field(row, "Care evidence JSON")), quote.care);
    assert.deepEqual(JSON.parse(field(row, "Source JSON")), quote.source);
    assert.deepEqual(JSON.parse(field(row, "Original task JSON")), quote.task);
    assert.match(field(row, "Currency evidence"), /not explicitly/);
  }
});

test("reject contradictory dates, party mappings, care and arithmetic without coercion", () => {
  const changes = [
    q => q.schema_version = 2,
    q => q.evidence_class = "OFFICIAL_PROPERTY_FACT",
    q => q.observed_on = "2026-10-03",
    q => q.task.adults = "2",
    q => q.task.child_ages[0] = null,
    q => q.task.child_ages = new Array(2),
    q => q.task.child_ages = [2],
    q => q.task.nights = 4,
    q => q.task.departure = "2026-02-30",
    q => q.task.flights_selected = true,
    q => q.task.transfer_selected = true,
    q => q.room.room_count = 0,
    q => q.price_basis.currency = "usd",
    q => q.price_basis.before_care.stay_total = "2638.91",
    q => q.price_basis.before_care.derived_package_per_night = 527,
    q => q.price_basis.before_care.displayed_discounts[0] = 1,
    q => q.price_basis.after_selected_care.stay_total = 3000,
    q => q.price_basis.after_selected_care.additional_care_selection = 297,
    q => q.care[0].selected_addon_amount = 295,
    q => q.care[0].task_child_age = 7,
    q => q.care[0].displayed_ages = [3, 2],
    q => q.care[0].included = true,
    q => q.care[1].additional_selected_charge = 1,
    q => q.price_basis.before_care.stay_total = Infinity,
    q => q.price_basis.membership_fee_displayed = NaN,
    q => q.price_basis.membership_fee_displayed = 1e300,
    q => q.source.property_url = "https://example.com/?proposal=123",
    q => q.source.booking_url = "https://user:pass@example.com/",
    q => q.source.privacy = {},
    q => q.source.publication_date = "2026-10-03",
    q => q.rejected_observation.adult_only_total = -1,
    q => q.extra = "unsupported"
  ];
  for (const change of changes) assert.throws(() => validateCareQuote(mutated(change), date));
  assert.throws(() => validateCareQuote(quote, "2026-02-30"));
  const sparse = mutated(q => delete q.care[0]);
  assert.throws(() => validateCareQuote(sparse, date));
  const iterator = structuredClone(quote);
  iterator.task.child_ages[Symbol.iterator] = function* () { yield 2; yield 7; };
  assert.throws(() => validateCareQuote(iterator, date));
  const hiddenExport = mutated(q => q.care.toJSON = () => []);
  assert.throws(() => validateCareQuote(hiddenExport, date));
  const getter = structuredClone(quote);
  Object.defineProperty(getter.task.child_ages, "0", {get() { throw new Error("Array getter should not execute"); }, enumerable:true});
  assert.throws(() => validateCareQuote(getter, date), /quote party/);
});

test("unsupported billing, admissions and mandatory totals cannot become invented assurances", () => {
  for (const key of ["temporal_billing_unit", "billable_days", "minimum_package", "prorated_90_minute_price", "training_admission_terms", "parent_presence_terms", "three_breaks_confirmed"]) {
    assert.throws(() => validateCareQuote(mutated(q => q.care[0][key] = 1), date));
  }
  for (const key of ["sleeping_assignment", "final_party_acceptance"]) assert.throws(() => validateCareQuote(mutated(q => q.room[key] = true), date));
  for (const key of ["total", "applicable_person_count", "age_exemptions"]) assert.throws(() => validateCareQuote(mutated(q => q.price_basis.external_levy[key] = 0), date));
  assert.throws(() => validateCareQuote(mutated(q => q.price_basis.complete_all_currency_mandatory_total = 2934.91), date));
  assert.throws(() => validateCareQuote(mutated(q => q.care[1].three_breaks_confirmed = true), date));
});

test("nonplain, symbolic or getter evidence is rejected before it can be exported", () => {
  assert.throws(() => validateCareQuote(mutated(q => Object.setPrototypeOf(q.room, {})), date));
  assert.throws(() => validateCareQuote(mutated(q => q.room[Symbol("extra")] = true), date));
  const copy = structuredClone(quote);
  Object.defineProperty(copy.room, "category", {get() { throw new Error("Getter should not execute"); }, enumerable:true});
  assert.throws(() => validateCareQuote(copy, date), /quote fields/);
});

test("CSV neutralizes formula prefixes and escapes quotes while retaining evidence strings", () => {
  const copy = mutated(q => q.room.property = '=SUM(1,2) "test"');
  const rows = csvRows(careQuoteCsv(copy, date));
  assert.equal(rows[1][1], '\'=SUM(1,2) "test"');
  assert.equal(JSON.parse(rows[1].at(-1)).room.property, copy.room.property);
});

test("non-enumerable fields and array entries cannot disappear from cloned exports", () => {
  const changes = [
    q => Object.defineProperty(q.room, "category", {enumerable:false}),
    q => Object.defineProperty(q, "action_id", {enumerable:false}),
    q => Object.defineProperty(q.task.child_ages, "0", {enumerable:false}),
    q => Object.defineProperty(q.care, "0", {enumerable:false}),
    q => Object.defineProperty(q.price_basis.before_care.displayed_discounts, "0", {enumerable:false}),
    q => Object.defineProperty(q.care[0].displayed_ages, "0", {enumerable:false}),
    q => Object.defineProperty(q.price_basis.included_services, "0", {enumerable:false})
  ];
  for (const change of changes) {
    const copy = mutated(change);
    assert.throws(() => validateCareQuote(copy, date));
    assert.throws(() => careQuoteComparison(copy, date));
    assert.throws(() => careQuoteCsv(copy, date));
  }
});

test("strict CLI options do not permit repricing, output writes or network flags", () => {
  assert.deepEqual(parseCareQuoteOptions([path, "--date", date, "--format", "csv"]), {path,date,format:"csv"});
  for (const args of [[], [path,"--date"], [path,"--date",date,"--date",date], [path,"--format","html"], [path,"--child-ages","1,8"], [path,"--output","/tmp/receipt.csv"], [path,"--fetch","yes"]]) assert.throws(() => parseCareQuoteOptions(args));
  const output = execFileSync(process.execPath, [cli,path,"--date",date], {encoding:"utf8"});
  assert.deepEqual(JSON.parse(output),careQuoteComparison(quote,date));
  assert.equal(execFileSync(process.execPath,[cli,path,"--date",date,"--format","csv"],{encoding:"utf8"}),careQuoteCsv(quote,date));
  assert.throws(() => execFileSync(process.execPath,[cli,path,"--child-ages","2,8"],{stdio:"pipe"}));
});

test("source room maximum flags a count conflict without inferring infant exemption or rejection", () => {
  const result = careQuoteComparison(quote, date, roomRule);
  assert.equal(result.room_capacity_check.status, "source-count-conflict-needs-age-category-resolution");
  assert.equal(result.room_capacity_check.party_count, 4);
  assert.equal(result.room_capacity_check.published_max_guests, 3);
  assert.equal(result.room_capacity_check.age_count_exception, "unknown-not-applied");
  assert.equal(result.room_capacity_check.booking_acceptance, "unconfirmed");
  assert.deepEqual(result.receipt, quote);
  const before = structuredClone(roomRule);
  result.room_capacity_check.evidence.published_max_guests = 100;
  assert.deepEqual(roomRule, before);
});

test("CLI exports and rejects invalid flags through file, directory and relative symlinks", () => {
  const root = mkdtempSync(join(tmpdir(), "ft-care-quote-entry-"));
  try {
    const aliases = join(root, "aliases");
    mkdirSync(aliases);
    const file = join(aliases, "care-quote.mjs"), directory = join(aliases, "tools");
    symlinkSync(cli, file);
    symlinkSync(dirname(cli), directory, "dir");
    const directoryFile = join(directory, "family-care-quote.mjs");
    const entries = [...new Set([file, directoryFile, relative(process.cwd(), file), relative(process.cwd(), directoryFile), realpathSync(file)])];
    const before = readFileSync(path), roomBefore = readFileSync(roomPath);
    for (const entry of entries) {
      for (const rule of [false, true]) {
        const flags = rule ? ["--room-evidence", roomPath] : [];
        assert.deepEqual(JSON.parse(execFileSync(process.execPath, [entry, path, "--date", date, ...flags], {encoding:"utf8"})), careQuoteComparison(quote, date, rule ? roomRule : null));
        assert.equal(execFileSync(process.execPath, [entry, path, "--date", date, "--format", "csv", ...flags], {encoding:"utf8"}), careQuoteCsv(quote, date, rule ? roomRule : null));
      }
      for (const args of [[], [path, "--network", "yes"], [path, "--date"], [path, "--room-evidence"]]) {
        const result = spawnSync(process.execPath, [entry, ...args], {encoding:"utf8"});
        assert.notEqual(result.status, 0);
        assert.equal(result.stdout, "");
        assert.notEqual(result.stderr, "");
      }
    }
    assert.deepEqual(readFileSync(path), before);
    assert.deepEqual(readFileSync(roomPath), roomBefore);
  } finally { rmSync(root, {recursive:true, force:true}); }
});

test("library imports stay quiet for absent, nonexistent and unrelated argv entries", () => {
  for (const argv of ["delete process.argv[1]", "process.argv[1] = '/nonexistent-family-tripwise-entry.mjs'", "process.argv[1] = process.execPath"]) {
    const script = `${argv}; const m = await import(${JSON.stringify(new URL("./family-care-quote.mjs", import.meta.url).href)}); if (typeof m.careQuoteCsv !== 'function') throw Error('missing API');`;
    const result = spawnSync(process.execPath, ["--input-type=module", "-e", script], {encoding:"utf8"});
    assert.equal(result.status, 0, result.stderr);
    assert.equal(result.stdout, "");
    assert.equal(result.stderr, "");
  }
});

test("absent evidence and within-count controls never imply booking acceptance", () => {
  assert.equal(careQuoteComparison(quote, date).room_capacity_check.status, "not-checked-no-room-rule");
  const within = {...roomRule, published_max_guests:4};
  const result = careQuoteRoomCheck(quote, within, date);
  assert.equal(result.status, "within-published-count-not-booking-confirmation");
  assert.equal(result.booking_acceptance, "unconfirmed");
  assert.equal(result.evidence.sleeping_assignment, null);
});

test("room rule dates age independently and never renew quote observations", () => {
  const earlier = {...roomRule, observed_on:"2026-10-01"};
  const result = careQuoteComparison(quote, "2026-10-08", earlier);
  assert.equal(result.observation_age_days, 6);
  assert.equal(result.room_capacity_check.observation_age_days, 7);
  assert.equal(result.room_capacity_check.review_status, "weekly-room-rule-review-due-not-revalidated");
  assert.equal(result.room_capacity_check.status, "source-count-conflict-needs-age-category-resolution");
  assert.equal(result.receipt.observed_on, date);
  assert.equal(result.room_capacity_check.evidence.observed_on, "2026-10-01");
});

test("both price CSV rows retain full rule and receipt plus scannable count status", () => {
  const json = careQuoteComparison(quote, date, roomRule);
  const [headers, ...rows] = csvRows(careQuoteCsv(quote, date, roomRule));
  assert.equal(rows.length, 2);
  for (const row of rows) {
    assert.equal(row.length, headers.length);
    assert.equal(row[headers.indexOf("Room count status")], json.room_capacity_check.status);
    assert.deepEqual(JSON.parse(row[headers.indexOf("Room capacity check JSON")]), json.room_capacity_check);
    assert.deepEqual(JSON.parse(row[headers.indexOf("Full receipt JSON")]), quote);
  }
  assert.equal(rows[0][headers.indexOf("Package per night")], "527.78");
  assert.equal(rows[1][headers.indexOf("Package per night")], "586.98");
});

test("reject mismatched, unsupported or unsafe room rules before output", () => {
  const changes = [
    r => r.property = "Another resort",
    r => r.category = "Interconnecting Superior Rooms",
    r => r.property_url = "https://www.clubmed.us/r/other/y",
    r => r.property_url += "?session=secret",
    r => r.schema_version = 2,
    r => r.evidence_class = "BOOKING_CHECK",
    r => r.observed_on = "2026-10-03",
    r => r.published_on = "2026-10-03",
    r => r.published_max_guests = "3",
    r => r.published_max_guests = 0,
    r => r.published_max_guests = 31,
    r => r.published_max_guests = Infinity,
    r => r.source_record = "../secret.json",
    r => r.baby_bed = "",
    r => r.age_count_exception = true,
    r => r.sleeping_assignment = "four beds",
    r => r.booking_acceptance = true,
    r => r.extra = "hidden",
    r => Object.defineProperty(r, "property", {enumerable:false}),
    r => Object.defineProperty(r, "category", {enumerable:true, get() {throw new Error("Getter must not run");}}),
    r => Object.setPrototypeOf(r, {})
  ];
  for (const change of changes) {
    const copy = structuredClone(roomRule); change(copy);
    assert.throws(() => careQuoteComparison(quote, date, copy));
    assert.throws(() => careQuoteCsv(quote, date, copy));
  }
  let traps = 0;
  const proxy = new Proxy(roomRule, {get() {traps++;throw new Error("Proxy must not run");}, ownKeys() {traps++;throw new Error("Proxy must not run");}});
  assert.throws(() => careQuoteRoomCheck(quote, proxy, date), /Proxied/);
  assert.equal(traps, 0);
  assert.throws(() => careQuoteRoomCheck(mutated(q => q.room.room_count = 2), roomRule, date), /multiple-room/);
});

test("CLI optional evidence matches both API formats without writing or repricing", () => {
  const args = [path,"--date",date,"--room-evidence",roomPath];
  assert.equal(parseCareQuoteOptions(args).roomEvidencePath, roomPath);
  assert.deepEqual(JSON.parse(execFileSync(process.execPath,[cli,...args],{encoding:"utf8"})),careQuoteComparison(quote,date,roomRule));
  assert.equal(execFileSync(process.execPath,[cli,...args,"--format","csv"],{encoding:"utf8"}),careQuoteCsv(quote,date,roomRule));
  assert.throws(() => parseCareQuoteOptions([path,"--room-evidence"]));
  assert.throws(() => parseCareQuoteOptions([...args,"--room-evidence",roomPath]));
});
