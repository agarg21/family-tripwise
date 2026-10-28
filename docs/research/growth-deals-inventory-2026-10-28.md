# Family Travel Deals Inventory Sweep

- **Sweep date:** 2026-10-28 (US market)
- **Window tested:** new or live from 2026-10-14 to 10-28, plus offers already announced for Nov–Dec 2026 and spring break 2027.
- **Method:** WebSearch plus WebFetch of public pages only, with no logins, forms or posting. Operator pages were fetched once each. Deal aggregators (Slickdeals) and travel or news blogs were read after the owner widened scope mid-task. Third-party review sites (e.g. Tripadvisor) were **not** fetched, because `AGENTS.md` ("Never fetch third-party review sites automatically") forbids it and a relayed message is not an Approved owner row. They are also not a deal source.
- **Sample size:** about 45 searches and 45 page fetches. This is a sample, not a census: about 6–8 operator pages failed to fetch (Universal special-offers, Kalahari, LEGOLAND deals, Club Med offers index, Omni, a TravelPulse article, and themeparkinsider.com, which is blocked by robots).

## 1. Bottom line

- **Genuinely new, verifiable, family-specific deals are thin: about 0.5–1 per day on average** (about 4–7 per week). In the 15 days tested, about 8–10 such items appeared.
- Only **about 4** of those could be confirmed from start to finish on an operator's own page with dates and child terms (Royal Caribbean's T&C page did most of the work).
- If you count anything a family *could* use, including generic airline sales, single-route airfare drops, hotel-chain percent-off codes, and month-long local "kids free" programs, the count rises to **about 3–5 per day**. Most of those are not family-specific, and airfare route deals expire within hours.
- **Evergreen repeats dominate the live inventory.** Of 37 distinct live or recent offers recorded below, **about 65–70% are evergreen or re-labelled recurring offers** that were announced weeks or months earlier and are still live, or are standing programs. **About 30–35% were newly launched or newly observed in the window.**
- **5–6 deal posts per day is not supportable from genuinely new, verified family deals outside Black Friday.** It can only be reached by padding with:
  - deadline reminders for already-known deals ("ends Nov 2");
  - evergreen explainers;
  - generic airfare drops.
  The project's doctrine explicitly warns against that kind of padding.
- **Seasonal spike:** Black Friday / Cyber Monday (roughly Nov 1 – Dec 8) should lift genuine launches to about **2–5 per day for 2–4 weeks**. Evidence comes from the 2025 recurrence pattern of SeaWorld, Great Wolf, Club Med, Karisma, NCL, LEGOLAND and Margaritaville.
- **Smaller secondary pulses:**
  - Dec–Apr, when summer kids offers are announced: the Disneyland kids ticket offer was announced Dec 2025, and Disney Cruise Line (DCL) "Kids Sail 50% Off" was announced Apr 21, 2026.
  - Wave season (Jan–Mar) for cruises.

## 2. Deals table

**Legend**
- **V** = verified on the operator's official page on 2026-10-28.
- **V-partial** = the official page confirms the offer exists, but key terms (dates, ages) are missing there.
- **3P** = reported only by a third party (aggregator, blog or news); the official page was not reachable or not checked.
- **New?** values:
  - **NEW** = launched or first observed between Oct 14 and 28, 2026.
  - **RECENT** = Sep 15 – Oct 13.
  - **EVERGREEN** = a standing program, or announced months ago.
  - **EXPIRED** = booking already closed.

### 2a. Cruises

