# San Diego stay-decision prototype

Unpublished local prototype for `FT-DEV-001`. It ranks San Diego area candidates from a family's stated planning priorities. The output is a model-derived planning prompt, not a reviewed area or hotel recommendation.

## Run locally

From the repository root:

```bash
python3 -m http.server 4173 --directory src/prototypes/san-diego-stay-decision
```

Then open `http://localhost:4173`.

## Validate

```bash
node --test src/prototypes/san-diego-stay-decision/*.test.mjs
```

## Review boundary

- All area-fit values are explicitly marked `model-derived` and `needs-human-review`.
- Every scored assumption has fields for a source URL, last-checked date, reviewer, review date, and review notes.
- Empty evidence fields intentionally lower confidence and are visible in the interface.
- Do not move this prototype into `site/`, connect it to an indexable page, or turn its output into a firm area/hotel recommendation until the assumptions and user-facing language receive human review.
