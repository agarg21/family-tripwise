# Protected GSC Query Export

State: configured

Last updated: 2026-07-18

Family Tripwise's public GSC snapshots intentionally omit complete query rows. The protected query export path collects `page + query` rows only when manually requested and keeps the plaintext outside the public repository.

## Boundaries

- `tools/gsc-query-export.mjs` refuses to write plaintext query exports inside the public Family Tripwise repository.
- `.github/workflows/gsc-query-export.yml` uses the existing `GSC_SERVICE_ACCOUNT_JSON` GitHub secret but uploads only an encrypted `.cms` artifact.
- The workflow deletes plaintext JSON on the runner before upload.
- The public recipient certificate lives at `ops/gsc-query-export-recipient.pem`.
- The private decryption key lives outside this repo at `~/.codex/private/family-tripwise/gsc-query-export-private-key.pem`.
- Decrypted exports belong in `/Users/apoorvagarg/Documents/SEO Agent/seo-lab/operator/state/family-tripwise/protected-gsc-query-exports/`.

## Manual Run

Run the workflow for all page-query rows:

```bash
gh workflow run gsc-query-export.yml -R agarg21/family-tripwise
```

Run it for the San Diego stay page only:

```bash
gh workflow run gsc-query-export.yml -R agarg21/family-tripwise -f page_url="https://familytripwise.com/where-to-stay/san-diego-with-kids.html"
```

After the workflow completes, download the encrypted artifact and decrypt it locally:

```bash
mkdir -p /tmp/family-tripwise-gsc-query-export
gh run download RUN_ID -R agarg21/family-tripwise \
  -n family-tripwise-encrypted-gsc-query-export \
  -D /tmp/family-tripwise-gsc-query-export

mkdir -p "/Users/apoorvagarg/Documents/SEO Agent/seo-lab/operator/state/family-tripwise/protected-gsc-query-exports"
for file in /tmp/family-tripwise-gsc-query-export/*.json.cms; do
  out="/Users/apoorvagarg/Documents/SEO Agent/seo-lab/operator/state/family-tripwise/protected-gsc-query-exports/$(basename "${file%.cms}")"
  openssl cms -decrypt -inform DER \
    -in "$file" \
    -recip ops/gsc-query-export-recipient.pem \
    -inkey "$HOME/.codex/private/family-tripwise/gsc-query-export-private-key.pem" \
    -out "$out"
  chmod 600 "$out"
done
```

Never commit decrypted exports, complete query rows, credentials, country/device rows, or user data.
