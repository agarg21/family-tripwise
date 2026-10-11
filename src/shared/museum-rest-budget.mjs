import { assessRestTimeBudget, restDurationFields } from "./rest-time-budget.mjs";

export function restBudgetMessage(result) {
  const display = minutes => Number(minutes.toPrecision(12));
  if (result.remaining_window_minutes === null) {
    return `Time budget unresolved. ${display(result.known_component_minutes)} known minutes; ` +
      `${result.missing_durations.length} of 6 durations missing. ` +
      "Available minutes and every duration are needed for a complete sum.";
  }
  const remaining = result.remaining_window_minutes;
  const unit = Math.abs(remaining) === 1 ? "minute" : "minutes";
  const balance = remaining < 0 ? `${display(Math.abs(remaining))} ${unit} over the available time` :
    remaining === 0 ? "No spare minutes" : `${display(remaining)} ${unit} remaining`;
  return `${balance}. ${display(result.total_required_minutes)} planned minutes. ` +
    "Conditional arithmetic only; hotel return and re-entry remain unverified.";
}

export function initializeRestBudget(document) {
  const form = document.querySelector("#rest-budget-form");
  const status = document.querySelector("#rest-budget-status");
  if (!form || !status) return;
  const window = form.elements.namedItem("available_minutes");
  const inputs = restDurationFields.map(key => form.elements.namedItem(key));
  if (!window || inputs.some(input => !input)) return;
  const read = input => input.value.trim() === "" ? null : Number(input.value);
  const update = () => {
    try {
      const result = assessRestTimeBudget(read(window),
        Object.fromEntries(restDurationFields.map((key, index) => [key, read(inputs[index])])));
      status.textContent = restBudgetMessage(result);
    } catch {
      status.textContent = "Time budget unresolved. Check the available minutes and duration values.";
    }
  };
  form.addEventListener("submit", event => { event.preventDefault(); update(); });
  form.addEventListener("input", () => {
    status.textContent = "Time budget unresolved. Values changed; previous calculation no longer applies.";
  });
  form.addEventListener("reset", () => {
    status.textContent = "Time budget unresolved. Available minutes and all six durations are unknown.";
  });
  form.hidden = false;
  update();
}

if (typeof document !== "undefined") initializeRestBudget(document);
