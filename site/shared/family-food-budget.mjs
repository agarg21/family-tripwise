export const foodBudgetFields = Object.freeze(["daily_budget", "budgeted_days"]);

function ordinary(value, keys) {
  return value && Object.getPrototypeOf(value) === Object.prototype &&
    Reflect.ownKeys(value).every(key => typeof key === "string" && keys.includes(key) &&
      Object.hasOwn(Object.getOwnPropertyDescriptor(value, key), "value"));
}

function cents(value) {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0 || value > 10000)
    throw new Error("Food budget requires a nonnegative USD amount to two decimal places");
  const scaled = value * 100;
  if (Math.abs(scaled - Math.round(scaled)) > Number.EPSILON * Math.max(1, scaled) * 8)
    throw new Error("Food budget requires a nonnegative USD amount to two decimal places");
  return Math.round(scaled);
}

export function assessFamilyFoodBudget(config, inputs = {}) {
  const keys = ["increment_cents", "maximum_days"];
  if (!ordinary(config, keys) || keys.some(key => !Object.hasOwn(config, key)) ||
      !Number.isSafeInteger(config.increment_cents) || config.increment_cents < 0 || config.increment_cents > 100000000 ||
      !Number.isInteger(config.maximum_days) || config.maximum_days < 1 || config.maximum_days > 366)
    throw new Error("Invalid maintained food comparison basis");
  if (!ordinary(inputs, foodBudgetFields)) throw new Error("Provide only ordinary named food-budget inputs");
  for (const key of foodBudgetFields) {
    if (!Object.hasOwn(inputs, key) || inputs[key] === null) continue;
    if (key === "daily_budget") cents(inputs[key]);
    else if (!Number.isInteger(inputs[key]) || inputs[key] < 0 || inputs[key] > config.maximum_days)
      throw new Error("Budgeted days must be a whole number within the dated calendar span");
  }
  const values = Object.fromEntries(foodBudgetFields.map(key => [key, inputs[key] ?? null]));
  const missing = foodBudgetFields.filter(key => values[key] === null);
  const total = missing.length ? null : cents(values.daily_budget) * values.budgeted_days;
  const difference = total === null ? null : total - config.increment_cents;
  return { inputs: values, missing_inputs: missing, alternative_cents: total, difference_cents: difference,
    increment_cents: config.increment_cents,
    comparison: difference === null ? "UNKNOWN" : difference === 0 ? "equal" : difference < 0 ? "below" : "above" };
}
