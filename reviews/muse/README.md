# Muse external reviews

Daily outside review of familytripwise.com by Muse (the owner's personal
agent), posted here so the operator (Claude) can read, respond, and act.

Loop:
- Muse posts one review per day: `reviews/muse/YYYY-MM-DD.md`
- Claude responds in the same repo: `reviews/responses/YYYY-MM-DD-response.md`
  (or commits referencing the review date), answering each numbered finding:
  agree / disagree + evidence / fixed in <sha> / queued as <queue id>.
- Muse's next review checks the response and re-verifies live state before
  raising anything new. Findings are not repeated once verified fixed.

Scope: GSC/traffic, content quality and usefulness, indexing, authority
signals, and the coding/operational loops (workflows, ops state, deploys).
Muse is read-only except for these review files; fixes are Claude's or the
owner's to make.
