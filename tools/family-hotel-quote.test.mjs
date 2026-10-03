import assert from "node:assert/strict";
import test from "node:test";
import { mkdtempSync, mkdirSync, readFileSync, realpathSync, rmSync, symlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative } from "node:path";
import { execFileSync, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { hotelQuoteComparison, hotelQuoteCsv, parseHotelQuoteOptions, validateHotelQuote } from "./family-hotel-quote.mjs";

const path = fileURLToPath(new URL("../docs/research/orlando-cabana-family-price-2026-10-02.json", import.meta.url));
const cli = fileURLToPath(new URL("./family-hotel-quote.mjs", import.meta.url));
const quote = JSON.parse(readFileSync(path, "utf8"));
const date = "2026-10-02";
const mutated = change => { const copy = structuredClone(quote); change(copy); return copy; };

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

test("hotel quote comparison retains original source and defensively clones it", () => {
  const before = structuredClone(quote);
  assert.equal(validateHotelQuote(quote, date), quote);
  const result = hotelQuoteComparison(quote, date);
  assert.deepEqual(result.receipt, quote);
  assert.equal(result.applicability, "original-count-only-party-category-stay-only-not-repriced");
  assert.equal(result.price_basis, "separate-dated-rate-plans-not-seasonal-range-or-complete-budget");
  assert.equal(result.room_count_status, "within-published-count-not-booking-acceptance");
  result.receipt.task.requested_child_ages[0] = 9;
  result.receipt.plans[0].displayed_stay_total = 1;
  assert.deepEqual(quote, before);
});

test("explicit due-date boundary preserves prices and never renews source facts", () => {
  const fresh = hotelQuoteComparison(quote, "2026-10-08");
  assert.equal(fresh.observation_age_days, 6);
  assert.equal(fresh.review_status, "dated-nonbinding-observation-not-current-quote");
  for (const screen of ["2026-10-09", "2026-11-20"]) {
    const result = hotelQuoteComparison(quote, screen);
    assert.equal(result.review_status, "source-review-due-not-revalidated");
    assert.deepEqual(result.receipt, quote);
    assert.equal(result.source_recheck_due, "2026-10-09");
  }
  const earlier = mutated(q => q.use.source_recheck_due = "2026-10-05");
  assert.equal(hotelQuoteComparison(earlier, "2026-10-05").review_status, "source-review-due-not-revalidated");
});

test("CSV plan rows preserve complete receipt and adjacent budget context", () => {
  const [headers, ...rows] = csvRows(hotelQuoteCsv(quote, date));
  assert.equal(rows.length, 2);
  const field = (row, name) => row[headers.indexOf(name)];
  rows.forEach((row, i) => {
    const plan = quote.plans[i];
    assert.equal(row.length, headers.length);
    assert.equal(field(row, "Plan"), plan.name);
    assert.equal(Number(field(row, "Average before displayed tax")), plan.average_before_displayed_tax);
    assert.equal(Number(field(row, "Average with displayed tax")), plan.derived_average_with_displayed_tax);
    assert.equal(Number(field(row, "Displayed stay total")), plan.displayed_stay_total);
    assert.equal(field(row, "Observed on"), quote.observed_on);
    assert.equal(field(row, "Room category"), quote.room_category);
    assert.equal(field(row, "Plan source"), plan.source_url);
    for (const [name, expected] of [["Original task JSON", quote.task], ["Persisted party JSON", quote.persisted_party], ["Currency evidence JSON", quote.currency], ["Room facts JSON", quote.room_facts_observed], ["Plan context JSON", plan], ["Unresolved budget JSON", quote.unresolved_budget], ["Full receipt JSON", quote]]) assert.deepEqual(JSON.parse(field(row, name)), expected);
    assert.equal(JSON.parse(field(row, "Plan context JSON")).cancellation_terms, null);
    assert.equal(JSON.parse(field(row, "Unresolved budget JSON")).final_all_fee_total, null);
  });
});

test("reject invalid source, task, currency, terms, dates and price arithmetic", () => {
  const changes = [
    q => q.schema_version = 2, q => q.evidence_class = "OFFICIAL_PROPERTY_FACT",
    q => q.observed_on = "2026-10-03", q => q.observed_on = "2026-02-30",
    q => q.property = "", q => q.room_category = null, q => q.extra = "unsupported",
    q => q.task.rooms = 2, q => q.task.adults = "2", q => q.task.requested_child_ages[0] = -1,
    q => q.task.requested_child_ages[0] = 18, q => q.task.nights = 4,
    q => q.task.departure = "2026-11-07", q => q.task.arrival = "2026-02-30",
    q => q.persisted_party.children = 3, q => q.persisted_party.adults = 1,
    q => q.persisted_party.individual_ages_entered = true,
    q => q.persisted_party.individual_ages_verified = [4, 8, 12, 15],
    q => q.persisted_party.child_band_displayed = "0 - 12 yrs",
    q => q.currency.explicit_iso_code_observed = true, q => q.currency.code_interpretation = "GBP",
    q => q.currency.basis = "", q => q.room_facts_observed.maximum_occupancy = 0,
    q => q.room_facts_observed.area_sqft = NaN, q => q.plans = [],
    q => q.plans[0].unit = "per person per night", q => q.plans[0].nightly_before_displayed_tax.pop(),
    q => q.plans[0].nightly_before_displayed_tax[0] = 0,
    q => q.plans[0].room_subtotal = 907, q => q.plans[0].displayed_taxes = 0,
    q => q.plans[0].displayed_stay_total = 1, q => q.plans[0].average_before_displayed_tax = 181,
    q => q.plans[0].derived_average_with_displayed_tax = 203,
    q => q.plans[0].nightly_before_displayed_tax[0] = "196",
    q => q.plans[0].displayed_taxes = Infinity, q => q.plans[0].displayed_taxes = 113.251,
    q => q.plans[0].displayed_taxes = 1e300, q => q.plans[0].cancellation_terms = "refundable",
    q => q.plans[1].name = q.plans[0].name, q => q.unresolved_budget.resort_fee = 0,
    q => q.unresolved_budget.final_all_fee_total = 1019.25,
    q => q.use.source_recheck_due = date, q => q.use.source_recheck_due = "2026-11-02",
    q => q.use.public_model_changed = true, q => q.use.prior_source_dates_renewed = true,
    q => q.use.paid_api_calls = 1
  ];
  for (const change of changes) for (const run of [validateHotelQuote, hotelQuoteComparison, hotelQuoteCsv]) assert.throws(() => run(mutated(change), date));
  assert.throws(() => validateHotelQuote(quote, "2026-02-30"));
});

test("public URLs reject credentials, session data, duplicate and unapproved parameters", () => {
  const bad = ["http://example.com/", "https://user:pass@example.com/", "https://example.com/#secret", "https://example.com/?token=abc", "https://reservations.universalorlando.com/ibe/details.aspx?access=secret", "https://reservations.universalorlando.com/ibe/details.aspx?hotelID=1&hotelID=2", "https://reservations.universalorlando.com/ibe/details.aspx?lang=secret", "https://reservations.universalorlando.com/ibe/details.aspx?hotelID=secret", "https://reservations.universalorlando.com/ibe/details.aspx?voucher=secret", "https://reservations.universalorlando.com/ibe/details.aspx?email=private"];
  for (const url of bad) {
    assert.throws(() => validateHotelQuote(mutated(q => q.booking_source_url = url), date));
    assert.throws(() => validateHotelQuote(mutated(q => q.plans[0].source_url = url), date));
  }
  assert.throws(() => validateHotelQuote(mutated(q => q.room_source_url += "?hotelID=1"), date));
});

test("reject proxies, getters, hidden fields, exotic objects and sparse arrays before side effects", () => {
  for (const run of [validateHotelQuote, hotelQuoteComparison, hotelQuoteCsv]) {
    for (const field of [null, "task", "persisted_party", "currency", "plans", "unresolved_budget", "use"]) {
      let traps = 0;
      const q = structuredClone(quote);
      const proxy = new Proxy(field === null ? q : q[field], { get() { traps++; throw Error("trap"); }, ownKeys() { traps++; throw Error("trap"); }, getPrototypeOf() { traps++; throw Error("trap"); } });
      if (field !== null) q[field] = proxy;
      assert.throws(() => run(field === null ? proxy : q, date), /Nonplain/);
      assert.equal(traps, 0);
    }
    for (const change of [
      q => Object.defineProperty(q, "property", { get() { throw Error("getter executed"); }, enumerable: true }),
      q => Object.defineProperty(q.task, "adults", { value: 2, enumerable: false }),
      q => Object.defineProperty(q.plans, "0", { value: q.plans[0], enumerable: false }),
      q => delete q.task.requested_child_ages[0],
      q => q.task.requested_child_ages.toJSON = () => [],
      q => q.plans[Symbol.iterator] = function* () { yield q.plans[0]; },
      q => q.task = Object.assign(Object.create(null), q.task),
      q => q.extra = q, q => q.extra = new Date(), q => q.extra = undefined,
      q => q.property = "a".repeat(20001)
    ]) assert.throws(() => run(mutated(change), date));
  }
});

test("published count screening never infers final acceptance or sleeping allocation", () => {
  const conflict = mutated(q => q.room_facts_observed.maximum_occupancy = 5);
  assert.equal(hotelQuoteComparison(conflict, date).room_count_status, "published-count-conflict-not-final-booking-decision");
  assert.equal(hotelQuoteComparison(quote, date).receipt.persisted_party.individual_ages_verified, null);
});

test("CSV escapes formula-like text and retains quotes, commas and newlines", () => {
  for (const value of ["=SUM(1,2)", " +1", "\t@x", "\r-1", "\u0000=1"]) {
    const q = mutated(q => q.plans[0].name = value);
    const [headers, row] = csvRows(hotelQuoteCsv(q, date));
    assert.equal(row[0], "'" + value);
    assert.deepEqual(JSON.parse(row[headers.indexOf("Full receipt JSON")]), q);
  }
  const q = mutated(q => q.property = 'Hotel, "Poolside"\nFamily');
  const [headers, row] = csvRows(hotelQuoteCsv(q, date));
  assert.equal(row[headers.indexOf("Property")], q.property);
  assert.deepEqual(JSON.parse(row[headers.indexOf("Full receipt JSON")]), q);
});

test("CLI matches API outputs, validates flags and performs no source writes", () => {
  const before = readFileSync(path);
  assert.deepEqual(JSON.parse(execFileSync(process.execPath, [cli, path, "--date", date], { encoding: "utf8" })), hotelQuoteComparison(quote, date));
  assert.equal(execFileSync(process.execPath, [cli, path, "--format", "csv", "--date", date], { encoding: "utf8" }), hotelQuoteCsv(quote, date));
  assert.deepEqual(readFileSync(path), before);
  for (const args of [[], [path, "--network", "yes"], [path, "--date"], [path, "--date", date, "--date", date], [path, "--format", "pdf"], [path, "--date", "2026-02-30"], [path, "--room-evidence", "other.json"]]) {
    assert.throws(() => parseHotelQuoteOptions(args));
    const result = spawnSync(process.execPath, [cli, ...args], { encoding: "utf8" });
    assert.notEqual(result.status, 0);
    assert.equal(result.stdout, "");
  }
});

test("CLI runs through file and directory symlinks without silently succeeding", () => {
  const root = mkdtempSync(join(tmpdir(), "ft-hotel-quote-entry-"));
  try {
    const aliases = join(root, "aliases");
    mkdirSync(aliases);
    const file = join(aliases, "hotel-quote.mjs"), directory = join(aliases, "tools");
    symlinkSync(cli, file);
    symlinkSync(dirname(cli), directory, "dir");
    const directoryFile = join(directory, "family-hotel-quote.mjs");
    const invocations = [...new Set([file, directoryFile, relative(process.cwd(), file), relative(process.cwd(), directoryFile), realpathSync(file), realpathSync(directoryFile)])];
    const before = readFileSync(path);
    for (const entry of invocations) {
      assert.deepEqual(JSON.parse(execFileSync(process.execPath, [entry, path, "--date", date], { encoding: "utf8" })), hotelQuoteComparison(quote, date));
      assert.equal(execFileSync(process.execPath, [entry, path, "--format", "csv", "--date", date], { encoding: "utf8" }), hotelQuoteCsv(quote, date));
      const bad = spawnSync(process.execPath, [entry, path, "--network", "yes"], { encoding: "utf8" });
      assert.notEqual(bad.status, 0);
      assert.equal(bad.stdout, "");
      assert.match(bad.stderr, /Unknown, duplicate or incomplete/);
    }
    assert.deepEqual(readFileSync(path), before);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test("library imports do not run CLI, including absent and nonexistent argv entry paths", () => {
  for (const argv of ["delete process.argv[1]", "process.argv[1] = '/nonexistent-family-tripwise-entry.mjs'", "process.argv[1] = process.execPath"]) {
    const script = `${argv}; const m = await import(${JSON.stringify(new URL("./family-hotel-quote.mjs", import.meta.url).href)}); if (typeof m.hotelQuoteCsv !== 'function') throw Error('missing API');`;
    const result = spawnSync(process.execPath, ["--input-type=module", "-e", script], { encoding: "utf8" });
    assert.equal(result.status, 0, result.stderr);
    assert.equal(result.stdout, "");
    assert.equal(result.stderr, "");
  }
});
