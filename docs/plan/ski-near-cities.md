# Skiing near cities with kids (owner 2026-11-09: yes; holiday calendar row 12)

User job: a parent in a big city wants a first or easy ski day with kids. Which hills are close, which
suit beginners and small kids, what it costs a family, how to get there without a car, and whether
the state has a free or cheap kids' pass. No page in our set does this, and the ranking pages
(OnTheSnow, Time Out, Secret NYC, Mommy Poppins) list hills with little or no family cost.

Demand (DataForSEO Q23, `docs/research/dataforseo-ski-with-kids-demand-c-2026-11-09.json`, US, 12-month
average / peak month): skiing or ski resorts near NYC 2,400 / 6,600 (Dec), Chicago 1,900 / 5,400,
Boston 1,600 / 4,400, DC 1,300 / 4,400, Las Vegas 1,300 / 2,900; "best ski resorts for families"
720 / 1,600. Kid-specific queries (ski lessons for kids, kids ski free, grade passports) returned no
volume, so they are sections inside the city pages, not pages. The receipt's SERP URLs came back as
unreadable google.com redirect links (provider change; fix before relying on SERP receipts); the
competitor list above is from a free web search on 2026-11-09.

URLs: `/ski/skiing-near-<city>-with-kids.html` (built 11-10; matches the searches "skiing near <city>") for New York City, Chicago, Boston, Washington DC, Las Vegas.
Order: NYC (by Nov 20), then the rest by Dec 5 (searches peak Dec–Jan). Each is a new URL for an
existing destination (AGENTS.md new-URL rule: distinct job, demand, maintainable evidence, no clean fit).

Each page, top to bottom (Content Standard; family of 4 = 2 adults + kids 5 and 8):
1. Glance: closest beginner-friendly hills, drive time where the hill states it, and a family-of-4
   cost estimate for a Saturday from published prices (11-10 change: lift tickets only where that is
   all a hill posts; add rentals and a lesson package once posted), observed date, "estimate", tax noted.
2. Table of 5–8 hills: drive time (stated basis), bus or train option, kid lift price (age bands as
   the hill states them), learn-to-ski or first-timer package, ski-school minimum age, childcare or
   daycare, snow tubing for under-5s, night skiing.
3. Free or cheap kids' passes for that state (official state ski association pages only), with the
   grade, what it covers, how to apply and the fee.
4. Getting there without a car (official bus or rail operators only).
5. Rainy or no-snow backup: snowmaking, indoor options, refund or weather policy as stated.
6. Sources and "how we check" last.

Evidence: official hill and state-association pages only for prices, ages and rules; prices are
date-dependent, so each figure keeps its date and basis; no snow-condition or safety claims; no
"best" verdict without a stated reason. Refresh weekly while the page is live; season dates and
prices drop off automatically when past. Social: one card or reel per page once live; deals only if
the spend-vs-save card saves at least 5%.

## NYC v2: first-lesson costs (owner research brief 2026-11-11, reconciled 11-11)

Source: `docs/research/nyc-kids-ski-research-2026-11-11.md`. Same URL; no new page (the brief's page is the live
`/ski/skiing-near-new-york-city-with-kids.html`, extended).

What changes
- Title/H1 lead with "Skiing near NYC with kids" and add "lift tickets and first-lesson prices" (targets "ski near nyc"
  / "ski resorts near nyc", 2.4k/mo, Dec ~14.8k). Answer box stays a family-of-4 estimate; add the cheapest
  first-lesson day per kid next to it (fixes the persona P3 "lift only, no full family-day cost").
- New "First ski lesson" table: hill, drive (labelled rough), youngest age, all-in first day per kid (lesson + lift +
  rental, before tax), season label, source. Add an anchor per hill (`#<hill>-lessons`) for "<mountain> ski lessons".
- Hills 7 → up to 14: add Campgaw (closest, ~45 min), Shawnee, Blue Mountain, Catamount (18 months with a parent),
  Ski Butternut ($75 1st-Timers), Jiminy Peak, Windham, Jack Frost. Only rows whose price is read on the official page
  get a figure; others say "check live" in one line.
- Mount Peter: replace "free beginner lessons (no details)" with the times and lift-ticket rule if the official page
  still says so.

Conflicts to settle on the official pages before publishing (the brief vs the live page)
1. SKI NY passport hills: the brief lists Mount Peter and Holiday Mountain, not Big SNOW or Mountain Creek; the live page
   lists Big SNOW and Mountain Creek (weekdays) and not Mount Peter. Re-read iskiny.com (not before 11-16).
2. Thunder Ridge "no car, Metro-North + weekend shuttle": the live page (official, 11-09) says the shuttle and package
   ended. Keep ours; drop the brief's "no car" pick unless the hill brings the shuttle back.
3. Hunter ages and prices: the brief (Snowthere, April 2026, third party) says group lessons 4–12 and lift free 6 and
   under; the live page (official) says child groups 7–14. Official page decides; no Snowthere figures on the page.
4. Camelback Kids Camp: the brief says a first-timer half-day for 4–14; the live page says it was for kids who already ski
   blue runs (last season). Re-read.
5. "Last season" rows (Mountain Creek camp $200, Thunder Ridge, Belleayre, Jack Frost) and "Ask" rows (Camelback,
   Windham) stay "check live" until the official page or a venue reply (OWNER D42) gives 2026–27 prices.

Timing and rules
- The research chat read these official pages on 11-11; weekly rule → re-read from 11-18 and build then (the December
  price refresh stays in the plan). Integrity, persona (guide bar) and design reviews as usual.
- Outreach (D42) to the hills with no 2026–27 price: Mountain Creek, Thunder Ridge, Belleayre, Camelback, Windham
  (Hunter and Jack Frost are Vail: online prices only, no email).
- Boston and DC: keep the 11-10 groundwork; the brief found no family-ski keyword data for them, so run a broader
  DataForSEO pull ("ski near boston", "ski resorts near dc", hill names) before building.
