# San Diego Family Reset Atlas candidate

Action: `FT-AUTH-002`

This is an unpublished, source-backed interaction candidate. It remains outside `site/` and the production sitemap.

## What it validates

- Thirty-nine short original research paraphrases across the exact 13 audited San Diego anchors.
- A deterministic record schema with unique record IDs, shared anchor IDs, provenance, freshness, reuse, confidence, uncertainty, and human-review fields.
- Enforced evidence contracts for any future `human-reviewed`, `cleared-data`, or `verified-source` state, including field-specific review notes, durable evidence references, coordinate bounds/provenance, and license/terms records.
- Keyboard-accessible filtering and synchronized list/anchor-board selection.
- Explicit `UNKNOWN` states instead of inferred route, stroller, sensory, quiet, safety, caregiver-facility suitability, or family-suitability conclusions.
- A no-storage interaction model: filters and selections exist only in page memory.

The records use current official venue, government, airport, State Parks, and transit pages checked July 29, 2026. They are internal research records, not cleared public data. No source prose, media, maps, or real coordinates are ingested. Anchor positions are an interface layout, not geography.

`evidence-registry.mjs` is intentionally empty. A later separately reviewed action must add an exact `docs/research/*.md#heading` reference before the validator can accept any reviewed, cleared, or geographically verified state.

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

Publication, downloadable data, outreach, and firm trip-planning claims remain blocked by the source/license and human-review gates in `docs/research/san-diego-reset-atlas-source-license-audit.md`.

The candidate also remains blocked on two parents independently completing the same three representative planning tasks defined in `docs/research/san-diego-reset-atlas-publication-evidence.md`. Agents must not simulate that evidence.
