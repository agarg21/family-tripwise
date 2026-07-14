import {
  ACTIVITY_CANDIDATES,
  AGE_LABELS,
  BASE_VERIFICATION_CHECKS,
  PACE_LABELS,
  RESET_LABELS,
  TRANSPORT_LABELS,
  WEATHER_LABELS,
} from "./data.mjs";

export const DEFAULT_PREFERENCES = Object.freeze({
  age: "toddler",
  days: 3,
  reset: "fixed",
  weather: "mixed",
  transport: "rental",
  pace: "balanced",
  stroller: true,
  sensoryBreaks: false,
});

const allowed = {
  age: new Set(Object.keys(AGE_LABELS)),
  reset: new Set(Object.keys(RESET_LABELS)),
  weather: new Set(Object.keys(WEATHER_LABELS)),
  transport: new Set(Object.keys(TRANSPORT_LABELS)),
  pace: new Set(Object.keys(PACE_LABELS)),
};

function normalizeChoice(value, field) {
  return allowed[field].has(value) ? value : DEFAULT_PREFERENCES[field];
}

export function normalizePreferences(input = {}) {
  const parsedDays = Number.parseInt(input.days, 10);
  return {
    age: normalizeChoice(input.age, "age"),
    days: [1, 2, 3, 4].includes(parsedDays) ? parsedDays : DEFAULT_PREFERENCES.days,
    reset: normalizeChoice(input.reset, "reset"),
    weather: normalizeChoice(input.weather, "weather"),
    transport: normalizeChoice(input.transport, "transport"),
    pace: normalizeChoice(input.pace, "pace"),
    stroller: Boolean(input.stroller),
    sensoryBreaks: Boolean(input.sensoryBreaks),
  };
}

function dayRoles(days) {
  if (days === 1) return ["single-anchor"];
  if (days === 2) return ["major-anchor", "flex-contrast"];
  if (days === 3) return ["soft-start", "major-anchor", "flex-contrast"];
  return ["soft-start", "major-anchor", "flex-contrast", "buffer-choice"];
}

function primaryCandidate(role, preferences) {
  if (preferences.weather === "rain") return ACTIVITY_CANDIDATES.indoor;
  if (role === "soft-start" || role === "buffer-choice") return ACTIVITY_CANDIDATES.bay;
  if (role === "flex-contrast") {
    return preferences.age === "teen" ? ACTIVITY_CANDIDATES.coast : ACTIVITY_CANDIDATES.indoor;
  }
  return ACTIVITY_CANDIDATES.anchor;
}

function optionalCandidate(role, preferences) {
  if (preferences.pace === "gentle" || role === "soft-start") return ACTIVITY_CANDIDATES.base;
  if (preferences.weather === "hot") return ACTIVITY_CANDIDATES.indoor;
  if (preferences.weather === "rain") return ACTIVITY_CANDIDATES.neighborhood;
  if (role === "major-anchor" || role === "single-anchor") return ACTIVITY_CANDIDATES.neighborhood;
  return ACTIVITY_CANDIDATES.coast;
}

function resetBlock(preferences) {
  const blocks = {
    fixed: {
      label: "Protected nap or reset at the confirmed base",
      instruction: "End the morning with enough unallocated time to return or settle. Set the exact clock from the child's real schedule and verified route.",
    },
    flexible: {
      label: "Flexible midday reset",
      instruction: "Reserve a removable block after the morning candidate. Choose the exact location only after food, restroom, shade, and route checks.",
    },
    quiet: {
      label: "Quiet hour without a sleep promise",
      instruction: "Use a low-stimulation meal, room, pool, shaded area, or quiet indoor candidate after verifying that it works for this family.",
    },
    none: {
      label: "Meal and decompression buffer",
      instruction: "Protect a meal, bathroom, hydration, and decision pause even when no nap is planned.",
    },
  };
  return blocks[preferences.reset];
}

function weatherFallback(preferences) {
  if (preferences.weather === "rain") {
    return "Keep one second indoor candidate uncommitted; verify same-day hours, tickets, parking, sensory load, and travel time before switching.";
  }
  if (preferences.weather === "hot") {
    return "Move exposed activity to a verified cooler window and use indoor or lodging-base downtime midday; confirm current heat and air-quality guidance.";
  }
  if (preferences.weather === "mixed") {
    return "Hold one indoor and one outdoor candidate until the current forecast, tickets, and route are verified.";
  }
  return "Keep one contained indoor candidate available in case weather, energy, or access changes.";
}

