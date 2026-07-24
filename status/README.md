# City Status Convention

City files in this directory are durable page-level decision records. They are not daily dashboards.

Each city status file must identify:

- the evidence snapshot used for the page decision or implementation baseline;
- the full production URL for every page;
- directional demand with source date and overlap limits;
- page-level GSC position unless protected query evidence supports a query-specific statement;
- page role, target rank, review coverage, release state, blocker, and next eligible action;
- the action ID and repository-known release state for the latest completed city implementation.

Daily search evidence belongs in `ops/gsc-snapshots/`. A city table should be updated when a page role, review state, release state, blocker, or material evidence-based decision changes. It should not be rewritten merely because another daily snapshot arrived.

Use `Baseline GSC` rather than `Current GSC` when a number is intentionally frozen at the implementation decision. Never call a historical snapshot the latest snapshot.

The release commit, workflow run, deployment result, and production verification are recorded centrally after deployment. Do not create a repository commit solely to backfill them. Update the city file and related repository narratives only as part of another authorized transaction or an explicitly dispatched/user-requested reconciliation. When repository release evidence is present, `node tools/operator-state-qa.mjs` checks it for common stale-language and metadata mismatches.
