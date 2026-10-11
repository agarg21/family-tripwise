import { assessFamilyTransit } from "./family-transit-cost.mjs";

export const unresolvedRailMessage = "Rail budget unresolved. Party, ages, journeys and fare period are unknown.";
const integerValue = value => {
  const text = value.trim();
  if (!/^\d+$/.test(text)) throw new Error("A whole number is required");
  return Number(text);
};

export function readRailInputs(form) {
  const value = key => form.elements.namedItem(key)?.value ?? "";
  const count = integerValue(value("children"));
  if (count > 6) throw new Error("Child count outside form scope");
  return {
    adults: integerValue(value("adults")),
    child_ages: Array.from({ length: count }, (_, i) => integerValue(value(`child_age_${i}`))),
    rail_trips: integerValue(value("rail_trips")),
    fare_period: value("fare_period"),
    one_way_fare_cents: null,
    fare_product: "regular-pay-as-you-go"
  };
}

export function railBudgetMessage(result) {
  if (result.estimate_status === "RECHECK_SOURCE")
    return `Fare policy needs rechecking; source inspected ${result.inspected_on}. No current estimate is calculated.`;
  if (result.unresolved_child_fares)
    return `Rail budget unresolved. Dated free-fare children: ${result.free_children}; ` +
      `additional under-five fares: ${result.unresolved_child_fares}, unknown, not zero. No family total is calculated.`;
  if (result.minimum === null || result.maximum === null) return unresolvedRailMessage;
  return `Regular-fare riders: ${result.paying_riders}; dated free-fare children: ${result.free_children}. ` +
    `USD ${result.minimum.toFixed(2)}-${result.maximum.toFixed(2)} per family / ${result.rail_trips} separately charged rail journeys. ` +
    "Conditional dated network band, not a route quote. Actual fare, service and hotel return remain unverified.";
}

const easternToday = () => {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date());
  const part = name => parts.find(value => value.type === name).value;
  return `${part("year")}-${part("month")}-${part("day")}`;
};

export function initializeRailBudget(document, asOf = easternToday) {
  const form = document.querySelector("#family-rail-form");
  const status = document.querySelector("#family-rail-status");
  const config = document.querySelector("#family-rail-policy");
  const ages = document.querySelector("#family-rail-ages");
  const ageGroup = document.querySelector("#family-rail-age-group");
  if (!form || !status || !config || !ages || !ageGroup) return;
  let policy;
  try { policy = JSON.parse(config.textContent); } catch { return; }
  const children = form.elements.namedItem("children");
  if (!children) return;
  const invalidate = () => { status.textContent = "Rail budget unresolved. Values changed; previous calculation no longer applies."; };
  children.addEventListener("change", () => {
    ages.replaceChildren();
    let count;
    try { count = integerValue(children.value); } catch { count = 0; }
    ageGroup.hidden = count === 0 || count > 6;
    if (count <= 6) for (let i = 0; i < count; i++) {
      const label = document.createElement("label");
      label.textContent = `Child ${i + 1} age`;
      const input = document.createElement("input");
      input.type = "number";
      input.name = `child_age_${i}`;
      input.id = `rail-child-age-${i}`;
      label.htmlFor = input.id;
      input.min = "0";
      input.max = "17";
      input.step = "1";
      input.inputMode = "numeric";
      input.autocomplete = "off";
      input.required = true;
      label.append(input);
      ages.append(label);
    }
    invalidate();
  });
  form.addEventListener("input", invalidate);
  form.addEventListener("change", invalidate);
  form.addEventListener("submit", event => {
    event.preventDefault();
    try { status.textContent = railBudgetMessage(assessFamilyTransit(policy, readRailInputs(form), asOf())); }
    catch { status.textContent = "Rail budget unresolved. Check the party, every child age, journey count and fare period."; }
  });
  form.addEventListener("reset", () => {
    ages.replaceChildren();
    ageGroup.hidden = true;
    status.textContent = unresolvedRailMessage;
  });
  form.hidden = false;
  status.textContent = unresolvedRailMessage;
}

if (typeof document !== "undefined") initializeRailBudget(document);
