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
    activitySources: [
      ["San Diego Zoo plan your visit", "https://zoo.sandiegozoo.org/plan-your-visit"],
      ["Birch Aquarium plan your visit", "https://aquarium.ucsd.edu/plan-your-visit"],
      ["Balboa Park visitor info", "https://balboapark.org/"],
      ["Coronado Ferry info", "https://coronadoferrylanding.com/ferry-info/"],
      ["SeaWorld San Diego park info", "https://seaworld.com/san-diego/park-info/"],
      ["LEGOLAND California plan your visit", "https://www.legoland.com/california/plan-your-visit/"],
      ["San Diego Zoo Safari Park plan your visit", "https://sandiegozoo.org/app/p/"],
      ["The New Children's Museum plan your visit", "https://thinkplaycreate.org/visit/"],
      ["The New Children's Museum current notices", "https://thinkplaycreate.org/"],
      ["Fleet Science Center hours and admission", "https://www.fleetscience.org/hours-admission"],
      ["Belmont Park", "https://www.belmontpark.com/"]
    ],
    areas: [
      ["Mission Bay", "Beach-and-reset research candidate", "Verify property access, exact routes, and fees", "Needs review"],
      ["La Jolla", "Coastal research candidate", "Verify slopes, crossings, parking, and property route", "Needs review"],
      ["Downtown / Little Italy", "Urban car-light research candidate", "Verify exact transit, sidewalks, room size, and noise", "Needs review"],
      ["Coronado", "Beach-first research candidate", "Verify off-island routes, beach access, and full price", "Needs review"],
      ["Mission Valley / Hotel Circle", "Central-base research candidate", "Verify property-level trolley, driving, and walking access", "Needs review"]
    ],
    activities: [
      ["San Diego Zoo", "toddler preschool elementary tween teen stroller", "4-6 hrs", "$$$", "Good", "No", "Medium", "Balboa Park", "Use the bus tour early, then choose a few zones instead of trying to finish the whole park."],
      ["Mission Bay beach morning", "baby toddler preschool stroller", "2-3 hrs", "$", "Mixed", "No", "High", "Mission Bay", "A calmer water and sand option for younger kids before naps or afternoon sun."],
      ["Balboa Park museums", "preschool elementary tween teen rain stroller", "2-4 hrs", "$$", "Good", "Yes", "Medium", "Balboa Park", "Pick one museum and add a playground or garden walk."],
      ["Birch Aquarium", "toddler preschool elementary rain stroller", "90 min", "$$", "Good", "Partial", "High", "La Jolla", "A manageable indoor/outdoor backup with ocean views."],
      ["La Jolla Cove", "elementary tween teen", "2-4 hrs", "$", "Limited", "No", "Low", "La Jolla", "Great for older kids who can handle crowds, stairs, and uneven coastal paths."],
      ["Coronado ferry and waterfront", "preschool elementary tween teen stroller", "2-3 hrs", "$$", "Good", "No", "Medium", "Downtown / Coronado", "A scenic lower-effort outing from Downtown."],
      ["SeaWorld San Diego", "preschool elementary tween teen stroller", "full day", "$$$", "Good", "Partial", "Low", "Mission Bay", "A major paid day with animals, presentations, and rides; check height rules and the current show schedule."],
      ["LEGOLAND California", "toddler preschool elementary", "full day", "$$$", "Good", "Partial", "Low", "Carlsbad", "Best for LEGO-focused younger children when the North County drive and a full park day fit the trip."],
      ["San Diego Zoo Safari Park", "preschool elementary tween teen", "full day", "$$$", "Mixed", "No", "Low", "Escondido", "A separate inland wildlife day, not an add-on to the San Diego Zoo."],
      ["The New Children's Museum", "toddler preschool elementary rain stroller", "2-3 hrs", "$$", "Good", "Yes", "High", "Downtown", "A hands-on Downtown anchor for younger kids; the museum announced a July 21-26, 2026 Comic-Con closure."],
      ["Fleet Science Center", "preschool elementary tween rain stroller", "2-4 hrs", "$$", "Good", "Yes", "Medium", "Balboa Park", "An interactive science and dome-theater option for a wet or hot part of the day."],
      ["Belmont Park", "elementary tween teen", "2-4 hrs", "$$-$$$", "Mixed", "Partial", "Low", "Mission Beach", "A flexible rides-and-boardwalk stop for older kids; pay and height rules vary by attraction."]
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
    activityH1: "Things to Do in Las Vegas With Kids: 12 Picks by Trip Style",
    activityTitle: "Things to Do in Las Vegas With Kids: 12 Picks by Trip Style",
    activityDescription: "Compare 12 things to do in Las Vegas with kids by age, heat and indoor fit, cost, time, location, and trip style, with current official-source checks.",
    activityIntro: "Choose one main family anchor, protect a pool or hotel reset, and use the filters to compare 12 distinct options without turning the Strip into a walking marathon.",
    activitiesLastUpdated: "July 22, 2026",
    activitySourceNote: "Official venue links are below. Age fit, duration, cost, stroller, weather, nap, booking, and value labels are Family Tripwise editorial estimates; recheck current attraction rules, hours, prices, and conditions before going.",
    activitySourceIntro: "Use these official pages to verify current hours, tickets, age or height rules, reservations, weather procedures, accessibility, and attraction policies before going.",
    compactActivityCards: true,
    activityFilters: [
      ["all", "All"],
      ["toddler", "Toddler"],
      ["elementary", "Elementary"],
      ["teen", "Teen"],
      ["indoor", "Indoor / heat"],
      ["budget", "Free / low cost"]
    ],
    activitySnapshot: [
      ["First Vegas trip", "Bellagio plus one age-fit anchor"],
      ["Younger kids / heat", "DISCOVERY, Shark Reef, or Adventuredome"],
      ["Older kids", "AREA15, Red Rock, a show, or Neon Museum"],
      ["Next planning step", "Choose the stay base and route", "../where-to-stay/las-vegas-with-kids.html"]
    ],
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
    activitySources: [
      ["Visit Las Vegas family guide", "https://www.visitlasvegas.com/experience/post/things-to-do-in-las-vegas-with-kids/"],
      ["Mandalay Bay Beach", "https://mandalaybay.mgmresorts.com/en/amenities/beach.html"],
      ["Fountains of Bellagio", "https://bellagio.mgmresorts.com/en/entertainment/fountains-of-bellagio.html"],
      ["Bellagio Conservatory", "https://bellagio.mgmresorts.com/en/entertainment/conservatory-botanical-garden.html"],
      ["DISCOVERY Children's Museum FAQ", "https://discoverykidslv.org/about/faq/"],
      ["Shark Reef Aquarium", "https://mandalaybay.mgmresorts.com/en/entertainment/shark-reef-aquarium.html"],
      ["Adventuredome", "https://www.circuscircus.com/attractions/adventuredome/"],
      ["Springs Preserve", "https://www.springspreserve.org/"],
      ["High Roller terms", "https://www.caesars.com/content/dam/lnq/Property/High-Roller/lnq-Property-High-Roller-T-and-C.pdf"],
      ["AREA15", "https://www.area15.com/"],
      ["Red Rock Canyon NCA", "https://www.blm.gov/programs/national-conservation-lands/nevada/red-rock-canyon"],
      ["Pinball Hall of Fame", "https://travelnevada.com/museums/pinball-hall-of-fame/"],
      ["Tournament of Kings", "https://excalibur.mgmresorts.com/en/entertainment/tournament-of-kings.html"],
      ["Neon Museum FAQ", "https://neonmuseum.org/faqs/"]
    ],
    areas: [
      ["Center Strip", "First-timers, shows, short access to major sights", "Crowds, smoke, long casino walks", "Good"],
      ["South Strip", "Mandalay Bay pool, value, airport access", "Farther from some attractions", "Great"],
      ["Summerlin / Red Rock", "Nature, calmer hotels, older kids", "Not a classic Strip stay", "Good"],
      ["Downtown / Fremont", "Budget and neon spectacle", "Noise and adult atmosphere", "Limited"]
    ],
    activities: [
      ["Resort pool / reset block", "baby toddler preschool elementary tween teen stroller", "Half day", "Varies", "Property-specific", "No", "High", "Your hotel", "Treat the pool as a trip block only after checking access, season, shade, closures, and exact property rules."],
      ["Bellagio Conservatory and fountains", "toddler preschool elementary tween teen stroller budget", "60-90 min", "Free", "Route-specific", "Partial", "Medium", "Center Strip", "A short first-trip visual stop; allow for crowds, display changes, and long resort approaches."],
      ["DISCOVERY Children's Museum", "toddler preschool elementary stroller indoor rain", "2-3 hrs", "Paid", "Check venue", "Yes", "High", "Downtown", "A child-centered indoor anchor for younger families; check the current calendar and admission."],
      ["Shark Reef Aquarium", "toddler preschool elementary tween teen stroller indoor rain", "90 min-2 hrs", "Paid", "Check venue", "Yes", "Medium", "South Strip", "A contained indoor animal stop with timed entry; plan the route through Mandalay Bay."],
      ["Adventuredome", "preschool elementary tween teen indoor rain", "2-4 hrs", "Paid", "Mixed", "Yes", "Low", "North Strip", "An indoor rides option where height splits, noise, closures, and stimulation shape the visit."],
      ["Springs Preserve", "toddler preschool elementary tween stroller indoor", "2-4 hrs", "Paid", "Mixed", "Partial", "Medium", "West of Downtown", "Combine museums, gardens, and play space, then adjust the outdoor portion for heat and current programs."],
      ["High Roller observation wheel", "elementary tween teen stroller indoor rain", "45-60 min", "Paid", "Check policy", "Yes", "Medium", "LINQ", "A contained skyline ride; check stroller handling and use restrooms before boarding."],
      ["AREA15 / selected exhibit", "tween teen indoor rain", "2-3 hrs", "Paid", "Exhibit-specific", "Yes", "Low", "Off Strip", "Choose an exact experience by age, sensory fit, duration, and total ticket cost before arriving."],
      ["Red Rock Canyon Scenic Drive", "elementary tween teen budget", "Half day", "Low cost", "Limited", "No", "Low", "West of Strip", "A desert half-day that requires a heat, weather, service, and seasonal timed-entry check."],
      ["Pinball Hall of Fame", "elementary tween teen indoor rain budget", "60-120 min", "Pay per play", "Mixed", "Yes", "Medium", "South Strip", "A flexible, easy-to-shorten arcade stop; machine availability and experience quality can vary."],
      ["Tournament of Kings", "preschool elementary tween teen indoor rain", "Evening", "Paid", "Venue-specific", "Yes", "Low", "South Strip", "An all-ages dinner show with horses and strong effects; check sensory, respiratory, meal, and timing fit."],
      ["Neon Museum", "elementary tween teen", "60-90 min", "Paid", "Limited", "No", "Low", "Downtown", "An outdoor Vegas-history stop whose timed visit can change with heat, wind, air quality, or storms."]
    ],
    agePageActivities: [
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

function updatedBlock(
  lastUpdated = "July 5, 2026",
  sourceNote
) {
  const reviewLine = sourceNote
    ? `<strong>Source note:</strong> ${esc(sourceNote)}`
    : "<strong>How this guide was built:</strong> Family Tripwise compares official attraction and hotel information, family logistics, search-intent research, and practical planning tradeoffs like age fit, stroller friction, weather backup, nap timing, walking distance, and lodging base.";
  return `      <section class="container trust-panel" aria-label="Review status">
        <p><strong>Last updated:</strong> ${esc(lastUpdated)}</p>
        <p>${reviewLine}</p>
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

function sourceList(
  city,
  selectedSources = city.sources,
  sourceIntro = "Use these official pages to verify current hours, ticketing, parking, accessibility, hotel fees, and policies before booking."
) {
  return `      <section class="container page-section source-section">
        <div class="section-heading">
          <p class="eyebrow">Sources checked</p>
          <h2>Official sources and licensing notes</h2>
        </div>
        <p>${esc(sourceIntro)}</p>
        <ul class="source-list">
${selectedSources.map(([label, href]) => `          <li><a href="${esc(href)}">${esc(label)}</a></li>`).join("\n")}
          <li><a href="${esc(city.photo.creditUrl)}">Photo license and attribution</a></li>
        </ul>
      </section>
`;
}

function sanDiegoSpecialistSources(city) {
  return [
    ...city.sources.slice(0, 4),
    ["San Diego County beach and bay status", "https://www.sandiegocounty.gov/content/sdc/deh/lwqd/beachandbay.html"]
  ];
}

function hero(city, h1, intro, lastUpdated, sourceNote) {
  return `    <main>
      <section class="page-hero">
        <div class="container">
          <p class="eyebrow">${esc(city.name)}, ${esc(city.state)}</p>
          <h1>${esc(h1)}</h1>
          <p>${esc(intro)}</p>
        </div>
      </section>
${updatedBlock(lastUpdated, sourceNote)}${cityPhoto(city)}
`;
}

function activityCards(city, filterAge) {
  const activitySource = filterAge && city.agePageActivities ? city.agePageActivities : city.activities;
  const activities = filterAge
    ? activitySource.filter((item) => item[1].includes(filterAge === "toddlers" ? "toddler" : "teen"))
    : activitySource;
  const ageTags = new Set(["baby", "toddler", "preschool", "elementary", "tween", "teen"]);
  const compact = city.compactActivityCards && !filterAge;
  return activities.map(([name, tags, time, cost, stroller, rain, nap, area, summary]) => `          <article class="activity-card" data-tags="${esc(tags)}">
            <h3>${esc(name)}</h3>
            <p>${esc(summary)}</p>
            <dl>
              <div><dt>Age fit</dt><dd>${esc(tags.split(" ").filter((tag) => !compact || ageTags.has(tag)).join(", "))}</dd></div>
              <div><dt>Time</dt><dd>${esc(time)}</dd></div>
              <div><dt>Cost</dt><dd>${esc(cost)}</dd></div>
              <div><dt>Area</dt><dd>${esc(area)}</dd></div>
${compact ? "" : `              <div><dt>Stroller</dt><dd>${esc(stroller)}</dd></div>
              <div><dt>Rainy day</dt><dd>${esc(rain)}</dd></div>
              <div><dt>Nap-friendly</dt><dd>${esc(nap)}</dd></div>
              <div><dt>Booking</dt><dd>Check ahead</dd></div>`}
            </dl>
          </article>`).join("\n");
}

function activitiesPage(city) {
  const l = links(city);
  const lastUpdated = city.activitiesLastUpdated || (city.slug === "san-diego" ? "July 21, 2026" : undefined);
  const sourceNote = city.activitySourceNote || (city.slug === "san-diego"
    ? "Official venue links are below. Age fit, duration, cost tier, stroller, weather, nap, and booking labels are Family Tripwise editorial estimates; check current conditions before going."
    : undefined);
  const activityFilters = city.activityFilters || [
    ["all", "All"], ["baby", "Baby"], ["toddler", "Toddler"], ["preschool", "Preschool"],
    ["elementary", "Elementary"], ["tween", "Tween"], ["teen", "Teen"], ["rain", "Rain"]
  ];
  const activitySnapshot = city.activitySnapshot || [
    ["Best toddler ideas", city.toddlerFocus.slice(0, 2).join(", ")],
    ["Best teen ideas", city.teenFocus.slice(0, 2).join(", ")],
    ["Stay planning", "Best areas to stay with kids", l.stay],
    ["Route planning", "Turn these into an itinerary", l.itinerary]
  ];
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
  const body = `${hero(city, city.activityH1 || `Things to do in ${city.name} with kids`, city.activityIntro || city.intro, lastUpdated, sourceNote)}
      <section class="band intro-band">
        <div class="container answer-grid">
          <div>
            <p class="eyebrow">Planning stance</p>
            <h2>Pick one anchor activity per day</h2>
            <p>These lists are designed for realistic family pacing: one main outing, one flexible backup, and enough space for meals, transit, hotel breaks, and kid moods.</p>
          </div>
          <dl class="snapshot">
${activitySnapshot.map(([label, value, href]) => `            <div><dt>${esc(label)}</dt><dd>${href ? `<a href="${esc(href)}">${esc(value)}</a>` : esc(value)}</dd></div>`).join("\n")}
          </dl>
        </div>
      </section>
      <section class="container page-section">
        <div class="section-heading">
          <p class="eyebrow">Activity filters</p>
          <h2>Kid-friendly activities by age, pace, and weather</h2>
        </div>
        <div class="filter-bar" aria-label="Activity filters">
${activityFilters.map(([filter, label], index) => `          <button class="chip${index === 0 ? " active" : ""}" type="button" data-filter="${esc(filter)}">${esc(label)}</button>`).join("\n")}
        </div>
        <div class="activity-grid">
${activityCards(city)}
        </div>
        <script type="application/json" id="map-ready-activities">${JSON.stringify(city.activities.map(([name, tags, time, cost, stroller, rain, nap, area, summary]) => ({ name, tags: tags.split(" "), time, cost, stroller, rain, nap, area, summary })))}</script>
      </section>
${ageLinks}
${sourceList(city, city.activitySources || city.sources, city.activitySourceIntro)}
    </main>`;
  return pageShell({
    title: city.activityTitle || `Things to Do in ${city.name} With Kids by Age`,
    description: city.activityDescription || `Plan things to do in ${city.name} with kids using age filters, stroller notes, rainy-day backups, nap-friendly pacing, and area context.`,
    canonical: `things-to-do/${city.slug}-with-kids.html`,
    nav: [[l.stay, "Where to stay"], [l.itinerary, "Itinerary"], ["#top", city.metaName]],
    body,
    script: true
  });
}

function stayPage(city) {
  const l = links(city);
  const isSanDiego = city.slug === "san-diego";
  const isLasVegas = city.slug === "las-vegas";
  const isChicago = city.slug === "chicago";
  const hotelShortlistLink = isSanDiego
    ? '<a href="../where-to-stay/san-diego-family-hotels.html">12 family hotel options</a>'
    : isLasVegas
      ? '<a href="../where-to-stay/las-vegas-family-hotels.html">10 family hotel options</a>'
      : isChicago
        ? '<a href="../where-to-stay/chicago-family-hotels.html">10 family hotel options</a>'
        : "Parking, pool, breakfast, room size";
  const rows = city.areas.map(([area, best, watch, fit]) => `            <div class="table-row" role="row">
              <span role="cell">${esc(area)}</span>
              <span role="cell">${esc(best)}</span>
              <span role="cell">${esc(watch)}</span>
              <span role="cell">${esc(fit)}</span>
            </div>`).join("\n");
  const baseAreaSections = isSanDiego ? "" : `      <section class="container page-section">
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
`;
  const stayIntro = isSanDiego
    ? "Compare five San Diego areas by beach access, activity routes, car needs, hotel style, and midday-reset practicality, then move to a shortlist of specific hotels."
    : `Compare the best family areas in ${city.name} by stroller ease, room size risk, parking, walkability, noise, pool access, and attraction proximity.`;
  const sourceNote = isSanDiego
    ? "Area guidance uses official destination, transit, attraction, and hotel sources plus current San Diego lodging research. Exact routes and room conditions vary by property and date."
    : undefined;
  const body = `${hero(city, `Where to stay in ${city.name} with kids`, stayIntro, isSanDiego ? "July 20, 2026" : undefined, sourceNote)}
      <section class="band intro-band">
        <div class="container answer-grid">
          <div>
            <p class="eyebrow">Family base</p>
            <h2>${isSanDiego ? "Choose the base that matches the trip" : "Start with the area, then shortlist hotels"}</h2>
            <p>${isSanDiego ? "Use this page to choose between Mission Bay, La Jolla, Downtown/Little Italy, Coronado, and Mission Valley. Once two areas look plausible, compare the named properties on the hotel page." : "Start with the area fit, then use the hotel checks below to compare room setup, parking, pool value, meal friction, and kid reset options before booking."}</p>
          </div>
          <dl class="snapshot">
            <div><dt>Activity page</dt><dd><a href="${l.activities}">Activities near each area</a></dd></div>
            <div><dt>Itinerary page</dt><dd><a href="${l.itinerary}">Sample itinerary by area</a></dd></div>
            <div><dt>Booking check</dt><dd>Verify fees, room type, and cancellation terms</dd></div>
            <div><dt>${isSanDiego || isChicago ? "Hotel shortlist" : "Key checks"}</dt><dd>${hotelShortlistLink}</dd></div>
          </dl>
        </div>
      </section>
${baseAreaSections}
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

const sanDiegoFamilyHotels = [
  {
    name: "Bahia Resort Hotel",
    category: "Mission Bay suite/bay stay",
    area: "Mission Bay",
    priceRange: "$340-$630+",
    strengths: ["Family Suite facts are unusually visible", "One-vehicle parking is not a separate charge in the inspected FAQ", "Bay/pool/location positives recur in online review patterns"],
    tradeoffs: ["Bedding wording conflicts on the official Family Suite page", "Room age and cleanliness comments are mixed"],
    familySetup: "Official Bay Family Suite page lists 675 sq ft, sofa bed, kitchenette, balcony, two bathrooms, refrigerator, microwave, toaster, and one-vehicle self-parking; verify exact bedding and occupancy before using this as the reason to book.",
    priceNote: "Standard-room public examples; Family Suite can price higher.",
    reviewSignal: "Family positives around bay, pool, location, and staff; conflicts around room age, cleanliness, and room-to-room variability.",
    parentCheck: "Verify Family Suite availability, exact bedding, room condition, crib/rollaway policy, total price, room location, and current pool/beach operations.",
    mapQuery: "Bahia Resort Hotel San Diego",
    sources: ["BAH-1", "BAH-2", "BAH-P", "BAH-R"]
  },
  {
    name: "San Diego Mission Bay Resort",
    category: "Mission Bay pool/wading-pool resort",
    area: "Mission Bay",
    priceRange: "$375-$500+",
    strengths: ["Waterfront pool and shallow wading-pool facts are official", "Beach access and seasonal activities fit a stay-put resort question", "Good contrast against suite/kitchen urban hotels"],
    tradeoffs: ["Parking and resort fee add up quickly", "Online review patterns include crowding, beds, maintenance, and room-location noise conflicts"],
    familySetup: "Official materials list pool, shallow wading pool, beach access, seasonal activities, and rollaways where available subject to fire-code limits; exact family room layout remains room-specific.",
    priceNote: "Public examples before family room choice; parking can move the total.",
    reviewSignal: "Pool and bay positives, with conflicts around crowding, comfort, maintenance, room condition, and room-location/noise variability.",
    parentCheck: "Verify exact room/floor access, total price with parking, current pool/wading-pool operations, activity calendar, bedding requests, and cancellation terms.",
    mapQuery: "San Diego Mission Bay Resort",
    sources: ["MBR-1", "MBR-2", "MBR-P", "MBR-R"]
  },
  {
    name: "Hyatt Regency Mission Bay Spa and Marina",
    category: "Pool/waterslide-first stay",
    area: "Mission Bay",
    priceRange: "$270-$350+",
    strengths: ["Official pages list lagoon-style pools, three waterslides, hot tub, and separate children's pool area", "Room pages expose minifridge, play-yard, rollaway, and microwave-request details", "Kid enjoyment and waterslides recur in online review patterns"],
    tradeoffs: ["Official parking dollar amount was not found in the inspected pages", "Fee/value, pool temperature/size, and room variability appear in conflicts"],
    familySetup: "Official room pages list two-queen options, suites, minifridges, play yards on request, and microwaves on request for a fee in many room descriptions.",
    priceNote: "Public examples; parking amount still needs a fresh direct check.",
    reviewSignal: "Waterslide, pool, location, suite/space, and kid-enjoyment positives; conflicts around fees, parking friction, room/value variability, and immediate-area walkability.",
    parentCheck: "Verify current parking cost, waterslide height/hour rules, exact suite or room bedding, final total, cancellation, and room location relative to pool/elevator/event areas.",
    mapQuery: "Hyatt Regency Mission Bay Spa and Marina",
    sources: ["HY-1", "HY-2", "HY-3", "HY-P", "HY-R"]
  },
  {
    name: "Paradise Point Resort & Spa",
    category: "Stay-put Mission Bay resort",
    area: "Mission Bay",
    priceRange: "$240-$360+",
    strengths: ["Official amenities describe five heated pools, beach areas, marina, sports courts, miniature golf, and seasonal activities", "Large-property resort shape may help families who want to stay on property", "Multiple-pool and family-orientation positives recur"],
    tradeoffs: ["Large footprint may be helpful or annoying depending on kid age and assigned room", "Price/fee perception and room-condition variability appear in conflicts"],
    familySetup: "Bungalow-style rooms and suites need exact room verification; do not infer family layout from the property style alone.",
    priceNote: "Public examples; larger rooms, bayfront location, and parking can move higher.",
    reviewSignal: "Family orientation, multiple pools, spacious rooms, beach access, and resort-village positives; conflicts around total price, amenity value, property scale, and room condition.",
    parentCheck: "Verify room location, total with parking, current pool/restaurant/activity operations, room condition, and any active redevelopment, renovation, or property-name change before booking.",
    mapQuery: "Paradise Point Resort San Diego",
    sources: ["PP-1", "PP-P", "PP-R"]
  },
  {
    name: "Catamaran Resort Hotel and Spa",
    category: "Pacific Beach bay/beach walkability",
    area: "Pacific Beach",
    priceRange: "$395-$740+",
    strengths: ["Official pages expose studios/suites with kitchenettes and some sofa-bed language", "Bay/beach access and Pacific Beach dining can fit families who want a walkable coastal base", "Location positives recur in online review patterns"],
    tradeoffs: ["Cribs and rollaways are request-only and not guaranteed", "Older/musty-room and small-pool conflicts appear in public signals"],
    familySetup: "Official FAQ lists kitchenettes with mini refrigerator, microwave, toaster oven, and requestable kitchen items for some studios/suites; exact sofa-bed and building status need verification.",
    priceNote: "Public examples; room view, renovation status, and weekend dates can move a lot.",
    reviewSignal: "Bay/beach location, Pacific Beach convenience, pool/arcade, tropical grounds, and family beach practicality positives; conflicts around older rooms, mustiness, pool size, and resort-value expectations.",
    parentCheck: "Verify exact room/building/renovation status, parking, room layout, sofa-bed availability, crib/rollaway handling, pool/beach operations, noise exposure, and final total.",
    mapQuery: "Catamaran Resort Hotel and Spa San Diego",
    sources: ["CAT-1", "CAT-2", "CAT-P", "CAT-R"]
  },
  {
    name: "Homewood Suites San Diego Downtown/Bayside",
    category: "Suite/kitchen downtown base",
    area: "Downtown / Little Italy",
    priceRange: "$265-$350+",
    strengths: ["Official Hilton page lists all-suite rooms, in-room kitchens, free hot breakfast, connecting rooms, and cribs", "Good contrast for families who need kitchen/breakfast more than resort amenities", "Lower rough range than many resort options"],
    tradeoffs: ["No self-parking and $65 valet create car friction", "Breakfast variety/staffing, parking, noise, and maintenance appear in conflicts"],
    familySetup: "Official Hilton page lists all-suite setup, in-room kitchens, connecting rooms, cribs, outdoor pool, and nearby distance facts; exact suite walls, doors, bedding, and occupancy still need verification.",
    priceNote: "Public examples; valet cost matters if you keep a car.",
    reviewSignal: "Suite, breakfast, location, pool/workout area, and family-friendly lobby positives; conflicts around valet cost, breakfast consistency, parking friction, noise, and maintenance.",
    parentCheck: "Verify exact suite layout, occupancy, final total with valet, breakfast hours/menu, pool availability, valet wait/oversize rules, routes to first activities, and room-noise request.",
    mapQuery: "Homewood Suites San Diego Downtown Bayside",
    sources: ["HWS-1", "HWS-P", "HWS-R"]
  },
  {
    name: "LEGOLAND Hotel or Castle Hotel",
    category: "LEGOLAND-heavy North County trip",
    area: "Carlsbad / LEGOLAND",
    priceRange: "Package-priced",
    strengths: ["Official pages list themed rooms, kids sleeping area, breakfast, pool, entertainment, and in-room treasure hunt", "Can reduce morning friction when LEGOLAND is the core trip", "Strong child-theme positives appear in online review patterns"],
    tradeoffs: ["Not a clean San Diego city-base for zoo, Mission Bay, Downtown, or La Jolla days", "Package/per-person pricing must not be compared as a plain room rate"],
    familySetup: "Official pages list separate kids sleeping area in every room, Pack 'N Plays by request, and room capacity by exact room size.",
    priceNote: "Compare room, tickets, breakfast, and parking as one family total.",
    reviewSignal: "Child-theme, bunk/kids sleeping areas, breakfast convenience, activities, and park proximity positives; conflicts around value, parking cost, food quality, and whether more than one or two nights is worth it.",
    parentCheck: "Compare room-total versus package-per-person total, tickets, parking, exact capacity, breakfast crowding, pool hours, early-access rules, cancellation, and whether North County fits the rest of the itinerary.",
    mapQuery: "LEGOLAND Hotel California Carlsbad",
    sources: ["LEG-1", "LEG-2", "LEG-P", "LEG-R"]
  },
  {
    name: "Loews Coronado Bay Resort",
    category: "Coronado bay/splurge option",
    area: "Coronado",
    priceRange: "$235-$360+",
    strengths: ["Official materials describe a waterfront Coronado resort with heated pools", "Shuttle by reservation/request can matter for Coronado Village plans", "Pool/service/family amenity positives recur in online review patterns"],
    tradeoffs: ["More isolated from Coronado Village and San Diego attractions than central bases", "Parking/fees and property-condition comments appear in conflicts"],
    familySetup: "Exact room layout, connecting-room, occupancy, and family-package terms are offer/room-specific and require direct verification.",
    priceNote: "Public examples; room view, season, parking, and Coronado logistics can move the total.",
    reviewSignal: "Pool, service, family amenities, toddler/family pool enjoyment, children's pool, crib, laundry, and supervised-activity positives; conflicts around isolation, parking/fees, and property condition.",
    parentCheck: "Verify final total with parking, shuttle hours/reservation process, room/suite layout, pool/kids-program status, driving plan, and whether isolation helps or hurts the family.",
    mapQuery: "Loews Coronado Bay Resort",
    sources: ["LOEWS-1", "LOEWS-P", "LOEWS-R"]
  },
  {
    name: "La Jolla Shores Hotel",
    category: "La Jolla beachfront stay",
    area: "La Jolla Shores",
    priceRange: "$350-$550+",
    strengths: ["Beachfront location creates a distinct La Jolla trip shape", "Official room pages expose suites and limited kitchen or kitchenette setups", "Beach, location, staff, and refreshed-room positives recur in online review patterns"],
    tradeoffs: ["Current pool/deck and construction status can materially change the stay", "Official policy pages have recently conflicted on parking amounts"],
    familySetup: "Official room pages show two-queen rooms plus selected suites with sofa beds, kitchenettes, or a full kitchen; verify the exact room name because those features are not property-wide.",
    priceNote: "Recent OTA examples displayed roughly $400-$450 including taxes and fees for selected one-night dates; larger rooms and peak dates can move much higher.",
    reviewSignal: "Beach access, location, staff, and refreshed-room positives recur; construction, amenity availability, fees, and room-condition variability appear in conflicts.",
    parentCheck: "Verify current pool/deck and construction status, exact room kitchen and bedding, parking, final total, and cancellation terms.",
    mapQuery: "La Jolla Shores Hotel",
    sources: ["LJS-OFFICIAL-ROOMS", "LJS-OFFICIAL-FAQ", "LJS-OFFICIAL-POLICY", "LJS-PRICE-EXPEDIA", "LJS-REVIEWS-EXPEDIA", "LJS-REVIEWS-TRIPADVISOR"]
  },
  {
    name: "Hotel del Coronado",
    category: "Iconic Coronado beachfront splurge",
    area: "Coronado Beach",
    priceRange: "$600-$900+",
    strengths: ["Official materials expose multiple room neighborhoods and guaranteed connecting-room selection or request", "Cribs, select rollaways, heated pools, beach experiences, and an ages 4-12 kids program are documented", "Beach, setting, history, and resort-experience positives recur"],
    tradeoffs: ["The five room neighborhoods do not offer the same room or pool experience", "Crowding and value are recurring conflicts at a very high total price"],
    familySetup: "Standard neighborhoods offer rooms and suites, while Shore House and Beach Village include larger residence-style options; Shore House villas have one to three bedrooms, living areas, and full kitchens. Cribs are complimentary and rollaways fit select room types.",
    priceNote: "A recent OTA example displayed about $619 including taxes and fees for one night; premium dates, views, villas, parking, and larger family layouts can move far higher.",
    reviewSignal: "Beach, setting, history, pools, and the resort experience recur positively; room-neighborhood fit, crowding, service consistency, and value recur as conflicts.",
    parentCheck: "Choose the exact neighborhood and room first, then verify pool access, connecting-room handling, final total with parking, kids-program schedule, and cancellation terms.",
    mapQuery: "Hotel del Coronado",
    sources: ["DEL-OFFICIAL-FAQ", "DEL-OFFICIAL-STAY", "DEL-OFFICIAL-SHORE-HOUSE", "DEL-PRICE-EXPEDIA", "DEL-REVIEWS-EXPEDIA", "DEL-REVIEWS-TRIPADVISOR"]
  },
  {
    name: "The Dana on Mission Bay",
    category: "Simpler Mission Bay family base",
    area: "Mission Bay",
    priceRange: "$250-$400+",
    strengths: ["Official pages publish two heated pools, exact room capacities, and many suite layouts", "Crib, rollaway, connecting-room, refrigerator, microwave, parking, and resort-fee details are unusually clear", "Location, pools, grounds, and family-activity positives recur"],
    tradeoffs: ["There are no full kitchens", "Room condition, parking walks, and fee/value perception vary"],
    familySetup: "Standard rooms list a maximum occupancy of four; many junior suites and suites list up to six with sofa sleepers. All rooms can take a free crib, limited connecting rooms are request-only, and rooms include refrigerators and microwaves rather than kitchens.",
    priceNote: "Recent OTA examples displayed from the mid-$200s to about $325 including taxes and fees for selected one-night dates; suites and peak weekends can move higher.",
    reviewSignal: "Mission Bay location, pools, grounds, staff, and family activities recur positively; room size or condition, parking distance, and total-value concerns vary.",
    parentCheck: "Verify exact room layout and occupancy, final total with parking and resort fee, connecting request if needed, pool/activity schedule, and cancellation terms.",
    mapQuery: "The Dana on Mission Bay",
    sources: ["DANA-OFFICIAL-FAQ", "DANA-OFFICIAL-ROOMS", "DANA-PRICE-EXPEDIA", "DANA-REVIEWS-EXPEDIA", "DANA-REVIEWS-BOOKING", "DANA-REVIEWS-TRIPADVISOR"]
  },
  {
    name: "Manchester Grand Hyatt San Diego",
    category: "Downtown waterfront full-service stay",
    area: "Downtown / Seaport Village",
    priceRange: "$300-$450+",
    strengths: ["Official room pages publish connecting options and multiple family-suite layouts", "Downtown waterfront position fits Seaport Village and Embarcadero days", "Views, location, and large-hotel convenience recur positively"],
    tradeoffs: ["The second rooftop pool is under renovation and the official FAQ says only Coastline Pool is operating", "A large convention-hotel footprint and room renovation status can change the experience"],
    familySetup: "Official pages list a two-double connecting room, family suites with sleeper sofas or connecting bedrooms, minifridges, play yards on request, and microwaves in many suites; exact occupancy and connection still depend on room type.",
    priceNote: "Recent OTA examples displayed about $330-$340 including taxes and fees for one night; family suites, parking, and high-demand Downtown dates can move higher.",
    reviewSignal: "Bay views, Downtown access, rooms, and hotel scale recur positively; renovation status, pool expectations, club or service consistency, and value recur as conflicts.",
    parentCheck: "Verify a renovated room, exact connecting or suite setup, current pool access, destination fee, parking, final total, and cancellation terms.",
    mapQuery: "Manchester Grand Hyatt San Diego",
    sources: ["MGH-OFFICIAL-MAIN", "MGH-OFFICIAL-ROOMS", "MGH-OFFICIAL-FAQ", "MGH-OFFICIAL-RENOVATION", "MGH-PRICE-EXPEDIA", "MGH-REVIEWS-EXPEDIA", "MGH-REVIEWS-BOOKING", "MGH-REVIEWS-TRIPADVISOR"]
  }
];

const sanDiegoHotelSources = [
  ["Bahia Resort Hotel FAQ", "https://www.bahiahotel.com/faqs"],
  ["Bahia Bay Family Suite", "https://www.bahiahotel.com/rooms/bay-family-suite"],
  ["San Diego Mission Bay Resort amenities", "https://www.missionbayresort.com/resort-amenities/"],
  ["San Diego Mission Bay Resort FAQ", "https://www.missionbayresort.com/faq/"],
  ["Hyatt Regency Mission Bay", "https://www.hyatt.com/hyatt-regency/en-US/sanis-hyatt-regency-mission-bay-spa-and-marina"],
  ["Hyatt Mission Bay rooms", "https://www.hyatt.com/hyatt-regency/en-US/sanis-hyatt-regency-mission-bay-spa-and-marina/rooms"],
  ["Paradise Point amenities", "https://paradisepoint.com/resort/beach-resort-amenities/"],
  ["Catamaran Resort FAQ", "https://www.catamaranresort.com/faqs"],
  ["Catamaran rooms", "https://www.catamaranresort.com/rooms/rooms-overview"],
  ["Homewood Suites Downtown/Bayside", "https://www.hilton.com/en/hotels/sanhahw-homewood-suites-san-diego-downtown-bayside/"],
  ["LEGOLAND Hotel", "https://www.legoland.com/california/places-to-stay/legoland-hotel/"],
  ["LEGOLAND hotel parking support", "https://california-support.legoland.com/hc/en-us/articles/360001573591-Is-parking-included-with-my-stay-at-the-LEGOLAND-California-Hotel-or-Castle-Hotel"],
  ["Loews Coronado Bay Resort", "https://www.loewshotels.com/coronado-bay-resort"],
  ["La Jolla Shores Hotel accommodations", "https://www.ljshoreshotel.com/accommodations/"],
  ["La Jolla Shores Hotel resort policies", "https://www.ljshoreshotel.com/resort-policies/"],
  ["La Jolla Shores price and verified-review context", "https://www.expedia.com/La-Jolla-Hotels-La-Jolla-Shores-Hotel.h25973.Hotel-Information"],
  ["La Jolla Shores recent-review context", "https://www.tripadvisor.com/Hotel_Review-g32578-d217262-Reviews-La_Jolla_Shores_Hotel-La_Jolla_San_Diego_California.html"],
  ["Hotel del Coronado FAQ", "https://www.hoteldel.com/faq/"],
  ["Hotel del Coronado rooms", "https://www.hoteldel.com/stay/"],
  ["Hotel del Coronado price and verified-review context", "https://www.expedia.com/Coronado-Hotels-Hotel-Del-Coronado.h7496.Hotel-Information"],
  ["Hotel del Coronado recent-review context", "https://www.tripadvisor.com/Hotel_Review-g32250-d125137-Reviews-Hotel_Del_Coronado-Coronado_California.html"],
  ["The Dana on Mission Bay FAQ", "https://thedana.com/san-diego-hotel/faq/"],
  ["The Dana on Mission Bay rooms", "https://thedana.com/san-diego-accommodations/"],
  ["The Dana price and verified-review context", "https://www.expedia.com/San-Diego-Hotels-The-Dana-On-Mission-Bay.h40953.Hotel-Information"],
  ["The Dana recent-review context", "https://www.booking.com/reviews/us/hotel/the-dana-on-mission-bay.html"],
  ["The Dana additional review context", "https://www.tripadvisor.com/Hotel_Review-g60750-d83646-Reviews-The_Dana_on_Mission_Bay-San_Diego_California.html"],
  ["Manchester Grand Hyatt San Diego", "https://www.hyatt.com/grand-hyatt/en-US/sanrs-manchester-grand-hyatt-san-diego"],
  ["Manchester Grand Hyatt rooms", "https://www.hyatt.com/grand-hyatt/en-US/sanrs-manchester-grand-hyatt-san-diego/rooms"],
  ["Manchester Grand Hyatt FAQ", "https://www.hyatt.com/grand-hyatt/en-US/sanrs-manchester-grand-hyatt-san-diego/faqs"],
  ["Manchester Grand Hyatt renovation status", "https://www.hyatt.com/grand-hyatt/en-US/sanrs-manchester-grand-hyatt-san-diego/renovation"],
  ["Manchester Grand Hyatt price and verified-review context", "https://www.expedia.com/San-Diego-Hotels-Manchester-Grand-Hyatt-San-Diego.h12073.Hotel-Information"],
  ["Manchester Grand Hyatt recent-review context", "https://www.booking.com/reviews/us/hotel/manchester-grand-hyatt-san-diego.html"],
  ["Manchester Grand Hyatt additional review context", "https://www.tripadvisor.com/Hotel_Review-g60750-d80219-Reviews-Manchester_Grand_Hyatt_San_Diego-San_Diego_California.html"]
];

function googleMapsUrl(query) {
  return `https://www.google.com/maps/search/?api=1&amp;query=${encodeURIComponent(query)}`;
}

const sanDiegoMyMapsEmbedUrl = "https://www.google.com/maps/d/embed?mid=19tptDfcCGkrLLpofrO8ponPdeCefQKc&amp;ll=32.823313151707154%2C-117.28066802355525&amp;z=13";
const sanDiegoMyMapsViewUrl = "https://www.google.com/maps/d/viewer?mid=19tptDfcCGkrLLpofrO8ponPdeCefQKc&amp;ll=32.823313151707154%2C-117.28066802355525&amp;z=13";

function sanDiegoFamilyHotelPage() {
  const hotels = sanDiegoFamilyHotels;
  const hotelCards = hotels.map((hotel) => `          <article class="detail-card hotel-card">
            <p class="eyebrow">${esc(hotel.category)}</p>
            <h3>${esc(hotel.name)}</h3>
            <dl class="hotel-facts">
              <div><dt>Area</dt><dd>${esc(hotel.area)}</dd></div>
              <div><dt>Rough nightly range</dt><dd>${esc(hotel.priceRange)}</dd></div>
              <div><dt>Map</dt><dd><a href="${googleMapsUrl(hotel.mapQuery)}">Open in Google Maps</a></dd></div>
            </dl>
            <section><h4>Why it made the shortlist</h4><ul>${hotel.strengths.slice(0, 2).map((item) => `<li>${esc(item)}</li>`).join("")}</ul></section>
            <section><h4>Room and family setup</h4><p>${esc(hotel.familySetup)}</p></section>
            <section><h4>Themes in sampled online reviews</h4><p>${esc(hotel.reviewSignal)}</p></section>
            <section><h4>Price context and key check</h4><p>${esc(hotel.priceNote)} ${esc(hotel.parentCheck)}</p></section>
          </article>`).join("\n");

  const comparisonRows = hotels.map((hotel) => `              <tr>
                <td>${esc(hotel.name)}</td>
                <td>${esc(hotel.category)}</td>
                <td>${esc(hotel.area)}</td>
                <td>${esc(hotel.priceRange)}</td>
                <td><a href="${googleMapsUrl(hotel.mapQuery)}">Map</a></td>
                <td>${esc(hotel.parentCheck.split(".")[0])}.</td>
              </tr>`).join("\n");

  const itemListJson = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "San Diego family hotel options",
    itemListElement: hotels.map((hotel, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: hotel.name,
      description: `${hotel.category}; rough nightly range ${hotel.priceRange}`
    }))
  };

  const faqJson = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is the best family hotel in San Diego?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "There is no single best family hotel for every trip. Compare the room setup, pool/water value, rough nightly range, breakfast or kitchen needs, activity routes, and exact total for your dates before choosing."
        }
      },
      {
        "@type": "Question",
        name: "Should families stay near Mission Bay, Downtown, Coronado, or LEGOLAND?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Mission Bay can fit pool and bay-focused trips, Downtown or Little Italy can fit suite and urban-access trips, Coronado can fit a bay or splurge stay, and LEGOLAND-area hotels fit trips where the park is the main anchor. Exact hotel, route, price, and room checks still matter."
        }
      },
      {
        "@type": "Question",
        name: "Are the price ranges on this page booking quotes?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. They are rough public examples checked July 21, 2026. Families should verify the final all-in total, taxes, parking, breakfast, cancellation terms, and exact room type before booking."
        }
      }
    ]
  };

  const body = `    <main>
      <section class="page-hero hotel-hero">
        <div class="container">
          <p class="eyebrow">San Diego family hotels</p>
          <h1>Top Family Hotels in San Diego: 12 Options by Trip Style</h1>
          <p>Compare 12 San Diego family hotels by pool and beach access, room setup, breakfast or kitchen needs, approximate nightly price, location, and themes from sampled online reviews.</p>
        </div>
      </section>
      <section class="container trust-panel" aria-label="Review status">
        <p><strong>Hotel facts and review sources checked:</strong> July 21, 2026</p>
        <p>Approximate prices are planning ranges. Compare the final total for your dates, room type, occupancy, taxes, and parking before booking.</p>
      </section>
      <section class="container media-section">
        <figure class="licensed-photo">
          <img src="https://commons.wikimedia.org/wiki/Special:Redirect/file/21a-san-diego-mission-bay.jpg" alt="Mission Bay in San Diego viewed from above with bay water, islands, roads, and nearby neighborhoods." loading="eager" decoding="async">
          <figcaption>Photo: Alfred Twu, Wikimedia Commons, CC0. <a href="https://commons.wikimedia.org/wiki/File:21a-san-diego-mission-bay.jpg">License and source</a>.</figcaption>
        </figure>
      </section>
      <section class="band intro-band">
        <div class="container answer-grid">
          <div>
            <p class="eyebrow">Short answer</p>
            <h2>Start with the kind of trip you want</h2>
            <p>For Mission Bay water time, compare the six bay resorts by pool, room setup, and total price. Use La Jolla Shores for a beach-first La Jolla stay, Homewood or Manchester for two different Downtown bases, LEGOLAND hotels for a park-centered trip, and Hotel del or Loews for two very different Coronado stays.</p>
            <p><a class="text-link" href="../where-to-stay/san-diego-with-kids.html">Compare San Diego stay areas first</a></p>
          </div>
          <dl class="snapshot">
            <div><dt>Hotels covered</dt><dd>12 options</dd></div>
            <div><dt>Price format</dt><dd>Rough nightly range, not a quote</dd></div>
            <div><dt>Online reviews</dt><dd>Paraphrased themes from a small public sample</dd></div>
            <div><dt>Location view</dt><dd>Shared cluster map plus direct links for all 12 hotels</dd></div>
          </dl>
        </div>
      </section>
      <section class="container page-section rank-ready-section">
        <div class="section-heading">
          <p class="eyebrow">Category picks</p>
          <h2>Pick the closest trip style</h2>
        </div>
        <div class="quick-pick-grid hotel-pick-grid">
          <article class="quick-pick"><span>Mission Bay water time</span><strong>Six different stay shapes</strong><p>Start with Bahia for a family suite, Mission Bay Resort for a wading pool, Hyatt for waterslides, Paradise Point for scale, Catamaran for Pacific Beach access, or The Dana for clearer room-capacity details.</p></article>
          <article class="quick-pick"><span>Bay plus Pacific Beach</span><strong>Catamaran Resort</strong><p>Compare when bay access and nearby food matter, with careful room-building and nighttime-noise checks.</p></article>
          <article class="quick-pick"><span>Downtown base</span><strong>Homewood or Manchester Grand Hyatt</strong><p>Choose Homewood for suite, kitchen, and breakfast function; Manchester for a large full-service waterfront hotel, after checking renovation and pool status.</p></article>
          <article class="quick-pick"><span>LEGOLAND-heavy trip</span><strong>LEGOLAND Hotel/Castle</strong><p>Use when the park is the anchor; compare package, tickets, and parking as one total.</p></article>
          <article class="quick-pick"><span>Coronado resort trip</span><strong>Hotel del or Loews</strong><p>Choose Hotel del for the iconic beachfront experience or Loews for a more isolated bay resort; price the full stay before deciding.</p></article>
          <article class="quick-pick"><span>La Jolla beach trip</span><strong>La Jolla Shores Hotel</strong><p>Compare for direct beach access, but verify current construction, pool/deck operations, and the exact room setup.</p></article>
        </div>
      </section>
      <section class="band">
        <div class="container">
          <div class="section-heading">
            <p class="eyebrow">Comparison</p>
            <h2>Quick hotel comparison</h2>
          </div>
          <p class="review-label">Approximate nightly prices come from public examples checked July 21, 2026. Use them to set a budget, then compare the final total for the same dates and room setup.</p>
          <div class="comparison-scroll">
            <table class="comparison-table hotel-comparison">
              <thead><tr><th>Hotel</th><th>Best starting point for</th><th>Area</th><th>Approx. nightly price</th><th>Map</th><th>Most important check</th></tr></thead>
              <tbody>
${comparisonRows}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      <section class="container page-section">
        <div class="section-heading">
          <p class="eyebrow">Map check</p>
          <h2>Use the shared Google map to compare clusters</h2>
        </div>
        <div class="google-map-panel">
          <iframe class="google-my-map" title="Family Tripwise San Diego family hotels and kid activity map" src="${sanDiegoMyMapsEmbedUrl}" loading="lazy" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>
        </div>
        <p class="review-label">Use the shared map to understand the main hotel and activity clusters. The four newly added hotels may not yet appear as shared-map pins, so use each table row's direct hotel map link for the complete 12-hotel set.</p>
        <p><a class="text-link" href="${sanDiegoMyMapsViewUrl}">Open the full Google map</a></p>
      </section>
      <section class="container page-section">
        <div class="section-heading">
          <p class="eyebrow">Hotel cards</p>
          <h2>12 options, with the useful checks up front</h2>
        </div>
        <div class="detail-card-grid hotel-card-grid">
${hotelCards}
        </div>
      </section>
      <section class="container page-section source-section">
        <div class="section-heading">
          <p class="eyebrow">Sources checked</p>
          <h2>How the hotel information was checked</h2>
        </div>
        <p>Room and amenity facts come from official hotel pages. Review notes summarize a small directional sample from public travel review and booking sites; the themes are not representative ratings, copied reviews, or firsthand stays. Prices are rough public examples, not live quotes.</p>
        <ul class="source-list">
${sanDiegoHotelSources.map(([label, href]) => `          <li><a href="${esc(href)}">${esc(label)}</a></li>`).join("\n")}
          <li><a href="https://commons.wikimedia.org/wiki/File:21a-san-diego-mission-bay.jpg">Mission Bay photo license and attribution</a></li>
          <li>Public Expedia, Hotels.com, KAYAK, Tripadvisor, Booking.com, Hyatt review, Tripster, and KidTripster pages checked July 21, 2026 for rough nightly-price and online review pattern context.</li>
        </ul>
      </section>
      <script type="application/ld+json">${JSON.stringify(itemListJson)}</script>
      <script type="application/ld+json">${JSON.stringify(faqJson)}</script>
    </main>`;

  return pageShell({
    title: "Top Family Hotels in San Diego: 12 Options by Trip Style",
    description: "Compare 12 San Diego family hotels by trip style, approximate nightly price, room setup, pools, breakfast or kitchen needs, map location, and sampled online review themes.",
    canonical: "where-to-stay/san-diego-family-hotels.html",
    body
  });
}

