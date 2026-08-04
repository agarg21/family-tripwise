# Current Operating Cycle

Last updated: 2026-08-03

## Cycle Name

Cycle 2: Operate Family Tripwise through the SEO Portfolio Operator and its rolling roadmap.

## Active Priority

The repository mirror of project state is `ops/seo-roadmap.json`; the central Control Room owns scheduling and the dispatch ledger. The current five-city portfolio is complete. The August strategy deepens existing cities before any new-destination publication.

The direct-manual discovery pass is complete: fresh GSC evidence was collected, the existing sitemap was resubmitted and reread, and read-only URL Inspection now covers every sitemap URL. `FT-EVAL-002` remains evidence-gated rather than calendar-triggered.

`FT-RES-012`, `FT-AUTH-002`, and the research-only San Diego backlink-gap action `FT-AUTH-004` are complete and review-clean. `FT-AUTH-005` / `IMP-042` is released and production-verified at `e7c40ff4e770a2c94c6ed298808775c1ac9c9762` through Pages run `30667262994`. `FT-RES-013`, `FT-RES-014`, and `FT-RES-015` are complete and review-clean. The user selected the promoted Las Vegas existing-page action `FT-AUTH-006` on August 3. `FT-PUB-006` remains unselected and held.

## State Checkpoint

- Latest GSC evidence: `ops/gsc-snapshots/2026-08-03.md`, fresh authenticated API evidence with finalized data through 2026-08-01. The Las Vegas all-ages URL has 480 impressions, zero clicks, page-average position 60.3, remains indexed, and was last crawled July 31. This mechanical overlay preserves the `FT-RES-015` diagnosis and is not a CTR signal.
- Latest site release: `FT-AUTH-005` at commit `e7c40ff4e770a2c94c6ed298808775c1ac9c9762`; Pages run `30667262994` succeeded, and the release marker, target 200 response, production invariant, and production SEO QA passed.
- Active manual action: `FT-AUTH-006`, selected by direct user instruction on August 3. It may update only the existing Las Vegas all-ages page and its declared source, evidence, tests, status, and ops paths; no new URL, indexing request, outreach, external-account mutation, destination expansion, or recurring automation.
- Las Vegas diagnostic result: the target is indexed and has 464 public impressions, zero clicks and page-average position 60.69. Protected export run `30746285285` produced 54 rows and 456 attributable impressions; 410 impressions (89.9%) use direct action/list wording and another 18 (3.9%) use place/visit wording. Three live SERPs strongly overlap, so one broad all-ages URL remains correct. Zero finalized performance days follow the July 31 crawl, so no rewrite failure is claimed.
- Active implementation result: `FT-AUTH-006` keeps the existing Las Vegas URL, title, H1, filters, and 12 choices; it replaces the old 11-column matrix plus repeated detail/route/check layers with one source-dated cost-and-friction record set that drives the visible index, ItemList, and client-side CSV. Herschel cycle two returned `PASS` with no P0-P3 findings; 147/147 tests and state/SEO/responsive/source/privacy/scope QA pass. Exact-path commit, deployment and production verification remain.
- Latest completed manual action: `FT-RES-015`, research only, review-clean after Faraday cycle-two `PASS` with no P0-P3 findings.
- Authority implementation result: the existing San Diego all-ages page now contains the 12-attraction logistics index and CSV without adding a canonical/indexable HTML page. The teen page remained unchanged; no indexing request or outreach occurred.
- Promoted expansion action: `FT-PUB-006`, unselected and held during the August depth cycle; it still requires explicit user approval after strategy review.
- Active substantive Control Room action: none.
- Latest NYC release: `FT-IMP-017` / `IMP-035` / `SRR-026`, released and production-verified with Lagrange `PASS_WITH_P3`, no P0-P2 findings, 105/105 tests, and production SEO QA at 0 errors and 0 warnings.
- NYC hotel publication: complete; production contains one canonical/indexable page with 12 hotel cards, 24 Google Maps links, and one sitemap entry.
- NYC teen publication: complete; production contains one canonical/indexable 10-choice specialist with the expected cluster routes and one sitemap entry.
- NYC stay-area improvement: complete; production contains the canonical/indexable five-area guide with five quick-pick starts, one sitemap entry, and the expected cluster routes.
- NYC itinerary improvement: complete, released, and production-verified at commit `d0c4a7d` through Pages run `30204670128`.
- San Antonio research and releases: `FT-RES-010`, `FT-IMP-018`, `FT-PUB-005`, `FT-IMP-019`, `FT-IMP-020`, and `FT-IMP-021` are complete. The final itinerary action released at `90ed019` through Pages run `30237864556`; no planned San Antonio page remains open.
- Blocking measurement item: `FT-EVAL-002`. Both revised San Diego lodging URLs now have current crawl evidence, but finalized performance and protected query evidence must include the July 31 stay-area crawl before the checkpoint is eligible.

