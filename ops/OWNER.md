# OWNER (decisions and owner-only tasks; keep ≤4 KB)
The operator acts only on rows marked Approved. New questions: yes/no, with a recommendation.

## Decisions (answered 2026-10-27)
- D1 Operating model — Approved: cloud-only scheduled task (hourly to 2026-10-30 10:00 ET, then every 4h), authorized until 2027-01-15 17:00 ET (extended by owner 2026-10-28); 1 transaction/run, no daily cap; headless Chromium is the QA tool; never the owner's Mac.
- D2 Repo simplification — Approved: Codex-era logs in archive/2026-10/; lean STATE/QUEUE/OWNER.
- D3 Orlando admission form — Approved and shipped (owner's local files on branch owner-local-2026-10-27).
- D4 Multi-page batches — Approved: staleness sweep, shared nav, Coronado link, self-hosted heroes, lodging readability. No new URLs or indexability changes.
- D5 Byline — keep Miles Rowan (disclosed AI contributor).
- D6 Breadth — not frozen; new destinations need a fresh Approved row.
- D7 Sources — Approved: official pages ≤1/URL/run and ≤1/week, honoring robots.txt; any public site may be read for research (owner 2026-10-28); no logins, forms or posting; never bypass robots, blocks or CAPTCHAs; third-party claims labelled and verified officially before publishing as fact.

- D8 Search data (DataForSEO) — Approved: request files via GitHub Actions secret DATAFORSEO_AUTH_B64; ≤USD 0.50/batch, ≤USD 20 cumulative (USD 0.36 used before Oct 27).
- D9 Nov 8-13 price-sample batch — Approved: re-observe later stays on 7 hotel pages + CSVs or remove amounts; live before Nov 8.

- D10 Pace (2026-10-28, owner) — Approved: growth-first. Most runs go to fresh deals/events/news, the new sections and social/newsletter content; site maintenance only for live-site defects and dated deadlines (Q17b).
- D11 New URLs (2026-10-28, owner) — Approved: /deals/ hub plus one page per Family Deal Check, and /this-week/ (dated family events and news per city). Added to sitemap and shared header; expired items drop automatically. No other new URLs, redirects or noindex without a fresh row.
- D12 Social and newsletter (2026-10-28, owner) — Approved: the operator drafts and queues posts and newsletter issues from verified items; a GitHub Action posts them, platform by platform, once the owner adds that platform's secret. Phase 0 (owner 2026-10-28): Bluesky (@familytripwise.com), Facebook Page, Instagram, Threads. Later, as their API approvals clear: Pinterest, YouTube, TikTok. Newsletter skipped for now. Single account email: hello@familytripwise.com (Porkbun forwarding to the owner's Gmail). About 5–6 posts/day across platforms in Nov–Dec, fewer off-season, never filler; no AI images of real places; no reposted promo art. Kill switch: change "Approved" here to "Paused" to stop all posting.

## Owner tasks (operator cannot do these)
- T1 (done 2026-10-27): GSC sitemap resubmitted; indexing requested for 5 unknown URLs.

- T2 (done 2026-10-28): owner filed a YouTube impersonation report on @FamilyTripwise (UCL8YHu5h_XiSTQhZJuCDmtA). Do not re-report; note channel changes in runs.
- T3 (open): create the social and newsletter accounts and developer apps, add the Bluesky DNS record, and store each token as a GitHub secret (names in QUEUE G04). Claude opens each signup page in Chrome; the owner signs up and handles passwords and tokens.

## Open questions
- O3 (2026-10-28) Approve two new pages, /privacy.html and /terms.html, which the Meta, TikTok and Pinterest developer apps require? Recommendation: yes.
- O2 (2026-10-28) Will you re-observe the robots-blocked Nov 8-13 hotel samples by hand (list: Q17b) for a Jan 10-15, 2027 stay and send values with screenshots by Nov 2? Recommendation: No; the operator removes them by Nov 7 and shows a dated budget gap.
