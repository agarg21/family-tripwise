// Washington DC itinerary with kids (Q15). Every venue fact below was read on the official page
// named in `source` on `checkedOn`; see docs/research/washington-dc-itinerary-facts-2026-10-27.md.
// Rest blocks and day shapes are Family Tripwise planning estimates, not route or timing claims.
import { contributorCredit } from "./contributors.mjs";
import { siteHeader, siteEnd } from "./site-chrome.mjs";
import { ageState } from "../evidence-audit.mjs";
import { withLinkPreview } from "./link-previews.mjs";
import { heroPhotoSection } from "./hero-photos.mjs";

export const dcItineraryPath = "family-itinerary/washington-dc-with-kids.html";
export const dcItineraryCheckedOn = "2026-10-27";
const checkedLabel = "October 27, 2026";

const e = (value) => String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");

export const dcVenues = [
  {
    id: "natural-history",
    name: "National Museum of Natural History",
    source: "https://naturalhistory.si.edu/visit",
    hours: "10:00 a.m.–5:30 p.m. daily, including holidays; closed Christmas Day.",
    entry: "Free. No tickets or passes needed.",
    rules: [
      "Bagged lunches must stay stowed and be eaten outside; no lunch seating or refrigerated storage.",
      "Cafés: Ocean Terrace 11 a.m.–3 p.m.; Atrium 11 a.m.–5 p.m. with limited choices after 3 p.m.",
      "Security screening for everyone; no coat check, bag storage or lockers.",
      "Strollers and small pushed wagons are permitted."
    ]
  },
  {
    id: "air-and-space",
    name: "National Air and Space Museum (National Mall)",
    source: "https://airandspace.si.edu/visit/museum-dc",
    hours: "10:00 a.m.–5:30 p.m. daily; closed Christmas Day.",
    entry: "Free, but a free timed-entry pass is required for every visitor, regardless of age.",
    rules: [
      "One reservation covers up to nine passes; the pass does not limit how long you stay.",
      "Enter on Jefferson Drive SW.",
      "A large east-end section is closed for renovation and some galleries are still being built, so not every gallery is open.",
      "The museum page does not say how far ahead passes are released; check it before the trip."
    ]
  },
  {
    id: "american-history",
    name: "National Museum of American History",
    source: "https://americanhistory.si.edu/visit",
    extraSource: ["https://americanhistory.si.edu/explore/exhibitions/wonderplace", "Wegmans Wonderplace page"],
    hours: "10:00 a.m.–5:30 p.m. daily except Christmas Day.",
    entry: "Free. No tickets required.",
    rules: [
      "Wegmans Wonderplace is designed for children 0 to 6.",
      "Wonderplace is open Wednesday–Sunday, 10 a.m.–4 p.m., and closed Monday and Tuesday; the museum says hours are subject to change."
    ]
  },
  {
    id: "zoo",
    name: "Smithsonian's National Zoo",
    source: "https://nationalzoo.si.edu/visit/hours",
    extraSource: ["https://nationalzoo.si.edu/visit/faqs", "Zoo visitor FAQs"],
    hours: "Open every day except Christmas Day. Sept. 15–March 14: grounds 8 a.m.–4 p.m. (last entry 3 p.m.), indoor exhibits 9 a.m.–4 p.m. March 15–Sept. 14: grounds 8 a.m.–6 p.m. (last entry 5 p.m.), indoor exhibits 9 a.m.–6 p.m.",
    entry: "Free, but every visitor of every age needs their own free entry pass; a limited number of walk-up passes are offered at pedestrian entrances.",
    rules: [
      "Parking: USD 30 per vehicle bought at least a day ahead, USD 40 on the day; it may sell out.",
      "The Zoo says it sits on a hill with an incline and suggests 2–3 hours; its guest shuttle was listed as not available.",
      "Stroller rental for a fee (no cash). Your own food and non-alcoholic drinks are allowed."
    ]
  },
  {
    id: "monument",
    name: "Washington Monument",
    source: "https://www.nps.gov/wamo/planyourvisit/fees.htm",
    hours: "The NPS fees page does not list hours. It lists one maintenance closure day most months plus holiday closures; check its list for your date.",
    entry: "Every guest age 2 and up needs a timed ticket. Free same-day tickets from 8:45 a.m. at the Washington Monument Lodge, first come, first served (up to six per person aged 16+). Advance tickets on recreation.gov open 30 days ahead at 10 a.m., with a non-refundable USD 1.00 service charge per ticket.",
    rules: [
      "The monument may close for high wind or thunderstorms, and tickets for those entry times are voided.",
      "More advance tickets are released one day before the visit date."
    ]
  }
];

