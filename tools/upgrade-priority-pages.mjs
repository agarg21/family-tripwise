import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const markerStart = "<!-- priority-upgrade:start -->";
const markerEnd = "<!-- priority-upgrade:end -->";
const schemaStart = "<!-- schema:start -->";
const schemaEnd = "<!-- schema:end -->";

const activityPages = {
  "things-to-do/san-diego-with-kids.html": {
    title: "Things to Do in San Diego With Kids: Age, Stroller, Rain and Nap Guide",
    description:
      "Plan things to do in San Diego with kids by age, stroller difficulty, rainy-day backup, nap-friendliness, parking, timing, and nearby pairings.",
    city: "San Diego",
    quick: [
      ["Best overall", "San Diego Zoo", "Best single anchor for most ages if you start early and avoid trying to see every zone."],
      ["Best for toddlers", "Mission Bay beach morning", "Calmer water, flexible timing, and easy bail-out if naps win."],
      ["Best for teens", "La Jolla Cove or Belmont Park", "Choose coast and scenery or rides and boardwalk energy instead of a younger-child museum day."],
      ["Best rainy-day option", "Fleet, The New Children's Museum, or Birch Aquarium", "Choose by child age and location. The New Children's Museum announced a July 21-26, 2026 Comic-Con closure."],
      ["Best full paid day", "SeaWorld, LEGOLAND, or Safari Park", "Pick one based on child interest and geography; none is a sensible add-on to another major anchor."],
      ["Best free/low-cost", "Mission Bay, La Jolla coast, or Coronado waterfront", "Parking or ferry cost is the main friction; keep the rest of the day light."]
    ],
    personaRoutes: [
      [
        "First-time family",
        "Use this page to pick one signature anchor, then move to the itinerary page so zoo, Balboa Park, bay, La Jolla, meals, and rest windows do not become a cross-city sprint.",
        [
          ["../family-itinerary/san-diego-with-kids.html", "Build the San Diego family itinerary"]
        ]
      ],
      [
        "Toddler, nap, or stroller-sensitive family",
        "Use the toddler guide when short sessions, exits, hotel reset time, stroller handling, bathrooms, and snack timing matter more than seeing the longest attraction list.",
        [
          ["./san-diego-with-toddlers.html", "Open San Diego with toddlers"]
        ]
      ],
      [
        "Teen or tween family",
        "Use the teen guide when the trip needs more coastline, food, independent-feeling stops, and fewer playground-style decisions.",
        [
          ["./san-diego-with-teens.html", "Open San Diego with teens"]
        ]
      ],
      [
        "Lodging-led planner",
        "If hotel pool, beach access, parking, room setup, or midday returns will decide the trip, choose the stay base and hotel shortlist before locking the activity order.",
        [
          ["../where-to-stay/san-diego-with-kids.html", "Compare stay areas"],
          ["../where-to-stay/san-diego-family-hotels.html", "Compare family hotels"]
        ]
      ],
      [
        "Rainy, free, or budget planner",
        "Use official source pages before planning around a discount or weather backup. Treat October Kids Free and museum offers as date-specific checks, not evergreen guarantees.",
        [
          ["https://www.sandiego.org/c/kids-free", "Check Kids Free San Diego"],
          ["https://sandiegomuseumcouncil.org/specials/kidsfree/", "Check Museum Council offers"]
        ]
      ]
    ],
    officialChecks: [
      [
        "Rainy-day backup",
        "Start with Birch Aquarium or one Balboa Park museum, then verify current hours, timed-entry rules, parking, and whether the exhibit mix fits your child before promising it.",
        [
          ["https://aquarium.ucsd.edu/plan-your-visit", "Birch Aquarium plan your visit"],
          ["https://balboapark.org/", "Balboa Park visitor info"]
        ]
      ],
      [
        "Free or lower-cost day",
        "Mission Bay, Balboa Park outdoor time, ferry/waterfront walks, and La Jolla coast can keep ticket costs low, but parking, meals, and transport still decide the real day cost.",
        [
          ["https://www.sandiego.org/c/kids-free", "San Diego Tourism Authority Kids Free"],
          ["https://sandiegomuseumcouncil.org/specials/kidsfree/", "San Diego Museum Council Kids Free"]
        ]
      ],
      [
        "Water, beach, and bay check",
        "Before making a bay or beach stop the family reset plan, check current beach and bay status plus weather, tides, parking, shade, and restrooms for the exact spot.",
        [
          ["https://www.sandiegocounty.gov/content/sdc/deh/lwqd/beachandbay.html", "County beach and bay status"]
        ]
      ]
    ],
    clusterLinks: [
      ["San Diego toddler guide", "Use this when naps, short sessions, stroller handling, bathrooms, and easy exits are the binding constraint.", "./san-diego-with-toddlers.html", "Open San Diego with toddlers"],
      ["San Diego teen guide", "Use this when older kids need coast, food, adventure options, and less toddler-paced structure.", "./san-diego-with-teens.html", "Open San Diego with teens"],
      ["San Diego stay areas", "Use this before finalizing activities if the hotel base, parking, beach route, pool, or midday reset drives the trip.", "../where-to-stay/san-diego-with-kids.html", "Open where to stay in San Diego with kids"],
      ["San Diego family hotels", "Use this when exact room setup, pool value, breakfast, kitchen, and rough nightly range matter before activity order.", "../where-to-stay/san-diego-family-hotels.html", "Open San Diego family hotels"],
      ["San Diego family itinerary", "Use this after choosing anchors to sequence 1-day, 2-day, toddler, teen, and rainy-day plans without overpacking.", "../family-itinerary/san-diego-with-kids.html", "Open the San Diego family itinerary"],
      ["How claims are handled", "Review the methodology page for source policy, human-review boundaries, and model-derived planning notes.", "../about.html", "Read the methodology"]
    ],
    rows: [
      ["San Diego Zoo", "2-14", "4-6 hrs", "$$$", "Balboa Park", "Moderate", "No", "Medium", "Book ahead in peak periods", "Biggest family payoff in one place", "Balboa Park playground or one museum"],
      ["Mission Bay beach morning", "0-8", "2-3 hrs", "$", "Mission Bay", "Mixed sand/paved", "No", "High", "No", "Low-pressure water and sand time", "Hotel pool, Belmont Park, casual tacos"],
      ["Balboa Park museums", "4-14", "2-4 hrs", "$$", "Balboa Park", "Easy in core", "Yes", "Medium", "Check timed exhibits", "Good weather-proof culture stop", "Zoo, playground, gardens"],
      ["Birch Aquarium", "2-10", "90 min-2 hrs", "$$", "La Jolla", "Easy", "Partial", "High", "Often helpful", "Manageable size and ocean views", "La Jolla Shores or Cove drive-by"],
      ["La Jolla Cove", "7+", "2-4 hrs", "$", "La Jolla", "Hard", "No", "Low", "No", "Memorable coast and sea-life viewing", "Birch Aquarium, casual lunch"],
      ["Coronado ferry/waterfront", "4+", "2-3 hrs", "$$", "Downtown/Coronado", "Easy", "No", "Medium", "Check ferry times", "Scenic outing with built-in transport", "Waterfront dinner or beach walk"],
      ["SeaWorld San Diego", "3+", "Full day", "$$$", "Mission Bay", "Easy paths", "Partial", "Low", "Book/check schedule", "Animals, presentations, and rides in one paid day", "Mission Bay or hotel reset"],
      ["LEGOLAND California", "2-12", "Full day", "$$$", "Carlsbad", "Easy paths", "Partial", "Low", "Book/check hours", "Strongest for LEGO-focused younger kids", "North County hotel or early dinner"],
      ["San Diego Zoo Safari Park", "4+", "Full day", "$$$", "Escondido", "Mixed", "No", "Low", "Book/check heat", "A distinct large-scale wildlife day", "Early dinner and rest"],
      ["The New Children's Museum", "1-9", "2-3 hrs", "$$", "Downtown", "Easy", "Yes", "High", "Closed Jul 21-26, 2026; check calendar", "Hands-on younger-child Downtown anchor", "Waterfront Park or early meal"],
      ["Fleet Science Center", "3-13", "2-4 hrs", "$$", "Balboa Park", "Easy", "Yes", "Medium", "Check film times", "Interactive science plus dome theater", "One Balboa Park outdoor stop"],
      ["Belmont Park", "6+", "2-4 hrs", "$$-$$$", "Mission Beach", "Mixed", "Partial", "Low", "Check ride hours", "Flexible rides and boardwalk energy", "Mission Bay or beach walk"]
    ],
    details: [
      ["SeaWorld San Diego", "Families can combine animals, presentations, and rides without changing locations.", "Best when preschoolers through teens share at least one interest.", "Height splits, show timing, heat, lines, and a high total cost can fragment the day.", "Choose the family's top two priorities before arrival and use the official app for current schedules.", "Food and family restrooms are inside; check outside-food and stroller policies before packing.", "Check dated hours, closures, height rules, and ticket terms.", "Pair only with a Mission Bay or hotel reset."],
      ["LEGOLAND California", "The park has unusually strong focus for LEGO-loving younger children.", "Best for toddlers through elementary-age kids; older siblings need ride-interest checks.", "Carlsbad travel, height splits, seasonal Water Park hours, and trying to return to central San Diego afterward.", "Treat it as a North County day and arrive near opening.", "Use the park app and plan one calm meal window before the afternoon dip.", "Check dated hours, temporary closures, height rules, parking, and ticket terms.", "Pair with a North County hotel or an early dinner, not a central-city attraction."],
      ["San Diego Zoo Safari Park", "Families get a larger-scale wildlife setting that feels different from the city zoo.", "Best for preschoolers through teens who tolerate a large outdoor day.", "Escondido travel, heat, parking, and the park's large footprint.", "Choose Safari Park or Zoo for the trip unless the family genuinely wants two full wildlife days.", "Use the official map to place meals, shade, and rest around the must-see animals.", "Check current hours, parking, heat, optional safari costs, and attraction schedules.", "Pair with an early meal and rest, not another ticketed anchor."],
      ["The New Children's Museum", "Hands-on installations give younger children a real Downtown indoor anchor.", "Best for toddlers through early elementary kids.", "It may skew young for tweens and teens; it is normally closed Tuesdays and announced a July 21-26, 2026 Comic-Con closure.", "Use it for two or three hours rather than filling an entire family day.", "Plan lunch nearby and verify Waterfront Park conditions before relying on the outdoor pairing.", "Check current hours, closure notices, admission, events, and the museum calendar.", "Pair with Waterfront Park, Seaport Village, or a hotel reset."],
      ["Fleet Science Center", "Interactive exhibits and a dome-theater film create a useful science and weather-backup choice.", "Best for preschoolers through tweens, with exhibit fit varying by age.", "Museum overlap, film timing, and trying to add too many Balboa Park stops.", "Choose the film and one or two exhibit priorities before entering.", "The official page lists an on-site cafe; confirm its current hours if it anchors the meal plan.", "Check current admission, film schedule, and accessibility-morning dates.", "Pair with one garden, playground, or short Balboa Park walk."],
      ["Belmont Park", "Families can choose a few rides, food, and beach time without committing to a full theme-park day.", "Best for elementary kids, tweens, and teens after checking ride heights.", "Crowds, noise, ride-by-ride cost, height splits, and Mission Beach parking.", "Set a ride or spending limit before arrival and keep the beach portion optional.", "Food is available in the park; verify restrooms and beach conditions for the exact plan.", "Check current ride hours, ticket options, closures, and height rules.", "Pair with Mission Bay or a short beach walk, not another major paid attraction."]
    ],
    compactDetails: true,
    comparisonNote: "Age fit, time, cost tier, stroller, rain, nap, and booking labels are Family Tripwise editorial estimates. Verify current venue rules and conditions for the trip date.",
    detailsEyebrow: "Extra planning",
    detailsTitle: "What changes when you choose a major paid or day-trip option",
    detailsNote: "The comparison table covers all 12 choices. These six additions need extra planning because of geography, height splits, operating schedules, or a larger time and ticket commitment.",
    plans: {
      "1-day plan": "Start at the zoo when it opens, use the bus tour first, eat nearby, rest after lunch, then choose Mission Bay or a hotel pool instead of crossing to La Jolla.",
      "2-day plan": "Day 1: Zoo plus a short Balboa Park stop. Day 2: Birch Aquarium and La Jolla for older kids, or Mission Bay plus The New Children's Museum for younger kids.",
      "Rainy-day plan": "Use Fleet, The New Children's Museum, Birch Aquarium, or one Balboa Park museum as the anchor, chosen by age and hotel location.",
      "Big-ticket day": "Choose SeaWorld, LEGOLAND, or Safari Park as the only major anchor. Protect the evening and avoid promising a second paid attraction.",
      "Teen-friendly plan": "Choose La Jolla coast or Belmont Park, add one food stop, then use Coronado or the waterfront only if the route stays simple."
    },
    faqs: [
      ["What is the best thing to do in San Diego with kids?", "For most families, the San Diego Zoo is the best single anchor activity, but Mission Bay is easier for toddlers and La Jolla is better for teens."],
      ["How many days do families need in San Diego?", "Three days is enough for a zoo day, a beach or bay day, and a La Jolla or Coronado day without rushing."]
    ]
  },
  "things-to-do/san-antonio-with-kids.html": {
    title: "Things to Do in San Antonio With Kids: Heat, River Walk and Family Pacing Guide",
    description:
      "Plan San Antonio with kids using heat-aware timing, stroller difficulty, rainy-day backups, nap-friendly activities, River Walk logistics, and family pairings.",
    city: "San Antonio",
    quick: [
      ["Best overall", "The DoSeum plus Pearl", "The strongest younger-kid anchor with a calmer nearby food/reset area."],
      ["Best for toddlers", "The DoSeum", "Hands-on, indoors, and easier to end than a large outdoor attraction."],
      ["Best for teens", "Natural Bridge Caverns or Six Flags Fiesta Texas", "Higher payoff for older kids who want adventure or rides."],
      ["Best rainy-day option", "The DoSeum", "The most useful indoor family backup."],
      ["Best free/low-cost", "Alamo plus short River Walk loop", "Keep it brief and avoid peak heat."],
      ["Best stroller-friendly", "Pearl/Museum Reach", "Often calmer than the busiest Downtown River Walk segments."],
      ["Best half-day anchor", "San Antonio Zoo", "Works best as an early start, especially in warm months."],
      ["Best if you only have one day", "Alamo, boat ride, Pearl or DoSeum", "Covers the city signature without an overheated marathon."]
    ],
    rows: [
      ["The Alamo", "6+", "60-90 min", "$", "Downtown", "Easy", "Partial", "Medium", "Timed entry may help", "Essential context stop if kept short", "River Walk boat ride"],
      ["River Walk boat ride", "3+", "45-60 min", "$$", "Downtown", "Limited boarding", "Partial", "Medium", "Check times", "Low-walking orientation activity", "Alamo or early dinner"],
      ["The DoSeum", "1-9", "2-4 hrs", "$$", "Broadway", "Easy", "Yes", "High", "Check tickets", "Best hands-on younger-kid stop", "Pearl food/reset"],
      ["San Antonio Zoo", "2-10", "3-5 hrs", "$$", "Brackenridge Park", "Easy", "No", "Medium", "Book/check hours", "Classic family half-day", "Japanese Tea Garden or park reset"],
      ["Natural Bridge Caverns", "8+", "2-4 hrs", "$$$", "North of city", "Hard", "Partial", "Low", "Book ahead", "Adventure payoff for older kids", "Drive-friendly meal stop"],
      ["Six Flags Fiesta Texas", "10+", "Half-full day", "$$$", "Northwest", "Mixed", "No", "Low", "Book ahead", "Teen-heavy thrill day", "Hotel pool reset"]
    ],
    details: [
      ["The Alamo", "Families like that it gives San Antonio context quickly.", "Best for elementary kids and older.", "Younger kids may lose interest fast and the surrounding area can be hot and crowded.", "Make it a short stop, not the whole morning.", "Use Downtown meals/restrooms as part of the plan and verify current entry rules.", "Timed entry may be useful in peak periods.", "Pair with a boat ride or shaded River Walk segment."],
      ["River Walk boat ride", "Families like sitting down while still seeing the city.", "Best for preschoolers and up.", "Boarding lines, heat, and stroller handling.", "Use it early or near dinner rather than mid-afternoon in summer.", "Plan bathrooms before boarding.", "Check schedules and weather.", "Pair with the Alamo or a simple Downtown meal."],
      ["The DoSeum", "Families like the indoor hands-on structure and easy younger-kid fit.", "Best for toddlers through early elementary kids.", "Overstimulation and school-break crowds.", "Use it as the main toddler activity, then stop before everyone is fried.", "Pearl is a practical food/reset pairing nearby.", "Check hours, special events, and ticketing.", "Pair with Pearl rather than another major attraction."],
      ["San Antonio Zoo", "Families like the familiar zoo format and Brackenridge Park setting.", "Best for toddlers through elementary kids.", "Heat, long walking, and trying to add too much afterward.", "Start early and choose a few zones.", "Verify food and restroom locations on arrival.", "Check seasonal hours and ticket deals.", "Pair with a park reset or very light afternoon."],
      ["Natural Bridge Caverns", "Families like that it feels different from the Downtown/River Walk trip.", "Best for older elementary kids, tweens, and teens.", "Uneven surfaces, walking, drive time, and younger-kid patience.", "Make it the anchor for that half day.", "Plan snacks, water, and bathroom stops before the tour.", "Book ahead and check tour requirements.", "Pair with a low-key evening, not another big paid attraction."],
      ["Six Flags Fiesta Texas", "Families with teens like the ride payoff.", "Best for tweens and teens.", "Heat, cost, lines, and younger siblings with different ride needs.", "Treat it as a full commitment and protect the next morning.", "Use the hotel as the reset plan.", "Buy tickets ahead and check height rules.", "Pair with a pool evening or rest day."]
    ],
    plans: {
      "1-day plan": "Alamo early, River Walk boat ride, lunch/rest, then DoSeum for younger kids or Pearl/mission-style exploring for older kids.",
      "2-day plan": "Day 1: Downtown signature stops. Day 2: DoSeum or zoo for younger kids, Natural Bridge Caverns or Six Flags for older kids.",
      "Rainy-day plan": "Make The DoSeum the anchor, add a short meal at Pearl, and save the zoo or caverns for better weather.",
      "Toddler-friendly plan": "The DoSeum, Pearl reset, hotel nap, then a short boat ride if the evening is mild.",
      "Teen-friendly plan": "Natural Bridge Caverns or Six Flags, Pearl food, and a short evening River Walk segment."
    },
    faqs: [
      ["Is San Antonio good with toddlers?", "Yes, but heat-aware pacing matters. The DoSeum, zoo, short boat rides, and Pearl-area resets work better than long Downtown walks."],
      ["What should families avoid in San Antonio?", "Avoid stacking multiple outdoor attractions in the hottest part of the day, especially with toddlers or stroller naps."]
    ]
  },
  "things-to-do/chicago-with-kids.html": {
    title: "Things to Do in Chicago With Kids: Museums, Parks, Transit and Age Guide",
    description:
      "Plan Chicago with kids by age, weather, stroller difficulty, transit friction, museum pacing, lakefront time, and nearby pairings.",
    city: "Chicago",
    quick: [
      ["Best overall", "Museum Campus", "Field Museum or Shedd gives the biggest family payoff."],
      ["Best for toddlers", "Lincoln Park Zoo", "Flexible, free, and easy to shorten."],
      ["Best for teens", "Architecture boat tour", "More memorable for older kids than another playground stop."],
      ["Best rainy-day option", "Shedd Aquarium or Field Museum", "Both can anchor a bad-weather day."],
      ["Best free/low-cost", "Lincoln Park Zoo or Millennium Park", "Strong family value if weather cooperates."],
      ["Best stroller-friendly", "Lincoln Park Zoo", "More forgiving than crowded downtown sidewalks."],
      ["Best half-day anchor", "Shedd Aquarium", "Works as a contained morning or afternoon."],
      ["Best if you only have one day", "Millennium Park plus one Museum Campus attraction", "Keeps transit simple."]
    ],
    rows: [
      ["Field Museum", "6+", "3-5 hrs", "$$", "Museum Campus", "Easy", "Yes", "Medium", "Check tickets", "Classic Chicago museum anchor", "Lakefront or Shedd"],
      ["Shedd Aquarium", "2-12", "2-4 hrs", "$$$", "Museum Campus", "Easy", "Yes", "High", "Book ahead", "Best indoor younger-kid anchor", "Field Museum lawn or lakefront"],
      ["Lincoln Park Zoo", "0-10", "2-3 hrs", "$", "Lincoln Park", "Easy", "No", "High", "No", "Free flexible animal stop", "Nature Boardwalk or playground"],
      ["Maggie Daley Park", "2-10", "1-2 hrs", "$", "Loop", "Easy", "No", "Medium", "No", "Energy burn near major sights", "Millennium Park"],
      ["Architecture boat tour", "9+", "90 min", "$$$", "River North", "Limited", "No", "Low", "Book ahead", "Best teen/tween signature activity", "Riverwalk meal"],
      ["Navy Pier", "4+", "2-4 hrs", "$$", "Streeterville", "Easy", "Partial", "Medium", "Depends on activities", "Useful mixed-weather fallback", "Ohio Street Beach or lakefront"]
    ],
    details: [
      ["Field Museum", "Families like the big exhibits and easy Museum Campus pairing.", "Best for school-age kids through teens.", "Trying to combine too many museums in one day.", "Choose must-see exhibits first and leave before museum fatigue hits.", "Food/restroom options exist onsite; verify hours for the day.", "Check ticket packages and special exhibits.", "Pair with lakefront time or Shedd, not three museums."],
      ["Shedd Aquarium", "Families like the animal payoff and indoor reliability.", "Best for toddlers through tweens.", "Crowds and timed-entry friction.", "Book ahead and use it as a half-day anchor.", "Plan food and stroller parking on arrival.", "Tickets are often easiest in advance.", "Pair with a short lakefront walk."],
      ["Lincoln Park Zoo", "Families like the free entry and flexible pacing.", "Best for babies through elementary kids.", "Weather exposure and long park wandering.", "Pick a few animal zones and leave room for snack breaks.", "Nearby park areas can serve as resets; verify bathrooms as you go.", "No ticket needed for general admission.", "Pair with the Nature Boardwalk or neighborhood meal."],
      ["Millennium Park / Maggie Daley Park", "Families like quick skyline payoff and playground time.", "Best for toddlers through elementary kids.", "Crowds and overstimulation around big events.", "Use as a first-day orientation stop.", "Food/restrooms vary by route; plan before kids are urgent.", "No booking for park time.", "Pair with the Art Institute exterior, Bean area, or Loop hotel reset."],
      ["Architecture boat tour", "Families with older kids like the clear story and river views.", "Best for tweens and teens.", "Younger kids may not sit still; weather matters.", "Book a time when kids are fed and rested.", "Use bathrooms before boarding.", "Book ahead in peak season.", "Pair with Riverwalk food or a short Magnificent Mile walk."],
      ["Navy Pier", "Families like that it can fill a weather gap.", "Best for preschoolers through teens.", "It can feel commercial and crowded.", "Choose one reason to go, not a vague afternoon wander.", "Food/restroom options are part of the appeal.", "Check activity hours and pricing.", "Pair with lakefront or a short ride back to the hotel."]
    ],
    plans: {
      "1-day plan": "Millennium Park/Maggie Daley Park early, one Museum Campus anchor, then a simple River North or Loop dinner.",
      "2-day plan": "Day 1: Parks and Museum Campus. Day 2: Lincoln Park Zoo plus neighborhood lunch; teens can swap in an architecture boat tour.",
      "Rainy-day plan": "Use Shedd or Field as the anchor, keep transit simple, and save Navy Pier only if you need a second indoor-ish option.",
      "Toddler-friendly plan": "Lincoln Park Zoo, nap/hotel reset, Maggie Daley Park if weather and energy hold.",
      "Teen-friendly plan": "Architecture boat tour, Field Museum highlights, Riverwalk food, and lakefront views."
    },
    faqs: [
      ["Is Chicago stroller-friendly with kids?", "Many attractions are stroller-friendly, but downtown sidewalks, transit elevators, and winter weather can add friction."],
      ["What is the best rainy-day activity in Chicago with kids?", "Shedd Aquarium and Field Museum are the most reliable rainy-day anchors for most families."]
    ]
  },
  "things-to-do/las-vegas-with-kids.html": {
    title: "Things to Do in Las Vegas With Kids: 12 Picks by Trip Style",
    description:
      "Compare 12 things to do in Las Vegas with kids by age, heat and indoor fit, cost, time, location, and trip style, with current official-source checks.",
    city: "Las Vegas",
    compactDetails: true,
    comparisonNote: "Age fit, time, cost, stroller, rain, nap, booking, and value fields are Family Tripwise editorial estimates, not venue guarantees. Recheck the linked official source for the exact date, child, ticket, and experience.",
    quickEyebrow: "Choose a trip shape",
    quickTitle: "Five useful ways to start",
    quickNote: "These are starting routes, not universal rankings. Choose the one that matches the family's age mix, heat tolerance, budget, and interest.",
    quick: [
      ["First Vegas trip", "Bellagio plus one paid anchor", "Use the Conservatory and fountains as the short classic stop, then choose one museum, aquarium, ride, show, or skyline experience."],
      ["Resort-led day", "Pool or hotel reset plus one evening choice", "Verify the exact pool access and rules, then protect the room as a real midday break."],
      ["Younger kids or high heat", "DISCOVERY, Shark Reef, or Adventuredome", "Choose by child interest and height or sensory fit; do not stack all three."],
      ["Tweens and teens", "AREA15, Red Rock, Neon Museum, or Tournament of Kings", "Let older kids choose the anchor, then verify weather, show effects, or exact exhibit rules."],
      ["Free or lower cost", "Bellagio plus Pinball Hall of Fame", "The Bellagio stop is free; Pinball is pay per play, but transport, parking, meals, and game spend still count."]
    ],
    rows: [
      ["Resort pool / reset block", "0-17", "Half day", "Varies", "Your hotel", "Property-specific", "No", "High", "Check exact access", "Builds recovery into the trip", "One short evening anchor"],
      ["Bellagio Conservatory and fountains", "2+", "60-90 min", "Free", "Center Strip", "Route-specific", "Partial", "Medium", "Check schedules/display", "Short classic Vegas visual", "Nearby meal"],
      ["DISCOVERY Children's Museum", "1-9", "2-3 hrs", "Paid", "Downtown", "Check venue", "Yes", "High", "Check calendar", "Child-centered indoor anchor", "Hotel reset"],
      ["Shark Reef Aquarium", "2+", "90 min-2 hrs", "Paid", "South Strip", "Check venue", "Yes", "Medium", "Timed entry", "Contained indoor animal stop", "Pool or early meal"],
      ["Adventuredome", "3+ by ride", "2-4 hrs", "Paid", "North Strip", "Mixed", "Yes", "Low", "Check heights/rides", "Indoor rides with flexible duration", "Simple meal"],
      ["Springs Preserve", "2-12", "2-4 hrs", "Paid", "West of Downtown", "Mixed", "Partial", "Medium", "Check programs", "Museums, gardens, and play space", "Early dinner"],
      ["High Roller observation wheel", "6+", "45-60 min", "Paid", "LINQ", "Check policy", "Yes", "Medium", "Check ticket/stroller", "Contained skyline ride", "LINQ meal"],
      ["AREA15 / selected exhibit", "10+ varies", "2-3 hrs", "Paid", "Off Strip", "Exhibit-specific", "Yes", "Low", "Book exact exhibit", "Immersive older-kid option", "Food/reset nearby"],
      ["Red Rock Canyon Scenic Drive", "6+ varies", "Half day", "Low cost", "West of Strip", "Limited", "No", "Low", "Seasonal timed entry", "Desert contrast to the Strip", "Quiet hotel evening"],
      ["Pinball Hall of Fame", "6+", "60-120 min", "Pay per play", "South Strip", "Mixed", "Yes", "Medium", "No fixed ticket", "Flexible, easy-to-shorten play", "South Strip meal"],
      ["Tournament of Kings", "All ages; fit varies", "Evening", "Paid", "South Strip", "Venue-specific", "Yes", "Low", "Book/check effects", "Concrete dinner-show choice", "Quiet next morning"],
      ["Neon Museum", "7+ varies", "60-90 min", "Paid", "Downtown", "Limited", "No", "Low", "Timed ticket/weather", "Vegas-history evening option", "Downtown meal"]
    ],
    detailsEyebrow: "High-friction choices",
    detailsTitle: "Six choices that need an extra check",
    detailsNote: "The comparison table covers all 12. These six get extra space because property rules, height splits, sensory effects, reservations, or weather can materially change the plan.",
    details: [
      ["Resort pool / reset block", "A hotel-based block can reduce transitions and protect recovery time.", "It only works when the exact property's access, season, rules, shade, and closures fit the stay.", "Assuming a room booking guarantees the pool experience shown in marketing.", "Check the booked property's current pool page and guest eligibility before paying.", "Use the room for food, bathroom, and decompression instead of adding another resort crossing.", "Recheck hours, closures, depth or height rules, and extra charges near the visit.", "Pair with one short evening choice."],
      ["Adventuredome", "It offers rides without committing to outdoor heat.", "Fit changes by the children's heights, ride interests, and response to noise and stimulation.", "Height splits, ride closures, cost, and a loud indoor environment can fragment the group.", "Check the current ride list and height rules before presenting it as a shared family stop.", "Plan a clear meeting and meal break inside or immediately after the visit.", "Recheck hours, ride availability, pass terms, and restrictions.", "Pair with a simple meal and hotel reset."],
      ["AREA15 / selected exhibit", "The district can work when one exact immersive experience matches the older child's interests.", "Each exhibit has its own age, duration, sensory, and ticket rules.", "Buying several experiences without checking fit can make the stop expensive and overstimulating.", "Choose one primary exhibit, price the total, and preserve an exit plan.", "Decide whether onsite food helps or whether the family needs a quieter reset elsewhere.", "Verify the exact exhibit's current age guidance, hours, entry, and accessibility.", "Pair with pool or room downtime."],
      ["Red Rock Canyon Scenic Drive", "It gives the trip a distinct desert half-day away from resort corridors.", "Fit depends on heat, weather, mobility, trail choice, and access to a car.", "Treating a scenic drive and a hike as the same plan, or underestimating heat and limited services.", "Choose the drive or one suitable stop as the anchor and carry the needed water and food.", "Use restrooms before leaving the city and check current visitor facilities.", "A Scenic Drive timed entry is required Oct. 1-May 31 during published daytime hours; recheck BLM conditions.", "Pair with a quiet hotel evening."],
      ["Tournament of Kings", "It packages a recognizable Vegas show and meal into one fixed block.", "The horses, dust, pyrotechnics, strobe, smoke, fog, meal, and timing need family-specific review.", "Assuming all-ages admission means the effects or meal work for every child.", "Review current warnings, seating, meal details, and runtime before buying.", "Plan dietary questions and a calm transition after the show.", "Verify the exact performance, ticket terms, effects notice, and child policy.", "Pair with an easy morning or pool day."],
      ["Neon Museum", "It offers a history-led visual stop that feels different from a resort attraction.", "The collection is outdoors and the payoff depends on interest, weather, and timed-entry fit.", "Heat, wind, poor air, lightning, or a late visit can change the experience or schedule.", "Choose the visit time around current conditions and keep the rest of Downtown simple.", "Plan food, water, and transport before the timed entry.", "Recheck the museum FAQ, weather procedures, hours, and ticket terms.", "Pair with one nearby meal."]
    ],
    plansEyebrow: "Route shapes",
    plansTitle: "Build a Las Vegas day without stacking the Strip",
    plans: {
      "One-day first trip": "Use a verified pool or slow morning, Bellagio as the short classic stop, an early meal, then High Roller or Tournament of Kings, not both.",
      "Two-day mixed-age trip": "Day 1: resort reset, Bellagio, and one evening choice. Day 2: DISCOVERY or Shark Reef for younger kids, or Red Rock/AREA15 for older kids.",
      "Younger kids in heat": "Choose DISCOVERY, Shark Reef, or height-appropriate Adventuredome rides as one indoor anchor, then return to the room or verified pool.",
      "Free or flexible day": "Use Bellagio plus a meal and optional pay-per-play time at Pinball Hall of Fame; count transport, parking, food, and game spend in the real cost.",
      "Older-kid contrast day": "Choose Red Rock for nature or AREA15 for an indoor immersive stop, then use Neon Museum or a show only if weather, energy, and budget still fit."
    },
    clusterTitle: "Move from the shortlist to the stay base and route",
    clusterLinks: [
      ["Where to stay in Las Vegas", "Choose the hotel base before finalizing activities. Pool setup, smoke exposure, resort walking, fees, and room location can change the whole family plan.", "../where-to-stay/las-vegas-with-kids.html", "Open where to stay in Las Vegas with kids"],
      ["Las Vegas family itinerary", "Turn pool time, one classic visual stop, and age-specific anchors into a realistic route instead of a Strip marathon.", "../family-itinerary/las-vegas-with-kids.html", "Open the Las Vegas family itinerary"],
      ["Las Vegas with teens", "Use the teen guide when Red Rock, immersive exhibits, shows, food, and later evenings matter more than toddler pacing.", "../things-to-do/las-vegas-with-teens.html", "Open Las Vegas with teens"]
    ],
    officialChecksEyebrow: "Before locking the day",
    officialChecksTitle: "Three checks that change the shortlist",
    officialChecks: [
      ["Heat and indoor backup", "Indoor does not mean low-stimulation or low-walking. Check the exact venue route, current hours, ride or exhibit rules, and how the family will return to the hotel.", [["https://www.visitlasvegas.com/experience/post/things-to-do-in-las-vegas-with-kids/", "Visit Las Vegas family guide"], ["https://discoverykidslv.org/about/faq/", "DISCOVERY FAQ"]]],
      ["Free and lower-cost plan", "Bellagio is the clearest free visual stop and Pinball is pay per play, but meals, parking, transport, and game spend determine the real day cost.", [["https://bellagio.mgmresorts.com/en/entertainment/fountains-of-bellagio.html", "Bellagio fountains"], ["https://travelnevada.com/museums/pinball-hall-of-fame/", "Pinball Hall of Fame"]]],
      ["Reservation, height, sensory, and weather", "Recheck the exact attraction near the visit. Red Rock reservations, Adventuredome ride rules, AREA15 exhibit terms, Tournament effects, and Neon Museum weather procedures are not interchangeable.", [["https://www.blm.gov/programs/national-conservation-lands/nevada/red-rock-canyon", "Red Rock Canyon NCA"], ["https://www.circuscircus.com/attractions/adventuredome/", "Adventuredome"], ["https://excalibur.mgmresorts.com/en/entertainment/tournament-of-kings.html", "Tournament of Kings"], ["https://neonmuseum.org/faqs/", "Neon Museum FAQ"]]]
    ],
    visibleFaqs: true,
    faqs: [
      ["Is Las Vegas good for kids?", "It can work when the family chooses an age-fit anchor, verifies the hotel and pool setup, limits resort-to-resort walking, and protects time for heat, meals, and recovery."],
      ["What can families do for free in Las Vegas?", "The Bellagio Conservatory and fountains are the clearest short free choice in this set. A low-ticket day can add Pinball Hall of Fame, but transport, parking, meals, and game spend still matter."],
      ["What is a useful indoor or heat backup in Las Vegas?", "For younger kids, compare DISCOVERY Children's Museum, Shark Reef, and height-appropriate Adventuredome rides. For older kids, compare an exact AREA15 exhibit or a show after checking sensory fit and current rules."]
    ]
  },
  "things-to-do/san-diego-with-toddlers.html": {
    title: "Things to Do in San Diego With Toddlers: Naps, Strollers, Beaches and Short Stops",
    description:
      "Plan San Diego with toddlers using short-session activities, stroller notes, nap-friendly timing, bathroom/reset planning, beach choices, and rainy-day options.",
    city: "San Diego",
    compactDetails: true,
    comparisonNote: "Age, time, stroller, rain, nap, booking, and value fields are Family Tripwise editorial estimates, not venue guarantees; check the linked venue and exact beach or park facilities before going.",
    quick: [
      ["Easiest morning", "Mission Bay", "Use one verified bayfront spot for sand and water, then leave before lunch or nap pressure builds."],
      ["Best animal stop", "San Diego Zoo bus tour", "Use the bus and a few zones, not the whole zoo."],
      ["Best rainy-day option", "Birch Aquarium", "Small enough for toddlers and easy to shorten."],
      ["Best if you only have one day", "Zoo bus tour plus Mission Bay", "Two high-payoff toddler activities without too many transitions."]
    ],
    rows: [
      ["Mission Bay", "0-4", "2-3 hrs", "$", "Mission Bay", "Mixed", "No", "High", "No", "Flexible beach morning", "Hotel nap/pool"],
      ["San Diego Zoo bus tour", "2-4", "2-4 hrs", "$$$", "Balboa Park", "Moderate", "No", "Medium", "Book ahead", "Animal payoff without walking every zone", "Balboa Park playground"],
      ["Birch Aquarium", "1-5", "90 min", "$$", "La Jolla", "Easy", "Partial", "High", "Check tickets", "Short indoor/outdoor stop", "La Jolla Shores"],
      ["Balboa Park playground/gardens", "1-5", "60-90 min", "$", "Balboa Park", "Easy", "Partial", "High", "No", "Low-cost reset", "Short museum or zoo add-on"],
      ["Coronado beach walk", "2-5", "1-2 hrs", "$", "Coronado", "Mixed", "No", "Medium", "No", "Calmer vacation-feel outing", "Ferry or early dinner"]
    ],
    details: [
      ["Mission Bay", "Toddlers get open-ended sand and water play without a fixed attraction schedule.", "Best for babies through preschoolers when adults verify the exact bayfront spot.", "Gear load, sun, water conditions, and sandy stroller frustration.", "Arrive early, keep the session short, and leave before lunch pressure builds.", "Use your hotel or verified beach facilities as the bathroom and reset plan.", "Check current beach/bay status, weather, parking, shade, and facilities for the exact spot.", "Pair with a nap and pool rather than another major attraction."],
      ["San Diego Zoo bus tour", "Toddlers get animal payoff without walking every path.", "Best for toddlers who can handle a bus ride and short viewing stops.", "The zoo is too big if adults chase completion.", "Start with the bus tour, then choose one animal zone.", "Food/restrooms are inside, but do not wait until urgent.", "Buy ahead in busy periods.", "Pair with a playground or hotel reset."],
      ["Birch Aquarium", "Toddlers like the tanks and manageable size.", "Best for toddlers and preschoolers.", "It may be over quickly, which is fine if planned as a short stop.", "Treat it as a 90-minute anchor.", "Verify food/restroom setup for the day.", "Check ticket windows.", "Pair with La Jolla Shores, not a long Cove hike."],
      ["Balboa Park playground/gardens", "Toddlers get movement without a full paid attraction.", "Best for toddlers who need a reset.", "The park can sprawl if you wander without a plan.", "Choose one playground/garden area and stop.", "Check restrooms near your chosen area.", "No booking for outdoor time.", "Pair with the zoo bus tour or one short museum."],
      ["Coronado beach walk", "Toddlers like the simpler beach-town pace.", "Best for older toddlers and preschoolers.", "Bridge/ferry logistics can add friction.", "Use it when you want a calmer half day.", "Plan snacks and bathrooms before beach time.", "Check ferry timing if not driving.", "Pair with an early dinner or ferry ride."]
    ],
    plans: {
      "1-day plan": "Zoo bus tour early, one animal zone, hotel nap, then Mission Bay or pool.",
      "2-day plan": "Day 1: Mission Bay and pool. Day 2: Birch Aquarium or zoo bus tour with a Balboa Park reset.",
      "Rainy-day plan": "Birch Aquarium, short meal, hotel reset. Add one Balboa Park museum only if your toddler still has capacity."
    },
    faqs: [
      ["What works well in San Diego with toddlers?", "Mission Bay, the zoo bus tour, Birch Aquarium, and a short Balboa Park stop can support shorter sessions and a midday reset when current conditions and facilities are checked."],
      ["Should toddlers visit La Jolla Cove?", "It can work, but parking, stairs, uneven paths, crowds, and stroller gear need a specific plan. Compare that friction with Birch Aquarium or a verified La Jolla Shores stop before deciding."]
    ],
    clusterLinks: [
      ["All-ages activity hub", "Use the broader guide when siblings, grandparents, or mixed stamina levels change the shortlist.", "./san-diego-with-kids.html", "Open San Diego things to do with kids"],
      ["Family itinerary", "Sequence the toddler choices around arrival, nap, meals, weather, and the hotel reset instead of adding another attraction.", "../family-itinerary/san-diego-with-kids.html", "Open the San Diego family itinerary"],
      ["Stay areas", "Choose the lodging base before promising a midday return; verify the exact hotel route and room setup for your dates.", "../where-to-stay/san-diego-with-kids.html", "Compare San Diego stay areas"]
    ]
  },
  "things-to-do/new-york-city-with-kids.html": {
    title: "Things to Do in New York City With Kids: Strollers, Transit, Museums and One-Day Plans",
    description:
      "Plan New York City with kids by age, stroller difficulty, subway friction, rainy-day museums, nap-friendly routing, free activities, and nearby pairings.",
    city: "New York City",
    placement: "after-intro",
    firstTime: [
      ["Best first-day plan", "Central Park plus AMNH", "Use one Upper West Side zone for outdoor space, a major indoor anchor, bathrooms, and an easier dinner reset."],
      ["Best classic skyline moment", "Staten Island Ferry or Brooklyn Bridge Park", "Pick one lower-stress skyline plan instead of trying to combine every Downtown and Brooklyn landmark."],
      ["Best toddler-first route", "Central Park playground plus CMOM", "Short sessions and a nearby hotel or meal reset matter more than checking off Midtown sights."],
      ["Best older-kid route", "Brooklyn Bridge Park or an observation deck", "Give older kids a skyline payoff, but verify lines, heights, weather, and timed-ticket rules first."],
      ["Best rainy-day fallback", "AMNH as the anchor", "Use one large indoor stop and keep meals nearby rather than crossing town twice in bad weather."],
      ["Best next planning step", "Choose stay area before final route", "Use the NYC stay guide and itinerary page so subway, stroller, and reset plans match your hotel base."]
    ],
    scanRows: [
      ["First-time mixed ages", "Central Park plus AMNH", "0-14", "Good with AMNH backup", "$-$$", "Easier if staying Upper West Side; verify stroller route and museum rules", "../where-to-stay/new-york-city-with-kids.html", "Pick a stay base"],
      ["Toddlers/preschoolers", "Central Park playgrounds or CMOM", "0-6", "CMOM for rain", "$$ for CMOM", "Keep sessions short and confirm elevator/stroller access for your route", "../family-itinerary/new-york-city-with-kids.html", "Build a toddler-paced route"],
      ["Elementary kids", "AMNH, ferry, Central Park", "6-10", "AMNH works best in rain", "$-$$", "Avoid crossing town more than once after lunch", "../family-itinerary/new-york-city-with-kids.html", "Use a 1- or 2-day plan"],
      ["Tweens/teens", "Brooklyn Bridge Park or observation deck", "10-17", "Observation decks are weather-sensitive", "$-$$$", "Transit and line timing matter more than stroller access", "../where-to-stay/new-york-city-with-kids.html", "Choose a teen-friendly base"],
      ["Low-cost day", "Staten Island Ferry plus park time", "4-17", "Partial weather backup", "$", "Boarding/waiting and bathroom timing still need planning", "../family-itinerary/new-york-city-with-kids.html", "Map the day before leaving"],
      ["Bad-weather day", "AMNH or CMOM by age", "0-14", "Best rain plan", "$$", "Keep meals close and avoid two long subway transfers in rain", "../where-to-stay/new-york-city-with-kids.html", "Stay near the rainy-day anchor"]
    ],
    touristNote:
      "This page is for families planning a New York City trip, especially first-time or short-stay visitors. Local weekend events, seasonal calendars, borough-specific repeat visits, and day-trip ideas are a separate future research concept; they are not part of this evergreen tourist guide yet.",
    quick: [
      ["Best overall", "Central Park plus AMNH", "The strongest family day when you want outdoor flexibility and an indoor anchor."],
      ["Best for toddlers", "Central Park playgrounds or CMOM", "Short sessions, bathrooms nearby, and easy hotel-reset potential if you stay uptown."],
      ["Best for teens", "Brooklyn Bridge Park or observation deck", "More skyline payoff and independence than another little-kid museum."],
      ["Best rainy-day option", "American Museum of Natural History", "Big enough to anchor the day without crossing town repeatedly."],
      ["Best free/low-cost", "Staten Island Ferry or Central Park", "High memory value without a major ticket purchase."],
      ["Best stroller-friendly", "Central Park and Brooklyn Bridge Park", "Wide paths beat crowded Midtown sidewalks."],
      ["Best half-day anchor", "AMNH or Brooklyn Bridge Park", "Both pair cleanly with nearby food and a shorter second stop."],
      ["Best if you only have one day", "Central Park, AMNH, early dinner", "Keeps the day in one family-manageable zone."]
    ],
    rows: [
      ["Central Park", "0-17", "2-4 hrs", "$", "Upper Manhattan", "Good", "No", "High", "No", "Flexible outdoor reset with playgrounds", "AMNH or Upper West Side meal"],
      ["American Museum of Natural History", "3-14", "2-4 hrs", "$$", "Upper West Side", "Good", "Yes", "Medium", "Timed tickets helpful", "Best all-age rainy-day anchor", "Central Park"],
      ["Staten Island Ferry", "4+", "90 min", "$", "Lower Manhattan", "Good", "Partial", "Medium", "No", "Free skyline/statue ride", "Battery Park or Downtown meal"],
      ["Children's Museum of Manhattan", "0-6", "90 min-2 hrs", "$$", "Upper West Side", "Good", "Yes", "High", "Check tickets", "Toddler/preschool indoor reset", "Central Park playground"],
      ["Top of the Rock", "7+", "90 min", "$$$", "Midtown", "Mixed", "Yes", "Low", "Book ahead", "Skyline payoff for older kids", "Bryant Park or easy dinner"],
      ["Brooklyn Bridge Park", "2-17", "2-3 hrs", "$", "Brooklyn", "Good", "No", "Medium", "No", "Skyline, playgrounds, and open space", "Brooklyn Heights Promenade"]
    ],
    details: [
      ["Central Park", "Families like that it can be a playground stop, picnic, stroller walk, or teen-friendly wander depending on energy.", "Best for all ages when you choose one zone instead of trying to cross the whole park.", "The park is huge; wandering without a bathroom/food plan burns time fast.", "Pick a playground, lawn, or museum-adjacent corner before you leave the hotel.", "Use nearby museum/cafe options as part of the reset plan rather than improvising after kids are done.", "No booking; check weather and playground/restroom proximity.", "Pair with AMNH or an Upper West Side meal."],
      ["American Museum of Natural History", "Families like the dinosaur, ocean, space, and animal exhibits that work across ages.", "Best for preschoolers through teens, with toddlers needing a shorter highlights route.", "Museum fatigue, timed-entry friction, and trying to see every hall.", "Choose two or three exhibit goals before entering.", "Food and restrooms are onsite, but check current policies and hours.", "Timed tickets are usually worth checking ahead.", "Pair with Central Park rather than a second major museum."],
      ["Staten Island Ferry", "Families like the free harbor ride and skyline views without a full tour commitment.", "Best for preschoolers and up who can handle boarding/waiting.", "Crowds, security lines, and the need to board again for the return.", "Treat it as a Lower Manhattan half-day piece, not a citywide day plan.", "Use bathrooms before boarding and plan food on either side.", "No ticket required; check current service notices.", "Pair with Battery Park, Seaport, or a Downtown hotel reset."],
      ["Children's Museum of Manhattan", "Families like the younger-kid focus and indoor backup value.", "Best for babies, toddlers, and preschoolers.", "Older siblings may outgrow it quickly.", "Use it when a toddler needs a contained activity, not as the whole-family flagship stop.", "Upper West Side food and Central Park can help before or after.", "Check ticketing and exhibit hours.", "Pair with a short Central Park playground session."],
      ["Top of the Rock", "Families with older kids like the clear skyline payoff.", "Best for elementary kids, tweens, and teens.", "Lines, heights, cost, and Midtown crowding.", "Book a time when kids are fed and ready to wait.", "Use bathrooms and snacks before entering the queue.", "Book timed tickets ahead if this is a must-do.", "Pair with Bryant Park or a simple Midtown meal."],
      ["Brooklyn Bridge Park", "Families like the open space, playgrounds, skyline views, and room to decompress.", "Best for toddlers through teens.", "Bridge/DUMBO crowds and subway/elevator planning.", "Choose a pier/playground zone and avoid over-planning the bridge walk with small kids.", "Food and bathrooms vary by pier; check before kids are urgent.", "No booking for park time.", "Pair with Brooklyn Heights Promenade or a ferry/subway ride back."]
    ],
    plans: {
      "1-day plan": "Base the day on the Upper West Side: Central Park playground or walk, AMNH, hotel/rest, then an easy neighborhood dinner.",
      "2-day plan": "Day 1: Central Park plus AMNH. Day 2: Staten Island Ferry for skyline/statue views, then Brooklyn Bridge Park or a Midtown observation deck by age.",
      "Rainy-day plan": "Use AMNH as the main anchor, add CMOM for younger kids if needed, and avoid crossing town twice in bad weather.",
      "Toddler-friendly plan": "Central Park playground, nap/hotel reset, CMOM or a short museum highlights visit.",
      "Teen-friendly plan": "Brooklyn Bridge Park/DUMBO, food stop, observation deck or Broadway matinee if budget and age fit."
    },
    clusterLinks: [
      ["Where to stay in New York City", "Choose the family base before finalizing activities. Upper West Side, Midtown, Downtown, Brooklyn, and Long Island City create different stroller, subway, and reset tradeoffs.", "../where-to-stay/new-york-city-with-kids.html", "Open where to stay in New York City with kids"],
      ["New York City family itinerary", "Turn Central Park, AMNH, ferry, skyline, toddler, teen, and rainy-day ideas into a route with fewer cross-town transfers.", "../family-itinerary/new-york-city-with-kids.html", "Open the NYC family itinerary"],
      ["How claims are handled", "Review the methodology page for source policy, human-review boundaries, and model-derived planning notes.", "../about.html", "Read the methodology"]
    ],
    faqs: [
      ["What is the best thing to do in NYC with kids?", "For most first-time families, Central Park plus the American Museum of Natural History is the most reliable all-age pairing."],
      ["Is New York City stroller-friendly?", "Some parks and museums are stroller-friendly, but subway elevators, crowded sidewalks, and Midtown congestion make route planning important."]
    ]
  }
};

