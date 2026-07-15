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
      ["What is the best rainy-day activity in Chicago with kids?", "Shedd Aquarium and Field Museum are the most reliable rainy-day anchors for most families."]
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
    clusterLinks: [
      ["Where to stay in Las Vegas", "Choose the hotel base before finalizing activities. Pool setup, smoke exposure, resort walking, fees, and room location can change the whole family plan.", "../where-to-stay/las-vegas-with-kids.html", "Open where to stay in Las Vegas with kids"],
      ["Las Vegas family itinerary", "Turn pool time, one classic visual stop, and age-specific anchors into a realistic route instead of a Strip marathon.", "../family-itinerary/las-vegas-with-kids.html", "Open the Las Vegas family itinerary"],
      ["Las Vegas with teens", "Use the teen guide when Red Rock, immersive exhibits, shows, food, and later evenings matter more than toddler pacing.", "../things-to-do/las-vegas-with-teens.html", "Open Las Vegas with teens"],
      ["How claims are handled", "Review the methodology page for source policy, human-review boundaries, and model-derived planning notes.", "../about.html", "Read the methodology"]
    ],
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
      "Compare where to stay in San Diego with kids by family-friendly hotel checks, beach access, zoo drives, stroller ease, parking, pool value, room setup, noise, and area tradeoffs.",
    city: "San Diego",
    stayTool: true,
    areaNote: "These are model-derived research starting points, not reviewed area recommendations. Use the checklist above to test exact properties, routes, dates, fees, and family constraints before keeping an area on the shortlist.",
    quick: [
      ["Start with the trip constraint", "Area fit before hotel name", "Decide whether beach access, route simplicity, room setup, reset time, or full-stay cost is the hardest constraint."],
      ["Beach-access hypothesis", "Mission Bay or Coronado", "Compare the exact property-to-usable-beach route; area names alone do not establish easy access."],
      ["Car-light hypothesis", "Downtown / Little Italy", "Test exact stops, frequency, transfers, sidewalks, elevators, and stroller rules before relying on a no-car plan."],
      ["Central-base hypothesis", "Mission Valley", "The city describes the community as trolley-connected, but usefulness varies by property and itinerary."],
      ["Coastal-wandering hypothesis", "La Jolla", "Verify slopes, crossings, parking, and the exact route from a candidate property."],
      ["Toddler/reset question", "Can the base support a real midday return?", "Test the activity-to-room route against the family's nap window instead of inferring it from the area."],
      ["Value question", "What is the full bookable total?", "Compare the same dates and room setup with taxes, parking, fees, meals, and transport included."],
      ["Noise question", "Which room and what dates?", "Area-level descriptions do not establish property or room quietness."],
      ["Decision rule", "Keep two candidates until verification", "Do not let a model score or a single amenity decide the stay."]
    ],
    rows: [
      ["Mission Bay", "Beach-and-reset candidate", "Property access and route time vary", "Test exact routes", "Route-specific", "Property-specific", "Verify every fee", "Unknown by property", "Mission Bay facilities; verify itinerary", "Resorts and family hotels", "Research hypothesis"],
      ["La Jolla", "Coastal candidate", "Slopes, crossings, and parking vary", "Test exact routes", "Route-specific", "Property-specific", "Verify every fee", "Unknown by property", "La Jolla Shores and nearby stops", "Boutique/luxury/coastal", "Research hypothesis"],
      ["Downtown / Little Italy", "Urban, car-light candidate", "Noise, room size, and transfers vary", "Test stops and transfers", "Route-specific", "Property-specific", "Verify every fee", "Unknown by property", "Waterfront and regional transit context", "Urban hotels", "Research hypothesis"],
      ["Coronado", "Beach-first candidate", "Off-island routes and pricing vary", "Test ferry/bus/drive plan", "Route-specific", "Property-specific", "Verify every fee", "Unknown by property", "Public beach and waterfront context", "Beach resorts/inns", "Research hypothesis"],
      ["Mission Valley / Hotel Circle", "Central-base candidate", "Property-level access varies", "Trolley or driving by property", "Route-specific", "Property-specific", "Verify every fee", "Unknown by property", "Central location; test actual itinerary", "Chain hotels/suites", "Score requires review"]
    ],
    hotelDecision: [
      ["Map the trip shape", "For each candidate property, map the family's beach, pool, zoo, harbor, restaurant, and reset plans to exact routes. Do not infer property or area fit from the area name."],
      ["Separate family-friendly from family-verified", "A property can look family-friendly because it has a pool, suite, or beach access, but Family Tripwise has not personally verified sleep quality, service, noise, or current policies."],
      ["Prioritize sleep setup", "Before comparing star ratings, confirm exact bed count, sofa-bed wording, crib/rollaway policy, occupancy limits, connecting-room rules, elevator access, and whether the room location can support naps."],
      ["Price the full stay", "Compare nightly rate plus resort fee, parking, breakfast, extra-bed charges, taxes, and whether a rental car or repeated rideshares are needed from that area."],
      ["Use official property sources", "Check the hotel website, FAQ, room page, fee page, amenity page, and booking screen. Third-party snippets can lag behind current property policy."],
      ["Ask before booking", "If pool access, crib availability, rollaway rules, room placement, kitchen/laundry, or parking will make or break the trip, contact the property before paying."]
    ],
    hotelNote: "Research checked against official property pages in July 2026. These are hotel fit checks, not personally verified rankings or firm recommendations. Verify fees, exact room type, crib/rollaway policy, pool hours, kitchen/laundry details, noise exposure, parking, and cancellation terms before booking.",
    hotels: [
      ["Bahia Resort Hotel", "Official-room-page candidate for larger-room verification", "The Bay Family Suite page lists 675 sq ft, multiple beds, a sofa bed, kitchenette-style amenities, a balcony, and two bathrooms; verify the exact bookable room", "Official pages list pool and bay/beach amenities; verify current access, hours, closures, and inclusions", "Official pages list on-property dining, including grab-and-go and seasonal options; verify current hours", "The family-suite page lists a refrigerator, microwave, toaster, and coffeemaker; verify equipment and laundry access", "Request current crib/rollaway, occupancy, and room-access details directly before booking", "The official FAQ says one vehicle per guest room parks without a separate parking charge; verify the current resort fee and booking total", "Room-level noise is UNKNOWN; ask about traffic, events, elevators, pool decks, construction, and the exact room location", "Human-review question: does the exact room, total price, beach route, activity route, and midday-return time work for this family's dates?"],
      ["San Diego Mission Bay Resort", "Bayfront-property candidate for exact-room and fee verification", "Room and suite categories vary; some rooms may not have elevator access, so request the exact setup and route", "Official pages list pool and bayfront amenities; verify current access, hours, closures, and inclusions", "Official pages list on-site dining; verify current hours, menus, and whether they fit the family's meal plan", "Kitchen and laundry details vary by room type; verify the exact bookable room and guest access", "Request current crib/rollaway, occupancy, and elevator details directly", "The official FAQ lists overnight self-parking at $47 per night; verify the current booking total and all fees", "Room-level noise is UNKNOWN; ask about events, elevators, pool decks, traffic, construction, and the exact room location", "Human-review question: does the exact room, total price, beach route, activity route, and reset plan work for this family's dates?"],
      ["Homewood Suites San Diego Downtown/Bayside", "Suite-property candidate for exact-room and route verification", "The official hotel page lists an all-suite setup and in-room kitchens; verify the exact bookable room, occupancy, and sleeping layout", "The official hotel page lists an outdoor pool; verify current access, hours, closures, and rules", "The official hotel page lists free hot breakfast; verify the current booking inclusion, hours, and fit for the family's schedule", "The official page lists in-room kitchens; verify exact equipment and guest-laundry access", "Request current crib/rollaway, occupancy, and connecting-room details before booking", "The official hotel page lists valet parking at $65 and no self-parking; verify the current booking total and all fees", "Room-level noise is UNKNOWN; ask about airport paths, traffic, events, elevators, construction, and the exact room location", "Human-review question: do the exact room, total price, meal plan, walking/transit routes, and midday-return time work for this family's dates?"]
    ],
    bookingChecks: [
      ["Room setup source", "Use the official room-detail page and booking screen to confirm square footage, bed configuration, sofa bed, kitchenette wording, balcony/patio access, bathroom count, occupancy, and whether the room is reachable by elevator."],
      ["Pool and beach source", "Use the official amenity page to verify pool hours, seasonal closures, depth/height rules, towel policy, beach gear, cabana costs, and whether the pool is close enough to work as a midday reset."],
      ["Breakfast and food source", "Check the official dining page or booking inclusions for breakfast, grab-and-go options, mini-fridge/microwave access, and nearby casual meals before relying on an easy morning."],
      ["Kitchen, laundry, and baby gear source", "Confirm refrigerator, microwave, kitchenette, washer/dryer or laundry access, crib, rollaway, high chair, and connecting-room availability directly with the property when those details matter."],
      ["Parking and fees source", "Verify resort/destination fees, self-parking, valet, in/out privileges, EV charging, oversized vehicle limits, and whether area attractions still require separate parking."],
      ["Noise and location source", "Ask about room placement away from elevators, event spaces, pool decks, traffic, nightlife, and airport or harbor noise if naps or early bedtime matter."]
    ],
    clusterLinks: [
      ["Things to do in San Diego", "Use the activity guide to decide whether your hotel should optimize for the zoo, Mission Bay, La Jolla, Coronado, or Balboa Park.", "../things-to-do/san-diego-with-kids.html", "Open San Diego things to do with kids"],
      ["San Diego family itinerary", "Match the stay base to a realistic 1-day, 2-day, 3-day, toddler, teen, or rainy-day route before booking.", "../family-itinerary/san-diego-with-kids.html", "Open the San Diego family itinerary"],
      ["Toddler-specific planning", "If naps, stroller exits, and short sessions drive the trip, cross-check Mission Bay, zoo bus tour, Birch Aquarium, and hotel reset options.", "../things-to-do/san-diego-with-toddlers.html", "Open San Diego with toddlers"],
      ["Teen-specific planning", "If older kids need coast, food, and less little-kid pacing, use the teen guide before committing to a beach or urban base.", "../things-to-do/san-diego-with-teens.html", "Open San Diego with teens"],
      ["How claims are handled", "Review the methodology page for source policy, human-review boundaries, and how model-derived planning notes differ from verified claims.", "../about.html", "Read the methodology"]
    ],
    faqs: [
      ["What is the best area to stay in San Diego with kids?", "There is no reviewed default for every family. Compare Mission Bay, Coronado, La Jolla, Downtown/Little Italy, and Mission Valley against exact beach access, activity routes, transport, room setup, reset needs, and full-stay cost."],
      ["What is the best family hotel in San Diego?", "There is no single best family hotel without knowing your room setup, pool needs, car plan, budget, nap sensitivity, and itinerary. Use the hotel fit checks on this page, then verify exact property details before booking."],
      ["Can families stay in San Diego without a car?", "A car-light stay may work, but do not decide from the area name alone. Test the exact property-to-meal and property-to-activity routes, current MTS service, transfers, sidewalks, elevators, and stroller constraints for the travel dates."]
    ]
  },
  "where-to-stay/las-vegas-with-kids.html": {
    title: "Where to Stay in Las Vegas With Kids: Booking Checks for Families",
    description:
      "Compare Las Vegas stay candidates using exact checks for total fees, room assignment, pool access, smoke and noise exposure, route friction, and family logistics.",
    city: "Las Vegas",
    constraintLed: true,
    baseReplacements: [
      ["<p>Compare the best family areas in Las Vegas by stroller ease, room size risk, parking, walkability, noise, pool access, and attraction proximity.</p>", "<p>Compare Las Vegas stay candidates using exact property, room, fee, pool, smoke/noise, route, and reset checks. Area labels are research starting points, not reviewed family recommendations.</p>"],
      ["<p><strong>Last updated:</strong> July 5, 2026</p>", "<p><strong>Last updated:</strong> July 15, 2026</p>"],
      ["<h2>Start with the area, then shortlist hotels</h2>", "<h2>Start with constraints, then verify exact properties</h2>"],
      ["<p>Start with the area fit, then use the hotel checks below to compare room setup, parking, pool value, meal friction, and kid reset options before booking.</p>", "<p>Use area names only to build a research shortlist. Before booking, verify the exact property, room assignment, total fees, pool access, smoke/noise exposure, and routes that matter for your dates.</p>"],
      ["<p class=\"eyebrow\">Area recommender</p>\n          <h2>Best areas for families</h2>", "<p class=\"eyebrow\">Area research</p>\n          <h2>Stay candidates to investigate</h2>"],
      ["<span role=\"columnheader\">Best for</span>\n            <span role=\"columnheader\">Watch out for</span>\n            <span role=\"columnheader\">Family fit</span>", "<span role=\"columnheader\">Research angle</span>\n            <span role=\"columnheader\">What to verify</span>\n            <span role=\"columnheader\">Evidence state</span>"],
      ["<span role=\"cell\">First-timers, shows, short access to major sights</span>\n              <span role=\"cell\">Crowds, smoke, long casino walks</span>\n              <span role=\"cell\">Good</span>", "<span role=\"cell\">Classic-resort access hypothesis</span>\n              <span role=\"cell\">Exact walking route, room location, and smoke/noise exposure</span>\n              <span role=\"cell\">Needs property and route verification</span>"],
      ["<span role=\"cell\">Mandalay Bay pool, value, airport access</span>\n              <span role=\"cell\">Farther from some attractions</span>\n              <span role=\"cell\">Great</span>", "<span role=\"cell\">Pool-reset and South Strip hypothesis</span>\n              <span role=\"cell\">Exact pool access, total fees, room assignment, and attraction routes</span>\n              <span role=\"cell\">Needs property and route verification</span>"],
      ["<span role=\"cell\">Nature, calmer hotels, older kids</span>\n              <span role=\"cell\">Not a classic Strip stay</span>\n              <span role=\"cell\">Good</span>", "<span role=\"cell\">Nature-route and drive-plan hypothesis</span>\n              <span role=\"cell\">Exact drive times, parking, room conditions, and activity routes</span>\n              <span role=\"cell\">Needs date and route verification</span>"],
      ["<span role=\"cell\">Budget and neon spectacle</span>\n              <span role=\"cell\">Noise and adult atmosphere</span>\n              <span role=\"cell\">Limited</span>", "<span role=\"cell\">Budget and neon-access hypothesis</span>\n              <span role=\"cell\">Exact room noise, smoke/adult exposure, walking, and rideshare routes</span>\n              <span role=\"cell\">Needs property and route verification</span>"],
      ["<article class=\"activity-card\"><h3>Family hotel shortlist</h3><p>Prioritize hotels that clearly publish room layout, crib or rollaway policy, parking cost, pool hours, breakfast setup, and cancellation terms.</p></article>", "<article class=\"activity-card\"><h3>Property verification shortlist</h3><p>Keep only properties whose official room details and booking screen answer the family's make-or-break questions; a listing here is not a recommendation.</p></article>"],
      ["<article class=\"activity-card\"><h3>Stroller and transit notes</h3><p>Before committing to a no-car stay, check sidewalks, elevators, transit station access, hill difficulty, ride-share pickup points, and car-seat logistics for your exact area.</p></article>", "<article class=\"activity-card\"><h3>Route and mobility checks</h3><p>Test the exact property-to-meal and property-to-activity routes, elevators, walking exposure, rideshare pickup points, stroller constraints, and car-seat logistics.</p></article>"],
      ["<article class=\"activity-card\"><h3>Booking filters</h3><p>Prioritize family rooms or suites, breakfast, pool hours, laundry, parking cost, elevators, and walking distance to meals or transit.</p></article>", "<article class=\"activity-card\"><h3>Booking-screen checks</h3><p>Verify the exact room assignment, occupancy, total mandatory fees, pool access, cancellation terms, parking, and any amenity that would make or break the trip.</p></article>"]
    ],
    quick: [
      ["Pool-reset hypothesis", "South Strip candidate", "Verify exact pool access, seasonal rules, room-to-pool route, and the full booking total."],
      ["Classic-sights hypothesis", "Center Strip candidate", "Map the exact resort exits, walking route, room location, and smoke/noise exposure."],
      ["Car-light hypothesis", "Exact Center or South Strip property", "Test current property-to-activity routes and rideshare or transit steps; the area name is not enough."],
      ["Toddler-reset hypothesis", "Property with the shortest verified reset route", "Confirm room assignment, elevator path, pool access, meals, and the actual midday return."],
      ["Attraction-route hypothesis", "Candidate near the chosen trip anchors", "Measure exact routes for the booked dates instead of assuming every Strip property is close."],
      ["Full-cost hypothesis", "Off-Strip or South Strip candidate", "Compare mandatory fees, parking, rideshares, meals, and route time before calling it lower cost."],
      ["Nature-route hypothesis", "Summerlin / Red Rock candidate", "Verify exact drive time, parking, heat plan, and the room setup for the dates."],
      ["Extra verification", "Downtown / Fremont candidate", "Treat room noise, smoke/adult exposure, and family fit as UNKNOWN until the exact property and routes are reviewed."]
    ],
    rows: [
      ["South Strip", "Pool-reset and resort hypothesis", "Exact property, room, pool, fee, and route details", "Verify each trip route", "UNKNOWN until exact route", "UNKNOWN for exact room", "Verify total mandatory fees", "Measure exact exits and paths", "Pool and Shark Reef context", "Large-resort candidates", "Research starting point; human review required"],
      ["Center Strip", "Classic-resort-access hypothesis", "Exact exits, walking exposure, smoke/noise, and room location", "Verify every route", "UNKNOWN until exact route", "UNKNOWN for exact room and path", "Verify parking and resort fees", "Measure indoor and outdoor paths", "Bellagio, High Roller, show context", "Large casino-resort candidates", "Research starting point; human review required"],
      ["Summerlin / Red Rock", "Nature-route and drive-plan hypothesis", "Exact drive time, parking, heat, and room details", "Verify dated drive plan", "UNKNOWN until exact route", "UNKNOWN for exact room", "Verify parking and mandatory fees", "Property-specific", "Red Rock Canyon context", "Resort and suburban candidates", "Research starting point; human review required"],
      ["Off-Strip candidates", "Space, parking, or total-cost hypothesis", "Full-stay cost plus rideshare, drive, and meal friction", "Verify every route", "UNKNOWN until exact route", "UNKNOWN for exact room", "Compare full booking totals", "Property-specific", "Depends on exact location", "Suite and select-service candidates", "Research starting point; human review required"],
      ["Downtown / Fremont", "Budget and neon-access hypothesis", "Exact room noise, smoke/adult exposure, walking, and rideshare routes", "Verify every route", "UNKNOWN until exact route", "UNKNOWN for exact room and path", "Verify parking and mandatory fees", "Measure exact paths", "Fremont and museum context", "Casino-hotel candidates", "Extra verification and human review required"]
    ],
    areaNote: "These are model-derived research starting points, not reviewed area recommendations. Keep smoke/noise, stroller access, route friction, pool usability, and family suitability as UNKNOWN until the exact property, room, route, date, and relevant human review are available.",
    hotelNote: "Research checked against official property pages in July 2026. These are property verification candidates, not personally verified rankings or recommendations. Verify the exact room, assignment, mandatory fees, pool access, smoke/noise exposure, route, and current policy before paying.",
    hotels: [
      ["Mandalay Bay", "Property candidate for pool-access and total-fee verification", "Verify the exact bookable room, beds, occupancy, room assignment, elevator distance, and walking requirements", "The official Beach page describes the pool complex; verify date-specific access, hours, closures, height rules, and whether access is included", "Use the booking inclusion and official dining pages to verify breakfast cost, hours, and a workable morning plan", "Verify the exact room's refrigerator, microwave, kitchen, and guest-laundry access if any item matters", "Confirm crib/rollaway availability, cost, occupancy limits, and whether the request is guaranteed", "Compare the final booking total including resort fees, taxes, parking, and any pool or cabana costs", "UNKNOWN for the exact room and routes; ask about elevators, event spaces, pool decks, traffic, construction, and casino exposure", "Human-review question: do the exact room, total price, pool rules, activity routes, and reset plan work for this family's dates?"],
      ["Vdara Hotel & Spa", "Property candidate for exact room, route, and smoke-exposure verification", "The official room page lists Studio Suite details; verify the exact bookable category, occupancy, beds, kitchenette equipment, assignment, and requests", "Verify date-specific pool access, hours, closures, rules, and whether the booked room includes access", "Use the booking inclusion and official dining pages to verify breakfast cost, hours, and a workable morning plan", "Verify the exact kitchenette equipment and guest-laundry access before relying on either", "Confirm crib/rollaway availability, cost, occupancy limits, and whether the request is guaranteed", "Compare the final booking total including destination or resort fees, taxes, valet or garage parking, and transport", "UNKNOWN for the exact room and walking paths; verify room placement plus every indoor/outdoor route where smoke exposure matters", "Human-review question: do the exact room, total price, smoke-exposure routes, activity routes, and reset plan work for this family's dates?"],
      ["Hilton Grand Vacations Club Paradise Las Vegas", "Property candidate for exact suite, parking, and route verification", "Verify the exact bookable room, sleeping layout, occupancy, kitchen equipment, room assignment, elevators, and connecting-room policy", "Verify date-specific pool access, hours, closures, rules, and whether the pool works for the planned reset window", "Verify the booking's breakfast inclusion or build a current grocery and in-room meal plan", "Verify exact kitchen equipment plus washer/dryer or guest-laundry access for the booked room", "Confirm crib/rollaway availability, cost, occupancy limits, and whether the request is guaranteed", "Verify the final booking total, current parking terms, taxes, deposits, and every mandatory fee", "UNKNOWN for the exact room and routes; ask about elevators, traffic, events, construction, and the property-to-activity path", "Human-review question: do the exact room, total price, transport plan, activity routes, and reset plan work for this family's dates?"]
    ],
    bookingChecks: [
      ["Total-fee check", "Capture the final booking-screen total for the exact room and dates, including resort or destination fees, taxes, parking, deposits, and any required amenity charges; do not compare headline nightly rates alone."],
      ["Room-assignment check", "Confirm the exact room category, beds, occupancy, connecting-room policy, elevator and resort-walk distance, and which requests are guaranteed versus merely noted."],
      ["Pool-access check", "Verify date-specific pool access, seasonal closures, hours, depth or height rules, guest eligibility, reservation requirements, and any extra charges for the booked room."],
      ["Smoke/noise-exposure check", "Treat exposure as UNKNOWN until the property answers questions about the exact room, ventilation, casino or smoking-area paths, elevators, event spaces, pool decks, traffic, nightlife, and construction."],
      ["Route-friction check", "Map the exact property exit to each priority activity and meal for the travel dates, including indoor resort walking, outdoor heat exposure, crossings, elevators, rideshare pickup, stroller constraints, and the midday return."],
      ["Current-policy check", "Recheck the official property page, FAQ, and booking terms near payment and again before travel; record the source and checked date for any make-or-break detail."]
    ],
    faqs: [
      ["What is the best area to stay in Las Vegas with kids?", "There is no reviewed default for every family. Compare exact properties and rooms against total fees, pool access, smoke/noise exposure, activity routes, reset needs, mobility constraints, and the travel dates."],
      ["Should families stay on the Las Vegas Strip?", "Treat the Strip as a set of property-and-route hypotheses, not one uniform choice. Verify exact walking paths, indoor and outdoor smoke exposure, room location, fees, pool rules, and rideshare or transit steps before booking."]
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
      ["Best 1-day plan", "Zoo early, Balboa Park reset, Mission Bay or pool", "Highest San Diego payoff with only one cross-town move after lunch."],
      ["Best 2-day plan", "Zoo/Balboa plus Mission Bay/La Jolla", "Gives one major attraction day and one coast day without overpacking."],
      ["Best 3-day plan", "Arrival reset, zoo day, coast choice", "The most reliable family rhythm if naps, weather, or beach time matter."],
      ["Best toddler pace", "Mission Bay, zoo bus tour, Birch Aquarium", "Shorter sessions, easier exits, and fewer stair-heavy coastal stops."],
      ["Best teen pace", "Zoo highlights, La Jolla, Coronado or food stop", "More scenery and independence, fewer playground-heavy filler stops."],
      ["Best rainy-day swap", "Birch Aquarium or one Balboa Park museum", "Keeps the day useful without rebuilding every meal and drive."],
      ["Best stay pairing", "Mission Bay for younger kids; Downtown for no-car-lite trips", "Treat this as planning guidance and verify exact hotel logistics."],
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
      "Arrival afternoon": "Keep arrival deliberately soft: groceries or snacks, hotel/pool time, and an early dinner near your base. Save the zoo and La Jolla for a rested morning.",
      "Zoo day": "Arrive near opening, use the bus tour early, choose two or three zones, then leave space for a post-lunch reset. Add only one Balboa Park garden, playground, or museum if energy is still good.",
      "Coast day": "Choose Mission Bay for younger kids, La Jolla for older walkers and teens, or Coronado when you want a calmer beach-and-ferry feel. Avoid trying to do all three in one day.",
      "Rain backup": "Use Birch Aquarium or one Balboa Park museum as the anchor, then keep food and parking close. Treat the beach as a bonus if the weather clears.",
      "Toddler adjustment": "Shorten every activity block, keep snacks visible, and make the hotel reset non-negotiable. If the first morning goes long, delete the afternoon stop.",
      "Teen adjustment": "Trade one playground or short museum stop for La Jolla scenery, a food stop, kayaking-style activity if appropriate, or Coronado waterfront time."
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
    title: "Things to Do in Las Vegas With Teens: Pools, Red Rock, Shows and Heat Plans",
    description:
      "Plan Las Vegas with teens using activity quick picks, heat and Strip walking caveats, rainy-day swaps, hotel-pool resets, and realistic itinerary ideas.",
    city: "Las Vegas",
    links: {
      allAges: "../things-to-do/las-vegas-with-kids.html",
      stay: "../where-to-stay/las-vegas-with-kids.html",
      itinerary: "../family-itinerary/las-vegas-with-kids.html"
    },
    quick: [
      ["Best overall", "Pool plus one teen-specific anchor", "Vegas works better when the hotel reset is part of the plan."],
      ["Best outdoor break", "Red Rock Canyon", "Strongest contrast to casino/resort corridors if heat and transport work."],
      ["Best rainy/heat backup", "Area15-style immersive stop or High Roller", "Choose by age, sensory tolerance, and budget."],
      ["Best low-cost classic", "Bellagio Conservatory and fountains", "A short visual stop, not the whole teen plan."],
      ["Best evening idea", "Age-appropriate show or skyline activity", "Check ratings, timing, ticket rules, and late-night atmosphere."],
      ["Best planning base", "South or Center Strip by exact hotel fit", "Pool, room location, smoke exposure, and walking routes matter."],
      ["Think twice about", "Aimless Strip walking", "Distances, heat, casino detours, and crowds are harder than maps imply."],
      ["Main planning risk", "Heat, sensory overload, and fees", "Keep costs, resort fees, pool rules, and downtime visible before booking."]
    ],
    rows: [
      ["Red Rock Canyon", "10-17", "Half day", "$$", "West of Strip", "Hard", "No", "Low", "Timed entry may apply", "Best nature reset for teens", "Low-key hotel evening"],
      ["Area15 / immersive exhibits", "12-17", "2-3 hrs", "$$$", "Off Strip", "Mixed", "Yes", "Low", "Book specific exhibits", "Teen-friendly indoor option if sensory fit is right", "Food hall or pool reset"],
      ["High Roller", "10-17", "45-60 min", "$$", "LINQ", "Good", "Yes", "Medium", "Book/check pricing", "Contained skyline payoff", "LINQ Promenade meal"],
      ["Bellagio Conservatory and fountains", "10-17", "60-90 min", "$", "Center Strip", "Moderate", "Partial", "Medium", "No", "Classic short Vegas visual", "Nearby early dinner"],
      ["Hotel pool block", "10-17", "Half day", "$$", "Hotel", "Good", "No", "High", "Check rules", "Realistic downtime and heat management", "One short evening activity"],
      ["Age-appropriate show", "12-17", "Evening", "$$$", "Strip or off-Strip", "Mixed", "Yes", "Low", "Book ahead", "Best teen evening if rating/timing fits", "Early dinner and rideshare plan"]
    ],
    details: [
      ["Red Rock Canyon", "Teens often need a real break from casino/resort environments, and Red Rock gives a different trip texture.", "Best for older kids and teens comfortable with heat-aware walking.", "Heat, timed entry, drive logistics, trail difficulty, and younger siblings.", "Make it the main half-day plan and keep the evening easy.", "Bring water/snacks and plan bathrooms before leaving the Strip.", "Check weather, timed entry, road status, and trail fit before committing.", "Pair with pool time or a quiet hotel evening."],
      ["Area15 / immersive exhibits", "It can give teens a high-payoff indoor activity when outdoor plans are too hot or smoky.", "Best for teens who like immersive, visual, or interactive environments.", "Sensory overload, cost, exhibit age fit, and trying to do too many paid pieces.", "Choose one or two exact exhibits before arriving.", "Use onsite food as a reset if it fits your family.", "Book/check exhibit details, age guidance, and current hours.", "Pair with pool downtime rather than another loud evening."],
      ["High Roller", "It is contained, scenic, and easier to plan than wandering multiple resorts.", "Best for teens who want a skyline moment without a long show.", "Cost, lines, and timing around meals.", "Use it when everyone is fed and ready for a slower ride.", "Plan bathrooms and snacks before boarding.", "Check ticket options and current pricing.", "Pair with LINQ Promenade food or a short fountain stop."],
      ["Bellagio Conservatory and fountains", "It gives classic Vegas visual payoff with low time commitment.", "Best for all teen trips as a short stop.", "Long resort walks, crowds, smoke exposure risk in nearby corridors, and overbuilding the stop.", "Treat it as a 60-90 minute loop with food nearby.", "Use nearby hotel food/restrooms, but expect walking.", "No ticket for the visual stop; verify fountain schedule if it matters.", "Pair with early dinner, High Roller, or a ride back to the hotel."],
      ["Hotel pool block", "The pool can be the reason the trip feels like a vacation instead of a logistics puzzle.", "Best for all teen ages if the pool rules fit.", "Seasonal closures, shade, crowding, fees, and height or tube rules.", "Protect pool time as the reset, especially in heat.", "Use the room as the snack and decompression base.", "Check pool hours, rules, closures, and resort fees before booking.", "Pair with one evening anchor, not multiple Strip crossings."],
      ["Age-appropriate show", "A show can be the cleanest teen evening if ratings, timing, and budget work.", "Best for teens who can handle late timing and venue rules.", "Age ratings, ticket cost, late meals, and transportation after the show.", "Book an earlier show when possible and make dinner simple.", "Plan food before the venue and rideshare pickup after.", "Verify age restrictions, content, runtime, and ticket policies.", "Pair with a quiet morning or pool-heavy next day."]
    ],
    plans: {
      "1-day teen plan": "Pool morning, short Bellagio/fountain loop, early dinner, then High Roller or an age-appropriate show.",
      "2-day teen plan": "Day 1: pool and classic Strip visuals. Day 2: Red Rock Canyon or an immersive indoor stop, then a low-pressure evening.",
      "Heat plan": "Move outdoor or Strip walking to early/late windows, keep midday for pool or indoor activity, and avoid long resort-to-resort walks.",
      "Rainy-day plan": "Use Area15-style exhibits, High Roller, or a show as the anchor, then keep food and rideshares simple.",
      "Mixed-age plan": "Let teens choose one show, nature, or immersive activity while younger siblings get pool or museum time."
    },
    faqs: [
      ["Is Las Vegas good with teens?", "It can be, if the hotel, pool, heat, walking routes, show choices, and evening environment are planned carefully."],
      ["What should families avoid with teens in Las Vegas?", "Avoid assuming the Strip is an easy walk, especially in heat, with crowds, casino detours, or tired younger siblings."]
    ]
  },
  "things-to-do/san-diego-with-teens.html": {
    title: "Things to Do in San Diego With Teens: Coast, Zoo, Food and Rainy-Day Plans",
    description:
      "Plan San Diego with teens using coast and zoo quick picks, stroller-free route caveats, rainy-day swaps, food/reset notes, and realistic teen-friendly itineraries.",
    city: "San Diego",
    links: {
      allAges: "../things-to-do/san-diego-with-kids.html",
      stay: "../where-to-stay/san-diego-with-kids.html",
      itinerary: "../family-itinerary/san-diego-with-kids.html"
    },
    quick: [
      ["Best overall", "La Jolla coast plus food/reset plan", "Strong teen payoff if parking, walking, and weather cooperate."],
      ["Best major attraction", "San Diego Zoo highlights", "Works when teens choose zones instead of chasing every exhibit."],
      ["Best rainy-day swap", "Birch Aquarium or Balboa Park museum", "Useful backup without rebuilding the entire day."],
      ["Best low-pressure day", "Coronado ferry and waterfront", "Scenic, flexible, and easier than a packed cross-city route."],
      ["Best younger-sibling compromise", "Zoo bus tour or Birch Aquarium", "Still teen-acceptable if the day includes food or coast time."],
      ["Best base check", "La Jolla, Mission Bay, Downtown, or Coronado by route", "The right base depends on whether coast, zoo, or beach time leads."],
      ["Think twice about", "La Jolla Cove with stroller-heavy family logistics", "Teens may love it, but mixed-age gear and parking can derail the plan."],
      ["Main planning risk", "Parking and cross-town stacking", "Do not turn a teen coast day into a parking-and-driving day."]
    ],
    rows: [
      ["La Jolla Cove / coast", "12-17", "2-4 hrs", "$", "La Jolla", "Hard", "No", "Low", "No", "Best scenery and teen independence", "Birch Aquarium or casual lunch"],
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
      "1-day teen plan": "Zoo highlights early, lunch/rest, then Mission Bay or a short coast stop depending on where you are staying.",
      "2-day teen plan": "Day 1: zoo and Balboa Park. Day 2: La Jolla coast or Coronado ferry with food and beach time.",
      "Rainy-day plan": "Use Birch Aquarium or one Balboa Park museum as the anchor, keep meals close, and save coast time for the clearest weather window.",
      "Coast-first plan": "Start La Jolla early, add Birch Aquarium or lunch, then avoid another parking-heavy cross-town stop.",
      "Mixed-age plan": "Give teens the coast or food choice while younger siblings get Mission Bay, aquarium, or zoo bus-tour pacing."
    },
    faqs: [
      ["What is the best thing to do in San Diego with teens?", "La Jolla coast is often the strongest teen-specific stop, while the San Diego Zoo remains the best all-age anchor if the family chooses zones carefully."],
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

function renderClusterCards(cards) {
  return `        <div class="card-grid">
${cards.map(([title, body, href, linkText]) => `          <article class="activity-card"><h3>${esc(title)}</h3><p>${esc(body)}</p><p><a class="text-link" href="${esc(href)}">${esc(linkText)}</a></p></article>`).join("\n")}
        </div>`;
}

function renderActivityUpgrade(page) {
  const clusterSection = page.clusterLinks?.length
    ? `
      <section class="band rank-ready-section">
        <div class="container">
          <div class="section-heading">
            <p class="eyebrow">Plan the cluster</p>
            <h2>Connect activities to stay area, route, and methodology</h2>
          </div>
${renderClusterCards(page.clusterLinks)}
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

` : ""}      <section class="band rank-ready-section">
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
      </section>${clusterSection ? `${clusterSection}` : ""}
${markerEnd}
`;
}

function renderTeenUpgrade(page) {
  const indexDecision = page.indexDecision
    ? `        <p class="review-label">${esc(page.indexDecision)}</p>\n`
    : "";
  return `${markerStart}
      <section class="band rank-ready-section">
        <div class="container">
          <div class="section-heading">
            <p class="eyebrow">Teen quick picks</p>
            <h2>Best choices by teen trip style</h2>
          </div>
${indexDecision}${renderQuickPicks(page.quick)}
        </div>
      </section>

      <section class="container page-section rank-ready-section">
        <div class="section-heading">
          <p class="eyebrow">Compare teen activities</p>
          <h2>Teen activity decision table</h2>
        </div>
        <p class="review-label">Planning guidance only. Verify current hours, ticketing, age or height rules, weather, transit, stroller needs for siblings, and safety advisories before committing to a teen itinerary.</p>
${renderActivityComparison(page.rows)}
      </section>

      <section class="band intro-band rank-ready-section">
        <div class="container">
          <div class="section-heading">
            <p class="eyebrow">Teen logistics</p>
            <h2>Detailed notes for older-kid planning</h2>
          </div>
${renderDetails(page.details)}
        </div>
      </section>

      <section class="container page-section rank-ready-section">
        <div class="section-heading">
          <p class="eyebrow">Teen itineraries</p>
          <h2>Route ideas that avoid generic sightseeing marathons</h2>
        </div>
${renderPlans(page.plans)}
      </section>

      <section class="band rank-ready-section">
        <div class="container">
          <div class="section-heading">
            <p class="eyebrow">Plan the cluster</p>
            <h2>Use the teen page with the broader family guide</h2>
          </div>
          <div class="card-grid">
            <article class="activity-card"><h3>All-ages activity hub</h3><p>Use the main guide when siblings, grandparents, toddlers, or mixed stamina levels change the activity shortlist.</p><p><a class="text-link" href="${esc(page.links.allAges)}">Open the all-ages things-to-do guide</a></p></article>
            <article class="activity-card"><h3>Where to stay</h3><p>Choose the lodging base before locking in teen routes; transit, parking, noise, pool value, and meal access shape the day.</p><p><a class="text-link" href="${esc(page.links.stay)}">Open the where-to-stay guide</a></p></article>
            <article class="activity-card"><h3>Family itinerary</h3><p>Use the itinerary page to keep the teen plan realistic around meals, weather, hotel resets, and younger siblings.</p><p><a class="text-link" href="${esc(page.links.itinerary)}">Open the family itinerary</a></p></article>
          </div>
        </div>
      </section>
${markerEnd}
`;
}

function renderStayMatrix(rows, labelMode = "default") {
  const headers = labelMode === "verification"
    ? ["Area candidate", "Research angle", "What to verify", "Route/transport check", "Stroller/access check", "Smoke/noise check", "Parking/fee check", "Walking check", "Nearby anchor context", "Property type", "Evidence state"]
    : ["Area", labelMode === "hypothesis" ? "Research angle" : "Best for", "Main tradeoff", "Transit/driving", "Stroller", "Noise", "Parking", "Walkability", "Nearby attractions", "Hotel type", labelMode === "hypothesis" ? "Evidence state" : "Family verdict"];
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
          <p class="eyebrow">Interactive stay checklist</p>
          <h2 id="stay-tool-title">Turn your hardest constraint into booking checks</h2>
        </div>
        <p class="review-label">This tool creates a verification checklist. It does not rank areas, publish the prototype's unreviewed scores, or replace current property and route research.</p>
        <p class="note stay-tool-sources">Evidence starting points: <a href="https://www.sandiego.gov/planning/community-plans/mission-valley">City of San Diego Mission Valley plan</a>, <a href="https://www.sdmts.com/getting-around/maps-and-schedules">MTS maps and schedules</a>, and <a href="https://www.sandiegocounty.gov/content/sdc/deh/lwqd/beachandbay.html">County beach and bay status</a>. These sources establish context, not a family-fit verdict.</p>
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
            <button class="button tool-submit" type="submit">Build my verification checklist</button>
            <p class="note">Your answers stay in this browser tab and are not sent or stored.</p>
          </form>
          <section class="result-panel stay-tool-result" aria-labelledby="stay-tool-result-title" aria-live="polite">
            <p class="eyebrow">Your research sequence</p>
            <h3 id="stay-tool-result-title">Verify before narrowing the shortlist</h3>
            <p id="stay-tool-summary">Choose the constraints that would make or break the trip.</p>
            <ol id="stay-tool-checklist">
              <li>Shortlist two areas as hypotheses, not conclusions.</li>
              <li>Verify exact properties, routes, dates, and total prices.</li>
            </ol>
            <p class="note">Keep unsupported details as <strong>UNKNOWN</strong>. Recheck dynamic transit, beach, price, fee, and property information near the booking date.</p>
          </section>
        </div>
        <noscript><p class="review-label">JavaScript is unavailable. Use the area matrix and official-source booking checks below as a manual checklist.</p></noscript>
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
          <h2>Official-source checks before you book</h2>
        </div>
${renderVerificationChecks(page.bookingChecks)}
      </section>`
    : "";
  const clusterSection = page.clusterLinks?.length
    ? `      <section class="band rank-ready-section">
        <div class="container">
          <div class="section-heading">
            <p class="eyebrow">Plan the cluster</p>
            <h2>Use the stay guide with activities, itinerary, and methodology</h2>
          </div>
${renderClusterCards(page.clusterLinks)}
        </div>
      </section>`
    : "";
  const hotelSection = page.hotels?.length
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
            <h2>${page.stayTool || page.constraintLed ? "Area hypotheses by family need" : "Best areas by family need"}</h2>
          </div>
${renderQuickPicks(page.quick)}
        </div>
      </section>

      <section class="container page-section rank-ready-section">
        <div class="section-heading">
          <p class="eyebrow">Area matrix</p>
          <h2>Compare the stay tradeoffs before booking</h2>
        </div>
${areaNote}${renderStayMatrix(page.rows, page.constraintLed ? "verification" : page.stayTool ? "hypothesis" : "default")}
      </section>

${[decisionSection, hotelSection, bookingSection, clusterSection].filter(Boolean).join("\n\n")}
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