## Current Project State

- Local source of truth: `/Users/apoorvagarg/Documents/Travel SEO`
- GitHub repo: `https://github.com/agarg21/family-tripwise`
- Branch: `main`
- Remote: `origin`
- Production domain: `https://familytripwise.com/`
- Hosting: GitHub Pages through GitHub Actions
- Pages custom domain: `familytripwise.com`
- HTTPS: enforced, certificate approved for `familytripwise.com` and `www.familytripwise.com`
- GSC: authenticated read-only API collection is working; the August 3 snapshot has finalized data through August 1, 1,507 impressions and 3 clicks over 28 days, a successful sitemap read with 28 discovered pages, and 24 of 28 monitored URLs indexed
- Current site source: `site/`
- Main generators/scripts: `tools/generate-pages.mjs`, `tools/upgrade-priority-pages.mjs`
- Current released implementation: `FT-AUTH-005` at commit `e7c40ff4e770a2c94c6ed298808775c1ac9c9762`; GitHub Pages run `30667262994` succeeded and production verification passed

## Historical operating threads

- The permanent Family Tripwise SEO Operator task and central deterministic operator now own current selection and release work.
- The following earlier role-specific threads are historical references, not independent priority owners:
- Implementation Agent: `019f3ca5-67ed-7b93-a88c-838c5a026535`
- SEO Research & Review Agent: `019f3ca5-b3b7-7fd2-9f0f-ba411bf5c658`
- GSC Monitoring Agent: `019f5bf2-811b-7132-800d-74b0920052ec`

## Recent Work

- Added static-site bootstrap runbook at `docs/plan/static-site-bootstrap-runbook.md`.
- Added this operating layer:
  - `strategy/`
  - `agents/`
  - `ops/`
  - `backlog/`
  - `progress.md`
  - `decisions.md`
- Created project-scoped child chats for Implementation and SEO Research & Review.
- SEO Research & Review completed SRR-001 on 2026-07-07:
  - confirmed `strategy/current-strategy.md` preserves the source strategy;
  - verified local and production sitemap alignment;
  - verified all 22 sitemap URLs return 200;
  - found 0 local internal-link failures and 0 JSON-LD parse failures;
  - identified thin-page quality risks before further city expansion.
- Implementation completed the first SRR-001 handoff pass on 2026-07-07:
  - added `tools/seo-qa.mjs` for sitemap, internal-link, JSON-LD, thin-page, legacy-shim, and optional production checks;
  - documented the QA command in `README.md`;
  - upgraded `site/family-itinerary/san-diego-with-kids.html` via `tools/upgrade-priority-pages.mjs`;
  - added San Diego itinerary route variants, nap/rest assumptions, stroller/drive friction, meal/reset notes, skip guidance, cluster links, and `ItemList` / `FAQPage` schema;
  - re-ran local and production QA with 0 errors.
- Implementation completed IMP-003 on 2026-07-07:
  - upgraded Chicago and San Antonio where-to-stay pages via `tools/upgrade-priority-pages.mjs`;
  - added quick-pick area decisions, area matrices, parking/transit/stroller/noise caveats, nearby attraction fit, family verdicts, and schema;
  - used hotel-verification checklists instead of firm hotel recommendations because a human-reviewed hotel workflow is not yet available;
  - re-ran local and production QA with 0 errors and 13 remaining warnings.
- Implementation completed IMP-004 on 2026-07-07:
  - upgraded Chicago, Las Vegas, San Diego, and San Antonio teen pages via `tools/upgrade-priority-pages.mjs`;
  - added teen quick picks, comparison tables, detailed teen-specific notes, itinerary variants, internal cluster links, and schema;
  - kept San Antonio teens indexed after upgrading it to standalone teen intent and added an explicit index decision on the page;
  - re-ran local and production QA with 0 errors and 9 remaining warnings.
- SEO Research & Review completed a GSC UI review on 2026-07-08:
  - GSC showed 15 total impressions and 0 clicks, so all findings are directional and not statistically stable;
  - strongest early page-level signal was `things-to-do/new-york-city-with-kids.html` with 9 impressions and average position 11.8;
  - San Antonio hotel-intent queries appeared, but rankings are weak and hotel recommendation work still needs a human-review workflow;
  - NYC local/weekend concepts were identified as possible future research, not implementation-ready yet.
