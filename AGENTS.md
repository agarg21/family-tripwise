# Codex Instructions

## Project

This repository is for building a family travel planning site and AI product. The product should help parents plan realistic trips with children, including where to stay, what to do, family hotel selection, stroller/transit difficulty, nap-friendly itineraries, weather backup plans, and family-specific review summaries.

## Operating Principles

- Treat SEO research as product input, not as a request to generate thin content.
- Prioritize helpful, structured, human-reviewable pages over generic AI-written travel prose.
- Build research authority rather than implying local or firsthand authority the project does not have. Family Tripwise's durable advantage is a maintained evidence layer that turns current official facts, online-review signals, community questions, maps, prices, policies, conflicts, and unknowns into faster family decisions.
- AI should improve evidence collection, normalization, comparison, refresh, and constraint routing. AI-generated prose or a summary of other pages is not by itself original value.
- Use the US search market as the default unless a task explicitly says otherwise.
- Keep destination normalization consistent:
  - NYC, New York, and New York City map to `New York City`.
  - Oahu, Honolulu, and Waikiki are related but should remain separate when search intent differs.
  - Disney World and Orlando can be grouped, but Disney-specific terms must be marked.
  - London UK and London Ontario must be disambiguated.
  - Paris France and Paris TX must be disambiguated.
- Prefer interactive tools, tables, maps, filters, and decision flows over long static copy.
- Hotel, area, transit/stroller, and family-fit guidance may be published from a documented high-quality research workflow when claims are clearly labeled as research-based, source-backed, date-stamped, and uncertainty-aware.
- Human review is still required before publishing any personally verified experience, safety assurance, exact route/stroller practicality verdict, or firm family-suitability claim that the research record cannot independently support.

## SEO Rules

- Treat `strategy/seo-doctrine.md` as the current decision doctrine. Depart from it only when fresh project evidence, current SERP evidence, or explicit user direction supports the exception.
- Do not use page count, publishing frequency, exact-match variants, competitor inventory, or calendar cadence as authority strategies. Every new URL needs a distinct SERP-supported user job and maintainable information gain.
- Do not diagnose a CTR problem from aggregate page/property data while aligned query cohorts average worse than position 20. Normal title/snippet experiments require a coherent relevant query family, at least 100 finalized 28-day impressions, current crawl state, and live-SERP evidence.
- Start with destination clusters where query volume, commercial intent, and SERP weakness overlap.
- Highest-intent pages:
  - `where to stay in {destination} with kids`
  - `best family hotels in {destination}`
  - `best area to stay in {destination} with kids`
- Medium-high intent pages:
  - `things to do in {destination} with kids`
  - `{destination} itinerary with kids`
- Medium intent pages:
  - `{destination} family vacation`
  - `kid-friendly {destination}`
  - `{destination} with toddlers`
  - `{destination} with teens`

## Product Rules

- Every destination cluster should eventually support:
  - Where-to-stay recommender
  - Family hotel shortlist
  - Things-to-do list with age filters
  - Nap-friendly itinerary builder
  - Rainy-day backup planner
  - Map export
  - Packing list by season and child age
- Do not present AI output or desk research as personally verified experience unless a human has reviewed or supplied the experience.
- Label estimated, model-derived, review-signal-derived, and research-based scores clearly.
- Keep official facts, booking observations, online-review signals, community hypotheses, estimates, editorial interpretation, and human-verified experience distinct. Do not call online-review synthesis a Family Tripwise review.
- Prefer one validated record source for visible page comparisons, downloads, structured data, and agent answers so public outputs cannot silently disagree.
- Hotel shortlists must keep a durable evidence record covering official property facts, current booking/fee checks, review-signal themes, conflicting reports, freshness, and unresolved unknowns.

## Repository Conventions

- Keep research in `docs/research/`.
- Keep execution and product planning in `docs/plan/`.
- Keep the operator-owned rolling execution queue in `ops/seo-roadmap.json` with the human-readable policy and sequence in `ops/seo-roadmap.md`.
- Keep dated, public-safe GSC decision summaries in `ops/gsc-snapshots/`. Never commit GSC credentials, tokens, complete raw query exports, country/device rows, or user data.
- Keep source code in `src/` once implementation starts.
- Keep content templates in `docs/plan/content-strategy.md` until a CMS or content model exists.
- When adding app code, include a simple local setup path in `README.md`.

