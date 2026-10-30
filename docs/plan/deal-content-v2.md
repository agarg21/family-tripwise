# Deal content v2 (owner feedback, 2026-10-29)

Owner's verdict on the first Facebook post and the Beaches deal page: bland and unclear. Specifics:
- "In short: A USD 135 resort credit per child ages 5 and under with a newly issued passport…" does not tell a parent what the deal is.
- "How we check" sits at the top; it belongs at the bottom.
- "Family total on named dates: Not observed. Check live" should not be on the page at all.
- No reader (persona) review was done; only a technical/integrity review.
- Travel pages need good images.

Owner follow-up (same day): "Beaches gives you a $135 credit…" still fails, because a parent does not know what Beaches is. Pages must make sense to regular people with no context about the company: in one glance, where it is and what kind of trip, roughly what 3–4 days cost from a city like NYC, and how much they save. Later sections: kid/family things to do there, and pros and cons. These rules now live in AGENTS.md (Content Standard) and apply to every page and post, not only deals.

Example context line: "Beaches Resorts: all-inclusive family resorts in Jamaica and Turks & Caicos (Caribbean)", verified on beaches.com before use.

Evidence integrity rules are unchanged (AGENTS.md): verified facts only, no invented prices or totals, dated sources. v2 changes how we present and explain, not what we are allowed to claim.

## Page order (v2)
1. Hero visual. Until owner decision O4 on photos, a designed typographic/illustrated hero in brand colors (brand/README.md); never a fake or AI photo of a real place.
2. Plain-English headline: what a parent gets, in one sentence, with "$" not "USD". Example shape: "Beaches gives you a $135 credit for each child under 6 who has a new passport."
3. Verdict box: Worth it / Only for <who> / Skip, with a one-line reason, "Best for" and "Not for".
4. What you actually get: 3 bullets with numbers for a family of 4 (2 adults + 2 kids, ages stated), from observed terms only.
5. Is it a good deal? Context that makes the number meaningful, from verifiable public figures: the official regular price when published, fees the family pays anyway, how this compares with the same company's other offers, the last time we saw it. If no comparison can be verified, one line saying what to compare. Never pad.
6. The catch: the top 3 gotchas.
7. How to get it: steps, book-by and travel-by dates.
8. Full terms table (collapsible on mobile) and "unclear on the offer page".
9. Sources and "How we check" at the bottom. Drop the "Family total: not observed" section; show a total in section 4 only when observed.
Also: og:title, og:description, og:image (the card), og:url and twitter:card on every deal page, /deals/ and /this-week/ (was G10).

## Posts (v2: Facebook, Instagram, Threads)
- Line 1: the hook in plain words with the key number.
- Line 2: the verdict and who it is for.
- Line 3: the catch.
- Line 4: book-by date. Then the link (Facebook, Threads) or "link in bio" (Instagram).
- About 350 characters on Facebook/Threads; "$" not "USD"; no wall of terms.
- Card: the big number, the plain headline, a verdict chip and the brand mark; a photo background only after O4.

## Persona review gate (new, required)
For every new or changed public deal page, and every change to the post or card templates, a separate read-only subagent reviews the rendered page, post and card as three readers:
- a busy parent of two kids under 6 scrolling Facebook;
- a deal-savvy planner comparing options;
- a skeptical parent who distrusts "deals".
Each answers: what is this about after 5 seconds? Would I click or share it? What is confusing or missing? Each scores clarity, usefulness, trust and shareability from 1 to 5. Publish only when every persona gives clarity 4 or more and the overall average is 4 or more; otherwise fix and re-review (at most 3 cycles). Record the scores in the run notes. This is in addition to the existing integrity reviewer.

## Example of the analysis we want (verify before use)
A first US passport book for a child under 16 has cost $100 application + $35 acceptance fee = $135. If travel.state.gov confirms the current fees, the Beaches credit is roughly the cost of the passport itself: a plain comparison a parent understands at once. (Not yet verified: the fee pages refused the fetcher on 2026-10-29.)

## Images (owner D17, 2026-10-29: approved)
Options: (a) free-license stock (Unsplash/Pexels license) for mood images, credited; (b) official media-kit/press images where the company's terms allow editorial use, credited; (c) our own designed visuals only. Owner approved (a) and (b), credited and self-hosted; (c) remains welcome.

## Rollout
1. Build v2 for one deal (Beaches) on a branch; persona review; owner reviews the rendered page, card and post.
2. Roll v2 out to all live deal checks; regenerate current queues.
3. Owner sets OWNER.md D12 back to Approved; posting resumes.

## v3 (owner feedback on LEGOLAND, 2026-10-30)
Owner: "I can't figure out how much I'm spending with / without this deal. Is it $60 saved on $1,000?" The page also had long paragraphs; it should read like an infographic.

Required now (AGENTS.md Content Standard): a spend-vs-save card at the top, concise visual layout, and a persona gate that fails if a reader cannot state spend and save from the top of the page.

Worked example from figures already in our records (all observed; labelled rough comparison because dates and ticket types differ):
| | Per night, 2 adults + 2 kids |
|---|---|
| With the package (advertised "from $169 per person per night", 1 night, Park Hopper tickets + breakfast, before tax; read Oct 28–30) | from about $676 |
| Without: LEGOLAND Castle Hotel (Google Hotels, Dec 4–7, kids 5 and 8, read Oct 30; taxes unclear) | about $383 |
| plus four 1-day tickets "from $69" online (LEGOLAND help page, read Oct 30) | about $276 |
| Without, total (no breakfast) | about $659 |
Result: roughly the same price; the bundle adds breakfast, SEA LIFE and early entry rather than a discount. The "kids from $39" line saves at most about $30 per child per day against the $69 online ticket (about $60 a day for two kids on a ~$660 day, under 10%). Verdict shape: "Not a discount: a convenience bundle. Book it for breakfast and early entry, not to save money."
Build the card from these, show what each side includes, and keep every input's date and source in the details.
