# GSC Decision Snapshots

This directory stores dated, normalized Google Search Console summaries used by the Family Tripwise operator and preserved in GitHub history.

The repository is public. Snapshots may contain:

- collection and data-through timestamps;
- aggregate clicks, impressions, CTR, and average position;
- page-level metrics for public Family Tripwise URLs;
- sitemap status and discovered-page counts;
- read-only URL Inspection status for configured priority URLs;
- explicit freshness and completeness labels.

Snapshots must not contain credentials, tokens, service-account JSON, complete raw query exports, country/device rows, user data, or indexing-request mutations.

The daily GitHub workflow writes `YYYY-MM-DD.json` and `YYYY-MM-DD.md`. If more than one run occurs on the same day, the latest successful run replaces that day's files so Git history records the change.

## Authentication

The collector expects a GitHub Actions secret named `GSC_SERVICE_ACCOUNT_JSON`. The service-account email must have read access to the `sc-domain:familytripwise.com` Search Console property. The secret is used only at runtime and must never be written to disk or committed.

The service account's Google Cloud project must have the Search Console API enabled.

Until that secret exists, the scheduled workflow exits successfully without producing a fake snapshot. The operator must label the most recent snapshot as reused or stale.
