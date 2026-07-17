# San Diego Family Reset Atlas prototype

Action: `FT-DEV-003`

This is an unpublished interaction and schema prototype. It uses synthetic fixtures only and is intentionally outside `site/` and the production sitemap.

## What it validates

- A deterministic record schema with provenance, freshness, reuse, confidence, uncertainty, and human-review fields.
- Keyboard-accessible filtering and synchronized list/map-shell selection.
- Explicit `UNKNOWN` states instead of inferred route, access, sensory, stroller, safety, or family-suitability conclusions.
- A no-storage interaction model: filters and selections exist only in page memory.

The marker positions are illustrative interface coordinates, not geography. No official page facts, source prose, coordinates, maps, or real venue records are ingested.

## Run locally

From the repository root:

```bash
python3 -m http.server 4176 --directory src/prototypes/san-diego-family-reset-atlas
```

Then open `http://127.0.0.1:4176/`.

## Validate

```bash
node --test src/prototypes/san-diego-family-reset-atlas/*.test.mjs
node --check src/prototypes/san-diego-family-reset-atlas/app.mjs
node --check src/prototypes/san-diego-family-reset-atlas/data.mjs
node --check src/prototypes/san-diego-family-reset-atlas/schema.mjs
```

Publication, real-record ingestion, downloadable data, outreach, and firm trip-planning claims remain blocked by the source/license and human-review gates in `docs/research/san-diego-reset-atlas-source-license-audit.md`.
