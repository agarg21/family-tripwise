import { compareCancunFamily } from "./compare.mjs";
import { cancunEvidence } from "./data.mjs";
import { childFields, renderResults } from "./render.mjs";

const form = document.querySelector("#family-form");
const fields = document.querySelector("#child-fields");
const output = document.querySelector("#family-results");
const status = document.querySelector("#comparison-status");
const buttons = form.querySelectorAll("button");
buttons.forEach(button => { button.disabled = false; });
form.hidden = false;
const trainingValue = value => value === "yes" ? true : value === "no" ? false : null;

form.elements.children.addEventListener("change", () => {
  const saved = [...fields.querySelectorAll(".child-input")].map(row => ({ age: row.querySelector("input").value, training: row.querySelector("select").value }));
  fields.innerHTML = childFields(Number(form.elements.children.value), saved);
  output.hidden = true;
  status.textContent = "Family changed. Comparison not yet updated.";
});
form.addEventListener("input", () => {
  output.hidden = true;
  status.textContent = "Details changed. Comparison not yet updated.";
});
form.addEventListener("submit", event => {
  event.preventDefault();
  const rows = [...fields.querySelectorAll(".child-input")];
  try {
    const result = compareCancunFamily({
      childAges: rows.map(row => Number(row.querySelector("input").value)),
      pottyTrained: rows.map(row => trainingValue(row.querySelector("select").value)),
      channel: form.elements.channel.value,
      nights: form.elements.nights.value === "" ? null : Number(form.elements.nights.value),
      newReservation: trainingValue(form.elements.newReservation.value)
    });
    output.innerHTML = renderResults(result);
    output.hidden = false;
    document.querySelector("#results-title").textContent = "Your family's policy checks";
    status.textContent = "Comparison updated for your party. No booking or availability confirmed.";
    output.focus();
  } catch {
    output.hidden = true;
    status.textContent = "Check the ages and booking details. A comparison could not be completed.";
  }
});
form.addEventListener("reset", () => {
  fields.innerHTML = childFields(3, [3, 7, 12].map(age => ({ age, training: "unknown" })));
  output.innerHTML = renderResults(compareCancunFamily({ childAges: [3, 7, 12] }));
  output.hidden = false;
  document.querySelector("#results-title").textContent = "Example: children aged 3, 7 and 12";
  status.textContent = "Example restored.";
});
if (new Date().toISOString().slice(0, 10) >= cancunEvidence.recheckOn) {
  document.querySelector("#freshness").textContent = `Source refresh due since ${cancunEvidence.recheckOn}. Verify all rules directly before relying on them.`;
  output.innerHTML = renderResults(compareCancunFamily({ childAges: [3, 7, 12] }));
}
