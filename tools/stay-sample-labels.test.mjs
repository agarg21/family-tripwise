import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { findPastStaySamples } from "./content-freshness.mjs";

// Q16: stay samples must stay correctly labelled after their example dates pass,
// without the committed pages depending on the build date.
const siteDir = fileURLToPath(new URL("../site/", import.meta.url));
const walk = dir => readdirSync(dir).flatMap(entry => {
  const path = join(dir, entry);
  return statSync(path).isDirectory() ? walk(path) : [path];
});
const files = walk(siteDir);

for (const now of ["2026-11-08", "2026-11-09", "2026-11-14", "2027-01-15"].map(day => new Date(`${day}T12:00:00Z`))) {
  test(`no unlabelled past-stay sample in site pages or downloads on ${now.toISOString().slice(0, 10)}`, () => {
    const found = [];
    for (const file of files) {
      if (file.endsWith(".html")) {
        found.push(...findPastStaySamples(readFileSync(file, "utf8"), { now }).map(sample => `${file}: ${sample}`));
      } else if (/\/downloads\/[^/]+\.(?:csv|txt)$/.test(file)) {
        for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
          found.push(...findPastStaySamples(`<p>${line.replaceAll("<", " ")}</p>`, { now }).map(sample => `${file}: ${sample}`));
        }
      }
    }
    assert.deepEqual(found, []);
  });
}

test("Cancun labels do not claim dates passed for stays that had not begun on the label date", () => {
  const csv = readFileSync(join(siteDir, "downloads/cancun-room-comparison.csv"), "utf8");
  assert.match(csv, /"older observation; stay starts 2026-11-09"/);
  assert.doesNotMatch(csv, /"no"/);
  const page = readFileSync(join(siteDir, "where-to-stay/cancun-family-resorts.html"), "utf8");
  assert.match(page, /Older observation; not a current quote\. November 9-12, 2026/);
});

