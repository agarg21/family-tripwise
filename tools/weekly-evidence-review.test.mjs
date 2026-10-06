import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { reviewAudit } from "./weekly-evidence-review.mjs";
import { modelRecords, requireNewOutput } from "./evidence-audit.mjs";

const at = "2026-09-30T12:00:00Z";
const page = "https://familytripwise.com/example.html";
const url = "https://example.com/room";
const record = { id: "room", field: "room", page_url: page, verified_on: "2026-07-25", source_urls: [url], basis: "Historical room, unknown exact family", interval_days: 30 };
const current = (sources) => ({ collected_at: at, factual_dates_renewed: false, elapsed_seconds: 10, pages: [{ url: page, records: [{ ...record, freshness: { state: "review-due", due_on: "2026-08-24" } }] }], sources });
const previous = (sources) => ({ collected_at: "2026-09-29T12:00:00Z", sources });

test("review queue separates hash deltas, new baselines and unavailable evidence", () => {
  const sources = [{ url, pages: [page], state: "text-changed-review", text_sha256: "new", last_attempt_at: at }, { url: url + "/new", pages: [page], state: "retrieved-baseline", text_sha256: "baseline" }, { url: url + "/pdf", pages: [page], state: "unsupported-format-review" }];
  const report = reviewAudit(current(sources), previous([{ ...sources[0], text_sha256: "old" }]), { expectedRecords: [record], expectedUrls: [page] });
  assert.equal(report.summary.changed_sources, 1);
  assert.equal(report.summary.newly_inventoried_sources, 2);
  assert.equal(report.summary.collection_gaps, 1);
  assert.equal(report.summary.model_records_checked, 1);
  assert.equal(report.source_review_queue[0].priority, 1);
  assert.equal(report.field_review_queue[0].verified_on, "2026-07-25");
  assert.equal(report.automatic_fact_renewal, false);
  assert.equal(report.automatic_publication, false);
});

test("denials and deferred evidence preserve original attempts across repeats", () => {
  const old = { url, pages: [page], state: "unavailable-review", http_status: 403, last_attempt_at: "2026-09-29T12:00:00Z" };
  const carried = { ...old, state: "access-denied-carried-forward" };
  assert.equal(reviewAudit(current([carried]), previous([old])).summary.carried_denials, 1);
  assert.throws(() => reviewAudit(current([{ ...carried, last_attempt_at: at }]), previous([old])), /Denied source/);
  assert.throws(() => reviewAudit(current([]), previous([old])), /Required source missing|Prior denial absent/);
  const success = { ...old, http_status: 200, state: "text-changed-review", text_sha256: "retained" };
  const deferred = { ...success, collection_deferred: true };
  const report = reviewAudit(current([deferred]), previous([success]));
  assert.equal(report.summary.deferred_sources, 1);
  assert.equal(report.source_review_queue.length, 0);
  assert.equal(report.deferred_source_queue[0].classification, "deferred-no-new-evidence");
  assert.throws(() => reviewAudit(current([{ ...deferred, text_sha256: "new" }]), previous([success])), /Deferred evidence/);
});

test("newly deferred sources remain visible without becoming fresh evidence", () => {
  const report = reviewAudit(current([{ url, pages: [page], state: "deferred-limit" }]), previous([]));
  assert.equal(report.summary.deferred_sources, 1);
  assert.equal(report.summary.changed_sources, 0);
  assert.equal(report.summary.collection_gaps, 0);
  assert.equal(report.deferred_source_queue.length, 1);
  assert.equal(report.deferred_source_queue[0].last_attempt_at, null);
});

test("never-attempted sources can stay deferred across dated runs", () => {
  const old = { url, pages: [page], state: "deferred-limit" };
  const carried = { ...old, collection_deferred: true, last_attempt_at: null };
  const first = reviewAudit(current([carried]), previous([old]));
  assert.equal(first.summary.deferred_sources, 1);
  assert.equal(first.deferred_source_queue[0].last_attempt_at, null);
  const second = reviewAudit({ ...current([carried]), collected_at: "2026-10-07T12:00:00Z" }, { ...previous([carried]), collected_at: at });
  assert.equal(second.summary.deferred_sources, 1);
  assert.equal(second.summary.changed_sources, 0);
  assert.equal(second.deferred_source_queue[0].last_attempt_at, null);
});

test("missing page-linked and model-linked sources cannot pass coverage", () => {
  const input = current([{ url, pages: [page], state: "not-fetched" }]);
  input.pages[0].sources = [url, url + "/missing-page-source"];
  assert.throws(() => reviewAudit(input, previous([])), /Required source missing/);
  assert.throws(() => reviewAudit(current([]), previous([])), /Required source missing/);
});

