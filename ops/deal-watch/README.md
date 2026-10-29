# Deal watch (QUEUE G09 step 1, OWNER D15)

`.github/workflows/deal-watch.yml` runs `tools/deal-watch.mjs` once an hour (OWNER D15 approves this hourly cadence for
official deal pages, instead of the weekly default for other official pages; schedule only, no secrets,
no manual trigger, so each URL is fetched at most once per hour).

- `sources.json` — the official deal pages watched (operators' own pages only). Edited by the operator.
- `state.json` — per source: status, headline, the short offer-signal lines extracted from the page
  (title, h1, meta description and lines that look like offer terms) and their hash. Never raw bodies.
  Written only by the workflow; it commits only when something changed.
- `flags.json` — pending flags: `changed` (offer signal changed; added/removed lines shown), `blocked`
  (robots.txt disallows, robots.txt unreadable, HTTP 401/403/429 or a bot/CAPTCHA page) or `unreachable`
  (3 errors in a row). The operator takes pending flags before other queue work, verifies the change on
  the official page (a flag is a lead, never a fact), then deletes the flag in its own commit.

Rules: robots.txt and Crawl-delay are honored (a Crawl-delay over 60 s counts as blocked); a blocked or
unreachable source is not fetched again until its `url` or `retry` value in `sources.json` changes (add
`"retry": 1`, or raise it by 1, after checking the source by other means). The workflow also skips a run
that starts under 55 minutes after the previous one, so a late scheduled run never doubles a fetch. Never add deal or news sites here; they are leads for the operator only.
