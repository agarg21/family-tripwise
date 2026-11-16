# Snowcam accuracy check before publishing (owner D49, 2026-11-15)

Replaces the hand check in D47: the owner will not check reads by hand ("I trust you, I'll check the final
pages once in a while"). A resort's `publish` flag in the feed turns true only after a separate automated check
passes. This runs in the snowcam pipeline (agarg21/snowcam, the snow vision session), not in this repo.

## Early release (owner, 2026-11-16)
"Release pages today/tomorrow; if things look bad we adjust later." In force from snowcam 5c96b83:
- A resort publishes after 20 checks over 2+ days, showing only fields with 20+ checks at 90%+
  agreement, and only once a snow field (snow cover, fresh snow or stake) has passed. Fresh snow stays
  out after any false fresh-snow read.
- Checking continues at the full rate to 100 per resort after publishing. A published field stays
  while it holds 85%; the resort unpublishes when no snow field holds. After 100, the 10% spot checks
  below take over.
- Snow cover is compared and published in two grades (good / thin); busyness in three
  (quiet / normal / busy). The verdict and line are rebuilt from passed fields only.
The 100-read / 3-day sample below is now the full check that runs on after launch.

## The check
1. **Separate second read.** For each sampled read, a separate verifier (a different model or at least a
   different prompt and run, not shown the first read) looks at the same saved cam images and fills the same
   fields: fresh_snow, snow_cover, snowmaking, lifts_moving, base_busyness (quiet/normal/busy), visibility,
   falling_snow, stake_inches.
2. **Sample.** 100 daytime reads per resort, spread over at least 3 days and different weather (fog, snowfall,
   snowmaking, clear). Night and fully fogged frames don't count.
3. **Pass bar per resort.**
   - Each field that will be published agrees with the verifier in at least 90% of the sampled reads.
   - Zero cases where the pipeline reports fresh snow and the verifier sees none.
   - Snow stake: within 1 inch in at least 90% of reads, and never off by more than 2 inches.
   - A field that fails stays out of the feed (or under conf 0.6); the resort can still publish the fields
     that pass.
4. **Flip.** Set `publish: true` for that resort. Optionally add
   `"check": {"reads": 100, "agreement": 0.93, "at": "<ISO date>"}` to the resort in the feed so the page can
   later say how it was checked.

## Keeping it honest after launch
- Re-check a random 10% of daytime reads every day with the verifier.
- If agreement on any published field drops below 85% over the last 50 checked reads, or any false fresh-snow
  read appears, set `publish: false` for that resort automatically until it passes again.
- Keep the check logs in the snowcam repo; nothing from them goes on the site except the optional summary.

## What the site does (already built, QUEUE G19)
The deploy hands the latest feed read to each conditions page; `site/ski/cam-read.js` (generated from the same
functions as the build) shows it only when `publish` is true and the read is 6 hours old or less, drops fields
under conf 0.6, never uses safety, ice, grooming, open/closed, trail or people words, and marks reads older than
90 minutes. Unpublished resorts keep the "No read" card. Flipping `publish` needs no code change; the page picks
it up at the next deploy (a live in-browser fetch is OWNER O53).