const lasVegasFamilyHotels = [
  {
    name: "Mandalay Bay Resort and Casino",
    category: "Pool-and-attraction resort",
    area: "South Strip",
    priceRange: "$110-$350+",
    strengths: ["The 11-acre beach complex and Shark Reef can make the hotel part of the itinerary", "Official two-queen rooms list space for four"],
    familySetup: "Official materials list 550 sq ft two-queen rooms for up to four, plus an 11-acre beach complex with a wave pool, lazy river, pools, and Shark Reef on site.",
    reviewSignal: "Beach, pool, and room-size positives recur; check-in or service waits, noise, seasonal pool limits, and value when water features are closed appear as conflicts.",
    priceNote: "Recent public low-date examples started near $110 total, while weekends, events, and larger rooms can move far higher.",
    parentCheck: "Confirm which pools and water features operate on the exact dates, room occupancy, final total, parking, and the casino-floor path.",
    mapQuery: "Mandalay Bay Resort Las Vegas"
  },
  {
    name: "Four Seasons Hotel Las Vegas",
    category: "Non-gaming luxury with Mandalay access",
    area: "South Strip",
    priceRange: "$350-$700+",
    strengths: ["Official family materials describe a non-gaming and non-smoking hotel", "Guests receive private-pool and Mandalay Beach access"],
    familySetup: "The official family page lists a private pool, Mandalay Beach access, cribs or rollaways, childproofing items, children's toiletries, books, and games; exact room occupancy still depends on room type.",
    reviewSignal: "Service, cleanliness, room space, and the calmer setting recur positively; high prices, early or seasonal pool limits, airport noise, and occasional service or condition conflicts also appear.",
    priceNote: "A recent public one-night example was about $351 total; larger rooms, weekends, dining, and parking can move the stay much higher.",
    parentCheck: "Price the full stay and verify private and Mandalay pool hours, exact bedding, parking, and whether the south-Strip location fits the plan.",
    mapQuery: "Four Seasons Hotel Las Vegas"
  },
  {
    name: "Vdara Hotel & Spa",
    category: "Central non-gaming kitchenette suite",
    area: "Center Strip / CityCenter",
    priceRange: "$150-$450+",
    strengths: ["Every official Studio is a 582 sq ft suite with a kitchenette", "The property is casino-free and smoke-free while staying close to Aria and Bellagio"],
    familySetup: "The official Studio lists a king bed, pullout queen sofa, kitchenette, dining table, and maximum occupancy of four. Larger one-bedroom layouts are available, but bedding and separation vary.",
    reviewSignal: "Room space, non-gaming atmosphere, and access toward Aria and Bellagio recur positively; empty kitchenettes until supplies are requested, small fridges, parking walks, maintenance, and fee clarity recur as conflicts.",
    priceNote: "Public examples varied from roughly $150 to more than $450 total depending on date and inventory source.",
    parentCheck: "Confirm the exact suite bedding, kitchen equipment supplied, parking route, pool season, final total, and cancellation terms.",
    mapQuery: "Vdara Hotel and Spa Las Vegas"
  },
  {
    name: "Marriott's Grand Chateau",
    category: "Multi-bedroom kitchen and laundry base",
    area: "Center Strip / Harmon Avenue",
    priceRange: "$200-$700+",
    strengths: ["Official one- to three-bedroom villas add kitchens, living space, and in-unit laundry", "The property publishes no resort fee"],
    familySetup: "Official pages list guest rooms plus one-, two-, and three-bedroom villas with kitchens or kitchenettes, living and dining space, and in-unit laundry in villas. Two pools and valet-only parking are also listed.",
    reviewSignal: "Space, kitchens, laundry, cleanliness, and central location recur positively; small or crowded pools, valet dependence, timeshare contact, noise, and limited food choices recur as conflicts.",
    priceNote: "Public examples ranged from the low $200s to roughly $700 for higher dates or larger units; villa size is the main comparison point.",
    parentCheck: "Compare the exact villa, bedrooms and baths, housekeeping cadence, valet cost and wait, final total, and cancellation terms.",
    mapQuery: "Marriott's Grand Chateau Las Vegas"
  },
  {
    name: "Tahiti Village Resort",
    category: "Off-Strip lazy-river suite",
    area: "South Las Vegas Boulevard",
    priceRange: "$130-$300+",
    strengths: ["Official one- and two-bedroom suites publish kitchenette or full-kitchen setups", "The pool, lazy river, arcade, activities, and free parking support a stay-put day"],
    familySetup: "Official pages list a 580 sq ft one-bedroom with kitchenette, a 971 sq ft one-bedroom with full kitchen, and a 1,551 sq ft two-bedroom suite, plus pool, lazy river, arcade, activities, and free parking.",
    reviewSignal: "Room space, kitchens, lazy river, pool, and the away-from-casino setting recur positively; crowding, partial pool closures, elevator or parking walks, service follow-through, room condition, and sales contact recur as conflicts.",
    priceNote: "A recent public one-night example was about $129 total; larger suites and peak pool dates can move higher.",
    parentCheck: "Verify the exact kitchen, pool and lazy-river operations, crib or Pack 'n Play availability if needed, shuttle schedule, final total, and cancellation terms.",
    mapQuery: "Tahiti Village Resort Las Vegas"
  },
  {
    name: "Hilton Vacation Club Cancun Resort Las Vegas",
    category: "Off-Strip waterslides and family space",
    area: "South Las Vegas Boulevard",
    priceRange: "$120-$320+",
    strengths: ["Hilton lists two pools and four waterslides", "Free parking and residence-style layouts can fit a car-based family trip"],
    familySetup: "Hilton lists two pools, four waterslides, free parking, non-smoking rooms, and resort residences. Hilton says cribs and confirmed connecting rooms are unavailable, while Expedia lists free cribs on request. Treat crib availability as unresolved and confirm it directly if needed.",
    reviewSignal: "Family pool and space positives appear in the small sample; resort fee, service consistency, timeshare context, room condition, and distance from main Strip stops remain the main conflicts.",
    priceNote: "A current public one-night example was about $119 total; dates and larger residences can move higher.",
    parentCheck: "Confirm the conflicting crib policy if needed, exact suite and kitchen, slide operations and rules, transport plan, final total, and cancellation terms.",
    mapQuery: "Hilton Vacation Club Cancun Resort Las Vegas"
  },
  {
    name: "Excalibur Hotel & Casino",
    category: "Themed lower-price south Strip base",
    area: "South Strip",
    priceRange: "$60-$220+",
    strengths: ["Newly renovated two-queen rooms officially list space for four", "The castle theme, arcade, and nearby Tournament of Kings can entertain younger children"],
    familySetup: "Official room pages list newly renovated 352 sq ft two-queen rooms for four and larger two-bedroom suites. Current property materials also list arcade or midway entertainment and a pool.",
    reviewSignal: "Low total, castle theme, arcade, and south-Strip access help some families; room condition varies sharply, with smoke, cleanliness, maintenance, queues, and tower or renovation status recurring as conflicts.",
    priceNote: "A recent public low-date example was about $58 total; renovated rooms, weekends, and event dates can move much higher.",
    parentCheck: "Confirm a renovated room and tower, exact pool season, casino route, final total, parking, and the newest room-condition reviews.",
    mapQuery: "Excalibur Hotel and Casino Las Vegas"
  },
  {
    name: "New York-New York Hotel & Casino",
    category: "Older-kid Strip energy",
    area: "South Strip",
    priceRange: "$80-$300+",
    strengths: ["Official pages list remodeled two-queen rooms", "The Big Apple Coaster, arcade, food, and arena access can suit older kids"],
    familySetup: "Official property pages list remodeled two-queen rooms, the Big Apple Coaster and Arcade, a seasonal pool, and walkways toward neighboring south-Strip resorts.",
    reviewSignal: "Remodeled rooms, food and entertainment density, location, and older-kid energy are positives; casino noise or smoke exposure, coaster fit and cost, pool modesty, queues, and busy public areas are conflicts.",
    priceNote: "A recent public low-date example was about $79 total; event nights and specific remodeled-room choices can move higher.",
    parentCheck: "Check coaster height and comfort, room tower, pool season, casino path, event-night price, parking, and final total.",
    mapQuery: "New York-New York Hotel and Casino Las Vegas"
  },
  {
    name: "Las Vegas Hilton at Resorts World",
    category: "Modern North Strip resort",
    area: "North Strip",
    priceRange: "$150-$350+",
    strengths: ["Official Hilton two-queen rooms sleep four", "The resort's large multi-pool complex and food choices support an on-property day"],
    familySetup: "Hilton lists two-queen rooms for four. Resorts World lists a large multi-pool complex; the Athena infinity area is 21+, so families should verify which all-ages pools are operating.",
    reviewSignal: "Modern rooms, cleanliness, pool complex, and on-property food choice recur positively; check-in lines, long internal walks, high food costs, housekeeping inconsistency, and early or seasonal pool closures recur as conflicts.",
    priceNote: "Recent public examples ranged from about $134 including fees to the high $200s before all tax, with large offer and date swings.",
    parentCheck: "Verify which all-ages pools are open, exact Hilton tower and room, internal walking, parking, final total, and cancellation terms.",
    mapQuery: "Las Vegas Hilton at Resorts World"
  },
  {
    name: "Red Rock Casino Resort & Spa",
    category: "Summerlin nature and stay-put base",
    area: "Summerlin",
    priceRange: "$220-$450+",
    strengths: ["Bowling, cinema, arcade or Kids Quest, and pool options create non-Strip downtime", "The location can pair with a Red Rock Canyon day"],
    familySetup: "Official pages list a pool for registered guests, bowling, cinema, arcade or Kids Quest, and proximity to Red Rock Canyon. Kids Quest is a separate hourly paid program with current ages and rules to verify.",
    reviewSignal: "Pool, room quality, on-site activities, and the off-Strip setting appear positively; seasonally limited pools, long hotel walks, fees or value, and Strip distance recur as conflicts.",
    priceNote: "A recent public one-night example was about $219 total; weekends and premium rooms can move higher.",
    parentCheck: "Confirm pool operations, Kids Quest ages, hours and price, room-to-amenity walking, Red Rock transport, final total, and cancellation terms.",
    mapQuery: "Red Rock Casino Resort and Spa Las Vegas"
  }
];

