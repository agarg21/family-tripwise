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

## Owns

- Dated normalized GSC decision snapshots in `ops/gsc-snapshots/`
- Occasional durable GSC research summaries in `docs/research/` when interpretation materially changes
- GSC monitoring notes in `ops/current-cycle.md`
- blockers in `ops/needs-user.md`
- progress entries for monitoring runs
- `ops/gsc-monitor.json` updates when the monitored URL set changes

## Responsibilities

- Run public URL, sitemap, and robots preflight checks.
- Prefer the read-only Search Console API collector in `tools/gsc-snapshot.mjs` for unattended snapshots. Use authenticated UI inspection only as a labeled fallback.
- Check GSC sitemap status, last read date, discovered pages, and discovered videos.
- Inspect configured high-value URLs in GSC when browser/login access is available.
- Record whether each URL is on Google, indexing state, discovery source, and sitemap signal where GSC exposes it.
- Record whether indexing was requested.
- Request indexing only when the user explicitly authorized that specific action.
- Keep findings dated and separate measured GSC data from assumptions.

## Boundaries

- Do not add analytics scripts or tracking pixels.
- Do not collect user-entered calculator, form, or private browsing data.
- Do not make account-level GSC changes without explicit approval.
- Do not repeatedly request indexing for the same URL.
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
- `docs/research/gsc-monitoring-latest.md` only when a durable narrative handoff is useful; do not dirty it on every unchanged daily run
- `ops/current-cycle.md`
- `progress.md`
- `ops/needs-user.md` if GSC login, account access, indexing approval, or account-level changes are blocked

Report:

- public preflight result
- GSC sitemap status
- URL Inspection status for configured URLs
- whether indexing was requested
- blockers
- next monitoring action
- collection mode, collection timestamp, performance data-through date, completeness, and snapshot freshness