const stayPages = {
  "where-to-stay/san-diego-with-kids.html": {
    title: "Where to Stay in San Diego With Kids: Areas, Family Hotels and Booking Checks",
    description:
      "Compare five areas for a San Diego family trip by beach access, activity routes, car needs, hotel style, midday resets, and nearby kid activities.",
    city: "San Diego",
    stayTool: true,
    hideHotelSection: true,
    quickHeading: "Five areas, matched to different family trips",
    matrixHeading: "Compare the five bases side by side",
    areaNote: "Area-level guidance helps narrow the search. The exact hotel, route, price, and room still determine whether the choice works for your family.",
    areaHeaders: ["Area", "Best starting point for", "Main compromise", "Getting around to test", "Midday reset to test", "Hotel pattern", "Nearby anchors"],
    quick: [
      ["Pool, bay and slower days", "Mission Bay", "Compare first when the hotel and waterfront time are part of the itinerary, not just a place to sleep."],
      ["Coast, aquarium and La Jolla days", "La Jolla", "Compare when coastal access matters more than being central to the whole city."],
      ["Restaurants and an urban base", "Downtown / Little Italy", "Useful for waterfront and meal access; room size, noise, parking, and cross-city drives need more attention."],
      ["Beach-first resort trip", "Coronado", "Compare when Coronado itself is the plan and the family is willing to test off-island routes for other days."],
      ["Central driving base", "Mission Valley / Hotel Circle", "Compare when the itinerary is spread across the city and hotel value matters more than neighborhood atmosphere."]
    ],
    rows: [
      ["Mission Bay", "Pool, bay and resort-centered days", "Routes to coast, Downtown, or North County vary by hotel and day", "Compare current routes from the exact hotel to the first two activity anchors", "Time the real return; use the hotel as part of the day only when that route works", "Resorts, family hotels and some larger-room options", "Mission Bay waterfront and nearby family attractions"],
      ["La Jolla", "Coastal mornings, Birch Aquarium and La Jolla time", "Slopes, parking and cross-city routes vary", "Test hotel-to-activity routes, parking, crossings, and whether a car is needed", "Time the return from each planned stop to the exact hotel", "Coastal, boutique and higher-end hotels", "La Jolla Shores, Cove area and Birch Aquarium"],
      ["Downtown / Little Italy", "Waterfront stops, restaurants and an urban base", "Room size, noise and parking vary by property", "Test walking or transit for planned waterfront stops and map every other route", "Compare meal and activity routes with the family's actual reset window", "Urban hotels and suite properties", "Waterfront, Little Italy and regional transit connections"],
      ["Coronado", "A beach-first stay with resort time", "Mainland routes and timing vary by hotel and destination", "Compare the exact drive, ferry, or bus sequence for planned mainland days", "Time the return before relying on the hotel for a midday break", "Beach resorts and inns", "Coronado beach and waterfront"],
      ["Mission Valley / Hotel Circle", "A central-base hypothesis for a spread-out itinerary", "Neighborhood feel and walkability vary by exact property", "Compare property-level driving routes and current trolley access", "Time each return; central location alone does not prove a practical reset", "Chain hotels, suites and value-oriented options", "Central context toward the zoo, Old Town and multiple corridors"]
    ],
    bookingHeading: "Four checks before choosing the exact hotel",
    clusterHeading: "Continue planning from the chosen base",
    bookingChecks: [
      ["Map the first two days", "Compare each hotel against the family's first two activity days, meals, and likely midday return. A central-looking area can still create awkward routes."],
      ["Check the sleep setup", "Confirm beds, occupancy, sofa-bed wording, crib or rollaway availability, connecting-room rules, elevator access, and room-location requests for the exact room type."],
      ["Compare the nightly total", "Use the same dates and occupancy, then compare taxes, parking, resort fees, breakfast, and likely transport costs rather than the headline room rate alone."],
      ["Confirm the make-or-break amenity", "If the pool, kitchen, breakfast, laundry, beach access, or quiet room request is essential, check the current property page and ask the hotel when the published answer is unclear."]
    ],
    clusterLinks: [
      ["12 family hotel options", "Move from area choice to named hotels with rough nightly prices, room setup, pool and kitchen facts, sampled online-review themes, and a shared map.", "./san-diego-family-hotels.html", "Compare San Diego family hotels"],
      ["Things to do in San Diego", "Use the activity guide to decide whether your hotel should optimize for the zoo, Mission Bay, La Jolla, Coronado, or Balboa Park.", "../things-to-do/san-diego-with-kids.html", "Open San Diego things to do with kids"],
      ["San Diego family itinerary", "Match the stay base to a realistic 1-day, 2-day, 3-day, toddler, teen, or rainy-day route before booking.", "../family-itinerary/san-diego-with-kids.html", "Open the San Diego family itinerary"],
      ["Toddler-specific planning", "If naps, stroller exits, and short sessions drive the trip, cross-check Mission Bay, zoo bus tour, Birch Aquarium, and hotel reset options.", "../things-to-do/san-diego-with-toddlers.html", "Open San Diego with toddlers"],
      ["Teen-specific planning", "If older kids need coast, food, and less little-kid pacing, use the teen guide before committing to a beach or urban base.", "../things-to-do/san-diego-with-teens.html", "Open San Diego with teens"]
    ],
    faqs: [
      ["What is the best area to stay in San Diego with kids?", "Compare Mission Bay first for a pool-and-bay trip, La Jolla for coast and aquarium time, Downtown or Little Italy for an urban restaurant base, Coronado for a beach-first stay, and Mission Valley as a central-base hypothesis. Then test exact hotels, routes, and total prices."],
      ["Where can families compare specific San Diego hotels?", "Use the Family Tripwise San Diego family-hotel shortlist for eight named options organized by trip style, with rough nightly prices, map links, room and amenity facts, and themes from sampled online reviews."],
      ["Can families stay in San Diego without a car?", "Test a car-light plan from exact Downtown or Little Italy hotels first: list the family's activities and meals, then compare every walking, transit, and return route using current MTS service. The area name alone does not establish that the trip will work without a car."]
    ]
  },
  "where-to-stay/las-vegas-with-kids.html": {
    title: "Where to Stay in Las Vegas With Kids: 5 Base Types Compared",
    description:
      "Compare five Las Vegas family stay bases by trip style, activity anchors, transport, resort routine, and main tradeoffs, then move to named hotel options.",
    city: "Las Vegas",
    schemaName: "Las Vegas family stay base options",
    constraintLed: true,
    removeGeneratedBodySections: true,
    hideHotelSection: true,
    visibleFaqs: true,
    baseReplacements: [
      ["<h1>Where to stay in Las Vegas with kids</h1>", "<h1>Where to Stay in Las Vegas With Kids: 5 Base Types Compared</h1>"],
      ["<p>Compare the best family areas in Las Vegas by stroller ease, room size risk, parking, walkability, noise, pool access, and attraction proximity.</p>", "<p>Choose the trip base first: central sights, a pool-led resort stay, a suite routine, Red Rock access, or a Downtown-focused visit. Then compare named hotels.</p>"],
      ["<p><strong>Last updated:</strong> July 5, 2026</p>", "<p><strong>Area and transport sources checked:</strong> July 22, 2026</p>"],
      ["<p><strong>How this guide was built:</strong> Family Tripwise compares official attraction and hotel information, family logistics, search-intent research, and practical planning tradeoffs like age fit, stroller friction, weather backup, nap timing, walking distance, and lodging base.</p>", "<p>Base-type guidance is editorial planning support. Exact walking, stroller, smoke/noise, pool, room, and price details depend on the property, dates, and route.</p>"],
      ["<img src=\"https://commons.wikimedia.org/wiki/Special:Redirect/file/Bellagio%20fountain%20show%202010%20las%20vegas.JPG\" alt=\"The Bellagio fountains and Las Vegas Strip at night.\" loading=\"eager\" decoding=\"async\">", "<img src=\"https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Bellagio_fountain_show_2010_las_vegas.JPG/1280px-Bellagio_fountain_show_2010_las_vegas.JPG\" alt=\"The Bellagio fountains and Las Vegas Strip at night.\" width=\"1280\" height=\"850\" loading=\"eager\" decoding=\"async\">"],
      ["<figcaption>Photo: chensiyuan, Wikimedia Commons, CC BY-SA 4.0. <a href=\"https://commons.wikimedia.org/wiki/File:Bellagio_fountain_show_2010_las_vegas.JPG\">License and source</a>.</figcaption>", "<figcaption>Photo: Chensiyuan via <a href=\"https://commons.wikimedia.org/wiki/File:Bellagio_fountain_show_2010_las_vegas.JPG\">Wikimedia Commons</a>, <a href=\"https://creativecommons.org/licenses/by-sa/4.0/\">CC BY-SA 4.0</a>. No editorial changes; Wikimedia serves this resized preview.</figcaption>"]
    ],
    quickHeading: "Five useful starting points",
    quick: [
      ["First Las Vegas trip", "Center Strip", "Start here when Bellagio, High Roller, shows, and central Strip sights shape most of the plan."],
      ["Pool-led resort trip", "South Strip", "Start here when the resort pool and one or two South Strip attractions are part of the vacation."],
      ["Kitchen or non-gaming priority", "Near-Strip suite base", "Choose the exact hotel first; kitchenette, laundry, casino path, and transport matter more than the area label."],
      ["Red Rock and car-based days", "West side / Summerlin", "Use this base when nature and driving lead the trip, not when the family expects a classic walk-out Strip stay."],
      ["Downtown-focused visit", "Downtown / Fremont", "Consider it when Downtown attractions are intentional; check the exact evening plan, room location, and transport back."]
    ],
    matrixHeading: "Compare the base before the hotel",
    areaHeaders: ["Base type", "Start here when", "What it simplifies", "Transport reality", "Main tradeoff", "Next step"],
    rows: [
      ["Center Strip", "A first visit centered on Bellagio, High Roller, shows, or nearby meals", "Keeps several classic sights in the same broad resort corridor", "Walking can still include long indoor detours and outdoor exposure; test the exact hotel exit", "Large-resort scale, crowds, and price vary sharply by property", "Compare Center Strip hotels and map the first two days"],
      ["South Strip", "The pool or resort is a major trip anchor", "Pairs the hotel reset with Shark Reef, New York-New York, or a separate central-Strip move", "Rideshare, tram, or longer walks may be needed for Center and North Strip plans", "A strong pool does not guarantee a short room-to-pool or room-to-attraction route", "Confirm pool access and compare the complete stay total"],
      ["Near-Strip suite base", "Kitchen, laundry, room separation, or a reduced casino path matters most", "Makes the room routine the first decision instead of resort spectacle", "Most activities still need a deliberate walk, ride, or drive plan", "The same label covers properties with very different locations and services", "Choose the exact suite hotel before judging the base"],
      ["West side / Summerlin", "Red Rock, Downtown Summerlin, or car-based day trips lead the itinerary", "Reduces the need to cross the Strip before a west-side nature day", "Plan on driving or rideshare for most Strip and Downtown activities", "It is not a walk-out base for the classic Strip experience", "Price parking, drive time, and one Strip evening separately"],
      ["Downtown / Fremont", "Neon Museum, Mob Museum, or Fremont is a deliberate part of the stay", "Keeps Downtown attractions together instead of treating them as a Strip add-on", "Strip activities require a separate ride; late-evening rules and pickup plans matter", "Noise and the evening environment vary by exact property and block", "Check the room location and family evening plan before booking"]
    ],
    areaNote: "Use these as planning starts, not universal rankings. The exact hotel can reverse the area-level tradeoff, especially for walking, stroller handling, casino exposure, pool access, room setup, and total price.",
    bookingHeading: "Three checks that settle the base decision",
    bookingChecks: [
      ["Map the first two days", "Use the exact hotel entrance or rideshare pickup, not the center of an area pin. Check the morning anchor, midday return, dinner, and one evening plan."],
      ["Compare the complete stay", "Compare the same dates and occupancy across room total, mandatory fees, parking, likely rideshares, and breakfast or kitchen needs. Area labels do not establish value."],
      ["Confirm the reset routine", "Verify the exact room setup, pool access, elevator or resort walk, casino path, and meal options that would make the hotel workable for this family."]
    ],
    clusterHeading: "Move from base type to the rest of the trip",
    clusterLinks: [
      ["10 family hotel options", "Compare named properties by trip style, room setup, pool role, rough nightly total, and sampled online-review themes.", "./las-vegas-family-hotels.html", "Compare Las Vegas family hotels"],
      ["Things to do with kids", "Use the 12-choice activity guide to decide whether the base should optimize for the Strip, Downtown, an indoor day, or Red Rock.", "../things-to-do/las-vegas-with-kids.html", "Open Las Vegas things to do with kids"],
      ["Things to do with teens", "Give older kids one anchor, then choose a base that keeps that ticket and the family reset realistic.", "../things-to-do/las-vegas-with-teens.html", "Open Las Vegas with teens"],
      ["Family itinerary", "Sequence the chosen activities and hotel reset before paying for a location that only looks central on a map.", "../family-itinerary/las-vegas-with-kids.html", "Open the Las Vegas family itinerary"]
    ],
    faqTitle: "Las Vegas family stay FAQ",
    faqs: [
      ["What is a useful first area to check for a Las Vegas family trip?", "Check Center Strip first when most plans involve Bellagio, High Roller, shows, and central Strip meals. Use South Strip for a pool-led resort trip, a near-Strip suite for room routine, the west side for Red Rock-led driving, or Downtown when Downtown attractions are the point."],
      ["Should families stay on the Las Vegas Strip?", "The Strip can work when the family's main activities and hotel reset are there. Compare the exact resort exit, indoor and outdoor walking, rideshare plan, room setup, pool access, and complete price rather than treating the whole Strip as one location."],
      ["Where should families compare specific Las Vegas hotels?", "Use the Family Tripwise Las Vegas family-hotel comparison for ten named options with rough total-night ranges, room and amenity facts, recent online-review themes, and map links."]
    ],
    sourcesIntro: "Area and transport sources checked July 22, 2026. Recheck operating details and exact property routes near the trip.",
    sources: [
      ["Las Vegas Monorail route map", "https://www.lvmonorail.com/route-map/"],
      ["RTC Southern Nevada transit", "https://www.rtcsnv.com/ways-to-travel/transit/"],
      ["Mandalay Bay Beach", "https://mandalaybay.mgmresorts.com/en/amenities/beach.html"],
      ["Bellagio fountains", "https://bellagio.mgmresorts.com/en/entertainment/fountains-of-bellagio.html"],
      ["High Roller", "https://www.caesars.com/linq/things-to-do/attractions/high-roller"],
      ["Red Rock Canyon NCA", "https://www.blm.gov/programs/national-conservation-lands/nevada/red-rock-canyon"],
      ["Fremont Street Experience", "https://vegasexperience.com/"],
      ["City of Las Vegas youth-curfew guide", "https://www.lasvegasnevada.gov/News/Blog/Detail/curfew-guide-for-families-what-teens-parents-need-to-know-this-summer"],
      ["Las Vegas photo source and attribution", "https://commons.wikimedia.org/wiki/File:Bellagio_fountain_show_2010_las_vegas.JPG"],
      ["CC BY-SA 4.0 license", "https://creativecommons.org/licenses/by-sa/4.0/"]
    ]
  },
  "where-to-stay/new-york-city-with-kids.html": {
    title: "Where to Stay in New York City With Kids: Best Areas for Families",
    description:
      "Compare the best places to stay in New York City with family by subway access, stroller friction, noise, room size, walkability, parks, museums, and hotel checks.",
    city: "New York City",
    quick: [
      ["Best overall area", "Upper West Side", "Best balance of Central Park, AMNH, calmer evenings, and family food options."],
      ["Best place to stay with family", "Upper West Side for many first trips", "Use it as the default check because park, museum, meals, and calmer evenings cluster together."],
      ["Best for first-timers", "Upper West Side or Midtown", "Choose UWS for family pace, Midtown for shortest access to classic sights."],
      ["Best without a car", "Upper West Side, Midtown, or Downtown", "NYC is a no-car city, but elevator/subway access matters block by block."],
      ["Best with toddlers", "Upper West Side", "Parks, playgrounds, AMNH, and less nighttime chaos."],
      ["Best for museums/parks", "Upper West Side", "Central Park and AMNH make the easiest first family base."],
      ["Best for older kids/teens", "Downtown / Tribeca or Brooklyn Heights", "More neighborhood exploring, waterfront, and food flexibility."],
      ["Best budget-friendly", "Long Island City or Downtown Brooklyn", "Often better space/value, but check transit and evening logistics."],
      ["Think twice about", "Times Square with toddlers", "Convenient on paper, but noise, crowds, and room size can wear families down."]
    ],
    rows: [
      ["Upper West Side", "Toddlers, museums, Central Park", "Longer rides downtown", "Easy subway but elevator-dependent", "Good", "Low-medium", "Hotel parking not the plan", "High", "AMNH, Central Park, CMOM", "Boutique/chain urban hotels", "Best default family base"],
      ["Midtown", "First-timers, transit, shows", "Crowds, noise, small rooms", "Easy but busy", "Mixed", "High", "Expensive/avoid car", "High", "Times Square, Bryant Park, observation decks", "Large urban hotels", "Convenient but tiring"],
      ["Downtown / Tribeca", "Space, waterfront, older kids", "Fewer classic sights nearby", "Good subway/rideshare access", "Good", "Medium", "Expensive/avoid car", "Medium-high", "Ferries, Battery Park, Seaport", "Upscale/suite hotels", "Great if budget allows"],
      ["Brooklyn Heights / Downtown Brooklyn", "Waterfront, calmer evenings", "Bridge/tunnel planning", "Good if near subway", "Good", "Low-medium", "Not needed", "Medium-high", "Brooklyn Bridge Park, Promenade", "Hotels/suites", "Good neighborhood feel"],
      ["Long Island City", "Value, skyline views, subway access", "Less classic NYC outside the hotel", "Good if close to train", "Mixed", "Medium", "Varies", "Medium", "Quick rides to Midtown, parks", "Chain/suite hotels", "Good value if transit pencils out"]
    ],
    areaNote: "Area guidance is planning support, not a personally verified recommendation. Verify subway elevator access, room size, destination fees, stroller route, evening noise, and exact hotel block before booking.",
    hotelDecision: [
      ["Decide the first-trip base", "For many families, the Upper West Side is the first area to test because Central Park, AMNH, CMOM, and calmer meals are close together. Midtown can be better for shows or very short first visits."],
      ["Check stroller and transit reality", "Do not assume a short subway ride is easy with a stroller. Verify station elevator access, transfer count, sidewalk crowding, and whether taxis or rideshares fit your car-seat needs."],
      ["Price room size honestly", "NYC rooms can be tight. Confirm bed count, sofa bed, connecting rooms, occupancy limits, crib availability, elevator waits, and whether luggage/stroller storage works."],
      ["Protect evening decompression", "Noise, crowds, and long dinner waits can matter as much as attraction distance. Ask about room placement and choose a base with realistic nearby food."],
      ["Use official sources", "Check the property room page, hotel FAQ, fee disclosure, cancellation terms, accessibility notes, and booking screen before relying on a third-party snippet."]
    ],
    hotelNote: "Research checked against official hotel and destination pages in July 2026. NYC room sizes, destination fees, crib policies, elevators, and cancellation terms vary sharply by property, so verify the exact room type before booking.",
    hotels: [
      ["Upper West Side family-base hotels", "Best fit for museum-and-park trips", "Prioritize two-bed rooms, suites, or connecting-room policies; many NYC rooms are smaller than families expect", "Pools are uncommon; choose this area for park/museum access instead", "Breakfast varies by property and may be expensive", "Kitchen/laundry is uncommon unless booking an extended-stay or apartment-style property", "Request crib/rollaway details directly and confirm elevator access", "Do not plan to park; use transit/taxi/rideshare and verify destination fees", "Lower than Times Square, but avenue-facing rooms can still be noisy", "Best fit when Central Park, AMNH, CMOM, and calmer evenings matter most."],
      ["Midtown convenience hotels", "Best fit for shows, observation decks, and short first visits", "Room size and elevator waits are the big family checks", "Pools are uncommon and not the main reason to stay here", "Breakfast may add meaningful cost; plan nearby quick-service options", "Kitchen/laundry usually limited", "Confirm crib/rollaway, occupancy, and connecting-room rules before booking", "Parking is expensive; check resort/destination fees before comparing rates", "Times Square/cross-town noise and crowds are the main risk", "Best fit when being close to classic sights beats quiet and space."],
      ["Downtown/Brooklyn suite-style options", "Best fit for families who want more space or a calmer neighborhood", "Look for suite layouts, sofa beds, and a short walk to a useful subway line", "Pools vary and should not be assumed", "Breakfast and kitchenettes are more likely at select-service/suite brands", "Laundry may be easier than in Midtown, but verify by property", "Confirm crib/rollaway and room occupancy policies", "Parking still should not be the default plan", "Usually calmer than Midtown, but subway distance can become the tradeoff", "Best fit when space and evening decompression matter more than being next to every landmark."]
    ],
    bookingChecks: [
      ["Room and fee check", "Verify square footage, bed setup, occupancy, resort/destination fee, crib/rollaway rules, cancellation terms, and whether breakfast or kitchen access is included."],
      ["Transit and stroller check", "Use official transit/elevator information and the hotel address to verify the exact route to your first two activity days before booking."],
      ["Noise and reset check", "Ask about room placement away from elevators, street-facing noise, nightlife, service areas, and event spaces if early bedtime matters."]
    ],
    clusterLinks: [
      ["NYC things to do with kids", "Use the activity guide to decide whether your base should optimize for Central Park/AMNH, Downtown/ferries, Brooklyn views, or Midtown sights.", "../things-to-do/new-york-city-with-kids.html", "Open NYC things to do with kids"],
      ["NYC family itinerary", "Match the stay area to the 1-day, 2-day, 3-day, toddler, teen, or rainy-day route before locking a hotel.", "../family-itinerary/new-york-city-with-kids.html", "Open the NYC family itinerary"],
      ["How claims are handled", "Review the methodology page for source policy, human-review boundaries, and model-derived planning notes.", "../about.html", "Read the methodology"]
    ],
    faqs: [
      ["What is the best area to stay in NYC with kids?", "The Upper West Side is often the lowest-friction default for many families because Central Park, AMNH, CMOM, neighborhood food, and calmer evenings are close together."],
      ["What is the best place to stay in New York City with family?", "For a first family trip, test the Upper West Side first, then compare Midtown, Downtown/Tribeca, Brooklyn Heights/Downtown Brooklyn, and Long Island City against your route, budget, room-size needs, and stroller/transit tolerance."],
      ["Should families stay in Times Square?", "Times Square can be convenient for shows and first-timers, but families with toddlers should think carefully about noise, crowds, room size, and stroller friction."]
    ]
  },
  "where-to-stay/chicago-with-kids.html": {
    title: "Where to Stay in Chicago With Kids: Best Areas, Transit and Family Hotel Checks",
    description:
      "Compare where to stay in Chicago with kids by museum access, stroller and transit friction, parking, noise, walkability, hotel type, and family trip style.",
    city: "Chicago",
    quick: [
      ["Best overall area", "River North / Magnificent Mile", "A practical first-visit base when you want restaurants, river access, and short rides to major sights."],
      ["Best with toddlers", "Lincoln Park", "Zoo, playgrounds, neighborhood meals, and calmer evenings can beat maximum sightseeing efficiency."],
      ["Best for museums", "Loop / Millennium Park or South Loop", "Choose by whether you want park access, Museum Campus proximity, or easier train/rideshare logistics."],
      ["Best for teens", "River North or West Loop", "Better fit for architecture tours, food, lakefront plans, and fewer toddler-focused compromises."],
      ["Best no-car base", "River North, Loop, or West Loop", "A car usually adds parking cost and friction; verify stroller access and elevator needs block by block."],
      ["Best value check", "South Loop or select-service areas near transit", "Only works if the exact hotel still keeps meals and attractions manageable."],
      ["Best quiet-feeling base", "Lincoln Park", "Often a better decompression fit than the busiest downtown blocks."],
      ["Think twice about", "A car-dependent airport or suburban stay", "Rate savings can disappear if each day needs long rides, parking, or tired evening transfers."]
    ],
    areaNote: "Area guidance is research-based planning support, not a human-verified recommendation. Before booking, verify current transit access, elevator availability, parking cost, room setup, neighborhood noise, and walking routes for the exact hotel block.",
    rows: [
      ["River North / Magnificent Mile", "First-timers, restaurants, architecture tours", "Busy sidewalks and higher rates", "Good transit/rideshare access; car usually not helpful", "Mixed on crowded blocks", "Medium-high", "Expensive/limited", "High", "Riverwalk, Navy Pier access, Magnificent Mile", "Urban hotels and larger full-service properties", "Best practical default if downtown energy fits your kids"],
      ["Lincoln Park", "Toddlers, zoo, playgrounds, calmer evenings", "Farther from Loop/Museum Campus sights", "Transit and rideshare planning needed", "Good near parks, mixed by station", "Low-medium", "Varies by property", "High for local meals/parks", "Lincoln Park Zoo, Nature Boardwalk, lakefront", "Boutique/select-service/nearby apartment-style stays", "Best slower family base"],
      ["Loop / Millennium Park", "Short stays, parks, museums, transit", "Quieter evenings and office-district feel", "Strong train access; rideshares useful for Museum Campus", "Good in park core, busier downtown crossings", "Medium", "Expensive/limited", "High in daytime", "Millennium Park, Maggie Daley Park, Art Institute, Museum Campus rides", "Large urban hotels", "Best if park/museum access matters most"],
      ["South Loop / Museum Campus", "Museum Campus, value checks, older kids", "Less classic tourist energy at night", "Good for Museum Campus; transit varies by block", "Good near parks, verify exact route", "Low-medium", "Often easier than core downtown but still paid", "Medium", "Field Museum, Shedd, lakefront, Grant Park", "Select-service, suites, urban hotels", "Good if museums drive the trip"],
      ["West Loop", "Food, teens, stylish hotels", "Less toddler green space immediately outside", "Good rideshare and some transit; verify station distance", "Mixed depending on sidewalks/construction", "Medium", "Paid/varies", "High for restaurants", "Restaurants, Fulton Market, short rides downtown", "Boutique and lifestyle hotels", "Best for food-focused older-kid trips"]
    ],
    hotelNote: "No firm Chicago hotel recommendations are being made in this pass. Use this verification checklist to separate area fit from hotel claims until a human-reviewed hotel workflow exists.",
    verify: [
      ["Room and sleep setup", "Confirm the exact room type, bed count, sofa bed wording, crib/rollaway availability, occupancy limit, and whether connecting rooms are guaranteed or only requested."],
      ["Parking and car plan", "If bringing a car, verify nightly parking cost, in/out privileges, valet-only rules, garage height, and whether daily sightseeing still requires separate attraction parking."],
      ["Transit and stroller access", "Check the exact walk to CTA stations, elevator availability, sidewalk construction, bridge crossings, and whether rideshare pickup is practical with car seats."],
      ["Noise and event risk", "Ask about room placement away from elevators, nightlife, event venues, street noise, and large weekend events if naps or early bedtimes matter."],
      ["Meals and reset options", "Verify breakfast details, mini-fridge/microwave availability, nearby casual meals, grocery access, and whether returning for a midday reset is realistic from your planned sights."],
      ["Pool and weather backup", "Do not assume a pool is useful just because it exists; check pool hours, seasonal limits, kid rules, and whether the hotel has indoor space for bad-weather downtime."]
    ],
    clusterLinks: [
      ["Chicago things to do with kids", "Use the activity guide to decide whether your stay base should optimize for Museum Campus, Lincoln Park Zoo, river architecture, lakefront, or food.", "../things-to-do/chicago-with-kids.html", "Open Chicago things to do with kids"],
      ["Chicago family itinerary", "Match River North, Lincoln Park, Loop, South Loop, or West Loop to a realistic 1-day, 2-day, 3-day, toddler, teen, or rainy-day plan.", "../family-itinerary/chicago-with-kids.html", "Open the Chicago family itinerary"],
      ["Chicago with teens", "Use the teen guide if architecture tours, museums, lakefront views, or food plans matter more than playground and toddler pacing.", "../things-to-do/chicago-with-teens.html", "Open Chicago with teens"],
      ["How claims are handled", "Review the methodology page for source policy, human-review boundaries, and model-derived planning notes.", "../about.html", "Read the methodology"]
    ],
    faqs: [
      ["What is the best area to stay in Chicago with kids?", "River North/Magnificent Mile is the most practical first-visit default for many families, while Lincoln Park can be better for toddlers and calmer evenings."],
      ["Should families rent a car in Chicago?", "Most city-focused family trips work better without a car, but exact transit, stroller, and car-seat needs should be checked against the hotel location."],
      ["Where should families stay for Chicago museums?", "Loop, South Loop, and River North can all work for Museum Campus trips; the best choice depends on hotel block, budget, meals, and how much transit or rideshare friction your family can handle."]
    ]
  },
  "where-to-stay/san-antonio-with-kids.html": {
    title: "Where to Stay in San Antonio With Kids: River Walk, Pearl and Family Hotel Checks",
    description:
      "Compare where to stay in San Antonio with kids by River Walk access, heat, stroller friction, parking, noise, pool value, hotel type, and family trip style.",
    city: "San Antonio",
    quick: [
      ["Best overall area", "Pearl / Museum Reach", "A calmer food-and-walk base for many families if the hotel price and attraction distances work."],
      ["Best first visit", "River Walk / Downtown", "Closest to the classic sights, but noise, crowds, stroller handling, and parking need checking."],
      ["Best with toddlers", "Pearl / Museum Reach or Broadway/DoSeum area", "Usually easier to pair with The DoSeum, zoo, shade breaks, and shorter outings."],
      ["Best for theme parks", "Northwest / SeaWorld area", "Works when SeaWorld or Six Flags is the anchor and a car-based trip is expected."],
      ["Best value check", "Airport / North San Antonio", "Can make sense with a car, but it is less vacation-feeling and farther from signature stops."],
      ["Best no-car-lite base", "Downtown", "Only if your route stays compact and you verify stroller-friendly walking paths and rideshare plans."],
      ["Best heat strategy", "Stay near your main morning anchor", "San Antonio plans work better when midday reset distance is short."],
      ["Think twice about", "A cheap stay far from every anchor", "Heat, parking, and repeated drives can cost more than the room savings are worth."]
    ],
    areaNote: "Area guidance is research-based planning support, not a human-verified recommendation. Before booking, verify current parking costs, pool hours, elevator access, River Walk stroller routes, event noise, heat-season plans, and drive times for the exact hotel.",
    rows: [
      ["Pearl / Museum Reach", "Food, calmer walks, DoSeum/zoo access", "Fewer bargain hotels and still not next to every classic sight", "Car/rideshare useful; some walkable meals", "Generally easier than busiest River Walk segments, verify route", "Low-medium", "Paid/varies by property", "High for meals, medium for attractions", "Pearl, Museum Reach, The DoSeum, zoo by short ride", "Boutique/upscale/select-service nearby", "Best balanced family base if budget works"],
      ["River Walk / Downtown", "First visit, Alamo, boat ride, walkable meals", "Noise, crowds, stroller crowding, parking cost", "Lowest car need for classic sights; rideshares still useful", "Mixed on stairs/crowds/river-level paths", "Medium-high", "Often expensive", "High for signature sights", "Alamo, River Walk, boat rides, Hemisfair", "Large downtown hotels and historic properties", "Best classic first-visit base with caveats"],
      ["Broadway / Brackenridge / DoSeum area", "Toddlers, zoo, DoSeum, shorter younger-kid days", "Less classic River Walk feel", "Car/rideshare likely", "Good around some attractions, verify sidewalks", "Low-medium", "Varies/easier than core downtown in some cases", "Medium", "The DoSeum, San Antonio Zoo, Brackenridge Park", "Select-service and neighborhood hotels nearby", "Best younger-kid logistics candidate"],
      ["Northwest / SeaWorld / Six Flags area", "Theme parks, pools, car-based trips", "Farther from Downtown and Pearl", "Car required", "Hotel-dependent", "Low-medium", "Often easier but verify fees", "Low", "SeaWorld, Six Flags, resort pools", "Resorts, suites, chain hotels", "Best when theme parks are the main trip"],
      ["Airport / North San Antonio", "Value, parking, road access", "Less vacation feel and more driving", "Car required", "Hotel-dependent", "Low-medium", "Often easier", "Low", "Airport, north-side drives, Downtown by car", "Chain/select-service hotels", "Best budget base only if drive time pencils out"]
    ],
    hotelNote: "No firm San Antonio hotel recommendations are being made in this pass. Use this verification checklist to separate area fit from hotel claims until a human-reviewed hotel workflow exists.",
    verify: [
      ["Room and sleep setup", "Confirm the exact bed count, suite wording, crib/rollaway availability, occupancy limit, connecting-room policy, and whether the room location can support naps."],
      ["Parking and resort fees", "Verify nightly parking, valet-only rules, resort/destination fees, in/out privileges, and whether Downtown attractions require separate parking."],
      ["Pool and heat plan", "Check pool hours, shade, seasonal closures, towel rules, and whether the pool is close enough to function as a midday heat reset."],
      ["River Walk stroller route", "For Downtown stays, verify whether the practical route uses stairs, elevators, narrow paths, bridges, or crowded restaurant segments."],
      ["Noise and events", "Ask about room placement away from bars, event spaces, elevators, pool noise, and River Walk-facing late-night activity if early bedtime matters."],
      ["Meals and midday reset", "Verify breakfast, mini-fridge/microwave access, nearby casual meals, and whether your main activities are close enough for a heat-season rest break."]
    ],
    faqs: [
      ["What is the best area to stay in San Antonio with kids?", "Pearl/Museum Reach is often the best balanced family base, while Downtown/River Walk is strongest for a classic first visit if families can manage noise, crowds, and parking."],
      ["Is the San Antonio River Walk stroller-friendly?", "Some routes can work, but stairs, crowds, bridges, narrow paths, and restaurant segments make exact-route verification important before relying on a stroller-heavy plan."],
      ["Should families stay near SeaWorld in San Antonio?", "Stay near SeaWorld or Six Flags when theme parks are the main trip. For Alamo, River Walk, DoSeum, zoo, or Pearl plans, a central base usually reduces driving friction."]
    ]
  }
};

