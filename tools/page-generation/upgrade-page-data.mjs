import { readFileSync } from "node:fs";
import { summitPolicy } from "../nyc-summit-policy.mjs";
import { momaComparison } from "../nyc-moma-budget.mjs";
import { ferryComparison } from "../nyc-ferry-budget.mjs";
import { omnyComparison } from "../nyc-omny-budget.mjs";
import { spygamesPolicy } from "../nyc-spygames-policy.mjs";
import { garfieldView } from "../garfield-admission.mjs";

const summitAccess = summitPolicy().evidence;
const spygamesAccess = spygamesPolicy().evidence;
const garfieldAdmission = garfieldView();
const teenIndependenceFaq = summitAccess.public_copy.faq.replace("Elsewhere,", `${spygamesAccess.public_copy.faq} Elsewhere,`);

const teenAccess = JSON.parse(readFileSync(new URL("../../docs/research/las-vegas-teen-access-2026-10-09.json", import.meta.url), "utf8"));

export const activityPages = {
  "things-to-do/san-diego-with-kids.html": {
    title: "Things to Do in San Diego With Kids: Age, Stroller, Rain and Nap Guide",
    description:
      "Plan things to do in San Diego with kids by age, stroller difficulty, rainy-day backup, nap-friendliness, parking, timing, and nearby pairings.",
    city: "San Diego",
    baseReplacements: [
      ["<p><strong>Last updated:</strong> July 28, 2026</p>", "<p><strong>Ticket prices checked:</strong> November 1, 2026 (LEGOLAND October 30)<br><strong>Venue facts checked:</strong> July 31, 2026</p>"],
      ["<p>Build around beach mornings, the zoo, Balboa Park, La Jolla, and realistic driving windows between naps, meals, and pool time.</p>", "<p>Plan one big outing a day. Family of 4 (2 adults, kids 4 and 8), tickets only, parking usually extra: beaches free · Birch Aquarium ≈ $130 online · Zoo ≈ $272-292. <a href=\"#san-diego-logistics-index-title\">All 12 costs</a></p>"]
    ],
    quick: [
      ["Best overall", "San Diego Zoo", "Best single anchor for most ages if you start early and avoid trying to see every zone."],
      ["Best for toddlers", "Mission Bay beach morning", "Calmer water, flexible timing, and easy bail-out if naps win."],
      ["Best for teens", "La Jolla Cove or Belmont Park", "Choose coast and scenery or rides and boardwalk energy instead of a younger-child museum day."],
      ["Best rainy-day option", "Fleet, The New Children's Museum, or Birch Aquarium", "Choose by child age and location, then check the selected venue's current hours and closure notices."],
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
    logisticsIndex: [
      {
        name: "San Diego Zoo",
        area: "Balboa Park",
        setting: "Mostly outdoor",
        timeEstimate: "4-6 hours",
        costEstimate: "High paid day",
        familyCost: "≈ $292 any day",
        priceDetail: "≈ $272 on online Value Days ($73 / $63); 1-Day Pass $78 ages 12+, $68 ages 3-11; parking extra",
        priceChecked: "2026-11-01",
        priceUrl: "https://zoo.sandiegozoo.org/tickets",
        currentCheck: "Ticket, dated hours, parking, and accessibility map",
        weatherRole: "Outdoor anchor; limited weather backup",
        transportPrompt: "Compare paid parking with Route 7 or 215 from your base.",
        evidenceNote: "Official venue facts; Family Tripwise planning estimates",
        unknowns: "Crowds, queues, and exact family pace",
        checked: "2026-07-31",
        officialUrl: "https://zoo.sandiegozoo.org/plan-your-visit"
      },
      {
        name: "Mission Bay beach morning",
        area: "Mission Bay",
        setting: "Outdoor beach and park",
        timeEstimate: "2-3 hours",
        costEstimate: "Free or low cost",
        familyCost: "Free entry",
        priceDetail: "No ticket; parking, food and rentals not priced",
        priceChecked: "2026-07-31",
        priceUrl: "https://www.sandiego.gov/park-and-recreation/parks/regional/missionbay",
        currentCheck: "No ticket; check beach and bay status for the exact stop",
        weatherRole: "Weather and water dependent",
        transportPrompt: "Choose the exact swim or play area before comparing parking.",
        evidenceNote: "Official city facts; Family Tripwise planning estimates",
        unknowns: "Water conditions, parking fill, shade, and restroom availability",
        checked: "2026-07-31",
        officialUrl: "https://www.sandiego.gov/park-and-recreation/parks/regional/missionbay"
      },
      {
        name: "Balboa Park museums",
        area: "Balboa Park",
        setting: "Public park plus indoor museums",
        timeEstimate: "2-4 hours",
        costEstimate: "Free park; museum costs vary",
        familyCost: "Park free",
        priceDetail: "Museum tickets vary; Fleet Science Center ≈ $110 (its row below)",
        priceChecked: "2026-07-31",
        priceUrl: "https://balboapark.org/plan-your-visit/",
        currentCheck: "Choose a museum, then check its hours, tickets, and paid parking",
        weatherRole: "Strong indoor backup after selecting a museum",
        transportPrompt: "Use the park map or transit plan; museum hours vary.",
        evidenceNote: "Official park facts; Family Tripwise planning estimates",
        unknowns: "Chosen museum, exhibit fit, ticket rules, and parking",
        checked: "2026-07-31",
        officialUrl: "https://balboapark.org/plan-your-visit/"
      },
      {
        name: "Birch Aquarium",
        area: "La Jolla",
        setting: "Mostly indoor with outdoor terrace",
        timeEstimate: "1.5-2 hours",
        costEstimate: "Mid paid",
        familyCost: "≈ $130 online",
        priceDetail: "$34.95 ages 13+, $29.95 ages 3-12 online ($39.95 / $34.95 at the door), some dates cheaper; 3 hours free parking",
        priceChecked: "2026-11-01",
        priceUrl: "https://aquarium.ucsd.edu/plan-your-visit",
        currentCheck: "Check dated tickets, daily schedule, and closing time",
        weatherRole: "Good partial weather backup",
        transportPrompt: "Limited free three-hour parking; compare transit from your base.",
        evidenceNote: "Official venue facts; Family Tripwise planning estimates",
        unknowns: "Ticket inventory, parking capacity, and exhibit fit",
        checked: "2026-07-31",
        officialUrl: "https://aquarium.ucsd.edu/plan-your-visit"
      },
      {
        name: "La Jolla Cove",
        area: "La Jolla",
        setting: "Outdoor coast",
        timeEstimate: "2-4 hours",
        costEstimate: "Free or low cost",
        familyCost: "Free entry",
        priceDetail: "No ticket; parking and food not priced",
        priceChecked: "2026-07-31",
        priceUrl: "https://www.sandiego.gov/lifeguards/beaches/cove",
        currentCheck: "No ticket; check current beach and water status",
        weatherRole: "Weather and ocean dependent",
        transportPrompt: "Choose the exact coast segment; parking availability varies.",
        evidenceNote: "Official city facts; Family Tripwise planning estimates",
        unknowns: "Parking, crowds, water conditions, and walking conditions",
        checked: "2026-07-31",
        officialUrl: "https://www.sandiego.gov/lifeguards/beaches/cove"
      },
      {
        name: "Coronado ferry/waterfront",
        area: "Downtown and Coronado",
        setting: "Ferry plus outdoor waterfront",
        timeEstimate: "2-3 hours",
        costEstimate: "Low to mid paid",
        familyCost: "From ≈ $72 round trip",
        priceDetail: "One way from $9 a person (no child fare shown), 4 people each way",
        priceChecked: "2026-11-01",
        priceUrl: "https://www.flagshipsd.com/cruises/flagship-ferry",
        currentCheck: "Check route, schedule, one-way tickets, and capacity",
        weatherRole: "Weather and operations dependent",
        transportPrompt: "Choose downtown and return terminals before routing the day.",
        evidenceNote: "Official operator facts; Family Tripwise planning estimates",
        unknowns: "Capacity, wait, return timing, and weather disruption",
        checked: "2026-07-31",
        officialUrl: "https://www.flagshipsd.com/cruises/flagship-ferry"
      },
      {
        name: "SeaWorld San Diego",
        area: "Mission Bay",
        setting: "Mixed outdoor and indoor",
        timeEstimate: "Full day",
        costEstimate: "High paid day",
        familyCost: "From ≈ $208",
        priceDetail: "Single-Day Ticket from $51.99 a person online, cheapest dates; parking, tax and service fees extra",
        priceChecked: "2026-11-01",
        priceUrl: "https://seaworld.com/san-diego/tickets/special-offers/",
        currentCheck: "Check ticket, dated hours, showtimes, closures, and height rules",
        weatherRole: "Mostly outdoor day with limited indoor backup",
        transportPrompt: "Check parking and use the official map or app for the day.",
        evidenceNote: "Official venue facts; Family Tripwise planning estimates",
        unknowns: "Queues, showtimes, ride availability, and height splits",
        checked: "2026-07-31",
        officialUrl: "https://seaworld.com/san-diego/park-info/"
      },
      {
        name: "LEGOLAND California",
        area: "Carlsbad",
        setting: "Mostly outdoor",
        timeEstimate: "Full day",
        costEstimate: "High paid day",
        familyCost: "From ≈ $276",
        priceDetail: "1-day ticket from $69 a person online (no child price listed); parking extra",
        priceChecked: "2026-10-30",
        priceUrl: "https://california-support.legoland.com/hc/en-us/articles/27043331841693-How-much-is-an-admission-ticket-to-LEGOLAND-California",
        currentCheck: "Check ticket, dated hours, closures, and height rules",
        weatherRole: "Weather dependent; water park is seasonal",
        transportPrompt: "Treat Carlsbad as its own day and check parking before leaving.",
        evidenceNote: "Official venue facts; Family Tripwise planning estimates",
        unknowns: "Closures, waits, height splits, and water-park availability",
        checked: "2026-07-31",
        officialUrl: "https://www.legoland.com/california/plan-your-visit/planning-tools/opening-hours/"
      },
      {
        name: "San Diego Zoo Safari Park",
        area: "Escondido",
        setting: "Outdoor wildlife park",
        timeEstimate: "Full day",
        costEstimate: "High paid day",
        familyCost: "≈ $292 any day",
        priceDetail: "≈ $272 on online Value Days ($73 / $63); 1-Day Pass $78 ages 12+, $68 ages 3-11; optional safaris extra",
        priceChecked: "2026-11-01",
        priceUrl: "https://sdzsafaripark.org/tickets",
        currentCheck: "Check ticket, dated hours, parking, map, and optional safaris",
        weatherRole: "Heat and weather dependent",
        transportPrompt: "Compare the Escondido drive, parking, and steep-grade access.",
        evidenceNote: "Official venue facts; Family Tripwise planning estimates",
        unknowns: "Heat, waits, optional-safari availability, and family pace",
        checked: "2026-07-31",
        officialUrl: "https://sdzsafaripark.org/plan-your-visit"
      },
      {
        name: "The New Children's Museum",
        area: "Downtown",
        setting: "Indoor",
        timeEstimate: "2-3 hours",
        costEstimate: "Mid paid",
        familyCost: "≈ $90",
        priceDetail: "$25 adults 18+, $20 children 1+, under 1 free; closed Tuesdays",
        priceChecked: "2026-11-01",
        priceUrl: "https://thinkplaycreate.org/visit/",
        currentCheck: "Check current open days, hours, admission, and calendar",
        weatherRole: "Strong weather backup",
        transportPrompt: "Confirm downtown parking or transit for the chosen day.",
        evidenceNote: "Official venue facts; Family Tripwise planning estimates",
        unknowns: "Open-day changes, events, crowds, and age fit",
        checked: "2026-07-31",
        officialUrl: "https://thinkplaycreate.org/visit/"
      },
      {
        name: "Fleet Science Center",
        area: "Balboa Park",
        setting: "Indoor",
        timeEstimate: "2-4 hours",
        costEstimate: "Mid paid",
        familyCost: "≈ $110",
        priceDetail: "$29.95 ages 13+, $24.95 ages 3-12, 2 and under free; one dome film included",
        priceChecked: "2026-11-01",
        priceUrl: "https://www.fleetscience.org/hours-admission",
        currentCheck: "Check admission, documentary schedule, and accessibility mornings",
        weatherRole: "Strong weather backup",
        transportPrompt: "Allow time from Balboa Park parking or transit to a timed film.",
        evidenceNote: "Official venue facts; Family Tripwise planning estimates",
        unknowns: "Film schedule, crowds, and exhibit fit",
        checked: "2026-07-31",
        officialUrl: "https://www.fleetscience.org/hours-admission"
      },
      {
        name: "Belmont Park",
        area: "Mission Beach",
        setting: "Mixed outdoor and indoor",
        timeEstimate: "2-4 hours",
        costEstimate: "Mid to high, depending on rides",
        familyCost: "Check live",
        priceDetail: "No ride prices on the official tickets page; set a ride budget first",
        priceChecked: "2026-11-01",
        priceUrl: "https://www.belmontpark.com/tickets-reservation",
        currentCheck: "Check ride tickets, hours, closures, and height rules",
        weatherRole: "Weather dependent with some indoor options",
        transportPrompt: "Plan for Mission Beach parking and set a ride or spending limit.",
        evidenceNote: "Official venue facts; Family Tripwise planning estimates",
        unknowns: "Ride hours, height splits, parking, crowds, and total spend",
        checked: "2026-07-31",
        officialUrl: "https://www.belmontpark.com/park-hours"
      }
    ],
    details: [
      ["SeaWorld San Diego", "Families can combine animals, presentations, and rides without changing locations.", "Best when preschoolers through teens share at least one interest.", "Height splits, show timing, heat, lines, and a high total cost can fragment the day.", "Choose the family's top two priorities before arrival and use the official app for current schedules.", "Food and family restrooms are inside; check outside-food and stroller policies before packing.", "Check dated hours, closures, height rules, and ticket terms.", "Pair only with a Mission Bay or hotel reset."],
      ["LEGOLAND California", "The park has unusually strong focus for LEGO-loving younger children.", "Best for toddlers through elementary-age kids; older siblings need ride-interest checks.", "Carlsbad travel, height splits, seasonal Water Park hours, and trying to return to central San Diego afterward.", "Treat it as a North County day and arrive near opening.", "Use the park app and plan one calm meal window before the afternoon dip.", "Check dated hours, temporary closures, height rules, parking, and ticket terms.", "Pair with a North County hotel or an early dinner, not a central-city attraction."],
      ["San Diego Zoo Safari Park", "Families get a larger-scale wildlife setting that feels different from the city zoo.", "Best for preschoolers through teens who tolerate a large outdoor day.", "Escondido travel, heat, parking, and the park's large footprint.", "Choose Safari Park or Zoo for the trip unless the family genuinely wants two full wildlife days.", "Use the official map to place meals, shade, and rest around the must-see animals.", "Check current hours, parking, heat, optional safari costs, and attraction schedules.", "Pair with an early meal and rest, not another ticketed anchor."],
      ["The New Children's Museum", "Hands-on installations give younger children a real Downtown indoor anchor.", "Best for toddlers through early elementary kids.", "It may skew young for tweens and teens, and its weekly hours or event closures can change.", "Use it for two or three hours rather than filling an entire family day.", "Plan lunch nearby and verify Waterfront Park conditions before relying on the outdoor pairing.", "Check current hours, closure notices, admission, events, and the museum calendar.", "Pair with Waterfront Park, Seaport Village, or a hotel reset."],
      ["Fleet Science Center", "Interactive exhibits and a dome-theater film create a useful science and weather-backup choice.", "Best for preschoolers through tweens, with exhibit fit varying by age.", "Museum overlap, film timing, and trying to add too many Balboa Park stops.", "Choose the film and one or two exhibit priorities before entering.", "The official page lists an on-site cafe; confirm its current hours if it anchors the meal plan.", "Check current admission, film schedule, and accessibility-morning dates.", "Pair with one garden, playground, or short Balboa Park walk."],
      ["Belmont Park", "Families can choose a few rides, food, and beach time without committing to a full theme-park day.", "Best for elementary kids, tweens, and teens after checking ride heights.", "Crowds, noise, ride-by-ride cost, height splits, and Mission Beach parking.", "Set a ride or spending limit before arrival and keep the beach portion optional.", "Food is available in the park; verify restrooms and beach conditions for the exact plan.", "Check current ride hours, ticket options, closures, and height rules.", "Pair with Mission Bay or a short beach walk, not another major paid attraction."]
    ],
    compactDetails: true,
    comparisonNote: "Dollar prices: official, read November 1, 2026 (LEGOLAND October 30). Venue facts checked July 31, 2026. Setting, time, weather and transport labels are Family Tripwise planning estimates.",
    logisticsCostNote: "Family of 4 estimate (2 adults, 2 kids aged 4 and 8; official prices): tickets only, so tax, fees, parking and food are extra.",
    detailsEyebrow: "Extra planning",
    detailsTitle: "What changes when you choose a major paid or day-trip option",
    detailsNote: "The logistics index covers all 12 choices. These six additions need extra planning because of geography, height splits, operating schedules, or a larger time and ticket commitment.",
    plans: {
      "1-day plan": "Start at the zoo when it opens, stick to a few zones, eat nearby, rest after lunch, then choose Mission Bay or a hotel pool instead of crossing to La Jolla.",
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
    heroPhoto: "san-antonio",
    frontComparison: true,
    title: "Things to Do in San Antonio With Kids: 13 Picks by Trip Style",
    description:
      "Compare 13 things to do in San Antonio with kids by age, heat and indoor fit, budget, time, area, and trip style, with current official-source checks.",
    city: "San Antonio",
    removeBaseActivitySiblingBand: true,
    supportCardClass: "detail-card",
    hidePlans: true,
    baseReplacements: [
      ["<h1>Things to do in San Antonio with kids</h1>", "<h1>Things to Do in San Antonio With Kids: 13 Picks by Trip Style</h1>"],
      ["<p>Use the River Walk, Alamo, museums, theme parks, and Pearl District without underestimating heat, walking time, or nap breaks.</p>", "<p>One anchor a day. Family of 4 (2 adults, kids 4 and 8), tickets-only estimate: Hemisfair and the Missions free · DoSeum ≈ $72 · SeaWorld from ≈ $216.</p>"],
      ["<p><strong>Last updated:</strong> July 5, 2026</p>", "<p><strong>Last updated:</strong> July 26, 2026 <span aria-hidden=\"true\">·</span> <strong>Ticket prices checked:</strong> November 1, 2026</p>"],
      ["Family Tripwise compares official attraction and hotel information, family logistics, search-intent research, and practical planning tradeoffs like age fit, stroller friction, weather backup, nap timing, walking distance, and lodging base.", "Family Tripwise compares current official attraction and city information, family logistics, search-intent research, and practical planning tradeoffs such as age fit, heat or rain backup, cost, time, and location."],
      ["<div><dt>Best toddler ideas</dt><dd>The DoSeum, San Antonio Zoo</dd></div>", "<div><dt>Younger-child day</dt><dd>The DoSeum, Hemisfair, or the zoo</dd></div>"],
      ["<div><dt>Best teen ideas</dt><dd>Natural Bridge Caverns, Six Flags Fiesta Texas</dd></div>", "<div><dt>Older-kid day</dt><dd>Caverns, missions, or one theme park</dd></div>"],
      ['<img src="https://commons.wikimedia.org/wiki/Special:Redirect/file/The%20San%20Antonio%20River%20Walk.jpg" alt="The San Antonio River Walk with paths and restaurants along the water." loading="eager" decoding="async">', '<img src="https://commons.wikimedia.org/wiki/Special:Redirect/file/The%20San%20Antonio%20River%20Walk.jpg?width=1200" alt="The San Antonio River Walk with paths and restaurants along the water." width="1280" height="960" loading="eager" decoding="async" fetchpriority="high">'],
    ],
    activityFilterTitle: "Filter 13 San Antonio choices by family need",
    activityFilters: [
      ["all", "All"],
      ["younger", "Younger-child anchors"],
      ["short", "Short / flexible"],
      ["teen", "Older-kid payoff"],
      ["indoor", "Indoor / heat"],
      ["budget", "Free / low cost"],
      ["theme-park", "Theme park"],
    ],
    activityCards: [
      {
        name: "The Alamo",
        tags: ["school-age", "budget", "short"],
        age: "School-age through teen",
        time: "45-90 min",
        cost: "Free church; paid extras",
        area: "Downtown",
        stroller: "Experience-specific",
        rain: "Partial",
        nap: "Exit-flexible",
        summary: "Use the free reserved church visit or a paid experience for concise city context, not as a universal half-day.",
      },
      {
        name: "GO RIO narrated cruise",
        tags: ["school-age", "short"],
        age: "Preschool through teen",
        time: "35 min plus wait",
        cost: "Paid",
        area: "Downtown River Walk",
        stroller: "Boarding-specific",
        rain: "Weather-dependent",
        nap: "Fixed once aboard",
        summary: "A seated 35-minute city orientation; boarding, weather, and the wait still need a current check.",
      },
      {
        name: "The DoSeum",
        tags: ["younger", "school-age", "indoor"],
        age: "Baby through early elementary",
        time: "2-4 hrs",
        cost: "Paid",
        area: "Broadway",
        stroller: "Check exact need",
        rain: "Strong indoor option",
        nap: "Easy exit",
        summary: "The clearest hands-on younger-child anchor, with indoor exhibits, outdoor play, and an official Calm Corner.",
      },
      {
        name: "Hemisfair and Yanaguana Garden",
        tags: ["younger", "school-age", "budget", "short"],
        age: "Toddler through elementary",
        time: "45 min-2 hrs",
        cost: "Free public park",
        area: "Downtown",
        stroller: "Path-specific",
        rain: "Outdoor",
        nap: "Easy exit",
        summary: "Use this free play-and-reset stop between Downtown commitments, subject to weather and current park notices.",
      },
      {
        name: "San Antonio Zoo",
        tags: ["younger", "school-age"],
        age: "Toddler through tween",
        time: "3-5 hrs",
        cost: "Paid",
        area: "Brackenridge Park",
        stroller: "Check route and rentals",
        rain: "Mostly outdoor",
        nap: "Large-site exit",
        summary: "A substantial animal day with free garage parking; start with a few priorities and treat add-ons separately.",
      },
      {
        name: "Witte Museum",
        tags: ["younger", "school-age", "teen", "indoor"],
        age: "Preschool through teen",
        time: "2-4 hrs",
        cost: "Paid",
        area: "Brackenridge Park",
        stroller: "Venue guidance available",
        rain: "Strong indoor option",
        nap: "Easy exit",
        summary: "Choose this for Texas nature, science, and culture when the family wants a broader museum than a play space.",
      },
      {
        name: "Japanese Tea Garden",
        tags: ["school-age", "budget", "short"],
        age: "All ages",
        time: "30-75 min",
        cost: "Free",
        area: "Brackenridge Park",
        stroller: "Route-specific",
        rain: "Outdoor",
        nap: "Easy exit",
        summary: "A short, free garden stop that works best as a Brackenridge pairing, not a reason to cross the city alone.",
      },
      {
        name: "San Antonio Missions",
        tags: ["school-age", "teen", "budget"],
        age: "School-age through teen",
        time: "1.5-4 hrs",
        cost: "Free",
        area: "South Side",
        stroller: "Site-specific",
        rain: "Mostly outdoor",
        nap: "Driving-dependent",
        summary: "Start at Mission San Jose for the visitor center and Junior Ranger context; do not assume all four sites share hours.",
      },
      {
        name: "San Antonio Botanical Garden",
        tags: ["younger", "school-age"],
        age: "Toddler through teen",
        time: "2-3 hrs",
        cost: "Paid",
        area: "Near Brackenridge",
        stroller: "Official access guidance",
        rain: "Mostly outdoor",
        nap: "Easy exit",
        summary: "A nature-led family block with a Family Adventure Garden; splash use, events, hours, and heat are date-specific.",
      },
      {
        name: "Morgan's Wonderland",
        tags: ["school-age", "theme-park"],
        age: "All ages; needs vary",
        time: "Half-full day",
        cost: "Paid; guests with special needs free",
        area: "Northeast",
        stroller: "Accessibility-led park",
        rain: "Mostly outdoor",
        nap: "Large-site exit",
        summary: "An inclusive theme-park choice with 25-plus rides and play elements; calendar and exact attraction needs decide fit.",
      },
      {
        name: "Natural Bridge Caverns",
        tags: ["school-age", "teen"],
        age: "School-age through teen",
        time: "2-5 hrs",
        cost: "Paid",
        area: "North of city",
        stroller: "Tour-specific",
        rain: "Product-specific",
        nap: "Fixed tour",
        summary: "Choose the exact cavern tour first; terrain, duration, above-ground add-ons, and drive time change the family day.",
      },
      {
        name: "Six Flags Fiesta Texas",
        tags: ["school-age", "teen", "theme-park"],
        age: "School-age through teen",
        time: "Full day",
        cost: "Paid",
        area: "Northwest",
        stroller: "Park-specific",
        rain: "Weather-sensitive",
        nap: "Large-site exit",
        summary: "A ride-led full day when height splits and thrill interests work across the family; check the dated calendar and closures.",
      },
      {
        name: "SeaWorld San Antonio",
        tags: ["younger", "school-age", "teen", "theme-park"],
        age: "Preschool through teen",
        time: "Full day",
        cost: "Paid",
        area: "West",
        stroller: "Park-specific",
        rain: "Weather-sensitive",
        nap: "Large-site exit",
        summary: "A full-day mix of animals, presentations, and rides; Aquatica requires a separate ticket choice and schedules vary.",
      },
    ],
    frontComparisonOrder: [0, 3, 1, 2, 4, 5, 6, 7],
    comparisonHeaders: ["Activity", "Best role", "Time block", "Family of 4 cost", "Area", "Heat / rain role", "Main friction", "Check now"],
    comparisonClass: "teen-comparison ds-table sa-kids-ds",
    comparisonCostNote: "Family of 4 estimate (2 adults, kids 4 and 8), tickets only: DoSeum ≈ $72, Witte ≈ $56, Six Flags from ≈ $196 or SeaWorld from ≈ $216 (kids at the adult price); parking, taxes and fees extra where charged.",
    compactDetails: true,
    comparisonNote: "Dollar prices are official prices read November 1, 2026. Role, time, weather and friction labels are editorial estimates, not venue guarantees.",
    quickEyebrow: "Choose a trip shape",
    quickTitle: "Five useful ways to start",
    quickNote: "These are conditional starts, not universal rankings. Pick the route that matches the family's age mix, heat tolerance, budget, and main trip anchor.",
    quick: [
      ["First-time city icons", "Alamo plus GO RIO or Hemisfair", "Keep the history stop concise, then choose one seated cruise or free play reset rather than filling the whole day Downtown."],
      ["Younger child or high heat", "The DoSeum or Witte Museum", "Choose hands-on play or broader science and Texas context, then leave room for a real hotel or meal reset."],
      ["Theme-park trip", "Morgan's, Six Flags, or SeaWorld", "Choose one full-day commitment by accessibility needs, ride and height fit, animal interest, and lodging base."],
      ["Older kids and mixed ages", "Caverns, missions, Witte, or a theme park", "Let the older child choose the payoff, then check exact tour, ride, supervision, and sibling constraints."],
      ["Free or lower-cost day", "Missions, Hemisfair, Alamo church, or the Japanese Tea Garden", "Group one or two choices geographically; parking, meals, heat, and paid add-ons still affect the day."]
    ],
    rows: [
      ["The Alamo", "Concise first-visit context", "45-90 min", "Church free (reserve); exhibit ≈ $52 ($15 adult, $11 ages 12 and under)", "Downtown", "Mixed indoor/outdoor", "Reservation and interest span", "Free church reservation and paid options"],
      ["GO RIO narrated cruise", "Seated city orientation", "35 min plus wait", "Paid; no price on the official pages Nov 1; check live", "Downtown River Walk", "Weather-dependent", "Boarding, wait, fixed time aboard", "Weather and current operations"],
      ["The DoSeum", "Younger-child hands-on anchor", "2-4 hrs", "≈ $72 ($18 a person, ages 1+; under 1 free)", "Broadway", "Strong indoor option", "Crowds and age ceiling", "Hours, admission, sensory calendar"],
      ["Hemisfair and Yanaguana Garden", "Free play and reset", "45 min-2 hrs", "Free public park", "Downtown", "Outdoor", "Heat and current water/play conditions", "Park notices and weather"],
      ["San Antonio Zoo", "Animal half or full day", "3-5 hrs", "From ≈ $32 (as low as $8 a person, ages 3+; price varies); garage free during zoo hours", "Brackenridge Park", "Mostly outdoor", "Heat, scale, optional add-ons", "Hours, tickets, happenings"],
      ["Witte Museum", "Indoor nature, science, culture", "2-4 hrs", "≈ $56 ($17 adult, $11 ages 4-12; 3 and under free); special exhibits extra; parking free", "Brackenridge Park", "Strong indoor option", "Exhibit fit and special surcharges", "Hours, exhibitions, cafe status"],
      ["Japanese Tea Garden", "Free short garden pairing", "30-75 min", "Free", "Brackenridge Park", "Outdoor", "Heat and route-specific access", "Dawn-to-dusk hours and notices"],
      ["San Antonio Missions", "History and free Junior Ranger context", "1.5-4 hrs", "Free", "South Side", "Mostly outdoor", "Separate sites and unequal facility hours", "Mission San Jose visitor-center hours"],
      ["San Antonio Botanical Garden", "Nature and younger-child outdoor play", "2-3 hrs", "≈ $62 Mon-Thu, ≈ $74 Fri-Sun ($18/$22 adult, $13/$15 ages 3-13); parking free", "Near Brackenridge", "Mostly outdoor", "Heat, splash and event variability", "Hours, tickets, splash guidance"],
      ["Morgan's Wonderland", "Inclusive theme-park day", "Half-full day", "≈ $100 ($30 adult, $20 ages 3-13; the page also shows unlabeled $28 and $22 prices, so check which applies); guests with special needs free", "Northeast", "Mostly outdoor", "Season, park choice, exact access needs", "Calendar, ride closures, ticket type"],
      ["Natural Bridge Caverns", "Cave or adventure anchor", "2-5 hrs", "Paid; no tour price on the official page Nov 1; check live. Parking $10", "North of city", "Tour-specific", "Terrain, fixed tour, drive and add-ons", "Tour requirements, times, availability"],
      ["Six Flags Fiesta Texas", "Ride-led full day", "Full day", "From ≈ $196 ($49 a ticket online, kids at the adult price; no child price shown) plus taxes and a fee up to $9.99", "Northwest", "Weather-sensitive", "Height splits, heat, lines, closures", "Dated hours, rides, height rules"],
      ["SeaWorld San Antonio", "Animals, shows and rides", "Full day", "From ≈ $216 ($53.99 a ticket, ages 3+); parking, taxes and fees extra", "West", "Weather-sensitive", "Height splits, schedules, park-ticket choice", "Dated hours, accessibility, Aquatica terms"]
    ],
    detailsEyebrow: "High-friction choices",
    detailsTitle: "Six choices that need an extra check",
    detailsNote: "The comparison covers all 13. These six get extra space because reservations, weather, site scale, operating calendars, tour terrain, height splits, or accessibility needs can materially change the family plan.",
    details: [
      ["Downtown: Alamo and GO RIO", "Together they give first-time families history and a seated River Walk orientation.", "Use one or both only when the family's interest and weather support a Downtown block.", "The church needs a free reservation; the cruise has boarding, waiting, and weather constraints.", "Reserve the church if wanted, choose the cruise window near meals and energy, and keep a clear exit.", "Check Alamo options and GO RIO operations for the exact date.", "Keep the next commitment flexible if the wait or heat grows.", "Pair with Hemisfair or a meal, not another cross-city anchor."],
      ["San Antonio Zoo", "The zoo offers a broad animal day and publishes current happenings, maps, food, and ticket details.", "Choose it when animal interest justifies several mostly outdoor hours.", "Heat, scale, digital ticketing, food rules, and paid add-ons can expand the commitment.", "Pick priority areas first and decide before arrival whether any add-on matters.", "Check current hours, tickets, weather notices, map, and happenings.", "Stop before the visit becomes a completion exercise.", "Pair only with a short Brackenridge stop if energy remains."],
      ["Morgan's Wonderland", "The official park offers 25-plus rides, playscapes, and interactive elements with an accessibility-led mission.", "Choose it when its inclusive park design and exact attractions fit the family's needs.", "The operating calendar, water-park season, ticket type, closures, and individual access requirements vary.", "Use the official calendar, map, policies, and access resources rather than assuming every attraction works identically.", "Check the dated calendar, scheduled closures, park choice, and exact access need.", "Treat the park as the day's anchor.", "Pair with a simple meal or lodging reset."],
      ["Natural Bridge Caverns", "The caverns create a distinct geology and adventure day beyond Downtown.", "Choose the exact cave tour by child comfort, mobility, duration, and interest.", "Terrain, stairs or walking, a fixed tour, the north-side drive, and optional above-ground activities change the plan.", "Book the tour first and treat every above-ground activity as optional.", "Check tour requirements, dated times, availability, policies, and weather impacts.", "Leave enough margin for the drive and fixed check-in.", "Pair with a low-key meal or evening."],
      ["Six Flags Fiesta Texas", "This is the strongest ride-led choice when coasters and family rides are the actual trip priority.", "Choose it only after checking the family's height and thrill-interest split.", "Heat, lines, ride closures, park hours, ticket terms, and a non-rider sibling can lower value.", "Use the current attraction list and height rules to identify a small shared priority set.", "Check dated hours, scheduled closures, ride rules, tickets, and weather.", "Treat it as a full-day commitment.", "Pair with a hotel reset, not another major attraction."],
      ["SeaWorld San Antonio", "Animals, presentations, family rides, and thrill rides can serve a wider age range in one park.", "Choose it when those interests overlap enough to justify a full day.", "Show and ride schedules, height splits, weather, add-ons, and SeaWorld-versus-Aquatica tickets add decisions.", "Separate must-see animals or presentations from optional rides before arrival.", "Check dated hours, ticket inclusions, schedules, ride rules, and accessibility guidance.", "Decide whether Aquatica is part of the ticket before arrival.", "Pair with lodging near the west-side plan or a quiet evening."]
    ],
    clusterTitle: "Move from the shortlist to the right San Antonio page",
    clusterLinks: [
      ["Where to stay in San Antonio", "Choose the lodging base before finalizing activities. Downtown, Broadway, the northwest theme-park area, and west-side plans create different heat, reset, parking, and driving patterns.", "../where-to-stay/san-antonio-with-kids.html", "Open where to stay in San Antonio with kids"],
      ["San Antonio family itinerary", "Turn one anchor, one flexible reset, meals, and a weather pivot into a realistic route instead of stacking this shortlist.", "../family-itinerary/san-antonio-with-kids.html", "Open the San Antonio family itinerary"],
      ["San Antonio with teens", "Use the teen guide when caverns, thrill rides, older-child food interests, and mixed-age tradeoffs matter more than younger-child play.", "./san-antonio-with-teens.html", "Open San Antonio with teens"]
    ],
    officialChecksEyebrow: "Before locking the day",
    officialChecksTitle: "Four current checks that can change the shortlist",
    officialChecks: [
      ["Downtown reservations and weather", "The Alamo Church is free but requires a reservation. GO RIO operates year-round weather permitting, and narrated tickets are not tied to a specific time. Check both before promising a combined block.", [["https://www.thealamo.org/visit", "The Alamo visit"], ["https://www.goriocruises.com/visitor-information/", "GO RIO visitor information"]]],
      ["Younger-child indoor choices", "The DoSeum and Witte publish different age roles, hours, admission, sensory or access resources, and current exhibits. Choose the institution first, then check its exact calendar.", [["https://www.thedoseum.org/plan-your-visit", "The DoSeum plan your visit"], ["https://www.wittemuseum.org/plan-your-visit/", "Witte Museum plan your visit"]]],
      ["Free and outdoor choices", "Hemisfair, the Japanese Tea Garden, and San Antonio Missions are durable lower-cost choices, but heat, park notices, facility hours, and the exact site still matter.", [["https://hemisfair.org/visit/", "Hemisfair visit"], ["https://www.sa.gov/Directory/Departments/Parks/Parks-Facilities/Buildings-Centers/Japanese-Tea-Garden", "City of San Antonio Japanese Tea Garden"], ["https://www.nps.gov/saan/planyourvisit/basicinfo.htm", "San Antonio Missions basic information"]]],
      ["Full-day parks and caverns", "Morgan's, Natural Bridge Caverns, Six Flags, and SeaWorld all need a dated calendar plus exact ticket, attraction, height, weather, or accessibility checks. Pick one before choosing the lodging and route.", [["https://morganswonderland.org/plan-your-visit/", "Morgan's Wonderland plan your visit"], ["https://naturalbridgecaverns.com/", "Natural Bridge Caverns"], ["https://www.sixflags.com/fiestatexas", "Six Flags Fiesta Texas"], ["https://seaworld.com/san-antonio/park-info/", "SeaWorld San Antonio park information"]]]
    ],
    visibleFaqs: true,
    faqs: [
      ["What are the best things to do in San Antonio with kids?", "Choose by trip role rather than one universal ranking: the Alamo and GO RIO for first-visit context, The DoSeum for younger hands-on play, Witte for broader science and Texas history, the zoo for animals, missions for a free history day, or one theme park when it is the trip anchor."],
      ["What can families do for free in San Antonio?", "The San Antonio Missions, Hemisfair's public park, the Japanese Tea Garden, and the reserved Alamo Church visit are the clearest durable choices. Parking, meals, paid Alamo experiences, heat, and current facility hours can still change the day."],
      ["What is a useful indoor or heat-day activity in San Antonio with kids?", "The DoSeum is the strongest younger-child indoor anchor, while Witte Museum serves a wider school-age and mixed-age range. Neither is a universal fit, so check current exhibits, hours, tickets, sensory or accessibility needs, and the child's interests."]
    ],
    sourcesIntro: "Official attraction, park, and city sources checked July 26, 2026. Recheck tickets, hours, operating calendars, exhibits, weather, park notices, height or tour rules, and accessibility details for the exact visit date.",
    sources: [
      ["The Alamo visit", "https://www.thealamo.org/visit"],
      ["GO RIO visitor information", "https://www.goriocruises.com/visitor-information/"],
      ["GO RIO narrated cruise overview", "https://www.goriocruises.com/overview/"],
      ["The DoSeum plan your visit", "https://www.thedoseum.org/plan-your-visit"],
      ["Hemisfair visit", "https://hemisfair.org/visit/"],
      ["San Antonio Zoo plan your visit", "https://sazoo.org/visit/"],
      ["Witte Museum plan your visit", "https://www.wittemuseum.org/plan-your-visit/"],
      ["City of San Antonio Japanese Tea Garden", "https://www.sa.gov/Directory/Departments/Parks/Parks-Facilities/Buildings-Centers/Japanese-Tea-Garden"],
      ["San Antonio Missions basic information", "https://www.nps.gov/saan/planyourvisit/basicinfo.htm"],
      ["San Antonio Missions Junior Ranger", "https://www.nps.gov/saan/learn/kidsyouth/junior-ranger.htm"],
      ["San Antonio Botanical Garden plan your visit", "https://sabgtx.org/plan-your-visit/"],
      ["Morgan's Wonderland plan your visit", "https://morganswonderland.org/plan-your-visit/"],
      ["Natural Bridge Caverns", "https://naturalbridgecaverns.com/"],
      ["Six Flags Fiesta Texas", "https://www.sixflags.com/fiestatexas"],
      ["SeaWorld San Antonio park information", "https://seaworld.com/san-antonio/park-info/"],
      ["River Walk photo source and license", "https://commons.wikimedia.org/wiki/File:The_San_Antonio_River_Walk.jpg"]
    ]
  },
  "things-to-do/chicago-with-kids.html": {
    heroPhoto: "chicago-shedd-penguins",
    frontComparison: true,
    frontComparisonPrefix: "chi",
    frontComparisonClass: "chi-activity-glance",
    collapseDetailCards: true,
    frontComparisonOrder: [0, 3, 1, 2, 4, 5, 6, 7, 9, 10, 8],
    comparisonHeaders: ["Activity", "Best ages", "Time", "Family of 4 cost", "Area", "Stroller", "Rain", "Nap fit", "Booking", "Why worth it", "Pair nearby"],
    comparisonClass: "teen-comparison ds-table chi-kids-ds",
    frontComparisonView: {
      headers: ["Activity", "Family of 4 cost", "Best ages", "Time", "Area", "Stroller, rain, nap fit", "Why go, and what to pair", "Booking"],
      mergeLogistics: true,
    },
    comparisonPriceLinks: [["Shedd Aquarium", "https://www.sheddaquarium.org/plan-a-visit/plan-ahead-pricing"], ["Griffin Museum of Science and Industry", "https://www.griffinmsi.org/pricing"]],
    frontComparisonExtraLink: ["#garfield-admission", "Admission checks"],
    title: "Things to Do in Chicago With Kids: 12 Picks by Age and Trip Style",
    description:
      "Compare 12 things to do in Chicago with kids by age, weather, budget, time, area, stroller fit, and trip style, with current official-source checks.",
    city: "Chicago",
    garfieldAdmission,
    removeBaseActivitySiblingBand: true,
    supportCardClass: "detail-card",
    hidePlans: true,
    baseReplacements: [
      ["<p>Balance big museums, lakefront time, architecture views, parks, and neighborhood meals without turning every day into a transit marathon.</p>", "<p>Family-of-4 estimate (2 adults, kids 4 and 8; prices read Nov 2, 2026), tickets only: Lincoln Park Zoo free · Art Institute ≈ $64 · Children's Museum ≈ $100.</p>"],
      ["<h1>Things to do in Chicago with kids</h1>", "<h1>Things to Do in Chicago With Kids: 12 Picks by Age and Trip Style</h1>"],
      ["<p><strong>Last updated:</strong> July 5, 2026</p>", "<p><strong>Garfield Park admission checked:</strong> October 13, 2026 <span aria-hidden=\"true\">·</span> <strong>Other attraction sources checked:</strong> July 23, 2026 <span aria-hidden=\"true\">·</span> <strong>Ticket prices checked:</strong> November 2, 2026</p>"],
      ["Family Tripwise compares official attraction and hotel information, family logistics, search-intent research, and practical planning tradeoffs like age fit, stroller friction, weather backup, nap timing, walking distance, and lodging base.", "Family Tripwise compares official attraction information, current city sources, family logistics, and practical planning tradeoffs such as age fit, stroller friction, weather backup, nap timing, and location."],
      ["<div><dt>Best toddler ideas</dt><dd>Lincoln Park Zoo, Maggie Daley Park</dd></div>", "<div><dt>Younger-child day</dt><dd>Chicago Children's Museum or Lincoln Park Zoo</dd></div>"],
      ["<div><dt>Best teen ideas</dt><dd>architecture boat tour, food halls and neighborhoods</dd></div>", "<div><dt>Older-kid day</dt><dd>Architecture cruise, Art Institute, or 360 CHICAGO</dd></div>"],
    ],
    activityFilters: [
      ["all", "All"],
      ["toddler", "Toddler"],
      ["elementary", "Elementary"],
      ["teen", "Teen"],
      ["indoor", "Indoor / rain"],
      ["budget", "Free / low cost"],
    ],
    activityCards: [
      {
        name: "Field Museum",
        tags: ["elementary", "tween", "teen", "stroller", "indoor", "rain"],
        age: "School-age, tween, teen",
        time: "3-5 hrs",
        cost: "From ≈ $120 family of 4",
        area: "Museum Campus",
        stroller: "Good",
        rain: "Yes",
        nap: "Medium",
        summary: "Choose two or three exhibit priorities and treat this as the day's museum, not the first of several.",
      },
      {
        name: "Shedd Aquarium",
        tags: ["toddler", "preschool", "elementary", "tween", "stroller", "indoor", "rain"],
        age: "Toddler through tween",
        time: "2-4 hrs",
        cost: "Paid; check live",
        area: "Museum Campus",
        stroller: "Good",
        rain: "Yes",
        nap: "Medium",
        summary: "A strong animal and indoor anchor when the family is comfortable with timed tickets and busy galleries.",
      },
      {
        name: "Griffin Museum of Science and Industry",
        tags: ["preschool", "elementary", "tween", "teen", "stroller", "indoor", "rain"],
        age: "Preschool through teen",
        time: "4-6 hrs",
        cost: "Paid; check live",
        area: "Hyde Park",
        stroller: "Good",
        rain: "Yes",
        nap: "Low",
        summary: "Hands-on exhibits can fill most of a day; Hyde Park travel and ticketed add-ons make it a deliberate choice.",
      },
      {
        name: "Adler Planetarium",
        tags: ["elementary", "tween", "teen", "stroller", "indoor", "rain"],
        age: "School-age through teen",
        time: "2-4 hrs",
        cost: "From ≈ $76 family of 4",
        area: "Museum Campus",
        stroller: "Good",
        rain: "Yes",
        nap: "Medium",
        summary: "Best when space or sky shows are the real interest, not merely as a third Museum Campus stop.",
      },
      {
        name: "Lincoln Park Zoo",
        tags: ["baby", "toddler", "preschool", "elementary", "tween", "stroller", "budget"],
        age: "Baby through tween",
        time: "2-3 hrs",
        cost: "Free admission",
        area: "Lincoln Park",
        stroller: "Good",
        rain: "Partial",
        nap: "High",
        summary: "Free admission and flexible exits make this one of the easiest choices to shorten around weather or energy.",
      },
      {
        name: "Millennium Park and Maggie Daley Park",
        tags: ["toddler", "preschool", "elementary", "tween", "stroller", "budget"],
        age: "Toddler through tween",
        time: "1-3 hrs",
        cost: "Free",
        area: "Loop",
        stroller: "Good",
        rain: "No",
        nap: "Medium",
        summary: "Use the parks as a first-day orientation or movement break, with the Play Garden strongest for children under 12.",
      },
      {
        name: "Chicago Architecture Center river cruise",
        tags: ["tween", "teen"],
        age: "12+ advised by the operator",
        time: "90 min",
        cost: "From ≈ $228 family of 4",
        area: "River North",
        stroller: "Check operator",
        rain: "Weather-dependent",
        nap: "Low",
        summary: "A signature older-kid choice when the family can sit for 90 minutes and plans around weather and departure time.",
      },
      {
        name: "Chicago Children's Museum",
        tags: ["baby", "toddler", "preschool", "elementary", "stroller", "indoor", "rain"],
        age: "Baby through early elementary",
        time: "2-3 hrs",
        cost: "≈ $100 family of 4",
        area: "Navy Pier",
        stroller: "Good",
        rain: "Yes",
        nap: "High",
        summary: "The clearest family reason to visit Navy Pier, with hands-on play aimed mainly at younger children.",
      },
      {
        name: "Art Institute of Chicago",
        tags: ["elementary", "tween", "teen", "stroller", "indoor", "rain", "budget"],
        age: "School-age through teen",
        time: "90 min-3 hrs",
        cost: "≈ $64 family of 4 (under 14 free)",
        area: "Loop",
        stroller: "Good",
        rain: "Yes",
        nap: "Medium",
        summary: "A short family route can work better than a completionist visit; family resources and sensory guidance are available.",
      },
      {
        name: "360 CHICAGO",
        tags: ["elementary", "tween", "teen", "stroller", "indoor", "rain"],
        age: "School-age through teen",
        time: "60-90 min",
        cost: "From ≈ $92 family of 4",
        area: "Magnificent Mile",
        stroller: "Check venue",
        rain: "Yes, but views vary",
        nap: "Medium",
        summary: "A contained skyline choice; treat TILT as an optional add-on and check visibility before committing.",
      },
      {
        name: "Garfield Park Conservatory",
        tags: ["baby", "toddler", "preschool", "elementary", "tween", "teen", "stroller", "indoor", "rain", "budget"],
        age: "All ages",
        time: "1-2 hrs",
        cost: garfieldAdmission.cost,
        area: "Garfield Park",
        stroller: "Good",
        rain: garfieldAdmission.rain,
        nap: "High",
        summary: garfieldAdmission.summary,
      },
      {
        name: "Chicago lakefront and beach time",
        tags: ["baby", "toddler", "preschool", "elementary", "tween", "teen", "stroller", "budget"],
        age: "All ages",
        time: "1-3 hrs",
        cost: "Free",
        area: "Lakefront",
        stroller: "Route-specific",
        rain: "No",
        nap: "High",
        summary: "Keep this flexible and choose the exact beach or path only after checking season, weather, swim status, and facilities.",
      },
    ],
    compactDetails: true,
    comparisonNote: "Family of 4 estimate: 2 adults, kids 4 and 8, tickets only, visitor prices read Nov 2, 2026 (Garfield Oct 13). Other labels are editorial estimates, not venue guarantees. Swipe sideways for more.",
    quickEyebrow: "Choose a trip shape",
    quickTitle: "Five useful ways to start",
    quickNote: "These are starting routes, not universal rankings. Choose by child interest, age mix, weather, budget, and how much museum time the family actually enjoys.",
    quick: [
      ["First-time mixed ages", "Millennium Park plus one major anchor", "Use the parks for city context, then choose Field, Shedd or the Art Institute by interest instead of stacking them (the river cruise is advised for 12+)."],
      ["Younger child or easy exit", "Chicago Children's Museum or Lincoln Park Zoo", "Both support a shorter day; choose indoor hands-on play or a flexible outdoor animal stop."],
      ["Rain or budget", "Shedd or the Children's Museum indoors; Lincoln Park Zoo free", "Pick one by your child's age and keep the backup nearby instead of rebuilding the whole day."],
      ["Older kids and teens", "Architecture cruise, Art Institute, or 360 CHICAGO", "Let older children choose between city story, art, or skyline rather than defaulting to younger-child pacing."],
      ["Lodging-led trip", "Choose the stay base before the final activity order", "The Loop, River North, Lincoln Park, Museum Campus routes, and Hyde Park create different reset and transport patterns."]
    ],
    rows: [
      ["Field Museum", "6+", "3-5 hrs", "From ≈ $120\n$30 a person; no child price shown; under 3 free", "Museum Campus", "Good", "Yes", "Medium", "Check tickets/exhibits", "Large natural-history anchor", "Lakefront reset"],
      ["Shedd Aquarium", "2-12", "2-4 hrs", "Paid: check live\nNo visitor price on official pages Nov 2; varies by date", "Museum Campus", "Good", "Yes", "Medium", "Timed tickets helpful", "Focused animal and science day", "Museum Campus lawn"],
      ["Griffin Museum of Science and Industry", "4+", "4-6 hrs", "Paid: check live\nNo readable price on the official page Nov 2; parking and add-ons extra", "Hyde Park", "Good", "Yes", "Low", "Check add-ons", "Hands-on, full-day science choice", "Hyde Park meal"],
      ["Adler Planetarium", "6+", "2-4 hrs", "From ≈ $76\nFrom $25 adult, $13 child; child ages not stated; dome show extra", "Museum Campus", "Good", "Yes", "Medium", "Check shows", "Space-led museum choice", "Lakefront view"],
      ["Lincoln Park Zoo", "0-12", "2-3 hrs", "Free\nNo general ticket", "Lincoln Park", "Good", "Partial", "High", "No general ticket", "Flexible animal stop", "Nature Boardwalk"],
      ["Millennium Park and Maggie Daley Park", "2-12", "1-3 hrs", "Free\nPublic parks", "Loop", "Good", "No", "Medium", "Check events", "City context plus movement", "Art Institute"],
      ["Chicago Architecture Center river cruise", "12+ advised by the operator", "90 min", "From ≈ $228\n$57 a person; everyone needs a ticket; kids 4 and 8 are under the advised age; 2026 season listed to Nov 22", "River North", "Check operator", "Weather-dependent", "Low", "Book/check season", "Chicago story from the river", "Riverwalk meal"],
      ["Chicago Children's Museum", "1-9", "2-3 hrs", "≈ $100\n$25 a person, ages 1+; under 1 free; Illinois residents $21; closed Tuesday", "Navy Pier", "Good", "Yes", "High", "Check entry window", "Hands-on younger-child anchor", "Short lakefront walk"],
      ["Art Institute of Chicago", "6+", "90 min-3 hrs", "≈ $64\n$32 adult, under 14 free; some exhibitions extra; residents pay less", "Loop", "Good", "Yes", "Medium", "Check admission", "Short art route with family resources", "Millennium Park"],
      ["360 CHICAGO", "6+", "60-90 min", "From ≈ $92\nFrom $27 ages 12+, $19 ages 3-11, tax included; varies by day and time", "Magnificent Mile", "Check venue", "Yes; views vary", "Medium", "Check visibility/TILT", "Contained skyline choice", "Streeterville meal"],
      ["Garfield Park Conservatory", "All ages", "1-2 hrs", garfieldAdmission.familyCost, "Garfield Park", "Good", garfieldAdmission.rain, "High", garfieldAdmission.booking, "Calmer greenhouse reset", "Keep the route simple"],
      ["Chicago lakefront and beach time", "All ages", "1-3 hrs", "Free\nPublic lakefront", "Lakefront", "Route-specific", "No", "High", "Check season/status", "Flexible outdoor recovery time", "Nearby neighborhood meal"]
    ],
    detailsEyebrow: "High-friction choices",
    detailsTitle: "Six choices that need an extra check",
    detailsNote: "The comparison table covers all 12. These six get extra space because size, timed entry, travel, weather, optional add-ons, or current conditions can materially change the family plan.",
    details: [
      ["Field Museum", "The scale and major natural-history exhibits can justify a full family museum block.", "Best for school-age children through teens who have one or two exhibit interests.", "Museum fatigue and the temptation to add Shedd or Adler as another full stop.", "Choose priorities before arrival and stop while the experience is still working.", "Plan the meal and bathroom break inside or immediately after the museum.", "Check current admission, exhibitions, and family resources.", "Pair with outdoor lakefront time, not another full museum."],
      ["Shedd Aquarium", "The animal focus works across a broad age range and provides a substantial indoor anchor.", "Best for younger children through tweens when crowds and timed entry fit the day.", "Busy galleries, ticket timing, and trying to complete every habitat or presentation.", "Buy for the intended window and decide the family's highest-interest zones first.", "Plan food, stroller handling, and the exit before everyone is tired.", "Recheck current tickets, hours, experiences, and accessibility details.", "Pair with one short Museum Campus outdoor reset."],
      ["Griffin Museum of Science and Industry", "Hands-on exhibits can hold children who prefer machines, experiments, and movement to traditional display cases.", "Best for preschoolers through teens, with different exhibit priorities by age.", "The museum is large, Hyde Park changes the route, and add-on experiences can fragment time and budget.", "Treat it as the day's anchor and choose any ticketed add-on before arrival.", "Build in a real meal and sitting break rather than trying to see every hall.", "Check current admission, exhibit availability, add-on tickets, and transport.", "Pair with a nearby meal or quiet evening."],
      ["Chicago Architecture Center river cruise", "The 90-minute cruise gives older children a clear Chicago story while the city moves around them.", "The operator does not recommend it under age 12; best for older kids who can sit and listen for the full trip.", "Weather exposure, a fixed departure, infant ticket rules, and a child who loses interest on the boat.", "Choose the departure around food and energy, arrive early, and review the operator's current accessibility details.", "Use bathrooms before boarding and keep the next meal near the Riverwalk.", "The official season is generally March through November; verify exact dates, tickets, weather policy, and departure point.", "Pair with one Riverwalk meal or short walk."],
      ["360 CHICAGO", "It is a contained skyline stop that can fit between meals or a Magnificent Mile route.", "Best for school-age children through teens who value the view.", "Low visibility, paying for a short visit, or treating optional TILT as part of every ticket.", "Check conditions and current ticket choices before committing.", "Use it as a short viewpoint, not a reason to add multiple observation decks.", "Verify current hours, visibility, ticket terms, and TILT rules.", "Pair with a nearby meal or hotel reset."],
      ["Chicago lakefront and beach time", "Open space can provide the flexible recovery block that museum-heavy trips need.", "Useful across ages when the exact path or beach fits weather, mobility, and water comfort.", "Assuming every beach is equally suitable, open, staffed, swimmable, or easy with a stroller.", "Choose the exact location only after checking current Chicago Park District conditions and facilities.", "Bring the family's needed shade, water, food, and exit plan rather than relying on an unknown beach setup.", "Check swim season, weather, daily water-quality status, and current beach notices.", "Pair with the closest neighborhood meal, not a cross-city attraction."]
    ],
    clusterTitle: "Move from the shortlist to the stay base and route",
    clusterLinks: [
      ["Where to stay in Chicago", "Choose the lodging base before finalizing activities. Museum Campus, Loop, River North, Lincoln Park, and Hyde Park routes create different transit and reset patterns.", "../where-to-stay/chicago-with-kids.html", "Open where to stay in Chicago with kids"],
      ["Chicago family itinerary", "Turn one anchor, one flexible reset, meals, and weather backups into a realistic route instead of a museum checklist.", "../family-itinerary/chicago-with-kids.html", "Open the Chicago family itinerary"],
      ["Chicago with teens", "Use the teen guide when architecture, art, food, skyline views, and older-child pacing matter more than younger-child play.", "./chicago-with-teens.html", "Open Chicago with teens"]
    ],
    officialChecksEyebrow: "Before locking the day",
    officialChecksTitle: "Three checks that can change the shortlist",
    officialChecks: [
      ["Tickets and large museums", "Timed entry, special exhibits, shows, and add-ons vary. Pick the exact museum first and check its current admission and calendar before treating Museum Campus or Hyde Park as a complete plan.", [["https://www.fieldmuseum.org/landing/visiting-with-kids", "Field Museum with kids"], ["https://www.sheddaquarium.org/plan-a-visit", "Shedd plan a visit"], ["https://www.griffinmsi.org/", "Griffin Museum of Science and Industry"]]],
      ["Younger-child and lower-cost day", "Lincoln Park Zoo has free general admission; Art Institute admission is free for children under 14; Garfield Park Conservatory's current model differs for Chicago residents and other visitors. Recheck before promising a free day.", [["https://www.lpzoo.org/visit/", "Lincoln Park Zoo visit"], ["https://www.artic.edu/learn-with-us/families", "Art Institute families"], ["https://garfieldconservatory.org/visit/", "Garfield Park Conservatory visit"]]],
      ["Season, weather, and water", "River cruises, beach swimming, and skyline views change with season and weather. Check the exact cruise, beach dashboard, and visibility near the visit.", [["https://www.architecture.org/city-tours/river-cruise", "Chicago Architecture Center river cruise"], ["https://www.chicagoparkdistrict.com/beaches", "Chicago Park District beaches"], ["https://www.chicagoparkdistrict.com/beach-dashboard", "Chicago beach swim-status dashboard"]]]
    ],
    visibleFaqs: true,
    faqs: [
      ["What are the best things to do in Chicago with kids?", "For kids under 6, start with Chicago Children's Museum or Lincoln Park Zoo. By interest: Shedd for aquatic animals, Field for natural history, Griffin MSI for hands-on science, and an architecture cruise or Art Institute for many older children."],
      ["What can families do for free in Chicago?", "Lincoln Park Zoo and the public parks are the clearest free choices. Children under 14 receive free Art Institute admission, while Garfield Park Conservatory has current resident and nonresident rules to verify. Transport, parking, food, and seasonal conditions still affect the day."],
      ["What is a useful rainy-day activity in Chicago with kids?", "Choose one substantial indoor anchor by interest: Shedd, Field, Griffin MSI, Adler, Art Institute, or Chicago Children's Museum. Indoor does not always mean low-crowd or low-walking, so keep the rest of the route light."]
    ],
    sourcesIntro: "Ticket prices read November 2, 2026 (Garfield Park October 13); other official attraction and city sources checked July 23, 2026. Recheck tickets, hours, exhibitions, weather, water conditions, and operating details for the exact visit date.",
    sources: [
      ["Field Museum with kids", "https://www.fieldmuseum.org/landing/visiting-with-kids"],
      ["Field Museum tickets and pricing", "https://www.fieldmuseum.org/landing/tickets-and-pricing"],
      ["Shedd Aquarium plan-ahead pricing", "https://www.sheddaquarium.org/plan-a-visit/plan-ahead-pricing"],
      ["Griffin MSI ticket pricing", "https://www.griffinmsi.org/pricing"],
      ["Art Institute admission", "https://www.artic.edu/visit"],
      ["360 CHICAGO hours and pricing", "https://360chicago.com/hours-pricing"],
      ["Chicago Architecture Center river cruise FAQ", "https://www.architecture.org/faq/river-cruise"],
      ["Shedd Aquarium plan a visit", "https://www.sheddaquarium.org/plan-a-visit"],
      ["Griffin Museum of Science and Industry", "https://www.griffinmsi.org/"],
      ["Adler Planetarium tickets", "https://www.adlerplanetarium.org/tickets/"],
      ["Lincoln Park Zoo visit", "https://www.lpzoo.org/visit/"],
      ["Maggie Daley Park Play Garden", "https://www.maggiedaleypark.com/things-to-do-see/play-garden/"],
      ["Chicago Architecture Center river cruise", "https://www.architecture.org/city-tours/river-cruise"],
      ["Chicago Children's Museum hours, tickets, and FAQ", "https://www.chicagochildrensmuseum.org/hours-tickets-and-faq"],
      ["Art Institute family resources", "https://www.artic.edu/learn-with-us/families"],
      ["360 CHICAGO with kids", "https://360chicago.com/things-to-do/visiting-360-chicago-with-kids"],
      ["Garfield Park Conservatory visit", "https://garfieldconservatory.org/visit/"],
      ["Chicago Park District beaches", "https://www.chicagoparkdistrict.com/beaches"],
      ["Chicago beach swim-status dashboard", "https://www.chicagoparkdistrict.com/beach-dashboard"],
      ["Shedd Aquarium penguin photo source and license", "https://commons.wikimedia.org/wiki/File:Chicago_-_Shedd_aquarium_(2379489501).jpg"]
    ]
  },
  "things-to-do/las-vegas-with-kids.html": {
    title: "Things to Do in Las Vegas With Kids: 12 Picks by Trip Style",
    description:
      "Compare 12 things to do in Las Vegas with kids by age, heat and indoor fit, cost, time, location, and trip style, with current official-source checks.",
    city: "Las Vegas",
    hideDetails: true,
    hidePlans: true,
    baseReplacements: [
      ["<p><strong>Last updated:</strong> July 22, 2026</p>", "<p><strong>Attraction prices and official sources checked:</strong> August 3, 2026</p>"],
      ["<p><strong>Source note:</strong> Official venue links are below. Age fit, duration, cost, stroller, weather, nap, booking, and value labels are Family Tripwise editorial estimates; recheck current attraction rules, hours, prices, and conditions before going.</p>", "<p><strong>Source note:</strong> Admission figures use current official pages and the named reference family where a stable total is available. Time and family-fit fields are planning estimates. Recheck the exact date, ticket tier, rules, and conditions before paying.</p>"]
    ],
    comparisonNote: "Approximate family admission uses one reference group: two adults and two children ages 6 and 10, admission only. It excludes transport, parking, meals, optional add-ons, hotel cost, and tax unless a row says otherwise. VARIABLE / VERIFY means the official source did not support one stable current total for that family. Time and fit are Family Tripwise planning estimates, not venue guarantees.",
    quickEyebrow: "Choose a trip shape",
    quickTitle: "Three useful ways to start",
    quickNote: "Choose one anchor, then use the table for cost and the exact check that could change the plan.",
    quick: [
      ["First Vegas trip", "Bellagio plus one paid anchor", "Use the Conservatory and fountains as the short classic stop, then choose one museum, aquarium, ride, show, or skyline experience."],
      ["Younger kids or high heat", "DISCOVERY, Shark Reef, or Adventuredome", "Choose by child interest and height or sensory fit; do not stack all three."],
      ["Older-kid contrast", "AREA15, Red Rock, Neon Museum, or Tournament of Kings", "Let older kids choose one anchor, then verify weather, effects, ticket tier, and the return to the hotel."]
    ],
    costFrictionConfig: {
      id: "las-vegas-attraction-cost-friction",
      eyebrow: "Compare the real planning friction",
      title: "12 Las Vegas family choices: cost, time, and what to verify",
      ariaLabel: "Las Vegas family attraction cost and planning comparison",
      downloadFilename: "las-vegas-family-attraction-cost-friction-2026-08-03.csv"
    },
    costFrictionIndex: [
      {
        name: "Resort pool / reset block",
        zone: "Your booked hotel",
        setting: "Property-specific; usually outdoor",
        timeEstimate: "2-4 hrs",
        familyAdmissionEstimate: "VARIABLE / VERIFY",
        costBasis: "Access, season, and guest eligibility depend on the exact hotel; Mandalay Bay is a representative official pool check, not a citywide promise.",
        inclusions: "Only access explicitly included with the booked room.",
        exclusions: "Room cost, cabana, food, parking, and paid day access.",
        currentCheck: "Confirm guest eligibility, operating dates, pool closures, and child height rules on the booked property's page.",
        evidenceClass: "Official representative property page plus editorial scenario",
        confidence: "Medium",
        unknowns: "The booked property, season, pool access, shade, and incremental charge.",
        checked: "2026-08-03",
        officialUrl: "https://mandalaybay.mgmresorts.com/en/amenities/beach.html"
      },
      {
        name: "Bellagio Conservatory and fountains",
        zone: "Center Strip",
        setting: "Indoor conservatory plus outdoor fountains",
        timeEstimate: "60-90 min",
        familyAdmissionEstimate: "$0 admission",
        costBasis: "The fountains are officially free; the Conservatory publishes seasonal show and dark dates without an admission ticket.",
        inclusions: "Conservatory walk-through and fountain viewing.",
        exclusions: "Parking, transport, food, and the optional Garden Table.",
        currentCheck: "Check Conservatory dark dates and the current fountain schedule before routing across the resort.",
        evidenceClass: "Official property pages",
        confidence: "High",
        unknowns: "Crowd level, walking route, and whether weather alters the fountain schedule.",
        checked: "2026-08-03",
        officialUrl: "https://bellagio.mgmresorts.com/en/entertainment/conservatory-botanical-garden.html"
      },
      {
        name: "DISCOVERY Children's Museum",
        zone: "Downtown",
        setting: "Indoor children's museum",
        timeEstimate: "2-3 hrs",
        familyAdmissionEstimate: "$80",
        costBasis: "$20 general admission for each non-local visitor age 1 and older.",
        inclusions: "Four general-admission tickets.",
        exclusions: "Parking, transport, food, special programs, and local discounts.",
        currentCheck: "Check the operating calendar and any exhibit or program changes for the visit date.",
        evidenceClass: "Official ticket page",
        confidence: "High",
        unknowns: "Crowding, current exhibit fit, and time needed for this family's pace.",
        checked: "2026-08-03",
        officialUrl: "https://discoverykidslv.org/visit/buy-tickets/"
      },
      {
        name: "Shark Reef Aquarium",
        zone: "South Strip",
        setting: "Indoor aquarium and included VR experience",
        timeEstimate: "90 min-2 hrs",
        familyAdmissionEstimate: "$106-$134",
        costBasis: "Two adults and two children ages 5-12 at current timed-entry versus anytime prices.",
        inclusions: "Aquarium and Undersea Explorer VR package for four.",
        exclusions: "Parking, transport, food, animal encounters, and other add-ons.",
        currentCheck: "Choose timed or anytime entry; peak timed slots can sell out and the youngest VR rules differ.",
        evidenceClass: "Official attraction pricing page",
        confidence: "High",
        unknowns: "Selected entry tier, sellout risk, and whether every child wants the VR component.",
        checked: "2026-08-03",
        officialUrl: "https://mandalaybay.mgmresorts.com/en/entertainment/shark-reef-aquarium.html"
      },
      {
        name: "Adventuredome",
        zone: "North Strip",
        setting: "Indoor amusement park",
        timeEstimate: "2-4 hrs",
        familyAdmissionEstimate: "VARIABLE / VERIFY",
        costBasis: "The official attraction page exposes ride and height rules but did not expose one stable current family pass total in this check.",
        inclusions: "Only the exact pass or ride product selected at checkout.",
        exclusions: "Arcade, midway games, food, parking, and separately priced experiences unless the pass says otherwise.",
        currentCheck: "Measure each child, compare the eligible ride set, then check current passes and ride closures before paying.",
        evidenceClass: "Official operational page; checkout price unresolved",
        confidence: "Medium",
        unknowns: "Current pass total, eligible rides by height, closures, and sensory fit.",
        checked: "2026-08-03",
        officialUrl: "https://www.circuscircus.com/attractions/adventuredome/"
      },
      {
        name: "Springs Preserve",
        zone: "West of Downtown",
        setting: "Indoor museums plus outdoor gardens and trails",
        timeEstimate: "2-4 hrs",
        familyAdmissionEstimate: "$59.80",
        costBasis: "Non-resident admission: $18.95 per adult and $10.95 per child ages 3-17.",
        inclusions: "Four general-admission tickets and the attractions included by that ticket.",
        exclusions: "Special events, classes, rentals, transport, and food.",
        currentCheck: "Reserve ahead for busy dates and check heat-related early closures of outdoor areas.",
        evidenceClass: "Official ticket page",
        confidence: "High",
        unknowns: "Outdoor-area availability, seasonal exhibits, and special-event overlays.",
        checked: "2026-08-03",
        officialUrl: "https://www.springspreserve.org/visitor-information/tickets.html"
      },
      {
        name: "High Roller observation wheel",
        zone: "LINQ / Center Strip",
        setting: "Enclosed observation-wheel cabin",
        timeEstimate: "45-60 min",
        familyAdmissionEstimate: "VARIABLE / VERIFY",
        costBasis: "Caesars ticket products and day or evening tiers are date-sensitive; no stable current four-person total was exposed in the official page check.",
        inclusions: "Only the exact observation-wheel ticket selected.",
        exclusions: "Parking, transport, food, photos, upgrades, and 21+ packages.",
        currentCheck: "Price the exact date and time, then confirm child, stroller, and arrival rules before crossing the resort corridor.",
        evidenceClass: "Official operator page; checkout price unresolved",
        confidence: "Medium",
        unknowns: "Current ticket tier, child price, fees, and stroller handling.",
        checked: "2026-08-03",
        officialUrl: "https://www.caesars.com/linq/things-to-do/attractions/high-roller"
      },
      {
        name: "AREA15 / selected exhibit",
        zone: "Off Strip",
        setting: "Indoor immersive exhibit; Omega Mart reference",
        timeEstimate: "2-3 hrs",
        familyAdmissionEstimate: "From $180",
        costBasis: "Omega Mart starts at $45 a ticket (no child price shown when read November 1, 2026); other AREA15 exhibits are different products.",
        inclusions: "Four base Omega Mart timed-entry tickets at advertised starting prices.",
        exclusions: "Fees, parking or transport, food, access cards, VIP, other exhibits, and add-ons.",
        currentCheck: "Choose the exact exhibit first; verify its age, sensory, timed-entry, late-arrival, and re-entry rules.",
        evidenceClass: "Official exhibit ticket page",
        confidence: "High for Omega Mart; low for unselected exhibits",
        unknowns: "Visit date price, exact exhibit, fees, add-ons, and individual sensory fit.",
        checked: "2026-11-01",
        officialUrl: "https://tickets.meowwolf.com/las-vegas/admission/timed-tickets/"
      },
      {
        name: "Red Rock Canyon Scenic Drive",
        zone: "West of Strip",
        setting: "Outdoor 13-mile scenic drive with optional stops",
        timeEstimate: "3-5 hrs from a Strip base",
        familyAdmissionEstimate: "$20-$22 per vehicle",
        costBasis: "$20 private-vehicle entry; add the $2 timed-entry reservation fee when required October 1-May 31, 8 a.m.-5 p.m.",
        inclusions: "One private vehicle and the seasonal reservation fee when applicable.",
        exclusions: "Rental car, fuel, tours, food, gear, and any annual pass.",
        currentCheck: "Reserve the Scenic Drive in season and check heat, weather, closures, water, and the exact stop plan.",
        evidenceClass: "Official BLM and Recreation.gov pages",
        confidence: "High",
        unknowns: "Weather, parking at desired stops, trail fit, and car cost.",
        checked: "2026-08-03",
        officialUrl: "https://www.blm.gov/programs/national-conservation-lands/nevada/red-rock-canyon-national-conservation-area/planning-your-visit"
      },
      {
        name: "Pinball Hall of Fame",
        zone: "South Strip",
        setting: "Indoor pay-per-play arcade museum",
        timeEstimate: "60-120 min",
        familyAdmissionEstimate: "$0 admission; choose a play budget",
        costBasis: "The official site says entrance is free; machine spend is optional and family-controlled.",
        inclusions: "Entry for four.",
        exclusions: "Game play, transport, parking, food, and any machine-specific cost.",
        currentCheck: "Set a game budget before arrival and expect individual machines to vary or be unavailable.",
        evidenceClass: "Official venue page plus editorial budget prompt",
        confidence: "High for admission; medium for spend planning",
        unknowns: "Chosen play budget, machine availability, and how long the family wants to stay.",
        checked: "2026-08-03",
        officialUrl: "https://pinballmuseum.org/direct.php"
      },
      {
        name: "Tournament of Kings",
        zone: "South Strip / Excalibur",
        setting: "Indoor dinner show with horses and theatrical effects",
        timeEstimate: "2-3 hrs including arrival",
        familyAdmissionEstimate: "From $297.60 plus tax",
        costBasis: "Four tickets at the official $74.40 starting total per ticket; children 4 and older pay full price.",
        inclusions: "Four starting-tier show tickets, service fee, and the published dinner.",
        exclusions: "Tax, premium seats, parking, transport, drinks, photos, and dietary substitutions.",
        currentCheck: "Check the exact performance, final checkout total, meal, seating, and horse, dust, pyrotechnic, strobe, smoke, and fog warnings.",
        evidenceClass: "Official show and pricing page",
        confidence: "High for starting price; medium for final date total",
        unknowns: "Date, seat tier, tax, availability, dietary fit, and effects tolerance.",
        checked: "2026-08-03",
        officialUrl: "https://excalibur.mgmresorts.com/en/entertainment/tournament-of-kings.html"
      },
      {
        name: "Neon Museum",
        zone: "Downtown",
        setting: "Outdoor museum with timed admission",
        timeEstimate: "60-90 min",
        familyAdmissionEstimate: "VARIABLE / VERIFY",
        costBasis: "The known September-May daytime subtotal is $62.50 for two adults and the age-10 child; the official age bands omit age 6 and a processing fee applies.",
        inclusions: "Published base admission for two adults and the age-10 child; add the confirmed age-6 ticket.",
        exclusions: "Processing fee, the unresolved age-6 ticket, evening admission, parking, transport, food, tours, and photo products.",
        currentCheck: "Daytime admission is unavailable June-August. For September-May, confirm the age-6 ticket and final processing fee before choosing a timed slot.",
        evidenceClass: "Official daytime admission page",
        confidence: "High for season and published tiers; unresolved for the age-6 total",
        unknowns: "Age-6 ticket price, processing fee, selected date, weather, and final availability.",
        checked: "2026-08-03",
        officialUrl: "https://neonmuseum.org/whats-on/365-daytime-admission/"
      }
    ],
    clusterTitle: "Move from the shortlist to the stay base and route",
    clusterLinks: [
      ["Where to stay in Las Vegas", "Choose the hotel base before finalizing activities. Pool setup, smoke exposure, resort walking, fees, and room location can change the whole family plan.", "../where-to-stay/las-vegas-with-kids.html", "Open where to stay in Las Vegas with kids"],
      ["Family hotels in Las Vegas", "Compare named hotels by pool role, room setup, smoke and walking friction, rough nightly total, and the activity zone each property supports.", "../where-to-stay/las-vegas-family-hotels.html", "Compare Las Vegas family hotels"],
      ["Las Vegas family itinerary", "Turn pool time, one classic visual stop, and age-specific anchors into a realistic route instead of a Strip marathon.", "../family-itinerary/las-vegas-with-kids.html", "Open the Las Vegas family itinerary"],
      ["Las Vegas with teens", "Use the teen guide when Red Rock, immersive exhibits, shows, food, and later evenings matter more than toddler pacing.", "../things-to-do/las-vegas-with-teens.html", "Open Las Vegas with teens"]
    ],
    visibleFaqs: true,
    faqs: [
      ["Is Las Vegas good for kids?", "It can work when the family chooses an age-fit anchor, verifies the hotel and pool setup, limits resort-to-resort walking, and protects time for heat, meals, and recovery."],
      ["What can families do for free in Las Vegas?", "The Bellagio Conservatory and fountains are the clearest short free choice in this set. A low-ticket day can add Pinball Hall of Fame, but transport, parking, meals, and game spend still matter."],
      ["What is a useful indoor or heat backup in Las Vegas?", "For younger kids, compare DISCOVERY Children's Museum, Shark Reef, and height-appropriate Adventuredome rides. For older kids, compare an exact AREA15 exhibit or a show after checking sensory fit and current rules."]
    ],
    sourcesIntro: "Official attraction and ticket sources checked August 3, 2026. Prices use the named reference family and are not booking quotes. Recheck the exact date, ticket tier, taxes, fees, height rules, closures, weather, effects, and hotel access before paying.",
    sources: [
      ["Mandalay Bay Beach", "https://mandalaybay.mgmresorts.com/en/amenities/beach.html"],
      ["Bellagio Conservatory", "https://bellagio.mgmresorts.com/en/entertainment/conservatory-botanical-garden.html"],
      ["Fountains of Bellagio", "https://bellagio.mgmresorts.com/en/entertainment/fountains-of-bellagio.html"],
      ["DISCOVERY Children's Museum tickets", "https://discoverykidslv.org/visit/buy-tickets/"],
      ["Shark Reef Aquarium", "https://mandalaybay.mgmresorts.com/en/entertainment/shark-reef-aquarium.html"],
      ["Adventuredome", "https://www.circuscircus.com/attractions/adventuredome/"],
      ["Springs Preserve tickets", "https://www.springspreserve.org/visitor-information/tickets.html"],
      ["High Roller", "https://www.caesars.com/linq/things-to-do/attractions/high-roller"],
      ["Omega Mart tickets", "https://meowwolf.com/visit/las-vegas/tickets"],
      ["Red Rock Canyon visit planning", "https://www.blm.gov/programs/national-conservation-lands/nevada/red-rock-canyon-national-conservation-area/planning-your-visit"],
      ["Red Rock Canyon timed entry", "https://www.recreation.gov/timed-entry/10075177/ticket/10075178"],
      ["Pinball Hall of Fame", "https://pinballmuseum.org/direct.php"],
      ["Tournament of Kings", "https://excalibur.mgmresorts.com/en/entertainment/tournament-of-kings.html"],
      ["Neon Museum daytime admission", "https://neonmuseum.org/whats-on/365-daytime-admission/"]
    ]
  },
  "things-to-do/san-diego-with-toddlers.html": {
    heroPhoto: "san-diego-mission-bay",
    dropLowerPhoto: true,
    plansFirst: true,
    plansId: "sdt-activity-plans",
    plansTitle: "A 3-day plan built around naps",
    frontComparisonExtraLink: ["#sdt-activity-plans", "3-day nap plan"],
    frontComparison: true,
    frontComparisonPrefix: "sdt",
    frontComparisonClass: "sd-teen-glance sd-toddler-glance",
    baseReplacements: [
      ["<h1>Things to do in San Diego with toddlers</h1>", "<h1>Things to Do in San Diego With Toddlers: Naps, Strollers, Beaches and Short Stops</h1>"],
      ["<p>Compare short-session activities by nap timing, stroller and bathroom logistics, weather backup, and how easily the family can leave.</p>", "<p>One short outing each morning, then a nap. Family of 4 (2 adults, kids 3 and 5), tickets-only estimate: Mission Bay free · Children's Museum ≈ $90 · San Diego Zoo ≈ $292.</p>"],
      ["<strong>Source note:</strong> Official venue links are below. Age, duration, access, nap, and route labels are Family Tripwise planning estimates; confirm current conditions before going.", "<strong>Source note:</strong> Official links are below. Stroller, nap and route notes are our planning estimates."],
      ["<p><strong>Last updated:</strong> July 20, 2026</p>", "<p><strong>Ticket prices checked:</strong> November 1, 2026 <span aria-hidden=\"true\">·</span> <strong>Free-entry and venue facts checked:</strong> July 31, 2026 (Coronado beach July 13)</p>"]
    ],
    title: "Things to Do in San Diego With Toddlers: Naps, Strollers, Beaches and Short Stops",
    clusterEyebrow: "Next steps",
    clusterTitle: "Where to stay and a day-by-day plan",
    description:
      "Plan San Diego with toddlers using short-session activities, stroller notes, nap-friendly timing, bathroom/reset planning, beach choices, and rainy-day options.",
    city: "San Diego",
    sources: [
      ["San Diego Zoo tickets", "https://zoo.sandiegozoo.org/tickets"],
      ["San Diego Zoo plan your visit", "https://zoo.sandiegozoo.org/plan-your-visit"],
      ["Birch Aquarium plan your visit", "https://aquarium.ucsd.edu/plan-your-visit"],
      ["The New Children's Museum visit", "https://thinkplaycreate.org/visit/"],
      ["Fleet Science Center hours and admission", "https://www.fleetscience.org/hours-admission"],
      ["Balboa Park visitor info", "https://balboapark.org/plan-your-visit/"],
      ["City of San Diego: Mission Bay Park", "https://www.sandiego.gov/park-and-recreation/parks/regional/missionbay"],
      ["City of Coronado: Coronado Beach", "https://www.coronado.ca.us/244/Coronado-Beach"],
      ["Flagship Coronado ferry routes and schedules (operator)", "https://www.flagshipsd.com/cruises/flagship-ferry"],
      ["San Diego County beach and bay status", "https://www.sandiegocounty.gov/content/sdc/deh/lwqd/beachandbay.html"],
      ["Photo license and attribution", "https://commons.wikimedia.org/wiki/File:21a-san-diego-mission-bay.jpg"]
    ],
    compactDetails: true,
    collapseDetailCards: true,
    comparisonNote: "Family-of-4 figures (2 adults, kids 3 and 5) are ticket-only estimates from official prices. Other fields are Family Tripwise editorial estimates, not venue guarantees.",
    comparisonCostNote: "On a phone: swipe the table for stroller, rain and nap.",
    comparisonClass: "teen-comparison ds-table sd-teen-ds sd-toddler-ds",
    comparisonHeaders: ["Activity", "Family of 4 cost", "Best ages", "Time", "Stroller", "OK in rain?", "Easy around a nap?", "Area"],
    quick: [
      ["Easiest morning", "Mission Bay", "Sand and water at one bayfront spot, then leave before lunch."],
      ["Best animal stop", "San Diego Zoo bus tour", "Use the bus and a few zones, not the whole zoo."],
      ["Best rainy-day option", "The New Children's Museum or Birch Aquarium", "Hands-on and indoor Downtown (closed Tuesdays), or small and easy to shorten in La Jolla."],
      ["Best if you only have one day", "Zoo bus tour, then a hotel nap", "The biggest toddler payoff, with the afternoon kept free for rest and the pool."]
    ],
    rows: [
      ["Mission Bay", "Free\nNo ticket; check parking", "0-4", "2-3 hrs", "Mixed", "No", "Yes", "Mission Bay"],
      ["San Diego Zoo bus tour", "≈ $292\n$78 ages 12+, $68 ages 3-11; from ≈ $272 on select online Value Days. Check the bus is included", "2-4", "2-4 hrs", "Moderate: steep grades", "No", "Mostly", "Balboa Park"],
      ["Birch Aquarium", "≈ $130 online\n$34.95 ages 13+, $29.95 ages 3-12; walk-up ≈ $150; limited free 3-hour parking", "1-5", "90 min", "Good", "Partial", "Yes", "La Jolla"],
      ["The New Children's Museum", "≈ $90\n$25 adults, $20 kids 1+; under 1 free. Closed Tuesdays", "1-5", "2-3 hrs", "Good", "Yes", "Yes, in a morning", "Downtown"],
      ["Balboa Park playground / gardens", "Free park\nCheck any garden fee. Fleet Science Center ≈ $110 ($29.95 ages 13+, $24.95 ages 3-12)", "1-5", "60-90 min", "Good", "Partial", "Yes", "Balboa Park"],
      ["Coronado beach walk", "No ticket found\nPublic beach; ferry from ≈ $72 round trip ($9 a person one way)", "2-5", "1-2 hrs", "Mixed", "No", "Mostly", "Coronado"]
    ],
    itemDescriptions: [
      "Flexible beach morning",
      "Animal payoff without walking every zone",
      "Short indoor/outdoor stop",
      "Hands-on indoor stop Downtown",
      "Low-cost reset",
      "Calmer vacation-feel outing"
    ],
    details: [
      ["Mission Bay", "Toddlers get open-ended sand and water play without a fixed attraction schedule.", "Best for babies through preschoolers when adults verify the exact bayfront spot.", "Gear load, sun, water conditions, and sandy stroller frustration.", "Arrive early, keep the session short, and leave before lunch pressure builds.", "Use your hotel or beach facilities as the bathroom plan.", "Check beach status, parking and shade.", "A nap and pool rather than another major attraction."],
      ["San Diego Zoo bus tour", "Toddlers get animal payoff without walking every path.", "Best for toddlers who can handle a bus ride and short viewing stops.", "The zoo is too big if adults chase completion.", "Start with the bus tour, then choose one animal zone.", "Food/restrooms are inside, but do not wait until urgent.", "Buy ahead in busy periods.", "A playground or hotel reset."],
      ["Birch Aquarium", "Toddlers like the tanks and manageable size.", "Best for toddlers and preschoolers.", "It may be over quickly, which is fine if planned as a short stop.", "Plan on about 90 minutes.", "Verify food/restroom setup for the day.", "Check ticket windows.", "La Jolla Shores, not a long Cove hike."],
      ["The New Children's Museum", "Hands-on installations give younger children an indoor stop Downtown.", "Best for toddlers through early elementary kids.", "Weekly hours or event closures can change; closed Tuesdays when read November 1.", "Use it for a morning, then leave for lunch and a nap.", "Plan lunch nearby and check restrooms and stroller rules on arrival.", "Check hours and closures.", "A hotel nap rather than another attraction."],
      ["Balboa Park playground / gardens", "Toddlers get movement without a full paid attraction.", "Best for toddlers who need a reset.", "The park can sprawl if you wander without a plan.", "Choose one playground/garden area and stop.", "Check restrooms nearby.", "No booking.", "The zoo bus tour or one short museum."],
      ["Coronado beach walk", "Toddlers like the simpler beach-town pace.", "Best for older toddlers and preschoolers.", "Bridge/ferry logistics can add friction.", "Use it when you want a calmer half day.", "Plan snacks and bathrooms before beach time.", "Check ferry timing (no child fare shown when read) or parking if driving.", "An early dinner or ferry ride."]
    ],
    plans: {
      "1-day plan": "Zoo bus tour early, one animal zone, hotel nap, then the pool.",
      "3-day plan": "Day 1: Mission Bay morning, nap, pool.\nDay 2: zoo bus tour and one animal zone, nap.\nDay 3: The New Children's Museum (not Tuesdays) or Birch Aquarium, nap.\nTickets ≈ $382 with the museum, ≈ $422 with Birch instead of the museum.",
      "Rainy-day plan": "The New Children's Museum or Birch Aquarium, short meal, hotel reset. Add one Balboa Park museum only if your toddler still has capacity."
    },
    faqs: [
      ["What works well in San Diego with toddlers?", "Mission Bay, the zoo bus tour, Birch Aquarium, and a short Balboa Park stop can support shorter sessions and a midday reset when current conditions and facilities are checked."],
      ["Should toddlers visit La Jolla Cove?", "It can work, but parking, stairs, uneven paths, crowds, and stroller gear need a specific plan. Compare that friction with Birch Aquarium or a verified La Jolla Shores stop before deciding."]
    ],
    clusterLinks: [
      ["All-ages guide", "For older siblings or grandparents.", "./san-diego-with-kids.html", "Open San Diego things to do with kids"],
      ["Family itinerary", "Day-by-day order around naps and meals.", "../family-itinerary/san-diego-with-kids.html", "Open the San Diego family itinerary"],
      ["Stay areas", "Pick a base close enough for a midday nap.", "../where-to-stay/san-diego-with-kids.html", "Compare San Diego stay areas"]
    ]
  },
  "things-to-do/new-york-city-with-kids.html": {
    title: "Things to Do in New York City With Kids: 12 Picks by Age and Trip Style",
    heroPhoto: "nyc-bronx-zoo-giraffes",
    description:
      "Compare 12 things to do in New York City with kids by age, weather, budget, time, area, stroller fit, and trip style, with current official-source checks.",
    city: "New York City",
    removeBaseActivitySiblingBand: true,
    supportCardClass: "detail-card",
    hidePlans: true,
    compactDetails: true,
    baseReplacements: [
      ["<h1>Things to do in New York City with kids</h1>", "<h1>Things to Do in New York City With Kids: 12 Picks by Age and Trip Style</h1>"],
      ["<p>Use NYC's museums, parks, ferries, neighborhoods, and transit with a plan that respects walking distance, stroller access, bathroom breaks, and overstimulation.</p>", "<p class=\"nyc-kids-lede\">One big outing a day. Family of 4 (2 adults, kids 4 and 8), estimate, tickets only: Staten Island Ferry free · Children's Museum ≈ $68 · Intrepid ≈ $104.</p>"],
      ["<p><strong>Last updated:</strong> July 5, 2026</p>", "<p><strong>Venue facts checked:</strong> July 24, 2026 <span aria-hidden=\"true\">·</span> <strong>Ticket prices checked:</strong> November 2, 2026 (Intrepid November 1)</p>"],
      ["Family Tripwise compares official attraction and hotel information, family logistics, search-intent research, and practical planning tradeoffs like age fit, stroller friction, weather backup, nap timing, walking distance, and lodging base.", "Family Tripwise compares official attraction and city information, family logistics, and practical planning tradeoffs such as age fit, stroller friction, weather backup, nap timing, and location."],
      ['<img src="https://commons.wikimedia.org/wiki/Special:Redirect/file/Central%20Park%20New%20York%20City%20New%20York%2023%20cropped.jpg" alt="A bridge and trees in Central Park, New York City." loading="eager" decoding="async">', '<img src="https://commons.wikimedia.org/wiki/Special:Redirect/file/Central%20Park%20New%20York%20City%20New%20York%2023%20cropped.jpg?width=1200" alt="A bridge and trees in Central Park, New York City." width="1280" height="894" loading="eager" decoding="async" fetchpriority="high">'],
      ["<div><dt>Best toddler ideas</dt><dd>Central Park playgrounds, CMOM</dd></div>", "<div><dt>Younger-child day</dt><dd>Children's Museum, Transit Museum, or one Central Park zone</dd></div>"],
      ["<div><dt>Best teen ideas</dt><dd>observation decks, food halls</dd></div>", "<div><dt>Older-child day</dt><dd>Intrepid, harbor history, skyline, or High Line</dd></div>"],
    ],
    activityFilters: [
      ["all", "All"],
      ["toddler", "Toddler"],
      ["preschool", "Preschool"],
      ["elementary", "Elementary"],
      ["teen", "Teen"],
      ["indoor", "Indoor / rain"],
      ["budget", "Free / low cost"],
    ],
    activityFilterTitle: "12 New York City activities by age, weather, and budget",
    activityCards: [
      {
        name: "Central Park",
        tags: ["baby", "toddler", "preschool", "elementary", "tween", "teen", "budget", "stroller"],
        age: "All ages",
        time: "1-4 hrs",
        cost: "Free",
        area: "Central Park",
        stroller: "Route-specific",
        rain: "No",
        nap: "High",
        summary: "Choose one playground, lawn, or museum-adjacent zone; the park is too large to treat as one simple stop.",
      },
      {
        name: "American Museum of Natural History",
        tags: ["preschool", "elementary", "tween", "teen", "indoor", "rain", "stroller"],
        age: "Preschool through teen",
        time: "2-5 hrs",
        cost: "Paid; check live",
        area: "Upper West Side",
        stroller: "Good with exceptions",
        rain: "Yes",
        nap: "Medium",
        summary: "Pick two or three halls and make this the day's museum rather than the first of several large attractions.",
      },
      {
        name: "Staten Island Ferry",
        tags: ["preschool", "elementary", "tween", "teen", "budget", "stroller"],
        age: "Preschool through teen",
        time: "75-120 min",
        cost: "Free",
        area: "Lower Manhattan",
        stroller: "Boarding-specific",
        rain: "Partial",
        nap: "Medium",
        summary: "A free harbor crossing with skyline and Statue views; schedule, boarding, waiting, and the return still need a plan.",
      },
      {
        name: "Children's Museum of Manhattan",
        tags: ["baby", "toddler", "preschool", "elementary", "indoor", "rain"],
        age: "Age 0-6 focus",
        time: "90 min-3 hrs",
        cost: "≈ $68, family of 4",
        area: "Upper West Side",
        stroller: "Check at entrance",
        rain: "Yes",
        nap: "High",
        summary: "A purpose-built younger-child choice; strollers are checked rather than used in exhibit areas.",
      },
      {
        name: "Top of the Rock",
        tags: ["elementary", "tween", "teen", "indoor"],
        age: "School-age through teen",
        time: "60-90 min",
        cost: "Paid; check live",
        area: "Midtown",
        stroller: "Check venue",
        rain: "Partial; views vary",
        nap: "Low",
        summary: "A contained skyline choice when the family accepts timed entry, weather-dependent views, and a premium ticket.",
      },
      {
        name: "Brooklyn Bridge Park",
        tags: ["baby", "toddler", "preschool", "elementary", "tween", "teen", "budget", "stroller"],
        age: "All ages",
        time: "1-3 hrs",
        cost: "Free",
        area: "Brooklyn waterfront",
        stroller: "Route-specific",
        rain: "No",
        nap: "High",
        summary: "Choose a pier or playground before arrival and use the waterfront as a flexible skyline and movement block.",
      },
      {
        name: "Intrepid Museum",
        tags: ["elementary", "tween", "teen", "indoor", "rain"],
        age: "School-age through teen",
        time: "3-5 hrs",
        cost: "≈ $104, family of 4",
        area: "Hudson River",
        stroller: "Exhibit-specific",
        rain: "Partial",
        nap: "Low",
        summary: "Aviation, naval, and space exhibits justify a major block; vessel spaces and outdoor decks make access and weather specific.",
      },
      {
        name: "New York Transit Museum",
        tags: ["toddler", "preschool", "elementary", "tween", "indoor", "budget"],
        age: "Toddler through tween",
        time: "90 min-3 hrs",
        cost: "≈ $50, family of 4",
        area: "Downtown Brooklyn",
        stroller: "Difficult stair entry",
        rain: "Partial indoor",
        nap: "Low",
        summary: "Historic trains are a strong transit-loving choice, but the decommissioned station has stairs and limited climate control.",
      },
      {
        name: "New York Hall of Science",
        tags: ["preschool", "elementary", "tween", "indoor", "rain", "stroller"],
        age: "Preschool through tween",
        time: "3-5 hrs",
        cost: "≈ $82, family of 4",
        area: "Flushing Meadows, Queens",
        stroller: "Check current access",
        rain: "Yes",
        nap: "Low",
        summary: "Hands-on science can carry a half-day; the Queens route and any add-ons make it a deliberate anchor.",
      },
      {
        name: "Bronx Zoo",
        tags: ["toddler", "preschool", "elementary", "tween", "teen", "stroller"],
        age: "Toddler through teen",
        time: "4-7 hrs",
        cost: "≈ $100 winter, family of 4",
        area: "Bronx",
        stroller: "Rental/check current",
        rain: "Mostly no",
        nap: "Medium",
        summary: "Treat the large zoo as the day's commitment and choose a few priority areas rather than trying to cover every exhibit.",
      },
      {
        name: "Statue of Liberty and Ellis Island",
        tags: ["elementary", "tween", "teen", "stroller"],
        age: "School-age through teen",
        time: "4-7 hrs",
        cost: "≈ $86 ferry, family of 4",
        area: "New York Harbor",
        stroller: "Access-specific",
        rain: "Partial",
        nap: "Low",
        summary: "A historic harbor day with authorized ferry tickets, security, waits, and optional pedestal or crown access to decide in advance.",
      },
      {
        name: "High Line",
        tags: ["elementary", "tween", "teen", "budget", "stroller"],
        age: "School-age through teen",
        time: "1-2 hrs",
        cost: "Free",
        area: "Chelsea",
        stroller: "Check elevator status",
        rain: "No",
        nap: "Medium",
        summary: "A free linear city walk with art and street views; confirm the working elevator and choose an exit before starting.",
      },
    ],
    quickEyebrow: "Choose a trip shape",
    quickTitle: "Five useful ways to start",
    quickNote: "These are starting routes, not universal rankings. Choose by child interest, age mix, weather, budget, and the location of the family's stay.",
    quick: [
      ["Mixed ages, kids 4 and 8", "Children's Museum and Central Park, then the Transit Museum, then the Bronx Zoo", "About $218 in tickets for 3 days (estimate; online Children's Museum price, winter zoo rate). Family of 4. The Transit Museum has stairs and no elevator at its main entrance, so skip the stroller if you can."],
      ["Younger child or easy exit", "Children's Museum or one playground", "The Children's Museum, the Transit Museum, Central Park, or Brooklyn Bridge Park can work differently depending on stairs, stroller handling, and the hotel reset."],
      ["Weather or budget constraint", "Rain: the Children's Museum or Natural History. Free: Central Park or the ferry", "Choose one current age-fit anchor, then keep the backup close instead of rebuilding the day across boroughs."],
      ["Older kids and teens", "Intrepid, the Statue of Liberty or Top of the Rock", "Let older children choose Intrepid, Statue and Ellis, Top of the Rock, High Line, or Natural History by interest."],
      ["Lodging-led trip", "Pick the neighborhood first", "Upper West Side, Midtown, Downtown, Brooklyn, Queens, and Bronx anchors create very different return and transport patterns."]
    ],
    comparisonSectionId: "nyc-kids-comparison",
    comparisonPriceSources: [["Children's Museum", "https://cmom.org/visit/"], ["Intrepid", "https://intrepidmuseum.org/plan-your-visit/visitor-information/tickets"], ["Transit Museum", "https://www.nytransitmuseum.org/know-before-you-visit/"], ["Hall of Science", "https://nysci.org/tickets"], ["Bronx Zoo", "https://bronxzoo.com/plan-your-visit/hours-and-rates"], ["Statue ferry (NPS)", "https://www.nps.gov/stli/planyourvisit/fees.htm"], ["Natural History", "https://www.amnh.org/plan-your-visit"], ["Top of the Rock", "https://www.rockefellercenter.com/tickets/top-of-the-rock-observation-deck"]],
    comparisonHeaders: ["Activity", "Family of 4 cost", "Best ages", "Time", "Area", "Stroller", "Rain", "Nap", "Booking", "Why worth it", "Pair nearby"],
    comparisonClass: "ds-table nyc-kids-ds",
    comparisonCostNote: "Family of 4 estimate (2 adults, kids 4 and 8), tickets only: sums of the official prices shown. Natural History and Top of the Rock are not priced here. Fees, taxes and parking extra where charged.",
    comparisonNote: "Dollar prices are official prices read November 2, 2026 (Intrepid November 1). Age fit, time, stroller, rain, nap and booking labels are editorial planning estimates, not venue guarantees.",
    rows: [
      ["Central Park", "Free", "All ages", "1-4 hrs", "Central Park", "Route-specific", "No", "High", "Check maps/status", "Flexible outdoor block", "AMNH or one nearby meal"],
      ["American Museum of Natural History", "Paid; no price on its visit page, check live; NY, NJ and CT residents with ID choose what they pay", "3+", "2-5 hrs", "Upper West Side", "Good with exceptions", "Yes", "Medium", "Advance ticket helpful", "Large classic museum anchor", "One Central Park zone"],
      ["Staten Island Ferry", "Free", "3+", "75-120 min", "Lower Manhattan", "Boarding-specific", "Partial", "Medium", "Check schedule/notices", "Harbor and skyline ride", "The Battery or Downtown meal"],
      ["Children's Museum of Manhattan", "≈ $68 online ($17 a person, ages 1+; $18 at the door; under 1 free)", "0-6 focus", "90 min-3 hrs", "Upper West Side", "Stroller check", "Yes", "High", "Reserve/check tickets", "Contained younger-child play", "Central Park playground"],
      ["Top of the Rock", "Paid; price not confirmed, check live", "6+", "60-90 min", "Midtown", "Check venue", "Partial; views vary", "Low", "Timed ticket", "Contained skyline choice", "Rockefeller Center or meal"],
      ["Brooklyn Bridge Park", "Free", "All ages", "1-3 hrs", "Brooklyn waterfront", "Route-specific", "No", "High", "Check pier/status", "Playground and skyline block", "Brooklyn Heights or DUMBO meal"],
      ["Intrepid Museum", "≈ $104 ($38 adult, $28 ages 5-12; 4 and under free); add-ons extra", "6+", "3-5 hrs", "Hudson River", "Exhibit-specific", "Partial", "Low", "Check tickets/closures", "Aviation, naval, and space anchor", "Short Hudson River walk"],
      ["New York Transit Museum", "≈ $50 ($15 adult, $10 ages 2-17)", "2-12", "90 min-3 hrs", "Downtown Brooklyn", "Difficult stair entry", "Partial indoor", "Low", "Advance reservation", "Historic trains and city story", "Brooklyn meal or park"],
      ["New York Hall of Science", "≈ $82 ($22 adult, $19 child; counts the 4-year-old, free age not stated); add-ons $6 each", "3-12", "3-5 hrs", "Flushing Meadows, Queens", "Check current access", "Yes", "Low", "Reserve/check add-ons", "Hands-on science anchor", "Keep the Queens route simple"],
      ["Bronx Zoo", "≈ $100 through Mar 25, 2027 (winter rate: $28.95 adult, $20.95 ages 3-12; 2 and under free); parking $22", "2+", "4-7 hrs", "Bronx", "Rental/check current", "Mostly no", "Medium", "Book/check exhibits", "Animal-led full-day choice", "Quiet evening"],
      ["Statue of Liberty and Ellis Island", "≈ $86 ferry ($26 adult, $17 ages 4-12; under 4 free); museums included", "6+", "4-7 hrs", "New York Harbor", "Access-specific", "Partial", "Low", "Authorized ferry; book", "Historic harbor day", "The Battery"],
      ["High Line", "Free", "6+", "1-2 hrs", "Chelsea", "Check elevator status", "No", "Medium", "Check access/hours", "Linear city walk", "Chelsea meal or Hudson River Park"]
    ],
    collapseDetails: "Show how to plan these six picks",
    detailsEyebrow: "Picks to check first",
    detailsTitle: "Six choices that need an extra check",
    detailsNote: "The comparison covers all 12. These six get extra space because scale, ticket timing, stairs, security, weather, exhibit access, or cross-borough travel can materially change the family plan.",
    details: [
      ["American Museum of Natural History", "Dinosaurs, ocean life, space, and natural history can support different interests across one mixed-age family.", "Best when the family chooses a few halls rather than treating the building as a completion challenge.", "Museum fatigue, ticketed add-ons, busy galleries, and using the wrong stroller entrance.", "Choose two or three priorities and the entrance before arrival; make this the day's museum.", "Use onsite food, family restrooms, and the option to re-enter only after checking the current rules.", "Check current tickets, exhibitions, entrances, stroller exceptions, and hours.", "Pair with one nearby Central Park zone, not another large museum."],
      ["Intrepid Museum", "Aircraft, the carrier, Space Shuttle Pavilion, and submarine give machine- and history-focused children a clear reason to choose it.", "Best for school-age children through teens who actively want aviation, ships, or space.", "Some spaces have distinct access limits, outdoor decks expose the family to weather, and the museum can take longer than expected.", "Choose the must-see vessel or exhibit and review current closures and accessibility before buying.", "Plan food and a sitting break around the museum rather than adding a second major Midtown attraction.", "Check current admission, hours, included exhibits, weather, and access-specific restrictions.", "Pair with a short Hudson River walk or simple meal."],
      ["New York Transit Museum", "Historic subway cars and hands-on transit history can be a high-payoff, lower-cost choice for train-focused children.", "Best for toddlers through tweens who are excited by trains and can manage the historic-station setting.", "There is no elevator at the main entrance, heavy strollers may need to be carried down several flights, and most platform space is not climate controlled.", "Reserve the entry window and decide before arrival whether the stairs and stroller policy work for the family.", "There is no eating area, so plan the meal before or after the visit.", "Check current tickets, group rules, stair access, stroller parking, and temperature conditions.", "Pair with a nearby Downtown Brooklyn meal or a separate short park block."],
      ["Bronx Zoo", "The scale and animal variety can justify a dedicated family day.", "Best for families willing to choose a few animal priorities and accept substantial outdoor walking.", "Trying to see the entire zoo, changing exhibit availability, weather, and the route from the hotel can consume the day.", "Treat the zoo as the anchor, select priority areas, and protect the evening.", "Check food, restroom, stroller or mobility rental, and exit options on the current map.", "Recheck tickets, exhibits, rentals, operating notices, and weather.", "Pair with a quiet evening rather than another attraction."],
      ["Statue of Liberty and Ellis Island", "The harbor trip, Statue museum, and immigration history can make one coherent older-child history day.", "Best for school-age children through teens who can handle security, ferries, standing, and a long fixed sequence.", "The ticket time starts the security queue rather than guaranteeing a ferry departure; peak waits can be long, and pedestal or crown access has separate limits.", "Use only the NPS-authorized ferry seller, choose island and access priorities, and take an early departure if visiting both islands.", "Bring only allowed items and plan food, restrooms, weather, and mobility for the full sequence.", "Check current ferry tickets, security rules, closures, pedestal or crown access, and weather.", "Pair only with The Battery or a simple Downtown meal."],
      ["Top of the Rock", "A timed observation deck gives skyline-focused older children a clear, contained payoff.", "Best for school-age children through teens who value the view enough to justify the ticket.", "Poor visibility, weather, crowded sunset windows, security, and premium pricing can reduce the value.", "Check visibility and choose a time that fits meals and energy; do not make it the mandatory answer for every first trip.", "Use bathrooms and food before the timed entry, then keep the next stop simple.", "Check current ticket terms, visibility, weather handling, and temporary deck closures.", "Pair with Rockefeller Center or one nearby meal."]
    ],
    clusterEyebrow: "Next planning decision",
    clusterTitle: "Continue from the shortlist",
    clusterLinks: [
      ["New York City with teens", "Use the specialist when an older child should choose the skyline, media, art, live-performance, sports, or neighborhood anchor and the exact age, ticket, sensory, or evening rule matters.", "./new-york-city-with-teens.html", "Open New York City with teens"],
      ["Where to stay in New York City", "Choose the base before final activity order. Upper West Side, Midtown, Downtown, Brooklyn, and Queens create different transport and reset patterns; named hotels remain a separate comparison job.", "../where-to-stay/new-york-city-with-kids.html", "Compare New York City stay areas"],
      ["New York City family itinerary", "Turn one activity anchor, one flexible block, meals, and a weather swap into a realistic one-, two-, or three-day sequence.", "../family-itinerary/new-york-city-with-kids.html", "Build the New York City family itinerary"]
    ],
    officialChecksEyebrow: "Before locking the day",
    officialChecksTitle: "Four checks that can change the shortlist",
    officialChecks: [
      ["Large museums and timed tickets", "AMNH, Intrepid, and Top of the Rock use different ticket, add-on, access, and weather rules. Choose the exact anchor first and verify its current terms.", [["https://www.amnh.org/plan-your-visit", "AMNH plan your visit"], ["https://intrepidmuseum.org/plan-your-visit/visitor-information/tickets", "Intrepid Museum tickets"], ["https://www.rockefellercenter.com/tickets/top-of-the-rock-observation-deck", "Top of the Rock tickets"]]],
      ["Younger children and strollers", "CMOM checks strollers at entry, the Transit Museum's historic station has no elevator at its main entrance, and Central Park paths vary. Verify the exact setup instead of assuming a citywide stroller verdict.", [["https://cmom.org/visit/", "CMOM plan your visit"], ["https://www.nytransitmuseum.org/know-before-you-visit/", "Transit Museum know before you visit"], ["https://www.centralparknyc.org/downloadable-maps", "Central Park maps"]]],
      ["Free and outdoor choices", "The Staten Island Ferry, Central Park, Brooklyn Bridge Park, and High Line do not require general admission, but service, weather, playground, restroom, elevator, and operating status can still change the plan.", [["https://www.nyc.gov/html/dot/html/ferrybus/siferryschedule.shtml", "Staten Island Ferry schedule"], ["https://brooklynbridgepark.org/about/", "Brooklyn Bridge Park visitor information"], ["https://www.thehighline.org/visit/", "High Line visit information"]]],
      ["Long and outer-borough days", "Statue and Ellis, the Bronx Zoo, and NYSCI are deliberate commitments. Recheck ferry security and tickets, current zoo exhibits and rentals, and NYSCI admission or add-ons before building the route.", [["https://www.nps.gov/stli/planyourvisit/index.htm", "Statue of Liberty and Ellis Island planning"], ["https://bronxzoo.com/plan-your-visit", "Bronx Zoo plan your visit"], ["https://tickets.nysci.org/Info.aspx?EventID=3", "New York Hall of Science admission"]]]
    ],
    visibleFaqs: true,
    faqs: [
      ["What are the best things to do in New York City with kids?", "Start with the child's interests and the family's base rather than one universal ranking: Central Park and AMNH for an Upper West Side day, harbor history or the free Staten Island Ferry for Downtown, CMOM or the Transit Museum for many younger children, and Intrepid, Top of the Rock, High Line, NYSCI, or the Bronx Zoo for more specific interests."],
      ["What can families do for free in New York City?", "Central Park, the Staten Island Ferry, Brooklyn Bridge Park, and the High Line are the clearest no-admission choices in this comparison. Transport, food, weather, service changes, and optional nearby experiences still affect the day's cost."],
      ["What is a useful rainy-day activity in New York City with kids?", "Choose one substantial indoor anchor by age and location: AMNH for broad natural history, CMOM for ages 0-6, Intrepid for aviation and space interests, the Transit Museum for train-focused children who can manage its stair access, or NYSCI for a deliberate Queens science day. Indoor does not guarantee low crowds, easy stroller access, or a short route."]
    ],
    sourcesIntro: "Official attraction, park, NPS, and city sources checked July 24, 2026. Ticket prices read November 2, 2026 (Intrepid November 1). Recheck tickets, hours, exhibits, access, service, weather, visibility, and operating details for the exact visit date.",
    sources: [
      ["Statue of Liberty ferry fees (NPS)", "https://www.nps.gov/stli/planyourvisit/fees.htm"],
      ["Bronx Zoo hours and rates", "https://bronxzoo.com/plan-your-visit/hours-and-rates"],
      ["New York Hall of Science tickets", "https://nysci.org/tickets"],
      ["Central Park maps", "https://www.centralparknyc.org/downloadable-maps"],
      ["AMNH plan your visit", "https://www.amnh.org/plan-your-visit"],
      ["Staten Island Ferry schedule", "https://www.nyc.gov/html/dot/html/ferrybus/siferryschedule.shtml"],
      ["CMOM plan your visit", "https://cmom.org/visit/"],
      ["Top of the Rock tickets", "https://www.rockefellercenter.com/tickets/top-of-the-rock-observation-deck"],
      ["Brooklyn Bridge Park playgrounds", "https://brooklynbridgepark.org/places-to-see/playgrounds/"],
      ["Brooklyn Bridge Park visitor information", "https://brooklynbridgepark.org/about/"],
      ["Intrepid Museum tickets", "https://intrepidmuseum.org/plan-your-visit/visitor-information/tickets"],
      ["Transit Museum know before you visit", "https://www.nytransitmuseum.org/know-before-you-visit/"],
      ["New York Hall of Science admission", "https://tickets.nysci.org/Info.aspx?EventID=3"],
      ["Bronx Zoo plan your visit", "https://bronxzoo.com/plan-your-visit"],
      ["Statue of Liberty and Ellis Island planning", "https://www.nps.gov/stli/planyourvisit/index.htm"],
      ["Statue of Liberty security rules", "https://www.nps.gov/stli/planyourvisit/safety.htm"],
      ["High Line visit information", "https://www.thehighline.org/visit/"],
      ["Bronx Zoo giraffe photo source and license", "https://commons.wikimedia.org/wiki/File:Rothschild%27s_giraffes_(Giraffa_camelopardalis_rothschildi)_at_Bronx_Zoo_browsing_August_2026.jpg"]
    ]
  }
};

export const stayPages = {
  "where-to-stay/san-diego-with-kids.html": {
    title: "Where to Stay in San Diego With Kids: 5 Areas Compared",
    description:
      "Compare five San Diego areas for a family trip by beach access, first-day routes, car needs, midday resets, hotel patterns, and nearby kid activities.",
    city: "San Diego",
    schemaName: "San Diego family stay area options",
    stayTool: true,
    hideHotelSection: true,
    baseReplacements: [
      ["<h1>Where to stay in San Diego with kids</h1>", "<h1>Where to Stay in San Diego With Kids: 5 Areas Compared</h1>"],
      ["<p>Compare five San Diego areas by beach access, activity routes, car needs, hotel style, and midday-reset practicality, then move to a shortlist of specific hotels.</p>", "<p>Choose among Mission Bay, La Jolla, Downtown/Little Italy, Coronado, and Mission Valley by the first two days, transport, and midday reset. Then compare named hotels.</p>"],
      ["<p><strong>Last updated:</strong> July 20, 2026</p>", "<p><strong>Area guidance checked:</strong> July 20, 2026; page updated August 4, 2026</p>"]
    ],
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
    bookingHeading: "Choose the area first, then verify the exact hotel",
    clusterHeading: "Move from the chosen area to a named hotel",
    bookingChecks: [
      ["Map the first two days", "Compare each hotel against the family's first two activity days, meals, and likely midday return. A central-looking area can still create awkward routes."],
      ["Check the sleep setup", "Confirm beds, occupancy, sofa-bed wording, crib or rollaway availability, connecting-room rules, elevator access, and room-location requests for the exact room type."],
      ["Compare the nightly total", "Use the same dates and occupancy, then compare taxes, parking, resort fees, breakfast, and likely transport costs rather than the headline room rate alone."],
      ["Confirm the make-or-break amenity", "If the pool, kitchen, breakfast, laundry, beach access, or quiet room request is essential, check the current property page and ask the hotel when the published answer is unclear."]
    ],
    clusterLinks: [
      ["Compare 12 family hotels", "Use the separate hotel shortlist after choosing an area. Compare named properties by rough nightly price, room setup, pool and kitchen facts, sampled online-review themes, and a Google Maps link for each hotel.", "./san-diego-family-hotels.html", "Compare 12 San Diego family hotels"],
      ["Things to do in San Diego", "Use the activity guide to decide whether your hotel should optimize for the zoo, Mission Bay, La Jolla, Coronado, or Balboa Park.", "../things-to-do/san-diego-with-kids.html", "Open San Diego things to do with kids"],
      ["San Diego family itinerary", "Match the stay base to a realistic 1-day, 2-day, 3-day, toddler, teen, or rainy-day route before booking.", "../family-itinerary/san-diego-with-kids.html", "Open the San Diego family itinerary"],
      ["Toddler-specific planning", "If naps, stroller exits, and short sessions drive the trip, cross-check Mission Bay, zoo bus tour, Birch Aquarium, and hotel reset options.", "../things-to-do/san-diego-with-toddlers.html", "Open San Diego with toddlers"],
      ["Teen-specific planning", "If older kids need coast, food, and less little-kid pacing, use the teen guide before committing to a beach or urban base.", "../things-to-do/san-diego-with-teens.html", "Open San Diego with teens"]
    ],
    faqs: []
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
      ["<figcaption>Photo: chensiyuan, Wikimedia Commons, CC BY-SA 4.0. <a href=\"https://commons.wikimedia.org/wiki/File:Bellagio_fountain_show_2010_las_vegas.JPG\">License and source</a>.</figcaption>", "<figcaption>Photo: Chensiyuan via <a href=\"https://commons.wikimedia.org/wiki/File:Bellagio_fountain_show_2010_las_vegas.JPG\">Wikimedia Commons</a>, <a href=\"https://creativecommons.org/licenses/by-sa/4.0/\">CC BY-SA 4.0</a>. No editorial changes; Family Tripwise serves a resized copy.</figcaption>"]
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
    title: "Where to Stay in New York City With Kids: 5 Areas Compared",
    description:
      "Compare five New York City family stay areas by the first two days, midday reset, child pace, transit and access checks, cost tradeoffs, and nearby anchors.",
    city: "New York City",
    schemaName: "New York City family stay area options",
    constraintLed: true,
    removeGeneratedBodySections: true,
    hideHotelSection: true,
    visibleFaqs: true,
    baseReplacements: [
      ["<h1>Where to stay in New York City with kids</h1>", "<h1>Where to Stay in New York City With Kids: 5 Areas Compared</h1>"],
      ["<p>Compare the best family areas in New York City by stroller ease, room size risk, parking, walkability, noise, pool access, and attraction proximity.</p>", "<p>Choose the base from the family's first two days and likely midday return: park and museum time, classic Midtown sights, the harbor, Brooklyn, or a Queens value check. Then compare named hotels.</p>"],
      ["<p><strong>Last updated:</strong> July 5, 2026</p>", "<p><strong>Area and transport sources checked:</strong> July 26, 2026</p>"],
      ["<p><strong>How this guide was built:</strong> Family Tripwise compares official attraction and hotel information, family logistics, search-intent research, and practical planning tradeoffs like age fit, stroller friction, weather backup, nap timing, walking distance, and lodging base.</p>", "<p>Area guidance is planning support, not a universal ranking. Exact station access, elevator status, walking route, room exposure, price, and return pattern depend on the hotel, itinerary, date, and current service.</p>"],
      ["<img src=\"https://commons.wikimedia.org/wiki/Special:Redirect/file/Central%20Park%20New%20York%20City%20New%20York%2023%20cropped.jpg\" alt=\"A bridge and trees in Central Park, New York City.\" loading=\"eager\" decoding=\"async\">", "<img src=\"https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Manhattan_Skyline_from_Brooklyn_Bridge_Park.jpg/1600px-Manhattan_Skyline_from_Brooklyn_Bridge_Park.jpg\" style=\"object-position:50% 58%\" alt=\"Lower Manhattan towers across the East River, seen from the Brooklyn Bridge Park waterfront at dusk.\" loading=\"eager\" decoding=\"async\" fetchpriority=\"high\">"],
      ["<figcaption>Photo: Jet Lowe / National Park Service, public domain via Wikimedia Commons. <a href=\"https://commons.wikimedia.org/wiki/File:Central_Park_New_York_City_New_York_23_cropped.jpg\">License and source</a>.</figcaption>", "<figcaption>Lower Manhattan seen from Brooklyn Bridge Park, July 2014 (an older photo). Downtown and Brooklyn are two of the five bases compared here. Photo: Arribas91 via <a href=\"https://commons.wikimedia.org/wiki/File:Manhattan_Skyline_from_Brooklyn_Bridge_Park.jpg\">Wikimedia Commons</a>, <a href=\"https://creativecommons.org/licenses/by-sa/3.0/\">CC BY-SA 3.0</a>. Resized.</figcaption>"]
    ],
    quickHeading: "Five useful starting points",
    quick: [
      ["Park, museum, or younger-child days", "Upper West Side", "Start here when Central Park, AMNH, and nearby flexible time shape the first two days."],
      ["Short classic-sight or Broadway trip", "Midtown", "Choose the exact subarea around the planned sights; Times Square, Bryant Park, and Grand Central are not one interchangeable base."],
      ["Harbor and Lower Manhattan days", "Downtown / Tribeca", "Start here when ferries, the Seaport, the memorial area, or downtown waterfront time lead the itinerary."],
      ["Brooklyn waterfront route", "Brooklyn Heights / Downtown Brooklyn", "Use it when Brooklyn Bridge Park and Lower Manhattan are deliberate anchors, not when every day returns to Midtown."],
      ["Room-price or Queens access check", "Long Island City", "Treat value and convenience as hypotheses until the exact hotel, station, first two days, and complete stay total are compared."]
    ],
    quickRecovery: [
      "Still choosing between areas?",
      "First check whether points, free nights, room setup, or the complete stay price already decides the hotel or area. If multiple areas still work and the first two days are not sequenced,",
      "../family-itinerary/new-york-city-with-kids.html",
      "sequence the first two days",
      "before choosing the base."
    ],
    matrixHeading: "Compare the area before the hotel",
    areaHeaders: ["Area", "Start here when", "What it simplifies", "Reset reality", "Main friction", "Nearby anchors", "Exact check"],
    rows: [
      ["Upper West Side", "Central Park, AMNH, or younger-child park-and-museum time leads the first two days", "Keeps several indoor and outdoor choices in one broad zone", "A hotel return can work only when the selected stops and exact address stay nearby", "Downtown and east-side days can add longer rides or transfers", "Central Park, AMNH, CMOM, Riverside Park", "Map the hotel entrance and both first-day routes; check station accessibility and live elevator status"],
      ["Midtown", "A short trip centers on Broadway, Bryant Park, Rockefeller Center, Grand Central, or nearby skyline stops", "Can keep several classic sights and one evening in the same broad zone", "The return depends on the exact subarea and entrance, not the word Midtown", "Crowd exposure, station access, room exposure, and hotel scale vary block by block", "Bryant Park, Broadway, Rockefeller Center, Grand Central", "Choose the exact subarea, then check entrances, planned lines, live service, and the room request"],
      ["Downtown / Tribeca", "Harbor, ferry, memorial, Seaport, or Lower Manhattan time leads the itinerary", "Keeps several downtown anchors close to the base", "Useful for downtown days; it does not shorten an uptown-heavy plan", "Repeat uptown rides and property prices can erase the area-level advantage", "Battery Park City, ferries, Seaport, Lower Manhattan", "Map ferry and attraction entrances, both first days, the uptown route, and the named hotel total"],
      ["Brooklyn Heights / Downtown Brooklyn", "Brooklyn Bridge Park and Lower Manhattan are deliberate trip anchors", "Keeps waterfront and Brooklyn time from becoming a day-trip add-on", "A return works when the family is already in Brooklyn or Lower Manhattan", "A Manhattan-heavy plan can create repeated river crossings", "Brooklyn Bridge Park, promenade, Downtown Brooklyn", "Check the exact station, lines, accessibility, walking approach, and evening return"],
      ["Long Island City", "Midtown or Queens access plus a possible room-price or room-function advantage matters", "Can make a Midtown-facing route and Gantry Plaza time more coherent", "Door-to-door return depends on the exact station and hotel entrance", "One-stop language does not prove current value, easy access, or a simple late return", "Gantry Plaza State Park, Midtown-facing waterfront, Queens routes", "Compare live service/access, the first two days, hotel entrance, room setup, and complete stay total"]
    ],
    areaNote: "Use these as route starts, not universal rankings. The exact hotel can reverse the area-level tradeoff through station access, walking route, room setup, price, block conditions, and the family's first two days.",
    bookingHeading: "Three decisions worth a closer look",
    bookingChecks: [
      ["Midtown is several different bases", "Times Square, Bryant Park, Rockefeller Center, and Grand Central create different walking and subway patterns. Pin the exact hotel entrance and the first two days before calling a Midtown room central."],
      ["Verify the whole accessible route", "Use the MTA subway map, accessible-station list, and live elevator status together. An accessible station does not guarantee the preferred entrance, transfer, elevator, or future service will work as expected."],
      ["Price cross-river bases against the itinerary", "Brooklyn and Long Island City can earn the stay when their route and room total work. Compare the complete hotel price, exact station, transfers, likely returns, and every Manhattan-heavy day before assuming better value."]
    ],
    clusterHeading: "Move from the area to the rest of the trip",
    clusterLinks: [
      ["12 family hotel options", "Compare named properties by room setup, broad total-night range, area, family logistics, and bounded recent online-review observations.", "./new-york-city-family-hotels.html", "Compare New York City family hotels"],
      ["Things to do with kids", "Use the 12-choice all-ages guide to decide whether the base should favor Central Park, Midtown, Downtown, Brooklyn, or a deliberate Queens day.", "../things-to-do/new-york-city-with-kids.html", "Open New York City things to do with kids"],
      ["Things to do with teens", "Let an older child choose a skyline, media, art, live-performance, sports, or neighborhood anchor before finalizing the base.", "../things-to-do/new-york-city-with-teens.html", "Open New York City with teens"],
      ["Family itinerary", "Sequence the first two days and one protected reset before paying for a location that only looks central on a broad map.", "../family-itinerary/new-york-city-with-kids.html", "Build the New York City family itinerary"]
    ],
    faqTitle: "New York City family stay FAQ",
    faqs: [
      ["What is a useful first area to check for a New York City family trip?", "Check the Upper West Side first when Central Park, AMNH, and younger-child park or museum days lead the trip. Use Midtown for a short classic-sight or Broadway route, Downtown for harbor-led days, Brooklyn for a deliberate waterfront plan, or Long Island City for an exact-station and total-price comparison."],
      ["Should families stay in Times Square?", "Times Square can work when Broadway and nearby Midtown sights lead a short trip. Compare the exact hotel entrance, room exposure, planned walking, station access, meal options, and first two days instead of treating all of Midtown as the same base."],
      ["Where can families compare specific New York City hotels?", "Use the Family Tripwise New York City family-hotel comparison for 12 named options with broad total-night ranges, room and amenity facts, bounded recent online-review observations, conflicts, and direct map links."]
    ],
    sourcesIntro: "Area and transport sources checked July 26, 2026. Recheck current service, elevator status, construction, events, park conditions, and exact hotel routes near the trip.",
    sources: [
      ["MTA subway maps", "https://www.mta.info/maps/subway-line-maps"],
      ["MTA accessible stations", "https://www.mta.info/accessibility/stations"],
      ["MTA elevator and escalator status", "https://www.mta.info/elevator-escalator-status"],
      ["Bryant Park", "https://www.bryantpark.org/the-park"],
      ["Battery Park City parks", "https://bpca.ny.gov/places/parks/"],
      ["Brooklyn Bridge Park visit information", "https://brooklynbridgepark.org/plan-your-visit/"],
      ["Gantry Plaza State Park", "https://parks.ny.gov/visit/state-parks/gantry-plaza-state-park"],
      ["Brooklyn Bridge Park photo source and attribution (CC BY-SA 3.0)", "https://commons.wikimedia.org/wiki/File:Manhattan_Skyline_from_Brooklyn_Bridge_Park.jpg"],
      ["CC BY-SA 3.0 license", "https://creativecommons.org/licenses/by-sa/3.0/"]
    ]
  },
  "where-to-stay/chicago-with-kids.html": {
    title: "Where to Stay in Chicago With Kids: 5 Areas Compared",
    description:
      "Compare five Chicago areas for a family trip by activity anchors, reset routine, transport plan, and main tradeoff, then move to named hotel options.",
    city: "Chicago",
    schemaName: "Chicago family stay area options",
    constraintLed: true,
    removeGeneratedBodySections: true,
    hideHotelSection: true,
    visibleFaqs: true,
    baseReplacements: [
      ["<h1>Where to stay in Chicago with kids</h1>", "<h1>Where to Stay in Chicago With Kids: 5 Areas Compared</h1>"],
      ["<p>Compare the best family areas in Chicago by stroller ease, room size risk, parking, walkability, noise, pool access, and attraction proximity.</p>", "<p>Choose the trip base first: central sights, Lincoln Park days, downtown parks, Museum Campus, or a food-led older-kid visit. Then compare named hotels.</p>"],
      ["<p><strong>Last updated:</strong> July 5, 2026</p>", "<p><strong>Area and transport sources checked:</strong> July 23, 2026</p>"],
      ["<p><strong>How this guide was built:</strong> Family Tripwise compares official attraction and hotel information, family logistics, search-intent research, and practical planning tradeoffs like age fit, stroller friction, weather backup, nap timing, walking distance, and lodging base.</p>", "<p>These are conditional starting points, not universal area rankings. Exact walking, step-free transit, room, noise, parking, and price details depend on the hotel, route, date, and family.</p>"],
      ["<img src=\"https://commons.wikimedia.org/wiki/Special:Redirect/file/Millennium%20park%2Cchicago.JPG\" alt=\"Millennium Park in Chicago at dusk.\" loading=\"eager\" decoding=\"async\">", "<img src=\"https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Sue_the_T._Rex_at_the_Field_Museum.jpg/1600px-Sue_the_T._Rex_at_the_Field_Museum.jpg\" style=\"object-position:50% 9%\" alt=\"The SUE T. rex skeleton in the Field Museum's main hall, Chicago, in 2017.\" loading=\"eager\" decoding=\"async\">"],
      ["<figcaption>Photo: Behnazkhazai, Wikimedia Commons, CC BY-SA 3.0. <a href=\"https://commons.wikimedia.org/wiki/File:Millennium_park,chicago.JPG\">License and source</a>.</figcaption>", "<figcaption>SUE the T. rex at the Field Museum on the Museum Campus, March 2017 (older photo; SUE is now upstairs, <a href=\"https://www.fieldmuseum.org/page/visiting-sue-t-rex-what-know-you-go\">per the museum</a>). Photo: DiscoA340 via <a href=\"https://commons.wikimedia.org/wiki/File:Sue_the_T._Rex_at_the_Field_Museum.jpg\">Wikimedia Commons</a>, <a href=\"https://creativecommons.org/licenses/by-sa/4.0/\">CC BY-SA 4.0</a>. Resized.</figcaption>"]
    ],
    quickHeading: "Five useful starting points",
    quick: [
      ["First city trip", "River North / Streeterville", "Start here when the river, Navy Pier, downtown meals, and several classic sights shape the itinerary."],
      ["Younger-child neighborhood trip", "Lincoln Park", "Start here when the zoo, lakefront green space, and neighborhood time matter more than a central downtown address."],
      ["Parks and Loop anchors", "Loop / Millennium Park", "Start here when Millennium Park, Maggie Daley Park, the Art Institute, or Loop architecture lead the first days."],
      ["Museum Campus-led trip", "South Loop / Museum Campus", "Start here when Field Museum, Shedd Aquarium, and lakefront time are major anchors, then test the exact hotel route."],
      ["Food-led older-kid trip", "West Loop", "Start here when restaurants and neighborhood time are part of the trip, not just somewhere to eat after downtown sightseeing."]
    ],
    matrixHeading: "Compare the area before the hotel",
    areaHeaders: ["Area", "Start here when", "What it simplifies", "Transport check", "Main tradeoff", "Next step"],
    rows: [
      ["River North / Streeterville", "The river, Navy Pier, downtown meals, and classic sights dominate", "Keeps several first-trip anchors in the same broad downtown zone", "Map each exact hotel to the first two anchors; river crossings, station access, and pickup points vary", "The area covers busy blocks and hotels with very different room, price, and reset patterns", "Compare named downtown hotels and the complete stay"],
      ["Lincoln Park", "Zoo, lakefront green space, and neighborhood time lead the trip", "Keeps a younger-child day and local meals near the chosen base", "Test the exact hotel-to-park route and every planned downtown or Museum Campus transfer", "It trades a central downtown address for a more neighborhood-led itinerary", "Choose the exact property before assuming the route works"],
      ["Loop / Millennium Park", "Millennium Park, Maggie Daley Park, the Art Institute, or Loop architecture lead", "Puts several downtown park and cultural anchors in one planning zone", "Check the exact entrance, CTA station accessibility, current elevator alerts, and the return after dinner", "The best block for daytime anchors may not fit the family's evening meal or room priorities", "Map the full day, not just the morning stop"],
      ["South Loop / Museum Campus", "Field Museum, Shedd Aquarium, and lakefront time are major anchors", "Reduces the need to treat Museum Campus as an add-on to every day", "Map the exact hotel route to each museum and every separate downtown or neighborhood day", "A museum-led base can add transfers when the rest of the itinerary is elsewhere", "Compare the museum route with the complete hotel fit"],
      ["West Loop", "Restaurants and an older-kid neighborhood experience are intentional trip anchors", "Makes food and neighborhood time part of the daily plan", "Test each hotel against Loop, river, lakefront, and Museum Campus days instead of assuming centrality", "Classic waterfront and museum anchors still need separate routes", "Use the teen and hotel guides before committing"]
    ],
    areaNote: "Use these as planning starts, not universal rankings. An exact hotel can reverse the area-level tradeoff, especially for room setup, walking, step-free transit, parking, noise, reset timing, and total price.",
    bookingHeading: "Three checks that settle the area decision",
    bookingChecks: [
      ["Put the first two days on a map", "Use exact hotel pins and attraction entrances. Include the morning anchor, likely midday return, dinner, and one weather backup before deciding that an area looks central."],
      ["Test the family reset", "Check the actual return route, current CTA service and elevator alerts, meal access, and the room routine needed for naps, early bedtime, or a slower afternoon."],
      ["Compare named hotels", "Use the Chicago hotel comparison for room setup, approximate nightly totals, pool or kitchen utility, sampled online-review observations, conflicts, and direct map links."]
    ],
    clusterHeading: "Move from area choice to the rest of the trip",
    clusterLinks: [
      ["10 family hotel options", "Compare named properties by trip style, room setup, rough nightly total, current amenities, sampled online-review observations, and map context.", "./chicago-family-hotels.html", "Compare Chicago family hotels"],
      ["Things to do with kids", "Use the 12-choice activity guide to decide whether the base should favor Museum Campus, Lincoln Park, downtown parks, the river, or lakefront time.", "../things-to-do/chicago-with-kids.html", "Open Chicago things to do with kids"],
      ["Things to do with teens", "Let an older child choose an architecture, skyline, museum, food, or lakefront anchor before finalizing the base.", "../things-to-do/chicago-with-teens.html", "Open Chicago with teens"],
      ["Family itinerary", "Sequence the chosen anchors and reset before paying for a location that only looks central on a broad map.", "../family-itinerary/chicago-with-kids.html", "Open the Chicago family itinerary"]
    ],
    faqTitle: "Chicago family stay FAQ",
    faqs: [
      ["What is a useful first area to check for a Chicago family trip?", "Check River North or Streeterville first when the river, Navy Pier, downtown meals, and classic sights lead the trip. Compare Lincoln Park for a neighborhood-and-zoo plan, the Loop for downtown parks and culture, South Loop for Museum Campus, or West Loop for a food-led older-kid visit."],
      ["Where can families compare specific Chicago hotels?", "Use the Family Tripwise Chicago family-hotel comparison for ten named options with rough nightly totals, room and amenity facts, sampled recent online-review observations and conflicts, and direct map links."],
      ["Should a family rent a car in Chicago?", "Decide from the exact itinerary and hotel. Compare CTA and rideshare routes, current station accessibility and elevator alerts, hotel parking, and any car-seat needs before choosing; an area name alone does not settle the question."]
    ],
    sourcesIntro: "Area and transport sources checked July 23, 2026. Recheck current service, elevator status, construction, events, and exact hotel routes near the trip.",
    sources: [
      ["Choose Chicago where-to-stay area overview", "https://www.choosechicago.com/blog/hotels/where-to-stay-in-chicago/"],
      ["Choose Chicago River North", "https://www.choosechicago.com/neighborhoods/river-north/"],
      ["Choose Chicago Streeterville", "https://www.choosechicago.com/neighborhoods/streeterville/"],
      ["Choose Chicago Lincoln Park", "https://www.choosechicago.com/neighborhoods/lincoln-park/"],
      ["Choose Chicago Loop", "https://www.choosechicago.com/neighborhoods/loop/"],
      ["Choose Chicago South Loop", "https://www.choosechicago.com/neighborhoods/south-loop/"],
      ["Choose Chicago West Loop", "https://www.choosechicago.com/neighborhoods/west-loop/"],
      ["CTA maps", "https://www.transitchicago.com/maps/"],
      ["CTA accessible transit", "https://www.transitchicago.com/accessibility/default.aspx"],
      ["CTA system and elevator alerts", "https://www.transitchicago.com/alerts/"],
      ["Field Museum photo source and attribution (CC BY-SA 4.0)", "https://commons.wikimedia.org/wiki/File:Sue_the_T._Rex_at_the_Field_Museum.jpg"],
      ["CC BY-SA 4.0 license", "https://creativecommons.org/licenses/by-sa/4.0/"],
      ["Field Museum: where SUE is now (read Nov 7, 2026)", "https://www.fieldmuseum.org/page/visiting-sue-t-rex-what-know-you-go"]
    ]
  },
  "where-to-stay/san-antonio-with-kids.html": {
    title: "Where to Stay in San Antonio With Kids: 5 Areas Compared",
    description:
      "Compare five San Antonio family stay areas by the first two days, midday reset, transport reality, theme-park anchor, main friction, and exact hotel check.",
    city: "San Antonio",
    schemaName: "San Antonio family stay area options",
    constraintLed: true,
    removeGeneratedBodySections: true,
    hideHotelSection: true,
    visibleFaqs: true,
    baseReplacements: [
      ["<h1>Where to stay in San Antonio with kids</h1>", "<h1>Where to Stay in San Antonio With Kids: 5 Areas Compared</h1>"],
      ["<p>Compare the best family areas in San Antonio by stroller ease, room size risk, parking, walkability, noise, pool access, and attraction proximity.</p>", "<p>Choose the base from the family's first two days and likely midday return: classic Downtown sights, Pearl and museums, younger-child anchors, SeaWorld, or Six Flags. Then compare named hotels.</p>"],
      ["<p><strong>Last updated:</strong> July 5, 2026</p>", "<p><strong>Area and transport sources checked:</strong> November 7, 2026 (Downtown, Pearl and Northwest area pages and other sources: July 26, 2026)</p>"],
      ["<p><strong>How this guide was built:</strong> Family Tripwise compares official attraction and hotel information, family logistics, search-intent research, and practical planning tradeoffs like age fit, stroller friction, weather backup, nap timing, walking distance, and lodging base.</p>", "<p>Area guidance is planning support, not a universal ranking. Exact River Walk access, transport, walking route, room exposure, parking, price, and return pattern depend on the hotel, itinerary, date, and current conditions.</p>"],
      ["<img src=\"https://commons.wikimedia.org/wiki/Special:Redirect/file/The%20San%20Antonio%20River%20Walk.jpg\" alt=\"The San Antonio River Walk with paths and restaurants along the water.\" loading=\"eager\" decoding=\"async\">", "<img src=\"https://commons.wikimedia.org/wiki/Special:Redirect/file/The%20San%20Antonio%20River%20Walk.jpg?width=1280\" alt=\"The San Antonio River Walk with paths and restaurants along the water.\" width=\"1280\" height=\"960\" loading=\"eager\" decoding=\"async\" fetchpriority=\"high\">"],
      ["<figcaption>Photo: Matt Harriger, Wikimedia Commons, CC BY-SA 2.0. <a href=\"https://commons.wikimedia.org/wiki/File:The_San_Antonio_River_Walk.jpg\">License and source</a>.</figcaption>", "<figcaption>Photo: Matt Harriger via <a href=\"https://commons.wikimedia.org/wiki/File:The_San_Antonio_River_Walk.jpg\">Wikimedia Commons</a>, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC BY-SA 2.0</a>. No editorial changes; Family Tripwise serves a resized copy.</figcaption>"]
    ],
    quickHeading: "Five useful starting points",
    quick: [
      ["First trip with classic sights", "Downtown / River Walk", "Start here when the Alamo, Downtown River Walk, Hemisfair, and nearby meals shape most of the first two days."],
      ["Pearl, food, and Museum Reach", "Pearl / Museum Reach", "Start here when Pearl time and the northern river corridor matter more than walking out to every Downtown icon."],
      ["Younger-child museum and zoo days", "Broadway / Brackenridge / Alamo Heights", "Compare exact hotels here when The DoSeum, zoo, Brackenridge Park, and a car or rideshare routine lead the plan."],
      ["SeaWorld or west-side resort trip", "Westover Hills / SeaWorld", "Use this base when SeaWorld, Aquatica, or the resort is a trip anchor rather than one distant add-on."],
      ["Six Flags and La Cantera trip", "La Cantera / Six Flags", "Use this base when Six Flags, a resort day, and nearby meals or shopping outweigh repeated Downtown returns."]
    ],
    matrixHeading: "Compare the base before the hotel",
    matrixWrapperClass: "teen-comparison",
    areaHeaders: ["Area", "Start here when", "What it simplifies", "Reset reality", "Transport reality", "Main friction", "Exact check"],
    rows: [
      ["Downtown / River Walk", "The Alamo, Downtown River Walk, Hemisfair, and central meals lead the first two days", "Keeps several first-visit anchors in the same broad district", "A hotel return works only when the exact entrance and planned stops stay close", "A car-light central plan may work. VIA bus: adults $1.30 a ride or $2.75 a day pass; kids 5-13 $0.65 a ride or $1.35 a day pass; 4 and under free (read Nov 7). Day passes for 2 adults and 2 kids 5-13: about $8.20, our sum. Map every non-Downtown day", "River-level access, crowds, events, room exposure, parking, and price vary by block and hotel", "Map the hotel entrance, River Walk access point, first two days, and complete hotel total"],
      ["Pearl / Museum Reach", "Pearl, Museum Reach, food, or the northern river corridor leads the plan", "Keeps Pearl meals and part of the river experience near the base", "Useful for Pearl-led time; it does not make every Downtown or theme-park return short", "Walking, river routes, rideshare, car, and VIA usefulness depend on the exact hotel and stop", "Hotel inventory, price, and access to other signature sights can narrow the area advantage", "Compare exact hotel options, river access, both first-day routes, and the Downtown return"],
      ["Broadway / Brackenridge / Alamo Heights", "The DoSeum, zoo, Brackenridge Park, Witte, or local meals shape younger-child days", "Can keep several cultural-corridor anchors in one broad zone", "The return depends on the exact hotel; the neighborhood label alone does not prove a quick nap reset", "Plan on exact car, rideshare, or VIA routes for Downtown and every other zone", "Hotels and walk-out meal options vary across a broad corridor", "Pin the hotel, attraction entrances, meals, transport, and the complete room setup"],
      ["Westover Hills / SeaWorld", "SeaWorld, Aquatica, or a west-side resort is a main trip anchor", "Keeps the largest west-side day and possible resort reset near the base", "Useful on park/resort days; Downtown, Pearl, zoo, and Six Flags remain separate trips", "A car or deliberate rideshare plan is the default hypothesis to verify", "A park-adjacent label does not establish the room, pool, fee, meal, or gate route", "Confirm the exact park plan, hotel-to-gate route, room function, total price, and every central-city day"],
      ["La Cantera / Six Flags", "Six Flags, a La Cantera resort day, or nearby meals and shopping lead the trip", "Keeps the northwestern anchor and property-led time together", "Useful for Six Flags/resort days; it does not shorten SeaWorld or Downtown returns", "Visit San Antonio puts it about 25 minutes north of Downtown (it does not say by car or bus). Plan exact car or rideshare routes and price every Downtown visit separately", "This is a car-based base unless the exact trip stays within the district", "Confirm park dates, exact hotel route, room and pool function, complete price, and central-city plan"]
    ],
    areaNote: "Use these as route starts, not universal rankings. The exact hotel can reverse the area-level tradeoff through River Walk access, transport, room setup, parking, price, block conditions, and the family's first two days.",
    bookingHeading: "Three decisions that settle the base",
    bookingChecks: [
      ["The River Walk is not one interchangeable hotel pin", "Downtown River Walk and Museum Reach create different routes. The River Walk site has accessibility maps for the Downtown River Bend (accessible entrances and routes) and Museum Reach, read Nov 7. Use them, then pin the exact hotel entrance, river access point, attraction entrances, and likely midday return."],
      ["SeaWorld and Six Flags are different stay bases", "Westover Hills/SeaWorld and La Cantera/Six Flags solve different park and resort days. Map both theme parks, every Downtown day, meals, and the hotel reset before grouping them as northwest."],
      ["Choose the area, then compare the named hotel", "Use the 12-hotel guide for room function, broad total-night ranges, pool or resort role, included-food or kitchen utility, current official facts, bounded online-review observations, and maps."]
    ],
    clusterHeading: "Move from the base to the rest of the trip",
    clusterLinks: [
      ["12 family hotel options", "Compare named properties by area, room function, broad total-night range, pool or resort role, included-food or kitchen utility, and bounded recent online-review observations.", "./san-antonio-family-hotels.html", "Compare San Antonio family hotels"],
      ["Things to do with kids", "Use the 13-choice activity guide to decide whether the base should favor Downtown, Pearl and museums, a younger-child corridor, or a theme park.", "../things-to-do/san-antonio-with-kids.html", "Open San Antonio things to do with kids"],
      ["Things to do with teens", "Let the older child choose a thrill, culture, sport, food, or adventure anchor before finalizing the family base.", "../things-to-do/san-antonio-with-teens.html", "Open San Antonio with teens"],
      ["Family itinerary", "Sequence the first two days and one realistic reset before paying for a location that only looks central on a broad map.", "../family-itinerary/san-antonio-with-kids.html", "Build the San Antonio family itinerary"]
    ],
    faqTitle: "San Antonio family stay FAQ",
    faqs: [
      ["Does an airport-area hotel save money for a San Antonio family trip?", "Treat an airport-area rate as a price hypothesis, not an automatic value. Compare the complete hotel total, parking, meals, rides or fuel, and every return from the family's first two days before trading a visitor base for a lower room rate."],
      ["Should families stay on the San Antonio River Walk?", "A River Walk stay can work when the family's main Downtown or Museum Reach plans match that exact section. Compare the hotel entrance, river access map, first two days, room setup, parking or transport, and complete price rather than treating every River Walk hotel as the same location."],
      ["Where can families compare specific San Antonio hotels?", "Use the Family Tripwise San Antonio family-hotel comparison for 12 named options with broad total-night ranges, room and amenity facts, bounded recent online-review observations, conflicts, and direct map links."]
    ],
    sourcesIntro: "Neighborhood guide, La Cantera and Alamo Heights pages, River Walk maps and VIA fares read November 7, 2026 (day passes for 2 adults and 2 kids aged 5-13 come to about $8.20 a day, our sum). Downtown, Pearl and Northwest area pages and other sources checked July 26, 2026. Recheck current access maps, VIA service, events, construction, attraction operations, and exact hotel routes near the trip.",
    sources: [
      ["Visit San Antonio neighborhood guide", "https://www.visitsanantonio.com/plan-your-trip/neighborhood-guide/"],
      ["Visit San Antonio Downtown", "https://www.visitsanantonio.com/plan-your-trip/neighborhood-guide/downtown/"],
      ["Visit San Antonio Pearl / Midtown", "https://www.visitsanantonio.com/plan-your-trip/neighborhood-guide/pearl-district/"],
      ["Visit San Antonio Alamo Heights", "https://www.visitsanantonio.com/plan-your-trip/neighborhood-guide/alamo-heights/"],
      ["Visit San Antonio Northwest / SeaWorld", "https://www.visitsanantonio.com/plan-your-trip/neighborhood-guide/northwest/"],
      ["Visit San Antonio La Cantera / Six Flags", "https://www.visitsanantonio.com/plan-your-trip/neighborhood-guide/la-cantera-district/"],
      ["VIA fares", "https://www.viainfo.net/fares/"],
      ["VIA quick start guide (kids' fares)", "https://www.viainfo.net/new-rider/"],
      ["VIA trip planning", "https://www.viainfo.net/trip-planning/"],
      ["VIA how to ride and accessibility", "https://www.viainfo.net/how-to-ride/"],
      ["San Antonio River Walk maps and accessibility guides", "https://www.thesanantonioriverwalk.com/plan-your-trip/maps/"],
      ["The DoSeum visit information", "https://www.thedoseum.org/visit"],
      ["San Antonio Zoo plan a visit", "https://sazoo.org/visit/"],
      ["San Antonio photo source and attribution", "https://commons.wikimedia.org/wiki/File:The_San_Antonio_River_Walk.jpg"],
      ["CC BY-SA 2.0 license", "https://creativecommons.org/licenses/by-sa/2.0/"]
    ]
  }
};

export const itineraryPages = {
  "family-itinerary/chicago-with-kids.html": {
    title: "Chicago Itinerary With Kids: Realistic 1, 2 and 3 Day Plans",
    description:
      "Plan one, two or three realistic Chicago days with kids: family-of-4 ticket costs, one part of the city a day, and swaps for age and weather.",
    city: "Chicago",
    schemaName: "Chicago family itinerary lengths",
    removeGeneratedItinerarySections: true,
    visibleFaqs: true,
    baseReplacements: [
      ["<h1>Chicago itinerary with kids</h1>", "<h1>Chicago Itinerary With Kids: Realistic 1, 2 and 3 Day Plans</h1>"],
      ["<p>A starter family itinerary for Chicago with morning, afternoon, and evening pacing, rainy-day swaps, and age adjustments.</p>", "<p>Three realistic plans for kids 6 and 9: one part of the city a day, with a break built in. Swap stops for age, weather and your hotel.</p>"],
      ["<p><strong>Last updated:</strong> July 5, 2026</p>", "<p><strong>Prices checked:</strong> November 2, 2026. <strong>Other sources:</strong> July 23, 2026</p>"],
      ["<p><strong>How this guide was built:</strong> Family Tripwise compares official attraction and hotel information, family logistics, search-intent research, and practical planning tradeoffs like age fit, stroller friction, weather backup, nap timing, walking distance, and lodging base.</p>", "<p>These plans are our suggestions, built from official pages. Check tickets, hours and your route for your dates.</p>"],
      ["<img src=\"https://commons.wikimedia.org/wiki/Special:Redirect/file/Millennium%20park%2Cchicago.JPG\" alt=\"Millennium Park in Chicago at dusk.\" loading=\"eager\" decoding=\"async\">", "<img src=\"https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Nature_Boardwalk_Lincoln_Park.JPG/1280px-Nature_Boardwalk_Lincoln_Park.JPG\" style=\"object-position:50% 56%\" alt=\"People walk across a bridge over the Lincoln Park Zoo Nature Boardwalk pond, with the Chicago skyline behind.\" loading=\"eager\" decoding=\"async\">"],
      ["<figcaption>Photo: Behnazkhazai, Wikimedia Commons, CC BY-SA 3.0. <a href=\"https://commons.wikimedia.org/wiki/File:Millennium_park,chicago.JPG\">License and source</a>.</figcaption>", "<figcaption>Nature Boardwalk at Lincoln Park Zoo, the free zoo in this plan, October 2010 (an older photo). Photo: Alanscottwalker via <a href=\"https://commons.wikimedia.org/wiki/File:Nature_Boardwalk_Lincoln_Park.JPG\">Wikimedia Commons</a>, <a href=\"https://creativecommons.org/licenses/by-sa/3.0/\">CC BY-SA 3.0</a>. Resized.</figcaption>"]
    ],
    links: {
      allAges: "../things-to-do/chicago-with-kids.html",
      stay: "../where-to-stay/chicago-with-kids.html",
      teen: "../things-to-do/chicago-with-teens.html"
    },
    clusterCards: [
      ["Choose the main stop", "Compare 12 current choices by age, weather, cost, pace, and planning friction before placing one into the day.", "../things-to-do/chicago-with-kids.html", "Open Chicago things to do with kids"],
      ["Give teens one real choice", "Use the older-kid guide when architecture, science, art, skyline, sports, movement, immersive media, or comedy should shape the route.", "../things-to-do/chicago-with-teens.html", "Open Chicago with teens"],
      ["Choose the stay area", "Compare River North, Streeterville, Lincoln Park, the Loop, and South Loop before assuming a map pin reflects the daily effort.", "../where-to-stay/chicago-with-kids.html", "Compare Chicago stay areas"],
      ["Compare named hotels", "Use the ten-hotel page for rough nightly totals, room setup, pool role, official facts, sampled online-review themes, and maps.", "../where-to-stay/chicago-family-hotels.html", "Compare Chicago family hotels"]
    ],
    answerBox: {
      id: "chicago-itinerary-answer",
      checked: "November 2, 2026",
      plan: {
        label: "Family of 4 tickets, estimate: 2 adults, kids 6 and 9",
        tickets: {
          childrensMuseum: { adult: 25, child: 25 },
          zoo: { adult: 0, child: 0 },
          artInstitute: { adult: 32, child: 0 }
        },
        days: [
          ["1 day", "Children's Museum at Navy Pier, hotel break, easy dinner", ["childrensMuseum"]],
          ["2 days", "Add Lincoln Park Zoo on day 2 (free)", ["childrensMuseum", "zoo"]],
          ["3 days", "Add the Art Institute and Millennium and Maggie Daley parks", ["childrensMuseum", "zoo", "artInstitute"]]
        ],
        young: "The Children's Museum costs the same from age 1. On day 3, skip the Art Institute: use Maggie Daley Park (public park) in good weather, or Shedd indoors (price varies, check live). Without the Art Institute, 3 days stay \u2248 $100 plus any Shedd tickets.",
        older: "Over 9, swap the Children's Museum for the Field Museum: from \u2248 $120 for four ($30 a person, no child price shown).",
        hotels: ["Compare hotel prices", "../where-to-stay/chicago-family-hotels.html"],
        catch: "Don't plan the Children's Museum on a Tuesday (closed). Zoo gates close at 3:30 p.m. Nov 19 to Jan 3. We could not confirm the Art Institute's open days, so check first.",
        basis: "Estimate from official prices read Nov 2, 2026, at visitor rates. Children's Museum $25 each, Art Institute $32 adult and free under 14 (some exhibitions extra), zoo free (parking $35 to $45 a day after the first half hour). Hotel, food and transit extra."
      },
      collapseDayPlans: true,
      clusterEyebrow: "Next steps",
      collapseFacts: true,
      factsTitle: "Official prices and hours we used",
      factsNote: "As published on each venue's own pages, read November 2, 2026. Other venue facts on this page date from July 23, 2026. Confirm hours and prices for your exact date.",
      facts: [
        { label: "Chicago Children's Museum", text: "$25 a person for non-Illinois visitors, $21 for Illinois residents, ages 1 and up; under 1 free. Closed Tuesdays.", source: "https://www.chicagochildrensmuseum.org/hours-tickets-and-faq", sourceLabel: "Children's Museum tickets and hours" },
        { label: "Lincoln Park Zoo", text: "Entry is always free. Open 365 days a year from 10 a.m.; gates usually close at 5 p.m., and at 3:30 p.m. from November 19 to January 3. Parking is free for the first half hour, then $35 to $45 a day.", source: "https://www.lpzoo.org/visit/hours-location/", sourceLabel: "Zoo hours and location" },
        { label: "Art Institute of Chicago", text: "Adult $32 general admission, $27 Illinois residents, $20 Chicago residents; under 14 free. Some exhibitions cost extra.", source: "https://www.artic.edu/visit", sourceLabel: "Art Institute visit page" },
        { label: "Field Museum", text: "Starting price $30 a person, no separate child price shown; under 3 free.", source: "https://www.fieldmuseum.org/landing/tickets-and-pricing", sourceLabel: "Field Museum tickets" }
      ]
    },
    quickTitle: "Pick the trip length before the attractions",
    quick: [
      ["One day", "One part of the city, one main stop, an easy finish", "Stay around Navy Pier, the Loop or Museum Campus instead of spending a short visit in transit."],
      ["Two days", "A museum day, then a day somewhere different", "Lincoln Park and the free zoo make an easy second day. Hyde Park or Museum Campus work too."],
      ["Three days", "First count your full sightseeing days", "Partial first day: easy arrival, then two full days. Three full days: add one more part of the city, one main stop a day."]
    ],
    rows: [
      ["One-day first look", "One part of the city, one main stop, an easy finish", "Short visit or arrival/departure day", "Keep the middle or late part slow", "Your hotel and main stop set the transfer", "Choose dinner before the last stop", "A second part of the city"],
      ["Two-day first trip", "A museum day, then a day somewhere different", "Most first-time weekend families", "Protect one hotel return or slow meal", "One part of the city per half day", "Eat near where day 2 ends", "Two large museums in one day"],
      ["Three-day balanced trip", "Partial first day plus two full days, or three full days in three parts of the city", "Families who first count their full days", "Keep one stop optional daily", "Varies by hotel and stops", "Use meals as the end of each outing", "Three firm late evenings"]
    ],
    dayPlansTitle: "Use one, two, or three days without crossing the city for every headline stop",
    itineraryNote: "Our suggested order. Open a plan, then check tickets, hours and your route for your dates.",
    pivotComparisonClass: "itinerary-pivot-comparison",
    dayPlans: [
      ["One-day first look", "Short visits, train stopovers, and families who want one easy Chicago day", [
        ["First", "Chicago Children's Museum at Navy Pier (2 to 3 hours; closed Tuesdays; check entry times). On a Tuesday, use Lincoln Park Zoo, free and open every day. With kids over 9, use the Field Museum."],
        ["Then", "Lunch, then a hotel break or nap. Keep this even if the morning runs long."],
        ["Last", "A short walk or simple dinner near your hotel. This is the first thing to drop if arrival, weather or the museum runs long."]
      ], "Stop after the main stop and an easy finish. A second museum, a cross-city detour, or a late fixed ticket is the first removal."],
      ["Two-day first trip", "Most first-time families", [
        ["Day 1: Children's Museum", "Follow the one-day plan. Keep dinner and the evening close to your hotel."],
        ["Day 2: Lincoln Park Zoo", "Free entry, open every day from 10 a.m. Add the neighborhood if energy lasts, and leave earlier from Nov 19 to Jan 3 (gates close 3:30 p.m.). Swaps: Field or Shedd on Museum Campus, Griffin MSI in Hyde Park, or a teen's pick."],
        ["Keep one break", "Protect one hotel return, slow meal or free block. If Day 1 runs late, drop the Day 2 evening plan before you cut food or rest."]
      ], "Stay in one part of the city on Day 2. Don't try to combine Museum Campus, Lincoln Park, Hyde Park and Navy Pier."],
      ["Three-day balanced trip", "Families with three calendar days who first count whether Day 1 is partial or all three days are full", [
        ["First: count the full days", "A late arrival means Day 1 is partial, so use the first plan below. Otherwise use the second."],
        ["If Day 1 is partial", "Day 1 is an easy arrival near your hotel. Day 2 is the Children's Museum. Day 3 is Lincoln Park Zoo. Keep the arrival part optional."],
        ["If all three days are full", "Day 1 Children's Museum, Day 2 Lincoln Park Zoo, Day 3 the Art Institute with Millennium and Maggie Daley parks in the Loop. Check the Art Institute's open days first. Keep one main stop a day."]
      ], "Keep one stop optional each day and make only one evening a firm late plan."]
    ],
    pivotTitle: "Change the plan for age, weather, budget or your hotel",
    pivotHeaders: ["Trip constraint", "Keep", "Swap", "Watch for", "Check first"],
    pivots: [
      ["Younger child, stroller, or nap", "One short main stop and the protected break", "Use Maggie Daley, Chicago Children's Museum, Lincoln Park Zoo, or another age-fit choice instead of a long multi-zone sequence", "Exits, elevators, stroller handling, queues, weather, and return timing vary", "Exact route, current accessibility, ticket, meal, bathroom, and hotel-return plan"],
      ["Teen or mixed ages", "One stop an older kid picks", "Use the teen guide for architecture, Griffin MSI, art, skyline, Wrigley, lakefront, Flyover, or a selected show", "Exact products, age rules, younger-sibling fit, and evening return", "Ticket, content, height or minor rule, weather, and split-plan needs"],
      ["Rain, winter, heat, or low visibility", "One indoor stop and a nearby meal", "Move the outdoor or skyline block rather than forcing the original sequence", "Indoor can still mean queues, walking, stimulation, and transfers", "Venue status, forecast, transit alerts, ticket, coat/stroller storage, and backup"],
      ["Budget-led trip", "One paid stop plus free parks", "Use Millennium/Maggie Daley, Lincoln Park Zoo, or a bounded lakefront block when current conditions fit", "Parking, transit, meals, rentals, and special exhibits still cost money", "Current free admission, event closures, weather, transport, and complete daily spend"],
      ["Arrival, departure, or lodging-led route", "Keep the first and last blocks near the chosen base", "Move the farthest zone to the full day with the cleanest transport plan", "Hotel entrance, luggage, parking, station accessibility, and check-in timing", "Exact address, luggage plan, current CTA alerts, parking, and realistic return"]
    ],
    plansTitle: "Four rules that protect the itinerary",
    plans: {
      "One main job per half day": "A large museum, architecture cruise, or neighborhood visit already fills a half day. Do not add another big stop just because it is nearby on the map.",
      "Schedule the break": "Choose the hotel return, nap, quiet room time, park break, or slow meal before the day starts. Drop the next activity if the break disappears.",
      "Map the exact entrance": "A neighborhood or attraction pin does not show the actual entrance, elevator, parking garage, rideshare point, or stroller path. Check the selected route for the date.",
      "Set the evening stop rule": "Choose which evening may run late and what gets deleted when the child is done. A prepaid ticket does not make a tired family recover."
    },
    faqs: [
      ["How many days do families need in Chicago?", "Two days works for a first trip: a museum day and a day somewhere different, such as Lincoln Park Zoo. Add a third day for an easy arrival, another museum or neighborhood, or a teen's pick."],
      ["What should families skip on a short Chicago trip?", "Skip crossing the city for several stops, two large museums in one day, and a firm late ticket every evening. Keep one part of the city, one main stop, a meal plan and a clear point to stop."],
      ["How should families change the itinerary for bad weather?", "Move the main stop to one indoor attraction, keep the meal and hotel break close to it, and drop the outdoor, boat, or skyline block when conditions do not fit. Recheck venue, weather, and transit information before leaving."]
    ],
    sourcesIntro: "Ticket prices and Lincoln Park Zoo hours read November 2, 2026; other official destination, attraction, park, and transit sources checked July 23, 2026. Recheck schedules, tickets, service alerts, weather, access, and exact routes for the dates.",
    sources: [
      ["Choose Chicago two-day family itinerary", "https://www.choosechicago.com/articles/families/2-days-of-chicago-family-fun-for-every-season/"],
      ["CTA maps", "https://www.transitchicago.com/maps/"],
      ["CTA accessible transit", "https://www.transitchicago.com/accessibility/default.aspx"],
      ["CTA system and elevator alerts", "https://www.transitchicago.com/alerts/"],
      ["Field Museum plan a visit", "https://www.fieldmuseum.org/visit"],
      ["Shedd Aquarium plan a visit", "https://www.sheddaquarium.org/plan-a-visit"],
      ["Art Institute family visits", "https://www.artic.edu/visit/who-s-visiting/families"],
      ["Maggie Daley Park", "https://www.maggiedaleypark.com/things-to-do-see/play-garden/"],
      ["Lincoln Park Zoo visit information", "https://www.lpzoo.org/visit/"],
      ["Lincoln Park Zoo hours and location", "https://www.lpzoo.org/visit/hours-location/"],
      ["Art Institute visit page and prices", "https://www.artic.edu/visit"],
      ["Field Museum tickets and pricing", "https://www.fieldmuseum.org/landing/tickets-and-pricing"],
      ["Griffin Museum of Science and Industry", "https://www.griffinmsi.org/"],
      ["Chicago Architecture Center river cruise", "https://www.architecture.org/city-tours/river-cruise"],
      ["Chicago Park District Lakefront Trail", "https://www.chicagoparkdistrict.com/lakefront-trail"],
      ["Chicago Children's Museum visit information", "https://www.chicagochildrensmuseum.org/hours-tickets-and-faq"],
      ["Lincoln Park Zoo photo source and attribution (CC BY-SA 3.0)", "https://commons.wikimedia.org/wiki/File:Nature_Boardwalk_Lincoln_Park.JPG"],
      ["CC BY-SA 3.0 license", "https://creativecommons.org/licenses/by-sa/3.0/"]
    ]
  },
  "family-itinerary/las-vegas-with-kids.html": {
    title: "Las Vegas Itinerary With Kids: Realistic 1, 2 and 3 Day Plans",
    description:
      "Plan one, two or three realistic Las Vegas days with kids: family ticket costs, one main outing a day, hotel breaks, and swaps for age and heat.",
    city: "Las Vegas",
    schemaName: "Las Vegas family itinerary lengths",
    removeGeneratedItinerarySections: true,
    visibleFaqs: true,
    baseReplacements: [
      ["<h1>Las Vegas itinerary with kids</h1>", "<h1>Las Vegas Itinerary With Kids: Realistic 1, 2 and 3 Day Plans</h1>"],
      ["<p>A starter family itinerary for Las Vegas with morning, afternoon, and evening pacing, rainy-day swaps, and age adjustments.</p>", "<p>Give each day one main outing and one hotel break, then swap stops for age, heat and weather.</p>"],
      ["<p><strong>Last updated:</strong> July 5, 2026</p>", "<p><strong>Official facts read:</strong> DISCOVERY Children's Museum November 7, 2026; Springs Preserve November 2; Red Rock Canyon November 3; Omega Mart November 1; Bellagio and Shark Reef August 3 (older); other route sources July 23, 2026 (older)</p>"],
      ["<p><strong>How this guide was built:</strong> Family Tripwise compares official attraction and hotel information, family logistics, search-intent research, and practical planning tradeoffs like age fit, stroller friction, weather backup, nap timing, walking distance, and lodging base.</p>", "<p>These are suggested day plans, not timed routes. Check tickets, hours and weather for your dates.</p>"],
      ["<img src=\"https://commons.wikimedia.org/wiki/Special:Redirect/file/Bellagio%20fountain%20show%202010%20las%20vegas.JPG\" alt=\"The Bellagio fountains and Las Vegas Strip at night.\" loading=\"eager\" decoding=\"async\">", "<img src=\"https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Bellagio_fountain_show_2010_las_vegas.JPG/1280px-Bellagio_fountain_show_2010_las_vegas.JPG\" alt=\"The Bellagio fountains and Las Vegas Strip at night.\" width=\"1280\" height=\"850\" loading=\"eager\" decoding=\"async\">"],
      ["<figcaption>Photo: chensiyuan, Wikimedia Commons, CC BY-SA 4.0. <a href=\"https://commons.wikimedia.org/wiki/File:Bellagio_fountain_show_2010_las_vegas.JPG\">License and source</a>.</figcaption>", "<figcaption>Photo: Chensiyuan via <a href=\"https://commons.wikimedia.org/wiki/File:Bellagio_fountain_show_2010_las_vegas.JPG\">Wikimedia Commons</a>, <a href=\"https://creativecommons.org/licenses/by-sa/4.0/\">CC BY-SA 4.0</a>. No editorial changes; Family Tripwise serves a resized copy.</figcaption>"]
    ],
    links: {
      allAges: "../things-to-do/las-vegas-with-kids.html",
      stay: "../where-to-stay/las-vegas-with-kids.html",
      teen: "../things-to-do/las-vegas-with-teens.html"
    },
    clusterCards: [
      ["Choose your main stops", "Compare 12 current choices by age, heat, rain, budget, nap fit, and planning friction before placing one into the day.", "../things-to-do/las-vegas-with-kids.html", "Open Las Vegas things to do with kids"],
      ["Give teens one real choice", "Use the older-kid guide when a thrill, desert, immersive, skyline, history, or game stop should shape the route.", "../things-to-do/las-vegas-with-teens.html", "Open Las Vegas with teens"],
      ["Choose the base type", "Compare Center Strip, South Strip, suite, west-side, and Downtown bases before assuming the map reflects the daily effort.", "../where-to-stay/las-vegas-with-kids.html", "Compare Las Vegas stay bases"],
      ["Compare named hotels", "Use the ten-hotel page for rough nightly totals, room setup, pool role, official facts, recent online-review themes, and maps.", "../where-to-stay/las-vegas-family-hotels.html", "Compare Las Vegas family hotels"]
    ],
    answerBox: {
      id: "las-vegas-itinerary-answer",
      checked: "November 7, 2026",
      plan: {
        label: "Family of 4 tickets, estimate: 2 adults, kids 6 and 10",
        tickets: {
          discovery: { adult: 20, child: 20 },
          springs: { adult: 18.95, child: 10.95 },
          bellagio: { adult: 0, child: 0 }
        },
        days: [
          ["1 day", "DISCOVERY Children's Museum (Downtown), hotel break, Bellagio", ["discovery", "bellagio"]],
          ["2 days", "Your hotel's pool if open, then Bellagio. Next day, DISCOVERY.", ["bellagio", "discovery"]],
          ["3 days", "Arrive and rest. DISCOVERY and Bellagio. Springs Preserve.", ["discovery", "bellagio", "springs"]]
        ],
        young: "Kids 3 to 5 cost the same. Only younger kids change it: Springs Preserve is free at 2 and under, DISCOVERY under 1. Use the hotel break for naps.",
        older: "DISCOVERY is built for younger kids. Older kids can swap in Omega Mart, from \u2248 $180 for four plus any fees ($45 starting price a ticket, no child price shown, read Nov 1).",
        swapsTitle: "Kids under 6 or over 10?",
        hotels: ["Next step: compare hotel prices", "../where-to-stay/las-vegas-family-hotels.html"],
        catch: "DISCOVERY closes most Mondays and major holidays, and opens at noon Sundays. Springs Preserve closes Tuesdays and Wednesdays. The 3-day order works if you arrive Tuesday to Saturday.",
        basis: "Estimate from official prices: DISCOVERY $20 each (read Nov 7), Springs Preserve $18.95 adult, $10.95 child (read Nov 2), Bellagio free (read Aug 3). Hotel, food, parking and transport extra; taxes and online fees not checked."
      },
      collapseDayPlans: true,
      openAllDayPlans: true,
      clusterEyebrow: "Next steps",
      collapseFacts: true,
      factsTitle: "Official hours and prices: DISCOVERY, Springs Preserve, Red Rock",
      factsNote: "Each item below was read on the venue's own page on the date shown. Elsewhere on this page, Bellagio and Shark Reef facts are older (August 3, 2026) and remaining route facts older still (July 23, 2026). Confirm hours for your exact date.",
      facts: [
        { label: "DISCOVERY hours", text: "Tuesday to Saturday 10 a.m. to 5 p.m.; Sunday noon to 5 p.m. Closed Mondays, except during summer, spring and winter breaks and on select Mondays when Clark County schools are closed.", source: "https://discoverykidslv.org/hours-directions/", sourceLabel: "DISCOVERY hours page" },
        { label: "DISCOVERY holiday closures", text: "Closed Thanksgiving, Christmas Eve, Christmas Day, New Year's Day and Easter.", source: "https://discoverykidslv.org/hours-directions/", sourceLabel: "DISCOVERY hours page" },
        { label: "DISCOVERY admission", text: "General admission $20 per person ages 1-99; local admission $15 with a valid Nevada ID; everyone age 1 and up needs a ticket. Online tickets bought through a non-museum third party may not be accepted.", source: "https://discoverykidslv.org/visit/buy-tickets/", sourceLabel: "DISCOVERY tickets page" },
        { label: "DISCOVERY children", text: "Visitors under 18 must be accompanied by an adult.", source: "https://discoverykidslv.org/visit/buy-tickets/", sourceLabel: "DISCOVERY tickets page" },
        { label: "DISCOVERY visit basics", text: "Built for ages 0-12. Strollers allowed, with stroller parking next to Toddler Town. Own snacks in designated areas; no cakes or large platters. Free parking in the museum garage. No lockers.", source: "https://discoverykidslv.org/about/faq/", sourceLabel: "DISCOVERY FAQ" },
        { label: "Springs Preserve", text: "Open Thursday to Monday, 9 a.m. to 4 p.m. Visitors $18.95 per adult, $10.95 per child ages 3-17; age 2 and under free; Nevada residents $9.95 and $4.95.", source: "https://www.springspreserve.org/visitor-information/tickets.html", sourceLabel: "Springs Preserve tickets page", checked: "November 2, 2026" },
        { label: "Red Rock Canyon Scenic Drive", text: "$20 a private vehicle for the day. A timed-entry reservation is required October 1 to May 31 for entry 8 a.m. to 5 p.m. No reservation fee listed.", source: "https://www.blm.gov/programs/national-conservation-lands/nevada/red-rock-canyon-national-conservation-area/planning-your-visit", sourceLabel: "BLM Red Rock planning page", checked: "November 3, 2026" }
      ]
    },
    hideQuickSection: true,
    quickTitle: "Pick the trip length before the attractions",
    quick: [
      ["One day", "One ticketed stop, a hotel break, then Bellagio", "Keep the hotel break or a slow meal; do not turn the Strip into the activity."],
      ["Two days", "A Strip day, then one day your kids choose", "This separates the big sights from a museum, nature, or older-kid choice."],
      ["Three days", "Easy arrival, Bellagio plus one ticket, a third day out", "Use the third day for Springs Preserve, Downtown, Red Rock, or a teen choice instead of another resort walk."]
    ],
    rows: [
      ["One-day first look", "One ticketed stop, a hotel break, then Bellagio", "Short visit or road-trip stop", "Keep the middle block slow", "Property and route specific", "Choose dinner before the last activity", "A second resort loop"],
      ["Two-day first trip", "A Strip day, then one day your kids choose", "First-time families", "Protect one hotel return", "One main zone per half day", "Make one dinner deliberately easy", "Nature and a late Strip night together"],
      ["Three-day balanced trip", "Easy arrival, Bellagio plus one ticket, a third day out", "Families wanting one slower day", "Keep one block optional daily", "Varies by base and chosen anchor", "Use meals as route boundaries", "Three late evenings"]
    ],
    dayPlans: [
      ["One-day first look", "Short visits, stopovers, and families who want one recognizable Vegas moment", [
        ["First", "Start with one ticketed stop. DISCOVERY Children's Museum suits younger kids; High Roller, a current show, Shark Reef (about $106-$134 for 2 adults and 2 kids 5-12, timed or anytime entry with VR, price seen Aug 3, parking and add-ons extra, check live) or an older-kid choice are the swaps. Check the exact ticket and minor policy."],
        ["Middle", "Use the hotel, pool if access and weather fit, or a slow meal as the break. Do not add another resort just because it looks close."],
        ["Last", "Finish at the Bellagio Conservatory and fountains, free when last checked. Check the current display and fountain schedule first."]
      ], "Stop after Bellagio. A second long walk through a resort is the first thing to remove."],
      ["Two-day first trip", "Most first-time families who want spectacle plus one child-led day", [
        ["Day 1: resort + classic visual", "Start with your hotel or its pool if open, then see Bellagio and have an early meal. Keep the evening optional."],
        ["Day 2: the day your kids choose", "Choose DISCOVERY Children's Museum (Downtown) for younger children, Red Rock for an outdoor-ready car day (timed entry needed Oct to May), or one AREA15/teen choice for older kids. That stop is the whole day."],
        ["Hotel break", "Return to the hotel or end sightseeing after that stop. Do not attach Red Rock, Downtown, or a major ticket to a second long Strip evening."]
      ], "If Day 1 ran late, skip anything extra on Day 2 before cutting the meal or hotel break."],
      ["Three-day balanced trip", "Families who want a softer arrival and one day away from the resorts", [
        ["Day 1: arrive softly", "Settle into the room, buy water or snacks, use the pool only if access and conditions fit, and keep dinner close to your hotel."],
        ["Day 2: classic Las Vegas", "Pair Bellagio with one ticket, such as DISCOVERY (Downtown, so plan the ride), a skyline or a show. Put a hotel break between them rather than crossing resorts continuously."],
        ["Day 3: a third day out", "Pick Springs Preserve (open Thursday to Monday), Downtown history, Red Rock for a nature drive (book a timed-entry slot Oct to May), or a teen-chosen thrill stop. Do not combine them."]
      ], "Keep one block optional each day and make only one evening a firm late plan."]
    ],
    pivotTitle: "Change the plan for age, pool time, heat, nature, or budget",
    pivotComparisonClass: "itinerary-pivot-comparison pivot-cost-column",
    pivotHeaders: ["Trip constraint", "Keep", "Swap", "Tickets for 4, estimate", "Check first"],
    pivots: [
      ["Younger child, nap, or heat", "One indoor stop and the hotel break", "DISCOVERY or Shark Reef instead of a long outdoor or resort walk", "DISCOVERY \u2248 $80 (read Nov 7). Shark Reef about $106 to $134 for 2 adults and 2 kids 5-12 (seen Aug 3)", "Exact route and pool access"],
      ["Teen or mixed ages", "One stop your older kid picks", "The teen guide: AREA15, Red Rock, thrills, skyline, history or games", "Omega Mart from \u2248 $180 plus any fees (read Nov 1). Others: see the teen guide", "Age and height rules"],
      ["Pool-led resort trip", "Make the pool a full trip block", "Drop a sightseeing block instead of squeezing the pool between tickets", "Not priced here: pool access and fees depend on your hotel", "Guest access and open dates"],
      ["Nature or road-trip stop", "Make Red Rock the third day", "Move Bellagio to a separate short outing", "$20 a car for the day (BLM, read Nov 3); timed-entry slot needed Oct 1 to May 31 for 8 a.m. to 5 p.m. entry", "A timed-entry slot, BLM alerts and conditions"],
      ["Short or budget-led visit", "One free visual and one chosen spend", "Bellagio plus one low-commitment activity instead of several tickets", "Bellagio free (read Aug 3), plus your one ticket; parking and meals extra", "Schedules and parking"]
    ],
    baseHandoff: {
      title: "Decide whether the pool changes the base",
      note: "Pools vary by hotel. Check your hotel's guest access, open dates, room setup, fees and full stay total.",
      choices: [
        ["Most of your stops are central", "Keep one central base", "Treat the pool as a full block only at the exact booked property after confirming guest access and operating status. Do not assume a separate resort pool is available."],
        ["The pool is a main reason for the trip", "Compare a South Strip pool-led base", "Use this start only when the other plans can tolerate separate moves. Confirm the room-to-pool route, room setup, fees, and complete stay total."],
        ["The desired pool is at another property", "Price the hotel move before choosing it", "Compare check-out, luggage, check-in, room assignment, a lost hotel break, and both stay totals against keeping one base."]
      ],
      links: [
        ["Compare five Las Vegas base types", "../where-to-stay/las-vegas-with-kids.html"],
        ["Verify named hotel room, pool, and total-price checks", "../where-to-stay/las-vegas-family-hotels.html"]
      ]
    },
    plansTitle: "Four rules that protect the itinerary",
    plans: {
      "One main job per half day": "A pool, major museum, nature drive, or ticketed attraction already fills half a day. Do not add a second big stop on the way.",
      "Schedule the hotel break": "Choose the hotel return, pool, quiet room time, or slow meal before the day starts. If the break disappears, drop the next activity.",
      "Map the exact entrance": "A resort name or neighborhood pin does not show the actual entrance, rideshare pickup, indoor detour, or stroller path. Check the chosen route for the date.",
      "Set the evening stop rule": "Decide which evening is allowed to run late and what gets deleted when the child is done. A paid ticket is not worth pushing through a tired kid."
    },
    faqs: [
      ["How many days do families need in Las Vegas?", "Two days is the clearest first-trip structure: one Strip day with Bellagio and one day your kids choose. Add a third day for a softer arrival or a separate Downtown, nature, younger-child, or teen stop."],
      ["What should families skip on a short Las Vegas trip?", "Skip repeated resort crossings, multiple major tickets in one day, and a firm late plan every night. Keep Bellagio, one stop that fits your kids' ages, a meal plan, and a real stop rule."],
      ["How should families change the itinerary for heat or rain?", "Move the main block to a current indoor attraction, keep the meal and hotel break close to that choice, and drop the outdoor or pool block when conditions or access do not fit. Recheck current venue and weather information before leaving."]
    ],
    sourcesIntro: "Prices and hours read on the dates shown above. Older, not re-read: Bellagio and Shark Reef (August 3, 2026) and other official sources, checked July 23, 2026. Recheck schedules, operating status, tickets, weather, reservations, accessibility, and minor policies for the exact date.",
    sources: [
      ["Visit Las Vegas family guide", "https://www.visitlasvegas.com/experience/post/things-to-do-in-las-vegas-with-kids/"],
      ["Bellagio fountains", "https://bellagio.mgmresorts.com/en/entertainment/fountains-of-bellagio.html"],
      ["Bellagio Conservatory", "https://bellagio.mgmresorts.com/en/entertainment/conservatory-botanical-garden.html"],
      ["DISCOVERY Children's Museum FAQ (read November 7, 2026)", "https://discoverykidslv.org/about/faq/"],
      ["Shark Reef Aquarium", "https://mandalaybay.mgmresorts.com/en/entertainment/shark-reef-aquarium.html"],
      ["High Roller", "https://www.caesars.com/linq/things-to-do/attractions/high-roller"],
      ["AREA15 visit information", "https://www.area15.com/visit-us"],
      ["Red Rock Canyon NCA", "https://www.blm.gov/programs/national-conservation-lands/nevada/red-rock-canyon"],
      ["Red Rock planning your visit (read November 3, 2026)", "https://www.blm.gov/programs/national-conservation-lands/nevada/red-rock-canyon-national-conservation-area/planning-your-visit"],
      ["Springs Preserve tickets", "https://www.springspreserve.org/visitor-information/tickets.html"],
      ["Omega Mart tickets (read November 1, 2026)", "https://tickets.meowwolf.com/las-vegas/admission/timed-tickets/"],
      ["Neon Museum visit FAQ", "https://neonmuseum.org/faqs/"],
      ["Las Vegas photo source and attribution", "https://commons.wikimedia.org/wiki/File:Bellagio_fountain_show_2010_las_vegas.JPG"],
      ["CC BY-SA 4.0 license", "https://creativecommons.org/licenses/by-sa/4.0/"]
    ]
  },
  "family-itinerary/new-york-city-with-kids.html": {
    title: "New York City Itinerary With Kids: Realistic 1, 2 and 3 Day Plans",
    description:
      "Plan one, two or three realistic New York City days with kids: family-of-4 ticket costs, one part of town a day, and swaps for age, weather and budget.",
    city: "New York City",
    schemaName: "New York City family itinerary lengths",
    removeGeneratedItinerarySections: true,
    visibleFaqs: true,
    baseReplacements: [
      ["<h1>New York City itinerary with kids</h1>", "<h1>New York City Itinerary With Kids: Realistic 1, 2 and 3 Day Plans</h1>"],
      ["<p>A starter family itinerary for New York City with morning, afternoon, and evening pacing, rainy-day swaps, and age adjustments.</p>", "<p>Three realistic plans for kids 4 and 8: one part of town a day, with a break built in. Swap stops for age, weather and your hotel.</p>"],
      ["<p><strong>Last updated:</strong> July 5, 2026</p>", "<p><strong>Prices checked:</strong> November 2, 2026 (Intrepid November 1). <strong>Ferry facts, Children's Museum and Intrepid hours:</strong> November 3, 2026. <strong>Other sources:</strong> July 26, 2026</p>"],
      ["<p><strong>How this guide was built:</strong> Family Tripwise compares official attraction and hotel information, family logistics, search-intent research, and practical planning tradeoffs like age fit, stroller friction, weather backup, nap timing, walking distance, and lodging base.</p>", "<p>These plans are our suggestions. Prices and hours come from official pages; age fit and time are our estimates.</p>"],
      ["<img src=\"https://commons.wikimedia.org/wiki/Special:Redirect/file/Central%20Park%20New%20York%20City%20New%20York%2023%20cropped.jpg\" alt=\"A bridge and trees in Central Park, New York City.\" loading=\"eager\" decoding=\"async\">", "<img src=\"https://upload.wikimedia.org/wikipedia/commons/0/06/Spirit_of_America_-_Staten_Island_Ferry.jpg\" style=\"object-position:50% 44%\" alt=\"An orange Staten Island Ferry crosses New York Harbor with the Statue of Liberty behind it.\" loading=\"eager\" decoding=\"async\">"],
      ["<figcaption>Photo: Jet Lowe / National Park Service, public domain via Wikimedia Commons. <a href=\"https://commons.wikimedia.org/wiki/File:Central_Park_New_York_City_New_York_23_cropped.jpg\">License and source</a>.</figcaption>", "<figcaption>The free Staten Island Ferry passing the Statue of Liberty, May 2012 (an older photo). Photo: InSapphoWeTrust via <a href=\"https://commons.wikimedia.org/wiki/File:Spirit_of_America_-_Staten_Island_Ferry.jpg\">Wikimedia Commons</a>, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC BY-SA 2.0</a>. Resized.</figcaption>"]
    ],
    links: {
      allAges: "../things-to-do/new-york-city-with-kids.html",
      stay: "../where-to-stay/new-york-city-with-kids.html",
      teen: "../things-to-do/new-york-city-with-teens.html"
    },
    clusterCards: [
      ["Choose the main stop", "Compare 12 current choices by age, weather, cost and pace before placing one into the day.", "../things-to-do/new-york-city-with-kids.html", "Open New York City things to do with kids"],
      ["Give teens one real choice", "Use the older-kid guide when skyline, theatre, sports, art, food or a photo payoff should shape the day.", "../things-to-do/new-york-city-with-teens.html", "Open New York City with teens"],
      ["Choose the stay area", "Compare Upper West Side, Midtown, Downtown/Tribeca, Brooklyn and Long Island City by how far each day's trip back is.", "../where-to-stay/new-york-city-with-kids.html", "Compare New York City stay areas"],
      ["Compare named hotels", "Use the 12-hotel page for rough nightly totals, room setup, official facts, sampled online-review themes and maps.", "../where-to-stay/new-york-city-family-hotels.html", "Compare New York City family hotels"]
    ],
    answerBox: {
      id: "new-york-city-itinerary-answer",
      checked: "November 2, 2026",
      plan: {
        label: "Family of 4 tickets for the whole trip, estimate: 2 adults, kids 4 and 8",
        tickets: {
          childrensMuseum: { adult: 17, child: 17 },
          bronxZoo: { adult: 28.95, child: 20.95 }
        },
        days: [
          ["1 day", "Central Park (free) and the Children's Museum of Manhattan", ["childrensMuseum"]],
          ["2 days", "No new tickets: the Staten Island Ferry is free", ["childrensMuseum"]],
          ["3 days", "Add the Bronx Zoo, or the Intrepid for kids 6+ (≈ $172 total)", ["childrensMuseum", "bronxZoo"]]
        ],
        swapsTitle: "Spending less, or older kids?",
        youngLabel: "Spending less",
        olderLabel: "Older kids",
        young: "Central Park, the Staten Island Ferry and Brooklyn Bridge Park are free, so 2 days can be $0 in tickets.",
        older: "The Children's Museum is aimed at about 6 and under (our estimate). If your older child would be bored, swap in the American Museum of Natural History, whose visit page shows no price, so check live. With two kids 13 and up, the Intrepid is ≈ $152 and the Statue of Liberty ferry ≈ $104.",
        hotels: ["Compare hotel prices", "../where-to-stay/new-york-city-family-hotels.html"],
        catch: "The Children's Museum lists no Monday hours, and strollers stay at its free check. The Bronx Zoo price is its winter rate, through Mar 25, 2027.",
        basis: "Estimate from official prices read Nov 2, 2026 (Intrepid Nov 1). Children's Museum $17 online from age 1; Bronx Zoo $28.95 adult, $20.95 ages 3 to 12; Intrepid $38 adult, $28 ages 5 to 12, 4 and under free. Hotel, food, parking, fees and subway ($3 a ride per full-fare rider, read Oct 10) extra."
      },
      collapseDayPlans: true,
      clusterEyebrow: "Next steps",
      collapseFacts: true,
      factsTitle: "Official prices and hours we used",
      factsNote: "As published on each venue's own pages. Prices read November 2, 2026 (Intrepid November 1); hours and ferry facts read November 3, 2026. Other venue facts on this page date from July 26, 2026. Confirm hours and prices for your exact date.",
      facts: [
        { label: "Children's Museum of Manhattan prices", text: "Adults and children 1 to 18: $17 online, $18 in person; under 12 months free.", source: "https://cmom.org/visit/", sourceLabel: "Children's Museum visit page" },
        { label: "Children's Museum hours and strollers", text: "Tuesday to Sunday, 10 a.m. to 5 p.m.; Monday is not listed. 212 West 83rd Street. Walk-up tickets are available, but reserving holds your spot. Strollers are not allowed in exhibit areas; stroller and coat check is free.", checked: "November 3, 2026", source: "https://cmom.org/plan-your-visit/", sourceLabel: "Children's Museum plan your visit" },
        { label: "Staten Island Ferry", text: "The ride is free and takes about 25 minutes, between Whitehall Terminal in Lower Manhattan and St. George Terminal. The page does not say whether you may stay on board for the return, so plan to get off and reboard.", checked: "November 3, 2026", source: "https://www.nyc.gov/html/dot/html/ferrybus/sif-traveler-info.shtml", sourceLabel: "Staten Island Ferry traveler information" },
        { label: "Bronx Zoo", text: "Winter season through March 25, 2027: adult 13 and up $28.95; child 3 to 12 $20.95; 2 and under free. Car parking $22. We did not record its hours, so check your day.", source: "https://bronxzoo.com/plan-your-visit/hours-and-rates", sourceLabel: "Bronx Zoo hours and rates" },
        { label: "Intrepid Museum prices", text: "Adults 13 to 64 $38; children 5 to 12 $28; 4 and under free; add-ons extra. For kids 4 and 8, ≈ $104 for four; when the younger child turns 5, ≈ $132.", checked: "November 1, 2026", source: "https://intrepidmuseum.org/plan-your-visit/visitor-information/tickets", sourceLabel: "Intrepid tickets" },
        { label: "Intrepid Museum hours", text: "October 1 to March 31: daily 10 a.m. to 5 p.m., last entry 4 p.m. Closed Thanksgiving and Christmas Day. Hours can change daily.", checked: "November 3, 2026", source: "https://intrepidmuseum.org/plan-your-visit/visitor-information", sourceLabel: "Intrepid visitor information" },
        { label: "American Museum of Natural History", text: "Its visit page shows no prices. New York, New Jersey and Connecticut residents with ID choose what they pay for general admission.", source: "https://www.amnh.org/plan-your-visit", sourceLabel: "AMNH plan your visit" },
        { label: "Statue of Liberty ferry", text: "Adult 13 and up $26; ages 4 to 12 $17; under 4 free. Island museums cost nothing extra. Four people 13 and up ≈ $104; kids 4 and 8 ≈ $86.", source: "https://www.nps.gov/stli/planyourvisit/fees.htm", sourceLabel: "National Park Service fees" }
      ]
    },
    quickTitle: "Pick the trip length before the attractions",
    quick: [
      ["One day", "Uptown: the park and one main stop", "Do Central Park with the Children's Museum or the natural history museum. Leave Downtown and Brooklyn out."],
      ["Two days", "Uptown, then Downtown by the harbor", "Keep the park and museum day apart from the ferry, The Battery or a Brooklyn view."],
      ["Three days", "Uptown, Downtown, then one big pick", "Use the third day for the Bronx Zoo, the Intrepid, a show or a rainy-day swap."]
    ],
    rows: [
      ["One-day first look", "Uptown: the park and one main stop"],
      ["Two-day first trip", "Uptown, then Downtown by the harbor"],
      ["Three-day balanced trip", "Uptown, Downtown, then one big pick"]
    ],
    dayPlansTitle: "Your day-by-day plans",
    itineraryNote: "Our suggested order. Open a plan, then check tickets, hours and your route for your dates.",
    pivotComparisonClass: "itinerary-pivot-comparison",
    dayPlans: [
      ["One-day first look", "Short visits and first-time families who want one easy New York City day (not a Monday if you want the Children's Museum)", [
        ["First", "The Children's Museum of Manhattan on West 83rd Street, from 10 a.m. Older kids: the American Museum of Natural History instead. Pick two or three halls before you go in."],
        ["Then", "Lunch, then Central Park or a hotel break. Keep this even if the morning runs long."],
        ["Last", "A playground, a neighborhood dinner or an early trip back. Add a Midtown ticket only if you drop something else."]
      ], "Stop after one big stop and an easy finish. Downtown, Brooklyn and a second ticket are the first things to leave out."],
      ["Two-day first trip", "Weekend families who want a park and museum day, then one harbor view", [
        ["Day 1: Uptown", "Follow the one-day plan. Keep dinner and the evening close to your hotel."],
        ["Day 2: Downtown", "Ride the free Staten Island Ferry from Whitehall Terminal, about 25 minutes each way, then walk over to The Battery. Or go to Brooklyn Bridge Park instead. Pick one."],
        ["Keep one break", "Protect one free afternoon or hotel return. If Day 1 runs late, drop the Day 2 extras before you cut food or rest."]
      ], "Don't add the Statue of Liberty, a bridge walk, Brooklyn and a Broadway show to Day 2."],
      ["Three-day balanced trip", "Families who want two set days plus one big pick", [
        ["Day 1: Uptown", "Follow the one-day plan, with a clear way back to the hotel."],
        ["Day 2: Downtown", "The ferry and The Battery, with a meal or indoor stop ready if the weather turns."],
        ["Day 3: one big pick", "The Bronx Zoo works for both ages but is mostly outdoors, so pick a dry day. The Intrepid (planes, a carrier, the Space Shuttle) and the Statue of Liberty ferry (≈ $86 for your four) suit kids about 6 and up, by our estimate. Any of these fills the day."]
      ], "Keep one stop optional each day, and plan only one late evening."]
    ],
    pivotTitle: "Change the plan for age, weather, budget or your hotel",
    pivotTableLabel: "New York City itinerary constraint comparison. Scroll horizontally for all columns.",
    pivotHeaders: ["If this is your trip", "Keep", "Swap", "Watch for", "Check first"],
    pivots: [
      ["Younger child, nap or stroller", "One short stop and the protected break", "Use one playground or the Children's Museum instead of a long multi-stop day", "Station elevators, entrances, queues, noise and the trip back to the hotel vary", "MTA route and elevator status, meal, bathroom and hotel-return plan"],
      ["Teen or mixed ages", "One stop an older kid picks", "Use the teen guide for skyline, theatre, sports, art or food", "Show content, younger-sibling fit, cost and the evening trip back", "Ticket, age rule, weather and whether you can split up"],
      ["Rain, heat, cold or poor air", "One indoor stop and a nearby meal", "Move the ferry, park, bridge or skyline stop instead of forcing the plan", "Indoor can still mean queues, walking, noise and transfers", "Forecast, venue status, MTA alerts, ticket and coat or stroller check"],
      ["Budget trip", "One paid stop plus free time", "Use Central Park, the Staten Island Ferry or Brooklyn Bridge Park", "Transit, meals, special exhibits and extras still cost money", "Operating status, weather, event closures and transit"],
      ["Arrival, departure or hotel location", "Keep the first and last parts of the trip near your hotel", "Move the farthest stop to the full day with the easiest way back", "Hotel entrance, luggage, station elevators, check-in time", "Exact address, luggage plan, MTA service and elevators"]
    ],
    plansTitle: "Four rules that protect the itinerary",
    plans: {
      "One part of town a day": "A big museum, the ferry, the park or a show can fill half a day. Don't add another big stop because it's nearby.",
      "Schedule the break": "Choose the meal, hotel return, nap or park break before the day starts. If the break disappears, drop the next activity.",
      "Check the station and the entrance": "A neighborhood pin doesn't show the working elevator, the ferry terminal or the stroller route. Check MTA and the venue near your trip.",
      "Decide what to drop": "Choose which evening can run late and what goes when your child is done. A prepaid ticket won't help a tired kid."
    },
    faqs: [
      ["How many days should a family spend in New York City?", "Two full days work for a first trip: an Uptown day with Central Park and a museum, then a Downtown day with the free ferry and The Battery. A third day adds room for the Bronx Zoo, the Intrepid or a rainy-day swap."],
      ["What should families skip on a short New York City trip?", "Skip crossing the city for several stops, more than one big stop in a half day, and a late ticket every evening. Keep one part of town, one main stop, a meal or break, and a clear point to stop."],
      ["How should families change the itinerary for bad weather?", "Move the main stop to one indoor choice, keep the meal and hotel break close to it, and drop the ferry, park, bridge or skyline stop when conditions do not fit. Recheck venue, weather and MTA information before leaving."]
    ],
    sourcesIntro: "Ticket prices read November 2, 2026 (Intrepid November 1); ferry facts and Children's Museum and Intrepid hours read November 3, 2026; subway fare read October 10, 2026; other official attraction, park, theatre and transit sources checked July 26, 2026. Recheck schedules, service and elevator status, tickets, weather, access and exact routes for your dates.",
    sources: [
      ["Children's Museum of Manhattan visit and prices", "https://cmom.org/visit/"],
      ["Children's Museum of Manhattan plan your visit", "https://cmom.org/plan-your-visit/"],
      ["Bronx Zoo hours and rates", "https://bronxzoo.com/plan-your-visit/hours-and-rates"],
      ["Intrepid Museum tickets", "https://intrepidmuseum.org/plan-your-visit/visitor-information/tickets"],
      ["Intrepid Museum visitor information", "https://intrepidmuseum.org/plan-your-visit/visitor-information"],
      ["Statue of Liberty fees (National Park Service)", "https://www.nps.gov/stli/planyourvisit/fees.htm"],
      ["Staten Island Ferry traveler information", "https://www.nyc.gov/html/dot/html/ferrybus/sif-traveler-info.shtml"],
      ["OMNY fares", "https://omny.info/fares"],
      ["MTA trip and service information", "https://www.mta.info/"],
      ["MTA accessible stations", "https://www.mta.info/accessibility/stations"],
      ["MTA elevator and escalator status", "https://www.mta.info/elevator-escalator-status"],
      ["American Museum of Natural History plan a visit", "https://www.amnh.org/plan-your-visit"],
      ["AMNH accessibility", "https://www.amnh.org/plan-your-visit/accessibility"],
      ["AMNH sensory resources", "https://www.amnh.org/plan-your-visit/accessibility/sensory-resources-for-visitors"],
      ["Central Park Conservancy visitor information", "https://www.centralparknyc.org/"],
      ["NYC DOT Staten Island Ferry schedule", "https://www.nyc.gov/html/dot/html/ferrybus/siferryschedule.shtml"],
      ["The Battery visitor information", "https://www.thebattery.org/"],
      ["Brooklyn Bridge Park visitor information", "https://brooklynbridgepark.org/"],
      ["Broadway League current shows and advisories", "https://www.broadway.org/shows"],
      ["Staten Island Ferry photo source and attribution (CC BY-SA 2.0)", "https://commons.wikimedia.org/wiki/File:Spirit_of_America_-_Staten_Island_Ferry.jpg"],
      ["CC BY-SA 2.0 license", "https://creativecommons.org/licenses/by-sa/2.0/"]
    ]
  },
  "family-itinerary/san-antonio-with-kids.html": {
    title: "San Antonio Itinerary With Kids: Realistic 1, 2 and 3 Day Plans",
    description:
      "Plan one, two or three realistic San Antonio days with kids: family-of-4 ticket costs, one main stop at a time, and swaps for age, heat and budget.",
    city: "San Antonio",
    schemaName: "San Antonio family itinerary lengths",
    removeGeneratedItinerarySections: true,
    visibleFaqs: true,
    baseReplacements: [
      ["<h1>San Antonio itinerary with kids</h1>", "<h1>San Antonio Itinerary With Kids: Realistic 1, 2 and 3 Day Plans</h1>"],
      ["<p>A starter family itinerary for San Antonio with morning, afternoon, and evening pacing, rainy-day swaps, and age adjustments.</p>", "<p>Three realistic plans for kids 4 and 8: one main stop at a time, with a break built in. Swap stops for age, heat and your hotel.</p>"],
      ["<p><strong>Last updated:</strong> July 5, 2026</p>", "<p><strong>Prices checked:</strong> November 1, 2026. <strong>Hours and Alamo entry:</strong> October 27, 2026. <strong>Other sources:</strong> July 27, 2026</p>"],
      ["<p><strong>How this guide was built:</strong> Family Tripwise compares official attraction and hotel information, family logistics, search-intent research, and practical planning tradeoffs like age fit, stroller friction, weather backup, nap timing, walking distance, and lodging base.</p>", "<p>These plans are our suggestions, built from official pages. Check tickets, hours and your route for your dates.</p>"],
      ["<img src=\"https://commons.wikimedia.org/wiki/Special:Redirect/file/The%20San%20Antonio%20River%20Walk.jpg\" alt=\"The San Antonio River Walk with paths and restaurants along the water.\" loading=\"eager\" decoding=\"async\">", "<img src=\"https://commons.wikimedia.org/wiki/Special:Redirect/file/The%20San%20Antonio%20River%20Walk.jpg?width=1280\" alt=\"The San Antonio River Walk with paths and restaurants along the water.\" width=\"1280\" height=\"960\" loading=\"eager\" decoding=\"async\" fetchpriority=\"high\">"],
      ["<figcaption>Photo: Matt Harriger, Wikimedia Commons, CC BY-SA 2.0. <a href=\"https://commons.wikimedia.org/wiki/File:The_San_Antonio_River_Walk.jpg\">License and source</a>.</figcaption>", "<figcaption>Photo: Matt Harriger via <a href=\"https://commons.wikimedia.org/wiki/File:The_San_Antonio_River_Walk.jpg\">Wikimedia Commons</a>, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC BY-SA 2.0</a>. No editorial changes; Family Tripwise serves a resized copy.</figcaption>"]
    ],
    links: {
      allAges: "../things-to-do/san-antonio-with-kids.html",
      stay: "../where-to-stay/san-antonio-with-kids.html",
      teen: "../things-to-do/san-antonio-with-teens.html"
    },
    clusterCards: [
      ["Choose the main stop", "Compare 13 current choices by age, weather, cost and pace before placing one into the day.", "../things-to-do/san-antonio-with-kids.html", "Open San Antonio things to do with kids"],
      ["Give teens one real choice", "Use the older-kid guide when adventure, coasters, competition, history, art, food, or a photo payoff should shape the route.", "../things-to-do/san-antonio-with-teens.html", "Open San Antonio with teens"],
      ["Choose the stay area", "Compare Downtown, Pearl, Broadway/Brackenridge, SeaWorld/Westover Hills and La Cantera by how far each day's trip back is.", "../where-to-stay/san-antonio-with-kids.html", "Compare San Antonio stay areas"],
      ["Compare named hotels", "Use the 12-hotel page for rough nightly prices, room setup, official facts, sampled online-review themes and maps.", "../where-to-stay/san-antonio-family-hotels.html", "Compare San Antonio family hotels"]
    ],
    answerBox: {
      id: "san-antonio-itinerary-answer",
      checked: "November 1, 2026",
      plan: {
        label: "Family of 4 tickets for the whole trip, estimate: 2 adults, kids 4 and 8",
        tickets: {
          alamoExhibit: { adult: 15, child: 11 },
          doseum: { adult: 18, child: 18 },
          witte: { adult: 17, child: 11 }
        },
        days: [
          ["1 day", "The Alamo (church free, exhibit paid), hotel break, short River Walk stroll", ["alamoExhibit"]],
          ["2 days", "Add The DoSeum, a hands-on children's museum", ["alamoExhibit", "doseum"]],
          ["3 days", "Add the Witte Museum, or the zoo from ≈ $32 instead", ["alamoExhibit", "doseum", "witte"]]
        ],
        swapsTitle: "Spending less, or kids 13 and up?",
        youngLabel: "Spending less",
        olderLabel: "Kids 13 and up",
        young: "Skip the Alamo exhibit and tour only the free church: 1 day $0 in tickets, 2 days ≈ $72. Witte is free for 3 and under, The DoSeum for under 1.",
        older: "The Alamo exhibit is the $15 adult price and Witte is $16. Swap a day for a theme park if that's the trip: Six Flags from ≈ $196 or SeaWorld from ≈ $216 for four, with parking, taxes and fees extra.",
        hotels: ["Compare hotel prices", "../where-to-stay/san-antonio-family-hotels.html"],
        catch: "Reserve the free Alamo church ticket first. The DoSeum is closed Tuesdays and opens at noon Sundays, so on a weekend go Saturday. Check its closure notice.",
        basis: "Estimate from official prices read Nov 1, 2026. Alamo exhibit $15 adult, $11 child 12 and under; DoSeum $18 from age 1; Witte $17 adult, $11 ages 4 to 12 (special exhibits extra). Zoo instead of Witte: from ≈ $32 (\"as low as\" $8 each), so 3 days from ≈ $156. Hotel, food and transit extra."
      },
      collapseDayPlans: true,
      clusterEyebrow: "Next steps",
      collapseFacts: true,
      factsTitle: "Official prices and hours we used",
      factsNote: "As published on each venue's own pages. Prices read November 1, 2026; DoSeum hours and Alamo church entry read October 27, 2026. Other venue facts on this page date from July 27, 2026. Confirm hours and prices for your exact date.",
      facts: [
        { label: "The Alamo church", text: "Touring the church is free, but you need to reserve a free ticket ahead of the visit. The page does not state a walk-up policy or how far ahead tickets open. The listing says daily 9 a.m. to 5 p.m.; the site footer says 9 a.m. to 5:30 p.m. with last entry 30 minutes before closing, so check your ticket time.", checked: "October 27, 2026", source: "https://www.thealamo.org/visit/calendar/alamo-free-timed-entry", sourceLabel: "Alamo timed-entry page" },
        { label: "Alamo exhibit (Ralston Family Collections Center)", text: "Adult $15; child 12 and under $11; military or senior 65+ $13; child military $10. No fees listed. We did not record exhibit hours, so check your day.", source: "https://www.thealamo.org/visit/tours-and-experiences/alamo-collections-center", sourceLabel: "Alamo Collections Center" },
        { label: "The DoSeum admission", text: "$18 for kids and adults age 1 and up; under 1 free.", source: "https://www.thedoseum.org/admission", sourceLabel: "DoSeum admission" },
        { label: "The DoSeum hours and parking", text: "Monday and Wednesday to Saturday 9 a.m. to 5 p.m.; Sunday noon to 5 p.m. (11 a.m. to noon is members only); closed Tuesday. Free parking for all guests. Its page also shows a closure notice as an image we could not read, so check it before going.", checked: "October 27, 2026", source: "https://www.thedoseum.org/plan-your-visit", sourceLabel: "DoSeum plan-your-visit page" },
        { label: "Witte Museum", text: "Adults 19 to 64 $17; seniors 65+ and teens 13 to 18 $16; children 4 to 12 $11; 3 and under free. Special exhibitions cost extra (amount not listed). Parking is free. We did not record its hours, so check before going.", source: "https://www.wittemuseum.org/plan-your-visit/", sourceLabel: "Witte plan your visit" },
        { label: "San Antonio Zoo", text: "Adults 12 and up and children 3 to 11 each \"as low as\" $8; 2 and under free. The zoo garage is free during zoo hours. The page does not say what sets the price, so check your date.", source: "https://sazoo.org/visit/", sourceLabel: "Zoo visit page" },
        { label: "Six Flags Fiesta Texas", text: "Starting at $49 a ticket online, date-based, with no child price and a processing fee of up to $9.99 plus taxes. Four tickets from ≈ $196 before those.", source: "https://www.sixflags.com/fiestatexas/daily-tickets", sourceLabel: "Six Flags tickets" },
        { label: "SeaWorld San Antonio", text: "Single-day ticket from $53.99, ages 3 and up. Four tickets from ≈ $216, with parking, taxes and fees extra.", source: "https://seaworld.com/san-antonio/tickets/", sourceLabel: "SeaWorld tickets" }
      ]
    },
    quickTitle: "Pick the trip length before the attractions",
    quick: [
      ["One day", "The Alamo, a break, an easy finish", "Stay Downtown. Hemisfair, a River Walk stroll or a meal can be the finish."],
      ["Two days", "A Downtown day, then a kids' day", "The DoSeum is the kids' day. The zoo, Witte or a theme park work too."],
      ["Three days", "Downtown, a kids' day, one more stop", "Use the third day for Witte, the zoo, a mission or a slower hotel day."]
    ],
    rows: [
      ["One-day first look", "The Alamo, a break, an easy finish"],
      ["Two-day first trip", "A Downtown day, then a kids' day"],
      ["Three-day balanced trip", "Downtown, a kids' day, one more stop"]
    ],
    dayPlansTitle: "Your day-by-day plans",
    itineraryNote: "Our suggested order. Open a plan, then check tickets, hours and your route for your dates.",
    pivotComparisonClass: "itinerary-pivot-comparison",
    dayPlans: [
      ["One-day first look", "Short visits and first-time families who want one easy San Antonio day", [
        ["First", "The Alamo: reserve the free church ticket, then add the paid exhibit if your kids will enjoy it. Decide before you arrive."],
        ["Then", "Lunch, then a hotel break or nap. Keep this even if the morning runs long."],
        ["Last", "A short River Walk stroll, Hemisfair or a simple dinner near your hotel. GO RIO's 35-minute narrated cruise is an option (no price on its official pages Nov 1, so check live). Drop this first if heat or waiting runs long."]
      ], "Stop after the Alamo and an easy finish. Pearl, the zoo, a cave tour and a theme park are the first things to leave out."],
      ["Two-day first trip", "Weekend families who want Downtown plus one day for the kids (on a weekend, swap the days: The DoSeum Saturday, the Alamo Sunday)", [
        ["Day 1: The Alamo", "Follow the one-day plan. Keep dinner and the evening close to your hotel."],
        ["Day 2: The DoSeum", "Hands-on children's museum with free parking. Closed Tuesdays and opens at noon on Sundays. On a weekend, swap the days and go Saturday. If that doesn't work, use the zoo or Witte (check their hours). Older kids may prefer one theme park, which fills the day, or Natural Bridge Caverns (about 2 to 5 hours by our estimate, depending on the tour, plus the drive)."],
        ["Keep one break", "Protect one hotel return, slow meal or free afternoon. If Day 1 runs late, drop the Day 2 extras before you cut food or rest."]
      ], "Make Day 2 one stop. Don't combine the zoo, The DoSeum, caverns, SeaWorld, Six Flags and a late trip back Downtown."],
      ["Three-day balanced trip", "Families who want two set days plus one flexible or slower day", [
        ["Day 1: The Alamo", "Follow the one-day plan, with a clear way back to the hotel if it gets hot."],
        ["Day 2: The DoSeum", "One main stop, with the last part of the day optional. Same Tuesday and Sunday rules as above."],
        ["Day 3: Witte or the zoo", "Witte is indoors and suits a wider age range. The zoo is the outdoor choice, from ≈ $32 for four. A mission, Pearl or a slow hotel day also work; check openings and how you'll get there."]
      ], "Keep one stop optional each day, and commit to only one far-out big outing."]
    ],
    pivotTitle: "Change the plan for age, heat, budget or your hotel",
    pivotTableLabel: "San Antonio itinerary constraint comparison. Scroll horizontally for all columns.",
    pivotHeaders: ["If this is your trip", "Keep", "Swap", "Watch for", "Check first"],
    pivots: [
      ["Younger child, nap, stroller, or short visit", "One hands-on or animal stop and the protected break", "Use The DoSeum, a short Witte or zoo visit, or Hemisfair instead of a long multi-stop day", "Entrances, stroller handling, queues, heat, bathrooms and the trip back to the hotel vary", "Exact route, venue access or sensory resources, weather, ticket, meal and bathroom plan"],
      ["Teen or mixed ages", "One stop an older kid picks", "Use the teen guide for caverns, coasters, history, art or food; split up only if your family can", "Exact ticket, minor or height rule, younger-sibling fit, cost and evening return", "Ticket, age or chaperone rule, weather and transport"],
      ["Heat, storm or an outdoor closure", "One indoor or shaded stop and a nearby meal", "Move the zoo, park, mission, long River Walk or theme-park day instead of forcing the plan", "Indoor can still mean queues, noise, walking and transport", "Forecast, alerts, venue status, ticket, parking or VIA plan and hotel return"],
      ["Budget trip", "One paid stop plus free time", "Use the free Alamo church, a mission, Hemisfair or Pearl when conditions fit", "Transport, parking, meals, events, special exhibits and extras still cost money", "Current admission, event or site status, weather, transport, parking and daily spend"],
      ["Arrival, departure or hotel location", "Keep the first and last parts of the trip near your hotel", "Move the farthest stop to the full day with the easiest way back", "Hotel entrance, luggage, parking, VIA service, rideshare and check-in time", "Exact address, luggage plan, service alerts, parking and what you'd drop"]
    ],
    plansTitle: "Four rules that protect the itinerary",
    plans: {
      "One main stop at a time": "A museum, the zoo, a cave tour or a mission route can take up a half day or more, and a theme park the whole day. Don't add another big stop because it's nearby.",
      "Schedule the break": "Choose the meal, hotel return, shade or quiet indoor time before the day starts. If the break disappears, drop the next activity.",
      "One far-out big outing": "Natural Bridge, SeaWorld and Six Flags each need their own dated tickets, transport and return plan. Don't stack them.",
      "Decide what to drop": "Choose which stop goes first and how you'll get back to the hotel when weather, waiting or tired kids change the day."
    },
    faqs: [
      ["How many days should a family spend in San Antonio?", "Two days works for a first trip: a Downtown day with the Alamo, then a kids' day at The DoSeum. Add a third day for Witte, the zoo, a mission, a theme park or a slower hotel day."],
      ["What should families skip on a short San Antonio trip?", "Skip crossing the city for several stops, more than one far-out big outing, and a firm late plan after every big stop. Keep one main stop at a time, a meal or break, and a clear point to stop."],
      ["How should families change a San Antonio itinerary for heat or storms?", "Move the main stop to one indoor or shaded choice, keep the meal and hotel break close to it, and drop the zoo, park, long River Walk, mission or theme-park block when conditions do not fit. Recheck venue and weather information before leaving."]
    ],
    sourcesIntro: "Ticket prices read November 1, 2026; DoSeum hours and Alamo church entry read October 27, 2026; other official attraction, park, transit, weather and licensing sources checked July 27, 2026. Recheck schedules, service alerts, weather, tickets, access and exact routes for your dates.",
    sources: [
      ["Alamo free church timed entry", "https://www.thealamo.org/visit/calendar/alamo-free-timed-entry"],
      ["Alamo Collections Center", "https://www.thealamo.org/visit/tours-and-experiences/alamo-collections-center"],
      ["GO RIO narrated cruise overview", "https://www.goriocruises.com/overview/"],
      ["GO RIO visitor information", "https://www.goriocruises.com/visitor-information/"],
      ["Hemisfair visit information", "https://hemisfair.org/visit/"],
      ["The DoSeum plan your visit", "https://www.thedoseum.org/plan-your-visit"],
      ["The DoSeum admission", "https://www.thedoseum.org/admission"],
      ["San Antonio Zoo plan your visit", "https://sazoo.org/visit/"],
      ["Witte Museum plan your visit", "https://www.wittemuseum.org/plan-your-visit/"],
      ["San Antonio Missions basic information", "https://www.nps.gov/saan/planyourvisit/basicinfo.htm"],
      ["Natural Bridge Caverns", "https://naturalbridgecaverns.com/"],
      ["GO RIO narrated tours", "https://www.goriocruises.com/narrated-tours/"],
      ["Six Flags Fiesta Texas tickets", "https://www.sixflags.com/fiestatexas/daily-tickets"],
      ["SeaWorld San Antonio tickets", "https://seaworld.com/san-antonio/tickets/"],
      ["Six Flags Fiesta Texas hours and calendar", "https://www.sixflags.com/fiestatexas/plan-your-visit/park-hours"],
      ["SeaWorld San Antonio park information", "https://seaworld.com/san-antonio/park-info/"],
      ["VIA trip planning", "https://www.viainfo.net/trip-planning/"],
      ["VIA service alerts", "https://www.viainfo.net/service-alerts/"],
      ["National Weather Service San Antonio forecast", "https://forecast.weather.gov/MapClick.php?lat=29.4241&lon=-98.4936"],
      ["San Antonio River Walk photo source and attribution", "https://commons.wikimedia.org/wiki/File:The_San_Antonio_River_Walk.jpg"],
      ["CC BY-SA 2.0 license", "https://creativecommons.org/licenses/by-sa/2.0/"]
    ]
  },
  "family-itinerary/san-diego-with-kids.html": {
    title: "San Diego Itinerary With Kids: Realistic 1, 2 and 3 Day Plans",
    description:
      "Plan one, two or three realistic San Diego days with kids: family-of-4 ticket costs, one part of town a day, and swaps for age, weather and budget.",
    city: "San Diego",
    schemaName: "San Diego family itinerary lengths",
    removeGeneratedItinerarySections: true,
    visibleFaqs: true,
    baseReplacements: [
      ["<h1>San Diego itinerary with kids</h1>", "<h1>San Diego Itinerary With Kids: Realistic 1, 2 and 3 Day Plans</h1>"],
      ["<p>Choose a realistic one-, two-, or three-day route, then adjust the rest windows and optional stops for toddlers, teens, or rain.</p>", "<p>Three realistic plans for kids 4 and 8: one part of town a day, with a break built in. Swap stops for age, weather and your hotel.</p>"],
      ["<p><strong>Last updated:</strong> July 20, 2026</p>", "<p><strong>Prices checked:</strong> November 1, 2026 (LEGOLAND October 30). <strong>Zoo hours and parking, Balboa Park parking:</strong> November 3, 2026. <strong>Other sources:</strong> July 31, 2026</p>"],
      ["<p><strong>Source note:</strong> Official venue links are below. Age, duration, access, nap, and route labels are Family Tripwise planning estimates; confirm current conditions before the trip.</p>", "<p>These plans are our suggestions. Prices and hours come from official pages; age fit and time are our estimates.</p>"],
      ["<img src=\"../images/san-diego-zoo.webp\" alt=\"A red panda at the San Diego Zoo.\" width=\"1600\" height=\"1066\" class=\"intrinsic-photo\" loading=\"eager\" fetchpriority=\"high\" decoding=\"async\">", "<img src=\"../images/san-diego-mission-bay.webp\" width=\"1280\" height=\"982\" loading=\"eager\" fetchpriority=\"high\" decoding=\"async\" alt=\"Mission Bay in San Diego from above, with bay water, islands and nearby neighborhoods.\">"],
      ["<figcaption>Photo: Lance Anderson, Wikimedia Commons, CC0. <a href=\"https://commons.wikimedia.org/wiki/File:San_Diego_Zoo,_San_Diego,_United_States_(Unsplash_QZwf5yNopUo).jpg\">License and source</a>.</figcaption>", "<figcaption>Mission Bay, San Diego. Photo: Alfred Twu via <a href=\"https://commons.wikimedia.org/wiki/File:21a-san-diego-mission-bay.jpg\">Wikimedia Commons</a>, CC0 public domain dedication. Resized and cropped.</figcaption>"]
    ],
    links: {
      allAges: "../things-to-do/san-diego-with-kids.html",
      stay: "../where-to-stay/san-diego-with-kids.html",
      toddler: "../things-to-do/san-diego-with-toddlers.html",
      teen: "../things-to-do/san-diego-with-teens.html"
    },
    clusterCards: [
      ["Choose the main stop", "Compare the zoo, Mission Bay, Balboa Park, Birch Aquarium, La Jolla and Coronado by age, rain and cost.", "../things-to-do/san-diego-with-kids.html", "Open San Diego things to do with kids"],
      ["Toddler swaps", "Use shorter outings and a nap-first day when the youngest sets the pace.", "../things-to-do/san-diego-with-toddlers.html", "Open San Diego with toddlers"],
      ["Teen swaps", "Trade playground breaks for coast, food and more say in the plan.", "../things-to-do/san-diego-with-teens.html", "Open San Diego with teens"],
      ["Choose where to stay", "Mission Bay, Downtown, La Jolla, Coronado and Mission Valley each change how long each day's trip back is.", "../where-to-stay/san-diego-with-kids.html", "Open where to stay in San Diego with kids"]
    ],
    answerBox: {
      id: "san-diego-itinerary-answer",
      checked: "November 3, 2026",
      plan: {
        label: "Tickets only, 2 adults and kids 4 and 8, whole trip (estimate)",
        tickets: {
          zoo: { adult: 78, child: 68 },
          birch: { adult: 34.95, child: 29.95 }
        },
        days: [
          ["1 day", "The San Diego Zoo, then Balboa Park (no park ticket)", ["zoo"]],
          ["2 days", "No new tickets: Mission Bay has no entry ticket", ["zoo"]],
          ["3 days", "Add Birch Aquarium and La Jolla (Coronado ferry instead: from ≈ $364)", ["zoo", "birch"]]
        ],
        swapsTitle: "Spending less, or other ages?",
        youngLabel: "Spending less",
        olderLabel: "Other ages",
        young: "Mission Bay, La Jolla Cove and Balboa Park's outdoor space have no entry ticket, so 2 days can be $0 in tickets. On the zoo's online Value Days, the zoo is ≈ $272 instead of $292.",
        older: "Younger kids: The New Children's Museum is ≈ $90 for 2 adults and 2 kids ages 1 and up (closed Tuesdays). From age 12, the zoo charges the adult price, so two adults and two kids 12 and up pay ≈ $312.",
        hotels: ["Compare hotel prices", "../where-to-stay/san-diego-family-hotels.html"],
        catch: "Zoo parking is $16 a car, and parts of the zoo have steep grades. See the zoo's ticket page for whether the bus tour is included.",
        basis: "Estimate from official prices read Nov 1, 2026 (Birch online). Hotel, food, parking, tax and fees extra."
      },
      collapseDayPlans: true,
      openAllDayPlans: true,
      clusterEyebrow: "Next steps",
      collapseFacts: true,
      factsTitle: "Official prices and hours we used",
      factsNote: "As published on each venue's own pages. Prices read November 1, 2026 (LEGOLAND October 30); zoo hours and parking and Balboa Park parking read November 3, 2026. Confirm hours and prices for your exact date.",
      facts: [
        { label: "San Diego Zoo prices", text: "1-Day Pass any day: $78 ages 12 and up, $68 ages 3 to 11. Online Value Days on select dates: $73 and $63. For kids 4 and 8, ≈ $292 for four, or ≈ $272 on Value Days.", checked: "November 1, 2026", source: "https://zoo.sandiegozoo.org/tickets", sourceLabel: "San Diego Zoo tickets" },
        { label: "San Diego Zoo hours and access", text: "9 a.m. to 5 p.m. listed for November 1 to 25, 2026; other dates are in the page's date selector. Parts of the zoo have steep grades. Rapid 215 and Route 7 stop at the zoo.", checked: "November 3, 2026", source: "https://zoo.sandiegozoo.org/plan-your-visit", sourceLabel: "San Diego Zoo plan your visit" },
        { label: "San Diego Zoo parking", text: "$16 a car per day; same-day re-entry doesn't need a second payment. Add $0.55 if you pay by text or QR. City of San Diego residents pay $8 with advance registration.", checked: "November 3, 2026", source: "https://zoo.sandiegozoo.org/parking", sourceLabel: "San Diego Zoo parking" },
        { label: "Balboa Park parking", text: "Non-resident rates through 2026: Level 1 lots $10 for up to 4 hours or $16 a day; Level 2 lots $10 a day; Lower Inspiration Point first 3 hours free, then $10 for the day; a free tram runs from Inspiration Point, 8 a.m. to 8 p.m. The park's page says paid parking ends January 1, 2027. The zoo lists its own parking price: $16 a car.", checked: "November 3, 2026", source: "https://balboapark.org/plan-your-visit/parking/", sourceLabel: "Balboa Park parking" },
        { label: "Birch Aquarium", text: "Online $34.95 ages 13 and up, $29.95 ages 3 to 12; at the door $39.95 and $34.95. Some dates are cheaper online. 3 hours of free parking, limited spaces. For kids 4 and 8, ≈ $130 online.", checked: "November 1, 2026", source: "https://aquarium.ucsd.edu/plan-your-visit", sourceLabel: "Birch Aquarium plan your visit" },
        { label: "Mission Bay", text: "No entry ticket. Parking, food and rentals aren't priced here. Check beach and bay status for your exact stop.", checked: "July 31, 2026", source: "https://www.sandiego.gov/park-and-recreation/parks/regional/missionbay", sourceLabel: "City of San Diego Mission Bay" },
        { label: "La Jolla Cove", text: "No entry ticket. Parking and food aren't priced here. Check current beach and water status.", checked: "July 31, 2026", source: "https://www.sandiego.gov/lifeguards/beaches/cove", sourceLabel: "City of San Diego La Jolla Cove" },
        { label: "The New Children's Museum", text: "$25 adults 18 and up, $20 children 1 and up, under 1 free. 9 a.m. to 4 p.m.; closed Tuesdays.", checked: "November 1, 2026", source: "https://thinkplaycreate.org/visit/", sourceLabel: "The New Children's Museum visit page" },
        { label: "Fleet Science Center", text: "$29.95 ages 13 and up, $24.95 ages 3 to 12, 2 and under free; one dome film included. Daily 10 a.m. to 5 p.m. For kids 4 and 8, ≈ $110.", checked: "November 1, 2026", source: "https://www.fleetscience.org/hours-admission", sourceLabel: "Fleet Science Center hours and admission" },
        { label: "SeaWorld San Diego", text: "Single-Day Ticket online from $51.99 a person on the cheapest dates; parking, tax and service fees extra. Four people from ≈ $208.", checked: "November 1, 2026", source: "https://seaworld.com/san-diego/tickets/special-offers/", sourceLabel: "SeaWorld San Diego offers" },
        { label: "LEGOLAND California", text: "1-day ticket from $69 a person online, with no child price listed; parking extra. Four people from ≈ $276. In Carlsbad, so treat it as its own day.", checked: "October 30, 2026", source: "https://california-support.legoland.com/hc/en-us/articles/27043331841693-How-much-is-an-admission-ticket-to-LEGOLAND-California", sourceLabel: "LEGOLAND California admission" },
        { label: "Coronado ferry", text: "One-way tickets start at $9 a person, with no child fare shown. Four people round trip from ≈ $72.", checked: "November 1, 2026", source: "https://www.flagshipsd.com/cruises/flagship-ferry", sourceLabel: "Flagship Coronado ferry" }
      ]
    },
    quickTitle: "How many days do you have?",
    quick: [
      ["One day", "The zoo and Balboa Park", "Go early, take a break after lunch, and leave La Jolla and Coronado out."],
      ["Two days", "The zoo, then Mission Bay", "Keep one big ticket day apart from one easy, no-ticket day by the water."],
      ["Three days", "Mission Bay, the zoo, then La Jolla", "Use the third day for Birch Aquarium and the coast, or swap in the Coronado ferry."]
    ],
    rows: [
      ["One-day first look", "The zoo and Balboa Park"],
      ["Two-day first trip", "The zoo, then Mission Bay"],
      ["Three-day balanced trip", "Mission Bay, the zoo, then La Jolla"]
    ],
    dayPlansTitle: "Your day-by-day plans",
    itineraryNote: "Our suggested order. Pick a plan, then check tickets, hours and your route for your dates.",
    pivotComparisonClass: "itinerary-pivot-comparison",
    dayPlans: [
      ["One-day first look", "Short visits and first-time families who want the zoo without crossing the city", [
        ["First", "The San Diego Zoo at opening (9 a.m. listed November 1 to 25). Allow 4 to 6 hours including lunch (our estimate), and pick a few animals rather than every zone."],
        ["Then", "A hotel break or shade after the zoo. Keep this even if the zoo runs long."],
        ["Last", "A walk in Balboa Park or the hotel pool, only if everyone still has energy."]
      ], "Stop after the zoo and one easy finish. La Jolla, Coronado and a second ticket are the first things to leave out."],
      ["Two-day first trip", "Weekend families who want one big ticket day and one easy day by the water", [
        ["Day 1: Zoo", "Follow the one-day plan. Keep dinner close to your hotel."],
        ["Day 2: Mission Bay", "A morning on the shore, with no entry ticket. The city lists swimming areas, playgrounds and public restrooms; choose your exact stop and check beach and bay status first."],
        ["Keep one break", "Protect one free afternoon. If Day 1 runs late, drop the Day 2 extras before you cut food or rest."]
      ], "Don't add both La Jolla and Coronado to Day 2."],
      ["Three-day balanced trip", "Families who want a light first day, one zoo day and one La Jolla day", [
        ["Day 1: Mission Bay or arrival", "If you land today, keep it to the shore or the hotel, and buy snacks. Don't make this a full sightseeing day."],
        ["Day 2: Zoo", "Follow the one-day plan. Zoo parking covers same-day re-entry, so a midday hotel break needs no second parking payment. Check the zoo's rules on coming back in with your ticket."],
        ["Day 3: La Jolla", "Birch Aquarium for 1.5 to 2 hours (our estimate), then the coast nearby. Its free parking is limited to 3 hours. Or swap in the Coronado ferry, from ≈ $72 round trip for four, in place of Birch's ≈ $130."]
      ], "Keep one stop optional each day, and don't try La Jolla and Coronado on the same day."]
    ],
    pivotTitle: "Change the plan for age, weather, budget or your hotel",
    pivotTableLabel: "San Diego itinerary constraint comparison. Scroll horizontally for all columns.",
    pivotHeaders: ["If this is your trip", "Keep", "Swap", "Watch for", "Check first"],
    pivots: [
      ["Younger child, nap or stroller", "One short morning stop and the protected nap", "Mission Bay, The New Children's Museum or Birch in place of a full zoo day", "The zoo's steep grades; whether the bus tour is included; La Jolla Cove's stairs (our activity guide flags them)", "Toddler guide, zoo map, meal and bathroom plan"],
      ["Teen or mixed ages", "One stop an older kid picks", "La Jolla scenery, the Coronado ferry or a food stop", "Parking still matters; fewer playground breaks", "Teen guide, ticket, parking"],
      ["Rain", "One indoor stop and a nearby meal", "Fleet Science Center, The New Children's Museum or Birch", "The zoo and beaches are mostly outdoors; Birch has an outdoor terrace", "Forecast, venue hours, and that the museum isn't on a Tuesday"],
      ["Budget trip", "One paid stop plus free time", "Mission Bay, La Jolla Cove or Balboa Park's outdoor space", "Parking, food and rentals still cost money; our activity guide flags stairs and uneven paths at La Jolla Cove", "Parking at your stop, beach and bay status"],
      ["A big theme-park day", "One park in place of the zoo", "SeaWorld (from ≈ $208) or LEGOLAND (from ≈ $276) at their lowest online prices", "A full day each, so don't add one to the zoo", "Ticket price for your date, drive, parking, height rules"],
      ["Arrival, departure or hotel location", "Keep the first and last parts of the trip near your hotel", "Move the farthest stop to the full day with the easiest way back", "Luggage, check-in time and the drive across town", "Exact address, parking and your route"]
    ],
    plansTitle: "Four rules for an easier day",
    plans: {
      "One part of town a day": "Keep the zoo and Balboa Park together, make Mission Bay its own easy block, and pick La Jolla or Coronado for the coast.",
      "Schedule the break": "Choose the meal, hotel return or nap before the day starts. If the break disappears, drop the next activity.",
      "Decide what to drop": "Move on only if everyone has eaten and the next stop can be skipped without losing a booking. A garden or pool is easier to drop than a timed ticket.",
      "Already booked something?": "Keep your bookings fixed and give each day one part of town. Cut cross-town extras first, and keep arrival and departure days light."
    },
    faqs: [
      ["How many days do families need in San Diego?", "Two or three days work best for a first family trip. One day can work if you choose the zoo plus one easy finish instead of trying to see the whole coast."],
      ["What should families skip on a short San Diego trip?", "Avoid stacking the zoo, La Jolla, Coronado and Mission Bay into one day. Parking, hills and drive time can take over the day."],
      ["What is the easiest rainy-day San Diego itinerary with kids?", "Use Birch Aquarium or a Balboa Park museum as the main stop, keep meals nearby, and save the beach or zoo for the best weather."]
    ],
    sourcesIntro: "Ticket prices read November 1, 2026 (LEGOLAND October 30); zoo hours and parking and Balboa Park parking read November 3, 2026; other official sources checked July 31, 2026. Recheck hours, tickets, weather, parking and exact routes for your dates.",
    sources: [
      ["San Diego Zoo tickets", "https://zoo.sandiegozoo.org/tickets"],
      ["San Diego Zoo plan your visit", "https://zoo.sandiegozoo.org/plan-your-visit"],
      ["San Diego Zoo parking", "https://zoo.sandiegozoo.org/parking"],
      ["Balboa Park visitor info", "https://balboapark.org/plan-your-visit/"],
      ["Balboa Park parking", "https://balboapark.org/plan-your-visit/parking/"],
      ["Birch Aquarium plan your visit", "https://aquarium.ucsd.edu/plan-your-visit"],
      ["City of San Diego Mission Bay", "https://www.sandiego.gov/park-and-recreation/parks/regional/missionbay"],
      ["City of San Diego La Jolla Cove", "https://www.sandiego.gov/lifeguards/beaches/cove"],
      ["The New Children's Museum visit", "https://thinkplaycreate.org/visit/"],
      ["Fleet Science Center hours and admission", "https://www.fleetscience.org/hours-admission"],
      ["SeaWorld San Diego offers", "https://seaworld.com/san-diego/tickets/special-offers/"],
      ["LEGOLAND California admission", "https://california-support.legoland.com/hc/en-us/articles/27043331841693-How-much-is-an-admission-ticket-to-LEGOLAND-California"],
      ["Flagship Coronado ferry routes and schedules (operator)", "https://www.flagshipsd.com/cruises/flagship-ferry"],
      ["San Diego County beach and bay status", "https://www.sandiegocounty.gov/content/sdc/deh/lwqd/beachandbay.html"],
      ["Photo license and attribution", "https://commons.wikimedia.org/wiki/File:21a-san-diego-mission-bay.jpg"]
    ]
  }
};

export const teenPages = {
  "things-to-do/chicago-with-teens.html": {
    heroPhoto: "chicago-shedd-lakefront",
    frontComparison: true,
    frontComparisonPrefix: "chi",
    frontComparisonClass: "chi-activity-glance chi-teen-glance",
    frontComparisonOrder: [0, 7, 1, 2, 3, 4, 6, 5],
    title: "Things to Do in Chicago With Teens: 8 Picks by Trip Style",
    description:
      "Compare eight things to do in Chicago with teens by interest, cost, time, weather, location, age rules, and mixed-age fit, with current official checks.",
    city: "Chicago",
    schemaName: "Chicago teen activity options",
    compactDetails: true,
    removeGeneratedAgeSections: true,
    baseReplacements: [
      ["<h1>Things to do in Chicago with teens</h1>", "<h1>Things to Do in Chicago With Teens: 8 Picks by Trip Style</h1>"],
      ["<p>A focused activity guide for teens in Chicago, with the main kids guide kept as the broader planning hub.</p>", "<p>Family-of-4 estimate (2 adults + 2 teens 14-17, prices read Nov 1, 2026): Art Institute ≈ $116 · 360 CHICAGO from ≈ $108 with tax · river cruise from ≈ $228 (season listed to Nov 22) · Lakefront Trail free.</p>"],
      ["<p><strong>Last updated:</strong> July 5, 2026</p>", "<p><strong>Attraction facts and official sources checked:</strong> July 23, 2026 <span aria-hidden=\"true\">·</span> <strong>Ticket prices checked:</strong> November 1, 2026</p>"],
      ["<p><strong>How this guide was built:</strong> Family Tripwise compares official attraction and hotel information, family logistics, search-intent research, and practical planning tradeoffs like age fit, stroller friction, weather backup, nap timing, walking distance, and lodging base.</p>", "<p>Teen fit, time, walking, weather, and flexibility labels are Family Tripwise editorial estimates; dollar prices are official prices read November 1, 2026. Check the exact ticket, event, age or height rule, weather policy, and accessibility details before committing.</p>"],
      ["<img src=\"https://commons.wikimedia.org/wiki/Special:Redirect/file/Millennium%20park%2Cchicago.JPG\" alt=\"Millennium Park in Chicago at dusk.\" loading=\"eager\" decoding=\"async\">", "<img src=\"https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Millennium_park%2Cchicago.JPG/1280px-Millennium_park%2Cchicago.JPG\" alt=\"Millennium Park in Chicago at dusk.\" width=\"1280\" height=\"960\" loading=\"eager\" decoding=\"async\">"],
      ["<figcaption>Photo: Behnazkhazai, Wikimedia Commons, CC BY-SA 3.0. <a href=\"https://commons.wikimedia.org/wiki/File:Millennium_park,chicago.JPG\">License and source</a>.</figcaption>", "<figcaption>Photo: Behnazkhazai via <a href=\"https://commons.wikimedia.org/wiki/File:Millennium_park,chicago.JPG\">Wikimedia Commons</a>, <a href=\"https://creativecommons.org/licenses/by-sa/3.0/\">CC BY-SA 3.0</a>. No editorial changes; Family Tripwise serves a resized copy.</figcaption>"]
    ],
    links: {
      allAges: "../things-to-do/chicago-with-kids.html",
      stay: "../where-to-stay/chicago-with-kids.html",
      itinerary: "../family-itinerary/chicago-with-kids.html"
    },
    quickHeading: "Five ways to let the teen shape the trip",
    quick: [
      ["Chicago story", "Architecture cruise", "A narrated moving view rewards teens who want city design, skyline photos, and context rather than another gallery."],
      ["Hands-on mission", "Griffin MSI", "Let the teen choose U-505, engineering, storms, or another current exhibit instead of trying to complete the museum."],
      ["Self-guided art", "Art Institute Teen Audio Guide", "The free official app includes stories and sounds produced by Chicago teens, giving the visit an older-kid voice and pace."],
      ["Movement and route choice", "One Lakefront Trail segment", "Agree on the mode, distance, turnaround, and photo or food goal so the teen has agency without an aimless route."],
      ["Older-kid evening", "One selected Second City show", "Live comedy can feel distinctly different from the daytime plan when the exact rating, age rule, and return timing fit."]
    ],
    comparisonNote: "Dollar prices are official prices read November 1, 2026. Time, area, format and flexibility labels are editorial estimates, not venue guarantees.",
    comparisonCostNote: "Family of 4 estimate (2 adults, 2 teens 14‑17; official prices read Nov 1, 2026): Art Institute ≈ $116; 360 CHICAGO from ≈ $108 (tax included); architecture cruise from ≈ $228 (2026 season listed to Nov 22).",
    comparisonClass: "teen-comparison ds-table chi-teen-ds",
    comparisonHeaders: ["Activity", "Teen reason", "Time", "Area / format", "Flexibility", "Check before choosing", "Pair nearby", "Cost"],
    rows: [
      ["Chicago Architecture Center river cruise", "City story, skyline photos, and a fixed narrative instead of another gallery", "About 90 min", "River North / exposed cruise", "Low", "Sailing, weather, boarding, accessibility", "Riverwalk meal", "From $57 a person; everyone needs a ticket, infants too. 2026 season listed to Nov 22"],
      ["Griffin Museum of Science and Industry", "A choose-your-mission visit built around U-505, engineering, storms, or another current exhibit", "3-5 hrs", "Hyde Park / large indoor museum", "Medium", "Admission, exhibit and add-on tickets", "Hyde Park meal", "Paid; prices did not load on the official page Nov 1; check live. Add-ons and parking extra"],
      ["Art Institute Teen Audio Guide", "Self-paced art context voiced and produced by Chicago teens", "2-3 hrs", "Loop / large indoor museum", "High", "App, galleries, admission and hours", "Millennium Park", "$32 adult, $26 ages 14-17, under 14 free; Chicago residents ages 14-17 free; some exhibitions extra; audio guide free"],
      ["360 CHICAGO and optional TILT", "Skyline and photo payoff with an opt-in physical thrill", "60-90 min", "Streeterville / contained indoor visit", "Medium", "Visibility, ticket and 42-inch TILT rule", "Magnificent Mile meal", "From $27 ages 12+, from $19 ages 3-11, tax included; varies by day and time. TILT only in combo tickets"],
      ["Wrigley Field tour or selected game", "Sports culture, stadium details, and a behind-the-scenes or live-game goal", "Tour 75-90 min, or game length", "Wrigleyville / stadium route", "Low", "Exact tour or game, weather and access", "Wrigleyville meal", "Paid; no tour price on the official page Nov 1; check live"],
      ["Lakefront Trail, one bounded segment", "Movement, route choice, skyline photos, and a teen-chosen turnaround goal", "60-120 min", "Lakefront / exposed route", "High", "Weather, closures, route, equipment and skill", "Exit-area meal", "Free; bike rental extra"],
      ["Flyover at Navy Pier", "Immersive media and a shared sensory reaction with less route navigation", "About 25-30 min (ride 8-10 min)", "Navy Pier / contained indoor visit", "Medium", "At least 40 inches tall; wind, mist, scents (official, read Nov 3); film, ticket", "Streeterville meal", "Paid; no price on the official page Nov 1; check live"],
      ["Second City, one selected show", "Live comedy, audience input, and an evening that is not built around younger kids", "Show-dependent", "Old Town / indoor seated show", "Low", "Rating, 13+ rule, adult accompaniment and fees", "Early Old Town meal", "Paid; price depends on the show; check live"]
    ],
    detailsEyebrow: "High-friction choices",
    detailsTitle: "Four choices that need an exact check",
    detailsNote: "Only the four choices with the most consequential add-on, visibility, route-skill, age, or content decisions get a deeper planning note.",
    details: [
      ["Griffin Museum of Science and Industry", "A teen can choose a mission such as U-505, engineering, storms, or another current exhibit instead of following a little-kid checklist.", "Best for teens who want hands-on science, machines, history, or a large indoor anchor.", "The museum is large, some experiences need separate timed tickets, and Hyde Park adds route time from central hotels.", "Choose two priority exhibits before arrival. Treat the U-505 on-board tour as a separate decision, not part of basic admission.", "Plan the meal and return route before museum fatigue arrives.", "Recheck admission, current exhibits, U-505 availability, accessibility, and any add-on ticket.", "Pair with one Hyde Park meal, not another major museum."],
      ["360 CHICAGO and optional TILT", "The observation deck gives a fast skyline overview; TILT adds an optional physical thrill for interested teens.", "Best for teens who actively want a high view or the add-on rather than families buying it by default.", "Low visibility, height discomfort, dynamic pricing, queues, and the separate TILT decision can reduce value.", "Check the forecast and let each person opt in or out of TILT without turning it into a courage test.", "Keep the next meal nearby because the visit's length can change with queues and interest.", "Recheck visibility, ticket terms, current hours, accessibility, and the official 42-inch TILT minimum.", "Pair with a Streeterville or Magnificent Mile meal."],
      ["Lakefront Trail, one bounded segment", "A chosen walk or bike segment gives teens movement, skyline views, and control over pace.", "Best for families that can choose an exact segment, mode, distance, and turnaround point together.", "Wind, heat, cold, rain, path congestion, bike skill, equipment, and mixing up the separate bike and pedestrian trails.", "Do not write 'bike the lakefront' as a complete plan. Pick the entry, exit, turnaround, rental, and fallback before leaving.", "Carry water and know the next restroom and meal stop for the selected segment.", "Recheck weather, closures, trail map, equipment fit, and the family's route ability.", "Pair with one beach, park, or neighborhood meal near the exit."],
      ["Second City, one selected show", "Live sketch or improv can give the evening an older-kid identity beyond dinner and a hotel return.", "Best for teens who want comedy and whose adult has reviewed the exact production together with them.", "Shows carry different ratings and content; general Chicago admission excludes children under 13 unless noted, and ages 13-17 require an adult.", "Choose the exact show, rating, time, seats, fees, and return route before buying.", "Eat early and keep the post-show plan simple.", "Recheck the production page, content rating, age rule, adult accompaniment, accessibility, fees, and runtime.", "Pair with one Old Town meal."]
    ],
    plansEyebrow: "Teen route shapes",
    plansTitle: "Build the day around one teen-chosen anchor",
    plans: {
      "One-day first visit": "Let the teen choose the architecture cruise, Griffin MSI, or Art Institute as the main anchor. Add only one nearby skyline, park, or meal block, then protect the evening from cross-city backtracking.",
      "Two-day contrast": "Day 1: architecture cruise plus Riverwalk or 360 CHICAGO. Day 2: Griffin MSI or Art Institute, followed by a bounded lakefront segment or selected evening show.",
      "Rain, cold, or low visibility": "Use Griffin MSI, the Art Institute, or one reviewed Second City show; Flyover is a short add-on. Indoor does not guarantee low walking, low stimulation, or a suitable ticket.",
      "Mixed ages": "Give the teen first choice of one anchor. Use the all-ages guide or a split block for younger siblings instead of making the teen page carry every age at once."
    },
    clusterLinks: [
      ["All-ages activity hub", "Use the broader 12-choice guide when younger siblings, grandparents, or mixed stamina change the shortlist.", "../things-to-do/chicago-with-kids.html", "Open all Chicago family activities"],
      ["Family hotel comparison", "Compare ten Chicago hotels by trip style, room setup, pool role, rough nightly total, and sampled online-review themes.", "../where-to-stay/chicago-family-hotels.html", "Compare Chicago family hotels"],
      ["Stay-area guide", "Choose the base before locking routes; exact entrances, transit, parking, room location, and evening return shape the teen plan.", "../where-to-stay/chicago-with-kids.html", "Compare Chicago stay areas"],
      ["Family itinerary", "Sequence the selected anchor around meals, weather, hotel resets, and younger siblings without building a city marathon.", "../family-itinerary/chicago-with-kids.html", "Open the Chicago family itinerary"]
    ],
    officialChecksEyebrow: "Before buying tickets",
    officialChecksTitle: "Three checks that can change a teen plan",
    officialChecks: [
      ["Exact product, not attraction name", "Griffin MSI add-ons, Wrigley tours and games, Flyover films, and Second City productions are different products. Select the exact one before checking age, content, duration, accessibility, and total price.", [["https://www.griffinmsi.org/tours/u-505-submarine-on-board-tour", "Griffin MSI U-505 tour"], ["https://www.mlb.com/cubs/ballpark/tours", "Wrigley Field tours"], ["https://www.experienceflyover.com/chicago/plan-your-visit/frequently-asked-questions/", "Flyover Chicago FAQ"], ["https://www.secondcity.com/shows/chicago", "Second City Chicago shows"]]],
      ["Weather, visibility, and route", "The architecture cruise and Lakefront Trail are exposed. 360 CHICAGO can remain open when visibility is poor. Recheck conditions and the exact route or ticket near the visit.", [["https://www.architecture.org/city-tours/river-cruise", "Chicago Architecture Center river cruise"], ["https://www.chicagoparkdistrict.com/lakefront-trail", "Chicago Park District Lakefront Trail"], ["https://360chicago.com/experience", "360 CHICAGO experience"]]],
      ["Age, height, and adult accompaniment", "The official TILT minimum is currently 42 inches. Second City generally excludes children under 13 unless noted, and ages 13-17 require an adult. Check the exact product again before buying.", [["https://360chicago.com/virtual-tilt", "360 CHICAGO TILT"], ["https://www.secondcity.com/faqs", "Second City theater FAQ"]]]
    ],
    visibleFaqs: true,
    faqTitle: "Chicago with teens FAQ",
    faqs: [
      ["How should a family choose a Chicago activity for a teen?", "Ask the teen to choose the trip's main experience type: city story, hands-on science, self-guided art, skyline or photos, sports, movement, immersive media, or live comedy. Use the comparison to test that choice against time, location, weather, and the exact ticket."],
      ["What can families do in Chicago with teens when the weather is bad?", "Use Griffin MSI, the Art Institute, or a selected show as the main indoor anchor; Flyover is a short add-on, about 25-30 minutes. Recheck tickets and routes, and remember that a large museum can still involve substantial walking."],
      ["Can teenagers explore Chicago attractions on their own?", "This guide does not make independent-roaming or safety assurances. Check the venue's minor policy, the exact route, transit conditions, time of day, and your own family's supervision plan."]
    ],
    sourcesIntro: "Official attraction, venue, park, and licensing sources checked July 23, 2026; ticket prices checked November 1, 2026. Reopen the exact ticket or event page near the visit for changing details.",
    sources: [
      ["Chicago Architecture Center river cruise", "https://www.architecture.org/city-tours/river-cruise"],
      ["Chicago Architecture Center accessibility and safety", "https://www.architecture.org/city-tours/accessibility-and-safety"],
      ["Griffin MSI U-505 on-board tour", "https://www.griffinmsi.org/tours/u-505-submarine-on-board-tour"],
      ["Griffin Museum of Science and Industry", "https://www.griffinmsi.org/about"],
      ["Art Institute Teen Audio Guide", "https://www.artic.edu/visit/who-s-visiting/teens/teen-audio-guide"],
      ["Art Institute mobile app and audio tours", "https://www.artic.edu/visit/explore-on-your-own/mobile-app-audio-tours"],
      ["360 CHICAGO experience", "https://360chicago.com/experience"],
      ["360 CHICAGO TILT", "https://360chicago.com/virtual-tilt"],
      ["Wrigley Field tours", "https://www.mlb.com/cubs/ballpark/tours"],
      ["Wrigley Field information guide", "https://www.mlb.com/cubs/ballpark/information/guide"],
      ["Chicago Park District Lakefront Trail", "https://www.chicagoparkdistrict.com/lakefront-trail"],
      ["Flyover at Navy Pier", "https://navypier.org/pier-locations/flyover/"],
      ["Flyover Chicago rider and sensory FAQ", "https://www.experienceflyover.com/chicago/plan-your-visit/frequently-asked-questions/"],
      ["Second City Chicago shows", "https://www.secondcity.com/shows/chicago"],
      ["Second City theater FAQ", "https://www.secondcity.com/faqs"],
      ["Choose Chicago activities for teens or tweens", "https://www.choosechicago.com/articles/families/top-10-chicago-must-dos-with-teens-or-tweens-2/"],
      ["Shedd Aquarium lakefront photo source and license", "https://commons.wikimedia.org/wiki/File:The_Shedd_Aquarium_-_7714039518.jpg"],
      ["CC BY 2.0 license", "https://creativecommons.org/licenses/by/2.0/"]
    ]
  },
  "things-to-do/new-york-city-with-teens.html": {
    heroPhoto: "nyc-grand-central",
    glanceFirst: true,
    admissionBudget: momaComparison(),
    transportBudget: ferryComparison(),
    paymentBudget: omnyComparison(),
    title: "Things to Do in New York City With Teens: 10 Picks by Trip Style",
    description:
      "Compare 10 things to do in New York City with teens by interest, time, cost, location, flexibility, mixed-age fit, and current official checks.",
    city: "New York City",
    schemaName: "New York City teen activity options",
    compactDetails: true,
    removeGeneratedAgeSections: true,
    baseReplacements: [
      ["<section class=\"page-hero\">", "<section id=\"nyc-teen-intro\" class=\"page-hero\">"],
      ["<h1>Things to do in New York City with teens</h1>", "<h1>New York City With Teens</h1>"],
      ["<p>A focused activity guide for teens in New York City, with the main kids guide kept as the broader planning hub.</p>", "<p>10 NYC picks teens choose. Family of 4 (2 adults, 2 teens 13-16), estimate: High Line free · ferry round trip ≈ $40 · MoMA ≈ $60 · Intrepid ≈ $152 (tickets only).</p>"],
      ["<p><strong>Last updated:</strong> July 5, 2026</p>", "<p><strong>Attraction facts and official sources checked:</strong> July 26, 2026 <span aria-hidden=\"true\">·</span> <strong>Ticket prices checked:</strong> November 1, 2026 (MoMA October 26)</p>"],
      ["<p><strong>How this guide was built:</strong> Family Tripwise compares official attraction and hotel information, family logistics, search-intent research, and practical planning tradeoffs like age fit, stroller friction, weather backup, nap timing, walking distance, and lodging base.</p>", "<p>Teen fit, time, cost, walking, flexibility, and mixed-age labels are Family Tripwise editorial estimates. Check the exact ticket, age or minor rule, content, effects, weather, access, and schedule before committing.</p>"],
      ["<img src=\"https://commons.wikimedia.org/wiki/Special:Redirect/file/Central%20Park%20New%20York%20City%20New%20York%2023%20cropped.jpg\" alt=\"A bridge and trees in Central Park, New York City.\" loading=\"eager\" decoding=\"async\">", "<img src=\"https://commons.wikimedia.org/wiki/Special:Redirect/file/Central%20Park%20New%20York%20City%20New%20York%2023%20cropped.jpg?width=1200\" alt=\"A bridge and trees in Central Park, New York City.\" width=\"1280\" height=\"894\" loading=\"lazy\" decoding=\"async\">"]
    ],
    links: {
      allAges: "../things-to-do/new-york-city-with-kids.html",
      stay: "../where-to-stay/new-york-city-with-kids.html",
      itinerary: "../family-itinerary/new-york-city-with-kids.html"
    },
    quickHeading: "Five ways to let the teen choose the anchor",
    quickNote: "Choose one older-kid payoff first. The best answer depends on interest, trip base, weather, budget, sibling fit, and the exact ticket rather than a universal top-ten order.",
    quick: [
      ["Visual city moment", "SUMMIT One Vanderbilt", "Use this for immersive rooms, skyline photos, and a contained Midtown payoff when visibility and the reflective environment fit."],
      ["Film, games, and media", "Museum of the Moving Image", "Let the teen choose Behind the Screen, Media Game Lab, Jim Henson, or a current screening instead of treating Queens as a generic museum detour."],
      ["Interactive challenge", "SPYSCAPE or SPYGAMES", "Choose the exact experience first: museum-style spy challenges and team-based physical games have different timing, effects, and rules."],
      ["Art or city story", "MoMA or Tenement Museum", "Use MoMA for self-directed art and design; use one exact Tenement tour for a fixed story and Lower East Side context."],
      ["Live or neighborhood-led day", "Broadway, Yankees, High Line, or DUMBO", "Let the teen choose live performance, sports, architecture, food, photos, or a ferry route, then keep the rest of the day nearby."]
    ],
    comparisonNote: "Dollar prices are official prices read November 1, 2026 (MoMA October 26). Time, area, format and flexibility labels are editorial estimates, not venue guarantees.",
    comparisonCostNote: "Family of 4 estimate (2 adults, 2 teens 13‑16; official prices): MoMA ≈ $60 (16 and under free); Intrepid ≈ $152; NYC Ferry to DUMBO and back ≈ $40; High Line free. Tickets only; fees and taxes extra.",
    comparisonClass: "teen-comparison ds-table nyc-teen-ds",
    comparisonHeaders: ["Activity", "Cost", "Teen reason", "Time", "Area / format", "Flexibility", "Check before choosing", "Pair nearby"],
    rows: [
      ["SUMMIT One Vanderbilt", "From $39 or $44 a person (tier not stated) + $3 online fee per order", "Immersive rooms, skyline views, photos, and a contained visual payoff", "90-150 min", "Midtown East / timed indoor-outdoor experience", "Low", summitAccess.public_copy.comparison_check, "Grand Central or early meal"],
      ["Museum of the Moving Image", "$10-20 a person + $1.50 online fee · free Thu 2-6 pm", "Film, television, games, puppetry, and media-making instead of a general museum checklist", "2-4 hrs", "Astoria, Queens / indoor museum", "High", "Hours, galleries, screening ticket, program date and Queens route", "Astoria meal"],
      ["SPYSCAPE or SPYGAMES", "SPYSCAPE from $39 adult, $34 child (ages 8+) · SPYGAMES from $39 · peak hours more · $5 on-site fee (buy online to avoid)", "Codes, observation, strategy, movement, and team challenges", "50 min-2.5 hrs", "Midtown West / indoor interactive", "Medium", spygamesAccess.public_copy.comparison_check, "Central Park South meal"],
      ["Intrepid Museum", "$38 ages 13-64, $28 ages 5-12, 4 and under free; add-ons extra", "Aircraft, carrier, space shuttle, and optional submarine mission", "3-5 hrs", "Hudson River / large mixed indoor-outdoor museum", "Medium", "Tickets, closures, deck weather and Growler 40-inch/hatch rules", "Short Hudson River walk"],
      ["MoMA", "$30 adult · 16 and under free (ticket needed) · $17 full-time student with ID", "Self-directed modern art, design, photography, film, and a teen-chosen gallery mission", "2-3 hrs", "Midtown / large indoor museum", "High", "Tickets, exhibitions, chosen floors, crowds and current hours", "Rockefeller Center or meal"],
      ["Tenement Museum, one exact tour", "$30 a person (adults, seniors, students) + $2.50 online fee · child price not listed", "Guided immigrant and neighborhood history with a fixed story rather than a huge collection", "1-2 hrs", "Lower East Side / guided apartment or walking tour", "Low", "Exact tour, recommended age, content, stairs/access and availability", "Teen-chosen Lower East Side food"],
      ["One selected Broadway show", "Price depends on the show and seats; check live", "A distinctly New York live-performance evening chosen by the teen", "Show-dependent", "Theater District / seated performance", "Low", "Production content, age/theatre rule, runtime, fees, seats and return route", "Early nearby meal"],
      ["Yankee Stadium classic tour or selected game", "No tour price on the official page Nov 1; check live", "Sports history, stadium access, or a live-game goal", "60 min tour or game length", "Bronx / stadium", "Low", "Tour versus game, schedule, weather, bags, mobile tickets and sensory needs", "Keep the Bronx block simple"],
      ["High Line and Chelsea, one bounded segment", "Free", "Architecture, public art, photos, movement, and a teen-chosen food stop", "60-120 min", "Chelsea / exposed linear park", "High", "Entry, exit, elevator status, weather, crowds and walking tolerance", "Chelsea Market or Hudson River"],
      ["NYC Ferry to DUMBO / Brooklyn Bridge Park", "$5 a person one way · under 44 in. free with an adult · 2-day unlimited $15", "Skyline movement, bridge photos, food, and neighborhood time for a lower ticket cost", "2-4 hrs", "East River and Brooklyn / exposed route", "Medium", "Route, fare, schedule, service alerts, weather and return plan", "DUMBO meal or one park pier"]
    ],
    detailsEyebrow: "High-friction choices",
    detailsTitle: "Five choices that need an exact decision",
    detailsNote: "All 10 choices are compared above. These five get more space because the ticket product, physical rule, content, visibility, or route can materially change the family's answer.",
    details: [
      ["SUMMIT One Vanderbilt", "Immersive rooms and skyline views create an obvious visual payoff, especially for a teen who wants photos.", "Best when the family values the experience enough to accept a timed premium ticket and weather-dependent visibility.", "Reflective spaces, effects, crowds, footwear rules, and poor visibility can reduce the value.", summitAccess.public_copy.detail_check, "Keep the next stop close to Grand Central and do not stack another observation deck.", "Recheck the ticket terms, visibility, effects, and current entry guidance near the visit.", "Pair with Grand Central or an early Midtown meal."],
      ["SPYSCAPE or SPYGAMES", "The museum-style spy experience and team-based physical games support different interests in strategy, movement, and competition.", "Best when the family chooses the product rather than buying an ambiguous bundle.", "Age guidance, team setup, flashing lights, physical demands, duration, and minor policies differ by product.", spygamesAccess.public_copy.detail_check, "Use comfortable clothing and keep a lower-sensory sibling alternative available when needed.", "Recheck product, age, team, effects, clothing, access, and minor guidance near the visit.", "Pair with a simple Midtown meal or Central Park South."],
      ["Intrepid Museum and Growler", "The carrier, aircraft, space shuttle, and submarine can become one coherent machine-and-history mission.", "Best for teens who actively want aviation, naval history, engineering, or space.", "Growler requires a 40-inch minimum and passing a replica hatch without assistance; narrow spaces and an early line closure can matter.", "Choose the must-see area before arrival and confirm current closures, weather, tickets, and access.", "Treat Intrepid as the day's large museum rather than a short stop before another major anchor.", "Recheck tickets, closures, deck weather, Growler access, and line status near the visit.", "Pair with a short Hudson River walk and easy meal."],
      ["Tenement Museum", "One guided story can make immigration, work, housing, and neighborhood change concrete.", "Best for a teen interested in history and conversation who accepts a fixed tour format.", "The museum is available only through guided apartment or walking tours; age guidance, themes, stairs, and availability vary.", "Select the exact tour by story, recommended age, access, duration, and current inventory.", "Use a teen-chosen Lower East Side food stop as the flexible payoff after the fixed tour.", "Recheck the selected tour's story, age guidance, access, duration, and availability.", "Pair with one Lower East Side meal, not another large museum."],
      ["Broadway or Yankee Stadium", "A chosen live show, game, or stadium tour can be the trip's strongest teen-owned anchor.", "Best when the teen picks the production or sports product and the family accepts the fixed timing.", "Content, age rules, runtime, weather, bags, ticket fees, game duration, and evening return are product-specific.", "For Broadway, check the exact production and theatre. For Yankees, choose classic tour, pregame tour, or game and note that pregame products can require a separate game ticket.", "Build the meal and return route around the event rather than adding a second timed attraction.", "Recheck the exact production, tour or game, age rule, schedule, weather, bags, fees, and return timing.", "Pair Broadway with an early Theater District meal; keep a Bronx sports day simple."]
    ],
    plansEyebrow: "Bounded teen routes",
    plansTitle: "Three route shapes with one real anchor",
    plans: {
      "Midtown visual and creative route": "Choose SUMMIT, MoMA, SPYSCAPE, or one Broadway show as the anchor. Add one teen-chosen meal and at most one short nearby walk; do not stack multiple premium timed attractions.",
      "Queens media or Brooklyn skyline route": "Use Museum of the Moving Image plus an Astoria meal, or take one NYC Ferry route to DUMBO and choose a single Brooklyn Bridge Park pier. Check the exact return before leaving Manhattan.",
      "History, sports, or West Side route": "Choose one Tenement tour, Intrepid visit, Yankee Stadium product, or bounded High Line segment. Keep the second block flexible and in the same area whenever possible."
    },
    clusterLinks: [
      ["All-ages activity hub", "Use the main 12-choice guide when younger siblings, grandparents, stroller needs, free choices, or a broad first-trip shortlist change the answer.", "./new-york-city-with-kids.html", "Open New York City things to do with kids"],
      ["Family hotel comparison", "Compare 12 named properties by room setup, approximate nightly range, area, family logistics, and bounded online review themes.", "../where-to-stay/new-york-city-family-hotels.html", "Compare New York City family hotels"],
      ["Where to stay", "Choose the lodging base before locking teen routes; Midtown, Downtown, Brooklyn, Queens, and the Upper West Side create different return patterns.", "../where-to-stay/new-york-city-with-kids.html", "Compare New York City stay areas"],
      ["Family itinerary", "Turn one teen anchor, meals, weather, and mixed-age alternatives into a realistic one-, two-, or three-day sequence.", "../family-itinerary/new-york-city-with-kids.html", "Build the New York City family itinerary"]
    ],
    officialChecksEyebrow: "Before locking the plan",
    officialChecksTitle: "Four current checks that can change the choice",
    officialChecks: [
      ["Timed, immersive, and interactive products", `${summitAccess.public_copy.official_check} ${spygamesAccess.public_copy.official_check}`, [["https://summitov.com/ticketterms/", "SUMMIT ticket terms"], ["https://summitov.com/codeofconduct/", "SUMMIT code of conduct"], ["https://spyscape.com/all-access", "SPYSCAPE all access"], ["https://spyscape.com/tickets-new-york", "SPYSCAPE and SPYGAMES tickets"]]],
      ["Museums and exact experiences", "Moving Image screenings, Intrepid's Growler, MoMA galleries, and Tenement tours have different add-ons, physical access, age guidance, or fixed formats.", [["https://movingimage.org/education/game-design-lab/", "Moving Image Media Game Lab"], ["https://intrepidmuseum.org/exhibitions/permanent-exhibitions/submarine-growler", "Intrepid Growler rules"], ["https://www.moma.org/visit/tips", "MoMA visit FAQ"], ["https://www.tenement.org/plan-a-visit/", "Tenement Museum visit planning"]]],
      ["Shows, tours, and games", "Broadway advisories belong to the exact production and theatre. Yankee Stadium classic tours, pregame products, and games are not interchangeable.", [["https://www.broadway.org/shows", "Current Broadway shows and advisories"], ["https://www.mlb.com/yankees/ballpark/tours/public", "Yankee Stadium public tours"], ["https://www.mlb.com/yankees/ballpark/information/know-before-you-go", "Yankee Stadium 2026 guide"]]],
      ["Outdoor and cross-borough routes", "High Line elevator status, NYC Ferry schedules, weather, and the chosen Brooklyn Bridge Park pier shape the route. Set your family's supervision boundaries and check the exact outbound and return route.", [["https://www.thehighline.org/visit/", "High Line visit information"], ["https://www.ferry.nyc/ticketing-info/", "NYC Ferry ticketing"], ["https://brooklynbridgepark.org/plan-your-visit/maps-and-directions/", "Brooklyn Bridge Park maps and directions"]]]
    ],
    visibleFaqs: true,
    faqTitle: "New York City with teens FAQ",
    faqs: [
      ["What are the strongest New York City choices for teens?", "Start with the teen's interest: SUMMIT for immersive skyline views, Moving Image for film and games, SPYSCAPE for interactive challenges, Intrepid for machines and space, MoMA for art and design, or a selected tour, show, sports product, or neighborhood route for a more specific payoff."],
      ["How should a mixed-age family use this page?", "Let the teen choose one anchor, then use the all-ages guide or a split plan for younger siblings when content, effects, physical rules, duration, or evening timing do not fit everyone."],
      ["Can teenagers explore New York City attractions on their own?", teenIndependenceFaq]
    ],
    sourcesIntro: "Official attraction, venue, park, city, ferry, and licensing sources checked July 26, 2026. Reopen the exact ticket, tour, show, route, and access page near the visit because inventory, prices, policies, effects, weather, and service can change.",
    sources: [
      ["SUMMIT ticket terms", "https://summitov.com/ticketterms/"],
      ["SUMMIT code of conduct", "https://summitov.com/codeofconduct/"],
      ["Museum of the Moving Image Media Game Lab", "https://movingimage.org/education/game-design-lab/"],
      ["Museum of the Moving Image tween and teen programs", "https://movingimage.org/education/tween-teen-programs/"],
      ["Museum of the Moving Image visit information", "https://movingimage.org/visit/"],
      ["SPYSCAPE all access", "https://spyscape.com/all-access"],
      ["SPYSCAPE and SPYGAMES tickets", "https://spyscape.com/tickets-new-york"],
      ["Intrepid Museum Growler", "https://intrepidmuseum.org/exhibitions/permanent-exhibitions/submarine-growler"],
      ["Intrepid Museum accessibility tools", "https://intrepidmuseum.org/resources/accessibility-tools"],
      ["MoMA visit FAQ", "https://www.moma.org/visit/tips"],
      ["MoMA family information", "https://www.moma.org/visit/families/"],
      ["Tenement Museum plan a visit", "https://www.tenement.org/plan-a-visit/"],
      ["Broadway League family guidance", "https://www.broadway.org/info/popular-new-york-broadway-shows-for-families"],
      ["Current Broadway shows and advisories", "https://www.broadway.org/shows"],
      ["Yankee Stadium public tours", "https://www.mlb.com/yankees/ballpark/tours/public"],
      ["Yankee Stadium 2026 guide", "https://www.mlb.com/yankees/ballpark/information/know-before-you-go"],
      ["High Line visit information", "https://www.thehighline.org/visit/"],
      ["NYC Parks High Line", "https://www.nycgovparks.org/parks/the-high-line"],
      ["NYC Ferry ticketing", "https://www.ferry.nyc/ticketing-info/"],
      ["NYC Ferry routes and schedules", "https://www.ferry.nyc/routes-and-schedules/"],
      ["Brooklyn Bridge Park maps and directions", "https://brooklynbridgepark.org/plan-your-visit/maps-and-directions/"],
      ["Grand Central photo source and license", "https://commons.wikimedia.org/wiki/File:Main_Concourse,_Grand_Central_Terminal,_August_30,_2024_-_001.jpg"]
    ]
  },
  "things-to-do/las-vegas-with-teens.html": {
    heroPhoto: "las-vegas",
    frontComparison: true,
    frontComparisonPrefix: "lv",
    frontComparisonClass: "lv-teen-glance",
    frontComparisonOrder: [0, 1, 2, 3, 4],
    title: "Things to Do in Las Vegas With Teens: 8 Picks by Trip Style",
    description:
      "Compare eight things to do in Las Vegas with teens by cost, why to go, time, area and what to check first, with dated official sources.",
    city: "Las Vegas",
    schemaName: "Las Vegas teen activity options",
    compactDetails: true,
    removeGeneratedAgeSections: true,
    baseReplacements: [
      ["<h1>Things to do in Las Vegas with teens</h1>", "<h1>Things to Do in Las Vegas With Teens: 8 Picks by Trip Style</h1>"],
      ["<p>A focused activity guide for teens in Las Vegas, with the main kids guide kept as the broader planning hub.</p>", "<p>Eight teen picks, from the free Bellagio fountains to Omega Mart walk-through art, with family costs where official prices exist.</p>"],
      ["<p><strong>Last updated:</strong> July 5, 2026</p>", "<p><strong>Prices and key rules checked:</strong> November 1-6, 2026, except as dated in Sources <span aria-hidden=\"true\">·</span> <strong>Bellagio and Big Apple Coaster last read:</strong> July 22, 2026 (not re-read November 6)</p>"],
      ["<p><strong>How this guide was built:</strong> Family Tripwise compares official attraction and hotel information, family logistics, search-intent research, and practical planning tradeoffs like age fit, stroller friction, weather backup, nap timing, walking distance, and lodging base.</p>", "<p>Time, area and \"why go\" labels are our estimates. Dollar prices and venue rules are official, dated in Sources. Check the exact ticket and rules before you buy.</p>"],
      ["<img src=\"https://commons.wikimedia.org/wiki/Special:Redirect/file/Bellagio%20fountain%20show%202010%20las%20vegas.JPG\" alt=\"The Bellagio fountains and Las Vegas Strip at night.\" loading=\"eager\" decoding=\"async\">", "<img src=\"https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Bellagio_fountain_show_2010_las_vegas.JPG/1280px-Bellagio_fountain_show_2010_las_vegas.JPG\" alt=\"The Bellagio fountains and Las Vegas Strip at night.\" width=\"1280\" height=\"850\" loading=\"eager\" decoding=\"async\">"],
      ["<figcaption>Photo: chensiyuan, Wikimedia Commons, CC BY-SA 4.0. <a href=\"https://commons.wikimedia.org/wiki/File:Bellagio_fountain_show_2010_las_vegas.JPG\">License and source</a>.</figcaption>", "<figcaption>Photo: Chensiyuan via <a href=\"https://commons.wikimedia.org/wiki/File:Bellagio_fountain_show_2010_las_vegas.JPG\">Wikimedia Commons</a>, <a href=\"https://creativecommons.org/licenses/by-sa/4.0/\">CC BY-SA 4.0</a>. No editorial changes; Family Tripwise serves a resized copy.</figcaption>"]
    ],
    links: {
      allAges: "../things-to-do/las-vegas-with-kids.html",
      stay: "../where-to-stay/las-vegas-with-kids.html",
      itinerary: "../family-itinerary/las-vegas-with-kids.html"
    },
    quickHeading: "Pick by what your teen likes",
    quickNote: "Start with one stop. Then check the ticket, age or height rule, weather and the ride back.",
    quick: [
      ["Immersive and unusual", "Omega Mart at AREA15", "From $45 a ticket, fees not stated; varies by date. Entering AREA15 itself is free with an online reservation; each experience has its own rules."],
      ["Outdoor contrast", "Red Rock Canyon", "Use the scenic drive or one planned stop when the teen wants desert scenery more than another resort corridor."],
      ["Thrill and games", "Big Apple Coaster and Arcade", "Coaster riders must be at least 54 inches; the arcade gives mixed-height siblings a separate option."],
      ["Flexible and lower cost", "Bellagio plus Pinball Hall of Fame", "Free fountains, then free entry to Pinball, where games cost 25¢ or 50¢ a play."],
      ["Big visual evening", "The Wizard of Oz at Sphere", "About 75 minutes, for ages 6 and up. Prefer skyline or signs? Try High Roller or the Neon Museum instead."]
    ],
    comparisonNote: "Dollar prices are official (read Nov 1 and 3, 2026). Pinball read Nov 6. Time and why-go labels are our estimates unless marked official.",
    comparisonClass: "ds-table teen-ds",
    comparisonHeaders: ["Activity", "Cost", "Why go", "Time and area", "Check first"],
    rows: [
      ["AREA15 / one exact experience", "Entry free with online reservation; Omega Mart from $45 a ticket; others vary", "Walk-through art and games", "2-4 hrs, off Strip", teenAccess.public_copy.comparison_check],
      ["Red Rock Canyon Scenic Drive", "$20 a car (BLM daily pass, read Nov 3, 2026); check any booking fee when you reserve", "Desert scenery and a break from the Strip", "Half day, west of Strip", "Oct 1-May 31: reserve online for 8 a.m.-5 p.m. entry; check weather and road"],
      ["Big Apple Coaster and Arcade", "Paid; no official price read; check live", "A real coaster, plus an arcade for siblings", "1-2 hrs, south Strip", "Coaster riders at least 54 inches (last read July 22); check weather and hours"],
      ["High Roller observation wheel", "Paid; official page showed no price Nov 6, 2026; check live", "Skyline views without a long show", "30-minute ride (official), at the LINQ", "Check ticket and cabin terms"],
      ["Pinball Hall of Fame", "Free entry; 25¢ or 50¢ a play", "Play as long or as little as you like", "1-2 hrs, south Strip", "Its site says open 10 a.m. daily to 9 p.m., 10 p.m. Fri-Sat; Travel Nevada says 11-9"],
      ["Neon Museum", "By day: $25 adult, $12.50 ages 7-17, plus a ticket fee", "Old Vegas signs and design history", "60-90 min, Downtown", "Outdoors on fine gravel; general admission closes above 105°F; rarely cancels for rain"],
      ["Bellagio Conservatory and fountains", "Free", "Classic Vegas photos with no ticket", "60-90 min, center Strip", "Check display and fountain schedules (last read July 22)"],
      ["Sphere: The Wizard of Oz", "Paid; no price on Sphere's pages Nov 6, 2026; check live at Ticketmaster", "A huge-screen show", "About 75 min (official), east of Strip", "Ages 6+; every guest needs a ticket; effects can include haptics, flashing lights, fog and wind"]
    ],
    detailsEyebrow: "Check before you buy",
    detailsTitle: "Check these before you buy",
    detailsNote: "Age, height, weather, ticket or transport details can change the plan for these picks.",
    details: [
      ["AREA15 / one exact experience", "The district offers immersive art, games, rides, and events that can feel chosen for older kids.", "Best for teens who want interactive or visual novelty and will help select the exact experience.", "The name AREA15 does not identify one product; each experience has separate age, effects, time, and ticket rules.", "Pick one experience before buying. A multi-attraction pass is not automatically better.", "Plan food or a quiet break before another loud stop.", "Check its under-18 rule, effects, hours and refunds.", "Pair with a hotel break."],
      ["Red Rock Canyon Scenic Drive", "The desert setting gives teens a genuine contrast to resort interiors and screens.", "Best for teens who value scenery, photography, geology, or a break from indoor spectacle.", "Heat, weather, limited services, driving, and trail choice can turn the same destination into a very different outing.", "Pick the drive or one stop. Do not promise a hike until you check conditions.", "Bring water; plan restrooms and food before you leave.", "Oct 1-May 31, reserve 8 a.m.-5 p.m. entry on Recreation.gov. Check road status, weather and fire rules.", "Pair with a low-key evening."],
      ["Big Apple Coaster and Arcade", "A named thrill ride gives ride-focused teens a clear reason to choose the South Strip.", "Best for teens who actively want the coaster; the arcade provides a different option for non-riders.", "Coaster riders must be at least 54 inches without footwear, operations can change with weather, and the arcade is a separate spend.", "Check each rider's height first. Non-riders can use the arcade.", "Set a play budget and pick the meal first.", "Check hours, weather, ticket terms and height.", "Pair with a New York-New York meal."],
      ["Sphere: The Wizard of Oz", "The venue can deliver the kind of large-format visual event a teen specifically asks to see.", "Best for teens who are genuinely interested in the current production rather than the building alone.", "The production, content, effects, runtime, price, and age fit change; Sphere is a venue, not one stable attraction.", "Pick the show together and price the full order before planning the night.", "Keep the meal and ride back simple around the entry time.", "Check age guidance, effects, entry rules, fees and refunds.", "Pair with one meal, not another major show."],
      ["Neon Museum", "The collection can appeal to teens interested in design, photography, signs, or Vegas history.", "Best for teens who choose visual history over rides, games, or another large show.", "It is an outdoor timed visit, so heat, wind, air quality, storms, and personal interest decide whether it is worth it.", "Choose the visit time around current conditions and keep Downtown short.", "Plan water, food, and transport before the timed entry.", "Check weather rules, photo rules, hours and ticket terms.", "Pair with an early Downtown meal."]
    ],
    plansEyebrow: "Sample plans",
    plansTitle: "Build the trip around one stop your teen picks",
    plans: {
      "One-day first visit": "Slow or pool morning, then Pinball Hall of Fame. Add the free Bellagio fountains. Swap Pinball for Big Apple Coaster or Omega Mart if your teen wants more.",
      "Two-day contrast": "Day 1: Bellagio (free) and Pinball. Day 2: Red Rock ($20 a car plus any booking fee), or Omega Mart (from ≈ $180 for 4, plus any fees) if indoors suits you better.",
      "Heat or rain": "Omega Mart, Pinball or The Wizard of Oz at Sphere. Indoors can still mean lots of walking and noise.",
      "Mixed ages": "Give the teen first choice of the main stop; let younger siblings use the arcade, hotel pool, or all-ages guide rather than forcing every family member through the same ticket."
    },
    clusterLinks: [
      ["All-ages activity hub", "Use the broader 12-choice guide when younger siblings, grandparents, or mixed stamina change the shortlist.", "../things-to-do/las-vegas-with-kids.html", "Open all Las Vegas family activities"],
      ["Family hotel comparison", "Compare ten hotels by trip style, room setup, pool role, rough nightly total, and sampled online-review themes.", "../where-to-stay/las-vegas-family-hotels.html", "Compare Las Vegas family hotels"],
      ["Stay-area guide", "Choose the trip base before locking routes; exact resort exits, transport, pool access, and room location shape the teen plan.", "../where-to-stay/las-vegas-with-kids.html", "Compare Las Vegas stay areas"],
      ["Family itinerary", "Plan the main stop around meals, weather, hotel breaks, and younger siblings without building a Strip marathon.", "../family-itinerary/las-vegas-with-kids.html", "Open the Las Vegas family itinerary"]
    ],
    officialChecksEyebrow: "Before buying tickets",
    officialChecksTitle: "Three checks that change a teen plan",
    officialChecks: [
      ["Exact attraction, not destination name", "AREA15 and Sphere contain changing experiences or productions. Select the exact ticket first, then check age, height, effects, duration, accessibility, and refund terms.", [["https://www.area15.com/visit-us", "AREA15 visit information"], ["https://www.thesphere.com/shows/wizard-of-oz-experience", "The Wizard of Oz at Sphere"]]],
      ["Weather, height, and timed entry", "Big Apple Coaster riders must be at least 54 inches; Red Rock and Neon Museum plans change with weather and operating conditions. Recheck near the visit.", [["https://newyorknewyork.mgmresorts.com/en/entertainment/the-big-apple-coaster-and-arcade.html", "Big Apple Coaster"], ["https://www.blm.gov/programs/national-conservation-lands/nevada/red-rock-canyon", "Red Rock Canyon NCA"], ["https://neonmuseum.org/faqs/", "Neon Museum visit FAQ"]]],
      ["Minor and late-night rules", `${teenAccess.public_copy.official_check} City of Las Vegas curfew for under-18s without a parent, guardian or adult with legal custody (city post May 27, 2026): school year 10 p.m.-5 a.m. Sun-Thu, midnight-5 a.m. Fri-Sat; summer and school holidays midnight-5 a.m.; Fremont Street area from 9 p.m. Fri, Sat and legal holidays. That post does not mention the Strip; check its rule separately.`, [[teenAccess.sources[0].url, "AREA15 age-policy FAQ"], [teenAccess.sources[1].url, "AREA15 Code of Conduct"], ["https://www.lasvegasnevada.gov/News/Blog/Detail/curfew-guide-for-families-what-teens-parents-need-to-know-this-summer", "City youth-curfew guide"]]]
    ],
    visibleFaqs: true,
    faqTitle: "Las Vegas with teens FAQ",
    faqs: [
      ["What are the strongest Las Vegas choices for teens?", "Start with the teen's interest: AREA15 for one selected immersive experience, Red Rock for desert scenery, Big Apple Coaster for thrills, Pinball for flexible games, or Sphere, High Roller, and Neon Museum for different kinds of visual payoff."],
      ["Can teenagers explore Las Vegas on their own?", teenAccess.public_copy.faq],
      ["How should a mixed-age family use this page?", "Let the teen choose one main stop, then use the all-ages guide, arcade, hotel break, or split plan for younger siblings instead of forcing every child through the same activity."]
    ],
    sourcesIntro: "Sphere, High Roller, Pinball, Neon Museum, AREA15 free pass and city curfew checked November 6, 2026. Red Rock read November 3. Omega Mart and Neon prices read November 1. AREA15 under-18 policy read October 9. Bellagio and Big Apple Coaster last read July 22 (older; not re-read November 6). Use the exact event or attraction page again near the visit because productions, effects, prices, hours, weather rules, and minor policies can change.",
    sources: [
      ["AREA15 age-policy FAQ (October 9, 2026)", teenAccess.sources[0].url],
      ["AREA15 Code of Conduct (October 9, 2026)", teenAccess.sources[1].url],
      ["AREA15 visit information (July 22)", "https://www.area15.com/visit-us"],
      ["AREA15 pass restrictions (July 22)", "https://www.area15.com/experiences/pass-bundles/level-1"],
      ["Omega Mart tickets (price, November 1)", "https://tickets.meowwolf.com/las-vegas/admission/timed-tickets/"],
      ["Neon Museum daytime admission (price, November 1)", "https://neonmuseum.org/whats-on/365-daytime-admission/"],
      ["AREA15 free general admission", "https://www.area15.com/experiences/pass-bundles/it-begins"],
      ["Red Rock Canyon NCA (July 22)", "https://www.blm.gov/programs/national-conservation-lands/nevada/red-rock-canyon"],
      ["Red Rock Canyon fees and planning", "https://www.blm.gov/programs/national-conservation-lands/nevada/red-rock-canyon-national-conservation-area/planning-your-visit"],
      ["Red Rock Canyon timed entry", "https://www.recreation.gov/timed-entry/10075177/ticket/10075178"],
      ["Big Apple Coaster and Arcade", "https://newyorknewyork.mgmresorts.com/en/entertainment/the-big-apple-coaster-and-arcade.html"],
      ["High Roller FAQ", "https://www.caesars.com/linq/high-roller/how-much-are-high-roller-tickets"],
      ["Pinball Hall of Fame site", "https://pinballmuseum.org/"],
      ["Pinball Hall of Fame on Travel Nevada", "https://travelnevada.com/museums/pinball-hall-of-fame/"],
      ["Neon Museum visit FAQ", "https://neonmuseum.org/faqs/"],
      ["Bellagio fountains", "https://bellagio.mgmresorts.com/en/entertainment/fountains-of-bellagio.html"],
      ["Bellagio Conservatory", "https://bellagio.mgmresorts.com/en/entertainment/conservatory-botanical-garden.html"],
      ["The Wizard of Oz at Sphere", "https://www.thesphere.com/shows/wizard-of-oz-experience"],
      ["Sphere FAQs", "https://www.thesphere.com/faqs"],
      ["City of Las Vegas youth-curfew guide", "https://www.lasvegasnevada.gov/News/Blog/Detail/curfew-guide-for-families-what-teens-parents-need-to-know-this-summer"],
      ["Las Vegas photo source and attribution", "https://commons.wikimedia.org/wiki/File:Bellagio_fountain_show_2010_las_vegas.JPG"],
      ["CC BY-SA 4.0 license", "https://creativecommons.org/licenses/by-sa/4.0/"]
    ]
  },
  "things-to-do/san-diego-with-teens.html": {
    heroPhoto: "san-diego-zoo",
    frontComparison: true,
    frontComparisonPrefix: "sdt",
    frontComparisonClass: "sd-teen-glance",
    frontComparisonOrder: [0, 3, 1, 2, 4, 5, 6],
    baseReplacements: [
      ["<h1>Things to do in San Diego with teens</h1>", "<h1>Things to Do in San Diego With Teens: Coast, Zoo, Museums and Rainy-Day Plans</h1>"],
      ["<p>Compare coast, zoo, museum, ferry, and weather-backup options by teen interest, route friction, time, and mixed-age fit.</p>", "<p>Family of 4 (2 adults, 2 teens 13-16), tickets-only estimate: La Jolla coast free · SeaWorld from ≈ $208 · San Diego Zoo ≈ $312.</p>"],
      ["<strong>Source note:</strong> Official venue links are below. Age, duration, access, nap, and route labels are Family Tripwise planning estimates; confirm current conditions before going.", "<strong>Source note:</strong> Official links are below. Route and access notes are our planning estimates."],
      ["<p><strong>Last updated:</strong> July 20, 2026</p>", "<p><strong>Ticket prices checked:</strong> November 1, 2026 <span aria-hidden=\"true\">·</span> <strong>Guide text updated:</strong> July 20, 2026</p>"]
    ],
    title: "Things to Do in San Diego With Teens: Coast, Zoo, Museums and Rainy-Day Plans",
    description:
      "Compare San Diego coast, zoo, museum, ferry, and weather-backup options for teens, with route tradeoffs and realistic one- and two-day plans.",
    city: "San Diego",
    sources: [
      ["San Diego Zoo tickets", "https://zoo.sandiegozoo.org/tickets"],
      ["San Diego Zoo plan your visit", "https://zoo.sandiegozoo.org/plan-your-visit"],
      ["Birch Aquarium plan your visit", "https://aquarium.ucsd.edu/plan-your-visit"],
      ["Balboa Park visitor info", "https://balboapark.org/"],
      ["Fleet Science Center hours and admission", "https://www.fleetscience.org/hours-admission"],
      ["SeaWorld San Diego ticket offers", "https://seaworld.com/san-diego/tickets/special-offers/"],
      ["Belmont Park tickets", "https://www.belmontpark.com/tickets-reservation"],
      ["Flagship Coronado ferry routes and schedules (operator)", "https://www.flagshipsd.com/cruises/flagship-ferry"],
      ["San Diego County beach and bay status", "https://www.sandiegocounty.gov/content/sdc/deh/lwqd/beachandbay.html"],
      ["Photo license and attribution", "https://commons.wikimedia.org/wiki/File:San_Diego_Zoo,_San_Diego,_United_States_(Unsplash_QZwf5yNopUo).jpg"]
    ],
    compactDetails: true,
    comparisonNote: "Family-of-4 figures are estimates (tickets only) from official prices read November 1, 2026. Age, time, rain and booking fields are Family Tripwise editorial estimates, not venue guarantees.",
    comparisonClass: "teen-comparison ds-table sd-teen-ds",
    comparisonHeaders: ["Activity", "Best ages", "Time", "Family of 4 cost", "Area", "OK in rain?", "Book ahead?"],
    links: {
      allAges: "../things-to-do/san-diego-with-kids.html",
      stay: "../where-to-stay/san-diego-with-kids.html",
      itinerary: "../family-itinerary/san-diego-with-kids.html"
    },
    quick: [
      ["Best coast choice", "La Jolla coast plus one meal", "Good scenery and wildlife-viewing potential if parking, walking, and weather cooperate."],
      ["Best major attraction", "San Diego Zoo highlights", "Works when teens choose zones instead of chasing every exhibit."],
      ["Best rainy-day swap", "Birch Aquarium or Balboa Park museum", "Useful backup without rebuilding the entire day."]
    ],
    rows: [
      ["La Jolla Cove / coast", "12-17", "2-4 hrs", "Free, no ticket; check parking", "La Jolla", "No", "No"],
      ["San Diego Zoo highlights", "10-17", "3-5 hrs", "≈ $312 ($78 ages 12+, any day); from ≈ $292 on select online Value Days", "Balboa Park", "No", "Check dated tickets"],
      ["Birch Aquarium", "10-15", "90 min-2 hrs", "≈ $140 online ($34.95 ages 13+); walk-up ≈ $160; 3 hours free parking", "La Jolla", "Partial", "Check tickets"],
      ["Balboa Park museums", "10-17", "2-4 hrs", "Varies by museum; Fleet Science Center ≈ $120 ($29.95 ages 13+)", "Balboa Park", "Yes", "Check exhibits"],
      ["Coronado ferry and waterfront", "10-17", "2-3 hrs", "From ≈ $72 round trip ($9 one way; no age split shown)", "Downtown / Coronado", "No", "Check ferry times"],
      ["Mission Bay beach time", "10-17", "2-3 hrs", "Free, no ticket; check parking", "Mission Bay", "No", "No"],
      ["SeaWorld San Diego", "10-17", "Full day", "From ≈ $208 ($51.99 a person online, cheapest dates); parking, tax and service fees extra", "Mission Bay", "Partial", "Check dated tickets"],
      ["Belmont Park", "10-17", "2-4 hrs", "Check live; no ride prices on the official page Nov 1. Set a ride budget", "Mission Beach", "Partial", "Check ride tickets"]
    ],
    itemDescriptions: [
      "Scenery and a more independent-feeling stop",
      "Major all-age anchor if teens choose priorities",
      "Compact weather backup near the coast",
      "Best flexible culture or rain option",
      "Scenic low-effort outing",
      "Easy downtime between bigger plans",
      "Rides, animals and shows in one full paid day",
      "Rides and boardwalk energy without a full theme-park day"
    ],
    details: [
      ["La Jolla Cove / coast", "Teens get scenery, wildlife viewing, photos, and a more independent-feeling stop.", "Best for tweens and teens who can handle crowds, stairs, and uneven coastal paths.", "Parking, crowds, stairs, slippery/uneven paths, and gear for younger siblings.", "Go early or off-peak and avoid pairing it with too many cross-town stops.", "Plan bathrooms and food before arrival so the day does not collapse after parking.", "No booking for a coast walk; verify weather, surf, closures, and parking expectations.", "Pair with Birch Aquarium or one La Jolla meal."],
      ["San Diego Zoo highlights", "The zoo still works for teens when the family chooses priority zones and skips trying to see everything.", "Best for animal-interested teens and mixed-age groups.", "Trying to see the whole zoo, heat, hills, and late starts.", "Use the bus tour or map to reduce wasted walking, then focus on a few zones.", "Food/restrooms are inside, but plan a reset before everyone is done.", "Buy/check dated tickets and current hours.", "Pair with Balboa Park, not a full La Jolla plan the same day."],
      ["Birch Aquarium", "It is compact enough for a weather backup and close enough to pair with coast time.", "Best for younger teens or mixed-age groups.", "Older teens may find it too short unless the coast is part of the plan.", "Treat it as a 90-minute anchor, not a full-day promise.", "Use La Jolla food options as the reset after the visit.", "Check ticket windows, parking, and hours.", "Pair with La Jolla Shores or Cove depending on walking tolerance."],
      ["Balboa Park museums", "The park gives options when weather, mood, or sibling ages change.", "Best for teens when they choose the museum or exhibit.", "Museum fatigue and buying too many tickets.", "Pick one paid museum and one outdoor garden or food reset.", "Verify food/restroom options near the chosen museum.", "Check current exhibits and hours.", "Pair with the zoo only if both are shortened."],
      ["Coronado ferry and waterfront", "It turns transportation into part of the outing and gives a calmer coast feel.", "Best for teens who want scenery without a packed attraction schedule.", "Ferry timing, wind, and return logistics.", "Use it from Downtown when you want a lower-effort afternoon.", "Plan dinner or snacks near either landing.", "Check ferry times and weather.", "Pair with waterfront dinner or a beach walk."]
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
    heroPhoto: "san-antonio",
    frontComparison: true,
    frontComparisonOrder: [0, 7, 1, 2, 3, 4, 6, 5],
    title: "Things to Do in San Antonio With Teens: 10 Picks by Trip Style",
    description:
      "Compare 10 things to do in San Antonio with teens by interest, time, cost, area, flexibility, mixed-age fit, and current official checks.",
    city: "San Antonio",
    schemaName: "San Antonio teen activity options",
    compactDetails: true,
    removeGeneratedAgeSections: true,
    baseReplacements: [
      ["<h1>Things to do in San Antonio with teens</h1>", "<h1>Things to Do in San Antonio With Teens: 10 Picks by Trip Style</h1>"],
      ["<p>A focused activity guide for teens in San Antonio, with the main kids guide kept as the broader planning hub.</p>", "<p>Let the older child choose one anchor. Family-of-4 estimate: a theme-park day from about $200, the Alamo exhibit about $60, plus parking, taxes and fees; four picks are free.</p>"],
      ["<p><strong>Last updated:</strong> July 5, 2026</p>", "<p><strong>Attraction facts and official sources checked:</strong> July 27, 2026 <span aria-hidden=\"true\">·</span> <strong>Ticket prices checked:</strong> November 1, 2026</p>"],
      ["<p><strong>How this guide was built:</strong> Family Tripwise compares official attraction and hotel information, family logistics, search-intent research, and practical planning tradeoffs like age fit, stroller friction, weather backup, nap timing, walking distance, and lodging base.</p>", "<p>Teen fit, time, free or paid labels, flexibility, and mixed-age labels are Family Tripwise editorial estimates. Check the exact ticket, tour, height or minor rule, effects, weather, access, schedule, and route before committing.</p>"],
      ["<img src=\"https://commons.wikimedia.org/wiki/Special:Redirect/file/The%20San%20Antonio%20River%20Walk.jpg\" alt=\"The San Antonio River Walk with paths and restaurants along the water.\" loading=\"eager\" decoding=\"async\">", "<img src=\"https://commons.wikimedia.org/wiki/Special:Redirect/file/The%20San%20Antonio%20River%20Walk.jpg?width=1280\" alt=\"The San Antonio River Walk with paths and restaurants along the water.\" width=\"1280\" height=\"960\" loading=\"eager\" decoding=\"async\" fetchpriority=\"high\">"],
      ["<figcaption>Photo: Matt Harriger, Wikimedia Commons, CC BY-SA 2.0. <a href=\"https://commons.wikimedia.org/wiki/File:The_San_Antonio_River_Walk.jpg\">License and source</a>.</figcaption>", "<figcaption>Photo: Matt Harriger via <a href=\"https://commons.wikimedia.org/wiki/File:The_San_Antonio_River_Walk.jpg\">Wikimedia Commons</a>, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC BY-SA 2.0</a>. No editorial changes; Family Tripwise serves a resized copy.</figcaption>"]
    ],
    links: {
      allAges: "./san-antonio-with-kids.html",
      stay: "../where-to-stay/san-antonio-with-kids.html",
      itinerary: "../family-itinerary/san-antonio-with-kids.html"
    },
    quickHeading: "Five ways to let the teen choose the anchor",
    quickNote: "Choose one meaningful payoff before filling the day. The answer depends on the teen's interest, exact ticket, trip base, heat, budget, and sibling fit rather than a universal ranking.",
    quick: [
      ["Adventure and physical challenge", "Natural Bridge Caverns, exact tour", "Choose a developed walking tour or an Adventure Tour only after checking age, physical demands, clothing, waiver, duration, and refund terms."],
      ["Coasters and a full park day", "Six Flags or SeaWorld", "Compare the exact ride priorities, height rules, operating calendar, heat exposure, ticket scope, and location before choosing the park."],
      ["Competitive indoor reset", "Andretti Indoor Karting & Games", "Use karting, laser tag, VR, bowling, or arcade time when the exact height, license, waiver, clothing, and price rules fit the group."],
      ["History with a defined mission", "Alamo exhibit or Mission San Jose", "Choose artifacts and one paid exhibit, or one free mission site and ranger program; do not turn five missions into a forced checklist."],
      ["Art, food, and lower-pressure city time", "Hopscotch, Pearl, River Walk, or Southtown", "Let the teen choose immersive art, a narrated cruise, a food stop, shops, photos, or a selected gallery, then keep the route bounded."]
    ],
    comparisonNote: "Dollar prices are official prices read November 1, 2026. Time, area, flexibility and mixed-age labels are editorial estimates, not venue guarantees.",
    comparisonCostNote: "Family of 4 estimate (2 adults, 2 teens 13-17): one park day from ≈ $196 (Six Flags) or from ≈ $216 (SeaWorld); Alamo exhibit ≈ $60; parking, taxes and fees extra.",
    comparisonClass: "teen-comparison ds-table sa-teen-ds",
    comparisonHeaders: ["Activity", "Teen reason", "Time", "Area / format", "Flexibility", "Check before choosing", "Pair nearby", "Cost"],
    rows: [
      ["Natural Bridge Caverns, exact tour", "Caves, geology, and an optional hands-on challenge instead of a generic sightseeing stop", "2-4 hrs plus drive", "North of city / developed or Adventure Tour", "Low", "Exact tour, minimum age, physical fit, clothing, waiver, availability, and refund rule", "Low-key meal or hotel reset", "Paid; no price on the official page Nov 1; check live. Parking $10"],
      ["Six Flags Fiesta Texas", "Coasters and thrill rides can justify one teen-owned full day", "Half-full day", "La Cantera / outdoor theme park", "Low", "Calendar, ride closures, exact height rules, weather, ticket scope, and chaperone policy", "Hotel or La Cantera meal", "From $49 a ticket for a chosen date, plus taxes and a processing fee up to $9.99 (per ticket or per order not stated)"],
      ["Andretti Indoor Karting & Games", "Competitive racing, VR, laser tag, bowling, and arcade choices work as a heat or rain pivot", "1-4 hrs", "The Rim / indoor entertainment", "High", "Exact activity, height or license rule, waiver, clothing, walk-in availability, and total spend", "The Rim or La Cantera meal", "Paid by activity; check live"],
      ["SeaWorld San Antonio", "Coasters, animal presentations, and optional water-park scope support different teen interests", "Half-full day", "Westover Hills / outdoor theme park", "Low", "Park versus Aquatica ticket, ride heights, showtimes, weather, closures, and active chaperone policy", "West-side hotel reset", "Single-Day Ticket from $53.99 (ages 3+) for a chosen date; parking, taxes and fees extra"],
      ["Alamo church and Ralston Family Collections Center", "Artifacts and one defined story give Downtown history a concrete purpose", "1-2.5 hrs", "Downtown / historic site and indoor exhibit", "Medium", "Free church reservation, exact paid exhibit, hours, entry time, content interest, and construction access", "GO RIO or early meal", "Church free (reserve); exhibit $15 adult, $11 ages 12 and under"],
      ["Mission San Jose or one selected mission", "A free World Heritage site, architecture, and self-guided or ranger context without a paid attraction", "1.5-3 hrs", "Mission Reach / mixed indoor-outdoor historic site", "Medium", "Chosen site, visitor-center and program hours, heat, high-water closures, transport, and return plan", "Southtown meal", "Free"],
      ["Hopscotch San Antonio", "Immersive installations and photos create a contained indoor visual stop", "60-90 min", "Downtown / indoor art experience", "Medium", "Advance ticket, child-ticket cutoff, adult-only hours, current installations, effects, and parking", "Travis Park or Downtown meal", "Paid; no price on the official page Nov 1; check live. Ages 3 and under free"],
      ["GO RIO narrated cruise", "A seated 35-minute orientation supplies city context without another long walking block", "About 35 min plus wait", "Downtown River Walk / open-air cruise", "Medium", "Current hours, boarding location, wait, weather, river closure, and return to the next stop", "Alamo or Downtown meal", "Paid; no price on the official pages Nov 1; check live"],
      ["Pearl and Museum Reach, one teen-chosen stop", "Food, shops, photos, market timing, and river space offer a lower-pressure reset", "1-3 hrs", "Pearl / open district and river corridor", "High", "Chosen shop, meal or event, market date, heat, parking or ride plan, and return", "SAMA or hotel reset", "Free to browse; food varies"],
      ["Southtown and Blue Star, one selected gallery or food stop", "Murals, independent spaces, photos, and food can feel more self-directed than another major attraction", "1-3 hrs", "Southtown / neighborhood block", "High", "Exact gallery or shop hours, event date, weather, parking, walking limit, and evening return", "Mission San Jose or Downtown", "Free to browse; purchases vary"]
    ],
    detailsEyebrow: "High-friction choices",
    detailsTitle: "Five choices that need an exact decision",
    detailsNote: "All 10 choices are compared above. These five get more space because the tour, ride rule, waiver, ticket scope, or minor policy can materially change the family's answer.",
    details: [
      ["Natural Bridge Caverns, exact tour", "A cave tour gives adventure-oriented teens a destination-specific reason to leave the city center.", "Best when the family chooses between a developed walking tour and a more demanding Adventure Tour before buying.", "The checked Adventure Tours list a minimum age of eight, moderate-to-hard physical demands, specific clothing, a waiver, minor accompaniment, small groups, advance payment, and restrictive refund terms.", "Open the exact tour page together and match duration, physical fit, clothing, age, and booking terms to the whole group.", "Bring the listed clothing and change-of-clothes setup when using an Adventure Tour; keep the evening light.", "Recheck exact tour inventory, requirements, weather, waiver, price, and cancellation terms near the visit.", "Pair with one meal or hotel reset."],
      ["Six Flags Fiesta Texas", "A teen who actively wants coasters may prefer one committed park day to several smaller city stops.", "Best when the must-ride list and every rider's current eligibility justify the cost and heat exposure.", "Ride-specific height and physical rules, closures, weather, operating dates, ticket products, and chaperone policies can change the usable day.", "Have the teen choose three priority rides and compare each current rule before buying.", "Treat the park as the anchor; do not add a cave tour or long Downtown block.", "Recheck calendar, ride pages, closures, height and access guide, weather, tickets, and chaperone policy.", "Pair with a simple La Cantera meal or hotel reset."],
      ["Andretti Indoor Karting & Games", "The family can choose racing, laser tag, VR, bowling, or arcade time instead of buying one broad attraction ticket.", "Best for a competitive teen and mixed-age group willing to choose the exact activity and spend limit.", "Intermediate karting currently lists a 54-inch minimum and recommended age 12; adult racing has a separate license/age rule. Minors need an adult-completed waiver, and clothing rules apply.", "Select the race or attraction first, complete the current waiver correctly, and price the group's actual choices.", "Wear flat closed-toe shoes for racing and set the arcade or activity budget before arrival.", "Recheck pricing, height or license rule, waiver, clothing, hours, and walk-in availability.", "Pair with one nearby meal."],
      ["SeaWorld San Antonio", "The same park can serve ride-focused, animal-focused, or water-park teens, but those are different days.", "Best when the family agrees on park scope and checks each priority ride or program.", "SeaWorld and Aquatica ticket scope differs; ride heights, interaction rules, weather, closures, food rules, and an active chaperone policy can affect the day.", "Choose SeaWorld only or the combined water-park product, then compare the teen's three priorities with current rules.", "Build a full-day heat and meal plan rather than treating the park as a quick add-on.", "Recheck hours, ticket scope, ride rules, showtimes, weather policy, closures, and chaperone policy.", "Pair with a west-side hotel reset."],
      ["Alamo or San Antonio Missions", "A defined artifact, architecture, or World Heritage mission gives history a concrete teen-selected purpose.", "Best when the teen chooses the Alamo exhibit or one mission site rather than receiving a long history checklist.", "The Alamo church uses a free reservation while the Collections Center is a separate paid product. NPS site, visitor-center, and ranger-program hours differ; summer heat and high-water closures can affect Mission Reach.", "Choose one product or site, confirm the exact entry and program, and limit the outdoor route to what current conditions support.", "Use one nearby meal or cruise as the flexible follow-up instead of adding another large museum.", "Recheck reservation, paid exhibit, NPS hours, programs, heat, closures, transport, and return plan.", "Pair the Alamo with GO RIO; pair Mission San Jose with Southtown."]
    ],
    plansEyebrow: "Bounded teen routes",
    plansTitle: "Three route shapes with one real anchor",
    plans: {
      "Adventure or park day": "Choose one exact Natural Bridge Caverns tour, Six Flags, or SeaWorld as the anchor. Add only a simple meal or hotel reset; do not combine two distant premium days.",
      "Downtown history and visual route": "Choose the Alamo exhibit or Hopscotch, then add GO RIO and one meal only if current entry times, weather, and walking remain practical.",
      "Missions, Southtown, or Pearl route": "Choose one mission site plus one Southtown stop, or use Pearl and Museum Reach as a food/photo reset. Confirm exact openings and the return rather than wandering across all three areas."
    },
    clusterLinks: [
      ["All-ages activity hub", "Use the 13-choice guide when younger siblings, grandparents, toddler pacing, free choices, or a broader first-trip shortlist change the answer.", "./san-antonio-with-kids.html", "Open San Antonio things to do with kids"],
      ["Family hotel comparison", "Compare 12 named properties by trip style, room setup, broad nightly range, pool or resort role, and bounded online-review observations.", "../where-to-stay/san-antonio-family-hotels.html", "Compare San Antonio family hotels"],
      ["Stay-area guide", "Choose the base before locking a teen route; Downtown, Pearl, younger-child corridors, SeaWorld, and La Cantera create different returns.", "../where-to-stay/san-antonio-with-kids.html", "Compare San Antonio stay areas"],
      ["Family itinerary", "Turn one teen-selected anchor, meals, heat, weather, and sibling alternatives into a realistic one-, two-, or three-day sequence.", "../family-itinerary/san-antonio-with-kids.html", "Build the San Antonio family itinerary"]
    ],
    officialChecksEyebrow: "Before locking the plan",
    officialChecksTitle: "Four current checks that can change the choice",
    officialChecks: [
      ["Exact cave or ride product", "Natural Bridge tour types, Six Flags rides, and SeaWorld or Aquatica products are not interchangeable. Check the selected ticket, rule, calendar, chaperone policy, and weather response.", [["https://naturalbridgecaverns.com/adventure-tour/", "Natural Bridge Adventure Tours"], ["https://www.sixflags.com/fiestatexas/frequently-asked-questions", "Six Flags FAQ"], ["https://www.sixflags.com/fiestatexas/code-of-conduct", "Six Flags park and chaperone policy"], ["https://seaworld.com/san-antonio/faq/", "SeaWorld FAQ and chaperone policy"]]],
      ["Karting, immersive art, and minor rules", "Andretti activities use different height, license, clothing, and waiver rules. Hopscotch uses advance tickets and lists child-ticket and adult-only-hour boundaries.", [["https://andrettikarting.com/sanantonio/pricing", "Andretti pricing and activity rules"], ["https://andrettikarting.com/sanantonio/faq", "Andretti FAQ"], ["https://www.letshopscotch.com/faq/", "Hopscotch FAQ"], ["https://letshopscotch.com/locations/san-antonio", "Hopscotch San Antonio hours"]]],
      ["History product and site hours", "The Alamo church, paid Collections Center, and NPS mission sites have different entry, hours, programs, heat exposure, and closure conditions.", [["https://www.thealamo.org/visit/calendar/alamo-free-timed-entry", "Alamo free church entry"], ["https://www.thealamo.org/visit/tours-and-experiences/alamo-collections-center", "Alamo Collections Center"], ["https://www.nps.gov/saan/planyourvisit/basicinfo.htm", "San Antonio Missions basic information"], ["https://www.nps.gov/saan/planyourvisit/directions.htm", "San Antonio Missions directions and conditions"]]],
      ["Cruise, district, and return plan", "GO RIO duration, boarding, and river conditions, Pearl event timing, Southtown openings, heat, parking, and the route back can change a flexible city block.", [["https://www.goriocruises.com/overview/", "GO RIO narrated cruise overview"], ["https://www.goriocruises.com/visitor-information/", "GO RIO visitor information"], ["https://www.goriocruises.com/faq/", "GO RIO FAQ"], ["https://events.atpearl.com/series/farmers-market/", "Pearl Farmers Market"], ["https://www.visitsanantonio.com/plan-your-trip/itineraries/teens/", "Visit San Antonio teen itinerary"]]]
    ],
    visibleFaqs: true,
    faqTitle: "San Antonio with teens FAQ",
    faqs: [
      ["What are useful San Antonio starting points for teens?", "Start with the teen's interest: an exact Natural Bridge cave tour for adventure, Six Flags or SeaWorld for a park day, Andretti for indoor competition, the Alamo or Mission San Jose for a defined history mission, or Hopscotch, GO RIO, Pearl, and Southtown for art, food, photos, and lower-pressure city time."],
      ["How should a mixed-age family use this page?", "Let the teen choose one anchor, then use the all-ages guide or a split plan when height, physical demands, effects, duration, ticket cost, or younger-child interests do not fit everyone."],
      ["Can teenagers visit San Antonio attractions on their own?", "This guide does not make independent-roaming or safety assurances. Check the exact venue's minor or chaperone rule, route, transport conditions, time of day, and your own family's supervision plan."]
    ],
    sourcesIntro: "Official attraction, park, historic-site, district, destination, and licensing sources checked July 27, 2026. Reopen the exact ticket, tour, ride, event, route, and policy near the visit because prices, inventory, rules, weather, hours, and access can change.",
    sources: [
      ["Natural Bridge Caverns Adventure Tours", "https://naturalbridgecaverns.com/adventure-tour/"],
      ["Six Flags Fiesta Texas FAQ", "https://www.sixflags.com/fiestatexas/frequently-asked-questions"],
      ["Six Flags Fiesta Texas accessibility", "https://www.sixflags.com/fiestatexas/accessibility"],
      ["Six Flags Fiesta Texas park and chaperone policy", "https://www.sixflags.com/fiestatexas/code-of-conduct"],
      ["Six Flags Fiesta Texas hours and calendar", "https://www.sixflags.com/fiestatexas/plan-your-visit/park-hours"],
      ["Andretti San Antonio pricing and activity rules", "https://andrettikarting.com/sanantonio/pricing"],
      ["Andretti San Antonio FAQ", "https://andrettikarting.com/sanantonio/faq"],
      ["SeaWorld San Antonio FAQ and chaperone policy", "https://seaworld.com/san-antonio/faq/"],
      ["SeaWorld San Antonio weather policy", "https://seaworld.com/san-antonio/help/inclement-weather-policy/"],
      ["Alamo free church entry", "https://www.thealamo.org/visit/calendar/alamo-free-timed-entry"],
      ["Alamo Collections Center", "https://www.thealamo.org/visit/tours-and-experiences/alamo-collections-center"],
      ["San Antonio Missions basic information", "https://www.nps.gov/saan/planyourvisit/basicinfo.htm"],
      ["San Antonio Missions directions and conditions", "https://www.nps.gov/saan/planyourvisit/directions.htm"],
      ["Hopscotch FAQ", "https://www.letshopscotch.com/faq/"],
      ["Hopscotch San Antonio hours", "https://letshopscotch.com/locations/san-antonio"],
      ["GO RIO visitor information", "https://www.goriocruises.com/visitor-information/"],
      ["GO RIO FAQ", "https://www.goriocruises.com/faq/"],
      ["GO RIO narrated cruise overview", "https://www.goriocruises.com/overview/"],
      ["Pearl Farmers Market", "https://events.atpearl.com/series/farmers-market/"],
      ["Visit San Antonio teen itinerary", "https://www.visitsanantonio.com/plan-your-trip/itineraries/teens/"],
      ["San Antonio River Walk photo source and attribution", "https://commons.wikimedia.org/wiki/File:The_San_Antonio_River_Walk.jpg"],
      ["CC BY-SA 2.0 license", "https://creativecommons.org/licenses/by-sa/2.0/"]
    ]
  }
};
