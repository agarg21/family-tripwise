# Trend fast lane: catch what's new locally the day it breaks (owner 2026-11-03)

Owner direction: a weekly scan is too slow. When something new and family-relevant is published in one of our cities and could spread (a new light show, a street everyone is filming, a Thanksgiving first), we should have a verified, more complete version of it live and posted the same day. Our edge is not speed alone but the holistic check: real cost for a family of 4, when to go, what to book, stroller and crowds, and free alternatives nearby.

Scope: NYC, Chicago, San Diego, Orlando, San Antonio, DC (the G16 holiday cities); add others with their city pages. Built and run under QUEUE G16 (OWNER D32); posting under D12. Same evidence rules as everything else: a lead is never a fact.

## 1. Watch (hourly)
- **Workflow** `trend-watch.yml`, hourly at a quiet minute, no secrets, reusing `tools/deal-watch.mjs` mechanics (robots.txt and Crawl-delay honoured, each URL at most once per run, unchanged denials never retried, short extracted lines only, never raw bodies).
- **Sources** in `ops/trend-watch/sources.json`, per city, each verified by the operator before it is added:
  - local news feeds (RSS/Atom) of the main local TV stations, city papers and city guides;
  - tourism-board event pages or feeds (NYC Tourism, Choose Chicago, Visit San Diego, Visit Orlando, Visit San Antonio, Destination DC);
  - newsrooms of the big family venues (zoos, botanic gardens, theme parks), sharing entries with the deal watch where they overlap.
- **Google signals, every 6 hours** (DataForSEO under D8, capped at about $1 a week): a city-level results page for 3–4 seed searches per city ("christmas lights <city>", "things to do with kids this weekend <city>", "thanksgiving <city>"), keeping the titles of Top stories, short videos and discussion results; and rising related searches per metro once the Trends endpoint and its cost are confirmed.
- Instagram and TikTok are not scanned directly (logins required). Their viral posts reach us through news coverage ("went viral on TikTok") and Google's short-video and discussion results.

## 2. Score (code first, then the operator's judgement)
Each new item gets points; the code writes a flag to `ops/trend-watch/flags.json` at or above the threshold.
- **Fit**: one of our cities; family or kids relevance; topic (holiday lights, Thanksgiving, parade, zoo, free event, new attraction, opening, deal).
- **Novelty**: "new", "first", "opening", "returns", "announced", "this year"; published within 72 hours; not already on our pages.
- **Momentum** (raises priority): the same story in 2+ outlets within 24 hours; words like "viral", "TikTok", "lines", "sold out"; present in Google's Top stories or short videos for the city; a rising search.
- **Actionable**: a date, a place and public access; a price or "free".
- **Blockers** (never flagged): a private home or private person, crime, accident or tragedy, politics, children as the subject, paywall-only claims.
Flags carry city, title, outlet links, first-seen time, matched signals and score. High-momentum flags are marked `priority: high`.

## 3. Build the same day (operator)
- A `priority: high` trend flag pre-empts every queue item except live-site defects, the same way deal-watch flags do (QUEUE G09w).
- **Verify** on the primary source: the official, organiser or tourism-board page. Unverifiable means drop it, or hold it as a lead; never publish it as fact.
- **Trend check** content, from observed and dated facts only:
  - what it is and where (neighbourhood level for displays; never a private address);
  - when: dates, hours, the best time for small kids;
  - cost for a family of 4 (observed prices, labelled estimate when combined), or free;
  - how to go: timed tickets or book-ahead, parking or transit, stroller notes, crowd tips;
  - nearby or free alternatives in the same city;
  - sources and checked date.
- **Lands** as a "New this week" card at the top of that city's holiday page, on /this-week/, and as a same-day social post through the fast-lane slot (`node tools/social-queue.mjs <today> --fast`). Expiry is set from its end date.
- **Reviews**: integrity, persona and design as for any public change; run the three reviewers in parallel to keep it same-day. Each trend check is a small card in a template that has already passed design review.

## 4. Measure
Per trend: time from the outlet's publish to our flag, and from flag to live and posted; post reach and link clicks (Facebook insights); page impressions (Search Console). Weekly: flags raised, flags built, false positives. Tune the threshold from these.

## 5. Rollout
- v1 (first G16 run after the Black Friday page): news and tourism feeds for the six cities, scoring, flags, and the fast-lane step in the operator prompt via QUEUE G16.
- v2 (within the following week): Google signals every 6 hours.
- v3 (December): tune scoring from what was built and what spread.

## Guardrails
Link to and credit the original reporting; quote at most 15 words; never copy photos or video (use our cards, official media-kit images under D17, or credited free-licence photos); no AI images of real places; no private addresses, names or children's images.
