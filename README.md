# Family Tripwise

Family Tripwise is an SEO-led product experiment for parents planning trips with kids.

The strategy is to build destination-specific family travel pages and interactive AI tools that help parents decide where to stay, what to do, and how to build realistic itineraries based on kid ages, budget, stroller needs, transit difficulty, hotel/apartment preference, weather, and trip length.

## Current Focus

- Use US search demand as the default market.
- Work one city at a time from query research, observed SERP overlap, ranking-page analysis, persona hypotheses, and an every-section usefulness review.
- Improve existing pages before adding URLs unless the current SERP clearly requires a separate page type.
- Build research authority through a maintained evidence layer: official facts, source-dated review patterns, claim-level uncertainty, and visible synthesis that helps families decide faster.
- Differentiate through current source-backed research, clean comparisons, family-constraint routing, useful maps, and compact decision support. AI accelerates collection and synthesis; it does not manufacture experience.
- Run the renewed independent Master-thread autopilot through November 13, 2026 at 17:00 America/New_York. Cadence is not a content quota; evidence, native QA, independent review and release gates still apply.

Seven destinations now have public guides, including Cancun and Orlando lodging comparisons. Existing-page maintenance and evidence-qualified expansion proceed together; the current ranked research queue is in `ops/seo-roadmap.json`, with the September30 search screen in `docs/research/family-expansion-2026-09-30.md`.

## Starter Docs

- [Codex instructions](AGENTS.md)
- [Project brief](docs/PROJECT_BRIEF.md)
- [Semrush research summary](docs/research/semrush-family-travel-opportunity.md)
- [Domain name research](docs/research/domain-name-research.md)
- [Content strategy](docs/plan/content-strategy.md)
- [SEO cluster research protocol](docs/plan/seo-cluster-research-protocol.md)
- [Opinionated SEO doctrine](strategy/seo-doctrine.md)
- [Research authority and ranking timeline decision](docs/research/authority-ranking-timeline-and-depth-strategy-2026-08-01.md)
- [Product and AI plan](docs/plan/product-ai-plan.md)
- [Technical plan](docs/plan/technical-plan.md)
- [Deployment](docs/plan/deployment.md)
- [90-day execution plan](docs/plan/90-day-execution-plan.md)
- [Incremental city cluster playbook](docs/plan/incremental-city-cluster-playbook.md)
- [Current operating cycle](ops/current-cycle.md)
- [SEO roadmap](ops/seo-roadmap.md)
- [City status convention](status/README.md)

## Local Preview

Start the restricted static preview in a persistent terminal:

```bash
node tools/preview-site.mjs
```

Open `http://127.0.0.1:4173/` in the in-app browser. If that port is occupied, pass an unused port, for example `node tools/preview-site.mjs 4174`. This snapshots only public assets under `site/`, binds only to loopback, and provides no writes, directory listings, hidden files or symlink access. It does not expose the repository root. Stop with Ctrl-C; restart after generating or editing pages, then reload the browser before QA.

Browser access must pass its normal permission checks. Do not disable protections, use another surface to evade a denial, or deploy to obtain a preview. A denied `file:` URL is not proof of HTTP preview permission. If an HTTP preview is denied, record the exact origin/error and ask for normal user/app permission resolution. Do not repeatedly retry it in scheduled runs. Pre-release desktop/mobile rendering, interactions and independent review remain required.

Use the exact printed origin: the restricted server rejects a `localhost` Host even if it resolves to loopback. A server HTTP403 and a browser `ERR_BLOCKED_BY_CLIENT` are different failures; the Host check does not establish the cause of a client block.

Before browser QA, check the intended public assets:

```bash
node tools/preview-preflight.mjs /index.html /styles.css
```

This preflight starts and closes its own temporary restricted snapshot, comparing exact bytes/hashes and protective headers. Its reported origin is diagnostic and stopped when the command returns; use the separately running preview's printed URL for normal browser access. It checks server readiness only, not browser permission, desktop/mobile rendering, interactions or an actual browser download. It cannot replace release gates or be used as a browser-denial workaround. Missing/changed assets require correction/restart, not a protection change. After a browser denial, retain its exact origin/error and obtain normal user/app access resolution; do not automatically try another origin or browser.

The production site is configured for GitHub Pages at `familytripwise.com`.

### Community Answer Review

Start the localhost review board with:

```bash
node tools/community-answer-review.mjs
```

Open the printed `127.0.0.1` URL to review repository-backed forum and Reddit answer drafts. You can edit wording, leave notes, and mark a draft approved, revise, rejected, or pending. The tool writes only to `backlog/community-answer-drafts.json`; approval does not post the answer or authorize a later external write. This JSON file is committed to the public repository, so never enter usernames, personal data, private contact details, or private reviewer notes.

## Local QA

### Evidence Collection

Inventory all sitemap pages without network access:

```bash
node tools/evidence-audit.mjs
```

Collect a bounded source baseline or weekly comparison:

```bash
node tools/evidence-audit.mjs --collect --limit 500 --previous ops/evidence-audits/2026-09-30.json --output ops/evidence-audits/YYYY-MM-DD.json
```

This saves hashes, statuses, dated field gaps and unverified structured-price candidates, not source bodies. It never edits page facts or renews their dates. Blocked sources stay unknown; the agent reviews only relevant changes. Weekly rollout and price-adapter limits: `docs/plan/weekly-evidence-audit.md`.

