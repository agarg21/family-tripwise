import { assessFamilyFoodBudget, foodBudgetFields } from "./family-food-budget.mjs";

const usd = cents => `USD ${(cents / 100).toFixed(2)}`;

export function foodBudgetMessage(result) {
  if (result.comparison === "UNKNOWN")
    return `Comparison unresolved. ${result.missing_inputs.length} of 2 inputs unknown; no complete food-budget comparison.`;
  const difference = result.comparison === "equal" ? "Equal to" : `${usd(Math.abs(result.difference_cents))} ${result.comparison}`;
  return `${usd(result.alternative_cents)} hypothetical whole-family food budget. ${difference} the dated ${usd(result.increment_cents)} pre-tax plan increment. ` +
    "Not actual savings or equivalent meal coverage; tax, fees, entitlements and cancellation remain unresolved.";
}

export function initializeFoodBudget(document) {
  const form = document.querySelector("#food-budget-form");
  const status = document.querySelector("#food-budget-status");
  const basis = document.querySelector("#food-budget-basis");
  if (!form || !status || !basis) return;
  let config;
  try { config = JSON.parse(basis.textContent); assessFamilyFoodBudget(config); } catch { return; }
  const inputs = foodBudgetFields.map(key => form.elements.namedItem(key));
  if (inputs.some(input => !input)) return;
  const update = () => {
    try {
      const values = Object.fromEntries(foodBudgetFields.map((key, i) =>
        [key, inputs[i].value.trim() === "" ? null : Number(inputs[i].value)]));
      status.textContent = foodBudgetMessage(assessFamilyFoodBudget(config, values));
    } catch { status.textContent = "Comparison unresolved. Check whole budgeted days and USD amounts to two decimal places."; }
  };
  form.addEventListener("submit", event => { event.preventDefault(); update(); });
  form.addEventListener("input", () => { status.textContent = "Comparison unresolved. Values changed; previous calculation no longer applies."; });
  form.addEventListener("reset", () => { status.textContent = "Comparison unresolved. Both hypothetical inputs are unknown."; });
  form.hidden = false;
  update();
}

if (typeof document !== "undefined") initializeFoodBudget(document);
