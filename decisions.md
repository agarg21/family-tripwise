# Decisions

## 2026-07-07: Use Three-Agent SEO Operating System

Decision: Operate Family Tripwise through Master / Operator, Implementation Agent, and SEO Research & Review Agent.

Why:

- The project has grown beyond one chat.
- SEO research, implementation, and strategy coordination need clearer boundaries.
- Repo files should become the durable coordination layer instead of private chat memory.

Implications:

- Agents coordinate through `ops/current-cycle.md`, backlogs, progress, and decisions.
- SEO Research & Review should run before additional implementation unless the user gives a direct implementation request.
- Implementation should not create new page batches without strategy-backed handoff.

## 2026-07-07: Preserve Existing Docs

Decision: Keep the original docs in `docs/` and add an operating layer in `strategy/`, `agents/`, `ops/`, and `backlog/`.

Why:

- Existing docs contain useful history and strategy details.
- Flattening would lose context.
- The new operating layer can point to source docs while gradually consolidating direction.

## 2026-07-07: Improve Existing Indexed Pages Before More City Expansion

Decision: Pause additional destination expansion until the current thin-page quality risks are addressed.

Why:

- SRR-001 confirmed the site has 22 live sitemap URLs, all returning 200, but quality is uneven.
- The strongest current pages already match the strategy: core things-to-do pages, San Diego toddler, and upgraded San Diego / Las Vegas / New York City where-to-stay pages.
- The weakest current pages are still indexable: all itinerary pages, Chicago and San Antonio where-to-stay pages, and several thin teen pages.
- Publishing more cities before fixing these would increase thin-content risk and dilute the product/tool positioning.

Implications:

- Implementation should first upgrade the existing San Diego itinerary, Chicago/San Antonio stay pages, and thin teen pages or temporarily remove weak pages from the sitemap with `noindex, follow`.
- San Diego remains the first cluster to deepen before expansion because it already has kids, toddlers, teens, stay, and itinerary coverage.
- Do not create standalone best-family-hotel pages until a human-review workflow exists for hotel, fee, room, crib/rollaway, pool, parking, safety, and noise claims.

## 2026-07-07: Keep San Antonio Teens Page Indexed After Upgrade

Decision: Keep `site/things-to-do/san-antonio-with-teens.html` indexable after upgrading it to the stronger age-specific page pattern.

Why:

- The page now has standalone teen planning value instead of a thin card-only pattern.
- It focuses on older-kid trip differences: caverns, theme parks, River Walk logistics, food/reset planning, heat, drive time, and mixed-age sibling tradeoffs.
- It includes comparison tables, detailed teen-specific notes, itinerary variants, source/update notes, internal cluster links, and JSON-LD.

Implications:

- Keep the San Antonio teen URL in `site/sitemap.xml`.
- Do not add `noindex, follow` unless a later SEO Research & Review pass finds the page still does not deserve indexing.
- Continue to treat safety, transit, stroller, heat, and family-suitability guidance as planning guidance requiring user verification and/or human review.

## Prior Decisions

See existing docs for earlier decisions:

- `docs/research/domain-name-research.md`
- `docs/plan/deployment.md`
- `docs/plan/content-strategy.md`
- `docs/plan/90-day-execution-plan.md`
