export const AGE_LABELS = {
  baby: "Baby",
  toddler: "Toddler",
  "school-age": "School age",
  teen: "Teen",
  mixed: "Mixed ages",
};

export const WEATHER_LABELS = {
  mild: "Mostly mild",
  hot: "Hot or high sun",
  rain: "Rain likely",
  mixed: "Mixed or uncertain",
};

export const TRANSPORT_LABELS = {
  rental: "Rental car",
  rideshare: "Rideshare",
  "car-light": "Prefer car-light",
};

export const RESET_LABELS = {
  fixed: "Fixed nap or protected reset",
  flexible: "Flexible midday reset",
  quiet: "Quiet hour without sleep",
  none: "Meal and decompression only",
};

export const PACE_LABELS = {
  gentle: "Gentle",
  balanced: "Balanced",
  full: "Fuller days",
};

export const ACTIVITY_CANDIDATES = {
  anchor: {
    label: "One major anchor candidate",
    examples: "Zoo or one Balboa Park institution",
    setting: "mixed",
    load: "high",
    reason: "Uses one larger block instead of stacking several major stops.",
  },
  indoor: {
    label: "One indoor anchor candidate",
    examples: "Aquarium or one museum",
    setting: "indoor",
    load: "medium",
    reason: "Keeps a weather-sensitive day centered on one contained option.",
  },
  bay: {
    label: "Bay, beach, or lodging-base reset candidate",
    examples: "Mission Bay-style open space, a verified beach access point, or the lodging base",
    setting: "outdoor",
    load: "low",
    reason: "Creates an easier-to-abandon block when energy or weather changes.",
  },
  coast: {
    label: "Coast or waterfront candidate",
    examples: "A verified La Jolla- or Coronado-area stop",
    setting: "outdoor",
    load: "medium",
    reason: "Adds a distinct setting without assuming a specific route or access level.",
  },
  neighborhood: {
    label: "Meal plus short neighborhood reset",
    examples: "A verified meal near the confirmed lodging or activity zone",
    setting: "mixed",
    load: "low",
    reason: "Treats food, bathrooms, and decompression as part of the schedule.",
  },
  base: {
    label: "Lodging-base downtime",
    examples: "Room, pool, or quiet common area if the exact property supports it",
    setting: "mixed",
    load: "low",
    reason: "Protects optionality instead of promising another attraction.",
  },
};

export const BASE_VERIFICATION_CHECKS = [
  "Confirm current hours, reservations, ticket rules, closures, and re-entry for every exact attraction.",
  "Test the exact property-to-activity and activity-to-meal routes for the travel dates; do not rely on area names or model timing.",
  "Verify current weather, heat, marine, air-quality, and official safety advisories before locking an outdoor block.",
  "Check the exact stroller, elevator, terrain, parking, transit, car-seat, and rideshare constraints for the family.",
  "Confirm food, restroom, shade, sensory-break, and medication needs at the exact places being considered.",
  "Have a human reviewer decide whether each candidate suits the children's current energy, interests, mobility, and supervision needs.",
];
