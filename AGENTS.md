# Codex Instructions

## Project

This repository is for building a family travel planning site and AI product. The product should help parents plan realistic trips with children, including where to stay, what to do, family hotel selection, stroller/transit difficulty, nap-friendly itineraries, weather backup plans, and family-specific review summaries.

## Operating Principles

- Treat SEO research as product input, not as a request to generate thin content.
- Prioritize helpful, structured, human-reviewable pages over generic AI-written travel prose.
- Use the US search market as the default unless a task explicitly says otherwise.
- Keep destination normalization consistent:
  - NYC, New York, and New York City map to `New York City`.
  - Oahu, Honolulu, and Waikiki are related but should remain separate when search intent differs.
  - Disney World and Orlando can be grouped, but Disney-specific terms must be marked.
  - London UK and London Ontario must be disambiguated.
  - Paris France and Paris TX must be disambiguated.
- Prefer interactive tools, tables, maps, filters, and decision flows over long static copy.
- Human review is required for hotel recommendations, area recommendations, safety notes, transit/stroller advice, and any claims that could materially affect a family trip.

## SEO Rules

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
- Do not present AI output as personally verified experience unless a human has reviewed or supplied the experience.
- Label estimated or model-derived scores clearly.

## Repository Conventions

- Keep research in `docs/research/`.
- Keep execution and product planning in `docs/plan/`.
- Keep the operator-owned rolling execution queue in `ops/seo-roadmap.json` with the human-readable policy and sequence in `ops/seo-roadmap.md`.
- Keep dated, public-safe GSC decision summaries in `ops/gsc-snapshots/`. Never commit GSC credentials, tokens, complete raw query exports, country/device rows, or user data.
- Keep source code in `src/` once implementation starts.
- Keep content templates in `docs/plan/content-strategy.md` until a CMS or content model exists.
- When adding app code, include a simple local setup path in `README.md`.

## Portfolio Operator Pilot

- Family Tripwise is enrolled in the central SEO Portfolio Operator at `/Users/apoorvagarg/Documents/SEO Agent/seo-lab/operator/`.
- The central runner may make path-scoped code changes directly in the local `main` checkout during the supervised pilot.
- This repository remains the source of truth for site code, strategy, trust rules, and human-review requirements.
- The operator owns cross-run evidence, observation windows, experiment selection, and portfolio reporting.
- The operator also owns creating and maintaining the rolling 28-day SEO roadmap. It updates selected-item state after every run, re-scores the queue weekly from fresh evidence, and requests user input only for material strategic gates defined in the roadmap and release policy.
- Before selecting work, read the latest dated GSC snapshot and state whether it is fresh API evidence, a reused import, stale, or unavailable. A stale snapshot does not freeze unrelated roadmap lanes, but it cannot support a fresh-GSC measurement claim.
- Do not change a URL protected by an active observation window unless a technical defect requires it. Unrelated development may proceed.
- Preserve pre-existing dirty files and inspect the diff before and after changes. Family Tripwise has standing authorization for direct-`main` push and continuous deployment only under the release gate below.
- Implement an approved operator experiment in this repository or an isolated worktree, then run the native QA commands before deployment.
- Every operator implementation must be reviewed by an independent reviewer subagent in the same run and recorded in `ops/operator-review.md` before it is considered complete.
- Independent subagent review is a code-and-policy quality gate, not a substitute for the human review required by the Operating Principles. An autonomous release may not introduce or materially change a firm human-gated claim unless durable evidence records the completed human review; drafts must remain clearly non-firm and outside the live site.
- The implementation operator must address P0-P2 findings and request re-review, for at most three review cycles. It may commit only after `PASS` or `PASS_WITH_P3`, green QA, and exact-path staging.
- After reviewer consensus and before commit, only mechanical evidence already available from immutable pre-commit outputs may be appended without another review (for example review verdict, timestamps, and QA results). Revalidate the final path list and diff; any product, content, code, configuration, or judgment change requires re-review. Record the later commit SHA, workflow run, deployment URL, and production results centrally after release; do not amend or add a site-repository commit solely to backfill them.
- Commits, direct pushes to `main`, and GitHub Pages deployment are authorized after review consensus, green QA, exact-path staging, and verification that every unpushed commit is action-recorded and review-clean.
- Before pushing, fetch `origin`, require no remote divergence, and inspect the complete `origin/main..main` commit and path range. Never push unrelated or unreviewed commits.
- At run start, when local `main` has no unpushed commit and `origin/main` is strictly ahead, a conflict-free `git merge --ff-only origin/main` is authorized after inspecting the incoming paths and confirming they do not overlap dirty files. Stop on divergence or overlap; never create an unattended merge commit or rebase.
- A dated snapshot commit produced by the already-reviewed GSC workflow is mechanical evidence ingestion, not an implementation release. It is exempt from per-snapshot subagent review only when changes are confined to `ops/gsc-snapshots/**`, schema/privacy validation passes, and no credential or complete raw-query data is present.
- A push that does not change `site/**` or the Pages workflow is push-only; do not wait for or manually trigger a Pages deployment.
- For a deployable change, monitor the native Pages workflow, verify its release marker matches the pushed commit, and run a predeclared action-specific content or behavior check on every affected production URL in addition to production SEO availability QA. Record the commit SHA, workflow run, affected URLs, expected invariants, and results. Retry one clearly transient workflow failure once.
- If a successful deployment produces a verified critical regression and the latest action is isolated, automatically revert that action, push the revert, and verify recovery. If rollback scope is ambiguous, stop and request input.
- User approval remains required for DNS/CNAME or hosting changes, broader GitHub permissions or secrets, force-push/history rewriting, destructive URL/indexability changes, a new destination or batch of more than three indexable pages, and unresolved trust-sensitive product judgment.
- Indexing requests, outreach, partnerships, and unrelated external-account mutation remain prohibited.
