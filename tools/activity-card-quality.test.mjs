import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { activityPages } from "./page-generation/upgrade-page-data.mjs";
import { activityCardEvidence, validateActivityCardEvidence, activityCardQualityReport, validateActivityCardPaths } from "./activity-card-quality.mjs";

const cli = fileURLToPath(new URL("./activity-card-quality.mjs", import.meta.url));
const records = () => activityCardEvidence();

test("all 37 cards retain exact source-model values and only page-level provenance", async () => {
  const before = JSON.stringify(activityPages), data = records();
  assert.equal(data.length, 3);
  assert.equal(data.reduce((n, page) => n + page.cards.length, 0), 37);
  for (const page of data) {
    const model = activityPages[new URL(page.page_url).pathname.slice(1)];
    assert.deepEqual(page.cards, model.activityCards);
    assert.deepEqual(page.page_source_inventory, model.sources);
    assert.equal(page.source_note, model.sourcesIntro);
    assert.equal(page.comparison_note, model.comparisonNote);
    assert.equal(page.verified_on, null);
    assert.equal(page.field_source_mapping, "unmapped");
  }
  await validateActivityCardPaths(data);
  data[0].cards[0].tags.push("test"); data[0].page_source_inventory[0][0] = "changed";
  assert.equal(JSON.stringify(activityPages), before);
  assert.notDeepEqual(data, records());
});

test("deterministic 333-field queue prioritizes exact budgets without inventing prices or dates", async () => {
  const data = records(), before = JSON.stringify(data), report = activityCardQualityReport(data, { today: "2026-10-01" });
  assert.deepEqual(report.summary, { retained_pages: 3, attractions: 37, fields: 333, atomic_source_gaps: 333, unpriced_exact_visit_budgets: 37 });
  assert.equal(report.automatic_fact_renewal, false); assert.equal(report.automatic_publication, false);
  assert.equal(report.other_activity_models.length, 3);
  assert.ok(report.tasks.slice(0, 37).every(task => task.field === "cost" && task.priority === 1));
  assert.ok(report.tasks.every(task => task.verified_on === null && task.page_note_age.state === "review-due"));
  assert.ok(report.tasks.some(task => task.retained_value === "Free"));
  assert.equal(JSON.stringify(data), before);
  assert.deepEqual(report, activityCardQualityReport(records(), { today: "2026-10-01" }));
  assert.deepEqual(report, JSON.parse(await readFile(new URL("../ops/page-quality/2026-10-01-activity-cards.json", import.meta.url), "utf8")));
  report.pages[0].cards[0].name = "changed"; assert.equal(JSON.stringify(data), before);
});

test("schema rejects provenance promotion, extra/private fields, unsafe sources and malformed cards", () => {
  const mutations = [
    d => d[0].extra = "secret", d => d[0].schema_version = 2, d => d[0].verified_on = "2026-10-01",
    d => d[0].field_evidence_class = "OFFICIAL_FACT", d => d[0].field_source_mapping = "mapped",
    d => d[0].model_path = "../secret", d => d[0].retained_page_source_date = "2026-10-01",
    d => d[0].source_note = "checked October 1, 2026.", d => d[0].comparison_note = "",
    d => d[0].page_url += "?token=secret", d => d.push(structuredClone(d[0])), d => d.pop(),
    d => d[0].cards[0].name = "", d => d[0].cards.push(structuredClone(d[0].cards[0])),
    d => d[0].cards[0].price = 25, d => d[0].cards[0].cost = 0, d => d[0].cards[0].tags = ["private?email=x"],
    d => d[0].page_source_inventory = [], d => d[0].page_source_inventory[0].push("secret"),
    d => d[0].page_source_inventory.push(structuredClone(d[0].page_source_inventory[0])),
  ];
  for (const mutate of mutations) { const d = records(); mutate(d); assert.ok(validateActivityCardEvidence(d).length); assert.throws(() => activityCardQualityReport(d)); }
  for (const url of ["http://example.com/", "https://u:p@example.com/", "https://example.com:8443/", "https://example.com/?token=secret", "https://example.com/#secret", "invalid"]) {
    const d = records(); d[0].page_source_inventory[0][1] = url; assert.ok(validateActivityCardEvidence(d).length);
  }
  const ticket = records()[2].page_source_inventory.find(source => source[1].includes("EventID"));
  assert.equal(ticket[1], "https://tickets.nysci.org/Info.aspx?EventID=3");
  for (const url of [ticket[1] + "&token=private", ticket[1].replace("3", "4"), ticket[1].replace("tickets.nysci.org", "example.com")]) {
    const d = records(); d[2].page_source_inventory.find(source => source[1].includes("EventID"))[1] = url;
    assert.ok(validateActivityCardEvidence(d).length);
  }
  assert.ok(validateActivityCardEvidence(null).length);
  assert.ok(validateActivityCardEvidence([null]).length);
});

test("source-model source-note drift and malformed cards require reconciliation", () => {
  const models = structuredClone(activityPages);
  models["things-to-do/chicago-with-kids.html"].sourcesIntro = "checked October 1, 2026.";
  assert.throws(() => activityCardEvidence(models), /drift/);
  const bad = structuredClone(activityPages); bad["things-to-do/chicago-with-kids.html"].activityCards[0].extra = "private";
  assert.throws(() => activityCardEvidence(bad), /keys/);
});

test("invalid/future report dates do not establish fresh fields", () => {
  for (const today of ["2026-02-30", "2026-10-1", null, "invalid"]) assert.throws(() => activityCardQualityReport(records(), { today }), /Invalid/);
  const report = activityCardQualityReport(records(), { today: "2026-07-01" });
  assert.ok(report.tasks.every(task => task.page_note_age.state === "future-date-review" && task.verified_on === null));
});

test("CLI/API parity, strict options and immutable output including sentinel files", async () => {
  const directory = await mkdtemp(join(tmpdir(), "tripwise-card-quality-"));
  try {
    const output = join(directory, "new/report.json");
    const summary = JSON.parse(execFileSync(process.execPath, [cli, "--date", "2026-10-01", "--output", output], { encoding: "utf8" }));
    assert.equal(summary.fields, 333); assert.equal(summary.public_changes, false);
    const before = await readFile(output, "utf8");
    assert.deepEqual(JSON.parse(before), activityCardQualityReport(records(), { today: "2026-10-01" }));
    assert.throws(() => execFileSync(process.execPath, [cli, "--output", output], { stdio: "pipe" }), /already exists/);
    assert.equal(await readFile(output, "utf8"), before);
    const sentinel = join(directory, "sentinel"); await writeFile(sentinel, "preserve");
    assert.throws(() => execFileSync(process.execPath, [cli, "--output", sentinel], { stdio: "pipe" }), /already exists/);
    assert.equal(await readFile(sentinel, "utf8"), "preserve");
    for (const args of [["--date"], ["--output"], ["--date", "2026-02-30"], ["--unknown"], ["--date", "2026-10-01", "--date", "2026-10-02"], ["--output", "--date"], ["--output", output, "--output", sentinel]]) assert.throws(() => execFileSync(process.execPath, [cli, ...args], { stdio: "pipe" }));
  } finally { await rm(directory, { recursive: true, force: true }); }
});