`node tools/seo-opportunity-pull.mjs` is a no-charge research preflight. `--execute` makes the explicitly budgeted API calls, using protected local authentication. It refuses an existing output to prevent accidental billed repeats; never delete that guard or rerun a partially billed batch without reconciliation. Change the dated batch/output explicitly for a new authorized research action.

After collecting a new evidence audit, run `node tools/weekly-evidence-review.mjs --current ops/evidence-audits/NEW.json --previous ops/evidence-audits/PRIOR.json --output ops/evidence-audits/NEW-review.json`. It validates all-page/shared-model coverage and denial history, then separates unreconciled source changes from collection gaps and due fields. Audit/review outputs cannot overwrite existing evidence. The existing operator owns the weekly schedule; instructions and limitations are in `docs/plan/weekly-evidence-audit.md`. Hash changes never update a price or publish a claim automatically.

### Release Checks

Run the full repository tests, operating-state consistency check, and static SEO QA before release:

```bash
node --test tools/*.test.mjs
node tools/operator-state-qa.mjs
node tools/seo-qa.mjs
```

To also check production sitemap URLs for HTTP 200 responses:

```bash
node tools/seo-qa.mjs --production
```

Regenerate the complete static site with:

```bash
node tools/generate-pages.mjs
```

The command remains the stable entry point. Its page data and render/update logic are separated under `tools/page-generation/` so a city specification can be reviewed without searching one multi-thousand-line script.

## Source Of Truth

Whole-site maintenance has one entry point: `node tools/site-maintenance.mjs`. It checks all31canonical pages across hotel, activity, stay-area, itinerary, teen/toddler and utility contracts without network calls or public edits. Save a new immutable report with `--date YYYY-MM-DD --output ops/page-quality/YYYY-MM-DD-site-maintenance.json`. It preserves approximate nightly prices and original observation dates; complete type coverage does not mean every fact or price is fresh. The existing weekly operator can opt into bounded source comparison using the single command in `docs/plan/weekly-evidence-audit.md`; no new scheduler. Framework and remaining evidence work: `docs/plan/page-quality-standard.md`.

Exact-family room research can be reviewed as a same-source CSV using `node tools/family-room-comparison.mjs ROOM_PACK.json --date YYYY-MM-DD --prices PRICE_SAMPLE.json OTHER_SAMPLE.json --output /tmp/new-room-comparison.csv`. It preserves public plan/nightly budget, party/stay/fee/cancellation/age-source context and unpriced rows; existing output files and the public site directory are rejected. It does not fetch sources or publish pages. Examples and boundaries: `docs/plan/family-room-comparison-export.md`.

Hotel building and maintenance share a versioned adapter and offline quality queue. Run `node tools/page-quality.mjs`, or add `--date YYYY-MM-DD --output ops/page-quality/YYYY-MM-DD.json` for a saved deterministic report. It reads existing models, preserves prices and flags evidence/basis gaps without editing pages. Workflow and remaining migrations: `docs/plan/page-quality-standard.md`. The all-page source audit reuses these records; neither tool grants publication approval.

Activity maintenance starts with the twelve maintained San Diego logistics records: `node tools/activity-quality.mjs`. Add `--include-vegas` to include12retained LasVegas admission/cost-friction records without renewing their prices or dates. Expanded coverage is two pages/24attractions/120fields, with four activity-page gaps and24explicit Vegas weather/transport gaps. To save a dated report, use `--date YYYY-MM-DD --output ops/page-quality/YYYY-MM-DD-activities.json`. Both hotel/activity quality commands reject existing output paths. The pilots preserve mixed source-model dates, original admission/fee/age/product exclusions, costs, duration/weather estimates and unconfirmed access/transport prompts; they do not fetch sources, establish current prices or change public pages. Use this beside the hotel check in the existing weekly operator, not another automation. Boundaries: `docs/plan/activity-evidence-standard.md`.

Run `node tools/activity-card-quality.mjs` for the detailed 37-card San Antonio/Chicago/NYC editorial comparison queue. It retains nine fields per attraction (333 total) with all atomic sources and verification dates explicitly unmapped. July page-source notes and page-level source lists are retained context, not proof for the individual age, price, stroller, rain or rest labels. Save a new immutable report with `--date YYYY-MM-DD --output ops/page-quality/YYYY-MM-DD-activity-cards.json`. The unified runner includes this contract and sixteen remaining stay-area/itinerary/teen/toddler models. Current exact-visit budgets, field-source mapping and source-specific automatic price collection remain evidence gaps. The offline commands make no network calls, public changes or date renewal.

- `ops/seo-roadmap.json`: machine-readable action and release state.
- `ops/current-cycle.md`: concise current operating checkpoint.
- `backlog/community-answer-drafts.json`: validated community-answer drafts and user review decisions; posting is always disabled.
- `status/`: city-level page roles, frozen evidence baselines, review coverage, release state, and blockers.
- `docs/research/`: dated decision packs and evidence records.
- `docs/plan/`: reusable policy and workflow.
- `site/`: deployable static output.
- `tools/`: deterministic generation and QA.

Historical launch briefs remain useful evidence, but they do not override the current roadmap or city playbook.
