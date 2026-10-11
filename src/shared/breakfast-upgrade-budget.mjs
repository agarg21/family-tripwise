export const breakfastBudgetFields = Object.freeze(["adult_cost", "child_cost", "mornings"]);

function ordinary(value, keys) {
  return value && Object.getPrototypeOf(value) === Object.prototype &&
    Reflect.ownKeys(value).every(key => typeof key === "string" && keys.includes(key) &&
      Object.hasOwn(Object.getOwnPropertyDescriptor(value, key), "value"));
}

function cents(value) {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0 || value > 10000)
    throw new Error("Meal costs require nonnegative USD amounts with at most two decimal places");
  const scaled = value * 100;
  if (Math.abs(scaled - Math.round(scaled)) > Number.EPSILON * Math.max(1, scaled) * 8)
    throw new Error("Meal costs require nonnegative USD amounts with at most two decimal places");
  return Math.round(scaled);
}

export function assessBreakfastUpgrade(config, inputs = {}) {
  const keys = ["adults", "included_children", "upgrade_cents", "maximum_mornings"];
  if (!ordinary(config, keys) || keys.some(key => !Object.hasOwn(config, key)) ||
      !Number.isInteger(config.adults) || config.adults < 1 || config.adults > 20 ||
      !Number.isInteger(config.included_children) || config.included_children < 0 || config.included_children > 20 ||
      !Number.isSafeInteger(config.upgrade_cents) || config.upgrade_cents < 0 || config.upgrade_cents > 100000000 ||
      !Number.isInteger(config.maximum_mornings) || config.maximum_mornings < 1 || config.maximum_mornings > 366)
    throw new Error("Invalid maintained breakfast comparison basis");
  if (!ordinary(inputs, breakfastBudgetFields)) throw new Error("Provide only ordinary named breakfast inputs");
  const values = Object.fromEntries(breakfastBudgetFields.map(key => [key, inputs[key] ?? null]));
  for (const key of breakfastBudgetFields) {
    if (!Object.hasOwn(inputs, key) || inputs[key] === null) continue;
    if (key === "mornings") {
      if (!Number.isInteger(inputs[key]) || inputs[key] < 0 || inputs[key] > config.maximum_mornings)
        throw new Error("Mornings must be a whole number within the dated calendar span");
    } else cents(inputs[key]);
  }
  const missing = breakfastBudgetFields.filter(key => values[key] === null);
  const alternative = missing.length ? null : values.mornings *
    (config.adults * cents(values.adult_cost) + config.included_children * cents(values.child_cost));
  const difference = alternative === null ? null : alternative - config.upgrade_cents;
  return {
    inputs: values, missing_inputs: missing,
    alternative_cents: alternative, difference_cents: difference,
    upgrade_cents: config.upgrade_cents,
    comparison: difference === null ? "UNKNOWN" : difference === 0 ? "equal" : difference < 0 ? "below" : "above"
  };
}
