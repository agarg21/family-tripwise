# London Budget Task: Three Dated Samples

FT-RES-069 / LRN-076. Sources inspected September30,2026 Eastern. BOOKING_CHECK and source-interface limitation evidence; named task is two adults/children4,8,12, November8-13five nights. Not a public London launch, seasonal comparison, final quote or real-user test.

## Third Source And Result

Follow the [official Guv'nor's Suite BOOK route](https://montaguehotel.com/suites/the-guvnors-suite), set one room/two adults/three children with individual4,8,12ages, then November8-13. Engine labels adults18+ and children0-17; the returned suite filter and category match. Initial route dates defaulted to another stay, so that result was discarded; no initial/sister-hotel price enters the observation.

| Public suite plan | Displayed five-night total GBP | Nightly equivalent GBP | Included / conditions |
|---|---:|---:|---|
| Daily Rate | 7,600 | 1,520 | Room only, WiFi/VAT |
| Daily Rate with Breakfast | 7,900 | 1,580 | Full English breakfast daily, WiFi/VAT |

Both details say taxes/fees included, show the five-night total, and require15%nonrefundable deposit at reservation. Cancellation forfeits that deposit; within7days remaining balance required. Do not add15%to the stay total as an extra fee. Exact requested sofa/extra-bed setup and charge remain unresolved; a five-person result does not convert conditional capacity into a guaranteed fifth bed. Booking summary bedding is incomplete, so the original source-record beds remain separate. No contact, cart, BookNow/Select, account, payment or reservation.

## One Reusable Task, Separate Observations

CLI now accepts multiple price JSON files after the category path and explicit as-of date. Each must be an array; combined observations retain category/party/stay/age/eligibility/source identity validation and reject duplicates. Do not merge/retype prices into the original facts.

```bash
node tools/family-room-task.mjs docs/research/london-room-configurations-2026-09-30.json 2026-09-30 docs/research/london-mitre-price-observation-2026-09-30.json docs/research/london-marlin-price-observation-2026-09-30.json docs/research/london-montague-price-observation-2026-09-30.json
```

Output keeps all six original capacity screens and three separately dated sample sets:

- Mitre:260-288.80GBP/night-equivalent, breakfast; provider12year-old adult, taxes/fees unresolved; one connected suite.
- Marlin:396.18-440.20GBP/night-equivalent, public sofa-category plans, displayed VAT/fees; child0-12count-only input, meals/final hold unresolved.
- Montague:1,520-1,580GBP/night-equivalent, room-only versus breakfast; individual ages entered, requested sofa and deposit/cancellation conditions.

These are different configurations, inclusions and cancellation terms, not interchangeable quotes or a cheapest/best-hotel ranking. No numeric gap is filled with an estimate.

## Remaining Gates, Kept Narrow

The [Mandarin Family Room page](https://www.mandarinoriental.com/en/london/hyde-park/stay/mandarin-family-room) still states connecting rooms with rollaway up to5. Its category-specific Book control opened a date surface that retained “Loading dates,” disabled dates, and a zero-night/zero-price placeholder. After reading the loaded state again, the requested November8 control remained disabled with loading labels. No party search or usable price could be submitted. This is unresolved interface loading, not proof of sold-out rooms or a zero price. No security warning/denial was bypassed, no guessed API used, no alternate browser or repeated date grid. Owner: official booking interface; unblock when the same public category date controls finish loading. Check once at the next separately eligible pricing run or after a source-interface change.

Bloomsbury's published five-person extension is under2/cot-only and fails this older-child task; do not spend a rate check on an ineligible configuration. Kensington's suite-plus-Cosy arrangement, age/rollaway-fee conflict and detached555GBPoffer are still unresolved in the original source record; its direct telephone arrangement is not authority to contact or manufacture a combined-category quote. Different tasks need separate observations.

Decision IMPLEMENT third sample/multi-file normalization; CANDIDATE London comparison remains gated by broader review/location/rest evidence, current query/SERP overlap and specific new-destination publication approval. Budget task is PARTIAL, not finished across all candidates. Hypothesis rejected: a five-person displayed price settles the full sleeping/cancellation/budget decision. Confidence high in rate/party arithmetic, medium in source-task usefulness, low in remaining fee/setup and comparative outcomes. Reusable lesson: keep configuration availability and payment timing distinct from displayed stay cost. Next falsification: exact setup/charge change, policy cancellation change, another task/quote, functioning Mandarin surface or stronger competing task answer.

All public/model/Mitre/Marlin/category/history bytes and31URLs/windows unchanged. Focused/full native QA and different independent read-only review before tools/docs-only push; no Pages wait.
