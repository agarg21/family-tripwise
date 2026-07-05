import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { upgradePriorityPages } from "./upgrade-priority-pages.mjs";

const outDir = fileURLToPath(new URL("../site/", import.meta.url));

const cities = [
  {
    name: "Chicago",
    slug: "chicago",
    state: "Illinois",
    volume: { activities: "5,400", stay: "110", itinerary: "20" },
    metaName: "Chicago",
    intro: "Balance big museums, lakefront time, architecture views, parks, and neighborhood meals without turning every day into a transit marathon.",
    photo: {
      src: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Millennium%20park%2Cchicago.JPG",
      alt: "Millennium Park in Chicago at dusk.",
      credit: "Photo: Behnazkhazai, Wikimedia Commons, CC BY-SA 3.0",
      creditUrl: "https://commons.wikimedia.org/wiki/File:Millennium_park,chicago.JPG"
    },
    sources: [
      ["Field Museum visit info", "https://www.fieldmuseum.org/visit"],
      ["Shedd Aquarium plan-a-visit", "https://www.sheddaquarium.org/plan-a-visit"],
      ["Lincoln Park Zoo visit info", "https://www.lpzoo.org/visit/"],
      ["Maggie Daley Park", "https://maggiedaleypark.com/"],
      ["Navy Pier visit info", "https://navypier.org/"]
    ],
    areas: [
      ["River North / Magnificent Mile", "First-timers, central transit, easy restaurants", "Hotel prices and busy sidewalks", "Great"],
      ["Lincoln Park", "Zoo, playgrounds, neighborhood walks", "Farther from Loop museums", "Excellent"],
      ["Loop / Millennium Park", "Museum Campus, parks, short stays", "Quieter evenings", "Good"],
      ["West Loop", "Food, older kids, stylish hotels", "Less toddler-green-space right outside", "Good"]
    ],
    activities: [
      ["Field Museum", "elementary tween teen rain stroller", "3-5 hrs", "$$", "Good", "Yes", "Medium", "Museum Campus", "A strong anchor for dinosaur, science, and history-minded kids. Pair with one nearby stop, not a full museum sprint."],
      ["Shedd Aquarium", "toddler preschool elementary rain stroller", "2-4 hrs", "$$$", "Good", "Yes", "High", "Museum Campus", "Best for younger kids and rainy days. Book ahead during school breaks."],
      ["Lincoln Park Zoo", "baby toddler preschool elementary stroller", "2-3 hrs", "$", "Good", "No", "High", "Lincoln Park", "Free, flexible, and easy to shorten if naps or weather interrupt the plan."],
      ["Millennium Park and Maggie Daley Park", "toddler preschool elementary stroller", "2-3 hrs", "$", "Good", "No", "Medium", "Loop", "Good first-day energy burn with skyline views and playground time."],
      ["Architecture boat tour", "tween teen", "90 min", "$$$", "Limited", "No", "Low", "River North", "Better for tweens and teens who can sit, listen, and enjoy the river route."],
      ["Navy Pier", "preschool elementary tween teen rain stroller", "2-4 hrs", "$$", "Good", "Partial", "Medium", "Streeterville", "Useful when the weather is mixed, though it can feel crowded and commercial."]
    ],
    teenFocus: ["architecture boat tour", "food halls and neighborhoods", "lakefront biking", "Museum of Science and Industry", "evening skyline views"],
    toddlerFocus: ["Lincoln Park Zoo", "Maggie Daley Park", "Shedd Aquarium", "lakefront playgrounds"],
    itinerary: [
      ["Day 1", "Millennium Park, Maggie Daley Park, and an easy River North or Loop dinner."],
      ["Day 2", "Museum Campus: choose Field Museum or Shedd Aquarium, then lakefront downtime."],
      ["Day 3", "Lincoln Park Zoo in the morning, neighborhood lunch, and optional Navy Pier or boat tour by age."]
    ]
  },
  {
    name: "San Antonio",
    slug: "san-antonio",
    state: "Texas",
    volume: { activities: "5,400", stay: "best family hotels: 140", itinerary: "10" },
    metaName: "San Antonio",
    intro: "Use the River Walk, Alamo, museums, theme parks, and Pearl District without underestimating heat, walking time, or nap breaks.",
    photo: {
      src: "https://commons.wikimedia.org/wiki/Special:Redirect/file/The%20San%20Antonio%20River%20Walk.jpg",
      alt: "The San Antonio River Walk with paths and restaurants along the water.",
      credit: "Photo: Matt Harriger, Wikimedia Commons, CC BY-SA 2.0",
      creditUrl: "https://commons.wikimedia.org/wiki/File:The_San_Antonio_River_Walk.jpg"
    },
    sources: [
      ["The Alamo visit info", "https://www.thealamo.org/visit"],
      ["GO RIO River Walk cruises", "https://www.goriocruises.com/"],
      ["The DoSeum visit info", "https://www.thedoseum.org/visit"],
      ["San Antonio Zoo visit info", "https://sazoo.org/plan-your-visit/"],
      ["Natural Bridge Caverns", "https://naturalbridgecaverns.com/"]
    ],
    areas: [
      ["River Walk / Downtown", "First visit, walkable meals, Alamo access", "Noise and stroller crowding", "Great"],
      ["Pearl / Museum Reach", "Food, calmer walks, families who want less chaos", "Fewer classic hotel bargains", "Excellent"],
      ["Northwest / SeaWorld area", "Theme park trips and pools", "Car-dependent", "Good"],
      ["Airport / North San Antonio", "Value and parking", "Less vacation feel", "Good"]
    ],
    activities: [
      ["The Alamo", "elementary tween teen stroller", "60-90 min", "$", "Good", "No", "Medium", "Downtown", "Keep it short with younger kids and pair with shaded River Walk time."],
      ["River Walk boat ride", "toddler preschool elementary tween teen stroller", "45-60 min", "$$", "Limited", "No", "Medium", "Downtown", "A good low-effort orientation activity, especially in the morning or evening."],
      ["The DoSeum", "toddler preschool elementary rain stroller", "2-4 hrs", "$$", "Good", "Yes", "High", "Broadway", "Best toddler and younger-kid anchor with indoor backup value."],
      ["San Antonio Zoo", "toddler preschool elementary stroller", "3-5 hrs", "$$", "Good", "No", "Medium", "Brackenridge Park", "Start early in warm months and do not stack it with another big outdoor stop."],
      ["Natural Bridge Caverns", "elementary tween teen", "2-4 hrs", "$$$", "Limited", "Partial", "Low", "North of city", "Better for older kids and teens comfortable with walking and uneven surfaces."],
      ["Six Flags Fiesta Texas", "tween teen", "half-full day", "$$$", "Mixed", "No", "Low", "Northwest", "A teen-heavy day that needs heat and transportation planning."]
    ],
    teenFocus: ["Natural Bridge Caverns", "Six Flags Fiesta Texas", "Pearl District food", "River Walk at night", "missions by bike"],
    toddlerFocus: ["The DoSeum", "San Antonio Zoo", "boat ride", "Pearl splash pads"],
    itinerary: [
      ["Day 1", "Alamo, short River Walk loop, boat ride, and early dinner."],
      ["Day 2", "The DoSeum or zoo in the morning, rest after lunch, Pearl District evening."],
      ["Day 3", "Choose SeaWorld, Six Flags, missions, or Natural Bridge Caverns based on kid age."]
    ]
  },
  {
    name: "San Diego",
    slug: "san-diego",
    state: "California",
    volume: { activities: "4,400", stay: "320", itinerary: "90" },
    metaName: "San Diego",
    intro: "Build around beach mornings, the zoo, Balboa Park, La Jolla, and realistic driving windows between naps, meals, and pool time.",
    photo: {
      src: "https://commons.wikimedia.org/wiki/Special:Redirect/file/San%20Diego%20Zoo%2C%20San%20Diego%2C%20United%20States%20%28Unsplash%20QZwf5yNopUo%29.jpg",
      alt: "A red panda at the San Diego Zoo.",
      credit: "Photo: Lance Anderson, Wikimedia Commons, CC0",
      creditUrl: "https://commons.wikimedia.org/wiki/File:San_Diego_Zoo,_San_Diego,_United_States_(Unsplash_QZwf5yNopUo).jpg"
    },
    sources: [
      ["San Diego Zoo plan your visit", "https://zoo.sandiegozoo.org/plan-your-visit"],
      ["Birch Aquarium plan your visit", "https://aquarium.ucsd.edu/plan-your-visit"],
      ["Balboa Park visitor info", "https://balboapark.org/"],
      ["Coronado Ferry info", "https://coronadoferrylanding.com/ferry-info/"],
      ["Bahia Resort Hotel FAQ", "https://www.bahiahotel.com/faqs"],
      ["San Diego Mission Bay Resort FAQ", "https://www.missionbayresort.com/faq/"],
      ["Homewood Suites San Diego Downtown/Bayside", "https://www.hilton.com/en/hotels/sanhahw-homewood-suites-san-diego-downtown-bayside/"]
    ],
    areas: [
      ["Mission Bay", "Toddlers, pools, bay beaches, easy zoo drives", "Less neighborhood walking", "Excellent"],
      ["La Jolla", "Tide pools, sea lions, coastal views, older kids", "Hills and parking", "Great"],
      ["Downtown / Little Italy", "Walkable meals, harbor, Balboa Park access", "Noise and parking fees", "Good"],
      ["Coronado", "Classic beach vacation pace", "Higher hotel prices", "Great"],
      ["Mission Valley / Hotel Circle", "Value and central drives", "Car-dependent", "Good"]
    ],
    activities: [
      ["San Diego Zoo", "toddler preschool elementary tween teen stroller", "4-6 hrs", "$$$", "Good", "No", "Medium", "Balboa Park", "Use the bus tour early, then choose a few zones instead of trying to finish the whole park."],
      ["Mission Bay beach morning", "baby toddler preschool stroller", "2-3 hrs", "$", "Mixed", "No", "High", "Mission Bay", "A calmer water and sand option for younger kids before naps or afternoon sun."],
      ["Balboa Park museums", "preschool elementary tween teen rain stroller", "2-4 hrs", "$$", "Good", "Yes", "Medium", "Balboa Park", "Pick one museum and add a playground or garden walk."],
      ["Birch Aquarium", "toddler preschool elementary rain stroller", "90 min", "$$", "Good", "Partial", "High", "La Jolla", "A manageable indoor/outdoor backup with ocean views."],
      ["La Jolla Cove", "elementary tween teen", "2-4 hrs", "$", "Limited", "No", "Low", "La Jolla", "Great for older kids who can handle crowds, stairs, and uneven coastal paths."],
      ["Coronado ferry and waterfront", "preschool elementary tween teen stroller", "2-3 hrs", "$$", "Good", "No", "Medium", "Downtown / Coronado", "A scenic lower-effort outing from Downtown."]
    ],
    teenFocus: ["La Jolla Cove", "kayaking or sea caves", "Coronado ferry", "neighborhood food", "beach time with fewer little-kid stops"],
    toddlerFocus: ["Mission Bay", "San Diego Zoo bus tour", "Birch Aquarium", "Balboa Park playgrounds"],
    itinerary: [
      ["Day 1", "Mission Bay or hotel pool, groceries, early dinner, and a low-pressure arrival."],
      ["Day 2", "Zoo early, rest after lunch, then one Balboa Park garden or museum."],
      ["Day 3", "Choose La Jolla for scenery or Coronado for a calmer beach-and-ferry day."]
    ]
  },
  {
    name: "Las Vegas",
    slug: "las-vegas",
    state: "Nevada",
    volume: { activities: "3,600", stay: "best family hotels: 880", itinerary: "10" },
    metaName: "Las Vegas",
    intro: "Make Las Vegas work for kids by choosing the right hotel base, limiting Strip walking, and mixing spectacle with pools, nature, and downtime.",
    photo: {
      src: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Bellagio%20fountain%20show%202010%20las%20vegas.JPG",
      alt: "The Bellagio fountains and Las Vegas Strip at night.",
      credit: "Photo: chensiyuan, Wikimedia Commons, CC BY-SA 4.0",
      creditUrl: "https://commons.wikimedia.org/wiki/File:Bellagio_fountain_show_2010_las_vegas.JPG"
    },
    sources: [
      ["Mandalay Bay Beach", "https://mandalaybay.mgmresorts.com/en/amenities/beach.html"],
      ["Mandalay Bay FAQ", "https://mandalaybay.mgmresorts.com/en/faq.html"],
      ["Discovery Children's Museum", "https://www.discoverykidslv.org/"],
      ["Red Rock Canyon NCA", "https://www.blm.gov/programs/national-conservation-lands/nevada/red-rock-canyon"],
      ["Vdara Hotel & Spa", "https://vdara.mgmresorts.com/en.html"],
      ["Hilton Grand Vacations Club Paradise Las Vegas", "https://www.hilton.com/en/hotels/lasvsgv-hilton-grand-vacations-club-paradise-las-vegas/"]
    ],
    areas: [
      ["Center Strip", "First-timers, shows, short access to major sights", "Crowds, smoke, long casino walks", "Good"],
      ["South Strip", "Mandalay Bay pool, value, airport access", "Farther from some attractions", "Great"],
      ["Summerlin / Red Rock", "Nature, calmer hotels, older kids", "Not a classic Strip stay", "Good"],
      ["Downtown / Fremont", "Budget and neon spectacle", "Noise and adult atmosphere", "Limited"]
    ],
    activities: [
      ["Hotel pool day", "baby toddler preschool elementary tween teen stroller", "half day", "$$", "Good", "No", "High", "Hotel area", "The pool is often the actual family anchor. Check hours, shade, and height rules before booking."],
      ["Bellagio Conservatory and fountains", "toddler preschool elementary tween teen stroller", "60-90 min", "$", "Good", "Partial", "Medium", "Center Strip", "A flexible short stop, but plan for long indoor walking through resorts."],
      ["Discovery Children's Museum", "toddler preschool elementary rain stroller", "2-3 hrs", "$$", "Good", "Yes", "High", "Downtown", "Best younger-kid indoor backup away from casino floors."],
      ["High Roller observation wheel", "elementary tween teen stroller", "45-60 min", "$$", "Good", "Yes", "Medium", "LINQ", "A contained skyline activity that works better than aimless Strip walking."],
      ["Red Rock Canyon", "elementary tween teen", "half day", "$$", "Limited", "No", "Low", "West of Strip", "Best for older kids and teens who need a break from the Strip."],
      ["Area15 / immersive exhibits", "tween teen rain", "2-3 hrs", "$$$", "Mixed", "Yes", "Low", "Off Strip", "Teen-friendly, but choose exhibits carefully by age and sensory tolerance."]
    ],
    teenFocus: ["Red Rock Canyon", "Area15", "shows by age rating", "High Roller", "food courts and hotel pools"],
    toddlerFocus: ["hotel pools", "Discovery Children's Museum", "Bellagio Conservatory", "short fountain stop"],
    itinerary: [
      ["Day 1", "Hotel pool, short Conservatory/fountain loop, early dinner."],
      ["Day 2", "Choose a kid-friendly show or museum, rest, then High Roller or a short evening spectacle."],
      ["Day 3", "Red Rock Canyon for older kids or a second pool-and-museum day for younger kids."]
    ]
  },
  {
    name: "New York City",
    slug: "new-york-city",
    state: "New York",
    volume: { activities: "3,600 for NYC variant", stay: "590 for NYC variant", itinerary: "90 for NYC variant" },
    metaName: "NYC",
    intro: "Use NYC's museums, parks, ferries, neighborhoods, and transit with a plan that respects walking distance, stroller access, bathroom breaks, and overstimulation.",
    photo: {
      src: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Central%20Park%20New%20York%20City%20New%20York%2023%20cropped.jpg",
      alt: "A bridge and trees in Central Park, New York City.",
      credit: "Photo: Jet Lowe / National Park Service, public domain via Wikimedia Commons",
      creditUrl: "https://commons.wikimedia.org/wiki/File:Central_Park_New_York_City_New_York_23_cropped.jpg"
    },
    sources: [
      ["Central Park visitor info", "https://www.centralparknyc.org/"],
      ["American Museum of Natural History plan your visit", "https://www.amnh.org/plan-your-visit"],
      ["Staten Island Ferry", "https://www.nyc.gov/html/dot/html/ferrybus/staten-island-ferry.shtml"],
      ["Children's Museum of Manhattan", "https://cmom.org/"],
      ["Top of the Rock", "https://www.rockefellercenter.com/attractions/top-of-the-rock-observation-deck/"],
      ["Brooklyn Bridge Park", "https://brooklynbridgepark.org/"]
    ],
    areas: [
      ["Upper West Side", "Museums, Central Park, calmer family base", "Longer rides downtown", "Excellent"],
      ["Midtown", "First-timers, transit, major sights", "Crowds, room size, noise", "Good"],
      ["Downtown / Tribeca", "Space, waterfront, older kids", "Higher prices", "Great"],
      ["Brooklyn Heights / Downtown Brooklyn", "Promenade, parks, family pace", "Bridge/tunnel planning", "Good"]
    ],
    activities: [
      ["Central Park", "baby toddler preschool elementary tween teen stroller", "2-4 hrs", "$", "Good", "No", "High", "Upper Manhattan", "Use playgrounds and one nearby museum instead of trying to cover the whole park."],
      ["American Museum of Natural History", "toddler preschool elementary tween teen rain stroller", "2-4 hrs", "$$", "Good", "Yes", "Medium", "Upper West Side", "A strong anchor for most ages; pick exhibits before entering."],
      ["Staten Island Ferry", "preschool elementary tween teen stroller", "90 min", "$", "Good", "Partial", "Medium", "Lower Manhattan", "A free skyline-and-statue moment without committing to a full tour."],
      ["Children's Museum of Manhattan", "baby toddler preschool rain stroller", "90 min-2 hrs", "$$", "Good", "Yes", "High", "Upper West Side", "Best for younger kids when weather or energy dips."],
      ["Top of the Rock or Empire State Building", "elementary tween teen", "90 min", "$$$", "Mixed", "Yes", "Low", "Midtown", "Better for older kids who can handle lines and heights."],
      ["Brooklyn Bridge Park", "toddler preschool elementary tween teen stroller", "2-3 hrs", "$", "Good", "No", "Medium", "Brooklyn", "Great skyline payoff with more space than Midtown sidewalks."]
    ],
    teenFocus: ["observation decks", "food halls", "Brooklyn Bridge Park", "Broadway by age", "neighborhood wandering"],
    toddlerFocus: ["Central Park playgrounds", "CMOM", "AMNH highlights", "short ferry rides"],
    itinerary: [
      ["Day 1", "Central Park and AMNH, then a simple Upper West Side dinner."],
      ["Day 2", "Lower Manhattan ferry view, Battery Park, rest, then a neighborhood dinner."],
      ["Day 3", "Choose Midtown icons, Brooklyn Bridge Park, or a Broadway matinee based on age."]
    ]
  }
];

