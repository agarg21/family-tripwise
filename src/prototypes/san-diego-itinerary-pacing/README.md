# San Diego itinerary-pacing prototype

Unpublished local prototype for `FT-DEV-002`. It converts a family's stated age, trip-length, nap/reset, weather, transport, and pace constraints into a transparent day shape. The output is a model-derived planning draft, not a reviewed route, attraction recommendation, or promise that a day will work.

## Run locally

From the repository root:

```bash
python3 -m http.server 4174 --directory src/prototypes/san-diego-itinerary-pacing
```

Then open `http://localhost:4174`.

## Validate

```bash
node --test src/prototypes/san-diego-itinerary-pacing/*.test.mjs
```

## Review boundary

- All day shapes and activity categories are model-derived templates marked `needs-human-review`.
- The planner does not calculate or assert exact drive, transit, walking, nap, queue, meal, or attraction times.
- Named San Diego examples are candidates to verify, not ranked recommendations.
- Every output carries route, weather, hours, accessibility/stroller, meal/restroom, current-advisory, and child-tolerance checks.
- No personal data is stored or sent anywhere.
- Do not move this prototype into `site/`, add it to the sitemap, or publish its output as a firm itinerary until a separate integration action and required human review are complete.
