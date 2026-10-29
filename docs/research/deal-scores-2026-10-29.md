# Family Deal Check scores, 2026-10-29 (QUEUE G09 step 2, OWNER D15)

Scores live in `tools/page-generation/deal-checks.json` (`score` on each check) and are validated by
`validateDealScore()` in `tools/page-generation/deals-pages.mjs`. Not shown on pages yet (G09 step 4).

Rules:
- **Family value** is rated only from observed prices: a level other than `unknown` needs an observed
  `family_total` plus an observed regular price for the same party and dates (`family_value.compare`).
  No check has an observed family total today, so every family value is `unknown`.
- **Verdict** `worth_it` needs a rated family value of medium or high. Without observed family math a
  deal is at most `only_for` (with `who`), or `skip`. Only `worth_it` and `only_for` checks are queued
  for social (`shareable()` in `tools/social-queue.mjs`); a queued deal later scored `skip` fails
  `validateQueue` until its queue is regenerated.
- **Urgency** is derived on the day from `expires_on` (≤3 days high, ≤10 medium, else low; a listing
  date that is not a stated deadline is low), so it never goes stale in the record.
- **Novelty** records a quick web search (result titles only, 2026-10-29, operator domain excluded):
  `none_found`, `agency_listed` (travel-agency or coupon listings only) or `news_covered`, with the
  links seen. Links are third-party leads, not facts; nothing from them is published.

| Check | Appeal | Novelty (links in record) | Verdict |
|---|---|---|---|
| Royal Caribbean Kids Sail Free | broad | agency_listed (Avoya October deals blog) | only_for: kids 12 and under, 3+ nights, outside holiday/spring-break exclusions |
| Great Wolf Lodge fall flash sale | medium | none_found (results were the August USD 84 flash sale, a different offer) | only_for: families already planning a stay before Feb 11, 2027 |
| Beaches First Passport credit | narrow | news_covered (PR Newswire, Yahoo) | only_for: child 5 or under with a new passport, 5+ nights by Nov 6 |
| Club Med kids under 4 | narrow | none_found | only_for: all children under 4; footnoted conditions unreadable |
| SeaWorld Orlando 2027 Fun Card | medium | news_covered (FOX 35 Orlando) | only_for: repeat visitors through 2027 |
| Margaritaville at Sea Black Friday early access | medium | news_covered (Cruise Industry News, TravelPulse) | only_for: 3–4 in one stateroom on a select sailing |
| NCL Free 2nd Guest + free 3rd/4th | medium | agency_listed (Cruise Brothers) | only_for: 3–4 in one stateroom who price both offers |
| MSC 35% off + kids sail free | broad | agency_listed (Leaps and Bounds Travel) | only_for: kids 17 and under on a qualifying sailing |
| LEGOLAND California hotel package | medium | news_covered (Patch, USD 39 kids' tickets) | only_for: kids 2–12, non-refundable OK |
| Atlantis Fall Into Paradise | medium | news_covered (Caribbean Journal, TravelPulse) | only_for: 4+ nights outside blackouts, best with kids 5 and under |

No verdict changed what is queued: every current check is `only_for`, so committed social queues are unchanged.
The Patch LEGOLAND result title names USD 39 kids' tickets; whether it covers the hotel package or the
separate ticket-only offer was not read (title-level novelty only).
