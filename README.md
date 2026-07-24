# Family Tripwise

Family Tripwise is an SEO-led product experiment for parents planning trips with kids.

The strategy is to build destination-specific family travel pages and interactive AI tools that help parents decide where to stay, what to do, and how to build realistic itineraries based on kid ages, budget, stroller needs, transit difficulty, hotel/apartment preference, weather, and trip length.

## Current Focus

- Use US search demand as the default market.
- Work one city at a time from query research, observed SERP overlap, ranking-page analysis, persona hypotheses, and an every-section usefulness review.
- Improve existing pages before adding URLs unless the current SERP clearly requires a separate page type.
- Differentiate through current source-backed research, clean comparisons, family-constraint routing, useful maps, and compact decision support.
- Keep the central Control Room as the only scheduler. Manual work in this repository is user-directed and still follows the same QA, independent-review, release, and reconciliation gates.

San Diego, Las Vegas, and Chicago have completed deep quality passes. New York City is the leading next-city research candidate; it is not pre-approved page scope until a current city decision pack establishes the architecture.

## Starter Docs

- [Codex instructions](AGENTS.md)
- [Project brief](docs/PROJECT_BRIEF.md)
- [Semrush research summary](docs/research/semrush-family-travel-opportunity.md)
- [Domain name research](docs/research/domain-name-research.md)
- [Content strategy](docs/plan/content-strategy.md)
- [SEO cluster research protocol](docs/plan/seo-cluster-research-protocol.md)
- [Product and AI plan](docs/plan/product-ai-plan.md)
- [Technical plan](docs/plan/technical-plan.md)
- [Deployment](docs/plan/deployment.md)
- [90-day execution plan](docs/plan/90-day-execution-plan.md)
- [Incremental city cluster playbook](docs/plan/incremental-city-cluster-playbook.md)
- [Current operating cycle](ops/current-cycle.md)
- [SEO roadmap](ops/seo-roadmap.md)
- [City status convention](status/README.md)

## Local Preview

Open any file under `site/` directly in a browser. The generated pages do not require a local server for basic review.

The production site is configured for GitHub Pages at `familytripwise.com`.

## Local QA

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

## Source Of Truth

- `ops/seo-roadmap.json`: machine-readable action and release state.
- `ops/current-cycle.md`: concise current operating checkpoint.
- `status/`: city-level page roles, frozen evidence baselines, review coverage, release state, and blockers.
- `docs/research/`: dated decision packs and evidence records.
- `docs/plan/`: reusable policy and workflow.
- `site/`: deployable static output.
- `tools/`: deterministic generation and QA.

Historical launch briefs remain useful evidence, but they do not override the current roadmap or city playbook.
