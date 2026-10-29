// Boston itinerary with kids (Q15b). Every venue fact below was read on the official page
// named in `source` on `checkedOn`; see docs/research/boston-itinerary-facts-2026-10-27.md.
// Rest blocks and day shapes are Family Tripwise planning estimates, not route or timing claims.
import { contributorCredit } from "./contributors.mjs";
import { siteHeader, siteEnd } from "./site-chrome.mjs";
import { ageState } from "../evidence-audit.mjs";
import { withLinkPreview } from "./link-previews.mjs";

export const bostonItineraryPath = "family-itinerary/boston-with-kids.html";
export const bostonItineraryCheckedOn = "2026-10-27";
const checkedLabel = "October 27, 2026";

const e = (value) => String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");

export const bostonVenues = [
  {
    id: "museum-of-science",
    name: "Museum of Science",
    source: "https://www.mos.org/visit/hours",
    extraSource: ["https://www.mos.org/visit/faq", "Visitor FAQs"],
    hours: "Exhibit Halls open daily, 9 a.m.–5 p.m. Closed Thanksgiving and Christmas; closes at 2 p.m. the day before Thanksgiving and on Christmas Eve.",
    entry: "Exhibit Halls: adult USD 33, child (3–11) USD 28, senior (60+) USD 29; children under 3 free. Timed tickets are no longer required: pick your visit date. Planetarium, Omni and 4-D shows are USD 6 add-ons.",
    rules: [
      "Re-entry the same day: show your confirmation or a Museum hand stamp.",
      "Food from home is eaten outside, on the front plaza or at picnic tables behind the Museum; no eating in the Exhibit Halls.",
      "Strollers are available first come, first served; lockers for a small fee."
    ]
  },
  {
    id: "childrens-museum",
    name: "Boston Children's Museum",
    source: "https://bostonchildrensmuseum.org/visit/",
    hours: "Wednesday–Monday 9 a.m.–4 p.m.; closed Tuesdays. Opens at 10 a.m. on the first Saturday of each month.",
    entry: "USD 24 per adult and per child aged 1–15; infants under 12 months free. Advance online tickets are highly recommended.",
    rules: [
      "Its visit page does not state a re-entry rule, so do not plan to leave for a nap and come back on the same ticket.",
      "Its visit page suggests the Red Line or Silver Line to South Station, then a short walk.",
      "Garage parking validation at four listed garages needs a physical ticket pulled at the garage gate."
    ]
  },
  {
    id: "aquarium",
    name: "New England Aquarium",
    source: "https://www.neaq.org/visit/",
    extraSource: ["https://www.neaq.org/visit/frequently-asked-questions/", "Aquarium FAQs"],
    hours: "Fall hours: weekdays 9 a.m.–5 p.m.; Saturday and Sunday 9 a.m.–6 p.m. The page does not give the season dates, so check hours for your trip.",
    entry: "Timed tickets; buy ahead to guarantee entry, as weekends and holidays often sell out. Prices were not shown on the visit pages we could read; the ticket site did not load for us.",
    rules: [
      "You may leave and come back the same day; you may be asked to show your ticket.",
      "Strollers are allowed but the Aquarium strongly recommends leaving them at home or in the car; it has none to borrow or rent. Lockers USD 5 small, USD 7 large.",
      "Bring your own food to the blue picnic tables outside; only water inside the exhibits.",
      "The Atlantic harbor seals are temporarily off exhibit."
    ]
  },
  {
    id: "uss-constitution",
    name: "USS Constitution and USS Constitution Museum",
    source: "https://ussconstitutionmuseum.org/hours-admission/",
    hours: "Museum open daily 9:30 a.m.–5 p.m. (closed Thanksgiving, Christmas and New Year's Day). The ship is open Wednesday–Sunday, 10 a.m.–4 p.m.",
    entry: "Ship: free, first come, first served. Museum: suggested admission USD 15 per person (USD 25 pay-it-forward, free to USD 10 reduced).",
    rules: [
      "Everyone boarding the ship goes through security; adults need a federal or state photo ID, visitors under 18 do not.",
      "Strollers are not allowed on board and must be left on the pier."
    ]
  },
  {
    id: "swan-boats",
    name: "Swan Boats, Public Garden",
    source: "https://swanboats.com/plan-your-visit/",
    hours: "Closed for the season; the operator says it returns in April 2027. Its page showed no 2027 dates, hours or fares on October 27.",
    entry: "Pay by cash or card; individuals need no reservation. Check the operator page for 2027 fares.",
    rules: [
      "Rides last 10–15 minutes and do not run in rain, high wind or extreme heat.",
      "Strollers fold onto the boat or stay on the unsecured patio by the dock."
    ]
  }
];