| # | Deal | Offered by | Source URL | Announced / observed | Booking window | Travel window | Family-critical terms | Verify | New? |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Kids Sail Free | Royal Caribbean | https://www.royalcaribbean.com/terms-and-conditions/promotions?country=USA | Promo start Oct 6, 2026; observed Oct 28 | Oct 6 – Nov 2, 2026 | Select 3+ night sailings departing on or after Oct 7, 2026 | Ages ≤12 on departure date, in the same stateroom as 2 full-fare guests. $0 cruise fare; taxes, fees and port expenses still charged. Excluded: Nov 19–27, 2026; Dec 17, 2026 – Jan 4, 2027; spring break 2027 dates; some Navigator sailings | V | RECENT, time-boxed |
| 2 | Free 3rd & 4th Guests | Royal Caribbean | same | Oct 6, 2026 | Oct 6 – Nov 2, 2026 | Oct 7, 2026 – Aug 20, 2027 | 3rd and 4th guests pay $0 fare plus taxes and fees. Same holiday and spring-break exclusions | V | RECENT, time-boxed |
| 3 | $750 Savings (two-day flash) | Royal Caribbean | same | Oct 27, 2026 | Oct 27–28, 2026 | Departing on or after Oct 27, 2026 | Per-stateroom instant savings by category and length. Not family-specific, but stacks with #1 and #2 | V | NEW |
| 4 | Flash Deals | Royal Caribbean | same | Oct 23, 2026 | Oct 23–27, 2026 | Listed sailings | Sailing-specific; not family-specific | V | NEW (expired) |
| 5 | $100 Short Getaway Kicker | Royal Caribbean | same | Oct 13, 2026 | Oct 13 – Nov 2, 2026 | Oct 14, 2026 – Apr 30, 2027, ≤5 nights | $25 for Interior/Oceanview/Balcony, $100 for Suite | V | NEW (edge of window) |
| 6 | Up to 35% off + Kids Sail Free | MSC Cruises | https://www.msccruisesusa.com/deals | Observed Oct 28 | "Offer ends November 2" (year not stated) | Not stated | Kids' ages, berth position and taxes not shown on the page. MSC's kids-free deal is a near-permanent rotating headline | V-partial | Evergreen headline with a rotating deadline |
| 7 | Black Friday early access: up to 65% off, 3rd/4th guests free on select sailings | Margaritaville at Sea | https://cruisefever.net/?p=61983 (dated Oct 14, 2026). The official press page fetched was the **2025** edition with an identical Oct 14 launch: https://www.margaritavilleatsea.com/pack-your-flip-flops-margaritaville-at-sea-launches-the-biggest-black-friday | Oct 14, 2026 | Oct 14 – Nov 3, 2026 | Not stated (2025 edition: through Oct 2027) | 3rd/4th guests free on select sailings; no age terms published | 3P (2026) | NEW, annual recurrence |
| 8 | 20% off + $250 onboard credit, Wish and Dream | Disney Cruise Line | https://disneycruise.disney.go.com/special-offers/ | Observed Oct 28 | Not stated | "Select sailings" | No child terms | V-partial | Unknown start |
| 9 | Kids Sail 50% Off (3rd–5th guests ≤17) | Disney Cruise Line | https://disneycruise.disney.go.com/special-offers/kids-discount/ | Announced Apr 21, 2026 | **Book by June 14, 2026** | Oct 1, 2026 – Mar 31, 2027 | Requires 2 full-fare guests; categories 04A–11C; no Concierge | V | **EXPIRED, but the page is still live**. This is a stale-page hazard |
| 10 | Florida residents up to 35% off; Canadian residents up to 25% | Disney Cruise Line | same | Observed | Not stated | Select | Residency-gated | V-partial | Evergreen |

### 2b. Theme parks, resorts and attractions