const itineraryPages = {
  "family-itinerary/chicago-with-kids.html": {
    title: "Chicago Itinerary With Kids: 1, 2 and 3 Day Family Plans",
    description:
      "Build a Chicago itinerary with kids using 1-day, 2-day, 3-day, toddler-paced, teen-paced, and rainy-day route options with naps, transit, meals, and skip notes.",
    city: "Chicago",
    links: {
      allAges: "../things-to-do/chicago-with-kids.html",
      stay: "../where-to-stay/chicago-with-kids.html",
      teen: "../things-to-do/chicago-with-teens.html"
    },
    clusterCards: [
      ["All-ages activity guide", "Compare Museum Campus, Lincoln Park Zoo, Maggie Daley Park, boat tours, Navy Pier, and lakefront stops by age, weather, nap fit, and stroller/transit friction.", "../things-to-do/chicago-with-kids.html", "Open Chicago things to do with kids"],
      ["Teen-specific swaps", "Use stronger river, lakefront, museum, and food ideas when older kids need more than playground-heavy pacing.", "../things-to-do/chicago-with-teens.html", "Open Chicago with teens"],
      ["Where to stay first", "Choose the lodging base before locking the route. Loop, River North, Streeterville, Lincoln Park, and West Loop all change transit, stroller, noise, and meal friction.", "../where-to-stay/chicago-with-kids.html", "Open where to stay in Chicago with kids"]
    ],
    quick: [
      ["Best 1-day plan", "Millennium Park, one Museum Campus anchor, easy dinner", "Gives a clear Chicago first-day feel without turning the day into three museums."],
      ["Best 2-day plan", "Parks/Museum Campus plus Lincoln Park or river plan", "Balances one downtown day with a second day that can flex by age and weather."],
      ["Best 3-day plan", "Downtown orientation, museum day, neighborhood/lakefront day", "Adds room for a real rest window and a weather swap instead of stacking attractions."],
      ["Best toddler pace", "Lincoln Park Zoo, nap, Maggie Daley Park if energy holds", "Shorter outdoor blocks and flexible exits beat long museum marathons."],
      ["Best teen pace", "Architecture river plan, Field highlights, Riverwalk food", "Gives older kids skyline, story, and meal payoff without little-kid filler."],
      ["Best rainy-day swap", "Shedd Aquarium or Field Museum as the anchor", "Pick one major indoor stop, keep meals nearby, and save lakefront time for a clearer window."],
      ["Best stay pairing", "Loop/River North for first timers; Lincoln Park for younger-kid rhythm", "Treat this as planning guidance and verify transit, elevator, parking, and noise details before booking."],
      ["What to skip", "Field, Shedd, Navy Pier, and a boat tour in one day", "That much walking, ticket timing, and weather exposure can overwhelm the actual fun."]
    ],
    rows: [
      ["1-day highlights", "Millennium Park/Maggie Daley early; one Museum Campus anchor; simple Loop or River North dinner", "First-time mixed ages", "Post-museum hotel or lakefront reset", "Moderate; downtown walking and transit elevators need checking", "Eat near the museum or near the hotel instead of crossing town hungry", "Second museum, Navy Pier add-on, late boat tour without food"],
      ["2-day first visit", "Day 1 parks and Museum Campus; Day 2 Lincoln Park Zoo or architecture river plan by age", "Weekend families", "Keep one afternoon optional", "Moderate; two core zones over two days", "Use neighborhood meals as the reset plan", "Trying to cover every lakefront and downtown stop"],
      ["3-day balanced plan", "Downtown orientation; museum/lakefront day; Lincoln Park or river/neighborhood day", "Most families", "One protected reset each day", "Lower if you keep each day to one main zone", "Stock snacks and keep dinner close to the stay base", "Making arrival day a full sightseeing day"],
      ["Toddler-paced plan", "Lincoln Park Zoo morning; nap; Maggie Daley or hotel pool/play space if energy holds", "Babies, toddlers, preschoolers", "Nap after lunch is the anchor", "Lower outdoors, but weather and transit elevator access matter", "Use verified nearby casual food and bathrooms", "Multiple paid museums in one day"],
      ["Teen-paced plan", "Architecture river plan; Field or lakefront highlights; Riverwalk or West Loop food", "Tweens and teens", "Reset can be a meal, cafe, or hotel break", "Walking tolerance is higher, but weather can still change the plan", "Let food be part of the route, not a leftover decision", "Toddler-heavy playground pacing all day"],
      ["Rainy-day version", "Shedd or Field as the main block; meal nearby; hotel reset; optional indoor-ish Navy Pier only if needed", "Any age with weather constraints", "Use breaks inside one zone", "Lower if you avoid cross-town transfers in rain", "Do not rely on long exposed walks for meals", "Boat tour or lakefront-heavy day in poor weather"]
    ],
    plans: {
      "Arrival afternoon": "Keep arrival soft: check in, snacks, a short Millennium Park or nearby neighborhood walk if weather cooperates, and an early dinner near the hotel.",
      "Museum Campus day": "Choose Field Museum or Shedd Aquarium as the main event, not both at full depth. Add lakefront time only if weather and energy are still good.",
      "Neighborhood day": "Use Lincoln Park Zoo for younger kids or a river/food plan for older kids. Keep transit simple and verify elevator access if a stroller is part of the plan.",
      "Rain backup": "Use Shedd or Field as the anchor, keep food close, and treat Navy Pier or a hotel reset as optional rather than mandatory.",
      "Toddler adjustment": "Shorten each block, protect the post-lunch rest, and delete the afternoon stop if the morning ran long or weather turned rough.",
      "Teen adjustment": "Trade playground time for architecture, lakefront views, a focused museum section, and a meal teens care about."
    },
    faqs: [
      ["How many days do families need in Chicago?", "Two or three days works best for a first family trip. One day can work if you choose one park zone, one Museum Campus anchor, and an easy dinner instead of chasing every landmark."],
      ["What should families skip on a short Chicago trip?", "Avoid stacking multiple large museums, Navy Pier, and a boat tour into one day. Transit, weather, ticket timing, and tired legs can become the trip."],
      ["What is the easiest rainy-day Chicago itinerary with kids?", "Use Shedd Aquarium or Field Museum as the main anchor, keep meals nearby, and save lakefront, zoo, or boat plans for the clearest weather window."]
    ]
  },
  "family-itinerary/las-vegas-with-kids.html": {
    title: "Las Vegas Itinerary With Kids: 1, 2 and 3 Day Family Plans",
    description:
      "Build a Las Vegas itinerary with kids using 1-day, 2-day, 3-day, toddler-paced, teen-paced, and rainy-day route options with heat, pools, meals, and skip notes.",
    city: "Las Vegas",
    links: {
      allAges: "../things-to-do/las-vegas-with-kids.html",
      stay: "../where-to-stay/las-vegas-with-kids.html",
      teen: "../things-to-do/las-vegas-with-teens.html"
    },
    clusterCards: [
      ["All-ages activity guide", "Compare hotel pools, Bellagio fountains, Discovery Children's Museum, High Roller, Red Rock Canyon, and immersive stops by age, heat, rain, nap fit, and walking friction.", "../things-to-do/las-vegas-with-kids.html", "Open Las Vegas things to do with kids"],
      ["Teen-specific swaps", "Use Red Rock, immersive exhibits, shows, skyline stops, and food plans when older kids need more than pool-and-stroller pacing.", "../things-to-do/las-vegas-with-teens.html", "Open Las Vegas with teens"],
      ["Where to stay first", "Pick the hotel base before the route. Pool setup, room location, casino-floor exposure, parking, resort fees, and walk paths can shape the whole trip.", "../where-to-stay/las-vegas-with-kids.html", "Open where to stay in Las Vegas with kids"]
    ],
    quick: [
      ["Best 1-day plan", "Pool morning, Bellagio visual stop, early dinner, one skyline/show option", "Keeps Vegas memorable without forcing kids through a Strip marathon."],
      ["Best 2-day plan", "Pool/classic visuals plus museum or Red Rock by age", "Gives one resort-centered day and one off-Strip or kid-centered anchor."],
      ["Best 3-day plan", "Arrival pool, classic Strip moment, age-specific anchor", "Adds enough slack for heat, late nights, and sensory overload."],
      ["Best toddler pace", "Pool, nap, Discovery Children's Museum, short fountains stop", "Indoor and hotel-reset blocks matter more than checking off famous sights."],
      ["Best teen pace", "Red Rock or immersive exhibit, pool reset, age-appropriate evening", "Older kids usually need one distinctive anchor beyond hotel wandering."],
      ["Best rainy/heat swap", "Discovery Children's Museum, High Roller, or selected indoor exhibit", "Choose by age and sensory tolerance, then keep resort walking short."],
      ["Best stay pairing", "Hotel pool and room logistics first, sightseeing second", "Treat hotel fit as part of the itinerary and verify fees, pool rules, smoke exposure, and walking routes."],
      ["What to skip", "Aimless Strip walking with tired kids", "Distances, heat, casino detours, and crowds are harder than maps imply."]
    ],
    rows: [
      ["1-day highlights", "Pool morning; Bellagio Conservatory/fountains; early dinner; High Roller or age-appropriate show", "Short first visits", "Midday room/pool reset", "Moderate-high; Strip walking and resort corridors add friction", "Eat before evening crowds and verify kid-appropriate venues", "Multiple casino-resort walks just because they look close"],
      ["2-day first visit", "Day 1 pool and classic visuals; Day 2 Discovery Children's Museum, Red Rock, or Area15-style stop by age", "Weekend families", "Protect one late morning or afternoon at the hotel", "Variable; lower with rideshares/car and a contained hotel base", "Make one dinner easy and one dinner interesting", "Trying to do Red Rock and a long Strip night on the same day"],
      ["3-day balanced plan", "Arrival pool; classic Strip/spectacle day; age-specific off-Strip or nature anchor", "Most families", "One true downtime block daily", "Lower if each day has one main zone", "Stock snacks/water and keep backup meals close", "Making every evening a late night"],
      ["Toddler-paced plan", "Pool; nap; Discovery Children's Museum; one short fountains or conservatory stop", "Babies, toddlers, preschoolers", "Nap or quiet room time is the anchor", "Lower if you avoid long indoor resort walks", "Use hotel meals or verified nearby casual stops", "Late shows, long Strip walks, and loud sensory-heavy stops"],
      ["Teen-paced plan", "Red Rock or immersive exhibit; pool reset; skyline or show option", "Tweens and teens", "Reset can be pool, food, or quiet room time", "Drive/rideshare friction plus heat checks matter", "Let teens choose one food or spectacle piece", "Repeating the same casino-resort wander each day"],
      ["Rainy/heat version", "Indoor museum or exhibit; contained skyline stop; hotel reset", "Any age with weather or heat constraints", "Use the hotel as the main pressure-release valve", "Lower if the plan avoids long outdoor transfers", "Do not rely on walking to find dinner with tired kids", "Outdoor-heavy Red Rock or pool-only day in poor conditions"]
    ],
    plans: {
      "Arrival afternoon": "Use the hotel as the first activity: pool if open, room setup, snacks, and an early dinner. Save the bigger Strip or off-Strip move for a rested block.",
      "Classic Vegas day": "Do one short visual loop, such as Bellagio Conservatory and fountains, then leave before the walking and crowds swallow the day.",
      "Off-Strip day": "Choose Discovery Children's Museum for younger kids, Red Rock for older outdoor-ready kids, or a specific immersive exhibit for teens. Do not make it a vague wandering day.",
      "Rain or heat backup": "Move the main activity indoors, shorten resort corridors, and keep rideshare/car logistics visible. Heat and sensory overload can be as disruptive as rain.",
      "Toddler adjustment": "Protect nap and meal timing, avoid late-night promises, and use the pool or room reset before adding one short evening visual.",
      "Teen adjustment": "Give teens a distinctive anchor, then build in pool or food downtime so the trip does not become only logistics and fees."
    },
    faqs: [
      ["How many days do families need in Las Vegas?", "Two or three days works best if the hotel pool and downtime are part of the trip. One day can work if families keep the plan to pool time, one classic visual stop, and one age-appropriate evening idea."],
      ["What should families skip on a short Las Vegas trip?", "Avoid aimless Strip walking, repeated casino-resort crossings, and late nights every night. Heat, smoke exposure, crowds, and fees can make a simple plan harder than expected."],
      ["What is the easiest rainy-day or heat-day Las Vegas itinerary with kids?", "Use a kid-centered indoor stop, a contained skyline or resort visual, and a hotel reset. Verify current hours, pool rules, ticketing, parking, and transport before committing."]
    ]
  },
  "family-itinerary/new-york-city-with-kids.html": {
    title: "New York City Itinerary With Kids: 1, 2 and 3 Day Family Plans",
    description:
      "Build a New York City itinerary with kids using 1-day, 2-day, 3-day, toddler-paced, teen-paced, and rainy-day route options with transit, meals, strollers, and skip notes.",
    city: "New York City",
    links: {
      allAges: "../things-to-do/new-york-city-with-kids.html",
      stay: "../where-to-stay/new-york-city-with-kids.html"
    },
    clusterCards: [
      ["All-ages activity guide", "Compare Central Park, AMNH, Staten Island Ferry, CMOM, observation decks, and Brooklyn Bridge Park by age, weather, budget, nap fit, and stroller/transit friction.", "../things-to-do/new-york-city-with-kids.html", "Open New York City things to do with kids"],
      ["Where to stay first", "Choose the lodging base before finalizing the route. Upper West Side, Midtown, Downtown, Brooklyn, and Long Island City change subway, stroller, reset, and evening-noise tradeoffs.", "../where-to-stay/new-york-city-with-kids.html", "Open where to stay in New York City with kids"]
    ],
    quick: [
      ["Best 1-day plan", "Central Park, AMNH, early Upper West Side dinner", "Keeps a first family day in one manageable zone with indoor/outdoor flexibility."],
      ["Best 2-day plan", "Uptown park/museum day plus Downtown ferry or Brooklyn skyline day", "Adds classic views without crossing the city repeatedly in one day."],
      ["Best 3-day plan", "Uptown, Downtown/Brooklyn, Midtown or repeat-favorite day", "Gives enough space for weather, transit, and child-energy pivots."],
      ["Best toddler pace", "Central Park playground, CMOM or AMNH, hotel reset", "Short sessions and elevator/stroller planning beat landmark chasing."],
      ["Best teen pace", "Brooklyn Bridge Park, observation deck, food/neighborhood time", "Older kids often need skyline payoff and independence, not only little-kid museums."],
      ["Best rainy-day swap", "AMNH or CMOM by age, meals nearby, hotel reset", "Choose one large indoor anchor and avoid two long subway transfers in bad weather."],
      ["Best stay pairing", "Upper West Side for park/museum rhythm; Midtown/Downtown by route goals", "Treat this as planning guidance and verify elevator access, subway changes, hotel room setup, and evening noise."],
      ["What to skip", "Uptown, Downtown, Brooklyn, and Midtown in one day", "Too many transfers and sidewalks can overwhelm the family version of New York."]
    ],
    rows: [
      ["1-day highlights", "Central Park playgrounds or walk; AMNH; early dinner near Upper West Side or hotel", "First-time mixed ages", "Post-lunch museum cafe, park bench, or hotel reset", "Moderate; stroller and subway elevator routes need checking", "Keep meals in the same zone", "Downtown ferry, Times Square, and Brooklyn add-ons in the same day"],
      ["2-day first visit", "Day 1 Upper West Side/Central Park; Day 2 Staten Island Ferry, Brooklyn Bridge Park, or Midtown by age", "Weekend families", "Keep one afternoon optional", "Moderate-high if hotel base is far from route", "Use one planned meal per day as the reset", "Trying to hit every borough or landmark"],
      ["3-day balanced plan", "Uptown park/museum; Downtown ferry or Brooklyn skyline; Midtown or repeat-favorite/weather day", "Most families", "One real reset or slow meal daily", "Lower if each day stays in one or two adjacent zones", "Choose dinners by hotel base before leaving", "Starting each morning with a long transfer"],
      ["Toddler-paced plan", "Central Park playground; CMOM or AMNH; nap/hotel reset; short evening walk", "Babies, toddlers, preschoolers", "Nap or quiet room time is the anchor", "Lower if staying near the park; higher with elevator gaps", "Use nearby casual meals and verified bathrooms", "Observation decks, long ferry waits, and multiple transfers"],
      ["Teen-paced plan", "Brooklyn Bridge Park or observation deck; food stop; one museum or neighborhood block", "Tweens and teens", "Reset can be food, coffee, park seating, or hotel break", "Walking tolerance is higher, but transit timing still matters", "Let teens choose one skyline or food payoff", "All-day little-kid museum/playground rhythm"],
      ["Rainy-day version", "AMNH or CMOM by age; meal nearby; hotel reset; short indoor/covered second stop only if needed", "Any age with weather constraints", "Use the indoor anchor as the day", "Lower if you avoid cross-town subway transfers", "Do not improvise meals after everyone is wet and tired", "Outdoor skyline day or long bridge walk in poor weather"]
    ],
    plans: {
      "Arrival afternoon": "Keep arrival close to the hotel: snacks, a short neighborhood walk, and an early dinner. Save subway learning and big-ticket activities for a rested morning.",
      "Uptown day": "Use Central Park and AMNH or CMOM as the core. Keep the day in one zone and verify stroller/elevator routes before promising the exact path.",
      "Skyline day": "Choose Staten Island Ferry, Brooklyn Bridge Park, or an observation deck, not all of them. Weather, lines, and transit can change the best option.",
      "Rain backup": "Use AMNH or CMOM as the anchor, keep meals nearby, and move any skyline plan to the clearest window.",
      "Toddler adjustment": "Shorten every block, prioritize bathrooms and elevator access, and delete the second activity if the first one runs long.",
      "Teen adjustment": "Trade a playground or younger-kid museum block for skyline views, a food neighborhood, or a focused museum section."
    },
    faqs: [
      ["How many days do families need in New York City?", "Three days is a better first family rhythm, but one or two days can work if each day stays in one main zone and the hotel base fits the route."],
      ["What should families skip on a short New York City trip?", "Avoid stacking Central Park, AMNH, Times Square, Staten Island Ferry, Brooklyn Bridge Park, and an observation deck into one day. Transit, sidewalks, lines, and weather can make that unrealistic with kids."],
      ["What is the easiest rainy-day New York City itinerary with kids?", "Use AMNH or CMOM as the anchor by age, keep meals nearby, and save ferry, bridge, park, or observation-deck plans for the clearest weather window."]
    ]
  },
  "family-itinerary/san-antonio-with-kids.html": {
    title: "San Antonio Itinerary With Kids: 1, 2 and 3 Day Family Plans",
    description:
      "Build a San Antonio itinerary with kids using 1-day, 2-day, 3-day, toddler-paced, teen-paced, and rainy-day route options with heat, meals, drive time, and skip notes.",
    city: "San Antonio",
    links: {
      allAges: "../things-to-do/san-antonio-with-kids.html",
      stay: "../where-to-stay/san-antonio-with-kids.html",
      teen: "../things-to-do/san-antonio-with-teens.html"
    },
    clusterCards: [
      ["All-ages activity guide", "Compare the Alamo, River Walk boat ride, The DoSeum, zoo, Natural Bridge Caverns, and Six Flags by age, heat, rain, nap fit, and stroller/drive friction.", "../things-to-do/san-antonio-with-kids.html", "Open San Antonio things to do with kids"],
      ["Teen-specific swaps", "Use caverns, theme-park, food, and short Downtown context ideas when older kids need more than younger-kid museum pacing.", "../things-to-do/san-antonio-with-teens.html", "Open San Antonio with teens"],
      ["Where to stay first", "Pick the lodging base before locking the route. Pearl, Downtown/River Walk, Broadway/DoSeum, Northwest theme-park areas, and airport/value bases change heat, parking, stroller, and drive-time tradeoffs.", "../where-to-stay/san-antonio-with-kids.html", "Open where to stay in San Antonio with kids"]
    ],
    quick: [
      ["Best 1-day plan", "Alamo early, boat ride, Pearl or DoSeum by age", "Covers the city signature without a long hot Downtown march."],
      ["Best 2-day plan", "Downtown/Pearl plus DoSeum, zoo, caverns, or theme park by age", "Separates classic first-visit stops from the bigger kid-specific anchor."],
      ["Best 3-day plan", "Arrival reset, Downtown context, age-specific anchor day", "Adds heat-season slack and keeps one major attraction from swallowing every day."],
      ["Best toddler pace", "The DoSeum, Pearl food/reset, hotel nap, short boat ride", "Indoor hands-on time and a short evening view usually beat long outdoor sightseeing."],
      ["Best teen pace", "Natural Bridge Caverns or Six Flags, Pearl food, short River Walk", "Older kids often need adventure, rides, or food payoff plus concise city context."],
      ["Best rainy/heat swap", "The DoSeum or short indoor/covered Downtown plan", "Keep the plan close to meals and save outdoor zoo/theme-park time for a better window."],
      ["Best stay pairing", "Pearl/Museum Reach or Downtown for first visit; Northwest only for theme-park trips", "Treat this as planning guidance and verify exact parking, noise, stroller route, and heat-season logistics."],
      ["What to skip", "Outdoor zoo, River Walk, caverns, and theme park in one compressed route", "Heat, drive time, lines, and tired kids can turn the day into logistics."]
    ],
    rows: [
      ["1-day highlights", "Alamo early; boat ride; lunch/rest; Pearl or DoSeum depending on ages", "First-time mixed ages", "Midday hotel, shaded meal, or Pearl reset", "Moderate; Downtown stroller routes and parking need checking", "Plan lunch before heat and crowds peak", "Zoo, caverns, and Six Flags add-ons"],
      ["2-day first visit", "Day 1 Downtown/Alamo/River Walk/Pearl; Day 2 DoSeum or zoo for younger kids, caverns or Six Flags for older kids", "Weekend families", "Protect one afternoon as optional", "Moderate-high; second day may require a drive", "Keep dinners close to the stay base", "Multiple outdoor anchors in summer heat"],
      ["3-day balanced plan", "Arrival reset; Downtown/Pearl day; age-specific anchor day; optional zoo or food reset", "Most families", "One real reset daily, especially warm months", "Lower if you avoid crossing north/south repeatedly", "Stock water/snacks and choose backup meals early", "Making the theme park or caverns day share space with too many classic stops"],
      ["Toddler-paced plan", "The DoSeum; Pearl reset; hotel nap; short boat ride if weather and energy cooperate", "Babies, toddlers, preschoolers", "Nap after lunch is the anchor", "Lower if staying near Pearl/Broadway; Downtown route still needs verifying", "Use verified casual meals and bathrooms", "Long River Walk loop, midday zoo, or caverns with tired toddlers"],
      ["Teen-paced plan", "Natural Bridge Caverns or Six Flags; food reset; concise Alamo/River Walk block", "Tweens and teens", "Reset can be hotel pool, Pearl meal, or quiet evening", "Drive time and heat checks matter", "Give teens a food or adventure payoff", "Younger-kid-only museum pacing all day"],
      ["Rainy/heat version", "The DoSeum for younger kids; short Downtown context plus food; indoor/rest block; save outdoor anchor", "Any age with weather or heat constraints", "Use midday as the protected reset", "Lower if you keep the route central", "Do not rely on exposed walking for meals", "Long zoo/theme-park day in extreme heat or storms"]
    ],
    plans: {
      "Arrival afternoon": "Keep the first block light: snacks, pool or room setup if available, a short Pearl or nearby meal, and no promises that require perfect weather.",
      "Downtown context day": "Use the Alamo and a short River Walk or boat segment as the city signature, then stop before heat and crowds make it feel bigger than it is.",
      "Age-specific anchor day": "Choose DoSeum or zoo for younger kids, Natural Bridge Caverns or Six Flags for older kids. Treat the chosen anchor as the day, not a prelude to three more stops.",
      "Rain or heat backup": "Use The DoSeum, a short meal-centered Downtown block, or a hotel reset. Verify current hours, ticketing, and weather policies before changing the route.",
      "Toddler adjustment": "Keep sessions short, make the midday rest non-negotiable, and delete the evening add-on if the morning ran hot or overstimulating.",
      "Teen adjustment": "Give older kids one higher-payoff anchor, then use food, pool, or a concise River Walk block rather than stretching the day with younger-kid filler."
    },
    faqs: [
      ["How many days do families need in San Antonio?", "Two or three days works best for a first family trip. One day can work if families keep Downtown concise and choose either Pearl or DoSeum instead of stacking every major attraction."],
      ["What should families skip on a short San Antonio trip?", "Avoid stacking the zoo, River Walk, caverns, theme parks, and Pearl into one compressed route. Heat, drive time, parking, lines, and child energy can change the plan quickly."],
      ["What is the easiest rainy-day or heat-day San Antonio itinerary with kids?", "Use The DoSeum for younger kids or a short indoor/meal-centered Downtown plan, then save zoo, River Walk walking, caverns, or theme-park time for better conditions."]
    ]
  },
  "family-itinerary/san-diego-with-kids.html": {
    title: "San Diego Itinerary With Kids: 1, 2 and 3 Day Family Plans",
    description:
      "Build a San Diego itinerary with kids using 1-day, 2-day, 3-day, toddler-paced, teen-paced, and rainy-day route options with naps, meals, and skip notes.",
    city: "San Diego",
    links: {
      allAges: "../things-to-do/san-diego-with-kids.html",
      stay: "../where-to-stay/san-diego-with-kids.html",
      toddler: "../things-to-do/san-diego-with-toddlers.html",
      teen: "../things-to-do/san-diego-with-teens.html"
    },
    clusterCards: [
      ["All-ages activity guide", "Compare zoo, Mission Bay, Balboa Park, Birch Aquarium, La Jolla, and Coronado by age, rain, nap fit, and stroller friction.", "../things-to-do/san-diego-with-kids.html", "Open San Diego things to do with kids"],
      ["Toddler-specific swaps", "Use shorter sessions, easier exits, and nap-first pacing when younger kids are driving the schedule.", "../things-to-do/san-diego-with-toddlers.html", "Open San Diego with toddlers"],
      ["Teen-specific swaps", "Trade some little-kid resets for stronger scenery, food, and independence where it fits your family.", "../things-to-do/san-diego-with-teens.html", "Open San Diego with teens"],
      ["Where to stay first", "Pick the lodging base before locking the route. Mission Bay, Downtown, La Jolla, Coronado, and Mission Valley change the practical day shape.", "../where-to-stay/san-diego-with-kids.html", "Open where to stay in San Diego with kids"]
    ],
    quick: [
      ["Best 1-day plan", "Zoo early, Balboa Park reset, Mission Bay or pool", "Combines one major attraction with a flexible afternoon; verify the final move from your hotel."],
      ["Best 2-day plan", "Zoo/Balboa plus Mission Bay/La Jolla", "Gives one major attraction day and one coast day without overpacking."],
      ["Best 3-day plan", "Arrival reset, zoo day, coast choice", "Leaves more room for naps, weather changes, or an unplanned beach block."],
      ["What to skip", "Zoo plus La Jolla plus Coronado in one day", "That route can turn the trip into driving and parking management."]
    ],
    rows: [
      ["1-day highlights", "Zoo early; lunch/rest; Mission Bay, Balboa Park, or hotel pool", "School-age mixed groups", "Post-lunch hotel or shade reset", "Moderate; zoo hills and one drive", "Eat near Balboa Park or near the hotel", "Late zoo start, La Jolla add-on, second paid attraction"],
      ["2-day first visit", "Day 1 zoo/Balboa; Day 2 Mission Bay or La Jolla by age", "Families with a weekend", "Protect one afternoon as optional", "Moderate; two zones over two days", "Keep dinners near the stay base", "Trying to include Coronado and La Jolla unless kids have stamina"],
      ["3-day balanced plan", "Arrival reset; zoo/Balboa; coast day with La Jolla or Coronado", "Most families", "One real reset each day", "Moderate; fewer rushed crossings", "Stock snacks on arrival and keep one easy dinner", "Making Day 1 a full sightseeing day"],
      ["Toddler-paced plan", "Mission Bay morning; nap; zoo bus tour or Birch Aquarium", "Babies, toddlers, preschoolers", "Nap after lunch is the anchor", "Lower if you avoid Cove stairs and long walks", "Use hotel meals or verified nearby casual stops", "La Jolla Cove with stroller-heavy gear"],
      ["Teen-paced plan", "Zoo highlights; La Jolla scenery; Coronado ferry or food stop", "Tweens and teens", "Reset can be a cafe, beach pause, or hotel break", "Higher walking tolerance, but parking still matters", "Add a food stop teens care about", "Too many little-kid playground resets"],
      ["Rainy-day version", "Birch Aquarium or Balboa Park museum; meal nearby; hotel reset", "Any age with weather constraints", "Use the weather window for one outdoor walk", "Lower if you stay in one zone", "Do not count on beach meals in bad weather", "Long outdoor zoo day if rain is steady"]
    ],
    plans: {
      "Choose one zone per half day": "Keep zoo and Balboa Park together, make Mission Bay its own reset block, and choose either La Jolla or Coronado for a coast half day. Check the next parking or transit step for the exact day and season before promising a second anchor across the city.",
      "Use a real stop rule": "After the main anchor, continue only if everyone has eaten, the bathroom and rest needs are handled, and the optional stop can be abandoned without losing a reservation. A free garden or hotel pool is easier to drop than another timed ticket.",
      "Adjust for younger kids": "Shorten each block and protect the post-lunch reset. Keep snacks and the next bathroom known before changing zones. Use the toddler page for exact activity swaps rather than adding more stops here.",
      "Adjust for teens or rain": "Let teens choose the coast, museum, or food-led anchor and give them a say in what gets cut. In rain, use one aquarium or museum and keep the meal nearby instead of recreating the full route indoors."
    },
    faqs: [
      ["How many days do families need in San Diego?", "Two or three days works best for a first family trip. One day can work if you choose the zoo plus one low-pressure reset instead of trying to see the whole coast."],
      ["What should families skip on a short San Diego trip?", "Avoid stacking the zoo, La Jolla, Coronado, and Mission Bay into one day. Parking, hills, and drive time can overwhelm the actual activities."],
      ["What is the easiest rainy-day San Diego itinerary with kids?", "Use Birch Aquarium or a Balboa Park museum as the main anchor, keep meals nearby, and save beach or zoo time for the best weather window."]
    ]
  }
};

