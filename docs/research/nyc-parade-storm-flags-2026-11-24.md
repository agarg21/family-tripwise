# NYC Thanksgiving storm trend flags: triage (2026-11-24 ET, ~20:10)

Trigger: trend flags t-73eeaa6110 and t-4b7e50bd45 (CBS New York videos: storm could affect the parade). Each URL read at most once.

| Source | Observed value | Change vs previous |
|---|---|---|
| NWS zone forecast NYZ072 (forecast.weather.gov) | Not read: fetch permission not granted (no retry) | Page keeps the Nov 22 update read Nov 23 (rain + wind Thu, 80%) |
| FOX 5 NY (third party, updated Nov 19, 2026) | No Thursday mph figures; 23 mph sustained / 34 mph gust balloon rule; banner showed a High Wind Watch Thu 4 a.m. to Fri 1 a.m. for coastal Monmouth/Ocean NJ (not NYC zones, undated) | Same article as Nov 23; banner new, lead only |
| ABC7 NY article 18209778 | 2025 forecast (published 2025-11-25): not used | n/a |

Decision: no page change. No official 2026 wind figure for Manhattan was readable, and the page's dated NWS line already says rain and wind Thursday and to check weather.gov the night before. Lead: if a High Wind Watch/Advisory is issued for NYC zones, update the windy bullet from the NWS page (next run may try forecast.weather.gov alerts once; zone URL not retried unchanged).
Other flags dropped as off-fit: SA pet adoption, SA store openings, Long Island Thanksgiving segment.
