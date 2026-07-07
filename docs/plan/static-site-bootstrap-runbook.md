# Static Site Bootstrap Runbook

Use this runbook to bootstrap a similar SEO-led static website with GitHub Pages, a custom domain, HTTPS, and Google Search Console.

This version is based on the Family Tripwise setup:

- Repository: `agarg21/family-tripwise`
- Production domain: `familytripwise.com`
- Registrar: Porkbun
- Host: GitHub Pages
- GSC property type: Domain property

Replace names, domains, and paths for new projects.

## 1. Local Project Setup

Create or enter the project directory:

```bash
mkdir -p "/path/to/Project Name"
cd "/path/to/Project Name"
git init
git branch -M main
```

Recommended structure:

```text
.
|-- AGENTS.md
|-- README.md
|-- docs/
|   |-- PROJECT_BRIEF.md
|   |-- plan/
|   |   |-- content-strategy.md
|   |   |-- deployment.md
|   |   `-- technical-plan.md
|   `-- research/
|       `-- domain-name-research.md
|-- site/
|   |-- .nojekyll
|   |-- CNAME
|   |-- index.html
|   |-- sitemap.xml
|   `-- styles.css
`-- tools/
    `-- generate-pages.mjs
```

Minimum files:

```bash
mkdir -p docs/plan docs/research site tools .github/workflows
touch site/.nojekyll
```

Create `site/CNAME` after the custom domain is selected:

```bash
printf "example.com\n" > site/CNAME
```

## 2. Create GitHub Repository

With GitHub CLI:

```bash
gh repo create OWNER/REPO --private --source=. --remote=origin --push
```

Example used for Family Tripwise:

```bash
gh repo create agarg21/family-tripwise --private --source=. --remote=origin --push
```

Check the repo:

```bash
gh repo view OWNER/REPO --json nameWithOwner,visibility,defaultBranchRef,url
git remote -v
```

## 3. GitHub Pages Workflow

Create `.github/workflows/deploy-pages.yml`:

```yaml
name: Deploy GitHub Pages

on:
  push:
    branches:
      - main
    paths:
      - "site/**"
      - ".github/workflows/deploy-pages.yml"
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Configure Pages
        uses: actions/configure-pages@v5

      - name: Upload static site
        uses: actions/upload-pages-artifact@v3
        with:
          path: site

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

Commit and push:

```bash
git add .
git commit -m "Configure static site and GitHub Pages deployment"
git push -u origin main
```

## 4. Enable GitHub Pages

In GitHub:

1. Open the repository.
2. Go to `Settings` -> `Pages`.
3. Set source/build type to GitHub Actions.
4. Save.

Verify with:

```bash
gh api repos/OWNER/REPO/pages
```

Important current-state fields to look for:

```json
{
  "build_type": "workflow",
  "public": true,
  "html_url": "https://example.com/"
}
```

## 5. Domain Search

Use SEO/product criteria first, then availability checks.

Suggested criteria:

- Easy to say and spell.
- Broad enough for future products/tools.
- Not overly tied to AI unless that is intentional.
- Trustworthy for the niche.
- Prefer `.com` for consumer-facing SEO sites.

Availability checks:

```bash
curl -i https://rdap.verisign.com/com/v1/domain/example.com
dig +short example.com A
```

Interpretation:

- RDAP `404` can mean the domain appears available.
- Lack of DNS records is a useful signal, not a purchase guarantee.
- Always confirm availability at the registrar before committing to branding.

Document candidates in `docs/research/domain-name-research.md`.

## 6. Domain Purchase

Family Tripwise used Porkbun.

User action usually required:

1. Log in to the registrar.
2. Search the chosen domain.
3. Add it to cart.
4. Complete checkout and payment.

Codex can help navigate to the checkout page, but payment and final purchase confirmation should remain user-controlled.

## 7. DNS Records For GitHub Pages

At the registrar, add these records for an apex domain on GitHub Pages:

| Type | Host | Value |
|---|---|---|
| A | blank / `@` | `185.199.108.153` |
| A | blank / `@` | `185.199.109.153` |
| A | blank / `@` | `185.199.110.153` |
| A | blank / `@` | `185.199.111.153` |
| CNAME | `www` | `OWNER.github.io` |

Example:

| Type | Host | Value |
|---|---|---|
| CNAME | `www` | `agarg21.github.io` |

Check DNS:

```bash
dig +short example.com A
dig +short www.example.com CNAME
```

## 8. Configure Custom Domain In GitHub Pages

In GitHub:

1. Open `Settings` -> `Pages`.
2. Add the custom domain, for example `example.com`.
3. Save.
4. Keep `site/CNAME` committed with the same domain.
5. Wait for DNS and certificate checks.

Check with:

```bash
gh api repos/OWNER/REPO/pages
```

Expected once healthy:

```json
{
  "cname": "example.com",
  "https_certificate": {
    "state": "approved"
  },
  "https_enforced": true
}
```

## 9. HTTPS / Certificate

After DNS resolves and GitHub accepts the custom domain:

1. Wait for certificate provisioning.
2. Enable `Enforce HTTPS` in GitHub Pages settings.
3. Confirm both apex and `www` are covered.

Checks:

```bash
curl -I https://example.com/
curl -I https://www.example.com/
```

Expected:

```text
HTTP/2 200
```

or a valid redirect from `www` to apex, depending on GitHub Pages behavior and browser cache.

## 10. Google Search Console

Prefer a Domain property because it covers:

- `http`
- `https`
- apex domain
- `www`
- subdomains

Steps:

1. Open Google Search Console.
2. Choose `Domain`.
3. Enter the apex domain, for example `example.com`.
4. Copy the TXT verification record.
5. Add it at the registrar as a root TXT record.
6. Return to GSC and click `Verify`.

DNS record shape:

| Type | Host | Value |
|---|---|---|
| TXT | blank / `@` | `google-site-verification=...` |

Check TXT:

```bash
dig +short example.com TXT
```

Submit the sitemap:

```text
https://example.com/sitemap.xml
```

GSC may briefly show `Couldn't fetch` immediately after submission. If the sitemap is publicly reachable, wait and refresh.

