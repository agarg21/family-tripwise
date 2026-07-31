# San Diego Family Attraction Logistics Evidence

Checked: 2026-07-31

Action: `FT-AUTH-005` / `IMP-042`

Target: `https://familytripwise.com/things-to-do/san-diego-with-kids.html`

## Purpose And Boundaries

This register supports the compact logistics index on the existing San Diego all-ages activity page. It covers exactly the 12 choices already on that page and creates no new canonical or indexable URL.

Official venue, operator, or city pages are the primary evidence class. Their current published facts are high-confidence as of the checked date. Setting, time, cost band, weather role, and transport starting point are medium-confidence Family Tripwise planning estimates. They are not live conditions, exact route or wait-time guidance, safety findings, firsthand experience, or universal family-fit verdicts.

## Evidence Register

| Choice | Direct current source | Official facts used | Family Tripwise estimate | Known unknowns |
|---|---|---|---|---|
| San Diego Zoo | [Plan your visit](https://zoo.sandiegozoo.org/plan-your-visit) | Dated hours, directions, parking, transit, accessibility information, and map access | Mostly outdoor; 4-6 hours; high paid day; compare parking with listed transit | Crowds, queues, and exact family pace |
| Mission Bay beach morning | [City of San Diego Mission Bay](https://www.sandiego.gov/park-and-recreation/parks/regional/missionbay) | Park, shoreline, swimming-area, path, playground, restroom, shower, and lifeguard context | Outdoor beach and park; 2-3 hours; free or low cost; choose the exact stop before routing | Water conditions, parking fill, shade, and restroom availability |
| Balboa Park museums | [Plan your visit](https://balboapark.org/plan-your-visit/) | Public-park access, venue-specific hours and admissions, maps, transit, and parking | Mixed outdoor/indoor; 2-4 hours; costs vary; select a museum before treating it as weather backup | Chosen museum, exhibit fit, ticket rules, and parking |
| Birch Aquarium | [Plan your visit](https://aquarium.ucsd.edu/plan-your-visit) | Tickets, daily schedule, variable closing time, parking, and accessibility | Mostly indoor; 1.5-2 hours; mid paid; useful partial weather backup | Ticket inventory, parking capacity, and exhibit fit |
| La Jolla Cove | [City lifeguard beach page](https://www.sandiego.gov/lifeguards/beaches/cove) | Official beach description, amenities, and restrictions | Outdoor coast; 2-4 hours; free or low cost; choose the exact coast segment | Parking, crowds, water conditions, and walking conditions |
| Coronado ferry/waterfront | [Flagship ferry](https://www.flagshipsd.com/cruises/flagship-ferry) | Current terminals, schedules, ticket model, trip duration, and capacity context | Ferry plus outdoor waterfront; 2-3 hours; low to mid paid; choose both terminals before routing | Capacity, wait, return timing, and weather disruption |
| SeaWorld San Diego | [Park information](https://seaworld.com/san-diego/park-info/) | Dated hours, showtimes, map, accessibility information, and app links | Mixed outdoor/indoor; full day; high paid day; limited weather backup | Queues, showtimes, ride availability, and height splits |
| LEGOLAND California | [Opening hours](https://www.legoland.com/california/plan-your-visit/planning-tools/opening-hours/) | Dated operating hours, temporary availability language, and seasonal water-park context | Mostly outdoor; full day; high paid day; treat Carlsbad as its own day | Closures, waits, height splits, and water-park availability |
| San Diego Zoo Safari Park | [Plan your visit](https://sdzsafaripark.org/plan-your-visit) | Dated hours, Escondido location, parking, map, accessibility information, and grade context | Outdoor wildlife park; full day; high paid day; compare drive, parking, and grades | Heat, waits, optional-safari availability, and family pace |
| The New Children's Museum | [Visit](https://thinkplaycreate.org/visit/) | Current open days, hours, admission, calendar, and visitor information | Indoor; 2-3 hours; mid paid; strong weather backup | Open-day changes, events, crowds, and age fit |
| Fleet Science Center | [Hours and admission](https://www.fleetscience.org/hours-admission) | Current hours, admission, documentary inclusion, and accessibility-morning information | Indoor; 2-4 hours; mid paid; allow time to reach a timed film | Film schedule, crowds, and exhibit fit |
| Belmont Park | [Park hours](https://www.belmontpark.com/park-hours) | Dated operating hours and closure information | Mixed outdoor/indoor; 2-4 hours; cost varies with rides; set a ride or spending limit | Ride hours, height splits, parking, crowds, and total spend |

## Record And Rendering Contract

- `tools/page-generation/upgrade-page-data.mjs` is the canonical structured record source.
- The generated HTML table and embedded JSON are rendered from the same 12 objects.
- The browser creates the CSV only after the user activates the download button. There is no separate data URL or indexable asset page.
- Every record contains `name`, `area`, `setting`, `timeEstimate`, `costEstimate`, `currentCheck`, `weatherRole`, `transportPrompt`, `evidenceNote`, `unknowns`, `checked`, and `officialUrl`.
- Focused tests enforce record count, uniqueness, required fields, direct HTTPS sources, checked date, table/data/schema parity, and client-side download behavior.

## Indexability Audit

Fresh authenticated GSC evidence collected 2026-07-31, finalized through 2026-07-29, reports both the all-ages and teen San Diego activity URLs as unknown to Google. Public and repository checks on 2026-07-31 found no technical exclusion on either URL:

- both production URLs return `200`;
- both use a self-referencing canonical;
- neither has a `noindex` directive;
- each appears once in `site/sitemap.xml` and the public sitemap;
- both have internal links from the destination cluster and site navigation;
- `robots.txt` does not block them.

Conclusion: there is no verified technical indexing defect to repair. `FT-AUTH-005` improves the all-ages page's usefulness and citation value, but does not promise discovery or ranking. The teen page remains unchanged. Indexing requests are outside repository policy; observe later GSC crawl/indexing evidence and investigate only if a concrete exclusion or rendering defect appears.
