# Query opportunities: watch, not rewrite

FT-IMP-034; checked September 26, 2026. Decision: PRESERVE ranking-sensitive copy until coherent evidence qualifies an actual improvement.

## Evidence and limits

Fresh read-only protected export run `36269446726`, collected `2026-09-26T20:25:12.201Z`, uses August28-September24 (28 days), aligned to public snapshot `ops/gsc-snapshots/2026-09-26.json`. Finalization is conservative two-day lag, not a guarantee that Google will never revise data. Encrypted artifact downloaded and decrypted only outside the repository; no full rows, literal query list, identities or country/device data retained here.

305 returned page-query rows contain936 impressions and0 clicks. The public property summary has1,432 impressions and10 clicks. These are different aggregation/visibility surfaces; suppressed or otherwise omitted queries mean the export cannot identify those ten clicks or represent all demand. Zero visible query clicks does not mean no organic clicks. No API pagination cap was reached (25,000 configured); completeness still cannot be assumed.

## Bounded shortlist

Seven visible page-query rows fell between positions8 and20; together13 impressions. Only three clearly family-planning-specific signals belong on a watchlist. Generic destination or ambiguous conversational terms are excluded, not optimized for.

| Watchlist family (paraphrased) | Page | Near-winning signal | Broader aligned family check |
|---|---|---|---|
| San Antonio family stay-area selection | `/where-to-stay/san-antonio-with-kids.html` | Strongest but still tiny sample | 25 family/child-qualified San Antonio terms;55 impressions; weighted position58.62 |
| San Diego family stay-area selection | `/where-to-stay/san-diego-with-kids.html` | Tiny sample; not a stable cohort | 19 family/child-qualified San Diego terms;49 impressions; weighted position48.53 |
| Las Vegas family hotel selection | `/where-to-stay/las-vegas-family-hotels.html` | One-impression signal only | 20 family/child-qualified terms;107 impressions; weighted position63.86 |

Method: exact target page plus case-insensitive family/kid qualification; San Antonio/San Diego terms also include the destination. Position weighted by impressions, not an unweighted row average. These intentionally broad intent cohorts are a screen, not final title-experiment groups; hotel/resort/area subintent must be separated before an experiment. Selected 8-20 rows must not be cherry-picked as the whole ranking story.

None meets both sufficient finalized impressions and a coherent relevant cohort at position20 or better. The Las Vegas volume threshold alone is insufficient. No title, snippet or ranking-driven content change is authorized by this result. Do not infer that low-volume page averages for Chicago activities or San Antonio itineraries are near-winning query cohorts.

September26 URL Inspection reports all three watchlist pages indexed and fetchable. Last recorded crawls: San Antonio stay-area August25, San Diego stay-area September10, Las Vegas family hotels September4. Inspection collection is current, crawl dates are not newly refreshed; none is evidence that today's changes have been crawled. No inspection request was submitted.

Next trigger: repeat this protected export after28 finalized days or a material relevant-query change; inspect narrow query families, current crawl and live SERPs only when a candidate survives the evidence screen. A verified factual/usability defect remains independently actionable. This is not proof Google is testing the site or that contributor names caused growth.
