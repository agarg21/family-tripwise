# Trend watch (QUEUE G16, docs/plan/trend-fast-lane.md sections 1–2)

`.github/workflows/trend-watch.yml` runs `tools/trend-watch.mjs` every 30 minutes (minutes 11 and 41; a run
that starts under 25 minutes after the previous one is skipped, including manual runs). No secrets.

- `sources.json`: local news, city-guide and tourism-board RSS/Atom feeds per city, plus one GDELT DOC 2.0
  query per city (`gdelt.enabled`; requests 10 s apart). Never official venue or operator pages: those stay
  on the once-a-week rule. `rejected` lists feeds checked and not used, with the reason. Edited by the operator.
- `state.json`: per-source status, dedupe keys (normalized link and title hashes, with expiry) and recent
  relevant items (short title, link, outlet, times, score) for cross-outlet momentum. Written only by the
  workflow, committed with flag changes or when a source's status changes.
- `flags.json`: `flags` (trend leads) and `source_alerts` (a feed became blocked or unreachable).

## How the operator consumes a flag
1. Take `priority: "high"` flags before other queue work except live-site defects; normal flags with G16.
2. A flag is a lead, never a fact. Open the outlet links, then verify on the primary source (official,
   organiser or tourism-board page). Unverifiable: drop it, or keep it as a lead in your run notes; never
   publish it as fact. `disney_specific: true` marks Disney items (keep Disney terms marked).
3. Build per `docs/plan/trend-fast-lane.md` section 3 (what and where, when, family-of-4 cost or free, how to
   go, nearby alternatives, sources and checked date), with the usual reviews.
4. Delete the flag from `flags.json` in the same commit that ships the build, or in its own commit when you
   drop it. A deleted story only comes back if it escalates to `priority: "high"`.
5. For a `source_alerts` entry: check the feed by other means, then fix its `url` or add `"retry": 1` (or
   raise it) in `sources.json` and delete the alert. An unchanged blocked source is never fetched again.

## Scoring (tune in `CONFIG` in tools/trend-watch.mjs)
Gates: one of our cities (named in the text, or the outlet's own city), family or topic fit, published within
72 h, no blocker (private home or person, crime/accident/tragedy, politics, children as the subject,
adults-only, paywall). Points: city named 1, family 2, topic 2, novelty word 2, published within 24 h 1,
date / named place / price-or-free 1 each, and 2 per momentum signal (2+ outlets within 24 h on a similar
title or the same named place or event; 2+ GDELT articles; buzz words such as viral, TikTok, lines, sold
out). Flag at 7 or more; `priority: "high"` with 2+ momentum signals. A feed's first read is a baseline
and raises no flags.
