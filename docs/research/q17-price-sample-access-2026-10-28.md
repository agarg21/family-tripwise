# Q17 price-sample refresh: official booking-engine access check (2026-10-28)

Question: which of the November 8-13, 2026 price samples on the seven hotel pages can the cloud operator re-observe from an official booking engine, under the D7 source rules (robots.txt honoured, no bypassing of blocks, one fetch per URL per run and per week)?

Method: on 2026-10-28 the operator read each booking domain's robots.txt once (plain HTTP request) and, for two robots-permitted engines, loaded the existing stored booking URL once. No rate search was submitted, no login or bot check was attempted, and no third-party site was fetched.

## Deadline correction

`tools/content-freshness.mjs` (`findPastStaySamples`) treats a priced stay sample as past once its **arrival** date is today or earlier. Arrival is Sunday 2026-11-08, so the samples must be replaced or removed with the change live by **2026-11-07**, not "after November 13" as Q17 first said. Their "Older observation" labels keep QA green, but the AGENTS.md rule (no past-stay samples) applies from arrival.

## Access by property

| Page | Property (sample observed) | Official booking engine | robots.txt / access on 2026-10-28 | Operator can re-observe? |
|---|---|---|---|---|
| Boston | Hilton Boston Park Plaza (2026-10-01) | hilton.com | `Disallow: /book/`, `/search/`, `/find-hotels/` | No (robots) |
| Boston | Residence Inn Back Bay/Fenway (2026-10-03) | marriott.com | `Disallow: /reservation/availabilitySearch.mi`, `/aries-search/`, `/search/` | No (robots) |
| London | Marlin Queen Street, Marlin Limehouse (2026-10-02, 2026-10-03) | marlin.com | no booking disallow for `*`; engine not yet loaded | Candidate (untested) |
| London | Citadines Trafalgar Square (2026-10-02/03) | discoverasr.com | `Disallow: /*/booking`; AI agents named separately | No (robots) |
| NYC | Hotel Beacon two-bedroom suite (2026-10-11) | be.synxis.com | `Disallow: /` | No (robots) |
| NYC | Radio City Apartments (2026-10-11) | radiocityapartments.book.pegsbe.com | no disallow; page is a 3 KB JavaScript shell (needs headless browser) | Candidate |
| NYC | TRYP Times Square South (2026-10-11) | wyndhamhotels.com | `Disallow: /*reservation*/` and booking-date parameters | No (robots) |
| Orlando | Disney's Art of Animation (2026-10-11) | disneyworld.disney.go.com | `Disallow: /reservations/`, `/*/reservations/` | No (robots) |
| Orlando | Loews Cabana Bay (2026-10-11) | reservations.universalorlando.com/ibe | no disallow; server-rendered page with dates and rates (HTTP 200) | Candidate (best) |
| Orlando | Holiday Inn Resort Orlando Suites (2026-10-11) | ihg.com | robots.txt itself returns HTTP 403 to a plain client (bot protection) | No (do not bypass) |
| Puerto Vallarta | Garza Blanca Sanctuary (2026-10-09) | garzablancaresort.com | `Disallow: /booking/`, `/bookcore/` | No (robots) |
| San Diego | Homewood Suites Downtown/Bayside (2026-10-04) | hilton.com | as Hilton above | No (robots) |
| Washington DC | Embassy Suites Convention Center, Homewood Suites Downtown (2026-09-30) | hilton.com | as Hilton above | No (robots) |

Not affected: Dreams Bahia Mita (PV) already shows "No exact-family November 8-13 quote"; hyattinclusivecollection.com, hyatt.com and fourseasons.com also return 403 for robots.txt.

## Decision

- 4 properties (Cabana Bay, Radio City Apartments, Marlin Queen Street, Marlin Limehouse) may be re-observed by the operator: same party and room basis as the original sample, for the comparable Sunday-Friday five-night stay **2027-01-10 to 2027-01-15**, one load per URL. This is Q17a.
- 11 properties cannot be re-observed by the operator without breaking robots.txt or bot protection. Unless the owner supplies manual official observations (OWNER.md O2), their November 8-13 amounts, derived nightly equivalents, plan premiums and ranges come off the pages, CSVs and structured data, replaced by a visible budget gap ("no current official price observed; check the live rate for your party and dates"), live by 2026-11-07. Dated non-price facts stay. This is Q17b.
- A January sample is a different season from November; pages must say so and must not present it as a renewal of the November observation.