const lasVegasHotelSources = [
  ["Mandalay Bay rooms", "https://mandalaybay.mgmresorts.com/en/hotel.html"],
  ["Mandalay Bay property facts", "https://mandalaybay.mgmresorts.com/en/contact-us.html"],
  ["Four Seasons family amenities", "https://www.fourseasons.com/lasvegas/services-and-amenities/family/"],
  ["Vdara hotel", "https://vdara.mgmresorts.com/en.html"],
  ["Vdara Studio suite", "https://vdara.mgmresorts.com/en/hotel/studio-suite.html"],
  ["Marriott's Grand Chateau", "https://www.marriott.com/en-us/hotels/lasvg-marriotts-grand-chateau/overview/"],
  ["Marriott's Grand Chateau rooms", "https://www.marriott.com/en-us/hotels/lasvg-marriotts-grand-chateau/rooms/"],
  ["Tahiti Village suites and amenities", "https://tahitivillage.com/"],
  ["Hilton Vacation Club Cancun Resort", "https://www.hilton.com/en/hotels/lascngv-hilton-vacation-club-cancun-resort-las-vegas/"],
  ["Hilton Cancun Resort hotel information", "https://www.hilton.com/en/hotels/lascngv-hilton-vacation-club-cancun-resort-las-vegas/hotel-info/"],
  ["Excalibur rooms", "https://excalibur.mgmresorts.com/en/hotel.html"],
  ["New York-New York hotel", "https://newyorknewyork.mgmresorts.com/en.html"],
  ["New York-New York amenities", "https://newyorknewyork.mgmresorts.com/en/amenities.html"],
  ["Resorts World pools", "https://www.rwlasvegas.com/pools/"],
  ["Las Vegas Hilton rooms", "https://www.hilton.com/en/hotels/rslvhvh-resorts-world-las-vegas/rooms/las-vegas-hilton/"],
  ["Red Rock family activities", "https://redrockresort.com/see-and-do/activities/"],
  ["Red Rock pool", "https://redrockresort.com/see-and-do/pool/"],
  ["Kids Quest at Red Rock", "https://www.kidsquest.com/location/redrock/"]
];

