# Decisions

## 2026-07-11: Prioritize GSC-Signaled Existing Pages

Decision: Prioritize improving existing pages that Google is already testing before adding new city clusters, standalone hotel pages, or the deferred NYC weekend planner.

Why:

- The July 11, 2026 GSC review shows impressions increased to 162 but clicks remain 0 and average position remains weak at 60.6.
- The strongest visible page signal is San Diego where-to-stay, which maps to family hotel/stay intent but still requires human-review boundaries before any firm hotel recommendations.
- New York City things-to-do and where-to-stay pages continue to show relevant evergreen intent.
- Home/About still appear as known thin trust/navigation risks in local QA.

Implications:

- Implement `IMP-013` before reactivating `IMP-012` or creating new destinations.
- Improve San Diego lodging decision support without creating a standalone family hotels page.
- Improve NYC evergreen activity/stay support and internal links.
- Improve Home/About trust and methodology depth.
- Keep all hotel, safety, transit, stroller, area, and suitability claims clearly caveated unless human-reviewed.

## 2026-07-09: Defer IMP-012 For Now

Decision: Skip `IMP-012: Build Greater NYC Weekend Family Planner Pilot` for the current cycle.

Why:

- The user explicitly asked to skip it for now.
- The concept remains useful and researched, but keyword volume, CPC, difficulty, traffic, and revenue potential are still `UNKNOWN`.
- The current site may benefit more from trust, internal-link, tool-prototype, or hotel-review workflow work before adding a freshness-heavy local events page.

Implications:

- Keep `docs/research/srr-006-nyc-local-weekend-events.md` as a future reference.
- Move `IMP-012` from ready to deferred in the implementation backlog.
- Do not create `/things-to-do/nyc-this-weekend-with-kids.html` in the next implementation cycle.
- Do not send the Implementation Agent into the NYC weekend planner until the user reactivates it.

## 2026-07-08: Test Greater NYC Weekend Planner As Manual Hybrid

Decision: Test the NYC local/weekend concept as a manually curated hybrid product, not as an automated event scraper or a generic static article.

Why:

- The user lives in Jersey City and has first-party product need for a family activity planner covering NYC, Jersey City, Hoboken, and nearby reachable areas.
- Current SERP/source research shows strong incumbent calendars and local publishers, including Mommy Poppins, Time Out Kids, Brooklyn Bridge Parents, JCFamilies, Hoboken Girl, city/library/parks calendars, Eventbrite, NJ Kids, NJ Mom, and Macaroni KID.
- Family Tripwise can differentiate by combining source timestamps, family logistics, Jersey City/Hoboken transit context, free/paid filters, rainy-day flags, age fit, reservation need, and human-review status.
- Event data goes stale quickly and can materially affect a family's day, so automatic publishing is not appropriate yet.
- Keyword volume, CPC, difficulty, traffic, and revenue potential are `UNKNOWN` until measured with a named tool.

Implications:

- Recommended first URL is `/things-to-do/nyc-this-weekend-with-kids.html`, framed for NYC, Jersey City, Hoboken, and nearby reachable family activities.
- Build `IMP-012` as a pilot framework with manually reviewed current content, source URLs, and last-checked dates.
- Keep any page shell `noindex, follow` and outside the sitemap until it has enough reviewed current content to deserve indexing.
- Treat Instagram accounts as discovery/competitor signals only; do not scrape login-only or private Instagram content.
- Do not auto-publish event data until a reliable source, review, expiration, and QA workflow is proven.

## 2026-07-08: Keep Upgraded Cleanup Pages Indexed

Decision: Keep the upgraded cleanup pages indexable after the post-implementation SEO QA review, and improve the four remaining non-San-Diego itinerary pages rather than noindexing them.

Why:

- Local and production QA both returned 0 errors after commit `c4cedfc`.
- The upgraded San Diego itinerary, Chicago/San Antonio where-to-stay pages, teen pages, and NYC tourist things-to-do page now include stronger decision support, comparison tables or matrices, internal links, schema, and verification caveats.
- `site/about.html` and `site/index.html` are thin by the QA threshold, but they are trust/navigation pages rather than destination SEO targets.
- The four remaining non-San-Diego itinerary pages still target explicit `{destination} itinerary with kids` intent and should be upgraded to the San Diego itinerary pattern instead of removed from the index.

Implications:

- `IMP-010` is the next implementation-ready task.
- Do not noindex upgraded teen, where-to-stay, San Diego itinerary, or NYC tourist pages based on the old thin-page concerns.
- Keep `site/about.html` and `site/index.html` indexable for now; treat improvements there as lower-priority trust/navigation work.
- Continue to defer new city expansion, NYC local/weekend pages, and standalone hotel pages until the current itinerary cleanup and relevant research/human-review workflows are handled.

## 2026-07-08: Treat Early GSC Data As Directional

Decision: Use the July 8, 2026 GSC UI review to guide small improvements, not strategic pivots.

Why:

- GSC showed only 15 total impressions and 0 clicks.
- The visible query and page rows match the Family Tripwise strategy, but the sample is too small for stable ranking conclusions.
- The strongest current signal is the existing New York City things-to-do page, not a new city or new page family.

Implications:

- Improve the existing tourist-oriented NYC things-to-do page now.
- Defer NYC local/weekend page creation until SEO Research & Review validates demand, SERPs, freshness burden, and source workflow.
- Defer San Antonio hotel-intent expansion until there is more data and a human-review path for hotel claims.

## 2026-07-08: Noindex Legacy Static Shim Pages

Decision: For legacy static HTML shim pages that cannot be served as true 301 redirects in the current plain GitHub Pages setup, use `noindex, follow` plus canonical links to the active URL.

Why:

- GitHub Pages does not provide a clean repository-local 301 redirect mechanism for these plain static files.
- The existing San Diego shim pages already forward users with meta refresh and canonicalize to active URLs.
- Adding `noindex, follow` prevents legacy URLs from competing with canonical destination pages in search.

Implications:

- Keep legacy shim files out of `site/sitemap.xml`.
- Keep canonical links pointing to active URLs.
- Treat true 301 redirects as preferable if hosting changes later.

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
