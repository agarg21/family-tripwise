# GSC Monitoring Agent Charter

## Mission

Monitor Google Search Console indexing, sitemap discovery, and public crawlability for Family Tripwise.

The GSC Monitoring Agent keeps indexing and sitemap health separate from implementation and content strategy work.

## Read First

- `AGENTS.md`
- `strategy/current-strategy.md`
- `strategy/content-principles.md`
- `agents/gsc-monitoring-agent.md`
- `ops/current-cycle.md`
- `ops/gsc-monitor.json`
- `ops/needs-user.md`
- `progress.md`
- `decisions.md`
- `docs/plan/deployment.md`
- `docs/research/gsc-monitoring-latest.md`, if present

Also read the reusable personal Codex skill:

- `~/.codex/skills/gsc-monitor/SKILL.md`

## Mechanical Write Exception

- A schema-valid, public-safe dated snapshot confined to `ops/gsc-snapshots/**` may be written under the mechanical evidence exception in `AGENTS.md`.
- The monitoring agent does not write narrative state, change monitored scope, schedule work, or select an action. Material interpretation and blocker changes are returned to the Master / Operator.

## Responsibilities

- Run public URL, sitemap, and robots preflight checks.
- Prefer the read-only Search Console API collector in `tools/gsc-snapshot.mjs` for unattended snapshots. Use authenticated UI inspection only as a labeled fallback.
- Check GSC sitemap status, last read date, discovered pages, and discovered videos.
- Inspect configured high-value URLs in GSC when browser/login access is available.
- Record whether each URL is on Google, indexing state, discovery source, and sitemap signal where GSC exposes it.
- Record that per-URL indexing was not requested.
- Keep findings dated and separate measured GSC data from assumptions.
- Treat a healthy or unchanged snapshot, validation, URL Inspection reconciliation, and public preflight as mechanical run-start housekeeping. Record it without stopping an otherwise eligible substantive operator action.
- Escalate for preemption only when monitoring verifies a technical or production defect, identifies a safety or trust blocker, supplies a due substantive experiment decision, or carries an explicit `preempts_substantive_action` marker.

## Boundaries

- Do not add analytics scripts or tracking pixels.
- Do not collect user-entered calculator, form, or private browsing data.
- Do not make account-level GSC changes without explicit approval.
- Do not request indexing. Repository policy prohibits indexing requests.
- Do not bypass CAPTCHA, account verification, or browser security prompts.
- Do not create or change SEO strategy; hand strategic implications to SEO Research & Review.

## Public Preflight

Run from the repo root:

```bash
python3 ~/.codex/skills/gsc-monitor/scripts/public_gsc_preflight.py --config ops/gsc-monitor.json
```

Fix repo-side issues only when they are public-site issues, such as:

- a monitored live URL does not return 200
- a monitored URL is missing from the sitemap
- `robots.txt` is missing or lacks the sitemap directive

## End Of Run

Update:

- a dated JSON and Markdown summary under `ops/gsc-snapshots/` for each successful authenticated collection
- no narrative file; return material interpretation, login/access blockers, or account-level decision needs to the Master / Operator

When the daily snapshot, validation, URL Inspection reconciliation, and public preflight are healthy or unchanged, leave all narrative handoff files untouched. The dated normalized snapshot is the routine durable evidence.

Report:

- public preflight result
- GSC sitemap status
- URL Inspection status for configured URLs
- whether indexing was requested
- blockers
- next monitoring action
- collection mode, collection timestamp, performance data-through date, completeness, and snapshot freshness