const teenPages = {
  "things-to-do/chicago-with-teens.html": {
    title: "Things to Do in Chicago With Teens: Museums, Food, Lakefront and Weather Plans",
    description:
      "Plan Chicago with teens using activity quick picks, transit and walking caveats, rainy-day swaps, food/reset notes, and realistic teen-friendly itinerary ideas.",
    city: "Chicago",
    links: {
      allAges: "../things-to-do/chicago-with-kids.html",
      stay: "../where-to-stay/chicago-with-kids.html",
      itinerary: "../family-itinerary/chicago-with-kids.html"
    },
    quick: [
      ["Best overall", "Architecture river plan plus Riverwalk food", "Strong teen payoff if weather, timing, and attention span line up."],
      ["Best rainy-day anchor", "Field Museum or Shedd Aquarium", "Pick one major indoor stop rather than trying to stack Museum Campus."],
      ["Best low-cost reset", "Millennium Park, lakefront, or Lincoln Park Zoo", "Useful when you need space between paid attractions."],
      ["Best food pairing", "West Loop or River North", "Works best when meals are part of the teen plan, not an afterthought."],
      ["Best skyline moment", "Riverwalk or lakefront route", "Good payoff without committing to another ticketed attraction."],
      ["Best if you only have one day", "Museum Campus plus river/lakefront dinner", "Keeps the route focused and avoids cross-city zigzags."],
      ["Think twice about", "Toddler-heavy playground pacing", "Teens usually need stronger scenery, food, museums, or active choices."],
      ["Main planning risk", "Weather and transit friction", "Cold, heat, storms, elevator gaps, and long walks can change the plan quickly."]
    ],
    rows: [
      ["Architecture river plan", "12-17", "90 min-2 hrs", "$$$", "River North", "Limited", "No", "Low", "Book/check times", "Clear Chicago signature for teens", "Riverwalk meal or Magnificent Mile"],
      ["Field Museum", "10-17", "2-4 hrs", "$$", "Museum Campus", "Good", "Yes", "Medium", "Check tickets", "Big exhibits with stronger teen payoff than a short kid stop", "Lakefront or Shedd exterior"],
      ["Shedd Aquarium", "10-15", "2-3 hrs", "$$$", "Museum Campus", "Good", "Yes", "Medium", "Book ahead", "Reliable indoor animal/science anchor", "Field Museum lawn or lakefront walk"],
      ["Millennium Park / Maggie Daley area", "10-17", "60-120 min", "$", "Loop", "Good", "Partial", "Medium", "No", "Easy skyline and photo reset", "Art Institute exterior or Loop meal"],
      ["Lincoln Park Zoo and lakefront", "10-15", "2-3 hrs", "$", "Lincoln Park", "Good", "No", "Medium", "No", "Free flexible outdoor block", "Neighborhood lunch or Nature Boardwalk"],
      ["Navy Pier by specific reason", "10-17", "1-3 hrs", "$$", "Streeterville", "Good", "Partial", "Medium", "Depends on activity", "Useful mixed-weather filler if you choose one goal", "Lakefront walk or casual food"]
    ],
    details: [
      ["Architecture river plan", "Teens get skyline, story, and movement without another museum-style block.", "Best for tweens and teens who can sit, listen, and handle weather exposure.", "Cold, rain, wind, ticket timing, and younger siblings who cannot sit through it.", "Book a time after food or snacks, and do not stack it after a draining museum marathon.", "Use bathrooms before boarding and plan the next meal near River North or the Riverwalk.", "Verify operator, departure point, weather policy, and accessibility before booking.", "Pair with Riverwalk food or a short Magnificent Mile walk."],
      ["Field Museum", "It can work for teens when you choose exhibit goals instead of wandering every hall.", "Best for science, history, and dinosaur-interested teens.", "Museum fatigue and trying to combine Field, Shedd, and another big stop in one day.", "Pick two or three must-see sections, then leave before everyone is done.", "Museum Campus has food/restroom options, but verify hours and policies for the day.", "Check tickets, special exhibits, and current hours.", "Pair with lakefront time or a simple dinner, not another full museum."],
      ["Shedd Aquarium", "A more contained bad-weather anchor when teens still want animals, views, and a focused plan.", "Best for younger teens or mixed-age groups.", "Crowds, timed-entry friction, and feeling too young for older teens if overdone.", "Use it as the main indoor block, then add outdoor skyline time if weather improves.", "Plan food and bathroom breaks before leaving Museum Campus.", "Book/check timed entry and current exhibits.", "Pair with Field Museum only if both stops are intentionally shortened."],
      ["Millennium Park / Maggie Daley area", "It gives a quick Chicago sense of place without requiring a long ticketed commitment.", "Best for first-day orientation, photos, and a low-cost reset.", "Crowds, event closures, and making it the whole teen plan.", "Use it as a bridge between meals, transit, or one bigger attraction.", "Food and bathrooms vary by route, so decide before anyone is urgent.", "Check event closures and weather.", "Pair with the Loop, Art Institute exterior, or easy transit back to the hotel."],
      ["Lincoln Park Zoo and lakefront", "Free entry and lakefront access make it useful when the budget or weather needs flexibility.", "Best for animal-interested younger teens or mixed-age sibling groups.", "It may feel too young if teens want a more independent city day.", "Frame it as a neighborhood/lakefront block, not just a zoo visit.", "Use nearby neighborhood food as the reset plan.", "Check hours and seasonal closures.", "Pair with Nature Boardwalk or a Lincoln Park meal."],
      ["Navy Pier by specific reason", "It can fill a weather gap if you choose a clear reason to go.", "Best for mixed-age groups or teens who want a simple lakefront activity.", "It can feel crowded, commercial, and unfocused.", "Choose one activity, view, or meal; avoid vague wandering.", "Food and restrooms are convenient, but crowds can slow everything down.", "Check hours, pricing, and event schedule.", "Pair with lakefront or a short ride back to the hotel."]
    ],
    plans: {
      "1-day teen plan": "Choose Field Museum or Shedd as the anchor, add lakefront or Millennium Park time, then finish with River North or West Loop food.",
      "2-day teen plan": "Day 1: Museum Campus plus lakefront. Day 2: architecture river plan, Riverwalk, and a neighborhood food stop.",
      "Rainy-day plan": "Use Field Museum or Shedd as the main block, keep meals close, and save lakefront or boat plans for the clearest weather window.",
      "Low-cost plan": "Use Lincoln Park Zoo, lakefront, Millennium Park, and one paid activity instead of turning every stop into a ticket.",
      "Mixed-age plan": "Let teens choose the food or skyline piece while younger kids get a shorter zoo, park, or aquarium block."
    },
    faqs: [
      ["Is Chicago good with teens?", "Yes, if the plan leans into museums, river/lakefront views, food, and weather-aware routing instead of playground-heavy pacing."],
      ["What should families avoid with teens in Chicago?", "Avoid stacking multiple large museums, long exposed walks, and a late architecture tour without food or weather backup."]
    ]
  },
  "things-to-do/las-vegas-with-teens.html": {
    title: "Things to Do in Las Vegas With Teens: 8 Picks by Trip Style",
    description:
      "Compare eight things to do in Las Vegas with teens by interest, cost, time, heat, location, age rules, and mixed-age fit, with current official checks.",
    city: "Las Vegas",
    schemaName: "Las Vegas teen activity options",
    compactDetails: true,
    removeGeneratedAgeSections: true,
    baseReplacements: [
      ["<h1>Things to do in Las Vegas with teens</h1>", "<h1>Things to Do in Las Vegas With Teens: 8 Picks by Trip Style</h1>"],
      ["<p>A focused activity guide for teens in Las Vegas, with the main kids guide kept as the broader planning hub.</p>", "<p>Compare eight older-kid choices by actual teen payoff, time, cost, heat, location, age or height rules, and mixed-age fit.</p>"],
      ["<p><strong>Last updated:</strong> July 5, 2026</p>", "<p><strong>Attraction facts and official sources checked:</strong> July 22, 2026</p>"],
      ["<p><strong>How this guide was built:</strong> Family Tripwise compares official attraction and hotel information, family logistics, search-intent research, and practical planning tradeoffs like age fit, stroller friction, weather backup, nap timing, walking distance, and lodging base.</p>", "<p>Age, time, cost, weather, and trip-style labels are Family Tripwise editorial estimates. Check the exact ticket, event, height rule, weather policy, and minor-access rule before committing.</p>"],
      ["<img src=\"https://commons.wikimedia.org/wiki/Special:Redirect/file/Bellagio%20fountain%20show%202010%20las%20vegas.JPG\" alt=\"The Bellagio fountains and Las Vegas Strip at night.\" loading=\"eager\" decoding=\"async\">", "<img src=\"https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Bellagio_fountain_show_2010_las_vegas.JPG/1280px-Bellagio_fountain_show_2010_las_vegas.JPG\" alt=\"The Bellagio fountains and Las Vegas Strip at night.\" width=\"1280\" height=\"850\" loading=\"eager\" decoding=\"async\">"],
      ["<figcaption>Photo: chensiyuan, Wikimedia Commons, CC BY-SA 4.0. <a href=\"https://commons.wikimedia.org/wiki/File:Bellagio_fountain_show_2010_las_vegas.JPG\">License and source</a>.</figcaption>", "<figcaption>Photo: Chensiyuan via <a href=\"https://commons.wikimedia.org/wiki/File:Bellagio_fountain_show_2010_las_vegas.JPG\">Wikimedia Commons</a>, <a href=\"https://creativecommons.org/licenses/by-sa/4.0/\">CC BY-SA 4.0</a>. No editorial changes; Wikimedia serves this resized preview.</figcaption>"]
    ],
    links: {
      allAges: "../things-to-do/las-vegas-with-kids.html",
      stay: "../where-to-stay/las-vegas-with-kids.html",
      itinerary: "../family-itinerary/las-vegas-with-kids.html"
    },
    quickHeading: "Five ways to let the teen choose",
    quickNote: "These are starting routes, not universal rankings. Let the teen choose the trip's anchor, then let the adults verify the exact ticket, age or height rule, weather, transport, and late-day plan.",
    quick: [
      ["Immersive and unusual", "AREA15, one exact experience", "Choose the experience first; age, effects, duration, and ticket rules differ inside the same district."],
      ["Outdoor contrast", "Red Rock Canyon", "Use the scenic drive or one planned stop when the teen wants desert scenery more than another resort corridor."],
      ["Thrill and games", "Big Apple Coaster and Arcade", "The coaster has a current 54-inch rule; the arcade gives mixed-height siblings a separate option."],
      ["Flexible and lower cost", "Bellagio plus Pinball Hall of Fame", "Combine one free Vegas visual with pay-per-play time instead of buying another full attraction ticket."],
      ["Big visual evening", "Sphere, High Roller, or Neon Museum", "Choose screen spectacle, skyline, or Vegas design history; do not stack all three into one night."]
    ],
    comparisonNote: "Every row stays only because it offers an older-kid reason to choose it: immersive novelty, desert contrast, thrill, games, skyline, photo/design interest, or a current large-format show. Age, time, cost, indoor, and fit labels are editorial estimates, not venue guarantees.",
    comparisonHeaders: ["Activity", "Teen fit", "Time", "Cost", "Area", "Walking", "Indoor", "Flexibility", "Current check", "Why it earns teen space", "Pair nearby"],
    rows: [
      ["AREA15 / one exact experience", "Older kids; exact experience varies", "2-4 hrs", "Paid", "Off Strip", "Experience-specific", "Yes", "Medium", "Check exact attraction and minor policy", "Immersive choice with genuine older-kid novelty", "Food or hotel reset"],
      ["Red Rock Canyon Scenic Drive", "Teens interested in desert scenery", "Half day", "Low cost", "West of Strip", "Choice-specific", "No", "Medium", "Check weather, road and seasonal entry", "A real visual and pace contrast to the Strip", "Quiet hotel evening"],
      ["Big Apple Coaster and Arcade", "Coaster: 54 inches; arcade broader", "1-2 hrs", "Paid", "South Strip", "Resort route", "Partial", "High", "Check height, weather and hours", "A concrete thrill choice with a sibling fallback", "New York-New York meal"],
      ["High Roller observation wheel", "Teens who want skyline over thrill", "45-60 min", "Paid", "LINQ", "Boarding route", "Yes", "Medium", "Check ticket and cabin terms", "Contained skyline payoff without a long show", "LINQ meal"],
      ["Pinball Hall of Fame", "Game-focused teens and mixed ages", "60-120 min", "Pay per play", "South Strip", "Low once inside", "Yes", "High", "Check current hours", "Flexible play that can stop before attraction fatigue", "South Strip meal"],
      ["Neon Museum", "Design, photo or Vegas-history interest", "60-90 min", "Paid", "Downtown", "Outdoor visit", "No", "Medium", "Check timed ticket and weather", "A short visual-history choice that does not feel little-kid led", "Early Downtown meal"],
      ["Bellagio Conservatory and fountains", "Teens who want classic Vegas visuals", "60-90 min", "Free", "Center Strip", "Long resort approaches", "Partial", "High", "Check display and fountain schedules", "Photo payoff with low ticket commitment", "Nearby meal"],
      ["Sphere film experience or selected event", "Interest and production-specific", "About 2 hrs; varies", "Paid", "East of Strip", "Venue route", "Yes", "Low", "Check exact production, age and effects", "A current large-format event teens may choose themselves", "Simple meal and hotel return"]
    ],
    detailsEyebrow: "High-friction choices",
    detailsTitle: "Five choices that need an exact check",
    detailsNote: "The comparison covers all eight. These five get extra space because their age, height, sensory, weather, ticket, or transport details can change the decision.",
    details: [
      ["AREA15 / one exact experience", "The district offers immersive art, games, rides, and events that can feel chosen for older kids.", "Best for teens who want interactive or visual novelty and will help select the exact experience.", "The name AREA15 does not identify one product; each experience has separate age, effects, time, and ticket rules.", "Choose one primary experience before buying. Do not treat a multi-attraction pass as automatically better.", "Plan food or a quiet exit before adding another loud stop.", "Verify the exact experience, minor policy, effects notice, accessibility, hours, and refund terms.", "Pair with a hotel reset."],
      ["Red Rock Canyon Scenic Drive", "The desert setting gives teens a genuine contrast to resort interiors and screens.", "Best for teens who value scenery, photography, geology, or a break from indoor spectacle.", "Heat, weather, limited services, driving, and trail choice can turn the same destination into a very different outing.", "Choose scenic drive only or one suitable stop; do not promise a hike until current conditions and mobility fit are checked.", "Carry water and settle restroom and food plans before leaving the city.", "Recheck BLM road status, weather, fire restrictions, and seasonal timed-entry rules.", "Pair with a low-key evening."],
      ["Big Apple Coaster and Arcade", "A named thrill ride gives ride-focused teens a clear reason to choose the South Strip.", "Best for teens who actively want the coaster; the arcade provides a different option for non-riders.", "The official coaster rule is 54 inches without footwear, operations can change with weather, and the arcade is a separate spend.", "Confirm every rider's height and interest before reserving; let non-riders use the arcade without making the whole family wait indefinitely.", "Set a play budget and decide the meal before entering the resort route.", "Recheck hours, weather, ticket terms, height, and the route from the chosen entrance.", "Pair with a New York-New York meal."],
      ["Sphere film experience or selected event", "The venue can deliver the kind of large-format visual event a teen specifically asks to see.", "Best for teens who are genuinely interested in the current production rather than the building alone.", "The production, content, effects, runtime, price, and age fit change; Sphere is a venue, not one stable attraction.", "Choose the exact production first, review the event page together, and price the complete ticket order before building the night around it.", "Keep the meal and return route simple around the fixed entry time.", "Verify the current production, age guidance, effects, entry rules, fees, and refund terms.", "Pair with one meal, not another major show."],
      ["Neon Museum", "The collection can appeal to teens interested in design, photography, signs, or Vegas history.", "Best for teens who choose visual history over rides, games, or another large show.", "It is an outdoor timed visit, so heat, wind, air quality, storms, and personal interest determine the payoff.", "Choose the visit time around current conditions and keep the Downtown portion bounded.", "Plan water, food, and transport before the timed entry.", "Recheck the museum FAQ, weather procedure, photography rules, hours, and ticket terms.", "Pair with an early Downtown meal."]
    ],
    plansEyebrow: "Teen route shapes",
    plansTitle: "Build the trip around one teen-chosen anchor",
    plans: {
      "One-day first visit": "Use a slow or pool morning, let the teen choose Big Apple Coaster, AREA15, or Pinball as the paid anchor, then add Bellagio or High Roller only if the route stays compact.",
      "Two-day contrast": "Day 1: one Strip visual plus one teen-chosen paid stop. Day 2: Red Rock for desert contrast or AREA15/Sphere when weather or interests favor indoors.",
      "Heat or rain": "Use one exact AREA15 experience, Pinball, High Roller, or the selected Sphere production as the anchor. Indoor does not prove low walking or low stimulation.",
      "Mixed ages": "Give the teen first choice of the anchor; let younger siblings use the arcade, hotel pool, or all-ages guide rather than forcing every family member through the same ticket."
    },
    clusterLinks: [
      ["All-ages activity hub", "Use the broader 12-choice guide when younger siblings, grandparents, or mixed stamina change the shortlist.", "../things-to-do/las-vegas-with-kids.html", "Open all Las Vegas family activities"],
      ["Family hotel comparison", "Compare ten hotels by trip style, room setup, pool role, rough nightly total, and sampled online-review themes.", "../where-to-stay/las-vegas-family-hotels.html", "Compare Las Vegas family hotels"],
      ["Stay-area guide", "Choose the trip base before locking routes; exact resort exits, transport, pool access, and room location shape the teen plan.", "../where-to-stay/las-vegas-with-kids.html", "Compare Las Vegas stay areas"],
      ["Family itinerary", "Sequence the selected anchor around meals, weather, hotel resets, and younger siblings without building a Strip marathon.", "../family-itinerary/las-vegas-with-kids.html", "Open the Las Vegas family itinerary"]
    ],
    officialChecksEyebrow: "Before buying tickets",
    officialChecksTitle: "Three checks that change a teen plan",
    officialChecks: [
      ["Exact attraction, not destination name", "AREA15 and Sphere contain changing experiences or productions. Select the exact ticket first, then check age, height, effects, duration, accessibility, and refund terms.", [["https://www.area15.com/visit-us", "AREA15 visit information"], ["https://www.thesphere.com/shows/the-sphere-experience", "Sphere current experience"]]],
      ["Weather, height, and timed entry", "Big Apple Coaster requires a current 54-inch minimum; Red Rock and Neon Museum plans change with weather and operating conditions. Recheck near the visit.", [["https://newyorknewyork.mgmresorts.com/en/entertainment/the-big-apple-coaster-and-arcade.html", "Big Apple Coaster"], ["https://www.blm.gov/programs/national-conservation-lands/nevada/red-rock-canyon", "Red Rock Canyon NCA"], ["https://neonmuseum.org/faqs/", "Neon Museum visit FAQ"]]],
      ["Minor and late-night rules", "Do not assume a teen can enter every event or wander independently late at night. Check the exact venue's adult-supervision policy and the City of Las Vegas youth-curfew guidance.", [["https://www.lasvegasnevada.gov/News/Blog/Detail/curfew-guide-for-families-what-teens-parents-need-to-know-this-summer", "City youth-curfew guide"], ["https://www.area15.com/experiences/pass-bundles/level-1", "AREA15 pass restrictions"]]]
    ],
    visibleFaqs: true,
    faqTitle: "Las Vegas with teens FAQ",
    faqs: [
      ["What are the strongest Las Vegas choices for teens?", "Start with the teen's interest: AREA15 for one selected immersive experience, Red Rock for desert contrast, Big Apple Coaster for thrills, Pinball for flexible games, or Sphere, High Roller, and Neon Museum for different kinds of visual payoff."],
      ["Can teenagers explore Las Vegas on their own?", "Do not assume they can. Check current city curfew guidance, the exact venue's minor policy, and whether adult accompaniment is required for the ticket or time of day."],
      ["How should a mixed-age family use this page?", "Let the teen choose one anchor, then use the all-ages guide, arcade, hotel reset, or split plan for younger siblings instead of forcing every child through the same activity."]
    ],
    sourcesIntro: "Official attraction and city sources checked July 22, 2026. Use the exact event or attraction page again near the visit because productions, effects, prices, hours, weather rules, and minor policies can change.",
    sources: [
      ["AREA15 visit information", "https://www.area15.com/visit-us"],
      ["AREA15 pass restrictions", "https://www.area15.com/experiences/pass-bundles/level-1"],
      ["Red Rock Canyon NCA", "https://www.blm.gov/programs/national-conservation-lands/nevada/red-rock-canyon"],
      ["Big Apple Coaster and Arcade", "https://newyorknewyork.mgmresorts.com/en/entertainment/the-big-apple-coaster-and-arcade.html"],
      ["High Roller", "https://www.caesars.com/linq/things-to-do/attractions/high-roller"],
      ["Pinball Hall of Fame", "https://travelnevada.com/museums/pinball-hall-of-fame/"],
      ["Neon Museum visit FAQ", "https://neonmuseum.org/faqs/"],
      ["Bellagio fountains", "https://bellagio.mgmresorts.com/en/entertainment/fountains-of-bellagio.html"],
      ["Bellagio Conservatory", "https://bellagio.mgmresorts.com/en/entertainment/conservatory-botanical-garden.html"],
      ["Sphere current experience", "https://www.thesphere.com/shows/the-sphere-experience"],
      ["City of Las Vegas youth-curfew guide", "https://www.lasvegasnevada.gov/News/Blog/Detail/curfew-guide-for-families-what-teens-parents-need-to-know-this-summer"],
      ["Las Vegas photo source and attribution", "https://commons.wikimedia.org/wiki/File:Bellagio_fountain_show_2010_las_vegas.JPG"],
      ["CC BY-SA 4.0 license", "https://creativecommons.org/licenses/by-sa/4.0/"]
    ]
  },
  "things-to-do/san-diego-with-teens.html": {
    title: "Things to Do in San Diego With Teens: Coast, Zoo, Museums and Rainy-Day Plans",
    description:
      "Compare San Diego coast, zoo, museum, ferry, and weather-backup options for teens, with route tradeoffs and realistic one- and two-day plans.",
    city: "San Diego",
    compactDetails: true,
    comparisonNote: "Age, time, stroller, rain, nap, booking, and value fields are Family Tripwise editorial estimates, not venue guarantees; check the linked venue and let your teen help choose the anchor.",
    links: {
      allAges: "../things-to-do/san-diego-with-kids.html",
      stay: "../where-to-stay/san-diego-with-kids.html",
      itinerary: "../family-itinerary/san-diego-with-kids.html"
    },
    quick: [
      ["Best coast choice", "La Jolla coast plus one meal", "Good scenery and wildlife-viewing potential if parking, walking, and weather cooperate."],
      ["Best major attraction", "San Diego Zoo highlights", "Works when teens choose zones instead of chasing every exhibit."],
      ["Best rainy-day swap", "Birch Aquarium or Balboa Park museum", "Useful backup without rebuilding the entire day."],
      ["Main planning risk", "Parking and cross-town stacking", "Do not turn a teen coast day into a parking-and-driving day."]
    ],
    rows: [
      ["La Jolla Cove / coast", "12-17", "2-4 hrs", "$", "La Jolla", "Hard", "No", "Low", "No", "Scenery and a more independent-feeling stop", "Birch Aquarium or casual lunch"],
      ["San Diego Zoo highlights", "10-17", "3-5 hrs", "$$$", "Balboa Park", "Moderate", "No", "Medium", "Book/check tickets", "Major all-age anchor if teens choose priorities", "Balboa Park food or one museum"],
      ["Birch Aquarium", "10-15", "90 min-2 hrs", "$$", "La Jolla", "Good", "Partial", "High", "Check tickets", "Compact weather backup near the coast", "La Jolla Shores or Cove"],
      ["Balboa Park museums", "10-17", "2-4 hrs", "$$", "Balboa Park", "Good", "Yes", "Medium", "Check exhibits", "Best flexible culture/rain option", "Zoo or garden walk"],
      ["Coronado ferry and waterfront", "10-17", "2-3 hrs", "$$", "Downtown/Coronado", "Good", "No", "Medium", "Check ferry times", "Scenic low-effort outing", "Waterfront dinner or beach walk"],
      ["Mission Bay / beach reset", "10-17", "2-3 hrs", "$", "Mission Bay", "Mixed", "No", "High", "No", "Easy decompression between bigger plans", "Hotel pool or casual meal"]
    ],
    details: [
      ["La Jolla Cove / coast", "Teens get scenery, wildlife viewing, photos, and a more independent-feeling stop.", "Best for tweens and teens who can handle crowds, stairs, and uneven coastal paths.", "Parking, crowds, stairs, slippery/uneven paths, and mixed-age family gear.", "Go early or off-peak and avoid pairing it with too many cross-town stops.", "Plan bathrooms and food before arrival so the day does not collapse after parking.", "No booking for a coast walk; verify weather, surf, closures, and parking expectations.", "Pair with Birch Aquarium or one La Jolla meal."],
      ["San Diego Zoo highlights", "The zoo still works for teens when the family chooses priority zones and avoids completion mode.", "Best for animal-interested teens and mixed-age groups.", "Trying to see the whole zoo, heat, hills, and late starts.", "Use the bus tour or map to reduce wasted walking, then focus on a few zones.", "Food/restrooms are inside, but plan a reset before everyone is done.", "Buy/check dated tickets and current hours.", "Pair with Balboa Park, not a full La Jolla plan the same day."],
      ["Birch Aquarium", "It is compact enough for a weather backup and close enough to pair with coast time.", "Best for younger teens or mixed-age groups.", "Older teens may find it too short unless the coast is part of the plan.", "Treat it as a 90-minute anchor, not a full-day promise.", "Use La Jolla food options as the reset after the visit.", "Check ticket windows, parking, and hours.", "Pair with La Jolla Shores or Cove depending on walking tolerance."],
      ["Balboa Park museums", "The park gives options when weather, mood, or sibling ages change.", "Best for teens when they choose the museum or exhibit.", "Museum fatigue and buying too many tickets.", "Pick one paid museum and one outdoor garden or food reset.", "Verify food/restroom options near the chosen museum.", "Check current exhibits and hours.", "Pair with the zoo only if both are shortened."],
      ["Coronado ferry and waterfront", "It turns transportation into part of the outing and gives a calmer coast feel.", "Best for teens who want scenery without a packed attraction schedule.", "Ferry timing, wind, and return logistics.", "Use it from Downtown when you want a lower-effort afternoon.", "Plan dinner or snacks near either landing.", "Check ferry times and weather.", "Pair with waterfront dinner or a beach walk."],
      ["Mission Bay / beach reset", "It can keep the trip from becoming all driving, lines, and ticketed attractions.", "Best for mixed-age groups and teens who need downtime.", "Sand, sun, parking, and boredom if framed as the only teen activity.", "Use it as a reset between bigger plans, not the headline teen day.", "Use hotel or verified nearby facilities as the reset plan.", "Check weather, parking, tide, and shade.", "Pair with pool time or a short evening meal."]
    ],
    plans: {
      "1-day teen plan": "Choose either zoo highlights or the La Jolla coast as the main anchor, add one nearby meal, and keep the optional second stop close to the hotel or first activity.",
      "2-day teen plan": "Day 1: zoo and Balboa Park. Day 2: La Jolla coast or Coronado ferry with food and beach time.",
      "Rainy-day plan": "Use Birch Aquarium or one Balboa Park museum as the anchor, keep meals close, and save coast time for the clearest weather window.",
      "Mixed-age plan": "Give teens the coast or food choice while younger siblings get Mission Bay, aquarium, or zoo bus-tour pacing."
    },
    faqs: [
      ["What should families prioritize in San Diego with teens?", "Start by asking whether the teen prefers coastline, animals, museums, or a lower-pressure ferry and waterfront day. La Jolla and the zoo are strong candidates, but the best anchor depends on that preference and the family's route."],
      ["What should families avoid with teens in San Diego?", "Avoid stacking the zoo, La Jolla, Coronado, and Mission Bay in one day; parking and drive time can overwhelm the fun."]
    ]
  },
  "things-to-do/san-antonio-with-teens.html": {
    title: "Things to Do in San Antonio With Teens: Caverns, Theme Parks, River Walk and Heat Plans",
    description:
      "Plan San Antonio with teens using activity quick picks, heat-aware timing, River Walk caveats, rainy-day swaps, food/reset notes, and realistic teen-friendly itineraries.",
    city: "San Antonio",
    indexDecision: "Index decision: keep this page indexable. San Antonio can support standalone teen intent when the page focuses on caverns, theme parks, River Walk logistics, food/reset planning, heat, and older-kid pacing instead of repeating the all-ages guide.",
    links: {
      allAges: "../things-to-do/san-antonio-with-kids.html",
      stay: "../where-to-stay/san-antonio-with-kids.html",
      itinerary: "../family-itinerary/san-antonio-with-kids.html"
    },
    quick: [
      ["Best overall", "Natural Bridge Caverns or Six Flags by teen style", "Choose adventure/walking or rides; do not try to force both into one day."],
      ["Best classic San Antonio", "Alamo plus River Walk boat ride", "Works as a short orientation block, not a full teen day."],
      ["Best food/reset area", "Pearl / Museum Reach", "Useful for meals and decompression between hotter or more crowded stops."],
      ["Best heat strategy", "Early anchor, midday reset, evening river/food", "Teen stamina helps, but summer heat still shapes the trip."],
      ["Best rainy/indoor-ish backup", "DoSeum only for mixed-age groups; otherwise choose food or indoor exhibit-style stops carefully", "Avoid pretending a younger-kid museum is always a teen anchor."],
      ["Best theme-park base", "Northwest / SeaWorld / Six Flags area", "Only if theme parks are the main reason for the trip."],
      ["Think twice about", "Long midday Downtown wandering", "Heat, crowds, and stroller/sidewalk friction can drain everyone."],
      ["Main planning risk", "Drive time plus heat", "A cheap or far hotel can make every teen plan harder."]
    ],
    rows: [
      ["Natural Bridge Caverns", "10-17", "2-4 hrs", "$$$", "North of city", "Hard", "Partial", "Low", "Book/check tours", "Best adventure-style teen anchor", "Low-key evening or Pearl meal"],
      ["Six Flags Fiesta Texas", "12-17", "Half-full day", "$$$", "Northwest", "Mixed", "No", "Low", "Book/check hours", "Strongest ride-focused teen day", "Hotel pool/reset"],
      ["Alamo plus short River Walk", "10-17", "90 min-2 hrs", "$", "Downtown", "Mixed", "Partial", "Medium", "Timed entry may help", "Classic context without overcommitting", "Boat ride or early dinner"],
      ["River Walk boat ride", "10-17", "45-60 min", "$$", "Downtown", "Limited boarding", "Partial", "Medium", "Check times", "Low-walking orientation activity", "Alamo or Pearl meal"],
      ["Pearl / Museum Reach food reset", "10-17", "1-3 hrs", "$$", "Pearl", "Good", "Partial", "Medium", "Check hours", "Useful teen food and decompression block", "DoSeum for siblings or zoo drive"],
      ["San Antonio Zoo for mixed ages", "10-14", "2-4 hrs", "$$", "Brackenridge Park", "Good", "No", "Medium", "Check hours", "Only if siblings or animal interest justify it", "Pearl or park reset"]
    ],
    details: [
      ["Natural Bridge Caverns", "It gives teens a more adventure-oriented reason to leave Downtown.", "Best for older kids and teens comfortable with walking and uneven surfaces.", "Drive time, tour requirements, heat around outdoor areas, and younger siblings.", "Make it the main half-day anchor and keep the rest of the day light.", "Plan water, snacks, and bathrooms before the tour.", "Book/check tour availability, footwear guidance, weather, and current requirements.", "Pair with a low-key evening or Pearl meal."],
      ["Six Flags Fiesta Texas", "Ride-focused teens may value a full theme-park commitment more than another historic stop.", "Best for tweens and teens who meet ride/heat tolerance needs.", "Heat, lines, cost, transportation, and sibling height differences.", "Treat it as the day, not one stop among many.", "Use the hotel as the reset and protect the next morning.", "Check tickets, hours, ride closures, and height rules.", "Pair with a pool evening or rest day."],
      ["Alamo plus short River Walk", "It gives the trip San Antonio context without requiring teens to spend half a day on history.", "Best for teens when kept concise and paired with food or river time.", "Heat, crowds, and younger-kid pacing around Downtown.", "Use it as an orientation block early or late, not a midday marathon.", "Plan food and bathrooms before the River Walk segment.", "Check current entry rules and timed-entry needs.", "Pair with a boat ride or early dinner."],
      ["River Walk boat ride", "Sitting down while seeing the city can work well when walking energy is low.", "Best for teens as a short orientation or evening add-on.", "Boarding waits, heat, stroller handling for siblings, and weather.", "Use it near a meal window rather than as a standalone destination.", "Use bathrooms before boarding.", "Check schedules, weather, and boarding location.", "Pair with the Alamo, Downtown dinner, or Pearl."],
      ["Pearl / Museum Reach food reset", "Food and a calmer walking environment can keep the trip teen-friendly.", "Best for teens who care about meals, people-watching, and a less scripted block.", "Peak dining crowds, heat, and assuming every teen wants to linger.", "Use it as a reset between bigger anchors.", "Verify hours and food options before relying on it.", "Check event schedules and restaurant hours.", "Pair with DoSeum for siblings, zoo, or a short Downtown block."],
      ["San Antonio Zoo for mixed ages", "It can still work when younger siblings are present or teens like animal stops.", "Best for younger teens or mixed-age families.", "Heat and feeling too young if teens wanted rides/caverns.", "Start early and do not stack it with another big outdoor attraction.", "Plan water, snacks, and a shaded reset.", "Check seasonal hours and current tickets.", "Pair with Pearl or a hotel rest."]
    ],
    plans: {
      "1-day teen plan": "Choose Natural Bridge Caverns or Six Flags as the anchor, then use Pearl or a short River Walk block for food and evening reset.",
      "2-day teen plan": "Day 1: Alamo, boat ride, Pearl. Day 2: Natural Bridge Caverns or Six Flags, then low-key hotel/pool time.",
      "Heat plan": "Start the biggest outdoor or walking-heavy activity early, reset midday, and use Downtown/River Walk only when temperatures and crowds are more manageable.",
      "Rainy-day plan": "Use a short Downtown context block, food/reset time, and check whether caverns, shows, or indoor options make sense for the day's weather.",
      "Mixed-age plan": "Let teens choose one high-payoff anchor while younger siblings get zoo, DoSeum, boat ride, or pool time."
    },
    faqs: [
      ["Is San Antonio good with teens?", "Yes, when the plan includes teen-weighted anchors like Natural Bridge Caverns, Six Flags, River Walk context, and food/reset time rather than only younger-kid stops."],
      ["Should the San Antonio with teens page stay indexed?", "Yes. This page is being kept indexable because it now has standalone teen planning guidance, route tradeoffs, and an explicit older-kid activity focus."]
    ]
  }
};

