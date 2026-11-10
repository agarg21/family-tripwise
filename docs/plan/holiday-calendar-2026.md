# Holiday calendar, Nov 2026 – Jan 2027 (owner 2026-11-09, QUEUE G16)

Purpose: capture each big family moment the day its details are announced, so items and posts are
ready before parents plan. Rows are work, not facts: every date, price and rule still comes from the
official page on the day it is read (AGENTS.md evidence integrity). "Reported" dates come from third
parties and must be confirmed officially before they appear on a page or post.

How the operator uses it: when no live defect, high trend flag or higher QUEUE item is due, take the
earliest open row whose **watch from** has passed. One row may take several runs (one item per run).
Mark a row `done` (with commit), `dropped` (with reason) or `waiting` (official details not out; next
read date) in the status column. The **capture by** date is a target, not a promise on the page.
New URLs (Thanksgiving, New Year's, city Christmas guides) still need the G16 SERP check first.

Calendar facts (fixed): Thanksgiving Thu Nov 26; Black Friday Nov 27; Cyber Monday Nov 30;
Hanukkah from sundown Fri Dec 4 to sundown Sat Dec 12 ([Farmers' Almanac](https://www.farmersalmanac.com/when-hanukkah), read 2026-11-09);
Christmas Fri Dec 25; New Year's Eve Thu Dec 31.

| # | Moment | Cities | What to capture | Date status (read 2026-11-09) | Watch from | Capture by | Status |
|---|---|---|---|---|---|---|---|
| 1 | Black Friday / Cyber Monday family travel deals | all | Price the unpriced list (spend-vs-save card; D22 ≥5% to promote); daily update of the BF page Nov 20 – Dec 1 | calendar | now | Nov 20 | open |
| 2 | Macy's Thanksgiving Day Parade (100th) | NYC | Family viewing item: public viewing areas, arrival time, transit, restrooms/strollers, balloon inflation if officially dated; card + reel | reported Nov 26, 8:30 a.m.–noon ([NYC for FREE](https://www.nycforfree.co/events/the-100th-macys-thanksgiving-day-parade), third party); Macy's page unreadable on Nov 3; macysinc.com Aug 18 release: TV from 8:30 a.m., no route/viewing details | now | Nov 18 | open |
| 3 | Other Thanksgiving parades and Thanksgiving weekend | Chicago, San Antonio (river parade item exists), others in our cities | Parade items from official organisers; "Thanksgiving weekend with kids" page only after a SERP check | check official | now | Nov 20 | open: Chicago organizer shows only 2025 (read 11-09); re-read from Nov 16 |
| 4 | Tree-lighting nights | NYC (Rockefeller), DC (item exists), Chicago, Boston (items exist), San Antonio, San Diego, Orlando | One item per city: date, free or ticketed, crowd and stroller rules, a calmer alternative for young kids | NYC reported Wed Dec 2 ([Time Out](https://www.timeout.com/newyork/news/the-2026-rockefeller-center-christmas-tree-lighting-has-officially-been-announced-and-its-happening-earlier-than-you-think-092926), third party); others check official | now | Nov 22 | open: SD Little Italy Dec 5 live 52154796 (11-09); NYC, DC, Boston, SA (Alamo), Orlando (Lake Eola) items exist; Chicago chicago.gov tree pages failed 11-09 (no retry; Choose Chicago source stays) |
| 5 | Santa visits and Santa meals | NYC, Orlando, DC, Chicago (breakfast item exists), San Diego, San Antonio, Boston | Booking opens/price per child, photo packages, sensory-friendly sessions; book-by dates | check official | now | Nov 20 | open: SA Bass Pro Santa's Wonderland live 53cc535b, Orlando d3fd3410, DC (Hanover, MD store) 8d75ac62 (11-09); Alamo Cowboy Santa exists; Chicago Bolingbrook f9582659 (11-10); NYC Hudson Yards free Santa photos (11-10); NYC Macy's Santaland (free reservations from Nov 20; release only, macys.com unread) (11-10); Brookfield Place santa page still 2025 dates (re-read from Nov 17); next San Diego, Boston |
| 6 | Nutcracker and family holiday shows | NYC, Chicago, Boston, DC, San Diego, Orlando | Shortest/kid-friendly performances, age guidance, cheapest observed family-of-4 seats with date basis | check official | now | Nov 22 | open: NYC Ballet Nutcracker live ae7db94c, DC Washington Ballet live 9c136ece (11-09; no prices read); SD Golden State Ballet (sensory matinees; no prices posted) 11-09; joffrey.org pages failed 11-09 (no retry); leads for other NYC shows in the NYC Tourism 2026 release |
| 7 | Holiday lights in thin cities | Las Vegas (0 events), San Diego (1), London (2), Boston (3) | Bring each to at least 5 verified holiday items; consider city Christmas guides after a SERP check | check official | now | Nov 25 | open |
| 8 | Hanukkah family events | NYC, DC, Chicago, Boston, others | Public menorah lightings and children's museum events with dates and cost | calendar Dec 4–12; events check official | Nov 16 | Nov 30 | open |
| 9 | Christmas week and winter break | NYC, Orlando, DC, Chicago | What is open Dec 24–25 and closed (museums, zoos, transit), theme-park crowd and hours notes, rainy/cold-day backups | check official | Dec 1 | Dec 15 | open |
| 10 | Family New Year's Eve | NYC, Chicago, Boston, DC, Orlando, San Diego | "Noon Year's Eve" countdowns, early fireworks, ticket prices; "New Year's Eve with kids" page only after a SERP check | check official | Nov 23 | Dec 12 | open |
| 11 | Winter break deals (after Christmas to MLK weekend) | all | Deal-watch pages for Dec 26 – Jan 18 travel; spend-vs-save cards | check official | Dec 1 | Dec 10 | open |
| 12 | Skiing near cities with kids (owner 11-09, yes) | NYC first, then Chicago, Boston, DC, Las Vegas | One new page per city, spec in docs/plan/ski-near-cities.md; demand and SERP check done (Q23) | check official | now | NYC Nov 20; rest Dec 5 | open |

Social: each captured item goes through the normal queue (G03/G04 caps, real deals only). Reels pick
holiday items first; a held reel (no price) still posts its image card.
