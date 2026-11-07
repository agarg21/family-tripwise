# Social insights

Daily summary of our own posts' numbers from Zernio analytics (QUEUE G17, owner 2026-11-07).
Written by `.github/workflows/social-insights.yml` with `tools/social-insights.mjs`; one file per
posting month (`YYYY-MM.json`). Values are absolute, so each daily run replaces the last reading;
posts older than 35 days keep their final reading.

Public-safe: counts and watch metrics for our own posts only. No post text, account ids,
thumbnails, audience countries or audience types.

| Field | Meaning |
| --- | --- |
| views, reach, likes, comments, shares, saves, follows | as Meta reports them |
| link_clicks, profile_views | Instagram/Facebook business metrics, 0 when not reported |
| avg_watch_s | average watch time per play, seconds (Reels only) |
| skip_rate_pct | Instagram Reels: % of views that left within 3 s (Meta estimate) |
| still_watching_3s | Facebook Reels: share of plays still watching at 3 s |
| video_s | reel length in seconds |
| reel_photo, reel_music | which photo and track that reel used (from our receipt) |

How to use it: judge a reel change by skip rate and average watch time across at least five reels
of each version, not by one post. Reach on a new account is small and noisy.
