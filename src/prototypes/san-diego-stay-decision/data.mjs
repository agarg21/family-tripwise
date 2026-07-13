const unreviewedDimension = (score, note) => ({
  score,
  claimType: "model-derived",
  sourceUrl: null,
  lastChecked: null,
  reviewStatus: "needs-human-review",
  reviewer: null,
  reviewedOn: null,
  reviewNotes: note,
});

export const DIMENSIONS = {
  beach: "beach-time fit",
  attractionBalance: "activity balance",
  carLight: "car-light potential",
  quiet: "quieter reset potential",
  value: "value flexibility",
  napReset: "midday reset fit",
};

export const AREA_PROFILES = [
  {
    id: "mission-bay",
    name: "Mission Bay",
    framing: "A beach-and-reset planning hypothesis for families prioritizing water time and a contained daily rhythm.",
    dimensions: {
      beach: unreviewedDimension(5, "Verify practical beach access from the exact property."),
      attractionBalance: unreviewedDimension(4, "Verify route times for the family's actual activity list."),
      carLight: unreviewedDimension(2, "Verify walkability and transit at the property address."),
      quiet: unreviewedDimension(4, "Verify property-specific noise, event, and room-location conditions."),
      value: unreviewedDimension(2, "Compare total stay cost including parking and destination fees."),
      napReset: unreviewedDimension(5, "Verify the actual midday route from planned activities."),
    },
  },
  {
    id: "coronado",
    name: "Coronado",
    framing: "A beach-first candidate that may suit a slower itinerary when cross-city movement is not the main priority.",
    dimensions: {
      beach: unreviewedDimension(5, "Verify beach access, crossings, and seasonal conditions."),
      attractionBalance: unreviewedDimension(2, "Verify transfer time for each priority attraction."),
      carLight: unreviewedDimension(3, "Verify the exact property-to-meal and property-to-beach routes."),
      quiet: unreviewedDimension(4, "Verify property-specific room location and event noise."),
      value: unreviewedDimension(1, "Compare full price and fees for the travel dates."),
      napReset: unreviewedDimension(4, "Verify whether planned days stay near the lodging base."),
    },
  },
  {
    id: "la-jolla",
    name: "La Jolla",
    framing: "A coastal candidate for families who want scenery and local wandering, with route details still unresolved.",
    dimensions: {
      beach: unreviewedDimension(5, "Verify access type and suitability for the family's beach plan."),
      attractionBalance: unreviewedDimension(3, "Verify drive or transfer times for the chosen itinerary."),
      carLight: unreviewedDimension(3, "Verify slopes, crossings, sidewalks, and local trip distances."),
      quiet: unreviewedDimension(4, "Verify block- and property-level noise conditions."),
      value: unreviewedDimension(1, "Compare room configuration and total nightly cost."),
      napReset: unreviewedDimension(3, "Verify midday return time from priority activities."),
    },
  },
  {
    id: "downtown-little-italy",
    name: "Downtown / Little Italy",
    framing: "A car-light and dining-access hypothesis for families comfortable with a more urban base.",
    dimensions: {
      beach: unreviewedDimension(1, "Verify travel time to the family's preferred beach."),
      attractionBalance: unreviewedDimension(4, "Verify exact routes rather than relying on area-level assumptions."),
      carLight: unreviewedDimension(5, "Verify transit frequency, elevator access, sidewalks, and crossings."),
      quiet: unreviewedDimension(2, "Verify street, nightlife, construction, and room-location noise."),
      value: unreviewedDimension(3, "Compare parking needs, room size, and total property fees."),
      napReset: unreviewedDimension(3, "Verify return time from the selected activity clusters."),
    },
  },
  {
    id: "mission-valley",
    name: "Mission Valley",
    framing: "A driving-oriented, central-base hypothesis for families spreading activities across several parts of the city.",
    dimensions: {
      beach: unreviewedDimension(1, "Verify drive time and parking for specific beach visits."),
      attractionBalance: unreviewedDimension(5, "Verify routes for the actual itinerary and travel dates."),
      carLight: unreviewedDimension(1, "Verify any claimed walkability or transit access property by property."),
      quiet: unreviewedDimension(3, "Verify freeway, corridor, and room-location noise."),
      value: unreviewedDimension(4, "Compare the full stay price, parking, and room configuration."),
      napReset: unreviewedDimension(4, "Verify midday driving time from planned activities."),
    },
  },
];