- Implementation completed IMP-005 and IMP-009 on 2026-07-08:
  - added `noindex, follow` to the three legacy San Diego shim pages while preserving canonicals to the active URLs;
  - kept the shim files out of `site/sitemap.xml`;
  - improved the existing tourist-oriented NYC things-to-do page with a first-time visitor decision section, a scan matrix by age/weather/budget/stroller-transit friction, a tourist-vs-local note, and stronger NYC stay/itinerary links;
  - re-ran local and production QA with 0 errors and 6 remaining warnings.
- SEO Research & Review completed post-implementation QA on 2026-07-08:
  - confirmed `IMP-001` through `IMP-005` and `IMP-009` align with strategy;
  - re-ran local and production QA with 0 errors and 6 remaining warnings;
  - confirmed upgraded San Diego itinerary, Chicago/San Antonio stay pages, upgraded teen pages, and the improved NYC tourist page should remain indexed;
  - confirmed legacy San Diego shim handling is sufficient for the current GitHub Pages setup;
  - found the four remaining non-San-Diego itinerary pages are the main remaining index-quality risk;
  - used Anti Gravity CLI via `agy` as an advisory reviewer, which agreed that the next ready task should upgrade the remaining itinerary pages.
- Implementation completed IMP-010 on 2026-07-08:
  - upgraded the Chicago, Las Vegas, New York City, and San Antonio family itinerary pages through `tools/upgrade-priority-pages.mjs`;
  - added destination-specific quick route decisions, 1-day/2-day/3-day/toddler/teen/rainy-day comparison tables, pacing rules, meal/reset notes, skip guidance, and stronger cluster links;
  - preserved planning-guidance caveats for hours, tickets, weather, route conditions, safety advisories, transit/stroller access, parking, drive or transfer times, and child energy;
  - added valid `ItemList` and `FAQPage` JSON-LD;
  - re-ran local and production QA with 0 errors and 2 remaining warnings.
- SEO Research & Review completed SRR-006 on 2026-07-08:
  - validated a greater NYC local/weekend-events concept using current SERP/source research and user context from Jersey City;
  - recommended a hybrid SEO page plus manually curated weekend planner module, not a pure static article and not automatic event publishing;
  - recommended first URL `/things-to-do/nyc-this-weekend-with-kids.html`, framed for NYC, Jersey City, Hoboken, and nearby reachable family activities;
  - marked keyword volume, CPC, difficulty, traffic, and revenue potential as `UNKNOWN` because no named keyword database was queried;
  - used Anti Gravity CLI via `agy` as an advisory reviewer;
  - created research artifact `docs/research/srr-006-nyc-local-weekend-events.md`;
  - created ready implementation handoff `IMP-012`.
- User deferred `IMP-012` on 2026-07-09:
  - keep the research and implementation brief as a future option;
  - do not send the Implementation Agent into the NYC weekend planner now;
  - do not create `/things-to-do/nyc-this-weekend-with-kids.html` as the next cycle.
- Master ran a current GSC UI review on 2026-07-11:
  - total impressions increased to 162, with 0 clicks and average position 60.6;
  - the strongest visible page signal is `where-to-stay/san-diego-with-kids.html` with 59 impressions;
  - New York City things-to-do remains the strongest activity-page signal with 25 impressions;
  - sitemap status remains Success with 22 discovered pages;
  - page indexing data is still processing;
  - manual actions and security issues show no issues detected;
  - created `docs/research/gsc-ui-review-2026-07-11.md`;
  - created ready implementation handoff `IMP-013`.
- Implementation completed IMP-013 on 2026-07-11:
  - improved San Diego where-to-stay for visible family hotel/stay intent without creating a standalone hotel page or firm hotel recommendations;
  - added San Diego hotel decision support and official-source booking checks for room setup, pool, breakfast/food, kitchen/laundry, crib/rollaway, parking/resort fees, noise, location, and property-source verification;
  - strengthened New York City things-to-do, New York City where-to-stay, Chicago where-to-stay, and Las Vegas things-to-do with GSC-aligned decision support and internal cluster links;
  - expanded Home into a practical navigation hub for the current five destination clusters;
  - expanded About with editorial methodology, source policy, human-review boundaries, and model-derived-vs-reviewed claim framing;
  - kept `IMP-012` deferred and added no new city, standalone hotel, or NYC weekend page;
  - re-ran local and production QA with 0 errors and 0 warnings.
