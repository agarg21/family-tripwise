# Community Answer Drafts

Last updated: 2026-08-12

This is the policy for the structured review queue in `backlog/community-answer-drafts.json`, not a posting queue. The independent autopilot may research and draft concise answers to current family-travel questions, but it may not post, vote, message, create an account, or present desk research as personal experience.

Start the local review board with `node tools/community-answer-review.mjs`, then open the printed `127.0.0.1` URL. The board can edit answer wording and reviewer notes and record `pending`, `approved`, `revise`, or `rejected`. It cannot change source or evidence identity and has no external posting integration. The queue is committed to the public repository: do not enter usernames, personal data, private contact details, or private notes.

## Draft Requirements

Each draft must record:

- source thread URL and observed date;
- community and relevant posting/link rule check;
- exact question and the family decision it represents;
- concise answer-first draft;
- official facts, review/community signals, interpretation, and unknowns kept distinct;
- source links and freshness;
- whether a Family Tripwise link is genuinely useful or should be omitted;
- user-review status.

Do not retain usernames, copied review text, personal data, or complete thread exports. Paraphrase only what is needed to understand the question.

## Decision Semantics

- `pending`: ready for the user to assess, or reset for later review.
- `approved`: wording accepted for a possible later posting action; external posting is still not authorized.
- `revise`: the next autopilot run may address the user's notes without treating the wording as accepted.
- `rejected`: do not revive the answer unless materially new evidence or a new user instruction changes the decision.

The structured queue, rather than this Markdown file, contains draft text and counts. It must keep `posting_authorized` set to `false`.

## External Boundary

External posting is not authorized by the autopilot. An approved draft still requires a fresh explicit instruction before any post, vote, message, link insertion, account action, or other external write.
