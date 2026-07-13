import { AREA_PROFILES, DIMENSIONS } from "./data.mjs";
import { propertyChecks, scoreAreas } from "./scoring.mjs";

const form = document.querySelector("#decision-form");
const results = document.querySelector("#results");

function getPreferences(formData) {
  return {
    age: formData.get("age"),
    transport: formData.get("transport"),
    pace: formData.get("pace"),
    priority: formData.get("priority"),
    napReset: formData.has("napReset"),
    kitchenLaundry: formData.has("kitchenLaundry"),
    stroller: formData.has("stroller"),
  };
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function list(items, fallback) {
  const content = items.length ? items : [fallback];
  return `<ul>${content.map((item) => `<li>${escapeHtml(typeof item === "string" ? item : item.label)}</li>`).join("")}</ul>`;
}

function candidateCard(candidate, position) {
  const evidenceRows = Object.entries(candidate.dimensions)
    .map(([dimension, record]) => `
      <tr>
        <td>${escapeHtml(DIMENSIONS[dimension])}</td>
        <td>${record.score}/5</td>
        <td><span class="review-state">${escapeHtml(record.reviewStatus)}</span></td>
        <td>${record.sourceUrl ? `<a href="${escapeHtml(record.sourceUrl)}">source</a>` : "Not added"}</td>
        <td>${record.lastChecked || "Not checked"}</td>
        <td>${record.reviewer || "Unassigned"}</td>
      </tr>`)
    .join("");

  return `
    <article class="candidate-card${position === 0 ? " lead" : ""}">
      <div class="candidate-topline">
        <div>
          <span class="rank-label">Candidate ${position + 1}${position === 0 ? " · strongest current fit" : ""}</span>
          <h3>${escapeHtml(candidate.name)}</h3>
        </div>
        <div class="score" aria-label="Model-derived fit index ${candidate.fitIndex} out of 100">
          <strong>${candidate.fitIndex}</strong><span>/100</span><small>fit index</small>
        </div>
      </div>
      <p>${escapeHtml(candidate.framing)}</p>
      <div class="result-grid">
        <div><h4>Why it surfaced</h4>${list(candidate.reasons, "No strong match; inspect the full score breakdown.")}</div>
        <div><h4>Tradeoffs to test</h4>${list(candidate.tradeoffs, "No high-weight tradeoff was detected by the prototype.")}</div>
      </div>
      <div class="evidence-banner">
        <span>Confidence: <strong>${candidate.evidence.confidence}</strong></span>
        <span>Human-reviewed assumptions: <strong>${candidate.evidence.reviewedCount}/${candidate.evidence.assumptionCount}</strong></span>
        <span>Sourced and dated: <strong>${candidate.evidence.sourcedCount}/${candidate.evidence.assumptionCount}</strong></span>
      </div>
      <details>
        <summary>Inspect assumptions and review fields</summary>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Assumption</th><th>Value</th><th>Status</th><th>Source</th><th>Last checked</th><th>Reviewer</th></tr></thead>
            <tbody>${evidenceRows}</tbody>
          </table>
        </div>
        <p class="detail-note">All values are model-derived planning hypotheses. The record also supports review date and review notes; neither is populated in this prototype.</p>
      </details>
    </article>`;
}

function render(preferences) {
  const candidates = scoreAreas(AREA_PROFILES, preferences).slice(0, 3);
  const checks = propertyChecks(preferences);
  results.innerHTML = `
    <div class="result-warning"><strong>Low-confidence prototype output.</strong> Use this to frame research, not to choose or book an area.</div>
    <div class="result-summary">
      <p><span>Top priority</span><strong>${escapeHtml(DIMENSIONS[preferences.priority])}</strong></p>
      <p><span>Travel mode</span><strong>${escapeHtml(preferences.transport.replace("-", " "))}</strong></p>
      <p><span>Trip pace</span><strong>${escapeHtml(preferences.pace)}</strong></p>
    </div>
    <div class="candidate-list">${candidates.map(candidateCard).join("")}</div>
    <section class="checks-card">
      <p class="eyebrow">Before choosing a property</p>
      <h3>Verification checklist</h3>
      ${list(checks, "Verify the exact property details.")}
    </section>`;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  render(getPreferences(new FormData(form)));
  document.querySelector("#results-title").scrollIntoView({ behavior: "smooth", block: "start" });
});