function lasVegasFamilyHotelPage() {
  const hotels = lasVegasFamilyHotels;
  const cards = hotels.map((hotel) => `          <article class="detail-card hotel-card">
            <p class="eyebrow">${esc(hotel.category)}</p>
            <h3>${esc(hotel.name)}</h3>
            <dl class="hotel-facts">
              <div><dt>Area</dt><dd>${esc(hotel.area)}</dd></div>
              <div><dt>Rough total/night</dt><dd>${esc(hotel.priceRange)}</dd></div>
              <div><dt>Map</dt><dd><a href="${googleMapsUrl(hotel.mapQuery)}">Open in Google Maps</a></dd></div>
            </dl>
            <section><h4>Why compare it</h4><ul>${hotel.strengths.map((item) => `<li>${esc(item)}</li>`).join("")}</ul></section>
            <section><h4>Room and family setup</h4><p>${esc(hotel.familySetup)}</p></section>
            <section><h4>Themes in sampled online reviews</h4><p>${esc(hotel.reviewSignal)}</p></section>
            <section><h4>Price context and key check</h4><p>${esc(hotel.priceNote)} ${esc(hotel.parentCheck)}</p></section>
          </article>`).join("\n");

  const rows = hotels.map((hotel) => `              <tr>
                <td>${esc(hotel.name)}</td>
                <td>${esc(hotel.category)}</td>
                <td>${esc(hotel.area)}</td>
                <td>${esc(hotel.priceRange)}</td>
                <td><a href="${googleMapsUrl(hotel.mapQuery)}">Map</a></td>
                <td>${esc(hotel.parentCheck.split(".")[0])}.</td>
              </tr>`).join("\n");

  const faqs = [
    ["What is the best family hotel in Las Vegas?", "There is no single best hotel for every family. Mandalay Bay fits a water-resort trip, Vdara and Marriott's Grand Chateau fit different suite needs, Tahiti Village and Cancun Resort fit off-Strip water time, and the other options answer distinct budget, older-kid, luxury, or nature-base needs."],
    ["Should a family stay on or off the Las Vegas Strip?", "Stay on the Strip when the chosen hotel and nearby activities reduce transfers enough to outweigh casino, crowd, and walking friction. Stay off the Strip when a kitchen, parking, waterslides, a quieter reset pattern, or a Red Rock day matters more than immediate resort access."],
    ["Do these nightly ranges include resort fees and taxes?", "The ranges use public total-price examples where the source displayed taxes and mandatory fees, then widen them for date changes. Parking, larger rooms, optional purchases, and some source displays can still sit outside the example, so compare the final total for the same dates and room setup."]
  ];
  const faqJson = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(([name, text]) => ({ "@type": "Question", name, acceptedAnswer: { "@type": "Answer", text } }))
  };
  const itemListJson = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Las Vegas family hotel options",
    itemListElement: hotels.map((hotel, index) => ({ "@type": "ListItem", position: index + 1, name: hotel.name, description: `${hotel.category}; rough total per night ${hotel.priceRange}` }))
  };

  const body = `    <main>
      <section class="page-hero hotel-hero">
        <div class="container">
          <p class="eyebrow">Las Vegas family hotels</p>
          <h1>Top Family Hotels in Las Vegas: 10 Options by Trip Style</h1>
          <p>Compare ten Las Vegas family hotels by room setup, pool value, casino or non-gaming context, approximate total nightly price, location, and themes from sampled online reviews.</p>
        </div>
      </section>
      <section class="container trust-panel" aria-label="Review status">
        <p><strong>Hotel facts, prices, and review sources checked:</strong> July 22, 2026</p>
        <p>Nightly ranges are rough planning totals, not quotes. Compare the final total for your dates, room type, occupancy, parking, and cancellation terms.</p>
      </section>
      <section class="container media-section">
        <figure class="licensed-photo">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Bellagio_fountain_show_2010_las_vegas.JPG/1280px-Bellagio_fountain_show_2010_las_vegas.JPG" alt="The Bellagio fountains and Las Vegas Strip at night." width="1280" height="850" loading="eager" decoding="async">
          <figcaption>Photo: Chensiyuan via <a href="https://commons.wikimedia.org/wiki/File:Bellagio_fountain_show_2010_las_vegas.JPG">Wikimedia Commons</a>, <a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a>. No editorial changes; Wikimedia serves this resized preview.</figcaption>
        </figure>
      </section>
      <section class="band intro-band">
        <div class="container answer-grid">
          <div>
            <p class="eyebrow">Short answer</p>
            <h2>Choose the hotel that removes the biggest family friction</h2>
            <p>Mandalay Bay and Four Seasons share the strongest water-resort setup at different price and atmosphere levels. Vdara and Marriott's Grand Chateau solve two different central-suite needs. Tahiti Village and Cancun Resort trade centrality for kitchens and water time. Use the other four when themed value, older-kid energy, a modern North Strip resort, or a Summerlin base matters more.</p>
            <p><a class="text-link" href="./las-vegas-with-kids.html">Compare Las Vegas stay areas and property constraints</a></p>
          </div>
          <dl class="snapshot">
            <div><dt>Hotels covered</dt><dd>10 options</dd></div>
            <div><dt>Price format</dt><dd>Rough total/night, not a quote</dd></div>
            <div><dt>Online reviews</dt><dd>Paraphrased themes from a small public sample</dd></div>
            <div><dt>Map view</dt><dd>Direct Google Maps link for every hotel</dd></div>
          </dl>
        </div>
      </section>
      <section class="container page-section rank-ready-section">
        <div class="section-heading"><p class="eyebrow">Trip-style starts</p><h2>Pick the closest version of your trip</h2></div>
        <div class="quick-pick-grid hotel-pick-grid">
          <article class="quick-pick"><span>Pool-centered resort</span><strong>Mandalay Bay or Four Seasons</strong><p>Choose Mandalay for the full resort and attraction energy; compare Four Seasons when a non-gaming luxury base and private pool justify the higher total.</p></article>
          <article class="quick-pick"><span>Central suite</span><strong>Vdara or Grand Chateau</strong><p>Choose Vdara for a kitchenette and casino-free tower; choose Grand Chateau when separate bedrooms, a full kitchen, or laundry matters more.</p></article>
          <article class="quick-pick"><span>Off-Strip water time</span><strong>Tahiti Village or Cancun Resort</strong><p>Compare lazy river and suite choices at Tahiti against four waterslides, free parking, and a farther-south base at Cancun Resort.</p></article>
          <article class="quick-pick"><span>Themed or older-kid Strip</span><strong>Excalibur or New York-New York</strong><p>Use Excalibur for lower-price castle and arcade appeal; compare New York-New York for remodeled rooms, coaster energy, and arena access.</p></article>
          <article class="quick-pick"><span>North Strip or nature base</span><strong>Resorts World Hilton or Red Rock</strong><p>Choose Resorts World for a modern multi-pool resort; choose Red Rock when Summerlin, on-site family activities, and a canyon day shape the trip.</p></article>
        </div>
      </section>
      <section class="band">
        <div class="container">
          <div class="section-heading"><p class="eyebrow">Comparison</p><h2>Quick hotel comparison</h2></div>
          <p class="review-label">Ranges synthesize public total-price examples checked July 22, 2026. Compare the final total for the same dates, occupancy, and room setup.</p>
          <div class="comparison-scroll">
            <table class="comparison-table hotel-comparison">
              <thead><tr><th>Hotel</th><th>Best starting point for</th><th>Area</th><th>Rough total/night</th><th>Map</th><th>Most important check</th></tr></thead>
              <tbody>
${rows}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      <section class="container page-section">
        <div class="section-heading"><p class="eyebrow">Hotel cards</p><h2>10 options, with the useful checks up front</h2></div>
        <div class="detail-card-grid hotel-card-grid">
${cards}
        </div>
      </section>
      <section class="container page-section">
        <div class="section-heading"><p class="eyebrow">Common questions</p><h2>Las Vegas family hotel FAQ</h2></div>
        <div class="card-grid">
${faqs.map(([question, answer]) => `          <article class="activity-card faq-card"><h3>${esc(question)}</h3><p>${esc(answer)}</p></article>`).join("\n")}
        </div>
      </section>
      <section class="container page-section source-section">
        <div class="section-heading"><p class="eyebrow">Sources checked</p><h2>How the hotel information was checked</h2></div>
        <p>Room and amenity facts come from official property pages. Online-review notes paraphrase a small directional sample from public booking and review sites; they are not representative ratings or firsthand stays. Price ranges use volatile public examples rather than live booking quotes.</p>
        <ul class="source-list">
${lasVegasHotelSources.map(([label, href]) => `          <li><a href="${esc(href)}">${esc(label)}</a></li>`).join("\n")}
          <li><a href="https://commons.wikimedia.org/wiki/File:Bellagio_fountain_show_2010_las_vegas.JPG">Las Vegas photo source and attribution</a> by Chensiyuan; <a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0 license</a></li>
          <li>Public Expedia, Booking.com, Hotels.com, Tripadvisor, Trip.com, Hilton, and Marriott price or review pages checked July 22, 2026; exact URLs and evidence limits are recorded in the evidence pack.</li>
        </ul>
      </section>
      <script type="application/ld+json">${JSON.stringify(itemListJson)}</script>
      <script type="application/ld+json">${JSON.stringify(faqJson)}</script>
    </main>`;

  return pageShell({
    title: "Top Family Hotels in Las Vegas: 10 Options by Trip Style",
    description: "Compare 10 Las Vegas family hotels by trip style, rough total nightly price, room setup, pools, casino or non-gaming context, location, and sampled online-review themes.",
    canonical: "where-to-stay/las-vegas-family-hotels.html",
    nav: [["./las-vegas-with-kids.html", "Where to stay"], ["../things-to-do/las-vegas-with-kids.html", "Things to do"], ["../family-itinerary/las-vegas-with-kids.html", "Itinerary"]],
    body
  });
}

