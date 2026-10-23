import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {applyCommunityReview, validateCommunityQueue} from "./community-answer-review.mjs";

const queue = JSON.parse(readFileSync(new URL("../backlog/community-answer-drafts.json", import.meta.url)));
const draft = queue.drafts.find(row => row.id === "COMM-2026-003");

test("Boston draft is human-review wording, not promotion or posting authority", () => {
  validateCommunityQueue(queue);
  assert.ok(draft);
  assert.equal(draft.user_review.decision, "pending");
  assert.equal(draft.family_tripwise_link.recommendation, "omit");
  assert.equal(draft.family_tripwise_link.url, null);
  assert.doesNotMatch(draft.draft_answer, /https:\/\/familytripwise\.com/);
  assert.match(draft.rules.summary, /bot or spam accounts/);
  assert.match(draft.rules.summary, /do not establish permission/);
  const approved = applyCommunityReview(structuredClone(queue), draft.id,
    {decision: "approved", draft_answer: draft.draft_answer, notes: "Wording only"}, "2026-10-23");
  assert.equal(approved.posting_authorized, false);
  assert.equal(queue.posting_authorized, false);
});

test("short-window and sensory desk cases retain their unresolved inputs", () => {
  assert.match(draft.draft_answer, /^Make one experience the anchor/);
  assert.match(draft.draft_answer, /proposed walk toward the trail's start is not the same as doing the whole trail/);
  assert.match(draft.draft_answer, /edited priority is a distinctly Boston experience/);
  assert.match(draft.draft_answer, /short walk toward the trail's start can remain optional/);
  assert.match(draft.draft_answer, /Do not assume it fits/);
  assert.match(draft.draft_answer, /subtract travel/);
  assert.match(draft.draft_answer, /not firsthand/);
  assert.match(draft.draft_answer, /not a promise/);
  assert.match(draft.draft_answer, /show time that has not been confirmed/);
  assert.match(draft.draft_answer, /not a guarantee/);
  assert.match(draft.draft_answer, /skip the show/);
  assert.match(draft.draft_answer, /boat-service closure, not a claim that the Public Garden is closed/);
  const cases = draft.evidence.find(row => row.classification === "editorial-interpretation");
  assert.match(cases.note, /CaseB: rain\/noise concern/);
  assert.match(cases.note, /Both PARTIAL/);
  assert.match(draft.uncertainty, /whether the trip is still upcoming/);
});

test("new Boston evidence stays source-dated and public-safe", () => {
  assert.ok(draft.evidence.filter(row => row.classification === "official-fact").length === 4);
  assert.ok(draft.evidence.every(row => row.checked_on === "2026-10-23"));
  assert.ok(draft.evidence.every(row => new URL(row.url).protocol === "https:"));
  assert.match(draft.evidence[0].note, /not a live activity date/);
  assert.match(draft.evidence[0].note, /representative preference/);
  assert.doesNotMatch(JSON.stringify(draft), /u\/|upvotes|\+\d+ votes|gclid=|incident_id|sk-proj-/);
  assert.equal(draft.observed_on, "2026-10-23");
  assert.ok(draft.draft_answer.length < 4000);
});
