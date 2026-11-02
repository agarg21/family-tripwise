// G14 batch 2 (persona review): a two-line answer above the comparison table on six activity pages.
// Every "free" entry names a row whose cost cell says free (tools/hero-photos-batch2.test.mjs checks this).
export const activityGlances = {
  "things-to-do/chicago-with-kids.html": {
    lead: "12 Chicago picks for kids, compared by age, time, cost, area and rain fit.",
    alsoFree: "Garfield Park Conservatory is free for verified Chicago residents.",
    free: [["Lincoln Park Zoo", "Lincoln Park Zoo"], ["Millennium Park and Maggie Daley Park", "Millennium Park and Maggie Daley Park"], ["the lakefront and beaches", "Chicago lakefront and beach time"], ["the Art Institute for kids under 14", "Art Institute of Chicago"]]
  },
  "things-to-do/san-antonio-with-kids.html": {
    lead: "13 San Antonio picks for kids, compared by role, time, cost, area and heat or rain fit.",
    alsoFree: "Morgan's Wonderland is free for guests with special needs.",
    free: [["Hemisfair and Yanaguana Garden", "Hemisfair and Yanaguana Garden"], ["the Japanese Tea Garden", "Japanese Tea Garden"], ["the Missions", "San Antonio Missions"], ["the Alamo church (reserve; extras are paid)", "The Alamo"]]
,
    checkNote: "the table gives each one's family-of-4 cost"
  },
  "things-to-do/chicago-with-teens.html": {
    lead: "8 Chicago picks for teens, compared by cost, teen payoff, time, area and flexibility.",
    free: [["a Lakefront Trail segment (bike rental extra)", "Lakefront Trail, one bounded segment"]],
    checkNote: "the table says what to check for each pick"
  },
  "things-to-do/las-vegas-with-teens.html": {
    lead: "8 Las Vegas picks for teens, compared by teen fit, time, cost, area and walking.",
    free: [["the Bellagio Conservatory and fountains", "Bellagio Conservatory and fountains"], ["Pinball Hall of Fame entry (games are pay per play)", "Pinball Hall of Fame"]],
    cost: ["Family of 4 (2 adults, 2 teens), estimate:", "Neon Museum by day ≈ $75 plus a ticket fee; Omega Mart from ≈ $180 plus any fees. Official prices read Nov 1, 2026."],
    checkNote: "the table says what to check for each pick"
  },
  "things-to-do/new-york-city-with-kids.html": {
    bullets: true,
    lead: "12 New York City picks for kids, compared by cost, age, time and rain fit.",
    free: [["Central Park", "Central Park"], ["the Staten Island Ferry", "Staten Island Ferry"], ["Brooklyn Bridge Park", "Brooklyn Bridge Park"], ["the High Line", "High Line"]],
    cost: ["3 days, family of 4 (kids 4 and 8), estimate:", "≈ $218 in tickets: Children's Museum $68 online, Transit Museum $50, Bronx Zoo $100 (winter rate). Prices read Nov 2, 2026."],
    checkNote: "the table has family costs"
  },
  "things-to-do/new-york-city-with-teens.html": {
    lead: "10 New York City picks for teens, compared by cost, teen payoff, time, area and flexibility.",
    free: [["the High Line and Chelsea", "High Line and Chelsea, one bounded segment"], ["MoMA for 16 and under (adults pay)", "MoMA"]],
    cost: ["Prices:", "official, read Nov 1, 2026 (MoMA Oct 26); the family-of-4 estimate sits above the table, and fees and add-ons are in its Cost column."],
    checkNote: "the table says what to check for each pick"
  },
  "things-to-do/san-diego-with-teens.html": {
    lead: "8 San Diego picks for teens, compared by cost, age fit, time, area and rain fit.",
    free: [["the La Jolla coast", "La Jolla Cove / coast"], ["Mission Bay beach time", "Mission Bay beach time"]],
    cost: ["Family of 4 (2 adults, 2 teens 13-16), estimate:", "2 days (zoo, then La Jolla coast) ≈ $312; Birch Aquarium ≈ $140 instead of the zoo. Tax, fees and parking extra."],
    checkNote: "the table says what to check for each pick"
  },
  "things-to-do/san-antonio-with-teens.html": {
    lead: "10 San Antonio picks for teens, compared by cost, teen payoff, time, area and flexibility.",
    free: [["Mission San José", "Mission San Jose or one selected mission"], ["the Alamo church (exhibit paid)", "Alamo church and Ralston Family Collections Center"], ["browsing the Pearl", "Pearl and Museum Reach, one teen-chosen stop"], ["browsing Southtown and Blue Star", "Southtown and Blue Star, one selected gallery or food stop"]],
    cost: ["Family of 4 (2 adults, 2 teens 13-17), estimate:", "a 3-day plan with one SeaWorld day, the Alamo exhibit and free picks from ≈ $276 ($216 + $60); a Six Flags day instead from ≈ $196. Parking, taxes and fees extra. Official prices read Nov 1, 2026."],
    checkNote: "the table says what to check for each pick"
  }
};

const esc = (v) => String(v).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
const list = (items) => items.length < 2 ? items.join("") : `${items.slice(0, -1).join(", ")} and ${items.at(-1)}`;

export function renderActivityGlance(glance, rows) {
  for (const [, row] of glance.free) {
    const found = rows.find((r) => r[0] === row);
    if (!found || !found.slice(1).some((cell) => /\bfree\b/i.test(cell))) throw new Error(`Glance free pick has no free row: ${row}`);
  }
  if (!glance.lead.startsWith(String(rows.length))) throw new Error(`Glance count does not match ${rows.length} rows`);
  const lines = [
    `<strong>At a glance:</strong> ${esc(glance.lead)}`,
    `<strong>Free:</strong> ${esc(list(glance.free.map(([label]) => label)))}. The rest cost money${glance.alsoFree ? ` (${esc(glance.alsoFree.replace(/\.$/, ""))})` : ""}; ${esc(glance.checkNote || "each card says what to check before you buy")}.`,
    ...(glance.cost ? [`<strong>${esc(glance.cost[0])}</strong> ${esc(glance.cost[1])}`] : [])
  ];
  const body = glance.bullets
    ? `        <ul>\n${lines.map((line) => `          <li>${line}</li>`).join("\n")}\n        </ul>`
    : lines.map((line) => `        <p>${line}</p>`).join("\n");
  return `      <section class="container answer-box activity-glance" aria-label="At a glance">\n${body}\n      </section>`;
}
