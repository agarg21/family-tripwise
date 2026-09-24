import { compareStay, renderChecks } from "./orlando-suite-model.mjs";
import { recheckOn } from "./orlando-suite-data.mjs";

const form = document.querySelector("#stay-form");
const status = document.querySelector("#stay-status");
const results = document.querySelector("#suite-results");
const heading = document.querySelector("#results-title");
const utcToday = new Date().toISOString().slice(0, 10);
if (utcToday >= recheckOn) document.querySelector("#freshness").textContent = "Source refresh is due. Reconfirm every policy and price illustration with the property.";
const hideChecks = () => {
  for (const element of document.querySelectorAll(".checks")) element.hidden = true;
  heading.textContent = "Published suite details / stay checks need updating";
};

function update(focus = false) {
  try {
    const result = compareStay({ arrival: form.elements.arrival.value, departure: form.elements.departure.value, children: Number(form.elements.children.value), car: form.elements.car.value, feeIncluded: form.elements.feeIncluded.value, asOf: utcToday });
    for (const row of result.rows) {
      const output = document.querySelector(`#${row.id}-checks`);
      output.innerHTML = renderChecks(result, row);
      output.hidden = false;
    }
    heading.textContent = `${result.people} people / ${result.nights} ${result.nights === 1 ? "night" : "nights"} / ${result.arrival} to ${result.departure}`;
    status.textContent = "Comparison updated. Published headcounts are not confirmed reservations.";
    if (focus) results.focus();
  } catch (error) {
    hideChecks();
    status.textContent = error.message;
  }
}
form.addEventListener("submit", event => { event.preventDefault(); update(true); });
form.addEventListener("input", () => { hideChecks(); status.textContent = "Inputs changed; comparison needs updating."; });
form.addEventListener("reset", () => setTimeout(() => update(), 0));
form.hidden = false;
for (const button of form.querySelectorAll("button")) button.disabled = false;