export const bostonTransit = {
  source: "https://mycharlie.mbta.com/reduced/free",
  facts: [
    "Children age 11 and under ride the MBTA free. The page does not say how many children may ride with each adult.",
    "Groups of 10 or more children must register travel in advance through the MBTA field-trip form."
  ]
};

const days = [
  {
    title: "Day 1: Museum of Science",
    blocks: [
      ["Morning", "Museum of Science from its 9 a.m. opening. No timed ticket is needed; under-3s are free. Pick one or two halls rather than the whole building."],
      ["Lunch", "Food from home goes outside on the plaza or at the picnic tables behind the Museum."],
      ["Rest block", "Plan about two hours of rest. Same-day re-entry works with your confirmation or hand stamp, so a room or quiet break can come between halls. Whether a room return works depends on your hotel; see the rest notes in the Boston hotels guide."],
      ["Afternoon (optional)", "Come back for a USD 6 Planetarium or Omni show, or stop for the day. Exhibit Halls close at 5 p.m."]
    ]
  },
  {
    title: "Day 2: Children's Museum or the Aquarium",
    blocks: [
      ["Morning", "Our routing suggestion for younger children: Boston Children's Museum from 9 a.m. (closed Tuesdays; 10 a.m. on the first Saturday of the month). Our routing suggestion for older children: New England Aquarium at your timed entry."],
      ["Lunch", "At the Aquarium, own food is eaten at the outdoor picnic tables. The Children's Museum visit page does not state its lunch rules."],
      ["Rest block", "Long rest. The Children's Museum page does not state a re-entry rule, so finish there before the break; the Aquarium allows same-day re-entry."],
      ["Late afternoon (optional)", "If you started at the Aquarium, the afternoon can return there before its 5 p.m. weekday closing (6 p.m. weekends)."]
    ]
  },
  {
    title: "Day 3: USS Constitution",
    blocks: [
      ["Morning", "USS Constitution Museum from 9:30 a.m., then the ship when it opens at 10 a.m., Wednesday–Sunday only. Adults bring photo ID; leave the stroller on the pier."],
      ["Lunch", "Eat before or after the ship; the museum page does not list food rules."],
      ["Rest block", "Afternoon rest. The ship closes at 4 p.m., so it fits best as a morning stop."],
      ["Afternoon (optional)", "If you skipped it on Day 2, the Aquarium is the indoor option for this afternoon."]
    ]
  }
];

const swaps = [
  ["Monday or Tuesday", "The USS Constitution ship is closed both days, and the Children's Museum is closed Tuesdays. Use the Museum of Science or the Aquarium instead."],
  ["Rain or cold", "The Museum of Science, Children's Museum and Aquarium are indoor anchors; switch the ship day for one of them."],
  ["Babies and toddlers", "Under 3 free at the Museum of Science; under 12 months free at the Children's Museum. The Aquarium advises against strollers and the ship does not allow them on board."],
  ["Only two days", "Keep Day 1 and Day 2. Drop the ship, which needs photo ID for adults, no stroller and a Wednesday–Sunday date."],
  ["Spring and summer trips", "The Swan Boats in the Public Garden (10–15 minute rides) are closed now and return in April 2027, the operator says. Check its page for dates and fares before adding one."],
  ["Teens", "Keep the same skeleton. Swap the long rest for a later Museum of Science show and let them pick the Day 2 stop."]
];