const chicagoFamilyHotels = [
  {
    name: "Embassy Suites by Hilton Chicago Downtown Magnificent Mile",
    category: "Two-room suite, breakfast, and pool",
    area: "Streeterville",
    priceRange: "$280-$550+",
    strengths: ["Two-room suites can separate sleep from adult downtime", "Made-to-order breakfast and an indoor pool keep two recurring family costs or needs in one place"],
    familySetup: "Hilton lists suites, made-to-order breakfast, an evening reception, indoor pool, cribs, and a daily destination charge. Children 17 and under stay free in the same suite with a parent; exact bedding and occupancy still depend on the suite.",
    reviewSignal: "The inspected sample included positive mentions of suite space, breakfast, pool, and location. It also surfaced elevator disruption, crowding, room condition, towels, and housekeeping.",
    priceNote: "A recent public example was about $282 total; larger suites, weekends, and event dates can move much higher.",
    parentCheck: "Confirm exact suite bedding and occupancy, current elevator and pool status, destination charge, parking, and final total.",
    mapQuery: "Embassy Suites Chicago Downtown Magnificent Mile"
  },
  {
    name: "Homewood Suites by Hilton Chicago-Downtown",
    category: "Kitchen, breakfast, and indoor-pool base",
    area: "River North",
    priceRange: "$210-$450+",
    strengths: ["Full kitchens and hot breakfast reduce meal setup", "An indoor pool and published connecting rooms add flexibility for longer stays"],
    familySetup: "Hilton lists a full kitchen, free hot breakfast, indoor pool, connecting rooms, and a location one block from Michigan Avenue. Confirm a true one-bedroom category when a door between sleep and living space matters.",
    reviewSignal: "The inspected sample included positive mentions of suite space, kitchen, breakfast, location, and the pool. It also surfaced dated condition, city noise, pool availability or crowding, breakfast variation, and valet waits or billing.",
    priceNote: "A recent public one-night example was about $209 total; one-bedroom categories and peak dates can move higher.",
    parentCheck: "Confirm the exact suite layout, pool status, breakfast setup, recent room condition, valet total, and final price.",
    mapQuery: "Homewood Suites by Hilton Chicago Downtown 40 East Grand"
  },
  {
    name: "Residence Inn Chicago Downtown/River North",
    category: "Kitchen and breakfast without a pool requirement",
    area: "River North",
    priceRange: "$270-$500+",
    strengths: ["Every suite has a full-size kitchen and breakfast is included", "On-site laundry and grocery-shopping service can help on a longer trip"],
    familySetup: "Marriott lists all suites, full-size kitchens, complimentary hot breakfast, on-site laundry, grocery-shopping service, and self or valet parking. Bedding, sofa-bed setup, and whether the sleeping area has a door vary by category.",
    reviewSignal: "The inspected sample included positive mentions of kitchens, breakfast, location, staff, and suite usefulness. It also surfaced room-specific city noise, kitchen supplies, the small gym, and summer value.",
    priceNote: "A recent public example was about $268 total, while a stronger-demand summer date was reported near $382.",
    parentCheck: "Confirm bedding, bedroom separation, sofa-bed setup, kitchen equipment, parking, and the final total for the same suite.",
    mapQuery: "Residence Inn Chicago Downtown River North"
  },
  {
    name: "Sable at Navy Pier Chicago, Curio Collection by Hilton",
    category: "Navy Pier-centered younger-child trip",
    area: "Navy Pier / Streeterville",
    priceRange: "$310-$650+",
    strengths: ["The hotel can put Chicago Children's Museum and pier activities at the day's starting point", "Official two-queen rooms and suites sleep four, with lake or skyline views"],
    familySetup: "Official sources list two-queen rooms and suites sleeping four, mini fridges, cribs, confirmed connecting rooms, paid breakfast, and pier parking. The property has no pool.",
    reviewSignal: "The inspected sample included positive mentions of views, room condition, and Navy Pier access. It also surfaced the long pier approach, wayfinding, parking cost, service inconsistency, and elevator disruption.",
    priceNote: "A recent public one-night example was about $311 total; pier events, views, suites, and weekends can move higher.",
    parentCheck: "Decide whether a pier base helps more than it complicates other days, then verify bedding, event calendar, parking, and final total.",
    mapQuery: "Sable at Navy Pier Chicago"
  },
  {
    name: "Swissotel Chicago",
    category: "Purpose-built Kids Suite",
    area: "New Eastside",
    priceRange: "$240-$550+",
    strengths: ["The current Kids Suite offer creates separate adult and child spaces", "The offer includes toys, games, movie night, and breakfast under stated terms"],
    familySetup: "The Kids Suite offer lists a two-room setup with a dedicated children's space and breakfast for two adults and up to two children, subject to availability. Public standard double-room inventory lists two double beds for four.",
    reviewSignal: "The inspected sample included positive mentions of views, river or lake location, room size, and staff. It also surfaced dated finishes, the experience fee, parking access, room assignment or service inconsistency, and offer availability.",
    priceNote: "A recent standard-room example was about $235 total; the Kids Suite offer and mandatory experience fee can move higher.",
    parentCheck: "Confirm the actual Kids Suite, breakfast terms, fee, parking, bedding, and final total rather than assuming a standard room includes the family setup.",
    mapQuery: "Swissotel Chicago"
  },
  {
    name: "InterContinental Chicago Magnificent Mile",
    category: "Historic indoor-pool base",
    area: "Magnificent Mile",
    priceRange: "$300-$600+",
    strengths: ["The heated junior Olympic-size indoor pool is a distinct weather-backup amenity", "Official room inventory includes two-double rooms and requestable connecting rooms or cribs"],
    familySetup: "IHG lists classic and premium rooms with two double beds or one king, connecting rooms and cribs by request, and a heated junior Olympic-size indoor pool. A temporary August 10-12, 2026 pool closure is posted.",
    reviewSignal: "The inspected sample included positive mentions of the pool, location, historic character, and staff. It also surfaced pool crowding or depth, variable rooms, maintenance details, and parking cost.",
    priceNote: "A recent public one-night example was about $305 total; larger rooms, events, and weekends can move higher.",
    parentCheck: "Check the live pool calendar and depth fit, exact two-double room, connecting request, parking, and final total.",
    mapQuery: "InterContinental Chicago Magnificent Mile"
  },
  {
    name: "Hilton Chicago",
    category: "Museum Campus and Grant Park base",
    area: "South Loop",
    priceRange: "$320-$650+",
    strengths: ["Grant Park and Museum Campus can shape the first half of the trip", "Hilton publishes two-double rooms, an indoor pool, game room, and larger family-connection layouts"],
    familySetup: "Hilton lists two-double rooms sleeping four, an indoor pool, connecting rooms, cribs, game room, and larger family-connection or specialty layouts. Standard and specialty options differ sharply in space and total price.",
    reviewSignal: "The inspected sample included positive mentions of Grant Park location, historic public spaces, pool, staff, and larger layouts. It also surfaced housekeeping consistency, dated-room variation, event-scale crowds, and parking cost.",
    priceNote: "A current public example was about $308 including taxes and fees; specialty layouts and convention dates can move far higher.",
    parentCheck: "Compare the standard room with the exact larger layout needed, then verify pool, event calendar, parking, and final total.",
    mapQuery: "Hilton Chicago 720 South Michigan Avenue"
  },
  {
    name: "Hotel Zachary Chicago, a Tribute Portfolio Hotel",
    category: "Wrigleyville and older-kid trip",
    area: "Lakeview / Wrigleyville",
    priceRange: "$360-$750+",
    strengths: ["Direct Wrigley Field positioning makes a Cubs game or concert the trip anchor", "Official inventory includes double-queen and ballpark-view categories"],
    familySetup: "Official pages list king and double-queen rooms directly across from Wrigley Field, with neighborhood dining and ballpark-view categories.",
    reviewSignal: "The inspected sample included positive mentions of Wrigley views, room condition, staff, and event convenience. It also surfaced event pricing, noise, blocked streets or rideshare friction, parking, breakfast cost, and limited cold storage.",
    priceNote: "A recent public one-night example was about $363 total; Cubs games and concerts can invalidate the low end.",
    parentCheck: "Check the Wrigley event calendar first, then bedding, refrigerator status, post-event transport, parking, and final total.",
    mapQuery: "Hotel Zachary Chicago"
  },
  {
    name: "Four Seasons Hotel Chicago",
    category: "Luxury family amenities and pool",
    area: "Gold Coast",
    priceRange: "$630-$1,200+",
    strengths: ["The current family program combines an indoor pool, child amenities, and a play space", "Two-double lake-view rooms publicly sleep four, with larger suite choices available"],
    familySetup: "Current Four Seasons materials list a 44-foot indoor pool, family programming and child amenities, complimentary dining for children under five under stated terms, and two-double lake-view rooms for four.",
    reviewSignal: "The inspected sample included positive mentions of service, pool, child amenities, views, room space, and location. It also surfaced the high total, occasional service mismatch, pool crowding, and room-layout questions.",
    priceNote: "A recent public one-night example was about $630 total; two-double rooms, suites, weekends, dining, and parking can move much higher.",
    parentCheck: "Price the exact room or suite and confirm bedding, pool timing, child-dining terms, parking, and the value of the family amenities.",
    mapQuery: "Four Seasons Hotel Chicago"
  },
  {
    name: "The Langham, Chicago",
    category: "Riverfront luxury with a larger pool",
    area: "Chicago River / River North",
    priceRange: "$600-$1,200+",
    strengths: ["The 67-foot indoor pool and a separate current Kids Suite can support an indoor reset", "Large rooms and a riverfront location can work when one central luxury base is the priority"],
    familySetup: "Langham lists a 67-foot indoor pool and connecting rooms by request. Its current dedicated Kids Suite page says the play space is open daily, while an older overview still says suspended; the Cinema Suite is separate and subject to availability.",
    reviewSignal: "The inspected sample included positive mentions of room size, river location, pool, service, and cleanliness. It also surfaced weekend pool crowding, food and parking cost, and service or climate-control inconsistency.",
    priceNote: "A recent public one-night example was about $600 total; connecting rooms, suites, club access, food, and parking can move much higher.",
    parentCheck: "Confirm the room and connection, pool child rules, current Kids Suite status and access, food plan, parking, and final total.",
    mapQuery: "The Langham Chicago"
  }
];

