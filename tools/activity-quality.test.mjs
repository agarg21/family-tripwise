import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { activityEvidence, vegasActivityEvidence } from "./activity-evidence.mjs";
import { activityQualityReport, validateActivityPaths } from "./activity-quality.mjs";

const cli = fileURLToPath(new URL("./activity-quality.mjs", import.meta.url));

test("opt-in Vegas quality queue retains cost strings and exposes missing fields without touching old reports", async () => {
  const records=[...activityEvidence(),...vegasActivityEvidence()], before=JSON.stringify(records);
  const report=activityQualityReport(records,{today:"2026-10-01"});
  assert.deepEqual(report.summary,{mapped_pages:2,attractions:24,fields:120,unpriced_exact_visit_budgets:24,unmapped_activity_pages:4,unmapped_fields:24});
  assert.ok(report.unmapped_fields.every(r=>["weather","transport_check"].includes(r.field)));
  const neon=report.tasks.find(t=>t.name==="Neon Museum"&&t.field==="ticket_cost");
  assert.equal(neon.retained_value.planning_label,"VARIABLE / VERIFY");
  assert.equal(neon.retained_value.amount,null);
  assert.equal(neon.retained_on,"2026-08-03");
  assert.match(neon.retained_value.cost_basis,/age 6/);
  assert.ok(neon.reasons.includes("retained-source-model-review-due"));
  assert.equal(JSON.stringify(records),before);
  await validateActivityPaths(records);
  const cliResult=JSON.parse(execFileSync(process.execPath,[cli,"--date","2026-10-01","--include-vegas"],{encoding:"utf8"}));
  for(const [k,v]of Object.entries(report.summary))assert.equal(cliResult[k],v);
  assert.throws(()=>execFileSync(process.execPath,[cli,"--include-vegas","--include-vegas"],{stdio:"pipe"}));
  assert.deepEqual(report,JSON.parse(await readFile(new URL("../ops/page-quality/2026-10-01-las-vegas-activities.json",import.meta.url),"utf8")));
  assert.equal(activityQualityReport(activityEvidence(),{today:"2026-09-30"}).scope,"activity-logistics-pilot-only");
});

test("activity queue is reproducible with explicit partial coverage and no automatic facts/publication", async () => {
  const records = activityEvidence(), before = JSON.stringify(records);
  const report = activityQualityReport(records, { today: "2026-09-30" });
  assert.deepEqual(report, activityQualityReport(records, { today: "2026-09-30" }));
  assert.deepEqual(report.summary, { mapped_pages: 1, attractions: 12, fields: 72, unpriced_exact_visit_budgets: 12, unmapped_activity_pages: 5 });
  assert.equal(report.automatic_fact_renewal, false);
  assert.equal(report.automatic_publication, false);
  assert.ok(report.tasks.slice(0, 12).every((item) => item.field === "ticket_cost" && item.retained_value.amount === null));
  assert.ok(report.tasks.every((item) => item.retained_on === "2026-07-31"));
  const estimate = report.tasks.find((item) => item.field === "duration");
  assert.deepEqual(estimate.reasons, ["editorial-estimate-not-measured"]);
  const access = report.tasks.find((item) => item.field === "access_check");
  assert.ok(access.reasons.includes("verification-prompt-not-confirmed-fact"));
  assert.ok(access.reasons.includes("retained-source-model-review-due"));
  assert.ok(report.unmapped_pages.includes("https://familytripwise.com/things-to-do/san-antonio-with-kids.html"));
  assert.equal(JSON.stringify(records), before);
  await validateActivityPaths(records);
  assert.deepEqual(report, JSON.parse(await readFile(new URL("../ops/page-quality/2026-09-30-san-diego-activities.json", import.meta.url), "utf8")));
});

test("future and invalid dates, unknown keys and incomplete page coverage cannot imply fresh evidence", async () => {
  const records = activityEvidence();
  const historical = activityQualityReport(records, { today: "2026-07-30" });
  assert.ok(historical.tasks.every((item) => item.reasons.includes("future-model-date-review")));
  assert.throws(() => activityQualityReport(records, { today: "2026-02-30" }), /Invalid/);
  assert.throws(() => activityQualityReport(records, { expectedPages: [] }), /coverage/);
  const changed = structuredClone(records); changed[0].fields.venue.extra = "private";
  assert.throws(() => activityQualityReport(changed), /provenance/);
  records[0].page_url = "https://familytripwise.com/things-to-do/unknown.html";
  await assert.rejects(validateActivityPaths(records), /sitemap/);
  records[0].page_url = activityEvidence()[0].page_url; records[0].model_path = "../secret";
  await assert.rejects(validateActivityPaths(records), /Unsafe/);
});

test("both quality CLIs preserve existing outputs and write a new dated report only once", async () => {
  const directory = await mkdtemp(join(tmpdir(), "tripwise-quality-"));
  try {
    for (const filename of ["activity-quality.mjs", "page-quality.mjs"]) {
      const script = fileURLToPath(new URL(`./${filename}`, import.meta.url));
      const output = join(directory, filename + ".json");
      execFileSync(process.execPath, [script, "--date", "2026-09-30", "--output", output], { stdio: "pipe" });
      const before = await readFile(output, "utf8");
      assert.equal(JSON.parse(before).as_of, "2026-09-30");
      assert.throws(() => execFileSync(process.execPath, [script, "--date", "2026-10-07", "--output", output], { stdio: "pipe" }), /already exists/);
      assert.equal(await readFile(output, "utf8"), before);
      const sentinel = join(directory, filename + "-sentinel.json");
      await writeFile(sentinel, "preserve exact bytes");
      assert.throws(() => execFileSync(process.execPath, [script, "--output", sentinel], { stdio: "pipe" }), /already exists/);
      assert.equal(await readFile(sentinel, "utf8"), "preserve exact bytes");
    }
    for (const args of [["--date", "2026-02-30"], ["--output"], ["--unknown"], ["--output", "--date", "2026-09-30"]]) {
      assert.throws(() => execFileSync(process.execPath, [cli, ...args], { stdio: "pipe" }));
    }
    assert.equal(JSON.parse(execFileSync(process.execPath, [cli, "--date", "2026-09-30"], { encoding: "utf8" })).fields, 72);
  } finally { await rm(directory, { recursive: true, force: true }); }
});
