import { randomBytes } from "node:crypto";
import { existsSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { createServer } from "node:http";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const DECISIONS = new Set(["pending", "approved", "revise", "rejected"]);
const LINK_RECOMMENDATIONS = new Set(["include", "omit"]);
const EVIDENCE_CLASSES = new Set([
  "official-fact",
  "online-review-signal",
  "community-question",
  "editorial-interpretation",
  "estimate"
]);
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const HTTP_URL_PATTERN = /^https:\/\//;
const MAX_BODY_BYTES = 64 * 1024;

function projectDate(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(now);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function assertExactKeys(value, allowed, field) {
  const unknown = Object.keys(value).filter((key) => !allowed.includes(key));
  assert(unknown.length === 0, `${field} contains unsupported fields: ${unknown.join(", ")}`);
}

function assertText(value, field, { min = 1, max = 4_000 } = {}) {
  assert(typeof value === "string", `${field} must be text`);
  const length = value.trim().length;
  assert(length >= min && length <= max, `${field} must contain ${min}-${max} characters`);
}

function assertDate(value, field, { nullable = false } = {}) {
  if (nullable && value === null) return;
  assert(typeof value === "string" && DATE_PATTERN.test(value), `${field} must be YYYY-MM-DD`);
  const [year, month, day] = value.split("-").map(Number);
  const normalized = new Date(Date.UTC(year, month - 1, day)).toISOString().slice(0, 10);
  assert(normalized === value, `${field} must be a real date`);
}

function assertHttpsUrl(value, field, { nullable = false } = {}) {
  if (nullable && value === null) return;
  assert(typeof value === "string" && HTTP_URL_PATTERN.test(value), `${field} must be an https URL`);
  let url;
  try {
    url = new URL(value);
  } catch {
    throw new Error(`${field} must be a valid URL`);
  }
  assert(url.protocol === "https:", `${field} must use https`);
  assert(!url.username && !url.password, `${field} must not contain credentials`);
}

function assertOnOrBefore(value, ceiling, field, ceilingField) {
  if (value === null) return;
  assert(value <= ceiling, `${field} must not be after ${ceilingField}`);
}

function assertOnOrAfter(value, floor, field, floorField) {
  if (value === null) return;
  assert(value >= floor, `${field} must not be before ${floorField}`);
}

function validateDraft(draft, index, queueDate) {
  const field = (name) => `drafts[${index}].${name}`;
  assert(draft && typeof draft === "object" && !Array.isArray(draft), field("record") + " must be an object");
  assertExactKeys(draft, [
    "id", "destination", "community", "thread_url", "observed_on", "rules", "question",
    "decision_job", "draft_answer", "evidence", "family_tripwise_link", "uncertainty",
    "user_review", "created_on", "updated_on"
  ], field("record"));
  assert(typeof draft.id === "string" && /^COMM-\d{4}-\d{3}$/.test(draft.id), `${field("id")} must match COMM-YYYY-NNN`);
  assertText(draft.destination, field("destination"), { max: 80 });
  assertText(draft.community, field("community"), { max: 120 });
  assertHttpsUrl(draft.thread_url, field("thread_url"));
  assertDate(draft.observed_on, field("observed_on"));
  assertText(draft.question, field("question"), { max: 1_000 });
  assertText(draft.decision_job, field("decision_job"), { max: 500 });
  assertText(draft.draft_answer, field("draft_answer"), { max: 4_000 });
  assertText(draft.uncertainty, field("uncertainty"), { min: 0, max: 1_000 });
  assertDate(draft.created_on, field("created_on"));
  assertDate(draft.updated_on, field("updated_on"));
  assertOnOrBefore(draft.observed_on, draft.created_on, field("observed_on"), field("created_on"));
  assertOnOrBefore(draft.created_on, draft.updated_on, field("created_on"), field("updated_on"));
  assertOnOrBefore(draft.updated_on, queueDate, field("updated_on"), "last_updated");

  assert(draft.rules && typeof draft.rules === "object", `${field("rules")} must be an object`);
  assertExactKeys(draft.rules, ["checked_on", "summary", "links"], field("rules"));
  assertDate(draft.rules.checked_on, field("rules.checked_on"));
  assertOnOrBefore(draft.rules.checked_on, draft.updated_on, field("rules.checked_on"), field("updated_on"));
  assertText(draft.rules.summary, field("rules.summary"), { max: 1_000 });
  assert(Array.isArray(draft.rules.links), `${field("rules.links")} must be an array`);
  draft.rules.links.forEach((url, linkIndex) => assertHttpsUrl(url, field(`rules.links[${linkIndex}]`)));

  assert(Array.isArray(draft.evidence) && draft.evidence.length > 0, `${field("evidence")} must be a non-empty array`);
  draft.evidence.forEach((evidence, evidenceIndex) => {
    const prefix = field(`evidence[${evidenceIndex}]`);
    assert(evidence && typeof evidence === "object", `${prefix} must be an object`);
    assertExactKeys(evidence, ["classification", "title", "url", "checked_on", "note"], prefix);
    assert(EVIDENCE_CLASSES.has(evidence.classification), `${prefix}.classification is unsupported`);
    assertText(evidence.title, `${prefix}.title`, { max: 200 });
    assertHttpsUrl(evidence.url, `${prefix}.url`);
    assertDate(evidence.checked_on, `${prefix}.checked_on`);
    assertOnOrBefore(evidence.checked_on, draft.updated_on, `${prefix}.checked_on`, field("updated_on"));
    assertText(evidence.note, `${prefix}.note`, { max: 1_000 });
  });

  const link = draft.family_tripwise_link;
  assert(link && typeof link === "object", `${field("family_tripwise_link")} must be an object`);
  assertExactKeys(link, ["recommendation", "url", "rationale"], field("family_tripwise_link"));
  assert(LINK_RECOMMENDATIONS.has(link.recommendation), `${field("family_tripwise_link.recommendation")} is unsupported`);
  assertHttpsUrl(link.url, field("family_tripwise_link.url"), { nullable: true });
  assertText(link.rationale, field("family_tripwise_link.rationale"), { max: 1_000 });
  if (link.recommendation === "include") assert(link.url !== null, `${field("family_tripwise_link.url")} is required when including a link`);
  if (link.recommendation === "omit") assert(link.url === null, `${field("family_tripwise_link.url")} must be null when omitting a link`);

  const review = draft.user_review;
  assert(review && typeof review === "object", `${field("user_review")} must be an object`);
  assertExactKeys(review, ["decision", "decided_on", "notes"], field("user_review"));
  assert(DECISIONS.has(review.decision), `${field("user_review.decision")} is unsupported`);
  assertDate(review.decided_on, field("user_review.decided_on"), { nullable: true });
  assertText(review.notes, field("user_review.notes"), { min: 0, max: 2_000 });
  if (review.decision === "pending") assert(review.decided_on === null, `${field("user_review.decided_on")} must be null while pending`);
  if (review.decision !== "pending") assert(review.decided_on !== null, `${field("user_review.decided_on")} is required after a decision`);
  assertOnOrAfter(review.decided_on, draft.created_on, field("user_review.decided_on"), field("created_on"));
  assertOnOrBefore(review.decided_on, draft.updated_on, field("user_review.decided_on"), field("updated_on"));
}

export function validateCommunityQueue(queue, { today = projectDate() } = {}) {
  assert(queue && typeof queue === "object" && !Array.isArray(queue), "queue must be an object");
  assertExactKeys(queue, ["schema_version", "last_updated", "repository_visibility", "posting_authorized", "drafts"], "queue");
  assert(queue.schema_version === 1, "schema_version must be 1");
  assertDate(queue.last_updated, "last_updated");
  assertDate(today, "today");
  assertOnOrBefore(queue.last_updated, today, "last_updated", "today");
  assert(queue.repository_visibility === "public", "repository_visibility must remain public");
  assert(queue.posting_authorized === false, "posting_authorized must remain false");
  assert(Array.isArray(queue.drafts), "drafts must be an array");
  queue.drafts.forEach((draft, index) => validateDraft(draft, index, queue.last_updated));
  const ids = queue.drafts.map((draft) => draft.id);
  assert(new Set(ids).size === ids.length, "draft IDs must be unique");
  return queue;
}

export function readCommunityQueue(queuePath) {
  return validateCommunityQueue(JSON.parse(readFileSync(queuePath, "utf8")));
}

export function applyCommunityReview(queue, draftId, input, today) {
  validateCommunityQueue(queue);
  assert(input && typeof input === "object" && !Array.isArray(input), "review payload must be an object");
  assertExactKeys(input, ["decision", "draft_answer", "notes"], "review payload");
  assert(DECISIONS.has(input.decision), "decision must be pending, approved, revise, or rejected");
  assertText(input.draft_answer, "draft_answer", { max: 4_000 });
  assertText(input.notes ?? "", "notes", { min: 0, max: 2_000 });
  assertDate(today, "today");
  assertOnOrBefore(today, projectDate(), "today", "the current project date");

  const draft = queue.drafts.find((candidate) => candidate.id === draftId);
  assert(draft, `unknown draft ID: ${draftId}`);
  draft.draft_answer = input.draft_answer.trim();
  draft.user_review = {
    decision: input.decision,
    decided_on: input.decision === "pending" ? null : today,
    notes: (input.notes ?? "").trim()
  };
  draft.updated_on = today;
  queue.last_updated = today;
  return validateCommunityQueue(queue);
}

export function writeCommunityQueue(queuePath, queue) {
  validateCommunityQueue(queue);
  const temporaryPath = `${queuePath}.${process.pid}.${randomBytes(6).toString("hex")}.tmp`;
  writeFileSync(temporaryPath, `${JSON.stringify(queue, null, 2)}\n`, { flag: "wx" });
  renameSync(temporaryPath, queuePath);
}

function json(response, status, value) {
  response.writeHead(status, {
    "Cache-Control": "no-store",
    "Content-Type": "application/json; charset=utf-8",
    "X-Content-Type-Options": "nosniff"
  });
  response.end(JSON.stringify(value));
}

function readJsonBody(request) {
  return new Promise((resolveBody, rejectBody) => {
    let body = "";
    request.setEncoding("utf8");
    request.on("data", (chunk) => {
      body += chunk;
      if (Buffer.byteLength(body) > MAX_BODY_BYTES) {
        rejectBody(new Error("request body is too large"));
        request.destroy();
      }
    });
    request.on("end", () => {
      try {
        resolveBody(JSON.parse(body));
      } catch {
        rejectBody(new Error("request body must be valid JSON"));
      }
    });
    request.on("error", rejectBody);
  });
}

function reviewPage(token, nonce) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Community answer review | Family Tripwise</title>
  <style nonce="${nonce}">
    :root { color-scheme: light; font-family: Inter, ui-sans-serif, system-ui, sans-serif; color: #17211b; background: #f5f7f5; }
    * { box-sizing: border-box; }
    body { margin: 0; }
    header { background: #173d31; color: white; padding: 22px 24px; }
    header div, main { width: min(1120px, calc(100% - 32px)); margin: 0 auto; }
    h1 { margin: 0; font-size: 24px; letter-spacing: 0; }
    header p { margin: 7px 0 0; color: #d8e6df; }
    main { padding: 22px 0 56px; }
    .notice { border-left: 4px solid #c79520; background: #fff8e4; padding: 12px 14px; margin-bottom: 18px; }
    .summary { display: flex; gap: 10px; align-items: center; justify-content: space-between; flex-wrap: wrap; margin-bottom: 18px; }
    .counts { font-weight: 700; }
    .filters { display: inline-flex; border: 1px solid #aab5ae; border-radius: 6px; overflow: hidden; }
    .filters button { border: 0; border-right: 1px solid #aab5ae; border-radius: 0; background: white; color: #25352d; padding: 8px 11px; font: inherit; cursor: pointer; }
    .filters button:last-child { border-right: 0; }
    .filters button[aria-pressed="true"] { background: #dcebe4; font-weight: 700; }
    .draft { background: white; border: 1px solid #cbd3ce; border-radius: 8px; margin: 0 0 18px; padding: 18px; }
    .draft-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
    .eyebrow { margin: 0 0 5px; color: #526159; font-size: 13px; }
    h2 { margin: 0; font-size: 19px; letter-spacing: 0; }
    .status { border: 1px solid #98a59e; border-radius: 999px; padding: 4px 8px; font-size: 12px; font-weight: 700; white-space: nowrap; text-transform: uppercase; }
    .status-approved { background: #e2f3e8; border-color: #6c9d7d; }
    .status-revise { background: #fff3cf; border-color: #b69536; }
    .status-rejected { background: #f8e4e4; border-color: #b87b7b; }
    .meta { display: flex; flex-wrap: wrap; gap: 7px 16px; margin: 12px 0; color: #46564d; font-size: 14px; }
    a { color: #135c87; }
    .job { margin: 12px 0; padding: 10px 12px; background: #f0f4f1; }
    label { display: block; margin: 14px 0 6px; font-weight: 700; }
    textarea { width: 100%; resize: vertical; min-height: 128px; padding: 11px; border: 1px solid #9eaba3; border-radius: 5px; color: #17211b; background: white; font: inherit; line-height: 1.5; }
    textarea.notes { min-height: 76px; }
    .evidence { margin: 14px 0; padding-top: 12px; border-top: 1px solid #dde3df; }
    .evidence h3 { margin: 0 0 8px; font-size: 15px; }
    .evidence ul { margin: 0; padding-left: 20px; }
    .evidence li { margin: 7px 0; line-height: 1.45; }
    .link-call { color: #46564d; font-size: 14px; }
    .actions { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 14px; }
    button.action { border: 1px solid #66766d; border-radius: 5px; background: white; color: #17211b; padding: 9px 12px; font: inherit; font-weight: 700; cursor: pointer; }
    button.approve { background: #1c6949; border-color: #1c6949; color: white; }
    button.revise { background: #f6d576; border-color: #a77d08; }
    button.reject { border-color: #a24c4c; color: #852f2f; }
    button:disabled { cursor: wait; opacity: .55; }
    .message { min-height: 24px; margin-top: 9px; color: #315a45; font-size: 14px; }
    .empty { background: white; border: 1px solid #cbd3ce; padding: 32px 18px; text-align: center; }
    @media (max-width: 620px) { header { padding: 18px 0; } .draft { padding: 14px; } .draft-head { display: block; } .status { display: inline-block; margin-top: 9px; } .filters { width: 100%; } .filters button { flex: 1; } }
  </style>
</head>
<body>
  <header><div><h1>Community answer review</h1><p>Review concise, sourced answers before any separate posting decision.</p></div></header>
  <main>
    <div class="notice"><strong>Nothing here posts externally.</strong> Approval records that the wording is acceptable; posting still requires a separate explicit instruction.</div>
    <div class="notice"><strong>This queue is committed to a public repository.</strong> Do not enter usernames, personal data, private contact details, or private reviewer notes.</div>
    <div class="summary">
      <div class="counts" id="counts">Loading drafts...</div>
      <div class="filters" role="group" aria-label="Filter drafts">
        <button type="button" data-filter="pending" aria-pressed="true">Pending</button>
        <button type="button" data-filter="approved" aria-pressed="false">Approved</button>
        <button type="button" data-filter="revise" aria-pressed="false">Revise</button>
        <button type="button" data-filter="rejected" aria-pressed="false">Rejected</button>
        <button type="button" data-filter="all" aria-pressed="false">All</button>
      </div>
    </div>
    <div id="drafts" aria-live="polite"></div>
  </main>
  <script nonce="${nonce}">
    const REVIEW_TOKEN = ${JSON.stringify(token)};
    const root = document.querySelector('#drafts');
    const counts = document.querySelector('#counts');
    let queue = null;
    let filter = 'pending';

    function el(tag, options = {}, children = []) {
      const node = document.createElement(tag);
      for (const [key, value] of Object.entries(options)) {
        if (key === 'className') node.className = value;
        else if (key === 'text') node.textContent = value;
        else if (key === 'href') { node.href = value; node.target = '_blank'; node.rel = 'noopener noreferrer'; }
        else node.setAttribute(key, value);
      }
      for (const child of children) node.append(child);
      return node;
    }

    function tally() {
      const result = { pending: 0, approved: 0, revise: 0, rejected: 0 };
      for (const draft of queue.drafts) result[draft.user_review.decision] += 1;
      counts.textContent = queue.drafts.length + ' drafts · ' + result.pending + ' pending · ' + result.approved + ' approved · ' + result.revise + ' revise · ' + result.rejected + ' rejected';
    }

    function evidenceList(draft) {
      const list = el('ul');
      for (const evidence of draft.evidence) {
        const item = el('li');
        item.append(el('strong', { text: evidence.classification + ': ' }));
        item.append(el('a', { text: evidence.title, href: evidence.url }));
        item.append(document.createTextNode(' · checked ' + evidence.checked_on + ' · ' + evidence.note));
        list.append(item);
      }
      return el('div', { className: 'evidence' }, [el('h3', { text: 'Evidence and freshness' }), list]);
    }

    async function save(draft, decision, answer, notes, message, buttons) {
      buttons.forEach((button) => { button.disabled = true; });
      message.textContent = 'Saving...';
      try {
        const response = await fetch('/api/drafts/' + encodeURIComponent(draft.id) + '/review', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Review-Token': REVIEW_TOKEN },
          body: JSON.stringify({ decision, draft_answer: answer.value, notes: notes.value })
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Save failed');
        queue = result;
        render();
      } catch (error) {
        message.textContent = error.message;
        buttons.forEach((button) => { button.disabled = false; });
      }
    }

    function draftView(draft) {
      const decision = draft.user_review.decision;
      const heading = el('div', { className: 'draft-head' }, [
        el('div', {}, [el('p', { className: 'eyebrow', text: draft.destination + ' · ' + draft.community }), el('h2', { text: draft.question })]),
        el('span', { className: 'status status-' + decision, text: decision })
      ]);
      const source = el('a', { text: 'Open source question', href: draft.thread_url });
      const rules = draft.rules.links.length ? el('a', { text: 'Review community rules', href: draft.rules.links[0] }) : document.createTextNode('Rules checked');
      const meta = el('div', { className: 'meta' }, [source, el('span', { text: 'Observed ' + draft.observed_on }), rules, el('span', { text: 'Rules checked ' + draft.rules.checked_on })]);
      const answer = el('textarea', { 'aria-label': 'Draft answer for ' + draft.id });
      answer.value = draft.draft_answer;
      const notes = el('textarea', { className: 'notes', 'aria-label': 'Reviewer notes for ' + draft.id, placeholder: 'Optional notes for the next revision' });
      notes.value = draft.user_review.notes;
      const message = el('div', { className: 'message', role: 'status' });
      const actions = el('div', { className: 'actions' });
      const choices = [
        ['approved', 'Approve wording', 'action approve'],
        ['revise', 'Needs changes', 'action revise'],
        ['rejected', 'Reject', 'action reject'],
        ['pending', 'Reset to pending', 'action']
      ];
      const buttons = choices.map(([value, label, className]) => {
        const button = el('button', { type: 'button', className, text: label });
        button.addEventListener('click', () => save(draft, value, answer, notes, message, buttons));
        actions.append(button);
        return button;
      });
      const linkText = draft.family_tripwise_link.recommendation === 'include'
        ? 'Suggested Family Tripwise link: include only if it uniquely helps. '
        : 'Suggested Family Tripwise link: omit. ';
      const linkCall = el('p', { className: 'link-call', text: linkText + draft.family_tripwise_link.rationale });
      const section = el('section', { className: 'draft' }, [heading, meta, el('div', { className: 'job', text: 'Decision job: ' + draft.decision_job }), el('p', { className: 'link-call', text: 'Community rule check: ' + draft.rules.summary }), el('label', { text: 'Draft answer' }), answer, evidenceList(draft), el('p', { className: 'link-call', text: 'Uncertainty: ' + (draft.uncertainty || 'None recorded.') }), linkCall, el('label', { text: 'Reviewer notes' }), notes, actions, message]);
      return section;
    }

    function render() {
      tally();
      root.replaceChildren();
      const visible = queue.drafts.filter((draft) => filter === 'all' || draft.user_review.decision === filter);
      if (!visible.length) {
        root.append(el('div', { className: 'empty', text: filter === 'pending' ? 'No drafts are waiting for review.' : 'No drafts match this filter.' }));
        return;
      }
      visible.forEach((draft) => root.append(draftView(draft)));
    }

    document.querySelectorAll('[data-filter]').forEach((button) => {
      button.addEventListener('click', () => {
        filter = button.dataset.filter;
        document.querySelectorAll('[data-filter]').forEach((candidate) => candidate.setAttribute('aria-pressed', String(candidate === button)));
        render();
      });
    });

    fetch('/api/drafts', { cache: 'no-store' })
      .then((response) => response.json().then((value) => response.ok ? value : Promise.reject(new Error(value.error))))
      .then((value) => { queue = value; render(); })
      .catch((error) => { counts.textContent = 'Queue unavailable'; root.append(el('div', { className: 'empty', text: error.message })); });
  </script>
</body>
</html>`;
}

export function createCommunityReviewServer({
  queuePath,
  now = () => new Date(),
  today = () => projectDate(now())
}) {
  assert(queuePath && existsSync(queuePath), "queuePath must exist");
  readCommunityQueue(queuePath);
  const token = randomBytes(24).toString("base64url");
  const nonce = randomBytes(18).toString("base64url");
  const page = reviewPage(token, nonce);

  const server = createServer(async (request, response) => {
    try {
      const address = server.address();
      const listeningPort = typeof address === "object" && address ? address.port : null;
      const allowedHosts = new Set([
        `127.0.0.1:${listeningPort}`,
        `localhost:${listeningPort}`,
        `[::1]:${listeningPort}`
      ]);
      if (!allowedHosts.has(request.headers.host)) {
        json(response, 421, { error: "host must be loopback" });
        return;
      }
      const url = new URL(request.url ?? "/", "http://127.0.0.1");
      if (request.method === "GET" && url.pathname === "/") {
        response.writeHead(200, {
          "Cache-Control": "no-store",
          "Content-Security-Policy": `default-src 'none'; script-src 'nonce-${nonce}'; style-src 'nonce-${nonce}'; connect-src 'self'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'`,
          "Content-Type": "text/html; charset=utf-8",
          "Referrer-Policy": "no-referrer",
          "X-Content-Type-Options": "nosniff"
        });
        response.end(page);
        return;
      }
      if (request.method === "GET" && url.pathname === "/api/drafts") {
        json(response, 200, readCommunityQueue(queuePath));
        return;
      }
      const match = request.method === "POST" && url.pathname.match(/^\/api\/drafts\/([^/]+)\/review$/);
      if (match) {
        const allowedOrigins = new Set([...allowedHosts].map((host) => `http://${host}`));
        if (!allowedOrigins.has(request.headers.origin)) {
          json(response, 403, { error: "review writes require a same-origin request" });
          return;
        }
        if (request.headers["x-review-token"] !== token) {
          json(response, 403, { error: "invalid review token" });
          return;
        }
        if (!request.headers["content-type"]?.startsWith("application/json")) {
          json(response, 415, { error: "content type must be application/json" });
          return;
        }
        const input = await readJsonBody(request);
        const queue = readCommunityQueue(queuePath);
        applyCommunityReview(queue, decodeURIComponent(match[1]), input, today());
        writeCommunityQueue(queuePath, queue);
        json(response, 200, queue);
        return;
      }
      json(response, 404, { error: "not found" });
    } catch (error) {
      json(response, 400, { error: error.message });
    }
  });

  return { server, token };
}

export async function listenForCommunityReviews({ queuePath, port = 4178, host = "127.0.0.1" }) {
  assert(host === "127.0.0.1" || host === "::1", "review server must bind to loopback");
  for (let candidate = port; candidate <= port + 20; candidate += 1) {
    const instance = createCommunityReviewServer({ queuePath });
    try {
      await new Promise((resolveListen, rejectListen) => {
        instance.server.once("error", rejectListen);
        instance.server.listen(candidate, host, resolveListen);
      });
      return { ...instance, host, port: candidate };
    } catch (error) {
      instance.server.close();
      if (error.code !== "EADDRINUSE") throw error;
    }
  }
  throw new Error(`no available review port from ${port} through ${port + 20}`);
}

const modulePath = resolve(fileURLToPath(import.meta.url));
const invokedPath = process.argv[1] ? resolve(process.argv[1]) : "";
if (modulePath === invokedPath) {
  const root = resolve(dirname(modulePath), "..");
  const portArgument = process.argv.indexOf("--port");
  const requestedPort = portArgument >= 0 ? Number(process.argv[portArgument + 1]) : 4178;
  if (!Number.isInteger(requestedPort) || requestedPort < 1 || requestedPort > 65_535) {
    console.error("--port must be an integer from 1 to 65535");
    process.exit(1);
  }
  const instance = await listenForCommunityReviews({
    queuePath: join(root, "backlog/community-answer-drafts.json"),
    port: requestedPort
  });
  console.log(`Family Tripwise community review board: http://${instance.host}:${instance.port}`);
  console.log("Approval records wording only; nothing is posted externally. Press Ctrl+C to stop.");
}