const chicagoHotelSources = [
  ["Embassy Suites Magnificent Mile", "https://www.hilton.com/en/hotels/chirees-embassy-suites-chicago-downtown-magnificent-mile/"],
  ["Homewood Suites Chicago-Downtown", "https://www.hilton.com/en/hotels/chihwhw-homewood-suites-chicago-downtown/"],
  ["Residence Inn River North overview", "https://www.marriott.com/en-us/hotels/chirn-residence-inn-chicago-downtown-river-north/overview/"],
  ["Residence Inn River North rooms", "https://www.marriott.com/en-us/hotels/chirn-residence-inn-chicago-downtown-river-north/rooms/"],
  ["Residence Inn River North dining", "https://www.marriott.com/en-us/hotels/chirn-residence-inn-chicago-downtown-river-north/dining/"],
  ["Sable at Navy Pier", "https://sablehotel.com/"],
  ["Sable hotel information", "https://www.hilton.com/en-gb/hotels/chipiqq-sable-at-navy-pier-chicago/hotel-info/"],
  ["Swissotel Kids Suite offer", "https://www.swissotel.com/hotels/chicago/promotions/family/swissotel-kids-suite/"],
  ["Swissotel Kids Suite room", "https://www.swissotel.com/hotels/chicago/suites/kid-friendly-suite/"],
  ["InterContinental rooms", "https://www.ihg.com/intercontinental/hotels/us/en/chicago/ordha/hoteldetail/rooms"],
  ["InterContinental amenities and pool", "https://www.ihg.com/intercontinental/hotels/us/en/chicago/ordha/hoteldetail/amenities"],
  ["Hilton Chicago rooms", "https://www.hilton.com/en/hotels/chichhh-hilton-chicago/rooms/"],
  ["Hilton Chicago amenities", "https://www.hilton.com/en/hotels/chichhh-hilton-chicago/amenities/"],
  ["Hotel Zachary rooms", "https://www.hotelzachary.com/accommodations/"],
  ["Four Seasons family guide", "https://press.fourseasons.com/chicago/trending-now/reasons-to-stay-in-chicago-with-kids/"],
  ["Four Seasons hotel facts", "https://press.fourseasons.com/chicago/hotel-facts/"],
  ["The Langham pool", "https://www.langhamhotels.com/en/the-langham/chicago/wellness/swimming-pool/"],
  ["The Langham current Kids Suite", "https://www.langhamhotels.com/en/the-langham/chicago/stay/the-kids-suite/"],
  ["The Langham hotel overview", "https://www.langhamhotels.com/en/the-langham/chicago/discover/hotel-at-a-glance/"],
  ["The Langham child policy", "https://www.langhamhotels.com/en/the-langham/chicago/policy/"]
];

