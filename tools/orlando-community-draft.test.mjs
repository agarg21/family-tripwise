import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {applyCommunityReview, validateCommunityQueue} from "./community-answer-review.mjs";

const queue = JSON.parse(readFileSync(new URL("../backlog/community-answer-drafts.json", import.meta.url)));
const draft = queue.drafts.find(row => row.id === "COMM-2026-002");

test("Orlando answer uses the validated review queue, never posting authority", () => {
  validateCommunityQueue(queue);
  assert.ok(draft);
  assert.equal(queue.posting_authorized, false);
  const reviewed = applyCommunityReview(structuredClone(queue), draft.id,
    {decision: "approved", draft_answer: draft.draft_answer, notes: "Wording only"}, queue.last_updated);
  assert.equal(reviewed.posting_authorized, false);
  assert.equal(draft.family_tripwise_link.recommendation, "omit");
  assert.equal(draft.family_tripwise_link.url, null);
  assert.doesNotMatch(draft.draft_answer, /https:\/\/familytripwise\.com/);
  assert.match(draft.rules.summary, /prohibits advertising/);
});

test("age and height are not substituted for an unverified lone-parent handoff", () => {
  assert.match(draft.draft_answer, /not firsthand/);
  assert.match(draft.draft_answer, /Being10 is not/);
  assert.match(draft.draft_answer, /I have not verified those arrangements/);
  assert.match(draft.draft_answer, /do not assume an employee will supervise/);
  assert.match(draft.draft_answer, /guide does not cover Epic Universe/);
  assert.match(draft.draft_answer, /Universal queue options need separate/);
  assert.match(draft.uncertainty, /queue accompaniment, nonrider exit\/reunion/);
  assert.ok(draft.evidence.some(row => row.classification === "community-question"));
  assert.ok(draft.evidence.filter(row => row.classification === "official-fact").length >= 4);
  assert.ok(draft.evidence.every(row => row.checked_on === "2026-10-15"));
});

test("new queue entry retains only public-safe paraphrases and source URLs", () => {
  const text = JSON.stringify(draft);
  assert.doesNotMatch(text, /u\/|upvotes|\+\d+ votes|gclid=|gbraid=|incident_id|sk-proj-/);
  assert.ok(draft.evidence.every(row => new URL(row.url).protocol === "https:"));
  assert.equal(draft.observed_on, "2026-10-15");
  assert.ok(draft.draft_answer.length < 4000);
});
