import {
  AGE_LABELS,
  PACE_LABELS,
  RESET_LABELS,
  TRANSPORT_LABELS,
  WEATHER_LABELS,
} from "./data.mjs";
import { buildPacingPlan } from "./planner.mjs";

const form = document.querySelector("#pacing-form");
const results = document.querySelector("#results");

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function preferencesFrom(formData) {
  return {
    age: formData.get("age"),
    days: formData.get("days"),
    reset: formData.get("reset"),
    weather: formData.get("weather"),
    transport: formData.get("transport"),
    pace: formData.get("pace"),
    stroller: formData.has("stroller"),
    sensoryBreaks: formData.has("sensoryBreaks"),
  };
}

function renderList(items) {
  return `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
}

function renderDay(day) {
  return `<article class="day-card">
    <div class="day-card-heading">
      <div><span class="day-number">Day ${day.day}</span><h3>${escapeHtml(day.title.replace(/^Day \d+: /, ""))}</h3></div>
      <span class="review-state">${escapeHtml(day.reviewStatus)}</span>
    </div>
    <ol class="day-blocks">
      ${day.blocks.map((block) => `<li>
        <span class="block-period">${escapeHtml(block.period)}</span>
        <div><strong>${escapeHtml(block.label)}</strong><p>${escapeHtml(block.examples)}</p><small>${escapeHtml(block.reason)}</small><em>${escapeHtml(block.status)}</em></div>
      </li>`).join("")}
    </ol>
    <details>
      <summary>Why this day has this shape</summary>
      ${renderList(day.checks)}
    </details>
  </article>`;
}

function renderPlan(plan) {
  const p = plan.preferences;
  results.innerHTML = `
    <div class="result-warning"><strong>${escapeHtml(plan.kind)} · ${escapeHtml(plan.reviewStatus)}</strong><br>${escapeHtml(plan.disclosure)}</div>
    <div class="result-summary">
      <p><span>Pacing driver</span><strong>${escapeHtml(AGE_LABELS[p.age])}</strong></p>
      <p><span>Trip shape</span><strong>${p.days} day${p.days === 1 ? "" : "s"} · ${escapeHtml(PACE_LABELS[p.pace])}</strong></p>
      <p><span>Reset</span><strong>${escapeHtml(RESET_LABELS[p.reset])}</strong></p>
      <p><span>Weather case</span><strong>${escapeHtml(WEATHER_LABELS[p.weather])}</strong></p>
      <p><span>Transport case</span><strong>${escapeHtml(TRANSPORT_LABELS[p.transport])}</strong></p>
      <p><span>Personal data</span><strong>Not stored</strong></p>
    </div>
    <div class="day-list">${plan.days.map(renderDay).join("")}</div>
    <section class="rules-card"><h3>Rules triggered by your answers</h3>${renderList(plan.triggeredRules)}</section>
    <section class="checks-card"><h3>Verification gate before using the draft</h3>${renderList(plan.verificationChecks)}</section>`;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const plan = buildPacingPlan(preferencesFrom(new FormData(form)));
  renderPlan(plan);
  results.focus?.({ preventScroll: true });
  document.querySelector(".results-card")?.scrollIntoView({ behavior: "smooth", block: "start" });
});