function chicagoFamilyHotelPage() {
  const hotels = chicagoFamilyHotels;
  const cards = hotels.map((hotel) => `          <article class="detail-card hotel-card">
            <p class="eyebrow">${esc(hotel.category)}</p>
            <h3>${esc(hotel.name)}</h3>
            <dl class="hotel-facts">
              <div><dt>Area</dt><dd>${esc(hotel.area)}</dd></div>
              <div><dt>Rough total/night</dt><dd>${esc(hotel.priceRange)}</dd></div>
              <div><dt>Map</dt><dd><a href="${googleMapsUrl(hotel.mapQuery)}">Open in Google Maps</a></dd></div>
            </dl>
            <section><h4>Why compare it</h4><ul>${hotel.strengths.map((item) => `<li>${esc(item)}</li>`).join("")}</ul></section>
            <section><h4>Room and family setup</h4><p>${esc(hotel.familySetup)}</p></section>
            <section><h4>Themes in sampled online reviews</h4><p>${esc(hotel.reviewSignal)}</p></section>
            <section><h4>Price context and key check</h4><p>${esc(hotel.priceNote)} ${esc(hotel.parentCheck)}</p></section>
          </article>`).join("\n");

  const rows = hotels.map((hotel) => `              <tr>
                <td>${esc(hotel.name)}</td>
                <td>${esc(hotel.category)}</td>
                <td>${esc(hotel.area)}</td>
                <td>${esc(hotel.priceRange)}</td>
                <td><a href="${googleMapsUrl(hotel.mapQuery)}">Map</a></td>
                <td>${esc(hotel.parentCheck.split(".")[0])}.</td>
              </tr>`).join("\n");

  const faqs = [
    ["What is the best family hotel in Chicago?", "There is no single best hotel for every family. Embassy Suites and Homewood solve different suite needs, Sable puts Navy Pier at the door, Swissotel has a purpose-built Kids Suite, InterContinental and Hilton Chicago answer different pool and location jobs, Hotel Zachary fits a Wrigley trip, and Four Seasons or Langham serve different luxury priorities."],
    ["Which Chicago family hotels have an indoor pool?", "Embassy Suites Magnificent Mile, Homewood Suites Chicago-Downtown, InterContinental Magnificent Mile, Hilton Chicago, Four Seasons, and The Langham list indoor pools. Pool hours, closures, depth, crowding, and child rules can change; InterContinental currently posts an August 10-12, 2026 closure."],
    ["Do these Chicago hotel ranges include taxes and fees?", "The ranges start from public examples that displayed taxes and mandatory fees where stated, then widen for date and room changes. Parking, food, larger rooms, and optional purchases remain outside the range, so compare the final total for the same dates and setup."]
  ];
  const faqJson = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(([name, text]) => ({ "@type": "Question", name, acceptedAnswer: { "@type": "Answer", text } }))
  };
  const itemListJson = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Chicago family hotel options",
    itemListElement: hotels.map((hotel, index) => ({ "@type": "ListItem", position: index + 1, name: hotel.name, description: `${hotel.category}; rough total per night ${hotel.priceRange}` }))
  };

  const body = `    <main>
      <section class="page-hero hotel-hero">
        <div class="container">
          <p class="eyebrow">Chicago family hotels</p>
          <h1>Top Family Hotels in Chicago: 10 Options by Trip Style</h1>
          <p>Compare ten Chicago family hotels by room setup, breakfast or kitchen utility, indoor pool, location, approximate total nightly price, and themes from sampled online reviews.</p>
        </div>
      </section>
      <section class="container trust-panel" aria-label="Review status">
        <p><strong>Hotel facts, prices, and review sources checked:</strong> July 23, 2026</p>
        <p>Nightly ranges are rough planning totals, not quotes. Compare the final total for your dates, room type, occupancy, parking, and cancellation terms.</p>
      </section>
      <section class="container media-section">
        <figure class="licensed-photo">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Millennium_park%2Cchicago.JPG/1280px-Millennium_park%2Cchicago.JPG" alt="Millennium Park and the Chicago skyline at dusk." width="1280" height="960" loading="eager" decoding="async">
          <figcaption>Photo: Behnazkhazai via <a href="https://commons.wikimedia.org/wiki/File:Millennium_park,chicago.JPG">Wikimedia Commons</a>, <a href="https://creativecommons.org/licenses/by-sa/3.0/">CC BY-SA 3.0</a>. No editorial changes; Wikimedia serves this resized preview.</figcaption>
        </figure>
      </section>
      <section class="band intro-band">
        <div class="container answer-grid">
          <div>
            <p class="eyebrow">Short answer</p>
            <h2>Let the room setup and first two days choose the hotel</h2>
            <p>Start with Embassy Suites, Homewood, or Residence Inn when sleep separation, breakfast, or a kitchen drives the stay. Use Sable for a Navy Pier-centered trip, Swissotel for its specific Kids Suite, InterContinental for the historic pool, Hilton Chicago for Museum Campus, and Hotel Zachary for Wrigleyville. Four Seasons and Langham are the two luxury comparisons.</p>
            <p><a class="text-link" href="./chicago-with-kids.html">Compare Chicago stay areas before choosing a property</a></p>
          </div>
          <dl class="snapshot">
            <div><dt>Hotels covered</dt><dd>10 distinct options</dd></div>
            <div><dt>Price format</dt><dd>Rough total/night, not a quote</dd></div>
            <div><dt>Online reviews</dt><dd>Paraphrased themes from a small public sample</dd></div>
            <div><dt>Map view</dt><dd>Direct Google Maps link for every hotel</dd></div>
          </dl>
        </div>
      </section>
      <section class="container page-section rank-ready-section">
        <div class="section-heading"><p class="eyebrow">Trip-style starts</p><h2>Pick the closest version of your trip</h2></div>
        <div class="quick-pick-grid hotel-pick-grid">
          <article class="quick-pick"><span>Suite plus breakfast</span><strong>Embassy Suites or Homewood</strong><p>Choose Embassy for a two-room suite and made-to-order breakfast; choose Homewood when a full kitchen matters more.</p></article>
          <article class="quick-pick"><span>Kitchen without pool</span><strong>Residence Inn River North</strong><p>Use it for full kitchens, breakfast, and on-site laundry when pool time is not part of the plan.</p></article>
          <article class="quick-pick"><span>Young-child or kids-room trip</span><strong>Sable or Swissotel</strong><p>Choose Sable to start on Navy Pier; choose Swissotel only when the specific two-room Kids Suite is available and worth the total.</p></article>
          <article class="quick-pick"><span>Pool plus location</span><strong>InterContinental or Hilton Chicago</strong><p>Choose InterContinental for Magnificent Mile and its historic pool; choose Hilton Chicago for Grant Park and Museum Campus.</p></article>
          <article class="quick-pick"><span>Wrigley or luxury</span><strong>Hotel Zachary, Four Seasons, or Langham</strong><p>Use Zachary for an older-kid ballpark trip; compare Four Seasons and Langham on exact room, pool, play space, service, and full price.</p></article>
        </div>
      </section>
      <section class="band">
        <div class="container">
          <div class="section-heading"><p class="eyebrow">Comparison</p><h2>Quick hotel comparison</h2></div>
          <p class="review-label">Ranges synthesize public price examples checked July 23, 2026. Parking is separate. Compare the final total for the same dates, occupancy, and room setup.</p>
          <div class="comparison-scroll">
            <table class="comparison-table hotel-comparison">
              <thead><tr><th>Hotel</th><th>Best starting point for</th><th>Area</th><th>Rough total/night</th><th>Map</th><th>Most important check</th></tr></thead>
              <tbody>
${rows}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      <section class="container page-section">
        <div class="section-heading"><p class="eyebrow">Hotel cards</p><h2>10 options, with the useful checks up front</h2></div>
        <div class="detail-card-grid hotel-card-grid">
${cards}
        </div>
      </section>
      <section class="container page-section">
        <div class="section-heading"><p class="eyebrow">Common questions</p><h2>Chicago family hotel FAQ</h2></div>
        <div class="card-grid">
${faqs.map(([question, answer]) => `          <article class="activity-card faq-card"><h3>${esc(question)}</h3><p>${esc(answer)}</p></article>`).join("\n")}
        </div>
      </section>
      <section class="container page-section source-section">
        <div class="section-heading"><p class="eyebrow">Sources checked</p><h2>How the hotel information was checked</h2></div>
        <p>Room and amenity facts come from official property pages. Online-review notes paraphrase a small directional sample from public booking and review sites; they are not representative ratings or firsthand stays. Price ranges use volatile public examples rather than live booking quotes.</p>
        <ul class="source-list">
${chicagoHotelSources.map(([label, href]) => `          <li><a href="${esc(href)}">${esc(label)}</a></li>`).join("\n")}
          <li><a href="https://commons.wikimedia.org/wiki/File:Millennium_park,chicago.JPG">Chicago photo source and attribution</a> by Behnazkhazai; <a href="https://creativecommons.org/licenses/by-sa/3.0/">CC BY-SA 3.0 license</a></li>
          <li>Public Expedia, Booking.com, Tripadvisor, Hotels.com, KAYAK, Hilton, Marriott, IHG, Swissotel, Four Seasons, and Langham price or review pages checked July 23, 2026; exact URLs and evidence limits are recorded in the evidence pack.</li>
        </ul>
      </section>
      <script type="application/ld+json">${JSON.stringify(itemListJson)}</script>
      <script type="application/ld+json">${JSON.stringify(faqJson)}</script>
    </main>`;

  return pageShell({
    title: "Top Family Hotels in Chicago: 10 Options by Trip Style",
    description: "Compare 10 Chicago family hotels by trip style, rough total nightly price, room setup, breakfast or kitchens, indoor pools, location, and sampled online-review themes.",
    canonical: "where-to-stay/chicago-family-hotels.html",
    nav: [["./chicago-with-kids.html", "Where to stay"], ["../things-to-do/chicago-with-kids.html", "Things to do"], ["../family-itinerary/chicago-with-kids.html", "Itinerary"]],
    body
  });
}

