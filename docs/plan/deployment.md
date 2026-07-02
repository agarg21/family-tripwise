# Deployment

## Hosting

The first version is published as a static site with GitHub Pages.

- Source directory: `site/`
- Deployment workflow: `.github/workflows/deploy-pages.yml`
- Custom domain: `familytripwise.com`

The workflow deploys on pushes to `main` when files under `site/` or the Pages workflow change. It can also be run manually from GitHub Actions.

## Current GitHub Pages Constraint

GitHub rejected Pages setup while this repository was private:

> Your current plan does not support GitHub Pages for this repository.

Options:

1. Make `agarg21/family-tripwise` public and use GitHub Pages.
2. Keep the repository private and deploy through Cloudflare Pages, Vercel, Netlify, or another host that supports private GitHub repositories.
3. Upgrade GitHub plan/support for private-repository Pages, if desired.

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
