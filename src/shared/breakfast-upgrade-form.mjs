import { assessBreakfastUpgrade, breakfastBudgetFields } from "./breakfast-upgrade-budget.mjs";

const usd = cents => `USD ${(cents / 100).toFixed(2)}`;

export function breakfastBudgetMessage(result) {
  if (result.comparison === "UNKNOWN")
    return `Comparison unresolved. ${result.missing_inputs.length} of 3 inputs unknown; no complete meal-cost comparison.`;
  const difference = result.comparison === "equal" ? "Equal to" :
    `${usd(Math.abs(result.difference_cents))} ${result.comparison}`;
  return `${usd(result.alternative_cents)} hypothetical separate breakfasts for the covered guests. ` +
    `${difference} the dated ${usd(result.upgrade_cents)} plan increment. ` +
    "Not actual savings or a full-family food budget; service, credits and older-child costs remain unresolved.";
}

export function initializeBreakfastBudget(document) {
  const form = document.querySelector("#breakfast-budget-form");
  const status = document.querySelector("#breakfast-budget-status");
  const basis = document.querySelector("#breakfast-budget-basis");
  if (!form || !status || !basis) return;
  let config;
  try { config = JSON.parse(basis.textContent); assessBreakfastUpgrade(config); }
  catch { return; }
  const inputs = breakfastBudgetFields.map(key => form.elements.namedItem(key));
  if (inputs.some(input => !input)) return;
  const update = () => {
    try {
      const values = Object.fromEntries(breakfastBudgetFields.map((key, i) =>
        [key, inputs[i].value.trim() === "" ? null : Number(inputs[i].value)]));
      status.textContent = breakfastBudgetMessage(assessBreakfastUpgrade(config, values));
    } catch {
      status.textContent = "Comparison unresolved. Check whole mornings and meal amounts in USD to two decimal places.";
    }
  };
  form.addEventListener("submit", event => { event.preventDefault(); update(); });
  form.addEventListener("input", () => {
    status.textContent = "Comparison unresolved. Values changed; previous calculation no longer applies.";
  });
  form.addEventListener("reset", () => {
    status.textContent = "Comparison unresolved. All three hypothetical inputs are unknown.";
  });
  form.hidden = false;
  update();
}

if (typeof document !== "undefined") initializeBreakfastBudget(document);
