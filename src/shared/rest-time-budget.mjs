export const restDurationFields = Object.freeze([
  "morning_visit_minutes", "outward_journey_minutes", "room_rest_minutes",
  "return_journey_minutes", "entry_wait_minutes", "afternoon_visit_minutes"
]);

export function assessRestTimeBudget(windowMinutes, durations = {}) {
  if (windowMinutes !== null && (typeof windowMinutes !== "number" ||
      !Number.isFinite(windowMinutes) || windowMinutes <= 0 || windowMinutes > 1440))
    throw new Error("Available minutes must be positive, at most 1440, or unknown");
  if (!durations || Object.getPrototypeOf(durations) !== Object.prototype ||
      Reflect.ownKeys(durations).some(key => typeof key !== "string" ||
        !restDurationFields.includes(key) ||
        !Object.hasOwn(Object.getOwnPropertyDescriptor(durations, key), "value")))
    throw new Error("Provide only named ordinary duration inputs");
  const inputs = Object.fromEntries(restDurationFields.map(key => [key, durations[key] ?? null]));
  for (const key of restDurationFields) {
    if (Object.hasOwn(durations, key) && durations[key] !== null &&
        (typeof durations[key] !== "number" || !Number.isFinite(durations[key]) ||
         durations[key] < 0 || durations[key] > 1440))
      throw new Error(`Invalid duration: ${key}`);
  }
  const missing = restDurationFields.filter(key => inputs[key] === null);
  const known = restDurationFields.reduce((sum, key) => sum + (inputs[key] ?? 0), 0);
  const total = missing.length === 0 ? known : null;
  const balance = total !== null && windowMinutes !== null ? windowMinutes - total : null;
  // Ignore only floating-point noise at an otherwise exact time boundary.
  const remaining = balance !== null && Math.abs(balance) <=
    Number.EPSILON * Math.max(1, windowMinutes, total) * 8 ? 0 : balance;
  return {
    durations: inputs, missing_durations: missing,
    known_component_minutes: known, total_required_minutes: total,
    remaining_window_minutes: remaining,
    time_budget_status: remaining === null ? "UNKNOWN" : remaining < 0 ?
      "exceeds-published-window" : "within-published-window-only"
  };
}
