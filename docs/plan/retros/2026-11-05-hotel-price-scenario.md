# Retro: hotel prices priced a trip families don't take (2026-11-05)

Owner review of /where-to-stay/new-york-city-family-hotels.html found: (1) the headline price is "Family of 4, one
Tuesday, Jan 19, 2027"; (2) the hero says "room for 5" while the prices are for a family of 4; (3) no holiday-season
prices with the holidays weeks away; (4) "Hotel facts checked: July 25, 2026" on a page re-priced Nov 2.

## What happened (timeline)

- Jul 20–26: hotel pages built with two-adult July samples; hotel facts read then.
- Oct 30–31 (Q17b): Google Hotels via DataForSEO. Multi-night searches returned a figure whose unit (per night or per
  stay) could not be proven: the Fri Jan 15 and Mon Jan 18 one-night controls failed the 10% rule
  (docs/research/q17b-midweek-hotel-prices-2026-10-31.md). Lesson recorded: a 1-night search is per night by
  construction.
- Oct 31 (D25) and Nov 1 (D26): owner asked to drop past-stay July samples and show "fresh future-date family prices".
  No dates were specified.
- Nov 1–2 (Q18, Q19): the operator picked one 1-night date for all cities, Tue Jan 19, 2027 (the night after MLK Day),
  adding Feb 2 / Feb 23 where single dates swung. All three reviews passed; the pages shipped.

## Root causes

1. **The sample was chosen to be provable, not to be representative.** The real constraint was a per-night unit that
   could be proven, and a single quiet weeknight is the easiest thing to prove and compare across cities. Nothing asked
   "is this a trip a family would book?". We optimised a proxy (clean evidence) and lost the user's question
   ("what will our weekend cost?").
2. **No written default for the price scenario.** AGENTS.md says what a price must carry (currency, unit, party, dates,
   observation date) but not which trip to price. Owner decisions D25/D26 said "fresh future dates", and the operator
   filled the gap with its own choice without surfacing it. The same gap produced inconsistent parties across pages
   (4, 5 or 6 people) and samples on Mon Jan 18 (MLK Day itself) and over the MLK long weekend (NYC family of 5,
   Jan 15–20).
3. **Reviews check what is shown, not whether it is the right example.** Integrity checks provenance and labels;
   persona and design check clarity and look. A clearly labelled Tuesday passes all three. No reviewer is asked "would
   this persona travel on these dates, with this party?".
4. **Fact freshness has no clock.** The rules forbid passed stay dates and stale price samples, but nothing makes facts
   older than N days get re-read when a page is re-priced. "Facts checked" stayed at July on 8 pages while their prices
   moved to November. G13 had flagged 26 July/August pages; growth-first (D10) kept it behind new content.
5. **Hero copy drifted from the basis.** The NYC hero lists filters ("room for 5") written before the price block was
   rebuilt for a family of 4; no check ties the hero's party to the price basis.

## Protocol changes (owner D39)

- docs/plan/hotel-price-samples.md is now the protocol: default party family of 4 (2 adults + kids 5 and 8) unless the
  page is about larger families and says so up top; a normal Fri–Sun weekend (two 1-night searches, Fri and Sat,
  averaged: provable and realistic); the next peak holiday while near; never a lone weeknight, a holiday date or a long
  weekend as the "normal" price.
- AGENTS.md: price samples model the trip families actually take; when an owner request leaves a user-facing
  assumption open (dates, party, gateway), use the written default or ask, and record the choice in the queue item.
- Persona review adds a realism question: "Is this the trip I would take (dates, nights, party)?" A "no" caps
  usefulness at 3.
- Freshness: when a page is re-priced or redesigned, any visible "facts checked" date older than 90 days is re-read in
  the same release (or the release says which facts are older).

## Sweep (QUEUE G18)

Audit 2026-11-05 of site/where-to-stay:
- Lone weeknight or holiday samples: NYC, Chicago, Las Vegas, San Antonio, San Diego (Tue Jan 19); London, Orlando
  (Mon Jan 18, MLK Day); Cancun (Mon Jan 11); NYC family of 5 (Fri Jan 15 / Mon Jan 18, MLK weekend).
- Facts checked in July/August: NYC (Jul 25), NYC area (Jul 26), Chicago and area (Jul 23), Las Vegas and area (Jul
  22), San Antonio and area (Jul 26), San Diego (Aug 17), San Diego area (Jul 20).
- Party in the hero vs the price basis: NYC ("room for 5" vs family of 4); others consistent within the page.