const agePages = [
  { slug: "chicago", age: "teens", volume: "720 exact; 320 for Chicago with teens" },
  { slug: "las-vegas", age: "teens", volume: "590 exact; 720 alternate word order" },
  { slug: "san-diego", age: "teens", volume: "590 exact" },
  { slug: "san-diego", age: "toddlers", volume: "260 exact; 260 San Diego toddler activities" },
  { slug: "san-antonio", age: "teens", volume: "140 exact; 390 alternate word order" }
];

function esc(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function staticNav(prefix) {
  return `        <a href="${prefix}things-to-do/chicago-with-kids.html">Chicago</a>
        <a href="${prefix}things-to-do/san-antonio-with-kids.html">San Antonio</a>
        <a href="${prefix}things-to-do/san-diego-with-kids.html">San Diego</a>
        <a href="${prefix}things-to-do/las-vegas-with-kids.html">Las Vegas</a>
        <a href="${prefix}things-to-do/new-york-city-with-kids.html">NYC</a>`;
}

function pageShell({ title, description, canonical, nav, body, script = false }) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${esc(title)}</title>
    <meta name="description" content="${esc(description)}">
    <link rel="canonical" href="https://familytripwise.com/${canonical}">
    <link rel="stylesheet" href="../styles.css">
  </head>
  <body>
    <header class="site-header">
      <a class="brand" href="../index.html" aria-label="Family Tripwise home">
        <span class="brand-mark">FT</span>
        <span>Family Tripwise</span>
      </a>
      <nav aria-label="Destination guides">
${staticNav("../")}
      </nav>
    </header>
${body}
    <footer class="site-footer">
      <p>Family Tripwise uses research-based planning notes. Hotel fees, hours, policies, closures, and transit conditions can change, so verify important details before booking.</p>
      <p><a href="../about.html">How our family travel guides are built</a></p>
    </footer>
${script ? '    <script src="../app.js"></script>\n' : ""}  </body>
</html>
`;
}

function links(city) {
  return {
    activities: `../things-to-do/${city.slug}-with-kids.html`,
    stay: `../where-to-stay/${city.slug}-with-kids.html`,
    itinerary: `../family-itinerary/${city.slug}-with-kids.html`
  };
}

function updatedBlock() {
  return `      <section class="container trust-panel" aria-label="Review status">
        <p><strong>Last updated:</strong> July 5, 2026</p>
        <p><strong>How this guide was built:</strong> Family Tripwise compares official attraction and hotel information, family logistics, search-intent research, and practical planning tradeoffs like age fit, stroller friction, weather backup, nap timing, walking distance, and lodging base.</p>
      </section>
`;
}

function cityPhoto(city) {
  return `      <section class="container media-section">
        <figure class="licensed-photo">
          <img src="${esc(city.photo.src)}" alt="${esc(city.photo.alt)}" loading="eager" decoding="async">
          <figcaption>${esc(city.photo.credit)}. <a href="${esc(city.photo.creditUrl)}">License and source</a>.</figcaption>
        </figure>
      </section>
`;
}

function sourceList(city) {
  return `      <section class="container page-section source-section">
        <div class="section-heading">
          <p class="eyebrow">Sources checked</p>
          <h2>Official sources and licensing notes</h2>
        </div>
        <p>Use these official pages to verify current hours, ticketing, parking, accessibility, hotel fees, and policies before booking.</p>
        <ul class="source-list">
${city.sources.map(([label, href]) => `          <li><a href="${esc(href)}">${esc(label)}</a></li>`).join("\n")}
          <li><a href="${esc(city.photo.creditUrl)}">Photo license and attribution</a></li>
        </ul>
      </section>
`;
}

function hero(city, h1, intro) {
  return `    <main>
      <section class="page-hero">
        <div class="container">
          <p class="eyebrow">${esc(city.name)}, ${esc(city.state)}</p>
          <h1>${esc(h1)}</h1>
          <p>${esc(intro)}</p>
        </div>
      </section>
${updatedBlock()}${cityPhoto(city)}
`;
}

function activityCards(city, filterAge) {
  const activities = filterAge
    ? city.activities.filter((item) => item[1].includes(filterAge === "toddlers" ? "toddler" : "teen"))
    : city.activities;
  return activities.map(([name, tags, time, cost, stroller, rain, nap, area, summary]) => `          <article class="activity-card" data-tags="${esc(tags)}">
            <h3>${esc(name)}</h3>
            <p>${esc(summary)}</p>
            <dl>
              <div><dt>Age fit</dt><dd>${esc(tags.split(" ").join(", "))}</dd></div>
              <div><dt>Time</dt><dd>${esc(time)}</dd></div>
              <div><dt>Cost</dt><dd>${esc(cost)}</dd></div>
              <div><dt>Area</dt><dd>${esc(area)}</dd></div>
              <div><dt>Stroller</dt><dd>${esc(stroller)}</dd></div>
              <div><dt>Rainy day</dt><dd>${esc(rain)}</dd></div>
              <div><dt>Nap-friendly</dt><dd>${esc(nap)}</dd></div>
              <div><dt>Booking</dt><dd>Check ahead</dd></div>
            </dl>
          </article>`).join("\n");
}

function activitiesPage(city) {
  const l = links(city);
  const cityAgePages = agePages.filter((page) => page.slug === city.slug);
  const ageLinks = cityAgePages.length
    ? `      <section class="band">
        <div class="container card-grid">
${cityAgePages.map((page) => `          <article class="activity-card">
            <h3>${esc(city.name)} with ${esc(page.age)}</h3>
            <p>Focused planning for age-specific pacing, activity fit, weather backups, and family logistics.</p>
            <p><a class="text-link" href="./${city.slug}-with-${page.age}.html">Open the ${esc(page.age)} activity guide</a></p>
          </article>`).join("\n")}
        </div>
      </section>
`
    : "";
  const body = `${hero(city, `Things to do in ${city.name} with kids`, city.intro)}
      <section class="band intro-band">
        <div class="container answer-grid">
          <div>
            <p class="eyebrow">Planning stance</p>
            <h2>Pick one anchor activity per day</h2>
            <p>These lists are designed for realistic family pacing: one main outing, one flexible backup, and enough space for meals, transit, hotel breaks, and kid moods.</p>
          </div>
          <dl class="snapshot">
            <div><dt>Best toddler ideas</dt><dd>${esc(city.toddlerFocus.slice(0, 2).join(", "))}</dd></div>
            <div><dt>Best teen ideas</dt><dd>${esc(city.teenFocus.slice(0, 2).join(", "))}</dd></div>
            <div><dt>Stay planning</dt><dd><a href="${l.stay}">Best areas to stay with kids</a></dd></div>
            <div><dt>Route planning</dt><dd><a href="${l.itinerary}">Turn these into an itinerary</a></dd></div>
          </dl>
        </div>
      </section>
      <section class="container page-section">
        <div class="section-heading">
          <p class="eyebrow">Activity filters</p>
          <h2>Kid-friendly activities by age, pace, and weather</h2>
        </div>
        <div class="filter-bar" aria-label="Activity filters">
          <button class="chip active" type="button" data-filter="all">All</button>
          <button class="chip" type="button" data-filter="baby">Baby</button>
          <button class="chip" type="button" data-filter="toddler">Toddler</button>
          <button class="chip" type="button" data-filter="preschool">Preschool</button>
          <button class="chip" type="button" data-filter="elementary">Elementary</button>
          <button class="chip" type="button" data-filter="tween">Tween</button>
          <button class="chip" type="button" data-filter="teen">Teen</button>
          <button class="chip" type="button" data-filter="rain">Rain</button>
        </div>
        <div class="activity-grid">
${activityCards(city)}
        </div>
        <script type="application/json" id="map-ready-activities">${JSON.stringify(city.activities.map(([name, tags, time, cost, stroller, rain, nap, area, summary]) => ({ name, tags: tags.split(" "), time, cost, stroller, rain, nap, area, summary })))}</script>
      </section>
${ageLinks}
${sourceList(city)}
    </main>`;
  return pageShell({
    title: `Things to Do in ${city.name} With Kids by Age`,
    description: `Plan things to do in ${city.name} with kids using age filters, stroller notes, rainy-day backups, nap-friendly pacing, and area context.`,
    canonical: `things-to-do/${city.slug}-with-kids.html`,
    nav: [[l.stay, "Where to stay"], [l.itinerary, "Itinerary"], ["#top", city.metaName]],
    body,
    script: true
  });
}

function stayPage(city) {
  const l = links(city);
  const rows = city.areas.map(([area, best, watch, fit]) => `            <div class="table-row" role="row">
              <span role="cell">${esc(area)}</span>
              <span role="cell">${esc(best)}</span>
              <span role="cell">${esc(watch)}</span>
              <span role="cell">${esc(fit)}</span>
            </div>`).join("\n");
  const body = `${hero(city, `Where to stay in ${city.name} with kids`, `Compare the best family areas in ${city.name} by stroller ease, room size risk, parking, walkability, noise, pool access, and attraction proximity.`)}
      <section class="band intro-band">
        <div class="container answer-grid">
          <div>
            <p class="eyebrow">Family base</p>
            <h2>Start with the area, then shortlist hotels</h2>
            <p>Start with the area fit, then use the hotel checks below to compare room setup, parking, pool value, meal friction, and kid reset options before booking.</p>
          </div>
          <dl class="snapshot">
            <div><dt>Activity page</dt><dd><a href="${l.activities}">Activities near each area</a></dd></div>
            <div><dt>Itinerary page</dt><dd><a href="${l.itinerary}">Sample itinerary by area</a></dd></div>
            <div><dt>Booking check</dt><dd>Verify fees, room type, and cancellation terms</dd></div>
            <div><dt>Key checks</dt><dd>Parking, pool, breakfast, room size</dd></div>
          </dl>
        </div>
      </section>
      <section class="container page-section">
        <div class="section-heading">
          <p class="eyebrow">Area recommender</p>
          <h2>Best areas for families</h2>
        </div>
        <div class="area-table" role="table" aria-label="Where to stay in ${esc(city.name)} with kids">
          <div class="table-row table-head" role="row">
            <span role="columnheader">Area</span>
            <span role="columnheader">Best for</span>
            <span role="columnheader">Watch out for</span>
            <span role="columnheader">Family fit</span>
          </div>
${rows}
        </div>
      </section>
      <section class="band">
        <div class="container card-grid">
          <article class="activity-card"><h3>Family hotel shortlist</h3><p>Prioritize hotels that clearly publish room layout, crib or rollaway policy, parking cost, pool hours, breakfast setup, and cancellation terms.</p></article>
          <article class="activity-card"><h3>Stroller and transit notes</h3><p>Before committing to a no-car stay, check sidewalks, elevators, transit station access, hill difficulty, ride-share pickup points, and car-seat logistics for your exact area.</p></article>
          <article class="activity-card"><h3>Booking filters</h3><p>Prioritize family rooms or suites, breakfast, pool hours, laundry, parking cost, elevators, and walking distance to meals or transit.</p></article>
        </div>
      </section>
${sourceList(city)}
    </main>`;
  return pageShell({
    title: `Where to Stay in ${city.name} With Kids`,
    description: `Compare where to stay in ${city.name} with kids, including family-friendly areas, hotel decision factors, stroller notes, and attraction proximity.`,
    canonical: `where-to-stay/${city.slug}-with-kids.html`,
    nav: [[l.activities, "Things to do"], [l.itinerary, "Itinerary"], ["#top", city.metaName]],
    body
  });
}

function itineraryPage(city) {
  const l = links(city);
  const items = city.itinerary.map(([day, plan]) => `              <li><strong>${esc(day)}</strong><span>${esc(plan)}</span></li>`).join("\n");
  const twoDayItems = city.itinerary.slice(0, 2).map(([day, plan]) => `              <li><strong>${esc(day)}</strong><span>${esc(plan)}</span></li>`).join("\n");
  const body = `${hero(city, `${city.name} itinerary with kids`, `A starter family itinerary for ${city.name} with morning, afternoon, and evening pacing, rainy-day swaps, and age adjustments.`)}
      <section class="container page-section itinerary-layout">
        <div>
          <p class="eyebrow">3-day starter plan</p>
          <h2>Nap-friendly structure</h2>
          <ol class="timeline">
${items}
          </ol>
        </div>
        <div class="map-panel">
          <h3>Adjust by age</h3>
          <p>For toddlers, shorten the morning anchor and protect the post-lunch reset. For teens, swap one playground or short museum stop for a more independent neighborhood, food, tour, or outdoor activity.</p>
          <p class="note">Starter plan only. Adjust by season, weather, child needs, opening hours, transit access, and current closure or safety advisories.</p>
        </div>
      </section>
      <section class="band intro-band">
        <div class="container itinerary-layout">
          <div>
            <p class="eyebrow">2-day option</p>
            <h2>Condensed weekend plan</h2>
            <ol class="timeline">
${twoDayItems}
            </ol>
          </div>
          <div class="map-panel">
            <h3>Weekend rule</h3>
            <p>Skip one ambitious add-on and protect either the hotel reset or the easiest dinner. A two-day family trip works better when one activity is allowed to be optional.</p>
          </div>
        </div>
      </section>
      <section class="band">
        <div class="container card-grid">
          <article class="activity-card"><h3>Swap activities by age</h3><p>Use the <a href="${l.activities}">activity filters</a> to swap the anchor stop for toddlers, tweens, or teens.</p></article>
          <article class="activity-card"><h3>Choose the best base</h3><p>Use the <a href="${l.stay}">where-to-stay guide</a> before booking a hotel for this route.</p></article>
          <article class="activity-card"><h3>Rainy-day version</h3><p>Keep one indoor activity and one easy meal option in reserve rather than rebuilding the day from scratch.</p></article>
        </div>
      </section>
${sourceList(city)}
    </main>`;
  return pageShell({
    title: `${city.name} Itinerary With Kids: 2 and 3 Day Starter Plan`,
    description: `Build a ${city.name} itinerary with kids using nap-friendly pacing, rainy-day swaps, age adjustments, and links to activities and stay areas.`,
    canonical: `family-itinerary/${city.slug}-with-kids.html`,
    nav: [[l.activities, "Things to do"], [l.stay, "Where to stay"], ["#top", city.metaName]],
    body
  });
}

function agePage(city, age, signal) {
  const l = links(city);
  const isToddler = age === "toddlers";
  const focus = isToddler ? city.toddlerFocus : city.teenFocus;
  const body = `${hero(city, `Things to do in ${city.name} with ${age}`, `A focused activity guide for ${age} in ${city.name}, with the main kids guide kept as the broader planning hub.`)}
      <section class="band intro-band">
        <div class="container answer-grid">
          <div>
            <p class="eyebrow">${esc(age)} plan</p>
            <h2>${esc(isToddler ? "Shorter mornings, easier resets" : "More independence, fewer little-kid compromises")}</h2>
            <p>${esc(isToddler ? "Prioritize short travel times, stroller sanity, bathrooms, snacks, shade, and a protected nap or hotel reset." : "Prioritize activities with stronger payoff, food stops, scenery, shows, active options, and fewer nap-driven constraints.")}</p>
          </div>
          <dl class="snapshot">
            <div><dt>Top ideas</dt><dd>${esc(focus.slice(0, 3).join(", "))}</dd></div>
            <div><dt>All ages hub</dt><dd><a href="${l.activities}">All kid-friendly activities</a></dd></div>
            <div><dt>Where to stay</dt><dd><a href="${l.stay}">Best family areas</a></dd></div>
            <div><dt>Itinerary</dt><dd><a href="${l.itinerary}">Starter family route</a></dd></div>
          </dl>
        </div>
      </section>
      <section class="container page-section">
        <div class="section-heading">
          <p class="eyebrow">Shortlist</p>
          <h2>Best-fit activities for ${esc(age)}</h2>
        </div>
        <div class="activity-grid">
${activityCards(city, age)}
        </div>
      </section>
${sourceList(city)}
    </main>`;
  return pageShell({
    title: `Things to Do in ${city.name} With ${age[0].toUpperCase() + age.slice(1)}`,
    description: `Plan things to do in ${city.name} with ${age}, with age-fit activities, pacing notes, weather backups, and links to the broader family guide.`,
    canonical: `things-to-do/${city.slug}-with-${age}.html`,
    nav: [[l.activities, "All kids"], [l.stay, "Where to stay"], [l.itinerary, "Itinerary"]],
    body
  });
}

function writeSite(path, contents) {
  const full = join(outDir, path);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, contents);
}

function aboutPage() {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>How Family Tripwise Builds Family Travel Guides</title>
    <meta name="description" content="Learn how Family Tripwise researches family travel guides, including age fit, stroller friction, lodging base, weather backups, source checks, and update discipline.">
    <link rel="canonical" href="https://familytripwise.com/about.html">
    <link rel="stylesheet" href="./styles.css">
  </head>
  <body>
    <header class="site-header">
      <a class="brand" href="./index.html" aria-label="Family Tripwise home">
        <span class="brand-mark">FT</span>
        <span>Family Tripwise</span>
      </a>
      <nav aria-label="Destination guides">
${staticNav("./")}
      </nav>
    </header>
    <main>
      <section class="page-hero">
        <div class="container">
          <p class="eyebrow">Methodology</p>
          <h1>How Family Tripwise builds family travel guides</h1>
          <p>Family travel advice gets useful when it stops treating every family like the same group of adults with smaller shoes. Our guides focus on age fit, pace, stroller friction, weather backup, nap timing, lodging base, and the small logistics that decide whether a day works.</p>
        </div>
      </section>
      <section class="container trust-panel about-summary" aria-label="Review status">
        <p><strong>Last updated:</strong> July 5, 2026</p>
        <p><strong>Current scope:</strong> Family Tripwise is running a focused 5-city test before expanding. We update pages as search data, official sources, and firsthand notes improve.</p>
      </section>
      <section class="container page-section methodology-section">
        <div class="section-heading">
          <p class="eyebrow">What we evaluate</p>
          <h2>Family logistics come first</h2>
        </div>
        <div class="methodology-grid">
          <article class="method-card"><h3>Age fit</h3><p>We separate toddler, elementary, tween, and teen fit because the same attraction can be perfect for one kid and exhausting for another.</p></article>
          <article class="method-card"><h3>Stroller friction</h3><p>We flag hills, sand, stairs, crowds, long indoor corridors, subway elevators, and walking routes that can turn a simple outing into a project.</p></article>
          <article class="method-card"><h3>Nap and reset value</h3><p>We favor plans with realistic morning anchors, easy meals, hotel resets, and optional afternoon stops instead of overstuffed sightseeing days.</p></article>
          <article class="method-card"><h3>Weather backup</h3><p>We look for indoor or mixed-weather alternatives that can be swapped in without rebuilding the entire day.</p></article>
          <article class="method-card"><h3>Lodging base</h3><p>For stay pages, we start with area tradeoffs before hotel names: noise, walkability, parking, transit, pool value, room size, and nearby meals.</p></article>
          <article class="method-card"><h3>Pairing nearby</h3><p>We group attractions that make sense together so families avoid crossing a city twice with tired kids.</p></article>
        </div>
      </section>
      <section class="band intro-band">
        <div class="container answer-grid">
          <div>
            <p class="eyebrow">Source discipline</p>
            <h2>What we check before publishing</h2>
            <p>Each upgraded guide includes official source links for attraction planning, hotel policies, ticketing, parking, accessibility, and photo licensing where relevant. We use those sources to shape planning notes, then keep change-sensitive claims cautious.</p>
          </div>
          <dl class="snapshot">
            <div><dt>Official sources</dt><dd>Attractions, hotels, parks, transit, and destination organizations.</dd></div>
            <div><dt>Search input</dt><dd>SEO research helps choose pages, but does not replace useful planning detail.</dd></div>
            <div><dt>Images</dt><dd>Licensed or public-domain images only; no generated travel photos.</dd></div>
            <div><dt>Update checks</dt><dd>Hotel fees, hours, policies, and closures should be verified before booking.</dd></div>
          </dl>
        </div>
      </section>
      <section class="container page-section methodology-section">
        <div class="section-heading">
          <p class="eyebrow">Limits</p>
          <h2>What our guides are not</h2>
        </div>
        <div class="methodology-grid">
          <article class="method-card"><h3>Not a guarantee</h3><p>Opening hours, resort fees, pool rules, parking costs, and transit conditions can change quickly. Always verify the details that matter for your trip before paying.</p></article>
          <article class="method-card"><h3>Not medical or safety advice</h3><p>We can flag planning friction, but families should use official advisories and their own judgment for health, safety, mobility, and accessibility needs.</p></article>
          <article class="method-card"><h3>Not a personal trip diary</h3><p>When a page is research-based rather than firsthand, we keep the language practical and source-backed instead of pretending we personally tested every stop.</p></article>
        </div>
      </section>
    </main>
    <footer class="site-footer">
      <p>Family Tripwise uses research-based planning notes. Hotel fees, hours, policies, closures, and transit conditions can change, so verify important details before booking.</p>
      <p><a href="./about.html">How our family travel guides are built</a></p>
    </footer>
  </body>
</html>
`;
}

