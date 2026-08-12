import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { request as httpRequest } from "node:http";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import {
  applyCommunityReview,
  createCommunityReviewServer,
  readCommunityQueue,
  validateCommunityQueue,
  writeCommunityQueue
} from "./community-answer-review.mjs";

function draft() {
  return {
    id: "COMM-2026-001",
    destination: "San Diego",
    community: "Example family travel forum",
    thread_url: "https://example.com/questions/one",
    observed_on: "2026-08-12",
    rules: {
      checked_on: "2026-08-12",
      summary: "Direct answers are allowed; promotional links are not useful here.",
      links: ["https://example.com/rules"]
    },
    question: "Which San Diego area works for a short family visit?",
    decision_job: "Choose an area that reduces driving for a short trip.",
    draft_answer: "Start with the attractions you will actually visit, then compare Mission Bay and downtown against that route.",
    evidence: [
      {
        classification: "official-fact",
        title: "Official destination map",
        url: "https://example.com/map",
        checked_on: "2026-08-12",
        note: "Used only to confirm locations."
      }
    ],
    family_tripwise_link: {
      recommendation: "omit",
      url: null,
      rationale: "The answer is complete without a link."
    },
    uncertainty: "Exact driving time varies by day and route.",
    user_review: { decision: "pending", decided_on: null, notes: "" },
    created_on: "2026-08-12",
    updated_on: "2026-08-12"
  };
}

function queue() {
  return {
    schema_version: 1,
    last_updated: "2026-08-12",
    repository_visibility: "public",
    posting_authorized: false,
    drafts: [draft()]
  };
}

function temporaryQueue() {
  const root = mkdtempSync(join(tmpdir(), "family-tripwise-community-review-"));
  const path = join(root, "queue.json");
  writeFileSync(path, `${JSON.stringify(queue(), null, 2)}\n`);
  return { root, path };
}

function requestStatus({ port, hostHeader }) {
  return new Promise((resolveRequest, rejectRequest) => {
    const request = httpRequest({
      hostname: "127.0.0.1",
      port,
      path: "/",
      method: "GET",
      headers: { Host: hostHeader }
    }, (response) => {
      response.resume();
      response.on("end", () => resolveRequest(response.statusCode));
    });
    request.on("error", rejectRequest);
    request.end();
  });
}

test("accepts a complete pending queue", () => {
  assert.equal(validateCommunityQueue(queue()).drafts.length, 1);
});

test("rejects posting authority and incomplete evidence", () => {
  const posting = queue();
  posting.posting_authorized = true;
  assert.throws(() => validateCommunityQueue(posting), /posting_authorized must remain false/);

  const missingEvidence = queue();
  missingEvidence.drafts[0].evidence = [];
  assert.throws(() => validateCommunityQueue(missingEvidence), /evidence.*non-empty/);
});

test("rejects impossible dates, credential-bearing sources, and retained omitted links", () => {
  const impossibleDate = queue();
  impossibleDate.drafts[0].observed_on = "2026-02-30";
  assert.throws(() => validateCommunityQueue(impossibleDate), /observed_on must be a real date/);

  const credentials = queue();
  credentials.drafts[0].thread_url = "https://user:secret@example.com/question";
  assert.throws(() => validateCommunityQueue(credentials), /must not contain credentials/);

  const omittedLink = queue();
  omittedLink.drafts[0].family_tripwise_link.url = "https://familytripwise.com/";
  assert.throws(() => validateCommunityQueue(omittedLink), /must be null when omitting/);
});

test("rejects future and contradictory chronology", () => {
  const future = queue();
  future.last_updated = "2999-01-01";
  assert.throws(() => validateCommunityQueue(future), /last_updated must not be after today/);

  const contradictory = queue();
  contradictory.drafts[0].created_on = "2026-08-13";
  assert.throws(() => validateCommunityQueue(contradictory), /created_on must not be after drafts\[0\]\.updated_on/);

  const futureEvidence = queue();
  futureEvidence.drafts[0].evidence[0].checked_on = "2026-08-13";
  assert.throws(() => validateCommunityQueue(futureEvidence), /checked_on must not be after drafts\[0\]\.updated_on/);

  const predatingDecision = queue();
  predatingDecision.drafts[0].user_review = {
    decision: "approved",
    decided_on: "2026-07-01",
    notes: ""
  };
  assert.throws(() => validateCommunityQueue(predatingDecision), /decided_on must not be before drafts\[0\]\.created_on/);
});

test("rejects unsupported fields at every writable schema boundary", () => {
  const topLevel = queue();
  topLevel.username = "not allowed";
  assert.throws(() => validateCommunityQueue(topLevel), /queue contains unsupported fields: username/);

  const nested = queue();
  nested.drafts[0].user_review.private_note = "not private in a public repository";
  assert.throws(() => validateCommunityQueue(nested), /user_review contains unsupported fields: private_note/);

  assert.throws(() => applyCommunityReview(queue(), "COMM-2026-001", {
    decision: "approved",
    draft_answer: "Approved answer.",
    notes: "",
    thread_url: "https://attacker.example/changed"
  }, "2026-08-12"), /review payload contains unsupported fields: thread_url/);
});

