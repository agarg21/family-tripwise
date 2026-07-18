# Deployment

## Hosting

The first version is published as a static site with GitHub Pages.

- Source directory: `site/`
- Deployment workflow: `.github/workflows/deploy-pages.yml`
- Custom domain: `familytripwise.com`

The workflow deploys on pushes to `main` when files under `site/` or the Pages workflow change. It can also be run manually from GitHub Actions.

## Continuous deployment policy

The repository currently deploys successfully through GitHub Pages from `main`. Routine reviewed releases do not require a branch or pull request.

Before pushing, the operator must:

1. complete the independent implement-review loop with `PASS` or `PASS_WITH_P3` and no P0-P2 findings;
2. run focused tests, local SEO QA, and staged-diff checks;
3. fetch `origin` and verify that the complete `origin/main..main` range contains only action-recorded, review-clean commits;
4. stop on remote divergence or ambiguous scope rather than merging or rebasing unattended.

Independent subagent review does not satisfy the separate human review required for firsthand experience, safety assurances, exact route/stroller practicality, or material family-suitability claims that cannot be supported from the research record. Researched hotel and area guidance may be released autonomously only when durable evidence records source coverage, review-signal handling, freshness, uncertainty labels, and the absence of unsupported personal-experience claims.

After reviewer consensus and before commit, the operator may append only mechanical evidence already available from immutable pre-commit results, such as the review verdict, timestamps, and QA results. Any subsequent product, content, code, configuration, or judgment change requires re-review. Commit SHA, workflow run ID, deployment URL, and production results are recorded centrally after release rather than backfilled into the same site-repository commit.

The Pages workflow runs only when `site/**` or the workflow itself changes. Documentation, research, and operator-only pushes should be recorded as push-only releases and should not trigger or wait for Pages.

For a deployable release, monitor the workflow and verify that `/release.json` reports the pushed commit SHA. For every affected URL, run and record a predeclared release-specific content or behavior invariant; the sitemap-wide HEAD sweep remains availability QA and is not sufficient on its own. Record the commit SHA, workflow run, affected URLs, expected invariants, and results. Retry one clearly transient workflow failure once. If deployment succeeds but a critical regression is verified, automatically revert only the latest isolated action and verify the rollback. Escalate instead when the rollback range or failure cause is ambiguous.

User approval remains required for DNS/CNAME or hosting changes, broader GitHub permissions/secrets, force pushes, destructive URL/indexability changes, a new destination or a batch above three new indexable pages, and unresolved trust-sensitive judgment.

## DNS

Set DNS at Porkbun to point the apex domain to GitHub Pages:

| Type | Host | Value |
|---|---|---|
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| CNAME | `www` | `agarg21.github.io` |

After DNS resolves, enable or verify HTTPS enforcement in GitHub Pages settings.

## Notes

- Keep `site/CNAME` in the deployed artifact so GitHub Pages preserves the custom domain.
- Keep `site/.nojekyll` so GitHub serves files exactly as uploaded.
- If this becomes a Next.js, Astro, or other build later, update the workflow to build into a static output directory and upload that output instead of `site/`.