- SEO Research & Review completed SRR-008 on 2026-07-11:
  - confirmed `IMP-013` improved GSC-signaled pages without unsupported expansion;
  - re-ran local and production QA with 0 errors and 0 warnings;
  - confirmed Home/About thin-page warnings are resolved;
  - confirmed sitemap remains unchanged at 22 canonical URLs and excludes legacy San Diego shims;
  - confirmed no new city cluster, standalone hotel page, or NYC weekend planner page was created;
  - confirmed `IMP-012` remains deferred;
  - found one implementation-ready cleanup: replace safety-loaded wording where the intended meaning is planning reliability or lower friction rather than source-backed physical safety;
  - created ready handoff `IMP-014`.
- Master completed IMP-014 on 2026-07-11 after the Implementation Agent turn hit a system error:
  - reframed safety-loaded planning shorthand in generated source and regenerated HTML;
  - changed uncaveated uses such as "safest default," "safest rainy-day anchors," "safer bad-weather anchor," and "hotel as the main safety valve" to planning-reliability or lower-friction wording;
  - preserved true safety-advisory, methodology, human-review, and official-source verification caveats;
  - re-ran local QA with 0 errors and 0 warnings;
  - confirmed sitemap remains 22 canonical URLs.
- Master created a dedicated GSC Monitoring Agent lane on 2026-07-13:
  - added `agents/gsc-monitoring-agent.md`;
  - added project monitor config at `ops/gsc-monitor.json`;
  - added generated `site/robots.txt` with a sitemap directive;
  - created GSC Monitoring Agent thread `019f5bf2-811b-7132-800d-74b0920052ec`;
  - ran the first public preflight and found production `robots.txt` was still 404 before deployment;
  - deployed setup commit `f7e514c` through GitHub Pages run `29259511918`;
  - reran public preflight successfully after deployment.
- Historical July 13 authenticated UI monitoring evidence:
  - public preflight passed for sitemap, robots, and configured monitor URLs;
  - confirmed GSC sitemap status is Success, last read Jul 8, 2026, with 22 discovered pages and 0 discovered videos;
  - inspected the priority URL subset without requesting indexing;
  - found six of seven inspected priority URLs are indexed;
  - found `https://familytripwise.com/things-to-do/san-diego-with-kids.html` is live and in the sitemap but GSC URL Inspection says `URL is not on Google` / `URL is unknown to Google`;
  - dated report lives at `docs/research/gsc-monitoring-2026-07-13.md`.
- Current authenticated API evidence is in `ops/gsc-snapshots/2026-08-02.json`, collected through the read-only API with finalized data through July 31; it supersedes earlier UI and API snapshots for current status.

## Ready For Operator Selection

`ops/seo-roadmap.json` is the repository queue mirror. The five-page San Antonio sequence, technical operations work, `FT-DEV-004`, `FT-RES-011`, `FT-RES-012`, `FT-AUTH-002`, `FT-AUTH-004`, released `FT-AUTH-005`, `FT-RES-013`, and `FT-RES-014` are complete. `FT-PUB-006` remains separately user-gated and is held during the August existing-city depth cycle. `FT-EVAL-002` remains non-blocking and must wait until finalized protected page/query evidence includes the July 31 San Diego stay-area crawl.

Deferred research topics are queued for later validation, not immediate implementation:

- Behavior-preserving generator/upgrader modularization is complete as `FT-DEV-004`; future city research and content work remain separate transactions.
- Later San Antonio hotel refreshes should preserve one page for hotel, resort, lazy-river, pool, room, kitchen, breakfast, and online-review variants unless observed SERP evidence supports a different boundary.

Findings to preserve:

- Current destination focus remains San Diego, Las Vegas, Chicago, New York City, and San Antonio; August prioritizes San Diego first, with Las Vegas and Chicago as secondary evidence-led candidates.
- San Diego, Las Vegas, Chicago, New York City, and San Antonio have completed their current deep quality passes.
- Existing pages should be improved before new cities are created.
- The first authority asset is live on the existing San Diego all-ages page as one source-dated 12-attraction logistics index; it created no new HTML page or duplicate comparison layer.
- Named-property hotel pages require durable source, uncertainty, freshness, and review records; personally verified, safety, quiet, exact-route, or unsupported firm family-suitability claims still require human review.
- Upgraded cleanup pages now deserve indexing; do not noindex them.
- `site/about.html` and `site/index.html` should remain indexable as trust/navigation pages; their prior thin-page warnings were resolved under `IMP-013`.
- NYC/Jersey City/Hoboken weekend-events work remains deferred; `FT-RES-009` does not revive it.