export function bostonVenueCard(venue) {
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

export function bostonItineraryPage() {
  const title = "Boston Itinerary With Kids: 3 Days Around Museum Hours and Rest";
  const description = "A 3-day Boston itinerary with kids built on official Museum of Science, Children's Museum, Aquarium and USS Constitution hours and rules checked October 27, 2026, with rest blocks and swaps.";
  const body = `    <main id="main">
      <section class="page-hero">
        <div class="container">
          <p class="eyebrow">Boston</p>
          <h1>Boston Itinerary With Kids: 3 Days Around Museum Hours and Rest</h1>
          ${contributorCredit()}
          <p>One main stop each morning, a protected rest block, and an optional afternoon. Built from official hours and entry rules, not a visit.</p>
        </div>
      </section>
      <section class="container trust-panel" aria-label="Review status">
        <p><strong>Venue facts checked:</strong> ${checkedLabel}, on each venue's official page (linked on every card).</p>
        <p>Day shapes and rest blocks are Family Tripwise planning estimates. We have not tested walking times, stroller routes or queues. Check hours and tickets for your dates.</p>
      </section>
      <section id="boston-itinerary-answer" class="container answer-box" aria-label="Short answer">
        <p><strong>The plan:</strong> Day 1 Museum of Science, Day 2 Children's Museum (younger children) or the Aquarium, Day 3 USS Constitution.</p>
        <p><strong>Main catch:</strong> the Children's Museum is closed Tuesdays and the ship opens Wednesday–Sunday only; leave strollers behind for the ship and, the Aquarium advises, its exhibits.</p>
        <p><strong>Cost:</strong> Museum of Science USD 33 adult / USD 28 age 3–11; Children's Museum USD 24 from age 1; the ship is free. Aquarium prices: check its ticket site.</p>
      </section>
      <section class="container page-section">
        <div class="section-heading">
          <p class="eyebrow">Day by day</p>
          <h2>Three days, one anchor each morning</h2>
        </div>
        <p class="review-label">The Museum of Science, Children's Museum and Aquarium open at 9 a.m. (Children's Museum 10 a.m. on the first Saturday); the USS Constitution Museum opens at 9:30 a.m. and the ship at 10 a.m. Same-day re-entry is stated by the Museum of Science and the Aquarium only.</p>
        <div class="detail-card-grid">
${days.map(dayCard).join("\n")}
        </div>
      </section>
      <section class="band">
        <div class="container">
          <div class="section-heading">
            <p class="eyebrow">Adjust the plan</p>
            <h2>Swaps for weekday, weather, season and age</h2>
          </div>
          <div class="quick-pick-grid">
${swaps.map(([label, text]) => `            <article class="quick-pick"><span>${e(label)}</span><p>${e(text)}</p></article>`).join("\n")}
          </div>
        </div>
      </section>
      <section class="container page-section" id="boston-venue-facts">
        <div class="section-heading">
          <p class="eyebrow">Official facts</p>
          <h2>Hours, tickets and family rules by stop</h2>
        </div>
        <div class="detail-card-grid">
${bostonVenues.map(bostonVenueCard).join("\n")}
        </div>
      </section>
      <section class="container page-section" id="boston-transit">
        <div class="section-heading">
          <p class="eyebrow">Getting around</p>
          <h2>MBTA rules for children</h2>
        </div>
        <ul>${bostonTransit.facts.map((fact) => `<li>${e(fact)}</li>`).join("")}</ul>
        <p class="review-label">Official fact, checked ${checkedLabel}: <a href="${e(bostonTransit.source)}">MBTA free-ride rules</a>. Adult fares are not shown here: the MBTA fares site's robots.txt blocks AI agents, so we do not read it. Check <a href="https://www.mbta.com/fares">MBTA fares</a> and its trip planner yourself.</p>
      </section>
      <section class="container page-section">
        <div class="section-heading">
          <p class="eyebrow">Next decision</p>
          <h2>Choose the room before the route</h2>
        </div>
        <p>A midday rest only works if the room is close enough and fits everyone. Compare room setups, kitchens and older dated prices in the <a href="../where-to-stay/boston-family-hotels.html">Boston family hotels guide</a>, and read its <a href="../where-to-stay/boston-family-hotels.html#rest">rest and transit notes</a> before planning a room return.</p>
      </section>
    </main>`;
  return withLinkPreview(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${e(title)}</title>
    <meta name="description" content="${e(description)}">
    <link rel="canonical" href="https://familytripwise.com/${bostonItineraryPath}">
    <link rel="stylesheet" href="../styles.css">
  </head>
  <body>
    ${siteHeader("../", bostonItineraryPath)}
${body}
    ${siteEnd("../", bostonItineraryPath)}
  </body>
</html>
`);
}

// Maintenance clock for site-maintenance.mjs: official facts age 14 days; nothing renews automatically.
export function bostonItineraryMaintenance(today) {
  const official = [...bostonVenues.flatMap((venue) => [venue.source, ...(venue.extraSource ? [venue.extraSource[0]] : [])]), bostonTransit.source];
  return {
    page_url: `https://familytripwise.com/${bostonItineraryPath}`,
    model_path: "tools/page-generation/boston-itinerary-page.mjs",
    record_path: "docs/research/boston-itinerary-facts-2026-10-27.md",
    automatic_fact_renewal: false,
    evidence_state: today < bostonItineraryCheckedOn ? "not-yet-observed-at-report-date" : "dated-records-available",
    official: official.map((url) => ({ url, checked_on: bostonItineraryCheckedOn, freshness: ageState(bostonItineraryCheckedOn, 14, today) })),
    limitation: "Dated official hours, ticket and transit rules; day shapes and rest blocks are planning estimates, not tested routes, queues or firsthand experience. Aquarium prices and MBTA adult fares were not observed."
  };
}
