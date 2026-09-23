import assert from "node:assert/strict";
import test from "node:test";
import { compareCancunFamily } from "../src/prototypes/cancun-resort-comparison/compare.mjs";
import { cancunEvidence } from "../src/prototypes/cancun-resort-comparison/data.mjs";

const scenario = { childAges: [3, 7, 12], asOf: cancunEvidence.checkedOn };
const compare = overrides => compareCancunFamily({ ...scenario, ...overrides });

test("all three exact categories retain traceable first-party evidence", () => {
  assert.equal(new Set(cancunEvidence.records.map(record => record.id)).size, 3);
  for (const record of cancunEvidence.records) {
    for (const field of [record.room, record.clubs, record.transfers, record.extras]) {
      assert.ok(field.sourceIds.length > 0);
      for (const id of field.sourceIds) assert.equal(new URL(cancunEvidence.sources[id]).protocol, "https:");
    }
  }
  assert.equal(cancunEvidence.publicationStatus, "publication-candidate");
});

test("mixed-age family retains three independent decision failures", () => {
  const [finest, sunscape, sapphire] = compare().records;
  assert.equal(finest.room.status, "within-published-maximum-not-confirmed");
  assert.equal(finest.children[2].status, "no-published-age-match");
  assert.equal(sunscape.room.status, "disputed");
  assert.equal(sunscape.children[0].status, "no-published-age-match");
  assert.equal(sapphire.room.layoutStatus, "unknown");
  assert.equal(sapphire.children[0].status, "toilet-training-check-needed");
});

test("club boundaries do not become age-pricing or universal childcare claims", () => {
  const [finest, sunscape, sapphire] = compare({ childAges: [2, 3, 12, 13, 17] }).records;
  assert.equal(finest.children[0].status, "parent-required");
  assert.equal(finest.children[1].status, "published-age-match-confirm-admission");
  assert.equal(finest.children[2].program, null);
  assert.equal(sunscape.children[2].program, "Explorer's Club");
  assert.equal(sunscape.children[3].program, "Core Zone");
  assert.equal(sapphire.children[4].program, "Core Zone");
  assert.ok(compare().records.every(record => record.room.bookingAcceptance === "unknown"));
});

test("toilet-training conditions are per-child and programme-specific", () => {
  const results = compare({ pottyTrained: [false, true, null] }).records;
  assert.equal(results[2].children[0].status, "published-condition-not-met");
  assert.equal(results[2].children[1].status, "published-age-match-confirm-admission");
  assert.equal(results[2].children[2].status, "toilet-training-check-needed");
  assert.equal(results[0].children[0].status, "published-age-match-confirm-admission");
  assert.match(results[0].clubChecks.join(" "), /Imagine Lounge is separate/);
});

test("capacity conflicts and unknown sleeping places cannot become positive room matches", () => {
  const records = compare({ childAges: [3, 5, 7, 9, 12] }).records;
  assert.equal(records[0].room.status, "above-published-maximum");
  assert.equal(records[1].room.status, "disputed");
  assert.equal(records[1].room.maximum, null);
  assert.equal(records[2].room.status, "above-published-maximum");
  assert.equal(compare().records[2].room.layoutStatus, "unknown");
});

test("direct transfer offer requires new suite-only booking and minimum nights", () => {
  const offer = { channel: "direct-suite", nights: 3, newReservation: true };
  assert.equal(compare(offer).records[0].transfers.status, "within-published-offer-conditions");
  for (const overrides of [{ nights: 2 }, { newReservation: false }, { channel: "third-party" }, { channel: "flight-package" }]) {
    assert.equal(compare({ ...offer, ...overrides }).records[0].transfers.status, "outside-published-offer");
  }
  for (const overrides of [{ nights: null }, { newReservation: null }, { channel: "unknown" }]) {
    assert.equal(compare({ ...offer, ...overrides }).records[0].transfers.status, "conditions-unknown");
  }
  assert.equal(compare(offer).records[1].transfers.status, "extra-under-standard-terms");
  assert.equal(compare(offer).records[2].transfers.status, "extra-under-standard-terms");
});

test("no fabricated quote or ranking; source checks expire explicitly", () => {
  const result = compare();
  assert.equal(result.needsRecheck, false);
  assert.equal(compare({ asOf: cancunEvidence.recheckOn }).needsRecheck, true);
  for (const record of result.records) {
    assert.equal(record.cost.total, null);
    assert.equal(record.cost.status, "unknown-not-quoted");
    assert.equal(record.score, undefined);
    assert.ok(record.room.sources.every(source => source.checkedOn === cancunEvidence.checkedOn && source.publishedOn === null));
  }
});

test("reject invalid ages, condition vectors, booking inputs and evidence dates", () => {
  for (const childAges of [[], [-1], [18], [1.5], ["3"], [true], [NaN], [1, 2, 3, 4, 5, 6]]) assert.throws(() => compare({ childAges }));
  for (const pottyTrained of [[true], [true, false, "unknown"], "yes"]) assert.throws(() => compare({ pottyTrained }));
  for (const nights of [0, -1, 1.5, "5", 366]) assert.throws(() => compare({ nights }));
  assert.throws(() => compare({ channel: "affiliate" }));
  assert.throws(() => compare({ adults: 3 }));
  assert.throws(() => compare({ newReservation: "yes" }));
  for (const asOf of ["2026-09-21", "2026-02-30", "tomorrow"]) assert.throws(() => compare({ asOf }));
});

test("returned results cannot mutate maintained source records", () => {
  const before = structuredClone(cancunEvidence);
  const result = compare();
  result.records[0].room.checks.push("invalid");
  result.records[0].room.sourceIds.push("invalid");
  result.records[0].children[0].sources[0].url = "invalid";
  assert.deepEqual(cancunEvidence, before);
});
