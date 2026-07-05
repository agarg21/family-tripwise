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
      ["Best for teens", "La Jolla Cove", "More scenery and independence than a playground-heavy day."],
      ["Best rainy-day option", "Birch Aquarium or Balboa Park museums", "Both are easier to shorten than a full theme-park day."],
      ["Best free/low-cost", "Mission Bay or La Jolla tide-pool walk", "Parking is the main friction; the activity itself can stay low-cost."],
      ["Best stroller-friendly", "Balboa Park core and zoo bus tour", "Use paved routes and transit inside the zoo to reduce walking."],
      ["Best half-day anchor", "Birch Aquarium plus La Jolla coast", "Works as a contained morning or afternoon without overloading the day."],
      ["Best if you only have one day", "Zoo early, Balboa Park reset, Mission Bay or hotel pool", "Gives San Diego's family signature without crossing the city repeatedly."]
    ],
    rows: [
      ["San Diego Zoo", "2-14", "4-6 hrs", "$$$", "Balboa Park", "Moderate", "No", "Medium", "Book ahead in peak periods", "Biggest family payoff in one place", "Balboa Park playground or one museum"],
      ["Mission Bay beach morning", "0-8", "2-3 hrs", "$", "Mission Bay", "Mixed sand/paved", "No", "High", "No", "Low-pressure water and sand time", "Hotel pool, Belmont Park, casual tacos"],
      ["Balboa Park museums", "4-14", "2-4 hrs", "$$", "Balboa Park", "Easy in core", "Yes", "Medium", "Check timed exhibits", "Good weather-proof culture stop", "Zoo, playground, gardens"],
      ["Birch Aquarium", "2-10", "90 min-2 hrs", "$$", "La Jolla", "Easy", "Partial", "High", "Often helpful", "Manageable size and ocean views", "La Jolla Shores or Cove drive-by"],
      ["La Jolla Cove", "7+", "2-4 hrs", "$", "La Jolla", "Hard", "No", "Low", "No", "Memorable coast and sea-life viewing", "Birch Aquarium, casual lunch"],
      ["Coronado ferry/waterfront", "4+", "2-3 hrs", "$$", "Downtown/Coronado", "Easy", "No", "Medium", "Check ferry times", "Scenic outing with built-in transport", "Waterfront dinner or beach walk"]
    ],
    details: [
      ["San Diego Zoo", "Families like it because it can satisfy animal lovers, walkers, and kids who need a big headline day.", "Best for toddlers through teens, but toddlers need the bus tour and fewer zones.", "Trying to cover the whole zoo, heat, hills, and late starts.", "Arrive early, choose two or three zones, and use the bus tour before everyone is tired.", "Bathrooms and food are inside the park; for a calmer reset, leave room for a Balboa Park garden or playground after.", "Buy dated tickets ahead during school breaks; do not stack this with La Jolla on the same day.", "Pair with Balboa Park, not a beach across town."],
      ["Mission Bay beach morning", "Families like the calmer bay water and flexible start-stop rhythm.", "Best for babies, toddlers, preschoolers, and early elementary kids.", "Sand plus gear can make stroller use awkward; shade and parking vary by spot.", "Treat this as a morning block before sun and overtired kids peak.", "Use the hotel or nearby casual food as the bathroom/reset plan unless you verify facilities for a specific beach.", "No booking needed; check weather, tide, and parking before leaving.", "Pair with hotel pool, a short nap, or a light afternoon aquarium stop."],
      ["Balboa Park museums", "Families like that the park lets you pivot between museums, gardens, playgrounds, and open space.", "Best for preschoolers through teens when you choose the right museum.", "Museum fatigue and long walks between attractions.", "Pick one paid museum, then add a free outdoor stop instead of buying a full day of tickets.", "The park has multiple restrooms and food options, but exact hours vary and should be checked before relying on them.", "Book special exhibits if needed; otherwise keep the plan flexible.", "Pair with the zoo only if you keep the museum stop short."],
      ["Birch Aquarium", "Families like the compact footprint and indoor/outdoor mix.", "Best for toddlers through elementary-age kids.", "It may feel too short for teens unless paired with the coast.", "Use it as a 90-minute reset or rainy-day anchor rather than a full-day plan.", "Restrooms and food availability should be verified for the day of visit; La Jolla has more meal options nearby.", "Timed tickets can help; check hours and parking before going.", "Pair with La Jolla Shores for younger kids or La Jolla Cove for older kids."],
      ["La Jolla Cove", "Families like the sea lions, coastline, and high-memory payoff.", "Best for elementary kids, tweens, and teens.", "Crowds, parking, stairs, uneven paths, and stroller frustration.", "Skip the stroller-heavy version unless you have a clear paved route and realistic parking plan.", "Plan bathrooms and food before arriving; this is not a place to improvise with an overtired toddler.", "No booking, but go early or off-peak.", "Pair with Birch Aquarium or a single La Jolla meal, not multiple cross-town stops."],
      ["Coronado ferry and waterfront", "Families like that the ferry ride itself becomes the attraction.", "Best for preschoolers and up.", "Ferry timing, wind, and the need to coordinate return plans.", "Use it from Downtown when you want an outing without driving and parking again.", "Downtown and Coronado both have food options; verify restrooms near your exact landing.", "Check ferry times before promising it to kids.", "Pair with waterfront dinner, a beach walk, or a calm hotel evening."]
    ],
    plans: {
      "1-day plan": "Start at the zoo when it opens, use the bus tour first, eat nearby, rest after lunch, then choose Mission Bay or a hotel pool instead of crossing to La Jolla.",
      "2-day plan": "Day 1: Zoo plus a short Balboa Park stop. Day 2: Birch Aquarium and La Jolla for older kids, or Mission Bay plus Coronado for younger kids.",
      "Rainy-day plan": "Use Birch Aquarium or one Balboa Park museum as the anchor, keep meals close, and save the zoo or beach for the best weather window.",
      "Toddler-friendly plan": "Mission Bay morning, nap or hotel reset, then Birch Aquarium or a short zoo bus-tour visit.",
      "Teen-friendly plan": "La Jolla Cove, kayak/sea-cave style adventure if appropriate, food stop, then Coronado or a sunset waterfront walk."
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
      ["What is the best rainy-day activity in Chicago with kids?", "Shedd Aquarium and Field Museum are the safest rainy-day anchors for most families."]
    ]
  },
  "things-to-do/las-vegas-with-kids.html": {
    title: "Things to Do in Las Vegas With Kids: Pools, Shows, Heat and Strip Logistics",
    description:
      "Plan Las Vegas with kids using family-friendly activity picks, heat-aware timing, Strip walking warnings, stroller notes, rainy-day backups, and hotel-pool downtime.",
    city: "Las Vegas",
    quick: [
      ["Best overall", "Hotel pool plus one spectacle", "Vegas works best when the hotel is part of the plan."],
      ["Best for toddlers", "Discovery Children's Museum", "Indoor, kid-centered, and away from casino floors."],
      ["Best for teens", "Area15 or Red Rock Canyon", "More age-appropriate payoff than repeated resort wandering."],
      ["Best rainy-day option", "Discovery Children's Museum or Area15", "Pick by age and sensory tolerance."],
      ["Best free/low-cost", "Bellagio Conservatory and fountains", "Short, memorable, and easy to pair with a meal."],
      ["Best stroller-friendly", "Hotel pool/resort base", "The Strip itself is not as stroller-easy as it looks on a map."],
      ["Best half-day anchor", "Red Rock Canyon for older kids", "A strong break from casino/resort environments."],
      ["Best if you only have one day", "Pool morning, Bellagio stop, High Roller or age-appropriate show", "Keeps the day contained."]
    ],
    rows: [
      ["Hotel pool day", "0-17", "Half day", "$$", "Hotel", "Easy", "No", "High", "Check rules", "Most realistic family anchor", "Early dinner or short spectacle"],
      ["Bellagio Conservatory/fountains", "2+", "60-90 min", "$", "Center Strip", "Moderate", "Partial", "Medium", "No", "Classic low-cost Vegas moment", "Nearby meal"],
      ["Discovery Children's Museum", "1-9", "2-3 hrs", "$$", "Downtown", "Easy", "Yes", "High", "Check tickets", "Best younger-kid indoor stop", "Downtown Container Park if appropriate"],
      ["High Roller", "6+", "45-60 min", "$$", "LINQ", "Easy", "Yes", "Medium", "Book ahead useful", "Contained skyline activity", "LINQ Promenade food"],
      ["Red Rock Canyon", "8+", "Half day", "$$", "West of Strip", "Hard", "No", "Low", "Timed entry may apply", "Nature break for older kids", "Low-key hotel evening"],
      ["Area15", "10+", "2-3 hrs", "$$$", "Off Strip", "Mixed", "Yes", "Low", "Book exhibits", "Teen-friendly immersive stop", "Food hall/reset nearby"]
    ],
    details: [
      ["Hotel pool day", "Families like that it makes Vegas feel like a vacation instead of a logistics puzzle.", "Best for all ages if the hotel pool fits your child.", "Pool rules, shade, crowding, and resort fees.", "Choose the hotel partly by pool setup, not just room price.", "Your room is the reset; that is the point.", "Verify hours, height rules, seasonal closures, and whether tubes/cabanas cost extra.", "Pair with one short evening activity."],
      ["Bellagio Conservatory and fountains", "Families like the visual payoff with low commitment.", "Best for toddlers through teens.", "Long resort walks and crowds.", "Treat it as a short stop, not a full outing.", "Use nearby hotel food/restrooms, but expect walking.", "No ticket needed.", "Pair with an early dinner or High Roller."],
      ["Discovery Children's Museum", "Families like a true kid-centered indoor break.", "Best for toddlers through early elementary kids.", "It is not the best teen stop.", "Use it when younger kids need to reset away from the Strip.", "Downtown food/restroom planning should be checked before arrival.", "Check hours and ticketing.", "Pair with a hotel pool nap/resort reset."],
      ["High Roller", "Families like that it is contained and scenic.", "Best for school-age kids and teens.", "May feel expensive for a short ride.", "Go when everyone can handle a line and a slow ride.", "Use LINQ Promenade before boarding.", "Advance tickets can help.", "Pair with food nearby rather than another long walk."],
      ["Red Rock Canyon", "Families like the complete change of scenery.", "Best for older kids and teens.", "Drive time, heat, trail difficulty, and younger siblings.", "Make it the main half-day plan and carry water.", "Bathroom/food options are limited compared with the Strip; plan ahead.", "Check timed entry and weather.", "Pair with a low-key hotel evening."],
      ["Area15", "Families with teens like the immersive feel.", "Best for tweens and teens.", "Sensory overload, cost, and age appropriateness.", "Choose specific exhibits rather than wandering into everything.", "Food is nearby, but verify suitability by age.", "Book the exact exhibit you want.", "Pair with pool downtime, not another loud evening."]
    ],
    plans: {
      "1-day plan": "Pool morning, Bellagio Conservatory/fountains, early dinner, then High Roller or an age-appropriate show.",
      "2-day plan": "Day 1: Pool and classic Strip visuals. Day 2: Discovery Children's Museum for younger kids or Red Rock/Area15 for older kids.",
      "Rainy-day plan": "Use Discovery Children's Museum or Area15 as the anchor, keep resort walking short, and avoid stacking indoor casino corridors.",
      "Toddler-friendly plan": "Pool, nap, Discovery Children's Museum, and one short fountain stop.",
      "Teen-friendly plan": "Red Rock Canyon or Area15, interesting food, and one skyline/spectacle activity."
    },
    faqs: [
      ["Is Las Vegas good for kids?", "It can be, if the hotel, pool, heat, walking distance, and evening environment are planned carefully."],
      ["What should families avoid in Las Vegas?", "Avoid assuming Strip distances are easy with kids, strollers, heat, or tired legs."]
    ]
  },
  "things-to-do/san-diego-with-toddlers.html": {
    title: "Things to Do in San Diego With Toddlers: Naps, Strollers, Beaches and Short Stops",
    description:
      "Plan San Diego with toddlers using short-session activities, stroller notes, nap-friendly timing, bathroom/reset planning, beach choices, and rainy-day options.",
    city: "San Diego",
    quick: [
      ["Best overall", "Mission Bay morning", "The easiest toddler rhythm: sand, water, snack, leave."],
      ["Best animal stop", "San Diego Zoo bus tour", "Use the bus and a few zones, not the whole zoo."],
      ["Best rainy-day option", "Birch Aquarium", "Small enough for toddlers and easy to shorten."],
      ["Best free/low-cost", "Balboa Park playground/garden time", "Good reset if you avoid over-scheduling."],
      ["Best stroller-friendly", "Balboa Park core", "Paved routes and short loops beat cove stairs."],
      ["Best half-day anchor", "Birch Aquarium plus La Jolla Shores", "Works if you keep the beach portion simple."],
      ["Best nap-friendly", "Hotel pool or Mission Bay", "Close, flexible, and easy to abandon."],
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
      ["Mission Bay", "Toddlers like the open-ended sand and calmer bay feel.", "Best for babies through preschoolers.", "Gear load, sun, and sandy stroller frustration.", "Arrive early, keep the session short, and leave before lunch spirals.", "Use your hotel or verified beach facilities as the reset plan.", "No booking; check weather, parking, and shade.", "Pair with a nap and pool rather than another major attraction."],
      ["San Diego Zoo bus tour", "Toddlers get animal payoff without walking every path.", "Best for toddlers who can handle a bus ride and short viewing stops.", "The zoo is too big if adults chase completion.", "Start with the bus tour, then choose one animal zone.", "Food/restrooms are inside, but do not wait until urgent.", "Buy ahead in busy periods.", "Pair with a playground or hotel reset."],
      ["Birch Aquarium", "Toddlers like the tanks and manageable size.", "Best for toddlers and preschoolers.", "It may be over quickly, which is fine if planned as a short stop.", "Treat it as a 90-minute anchor.", "Verify food/restroom setup for the day.", "Check ticket windows.", "Pair with La Jolla Shores, not a long Cove hike."],
      ["Balboa Park playground/gardens", "Toddlers get movement without a full paid attraction.", "Best for toddlers who need a reset.", "The park can sprawl if you wander without a plan.", "Choose one playground/garden area and stop.", "Check restrooms near your chosen area.", "No booking for outdoor time.", "Pair with the zoo bus tour or one short museum."],
      ["Coronado beach walk", "Toddlers like the simpler beach-town pace.", "Best for older toddlers and preschoolers.", "Bridge/ferry logistics can add friction.", "Use it when you want a calmer half day.", "Plan snacks and bathrooms before beach time.", "Check ferry timing if not driving.", "Pair with an early dinner or ferry ride."]
    ],
    plans: {
      "1-day plan": "Zoo bus tour early, one animal zone, hotel nap, then Mission Bay or pool.",
      "2-day plan": "Day 1: Mission Bay and pool. Day 2: Birch Aquarium or zoo bus tour with a Balboa Park reset.",
      "Rainy-day plan": "Birch Aquarium, short meal, hotel reset. Add a Balboa Park museum only if your toddler is still regulated.",
      "Toddler-friendly plan": "Short sessions, snack before transitions, and one real activity per half day.",
      "Teen-friendly plan": "Not applicable; use the San Diego with teens page for older-kid planning."
    },
    faqs: [
      ["Is San Diego good with toddlers?", "Yes. Mission Bay, the zoo bus tour, Birch Aquarium, Balboa Park, and hotel-pool pacing make it one of the better toddler city trips."],
      ["Should toddlers visit La Jolla Cove?", "Only with realistic parking and stroller expectations. La Jolla Shores or Birch Aquarium is usually easier."]
    ]
  },
  "things-to-do/new-york-city-with-kids.html": {
    title: "Things to Do in New York City With Kids: Strollers, Transit, Museums and One-Day Plans",
    description:
      "Plan New York City with kids by age, stroller difficulty, subway friction, rainy-day museums, nap-friendly routing, free activities, and nearby pairings.",
    city: "New York City",
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
    faqs: [
      ["What is the best thing to do in NYC with kids?", "For most first-time families, Central Park plus the American Museum of Natural History is the most reliable all-age pairing."],
      ["Is New York City stroller-friendly?", "Some parks and museums are stroller-friendly, but subway elevators, crowded sidewalks, and Midtown congestion make route planning important."]
    ]
  }
};