## Independent Autopilot Pilot

- From 2026-08-12 through 2026-09-12 at 17:00 America/New_York, the user authorizes this permanent Family Tripwise Master / Operator thread to run twice daily as the project's only scheduler. Do not consult, dispatch through, validate leases from, or write to the central SEO Control Room during this pilot.
- This repository is the source of truth for site code, strategy, roadmap, evidence, trust rules, reviews, and release state. The Master is the single repository writer for each transaction.
- A scheduled run may select at most one substantive action. The schedule is not a work quota: healthy monitoring, unchanged evidence, or no concrete user benefit should end in a concise no-op without narrative churn.
- Prioritize verified production/technical/trust defects, unfinished review-clean work, evidence-qualified improvements to existing pages or shared evidence products, bounded existing-page research, and then useful community-answer drafts.
- Before selecting work, read the latest dated GSC snapshot and state whether it is fresh API evidence, reused, stale, or unavailable. Page/property averages are orientation only; content and CTR actions require aligned query evidence and the doctrine's eligibility gates.
- Improve existing pages before creating URLs. A new canonical/indexable page requires current SERP-overlap evidence for a distinct user job, material demand, a maintainable evidence layer, no clean fit in an existing URL, and explicit roadmap eligibility. New destinations, destructive URL/indexability changes, or batches larger than three pages still require fresh user approval.
- Community and forum research is qualitative evidence. The autonomous lane may save concise, source-linked answer drafts in `backlog/community-answer-drafts.md`, but it must never auto-post, vote, message, create accounts, evade moderation, impersonate a parent/local/traveler, claim firsthand experience, or insert a promotional link that does not uniquely help.
- Do not change a URL protected by an active observation window unless a verified technical, factual, trust, or material usefulness defect warrants intervention. Do not manufacture edits from scan cadence or low aggregate CTR.
- Preserve pre-existing dirty files and inspect the diff before and after changes. At run start, fetch origin; fast-forward only when branches have not diverged and incoming paths do not overlap dirty work. Never create an unattended merge commit, rebase, force-push, or discard user work.
- A dated snapshot commit from the reviewed GSC workflow is mechanical evidence ingestion when confined to `ops/gsc-snapshots/**`, schema/privacy validation passes, and no credential or complete raw-query data is present. Healthy snapshot, URL Inspection, and public-health checks do not consume the substantive-action allowance.
- Register the selected action, exact paths, evidence, acceptance criteria, measurement plan, and production invariants before substantive edits. Keep roadmap and current-cycle evidence accurate after the transaction.
- Every material code, content, configuration, research, or strategy change requires native QA and a different independent read-only reviewer in the same run. Address P0-P2 findings and request re-review for at most three cycles. Commit only after `PASS` or `PASS_WITH_P3`, green QA, and exact-path staging.
- Independent review is not a substitute for human evidence where the Operating Principles require it. Unsupported firsthand, safety, exact route/stroller, or firm family-suitability claims must remain unpublished.
- After reviewer consensus, append only mechanical evidence from immutable outputs without re-review. Any product, content, code, configuration, or judgment change requires another review.
- Direct pushes to `main` and GitHub Pages releases are authorized after consensus, QA, exact-path staging, and verification that every unpushed commit is action-recorded and review-clean. Fetch immediately before push, require no divergence, and inspect the complete unpushed range.
- Docs-only pushes do not require a Pages wait. For deployable changes, monitor Pages, verify the release marker, run production SEO QA, and check every predeclared affected-URL invariant. Retry one clearly transient failure once. Revert only an isolated latest action after a verified critical regression; stop when rollback scope is ambiguous.
- Indexing requests, analytics installation, external posting, outreach, partnerships, link placement/exchange/purchase, and unrelated external-account mutation remain prohibited without a new explicit user instruction.
- Do not create or modify another recurring automation. After the pilot cutoff, perform no project work until the user reauthorizes it.
