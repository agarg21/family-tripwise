# Resort conditions pages (owner D47, D48; 2026-11-14)

One page per resort: "[Resort] conditions and webcams today". It answers, in 5 seconds, what the
slopes look like right now and whether it is worth driving up with the kids. Readers: NYC-area
parents deciding today or tomorrow. Demand: docs/research/dataforseo-ski-conditions-demand-2026-11-11.json
(about 55,000 US searches a month for "<resort> conditions / snow report / webcam" across 10
Northeast resorts, about 177,000 in December; most keyword difficulty 3-25).

## URLs (D48)

| URL | Cams read | Searches/mo (Dec) |
| --- | --- | --- |
| /ski/okemo-conditions.html (first) | stake, summit, Sugar House, Roundhouse | 6,090 (22,600) |
| /ski/mount-snow-conditions.html | stake, summit, Somerset, Carinthia, base | 5,600 (17,600) |
| /ski/hunter-mountain-conditions.html | base, midstation, Hunter East, summit | 4,170 (12,300) |
| /ski/windham-conditions.html | base | 1,060 (3,480) |
| /ski/killington-conditions.html | cams not added yet; build after they are | 18,100 (49,600) |

## Cam-read claims (D47)

Exception to the "no snow-condition claims" rule in docs/plan/ski-near-cities.md, for these pages only.

- Every read is labelled: "Read from N resort cams at 10:37am ET", plus a link to the resort's own
  cam page. No cam images on our pages, no embedded resort players.
- Allowed fields: fresh snow, snow cover, snowmaking running, lifts moving, base busyness (relative
  only: quiet / normal / busy), visibility, falling snow, snow-stake depth.
- Never: safe or unsafe, ice as a hazard, official open/closed status, groomed runs, trail counts.
  If the resort's site says closed, the page says closed and shows the cam read as context only.
- Freshness: a read older than 90 minutes shows as stale; older than 6 hours is hidden ("No recent read").
- Fields under 0.6 confidence are left out (the feed already drops them).
- Never count or describe individual people.

## Page order

1. Context line (resort, town, state, drive time from NYC from the existing city page) and headline.
2. Live cam read card: status chip from the feed's `label` (Looks good / Fair / Busy / Thin cover /
   Lifts not moving / No read; never "open" or "closed"), the one line, chips for the fields read (e.g. "Snow stake: 4.5 in."), the read time and
   cams used, a "Watch <resort>'s own cams" button.
3. Cam by cam: small table of each cam, what it shows, last read time or its no-read reason.
4. Plan the day with kids: official dated facts (hours, ticket and lesson prices with basis, lesson
   ages, tubing hours and ages).
5. Getting there from NYC (from the existing city page).
6. Low-snow backup: snowmaking, indoor options, the resort's stated weather/refund policy.
7. How we read the cams (method, limits, what we never claim) and sources last.

## Live data

Feed: `https://raw.githubusercontent.com/agarg21/snowcam-feed/main/conditions.json`, written every
30 minutes by the private snowcam pipeline (text only). Shape per resort:

```json
{"generated_at": "...", "resorts": {"okemo": {"publish": false, "name": "Okemo", "status": "No read",
  "label": "No read", "line": "...", "read_at": "...", "cams_used": 4, "cams_total": 4,
  "fields": {"fresh_snow": {"value": "light", "conf": 0.8}}, "stake_inches": 4.5,
  "cam_page": "https://...", "cams": [{"name": "Summit", "role": "summit", "read_at": "...", "no_read": null}]}}}
```

- Wired 2026-11-15 (QUEUE G19): the deploy (`tools/resort-feed.mjs`, after the tests) hands the latest
  feed read to the page in a `data-cam-read` attribute; the page script `site/ski/cam-read.js` (generated
  from the same functions as the build) draws it only while it is 6 hours old or less, and marks it older
  after 90 minutes. The HTML itself never shows a read, so no-JS readers, crawlers and link previews never
  see an old read as current. The script makes no network request (privacy page); reads therefore refresh
  with each deploy. A live in-browser fetch from the feed needs the privacy page to name the request first
  (OWNER O53). Feed keys and cam names map through `feed_key` and per-cam `feed_name` in
  resort-conditions.json.
- `publish: false` means the page shows "No read" and no condition claims. The snowcam owner flips
  it per resort after the accuracy check (about 100 daytime reads checked by hand, each published
  field at least 90% right, no false fresh-snow or stake readings).
- Release: D28 (integrity and design pass, every persona clarity at least 4, persona average at least 3.5).

## For the operator (how the pieces fit)

- The feed URL is the only interface. The snowcam pipeline lives in a separate private repo
  (agarg21/snowcam) run by the owner's session; never try to read, clone or change it, and never
  write to agarg21/snowcam-feed. If the feed is missing or malformed, the page shows "No read".
- Feed facts: refreshed about every 30 minutes in daylight (GitHub may skip runs); served as
  text/plain with open CORS; GitHub caches it up to 5 minutes. Times are UTC ISO; show them in ET.
- While a resort has `publish: false` (all of them at first), build and release the page with the
  live card showing the feed's `line` ("still being checked") and no condition claims. Do not wait
  for publish to flip; the owner session flips it per resort after the accuracy check, with no
  site change needed.
- To QA the published look, point the page at a local fixture copy of the feed with
  `publish: true` during Playwright runs only; never commit fixture readings as real data, and the
  reviewers judge layout from those screenshots, not the readings.
- Freshness is enforced on the page: hide a read older than 6 hours, mark one older than 90
  minutes as stale. The build-time copy in the HTML follows the same rule at render time.
- Static family facts (hours, prices, lessons, tubing) follow the normal evidence rules and are
  separate from the cam read; never mix the two in one sentence.