## Implementation State

Legacy implementation backlogs remain historical inputs. Current implementation eligibility, required evidence, target paths, observation windows, and status come from `ops/seo-roadmap.json` and the central operator state.

Current local QA findings from `node tools/seo-qa.mjs`:

- Errors: 0.
- Warnings: 0.
- `FT-AUTH-005` passed 10/10 focused and 142/142 full tests before its verified production release; responsive checks found no page overflow or implementation-origin JavaScript errors, and the `Choice` column remains visible after horizontal scrolling. A first local Chrome load can still log the site's pre-existing missing favicon.
- Home/About thin-page warnings are resolved.
- Legacy shim warnings are resolved because the three root-level San Diego HTML files are outside the sitemap and carry `noindex, follow`.
- The four remaining itinerary warnings were resolved under `IMP-010`.
- `IMP-012` remains deferred; no NYC weekend page should be created unless the user reactivates it.

## Waiting On User

No hard blocker right now.

Useful future user input:

- Which one bounded authority or existing-page action to select under the `FT-RES-014` doctrine, based on fresh evidence rather than calendar cadence.
- Whether a human reviewer can verify hotel/area/safety/transit claims.
- Whether Semrush and/or DataForSEO budget should be used for later research cycles; authenticated Chrome remains the current Semrush fallback.
- Whether to approve the named San Diego outreach wave. The authority asset is production-verified, but outreach remains a separate external-action gate.
- Orlando publication is not a current August decision; revisit it on or after the existing-city strategy review unless the user explicitly overrides the depth cycle.

## Recommended Next Operator

With explicit user approval, run the named San Diego outreach pilot; otherwise use fresh protected-query/crawl evidence to select one Las Vegas or Chicago existing-page audit. Do not publish Orlando, request indexing, or contact prospects without the required separate authority.

## GSC Monitoring

- Agent thread: `019f5bf2-811b-7132-800d-74b0920052ec`
- Config: `ops/gsc-monitor.json`
- Public preflight:

```bash
python3 ~/.codex/skills/gsc-monitor/scripts/public_gsc_preflight.py --config ops/gsc-monitor.json
```

- Latest local setup status: `site/robots.txt` is generated with `Sitemap: https://familytripwise.com/sitemap.xml`.
- Latest public preflight on July 27: sitemap returned 200 with 28 parsed URLs; robots returned 200 and advertises the sitemap; all 28 configured URLs returned 200 and appeared in the sitemap.
- Current normalized source: `ops/gsc-snapshots/2026-08-02.json`, collected through the authenticated read-only API on August 2 with finalized data through July 31.
- Current San Diego cluster research source: `docs/research/san-diego-cluster-research-decision-pack.md`, created under `FT-RES-006` on July 20, 2026.
- Completeness: `finalized-conservative`, based on a conservative two-day lag.
- Current GSC sitemap status after the manual refresh: Success, last read Jul 27, 2026, 28 discovered pages, 0 discovered videos. The live sitemap returns the same 28 URLs.
- Current URL Inspection summary: 24 of 28 canonical sitemap URLs are indexed; four are not indexed; zero inspection rows are collector-unknown.
- Currently not indexed: the San Diego all-ages and teen activity pages, New York City itinerary, and Chicago teen page.
- The San Diego stay-area and itinerary pages were crawled July 31; the San Diego and Las Vegas family-hotel pages remain indexed.
- These are discovery/crawl states, not content-quality verdicts. The San Diego toddler page and San Antonio teen page are indexed.
- GSC login blocker: none.
- Per-URL indexing requested: no. The repository policy continues to prohibit the per-URL request action; the existing sitemap was resubmitted under the user's direct approval.
- `docs/research/gsc-monitoring-latest.md` is a pointer/summary; `docs/research/gsc-monitoring-2026-07-13.md` preserves historical manual/UI evidence.
- Healthy or unchanged daily monitoring remains housekeeping and should update dated normalized snapshots, not narrative handoffs, unless interpretation, a blocker, monitored scope, or a material decision changes.

## Master Notes

Destination expansion reopened after `FT-DEV-004`. The separate `FT-RES-011` research transaction selected Orlando from current evidence; no city page was created inside the technical action or the research pass.