for (const city of cities) {
  writeSite(`things-to-do/${city.slug}-with-kids.html`, activitiesPage(city));
  writeSite(`where-to-stay/${city.slug}-with-kids.html`, stayPage(city));
  writeSite(`family-itinerary/${city.slug}-with-kids.html`, itineraryPage(city));
}

for (const page of agePages) {
  const city = cities.find((item) => item.slug === page.slug);
  writeSite(`things-to-do/${page.slug}-with-${page.age}.html`, agePage(city, page.age, page.volume));
}

writeSite("about.html", aboutPage());

const oldRedirects = [
  ["san-diego-with-kids.html", "things-to-do/san-diego-with-kids.html", "Things to do in San Diego with kids"],
  ["san-diego-things-to-do-with-kids.html", "things-to-do/san-diego-with-kids.html", "Things to do in San Diego with kids"],
  ["san-diego-where-to-stay-with-kids.html", "where-to-stay/san-diego-with-kids.html", "Where to stay in San Diego with kids"]
];

for (const [path, target, title] of oldRedirects) {
  writeSite(path, `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="refresh" content="0; url=./${target}">
    <title>${esc(title)}</title>
    <link rel="canonical" href="https://familytripwise.com/${target}">
  </head>
  <body>
    <p><a href="./${target}">${esc(title)}</a></p>
  </body>
</html>
`);
}

