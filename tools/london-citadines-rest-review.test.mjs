import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import test from "node:test";
const root = new URL("../", import.meta.url);
const record = JSON.parse(readFileSync(new URL("docs/research/london-citadines-rest-review-2026-10-13.json", root)));

test("Citadines audit separates category-linked positives from different-category and historical signals", () => {
  assert.equal(record.signals.length, 4);
  assert.equal(record.result.target_category_signals, 2);
  assert.equal(record.signals.filter(s => s.category_match.startsWith("named-")).length, 2);
  assert.equal(record.signals.find(s => s.id === "one-bedroom-april").occupants, 4);
  for (const s of record.signals.filter(s => s.category_match.startsWith("named-"))) assert.equal(s.occupants, null);
  assert.equal(record.signals.find(s => s.id === "historical-stair-tip").displayed_category, null);
  assert.equal(record.result.six_person_signals, 0);
  assert.equal(record.result.midday_rest_signals, 0);
  assert.equal(record.result.verdict, "REJECT");
});

test("source extraction and search-only freshness do not become category renewal", () => {
  assert.equal(record.sources["official-category"].status, "category-detail-omitted-in-extraction");
  assert.ok(record.excluded.some(s => s.surface === "Tripadvisor search exposure" && s.reason.includes("not accepted")));
  assert.ok(record.excluded.some(s => s.surface.includes("generated summary")));
  for (const source of Object.values(record.sources)) {
    assert.equal(source.checked_on, "2026-10-13");
    assert.equal(source.publication_date, null);
    assert.equal(source.collection_independence, null);
    const url = new URL(source.url);
    assert.equal(url.protocol, "https:");
    assert.equal(url.search + url.hash + url.username + url.password, "");
  }
});

test("publication, stay and collection dates remain distinct and private identities absent", () => {
  assert.equal(record.signals[0].published_on, "2026-08-18");
  assert.equal(record.signals[0].stay_month, "2026-06");
  assert.equal(record.signals[1].stay_month, "2025-12");
  assert.equal(record.method.observed_at, null);
  for (const signal of record.signals) {
    assert.ok(record.sources[signal.source_id]);
    assert.ok(signal.supports.length && signal.does_not_support.length);
    for (const field of ["author", "profile", "name", "rating", "score", "verbatim"]) assert.equal(Object.hasOwn(signal, field), false);
  }
});

test("original independent room, dated quote and prior review evidence remain byte-identical", () => {
  for (const [path, digest] of Object.entries(record.preserved_evidence)) {
    assert.equal(createHash("sha256").update(readFileSync(new URL(path, root))).digest("hex"), digest, path);
  }
  assert.match(record.budget_boundary, /October3/);
  assert.match(record.budget_boundary, /527\.20\/585\.20/);
  assert.match(record.budget_boundary, /does not renew/);
});

test("research-only outcome retains publication, human and source limitations", () => {
  assert.match(record.result.decision, /PRESERVE public URLs/);
  assert.match(record.result.next_gate, /014 delegates/);
  assert.match(record.result.next_eligible_action, /do not repeat/);
  assert.match(record.release_scope, /no public consumer/);
  assert.equal(record.gsc.classification, "REUSED");
  assert.deepEqual(record.scenario.child_ages, [4, 8, 12, 15]);
  assert.ok(record.signals.at(-1).does_not_support.includes("route or safety assurance"));
});
