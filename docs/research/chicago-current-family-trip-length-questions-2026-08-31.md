# Chicago Current Family Trip-Length Questions

Reviewed: 2026-08-31

Action: `FT-RES-024` / `SRR-045`

Evidence level: source-dated qualitative community evidence. This is not demand, user testing, behavior, satisfaction, rank, CTR, local expertise, or verified travel experience.

Target:

- https://familytripwise.com/family-itinerary/chicago-with-kids.html

## Decision

Reject the hypothesis that a numeric trip-length label is sufficient to route a Chicago family itinerary.

Across three child-family questions and one newer cross-generational pacing control, the stated trip length does not reveal the actual planning capacity. Families separately describe nights, weekday spans, arrival and departure windows, child or adult pace, transport, budget, and a distant or high-attention anchor. A useful answer must first convert that calendar description into usable sightseeing blocks, then assign one main zone or anchor to each block and state what to remove.

Retain and narrow unselected `IMP-047`. The smallest candidate is one conditional check inside the existing three-day quick pick and route: ask whether all three days are full sightseeing days. Keep the current soft-arrival shape for a partial first day; for three complete days, assign the central day plus two separate contrast zones. Add no section, fourth day, attraction, hotel, map, score, URL, or generic duration layer.

No page edit is selected in this research action. Any implementation requires separate selection, wording review, pre/post task scoring, independent review, and the normal release gate.

Independent read-only reviewer Kepler (`01a05723-5996-76a2-9822-e0b59538f1d3`) confirmed all four source dates and proportional paraphrases, the privacy and evidence boundaries, exact ten-path/no-site scope, GSC classification, and candidate proportionality. Cycle one returned `PASS` with no P0-P3.

## GSC Boundary

No August 31 snapshot was available at the 05:02 Eastern selection time. The newest evidence is the recent reused August 30 authenticated read-only API snapshot, finalized through August 28. It reports 2,050 property impressions, 4 clicks, aggregate average position 65.62, and 24 of 28 inspected URLs indexed. The Chicago itinerary has 40 impressions at page-average position 47.3, remains indexed, and was last crawled July 31.

The public snapshot has no aligned query cohort. It orients the review and preserves the measurement boundary; it does not establish query rank, CTR failure, demand, page-change eligibility, user behavior, or satisfaction. The prior `FT-RES-023` task result and the current-question pattern select this research.

## Discovery Method

- Surface: public Google results leading to public Reddit discussions; no account or private data used.
- Search date: 2026-08-31.
- Query: `site:reddit.com/r/AskChicago Chicago kids itinerary 3 days family`.
- Screen: first result page; retain three child-family questions that expose trip length or usable blocks, plus one 2026 cross-generational control with an explicit three-day label and pace constraint.
- Exclusions: results without a relevant trip-capacity decision, duplicate discussions, promotional pages, and any identity or copied thread text.

Only source date and URL, a paraphrased decision context, recurring constraints, and the work a useful answer must perform are retained below.

## Question Register

| ID | Source date and URL | Paraphrased decision context | Recurring constraints | Work a useful answer must perform |
|---|---|---|---|---|
| `CHI-Q1` | 2025-06-02; https://www.reddit.com/r/AskChicago/comments/1l15906/can_someone_please_help_with_an_itinerary_with/ | A family with a two-year-old describes 3.5 days and four nights, then asks for a base, transport mode, and a realistic short list. | Toddler pace, quieter base, restaurants, transit, car-seat/parking friction, first-trip anchors. | Translate the decimal duration into actual arrival/full/departure blocks before assigning one area or anchor per usable block. |
| `CHI-Q2` | 2025-05-12; https://www.reddit.com/r/AskChicago/comments/1kl04j9/any_suggestions_for_places_to_visit_for_family_of/ | A family with children ages two, five, and eight describes four Monday-through-Thursday days from a downtown base and mixes central attractions with one distant sports-related stop. | Mixed young ages, free options, downtown base, sports interest, a suburban detour, transfer burden. | Test whether the distant stop consumes a block, cluster the remaining choices by zone, and give one explicit removal rule. |
| `CHI-Q3` | 2025-05-28; https://www.reddit.com/r/AskChicago/comments/1kx7y9d/planning_a_kidfriendly_trip_to_chicago_next_month/ | A first large family trip with children ages two and five has a noon arrival and a 4 p.m. departure the next day, with several desired activities and a tight budget. | Two partial days, young-child pace, luggage, proximity, budget/free access, transport confidence, overpacking risk. | Treat arrival and departure as bounded partial blocks, protect slack, group nearby choices, and remove lower-value tours before the child-led anchors. |
| `CHI-Q4` | 2026-07-10; https://www.reddit.com/r/AskChicago/comments/1usm2pw/is_this_itinerary_good_for_a_family_of_3_with_two/ | A cross-generational family calls the trip three days and two nights, but arrives before noon after a long drive and departs before noon; only the middle day is fully open. | Partial arrival/departure, prior travel fatigue, older-adult pace, rest, long museum day, late optional activity. | Reconcile the three-day label with one full day plus two partial blocks and protect rest before judging the itinerary. This is a pacing control, not child-family evidence. |

## Falsification Result

Hypothesis: a numeric label such as `three days`, `3.5 days`, or `four days` is enough to choose an itinerary shape without separately interpreting usable blocks.

Result: rejected within this bounded sample.

- All four questions add information outside the day count that changes capacity.
- Three sources expose partial-day or nights-versus-days ambiguity; the fourth exposes a weekday span plus a distant transfer that can consume a block.
- Child age, pace, luggage, transport, budget, and required rest determine whether a nominal day can support a main anchor.
- The useful answer job is normalization before recommendation: calendar span to usable blocks, then one main zone or anchor per block, a reset, and a removal rule.

This does not show how common the pattern is or prove that users prefer a specific control. It does show that the prior three-full-day task gap is not merely an invented persona edge case.

## Candidate Boundary

`IMP-047` remains unselected but is now evidence-qualified for a separate implementation decision. Narrow it to the existing three-day choice:

1. Ask whether all three days are complete sightseeing days.
2. Keep the current soft-arrival option unchanged.
3. If all three are full, use one central day and two separate contrast zones, one main anchor per day.
4. Keep the existing reset, weather/budget swap, removal, and verification rules.

Do not add a duration calculator, another itinerary section, more attractions, another URL, or a universal statement about how families use `three days`.

## Reusable Lesson

Normalize trip capacity before choosing inventory. A calendar day, hotel night, travel day, and usable sightseeing block are different planning units. Community questions are useful for discovering this translation problem, but they do not measure its prevalence or validate the interface that solves it.

## Next Falsification

Reject or revise the candidate if an independent task reviewer can complete the three-full-day assignment without inference; if a current ranking-page sample shows that `three days in Chicago with kids` consistently includes arrival/departure and the current soft-arrival promise is the dominant search job; if a compact question displaces more useful trip-length evidence; or if later behavior or real-user evidence shows the distinction is missed or confusing.