export const dcMetro = {
  source: "https://www.wmata.com/pay.html",
  facts: [
    "Up to two children age 4 and younger ride free with each fare-paying adult; children 5 and older pay and need their own card or SmarTrip.",
    "Regular rail fares: weekdays 5 a.m.–9:30 p.m. USD 2.25–6.75; after 9:30 p.m. and weekends USD 2.25–2.50.",
    "Pay by tapping a contactless credit or debit card, or SmarTrip on a card or phone."
  ]
};

const days = [
  {
    title: "Day 1: Natural History and the Monument",
    blocks: [
      ["Morning", "Natural History from its 10 a.m. opening. No pass needed, so this is the easiest first stop. Keep bags light: there is no storage."],
      ["Lunch", "Café (Ocean Terrace closes at 3 p.m.) or a packed lunch eaten outside on the Mall."],
      ["Rest block", "Plan about two hours of rest: back to the room or a quiet sit. Whether a room return works depends on your hotel; see the museum-rest notes in the DC hotels guide."],
      ["Afternoon", "Washington Monument at an entry time booked ahead on recreation.gov (every person 2 and up needs a ticket), or same-day tickets picked up at the Lodge from 8:45 a.m., before the museum. The NPS fees page lists no hours, so check your ticket time and the closure list. If there are no tickets or the weather turns, view it from outside."]
    ]
  },
  {
    title: "Day 2: National Zoo morning",
    blocks: [
      ["Morning", "Arrive near the 8 a.m. grounds opening with an entry pass for every person. Indoor exhibits open at 9 a.m."],
      ["Midday", "Picnic is allowed. The Zoo suggests 2–3 hours and is on a hill; plan to leave before small children tire."],
      ["Rest block", "Long afternoon rest. In winter hours the grounds close at 4 p.m. with last entry at 3 p.m., so the Zoo cannot be pushed into the afternoon."],
      ["Evening", "Keep it free: dinner near the hotel."]
    ]
  },
  {
    title: "Day 3: Air and Space, then American History",
    blocks: [
      ["Morning", "Air and Space with timed passes for everyone, babies included; book the earliest entry time available. Part of the museum is closed for renovation, so pick two or three galleries."],
      ["Lunch", "Mars Café inside Air and Space, or eat before moving on."],
      ["Rest block", "Short rest before the second museum, or end the day here with younger children."],
      ["Afternoon (optional)", "American History. With children 6 and under, go Wednesday–Sunday so Wonderplace (10 a.m.–4 p.m.) is open."]
    ]
  }
];

const swaps = [
  ["Rain or high wind", "Swap the Monument and the Zoo for any of the three museums. All three are indoors and open 10 a.m.–5:30 p.m.; the Monument can close in bad weather."],
  ["Monday or Tuesday with a child 6 or under", "Wonderplace is closed. Put American History on another day, or use Natural History that day instead."],
  ["Only two days", "Keep Day 1 and Day 3. Drop the Zoo, which needs the most planning: passes for everyone, parking or transit, and a hill."],
  ["Babies and toddlers", "Every person needs a pass at Air and Space and the Zoo; the Monument needs a ticket from age 2. Children 4 and under ride Metro free (two per paying adult)."],
  ["Teens", "Keep the same skeleton. Swap the long rest for a later museum session and give them one gallery choice each day."]
];

export function dcVenueCard(venue) {
  const sources = [[venue.source, "Official visitor page"], ...(venue.extraSource ? [venue.extraSource] : [])];
  return `          <article class="detail-card" id="venue-${e(venue.id)}">
            <h3>${e(venue.name)}</h3>
            <section><h4>Hours</h4><p>${e(venue.hours)}</p></section>
            <section><h4>Entry</h4><p>${e(venue.entry)}</p></section>
            <section><h4>Family rules</h4><ul>${venue.rules.map((rule) => `<li>${e(rule)}</li>`).join("")}</ul></section>
            <p class="review-label">Official fact, checked ${checkedLabel}: ${sources.map(([url, label]) => `<a href="${e(url)}">${e(label)}</a>`).join(" · ")}</p>
          </article>`;
}

function dayCard(day) {
  return `          <article class="detail-card itinerary-plan">
            <h3>${e(day.title)}</h3>
${day.blocks.map(([label, text]) => `            <section><h4>${e(label)}</h4><p>${e(text)}</p></section>`).join("\n")}
          </article>`;
}

