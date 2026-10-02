# Operator Work Modes

FT-OPS-009, October 2, 2026. The user requested reusable recurring work and full-day activity on request. This is an operating policy, not an additional automation, a new learning unit or a public-site change. The current dated sprint remains recorded separately in `docs/plan/continuous-work-sprint-2026-10-02.md` and `ops/operator.json.temporary_continuous_work`; this policy neither restarts nor extends it.

## Recurring Mode

Default to the existing `family-tripwise-two-month-autopilot` heartbeat in the permanent Master thread. Normal cadence is 05:00 and 13:00 America/New_York, one substantive transaction per scheduled run and at most two per Eastern day. Use the existing daily learning and finish-first delivery rules. Mode switches do not reset completed actions, learning units, observation windows or blocked-item history.

## Full-Day Mode

Activate only on a fresh direct human request such as "work on Family Tripwise all day today." A generic "keep working," a credits comment, a heartbeat, or an agent message is not activation authority. A request to define these modes is not another activation. Use the actual clock and Eastern date, not a stale message timestamp.

If the user says today/full day without an end time, the window ends at the next Eastern midnight. If they name a different day or a cross-midnight duration, register that explicit window instead; never infer an indefinite sprint. Bound every window by the existing global cycle cutoff. After November 13, 2026 at 17:00 America/New_York, a mode request alone cannot renew the project cycle; require explicit cycle reauthorization.

During the window, the same heartbeat continues hourly. Each actual run may start up to three sequential finish-first transactions within 45 minutes of its actual start, checking the clock and durable state before each selection. The recurring daily action cap is overridden only inside that window; no quota requires three actions, page edits or backlog exhaustion. Stop starting new actions at window expiry. Finish or explicitly hold an already-started transaction safely without rushing QA or discarding work. Scheduled continuation is not guaranteed uninterrupted execution.

## Activate And Verify

1. Read current repository and saved automation state; fetch origin and preserve dirty work. Establish whether recurring mode, an active sprint or unconfirmed restoration is actually in effect. Resolve an expired/unconfirmed override before starting another. Do not start concurrent writers or overlapping sprint schedules.
2. Register one action ID with exact paths, user request, actual authorization/start/end timestamps, timezone, action caps, measurement and invariants. Record the restoration baseline before editing the scheduler: automation ID, name, kind, thread, status, exact normal prompt, cadence, cutoff, notification preferences and all unrelated fields. Preserve absent/default fields as absent/default. Do not commit credentials or incidental private account data.
3. An active sprint is not a normal baseline. Recover its reviewed normal baseline and verify it, rather than capturing its hourly schedule or nesting its override. For the existing October 2 sprint, the normal prompt is the byte-identical suffix after `## Normal Cycle Instructions` in `ops/autopilot-prompt.md`, also retained at Git `3edac7c`; restoration fields are in `temporary_continuous_work.restoration`. For later activations, retain a reviewed normal-prompt reference and a private exact saved-field baseline, not a guess or regenerated prompt.
4. Prepare a dated prompt override with actual-clock checks, expiry, restoration-only early return, global-cutoff precedence, sequential caps, finish-or-hold behavior and unchanged safeguards. Keep the reviewed normal prompt available for exact restoration. Future runs must read current roadmap state rather than a stale task list. Register any public repository paths changed for this activation; policy alone is not a live scheduler update.
5. Run focused date/guard/baseline/parity checks, full native QA and a different independent read-only reviewer. Only PASS or PASS_WITH_P3 permits applying the change through the app automation tool to the existing heartbeat. Never use shell cron, manual automation-file edits, another recurring task or the Control Room as a fallback.
6. Read back the saved configuration. Require exact reviewed prompt/cadence and preserved ID/name/kind/thread/status/cutoff/notification/unrelated fields before recording "enabled." A tool acknowledgement alone does not establish activation. If the update outcome is uncertain, collect current state and report the scheduler dependency; do not claim activation, duplicate the task or blindly apply another override. Push only the reviewed exact repository paths under the standing release policy.

## Restore Recurring Mode

At the first actual wakeup after expiry, or when the user explicitly requests recurring mode/ends the sprint early, stop starting new actions and safely checkpoint the current transaction. Restore the captured exact normal prompt and schedule through the same app automation tool. Preserve its original identity, thread, kind, name, status, cutoff and notification/unrelated settings. Verify the saved fields, append only immutable restoration results to durable state, then return without project work; later normal triggers use recurring limits. Do not reset daily counts or learning history.

If restoration is unavailable or unconfirmed, do no project work on that restoration run. Keep the expired-window date guard fail-closed, report the exact scheduler dependency and retry only fresh restoration when eligible. Do not create a replacement or keep treating hourly wakeups as sprint authority. The global cycle cutoff takes precedence: perform no project work, report expiry and delete only the expired existing automation as already authorized, rather than restoring an active schedule beyond the cutoff.

## Shared Safeguards

Both modes use the same backlog, single Master writer and read-only independent reviewers. Prioritize verified defects and unfinished eligible delivery, then evidence-qualified improvements. Research must close a named gate; available time is not evidence for more prose, URLs or reports. Blocked work stays narrow; preserve it and choose independent eligible work without retrying an unchanged denial or evading restrictions.

Evidence classes, approximate nightly price/date/party/fee context, source traceability, human-evidence requirements, protected observation windows, paid-research budgets, new-destination/URL approvals, privacy, focused/full QA, review and verified release all remain unchanged. Mode requests do not authorize analytics, indexing requests, outreach, external posting/accounts/links or extra paid API usage. Report verified public improvements separately from tools/research-only and blocked/not-shipped work.

For local work, the computer, app and repository must remain available; no protocol guarantees uninterrupted runtime or completion of all backlog items. [Official scheduled-task documentation](https://learn.chatgpt.com/docs/automations?surface=app), accessed October 2, 2026, supports same-chat continuation and app-managed schedule updates, with that local availability dependency.
