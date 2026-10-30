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
  },
  "things-to-do/chicago-with-teens.html": {
    lead: "8 Chicago picks for teens, compared by teen payoff, time and cost, area and flexibility.",
    free: [["a Lakefront Trail segment (bike rental extra)", "Lakefront Trail, one bounded segment"], ["the Art Institute teen audio guide (admission paid)", "Art Institute Teen Audio Guide"]]
  },
  "things-to-do/las-vegas-with-teens.html": {
    lead: "8 Las Vegas picks for teens, compared by teen fit, time, cost, area and walking.",
    free: [["the Bellagio Conservatory and fountains", "Bellagio Conservatory and fountains"]]
  },
  "things-to-do/new-york-city-with-teens.html": {
    lead: "10 New York City picks for teens, compared by teen payoff, time and cost, area and flexibility.",
    free: [["the High Line and Chelsea", "High Line and Chelsea, one bounded segment"], ["MoMA for 16 and under (adults pay)", "MoMA"]]
  },
  "things-to-do/san-antonio-with-teens.html": {
    lead: "10 San Antonio picks for teens, compared by teen payoff, time and cost, area and flexibility.",
    free: [["Mission San José", "Mission San Jose or one selected mission"], ["the Alamo church (exhibit paid)", "Alamo church and Ralston Family Collections Center"], ["browsing the Pearl", "Pearl and Museum Reach, one teen-chosen stop"], ["browsing Southtown and Blue Star", "Southtown and Blue Star, one selected gallery or food stop"]]
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
  return `      <section class="container answer-box activity-glance" aria-label="At a glance">
        <p><strong>At a glance:</strong> ${esc(glance.lead)}</p>
        <p><strong>Free:</strong> ${esc(list(glance.free.map(([label]) => label)))}. The rest cost money${glance.alsoFree ? ` (${esc(glance.alsoFree.replace(/\.$/, ""))})` : ""}; each card says what to check before you buy.</p>
      </section>`;
}