export function washingtonDcItineraryPage() {
  const title = "Washington DC Itinerary With Kids: 3 Days Around Museum Hours and Rest";
  const description = "A 3-day Washington DC itinerary with kids built on official museum, Zoo and Monument hours and pass rules checked October 27, 2026, with rest blocks and rain swaps.";
  const body = `    <main id="main">
      <section class="page-hero">
        <div class="container">
          <p class="eyebrow">Washington, DC</p>
          <h1>Washington DC Itinerary With Kids: 3 Days Around Museum Hours and Rest</h1>
          ${contributorCredit()}
          <p>One main stop each morning, a protected rest block, and an optional afternoon. Built from official hours and pass rules, not a visit.</p>
        </div>
      </section>
${heroPhotoSection("washington-dc")}
      <section class="container trust-panel" aria-label="Review status">
        <p><strong>Venue facts checked:</strong> ${checkedLabel}, on each venue's official page (linked on every card).</p>
        <p>Day shapes and rest blocks are Family Tripwise planning estimates. We have not tested walking times, stroller routes or queues. Check hours and passes for your dates.</p>
      </section>
      <section id="dc-itinerary-answer" class="container answer-box" aria-label="Short answer">
        <p><strong>The plan:</strong> Day 1 Natural History + Monument, Day 2 the Zoo in the morning, Day 3 Air and Space + American History.</p>
        <p><strong>Main catch:</strong> Air and Space and the Zoo need a free pass for every person, babies included; the Monument needs a ticket from age 2.</p>
        <p><strong>Cost:</strong> museum and Zoo entry are free; Zoo parking is USD 30–40 per vehicle and Monument advance tickets carry a USD 1.00 fee each.</p>
      </section>
      <section class="container page-section">
        <div class="section-heading">
          <p class="eyebrow">Day by day</p>
          <h2>Three days, one anchor each morning</h2>
        </div>
        <p class="review-label">Museums open at 10 a.m.; the Zoo grounds open at 8 a.m. That is why the Zoo gets its own early day.</p>
        <div class="detail-card-grid">
${days.map(dayCard).join("\n")}
        </div>
      </section>
      <section class="band">
        <div class="container">
          <div class="section-heading">
            <p class="eyebrow">Adjust the plan</p>
            <h2>Swaps for weather, weekday and age</h2>
          </div>
          <div class="quick-pick-grid">
${swaps.map(([label, text]) => `            <article class="quick-pick"><span>${e(label)}</span><p>${e(text)}</p></article>`).join("\n")}
          </div>
        </div>
      </section>
      <section class="container page-section" id="dc-venue-facts">
        <div class="section-heading">
          <p class="eyebrow">Official facts</p>
          <h2>Hours, passes and family rules by stop</h2>
        </div>
        <div class="detail-card-grid">
${dcVenues.map(dcVenueCard).join("\n")}
        </div>
      </section>
      <section class="container page-section" id="dc-metro">
        <div class="section-heading">
          <p class="eyebrow">Getting around</p>
          <h2>Metro fares for families</h2>
        </div>
        <ul>${dcMetro.facts.map((fact) => `<li>${e(fact)}</li>`).join("")}</ul>
        <p class="review-label">Official fact, checked ${checkedLabel}: <a href="${e(dcMetro.source)}">WMATA fares</a>. Natural History lists Federal Triangle, Archives/Navy Memorial and Metro Center as nearby stations. Use WMATA's trip planner for your exact route.</p>
      </section>
      <section class="container page-section">
        <div class="section-heading">
          <p class="eyebrow">Next decision</p>
          <h2>Choose the room before the route</h2>
        </div>
        <p>A midday rest only works if the room is close enough and fits everyone. Compare room setups, kitchens and older dated prices in the <a href="../where-to-stay/washington-dc-family-hotels.html">Washington DC family hotels guide</a>, and read its <a href="../where-to-stay/washington-dc-family-hotels.html#rest">museum-rest notes</a> before planning a room return.</p>
      </section>
    </main>`;
  return withLinkPreview(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${e(title)}</title>
    <meta name="description" content="${e(description)}">
    <link rel="canonical" href="https://familytripwise.com/${dcItineraryPath}">
    <link rel="stylesheet" href="../styles.css">
  </head>
  <body>
    ${siteHeader("../", dcItineraryPath)}
${body}
    ${siteEnd("../", dcItineraryPath)}
  </body>
</html>
`);
}

// Maintenance clock for site-maintenance.mjs: official facts age 14 days; nothing renews automatically.
export function dcItineraryMaintenance(today) {
  const official = [...dcVenues.flatMap((venue) => [venue.source, ...(venue.extraSource ? [venue.extraSource[0]] : [])]), dcMetro.source];
  return {
    page_url: `https://familytripwise.com/${dcItineraryPath}`,
    model_path: "tools/page-generation/washington-dc-itinerary-page.mjs",
    record_path: "docs/research/washington-dc-itinerary-facts-2026-10-27.md",
    automatic_fact_renewal: false,
    evidence_state: today < dcItineraryCheckedOn ? "not-yet-observed-at-report-date" : "dated-records-available",
    official: official.map((url) => ({ url, checked_on: dcItineraryCheckedOn, freshness: ageState(dcItineraryCheckedOn, 14, today) })),
    limitation: "Dated official hours, pass and fare rules; day shapes and rest blocks are planning estimates, not tested routes, queues or firsthand experience."
  };
}
