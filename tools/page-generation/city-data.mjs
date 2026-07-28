export const cities = [
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
    activitiesLastUpdated: "July 28, 2026",
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
      ["The New Children's Museum", "toddler preschool elementary rain stroller", "2-3 hrs", "$$", "Good", "Yes", "High", "Downtown", "A hands-on Downtown anchor for younger kids; check the museum calendar for current hours and closure notices."],
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

export const agePages = [
  { slug: "chicago", age: "teens", volume: "720 exact; 320 for Chicago with teens" },
  { slug: "las-vegas", age: "teens", volume: "590 exact; 720 alternate word order" },
  { slug: "new-york-city", age: "teens", volume: "590 exact; 480 alternate word order" },
  { slug: "san-diego", age: "teens", volume: "590 exact" },
  { slug: "san-diego", age: "toddlers", volume: "260 exact; 260 San Diego toddler activities" },
  { slug: "san-antonio", age: "teens", volume: "140 exact; 390 alternate word order" }
];