Public sitemap checks:

```bash
curl -I https://example.com/sitemap.xml
curl -s https://example.com/sitemap.xml | head -40
```

Expected:

```text
HTTP/2 200
content-type: application/xml
```

## 11. Deployment Verification

Useful commands:

```bash
git status --short
git log --oneline --decorate -8
gh run list --repo OWNER/REPO --limit 5
gh run view RUN_ID --repo OWNER/REPO --log-failed
gh api repos/OWNER/REPO/pages
curl -I https://example.com/
curl -I https://example.com/sitemap.xml
dig +short example.com A
dig +short example.com TXT
dig +short www.example.com CNAME
```

For Family Tripwise, these checks confirmed:

- `https://familytripwise.com/` returned `HTTP/2 200`.
- `https://familytripwise.com/sitemap.xml` returned `HTTP/2 200`.
- GitHub Pages certificate was approved.
- HTTPS enforcement was enabled.
- GSC sitemap status became `Success`.

## 12. Common Gotchas

- GitHub Pages may fail for private repos depending on the GitHub plan. Make the repo public or use another host such as Cloudflare Pages, Vercel, or Netlify.
- A Pages deployment can fail transiently with `Deployment failed, try again later`; rerun before over-debugging.
- Keep `site/CNAME` in the deployed artifact. Without it, GitHub Pages can lose the custom domain on deploy.
- Keep `site/.nojekyll` for static sites to avoid Jekyll processing surprises.
- GitHub certificate provisioning may lag DNS changes.
- GSC Domain verification requires DNS. URL-prefix verification is easier but narrower.
- Registrar DNS forms may use different fields for TXT values, sometimes switching from an input to a textarea after selecting `TXT`.
- Browser automation should stop before purchase, payment, DNS changes, or account-level changes unless the user explicitly confirms.

## 13. What Requires User Action

Usually user-controlled:

- Registrar checkout and payment.
- Making a private repo public, if needed.
- Confirming DNS changes.
- Login, MFA, CAPTCHA, or account security prompts.
- Any paid hosting or domain renewal setting.

Codex can usually automate:

- Local repo scaffolding.
- Research and planning docs.
- Static site files.
- GitHub Actions workflow.
- Git commits and pushes.
- GitHub Pages setting checks through `gh`.
- DNS form preparation.
- GSC property verification after DNS confirmation.
- Sitemap submission.
- HTTP, DNS, and deployment checks.
