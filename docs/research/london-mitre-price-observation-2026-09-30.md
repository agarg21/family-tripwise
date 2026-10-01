# London Family-Price Observation Pilot

FT-RES-067 / LRN-074, observed September30,2026 Eastern. Separate BOOKING_CHECK JSON; original six-category pack remains unchanged. Research/tool delivery only, no London public page.

## Source And Limits

Read-only official [Mitre room page](https://www.mitrehousehotel.com/hotel-rooms) to Family Suite for5 public booking interface. Hypothetical two adults/children4,8,12, November8-13, five nights; engine classifies age11+ as adult, so3adults/children4,8. Displayed B&B stay samples: GBP1300 non-refundable plan and GBP1444 standard plan; equivalent GBP260 and288.80 per suite configuration/night. Standard card showed cancellation untilNovember6at11:00 local time. One connected suite configuration, not two separately priced rooms.

Tax/mandatory-fee inclusion was not established. Calendar figures remain explicitly two-adult orientation and are not these family prices. No final checkout, room Select/hold, booking, account, contact or payment. Opaque booking parameters, identities and source photos are not retained. Hotel policies URL could not be read by the web tool; no alternate-method retry or tax assurance. Preserve the unverified fee basis.

These two concurrent plans form a one-stay sample span, not a typical seasonal range, discount saving, cheapest-hotel verdict or confirmed future availability. Recheck within14days before calling them recent; older samples remain historical with original date and amounts.

## Reusable Workflow

```sh
node tools/family-room-task.mjs docs/research/london-room-configurations-2026-09-30.json 2026-09-30 docs/research/london-mitre-price-observation-2026-09-30.json
```

Third positional argument is explicit historical date; omit price path for unchanged unpriced baseline. Programmatic `screenRoomPack(pack, party, asOf, observations)` validates then joins only matching exact category, family/ages and stay. A different party or stay inherits no price. Provider age classification must reconcile; taxes unknown are never zero. Date/night/unit/source/amount/duplicate checks fail closed. Derived nightly averages are EDITORIAL_INTERPRETATION; displayed stay totals remain BOOKING_CHECK. No fetch, source-date renewal or silent model edit.

Family decision/hypothesis: can a generic two-adult calendar amount be used for this five-person budget? Rejected. A bounded public interface instead supplies a task-matched configuration sample, with fee/cancellation differences carried forward. Result IMPLEMENT separate validated observation/adapter; remaining five candidates still need price research. Confidence high in displayed samples/arithmetic/identity, low in final fees, future availability and seasonal representativeness. Proxy only, not a real user's booking or satisfaction.

Next falsification: rate/age/party/setup changes, complete fee breakdown, date-specific contradiction or matched quote for another candidate. Next eligible collection: Marlin sofa-inclusive scenario, then second-room offer conditions. London publication still needs broader maintained price/review/base/reset evidence, current overlap and fresh launch-scope approval. No existing site/window change.

Native focused/full QA, independent read-only PASS and exact-path tools/docs-only push required; no Pages deployment.