| # | Deal | Offered by | Source URL | Announced / observed | Booking window | Travel window | Family-critical terms | Verify | New? |
|---|---|---|---|---|---|---|---|---|---|
| 11 | Up to 20% off rooms, holiday season | Walt Disney World | https://disneyworld.disney.go.com/special-offers/ | Announced June 2026 (wdwnt, wdwinfo) | Not stated | Select nights Oct 4 – Dec 24, 2026 | Disney Resorts Collection rooms | V | EVERGREEN-ish |
| 12 | Disney+ Perks holiday package: up to 25% off rooms + free Park Hopper | Walt Disney World | same; https://disneyworld.disney.go.com/special-offers/2026-disney-plus-package-offer/ | June 24, 2026 | "Book now" | Sept 25 – Dec 24, 2026 | Disney+ Perks members; select 4-night/4-day packages | V | EVERGREEN-ish |
| 13 | Save up to $250 per night, 4-night 2027 room + ticket packages | Walt Disney World | same | Sept 10, 2026 (wdwmagic) | Not stated | Jan 3 – July 28, 2027 | 4-night/4-day packages only. Covers spring break 2027 | V | RECENT (6 weeks old) |
| 14 | Up to 25% off rooms, spring 2027 (also up to 30% for Disney Visa, up to 35% for Annual Passholders) | Walt Disney World | same | Observed Oct 28; announce date not confirmed | Not stated | Jan 3 – Apr 29, 2027 | Select rooms; three eligibility tiers | V | Likely RECENT. **A spring-break-relevant offer** |
| 15 | Free Dining Plan for kids ages 3–9 | Walt Disney World | same | Announced 2025 | Purchase through 2026 | Travel in 2026 | Needs a package with a Disney Resorts Collection room and a dining plan for everyone 10+ | V | EVERGREEN (year-long) |
| 16 | Water Park Seasonal Pass, $89 + tax | Walt Disney World | same | Observed | Not stated | Through May 15, 2027 | Blockouts Feb 19–21 and Mar 20–28, 2027 (spring break) | V | Evergreen-ish |
| 17 | Up to 20% off 3+ night stays at Disneyland Resort hotels | Disneyland Resort | https://disneyland.disney.go.com/offers-discounts/ | Observed | Through Dec 15, 2026 | Oct 11 – Dec 18, 2026 | 3+ nights | V | Evergreen-ish |
| 18 | Aulani winter 2027: up to 30% off for Magic Key and Annual Passholders; general public up to 25% off 5+ nights | Disney Aulani (Oahu) | https://disneyland.disney.go.com/offers-discounts/magic-key-holder-aulani-2027-winter-room-offer/ ; public version via https://slickdeals.net/f/20172102-oahu-aulani-resort-spa-up-to-25-off-stays-of-5-nights-for-winter-travel-book-by-march-27-2027 | About Oct 16–21, 2026 | Through Mar 27, 2027 | Jan 3 – Mar 31, 2027 | 5+ nights (smaller savings for 4) | V (passholder version) / 3P (public version) | NEW |
| 19 | Costco 2-day Disneyland Park Hopper + Lightning Lane + $60 dining card, $330/person | Costco Travel | Slickdeals theme-parks feed: https://slickdeals.net/deals/theme-parks-and-attractions | About Oct 27, 2026 | Not checked (membership-gated) | Not checked | Costco membership required; child price not seen | 3P | NEW |
| 20 | 3-Day Special Ticket (one day each at Epic Universe, Universal Studios Florida and Islands of Adventure), from $297 + tax | Universal Orlando | https://www.universalorlando.com/web/en/US/tickets-packages/offers/ticketoffer | Posted Sep 30, 2026 (Slickdeals) | Not stated | 7-day use window. Blockouts Dec 24, 2026 – Jan 3, 2027; Feb 11–19, 2027; Mar 26–30, 2027 (blockouts per Slickdeals) | No separate child price on the page | V (offer); 3P (blockouts) | RECENT |
| 21 | 2027 Fun Card: unlimited 2027 + rest of 2026 free, from $144.99 | SeaWorld Orlando | https://seaworld.com/orlando/tickets/ | Observed | Not stated | Through Dec 31, 2027 | Blockouts 12/22 and 12/24–26/2026 plus some 2027 dates; parking excluded | V | Annual recurring |
| 22 | Single-day ticket up to 60% off ($59.99); 2-park $53/day; 3-park $45/day (Florida parks) | SeaWorld Orlando / United Parks | same | Observed | Not stated | First visit within 6 months | US/PR/Canada residents only; non-refundable | V | EVERGREEN |
| 23 | Free Preschool Card (ages 5 and under) | SeaWorld and Busch Gardens (Florida) | same (link) | 2026 program | — | 2026 | Florida preschoolers | V-partial | EVERGREEN |
| 24 | Fall Flash Sale, up to 40% off | Great Wolf Lodge | https://www.greatwolf.com/deals | Observed Oct 28 | Not stated on index page | Not stated | Code and terms on the detail page only | V-partial | Likely NEW or rotating |
| 25 | WOLFWEEK one-day flash: suites from $35/person/night | Great Wolf Lodge | https://slickdeals.net/f/20163972-great-wolf-lodge-flash-sale-suites-from-35-per-person-per-night-through-february-14-2027-book-by-tonight | Oct 15, 2026 | Oct 15 only | Through Feb 14, 2027; blackout Nov 30 – Dec 4 | Price based on 2 guests; one guest must be 21+ | 3P | NEW (expired) |
| 26 | Scary Savings, up to $80 off per night | Great Wolf Lodge | https://slickdeals.net/f/20103492-great-wolf-lodge-scary-savings-sale-up-to-80-off-per-night-book-by-october-11-2026 | Oct 5, 2026 | Through Oct 11 | Oct 5, 2026 – Jan 28, 2027 | 2-guest basis; $20 per extra guest; one guest 21+ | 3P | RECENT (expired) |
| 27 | Early Saver 50% / Triple Fun 40% / More Fun 30% | Great Wolf Lodge | https://www.greatwolf.com/deals | — | 60+ days ahead, or within 60 days of arrival | — | Minimum 2–3 nights | V | EVERGREEN |
| 28 | Kids Go Free at San Diego Zoo and Safari Park | San Diego Zoo Wildlife Alliance via San Diego Tourism | https://www.sandiego.org/plan-your-trip/deals-offers/kids-go-free-at-san-diego-zoo/1135 | Annual (October) | — | Oct 1–31, 2026 | Ages ≤11; up to 6 kids per paid adult | V | Annual recurring; ends in 3 days |
| 29 | Kids Free San Diego, 70+ museums and attractions | San Diego Museum Council / San Diego Tourism | https://sandiegomuseumcouncil.org/specials/kidsfree | Annual | — | Oct 1–31, 2026 | Ages ≤12 with a paid adult; terms vary by venue | V | Annual recurring |