function esc(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function slugify(value) {
  return String(value ?? "")
    .toLowerCase()
    .replaceAll("&", "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function stripMarked(html, start, end) {
  return html.replace(new RegExp(`${start}[\\s\\S]*?${end}\\n?`, "g"), "");
}

function updateHead(html, { title, description }) {
  return html
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`)
    .replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${esc(description)}">`);
}

function renderQuickPicks(items) {
  return `        <div class="quick-pick-grid">
${items.map(([label, pick, why]) => `          <article class="quick-pick">
            <span>${esc(label)}</span>
            <strong>${esc(pick)}</strong>
            <p>${esc(why)}</p>
          </article>`).join("\n")}
        </div>`;
}

function renderActivityComparison(rows, customHeaders) {
  const headers = customHeaders || ["Activity", "Best ages", "Time", "Cost", "Area", "Stroller", "Rain", "Nap", "Booking", "Why worth it", "Pair nearby"];
  return `        <div class="comparison-scroll">
          <table class="comparison-table">
            <thead><tr>${headers.map((header) => `<th>${esc(header)}</th>`).join("")}</tr></thead>
            <tbody>
${rows.map((row) => `              <tr>${row.map((cell) => `<td>${esc(cell)}</td>`).join("")}</tr>`).join("\n")}
            </tbody>
          </table>
        </div>`;
}

function renderVisitorScan(rows) {
  const headers = ["Trip type", "Best picks", "Age band", "Weather", "Budget", "Stroller/transit note", "Next step"];
  return `        <div class="comparison-scroll">
          <table class="comparison-table">
            <thead><tr>${headers.map((header) => `<th>${esc(header)}</th>`).join("")}</tr></thead>
            <tbody>
${rows.map(([trip, picks, ages, weather, budget, note, href, linkText]) => `              <tr><td>${esc(trip)}</td><td>${esc(picks)}</td><td>${esc(ages)}</td><td>${esc(weather)}</td><td>${esc(budget)}</td><td>${esc(note)}</td><td><a href="${esc(href)}">${esc(linkText)}</a></td></tr>`).join("\n")}
            </tbody>
          </table>
        </div>`;
}

function renderDetails(details, compact = false) {
  const labels = compact
    ? ["Why consider it", "Main tradeoff", "How to plan it", "Pair nearby"]
    : ["Why families like it", "Best ages", "What can go wrong", "Parent logistics", "Food/bathroom/reset", "Booking/timing", "Nearby pairing"];
  return `        <div class="detail-card-grid">
${details.map(([name, ...rawValues]) => {
  const values = compact
    ? [`${rawValues[0]} ${rawValues[1]}`, rawValues[2], `${rawValues[3]} ${rawValues[4]} ${rawValues[5]}`, rawValues[6]]
    : rawValues;
  return `          <article class="detail-card">
            <h3>${esc(name)}</h3>
            ${values.map((value, index) => `<section><h4>${esc(labels[index])}</h4><p>${esc(value)}</p></section>`).join("\n            ")}
          </article>`;
}).join("\n")}
        </div>`;
}

function renderPlans(plans) {
  return `        <div class="plan-grid">
${Object.entries(plans).map(([label, plan]) => `          <article class="plan-card">
            <h3>${esc(label)}</h3>
            <p>${esc(plan)}</p>
          </article>`).join("\n")}
        </div>`;
}

function renderClusterCards(cards) {
  return `        <div class="card-grid">
${cards.map(([title, body, href, linkText]) => `          <article class="activity-card"><h3>${esc(title)}</h3><p>${esc(body)}</p><p><a class="text-link" href="${esc(href)}">${esc(linkText)}</a></p></article>`).join("\n")}
        </div>`;
}

function renderLinkList(links) {
  return links.map(([href, label]) => `<a class="text-link" href="${esc(href)}">${esc(label)}</a>`).join(" ");
}

function renderPersonaRoutes(routes) {
  return `        <div class="card-grid">
${routes.map(([persona, body, links]) => `          <article class="activity-card"><h3>${esc(persona)}</h3><p>${esc(body)}</p><p>${renderLinkList(links)}</p></article>`).join("\n")}
        </div>`;
}

function renderOfficialChecks(checks) {
  return `        <div class="card-grid">
${checks.map(([title, body, links]) => `          <article class="activity-card"><h3>${esc(title)}</h3><p>${esc(body)}</p><p>${renderLinkList(links)}</p></article>`).join("\n")}
        </div>`;
}

function renderFaqs(faqs) {
  return `        <div class="card-grid">
${faqs.map(([question, answer]) => `          <article class="activity-card faq-card"><h3>${esc(question)}</h3><p>${esc(answer)}</p></article>`).join("\n")}
        </div>`;
}

function renderActivityUpgrade(page) {
  const clusterSection = page.clusterLinks?.length
    ? `
      <section class="band rank-ready-section">
        <div class="container">
          <div class="section-heading">
            <p class="eyebrow">${esc(page.clusterEyebrow || "Plan the cluster")}</p>
            <h2>${esc(page.clusterTitle || "Connect activities to stay area, route, and methodology")}</h2>
          </div>
${renderClusterCards(page.clusterLinks)}
        </div>
      </section>
`
    : "";
  const officialCheckSection = page.officialChecks?.length
    ? `
      <section class="container page-section rank-ready-section">
        <div class="section-heading">
          <p class="eyebrow">${esc(page.officialChecksEyebrow || "Rain and budget checks")}</p>
          <h2>${esc(page.officialChecksTitle || "Verify current offers and backup plans before building around them")}</h2>
        </div>
${renderOfficialChecks(page.officialChecks)}
      </section>
`
    : "";
  const faqSection = page.visibleFaqs && page.faqs?.length
    ? `
      <section class="band rank-ready-section" aria-labelledby="activity-faq-title">
        <div class="container">
          <div class="section-heading">
            <p class="eyebrow">Common planning questions</p>
            <h2 id="activity-faq-title">Las Vegas with kids FAQ</h2>
          </div>
${renderFaqs(page.faqs)}
        </div>
      </section>
`
    : "";

  return `${markerStart}
${page.firstTime ? `      <section class="container page-section rank-ready-section">
        <div class="section-heading">
          <p class="eyebrow">First-time visitors</p>
          <h2>Best NYC choices for a first family trip</h2>
        </div>
${renderQuickPicks(page.firstTime)}
        <p class="review-label">Planning guidance only. Verify current museum rules, timed-entry needs, stroller/elevator access, transit changes, weather, and safety advisories before committing to a route.</p>
      </section>

      <section class="band intro-band rank-ready-section">
        <div class="container">
          <div class="section-heading">
            <p class="eyebrow">Tourist trip planning</p>
            <h2>Scan by age, weather, budget, and stroller/transit friction</h2>
          </div>
          <p class="review-label">${esc(page.touristNote)}</p>
${renderVisitorScan(page.scanRows || [])}
        </div>
      </section>

      <section class="container page-section rank-ready-section">
        <div class="section-heading">
          <p class="eyebrow">Next planning step</p>
          <h2>Match activities to your stay base and route</h2>
        </div>
        <div class="card-grid">
          <article class="activity-card"><h3>Choose a family base</h3><p>NYC sightseeing changes by hotel area. Room size, elevator access, subway distance, stroller friction, and evening noise all affect the day.</p><p><a class="text-link" href="../where-to-stay/new-york-city-with-kids.html">Open where to stay in New York City with kids</a></p></article>
          <article class="activity-card"><h3>Turn picks into a route</h3><p>Use the itinerary page to avoid crossing town twice, protect meal windows, and keep rainy-day swaps realistic.</p><p><a class="text-link" href="../family-itinerary/new-york-city-with-kids.html">Open the New York City family itinerary</a></p></article>
          <article class="activity-card"><h3>Keep this page tourist-focused</h3><p>This evergreen guide is for trip planning. Local weekend events, seasonal calendars, and repeat-visit ideas need a separate freshness workflow before publishing.</p></article>
        </div>
      </section>

` : ""}${page.personaRoutes?.length ? `      <section class="container page-section rank-ready-section" aria-labelledby="san-diego-family-constraint-router">
        <div class="section-heading">
          <p class="eyebrow">San Diego cluster router</p>
          <h2 id="san-diego-family-constraint-router">Start with your family constraint</h2>
        </div>
        <p class="review-label">This is the all-ages activity hub. Use it to choose the first planning route, then move to the toddler, teen, stay, hotel, or itinerary page that matches the constraint you actually need to solve.</p>
${renderPersonaRoutes(page.personaRoutes)}
      </section>

` : ""}      <section class="band rank-ready-section">
        <div class="container">
          <div class="section-heading">
            <p class="eyebrow">${esc(page.quickEyebrow || "Quick picks")}</p>
            <h2>${esc(page.quickTitle || "Best choices by family situation")}</h2>
          </div>
${page.quickNote ? `          <p class="review-label">${esc(page.quickNote)}</p>\n` : ""}${renderQuickPicks(page.quick)}
        </div>
      </section>

      <section class="container page-section rank-ready-section">
        <div class="section-heading">
          <p class="eyebrow">Compare activities</p>
          <h2>Activity decision table</h2>
        </div>
${page.comparisonNote ? `        <p class="review-label">${esc(page.comparisonNote)}</p>\n` : ""}${renderActivityComparison(page.rows)}
      </section>

      <section class="band intro-band rank-ready-section">
        <div class="container">
          <div class="section-heading">
            <p class="eyebrow">${esc(page.detailsEyebrow || "Parent logistics")}</p>
            <h2>${esc(page.detailsTitle || "Detailed activity notes")}</h2>
          </div>
${page.detailsNote ? `          <p class="review-label">${esc(page.detailsNote)}</p>\n` : ""}${renderDetails(page.details, page.compactDetails)}
        </div>
      </section>

      <section class="container page-section rank-ready-section">
        <div class="section-heading">
          <p class="eyebrow">${esc(page.plansEyebrow || "Mini itineraries")}</p>
          <h2>${esc(page.plansTitle || "Turn the list into a realistic family day")}</h2>
        </div>
${renderPlans(page.plans)}
      </section>${clusterSection ? `${clusterSection}` : ""}
${officialCheckSection}${faqSection}${markerEnd}
`;
}

function renderTeenUpgrade(page) {
  const indexDecision = page.indexDecision
    ? `        <p class="review-label">${esc(page.indexDecision)}</p>\n`
    : "";
  const clusterCards = page.clusterLinks?.length
    ? renderClusterCards(page.clusterLinks)
    : `          <div class="card-grid">
            <article class="activity-card"><h3>All-ages activity hub</h3><p>Use the main guide when siblings, grandparents, toddlers, or mixed stamina levels change the activity shortlist.</p><p><a class="text-link" href="${esc(page.links.allAges)}">Open the all-ages things-to-do guide</a></p></article>
            <article class="activity-card"><h3>Where to stay</h3><p>Choose the lodging base before locking in teen routes; transit, parking, noise, pool value, and meal access shape the day.</p><p><a class="text-link" href="${esc(page.links.stay)}">Open the where-to-stay guide</a></p></article>
            <article class="activity-card"><h3>Family itinerary</h3><p>Use the itinerary page to keep the teen plan realistic around meals, weather, hotel resets, and younger siblings.</p><p><a class="text-link" href="${esc(page.links.itinerary)}">Open the family itinerary</a></p></article>
          </div>`;
  const officialCheckSection = page.officialChecks?.length
    ? `
      <section class="container page-section rank-ready-section">
        <div class="section-heading">
          <p class="eyebrow">${esc(page.officialChecksEyebrow || "Before locking the plan")}</p>
          <h2>${esc(page.officialChecksTitle || "Current checks for a teen trip")}</h2>
        </div>
${renderOfficialChecks(page.officialChecks)}
      </section>
`
    : "";
  const faqSection = page.visibleFaqs && page.faqs?.length
    ? `
      <section class="band rank-ready-section" aria-labelledby="teen-faq-title">
        <div class="container">
          <div class="section-heading">
            <p class="eyebrow">Common planning questions</p>
            <h2 id="teen-faq-title">${esc(page.faqTitle || `${page.city} with teens FAQ`)}</h2>
          </div>
${renderFaqs(page.faqs)}
        </div>
      </section>
`
    : "";
  return `${markerStart}
      <section class="band rank-ready-section">
        <div class="container">
          <div class="section-heading">
            <p class="eyebrow">Teen quick picks</p>
            <h2>${esc(page.quickHeading || "Best choices by teen trip style")}</h2>
          </div>
${indexDecision}${page.quickNote ? `          <p class="review-label">${esc(page.quickNote)}</p>\n` : ""}${renderQuickPicks(page.quick)}
        </div>
      </section>

      <section class="container page-section rank-ready-section">
        <div class="section-heading">
          <p class="eyebrow">Compare teen activities</p>
          <h2>Teen activity decision table</h2>
        </div>
        <p class="review-label">${esc(page.comparisonNote || "Planning guidance only. Verify current hours, ticketing, age or height rules, weather, transit, stroller needs for siblings, and safety advisories before committing to a teen itinerary.")}</p>
${renderActivityComparison(page.rows, page.comparisonHeaders)}
      </section>

      <section class="band intro-band rank-ready-section">
        <div class="container">
          <div class="section-heading">
            <p class="eyebrow">${esc(page.detailsEyebrow || "Teen logistics")}</p>
            <h2>${esc(page.detailsTitle || "Detailed notes for older-kid planning")}</h2>
          </div>
${page.detailsNote ? `          <p class="review-label">${esc(page.detailsNote)}</p>\n` : ""}${renderDetails(page.details, page.compactDetails)}
        </div>
      </section>

      <section class="container page-section rank-ready-section">
        <div class="section-heading">
          <p class="eyebrow">${esc(page.plansEyebrow || "Teen itineraries")}</p>
          <h2>${esc(page.plansTitle || "Route ideas that avoid generic sightseeing marathons")}</h2>
        </div>
${renderPlans(page.plans)}
      </section>

      <section class="band rank-ready-section">
        <div class="container">
          <div class="section-heading">
            <p class="eyebrow">Plan the cluster</p>
            <h2>Use the teen page with the broader family guide</h2>
          </div>
${clusterCards}
        </div>
      </section>
${officialCheckSection}${faqSection}${markerEnd}
`;
}

function removeGeneratedAgeSections(html) {
  const start = html.indexOf('      <section class="band intro-band">');
  const end = html.indexOf('      <section class="container page-section source-section">');
  if (start === -1 && end !== -1) return html;
  if (start === -1 || end === -1 || end <= start) {
    throw new Error("Expected generated age-page sections were not found");
  }
  return `${html.slice(0, start)}${html.slice(end)}`;
}

function removeGeneratedBodySections(html) {
  return removeGeneratedAgeSections(html);
}

function replaceSourceSection(html, page) {
  if (!page.sources?.length) return html;
  const section = `      <section class="container page-section source-section">
        <div class="section-heading">
          <p class="eyebrow">Sources checked</p>
          <h2>Official sources and licensing notes</h2>
        </div>
        <p>${esc(page.sourcesIntro || "Use these official pages to verify current details before planning around them.")}</p>
        <ul class="source-list">
${page.sources.map(([label, href]) => `          <li><a href="${esc(href)}">${esc(label)}</a></li>`).join("\n")}
        </ul>
      </section>`;
  const pattern = /      <section class="container page-section source-section">[\s\S]*?      <\/section>/;
  if (!pattern.test(html)) throw new Error("Expected source section was not found");
  return html.replace(pattern, section);
}

function renderStayMatrix(rows, labelMode = "default", customHeaders) {
  const headers = customHeaders || (labelMode === "verification"
    ? ["Area candidate", "Research angle", "What to verify", "Route/transport check", "Stroller/access check", "Smoke/noise check", "Parking/fee check", "Walking check", "Nearby anchor context", "Property type", "Evidence state"]
    : ["Area", labelMode === "hypothesis" ? "Research angle" : "Best for", "Main tradeoff", "Transit/driving", "Stroller", "Noise", "Parking", "Walkability", "Nearby attractions", "Hotel type", labelMode === "hypothesis" ? "Evidence state" : "Family verdict"]);
  return `        <div class="comparison-scroll">
          <table class="comparison-table">
            <thead><tr>${headers.map((header) => `<th>${esc(header)}</th>`).join("")}</tr></thead>
            <tbody>
${rows.map((row) => `              <tr>${row.map((cell) => `<td>${esc(cell)}</td>`).join("")}</tr>`).join("\n")}
            </tbody>
          </table>
        </div>`;
}

function renderItineraryMatrix(rows) {
  const headers = ["Route", "Best structure", "Best for", "Rest window", "Stroller/drive friction", "Meal/reset notes", "What to skip"];
  return `        <div class="comparison-scroll">
          <table class="comparison-table">
            <thead><tr>${headers.map((header) => `<th>${esc(header)}</th>`).join("")}</tr></thead>
            <tbody>
${rows.map((row) => `              <tr>${row.map((cell) => `<td>${esc(cell)}</td>`).join("")}</tr>`).join("\n")}
            </tbody>
          </table>
        </div>`;
}

function renderHotels(hotels) {
  const labels = ["Potential fit", "Room setup", "Pool", "Breakfast", "Kitchen/laundry", "Crib/rollaway", "Parking/fees", "Noise risk", "Family fit to verify"];
  return `        <div class="detail-card-grid">
${hotels.map(([name, ...values]) => `          <article class="detail-card research-card">
            <h3>${esc(name)}</h3>
            ${values.map((value, index) => `<section><h4>${esc(labels[index])}</h4><p>${esc(value)}</p></section>`).join("\n            ")}
          </article>`).join("\n")}
        </div>`;
}

function renderVerificationChecks(checks) {
  return `        <div class="detail-card-grid">
${checks.map(([name, value]) => `          <article class="detail-card research-card">
            <h3>${esc(name)}</h3>
            <p>${esc(value)}</p>
          </article>`).join("\n")}
        </div>`;
}

function renderStayTool() {
  return `      <section class="container page-section rank-ready-section stay-tool-section" aria-labelledby="stay-tool-title">
        <div class="section-heading">
          <p class="eyebrow">Build a shortlist</p>
          <h2 id="stay-tool-title">Choose your biggest family constraint</h2>
        </div>
        <p class="review-label">Select what matters most and get a focused checklist for comparing your final two areas and hotels.</p>
        <div class="stay-tool-layout">
          <form id="san-diego-stay-tool" class="stay-tool-form">
            <fieldset>
              <legend>Hardest trip constraint</legend>
              <label><input type="radio" name="primary" value="beach" checked> Usable beach access</label>
              <label><input type="radio" name="primary" value="activities"> Activity-route simplicity</label>
              <label><input type="radio" name="primary" value="car-light"> Fewer car-dependent moments</label>
              <label><input type="radio" name="primary" value="quiet"> Quiet reset time</label>
              <label><input type="radio" name="primary" value="value"> Full-stay value</label>
              <label><input type="radio" name="primary" value="room"> Room and sleep setup</label>
            </fieldset>
            <fieldset>
              <legend>Expected transport</legend>
              <label><input type="radio" name="transport" value="driving" checked> Driving or rideshare</label>
              <label><input type="radio" name="transport" value="car-light"> Prefer car-light</label>
            </fieldset>
            <fieldset class="stay-tool-needs">
              <legend>Extra constraints</legend>
              <label><input type="checkbox" name="need" value="stroller"> Stroller-sensitive routes</label>
              <label><input type="checkbox" name="need" value="nap"> Midday nap or reset</label>
              <label><input type="checkbox" name="need" value="kitchen"> Kitchen or laundry</label>
            </fieldset>
            <button class="button tool-submit" type="submit">Build my comparison checklist</button>
            <p class="note">Your answers stay in this browser tab and are not sent or stored.</p>
          </form>
          <section class="result-panel stay-tool-result" aria-labelledby="stay-tool-result-title" aria-live="polite">
            <p class="eyebrow">Your research sequence</p>
            <h3 id="stay-tool-result-title">Your comparison checklist</h3>
            <p id="stay-tool-summary">Choose the constraint that would most affect the trip.</p>
            <ol id="stay-tool-checklist">
              <li>Shortlist two areas as hypotheses, not conclusions.</li>
              <li>Verify exact properties, routes, dates, and total prices.</li>
            </ol>
            <p class="note">Recheck changing transit, beach, price, fee, and property information near the booking date.</p>
          </section>
        </div>
        <p class="note stay-tool-sources">Current starting points: <a href="https://www.sandiego.gov/planning/community-plans/mission-valley">City of San Diego Mission Valley plan</a>, <a href="https://www.sdmts.com/getting-around/maps-and-schedules">MTS maps and schedules</a>, and <a href="https://www.sandiegocounty.gov/content/sdc/deh/lwqd/beachandbay.html">County beach and bay status</a>.</p>
        <noscript><p class="review-label">Use the area matrix and four hotel checks below as a manual checklist.</p></noscript>
      </section>`;
}

function renderStayUpgrade(page) {
  const areaNote = page.areaNote ? `        <p class="review-label">${esc(page.areaNote)}</p>\n` : "";
  const decisionSection = page.hotelDecision?.length
    ? `      <section class="container page-section rank-ready-section">
        <div class="section-heading">
          <p class="eyebrow">Hotel decision support</p>
          <h2>How to evaluate family-friendly hotel claims</h2>
        </div>
        <p class="review-label">Hotel guidance on this page is research-based planning support, not a personally verified recommendation. Use official property pages and the booking screen to verify details before paying.</p>
${renderVerificationChecks(page.hotelDecision)}
      </section>`
    : "";
  const bookingSection = page.bookingChecks?.length
    ? `      <section class="container page-section rank-ready-section">
        <div class="section-heading">
          <p class="eyebrow">Booking checks</p>
          <h2>${esc(page.bookingHeading || "Official-source checks before you book")}</h2>
        </div>
${renderVerificationChecks(page.bookingChecks)}
      </section>`
    : "";
  const clusterSection = page.clusterLinks?.length
    ? `      <section class="band rank-ready-section">
        <div class="container">
          <div class="section-heading">
            <p class="eyebrow">Plan the cluster</p>
            <h2>${esc(page.clusterHeading || "Use the stay guide with activities, itinerary, and methodology")}</h2>
          </div>
${renderClusterCards(page.clusterLinks)}
        </div>
      </section>`
    : "";
  const faqSection = page.visibleFaqs && page.faqs?.length
    ? `      <section class="container page-section rank-ready-section" aria-labelledby="stay-faq-title">
        <div class="section-heading">
          <p class="eyebrow">Common planning questions</p>
          <h2 id="stay-faq-title">${esc(page.faqTitle || `${page.city} family stay FAQ`)}</h2>
        </div>
${renderFaqs(page.faqs)}
      </section>`
    : "";
  const hotelSection = page.hideHotelSection ? "" : page.hotels?.length
    ? `      <section class="band intro-band rank-ready-section">
        <div class="container">
          <div class="section-heading">
            <p class="eyebrow">Hotel fit checks</p>
            <h2>Research-backed hotel verification notes</h2>
          </div>
          <p class="review-label">${esc(page.hotelNote || "Research-based hotel fit notes. Verify fees, room type, policies, and amenities before booking; these are not personally verified hotel recommendations.")}</p>
${renderHotels(page.hotels)}
        </div>
      </section>`
    : `      <section class="band intro-band rank-ready-section">
        <div class="container">
          <div class="section-heading">
            <p class="eyebrow">Before booking</p>
            <h2>What to verify before choosing a family hotel</h2>
          </div>
          <p class="review-label">${esc(page.hotelNote || "No firm hotel recommendations are being made in this pass. Verify exact hotel claims before booking.")}</p>
${renderVerificationChecks(page.verify || [])}
        </div>
      </section>`;

  const toolSection = page.stayTool ? `${renderStayTool()}\n\n` : "";

  return `${markerStart}
${toolSection}      <section class="band rank-ready-section">
        <div class="container">
          <div class="section-heading">
            <p class="eyebrow">Quick decision</p>
            <h2>${esc(page.quickHeading || (page.stayTool || page.constraintLed ? "Area hypotheses by family need" : "Best areas by family need"))}</h2>
          </div>
${renderQuickPicks(page.quick)}
        </div>
      </section>

      <section class="container page-section rank-ready-section">
        <div class="section-heading">
          <p class="eyebrow">Area matrix</p>
          <h2>${esc(page.matrixHeading || "Compare the stay tradeoffs before booking")}</h2>
        </div>
${areaNote}${renderStayMatrix(page.rows, page.constraintLed ? "verification" : page.stayTool ? "hypothesis" : "default", page.areaHeaders)}
      </section>

${[decisionSection, hotelSection, bookingSection, clusterSection, faqSection].filter(Boolean).join("\n\n")}
${page.stayTool ? '      <script type="module" src="../san-diego-stay-tool.mjs"></script>\n' : ''}${markerEnd}
`;
}

function renderItineraryUpgrade(page) {
  const clusterCards = page.clusterCards?.length
    ? page.clusterCards
    : [
        ["All-ages activity guide", `Use the main ${page.city} activity guide to compare family stops by age, weather, pacing, and logistics.`, page.links?.allAges || `../things-to-do/${slugify(page.city)}-with-kids.html`, `Open ${page.city} things to do with kids`],
        ["Where to stay first", `Pick the lodging base before locking the route. Area, parking, transit, stroller, noise, and meal access can change the day shape.`, page.links?.stay || `../where-to-stay/${slugify(page.city)}-with-kids.html`, `Open where to stay in ${page.city} with kids`]
      ];

  return `${markerStart}
      <section class="band rank-ready-section">
        <div class="container">
          <div class="section-heading">
            <p class="eyebrow">Quick route decisions</p>
            <h2>Choose the ${esc(page.city)} plan that matches your family</h2>
          </div>
${renderQuickPicks(page.quick)}
        </div>
      </section>

      <section class="container page-section rank-ready-section">
        <div class="section-heading">
          <p class="eyebrow">Compare itinerary options</p>
          <h2>1-day, 2-day, 3-day, toddler, teen, and rainy-day variants</h2>
        </div>
        <p class="review-label">Planning guidance only. Verify current hours, tickets, weather, route conditions, safety advisories, transit/stroller access, parking, drive or transfer times, and child energy before booking or promising a route.</p>
${renderItineraryMatrix(page.rows)}
      </section>

      <section class="band intro-band rank-ready-section">
        <div class="container">
          <div class="section-heading">
            <p class="eyebrow">Pacing rules</p>
            <h2>How to keep the day from getting too ambitious</h2>
          </div>
${renderPlans(page.plans)}
        </div>
      </section>

      <section class="container page-section rank-ready-section">
        <div class="section-heading">
          <p class="eyebrow">Cluster links</p>
          <h2>Swap activities without rebuilding the whole trip</h2>
        </div>
        <div class="card-grid">
${clusterCards.map(([title, body, href, linkText]) => `          <article class="activity-card"><h3>${esc(title)}</h3><p>${esc(body)}</p><p><a class="text-link" href="${esc(href)}">${esc(linkText)}</a></p></article>`).join("\n")}
        </div>
      </section>
${markerEnd}
`;
}

function faqSchema(page) {
  if (!page.faqs?.length) return "";
  return `${schemaStart}
    <script type="application/ld+json">${JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: page.faqs.map(([question, answer]) => ({
        "@type": "Question",
        name: question,
        acceptedAnswer: { "@type": "Answer", text: answer }
      }))
    })}</script>
${schemaEnd}
`;
}

function itemListSchema(page) {
  if (!page.rows?.length) return "";
  return `${schemaStart}
    <script type="application/ld+json">${JSON.stringify({
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: page.schemaName || `${page.city} family travel planning options`,
      itemListElement: page.rows.map((row, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: row[0],
        description: row[9] || row[1]
      }))
    })}</script>
${schemaEnd}
`;
}

function insertBeforeMainEnd(html, section) {
  if (html.includes('<section class="container page-section source-section">')) {
    return html.replace(
      /\s*<section class="container page-section source-section">/,
      () => `\n${section}      <section class="container page-section source-section">`
    );
  }
  return html.replace(/\s*<\/main>/, () => `\n${section}    </main>`);
}

function insertAfterIntroBand(html, section) {
  const marker = '      <section class="container page-section">\n        <div class="section-heading">\n          <p class="eyebrow">Activity filters</p>';
  if (html.includes(marker)) {
    return html.replace(marker, () => `${section}${marker}`);
  }
  return insertBeforeMainEnd(html, section);
}

function insertSchema(html, schema) {
  if (!schema) return html;
  return html.replace(/\s*<\/body>/, () => `\n${schema}  </body>`);
}

function applyBaseReplacements(html, replacements = []) {
  for (const [before, after] of replacements) {
    if (html.includes(before)) {
      html = html.replace(before, after);
      continue;
    }
    if (!html.includes(after)) {
      throw new Error(`Expected base-page text was not found: ${before.slice(0, 80)}`);
    }
  }
  return html;
}

function upgradeFile(outDir, path, page, type) {
  const full = join(outDir, path);
  let html = readFileSync(full, "utf8");
  html = stripMarked(html, markerStart, markerEnd);
  html = stripMarked(html, schemaStart, schemaEnd);
  html = updateHead(html, page);
  html = applyBaseReplacements(html, page.baseReplacements);
  if (page.removeGeneratedAgeSections) html = removeGeneratedAgeSections(html);
  if (page.removeGeneratedBodySections) html = removeGeneratedBodySections(html);
  html = replaceSourceSection(html, page);
  const section = type === "activity"
    ? renderActivityUpgrade(page)
    : type === "itinerary"
      ? renderItineraryUpgrade(page)
      : type === "teen"
        ? renderTeenUpgrade(page)
      : renderStayUpgrade(page);
  const schema = `${itemListSchema(page)}${faqSchema(page)}`;
  html = page.placement === "after-intro" ? insertAfterIntroBand(html, section) : insertBeforeMainEnd(html, section);
  html = insertSchema(html, schema);
  writeFileSync(full, html);
}

export function upgradePriorityPages(outDir) {
  for (const [path, page] of Object.entries(activityPages)) {
    upgradeFile(outDir, path, page, "activity");
  }
  for (const [path, page] of Object.entries(stayPages)) {
    upgradeFile(outDir, path, page, "stay");
  }
  for (const [path, page] of Object.entries(itineraryPages)) {
    upgradeFile(outDir, path, page, "itinerary");
  }
  for (const [path, page] of Object.entries(teenPages)) {
    upgradeFile(outDir, path, page, "teen");
  }
}