function itineraryPage(city) {
  const l = links(city);
  const isSanDiego = city.slug === "san-diego";
  const items = city.itinerary.map(([day, plan]) => `              <li><strong>${esc(day)}</strong><span>${esc(plan)}</span></li>`).join("\n");
  const twoDayItems = city.itinerary.slice(0, 2).map(([day, plan]) => `              <li><strong>${esc(day)}</strong><span>${esc(plan)}</span></li>`).join("\n");
  const starterSections = `
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
      </section>`;
  const itineraryIntro = isSanDiego
    ? "Choose a realistic one-, two-, or three-day route, then adjust the rest windows and optional stops for toddlers, teens, or rain."
    : `A starter family itinerary for ${city.name} with morning, afternoon, and evening pacing, rainy-day swaps, and age adjustments.`;
  const body = `${hero(city, `${city.name} itinerary with kids`, itineraryIntro, isSanDiego ? "July 20, 2026" : undefined, isSanDiego ? "Official venue links are below. Age, duration, access, nap, and route labels are Family Tripwise planning estimates; confirm current conditions before the trip." : undefined)}${isSanDiego ? "" : starterSections}
${sourceList(city, isSanDiego ? sanDiegoSpecialistSources(city) : city.sources, isSanDiego ? "Use these official pages to check current hours, tickets, parking, accessibility, ferry schedules, and beach or bay conditions before the trip." : undefined)}
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
  const isSanDiego = city.slug === "san-diego";
  const focus = isToddler ? city.toddlerFocus : city.teenFocus;
  const starterSections = `
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
      </section>`;
  const ageIntro = isSanDiego
    ? isToddler
      ? "Compare short-session activities by nap timing, stroller and bathroom logistics, weather backup, and how easily the family can leave."
      : "Compare coast, zoo, museum, ferry, and weather-backup options by teen interest, route friction, time, and mixed-age fit."
    : `A focused activity guide for ${age} in ${city.name}, with the main kids guide kept as the broader planning hub.`;
  const body = `${hero(city, `Things to do in ${city.name} with ${age}`, ageIntro, isSanDiego ? "July 20, 2026" : undefined, isSanDiego ? "Official venue links are below. Age, duration, access, nap, and route labels are Family Tripwise planning estimates; confirm current conditions before going." : undefined)}${isSanDiego ? "" : starterSections}
${sourceList(city, isSanDiego ? sanDiegoSpecialistSources(city) : city.sources, isSanDiego ? "Use these official pages to check current hours, tickets, parking, accessibility, ferry schedules, and beach or bay conditions before going." : undefined)}
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
        <p><strong>Last updated:</strong> July 11, 2026</p>
        <p><strong>Current scope:</strong> Family Tripwise is running a focused 5-city test before expanding. Current destination clusters are San Diego, Las Vegas, New York City, Chicago, and San Antonio. We update pages as search data, official sources, product needs, and human review notes improve.</p>
      </section>
      <section class="container page-section methodology-section">
        <div class="section-heading">
          <p class="eyebrow">Editorial promise</p>
          <h2>Planning guidance, not fake certainty</h2>
        </div>
        <div class="methodology-grid">
          <article class="method-card"><h3>Research-based by default</h3><p>Most Family Tripwise destination pages are built from official attraction pages, official hotel pages, destination information, search-intent research, and structured family planning assumptions. Unless a page says otherwise, it should not be read as a firsthand trip diary.</p></article>
          <article class="method-card"><h3>Human review required</h3><p>Hotel recommendations, area recommendations, safety notes, stroller/transit advice, and family-suitability claims can materially affect a trip. Those claims must stay caveated until a human reviewer verifies the exact detail or supplies firsthand experience.</p></article>
          <article class="method-card"><h3>Model-derived notes are labeled</h3><p>When we use model-derived planning judgment, we frame it as guidance to verify. Examples include route friction, nap risk, family fit, hotel tradeoffs, and what to skip on a short trip.</p></article>
          <article class="method-card"><h3>Official sources still win</h3><p>Hours, ticket rules, parking, fees, pool access, room policies, stroller access, elevator status, weather closures, and event schedules can change. Families should check official sources before booking or promising a plan to kids.</p></article>
        </div>
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
            <p>For hotels, we separate area guidance from property checks. A hotel may appear as a research candidate because its official page lists a room type, pool, kitchenette, breakfast, parking policy, or location advantage, but that is not the same as a human-reviewed recommendation. Families should verify the exact booking screen, fees, cancellation terms, and room assignment rules before paying.</p>
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
          <p class="eyebrow">How pages improve</p>
          <h2>Search data is input, not the product</h2>
        </div>
        <div class="methodology-grid">
          <article class="method-card"><h3>GSC signal</h3><p>Google Search Console helps identify which existing pages Google is testing, such as family stay intent or things-to-do intent. We use that signal to improve decision support on current pages before adding new clusters.</p></article>
          <article class="method-card"><h3>Cluster completeness</h3><p>A strong destination cluster should connect where-to-stay, things-to-do, itinerary, toddler, teen, and methodology pages so a parent can move from research to a realistic route without opening unrelated listicles.</p></article>
          <article class="method-card"><h3>Useful structure</h3><p>We prefer quick picks, comparison tables, verification checklists, source notes, and skip guidance over long narrative copy. The page should make tradeoffs visible under time pressure.</p></article>
          <article class="method-card"><h3>No scaled filler</h3><p>We do not add new city pages just because a keyword exists. Existing pages should earn indexing through parent-specific planning value, clear caveats, and internal links that match the trip-planning workflow.</p></article>
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
          <article class="method-card"><h3>Not a hotel booking guarantee</h3><p>Room size, fees, deposits, parking, rollaways, cribs, kitchenettes, breakfast, pool access, and noise exposure can vary by property, date, room type, and booking channel. Treat our hotel notes as verification prompts.</p></article>
          <article class="method-card"><h3>Not real-time operations data</h3><p>Transit disruptions, weather, closures, timed-entry availability, and event schedules can change after a guide is updated. The final check should happen close to the trip date.</p></article>
          <article class="method-card"><h3>Not a replacement for parent judgment</h3><p>Families know their own child energy, sensory needs, nap tolerance, food constraints, mobility needs, and budget. Our job is to make tradeoffs easier to see, not to overrule those constraints.</p></article>
        </div>
      </section>
      <section class="band intro-band">
        <div class="container answer-grid">
          <div>
            <p class="eyebrow">Current guide set</p>
            <h2>Where to start</h2>
            <p>Use the home page as the navigation hub for current destination clusters. Start with where-to-stay when lodging base, parking, room setup, pool value, or stroller/transit friction will shape the trip. Start with things-to-do when the main question is age fit, rainy-day backup, or how to avoid overstuffing a day. Use itinerary pages when you need a route that protects meals and rest windows.</p>
          </div>
          <dl class="snapshot">
            <div><dt>San Diego</dt><dd><a href="./where-to-stay/san-diego-with-kids.html">Stay guide</a> and <a href="./family-itinerary/san-diego-with-kids.html">family itinerary</a></dd></div>
            <div><dt>New York City</dt><dd><a href="./things-to-do/new-york-city-with-kids.html">Activity guide</a> and <a href="./where-to-stay/new-york-city-with-kids.html">stay guide</a></dd></div>
            <div><dt>Chicago</dt><dd><a href="./things-to-do/chicago-with-kids.html">Activity guide</a> and <a href="./where-to-stay/chicago-with-kids.html">stay guide</a></dd></div>
            <div><dt>Las Vegas</dt><dd><a href="./things-to-do/las-vegas-with-kids.html">Activity guide</a> and <a href="./where-to-stay/las-vegas-with-kids.html">stay guide</a></dd></div>
          </dl>
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

writeSite("where-to-stay/san-diego-family-hotels.html", sanDiegoFamilyHotelPage());
writeSite("where-to-stay/las-vegas-family-hotels.html", lasVegasFamilyHotelPage());
writeSite("where-to-stay/chicago-family-hotels.html", chicagoFamilyHotelPage());
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
    <meta name="robots" content="noindex, follow">
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
          <p>Choose family-friendly activities, areas to stay, and starter itineraries by city, age, stroller difficulty, weather, lodging base, and trip pace. Family Tripwise is built for practical decisions: where to stay, what to do, what to skip, and how to keep the day realistic when kids, meals, weather, parking, and naps change the plan.</p>
        </div>
      </section>
      <section class="container trust-panel about-summary" aria-label="Current scope">
        <p><strong>Current scope:</strong> Five active destination clusters: San Diego, Las Vegas, New York City, Chicago, and San Antonio.</p>
        <p><strong>How to use this site:</strong> Start with the page that matches your hardest constraint. If lodging drives the trip, use where-to-stay first. If kid age or weather drives the trip, use things-to-do first. If you already know the city and base, use the itinerary page to avoid overpacking the day.</p>
      </section>
      <section class="band intro-band">
        <div class="container answer-grid">
          <div>
            <p class="eyebrow">Start here</p>
            <h2>Pick the planning question you need to answer</h2>
            <p>Most family trips fail in the handoffs: the hotel is too far from the first activity, the pool is not useful at nap time, the stroller route is harder than expected, or a rainy-day backup requires crossing the city twice. The home page is a routing hub for the current clusters, not a generic travel magazine front page.</p>
            <p>Use the links below to move from broad destination choice to a concrete plan. Each destination cluster is designed to connect stay area, activity fit, route pacing, and age-specific tradeoffs.</p>
          </div>
          <dl class="snapshot">
            <div><dt>Where should we stay?</dt><dd>Use area matrices and hotel verification checks before comparing room prices.</dd></div>
            <div><dt>What should we do?</dt><dd>Use activity tables by age, weather, stroller friction, budget, and nap fit.</dd></div>
            <div><dt>Can the day work?</dt><dd>Use itinerary variants for 1-day, 2-day, 3-day, toddler, teen, and rainy-day plans.</dd></div>
            <div><dt>Can we trust the claim?</dt><dd>Use the methodology page to separate sourced facts, model-derived guidance, and human-reviewed claims.</dd></div>
          </dl>
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
      <section class="container page-section">
        <div class="section-heading">
          <p class="eyebrow">Current priority paths</p>
          <h2>Fast routes through the site</h2>
        </div>
        <div class="card-grid">
          <article class="activity-card">
            <h3>San Diego family stay planning</h3>
            <p>Use San Diego when the main question is family-friendly hotels, pool value, Mission Bay vs Downtown, zoo drives, beach access, parking, and whether a hotel can support naps and early bedtimes.</p>
            <p><a class="text-link" href="./where-to-stay/san-diego-family-hotels.html">Compare San Diego family hotels</a></p>
            <p><a class="text-link" href="./where-to-stay/san-diego-with-kids.html">Compare San Diego stay areas</a></p>
          </article>
          <article class="activity-card">
            <h3>New York City first family trip</h3>
            <p>Use NYC when the main question is Central Park, AMNH, ferries, observation decks, Upper West Side vs Midtown, subway/stroller friction, and how to keep a tourist itinerary from crossing town too often.</p>
            <p><a class="text-link" href="./things-to-do/new-york-city-with-kids.html">Plan things to do in New York City with kids</a></p>
          </article>
          <article class="activity-card">
            <h3>Las Vegas with kids</h3>
            <p>Use Las Vegas when pool setup, heat, resort walking, smoke exposure, Red Rock, indoor backups, and short visual stops matter more than a long list of adult-focused attractions.</p>
            <p><a class="text-link" href="./things-to-do/las-vegas-with-kids.html">Plan Las Vegas with kids</a></p>
            <p><a class="text-link" href="./where-to-stay/las-vegas-family-hotels.html">Compare Las Vegas family hotels</a></p>
          </article>
          <article class="activity-card">
            <h3>Chicago family stay and activity pairing</h3>
            <p>Use Chicago when you need to compare River North, the Loop, South Loop, Navy Pier, or Wrigleyville, then choose between suite, kitchen, pool, museum-base, and older-kid hotel setups.</p>
            <p><a class="text-link" href="./where-to-stay/chicago-with-kids.html">Compare Chicago stay areas with kids</a></p>
            <p><a class="text-link" href="./where-to-stay/chicago-family-hotels.html">Compare Chicago family hotels</a></p>
          </article>
        </div>
      </section>
      <section class="band intro-band">
        <div class="container answer-grid">
          <div>
            <p class="eyebrow">Trust and caveats</p>
            <h2>How Family Tripwise handles uncertain travel claims</h2>
            <p>Family Tripwise uses research-based planning notes. We do not present hotel, safety, transit, stroller, area, or family-suitability claims as personally verified unless a human reviewer supplied that note. Where details can change, the page should point you toward what to verify before booking or promising a plan.</p>
            <p>That means a hotel section may identify what to check on official property pages instead of naming a single “best” hotel. It also means a route note may say to verify elevator access, parking, timed-entry rules, weather, or child energy rather than claiming the route always works.</p>
            <p><a class="text-link" href="./about.html">Read how Family Tripwise builds and labels guides</a></p>
          </div>
          <dl class="snapshot">
            <div><dt>Hotel claims</dt><dd>Verify room setup, fees, pool, breakfast, crib/rollaway, kitchen/laundry, parking, and noise.</dd></div>
            <div><dt>Route claims</dt><dd>Verify hours, tickets, weather, safety advisories, transit/stroller access, parking, and child energy.</dd></div>
            <div><dt>Search data</dt><dd>GSC and SEO research guide improvements, but useful parent decision support is the actual product.</dd></div>
            <div><dt>Expansion rule</dt><dd>Existing pages should be improved before adding new destination clusters or unsupported hotel pages.</dd></div>
          </dl>
        </div>
      </section>
      <section class="container page-section">
        <div class="section-heading">
          <p class="eyebrow">Age-specific planning</p>
          <h2>When kid age changes the answer</h2>
        </div>
        <div class="card-grid">
          <article class="activity-card"><h3>San Diego with toddlers</h3><p>Use this when Mission Bay, zoo bus tour, Birch Aquarium, short beach sessions, and hotel resets are more important than seeing the whole city.</p><p><a class="text-link" href="./things-to-do/san-diego-with-toddlers.html">Open San Diego toddler guide</a></p></article>
          <article class="activity-card"><h3>San Diego with teens</h3><p>Use this when La Jolla, coast time, food stops, zoo highlights, and fewer little-kid resets are the better trip shape.</p><p><a class="text-link" href="./things-to-do/san-diego-with-teens.html">Open San Diego teen guide</a></p></article>
          <article class="activity-card"><h3>Chicago with teens</h3><p>Use this when architecture, museums, Riverwalk food, skyline views, and weather-aware routing matter more than playground-heavy pacing.</p><p><a class="text-link" href="./things-to-do/chicago-with-teens.html">Open Chicago teen guide</a></p></article>
          <article class="activity-card"><h3>Las Vegas with teens</h3><p>Use this when Red Rock, immersive exhibits, shows, food, heat, and late-day energy require different choices than a younger-kid trip.</p><p><a class="text-link" href="./things-to-do/las-vegas-with-teens.html">Open Las Vegas teen guide</a></p></article>
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
  <url><loc>https://familytripwise.com/where-to-stay/san-diego-family-hotels.html</loc></url>
  <url><loc>https://familytripwise.com/where-to-stay/las-vegas-family-hotels.html</loc></url>
  <url><loc>https://familytripwise.com/where-to-stay/chicago-family-hotels.html</loc></url>
${cities.flatMap((city) => [
  `  <url><loc>https://familytripwise.com/things-to-do/${city.slug}-with-kids.html</loc></url>`,
  `  <url><loc>https://familytripwise.com/where-to-stay/${city.slug}-with-kids.html</loc></url>`,
  `  <url><loc>https://familytripwise.com/family-itinerary/${city.slug}-with-kids.html</loc></url>`
]).join("\n")}
${agePages.map((page) => `  <url><loc>https://familytripwise.com/things-to-do/${page.slug}-with-${page.age}.html</loc></url>`).join("\n")}
</urlset>
`);

writeSite("robots.txt", `User-agent: *
Allow: /

Sitemap: https://familytripwise.com/sitemap.xml
`);

upgradePriorityPages(outDir);

console.log("Generated 23 SEO pages plus about, index, redirects, robots, and sitemap.");