test("missing pages, duplicate identities and model/date/basis drift fail closed", () => {
  assert.throws(() => reviewAudit(current([]), previous([]), { expectedUrls: [page, page + "/missing"] }), /coverage/);
  assert.throws(() => reviewAudit(current([{ url }, { url }]), previous([])), /Duplicate/);
  assert.throws(() => reviewAudit({ ...current([]), factual_dates_renewed: true }, previous([])), /renewal/);
  assert.throws(() => reviewAudit(current([]), previous([]), { expectedRecords: [{ ...record, verified_on: "2026-09-30" }] }), /drift/);
  assert.throws(() => reviewAudit(current([]), previous([]), { expectedRecords: [{ ...record, id: "missing" }] }), /Missing model/);
});

test("saved audit evidence cannot be overwritten", async () => {
  await assert.rejects(requireNewOutput(new URL("../ops/evidence-audits/2026-09-30.json", import.meta.url)), /already exists/);
});

test("saved all-page repeat reproduces its historical model and rejects later wording drift", async () => {
  const read = async (file) => JSON.parse(await readFile(new URL(`../ops/evidence-audits/${file}`, import.meta.url), "utf8"));
  const repeat = await read("2026-09-30-repeat.json"), baseline = await read("2026-09-30.json");
  const currentRecords = new Map(modelRecords().map((record) => [record.id, record]));
  const retainedRecords = repeat.pages.flatMap((p) => p.records).filter((record) => currentRecords.has(record.id)).map(({ freshness, ...record }) => record);
  const expectedUrls = baseline.pages.map((p) => p.url);
  const report = reviewAudit(repeat, baseline, { expectedRecords: retainedRecords, expectedUrls });
  const changed = [];
  const laterFeeChanges = [];
  for (const record of retainedRecords) {
    const currentRecord = currentRecords.get(record.id);
    if (record.id.startsWith("new-york-city-") && record.field === "nightly-price") {
      assert.notEqual(record.basis, currentRecord.basis);
      assert.equal(record.verified_on, currentRecord.verified_on);
      assert.deepEqual({ ...record, basis: currentRecord.basis }, currentRecord);
      changed.push(record.id);
    } else if (["san-diego-la-jolla-shores-hotel-fees", "san-diego-loews-coronado-bay-resort-fees"].includes(record.id)) {
      assert.equal(record.verified_on, "2026-08-17");
      assert.equal(record.mapping_state, "disputed");
      const loews = record.id === "san-diego-loews-coronado-bay-resort-fees";
      assert.equal(currentRecord.verified_on, loews ? "2026-10-06" : "2026-10-05");
      assert.equal(currentRecord.mapping_state, "known");
      assert.equal(currentRecord.evidence_path, loews ? "docs/research/loews-coronado-fees-2026-10-06.json" : "docs/research/la-jolla-shores-fees-2026-10-05.json");
      assert.equal(currentRecord.interval_days, record.interval_days);
      assert.notEqual(currentRecord.basis, record.basis);
      laterFeeChanges.push(record.id);
    } else assert.deepEqual(record, currentRecord);
  }
  assert.equal(changed.length, 12);
  assert.deepEqual(laterFeeChanges, ["san-diego-loews-coronado-bay-resort-fees", "san-diego-la-jolla-shores-hotel-fees"]);
  assert.throws(() => reviewAudit(repeat, baseline, { expectedRecords: modelRecords(), expectedUrls }), /Model\/date\/basis drift: san-diego-loews-coronado-bay-resort-fees/);
  const priorLoews = retainedRecords.find(record => record.id === "san-diego-loews-coronado-bay-resort-fees");
  const loewsRestored = modelRecords().map(record => record.id === priorLoews.id ? priorLoews : record);
  assert.throws(() => reviewAudit(repeat, baseline, { expectedRecords: loewsRestored, expectedUrls }), /Model\/date\/basis drift: san-diego-la-jolla-shores-hotel-fees/);
  const priorFee = retainedRecords.find(record => record.id === "san-diego-la-jolla-shores-hotel-fees");
  const feeRestored = loewsRestored.map(record => record.id === priorFee.id ? priorFee : record);
  assert.throws(() => reviewAudit(repeat, baseline, { expectedRecords: feeRestored, expectedUrls }), /Model\/date\/basis drift: new-york-city-/);
  assert.deepEqual(report, await read("2026-09-30-review.json"));
  assert.equal(report.summary.canonical_pages, 31);
  assert.equal(report.summary.sources, 455);
  assert.equal(report.summary.newly_inventoried_sources, 123);
  assert.equal(report.summary.deferred_sources, 0);
  assert.equal(report.summary.model_records_checked, 390);
});
