import { DIMENSIONS } from "./data.mjs";

const BASE_WEIGHTS = {
  beach: 1,
  attractionBalance: 1,
  carLight: 1,
  quiet: 1,
  value: 1,
  napReset: 1,
};

export function buildWeights(preferences) {
  const weights = { ...BASE_WEIGHTS };
  weights[preferences.priority] += 3;

  if (preferences.transport === "car-light") weights.carLight += 2.5;
  if (preferences.transport === "rideshare") weights.attractionBalance += 1;
  if (preferences.transport === "rental") weights.attractionBalance += 1.5;

  if (preferences.pace === "relaxed") {
    weights.quiet += 2;
    weights.napReset += 1;
  }
  if (preferences.pace === "full") weights.attractionBalance += 1.5;

  if (["baby", "toddler"].includes(preferences.age)) weights.napReset += 1.5;
  if (preferences.napReset) weights.napReset += 2.5;

  return weights;
}

function evidenceSummary(area) {
  const assumptions = Object.values(area.dimensions);
  const reviewed = assumptions.filter((item) => item.reviewStatus === "human-reviewed");
  const sourced = assumptions.filter((item) => item.sourceUrl && item.lastChecked);

  return {
    assumptionCount: assumptions.length,
    reviewedCount: reviewed.length,
    sourcedCount: sourced.length,
    confidence: reviewed.length === assumptions.length && sourced.length === assumptions.length ? "reviewed" : "low",
  };
}

export function scoreArea(area, preferences) {
  const weights = buildWeights(preferences);
  const entries = Object.entries(weights);
  const totalWeight = entries.reduce((sum, [, weight]) => sum + weight, 0);
  const weightedScore = entries.reduce((sum, [dimension, weight]) => {
    return sum + area.dimensions[dimension].score * weight;
  }, 0);
  const fitIndex = Math.round((weightedScore / (totalWeight * 5)) * 100);

  const rankedDimensions = entries
    .map(([dimension, weight]) => ({
      dimension,
      label: DIMENSIONS[dimension],
      score: area.dimensions[dimension].score,
      weight,
      contribution: area.dimensions[dimension].score * weight,
      evidence: area.dimensions[dimension],
    }))
    .sort((a, b) => b.contribution - a.contribution || b.weight - a.weight);

  const reasons = rankedDimensions.filter((item) => item.score >= 4).slice(0, 2);
  const tradeoffs = rankedDimensions
    .filter((item) => item.score <= 2 && item.weight >= 1.5)
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 2);

  return {
    ...area,
    fitIndex,
    reasons,
    tradeoffs,
    weights,
    evidence: evidenceSummary(area),
  };
}

export function scoreAreas(areas, preferences) {
  return areas
    .map((area, index) => ({ ...scoreArea(area, preferences), originalIndex: index }))
    .sort((a, b) => b.fitIndex - a.fitIndex || a.originalIndex - b.originalIndex);
}

export function propertyChecks(preferences) {
  const checks = [
    "Confirm the exact room layout and sleeping setup with the property.",
    "Compare the full stay cost, including parking and destination or resort fees.",
    "Verify current route times for the activities on your actual itinerary.",
    "Check recent property-level noise information and room-location options.",
  ];

  if (preferences.kitchenLaundry) checks.push("Verify kitchen equipment and guest laundry access on the official property source.");
  if (preferences.stroller) checks.push("Verify sidewalks, crossings, elevators, slopes, and stroller rules for exact routes.");
  if (preferences.napReset) checks.push("Test a midday return route before assuming the base will work for naps or resets.");

  return checks;
}