### 2c. All-inclusives and hotels

| # | Deal | Offered by | Source URL | Announced / observed | Booking window | Travel window | Family-critical terms | Verify | New? |
|---|---|---|---|---|---|---|---|---|---|
| 30 | 40% off Christmas & New Year | Club Med | https://www.clubmed.us/o/festive | Observed Oct 28 | **Book by Oct 27, 2026** | Sept 19, 2026 – Apr 30, 2027 | Under 4 free; ages 4–11 50% off; ages 12–15 20% off. Membership fee $30 per child. Columbus Isle 7-night minimum | V | Just EXPIRED. Club Med sales roll over roughly every 2–4 weeks |
| 31 | Winter Escapes Sale (up to $1,400 instant credit) + Tiny Traveler passport credit ($135 per child) | Beaches | https://www.beaches.com/specials/ | Observed | Not stated | Passport credit runs through Nov 6, 2026 | Passport credit: up to 2 kids ≤5, 5+ nights, new passport. **Beaches showed no "kids stay free" offer** | V | Evergreen and rotating |
| 32 | Kids Stay Free (ages 3–12) + Passport to Paradise | Hyatt Inclusive Collection (Dreams, Hyatt Ziva, Sunscape, Bahia Principe) | https://www.travelmarketreport.com/destinations/articles/hyatts-inclusive-collection-launches-fall-winter-kids-stay-free-offer ; https://thepointsguy.com/deals/hyatt-all-inclusive-kids-stay-free/ | Aug 5–6, 2026 | **Book by Sept 30, 2026** | Through Dec 20, 2026 | 3-night minimum at some resorts; occupancy caps. Slickdeals showed a newer Hyatt all-inclusive post (~Oct 25) with a kids-free mention; its current terms were not verified | 3P | EXPIRED, with a possible successor offer |