writeSite("index.html", `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Family Tripwise: Family Travel Planning by City</title>
    <meta name="description" content="Family Tripwise helps parents plan where to stay, what to do, and realistic itineraries with kids.">
    <link rel="canonical" href="https://familytripwise.com/">
    <link rel="stylesheet" href="./styles.css">
  </head>
  <body>
    <header class="site-header">
      <a class="brand" href="./index.html" aria-label="Family Tripwise home">
        <span class="brand-mark">FT</span>
        <span>Family Tripwise</span>
      </a>
      <nav aria-label="Destination guides">
${staticNav("./")}
      </nav>
    </header>
    <main>
      <section class="page-hero">
        <div class="container">
          <p class="eyebrow">Family travel planning</p>
          <h1>Plan better trips with kids</h1>
          <p>Choose family-friendly activities, areas to stay, and starter itineraries by city, age, stroller difficulty, weather, and trip pace.</p>
        </div>
      </section>
      <section class="container page-section">
        <div class="section-heading">
          <p class="eyebrow">First city clusters</p>
          <h2>Destination guides</h2>
        </div>
        <div class="card-grid">
${cities.map((city) => `          <article class="activity-card">
            <h3>${esc(city.name)} with kids</h3>
            <p>${esc(city.intro)}</p>
            <dl>
              <div><dt>Activities</dt><dd><a href="./things-to-do/${city.slug}-with-kids.html">Things to do</a></dd></div>
              <div><dt>Stay</dt><dd><a href="./where-to-stay/${city.slug}-with-kids.html">Where to stay</a></dd></div>
              <div><dt>Plan</dt><dd><a href="./family-itinerary/${city.slug}-with-kids.html">Itinerary</a></dd></div>
            </dl>
          </article>`).join("\n")}
        </div>
      </section>
    </main>
    <footer class="site-footer">
      <p>Family Tripwise uses research-based planning notes. Hotel fees, hours, policies, closures, and transit conditions can change, so verify important details before booking.</p>
      <p><a href="./about.html">How our family travel guides are built</a></p>
    </footer>
  </body>
</html>
`);

writeSite("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://familytripwise.com/</loc></url>
  <url><loc>https://familytripwise.com/about.html</loc></url>
${cities.flatMap((city) => [
  `  <url><loc>https://familytripwise.com/things-to-do/${city.slug}-with-kids.html</loc></url>`,
  `  <url><loc>https://familytripwise.com/where-to-stay/${city.slug}-with-kids.html</loc></url>`,
  `  <url><loc>https://familytripwise.com/family-itinerary/${city.slug}-with-kids.html</loc></url>`
]).join("\n")}
${agePages.map((page) => `  <url><loc>https://familytripwise.com/things-to-do/${page.slug}-with-${page.age}.html</loc></url>`).join("\n")}
</urlset>
`);

upgradePriorityPages(outDir);

console.log("Generated 20 SEO pages plus about, index, redirects, and sitemap.");