test("applies only answer and review fields while preserving source identity", () => {
  const value = queue();
  const before = structuredClone(value.drafts[0]);
  applyCommunityReview(value, "COMM-2026-001", {
    decision: "approved",
    draft_answer: "  Compare the route first, then choose the area.  ",
    notes: "  Clear and concise.  "
  }, "2026-08-12");

  const after = value.drafts[0];
  assert.equal(after.draft_answer, "Compare the route first, then choose the area.");
  assert.deepEqual(after.user_review, {
    decision: "approved",
    decided_on: "2026-08-12",
    notes: "Clear and concise."
  });
  assert.equal(after.thread_url, before.thread_url);
  assert.deepEqual(after.evidence, before.evidence);
  assert.equal(value.posting_authorized, false);
});

test("resets a review to pending without retaining a decision date", () => {
  const value = queue();
  applyCommunityReview(value, "COMM-2026-001", {
    decision: "pending",
    draft_answer: value.drafts[0].draft_answer,
    notes: "Reconsider later."
  }, "2026-08-12");
  assert.equal(value.drafts[0].user_review.decided_on, null);
});

test("writes valid queue data atomically without leftover temporary files", () => {
  const { root, path } = temporaryQueue();
  const value = readCommunityQueue(path);
  applyCommunityReview(value, "COMM-2026-001", {
    decision: "rejected",
    draft_answer: value.drafts[0].draft_answer,
    notes: "Does not add enough value."
  }, "2026-08-12");
  writeCommunityQueue(path, value);

  assert.equal(JSON.parse(readFileSync(path, "utf8")).drafts[0].user_review.decision, "rejected");
  assert.deepEqual(readdirSync(root), ["queue.json"]);
});

test("serves the review board and requires loopback host, same-origin, and token for writes", async (context) => {
  const { path } = temporaryQueue();
  const instance = createCommunityReviewServer({ queuePath: path, today: () => "2026-08-12" });
  await new Promise((resolveListen) => instance.server.listen(0, "127.0.0.1", resolveListen));
  context.after(() => new Promise((resolveClose) => instance.server.close(resolveClose)));
  const { port } = instance.server.address();
  const base = `http://127.0.0.1:${port}`;

  const page = await fetch(base);
  assert.equal(page.status, 200);
  const pageText = await page.text();
  assert.match(pageText, /Nothing here posts externally/);
  assert.match(pageText, /committed to a public repository/);

  assert.equal(await requestStatus({ port, hostHeader: "attacker.example" }), 421);

  const hostileOrigin = await fetch(`${base}/api/drafts/COMM-2026-001/review`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Origin": "https://attacker.example",
      "X-Review-Token": instance.token
    },
    body: JSON.stringify({ decision: "approved", draft_answer: "Approved answer.", notes: "" })
  });
  assert.equal(hostileOrigin.status, 403);

  const denied = await fetch(`${base}/api/drafts/COMM-2026-001/review`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Origin": base },
    body: JSON.stringify({ decision: "approved", draft_answer: "Approved answer.", notes: "" })
  });
  assert.equal(denied.status, 403);
  assert.equal(readCommunityQueue(path).drafts[0].user_review.decision, "pending");

  const approved = await fetch(`${base}/api/drafts/COMM-2026-001/review`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Origin": base, "X-Review-Token": instance.token },
    body: JSON.stringify({ decision: "approved", draft_answer: "Approved answer.", notes: "Ready." })
  });
  assert.equal(approved.status, 200);
  const stored = readCommunityQueue(path).drafts[0];
  assert.equal(stored.user_review.decision, "approved");
  assert.equal(stored.user_review.decided_on, "2026-08-12");
});

test("uses the America/New_York date during the UTC evening rollover", async (context) => {
  const { path } = temporaryQueue();
  const instance = createCommunityReviewServer({
    queuePath: path,
    now: () => new Date("2026-08-13T01:30:00Z")
  });
  await new Promise((resolveListen) => instance.server.listen(0, "127.0.0.1", resolveListen));
  context.after(() => new Promise((resolveClose) => instance.server.close(resolveClose)));
  const { port } = instance.server.address();
  const base = `http://127.0.0.1:${port}`;

  const response = await fetch(`${base}/api/drafts/COMM-2026-001/review`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Origin": base,
      "X-Review-Token": instance.token
    },
    body: JSON.stringify({ decision: "approved", draft_answer: "Approved answer.", notes: "" })
  });
  assert.equal(response.status, 200);
  assert.equal(readCommunityQueue(path).drafts[0].user_review.decided_on, "2026-08-12");
});