### 2d. Airlines and rail

| # | Deal | Offered by | Source URL | Announced / observed | Booking window | Travel window | Family-critical terms | Verify | New? |
|---|---|---|---|---|---|---|---|---|---|
| 33 | Up to 40% off base fares | Southwest | https://thepointsparty.com/articles/southwest-sale-up-to-40-percent-off-october-22 | Oct 19, 2026 | Oct 19–22, 2026 | Nov 9, 2026 – Mar 3, 2027 | Blackouts: Thanksgiving and Christmas, plus Nov 28–29 within the continental US. No child-specific terms | 3P | NEW (expired) |
| 34 | Peak Travel Season sale, from $59 one-way | Southwest | https://slickdeals.net/f/20145960-southwest-airlines-peak-travel-season-sale-from-59-one-way-airfares-book-by-october-14-2026 | Oct 12, 2026 | Through Oct 14 | Nov 2, 2026 – Mar 3, 2027 | 21-day advance purchase; holiday blackouts | 3P | RECENT (expired) |
| 35 | Airfare route drops (e.g. PHL–SJU $134, NYC–Aruba $295, Austin–Nassau $306) | Various airlines | https://slickdeals.net/deals/travel/ | 18 in the last ~7 days | Hours to days | Varies | Not family-specific | 3P | NEW, short-lived |
| 36 | Auto Train: kids 2–12 ride free with a paid adult (code C507) | Amtrak | https://slickdeals.net/f/19983669-amtrak-auto-train-kids-ages-2-12-ride-free-with-paid-adult-in-coach-or-first-class-book-by-october-6-2026 | Extended; posted Sep 7, 2026 | Through Oct 6, 2026 | Through Oct 11, 2026 | Lorton, VA to Sanford, FL only | 3P | EXPIRED. Amtrak's own deals page lists only evergreen discounts (child 50%, Kids 'n' Trains) |

### 2e. Public lands and museums

| # | Deal | Offered by | Source URL | Announced / observed | Booking window | Travel window | Family-critical terms | Verify | New? |
|---|---|---|---|---|---|---|---|---|---|
| 37 | Fee-free entrance day: Veterans Day (Nov 11, 2026). The Oct 27 date has just passed | National Park Service | https://www.nps.gov/planyourvisit/fee-free-parks.htm | Calendar published for 2026 | — | Nov 11, 2026 | **US citizens and residents only from 2026.** Timed-entry and reservation fees still apply. No 2027 dates posted yet | V | Scheduled and recurring |
| — | 4th Grade Pass (Every Kid Outdoors) | NPS / DOI | https://www.nps.gov/planyourvisit/fee-free-parks.htm ; https://www.nps.gov/portals/kids/every-kid-outdoors.htm | School-year program | — | Sept – Aug | US 4th graders and their vehicle party | V-partial | EVERGREEN |
| — | Bank of America Museums on Us (first full weekend monthly; next Nov 7–8, 2026) | Bank of America | Third-party calendar only: https://dullesmoms.com/event/museums-on-us-2026-fall/2026-11-07/ | Monthly | — | Nov 7–8, 2026 | Bank of America cardholders; 1 free admission per card | 3P | EVERGREEN monthly |

### 2f. Checked with nothing new found