function transportRule(preferences) {
  if (preferences.transport === "car-light") {
    return "Treat one verified walk/transit zone as the day's boundary. Test elevators, transfers, sidewalks, stroller rules, and return-to-base feasibility.";
  }
  if (preferences.transport === "rideshare") {
    return "Verify pickup/drop-off points, child-seat requirements, event restrictions, wait-time risk, and the return plan before pairing zones.";
  }
  return "Verify current drive times, parking entry/exit, fees, in/out rules, vehicle heat, and the return-to-base route before pairing zones.";
}

function ageRule(preferences) {
  const rules = {
    baby: "Keep every candidate removable; feeding, sleep, shade, carrying, and diaper needs override the template.",
    toddler: "Use one primary candidate and an easy exit; the nap/reset block overrides optional sightseeing.",
    "school-age": "Let the child choose between two verified candidates, while retaining the reset and meal buffer.",
    teen: "Offer a choice of one anchor and one food/scenery candidate; do not infer interest, independence, or supervision fit.",
    mixed: "Plan to the youngest child's reset and mobility needs, then give older children one bounded choice inside the same verified day shape.",
  };
  return rules[preferences.age];
}

function loadRule(preferences) {
  const rules = {
    gentle: "One primary candidate only; every later block stays optional.",
    balanced: "One primary candidate plus one short optional block after the reset, only if the family still has capacity.",
    full: "At most two candidate blocks around a real reset; fuller does not remove verification or make the second block mandatory.",
  };
  return rules[preferences.pace];
}

function dayTitle(role, index) {
  const names = {
    "single-anchor": "One-anchor test day",
    "soft-start": "Soft start and base test",
    "major-anchor": "Major-anchor day",
    "flex-contrast": "Flexible contrast day",
    "buffer-choice": "Buffer or family-choice day",
  };
  return `Day ${index + 1}: ${names[role]}`;
}

function makeDay(role, index, preferences) {
  const primary = primaryCandidate(role, preferences);
  const optional = optionalCandidate(role, preferences);
  const optionalAllowed = preferences.pace !== "gentle" && role !== "soft-start";

  return {
    day: index + 1,
    title: dayTitle(role, index),
    role,
    reviewStatus: "needs-human-review",
    blocks: [
      {
        period: "Morning candidate",
        label: primary.label,
        examples: primary.examples,
        reason: primary.reason,
        status: "model-derived candidate",
      },
      {
        period: "Midday protection",
        label: resetBlock(preferences).label,
        examples: "Exact place and clock remain UNKNOWN until route, lodging, and child needs are verified",
        reason: resetBlock(preferences).instruction,
        status: "family-specific verification required",
      },
      {
        period: "Later option",
        label: optionalAllowed ? optional.label : "No second activity promised",
        examples: optionalAllowed ? optional.examples : "Keep the block open for food, rest, pool, room, or an early finish",
        reason: optionalAllowed ? optional.reason : "The selected pace makes recovery more important than another model-selected stop.",
        status: "optional; needs-human-review",
      },
      {
        period: "Fallback",
        label: "Weather, energy, or access fallback",
        examples: "Choose only after same-day verification",
        reason: weatherFallback(preferences),
        status: "UNKNOWN until same-day check",
      },
    ],
    checks: [transportRule(preferences), ageRule(preferences), loadRule(preferences)],
  };
}

export function buildPacingPlan(input = {}) {
  const preferences = normalizePreferences(input);
  const roles = dayRoles(preferences.days);
  const days = roles.map((role, index) => makeDay(role, index, preferences));
  const triggeredRules = [
    `${AGE_LABELS[preferences.age]} rule: ${ageRule(preferences)}`,
    `${RESET_LABELS[preferences.reset]} rule: ${resetBlock(preferences).instruction}`,
    `${WEATHER_LABELS[preferences.weather]} rule: ${weatherFallback(preferences)}`,
    `${TRANSPORT_LABELS[preferences.transport]} rule: ${transportRule(preferences)}`,
    `${PACE_LABELS[preferences.pace]} rule: ${loadRule(preferences)}`,
  ];
  if (preferences.stroller) {
    triggeredRules.push("Stroller-sensitive rule: verify terrain, elevators, storage, transit rules, parking-to-entry distance, and every exact path.");
  }
  if (preferences.sensoryBreaks) {
    triggeredRules.push("Sensory-break rule: keep a low-stimulation exit and do not infer crowd, noise, lighting, or child tolerance from an area or attraction name.");
  }

  return {
    kind: "model-derived pacing draft",
    reviewStatus: "needs-human-review",
    personallyVerified: false,
    preferences,
    days,
    triggeredRules,
    verificationChecks: [...BASE_VERIFICATION_CHECKS],
    disclosure: "This output is a transparent planning template, not a reviewed route, attraction recommendation, safety assessment, or promise that the timing will work.",
  };
}
