# London Six-Person Category Corpus

FT-RES-096 / LRN-105. Collected October2 Eastern (October3 UTC). **CANDIDATE, not a London launch or six complete recommendations.** The schema1 JSON reuses the existing room-screen and CSV tools. No page, price observation or original source date changed.

## Decision

FT-RES-058's six records were mostly five-person configurations; row count did not establish six-person coverage. This pack retains079Queen Street/Limehouse unchanged and adds four published category/variant count records for two adults and children4,8,12,15, November8-13, five nights. Five screens require a sofa/variant condition; Citadines supplies a published six-person count without an added-sofa condition in the inspected description. None confirms exact-age acceptance, sleeping assignment, comfort or dependable rest.

Hypothesis **rejected**: six source-count records suffice for a suite-versus-connected-room decision. All six are apartments, five Marlin. No connected alternative is present; only two have comparable dated budget samples. Variant, kitchen, fee and rest gaps remain. Category-count coverage progresses, not the full corpus/information-gain/publication gate.

## Four Additional Official Bodies

All inspected October2; publication/effective dates unknown. `OFFICIAL_PROPERTY_FACT` means source wording, not personally tested conditions. Public session-free URLs are in JSON.

| Source | Distinction | Remaining check |
|---|---|---|
| [London Bridge Two Bedroom](https://www.marlin.com/london-serviced-apartments/london-bridge-empire-square/rooms/two-bedroom-apartment/) | Six requires a paid living-room double sofa. Two king bedrooms; twins in one on request; kitchen. | Exact sofa-specific rate/fee inclusion and rest. |
| [Canary Wharf options](https://www.marlin.com/london-serviced-apartments/canary-wharf-serviced-apartments/rooms/two-bedroom-apartment/) | Eight-person limit belongs to the named two-sofa Family Apartment variant, not standard/penthouse options. | Exact bookable variant identity, sofa sizes/fees. Standard-sofa numeric maximum unestablished here. |
| [Citadines Trafalgar 2-Bedroom](https://www.discoverasr.com/en/citadines/united-kingdom/citadines-trafalgar-square-london/2-bedroom-apartment) | Published six-person duplex: double, twins and living-room double sofa; kitchenette. | Internal access, sofa setup/fees, exact-age acceptance/rest. No stairs/accessibility verdict inferred. |
| [Aldgate category list](https://www.marlin.com/london-serviced-apartments/aldgate-tower-bridge-serviced-apartments/aldgate-tower-bridge-apartment-types/) | Standard Two Bedroom: six with added sofa. Family8/Penthouse6 wording stays separate; twins optional. | Exact-detail kitchen, sofa fee and reservation. |

Three Marlin bodies were directly opened with the web reader. Citadines' search result had category detail but the opened extraction omitted it, so that extraction was not accepted as category evidence. Normal anonymous in-app browser tab20 displayed the exact category description/features, maximum6, duplex, beds and kitchenette; then it was closed. No denial/settings change, booking/search form, account/contact/cart/purchase action. Ordinary rendering inspection, not security evasion. Aldgate's category-list section supports only the named standard category; missing kitchen/fees stay unknown.

Searches were source discovery, not controlled US SERPs, ranking or demand measurements. Unopened SACO leads, unrelated old Citadines school-price PDFs, member offers and adjacent categories were not promoted into records or prices. Source observations are operator-attributed, not independently live-confirmed by QA.

## Prices Stay Attached

Preserved078/079 booking observations: Queen Street **GBP406.98/night saver or452.20/night flexible**, five-night totals2034.90/2261.00; Limehouse **GBP308.70/night saver or343.00/night flexible**, totals1543.50/1715.00. Per-apartment averages for the original family/November8-13 stay, observedOctober2, including displayed VAT/fees, not seasonal ranges or final all-extra totals. Provider bands map age15 to an adult (3adults/3children); individual ages were not submitted. Sofa-specific categories, cancellations, meals/extras and refundable authorisation remain in the original JSON. No extra sofa fee or refundable hold added again.

Four new exact-task prices are uncollected, not zero. No starting, school, member or another property's rate transfers to them. Their JSON price fields stay null; the existing adapter joins only the two separately dated observation arrays. These missing budgets remain prioritized gaps, not completed pricing research.

```bash
node tools/family-room-task.mjs docs/research/london-six-person-corpus-2026-10-02.json 2026-10-02 docs/research/london-marlin-six-person-price-observation-2026-10-02.json docs/research/london-limehouse-six-person-price-observation-2026-10-02.json
node tools/family-room-comparison.mjs docs/research/london-six-person-corpus-2026-10-02.json --date 2026-10-02 --prices docs/research/london-marlin-six-person-price-observation-2026-10-02.json docs/research/london-limehouse-six-person-price-observation-2026-10-02.json
```

Original079category records/source objects match parsed data exactly: Queen category dateSeptember30, LimehouseOctober2. Assembly does not renew them. Limehouse size conflict/085review limits remain;082/089journey estimates are not transferred to new properties.

## Remaining Gate

Next077work: a named connected-room alternative or explicit category/budget/rest gap, not another general inventory. Resolve Canary bookable variant identity, Aldgate kitchen/sofa fees and comparison with a connected configuration. Controlled paired US SERP overlap/material demand/no existing-page fit, proxy information gain, maintainability, entrances/current fares/rest and new-destination/URL approval remain separate. FT-RES-083 history approval holds release.

Price recheckOctober16 or changed terms/party/category; adapter marks historical after14days without renewal. Independently dated category checks at30days: original Queen dueOctober30, four new sourcesNovember1. Confidence high narrow source/date/category distinctions and deterministic screens, low breadth/rest/acceptance/user/SEO. Falsify on changed rules, no added value from a connected comparison, or controlled SERPs assigning an existing owner. Native full/focused QA/different read-only PASS required; authoritative review/release state is in ops files, no production claim.