- Royal Caribbean "Scary Good Deals" banner: this is a wrapper for #1–#5.
- NCL: the deals page shows only categories. The Black Friday "50% off + Free at Sea" item found is from 2025, not yet relaunched.
- Disneyland: no early-2027 kids ticket offer has been announced yet. Recurrence suggests one could come Oct–Dec; the 2024 version was announced Oct 22.
- Six Flags/Cedar Fair: 2027 passes launched Aug 7, 2026. This is a standing pass sale, and Black Friday tiers are likely in late Nov.
- LEGOLAND: the official Black Friday pages found are 2024/2025 editions.
- Kalahari: page fetch failed and no 2026 sale was found.
- CityPASS: no dated promotion.
- Karisma, Palace (Moon Palace) and Royalton: only third-party or older (2025) items were found, and no 2026 official kids-free offer was confirmed.
- Zoos: aside from San Diego, the "kids free in November" items found were older years (e.g. Jacksonville Zoo, a 2020 article).

## 3. Inventory estimate

### 3a. Rate, Oct 14–28, 2026

| Bar | Count in 15 days | Per day | Per week |
|---|---|---|---|
| New, family-specific, **operator-verified** with dates and child terms | about 4 (#1, #2, #18 passholder version, #14, plus #3, which is generic but stacks with #1–2) | **about 0.3** | about 2 |
| New, family-specific, verifiable (operator page **or** a reliable third party with dated terms) | about 8–10 (#3, #4, #5, #7, #18, #19, #24, #25, #33, plus Great Wolf and Club Med rotations) | **about 0.5–0.7** | about 4–5 |
| Anything a family could use, including generic airfare/hotel sales and route drops (Slickdeals travel feed: 33 travel items in ~7 days, 21 loosely family-relevant, 18 of them airfare routes) | about 45–75 | **about 3–5** | about 20–35 |
| Slickdeals "Theme Parks & Attractions" category (a crowd-sourced, US-wide feed) | 5 in 14 days | **about 0.35** | about 2.5 |

**Comparison with the 5–6 posts per day goal:**

- Under the strict bar, supply is about **0.5 per day versus 5–6 per day of demand**, a roughly 10× shortfall.
- Under the loose bar (including airfare drops), supply is about 3–5 per day. But those items are:
  - not family-specific;
  - often expired within hours;
  - already covered first by Slickdeals, The Points Guy (TPG), Going and similar.
  The site would therefore not be "first."

### 3b. What share is evergreen

- Of the 37 offers tabled, about **24–25 (65–70%)** are evergreen, standing, annual-recurring, or announced more than 4 weeks ago and still live.
- Most "deal" content an operator page shows on any given day is the *same* inventory as last week.
- The Disney offers pages carry 14 and 8 offers respectively. **None** of them was confirmed as launched in the 14-day window; the newest confirmed was Sep 10.

### 3c. Source types that produce the most genuinely new items

1. **Cruise lines.** Royal Caribbean posts new promo codes about weekly (Flash Deals, 2-day $750, kickers) with exact booking and sailing windows and kids terms on one T&C page. MSC and NCL rotate headline sales every 1–3 weeks. Cruise is the richest category by far.
2. **Disney's offer pages** (Walt Disney World, Disneyland, Aulani, Disney Cruise Line). There are about 1–3 genuinely new offers per month, but they are high-interest and well documented.
3. **Family resort brands with weekly rotations:** Great Wolf (flash sales about every 1–2 weeks), Club Med (a new "sale" about every 2–4 weeks) and Beaches/Sandals.
4. **Airline sales** (Southwest about every 1–2 weeks, plus JetBlue, Frontier and Alaska). They are frequent but not family-specific.
5. **Theme park ticket pages** (SeaWorld/United Parks, Universal, LEGOLAND, Six Flags). There are few launches outside Black Friday and the pass-launch seasons.

### 3d. Seasonality, from observed recurrence

- **Mid-Oct to early Nov: the "early Black Friday" run-up.**
  - Margaritaville launched on Oct 14 in both 2025 and 2026.
  - The SeaWorld Black Friday presale started Nov 3, 2025.
  - The Great Wolf early-Black-Friday sale ran with book-by dates of Nov 16 and Nov 23, 2025.
- **Black Friday / Cyber Monday (about Nov 20 – Dec 8): the peak.**
  - Expect nearly every operator above to post a dated offer.
  - 2025 examples: Club Med Cyber (book by Dec 1 and Dec 4), Karisma Cyber (book by Dec 8), NCL 50% off (ending Dec 8), LEGOLAND "Brick Friday", and SeaWorld up to 65% off.
  - Estimate: **about 2–5 genuine family-specific launches per day for 2–3 weeks**, then a sharp drop.
- **Dec–Feb: summer-kids announcements and cruise wave season.**
  - Disneyland announced its summer kids offer in Dec 2025.
  - The Disney World summer kids offer, DCL Kids 50% Off (Apr 2026) and the Royal Caribbean summer kids-sail-free offer are other examples.
  - Expect about 1–2 per day in January (wave season), lower otherwise.
- **Spring break 2027 booking (now through Feb).**
  - Many offers explicitly **black out** spring break: Royal Caribbean kids-free, Universal Mar 26–30, and the Disney water-park pass Mar 20–28.
  - Spring-break-valid offers found so far: Disney World spring room discounts (Jan 3 – Apr 29) and the $250/night 4-night packages, Club Med (through Apr 30), and Aulani (Jan 3 – Mar 31).
  - "Spring break deals" is therefore mostly a filter on existing inventory, not a stream of new deals.

### 3e. Verification and quality hazards found in this sample

These matter for an evidence-first brand.

- **Stale official pages stay live after their deadline.**
  - The DCL "Kids Sail 50% Off" page still presents the offer although its book-by date was June 14, 2026.
  - A LEGOLAND California "Black Friday package" page is the 2025 edition.
  - The Margaritaville official page that ranks first is the 2025 release.
- **Conflicting terms on official pages:** the Club Med flash-sale page gives two different book-by dates and two different travel windows. The Universal official page omits blockouts that Slickdeals reports.
- **Undated third-party roundups:** the AOL "Early Black Friday Disney & Universal" piece (via Get Away Today) carries no date and refers to "travel in early 2026", so it is almost certainly a 2025 article. Old zoo "kids free in November" articles (2020) also rank.
- **Missing child terms:** most official deal index pages (MSC, NCL, Disney Cruise Line, Great Wolf) do not show child ages, occupancy or fee basis without a detail page or booking flow.
- **Fetch reliability:** about 15% of operator URLs failed (Universal, Kalahari, LEGOLAND, Club Med index, Omni). A "be first" pipeline would need per-source handling, and some sources are effectively unreachable without a browser.

## 4. Implications for the growth pivot

These are the researcher's interpretation, not owner decisions.

- **Five to six verified family-deal posts per day cannot be met honestly from new inventory** except for about 2–3 weeks around Black Friday.
- **A credible cadence:**
  - **about 1 per day** off-season;
  - **3–5 per day** in the Black Friday window;
  - topped up with "deadline this week" reminders for still-valid verified deals. These are useful to families, but label them as reminders, not new deals.
- **"Being first" is hard.**
  - Slickdeals, TPG, The Points Party, Disney fan blogs (wdwinfo, wdwmagic, BlogMickey, Disney Tourist Blog) and cruise blogs (CruiseFever, TravelPulse) typically post within hours of launch.
  - A realistic edge is **better family terms**: child ages, occupancy, per-person vs per-room basis, taxes and port fees, and spring-break or holiday blackouts. Most sources omit these.
  - That fits the project's research-authority doctrine better than raw speed.
- **Governance:** social posting, accounts and any outreach are external actions that need an Approved row in `ops/OWNER.md`. Deal posts are time-sensitive by nature. The evidence-integrity rules require:
  - an observation date;
  - the exact booking and travel windows;
  - automatic expiry, so stale deals never stay published.