// Q02b: CSV downloads carry ISO arrival columns; a priced row must say it is an older observation.
const parseCsv = text => {
  const rows = [[]];let field = "", quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) { if (c === '"' && text[i + 1] === '"') { field += '"'; i++; } else if (c === '"') quoted = false; else field += c; }
    else if (c === '"') quoted = true;
    else if (c === ",") { rows.at(-1).push(field); field = ""; }
    else if (c === "\n" || c === "\r") { if (c === "\r" && text[i + 1] === "\n") i++; rows.at(-1).push(field); field = ""; rows.push([]); }
    else field += c;
  }
  if (field || rows.at(-1).length) rows.at(-1).push(field);
  return rows.filter(row => row.length > 1);
};
const PRICE_COLUMNS = ["Displayed stay amount", "Displayed nightly", "Displayed stay total", "Approx nightly price", "Estimated stay total", "Derived approximate nightly"];
// Q02c: stay dates may sit in an "Arrival", "Check-in" or "Stay dates" column, as ISO dates or "November 8-13, 2026".
const STAY_DATE_COLUMN = /^(?:arrival|check-?in(?: date)?|stay dates?|.*\bstay date\b.*)$/i;
const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
const stayStart = cell => {
  const iso = /\b(\d{4})-(\d{2})-(\d{2})\b/.exec(cell);
  if (iso) return Date.UTC(+iso[1], +iso[2] - 1, +iso[3]);
  const named = /\b([A-Za-z]{3})[a-z]*\.?\s+(\d{1,2})(?:\s*[-–]\s*(?:[A-Za-z]+\.?\s+)?\d{1,2})?,?\s+(\d{4})\b/.exec(cell);
  const month = named ? MONTHS.indexOf(named[1].toLowerCase()) : -1;
  return month >= 0 ? Date.UTC(+named[3], month, +named[2]) : null;
};
const csvFiles = files.filter(file => /\/downloads\/[^/]+\.csv$/.test(file));
export function unlabelledIsoStayRows(text, now) {
  const [head, ...rows] = parseCsv(text), arrival = head.findIndex(name => STAY_DATE_COLUMN.test(name.trim()));
  if (arrival < 0) return [];
  const headerLabelled = /older|passed/i.test(head[arrival]);
  const priced = head.map((name, index) => PRICE_COLUMNS.includes(name) || /^older .*sample \(/i.test(name) ? index : -1).filter(index => index >= 0);
  return rows.filter(row => { const start = stayStart(row[arrival] ?? ""); return start !== null && start <= now.getTime() &&
    priced.some(index => (row[index] ?? "").trim() !== "") && !headerLabelled && !/older observation|dates passed|stay dates have passed/i.test(row.join(" ")); })
    .map(row => `${row[0]} | ${row[1]} | ${row[arrival]}`);
}

test("the CSV checker parses quoted fields and flags only priced, unlabelled past ISO arrivals", () => {
  const now = new Date("2026-11-14T12:00:00Z"), head = '"Hotel","Arrival","Displayed stay amount","Limits"\n';
  assert.deepEqual(unlabelledIsoStayRows(head + '"A, ""B""","2026-11-08","1200","Dated sample"\n', now), ['A, "B" | 2026-11-08 | 2026-11-08']);
  assert.deepEqual(unlabelledIsoStayRows(head + '"A","2026-11-08","1200","Older observation; not a current quote."\n', now), []);
  assert.deepEqual(unlabelledIsoStayRows(head + '"A","2026-11-08","","Unpriced"\n', now), []);
  assert.deepEqual(unlabelledIsoStayRows(head + '"A","2026-12-08","1200","Dated sample"\n', now), []);
  const checkIn = '"Hotel","Room","Check-in","Displayed nightly"\n', stay = '"Hotel","Room","Stay dates","Estimated stay total"\n';
  assert.deepEqual(unlabelledIsoStayRows(checkIn + '"A","Suite","2026-11-08","300"\n', now), ["A | Suite | 2026-11-08"]);
  assert.deepEqual(unlabelledIsoStayRows(stay + '"A","Suite","2026-11-08 to 2026-11-13","1500"\n', now), ["A | Suite | 2026-11-08 to 2026-11-13"]);
  assert.deepEqual(unlabelledIsoStayRows(stay + '"A","Suite","November 8-13, 2026","1500"\n', now), ["A | Suite | November 8-13, 2026"]);
  assert.deepEqual(unlabelledIsoStayRows(stay + '"A","Suite","November 8-13, 2026 (older observation)","1500"\n', now), []);
  assert.deepEqual(unlabelledIsoStayRows('"Hotel","Room","Older sample stay date (passed)","Older one-night sample (USD/room)"\n"A","King","2026-08-11","$282"\n', now), []);
  assert.deepEqual(unlabelledIsoStayRows('"Hotel","Room","Sample stay date","Older one-night sample (USD/room)"\n"A","King","2026-08-11","$282"\n', now), ["A | King | 2026-08-11"]);
});

for (const now of ["2026-11-08", "2026-11-14", "2027-01-15"].map(day => new Date(`${day}T12:00:00Z`))) {
  test(`priced ISO-dated stay rows in CSV downloads are labelled as older observations on ${now.toISOString().slice(0, 10)}`, () => {
    assert.ok(["boston-family-hotels.csv", "orlando-dated-rates.csv", "chicago-family-hotels.csv"].every(name => csvFiles.some(file => file.endsWith(name))));
    const found = csvFiles.flatMap(file => unlabelledIsoStayRows(readFileSync(file, "utf8"), now).map(row => `${file}: ${row}`));
    assert.deepEqual(found, []);
  });
}

test("Cancun room CSV names its status column without implying every stay has passed", () => {
  const head = readFileSync(join(siteDir, "downloads/cancun-room-comparison.csv"), "utf8").split(/\r?\n/)[0];
  assert.match(head, /"Stay-date status"/);assert.doesNotMatch(head, /Stay dates passed/);
});

test("labelOlderStaySamples labels only priced rows, keeps every other byte and is idempotent", async () => {
  const { comparisonHeadings, labelOlderStaySamples, OLDER_STAY_SAMPLE_LABEL } = await import("./family-room-comparison.mjs");
  const q = row => row.map(v => `"${String(v).replaceAll('"', '""')}"`).join(",");
  const row = (observed, amount, limits) => comparisonHeadings.map(h => h === "Price observed" ? observed : h === "Displayed stay amount" ? amount : h === "Observation limits" ? limits : h === "Hotel" ? 'Say "hi", ok' : "'-x");
  const csv = [comparisonHeadings, row("2026-10-03", "1200", "Counts only"), row("", "", "Not observed")].map(q).join("\n") + "\n";
  const out = labelOlderStaySamples(csv);
  assert.equal(out, [comparisonHeadings, row("2026-10-03", "1200", OLDER_STAY_SAMPLE_LABEL + "Counts only"), row("", "", "Not observed")].map(q).join("\n") + "\n");
  assert.equal(labelOlderStaySamples(out), out);
  assert.throws(() => labelOlderStaySamples('"Other"\n"x"\n'));
});