const stayPages = {
  "where-to-stay/san-diego-with-kids.html": {
    title: "Where to Stay in San Diego With Kids: Best Areas, Tradeoffs and Family Hotel Checks",
    description:
      "Compare where to stay in San Diego with kids by beach access, zoo drives, stroller ease, parking, walkability, noise, hotel type, and family tradeoffs.",
    city: "San Diego",
    quick: [
      ["Best overall area", "Mission Bay", "Best balance of pools, bay beaches, and easy drives."],
      ["Best for first-timers", "Mission Bay or Downtown/Little Italy", "Choose Mission Bay for resort ease, Downtown for meals and harbor access."],
      ["Best without a car", "Downtown / Little Italy", "Most practical for restaurants, harbor, ferry, rideshares, and trolley use."],
      ["Best with toddlers", "Mission Bay", "Shorter beach sessions and pool resets matter."],
      ["Best for beaches", "Coronado or Mission Bay", "Coronado feels more classic; Mission Bay is easier with younger kids."],
      ["Best for museums/zoo", "Downtown, Mission Valley, or Mission Bay", "Depends on whether you want walkability or parking/value."],
      ["Best budget-friendly", "Mission Valley / Hotel Circle", "Usually better parking/value, but car-dependent."],
      ["Think twice about", "La Jolla with stroller-heavy toddlers", "Beautiful, but hills and parking can become the trip story."]
    ],
    rows: [
      ["Mission Bay", "Toddlers, pools, bay beaches", "Less neighborhood walking", "Easy driving", "Good", "Medium", "Hotel/resort fees vary", "Low", "Zoo, SeaWorld, beaches", "Resorts and family hotels", "Best default"],
      ["La Jolla", "Scenery, tide pools, older kids", "Hills and parking", "Moderate-hard", "Limited near Cove", "Medium", "Harder/paid", "Medium", "Cove, Shores, Birch Aquarium", "Boutique/luxury/coastal", "Great if kids can walk"],
      ["Downtown / Little Italy", "Walkable meals, harbor", "Noise and room size", "Low car need", "Good", "Medium-high", "Expensive", "High", "Waterfront, ferry, Balboa Park rideshare", "Urban hotels", "Best no-car base"],
      ["Coronado", "Classic beach pace", "Price and bridge/ferry logistics", "Moderate", "Good", "Low-medium", "Can be expensive", "Medium", "Beach, ferry, waterfront", "Beach resorts/inns", "Best splurge beach stay"],
      ["Mission Valley / Hotel Circle", "Value, parking, central drives", "Not walkable/vacation-feeling", "Car required", "Medium", "Medium", "Often easier", "Low", "Zoo, Old Town, beaches by car", "Chain hotels/suites", "Best value with car"]
    ],
    hotelNote: "Research checked against official property pages in July 2026. Verify fees, exact room type, crib/rollaway policy, pool hours, and cancellation terms before booking.",
    hotels: [
      ["Bahia Resort Hotel", "Strong Mission Bay family-suite candidate", "Bay Family Suite lists 675 sq ft, multiple beds, a sofa bed, kitchenette-style amenities, balcony, and two bathrooms", "Pool plus bay/beach setting; resort fee covers pool towels and beach/resort extras", "On-property dining includes grab-and-go and seasonal poolside options", "Family suite lists refrigerator, microwave, toaster, and coffeemaker; laundry should be verified", "Request crib/rollaway details directly before booking", "Official FAQ says one vehicle per guest room parks without a separate parking charge; resort fee still applies", "Mission Bay resort setting can be calmer than downtown, but room location still matters", "Best fit when you want bay time, a larger room setup, and fewer car trips after nap time."],
      ["San Diego Mission Bay Resort", "Good pool-and-bay base for resort-style trips", "Room and suite categories vary; some rooms may not have elevator access, so request the exact setup you need", "Pool and bayfront resort amenities are the main family value", "On-site dining reduces dinner friction after beach or pool time", "Kitchen/laundry varies by room type; verify before relying on it", "Request crib/rollaway and elevator needs directly", "Official FAQ lists overnight self-parking at $47 per night", "Ask for room placement away from events, elevators, or late pool noise if naps are fragile", "Best fit when the hotel itself is part of the San Diego plan."],
      ["Homewood Suites San Diego Downtown/Bayside", "Practical suite option for no-car or short-ride trips", "All-suite setup with in-room kitchens is useful for breakfast, snacks, and longer stays", "Outdoor pool is useful but less resort-like than Mission Bay", "Hilton lists free hot breakfast, which can simplify mornings", "In-room kitchens are a major family convenience; laundry details should be verified", "Request crib/rollaway and connecting-room details before booking", "Hilton hotel-info page lists valet parking at $65 and no self-parking", "Urban/airport-adjacent location means room placement and noise sensitivity matter", "Best fit when walkable Little Italy meals and short rides to the zoo/harbor matter more than beach-resort atmosphere."]
    ],
    faqs: [
      ["What is the best area to stay in San Diego with kids?", "Mission Bay is the easiest default for many families, especially with toddlers, pools, and beach time."],
      ["Can families stay in San Diego without a car?", "Yes, but Downtown/Little Italy is usually the most practical base. Beach and zoo-heavy trips are easier with a car or rideshares."]
    ]
  },
  "where-to-stay/las-vegas-with-kids.html": {
    title: "Where to Stay in Las Vegas With Kids: Family Hotel Areas, Pools, Smoke and Strip Walking",
    description:
      "Compare where to stay in Las Vegas with kids by pool quality, Strip walking, smoke/noise risk, parking, resort fees, room setup, and family activity access.",
    city: "Las Vegas",
    quick: [
      ["Best overall area", "South Strip", "Often the best family balance of pools, value, and less central chaos."],
      ["Best for first-timers", "Center Strip", "Most convenient, but check smoke, walking routes, and room location."],
      ["Best without a car", "Center Strip", "Shortest access to major resort sights, rideshares, and monorail-ish options."],
      ["Best with toddlers", "A resort where the pool is the plan", "Room-to-pool logistics beat attraction lists."],
      ["Best for major attractions", "Center or South Strip", "Depends on show, pool, and museum choices."],
      ["Best budget-friendly", "Off-Strip or South Strip value hotels", "Only if transportation still works."],
      ["Best for nature/teens", "Summerlin / Red Rock side", "Better for Red Rock Canyon and calmer evenings."],
      ["Think twice about", "Downtown/Fremont with young kids", "Noise and adult atmosphere can overwhelm family trips."]
    ],
    rows: [
      ["South Strip", "Pools, value, airport ease", "Farther from some central sights", "Moderate", "Hotel-dependent", "Medium", "Often easier than center", "Medium-low", "Pools, Shark Reef, airport", "Large resorts", "Best family compromise"],
      ["Center Strip", "First-time Vegas sights", "Crowds, smoke, long resort walks", "Low car need", "Mixed", "High", "Expensive/valet common", "High", "Bellagio, High Roller, shows", "Big casino resorts", "Convenient but tiring"],
      ["Summerlin / Red Rock", "Nature, teens, calmer pace", "Not classic Strip", "Car required", "Good", "Low", "Usually easier", "Low", "Red Rock Canyon", "Resorts/suburban hotels", "Best older-kid reset"],
      ["Off-Strip family/value hotels", "Budget and parking", "More driving/rideshares", "Car helpful", "Varies", "Low-medium", "Often easier", "Low", "Depends on location", "Suite/select-service", "Good if logistics pencil out"],
      ["Downtown / Fremont", "Budget, neon, older kids briefly", "Noise/adult atmosphere", "Moderate", "Mixed", "High", "Varies", "Medium", "Fremont, museum access", "Casino hotels", "Think twice with young kids"]
    ],
    hotelNote: "Research checked against official property pages in July 2026. Las Vegas fees, pool access, smoke exposure, and room-assignment policies change often, so verify the booking screen and property FAQ before paying.",
    hotels: [
      ["Mandalay Bay", "Best pool-first Strip candidate for many families", "Large resort room and suite categories; request room distance/elevator needs if walking is a concern", "Mandalay Bay Beach is an 11-acre pool complex with sand, lazy river, lagoon, and wave-pool height rules", "Breakfast is not simple or usually included; plan quick-service options and budget accordingly", "Kitchen/laundry is not the point here unless booking a specialty suite; verify if needed", "Request crib/rollaway details and occupancy limits directly", "MGM parking and resort fees can materially change the real nightly cost", "Casino/resort walks, event crowds, and pool-facing rooms can add noise or overstimulation", "Best fit when pool time, Shark Reef, and South Strip logistics can carry much of the trip."],
      ["Vdara Hotel & Spa", "Best smoke-free, casino-free central option", "Base Studio Suite lists 582 sq ft with kitchenette and max occupancy of four", "Pool exists, but this is not a big kid-pool resort like Mandalay Bay", "Breakfast is a separate planning item; kitchenette helps with snacks/simple mornings", "Kitchenette is the main family convenience; laundry should be verified", "Special room requests are based on availability, so confirm needs directly", "FAQ notes valet and self-parking options through nearby MGM garages; check current rates", "Lower casino-floor exposure than many Strip hotels, but central location still means long walks", "Best fit when you want central access with less smoke/casino friction."],
      ["Hilton Grand Vacations Club Paradise Las Vegas", "Best suite/value option when a car or rideshare is acceptable", "Suite-style rooms with dining/kitchen imagery make it easier to handle snacks and downtime", "Outdoor pool, family pool, hot tub, and patio/grill areas support resort-reset time", "Breakfast setup varies by booking; plan groceries or simple in-room meals", "Kitchen-style setup is the main reason to consider it; verify washer/laundry access for your room type", "Request crib/rollaway details directly", "Hilton listing shows free parking, which can help the trip budget", "Off-Strip/near-convention-center location reduces casino intensity but adds transportation planning", "Best fit when space, parking, and lower overstimulation matter more than being in the center of the Strip."]
    ],
    faqs: [
      ["What is the best area to stay in Las Vegas with kids?", "South Strip is often the best compromise, especially if pool time and easier logistics matter more than being in the absolute center."],
      ["Should families stay on the Las Vegas Strip?", "They can, but the Strip involves more walking, crowds, smoke exposure risk, and resort-fee math than many families expect."]
    ]
  },
  "where-to-stay/new-york-city-with-kids.html": {
    title: "Where to Stay in New York City With Kids: Best Areas, Subway Tradeoffs and Family Hotel Checks",
    description:
      "Compare where to stay in New York City with kids by subway access, stroller friction, noise, room size, walkability, nearby parks, museums, and family trip style.",
    city: "New York City",
    quick: [
      ["Best overall area", "Upper West Side", "Best balance of Central Park, AMNH, calmer evenings, and family food options."],
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
    hotelNote: "Research checked against official hotel and destination pages in July 2026. NYC room sizes, destination fees, crib policies, elevators, and cancellation terms vary sharply by property, so verify the exact room type before booking.",
    hotels: [
      ["Upper West Side family-base hotels", "Best fit for museum-and-park trips", "Prioritize two-bed rooms, suites, or connecting-room policies; many NYC rooms are smaller than families expect", "Pools are uncommon; choose this area for park/museum access instead", "Breakfast varies by property and may be expensive", "Kitchen/laundry is uncommon unless booking an extended-stay or apartment-style property", "Request crib/rollaway details directly and confirm elevator access", "Do not plan to park; use transit/taxi/rideshare and verify destination fees", "Lower than Times Square, but avenue-facing rooms can still be noisy", "Best fit when Central Park, AMNH, CMOM, and calmer evenings matter most."],
      ["Midtown convenience hotels", "Best fit for shows, observation decks, and short first visits", "Room size and elevator waits are the big family checks", "Pools are uncommon and not the main reason to stay here", "Breakfast may add meaningful cost; plan nearby quick-service options", "Kitchen/laundry usually limited", "Confirm crib/rollaway, occupancy, and connecting-room rules before booking", "Parking is expensive; check resort/destination fees before comparing rates", "Times Square/cross-town noise and crowds are the main risk", "Best fit when being close to classic sights beats quiet and space."],
      ["Downtown/Brooklyn suite-style options", "Best fit for families who want more space or a calmer neighborhood", "Look for suite layouts, sofa beds, and a short walk to a useful subway line", "Pools vary and should not be assumed", "Breakfast and kitchenettes are more likely at select-service/suite brands", "Laundry may be easier than in Midtown, but verify by property", "Confirm crib/rollaway and room occupancy policies", "Parking still should not be the default plan", "Usually calmer than Midtown, but subway distance can become the tradeoff", "Best fit when space and evening decompression matter more than being next to every landmark."]
    ],
    faqs: [
      ["What is the best area to stay in NYC with kids?", "The Upper West Side is the safest default for many families because Central Park, AMNH, CMOM, neighborhood food, and calmer evenings are close together."],
      ["Should families stay in Times Square?", "Times Square can be convenient for shows and first-timers, but families with toddlers should think carefully about noise, crowds, room size, and stroller friction."]
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

function renderActivityComparison(rows) {
  const headers = ["Activity", "Best ages", "Time", "Cost", "Area", "Stroller", "Rain", "Nap", "Booking", "Why worth it", "Pair nearby"];
  return `        <div class="comparison-scroll">
          <table class="comparison-table">
            <thead><tr>${headers.map((header) => `<th>${esc(header)}</th>`).join("")}</tr></thead>
            <tbody>
${rows.map((row) => `              <tr>${row.map((cell) => `<td>${esc(cell)}</td>`).join("")}</tr>`).join("\n")}
            </tbody>
          </table>
        </div>`;
}

function renderDetails(details) {
  const labels = ["Why families like it", "Best ages", "What can go wrong", "Parent logistics", "Food/bathroom/reset", "Booking/timing", "Nearby pairing"];
  return `        <div class="detail-card-grid">
${details.map(([name, ...values]) => `          <article class="detail-card">
            <h3>${esc(name)}</h3>
            ${values.map((value, index) => `<section><h4>${esc(labels[index])}</h4><p>${esc(value)}</p></section>`).join("\n            ")}
          </article>`).join("\n")}
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

function renderActivityUpgrade(page) {
  return `${markerStart}
      <section class="band rank-ready-section">
        <div class="container">
          <div class="section-heading">
            <p class="eyebrow">Quick picks</p>
            <h2>Best choices by family situation</h2>
          </div>
${renderQuickPicks(page.quick)}
        </div>
      </section>

      <section class="container page-section rank-ready-section">
        <div class="section-heading">
          <p class="eyebrow">Compare activities</p>
          <h2>Activity decision table</h2>
        </div>
${renderActivityComparison(page.rows)}
      </section>

      <section class="band intro-band rank-ready-section">
        <div class="container">
          <div class="section-heading">
            <p class="eyebrow">Parent logistics</p>
            <h2>Detailed activity notes</h2>
          </div>
${renderDetails(page.details)}
        </div>
      </section>

      <section class="container page-section rank-ready-section">
        <div class="section-heading">
          <p class="eyebrow">Mini itineraries</p>
          <h2>Turn the list into a realistic family day</h2>
        </div>
${renderPlans(page.plans)}
      </section>
${markerEnd}
`;
}

function renderStayMatrix(rows) {
  const headers = ["Area", "Best for", "Main tradeoff", "Transit/driving", "Stroller", "Noise", "Parking", "Walkability", "Nearby attractions", "Hotel type", "Family verdict"];
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
  const labels = ["Best fit", "Room setup", "Pool", "Breakfast", "Kitchen/laundry", "Crib/rollaway", "Parking/fees", "Noise risk", "Why it fits families"];
  return `        <div class="detail-card-grid">
${hotels.map(([name, ...values]) => `          <article class="detail-card research-card">
            <h3>${esc(name)}</h3>
            ${values.map((value, index) => `<section><h4>${esc(labels[index])}</h4><p>${esc(value)}</p></section>`).join("\n            ")}
          </article>`).join("\n")}
        </div>`;
}

function renderStayUpgrade(page) {
  return `${markerStart}
      <section class="band rank-ready-section">
        <div class="container">
          <div class="section-heading">
            <p class="eyebrow">Quick decision</p>
            <h2>Best areas by family need</h2>
          </div>
${renderQuickPicks(page.quick)}
        </div>
      </section>

      <section class="container page-section rank-ready-section">
        <div class="section-heading">
          <p class="eyebrow">Area matrix</p>
          <h2>Compare the stay tradeoffs before booking</h2>
        </div>
${renderStayMatrix(page.rows)}
      </section>

      <section class="band intro-band rank-ready-section">
        <div class="container">
          <div class="section-heading">
            <p class="eyebrow">Hotel shortlist</p>
            <h2>Research-based family hotel shortlist</h2>
          </div>
          <p class="review-label">${esc(page.hotelNote || "Research-based shortlist. Verify fees, room type, policies, and amenities before booking.")}</p>
${renderHotels(page.hotels)}
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
      name: `${page.city} family travel planning options`,
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
    return html.replace(/\s*<section class="container page-section source-section">/, `\n${section}      <section class="container page-section source-section">`);
  }
  return html.replace(/\s*<\/main>/, `\n${section}    </main>`);
}

function insertSchema(html, schema) {
  if (!schema) return html;
  return html.replace(/\s*<\/body>/, `\n${schema}  </body>`);
}

function upgradeFile(outDir, path, page, type) {
  const full = join(outDir, path);
  let html = readFileSync(full, "utf8");
  html = stripMarked(html, markerStart, markerEnd);
  html = stripMarked(html, schemaStart, schemaEnd);
  html = updateHead(html, page);
  const section = type === "activity" ? renderActivityUpgrade(page) : renderStayUpgrade(page);
  const schema = type === "activity" ? `${itemListSchema(page)}${faqSchema(page)}` : `${itemListSchema(page)}${faqSchema(page)}`;
  html = insertBeforeMainEnd(html, section);
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
}
